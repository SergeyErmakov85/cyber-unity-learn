/**
 * RewardSandbox — keystone-интерактив капстоуна.
 * Используется в src/pages/CourseProject2.tsx, секция #reward-sandbox.
 *
 * Слева — мини-арена с анимированным Hunter, поведение определяется эвристикой
 * от текущих компонентов награды. Справа — два прогнозных sparkline (Reward,
 * Episode Length). Снизу — формула r_t через <Math> и вердикт-плашка.
 *
 * Паттерн анимации: слайдеры — controlled useState; rAF-цикл читает значения
 * через useRef, который синхронизируется в useEffect (как в infinite-series-viz).
 */

import { useEffect, useMemo, useRef, useState } from "react";
import MathTex from "@/components/Math";

const TEXT = "#F4F7FC";
const DIM = "#B0B8CE";
const MUTED = "#6B7490";
const CYAN = "#00FFD6";
const MAGENTA = "#D946EF";
const GREEN = "#22d3ee"; // healthy verdict accent (cyan-tealish, keeps neon palette)
const HEALTHY = "#34d399";
const BORDER = "rgba(255,255,255,0.05)";
const SURFACE = "rgba(255,255,255,0.02)";
const ORBITRON = "'Orbitron', ui-sans-serif, system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const ARENA_VB = 320;
const ARENA_PAD = 18;
const ARENA_INNER = ARENA_VB - ARENA_PAD * 2;
const HUNTER_R = 7;
const TARGET_R = 6;
const CATCH_DIST = 16;

const SPK_W = 240;
const SPK_H = 90;
const SPK_PAD = 8;
const SPK_PLOT_W = SPK_W - SPK_PAD * 2;
const SPK_PLOT_H = SPK_H - SPK_PAD * 2;
const SPK_N = 60;

type Params = {
  pbrs: number;
  terminal: number;
  time: number;
  collision: number;
  targetSpeed: number;
  dense: boolean;
};

type Verdict = {
  kind: "healthy" | "circle" | "hover" | "wall" | "noop";
  label: string;
};

// --- Heuristic verdict from params ---
const judge = (p: Params): Verdict => {
  if (p.dense) {
    return { kind: "hover", label: "⚠ r = −d ломает оптимум: Hunter зависает у цели, эпизод не закрывается." };
  }
  // PBRS overwhelms terminal → circling for shaping plus.
  // Total PBRS over an episode ~ pbrs * 200 (rough), compare to terminal.
  const pbrsBudget = p.pbrs * 150;
  if (p.terminal < 0.2) {
    return { kind: "hover", label: "⚠ Зависание у цели: terminal слишком мал — нет стимула «добивать»." };
  }
  if (pbrsBudget > p.terminal * 1.2 && p.pbrs > 0.05) {
    return { kind: "circle", label: "⚠ Reward hacking: кружение — PBRS перевешивает terminal." };
  }
  if (p.collision < 0.005 && p.pbrs > 0.06) {
    return { kind: "wall", label: "⚠ Возможен эксплойт стен: collision penalty почти выключен." };
  }
  if (p.time > 0.003 && p.terminal < 0.6) {
    return { kind: "noop", label: "⚠ Time penalty душит обучение быстрее, чем растёт terminal-сигнал." };
  }
  return { kind: "healthy", label: "✓ Здоровая награда — Hunter ловит цель, Episode Length падает." };
};

// --- Predicted curves ---
const series = (fn: (t: number) => number) => Array.from({ length: SPK_N }, (_, i) => fn(i / (SPK_N - 1)));

const predict = (p: Params): { reward: number[]; length: number[] } => {
  const v = judge(p);
  if (v.kind === "healthy") {
    const plateau = Math.min(1, p.terminal * 0.95);
    return {
      reward: series((t) => 0.05 + (plateau - 0.05) * (1 - Math.exp(-3.2 * t))),
      length: series((t) => 0.92 - 0.78 * (1 - Math.exp(-2.6 * t))),
    };
  }
  if (v.kind === "circle") {
    const plateau = Math.min(1.2, p.pbrs * 18 + p.terminal * 0.3);
    return {
      reward: series((t) => 0.05 + plateau * (1 - Math.exp(-2.5 * t))),
      length: series(() => 0.95),
    };
  }
  if (v.kind === "hover") {
    const plateau = Math.min(0.7, 0.35 + p.terminal * 0.3);
    return {
      reward: series((t) => 0.05 + plateau * (1 - Math.exp(-2.2 * t))),
      length: series(() => 0.96),
    };
  }
  if (v.kind === "wall") {
    return {
      reward: series((t) => 0.05 + 0.45 * t + 0.05 * Math.sin(t * 12)),
      length: series((t) => 0.7 + 0.15 * Math.sin(t * 9)),
    };
  }
  // noop / dead-loop training
  return {
    reward: series((t) => 0.05 + 0.18 * (1 - Math.exp(-2 * t))),
    length: series(() => 0.88),
  };
};

const sparkPath = (vals: number[]) => {
  const xOf = (i: number) => SPK_PAD + (i / (SPK_N - 1)) * SPK_PLOT_W;
  const yOf = (v: number) => SPK_PAD + (1 - Math.max(0, Math.min(1, v))) * SPK_PLOT_H;
  return vals.map((v, i) => `${i === 0 ? "M" : "L"}${xOf(i).toFixed(1)},${yOf(v).toFixed(2)}`).join(" ");
};

// ----- Slider primitive -----
const Slider = ({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) => (
  <label className="block">
    <div className="flex items-baseline justify-between mb-1">
      <span style={{ fontFamily: MONO, fontSize: 12, color: DIM }}>{label}</span>
      <span style={{ fontFamily: MONO, fontSize: 17, color: CYAN }}>{format(value)}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      style={{ width: "100%", accentColor: CYAN }}
    />
  </label>
);

const RewardSandbox = () => {
  const [pbrs, setPbrs] = useState(0.03);
  const [terminal, setTerminal] = useState(1.0);
  const [time, setTime] = useState(0.001);
  const [collision, setCollision] = useState(0.05);
  const [targetSpeed, setTargetSpeed] = useState(0.6);
  const [dense, setDense] = useState(false);

  // Sync to ref for rAF loop
  const paramsRef = useRef<Params>({ pbrs, terminal, time, collision, targetSpeed, dense });
  useEffect(() => {
    paramsRef.current = { pbrs, terminal, time, collision, targetSpeed, dense };
  }, [pbrs, terminal, time, collision, targetSpeed, dense]);

  // Animation state in refs
  const hunterRef = useRef({ x: ARENA_PAD + 30, y: ARENA_PAD + 30 });
  const targetRef = useRef({
    x: ARENA_PAD + ARENA_INNER * 0.7,
    y: ARENA_PAD + ARENA_INNER * 0.6,
    vx: 1,
    vy: 0.4,
  });
  const tickRef = useRef(0);

  // For React re-render of agent/target positions
  const [, force] = useState(0);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(33, now - last) / 16.666; // normalize to 60fps frames
      last = now;
      tickRef.current += dt;

      const p = paramsRef.current;
      const verdict = judge(p);
      const t = targetRef.current;
      const h = hunterRef.current;

      // Move target with bounce
      const tspd = Math.max(0.05, p.targetSpeed) * 1.4;
      t.x += t.vx * tspd * dt;
      t.y += t.vy * tspd * dt;
      if (t.x < ARENA_PAD + TARGET_R) {
        t.x = ARENA_PAD + TARGET_R;
        t.vx = Math.abs(t.vx);
      } else if (t.x > ARENA_PAD + ARENA_INNER - TARGET_R) {
        t.x = ARENA_PAD + ARENA_INNER - TARGET_R;
        t.vx = -Math.abs(t.vx);
      }
      if (t.y < ARENA_PAD + TARGET_R) {
        t.y = ARENA_PAD + TARGET_R;
        t.vy = Math.abs(t.vy);
      } else if (t.y > ARENA_PAD + ARENA_INNER - TARGET_R) {
        t.y = ARENA_PAD + ARENA_INNER - TARGET_R;
        t.vy = -Math.abs(t.vy);
      }

      // Hunter behavior by verdict
      const dx = t.x - h.x;
      const dy = t.y - h.y;
      const dist = Math.hypot(dx, dy) || 1;
      const hspd = 2.2 * dt;

      if (verdict.kind === "circle") {
        // Orbit around target at radius ~30
        const desiredR = 32;
        const angle = Math.atan2(h.y - t.y, h.x - t.x) + 0.07;
        h.x = t.x + Math.cos(angle) * desiredR;
        h.y = t.y + Math.sin(angle) * desiredR;
      } else if (verdict.kind === "hover") {
        // Move close to target then idle near it
        if (dist > 22) {
          h.x += (dx / dist) * hspd;
          h.y += (dy / dist) * hspd;
        } else {
          h.x += Math.cos(tickRef.current * 0.1) * 0.3;
          h.y += Math.sin(tickRef.current * 0.1) * 0.3;
        }
      } else if (verdict.kind === "wall") {
        // Drift toward target but bias toward walls
        h.x += (dx / dist) * hspd * 0.6 + (h.x < ARENA_VB / 2 ? -0.4 : 0.4);
        h.y += (dy / dist) * hspd * 0.6;
      } else if (verdict.kind === "noop") {
        // Slow drift, doesn't really chase
        h.x += (dx / dist) * hspd * 0.3;
        h.y += (dy / dist) * hspd * 0.3;
      } else {
        // healthy: chase and catch
        h.x += (dx / dist) * hspd;
        h.y += (dy / dist) * hspd;
        if (dist < CATCH_DIST) {
          // "catch" → respawn target at random corner
          const corners = [
            { x: ARENA_PAD + 30, y: ARENA_PAD + 30 },
            { x: ARENA_PAD + ARENA_INNER - 30, y: ARENA_PAD + 30 },
            { x: ARENA_PAD + 30, y: ARENA_PAD + ARENA_INNER - 30 },
            { x: ARENA_PAD + ARENA_INNER - 30, y: ARENA_PAD + ARENA_INNER - 30 },
          ];
          const c = corners[Math.floor(Math.random() * 4)];
          t.x = c.x;
          t.y = c.y;
          // randomize target direction
          const a = Math.random() * Math.PI * 2;
          t.vx = Math.cos(a);
          t.vy = Math.sin(a);
        }
      }

      // Clamp hunter to arena
      h.x = Math.max(ARENA_PAD + HUNTER_R, Math.min(ARENA_PAD + ARENA_INNER - HUNTER_R, h.x));
      h.y = Math.max(ARENA_PAD + HUNTER_R, Math.min(ARENA_PAD + ARENA_INNER - HUNTER_R, h.y));

      force((n) => (n + 1) % 1000000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const params: Params = { pbrs, terminal, time, collision, targetSpeed, dense };
  const verdict = judge(params);
  const { reward, length } = useMemo(() => predict(params), [pbrs, terminal, time, collision, targetSpeed, dense]);

  const verdictColor = verdict.kind === "healthy" ? HEALTHY : MAGENTA;
  const h = hunterRef.current;
  const t = targetRef.current;

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
      <h3
        style={{
          fontFamily: ORBITRON,
          color: TEXT,
          fontSize: 16,
          letterSpacing: "0.04em",
          marginBottom: 12,
        }}
      >
        Песочница награды: крутите компоненты, смотрите на Hunter
      </h3>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        {/* LEFT: arena + sliders */}
        <div className="space-y-3">
          <div
            style={{
              border: `1px solid ${BORDER}`,
              background: SURFACE,
              borderRadius: 8,
              padding: 8,
            }}
          >
            <svg viewBox={`0 0 ${ARENA_VB} ${ARENA_VB}`} style={{ width: "100%", height: "auto", display: "block" }}>
              <rect
                x={ARENA_PAD}
                y={ARENA_PAD}
                width={ARENA_INNER}
                height={ARENA_INNER}
                fill="rgba(0,0,0,0.35)"
                stroke={CYAN}
                strokeOpacity={0.45}
                strokeWidth={1}
                rx={4}
              />
              {/* faint center */}
              <circle cx={ARENA_VB / 2} cy={ARENA_VB / 2} r={2} fill={MUTED} opacity={0.5} />
              {/* Target */}
              <circle cx={t.x} cy={t.y} r={TARGET_R + 2} fill="none" stroke={MAGENTA} strokeOpacity={0.4} />
              <circle cx={t.x} cy={t.y} r={TARGET_R} fill={MAGENTA} />
              {/* Hunter */}
              <circle cx={h.x} cy={h.y} r={HUNTER_R + 3} fill="none" stroke={CYAN} strokeOpacity={0.45} />
              <circle cx={h.x} cy={h.y} r={HUNTER_R} fill={CYAN} stroke="#000" strokeWidth={1} />
              {/* Mode label */}
              <text
                x={ARENA_PAD + 6}
                y={ARENA_PAD + 14}
                fontFamily={MONO}
                fontSize={10}
                fill={verdictColor}
              >
                mode: {verdict.kind}
              </text>
            </svg>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Slider label="PBRS weight" value={pbrs} min={0} max={0.1} step={0.005} format={(v) => v.toFixed(3)} onChange={setPbrs} />
            <Slider label="Terminal bonus" value={terminal} min={0} max={2} step={0.05} format={(v) => v.toFixed(2)} onChange={setTerminal} />
            <Slider label="Time penalty" value={time} min={0} max={0.005} step={0.0001} format={(v) => v.toFixed(4)} onChange={setTime} />
            <Slider label="Collision penalty" value={collision} min={0} max={0.2} step={0.005} format={(v) => v.toFixed(3)} onChange={setCollision} />
            <Slider label="Target speed (× agent)" value={targetSpeed} min={0} max={1} step={0.05} format={(v) => v.toFixed(2)} onChange={setTargetSpeed} />
            <label className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                checked={dense}
                onChange={(e) => setDense(e.target.checked)}
                style={{ accentColor: MAGENTA }}
              />
              <span style={{ fontFamily: MONO, fontSize: 12, color: dense ? MAGENTA : DIM }}>
                Dense без PBRS (r = −d) — сломанный режим
              </span>
            </label>
          </div>
        </div>

        {/* RIGHT: TB forecast */}
        <div className="space-y-3">
          <div
            style={{
              border: `1px solid ${BORDER}`,
              background: SURFACE,
              borderRadius: 8,
              padding: 10,
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 11, color: CYAN, marginBottom: 4 }}>
              Environment/Cumulative Reward
            </div>
            <svg viewBox={`0 0 ${SPK_W} ${SPK_H}`} style={{ width: "100%", height: "auto", display: "block" }}>
              <rect x={SPK_PAD} y={SPK_PAD} width={SPK_PLOT_W} height={SPK_PLOT_H} fill="none" stroke={MUTED} strokeOpacity={0.3} strokeWidth={0.5} />
              {[0.25, 0.5, 0.75].map((g) => (
                <line key={g} x1={SPK_PAD} y1={SPK_PAD + (1 - g) * SPK_PLOT_H} x2={SPK_PAD + SPK_PLOT_W} y2={SPK_PAD + (1 - g) * SPK_PLOT_H} stroke={MUTED} strokeOpacity={0.12} strokeDasharray="2 3" />
              ))}
              <path d={sparkPath(reward)} fill="none" stroke={CYAN} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div
            style={{
              border: `1px solid ${BORDER}`,
              background: SURFACE,
              borderRadius: 8,
              padding: 10,
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 11, color: MAGENTA, marginBottom: 4 }}>
              Environment/Episode Length
            </div>
            <svg viewBox={`0 0 ${SPK_W} ${SPK_H}`} style={{ width: "100%", height: "auto", display: "block" }}>
              <rect x={SPK_PAD} y={SPK_PAD} width={SPK_PLOT_W} height={SPK_PLOT_H} fill="none" stroke={MUTED} strokeOpacity={0.3} strokeWidth={0.5} />
              <line x1={SPK_PAD} y1={SPK_PAD + (1 - 0.95) * SPK_PLOT_H} x2={SPK_PAD + SPK_PLOT_W} y2={SPK_PAD + (1 - 0.95) * SPK_PLOT_H} stroke={MAGENTA} strokeOpacity={0.25} strokeDasharray="3 3" />
              {[0.25, 0.5, 0.75].map((g) => (
                <line key={g} x1={SPK_PAD} y1={SPK_PAD + (1 - g) * SPK_PLOT_H} x2={SPK_PAD + SPK_PLOT_W} y2={SPK_PAD + (1 - g) * SPK_PLOT_H} stroke={MUTED} strokeOpacity={0.12} strokeDasharray="2 3" />
              ))}
              <path d={sparkPath(length)} fill="none" stroke={MAGENTA} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Formula */}
      <div className="mt-4 overflow-x-auto">
        <MathTex>
          {"r_t = \\underbrace{\\gamma\\Phi(s')-\\Phi(s)}_{\\text{PBRS}} \\;-\\; \\underbrace{\\tfrac{1}{\\text{MaxStep}}}_{\\text{time}} \\;+\\; \\underbrace{\\mathbb{1}[\\text{catch}]\\cdot R_{\\text{term}}}_{\\text{terminal}} \\;-\\; \\underbrace{\\mathbb{1}[\\text{hit}]\\cdot c}_{\\text{collision}}"}
        </MathTex>
      </div>

      {/* Verdict */}
      <div
        className="mt-4"
        style={{
          border: `1px solid ${verdictColor}`,
          background:
            verdict.kind === "healthy"
              ? "rgba(52,211,153,0.06)"
              : "rgba(217,70,239,0.06)",
          borderRadius: 8,
          padding: "10px 12px",
          color: verdict.kind === "healthy" ? HEALTHY : MAGENTA,
          fontFamily: MONO,
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        {verdict.label}
      </div>

      {/* Current numeric reward components */}
      <div
        className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2"
        style={{ fontFamily: MONO, fontSize: 11, color: DIM }}
      >
        <div>PBRS · ≤ ±{pbrs.toFixed(3)}</div>
        <div>terminal · +{terminal.toFixed(2)}</div>
        <div>time · −{time.toFixed(4)}/шаг</div>
        <div>collision · −{collision.toFixed(3)}</div>
      </div>
    </div>
  );
};

export default RewardSandbox;
