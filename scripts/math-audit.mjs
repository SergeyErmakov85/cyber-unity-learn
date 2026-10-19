/**
 * Аудит математики сайта по правилам Ermakov Notes Framework
 * (репозиторий пособия: docs/02_Color_System.md, docs/03_Math_Notation.md,
 * docs/13_Code_Module_Python.md) и проверка карточек символов.
 *
 *   node scripts/math-audit.mjs            — ошибки и сводка предупреждений
 *   node scripts/math-audit.mjs --verbose  — все предупреждения построчно
 *
 * Разметку формул лекций учебника (.md) проверяет исходный репозиторий
 * пособия (pwsh Scripts/check.ps1). Здесь лекции проверяются на то, что
 * зависит от сайта: KaTeX их разбирает, у каждого символа есть карточка,
 * у лекций с кодом есть таблица символов.
 *
 * Формулы:
 *   ENF-COLOR-001  единый источник истины: HEX в формуле запрещён
 *   ENF-COLOR-030  цвет — макросом роли, а не \textcolor / \color / \class
 *   ENF-MATH-001   только LaTeX: юникод-математика (∑, θ) в формуле запрещена
 *   ENF-MATH-002   запрещены окружения align и equation
 *   ENF-MATH-013   ажурное начертание для ожидания (\mathbb{E}, а не E)
 *   ENF-MATH-014   имена функций и дифференциал прямым начертанием
 *   ENF-MATH-021   лимит тонов в одной формуле (learning ≤ 4)
 *   ENF-MATH-025   сквозная раскраска: символ с ролью окрашен при каждом
 *                  появлении, если лимит тонов формулы это позволяет (предупреждение)
 *   ENF-MATH-050   условная черта \mid, а не |
 *   ENF-DEC        десятичная запятая в формулах: 0{,}9 (модуль «Код», п. 3.5)
 *   ENF-HOUSE-001  индекс выносится за макрос роли, макрос в индексе запрещён
 *   ENF-HOUSE-002  \mathbb{E} не окрашивается (домовое соглашение пособия)
 *   KATEX          формула разбирается KaTeX с макросами ролей
 *
 * Карточки символов и таблицы «от формулы к коду»:
 *   ENF-SYM-001    у каждого окрашенного символа есть описание в его роли —
 *                  в глобальном словаре или в таблице страницы
 *   ENF-SYM-002    у каждого неокрашенного символа, по которому открывается
 *                  карточка, есть описание (в любой роли)
 *   ENF-SYM-010    страница или лекция учебника, где есть и формулы, и код
 *                  (Python, псевдокод, YAML, C#), показывает таблицу символов,
 *                  и в ней есть каждый окрашенный символ страницы
 *   ENF-SYM-011    имя из колонки «В коде» встречается в коде этой страницы (предупреждение)
 *   ENF-SYM-020    строки словаря и таблиц сами разбираются KaTeX
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, resolve, relative, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import katex from "katex";
import ts from "typescript";
import {
  walk,
  formulasOf,
  coloredAtoms,
  neutralAtoms,
  normalizeAtom,
  groupEnd,
  pageGraph,
  codeBlocksOf,
  mdFormulasOf,
  mdLectureId,
} from "./lib/enf-formulas.mjs";

// KaTeX предупреждает о кириллице и «ёлочках» в \text{} — шрифтов для них
// у него нет, браузер подставит системный. Для аудита это шум.
const warnOrig = console.warn;
console.warn = (...a) => (/No character metrics/.test(String(a[0])) ? undefined : warnOrig(...a));

const VERBOSE = process.argv.includes("--verbose");

// Те же макросы и доверие, что в src/lib/katex-options.ts.
const ENF_MACROS = {
  "\\enfVar": "\\htmlClass{enf-variable}{#1}",
  "\\enfFun": "\\htmlClass{enf-function}{#1}",
  "\\enfPar": "\\htmlClass{enf-parameter}{#1}",
  "\\enfOp": "\\htmlClass{enf-operator}{#1}",
  "\\enfTgt": "\\htmlClass{enf-target}{#1}",
  "\\enfNeu": "\\htmlClass{enf-neutral}{#1}",
};
const KATEX_OPTIONS = {
  throwOnError: true,
  strict: false,
  macros: { ...ENF_MACROS },
  trust: (c) => c.command === "\\htmlClass" || c.command === "\\htmlData",
};

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");
const TONE_LIMIT = 4;

const errors = [];
const warnings = [];
const err = (rule, at, msg) => errors.push(`[${rule}] ${at}: ${msg}`);
const warn = (rule, at, msg) => warnings.push({ rule, text: `[${rule}] ${at}: ${msg}` });

/* ───────────────────────── правила одной формулы ───────────────────────── */

const UNICODE_MATH = /[∑∏∫∂∇√∞≈≤≥≠∈∉⊂⊆∀∃αβγδεζηθικλμνξπρστυφχψωΓΔΘΛΞΠΣΦΨΩ→←↔⇒⇔·×÷±⋅]/u;
const BARE_FUNC = /(^|[^\\A-Za-z])(sin|cos|tan|log|ln|exp|max|min|det|dim|sup|inf)\s*[({_]/;
const TEXT_AS_OPERATOR = /\\text\{(Var|Cov|Corr|softmax|sign|diag|tr|rank|clip|proj|span|argmax|argmin|logit)\}/;
const PLAIN_DIFFERENTIAL = /(?<!\\mathrm\{)(?<![A-Za-z\\])d[xytsuvwa]\b(?!\w)/;
const PLAIN_EXPECTATION = /(?<![\\A-Za-z{])E(?:\^?_\{[^}]*\}|_\\?[A-Za-z]+)?\s*(?:\\left)?\[/;
const CONDITIONAL_PIPE =
  /(?<![\\A-Za-z])(?:P|p|Q|q|T|\\pi|\\rho|\\mu|f)\s*(?:_\{[^}]*\}|_\\?[A-Za-z]+)?\s*\((?:[^()|]*)(?<!\\)\|/;
const ROLE_RE = /\\(enfVar|enfFun|enfPar|enfOp|enfTgt)(?![A-Za-z])\s*\{/g;

function checkFormula(tex, at, dynamic) {
  const snippet = tex.replace(/\s+/g, " ").slice(0, 80);
  // «\\enfOp» — перевод строки и слово «enfOp»: KaTeX не падает, а формула
  // разваливается. Так бывает, если TeX в атрибуте JSX экранировать как строку JS.
  if (/(?<!\\)\\\\[A-Za-z]/.test(tex)) err("KATEX", at, `двойной слеш перед командой (\\\\cmd) — ${snippet}`);
  {
    // Десятичная запятая: в формулах 0{,}9, точка — только в коде (модуль «Код», п. 3.5).
    const bare = tex.replace(/\\(?:text|texttt|mathrm|operatorname|hspace|kern)\s*\{[^}]*\}/g, "").replace(/\$\{[^}]*\}/g, "");
    if (/(?<![A-Za-z\d.])\d+\.\d+(?![\d.]|e[-+]?\d|\s*(?:em|ex|pt|mu|px)\b)/.test(bare))
      err("ENF-DEC", at, `десятичная точка в формуле, нужна запятая 0{,}9 — ${snippet}`);
  }
  if (/\\(textcolor|color|definecolor)\b/.test(tex)) err("ENF-COLOR-030", at, `цвет задан командой, а не ролью — ${snippet}`);
  if (/\\class\b/.test(tex)) err("ENF-COLOR-030", at, `\\class не работает в KaTeX, нужен макрос роли — ${snippet}`);
  if (/#[0-9a-fA-F]{3,8}\b/.test(tex)) err("ENF-COLOR-001", at, `HEX в формуле — ${snippet}`);
  if (UNICODE_MATH.test(tex.replace(/\\text\{[^}]*\}/g, ""))) err("ENF-MATH-001", at, `юникод-математика вместо команды — ${snippet}`);
  if (/\\begin\{(align|equation)\}/.test(tex)) err("ENF-MATH-002", at, `align/equation запрещены, нужен aligned — ${snippet}`);
  if (BARE_FUNC.test(tex)) err("ENF-MATH-014", at, `имя функции курсивом — ${snippet}`);
  if (TEXT_AS_OPERATOR.test(tex)) err("ENF-MATH-014", at, `\\text{} вместо \\operatorname{} — ${snippet}`);
  if (/\\int/.test(tex) && PLAIN_DIFFERENTIAL.test(tex)) err("ENF-MATH-014", at, `дифференциал курсивом, нужен \\mathrm{d} — ${snippet}`);
  if (PLAIN_EXPECTATION.test(tex)) err("ENF-MATH-013", at, `ожидание не ажурным начертанием — ${snippet}`);
  if (CONDITIONAL_PIPE.test(tex)) err("ENF-MATH-050", at, `условная черта | вместо \\mid — ${snippet}`);
  if (/\\enf[A-Za-z]+\s*\{\s*\\mathbb\{E\}/.test(tex)) err("ENF-HOUSE-002", at, `\\mathbb{E} окрашена — по соглашению пособия она нейтральна — ${snippet}`);

  // Макрос роли внутри нижнего индекса и индекс внутри макроса.
  // \underset{a}{\operatorname{argmax}} — тот же индекс, только записанный иначе.
  for (const m of tex.matchAll(/\\(?:underset|overset|stackrel)\s*\{/g)) {
    const close = groupEnd(tex, m.index + m[0].length - 1);
    if (close > 0 && /\\enf(Var|Fun|Par|Op|Tgt)\b/.test(tex.slice(m.index, close)))
      err("ENF-HOUSE-001", at, `макрос роли под \\underset: связанная переменная — индекс, пишите \\arg\\max_{a} — ${snippet}`);
  }
  for (const m of tex.matchAll(/_\s*\{/g)) {
    const close = groupEnd(tex, m.index + m[0].length - 1);
    if (close > 0 && /\\enf(Var|Fun|Par|Op|Tgt)\b/.test(tex.slice(m.index, close)))
      err("ENF-HOUSE-001", at, `макрос роли в индексе: индексы не окрашиваются — ${snippet}`);
  }
  for (const m of tex.matchAll(ROLE_RE)) {
    const open = m.index + m[0].length - 1;
    const close = groupEnd(tex, open);
    const inner = tex.slice(open + 1, close);
    if (/^(\\[A-Za-z]+|[A-Za-z])\s*_/.test(inner.trim()))
      err("ENF-HOUSE-001", at, `индекс внутри макроса: пишите \\${m[1]}{x}_i, а не \\${m[1]}{x_i} — ${snippet}`);
  }

  const tones = new Set([...tex.matchAll(/\\enf(Var|Fun|Par|Op|Tgt)\b/g)].map((x) => x[1]));
  if (tones.size > TONE_LIMIT) err("ENF-MATH-021", at, `${tones.size} тонов при лимите ${TONE_LIMIT} — ${snippet}`);

  if (!dynamic) {
    try {
      katex.renderToString(tex, KATEX_OPTIONS);
    } catch (e) {
      err("KATEX", at, `${e.message.split("\n")[0]} — ${snippet}`);
    }
  }
  return tones;
}

/* ─────────── ENF-MATH-025: сквозная раскраска (порт check-colors.mjs) ─────────── */

const ATOM_RE = /^(?:[A-Za-z]|\\[A-Za-z]+|\\math(?:cal|bb|bf)\{[A-Za-z]\}|\\(?:bar|hat|tilde)\{\\?[A-Za-z]+\})$/;
const COUNTERS = new Set(["i", "j", "k", "n", "m", "t", "T", "N", "B", "K", "l", "d", "e"]);

function neutralPart(src) {
  let out = "";
  for (let i = 0; i < src.length; i++) {
    ROLE_RE.lastIndex = i;
    const role = ROLE_RE.exec(src);
    if (role && role.index === i) {
      i = groupEnd(src, i + role[0].length - 1);
      out += " ";
      continue;
    }
    const text = /^\\(?:text|mathrm|operatorname|label|tag|mathbb|mathcal)\s*\{/.exec(src.slice(i));
    if (text) {
      i = groupEnd(src, i + text[0].length - 1);
      out += " ";
      continue;
    }
    if (src[i] === "_" || src[i] === "^") {
      let j = i + 1;
      while (src[j] === " ") j++;
      if (src[j] === "{") i = groupEnd(src, j);
      else if (src[j] === "\\") i = j + /^\\[A-Za-z]*/.exec(src.slice(j))[0].length - 1;
      else i = j;
      out += " ";
      continue;
    }
    out += src[i];
  }
  return out;
}

// Связанная переменная под \max_{a'}, \arg\max_a, \sum_{s'}: ENF-MATH-025 п. 4
// разрешает ей оставаться нейтральной — со штрихом и без.
const BINDER_RE = /(?:\\(?:max|min|argmax|argmin|sum|prod|sup|inf)\s*\}?\s*(?:\\limits)?|\\mathbb\{E\})\s*_\s*\{?\s*([A-Za-z]'*|\\[A-Za-z]+'*)(?![A-Za-z])/g;
// Форма тензора «H × W × C»: буквы — размерности, им цвет не положен (п. 4).
const SHAPE_RE = /^\s*[A-Za-z](?:_\{?[A-Za-z0-9]+\}?)?(?:\s*\\times\s*[A-Za-z0-9](?:_\{?[A-Za-z0-9]+\}?)?)+\s*$/;

function check025(file, formulas) {
  const votes = new Map();
  for (const f of formulas) {
    for (const { role, atom } of coloredAtoms(f.tex)) {
      if (!ATOM_RE.test(atom) || COUNTERS.has(atom)) continue;
      const byRole = votes.get(atom) ?? new Map();
      byRole.set(role, (byRole.get(role) ?? 0) + 1);
      votes.set(atom, byRole);
    }
  }
  const roles = new Map([...votes].map(([a, byRole]) => [a, [...byRole].sort((x, y) => y[1] - x[1])[0][0]]));
  // Буква в разных ролях на одной странице (a — член ряда и действие, P —
  // вероятность и переходы): в формуле, где все четыре тона уже заняты,
  // нейтральной у неё скорее всего осталась как раз пятая роль.
  const ambiguous = new Set([...votes].filter(([, byRole]) => byRole.size > 1).map(([a]) => a));

  for (const f of formulas) {
    if (f.dynamic || SHAPE_RE.test(f.tex)) continue;
    // Тоны считаются по всем макросам, включая окрашенные числа ручного расчёта.
    const MACRO_ROLE_NAME = { Var: "variable", Fun: "function", Par: "parameter", Op: "operator", Tgt: "target" };
    const used = new Set([...f.tex.matchAll(/\\enf(Var|Fun|Par|Op|Tgt)\b/g)].map((x) => MACRO_ROLE_NAME[x[1]]));
    let neutral = neutralPart(f.tex);
    // Связанные переменные этой формулы вычёркиваются как отдельные символы:
    // `a` под \max_a — да, буква «a» внутри \max или \ldots — нет.
    for (const m of f.tex.matchAll(BINDER_RE)) {
      const b = m[1].replace(/[\\']/g, (c) => "\\" + c);
      const prime = m[1].endsWith("'") ? "" : "(?!')";
      neutral = neutral.replace(new RegExp(`(?<![\\\\A-Za-z])${b}${prime}(?![A-Za-z])`, "g"), " ");
    }
    const missed = [];
    for (const [atom, role] of roles) {
      if (used.size >= TONE_LIMIT && (!used.has(role) || ambiguous.has(atom))) continue;
      // 2\pi, \sqrt{2\pi} — число «пи», а не политика.
      if (atom === "\\pi" && /\d\s*\\pi(?![A-Za-z])/.test(neutral)) continue;
      const escaped = atom.replace(/[\\{}]/g, (c) => "\\" + c);
      const re = atom.startsWith("\\")
        ? new RegExp(`${escaped}(?![A-Za-z])`)
        : new RegExp(`(?<![\\\\A-Za-z])${escaped}(?![A-Za-z{])`);
      if (re.test(neutral)) missed.push(`${atom} → ${role}`);
    }
    if (missed.length)
      warn("ENF-MATH-025", `${file}:${f.line}`, `нейтральный символ с ролью, лимит позволяет окрасить: ${missed.join(", ")}`);
  }
}

/* ───────────────────────── словарь и таблицы символов ───────────────────────── */

const TMP = join(tmpdir(), "enf-math-audit");
mkdirSync(TMP, { recursive: true });

/** Загружает .ts-модуль с данными: типы срезаются транспиляцией. */
async function loadTs(file, seen = new Map()) {
  if (seen.has(file)) return seen.get(file);
  let src = readFileSync(file, "utf8");
  // Относительные импорты данных переписываем на транспилированные копии.
  const deps = [...src.matchAll(/from\s+["'](\.{1,2}\/[^"']+)["']/g)].map((m) => m[1]);
  for (const dep of deps) {
    const depFile = resolve(dirname(file), dep + (dep.endsWith(".ts") ? "" : ".ts"));
    if (!existsSync(depFile)) continue;
    const out = await loadTs(depFile, seen).then(() => seen.get(depFile + ":path"));
    if (out) src = src.replace(new RegExp(`(["'])${dep.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}\\1`, "g"), `"${pathToFileURL(out).href}"`);
  }
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const out = join(TMP, relative(SRC, file).replace(/[\\/]/g, "__").replace(/\.ts$/, ".mjs"));
  writeFileSync(out, js);
  seen.set(file + ":path", out);
  const mod = await import(pathToFileURL(out).href + `?t=${Date.now()}`);
  seen.set(file, mod);
  return mod;
}

const key = (role, atom) => `${role} ${normalizeAtom(atom)}`;

function indexEntries(entries) {
  const exact = new Set();
  const any = new Set();
  for (const e of entries) {
    exact.add(key(e.role, e.tex));
    any.add(normalizeAtom(e.tex));
  }
  return { exact, any };
}

function checkEntriesKatex(entries, where) {
  for (const e of entries) {
    const texs = [e.role === "neutral" ? e.tex : `\\enf${{ variable: "Var", function: "Fun", parameter: "Par", operator: "Op", target: "Tgt" }[e.role]}{${e.tex}}`];
    for (const field of ["meaning", "inFormula", "codeNote", "name"])
      for (const m of String(e[field] ?? "").matchAll(/(?<![\\$])\$([^$\n]+?)\$/g)) texs.push(m[1]);
    for (const t of texs) {
      try {
        katex.renderToString(t, KATEX_OPTIONS);
      } catch (x) {
        err("ENF-SYM-020", `${where} «${e.tex}» (${e.role})`, x.message.split("\n")[0]);
      }
    }
    // Строка в обычных кавычках съедает слеш: "\enfPar{…}" → "enfPar{…}",
    // а "\boldsymbol" → управляющий символ \b + "oldsymbol".
    for (const field of ["tex", "name", "meaning", "inFormula", "code", "codeType", "codeNote"]) {
      const v = String(e[field] ?? "");
      if (/(?<!\\)\b(?:enfVar|enfFun|enfPar|enfOp|enfTgt|mathbb|mathcal|mathbf|operatorname|frac|hat|bar)\{/.test(v) || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v))
        err("ENF-SYM-020", `${where} «${e.tex}» (${field})`, "потерян обратный слеш в TeX (строка в кавычках вместо String.raw?)");
    }
  }
}

/* ───────────────────────── проход по сайту ───────────────────────── */

const files = walk(SRC, [".tsx"]).filter((f) => !/components\/(math-symbols|textbook\/ColorLegend)/.test(f));
const formulasByFile = new Map();
let checked = 0;
let rendered = 0;

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const formulas = formulasOf(src);
  formulasByFile.set(file, formulas);
  for (const f of formulas) {
    checked++;
    if (!f.dynamic) rendered++;
    checkFormula(f.tex, `${rel}:${f.line}`, f.dynamic);
  }
  check025(rel, formulas);
}

// Словарь.
const glossaryMod = await loadTs(join(SRC, "content/math-symbols/glossary.ts"));
const GLOSSARY = glossaryMod.GLOSSARY;
checkEntriesKatex(GLOSSARY, "glossary");
const dup = new Map();
for (const e of GLOSSARY) dup.set(key(e.role, e.tex), (dup.get(key(e.role, e.tex)) ?? 0) + 1);
for (const [k, n] of dup) if (n > 1) err("ENF-SYM-001", "glossary", `пара «${k}» описана ${n} раза — карточка покажет только первую`);
const global = indexEntries(GLOSSARY);

// Таблицы страниц.
const PAGES_DIR = join(SRC, "content/math-symbols/pages");
const tables = new Map();
if (existsSync(PAGES_DIR)) {
  for (const f of readdirSync(PAGES_DIR).filter((x) => x.endsWith(".ts"))) {
    const mod = await loadTs(join(PAGES_DIR, f));
    const table = mod.default;
    if (!table?.symbols) {
      err("ENF-SYM-010", `pages/${f}`, "модуль таблицы должен экспортировать по умолчанию { id, symbols }");
      continue;
    }
    if (table.id !== basename(f, ".ts")) err("ENF-SYM-010", `pages/${f}`, `id «${table.id}» не совпадает с именем файла`);
    tables.set(basename(f, ".ts"), table);
    checkEntriesKatex(table.symbols, `pages/${f}`);
  }
}

// Страницы: формулы, код и подключённые таблицы.
const pages = pageGraph(ROOT);
const tablesOfFile = (src) =>
  [...src.matchAll(/from\s+["']@\/content\/math-symbols\/pages\/([^"']+)["']/g)].map((m) => m[1]).filter((id) => tables.has(id));

const missingSym = new Map();
const noteMissing = (rule, k, where) => {
  const v = missingSym.get(k) ?? { rule, where: new Set() };
  v.where.add(where);
  missingSym.set(k, v);
};

let pagesWithBoth = 0;
let pagesWithTable = 0;
const covered = new Set();
const usedTables = new Set();

for (const [pageRel, page] of pages) {
  if (/textbook\//.test(pageRel)) continue;
  const pageFiles = page.files.filter((f) => formulasByFile.has(f) || existsSync(f));
  const pageTables = new Set();
  let formulaCount = 0;
  let pageCode = "";
  const langs = new Set();
  for (const f of pageFiles) {
    const src = readFileSync(f, "utf8");
    for (const id of tablesOfFile(src)) pageTables.add(id);
    formulaCount += (formulasByFile.get(f) ?? []).filter((x) => coloredAtoms(x.tex).length || neutralAtoms(x.tex).length).length;
    for (const b of codeBlocksOf(src)) {
      pageCode += "\n" + b.code;
      langs.add(b.lang);
    }
  }
  // Колонка таблицы — «В коде (Python)»: имена сверяются только с Python-кодом страницы.
  let pythonCode = "";
  for (const f of pageFiles) for (const b of codeBlocksOf(readFileSync(f, "utf8"))) if (b.lang === "python") pythonCode += "\n" + b.code;
  const local = indexEntries([...pageTables].flatMap((id) => tables.get(id).symbols));
  const needsTable = formulaCount > 0 && pageCode.length > 0;
  if (needsTable) pagesWithBoth++;
  if (pageTables.size) pagesWithTable++;
  if (needsTable && !pageTables.size)
    err("ENF-SYM-010", pageRel, `на странице (${page.routes[0]}) есть формулы и код (${[...langs].join(", ")}), но нет таблицы символов`);
  for (const id of pageTables) usedTables.add(id);

  for (const f of pageFiles) {
    covered.add(f);
    const rel = relative(ROOT, f).replace(/\\/g, "/");
    for (const fm of formulasByFile.get(f) ?? []) {
      if (fm.dynamic) continue;
      for (const { role, atom } of coloredAtoms(fm.tex)) {
        const k = key(role, atom);
        if (!local.exact.has(k) && !global.exact.has(k)) noteMissing("ENF-SYM-001", k, `${rel}:${fm.line}`);
        if (needsTable && pageTables.size && !local.exact.has(k))
          noteMissing("ENF-SYM-010", `${[...pageTables].join("+")}: ${k}`, `${rel}:${fm.line}`);
      }
      for (const atom of neutralAtoms(fm.tex)) {
        const a = normalizeAtom(atom);
        if (!local.any.has(a) && !global.any.has(a)) noteMissing("ENF-SYM-002", a, `${rel}:${fm.line}`);
      }
    }
  }

  // Имена из колонки «В коде» должны встречаться в коде страницы.
  for (const id of pageTables) {
    for (const e of tables.get(id).symbols) {
      if (!e.code || e.code === "—") continue;
      const ident = /[A-Za-z_][A-Za-z0-9_]*/.exec(e.code)?.[0];
      if (ident && pythonCode && !new RegExp(`\\b${ident}\\b`).test(pythonCode))
        warn("ENF-SYM-011", `pages/${id}.ts «${e.tex}»`, `«${ident}» не встречается в коде страницы`);
    }
  }
}

// Файлы с формулами, которые не попали ни на одну страницу (компоненты-сироты),
// всё равно проверяются по глобальному словарю.
for (const [f, formulas] of formulasByFile) {
  if (covered.has(f)) continue;
  const rel = relative(ROOT, f).replace(/\\/g, "/");
  for (const fm of formulas) {
    if (fm.dynamic) continue;
    for (const { role, atom } of coloredAtoms(fm.tex))
      if (!global.exact.has(key(role, atom))) noteMissing("ENF-SYM-001", key(role, atom), `${rel}:${fm.line}`);
    for (const atom of neutralAtoms(fm.tex)) if (!global.any.has(normalizeAtom(atom))) noteMissing("ENF-SYM-002", normalizeAtom(atom), `${rel}:${fm.line}`);
  }
}

/* ───────────── лекции учебника: KaTeX, словарь, таблицы для лекций с кодом ───────────── */

const TEXTBOOK = join(SRC, "content/math-textbook");
let lectureFormulas = 0;
let lecturesWithCode = 0;
if (existsSync(TEXTBOOK)) {
  for (const file of walk(TEXTBOOK, [".md"])) {
    const src = readFileSync(file, "utf8");
    const id = mdLectureId(src);
    if (!id) continue;
    const rel = relative(ROOT, file).replace(/\\/g, "/");
    const { formulas, code } = mdFormulasOf(src);
    lectureFormulas += formulas.length;
    // Разметка формул лекции — забота исходного репозитория пособия
    // (pwsh Scripts/check.ps1); сайт обязан лишь суметь их отрендерить.
    for (const f of formulas) {
      try {
        katex.renderToString(f.tex, { ...KATEX_OPTIONS, displayMode: f.kind === "md-display" });
      } catch (e) {
        err("KATEX", `${rel}:${f.line}`, `${e.message.split("\n")[0]} — ${f.tex.replace(/\s+/g, " ").slice(0, 80)}`);
      }
    }
    const tableId = `textbook-${id}`;
    const table = tables.get(tableId);
    if (table) usedTables.add(tableId);
    const hasCode = code.some((b) => /^(python|py|csharp|cs|yaml|pseudo)$/.test(b.lang)) && formulas.length > 0;
    if (hasCode) {
      lecturesWithCode++;
      if (!table) err("ENF-SYM-010", rel, `в лекции есть формулы и код (${code.map((b) => b.lang).join(", ")}), но нет таблицы pages/${tableId}.ts`);
    }
    const local = indexEntries(table?.symbols ?? []);
    for (const f of formulas) {
      for (const { role, atom } of coloredAtoms(f.tex)) {
        const k = key(role, atom);
        if (!local.exact.has(k) && !global.exact.has(k)) noteMissing("ENF-SYM-001", k, `${rel}:${f.line}`);
        if (table && !local.exact.has(k)) noteMissing("ENF-SYM-010", `${tableId}: ${k}`, `${rel}:${f.line}`);
      }
      for (const atom of neutralAtoms(f.tex)) {
        const a = normalizeAtom(atom);
        if (!local.any.has(a) && !global.any.has(a)) noteMissing("ENF-SYM-002", a, `${rel}:${f.line}`);
      }
    }
    if (table) {
      const lectureCode = code.map((b) => b.code).join("\n");
      for (const e of table.symbols) {
        const ident = /[A-Za-z_][A-Za-z0-9_]*/.exec(e.code ?? "")?.[0];
        if (ident && code.some((b) => /^(python|py)$/.test(b.lang)) && !new RegExp(`\\b${ident}\\b`).test(lectureCode))
          warn("ENF-SYM-011", `pages/${tableId}.ts «${e.tex}»`, `«${ident}» не встречается в коде лекции`);
      }
    }
  }
}

for (const id of tables.keys())
  if (!usedTables.has(id)) err("ENF-SYM-010", `pages/${id}.ts`, "таблица не подключена ни к одной странице");

for (const [k, v] of missingSym) {
  const where = [...v.where];
  const msg =
    v.rule === "ENF-SYM-001"
      ? `нет описания символа «${k}» — карточка по клику будет пустой`
      : v.rule === "ENF-SYM-002"
        ? `нет описания неокрашенного символа «${k}»`
        : `символа нет в таблице страницы — ${k}`;
  err(v.rule, where[0] + (where.length > 1 ? ` (+${where.length - 1})` : ""), msg);
}

/* ───────────────────────── отчёт ───────────────────────── */

console.log(`Формул: ${checked}, отрендерено KaTeX: ${rendered}`);
console.log(`Словарь: ${GLOSSARY.length} строк; таблиц страниц: ${tables.size}`);
console.log(`Страниц с формулами и кодом: ${pagesWithBoth}, с таблицей символов: ${pagesWithTable}`);
console.log(`Лекций учебника: формул ${lectureFormulas}, лекций с кодом ${lecturesWithCode}`);

const byRule = new Map();
for (const w of warnings) byRule.set(w.rule, (byRule.get(w.rule) ?? 0) + 1);
if (warnings.length) {
  console.log(`\nПредупреждения: ${[...byRule].map(([r, n]) => `${r} × ${n}`).join(", ")}`);
  if (VERBOSE) for (const w of warnings) console.log(w.text);
  else console.log("Подробно: node scripts/math-audit.mjs --verbose");
}

if (errors.length === 0) {
  console.log("\nОшибок нет.");
  process.exit(0);
}
console.log("");
for (const e of errors) console.log(e);
console.log(`\nОшибок: ${errors.length}`);
process.exit(1);
