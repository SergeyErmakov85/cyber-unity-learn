import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, BookOpen, Shield, Target, Cpu, Code, Rocket, FlaskConical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Math from "@/components/Math";
import Quiz from "@/components/Quiz";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import HubLessonBadges from "@/components/HubLessonBadges";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";

const PPOModule = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/algorithms")} className="text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Алгоритмы RL
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-secondary/10 text-secondary">PPO</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">Proximal Policy Optimization</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Стабильный алгоритм policy gradient с clipped objective — стандарт в Unity ML-Agents.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
        {/* Содержание */}
        <Card className="bg-card/60 backdrop-blur-sm border-secondary/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-secondary" /> Содержание
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li><a href="#problem" className="text-secondary hover:underline">Проблема Policy Gradient</a></li>
              <li><a href="#clipped" className="text-secondary hover:underline">Clipped Objective</a></li>
              <li><a href="#gae" className="text-secondary hover:underline">Generalized Advantage Estimation (GAE)</a></li>
              <li><a href="#architecture" className="text-secondary hover:underline">Архитектура Actor-Critic</a></li>
              <li><a href="#implementation" className="text-secondary hover:underline">Реализация на PyTorch</a></li>
              <li><a href="#full-implementation" className="text-secondary hover:underline">Полная реализация PPO</a></li>
              <li><a href="#unity" className="text-secondary hover:underline">Конфигурация для Unity ML-Agents</a></li>
            </ol>
          </CardContent>
        </Card>

        {/* Введение */}
        <section id="ppo-overview" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Введение</h2>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">PPO (Proximal Policy Optimization)</strong> — один из самых популярных
            алгоритмов обучения с подкреплением, разработанный OpenAI в 2017 году. PPO является стандартным алгоритмом
            в Unity ML-Agents благодаря своей стабильности и простоте настройки (реализация с нуля — <CrossLinkToLesson lessonId="2-2" lessonPath="/courses/2-2" lessonTitle="PPO — Proximal Policy Optimization" lessonLevel={2} />, гоночный агент — <CrossLinkToLesson lessonId="project-3" lessonPath="/courses/project-3" lessonTitle="Гоночный агент с непрерывным управлением" lessonLevel={2} />).
          </p>
        </section>

        {/* 1. Проблема Policy Gradient */}
        <section id="problem" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="w-6 h-6 text-secondary" /> 1. Проблема Policy Gradient
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-secondary/20">
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Стандартные методы policy gradient имеют большую дисперсию градиентов, что приводит к нестабильному обучению.
                Градиент политики выражается как:
              </p>
              <div className="overflow-x-auto">
                <Math display>{"\\enfOp{\\nabla} \\enfTgt{J}(\\enfPar{\\theta}) = \\mathbb{E}\\left[\\enfOp{\\nabla} \\log \\pi_\\theta(a \\mid \\enfVar{s}) \\cdot A(\\enfVar{s},a)\\right]"}</Math>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Основные проблемы:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Большие шаги обновления</strong> — могут катастрофически ухудшить политику</li>
                <li><strong className="text-foreground">Высокая дисперсия</strong> — градиенты сильно варьируются между батчами</li>
                <li><strong className="text-foreground">Нестабильность</strong> — одно неудачное обновление может разрушить всё обучение</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                PPO решает эти проблемы, ограничивая размер обновлений политики с помощью <strong className="text-foreground">clipped objective</strong>.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 2. Clipped Objective */}
        <section id="clipped" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-6 h-6 text-secondary" /> 2. Clipped Objective
          </h2>
          <HubLessonBadges hubPath="/algorithms/ppo" hubAnchor="clipped" />
          <Card className="bg-card/60 backdrop-blur-sm border-secondary/20">
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Ключевая идея PPO — использование «обрезанной» (clipped) целевой функции:
              </p>
              <div className="overflow-x-auto">
                <Math display>{"L^{CLIP}(\\enfPar{\\theta}) = \\mathbb{E}\\left[\\min\\left(\\enfTgt{r}_t(\\enfPar{\\theta})\\hat{A}_t,\\; \\text{clip}(\\enfTgt{r}_t(\\enfPar{\\theta}),\\; 1-\\enfPar{\\varepsilon},\\; 1+\\enfPar{\\varepsilon})\\hat{A}_t\\right)\\right]"}</Math>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                где <Math>{"\\enfTgt{r}_t(\\enfPar{\\theta})"}</Math> — отношение вероятностей:
              </p>
              <div className="overflow-x-auto">
                <Math display>{"\\enfTgt{r}_t(\\enfPar{\\theta}) = \\frac{\\pi_\\theta(a_t \\mid \\enfVar{s}_t)}{\\pi_{\\theta_{old}}(a_t|\\enfVar{s}_t)}"}</Math>
              </div>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Если <Math>{"\\enfTgt{r}_t > 1 + \\enfPar{\\varepsilon}"}</Math> — политика слишком изменилась (обрезаем)</li>
                <li>Если <Math>{"\\enfTgt{r}_t < 1 - \\enfPar{\\varepsilon}"}</Math> — политика слишком изменилась (обрезаем)</li>
                <li>Типичное значение <Math>{"\\enfPar{\\varepsilon} = 0.2"}</Math></li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Это гарантирует, что обновление политики не будет слишком большим на каждом шаге.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* 3. GAE */}
        <section id="gae" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Cpu className="w-6 h-6 text-secondary" /> 3. Generalized Advantage Estimation
          </h2>
          <HubLessonBadges hubPath="/algorithms/ppo" hubAnchor="gae" />
          <Card className="bg-card/60 backdrop-blur-sm border-secondary/20">
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                GAE обеспечивает баланс между bias и variance при оценке advantage function:
              </p>
              <div className="overflow-x-auto">
                <Math display>{"\\hat{A}_t = \\delta_t + (\\enfPar{\\gamma}\\enfPar{\\lambda})\\delta_{t+1} + (\\enfPar{\\gamma}\\enfPar{\\lambda})^2\\delta_{t+2} + \\ldots"}</Math>
              </div>
              <p className="text-muted-foreground leading-relaxed">где TD-ошибка:</p>
              <div className="overflow-x-auto">
                <Math display>{"\\delta_t = \\enfTgt{r}_t + \\enfPar{\\gamma} \\enfOp{V}(\\enfVar{s}_{t+1}) - \\enfOp{V}(\\enfVar{s}_t)"}</Math>
              </div>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><Math>{"\\enfPar{\\lambda} = 0"}</Math> — чистый TD (низкая дисперсия, высокий bias)</li>
                <li><Math>{"\\enfPar{\\lambda} = 1"}</Math> — чистый MC (высокая дисперсия, низкий bias)</li>
                <li><Math>{"\\enfPar{\\lambda} = 0.95"}</Math> — типичное значение (хороший баланс)</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 4. Архитектура */}
        <section id="architecture" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Cpu className="w-6 h-6 text-secondary" /> 4. Архитектура Actor-Critic
          </h2>
          <HubLessonBadges hubPath="/algorithms/ppo" hubAnchor="architecture" />
          <Card className="bg-card/60 backdrop-blur-sm border-secondary/20">
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                PPO использует архитектуру Actor-Critic с двумя нейронными сетями:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Actor (Политика)</strong> — выбирает действия: <Math>{"\\pi_\\theta(a \\mid \\enfVar{s})"}</Math></li>
                <li><strong className="text-foreground">Critic (Оценщик)</strong> — оценивает состояние: <Math>{"\\enfOp{V}_\\phi(\\enfVar{s})"}</Math></li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-4">Псевдокод PPO:</h3>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`for iteration = 1, 2, ...:
    # 1. Сбор данных текущей политикой
    Collect trajectories using π_θ
    
    # 2. Вычисление advantages с GAE
    Compute advantages Â_t using GAE(λ)
    
    # 3. Несколько эпох обучения на тех же данных
    for epoch = 1, K:
        Update θ by maximizing L^{CLIP}
        Update φ by minimizing MSE(V_φ(s), V_target)`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* 5. Реализация */}
        <section id="implementation" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Code className="w-6 h-6 text-secondary" /> 5. Реализация на PyTorch
          </h2>
          <HubLessonBadges hubPath="/algorithms/ppo" hubAnchor="implementation" />
          <p className="text-muted-foreground text-sm mb-4">(реализация — <CrossLinkToLesson lessonId="2-2" lessonPath="/courses/2-2" lessonTitle="PPO — Proximal Policy Optimization" lessonLevel={2} />)</p>
          <Card className="bg-card/60 backdrop-blur-sm border-secondary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">PPO Agent</h3>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`import torch
import torch.nn as nn
import torch.optim as optim
from torch.distributions import Categorical

class PPOAgent(nn.Module):
    def __init__(self, state_dim, action_dim, hidden_dim=64):
        super().__init__()
        # Actor network
        self.actor = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.Tanh(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.Tanh(),
            nn.Linear(hidden_dim, action_dim),
            nn.Softmax(dim=-1)
        )
        # Critic network
        self.critic = nn.Sequential(
            nn.Linear(state_dim, hidden_dim),
            nn.Tanh(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.Tanh(),
            nn.Linear(hidden_dim, 1)
        )
    
    def forward(self, state):
        return self.actor(state), self.critic(state)
    
    def get_action(self, state):
        probs = self.actor(state)
        dist = Categorical(probs)
        action = dist.sample()
        return action, dist.log_prob(action)
    
    def evaluate(self, state, action):
        probs = self.actor(state)
        dist = Categorical(probs)
        return dist.log_prob(action), dist.entropy(), self.critic(state)`}
              </pre>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-secondary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Clipped Loss Function</h3>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`def compute_ppo_loss(new_log_probs, old_log_probs, 
                      advantages, epsilon=0.2):
    """Clipped PPO objective"""
    # Отношение вероятностей
    ratio = torch.exp(new_log_probs - old_log_probs)
    
    # Обрезанное отношение
    clipped_ratio = torch.clamp(ratio, 
                                 1 - epsilon, 
                                 1 + epsilon)
    
    # Два варианта суррогатной функции
    surr1 = ratio * advantages
    surr2 = clipped_ratio * advantages
    
    # Берём минимум (пессимистичная оценка)
    return -torch.min(surr1, surr2).mean()`}
              </pre>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-secondary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">GAE Implementation</h3>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`def compute_gae(rewards, values, dones, 
                gamma=0.99, lam=0.95):
    """Generalized Advantage Estimation"""
    advantages = []
    gae = 0
    
    for t in reversed(range(len(rewards))):
        if t == len(rewards) - 1:
            next_value = 0
        else:
            next_value = values[t + 1]
        
        # TD-ошибка
        delta = rewards[t] + gamma * next_value * \\
                (1 - dones[t]) - values[t]
        
        # GAE
        gae = delta + gamma * lam * (1 - dones[t]) * gae
        advantages.insert(0, gae)
    
    return torch.tensor(advantages)`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* 6. Полная реализация PPO */}
        <section id="full-implementation" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-secondary" /> 6. Полная реализация PPO (минимальная версия)
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
            <CardContent className="p-6 space-y-4">
              <CyberCodeBlock language="python" filename="ppo_minimal.py">
{`import torch
import torch.nn as nn
import torch.optim as optim
from torch.distributions import MultivariateNormal
import numpy as np

class ActorCritic(nn.Module):
    def __init__(self, obs_dim, action_dim):
        super().__init__()
        self.shared = nn.Sequential(
            nn.Linear(obs_dim, 64), nn.Tanh(),
            nn.Linear(64, 64), nn.Tanh(),
        )
        self.actor  = nn.Linear(64, action_dim)
        self.critic = nn.Linear(64, 1)
        self.log_std = nn.Parameter(torch.zeros(action_dim))

    def forward(self, obs):
        feat   = self.shared(obs)
        mean   = self.actor(feat)
        value  = self.critic(feat)
        std    = torch.exp(self.log_std)
        dist   = MultivariateNormal(mean, torch.diag(std))
        return dist, value.squeeze(-1)

def ppo_update(model, optimizer, obs, actions, old_log_probs,
               advantages, returns, clip_eps=0.2, epochs=4):
    for _ in range(epochs):
        dist, values = model(obs)
        new_log_probs = dist.log_prob(actions)
        entropy = dist.entropy().mean()

        # Clipped surrogate objective
        ratio = torch.exp(new_log_probs - old_log_probs)
        surr1 = ratio * advantages
        surr2 = torch.clamp(ratio, 1 - clip_eps, 1 + clip_eps) * advantages

        actor_loss  = -torch.min(surr1, surr2).mean()
        critic_loss =  nn.functional.mse_loss(values, returns)
        loss = actor_loss + 0.5 * critic_loss - 0.01 * entropy

        optimizer.zero_grad()
        loss.backward()
        nn.utils.clip_grad_norm_(model.parameters(), 0.5)
        optimizer.step()

    return actor_loss.item(), critic_loss.item(), entropy.item()`}
              </CyberCodeBlock>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Ключевые гиперпараметры PPO</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-3 text-foreground">Параметр</th>
                      <th className="text-left p-3 text-foreground">Типичное значение</th>
                      <th className="text-left p-3 text-foreground">Описание</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/30"><td className="p-3"><code className="text-primary text-xs">clip_eps</code></td><td className="p-3">0.1 — 0.3</td><td className="p-3">Клипинг соотношения вероятностей</td></tr>
                    <tr className="border-b border-border/30"><td className="p-3"><code className="text-primary text-xs">epochs</code></td><td className="p-3">3 — 10</td><td className="p-3">Эпох обновления на один батч</td></tr>
                    <tr className="border-b border-border/30"><td className="p-3"><code className="text-primary text-xs">gamma</code></td><td className="p-3">0.99</td><td className="p-3">Дисконтирование</td></tr>
                    <tr className="border-b border-border/30"><td className="p-3"><code className="text-primary text-xs">lambda (GAE)</code></td><td className="p-3">0.95</td><td className="p-3">Λ в GAE</td></tr>
                    <tr className="border-b border-border/30"><td className="p-3"><code className="text-primary text-xs">batch_size</code></td><td className="p-3">64 — 512</td><td className="p-3">Размер мини-батча</td></tr>
                    <tr><td className="p-3"><code className="text-primary text-xs">entropy_coeff</code></td><td className="p-3">0.005 — 0.05</td><td className="p-3">Коэффициент бонуса энтропии</td></tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 7. Unity ML-Agents */}
        <section id="unity" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Rocket className="w-6 h-6 text-secondary" /> 7. Конфигурация для Unity ML-Agents
          </h2>
          <HubLessonBadges hubPath="/algorithms/ppo" hubAnchor="unity" />
          <p className="text-muted-foreground text-sm mb-4">(Racing Car — <CrossLinkToLesson lessonId="project-3" lessonPath="/courses/project-3" lessonTitle="Гоночный агент с непрерывным управлением" lessonLevel={2} />)</p>
          <Card className="bg-card/60 backdrop-blur-sm border-secondary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Конфигурационный файл YAML</h3>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`behaviors:
  MyAgent:
    trainer_type: ppo
    
    # Гиперпараметры
    hyperparameters:
      batch_size: 64          # Размер мини-батча
      buffer_size: 2048       # Размер буфера опыта
      learning_rate: 3.0e-4   # Скорость обучения
      beta: 5.0e-4            # Коэффициент энтропии
      epsilon: 0.2            # Порог клиппинга
      lambd: 0.95             # GAE lambda
      num_epoch: 3            # Эпохи на один батч
      learning_rate_schedule: linear
    
    # Архитектура сети
    network_settings:
      normalize: true
      hidden_units: 128
      num_layers: 2
      vis_encode_type: simple
    
    # Параметры вознаграждения
    reward_signals:
      extrinsic:
        gamma: 0.99
        strength: 1.0
    
    max_steps: 500000
    time_horizon: 64
    summary_freq: 10000`}
              </pre>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-secondary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Ключевые гиперпараметры PPO</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-3 text-foreground">Параметр</th>
                      <th className="text-left p-3 text-foreground">Значение</th>
                      <th className="text-left p-3 text-foreground">Описание</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/30"><td className="p-3"><code className="text-primary text-xs">epsilon</code></td><td className="p-3">0.1–0.3</td><td className="p-3">Порог обрезки ratio</td></tr>
                    <tr className="border-b border-border/30"><td className="p-3"><code className="text-primary text-xs">lambd</code></td><td className="p-3">0.9–0.99</td><td className="p-3">GAE lambda</td></tr>
                    <tr className="border-b border-border/30"><td className="p-3"><code className="text-primary text-xs">beta</code></td><td className="p-3">1e-4–1e-2</td><td className="p-3">Коэффициент энтропии</td></tr>
                    <tr className="border-b border-border/30"><td className="p-3"><code className="text-primary text-xs">num_epoch</code></td><td className="p-3">3–10</td><td className="p-3">Число эпох на батч</td></tr>
                    <tr><td className="p-3"><code className="text-primary text-xs">batch_size</code></td><td className="p-3">32–512</td><td className="p-3">Размер мини-батча</td></tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        <Quiz
          title="Проверьте понимание PPO"
          questions={[
            {
              question: "Что ограничивает clipped objective в PPO?",
              options: [
                "Размер нейросети",
                "Размер изменения политики за одно обновление",
                "Количество эпизодов",
                "Learning rate",
              ],
              correctIndex: 1,
            },
            {
              question: "Что такое GAE (Generalized Advantage Estimation)?",
              options: [
                "Метод оптимизации нейросети",
                "Способ вычисления advantage с балансом bias-variance",
                "Алгоритм обучения без учителя",
                "Тип функции активации",
              ],
              correctIndex: 1,
            },
          ]}
        />

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-border/50">
          <Button variant="outline" onClick={() => navigate("/algorithms")} className="border-secondary/50 text-secondary hover:bg-secondary/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> Алгоритмы RL
          </Button>
          <Button variant="outline" onClick={() => navigate("/algorithms/sac")} className="border-secondary/50 text-secondary hover:bg-secondary/10">
            SAC <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PPOModule;
