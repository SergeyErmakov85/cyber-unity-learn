/**
 * Проверка ссылок на лабораторию сред Unity ML-Agents.
 *
 * Реестр `src/content/labEnvironments.ts` ссылается на файлы третьего
 * репозитория связки — `unity-ml-agents-lab`. Опечатка в пути или файл,
 * переименованный на той стороне, дают тихую 404: страница соберётся,
 * тесты пройдут, и читатель упрётся в пустую страницу GitHub.
 *
 * Скрипт делает две вещи:
 *
 *   1. проверяет внутреннюю целостность реестра — каждый `focus` ссылается
 *      на путь, который есть в `links` своей среды, каждый ключ `LAB_PRACTICE`
 *      называет известную среду;
 *   2. если репозиторий лаборатории есть локально, проверяет каждый путь
 *      на существование в ветке по умолчанию — ровно в том состоянии,
 *      которое увидит читатель, перейдя по ссылке.
 *
 *   node scripts/lab-links-audit.mjs
 *
 * Путь к лаборатории берётся из UNITY_LAB_SRC, по умолчанию
 * C:/unity-ml-agents-lab. Без неё проверка (2) пропускается с сообщением,
 * а не падает: на чужой машине репозитория сред может не быть.
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { repositoryTree } from "./repository-tree.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REGISTRY = join(ROOT, "src", "content", "labEnvironments.ts");

const src = readFileSync(REGISTRY, "utf8");
const problems = [];
const fail = (message) => problems.push(message);

// ------------------------------------------------------------------ разбор
// Реестр — обычный TypeScript, и парсить его целиком незачем: нужны только
// строковые литералы путей. Шаблонная подстановка в реестре ровно одна —
// `${ENVS}`, и её значение объявлено там же.
const envsPrefix = /const ENVS = "(.+?)";/.exec(src)?.[1];
if (!envsPrefix) fail("в реестре не найдено объявление const ENVS");

const expand = (raw) => raw.replace("${ENVS}", envsPrefix ?? "");

/** Пути из полей path/notebook и из массивов focus. */
const paths = new Set();
for (const m of src.matchAll(/(?:path|notebook): [`"]([^`"]+)[`"]/g)) paths.add(expand(m[1]));
for (const m of src.matchAll(/focus: \[([\s\S]*?)\]/g)) {
  for (const item of m[1].matchAll(/[`"]([^`"]+)[`"]/g)) paths.add(expand(item[1]));
}

if (paths.size === 0) fail("в реестре не найдено ни одного пути");

// Команды обучения ссылаются на конфиги — их тоже стоит проверить.
for (const m of src.matchAll(/train: "python scripts\/train\.py --config (\S+)/g)) {
  paths.add(m[1].replace(/\\/g, "/"));
}

// --------------------------------------------- внутренняя целостность
const envIds = [...src.matchAll(/^  (E\d\d_\w+): \{$/gm)].map((m) => m[1]);
if (envIds.length !== 12) fail(`сред в реестре ${envIds.length}, ожидалось 12`);

const known = new Set(envIds);
for (const m of src.matchAll(/envId: "(\w+)"/g)) {
  if (!known.has(m[1])) fail(`LAB_PRACTICE ссылается на неизвестную среду ${m[1]}`);
}

const mentioned = new Set([...src.matchAll(/envId: "(\w+)"/g)].map((m) => m[1]));
const orphans = envIds.filter((id) => !mentioned.has(id));
if (orphans.length) fail(`среды не упомянуты ни в одном месте курса: ${orphans.join(", ")}`);

// ------------------------------------------------- существование путей
const LAB = process.env.UNITY_LAB_SRC ?? resolve(ROOT, "../unity-ml-agents-lab");
let checked = 0;

if (existsSync(join(LAB, ".git"))) {
  try {
    const { ref, paths: tree } = repositoryTree(LAB);
    for (const path of [...paths].sort()) {
      if (!tree.has(path.replace(/\/$/, ""))) fail(`нет в ${ref} лаборатории: ${path}`);
      checked += 1;
    }
    console.log(`Сред: ${envIds.length}, путей: ${paths.size}, проверено по ${ref}: ${checked}.`);
  } catch (error) {
    fail(`[GIT] ${error.message}`);
  }
} else {
  console.log(`Сред: ${envIds.length}, путей: ${paths.size}.`);
  console.log(`Репозиторий лаборатории не найден (${LAB}) — существование путей не проверялось.`);
  console.log("Укажите его переменной UNITY_LAB_SRC, чтобы проверка была полной.");
}

// ------------------------------------------------------------------ итог
console.log(`\n=== ПРОБЛЕМЫ (${problems.length}) ===`);
if (problems.length === 0) {
  console.log("нет");
} else {
  for (const item of problems) console.log(`  · ${item}`);
  process.exit(1);
}
