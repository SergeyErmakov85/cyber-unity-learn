# Аудит урока 1.5 — текущее состояние файла

**Маршрут:** `/courses/1-5`

**Регистрация маршрута:** `src/App.tsx:139`

```tsx
<Route path="/courses/1-5" element={<CourseLesson1_5 />} />
```

**Lazy-импорт:** `src/App.tsx:43`

```tsx
const CourseLesson1_5 = lazy(() => import("./pages/CourseLesson1_5"));
```

**Абсолютный путь компонента:**

```
N:/neon-unity-neural/src/pages/CourseLesson1_5.tsx
```

**Размер:** 1046 строк.

## Полное содержимое файла

```tsx
import LessonLayout from "@/components/LessonLayout";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import Math from "@/components/Math";
import Quiz from "@/components/Quiz";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sigma,
  GitBranch,
  Target,
  TrendingUp,
  Compass,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  Calculator,
  Infinity as InfinityIcon,
  Gauge,
  Route,
  Workflow,
  Bot,
  Trees,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import ValueFunctionViz from "@/components/math-rl/ValueFunctionViz";

const quizQuestions = [
  {
    question: "Какая пятёрка элементов определяет MDP?",
    options: [
      "(S, A, P, R, V)",
      "(S, A, T, R, γ)",
      "(S, A, Q, π, γ)",
      "(O, A, T, R, γ)",
    ],
    correctIndex: 1,
    explanation:
      "MDP формально задаётся кортежем (S, A, T, R, γ): множество состояний S, множество действий A, функция переходов T(s'|s,a), функция награды R и дисконт-фактор γ ∈ [0,1].",
  },
  {
    question: "Чем V^π(s) отличается от Q^π(s, a)?",
    options: [
      "Ничем — это одна и та же функция",
      "V зависит от состояния, Q — от пары (состояние, действие)",
      "V используется в DQN, Q — в Q-Learning",
      "V — для эпизодических задач, Q — для непрерывных",
    ],
    correctIndex: 1,
    explanation:
      "V^π(s) — ожидаемый дисконтированный возврат из состояния s при следовании политике π. Q^π(s,a) — то же самое, но с уточнением, что сначала выполняется действие a, а дальше работает π. Связь: V^π(s) = Σ_a π(a|s) · Q^π(s,a).",
  },
  {
    question: "Что выражает уравнение Беллмана для V^π?",
    options: [
      "Ценность состояния = награда на этом шаге",
      "Ценность состояния = сумма всех будущих наград без дисконта",
      "Ценность = ожидание немедленной награды + γ·V^π(следующего состояния)",
      "Ценность состояния равна нулю в терминальном состоянии",
    ],
    correctIndex: 2,
    explanation:
      "Уравнение Беллмана выражает рекурсивную структуру: V^π(s) = E[R + γ·V^π(s')]. Ценность состояния раскладывается на немедленную награду плюс дисконтированную ценность следующего состояния — это и делает возможными алгоритмы Value Iteration, Q-Learning, DQN.",
  },
  {
    question: "Как связаны оптимальная Q* и оптимальная политика π*?",
    options: [
      "π*(s) = argmin_a Q*(s, a)",
      "π*(s) = argmax_a Q*(s, a)",
      "π* = Q* — это одно и то же",
      "π*(s) случайна при любой Q*",
    ],
    correctIndex: 1,
    explanation:
      "Если знаешь Q*, оптимальная политика тривиальна: в каждом состоянии выбирать действие с максимальным Q*. Именно поэтому алгоритмы типа Q-Learning и DQN учат Q-функцию — они решают задачу планирования автоматически.",
  },
  {
    question: "Почему γ обычно выбирают строго меньше 1 в непрерывных задачах?",
    options: [
      "Чтобы ускорить обучение",
      "Чтобы бесконечный ряд наград сходился, а V(s) был конечным",
      "Так требует PyTorch",
      "γ < 1 делает задачу стохастической",
    ],
    correctIndex: 1,
    explanation:
      "В непрерывных (non-episodic) задачах агент может жить бесконечно. Если γ = 1, ряд Σ γᵏ·r может расходиться. γ < 1 геометрически убывает и гарантирует сходимость; эффективный горизонт ≈ 1/(1−γ).",
  },
];

const CourseLesson1_5 = () => {
  return (
    <LessonLayout
      lessonId="1-5"
      lessonTitle="Марковские процессы принятия решений (MDP)"
      lessonNumber="1.5"
      duration="35 мин"
      tags={["#theory", "#math", "#bellman"]}
      level={1}
      prevLesson={{ path: "/courses/1-4", title: "DQN с нуля на PyTorch" }}
      nextLesson={{ path: "/courses/1-6", title: "Q-Learning: табличный метод" }}
      keyConcepts={[
        "MDP = (S, A, T, R, γ) — формальная модель задачи RL",
        "Политика π, возврат G_t и траектории",
        "Функции ценности V^π(s) и Q^π(s, a)",
        "Уравнения Беллмана — рекурсивная структура ценности",
        "Оптимальность V*, Q* и связь π*(s) = argmax_a Q*(s, a)",
      ]}
    >
      {/* ── 0. Визуальная карта MDP (по рисунку) ───────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Workflow className="w-6 h-6 text-primary" />
          MDP одним взглядом — визуальная карта
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Прежде чем погружаться в формулы, зафиксируем общую картину. На схеме ниже
          собрано всё, о чём пойдёт речь в этом уроке: формальный кортеж{" "}
          <Math display={false}>{"\\mathcal{M} = (\\mathcal{S}, \\mathcal{A}, P, R, \\gamma)"}</Math>,
          петля взаимодействия <strong className="text-foreground">агент ↔ среда</strong>,
          траектория и цель обучения.
        </p>

        {/* Формула-«шапка» MDP */}
        <Card className="bg-card/60 backdrop-blur-sm border-primary/30 mb-6">
          <CardContent className="p-5 text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Markov Decision Process
            </p>
            <Math>{"\\mathcal{M} = (\\mathcal{S},\\, \\mathcal{A},\\, P,\\, R,\\, \\gamma)"}</Math>
          </CardContent>
        </Card>

        {/* Интерактивная диаграмма Agent ↔ Environment (нативный SVG) */}
        <Card className="bg-card/60 backdrop-blur-sm border-primary/30 mb-6 overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-4 items-center">
              {/* AGENT */}
              <div className="relative rounded-xl border-2 border-primary/40 bg-primary/5 p-5 hover:shadow-glow-cyan transition-shadow">
                <div className="absolute -top-3 left-4 px-2 py-0.5 bg-background border border-primary/40 rounded text-xs font-bold text-primary uppercase tracking-wider">
                  Agent
                </div>
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center shadow-glow-cyan">
                    <Bot className="w-12 h-12 text-primary" strokeWidth={1.5} />
                  </div>
                  <p className="text-xs text-center text-muted-foreground leading-relaxed">
                    Принимает решения,<br />обучается на опыте
                  </p>
                </div>
              </div>

              {/* CHANNELS — middle column with 3 arrows */}
              <div className="flex flex-col gap-4 min-w-[180px]">
                {/* action: agent → env */}
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-[2px] bg-gradient-to-r from-primary to-primary/40 relative">
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs">
                        <span className="text-primary font-mono">action </span>
                        <Math display={false} className="!text-primary text-xs">{"a_t \\in \\mathcal{A}"}</Math>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary -ml-2" />
                  </div>
                </div>

                {/* reward: env → agent */}
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4 text-secondary -mr-2" />
                    <div className="flex-1 h-[2px] bg-gradient-to-l from-secondary to-secondary/40 relative">
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs">
                        <span className="text-secondary font-mono">reward </span>
                        <Math display={false} className="!text-secondary text-xs">{"r_t \\in \\mathbb{R}"}</Math>
                      </div>
                    </div>
                  </div>
                </div>

                {/* next state: env → agent */}
                <div className="relative">
                  <div className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4 text-secondary -mr-2" />
                    <div className="flex-1 h-[2px] bg-gradient-to-l from-secondary to-secondary/40 relative">
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs">
                        <span className="text-secondary font-mono">next state </span>
                        <Math display={false} className="!text-secondary text-xs">{"s_{t+1} \\in \\mathcal{S}"}</Math>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ENVIRONMENT */}
              <div className="relative rounded-xl border-2 border-secondary/40 bg-secondary/5 p-5 hover:shadow-glow-purple transition-shadow">
                <div className="absolute -top-3 left-4 px-2 py-0.5 bg-background border border-secondary/40 rounded text-xs font-bold text-secondary uppercase tracking-wider">
                  Environment
                </div>
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="w-20 h-20 rounded-full bg-secondary/10 border-2 border-secondary/40 flex items-center justify-center shadow-glow-purple">
                    <Trees className="w-12 h-12 text-secondary" strokeWidth={1.5} />
                  </div>
                  <p className="text-xs text-center text-muted-foreground leading-relaxed">
                    Имеет состояние,<br />реагирует на действия
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground italic text-center mt-6 pt-4 border-t border-border/30">
              Цикл взаимодействия: агент выбирает{" "}
              <Math display={false}>{"a_t \\in \\mathcal{A}"}</Math>, среда отвечает наградой{" "}
              <Math display={false}>{"r_t \\in \\mathbb{R}"}</Math> и следующим состоянием{" "}
              <Math display={false}>{"s_{t+1} \\in \\mathcal{S}"}</Math>.
            </p>
          </CardContent>
        </Card>

        {/* Компоненты пятёрки */}
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Sigma className="w-5 h-5 text-primary" />
          Компоненты MDP
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {[
            { sym: "\\mathcal{S}", name: "State space", desc: "Множество всех возможных состояний среды" },
            { sym: "\\mathcal{A}", name: "Action space", desc: "Множество доступных действий агента" },
            { sym: "P", name: "Transition probability", desc: "P(s' | s, a) — вероятность перехода в s' из s после действия a" },
            { sym: "R", name: "Reward function", desc: "R(s, a, s') — числовая награда за переход" },
            { sym: "\\gamma", name: "Discount factor", desc: "γ ∈ [0, 1) — вес будущих наград" },
          ].map((item) => (
            <Card key={item.name} className="bg-card/60 backdrop-blur-sm border-primary/20 hover:shadow-glow-cyan transition-shadow">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <Math display={false} className="!text-primary font-bold">{item.sym}</Math>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Петля agent ↔ environment */}
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Route className="w-5 h-5 text-secondary" />
          Петля взаимодействия агент ↔ среда
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
            <CardContent className="p-4 space-y-2">
              <p className="text-xs uppercase tracking-wider text-primary font-semibold">Agent → Environment</p>
              <Math display={false}>{"a_t \\in \\mathcal{A}"}</Math>
              <p className="text-xs text-muted-foreground">Агент выбирает действие в момент времени <Math display={false}>{"t"}</Math>.</p>
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur-sm border-secondary/30">
            <CardContent className="p-4 space-y-2">
              <p className="text-xs uppercase tracking-wider text-secondary font-semibold">Environment → Agent</p>
              <Math display={false}>{"r_t \\in \\mathbb{R}"}</Math>
              <p className="text-xs text-muted-foreground">Среда возвращает награду, полученную после <Math display={false}>{"a_{t-1}"}</Math>.</p>
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur-sm border-secondary/30">
            <CardContent className="p-4 space-y-2">
              <p className="text-xs uppercase tracking-wider text-secondary font-semibold">Environment → Agent</p>
              <Math display={false}>{"s_{t+1} \\in \\mathcal{S}"}</Math>
              <p className="text-xs text-muted-foreground">Среда переводит агента в новое состояние согласно <Math display={false}>{"P(s' \\mid s, a)"}</Math>.</p>
            </CardContent>
          </Card>
        </div>

        {/* Траектория */}
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-primary" />
          Развёртка во времени — траектория
        </h3>
        <Card className="bg-card/60 backdrop-blur-sm border-primary/30 mb-3">
          <CardContent className="p-5">
            <Math>{"s_0 \\xrightarrow{a_0} r_0, s_1 \\xrightarrow{a_1} r_1, s_2 \\;\\cdots\\; \\xrightarrow{a_t} r_t, s_{t+1} \\;\\cdots"}</Math>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
          {[
            { sym: "s_t \\in \\mathcal{S}", desc: "состояние в момент времени t" },
            { sym: "a_t \\in \\mathcal{A}", desc: "действие в момент времени t" },
            { sym: "r_t \\in \\mathbb{R}", desc: "награда, полученная после действия a_{t-1}" },
            { sym: "P(s' \\mid s, a)", desc: "вероятность перейти в s', выбрав a из s" },
          ].map((item) => (
            <Card key={item.desc} className="bg-card/30 border-border/40">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="min-w-[110px] px-2 py-1 rounded bg-primary/10 border border-primary/20 text-center">
                  <Math display={false} className="!text-primary text-xs">{item.sym}</Math>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">— {item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Цель */}
        <Card className="bg-card/60 backdrop-blur-sm border-secondary/30 hover:shadow-glow-purple transition-shadow">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-secondary" />
              <p className="text-sm font-semibold text-secondary uppercase tracking-wider">Objective</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Найти политику <Math display={false}>{"\\pi(a \\mid s)"}</Math>, которая
              максимизирует <strong className="text-foreground">ожидаемый дисконтированный возврат</strong>:
            </p>
            <Math>{"G_t = \\sum_{k=0}^{\\infty} \\gamma^{k}\\, r_{t+k+1}"}</Math>
            <p className="text-xs text-muted-foreground italic">
              Все алгоритмы RL — от Q-Learning до PPO — это разные способы решить именно
              эту оптимизационную задачу. Дальше в уроке мы разберём по очереди каждый
              элемент схемы.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── 1. Зачем возвращаемся к MDP ───────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Compass className="w-6 h-6 text-primary" />
          Зачем снова про MDP?
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          В уроках 1.3 и 1.4 ты уже обучил <strong className="text-foreground">DQN</strong> —
          он прекрасно балансирует шест, но работает «как чёрный ящик». Почему сеть учит
          именно <em>Q-значения</em>? Почему в коде появляется выражение
        </p>
        <Math>{"r + \\gamma \\cdot \\max_{a'} Q(s', a')"}</Math>
        <p className="text-muted-foreground leading-relaxed my-4">
          и откуда берётся формула возврата
        </p>
        <Math>{"G_t = r_{t+1} + \\gamma\\, r_{t+2} + \\gamma^2 r_{t+3} + \\dots\\,?"}</Math>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Все эти формулы — прямое следствие математической модели, которая называется{" "}
          <strong className="text-foreground">Марковский процесс принятия решений (MDP)</strong>.
          В уроке 1.1 мы видели пятёрку <Math display={false}>{"(S, A, T, R, \\gamma)"}</Math>{" "}
          в общих чертах. Теперь — настоящее погружение.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              icon: BookOpen,
              title: "Язык всей RL-литературы",
              desc: "Любая статья по RL (DQN, PPO, SAC) формулируется в терминах MDP. Без него не прочитаешь ни одной работы.",
              color: "text-primary",
            },
            {
              icon: Lightbulb,
              title: "Объяснит, что творит код",
              desc: "Формулы Беллмана — не магия. Они следуют из определения V и Q всего за несколько строк.",
              color: "text-secondary",
            },
            {
              icon: Route,
              title: "Мост к Q-Learning",
              desc: "В уроке 1.6 мы выведем Q-Learning из уравнений Беллмана — этот урок готовит почву.",
              color: "text-accent",
            },
          ].map((item, i) => (
            <Card key={i} className="bg-card/40 border-border/40">
              <CardContent className="p-4 space-y-2">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <p className="font-semibold text-sm text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 2. Recap (S, A, T, R, γ) ───────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Пятёрка MDP — краткое напоминание
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Подробно компоненты мы разобрали в{" "}
          <CrossLinkToHub hubPath="/courses/1-1" hubTitle="Урок 1.1 — Что такое RL">
            уроке 1.1
          </CrossLinkToHub>
          . Здесь — сжатая таблица, чтобы закрепить нотацию:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          {[
            { sym: "S", name: "States", desc: "Множество состояний среды" },
            { sym: "A", name: "Actions", desc: "Множество действий агента" },
            { sym: "T", name: "Transitions", desc: "T(s'|s,a) — вероятность перехода" },
            { sym: "R", name: "Rewards", desc: "R(s,a,s') — числовая награда" },
            { sym: "\\gamma", name: "Discount", desc: "γ ∈ [0,1] — вес будущих наград" },
          ].map((item) => (
            <Card key={item.sym} className="bg-card/40 border-primary/20">
              <CardContent className="p-3 text-center space-y-1">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 mx-auto flex items-center justify-center">
                  <Math display={false} className="!text-primary font-bold">{item.sym}</Math>
                </div>
                <p className="text-xs font-semibold text-foreground">{item.name}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card/30 border-secondary/20 mt-4">
          <CardContent className="p-4 flex gap-3 items-start">
            <Lightbulb className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Свойство Маркова:</strong> будущее состояние
              зависит только от текущего <Math display={false}>{"s_t"}</Math> и действия{" "}
              <Math display={false}>{"a_t"}</Math> — вся история в{" "}
              <Math display={false}>{"s_t"}</Math> уже «зашита». Это ключевое допущение,
              без которого нельзя использовать <Math display={false}>{"T(s' \\mid s, a)"}</Math>.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── 3. Траектория и возврат G_t ───────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Route className="w-6 h-6 text-secondary" />
          Траектория и возврат G<sub>t</sub>
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Агент, взаимодействуя со средой, порождает{" "}
          <strong className="text-foreground">траекторию</strong> — цепочку состояний,
          действий и наград:
        </p>

        <Math>{"\\tau = (s_0,\\, a_0,\\, r_1,\\, s_1,\\, a_1,\\, r_2,\\, s_2,\\, a_2,\\, r_3,\\, \\dots)"}</Math>

        <p className="text-muted-foreground leading-relaxed my-4">
          Нас интересует не только <em>текущая</em> награда, а{" "}
          <strong className="text-foreground">дисконтированная сумма всех будущих наград</strong>,
          называемая возвратом (return):
        </p>

        <Math>{"G_t = r_{t+1} + \\gamma\\, r_{t+2} + \\gamma^2 r_{t+3} + \\dots = \\sum_{k=0}^{\\infty} \\gamma^k\\, r_{t+k+1}"}</Math>

        <p className="text-muted-foreground leading-relaxed my-4 text-sm italic">
          Рекурсивная форма (удобна для доказательств):
        </p>

        <Math>{"G_t = r_{t+1} + \\gamma\\, G_{t+1}"}</Math>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <Card className="bg-card/40 border-border/40">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Эпизодические задачи
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Есть терминальное состояние: шест упал, игра закончилась, цель достигнута.
                Сумма конечна, <Math display={false}>{"\\gamma = 1"}</Math> допустимо.
              </p>
              <p className="text-xs text-muted-foreground italic">
                Примеры: CartPole, FrozenLake, Atari, шахматы.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/40 border-border/40">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <InfinityIcon className="w-4 h-4 text-secondary" />
                Непрерывные задачи
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Агент живёт «бесконечно». Нужен строгий{" "}
                <Math display={false}>{"\\gamma < 1"}</Math>, чтобы ряд сходился.
              </p>
              <p className="text-xs text-muted-foreground italic">
                Примеры: управление роботом, трейдинг, управление электросетью.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── 4. Политика π ───────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-accent" />
          Политика π — то, что мы оптимизируем
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          <strong className="text-foreground">Политика</strong> (policy) — функция, которая
          говорит агенту, что делать в каждом состоянии. Именно политику мы хотим улучшить в
          процессе обучения.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className="bg-card/50 border-primary/30">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-sm text-primary">Детерминированная</h3>
              <p className="text-xs text-muted-foreground">Одно действие на каждое состояние:</p>
              <Math>{"a = \\pi(s)"}</Math>
              <p className="text-xs text-muted-foreground">
                «В состоянии <Math display={false}>{"s"}</Math> всегда выбирай действие{" "}
                <Math display={false}>{"a"}</Math>». Так работает жадный выбор после
                обучения DQN.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-secondary/30">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-sm text-secondary">Стохастическая</h3>
              <p className="text-xs text-muted-foreground">Распределение вероятностей действий:</p>
              <Math>{"\\pi(a \\mid s) \\in [0, 1], \\quad \\sum_{a} \\pi(a \\mid s) = 1"}</Math>
              <p className="text-xs text-muted-foreground">
                «В состоянии <Math display={false}>{"s"}</Math> действие{" "}
                <Math display={false}>{"a"}</Math> выбирается с вероятностью{" "}
                <Math display={false}>{"\\pi(a \\mid s)"}</Math>». Основа
                Policy Gradient и PPO (урок 2.1, 2.2).
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── 5. V^π и Q^π + интерактивная визуализация ───────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-primary" />
          Функции ценности: V^π(s) и Q^π(s, a)
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Чтобы выбирать политику, нужно уметь <em>оценивать</em>, насколько состояние (или
          пара «состояние + действие») выгодно с точки зрения будущих наград.
          Функции ценности — это ожидаемый возврат при заданной политике.
        </p>

        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 mt-2">
          Функция ценности состояния
        </p>
        <Math>{"V^{\\pi}(s) = \\mathbb{E}_{\\pi}\\!\\left[\\, G_t \\;\\middle|\\; s_t = s \\,\\right] = \\mathbb{E}_{\\pi}\\!\\left[\\, r_{t+1} + \\gamma\\, r_{t+2} + \\gamma^2 r_{t+3} + \\dots \\;\\middle|\\; s_t = s \\,\\right]"}</Math>

        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 mt-4">
          Функция ценности действия (Q-функция)
        </p>
        <Math>{"Q^{\\pi}(s, a) = \\mathbb{E}_{\\pi}\\!\\left[\\, G_t \\;\\middle|\\; s_t = s,\\, a_t = a \\,\\right]"}</Math>

        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 mt-4">
          Связь между ними
        </p>
        <Math>{"V^{\\pi}(s) = \\sum_{a} \\pi(a \\mid s)\\, Q^{\\pi}(s, a)"}</Math>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <Card className="bg-card/40 border-primary/20">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                <Gauge className="w-4 h-4" /> V(s) — «насколько хорошо состояние»
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ответ на вопрос: «Если я сейчас в s и следую политике π — сколько суммарной
                дисконтированной награды я получу в среднем?»
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/40 border-secondary/20">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-sm text-secondary flex items-center gap-2">
                <Target className="w-4 h-4" /> Q(s, a) — «насколько хорош этот ход»
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ответ на вопрос: «Если в s я сделаю именно a (а дальше — по π), сколько
                получу?» Именно эту функцию учит DQN.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive V(s) viz */}
        <div className="mt-6">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">
            Интерактивно: посчитай V(s) сам
          </p>
          <ValueFunctionViz />
        </div>
      </section>

      {/* ── 6. Уравнения Беллмана ───────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Sigma className="w-6 h-6 text-secondary" />
          <CrossLinkToHub
            hubPath="/math-rl/module-5"
            hubAnchor="глава-5"
            hubTitle="Математика RL — Глава 5. Уравнения Беллмана"
          >
            Уравнения Беллмана
          </CrossLinkToHub>
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Главное открытие теории MDP: функции ценности обладают{" "}
          <strong className="text-foreground">рекурсивной структурой</strong>. Ценность
          состояния можно выразить через ценность следующего состояния — и это превращает
          «бесконечные суммы» в решаемые алгебраические уравнения.
        </p>

        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">
          Уравнение Беллмана для V<sup>π</sup> (expectation)
        </p>
        <Math>{"V^{\\pi}(s) = \\sum_{a} \\pi(a \\mid s) \\sum_{s'} T(s' \\mid s, a)\\, \\bigl[\\, R(s, a, s') + \\gamma\\, V^{\\pi}(s') \\,\\bigr]"}</Math>

        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 mt-4">
          Уравнение Беллмана для Q<sup>π</sup>
        </p>
        <Math>{"Q^{\\pi}(s, a) = \\sum_{s'} T(s' \\mid s, a)\\, \\Bigl[\\, R(s, a, s') + \\gamma \\sum_{a'} \\pi(a' \\mid s')\\, Q^{\\pi}(s', a') \\,\\Bigr]"}</Math>

        <p className="text-muted-foreground leading-relaxed my-4">
          Если убрать индексы — получим простую идею:
        </p>

        <Card className="bg-gradient-to-br from-primary/5 via-card/40 to-secondary/5 border-primary/30">
          <CardContent className="p-5 text-center space-y-2">
            <Math>{"\\text{Ценность}(\\text{сейчас}) = \\text{награда} + \\gamma \\cdot \\text{Ценность}(\\text{потом})"}</Math>
            <p className="text-xs text-muted-foreground mt-2">
              ровно это мы и закодировали в target-формуле DQN:
            </p>
            <Math display={false}>{"r + \\gamma \\cdot \\max_{a'} Q(s', a')"}</Math>
          </CardContent>
        </Card>
      </section>

      {/* ── 7. Оптимальность V*, Q*, π* ───────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          Оптимальность: V*, Q* и политика π*
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Обучение — это поиск{" "}
          <strong className="text-foreground">оптимальной политики π*</strong>, максимизирующей
          ожидаемый возврат. Соответствующие ей функции ценности называются{" "}
          <Math display={false}>{"V^{*}"}</Math> и <Math display={false}>{"Q^{*}"}</Math>.
        </p>

        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">
          Определения
        </p>
        <Math>{"V^{*}(s) = \\max_{\\pi} V^{\\pi}(s) \\qquad Q^{*}(s, a) = \\max_{\\pi} Q^{\\pi}(s, a)"}</Math>

        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 mt-4">
          Уравнения Беллмана оптимальности
        </p>
        <Math>{"V^{*}(s) = \\max_{a} \\sum_{s'} T(s' \\mid s, a)\\, \\bigl[\\, R(s, a, s') + \\gamma\\, V^{*}(s') \\,\\bigr]"}</Math>
        <Math>{"Q^{*}(s, a) = \\sum_{s'} T(s' \\mid s, a)\\, \\bigl[\\, R(s, a, s') + \\gamma\\, \\max_{a'} Q^{*}(s', a') \\,\\bigr]"}</Math>

        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 mt-4">
          Ключевой факт: зная <Math display={false}>{"Q^{*}"}</Math>, оптимальная политика тривиальна
        </p>
        <Math>{"\\pi^{*}(s) = \\arg\\max_{a} Q^{*}(s, a)"}</Math>

        <Card className="bg-primary/5 border-primary/30 mt-4">
          <CardContent className="p-4 flex gap-3 items-start">
            <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Почему все алгоритмы учат Q, а не V?</strong>{" "}
              Чтобы выбрать действие по <Math display={false}>{"V^{*}"}</Math>, нужно знать{" "}
              <Math display={false}>{"T(s' \\mid s, a)"}</Math> — модель среды. А по{" "}
              <Math display={false}>{"Q^{*}"}</Math> — достаточно взять{" "}
              <Math display={false}>{"\\arg\\max_{a} Q^{*}(s, a)"}</Math>.
              Поэтому model-free алгоритмы (Q-Learning, DQN, SAC) работают с Q-функцией.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── 8. Обзор методов решения MDP ───────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Workflow className="w-6 h-6 text-secondary" />
          Как решают MDP — обзор методов
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Разные алгоритмы по-разному используют уравнения Беллмана. Ниже — краткая карта
          семейств, с которыми ты будешь встречаться весь курс:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              name: "Value Iteration",
              model: "model-based",
              desc: "Знаем T и R. Итеративно применяем уравнение Беллмана оптимальности к V. Гарантированно сходится к V*.",
              color: "border-primary/30",
              label: "text-primary",
            },
            {
              name: "Policy Iteration",
              model: "model-based",
              desc: "Чередуем: оценку V^π (при фиксированной π) и улучшение π (жадно по V^π). Сходимость быстрее, чем у VI.",
              color: "border-primary/30",
              label: "text-primary",
            },
            {
              name: "Q-Learning",
              model: "model-free",
              desc: "T и R неизвестны. Обновляем табличку Q на опыте. Урок 1.6 — от уравнения Беллмана до кода.",
              color: "border-secondary/30",
              label: "text-secondary",
            },
            {
              name: "DQN / SAC / PPO",
              model: "model-free + deep",
              desc: "То же самое, но Q (или π) представлены нейросетью. Работают в непрерывных или огромных пространствах.",
              color: "border-secondary/30",
              label: "text-secondary",
            },
          ].map((m) => (
            <Card key={m.name} className={`bg-card/40 ${m.color}`}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-sm ${m.label}`}>{m.name}</h3>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono px-2 py-0.5 rounded bg-muted/30">
                    {m.model}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 9. Код: Value Iteration на gridworld ───────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" />
          Код: Value Iteration на крошечном gridworld
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Чтобы увидеть, как формула Беллмана превращается в реальный алгоритм — реализуем
          Value Iteration на среде 4×4. Модель (T и R) известна, поэтому решение находится без
          обучения, одной итеративной математикой.
        </p>

        <CyberCodeBlock language="python" filename="value_iteration.py">
          {`import numpy as np

# ── Конфигурация gridworld 4x4 ──
# .  .  .  G      G = цель    (+1)
# .  #  .  .      # = стена
# .  .  .  .
# S  .  .  X      S = старт,  X = обрыв (-1)
N, M = 4, 4
GOAL, TRAP, WALL = (0, 3), (3, 3), (1, 1)
ACTIONS = [(-1, 0), (1, 0), (0, -1), (0, 1)]   # up, down, left, right
GAMMA = 0.9
THETA = 1e-4  # критерий остановки

def is_terminal(s):
    return s == GOAL or s == TRAP

def step(s, a):
    """Детерминированный переход. Возврат (s', r, done)."""
    if is_terminal(s):
        return s, 0.0, True
    ni, nj = s[0] + ACTIONS[a][0], s[1] + ACTIONS[a][1]
    # выход за границы / стена — остаёмся на месте
    if not (0 <= ni < N and 0 <= nj < M) or (ni, nj) == WALL:
        ni, nj = s
    ns = (ni, nj)
    if ns == GOAL:  return ns, 1.0, True
    if ns == TRAP:  return ns, -1.0, True
    return ns, -0.04, False  # маленький штраф за шаг

# ── Value Iteration ──
V = np.zeros((N, M))
for it in range(1000):
    delta = 0.0
    new_V = V.copy()
    for i in range(N):
        for j in range(M):
            s = (i, j)
            if is_terminal(s) or s == WALL:
                continue
            # Беллман оптимальности: V(s) = max_a [ r + γ · V(s') ]
            q_values = []
            for a in range(4):
                ns, r, done = step(s, a)
                q_values.append(r + (0 if done else GAMMA * V[ns]))
            new_V[i, j] = max(q_values)
            delta = max(delta, abs(new_V[i, j] - V[i, j]))
    V = new_V
    if delta < THETA:
        print(f"Сошлось за {it + 1} итераций")
        break

# ── Извлекаем оптимальную политику ──
policy = np.full((N, M), ' ', dtype='<U2')
arrows = ['↑', '↓', '←', '→']
for i in range(N):
    for j in range(M):
        s = (i, j)
        if s == GOAL:  policy[i, j] = 'G'
        elif s == TRAP: policy[i, j] = 'X'
        elif s == WALL: policy[i, j] = '#'
        else:
            q = [step(s, a)[1] + (0 if step(s, a)[2] else GAMMA * V[step(s, a)[0]])
                 for a in range(4)]
            policy[i, j] = arrows[int(np.argmax(q))]

print("V* =")
print(np.round(V, 2))
print("π* =")
for row in policy:
    print(' '.join(row))`}
        </CyberCodeBlock>

        <Card className="bg-card/40 border-border/40 mt-4">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Что ты увидишь в выводе
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Значения V образуют «градиент» к цели: чем ближе к G, тем выше V. Политика π*
              представляется стрелками, указывающими оптимальное действие в каждой клетке.
              Обрати внимание: алгоритм обошёлся <strong className="text-foreground">без
              нейросетей</strong> — чистая математика уравнений Беллмана.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── 10. Accordion-разборы ───────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Глубже в детали</h2>

        <Accordion type="multiple" className="space-y-2">
          <AccordionItem
            value="why-gamma"
            className="border-border/30 rounded-lg overflow-hidden bg-card/20"
          >
            <AccordionTrigger className="px-4 text-sm text-muted-foreground hover:text-foreground hover:no-underline">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Почему γ обязательно &lt; 1 в непрерывных задачах?
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                Если <Math display={false}>{"\\gamma = 1"}</Math> и эпизод бесконечен, то сумма{" "}
                <Math display={false}>{"G = r + r + r + \\dots"}</Math> может расходиться —{" "}
                <Math display={false}>{"V(s)"}</Math> не определена. При{" "}
                <Math display={false}>{"\\gamma < 1"}</Math> геометрический ряд сходится:
              </p>
              <Math>{"|G| \\leq r_{\\max} \\cdot (1 + \\gamma + \\gamma^2 + \\dots) = \\frac{r_{\\max}}{1 - \\gamma}"}</Math>
              <Math>{"\\text{Эффективный горизонт} \\approx \\frac{1}{1 - \\gamma}, \\quad \\gamma = 0.99 \\;\\Rightarrow\\; {\\sim}\\,100 \\text{ шагов}"}</Math>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                Помимо сходимости, <Math display={false}>{"\\gamma"}</Math> отражает
                предпочтение агента: «синица в руке важнее журавля в небе».
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="exp-vs-opt"
            className="border-border/30 rounded-lg overflow-hidden bg-card/20"
          >
            <AccordionTrigger className="px-4 text-sm text-muted-foreground hover:text-foreground hover:no-underline">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                В чём разница уравнений Беллмана expectation и optimality?
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                <strong className="text-foreground">Expectation</strong> (для фиксированной
                политики π): усреднение по{" "}
                <Math display={false}>{"\\pi(a \\mid s)"}</Math> —{" "}
                <Math display={false}>{"V^{\\pi}(s) = \\mathbb{E}_a[\\,\\dots\\,]"}</Math>.
                Отвечает на вопрос: «насколько хороша данная политика?».
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Optimality</strong> (для лучшей возможной
                политики): максимизация по действиям —{" "}
                <Math display={false}>{"V^{*}(s) = \\max_a [\\,\\dots\\,]"}</Math>. Решает задачу
                поиска лучшей политики. Замена{" "}
                <Math display={false}>{"\\sum_a \\pi"}</Math> на{" "}
                <Math display={false}>{"\\max_a"}</Math> — и есть вся разница.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="markov-in-real"
            className="border-border/30 rounded-lg overflow-hidden bg-card/20"
          >
            <AccordionTrigger className="px-4 text-sm text-muted-foreground hover:text-foreground hover:no-underline">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Что делать, если свойство Маркова не выполнено?
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                В реальных задачах <em>одного кадра</em> часто недостаточно: по статичному
                снимку Pong нельзя определить направление мяча. Это — нарушение марковости.
                Решения:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>
                  Склеивать несколько кадров в состояние (frame stacking в оригинальном DQN).
                </li>
                <li>
                  Использовать <strong className="text-foreground">рекуррентные сети</strong>{" "}
                  (LSTM, GRU) — они хранят скрытое состояние.
                </li>
                <li>
                  Формально переходить в <strong className="text-foreground">POMDP</strong> —
                  Partially Observable MDP, где различают наблюдения o и скрытое состояние s.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ── 11. Связь с Q-Learning/DQN и cross-links ───────────── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Что делать дальше?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className="bg-card/40 border-primary/30">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-sm text-primary">Следующий шаг — Q-Learning</h3>
              <p className="text-xs text-muted-foreground">
                В{" "}
                <CrossLinkToHub hubPath="/courses/1-6" hubTitle="Урок 1.6 — Q-Learning">
                  уроке 1.6
                </CrossLinkToHub>{" "}
                мы превратим уравнение Беллмана оптимальности для Q в алгоритм, который
                учится без знания T и R.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/40 border-secondary/30">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-sm text-secondary">Глубже в математику</h3>
              <p className="text-xs text-muted-foreground">
                Полноценные доказательства, сходимость, следы пригодности —{" "}
                <CrossLinkToHub
                  hubPath="/math-rl/module-5"
                  hubTitle="Математика RL — MDP, Bellman, Model-Free"
                >
                  математический модуль
                </CrossLinkToHub>
                .
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/40 border-accent/30">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-sm text-accent">Практика на дискретной среде</h3>
              <p className="text-xs text-muted-foreground">
                Попробуй Value Iteration на настоящем gridworld —{" "}
                <CrossLinkToHub
                  hubPath="/projects/frozen-lake"
                  hubTitle="Проект FrozenLake"
                >
                  FrozenLake
                </CrossLinkToHub>
                .
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/40 border-border/40">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-sm text-foreground">Вернуться к коду DQN</h3>
              <p className="text-xs text-muted-foreground">
                Перечитай код{" "}
                <CrossLinkToHub hubPath="/courses/1-4" hubTitle="Урок 1.4 — DQN">
                  DQN из урока 1.4
                </CrossLinkToHub>{" "}
                — теперь формула{" "}
                <Math display={false}>{"r + \\gamma \\cdot \\max_{a'} Q(s', a')"}</Math>{" "}
                должна стать очевидной.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── 12. Резюме ───────────── */}
      <section>
        <Card className="bg-gradient-to-br from-primary/5 via-card/40 to-secondary/5 border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              Подведём итоги
            </h2>
            <div className="space-y-3">
              {[
                "MDP = (S, A, T, R, γ) — универсальный язык для описания любой RL-задачи",
                "Возврат G_t = Σ γᵏ·r — дисконтированная сумма будущих наград; γ < 1 гарантирует сходимость",
                "V^π(s) оценивает состояние, Q^π(s,a) — пару состояние-действие; связаны через V^π(s) = Σ π(a|s)·Q^π(s,a)",
                "Уравнения Беллмана задают рекурсию: ценность = награда + γ · ценность(следующее)",
                "π*(s) = argmax_a Q*(s,a) — именно поэтому все RL-алгоритмы учат Q-функцию",
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-primary font-bold text-sm mt-0.5">{i + 1}.</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-foreground font-medium flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                Теперь у тебя есть весь математический аппарат, чтобы в уроке 1.6 вывести
                Q-Learning из первых принципов — без магии.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── 13. Quiz ───────────── */}
      <Quiz
        title="Проверь себя: MDP и Беллман"
        questions={quizQuestions}
        lessonPath="/courses/1-5"
        nextLesson={{ path: "/courses/1-6", title: "Q-Learning: табличный метод" }}
      />
    </LessonLayout>
  );
};

export default CourseLesson1_5;
```
