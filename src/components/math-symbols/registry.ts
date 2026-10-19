import { useEffect, type RefObject } from "react";
import type { SymbolEntry } from "@/content/symbols/types";

/**
 * Словари символов, которые сейчас смонтированы на странице.
 *
 * Таблица символов (SymbolTable), невидимый словарь (SymbolGlossary) и лекция
 * учебника регистрируют здесь свои записи. Всплывающее пояснение ищет символ
 * сначала в словаре того же блока страницы (ближайший `[data-symbol-scope]`),
 * затем в остальных словарях страницы и только потом в общем словаре сайта.
 */
export interface Registration {
  id: number;
  entries: SymbolEntry[];
  /** Элемент, рядом с которым словарь смонтирован, — для выбора области. */
  anchor: HTMLElement | null;
  /** id таблицы символов, чтобы из пояснения можно было к ней перейти. */
  tableId?: string;
}

const registrations = new Map<number, Registration>();
let sequence = 0;

export const registerSymbols = (
  entries: SymbolEntry[],
  anchor: HTMLElement | null,
  tableId?: string,
): (() => void) => {
  const id = ++sequence;
  registrations.set(id, { id, entries, anchor, tableId });
  return () => {
    registrations.delete(id);
  };
};

/** Словари в порядке приоритета для символа `target`. */
export const registrationsFor = (target: Element): Registration[] => {
  const all = [...registrations.values()].reverse();
  const inScope = (r: Registration) => {
    const scope = r.anchor?.closest("[data-symbol-scope]");
    return !!scope && scope.contains(target);
  };
  return [...all.filter(inScope), ...all.filter((r) => !inScope(r))];
};

/** Регистрирует записи, пока компонент смонтирован. */
export const useRegisterSymbols = (
  entries: SymbolEntry[] | undefined,
  anchorRef: RefObject<HTMLElement>,
  tableId?: string,
) => {
  useEffect(() => {
    if (!entries || entries.length === 0) return;
    return registerSymbols(entries, anchorRef.current, tableId);
  }, [entries, anchorRef, tableId]);
};
