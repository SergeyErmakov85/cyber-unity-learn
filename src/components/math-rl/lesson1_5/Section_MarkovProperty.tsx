import CyberCodeBlock from "@/components/CyberCodeBlock";
import Math from "@/components/Math";
import HubLink from "@/components/math-rl/HubLink";

const HEADING_FONT =
  "'Orbitron', 'Inter', ui-sans-serif, system-ui, sans-serif";
const MONO_FONT = "'JetBrains Mono', ui-monospace, monospace";
const GLASS_BG = "rgba(12,16,28,0.7)";
const SOFT_BORDER = "rgba(255,255,255,0.06)";
const CYAN = "#00FFD6";
const MAGENTA = "#D946EF";
const AMBER = "#F59E0B";
const DANGER = "#FF4D6D";

const BODY_STYLE: React.CSSProperties = { fontSize: 14, lineHeight: 1.7 };

const TRANSITION_CODE = `SLIP = 0.1   # вероятность проскальзывания

def move(s, a):
    """Клетка назначения; стена возвращает бота на место (clamp)."""
    r, c = s
    dr, dc = MOVES[a]
    return (min(max(r + dr, 0), GRID - 1), min(max(c + dc, 0), GRID - 1))

def next_states(s, a):
    """[(вероятность, следующее состояние), ...] — по одной паре на действие:
    0.9 на задуманное, оставшиеся 0.1 поровну на три остальных."""
    return [((1 - SLIP) if b == a else SLIP / 3, move(s, b)) for b in ACTIONS]

# Sanity-check: из (0,0) вверх упираемся в стену и остаёмся в (0,0) с p=0.9
print(next_states((0, 0), UP))
# Из (1,1) вправо: 0.9 → (1,2), по 0.033... на каждое из трёх других
print(next_states((1, 1), RIGHT))
`;

interface TupleSlot {
  letter: string;
  name: string;
  desc: string;
  section: string;
  color: string;
  pending?: boolean;
}

const MDP_SLOTS: TupleSlot[] = [
  {
    letter: "S",
    name: "States",
    desc: "множество всех клеток комнаты",
    section: "§ 2.1",
    color: CYAN,
  },
  {
    letter: "A",
    name: "Actions",
    desc: "четыре шага бота",
    section: "§ 2.2",
    color: MAGENTA,
  },
  {
    letter: "P",
    name: "Transitions",
    desc: "построили только что",
    section: "§ 3",
    color: CYAN,
  },
  {
    letter: "R",
    name: "Rewards",
    desc: "батарея, лужа и штраф за шаг",
    section: "§ 2.3",
    color: AMBER,
  },
  {
    letter: "γ",
    name: "Discount",
    desc: "скоро объясним",
    section: "к § 5",
    color: MAGENTA,
    pending: true,
  },
];

const TupleBox = () => (
  <div
    className="grid gap-3 mt-2"
    style={{
      gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    }}
    role="list"
    aria-label="Пятёрка MDP"
  >
    {MDP_SLOTS.map((slot) => (
      <div
        key={slot.letter}
        role="listitem"
        className="rounded-xl p-4 flex flex-col items-center text-center"
        style={{
          background: GLASS_BG,
          border: `1px solid ${SOFT_BORDER}`,
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          boxShadow: `0 0 0 1px ${slot.color}22, inset 0 0 18px ${slot.color}08`,
        }}
      >
        <div
          style={{
            fontFamily: HEADING_FONT,
            fontSize: 28,
            lineHeight: 1,
            color: slot.color,
            textShadow: `0 0 10px ${slot.color}66`,
          }}
        >
          {slot.letter}
        </div>
        <div
          className="mt-2"
          style={{
            fontFamily: MONO_FONT,
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.65)",
            textTransform: "uppercase",
          }}
        >
          {slot.name}
        </div>
        <div
          className="mt-1.5 text-foreground/80"
          style={{ fontSize: 12.5, lineHeight: 1.55 }}
        >
          {slot.desc}
        </div>
        <div className="mt-2" style={{ fontFamily: MONO_FONT, fontSize: 11 }}>
          {slot.pending ? (
            <a
              href="#l15-value-v"
              style={{
                color: DANGER,
                fontStyle: "italic",
                textDecoration: "underline",
                textDecorationColor: `${DANGER}aa`,
                textUnderlineOffset: 2,
              }}
            >
              {slot.section}
            </a>
          ) : (
            <span style={{ color: "rgba(255,255,255,0.5)" }}>{slot.section}</span>
          )}
        </div>
      </div>
    ))}
  </div>
);

const Section_MarkovProperty = () => {
  return (
    <section
      id="l15-markov-property"
      aria-labelledby="l15-markov-heading"
      className="py-6"
      style={{ background: "transparent" }}
    >
      <header className="mb-5">
        <h2
          id="l15-markov-heading"
          className="text-2xl md:text-3xl font-bold tracking-wide"
          style={{ fontFamily: HEADING_FONT, color: CYAN }}
        >
          § 3. Фотография vs видео: Марковское свойство
        </h2>
        <p className="mt-2 italic text-muted-foreground" style={BODY_STYLE}>
          Сначала — картинка и здравый смысл. Формула появится ровно тогда,
          когда без неё уже нельзя.
        </p>
      </header>

      {/* 3.1 Thought experiment */}
      <div style={BODY_STYLE} className="space-y-4 text-foreground/90">
        <p>
          Представьте, что вам показали одну-единственную фотографию летящего
          мяча: просто точка с координатами{" "}
          <span style={{ fontFamily: MONO_FONT, color: CYAN }}>(x, y)</span>.
          Вопрос — куда этот мяч прилетит через секунду? Честный ответ:
          неизвестно. Может, вверх, может, вниз, может, вбок — по одной
          фотографии это не определить, потому что в ней нет скорости.
        </p>
        <p>
          А теперь добавим к описанию вектор скорости{" "}
          <span style={{ fontFamily: MONO_FONT, color: CYAN }}>(vx, vy)</span>.
          С этим описанием прогноз становится однозначным: из текущей точки и
          скорости легко посчитать траекторию (или хотя бы её математическое
          ожидание, если есть шум). Мы расширили состояние так, чтобы будущее
          перестало зависеть от того, что было до этого кадра.
        </p>
        <p>
          Это и есть Марковское свойство — критерий достаточности состояния:{" "}
          <strong className="text-foreground">
            состояние должно содержать столько информации, чтобы будущее не
            зависело от прошлого
          </strong>
          . Если такое состояние есть — можно строить MDP. Если нет — нужно
          расширить состояние или признать, что мы в задаче чуть посложнее
          (о ней в самом конце).
        </p>
      </div>

      {/* 3.2 Formula */}
      <div className="mt-5">
        <Math>
          {"\\enfFun{P}(\\enfVar{S}_{t+1} \\mid \\enfVar{S}_t, \\enfFun{A}_t) \\;=\\; \\enfFun{P}(\\enfVar{S}_{t+1} \\mid \\enfVar{S}_0, \\enfFun{A}_0, \\dots, \\enfVar{S}_t, \\enfFun{A}_t)"}
        </Math>
        <p
          className="mt-1 italic text-muted-foreground"
          style={{ ...BODY_STYLE, textAlign: "center" }}
        >
          читается — «зная только текущее, я знаю ровно столько же, сколько
          знал бы, помня всю историю».
        </p>
      </div>

      {/* 3.3 RoomBot check */}
      <div style={BODY_STYLE} className="space-y-3 text-foreground/90 mt-6">
        <p>
          Проверим на RoomBot. Состояние — пара{" "}
          <span style={{ fontFamily: MONO_FONT, color: CYAN }}>(row, col)</span>.
          Куда бот попадёт после шага вправо? Только от клетки, на которой он
          сейчас стоит (с учётом десятипроцентного проскальзывания). Неважно,
          как он сюда пришёл: через три шага или через тридцать, петляя или
          по прямой, — распределение следующих состояний одно и то же. Значит,
          свойство выполняется.
        </p>
        <p>
          А вот контрпример: добавим деталь реального мира — батарея бота
          постепенно разряжается, и, как только заряд кончится, эпизод
          обрывается. Пара{" "}
          <span style={{ fontFamily: MONO_FONT, color: CYAN }}>(row, col)</span>{" "}
          здесь уже не марковская: в клетке (0, 0) со свежим аккумулятором и в
          той же клетке на последних процентах будущее различается. Лечение —
          расширить состояние до тройки{" "}
          <span style={{ fontFamily: MONO_FONT, color: CYAN }}>(row, col, battery)</span>.
          Это классический приём: «не выполняется марковость — докладывай в
          состояние то, чего не хватает».
        </p>
      </div>

      {/* 3.4 Transition function */}
      <div
        className="mt-6 rounded-lg p-4"
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
            color: CYAN,
            textTransform: "uppercase",
          }}
        >
          Единственная таблица переходов на весь урок
        </p>
        <p className="text-foreground/85">
          Ниже — функция{" "}
          <code style={{ fontFamily: MONO_FONT, color: CYAN }}>next_states</code>,
          которая по состоянию и действию возвращает распределение следующих
          состояний. К ней мы будем возвращаться в § 4, § 5 и § 7, считая
          ожидания и запуская Value Iteration. Никакой магии — просто{" "}
          <code style={{ fontFamily: MONO_FONT, color: CYAN }}>clamp</code> на
          границы плюс распределение «0.9 на нужную клетку, 0.1 на случайную
          из оставшихся».
        </p>
      </div>
      <div className="my-4">
        <CyberCodeBlock language="python" filename="transition.py">
          {TRANSITION_CODE}
        </CyberCodeBlock>
      </div>

      {/* 3.5 Hub link */}
      <div style={BODY_STYLE} className="text-foreground/85">
        <p>
          Если захочется строгих выкладок вместо аналогии про мяч — смотрите{" "}
          <HubLink
            to="/hub/math-rl"
            anchor="марковское-свойство"
            variant="inline"
          >
            формальное доказательство марковости
          </HubLink>
          .
        </p>
      </div>

      {/* 3.6 MDP tuple */}
      <div className="mt-8">
        <h3
          id="l15-mdp-tuple"
          className="text-lg md:text-xl font-semibold mb-3"
          style={{ fontFamily: HEADING_FONT, color: "rgba(255,255,255,0.92)" }}
        >
          3.5 Пятёрка MDP = <span style={{ color: CYAN }}>(S</span>,{" "}
          <span style={{ color: MAGENTA }}>A</span>,{" "}
          <span style={{ color: CYAN }}>P</span>,{" "}
          <span style={{ color: AMBER }}>R</span>,{" "}
          <span style={{ color: MAGENTA }}>γ</span>
          <span style={{ color: "rgba(255,255,255,0.92)" }}>)</span>
        </h3>
        <div style={BODY_STYLE} className="text-foreground/85">
          <p>
            Теперь, когда каждая буква мотивирована своим местом в RoomBot,
            можно аккуратно собрать их в одну коробку. Дальше весь урок —
            работа с её пятью слотами.
          </p>
        </div>
        <TupleBox />
      </div>
    </section>
  );
};

export default Section_MarkovProperty;
