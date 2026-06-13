import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Сбрасывает прокрутку окна при смене пути: в SPA позиция скролла по умолчанию сохраняется.
 */
const RouteScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default RouteScrollToTop;
