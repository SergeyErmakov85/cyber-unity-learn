/**
 * Русское склонение существительного при числительном.
 *
 *   plural(1, "раздел", "раздела", "разделов")   → "раздел"
 *   plural(13, "раздел", "раздела", "разделов")  → "разделов"
 *   plural(51, "раздел", "раздела", "разделов")  → "раздел"
 *
 * «51 разделов» на кнопке читается как недоделка, поэтому счётчики
 * на страницах учебника идут через эту функцию.
 */
export const plural = (n: number, one: string, few: string, many: string): string => {
  const mod100 = Math.abs(n) % 100;
  if (mod100 >= 11 && mod100 <= 14) return many;
  const mod10 = mod100 % 10;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
};

/** Частый случай: «13 разделов», «51 раздел». */
export const sections = (n: number): string => `${n} ${plural(n, "раздел", "раздела", "разделов")}`;
