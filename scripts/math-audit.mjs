/**
 * Аудит формул в страницах сайта по правилам Ermakov Notes Framework
 * (репозиторий пособия, docs/02_Color_System.md и docs/03_Math_Notation.md).
 *
 * Проверяет то, что глазами ловится плохо: HEX вместо роли, юникод-математику,
 * запрещённые окружения, индексы внутри макросов роли, превышение лимита тонов
 * и обратные слэши, которые съедает обычная JS-строка. Лекции учебника приходят
 * из .md и проверяются в исходном репозитории — здесь только TSX-страницы.
 *
 *   node scripts/math-audit.mjs
 *
 * Правила, которые проверяются:
 *   ENF-COLOR-001  единый источник истины: HEX в формуле запрещён
 *   ENF-COLOR-030  цвет задаётся макросом роли, а не \textcolor / \color / \class
 *   ENF-MATH-001   только LaTeX: юникод-математика (∑, θ) запрещена
 *   ENF-MATH-002   запрещены окружения align и equation внутри $$
 *   ENF-MATH-013   ажурное начертание для ожидания (\mathbb{E}, а не E)
 *   ENF-MATH-014   имена функций и дифференциал прямым начертанием
 *   ENF-MATH-020   индексы, степени и знаки — вне макроса роли
 *   ENF-MATH-021   лимит тонов в одной формуле (learning ≤ 4)
 *   ENF-MATH-050   условная черта \mid, а не |
 *   ENF-CODE-001   одиночный обратный слэш в обычной JS-строке с формулой
 *   KATEX          формула вообще разбирается KaTeX с макросами ролей
 *   RICHTEXT       формулы $...$ в словарях символов (таблицы и пояснения)
 *
 * Формулы ищутся в JSX-тегах (<Math>, <F>, <IM>, <Tex>…), в String.raw-константах
 * и массивах с макросами ролей, в пропсах tex= / formula= и в текстах словарей
 * src/content/symbols.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import katex from "katex";

// Те же макросы, что в src/lib/katex-options.ts. Держим копию здесь, чтобы
// скрипт не тащил транспиляцию TypeScript ради шести строк.
const ENF_MACROS = {
  "\\enfVar": "\\htmlClass{enf-variable enf-sym}{#1}",
  "\\enfFun": "\\htmlClass{enf-function enf-sym}{#1}",
  "\\enfPar": "\\htmlClass{enf-parameter enf-sym}{#1}",
  "\\enfOp": "\\htmlClass{enf-operator enf-sym}{#1}",
  "\\enfTgt": "\\htmlClass{enf-target enf-sym}{#1}",
  "\\enfNeu": "\\htmlClass{enf-neutral}{#1}",
};
const KATEX_OPTIONS = {
  throwOnError: true,
  strict: false,
  macros: { ...ENF_MACROS },
  trust: (c) => c.command === "\\htmlClass",
};

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");

// Страницы курса — учебный материал, значит learning mode: до 4 тонов.
const TONE_LIMIT = 4;

const issues = [];
const add = (msg) => issues.push(msg);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith(".tsx")) out.push(p);
  }
  return out;
}

/**
 * Формула — строковый литерал внутри JSX-тега, начинающегося с заглавной буквы.
 * Так ловятся и <Math>, и локальные обёртки (<F>, <IM>, <Tex>), которых
 * в репозитории несколько.
 *
 * Литерал бывает трёх видов, и все три реально встречаются:
 *   {`...`}  {String.raw`...`}  {"..."}
 * В шаблонном литерале без String.raw и в кавычках `\\` означает один
 * обратный слэш, поэтому перед проверкой строка разэкранируется.
 */
const FORMULA_RE =
  /<([A-Z][A-Za-z0-9_]*)\b[^>]*>\s*\{(String\.raw)?(?:`([\s\S]*?)`|"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')\}\s*<\/\1>/g;

// Обёртки, внутри которых лежит код, а не математика.
const NOT_MATH = new Set(["CyberCodeBlock", "CodeBlock", "Code", "Pre"]);

const UNICODE_MATH =
  /[∑∏∫∂∇√∞≈≤≥≠∈∉⊂⊆∀∃αβγδεζηθικλμνξπρστυφχψωΓΔΘΛΞΠΣΦΨΩ→←↔⇒⇔·×÷±⋅]/u;

// Имя функции латиницей без обратного слэша: sin(, log_, max(...
const BARE_FUNC =
  /(^|[^\\A-Za-z])(sin|cos|tan|log|ln|exp|max|min|det|dim|sup|inf)\s*[({_]/;

// \text{} — разметка текста, а не имя оператора: Var, Cov, softmax и т. п.
const TEXT_AS_OPERATOR = /\\text\{(Var|Cov|Corr|softmax|sign|diag|tr|rank)\}/;

// Дифференциал прямым начертанием (ENF-MATH-014): \,dx → \,\mathrm{d}x
const PLAIN_DIFFERENTIAL = /(?<!\\mathrm\{)\bd[xytsuvw]\b(?!\w)/;

// Ажурное начертание для вероятностных операторов (ENF-MATH-013).
// Только там, где E — точно ожидание: E[...] или E_{...}[...].
// «E_A» в рейтинге Эло под правило не подпадает и не ловится.
const PLAIN_EXPECTATION =
  /(?<![\\A-Za-z])E(?:\^?_\{[^}]*\}|_\\?[A-Za-z]+)?\s*(?:\\left)?\[/;

// Условная черта внутри вероятностной скобки: P(A|B), \pi(a|s), Q(s|a).
// Мощность множества |S| записывается той же чертой и нарушением не является,
// поэтому ищем только пары «скобка функции … | … закрывающая скобка».
const CONDITIONAL_PIPE =
  /(?<![\\A-Za-z])(?:P|p|Q|q|\\pi|\\rho|\\mu)\s*(?:_\{[^}]*\}|_\\?[A-Za-z]+)?\s*\((?:[^()|]*)\|/;

let checked = 0;
let rendered = 0;

/** Аргумент макроса роли `\enfXxx{...}` с учётом вложенных скобок. */
function roleArgs(tex) {
  const out = [];
  const re = /\\enf(Var|Fun|Par|Op|Tgt)\s*\{/g;
  let m;
  while ((m = re.exec(tex))) {
    let depth = 1;
    let i = re.lastIndex;
    for (; i < tex.length && depth; i++) {
      if (tex[i] === "\\") i++;
      else if (tex[i] === "{") depth++;
      else if (tex[i] === "}") depth--;
    }
    out.push(tex.slice(re.lastIndex, i - 1));
  }
  return out;
}

/** Все правила для одной формулы. `render` — проверять ли разбор KaTeX. */
function checkTex(tex, at, render = true) {
  checked++;
  const snippet = tex.replace(/\s+/g, " ").slice(0, 70);

  if (/\\(textcolor|color|definecolor)\b/.test(tex))
    add(`[ENF-COLOR-030] ${at}: цвет задан командой, а не ролью — ${snippet}`);

  if (/\\class\b/.test(tex))
    add(`[ENF-COLOR-030] ${at}: \\class не работает в KaTeX, нужен макрос роли — ${snippet}`);

  if (/#[0-9a-fA-F]{3,8}\b/.test(tex))
    add(`[ENF-COLOR-001] ${at}: HEX в формуле — ${snippet}`);

  if (UNICODE_MATH.test(tex.replace(/\\text\{[^}]*\}/g, "")))
    add(`[ENF-MATH-001] ${at}: юникод-математика вместо команды — ${snippet}`);

  if (/\\begin\{(align|equation)\}/.test(tex))
    add(`[ENF-MATH-002] ${at}: align/equation не работают в KaTeX внутри $$ — ${snippet}`);

  if (BARE_FUNC.test(tex))
    add(`[ENF-MATH-014] ${at}: имя функции курсивом — ${snippet}`);

  if (TEXT_AS_OPERATOR.test(tex))
    add(`[ENF-MATH-014] ${at}: \\text{} вместо \\operatorname{} — ${snippet}`);

  if (PLAIN_DIFFERENTIAL.test(tex))
    add(`[ENF-MATH-014] ${at}: дифференциал курсивом, нужен \\mathrm{d} — ${snippet}`);

  if (PLAIN_EXPECTATION.test(tex))
    add(`[ENF-MATH-013] ${at}: ожидание не ажурным начертанием — ${snippet}`);

  if (CONDITIONAL_PIPE.test(tex))
    add(`[ENF-MATH-050] ${at}: условная черта | вместо \\mid — ${snippet}`);

  // Индексы, степени и знаки не окрашиваются (ENF-MATH-020): r_{t+1} — это
  // \enfTgt{r}_{t+1}, а не \enfTgt{r_{t+1}}. Знак — снаружи: -\enfTgt{1}.
  // 𝔼 по домовому правилу всегда нейтральна.
  for (const arg of roleArgs(tex)) {
    const bare = arg.replace(/\\[a-zA-Z]+\{[^{}]*\}/g, "X");
    if (/[_^]/.test(bare))
      add(`[ENF-MATH-020] ${at}: индекс или степень внутри макроса роли — \\enf…{${arg}}`);
    if (/^\s*[+\-−±]/.test(arg))
      add(`[ENF-MATH-020] ${at}: знак внутри макроса роли — \\enf…{${arg}}`);
    if (/\\mathbb\{E\}/.test(arg))
      add(`[ENF-MATH-013] ${at}: \\mathbb{E} окрашена, а по правилу пособия она нейтральна — ${snippet}`);
  }

  const tones = new Set([...tex.matchAll(/\\enf(Var|Fun|Par|Op|Tgt)\b/g)].map((x) => x[1]));
  if (tones.size > TONE_LIMIT)
    add(`[ENF-MATH-021] ${at}: ${tones.size} тонов при лимите ${TONE_LIMIT} — ${snippet}`);

  // Формула обязана разбираться KaTeX. Ловит, в частности, \bar\enfPar{...}:
  // акцент забирает следующий токен — сам макрос — и тот остаётся без аргумента.
  // Литералы с ${...} собираются во время выполнения, статически их не проверить.
  if (render && !tex.includes("${")) {
    try {
      katex.renderToString(tex, KATEX_OPTIONS);
      rendered++;
    } catch (e) {
      add(`[KATEX] ${at}: ${e.message.split("\n")[0]} — ${snippet}`);
    }
  }
}

/**
 * Обычная строка съедает одиночный обратный слэш: "\mathcal{S}" в JS — это
 * "mathcal{S}", "\times" — табуляция и "imes". В формулах вне String.raw
 * слэш обязан быть двойным (ENF-CODE-001).
 */
function checkEscapes(body, isRaw, at) {
  if (isRaw) return;
  const single = body.match(/(?<!\\)\\(?!\\)([a-mo-zA-Z])[a-zA-Z]*/);
  if (single) add(`[ENF-CODE-001] ${at}: одиночный «\\${single[0].slice(1)}» в обычной строке — JS съест обратный слэш`);
}

const lineOf = (src, index) => src.slice(0, index).split("\n").length;

// Формулы вне тегов: константы, массивы и пропсы — String.raw`...` и tex="...".
const RAW_RE = /String\.raw`([\s\S]*?)`/g;
const TEX_PROP_RE = /\b(?:tex|formula|latex)=(?:"((?:[^"\\]|\\.)*)"|\{"((?:[^"\\]|\\.)*)"\}|\{`([\s\S]*?)`\})/g;

for (const file of walk(SRC)) {
  const src = readFileSync(file, "utf8");
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const seen = new Set();

  FORMULA_RE.lastIndex = 0;
  let m;
  while ((m = FORMULA_RE.exec(src))) {
    const [, tag, isRaw, tpl, dq, sq] = m;
    if (NOT_MATH.has(tag)) continue;
    const body = tpl ?? dq ?? sq;
    if (body === undefined) continue;
    // Вне String.raw двойной слэш в исходнике — это один слэш в формуле.
    const tex = isRaw ? body : body.replace(/\\\\/g, "\\");
    // Не всякий литерал — формула: нужен признак LaTeX.
    if (!/\\[a-zA-Z]+|[\^_]/.test(tex)) continue;
    const at = `${rel}:${lineOf(src, m.index)}`;
    seen.add(m.index + m[0].indexOf(body));
    checkEscapes(body, !!isRaw, at);
    checkTex(tex, at);
  }

  RAW_RE.lastIndex = 0;
  while ((m = RAW_RE.exec(src))) {
    const pos = m.index + "String.raw`".length;
    if (seen.has(pos)) continue;
    const tex = m[1];
    if (!/\\enf(Var|Fun|Par|Op|Tgt)\b/.test(tex)) continue;
    checkTex(tex, `${rel}:${lineOf(src, m.index)}`);
  }

  TEX_PROP_RE.lastIndex = 0;
  while ((m = TEX_PROP_RE.exec(src))) {
    const [, attr, braced, tpl] = m;
    // tex="..." в JSX — атрибут, а не JS-строка: слэши не разэкранируются.
    const tex = attr ?? (braced ?? tpl).replace(/\\\\/g, "\\");
    if (!/\\[a-zA-Z]+/.test(tex)) continue;
    const at = `${rel}:${lineOf(src, m.index)}`;
    if (attr === undefined) checkEscapes(braced ?? tpl, false, at);
    checkTex(tex, at);
  }
}

// Словари символов: формулы внутри текста пояснений — $...$ (мини-разметка RichText).
const SYMBOLS = join(SRC, "content", "symbols");
const walkTs = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkTs(p, out);
    else if (p.endsWith(".ts")) out.push(p);
  }
  return out;
};
for (const file of walkTs(SYMBOLS)) {
  const src = readFileSync(file, "utf8");
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const STR = /"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = STR.exec(src))) {
    const text = m[1].replace(/\\\\/g, "\\");
    const parts = text.split("$");
    if (parts.length < 3) continue;
    const at = `${rel}:${lineOf(src, m.index)}`;
    if (parts.length % 2 === 0) add(`[RICHTEXT] ${at}: непарный $ — ${text.slice(0, 70)}`);
    for (let i = 1; i < parts.length; i += 2) checkTex(parts[i], at);
  }
}

console.log(`Проверено формул: ${checked}, из них отрендерено KaTeX: ${rendered}`);

if (issues.length === 0) {
  console.log("Нарушений правил ENF не найдено.");
  process.exit(0);
}

for (const issue of issues) console.log(issue);
console.log(`\nНарушений: ${issues.length}`);
process.exit(1);
