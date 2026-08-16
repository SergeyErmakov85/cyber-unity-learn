/**
 * Аудит формул в страницах сайта по правилам Ermakov Notes Framework
 * (репозиторий пособия, docs/02_Color_System.md и docs/03_Math_Notation.md).
 *
 * Проверяет то, что глазами ловится плохо: HEX вместо роли, юникод-математику,
 * запрещённые окружения и превышение лимита тонов. Лекции учебника приходят
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
 *   ENF-MATH-021   лимит тонов в одной формуле (learning ≤ 4)
 *   ENF-MATH-050   условная черта \mid, а не |
 *   KATEX          формула вообще разбирается KaTeX с макросами ролей
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import katex from "katex";

// Те же макросы, что в src/lib/katex-options.ts. Держим копию здесь, чтобы
// скрипт не тащил транспиляцию TypeScript ради шести строк.
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

for (const file of walk(SRC)) {
  const src = readFileSync(file, "utf8");
  const rel = relative(ROOT, file).replace(/\\/g, "/");

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

    checked++;
    const line = src.slice(0, m.index).split("\n").length;
    const at = `${rel}:${line}`;
    const snippet = tex.replace(/\s+/g, " ").slice(0, 70);

    if (/\\(textcolor|color|definecolor)\b/.test(tex))
      add(`[ENF-COLOR-030] ${at}: цвет задан командой, а не ролью — ${snippet}`);

    if (/\\class\b/.test(tex))
      add(`[ENF-COLOR-030] ${at}: \\class не работает в KaTeX, нужен макрос роли — ${snippet}`);

    if (/#[0-9a-fA-F]{3,8}\b/.test(tex))
      add(`[ENF-COLOR-001] ${at}: HEX в формуле — ${snippet}`);

    if (UNICODE_MATH.test(tex))
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

    const tones = new Set(
      [...tex.matchAll(/\\enf(Var|Fun|Par|Op|Tgt)\b/g)].map((x) => x[1])
    );
    if (tones.size > TONE_LIMIT)
      add(
        `[ENF-MATH-021] ${at}: ${tones.size} тонов при лимите ${TONE_LIMIT} — ${snippet}`
      );

    // Формула обязана разбираться KaTeX. Ловит, в частности, \bar\enfPar{...}:
    // акцент забирает следующий токен — сам макрос — и тот остаётся без аргумента.
    // Литералы с ${...} собираются во время выполнения, статически их не проверить.
    if (!tex.includes("${")) {
      try {
        katex.renderToString(tex, KATEX_OPTIONS);
        rendered++;
      } catch (e) {
        add(`[KATEX] ${at}: ${e.message.split("\n")[0]} — ${snippet}`);
      }
    }
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
