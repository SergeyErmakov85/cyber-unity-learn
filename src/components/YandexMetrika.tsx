import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initMetrika, isMetrikaEnabled, trackPageView } from "@/lib/metrika";

/**
 * Считает просмотры страниц в Яндекс.Метрике при SPA-навигации.
 *
 * Счётчик инициализируется с `defer: true` (см. src/lib/metrika.ts), поэтому
 * автоматических просмотров нет — каждый hit отправляется отсюда, включая
 * первый. Как referer передаём предыдущий маршрут, иначе внутренние переходы
 * выглядели бы в отчётах прямыми заходами.
 *
 * Hash в URL намеренно не учитывается: переход по якорю внутри урока — это
 * не новый просмотр страницы.
 */
const YandexMetrika = () => {
  const { pathname, search } = useLocation();
  const prevUrl = useRef<string | null>(null);

  useEffect(() => {
    initMetrika();
  }, []);

  useEffect(() => {
    if (!isMetrikaEnabled()) return;

    const url = `${window.location.origin}${pathname}${search}`;
    // Защита от двойной отправки: StrictMode в dev монтирует эффекты дважды,
    // да и повторный рендер с тем же маршрутом просмотром считаться не должен.
    if (prevUrl.current === url) return;

    trackPageView(url, prevUrl.current ?? document.referrer);
    prevUrl.current = url;
  }, [pathname, search]);

  return null;
};

export default YandexMetrika;
