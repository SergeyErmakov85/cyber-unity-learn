import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, FlaskConical, ArrowUp, ArrowDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import LabPracticeSection from "@/components/LabPracticeSection";
// Lab 1: Discounting interactive
const DiscountLab = () => {
  const [gamma, setGamma] = useState(0.99);
  const rewards = [1, 1, 1, 1, 1, 10];

  const computeReturn = (rewards: number[], g: number) => {
    let G = 0;
    const returns: number[] = [];
    for (let i = rewards.length - 1; i >= 0; i--) {
      G = rewards[i] + g * G;
      returns.unshift(G);
    }
    return returns;
  };

  const returns = computeReturn(rewards, gamma);
  const gammaValues = [0.5, 0.9, 0.99, 0.999];
  const allReturns = gammaValues.map(g => ({ gamma: g, G0: computeReturn(rewards, g)[0] }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary mb-2">Цель</h3>
        <p className="text-muted-foreground">
          Понять влияние γ (gamma) на обучение агента. Исследуйте как коэффициент дисконтирования меняет «горизонт планирования».
        </p>
      </div>

      <CyberCodeBlock language="python" filename="discount.py">{`def compute_discounted_return(rewards, gamma=0.99):
    """Вычисляет дисконтированный возврат."""
    G = 0
    returns = []
    for r in reversed(rewards):
        G = r + gamma * G
        returns.insert(0, G)
    return returns

rewards = [1, 1, 1, 1, 1, 10]
for gamma in [0.5, 0.9, 0.99, 0.999]:
    returns = compute_discounted_return(rewards, gamma)
    print(f"γ={gamma}: G_0={returns[0]:.2f}")`}</CyberCodeBlock>

      <Card className="border-primary/30">
        <CardHeader><CardTitle className="text-sm">Интерактивный эксперимент</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>γ (gamma)</span><span className="text-primary font-mono">{gamma.toFixed(3)}</span>
            </div>
            <Slider value={[gamma]} onValueChange={([v]) => setGamma(v)} min={0} max={1} step={0.001} />
          </div>

          <div className="text-sm">
            <p className="text-muted-foreground mb-1">Награды: [{rewards.join(", ")}]</p>
            <p className="font-mono">G₀ = <span className="text-primary font-bold">{returns[0].toFixed(2)}</span></p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {allReturns.map(r => (
              <div key={r.gamma} className={`p-3 rounded-lg border text-center ${r.gamma === gamma ? "border-primary bg-primary/10" : "border-border/50 bg-card/50"}`}>
                <div className="text-xs text-muted-foreground">γ = {r.gamma}</div>
                <div className="font-mono font-bold">{r.G0.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-accent/30">
        <CardHeader><CardTitle className="text-sm">🧠 Вопросы для размышления</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Как γ влияет на «горизонт планирования» агента?</p>
          <p>2. Почему γ=1 может быть проблематичным?</p>
          <p>3. Какой γ выбрали бы для задачи с долгосрочным планированием?</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Lab 2: Exploration vs Exploitation
const ExplorationLab = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-primary mb-2">Цель</h3>
      <p className="text-muted-foreground">
        Изучить баланс между exploration и exploitation. Сравнить стратегии ε-greedy, decaying ε и UCB.
      </p>
    </div>

    <CyberCodeBlock language="python" filename="exploration.py">{`import numpy as np

def epsilon_greedy(q_values, epsilon=0.1):
    """ε-жадная политика"""
    if np.random.random() < epsilon:
        return np.random.randint(len(q_values))
    return np.argmax(q_values)

def softmax_exploration(q_values, temperature=1.0):
    """Softmax (Boltzmann) exploration"""
    exp_q = np.exp(q_values / temperature)
    probs = exp_q / exp_q.sum()
    return np.random.choice(len(q_values), p=probs)

def ucb_action(q_values, counts, t, c=2.0):
    """Upper Confidence Bound"""
    ucb = q_values + c * np.sqrt(np.log(t + 1) / (counts + 1e-5))
    return np.argmax(ucb)`}</CyberCodeBlock>

    <div>
      <h3 className="text-lg font-semibold text-primary mb-2">Задания</h3>
      <ul className="space-y-1 text-muted-foreground list-disc list-inside text-sm">
        <li>Реализуйте ε-жадную политику</li>
        <li>Реализуйте softmax (Boltzmann) exploration</li>
        <li>Сравните стратегии: ε-greedy, decaying ε, UCB</li>
        <li>Визуализируйте результаты на задаче Multi-Armed Bandit</li>
      </ul>
    </div>
  </div>
);

// Lab 3: Experience Replay
const ReplayLab = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold text-primary mb-2">Цель</h3>
      <p className="text-muted-foreground">
        Понять важность и реализацию буфера опыта для стабильного обучения.
      </p>
    </div>

    <CyberCodeBlock language="python" filename="replay_buffer.py">{`import random
from collections import deque

class ReplayBuffer:
    def __init__(self, capacity=10000):
        self.buffer = deque(maxlen=capacity)
    
    def push(self, state, action, reward, next_state, done):
        self.buffer.append((state, action, reward, next_state, done))
    
    def sample(self, batch_size=32):
        batch = random.sample(self.buffer, batch_size)
        states, actions, rewards, next_states, dones = zip(*batch)
        return (
            np.array(states), np.array(actions),
            np.array(rewards), np.array(next_states),
            np.array(dones)
        )
    
    def __len__(self):
        return len(self.buffer)

# Prioritized Experience Replay
class PrioritizedReplayBuffer:
    def __init__(self, capacity=10000, alpha=0.6):
        self.buffer = deque(maxlen=capacity)
        self.priorities = deque(maxlen=capacity)
        self.alpha = alpha
    
    def push(self, state, action, reward, next_state, done, td_error=1.0):
        self.buffer.append((state, action, reward, next_state, done))
        self.priorities.append(abs(td_error) + 1e-6)
    
    def sample(self, batch_size=32, beta=0.4):
        priorities = np.array(self.priorities) ** self.alpha
        probs = priorities / priorities.sum()
        indices = np.random.choice(len(self.buffer), batch_size, p=probs)
        # Importance sampling weights
        weights = (len(self.buffer) * probs[indices]) ** (-beta)
        weights /= weights.max()
        batch = [self.buffer[i] for i in indices]
        return batch, indices, weights`}</CyberCodeBlock>

    <div>
      <h3 className="text-lg font-semibold text-primary mb-2">Задания</h3>
      <ul className="space-y-1 text-muted-foreground list-disc list-inside text-sm">
        <li>Реализуйте класс ReplayBuffer</li>
        <li>Сравните обучение с/без replay buffer</li>
        <li>Исследуйте влияние размера буфера</li>
        <li>Реализуйте Prioritized Experience Replay</li>
      </ul>
    </div>
  </div>
);

// Lab 4: Epsilon-Greedy
const EpsilonLab = () => {
  const [epsilon, setEpsilon] = useState(1.0);
  const [decayRate, setDecayRate] = useState(0.95);

  const steps = useMemo(() => {
    const rows = [];
    let eps = epsilon;
    for (let i = 0; i < 20; i++) {
      const isRandom = Math.random() < eps;
      rows.push({ step: i + 1, epsilon: eps, action: isRandom ? "Случайное" : "Жадное" });
      eps = Math.max(0.01, eps * decayRate);
    }
    return rows;
  }, [epsilon, decayRate]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary mb-2">Цель</h3>
        <p className="text-muted-foreground">Изучить ε-greedy стратегию и влияние decay на баланс exploration/exploitation.</p>
      </div>

      <CyberCodeBlock language="python" filename="epsilon_greedy.py">{`def epsilon_greedy(Q, state, epsilon):
    if np.random.random() < epsilon:
        return env.action_space.sample()  # exploration
    return np.argmax(Q[state])            # exploitation

# Экспоненциальный decay
epsilon = max(epsilon_min, epsilon * decay_rate)`}</CyberCodeBlock>

      <Card className="border-primary/30">
        <CardHeader><CardTitle className="text-sm">Интерактивный эксперимент</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>ε (epsilon)</span><span className="text-primary font-mono">{epsilon.toFixed(2)}</span>
            </div>
            <Slider value={[epsilon]} onValueChange={([v]) => setEpsilon(v)} min={0} max={1} step={0.01} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>decay_rate</span><span className="text-primary font-mono">{decayRate.toFixed(3)}</span>
            </div>
            <Slider value={[decayRate]} onValueChange={([v]) => setDecayRate(v)} min={0.9} max={0.999} step={0.001} />
          </div>

          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-primary/20">
                  <th className="text-left p-2 text-muted-foreground">Шаг</th>
                  <th className="text-left p-2 text-muted-foreground">ε</th>
                  <th className="text-left p-2 text-muted-foreground">Действие</th>
                </tr>
              </thead>
              <tbody>
                {steps.map(s => (
                  <tr key={s.step} className="border-b border-border/30">
                    <td className="p-2 font-mono">{s.step}</td>
                    <td className="p-2 font-mono text-primary">{s.epsilon.toFixed(4)}</td>
                    <td className={`p-2 font-mono ${s.action === "Случайное" ? "text-accent" : "text-secondary"}`}>{s.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-accent/30">
        <CardHeader><CardTitle className="text-sm">🧠 Задание</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>При epsilon=1.0 агент всегда действует случайно. При epsilon=0.0 — всегда жадно. Найди баланс для среды Taxi-v3.</p>
        </CardContent>
      </Card>
    </div>
  );
};

const Q_VALUES = [3.2, 1.5, -0.8, 2.1];
const ACTION_NAMES = ["↑ Вверх", "→ Вправо", "↓ Вниз", "← Влево"];

const AdvantageLab = () => {
  const [baseline, setBaseline] = useState(0);

  const chartData = useMemo(() =>
    Q_VALUES.map((q, i) => ({
      action: ACTION_NAMES[i],
      advantage: +(q - baseline).toFixed(2),
    })), [baseline]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary mb-2">Цель</h3>
        <p className="text-muted-foreground">Понять, как baseline V(s) снижает дисперсию градиента и стабилизирует обучение.</p>
      </div>

      <CyberCodeBlock language="python" filename="advantage.py">{`def compute_advantage(rewards, values, gamma=0.99):
    """GAE-lambda advantage estimation."""
    returns = compute_returns(rewards, gamma)
    advantages = returns - values
    # Нормализация для стабильности
    advantages = (advantages - advantages.mean()) / (advantages.std() + 1e-8)
    return advantages`}</CyberCodeBlock>

      <Card className="border-primary/30">
        <CardHeader><CardTitle className="text-sm">A(s,a) = Q(s,a) − V(s)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>V(s) baseline</span><span className="text-primary font-mono">{baseline.toFixed(1)}</span>
            </div>
            <Slider value={[baseline]} onValueChange={([v]) => setBaseline(v)} min={-5} max={5} step={0.1} />
          </div>

          <div className="text-xs text-muted-foreground mb-2">
            Q-значения: [{Q_VALUES.join(", ")}]
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="action" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--primary) / 0.3)" }} />
                <Bar dataKey="advantage" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.advantage >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-accent/30">
        <CardHeader><CardTitle className="text-sm">🧠 Вопросы</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Что происходит с advantage, когда V(s) равно среднему Q?</p>
          <p>2. Почему нормализация advantage важна для стабильности?</p>
        </CardContent>
      </Card>
    </div>
  );
};

// Lab 6: Policy Gradient Step
const PolicyGradientLab = () => {
  const [advantage, setAdvantage] = useState(2.0);
  const logProb = -1.2;
  const gradientUpdate = logProb * advantage;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary mb-2">Цель</h3>
        <p className="text-muted-foreground">Визуализировать, как log_prob × advantage определяет направление обновления параметров θ.</p>
      </div>

      <CyberCodeBlock language="python" filename="reinforce_step.py">{`# Шаг REINFORCE
log_probs = []
for action, prob in zip(actions, probs):
    log_probs.append(torch.log(prob[action]))

loss = -torch.stack(log_probs) * advantages
loss = loss.mean()  # + entropy_bonus

optimizer.zero_grad()
loss.backward()
torch.nn.utils.clip_grad_norm_(policy.parameters(), 0.5)
optimizer.step()`}</CyberCodeBlock>

      <Card className="border-primary/30">
        <CardHeader><CardTitle className="text-sm">Направление обновления θ</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Advantage A(s,a)</span><span className="text-primary font-mono">{advantage.toFixed(1)}</span>
            </div>
            <Slider value={[advantage]} onValueChange={([v]) => setAdvantage(v)} min={-5} max={5} step={0.1} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg border border-border/50 bg-card/50">
              <div className="text-xs text-muted-foreground">log π(a|s)</div>
              <div className="font-mono font-bold text-primary">{logProb.toFixed(2)}</div>
            </div>
            <div className="p-3 rounded-lg border border-border/50 bg-card/50">
              <div className="text-xs text-muted-foreground">−log_prob × A</div>
              <div className="font-mono font-bold">{(-gradientUpdate).toFixed(2)}</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 py-4">
            <div className="text-sm text-muted-foreground">Вероятность действия</div>
            <div className={`flex items-center gap-2 text-lg font-bold transition-colors ${advantage > 0 ? "text-primary" : advantage < 0 ? "text-destructive" : "text-muted-foreground"}`}>
              {advantage > 0 ? (
                <><ArrowUp className="w-6 h-6" /> Увеличивается</>
              ) : advantage < 0 ? (
                <><ArrowDown className="w-6 h-6" /> Уменьшается</>
              ) : (
                "Без изменений"
              )}
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-sm">
              {advantage > 0
                ? "Advantage > 0: действие было лучше ожидаемого → увеличиваем его вероятность."
                : advantage < 0
                  ? "Advantage < 0: действие было хуже ожидаемого → уменьшаем его вероятность."
                  : "Advantage = 0: действие ровно на уровне ожидания → нет обновления."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Labs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> На главную
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-neon bg-clip-text text-transparent">
          <FlaskConical className="w-8 h-8 inline mr-2" /> Практикумы
        </h1>
        <p className="text-muted-foreground mb-8">
          Лабораторные работы в стиле Jupyter — код, эксперименты и вопросы для размышления.
        </p>

        <Tabs defaultValue="discount" className="space-y-6">
          <div className="overflow-x-auto pb-1">
            <TabsList className="flex w-max md:grid md:grid-cols-6 md:w-full min-w-full gap-1">
              <TabsTrigger value="discount" className="whitespace-nowrap text-xs md:text-sm">Lab 1: Дисконт</TabsTrigger>
              <TabsTrigger value="explore" className="whitespace-nowrap text-xs md:text-sm">Lab 2: Exploration</TabsTrigger>
              <TabsTrigger value="replay" className="whitespace-nowrap text-xs md:text-sm">Lab 3: Replay</TabsTrigger>
              <TabsTrigger value="epsilon" className="whitespace-nowrap text-xs md:text-sm">Lab 4: ε-Greedy</TabsTrigger>
              <TabsTrigger value="advantage" className="whitespace-nowrap text-xs md:text-sm">Lab 5: Advantage</TabsTrigger>
              <TabsTrigger value="pg" className="whitespace-nowrap text-xs md:text-sm">Lab 6: Policy Grad</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="discount"><DiscountLab /></TabsContent>
          <TabsContent value="explore"><ExplorationLab /></TabsContent>
          <TabsContent value="replay"><ReplayLab /></TabsContent>
          <TabsContent value="epsilon"><EpsilonLab /></TabsContent>
          <TabsContent value="advantage"><AdvantageLab /></TabsContent>
          <TabsContent value="pg"><PolicyGradientLab /></TabsContent>
        </Tabs>

        {/* Практика: собранная среда лаборатории для этой темы. */}
        <LabPracticeSection contextKey="/labs" />
      </div>
    </div>
  );
};

export default Labs;
