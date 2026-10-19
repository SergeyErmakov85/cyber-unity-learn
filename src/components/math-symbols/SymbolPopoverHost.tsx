import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { SymbolEntry } from "@/content/math-symbols/types";
import { decodeSymbolKey, glyphAtom } from "@/lib/enf-symbols";
import { findSymbol, loadGlobalGlossary } from "@/lib/symbol-registry";
import SymbolCard, { type SymbolHit } from "./SymbolCard";

/**
 * Карточки символов для всего сайта. Монтируется один раз в App и слушает
 * клики по документу: формулы рендерятся в десятке разных компонентов, и
 * вешать обработчик на каждый — значит однажды забыть его в одном из них.
 *
 * Клик по символу формулы открывает карточку над символом; клик мимо,
 * Escape или повторный клик по тому же символу — закрывают.
 */

interface OpenState {
  hit: SymbolHit;
  anchor: Element;
  entry?: SymbolEntry;
  scope?: string;
  loading: boolean;
}

const GAP = 12;
const MARGIN = 12;
const MAX_WIDTH = 380;

const scopeChain = (el: Element): string[] => {
  const ids: string[] = [];
  let node = el.closest("[data-enf-scope]");
  while (node) {
    const id = node.getAttribute("data-enf-scope");
    if (id) ids.push(id);
    node = node.parentElement?.closest("[data-enf-scope]") ?? null;
  }
  return ids;
};

const SymbolPopoverHost = () => {
  const [open, setOpen] = useState<OpenState | null>(null);
  const [pos, setPos] = useState<{ left: number; top: number; arrow: number; below: boolean } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const requestId = useRef(0);

  const close = useCallback(() => {
    setOpen(null);
    setPos(null);
  }, []);

  // Подсветка нажатого символа в самой формуле.
  useEffect(() => {
    const el = open?.anchor;
    el?.classList.add("enf-active");
    return () => el?.classList.remove("enf-active");
  }, [open?.anchor]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.defaultPrevented) return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (cardRef.current?.contains(target)) return;

      const katexEl = target.closest(".katex");
      if (!katexEl || katexEl.closest("[data-enf-popover]")) {
        close();
        return;
      }

      const formula = target.closest("[data-enf-tex]")?.getAttribute("data-enf-tex") ?? undefined;
      const tagged = target.closest("[data-enfs]");
      let hit: SymbolHit | null = null;
      let anchor: Element | null = null;

      if (tagged && katexEl.contains(tagged)) {
        const decoded = decodeSymbolKey(tagged.getAttribute("data-enfs") ?? "");
        if (decoded) {
          const sub = target.closest(".msupsub");
          hit = {
            atom: decoded.atom,
            coloredAs: decoded.role,
            script: !!sub && tagged.contains(sub) && !sub.contains(tagged),
            formula,
          };
          anchor = tagged;
        }
      } else {
        const glyph = glyphAtom(target, katexEl);
        if (glyph) {
          hit = { atom: glyph.atom, script: glyph.script, formula };
          anchor = glyph.anchor;
        }
      }

      if (!hit || !anchor) {
        close();
        return;
      }
      if (open && open.anchor === anchor) {
        close();
        return;
      }

      const id = ++requestId.current;
      const near = scopeChain(anchor);
      setOpen({ hit, anchor, loading: true });
      findSymbol(hit.atom, hit.coloredAs, near)
        .then(({ entry, scope }) => {
          if (requestId.current !== id) return;
          // Символ без цвета и без описания — не символ с ролью, а, скажем,
          // цифра в индексе: карточку не показываем, чтобы не было пустышек.
          if (!entry && !hit!.coloredAs) {
            close();
            return;
          }
          setOpen((prev) => (prev && prev.anchor === anchor ? { ...prev, entry, scope, loading: false } : prev));
        })
        .catch(() => {
          if (requestId.current === id) setOpen((prev) => (prev ? { ...prev, loading: false } : prev));
        });
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Словарь грузится заранее, когда браузер свободен: первый клик без задержки.
  useEffect(() => {
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const start = () => void loadGlobalGlossary().catch(() => undefined);
    if (idle) idle(start);
    else window.setTimeout(start, 2500);
  }, []);

  // Позиция: над символом, по центру; если сверху мало места — под ним.
  const place = useCallback(() => {
    if (!open || !cardRef.current) return;
    const rect = open.anchor.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      close();
      return;
    }
    const card = cardRef.current.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const center = rect.left + rect.width / 2;
    const left = Math.min(Math.max(center - card.width / 2, MARGIN), vw - card.width - MARGIN);
    const above = rect.top - card.height - GAP;
    const below = above < MARGIN && rect.bottom + GAP + card.height <= vh - MARGIN;
    const top = below ? rect.bottom + GAP : Math.max(above, MARGIN);
    const arrow = Math.min(Math.max(center - left, 18), card.width - 18);
    setPos({ left, top, arrow, below });
  }, [open, close]);

  useLayoutEffect(() => {
    place();
  }, [place, open?.entry, open?.loading]);

  useEffect(() => {
    if (!open) return;
    let frame = 0;
    const onMove = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(place);
    };
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open, place]);

  const role = open?.entry?.role ?? open?.hit.coloredAs ?? "neutral";

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key={open.hit.atom + (open.hit.coloredAs ?? "")}
          data-enf-popover=""
          role="dialog"
          aria-label="Описание символа формулы"
          initial={{ opacity: 0, scale: 0.96, y: pos?.below ? -6 : 6 }}
          animate={{ opacity: pos ? 1 : 0, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="fixed z-[100]"
          style={{
            left: pos?.left ?? -9999,
            top: pos?.top ?? 0,
            width: `min(${MAX_WIDTH}px, calc(100vw - ${MARGIN * 2}px))`,
          }}
        >
          <div ref={cardRef}>
          <SymbolCard
            hit={open.hit}
            entry={open.entry}
            loading={open.loading}
            tableId={open.scope ? `enf-symbols-${open.scope}` : undefined}
            onClose={close}
          />
          </div>
          {pos && (
            <span
              aria-hidden
              className="absolute h-3 w-3 rotate-45 border bg-popover"
              style={{
                left: pos.arrow - 6,
                [pos.below ? "top" : "bottom"]: -6,
                borderColor: `color-mix(in srgb, var(--enf-color-${role}) 55%, transparent)`,
                borderTopColor: pos.below ? undefined : "transparent",
                borderLeftColor: pos.below ? undefined : "transparent",
                borderBottomColor: pos.below ? "transparent" : undefined,
                borderRightColor: pos.below ? "transparent" : undefined,
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default SymbolPopoverHost;
