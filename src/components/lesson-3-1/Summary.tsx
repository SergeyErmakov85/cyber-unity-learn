import Math from "@/components/Math";
import { BookMarked } from "lucide-react";
import { SECTION_TITLE_CLASS, H3_CLASS } from "./_shared";

const SOURCES: Array<{ title: string; note: string }> = [
  {
    title:
      "Haarnoja, T., Zhou, A., Abbeel, P., Levine, S. (2018). Soft Actor-Critic: Off-Policy Maximum Entropy Deep Reinforcement Learning with a Stochastic Actor. ICML 2018. arXiv:1801.01290.",
    note: "макс-энтропийная цель, soft policy iteration, soft Q/V, reparameterization, squashed Gaussian (Прил. C), два критика, τ-обновление.",
  },
  {
    title:
      "Haarnoja, T., Zhou, A., Hartikainen, K., Tucker, G., Ha, S., Tan, J., Kumar, V., Zhu, H., Gupta, A., Abbeel, P., Levine, S. (2018). Soft Actor-Critic Algorithms and Applications. arXiv:1812.05905.",
    note: "автоподстройка температуры α (constrained-формулировка, двойственная задача, J(α)), отказ от отдельной V-сети, Algorithm 1.",
  },
  {
    title:
      "Haarnoja, T., Tang, H., Abbeel, P., Levine, S. (2017). Reinforcement Learning with Deep Energy-Based Policies (Soft Q-Learning). ICML 2017.",
    note: "политика Больцмана и истоки «soft».",
  },
  {
    title:
      "Fujimoto, S., van Hoof, H., Meger, D. (2018). Addressing Function Approximation Error in Actor-Critic Methods (TD3).",
    note: "трюк clipped double-Q.",
  },
  {
    title:
      "Unity Technologies. ML-Agents Toolkit — Training Configuration File и Training ML-Agents (версия 4.0).",
    note: "YAML-поля SAC, дефолты и типичные диапазоны: trainer_type, buffer_init_steps, tau, steps_per_update, init_entcoef, buffer_size, learning_rate_schedule и др.",
  },
];

const Summary = () => (
  <>
    <h2 className={SECTION_TITLE_CLASS}>Итоги урока</h2>

    <ul className="space-y-3 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong className="text-primary">Принцип максимальной энтропии:</strong> среди успешных
        политик выбирай наиболее случайную → исследование, устойчивость, многомодальность.
      </li>
      <li>
        <strong className="text-primary">Max-ent objective:</strong>{" "}
        <Math display={false}>{String.raw`J(\pi)=\sum_t\mathbb{E}[\,r+\alpha\mathcal{H}(\pi)\,]`}</Math>
        ; при <Math display={false}>{String.raw`\alpha\to 0`}</Math> возвращается обычный RL.
      </li>
      <li>
        <strong className="text-primary">Soft величины:</strong>{" "}
        <Math display={false}>{String.raw`V(s)=\mathbb{E}_{a\sim\pi}[Q-\alpha\log\pi]`}</Math>;
        soft-Беллман заменяет <Math display={false}>{String.raw`\max_{a'}`}</Math> на{" "}
        <Math display={false}>{String.raw`\mathbb{E}_{a'\sim\pi}`}</Math> + энтропия; «soft» =
        log-sum-exp вместо max.
      </li>
      <li>
        <strong className="text-primary">
          Два критика + target + <Math display={false}>{String.raw`\tau`}</Math>:
        </strong>{" "}
        clipped double-Q (<Math display={false}>{String.raw`\min`}</Math> из двух) гасит переоценку;
        target-сети ползут по{" "}
        <Math display={false}>{String.raw`\bar\theta\leftarrow\tau\theta+(1-\tau)\bar\theta`}</Math>.
      </li>
      <li>
        <strong className="text-primary">Reparameterization trick:</strong>{" "}
        <Math display={false}>{String.raw`a=\tanh(\mu_\phi(s)+\sigma_\phi(s)\odot\epsilon)`}</Math> →
        градиент течёт через сэмпл; нужна поправка на{" "}
        <Math display={false}>{String.raw`\tanh`}</Math>.
      </li>
      <li>
        <strong className="text-primary">
          Автоподстройка <Math display={false}>{String.raw`\alpha`}</Math>:
        </strong>{" "}
        двойственная переменная при ограничении на энтропию;{" "}
        <Math display={false}>{String.raw`J(\alpha)=\mathbb{E}[-\alpha\log\pi-\alpha\bar{\mathcal{H}}]`}</Math>
        , порог <Math display={false}>{String.raw`\bar{\mathcal{H}}=-\dim(\mathcal{A})`}</Math>.
      </li>
      <li>
        <strong className="text-primary">Off-policy + replay buffer:</strong> переиспользование опыта
        → экономия данных.
      </li>
      <li>
        <strong className="text-primary">SAC vs PPO:</strong> SAC экономнее по данным и лучше
        исследует; PPO проще, надёжнее, универсальнее.
      </li>
      <li>
        <strong className="text-primary">Unity ML-Agents:</strong>{" "}
        <code className="px-1 rounded bg-muted/50 text-xs font-mono">trainer_type: sac</code>,{" "}
        <code className="px-1 rounded bg-muted/50 text-xs font-mono">init_entcoef</code> = стартовая
        температура (далее автоподстройка), для непрерывного управления —{" "}
        <code className="px-1 rounded bg-muted/50 text-xs font-mono">normalize</code>, крупный буфер,{" "}
        <code className="px-1 rounded bg-muted/50 text-xs font-mono">constant</code> lr,{" "}
        <code className="px-1 rounded bg-muted/50 text-xs font-mono">threaded</code>.
      </li>
    </ul>

    {/* Источники */}
    <h3 className={H3_CLASS}>
      <span className="inline-flex items-center gap-2">
        <BookMarked className="w-5 h-5 text-cyan-400" /> Источники
      </span>
    </h3>
    <ol className="space-y-3 list-decimal list-inside text-sm text-foreground/85 leading-relaxed">
      {SOURCES.map((s) => (
        <li key={s.title}>
          <strong className="text-foreground/90">{s.title}</strong>{" "}
          <span className="text-muted-foreground">— {s.note}</span>
        </li>
      ))}
    </ol>

    {/* Служебное — карта кросс-ссылок */}
    <details className="mt-8 rounded-xl border border-border/40 bg-card/40 p-4">
      <summary className="cursor-pointer text-sm font-semibold text-muted-foreground hover:text-foreground">
        Служебное (для сопровождающих): карта кросс-ссылок
      </summary>
      <div className="mt-4 space-y-4 text-xs text-muted-foreground leading-relaxed">
        <p>
          Исходящие ссылки (урок → хаб) реализованы через{" "}
          <code className="px-1 rounded bg-muted/50 font-mono">CrossLinkToHub</code> в разделах 1, 2,
          3, 4, 6, 7, 8, 11, 12 и в разделах 0/13 (гоночный агент). Заголовки разделов несут
          устойчивые <code className="px-1 rounded bg-muted/50 font-mono">id</code>-якоря, на которые
          хабы ссылаются обратно (Wikipedia-стиль):
        </p>
        <ul className="space-y-1 font-mono">
          <li>#раздел-1-принцип-максимальной-энтропии-зачем-агенту-быть-случайным</li>
          <li>#раздел-2-maximum-entropy-rl-objective</li>
          <li>#раздел-3-soft-q-функция-soft-value-function-и-soft-уравнение-беллмана</li>
          <li>#раздел-5-два-q-критика-clipped-double-q-и-target-сети</li>
          <li>#раздел-6-reparameterization-trick-для-стохастической-политики</li>
          <li>#раздел-7-автоматическая-подстройка-температуры-alpha</li>
          <li>#раздел-12-sac-в-unity-ml-agents</li>
        </ul>
      </div>
    </details>
  </>
);

export default Summary;
