/**
 * Синхронизация учебного пособия из исходного репозитория.
 *
 * Единственный источник истины по содержанию — `math-textbook/` в репозитории
 * Ermakov Notes Framework: там материалы пишутся и там же проходят проверки
 * ENF (`pwsh Scripts/check.ps1`). Здесь лежит копия только для рендера, править
 * её нельзя: расхождение копий обнаруживается не сразу и чинится дорого.
 *
 *   node scripts/sync-textbook.mjs [--check] [--src <путь>]
 *
 *   --check  ничего не копирует, только сообщает о расхождениях
 *            (файл изменён, добавлен, удалён) и выходит с кодом 1, если они есть
 *   --src    путь к каталогу math-textbook исходного репозитория;
 *            по умолчанию — переменная окружения ENF_TEXTBOOK_SRC,
 *            затем C:/Math_for_DS_&_RL/math-textbook
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEST = join(ROOT, "src", "content", "math-textbook");

const args = process.argv.slice(2);
const check = args.includes("--check");
const srcArg = args.includes("--src") ? args[args.indexOf("--src") + 1] : undefined;
const SRC = resolve(srcArg ?? process.env.ENF_TEXTBOOK_SRC ?? "C:/Math_for_DS_&_RL/math-textbook");

if (!existsSync(SRC)) {
  console.error(`Источник не найден: ${SRC}`);
  console.error("Укажи путь: --src <путь> или переменной ENF_TEXTBOOK_SRC.");
  process.exit(2);
}

/** Все .md относительными путями. Прочие файлы (скрипты, кэш) не переносим. */
const listMarkdown = (root, base = "") => {
  const out = [];
  for (const entry of readdirSync(join(root, base), { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (entry.name === "__pycache__" || entry.name.startsWith(".")) continue;
      out.push(...listMarkdown(root, rel));
    } else if (entry.name.endsWith(".md")) {
      out.push(rel);
    }
  }
  return out;
};

const srcFiles = new Set(listMarkdown(SRC));
const destFiles = existsSync(DEST) ? new Set(listMarkdown(DEST)) : new Set();

const added = [...srcFiles].filter((f) => !destFiles.has(f));
const removed = [...destFiles].filter((f) => !srcFiles.has(f));
const changed = [...srcFiles].filter(
  (f) => destFiles.has(f) && readFileSync(join(SRC, f), "utf8") !== readFileSync(join(DEST, f), "utf8"),
);

console.log(`Источник: ${SRC}`);
console.log(`Файлов в источнике: ${srcFiles.size}, в копии: ${destFiles.size}`);

if (added.length + removed.length + changed.length === 0) {
  console.log("Расхождений нет.");
  process.exit(0);
}

for (const f of added) console.log(`  + ${f}`);
for (const f of changed) console.log(`  ~ ${f}`);
for (const f of removed) console.log(`  - ${f}`);

if (check) {
  console.error(
    `\nКопия разошлась с источником (${added.length + changed.length + removed.length}).` +
      "\nПравки содержания вносятся в исходный репозиторий, затем npm run textbook:sync.",
  );
  process.exit(1);
}

for (const f of [...added, ...changed]) {
  const target = join(DEST, f);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, readFileSync(join(SRC, f)));
}
for (const f of removed) rmSync(join(DEST, f));

console.log(
  `\nСинхронизировано: +${added.length} ~${changed.length} -${removed.length}.` +
    "\nДальше: npm run textbook:index (пересобрать индекс и sitemap).",
);
