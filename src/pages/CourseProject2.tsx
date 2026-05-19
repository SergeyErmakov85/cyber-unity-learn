import LessonLayout from "@/components/LessonLayout";
import ProGate from "@/components/ProGate";
import HubLink from "@/components/math-rl/HubLink";
import HunterParallelismDiagram from "@/components/math-rl/HunterParallelismDiagram";
import HunterArenaDiagram from "@/components/project-2/HunterArenaDiagram";
import RaySensorViz from "@/components/project-2/RaySensorViz";
import ObservationVectorViz from "@/components/project-2/ObservationVectorViz";
import GaussianPolicyClampViz from "@/components/project-2/GaussianPolicyClampViz";
import DiscreteVsContinuousPath from "@/components/project-2/DiscreteVsContinuousPath";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import Math from "@/components/Math";

/* ============================================================================
 * Капстоун Уровня 2 — «3D-агент-охотник в Unity ML-Agents».
 * НАРРАТИВНЫЙ скелет (промпт #1 наполнения).
 * Источник: research-артефакт «2.7. 3-D agent Hunter», раздел A.
 *
 * На этом шаге: только нарратив + пустые секции-якоря под будущий контент.
 * Никаких формул, кода, таблиц гиперпараметров — это придёт следующими
 * промптами в конкретные секции по их id.
 * ============================================================================ */

// Дизайн-токены C (фон/неон/шрифты) — централизованно, чтобы потом легко
// заменить на CSS-переменные после внедрения в index.css.
const BG = "#06080D";
const TEXT = "#F4F7FC";
const DIM = "#B0B8CE";
const MUTED = "#6B7490";
const CYAN = "#00FFD6";
const MAGENTA = "#D946EF";
const BORDER = "rgba(255,255,255,0.05)";
const SURFACE = "rgba(255,255,255,0.02)";
const ORBITRON = "'Orbitron', ui-sans-serif, system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

// 10 этапов инженерного пути — нарратив-маршрут (раздел A артефакта).
// По 1–2 предложения, без формул и кода (по контракту промпта).
const ROADMAP: ReadonlyArray<{ title: string; text: string }> = [
  {
    title: "Поставить стек",
    text:
      "Unity 6000.0+, пакет ML-Agents 4.0.0 (Release 23), Python 3.10, PyTorch ≥ 2.1.1. Это рабочая база Охотника на 2026 год.",
  },
  {
    title: "Собрать арену",
    text:
      "Замкнутый куб 20×20 м со стенами и 3–6 препятствиями. Внутри — наш агент и движущаяся цель; вся арена сохраняется как Prefab «TrainingArea» — чтобы потом дублироваться десятками копий.",
  },
  {
    title: "Написать HunterAgent",
    text:
      "Скрипт-наследник Agent с четырьмя ключевыми методами: сброс эпизода, сбор наблюдений, реакция на действия и эвристика-«ручник» для отладки руками.",
  },
  {
    title: "Дать ему глаза и проприоцепцию",
    text:
      "Лучевой сенсор смотрит вперёд лучами по тегам стен, препятствий и цели; векторный сенсор добавляет нормированные позицию, скорость и ориентацию относительно цели.",
  },
  {
    title: "Назначить тело действий",
    text:
      "В Behavior Parameters задаём имя поведения «Hunter» и непрерывный action space: два числа (тяга и поворот) — этого достаточно для маневрирования в плоскости.",
  },
  {
    title: "Размножить арены",
    text:
      "Компонент TrainingAreaReplicator расставляет 8–16 идентичных Prefab-арен сеткой. Один процесс собирает опыт параллельно со всех — и это до запуска любых параллельных Unity-инстансов.",
  },
  {
    title: "Записать hunter.yaml",
    text:
      "Конфигурационный файл с дефолтами PPO, нормализацией наблюдений и горизонтом бюджета обучения — единая точка истины для воспроизводимого запуска.",
  },
  {
    title: "Запустить mlagents-learn",
    text:
      "Одна команда из терминала — и сцена начинает прогоняться на ускоренном таймскейле, а в папке results появляются чекпоинты и event-файлы.",
  },
  {
    title: "Смотреть в TensorBoard",
    text:
      "Параллельно открываем TensorBoard и читаем кумулятивную награду, энтропию политики и value loss — три графика, по которым видно «учится или хакает».",
  },
  {
    title: "Подключить .onnx-модель",
    text:
      "Финальный шаг — выдернуть Hunter.onnx из results, положить в Behavior Parameters и переключить агента в Inference Only: тот же скрипт, но без Python в петле.",
  },
];

// Стабильные id будущих секций — нужны для HubLink return-якорей и для TOC.
const SECTIONS: ReadonlyArray<{ id: string; title: string; lead: string }> = [
  {
    id: "env-observations",
    title: "Среда и наблюдения",
    lead: "Геометрия арены, теги, что именно агент «видит» и почему именно это.",
  },
  {
    id: "continuous-control",
    title: "Непрерывное управление",
    lead: "Action space из двух чисел, диагональная гауссова политика, ручной clamp.",
  },
  {
    id: "ppo-hyperparams",
    title: "PPO и гиперпараметры",
    lead: "Почему PPO для капстоуна и как читать hunter.yaml по строкам.",
  },
  {
    id: "reward-shaping",
    title: "Формирование награды",
    lead:
      "От наивной distance-reward к потенциальной формулировке, terminal bonus и time penalty.",
  },
  {
    id: "parallel-envs",
    title: "Параллельные среды",
    lead:
      "TrainingAreaReplicator против --num-envs, сублинейный speedup и почему 8 ≠ ×8.",
  },
  {
    id: "training-monitoring",
    title: "Мониторинг обучения",
    lead:
      "TensorBoard-чек-лист: симптом → метрика → действие. Распознаём reward hacking по форме графиков.",
  },
  {
    id: "working-artifacts",
    title: "Рабочие артефакты",
    lead: "Готовый hunter.yaml, HunterAgent.cs и Hunter.onnx — что лежит и зачем.",
  },
  {
    id: "reward-sandbox",
    title: "Песочница награды",
    lead:
      "Интерактив: крутим компоненты награды и смотрим, как меняется поведение Охотника.",
  },
];

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2
    className="text-xl md:text-2xl tracking-wide"
    style={{ fontFamily: ORBITRON, color: TEXT, letterSpacing: "0.04em" }}
  >
    {children}
  </h2>
);

const CourseProject2 = () => {
  const preview = (
    <div
      style={{ backgroundColor: BG, color: TEXT }}
      className="rounded-2xl p-6 md:p-10 space-y-12"
    >
      {/* ── Back-link test anchor (round-trip с HubLink) ───────────────────── */}
      <section
        id="capstone-return-test"
        className="scroll-mt-28 p-4 rounded-lg"
        style={{
          border: `1px solid ${BORDER}`,
          background: "rgba(0,255,214,0.04)",
        }}
      >
        <p className="text-sm mb-2" style={{ color: DIM, fontSize: 14 }}>
          Формальная база этого капстоуна разложена в хабе «Математика RL» — здесь
          мы лишь возвращаемся к ней по ссылкам, без дублирования вывода:
        </p>
        <HubLink
          to="/hub/math-rl"
          anchor="геометрический-ряд"
          variant="pill"
          fromPath="/courses/project-2"
          fromAnchor="capstone-return-test"
          fromLabel="Капстоун · 3D-агент-охотник"
        >
          Геометрический ряд и сходимость возврата
        </HubLink>
      </section>

      {/* ── Вступление ─────────────────────────────────────────────────────── */}
      <section id="intro" className="scroll-mt-28 space-y-5">
        <SectionHeading>Что строим</SectionHeading>
        <p style={{ color: DIM, fontSize: 15, lineHeight: 1.7 }}>
          Капстоун Уровня 2 — это 3D-«Охотник» в Unity: компактная замкнутая арена
          с препятствиями, в которой агент-сфера с непрерывным управлением учится
          догонять и ловить движущуюся цель. Мы делаем не «ещё один туториал по
          PPO», а маленькую самостоятельную лабораторию, где каждое решение
          оставляет след на графиках TensorBoard и в поведении Охотника.
        </p>
        <p style={{ color: DIM, fontSize: 15, lineHeight: 1.7 }}>
          Капстоун специально собран так, чтобы одновременно нагрузить четыре
          навыка предыдущих разделов уровня: проектирование непрерывного
          управления, формирование награды (включая потенциальный shaping и
          борьбу с reward hacking), параллельный сбор опыта десятками арен в одной
          сцене и визуальную диагностику обучения. На выходе — обученный
          Hunter.onnx, который запускается без Python в Behavior Type «Inference
          Only».
        </p>
        <p style={{ color: DIM, fontSize: 15, lineHeight: 1.7 }}>
          Дальше — карта маршрута на десять остановок. Это не чек-лист и не
          оглавление: каждый шаг — точка решения, к которой мы вернёмся в
          отдельной секции с разбором «как» и «почему».
        </p>
      </section>

      {/* ── Раздел-оглавление: путь из 10 этапов ──────────────────────────── */}
      <section id="roadmap" className="scroll-mt-28 space-y-6">
        <SectionHeading>Путь от пустой сцены к обученному агенту</SectionHeading>
        <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.6 }}>
          Десять шагов, по которым будет двигаться Охотник в этом капстоуне. Без
          формул и кода — только сюжет; формальные выкладки лежат в хабах, технические
          детали — в разделах ниже.
        </p>
        <ol className="space-y-3">
          {ROADMAP.map((step, i) => (
            <li
              key={step.title}
              className="flex gap-4 p-4 rounded-lg backdrop-blur-sm"
              style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
            >
              <span
                aria-hidden
                className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-md"
                style={{
                  fontFamily: MONO,
                  fontSize: 14,
                  color: CYAN,
                  border: `1px solid ${CYAN}33`,
                  background: "rgba(0,255,214,0.06)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p
                  style={{
                    fontFamily: ORBITRON,
                    color: TEXT,
                    fontSize: 15,
                    letterSpacing: "0.03em",
                  }}
                >
                  {step.title}
                </p>
                <p
                  className="mt-1"
                  style={{ color: DIM, fontSize: 14, lineHeight: 1.6 }}
                >
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Секция: Среда и наблюдения (наполнено) ────────────────────────── */}
      <section
        id="env-observations"
        className="scroll-mt-28 p-6 md:p-8 rounded-xl backdrop-blur-sm space-y-6"
        style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
      >
        <SectionHeading>Среда и наблюдения</SectionHeading>
        <p style={{ color: DIM, fontSize: 15, lineHeight: 1.7 }}>
          Прежде чем учить — нужно решить, где Охотник живёт и что он вообще
          способен «видеть». В капстоуне это две независимые проектные оси:
          геометрия арены и сенсорика агента. От них напрямую зависит, как
          быстро PPO найдёт политику и не свалится ли в reward hacking.
        </p>

        {/* Геометрия арены */}
        <div
          className="p-5 rounded-lg space-y-3"
          style={{ border: `1px solid ${BORDER}`, background: "rgba(0,255,214,0.03)" }}
        >
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            Замкнутая арена и препятствия
          </h3>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Базовый размер — куб <span style={{ fontFamily: MONO, color: TEXT }}>10×10</span>
            …<span style={{ fontFamily: MONO, color: TEXT }}>20×20</span> метров со
            стенами по периметру. Меньше — Охотник «спотыкается» о цель случайно
            и переобучается на тривиальную стратегию; больше — эпизоды слишком
            длинные, PPO не успевает увидеть достаточное число терминальных
            событий за <span style={{ fontFamily: MONO, color: TEXT }}>max_steps</span>.
          </p>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Внутри — <span style={{ fontFamily: MONO, color: TEXT }}>3–6</span>{" "}
            статичных препятствий-кубов: достаточно, чтобы появились «обходные
            траектории», и мало, чтобы случайная инициализация почти всегда
            оставалась проходимой. Вся сборка (пол, стены, препятствия, агент,
            цель, спавн-точки) запекается в Prefab{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>TrainingArea</span> —
            это базовый «кирпич», который потом размножается{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>TrainingAreaReplicator</span>{" "}
            (см. раздел «Параллельные среды»).
          </p>
        </div>

        <HunterArenaDiagram />



        {/* Стратегии цели */}
        <div
          className="p-5 rounded-lg space-y-3"
          style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
        >
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            Как движется цель
          </h3>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Поведение цели — это скрытая часть распределения среды, и именно от
            него зависит, насколько политика будет «общей», а не выученной под
            один сценарий:
          </p>
          <ul className="space-y-2 list-disc pl-5" style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            <li>
              <span style={{ color: TEXT }}>random walk</span> — цель блуждает
              шумом. Самый быстрый сходящийся вариант, но Охотник учится «ловить
              броуновское движение», а не догонять.
            </li>
            <li>
              <span style={{ color: TEXT }}>scripted patrol</span> — цель ходит
              по фиксированному маршруту. Опасность переобучения: политика
              запоминает траекторию, а не принцип преследования.
            </li>
            <li>
              <span style={{ color: TEXT }}>evasive</span> — цель отталкивается
              от агента с ограниченной скоростью. Самый реалистичный режим;
              даёт чистые кривые в TensorBoard и переносимую политику.
            </li>
            <li>
              <span style={{ color: TEXT }}>self-play</span> — вторая цель —
              такой же агент, обучающийся убегать. Капстоун это не требует, но
              указывает, куда расти после Hunter.onnx.
            </li>
          </ul>
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6 }}>
            По умолчанию в капстоуне берём <span style={{ fontFamily: MONO, color: TEXT }}>evasive</span>{" "}
            со скоростью ≈ 0.6 от скорости агента — компромисс между скоростью
            обучения и обобщаемостью.
          </p>
        </div>

        {/* Пространство наблюдений */}
        <div
          className="p-5 rounded-lg space-y-3"
          style={{ border: `1px solid ${BORDER}`, background: "rgba(217,70,239,0.03)" }}
        >
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            Что Охотник «видит»: лучи + проприоцепция
          </h3>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Наблюдение в ML-Agents собирается из двух источников, и они решают
            разные задачи. Не подменяйте один другим.
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            <div
              className="p-4 rounded-md space-y-2"
              style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
            >
              <p style={{ fontFamily: MONO, color: CYAN, fontSize: 13 }}>
                RayPerceptionSensorComponent3D
              </p>
              <p style={{ color: DIM, fontSize: 14, lineHeight: 1.6 }}>
                «Зрение»: 3 луча в конусе ≈ 70°, дальность ≈ 20 м, теги{" "}
                <span style={{ fontFamily: MONO, color: TEXT }}>Wall</span>,{" "}
                <span style={{ fontFamily: MONO, color: TEXT }}>Obstacle</span>,{" "}
                <span style={{ fontFamily: MONO, color: TEXT }}>Target</span>.
                Отвечает за обход препятствий и «увидел/не увидел цель».
              </p>
            </div>
            <div
              className="p-4 rounded-md space-y-2"
              style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
            >
              <p style={{ fontFamily: MONO, color: MAGENTA, fontSize: 13 }}>
                VectorSensor (10–12 чисел)
              </p>
              <p style={{ color: DIM, fontSize: 14, lineHeight: 1.6 }}>
                «Проприоцепция»: относительная позиция цели, собственная
                скорость, ориентация, угол на цель. Отвечает за гладкое
                наведение, когда цель уже в поле зрения.
              </p>
            </div>
          </div>
          <RaySensorViz />
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>

            Все векторные фичи нормализуем в{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>[-1, 1]</span>:
            позиции делим на полудиагональ арены, скорости — на максимальный
            модуль, углы — на π. Это не косметика — без нормализации PPO с{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>normalize: true</span>{" "}
            всё равно работает, но статистики «разъезжаются» дольше, и кривая
            энтропии в TensorBoard выглядит рваной.
          </p>
          <ObservationVectorViz />
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Почему нормализация и выбор представления состояния — это не «тюнинг»,

            а часть постановки MDP, разобрано в хабе:{" "}
            <HubLink
              to="/hub/math-rl"
              anchor="марковское-свойство"
              variant="inline"
              fromPath="/courses/project-2"
              fromAnchor="env-observations"
              fromLabel="Капстоун · 3D-агент-охотник · Среда и наблюдения"
            >
              марковское свойство и достаточность состояния
            </HubLink>
            . А формальный разбор нормализации фич и стандартизации наблюдений —{" "}
            <HubLink
              to="/hub/math-rl"
              anchor="todo-нормализация-наблюдений"
              variant="inline"
              fromPath="/courses/project-2"
              fromAnchor="env-observations"
              fromLabel="Капстоун · 3D-агент-охотник · Среда и наблюдения"
            >
              нормализация и шкалирование признаков (TODO-хаб)
            </HubLink>
            .
          </p>
        </div>

        {/* Терминация */}
        <div
          className="p-5 rounded-lg space-y-3"
          style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
        >
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            Когда эпизод заканчивается
          </h3>
          <ul className="space-y-2 list-disc pl-5" style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            <li>
              <span style={{ color: TEXT }}>Поимка</span> — расстояние до цели{" "}
              <span style={{ fontFamily: MONO, color: TEXT }}>&lt; 1.0 м</span>:
              терминальная награда <span style={{ fontFamily: MONO, color: TEXT }}>+1.0</span>,{" "}
              <span style={{ fontFamily: MONO, color: TEXT }}>EndEpisode()</span>.
            </li>
            <li>
              <span style={{ color: TEXT }}>Тайм-аут</span> — превышен{" "}
              <span style={{ fontFamily: MONO, color: TEXT }}>MaxStep</span>{" "}
              (≈ 1000 шагов): эпизод закрывается «по таймеру», без бонуса.
            </li>
            <li>
              <span style={{ color: TEXT }}>Выход из арены</span> (страховка
              против бага физики) — мгновенный сброс без штрафа сверху того, что
              уже накоплено по time penalty.
            </li>
          </ul>
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6 }}>
            Сама структура награды (потенциальный shaping, time penalty,
            collision penalty) разбирается в разделе «Формирование награды» —
            здесь только условия закрытия эпизода.
          </p>
        </div>
      </section>

      {/* ── Секция: Непрерывное управление (наполнено) ────────────────────── */}
      <section
        id="continuous-control"
        className="scroll-mt-28 p-6 md:p-8 rounded-xl backdrop-blur-sm space-y-6"
        style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
      >
        <SectionHeading>Непрерывное управление</SectionHeading>
        <p style={{ color: DIM, fontSize: 15, lineHeight: 1.7 }}>
          Охотник управляется не «нажатиями кнопок», а двумя вещественными
          числами в кадре. Это сознательный выбор: непрерывное действие меняет
          и физику движения, и архитектуру политики, и даже подбор
          гиперпараметров PPO. Разбираем по слоям.
        </p>

        {/* Action space */}
        <div
          className="p-5 rounded-lg space-y-3"
          style={{ border: `1px solid ${BORDER}`, background: "rgba(0,255,214,0.03)" }}
        >
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            Action space: 2 числа (или 3)
          </h3>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Базовая версия Охотника —{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>Continuous Actions = 2</span>:
          </p>
          <ul className="space-y-2 list-disc pl-5" style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            <li>
              <span style={{ fontFamily: MONO, color: CYAN }}>a[0] = thrust</span>{" "}
              ∈ <span style={{ fontFamily: MONO, color: TEXT }}>[-1, +1]</span> —
              продольная тяга (вперёд/назад).
            </li>
            <li>
              <span style={{ fontFamily: MONO, color: CYAN }}>a[1] = yaw</span> ∈{" "}
              <span style={{ fontFamily: MONO, color: TEXT }}>[-1, +1]</span> —
              угловая скорость поворота.
            </li>
          </ul>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Расширенная версия —{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>Continuous Actions = 3</span>{" "}
            (<span style={{ fontFamily: MONO, color: TEXT }}>vx, vz, yaw</span>) —
            нужна, если убрать инерцию и управлять напрямую вектором скорости.
            Для капстоуна берём двухмерный вариант: ближе к «настоящей» машинке
            и достаточен, чтобы PPO нашёл нетривиальную стратегию обхода
            препятствий.
          </p>
        </div>

        {/* Почему continuous, а не discrete */}
        <div
          className="p-5 rounded-lg space-y-3"
          style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
        >
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            Почему не дискретное управление
          </h3>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Дискретный вариант («вперёд / назад / влево / вправо / стоп»)
            обучается быстрее: меньше пространство, меньшего{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>batch_size</span>{" "}
            хватает, чтобы PPO стабильно оценил градиент. Но Охотник тогда
            движется «лесенкой», не умеет аккуратно довернуть на цель и часто
            проскакивает её на полной скорости.
          </p>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Цена непрерывного действия — больший{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>batch_size</span>{" "}
            (2048+) и{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>buffer_size</span>{" "}
            (≈ 10× batch), чтобы статистика градиента не «дрожала». Зато на
            выходе — гладкая траектория и поведение, которое реально похоже на
            преследование. Это инженерный размен «sample efficiency ↔
            качество поведения», и для капстоуна мы сознательно выбираем
            второе.
          </p>
        </div>

        {/* Гауссова политика без squashing */}
        <div
          className="p-5 rounded-lg space-y-3"
          style={{ border: `1px solid ${BORDER}`, background: "rgba(217,70,239,0.03)" }}
        >
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            Гауссова политика и зачем нужен Mathf.Clamp
          </h3>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            PPO в ML-Agents для непрерывного действия использует{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>GaussianDistInstance</span>{" "}
            — диагональную гауссову политику без{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>tanh</span>-сжатия.
            На практике это значит одну неприятную вещь: семпл из{" "}
            <Math display={false}>{"\\mathcal{N}(\\mu, \\sigma^{2})"}</Math>{" "}
            формально не ограничен — на хвостах распределения вы получите
            значения вроде <span style={{ fontFamily: MONO, color: TEXT }}>2.7</span>{" "}
            или <span style={{ fontFamily: MONO, color: TEXT }}>−3.1</span>, а
            не аккуратные <span style={{ fontFamily: MONO, color: TEXT }}>[-1, +1]</span>.
          </p>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            В отличие от SB3 / SAC, где squashing включён по умолчанию, в
            ML-Agents он <span style={{ color: TEXT }}>выключен</span>. Поэтому
            в <span style={{ fontFamily: MONO, color: TEXT }}>OnActionReceived</span>{" "}
            обязательно идёт ручной клэмп:
          </p>
          <div
            className="p-3 rounded-md overflow-x-auto"
            style={{
              border: `1px solid ${BORDER}`,
              background: "rgba(0,0,0,0.35)",
              fontFamily: MONO,
              fontSize: 13,
              color: TEXT,
            }}
          >
            <span style={{ color: MUTED }}>float</span> thrust = Mathf.Clamp(actions.ContinuousActions[0], -1f, 1f);
            <br />
            <span style={{ color: MUTED }}>float</span> yaw&nbsp;&nbsp;&nbsp; = Mathf.Clamp(actions.ContinuousActions[1], -1f, 1f);
          </div>
          <GaussianPolicyClampViz />
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6 }}>

            Без этого клэмпа Охотник на первых эпизодах раз в ~50 шагов
            получает «реактивный буст» от хвостовой выборки гауссианы — кривая
            <span style={{ fontFamily: MONO, color: TEXT }}> Policy/Entropy</span>{" "}
            растёт вместо падения, и PPO долго не сходится.
          </p>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Формальное определение
            <Math>{"\\pi_{\\theta}(a \\mid s) = \\mathcal{N}\\!\\big(\\mu_{\\theta}(s),\\ \\operatorname{diag}\\sigma_{\\theta}^{2}(s)\\big)"}</Math>
            reparameterization trick, вывод{" "}
            <Math display={false}>{"\\log \\pi(a \\mid s)"}</Math> и
            якобиана <span style={{ fontFamily: MONO, color: TEXT }}>tanh</span>-squashing
            (когда его всё-таки включают) — в хабе:{" "}
            <HubLink
              to="/hub/math-rl"
              anchor="todo-стохастические-политики-гауссова-tanh"
              variant="inline"
              fromPath="/courses/project-2"
              fromAnchor="continuous-control"
              fromLabel="Капстоун · 3D-агент-охотник · Непрерывное управление"
            >
              стохастические политики: диагональная гауссова и tanh-squashing (TODO-хаб)
            </HubLink>
            .
          </p>
        </div>
      </section>

      {/* ── Секция: PPO и гиперпараметры (наполнено) ─────────────────────── */}
      <section
        id="ppo-hyperparams"
        className="scroll-mt-28 p-6 md:p-8 rounded-xl backdrop-blur-sm space-y-6"
        style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
      >
        <SectionHeading>PPO и гиперпараметры</SectionHeading>
        <p style={{ color: DIM, fontSize: 15, lineHeight: 1.7 }}>
          Охотника обучает <span style={{ color: TEXT }}>PPO</span> (Proximal
          Policy Optimization, Schulman et&nbsp;al. 2017) — стандартный
          on-policy алгоритм ML-Agents. Альтернатива{" "}
          <span style={{ color: TEXT }}>SAC</span> (off-policy, лучше по{" "}
          sample efficiency) формально тоже доступна, но её хвалят за{" "}
          непрерывное управление в robotics, где данные дорогие. У нас данные
          дешёвые — это симуляция с десятками параллельных арен, — а ценится
          <span style={{ color: TEXT }}> стабильность</span> и предсказуемость
          кривых TensorBoard. Поэтому PPO: проще диагностировать,
          реже разваливается, базовый алгоритм всех современных RLHF/agentic
          стэков.
        </p>

        {/* Связка V / A / GAE / return — нарратив + 4 HubLink */}
        <div
          className="p-5 rounded-lg space-y-3"
          style={{ border: `1px solid ${BORDER}`, background: "rgba(0,255,214,0.03)" }}
        >
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            На каких величинах PPO учит политику
          </h3>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            В мире Охотника{" "}
            <Math display={false}>{"V(s)"}</Math>{" "}
            — это «насколько хороша текущая позиция», ожидаемая сумма будущих
            наград, если дальше действовать по нынешней политике. Critic-сеть
            PPO учится её предсказывать прямо во время обучения. Из неё
            считается{" "}
            <Math display={false}>{"A(s,a)"}</Math>{" "}
            — преимущество действия: «насколько именно этот рывок оказался
            лучше, чем в среднем из этой позиции». Если действие догнало цель —{" "}
            <Math display={false}>{"A"}</Math> положительное,
            политика смещается в его сторону.
          </p>
          <Math>{"V^{\\pi}(s) = \\mathbb{E}_{\\pi}\\!\\left[\\, r_t + \\gamma V^{\\pi}(s_{t+1}) \\mid s_t = s \\right]"}</Math>
          <Math>{"A^{\\pi}(s,a) = Q^{\\pi}(s,a) - V^{\\pi}(s)"}</Math>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            <Math display={false}>{"A"}</Math> можно
            считать одним шагом (шумно) или всем эпизодом (запоздало). GAE даёт
            непрерывную ручку{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>λ ∈ [0, 1]</span>{" "}
            между этими крайностями — компромисс bias / variance, который для
            Охотника решает, сходится ли обучение за 1М шагов или за 5М.
          </p>
          <Math>{"\\delta_t = r_t + \\gamma V(s_{t+1}) - V(s_t)"}</Math>
          <Math>{"\\hat{A}_t^{\\mathrm{GAE}(\\gamma,\\lambda)} = \\sum_{l=0}^{\\infty} (\\gamma\\lambda)^{l}\\, \\delta_{t+l}"}</Math>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Сама же сумма дисконтированных наград{" "}
            <Math display={false}>{"G_t = \\sum_{k=0}^{\\infty} \\gamma^{k}\\, r_{t+k}"}</Math>{" "}
            конечна именно потому, что{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>γ &lt; 1</span> — это
            та самая геометрическая прогрессия, без которой бесконечные эпизоды
            ломали бы целевую функцию.
          </p>

          <ul className="mt-2 space-y-2 list-disc pl-5" style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            <li>
              Формальные{" "}
              <HubLink
                to="/hub/math-rl"
                anchor="уравнение-ожиданий-беллмана"
                variant="inline"
                fromPath="/courses/project-2"
                fromAnchor="ppo-hyperparams"
                fromLabel="Капстоун · 3D-агент-охотник · PPO и гиперпараметры"
              >
                уравнения Беллмана для V, Q, A
              </HubLink>
              .
            </li>
            <li>
              Вывод GAE и анализ bias / variance:{" "}
              <HubLink
                to="/hub/math-rl"
                anchor="todo-gae-schulman-2015"
                variant="inline"
                fromPath="/courses/project-2"
                fromAnchor="ppo-hyperparams"
                fromLabel="Капстоун · 3D-агент-охотник · PPO и гиперпараметры"
              >
                GAE / Schulman 2015 (TODO-хаб)
              </HubLink>
              .
            </li>
            <li>
              Cl­ipped surrogate L<sup>CLIP</sup> и роль ε:{" "}
              <HubLink
                to="/hub/math-rl"
                anchor="todo-ppo-clipped-surrogate"
                variant="inline"
                fromPath="/courses/project-2"
                fromAnchor="ppo-hyperparams"
                fromLabel="Капстоун · 3D-агент-охотник · PPO и гиперпараметры"
              >
                PPO / TRPO objective (TODO-хаб)
              </HubLink>
              .
            </li>
            <li>
              Сходимость{" "}
              <Math display={false}>{"\\sum_{k} \\gamma^{k} r"}</Math> и
              смысл дисконта:{" "}
              <HubLink
                to="/hub/math-rl"
                anchor="геометрический-ряд"
                variant="inline"
                fromPath="/courses/project-2"
                fromAnchor="ppo-hyperparams"
                fromLabel="Капстоун · 3D-агент-охотник · PPO и гиперпараметры"
              >
                бесконечные ряды и геометрическая прогрессия
              </HubLink>
              .
            </li>
          </ul>
        </div>

        {/* Таблица гиперпараметров */}
        <div
          className="p-5 rounded-lg space-y-3"
          style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
        >
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            hunter.yaml: гиперпараметры PPO построчно
          </h3>
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6 }}>
            Значения — из раздела B3 research-артефакта (ML-Agents Release 23,
            конфиг для непрерывного управления среднего размера). Колонка
            «Диапазон» — рабочий коридор для Охотника, за пределами которого
            почти всегда что-то ломается.
          </p>
          <div className="overflow-x-auto">
            <table
              className="w-full text-left"
              style={{ borderCollapse: "separate", borderSpacing: 0 }}
            >
              <thead>
                <tr>
                  {["Параметр", "Дефолт", "Диапазон", "Роль"].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2"
                      style={{
                        fontFamily: ORBITRON,
                        color: CYAN,
                        fontSize: 12,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        borderBottom: `1px solid ${BORDER}`,
                        background: "rgba(0,255,214,0.04)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    p: "gamma",
                    d: "0.99",
                    r: "0.95 – 0.999",
                    role: "Дисконт. Ниже — Охотник «жаднее» к близкой цели, выше — терпеливее в обходе препятствий.",
                  },
                  {
                    p: "lambd",
                    d: "0.95",
                    r: "0.9 – 0.99",
                    role: "λ для GAE: компромисс bias / variance в оценке преимущества.",
                  },
                  {
                    p: "epsilon",
                    d: "0.2",
                    r: "0.1 – 0.3",
                    role: "Радиус clip в L^CLIP: насколько шаг политики может уйти от старой за одно обновление.",
                  },
                  {
                    p: "beta",
                    d: "5.0e-3",
                    r: "1e-4 – 1e-2",
                    role: "Вес энтропийного бонуса. Малое β → ранний коллапс энтропии и reward hacking.",
                  },
                  {
                    p: "learning_rate",
                    d: "3.0e-4",
                    r: "1e-4 – 5e-4",
                    role: "Шаг Adam. Schedule: linear (декай до 0 за max_steps).",
                  },
                  {
                    p: "learning_rate_schedule",
                    d: "linear",
                    r: "linear / constant",
                    role: "Линейный декай стабилизирует финал обучения, constant — для коротких пилотов.",
                  },
                  {
                    p: "batch_size",
                    d: "2048",
                    r: "1024 – 4096",
                    role: "Размер мини-батча PPO. Под непрерывное действие — нижняя граница 2048.",
                  },
                  {
                    p: "buffer_size",
                    d: "20480",
                    r: "10× – 20× batch_size",
                    role: "Сколько шагов копим перед update. Слишком мало → дёргает; слишком много → редкие апдейты.",
                  },
                  {
                    p: "num_epoch",
                    d: "3",
                    r: "3 – 10",
                    role: "Сколько раз PPO «проходит» по buffer на каждом update.",
                  },
                  {
                    p: "hidden_units",
                    d: "128",
                    r: "64 – 512",
                    role: "Ширина скрытых слоёв actor/critic. Для 10–12 фич хватает 128.",
                  },
                  {
                    p: "num_layers",
                    d: "2",
                    r: "1 – 3",
                    role: "Глубина MLP. Глубже не значит лучше — у Охотника низкоразмерное состояние.",
                  },
                  {
                    p: "time_horizon",
                    d: "128",
                    r: "64 – 256",
                    role: "Горизонт, на котором GAE «обрезает» отдачу. Связан с типичной длиной погони.",
                  },
                  {
                    p: "max_steps",
                    d: "2.0e6",
                    r: "1e6 – 5e6",
                    role: "Бюджет шагов на всю тренировку (сумма по агентам). Меньше — не успевает; больше — переобучение под среду.",
                  },
                ].map((row) => (
                  <tr key={row.p}>
                    <td
                      className="px-3 py-2 align-top"
                      style={{
                        fontFamily: MONO,
                        color: TEXT,
                        fontSize: 13,
                        borderBottom: `1px solid ${BORDER}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.p}
                    </td>
                    <td
                      className="px-3 py-2 align-top"
                      style={{
                        fontFamily: MONO,
                        color: CYAN,
                        fontSize: 17,
                        borderBottom: `1px solid ${BORDER}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.d}
                    </td>
                    <td
                      className="px-3 py-2 align-top"
                      style={{
                        fontFamily: MONO,
                        color: DIM,
                        fontSize: 13,
                        borderBottom: `1px solid ${BORDER}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.r}
                    </td>
                    <td
                      className="px-3 py-2 align-top"
                      style={{
                        color: DIM,
                        fontSize: 14,
                        lineHeight: 1.6,
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      {row.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6 }}>
            Полный <span style={{ fontFamily: MONO, color: TEXT }}>hunter.yaml</span>{" "}
            с этими значениями и комментариями появится в разделе «Рабочие
            артефакты» — здесь только семантика параметров.
          </p>
        </div>
      </section>

      {/* ── Секция: Формирование награды (наполнено) ──────────────────────── */}
      <section
        id="reward-shaping"
        className="scroll-mt-28 p-6 md:p-8 rounded-xl backdrop-blur-sm space-y-6"
        style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
      >
        <SectionHeading>Формирование награды</SectionHeading>
        <p style={{ color: DIM, fontSize: 15, lineHeight: 1.7 }}>
          Самая опасная часть капстоуна. Награда — это контракт между вами и
          PPO: алгоритм буквально найдёт способ её максимизировать, и если в
          контракте есть лазейка — он её и заэксплойтит. Дальше — рабочие
          компоненты награды Охотника, типовые провалы и контрмеры. Формальная
          теория (почему такая формула вообще не ломает оптимум) — в хабе.
        </p>

        {/* Компоненты dense reward */}
        <div
          className="p-5 rounded-lg space-y-3"
          style={{ border: `1px solid ${BORDER}`, background: "rgba(0,255,214,0.03)" }}
        >
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            Что входит в reward Охотника
          </h3>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Сборка такая: <span style={{ color: TEXT }}>один</span> терминальный
            бонус за поимку, <span style={{ color: TEXT }}>один</span> плотный
            (dense) PBRS-сигнал по расстоянию, <span style={{ color: TEXT }}>два</span>{" "}
            мелких штрафа на «не стой» и «не лезь в стену». Никаких бонусов «за
            движение», «за разворот», «за нажатие thrust» — это первый
            прямой путь к reward hacking.
          </p>
          <ul className="space-y-3 list-disc pl-5" style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            <li>
              <span style={{ color: TEXT }}>Potential-based shaping (PBRS)</span>{" "}
              на расстоянии до цели:
              <div className="mt-2 space-y-1">
                <Math>{"\\Phi(s) = -\\dfrac{d(s)}{d_{\\max}}"}</Math>
                <Math>{"F(s, s') = \\gamma\\,\\Phi(s') - \\Phi(s)"}</Math>
              </div>
              <p className="mt-2" style={{ color: DIM, fontSize: 14, lineHeight: 1.6 }}>
                По модулю на шаг — около{" "}
                <span style={{ fontFamily: MONO, color: TEXT }}>±0.01…0.05</span>.
                Это «магнит к цели» без обещания финального приза.
              </p>
            </li>
            <li>
              <span style={{ color: TEXT }}>Terminal catch</span>:{" "}
              <span style={{ fontFamily: MONO, color: TEXT }}>+1.0</span>{" "}
              в момент контакта с целью, ровно один раз за эпизод, дальше{" "}
              <span style={{ fontFamily: MONO, color: TEXT }}>EndEpisode()</span>.
            </li>
            <li>
              <span style={{ color: TEXT }}>Time penalty</span>:{" "}
              <span style={{ fontFamily: MONO, color: TEXT }}>−1 / MaxStep</span>{" "}
              каждый шаг (≈ <span style={{ fontFamily: MONO, color: TEXT }}>−0.001</span>{" "}
              при <span style={{ fontFamily: MONO, color: TEXT }}>MaxStep = 1000</span>).
              Гарантирует, что эпизод стоит ≈ −1, если цель не поймана.
            </li>
            <li>
              <span style={{ color: TEXT }}>Collision penalty</span>:{" "}
              <span style={{ fontFamily: MONO, color: TEXT }}>−0.05</span> при
              касании стены или препятствия (без EndEpisode — мягкий сигнал
              «лучше не надо»).
            </li>
          </ul>
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6 }}>
            Правило большого пальца: любая награда между решениями держится в
            диапазоне <span style={{ fontFamily: MONO, color: TEXT }}>[-1, +1]</span>.
            Если внутришаговый сигнал начинает приближаться по модулю к
            терминалу — PPO начнёт оптимизировать процесс, а не результат.
          </p>
        </div>

        {/* Зачем именно PBRS */}
        <div
          className="p-5 rounded-lg space-y-3"
          style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
        >
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            Почему PBRS, а не «−distance» напрямую
          </h3>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Соблазн велик: положить просто{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>r = −d(s)</span> на
            каждом шаге. На словах это «учим Охотника быть ближе к цели». На
            практике это меняет состав оптимальных стратегий — теперь стоять
            рядом с целью выгоднее, чем её догнать и эпизод закрыть.
          </p>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            PBRS-форма{" "}
            <Math display={false}>{"F = \\gamma\\,\\Phi(s') - \\Phi(s)"}</Math>{" "}
            отличается тем, что её сумма по любому замкнутому циклу телескопически
            сходится в ноль: за «кружение» вокруг цели накопить плюсов нельзя.
            При этом «приближение к цели» по-прежнему даёт положительный сигнал —
            ровно тогда, когда оно реально приближение.
          </p>
          <Math>{"\\sum_{t=0}^{T-1} \\gamma^{t}\\, F(s_t, s_{t+1}) = \\gamma^{T}\\Phi(s_T) - \\Phi(s_0)"}</Math>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Формальное обоснование (теорема Ng – Harada – Russell, 1999) и его
            расширения — в хабе:{" "}
            <HubLink
              to="/hub/math-rl"
              anchor="todo-reward-shaping-ng-harada-russell"
              variant="inline"
              fromPath="/courses/project-2"
              fromAnchor="reward-shaping"
              fromLabel="Капстоун · 3D-агент-охотник · Формирование награды"
            >
              reward shaping и теорема Ng – Harada – Russell (TODO-хаб)
            </HubLink>
            .
          </p>
        </div>

        {/* Reward hacking — 3 кейса */}
        <div
          className="p-5 rounded-lg space-y-3"
          style={{ border: `1px solid ${BORDER}`, background: "rgba(217,70,239,0.04)" }}
        >
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            Как ломается Охотник: 3 классических reward hacks
          </h3>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Это не теоретические страшилки — каждый из этих провалов появляется
            на реальных кривых TensorBoard за первые 200–500к шагов, если
            ошибиться в reward shaping.
          </p>

          <div className="overflow-x-auto">
            <table
              className="w-full text-left"
              style={{ borderCollapse: "separate", borderSpacing: 0 }}
            >
              <thead>
                <tr>
                  {["Hack", "Симптом", "Причина", "Контрмера"].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2"
                      style={{
                        fontFamily: ORBITRON,
                        color: MAGENTA,
                        fontSize: 12,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        borderBottom: `1px solid ${BORDER}`,
                        background: "rgba(217,70,239,0.06)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    h: "Кружение у цели",
                    s: "Reward растёт, поимок мало; в редакторе видно карусель вокруг target.",
                    c: "Награда вида r = −d (без PBRS) даёт плюсы за то, что Охотник просто рядом, не приближаясь по существу. Классический «велосипед» Ng/Harada/Russell 1999 (цит. Weng 2024).",
                    m: "Переписать dense-часть в PBRS: F = γΦ(s′) − Φ(s). Сумма по циклу = 0 → за кружение плюсов нет.",
                  },
                  {
                    h: "Зависание у цели без поимки",
                    s: "Reward на плато ≈ +0.7, но episode length упирается в MaxStep, catches/ep ≈ 0.",
                    c: "Terminal bonus слишком мал относительно накопленного PBRS, либо радиус поимки слишком жёсткий, либо нет time penalty — стоять выгоднее, чем рисковать броском.",
                    m: "Поднять terminal до +1.0, уменьшить радиус контакта до ≈ 1.0 м, добавить −1/MaxStep на шаг.",
                  },
                  {
                    h: "Эксплойт стен",
                    s: "Охотник трётся об стену, value loss «качает», иногда телепортируется через угол.",
                    c: "Нет штрафа за столкновение → политика обнаруживает, что вдоль стены физика толкает его «по диагонали» быстрее, чем в открытом поле; или баг коллайдера.",
                    m: "Collision penalty −0.05 на касание Wall/Obstacle + жёсткий reset при выходе за арену; перепроверить колайдеры в Prefab TrainingArea.",
                  },
                ].map((row) => (
                  <tr key={row.h}>
                    <td
                      className="px-3 py-2 align-top"
                      style={{
                        fontFamily: ORBITRON,
                        color: TEXT,
                        fontSize: 13,
                        letterSpacing: "0.03em",
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      {row.h}
                    </td>
                    <td
                      className="px-3 py-2 align-top"
                      style={{
                        color: DIM,
                        fontSize: 14,
                        lineHeight: 1.6,
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      {row.s}
                    </td>
                    <td
                      className="px-3 py-2 align-top"
                      style={{
                        color: DIM,
                        fontSize: 14,
                        lineHeight: 1.6,
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      {row.c}
                    </td>
                    <td
                      className="px-3 py-2 align-top"
                      style={{
                        color: TEXT,
                        fontSize: 14,
                        lineHeight: 1.6,
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      {row.m}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Эти три кейса — частные случаи общей проблемы reward misspecification
            и закона Гудхарта применительно к RL: формальный разбор и каталог
            других провалов — в хабе:{" "}
            <HubLink
              to="/hub/math-rl"
              anchor="todo-reward-misspecification-goodhart"
              variant="inline"
              fromPath="/courses/project-2"
              fromAnchor="reward-shaping"
              fromLabel="Капстоун · 3D-агент-охотник · Формирование награды"
            >
              reward misspecification и закон Гудхарта (TODO-хаб)
            </HubLink>
            .
          </p>
        </div>

        <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6 }}>
          Покрутить эти компоненты руками и увидеть поведение Охотника можно
          будет в разделе «Песочница награды» — там же появится интерактивный
          разбор кривых TensorBoard для каждого из трёх hack-кейсов.
        </p>
      </section>

      {/* ── Секция: Параллельные среды (наполнено) ────────────────────────── */}
      <section
        id="parallel-envs"
        className="scroll-mt-28 p-6 md:p-8 rounded-xl backdrop-blur-sm space-y-6"
        style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
      >
        <SectionHeading>Параллельные среды</SectionHeading>
        <p style={{ color: DIM, fontSize: 15, lineHeight: 1.7 }}>
          У PPO нет replay buffer — он учится на свежесобранном rollout. Значит,
          единственный честный способ ускориться — собирать опыт от десятков
          Охотников одновременно. В ML-Agents для этого есть два независимых
          механизма, которые можно комбинировать. Здесь — что и когда выбирать,
          и почему «×8 сред ≠ ×8 быстрее».
        </p>

        {/* Два механизма */}
        <div className="grid md:grid-cols-2 gap-3">
          <div
            className="p-5 rounded-lg space-y-3"
            style={{ border: `1px solid ${BORDER}`, background: "rgba(0,255,214,0.03)" }}
          >
            <h3
              style={{ fontFamily: ORBITRON, color: CYAN, fontSize: 15, letterSpacing: "0.04em" }}
            >
              TrainingAreaReplicator
            </h3>
            <p style={{ color: DIM, fontSize: 14, lineHeight: 1.6 }}>
              Компонент, который при старте сцены клонирует Prefab{" "}
              <span style={{ fontFamily: MONO, color: TEXT }}>TrainingArea</span>{" "}
              в решётку <span style={{ fontFamily: MONO, color: TEXT }}>N × N</span>{" "}
              со сдвигом по{" "}
              <span style={{ fontFamily: MONO, color: TEXT }}>separation</span>.
              Все клоны живут <span style={{ color: TEXT }}>в одной</span>{" "}
              Unity-сцене и в одном процессе.
            </p>
            <ul className="space-y-1 list-disc pl-5" style={{ color: DIM, fontSize: 13, lineHeight: 1.6 }}>
              <li>Типично 8–16 арен на сцену.</li>
              <li>Один Behavior, один общий буфер → стабильный градиент.</li>
              <li>Дешевле всего по CPU/GPU overhead.</li>
            </ul>
          </div>
          <div
            className="p-5 rounded-lg space-y-3"
            style={{ border: `1px solid ${BORDER}`, background: "rgba(217,70,239,0.03)" }}
          >
            <h3
              style={{ fontFamily: ORBITRON, color: MAGENTA, fontSize: 15, letterSpacing: "0.04em" }}
            >
              --num-envs
            </h3>
            <p style={{ color: DIM, fontSize: 14, lineHeight: 1.6 }}>
              CLI-флаг{" "}
              <span style={{ fontFamily: MONO, color: TEXT }}>mlagents-learn</span>,
              запускающий <span style={{ color: TEXT }}>несколько копий билда</span>{" "}
              как отдельные процессы (через unique{" "}
              <span style={{ fontFamily: MONO, color: TEXT }}>--base-port</span>).
            </p>
            <ul className="space-y-1 list-disc pl-5" style={{ color: DIM, fontSize: 13, lineHeight: 1.6 }}>
              <li>Типично 2–4 процесса.</li>
              <li>Полезно, когда внутри сцены упёрлись в физику/рендер.</li>
              <li>Дороже по памяти; не работает с Unity Editor — только билды.</li>
            </ul>
          </div>
        </div>

        <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
          На практике для Охотника берём{" "}
          <span style={{ fontFamily: MONO, color: TEXT }}>TrainingAreaReplicator 4×4</span>{" "}
          (16 арен в одной сцене) и при необходимости добавляем{" "}
          <span style={{ fontFamily: MONO, color: TEXT }}>--num-envs=2</span> —
          получается ≈ 32 одновременных Охотника, отправляющих опыт в один и
          тот же общий буфер.
        </p>

        {/* Общий Behavior и буфер */}
        <div
          className="p-5 rounded-lg space-y-3"
          style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
        >
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            Один Behavior, один буфер, один градиент
          </h3>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Ключевое условие — у всех клонов одинаковый{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>Behavior Name = Hunter</span>.
            Тогда trainer воспринимает их как один Охотник, который умудряется
            одновременно бегать в 16 разных арен. Опыт из всех арен льётся в
            общий <span style={{ fontFamily: MONO, color: TEXT }}>buffer_size</span>,
            и PPO делает один шаг градиента по объединённому батчу.
          </p>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Это даёт более стабильную оценку градиента (больше независимых
            эпизодов на один update) и убирает корреляцию внутри одной арены —
            именно поэтому параллелизм в PPO работает не только «для скорости»,
            но и улучшает качество обучения. Важно: суммарный бюджет{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>max_steps</span>{" "}
            считается по всем агентам вместе, а не на каждого.
          </p>
        </div>

        {/* Сублинейный speedup */}
        <div
          className="p-5 rounded-lg space-y-3"
          style={{ border: `1px solid ${BORDER}`, background: "rgba(0,255,214,0.03)" }}
        >
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            Почему 8 сред — это не ×8
          </h3>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Главное практическое разочарование новичков: добавили 8 арен,
            ждут ×8 ускорения, получают примерно{" "}
            <span style={{ fontFamily: MONO, color: TEXT, fontSize: 17 }}>×2</span>{" "}
            (типичный отчёт с Unity Discussions). Это не баг — это нормальная
            физика загрузки:
          </p>
          <ul className="space-y-2 list-disc pl-5" style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            <li>
              Физика и рендер сцены масштабируются сублинейно: 16 арен в одной
              сцене не дают 16× больше FPS по сравнению с одной.
            </li>
            <li>
              Bottleneck смещается с rollout на сам PPO update — больше данных
              на батч, дольше шаг градиента, GPU начинает блокировать сбор.
            </li>
            <li>
              Каждый дополнительный <span style={{ fontFamily: MONO, color: TEXT }}>--num-envs</span>{" "}
              — это отдельный процесс Unity с собственным рендером, ассетами и
              IPC до trainer'а.
            </li>
          </ul>
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6 }}>
            Полезное правило: удваивайте число арен, пока в TensorBoard кривая{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>Environment/Cumulative Reward</span>{" "}
            по «шагам в секунду» растёт. Как только она вышла на плато —
            дальше клонировать смысла нет, упёрлись либо в физику, либо в GPU.
          </p>
        </div>

        {/* Pitfall #6068 */}
        <div
          className="p-5 rounded-lg space-y-3"
          style={{
            border: `1px solid rgba(217,70,239,0.3)`,
            background: "rgba(217,70,239,0.04)",
          }}
        >
          <h3
            style={{ fontFamily: ORBITRON, color: MAGENTA, fontSize: 15, letterSpacing: "0.04em" }}
          >
            ⚠ Известный pitfall — Issue #6068
          </h3>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            В Unity ML-Agents открыт{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>Issue #6068</span>:{" "}
            при некоторых сочетаниях{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>num-areas</span> и{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>--num-envs</span>{" "}
            тренер может «зависнуть» при сборе rollout — особенно когда один из
            процессов медленнее остальных и затягивает синхронизацию буфера.
          </p>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Безопасный сетап для Охотника на 2026 год: TrainingAreaReplicator до
            16, плюс <span style={{ fontFamily: MONO, color: TEXT }}>--num-envs ≤ 4</span>,
            и не смешивать разные размеры арен между процессами. Если кривые
            обучения внезапно «замораживаются» — первым делом откатывайте{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>--num-envs</span> к 1.
          </p>
        </div>

        {/* HubLink: on-policy vs off-policy */}
        <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
          Почему PPO принципиально нуждается в свежем опыте от всех этих
          параллельных Охотников и не может, как SAC, переиспользовать старый
          replay buffer — это вопрос on-policy vs off-policy и importance
          sampling:
        </p>
        <Math>{"r_t(\\theta) = \\dfrac{\\pi_{\\theta}(a_t \\mid s_t)}{\\pi_{\\theta_{\\mathrm{old}}}(a_t \\mid s_t)}"}</Math>
        <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
          Формальный разбор — в хабе:{" "}
          <HubLink
            to="/hub/math-rl"
            anchor="todo-on-policy-vs-off-policy"
            variant="inline"
            fromPath="/courses/project-2"
            fromAnchor="parallel-envs"
            fromLabel="Капстоун · 3D-агент-охотник · Параллельные среды"
          >
            on-policy vs off-policy и importance sampling (TODO-хаб)
          </HubLink>
          .
        </p>
      </section>

      {/* ── Секция: Мониторинг обучения (наполнено) ───────────────────────── */}
      <section
        id="training-monitoring"
        className="scroll-mt-28 p-6 md:p-8 rounded-xl backdrop-blur-sm space-y-6"
        style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
      >
        <SectionHeading>Мониторинг обучения</SectionHeading>
        <p style={{ color: DIM, fontSize: 15, lineHeight: 1.7 }}>
          Без TensorBoard капстоун превращается в гадание. Здесь — минимальный
          набор метрик, которые нужно открыть прямо перед запуском{" "}
          <span style={{ fontFamily: MONO, color: TEXT }}>mlagents-learn</span>,
          и диагностический чек-лист «симптом → действие», который покрывает
          90% реальных проблем Охотника.
        </p>

        {/* Ключевые метрики */}
        <div
          className="p-5 rounded-lg space-y-3"
          style={{ border: `1px solid ${BORDER}`, background: "rgba(0,255,214,0.03)" }}
        >
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            5 метрик, на которые смотрим всегда
          </h3>
          <ul className="space-y-3 list-disc pl-5" style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            <li>
              <span style={{ fontFamily: MONO, color: CYAN }}>Environment/Cumulative Reward</span>{" "}
              — суммарная награда за эпизод, усреднённая по агентам. Здоровая
              картинка: монотонно растёт, затем выходит на плато около{" "}
              <span style={{ fontFamily: MONO, color: TEXT }}>+1</span> (terminal
              почти всегда достигается). Если плато ≪ 1 — Охотник в основном не
              доходит до цели.
            </li>
            <li>
              <span style={{ fontFamily: MONO, color: CYAN }}>Environment/Episode Length</span>{" "}
              — средняя длина эпизода в шагах. Здоровая динамика:{" "}
              <span style={{ color: TEXT }}>падает</span> по мере обучения (ловит
              быстрее). Плоская линия у{" "}
              <span style={{ fontFamily: MONO, color: TEXT }}>MaxStep</span> —
              эпизоды закрываются по таймеру, не по поимке.
            </li>
            <li>
              <span style={{ fontFamily: MONO, color: CYAN }}>Policy/Entropy</span>{" "}
              — энтропия гауссовой политики. Здоровая динамика: плавно убывает
              от ≈ 1.4 (рандом) к небольшому положительному значению. Резкое
              падение — ранний коллапс эксплорейшна; рост — нестабильность
              (часто отсутствие <span style={{ fontFamily: MONO, color: TEXT }}>Mathf.Clamp</span>).
            </li>
            <li>
              <span style={{ fontFamily: MONO, color: CYAN }}>Policy/Value Estimate</span>{" "}
              — то, что предсказывает critic для типичных стартовых состояний.
              Должно расти параллельно Cumulative Reward. Сильное отставание =
              critic не успевает за actor.
            </li>
            <li>
              <span style={{ fontFamily: MONO, color: CYAN }}>Losses/Policy Loss</span>{" "}
              и{" "}
              <span style={{ fontFamily: MONO, color: CYAN }}>Losses/Value Loss</span>{" "}
              — должны постепенно уменьшаться и стабилизироваться. Резкие
              всплески value loss — обычно симптом проблем с нормализацией
              наблюдений или взорвавшейся PBRS-наградой.
            </li>
          </ul>
        </div>

        {/* Чек-лист C.4 */}
        <div
          className="p-5 rounded-lg space-y-3"
          style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
        >
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            Диагностический чек-лист
          </h3>
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6 }}>
            Источник — раздел C.4 research-артефакта. Читать слева направо:
            увидели симптом → проверяете названную метрику → ищете причину →
            применяете действие.
          </p>
          <div className="overflow-x-auto">
            <table
              className="w-full text-left"
              style={{ borderCollapse: "separate", borderSpacing: 0 }}
            >
              <thead>
                <tr>
                  {["Симптом", "Метрика", "Причина", "Действие"].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2"
                      style={{
                        fontFamily: ORBITRON,
                        color: CYAN,
                        fontSize: 12,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        borderBottom: `1px solid ${BORDER}`,
                        background: "rgba(0,255,214,0.04)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    s: "Reward плоский около нуля",
                    m: "Cumulative Reward",
                    c: "Сигнал слишком слабый или негативный baseline; Охотник не находит цель случайно.",
                    a: "Поднять terminal bonus до +1.0, проверить, что PBRS-Φ направлена к цели, уменьшить размер арены на 30%.",
                  },
                  {
                    s: "Reward растёт, Episode Length не падает",
                    m: "Cumulative Reward ↑ + Episode Length ≈ const",
                    c: "Reward hacking: Охотник набирает плюсы процессом (кружение, зависание), а не результатом.",
                    a: "Переписать dense-награду в PBRS-форму (см. раздел «Формирование награды» этого урока).",
                  },
                  {
                    s: "Entropy резко падает в начале",
                    m: "Policy/Entropy",
                    c: "Коллапс эксплорейшна: политика «защёлкивается» на одной стратегии раньше, чем нашла хорошую.",
                    a: "Увеличить beta до 1e-2, проверить нормализацию фич, уменьшить learning_rate.",
                  },
                  {
                    s: "Entropy растёт вместо падения",
                    m: "Policy/Entropy",
                    c: "Гауссова политика выдаёт хвостовые семплы за пределами [-1, +1].",
                    a: "Добавить Mathf.Clamp в OnActionReceived (раздел «Непрерывное управление»).",
                  },
                  {
                    s: "Value Loss с большими спайками",
                    m: "Losses/Value Loss",
                    c: "Награды слишком большие по модулю, либо наблюдения не нормированы.",
                    a: "Удержать reward в [-1, +1]; в hunter.yaml поставить normalize: true; нормировать фичи в [-1, 1].",
                  },
                  {
                    s: "Reward хорошо, но в Inference агент странный",
                    m: "Mean Reward (post-export)",
                    c: "Hunter.onnx экспортирован с другим набором фич или без normalize-статистик.",
                    a: "Пересобрать билд после export, сверить порядок ObservationSpec, проверить opset_version (9 или 11).",
                  },
                ].map((row) => (
                  <tr key={row.s}>
                    <td
                      className="px-3 py-2 align-top"
                      style={{
                        color: TEXT,
                        fontSize: 14,
                        lineHeight: 1.6,
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      {row.s}
                    </td>
                    <td
                      className="px-3 py-2 align-top"
                      style={{
                        fontFamily: MONO,
                        color: CYAN,
                        fontSize: 13,
                        lineHeight: 1.5,
                        borderBottom: `1px solid ${BORDER}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.m}
                    </td>
                    <td
                      className="px-3 py-2 align-top"
                      style={{
                        color: DIM,
                        fontSize: 14,
                        lineHeight: 1.6,
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      {row.c}
                    </td>
                    <td
                      className="px-3 py-2 align-top"
                      style={{
                        color: DIM,
                        fontSize: 14,
                        lineHeight: 1.6,
                        borderBottom: `1px solid ${BORDER}`,
                      }}
                    >
                      {row.a}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reward hacking pattern — внутренняя ссылка на раздел "Формирование награды" */}
        <div
          className="p-5 rounded-lg space-y-3"
          style={{
            border: `1px solid rgba(217,70,239,0.3)`,
            background: "rgba(217,70,239,0.04)",
          }}
        >
          <h3
            style={{ fontFamily: ORBITRON, color: MAGENTA, fontSize: 15, letterSpacing: "0.04em" }}
          >
            ⚠ Сигнатурный паттерн: reward hacking
          </h3>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Если в TensorBoard{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>Cumulative Reward</span>{" "}
            устойчиво растёт, а{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>Episode Length</span>{" "}
            остаётся на уровне <span style={{ fontFamily: MONO, color: TEXT }}>MaxStep</span> —
            это <span style={{ color: TEXT }}>не</span> успех. Это означает, что
            Охотник нашёл способ копить плюсы, не закрывая эпизод поимкой.
            Классический сценарий — кружение у цели или зависание рядом с ней.
          </p>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Единственное надёжное лечение — переход на potential-based shaping:{" "}
            <a
              href="#reward-shaping"
              style={{
                color: CYAN,
                borderBottom: `1px dashed ${CYAN}66`,
                textDecoration: "none",
                fontFamily: MONO,
                fontSize: 13,
              }}
            >
              ↑ раздел «Формирование награды»
            </a>{" "}
            этого урока, подкарточка «Почему PBRS, а не −distance напрямую».
          </p>
        </div>
      </section>

      {/* ── Секция: Рабочие артефакты (наполнено) ─────────────────────────── */}
      <section
        id="working-artifacts"
        className="scroll-mt-28 p-6 md:p-8 rounded-xl backdrop-blur-sm space-y-6"
        style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
      >
        <SectionHeading>Рабочие артефакты</SectionHeading>
        <p style={{ color: DIM, fontSize: 15, lineHeight: 1.7 }}>
          Три файла, без которых капстоун не запустится:{" "}
          <span style={{ fontFamily: MONO, color: TEXT }}>hunter.yaml</span> для
          trainer'а, <span style={{ fontFamily: MONO, color: TEXT }}>HunterAgent.cs</span>{" "}
          с reward-функцией внутри Unity, и схема параллелизма, по которой
          собирается опыт. Здесь — полные тексты и визуальная карта потока.
        </p>

        {/* C.1 hunter.yaml */}
        <div className="space-y-3">
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            C.1 · hunter.yaml
          </h3>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.6 }}>
            Конфиг trainer'а для ML-Agents Release 23. Совпадает с таблицей из
            раздела «PPO и гиперпараметры»; здесь — рабочий вид, который можно
            скопировать в проект как есть.
          </p>
          <CyberCodeBlock language="pseudo" filename="config/hunter.yaml">
{`behaviors:
  Hunter:
    trainer_type: ppo

    hyperparameters:
      batch_size:      2048      # PPO mini-batch; для continuous control — нижняя граница
      buffer_size:     20480     # 10x batch_size; rollout перед update
      learning_rate:   3.0e-4    # Adam step
      beta:            5.0e-3    # энтропийный бонус (защита от ранней сходимости)
      epsilon:         0.2       # радиус clip в L^CLIP
      lambd:           0.95      # λ для GAE (bias / variance trade-off)
      num_epoch:       3         # сколько раз PPO проходит по буферу
      learning_rate_schedule: linear

    network_settings:
      normalize:       true      # running mean/std для входов (важно для нормализации фич)
      hidden_units:    128
      num_layers:      2
      vis_encode_type: simple

    reward_signals:
      extrinsic:
        gamma:         0.99      # дисконт; сумма Σγ^k r сходится при γ < 1
        strength:      1.0

    keep_checkpoints: 5
    max_steps:        2.0e6     # суммарный бюджет шагов по ВСЕМ агентам
    time_horizon:     128       # горизонт обрезки отдачи для GAE
    summary_freq:     10000     # как часто писать в TensorBoard`}
          </CyberCodeBlock>
        </div>

        {/* C.2 HunterAgent.cs */}
        <div className="space-y-3">
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            C.2 · HunterAgent.cs — reward function (псевдокод)
          </h3>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.6 }}>
            Скелет <span style={{ fontFamily: MONO, color: TEXT }}>OnActionReceived</span>{" "}
            с PBRS-shaping. <span style={{ color: TEXT }}>Mathf.Clamp обязателен</span>:
            ML-Agents PPO использует un-squashed гауссиану и формально не
            гарантирует <span style={{ fontFamily: MONO, color: TEXT }}>[-1, +1]</span>.
            Из этих rewards PPO собирает clipped surrogate objective:
          </p>
          <Math>{"L^{\\mathrm{CLIP}}(\\theta) = \\hat{\\mathbb{E}}_t\\!\\left[\\min\\!\\big(r_t(\\theta)\\hat{A}_t,\\ \\operatorname{clip}(r_t(\\theta), 1-\\varepsilon, 1+\\varepsilon)\\hat{A}_t\\big)\\right]"}</Math>
          <CyberCodeBlock language="csharp" filename="HunterAgent.cs">
{`public class HunterAgent : Agent
{
    public Transform target;
    public float maxDist = 28f;       // диагональ арены 20×20
    private Rigidbody rb;
    private float prevPotential;

    public override void OnEpisodeBegin()
    {
        // респавн агента и цели в случайные точки арены
        ResetAgentAndTarget();
        rb.linearVelocity = Vector3.zero;
        prevPotential = -Distance() / maxDist;   // Φ(s_0)
    }

    public override void CollectObservations(VectorSensor sensor)
    {
        // 10–12 нормированных фич в [-1, +1] (см. раздел «Среда и наблюдения»)
        sensor.AddObservation(NormalizedDeltaToTarget());
        sensor.AddObservation(NormalizedVelocity());
        sensor.AddObservation(NormalizedYaw());
        // RayPerceptionSensorComponent3D подключается отдельным компонентом
    }

    public override void OnActionReceived(ActionBuffers actions)
    {
        // ── ОБЯЗАТЕЛЬНЫЙ clamp: ML-Agents PPO без tanh-squashing ───────────
        float thrust = Mathf.Clamp(actions.ContinuousActions[0], -1f, 1f);
        float yaw    = Mathf.Clamp(actions.ContinuousActions[1], -1f, 1f);

        ApplyMovement(thrust, yaw);

        // ── Reward: PBRS + time penalty + terminal + collision (см. секцию «Формирование награды») ──
        float phi = -Distance() / maxDist;                       // Φ(s′)
        float shaping = 0.99f * phi - prevPotential;             // F = γΦ(s′) − Φ(s)
        prevPotential = phi;

        AddReward(shaping);
        AddReward(-1f / MaxStep);                                // time penalty

        if (Distance() < 1.0f)
        {
            AddReward(+1.0f);                                    // terminal catch
            EndEpisode();
        }
    }

    void OnCollisionEnter(Collision c)
    {
        if (c.gameObject.CompareTag("Wall") || c.gameObject.CompareTag("Obstacle"))
            AddReward(-0.05f);                                   // collision penalty (мягкий)
    }
}`}
          </CyberCodeBlock>
        </div>

        {/* C.3 Схема параллелизма */}
        <div className="space-y-3">
          <h3
            style={{ fontFamily: ORBITRON, color: TEXT, fontSize: 16, letterSpacing: "0.04em" }}
          >
            C.3 · Схема параллелизма
          </h3>
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.6 }}>
            Как именно опыт от десятков Охотников собирается в один градиентный
            шаг PPO. Сплошные cyan-стрелки — поток опыта, пунктирная — обратное
            обновление политики, magenta-блок снизу — опциональные{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>--num-envs</span>{" "}
            процессы.
          </p>
          <div
            className="p-4 rounded-lg"
            style={{ border: `1px solid ${BORDER}`, background: "rgba(0,0,0,0.25)" }}
          >
            <HunterParallelismDiagram />
          </div>
          <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6 }}>
            Подробности по выбору{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>TrainingAreaReplicator</span>{" "}
            vs <span style={{ fontFamily: MONO, color: TEXT }}>--num-envs</span>{" "}
            и про сублинейный speedup — в разделе{" "}
            <a
              href="#parallel-envs"
              style={{
                color: CYAN,
                borderBottom: `1px dashed ${CYAN}66`,
                textDecoration: "none",
                fontFamily: MONO,
                fontSize: 13,
              }}
            >
              ↑ «Параллельные среды»
            </a>
            .
          </p>
        </div>
      </section>

      {/* ── Прочие пустые секции-якоря под будущий контент ────────────────── */}
      <section className="space-y-6">
        {SECTIONS.filter(
          (s) =>
            s.id !== "env-observations" &&
            s.id !== "continuous-control" &&
            s.id !== "ppo-hyperparams" &&
            s.id !== "reward-shaping" &&
            s.id !== "parallel-envs" &&
            s.id !== "training-monitoring" &&
            s.id !== "working-artifacts",
        ).map((s) => (
          <section
            key={s.id}
            id={s.id}
            className="scroll-mt-28 p-6 rounded-xl backdrop-blur-sm"
            style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
          >
            <SectionHeading>{s.title}</SectionHeading>
            <p
              className="mt-3"
              style={{ color: DIM, fontSize: 14, lineHeight: 1.6 }}
            >
              {s.lead}
            </p>
            <p
              className="mt-3"
              style={{
                color: MUTED,
                fontSize: 12,
                fontFamily: MONO,
                letterSpacing: "0.04em",
              }}
            >
              # id: <span style={{ color: MAGENTA }}>{s.id}</span> · содержимое
              будет добавлено следующим промптом
            </p>
          </section>
        ))}
      </section>
    </div>
  );

  return (
    <LessonLayout
      lessonId="project-2"
      lessonTitle="3D-агент-охотник в Unity"
      lessonNumber="П2"
      duration="90–120 мин"
      tags={["#project", "#unity", "#ppo", "#capstone"]}
      level={2}
      prevLesson={{ path: "/courses/2-6", title: "TensorBoard и W&B" }}
      nextLesson={{ path: "/courses/project-3", title: "Проект 3" }}
    >
      <ProGate preview={preview}>{preview}</ProGate>
    </LessonLayout>
  );
};

export default CourseProject2;
