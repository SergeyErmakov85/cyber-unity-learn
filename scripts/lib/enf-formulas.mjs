/**
 * Общая часть проверок математики сайта: где лежат формулы и из каких
 * символов они состоят. Используется scripts/math-audit.mjs.
 *
 * Формулы на сайте живут в четырёх местах, и проверка обязана видеть все:
 *   1. литерал внутри JSX-обёртки формулы: <Math>{String.raw`...`}</Math>;
 *   2. поле данных, которое потом попадает в <Math>: tex: "…", formula: "…";
 *   3. строчная математика `$…$` внутри строк, которые рендерит RichText
 *      (квизы, таблицы, словарь символов);
 *   4. .md лекций учебника — их проверяет исходный репозиторий пособия.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, dirname, resolve } from "node:path";

export const MATH_TAGS = new Set(["Math", "MathTex", "MathFormula", "F", "IM", "Tex", "MathBlock", "InlineMath", "BlockMath"]);

export function walk(dir, exts = [".tsx", ".ts"], out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, exts, out);
    else if (exts.some((e) => p.endsWith(e))) out.push(p);
  }
  return out;
}

const lineOf = (src, index) => src.slice(0, index).split("\n").length;

/** Разэкранирование строкового литерала JS в TeX. */
const unescape = (body, kind) =>
  kind === "raw" ? body : kind === "tpl" ? body.replace(/\\\\/g, "\\").replace(/\\`/g, "`") : body.replace(/\\(["'\\])/g, "$1");

/**
 * Все формулы файла: { tex, line, kind: "jsx"|"data"|"inline", dynamic }.
 * dynamic — литерал собирается во время выполнения (${…}); статически его
 * можно проверить только частично.
 */
export function formulasOf(src) {
  const out = [];
  const seen = new Set();
  const push = (tex, index, kind) => {
    if (seen.has(index)) return;
    seen.add(index);
    out.push({ tex, line: lineOf(src, index), kind, dynamic: tex.includes("${") });
  };

  const JSX_RE =
    /<([A-Z][A-Za-z0-9_]*)\b[^>]*>\s*\{(String\.raw)?(?:`([\s\S]*?)`|"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')\}\s*<\/\1>/g;
  for (const m of src.matchAll(JSX_RE)) {
    if (!MATH_TAGS.has(m[1])) continue;
    const [, , raw, tpl, dq, sq] = m;
    const body = tpl ?? dq ?? sq;
    const kind = raw ? "raw" : tpl !== undefined ? "tpl" : "dq";
    const tex = unescape(body, kind);
    if (!/\\[a-zA-Z]+|[\^_]|[A-Za-z]/.test(tex)) continue;
    push(tex, m.index, "jsx");
  }

  const DATA_RE =
    /\b(tex|formula|latex|texLabel|symbol)\s*:\s*(String\.raw)?(`(?:[^`\\]|\\[\s\S])*`|"((?:[^"\\]|\\.)*)")/g;
  for (const m of src.matchAll(DATA_RE)) {
    const lit = m[3];
    const kind = m[2] ? "raw" : lit[0] === "`" ? "tpl" : "dq";
    const tex = unescape(lit.slice(1, -1), kind);
    if (!/\\[a-zA-Z]+|[\^_]/.test(tex)) continue;
    push(tex, m.index, "data");
  }

  // `$…$` в строках для RichText. Ищем по строковым литералам целиком,
  // чтобы не спутать с `${…}` шаблонов.
  const STR_RE = /(String\.raw)?(`(?:[^`\\]|\\[\s\S])*`|"(?:[^"\\\n]|\\.)*")/g;
  for (const m of src.matchAll(STR_RE)) {
    const lit = m[2];
    if (!lit.includes("$")) continue;
    const kind = m[1] ? "raw" : lit[0] === "`" ? "tpl" : "dq";
    const text = unescape(lit.slice(1, -1), kind);
    for (const im of text.matchAll(/(?<![\\$])\$([^$\n]+?)\$/g)) {
      const tex = im[1];
      if (tex.startsWith("{")) continue; // ${…} в шаблоне
      if (!/\\[a-zA-Z]+|[\^_]|[A-Za-z]/.test(tex)) continue;
      push(tex, m.index + 1 + im.index, "inline");
    }
  }
  return out.sort((a, b) => a.line - b.line);
}

/* ───────────── символы формулы: роли и нейтральные атомы ───────────── */

const ROLE_RE = /\\(enfVar|enfFun|enfPar|enfOp|enfTgt|enfNeu)(?![A-Za-z])\s*\{/g;
export const MACRO_ROLE = { enfVar: "variable", enfFun: "function", enfPar: "parameter", enfOp: "operator", enfTgt: "target" };

export function groupEnd(src, open) {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (ch === "\\") { i++; continue; }
    if (ch === "{") depth++;
    else if (ch === "}" && --depth === 0) return i;
  }
  return -1;
}

/** Та же нормализация, что normalizeAtom в src/lib/enf-symbols.ts. */
export function normalizeAtom(tex) {
  return tex
    .trim()
    .replace(/\s+/g, " ")
    .replace(
      /\\(hat|bar|tilde|vec|dot|ddot|widehat|widetilde|overline|mathbf|mathcal|mathbb|mathrm|boldsymbol|bm|mathsf)\s+(\\[A-Za-z]+|[A-Za-z0-9])/g,
      "\\$1{$2}",
    )
    .replace(/\s*([{}^_'])\s*/g, "$1")
    .replace(/(\\[A-Za-z]+) (?=[^A-Za-z])/g, "$1");
}

const isNumeric = (atom) => /^[\s+\-−]*(?:\\mathbf\{)?[\s+\-−]*[0-9][0-9.,{}\s]*\}?$/.test(atom.trim());

/** Окрашенные символы формулы: [{ role, atom }]. Числа (ENF-MATH-025, п. 5) не символы. */
export function coloredAtoms(tex) {
  const out = [];
  for (const m of tex.matchAll(ROLE_RE)) {
    if (m[1] === "enfNeu") continue;
    const open = m.index + m[0].length - 1;
    const close = groupEnd(tex, open);
    if (close < 0) continue;
    const atom = normalizeAtom(tex.slice(open + 1, close));
    if (isNumeric(atom) || atom.includes("${")) continue;
    out.push({ role: MACRO_ROLE[m[1]], atom });
  }
  return out;
}

const GREEK = "alpha|beta|gamma|delta|epsilon|varepsilon|zeta|eta|theta|vartheta|iota|kappa|lambda|mu|nu|xi|pi|varpi|rho|varrho|sigma|varsigma|tau|upsilon|phi|varphi|chi|psi|omega|Gamma|Delta|Theta|Lambda|Xi|Pi|Sigma|Upsilon|Phi|Psi|Omega";
const NAMED_OPS = "sum|prod|int|max|min|log|ln|exp|lim|sup|inf|det|tanh|sin|cos|nabla|infty|partial|sim|ell";

/**
 * Неокрашенные символы, по которым карточка тоже открывается (DOM-разбор
 * в glyphAtom): буквы, греческие, \mathbb{E}, \sum, \max, \operatorname{…}.
 * Возвращает канонические атомы — их должен знать словарь.
 */
export function neutralAtoms(tex) {
  // Убираем окрашенные группы, \text{…} и окружения — их содержимое не символы.
  let s = "";
  for (let i = 0; i < tex.length; i++) {
    ROLE_RE.lastIndex = i;
    const r = ROLE_RE.exec(tex);
    if (r && r.index === i) {
      const close = groupEnd(tex, i + r[0].length - 1);
      if (close < 0) break;
      s += " ";
      i = close;
      continue;
    }
    const t = /^\\(text|textbf|mbox|label|tag|begin|end|htmlClass|htmlData|hspace|vspace|color|textcolor)\*?\s*\{/.exec(tex.slice(i));
    if (t) {
      const close = groupEnd(tex, i + t[0].length - 1);
      if (close < 0) break;
      s += " ";
      i = close;
      continue;
    }
    s += tex[i];
  }
  const atoms = new Set();
  const take = (a) => atoms.add(normalizeAtom(a));
  // операторы с именем
  for (const m of s.matchAll(/\\operatorname\*?\{([^{}]+)\}/g)) take(`\\operatorname{${m[1]}}`);
  s = s.replace(/\\operatorname\*?\{[^{}]+\}/g, " ");
  // \mathrm{…} — подпись или имя без класса оператора: KaTeX рендерит его
  // обычным текстом, карточка по нему не открывается.
  s = s.replace(/\\mathrm\{[^{}]*\}/g, " ");
  for (const m of s.matchAll(/\\arg\s*\\(max|min)/g)) take(`\\arg\\${m[1]}`);
  s = s.replace(/\\arg\s*\\(max|min)/g, " ");
  // шрифты и акценты
  for (const m of s.matchAll(/\\(mathbb|mathcal|mathbf|boldsymbol|hat|bar|tilde|vec|widehat|overline)\s*\{\s*(\\[A-Za-z]+|[A-Za-z])\s*\}/g)) take(`\\${m[1]}{${m[2]}}`);
  s = s.replace(/\\(mathbb|mathcal|mathbf|boldsymbol|hat|bar|tilde|vec|widehat|overline)\s*\{[^{}]*\}/g, " ");
  for (const m of s.matchAll(new RegExp(`\\\\(${GREEK}|${NAMED_OPS})(?![A-Za-z])`, "g"))) take(`\\${m[1]}`);
  s = s.replace(/\\[A-Za-z]+/g, " ");
  for (const m of s.matchAll(/[A-Za-z]/g)) take(m[0]);
  return [...atoms];
}

/* ───────────────────────── страницы сайта ───────────────────────── */

/** Маршрут → файл страницы и все компоненты, которые она подтягивает. */
export function pageGraph(root) {
  const src = join(root, "src");
  const resolveImport = (from, spec) => {
    let base;
    if (spec.startsWith("@/")) base = join(src, spec.slice(2));
    else if (spec.startsWith(".")) base = resolve(dirname(from), spec);
    else return null;
    for (const ext of ["", ".tsx", ".ts", "/index.tsx", "/index.ts"]) {
      const p = base + ext;
      if (existsSync(p) && statSync(p).isFile()) return p;
    }
    return null;
  };
  const deps = new Map();
  const depsOf = (file) => {
    if (deps.has(file)) return deps.get(file);
    const text = readFileSync(file, "utf8");
    const list = [...text.matchAll(/import\s+[^;]*?from\s+["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g)]
      .map((m) => resolveImport(file, m[1] ?? m[2]))
      .filter((p) => p && p.endsWith(".tsx") && !p.includes("/pages/") && !/\/components\/ui\//.test(p));
    deps.set(file, list);
    return list;
  };
  const closure = (file) => {
    const seen = new Set([file]);
    const stack = [file];
    while (stack.length) for (const d of depsOf(stack.pop())) if (!seen.has(d)) { seen.add(d); stack.push(d); }
    return [...seen];
  };
  const app = readFileSync(join(src, "App.tsx"), "utf8");
  const lazy = {};
  for (const m of app.matchAll(/const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\(["']([^"']+)["']\)/g)) lazy[m[1]] = resolveImport(join(src, "App.tsx"), m[2]);
  for (const m of app.matchAll(/import\s+(\w+)\s+from\s+["']([^"']+)["']/g)) lazy[m[1]] ??= resolveImport(join(src, "App.tsx"), m[2]);
  const pages = new Map();
  for (const m of app.matchAll(/path="([^"]+)"\s+element=\{<([A-Za-z0-9_]+)/g)) {
    const file = lazy[m[2]];
    if (!file) continue;
    const key = relative(root, file);
    if (!pages.has(key)) pages.set(key, { file, routes: [], files: closure(file) });
    pages.get(key).routes.push(m[1]);
  }
  return pages;
}

/* ───────────────────────── код на странице ───────────────────────── */

const LANG_MARKERS = [
  ["python", /^\s*(?:import |from \S+ import |def |class \w+[(:]|for \w+(?:, ?\w+)* in |return\b|print\()|\b(?:torch|np|nn|F|self)\.\w|\.(?:mean|sum|backward|detach|item)\(\)/m],
  ["csharp", /^\s*(?:using [A-Z]\w*(?:\.\w+)*;|public |private |protected |override |void |float |int |var \w+ = )|\b(?:AddReward|SetReward|EndEpisode|Mathf\.)\b/m],
  ["yaml", /^\s*(?:behaviors|hyperparameters|network_settings|reward_signals|trainer_type|environment_parameters):\s*$|^\s+[a-z_]+:\s+[\d.e-]+\s*(?:#.*)?$/m],
  ["pseudo", /^\s*(?:for |while |if |repeat|until |end\b|Algorithm|Алгоритм|Input|Output)|<-|←/m],
];

/** Язык кода по содержимому: python, csharp, yaml, pseudo — или null, если это не код. */
export function detectCode(text) {
  if (!text.includes("\n")) return null;
  // Многострочные формулы (aligned, cases) — не код.
  if (/\\(?:enf[A-Z][a-z]+|frac|begin\{|sum_|mathbb|left|right)\b/.test(text) && !/\b(?:def|import|torch)\b/.test(text)) return null;
  for (const [lang, re] of LANG_MARKERS) if (re.test(text)) return lang;
  return null;
}

/**
 * Весь код файла: [{ lang, code }]. На сайте код бывает в четырёх видах —
 * детей <CyberCodeBlock>, детей <pre>, пропса code={`…`} и поля данных
 * code: `…`, вынесенного в константу. Надёжнее всего искать сами шаблонные
 * литералы и признавать кодом те, что похожи на код; язык берём из
 * ближайшего CyberCodeBlock, иначе определяем по содержимому.
 */
export function codeBlocksOf(src) {
  const out = [];
  const taken = [];
  for (const m of src.matchAll(/<CyberCodeBlock\b([^>]*)>([\s\S]*?)<\/CyberCodeBlock>/g)) {
    const lang = /language="([^"]+)"/.exec(m[1])?.[1] ?? "";
    const body = m[2].trim();
    // {`…`} или {String.raw`…`} — берём литерал; {name} — код в константе, найдётся ниже.
    const lit = /^\{(?:String\.raw)?`([\s\S]*)`\}$/.exec(body);
    if (lit) out.push({ lang: lang || detectCode(lit[1]) || "python", code: lit[1] });
    else if (!/^\{[\w.]+\}$/.test(body)) out.push({ lang: lang || "python", code: body });
    taken.push([m.index, m.index + m[0].length]);
  }
  for (const m of src.matchAll(/(String\.raw)?`((?:[^`\\]|\\[\s\S])*)`/g)) {
    if (taken.some(([a, b]) => m.index >= a && m.index < b)) continue;
    const lang = detectCode(m[2]);
    if (lang) out.push({ lang, code: m[2] });
  }
  return out;
}

/* ───────────────────────── лекции учебника (.md) ───────────────────────── */

/**
 * Формулы и код лекции учебника. Код в ``` не трогаем (в нём `$` — не TeX),
 * затем выключные `$$…$$` и строчные `$…$`. Возвращает
 * { formulas: [{ tex, line, kind, dynamic:false }], code: [{ lang, code }] }.
 */
export function mdFormulasOf(src) {
  const code = [];
  // Фронтматтер — не текст лекции.
  let body = src.replace(/^---\n[\s\S]*?\n---\n/, (fm) => fm.replace(/[^\n]/g, " "));
  body = body.replace(/^(```+|~~~+)([^\n]*)\n([\s\S]*?)^\1[ \t]*$/gm, (all, fence, info, text) => {
    const lang = info.trim().split(/\s+/)[0].toLowerCase();
    if (lang && lang !== "math" && lang !== "mermaid") code.push({ lang: lang === "py" ? "python" : lang, code: text });
    return all.replace(/[^\n]/g, " ");
  });
  // Строчный код `…` тоже может содержать $.
  body = body.replace(/`[^`\n]+`/g, (s) => s.replace(/[^\n]/g, " "));
  const formulas = [];
  const lineAt = (i) => body.slice(0, i).split("\n").length;
  body = body.replace(/\$\$([\s\S]+?)\$\$/g, (all, tex, i) => {
    formulas.push({ tex: tex.trim(), line: lineAt(i), kind: "md-display", dynamic: false });
    return all.replace(/[^\n]/g, " ");
  });
  for (const m of body.matchAll(/(?<![\\$])\$(?!\s)([^$\n]+?)(?<!\s)\$(?!\d)/g)) {
    formulas.push({ tex: m[1], line: lineAt(m.index), kind: "md-inline", dynamic: false });
  }
  return { formulas: formulas.sort((a, b) => a.line - b.line), code };
}

/** Id лекции из фронтматтера (`id: part-5-06`). */
export function mdLectureId(src) {
  const fm = /^---\n([\s\S]*?)\n---\n/.exec(src)?.[1];
  return fm ? (/^id:\s*["']?([\w-]+)["']?\s*$/m.exec(fm)?.[1] ?? null) : null;
}
