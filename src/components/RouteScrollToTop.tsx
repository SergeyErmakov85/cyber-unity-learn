import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Управляет позицией прокрутки при SPA-навигации:
 *  - без #hash — сбрасывает скролл к началу страницы (в SPA позиция по умолчанию сохраняется);
 *  - с #hash — плавно прокручивает к элементу с соответствующим id.
 *
 * Раньше hash игнорировался, и любая кросс-страничная ссылка вида
 * `/courses#level-2` приземляла пользователя в начало страницы. Теперь
 * фрагмент учитывается глобально, поэтому работают и обычные <Link>/<a>,
 * а не только специальные компоненты (HubLink, CrossLinkToHub).
 */

/**
 * Маршруты грузятся лениво, поэтому целевой элемент может появиться не сразу
 * после смены пути. Поллим DOM в пределах окна maxWaitMs.
 */
const scrollToAnchorWhenReady = (rawHash: string, maxWaitMs = 3000): boolean => {
  const id = decodeURIComponent(rawHash.replace(/^#/, ""));
  if (!id) return false;
  const deadline = Date.now() + maxWaitMs;
  const tryScroll = (): void => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (Date.now() < deadline) {
      window.requestAnimationFrame(() => window.setTimeout(tryScroll, 80));
    }
  };
  tryScroll();
  return true;
};

const RouteScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      scrollToAnchorWhenReady(hash);
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default RouteScrollToTop;
