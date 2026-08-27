import CyberCodeBlock from "@/components/CyberCodeBlock";
import Math from "@/components/Math";
import HubLink from "@/components/math-rl/HubLink";

const HEADING_FONT =
  "'Orbitron', 'Inter', ui-sans-serif, system-ui, sans-serif";
const MONO_FONT = "'JetBrains Mono', ui-monospace, monospace";
const GLASS_BG = "rgba(12,16,28,0.7)";
const SOFT_BORDER = "rgba(255,255,255,0.06)";
const CELL_BG = "rgba(255,255,255,0.03)";
const CELL_BORDER = "rgba(255,255,255,0.06)";
const CYAN = "#00FFD6";
const MAGENTA = "#D946EF";
const AMBER = "#F59E0B";

const BODY_STYLE: React.CSSProperties = { fontSize: 14, lineHeight: 1.7 };

/* ─────────────── Code snippets ─────────────── */

const RANDOM_CODE = `def policy_random(s: State, rng: np.random.Generator) -> Action:
    """Равномерная политика: каждое действие равновероятно."""
    return Action(int(rng.integers(4)))
`;

const FIXED_CODE = `# v2 — детерминированная политика «вправо пока можешь, потом вниз».
# Позже мы извлечём такую же, но уже из Q-функции (§ 7).
fixed_policy: dict[State, Action] = {
    State(r, c): (Action.RIGHT if c < 2 else Action.DOWN)
    for r in range(3)
    for c in range(3)
}

print(fixed_policy[State(0, 0)])   # Action.RIGHT
print(fixed_policy[State(0, 2)])   # Action.DOWN
`;

const SOFTMAX_CODE = `import numpy as np

def policy_softmax(q_row: np.ndarray, tau: float = 1.0) -> np.ndarray:
    """Распределение над действиями через softmax от Q-значений.

    q_row — вектор Q(s, ·) длины 4.
    tau   — «температура»: tau→0 жёстче (почти argmax), tau→∞ — равномерно.
    """
    z = q_row / tau
    e = np.exp(z - z.max())    # вычитаем max ради численной устойчивости
    return e / e.sum()

# Пока Q-значений нет, но механизм уже работает:
demo_q = np.array([0.2, -0.1, 0.0, 0.9])
print(policy_softmax(demo_q, tau=1.0).round(3))
`;

/* ─────────────── Baked trajectory (for v1 illustration) ─────────────── */

type Cell = readonly [number, number];

/**
 * Иллюстративная траектория случайного бота из (0,0) к батарее (2,2).
 * 10% slip даёт реалистичные петли; лужу (1,1) маршрут аккуратно обходит.
 */
const TRAJECTORY: readonly Cell[] = [
  [0, 0], // старт
  [0, 1],
  [0, 0], // slip: бот хотел вправо, но пол скользкий, его сдуло назад
  [1, 0],
  [2, 0],
  [2, 1],
  [2, 2], // батарея
];

/* ─────────────── Grid + SVG trajectory ─────────────── */

const CELL_SIZE = 58;
const GAP = 6;
const GRID_PAD = 8;
const GRID_SPAN = 3 * CELL_SIZE + 2 * GAP;
const SVG_SIZE = GRID_PAD * 2 + GRID_SPAN;

const cellCenter = (row: number, col: number): { x: number; y: number } => ({
  x: GRID_PAD + col * (CELL_SIZE + GAP) + CELL_SIZE / 2,
  y: GRID_PAD + row * (CELL_SIZE + GAP) + CELL_SIZE / 2,
});

interface EntitySpec {
  row: number;
  col: number;
  emoji: string;
  label: string;
  pulse?: boolean;
}

const ENTITIES: EntitySpec[] = [
  { row: 0, col: 0, emoji: "🤖", label: "RoomBot — стартовая клетка" },
  { row: 1, col: 1, emoji: "💧", label: "Лужа: -1 и конец эпизода" },
  { row: 2, col: 2, emoji: "🔋", label: "Батарея: +1 (цель)", pulse: true },
];

const TrajectoryGrid = () => {
  const pathD = TRAJECTORY.map(([r, c], i) => {
    const { x, y } = cellCenter(r, c);
    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");

  return (
    <svg
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      role="img"
      aria-label="Траектория случайного бота на сетке 3×3"
      style={{ width: "100%", maxWidth: SVG_SIZE, height: "auto", display: "block", margin: "0 auto" }}
    >
      <defs>
        <filter id="l15-path-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Cells */}
      {Array.from({ length: 3 }).flatMap((_, r) =>
        Array.from({ length: 3 }).map((_, c) => (
          <rect
            key={`cell-${r}-${c}`}
            x={GRID_PAD + c * (CELL_SIZE + GAP)}
            y={GRID_PAD + r * (CELL_SIZE + GAP)}
            width={CELL_SIZE}
            height={CELL_SIZE}
            rx={8}
            fill={CELL_BG}
            stroke={CELL_BORDER}
            strokeWidth={1}
          />
        ))
      )}

      {/* Entities */}
      {ENTITIES.map((e) => {
        const { x, y } = cellCenter(e.row, e.col);
        return (
          <text
            key={`ent-${e.row}-${e.col}`}
            x={x}
            y={y + 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={26}
            aria-label={e.label}
            style={
              e.pulse
                ? {
                    animation: "l15-trace-pulse 2s ease-in-out infinite",
                    transformOrigin: "center",
                  }
                : undefined
            }
          >
            {e.emoji}
          </text>
        );
      })}

      {/* Dots at each visited cell */}
      {TRAJECTORY.map(([r, c], i) => {
        const { x, y } = cellCenter(r, c);
        return (
          <circle
            key={`dot-${i}`}
            cx={x}
            cy={y}
            r={3}
            fill={CYAN}
            opacity={0.75}
            style={{ filter: `drop-shadow(0 0 4px ${CYAN}aa)` }}
          />
        );
      })}

      {/* Animated trajectory path */}
      <path
        d={pathD}
        fill="none"
        stroke={CYAN}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        className="l15-path-animated"
        filter="url(#l15-path-glow)"
      />
    </svg>
  );
};

/* ─────────────── SubHeading helper ─────────────── */

const SubHeading = ({
  id,
  kicker,
  kickerColor,
  children,
}: {
  id: string;
  kicker: string;
  kickerColor: string;
  children: React.ReactNode;
}) => (
  <h3
    id={id}
    className="text-lg md:text-xl font-semibold mt-7 mb-3"
    style={{ fontFamily: HEADING_FONT, color: "rgba(255,255,255,0.92)" }}
  >
    <span
      className="inline-block align-middle mr-2 px-2 py-0.5 rounded"
      style={{
        fontFamily: MONO_FONT,
        fontSize: 11,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: kickerColor,
        border: `1px solid ${kickerColor}55`,
        background: `${kickerColor}11`,
      }}
    >
      {kicker}
    </span>
    {children}
  </h3>
);

/* ─────────────── Section ─────────────── */

const Section_PolicyAndTrace = () => {
  return (
    <section
      id="l15-policy-and-trace"
      aria-labelledby="l15-policy-heading"
      className="py-6"
      style={{ background: "transparent" }}
    >
      <style>{`
        @keyframes l15-draw-path {
          from { stroke-dashoffset: 1; }
          to   { stroke-dashoffset: 0; }
        }
        .l15-path-animated {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: l15-draw-path 1.2s ease-out forwards;
        }
        @keyframes l15-trace-pulse {
          0%, 100% { opacity: 0.85; }
          50%      { opacity: 1; }
        }
      `}</style>

      <header className="mb-5">
        <h2
          id="l15-policy-heading"
          className="text-2xl md:text-3xl font-bold tracking-wide"
          style={{ fontFamily: HEADING_FONT, color: CYAN }}
        >
          § 4. Политика: как агент выбирает действие
        </h2>
        <p className="mt-2 italic text-muted-foreground" style={BODY_STYLE}>
          Проследим эволюцию политики от «что угодно» до «всё с вероятностями»
          на одном и том же RoomBot.
        </p>
      </header>

      {/* v1 — random */}
      <SubHeading id="l15-policy-v1" kicker="v1" kickerColor={MAGENTA}>
        Случайный бот
      </SubHeading>
      <div style={BODY_STYLE} className="space-y-3 text-foreground/90">
        <p>
          Самая примитивная политика — не смотреть на состояние вовсе и
          бросать «кубик» на четыре варианта. По-математически это{" "}
          <Math display={false}>{"\\pi(a \\mid \\enfVar{s}) = \\tfrac{1}{4}"}</Math>{" "}
          для любого состояния и любого из четырёх действий. Такой бот ничему
          не учится, зато с него удобно начать — это наш нулевой уровень, от
          которого будут отталкиваться все следующие.
        </p>
      </div>
      <div className="my-4">
        <CyberCodeBlock language="python" filename="policy_v1_random.py">
          {RANDOM_CODE}
        </CyberCodeBlock>
      </div>

      {/* v2 — deterministic */}
      <SubHeading id="l15-policy-v2" kicker="v2" kickerColor={AMBER}>
        Детерминированная политика
      </SubHeading>
      <div style={BODY_STYLE} className="space-y-3 text-foreground/90">
        <p>
          Следующий шаг — для каждого состояния выбрать ровно одно действие. В
          идеале это <Math display={false}>{"\\pi(\\enfVar{s}) = \\arg\\max_{a} \\enfOp{Q}(\\enfVar{s}, a)"}</Math>,
          где Q — будущая функция ценности. Мы её ещё не построили, поэтому
          пока зашьём политику руками: словарь «клетка → действие». К концу
          урока мы увидим, что именно такая табличка и получается из Value
          Iteration автоматически.
        </p>
      </div>
      <div className="my-4">
        <CyberCodeBlock language="python" filename="policy_v2_fixed.py">
          {FIXED_CODE}
        </CyberCodeBlock>
      </div>

      {/* v3 — softmax */}
      <SubHeading id="l15-policy-v3" kicker="v3" kickerColor={CYAN}>
        Стохастическая политика
      </SubHeading>
      <div style={BODY_STYLE} className="space-y-3 text-foreground/90">
        <p>
          Самый общий вариант — политика как распределение вероятностей по
          действиям. Для каждого состояния она отвечает не «делаю вот это»,
          а «вот шансы на каждое из действий»: {" "}
          <Math display={false}>{"\\pi(a \\mid \\enfVar{s}) \\in [0, 1], \\; \\sum_a \\pi(a \\mid \\enfVar{s}) = 1"}</Math>
          . Удобный способ получить такое распределение из любых «оценок
          привлекательности» действий — softmax с температурой{" "}
          <span style={{ fontFamily: MONO_FONT, color: CYAN }}>τ</span>: низкая
          температура превращает softmax почти в argmax, высокая — почти в
          равномерное распределение.
        </p>
      </div>
      <div className="my-4">
        <CyberCodeBlock language="python" filename="policy_v3_softmax.py">
          {SOFTMAX_CODE}
        </CyberCodeBlock>
      </div>

      {/* Trajectory simulation */}
      <SubHeading id="l15-policy-trace" kicker="trace" kickerColor={CYAN}>
        Один эпизод случайного бота
      </SubHeading>
      <div style={BODY_STYLE} className="space-y-3 text-foreground/90">
        <p>
          Чтобы увидеть, что даёт политика v1, запустим один эпизод: до
          тридцати шагов или до ближайшего терминального состояния — батареи
          или лужи. На каждом шаге сохраняем тройку{" "}
          <span style={{ fontFamily: MONO_FONT, color: "rgba(255,255,255,0.8)" }}>(s, a, r)</span>,
          пока эпизод не закончится. Ниже — одна из таких траекторий,
          нарисованная поверх нашей сетки. Цвет cyan — путь бота, кружки —
          посещённые клетки.
        </p>
      </div>
      <figure
        className="my-4 rounded-xl p-5"
        style={{
          background: GLASS_BG,
          border: `1px solid ${SOFT_BORDER}`,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        <TrajectoryGrid />
        <figcaption
          className="mt-4 text-center text-muted-foreground"
          style={{
            fontFamily: MONO_FONT,
            fontSize: 12,
            lineHeight: 1.6,
            letterSpacing: "0.04em",
          }}
        >
          episode · 6 шагов · финиш на батарее · один slip по дороге
        </figcaption>
      </figure>

      {/* Philosophy note */}
      <div
        className="mt-6 rounded-xl p-5"
        style={{
          background: GLASS_BG,
          border: `1px solid ${SOFT_BORDER}`,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          ...BODY_STYLE,
        }}
      >
        <p
          className="mb-2"
          style={{
            fontFamily: MONO_FONT,
            fontSize: 11,
            letterSpacing: "0.12em",
            color: MAGENTA,
            textTransform: "uppercase",
          }}
        >
          Почему это важно
        </p>
        <p className="text-foreground/85">
          Политика — это вся интеллектуальная часть агента. Всё остальное —
          бухгалтерия: как правильно посчитать ожидаемый возврат, как
          усреднить по переходам, как обновить таблицу значений. Учиться в
          конечном счёте мы будем именно политике — либо напрямую (Policy
          Gradient), либо через Q-функцию, из которой она извлекается одним{" "}
          <Math display={false}>{"\\arg\\max"}</Math>.
        </p>
      </div>

      {/* Hub link */}
      <div className="mt-5" style={BODY_STYLE}>
        <p className="text-foreground/85">
          Отдельный разговор — как балансировать «хочу уже выжимать максимум
          из выученной политики» и «хочу попробовать что-то новое». Это
          отдельная тема:{" "}
          <HubLink
            to="/hub/math-rl"
            anchor="жадная-стратегия"
            variant="inline"
          >
            ε-жадный компромисс между эксплуатацией и исследованием
          </HubLink>
          . Не повторяем её в уроке — идите за подробностями в хаб.
        </p>
      </div>
    </section>
  );
};

export default Section_PolicyAndTrace;
