import BlogLayout from "@/components/BlogLayout";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { blogPosts } from "@/pages/Blog";
import LabPracticeSection from "@/components/LabPracticeSection";

const post = blogPosts.find((p) => p.slug === "reinforce-vs-ppo")!;

const toc = [
  { id: "table", title: "Таблица сравнения" },
  { id: "when-reinforce", title: "Когда REINFORCE достаточно" },
  { id: "when-ppo", title: "Когда нужен PPO" },
  { id: "code", title: "Код: REINFORCE vs PPO" },
  { id: "conclusion", title: "Заключение" },
];

const BlogReinforceVsPpo = () => (
  <BlogLayout post={post} toc={toc}>
    <section id="table">
      <h2 className="text-2xl font-bold text-foreground mb-3">Таблица сравнения</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-border/50 rounded-lg overflow-hidden">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-3 text-foreground font-semibold">Критерий</th>
              <th className="text-left p-3 text-primary font-semibold">REINFORCE</th>
              <th className="text-left p-3 text-secondary font-semibold">PPO</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            <tr><td className="p-3 text-muted-foreground">Sample Efficiency</td><td className="p-3 text-muted-foreground">★★☆☆☆</td><td className="p-3 text-muted-foreground">★★★☆☆</td></tr>
            <tr><td className="p-3 text-muted-foreground">Стабильность</td><td className="p-3 text-muted-foreground">★★☆☆☆</td><td className="p-3 text-green-400">★★★★★</td></tr>
            <tr><td className="p-3 text-muted-foreground">Простота кода</td><td className="p-3 text-green-400">~20 строк</td><td className="p-3 text-muted-foreground">~40+ строк</td></tr>
            <tr><td className="p-3 text-muted-foreground">Use case</td><td className="p-3 text-muted-foreground">Простые среды</td><td className="p-3 text-green-400">Сложные среды</td></tr>
            <tr><td className="p-3 text-muted-foreground">Гиперпараметры</td><td className="p-3 text-green-400">2-3</td><td className="p-3 text-muted-foreground">5-8</td></tr>
            <tr><td className="p-3 text-muted-foreground">On/Off-policy</td><td className="p-3 text-muted-foreground">On-policy</td><td className="p-3 text-muted-foreground">On-policy</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="when-reinforce">
      <h2 className="text-2xl font-bold text-foreground mb-3">Когда REINFORCE достаточно</h2>
      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-primary">REINFORCE</strong> — это базовый policy gradient алгоритм,
        и он отлично подходит в нескольких сценариях:
      </p>
      <ul className="mt-3 space-y-2 text-muted-foreground">
        <li className="flex items-start gap-2">
          <span className="text-primary mt-1">•</span>
          <span><strong className="text-foreground">Небольшие среды</strong> — Taxi-v3, CartPole, FrozenLake. Когда пространство состояний и действий невелико, REINFORCE сходится за разумное время.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary mt-1">•</span>
          <span><strong className="text-foreground">Дискретные действия</strong> — REINFORCE с softmax policy прост и эффективен для задач с 4-10 действиями.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary mt-1">•</span>
          <span><strong className="text-foreground">Исследовательские задачи</strong> — когда важна простота кода для экспериментов, а не production-качество.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-primary mt-1">•</span>
          <span><strong className="text-foreground">Обучение</strong> — REINFORCE идеален для первого знакомства с policy gradient, потому что его можно объяснить за 10 минут.</span>
        </li>
      </ul>
    </section>

    <section id="when-ppo">
      <h2 className="text-2xl font-bold text-foreground mb-3">Когда нужен PPO</h2>
      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-secondary">PPO</strong> необходим, когда REINFORCE начинает «буксовать»:
      </p>
      <ul className="mt-3 space-y-2 text-muted-foreground">
        <li className="flex items-start gap-2">
          <span className="text-secondary mt-1">•</span>
          <span><strong className="text-foreground">Сложные непрерывные среды</strong> — 3D-навигация, робототехника, BallBalance. Высокая дисперсия градиентов REINFORCE делает обучение нестабильным.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-secondary mt-1">•</span>
          <span><strong className="text-foreground">Длинные эпизоды</strong> — при горизонте &gt;500 шагов дисперсия return в REINFORCE становится катастрофической. PPO с GAE решает эту проблему.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-secondary mt-1">•</span>
          <span><strong className="text-foreground">Production-проекты</strong> — PPO предсказуем, хорошо масштабируется с параллельными средами и имеет обширную документацию.</span>
        </li>
      </ul>
    </section>

    <section id="code">
      <h2 className="text-2xl font-bold text-foreground mb-3">Код: REINFORCE vs PPO</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Сравните минимальные реализации. REINFORCE — 20 строк ядра, PPO — вдвое больше,
        но с clipping для стабильности.
      </p>
      <CyberCodeBlock language="python" filename="reinforce_minimal.py">
{`# REINFORCE — минимальная реализация (~20 строк ядра)
import torch
import torch.nn.functional as F

def reinforce_update(policy, optimizer, rewards, log_probs, gamma=0.99):
    # 1. Вычислить discounted returns
    returns = []
    G = 0
    for r in reversed(rewards):
        G = r + gamma * G
        returns.insert(0, G)
    returns = torch.tensor(returns)
    returns = (returns - returns.mean()) / (returns.std() + 1e-8)

    # 2. Policy gradient loss
    loss = []
    for log_prob, G in zip(log_probs, returns):
        loss.append(-log_prob * G)
    loss = torch.stack(loss).sum()

    # 3. Update
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    return loss.item()`}
      </CyberCodeBlock>

      <CyberCodeBlock language="python" filename="ppo_minimal.py">
{`# PPO — минимальная реализация (~40 строк ядра)
import torch
import torch.nn as nn

def ppo_update(model, optimizer, obs, actions, old_log_probs,
               advantages, returns, clip_eps=0.2, epochs=4):
    for _ in range(epochs):
        dist, values = model(obs)
        new_log_probs = dist.log_prob(actions)
        entropy = dist.entropy().mean()

        # Clipped surrogate objective
        ratio = torch.exp(new_log_probs - old_log_probs)
        surr1 = ratio * advantages
        surr2 = torch.clamp(ratio, 1-clip_eps, 1+clip_eps) * advantages
        actor_loss  = -torch.min(surr1, surr2).mean()

        # Value loss
        critic_loss = nn.functional.mse_loss(values, returns)

        # Total loss
        loss = actor_loss + 0.5 * critic_loss - 0.01 * entropy

        optimizer.zero_grad()
        loss.backward()
        nn.utils.clip_grad_norm_(model.parameters(), 0.5)
        optimizer.step()

    return actor_loss.item(), critic_loss.item()`}
      </CyberCodeBlock>
    </section>

    <section id="conclusion">
      <h2 className="text-2xl font-bold text-foreground mb-3">Заключение</h2>
      <p className="text-muted-foreground leading-relaxed">
        Не используйте PPO там, где достаточно REINFORCE. Для CartPole, Taxi-v3 и подобных сред
        REINFORCE сойдётся за минуты и даст вам чистый, понятный код. Но как только среда
        усложняется — непрерывные действия, 3D-пространство, длинные эпизоды — переходите на PPO.
        Это не вопрос «лучше/хуже», а вопрос инструмента под задачу.
      </p>
    </section>
  {/* Практика: собранная среда лаборатории для этой темы. */}
  <LabPracticeSection contextKey="/blog/reinforce-vs-ppo" />

  </BlogLayout>
);

export default BlogReinforceVsPpo;
