import type { SymbolEntry } from "@/content/math-symbols/types";
import { normalizeAtom, type EnfRoleOrNeutral } from "@/lib/enf-symbols";

/**
 * Где карточка символа ищет описание.
 *
 *  1. Таблицы символов, которые сейчас смонтированы на странице. Сначала —
 *     таблица, в чьём DOM-контейнере (`data-enf-scope`) лежит формула, затем
 *     остальные таблицы страницы: у «r» в уроке про PPO смысл свой, и он
 *     важнее общего словаря.
 *  2. Глобальный словарь сайта. Он грузится лениво, при первом клике, чтобы
 *     не утяжелять первую загрузку страниц.
 *
 * Внутри каждого источника точное совпадение роли важнее совпадения буквы:
 * `\enfFun{r}` (отношение вероятностей в PPO) и `\enfTgt{r}` (награда) —
 * разные строки словаря.
 */

type Index = Map<string, SymbolEntry[]>;

const buildIndex = (entries: SymbolEntry[]): Index => {
  const index: Index = new Map();
  for (const entry of entries) {
    const key = normalizeAtom(entry.tex);
    const list = index.get(key) ?? [];
    list.push(entry);
    index.set(key, list);
  }
  return index;
};

const scopes = new Map<string, Index>();

export function registerScope(id: string, entries: SymbolEntry[]) {
  scopes.set(id, buildIndex(entries));
}

export function unregisterScope(id: string) {
  scopes.delete(id);
}

export function hasScope(id: string) {
  return scopes.has(id);
}

let globalIndex: Index | null = null;
let globalPromise: Promise<Index> | null = null;

export function loadGlobalGlossary(): Promise<Index> {
  if (globalIndex) return Promise.resolve(globalIndex);
  globalPromise ??= import("@/content/math-symbols/glossary").then((m) => {
    globalIndex = buildIndex(m.GLOSSARY);
    return globalIndex;
  });
  return globalPromise;
}

const pick = (list: SymbolEntry[] | undefined, role?: EnfRoleOrNeutral) => {
  if (!list?.length) return undefined;
  if (role) return list.find((e) => e.role === role);
  return list.find((e) => e.role === "neutral") ?? list[0];
};

export interface Lookup {
  entry?: SymbolEntry;
  /** id таблицы, из которой взята строка, если она взята из таблицы. */
  scope?: string;
}

/**
 * Ищет описание символа. `role` — роль, в которой символ окрашен в формуле;
 * для неокрашенного символа роль не известна, и подходит любая строка.
 */
export async function findSymbol(atom: string, role: EnfRoleOrNeutral | undefined, near: string[]): Promise<Lookup> {
  const key = normalizeAtom(atom);
  const order = [...near.filter((id) => scopes.has(id)), ...[...scopes.keys()].filter((id) => !near.includes(id))];

  // Точное совпадение роли — сначала в таблицах страницы, потом в словаре.
  for (const id of order) {
    const hit = pick(scopes.get(id)?.get(key), role);
    if (hit) return { entry: hit, scope: id };
  }
  const glossary = await loadGlobalGlossary();
  const exact = pick(glossary.get(key), role);
  if (exact) return { entry: exact };

  // Роль не совпала: символ мог остаться без цвета из-за лимита тонов.
  for (const id of order) {
    const hit = pick(scopes.get(id)?.get(key));
    if (hit) return { entry: hit, scope: id };
  }
  return { entry: pick(glossary.get(key)) };
}
