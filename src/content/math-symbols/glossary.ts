import type { SymbolEntry } from "./types";

/** Глобальный словарь символов сайта (заполняется). */
export const GLOSSARY: SymbolEntry[] = [
  {
    tex: "\\gamma",
    role: "parameter",
    name: "Коэффициент дисконтирования",
    meaning: "Число $0 \\le \\enfPar{\\gamma} < 1$: во сколько раз награда следующего шага ценится меньше текущей.",
    code: "gamma",
    codeType: "float, обычно 0.99",
  },
];
