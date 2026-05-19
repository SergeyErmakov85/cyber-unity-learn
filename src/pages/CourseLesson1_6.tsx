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
  Shield,
  Shuffle,
  Database,
  RefreshCw,
  Brain,
  Newspaper,
  ArrowRightLeft,
  CheckCircle2,
  BookOpen,
  Save,
  Scissors,
} from "lucide-react";
import CrossLinkToHub from "@/components/CrossLinkToHub";

const quizQuestions = [
  {
    question: "Зачем в DQN используется Target Network?",
    options: [
      "Для ускорения обучения",
      "Для стабилизации — target не меняется каждый шаг",
      "Для увеличения размера батча",
      "Target Network не используется в DQN",
    ],
    correctIndex: 1,
    explanation:
      "Если вычислять target из той же сети, которую мы обучаем, — цель «убегает» на каждом шаге. Target Network обновляется редко (каждые N эпизодов), что стабилизирует обучение.",
  },
  {
    question: "Что хранит Replay Buffer?",
    options: [
      "Только последние наблюдения",
      "Веса нейронной сети",
      "Переходы (s, a, r, s', done)",
      "Градиенты функции потерь",
    ],
    correctIndex: 2,
    explanation:
      "Replay Buffer хранит переходы (state, action, reward, next_state, done). Случайная выборка из буфера разрушает корреляцию между последовательными шагами и позволяет переиспользовать опыт.",
  },
  {
    question: "Как работает epsilon-greedy с decay?",
    options: [
      "ε всегда равен 0.5",
      "ε начинается высоким и постепенно уменьшается",
      "ε увеличивается со временем",
      "ε случайно меняется каждый эпизод",
    ],
    correctIndex: 1,
    explanation:
      "ε начинается с 1.0 (100% случайных действий) и экспоненциально уменьшается до ~0.01. Это обеспечивает исследование в начале и эксплуатацию знаний в конце обучения.",
  },
  {
    question: "Какая функция потерь обычно используется в DQN?",
    options: [
      "Cross-Entropy Loss",
      "Hinge Loss",
      "MSE Loss (или Huber Loss)",
      "KL Divergence",
    ],
    correctIndex: 2,
    explanation:
      "DQN минимизирует разницу между предсказанным Q(s,a) и target-значением. MSE Loss подходит, но Huber Loss (SmoothL1) более устойчив к выбросам — он квадратичен для малых ошибок и линеен для больших.",
  },
  {
    question: "Как часто обновляется Target Network в классическом DQN?",
    options: [
      "Каждый шаг",
      "Каждый эпизод",
      "Каждые N шагов (hard update)",
      "Никогда — она фиксирована",
    ],
    correctIndex: 2,
    explanation:
      "В классическом DQN target-сеть обновляется полным копированием весов (hard update) каждые N шагов. В некоторых вариантах используют soft update (плавное смешивание весов).",
  },
];

const CourseLesson1_6 = () => {
  return (
    <LessonLayout
      lessonId="1-6"
      lessonTitle="DQN с нуля на PyTorch"
      lessonNumber="1.6"
      duration="45 мин"
      tags={["#code", "#pytorch", "#dqn", "#deep"]}
      prevLesson={{ path: "/courses/1-5", title: "CartPole — твой первый RL-агент" }}
      nextLesson={{ path: "/courses/1-7", title: "Exploration vs Exploitation" }}
      keyConcepts={[
        "DQN — первый deep RL алгоритм (DeepMind, 2015)",
        "Target Network — стабилизация обучения",
        "Experience Replay — разрушение корреляций",
        "Huber Loss и gradient clipping — робастное обучение",
        "Сохранение и загрузка обученной модели",
      ]}
    >
      {/* Colab */}
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

      {/* ── 1. Intro + history ── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-primary" />
          Что такое DQN и почему это прорыв?
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          В 2015 году команда DeepMind опубликовала в{" "}
          <strong className="text-foreground">Nature</strong> статью «Human-level control
          through deep reinforcement learning». Их алгоритм —{" "}
          <strong className="text-primary">Deep Q-Network (DQN)</strong> — научился играть
          в 49 игр Atari на уровне человека, получая на вход только пиксели экрана.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          В предыдущем уроке мы написали простой Q-агент для CartPole. Он работал, но имел
          две фундаментальные проблемы. DQN решает обе:
        </p>
      </section>

      {/* ── 2. Comparison: 1.6 Q-Learning vs DQN ── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <ArrowRightLeft className="w-6 h-6 text-secondary" />
          Что изменилось по сравнению с уроком 1.6?
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 border-b border-border/30 text-muted-foreground font-medium" />
                <th className="text-left p-3 border-b border-border/30 text-muted-foreground font-medium">
                  Урок 1.6 (простой Q-агент)
                </th>
                <th className="text-left p-3 border-b border-border/30 text-primary font-medium">
                  Урок 1.4 (DQN)
                </th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["Нейросеть", "Одна Q-сеть", "Policy-сеть + Target-сеть"],
                ["Target-значения", "Из той же сети (нестабильно)", "Из замороженной target-сети"],
                ["Буфер опыта", "deque (простой)", "ReplayBuffer (namedtuple)"],
                ["Loss", "MSE Loss", "Huber Loss (SmoothL1)"],
                ["Gradient clipping", "Нет", "clip_grad_norm_ (макс. 1.0)"],
                ["Воспроизводимость", "Нет seed", "Фиксированный seed"],
              ].map(([feature, prev, next], i) => (
                <tr key={i} className="border-b border-border/10">
                  <td className="p-3 font-medium text-foreground text-xs">{feature}</td>
                  <td className="p-3 text-xs">{prev}</td>
                  <td className="p-3 text-xs text-primary">{next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 3. Architecture ── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Архитектура DQN</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Две ключевые инновации DQN, которые сделали обучение стабильным:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: Shield,
              title: (
                <CrossLinkToHub hubPath="/algorithms/dqn" hubTitle="DQN — Target Network">
                  Target Network
                </CrossLinkToHub>
              ),
              desc: (
                <span>
                  Копия Q-сети, обновляемая каждые N эпизодов. Стабилизирует target-значения
                  по{" "}
                  <CrossLinkToHub
                    hubPath="/math-rl/module-5"
                    hubAnchor="глава-5"
                    hubTitle="Математика RL — Глава 5. Уравнения Беллмана"
                  >
                    уравнению Беллмана
                  </CrossLinkToHub>
                  , предотвращая «гонку за собственным хвостом».
                </span>
              ),
              color: "text-primary",
              bg: "border-primary/30",
            },
            {
              icon: Database,
              title: (
                <CrossLinkToHub hubPath="/algorithms/dqn" hubTitle="DQN — Replay Buffer">
                  Experience Replay
                </CrossLinkToHub>
              ),
              desc: "Буфер переходов (s, a, r, s', done). Разрушает корреляцию между последовательными шагами и позволяет обучаться на прошлом опыте многократно.",
              color: "text-secondary",
              bg: "border-secondary/30",
            },
          ].map((item, i) => (
            <Card key={i} className={`bg-card/50 ${item.bg}`}>
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* DQN visual architecture */}
        <div className="mt-6 p-5 rounded-xl bg-card/30 border border-border/30 space-y-4">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Схема DQN
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="flex-1 p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
              <Brain className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="font-bold text-sm text-primary">Policy Network</p>
              <p className="text-xs text-muted-foreground">Обучается каждый шаг</p>
              <p className="text-xs text-muted-foreground/60 font-mono mt-1">
                Q_θ(s) → [Q₀, Q₁]
              </p>
            </div>
            <div className="text-muted-foreground/40 text-lg hidden md:block">⇄</div>
            <div className="text-muted-foreground/40 text-lg md:hidden">↕</div>
            <div className="flex-1 p-4 rounded-lg bg-secondary/5 border border-secondary/20 text-center">
              <Shield className="w-6 h-6 text-secondary mx-auto mb-1" />
              <p className="font-bold text-sm text-secondary">Target Network</p>
              <p className="text-xs text-muted-foreground">Копия, обновляется каждые N эп.</p>
              <p className="text-xs text-muted-foreground/60 font-mono mt-1">
                Q_θ⁻(s') → max Q
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 text-center">
              <Database className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="font-bold text-xs text-accent">Replay Buffer</p>
              <p className="text-xs text-muted-foreground">
                (s, a, r, s', done) × 100,000
              </p>
            </div>
          </div>
        </div>

        {/* DQN flow */}
        <div className="mt-4 p-4 rounded-lg bg-card/30 border border-border/30">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3">
            Цикл обучения DQN
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {[
              { label: "Sample batch", icon: Shuffle, color: "text-primary" },
              { label: "Compute Q(s,a)", icon: Brain, color: "text-secondary" },
              { label: "Compute target", icon: Shield, color: "text-accent" },
              {
                label: (
                  <CrossLinkToHub
                    hubPath="/pytorch/cheatsheet"
                    hubAnchor="nn"
                    hubTitle="PyTorch — Функции потерь"
                  >
                    Huber Loss
                  </CrossLinkToHub>
                ),
                icon: RefreshCw,
                color: "text-green-400",
              },
              { label: "Gradient step", icon: RefreshCw, color: "text-primary" },
              { label: "Update target", icon: Database, color: "text-secondary" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-1">
                <span
                  className={`flex items-center gap-1 px-2 py-1 rounded bg-muted/30 border border-border/30 ${step.color}`}
                >
                  <step.icon className="w-3 h-3" />
                  <span className="text-xs">{step.label}</span>
                </span>
                {i < 5 && <span className="text-muted-foreground/50">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Replay Buffer ── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          <CrossLinkToHub hubPath="/algorithms/dqn" hubTitle="DQN — Replay Buffer">
            Replay Buffer
          </CrossLinkToHub>
        </h2>

        <CyberCodeBlock language="python" filename="replay_buffer.py">
          {`import random
from collections import deque, namedtuple

Transition = namedtuple('Transition',
    ('state', 'action', 'reward', 'next_state', 'done'))

class ReplayBuffer:
    def __init__(self, capacity=100000):
        self.buffer = deque(maxlen=capacity)

    def push(self, state, action, reward, next_state, done):
        self.buffer.append(Transition(state, action, reward, next_state, done))

    def sample(self, batch_size):
        batch = random.sample(self.buffer, batch_size)
        return Transition(*zip(*batch))

    def __len__(self):
        return len(self.buffer)`}
        </CyberCodeBlock>
      </section>

      {/* ── 5. Huber Loss + gradient clipping ── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Scissors className="w-6 h-6 text-green-400" />
          Huber Loss и Gradient Clipping
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          В уроке 1.6 мы использовали MSE Loss. DQN заменяет его на два инструмента
          для более робастного обучения:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card/50 border-green-500/20">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-sm text-green-400 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Huber Loss (SmoothL1)
              </h3>
              <p className="text-xs text-muted-foreground">
                Комбинация MSE (для малых ошибок) и L1 (для больших). MSE придаёт огромный вес
                выбросам, из-за чего обучение «прыгает». Huber Loss ограничивает градиент для
                больших ошибок, делая обучение плавнее.
              </p>
              <CyberCodeBlock language="python" filename="loss">
                {`# MSE: чувствителен к выбросам
loss = nn.MSELoss()(q_values, target)

# Huber: робастен к выбросам ✓
loss = nn.SmoothL1Loss()(q_values, target)`}
              </CyberCodeBlock>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-orange-500/20">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-sm text-orange-400 flex items-center gap-2">
                <Scissors className="w-4 h-4" /> Gradient Clipping
              </h3>
              <p className="text-xs text-muted-foreground">
                Ограничивает норму градиентов максимальным значением (1.0). Без этого один
                «неудачный» батч может создать огромные градиенты, которые разрушат веса
                (exploding gradients).
              </p>
              <CyberCodeBlock language="python" filename="clipping">
                {`# Без clipping: градиенты могут быть огромными
optimizer.step()

# С clipping: норма ≤ 1.0 ✓
torch.nn.utils.clip_grad_norm_(
    policy_net.parameters(), max_norm=1.0
)
optimizer.step()`}
              </CyberCodeBlock>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── 6. Full DQN code ── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          Полный код DQN-агента
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-2">
          Epsilon-greedy стратегию мы разобрали в{" "}
          <CrossLinkToHub hubPath="/courses/1-3" hubTitle="Урок 1.3 — Q-Learning: табличный метод">
            уроке 1.3
          </CrossLinkToHub>
          . Здесь она работает так же — ε экспоненциально затухает от 1.0 до 0.01.
        </p>

        <CyberCodeBlock language="python" filename="dqn_agent.py">
          {`import torch
import torch.nn as nn
import torch.optim as optim
import gymnasium as gym
import numpy as np
import random
from collections import deque, namedtuple

# ── Гиперпараметры ──
LR = 1e-3
GAMMA = 0.99
EPS_START = 1.0
EPS_END = 0.01
EPS_DECAY = 0.995
EPISODES = 600
BATCH_SIZE = 64
MEMORY_SIZE = 100000
TARGET_UPDATE = 10  # Обновление target-сети каждые N эпизодов
SEED = 42

# ── Воспроизводимость ──
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)

# ── Replay Buffer ──
Transition = namedtuple('Transition',
    ('state', 'action', 'reward', 'next_state', 'done'))

class ReplayBuffer:
    def __init__(self, capacity):
        self.buffer = deque(maxlen=capacity)

    def push(self, *args):
        self.buffer.append(Transition(*args))

    def sample(self, batch_size):
        batch = random.sample(self.buffer, batch_size)
        return Transition(*zip(*batch))

    def __len__(self):
        return len(self.buffer)

# ── Q-Network ──
class DQN(nn.Module):
    def __init__(self, obs_dim=4, n_actions=2):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(obs_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 128),
            nn.ReLU(),
            nn.Linear(128, n_actions)
        )

    def forward(self, x):
        return self.net(x)

# ── Инициализация ──
env = gym.make("CartPole-v1")
policy_net = DQN()
target_net = DQN()
target_net.load_state_dict(policy_net.state_dict())
target_net.eval()

optimizer = optim.Adam(policy_net.parameters(), lr=LR)
memory = ReplayBuffer(MEMORY_SIZE)
epsilon = EPS_START
rewards_history = []

# ── Цикл обучения ──
for episode in range(EPISODES):
    state, _ = env.reset(seed=SEED + episode)
    total_reward = 0

    while True:
        # Epsilon-greedy
        if random.random() < epsilon:
            action = env.action_space.sample()
        else:
            with torch.no_grad():
                action = policy_net(torch.FloatTensor(state)).argmax().item()

        next_state, reward, term, trunc, _ = env.step(action)
        done = term or trunc
        memory.push(state, action, reward, next_state, done)
        state = next_state
        total_reward += reward

        # Обучение
        if len(memory) >= BATCH_SIZE:
            batch = memory.sample(BATCH_SIZE)

            states = torch.FloatTensor(np.array(batch.state))
            actions = torch.LongTensor(batch.action).unsqueeze(1)
            rewards = torch.FloatTensor(batch.reward)
            next_states = torch.FloatTensor(np.array(batch.next_state))
            dones = torch.FloatTensor(batch.done)

            # Q(s, a) из policy-сети
            q_values = policy_net(states).gather(1, actions).squeeze()

            # max Q(s', a') из target-сети (заморожена)
            with torch.no_grad():
                next_q = target_net(next_states).max(1)[0]
                target = rewards + GAMMA * next_q * (1 - dones)

            loss = nn.SmoothL1Loss()(q_values, target)
            optimizer.zero_grad()
            loss.backward()
            torch.nn.utils.clip_grad_norm_(policy_net.parameters(), 1.0)
            optimizer.step()

        if done:
            break

    epsilon = max(EPS_END, epsilon * EPS_DECAY)
    rewards_history.append(total_reward)

    # Обновление target-сети
    if (episode + 1) % TARGET_UPDATE == 0:
        target_net.load_state_dict(policy_net.state_dict())

    if (episode + 1) % 50 == 0:
        avg = np.mean(rewards_history[-50:])
        print(f"Ep {episode+1} | Avg: {avg:.1f} | ε: {epsilon:.3f}")

print(f"\\nФинальный средний reward (последние 100): "
      f"{np.mean(rewards_history[-100:]):.1f}")`}
        </CyberCodeBlock>

        {/* Code breakdowns */}
        <Accordion type="multiple" className="mt-4 space-y-2">
          <AccordionItem
            value="two-nets"
            className="border-border/30 rounded-lg overflow-hidden bg-card/20"
          >
            <AccordionTrigger className="px-4 text-sm text-muted-foreground hover:text-foreground hover:no-underline">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Разбор: почему две сети?
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                В уроке 1.6 мы использовали одну сеть и для предсказания Q(s,a), и для
                вычисления target. Проблема: на каждом шаге target сдвигается вместе с
                обучением — сеть «гоняется за собственным хвостом».
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Target Network</strong> решает это:
                target-сеть «заморожена» и обновляется только каждые{" "}
                <code className="text-primary text-xs">TARGET_UPDATE</code> эпизодов. Это
                даёт стабильную цель для оптимизации.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="gather"
            className="border-border/30 rounded-lg overflow-hidden bg-card/20"
          >
            <AccordionTrigger className="px-4 text-sm text-muted-foreground hover:text-foreground hover:no-underline">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Разбор: что делает .gather(1, actions)?
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                <code className="text-primary text-xs">policy_net(states)</code> возвращает
                Q-значения для <strong className="text-foreground">всех</strong> действий:{" "}
                <code className="text-primary text-xs">[[Q₀, Q₁], [Q₀, Q₁], ...]</code>
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <code className="text-primary text-xs">.gather(1, actions)</code> извлекает
                Q-значение только для того действия, которое агент действительно совершил.
                Это эквивалент{" "}
                <code className="text-primary text-xs">Q[i, actions[i]]</code> для каждого
                элемента батча.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="bellman"
            className="border-border/30 rounded-lg overflow-hidden bg-card/20"
          >
            <AccordionTrigger className="px-4 text-sm text-muted-foreground hover:text-foreground hover:no-underline">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Разбор: формула target = r + γ·max Q(s',a')
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                Это{" "}
                <CrossLinkToHub
                  hubPath="/math-rl/module-5"
                  hubAnchor="глава-5"
                  hubTitle="Математика RL — Глава 5. Уравнения Беллмана"
                >
                  уравнение Беллмана
                </CrossLinkToHub>
                : оптимальное Q-значение = немедленная награда + дисконтированная лучшая
                будущая награда.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <code className="text-primary text-xs">(1 - dones)</code> обнуляет будущую
                награду для терминальных состояний. Если эпизод окончен — будущего нет,
                Q = только текущая награда.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ── 7. Convergence graph ── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">График сходимости</h2>

        <CyberCodeBlock language="python" filename="plot_convergence.py">
          {`import matplotlib.pyplot as plt

window = 50
avg_rewards = [np.mean(rewards_history[max(0,i-window):i+1])
               for i in range(len(rewards_history))]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

# Reward
ax1.plot(rewards_history, alpha=0.2, color='cyan')
ax1.plot(avg_rewards, color='magenta', linewidth=2)
ax1.axhline(y=475, color='lime', linestyle='--', alpha=0.7)
ax1.set_xlabel('Эпизод')
ax1.set_ylabel('Reward')
ax1.set_title('DQN: Reward vs Episodes')
ax1.legend(['Raw', f'Avg-{window}', 'Target=475'])

# Epsilon
eps_vals = [max(EPS_END, EPS_START * EPS_DECAY**i) for i in range(EPISODES)]
ax2.plot(eps_vals, color='cyan')
ax2.set_xlabel('Эпизод')
ax2.set_ylabel('Epsilon')
ax2.set_title('Epsilon Decay')

plt.tight_layout()
plt.show()`}
        </CyberCodeBlock>
      </section>

      {/* ── 8. Save / load model ── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Save className="w-6 h-6 text-green-400" />
          Сохранение и загрузка модели
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          После обучения важно сохранить веса модели — чтобы не обучать заново, а также для
          использования в{" "}
          <CrossLinkToHub
            hubPath="/pytorch/cheatsheet"
            hubAnchor="saving"
            hubTitle="PyTorch — Сохранение"
          >
            других проектах
          </CrossLinkToHub>
          .
        </p>

        <CyberCodeBlock language="python" filename="save_load.py">
          {`# ── Сохранение обученной модели ──
torch.save({
    'model_state_dict': policy_net.state_dict(),
    'optimizer_state_dict': optimizer.state_dict(),
    'epsilon': epsilon,
    'rewards_history': rewards_history,
}, 'dqn_cartpole.pth')
print("Модель сохранена!")

# ── Загрузка модели ──
checkpoint = torch.load('dqn_cartpole.pth')
policy_net.load_state_dict(checkpoint['model_state_dict'])
policy_net.eval()

# Тестирование загруженной модели
env = gym.make("CartPole-v1", render_mode="human")
state, _ = env.reset()
total = 0
while True:
    with torch.no_grad():
        action = policy_net(torch.FloatTensor(state)).argmax().item()
    state, reward, term, trunc, _ = env.step(action)
    total += reward
    if term or trunc:
        break
print(f"Тестовый reward: {total}")
env.close()`}
        </CyberCodeBlock>

        <Card className="bg-card/40 border-primary/20 mt-4">
          <CardContent className="p-4 flex gap-3 items-start">
            <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Совет:</strong> сохраняйте не только веса
              модели, но и оптимизатор и историю наград — это позволит продолжить обучение с
              того же места. Параметр{" "}
              <code className="text-primary">render_mode="human"</code> включает визуализацию
              среды при тестировании.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── 9. Summary ── */}
      <section>
        <Card className="bg-gradient-to-br from-primary/5 via-card/40 to-secondary/5 border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              Подведём итоги
            </h2>
            <div className="space-y-3">
              {[
                "DQN (DeepMind, 2015) — первый алгоритм deep RL, достигший уровня человека в Atari",
                "Target Network стабилизирует обучение, «замораживая» target-значения на N эпизодов",
                "Experience Replay разрушает корреляции и позволяет переиспользовать опыт",
                "Huber Loss + gradient clipping защищают от выбросов и взрывающихся градиентов",
                "torch.save / torch.load — сохранение и загрузка обученной модели",
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
                Следующий шаг — Проект 1: применить DQN для задачи балансировки шеста и
                закрепить все навыки Уровня 1!
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── 10. Quiz ── */}
      <Quiz
        title="Проверь себя: DQN"
        questions={quizQuestions}
        lessonPath="/courses/1-5"
        nextLesson={{ path: "/courses/1-7", title: "Exploration vs Exploitation" }}
      />

    </LessonLayout>
  );
};

export default CourseLesson1_6;
