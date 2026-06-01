import LessonLayout from "@/components/LessonLayout";
import ProGate from "@/components/ProGate";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import Math from "@/components/Math";
import Quiz from "@/components/Quiz";
import { Card, CardContent } from "@/components/ui/card";
import {
  Lightbulb,
  ListChecks,
  Info,
  AlertTriangle,
  Sparkles,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import type { ReactNode } from "react";

/* ── Локальные хелперы (стиль урока 3.1) ───────────────── */

const SECTION_H2 = "text-2xl font-bold text-foreground mb-4 scroll-mt-24";

const KeyPoints = ({
  title = "Ключевые моменты раздела",
  items,
}: {
  title?: string;
  items: ReactNode[];
}) => (
  <Card className="my-6 border-primary/30 bg-primary/5 shadow-[0_0_15px_hsl(180_100%_50%/0.08)]">
    <CardContent className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <ListChecks className="w-5 h-5 text-primary" />
        <h4 className="font-semibold text-foreground">{title}</h4>
      </div>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-primary mt-0.5">▸</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const CALLOUT_COLORS: Record<string, string> = {
  amber: "border-yellow-500/30 bg-yellow-500/5 [&_svg]:text-yellow-400",
  purple: "border-secondary/30 bg-secondary/5 [&_svg]:text-secondary",
  cyan: "border-primary/30 bg-primary/5 [&_svg]:text-primary",
};

const Callout = ({
  title,
  color = "cyan",
  icon: Icon = Info,
  children,
}: {
  title?: string;
  color?: "amber" | "purple" | "cyan";
  icon?: typeof Info;
  children: ReactNode;
}) => (
  <Card className={`my-4 ${CALLOUT_COLORS[color]}`}>
    <CardContent className="p-4 flex gap-3 items-start">
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-muted-foreground leading-relaxed">
        {title && <strong className="text-foreground block mb-1">{title}</strong>}
        {children}
      </div>
    </CardContent>
  </Card>
);

const InteractiveStub = ({ children }: { children: ReactNode }) => (
  <Card className="my-4 border-secondary/30 bg-secondary/5 [&_svg]:text-secondary">
    <CardContent className="p-4 flex gap-3 items-start">
      <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-muted-foreground leading-relaxed">
        <strong className="text-foreground block mb-1">Интерактив (рекомендация)</strong>
        {children}
      </div>
    </CardContent>
  </Card>
);

/* Обёртка для горизонтально-скроллящихся таблиц в неоновом стиле */
const TableWrap = ({ children }: { children: ReactNode }) => (
  <div className="overflow-x-auto my-4">
    <table className="w-full text-sm border-collapse">{children}</table>
  </div>
);

const TH = ({ children }: { children: ReactNode }) => (
  <th className="text-left py-2 px-3 text-primary font-semibold border-b border-border/50 align-top">
    {children}
  </th>
);

const TD = ({ children }: { children: ReactNode }) => (
  <td className="py-2 px-3 text-muted-foreground border-b border-border/20 align-top">
    {children}
  </td>
);

/* ── Квиз ──────────────────────────────────────────────── */

const quizQuestions = [
  {
    question: "Почему нельзя просто запустить независимый PPO на каждом агенте в общей среде?",
    options: [
      "PPO не поддерживает несколько агентов технически",
      "Среда становится нестационарной — соседи учатся и меняют поведение",
      "Не хватит памяти GPU",
      "Независимый PPO работает только с дискретными действиями",
    ],
    correctIndex: 1,
    explanation:
      "Когда соседние агенты обучаются, их политики меняются, и среда с точки зрения каждого агента перестаёт быть стационарной — марковское предположение нарушается.",
  },
  {
    question: "Что описывает парадигма CTDE?",
    options: [
      "Централизованное исполнение, децентрализованное обучение",
      "Централизованный критик при обучении, децентрализованные акторы при исполнении",
      "Каждый агент тренирует собственного критика",
      "Все агенты используют один общий актор на исполнении",
    ],
    correctIndex: 1,
    explanation:
      "CTDE = Centralized Training with Decentralized Execution: критик видит всё при обучении, но каждый актор на исполнении работает только по своим локальным наблюдениям.",
  },
  {
    question: "Почему absorbing states — плохой способ работать с выбывшими агентами?",
    options: [
      "Они слишком быстро обучаются",
      "Высокая дисперсия, раздутая сеть и усложнение обучения критика",
      "Они нарушают zero-sum условие",
      "Они работают только в дискретных средах",
    ],
    correctIndex: 1,
    explanation:
      "MA-POCA доказывает три проблемы absorbing states: усложнение обучения сети, расход ресурсов и высокую дисперсию таргетов. Решение — self-attention (RSA) только по активным агентам.",
  },
  {
    question: "Что такое counterfactual advantage агента i?",
    options: [
      "Разница между его наградой и средней наградой команды",
      "Q совместного действия минус counterfactual baseline (что было бы, сыграй он иначе)",
      "Энтропия его политики",
      "Сумма дисконтированных наград до конца эпизода",
    ],
    correctIndex: 1,
    explanation:
      "Â_i = Q^π(s, a) − b_i, где baseline маргинализирует только действие агента i при фиксированных действиях остальных. Это «честное» сравнение индивидуального вклада.",
  },
  {
    question: "Какая метрика осмысленна для отслеживания прогресса в adversarial self-play?",
    options: [
      "Кумулятивная награда",
      "Рейтинг ELO",
      "Policy entropy",
      "Размер replay buffer",
    ],
    correctIndex: 1,
    explanation:
      "В adversarial-играх кумулятивная награда обманчива (сильный против сильных получает мало). ELO — относительный уровень мастерства; при корректном обучении он стабильно растёт.",
  },
];

const CourseLesson3_2 = () => {
  const preview = (
    <>
      <section>
        <p className="text-sm text-muted-foreground mb-4">
          <strong className="text-foreground">Уровень:</strong> Продвинутый ·{" "}
          <strong className="text-foreground">Раздел:</strong> Многоагентное обучение
        </p>
        <p className="text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Предполагается, что вы знаете:</strong> MDP, политика,
          V и Q, уравнение Беллмана, actor-critic, PPO (clipped surrogate, энтропийная
          регуляризация) — всё это разобрано в{" "}
          <CrossLinkToHub hubPath="/courses/3-1" hubTitle="Урок 3.1 — SAC">уроке 3.1 «SAC»</CrossLinkToHub>.
          Функции ценности и advantage — в{" "}
          <CrossLinkToHub hubPath="/courses/2-3" hubTitle="Урок 2.3">уроке 2.3</CrossLinkToHub>.
          Replay buffer и off-policy — тоже{" "}
          <CrossLinkToHub hubPath="/courses/3-1" hubAnchor="раздел-8-replay-buffer-и-off-policy-природа" hubTitle="Урок 3.1 — Replay buffer">урок 3.1</CrossLinkToHub>.
        </p>

        <Card className="mt-5 border-primary/20 bg-primary/5">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" /> Что вы поймёте к концу урока
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Почему стандартный одноагентный RL «ломается» в многоагентной среде — нестационарность и командный credit assignment.",
                "Что такое парадигма CTDE и зачем критику знать о всех агентах, пока акторы видят только себя.",
                "Почему «поглощающие состояния» (absorbing states) для выбывших агентов вредны — и как MA-POCA заменяет их self-attention.",
                "Что такое posthumous credit assignment и counterfactual baseline.",
                "Как работает Self-Play: авто-curriculum, пул снапшотов, нестационарность.",
                "Зачем нужен рейтинг ELO и как его читать в TensorBoard.",
                "Как собрать кооперативную команду (poca + SimpleMultiAgentGroup) и соревновательный матч (self_play) в Unity ML-Agents — полные YAML-конфиги.",
                "Как расширить гоночный агент из проекта 3 до соревновательного или кооперативного формата.",
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">▸</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Callout color="purple" icon={BookOpen} title="Как читать кросс-ссылки в этом уроке.">
          Урок — нарративная точка входа. Формальные выводы и доказательства (self-attention,
          TD(λ), теорема сходимости PPO) вынесены в хабы и обозначены значком ↗. Секции урока
          несут стабильные <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">id</code>-якоря,
          чтобы хабы могли ссылаться обратно.
        </Callout>
      </section>
    </>
  );

  return (
    <LessonLayout
      lessonId="3-2"
      lessonTitle="Многоагентное обучение: MA-POCA и Self-Play"
      lessonNumber="3.2"
      duration="50 мин"
      tags={["#mlagents", "#multiagent", "#mapoca", "#selfplay", "#advanced"]}
      level={3}
      prevLesson={{ path: "/courses/3-1", title: "SAC" }}
      nextLesson={{ path: "/courses/3-3", title: "Curriculum Learning" }}
    >
      <ProGate preview={preview}>
        {preview}

        {/* ── Раздел 0 ── */}
        <section>
          <h2 id="раздел-0-от-одного-гоночного-агента-к-команде" className={SECTION_H2}>
            Раздел 0. От одного гоночного агента к команде: зачем нужен MARL
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            В проекте 3 мы обучили одного гоночного агента алгоритмом PPO. Теперь представьте: на
            трассе не один, а четыре агента. Или команда роботов, которая вместе несёт груз. Или
            команда по мини-футболу. Казалось бы — просто запустим PPO на каждом агенте отдельно, и
            всё.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">Это не работает. И вот почему.</p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Когда агент А учится, его политика меняется. Но агент Б, который тоже учится,
            воспринимает среду через действия А. Значит, среда Б <strong className="text-foreground">нестационарна</strong> —
            она меняется в каждый момент, потому что меняются соседи. Стандартный RL предполагает
            стационарную среду, и это предположение нарушается.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Вторая проблема: в командных задачах агенты получают <strong className="text-foreground">общую</strong> награду.
            Команда забила гол — плюс всем. Но кто именно внёс вклад? Полузащитник, который отдал
            пас? Нападающий, который пробил? Или вратарь, который держался в своей зоне и не мешал?
            Это и есть <strong className="text-foreground">командный credit assignment</strong> — задача
            разобраться, кто что заслужил.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Именно для решения этих двух проблем существует{" "}
            <strong className="text-foreground">многоагентное обучение с подкреплением (MARL)</strong>.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            В этом уроке мы разберём два инструмента, которые Unity ML-Agents даёт «из коробки»:
          </p>
          <ul className="space-y-2 mt-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">▸</span>
              <span>
                <strong className="text-primary">MA-POCA</strong>{" "}
                (<code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">trainer_type: poca</code>) —
                для кооперативных команд с общей наградой и переменным числом агентов.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">▸</span>
              <span>
                <strong className="text-secondary">Self-Play</strong>{" "}
                (<code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">self_play:</code> блок в YAML) —
                для соревновательных матчей агента против копий себя.
              </span>
            </li>
          </ul>
          <KeyPoints
            items={[
              "Запустить независимый PPO на каждом агенте в общей среде — неправильно: среда нестационарна из-за меняющихся соседей.",
              "В командных задачах неясно, кто из агентов заслужил общую награду — это командный credit assignment.",
              "Unity ML-Agents решает это двумя инструментами: MA-POCA (кооперация) и Self-Play (соревнование).",
            ]}
          />
        </section>

        {/* ── Раздел 1 ── */}
        <section>
          <h2 id="раздел-1-постановка-задачи-decentralized-pomdp-и-ctde" className={SECTION_H2}>
            Раздел 1. Постановка задачи: decentralized-POMDP и CTDE
          </h2>

          <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Формальная постановка</h3>
          <p className="text-muted-foreground leading-relaxed">
            Многоагентная задача формализуется как <strong className="text-foreground">decentralized-POMDP</strong> —
            кортеж <Math display={false}>{String.raw`(N, \mathcal{S}, \mathcal{O}, \mathcal{A}, P, r, \gamma)`}</Math>, где:
          </p>
          <ul className="space-y-1.5 mt-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><Math display={false}>{String.raw`N`}</Math> — число агентов (может быть переменным),</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><Math display={false}>{String.raw`\mathcal{S}`}</Math> — глобальное пространство состояний среды,</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><Math display={false}>{String.raw`\mathcal{O} = \mathcal{O}_1 \times \cdots \times \mathcal{O}_N`}</Math> — совместное пространство наблюдений,</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><Math display={false}>{String.raw`\mathcal{A} = \mathcal{A}_1 \times \cdots \times \mathcal{A}_N`}</Math> — совместное пространство действий,</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><Math display={false}>{String.raw`P`}</Math> — функция переходов, <Math display={false}>{String.raw`r(s, \mathbf{a})`}</Math> — <strong className="text-foreground">общая</strong> функция награды, <Math display={false}>{String.raw`\gamma`}</Math> — дисконт.</span></li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Ключевое слово — <strong className="text-foreground">decentralized</strong>: агент{" "}
            <Math display={false}>{String.raw`i`}</Math> в момент <Math display={false}>{String.raw`t`}</Math> видит только своё
            локальное наблюдение <Math display={false}>{String.raw`o^i_t`}</Math>, коррелирующее с{" "}
            <Math display={false}>{String.raw`s_t`}</Math>, но не сам глобальный <Math display={false}>{String.raw`s_t`}</Math>.
            Совместная политика факторизуется:
          </p>
          <Math>{String.raw`\pi(\mathbf{a}_t \mid \mathbf{o}_t) = \prod_{i=1}^{N} \pi_i(a^i_t \mid o^i_t),`}</Math>
          <p className="text-muted-foreground leading-relaxed mt-1">— каждый агент действует по своим наблюдениям, независимо.</p>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">Нестационарность среды</h3>
          <p className="text-muted-foreground leading-relaxed">
            Из-за совместного обучения среда с точки зрения агента <Math display={false}>{String.raw`i`}</Math> нестационарна:
            переход <Math display={false}>{String.raw`s_{t+1} \sim P(\cdot \mid s_t, a^i_t, \mathbf{a}^{-i}_t)`}</Math> зависит
            от действий всех остальных агентов <Math display={false}>{String.raw`\mathbf{a}^{-i}_t`}</Math>, политики которых
            постоянно меняются. Марковское предположение нарушается.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">Парадигма CTDE</h3>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Centralized Training with Decentralized Execution (CTDE)</strong> —
            главная парадигма решения: во время <strong className="text-foreground">обучения</strong> критик имеет
            доступ к глобальной информации (состояния и действия всех агентов), а во время{" "}
            <strong className="text-foreground">исполнения</strong> каждый актор работает только по своим локальным
            наблюдениям <Math display={false}>{String.raw`o^i`}</Math>.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Это элегантное разделение: вы можете обучить богатого «координатора» (критика), который
            видит всё, — но в продакшне каждый робот или агент работает автономно, без общения.
            Критик нужен только при обучении.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Три подхода к реализации CTDE (в статье MA-POCA):
          </p>
          <TableWrap>
            <thead>
              <tr>
                <TH>Подход</TH>
                <TH>Критик</TH>
                <TH>Акторы</TH>
                <TH>Проблема</TH>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TD><strong className="text-foreground">IAC</strong> (Independent Actor-Critic)</TD>
                <TD>Отдельный на каждого агента</TD>
                <TD>Независимые</TD>
                <TD>Не координирует; частичная наблюдаемость</TD>
              </tr>
              <tr>
                <TD><strong className="text-foreground">JAC</strong> (Joint Actor-Critic)</TD>
                <TD>Общий, видит всё</TD>
                <TD>Общий, видит всё</TD>
                <TD>Требует полной коммуникации на исполнении</TD>
              </tr>
              <tr>
                <TD><strong className="text-foreground">IACC</strong> (Independent Actors, Centralized Critic)</TD>
                <TD><strong className="text-foreground">Один централизованный</strong></TD>
                <TD>Независимые</TD>
                <TD>✅ Золотая середина — это MA-POCA</TD>
              </tr>
            </tbody>
          </TableWrap>
          <KeyPoints
            items={[
              "Многоагентная задача — decentralized-POMDP: глобальное состояние, но агент видит только своё наблюдение.",
              "Нестационарность: среда меняется, потому что соседи учатся — марковское предположение нарушается.",
              "CTDE — решение: централизованный критик при обучении, децентрализованные акторы при исполнении.",
              "MA-POCA реализует IACC: один общий критик + набор независимых акторов.",
            ]}
          />
        </section>

        {/* ── Раздел 2 ── */}
        <section>
          <h2 id="раздел-2-counterfactual-baseline-и-командный-credit-assignment" className={SECTION_H2}>
            Раздел 2. Counterfactual baseline и командный credit assignment
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Централизованный критик знает совместное <Math display={false}>{String.raw`Q^\pi(s, \mathbf{a})`}</Math> —
            ценность совместного действия всей команды. Но нам нужно приписать каждому агенту{" "}
            <Math display={false}>{String.raw`i`}</Math> его <strong className="text-foreground">индивидуальный</strong> вклад. Как?
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Идея COMA: counterfactual baseline</h3>
          <p className="text-muted-foreground leading-relaxed">
            Counterfactual Multi-Agent Policy Gradients (COMA, Foerster et al. 2018) предложил
            элегантный ответ: <strong className="text-foreground">сравни фактическое действие агента с тем, что
            было бы, если бы он действовал иначе, — при фиксированных действиях всех остальных.</strong>
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Определим <strong className="text-foreground">counterfactual baseline</strong> для агента{" "}
            <Math display={false}>{String.raw`i`}</Math> (уравнение (3) в MA-POCA):
          </p>
          <Math>{String.raw`b_i(s, \mathbf{a}) = \mathbb{E}_{a' \sim \pi_i(\cdot \mid o^i)}\!\left[ Q^\pi\!\left(s,\, (\mathbf{a}^{-i},\, a')\right) \right],`}</Math>
          <p className="text-muted-foreground leading-relaxed mt-1">
            где <Math display={false}>{String.raw`\mathbf{a}^{-i}`}</Math> — действия всех агентов{" "}
            <strong className="text-foreground">кроме</strong> <Math display={false}>{String.raw`i`}</Math> (зафиксированы), а{" "}
            <Math display={false}>{String.raw`a'`}</Math> — гипотетическое действие агента <Math display={false}>{String.raw`i`}</Math>,
            усреднённое по его текущей политике.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Тогда <strong className="text-foreground">counterfactual advantage</strong> агента{" "}
            <Math display={false}>{String.raw`i`}</Math> (уравнение (4)):
          </p>
          <Math>{String.raw`\hat{A}_i = Q^\pi(s, \mathbf{a}) - b_i(s, \mathbf{a}).`}</Math>
          <p className="text-muted-foreground leading-relaxed mt-1">
            Смысл прозрачен: <Math display={false}>{String.raw`\hat{A}_i > 0`}</Math> означает, что агент{" "}
            <Math display={false}>{String.raw`i`}</Math> сыграл <strong className="text-foreground">лучше</strong>, чем его
            средний ход при тех же действиях команды. <Math display={false}>{String.raw`\hat{A}_i < 0`}</Math> — хуже.
            Это и есть индивидуальный вклад.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Обновление политики агента <Math display={false}>{String.raw`i`}</Math> (уравнение (5)):
          </p>
          <Math>{String.raw`\nabla_{\theta_i} J(\theta_i) = \mathbb{E}_{\substack{s \sim \rho^\pi \\ a^i \sim \pi_i}}\!\left[ \nabla_{\theta_i} \log \pi_i(a^i \mid o^i) \cdot \hat{A}_i \right].`}</Math>
          <p className="text-muted-foreground leading-relaxed mt-1">
            Сравните с обычным policy gradient из{" "}
            <CrossLinkToHub hubPath="/courses/3-1" hubAnchor="раздел-6-reparameterization-trick-для-стохастической-политики" hubTitle="Урок 3.1 — Reparameterization trick">урока 3.1</CrossLinkToHub> —
            структура та же, только advantage теперь контрфактический. Строгий вывод counterfactual
            baseline — в{" "}
            <CrossLinkToHub hubPath="/algorithms/poca" hubAnchor="counterfactual-baseline" hubTitle="MA-POCA — counterfactual baseline">хабе по командному credit assignment</CrossLinkToHub>.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">Почему это работает лучше, чем просто вычесть V</h3>
          <p className="text-muted-foreground leading-relaxed">
            В однагентном PPO мы вычитаем <Math display={false}>{String.raw`V(s)`}</Math> — «базовый уровень» из состояния,
            независимый от действия. В MARL обычный <Math display={false}>{String.raw`V(s)`}</Math> не несёт информации о том,{" "}
            <strong className="text-foreground">кто именно</strong> помог. Counterfactual baseline делает тонче: он
            маргинализирует только действие агента <Math display={false}>{String.raw`i`}</Math>, оставляя действия команды
            фиксированными. Это «честное» сравнение: «что получила бы команда, если бы все сыграли
            так же, кроме меня?»
          </p>
          <KeyPoints
            items={[
              <>Counterfactual baseline <Math display={false}>{String.raw`b_i`}</Math>: маргинализирует действие агента <Math display={false}>{String.raw`i`}</Math> при фиксированных <Math display={false}>{String.raw`\mathbf{a}^{-i}`}</Math>.</>,
              <>Counterfactual advantage <Math display={false}>{String.raw`\hat{A}_i = Q^\pi(s, \mathbf{a}) - b_i`}</Math> — индивидуальный вклад агента.</>,
              <>Обновление политики — стандартный policy gradient с <Math display={false}>{String.raw`\hat{A}_i`}</Math> вместо обычного advantage.</>,
              <>Это точнее обычного <Math display={false}>{String.raw`V(s)`}</Math>: сравнение «что было бы, если бы только я сыграл иначе».</>,
            ]}
          />
        </section>

        {/* ── Раздел 3 ── */}
        <section>
          <h2 id="раздел-3-posthumous-credit-assignment" className={SECTION_H2}>
            Раздел 3. Posthumous credit assignment: зачем агенту умирать за команду
          </h2>

          <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Проблема</h3>
          <p className="text-muted-foreground leading-relaxed">
            Кооперативные среды часто предполагают, что агент может{" "}
            <strong className="text-foreground">выбыть из эпизода раньше остальных</strong> — погибнуть,
            разрядиться, быть деактивированным — и при этом получить командную награду, которую
            заработают другие <strong className="text-foreground">после</strong> его выбытия.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Представьте сцену из Dungeon Escape (канонический пример из статьи MA-POCA): чтобы выпал
            ключ, один из агентов должен убить дракона. Убивая дракона, агент погибает сам. Остальные
            с ключом выходят из подземелья — и только тогда команда получает награду. Агент, который
            пожертвовал собой, уже мёртв и не увидит этой награды.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Как научить агента самопожертвованию? Это и есть задача{" "}
            <strong className="text-foreground">posthumous credit assignment</strong> — назначить заслугу агенту
            за действия, последствия которых он уже не наблюдает. MA-POCA — первая работа, где эта
            проблема названа явно и решена систематически (Cohen et al., Unity, 2021).
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">Стандартный «костыль»: absorbing states — и почему они плохи</h3>
          <p className="text-muted-foreground leading-relaxed">
            Обычный способ работы с выбывшими агентами — <strong className="text-foreground">поглощающее состояние</strong> (absorbing state).
            Агент <Math display={false}>{String.raw`i`}</Math> выбывает — его наблюдение фиксируется в специальном{" "}
            <Math display={false}>{String.raw`o^{abs}_i`}</Math>, и он «зависает» там до конца эпизода. Формально:{" "}
            <Math display={false}>{String.raw`P(o^{abs}_i \mid o^{abs}_i, a^i) = 1`}</Math> для любого <Math display={false}>{String.raw`a^i`}</Math>.
            Это позволяет существующим API работать без изменений.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Но статья MA-POCA доказывает <strong className="text-foreground">три проблемы</strong>:
          </p>
          <ol className="space-y-2 mt-2 text-sm text-muted-foreground list-decimal pl-5">
            <li>
              <strong className="text-foreground">Усложнение обучения нейросети.</strong> Absorbing states портят
              входное распределение критика. В toy-эксперименте (нейросеть считает среднее переменного
              числа чисел) sample complexity растёт с числом absorbing states — критик плохо
              обобщается.
            </li>
            <li>
              <strong className="text-foreground">Расход ресурсов.</strong> Критик раздут до максимально
              возможного числа агентов, даже если большинство неактивны. Неактивные обрабатываются и
              хранятся как обычные состояния. Если максимум агентов неизвестен (спавн) — критик вообще
              неограниченно «пухнет».
            </li>
            <li>
              <strong className="text-foreground">Высокая дисперсия.</strong> Одно <Math display={false}>{String.raw`o^{abs}`}</Math> соответствует
              всем исходам после раннего выхода (победа, поражение, ничья) — таргеты для этого состояния
              противоречивы и шумны.
            </li>
          </ol>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">Решение MA-POCA: self-attention только по активным агентам</h3>
          <p className="text-muted-foreground leading-relaxed">
            Вместо absorbing states MA-POCA применяет <strong className="text-foreground">self-attention
            исключительно к активным агентам</strong> в каждый момент времени. Архитектурный блок
            называется <strong className="text-foreground">RSA (Residual Self-Attention)</strong>:
          </p>
          <ol className="space-y-2 mt-2 text-sm text-muted-foreground list-decimal pl-5">
            <li>Наблюдения активных агентов эмбеддятся полносвязным слоем: <Math display={false}>{String.raw`e^i = \text{FC}(o^i)`}</Math>.</li>
            <li>Layer Normalization, затем multi-head scaled dot-product attention (Vaswani et al. 2017) по эмбеддингам активных агентов.</li>
            <li>Residual-связь + LayerNorm.</li>
            <li>Результат <strong className="text-foreground">усредняется</strong> в фиксированный по размеру вектор.</li>
            <li><strong className="text-foreground">Без позиционных кодировок</strong> → перестановочная инвариантность: порядок агентов не важен.</li>
          </ol>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Централизованная V-функция через RSA (уравнение (6)):
          </p>
          <Math>{String.raw`V_\phi\!\left(\text{RSA}\!\left(\{g_i(o^i_t)\}_{1 \le i \le k_t}\right)\right),`}</Math>
          <p className="text-muted-foreground leading-relaxed mt-1">
            где <Math display={false}>{String.raw`k_t`}</Math> — число <strong className="text-foreground">активных</strong> агентов в момент <Math display={false}>{String.raw`t`}</Math>.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            <strong className="text-foreground">Как это решает posthumous credit assignment.</strong> TD(<Math display={false}>{String.raw`\lambda`}</Math>)-таргет
            для V (уравнение (7)):
          </p>
          <Math>{String.raw`y^{(\lambda)} = (1{-}\lambda)\sum_{n=1}^{\infty} \lambda^{n-1} G^{(n)}_t, \quad G^{(n)}_t = \sum_{l=1}^{n} \gamma^{l-1} r_{t+l} + \gamma^n\, V_\phi\!\left(\text{RSA}\!\left(\{g_j(o^j_{t+n})\}_{1 \le j \le k_{t+n}}\right)\right).`}</Math>
          <p className="text-muted-foreground leading-relaxed mt-1">
            Bootstrap-член <Math display={false}>{String.raw`\gamma^n \cdot V_\phi(\text{RSA}(\ldots))`}</Math> на шаге{" "}
            <Math display={false}>{String.raw`t{+}n`}</Math> вычисляется по <strong className="text-foreground">активным агентам в{" "}
            <Math display={false}>{String.raw`t{+}n`}</Math></strong> — которых может быть больше или меньше, чем в{" "}
            <Math display={false}>{String.raw`t`}</Math>. Именно через этот bootstrap ценность из будущего (когда команда
            уже получила награду) распространяется на момент <Math display={false}>{String.raw`t`}</Math>, когда выбывший
            агент ещё был жив. Никаких absorbing states — только переменная по размеру entrada в RSA.
          </p>
          <InteractiveStub>
            Временная шкала эпизода. Агент A выбывает на шаге 5 из 10. Показать, как{" "}
            <Math display={false}>{String.raw`\gamma^5 \cdot V(\text{RSA}(\ldots))`}</Math> на шаге 10 «доходит» до шага 5 через
            bootstrap-цепочку.
          </InteractiveStub>
          <KeyPoints
            items={[
              "Posthumous credit assignment — задача наградить агента за вклад в результат, который он уже не увидит.",
              "Absorbing states — стандартный, но плохой подход: высокая дисперсия, раздутая сеть, сложность обучения.",
              "MA-POCA: self-attention только по активным агентам, RSA-блок с перестановочной инвариантностью.",
              <>TD(<Math display={false}>{String.raw`\lambda`}</Math>)-bootstrap через RSA «доставляет» будущую ценность команды к моменту, когда агент ещё был активен.</>,
            ]}
          />
        </section>

        {/* ── Раздел 4 ── */}
        <section>
          <h2 id="раздел-4-архитектура-ma-poca" className={SECTION_H2}>
            Раздел 4. Архитектура MA-POCA: две сети, один критик
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Практический SAC использовал <strong className="text-foreground">две Q-сети + политику</strong> (см.{" "}
            <CrossLinkToHub hubPath="/courses/3-1" hubAnchor="раздел-4-soft-policy-iteration-практический-sac" hubTitle="Урок 3.1 — Soft Policy Iteration">урок 3.1, раздел 4</CrossLinkToHub>).
            MA-POCA использует другой набор:
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            <strong className="text-foreground">Политика (Actor)</strong>{" "}
            <Math display={false}>{String.raw`\pi_{\theta_i}(a^i \mid o^i)`}</Math> — <strong className="text-foreground">отдельная</strong> для
            каждого агента, видит только локальное <Math display={false}>{String.raw`o^i`}</Math>. Структура: обычная
            нейросеть (MLP или CNN), выдаёт параметры распределения над действиями. Агенты с
            одинаковым пространством наблюдений <strong className="text-foreground">делят веса</strong>{" "}
            <Math display={false}>{String.raw`\theta`}</Math> — это и есть "shared policy".
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            <strong className="text-foreground">Централизованный critic (V-сеть)</strong>{" "}
            <Math display={false}>{String.raw`V_\phi(\text{RSA}(\{g_i(o^i)\}_{i \text{ active}}))`}</Math> —{" "}
            <strong className="text-foreground">один на всю команду</strong>, видит наблюдения всех активных
            агентов через RSA-блок. Выдаёт скалярную оценку ценности совместного состояния.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            <strong className="text-foreground">Baseline-сеть</strong>{" "}
            <Math display={false}>{String.raw`Q_\psi(\text{RSA}(g_j(o^j),\, \{f_i(o^i, a^i)\}_{i \ne j}))`}</Math> — обусловлена парами
            наблюдение-действие всех агентов <strong className="text-foreground">кроме</strong> <Math display={false}>{String.raw`j`}</Math> и
            только наблюдением агента <Math display={false}>{String.raw`j`}</Math>. Нужна для вычисления counterfactual
            advantage. Обучается <strong className="text-foreground">отдельной сетью</strong> — потому что с одной
            командой наблюдений можно сгенерировать до <Math display={false}>{String.raw`N`}</Math> сэмплов для baseline
            (по одному на каждого <Math display={false}>{String.raw`j`}</Math>), но только один для V. Общая сеть привела бы
            к «доминированию baseline» при обучении.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Все три сети обновляются через <strong className="text-foreground">PPO-клиппинг</strong> — именно поэтому
            MA-POCA не требует отдельных гиперпараметров и работает на тех же настройках, что PPO.
          </p>
          <KeyPoints
            items={[
              <>Actor: отдельный на каждого агента (или общий при одинаковых obs-пространствах), видит только <Math display={false}>{String.raw`o^i`}</Math>.</>,
              "V-критик: один на команду, RSA по всем активным агентам.",
              <>Baseline-сеть: считает counterfactual Q для каждого агента <Math display={false}>{String.raw`j`}</Math>; обучается отдельно от V.</>,
              "Обновления — через PPO-клиппинг; отдельных POCA-гиперпараметров нет.",
            ]}
          />
        </section>

        {/* ── Раздел 5 ── */}
        <section>
          <h2 id="раздел-5-ma-poca-в-unity-ml-agents" className={SECTION_H2}>
            Раздел 5. MA-POCA в Unity ML-Agents: групповые награды и YAML
          </h2>

          <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Групповые vs индивидуальные награды</h3>
          <p className="text-muted-foreground leading-relaxed">Unity различает два типа наград:</p>
          <ul className="space-y-1.5 mt-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">agent.AddReward(r)</code> / <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">agent.SetReward(r)</code> — <strong className="text-foreground">индивидуальная</strong> награда конкретному агенту.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">m_AgentGroup.AddGroupReward(r)</code> — <strong className="text-foreground">групповая</strong> награда, распределяется на всю команду через MA-POCA.</span></li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Групповые награды — это то, что MA-POCA умеет обрабатывать правильно. Индивидуальные тоже
            работают (они суммируются к групповым), но именно групповые активируют механизм credit
            assignment и posthumous propagation.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">Канонический C#-паттерн:</p>
          <CyberCodeBlock language="csharp" filename="MultiAgentGroup.cs">
{`// Initialize()
m_AgentGroup = new SimpleMultiAgentGroup();
foreach (var agent in allAgents) m_AgentGroup.RegisterAgent(agent);

// При голе / ключевом событии
m_AgentGroup.AddGroupReward(rewardForGoal);

// Завершение эпизода
m_AgentGroup.EndGroupEpisode();   // нормальное завершение
// или
m_AgentGroup.GroupEpisodeInterrupted();  // по тайм-ауту
// + сброс сцены`}
          </CyberCodeBlock>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">Полный YAML-конфиг (SoccerTwos, 2v2, poca + self_play)</h3>
          <CyberCodeBlock language="python" filename="SoccerTwos.yaml">
{`behaviors:
  SoccerTwos:
    trainer_type: poca

    hyperparameters:
      batch_size: 2048
      buffer_size: 20480
      learning_rate: 0.0003
      beta: 0.005            # энтропийный коэффициент (как в PPO)
      epsilon: 0.2            # клиппинг PPO (как в PPO)
      lambd: 0.95             # GAE λ
      num_epoch: 3
      learning_rate_schedule: constant

    network_settings:
      normalize: false
      hidden_units: 512
      num_layers: 2
      vis_encode_type: simple

    reward_signals:
      extrinsic:
        gamma: 0.99
        strength: 1.0

    keep_checkpoints: 5
    max_steps: 5000000
    time_horizon: 1000
    summary_freq: 10000

    self_play:
      save_steps: 50000
      team_change: 200000
      swap_steps: 2000
      window: 10
      play_against_latest_model_ratio: 0.5
      initial_elo: 1200.0`}
          </CyberCodeBlock>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">Разбор полей POCA</h3>
          <p className="text-muted-foreground leading-relaxed">
            <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">trainer_type: poca</code> выбирает алгоритм.
            Все гиперпараметры внутри <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">hyperparameters</code> —{" "}
            <strong className="text-foreground">идентичны PPO</strong> (разобраны в{" "}
            <CrossLinkToHub hubPath="/courses/3-1" hubAnchor="раздел-12-sac-в-unity-ml-agents" hubTitle="Урок 3.1 — SAC в Unity ML-Agents">уроке 3.1</CrossLinkToHub> для
            SAC и применимы к poca так же). Отдельных POCA-специфичных полей не существует —
            архитектура RSA и baseline-сеть встроены в тренер автоматически.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Единственное, на что стоит обратить внимание в{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">network_settings</code>:
          </p>
          <ul className="space-y-1.5 mt-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground"><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">hidden_units: 512</code></strong> — для командной задачи обычно нужнее бо́льшая ёмкость, чем в одноагентной (дефолт 128 часто мал).</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground"><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">time_horizon: 1000</code></strong> — SoccerTwos требует длинных траекторий, потому что игровые эпизоды долгие.</span></li>
          </ul>
          <KeyPoints
            items={[
              <><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">AddGroupReward()</code> через <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">SimpleMultiAgentGroup</code> — правильный способ задавать командную награду.</>,
              <><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">trainer_type: poca</code> + те же гиперпараметры, что у PPO; отдельных POCA-полей нет.</>,
              <><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">hidden_units: 512</code> и <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">time_horizon: 1000</code> — типичные значения для командных задач.</>,
            ]}
          />
        </section>

        {/* ── Раздел 6 ── */}
        <section>
          <h2 id="раздел-6-self-play" className={SECTION_H2}>
            Раздел 6. Self-Play: агент учится у самого себя
          </h2>

          <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Концепция и авто-curriculum</h3>
          <p className="text-muted-foreground leading-relaxed">
            Self-play — обучение агента, играющего против <strong className="text-foreground">копий и прошлых
            версий себя</strong>.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Ключевое свойство: такая среда содержит <strong className="text-foreground">встроенный
            авто-curriculum</strong>. Агент-новичок сначала играет против такого же новичка — это
            посильная задача. По мере роста мастерства растёт и сложность соперника. Авто-curriculum
            не нужно проектировать вручную — он возникает сам из-за того, что оппонент — это ты сам,
            только вчерашний.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Исторически этот принцип использовался в TD-Gammon (Tesauro, 1995) и был доведён до
            сверхчеловеческого уровня в AlphaGo/AlphaZero (Silver et al., 2016). OpenAI показал его
            силу в простых физических средах: гуманоиды, обученные только на разреженной награде
            «победа/поражение» через PPO и self-play, <strong className="text-foreground">эмерджентно</strong> освоили
            бег, блокирование, уклонение и подкаты — никто эти навыки не программировал явно.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">Нестационарность в self-play и пул снапшотов</h3>
          <p className="text-muted-foreground leading-relaxed">
            В self-play нестационарность — та же проблема, что в MARL вообще: обучаешься против
            соперника, который сам учится. Если всегда играть против <strong className="text-foreground">самой
            последней</strong> версии себя, обучение нестабильно — агент «гоняется за собственным
            хвостом».
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Решение Unity ML-Agents: <strong className="text-foreground">пул снапшотов</strong>. Политика агента
            периодически сохраняется как snapshot. При каждом матче оппонент выбирается{" "}
            <strong className="text-foreground">случайно из пула прошлых версий</strong> (с вероятностью{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">1 - play_against_latest_model_ratio</code>) или
            берётся последняя версия (с вероятностью{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">play_against_latest_model_ratio</code>).
            Разнообразие соперников → робастность → стабильность обучения.
          </p>
          <InteractiveStub>
            Шкала времени с нарастающими snpashoti-точками; агент в текущий момент тянет случайного
            оппонента из пула. Слайдер{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">play_against_latest_model_ratio</code>{" "}
            показывает, как меняется распределение выбора оппонента.
          </InteractiveStub>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">Когда кумулятивная награда бесполезна: нужен ELO</h3>
          <p className="text-muted-foreground leading-relaxed">
            В adversarial-играх кумулятивная награда — плохая метрика прогресса. Сильный агент
            получает меньше наград против сильных соперников, чем слабый против слабых. Значение само
            по себе ни о чём не говорит.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Вместо этого используют <strong className="text-foreground">рейтинг ELO</strong> — относительный
            уровень мастерства в zero-sum игре. При корректном обучении ELO должен{" "}
            <strong className="text-foreground">стабильно расти</strong> — это и есть нужная метрика.
          </p>
          <KeyPoints
            items={[
              "Self-play = авто-curriculum: сложность соперника растёт вместе с агентом.",
              "Пул снапшотов прошлых версий решает нестационарность: случайный оппонент из прошлого → разнообразие и стабильность.",
              "Кумулятивная награда в adversarial-играх бессмысленна — нужен ELO.",
            ]}
          />
        </section>

        {/* ── Раздел 7 ── */}
        <section>
          <h2 id="раздел-7-система-рейтинга-elo" className={SECTION_H2}>
            Раздел 7. Система рейтинга ELO
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">ELO</strong> — рейтинговая система из шахмат (Arpad Elo,
            1960-е), адаптированная для zero-sum игр.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Ожидаемый результат</h3>
          <p className="text-muted-foreground leading-relaxed">
            Если агент A имеет рейтинг <Math display={false}>{String.raw`R_A`}</Math>, а агент B —{" "}
            <Math display={false}>{String.raw`R_B`}</Math>, ожидаемый результат A:
          </p>
          <Math>{String.raw`E_A = \frac{1}{1 + 10^{(R_B - R_A)/400}}.`}</Math>
          <p className="text-muted-foreground leading-relaxed mt-1">
            При равных рейтингах <Math display={false}>{String.raw`E_A = 0.5`}</Math>. При разрыве 300 очков в пользу A:{" "}
            <Math display={false}>{String.raw`E_A \approx 0.85`}</Math>, <Math display={false}>{String.raw`E_B \approx 0.15`}</Math>.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">Обновление рейтинга</h3>
          <p className="text-muted-foreground leading-relaxed">После матча:</p>
          <Math>{String.raw`R'_A = R_A + K \cdot (S_A - E_A),`}</Math>
          <p className="text-muted-foreground leading-relaxed mt-1">
            где <Math display={false}>{String.raw`S_A \in \{1, 0.5, 0\}`}</Math> — фактический исход
            (победа/ничья/поражение), <Math display={false}>{String.raw`K = 16`}</Math> — константа скорости обновления.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            <strong className="text-foreground">Пример Tennis</strong> (из документации Unity): оба стартуют с{" "}
            <Math display={false}>{String.raw`R = 1200`}</Math>, <Math display={false}>{String.raw`E_A = E_B = 0.5`}</Math>.
          </p>
          <ul className="space-y-1.5 mt-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span>A побеждает: <Math display={false}>{String.raw`R'_A = 1200 + 16 \cdot (1 - 0.5) = \mathbf{1208}`}</Math>, <Math display={false}>{String.raw`R'_B = 1200 + 16 \cdot (0 - 0.5) = \mathbf{1192}`}</Math>.</span></li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">Zero-sum условие</h3>
          <p className="text-muted-foreground leading-relaxed">
            ELO требует <strong className="text-foreground">zero-sum</strong> структуры наград: когда A получает{" "}
            <Math display={false}>{String.raw`+1`}</Math>, B получает <Math display={false}>{String.raw`-1`}</Math>. Документация Unity
            предупреждает: <em>«финальная награда в траектории должна быть +1 (победа), 0 (ничья) или
            −1 (поражение)»</em> — именно от этого зависит корректность расчёта. Это не ограничение
            середины эпизода (там можно давать dense-награды), а условие на{" "}
            <strong className="text-foreground">финальную</strong> награду.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">Как читать ELO в TensorBoard</h3>
          <p className="text-muted-foreground leading-relaxed">
            Метрика <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">Self-Play/ELO</code> — единственная
            документированная self-play-метрика в TensorBoard. Интерпретация:
          </p>
          <ul className="space-y-1.5 mt-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">Растёт</strong> — агент прогрессирует ✅</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">Первые ~2M шагов падает ниже 1200</strong> — норма: агенты двигаются почти случайно, результаты непредсказуемы.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">Плато после 3–5M шагов</strong> — проверьте <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">play_against_latest_model_ratio</code> и функцию награды.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">Осциллирует, не растёт</strong> — вероятно, нестабильность из-за высокого <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">play_against_latest_model_ratio</code> или слишком маленького <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">window</code>/<code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">save_steps</code>.</span></li>
          </ul>
          <KeyPoints
            items={[
              <><Math display={false}>{String.raw`E_A = 1/(1 + 10^{(R_B - R_A)/400})`}</Math> — ожидаемый результат по рейтингам.</>,
              <><Math display={false}>{String.raw`R'_A = R_A + K \cdot (S_A - E_A)`}</Math>, <Math display={false}>{String.raw`K = 16`}</Math> в ML-Agents.</>,
              <>Zero-sum требование: финальная награда строго <Math display={false}>{String.raw`+1 / 0 / -1`}</Math>.</>,
              <>В TensorBoard: только <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">Self-Play/ELO</code>; стабильный рост = прогресс.</>,
            ]}
          />
        </section>

        {/* ── Раздел 8 ── */}
        <section>
          <h2 id="раздел-8-self-play-в-unity-ml-agents" className={SECTION_H2}>
            Раздел 8. Self-Play в Unity ML-Agents: YAML и все поля
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Self-play добавляется как подсекция{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">self_play:</code> к{" "}
            <strong className="text-foreground">любому</strong> тренеру{" "}
            (<code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">ppo</code>,{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">poca</code>). Ниже — полный разбор всех полей.
          </p>
          <CyberCodeBlock language="python" filename="self_play.yaml">
{`self_play:
  save_steps: 20000        # дефолт
  team_change: 100000      # дефолт = 5 × save_steps
  swap_steps: 10000        # дефолт
  window: 10               # дефолт
  play_against_latest_model_ratio: 0.5   # дефолт
  initial_elo: 1200.0      # дефолт`}
          </CyberCodeBlock>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">Поле за полем</h3>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground"><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">save_steps</code></strong>{" "}
            <em>(дефолт: <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">20000</code>)</em> — число{" "}
            <strong className="text-foreground">trainer-шагов</strong> (шагов обучения) между сохранениями
            очередного snapshot политики в пул. Больше значение → в пуле больше «разброс по времени» →
            разнообразнее соперники. Типичный диапазон: <Math display={false}>{String.raw`10\,000`}</Math>–<Math display={false}>{String.raw`100\,000`}</Math>.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            <strong className="text-foreground"><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">team_change</code></strong>{" "}
            <em>(дефолт: <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">5 × save_steps</code>)</em> — число
            trainer-шагов между сменой <strong className="text-foreground">обучающейся</strong> команды (применимо в
            team-vs-team с двумя разными <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">trainer_type</code>).
            Слишком долгое обучение против одних оппонентов → переобучение под их стратегии.
            Рекомендация Unity: ставить <strong className="text-foreground">4–5× <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">save_steps</code></strong>.
            В SoccerTwos: <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">save_steps=50000</code>,{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">team_change=200000</code> (= 4×).
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            <strong className="text-foreground"><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">swap_steps</code></strong>{" "}
            <em>(дефолт: <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">10000</code>)</em> — число{" "}
            <strong className="text-foreground">ghost-шагов</strong> (шагов агента-«призрака», следующего
            фиксированной политике, не обучающегося) между сменой оппонента из пула. Формула для{" "}
            <Math display={false}>{String.raw`x`}</Math> свопов за <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">team_change</code>:
            при равных командах <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">swap_steps = team_change / x</code>.
            Для асимметричного 2v1 (Strikers Vs Goalie): команда из 1 агента →{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">swap_steps = (1/2) × (team_change / x)</code>;
            команда из 2 агентов → <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">swap_steps = (2/1) × (team_change / x)</code>.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            <strong className="text-foreground"><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">window</code></strong>{" "}
            <em>(дефолт: <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">10</code>)</em> — размер скользящего
            окна пула прошлых снапшотов. Старейший вытесняется, когда добавляется новый. Больше →
            разнообразнее соперники, медленнее нарастает сложность. Типичный диапазон:{" "}
            <Math display={false}>{String.raw`5`}</Math>–<Math display={false}>{String.raw`30`}</Math>.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            <strong className="text-foreground"><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">play_against_latest_model_ratio</code></strong>{" "}
            <em>(дефолт: <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">0.5</code>)</em> — вероятность
            сыграть против <strong className="text-foreground">последней</strong> версии политики;{" "}
            <Math display={false}>{String.raw`1 - \text{ratio}`}</Math> — против случайного снапшота из пула. Выше →
            агрессивнее авто-curriculum, но нестабильнее. Ниже → стабильнее, но медленнее растёт
            сложность.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            <strong className="text-foreground"><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">initial_elo</code></strong>{" "}
            <em>(дефолт: <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">1200.0</code>)</em> — стартовый ELO
            для всех агентов.
          </p>
          <Callout color="amber" icon={AlertTriangle} title="Важно.">
            <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">threaded: false</code> при self-play — дефолт{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">false</code> и так, но не меняйте: документация
            Unity предупреждает, что threaded-режим при self-play снижает производительность.
          </Callout>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">Симметричные vs асимметричные игры</h3>
          <ul className="space-y-1.5 mt-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">Симметричные</strong> (Tennis, SoccerTwos): все агенты/команды используют <strong className="text-foreground">одно</strong> поведение (<code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">behavior_name</code>). Один YAML-блок, одна секция <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">self_play</code>.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">Асимметричные</strong> (Strikers Vs Goalie): разные роли — <strong className="text-foreground">разные</strong> <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">behavior_name</code>, каждому своя секция <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">self_play</code> в YAML, каждый тренируется против ghost-версии другого.</span></li>
          </ul>
          <KeyPoints
            items={[
              <><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">self_play:</code> добавляется к любому тренеру (ppo или poca).</>,
              <><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">team_change ≈ 4–5× save_steps</code> — эмпирическое правило Unity.</>,
              <><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">swap_steps</code> считается в ghost-шагах, а не trainer-шагах — не путать.</>,
              <>При asymmetric: разные <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">behavior_name</code>, у каждого своя секция <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">self_play</code>.</>,
            ]}
          />
        </section>

        {/* ── Раздел 9 ── */}
        <section>
          <h2 id="раздел-9-когда-что-использовать" className={SECTION_H2}>
            Раздел 9. Когда что использовать: сравнительная таблица
          </h2>
          <TableWrap>
            <thead>
              <tr>
                <TH>Критерий</TH>
                <TH>MA-POCA (poca)</TH>
                <TH>Self-Play (self_play)</TH>
                <TH>Комбо (poca + self_play)</TH>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TD>Тип задачи</TD>
                <TD>Кооперативная команда с общей наградой</TD>
                <TD>Соревновательный матч 1v1 или NvN</TD>
                <TD>Team vs Team (кооперация + конкуренция)</TD>
              </tr>
              <tr>
                <TD>Число агентов</TD>
                <TD>Переменное (спавн/смерть в эпизоде)</TD>
                <TD>Фиксированное</TD>
                <TD>Фиксированные команды, переменные игроки внутри</TD>
              </tr>
              <tr>
                <TD>Credit assignment</TD>
                <TD>Posthumous + counterfactual ✅</TD>
                <TD>Не нужен (нет команды)</TD>
                <TD>По команде через MA-POCA</TD>
              </tr>
              <tr>
                <TD>Метрика прогресса</TD>
                <TD>Кумулятивная награда</TD>
                <TD><strong className="text-foreground">ELO</strong></TD>
                <TD>ELO (между командами) + награда (внутри команды)</TD>
              </tr>
              <tr>
                <TD>Базовый алгоритм</TD>
                <TD>PPO (встроен)</TD>
                <TD>PPO или POCA</TD>
                <TD>POCA</TD>
              </tr>
              <tr>
                <TD>Канонический пример</TD>
                <TD>Dungeon Escape, DodgeBall (Elimination)</TD>
                <TD>Tennis, SoccerTwos (только self_play)</TD>
                <TD>SoccerTwos, DodgeBall (Capture the Flag)</TD>
              </tr>
              <tr>
                <TD>Когда НЕ подходит</TD>
                <TD>Соревновательные матчи без команды</TD>
                <TD>Кооперация без соперника</TD>
                <TD>Чистая кооперация без соревнования</TD>
              </tr>
            </tbody>
          </TableWrap>
          <KeyPoints
            items={[
              "MA-POCA — для кооперации и переменного числа агентов.",
              "Self-Play — для adversarial/соревновательного; ELO как метрика.",
              "Комбо poca + self_play = team-vs-team (SoccerTwos, DodgeBall).",
            ]}
          />
        </section>

        {/* ── Раздел 10 ── */}
        <section>
          <h2 id="раздел-10-гиперпараметры-и-диагностика" className={SECTION_H2}>
            Раздел 10. Гиперпараметры и диагностика
          </h2>

          <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Тюнинг MA-POCA</h3>
          <p className="text-muted-foreground leading-relaxed">
            Поскольку POCA использует те же гиперпараметры, что PPO, большинство советов по PPO
            применимы напрямую. Специфика для командных задач:
          </p>
          <ul className="space-y-1.5 mt-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground"><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">hidden_units: 512</code>, <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">num_layers: 2</code></strong> — для командных задач обычно нужна бо́льшая ёмкость, чем дефолтные 128.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground"><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">time_horizon: 1000</code></strong> — эпизоды в командных играх длиннее, нужен бо́льший горизонт.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">Простая разреженная групповая награда</strong> работает лучше, чем сложная dense-награда: MA-POCA умеет разворачивать разреженный сигнал через credit assignment.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">beta</code> (энтропия) — следите в TensorBoard. Если агенты слишком быстро «согласовывают» одну стратегию и перестают исследовать — поднимите <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">beta</code>.</span></li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">Тюнинг Self-Play</h3>
          <ul className="space-y-1.5 mt-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground"><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">save_steps</code></strong>: начните с дефолта <Math display={false}>{String.raw`20\,000`}</Math>. Если ELO осциллирует — увеличьте.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground"><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">team_change</code></strong>: держите <Math display={false}>{String.raw`\approx 4{-}5 \times`}</Math> <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">save_steps</code>. В SoccerTwos: <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">save_steps=50000</code> → <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">team_change=200000</code>.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground"><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">play_against_latest_model_ratio</code></strong>: начните с <Math display={false}>{String.raw`0.5`}</Math>. Нестабильный ELO → снизьте до <Math display={false}>{String.raw`0.3`}</Math>.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">Функция награды</strong>: оставьте максимально простой (+1 за победу, −1 за поражение). Dense-награды в середине эпизода допустимы, но финальная должна быть строго <Math display={false}>{String.raw`\pm 1`}</Math> или <Math display={false}>{String.raw`0`}</Math>.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">Ранние шаги ELO</strong>: не паникуйте, если ELO &lt; 1200 первые <Math display={false}>{String.raw`1{-}2`}</Math>M шагов — агенты ещё «случайные».</span></li>
          </ul>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">Диагностика в TensorBoard</h3>
          <TableWrap>
            <thead>
              <tr>
                <TH>Что смотреть</TH>
                <TH>Хорошо</TH>
                <TH>Плохо → что делать</TH>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TD><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">Self-Play/ELO</code></TD>
                <TD>Стабильно растёт</TD>
                <TD>Осциллирует → снизить <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">play_against_latest_model_ratio</code>; плато → увеличить <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">save_steps</code></TD>
              </tr>
              <tr>
                <TD>Кумулятивная награда (poca)</TD>
                <TD>Растёт постепенно</TD>
                <TD>Не растёт → проверить <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">AddGroupReward</code> vs <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">AddReward</code>, размер <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">hidden_units</code></TD>
              </tr>
              <tr>
                <TD>Policy Entropy</TD>
                <TD>Медленно снижается</TD>
                <TD>Резко падает в 0 → поднять <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">beta</code>; не падает → снизить <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">beta</code></TD>
              </tr>
              <tr>
                <TD>Value Loss</TD>
                <TD>Убывает</TD>
                <TD>Не убывает → увеличить <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">time_horizon</code> или <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">num_epoch</code></TD>
              </tr>
            </tbody>
          </TableWrap>
          <KeyPoints
            items={[
              <>Для poca: больший <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">hidden_units</code>/<code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">time_horizon</code>, простая разреженная групповая награда.</>,
              <>Для self-play: <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">team_change ≈ 4–5× save_steps</code>, награда <Math display={false}>{String.raw`\pm 1 / 0`}</Math> на финале.</>,
              <>ELO &lt; 1200 в первые <Math display={false}>{String.raw`\sim 2`}</Math>M шагов — нормально.</>,
            ]}
          />
        </section>

        {/* ── Раздел 11 ── */}
        <section>
          <h2 id="раздел-11-расширение-гоночного-агента" className={SECTION_H2}>
            Раздел 11. Расширение гоночного агента: соревновательный и кооперативный форматы
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            В{" "}
            <CrossLinkToHub hubPath="/courses/project-3" hubTitle="Проект 3 — Гоночный агент">проекте 3</CrossLinkToHub>{" "}
            мы обучили одиночного гоночного агента. Теперь два пути его расширения.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">Путь A: соревновательная гонка (self-play)</h3>
          <p className="text-muted-foreground leading-relaxed">
            Несколько машин на трассе, побеждает первый финишировавший:
          </p>
          <ul className="space-y-1.5 mt-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span>Финальная награда: <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">+1</code> первой машине, <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">-1</code> остальным (или +1 / 0 при двух агентах).</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span>Убрать все dense-награды за прогресс по трассе (или оставить маленькими — для обучаемости).</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">trainer_type: ppo</code> + секция <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">self_play</code> (можно без poca, т.к. нет командной кооперации).</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span>Метрика: <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">Self-Play/ELO</code> — должна расти.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span>Ожидаемый эффект: агент научится агрессивным обгонам и защите позиции — это не программируется явно, а возникает эмерджентно.</span></li>
          </ul>
          <CyberCodeBlock language="python" filename="RacerCompetitive.yaml">
{`behaviors:
  RacerCompetitive:
    trainer_type: ppo
    hyperparameters:
      batch_size: 2048
      buffer_size: 20480
      beta: 0.005
      epsilon: 0.2
      lambd: 0.95
      num_epoch: 3
      learning_rate: 0.0003
      learning_rate_schedule: linear
    network_settings:
      normalize: true
      hidden_units: 256
      num_layers: 2
    reward_signals:
      extrinsic:
        gamma: 0.99
        strength: 1.0
    max_steps: 5000000
    self_play:
      save_steps: 20000
      team_change: 100000
      swap_steps: 2000
      window: 10
      play_against_latest_model_ratio: 0.5
      initial_elo: 1200.0`}
          </CyberCodeBlock>

          <h3 className="text-lg font-semibold text-foreground mt-5 mb-2">Путь B: командная эстафета (MA-POCA)</h3>
          <p className="text-muted-foreground leading-relaxed">
            Команда из N машин должна «довести хотя бы одну до финиша». Машины могут «жертвовать»
            собой — тараном блокировать соперника — пока партнёр едет к финишу.
          </p>
          <ul className="space-y-1.5 mt-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span>Групповая награда: <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">m_AgentGroup.AddGroupReward(+1)</code> при финише любого члена команды.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span>Штраф за выезд за трассу — индивидуально: <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">agent.AddReward(-0.1)</code>.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">trainer_type: poca</code> + <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">SimpleMultiAgentGroup</code>.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span>Здесь posthumous credit assignment в действии: машина, таранившая соперника и выбывшая, всё равно получит «заслугу» за победу партнёра — через RSA-bootstrap в MA-POCA.</span></li>
          </ul>
          <KeyPoints
            items={[
              "Соревновательный формат: ppo + self_play, финальная награда ±1, метрика ELO.",
              <>Кооперативный формат: poca + <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">SimpleMultiAgentGroup</code>, <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">AddGroupReward</code>.</>,
              "Эмерджентное поведение (обгоны, жертвование) не программируется — возникает из наград и алгоритма.",
            ]}
          />
        </section>

        {/* ── Итоги ── */}
        <section>
          <h2 id="итоги-урока" className={SECTION_H2}>Итоги урока</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">Нестационарность</strong> — фундаментальная проблема MARL: среда каждого агента нестационарна, потому что соседи учатся.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">Командный credit assignment</strong> — задача понять индивидуальный вклад при общей награде.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">CTDE</strong> — решение: централизованный критик при обучении, децентрализованные акторы при исполнении.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">Counterfactual baseline</strong> <Math display={false}>{String.raw`b_i = \mathbb{E}_{a' \sim \pi_i}[Q^\pi(s, (\mathbf{a}^{-i}, a'))]`}</Math> — сравнивает фактическое действие с «что было бы, если бы я сыграл иначе».</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">Posthumous credit assignment</strong> — задача наградить агента за вклад, чьи последствия он уже не наблюдает; MA-POCA решает её через self-attention без absorbing states.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">RSA-блок</strong> — self-attention по активным агентам с перестановочной инвариантностью; масштабируется на переменное <Math display={false}>{String.raw`N`}</Math>.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">MA-POCA в Unity</strong>: <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">trainer_type: poca</code> + <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">SimpleMultiAgentGroup</code> + <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">AddGroupReward</code>; те же гиперпараметры, что PPO.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">Self-play</strong> — авто-curriculum через игру против прошлых версий себя; пул снапшотов гасит нестационарность.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">ELO</strong> = <Math display={false}>{String.raw`R'_A = R_A + K(S_A - E_A)`}</Math>, <Math display={false}>{String.raw`K=16`}</Math> в ML-Agents; единственная осмысленная метрика в adversarial-играх.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">Self-play в Unity</strong>: секция <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">self_play:</code> к любому тренеру; <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">team_change ≈ 4–5× save_steps</code>; финальная награда строго <Math display={false}>{String.raw`\pm 1 / 0`}</Math>.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span><span><strong className="text-foreground">Комбо poca + self_play</strong> = team-vs-team (SoccerTwos, DodgeBall).</span></li>
          </ul>

          {/* Карта кросс-ссылок (служебное) */}
          <details className="mt-6 rounded-lg border border-border/30 bg-card/40 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-foreground select-none">
              Карта кросс-ссылок (служебное)
            </summary>
            <div className="mt-4">
              <p className="text-sm font-semibold text-foreground mb-2">Исходящие (урок → хаб/урок):</p>
              <TableWrap>
                <thead>
                  <tr>
                    <TH>Откуда</TH>
                    <TH>Цель</TH>
                    <TH>Якорь</TH>
                  </tr>
                </thead>
                <tbody>
                  <tr><TD>Раздел 0 — мост от PPO</TD><TD><code className="text-xs">/courses/3-1</code></TD><TD><code className="text-xs">#итоги</code></TD></tr>
                  <tr><TD>Раздел 2 — counterfactual baseline (строгий вывод)</TD><TD><code className="text-xs">/algorithms/poca</code></TD><TD><code className="text-xs">#counterfactual-baseline</code></TD></tr>
                  <tr><TD>Раздел 2 — связь с policy gradient</TD><TD><code className="text-xs">/courses/3-1</code></TD><TD><code className="text-xs">#раздел-6-reparameterization-trick</code></TD></tr>
                  <tr><TD>Раздел 4 — две Q-сети в SAC</TD><TD><code className="text-xs">/courses/3-1</code></TD><TD><code className="text-xs">#раздел-4-soft-policy-iteration-практический-sac</code></TD></tr>
                  <tr><TD>Раздел 5 — гиперпараметры poca (аналог SAC YAML)</TD><TD><code className="text-xs">/courses/3-1</code></TD><TD><code className="text-xs">#раздел-12-sac-в-unity-ml-agents</code></TD></tr>
                  <tr><TD>Раздел 11 — гоночный проект</TD><TD><code className="text-xs">/courses/project-3</code></TD><TD><code className="text-xs">#итоги</code></TD></tr>
                </tbody>
              </TableWrap>
              <p className="text-sm font-semibold text-foreground mt-4 mb-2">Якоря разделов этого урока (для обратных ссылок из хабов):</p>
              <ul className="space-y-1 text-xs text-muted-foreground font-mono">
                <li>#раздел-1-постановка-задачи-decentralized-pomdp-и-ctde</li>
                <li>#раздел-2-counterfactual-baseline-и-командный-credit-assignment</li>
                <li>#раздел-3-posthumous-credit-assignment</li>
                <li>#раздел-4-архитектура-ma-poca</li>
                <li>#раздел-5-ma-poca-в-unity-ml-agents</li>
                <li>#раздел-6-self-play</li>
                <li>#раздел-7-система-рейтинга-elo</li>
                <li>#раздел-8-self-play-в-unity-ml-agents</li>
              </ul>
            </div>
          </details>
        </section>

        {/* ── Источники ── */}
        <section>
          <h2 id="источники" className={SECTION_H2}>Источники</h2>
          <ol className="space-y-3 text-sm text-muted-foreground list-decimal pl-5">
            <li>
              <strong className="text-foreground">Cohen, A., Teng, E., Berges, V.-P., Dong, R.-P., Henry, H., Mattar, M., Zook, A., Ganguly, S. (Unity, 2021).</strong>{" "}
              <em>On the Use and Misuse of Absorbing States in Multi-agent Reinforcement Learning.</em> RL in Games Workshop, AAAI 2022. arXiv:2111.05992. — Определение MARL/dec-POMDP, posthumous credit assignment, критика absorbing states, RSA-блок, уравнения 1–8, эксперименты.
            </li>
            <li>
              <strong className="text-foreground">Foerster, J., Farquhar, G., Afouras, T., Nardelli, N., Whiteson, S. (Oxford, 2018).</strong>{" "}
              <em>Counterfactual Multi-Agent Policy Gradients.</em> AAAI-2018, стр. 2974–2982. arXiv:1705.08926. — Counterfactual baseline, централизованный критик + децентрализованные акторы.
            </li>
            <li>
              <strong className="text-foreground">Bansal, T., Pachocki, J., Sidor, S., Sutskever, I., Mordatch, I. (OpenAI, 2017).</strong>{" "}
              <em>Emergent Complexity via Multi-Agent Competition.</em> arXiv:1710.03748. — Self-play, авто-curriculum, история TD-Gammon/AlphaGo, эмерджентные навыки.
            </li>
            <li>
              <strong className="text-foreground">Unity Technologies. ML-Agents Toolkit v4.0</strong> — Training Configuration File (поля self_play, poca), ELO Rating System, Learning Environment Design Agents (SimpleMultiAgentGroup, AddGroupReward), ML-Agents Overview. — Все YAML-дефолты и диапазоны, K-фактор ELO, C#-паттерн групп.
            </li>
            <li>
              <strong className="text-foreground">Vaswani, A. et al. (2017).</strong>{" "}
              <em>Attention is All You Need.</em> NeurIPS. — Self-attention, механизм RSA.
            </li>
          </ol>
        </section>

        {/* ── Связанные материалы ── */}
        <section>
          <h2 id="связанные-материалы" className={SECTION_H2}>Связанные материалы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card/40 border-primary/20">
              <CardContent className="p-5">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> Хабы по теме
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <CrossLinkToHub hubPath="/algorithms/poca" hubTitle="MA-POCA">MA-POCA</CrossLinkToHub>
                    <span className="text-xs text-muted-foreground"> — counterfactual baseline, RSA-архитектура</span>
                  </li>
                  <li>
                    <CrossLinkToHub hubPath="/algorithms/ppo" hubTitle="PPO">PPO</CrossLinkToHub>
                    <span className="text-xs text-muted-foreground"> — клиппинг, GAE (основа MA-POCA)</span>
                  </li>
                  <li>
                    <CrossLinkToHub hubPath="/math-rl/module-4" hubAnchor="лекция-2-вывод-градиента-политики" hubTitle="Математика RL — Модуль 4">Градиент политики</CrossLinkToHub>
                    <span className="text-xs text-muted-foreground"> — вывод policy gradient</span>
                  </li>
                  <li>
                    <CrossLinkToHub hubPath="/deep-rl" hubAnchor="algorithms" hubTitle="Deep RL">MARL, CTDE, actor-critic</CrossLinkToHub>
                    <span className="text-xs text-muted-foreground"> — семейство алгоритмов</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-card/40 border-secondary/20">
              <CardContent className="p-5">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-secondary" /> Связанные уроки
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <CrossLinkToHub hubPath="/courses/3-1" hubTitle="Урок 3.1">3.1 — SAC: Soft Actor-Critic</CrossLinkToHub>
                    <span className="text-xs text-muted-foreground"> — Actor-critic, PPO — база MA-POCA</span>
                  </li>
                  <li>
                    <CrossLinkToHub hubPath="/courses/project-3" hubTitle="Проект 3">project-3 — Гоночный агент</CrossLinkToHub>
                    <span className="text-xs text-muted-foreground"> — расширяем до multi-agent</span>
                  </li>
                  <li>
                    <CrossLinkToHub hubPath="/courses/2-3" hubTitle="Урок 2.3">2.3 — Непрерывные действия и Actor-Critic</CrossLinkToHub>
                    <span className="text-xs text-muted-foreground"> — Advantage, GAE</span>
                  </li>
                  <li>
                    <CrossLinkToHub hubPath="/courses/2-6" hubTitle="Урок 2.6">2.6 — TensorBoard и W&B</CrossLinkToHub>
                    <span className="text-xs text-muted-foreground"> — читаем ELO</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Quiz title="Проверь себя: MA-POCA и Self-Play" questions={quizQuestions} lessonPath="/courses/3-2" />
      </ProGate>
    </LessonLayout>
  );
};

export default CourseLesson3_2;
