import { Link } from "react-router-dom";
import LessonLayout from "@/components/LessonLayout";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { Card, CardContent } from "@/components/ui/card";
import InteractiveMath from "@/components/lesson-1-4/InteractiveMath";
import MathSymbolsReference from "@/components/lesson-1-4/MathSymbolsReference";
import { symbolTex } from "@/components/lesson-1-4/symbol-data";
import { Lightbulb, BookOpen, CheckCircle2, AlertTriangle, Table2, ArrowRight } from "lucide-react";

const PYTHON_IMPLEMENTATION = `import numpy as np
import gymnasium as gym
import random

# Фиксируем генераторы случайных чисел для воспроизводимости.
seed = 42
np.random.seed(seed)
random.seed(seed)

# FrozenLake 4x4 с детерминированными переходами.
env = gym.make("FrozenLake-v1", map_name="4x4", is_slippery=False)
env.action_space.seed(seed)

state_size = env.observation_space.n
action_size = env.action_space.n
Q_table = np.zeros((state_size, action_size))

total_episodes = 2000
learning_rate = 0.8
gamma = 0.95

epsilon = 1.0
max_epsilon = 1.0
min_epsilon = 0.01
decay_rate = 0.005

print("Начало обучения агента...")

for episode in range(total_episodes):
    state, info = env.reset(seed=seed if episode == 0 else None)
    terminated = False
    truncated = False

    while not (terminated or truncated):
        exp_tradeoff = random.uniform(0, 1)
        if exp_tradeoff < epsilon:
            action = env.action_space.sample()
        else:
            action = np.argmax(Q_table[state, :])

        new_state, reward, terminated, truncated, info = env.step(action)

        # Терминальный исход отключает bootstrap; truncation его сохраняет.
        bootstrap_value = 0.0 if terminated else np.max(Q_table[new_state, :])
        td_target = reward + gamma * bootstrap_value
        td_error = td_target - Q_table[state, action]
        Q_table[state, action] += learning_rate * td_error

        state = new_state

    epsilon = min_epsilon + (max_epsilon - min_epsilon) * np.exp(-decay_rate * episode)

print("Обучение завершено!\\n")
print("Финальная Q-таблица:")
print(np.round(Q_table, 3))`;
const SEED_SNIPPET = `import random
import numpy as np

def seed_everything(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    # В реальных проектах также фиксируют зерна в средах gym`;

const qPair = (stateLatex: string, actionLatex: string) =>
  symbolTex("q", "Op", "Q") + symbolTex("delimiters", "Neu", "(") +
  symbolTex("state", "Var", stateLatex) + symbolTex("comma", "Neu", ", ") +
  symbolTex("action", "Var", actionLatex) + symbolTex("delimiters", "Neu", ")");
const qCurrent = qPair("s_t", "a_t");
const qNext = symbolTex("q", "Op", "Q") + symbolTex("delimiters", "Neu", "(") +
  symbolTex("nextState", "Var", "s_{t+1}") + symbolTex("comma", "Neu", ", ") +
  symbolTex("nextAction", "Neu", "a'") + symbolTex("delimiters", "Neu", ")");
const Q_TARGET_FORMULA =
  symbolTex("target", "Tgt", "y_t") + " " + symbolTex("equals", "Neu", "=") + " " +
  symbolTex("reward", "Tgt", "r_{t+1}") + " " + symbolTex("plus", "Neu", "+") + " " +
  symbolTex("gamma", "Par", "\\gamma") + " " + symbolTex("times", "Neu", "\\times") + " " +
  symbolTex("delimiters", "Neu", "(") + symbolTex("one", "Neu", "1") + " " +
  symbolTex("minus", "Neu", "-") + " " + symbolTex("terminal", "Neu", "d_t") +
  symbolTex("delimiters", "Neu", ")") + " " + symbolTex("times", "Neu", "\\times") + " " +
  symbolTex("max", "Op", "\\max") + "_{" + symbolTex("nextAction", "Neu", "a'") + "} " + qNext;
const TD_ERROR_FORMULA =
  symbolTex("tdError", "Var", "\\delta_t") + " " + symbolTex("equals", "Neu", "=") + " " +
  symbolTex("target", "Tgt", "y_t") + " " + symbolTex("minus", "Neu", "-") + " " + qCurrent;
const Q_UPDATE_FORMULA =
  qCurrent + " " + symbolTex("arrow", "Neu", "\\leftarrow") + " " + qCurrent + " " +
  symbolTex("plus", "Neu", "+") + " " + symbolTex("alpha", "Par", "\\alpha") + " " +
  symbolTex("times", "Neu", "\\times") + " " + symbolTex("tdError", "Var", "\\delta_t");
const CourseLesson1_4 = () => {
  return (
    <LessonLayout
      lessonTitle="Q-Learning: табличный метод"
      lessonNumber="1.4"
      duration="45 мин"
      tags={["#algorithm", "#qlearning", "#tabular", "#gym"]}
      level={1}
      lessonId="1-4"
      prevLesson={{ path: "/courses/1-3", title: "Марковские процессы принятия решений (MDP)" }}
      nextLesson={{ path: "/courses/1-5", title: "CartPole — твой первый RL-агент" }}
      keyConcepts={[
        "MDP: состояние, действие, награда, политика",
        "Q-таблица как карта качества действий",
        "Уравнение Беллмана и TD Error в LaTeX",
        "Model-free и off-policy свойства Q-learning",
        "Epsilon-greedy и затухание исследования",
        "Полный Python-пайплайн на FrozenLake",
      ]}
    >
      <section>
        <Card className="bg-gradient-to-br from-blue-500/5 via-card/40 to-purple-500/5 border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Интуитивное введение
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Обучение с подкреплением (Reinforcement Learning, RL) представляет собой
              одну из трех фундаментальных парадигм машинного обучения, наряду с
              обучением с учителем (Supervised Learning) и обучением без учителя
              (Unsupervised Learning). В то время как классические алгоритмы машинного
              обучения опираются на заранее подготовленные наборы данных с правильными
              ответами или ищут скрытые закономерности в неразмеченной информации,
              обучение с подкреплением решает принципиально иную задачу.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Оно отвечает на вопрос: как интеллектуальный агент должен принимать
              последовательные решения в динамической, постоянно меняющейся среде, чтобы
              максимизировать итоговую выгоду.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Проблема, которую решает Q-обучение, заключается в необходимости поиска
              оптимальной стратегии поведения в условиях неопределенности и отложенных
              последствий. Выбор конкретного пути может не принести мгновенной пользы, но
              открыть доступ к колоссальному успеху в будущем.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Аналогия: обучение езде на велосипеде или новой сложной игре через пробу и
              ошибку. В начале агент действует хаотично, затем накапливает опыт и
              формирует внутреннюю «интуицию» о том, какие действия в каких состояниях
              действительно ведут к цели.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Table2 className="w-5 h-5 text-primary" />
          Ключевые концепции
        </h2>
        <Card className="bg-card/40 border-secondary/30 mb-4">
          <CardContent className="p-4 flex gap-3 items-start">
            <BookOpen className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Формальная теория MDP (множества состояний и действий, переходы среды, функция награды,
              уравнение Беллмана и Value Iteration) подробно разобрана в{" "}
              <Link
                to="/courses/1-3"
                className="text-secondary hover:text-primary underline underline-offset-2"
              >
                уроке 1.3 — «Марковские процессы принятия решений»
              </Link>
              . Здесь мы используем эти понятия как данность и переходим к практике
              табличного Q-learning.
            </p>
          </CardContent>
        </Card>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Любая задача обучения с подкреплением формулируется в терминах Марковского
          процесса принятия решений (Markov Decision Process, MDP).
        </p>
        <div className="overflow-x-auto rounded-lg border border-border/30 bg-card/30">
          <table className="w-full text-sm">
            <thead className="bg-primary/10">
              <tr className="text-left">
                <th className="p-3 font-semibold text-foreground">Концепция</th>
                <th className="p-3 font-semibold text-foreground">Обозначение</th>
                <th className="p-3 font-semibold text-foreground">Формальное определение</th>
                <th className="p-3 font-semibold text-foreground">
                  Интуитивный пример (GridWorld)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-muted-foreground">
              <tr>
                <td className="p-3 font-medium text-foreground">Состояние (State)</td>
                <td className="p-3">
                  <InteractiveMath display={false}>{symbolTex("stateGeneric", "Var", "s")}</InteractiveMath>
                </td>
                <td className="p-3">
                  Полное описание текущего положения агента в среде. Множество всех
                  состояний обозначается как <InteractiveMath display={false}>{symbolTex("setS", "Neu", "\mathcal{S}")}</InteractiveMath>.
                </td>
                <td className="p-3">Например: робот находится во второй строке и третьем столбце.</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">Действие (Action)</td>
                <td className="p-3">
                  <InteractiveMath display={false}>{symbolTex("actionGeneric", "Var", "a")}</InteractiveMath>
                </td>
                <td className="p-3">
                  Конкретный шаг, принимаемый агентом в ответ на состояние.
                </td>
                <td className="p-3">Вверх, Вниз, Влево, Вправо.</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">Награда (Reward)</td>
                <td className="p-3">
                  <InteractiveMath display={false}>{symbolTex("rewardGeneric", "Tgt", "r")}</InteractiveMath>
                </td>
                <td className="p-3">
                  Числовой сигнал обратной связи после действия.
                  <div className="mt-1">
                    <InteractiveMath display={false}>{symbolTex("rewardFunction", "Fun", "\mathcal{R}") + symbolTex("colon", "Neu", ": ") + symbolTex("setS", "Neu", "\mathcal{S}") + " " + symbolTex("product", "Neu", "\times") + " " + symbolTex("setA", "Neu", "\mathcal{A}") + " " + symbolTex("maps", "Neu", "\to") + " " + symbolTex("real", "Neu", "\mathbb{R}")}</InteractiveMath>
                  </div>
                </td>
                <td className="p-3">награда за батарею, штраф за стену и более крупный штраф за яму.</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">Стратегия (Policy)</td>
                <td className="p-3">
                  <InteractiveMath display={false}>{symbolTex("policy", "Fun", "\pi")}</InteractiveMath>
                </td>
                <td className="p-3">
                  Набор правил, определяющий поведение агента.
                </td>
                <td className="p-3">«Если рядом яма — иди в противоположную сторону».</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">Q-значение (Q-value)</td>
                <td className="p-3">
                  <InteractiveMath display={false}>{symbolTex("q", "Op", "Q") + symbolTex("delimiters", "Neu", "(") + symbolTex("stateGeneric", "Var", "s") + symbolTex("comma", "Neu", ", ") + symbolTex("actionGeneric", "Var", "a") + symbolTex("delimiters", "Neu", ")")}</InteractiveMath>
                </td>
                <td className="p-3">
                  Оценка ожидаемой долгосрочной полезности выбора действия в состоянии.
                </td>
                <td className="p-3">Ценность шага вправо из клетки (2,3): 5.5.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-relaxed mt-4">
          Чтобы эти термины сложились в единую картину, рассмотрим лабиринт размером три на три.
          Агент стартует в нижнем левом углу, а цель Q-обучения — выучить идеальную
          стратегию для всех клеток.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Основная идея Q-обучения</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Табличный Q-learning строит и постоянно обновляет двумерную Q-таблицу:
          строки — состояния, столбцы — действия, а в ячейках хранится «качество»
          пары <InteractiveMath display={false}>{symbolTex("q", "Op", "Q") + symbolTex("delimiters", "Neu", "(") + symbolTex("stateGeneric", "Var", "s") + symbolTex("comma", "Neu", ", ") + symbolTex("actionGeneric", "Var", "a") + symbolTex("delimiters", "Neu", ")")}</InteractiveMath>.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Процесс обучения строится циклом: определить состояние → выбрать действие →
          получить награду и новое состояние → обновить таблицу.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className="bg-card/40 border-blue-500/20">
            <CardContent className="p-4">
              <p className="font-semibold text-sm text-blue-400 mb-1">Model-free</p>
              <p className="text-sm text-muted-foreground">
                Агенту не нужна модель среды заранее. Он учится напрямую из опыта проб
                и ошибок.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/40 border-purple-500/20">
            <CardContent className="p-4">
              <p className="font-semibold text-sm text-purple-400 mb-1">Off-policy</p>
              <p className="text-sm text-muted-foreground">
                Агент может действовать случайно, но в оценках хранить оптимальную
                стратегию, что ускоряет обучение.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Формулы Q-обучения</h2>
        <p className="text-muted-foreground leading-relaxed mb-2">
          Сначала вычисляем TD-цель. Маска исключает будущую ценность только при настоящем терминальном исходе.
        </p>
        <InteractiveMath>{Q_TARGET_FORMULA}</InteractiveMath>
        <p className="text-muted-foreground leading-relaxed mt-4 mb-2">
          Ошибка временного различия — это разница между целью и прежней оценкой:
        </p>
        <InteractiveMath>{TD_ERROR_FORMULA}</InteractiveMath>
        <p className="text-muted-foreground leading-relaxed mt-4 mb-2">
          Затем обновляем оценку выбранной пары состояние–действие:
        </p>
        <InteractiveMath>{Q_UPDATE_FORMULA}</InteractiveMath>
        <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-4 mt-4 text-sm text-muted-foreground">
          В FrozenLake при достижении цели награда равна <code className="text-primary">1</code>, а терминальная маска убирает bootstrap. При скорости обучения <code className="text-primary">0.8</code> оценка перехода перед целью становится <code className="text-primary">0.8</code>; ценность затем распространяется на предыдущий шаг с коэффициентом <code className="text-primary">0.95</code>.
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">От математики к алгоритму</h2>
        <div className="space-y-2">
          {[
            "Создаём Q-таблицу и задаём скорость обучения, дисконтирование и вероятность исследования.",
            "Сбрасываем среду и считываем начальное состояние.",
            "Выбираем случайное или лучшее по таблице действие.",
            "Выполняем действие и получаем новое состояние, награду и признаки завершения.",
            "Вычисляем TD-цель, ошибку и обновляем оценку выбранной пары.",
            "Повторяем шаги до терминального исхода или ограничения времени.",
            "После эпизода уменьшаем вероятность исследования.",
          ].map((step, i) => (
            <div key={step} className="flex gap-3 p-3 rounded-lg bg-card/30 border border-border/30">
              <span className="text-primary font-bold text-sm">{i + 1}.</span>
              <p className="text-sm text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground leading-relaxed mt-4">
          Постепенное уменьшение <InteractiveMath display={false}>{symbolTex("epsilon", "Par", "\varepsilon_k")}</InteractiveMath> критически важно:
          сначала агент исследует мир хаотично, затем все чаще использует выученную
          стратегию.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Реализация на Python (MANDATORY)
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Ниже — полный рабочий код табличного Q-learning для
          <code className="text-primary text-xs"> FrozenLake-v1 </code>
          с использованием библиотек <code className="text-primary text-xs">numpy</code> и
          <code className="text-primary text-xs"> gymnasium</code>.
        </p>
        <CyberCodeBlock language="python" filename="q_learning_frozen_lake.py">
          {PYTHON_IMPLEMENTATION}
        </CyberCodeBlock>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Пример среды: FrozenLake
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          FrozenLake — сетка четыре на четыре с безопасными клетками, прорубями и финишем.
          В этой среде агент учится находить путь к цели, избегая провалов.
        </p>
        <Link
          to="/projects/frozen-lake"
          className="group flex items-center gap-3 p-4 mb-4 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 hover:shadow-glow-cyan transition-all"
        >
          <div className="flex-1">
            <div className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">
              Практический проект
            </div>
            <div className="text-foreground font-medium">
              Открыть интерактивный проект «Frozen Lake»
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Полная реализация Q-Learning на этой среде с визуализацией обучения агента.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
        </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "S (Start) — стартовая позиция агента.",
            "F (Frozen) — безопасный лед.",
            "H (Hole) — прорубь, эпизод завершается без награды.",
            "G (Goal) — цель, эпизод завершается с единичной наградой.",
          ].map((item) => (
            <Card key={item} className="bg-card/40 border-border/30">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{item}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-muted-foreground leading-relaxed mt-4">
          Карта среды: <code className="text-primary text-xs">S F F F F H F H F F F H H F F G</code>
        </p>
        <div className="overflow-x-auto rounded-lg border border-border/30 bg-card/30 mt-4">
          <table className="w-full text-sm">
            <thead className="bg-primary/10">
              <tr className="text-left">
                <th className="p-3 font-semibold text-foreground">Состояние</th>
                <th className="p-3 font-semibold text-foreground">Влево (0)</th>
                <th className="p-3 font-semibold text-foreground">Вниз (1)</th>
                <th className="p-3 font-semibold text-foreground">Вправо (2)</th>
                <th className="p-3 font-semibold text-foreground">Вверх (3)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-muted-foreground">
              <tr>
                <td className="p-3 font-medium text-foreground">0 (Старт), шаг 0</td>
                <td className="p-3">0.000</td>
                <td className="p-3">0.000</td>
                <td className="p-3">0.000</td>
                <td className="p-3">0.000</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">14 (Перед целью), шаг 0</td>
                <td className="p-3">0.000</td>
                <td className="p-3">0.000</td>
                <td className="p-3">0.000</td>
                <td className="p-3">0.000</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">0 (Старт), после обучения</td>
                <td className="p-3">0.531</td>
                <td className="p-3">0.590</td>
                <td className="p-3">0.531</td>
                <td className="p-3">0.531</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-relaxed mt-4 mb-2">
          Перетекание ценности назад от цели:
        </p>
        <div className="rounded-lg border border-border/30 bg-card/30 p-4 text-sm text-muted-foreground">
          Для перехода в цель обучение даёт значение <code className="text-primary">0.8</code>; затем на предыдущем шаге с наградой 0 ценность распространяется назад и даёт <code className="text-primary">0.608</code>. Эти значения получены с параметрами из кода урока.
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Пошаговый разбор кода (Математика → Алгоритм → Код)
        </h2>
        <div className="overflow-x-auto rounded-lg border border-border/30 bg-card/30">
          <table className="w-full text-sm">
            <thead className="bg-primary/10">
              <tr className="text-left">
                <th className="p-3 font-semibold text-foreground">
                  Математический элемент / Концепция
                </th>
                <th className="p-3 font-semibold text-foreground">
                  Объяснение логики и механики
                </th>
                <th className="p-3 font-semibold text-foreground">Фрагмент Python-кода</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-muted-foreground">
              <tr>
                <td className="p-3 font-medium text-foreground">Матрица <InteractiveMath display={false}>{symbolTex("q", "Op", "Q") + symbolTex("delimiters", "Neu", "(") + symbolTex("setS", "Neu", "\mathcal{S}") + symbolTex("comma", "Neu", ", ") + symbolTex("setA", "Neu", "\mathcal{A}") + symbolTex("delimiters", "Neu", ")")}</InteractiveMath></td>
                <td className="p-3">
                  Таблица знаний агента, инициализация нулями означает tabula rasa.
                </td>
                <td className="p-3">
                  <code className="text-primary text-xs">
                    Q_table = np.zeros((state_size, action_size))
                  </code>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">Epsilon-Greedy</td>
                <td className="p-3">
                  Если случайное число ниже вероятности исследования, агент пробует случайное действие, иначе использует выученные оценки.
                </td>
                <td className="p-3">
                  <code className="text-primary text-xs">
                    if exp_tradeoff {"<"} epsilon: action = env.action_space.sample()
                  </code>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">Функция среды</td>
                <td className="p-3">
                  Переход в новое состояние и получение награды через step().
                </td>
                <td className="p-3">
                  <code className="text-primary text-xs">
                    new_state, reward, terminated, truncated, info = env.step(action)
                  </code>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">Оценка будущего</td>
                <td className="p-3">
                  Выбор максимальной оценки в следующем состоянии.
                </td>
                <td className="p-3">
                  <code className="text-primary text-xs">np.max(Q_table[new_state, :])</code>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">Уравнение Беллмана</td>
                <td className="p-3">Центральное обновление текущего значения.</td>
                <td className="p-3">
                  <code className="text-primary text-xs">
                    bootstrap_value = 0.0 if terminated else np.max(Q_table[new_state, :])
                    td_target = reward + gamma * bootstrap_value
                  </code>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">Epsilon Decay</td>
                <td className="p-3">Экспоненциальное затухание случайности.</td>
                <td className="p-3">
                  <code className="text-primary text-xs">
                    epsilon = min_epsilon + (max_epsilon - min_epsilon) * np.exp(-decay_rate * episode)
                  </code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <MathSymbolsReference />

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          Распространенные ошибки
        </h2>
        <div className="space-y-3">
          {[
            "Попытка применять табличный Q-learning в средах с непрерывными действиями.",
            "Некорректное управление исследованием: слишком быстрое или отсутствующее затухание epsilon.",
            "Переоценка Q-значений (overestimation bias) из-за использования max в целевой оценке.",
            "Отсутствие seeding и, как следствие, невоспроизводимые эксперименты.",
            "Проблемный reward shaping, при котором агент эксплуатирует лазейки вместо выполнения цели.",
          ].map((err, i) => (
            <Card key={err} className="bg-card/30 border-destructive/20">
              <CardContent className="p-4 flex gap-3">
                <span className="text-destructive font-bold text-sm">{i + 1}.</span>
                <p className="text-sm text-muted-foreground">{err}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-muted-foreground leading-relaxed mt-4">
          Для борьбы с переоценкой часто используют Double Q-learning, а для
          воспроизводимости — фиксацию seed во всех источниках случайности.
        </p>
        <CyberCodeBlock language="python" filename="seed_everything.py">
          {SEED_SNIPPET}
        </CyberCodeBlock>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          Ключевые выводы
        </h2>
        <Card className="bg-gradient-to-br from-primary/5 via-card/40 to-secondary/5 border-primary/20">
          <CardContent className="p-6 space-y-3">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Что такое Q-обучение:</strong> модель
                оптимизации (model-free, off-policy), оценивающая долгосрочную ценность
                каждого действия.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Когда использовать:</strong> дискретные
                и небольшие пространства состояний/действий (лабиринты, GridWorld,
                простые игры, базовая оптимизация процессов).
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Ограничение:</strong> проклятие
                размерности. Для больших/непрерывных пространств используют DQN, где
                Q-таблица заменяется нейросетевой аппроксимацией.
              </p>
            </div>
            <Card className="bg-card/40 border-border/30">
              <CardContent className="p-4 flex gap-3 items-start">
                <BookOpen className="w-4 h-4 text-primary mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Математическое сердце DQN сохраняется: это та же TD-ошибка и идея
                  уравнения Беллмана, разобранная в табличном Q-learning.
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </section>
    </LessonLayout>
  );
};

export default CourseLesson1_4;
