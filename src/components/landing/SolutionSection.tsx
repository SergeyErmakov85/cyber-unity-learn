import { Lightbulb, Code2, Gamepad2, Trophy } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type PieceColor = "primary" | "secondary" | "accent" | "emerald";

const PIECES: {
  title: string;
  desc: string;
  Icon: typeof Lightbulb;
  color: PieceColor;
  stroke: string;
  glow: string;
  iconShadow: string;
  href: string;
}[] = [
  {
    title: "Теория и математика",
    desc: "Визуализация формул и интуитивные объяснения алгоритмов",
    Icon: Lightbulb,
    color: "primary",
    stroke: "hsl(180 100% 50%)",
    glow: "hsl(180 100% 50% / 0.55)",
    iconShadow: "0 0 24px hsl(180 100% 50% / 0.55)",
    href: "/hub/math-rl",
  },
  {
    title: "Код на PyTorch",
    desc: "Чистые реализации алгоритмов с подробными комментариями",
    Icon: Code2,
    color: "secondary",
    stroke: "hsl(280 85% 65%)",
    glow: "hsl(280 85% 65% / 0.55)",
    iconShadow: "0 0 24px hsl(280 85% 65% / 0.55)",
    href: "/hub/pytorch",
  },
  {
    title: "Игровые среды Unity",
    desc: "Обучение агентов в реальных 3D-окружениях",
    Icon: Gamepad2,
    color: "accent",
    stroke: "hsl(330 85% 65%)",
    glow: "hsl(330 85% 65% / 0.55)",
    iconShadow: "0 0 24px hsl(330 85% 65% / 0.55)",
    href: "/hub/unity-ml-agents",
  },
  {
    title: "Реальные результаты",
    desc: "Работающие агенты и портфолио проектов",
    Icon: Trophy,
    color: "emerald",
    stroke: "hsl(142 76% 50%)",
    glow: "hsl(142 76% 50% / 0.55)",
    iconShadow: "0 0 24px hsl(142 76% 50% / 0.55)",
    href: "/unity-projects",
  },
];

// ---- Puzzle piece geometry (viewBox units) ----
const VB_W = 1240;
const VB_H = 320;
const P_Y = 40;
const P_H = 220;
const P_W = 280;
const P_X0 = 60;
const CORNER = 18;
const TAB_R = 26;

const piecePath = (i: number) => {
  const x = P_X0 + i * P_W;
  const w = P_W;
  const y = P_Y;
  const h = P_H;
  const cy = y + h / 2;
  const hasLeft = i > 0;
  const hasRight = i < PIECES.length - 1;
  const r = CORNER;
  const t = TAB_R;
  // Cubic control offset for a clean rounded tab/notch
  const k = t * 1.35;

  let d = `M ${x + r},${y} L ${x + w - r},${y} Q ${x + w},${y} ${x + w},${y + r}`;
  if (hasRight) {
    d += ` L ${x + w},${cy - t}`;
    d += ` C ${x + w + k},${cy - t} ${x + w + k},${cy + t} ${x + w},${cy + t}`;
  }
  d += ` L ${x + w},${y + h - r} Q ${x + w},${y + h} ${x + w - r},${y + h}`;
  d += ` L ${x + r},${y + h} Q ${x},${y + h} ${x},${y + h - r}`;
  if (hasLeft) {
    d += ` L ${x},${cy + t}`;
    d += ` C ${x + k},${cy + t} ${x + k},${cy - t} ${x},${cy - t}`;
  }
  d += ` L ${x},${y + r} Q ${x},${y} ${x + r},${y} Z`;
  return d;
};

// Position of each piece center in % for overlay placement
const pieceCenterPct = (i: number) => {
  const cx = P_X0 + i * P_W + P_W / 2;
  const cy = P_Y + P_H / 2;
  return { left: `${(cx / VB_W) * 100}%`, top: `${(cy / VB_H) * 100}%` };
};

const SolutionSection = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <section id="solution" className="py-20 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Lightbulb className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Наше решение</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              Мост между теорией и практикой
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Платформа, которая связывает математику, код и реальные игровые среды
          </p>
        </div>

        {/* ===== Desktop: puzzle-piece bridge ===== */}
        <div className="hidden md:block max-w-6xl mx-auto">
          <div className="relative w-full" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              className="absolute inset-0 w-full h-full pointer-events-none"
              aria-hidden="true"
            >
              <defs>
                {/* Neon gradient sweeping across the whole bridge */}
                <linearGradient id="archGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(180 100% 50%)" />
                  <stop offset="33%" stopColor="hsl(280 85% 65%)" />
                  <stop offset="66%" stopColor="hsl(330 85% 65%)" />
                  <stop offset="100%" stopColor="hsl(142 76% 50%)" />
                </linearGradient>

                {/* Filter for soft neon glow */}
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Per-piece fills (very subtle tinted dark) */}
                {PIECES.map((p, i) => (
                  <linearGradient key={`fill-${i}`} id={`pieceFill-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(222 47% 8% / 0.85)" />
                    <stop offset="100%" stopColor="hsl(222 47% 5% / 0.95)" />
                  </linearGradient>
                ))}
              </defs>

              {/* Bridge arch sweeping above the pieces */}
              <path
                d={`M ${P_X0},${P_Y + P_H - 10}
                    Q ${VB_W / 2},${-VB_H * 0.55} ${P_X0 + PIECES.length * P_W},${P_Y + P_H - 10}`}
                fill="none"
                stroke="url(#archGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.55"
                filter="url(#neonGlow)"
              />
              {/* Subtle inner arch for depth */}
              <path
                d={`M ${P_X0 + 40},${P_Y + P_H - 30}
                    Q ${VB_W / 2},${-VB_H * 0.35} ${P_X0 + PIECES.length * P_W - 40},${P_Y + P_H - 30}`}
                fill="none"
                stroke="url(#archGradient)"
                strokeWidth="1"
                strokeDasharray="2 6"
                opacity="0.35"
              />

              {/* Bridge deck line under all pieces */}
              <line
                x1={P_X0 - 10}
                y1={P_Y + P_H + 16}
                x2={P_X0 + PIECES.length * P_W + 10}
                y2={P_Y + P_H + 16}
                stroke="url(#archGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.45"
              />

              {/* Puzzle pieces */}
              {PIECES.map((p, i) => {
                const d = piecePath(i);
                const isHover = hovered === i;
                return (
                  <g key={p.title} style={{ transition: "opacity 200ms" }}>
                    {/* Outer glow */}
                    <path
                      d={d}
                      fill="none"
                      stroke={p.stroke}
                      strokeWidth={isHover ? 10 : 6}
                      opacity={isHover ? 0.55 : 0.25}
                      filter="url(#neonGlow)"
                      style={{ transition: "all 200ms ease-out" }}
                    />
                    {/* Solid fill */}
                    <path d={d} fill={`url(#pieceFill-${i})`} />
                    {/* Crisp stroke */}
                    <path
                      d={d}
                      fill="none"
                      stroke={p.stroke}
                      strokeWidth={isHover ? 2.75 : 1.75}
                      opacity={isHover ? 1 : 0.85}
                      style={{ transition: "all 200ms ease-out" }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Content overlays positioned over each piece — clickable */}
            {PIECES.map((p, i) => {
              const pos = pieceCenterPct(i);
              const Icon = p.Icon;
              const isHover = hovered === i;
              return (
                <button
                  key={`overlay-${p.title}`}
                  type="button"
                  onClick={() => navigate(p.href)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered((h) => (h === i ? null : h))}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered((h) => (h === i ? null : h))}
                  aria-label={`Перейти к разделу: ${p.title}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center px-4 cursor-pointer outline-none group rounded-xl focus-visible:ring-2"
                  style={{
                    left: pos.left,
                    top: pos.top,
                    width: `${(P_W / VB_W) * 100 - 4}%`,
                    height: `${(P_H / VB_H) * 100 - 6}%`,
                    transform: `translate(-50%, -50%) scale(${isHover ? 1.04 : 1})`,
                    transition: "transform 200ms ease-out",
                  }}
                >
                  <div
                    className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-card/70 backdrop-blur-sm border flex items-center justify-center mb-3"
                    style={{
                      borderColor: p.stroke,
                      boxShadow: isHover
                        ? `0 0 36px ${p.glow}, 0 0 12px ${p.glow}`
                        : p.iconShadow,
                      transition: "all 200ms ease-out",
                    }}
                  >
                    <Icon
                      className="w-7 h-7 lg:w-8 lg:h-8"
                      style={{ color: p.stroke, filter: `drop-shadow(0 0 6px ${p.glow})` }}
                    />
                  </div>
                  <h3
                    className="text-base lg:text-xl font-bold leading-tight mb-2 transition-colors"
                    style={{ color: isHover ? p.stroke : "hsl(var(--foreground))" }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-[11px] lg:text-sm text-muted-foreground leading-snug">
                    {p.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>


        {/* ===== Mobile: simple stacked puzzle pieces ===== */}
        <div className="md:hidden max-w-md mx-auto space-y-4">
          {PIECES.map((p) => {
            const Icon = p.Icon;
            return (
              <button
                key={p.title}
                type="button"
                onClick={() => navigate(p.href)}
                aria-label={`Перейти к разделу: ${p.title}`}
                className="w-full relative rounded-2xl bg-card/60 backdrop-blur-sm border p-5 text-center transition-transform active:scale-[0.98] hover:scale-[1.02] cursor-pointer"
                style={{ borderColor: p.stroke, boxShadow: `0 0 18px ${p.glow}` }}
              >
                <div
                  className="w-14 h-14 mx-auto rounded-xl bg-card/70 border flex items-center justify-center mb-3"
                  style={{ borderColor: p.stroke, boxShadow: p.iconShadow }}
                >
                  <Icon
                    className="w-7 h-7"
                    style={{ color: p.stroke, filter: `drop-shadow(0 0 6px ${p.glow})` }}
                  />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
