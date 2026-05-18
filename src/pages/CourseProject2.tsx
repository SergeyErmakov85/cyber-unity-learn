import LessonLayout from "@/components/LessonLayout";
import ProGate from "@/components/ProGate";
import HubLink from "@/components/math-rl/HubLink";

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
          <p style={{ color: DIM, fontSize: 14, lineHeight: 1.7 }}>
            Все векторные фичи нормализуем в{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>[-1, 1]</span>:
            позиции делим на полудиагональ арены, скорости — на максимальный
            модуль, углы — на π. Это не косметика — без нормализации PPO с{" "}
            <span style={{ fontFamily: MONO, color: TEXT }}>normalize: true</span>{" "}
            всё равно работает, но статистики «разъезжаются» дольше, и кривая
            энтропии в TensorBoard выглядит рваной.
          </p>
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

      {/* ── Прочие пустые секции-якоря под будущий контент ────────────────── */}
      <section className="space-y-6">
        {SECTIONS.filter((s) => s.id !== "env-observations").map((s) => (
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
