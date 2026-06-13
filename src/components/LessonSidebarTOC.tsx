import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { SectionNavItem } from "@/components/SectionNav";

export type TocColor = "cyan" | "purple" | "pink" | "emerald";

interface Props {
  items: SectionNavItem[];
  color?: TocColor;
  offset?: number;
  title?: string;
}

// Styling per color: base text, active text, active glow shadow, border accents
const COLOR_MAP: Record<TocColor, {
  border: string;
  icon: string;
  title: string;
  base: string;
  baseHover: string;
  active: string;
  activeBg: string;
  activeShadow: string;
  bullet: string;
  activeBullet: string;
}> = {
  cyan: {
    border: "border-cyan-500/30",
    icon: "text-cyan-400",
    title: "text-cyan-300",
    base: "text-muted-foreground",
    baseHover: "hover:text-cyan-300",
    active: "text-cyan-300 font-semibold",
    activeBg: "bg-cyan-500/10",
    activeShadow: "shadow-[0_0_16px_hsl(var(--primary)/0.55),0_0_4px_hsl(var(--primary)/0.8)] drop-shadow-[0_0_6px_hsl(var(--primary)/0.7)]",
    bullet: "text-muted-foreground/60",
    activeBullet: "text-cyan-300",
  },
  purple: {
    border: "border-purple-500/30",
    icon: "text-purple-400",
    title: "text-purple-300",
    base: "text-muted-foreground",
    baseHover: "hover:text-purple-300",
    active: "text-purple-300 font-semibold",
    activeBg: "bg-purple-500/10",
    activeShadow: "shadow-[0_0_16px_hsl(280_85%_65%/0.55),0_0_4px_hsl(280_85%_65%/0.85)] drop-shadow-[0_0_6px_hsl(280_85%_65%/0.7)]",
    bullet: "text-muted-foreground/60",
    activeBullet: "text-purple-300",
  },
  pink: {
    border: "border-pink-500/30",
    icon: "text-pink-400",
    title: "text-pink-300",
    base: "text-muted-foreground",
    baseHover: "hover:text-pink-300",
    active: "text-pink-300 font-semibold",
    activeBg: "bg-pink-500/10",
    activeShadow: "shadow-[0_0_16px_hsl(330_85%_65%/0.55),0_0_4px_hsl(330_85%_65%/0.85)] drop-shadow-[0_0_6px_hsl(330_85%_65%/0.7)]",
    bullet: "text-muted-foreground/60",
    activeBullet: "text-pink-300",
  },
  emerald: {
    border: "border-emerald-500/30",
    icon: "text-emerald-400",
    title: "text-emerald-300",
    base: "text-muted-foreground",
    baseHover: "hover:text-emerald-300",
    active: "text-emerald-300 font-semibold",
    activeBg: "bg-emerald-500/10",
    activeShadow: "shadow-[0_0_16px_hsl(160_85%_55%/0.55),0_0_4px_hsl(160_85%_55%/0.85)] drop-shadow-[0_0_6px_hsl(160_85%_55%/0.7)]",
    bullet: "text-muted-foreground/60",
    activeBullet: "text-emerald-300",
  },
};

const LessonSidebarTOC = ({ items, color = "cyan", offset = 120, title = "Содержание" }: Props) => {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const c = COLOR_MAP[color];

  useEffect(() => {
    const visible = new Map<string, number>();
    const observers: IntersectionObserver[] = [];

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visible.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
          });
          let bestId = "";
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
    <aside
      aria-label="Содержание урока"
      className="hidden xl:block fixed left-4 2xl:left-8 top-32 w-60 2xl:w-64 z-30"
    >
      <Card className={cn("bg-card/70 backdrop-blur-md", c.border)}>
        <CardContent className="p-4 2xl:p-5">
          <h2 className={cn("text-base 2xl:text-lg font-bold mb-3 flex items-center gap-2", c.title)}>
            <BookOpen className={cn("w-5 h-5", c.icon)} />
            {title}
          </h2>
          <ul className="space-y-1.5 text-sm max-h-[65vh] overflow-y-auto pr-1 scrollbar-thin">
            {items.map(({ id, label }) => {
              const isActive = activeId === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={scrollTo(id)}
                    className={cn(
                      "block px-2 py-1.5 rounded-md transition-all border border-transparent leading-snug",
                      isActive
                        ? cn(c.active, c.activeBg, c.activeShadow)
                        : cn(c.base, c.baseHover)
                    )}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
};

export default LessonSidebarTOC;
