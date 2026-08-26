#!/usr/bin/env node
/**
 * Обход апстрим-бага @lovable.dev/mcp-js на Windows.
 *
 * Vite-плагин собирает supabase/functions/mcp/index.ts через esbuild и подставляет
 * в точку входа АБСОЛЮТНЫЙ путь до src/lib/mcp/index.ts. Его esbuild-плагин
 * externalizeBareAsNpm считает «своим» только путь, начинающийся с "." или "/",
 * поэтому windows-путь C:\... уходит в ветку bare-спецификатора и превращается
 * во внешний импорт "npm:C:\\...". Бандл схлопывается в три строки, edge-функция
 * ломается. На Linux/macOS ветка не срабатывает — баг виден только у нас.
 *
 * Скрипт дописывает в проверку windows-пути (буква диска и UNC). Идемпотентен,
 * чинит и собственный неудачный прогон, молча пропускает файл, если апстрим
 * переписал это место. Баг актуален на 0.22.1 и всё ещё есть в 0.28.0.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

// Обратный слэш собираем из кода символа: литералы с \\ слишком легко испортить
// при передаче скрипта через шелл.
const BS = String.fromCharCode(92);

/** Строка-условие целиком, без отступа и без хвоста после неё. */
const WANTED_CONDITION =
  `if (p.startsWith(".") || p.startsWith("/") || /^[A-Za-z]:/.test(p) || p.startsWith("${BS}${BS}"))`;

// Отступ, само условие (до первой закрывающей пары скобок) и хвост строки:
// в 0.22.x "return null;" стоит на следующей строке, в 0.28.x — на этой же.
const CONDITION_LINE = /^(\s*)if \(p\.startsWith\("\."\).*?\)\)(.*)$/;

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pkgDir = join(projectRoot, "node_modules", "@lovable.dev", "mcp-js");
const targets = ["vite.js", "vite.cjs"].map((f) =>
  join(pkgDir, "dist", "stacks", "supabase", f),
);

let patched = 0;
let alreadyOk = 0;

for (const file of targets) {
  let source;
  try {
    source = readFileSync(file, "utf8");
  } catch (err) {
    if (err.code === "ENOENT") continue;
    throw err;
  }

  const lines = source.split("\n");
  const index = lines.findIndex((line) => CONDITION_LINE.test(line));

  if (index === -1) {
    console.warn(
      `[patch-mcp-plugin] проверка пути не найдена в ${file} — пропускаю (апстрим изменился?)`,
    );
    continue;
  }

  const [, indent, tail] = lines[index].match(CONDITION_LINE);
  const wantedLine = `${indent}${WANTED_CONDITION}${tail}`;

  if (lines[index] === wantedLine) {
    alreadyOk += 1;
    continue;
  }

  lines[index] = wantedLine;
  writeFileSync(file, lines.join("\n"), "utf8");
  patched += 1;
}

if (patched > 0) console.log(`[patch-mcp-plugin] пропатчено файлов: ${patched}`);
else if (alreadyOk > 0) console.log("[patch-mcp-plugin] патч уже применён");
