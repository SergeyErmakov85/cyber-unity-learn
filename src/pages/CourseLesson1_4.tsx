import { Link } from "react-router-dom";
import LessonLayout from "@/components/LessonLayout";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { Card, CardContent } from "@/components/ui/card";
import Math from "@/components/Math";
import { Lightbulb, BookOpen, CheckCircle2, AlertTriangle, Table2, ArrowRight } from "lucide-react";

const PYTHON_IMPLEMENTATION = `import numpy as np
import gymnasium as gym
import random

# ==========================================
# ШАГ 1: Настройка среды и фиксация случайности
# ==========================================
# Фиксация seed предотвращает проблему "невоспроизводимых результатов".
seed = 42
np.random.seed(seed)
random.seed(seed)

# Создание классической среды FrozenLake (Замерзшее озеро) на карте 4x4.
# is_slippery=False означает, что мы отключаем случайное скольжение по льду,
# чтобы агент двигался строго в выбранном направлении.
env = gym.make("FrozenLake-v1", map_name="4x4", is_slippery=False)
env.action_space.seed(seed)

# Определение размерности пространства
state_size = env.observation_space.n
action_size = env.action_space.n

# ==========================================
# ШАГ 2: Инициализация Q-таблицы и гиперпараметров
# ==========================================
# Создаем таблицу размером 16x4, изначально заполненную нулями.
Q_table = np.zeros((state_size, action_size))

# Математические параметры алгоритма
total_episodes = 2000
learning_rate = 0.8
gamma = 0.95

# Параметры epsilon-жадной стратегии
epsilon = 1.0
max_epsilon = 1.0
min_epsilon = 0.01
decay_rate = 0.005

# ==========================================
# ШАГ 3: Тренировочный цикл (Обучение)
# ==========================================
print("Начало обучения агента...")

for episode in range(total_episodes):
    # Сброс среды для начала нового эпизода. Получаем стартовое состояние.
    state, info = env.reset(seed=seed if episode == 0 else None)
    done = False

    # Внутренний цикл: пока агент не упадет в прорубь или не найдет цель
    while not done:
        # 1. Выбор действия (epsilon-greedy policy)
        exp_tradeoff = random.uniform(0, 1)

        if exp_tradeoff < epsilon:
            # Исследование: выбираем случайное действие
            action = env.action_space.sample()
        else:
            # Использование: действие с максимальным Q-значением
            action = np.argmax(Q_table[state, :])

        # 2. Выполнение действия в среде
        # Среда возвращает: новое состояние, награду, флаг окончания,
        # флаг прерывания и дополнительную информацию.
        new_state, reward, done, truncated, info = env.step(action)

        # 3. Обновление Q-таблицы (Уравнение Беллмана)
        td_target = reward + gamma * np.max(Q_table[new_state, :])
        td_error = td_target - Q_table[state, action]
        Q_table[state, action] = Q_table[state, action] + learning_rate * td_error

        # 4. Переход в новое состояние
        state = new_state

        # Завершение цикла шагов, если игра окончена
        if done or truncated:
            break

    # Обновление (уменьшение) значения epsilon после каждого эпизода
    epsilon = min_epsilon + (max_epsilon - min_epsilon) * np.exp(-decay_rate * episode)

print("Обучение завершено!\\n")
print("Финальная Q-таблица (Обученный мозг агента):")
print(np.round(Q_table, 3))`;

const SEED_SNIPPET = `import random
import numpy as np

def seed_everything(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    # В реальных проектах также фиксируют зерна в средах gym`;

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
              1. Интуитивное введение
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
          2. Ключевые концепции
        </h2>
        <Card className="bg-card/40 border-secondary/30 mb-4">
          <CardContent className="p-4 flex gap-3 items-start">
            <BookOpen className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Формальная теория MDP (множества S, A, переходы T, награда R, γ,
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
                  <Math display={false}>s</Math>
                </td>
                <td className="p-3">
                  Полное описание текущего положения агента в среде. Множество всех
                  состояний обозначается как <Math display={false}>S</Math>.
                </td>
                <td className="p-3">Координаты робота: например, x=2, y=3.</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">Действие (Action)</td>
                <td className="p-3">
                  <Math display={false}>a</Math>
                </td>
                <td className="p-3">
                  Конкретный шаг, принимаемый агентом в ответ на состояние.
                </td>
                <td className="p-3">Вверх, Вниз, Влево, Вправо.</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">Награда (Reward)</td>
                <td className="p-3">
                  <Math display={false}>r</Math>
                </td>
                <td className="p-3">
                  Числовой сигнал обратной связи после действия.
                  <div className="mt-1">
                    <Math display={false}>{`R: S \\times A \\to \\mathbb{R}`}</Math>
                  </div>
                </td>
                <td className="p-3">+10 за батарею, -1 за стену, -100 за яму.</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">Стратегия (Policy)</td>
                <td className="p-3">
                  <Math display={false}>\pi</Math>
                </td>
                <td className="p-3">
                  Набор правил, определяющий поведение агента.
                </td>
                <td className="p-3">«Если рядом яма — иди в противоположную сторону».</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-foreground">Q-значение (Q-value)</td>
                <td className="p-3">
                  <Math display={false}>Q(s, a)</Math>
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
          Чтобы эти термины сложились в единую картину, рассмотрим лабиринт 3х3.
          Агент стартует в нижнем левом углу, а цель Q-обучения — выучить идеальную
          стратегию для всех клеток.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">3. Основная идея Q-обучения</h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          Табличный Q-learning строит и постоянно обновляет двумерную Q-таблицу:
          строки — состояния, столбцы — действия, а в ячейках хранится «качество»
          пары <Math display={false}>Q(s, a)</Math>.
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
        <h2 className="text-2xl font-bold text-foreground mb-4">4. Формула Q-обучения</h2>
        <Math>{`Q(s, a) \\leftarrow Q(s, a) + \\alpha \\left[ r + \\gamma \\max_{a'} Q(s', a') - Q(s, a) \\right]`}</Math>
        <p className="text-muted-foreground leading-relaxed mt-4 mb-3">
          Каждый символ в уравнении управляет поведением агента.
        </p>
        <div className="overflow-x-auto rounded-lg border border-border/30 bg-card/30 mb-4">
          <table className="w-full text-sm">
            <thead className="bg-primary/10">
              <tr className="text-left">
                <th className="p-3 font-semibold text-foreground">Термин</th>
                <th className="p-3 font-semibold text-foreground">Описание</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30 text-muted-foreground">
              <tr>
                <td className="p-3">
                  <Math display={false}>Q(s, a)</Math> (слева)
                </td>
                <td className="p-3">
                  Новое знание: обновленное значение качества для текущего состояния и
                  действия.
                </td>
              </tr>
              <tr>
                <td className="p-3">
                  <Math display={false}>Q(s, a)</Math> (справа)
                </td>
                <td className="p-3">Старое знание до текущего шага.</td>
              </tr>
              <tr>
                <td className="p-3">
                  <Math display={false}>\alpha</Math> (Learning Rate)
                </td>
                <td className="p-3">
                  Скорость обучения в диапазоне от 0 до 1.
                </td>
              </tr>
              <tr>
                <td className="p-3">
                  <Math display={false}>r</Math>
                </td>
                <td className="p-3">Мгновенная награда за действие.</td>
              </tr>
              <tr>
                <td className="p-3">
                  <Math display={false}>\gamma</Math> (Discount Factor)
                </td>
                <td className="p-3">
                  Важность будущих наград по сравнению с текущими.
                </td>
              </tr>
              <tr>
                <td className="p-3">
                  <Math display={false}>{`\\max_{a'} Q(s', a')`}</Math>
                </td>
                <td className="p-3">
                  Лучшая будущая оценка из следующего состояния.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Почему формула работает (TD Error)
        </h3>
        <Math>{`\\left[ r + \\gamma \\max_{a'} Q(s', a') - Q(s, a) \\right]`}</Math>
        <p className="text-muted-foreground leading-relaxed">
          Это и есть ошибка временного различия (Temporal Difference Error). Она
          показывает меру «удивления» агента и направление корректировки значения.
        </p>
        <h3 className="text-xl font-semibold text-foreground mt-4 mb-2">
          Пошаговый числовой пример
        </h3>
        <Math>{`Q(0, 1) \\leftarrow 0 + 0.1 \\times [10 + 0.9 \\times 0 - 0]`}</Math>
        <Math>{`Q(0, 1) \\leftarrow 1.0`}</Math>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">5. От математики к алгоритму</h2>
        <div className="space-y-2">
          {[
            "Инициализируем Q-таблицу и гиперпараметры (α, γ, ε).",
            "Сбрасываем среду в начальное состояние.",
            "Выбираем действие по ε-жадной стратегии (exploration/exploitation).",
            "Выполняем действие и получаем (s', r, done).",
            "Обновляем Q(s,a) уравнением Беллмана.",
            "Переходим в новое состояние и повторяем до конца эпизода.",
            "Уменьшаем ε (epsilon decay) по мере обучения.",
          ].map((step, i) => (
            <div key={step} className="flex gap-3 p-3 rounded-lg bg-card/30 border border-border/30">
              <span className="text-primary font-bold text-sm">{i + 1}.</span>
              <p className="text-sm text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground leading-relaxed mt-4">
          Постепенное уменьшение <Math display={false}>\epsilon</Math> критически важно:
          сначала агент исследует мир хаотично, затем все чаще использует выученную
          стратегию.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          6. Реализация на Python (MANDATORY)
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
          7. Пример среды: FrozenLake
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-3">
          FrozenLake — сетка 4x4 с безопасными клетками, прорубями и финишем.
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
            "H (Hole) — прорубь, эпизод завершается с наградой 0.",
            "G (Goal) — цель, эпизод завершается с наградой +1.",
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
        <Math>{`Q(14, 2) \\leftarrow 0 + 0.8 \\times [1 + 0.95 \\times 0 - 0] = 0.8`}</Math>
        <Math>{`Q(13, 2) \\leftarrow 0 + 0.8 \\times [0 + 0.95 \\times 0.8 - 0] = 0.608`}</Math>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          8. Пошаговый разбор кода (Математика → Алгоритм → Код)
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
                <td className="p-3 font-medium text-foreground">Матрица Q(S, A)</td>
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
                  При числе меньше ε агент исследует, иначе эксплуатирует знания.
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
                    new_state, reward, done, truncated, info = env.step(action)
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
                    td_target = reward + gamma * np.max(Q_table[new_state, :])
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

      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          9. Распространенные ошибки
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
          10. Ключевые выводы
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
