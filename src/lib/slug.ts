/**
 * Единственная реализация slugify на сайте.
 *
 * От неё зависят ВСЕ существующие якоря: id секций хаба «Математика RL»,
 * `hubAnchor` в src/config/crosslinks.ts, deep-link'и обеих mind map и поле
 * `hub_url` во frontmatter лекций пособия (оно посчитано этой же функцией).
 *
 * Менять нельзя ни на символ. Любое изменение тихо ломает часть переходов:
 * ссылка остаётся валидной, но ведёт в никуда.
 */
export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\wа-яё]+/gi, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
