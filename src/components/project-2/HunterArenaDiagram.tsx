/**
 * HunterArenaDiagram — интерактивная схема арены капстоуна (вид сверху).
 * Используется в src/pages/CourseProject2.tsx, секция #env-observations.
 *
 * Студент видит геометрию из раздела «Среда и наблюдения»:
 *   • замкнутый квадрат с неоновой рамкой,
 *   • 4 статичных препятствия,
 *   • Hunter (cyan-сфера),
 *   • Target (magenta-точка), движущаяся по выбранной стратегии.
 *
 * Управление:
 *   • Слайдер «Размер арены» 10–20 м (только подпись + шаг сетки).
 *   • Тоггл-чипы стратегии: random walk | scripted patrol | evasive.
 *
 * Анимация — requestAnimationFrame; текущая стратегия читается через useRef,
 * чтобы не пересоздавать loop при переключении.
 */

import { useEffect, useRef, useState } from "react";

const TEXT = "#F4F7FC";
const DIM = "#B0B8CE";
const MUTED = "#6B7490";
const CYAN = "#00FFD6";
const MAGENTA = "#D946EF";
const BORDER = "rgba(255,255,255,0.05)";
const SURFACE = "rgba(255,255,255,0.02)";
const GRID = "rgba(255,255,255,0.04)";
const OBSTACLE_FILL = "rgba(180,195,220,0.06)";
const OBSTACLE_BORDER = "rgba(180,195,220,0.35)";
const ORBITRON = "'Orbitron', ui-sans-serif, system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

type Strategy = "random" | "patrol" | "evasive";

const STRATEGIES: { id: Strategy; label: string }[] = [
  { id: "random", label: "random walk" },
  { id: "patrol", label: "scripted patrol" },
  { id: "evasive", label: "evasive" },
];

// Геометрия арены в координатах SVG (viewBox 400×400, арена 360×360)
const A_X = 20;
const A_Y = 20;
const A_SIZE = 360;
const A_MIN = A_X + 12;
const A_MAX = A_X + A_SIZE - 12;

// 4 фиксированных препятствия (x, y, w, h в координатах SVG)
const OBSTACLES = [
  { x: 90, y: 90, w: 50, h: 50 },
  { x: 260, y: 100, w: 45, h: 60 },
  { x: 110, y: 250, w: 60, h: 45 },
  { x: 245, y: 245, w: 55, h: 55 },
];

const HUNTER_SPEED = 0.9; // px/frame
const TARGET_SPEED = 0.6 * HUNTER_SPEED;

const clampPos = (v: number) => Math.max(A_MIN, Math.min(A_MAX, v));

const insideObstacle = (x: number, y: number, pad = 10) =>
  OBSTACLES.some(
    (o) => x > o.x - pad && x < o.x + o.w + pad && y > o.y - pad && y < o.y + o.h + pad,
  );

const HunterArenaDiagram = () => {
  const [arenaSize, setArenaSize] = useState(15); // метры
  const [strategy, setStrategy] = useState<Strategy>("evasive");
  const strategyRef = useRef<Strategy>("evasive");
  useEffect(() => {
    strategyRef.current = strategy;
  }, [strategy]);

  const hunterRef = useRef({ x: 80, y: 200 });
  const targetRef = useRef({ x: 320, y: 200, vx: TARGET_SPEED, vy: TARGET_SPEED * 0.5 });
  // Точки патрулирования по периметру внутреннего прямоугольника
  const patrolIdxRef = useRef(0);
  const patrol = [
    { x: 60, y: 60 },
    { x: 340, y: 60 },
    { x: 340, y: 340 },
    { x: 60, y: 340 },
  ];

  const [, setTick] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const step = () => {
      const h = hunterRef.current;
      const t = targetRef.current;

      // Hunter медленно движется к цели — для наглядности
      const dxh = t.x - h.x;
      const dyh = t.y - h.y;
      const dh = Math.hypot(dxh, dyh) || 1;
      const nhx = h.x + (dxh / dh) * HUNTER_SPEED;
      const nhy = h.y + (dyh / dh) * HUNTER_SPEED;
      if (!insideObstacle(nhx, nhy)) {
        h.x = clampPos(nhx);
        h.y = clampPos(nhy);
      } else {
        // лёгкий обход — слегка вбок
        h.x = clampPos(h.x + (Math.random() - 0.5) * 2);
        h.y = clampPos(h.y + (Math.random() - 0.5) * 2);
      }

      const s = strategyRef.current;
      let nx = t.x;
      let ny = t.y;

      if (s === "random") {
        t.vx += (Math.random() - 0.5) * 0.4;
        t.vy += (Math.random() - 0.5) * 0.4;
        const sp = Math.hypot(t.vx, t.vy) || 1;
        t.vx = (t.vx / sp) * TARGET_SPEED;
        t.vy = (t.vy / sp) * TARGET_SPEED;
        nx = t.x + t.vx;
        ny = t.y + t.vy;
      } else if (s === "patrol") {
        const target = patrol[patrolIdxRef.current];
        const dx = target.x - t.x;
        const dy = target.y - t.y;
        const d = Math.hypot(dx, dy);
        if (d < 4) {
          patrolIdxRef.current = (patrolIdxRef.current + 1) % patrol.length;
        }
        nx = t.x + (dx / (d || 1)) * TARGET_SPEED;
        ny = t.y + (dy / (d || 1)) * TARGET_SPEED;
      } else {
        // evasive — отталкиваемся от Hunter
        const dx = t.x - h.x;
        const dy = t.y - h.y;
        const d = Math.hypot(dx, dy) || 1;
        nx = t.x + (dx / d) * TARGET_SPEED;
        ny = t.y + (dy / d) * TARGET_SPEED;
        // если упёрлись в стенку — лёгкий боковой дрейф
        if (nx <= A_MIN + 2 || nx >= A_MAX - 2) nx = t.x + (Math.random() - 0.5) * 2;
        if (ny <= A_MIN + 2 || ny >= A_MAX - 2) ny = t.y + (Math.random() - 0.5) * 2;
      }

      if (insideObstacle(nx, ny)) {
        // развернуться от препятствия
        nx = t.x - (nx - t.x);
        ny = t.y - (ny - t.y);
        t.vx = -t.vx;
        t.vy = -t.vy;
      }
      t.x = clampPos(nx);
      t.y = clampPos(ny);

      setTick((k) => (k + 1) % 1_000_000);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Сетка: шаг зависит от arenaSize (10..20 м), пытаемся ~arenaSize линий
  const gridStep = A_SIZE / arenaSize;
  const gridLines: number[] = [];
  for (let i = 1; i < arenaSize; i++) gridLines.push(i * gridStep);

  const h = hunterRef.current;
  const t = targetRef.current;

  return (
    <div
      className="rounded-xl"
      style={{
        border: `1px solid ${BORDER}`,
        background: "rgba(0,0,0,0.25)",
        padding: 16,
      }}
    >
      <h3
        style={{
          fontFamily: ORBITRON,
          color: TEXT,
          fontSize: 16,
          letterSpacing: "0.04em",
          marginBottom: 12,
        }}
      >
        Арена сверху · Hunter vs Target
      </h3>

      {/* Контролы */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <label className="flex items-center gap-3" style={{ minWidth: 240 }}>
          <span style={{ fontFamily: MONO, fontSize: 12, color: DIM }}>
            Размер арены:
          </span>
          <input
            type="range"
            min={10}
            max={20}
            step={1}
            value={arenaSize}
            onChange={(e) => setArenaSize(Number(e.target.value))}
            style={{ accentColor: CYAN, flex: 1, maxWidth: 160 }}
            aria-label="Размер арены в метрах"
          />
          <span style={{ fontFamily: MONO, fontSize: 12, color: TEXT, minWidth: 42 }}>
            {arenaSize} м
          </span>
        </label>

        <div className="flex items-center gap-2 flex-wrap">
          <span style={{ fontFamily: MONO, fontSize: 12, color: DIM }}>
            Стратегия цели:
          </span>
          {STRATEGIES.map((s) => {
            const active = strategy === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStrategy(s.id)}
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: `1px solid ${active ? MAGENTA : BORDER}`,
                  background: active ? "rgba(217,70,239,0.12)" : "transparent",
                  color: active ? MAGENTA : DIM,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <svg
        viewBox="0 0 400 400"
        width="100%"
        style={{ maxWidth: 520, display: "block", margin: "0 auto" }}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Схема арены ${arenaSize}×${arenaSize} м, стратегия цели: ${strategy}`}
      >
        <defs>
          <filter id="arenaGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Сетка */}
        {gridLines.map((g, i) => (
          <g key={i}>
            <line
              x1={A_X + g}
              y1={A_Y}
              x2={A_X + g}
              y2={A_Y + A_SIZE}
              stroke={GRID}
              strokeWidth="1"
            />
            <line
              x1={A_X}
              y1={A_Y + g}
              x2={A_X + A_SIZE}
              y2={A_Y + g}
              stroke={GRID}
              strokeWidth="1"
            />
          </g>
        ))}

        {/* Рамка арены с glow */}
        <rect
          x={A_X}
          y={A_Y}
          width={A_SIZE}
          height={A_SIZE}
          fill="transparent"
          stroke={CYAN}
          strokeWidth="2"
          filter="url(#arenaGlow)"
        />

        {/* Препятствия */}
        {OBSTACLES.map((o, i) => (
          <rect
            key={i}
            x={o.x}
            y={o.y}
            width={o.w}
            height={o.h}
            fill={OBSTACLE_FILL}
            stroke={OBSTACLE_BORDER}
            strokeWidth="1"
            rx="2"
          />
        ))}

        {/* Подписи осей */}
        <text
          x={A_X + A_SIZE - 4}
          y={A_Y + A_SIZE + 14}
          textAnchor="end"
          fontFamily={MONO}
          fontSize="10"
          fill={MUTED}
        >
          x →
        </text>
        <text
          x={A_X - 6}
          y={A_Y + 10}
          textAnchor="end"
          fontFamily={MONO}
          fontSize="10"
          fill={MUTED}
        >
          y →
        </text>

        {/* Target */}
        <circle cx={t.x} cy={t.y} r={7} fill={MAGENTA} filter="url(#dotGlow)" />
        {/* Hunter */}
        <circle cx={h.x} cy={h.y} r={9} fill={CYAN} filter="url(#dotGlow)" />
      </svg>

      <p
        style={{
          color: DIM,
          fontSize: 13,
          lineHeight: 1.6,
          marginTop: 12,
          textAlign: "center",
        }}
      >
        По умолчанию — evasive, скорость цели ≈ 0.6× агента: компромисс скорость
        обучения / обобщаемость.
      </p>
    </div>
  );
};

export default HunterArenaDiagram;
