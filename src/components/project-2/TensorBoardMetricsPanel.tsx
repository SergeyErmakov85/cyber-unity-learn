/**
 * TensorBoardMetricsPanel — интерактивная панель 5 ключевых TB-метрик.
 * Используется в src/pages/CourseProject2.tsx, секция #training-monitoring,
 * заменяет маркированный список «5 метрик, на которые смотрим всегда».
 *
 * Глобальный тоггл «Здоровое ↔ Проблема»: переключает форму всех 5 sparkline.
 */

import { useState } from "react";

const TEXT = "#F4F7FC";
const DIM = "#B0B8CE";
const MUTED = "#6B7490";
const CYAN = "#00FFD6";
const MAGENTA = "#D946EF";
const BORDER = "rgba(255,255,255,0.05)";
const SURFACE = "rgba(255,255,255,0.02)";
const ORBITRON = "'Orbitron', ui-sans-serif, system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const VB_W = 240;
const VB_H = 80;
const PAD = 8;
const PLOT_W = VB_W - PAD * 2;
const PLOT_H = VB_H - PAD * 2;
const N = 70;

const xOf = (i: number) => PAD + (i / (N - 1)) * PLOT_W;
const yOf = (v: number) => PAD + (1 - Math.max(0, Math.min(1, v))) * PLOT_H;

const series = (fn: (t: number) => number) => Array.from({ length: N }, (_, i) => fn(i / (N - 1)));
const path = (vals: number[]) =>
  vals.map((v, i) => `${i === 0 ? "M" : "L"}${xOf(i).toFixed(1)},${yOf(v).toFixed(2)}`).join(" ");

// ----- Healthy curves -----
const H_REWARD = series((t) => 0.05 + 0.92 * (1 - Math.exp(-3.2 * t)));
const H_LENGTH = series((t) => 0.92 - 0.78 * (1 - Math.exp(-2.5 * t)));
const H_ENTROPY = series((t) => 0.95 - 0.65 * (1 - Math.exp(-1.8 * t)));
const H_VALUE = series((t) => 0.08 + 0.85 * (1 - Math.exp(-2.8 * t)));
const H_LOSS = series((t) => 0.8 * Math.exp(-2.5 * t) + 0.06 + 0.02 * Math.sin(t * 9));

// ----- Pathological curves -----
const P_REWARD = series((t) => 0.05 + 0.25 * (1 - Math.exp(-3 * t)) + 0.02 * Math.sin(t * 11));
const P_LENGTH = series(() => 0.95);
const P_ENTROPY = series((t) => 0.95 * Math.exp(-6 * t) + 0.05); // collapse
const P_VALUE = series((t) => 0.05 + 0.35 * (1 - Math.exp(-1.5 * t))); // lags reward
const P_LOSS = series((t) => {
  const base = 0.3 + 0.15 * t;
  const spike = Math.pow(Math.abs(Math.sin(t * 13)), 10);
  return Math.min(0.97, base + 0.6 * spike);
});

type Metric = {
  name: string;
  healthy: number[];
  problem: number[];
  healthyNote: string;
  problemNote: string;
};

const METRICS: Metric[] = [
  {
    name: "Environment/Cumulative Reward",
    healthy: H_REWARD,
    problem: P_REWARD,
    healthyNote: "Монотонно растёт и выходит на плато ≈ +1 (terminal достигается).",
    problemNote: "Плато ≪ 1 — Охотник в основном не доходит до цели.",
  },
  {
    name: "Environment/Episode Length",
    healthy: H_LENGTH,
    problem: P_LENGTH,
    healthyNote: "Падает по мере обучения — ловит цель быстрее.",
    problemNote: "Плоская у MaxStep — эпизоды закрываются по таймеру, не по поимке.",
  },
  {
    name: "Policy/Entropy",
    healthy: H_ENTROPY,
    problem: P_ENTROPY,
    healthyNote: "Плавно убывает от ≈ 1.4 к небольшому положительному значению.",
    problemNote: "Резкое падение — коллапс эксплорейшна (или рост без Mathf.Clamp).",
  },
  {
    name: "Policy/Value Estimate",
    healthy: H_VALUE,
    problem: P_VALUE,
    healthyNote: "Растёт параллельно Cumulative Reward — critic держится за actor.",
    problemNote: "Сильное отставание — critic не успевает за actor.",
  },
  {
    name: "Losses/Policy + Value Loss",
    healthy: H_LOSS,
    problem: P_LOSS,
    healthyNote: "Постепенно уменьшаются и стабилизируются.",
    problemNote: "Пилообразные спайки value loss — проблемы нормализации или PBRS.",
  },
];

const Sparkline = ({ vals, problem }: { vals: number[]; problem: boolean }) => (
  <svg viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ width: "100%", height: "auto", display: "block" }}>
    <rect
      x={PAD}
      y={PAD}
      width={PLOT_W}
      height={PLOT_H}
      fill="none"
      stroke={MUTED}
      strokeOpacity={0.3}
      strokeWidth={0.5}
    />
    {[0.25, 0.5, 0.75].map((g) => (
      <line
        key={g}
        x1={PAD}
        y1={yOf(g)}
        x2={PAD + PLOT_W}
        y2={yOf(g)}
        stroke={MUTED}
        strokeOpacity={0.12}
        strokeDasharray="2 3"
      />
    ))}
    <path
      d={path(vals)}
      fill="none"
      stroke={problem ? MAGENTA : CYAN}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TensorBoardMetricsPanel = () => {
  const [problem, setProblem] = useState(false);

  return (
    <div
      className="my-4"
      style={{
        border: `1px solid ${BORDER}`,
        background: "rgba(0,0,0,0.25)",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h4
          style={{
            fontFamily: ORBITRON,
            color: TEXT,
            fontSize: 15,
            letterSpacing: "0.04em",
          }}
        >
          5 метрик, на которые смотрим всегда
        </h4>
        <div
          role="group"
          style={{
            display: "inline-flex",
            border: `1px solid ${BORDER}`,
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setProblem(false)}
            style={{
              fontFamily: MONO,
              fontSize: 11,
              padding: "5px 10px",
              background: !problem ? "rgba(0,255,214,0.15)" : "transparent",
              color: !problem ? CYAN : DIM,
              border: "none",
              cursor: "pointer",
            }}
          >
            Здоровое обучение
          </button>
          <button
            onClick={() => setProblem(true)}
            style={{
              fontFamily: MONO,
              fontSize: 11,
              padding: "5px 10px",
              background: problem ? "rgba(217,70,239,0.18)" : "transparent",
              color: problem ? MAGENTA : DIM,
              border: "none",
              cursor: "pointer",
            }}
          >
            Проблема
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {METRICS.map((m) => (
          <div
            key={m.name}
            style={{
              border: `1px solid ${BORDER}`,
              background: SURFACE,
              borderRadius: 8,
              padding: 10,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                fontFamily: MONO,
                color: CYAN,
                fontSize: 11,
                letterSpacing: "0.02em",
                lineHeight: 1.3,
                wordBreak: "break-all",
              }}
            >
              {m.name}
            </div>
            <Sparkline vals={problem ? m.problem : m.healthy} problem={problem} />
            <div style={{ color: DIM, fontSize: 12, lineHeight: 1.5 }}>
              {problem ? m.problemNote : m.healthyNote}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TensorBoardMetricsPanel;
