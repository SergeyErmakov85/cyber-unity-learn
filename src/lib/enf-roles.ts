/**
 * Пять ролей Ermakov Notes Framework и служебный нейтральный тон.
 *
 * Единственное место, где роль связана с подписью, подсказкой, макросом и
 * CSS-классом. Цвет здесь не задаётся никогда — он живёт в
 * src/styles/enf-math.css и приходит по классу `enf-<role>`.
 */
export type EnfRole = "variable" | "function" | "parameter" | "operator" | "target";
export type EnfTone = EnfRole | "neutral";

export interface RoleMeta {
  /** Подпись роли в таблицах и всплывающих пояснениях. */
  label: string;
  /** Что роль означает — одной фразой. */
  hint: string;
  /** Макрос раскраски, без обратной косой черты. */
  macro: string;
  /** CSS-класс тона. */
  cls: string;
}

export const ROLE_META: Record<EnfTone, RoleMeta> = {
  variable: {
    label: "переменная",
    hint: "объект, над которым действуем: состояние, аргумент, входные данные",
    macro: "enfVar",
    cls: "enf-variable",
  },
  function: {
    label: "функция",
    hint: "действие или преобразование: функция, действие агента, политика как отображение, слой сети",
    macro: "enfFun",
    cls: "enf-function",
  },
  parameter: {
    label: "параметр",
    hint: "то, что настраивается и обучается: веса, коэффициенты, гиперпараметры",
    macro: "enfPar",
    cls: "enf-parameter",
  },
  operator: {
    label: "оператор",
    hint: "агрегат или свёртка: сумма, ожидание, градиент, функции ценности",
    macro: "enfOp",
    cls: "enf-operator",
  },
  target: {
    label: "цель",
    hint: "то, к чему стремимся: награда, функция потерь, целевое значение",
    macro: "enfTgt",
    cls: "enf-target",
  },
  neutral: {
    label: "служебный",
    hint: "индексы, счётчики, знаки операций, скобки и множества — тона не получают",
    macro: "enfNeu",
    cls: "enf-neutral",
  },
};

/** Порядок ролей в таблицах: объект → действие → настройка → агрегат → цель. */
export const ROLE_ORDER: EnfTone[] = ["variable", "function", "parameter", "operator", "target", "neutral"];

/** Макрос → роль. Ключи без обратной косой черты. */
export const MACRO_ROLE: Record<string, EnfTone> = {
  enfVar: "variable",
  enfFun: "function",
  enfPar: "parameter",
  enfOp: "operator",
  enfTgt: "target",
  enfNeu: "neutral",
};

/** Роль по CSS-классу элемента, который создал макрос. */
export const roleFromClassList = (classList: DOMTokenList): EnfTone | null => {
  for (const tone of ROLE_ORDER) if (classList.contains(ROLE_META[tone].cls)) return tone;
  return null;
};

/** `\enfPar{\gamma}` по роли и TeX символа. */
export const wrapRole = (role: EnfTone, tex: string): string => `\\${ROLE_META[role].macro}{${tex}}`;
