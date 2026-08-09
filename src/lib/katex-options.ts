import type { KatexOptions } from "katex";

/**
 * Ролевая раскраска формул Ermakov Notes Framework.
 *
 * В исходных .md пособия роль сущности задаётся макросом, а не цветом:
 * `\enfPar{\gamma}` — «это параметр», а не «это зелёное». Макрос вешает
 * CSS-класс, конкретный цвет приходит из src/styles/enf-math.css, поэтому
 * палитра меняется в одном месте и переживает смену темы.
 *
 * В Obsidian те же макросы разворачиваются в `\class{...}` (расширение html
 * MathJax). KaTeX команды `\class` не знает — её аналог `\htmlClass`.
 * Это единственное отличие пайплайна сайта от исходного.
 */
export const ENF_MACROS: Record<string, string> = {
  "\\enfVar": "\\htmlClass{enf-variable}{#1}",
  "\\enfFun": "\\htmlClass{enf-function}{#1}",
  "\\enfPar": "\\htmlClass{enf-parameter}{#1}",
  "\\enfOp": "\\htmlClass{enf-operator}{#1}",
  "\\enfTgt": "\\htmlClass{enf-target}{#1}",
  "\\enfNeu": "\\htmlClass{enf-neutral}{#1}",
};

/**
 * Общие опции KaTeX. Раскраска держится на трёх условиях сразу; нарушение
 * любого из них не даёт ошибки — формула просто становится одноцветной:
 *
 *  1. `macros` — иначе в тексте останется literal `\enfVar`;
 *  2. `trust` для `\htmlClass` — команда входит в htmlExtension и без
 *     доверия молча игнорируется;
 *  3. `strict: false` — иначе htmlExtension сыплет предупреждениями.
 *
 * Контрольная формула (обязана дать пять разных цветов):
 *   \enfOp{\mathbb{E}}\left[ \enfTgt{r} + \enfPar{\gamma}\, \enfFun{f}(\enfVar{x}) \right]
 */
export const KATEX_OPTIONS: KatexOptions = {
  throwOnError: false,
  strict: false,
  macros: { ...ENF_MACROS },
  trust: (context) => context.command === "\\htmlClass",
};
