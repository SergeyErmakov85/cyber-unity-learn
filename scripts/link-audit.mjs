/** Статический аудит маршрутов и якорей в контексте страницы назначения.
 * Динамическую разметку дополнительно проверяет npm run audit:browser.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, resolve, relative, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => readFileSync(join(ROOT, f), "utf8");
const files = [];
function walk(dir) {
  for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const f = dir + "/" + e.name;
    if (e.isDirectory()) walk(f);
    else if (/\.tsx?$/.test(f)) files.push(f);
  }
}
walk("src");
const parsed = new Map();
const literal = (node) =>
  node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    ? node.text
    : undefined;
const unbox = (node) =>
  node && ts.isJsxExpression(node) ? node.expression : node;
const name = (node) => node?.getText().replace(/^['"]|['"]$/g, "");
const resolveImport = (from, to) => {
  if (!to?.startsWith(".") && !to?.startsWith("@/")) return;
  const p = to.startsWith("@/")
    ? "src/" + to.slice(2)
    : relative(ROOT, resolve(ROOT, dirname(from), to)).replaceAll("\\", "/");
  return [p, p + ".tsx", p + ".ts", p + "/index.tsx", p + "/index.ts"].find(
    (f) => existsSync(join(ROOT, f)) && /\.tsx?$/.test(f),
  );
};
const { outputText: slugModule } = ts.transpileModule(read("src/lib/slug.ts"), {
  compilerOptions: { module: ts.ModuleKind.ESNext },
});
const { slugify } = await import(
  `data:text/javascript;base64,${Buffer.from(slugModule).toString("base64")}`
);
for (const file of files) {
  const source = ts.createSourceFile(
    file,
    read(file),
    ts.ScriptTarget.Latest,
    true,
  );
  const data = { ids: new Set(), imports: new Set(), links: [], dynamic: 0 };
  const add = (href, node) => {
    if (href !== undefined)
      data.links.push({
        href,
        line: source.getLineAndCharacterOfPosition(node.getStart()).line + 1,
      });
  };
  const props = (attributes) =>
    Object.fromEntries(
      attributes
        .filter((x) => ts.isJsxAttribute(x) || ts.isPropertyAssignment(x))
        .map((x) => [name(x.name), literal(unbox(x.initializer))]),
    );
  function visit(node) {
    if (ts.isImportDeclaration(node)) {
      const f = resolveImport(file, literal(node.moduleSpecifier));
      if (f) data.imports.add(f);
    }
    if (ts.isCallExpression(node)) {
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword) {
        const f = resolveImport(file, literal(node.arguments[0]));
        if (f) data.imports.add(f);
      }
      if (["navigate", "window.open"].includes(node.expression.getText()))
        add(literal(node.arguments[0]), node);
    }
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const p = props([...node.attributes.properties]);
      const tag = node.tagName.getText();
      if (p.id) data.ids.add(p.id);
      if (tag === "Section" && p.title) data.ids.add(slugify(p.title));
      let href = p.href ?? p.to;
      if (tag === "HubLink" && p.to && p.anchor) {
        let target = p.to;
        if (target === "/hub/math-rl") {
          const mapping = read("src/components/math-rl/HubLink.tsx");
          const match = [
            ...mapping.matchAll(/"([^"]+)": "(\/math-rl\/[^\"]+)"/g),
          ].find((m) => m[1] === p.anchor);
          target = match?.[2] ?? "/math-rl";
        }
        href = target + "#" + p.anchor;
      }
      if (p.hubPath) href = p.hubPath + (p.hubAnchor ? "#" + p.hubAnchor : "");
      if (p.lessonPath) href = p.lessonPath + (p.anchor ? "#" + p.anchor : "");
      add(href, node);
      if (
        href === undefined &&
        [...node.attributes.properties].some(
          (x) => ts.isJsxAttribute(x) && ["href", "to"].includes(name(x.name)),
        )
      )
        data.dynamic++;
    }
    if (ts.isObjectLiteralExpression(node)) {
      const p = props([...node.properties]);
      if (p.id) data.ids.add(p.id);
      if (p.hubPath)
        add(p.hubPath + (p.hubAnchor ? "#" + p.hubAnchor : ""), node);
      if (p.path && p.anchor) add(`${p.path}#${p.anchor}`, node);
      else if (p.path && (p.title || p.label) && p.path.startsWith("/"))
        add(p.path, node);
      for (const key of ["href", "to", "url", "lessonPath", "textbookRoute"])
        add(p[key], node);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  parsed.set(file, data);
}
const app = read("src/App.tsx");
const pageImports = new Map(
  [...app.matchAll(/const (\w+) = lazy\(\(\) => import\("([^"]+)"\)\)/g)].map(
    (m) => [m[1], resolveImport("src/App.tsx", m[2])],
  ),
);
pageImports.set("Index", "src/pages/Index.tsx");
const routePages = new Map();
for (const m of app.matchAll(/<Route path="([^":*]+)" element=\{<([\w]+)\b/g))
  routePages.set(m[1], pageImports.get(m[2]));
const routes = new Set([...app.matchAll(/path="([^":*]+)"/g)].map((m) => m[1]));
const generated = read("src/content/textbook/index.generated.ts");
for (const m of generated.matchAll(/"route": "([^"]+)"/g)) routes.add(m[1]);
for (const m of read("src/content/textbook/parts.ts").matchAll(
  /segment: "([^"]+)"/g,
))
  routes.add("/math-rl/textbook/" + m[1]);
for (const m of read("src/pages/HubPage.tsx").matchAll(
  /\s+(?:"([^"]+)"|(\w+)): lazy\(\(\) => import\("([^"]+)"\)\)/g,
)) {
  const path = "/hub/" + (m[1] || m[2]);
  routes.add(path);
  routePages.set(path, resolveImport("src/pages/HubPage.tsx", m[3]));
}
function closure(file, seen = new Set()) {
  if (!file || seen.has(file)) return seen;
  seen.add(file);
  for (const f of parsed.get(file)?.imports ?? []) closure(f, seen);
  return seen;
}
const pageFiles = new Map(
  [...routePages].map(([path, file]) => [path, closure(file)]),
);
const idsAt = new Map(
  [...pageFiles].map(([path, files]) => [
    path,
    new Set([...files].flatMap((f) => [...(parsed.get(f)?.ids ?? [])])),
  ]),
);
idsAt.get("/courses")?.add("level-1");
idsAt.get("/courses")?.add("level-2");
idsAt.get("/courses")?.add("level-3");
const issues = new Set();
let checked = 0,
  unresolved = 0;
function check(link, file, from) {
  const { href, line } = link;
  if (!href || /^(mailto:|tel:|blob:|data:)/i.test(href)) return;
  let url;
  try {
    url = new URL(href, "https://rl-cuber-unity-code.com" + (from || "/"));
  } catch {
    issues.add(`${file}:${line} некорректный URL ${href}`);
    return;
  }
  if (
    !["rl-cuber-unity-code.com", "www.rl-cuber-unity-code.com"].includes(
      url.hostname,
    )
  )
    return;
  if (
    !href.startsWith("/") &&
    !href.startsWith("#") &&
    !href.startsWith("http")
  )
    return;
  checked++;
  if (href === "#") {
    issues.add(`${file}:${line} пустая ссылка #`);
    return;
  }
  if (!routes.has(url.pathname)) {
    if (!existsSync(join(ROOT, "public", decodeURIComponent(url.pathname))))
      issues.add(`${file}:${line} нет маршрута ${href}`);
    return;
  }
  if (!url.hash) return;
  let id;
  try {
    id = decodeURIComponent(url.hash.slice(1));
  } catch {
    id = url.hash.slice(1);
  }
  const ids = idsAt.get(url.pathname);
  if (ids && !ids.has(id))
    issues.add(`${file}:${line} нет якоря ${href} на странице ${url.pathname}`);
  if (!ids) unresolved++;
}
for (const [file, data] of parsed) {
  const contexts = [...pageFiles]
    .filter(([, files]) => files.has(file))
    .map(([route]) => route);
  for (const link of data.links) {
    if (link.href.startsWith("#")) {
      for (const from of contexts) check(link, file, from);
    } else check(link, file);
  }
}
console.log(
  `Файлов: ${files.length}; маршрутов: ${routes.size}; проверок ссылок: ${checked}.`,
);
console.log(
  `Динамических href/to: ${[...parsed.values()].reduce((n, d) => n + d.dynamic, 0)}; якорей без статического DOM: ${unresolved}. Их проверяет audit:browser.`,
);
for (const issue of [...issues].sort()) console.error(issue);
console.log(`Проблем: ${issues.size}`);
if (issues.size) process.exitCode = 1;
