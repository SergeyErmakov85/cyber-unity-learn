/**
 * ObservationVectorViz — живой разбор VectorSensor (11 нормированных фич).
 * Используется в src/pages/CourseProject2.tsx, секция #env-observations.
 *
 * SVG bar-chart: 11 горизонтальных баров со значениями в [-1,1].
 * Положительные значения — CYAN вправо от центра, отрицательные — MAGENTA влево.
 * Симуляция: «Сделать шаг» или «Авто» (rAF), флаг авто через useRef.
 */

import { useEffect, useRef, useState } from "react";
import MathTex from "@/components/Math";

const TEXT = "#F4F7FC";
const DIM = "#B0B8CE";
const MUTED = "#6B7490";
const CYAN = "#00FFD6";
const MAGENTA = "#D946EF";
const BORDER = "rgba(255,255,255,0.05)";
const SURFACE = "rgba(255,255,255,0.02)";
const ORBITRON = "'Orbitron', ui-sans-serif, system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const FEATURES = [
  "Δx→target",
  "Δz→target",
  "dist→target",
  "vx",
  "vz",
  "speed",
  "yaw",
  "angleToTarget",
  "ray0",
  "ray1",
  "ray2",
] as const;

const N = FEATURES.length;
const STEP_INTERVAL_MS = 380; // плавность «авто»

// Геометрия SVG
const VB_W = 560;
const ROW_H = 22;
const ROW_GAP = 4;
const TOP_PAD = 18;
const LABEL_W = 130;
const BAR_AREA_X = LABEL_W + 16;
const BAR_AREA_W = VB_W - BAR_AREA_X - 60; // справа место под число
const HALF_W = BAR_AREA_W / 2;
const CENTER_X = BAR_AREA_X + HALF_W;
const VB_H = TOP_PAD + N * (ROW_H + ROW_GAP) + 12;

// Симуляция: «приближение к цели»
type State = number[];
const initialState = (): State => [
  0.85,  // Δx→target
  -0.6,  // Δz→target
  0.92,  // dist
  0.1,   // vx
  -0.05, // vz
  0.15,  // speed
  0.4,   // yaw
  0.7,   // angleToTarget
  0.9,   // ray0
  0.95,  // ray1
  0.88,  // ray2
];

function nextState(prev: State, t: number): State {
  // t ∈ [0,1] — прогресс приближения; чем больше t, тем ближе агент к цели
  const decay = Math.exp(-t * 1.3);
  const wobble = (i: number) => Math.sin(t * 6 + i) * 0.08;
  const init = initialState();
  return [
    init[0] * decay + wobble(0),
    init[1] * decay + wobble(1),
    Math.max(0.04, init[2] * decay),
    0.25 + Math.sin(t * 7) * 0.3,
    -0.2 + Math.cos(t * 7) * 0.3,
    0.35 + Math.sin(t * 5) * 0.25,
    init[6] * decay * 0.8 + wobble(6) * 0.5,
    init[7] * decay + wobble(7) * 0.4,
    Math.max(0.05, init[8] * decay * 0.9),
    Math.max(0.05, init[9] * decay * 0.85),
    Math.max(0.05, init[10] * decay * 0.95),
  ].map((v) => Math.max(-1, Math.min(1, v)));
}

const TAU = 0.18; // коэффициент плавности интерполяции

const ObservationVectorViz = () => {
  const [values, setValues] = useState<State>(() => initialState());
  const targetRef = useRef<State>(initialState());
  const tRef = useRef(0); // прогресс
  const autoRef = useRef(false);
  const [autoOn, setAutoOn] = useState(false);
  const lastStepRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const setNextTarget = () => {
    tRef.current = Math.min(1, tRef.current + 0.08 + Math.random() * 0.04);
    if (tRef.current >= 0.98) tRef.current = 0; // зациклить демо
    targetRef.current = nextState(initialState(), tRef.current);
  };

  useEffect(() => {
    const loop = (now: number) => {
      // плавная интерполяция к таргету
      setValues((cur) =>
        cur.map((v, i) => v + (targetRef.current[i] - v) * TAU),
      );

      if (autoRef.current && now - lastStepRef.current > STEP_INTERVAL_MS) {
        lastStepRef.current = now;
        setNextTarget();
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const toggleAuto = () => {
    const next = !autoOn;
    autoRef.current = next;
    setAutoOn(next);
    lastStepRef.current = performance.now();
  };

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
        Вектор наблюдений, нормированный в [-1, 1]
      </h3>

      {/* Контролы */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <button
          type="button"
          onClick={setNextTarget}
          style={{
            fontFamily: MONO,
            fontSize: 12,
            padding: "6px 12px",
            borderRadius: 6,
            border: `1px solid ${CYAN}55`,
            background: "rgba(0,255,214,0.08)",
            color: CYAN,
            cursor: "pointer",
          }}
        >
          Сделать шаг
        </button>
        <button
          type="button"
          onClick={toggleAuto}
          style={{
            fontFamily: MONO,
            fontSize: 12,
            padding: "6px 12px",
            borderRadius: 6,
            border: `1px solid ${autoOn ? MAGENTA : BORDER}`,
            background: autoOn ? "rgba(217,70,239,0.12)" : "transparent",
            color: autoOn ? MAGENTA : DIM,
            cursor: "pointer",
          }}
          aria-pressed={autoOn}
        >
          Авто: {autoOn ? "on" : "off"}
        </button>
        <span style={{ fontFamily: MONO, fontSize: 11, color: MUTED }}>
          симуляция приближения агента к цели
        </span>
      </div>

      {/* Бар-чарт */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          width="100%"
          style={{ display: "block", minWidth: 480, maxWidth: 720 }}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Бар-чарт 11 нормированных фич вектора наблюдений в диапазоне минус один плюс один"
        >
          {/* Заголовок оси */}
          <text
            x={CENTER_X}
            y={12}
            textAnchor="middle"
            fontFamily={MONO}
            fontSize="10"
            fill={MUTED}
          >
            −1 ←──── 0 ────→ +1
          </text>

          {/* Боковые подписи диапазона */}
          <text x={BAR_AREA_X} y={12} fontFamily={MONO} fontSize="10" fill={MUTED}>
            −1
          </text>
          <text
            x={BAR_AREA_X + BAR_AREA_W}
            y={12}
            textAnchor="end"
            fontFamily={MONO}
            fontSize="10"
            fill={MUTED}
          >
            +1
          </text>

          {/* Фон диапазона */}
          <rect
            x={BAR_AREA_X}
            y={TOP_PAD - 4}
            width={BAR_AREA_W}
            height={N * (ROW_H + ROW_GAP)}
            fill="rgba(255,255,255,0.015)"
            rx="3"
          />

          {/* Центральная ось */}
          <line
            x1={CENTER_X}
            y1={TOP_PAD - 6}
            x2={CENTER_X}
            y2={TOP_PAD + N * (ROW_H + ROW_GAP)}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
          />

          {/* Ряды */}
          {FEATURES.map((label, i) => {
            const v = values[i];
            const y = TOP_PAD + i * (ROW_H + ROW_GAP);
            const positive = v >= 0;
            const w = Math.abs(v) * HALF_W;
            const x = positive ? CENTER_X : CENTER_X - w;
            const color = positive ? CYAN : MAGENTA;
            return (
              <g key={label}>
                <text
                  x={LABEL_W + 8}
                  y={y + ROW_H * 0.7}
                  textAnchor="end"
                  fontFamily={MONO}
                  fontSize="11"
                  fill={DIM}
                >
                  {label}
                </text>
                <rect
                  x={x}
                  y={y + 4}
                  width={Math.max(1, w)}
                  height={ROW_H - 8}
                  fill={color}
                  opacity="0.85"
                  rx="2"
                />
                <text
                  x={BAR_AREA_X + BAR_AREA_W + 8}
                  y={y + ROW_H * 0.7}
                  fontFamily={MONO}
                  fontSize="11"
                  fill={TEXT}
                >
                  {v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Формула нормализации */}
      <div
        className="mt-3 px-3 py-2 rounded-md"
        style={{
          border: `1px solid ${BORDER}`,
          background: SURFACE,
          color: TEXT,
          overflowX: "auto",
        }}
      >
        <MathTex display={false}>
          {"\\hat{x} = \\operatorname{clip}\\!\\left(\\dfrac{x}{x_{\\max}},\\, -1,\\, 1\\right)"}
        </MathTex>
      </div>

      <p
        style={{
          color: MUTED,
          fontSize: 13,
          lineHeight: 1.6,
          marginTop: 10,
        }}
      >
        Без нормализации PPO с{" "}
        <span style={{ fontFamily: MONO, color: DIM }}>normalize: true</span>{" "}
        тоже сходится, но статистики «разъезжаются» дольше — кривая энтропии в
        TensorBoard рваная.
      </p>
    </div>
  );
};

export default ObservationVectorViz;
