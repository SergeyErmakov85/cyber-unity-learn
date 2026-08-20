import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, Brain, Lightbulb, Settings2, Download, Layers, ArrowRight, Shield, Zap, GitBranch, CheckCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Math from "@/components/Math";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import HubLessonBadges from "@/components/HubLessonBadges";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PyTorchModule = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="bg-gradient-neon bg-clip-text text-transparent">
            Q-Learning и DQN: среда Taxi-v3
          </span>
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Табличное Q-обучение и Deep Q-Network для задачи навигации такси с использованием NumPy, PyTorch и Gym
        </p>
        <HubLessonBadges hubPath="/pytorch" />

        {/* Download + Cheat Sheet */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          <div className="p-6 rounded-lg bg-card/60 border border-primary/30 text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">📥 Скачать ноутбук</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Jupyter Notebook с полным кодом Q-Learning и DQN для Taxi-v3
            </p>
            <a href="/Taxi-v3.ipynb" download="Taxi-v3.ipynb">
              <Button className="bg-primary hover:bg-primary/80 text-primary-foreground">
                <Download className="w-4 h-4 mr-2" />
                Taxi-v3.ipynb
              </Button>
            </a>
          </div>
          <div className="p-6 rounded-lg bg-card/60 border border-secondary/30 text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">📋 Шпаргалка по PyTorch</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Тензоры, autograd, нейросети, цикл обучения, сохранение моделей и многое другое
            </p>
            <Button onClick={() => navigate("/pytorch/cheatsheet")} className="bg-secondary hover:bg-secondary/80 text-secondary-foreground">
              Открыть шпаргалку
            </Button>
          </div>
        </div>

        {/* Section 1: Overview */}
        <Section icon={<Brain className="w-5 h-5 text-primary" />} title="Обзор задачи">
          <p>
            Среда <strong className="text-foreground">Taxi-v3</strong> из библиотеки OpenAI Gym — классическая задача обучения с подкреплением. Агент-такси должен подобрать пассажира и доставить его в пункт назначения на сетке 5×5.
          </p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li><strong className="text-foreground">Состояния:</strong> <Math display={false}>{`|\\mathcal{S}| = 500`}</Math> (позиция такси, позиция пассажира, пункт назначения)</li>
            <li><strong className="text-foreground">Действия:</strong> <Math display={false}>{`|\\mathcal{A}| = 6`}</Math> (вверх, вниз, влево, вправо, подобрать, высадить)</li>
            <li><strong className="text-foreground">Награды:</strong> +20 за успешную доставку, −10 за неправильную посадку/высадку, −1 за каждый шаг</li>
          </ul>

          <InfoBox color="primary" title="Два подхода в этом ноутбуке">
            <p className="text-sm">
              <strong className="text-foreground">1. Табличный Q-Learning</strong> — Q-таблица 500×6, обновление по формуле Беллмана, 20 000 эпизодов.<br />
              <strong className="text-foreground">2. Deep Q-Network (DQN)</strong> — нейросетевая аппроксимация Q-функции с Experience Replay и Target Network.
            </p>
          </InfoBox>
        </Section>

        {/* ═══════════════════════════════════════════════════ */}
        {/*  PART 1 — Tabular Q-Learning                       */}
        {/* ═══════════════════════════════════════════════════ */}

        <Section icon={<Code2 className="w-5 h-5 text-accent" />} title="Часть 1: Табличный Q-Learning">
          <h3 className="text-xl font-semibold text-foreground mt-4 mb-3">1. Установка и создание среды</h3>
          <CyberCodeBlock language="python" filename="setup.py">{`# Установка зависимостей (запустите один раз)
import sys
!{sys.executable} -m pip install -q "numpy>=1.20,<2" gym==0.26.2 "gym[toy_text]==0.26.2"

import gym
import numpy as np

# Создание среды (render_mode="ansi" — текстовая визуализация без pygame)
env = gym.make("Taxi-v3", render_mode="ansi")

n_states = env.observation_space.n    # 500
n_actions = env.action_space.n        # 6
print("Состояний:", n_states, "Действий:", n_actions)`}</CyberCodeBlock>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">2. Гиперпараметры и Q-таблица</h3>

          <div className="my-4 overflow-x-auto">
            <table className="w-full text-sm border border-border/30 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-card/60">
                  <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Параметр</th>
                  <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Значение</th>
                  <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Описание</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/20">
                  <td className="p-3"><Math display={false}>{`\\enfPar{\\alpha}`}</Math></td>
                  <td className="p-3">0.1</td>
                  <td className="p-3">Скорость обучения</td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="p-3"><Math display={false}>{`\\enfPar{\\gamma}`}</Math></td>
                  <td className="p-3">0.99</td>
                  <td className="p-3">Коэффициент дисконтирования</td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="p-3"><Math display={false}>{`\\enfPar{\\varepsilon}`}</Math></td>
                  <td className="p-3">1.0 → 0.01</td>
                  <td className="p-3">Убывающая вероятность случайного действия</td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="p-3"><Math display={false}>{`\\enfPar{\\varepsilon}_{\\text{decay}}`}</Math></td>
                  <td className="p-3">0.999</td>
                  <td className="p-3">Множитель затухания epsilon</td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="p-3">max_steps</td>
                  <td className="p-3">100</td>
                  <td className="p-3">Максимум шагов в эпизоде</td>
                </tr>
                <tr>
                  <td className="p-3">Эпизоды</td>
                  <td className="p-3">20 000</td>
                  <td className="p-3">Количество тренировочных эпизодов</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Формула обновления Q-значений</h3>
          <Math>{`\\enfOp{Q}(\\enfVar{s},a) \\leftarrow \\enfOp{Q}(\\enfVar{s},a) + \\enfPar{\\alpha} \\bigl[ \\enfTgt{r} + \\enfPar{\\gamma} \\max_{a'} \\enfOp{Q}(\\enfVar{s}',a') - \\enfOp{Q}(\\enfVar{s},a) \\bigr]`}</Math>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">3. Цикл обучения Q-Learning</h3>
          <CyberCodeBlock language="python" filename="q_learning.py">{`# Гиперпараметры Q-обучения
alpha = 0.1       # скорость обучения
gamma = 0.99      # коэффициент дисконтирования
epsilon = 1.0     # начальная вероятность случайного действия
epsilon_min = 0.01
epsilon_decay = 0.999
n_episodes = 20000
max_steps = 100

# Q-таблица (состояние x действие)
q_table = np.zeros((n_states, n_actions))

def choose_action(state, epsilon):
    """epsilon-greedy выбор действия."""
    if np.random.rand() < epsilon:
        return env.action_space.sample()
    return int(np.argmax(q_table[state]))

rewards_per_thousand = []
rolling_reward = 0

for episode in range(1, n_episodes + 1):
    state, _ = env.reset()
    done = False
    episode_reward = 0

    for step in range(max_steps):
        action = choose_action(state, epsilon)
        next_state, reward, terminated, truncated, _ = env.step(action)
        done = terminated or truncated

        # Обновление Q-значения по формуле Беллмана
        best_next = np.max(q_table[next_state])
        q_table[state, action] = q_table[state, action] + alpha * (
            reward + gamma * best_next - q_table[state, action]
        )

        state = next_state
        episode_reward += reward

        if done:
            break

    epsilon = max(epsilon_min, epsilon * epsilon_decay)
    rolling_reward += episode_reward

    if episode % 1000 == 0:
        avg = rolling_reward / 1000
        rewards_per_thousand.append(avg)
        print(f"Эпизоды {episode-999}-{episode}, "
              f"средняя награда: {avg:.2f}, epsilon: {epsilon:.3f}")
        rolling_reward = 0

print("Обучение завершено.")`}</CyberCodeBlock>

          <InfoBox color="accent" title="Epsilon Decay">
            <p className="text-sm">
              В отличие от фиксированного ε, здесь используется экспоненциальное затухание: <Math display={false}>{`\\enfPar{\\varepsilon} \\leftarrow \\max(\\enfPar{\\varepsilon}_{\\min},\\; \\enfPar{\\varepsilon} \\cdot 0.999)`}</Math>. Это обеспечивает сначала активное исследование (exploration), а затем плавный переход к эксплуатации (exploitation).
            </p>
          </InfoBox>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">4. Визуализация и оценка</h3>
          <CyberCodeBlock language="python" filename="plot_eval.py">{`import matplotlib.pyplot as plt

# График обучения
plt.figure(figsize=(10, 5))
plt.plot(range(1000, n_episodes + 1, 1000), rewards_per_thousand,
         "b-o", linewidth=2, label="Q-learning")
plt.xlabel("Эпизод")
plt.ylabel("Средняя награда (за 1000 эп.)")
plt.title("Кривая обучения Q-learning (Taxi-v3)")
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

# Оценка обученной политики (анимация)
from IPython.display import clear_output
import time

for episode in range(1, 4):
    state, _ = env.reset()
    done, total_reward = False, 0

    for step in range(100):
        action = int(np.argmax(q_table[state]))
        next_state, reward, terminated, truncated, _ = env.step(action)
        done = terminated or truncated
        total_reward += reward
        state = next_state

        clear_output(wait=True)
        print(f"Эпизод {episode}/3, шаг {step + 1}")
        print(env.render())
        time.sleep(0.2)

        if done:
            break

    print(f"Награда за эпизод {episode}: {total_reward}")
    time.sleep(1)

env.close()

# Сохранение Q-таблицы
np.save("taxi_q_table.npy", q_table)
print("Q-таблица сохранена в файл taxi_q_table.npy")`}</CyberCodeBlock>
        </Section>

        {/* ═══════════════════════════════════════════════════ */}
        {/*  PART 2 — DQN                                      */}
        {/* ═══════════════════════════════════════════════════ */}

        <Section icon={<Layers className="w-5 h-5 text-secondary" />} title="Часть 2: Deep Q-Network (DQN)">
          <p>
            Нейросетевой аналог Q-learning. Вместо Q-таблицы используется полносвязная сеть (PyTorch), которая принимает one-hot вектор состояния и предсказывает Q-значения.
          </p>

          <InfoBox color="secondary" title="Ключевые отличия от табличного Q-Learning">
            <ul className="text-sm list-disc list-inside space-y-1">
              <li>Состояние кодируется как one-hot вектор размерности 500</li>
              <li>Q-функция аппроксимируется нейросетью с 2 скрытыми слоями (128 → 64)</li>
              <li><strong className="text-foreground">Experience Replay</strong> — буфер воспроизведения опыта (10 000 переходов)</li>
              <li><strong className="text-foreground">Target Network</strong> — целевая сеть для стабильности обучения</li>
            </ul>
          </InfoBox>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Архитектура и гиперпараметры DQN</h3>
          <div className="my-4 overflow-x-auto">
            <table className="w-full text-sm border border-border/30 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-card/60">
                  <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Параметр</th>
                  <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Значение</th>
                  <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Описание</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/20">
                  <td className="p-3">Архитектура</td>
                  <td className="p-3">500 → 128 → 64 → 6</td>
                  <td className="p-3">Полносвязные слои с ReLU</td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="p-3"><Math display={false}>{`\\enfPar{\\alpha}`}</Math> (lr)</td>
                  <td className="p-3">1e-3</td>
                  <td className="p-3">Скорость обучения Adam</td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="p-3"><Math display={false}>{`\\enfPar{\\gamma}`}</Math></td>
                  <td className="p-3">0.99</td>
                  <td className="p-3">Дисконтирование</td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="p-3"><Math display={false}>{`\\enfPar{\\varepsilon}`}</Math></td>
                  <td className="p-3">1.0 → 0.01 (decay 0.999)</td>
                  <td className="p-3">Epsilon-greedy исследование</td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="p-3">Batch size</td>
                  <td className="p-3">64</td>
                  <td className="p-3">Размер мини-батча</td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="p-3">Buffer size</td>
                  <td className="p-3">10 000</td>
                  <td className="p-3">Ёмкость Replay Buffer</td>
                </tr>
                <tr>
                  <td className="p-3">Target update</td>
                  <td className="p-3">каждые 10 эпизодов</td>
                  <td className="p-3">Синхронизация target-сети</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Формулы DQN</h3>
          <p>Целевое значение (target):</p>
          <Math>{`y = \\enfTgt{r} + \\enfPar{\\gamma} \\cdot \\max_{a'} \\enfOp{Q}_{\\text{target}}(\\enfVar{s}', a') \\cdot (1 - \\text{done})`}</Math>
          <p>Функция потерь:</p>
          <Math>{`L(\\enfPar{\\theta}) = \\text{MSE}\\bigl(\\enfOp{Q}_{\\theta}(\\enfVar{s},a),\\; y\\bigr)`}</Math>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">1. Нейросеть и Replay Buffer</h3>
          <CyberCodeBlock language="python" filename="dqn_model.py">{`import torch
import torch.nn as nn
import torch.optim as optim
import random
import LabPracticeSection from "@/components/LabPracticeSection";
from collections import deque

env_dqn = gym.make("Taxi-v3", render_mode="ansi")
N_STATES  = env_dqn.observation_space.n   # 500
N_ACTIONS = env_dqn.action_space.n        # 6

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Устройство: {device}")


# ── Нейросеть Q-функции ──
class DQN(nn.Module):
    """Полносвязная сеть: one-hot(500) → 128 → 64 → 6 (Q-значения)."""
    def __init__(self, n_states, n_actions):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(n_states, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, n_actions),
        )

    def forward(self, x):
        return self.net(x)


def state_to_tensor(state, n_states=N_STATES):
    """Преобразует целочисленное состояние в one-hot тензор."""
    one_hot = torch.zeros(n_states, device=device)
    one_hot[state] = 1.0
    return one_hot


# ── Буфер воспроизведения опыта ──
class ReplayBuffer:
    def __init__(self, capacity=10000):
        self.buffer = deque(maxlen=capacity)

    def push(self, state, action, reward, next_state, done):
        self.buffer.append((state, action, reward, next_state, done))

    def sample(self, batch_size):
        batch = random.sample(self.buffer, batch_size)
        states, actions, rewards, next_states, dones = zip(*batch)
        return (
            torch.stack([state_to_tensor(s) for s in states]),
            torch.tensor(actions, device=device, dtype=torch.long),
            torch.tensor(rewards, device=device, dtype=torch.float32),
            torch.stack([state_to_tensor(s) for s in next_states]),
            torch.tensor(dones, device=device, dtype=torch.float32),
        )

    def __len__(self):
        return len(self.buffer)`}</CyberCodeBlock>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">2. Цикл обучения DQN</h3>
          <CyberCodeBlock language="python" filename="dqn_train.py">{`# ── Гиперпараметры DQN ──
LR             = 1e-3
GAMMA          = 0.99
EPSILON_START  = 1.0
EPSILON_MIN    = 0.01
EPSILON_DECAY  = 0.999
BATCH_SIZE     = 64
BUFFER_SIZE    = 10000
TARGET_UPDATE  = 10      # каждые N эпизодов копируем веса в target-сеть
N_EPISODES_DQN = 5000
MAX_STEPS      = 100

# ── Инициализация ──
policy_net = DQN(N_STATES, N_ACTIONS).to(device)
target_net = DQN(N_STATES, N_ACTIONS).to(device)
target_net.load_state_dict(policy_net.state_dict())
target_net.eval()

optimizer = optim.Adam(policy_net.parameters(), lr=LR)
loss_fn   = nn.MSELoss()
buffer    = ReplayBuffer(BUFFER_SIZE)

eps = EPSILON_START
dqn_rewards_per_100 = []
dqn_rolling = 0

# ── Цикл обучения ──
for episode in range(1, N_EPISODES_DQN + 1):
    state, _ = env_dqn.reset()
    episode_reward = 0

    for step in range(MAX_STEPS):
        # epsilon-greedy
        if random.random() < eps:
            action = env_dqn.action_space.sample()
        else:
            with torch.no_grad():
                q_vals = policy_net(state_to_tensor(state).unsqueeze(0))
                action = q_vals.argmax(dim=1).item()

        next_state, reward, terminated, truncated, _ = env_dqn.step(action)
        done = terminated or truncated
        buffer.push(state, action, reward, next_state, done)

        state = next_state
        episode_reward += reward

        # Обучение по мини-батчу
        if len(buffer) >= BATCH_SIZE:
            s, a, r, ns, d = buffer.sample(BATCH_SIZE)

            # Q(s, a) из policy-сети
            q_values = policy_net(s).gather(1, a.unsqueeze(1)).squeeze(1)

            # target: r + γ · max_a' Q_target(s', a')
            with torch.no_grad():
                next_q = target_net(ns).max(dim=1)[0]
                target = r + GAMMA * next_q * (1 - d)

            loss = loss_fn(q_values, target)
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

        if done:
            break

    eps = max(EPSILON_MIN, eps * EPSILON_DECAY)
    dqn_rolling += episode_reward

    # Обновление target-сети
    if episode % TARGET_UPDATE == 0:
        target_net.load_state_dict(policy_net.state_dict())

    # Логирование
    if episode % 100 == 0:
        avg = dqn_rolling / 100
        dqn_rewards_per_100.append(avg)
        print(f"[DQN] Эпизоды {episode-99}-{episode}, "
              f"средняя награда: {avg:.2f}, eps: {eps:.3f}")
        dqn_rolling = 0

print("DQN обучение завершено.")`}</CyberCodeBlock>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">3. Визуализация и оценка DQN</h3>
          <CyberCodeBlock language="python" filename="dqn_eval.py">{`# График обучения DQN
plt.figure(figsize=(10, 5))
plt.plot(range(100, N_EPISODES_DQN + 1, 100),
         dqn_rewards_per_100, "r-", linewidth=2, label="DQN")
plt.xlabel("Эпизод")
plt.ylabel("Средняя награда (за 100 эп.)")
plt.title("Кривая обучения DQN (Taxi-v3)")
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

# Оценка DQN (анимация)
for episode in range(1, 4):
    state, _ = env_dqn.reset()
    total_reward = 0

    for step in range(MAX_STEPS):
        with torch.no_grad():
            q_vals = policy_net(state_to_tensor(state).unsqueeze(0))
            action = q_vals.argmax(dim=1).item()

        next_state, reward, terminated, truncated, _ = env_dqn.step(action)
        done = terminated or truncated
        total_reward += reward
        state = next_state

        clear_output(wait=True)
        print(f"[DQN] Эпизод {episode}/3, шаг {step + 1}")
        print(env_dqn.render())
        time.sleep(0.2)

        if done:
            break

    print(f"Награда за эпизод {episode}: {total_reward}")
    time.sleep(1)

env_dqn.close()
print("Оценка DQN завершена.")`}</CyberCodeBlock>
        </Section>

        {/* Section: Key Concepts */}
        <Section icon={<Lightbulb className="w-5 h-5 text-primary" />} title="Ключевые концепции">
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Q-таблица vs Нейросеть</h3>
          <div className="my-4 overflow-x-auto">
            <table className="w-full text-sm border border-border/30 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-card/60">
                  <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Критерий</th>
                  <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Q-Learning</th>
                  <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">DQN</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/20">
                  <td className="p-3">Представление Q</td>
                  <td className="p-3">Таблица 500×6</td>
                  <td className="p-3">Нейросеть (500→128→64→6)</td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="p-3">Масштабируемость</td>
                  <td className="p-3">Только дискретные, малые пространства</td>
                  <td className="p-3">Непрерывные / большие пространства</td>
                </tr>
                <tr className="border-b border-border/20">
                  <td className="p-3">Стабильность</td>
                  <td className="p-3">Гарантированная сходимость</td>
                  <td className="p-3">Требуются Replay Buffer + Target Net</td>
                </tr>
                <tr>
                  <td className="p-3">Скорость обучения</td>
                  <td className="p-3">Быстро на Taxi-v3</td>
                  <td className="p-3">Медленнее, но обобщает лучше</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Упражнения для самопроверки</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Сравните кривые обучения Q-Learning и DQN — какой метод быстрее достигает оптимальной награды ~7.5?</li>
            <li>Измените <Math display={false}>{`\\enfPar{\\varepsilon}_{\\text{decay}}`}</Math> на 0.995 и 0.9999 — как это влияет на баланс exploration/exploitation?</li>
            <li>Добавьте третий скрытый слой в DQN (128 → 64 → 32) — ускорит ли это сходимость?</li>
            <li>Увеличьте TARGET_UPDATE до 50 — стабилизирует ли это обучение DQN?</li>
            <li>Замените MSE на Huber Loss (<code className="text-foreground">nn.SmoothL1Loss</code>) в DQN — что изменится?</li>
          </ol>
        </Section>

        {/* ═══════════════════════════════════════════════════ */}
        {/*  ALGORITHM COMPARISON                               */}
        {/* ═══════════════════════════════════════════════════ */}

        <Section icon={<Brain className="w-5 h-5 text-secondary" />} title="Сравнение алгоритмов RL">
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-3 text-foreground">Характеристика</th>
                      <th className="text-center p-3 text-primary">DQN</th>
                      <th className="text-center p-3 text-secondary">PPO</th>
                      <th className="text-center p-3 text-accent">SAC</th>
                      <th className="text-center p-3 text-primary">A3C</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/30">
                      <td className="p-3 font-medium text-foreground">Тип действий</td>
                      <td className="p-3 text-center">Дискретные</td>
                      <td className="p-3 text-center">Оба</td>
                      <td className="p-3 text-center">Непрерывные</td>
                      <td className="p-3 text-center">Оба</td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="p-3 font-medium text-foreground">Policy</td>
                      <td className="p-3 text-center">Off-policy</td>
                      <td className="p-3 text-center">On-policy</td>
                      <td className="p-3 text-center">Off-policy</td>
                      <td className="p-3 text-center">On-policy</td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="p-3 font-medium text-foreground">Sample Efficiency</td>
                      <td className="p-3 text-center">Средняя</td>
                      <td className="p-3 text-center">Низкая</td>
                      <td className="p-3 text-center">Высокая</td>
                      <td className="p-3 text-center">Низкая</td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="p-3 font-medium text-foreground">Стабильность</td>
                      <td className="p-3 text-center">Средняя</td>
                      <td className="p-3 text-center">Высокая</td>
                      <td className="p-3 text-center">Высокая</td>
                      <td className="p-3 text-center">Средняя</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-foreground">ML-Agents</td>
                      <td className="p-3 text-center">❌</td>
                      <td className="p-3 text-center">✅ Основной</td>
                      <td className="p-3 text-center">✅</td>
                      <td className="p-3 text-center">❌</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* ═══════════════════════════════════════════════════ */}
        {/*  ALGORITHM DECISION TREE                            */}
        {/* ═══════════════════════════════════════════════════ */}

        <Section icon={<GitBranch className="w-5 h-5 text-accent" />} title="Какой алгоритм выбрать?">
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="space-y-2">
                {[
                  {
                    trigger: "Дискретные действия (прыжок, выстрел, поворот)",
                    content: "Для дискретных пространств действий лучше всего подходят DQN (для простых сред) или PPO (для более сложных). DQN эффективнее по данным благодаря replay buffer, но PPO стабильнее при масштабировании.",
                    algo: "DQN или PPO",
                    links: [{ label: "DQN", path: "/algorithms/dqn" }, { label: "PPO", path: "/algorithms/ppo" }],
                  },
                  {
                    trigger: "Непрерывные действия (скорость, угол руля)",
                    content: "Для непрерывных действий выбирайте PPO (стабильнее, проще в настройке) или SAC (эффективнее по данным, лучше исследует). SAC — off-policy, что позволяет переиспользовать данные.",
                    algo: "PPO или SAC",
                    links: [{ label: "PPO", path: "/algorithms/ppo" }, { label: "SAC", path: "/algorithms/sac" }],
                  },
                  {
                    trigger: "Мультиагентная кооперация",
                    content: "MA-POCA (Multi-Agent POsthumous Credit Assignment) — специализированный алгоритм Unity ML-Agents для кооперативных задач. Поддерживает групповые награды и динамическое число агентов.",
                    algo: "MA-POCA",
                    links: [{ label: "Подробнее о MA-POCA", path: "/courses/3-2" }],
                  },
                  {
                    trigger: "Имитация поведения эксперта",
                    content: "GAIL (Generative Adversarial Imitation Learning) в связке с PPO позволяет агенту обучаться на демонстрациях эксперта без явной функции награды. Отлично подходит для сложного поведения NPC.",
                    algo: "GAIL + PPO",
                    links: [{ label: "Имитационное обучение", path: "/courses/3-4" }],
                  },
                  {
                    trigger: "Максимальная sample-efficiency",
                    content: "SAC — off-policy алгоритм с автоматической настройкой энтропии. Переиспользует данные из replay buffer, что делает его самым эффективным по числу взаимодействий со средой.",
                    algo: "SAC (off-policy)",
                    links: [{ label: "SAC", path: "/algorithms/sac" }],
                  },
                  {
                    trigger: "Максимальная стабильность",
                    content: "PPO с clipped surrogate objective обеспечивает монотонное улучшение политики. Это стандарт в Unity ML-Agents и наиболее надёжный выбор для большинства задач.",
                    algo: "PPO (on-policy)",
                    links: [{ label: "PPO", path: "/algorithms/ppo" }],
                  },
                ].map((item, i) => (
                  <AccordionItem key={i} value={`decision-${i}`} className="border border-border/30 rounded-lg px-4">
                    <AccordionTrigger className="text-sm font-medium text-foreground hover:text-primary">
                      {item.trigger}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pb-4">
                      <p className="text-sm text-muted-foreground">{item.content}</p>
                      <div className="flex items-center gap-2 text-xs text-primary font-semibold">
                        Рекомендация: {item.algo}
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {item.links.map((link) => (
                          <Button key={link.path} variant="outline" size="sm" onClick={() => navigate(link.path)} className="text-xs">
                            {link.label} <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </Section>

      {/* Практика: собранная среда лаборатории для этой темы. */}
      <LabPracticeSection contextKey="/pytorch" />

      </article>
    </div>
  );
};

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <section className="mt-12 first:mt-0">
    <div className="flex items-center gap-3 mb-6">
      {icon}
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    </div>
    <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </section>
);

const InfoBox = ({ color, title, children }: { color: "primary" | "secondary" | "accent"; title: string; children: React.ReactNode }) => {
  const borderColor = color === "primary" ? "border-primary/30" : color === "secondary" ? "border-secondary/30" : "border-accent/30";
  const titleColor = color === "primary" ? "text-primary" : color === "secondary" ? "text-secondary" : "text-accent";
  return (
    <div className={`my-4 p-4 rounded-lg bg-card/60 border ${borderColor}`}>
      <p className={`font-semibold ${titleColor} text-sm mb-2`}>{title}</p>
      {children}
    </div>
  );
};

export default PyTorchModule;
