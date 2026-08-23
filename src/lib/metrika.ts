/**
 * Яндекс.Метрика.
 *
 * Счётчик поднимается только в продакшн-сборке: засорять статистику хитами
 * с localhost и preview-сборок незачем.
 *
 * Важно про SPA. Стандартный сниппет Метрики засчитывает только первую
 * загрузку документа. У нас react-router и ~90 маршрутов, поэтому все
 * переходы между страницами Метрика без ручных hit-ов просто не увидит —
 * в отчётах осталась бы одна точка входа на весь сайт. Отсюда `defer: true`:
 * автоматический просмотр отключён, и все просмотры (включая самый первый)
 * шлёт компонент <YandexMetrika> на каждую смену маршрута.
 */

/**
 * Номер счётчика из metrika.yandex.ru → Настройки.
 * 0 означает «счётчик не подключён» — код молчит и ничего не грузит.
 *
 * При смене номера его нужно поправить и в <noscript> в index.html:
 * там пиксель для случая, когда JS выключен и этот модуль не выполняется.
 */
export const METRIKA_ID = 111876228;

type YmFn = ((id: number, action: string, ...args: unknown[]) => void) & {
  a?: unknown[][];
  l?: number;
};

declare global {
  interface Window {
    ym?: YmFn;
  }
}

const TAG_URL = "https://mc.yandex.ru/metrika/tag.js";

/** Метрика включена только в проде и только когда задан номер счётчика. */
export const isMetrikaEnabled = (): boolean => import.meta.env.PROD && METRIKA_ID > 0;

let initialized = false;

export function initMetrika(): void {
  if (!isMetrikaEnabled() || initialized) return;
  initialized = true;

  // Официальный стаб Метрики: копит вызовы в очередь, пока грузится tag.js.
  if (!window.ym) {
    const stub: YmFn = function (...args: unknown[]) {
      (stub.a = stub.a || []).push(args);
    } as YmFn;
    stub.l = Date.now();
    window.ym = stub;
  }

  if (!document.querySelector(`script[src="${TAG_URL}"]`)) {
    const script = document.createElement("script");
    script.src = TAG_URL;
    script.async = true;
    document.head.appendChild(script);
  }

  window.ym?.(METRIKA_ID, "init", {
    defer: true, // просмотры шлём вручную — см. комментарий про SPA выше
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: false,
  });
}

/** Отправляет просмотр страницы. `referrer` — URL, с которого пришли. */
export function trackPageView(url: string, referrer?: string): void {
  if (!isMetrikaEnabled()) return;
  window.ym?.(METRIKA_ID, "hit", url, referrer ? { referer: referrer } : {});
}

/**
 * Целевое действие (цель) Метрики — например, «урок пройден» или «регистрация».
 * Цель с таким идентификатором должна быть заведена в интерфейсе Метрики.
 */
export function trackGoal(goal: string, params?: Record<string, unknown>): void {
  if (!isMetrikaEnabled()) return;
  window.ym?.(METRIKA_ID, "reachGoal", goal, params);
}
