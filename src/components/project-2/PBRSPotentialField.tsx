/**
 * PBRSPotentialField — потенциальное поле Φ и телескопическое свойство PBRS.
 * Используется в src/pages/CourseProject2.tsx, секция #reward-shaping,
 * карточка «Почему PBRS, а не −distance напрямую», после второго абзаца.
 *
 * Сцена сверху: арена, цель в центре, радиальный градиент Φ(s) = -d(s)/d_max.
 * Тоггл траектории: «Прямо к цели» (Σ shaping растёт) и «Замкнутый цикл»
 * (Σ shaping → 0 по телескопическому свойству).
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

const VB = 360;
const CENTER = { x: VB / 2, y: VB / 2 };
const ARENA = 320;
const ARENA_X = (VB - ARENA) / 2;
const D_MAX = Math.SQRT2 * (ARENA / 2);
const GAMMA = 0.99;

// Прямой путь: от старта к цели по градиенту (~12 шагов)
const DIRECT_PATH: { x: number; y: number }[] = (() => {
  const start = { x: 50, y: 50 };
  const steps = 16;
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    return {
      x: start.x + (CENTER.x - start.x) * t,
      y: start.y + (CENTER.y - start.y) * t,
    };
  });
})();

// Замкнутый цикл: петля и возврат в старт
const LOOP_PATH: { x: number; y: number }[] = (() => {
  const center = { x: 110, y: 110 };
  const radius = 55;
  const steps = 48;
  return Array.from({ length: steps + 1 }, (_, i) => {
    const a = -Math.PI / 2 + (i / steps) * 2 * Math.PI;
    return {
      x: center.x + Math.cos(a) * radius,
      y: center.y + Math.sin(a) * radius,
    };
  });
})();

const phi = (p: { x: number; y: number }) => {
  const d = Math.hypot(p.x - CENTER.x, p.y - CENTER.y);
  return -d / D_MAX;
};

const PBRSPotentialField = () => {
  const [mode, setMode] = useState<"direct" | "loop">("direct");
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const path = mode === "direct" ? DIRECT_PATH : LOOP_PATH;

  useEffect(() => {
    progressRef.current = 0;
    setProgress(0);
    const start = performance.now();
    const duration = mode === "direct" ? 2800 : 4200;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      progressRef.current = t;
      setProgress(t);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mode]);

  // running shaping sum F = γ Φ(s') − Φ(s) along path up to progress
  const visibleCount = Math.max(1, Math.floor(progress * (path.length - 1)) + 1);
  let sumF = 0;
  for (let i = 1; i < visibleCount; i++) {
    sumF += GAMMA * phi(path[i]) - phi(path[i - 1]);
  }

  const agent = path[Math.min(visibleCount - 1, path.length - 1)];

  const traced = path.slice(0, visibleCount);
  const tracedD = traced
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

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
        Потенциальное поле Φ: за кружение плюсов не накопить
      </h3>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => setMode("direct")}
          style={{
            fontFamily: MONO,
            fontSize: 12,
            padding: "6px 12px",
            borderRadius: 6,
            border: `1px solid ${mode === "direct" ? CYAN : BORDER}`,
            background: mode === "direct" ? "rgba(0,255,214,0.12)" : "transparent",
            color: mode === "direct" ? CYAN : DIM,
            cursor: "pointer",
          }}
        >
          Прямо к цели
        </button>
        <button
          onClick={() => setMode("loop")}
          style={{
            fontFamily: MONO,
            fontSize: 12,
            padding: "6px 12px",
            borderRadius: 6,
            border: `1px solid ${mode === "loop" ? MAGENTA : BORDER}`,
            background: mode === "loop" ? "rgba(217,70,239,0.12)" : "transparent",
            color: mode === "loop" ? MAGENTA : DIM,
            cursor: "pointer",
          }}
        >
          Замкнутый цикл
        </button>
      </div>

      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "minmax(0,1fr)", border: `1px solid ${BORDER}`, background: SURFACE, borderRadius: 8, padding: 8 }}
      >
        <div className="grid gap-3 md:grid-cols-[1fr_180px] items-start">
          <svg viewBox={`0 0 ${VB} ${VB}`} style={{ width: "100%", height: "auto", display: "block" }}>
            <defs>
              <radialGradient id="pbrs-phi" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor={CYAN} stopOpacity="0.55" />
                <stop offset="35%" stopColor={CYAN} stopOpacity="0.22" />
                <stop offset="70%" stopColor={CYAN} stopOpacity="0.07" />
                <stop offset="100%" stopColor="#000" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Arena border */}
            <rect
              x={ARENA_X}
              y={ARENA_X}
              width={ARENA}
              height={ARENA}
              fill="rgba(0,0,0,0.35)"
              stroke={MUTED}
              strokeWidth={1}
              rx={6}
            />
            {/* Φ field */}
            <rect
              x={ARENA_X}
              y={ARENA_X}
              width={ARENA}
              height={ARENA}
              fill="url(#pbrs-phi)"
              rx={6}
            />
            {/* Concentric iso-Φ rings */}
            {[40, 80, 120, 160].map((r) => (
              <circle
                key={r}
                cx={CENTER.x}
                cy={CENTER.y}
                r={r}
                fill="none"
                stroke={CYAN}
                strokeOpacity={0.18}
                strokeWidth={0.6}
                strokeDasharray="2 4"
              />
            ))}

            {/* Target */}
            <circle cx={CENTER.x} cy={CENTER.y} r={7} fill={MAGENTA} />
            <circle cx={CENTER.x} cy={CENTER.y} r={11} fill="none" stroke={MAGENTA} strokeOpacity={0.5} />

            {/* Full trajectory (faint) */}
            <path
              d={path.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke={mode === "direct" ? CYAN : MAGENTA}
              strokeOpacity={0.18}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            {/* Traced part */}
            <path
              d={tracedD}
              fill="none"
              stroke={mode === "direct" ? CYAN : MAGENTA}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Start */}
            <circle cx={path[0].x} cy={path[0].y} r={4} fill={TEXT} stroke={MUTED} />
            {/* Agent */}
            <circle cx={agent.x} cy={agent.y} r={6} fill={CYAN} stroke="#000" strokeWidth={1} />
          </svg>

          {/* Side panel: running sum */}
          <div style={{ fontFamily: MONO, fontSize: 12, color: DIM, lineHeight: 1.6 }}>
            <div style={{ color: MUTED, fontSize: 11, marginBottom: 4 }}>текущий шаг</div>
            <div style={{ color: TEXT, fontSize: 14, marginBottom: 10 }}>
              t = {Math.max(0, visibleCount - 1)} / {path.length - 1}
            </div>
            <div style={{ color: MUTED, fontSize: 11, marginBottom: 4 }}>Φ(s_t)</div>
            <div style={{ color: CYAN, fontSize: 14, marginBottom: 10 }}>
              {phi(agent).toFixed(3)}
            </div>
            <div style={{ color: MUTED, fontSize: 11, marginBottom: 4 }}>
              Σ γᵗ F по пути
            </div>
            <div
              style={{
                color: mode === "loop" ? MAGENTA : CYAN,
                fontSize: 18,
                fontWeight: 600,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {sumF.toFixed(4)}
            </div>
            <div style={{ color: MUTED, fontSize: 11, marginTop: 8, lineHeight: 1.5 }}>
              {mode === "direct"
                ? "монотонно растёт → стимул двигаться к цели"
                : "стремится к 0 → за петлю плюсов не накопить"}
            </div>
          </div>
        </div>
      </div>

      {/* Formulas */}
      <div className="mt-4 space-y-2 overflow-x-auto">
        <MathTex>{"\\Phi(s) = -\\dfrac{d(s)}{d_{\\max}}"}</MathTex>
        <MathTex>{"F(s, s') = \\gamma\\,\\Phi(s') - \\Phi(s)"}</MathTex>
        <MathTex>{"\\sum_{t=0}^{T-1} \\gamma^{t} F(s_t, s_{t+1}) = \\gamma^{T}\\Phi(s_T) - \\Phi(s_0)"}</MathTex>
      </div>

      {/* Citation badge */}
      <div
        className="mt-3"
        style={{
          display: "inline-block",
          fontFamily: MONO,
          fontSize: 11,
          color: DIM,
          padding: "6px 10px",
          borderRadius: 6,
          border: `1px solid ${BORDER}`,
          background: "rgba(0,255,214,0.04)",
        }}
      >
        📜 Ng, Harada &amp; Russell, 1999 — policy invariance · Wiewiora 2003 —
        эквивалентность инициализации Q
      </div>

      <p style={{ color: DIM, fontSize: 13, marginTop: 12, lineHeight: 1.6 }}>
        Сумма shaping по любому замкнутому циклу телескопически = 0 → reward
        hacking «кружением» закрыт.
      </p>
    </div>
  );
};

export default PBRSPotentialField;
