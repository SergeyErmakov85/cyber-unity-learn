import LessonLayout from "@/components/LessonLayout";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import Math from "@/components/Math";
import Quiz from "@/components/Quiz";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle2,
  Code2,
  Dice5,
  Lightbulb,
  LineChart,
  Search,
  Table2,
  Target,
  TrendingUp,
} from "lucide-react";

const BANDIT_SIMULATION_CODE = `import numpy as np
import matplotlib.pyplot as plt

# ---------------------------------------------------------
# 1. Модель среды: Многорукий бандит (награды Бернулли)
# ---------------------------------------------------------
class BernoulliBanditEnv:
    """
    Эмулирует слот-машину с K рычагами. Каждый рычаг имеет свою
    зафиксированную, но скрытую от агента вероятность успеха (CTR).
    """
    def __init__(self, probabilities):
        self.probabilities = np.array(probabilities)
        self.k_arms = len(probabilities)

    def pull_arm(self, action):
        """Возвращает 1 с вероятностью p и 0 с вероятностью 1-p."""
        if np.random.rand() < self.probabilities[action]:
            return 1
        return 0


# ---------------------------------------------------------
# 2. Архитектура агента (базовый класс)
# ---------------------------------------------------------
class BaseBanditAgent:
    """Родительский класс, хранящий общую логику памяти агентов."""
    def __init__(self, k_arms):
        self.k_arms = k_arms
        self.counts = np.zeros(k_arms)      # N(a): количество выборов каждого действия
        self.values = np.zeros(k_arms)      # Q(a): текущая оценка матожидания
        self.t = 0                          # Глобальный счетчик шагов времени

    def select_action(self):
        """Метод выбора действия, переопределяемый потомками."""
        raise NotImplementedError

    def update_estimates(self, action, reward):
        """
        Обновление оценок с использованием формулы бегущего среднего.
        Q_n = Q_{n-1} + (1/n) * (R_n - Q_{n-1})
        Это позволяет не хранить всю историю наград в памяти.
        """
        self.t += 1
        self.counts[action] += 1
        n = self.counts[action]
        value = self.values[action]
        self.values[action] = value + (1.0 / n) * (reward - value)


# ---------------------------------------------------------
# 3. Стратегия epsilon-greedy
# ---------------------------------------------------------
class EpsilonGreedyAgent(BaseBanditAgent):
    def __init__(self, k_arms, epsilon=0.1):
        super().__init__(k_arms)
        self.epsilon = epsilon

    def select_action(self):
        # Исследование: с вероятностью epsilon выбирается случайное действие.
        if np.random.rand() < self.epsilon:
            return np.random.randint(self.k_arms)
        # Использование: жадный выбор максимума текущей оценки.
        return np.argmax(self.values)


# ---------------------------------------------------------
# 4. Стратегия Upper Confidence Bound (UCB1)
# ---------------------------------------------------------
class UCBAgent(BaseBanditAgent):
    def __init__(self, k_arms, c=np.sqrt(2)):
        super().__init__(k_arms)
        self.c = c

    def select_action(self):
        # Фаза инициализации: защита от деления на ноль.
        for a in range(self.k_arms):
            if self.counts[a] == 0:
                return a

        ucb_scores = np.zeros(self.k_arms)
        for a in range(self.k_arms):
            exploitation = self.values[a]
            exploration = self.c * np.sqrt(np.log(self.t) / self.counts[a])
            ucb_scores[a] = exploitation + exploration

        return np.argmax(ucb_scores)


# ---------------------------------------------------------
# 5. Стратегия Thompson Sampling (байесовский подход)
# ---------------------------------------------------------
class ThompsonSamplingAgent(BaseBanditAgent):
    def __init__(self, k_arms):
        super().__init__(k_arms)
        # Beta(1, 1) - равномерное априорное распределение для каждого действия.
        self.alpha = np.ones(k_arms)  # успехи
        self.beta = np.ones(k_arms)   # неудачи

    def select_action(self):
        samples = [
            np.random.beta(self.alpha[a], self.beta[a])
            for a in range(self.k_arms)
        ]
        return np.argmax(samples)

    def update_estimates(self, action, reward):
        super().update_estimates(action, reward)

        if reward == 1:
            self.alpha[action] += 1
        else:
            self.beta[action] += 1


# ---------------------------------------------------------
# 6. Функция симуляции
# ---------------------------------------------------------
def run_simulation(agent, env, num_steps):
    """
    Запускает цикл взаимодействия агента со средой.
    Возвращает историю кумулятивных наград и долю оптимальных выборов.
    """
    rewards_history = np.zeros(num_steps)
    optimal_action = np.argmax(env.probabilities)
    optimal_action_flags = np.zeros(num_steps)

    for step in range(num_steps):
        action = agent.select_action()
        reward = env.pull_arm(action)
        agent.update_estimates(action, reward)

        rewards_history[step] = reward
        if action == optimal_action:
            optimal_action_flags[step] = 1

    cumulative_rewards = np.cumsum(rewards_history)
    optimal_percentages = np.cumsum(optimal_action_flags) / (np.arange(num_steps) + 1)
    return cumulative_rewards, optimal_percentages


if __name__ == "__main__":
    np.random.seed(42)

    true_probs = [0.1, 0.5, 0.8, 0.2, 0.4]
    T_STEPS = 2000

    env = BernoulliBanditEnv(true_probs)
    agents = {
        "Epsilon-Greedy (eps=0.1)": EpsilonGreedyAgent(k_arms=5, epsilon=0.1),
        "UCB1 (c=1.41)": UCBAgent(k_arms=5),
        "Thompson Sampling": ThompsonSamplingAgent(k_arms=5),
    }

    results = {}
    for name, agent in agents.items():
        cum_rewards, opt_pcts = run_simulation(agent, env, T_STEPS)
        results[name] = {"rewards": cum_rewards, "optimal_pct": opt_pcts}
        print(f"[{name}] Итоговая суммарная награда: {cum_rewards[-1]:.0f}")`;

const quizQuestions = [
  {
    question: "Что означает exploitation в дилемме Exploration vs Exploitation?",
    options: [
      "Выбор случайного действия для сбора новых данных",
      "Использование текущего лучшего знания для получения награды",
      "Полный отказ от обновления оценок Q(a)",
      "Случайная смена среды после каждого шага",
    ],
    correctIndex: 1,
    explanation:
      "Exploitation - это выбор действия, которое сейчас выглядит лучшим по текущим оценкам агента.",
  },
  {
    question: "Почему чисто жадная стратегия может застрять в локальном оптимуме?",
    options: [
      "Она слишком часто выбирает все действия равномерно",
      "Она не обновляет награды",
      "Она полагается на ранние оценки и перестает проверять альтернативы",
      "Она всегда требует Бета-распределение",
    ],
    correctIndex: 2,
    explanation:
      "Один удачный или неудачный ранний опыт может исказить Q(a), а без исследования агент не соберет данные для исправления ошибки.",
  },
  {
    question: "Какой принцип лежит в основе UCB?",
    options: [
      "Оптимизм в условиях неопределенности",
      "Полностью слепой случайный поиск",
      "Обучение только по демонстрациям эксперта",
      "Минимизация размера replay buffer",
    ],
    correctIndex: 0,
    explanation:
      "UCB добавляет бонус за неопределенность к текущей оценке награды и направленно проверяет малоизученные действия.",
  },
  {
    question: "Для каких наград базовая версия Thompson Sampling с Beta(alpha, beta) особенно естественна?",
    options: [
      "Для изображений RGB",
      "Для бинарных наград Бернулли: успех/неудача",
      "Для непрерывных действий робота",
      "Для текстовых последовательностей",
    ],
    correctIndex: 1,
    explanation:
      "Beta-распределение является сопряженным prior для биномиальной/бернуллиевской модели успехов и неудач.",
  },
];

const formalComponents = [
  {
    name: "Агент",
    symbol: "Agent",
    description:
      "Вычислительная сущность, алгоритм или система, принимающая решения на шагах t = 1, 2, ..., T.",
  },
  {
    name: "Действия",
    symbol: "\\mathcal{A} = \\{1, 2, \\dots, K\\}",
    description:
      "Дискретное конечное множество вариантов выбора. На шаге t агент выбирает A_t из A.",
  },
  {
    name: "Награды",
    symbol: "R_t",
    description:
      "Скалярный отклик среды после выбранного действия. В бандитах награды стохастичны.",
  },
  {
    name: "Истинная ценность",
    symbol: "q(a)",
    description:
      "Скрытое математическое ожидание награды для действия a. Агент его не знает заранее.",
  },
  {
    name: "Оценка ценности",
    symbol: "Q_t(a)",
    description:
      "Текущая эмпирическая оценка q(a), построенная по истории наблюдений до момента t.",
  },
  {
    name: "Неопределенность",
    symbol: "N_t(a)",
    description:
      "Степень неуверенности в оценке: чем меньше действие выбиралось, тем выше дисперсия оценки.",
  },
];

const strategyRows = [
  {
    criterion: "Качество исследования",
    epsilon:
      "Низкое: исследование случайное, поэтому трафик уходит как перспективным, так и заведомо слабым вариантам.",
    ucb:
      "Высокое: направленно проверяет действия с максимальным потенциалом роста и высокой неопределенностью.",
    thompson:
      "Очень высокое: исследует пропорционально вероятности того, что действие окажется оптимальным.",
  },
  {
    criterion: "Скорость сходимости и сожаление",
    epsilon:
      "Средняя: требует аккуратного decay; при фиксированном epsilon сохраняет постоянный штраф.",
    ucb:
      "Высокая: имеет строгие логарифмические границы сожаления в классической постановке.",
    thompson:
      "Очень высокая: часто быстрее сходится эмпирически, особенно в индустриальных бандитах.",
  },
  {
    criterion: "Вычислительная сложность",
    epsilon:
      "Минимальная: одно случайное число и argmax по текущим оценкам.",
    ucb:
      "Низкая: нужно посчитать логарифм и корень для каждого рукава.",
    thompson:
      "Средняя: нужно сэмплировать из распределения для каждого действия.",
  },
  {
    criterion: "Устойчивость к delayed feedback",
    epsilon:
      "Ограниченная: эффективность зависит от своевременного обновления оценок.",
    ucb:
      "Слабая: детерминированные счетчики могут искажаться при задержанных наградах.",
    thompson:
      "Сильная: рандомизация сэмплов помогает сохранять разнообразие решений без мгновенного фидбэка.",
  },
];

const experimentRows = [
  {
    phase: "t = 0-100",
    title: "Фаза разведки",
    behavior:
      "Кривые переплетаются. epsilon-greedy быстро получает первые клики за счет случайности, UCB вынужденно пробует все рукава, а Thompson Sampling делает резкие скачки из широких априорных распределений.",
    leader: "epsilon-greedy",
  },
  {
    phase: "t = 100-500",
    title: "Адаптация",
    behavior:
      "UCB изолирует слабые рукава, Thompson Sampling быстро сужает распределение для лучшего баннера, а epsilon-greedy выходит на плато из-за постоянных случайных проверок.",
    leader: "Thompson Sampling",
  },
  {
    phase: "t = 500-2000",
    title: "Асимптотика",
    behavior:
      "Thompson Sampling обычно удерживает первое место по накопленной награде, UCB идет рядом, а фиксированный epsilon-greedy теряет часть трафика на плохих вариантах.",
    leader: "Thompson Sampling",
  },
];

const CourseLesson1_7 = () => (
  <LessonLayout
    lessonTitle="Exploration vs Exploitation"
    lessonNumber="1.7"
    duration="50 мин"
    tags={["#theory", "#bandits", "#epsilon-greedy", "#ucb", "#thompson"]}
    level={1}
    lessonId="1-7"
    prevLesson={{ path: "/courses/1-6", title: "DQN с нуля на PyTorch" }}
    nextLesson={{ path: "/courses/project-1", title: 'Проект-1: "Баланс в 3D"' }}
    keyConcepts={[
      "Дилемма исследования и использования",
      "Многорукий бандит как минимальная RL-среда",
      "Regret как мера упущенной выгоды",
      "epsilon-greedy и decaying epsilon",
      "UCB: оптимизм в условиях неопределенности",
      "Thompson Sampling и байесовские бандиты",
    ]}
  >
    <section>
      <Card className="bg-gradient-to-br from-primary/5 via-card/40 to-secondary/5 border-primary/20">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            1. Интуитивное введение
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Обучение с подкреплением (Reinforcement Learning, RL) - это подход, при
            котором автономный агент учится принимать решения через постоянное
            взаимодействие со средой. В отличие от обучения с учителем, агенту не
            дают готовый набор правильных ответов: он исследует мир методом проб и
            ошибок, получает числовые награды за удачные действия и штрафы за
            неудачные.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Именно здесь возникает одна из самых глубоких проблем теории принятия
            решений - дилемма исследования и использования (Exploration vs
            Exploitation). Агент должен решить: пробовать неизвестные варианты или
            использовать то, что уже кажется хорошим.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Представь командировку на 120 дней в новом городе. Рядом с отелем есть
            три ресторана: итальянский, китайский и мексиканский. В первый вечер ты
            случайно выбираешь итальянский ресторан и получаешь ужин на 8/10. На
            второй вечер можно вернуться туда же и почти гарантированно получить
            хороший результат - это exploitation. А можно рискнуть и проверить
            китайский или мексиканский ресторан - это exploration. Новый вариант
            может оказаться плохим на 2/10, но может оказаться лучшим на 10/10.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card className="bg-card/40 border-blue-500/20">
          <CardContent className="p-5">
            <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Exploration
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Агент сознательно проверяет неизвестные или плохо изученные действия.
              Риск выше сейчас, но появляется шанс обнаружить лучший вариант и
              повысить будущую суммарную награду.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/40 border-green-500/20">
          <CardContent className="p-5">
            <h3 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Exploitation
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Агент выбирает действие с максимальной текущей оценкой. Риск ниже, но
              без исследования можно навсегда остаться привязанным к локально
              хорошему, но не оптимальному решению.
            </p>
          </CardContent>
        </Card>
      </div>

      <p className="text-muted-foreground leading-relaxed mt-4">
        Формальная версия этой идеи - задача о многоруком бандите (Multi-Armed
        Bandit, MAB). Название происходит от игровых автоматов: перед агентом стоит
        несколько "рукавов", каждый имеет неизвестную вероятность выплаты, а число
        попыток ограничено. Нужно как можно быстрее найти лучший рукав и использовать
        его чаще остальных.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        В индустрии эта постановка лежит в основе динамической оптимизации CTR в
        рекламе, рекомендательных систем, клинических испытаний и маршрутизации
        трафика. В отличие от классического A/B-теста, бандит не разделяет жестко
        фазу тестирования и фазу применения результатов: он начинает зарабатывать
        награду уже во время эксперимента.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Table2 className="w-5 h-5 text-primary" />
        2. Формальная постановка задачи
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Многорукий бандит можно рассматривать как упрощенный MDP с единственным
        состоянием и множеством действий. Каждое действие влияет только на
        немедленную награду и не меняет будущую доступность действий.
      </p>

      <div className="overflow-x-auto rounded-lg border border-border/30 bg-card/30">
        <table className="w-full text-sm">
          <thead className="bg-primary/10">
            <tr className="text-left">
              <th className="p-3 font-semibold text-foreground">Компонент</th>
              <th className="p-3 font-semibold text-foreground">Обозначение</th>
              <th className="p-3 font-semibold text-foreground">Смысл</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 text-muted-foreground">
            {formalComponents.map((item) => (
              <tr key={item.name}>
                <td className="p-3 font-medium text-foreground">{item.name}</td>
                <td className="p-3">
                  <Math display={false}>{item.symbol}</Math>
                </td>
                <td className="p-3">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 space-y-4">
        <Card className="bg-card/40 border-primary/20">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground mb-2">
              Истинная ценность действия
            </h3>
            <Math>{`q(a) = \\mathbb{E}[\\enfTgt{R}_t \\mid A_t = a]`}</Math>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Если бы агент заранее знал точные значения <Math display={false}>q(a)</Math>{" "}
              для всех действий, задача была бы тривиальной: всегда выбирать действие
              с максимальным математическим ожиданием. Но эти значения скрыты, поэтому
              агент строит оценки <Math display={false}>Q_t(a)</Math> по наблюдениям.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/40 border-secondary/20">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground mb-2">
              Сожаление (Regret)
            </h3>
            <Math>{`q^* = \\max_a q(a)`}</Math>
            <Math>{`\\Delta_t = q^* - q(A_t)`}</Math>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Regret измеряет упущенную выгоду: сколько агент потерял из-за выбора
              не лучшего действия. Хорошие стратегии дают медленный, логарифмический
              рост накопленного сожаления. Плохие стратегии могут давать линейный
              рост, то есть терять награду постоянно.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        3. Почему исследование имеет значение
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-3">
        Полный отказ от исследования приводит к наивной жадной стратегии. На каждом
        шаге агент выбирает действие с максимальной текущей оценкой:
      </p>
      <Math>{`A_t = \\underset{a}{\\operatorname{argmax}}\\ \\enfOp{Q}_t(a)`}</Math>
      <p className="text-muted-foreground leading-relaxed mt-4 mb-3">
        Проблема в абсолютной зависимости от ранней случайности. Допустим, у первого
        автомата истинная ценность <Math display={false}>q(1)=2</Math>, но в первый
        раз агенту повезло и выпала награда <Math display={false}>R_1=5</Math>.
        Оценка первого автомата становится высокой, а остальные остаются нулевыми.
        Жадный алгоритм продолжит выбирать первый автомат, хотя второй может иметь
        истинную ценность <Math display={false}>q(2)=10</Math>.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        Возможна и обратная ошибка: лучший автомат случайно дает плохую первую
        награду, агент преждевременно объявляет его плохим и больше не возвращается.
        Исследование - механизм самокоррекции: оно заставляет собирать
        репрезентативные данные и исправлять ложные убеждения.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Dice5 className="w-5 h-5 text-primary" />
        4. Стратегия epsilon-greedy
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-3">
        epsilon-greedy - базовый и очень практичный способ добавить контролируемую
        случайность. Параметр <Math display={false}>{`\\enfPar{\\varepsilon}`}</Math> задает
        вероятность того, что агент проигнорирует текущие оценки и выполнит случайное
        исследовательское действие.
      </p>
      <Math>{`A_t =
\\begin{cases}
\\underset{a}{\\operatorname{argmax}}\\ \\enfOp{Q}_t(a), & \\text{с вероятностью } 1 - \\enfPar{\\varepsilon} \\\\
\\text{случайное действие из } \\mathcal{A}, & \\text{с вероятностью } \\enfPar{\\varepsilon}
\\end{cases}`}</Math>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Card className="bg-card/40 border-green-500/20">
          <CardContent className="p-5">
            <h3 className="font-semibold text-green-400 mb-2">
              Сильная сторона
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Если <Math display={false}>{`\\enfPar{\\varepsilon} > 0`}</Math>, то при
              достаточно долгом обучении каждое действие будет проверяться снова и
              снова. Оценки <Math display={false}>Q_t(a)</Math> сходятся к истинным{" "}
              <Math display={false}>q(a)</Math> по закону больших чисел.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/40 border-destructive/20">
          <CardContent className="p-5">
            <h3 className="font-semibold text-destructive mb-2">
              Ограничение
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Исследование слепое. Агент одинаково случайно проверяет перспективные
              действия и варианты, которые уже почти наверняка плохие. При фиксированном
              epsilon это создает постоянный штраф.
            </p>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-xl font-semibold text-foreground mt-6 mb-2">
        Затухающий epsilon
      </h3>
      <p className="text-muted-foreground leading-relaxed mb-3">
        Чтобы убрать постоянный штраф, используют decaying epsilon-greedy. В начале
        агент исследует активно, например с{" "}
        <Math display={false}>{`\\enfPar{\\varepsilon}_0=1.0`}</Math>, а затем постепенно снижает
        случайность:
      </p>
      <Math>{`\\enfPar{\\varepsilon}_t = \\enfPar{\\varepsilon}_0 \\cdot \\enfPar{\\alpha}^t,\\quad \\enfPar{\\alpha} < 1`}</Math>
      <Math>{`\\enfPar{\\varepsilon}_t = \\frac{1}{t}`}</Math>
      <p className="text-muted-foreground leading-relaxed">
        Идея проста: сначала данных мало и нужно рисковать, позже оценки становятся
        надежнее, поэтому агент все чаще использует найденную стратегию.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-secondary" />
        5. Верхняя доверительная граница (UCB)
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-3">
        UCB решает ту же дилемму иначе: вместо слепого случайного поиска он использует
        направленное исследование. Принцип называется "оптимизм в условиях
        неопределенности": если действие мало проверялось, оно может оказаться лучше,
        чем кажется сейчас.
      </p>
      <Math>{`A_t = \\underset{a}{\\operatorname{argmax}}\\left[
\\enfOp{Q}_t(a) + c \\sqrt{\\frac{\\ln t}{N_t(a)}}
\\right]`}</Math>

      <div className="overflow-x-auto rounded-lg border border-border/30 bg-card/30 mt-4">
        <table className="w-full text-sm">
          <thead className="bg-secondary/10">
            <tr className="text-left">
              <th className="p-3 font-semibold text-foreground">Термин</th>
              <th className="p-3 font-semibold text-foreground">Роль</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 text-muted-foreground">
            <tr>
              <td className="p-3 font-medium text-foreground">
                <Math display={false}>Q_t(a)</Math>
              </td>
              <td className="p-3">
                Термин использования: насколько хорошо действие проявило себя в
                истории наблюдений.
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-foreground">
                <Math display={false}>{`c \\sqrt{\\frac{\\ln t}{N_t(a)}}`}</Math>
              </td>
              <td className="p-3">
                Термин исследования: бонус за неопределенность. Он велик, когда
                действие выбиралось редко, и уменьшается после новых наблюдений.
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-foreground">
                <Math display={false}>c</Math>
              </td>
              <td className="p-3">
                Коэффициент агрессивности исследования. Большее значение заставляет
                агента активнее проверять неопределенные варианты.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-muted-foreground leading-relaxed mt-4">
        UCB обязательно требует инициализации: если действие ни разу не выбиралось,
        <Math display={false}>N_t(a)=0</Math>, и формула делит на ноль. Поэтому в
        первые <Math display={false}>K</Math> шагов обычно принудительно выбирают
        каждый рукав по одному разу.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-primary" />
        6. Thompson Sampling
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-3">
        Thompson Sampling, или байесовские бандиты, моделирует ценность действия не
        как одно число, а как вероятностное распределение. До эксперимента агент имеет
        априорное убеждение, после каждого наблюдения обновляет его и получает
        апостериорное распределение.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-3">
        Для бинарных наград Бернулли - например, клик/нет клика - удобно использовать
        Бета-распределение:
      </p>
      <Math>{`\\enfPar{\\theta}_a \\sim \\operatorname{Beta}(\\enfPar{\\alpha}_a, \\beta_a)`}</Math>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {[
          ["alpha", "Количество успехов: наград, равных 1."],
          ["beta", "Количество неудач: наград, равных 0."],
          ["Beta(1,1)", "Равномерное начальное убеждение: любая вероятность успеха возможна."],
        ].map(([title, text]) => (
          <Card key={title} className="bg-card/40 border-border/30">
            <CardContent className="p-4">
              <p className="font-semibold text-foreground mb-1">{title}</p>
              <p className="text-sm text-muted-foreground">{text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">
        Цикл принятия решений
      </h3>
      <div className="space-y-2">
        {[
          "Сэмплировать одно значение theta_a из Beta(alpha_a, beta_a) для каждого действия.",
          "Выбрать действие с максимальным сэмплом theta_a.",
          "Получить бинарную награду r_t: 1 для успеха, 0 для неудачи.",
          "Если r_t = 1, увеличить alpha выбранного действия; иначе увеличить beta.",
        ].map((step, index) => (
          <div key={step} className="flex gap-3 p-3 rounded-lg bg-card/30 border border-border/30">
            <span className="text-primary font-bold text-sm">{index + 1}.</span>
            <p className="text-sm text-muted-foreground">{step}</p>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground leading-relaxed mt-4">
        Баланс возникает естественно: успешные действия чаще дают высокие сэмплы, а
        малоизученные действия имеют широкие распределения и иногда генерируют
        высокий оптимистичный сэмпл. По мере накопления данных распределения сужаются,
        и агент плавно переходит к использованию лучшего рукава.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        7. Сравнение стратегий
      </h2>
      <div className="overflow-x-auto rounded-lg border border-border/30 bg-card/30">
        <table className="w-full text-sm">
          <thead className="bg-primary/10">
            <tr className="text-left">
              <th className="p-3 font-semibold text-foreground">Критерий</th>
              <th className="p-3 font-semibold text-foreground">epsilon-greedy</th>
              <th className="p-3 font-semibold text-foreground">UCB1</th>
              <th className="p-3 font-semibold text-foreground">Thompson Sampling</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 text-muted-foreground">
            {strategyRows.map((row) => (
              <tr key={row.criterion}>
                <td className="p-3 font-medium text-foreground">{row.criterion}</td>
                <td className="p-3">{row.epsilon}</td>
                <td className="p-3">{row.ucb}</td>
                <td className="p-3">{row.thompson}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Code2 className="w-5 h-5 text-primary" />
        8. Python реализация (MANDATORY)
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Ниже - объектно-ориентированная симуляция многорукого бандита для задачи CTR.
        Среда возвращает бинарные награды Бернулли: <code className="text-primary text-xs">1</code>{" "}
        означает клик, <code className="text-primary text-xs">0</code> - отсутствие
        клика. Реализованы epsilon-greedy, UCB1 и Thompson Sampling.
      </p>
      <CyberCodeBlock language="python" filename="bandit_strategies.py">
        {BANDIT_SIMULATION_CODE}
      </CyberCodeBlock>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <LineChart className="w-5 h-5 text-secondary" />
        9. Эксперимент и визуализация
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        В эксперименте есть пять рекламных баннеров со скрытыми CTR: 10%, 50%, 80%,
        20% и 40%. Оптимальное действие - третий баннер с вероятностью успеха 80%.
        Симуляция идет <Math display={false}>T=2000</Math> шагов и отслеживает две
        метрики: кумулятивную награду и процент оптимальных выборов.
      </p>
      <div className="overflow-x-auto rounded-lg border border-border/30 bg-card/30">
        <table className="w-full text-sm">
          <thead className="bg-secondary/10">
            <tr className="text-left">
              <th className="p-3 font-semibold text-foreground">Шаги</th>
              <th className="p-3 font-semibold text-foreground">Фаза</th>
              <th className="p-3 font-semibold text-foreground">Динамика</th>
              <th className="p-3 font-semibold text-foreground">Опережает</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 text-muted-foreground">
            {experimentRows.map((row) => (
              <tr key={row.phase}>
                <td className="p-3 font-medium text-foreground">{row.phase}</td>
                <td className="p-3">{row.title}</td>
                <td className="p-3">{row.behavior}</td>
                <td className="p-3 text-primary font-medium">{row.leader}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-muted-foreground leading-relaxed mt-4">
        Итоговая картина обычно показывает преимущество вероятностных байесовских
        методов и направленного исследования над базовыми случайными эвристиками.
        Thompson Sampling часто максимизирует накопленную прибыль, UCB отстает
        немного, а фиксированный epsilon-greedy продолжает платить цену за слепое
        исследование.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-foreground mb-4">
        10. Пошаговый разбор кода
      </h2>
      <div className="space-y-4">
        <Card className="bg-card/40 border-border/30">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground mb-2">
              BaseBanditAgent и бегущее среднее
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Наивный подход хранит все награды и каждый раз пересчитывает среднее.
              Это дорого по памяти и времени. Вместо этого используется
              инкрементальная формула:
            </p>
            <Math>{`\\enfOp{Q}_n = \\enfOp{Q}_{n-1} + \\frac{1}{n}\\left(\\enfTgt{R}_n - \\enfOp{Q}_{n-1}\\right)`}</Math>
            <p className="text-sm text-muted-foreground leading-relaxed">
              В коде это строка{" "}
              <code className="text-primary text-xs">
                self.values[action] = value + (1.0 / n) * (reward - value)
              </code>
              . Она требует <Math display={false}>O(1)</Math> памяти и времени.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/30">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground mb-2">
              Детализация UCB1
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Главная программная особенность - защита от{" "}
              <Math display={false}>N(a)=0</Math>. Метод <code className="text-primary text-xs">select_action</code>{" "}
              сначала проверяет все счетчики и возвращает первый еще не опробованный
              рукав. Только после этого вычисляется бонус{" "}
              <Math display={false}>{`\\sqrt{\\ln t / N(a)}`}</Math>.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-border/30">
          <CardContent className="p-5">
            <h3 className="font-semibold text-foreground mb-2">
              Детализация Thompson Sampling
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Агент хранит не только среднее, а параметры распределений{" "}
              <code className="text-primary text-xs">alpha</code> и{" "}
              <code className="text-primary text-xs">beta</code>. Вызов{" "}
              <code className="text-primary text-xs">np.random.beta(...)</code>{" "}
              генерирует сэмпл для каждого действия. После успеха увеличивается
              alpha, после неудачи - beta.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        11. Распространенные ошибки
      </h2>
      <div className="space-y-3">
        {[
          {
            title: "Слишком агрессивный epsilon decay",
            text:
              "Если epsilon падает почти до нуля за несколько шагов, агент не успевает собрать данные и застревает в локальном оптимуме.",
          },
          {
            title: "Игнорирование N(a)=0 в UCB",
            text:
              "Прямое копирование формулы UCB без принудительного выбора каждого действия приводит к делению на ноль.",
          },
          {
            title: "Beta-Thompson для непрерывных наград без адаптации",
            text:
              "Базовая Beta(alpha, beta) версия рассчитана на бинарные награды. Для непрерывных значений нужны масштабирование или другая байесовская модель.",
          },
          {
            title: "Детерминированный метод при задержанной обратной связи",
            text:
              "В системах рекомендаций награда может прийти через часы. UCB может преждевременно исказить счетчики, тогда как Thompson Sampling обычно устойчивее.",
          },
        ].map((error, index) => (
          <Card key={error.title} className="bg-card/30 border-destructive/20">
            <CardContent className="p-4 flex gap-3">
              <span className="text-destructive font-bold text-sm">{index + 1}.</span>
              <div>
                <p className="font-semibold text-foreground text-sm mb-1">{error.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{error.text}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>

    <section>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-green-400" />
        12. Ключевые выводы
      </h2>
      <div className="overflow-x-auto rounded-lg border border-border/30 bg-card/30">
        <table className="w-full text-sm">
          <thead className="bg-primary/10">
            <tr className="text-left">
              <th className="p-3 font-semibold text-foreground">Тема</th>
              <th className="p-3 font-semibold text-foreground">Практический вывод</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 text-muted-foreground">
            <tr>
              <td className="p-3 font-medium text-foreground">
                Exploration vs Exploitation
              </td>
              <td className="p-3">
                Агент должен рисковать, чтобы не застрять в локальном оптимуме, но
                вовремя переходить к использованию найденного лучшего решения.
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-foreground">Greedy</td>
              <td className="p-3">
                Полный отказ от исследования надежен только при полном знании среды;
                в стохастических задачах он часто субоптимален.
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-foreground">epsilon-greedy</td>
              <td className="p-3">
                Хороший baseline. Для практики чаще используют плавное затухание
                epsilon, чтобы уменьшать случайные проверки со временем.
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-foreground">UCB</td>
              <td className="p-3">
                Подходит для статичных сред, где нужна интерпретируемая стратегия с
                бонусом за неопределенность и строгой логикой выбора.
              </td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-foreground">Thompson Sampling</td>
              <td className="p-3">
                Байесовский вероятностный подход, часто лучший в индустриальных
                бандитах и устойчивый к задержанной обратной связи.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <Quiz
      title="Проверь себя: Exploration vs Exploitation"
      questions={quizQuestions}
      lessonPath="/courses/1-7"
      nextLesson={{ path: "/courses/project-1", title: 'Проект-1: "Баланс в 3D"' }}
    />
  </LessonLayout>
);

export default CourseLesson1_7;
