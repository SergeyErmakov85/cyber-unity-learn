import { useMemo, useState } from "react";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import MathFormula from "@/components/Math";
import HubLink from "@/components/math-rl/HubLink";
import { Slider } from "@/components/ui/slider";

/* ─────────────── Design tokens (согласовано с § 5) ─────────────── */

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

/* ─────────────── Код для Q_from_V ─────────────── */

const Q_FROM_V_CODE = `# Если V^π уже оценён (§ 5), перейти к Q^π — один шаг «заглянуть вперёд».
# Формулу оформим в § 7 — это будет уравнение Беллмана для Q. Пока — просто код.
def Q_from_V(V, gamma=0.95):
    """Q(s, a) = Σ p · (r(s') + γ · V(s')) по всем переходам из § 3."""
    return {
        (s, a): sum(p * (reward(s2) + gamma * V[s2]) for p, s2 in next_states(s, a))
        for s in STATES
        for a in ACTIONS
    }
`;

/* ─────────────── World model RoomBot (тот же, что в § 5) ─────────────── */

const ROWS = 3;
const COLS = 3;
const SLIP = 0.1;

const DELTAS: ReadonlyArray<readonly [number, number]> = [
  [-1, 0], // UP    — 0
  [1, 0], //  DOWN  — 1
  [0, -1], // LEFT  — 2
  [0, 1], //  RIGHT — 3
];
const ACTION_LABEL = ["↑", "↓", "←", "→"] as const;

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

const policyEvaluation = (gamma: number): number[][] => {
  const V: number[][] = Array.from({ length: ROWS }, () => Array<number>(COLS).fill(0));
  const MAX_ITER = 800;
  const TOL = 1e-7;

  for (let it = 0; it < MAX_ITER; it++) {
    let delta = 0;
    const next: number[][] = V.map((row) => row.slice());

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const s: Cell = { row: r, col: c };
        if (isTerminal(s)) {
          next[r][c] = 0;
          continue;
        }
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

    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) V[r][c] = next[r][c];
    if (delta < TOL) break;
  }

  return V;
};

/** Q^π(s, a) через one-step lookahead: та же формула, что в Q_from_V, но в TS. */
const qFromV = (V: number[][], gamma: number): number[][][] => {
  // [row][col][action] = Q(s, a)
  const Q: number[][][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => Array<number>(4).fill(0)),
  );

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const s: Cell = { row: r, col: c };
      if (isTerminal(s)) continue; // оставляем нулями — недостижимо под действием
      for (let a = 0; a < 4; a++) {
        let q = 0;
        for (const { p, to } of nextStates(s, a)) {
          const vNext = isTerminal(to) ? 0 : V[to.row][to.col];
          q += p * (rewardOf(to) + gamma * vNext);
        }
        Q[r][c][a] = q;
      }
    }
  }
  return Q;
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

/* ─────────────── QCell — SVG 4 треугольника ─────────────── */

type QCellProps = {
  readonly size: number;
  readonly q: readonly number[]; // 4 значения: [UP, DOWN, LEFT, RIGHT]
  readonly normalize: (v: number) => number; // глобальная нормировка → [0,1]
  readonly terminalIcon?: string | null;
};

const QCell: React.FC<QCellProps> = ({ size: W, q, normalize, terminalIcon }) => {
  const H = W / 2;

  // Терминальная клетка: просто крупная иконка, без подделения на треугольники
  if (terminalIcon) {
    return (
      <div
        style={{
          width: W,
          height: W,
          borderRadius: 10,
          background: "rgba(255,255,255,0.03)",
          border: `1px dashed ${SOFT_BORDER}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 30,
        }}
        aria-hidden
      >
        {terminalIcon}
      </div>
    );
  }

  // 4 треугольника: каждый по одному действию
  const tri = [
    // UP:    (0,0) → (W,0) → (W/2,W/2)
    { points: `0,0 ${W},0 ${H},${H}`, label: { x: H, y: W / 6 + 4 } },
    // DOWN:  (0,W) → (W,W) → (W/2,W/2)
    { points: `0,${W} ${W},${W} ${H},${H}`, label: { x: H, y: (5 * W) / 6 + 4 } },
    // LEFT:  (0,0) → (0,W) → (W/2,W/2)
    { points: `0,0 0,${W} ${H},${H}`, label: { x: W / 6, y: H + 4 } },
    // RIGHT: (W,0) → (W,W) → (W/2,W/2)
    { points: `${W},0 ${W},${W} ${H},${H}`, label: { x: (5 * W) / 6, y: H + 4 } },
  ] as const;

  return (
    <svg
      width={W}
      height={W}
      viewBox={`0 0 ${W} ${W}`}
      style={{ display: "block", overflow: "visible" }}
    >
      {tri.map((t, i) => {
        const val = q[i] ?? 0;
        const norm = normalize(val);
        const [rr, gg, bb] = heatRgb(norm);
        return (
          <polygon
            key={`poly-${i}`}
            points={t.points}
            fill={`rgba(${rr}, ${gg}, ${bb}, 0.22)`}
            stroke={`rgba(${rr}, ${gg}, ${bb}, 0.85)`}
            strokeWidth={1}
            style={{ transition: "fill 0.18s ease-out, stroke 0.18s ease-out" }}
          />
        );
      })}
      {/* стрелки-подписи действия — у внешней кромки */}
      {tri.map((t, i) => {
        // позиция стрелки: ближе к внешней стороне треугольника
        const pos = [
          { x: H, y: 13 }, //           UP    — вверх
          { x: H, y: W - 5 }, //        DOWN  — вниз
          { x: 10, y: H + 4 }, //       LEFT  — слева
          { x: W - 10, y: H + 4 }, //   RIGHT — справа
        ][i];
        return (
          <text
            key={`arr-${i}`}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            fontFamily={MONO_FONT}
            fontSize={11}
            fill="rgba(255,255,255,0.55)"
          >
            {ACTION_LABEL[i]}
          </text>
        );
      })}
      {/* значения Q в центрах треугольников */}
      {tri.map((t, i) => (
        <text
          key={`q-${i}`}
          x={t.label.x}
          y={t.label.y}
          textAnchor="middle"
          fontFamily={MONO_FONT}
          fontSize={11}
          fill="rgba(255,255,255,0.95)"
          style={{ paintOrder: "stroke" }}
          stroke="rgba(0,0,0,0.55)"
          strokeWidth={2}
        >
          {q[i].toFixed(2)}
        </text>
      ))}
    </svg>
  );
};

/* ─────────────── Интерактивный Q-heatmap ─────────────── */

const CELL_SIZE = 104;
const GAP = 6;
const GRID_SPAN = 3 * CELL_SIZE + 2 * GAP;

const QHeatmap = () => {
  const [gamma, setGamma] = useState<number>(0.95);
  const V = useMemo(() => policyEvaluation(gamma), [gamma]);
  const Q = useMemo(() => qFromV(V, gamma), [V, gamma]);

  // глобальная нормировка по всем Q(s,a) нетерминальных состояний
  const flat: number[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (isTerminal({ row: r, col: c })) continue;
      for (let a = 0; a < 4; a++) flat.push(Q[r][c][a]);
    }
  }
  const qMin = Math.min(...flat);
  const qMax = Math.max(...flat);
  const range = qMax - qMin || 1;
  const normalize = (v: number) => (v - qMin) / range;

  return (
    <div
      style={{
        background: GLASS_BG,
        border: `1px solid ${SOFT_BORDER}`,
        borderRadius: 14,
        padding: 20,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          role="img"
          aria-label="Q(s,a) на сетке RoomBot 3×3: 4 треугольника на клетку"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(3, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(3, ${CELL_SIZE}px)`,
            gap: GAP,
            width: GRID_SPAN,
          }}
        >
          {Q.map((row, r) =>
            row.map((qs, c) => {
              const s: Cell = { row: r, col: c };
              const icon = isBattery(s) ? "🔋" : isPuddle(s) ? "💧" : null;
              return (
                <QCell
                  key={`${r}-${c}`}
                  size={CELL_SIZE}
                  q={qs}
                  normalize={normalize}
                  terminalIcon={icon}
                />
              );
            }),
          )}
        </div>

        {/* легенда + gamma */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: GRID_SPAN,
            fontFamily: MONO_FONT,
            fontSize: 11,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          <span>{qMin.toFixed(2)}</span>
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
          <span>{qMax.toFixed(2)}</span>
        </div>

        <div style={{ width: GRID_SPAN }}>
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
            <span style={{ color: "rgba(255,255,255,0.75)" }}><MathFormula display={false}>{String.raw`\enfPar{\gamma}`}</MathFormula> — коэффициент дисконта</span>
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

        <p
          style={{
            color: "rgba(255,255,255,0.55)",
            fontSize: 12,
            fontStyle: "italic",
            textAlign: "center",
            maxWidth: GRID_SPAN,
            margin: 0,
          }}
        >
          В каждой клетке — четыре «лепестка»: <span style={{ color: "#bbb" }}>↑ ↓ ← →</span>.
          Цвет и число показывают{" "}
          <MathFormula display={false}>{String.raw`\enfOp{Q}^{\pi}(\enfVar{s}, \enfFun{a})`}</MathFormula>{" "}
          для равномерной <MathFormula display={false}>{String.raw`\enfFun{\pi}`}</MathFormula>. Клетки{" "}
          <span aria-hidden>💧</span> и <span aria-hidden>🔋</span> — терминальные, действий из них нет.
        </p>
      </div>
    </div>
  );
};

/* ─────────────── Атомы оформления ─────────────── */

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

const Section_ValueQ = () => {
  return (
    <section
      id="l15-value-q"
      aria-label="Lesson 1.5 — § 6. Q(s,a) и связь с V"
      className="py-6"
      style={BODY_STYLE}
    >
      <h2
        className="text-2xl font-bold tracking-wide"
        style={{ fontFamily: HEADING_FONT, color: MAGENTA }}
      >
        § 6. А если уточнить — Q(s, a)
      </h2>
      <p
        className="text-sm italic mt-1"
        style={{ color: "rgba(255,255,255,0.6)" }}
      >
        «V говорит, насколько хорошо тут быть. Q — насколько хорошо отсюда
        пойти вон туда»
      </p>

      <div className="mt-6 flex flex-col gap-7">
        {/* ─────── Мотивация ─────── */}
        <div className="flex flex-col gap-3">
          <p style={{ color: "rgba(255,255,255,0.9)" }}>
            Функция{" "}
            <MathFormula display={false}>{String.raw`\enfOp{V}^{\pi}(\enfVar{s})`}</MathFormula>{" "}
            даёт одно число на состояние — среднюю «полезность клетки». Но бот
            действует конкретно: в одной и той же клетке ход{" "}
            <span style={{ fontFamily: MONO_FONT, color: MAGENTA }}>→</span>{" "}
            может вести к батарее, а{" "}
            <span style={{ fontFamily: MONO_FONT, color: MAGENTA }}>↓</span>{" "}
            — прямо в лужу. Нужна оценка с детализацией по действиям:
          </p>

          <FormulaBlock
            big
            accent={MAGENTA}
            tex="\enfOp{Q}^{\pi}(\enfVar{s}, \enfFun{a}) \;=\; \mathbb{E}_{\pi}\!\left[\, \enfOp{G}_t \,\middle|\, \enfVar{S}_t = \enfVar{s},\; \enfFun{A}_t = \enfFun{a} \,\right]"
          />

          <p style={{ color: "rgba(255,255,255,0.8)" }}>
            Разница с{" "}
            <MathFormula display={false}>{String.raw`\enfOp{V}`}</MathFormula> — всего
            в одном лишнем условии: мы фиксируем конкретное первое действие{" "}
            <MathFormula display={false}>{String.raw`\enfFun{a}`}</MathFormula>, а
            дальше — как обычно, по политике.
          </p>
        </div>

        {/* ─────── Вывод связи V ↔ Q ─────── */}
        <div className="flex flex-col gap-4">
          <h3
            style={{
              fontFamily: HEADING_FONT,
              fontSize: 17,
              color: CYAN,
              letterSpacing: "0.04em",
            }}
          >
            6.1 · Связь V ↔ Q
          </h3>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <StepBadge n={1} color={AMBER}>
                Шаг 1 · V — матожидание по всему будущему
              </StepBadge>
              <p style={{ color: "rgba(255,255,255,0.85)" }}>
                <MathFormula display={false}>{String.raw`\enfOp{V}^{\pi}(\enfVar{s})`}</MathFormula>{" "}
                — это среднее по всем возможным будущим, начинающимся с{" "}
                <MathFormula display={false}>{String.raw`\enfVar{s}`}</MathFormula>. Будущее
                содержит одно «развилочное» случайное событие — выбор первого
                действия{" "}
                <MathFormula display={false}>{String.raw`\enfFun{a}`}</MathFormula>.
                Значит среднее по будущему = среднее по{" "}
                <MathFormula display={false}>{String.raw`\enfFun{a}`}</MathFormula>,
                а уже внутри — среднее по всему остальному.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <StepBadge n={2} color={AMBER}>
                Шаг 2 · Вероятность выбрать a — это <MathFormula display={false}>{String.raw`\enfFun{\pi} (\enfFun{a} \mid \enfVar{s})`}</MathFormula>
              </StepBadge>
              <p style={{ color: "rgba(255,255,255,0.85)" }}>
                Матожидание по действию раскладывается в сумму «вероятность
                умножить на условное среднее». Вероятность выбрать{" "}
                <MathFormula display={false}>{String.raw`\enfFun{a}`}</MathFormula>{" "}
                в состоянии{" "}
                <MathFormula display={false}>{String.raw`\enfVar{s}`}</MathFormula> — это ровно{" "}
                <MathFormula display={false}>{String.raw`\enfFun{\pi}(\enfFun{a} \mid \enfVar{s})`}</MathFormula>,
                а условное среднее — это и есть{" "}
                <MathFormula display={false}>{String.raw`\enfOp{Q}^{\pi}(\enfVar{s}, \enfFun{a})`}</MathFormula>.
                Складываем:
              </p>
            </div>

            <FormulaBlock
              big
              emphasized
              tex="\enfOp{V}^{\pi}(\enfVar{s}) \;=\; \sum_{a} \enfFun{\pi}(\enfFun{a} \mid \enfVar{s})\, \enfOp{Q}^{\pi}(\enfVar{s}, \enfFun{a})"
            />

            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>
              Это <em>не теорема</em> — это буквально определение матожидания,
              расписанное через два условия вместо одного. Никакой магии,
              никаких индуктивных предположений. Чуть позже (§ 7) из той же
              конструкции вырастет рекурсия Беллмана.
            </p>
          </div>
        </div>

        {/* ─────── Heatmap Q ─────── */}
        <div className="flex flex-col gap-3">
          <h3
            style={{
              fontFamily: HEADING_FONT,
              fontSize: 17,
              color: CYAN,
              letterSpacing: "0.04em",
            }}
          >
            6.2 · Q на сетке RoomBot
          </h3>
          <p style={{ color: "rgba(255,255,255,0.85)" }}>
            Та же 3×3, что в § 5, но каждая клетка разбита на четыре треугольника
            по направлениям действия. Цвет треугольника — его{" "}
            <MathFormula display={false}>{String.raw`\enfOp{Q}^{\pi}(\enfVar{s}, \enfFun{a})`}</MathFormula>{" "}
            на общей шкале «холодно → горячо». Обратите внимание: на клетке{" "}
            <span style={{ fontFamily: MONO_FONT }}>(0, 1)</span> действие{" "}
            <span style={{ fontFamily: MONO_FONT, color: MAGENTA }}>↓</span> ведёт
            в лужу и его Q заметно ниже остальных, а на{" "}
            <span style={{ fontFamily: MONO_FONT }}>(2, 1)</span> действие{" "}
            <span style={{ fontFamily: MONO_FONT, color: MAGENTA }}>→</span> —
            самое «горячее», потому что ведёт к батарее.
          </p>

          <QHeatmap />
        </div>

        {/* ─────── Python one-step lookahead ─────── */}
        <div className="flex flex-col gap-3">
          <h3
            style={{
              fontFamily: HEADING_FONT,
              fontSize: 17,
              color: CYAN,
              letterSpacing: "0.04em",
            }}
          >
            6.3 · Q из V одним шагом вперёд
          </h3>
          <p style={{ color: "rgba(255,255,255,0.85)" }}>
            Если{" "}
            <MathFormula display={false}>{String.raw`\enfOp{V}^{\pi}`}</MathFormula>{" "}
            уже оценён (§ 5), то{" "}
            <MathFormula display={false}>{String.raw`\enfOp{Q}^{\pi}`}</MathFormula>{" "}
            получается буквально одним проходом: для каждой пары{" "}
            <MathFormula display={false}>{String.raw`(\enfVar{s}, \enfFun{a})`}</MathFormula> усредняем
            «мгновенную награду плюс <MathFormula display={false}>{String.raw`\enfPar{\gamma} \cdot \enfOp{V}`}</MathFormula>(следующего)» по переходам из § 3.
            Формулу за этим кодом выведем в § 7 — пока просто смотрим на код:
          </p>
          <CyberCodeBlock language="python">{Q_FROM_V_CODE}</CyberCodeBlock>
        </div>

        {/* ─────── Hub link ─────── */}
        <div>
          <HubLink
            to="/hub/math-rl"
            anchor="функции-ценности-value-functions"
            variant="pill"
          >
            Формальное определение и свойства V^<MathFormula display={false}>{String.raw`\enfFun{\pi}`}</MathFormula> и Q^<MathFormula display={false}>{String.raw`\enfFun{\pi}`}</MathFormula>
          </HubLink>
        </div>
      </div>
    </section>
  );
};

export default Section_ValueQ;
