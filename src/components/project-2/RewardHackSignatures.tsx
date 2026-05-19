/**
 * RewardHackSignatures — три карточки с характерными кривыми TensorBoard.
 * Используется в src/pages/CourseProject2.tsx, секция #reward-shaping,
 * после таблицы «3 классических reward hacks», перед финальной сноской.
 *
 * Каждая карточка: мини-SVG (Reward CYAN, Length MAGENTA, опц. ValueLoss MUTED),
 * тоггл Здоровое ↔ Hack, и подпись «Симптом → Контрмера».
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

const VB_W = 260;
const VB_H = 130;
const PAD = 18;
const PLOT_W = VB_W - PAD * 2;
const PLOT_H = VB_H - PAD * 2;
const N = 60;

const xOf = (i: number) => PAD + (i / (N - 1)) * PLOT_W;
const yOf = (v: number) => PAD + (1 - Math.max(0, Math.min(1, v))) * PLOT_H;

const buildPath = (vals: number[]) =>
  vals.map((v, i) => `${i === 0 ? "M" : "L"}${xOf(i).toFixed(1)},${yOf(v).toFixed(2)}`).join(" ");

const series = (fn: (t: number) => number) =>
  Array.from({ length: N }, (_, i) => fn(i / (N - 1)));

// --- Card 1: Circling around target ---
const C1_HEALTHY_R = series((t) => 0.05 + 0.9 * (1 - Math.exp(-3.5 * t)));
const C1_HEALTHY_L = series((t) => 0.95 - 0.7 * (1 - Math.exp(-3 * t)));
const C1_HACK_R = series((t) => 0.05 + 0.85 * (1 - Math.exp(-2.8 * t)));
const C1_HACK_L = series(() => 0.96); // flat at MaxStep

// --- Card 2: Hovering near target ---
const C2_HEALTHY_R = series((t) => 0.05 + 0.95 * (1 - Math.exp(-3 * t)));
const C2_HEALTHY_L = series((t) => 0.92 - 0.78 * (1 - Math.exp(-2.5 * t)));
const C2_HACK_R = series((t) => Math.min(0.7, 0.05 + 0.9 * (1 - Math.exp(-2.5 * t))));
const C2_HACK_L = series(() => 0.97);

// --- Card 3: Wall exploit ---
const C3_HEALTHY_R = series((t) => 0.05 + 0.9 * (1 - Math.exp(-3 * t)));
const C3_HEALTHY_L = series((t) => 0.9 - 0.7 * (1 - Math.exp(-2.5 * t)));
const C3_HEALTHY_V = series((t) => 0.8 * Math.exp(-3 * t) + 0.05);
const C3_HACK_R = series((t) => 0.05 + 0.55 * t + 0.05 * Math.sin(t * 12));
const C3_HACK_L = series((t) => 0.7 + 0.15 * Math.sin(t * 8));
// Sawtooth value loss spikes
const C3_HACK_V = series((t) => {
  const base = 0.35;
  const spike = Math.pow(Math.abs(Math.sin(t * 14)), 8);
  return Math.min(0.95, base + 0.6 * spike);
});

type CardData = {
  title: string;
  symptom: string;
  counter: string;
  healthy: { r: number[]; l: number[]; v?: number[] };
  hack: { r: number[]; l: number[]; v?: number[] };
};

const CARDS: CardData[] = [
  {
    title: "Кружение у цели",
    symptom: "Reward растёт, но Episode Length упёрта в MaxStep — агент не закрывает эпизод.",
    counter: "PBRS-shaping вместо −d(s) + terminal +1.0 за поимку.",
    healthy: { r: C1_HEALTHY_R, l: C1_HEALTHY_L },
    hack: { r: C1_HACK_R, l: C1_HACK_L },
  },
  {
    title: "Зависание у цели",
    symptom: "Reward плато ≈ +0.7, Length у MaxStep, catches/ep ≈ 0 — стоит и копит плюс.",
    counter: "Time penalty −1/MaxStep на каждом шаге + бонус только в момент catch.",
    healthy: { r: C2_HEALTHY_R, l: C2_HEALTHY_L },
    hack: { r: C2_HACK_R, l: C2_HACK_L },
  },
  {
    title: "Эксплойт стен",
    symptom: "Value Loss с пилообразными всплесками — критик не успевает за «трюками».",
    counter: "Collision penalty −0.05 за касание + ray-нормировка в [−1, 1].",
    healthy: { r: C3_HEALTHY_R, l: C3_HEALTHY_L, v: C3_HEALTHY_V },
    hack: { r: C3_HACK_R, l: C3_HACK_L, v: C3_HACK_V },
  },
];

const MiniChart = ({
  r,
  l,
  v,
  hack,
}: {
  r: number[];
  l: number[];
  v?: number[];
  hack: boolean;
}) => (
  <svg viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ width: "100%", height: "auto", display: "block" }}>
    {/* Frame */}
    <rect
      x={PAD}
      y={PAD}
      width={PLOT_W}
      height={PLOT_H}
      fill="none"
      stroke={MUTED}
      strokeOpacity={0.4}
      strokeWidth={0.5}
    />
    {/* Grid */}
    {[0.25, 0.5, 0.75].map((g) => (
      <line
        key={g}
        x1={PAD}
        y1={yOf(g)}
        x2={PAD + PLOT_W}
        y2={yOf(g)}
        stroke={MUTED}
        strokeOpacity={0.15}
        strokeDasharray="2 3"
      />
    ))}
    {/* MaxStep line for hack on cards 1/2 */}
    {hack && (
      <line
        x1={PAD}
        y1={yOf(0.96)}
        x2={PAD + PLOT_W}
        y2={yOf(0.96)}
        stroke={MAGENTA}
        strokeOpacity={0.25}
        strokeDasharray="3 3"
      />
    )}
    {v && (
      <path d={buildPath(v)} fill="none" stroke={MUTED} strokeWidth={1.2} strokeOpacity={0.85} />
    )}
    <path d={buildPath(l)} fill="none" stroke={MAGENTA} strokeWidth={1.6} />
    <path d={buildPath(r)} fill="none" stroke={CYAN} strokeWidth={1.8} />
    {/* Axis labels */}
    <text x={PAD} y={PAD - 6} fontFamily={MONO} fontSize={9} fill={DIM}>
      1.0
    </text>
    <text x={PAD} y={PAD + PLOT_H + 11} fontFamily={MONO} fontSize={9} fill={DIM}>
      steps →
    </text>
  </svg>
);

const Card = ({ data }: { data: CardData }) => {
  const [hack, setHack] = useState(false);
  const cur = hack ? data.hack : data.healthy;

  return (
    <div
      style={{
        border: `1px solid ${BORDER}`,
        background: SURFACE,
        borderRadius: 8,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 13, letterSpacing: "0.03em" }}>
          {data.title}
        </div>
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
            onClick={() => setHack(false)}
            style={{
              fontFamily: MONO,
              fontSize: 10,
              padding: "3px 8px",
              background: !hack ? "rgba(0,255,214,0.15)" : "transparent",
              color: !hack ? CYAN : DIM,
              border: "none",
              cursor: "pointer",
            }}
          >
            Healthy
          </button>
          <button
            onClick={() => setHack(true)}
            style={{
              fontFamily: MONO,
              fontSize: 10,
              padding: "3px 8px",
              background: hack ? "rgba(217,70,239,0.18)" : "transparent",
              color: hack ? MAGENTA : DIM,
              border: "none",
              cursor: "pointer",
            }}
          >
            Hack
          </button>
        </div>
      </div>

      <MiniChart r={cur.r} l={cur.l} v={cur.v} hack={hack} />

      <div className="flex flex-wrap gap-x-3 gap-y-1" style={{ fontFamily: MONO, fontSize: 10, color: DIM }}>
        <span style={{ color: CYAN }}>■ Reward</span>
        <span style={{ color: MAGENTA }}>■ Length</span>
        {cur.v && <span style={{ color: MUTED }}>■ Value Loss</span>}
      </div>

      <div style={{ fontSize: 12, color: DIM, lineHeight: 1.55 }}>
        <div>
          <span style={{ color: MAGENTA, fontFamily: MONO, fontSize: 11 }}>симптом · </span>
          {data.symptom}
        </div>
        <div style={{ marginTop: 4 }}>
          <span style={{ color: CYAN, fontFamily: MONO, fontSize: 11 }}>контрмера · </span>
          {data.counter}
        </div>
      </div>
    </div>
  );
};

const RewardHackSignatures = () => {
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
        Сигнатуры reward hacking на графиках TensorBoard
      </h3>

      <div className="grid gap-3 md:grid-cols-3">
        {CARDS.map((c) => (
          <Card key={c.title} data={c} />
        ))}
      </div>
    </div>
  );
};

export default RewardHackSignatures;
