import katex from "katex";
import { KATEX_OPTIONS } from "@/lib/katex-options";
import { roleFromClassList, type EnfTone } from "@/lib/enf-roles";
import { conventionalCodeName, findEnfCalls, normalizeTex, splitDecorations, type Mark } from "@/lib/enf-tex";
import { GLOBAL_SYMBOLS } from "@/content/symbols/global";
import { GLYPHS } from "@/content/symbols/glyphs";
import type { GlyphEntry, SymbolEntry } from "@/content/symbols/types";
import { registrationsFor } from "./registry";

/** Что показать во всплывающем пояснении. */
export interface ResolvedSymbol {
  /** Тон, которым символ окрашен в формуле. */
  tone: EnfTone;
  /** Роль из словаря, если символ в формуле нейтрален, а словарь знает его роль. */
  declaredRole?: EnfTone;
  /** TeX для крупного показа. */
  tex: string;
  name: string;
  meaning?: string;
  inFormula?: string;
  code?: string[];
  codeNote?: string;
  /** Имя по соглашению ENF, если в словаре кода нет. */
  conventionalCode?: string;
  /** Украшения записи, которые надо объяснить отдельно (крышка, штрих, индекс). */
  marks: Mark[];
  /** Почему символ без цвета. */
  neutralReason?: string;
  /** Откуда взято пояснение. */
  source: "page" | "global" | "glyph" | "generic";
  /** id таблицы символов страницы, если пояснение из неё. */
  tableId?: string;
}

// ── Глифы ───────────────────────────────────────────────────────────────

const glyphCache = new Map<string, string>();

/** Как запись выглядит после рендера KaTeX — текст без разметки. */
export const glyphOf = (tex: string): string => {
  const cached = glyphCache.get(tex);
  if (cached !== undefined) return cached;
  let text = "";
  try {
    const host = document.createElement("span");
    katex.render(tex, host, { ...KATEX_OPTIONS, displayMode: false, throwOnError: true });
    text = cleanGlyph(host.querySelector(".katex-html")?.textContent ?? "");
  } catch {
    text = "";
  }
  glyphCache.set(tex, text);
  return text;
};

export const cleanGlyph = (s: string) => s.replace(/[​‌‍⁡ \s]/g, "");

/** Текст элемента без индексов и степеней. */
const ownText = (el: Element): string => {
  let out = "";
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) out += node.textContent ?? "";
    else if (node instanceof Element && !node.classList.contains("msupsub")) node.childNodes.forEach(walk);
  };
  el.childNodes.forEach(walk);
  return cleanGlyph(out);
};

const GREEK_BY_GLYPH: Record<string, string> = {
  α: "\\alpha", β: "\\beta", γ: "\\gamma", δ: "\\delta", ε: "\\varepsilon", ϵ: "\\epsilon", ζ: "\\zeta",
  η: "\\eta", θ: "\\theta", ϑ: "\\vartheta", ι: "\\iota", κ: "\\kappa", λ: "\\lambda", μ: "\\mu", ν: "\\nu",
  ξ: "\\xi", π: "\\pi", ρ: "\\rho", σ: "\\sigma", τ: "\\tau", υ: "\\upsilon", ϕ: "\\phi", φ: "\\varphi",
  χ: "\\chi", ψ: "\\psi", ω: "\\omega", Γ: "\\Gamma", Δ: "\\Delta", Θ: "\\Theta", Λ: "\\Lambda",
  Ξ: "\\Xi", Π: "\\Pi", Σ: "\\Sigma", Φ: "\\Phi", Ψ: "\\Psi", Ω: "\\Omega",
};

// ── Поиск в словарях ────────────────────────────────────────────────────

const keysOf = (e: SymbolEntry) => [e.tex, ...(e.aliases ?? [])].map(normalizeTex);

const pick = (list: SymbolEntry[], key: string, role?: EnfTone): SymbolEntry | undefined =>
  (role && list.find((e) => e.role === role && keysOf(e).includes(key))) || list.find((e) => keysOf(e).includes(key));

interface Found {
  entry: SymbolEntry;
  source: "page" | "global";
  tableId?: string;
}

const findByKey = (key: string, role: EnfTone | undefined, target: Element, withGlobal: boolean): Found | undefined => {
  for (const reg of registrationsFor(target)) {
    const entry = pick(reg.entries, key, role);
    if (entry) return { entry, source: "page", tableId: reg.tableId };
  }
  if (!withGlobal) return undefined;
  const entry = pick(GLOBAL_SYMBOLS, key, role);
  return entry ? { entry, source: "global" } : undefined;
};

/** Ищет запись по TeX; если точной нет — по основе без украшений. */
const findSymbol = (tex: string, role: EnfTone | undefined, target: Element, withGlobal = true) => {
  const key = normalizeTex(tex);
  const exact = findByKey(key, role, target, withGlobal);
  if (exact) return { found: exact, marks: [] as Mark[] };
  const { base, marks } = splitDecorations(tex);
  const plain = base.replace(/^\\(mathbf|boldsymbol|bm)\{(.+)\}$/, "$2");
  for (const candidate of [base, plain]) {
    if (candidate === key) continue;
    const found = findByKey(normalizeTex(candidate), role, target, withGlobal);
    if (found) return { found, marks };
  }
  return { found: undefined as Found | undefined, marks };
};

const asList = (code?: string | string[]) => (code === undefined ? undefined : Array.isArray(code) ? code : [code]);

// ── Разрешение клика ────────────────────────────────────────────────────

const NEUTRAL_KINDS = ["mop", "mbin", "mrel", "mopen", "mclose", "mpunct", "minner", "mord"] as const;

const countTones = (html: Element) => {
  const tones = new Set<EnfTone>();
  html.querySelectorAll(".enf-sym").forEach((el) => {
    const t = roleFromClassList(el.classList);
    if (t && t !== "neutral") tones.add(t);
  });
  return tones.size;
};

const neutralReasonFor = (el: Element, html: Element, isLetter: boolean): string => {
  if (el.closest(".msupsub")) {
    return "Символ стоит в индексе или степени. По правилам ENF индексы и показатели не окрашиваются: их положение уже отличает их от основной строки.";
  }
  if (isLetter && countTones(html) >= 4) {
    return "В этой формуле уже четыре цветовые роли — предел учебного режима ENF. Чтобы формула не превратилась в рябь, эту роль здесь оставили нейтральной.";
  }
  if (isLetter) {
    return "Здесь символ оставлен без цвета: это связанная переменная (её перебирают под знаком суммы или максимума) или служебное обозначение.";
  }
  return "Знаки операций, скобки, индексы и служебные операторы по правилам ENF тона не получают — цвет остаётся за ролями величин.";
};

/** Окрашенный символ: роль из класса, запись — из исходной формулы. */
const resolveRoleSymbol = (sym: Element, html: Element): ResolvedSymbol => {
  const tone = roleFromClassList(sym.classList) ?? "neutral";
  const glyph = cleanGlyph(sym.textContent ?? "");
  const source = sym.closest(".katex")?.querySelector('annotation[encoding="application/x-tex"]')?.textContent ?? "";
  const calls = findEnfCalls(source).filter((c) => c.role === tone);
  let tex = calls.find((c) => glyphOf(c.inner) === glyph)?.inner;
  if (!tex) {
    // Глиф не совпал (редкая конструкция KaTeX): берём любой вызов той же роли с похожим глифом.
    tex = calls.find((c) => glyph.startsWith(glyphOf(c.inner)) || glyphOf(c.inner).startsWith(glyph))?.inner;
  }
  if (!tex) tex = glyph;

  const { found, marks } = findSymbol(tex, tone, sym);
  if (found) {
    const e = found.entry;
    return {
      tone,
      declaredRole: e.role !== tone ? e.role : undefined,
      tex,
      name: e.name,
      meaning: e.meaning,
      inFormula: e.inFormula,
      code: asList(e.code),
      codeNote: e.codeNote,
      conventionalCode: e.code ? undefined : conventionalCodeName(tex) ?? undefined,
      marks,
      source: found.source,
      tableId: found.tableId,
    };
  }
  return {
    tone,
    tex,
    name: "обозначение формулы",
    marks,
    conventionalCode: conventionalCodeName(tex) ?? undefined,
    source: "generic",
  };
};

const glyphMatches = (g: GlyphEntry, glyph: string, kinds: Set<string>, inScript: boolean) => {
  if (!g.glyphs.includes(glyph)) return false;
  if (g.kinds && !g.kinds.some((k) => kinds.has(k))) return false;
  if (g.where === "script" && !inScript) return false;
  if (g.where === "main" && inScript) return false;
  return true;
};

/** Нейтральный символ: буква, знак, оператор, скобка. */
const resolveNeutral = (target: Element, html: Element): { el: Element; resolved: ResolvedSymbol } | null => {
  let el: Element | null = target;
  while (el && el !== html && !NEUTRAL_KINDS.some((k) => el!.classList.contains(k))) el = el.parentElement;
  if (!el || el === html) return null;
  // Внешний mop у \max_{a'} содержит индекс; внутренний — само имя.
  const glyph = el.classList.contains("mop") ? ownText(el) : cleanGlyph(el.textContent ?? "");
  if (!glyph || /^[0-9.,]+$/.test(glyph)) return null;

  const kinds = new Set<string>(el.classList);
  const inScript = !!el.closest(".msupsub");
  const isLetter = kinds.has("mathnormal") || kinds.has("mathcal") || kinds.has("mathbb") || kinds.has("boldsymbol") || kinds.has("mathbf");

  // Буква, у которой на странице есть роль: π, P, a в длинных формулах Беллмана.
  if (isLetter) {
    let tex = GREEK_BY_GLYPH[glyph] ?? glyph;
    if (kinds.has("mathcal")) tex = `\\mathcal{${glyph}}`;
    else if (kinds.has("mathbb")) tex = `\\mathbb{${glyph}}`;
    else if (kinds.has("mathbf") || kinds.has("boldsymbol")) tex = `\\mathbf{${GREEK_BY_GLYPH[glyph] ?? glyph}}`;
    // Сначала словарь страницы; для ажурных и каллиграфических букв (𝔼, 𝒮)
    // общий смысл знака важнее случайного совпадения в общем словаре.
    const special = kinds.has("mathbb") || kinds.has("mathcal") ? GLYPHS.find((g) => glyphMatches(g, glyph, kinds, inScript)) : undefined;
    const found = findSymbol(tex, undefined, el, false).found ?? (special ? undefined : findSymbol(tex, undefined, el).found);
    if (found) {
      const e = found.entry;
      return {
        el,
        resolved: {
          tone: "neutral",
          declaredRole: e.role !== "neutral" ? e.role : undefined,
          tex,
          name: e.name,
          meaning: e.meaning,
          inFormula: e.inFormula,
          code: asList(e.code),
          codeNote: e.codeNote,
          marks: [],
          neutralReason: neutralReasonFor(el, html, true),
          source: found.source,
          tableId: found.tableId,
        },
      };
    }
  }

  const g = GLYPHS.find((x) => glyphMatches(x, glyph, kinds, inScript));
  if (!g) return null;
  return {
    el,
    resolved: {
      tone: "neutral",
      tex: g.tex,
      name: g.name,
      meaning: g.meaning,
      inFormula: g.inFormula,
      code: asList(g.code),
      codeNote: g.codeNote,
      marks: [],
      neutralReason: neutralReasonFor(el, html, isLetter),
      source: "glyph",
    },
  };
};

/** Главная точка входа: что за символ под кликом и что о нём сказать. */
export const resolveClick = (target: Element): { el: Element; resolved: ResolvedSymbol } | null => {
  const html = target.closest(".katex-html");
  if (!html) return null;
  const sym = target.closest(".enf-sym");
  if (sym && html.contains(sym)) return { el: sym, resolved: resolveRoleSymbol(sym, html) };
  return resolveNeutral(target, html);
};
