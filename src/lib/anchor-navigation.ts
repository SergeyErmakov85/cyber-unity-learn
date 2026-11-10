/** Hash может быть уже декодирован или содержать обычный знак %. */
export function decodeAnchor(hash: string): string {
  const value = hash.replace(/^#/, "");
  try { return decodeURIComponent(value); } catch { return value; }
}

/** Ждёт lazy-контент; возвращает отмену, чтобы старый переход не скроллил новую страницу. */
export function scrollToAnchorWhenReady(hash: string, scopeId?: string): () => void {
  const id = decodeAnchor(hash);
  let cancelled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = Date.now() + 10_000;
  const tick = () => {
    if (cancelled || !id) return;
    const element = scopeId && id !== scopeId
      ? document.getElementById(scopeId)?.querySelector(`#${CSS.escape(id)}`)
      : document.getElementById(id);
    // Suspense может оставить предыдущую страницу в DOM с display:none.
    if (element && element.getClientRects().length > 0) {
      element.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    } else if (Date.now() < deadline) {
      timer = setTimeout(tick, 80);
    }
  };
  const frame = requestAnimationFrame(tick);
  return () => {
    cancelled = true;
    clearTimeout(timer);
    cancelAnimationFrame(frame);
  };
}
