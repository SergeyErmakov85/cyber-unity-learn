/**
 * Разбор TeX-формул с ролевой раскраской ENF.
 *
 * Нужен всплывающим пояснениям и таблицам символов: по клику на цветной
 * символ надо узнать, какая запись стоит за ним в исходной формуле
 * (`\hat{A}_t`, а не просто «A»), и найти её в словаре страницы.
 */
import { MACRO_ROLE, type EnfTone } from "@/lib/enf-roles";

export interface EnfCall {
  role: EnfTone;
  /** TeX внутри макроса: для `\enfPar{\gamma}` — `\gamma`. */
  inner: string;
  /** Позиция макроса в исходной строке. */
  start: number;
  end: number;
}

const CALL_RE = /\\(enfVar|enfFun|enfPar|enfOp|enfTgt|enfNeu)\s*\{/g;

/** Индекс закрывающей скобки группы, открытой в позиции `open`. */
export const groupEnd = (src: string, open: number): number => {
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === "\\") {
      i++;
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return i;
  }
  return src.length - 1;
};

/** Все вызовы макросов ролей в порядке записи, вложенные — после внешних. */
export const findEnfCalls = (tex: string): EnfCall[] => {
  const out: EnfCall[] = [];
  CALL_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = CALL_RE.exec(tex))) {
    const open = m.index + m[0].length - 1;
    const close = groupEnd(tex, open);
    out.push({ role: MACRO_ROLE[m[1]], inner: tex.slice(open + 1, close).trim(), start: m.index, end: close + 1 });
    // Продолжаем внутри группы: вложенные макросы тоже символы.
    CALL_RE.lastIndex = open + 1;
  }
  return out;
};

/** Убирает макросы ролей, оставляя содержимое: `\enfPar{\gamma}^k` → `\gamma^k`. */
export const stripRoleMacros = (tex: string): string => {
  let s = tex;
  for (let guard = 0; guard < 50; guard++) {
    CALL_RE.lastIndex = 0;
    const m = CALL_RE.exec(s);
    if (!m) break;
    const open = m.index + m[0].length - 1;
    const close = groupEnd(s, open);
    s = s.slice(0, m.index) + "{" + s.slice(open + 1, close) + "}" + s.slice(close + 1);
  }
  return s;
};

/**
 * Каноническая форма записи для поиска в словаре: без лишних пробелов,
 * индексы и акценты в фигурных скобках, `\prime` как штрих.
 * `\hat A_t`, `\hat{A}_{t}` и `\hat{A}_t` дают один ключ.
 */
export const normalizeTex = (tex: string): string => {
  let s = stripRoleMacros(tex).replace(/\\(?:,|;|:|!|quad|qquad)/g, " ").replace(/\s+/g, " ").trim();
  s = s.replace(/\\(left|right|big|Big|bigg|Bigg)(?![a-zA-Z])/g, "");
  // Пробел значим только между командой и буквой: `\hat A`.
  s = s.replace(/(\\[a-zA-Z]+) (?=[a-zA-Z])/g, "$1\u0000").replace(/ /g, "").replace(/\u0000/g, " ");
  s = s.replace(/\^\{?\\prime\}?/g, "'");
  s = s.replace(/\\(hat|widehat|bar|overline|tilde|widetilde|vec|dot|ddot|mathbf|mathcal|mathbb|boldsymbol|bm|mathrm|mathit)\s*(\\[a-zA-Z]+|[A-Za-z0-9])/g, "\\$1{$2}");
  s = s.replace(/([_^])(\\[a-zA-Z]+|[^{\\\s])/g, "$1{$2}");
  // Лишние скобки вокруг всей записи.
  while (s.startsWith("{") && groupEnd(s, 0) === s.length - 1) s = s.slice(1, -1);
  return s;
};

export type MarkKind = "hat" | "bar" | "tilde" | "dot" | "vec" | "star" | "prime" | "sup" | "sub";

export interface Mark {
  kind: MarkKind;
  /** Для индексов — содержимое: `t`, `\pi`, `\theta`. */
  value?: string;
}

const ACCENTS: Record<string, MarkKind> = {
  hat: "hat",
  widehat: "hat",
  bar: "bar",
  overline: "bar",
  tilde: "tilde",
  widetilde: "tilde",
  dot: "dot",
  ddot: "dot",
  vec: "vec",
};

/** Длина первого «атома» записи: команда с аргументами, группа или символ. */
const atomLength = (s: string): number => {
  if (!s) return 0;
  if (s[0] === "{") return groupEnd(s, 0) + 1;
  if (s[0] === "\\") {
    const name = /^\\([a-zA-Z]+|.)/.exec(s)![0];
    let i = name.length;
    // Команды начертания и акценты забирают аргумент.
    if (/^\\(math\w+|boldsymbol|bm|hat|widehat|bar|overline|tilde|widetilde|vec|dot|ddot|operatorname|text\w*)$/.test(name)) {
      while (s[i] === " ") i++;
      if (s[i] === "{") i = groupEnd(s, i) + 1;
      else i += atomLength(s.slice(i));
    }
    return i;
  }
  return 1;
};

const unbrace = (s: string) => (s.startsWith("{") && groupEnd(s, 0) === s.length - 1 ? s.slice(1, -1) : s);

/**
 * Отделяет «основу» символа от украшений: `\hat{A}_t` → основа `A`,
 * пометки [крышка, индекс t]. По основе ищется общее определение, а
 * пометки объясняются отдельно — так пояснение есть даже у записи,
 * которой нет в словаре.
 */
export const splitDecorations = (tex: string): { base: string; marks: Mark[] } => {
  let s = normalizeTex(tex);
  const marks: Mark[] = [];
  for (let guard = 0; guard < 12; guard++) {
    const accent = /^\\([a-zA-Z]+)\{/.exec(s);
    if (accent && ACCENTS[accent[1]] && groupEnd(s, accent[0].length - 1) === s.length - 1) {
      marks.push({ kind: ACCENTS[accent[1]] });
      s = s.slice(accent[0].length, -1);
      continue;
    }
    const n = atomLength(s);
    if (n > 0 && n < s.length) {
      let head = s.slice(0, n);
      let rest = s.slice(n);
      const tail: Mark[] = [];
      while (rest) {
        if (rest[0] === "'") {
          tail.push({ kind: "prime" });
          rest = rest.slice(1);
        } else if (rest[0] === "_" || rest[0] === "^") {
          const arg = rest.slice(1);
          const len = atomLength(arg);
          const value = unbrace(arg.slice(0, len));
          if (rest[0] === "^" && (value === "*" || value === "\\ast" || value === "\\star")) tail.push({ kind: "star" });
          else if (rest[0] === "^" && /^'+$/.test(value)) tail.push({ kind: "prime" });
          else tail.push({ kind: rest[0] === "_" ? "sub" : "sup", value });
          rest = arg.slice(len);
        } else break;
      }
      if (!rest && tail.length) {
        marks.push(...tail);
        s = unbrace(head);
        head = s;
        continue;
      }
    }
    break;
  }
  return { base: s, marks };
};

const GREEK: Record<string, [string, string]> = {
  alpha: ["альфа", "alpha"],
  beta: ["бета", "beta"],
  gamma: ["гамма", "gamma"],
  delta: ["дельта", "delta"],
  epsilon: ["эпсилон", "epsilon"],
  varepsilon: ["эпсилон", "epsilon"],
  zeta: ["дзета", "zeta"],
  eta: ["эта", "eta"],
  theta: ["тета", "theta"],
  vartheta: ["тета", "theta"],
  iota: ["йота", "iota"],
  kappa: ["каппа", "kappa"],
  lambda: ["лямбда", "lam"],
  mu: ["мю", "mu"],
  nu: ["ню", "nu"],
  xi: ["кси", "xi"],
  pi: ["пи", "pi"],
  rho: ["ро", "rho"],
  sigma: ["сигма", "sigma"],
  tau: ["тау", "tau"],
  upsilon: ["ипсилон", "upsilon"],
  phi: ["фи", "phi"],
  varphi: ["фи", "phi"],
  chi: ["хи", "chi"],
  psi: ["пси", "psi"],
  omega: ["омега", "omega"],
  Gamma: ["Гамма", "Gamma"],
  Delta: ["Дельта", "Delta"],
  Theta: ["Тета", "Theta"],
  Lambda: ["Лямбда", "Lambda"],
  Pi: ["Пи", "Pi"],
  Sigma: ["Сигма", "Sigma"],
  Phi: ["Фи", "Phi"],
  Psi: ["Пси", "Psi"],
  Omega: ["Омега", "Omega"],
};

/** Как прочитать греческую букву вслух: `\gamma` → «гамма». */
export const greekReading = (tex: string): string | null => {
  const m = /^\\([a-zA-Z]+)$/.exec(normalizeTex(tex));
  return m && GREEK[m[1]] ? GREEK[m[1]][0] : null;
};

/**
 * Имя переменной в Python по соглашению ENF (docs/13_Code_Module_Python.md, п. 4.3):
 * греческая буква — названием, крышка и черта — суффиксом, штрих — `_next`,
 * звезда — `_star`, индекс — квадратными скобками.
 */
export const conventionalCodeName = (tex: string): string | null => {
  const { base, marks } = splitDecorations(tex);
  let name: string | null = null;
  const b = base.replace(/^\\(mathbf|boldsymbol|bm|mathit|mathrm)\{(.+)\}$/, "$2");
  const greek = /^\\([a-zA-Z]+)$/.exec(b);
  if (greek && GREEK[greek[1]]) name = GREEK[greek[1]][1];
  else if (/^[A-Za-z]$/.test(b)) name = b;
  else if (/^\\mathcal\{([A-Z])\}$/.test(b)) name = b.replace(/^\\mathcal\{([A-Z])\}$/, "$1");
  if (!name) return null;
  let index = "";
  for (const mk of marks) {
    if (mk.kind === "hat") name += "_hat";
    else if (mk.kind === "bar") name += "_bar";
    else if (mk.kind === "tilde") name += "_tilde";
    else if (mk.kind === "star") name += "_star";
    else if (mk.kind === "prime") name += "_next";
    else if (mk.kind === "sub" && mk.value && /^[a-z]$|^[a-z][+-]1$/.test(mk.value.replace(/\s/g, ""))) index = `[${mk.value.replace(/\s/g, " ").replace(/([+-])/, " $1 ")}]`;
    else if (mk.kind === "sub" && mk.value) {
      const g = /^\\([a-zA-Z]+)$/.exec(mk.value);
      name += "_" + (g && GREEK[g[1]] ? GREEK[g[1]][1] : mk.value.replace(/\\text\{([^}]*)\}|\\mathrm\{([^}]*)\}/g, "$1$2").replace(/[^A-Za-z0-9]/g, ""));
    } else if (mk.kind === "sup" && mk.value === "\\pi") name += "_pi";
  }
  return name + index;
};
