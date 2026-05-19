/**
 * DiscreteVsContinuousPath — две анимированные траектории бок о бок.
 * Используется в src/pages/CourseProject2.tsx, секция #continuous-control,
 * карточка «Почему не дискретное управление», после второго абзаца.
 *
 * Слева — «лесенка» (только ↑→↓←), проскакивает цель и доворачивает.
 * Справа — гладкая Безье-кривая, точно в цель.
 * Общий прогресс t∈[0,1] держится в useRef, обе панели идут синхронно.
 */

import { useEffect, useRef, useState } from "react";

const TEXT = "#F4F7FC";
const DIM = "#B0B8CE";
const MUTED = "#6B7490";
const CYAN = "#00FFD6";
const MAGENTA = "#D946EF";
const BORDER = "rgba(255,255,255,0.05)";
const OBSTACLE_FILL = "rgba(180,195,220,0.06)";
const OBSTACLE_BORDER = "rgba(180,195,220,0.35)";
const ORBITRON = "'Orbitron', ui-sans-serif, system-ui, sans-serif";

const VB = 280;
const START = { x: 36, y: 220 };
const GOAL = { x: 232, y: 60 };
const OBSTACLE = { x: 110, y: 110, w: 60, h: 60 };

// ── Дискретная «лесенка» ────────────────────────────────────────────────
// последовательность ортогональных шагов: вверх/вправо, грубо обходит
// препятствие, проскакивает цель и доворачивает обратно.
const STAIR_POINTS: { x: number; y: number }[] = [
  { x: 36, y: 220 },
  { x: 36, y: 190 },
  { x: 80, y: 190 },
  { x: 80, y: 110 },
  { x: 80, y: 80 }, // мимо левого края препятствия
  { x: 200, y: 80 }, // проскакиваем цель по X
  { x: 260, y: 80 },
  { x: 260, y: 60 },
  { x: 232, y: 60 }, // доворот назад к цели
];

const stairLen = (() => {
  let s = 0;
  for (let i = 1; i < STAIR_POINTS.length; i++) {
    s += Math.hypot(
      STAIR_POINTS[i].x - STAIR_POINTS[i - 1].x,
      STAIR_POINTS[i].y - STAIR_POINTS[i - 1].y,
    );
  }
  return s;
})();

function stairAt(t: number): { x: number; y: number; pathTo: string } {
  const target = t * stairLen;
  let acc = 0;
  let path = `M ${STAIR_POINTS[0].x} ${STAIR_POINTS[0].y}`;
  for (let i = 1; i < STAIR_POINTS.length; i++) {
    const a = STAIR_POINTS[i - 1];
    const b = STAIR_POINTS[i];
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    if (acc + seg >= target) {
      const u = (target - acc) / seg;
      const x = a.x + (b.x - a.x) * u;
      const y = a.y + (b.y - a.y) * u;
      path += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      return { x, y, pathTo: path };
    }
    path += ` L ${b.x} ${b.y}`;
    acc += seg;
  }
  const last = STAIR_POINTS[STAIR_POINTS.length - 1];
  return { x: last.x, y: last.y, pathTo: path };
}

// ── Непрерывная кривая Безье ────────────────────────────────────────────
// кубическая Безье, обходит препятствие снизу-справа и аккуратно доворачивает.
const B0 = { x: 36, y: 220 };
const B1 = { x: 80, y: 250 };
const B2 = { x: 230, y: 200 };
const B3 = { x: 232, y: 60 };

function bezierAt(t: number): { x: number; y: number } {
  const mt = 1 - t;
  const x =
    mt ** 3 * B0.x +
    3 * mt ** 2 * t * B1.x +
    3 * mt * t ** 2 * B2.x +
    t ** 3 * B3.x;
  const y =
    mt ** 3 * B0.y +
    3 * mt ** 2 * t * B1.y +
    3 * mt * t ** 2 * B2.y +
    t ** 3 * B3.y;
  return { x, y };
}

function bezierPathTo(t: number, segments = 60): string {
  let path = `M ${B0.x} ${B0.y}`;
  for (let i = 1; i <= segments; i++) {
    const tt = (i / segments) * t;
    const p = bezierAt(tt);
    path += ` L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }
  return path;
}

const Field = ({
  title,
  caption,
  pathColor,
  pathD,
  agent,
  full,
}: {
  title: string;
  caption: string;
  pathColor: string;
  pathD: string;
  agent: { x: number; y: number };
  full: string;
}) => (
  <div
    className="rounded-md p-3"
    style={{ border: `1px solid ${BORDER}`, background: "rgba(0,0,0,0.2)" }}
  >
    <div
      style={{
        fontFamily: ORBITRON,
        color: TEXT,
        fontSize: 13,
        letterSpacing: "0.04em",
        marginBottom: 8,
      }}
    >
      {title}
    </div>
    <svg
      viewBox={`0 0 ${VB} ${VB}`}
      width="100%"
      style={{ display: "block", maxWidth: 360 }}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      {/* рамка */}
      <rect
        x={8}
        y={8}
        width={VB - 16}
        height={VB - 16}
        rx={6}
        fill="transparent"
        stroke={BORDER}
      />
      {/* препятствие */}
      <rect
        x={OBSTACLE.x}
        y={OBSTACLE.y}
        width={OBSTACLE.w}
        height={OBSTACLE.h}
        fill={OBSTACLE_FILL}
        stroke={OBSTACLE_BORDER}
        rx="2"
      />
      {/* full path тенью */}
      <path d={full} fill="none" stroke={pathColor} strokeWidth="1" opacity="0.18" />
      {/* пройденный путь */}
      <path
        d={pathD}
        fill="none"
        stroke={pathColor}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.95"
      />
      {/* старт */}
      <circle cx={START.x} cy={START.y} r={6} fill={CYAN} opacity="0.55" />
      {/* цель */}
      <circle cx={GOAL.x} cy={GOAL.y} r={7} fill={MAGENTA} />
      <circle
        cx={GOAL.x}
        cy={GOAL.y}
        r={12}
        fill="none"
        stroke={MAGENTA}
        strokeOpacity="0.4"
      />
      {/* агент */}
      <circle cx={agent.x} cy={agent.y} r={7} fill={CYAN} />
    </svg>
    <div
      style={{
        color: DIM,
        fontSize: 13,
        lineHeight: 1.5,
        marginTop: 8,
      }}
    >
      {caption}
    </div>
  </div>
);

const DiscreteVsContinuousPath = () => {
  const tRef = useRef(0);
  const playingRef = useRef(false);
  const [, setTick] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const loop = () => {
      if (playingRef.current) {
        tRef.current = Math.min(1, tRef.current + 0.006);
        if (tRef.current >= 1) playingRef.current = false;
        setTick((k) => (k + 1) % 1_000_000);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const run = () => {
    tRef.current = 0;
    playingRef.current = true;
  };

  const t = tRef.current;
  const stair = stairAt(t);
  const bez = bezierAt(t);
  const stairFull = (() => {
    let p = `M ${STAIR_POINTS[0].x} ${STAIR_POINTS[0].y}`;
    for (let i = 1; i < STAIR_POINTS.length; i++) {
      p += ` L ${STAIR_POINTS[i].x} ${STAIR_POINTS[i].y}`;
    }
    return p;
  })();
  const bezFull = bezierPathTo(1);
  const bezPath = bezierPathTo(t);

  return (
    <div
      className="rounded-xl"
      style={{
        border: `1px solid ${BORDER}`,
        background: "rgba(0,0,0,0.25)",
        padding: 16,
        marginTop: 12,
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
        <h3
          style={{
            fontFamily: ORBITRON,
            color: TEXT,
            fontSize: 16,
            letterSpacing: "0.04em",
          }}
        >
          Почему непрерывное действие, а не дискретное
        </h3>
        <button
          type="button"
          onClick={run}
          style={{
            fontFamily: "'JetBrains Mono', ui-monospace, monospace",
            fontSize: 12,
            padding: "6px 14px",
            borderRadius: 6,
            border: `1px solid ${CYAN}55`,
            background: "rgba(0,255,214,0.08)",
            color: CYAN,
            cursor: "pointer",
          }}
        >
          ▶ Запустить
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <Field
          title="Дискретное управление"
          caption="меньше batch_size хватает, но движение грубое"
          pathColor={MUTED}
          pathD={stair.pathTo}
          agent={{ x: stair.x, y: stair.y }}
          full={stairFull}
        />
        <Field
          title="Непрерывное (Hunter)"
          caption="нужен batch_size ≥ 2048, зато гладкая погоня"
          pathColor={CYAN}
          pathD={bezPath}
          agent={bez}
          full={bezFull}
        />
      </div>
    </div>
  );
};

export default DiscreteVsContinuousPath;
