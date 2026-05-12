import LessonLayout from "@/components/LessonLayout";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import ProGate from "@/components/ProGate";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import Math from "@/components/Math";
import Quiz from "@/components/Quiz";
import PPOClipChart from "@/components/math-rl/PPOClipChart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Lightbulb, Zap, AlertTriangle, BookOpen, Cpu, Sparkles } from "lucide-react";

const quizQuestions = [
  {
    question: "Зачем PPO использует clipping вместо KL-divergence (как в TRPO)?",
    options: [
      "Clipping точнее вычисляет градиент",
      "Clipping проще в реализации и эффективнее вычислительно",
      "KL-divergence не работает с нейросетями",
      "Clipping увеличивает entropy",
    ],
    correctIndex: 1,
  },
  {
    question: "Что ограничивает параметр ε в clipped objective?",
    options: [
      "Размер батча",
      "Максимальное изменение политики за один шаг",
      "Скорость обучения",
      "Количество эпизодов",
    ],
    correctIndex: 1,
  },
  {
    question: "Зачем добавляется entropy bonus в функцию потерь PPO?",
    options: [
      "Для ускорения обучения",
      "Для поощрения исследования и предотвращения преждевременной сходимости",
      "Для уменьшения размера сети",
      "Entropy bonus не используется в PPO",
    ],
    correctIndex: 1,
  },
  {
    question: "Что вычисляет GAE (Generalized Advantage Estimation)?",
    options: [
      "Точную Q-функцию",
      "Взвешенную сумму n-step advantages с параметром λ",
      "Скорость обучения для каждого слоя",
      "Оптимальную политику",
    ],
    correctIndex: 1,
  },
  {
    question: "Какой типичный диапазон для ε в PPO clipping?",
    options: ["0.001 — 0.01", "0.1 — 0.3", "0.5 — 1.0", "1.0 — 10.0"],
    correctIndex: 1,
  },
  {
    question: "Почему GAE считается в обратном порядке (с конца эпизода)?",
    options: [
      "Так требует автоград PyTorch",
      "Чтобы накопить рекуррентное соотношение A_t = δ_t + γλ·A_{t+1}",
      "Для ускорения работы GPU",
      "Чтобы избежать переполнения тензоров",
    ],
    correctIndex: 1,
  },
];

const CourseLesson2_2 = () => {
  const preview = (
    <>
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Почему PPO стал стандартом</h2>
        <p className="text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Proximal Policy Optimization (PPO)</strong> — алгоритм от OpenAI (2017),
          ставший де-факто стандартом в индустрии. Его используют OpenAI для обучения ChatGPT (RLHF),
          Unity ML-Agents как алгоритм по умолчанию, а также DeepMind, Tesla и другие.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          PPO сочетает стабильность TRPO с простотой реализации обычного Policy Gradient.
          Ключевая идея — ограничить шаг обновления политики, чтобы новая политика не отклонялась
          слишком сильно от старой.
        </p>
      </section>
    </>
  );

  return (
    <LessonLayout
      lessonId="2-2"
      lessonTitle="PPO — реализация с нуля"
      lessonNumber="2.2"
      duration="60 мин"
      tags={["#code", "#pytorch", "#ppo", "#key-algorithm"]}
      level={2}
      prevLesson={{ path: "/courses/2-1", title: "Policy Gradient" }}
      nextLesson={{ path: "/courses/2-3", title: "Actor-Critic в Unity" }}
    >
      <ProGate preview={preview}>
        {preview}

        {/* Colab */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" asChild>
            <a href="https://colab.research.google.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              Открыть в Google Colab
            </a>
          </Button>
        </div>

        {/* Why PPO cards */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: Zap, title: "Простота", desc: "Реализуется в ~150 строк, без сложных вычислений как в TRPO" },
              { icon: Lightbulb, title: "Стабильность", desc: "Clipping предотвращает катастрофические обновления" },
              { icon: Sparkles, title: "Универсальность", desc: "Работает с дискретными и непрерывными действиями" },
            ].map((item, i) => (
              <Card key={i} className="bg-card/50 border-border/40">
                <CardContent className="p-4 space-y-2">
                  <item.icon className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* === 1. Контекст 3D Ball === */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">1. Контекст: задача 3D Ball</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Платформа, на которой лежит шар. Цель агента — наклонять платформу так, чтобы шар не падал.
            Это классическая среда Unity ML-Agents с непрерывными действиями.
          </p>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
            <CardContent className="p-5 space-y-2 text-sm text-muted-foreground">
              <div><strong className="text-foreground">Состояние S</strong> — 8 непрерывных значений: наклоны платформы (X, Z), координаты шара (X, Y, Z), скорости шара.</div>
              <div><strong className="text-foreground">Действия A</strong> — 2 непрерывных в диапазоне [−1, 1]: изменение наклона по X и Z.</div>
              <div><strong className="text-foreground">Награда R</strong> — +0.1 за каждый шаг на платформе, −1.0 при падении.</div>
            </CardContent>
          </Card>

          <h3 className="text-xl font-bold text-foreground mt-6 mb-3">Архитектура Actor-Critic</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            <strong className="text-foreground">Actor</strong> решает <em>что делать</em>, <strong className="text-foreground">Critic</strong> оценивает <em>насколько хороша</em> текущая ситуация.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
              <CardContent className="p-5">
                <div className="text-xs font-bold text-primary uppercase tracking-wide mb-2">Actor π_θ(a|s)</div>
                <div className="text-sm text-muted-foreground">Linear → Tanh → Linear → Tanh → μ (2 dims) + обучаемый log σ</div>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm border-secondary/30">
              <CardContent className="p-5">
                <div className="text-xs font-bold text-secondary uppercase tracking-wide mb-2">Critic V_φ(s)</div>
                <div className="text-sm text-muted-foreground">Linear → Tanh → Linear → Tanh → V(s) (1 dim)</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* === 2. Проблема шага === */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">2. Проблема шага обучения</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            В классическом Policy Gradient мы максимизируем:
          </p>
          <Math>{"L^{PG}(\\theta) = \\hat{\\mathbb{E}}_t \\left[ \\log \\pi_\\theta(a_t|s_t) \\, \\hat{A}_t \\right]"}</Math>

          <Card className="bg-card/60 backdrop-blur-sm border-accent/30 mt-4">
            <CardContent className="p-5">
              <h3 className="font-bold text-accent mb-2">Катастрофическое забывание</h3>
              <p className="text-sm text-muted-foreground">
                Один слишком большой шаг градиента может разрушить хорошую политику. В непрерывных задачах
                (наклон платформы) агент после такого «прыжка» начинает действовать случайно — и из ямы уже не выберется.
              </p>
            </CardContent>
          </Card>

          <p className="text-muted-foreground leading-relaxed mt-4">
            <strong className="text-foreground">TRPO</strong> решал это через KL-дивергенцию и обратную матрицу Гессе — математически
            красиво, но дорого. <strong className="text-primary">PPO</strong> решает ту же задачу через простой <em>clipping</em>.
          </p>
        </section>

        {/* === 3. Clipped objective === */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            <CrossLinkToHub hubPath="/algorithms/ppo" hubAnchor="clipped" hubTitle="PPO — Clipped Objective">
              3. Элегантное решение: Clipped Objective
            </CrossLinkToHub>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Сначала вводим <strong className="text-foreground">отношение вероятностей</strong>:
          </p>
          <Math>{"r_t(\\theta) = \\frac{\\pi_\\theta(a_t|s_t)}{\\pi_{\\theta_{old}}(a_t|s_t)}"}</Math>

          <p className="text-sm text-muted-foreground my-4">
            На старте эпохи θ = θ_old, поэтому r_t = 1. Если r_t &gt; 1 — действие стало вероятнее, если r_t &lt; 1 — наоборот.
          </p>

          <p className="text-muted-foreground leading-relaxed mb-3">
            Clipped objective — берём минимум из обычного и обрезанного ratio (типичное ε = 0.2):
          </p>
          <Math>{"L^{CLIP}(\\theta) = \\hat{\\mathbb{E}}_t \\left[ \\min\\left( r_t(\\theta) \\hat{A}_t, \\; \\text{clip}(r_t(\\theta), 1-\\varepsilon, 1+\\varepsilon) \\hat{A}_t \\right) \\right]"}</Math>

          <PPOClipChart />

          <h3 className="text-lg font-bold text-foreground mt-6 mb-3">Реализация Actor Loss</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Минус — потому что PyTorch минимизирует, а нам нужно максимизировать целевую функцию.
          </p>
          <CyberCodeBlock language="python" filename="ppo_actor_loss.py">
{`import torch

# new_log_probs — вероятности с текущей политикой
# old_log_probs — вероятности со старой политикой (из буфера)
ratio = torch.exp(new_log_probs - old_log_probs)

# Необрезанная суррогатная функция
surr1 = ratio * advantages

# Обрезанная суррогатная функция
clip_param = 0.2
surr2 = torch.clamp(ratio, 1.0 - clip_param, 1.0 + clip_param) * advantages

# Берём min и ставим минус для градиентного спуска
actor_loss = -torch.min(surr1, surr2).mean()`}
          </CyberCodeBlock>
        </section>

        {/* === 4. GAE === */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            <CrossLinkToHub hubPath="/algorithms/ppo" hubAnchor="gae" hubTitle="PPO — GAE">
              4. Critic: оценка преимущества (GAE)
            </CrossLinkToHub>
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Критик V_φ(s) предсказывает суммарную награду из текущего состояния. Чтобы снизить дисперсию, PPO использует
            <strong className="text-foreground"> Generalized Advantage Estimation</strong>.
          </p>

          <h3 className="text-lg font-bold text-foreground mb-2">TD-ошибка</h3>
          <Math>{"\\delta_t = r_t + \\gamma V_\\phi(s_{t+1}) - V_\\phi(s_t)"}</Math>
          <p className="text-sm text-muted-foreground mt-2 mb-4 border-l-2 border-primary/40 pl-4">
            δ_t — «сюрприз»: разница между предсказанием критика V(s_t) и тем, что произошло реально.
          </p>

          <h3 className="text-lg font-bold text-foreground mb-2">GAE</h3>
          <Math>{"\\hat{A}_t^{GAE(\\gamma, \\lambda)} = \\sum_{l=0}^{\\infty} (\\gamma \\lambda)^l \\delta_{t+l}"}</Math>

          <div className="grid md:grid-cols-2 gap-3 my-4">
            <Card className="bg-card/60 backdrop-blur-sm border-secondary/30">
              <CardContent className="p-4">
                <h4 className="font-bold text-secondary mb-2">λ → 0</h4>
                <p className="text-sm text-muted-foreground">Только TD(0). Низкая дисперсия, но <strong>высокий bias</strong> (зависит от точности критика).</p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm border-accent/30">
              <CardContent className="p-4">
                <h4 className="font-bold text-accent mb-2">λ → 1</h4>
                <p className="text-sm text-muted-foreground">Близко к Monte Carlo. Низкий bias, но <strong>высокая дисперсия</strong>. На практике λ = 0.95.</p>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-lg font-bold text-foreground mt-6 mb-3">Расчёт GAE на PyTorch</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Считаем с конца траектории — это позволяет использовать рекуррентное соотношение A_t = δ_t + γλ·A_{`{t+1}`}.
          </p>
          <CyberCodeBlock language="python" filename="compute_gae.py">
{`import torch

def compute_gae(rewards, values, next_value, dones, gamma=0.99, lam=0.95):
    """
    rewards    : тензор наград          [T]
    values     : предсказания V(s_t)    [T]
    next_value : V(s_T) — bootstrap     скаляр
    dones      : флаги конца эпизода    [T]
    """
    advantages = torch.zeros_like(rewards)
    gae = 0.0

    # Идём с конца в начало траектории
    for t in reversed(range(len(rewards))):
        next_v = next_value if t == len(rewards) - 1 else values[t + 1]

        # Маска: если эпизод закончился, обнуляем будущее
        mask = 1.0 - dones[t]

        # TD-ошибка
        delta = rewards[t] + gamma * next_v * mask - values[t]

        # Рекуррентная свёртка: A_t = delta_t + gamma*lambda*A_{t+1}
        gae = delta + gamma * lam * mask * gae
        advantages[t] = gae

    # Returns = Advantage + V(s) — целевые значения для критика
    returns = advantages + values

    # Нормализация преимуществ — стандартный трюк стабильности
    advantages = (advantages - advantages.mean()) / (advantages.std() + 1e-8)
    return advantages, returns`}
          </CyberCodeBlock>

          <h3 className="text-lg font-bold text-foreground mt-6 mb-3">Critic Loss</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Простая MSE между V_φ(s_t) и таргетом R̂_t = Â_t + V_φ(s_t)_old:
          </p>
          <Math>{"L^{VF}(\\phi) = \\hat{\\mathbb{E}}_t \\left[ \\left( V_\\phi(s_t) - \\hat{R}_t \\right)^2 \\right]"}</Math>
        </section>

        {/* === 5. Полная реализация === */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">5. Полная реализация PPO</h2>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-3">
            Полная функция потерь PPO — три члена: clipped actor, MSE critic, entropy bonus:
          </p>
          <Math>{"L^{PPO}(\\theta, \\phi) = \\hat{\\mathbb{E}}_t \\left[ L^{CLIP}_t(\\theta) - c_1 L^{VF}_t(\\phi) + c_2 H[\\pi_\\theta](s_t) \\right]"}</Math>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            c₁ ≈ 0.5 — вес критика, c₂ ≈ 0.01 — вес <CrossLinkToHub hubPath="/math-rl/module-5" hubAnchor="глава-9" hubTitle="Энтропия">энтропии</CrossLinkToHub>, H — энтропия распределения политики.
          </p>

          <h3 className="text-lg font-bold text-foreground mb-3">5.1. Сети Actor и Critic (непрерывные действия)</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Для 3D Ball актёр выдаёт среднее μ и обучаемый log σ — параметры гауссова распределения.
          </p>
          <CyberCodeBlock language="python" filename="networks.py">
{`import torch
import torch.nn as nn
from torch.distributions import Normal

class ActorCritic(nn.Module):
    def __init__(self, obs_dim=8, act_dim=2, hidden=128):
        super().__init__()

        self.actor = nn.Sequential(
            nn.Linear(obs_dim, hidden), nn.Tanh(),
            nn.Linear(hidden, hidden), nn.Tanh(),
            nn.Linear(hidden, act_dim),
        )
        self.critic = nn.Sequential(
            nn.Linear(obs_dim, hidden), nn.Tanh(),
            nn.Linear(hidden, hidden), nn.Tanh(),
            nn.Linear(hidden, 1),
        )
        # log_std — обучаемый параметр, не зависит от состояния
        self.log_std = nn.Parameter(torch.zeros(act_dim))

    def get_dist(self, obs):
        mu = self.actor(obs)
        std = self.log_std.exp()
        return Normal(mu, std)

    def act(self, obs):
        """Сэмплируем действие для сбора опыта."""
        dist = self.get_dist(obs)
        action = dist.sample()
        log_prob = dist.log_prob(action).sum(-1)
        value = self.critic(obs).squeeze(-1)
        return action, log_prob, value

    def evaluate(self, obs, actions):
        """Пересчитываем log_prob, V и H на батче — нужно для обновления."""
        dist = self.get_dist(obs)
        log_probs = dist.log_prob(actions).sum(-1)
        entropy   = dist.entropy().sum(-1)
        values    = self.critic(obs).squeeze(-1)
        return log_probs, entropy, values`}
          </CyberCodeBlock>

          <h3 className="text-lg font-bold text-foreground mt-6 mb-3">5.2. Цикл обновления PPO</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Ключевая особенность — <strong className="text-foreground">K эпох</strong> по одному и тому же батчу. После первой эпохи
            политика уже отличается от π_old — поэтому нам и нужен clipping.
          </p>
          <CyberCodeBlock language="python" filename="ppo_update.py">
{`def ppo_update(model, optimizer, buffer,
               clip=0.2, c1=0.5, c2=0.01,
               epochs=10, batch_size=64):
    """buffer содержит: obs, actions, old_log_probs, advantages, returns."""

    obs        = buffer['obs']
    actions    = buffer['actions']
    old_logp   = buffer['old_log_probs']
    advantages = buffer['advantages']
    returns    = buffer['returns']

    n = obs.size(0)
    indices = torch.arange(n)

    for _ in range(epochs):
        indices = indices[torch.randperm(n)]

        for start in range(0, n, batch_size):
            mb = indices[start:start + batch_size]

            new_logp, entropy, values = model.evaluate(obs[mb], actions[mb])

            # --- Actor loss (clipped surrogate) ---
            ratio = torch.exp(new_logp - old_logp[mb])
            surr1 = ratio * advantages[mb]
            surr2 = torch.clamp(ratio, 1 - clip, 1 + clip) * advantages[mb]
            actor_loss = -torch.min(surr1, surr2).mean()

            # --- Critic loss (MSE) ---
            critic_loss = (returns[mb] - values).pow(2).mean()

            # --- Entropy bonus ---
            entropy_bonus = entropy.mean()

            # --- Полный лосс PPO ---
            loss = actor_loss + c1 * critic_loss - c2 * entropy_bonus

            optimizer.zero_grad()
            loss.backward()
            # Клиппинг градиента — ещё один важный трюк стабильности
            nn.utils.clip_grad_norm_(model.parameters(), 0.5)
            optimizer.step()`}
          </CyberCodeBlock>

          <h3 className="text-lg font-bold text-foreground mt-6 mb-3">5.3. Главный цикл обучения</h3>
          <CyberCodeBlock language="python" filename="train.py">
{`model = ActorCritic(obs_dim=8, act_dim=2)
optimizer = torch.optim.Adam(model.parameters(), lr=3e-4)

ROLLOUT_STEPS = 2048

for iteration in range(1000):
    # 1. Собираем rollout текущей политикой
    buffer = collect_rollout(env, model, ROLLOUT_STEPS)

    # 2. Считаем advantages и returns через GAE
    advantages, returns = compute_gae(
        buffer['rewards'], buffer['values'],
        buffer['next_value'], buffer['dones']
    )
    buffer['advantages'] = advantages
    buffer['returns']    = returns

    # 3. K эпох обновления PPO на собранном батче
    ppo_update(model, optimizer, buffer)

    # 4. Логирование и сохранение чекпоинта
    if iteration % 10 == 0:
        log_metrics(buffer, iteration)`}
          </CyberCodeBlock>
        </section>

        {/* === Итоги === */}
        <section>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
            <CardContent className="p-5">
              <h3 className="font-bold text-primary mb-3">Итоги: чем PPO так хорош</h3>
              <ul className="list-disc ml-5 space-y-2 text-sm text-muted-foreground">
                <li><strong className="text-foreground">Простота.</strong> Никаких матриц Гессе и сопряжённых градиентов TRPO — только <code className="text-primary">min</code> и <code className="text-primary">clamp</code>.</li>
                <li><strong className="text-foreground">Sample efficiency.</strong> K эпох по одному батчу — мы выжимаем максимум из каждого собранного опыта.</li>
                <li><strong className="text-foreground">Стабильность.</strong> Clipping математически гарантирует, что политика не «улетит» далеко за один апдейт.</li>
                <li><strong className="text-foreground">Универсальность.</strong> Дискретные и непрерывные действия, из коробки в Unity ML-Agents, RLHF, OpenAI Five, ChatGPT.</li>
              </ul>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground italic mt-4">
            Рекомендуемая литература: Schulman et al. (2017) «Proximal Policy Optimization Algorithms» (arXiv:1707.06347),
            а также «The 37 Implementation Details of PPO» (Huang et al.) — все «грязные» инженерные нюансы, без которых PPO работает плохо.
          </p>
        </section>

        {/* === PPO vs DQN === */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">PPO vs DQN на CartPole</h2>
          <div className="overflow-x-auto rounded-lg border border-border/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-card/40">
                  <th className="text-left py-2 px-3 text-muted-foreground">Метрика</th>
                  <th className="text-left py-2 px-3 text-primary">DQN</th>
                  <th className="text-left py-2 px-3 text-secondary">PPO</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { m: "Конвергенция (reward>475)", dqn: "~300-400 эпизодов", ppo: "~200-300 эпизодов" },
                  { m: "Стабильность", dqn: "Средняя", ppo: "Высокая (clipping)" },
                  { m: "Replay Buffer", dqn: "Да (100K+)", ppo: "Нет (on-policy)" },
                  { m: "Простота кода", dqn: "~80 строк", ppo: "~120 строк" },
                  { m: "Непрерывные действия", dqn: "❌", ppo: "✅" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/20">
                    <td className="py-2 px-3 text-foreground">{row.m}</td>
                    <td className="py-2 px-3 text-muted-foreground">{row.dqn}</td>
                    <td className="py-2 px-3 text-muted-foreground">{row.ppo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quiz */}
        <Quiz title="Проверь себя: PPO" questions={quizQuestions} />
      </ProGate>
    </LessonLayout>
  );
};

export default CourseLesson2_2;
