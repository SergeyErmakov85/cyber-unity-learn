import LessonLayout from "@/components/LessonLayout";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import Quiz from "@/components/Quiz";
import GammaSlider from "@/components/GammaSlider";
import MiniGridWorld from "@/components/MiniGridWorld";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Lightbulb,
  Brain,
  Target,
  Eye,
  Gift,
  Gamepad2,
  Rocket,
  Trophy,
  GraduationCap,
  Search,
  Shuffle,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import rlCycleImg from "@/assets/Reinforcement learning cycle infographic.png";

const rlCycleSteps = [
  { label: "Агент", sub: "принимает решение", icon: Brain, color: "text-primary" },
  { label: "Действие", sub: "выполняет action", icon: Target, color: "text-secondary" },
  { label: "Среда", sub: "изменяет состояние", icon: Gamepad2, color: "text-accent" },
  { label: "Наблюдение", sub: "новое состояние + награда", icon: Eye, color: "text-green-400" },
];

const quizQuestions = [
  {
    question: "Какой тип машинного обучения использует функцию награды для обучения агента?",
    options: [
      "Supervised Learning",
      "Unsupervised Learning",
      "Reinforcement Learning",
      "Semi-supervised Learning",
    ],
    correctIndex: 2,
    explanation:
      "Reinforcement Learning — единственная парадигма, где агент учится через взаимодействие со средой и получение наград (reward signal). В Supervised Learning используются размеченные данные, в Unsupervised — неразмеченные.",
  },
  {
    question: "Что такое MDP в контексте RL?",
    options: [
      "Multi-Dimensional Programming",
      "Markov Decision Process",
      "Maximum Data Processing",
      "Minimum Distance Protocol",
    ],
    correctIndex: 1,
    explanation:
      "Markov Decision Process (Марковский процесс принятия решений) — математическая модель, формализующая задачу RL. Она описывается кортежем (S, A, T, R, γ) и основана на свойстве Маркова: будущее зависит только от текущего состояния.",
  },
  {
    question: "Что определяет параметр γ (gamma) в RL?",
    options: [
      "Скорость обучения",
      "Размер батча",
      "Дисконтирование будущих наград",
      "Количество эпизодов",
    ],
    correctIndex: 2,
    explanation:
      "Gamma (γ) определяет, насколько агент «дальновиден». При γ=0 агент заботится только о мгновенной награде, при γ→1 — учитывает далёкое будущее. Формула: G_t = R_{t+1} + γ·R_{t+2} + γ²·R_{t+3} + …",
  },
  {
    question: "Какой компонент MDP описывает вероятность перехода между состояниями?",
    options: [
      "Policy (π)",
      "Reward function (R)",
      "Transition function (T)",
      "Value function (V)",
    ],
    correctIndex: 2,
    explanation:
      "Transition function T(s'|s,a) определяет вероятность перехода в состояние s' при действии a в состоянии s. Именно она задаёт динамику среды. Policy (π) — стратегия агента, а не часть MDP.",
  },
];

const CourseLesson1_1 = () => {
  return (
    <LessonLayout
      lessonId="1-1"
      lessonTitle="Что такое обучение с подкреплением?"
      lessonNumber="1.1"
      duration="25 мин"
      tags={["#theory", "#basics"]}
      nextLesson={{ path: "/courses/1-2", title: "Установка окружения" }}
      keyConcepts={[
        "Чем RL отличается от других видов машинного обучения",
        "Как работает цикл «агент — среда — награда»",
        "Что такое MDP и зачем он нужен",
        "Ключевые термины: policy, value function, reward signal",
        "Дилемма exploration vs exploitation",
      ]}
    >
      {/* ── 1. Мотивация ────────────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Rocket className="w-6 h-6 text-primary" />
          Зачем учить Reinforcement Learning?
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Reinforcement Learning (обучение с подкреплением) — одна из самых захватывающих
          областей искусственного интеллекта. Именно благодаря RL произошли прорывы, которые
          казались невозможными ещё несколько лет назад:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              year: "2016",
              title: "AlphaGo → Go",
              desc: "DeepMind обучил RL-агента, который впервые в истории победил чемпиона мира по Го — игре, где вариантов больше, чем атомов во Вселенной.",
              icon: Trophy,
              color: "text-yellow-400",
            },
            {
              year: "2019",
              title: "OpenAI Five → Dota 2",
              desc: "Команда из 5 RL-агентов победила профессиональных игроков в Dota 2, координируя стратегию в реальном времени.",
              icon: Gamepad2,
              color: "text-purple-400",
            },
            {
              year: "2023",
              title: "ChatGPT → RLHF",
              desc: "ChatGPT обучается с помощью RLHF (RL from Human Feedback) — именно RL делает языковую модель полезной и безопасной.",
              icon: Brain,
              color: "text-blue-400",
            },
            {
              year: "Unity",
              title: "Игровые NPC",
              desc: "ML-Agents позволяет обучать NPC в Unity-играх адаптивному поведению — от навигации до сложных стратегий.",
              icon: Rocket,
              color: "text-green-400",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-3 items-start p-4 rounded-lg bg-card/40 border border-border/30 hover:border-primary/30 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-primary/70">{item.year}</span>
                  <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground leading-relaxed mt-4">
          В этом уроке мы разберём, что стоит за всеми этими достижениями — основные
          концепции обучения с подкреплением.
        </p>
      </section>

      {/* ── 2. Аналогия с собакой (перенесена выше) ───── */}
      <section>
        <Card className="bg-card/40 border-primary/20">
          <CardContent className="p-6 flex gap-4 items-start">
            <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-bold text-foreground">
                Интуитивная аналогия: дрессировка собаки 🐕
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Представьте, что вы дрессируете собаку. Собака — это{" "}
                <strong className="text-primary">агент</strong>. Комната — это{" "}
                <strong className="text-accent">среда</strong>. Команда «сидеть» —{" "}
                <strong className="text-secondary">действие</strong>. Лакомство —{" "}
                <strong className="text-green-400">награда</strong>.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Собака пробует разные действия. Когда она садится по команде, получает
                лакомство (+reward). Когда игнорирует — не получает ничего (0 reward). Со
                временем собака учится: выполнение команды → лакомство. Это и есть обучение с
                подкреплением!
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Запомните эту аналогию — дальше мы формализуем её в виде математической
                модели, но суть останется той же:{" "}
                <strong className="text-foreground">
                  агент учится через пробы и ошибки, получая обратную связь от среды
                </strong>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── 3. Три парадигмы ML (с иконками) ─────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Место RL в машинном обучении
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Машинное обучение делится на три основных парадигмы. Каждая решает задачи по-своему:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            {
              title: "Supervised Learning",
              desc: "Учитель даёт правильные ответы. Модель учится на размеченных данных.",
              example: "Классификация изображений, перевод текста",
              icon: GraduationCap,
              active: false,
            },
            {
              title: "Unsupervised Learning",
              desc: "Нет правильных ответов. Модель ищет скрытые паттерны в данных.",
              example: "Кластеризация, уменьшение размерности",
              icon: Search,
              active: false,
            },
            {
              title: "Reinforcement Learning",
              desc: "Агент учится методом проб и ошибок, получая награды за действия.",
              example: "Игры, робототехника, навигация",
              icon: Gamepad2,
              active: true,
            },
          ].map((item, i) => (
            <Card
              key={i}
              className={`bg-card/60 backdrop-blur-sm transition-all ${
                item.active
                  ? "border-primary/50 shadow-[0_0_20px_hsl(180_100%_50%/0.15)]"
                  : "border-border/50"
              }`}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      item.active
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-muted/20 border border-border/30"
                    }`}
                  >
                    <item.icon
                      className={`w-4 h-4 ${item.active ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                  <h3
                    className={`font-bold text-sm ${item.active ? "text-primary" : "text-foreground"}`}
                  >
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
                <p className="text-xs text-muted-foreground/70 italic">
                  Пример: {item.example}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 4. Цикл RL (исправленные стрелки + инфографика) */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Цикл обучения с подкреплением
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          В основе RL лежит простой цикл взаимодействия агента со средой. На каждом шаге
          агент наблюдает состояние, выбирает действие, получает награду и переходит в новое
          состояние.
        </p>

        {/* Инфографика цикла обучения с подкреплением */}
        <div className="rounded-xl overflow-hidden border border-border/30 bg-card/20 mb-6">
          <img
            src={rlCycleImg}
            alt="Инфографика цикла обучения с подкреплением"
            className="w-full max-w-2xl mx-auto"
          />
        </div>

        <div className="relative bg-card/40 rounded-xl border border-border/50 p-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0">
            {rlCycleSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 md:gap-0">
                <div className="text-center space-y-3 px-4">
                  <div className="relative mx-auto w-16 h-16">
                    <div
                      className={`absolute inset-0 rounded-full bg-current opacity-10 ${step.color}`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <step.icon className={`w-7 h-7 ${step.color}`} />
                    </div>
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${step.color}`}>{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.sub}</p>
                  </div>
                </div>
                {i < rlCycleSteps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground/40 flex-shrink-0 hidden md:block" />
                )}
                {i < rlCycleSteps.length - 1 && (
                  <div className="text-muted-foreground/40 text-lg md:hidden">↓</div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <div className="px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-xs text-primary">
              ↻ Цикл повторяется каждый временной шаг t
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Exploration vs Exploitation ────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Shuffle className="w-6 h-6 text-secondary" />
          Exploration vs Exploitation
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Одна из фундаментальных дилемм RL — баланс между{" "}
          <strong className="text-primary">исследованием</strong> (exploration) и{" "}
          <strong className="text-secondary">использованием</strong> (exploitation).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card className="bg-card/50 border-primary/20">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <Search className="w-4 h-4" /> Exploration (исследование)
              </h3>
              <p className="text-xs text-muted-foreground">
                Агент пробует новые действия, чтобы узнать больше о среде. Может найти лучшую
                стратегию, но рискует получить меньше награды прямо сейчас.
              </p>
              <p className="text-xs text-muted-foreground/70 italic">
                Аналогия: попробовать новый ресторан — может оказаться лучшим в городе!
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-secondary/20">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-sm text-secondary flex items-center gap-2">
                <Target className="w-4 h-4" /> Exploitation (использование)
              </h3>
              <p className="text-xs text-muted-foreground">
                Агент повторяет действия, которые уже показали хороший результат. Гарантирует
                стабильную награду, но может упустить оптимальную стратегию.
              </p>
              <p className="text-xs text-muted-foreground/70 italic">
                Аналогия: идти в любимый ресторан — вкусно, но что если рядом есть лучше?
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/30 border-border/30">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Почему это важно?</strong> Если агент только
              исследует — он никогда не воспользуется своими знаниями. Если только
              эксплуатирует — застрянет на первом найденном решении, которое может быть далёким
              от оптимального. Всё искусство RL — в правильном балансе.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── 6. Примеры из игр (с визуалами) ──────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Примеры из реальных игр
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              game: "Шахматы (AlphaZero)",
              emoji: "♟️",
              states: "Позиции фигур на доске",
              actions: "Возможные ходы",
              reward: "+1 за победу, -1 за проигрыш",
              gradient: "from-yellow-500/10 to-transparent",
            },
            {
              game: "Atari (DQN)",
              emoji: "👾",
              states: "Пиксели экрана (210×160)",
              actions: "Кнопки джойстика",
              reward: "Очки в игре",
              gradient: "from-purple-500/10 to-transparent",
            },
            {
              game: "Навигация NPC",
              emoji: "🎮",
              states: "Координаты, скорость, препятствия",
              actions: "Направление и скорость движения",
              reward: "+за достижение цели, -за столкновение",
              gradient: "from-green-500/10 to-transparent",
            },
          ].map((ex, i) => (
            <Card key={i} className="bg-card/50 border-border/40 overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${ex.gradient}`} />
              <CardContent className="p-4 space-y-2">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <span className="text-xl">{ex.emoji}</span>
                  {ex.game}
                </h3>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>
                    <span className="text-primary font-medium">S:</span> {ex.states}
                  </p>
                  <p>
                    <span className="text-secondary font-medium">A:</span> {ex.actions}
                  </p>
                  <p>
                    <span className="text-green-400 font-medium">R:</span> {ex.reward}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 7. MDP (с accordion + gamma slider) ──────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Формализм MDP</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          <strong className="text-foreground">
            <CrossLinkToHub
              hubPath="/math-rl/module-5"
              hubAnchor="глава-3-марковские-процессы-принятия-решений-mdp"
              hubTitle="Математика RL — Глава 3: MDP"
            >
              Markov Decision Process (MDP)
            </CrossLinkToHub>
          </strong>{" "}
          — математическая модель принятия решений в условиях неопределённости. MDP задаётся
          кортежем из пяти элементов:
        </p>

        <div className="space-y-3">
          {[
            {
              symbol: "S",
              name: "Состояния (States)",
              desc: "Множество всех возможных состояний среды. Например, позиция фигуры на доске.",
            },
            {
              symbol: "A",
              name: "Действия (Actions)",
              desc: "Множество доступных действий агента. Например, движение вверх, вниз, влево, вправо.",
            },
            {
              symbol: "R",
              name: "Награды (Rewards)",
              desc: "Сигнал обратной связи: R(s, a, s') — числовая оценка перехода.",
            },
            {
              symbol: "T",
              name: "Переходы (Transitions)",
              desc: "T(s'|s,a) — вероятность перехода в состояние s' при действии a в состоянии s.",
            },
            {
              symbol: "γ",
              name: (
                <CrossLinkToHub
                  hubPath="/math-rl/module-1"
                  hubAnchor="4-уравнения-беллмана-и-дисконтирование"
                  hubTitle="Математика RL — Уравнения Беллмана и дисконтирование"
                >
                  Дисконт (Discount)
                </CrossLinkToHub>
              ),
              desc: "γ ∈ [0, 1] — насколько агент ценит будущие награды по сравнению с текущими.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-4 items-start p-3 rounded-lg bg-card/40 border border-border/30"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="font-mono font-bold text-primary text-sm">{item.symbol}</span>
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <CyberCodeBlock language="pseudo" filename="mdp_formalism.txt">
          {`MDP = (S, A, T, R, γ)

# Цель агента: максимизировать суммарную дисконтированную награду
G_t = R_{t+1} + γ·R_{t+2} + γ²·R_{t+3} + ...
    = ∑ γ^k · R_{t+k+1}  where k = 0, 1, 2, ...`}
        </CyberCodeBlock>

        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem
            value="markov"
            className="border-border/30 rounded-lg overflow-hidden bg-card/20"
          >
            <AccordionTrigger className="px-4 text-sm text-muted-foreground hover:text-foreground hover:no-underline">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Подробнее: свойство Маркова
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                <strong className="text-foreground">Свойство Маркова</strong> гласит: будущее
                зависит только от текущего состояния, а не от всей истории. Формально:
              </p>
              <CyberCodeBlock language="pseudo" filename="markov_property.txt">
                {`# Свойство Маркова: будущее зависит только от текущего состояния
P(s_{t+1} | s_t, a_t) = P(s_{t+1} | s_1, a_1, ..., s_t, a_t)`}
              </CyberCodeBlock>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                Это упрощение позволяет эффективно решать задачи RL — нам не нужно помнить всю
                историю, достаточно текущего состояния. В реальных задачах это свойство не
                всегда выполняется строго, но MDP остаётся полезной абстракцией.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-6">
          <GammaSlider />
        </div>
      </section>

      {/* ── 8. Мини-GridWorld ─────────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-accent" />
          Попробуйте сами: Мини-GridWorld
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Теперь, когда вы знаете основные понятия, попробуйте сами! Управляйте агентом с
          помощью стрелок или включите автоигру. Наблюдайте за наградами — каждый шаг стоит
          -1, ловушка -5, а цель приносит +10. Как быстро вы доберётесь до звезды?
        </p>
        <MiniGridWorld />
      </section>

      {/* ── 8.5 Первый код: CartPole ──────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Rocket className="w-6 h-6 text-primary" />
          Первый код: CartPole на Python
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Чтобы цикл «агент — среда — награда» стал осязаемым, запустим минимальную среду{" "}
          <strong className="text-foreground">CartPole-v1</strong> из библиотеки Gymnasium.
          Здесь агент использует случайную политику — это базовая точка отсчёта, от которой
          мы будем двигаться к настоящему обучению в следующих уроках.
        </p>

        <CyberCodeBlock language="python" filename="cartpole_random.py">
{`import gym
import torch

env = gym.make('CartPole-v1')
obs, _ = env.reset(seed=42)

for step in range(200):
    action = env.action_space.sample()  # случайная политика
    obs, reward, done, truncated, info = env.step(action)
    print(f"Шаг {step}: награда={reward:.1f}, done={done}")
    if done or truncated:
        obs, _ = env.reset()
env.close()`}
        </CyberCodeBlock>

        <a
          href="https://colab.research.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20 transition-colors text-sm font-medium"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.941 4.976a7.033 7.033 0 0 0-4.93 2.064 7.033 7.033 0 0 0-.124 9.807l2.395-2.395a3.646 3.646 0 0 1 5.15-5.148l2.397-2.399a7.033 7.033 0 0 0-4.888-1.93z" />
            <path d="M7.074 4.976a7.033 7.033 0 0 0-4.888 1.93l2.397 2.398a3.646 3.646 0 0 1 5.15 5.149l2.395 2.395a7.033 7.033 0 0 0-.124-9.808 7.033 7.033 0 0 0-4.93-2.064z" />
            <path d="M7.074 19.024a7.033 7.033 0 0 0 4.93-2.064l-2.395-2.395a3.646 3.646 0 0 1-5.15-5.149L2.063 7.019A7.033 7.033 0 0 0 7.074 19.024z" />
          </svg>
          Открыть в Google Colab
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </section>

      {/* ── 9. Ключевые концепции ─────────────────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Ключевые концепции</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              term: "Пространство состояний",
              desc: "Множество всех возможных состояний среды S. Определяет, что агент может наблюдать.",
            },
            {
              term: "Пространство действий",
              desc: "Множество всех доступных действий A. Может быть дискретным (кнопки) или непрерывным (угол поворота).",
            },
            {
              term: "Мат. ожидание награды",
              desc: "𝔼[G_t] — среднее значение суммарной дисконтированной награды, которое агент стремится максимизировать.",
            },
            {
              term: "MDP",
              desc: "Математическая модель: состояния, действия, переходы, награды, дисконт.",
            },
            {
              term: "Policy (π)",
              desc: "Стратегия агента: π(a|s) — вероятность выбрать действие a в состоянии s.",
            },
            {
              term: "Value Function (V)",
              desc: (
                <>
                  <CrossLinkToHub
                    hubPath="/math-rl/module-5"
                    hubAnchor="глава-4"
                    hubTitle="Математика RL — Глава 4. Функции ценности"
                  >
                    V(s)
                  </CrossLinkToHub>{" "}
                  — ожидаемая суммарная награда из состояния s при следовании политике π.
                </>
              ),
            },
            {
              term: "Reward Signal",
              desc: "Скалярный сигнал от среды, определяющий качество действия агента.",
            },
            {
              term: "Environment",
              desc: "Всё, с чем взаимодействует агент. Определяет правила и динамику.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex gap-3 items-start p-3 rounded-lg bg-muted/20 border border-border/30"
            >
              <Gift className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-mono font-bold text-sm text-primary">{item.term}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 10. Резюме ────────────────────────────────── */}
      <section>
        <Card className="bg-gradient-to-br from-primary/5 via-card/40 to-secondary/5 border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              Подведём итоги
            </h2>
            <div className="space-y-3">
              {[
                "Reinforcement Learning — парадигма МО, где агент учится через взаимодействие со средой и получение наград",
                "Цикл RL: агент наблюдает состояние → выбирает действие → получает награду → переходит в новое состояние",
                "MDP (S, A, T, R, γ) — формальная модель, описывающая задачу RL",
                "Параметр γ (gamma) определяет, насколько агент учитывает будущие награды",
                "Exploration vs Exploitation — ключевая дилемма: исследовать новое или использовать известное",
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-primary font-bold text-sm mt-0.5">{i + 1}.</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-foreground mt-4 font-medium">
              В следующем уроке мы установим рабочее окружение (PyTorch + Unity ML-Agents) и
              подготовимся к написанию первого RL-агента!
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── 11. Квиз ──────────────────────────────────── */}
      <Quiz
        title="Проверь себя: Основы RL"
        questions={quizQuestions}
        nextLesson={{ path: "/courses/1-2", title: "Установка окружения" }}
      />
    </LessonLayout>
  );
};

export default CourseLesson1_1;
