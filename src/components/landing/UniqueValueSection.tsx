import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlaskConical, Gamepad2, GraduationCap, Repeat, Eye, Zap, ChevronDown } from "lucide-react";

const values = [
  {
    icon: Repeat,
    title: "Воспроизводимые\nэксперименты",
    description: "Каждый проект включает фиксированные seed-значения, версии зависимостей и детальные инструкции. Получите те же результаты, что и в примерах",
    color: "primary" as const,
    link: "/code-examples",
  },
  {
    icon: Gamepad2,
    title: "Реальные\nигровые среды",
    description: "Не абстрактные задачи, а полноценные Unity-проекты. Обучайте агентов в 3D-мирах с физикой, визуализацией и интерактивностью",
    color: "secondary" as const,
    link: "/unity-projects",
  },
  {
    icon: FlaskConical,
    title: "Научный\nподход",
    description: "Следуем лучшим практикам из исследований. Алгоритмы реализованы согласно оригинальным статьям с понятными объяснениями",
    color: "yellow" as const,
    link: "/hub/research",
  },
  {
    icon: Eye,
    title: "Визуализация\nобучения",
    description: "Наблюдайте за процессом в реальном времени. Графики наград, траектории агентов, распределения действий — всё визуализировано",
    color: "primary" as const,
    link: "/visualizations",
  },
  {
    icon: GraduationCap,
    title: "От основ\nдо продвинутого",
    description: "Структурированная программа обучения. Начните с базовых концепций и дойдите до state-of-the-art алгоритмов",
    color: "secondary" as const,
    link: "/courses",
  },
  {
    icon: Zap,
    title: "Практика\nс первого дня",
    description: "Никакой месячной подготовки. Запустите первого агента в первый же день обучения и сразу увидите результаты",
    color: "green" as const,
    link: "/courses/1-1",
  },
];

const colorConfig = {
  primary: {
    number: "text-primary",
    text: "text-primary",
    stroke: "hsl(var(--primary))",
    glow: "hsl(var(--primary) / 0.6)",
    fill: "transparent",
    fillActive: "hsl(var(--primary) / 0.32)",
  },
  secondary: {
    number: "text-secondary",
    text: "text-secondary",
    stroke: "hsl(var(--secondary))",
    glow: "hsl(var(--secondary) / 0.6)",
    fill: "transparent",
    fillActive: "hsl(var(--secondary) / 0.32)",
  },
  accent: {
    number: "text-accent",
    text: "text-accent",
    stroke: "hsl(var(--accent))",
    glow: "hsl(var(--accent) / 0.6)",
    fill: "transparent",
    fillActive: "hsl(var(--accent) / 0.32)",
  },
  yellow: {
    number: "text-yellow-400",
    text: "text-yellow-400",
    stroke: "hsl(48 96% 53%)",
    glow: "hsla(48, 96%, 53%, 0.6)",
    fill: "transparent",
    fillActive: "hsla(48, 96%, 53%, 0.32)",
  },
  green: {
    number: "text-green-400",
    text: "text-green-400",
    stroke: "hsl(142 71% 45%)",
    glow: "hsla(142, 71%, 45%, 0.6)",
    fill: "transparent",
    fillActive: "hsla(142, 71%, 45%, 0.32)",
  },
};

// Hexagon geometry — flat-top hexagon with 6 trapezoid segments.
const R = 474;
const CX = 930;
const CY = 510;
const vertex = (deg: number) => ({
  x: CX + R * Math.cos((deg * Math.PI) / 180),
  y: CY + R * Math.sin((deg * Math.PI) / 180),
});

// Vertices: V0=right, V1=bottom-right, V2=bottom-left, V3=left, V4=top-left, V5=top-right
const V = [vertex(0), vertex(60), vertex(120), vertex(180), vertex(240), vertex(300)];

// 6 trapezoid segments — each is a quadrilateral: 2 adjacent vertices + 2 inset points toward center.
// Inset factor controls the "thickness" of each trapezoid (inner edge distance from center).
const INSET = 0.42; // 0 = at center, 1 = at edge
const insetPoint = (v: { x: number; y: number }) => ({
  x: CX + (v.x - CX) * INSET,
  y: CY + (v.y - CY) * INSET,
});

// Segment positions (clockwise from top): top, top-right, bottom-right, bottom, bottom-left, top-left
// Map to values order on screenshot:
// 0: top-left  -> Воспроизводимые (V4-V5 outer, inner-V4, inner-V5)... use top segment between V4 and V5
// We define 6 segments by adjacent vertex pairs:
const segments = [
  { outer: [V[4], V[5]], label: "top" },          // top edge
  { outer: [V[5], V[0]], label: "top-right" },    // top-right
  { outer: [V[0], V[1]], label: "bottom-right" }, // bottom-right
  { outer: [V[1], V[2]], label: "bottom" },       // bottom
  { outer: [V[2], V[3]], label: "bottom-left" },  // bottom-left
  { outer: [V[3], V[4]], label: "top-left" },     // top-left
];

// Map values[i] (1..6) to visual position per reference image:
// 01 top-left, 02 top, 03 top-right, 04 bottom-right, 05 bottom, 06 bottom-left
const positionOrder = [5, 0, 1, 2, 3, 4]; // index into `segments` for values 0..5

const UniqueValueSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">
            <span className="text-foreground">Почему именно </span>
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              эта платформа?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Уникальные преимущества нашей платформы
          </p>
        </div>

        {/* Desktop hexagon */}
        <div className="hidden md:flex justify-center">
          <div
            className="relative w-full"
            style={{ maxWidth: "1860px", aspectRatio: "1860 / 1020" }}
          >
            <svg
              viewBox="0 0 1860 1020"
              className="absolute inset-0 w-full h-full"
              style={{ overflow: "visible" }}
            >
              {values.map((value, i) => {
                const seg = segments[positionOrder[i]];
                const [a, b] = seg.outer;
                const ai = insetPoint(a);
                const bi = insetPoint(b);
                const colors = colorConfig[value.color];
                const isOpen = openIndex === i;
                const points = `${a.x},${a.y} ${b.x},${b.y} ${bi.x},${bi.y} ${ai.x},${ai.y}`;
                return (
                  <polygon
                    key={i}
                    points={points}
                    fill={isOpen ? colors.fillActive : colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={isOpen ? 2.5 : 1.5}
                    style={{
                      filter: isOpen
                        ? `drop-shadow(0 0 40px ${colors.glow}) drop-shadow(0 0 15px ${colors.glow})`
                        : "none",
                      transition: "all 0.4s ease",
                      cursor: "pointer",
                      pointerEvents: "all",
                    }}
                    onMouseEnter={() => setOpenIndex(i)}
                    onMouseLeave={() => setOpenIndex(null)}
                    onClick={() => navigate(value.link)}
                  />
                );
              })}
            </svg>

            {/* Content overlays */}
            {values.map((value, i) => {
              const seg = segments[positionOrder[i]];
              const [a, b] = seg.outer;
              const ai = insetPoint(a);
              const bi = insetPoint(b);
              // centroid of trapezoid
              const cx = (a.x + b.x + ai.x + bi.x) / 4;
              const cy = (a.y + b.y + ai.y + bi.y) / 4;
              const Icon = value.icon;
              const colors = colorConfig[value.color];
              const isOpen = openIndex === i;

              // Convert SVG coords -> percentage of container (1860x1020)
              const leftPct = (cx / 1860) * 100;
              const topPct = (cy / 1020) * 100;

              return (
                <div
                  key={i}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    transform: "translate(-50%, -50%)",
                    width: "200px",
                  }}
                >
                  <div className="flex flex-col items-center text-center gap-2">
                    <div className={`text-sm font-mono font-bold ${colors.number} opacity-80`}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <Icon
                      className={`w-7 h-7 ${colors.text} transition-transform duration-300 ${
                        isOpen ? "scale-110" : ""
                      }`}
                      style={{
                        filter: isOpen ? `drop-shadow(0 0 8px ${colors.glow})` : "none",
                      }}
                    />
                    <h3
                      className="text-sm lg:text-base font-bold text-foreground leading-tight whitespace-pre-line"
                    >
                      {value.title}
                    </h3>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground/60 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              );
            })}

            {/* Center description on hover */}
            <div
              className="absolute pointer-events-none flex items-center justify-center"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "260px",
                height: "180px",
              }}
            >
              {openIndex !== null && (
                <div
                  className="text-center px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300"
                  style={{
                    borderColor: colorConfig[values[openIndex].color].stroke,
                    background: "hsl(var(--background) / 0.7)",
                    boxShadow: `0 0 24px ${colorConfig[values[openIndex].color].glow}`,
                  }}
                >
                  <p className="text-xs lg:text-sm text-foreground/90 leading-relaxed">
                    {values[openIndex].description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: stack */}
        <div className="md:hidden max-w-md mx-auto space-y-3">
          {values.map((value, index) => {
            const Icon = value.icon;
            const colors = colorConfig[value.color];
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="border rounded-lg p-4 transition-colors cursor-pointer"
                style={{
                  borderColor: isOpen ? colors.stroke : "hsl(var(--border))",
                  background: isOpen ? colors.fillActive : "transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-mono font-bold ${colors.number} opacity-70`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                  <h3 className="text-sm font-bold text-foreground flex-1 whitespace-pre-line">
                    {value.title}
                  </h3>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {isOpen && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(value.link);
                      }}
                      className={`text-xs font-medium ${colors.text} hover:underline`}
                    >
                      Перейти →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UniqueValueSection;
