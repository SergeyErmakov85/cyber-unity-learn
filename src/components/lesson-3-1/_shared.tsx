import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Info, Link2, Gamepad2, AlertTriangle } from "lucide-react";

/** Gradient section title (Orbitron-feel, cyan→purple→pink) — one per <section>. */
export const SECTION_TITLE_CLASS =
  "text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6";

/** H3 sub-heading inside a section. */
export const H3_CLASS = "text-xl font-bold text-foreground mt-8 mb-3";

/** Standard reading paragraph — bright text for dark backgrounds. */
export const ProseP = ({ children }: { children: ReactNode }) => (
  <p className="text-[15px] md:text-base text-foreground/90 leading-[1.75] mb-4">{children}</p>
);

/**
 * "Ключевые моменты раздела" — glassmorphism card with neon cyan left rail.
 * The signature repeating element of every lesson section.
 */
export const KeyPoints = ({ items }: { items: ReactNode[] }) => (
  <Card className="mt-8 border-l-4 border-l-cyan-400 border-y border-r border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-transparent backdrop-blur-sm">
    <CardContent className="p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_8px_hsl(var(--primary)/0.7)]" />
        <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
          Ключевые моменты
        </h4>
      </div>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-foreground/90 leading-relaxed">
            <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const CALLOUT_STYLES: Record<string, { wrap: string; icon: string; title: string }> = {
  amber: {
    wrap: "border-amber-500/30 bg-amber-500/5",
    icon: "text-amber-400",
    title: "text-amber-300",
  },
  purple: {
    wrap: "border-purple-500/30 bg-purple-500/5",
    icon: "text-purple-400",
    title: "text-purple-300",
  },
  cyan: {
    wrap: "border-cyan-500/30 bg-cyan-500/5",
    icon: "text-cyan-400",
    title: "text-cyan-300",
  },
};

/** Accent inset box for "Важная тонкость", "Замечание", "Связь с…". */
export const Callout = ({
  title,
  color = "amber",
  children,
}: {
  title: string;
  color?: "amber" | "purple" | "cyan";
  children: ReactNode;
}) => {
  const s = CALLOUT_STYLES[color];
  return (
    <div className={`my-6 rounded-xl border ${s.wrap} backdrop-blur-sm p-5`}>
      <div className="flex items-center gap-2 mb-2">
        <Info className={`w-4 h-4 ${s.icon} shrink-0`} />
        <span className={`font-bold text-sm ${s.title}`}>{title}</span>
      </div>
      <div className="text-sm text-foreground/85 leading-relaxed space-y-2">{children}</div>
    </div>
  );
};

/** Placeholder box for the optional "Интерактив (рекомендация…)" visualizations. */
export const InteractiveStub = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="my-6 rounded-xl border border-dashed border-pink-500/40 bg-pink-500/5 backdrop-blur-sm p-5">
    <div className="flex items-center gap-2 mb-2">
      <Gamepad2 className="w-4 h-4 text-pink-400 shrink-0" />
      <span className="font-bold text-sm text-pink-300">🎛 {title} — в разработке</span>
    </div>
    <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
  </div>
);

/** Small warning/danger note. */
export const WarnNote = ({ children }: { children: ReactNode }) => (
  <div className="my-4 flex gap-2.5 rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-foreground/85">
    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
    <div className="leading-relaxed">{children}</div>
  </div>
);

/** In-page anchor link (jumps to another section of this lesson). */
export const Anchor = ({ to, children }: { to: string; children: ReactNode }) => (
  <a
    href={`#${to}`}
    className="inline-flex items-center gap-0.5 text-cyan-300 hover:text-cyan-200 hover:underline transition-colors"
  >
    <Link2 className="inline w-3 h-3" />
    {children}
  </a>
);

/** Inline code chip used inside prose. */
export const Code = ({ children }: { children: ReactNode }) => (
  <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs font-mono text-cyan-200">{children}</code>
);
