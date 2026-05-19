/**
 * AdvantageGAEViz — V(s) → A(s,a) → GAE с интерактивным λ.
 * Используется в src/pages/CourseProject2.tsx, секция #ppo-hyperparams,
 * карточка «На каких величинах PPO учит политику», перед списком HubLink.
 *
 * Сцена: 10-шаговый эпизод-погоня.
 * • V(s) — CYAN-линия над лентой.
 * • r_t — MAGENTA-бары под лентой.
 * • Клик по точке шага выбирает t, показывается A(s_t,a_t)≈GAE_t.
 * • Слайдер λ меняет ширину «окна вклада» δ-ошибок (через веса (γλ)^l).
 */

import { useMemo, useState } from "react";
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

// Фиксированный эпизод-погоня: критик слегка недооценивает первые шаги
// (агент ещё далеко), потом догоняет; награды — pbrs-shaping + terminal catch.
const REWARDS = [-0.01, 0.02, 0.04, 0.05, 0.03, 0.08, 0.10, 0.12, 0.15, 1.0];
const V_HAT =  [ 0.30, 0.32, 0.36, 0.40, 0.42, 0.48, 0.55, 0.68, 0.82, 0.90];
const N = REWARDS.length;
const GAMMA = 0.99;

const VB_W = 580;
const VB_H = 260;
const PAD_L = 40;
const PAD_R = 16;
const PAD_T = 22;
const LANE_Y = 130;
const PLOT_W = VB_W - PAD_L - PAD_R;
const STEP_X = PLOT_W / (N - 1);
const stepPx = (i: number) => PAD_L + i * STEP_X;

// y-проекции для V (диапазон ~[0,1])
const V_TOP = 36;
const V_BOT = LANE_Y - 14;
const vToPx = (v: number) => V_TOP + (1 - Math.max(0, Math.min(1, v))) * (V_BOT - V_TOP);

// y-проекции для rewards (бары от LANE_Y вниз)
const R_BASE = LANE_Y + 18;
const R_MAX_PX = 70;
const rToHeight = (r: number) => Math.max(2, Math.abs(r) * R_MAX_PX);

// ── Вычисления δ и GAE ─────────────────────────────────────────────────
function computeDeltas() {
  const d = new Array<number>(N).fill(0);
  for (let t = 0; t < N; t++) {
    const vNext = t + 1 < N ? V_HAT[t + 1] : 0;
    d[t] = REWARDS[t] + GAMMA * vNext - V_HAT[t];
  }
  return d;
}

function gaeAt(t: number, lambda: number, deltas: number[]): number {
  let acc = 0;
  for (let l = 0; t + l < N; l++) {
    acc += Math.pow(GAMMA * lambda, l) * deltas[t + l];
  }
  return acc;
}

const AdvantageGAEViz = () => {
  const [lambda, setLambda] = useState(0.95);
  const [selected, setSelected] = useState(3);

  const deltas = useMemo(() => computeDeltas(), []);
  const advantage = useMemo(
    () => gaeAt(selected, lambda, deltas),
    [selected, lambda, deltas],
  );

  // Полилиния V(s)
  const vPath = V_HAT
    .map((v, i) => `${i === 0 ? "M" : "L"} ${stepPx(i).toFixed(1)} ${vToPx(v).toFixed(1)}`)
    .join(" ");

  // Узкое окно для λ→0, широкое для λ→1: weight = (γλ)^l нормированный
  const weights: number[] = [];
  for (let l = 0; selected + l < N; l++) {
    weights.push(Math.pow(GAMMA * lambda, l));
  }
  const maxW = weights[0] || 1;

  const biasVarLabel =
    lambda < 0.15
      ? "λ → 0 · низкая дисперсия / высокий bias"
      : lambda > 0.85
        ? "λ → 1 · низкий bias / высокая дисперсия"
        : "сбалансированный режим";

  return (
    <div
      className="rounded-xl"
      style={{
        border: `1px solid ${BORDER}`,
        background: "rgba(0,0,0,0.25)",
        padding: 16,
        marginTop: 8,
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
        Преимущество A и компромисс bias / variance (λ)
      </h3>

      {/* Контролы */}
      <div className="flex flex-wrap items-center gap-4 mb-3">
        <label className="flex items-center gap-2" style={{ minWidth: 240 }}>
          <span style={{ fontFamily: MONO, fontSize: 12, color: DIM }}>
            λ (GAE)
          </span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={lambda}
            onChange={(e) => setLambda(Number(e.target.value))}
            style={{ accentColor: CYAN, flex: 1, maxWidth: 200 }}
            aria-label="Лямбда GAE"
          />
          <span
            style={{ fontFamily: MONO, fontSize: 12, color: TEXT, minWidth: 44 }}
          >
            {lambda.toFixed(2)}
          </span>
        </label>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 11,
            color: MUTED,
            letterSpacing: "0.02em",
          }}
        >
          {biasVarLabel}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          width="100%"
          style={{ display: "block", minWidth: 520, maxWidth: 760 }}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="V критика, награды и окно вклада δ-ошибок для GAE"
        >
          {/* Подписи осей */}
          <text x={6} y={vToPx(0.9) + 4} fontFamily={MONO} fontSize="10" fill={MUTED}>
            V(s)
          </text>
          <text x={6} y={R_BASE - 2} fontFamily={MONO} fontSize="10" fill={MUTED}>
            r_t
          </text>

          {/* Сетка / нулевая линия для V */}
          <line
            x1={PAD_L}
            y1={vToPx(0)}
            x2={PAD_L + PLOT_W}
            y2={vToPx(0)}
            stroke="rgba(255,255,255,0.08)"
          />

          {/* Окно вклада δ_{t+l} (подсветка опорного шага и хвоста) */}
          {weights.map((w, l) => {
            const i = selected + l;
            const alpha = (w / maxW) * (l === 0 ? 0.55 : 0.45);
            return (
              <rect
                key={l}
                x={stepPx(i) - STEP_X / 2}
                y={V_TOP - 4}
                width={STEP_X}
                height={R_BASE + R_MAX_PX - V_TOP + 8}
                fill={CYAN}
                opacity={alpha}
              />
            );
          })}

          {/* Полилиния V */}
          <path d={vPath} fill="none" stroke={CYAN} strokeWidth="1.6" />

          {/* Лента-шаги (нумерация снизу) */}
          <line
            x1={PAD_L - 6}
            y1={LANE_Y}
            x2={PAD_L + PLOT_W + 6}
            y2={LANE_Y}
            stroke="rgba(255,255,255,0.2)"
          />

          {/* Награды-бары */}
          {REWARDS.map((r, i) => {
            const h = rToHeight(r);
            const pos = r >= 0;
            return (
              <rect
                key={i}
                x={stepPx(i) - 8}
                y={pos ? R_BASE : R_BASE - h}
                width={16}
                height={h}
                fill={MAGENTA}
                opacity={0.78}
                rx={2}
              />
            );
          })}

          {/* Точки шагов */}
          {REWARDS.map((_r, i) => {
            const active = i === selected;
            return (
              <g key={i} style={{ cursor: "pointer" }} onClick={() => setSelected(i)}>
                <circle
                  cx={stepPx(i)}
                  cy={LANE_Y}
                  r={active ? 8 : 5}
                  fill={active ? TEXT : "rgba(255,255,255,0.5)"}
                  stroke={active ? CYAN : "transparent"}
                  strokeWidth="2"
                />
                <text
                  x={stepPx(i)}
                  y={LANE_Y - 12}
                  textAnchor="middle"
                  fontFamily={MONO}
                  fontSize="10"
                  fill={active ? TEXT : MUTED}
                >
                  t={i}
                </text>
              </g>
            );
          })}

          {/* Плашка advantage для выбранного шага */}
          <g>
            <rect
              x={stepPx(selected) + 12}
              y={LANE_Y + 4}
              width={148}
              height={32}
              rx={4}
              fill="rgba(0,255,214,0.10)"
              stroke={`${CYAN}88`}
              strokeWidth="1"
            />
            <text
              x={stepPx(selected) + 20}
              y={LANE_Y + 18}
              fontFamily={MONO}
              fontSize="11"
              fill={DIM}
            >
              A(s,a) ≈ GAE
            </text>
            <text
              x={stepPx(selected) + 20}
              y={LANE_Y + 32}
              fontFamily={MONO}
              fontSize="12"
              fill={advantage >= 0 ? CYAN : MAGENTA}
            >
              {advantage >= 0 ? "+" : ""}
              {advantage.toFixed(3)}
            </text>
          </g>
        </svg>
      </div>

      <div
        style={{
          fontFamily: MONO,
          fontSize: 11,
          color: MUTED,
          marginTop: 4,
        }}
      >
        кликните по точке t, чтобы выбрать шаг. γ = {GAMMA}, ширина CYAN-заливки = (γλ)<sup>l</sup>.
      </div>

      {/* Формулы */}
      <div
        className="mt-4 px-3 py-2 rounded-md space-y-1"
        style={{
          border: `1px solid ${BORDER}`,
          background: SURFACE,
          color: TEXT,
          overflowX: "auto",
        }}
      >
        <MathTex>{"\\delta_t = r_t + \\gamma V(s_{t+1}) - V(s_t)"}</MathTex>
        <MathTex>
          {"\\hat{A}_t^{\\mathrm{GAE}(\\gamma,\\lambda)} = \\sum_{l=0}^{\\infty} (\\gamma\\lambda)^{l}\\, \\delta_{t+l}"}
        </MathTex>
        <MathTex display={false}>
          {"A^{\\pi}(s,a) = Q^{\\pi}(s,a) - V^{\\pi}(s)"}
        </MathTex>
      </div>

      <p
        style={{
          color: DIM,
          fontSize: 13,
          lineHeight: 1.6,
          marginTop: 10,
        }}
      >
        Для Охотника λ решает, сходится ли обучение за 1М шагов или за 5М.
      </p>
    </div>
  );
};

export default AdvantageGAEViz;
