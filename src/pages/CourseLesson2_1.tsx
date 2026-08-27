import LessonLayout from "@/components/LessonLayout";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import ProGate from "@/components/ProGate";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import Math from "@/components/Math";
import Quiz from "@/components/Quiz";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const quizQuestions = [
  {
    question: "Почему value-based методы (DQN) плохо работают с непрерывными действиями?",
    options: [
      "Они слишком медленные",
      "Невозможно перебрать бесконечное множество действий для выбора argmax Q(s,a)",
      "Они не используют нейронные сети",
      "Value-based методы работают только с изображениями",
    ],
    correctIndex: 1,
  },
  {
    question: "Что вычисляет REINFORCE алгоритм?",
    options: [
      "Точное значение Q-функции",
      "Оценку градиента ожидаемой награды по параметрам политики",
      "Оптимальную reward function",
      "Матрицу переходов MDP",
    ],
    correctIndex: 1,
  },
  {
    question: "Зачем используется baseline V(s) в Policy Gradient?",
    options: [
      "Для увеличения reward",
      "Для снижения дисперсии оценки градиента без изменения bias",
      "Для ускорения сходимости target network",
      "Baseline не используется в Policy Gradient",
    ],
    correctIndex: 1,
  },
  {
    question: "Какой тип выхода у policy network в REINFORCE?",
    options: [
      "Q-значения для каждого действия",
      "Вероятности действий (через softmax)",
      "Детерминированное действие",
      "Параметры reward function",
    ],
    correctIndex: 1,
  },
];

const CourseLesson2_1 = () => {
  const preview = (
    <>
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Проблема value-based методов</h2>
        <p className="text-muted-foreground leading-relaxed">
          В предыдущем уровне мы реализовали DQN — мощный алгоритм, который учится оценивать
          Q(s, a) для каждого дискретного действия. Но что, если действия <strong className="text-foreground">непрерывные</strong>?
          Например, угол поворота руля (от -1 до +1) или сила нажатия на газ (от 0 до 1)?
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          В DQN мы выбираем действие как argmax Q(s, a) — перебирая все возможные действия.
          Но в непрерывном пространстве действий их бесконечно много! Нужен другой подход —
          <strong className="text-primary"> напрямую оптимизировать политику</strong>.
        </p>
      </section>
    </>
  );

  return (
    <LessonLayout
      lessonId="2-1"
      lessonTitle="Policy Gradient и теорема градиента политики"
      lessonNumber="2.1"
      duration="35 мин"
      tags={["#theory", "#pytorch", "#policy-gradient"]}
      level={2}
      prevLesson={{ path: "/courses/project-1", title: 'Проект-1: "Баланс в 3D"' }}
      nextLesson={{ path: "/courses/2-2", title: "PPO с нуля" }}
    >
      <ProGate preview={preview}>
        {/* Full content */}
        {preview}

        {/* DQN vs PG table */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">DQN vs Policy Gradient</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3 text-muted-foreground">Критерий</th>
                  <th className="text-left py-2 px-3 text-primary">DQN</th>
                  <th className="text-left py-2 px-3 text-secondary">Policy Gradient</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { c: "Тип действий", dqn: "Только дискретные", pg: "Дискретные и непрерывные" },
                  { c: "Что учит", dqn: "Q-функцию", pg: "Политику напрямую" },
                  { c: "Стабильность", dqn: "Стабильнее (off-policy)", pg: "Менее стабильно (on-policy)" },
                  { c: "Эффективность данных", dqn: "Высокая (replay buffer)", pg: "Низкая (нужны свежие данные)" },
                  { c: "Стохастичность", dqn: "ε-greedy", pg: "Встроенная (из распределения)" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/20">
                    <td className="py-2 px-3 text-foreground">{row.c}</td>
                    <td className="py-2 px-3 text-muted-foreground">{row.dqn}</td>
                    <td className="py-2 px-3 text-muted-foreground">{row.pg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* REINFORCE derivation */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4"><CrossLinkToHub hubPath="/math-rl/module-4" hubAnchor="шаг-4-формула-reinforce" hubTitle="Математика RL — Формула REINFORCE">REINFORCE</CrossLinkToHub>: вывод градиента</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Цель — максимизировать ожидаемую суммарную награду J(θ):
          </p>

          <Math>{"\\enfTgt{J}(\\enfPar{\\theta}) = \\mathbb{E}_{\\tau \\sim \\pi_\\theta} \\left[ \\sum_{t=0}^{T} \\enfPar{\\gamma}^t \\enfTgt{r}_t \\right]"}</Math>

          <p className="text-muted-foreground leading-relaxed my-4">
            Применяя log-trick, получаем <strong className="text-foreground">теорему градиента политики</strong> — <CrossLinkToHub hubPath="/math-rl/module-4" hubAnchor="целевая-функция-политики" hubTitle="Математика RL — Целевая функция политики">∇<sub>θ</sub>J(θ)</CrossLinkToHub>:
          </p>

          <Math>{"\\enfOp{\\nabla}_\\theta \\enfTgt{J}(\\enfPar{\\theta}) = \\mathbb{E}_{\\tau \\sim \\pi_\\theta} \\left[ \\sum_{t=0}^{T} \\enfOp{\\nabla}_\\theta \\log \\pi_\\theta(a_t \\mid \\enfVar{s}_t) \\cdot \\enfOp{G}_t \\right]"}</Math>

          <p className="text-muted-foreground leading-relaxed mt-4">
            где <Math display={false}>{"\\enfOp{G}_t = \\sum_{k=t}^{T} \\enfPar{\\gamma}^{k-t} \\enfTgt{r}_k"}</Math> — return (суммарная дисконтированная награда с шага t).
          </p>
        </section>

        {/* Variance problem */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Проблема дисперсии и <CrossLinkToHub hubPath="/math-rl/module-5" hubAnchor="глава-9" hubTitle="Математика RL — Глава 9. Policy Gradients и baseline">baseline</CrossLinkToHub></h2>

          <Card className="bg-card/40 border-primary/20 mb-4">
            <CardContent className="p-4 flex gap-3 items-start">
              <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                Оценка градиента через REINFORCE имеет <strong className="text-foreground">высокую дисперсию</strong>.
                Вычитание baseline b(s) не меняет математическое ожидание, но значительно снижает дисперсию.
                Лучший выбор: <Math display={false}>{"b(\\enfVar{s}) = \\enfOp{V}^\\pi(\\enfVar{s})"}</Math>.
              </div>
            </CardContent>
          </Card>

          <Math>{"\\enfOp{\\nabla}_\\theta \\enfTgt{J}(\\enfPar{\\theta}) = \\mathbb{E} \\left[ \\sum_t \\enfOp{\\nabla}_\\theta \\log \\pi_\\theta(a_t \\mid \\enfVar{s}_t) \\cdot \\underbrace{(\\enfOp{G}_t - \\enfOp{V}(\\enfVar{s}_t))}_{\\text{Advantage } A(s_t, a_t)} \\right]"}</Math>
        </section>

        {/* PyTorch implementation */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">REINFORCE на PyTorch (<CrossLinkToHub hubPath="/pytorch/cheatsheet" hubAnchor="autograd" hubTitle="PyTorch — Autograd">autograd</CrossLinkToHub>)</h2>

          <CyberCodeBlock language="python" filename="reinforce.py">
{`import torch
import torch.nn as nn
import torch.optim as optim
from torch.distributions import Categorical
import gymnasium as gym
import numpy as np

class PolicyNetwork(nn.Module):
    def __init__(self, obs_dim=4, n_actions=2, hidden=128):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(obs_dim, hidden),
            nn.ReLU(),
            nn.Linear(hidden, hidden),
            nn.ReLU(),
            nn.Linear(hidden, n_actions),
            nn.Softmax(dim=-1)
        )

    def forward(self, x):
        return self.net(x)

    def act(self, state):
        probs = self.forward(torch.FloatTensor(state))
        dist = Categorical(probs)
        action = dist.sample()
        return action.item(), dist.log_prob(action)

def reinforce(env_name="CartPole-v1", episodes=1000, gamma=0.99, lr=1e-3):
    env = gym.make(env_name)
    policy = PolicyNetwork()
    optimizer = optim.Adam(policy.parameters(), lr=lr)
    rewards_history = []

    for ep in range(episodes):
        log_probs = []
        rewards = []
        state, _ = env.reset()

        while True:
            action, log_prob = policy.act(state)
            state, reward, term, trunc, _ = env.step(action)
            log_probs.append(log_prob)
            rewards.append(reward)
            if term or trunc:
                break

        # Вычисляем returns G_t
        returns = []
        G = 0
        for r in reversed(rewards):
            G = r + gamma * G
            returns.insert(0, G)
        returns = torch.FloatTensor(returns)
        returns = (returns - returns.mean()) / (returns.std() + 1e-8)

        # Gradient ascent
        loss = -sum(lp * G for lp, G in zip(log_probs, returns))
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total = sum(rewards)
        rewards_history.append(total)
        if (ep + 1) % 100 == 0:
            print(f"Ep {ep+1} | Avg: {np.mean(rewards_history[-100:]):.1f}")

    return rewards_history

history = reinforce()`}
          </CyberCodeBlock>
        </section>

        {/* Quiz */}
        <Quiz title="Проверь себя: Policy Gradient" questions={quizQuestions} />
      </ProGate>
    </LessonLayout>
  );
};

export default CourseLesson2_1;
