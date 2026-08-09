/**
 * Временное открытие всего контента (включая PRO) для всех посетителей.
 *
 * До указанного момента ProGate пропускает любого пользователя без регистрации.
 * После истечения срока платные уроки снова требуют вход/PRO.
 */
export const OPEN_ACCESS_UNTIL = new Date("2026-08-10T05:30:00Z");

export function isOpenAccessActive(now: Date = new Date()): boolean {
  return now.getTime() < OPEN_ACCESS_UNTIL.getTime();
}

/** Сколько часов осталось до закрытия свободного доступа (округление вверх). */
export function openAccessHoursLeft(now: Date = new Date()): number {
  const ms = OPEN_ACCESS_UNTIL.getTime() - now.getTime();
  return ms > 0 ? Math.ceil(ms / 3_600_000) : 0;
}
