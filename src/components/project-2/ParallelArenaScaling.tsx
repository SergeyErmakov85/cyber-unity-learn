/**
 * ParallelArenaScaling — две связанные визуализации параллельных арен.
 * Используется в src/pages/CourseProject2.tsx, секция #parallel-envs,
 * после абзаца про TrainingAreaReplicator 4×4 + --num-envs=2,
 * перед карточкой «Один Behavior, один буфер, один градиент».
 *
 * Слева — сетка мини-арен (1, 4, 9, 16) с Hunter/Target клонами.
 * Справа — line-chart «Идеал ×N vs Реально» с насыщающейся кривой.
 */

import { useMemo, useState } from "react";

const TEXT = "#F4F7FC";
const DIM = "#B0B8CE";
const MUTED = "#6B7490";
const CYAN = "#00FFD6";
const MAGENTA = "#D946EF";
const BORDER = "rgba(255,255,255,0.05)";
const SURFACE = "rgba(255,255,255,0.02)";
const ORBITRON = "'Orbitron', ui-sans-serif, system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const COUNTS = [1, 4, 9, 16];

// Реальное ускорение: насыщается на ~×2 (плато на больших N)
const realSpeedup = (n: number) => 1 + (1 / 0.55) * (1 - Math.exp(-0.18 * (n - 1)));

const VB_W = 300;
const VB_H = 220;
const PAD_L = 36;
const PAD_R = 14;
const PAD_T = 18;
const PAD_B = 28;
const PLOT_W = VB_W - PAD_L - PAD_R;
const PLOT_H = VB_H - PAD_T - PAD_B;

const X_MIN = 1;
const X_MAX = 16;
const Y_MIN = 1;
const Y_MAX = 16;

const xOf = (n: number) => PAD_L + ((n - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;
const yOf = (s: number) => PAD_T + (1 - (s - Y_MIN) / (Y_MAX - Y_MIN)) * PLOT_H;

// Mini-arena positions (deterministic pseudo-random inside [0.15..0.85])
const arenaPositions = (count: number) => {
  const arr: { hx: number; hy: number; tx: number; ty: number }[] = [];
  for (let i = 0; i < count; i++) {
    const seed = i * 2654435761;
    const r1 = ((seed >>> 0) % 1000) / 1000;
    const r2 = (((seed * 7) >>> 0) % 1000) / 1000;
    const r3 = (((seed * 13) >>> 0) % 1000) / 1000;
    const r4 = (((seed * 19) >>> 0) % 1000) / 1000;
    arr.push({
      hx: 0.18 + r1 * 0.64,
      hy: 0.18 + r2 * 0.64,
      tx: 0.18 + r3 * 0.64,
      ty: 0.18 + r4 * 0.64,
    });
  }
  return arr;
};

const ParallelArenaScaling = () => {
  const [idx, setIdx] = useState(2); // default 9
  const count = COUNTS[idx];
  const grid = Math.sqrt(count); // 1, 2, 3, 4
  const positions = useMemo(() => arenaPositions(count), [count]);

  const realPath = useMemo(() => {
    const steps = 60;
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const n = X_MIN + ((X_MAX - X_MIN) * i) / steps;
      const s = realSpeedup(n);
      d += `${i === 0 ? "M" : "L"}${xOf(n).toFixed(2)},${yOf(s).toFixed(2)} `;
    }
    return d;
  }, []);

  const idealPath = `M${xOf(X_MIN)},${yOf(Y_MIN)} L${xOf(X_MAX)},${yOf(Y_MAX)}`;
  const dotX = xOf(count);
  const dotY = yOf(realSpeedup(count));
  const realAtCount = realSpeedup(count).toFixed(2);

  // Grid arena canvas
  const ARENA_VB = 240;
  const cellSize = ARENA_VB / grid;

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
        TrainingAreaReplicator: больше арен ≠ во столько же раз быстрее
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        {/* LEFT: arenas grid */}
        <div
          style={{
            border: `1px solid ${BORDER}`,
            background: SURFACE,
            borderRadius: 8,
            padding: 12,
          }}
        >
          <div className="flex flex-col gap-2 mb-2">
            <label
              style={{ fontFamily: MONO, fontSize: 12, color: DIM }}
              className="flex items-center justify-between"
            >
              <span>Число арен</span>
              <span style={{ color: CYAN, fontSize: 14 }}>
                {count} ({grid}×{grid})
              </span>
            </label>
            <input
              type="range"
              min={0}
              max={COUNTS.length - 1}
              step={1}
              value={idx}
              onChange={(e) => setIdx(parseInt(e.target.value, 10))}
              style={{ accentColor: CYAN, width: "100%" }}
            />
            <div className="flex justify-between" style={{ fontFamily: MONO, fontSize: 10, color: MUTED }}>
              {COUNTS.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
          </div>

          <svg viewBox={`0 0 ${ARENA_VB} ${ARENA_VB}`} style={{ width: "100%", height: "auto", display: "block" }}>
            <rect
              x={0}
              y={0}
              width={ARENA_VB}
              height={ARENA_VB}
              fill="rgba(0,0,0,0.35)"
              stroke={MUTED}
              strokeOpacity={0.4}
              strokeWidth={0.5}
              rx={4}
            />
            {positions.map((p, i) => {
              const row = Math.floor(i / grid);
              const col = i % grid;
              const x0 = col * cellSize;
              const y0 = row * cellSize;
              const pad = Math.max(2, cellSize * 0.06);
              return (
                <g key={i}>
                  <rect
                    x={x0 + pad}
                    y={y0 + pad}
                    width={cellSize - pad * 2}
                    height={cellSize - pad * 2}
                    fill="rgba(0,255,214,0.04)"
                    stroke={CYAN}
                    strokeOpacity={0.45}
                    strokeWidth={0.6}
                    rx={2}
                  />
                  <circle
                    cx={x0 + pad + p.hx * (cellSize - pad * 2)}
                    cy={y0 + pad + p.hy * (cellSize - pad * 2)}
                    r={Math.max(1.5, cellSize * 0.06)}
                    fill={CYAN}
                  />
                  <circle
                    cx={x0 + pad + p.tx * (cellSize - pad * 2)}
                    cy={y0 + pad + p.ty * (cellSize - pad * 2)}
                    r={Math.max(1.2, cellSize * 0.05)}
                    fill={MAGENTA}
                  />
                </g>
              );
            })}
          </svg>

          <p style={{ color: DIM, fontSize: 12, marginTop: 8, lineHeight: 1.5 }}>
            Один Behavior <span style={{ fontFamily: MONO, color: TEXT }}>«Hunter»</span>, один
            общий буфер, один шаг градиента PPO.
          </p>
        </div>

        {/* RIGHT: speedup chart */}
        <div
          style={{
            border: `1px solid ${BORDER}`,
            background: SURFACE,
            borderRadius: 8,
            padding: 12,
          }}
        >
          <div className="flex justify-between items-baseline mb-2" style={{ fontFamily: MONO, fontSize: 12 }}>
            <span style={{ color: DIM }}>Ускорение ×</span>
            <span style={{ color: CYAN, fontSize: 14 }}>
              реально ≈ ×{realAtCount}
            </span>
          </div>

          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ width: "100%", height: "auto", display: "block" }}>
            {/* Axes */}
            <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={VB_H - PAD_B} stroke={MUTED} strokeWidth={1} />
            <line x1={PAD_L} y1={VB_H - PAD_B} x2={VB_W - PAD_R} y2={VB_H - PAD_B} stroke={MUTED} strokeWidth={1} />

            {/* Y ticks */}
            {[1, 4, 8, 12, 16].map((v) => (
              <g key={v}>
                <line
                  x1={PAD_L}
                  y1={yOf(v)}
                  x2={VB_W - PAD_R}
                  y2={yOf(v)}
                  stroke={MUTED}
                  strokeOpacity={0.15}
                  strokeDasharray="2 3"
                />
                <text x={PAD_L - 6} y={yOf(v) + 3} textAnchor="end" fontFamily={MONO} fontSize={10} fill={DIM}>
                  ×{v}
                </text>
              </g>
            ))}
            {/* X ticks */}
            {COUNTS.map((n) => (
              <g key={n}>
                <line
                  x1={xOf(n)}
                  y1={VB_H - PAD_B}
                  x2={xOf(n)}
                  y2={VB_H - PAD_B + 3}
                  stroke={MUTED}
                />
                <text
                  x={xOf(n)}
                  y={VB_H - PAD_B + 14}
                  textAnchor="middle"
                  fontFamily={MONO}
                  fontSize={10}
                  fill={DIM}
                >
                  {n}
                </text>
              </g>
            ))}

            {/* Ideal line */}
            <path d={idealPath} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="4 4" />
            {/* Real curve */}
            <path d={realPath} fill="none" stroke={CYAN} strokeWidth={2} />

            {/* Marker */}
            <line x1={dotX} y1={PAD_T} x2={dotX} y2={VB_H - PAD_B} stroke={CYAN} strokeOpacity={0.25} strokeDasharray="2 3" />
            <circle cx={dotX} cy={dotY} r={5} fill={CYAN} stroke="#000" strokeWidth={1} />
            <circle cx={dotX} cy={yOf(count)} r={3} fill={MUTED} />

            {/* Labels */}
            <text x={VB_W - PAD_R - 4} y={yOf(Y_MAX) + 12} textAnchor="end" fontFamily={MONO} fontSize={10} fill={DIM}>
              Идеал ×N
            </text>
            <text x={VB_W - PAD_R - 4} y={yOf(realSpeedup(X_MAX)) - 4} textAnchor="end" fontFamily={MONO} fontSize={10} fill={CYAN}>
              Реально
            </text>
            <text x={VB_W / 2} y={VB_H - 4} textAnchor="middle" fontFamily={MONO} fontSize={10} fill={DIM}>
              число арен
            </text>
          </svg>

          <p style={{ color: DIM, fontSize: 13, marginTop: 8, lineHeight: 1.55 }}>
            Физика/рендер масштабируются сублинейно; bottleneck смещается с
            rollout на сам PPO update — 8 арен ≈ ×2, а не ×8.
          </p>
        </div>
      </div>

      {/* Warning */}
      <div
        style={{
          marginTop: 14,
          border: `1px solid ${MAGENTA}`,
          background: "rgba(217,70,239,0.04)",
          borderRadius: 8,
          padding: "10px 12px",
          color: DIM,
          fontSize: 13,
          lineHeight: 1.55,
        }}
      >
        <span style={{ fontFamily: MONO, color: MAGENTA }}>⚠ Issue #6068 · </span>
        при части сочетаний <span style={{ fontFamily: MONO, color: TEXT }}>num-areas</span> +{" "}
        <span style={{ fontFamily: MONO, color: TEXT }}>--num-envs</span> тренер может зависать.
        Безопасно: Replicator ≤ 16 + <span style={{ fontFamily: MONO, color: TEXT }}>--num-envs ≤ 4</span>.
      </div>
    </div>
  );
};

export default ParallelArenaScaling;
