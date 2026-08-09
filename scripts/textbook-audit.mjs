/**
 * Аудит интеграции учебного пособия.
 *
 * Проверяет то, что нельзя увидеть глазами и что ломается тише всего:
 * ссылку, которая ведёт в никуда. Дополняет scripts/link-audit.mjs,
 * который проверяет якоря внутри самого сайта.
 *
 *   node scripts/textbook-audit.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");

const issues = [];
const add = (msg) => issues.push(msg);

// ---------------------------------------------------------------- индекс
// index.generated.ts машинного происхождения, формат стабилен, поэтому
// разбираем его регуляркой, а не тащим в скрипт транспиляцию TypeScript.
const generated = read("src/content/textbook/index.generated.ts");
const routes = new Set([...generated.matchAll(/"route": "([^"]+)"/g)].map((m) => m[1]));
const partDirs = new Set([...generated.matchAll(/"partDir": "([^"]+)"/g)].map((m) => m[1]));

if (routes.size === 0) add("[INDEX] index.generated.ts пуст — запусти npm run textbook:index");

// Каждой лекции соответствует файл на диске.
for (const route of routes) {
  const [, , , segment, slug] = route.split("/");
  const dir = [...partDirs].find((d) => d.startsWith(`part-${segment.split("-")[1]}-`));
  if (!dir) {
    add(`[FILE] ${route}: не удалось определить каталог части`);
    continue;
  }
  if (!existsSync(join(ROOT, "src/content/math-textbook", dir, `${slug}.md`)))
    add(`[FILE] ${route}: нет файла ${dir}/${slug}.md`);
}

// ---------------------------------------------------------------- маршруты
const app = read("src/App.tsx");
for (const path of ["/math-rl/textbook", "/math-rl/textbook/:part", "/math-rl/textbook/:part/:slug"]) {
  if (!app.includes(`path="${path}"`)) add(`[ROUTE] в App.tsx нет маршрута ${path}`);
}

// ---------------------------------------------------------------- связи
const crosslinks = read("src/config/crosslinks.ts");
for (const m of crosslinks.matchAll(/textbookRoute: "([^"]+)"/g)) {
  if (!routes.has(m[1])) add(`[CROSSLINK] textbookRoute "${m[1]}" не найден среди лекций`);
}

// ---------------------------------------------------------------- карты
// mathMindMap.ts маршруты не хранит: он ищет их по mindmap_node в индексе.
// Проверяем, что для каждого листа карты нашлась лекция.
const mindmap = read("src/content/mathMindMap.ts");
const mindmapNodes = new Set([...generated.matchAll(/"mindmapNode": "([^"]+)"/g)].map((m) => m[1]));
for (const m of mindmap.matchAll(/\{ label: "([^"]+)", anchor: "[^"]*"/g)) {
  if (!mindmapNodes.has(m[1]))
    add(`[MINDMAP] узел "${m[1]}" не соответствует ни одному mindmap_node в пособии`);
}

// knowledgeMap.ts маршруты пишет явно — проверяем каждый.
const knowledge = read("src/content/knowledgeMap.ts");
const under = knowledge.match(/const TEXTBOOK_UNDER[\s\S]*?\n};/)?.[0] ?? "";
for (const m of under.matchAll(/\$\{TEXTBOOK_ROOT\}(\/[^`"]+)/g)) {
  const route = `/math-rl/textbook${m[1]}`;
  if (!routes.has(route)) add(`[KNOWLEDGE-MAP] TEXTBOOK_UNDER ведёт в несуществующую лекцию: ${route}`);
}

// ---------------------------------------------------------------- раскраска
// Единый источник цвета: styles/enf-math.css. Ни в .md, ни в компонентах
// цвет формулы не задаётся напрямую.
const katexOptions = read("src/lib/katex-options.ts");
if (!katexOptions.includes("htmlClass"))
  add("[COLOR] в katex-options.ts нет \\htmlClass — раскраска работать не будет");
if (!/trust:/.test(katexOptions))
  add("[COLOR] в katex-options.ts нет trust — KaTeX проигнорирует \\htmlClass");
if (!read("src/components/Math.tsx").includes("KATEX_OPTIONS"))
  add("[COLOR] Math.tsx не подключает KATEX_OPTIONS");

// ---------------------------------------------------------------- мост в код
// Блок «Где это в коде» ссылается на файлы репозитория unity-ml-agents-lab
// по ветке по умолчанию. Если репозиторий есть локально, проверяем, что каждый
// путь там действительно лежит: ссылка на GitHub, ведущая в 404, выглядит как
// небрежность и обнаруживается только читателем.
const bridgeRows = [...generated.matchAll(/"tag": "([^"]+)",\s*"what": "[^"]*",\s*"path": "([^"]+)"/g)].map(
  (m) => ({ tag: m[1], path: m[2] }),
);
if (bridgeRows.length === 0) issues.push("[BRIDGE] в индексе нет строк unity-bridge");

const LAB = process.env.UNITY_LAB_SRC ?? "C:/unity-ml-agents-lab";
if (existsSync(join(LAB, ".git"))) {
  const git = (args) => execFileSync("git", ["-C", LAB, ...args], { encoding: "utf8" }).trim();
  let ref = "origin/main";
  try {
    ref = git(["rev-parse", "--abbrev-ref", "origin/HEAD"]);
  } catch {
    /* origin/HEAD не задан — остаёмся на origin/main */
  }
  const missing = bridgeRows.filter((row) => {
    const path = row.path.endsWith("/") ? row.path.slice(0, -1) : row.path;
    try {
      execFileSync("git", ["-C", LAB, "cat-file", "-e", `${ref}:${path}`], { stdio: "ignore" });
      return false;
    } catch {
      return true;
    }
  });
  if (missing.length) {
    console.log(`\nПредупреждение: ${missing.length} путей моста нет в ${ref} (ссылки дадут 404):`);
    for (const row of missing) console.log(`  · ${row.path} (тема ${row.tag})`);
  }
} else {
  console.log(`Репозиторий сред не найден (${LAB}) — пути моста не проверены.`);
}

console.log(`Лекций в индексе: ${routes.size}, строк моста в код: ${bridgeRows.length}`);
console.log(`\n=== ПРОБЛЕМЫ (${issues.length}) ===`);
for (const i of issues.sort()) console.log("  · " + i);
if (issues.length) process.exit(1);
console.log("нет");
