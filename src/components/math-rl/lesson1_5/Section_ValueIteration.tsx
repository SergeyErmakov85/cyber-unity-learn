import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import MathFormula from "@/components/Math";
import HubLink from "@/components/math-rl/HubLink";
import { Slider } from "@/components/ui/slider";

/* ─────────────── Design tokens ─────────────── */

const HEADING_FONT =
  "'Orbitron', 'Inter', ui-sans-serif, system-ui, sans-serif";
const MONO_FONT = "'JetBrains Mono', ui-monospace, monospace";
const GLASS_BG = "rgba(12,16,28,0.7)";
const SOFT_BORDER = "rgba(255,255,255,0.06)";
const CYAN = "#00FFD6";
const MAGENTA = "#D946EF";
const AMBER = "#F59E0B";
const COLD = "#F87171";
const HOT = "#00FFD6";

const BODY_STYLE: React.CSSProperties = { fontSize: 14, lineHeight: 1.7 };

/* ─────────────── Python-сниппеты ─────────────── */

const NUMPY_VI_CODE = `def value_iteration(gamma=0.95, tol=1e-9):
    """V*(s) = max_a Q*(s, a). Считать Q из V мы уже умеем (§ 6),
    так что вся итерация — это lookahead плюс max."""
    V = {s: 0.0 for s in STATES}
    residuals, history = [], [V]

    while True:
        Q = Q_from_V(V, gamma)
        new = {s: 0.0 if s in TERMINAL else max(Q[(s, a)] for a in ACTIONS)
               for s in STATES}                       # V* на терминале = 0

        residuals.append(max(abs(new[s] - V[s]) for s in STATES))
        V = new
        history.append(V)                             # снимок для картинки обучения
        if residuals[-1] < tol:
            return V, residuals, history

def greedy_policy(V, gamma=0.95):
    """Оптимальная политика — просто argmax по Q, посчитанному из V*."""
    Q = Q_from_V(V, gamma)
    return {s: max(ACTIONS, key=lambda a: Q[(s, a)])
            for s in STATES if s not in TERMINAL}

V_star, residuals, history = value_iteration()
print(len(residuals), "итераций до сходимости")
print({s: NAMES[a] for s, a in greedy_policy(V_star).items()})

# plot_V из § 5.2 — теперь на оптимальных значениях:
plot_V(V_star, title="V*, оптимальная политика")
plt.show()
`;

const TORCH_VI_CODE = `import torch

# Та же модель из § 3, но разложенная по тензорам. Строится один раз.
IDX = {s: i for i, s in enumerate(STATES)}
P = torch.zeros(9, 4, 9)                                      # P[s, a, s']
for s in STATES:
    for a in ACTIONS:
        for p, s2 in next_states(s, a):
            P[IDX[s], a, IDX[s2]] += p

R = torch.tensor([reward(s) for s in STATES])                 # R[s']
ALIVE = torch.tensor([0.0 if s in TERMINAL else 1.0 for s in STATES])

def value_iteration_torch(gamma=0.95, tol=1e-9):
    V = torch.zeros(9)
    residuals = []

    while True:
        # Q[s, a] = Σ_{s'} P[s, a, s'] · (R[s'] + γ · V[s']) — один matmul
        # вместо всего тройного цикла из версии выше.
        V_new = (P @ (R + gamma * V)).max(dim=1).values * ALIVE

        residuals.append((V_new - V).abs().max().item())
        V = V_new
        if residuals[-1] < tol:
            return V, residuals

V_torch, _ = value_iteration_torch()
print(V_torch.reshape(3, 3).numpy().round(3))
`;

/* ─────────────── Модель мира RoomBot (та же, что в § 5–6) ─────────────── */

const ROWS = 3;
const COLS = 3;
const SLIP = 0.1;

const DELTAS: ReadonlyArray<readonly [number, number]> = [
  [-1, 0], // UP
  [1, 0], //  DOWN
  [0, -1], // LEFT
  [0, 1], //  RIGHT
];

type Cell = { readonly row: number; readonly col: number };

const isBattery = (s: Cell) => s.row === 2 && s.col === 2;
const isPuddle = (s: Cell) => s.row === 1 && s.col === 1;
const isTerminal = (s: Cell) => isBattery(s) || isPuddle(s);

const rewardOf = (s: Cell): number => {
  if (isBattery(s)) return 1.0;
  if (isPuddle(s)) return -1.0;
  return -0.02;
};

const move = (s: Cell, a: number): Cell => {
  const [dr, dc] = DELTAS[a];
  return {
    row: Math.max(0, Math.min(ROWS - 1, s.row + dr)),
    col: Math.max(0, Math.min(COLS - 1, s.col + dc)),
  };
};

type Transition = { readonly p: number; readonly to: Cell };

const nextStates = (s: Cell, a: number): Transition[] => {
  const intended = move(s, a);
  const others: Cell[] = [];
  for (let b = 0; b < 4; b++) if (b !== a) others.push(move(s, b));
  const pOther = SLIP / others.length;
  return [{ p: 1 - SLIP, to: intended }, ...others.map((to) => ({ p: pOther, to }))];
};

/* ─────────────── Алгоритмы с трассировкой сходимости ─────────────── */

type IterationTrace = { readonly V: number[][]; readonly residuals: number[] };

/** V^π для равномерной π (те же значения, что в § 5 heatmap). */
const policyEvaluationRandom = (gamma: number): IterationTrace => {
  const V: number[][] = Array.from({ length: ROWS }, () => Array<number>(COLS).fill(0));
  const residuals: number[] = [];
  const MAX_ITER = 200;
  const TOL = 1e-8;

  for (let it = 0; it < MAX_ITER; it++) {
    let delta = 0;
    const next: number[][] = V.map((row) => row.slice());
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const s: Cell = { row: r, col: c };
        if (isTerminal(s)) { next[r][c] = 0; continue; }
        let v = 0;
        for (let a = 0; a < 4; a++) {
          for (const { p, to } of nextStates(s, a)) {
            const vNext = isTerminal(to) ? 0 : V[to.row][to.col];
            v += 0.25 * p * (rewardOf(to) + gamma * vNext);
          }
        }
        next[r][c] = v;
        delta = Math.max(delta, Math.abs(v - V[r][c]));
      }
    }
    residuals.push(delta);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) V[r][c] = next[r][c];
    if (delta < TOL) break;
  }
  return { V, residuals };
};

/** V* через Bellman-optimality: V ← max_a Σ P(s'|s,a) (R(s') + γ V(s')). */
const valueIteration = (gamma: number): IterationTrace => {
  const V: number[][] = Array.from({ length: ROWS }, () => Array<number>(COLS).fill(0));
  const residuals: number[] = [];
  const MAX_ITER = 200;
  const TOL = 1e-8;

  for (let it = 0; it < MAX_ITER; it++) {
    let delta = 0;
    const next: number[][] = V.map((row) => row.slice());
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const s: Cell = { row: r, col: c };
        if (isTerminal(s)) { next[r][c] = 0; continue; }
        let best = -Infinity;
        for (let a = 0; a < 4; a++) {
          let q = 0;
          for (const { p, to } of nextStates(s, a)) {
            const vNext = isTerminal(to) ? 0 : V[to.row][to.col];
            q += p * (rewardOf(to) + gamma * vNext);
          }
          if (q > best) best = q;
        }
        next[r][c] = best;
        delta = Math.max(delta, Math.abs(best - V[r][c]));
      }
    }
    residuals.push(delta);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) V[r][c] = next[r][c];
    if (delta < TOL) break;
  }
  return { V, residuals };
};

/* ─────────────── Color helpers ─────────────── */

const parseHex = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
};
const [C_COLD_R, C_COLD_G, C_COLD_B] = parseHex(COLD);
const [C_HOT_R, C_HOT_G, C_HOT_B] = parseHex(HOT);
const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
const heatRgb = (t: number): [number, number, number] => [
  lerp(C_COLD_R, C_HOT_R, t),
  lerp(C_COLD_G, C_HOT_G, t),
  lerp(C_COLD_B, C_HOT_B, t),
];

/* ─────────────── Small heatmap (shared color scale) ─────────────── */

type MiniHeatmapProps = {
  readonly V: number[][];
  readonly vMin: number;
  readonly vMax: number;
  readonly cellSize?: number;
  readonly title: string;
  readonly subtitle: string;
  readonly accent: string;
};

const MiniHeatmap: React.FC<MiniHeatmapProps> = ({
  V,
  vMin,
  vMax,
  cellSize = 64,
  title,
  subtitle,
  accent,
}) => {
  const range = vMax - vMin || 1;
  const span = 3 * cellSize + 2 * 6;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: HEADING_FONT,
            fontSize: 13,
            color: accent,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: MONO_FONT,
            fontSize: 11,
            color: "rgba(255,255,255,0.6)",
            marginTop: 2,
          }}
        >
          {subtitle}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(3, ${cellSize}px)`,
          gridTemplateRows: `repeat(3, ${cellSize}px)`,
          gap: 6,
          width: span,
        }}
      >
        {V.map((row, r) =>
          row.map((v, c) => {
            const t = (v - vMin) / range;
            const [rr, gg, bb] = heatRgb(t);
            const fill = `rgba(${rr}, ${gg}, ${bb}, 0.22)`;
            const border = `rgba(${rr}, ${gg}, ${bb}, 0.85)`;
            const glow = `0 0 10px rgba(${rr}, ${gg}, ${bb}, 0.28)`;
            const s: Cell = { row: r, col: c };
            const corner = isBattery(s) ? "🔋" : isPuddle(s) ? "💧" : "";
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  position: "relative",
                  background: fill,
                  border: `1px solid ${border}`,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: glow,
                  transition:
                    "background 0.18s ease-out, border-color 0.18s ease-out, box-shadow 0.18s ease-out",
                }}
              >
                {corner && (
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: 3,
                      left: 5,
                      fontSize: 12,
                      opacity: 0.9,
                    }}
                  >
                    {corner}
                  </span>
                )}
                <span
                  style={{
                    fontFamily: MONO_FONT,
                    fontSize: 13,
                    color: "rgba(255,255,255,0.95)",
                    letterSpacing: "0.02em",
                    textShadow: "0 0 6px rgba(0,0,0,0.6)",
                  }}
                >
                  {v.toFixed(2)}
                </span>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
};

/* ─────────────── Shared-legend bar ─────────────── */

const GradientLegend: React.FC<{ vMin: number; vMax: number; width?: number }> = ({
  vMin,
  vMax,
  width = 280,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      width,
      fontFamily: MONO_FONT,
      fontSize: 11,
      color: "rgba(255,255,255,0.75)",
    }}
  >
    <span>{vMin.toFixed(2)}</span>
    <div
      aria-hidden
      style={{
        flex: 1,
        height: 8,
        borderRadius: 999,
        background: `linear-gradient(90deg, ${COLD} 0%, ${HOT} 100%)`,
        border: `1px solid ${SOFT_BORDER}`,
      }}
    />
    <span>{vMax.toFixed(2)}</span>
  </div>
);

/* ─────────────── Convergence chart ─────────────── */

type ConvergencePoint = { k: number; residual: number };

const ConvergenceChart: React.FC<{ data: ConvergencePoint[] }> = ({ data }) => {
  // Для лог-масштаба убираем нули (последний residual может быть ~0 при сходимости).
  const safe = data.map((p) => ({
    k: p.k,
    residual: Math.max(p.residual, 1e-12),
  }));

  return (
    <div
      style={{
        background: GLASS_BG,
        border: `1px solid ${SOFT_BORDER}`,
        borderRadius: 14,
        padding: 16,
        width: "100%",
      }}
    >
      <div
        style={{
          fontFamily: HEADING_FONT,
          fontSize: 13,
          color: CYAN,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        Сходимость Value Iteration
      </div>
      <div
        style={{
          fontFamily: MONO_FONT,
          fontSize: 11,
          color: "rgba(255,255,255,0.55)",
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        max |V<sub>k+1</sub> − V<sub>k</sub>| по итерациям (log-шкала)
      </div>

      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={safe} margin={{ top: 10, right: 20, bottom: 8, left: 0 }}>
            <CartesianGrid
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="k"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fontFamily: MONO_FONT, fontSize: 11, fill: "rgba(255,255,255,0.7)" }}
              label={{
                value: "итерация k",
                position: "insideBottom",
                offset: -2,
                style: {
                  fill: "rgba(255,255,255,0.55)",
                  fontFamily: MONO_FONT,
                  fontSize: 11,
                },
              }}
            />
            <YAxis
              scale="log"
              domain={["auto", "auto"]}
              allowDataOverflow
              stroke="rgba(255,255,255,0.5)"
              tick={{ fontFamily: MONO_FONT, fontSize: 10, fill: "rgba(255,255,255,0.7)" }}
              tickFormatter={(v: number) => v.toExponential(0)}
              width={60}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(8,11,20,0.95)",
                border: `1px solid ${CYAN}44`,
                borderRadius: 8,
                fontFamily: MONO_FONT,
                fontSize: 12,
              }}
              labelStyle={{ color: CYAN }}
              formatter={(v: number) => [v.toExponential(3), "residual"]}
              labelFormatter={(k: number) => `k = ${k}`}
            />
            <Line
              type="monotone"
              dataKey="residual"
              stroke={CYAN}
              strokeWidth={2}
              dot={{ r: 2.5, stroke: CYAN, fill: "rgba(0,255,214,0.18)" }}
              activeDot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ─────────────── Interactive block: chart + side-by-side heatmaps ─────────────── */

const VIExperiment = () => {
  const [gamma, setGamma] = useState<number>(0.95);

  const viTrace = useMemo(() => valueIteration(gamma), [gamma]);
  const mcTrace = useMemo(() => policyEvaluationRandom(gamma), [gamma]);

  const chartData = useMemo<ConvergencePoint[]>(
    () => viTrace.residuals.map((r, k) => ({ k: k + 1, residual: r })),
    [viTrace],
  );

  // единая цветовая шкала по объединённым значениям двух карт
  const allVals = [...viTrace.V.flat(), ...mcTrace.V.flat()];
  const vMin = Math.min(...allVals);
  const vMax = Math.max(...allVals);

  return (
    <div
      style={{
        background: GLASS_BG,
        border: `1px solid ${SOFT_BORDER}`,
        borderRadius: 14,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* gamma slider */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 8,
            fontFamily: MONO_FONT,
            fontSize: 12,
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.75)" }}>
            γ — коэффициент дисконта (применяется к обоим экспериментам)
          </span>
          <span style={{ color: CYAN, fontSize: 14 }}>{gamma.toFixed(2)}</span>
        </div>
        <Slider
          min={0}
          max={0.99}
          step={0.01}
          value={[gamma]}
          onValueChange={(v) => setGamma(v[0] ?? 0.95)}
          aria-label="Значение γ"
        />
      </div>

      {/* convergence */}
      <ConvergenceChart data={chartData} />

      <p
        style={{
          fontFamily: MONO_FONT,
          fontSize: 12,
          color: "rgba(255,255,255,0.6)",
          textAlign: "center",
          margin: 0,
        }}
      >
        Сошлось за{" "}
        <span style={{ color: CYAN }}>{viTrace.residuals.length}</span>{" "}
        итераций до |Δ| &lt; 10<sup>−8</sup>. Для бόльших γ — медленнее, для малых —
        почти мгновенно.
      </p>

      {/* side-by-side heatmaps */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 32,
        }}
      >
        <MiniHeatmap
          V={mcTrace.V}
          vMin={vMin}
          vMax={vMax}
          title="V^π, случайная политика"
          subtitle="policy evaluation (§ 5, Монте-Карло)"
          accent={MAGENTA}
        />
        <MiniHeatmap
          V={viTrace.V}
          vMin={vMin}
          vMax={vMax}
          title="V*, оптимальная политика"
          subtitle="value iteration (§ 7)"
          accent={CYAN}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <GradientLegend vMin={vMin} vMax={vMax} width={340} />
      </div>

      <p
        style={{
          fontFamily: MONO_FONT,
          fontSize: 12,
          color: "rgba(255,255,255,0.6)",
          textAlign: "center",
          margin: 0,
        }}
      >
        Слева — бот действует наугад и проигрывает рядом с лужей. Справа — тот
        же мир, но теперь в каждой клетке выбирается <em>лучшее</em> действие:
        почти везде V &gt; 0, и карта ярко светится cyan по пути к батарее.
      </p>
    </div>
  );
};

/* ─────────────── Вспомогательные атомы ─────────────── */

const FormulaBlock: React.FC<{
  tex: string;
  big?: boolean;
  accent?: string;
  emphasized?: boolean;
}> = ({ tex, big = false, accent = CYAN, emphasized = false }) => (
  <div
    style={{
      background: emphasized ? "rgba(0,255,214,0.04)" : GLASS_BG,
      border: emphasized ? `1px solid ${CYAN}` : `1px solid ${SOFT_BORDER}`,
      borderRadius: 12,
      padding: big ? "20px 20px" : "12px 18px",
      textAlign: "center",
      color: "rgba(255,255,255,0.96)",
      boxShadow: emphasized
        ? `0 0 22px rgba(0,255,214,0.18)`
        : `0 0 24px rgba(0,255,214,0.05)`,
      borderLeft: emphasized ? `1px solid ${CYAN}` : `3px solid ${accent}`,
      fontSize: big ? 18 : 15,
    }}
  >
    <MathFormula display className="!my-0 !bg-transparent !border-0 !p-0">
      {tex}
    </MathFormula>
  </div>
);

const StepBadge: React.FC<{ n: number; children: React.ReactNode; color: string }> = ({
  n,
  children,
  color,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      fontFamily: HEADING_FONT,
      fontSize: 13,
      letterSpacing: "0.08em",
      color,
      textTransform: "uppercase",
    }}
  >
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 26,
        height: 26,
        borderRadius: 999,
        border: `1px solid ${color}55`,
        background: `${color}14`,
        fontFamily: MONO_FONT,
        fontSize: 12,
        color,
      }}
    >
      {n}
    </span>
    <span>{children}</span>
  </div>
);

/* ─────────────── Section ─────────────── */

const Section_ValueIteration = () => {
  return (
    <section
      id="l15-value-iteration"
      aria-label="Lesson 1.5 — § 7. Value Iteration"
      className="py-6"
      style={BODY_STYLE}
    >
      <h2
        id="пример-вывода-уравнения-оптимальности"
        className="text-2xl font-bold tracking-wide scroll-mt-24"
        style={{ fontFamily: HEADING_FONT, color: CYAN }}
      >
        § 7. Алгоритм: как найти V* итерациями
      </h2>
      <p
        className="text-sm italic mt-1"
        style={{ color: "rgba(255,255,255,0.6)" }}
      >
        «Теорию мы уже доказали — осталось её крутить в цикле и ждать, пока
        значения перестанут меняться»
      </p>

      <div className="mt-6 flex flex-col gap-7">
        {/* ─────── Идея ─────── */}
        <div className="flex flex-col gap-3">
          <p style={{ color: "rgba(255,255,255,0.9)" }}>
            Идея до неприличия простая: взять любое{" "}
            <span style={{ fontFamily: MONO_FONT, color: CYAN }}>V</span>{" "}
            (например, все нули) и на каждом шаге обновлять его правилом,
            полученным из Беллмана-оптимальности. Повторяем, пока правки не
            станут пренебрежимо малыми — это и будет{" "}
            <span style={{ fontFamily: MONO_FONT, color: CYAN }}>V*</span>.
          </p>

          <FormulaBlock
            big
            emphasized
            tex="\\enfOp{V}_{k+1}(\\enfVar{s}) \\;\\leftarrow\\; \\max_{a} \\sum_{s'} P(s' \\mid \\enfVar{s}, a)\\,\\bigl[\\, \\enfTgt{R}(s') + \\enfPar{\\gamma}\\, \\enfOp{V}_{k}(s') \\,\\bigr]"
          />
        </div>

        {/* ─────── Вывод формулы в 3 шага ─────── */}
        <div className="flex flex-col gap-4">
          <h3
            style={{
              fontFamily: HEADING_FONT,
              fontSize: 17,
              color: CYAN,
              letterSpacing: "0.04em",
            }}
          >
            7.1 · Откуда взялось обновление
          </h3>

          <div className="flex flex-col gap-2">
            <StepBadge n={1} color={AMBER}>
              Шаг 1 · Оптимальная V — это максимум по действиям
            </StepBadge>
            <p style={{ color: "rgba(255,255,255,0.85)" }}>
              По определению оптимальной политики: если из{" "}
              <span style={{ fontFamily: MONO_FONT }}>s</span> мы вольны выбрать
              любое{" "}
              <span style={{ fontFamily: MONO_FONT, color: MAGENTA }}>a</span>, то
              естественно брать то, после которого мы живём лучше всего:
            </p>
            <FormulaBlock tex="\\enfOp{V}^{*}(\\enfVar{s}) \\;=\\; \\max_{a} \\enfOp{Q}^{*}(\\enfVar{s}, \\enfFun{a})" />
          </div>

          <div className="flex flex-col gap-2">
            <StepBadge n={2} color={AMBER}>
              Шаг 2 · Q* — это ровно тот one-step lookahead из § 6
            </StepBadge>
            <p style={{ color: "rgba(255,255,255,0.85)" }}>
              Формула Q через следующее состояние ничем не отличается от{" "}
              <span style={{ fontFamily: MONO_FONT }}>Q_from_V</span> из § 6 —
              только под V теперь понимается{" "}
              <span style={{ fontFamily: MONO_FONT, color: CYAN }}>V*</span>:
            </p>
            <FormulaBlock tex="\\enfOp{Q}^{*}(\\enfVar{s}, a) \\;=\\; \\sum_{s'} P(s' \\mid \\enfVar{s}, a)\\,\\bigl[\\, \\enfTgt{R}(s') + \\enfPar{\\gamma}\\, \\enfOp{V}^{*}(s') \\,\\bigr]" />
          </div>

          <div className="flex flex-col gap-2">
            <StepBadge n={3} color={AMBER}>
              Шаг 3 · Подставляем Q* внутрь max и получаем правило итерации
            </StepBadge>
            <p style={{ color: "rgba(255,255,255,0.85)" }}>
              Подстановка второй формулы в первую — и справа больше не осталось{" "}
              <span style={{ fontFamily: MONO_FONT }}>Q</span>: только{" "}
              <span style={{ fontFamily: MONO_FONT, color: CYAN }}>V</span> справа
              и слева. Это даёт уравнение с неподвижной точкой — его и крутим в
              цикле (обновление выше).
            </p>
          </div>
        </div>

        {/* ─────── NumPy implementation ─────── */}
        <div className="flex flex-col gap-3">
          <h3
            style={{
              fontFamily: HEADING_FONT,
              fontSize: 17,
              color: CYAN,
              letterSpacing: "0.04em",
            }}
          >
            7.2 · Реализация 1: словари и один переиспользованный lookahead
          </h3>
          <p style={{ color: "rgba(255,255,255,0.85)" }}>
            Ни одного нового цикла писать не нужно: «заглянуть на шаг вперёд» мы
            уже умеем — это{" "}
            <span style={{ fontFamily: MONO_FONT, color: CYAN }}>Q_from_V</span>{" "}
            из § 6. Value Iteration добавляет к нему ровно одну операцию —{" "}
            <span style={{ fontFamily: MONO_FONT, color: CYAN }}>max</span> по
            действиям. Сходится на RoomBot за десятки итераций:
          </p>
          <CyberCodeBlock language="python">{NUMPY_VI_CODE}</CyberCodeBlock>
        </div>

        {/* ─────── PyTorch implementation ─────── */}
        <div className="flex flex-col gap-3">
          <h3
            style={{
              fontFamily: HEADING_FONT,
              fontSize: 17,
              color: MAGENTA,
              letterSpacing: "0.04em",
            }}
          >
            7.3 · Реализация 2: ровно то же в PyTorch
          </h3>
          <p style={{ color: "rgba(255,255,255,0.85)" }}>
            Переход на тензоры — это <em>не</em> другое решение, это та же
            математика, переписанная так, чтобы один{" "}
            <span style={{ fontFamily: MONO_FONT, color: MAGENTA }}>@</span>{" "}
            делал работу всего внутреннего тройного цикла. Таблицу переходов{" "}
            <span style={{ fontFamily: MONO_FONT }}>next_states()</span> из § 3
            один раз раскладываем в тензор{" "}
            <span style={{ fontFamily: MONO_FONT, color: MAGENTA }}>P[s, a, s′]</span>
            {" "}— после этого весь алгоритм умещается в три строки цикла.
          </p>
          <CyberCodeBlock language="python">{TORCH_VI_CODE}</CyberCodeBlock>

          <div
            style={{
              background: "rgba(217,70,239,0.05)",
              border: `1px solid rgba(217,70,239,0.3)`,
              borderLeft: `3px solid ${MAGENTA}`,
              borderRadius: 12,
              padding: "14px 18px",
              marginTop: 4,
            }}
          >
            <div
              style={{
                fontFamily: HEADING_FONT,
                fontSize: 12,
                color: MAGENTA,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Зачем было переписывать на torch
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "24px 1fr",
                rowGap: 6,
                columnGap: 12,
                alignItems: "baseline",
                color: "rgba(255,255,255,0.88)",
                fontSize: 13.5,
              }}
            >
              <span style={{ color: MAGENTA, fontFamily: MONO_FONT }}>(а)</span>
              <span>
                <strong>Батчинг по состояниям.</strong> Одно матричное
                умножение{" "}
                <span style={{ fontFamily: MONO_FONT, color: MAGENTA }}>P @ (R + γV)</span>{" "}
                обновляет все 9 значений одновременно — в реальных задачах
                состояний миллионы, и векторизация ускоряет в сотни раз.
              </span>

              <span style={{ color: MAGENTA, fontFamily: MONO_FONT }}>(б)</span>
              <span>
                <strong>Autograd появится бесплатно.</strong> Когда в уроке 1.6{" "}
                <span style={{ fontFamily: MONO_FONT, color: CYAN }}>V</span>{" "}
                превратится в нейросеть{" "}
                <span style={{ fontFamily: MONO_FONT, color: CYAN }}>Vθ(s)</span>,
                тот же граф операций умеет считать{" "}
                <span style={{ fontFamily: MONO_FONT }}>∂L/∂θ</span> без единой
                доп. строки.
              </span>

              <span style={{ color: MAGENTA, fontFamily: MONO_FONT }}>(в)</span>
              <span>
                <strong>Переезд на GPU — одна строка.</strong>{" "}
                <span style={{ fontFamily: MONO_FONT, color: MAGENTA }}>
                  P = P.to(&quot;cuda&quot;)
                </span>
                , и тот же цикл бежит на тысячах ядер. Для RoomBot это оверкилл,
                для DQN в уроке 1.6 — обязательное условие.
              </span>
            </div>
          </div>
        </div>

        {/* ─────── Convergence + side-by-side heatmaps ─────── */}
        <div className="flex flex-col gap-3">
          <h3
            style={{
              fontFamily: HEADING_FONT,
              fontSize: 17,
              color: CYAN,
              letterSpacing: "0.04em",
            }}
          >
            7.4 · Как это сходится и что получается
          </h3>
          <p style={{ color: "rgba(255,255,255,0.85)" }}>
            Ниже — интерактивный прогон Value Iteration прямо в браузере.
            Слева-график: как быстро тает{" "}
            <span style={{ fontFamily: MONO_FONT, color: CYAN }}>
              max |V<sub>k+1</sub> − V<sub>k</sub>|
            </span>{" "}
            по итерациям (log-шкала). Две тепловые карты сравнивают: что
            получается у случайного бота (§ 5) и что — у оптимального после
            VI. Обе карты отрисованы в <em>одной</em> цветовой шкале, так что
            разницу в магнитуде видно сразу.
          </p>

          <VIExperiment />
        </div>

        {/* ─────── Hub link ─────── */}
        <div>
          <HubLink
            to="/hub/math-rl"
            anchor="пример-mdp-с-двумя-состояниями"
            variant="pill"
          >
            Детальный вывод Value Iteration на MDP с двумя состояниями
          </HubLink>
        </div>
      </div>
    </section>
  );
};

export default Section_ValueIteration;
