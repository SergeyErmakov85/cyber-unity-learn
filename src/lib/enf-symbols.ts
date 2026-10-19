/**
 * Кликабельные символы формул.
 *
 * Роль символа задаётся макросом ENF (`\enfPar{\gamma}`), а цвет приходит из
 * src/styles/enf-math.css. Чтобы по клику показать карточку символа, нужно
 * знать, КАКОЙ символ нажат и в какой роли. В отрендеренном HTML KaTeX этой
 * информации уже нет: от `\enfOp{V}` остаётся `<span class="enf-operator">V</span>`,
 * а от `\hat{A}` — три вложенных span'а с акцентом.
 *
 * Поэтому до рендера каждый ролевой макрос оборачивается в `\htmlData`:
 *
 *   \enfPar{\gamma}  →  \htmlData{enfs=p5c67616d6d61}{\enfPar{\gamma}}
 *
 * Значение атрибута — буква роли и hex исходного TeX символа. Hex выбран
 * потому, что парсер `\htmlData` делит строку по «,» и «=», а `%` в TeX —
 * комментарий; из 0-9a-f ничего не сломается. Вёрстка не меняется: обёртка
 * `\htmlData` — такой же span, как и `\htmlClass` у самого макроса.
 *
 * Символы без роли (индексы, `\mathbb{E}`, `\sum`, связанные переменные) не
 * размечаются в TeX — обёртка вокруг `\sum` переставила бы пределы сбоку.
 * Их распознаёт `glyphAtom` прямо по DOM KaTeX в момент клика.
 */

export type EnfRole = "variable" | "function" | "parameter" | "operator" | "target";
export type EnfRoleOrNeutral = EnfRole | "neutral";

export const ROLES: EnfRole[] = ["variable", "function", "parameter", "operator", "target"];

export const MACRO_TO_ROLE: Record<string, EnfRole> = {
  enfVar: "variable",
  enfFun: "function",
  enfPar: "parameter",
  enfOp: "operator",
  enfTgt: "target",
};

export const ROLE_TO_MACRO: Record<EnfRole, string> = {
  variable: "enfVar",
  function: "enfFun",
  parameter: "enfPar",
  operator: "enfOp",
  target: "enfTgt",
};

const ROLE_LETTER: Record<EnfRole, string> = {
  variable: "v",
  function: "f",
  parameter: "p",
  operator: "o",
  target: "t",
};
const LETTER_ROLE: Record<string, EnfRole> = Object.fromEntries(
  Object.entries(ROLE_LETTER).map(([role, letter]) => [letter, role as EnfRole]),
);

/** Подписи ролей для карточки, таблицы и легенды. */
export const ROLE_INFO: Record<
  EnfRoleOrNeutral,
  { label: string; short: string; hint: string; inFormula: string; inCode: string }
> = {
  variable: {
    label: "Переменная",
    short: "переменная",
    hint: "объект, над которым действуем: состояние, наблюдение, вход",
    inFormula:
      "Это аргумент: то, что подставляют в формулу. Сама формула описывает, что происходит с этим объектом, но не настраивает его.",
    inCode: "В коде — входные данные функции или элемент массива: то, что приходит из среды или из выборки.",
  },
  function: {
    label: "Функция",
    short: "функция",
    hint: "действие, преобразование, отображение",
    inFormula:
      "Это преобразование: оно принимает аргумент и возвращает результат. В RL сюда же относятся действие агента и политика как отображение «состояние → действие».",
    inCode: "В коде — вызов функции, сети или метода: `policy(obs)`, `torch.tanh(x)`, `env.step(action)`.",
  },
  parameter: {
    label: "Параметр",
    short: "параметр",
    hint: "то, что настраивается или обучается",
    inFormula:
      "Это ручка настройки: при вычислении формулы параметр фиксирован, но именно его подбирают — вручную (гиперпараметр) или градиентным спуском (веса).",
    inCode: "В коде — гиперпараметр в конфиге или обучаемые веса модели (`model.parameters()`).",
  },
  operator: {
    label: "Оператор",
    short: "оператор",
    hint: "агрегат: ценность, ожидание, градиент, сумма",
    inFormula:
      "Это агрегат: он сворачивает много значений в одно — усредняет, суммирует по будущему, дифференцирует. Функции ценности V и Q тоже агрегаты: средняя будущая отдача.",
    inCode: "В коде — свёртка массива: `.mean()`, `.sum()`, `loss.backward()`, выход сети-критика.",
  },
  target: {
    label: "Цель",
    short: "цель",
    hint: "награда, потери, метка — то, что оптимизируем",
    inFormula:
      "Это то, к чему стремится обучение: награду максимизируют, потери минимизируют, к метке подтягивают предсказание.",
    inCode: "В коде — награда из `env.step`, значение `loss`, целевые метки `targets`.",
  },
  neutral: {
    label: "Служебный символ",
    short: "без роли",
    hint: "индексы, счётчики, множества, служебные операторы",
    inFormula:
      "По правилам ENF у этого символа нет цвета: индексы, счётчики, множества, связанные переменные под max и сумма — служебная часть записи.",
    inCode: "В коде — индекс цикла, размер массива, тип или служебная функция NumPy/PyTorch.",
  },
};

/* ────────────────────────────── hex ────────────────────────────── */

const encoder = typeof TextEncoder !== "undefined" ? new TextEncoder() : undefined;
const decoder = typeof TextDecoder !== "undefined" ? new TextDecoder() : undefined;

export function toHex(text: string): string {
  if (!encoder) return "";
  let out = "";
  for (const byte of encoder.encode(text)) out += byte.toString(16).padStart(2, "0");
  return out;
}

export function fromHex(hex: string): string {
  if (!decoder || hex.length % 2) return "";
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return decoder.decode(bytes);
}

/* ─────────────────────────── нормализация ─────────────────────────── */

/**
 * Каноническая запись символа для поиска в словаре: без лишних пробелов,
 * аргумент акцента и шрифта всегда в фигурных скобках.
 *   "\hat A" → "\hat{A}",  "\mathbf  x" → "\mathbf{x}",  " s " → "s"
 */
export function normalizeAtom(tex: string): string {
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

/* ──────────────────────────── разметка TeX ──────────────────────────── */

/** Индекс закрывающей скобки группы, начинающейся с `{` в позиции open. */
export function groupEnd(src: string, open: number): number {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (ch === "\\") {
      i++;
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}" && --depth === 0) return i;
  }
  return -1;
}

/** «0{,}9», «-2», «\\mathbf{8.29}», «${…}» после подстановки — число, а не символ. */
const isNumeric = (atom: string) =>
  /^[\s+\-−]*(?:\\mathbf\{)?[\s+\-−]*[0-9][0-9.,{}\s]*\}?$/.test(atom.trim());

const ROLE_MACRO_AT = /^\\(enfVar|enfFun|enfPar|enfOp|enfTgt)(?![A-Za-z])\s*\{/;

/**
 * Оборачивает каждый ролевой макрос в `\htmlData{enfs=…}`. Вложенные макросы
 * тоже размечаются: клик попадает в ближайший — самый внутренний — символ.
 * Строку, в которой скобки не сбалансированы, возвращает как есть: пусть
 * KaTeX покажет ошибку исходника, а не нашей разметки.
 */
export function tagEnfSymbols(tex: string): string {
  if (!tex.includes("\\enf")) return tex;
  let out = "";
  let i = 0;
  while (i < tex.length) {
    const ch = tex[i];
    if (ch === "\\") {
      const m = ROLE_MACRO_AT.exec(tex.slice(i));
      if (m) {
        const open = i + m[0].length - 1;
        const close = groupEnd(tex, open);
        if (close < 0) return tex;
        const inner = tex.slice(open + 1, close);
        const role = MACRO_TO_ROLE[m[1]];
        // Число в ручном расчёте наследует тон символа (ENF-MATH-025, п. 5),
        // но символом не является: карточки у него нет.
        if (isNumeric(inner)) {
          out += `\\${m[1]}{${inner}}`;
          i = close + 1;
          continue;
        }
        const key = ROLE_LETTER[role] + toHex(normalizeAtom(inner));
        out += `\\htmlData{enfs=${key}}{\\${m[1]}{${tagEnfSymbols(inner)}}}`;
        i = close + 1;
        continue;
      }
      // Любая другая команда или экранированный символ копируется целиком,
      // чтобы `\\` (перевод строки в aligned) не съел следующий символ.
      const cmd = /^\\(?:[A-Za-z]+|.)/.exec(tex.slice(i));
      const len = cmd ? cmd[0].length : 1;
      out += tex.slice(i, i + len);
      i += len;
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

/** Обратное к ключу `enfs`: роль и исходный TeX символа. */
export function decodeSymbolKey(key: string): { role: EnfRole; atom: string } | null {
  const role = LETTER_ROLE[key[0]];
  if (!role) return null;
  const atom = fromHex(key.slice(1));
  return atom ? { role, atom } : null;
}

/**
 * Подсветка символа в формуле для карточки: все вхождения того же символа
 * в той же роли получают класс `enf-hl`.
 */
export function highlightAtom(tex: string, role: EnfRole, atom: string): string {
  const macro = ROLE_TO_MACRO[role];
  const target = normalizeAtom(atom);
  let out = "";
  let i = 0;
  while (i < tex.length) {
    if (tex[i] === "\\") {
      const m = ROLE_MACRO_AT.exec(tex.slice(i));
      if (m) {
        const open = i + m[0].length - 1;
        const close = groupEnd(tex, open);
        if (close < 0) return tex;
        const inner = tex.slice(open + 1, close);
        const piece = `\\${m[1]}{${highlightAtom(inner, role, atom)}}`;
        out += m[1] === macro && normalizeAtom(inner) === target ? `\\htmlClass{enf-hl}{${piece}}` : piece;
        i = close + 1;
        continue;
      }
      const cmd = /^\\(?:[A-Za-z]+|.)/.exec(tex.slice(i));
      const len = cmd ? cmd[0].length : 1;
      out += tex.slice(i, i + len);
      i += len;
      continue;
    }
    out += tex[i];
    i++;
  }
  return out;
}

/* ───────────────────── символы без роли: разбор DOM KaTeX ───────────────────── */

const GREEK: Record<string, string> = {
  α: "\\alpha", β: "\\beta", γ: "\\gamma", δ: "\\delta", ϵ: "\\epsilon", ε: "\\varepsilon",
  ζ: "\\zeta", η: "\\eta", θ: "\\theta", ϑ: "\\vartheta", ι: "\\iota", κ: "\\kappa",
  λ: "\\lambda", μ: "\\mu", ν: "\\nu", ξ: "\\xi", π: "\\pi", ϖ: "\\varpi", ρ: "\\rho",
  ϱ: "\\varrho", σ: "\\sigma", ς: "\\varsigma", τ: "\\tau", υ: "\\upsilon", ϕ: "\\phi",
  φ: "\\varphi", χ: "\\chi", ψ: "\\psi", ω: "\\omega", Γ: "\\Gamma", Δ: "\\Delta",
  Θ: "\\Theta", Λ: "\\Lambda", Ξ: "\\Xi", Π: "\\Pi", Σ: "\\Sigma", Υ: "\\Upsilon",
  Φ: "\\Phi", Ψ: "\\Psi", Ω: "\\Omega",
};

const SYMBOL_GLYPHS: Record<string, string> = {
  "∇": "\\nabla",
  "∞": "\\infty",
  "ℓ": "\\ell",
  "∂": "\\partial",
  "∼": "\\sim",
  "∑": "\\sum",
  "∏": "\\prod",
  "∫": "\\int",
  "∮": "\\oint",
  "⊤": "\\top",
  "∅": "\\varnothing",
  "∈": "\\in",
  "∝": "\\propto",
  "≈": "\\approx",
  "⊙": "\\odot",
  "∘": "\\circ",
};

const ACCENTS: Record<string, string> = {
  "^": "\\hat",
  "ˆ": "\\hat",
  "ˉ": "\\bar",
  "‾": "\\bar",
  "~": "\\tilde",
  "˜": "\\tilde",
  "→": "\\vec",
  "⃗": "\\vec",
  "˙": "\\dot",
  "¨": "\\ddot",
};

/** Текст узла без нулевых пробелов, которые KaTeX ставит для выравнивания. */
const cleanText = (el: Element | null) => (el?.textContent ?? "").replace(/[​⁡]/g, "").trim();

function letterAtom(leaf: Element, ch: string): string | null {
  const cls = leaf.classList;
  if (cls.contains("mathbb") || cls.contains("amsrm")) return `\\mathbb{${ch}}`;
  if (cls.contains("mathcal")) return `\\mathcal{${ch}}`;
  if (cls.contains("mathscr")) return `\\mathscr{${ch}}`;
  if (cls.contains("mathfrak")) return `\\mathfrak{${ch}}`;
  if (cls.contains("boldsymbol")) return `\\boldsymbol{${GREEK[ch] ?? ch}}`;
  if (cls.contains("mathbf")) return `\\mathbf{${GREEK[ch] ?? ch}}`;
  if (GREEK[ch]) return GREEK[ch];
  if (SYMBOL_GLYPHS[ch]) return SYMBOL_GLYPHS[ch];
  if (/^[A-Za-z]$/.test(ch)) return ch;
  return null;
}

export interface GlyphHit {
  /** TeX символа в той же канонической форме, что и в словаре. */
  atom: string;
  /** Символ стоит в индексе или степени. */
  script: boolean;
  /** Элемент, над которым показывать карточку. */
  anchor: Element;
}

/**
 * Символ без роли под курсором: буква, оператор (`\sum`, `\max`, `\log`),
 * ажурная `\mathbb{E}`, буква с акцентом. Цифры, скобки и знаки отношений
 * не считаются символами — для них карточки нет.
 */
export function glyphAtom(target: Element, root: Element): GlyphHit | null {
  const html = target.closest(".katex-html");
  if (!html || !root.contains(html)) return null;

  const script = !!target.closest(".msupsub");

  // Операторы с именем: \max, \log, \operatorname{clip}, большие \sum и \int.
  const mop = target.closest(".mop");
  if (mop && html.contains(mop)) {
    // У \max_{a} внутри .mop лежит ещё один .mop с именем и .msupsub с индексом.
    const inner = mop.querySelector(":scope > .mop") ?? mop;
    if (!target.closest(".msupsub") || !mop.contains(target.closest(".msupsub"))) {
      const name = cleanText(stripScripts(inner));
      if (name) {
        if (SYMBOL_GLYPHS[name]) return { atom: SYMBOL_GLYPHS[name], script, anchor: inner };
        if (name === "arg") {
          const next = mop.nextElementSibling?.matches(".mspace")
            ? mop.nextElementSibling.nextElementSibling
            : mop.nextElementSibling;
          const nextName = next?.matches(".mop") ? cleanText(stripScripts(next.querySelector(":scope > .mop") ?? next)) : "";
          return { atom: nextName ? `\\arg\\${nextName}` : "\\arg", script, anchor: mop };
        }
        if (/^[a-z]+$/i.test(name)) {
          const named = inner.querySelector(".mathrm") ? `\\operatorname{${name}}` : `\\${name}`;
          return { atom: named, script, anchor: inner };
        }
      }
    }
  }

  // Буква с акцентом: \hat{A}, \bar{\theta}.
  const accent = target.closest(".accent");
  if (accent && html.contains(accent)) {
    const body = accent.querySelector(".accent-body");
    const base = [...accent.querySelectorAll(".mord")].find(
      (el) => !body?.contains(el) && el.children.length === 0 && cleanText(el).length === 1,
    );
    const mark = ACCENTS[cleanText(body)];
    const ch = cleanText(base ?? null);
    const baseAtom = base ? letterAtom(base, ch) : null;
    if (mark && baseAtom) return { atom: `${mark}{${baseAtom}}`, script, anchor: accent };
  }

  // Одиночная буква или символ.
  const leaf = target.children.length === 0 ? target : null;
  if (!leaf) return null;
  const ch = cleanText(leaf);
  if (ch.length !== 1) return null;
  const atom = letterAtom(leaf, ch);
  return atom ? { atom, script, anchor: leaf } : null;
}

function stripScripts(el: Element): Element {
  const copy = el.cloneNode(true) as Element;
  copy.querySelectorAll(".msupsub").forEach((s) => s.remove());
  return copy;
}
