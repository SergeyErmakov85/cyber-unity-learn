import { useMemo, useState } from "react";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import MathFormula from "@/components/Math";
import HubLink from "@/components/math-rl/HubLink";
import { Slider } from "@/components/ui/slider";

/* ─────────────── Design tokens (те же, что в других секциях 1.5) ─────────────── */

const HEADING_FONT =
  "'Orbitron', 'Inter', ui-sans-serif, system-ui, sans-serif";
const MONO_FONT = "'JetBrains Mono', ui-monospace, monospace";
const GLASS_BG = "rgba(12,16,28,0.7)";
const SOFT_BORDER = "rgba(255,255,255,0.06)";
const CYAN = "#00FFD6";
const MAGENTA = "#D946EF";
const AMBER = "#F59E0B";
const COLD = "#F87171"; // низкое V — тёплый красный (как «опасно»)
const HOT = "#00FFD6"; //  высокое V — неоновый cyan

const BODY_STYLE: React.CSSProperties = { fontSize: 14, lineHeight: 1.7 };

/* ─────────────── Code snippets ─────────────── */

const ROLLOUT_CODE = `TERMINAL = {BATTERY, PUDDLE}   # из этих клеток эпизод уже не продолжается

def rollout(s, policy, rng, horizon=50):
    """Один эпизод: список троек (s, a, r) до терминала или до horizon шагов."""
    traj = []
    for _ in range(horizon):
        a = policy(s, rng)
        probs, outs = zip(*next_states(s, a))       # из § 3
        s_next = outs[rng.choice(4, p=probs)]
        traj.append((s, a, reward(s_next)))         # reward — из § 2.3
        if s_next in TERMINAL:
            break
        s = s_next
    return traj
`;

const MC_CODE = `from collections import defaultdict

def estimate_V(policy, n_episodes=5000, gamma=0.95, seed=0):
    """Монте-Карло оценка V^π: усредняем возвраты G_t по всем посещениям s."""
    rng = np.random.default_rng(seed)
    total, count = defaultdict(float), defaultdict(int)
    starts = [s for s in STATES if s not in TERMINAL]   # из терминала не стартуем

    for _ in range(n_episodes):
        s0 = starts[rng.integers(len(starts))]
        G = 0.0
        # идём по траектории с конца: один проход даёт G_t сразу для всех шагов
        for s, _a, r in reversed(rollout(s0, policy, rng)):
            G = r + gamma * G
            total[s] += G
            count[s] += 1

    return {s: total[s] / count[s] if count[s] else 0.0 for s in STATES}
`;

const EVAL_CODE = `def evaluate_policy(gamma=0.95, tol=1e-9):
    """Аналитическая оценка V^π для равномерной политики π(a|s)=1/4:
    крутим уравнение Беллмана, пока значения не перестанут меняться."""
    V = {s: 0.0 for s in STATES}
    while True:
        new = {
            s: 0.0 if s in TERMINAL else sum(
                0.25 * p * (reward(s2) + gamma * V[s2])
                for a in ACTIONS
                for p, s2 in next_states(s, a)
            )
            for s in STATES
        }
        delta = max(abs(new[s] - V[s]) for s in STATES)
        V = new
        if delta < tol:
            return V
`;

const PLOT_CODE = `import matplotlib.pyplot as plt

def plot_V(V, title="V^pi, равномерная политика", ax=None,
           vmin=None, vmax=None, fontsize=11):
    """Тепловая карта ценности состояний на сетке 3x3."""
    grid = np.array([[V[(r, c)] for c in range(GRID)] for r in range(GRID)])
    if ax is None:
        _, ax = plt.subplots(figsize=(4.2, 4.2))

    im = ax.imshow(grid, cmap="viridis", vmin=vmin, vmax=vmax)
    for (r, c), v in np.ndenumerate(grid):
        mark = {BATTERY: "батарея", PUDDLE: "лужа"}.get((r, c), "")
        ax.text(c, r, f"{mark}\\n{v:+.2f}", ha="center", va="center",
                color="white", fontsize=fontsize)

    ax.set_title(title)
    ax.set_xticks(range(GRID)); ax.set_yticks(range(GRID))
    ax.set_xlabel("столбец"); ax.set_ylabel("строка")
    return im

im = plot_V(evaluate_policy(gamma=0.95))
plt.colorbar(im, label="ценность состояния")
plt.show()
`;

/* ─────────────── World model for the interactive heatmap ─────────────── */
/*
 * Этот блок дублирует Python-модель RoomBot из § 2–3 в TypeScript,
 * чтобы heatmap пересчитывался в реальном времени при изменении γ.
 * Используется iterative policy evaluation (Bellman expectation) для
 * равномерной политики π(a|s)=1/4 — это даёт ту же V^π, что и MC-оценка,
 * но без случайного шума и мгновенно.
 */

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

/** Policy evaluation для равномерной политики π(a|s)=1/4. */
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
          next[r][c] = 0; // V на терминале = 0 по определению
          continue;
        }
        let v = 0;
        for (let a = 0; a < 4; a++) {
          const dist = nextStates(s, a);
          for (const { p, to } of dist) {
            const rNext = rewardOf(to);
            const vNext = isTerminal(to) ? 0 : V[to.row][to.col];
            v += 0.25 * p * (rNext + gamma * vNext); // π(a|s)=1/4
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

/* ─────────────── Color interpolation helpers ─────────────── */

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

/* ─────────────── Interactive V-heatmap ─────────────── */

const CELL_SIZE = 78;
const GAP = 6;
const GRID_SPAN = 3 * CELL_SIZE + 2 * GAP;

const VHeatmap = () => {
  const [gamma, setGamma] = useState<number>(0.95);
  const V = useMemo(() => policyEvaluation(gamma), [gamma]);

  const flat = V.flat();
  const vMin = Math.min(...flat);
  const vMax = Math.max(...flat);
  const range = vMax - vMin || 1;

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
        {/* Grid */}
        <div
          role="img"
          aria-label="Тепловая карта V^π на сетке RoomBot 3×3"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(3, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(3, ${CELL_SIZE}px)`,
            gap: GAP,
            width: GRID_SPAN,
          }}
        >
          {V.map((row, r) =>
            row.map((v, c) => {
              const t = (v - vMin) / range;
              const [rr, gg, bb] = heatRgb(t);
              const fill = `rgba(${rr}, ${gg}, ${bb}, 0.22)`;
              const border = `rgba(${rr}, ${gg}, ${bb}, 0.85)`;
              const glow = `0 0 14px rgba(${rr}, ${gg}, ${bb}, 0.35)`;
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
                        top: 4,
                        left: 6,
                        fontSize: 13,
                        opacity: 0.9,
                      }}
                    >
                      {corner}
                    </span>
                  )}
                  <span
                    style={{
                      fontFamily: MONO_FONT,
                      fontSize: 14,
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

        {/* Gradient legend */}
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

        {/* Gamma slider */}
        <div style={{ width: GRID_SPAN, marginTop: 4 }}>
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
            <span style={{ color: "rgba(255,255,255,0.75)" }}>γ — коэффициент дисконта</span>
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
              fontFamily: MONO_FONT,
              fontSize: 10,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <span>0.00 — живу одним мгновением</span>
            <span>0.99 — планирую далеко</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────── Small stylistic atoms ─────────────── */

/**
 * Обёртка для KaTeX-формул. Внутри — <MathFormula display/>, чей стандартный
 * `bg-card/80 border border-primary/20 p-4 my-4` гасится через `!` utilities,
 * чтобы внешний контейнер полностью управлял оформлением.
 */
const FormulaBlock: React.FC<{
  tex: string;
  big?: boolean;
  accent?: string;
}> = ({ tex, big = false, accent = CYAN }) => (
  <div
    style={{
      background: GLASS_BG,
      border: `1px solid ${SOFT_BORDER}`,
      borderRadius: 12,
      padding: big ? "20px 20px" : "12px 18px",
      textAlign: "center",
      color: "rgba(255,255,255,0.96)",
      boxShadow: `0 0 24px rgba(0,255,214,0.05)`,
      borderLeft: `3px solid ${accent}`,
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

const Section_ValueV = () => {
  return (
    <section
      id="l15-value-v"
      aria-label="Lesson 1.5 — § 5. От суммы наград к функции ценности"
      className="py-6"
      style={BODY_STYLE}
    >
      <h2
        className="text-2xl font-bold tracking-wide"
        style={{ fontFamily: HEADING_FONT, color: CYAN }}
      >
        § 5. От суммы наград к функции ценности
      </h2>
      <p
        className="text-sm italic mt-1"
        style={{ color: "rgba(255,255,255,0.6)" }}
      >
        «Награда — это то, что мир платит. Ценность — это то, во что бот
        оценивает своё положение»
      </p>

      <div className="mt-6 flex flex-col gap-7">
        {/* ─────── Step 1: сумма наград ─────── */}
        <div className="flex flex-col gap-3">
          <StepBadge n={1} color={AMBER}>Шаг 1 · Возврат G_t — что я реально получил</StepBadge>
          <p style={{ color: "rgba(255,255,255,0.9)" }}>
            Агент прожил эпизод и собрал цепочку наград{" "}
            <span style={{ fontFamily: MONO_FONT, color: AMBER }}>
              R<sub>t+1</sub>, R<sub>t+2</sub>, R<sub>t+3</sub>, …
            </span>{" "}
            Самая прямолинейная метрика успеха — просто сложить всё, что он
            получил с момента <span style={{ fontFamily: MONO_FONT }}>t</span> до конца:
          </p>

          <FormulaBlock
            accent={AMBER}
            tex="\\enfOp{G}_t \\;=\\; \\enfTgt{R}_{t+1} + \\enfTgt{R}_{t+2} + \\enfTgt{R}_{t+3} + \\ldots"
          />

          <p style={{ color: "rgba(255,255,255,0.8)" }}>
            Проблема всплывает мгновенно: если эпизод бесконечен, а награды
            ограничены снизу ненулевым числом, эта сумма уходит в бесконечность —
            сравнить два состояния становится невозможно.{" "}
            <HubLink
              to="/hub/math-rl"
              anchor="геометрический-ряд"
              variant="pill"
            >
              Почему бесконечная сумма расходится без дисконта
            </HubLink>
          </p>
        </div>

        {/* ─────── Step 2: дисконтирование ─────── */}
        <div className="flex flex-col gap-3">
          <StepBadge n={2} color={MAGENTA}>
            Шаг 2 · Дисконтирование γ — «ценим ближнее больше»
          </StepBadge>

          <p style={{ color: "rgba(255,255,255,0.9)" }}>
            Бросим в сумму демпфер. Идея бытовая: рубль сейчас приятнее рубля
            через десять лет. Формализуем это тремя подстановками:
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "24px 1fr",
              rowGap: 6,
              columnGap: 12,
              alignItems: "baseline",
              color: "rgba(255,255,255,0.85)",
              paddingLeft: 6,
            }}
          >
            <span style={{ color: MAGENTA, fontFamily: MONO_FONT, fontSize: 13 }}>1.</span>
            <span>
              Берём фиксированное{" "}
              <span style={{ fontFamily: MONO_FONT, color: MAGENTA }}>γ ∈ [0, 1)</span> — одно
              число на всю жизнь агента.
            </span>

            <span style={{ color: MAGENTA, fontFamily: MONO_FONT, fontSize: 13 }}>2.</span>
            <span>
              Каждый следующий шаг во времени умножает будущую награду ещё на
              один{" "}
              <span style={{ fontFamily: MONO_FONT, color: MAGENTA }}>γ</span>.
            </span>

            <span style={{ color: MAGENTA, fontFamily: MONO_FONT, fontSize: 13 }}>3.</span>
            <span>
              Получаем компактную запись через степенной ряд — сумма того же
              вида, что в школьном геометрическом ряду.
            </span>
          </div>

          <FormulaBlock
            big
            accent={MAGENTA}
            tex="\\enfOp{G}_t \\;=\\; \\enfTgt{R}_{t+1} + \\enfPar{\\gamma}\\, \\enfTgt{R}_{t+2} + \\enfPar{\\gamma}^2\\, \\enfTgt{R}_{t+3} + \\ldots \\;=\\; \\sum_{k=0}^{\\infty} \\enfPar{\\gamma}^{k}\\, \\enfTgt{R}_{t+k+1}"
          />

          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>
            При{" "}
            <span style={{ fontFamily: MONO_FONT, color: MAGENTA }}>γ &lt; 1</span> и ограниченных
            наградах эта сумма всегда конечна — сходимость следует из того же
            геометрического ряда, на который мы только что сослались в хабе.
          </p>
        </div>

        {/* ─────── Step 3: матожидание ─────── */}
        <div className="flex flex-col gap-3">
          <StepBadge n={3} color={CYAN}>
            Шаг 3 · Матожидание — переходим от «получил» к «получу в среднем»
          </StepBadge>

          <p style={{ color: "rgba(255,255,255,0.9)" }}>
            Величина{" "}
            <span style={{ fontFamily: MONO_FONT, color: CYAN }}>G_t</span>{" "}
            случайна: среда стохастична (10% slip из § 3), политика тоже бывает
            стохастичной. Говорить про «значение состояния» осмысленно только
            как про среднее по всем возможным исходам:
          </p>

          <FormulaBlock
            big
            accent={CYAN}
            tex="\\enfOp{V}^{\\pi}(\\enfVar{s}) \\;=\\; \\mathbb{E}_{\\pi}\\!\\left[\\, \\enfOp{G}_t \\,\\middle|\\, \\enfVar{S}_t = \\enfVar{s} \\,\\right]"
          />

          <p style={{ color: "rgba(255,255,255,0.85)" }}>
            Читается ровно одной строкой: «сколько бот в среднем заработает,
            стартуя из{" "}
            <span style={{ fontFamily: MONO_FONT, color: CYAN }}>s</span> и
            действуя по{" "}
            <span style={{ fontFamily: MONO_FONT, color: CYAN }}>π</span>».
            Никакой развёрнутой теории математического ожидания здесь не нужно —
            она уже лежит отдельным параграфом в хабе математики RL.
          </p>
        </div>

        {/* ─────── Step 4: Bellman expectation (teaser) ─────── */}
        <div className="flex flex-col gap-3">
          <StepBadge n={4} color={AMBER}>
            Шаг 4 · Раскрыть матожидание в рекурсию
          </StepBadge>
          <p style={{ color: "rgba(255,255,255,0.85)" }}>
            Следующий естественный ход — разложить это{" "}
            <span style={{ fontFamily: MONO_FONT, color: AMBER }}>𝔼</span>{" "}
            на сумму по одношаговым переходам и получить рекурсивную связь{" "}
            <span style={{ fontFamily: MONO_FONT }}>V<sup>π</sup>(s) ↔ V<sup>π</sup>(s')</span>.
            Это уравнение Беллмана; полноценно выведем его в следующем параграфе,
            а для дотошных — готовый разбор:
          </p>
          <div>
            <HubLink
              to="/hub/math-rl"
              anchor="уравнение-ожиданий-беллмана"
              variant="pill"
            >
              Полный вывод рекурсивной формулы V^π(s)
            </HubLink>
          </div>
        </div>

        {/* ─────── Step 5: Python (Monte-Carlo estimate) ─────── */}
        <div className="flex flex-col gap-3">
          <h3
            style={{
              fontFamily: HEADING_FONT,
              fontSize: 17,
              color: CYAN,
              letterSpacing: "0.04em",
            }}
          >
            5.1 · Как посчитать V на практике: прямой Монте-Карло
          </h3>
          <p style={{ color: "rgba(255,255,255,0.85)" }}>
            Пока мы не знаем никакой умной рекурсии — самый прямой способ
            оценить{" "}
            <span style={{ fontFamily: MONO_FONT, color: CYAN }}>V<sup>π</sup></span>{" "}
            такой: прогнать много эпизодов и для каждого посещённого состояния
            записать получившийся{" "}
            <span style={{ fontFamily: MONO_FONT }}>G_t</span>, а потом усреднить.
            Два честных куска кода:
          </p>

          <CyberCodeBlock language="python">{ROLLOUT_CODE}</CyberCodeBlock>

          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 13,
              fontStyle: "italic",
            }}
          >
            Дальше — сам estimator. Ключевой трюк: идём по траектории{" "}
            <span style={{ fontFamily: MONO_FONT, color: CYAN }}>reversed</span>,
            накапливая{" "}
            <span style={{ fontFamily: MONO_FONT, color: CYAN }}>
              G = r + γ·G
            </span>
            . За один проход получаем{" "}
            <span style={{ fontFamily: MONO_FONT }}>G_t</span> для всех шагов эпизода.
          </p>

          <CyberCodeBlock language="python">{MC_CODE}</CyberCodeBlock>
        </div>

        {/* ─────── Step 6: Interactive heatmap ─────── */}
        <div className="flex flex-col gap-3">
          <h3
            style={{
              fontFamily: HEADING_FONT,
              fontSize: 17,
              color: CYAN,
              letterSpacing: "0.04em",
            }}
          >
            5.2 · Тепловая карта V для случайной политики на RoomBot
          </h3>
          <p style={{ color: "rgba(255,255,255,0.85)" }}>
            Ниже — та же самая оценка, только посчитанная аналитически (iterative
            policy evaluation до сходимости, равномерная политика π(a|s)=1/4).
            Двигая ползунок{" "}
            <span style={{ fontFamily: MONO_FONT, color: CYAN }}>γ</span>, видно
            главное: чем больше γ, тем сильнее «подсвечиваются» клетки, откуда
            до батареи{" "}
            <span aria-hidden>🔋</span> можно дойти — лужа{" "}
            <span aria-hidden>💧</span> даёт отрицательный вклад почти при любом
            γ.
          </p>

          <VHeatmap />

          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 12,
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            Значения — ожидаемый дисконтированный возврат{" "}
            <span style={{ fontFamily: MONO_FONT }}>V<sup>π</sup>(s)</span> при
            равномерной π. Терминальные клетки (лужа и батарея) по соглашению
            имеют V=0 — из них уже ничего не происходит.
          </p>

          <p style={{ color: "rgba(255,255,255,0.85)" }}>
            Та же карта считается в Python двумя короткими функциями. Первая —
            сама оценка: вместо тысяч случайных эпизодов просто крутим уравнение
            Беллмана, пока значения не перестанут меняться.
          </p>

          <CyberCodeBlock language="python">{EVAL_CODE}</CyberCodeBlock>

          <p style={{ color: "rgba(255,255,255,0.85)" }}>
            Вторая рисует результат — это и есть тепловая карта выше, только
            средствами matplotlib. Мы вернёмся к{" "}
            <span style={{ fontFamily: MONO_FONT, color: CYAN }}>plot_V</span> в
            § 7, чтобы сравнить случайную политику с оптимальной на одной шкале.
          </p>

          <CyberCodeBlock language="python">{PLOT_CODE}</CyberCodeBlock>
        </div>
      </div>
    </section>
  );
};

export default Section_ValueV;
