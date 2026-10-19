import type { SymbolEntry } from "./types";
import { RL_SYMBOLS } from "./glossary/rl";
import { MATH_SYMBOLS } from "./glossary/math";
import { NEUTRAL_SYMBOLS } from "./glossary/neutral";

/**
 * Глобальный словарь символов сайта — то, что показывает карточка по клику,
 * если у страницы нет своей таблицы символов или в ней нет этого символа.
 *
 * Ключ строки — пара «TeX символа + роль». Одна буква в разных ролях — разные
 * строки (`\enfTgt{r}` — награда, `\enfFun{r}` — отношение вероятностей PPO).
 * Если у пары на разных страницах разный смысл, общий словарь хранит самый
 * частый, а частный задаёт таблица страницы (src/content/math-symbols/pages).
 *
 * Полноту словаря проверяет `npm run math:audit`: каждый символ, который
 * встречается в формулах сайта, должен находиться здесь или в таблице страницы.
 */
export const GLOSSARY: SymbolEntry[] = [...RL_SYMBOLS, ...MATH_SYMBOLS, ...NEUTRAL_SYMBOLS];
