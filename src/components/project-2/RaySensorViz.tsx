/**
 * RaySensorViz — интерактивная визуализация RayPerceptionSensorComponent3D.
 * Используется в src/pages/CourseProject2.tsx, секция #env-observations,
 * внутри карточки «Что Охотник видит».
 *
 * Hunter в фиксированной точке; ползунок «Поворот Hunter» −90°…+90°.
 * Из Hunter исходят 3 луча в конусе 70° (центр + ±35°), длина ≈ 20 м.
 * Каждый луч raycast'ит до ближайшего препятствия / цели; цвет и dist в
 * нормированном [0,1] показываются на правой панели.
 */

import { useEffect, useRef, useState } from "react";

const TEXT = "#F4F7FC";
const DIM = "#B0B8CE";
const MUTED = "#6B7490";
const CYAN = "#00FFD6";
const MAGENTA = "#D946EF";
const BORDER = "rgba(255,255,255,0.05)";
const SURFACE = "rgba(255,255,255,0.02)";
const RAY_DIM = "rgba(0,255,214,0.25)";
const OBSTACLE_FILL = "rgba(180,195,220,0.06)";
const OBSTACLE_BORDER = "rgba(180,195,220,0.35)";
const ORBITRON = "'Orbitron', ui-sans-serif, system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

// Геометрия сцены (viewBox 420×340)
const HUNTER = { x: 60, y: 170 };
const RAY_LEN = 280; // ≈ 20 м в масштабе сцены
const CONE_DEG = 70; // полный конус
const RAY_OFFSETS = [-CONE_DEG / 2, 0, CONE_DEG / 2]; // ray[0..2]

// Препятствия: tag = "Wall" | "Obstacle"
type Rect = { x: number; y: number; w: number; h: number; tag: "Wall" | "Obstacle" };
const OBSTACLES: Rect[] = [
  { x: 200, y: 60, w: 55, h: 70, tag: "Obstacle" },
  { x: 250, y: 210, w: 80, h: 55, tag: "Obstacle" },
  // правая «стена» сцены
  { x: 405, y: 20, w: 8, h: 300, tag: "Wall" },
];

const TARGET = { x: 360, y: 120, r: 9 };

type Tag = "Wall" | "Obstacle" | "Target" | "None";

interface RayHit {
  t: number; // [0,1]
  hx: number;
  hy: number;
  tag: Tag;
}

const tagColor = (tag: Tag) => {
  if (tag === "Target") return MAGENTA;
  if (tag === "Obstacle") return MUTED;
  if (tag === "Wall") return "#8aa0c0";
  return RAY_DIM;
};

// Пересечение луча (x0,y0)+(dx,dy)*t, t∈[0,1] с отрезком (ax,ay)-(bx,by)
function segHit(
  x0: number,
  y0: number,
  dx: number,
  dy: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number | null {
  const sx = bx - ax;
  const sy = by - ay;
  const denom = dx * sy - dy * sx;
  if (Math.abs(denom) < 1e-6) return null;
  const t = ((ax - x0) * sy - (ay - y0) * sx) / denom;
  const u = ((ax - x0) * dy - (ay - y0) * dx) / denom;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return t;
}

function rectHit(x0: number, y0: number, dx: number, dy: number, r: Rect): number | null {
  const edges = [
    [r.x, r.y, r.x + r.w, r.y],
    [r.x + r.w, r.y, r.x + r.w, r.y + r.h],
    [r.x + r.w, r.y + r.h, r.x, r.y + r.h],
    [r.x, r.y + r.h, r.x, r.y],
  ];
  let best: number | null = null;
  for (const e of edges) {
    const t = segHit(x0, y0, dx, dy, e[0], e[1], e[2], e[3]);
    if (t !== null && t > 1e-4 && (best === null || t < best)) best = t;
  }
  return best;
}

function circleHit(
  x0: number,
  y0: number,
  dx: number,
  dy: number,
  cx: number,
  cy: number,
  rr: number,
): number | null {
  const fx = x0 - cx;
  const fy = y0 - cy;
  const a = dx * dx + dy * dy;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - rr * rr;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return null;
  const sq = Math.sqrt(disc);
  const t1 = (-b - sq) / (2 * a);
  const t2 = (-b + sq) / (2 * a);
  const t = t1 > 1e-4 ? t1 : t2 > 1e-4 ? t2 : null;
  if (t === null || t > 1) return null;
  return t;
}

function castRay(angleDeg: number): RayHit {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(rad) * RAY_LEN;
  const dy = Math.sin(rad) * RAY_LEN;

  let best: { t: number; tag: Tag } = { t: 1, tag: "None" };

  // цель
  const tt = circleHit(HUNTER.x, HUNTER.y, dx, dy, TARGET.x, TARGET.y, TARGET.r);
  if (tt !== null && tt < best.t) best = { t: tt, tag: "Target" };

  // препятствия
  for (const r of OBSTACLES) {
    const th = rectHit(HUNTER.x, HUNTER.y, dx, dy, r);
    if (th !== null && th < best.t) best = { t: th, tag: r.tag };
  }

  return {
    t: best.t,
    hx: HUNTER.x + dx * best.t,
    hy: HUNTER.y + dy * best.t,
    tag: best.tag,
  };
}

const RaySensorViz = () => {
  const [rot, setRot] = useState(0); // −90..+90
  const phaseRef = useRef(0);
  const [, setTick] = useState(0);
  const rafRef = useRef<number | null>(null);

  // 3 луча: базовый угол = 0 (вправо) + rot + offset
  const rays = RAY_OFFSETS.map((off) => {
    const angle = rot + off;
    const hit = castRay(angle);
    return { angle, hit };
  });

  const hasTarget = rays.some((r) => r.hit.tag === "Target");

  useEffect(() => {
    const loop = () => {
      phaseRef.current = (phaseRef.current + 0.06) % (Math.PI * 2);
      if (hasTarget) setTick((k) => (k + 1) % 1_000_000);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [hasTarget]);

  const pulse = 0.55 + 0.45 * Math.sin(phaseRef.current);

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
        3 луча · 70° · теги Wall / Obstacle / Target
      </h3>

      {/* Контрол */}
      <label className="flex items-center gap-3 mb-3 flex-wrap">
        <span style={{ fontFamily: MONO, fontSize: 12, color: DIM }}>
          Поворот Hunter:
        </span>
        <input
          type="range"
          min={-90}
          max={90}
          step={1}
          value={rot}
          onChange={(e) => setRot(Number(e.target.value))}
          style={{ accentColor: CYAN, flex: 1, maxWidth: 260 }}
          aria-label="Поворот Hunter в градусах"
        />
        <span
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: TEXT,
            minWidth: 56,
            textAlign: "right",
          }}
        >
          {rot > 0 ? `+${rot}` : rot}°
        </span>
      </label>

      <div className="grid md:grid-cols-[1fr_240px] gap-4 items-start">
        {/* Сцена */}
        <svg
          viewBox="0 0 420 340"
          width="100%"
          style={{ display: "block", maxWidth: 560 }}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Сцена с Hunter, 3 raycast-лучами, препятствиями и целью"
        >
          <defs>
            <linearGradient id="rayTargetGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={CYAN} />
              <stop offset="100%" stopColor={MAGENTA} />
            </linearGradient>
            <filter id="raysGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Рамка сцены */}
          <rect
            x={8}
            y={8}
            width={404}
            height={324}
            rx={8}
            fill="transparent"
            stroke={BORDER}
            strokeWidth="1"
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

          {/* Тег-метка для большой стены */}
          <text
            x={408}
            y={18}
            textAnchor="end"
            fontFamily={MONO}
            fontSize="9"
            fill={MUTED}
          >
            Wall
          </text>

          {/* Цель */}
          <circle
            cx={TARGET.x}
            cy={TARGET.y}
            r={TARGET.r}
            fill={MAGENTA}
            opacity={0.9}
          />
          <text
            x={TARGET.x + 14}
            y={TARGET.y + 4}
            fontFamily={MONO}
            fontSize="10"
            fill={MAGENTA}
          >
            Target
          </text>

          {/* Лучи */}
          {rays.map((r, i) => {
            const isTarget = r.hit.tag === "Target";
            const isObst = r.hit.tag === "Obstacle" || r.hit.tag === "Wall";
            const stroke = isTarget
              ? "url(#rayTargetGrad)"
              : isObst
                ? MUTED
                : RAY_DIM;
            const strokeWidth = isTarget ? 2 : 1.2;
            const opacity = isTarget ? 0.6 + 0.4 * pulse : 1;
            return (
              <g key={i} filter={isTarget ? "url(#raysGlow)" : undefined}>
                <line
                  x1={HUNTER.x}
                  y1={HUNTER.y}
                  x2={r.hit.hx}
                  y2={r.hit.hy}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  opacity={opacity}
                />
                {(isTarget || isObst) && (
                  <circle
                    cx={r.hit.hx}
                    cy={r.hit.hy}
                    r={isTarget ? 4 + pulse * 1.5 : 3}
                    fill={isTarget ? MAGENTA : MUTED}
                    opacity={isTarget ? 0.7 + 0.3 * pulse : 0.85}
                  />
                )}
              </g>
            );
          })}

          {/* Hunter */}
          <circle
            cx={HUNTER.x}
            cy={HUNTER.y}
            r={10}
            fill={CYAN}
            opacity={0.95}
          />
          {/* индикатор направления */}
          <line
            x1={HUNTER.x}
            y1={HUNTER.y}
            x2={HUNTER.x + Math.cos((rot * Math.PI) / 180) * 14}
            y2={HUNTER.y + Math.sin((rot * Math.PI) / 180) * 14}
            stroke={TEXT}
            strokeWidth="1.5"
          />
          <text
            x={HUNTER.x - 14}
            y={HUNTER.y + 24}
            fontFamily={MONO}
            fontSize="10"
            fill={CYAN}
          >
            Hunter
          </text>
        </svg>

        {/* Панель наблюдений */}
        <div
          className="rounded-md p-3 space-y-2"
          style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              color: DIM,
              letterSpacing: "0.04em",
              marginBottom: 6,
            }}
          >
            Что отдаётся в наблюдение
          </div>
          {rays.map((r, i) => {
            const tag = r.hit.tag;
            const color = tagColor(tag);
            const dist = r.hit.t.toFixed(2);
            return (
              <div
                key={i}
                style={{
                  fontFamily: MONO,
                  fontSize: 12,
                  color: TEXT,
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: MUTED }}>ray[{i}]:</span>{" "}
                <span style={{ color: DIM }}>tag=</span>
                <span style={{ color, fontWeight: 600 }}>{tag}</span>
                <span style={{ color: DIM }}>, dist=</span>
                <span style={{ color: TEXT }}>{dist}</span>
              </div>
            );
          })}
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: MUTED,
              marginTop: 8,
              lineHeight: 1.5,
            }}
          >
            dist ∈ [0,1] — доля длины луча до удара; 1.00 = «ничего».
          </div>
        </div>
      </div>

      <p
        style={{
          color: DIM,
          fontSize: 13,
          lineHeight: 1.6,
          marginTop: 12,
        }}
      >
        Лучи отвечают за обход препятствий и факт «вижу / не вижу цель». Плавное
        наведение даёт VectorSensor (см. ниже).
      </p>
    </div>
  );
};

export default RaySensorViz;
