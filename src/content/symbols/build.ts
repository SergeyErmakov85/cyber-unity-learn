import type { EnfTone } from "@/lib/enf-roles";
import { normalizeTex } from "@/lib/enf-tex";
import { GLOBAL_SYMBOLS } from "./global";
import type { SymbolEntry } from "./types";

/**
 * Запись словаря страницы на основе общего словаря.
 *
 * Общий словарь знает, что такое $\gamma$; страница добавляет то, что зависит
 * от неё: имя переменной в её коде, значение гиперпараметра, роль в её
 * формулах. Если записи в общем словаре нет, страница обязана дать `name`
 * и `meaning` сама — иначе таблица и пояснение остались бы пустыми.
 */
export const sym = (
  tex: string,
  role: EnfTone,
  over: Omit<Partial<SymbolEntry>, "tex" | "role"> = {},
): SymbolEntry => {
  const key = normalizeTex(tex);
  const base = GLOBAL_SYMBOLS.find(
    (e) => e.role === role && [e.tex, ...(e.aliases ?? [])].map(normalizeTex).includes(key),
  );
  if (!base && !(over.name && over.meaning) && import.meta.env.DEV) {
    console.warn(`[symbols] нет общей записи для ${role} ${tex}: задайте name и meaning на странице`);
  }
  // Код страницы и код общего словаря не смешиваются: если страница назвала
  // свой код, общий не подмешивается; если нет — общий помечается как типичный.
  const { code, codeNote, ...baseRest } = base ?? ({} as Partial<SymbolEntry>);
  const pageHasCode = over.code !== undefined || over.codeNote !== undefined;
  const typical = !pageHasCode && (code !== undefined || codeNote !== undefined) ? { code, codeNote, codeTypical: true } : {};
  return {
    name: "обозначение",
    meaning: "",
    ...baseRest,
    ...typical,
    ...over,
    tex,
    role,
  };
};
