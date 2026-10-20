import { findEnfCalls, normalizeTex, readTail } from "@/lib/enf-tex";
import type { EnfTone } from "@/lib/enf-roles";
import type { SymbolEntry } from "@/content/symbols/types";

/**
 * Словарь символов лекции учебника — из её собственных таблиц.
 *
 * По ENF у каждой лекции есть таблица «Обозначения» (символ, значение, роль),
 * а у лекций с кодом — «От формулы к коду» (символ, смысл, в коде, тип и
 * форма). Пояснение по клику на символ в лекции берёт текст отсюда: автор
 * пособия уже сформулировал смысл каждого обозначения, пересказывать его
 * второй раз в коде сайта незачем.
 */

const ROLE_WORDS: Record<string, EnfTone> = {
  variable: "variable",
  function: "function",
  parameter: "parameter",
  operator: "operator",
  target: "target",
  neutral: "neutral",
  нейтральный: "neutral",
};

const splitRow = (line: string) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    // `\|` внутри формулы — не разделитель колонок.
    .split(/(?<!\\)\|/)
    .map((c) => c.trim());

const findCol = (header: string[], ...names: RegExp[]) =>
  header.findIndex((h) => names.some((n) => n.test(h)));

const shortName = (meaning: string) => {
  const plain = meaning.replace(/\*([^*]+)\*/g, "$1").trim();
  const cut = plain.split(/ — |; |\. /)[0];
  return (cut.length <= 80 ? cut : plain.slice(0, 77) + "…").replace(/[.,;:]$/, "");
};

const codesOf = (cell: string) => {
  const ticks = [...cell.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
  return ticks.length ? ticks : cell ? [cell] : [];
};

/** Символы из ячейки «Символ»: каждый макрос роли — отдельная запись. */
const symbolsOf = (cell: string, roleWord?: string): { tex: string; role: EnfTone }[] => {
  const tex = cell.replace(/\$/g, "");
  const calls = findEnfCalls(tex).filter((c) => c.role !== "neutral");
  if (calls.length) {
    const seen = new Set<string>();
    return calls
      .map((c) => ({ tex: c.inner + readTail(tex, c.end), role: c.role }))
      .filter((s) => {
        const k = s.role + normalizeTex(s.tex);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
  }
  const role = roleWord ? ROLE_WORDS[roleWord.replace(/[`*]/g, "").trim().split(/\s/)[0].toLowerCase()] : undefined;
  // «$a, a'$» — два символа, а не один.
  return tex
    .split(/,(?![^{]*\})/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => ({ tex: t, role: role ?? "neutral" }));
};

export const parseNotationTables = (markdown: string): SymbolEntry[] => {
  const lines = markdown.split(/\r?\n/);
  const out = new Map<string, SymbolEntry>();

  for (let i = 0; i + 2 < lines.length; i++) {
    const header = lines[i].trim();
    if (!header.startsWith("|") || !/^\|?\s*:?-{3,}/.test(lines[i + 1].trim())) continue;
    const cols = splitRow(header).map((h) => h.toLowerCase());
    const symCol = findCol(cols, /^символ/);
    if (symCol < 0) continue;
    const meanCol = findCol(cols, /^значение/, /^смысл/);
    const roleCol = findCol(cols, /^роль/);
    const codeCol = findCol(cols, /^в коде/, /^python/);
    const typeCol = findCol(cols, /^тип/);

    let j = i + 2;
    for (; j < lines.length && lines[j].trim().startsWith("|"); j++) {
      const cells = splitRow(lines[j]);
      const meaning = meanCol >= 0 ? cells[meanCol] ?? "" : "";
      for (const s of symbolsOf(cells[symCol] ?? "", roleCol >= 0 ? cells[roleCol] : undefined)) {
        const key = `${s.role}:${normalizeTex(s.tex)}`;
        const prev = out.get(key);
        const code = codeCol >= 0 ? codesOf(cells[codeCol] ?? "") : [];
        const note = typeCol >= 0 ? cells[typeCol] : undefined;
        if (prev) {
          if (code.length && !prev.code) prev.code = code;
          if (note && !prev.codeNote) prev.codeNote = note;
          if (meaning && !prev.meaning) {
            prev.meaning = meaning;
            prev.name = shortName(meaning);
          }
          continue;
        }
        out.set(key, {
          tex: s.tex,
          role: s.role,
          name: meaning ? shortName(meaning) : "обозначение лекции",
          meaning,
          code: code.length ? code : undefined,
          codeNote: note || undefined,
        });
      }
    }
    i = j - 1;
  }
  return [...out.values()];
};
