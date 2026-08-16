import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, GitBranch, ArrowRight } from "lucide-react";
import Math from "@/components/Math";
import Quiz from "@/components/Quiz";

const codeBlock = (code: string) => (
  <pre className="bg-card/80 border border-primary/20 rounded-lg p-4 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed">
    <code>{code}</code>
  </pre>
);

const A3CModule = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/algorithms")} className="text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Алгоритмы
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <GitBranch className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-neon bg-clip-text text-transparent">
              A3C — Asynchronous Advantage Actor-Critic
            </h1>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            Параллельное асинхронное обучение: множество агентов исследуют среду одновременно.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="theory" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="theory">Теория</TabsTrigger>
            <TabsTrigger value="async">Асинхронность</TabsTrigger>
            <TabsTrigger value="code">Реализация</TabsTrigger>
          </TabsList>

          <TabsContent value="theory" className="space-y-6">
            <Card className="border-primary/30">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-primary">Advantage Actor-Critic</h2>
                <p className="text-muted-foreground">
                  A3C комбинирует actor (политика) и critic (функция ценности) с advantage function для снижения дисперсии градиентов.
                </p>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Policy Gradient с Advantage</h3>
                  <Math>{"\\enfOp{\\nabla}_\\theta \\enfTgt{J}(\\enfPar{\\theta}) = \\mathbb{E}\\left[ \\enfOp{\\nabla}_\\theta \\log \\pi_\\theta(a_t \\mid \\enfVar{s}_t) \\cdot A(\\enfVar{s}_t, a_t) \\right]"}</Math>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Advantage Function</h3>
                  <Math>{"A(\\enfVar{s}_t, a_t) = \\enfTgt{r}_t + \\enfPar{\\gamma} \\enfOp{V}(\\enfVar{s}_{t+1}) - \\enfOp{V}(\\enfVar{s}_t)"}</Math>
                  <p className="text-sm text-muted-foreground mt-1">
                    Advantage показывает насколько действие лучше «среднего» — critic V(s) оценивает baseline.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Полная функция потерь</h3>
                  <Math>{"L = L_{\\text{policy}} + c_1 L_{\\text{value}} - c_2 H(\\pi)"}</Math>
                  <p className="text-sm text-muted-foreground mt-1">
                    H(π) — энтропийная регуляризация для поощрения исследования.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="async" className="space-y-6">
            <Card className="border-primary/30">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-accent">Асинхронное обучение</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-card/80 border border-primary/20">
                    <h4 className="font-semibold text-primary mb-2">Архитектура</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Глобальная сеть (shared parameters)</li>
                      <li>N параллельных worker'ов</li>
                      <li>Каждый worker — своя копия среды</li>
                      <li>Асинхронные обновления глобальной сети</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-card/80 border border-primary/20">
                    <h4 className="font-semibold text-accent mb-2">Преимущества</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Разнообразие опыта (decorrelation)</li>
                      <li>Линейное ускорение от числа ядер</li>
                      <li>Не нужен replay buffer</li>
                      <li>Стабильнее одиночного обучения</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Псевдокод</h3>
                  {codeBlock(`# A3C Pseudocode
Global network: θ (shared)

for each worker i (parallel):
    θ_local = copy(θ)           # Sync with global
    
    for t_step in range(n_steps):
        action = π(state; θ_local)
        next_state, reward = env.step(action)
        store (state, action, reward)
    
    # Compute n-step returns and advantages
    R = V(final_state; θ_local)  # Bootstrap
    for t in reversed(trajectory):
        R = r_t + γ * R
        advantage = R - V(s_t; θ_local)
    
    # Async gradient update to global θ
    gradients = compute_gradients(θ_local)
    apply_gradients(θ, gradients)   # Lock-free`)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            <Card className="border-primary/30">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-primary">Реализация на PyTorch</h2>

                {codeBlock(`import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.multiprocessing as mp
from torch.distributions import Categorical

class ActorCritic(nn.Module):
    def __init__(self, state_dim, action_dim, hidden_dim=128):
        super().__init__()
        self.shared = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.ReLU()
        )
        self.actor = nn.Linear(hidden_dim, action_dim)
        self.critic = nn.Linear(hidden_dim, 1)
    
    def forward(self, x):
        features = self.shared(x)
        policy = F.softmax(self.actor(features), dim=-1)
        value = self.critic(features)
        return policy, value

def worker(global_model, optimizer, env_name, worker_id,
           gamma=0.99, max_steps=1000, n_steps=20):
    """A3C Worker Process"""
    import gym
    env = gym.make(env_name)
    local_model = ActorCritic(
        env.observation_space.shape[0],
        env.action_space.n
    )
    
    for episode in range(max_steps):
        # Sync with global model
        local_model.load_state_dict(global_model.state_dict())
        
        state = env.reset()
        log_probs, values, rewards, entropies = [], [], [], []
        
        for step in range(n_steps):
            state_t = torch.FloatTensor(state)
            policy, value = local_model(state_t)
            
            dist = Categorical(policy)
            action = dist.sample()
            
            log_probs.append(dist.log_prob(action))
            values.append(value)
            entropies.append(dist.entropy())
            
            state, reward, done, _ = env.step(action.item())
            rewards.append(reward)
            
            if done:
                break
        
        # Compute returns
        R = 0 if done else local_model(
            torch.FloatTensor(state)
        )[1].item()
        
        returns = []
        for r in reversed(rewards):
            R = r + gamma * R
            returns.insert(0, R)
        
        returns = torch.FloatTensor(returns)
        values = torch.cat(values).squeeze()
        log_probs = torch.stack(log_probs)
        entropies = torch.stack(entropies)
        
        advantage = returns - values.detach()
        
        policy_loss = -(log_probs * advantage).mean()
        value_loss = F.mse_loss(values, returns)
        entropy_loss = -entropies.mean()
        
        loss = policy_loss + 0.5 * value_loss + 0.01 * entropy_loss
        
        optimizer.zero_grad()
        loss.backward()
        # Gradient clipping
        torch.nn.utils.clip_grad_norm_(local_model.parameters(), 40)
        
        # Copy gradients to global model
        for local_param, global_param in zip(
            local_model.parameters(), global_model.parameters()
        ):
            global_param._grad = local_param.grad
        
        optimizer.step()

# Main
if __name__ == "__main__":
    mp.set_start_method("spawn")
    global_model = ActorCritic(state_dim=4, action_dim=2)
    global_model.share_memory()
    
    optimizer = torch.optim.Adam(global_model.parameters(), lr=1e-4)
    
    processes = []
    for i in range(mp.cpu_count()):
        p = mp.Process(target=worker, args=(
            global_model, optimizer, "CartPole-v1", i
        ))
        p.start()
        processes.append(p)
    
    for p in processes:
        p.join()`)}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Quiz
          title="Проверьте понимание A3C"
          questions={[
            {
              question: "Какова основная идея A3C?",
              options: [
                "Использование одного мощного агента",
                "Параллельное обучение нескольких агентов с async обновлениями",
                "Обучение на основе демонстраций",
                "Максимизация энтропии",
              ],
              correctIndex: 1,
            },
            {
              question: "Зачем в A3C используется энтропийная регуляризация?",
              options: [
                "Для ускорения обучения",
                "Для уменьшения размера сети",
                "Для поощрения исследования (exploration)",
                "Для стабилизации target network",
              ],
              correctIndex: 2,
            },
          ]}
        />

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => navigate("/algorithms/sac")} className="border-primary/50 text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" /> SAC
          </Button>
          <Button onClick={() => navigate("/algorithms")} className="bg-gradient-neon">
            Все алгоритмы <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default A3CModule;
