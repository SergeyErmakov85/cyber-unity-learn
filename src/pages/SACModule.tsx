import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, BookOpen, Zap, Target, Code, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Math from "@/components/Math";
import Quiz from "@/components/Quiz";
import HubLessonBadges from "@/components/HubLessonBadges";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";

const SACModule = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/algorithms")} className="text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Алгоритмы RL
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent">SAC</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">Soft Actor-Critic</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Off-policy алгоритм с максимизацией энтропии для стабильного исследования и непрерывных действий.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
        {/* Содержание */}
        <Card className="bg-card/60 backdrop-blur-sm border-accent/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" /> Содержание
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li><a href="#entropy" className="text-accent hover:underline">Maximum Entropy RL</a></li>
              <li><a href="#objective" className="text-accent hover:underline">Целевая функция SAC</a></li>
              <li><a href="#architecture" className="text-accent hover:underline">Архитектура</a></li>
              <li><a href="#implementation" className="text-accent hover:underline">Реализация на PyTorch</a></li>
              <li><a href="#unity" className="text-accent hover:underline">Конфигурация для Unity ML-Agents</a></li>
            </ol>
          </CardContent>
        </Card>

        {/* Введение */}
        <section id="sac-overview" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Введение</h2>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">SAC (Soft Actor-Critic)</strong> — off-policy алгоритм, основанный на
            принципе максимизации энтропии. Разработан в 2018 году в UC Berkeley. SAC автоматически балансирует
            между exploitation (использование лучших действий) и exploration (исследование новых действий)
            (реализация — <CrossLinkToLesson lessonId="3-1" lessonPath="/courses/3-1" lessonTitle="SAC — Soft Actor-Critic" lessonLevel={3} />).
          </p>
        </section>

        {/* 1. Maximum Entropy RL */}
        <section id="entropy" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="w-6 h-6 text-accent" /> 1. Maximum Entropy RL
          </h2>
          <HubLessonBadges hubPath="/algorithms/sac" hubAnchor="entropy" />
          <Card className="bg-card/60 backdrop-blur-sm border-accent/20">
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                В стандартном RL мы максимизируем суммарную награду. В Maximum Entropy RL мы добавляем бонус за энтропию политики:
              </p>
              <div className="overflow-x-auto">
                <Math display>{"\\enfTgt{J}(\\pi) = \\sum_{t=0}^{T} \\mathbb{E}\\left[\\enfTgt{r}(\\enfVar{s}_t, a_t) + \\enfPar{\\alpha} \\mathcal{H}(\\pi(\\cdot \\mid \\enfVar{s}_t))\\right]"}</Math>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                где <Math>{"\\mathcal{H}(\\pi) = -\\sum_a \\pi(a \\mid \\enfVar{s})\\log\\pi(a|\\enfVar{s})"}</Math> — энтропия политики, а <Math>{"\\enfPar{\\alpha}"}</Math> — температурный коэффициент.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Высокая энтропия</strong> — политика более случайная (исследование)</li>
                <li><strong className="text-foreground">Низкая энтропия</strong> — политика более детерминированная (использование)</li>
                <li><strong className="text-foreground">α</strong> автоматически настраивается во время обучения</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 2. Целевая функция */}
        <section id="objective" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent" /> 2. Целевая функция SAC
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-accent/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Soft Q-функция</h3>
              <div className="overflow-x-auto">
                <Math display>{"\\enfOp{Q}_{soft}(\\enfVar{s}_t, a_t) = \\enfTgt{r}(\\enfVar{s}_t, a_t) + \\enfPar{\\gamma} \\mathbb{E}_{s_{t+1}}\\left[\\enfOp{V}_{soft}(\\enfVar{s}_{t+1})\\right]"}</Math>
              </div>
              <h3 className="text-lg font-semibold text-foreground mt-4">Soft Value Function</h3>
              <div className="overflow-x-auto">
                <Math display>{"\\enfOp{V}_{soft}(\\enfVar{s}_t) = \\mathbb{E}_{a_t \\sim \\pi}\\left[\\enfOp{Q}_{soft}(\\enfVar{s}_t, a_t) - \\enfPar{\\alpha} \\log \\pi(a_t \\mid \\enfVar{s}_t)\\right]"}</Math>
              </div>
              <h3 className="text-lg font-semibold text-foreground mt-4">Обновление политики</h3>
              <div className="overflow-x-auto">
                <Math display>{"\\pi^* = \\arg\\min_{\\pi} D_{KL}\\left(\\pi(\\cdot \\mid \\enfVar{s}_t)\\;\\|\\;\\frac{\\exp(\\enfOp{Q}(\\enfVar{s}_t, \\cdot))}{Z(\\enfVar{s}_t)}\\right)"}</Math>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 3. Архитектура */}
        <section id="architecture" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent" /> 3. Архитектура SAC
          </h2>
          <HubLessonBadges hubPath="/algorithms/sac" hubAnchor="architecture" />
          <Card className="bg-card/60 backdrop-blur-sm border-accent/20">
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">SAC использует 5 нейронных сетей:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Actor (Политика)</strong> — <Math>{"\\pi_\\theta(a \\mid \\enfVar{s})"}</Math> — выход: mean + std для непрерывных действий</li>
                <li><strong className="text-foreground">Critic 1</strong> — <Math>{"\\enfOp{Q}_{\\phi_1}(\\enfVar{s}, a)"}</Math></li>
                <li><strong className="text-foreground">Critic 2</strong> — <Math>{"\\enfOp{Q}_{\\phi_2}(\\enfVar{s}, a)"}</Math> (для уменьшения overestimation)</li>
                <li><strong className="text-foreground">Target Critic 1</strong> — <Math>{"\\enfOp{Q}_{\\bar{\\phi}_1}"}</Math> (мягкое обновление)</li>
                <li><strong className="text-foreground">Target Critic 2</strong> — <Math>{"\\enfOp{Q}_{\\bar{\\phi}_2}"}</Math></li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Мягкое обновление целевых сетей:
              </p>
              <div className="overflow-x-auto">
                <Math display>{"\\bar{\\phi} \\leftarrow \\tau \\phi + (1 - \\tau) \\bar{\\phi}, \\quad \\tau = 0.005"}</Math>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 4. Реализация */}
        <section id="implementation" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Code className="w-6 h-6 text-accent" /> 4. Реализация на PyTorch
          </h2>
          <HubLessonBadges hubPath="/algorithms/sac" hubAnchor="implementation" />
          <p className="text-muted-foreground text-sm mb-4">(реализация — <CrossLinkToLesson lessonId="3-1" lessonPath="/courses/3-1" lessonTitle="SAC — Soft Actor-Critic" lessonLevel={3} />)</p>
          <Card className="bg-card/60 backdrop-blur-sm border-accent/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Actor Network (Gaussian Policy)</h3>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.distributions import Normal

class GaussianPolicy(nn.Module):
    def __init__(self, state_dim, action_dim, hidden_dim=256):
        super().__init__()
        self.fc1 = nn.Linear(state_dim, hidden_dim)
        self.fc2 = nn.Linear(hidden_dim, hidden_dim)
        self.mean = nn.Linear(hidden_dim, action_dim)
        self.log_std = nn.Linear(hidden_dim, action_dim)
    
    def forward(self, state):
        x = F.relu(self.fc1(state))
        x = F.relu(self.fc2(x))
        mean = self.mean(x)
        log_std = self.log_std(x).clamp(-20, 2)
        return mean, log_std
    
    def sample(self, state):
        mean, log_std = self.forward(state)
        std = log_std.exp()
        dist = Normal(mean, std)
        
        # Reparameterization trick
        x = dist.rsample()
        action = torch.tanh(x)
        
        # Log probability with tanh correction
        log_prob = dist.log_prob(x) - \\
                   torch.log(1 - action.pow(2) + 1e-6)
        log_prob = log_prob.sum(-1, keepdim=True)
        
        return action, log_prob`}
              </pre>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-accent/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Twin Q-Network</h3>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`class TwinQNetwork(nn.Module):
    def __init__(self, state_dim, action_dim, hidden_dim=256):
        super().__init__()
        # Q1
        self.q1 = nn.Sequential(
            nn.Linear(state_dim + action_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1)
        )
        # Q2
        self.q2 = nn.Sequential(
            nn.Linear(state_dim + action_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 1)
        )
    
    def forward(self, state, action):
        x = torch.cat([state, action], dim=-1)
        return self.q1(x), self.q2(x)`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* 5. Unity config */}
        <section id="unity" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Rocket className="w-6 h-6 text-accent" /> 5. Конфигурация для Unity ML-Agents
          </h2>
          <HubLessonBadges hubPath="/algorithms/sac" hubAnchor="unity" />
          <Card className="bg-card/60 backdrop-blur-sm border-accent/20">
            <CardContent className="p-6 space-y-4">
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`behaviors:
  MyAgent:
    trainer_type: sac
    
    hyperparameters:
      batch_size: 128
      buffer_size: 50000
      learning_rate: 3.0e-4
      learning_rate_schedule: constant
      tau: 0.005                  # Мягкое обновление
      init_entcoef: 0.5           # Начальный α
      
    network_settings:
      normalize: true
      hidden_units: 256
      num_layers: 2
    
    reward_signals:
      extrinsic:
        gamma: 0.99
        strength: 1.0
    
    max_steps: 1000000
    time_horizon: 64`}
              </pre>
              <h3 className="text-lg font-semibold text-foreground mt-4">Когда использовать SAC vs PPO</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-3 text-foreground">Критерий</th>
                      <th className="text-left p-3 text-secondary">PPO</th>
                      <th className="text-left p-3 text-accent">SAC</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/30"><td className="p-3">Тип действий</td><td className="p-3">Дискретные/непрерывные</td><td className="p-3">Непрерывные</td></tr>
                    <tr className="border-b border-border/30"><td className="p-3">Sample efficiency</td><td className="p-3">Низкая</td><td className="p-3">Высокая</td></tr>
                    <tr className="border-b border-border/30"><td className="p-3">Простота настройки</td><td className="p-3">Простой</td><td className="p-3">Средний</td></tr>
                    <tr><td className="p-3">Лучше для</td><td className="p-3">Большинство задач</td><td className="p-3">Робототехника, сложное управление</td></tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Navigation */}
        <Quiz
          title="Проверьте понимание SAC"
          questions={[
            {
              question: "Что максимизирует SAC помимо награды?",
              options: [
                "Скорость обучения",
                "Энтропию политики",
                "Размер буфера",
                "Количество слоёв",
              ],
              correctIndex: 1,
            },
            {
              question: "Почему SAC использует два Q-сети?",
              options: [
                "Для ускорения обучения",
                "Для минимизации overestimation bias",
                "Для поддержки дискретных действий",
                "Для увеличения exploration",
              ],
              correctIndex: 1,
            },
          ]}
        />

        <div className="flex justify-between items-center pt-8 border-t border-border/50">
          <Button variant="outline" onClick={() => navigate("/algorithms/ppo")} className="border-accent/50 text-accent hover:bg-accent/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> PPO
          </Button>
          <Button variant="outline" onClick={() => navigate("/algorithms")} className="border-accent/50 text-accent hover:bg-accent/10">
            Все алгоритмы <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SACModule;
