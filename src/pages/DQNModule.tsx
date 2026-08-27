import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Brain, ArrowRight, BookOpen, Layers, Copy, Zap } from "lucide-react";
import Math from "@/components/Math";
import Quiz from "@/components/Quiz";
import HubLessonBadges from "@/components/HubLessonBadges";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import LabPracticeSection from "@/components/LabPracticeSection";

const codeBlock = (code: string) => (
  <pre className="bg-card/80 border border-primary/20 rounded-lg p-4 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed">
    <code>{code}</code>
  </pre>
);

const DQNModule = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/algorithms")} className="text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Алгоритмы
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-neon bg-clip-text text-transparent">
              Deep Q-Network (DQN)
            </h1>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            От табличного Q-Learning к глубоким нейросетям: Experience Replay, Target Network и продвинутые варианты.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Table of Contents */}
        <Card className="mb-10 border-primary/20 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Содержание
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li><a href="#dqn-basics" className="text-primary hover:underline">Основы DQN</a></li>
              <li><a href="#double-dqn" className="text-primary hover:underline">Double DQN</a></li>
              <li><a href="#dueling-dqn" className="text-primary hover:underline">Dueling DQN</a></li>
              <li><a href="#per" className="text-primary hover:underline">Prioritized Experience Replay</a></li>
            </ol>
          </CardContent>
        </Card>

        <div className="space-y-16">
          {/* Section 1: Основы DQN */}
          <section id="dqn-basics" className="scroll-mt-28 space-y-6">
            <div className="flex items-center gap-3">
              <Brain className="h-7 w-7 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">1. Основы DQN</h2>
            </div>
            <HubLessonBadges hubPath="/algorithms/dqn" />
            <Card className="border-primary/30">
              <CardContent className="p-6 space-y-6">
                <p className="text-muted-foreground">
                  DQN аппроксимирует Q-функцию нейросетью, заменяя табличное представление (введение в RL — <CrossLinkToLesson lessonId="1-1" lessonPath="/courses/1-1" lessonTitle="Что такое обучение с подкреплением?" lessonLevel={1} />, CartPole — <CrossLinkToLesson lessonId="1-4" lessonPath="/courses/1-4" lessonTitle="CartPole — твой первый RL-агент" lessonLevel={1} />, DQN с нуля — <CrossLinkToLesson lessonId="1-5" lessonPath="/courses/1-5" lessonTitle="DQN с нуля на PyTorch" lessonLevel={1} />). Два ключевых нововведения обеспечивают стабильность обучения.
                </p>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Q-Learning обновление</h3>
                  <Math>{"\\enfOp{Q}(\\enfVar{s}, a) \\leftarrow \\enfOp{Q}(\\enfVar{s}, a) + \\enfPar{\\alpha} \\left[ \\enfTgt{r} + \\enfPar{\\gamma} \\max_{a'} \\enfOp{Q}(\\enfVar{s}', a') - \\enfOp{Q}(\\enfVar{s}, a) \\right]"}</Math>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Функция потерь DQN</h3>
                  <Math>{"L(\\enfPar{\\theta}) = \\mathbb{E}\\left[ \\left( \\enfTgt{r} + \\enfPar{\\gamma} \\max_{a'} \\enfOp{Q}(\\enfVar{s}', a'; \\enfPar{\\theta}^-) - \\enfOp{Q}(\\enfVar{s}, a; \\enfPar{\\theta}) \\right)^2 \\right]"}</Math>
                  <p className="text-sm text-muted-foreground mt-2">
                    θ⁻ — параметры target network, которая обновляется периодически для стабильности.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Experience Replay</h3>
                  <p className="text-muted-foreground text-sm">
                    Хранение переходов (s, a, r, s', done) в буфере и случайная выборка мини-батчей разрушает корреляцию между последовательными данными.
                  </p>
                </div>

                <h3 className="text-lg font-semibold mb-2">Реализация</h3>
                {codeBlock(`import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from collections import deque
import random

class DQN(nn.Module):
    def __init__(self, state_dim, action_dim, hidden_dim=128):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, action_dim)
        )
    
    def forward(self, x):
        return self.network(x)

class DQNAgent:
    def __init__(self, state_dim, action_dim, lr=1e-3, gamma=0.99,
                 epsilon=1.0, epsilon_decay=0.995, epsilon_min=0.01):
        self.action_dim = action_dim
        self.gamma = gamma
        self.epsilon = epsilon
        self.epsilon_decay = epsilon_decay
        self.epsilon_min = epsilon_min
        
        self.q_network = DQN(state_dim, action_dim)
        self.target_network = DQN(state_dim, action_dim)
        self.target_network.load_state_dict(self.q_network.state_dict())
        
        self.optimizer = optim.Adam(self.q_network.parameters(), lr=lr)
        self.buffer = deque(maxlen=100000)
    
    def select_action(self, state):
        if random.random() < self.epsilon:
            return random.randint(0, self.action_dim - 1)
        with torch.no_grad():
            q_values = self.q_network(torch.FloatTensor(state))
            return q_values.argmax().item()
    
    def train(self, batch_size=64):
        if len(self.buffer) < batch_size:
            return
        
        batch = random.sample(self.buffer, batch_size)
        states, actions, rewards, next_states, dones = zip(*batch)
        
        states = torch.FloatTensor(np.array(states))
        actions = torch.LongTensor(actions)
        rewards = torch.FloatTensor(rewards)
        next_states = torch.FloatTensor(np.array(next_states))
        dones = torch.FloatTensor(dones)
        
        current_q = self.q_network(states).gather(1, actions.unsqueeze(1))
        
        with torch.no_grad():
            next_q = self.target_network(next_states).max(1)[0]
            target_q = rewards + self.gamma * next_q * (1 - dones)
        
        loss = nn.MSELoss()(current_q.squeeze(), target_q)
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()
        
        self.epsilon = max(self.epsilon_min, self.epsilon * self.epsilon_decay)`)}
              </CardContent>
            </Card>
          </section>

          {/* Section 2: Double DQN */}
          <section id="double-dqn" className="scroll-mt-28 space-y-6">
            <div className="flex items-center gap-3">
              <Copy className="h-7 w-7 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">2. Double DQN</h2>
            </div>
            <Card className="border-primary/30">
              <CardContent className="p-6 space-y-6">
                <p className="text-muted-foreground">
                  Решает проблему overestimation bias, разделяя выбор действия и его оценку между двумя сетями.
                </p>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Проблема DQN</h3>
                  <p className="text-sm text-muted-foreground">
                    Оператор max в Q-Learning систематически завышает Q-значения, так как одна и та же сеть используется для выбора и оценки действия.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Решение Double DQN</h3>
                  <Math>{"Y^{\\text{DDQN}} = \\enfTgt{r} + \\enfPar{\\gamma} \\enfOp{Q}\\left(\\enfVar{s}', \\arg\\max_{a'} \\enfOp{Q}(\\enfVar{s}', a'; \\enfPar{\\theta}); \\enfPar{\\theta}^-\\right)"}</Math>
                  <p className="text-sm text-muted-foreground mt-2">
                    Online-сеть (θ) выбирает лучшее действие, а target-сеть (θ⁻) оценивает его Q-значение.
                  </p>
                </div>

                {codeBlock(`# Double DQN: изменение в вычислении target
with torch.no_grad():
    # Online сеть выбирает действие
    best_actions = self.q_network(next_states).argmax(1)
    # Target сеть оценивает Q-значение
    next_q = self.target_network(next_states).gather(
        1, best_actions.unsqueeze(1)
    ).squeeze()
    target_q = rewards + self.gamma * next_q * (1 - dones)`)}
              </CardContent>
            </Card>
          </section>

          {/* Section 3: Dueling DQN */}
          <section id="dueling-dqn" className="scroll-mt-28 space-y-6">
            <div className="flex items-center gap-3">
              <Layers className="h-7 w-7 text-accent" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">3. Dueling DQN</h2>
            </div>
            <Card className="border-primary/30">
              <CardContent className="p-6 space-y-6">
                <p className="text-muted-foreground">
                  Разделяет Q-функцию на Value и Advantage потоки для более эффективного обучения.
                </p>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Декомпозиция</h3>
                  <Math>{"\\enfOp{Q}(\\enfVar{s}, a; \\enfPar{\\theta}, \\enfPar{\\alpha}, \\beta) = \\enfOp{V}(\\enfVar{s}; \\enfPar{\\theta}, \\beta) + \\left( A(\\enfVar{s}, a; \\enfPar{\\theta}, \\enfPar{\\alpha}) - \\frac{1}{|\\mathcal{A}|} \\sum_{a'} A(\\enfVar{s}, a'; \\enfPar{\\theta}, \\enfPar{\\alpha}) \\right)"}</Math>
                </div>

                {codeBlock(`class DuelingDQN(nn.Module):
    def __init__(self, state_dim, action_dim, hidden_dim=128):
        super().__init__()
        # Общий backbone
        self.feature = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.ReLU()
        )
        # Value stream
        self.value = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1)
        )
        # Advantage stream  
        self.advantage = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, action_dim)
        )
    
    def forward(self, x):
        feature = self.feature(x)
        value = self.value(feature)
        advantage = self.advantage(feature)
        # Combining: Q = V + (A - mean(A))
        q = value + advantage - advantage.mean(dim=-1, keepdim=True)
        return q`)}
              </CardContent>
            </Card>
          </section>

          {/* Section 4: Prioritized Experience Replay */}
          <section id="per" className="scroll-mt-28 space-y-6">
            <div className="flex items-center gap-3">
              <Zap className="h-7 w-7 text-secondary" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">4. Prioritized Experience Replay</h2>
            </div>
            <Card className="border-primary/30">
              <CardContent className="p-6 space-y-6">
                <p className="text-muted-foreground">
                  Более информативные переходы (с большим TD-error) сэмплируются чаще.
                </p>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Приоритет</h3>
                  <Math>{"p_i = |\\delta_i| + \\enfPar{\\varepsilon}"}</Math>
                  <Math>{"P(i) = \\frac{p_i^\\alpha}{\\sum_k p_k^\\alpha}"}</Math>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Importance Sampling</h3>
                  <Math>{"w_i = \\left( \\frac{1}{N} \\cdot \\frac{1}{P(i)} \\right)^\\beta"}</Math>
                  <p className="text-sm text-muted-foreground mt-1">
                    Веса importance sampling корректируют bias от неравномерной выборки. β увеличивается от 0.4 до 1.0 в процессе обучения.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <Quiz
          title="Проверьте понимание DQN"
          questions={[
            {
              question: "Зачем в DQN используется Experience Replay?",
              options: [
                "Для ускорения forward pass",
                "Для разрушения корреляции между последовательными данными",
                "Для увеличения размера сети",
                "Для уменьшения learning rate",
              ],
              correctIndex: 1,
            },
            {
              question: "Какую проблему решает Double DQN?",
              options: [
                "Медленную сходимость",
                "Overestimation bias Q-значений",
                "Недостаток памяти",
                "Нестабильность градиентов",
              ],
              correctIndex: 1,
            },
          ]}
        />

        {/* Практика: собранная среда лаборатории для этой темы. */}
        <LabPracticeSection contextKey="/algorithms/dqn" />

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => navigate("/algorithms")} className="border-primary/50 text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" /> Все алгоритмы
          </Button>
          <Button onClick={() => navigate("/algorithms/ppo")} className="bg-gradient-neon">
            PPO <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DQNModule;
