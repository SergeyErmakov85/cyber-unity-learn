/** npm run audit:browser запускает локальный сайт и проверяет отрисованные страницы.
 * AUDIT_BASE_URL, AUDIT_REPORT, CHROMIUM_EXECUTABLE_PATH — необязательные настройки.
 * Внешние сервисы при обходе не вызываются; авторизация и записи в БД не проверяются.
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const base = process.env.AUDIT_BASE_URL || "http://127.0.0.1:8080";
const output = process.env.AUDIT_REPORT || "browser-link-audit.json.local";
const downloads = new Map();
const workerCount = Number(process.env.AUDIT_WORKERS || 3);
if (!Number.isInteger(workerCount) || workerCount < 1) {
  throw new Error("AUDIT_WORKERS должно быть положительным целым числом");
}
let server;
if (process.argv.includes("--serve")) {
  // Только для изолированного обхода, без производственных ключей и аккаунтов.
  process.env.VITE_SUPABASE_URL = "http://127.0.0.1:9";
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY = "audit-public-key";
  const { createServer } = await import("vite");
  server = await createServer({
    server: {
      host: "127.0.0.1",
      port: new URL(base).port ? Number(new URL(base).port) : 8080,
      strictPort: true,
    },
  });
  await server.listen();
}
try {
  await fetch(base, { signal: AbortSignal.timeout(10000) });
} catch (error) {
  await server?.close();
  throw new Error(
    `Сайт недоступен: ${base}. Запустите dev-сервер или передайте --serve.`,
    { cause: error },
  );
}
const app = readFileSync("src/App.tsx", "utf8");
const routes = new Set([...app.matchAll(/path="([^":*]+)"/g)].map((m) => m[1]));
const index = readFileSync("src/content/textbook/index.generated.ts", "utf8");
for (const m of index.matchAll(/"route": "([^"]+)"/g)) routes.add(m[1]);
const partsSource = readFileSync("src/content/textbook/parts.ts", "utf8");
const mathParts = new Map(
  [
    ...partsSource.matchAll(/sitePartId: "([^"]+)",\s*hubRoute: "([^"]+)"/g),
  ].map((m) => [m[2], m[1]]),
);
for (const m of partsSource.matchAll(/segment: "([^"]+)"/g))
  routes.add(`/math-rl/textbook/${m[1]}`);
for (const m of readFileSync("src/content/hubs.ts", "utf8").matchAll(
  /slug: "([^"]+)"/g,
))
  routes.add(`/hub/${m[1]}`);
let browser;
try {
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await context.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (
      url.origin === new URL(base).origin ||
      ["data:", "blob:"].includes(url.protocol)
    )
      return route.continue();
    // Изолированный обход: пустые ответы вместо запросов аналитики/БД.
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "[]",
    });
  });
  const results = [];
  const queue = [...routes];
  async function worker() {
    const page = await context.newPage();
    while (queue.length) {
      const path = queue.shift();
      const errors = [];
      const onError = (error) => errors.push(error.message);
      page.on("pageerror", onError);
      const ids = new Set(),
        links = new Map(),
        duplicates = new Set(),
        mathErrors = new Set();
      let partIds = {};
      const collect = async () => {
        const state = await page.evaluate(() => ({
          ids: [...document.querySelectorAll("[id]")].map((e) => e.id),
          links: [...document.querySelectorAll("a[href]")].map((e) => ({
            href: e.getAttribute("href"),
            text: (e.textContent || "").trim().slice(0, 100),
          })),
          math: [...document.querySelectorAll(".katex-error")].map(
            (e) => e.getAttribute("title") || e.textContent,
          ),
        }));
        const seen = new Set();
        for (const id of state.ids) {
          if (seen.has(id)) duplicates.add(id);
          seen.add(id);
          ids.add(id);
        }
        for (const l of state.links) links.set(l.href + "\0" + l.text, l);
        for (const error of state.math) mathErrors.add(error);
      };
      try {
        const response = await page.goto(base + path, {
          waitUntil: "networkidle",
          timeout: 60000,
        });
        if (!response?.ok())
          throw new Error(`HTTP ${response?.status() ?? "нет ответа"}`);
        await page.waitForFunction(
          () =>
            document
              .querySelector("h1, h2, h3, main, form")
              ?.textContent?.trim().length > 0,
          {},
          { timeout: 20000 },
        );
        await collect();
        // Для маршрута части ждём её контент. На обзорной странице открываем все части.
        const part = mathParts.get(path);
        const partsToVisit = part ? [part] : [...mathParts.values()];
        for (const partId of partsToVisit) {
          const button = page.locator(`#${partId} > button`);
          if (!(await button.count())) continue;
          const scope = page.locator(`[data-symbol-scope="${partId}"]`);
          if (!(await scope.count())) await button.dispatchEvent("click");
          await scope
            .locator('section[id]:not([id^="symbols-"])')
            .first()
            .waitFor({ state: "attached" });
          partIds[partId] = [
            partId,
            ...(await scope
              .locator("[id]")
              .evaluateAll((elements) =>
                elements.map((element) => element.id),
              )),
          ];
        }
        await collect();
        // Вкладки и аккордеоны могут содержать дополнительные источники.
        const tabs = page.getByRole("tab");
        for (let i = 0; i < (await tabs.count()); i++) {
          if (await tabs.nth(i).isVisible()) {
            await tabs.nth(i).click({ force: true });
            await page.waitForTimeout(100);
            await collect();
          }
        }
        const triggers = page.locator(
          'button[aria-expanded="false"][aria-controls]:not([aria-haspopup])',
        );
        const expanded = new Set();
        for (let i = 0; i < 100; i++) {
          const controls = await triggers.evaluateAll((elements) =>
            elements.map((e) => e.getAttribute("aria-controls")),
          );
          const next = controls.findIndex((id) => !expanded.has(id));
          if (next < 0) break;
          expanded.add(controls[next]);
          const button = triggers.nth(next);
          if (!(await button.isVisible())) continue;
          await button.dispatchEvent("click");
          await page.waitForTimeout(80);
          await collect();
        }
        await collect();
        results.push({
          path,
          actualPath: new URL(page.url()).pathname,
          title: await page.title(),
          ids: [...ids],
          partIds,
          links: [...links.values()],
          duplicates: [...duplicates],
          mathErrors: [...mathErrors],
          errors,
        });
      } catch (error) {
        results.push({
          path,
          errors: [...errors, error.message],
          ids: [...ids],
          links: [...links.values()],
        });
      }
      page.off("pageerror", onError);
      writeFileSync(output, JSON.stringify({ base, results }, null, 2));
      console.log(
        `${results.length}/${routes.size} ${path} (${links.size} links, ${errors.length} errors)`,
      );
    }
    await page.close();
  }
  await Promise.all(Array.from({ length: workerCount }, worker));
  const byPath = new Map(results.map((r) => [r.path, r]));
  const issues = [];
  const external = new Map();
  const ownHosts = new Set([
    new URL(base).host,
    "rl-cuber-unity-code.com",
    "www.rl-cuber-unity-code.com",
  ]);
  for (const page of results) {
    for (const error of page.errors)
      issues.push({ type: "PAGE", from: page.path, error });
    for (const error of page.mathErrors || [])
      issues.push({ type: "MATH", from: page.path, error });
    for (const { href, text } of page.links) {
      if (!href || /^(mailto:|tel:|blob:|data:)/.test(href)) continue;
      const url = new URL(href, base + (page.actualPath || page.path));
      if (!ownHosts.has(url.host)) {
        if (!external.has(url.href)) external.set(url.href, []);
        external.get(url.href).push({ from: page.path, text });
        continue;
      }
      if (href === "#") {
        issues.push({ type: "EMPTY", from: page.path, href, text });
        continue;
      }
      let target = byPath.get(url.pathname);
      if (!target) {
        if (!downloads.has(url.pathname)) {
          const file = resolve(
            "public",
            "." + decodeURIComponent(url.pathname),
          );
          let available =
            file.startsWith(
              resolve("public") + (process.platform === "win32" ? "\\" : "/"),
            ) && statSync(file, { throwIfNoEntry: false })?.isFile();
          if (available) {
            const response = await fetch(new URL(url.pathname, base), {
              method: "HEAD",
              signal: AbortSignal.timeout(10000),
            });
            available =
              response.ok &&
              !response.headers.get("content-type")?.startsWith("text/html");
          }
          downloads.set(url.pathname, available);
        }
        if (!downloads.get(url.pathname))
          issues.push({ type: "ROUTE", from: page.path, href, text });
        continue;
      }
      if (target.actualPath && target.actualPath !== target.path)
        target = byPath.get(target.actualPath) || target;
      let anchor = url.hash.slice(1);
      try {
        anchor = decodeURIComponent(anchor);
      } catch {
        /* literal % */
      }
      const part = !href.startsWith("#") && mathParts.get(url.pathname);
      const targetIds = part ? (target.partIds?.[part] ?? []) : target.ids;
      if (anchor && !targetIds.includes(anchor))
        issues.push({ type: "ANCHOR", from: page.path, href, text });
    }
  }
  writeFileSync(
    output,
    JSON.stringify(
      {
        base,
        results,
        issues,
        external: [...external].map(([url, sources]) => ({ url, sources })),
      },
      null,
      2,
    ),
  );
  console.log(`Проверено файлов для скачивания: ${downloads.size}`);
  console.log(
    `Pages: ${results.length}; issues: ${issues.length}; external URLs: ${external.size}; report: ${resolve(output)}`,
  );
  for (const issue of issues)
    console.error(issue.type, issue.from, issue.href || issue.error);
  if (issues.length) process.exitCode = 1;
} finally {
  await browser?.close();
  await server?.close();
}
