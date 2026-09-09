import CyberCodeBlock from "@/components/CyberCodeBlock";

const HEADING_FONT =
  "'Orbitron', 'Inter', ui-sans-serif, system-ui, sans-serif";
const MONO_FONT = "'JetBrains Mono', ui-monospace, monospace";
const GLASS_BG = "rgba(12,16,28,0.7)";
const SOFT_BORDER = "rgba(255,255,255,0.06)";
const CYAN = "#00FFD6";
const MAGENTA = "#D946EF";
const AMBER = "#F59E0B";

const BODY_STYLE: React.CSSProperties = { fontSize: 14, lineHeight: 1.7 };

const STATE_CODE = `# Состояние RoomBot — это просто пара координат (строка, столбец).
GRID = 3
STATES = [(r, c) for r in range(GRID) for c in range(GRID)]

print(len(STATES))   # 9
print(STATES[0])     # (0, 0)
`;

const ACTION_CODE = `# Действие — индекс 0..3. Рядом храним сдвиг по сетке и подпись для вывода.
UP, DOWN, LEFT, RIGHT = 0, 1, 2, 3
ACTIONS = (UP, DOWN, LEFT, RIGHT)
MOVES = [(-1, 0), (+1, 0), (0, -1), (0, +1)]   # (Δстрока, Δстолбец)
NAMES = ["вверх", "вниз", "влево", "вправо"]

print(ACTIONS)                       # (0, 1, 2, 3)
print(NAMES[RIGHT], MOVES[RIGHT])    # вправо (0, 1)
`;

const REWARD_CODE = `BATTERY = (2, 2)   # зарядная станция: +1
PUDDLE  = (1, 1)   # лужа: -1

def reward(s):
    """Награда за то, что бот оказался в клетке s."""
    return {BATTERY: +1.0, PUDDLE: -1.0}.get(s, -0.02)

# Sanity-check:
print(reward(BATTERY))   #  1.0
print(reward(PUDDLE))    # -1.0
print(reward((0, 2)))    # -0.02
`;

interface TrajectoryNode {
  label: string;
  sub: string;
  color: string;
}

const TRAJECTORY: TrajectoryNode[] = [
  { label: "S₀", sub: "state", color: CYAN },
  { label: "A₀", sub: "action", color: MAGENTA },
  { label: "R₁", sub: "reward", color: AMBER },
  { label: "S₁", sub: "state", color: CYAN },
  { label: "A₁", sub: "action", color: MAGENTA },
  { label: "R₂", sub: "reward", color: AMBER },
  { label: "S₂", sub: "state", color: CYAN },
];

const TrajectoryDiagram = () => {
  const nodeRadius = 22;
  const spacing = 95;
  const paddingX = 40;
  const width = paddingX * 2 + spacing * (TRAJECTORY.length - 1);
  const height = 120;
  const centerY = 56;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Траектория: S₀ → A₀ → R₁ → S₁ → A₁ → R₂ → S₂"
      style={{ width: "100%", height: "auto", maxWidth: width }}
    >
      <defs>
        <marker
          id="l15-trajectory-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="rgba(255,255,255,0.55)" />
        </marker>
      </defs>

      {TRAJECTORY.slice(0, -1).map((_, i) => {
        const x1 = paddingX + i * spacing + nodeRadius + 2;
        const x2 = paddingX + (i + 1) * spacing - nodeRadius - 4;
        return (
          <line
            key={`arr-${i}`}
            x1={x1}
            y1={centerY}
            x2={x2}
            y2={centerY}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={1.5}
            markerEnd="url(#l15-trajectory-arrow)"
          />
        );
      })}

      {TRAJECTORY.map((node, i) => {
        const cx = paddingX + i * spacing;
        return (
          <g key={`node-${i}`}>
            <circle
              cx={cx}
              cy={centerY}
              r={nodeRadius}
              fill="rgba(12,16,28,0.85)"
              stroke={node.color}
              strokeWidth={1.75}
              style={{
                filter: `drop-shadow(0 0 6px ${node.color}55)`,
              }}
            />
            <text
              x={cx}
              y={centerY + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={node.color}
              style={{
                fontFamily: MONO_FONT,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {node.label}
            </text>
            <text
              x={cx}
              y={centerY + nodeRadius + 16}
              textAnchor="middle"
              fill="rgba(255,255,255,0.55)"
              style={{
                fontFamily: MONO_FONT,
                fontSize: 10,
                letterSpacing: "0.08em",
              }}
            >
              {node.sub}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <span
    className="inline-flex items-center gap-1.5"
    style={{ fontFamily: MONO_FONT, fontSize: 11, letterSpacing: "0.04em" }}
  >
    <span
      aria-hidden
      style={{
        width: 9,
        height: 9,
        borderRadius: 999,
        background: color,
        boxShadow: `0 0 6px ${color}88`,
        display: "inline-block",
      }}
    />
    <span style={{ color: "rgba(255,255,255,0.7)" }}>{label}</span>
  </span>
);

const SubHeading = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h3
    id={id}
    className="text-lg md:text-xl font-semibold mt-8 mb-3"
    style={{ fontFamily: HEADING_FONT, color: "rgba(255,255,255,0.92)" }}
  >
    {children}
  </h3>
);

const Section_WorldAndState = () => {
  return (
    <section
      id="l15-world-and-state"
      aria-labelledby="l15-world-heading"
      className="py-6"
      style={{ background: "transparent" }}
    >
      <header className="mb-5">
        <h2
          id="l15-world-heading"
          className="text-2xl md:text-3xl font-bold tracking-wide"
          style={{ fontFamily: HEADING_FONT, color: CYAN }}
        >
          § 2. Три сущности: состояние, действие, награда
        </h2>
        <p className="mt-2 italic text-muted-foreground" style={BODY_STYLE}>
          Вводим каждый объект ровно тогда, когда он впервые нужен — и сразу
          показываем его в Python, без абстрактной теории.
        </p>
      </header>

      {/* 2.1 State */}
      <SubHeading id="l15-state">2.1 Состояние S</SubHeading>
      <div style={BODY_STYLE} className="space-y-3 text-foreground/90">
        <p>
          Состояние — это всё, что бот должен знать о мире прямо сейчас, чтобы
          принять решение. Для RoomBot достаточно двух чисел: в какой строке и
          в каком столбце он стоит. Значит, множество всех возможных состояний
          — это девять пар координат, по одной на каждую клетку комнаты.
        </p>
      </div>
      <div className="my-4">
        <CyberCodeBlock language="python" filename="state.py">
          {STATE_CODE}
        </CyberCodeBlock>
      </div>
      <div
        className="rounded-lg p-4"
        style={{
          background: GLASS_BG,
          border: `1px solid ${SOFT_BORDER}`,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          ...BODY_STYLE,
        }}
      >
        <p className="text-foreground/80">
          Никакого класса заводить не нужно:{" "}
          <code style={{ fontFamily: MONO_FONT, color: CYAN }}>tuple</code>{" "}
          уже неизменяем и хешируем, поэтому сравнивается по значению и
          спокойно кладётся в словари и множества — а это ровно то, что нам
          понадобится дальше для таблиц V и Q.
        </p>
      </div>

      {/* 2.2 Action */}
      <SubHeading id="l15-action">2.2 Действие A</SubHeading>
      <div style={BODY_STYLE} className="space-y-3 text-foreground/90">
        <p>
          Действие — это то, что бот умеет делать. В нашем мире действий ровно
          четыре: шаг вверх, вниз, влево, вправо. Держим их как индексы{" "}
          <code style={{ fontFamily: MONO_FONT, color: CYAN }}>0..3</code> — так
          действие одинаково удобно ложится и в ключ словаря, и в индекс
          массива, — а рядом кладём сдвиг по сетке и читаемую подпись.
        </p>
      </div>
      <div className="my-4">
        <CyberCodeBlock language="python" filename="action.py">
          {ACTION_CODE}
        </CyberCodeBlock>
      </div>
      <div style={BODY_STYLE} className="space-y-3 text-foreground/90">
        <p>
          Действия бывают дискретными, как здесь — готовый конечный список
          вариантов, — и непрерывными, например угол поворота руля или сила
          тяги. В этом разделе работаем только с дискретными: так проще
          увидеть устройство MDP, не отвлекаясь на интегралы.
        </p>
      </div>

      {/* 2.3 Reward */}
      <SubHeading id="l15-reward">2.3 Награда R</SubHeading>
      <div style={BODY_STYLE} className="space-y-3 text-foreground/90">
        <p>
          Награда — числовой сигнал, по которому среда сообщает агенту «тебе
          это нравится или нет». Для RoomBot она зависит только от того, в
          какой клетке оказался бот после шага: зарядная станция даёт плюс
          единицу, лужа — минус единицу, любая другая клетка — маленький
          штраф.
        </p>
      </div>
      <div className="my-4">
        <CyberCodeBlock language="python" filename="reward.py">
          {REWARD_CODE}
        </CyberCodeBlock>
      </div>
      <div
        className="rounded-lg p-4"
        style={{
          background: GLASS_BG,
          border: `1px solid ${SOFT_BORDER}`,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          ...BODY_STYLE,
        }}
      >
        <p className="text-foreground/80">
          Зачем этот маленький{" "}
          <code style={{ fontFamily: MONO_FONT, color: AMBER }}>-0.02</code> на
          каждом шаге? Без него боту выгодно было бы гулять по комнате сколько
          угодно, лишь бы не попасть в лужу. Мини-штраф мягко говорит: «любой
          шаг стоит тебе немного, так что ищи батарею быстрее». Это не
          математика, а инженерное решение — design choice, влияющий на
          поведение агента.
        </p>
      </div>

      {/* 2.4 Trajectory */}
      <SubHeading id="l15-trajectory">2.4 Траектория</SubHeading>
      <div style={BODY_STYLE} className="space-y-3 text-foreground/90">
        <p>
          Когда бот оживает и начинает действовать, получается цепочка:
          стартовое состояние <span style={{ fontFamily: MONO_FONT, color: CYAN }}>S₀</span>,
          выбранное действие <span style={{ fontFamily: MONO_FONT, color: MAGENTA }}>A₀</span>,
          полученная награда <span style={{ fontFamily: MONO_FONT, color: AMBER }}>R₁</span>,
          новое состояние <span style={{ fontFamily: MONO_FONT, color: CYAN }}>S₁</span>,
          следующее действие, следующая награда, и так далее, пока эпизод не
          закончится. Именно эту последовательность мы позже будем записывать
          в буфер опыта и по ней же будем учиться.
        </p>
      </div>

      <figure
        className="my-5 rounded-xl p-5"
        style={{
          background: GLASS_BG,
          border: `1px solid ${SOFT_BORDER}`,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        <TrajectoryDiagram />
        <figcaption className="mt-4 flex flex-wrap gap-4 justify-center">
          <LegendDot color={CYAN} label="state" />
          <LegendDot color={MAGENTA} label="action" />
          <LegendDot color={AMBER} label="reward" />
        </figcaption>
      </figure>

      {/* 2.5 PyTorch teaser */}
      <div
        className="mt-8 rounded-lg p-4"
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
          PyTorch teaser
        </p>
        <p className="text-foreground/85">
          Через пару уроков все эти объекты превратятся в тензоры: состояние
          станет 9-мерным one-hot-вектором (единица на нужной клетке, нули
          везде ещё), действие — целочисленным индексом 0…3, награда —
          обычным скаляром <code style={{ fontFamily: MONO_FONT, color: CYAN }}>float32</code>.
          Но пока мы сознательно сидим на чистом Python — чтобы было видно
          саму структуру, а не API фреймворка.
        </p>
      </div>
    </section>
  );
};

export default Section_WorldAndState;
