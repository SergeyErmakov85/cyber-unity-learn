import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface SectionNavItem {
  id: string;
  label: string;
}

interface SectionNavProps {
  items: SectionNavItem[];
  /** Offset (px) from top to consider a section "active". Defaults to 120. */
  offset?: number;
}

const SectionNav = ({ items, offset = 120 }: SectionNavProps) => {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visible = new Map<string, number>();

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visible.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
          });
          let bestId = activeId;
          let best = -1;
          visible.forEach((ratio, key) => {
            if (ratio > best) {
              best = ratio;
              bestId = key;
            }
          });
          if (bestId && best > 0) setActiveId(bestId);
        },
        { rootMargin: `-${offset}px 0px -55% 0px`, threshold: [0, 0.25, 0.5, 0.75, 1] }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, offset]);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    window.history.replaceState(null, "", `#${id}`);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  return (
    <nav
      aria-label="Навигация по уроку"
      className="sticky top-16 z-30 -mx-4 px-4 py-2 backdrop-blur-md bg-background/70 border-b border-cyan-500/10"
    >
      <ul className="flex gap-2 overflow-x-auto scrollbar-thin">
        {items.map(({ id, label }) => (
          <li key={id} className="shrink-0">
            <a
              href={`#${id}`}
              onClick={scrollTo(id)}
              className={cn(
                "inline-block px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap border",
                activeId === id
                  ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_hsl(var(--primary)/0.35)]"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-cyan-500/20"
              )}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SectionNav;
