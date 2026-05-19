/**
 * PPOClipViz — clipped surrogate objective L^CLIP для капстоуна Hunter.
 * Используется в src/pages/CourseProject2.tsx, секция #ppo-hyperparams,
 * между карточкой «На каких величинах PPO учит политику»
 * и таблицей «hunter.yaml построчно».
 *
 * Инлайновый SVG, оси r∈[0,2], objective; две кривые-сценария Â>0 / Â<0;
 * вертикальные пунктиры 1±ε, magenta-заливка clip-зоны; слайдер ε.
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

const VB_W = 560;
const VB_H = 320;
const PAD_L = 44;
const PAD_R = 18;
const PAD_T = 22;
const PAD_B = 36;
const PLOT_W = VB_W - PAD_L - PAD_R;
const PLOT_H = VB_H - PAD_T - PAD_B;

const R_MIN = 0;
const R_MAX = 2;
const Y_MIN = -1.6;
const Y_MAX = 1.6;

const xOf = (r: number) => PAD_L + ((r - R_MIN) / (R_MAX - R_MIN)) * PLOT_W;
const yOf = (v: number) => PAD_T + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * PLOT_H;

const buildPath = (fn: (r: number) => number) => {
  const steps = 200;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const r = R_MIN + ((R_MAX - R_MIN) * i) / steps;
    const v = fn(r);
    d += `${i === 0 ? "M" : "L"}${xOf(r).toFixed(2)},${yOf(v).toFixed(2)} `;
  }
  return d;
};

const PPOClipViz = () => {
  const [advPositive, setAdvPositive] = useState(true);
  const [eps, setEps] = useState(0.2);
  const A = advPositive ? 1 : -1;

  const { surrPath, clipPath, lclipPath } = useMemo(() => {
    const surr = (r: number) => r * A;
    const clipped = (r: number) => Math.min(Math.max(r, 1 - eps), 1 + eps) * A;
    const lclip = (r: number) => (A > 0 ? Math.min(surr(r), clipped(r)) : Math.max(surr(r), clipped(r)));
    return {
      surrPath: buildPath(surr),
      clipPath: buildPath(clipped),
      lclipPath: buildPath(lclip),
    };
  }, [A, eps]);

  const xLo = xOf(1 - eps);
  const xHi = xOf(1 + eps);

  return (
    <div
      className="my-6"
      style={{
        border: `1px solid ${BORDER}`,
        background: "rgba(0,0,0,0.25)",
        borderRadius: 12,
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
        Clipped surrogate: почему политика не «улетает» за один шаг
      </h3>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setAdvPositive(true)}
            style={{
              fontFamily: MONO,
              fontSize: 12,
              padding: "6px 12px",
              borderRadius: 6,
              border: `1px solid ${advPositive ? CYAN : BORDER}`,
              background: advPositive ? "rgba(0,255,214,0.12)" : "transparent",
              color: advPositive ? CYAN : DIM,
              cursor: "pointer",
            }}
          >
            Â &gt; 0
          </button>
          <button
            onClick={() => setAdvPositive(false)}
            style={{
              fontFamily: MONO,
              fontSize: 12,
              padding: "6px 12px",
              borderRadius: 6,
              border: `1px solid ${!advPositive ? MAGENTA : BORDER}`,
              background: !advPositive ? "rgba(217,70,239,0.12)" : "transparent",
              color: !advPositive ? MAGENTA : DIM,
              cursor: "pointer",
            }}
          >
            Â &lt; 0
          </button>
        </div>
        <label className="flex items-center gap-2 flex-1 w-full">
          <span style={{ fontFamily: MONO, fontSize: 12, color: DIM, whiteSpace: "nowrap" }}>
            ε = {eps.toFixed(2)}
          </span>
          <input
            type="range"
            min={0.1}
            max={0.3}
            step={0.01}
            value={eps}
            onChange={(e) => setEps(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: CYAN }}
          />
        </label>
      </div>

      {/* SVG chart */}
      <div
        style={{
          border: `1px solid ${BORDER}`,
          background: SURFACE,
          borderRadius: 8,
          padding: 8,
        }}
      >
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ width: "100%", height: "auto", display: "block" }}>
          {/* Axes */}
          <line x1={PAD_L} y1={yOf(0)} x2={VB_W - PAD_R} y2={yOf(0)} stroke={MUTED} strokeWidth={1} />
          <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={VB_H - PAD_B} stroke={MUTED} strokeWidth={1} />

          {/* Grid + X ticks */}
          {[0, 0.5, 1, 1.5, 2].map((r) => (
            <g key={r}>
              <line
                x1={xOf(r)}
                y1={PAD_T}
                x2={xOf(r)}
                y2={VB_H - PAD_B}
                stroke={MUTED}
                strokeWidth={0.5}
                strokeDasharray="2 4"
                opacity={0.3}
              />
              <text x={xOf(r)} y={VB_H - PAD_B + 14} textAnchor="middle" fontFamily={MONO} fontSize={10} fill={DIM}>
                {r.toFixed(1)}
              </text>
            </g>
          ))}
          {/* Y ticks */}
          {[-1, 0, 1].map((v) => (
            <g key={v}>
              <text x={PAD_L - 6} y={yOf(v) + 3} textAnchor="end" fontFamily={MONO} fontSize={10} fill={DIM}>
                {v}
              </text>
            </g>
          ))}

          {/* Clip zone (magenta translucent band on X) */}
          <rect
            x={xLo}
            y={PAD_T}
            width={xHi - xLo}
            height={PLOT_H}
            fill={MAGENTA}
            opacity={0.08}
          />
          {/* Vertical dashes at 1−ε and 1+ε */}
          <line x1={xLo} y1={PAD_T} x2={xLo} y2={VB_H - PAD_B} stroke={MAGENTA} strokeWidth={1} strokeDasharray="4 4" opacity={0.6} />
          <line x1={xHi} y1={PAD_T} x2={xHi} y2={VB_H - PAD_B} stroke={MAGENTA} strokeWidth={1} strokeDasharray="4 4" opacity={0.6} />
          <text x={xLo} y={PAD_T - 6} textAnchor="middle" fontFamily={MONO} fontSize={10} fill={MAGENTA}>
            1−ε
          </text>
          <text x={xHi} y={PAD_T - 6} textAnchor="middle" fontFamily={MONO} fontSize={10} fill={MAGENTA}>
            1+ε
          </text>

          {/* r=1 marker */}
          <line x1={xOf(1)} y1={PAD_T} x2={xOf(1)} y2={VB_H - PAD_B} stroke={DIM} strokeWidth={0.5} opacity={0.5} />

          {/* Curves */}
          <path d={surrPath} fill="none" stroke={DIM} strokeWidth={1.2} strokeDasharray="5 4" />
          <path d={clipPath} fill="none" stroke={MAGENTA} strokeWidth={1.6} opacity={0.85} />
          <path d={lclipPath} fill="none" stroke={CYAN} strokeWidth={2.5} />

          {/* Axis labels */}
          <text x={VB_W - PAD_R} y={yOf(0) - 6} textAnchor="end" fontFamily={MONO} fontSize={11} fill={DIM}>
            r_t(θ)
          </text>
          <text x={PAD_L + 6} y={PAD_T + 10} fontFamily={MONO} fontSize={11} fill={DIM}>
            objective
          </text>
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 px-1" style={{ fontFamily: MONO, fontSize: 11 }}>
          <span style={{ color: DIM }}>
            <span style={{ display: "inline-block", width: 18, height: 0, borderTop: `2px dashed ${DIM}`, verticalAlign: "middle", marginRight: 4 }} />
            r·Â
          </span>
          <span style={{ color: MAGENTA }}>
            <span style={{ display: "inline-block", width: 18, height: 2, background: MAGENTA, verticalAlign: "middle", marginRight: 4 }} />
            clip(r,1−ε,1+ε)·Â
          </span>
          <span style={{ color: CYAN }}>
            <span style={{ display: "inline-block", width: 18, height: 3, background: CYAN, verticalAlign: "middle", marginRight: 4 }} />
            L^CLIP
          </span>
        </div>
      </div>

      {/* Formulas */}
      <div className="mt-4 space-y-2 overflow-x-auto">
        <MathTex>{"L^{\\mathrm{CLIP}}(\\theta) = \\hat{\\mathbb{E}}_t\\!\\left[\\min\\!\\big(r_t\\hat{A}_t,\\ \\operatorname{clip}(r_t, 1-\\varepsilon, 1+\\varepsilon)\\hat{A}_t\\big)\\right]"}</MathTex>
        <MathTex display={false}>{"r_t(\\theta) = \\dfrac{\\pi_{\\theta}(a_t \\mid s_t)}{\\pi_{\\theta_{\\mathrm{old}}}(a_t \\mid s_t)}"}</MathTex>
      </div>

      <p style={{ color: DIM, fontSize: 13, marginTop: 12, lineHeight: 1.6 }}>
        ε в <span style={{ fontFamily: MONO, color: TEXT }}>hunter.yaml</span> — это и есть полуширина
        коридора <span style={{ fontFamily: MONO, color: TEXT }}>[1−ε, 1+ε]</span>.
      </p>
    </div>
  );
};

export default PPOClipViz;
