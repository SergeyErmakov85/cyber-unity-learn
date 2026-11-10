import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TEXTBOOK_PARTS } from "@/content/textbook/parts";
import { scrollToAnchorWhenReady } from "@/lib/anchor-navigation";

/** Общая прокрутка для ссылок и истории браузера, с отменой предыдущего перехода. */
const RouteScrollToTop = () => {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    if (hash) {
      const part = TEXTBOOK_PARTS.find(entry => entry.hubRoute === pathname);
      return scrollToAnchorWhenReady(hash, part?.sitePartId);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, key]);
  return null;
};

export default RouteScrollToTop;
