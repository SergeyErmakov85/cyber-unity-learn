import LessonLayout from "@/components/LessonLayout";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import Quiz from "@/components/Quiz";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ExternalLink,
  Lightbulb,
  BarChart3,
  Zap,
  Focus,
  GraduationCap,
  Cog,
  Gamepad2,
  Brain,
  CheckCircle2,
  BookOpen,
  TrendingDown,
  Target,
  Trophy,
  Download,
} from "lucide-react";
import CrossLinkToHub from "@/components/CrossLinkToHub";

const quizQuestions = [
  {
    question: "Сколько действий доступно агенту в среде CartPole-v1?",
    options: [
      "1 (только вправо)",
      "2 (влево и вправо)",
      "4 (вверх, вниз, влево, вправо)",
      "Непрерывное действие",
    ],
    correctIndex: 1,
    explanation:
      "CartPole имеет дискретное пространство действий с двумя вариантами: толкнуть тележку влево (0) или вправо (1). Это простейший случай — позже мы встретим среды с непрерывными действиями.",
  },
  {
    question: "Какой максимальный reward возможен в CartPole-v1?",
    options: ["100", "200", "500", "Неограничен"],
    correctIndex: 2,
    explanation:
      "Эпизод завершается после 500 шагов (truncation) или при падении шеста. Так как награда +1 за каждый шаг, максимум — 500. В старой версии CartPole-v0 максимум был 200.",
  },
  {
    question: "Почему случайный агент получает в среднем ~20 reward?",
    options: [
      "Среда слишком сложная для любого агента",
      "Случайные действия не учитывают состояние — шест быстро падает",
      "Случайный агент использует неправильную функцию потерь",
      "CartPole ограничивает reward до 20",
    ],
    correctIndex: 1,
    explanation:
      "Случайный агент выбирает действия без учёта наблюдений. Без корректирующих действий шест теряет баланс примерно за 20 шагов. Обученный агент учитывает угол и скорость шеста, чтобы вовремя корректировать движение.",
  },
  {
    question: "Что возвращает env.step(action) в Gymnasium?",
    options: [
      "observation, reward",
      "observation, reward, done",
      "observation, reward, terminated, truncated, info",
      "state, action, reward, next_state",
    ],
    correctIndex: 2,
    explanation:
      "Gymnasium API (v0.26+) возвращает 5 значений: observation (новое состояние), reward (награда), terminated (конец по правилам среды), truncated (конец по лимиту шагов), info (доп. информация).",
  },
];

const CourseLesson1_5 = () => {
  return (
    <LessonLayout
      lessonId="1-5"
      lessonTitle="CartPole — твой первый RL-агент"
      lessonNumber="1.5"
      duration="35 мин"
      tags={["#code", "#pytorch", "#gym"]}
      prevLesson={{ path: "/courses/1-4", title: "Q-Learning: табличный метод" }}
      nextLesson={{ path: "/courses/1-6", title: "DQN с нуля на PyTorch" }}
      keyConcepts={[
        "Gymnasium — стандартная библиотека RL-сред",
        "CartPole: наблюдения, действия, награды, конец эпизода",
        "Случайный агент как baseline для сравнения",
        "Нейросетевая аппроксимация Q-функции (вместо Q-таблицы)",
        "Epsilon-greedy стратегия: exploration ↔ exploitation",
      ]}
    >
      {/* Colab button */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" asChild>
          <a
            href="https://colab.research.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Открыть в Google Colab
          </a>
        </Button>
      </div>

      {/* ── Bridge section: Why Gymnasium? ── */}
      <section>
        <Card className="bg-gradient-to-br from-blue-500/5 via-card/40 to-purple-500/5 border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Почему Gymnasium, а не Unity?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              В предыдущем уроке мы установили Unity ML-Agents — и мы обязательно будем
              его использовать (начиная с Уровня 2). Но сначала нам нужно{" "}
              <strong className="text-foreground">освоить сами алгоритмы</strong>.
              Для этого мы используем{" "}
              <strong className="text-primary">Gymnasium</strong> — стандартную библиотеку
              RL-сред:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: Zap,
                  title: "Быстрая итерация",
                  desc: "Эпизод CartPole — миллисекунды. Нет рендеринга 3D, нет запуска Unity. Можно обучить агента за минуту.",
                  color: "text-yellow-400",
                },
                {
                  icon: Focus,
                  title: "Фокус на алгоритмах",
                  desc: "Не нужно писать C#-код, настраивать сенсоры и физику. Весь код — чистый Python + PyTorch.",
                  color: "text-blue-400",
                },
                {
                  icon: GraduationCap,
                  title: "Индустриальный стандарт",
                  desc: "CartPole и FrozenLake — «Hello World» мира RL. Все учебники и статьи начинают с них.",
                  color: "text-green-400",
                },
                {
                  icon: Cog,
                  title: "Те же алгоритмы",
                  desc: "Q-learning и DQN, которые мы освоим здесь — это то, что ML-Agents использует под капотом.",
                  color: "text-purple-400",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start p-3 rounded-lg bg-card/40 border border-border/30"
                >
                  <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className="font-semibold text-xs text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mt-4 italic">
              Аналогия: прежде чем строить небоскрёб (Unity-игру), инженер отрабатывает
              расчёты на масштабных моделях (Gymnasium). Алгоритмы те же — масштаб другой.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── Gymnasium install ── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Установка Gymnasium</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Если вы использовали <code className="text-primary text-xs">requirements.txt</code>{" "}
          из предыдущего урока, Gymnasium уже установлен. Если нет:
        </p>
        <CyberCodeBlock language="python" filename="terminal">
          {`# Установка Gymnasium
pip install gymnasium

# Проверка
python -c "import gymnasium; print(gymnasium.__version__)"
# Ожидаемый вывод: 0.29.x или выше`}
        </CyberCodeBlock>
      </section>

      {/* ── CartPole intro ── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-accent" />
          Среда CartPole-v1
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          <strong className="text-foreground">CartPole</strong> — классическая задача RL из
          библиотеки Gymnasium. На тележке закреплён шест. Цель агента — удерживать шест в
          вертикальном положении, двигая тележку влево или вправо.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              label: "Наблюдения (S)",
              value: "4: позиция тележки, скорость, угол шеста, угловая скорость",
              color: "text-primary",
            },
            {
              label: "Действия (A)",
              value: "2: толкнуть влево (0) или вправо (1)",
              color: "text-secondary",
            },
            {
              label: "Награда (R)",
              value: "+1 за каждый шаг, пока шест не упал",
              color: "text-green-400",
            },
            {
              label: "Конец эпизода",
              value: "Угол > 12° или позиция > 2.4, или 500 шагов",
              color: "text-orange-400",
            },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-lg bg-card/40 border border-border/30">
              <p className={`text-xs font-semibold ${item.color}`}>{item.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem
            value="observations"
            className="border-border/30 rounded-lg overflow-hidden bg-card/20"
          >
            <AccordionTrigger className="px-4 text-sm text-muted-foreground hover:text-foreground hover:no-underline">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Подробнее: что именно наблюдает агент?
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="space-y-2">
                {[
                  { idx: 0, name: "Позиция тележки", range: "[-4.8, 4.8]", unit: "метры" },
                  { idx: 1, name: "Скорость тележки", range: "(-∞, +∞)", unit: "м/с" },
                  { idx: 2, name: "Угол шеста", range: "[-0.418, 0.418]", unit: "радианы (~24°)" },
                  { idx: 3, name: "Угловая скорость шеста", range: "(-∞, +∞)", unit: "рад/с" },
                ].map((obs) => (
                  <div
                    key={obs.idx}
                    className="flex items-center gap-3 text-sm p-2 rounded bg-muted/10 border border-border/20"
                  >
                    <span className="font-mono text-primary text-xs w-8">
                      [{obs.idx}]
                    </span>
                    <span className="text-foreground font-medium flex-1">{obs.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {obs.range}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Это непрерывные значения — именно поэтому Q-таблица здесь не работает и
                нужна нейросеть для аппроксимации.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ── Random agent ── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Случайный агент (baseline)
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Начнём с самого простого — агента, который выбирает действия случайно. Это наш
          baseline — отправная точка, с которой мы будем сравнивать обученного агента.
        </p>

        <CyberCodeBlock language="python" filename="random_agent.py">
          {`import gymnasium as gym

env = gym.make("CartPole-v1")
total_rewards = []

for episode in range(100):
    obs, info = env.reset()
    episode_reward = 0
    done = False

    while not done:
        action = env.action_space.sample()  # Случайное действие
        obs, reward, terminated, truncated, info = env.step(action)
        episode_reward += reward
        done = terminated or truncated

    total_rewards.append(episode_reward)

avg_reward = sum(total_rewards) / len(total_rewards)
print(f"Средний reward за 100 эпизодов: {avg_reward:.1f}")
# Ожидаемый результат: ~20-25 (случайный агент)`}
        </CyberCodeBlock>

        <Card className="bg-card/40 border-primary/20 mt-4">
          <CardContent className="p-4 flex gap-3 items-start">
            <BarChart3 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">
                Случайный агент получает в среднем{" "}
                <strong className="text-foreground">~20–25</strong> reward. Максимум — 500.
                Наша цель — обучить агента, который стабильно достигает 475+.
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                Попробуйте запустить этот код — вы увидите, как быстро шест падает без
                интеллектуального управления.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Q-table limitations ── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          <CrossLinkToHub hubPath="/algorithms/dqn" hubTitle="DQN — Deep Q-Network">
            Q-learning
          </CrossLinkToHub>{" "}
          и его ограничения
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          В простых средах (как{" "}
          <CrossLinkToHub
            hubPath="/projects/frozen-lake"
            hubTitle="Проект: FrozenLake — Q-Learning с нуля"
          >
            FrozenLake
          </CrossLinkToHub>
          ) можно использовать Q-таблицу — матрицу, где для каждой пары (состояние,
          действие) хранится ожидаемая награда. Но в CartPole состояния{" "}
          <strong className="text-foreground">непрерывные</strong> (позиция, скорость) —
          создать таблицу для бесконечного числа состояний невозможно.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <Card className="bg-card/40 border-border/30">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-sm text-muted-foreground">
                Q-таблица (дискретные среды)
              </h3>
              <CyberCodeBlock language="pseudo" filename="q_table.txt">
                {`# FrozenLake: 16 состояний × 4 действия
Q[state][action] = expected_reward
# Таблица 16×4 — легко помещается в память`}
              </CyberCodeBlock>
            </CardContent>
          </Card>
          <Card className="bg-card/40 border-primary/30">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-sm text-primary">
                Нейросеть (непрерывные среды)
              </h3>
              <CyberCodeBlock language="pseudo" filename="q_network.txt">
                {`# CartPole: ∞ состояний × 2 действия
Q_θ(state) → [Q_left, Q_right]
# Нейросеть аппроксимирует Q для любого входа`}
              </CyberCodeBlock>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/40 border-accent/20">
          <CardContent className="p-4 flex gap-3 items-start">
            <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-foreground">
                Решение: нейросетевая аппроксимация
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Вместо таблицы используем нейронную сеть (
                <CrossLinkToHub
                  hubPath="/pytorch/cheatsheet"
                  hubAnchor="nn"
                  hubTitle="PyTorch — Нейронные сети"
                >
                  nn.Module
                </CrossLinkToHub>
                ), которая принимает состояние и предсказывает Q-значения для каждого
                действия. Это основа Deep Q-Network (DQN), которую мы детально разберём в
                следующем уроке.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Epsilon-greedy explanation ── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingDown className="w-6 h-6 text-secondary" />
          Стратегия Epsilon-Greedy
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Помните дилемму exploration vs exploitation из первого урока? Epsilon-greedy — самый
          простой способ её решить. Агент выбирает:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <Card className="bg-card/50 border-primary/20">
            <CardContent className="p-4">
              <p className="font-bold text-sm text-primary mb-1">
                С вероятностью ε → случайное действие
              </p>
              <p className="text-xs text-muted-foreground">
                Exploration: агент исследует среду, пробуя новые действия
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-green-500/20">
            <CardContent className="p-4">
              <p className="font-bold text-sm text-green-400 mb-1">
                С вероятностью (1-ε) → лучшее действие
              </p>
              <p className="text-xs text-muted-foreground">
                Exploitation: агент выбирает действие с максимальным Q-значением
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/30 border-border/30">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              <strong className="text-foreground">Epsilon decay:</strong> в начале обучения
              ε = 1.0 (100% случайных действий — полное исследование). Постепенно ε
              уменьшается до 0.01, и агент всё больше полагается на выученные Q-значения.
            </p>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex-1 h-2 rounded-full bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(to right, hsl(180,100%,50%), hsl(280,100%,50%), hsl(120,100%,40%))",
                    width: "100%",
                  }}
                />
              </div>
              <div className="flex gap-3 flex-shrink-0 text-muted-foreground">
                <span>ε=1.0</span>
                <span>→</span>
                <span>ε=0.01</span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground/60 mt-1">
              <span>Исследование</span>
              <span>Использование</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Neural network agent ── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          Агент на PyTorch
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Реализуем простой нейросетевой Q-learning агент. Полный{" "}
          <CrossLinkToHub
            hubPath="/pytorch/cheatsheet"
            hubAnchor="training"
            hubTitle="PyTorch — Цикл обучения"
          >
            цикл обучения
          </CrossLinkToHub>
          : сеть принимает 4 наблюдения и выдаёт Q-значения для 2 действий.
        </p>

        <Card className="bg-card/30 border-border/30 mb-4">
          <CardContent className="p-4">
            <p className="text-sm font-semibold text-foreground mb-2">
              Архитектура Q-сети:
            </p>
            <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
              <span className="px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                4 входа (obs)
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="px-2 py-1 rounded bg-muted/20 text-foreground border border-border/30">
                Linear(128) + ReLU
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="px-2 py-1 rounded bg-muted/20 text-foreground border border-border/30">
                Linear(128) + ReLU
              </span>
              <span className="text-muted-foreground">→</span>
              <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                2 выхода (Q-values)
              </span>
            </div>
          </CardContent>
        </Card>

        <CyberCodeBlock language="python" filename="simple_q_agent.py">
          {`import torch
import torch.nn as nn
import torch.optim as optim
import gymnasium as gym
import numpy as np
from collections import deque
import random

# ─── Гиперпараметры ───
LR = 1e-3           # Скорость обучения
GAMMA = 0.99         # Дисконт будущих наград
EPSILON_START = 1.0  # Начальное значение ε (100% exploration)
EPSILON_END = 0.01   # Финальное значение ε
EPSILON_DECAY = 0.995  # Множитель decay на каждом эпизоде
EPISODES = 500
BATCH_SIZE = 64
MEMORY_SIZE = 10000

# ─── Q-сеть ───
class QNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(4, 128),
            nn.ReLU(),
            nn.Linear(128, 128),
            nn.ReLU(),
            nn.Linear(128, 2)
        )

    def forward(self, x):
        return self.net(x)

# ─── Инициализация ───
env = gym.make("CartPole-v1")
q_net = QNetwork()
optimizer = optim.Adam(q_net.parameters(), lr=LR)
memory = deque(maxlen=MEMORY_SIZE)
epsilon = EPSILON_START
rewards_history = []

# ─── Цикл обучения ───
for episode in range(EPISODES):
    obs, _ = env.reset()
    total_reward = 0

    while True:
        # Epsilon-greedy: случайное или лучшее действие
        if random.random() < epsilon:
            action = env.action_space.sample()
        else:
            with torch.no_grad():
                q_vals = q_net(torch.FloatTensor(obs))
                action = q_vals.argmax().item()

        # Шаг в среде
        next_obs, reward, term, trunc, _ = env.step(action)
        done = term or trunc

        # Сохраняем переход в буфер (Replay Buffer)
        memory.append((obs, action, reward, next_obs, done))
        obs = next_obs
        total_reward += reward

        # Обучение на мини-батче из буфера
        if len(memory) >= BATCH_SIZE:
            batch = random.sample(memory, BATCH_SIZE)
            states = torch.FloatTensor([b[0] for b in batch])
            actions = torch.LongTensor([b[1] for b in batch])
            rewards = torch.FloatTensor([b[2] for b in batch])
            next_states = torch.FloatTensor([b[3] for b in batch])
            dones = torch.FloatTensor([b[4] for b in batch])

            # Q(s, a) — текущая оценка
            current_q = q_net(states).gather(1, actions.unsqueeze(1))
            # max Q(s', a') — лучшая будущая оценка
            next_q = q_net(next_states).max(1)[0].detach()
            # Целевое значение: r + γ·max Q(s', a')
            target_q = rewards + GAMMA * next_q * (1 - dones)

            loss = nn.MSELoss()(current_q.squeeze(), target_q)
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

        if done:
            break

    # Уменьшаем ε после каждого эпизода
    epsilon = max(EPSILON_END, epsilon * EPSILON_DECAY)
    rewards_history.append(total_reward)

    if (episode + 1) % 50 == 0:
        avg = np.mean(rewards_history[-50:])
        print(f"Episode {episode+1}, Avg Reward: {avg:.1f}, ε: {epsilon:.3f}")`}
        </CyberCodeBlock>

        {/* Code breakdown */}
        <Accordion type="multiple" className="mt-4 space-y-2">
          <AccordionItem
            value="replay"
            className="border-border/30 rounded-lg overflow-hidden bg-card/20"
          >
            <AccordionTrigger className="px-4 text-sm text-muted-foreground hover:text-foreground hover:no-underline">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Разбор: зачем нужен Replay Buffer?
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Replay Buffer</strong> (буфер воспоминаний)
                хранит переходы <code className="text-primary text-xs">(s, a, r, s', done)</code>.
                Без него агент обучается только на последнем переходе — это нестабильно, потому
                что соседние переходы сильно коррелируют. Случайная выборка из буфера разрушает
                эту корреляцию и стабилизирует обучение.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="target"
            className="border-border/30 rounded-lg overflow-hidden bg-card/20"
          >
            <AccordionTrigger className="px-4 text-sm text-muted-foreground hover:text-foreground hover:no-underline">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Разбор: формула обновления Q
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Ключевая строка:{" "}
                  <code className="text-primary text-xs">
                    target_q = rewards + GAMMA * next_q * (1 - dones)
                  </code>
                </p>
                <p>
                  Это уравнение Беллмана: текущая награда + дисконтированная лучшая будущая
                  награда. Множитель <code className="text-primary text-xs">(1 - dones)</code>{" "}
                  обнуляет будущую награду для терминальных состояний (когда эпизод окончен,
                  будущего нет).
                </p>
                <p>
                  <CrossLinkToHub
                    hubPath="/math-rl/module-5"
                    hubAnchor="глава-5"
                    hubTitle="Математика RL — Глава 5. Уравнения Беллмана"
                  >
                    Подробнее о уравнении Беллмана →
                  </CrossLinkToHub>
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ── Results ── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Визуализация результатов</h2>

        <CyberCodeBlock language="python" filename="plot_results.py">
          {`import matplotlib.pyplot as plt

window = 50
smoothed = [np.mean(rewards_history[max(0,i-window):i+1])
            for i in range(len(rewards_history))]

plt.figure(figsize=(10, 5))
plt.plot(rewards_history, alpha=0.3, color='cyan', label='Reward')
plt.plot(smoothed, color='magenta', linewidth=2, label=f'Avg (окно={window})')
plt.axhline(y=475, color='lime', linestyle='--', label='Цель: 475')
plt.xlabel('Эпизод')
plt.ylabel('Reward')
plt.title('Обучение Q-агента на CartPole-v1')
plt.legend()
plt.grid(alpha=0.2)
plt.show()`}
        </CyberCodeBlock>

        <Card className="bg-card/40 border-border/30 mt-4">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground mb-3">
              Ожидаемая динамика обучения:
            </p>
            <div className="space-y-2">
              {[
                {
                  ep: "0–100",
                  reward: "~20–50",
                  note: "Исследование (высокий ε)",
                  color: "text-yellow-400",
                },
                {
                  ep: "100–250",
                  reward: "~100–300",
                  note: "Активное обучение",
                  color: "text-blue-400",
                },
                {
                  ep: "250–400",
                  reward: "~300–475",
                  note: "Стабилизация",
                  color: "text-purple-400",
                },
                {
                  ep: "400–500",
                  reward: "~475–500",
                  note: "Конвергенция",
                  color: "text-green-400",
                },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-4 text-sm">
                  <span className="font-mono text-xs text-primary w-20">{row.ep}</span>
                  <span className="text-foreground w-24">{row.reward}</span>
                  <span className={`${row.color} text-xs`}>●</span>
                  <span className="text-muted-foreground">{row.note}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Extra: FrozenLake crosslink ── */}
      <section>
        <Card className="bg-card/30 border-border/30">
          <CardContent className="p-4 flex gap-3 items-start">
            <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-foreground">
                Хотите попрактиковаться с Q-таблицей?
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Проект{" "}
                <CrossLinkToHub
                  hubPath="/projects/frozen-lake"
                  hubTitle="Проект: FrozenLake — Q-Learning с нуля"
                >
                  FrozenLake
                </CrossLinkToHub>{" "}
                — отличное дополнение к этому уроку. Там мы реализуем классический
                Q-learning с таблицей в дискретной среде. Это поможет понять, почему в
                CartPole нужна нейросеть.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Summary ── */}
      <section>
        <Card className="bg-gradient-to-br from-primary/5 via-card/40 to-secondary/5 border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              Подведём итоги
            </h2>
            <div className="space-y-3">
              {[
                "Gymnasium — стандартная библиотека RL-сред для быстрого прототипирования алгоритмов",
                "CartPole-v1: 4 непрерывных наблюдения, 2 дискретных действия, максимум 500 reward",
                "Случайный агент (~20 reward) — baseline для оценки прогресса обучения",
                "Нейросеть аппроксимирует Q-функцию, позволяя работать с непрерывными состояниями",
                "Epsilon-greedy с decay балансирует exploration и exploitation в процессе обучения",
                "Replay Buffer стабилизирует обучение, разрушая корреляции между переходами",
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
                В следующем уроке мы формализуем этот подход в полноценный DQN с Target
                Network, Replay Buffer и Huber Loss!
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Mini-project: воспроизводимый эксперимент (бывший Проект 1) ── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Мини-проект: воспроизводимый эксперимент
          </h2>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Закрепим материал на полноценном эксперименте. Это та же задача CartPole, но с
          фиксированным seed, метриками успеха и стартовым шаблоном —
          научимся проводить{" "}
          <strong className="text-foreground">воспроизводимое</strong> RL-исследование.
        </p>

        {/* Mission */}
        <Card className="bg-card/40 border-primary/30 mb-4">
          <CardContent className="p-6 flex gap-4 items-start">
            <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <p className="text-foreground font-semibold">
                Задание: обучите{" "}
                <CrossLinkToHub hubPath="/algorithms/dqn" hubTitle="DQN — Deep Q-Network">
                  DQN
                </CrossLinkToHub>
                -агента, который стабильно достигает среднего reward &gt; 475 за последние
                100 из 500 эпизодов в среде CartPole-v1.
              </p>
              <p className="text-sm text-muted-foreground">
                Используйте фиксированный{" "}
                <code className="text-primary bg-primary/10 px-1 rounded">seed=42</code> для{" "}
                <CrossLinkToHub
                  hubPath="/pytorch/cheatsheet"
                  hubAnchor="saving"
                  hubTitle="PyTorch — Сохранение и загрузка"
                >
                  воспроизводимости
                </CrossLinkToHub>{" "}
                результатов. Эксперимент должен быть запускаемым одной командой.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Success criteria */}
        <h3 className="text-lg font-bold text-foreground mb-3">Критерии успеха</h3>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Метрика</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Минимум</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Хорошо</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Отлично</th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: "Avg reward (последние 100)", min: "> 400", good: "> 475", great: "= 500" },
                { metric: "Эпизод конвергенции", min: "< 500", good: "< 350", great: "< 250" },
                { metric: "Воспроизводимость (seed=42)", min: "Да", good: "Да", great: "Да" },
                { metric: "Код документирован", min: "Комментарии", good: "+docstrings", great: "+README" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/20">
                  <td className="py-2 px-3 text-foreground">{row.metric}</td>
                  <td className="py-2 px-3 text-muted-foreground">{row.min}</td>
                  <td className="py-2 px-3 text-secondary">{row.good}</td>
                  <td className="py-2 px-3 text-primary font-semibold">{row.great}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Starter code */}
        <h3 className="text-lg font-bold text-foreground mb-3">Starter-код</h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Используйте этот шаблон как основу. Заполните пропуски, помеченные{" "}
          <code className="text-accent bg-accent/10 px-1 rounded">TODO</code>.
        </p>

        <CyberCodeBlock language="python" filename="cartpole_experiment_starter.py">
{`"""
Мини-проект: воспроизводимый CartPole-эксперимент (DQN)
Цель: avg reward > 475 за последние 100 эпизодов из 500
Seed: 42
"""
import torch
import torch.nn as nn
import torch.optim as optim
import gymnasium as gym
import numpy as np
import random
from collections import deque, namedtuple

# ── Фиксируем seed ─────────────────────────────────────
SEED = 42
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)

# ── Гиперпараметры (можно менять) ──────────────────────
LR = 1e-3
GAMMA = 0.99
EPS_START = 1.0
EPS_END = 0.01
EPS_DECAY = 0.995
EPISODES = 500
BATCH_SIZE = 64
MEMORY_SIZE = 100000
TARGET_UPDATE = 10

# ── Replay Buffer ──────────────────────────────────────
Transition = namedtuple('Transition',
    ('state', 'action', 'reward', 'next_state', 'done'))

class ReplayBuffer:
    # TODO: реализуйте методы push, sample, __len__
    pass

# ── Q-Network ──────────────────────────────────────────
class DQN(nn.Module):
    def __init__(self):
        super().__init__()
        # TODO: определите архитектуру сети
        pass

    def forward(self, x):
        # TODO
        pass

# ── Выбор действия ─────────────────────────────────────
def select_action(state, policy_net, epsilon):
    # TODO: epsilon-greedy
    pass

# ── Шаг обучения ───────────────────────────────────────
def train_step(policy_net, target_net, memory, optimizer):
    if len(memory) < BATCH_SIZE:
        return
    # TODO: sample batch, compute loss, backprop
    pass

# ── Основной цикл ─────────────────────────────────────
def main():
    env = gym.make("CartPole-v1")
    policy_net = DQN()
    target_net = DQN()
    target_net.load_state_dict(policy_net.state_dict())
    optimizer = optim.Adam(policy_net.parameters(), lr=LR)
    memory = ReplayBuffer(MEMORY_SIZE)

    epsilon = EPS_START
    rewards_history = []

    for episode in range(EPISODES):
        state, _ = env.reset(seed=SEED + episode)
        total_reward = 0

        while True:
            action = select_action(state, policy_net, epsilon)
            next_state, reward, term, trunc, _ = env.step(action)
            done = term or trunc

            memory.push(state, action, reward, next_state, done)
            train_step(policy_net, target_net, memory, optimizer)

            state = next_state
            total_reward += reward
            if done:
                break

        epsilon = max(EPS_END, epsilon * EPS_DECAY)
        rewards_history.append(total_reward)

        if (episode + 1) % TARGET_UPDATE == 0:
            target_net.load_state_dict(policy_net.state_dict())

        if (episode + 1) % 50 == 0:
            avg = np.mean(rewards_history[-50:])
            print(f"Ep {episode+1} | Avg: {avg:.1f} | ε: {epsilon:.3f}")

    # ── Проверка результата ────────────────────────────
    final_avg = np.mean(rewards_history[-100:])
    print(f"\\nФинальный средний reward: {final_avg:.1f}")
    assert final_avg > 475, f"Не достигнут порог 475! ({final_avg:.1f})"
    print("✅ Эксперимент завершён успешно!")

if __name__ == "__main__":
    main()`}
        </CyberCodeBlock>

        <div className="flex gap-3 mt-4 flex-wrap">
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://colab.research.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Открыть в Colab
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Download className="w-3.5 h-3.5" />
            Скачать .py
          </Button>
        </div>

        {/* Tips */}
        <h3 className="text-lg font-bold text-foreground mt-6 mb-3">Подсказки</h3>
        <div className="space-y-3 mb-6">
          {[
            "Начните с реализации ReplayBuffer — он нужен для всего остального.",
            "Используйте Huber Loss (SmoothL1Loss) вместо MSE — он устойчивее к выбросам.",
            "Не забудьте clip_grad_norm_ — предотвращает взрыв градиентов.",
            "Если reward не растёт после 200 эпизодов — уменьшите LR или увеличьте BATCH_SIZE.",
          ].map((tip, i) => (
            <div key={i} className="flex gap-3 items-start">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>

        {/* Bridge to next 3D project */}
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/30">
          <CardContent className="p-6 text-center space-y-3">
            <Trophy className="w-10 h-10 text-primary mx-auto" />
            <h3 className="text-xl font-bold text-foreground">Готовы перенести знания в 3D?</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Тот же принцип балансировки, но в полноценной Unity-среде с физикой —{" "}
              <CrossLinkToHub
                hubPath="/courses/project-1"
                hubTitle='Проект-1: "Баланс в 3D"'
              >
                Проект-1: «Баланс в 3D»
              </CrossLinkToHub>
              .
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── Quiz ── */}
      <Quiz
        title="Проверь себя: CartPole"
        questions={quizQuestions}
        nextLesson={{ path: "/courses/1-6", title: "DQN с нуля на PyTorch" }}
      />
    </LessonLayout>
  );
};

export default CourseLesson1_5;
