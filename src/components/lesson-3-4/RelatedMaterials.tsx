import { type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link2, GraduationCap, Wrench, ExternalLink, BookMarked } from "lucide-react";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { MONETIZATION_ENABLED } from "@/config/monetization";

const HUBS: Array<{ path: string; anchor?: string; title: string; label: string }> = [
  { path: "/algorithms/ppo", title: "PPO", label: "Алгоритмы → PPO: основа политики, поверх которой работает GAIL" },
  {
    path: "/math-rl/module-3",
    title: "Математика — Вероятность и информация",
    label: "Математика → Кросс-энтропия, KL, JS-дивергенция (база BC и GAIL)",
  },
  {
    path: "/math-rl/module-4",
    anchor: "policy-gradient",
    title: "Математика — Градиент политики",
    label: "Математика → Градиент политики: как GAIL подставляет r=-log(1-D)",
  },
  {
    path: "/deep-rl",
    anchor: "imitation",
    title: "Deep RL — Imitation Learning",
    label: "Deep RL → BC/GAIL/AIRL: формальные определения и доказательства",
  },
  {
    path: "/unity-ml-agents",
    anchor: "training",
    title: "Unity ML-Agents — Training",
    label: "Unity ML-Agents → reward_signals, behavioral_cloning, Demonstration Recorder",
  },
];

const LESSONS: Array<{
  id: string;
  path: string;
  title: string;
  level: 1 | 2 | 3;
  note: string;
}> = [
  {
    id: "3.3",
    path: "/courses/3-3",
    title: "Учебный план и рандомизация среды",
    level: 3,
    note: "domain randomization, на которую кладётся GAIL",
  },
  {
    id: "3.1",
    path: "/courses/3-1",
    title: "SAC / PPO",
    level: 3,
    note: "PPO как несущий тренер под BC и GAIL",
  },
  {
    id: "2.6",
    path: "/courses/2-6",
    title: "TensorBoard и W&B",
    level: 2,
    note: "диагностика GAIL-метрик и pretraining loss",
  },
  {
    id: "project-3",
    path: "/courses/project-3",
    title: "Гоночный агент на PPO",
    level: 3,
    note: "сквозной пример урока",
  },
];

const EXTERNAL: Array<{ label: string; url: string }> = [
  { label: "Ho & Ermon (2016) — GAIL, arXiv:1606.03476", url: "https://arxiv.org/abs/1606.03476" },
  { label: "Ross & Bagnell (2010) — Efficient Reductions for IL (теорема T²ε)", url: "https://proceedings.mlr.press/v9/ross10a.html" },
  { label: "Ross, Gordon, Bagnell (2011) — DAgger, arXiv:1011.0686", url: "https://arxiv.org/abs/1011.0686" },
  { label: "Fu, Luo, Levine (2018) — AIRL, arXiv:1710.11248", url: "https://arxiv.org/abs/1710.11248" },
  { label: "Kostrikov и др. (2019) — Discriminator-Actor-Critic, arXiv:1809.02925", url: "https://arxiv.org/abs/1809.02925" },
  {
    label: "Unity ML-Agents 4.0 — Training Configuration File (GAIL/BC)",
    url: "https://github.com/Unity-Technologies/ml-agents/blob/main/docs/Training-Configuration-File.md",
  },
  {
    label: "Unity ML-Agents 4.0 — Using TensorBoard (GAIL метрики)",
    url: "https://docs.unity3d.com/Packages/com.unity.ml-agents@4.0/manual/Using-Tensorboard.html",
  },
  {
    label: "Unity ML-Agents — Recording Demonstrations",
    url: "https://github.com/Unity-Technologies/ml-agents/blob/main/docs/Learning-Environment-Design-Agents.md",
  },
];

const SOURCES: ReactNode[] = [
  <>
    <strong className="text-foreground/90">Ho, J., &amp; Ermon, S. (2016).</strong>{" "}
    <em>Generative Adversarial Imitation Learning.</em> NeurIPS 2016. arXiv:1606.03476. — Lemma 3.1,
    Proposition 3.1/3.2, Eq. 13–14, Algorithm 1; ядро урока.
  </>,
  <>
    <strong className="text-foreground/90">Ross, S., &amp; Bagnell, J. A. (2010).</strong>{" "}
    <em>Efficient Reductions for Imitation Learning.</em> AISTATS 2010. — Теорема 2.1, граница{" "}
    <code className="px-1 rounded bg-muted/50 text-xs font-mono">J(π) ≤ J(π*) + T²ε</code>.
  </>,
  <>
    <strong className="text-foreground/90">Ross, S., Gordon, G. J., &amp; Bagnell, J. A. (2011).</strong>{" "}
    <em>A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning.</em>{" "}
    AISTATS 2011. arXiv:1011.0686 — DAgger, линейная по{" "}
    <code className="px-1 rounded bg-muted/50 text-xs font-mono">T</code> граница.
  </>,
  <>
    <strong className="text-foreground/90">Ziebart, B. D., Maas, A., Bagnell, J. A., &amp; Dey, A. K. (2008).</strong>{" "}
    <em>Maximum Entropy Inverse Reinforcement Learning.</em> AAAI 2008. — Max-entropy IRL и partition
    function.
  </>,
  <>
    <strong className="text-foreground/90">Fu, J., Luo, K., &amp; Levine, S. (2018).</strong>{" "}
    <em>Learning Robust Rewards with Adversarial Inverse Reinforcement Learning (AIRL).</em> ICLR
    2018. arXiv:1710.11248 — disentangled reward, инвариантный к dynamics shift.
  </>,
  <>
    <strong className="text-foreground/90">Goodfellow, I. и др. (2014).</strong>{" "}
    <em>Generative Adversarial Nets.</em> NeurIPS 2014. arXiv:1406.2661 — теоретическая база
    GAN-минимакса, к которому сводится GAIL.
  </>,
  <>
    <strong className="text-foreground/90">Kostrikov, I. и др. (2019).</strong>{" "}
    <em>Discriminator-Actor-Critic.</em> ICLR 2019. arXiv:1809.02925 — оценки сэмпл-эффективности
    GAIL.
  </>,
  <>
    <strong className="text-foreground/90">Peng, X. B. и др. (2019);</strong>{" "}
    <strong className="text-foreground/90">Zhang и др. (2020).</strong>{" "}
    <em>VAIL</em> (arXiv:1810.00821); <em>f-GAIL</em> (arXiv:2010.01207).
  </>,
  <>
    <strong className="text-foreground/90">Документация:</strong> Unity ML-Agents{" "}
    <em>Training Configuration File</em> и <em>Using TensorBoard</em> (Release 22,{" "}
    <code className="px-1 rounded bg-muted/50 text-xs font-mono">com.unity.ml-agents@4.0</code>):
    секции GAIL Intrinsic Reward, Behavioral Cloning, метрики Policy/GAIL …, Losses/GAIL Loss; ML-Agents
    Overview — survivor bias GAIL; <em>Learning-Environment-Design-Agents</em> —{" "}
    <code className="px-1 rounded bg-muted/50 text-xs font-mono">Demonstration Recorder</code>,
    формат <code className="px-1 rounded bg-muted/50 text-xs font-mono">.demo</code>.
  </>,
];

const RelatedMaterials = () => (
  <section
    id="istochniki"
    aria-label="Источники и связанные материалы"
    className="mt-12 scroll-mt-24 py-10 px-6 md:px-8 bg-card/60 backdrop-blur-sm rounded-2xl border border-cyan-500/10"
  >
    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
      Источники и связанные материалы
    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Card className="bg-card/40 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-400/50 transition-colors">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-foreground">Хабы по теме</h3>
          </div>
          <ul className="space-y-2.5 text-sm">
            {HUBS.map((h) => (
              <li key={h.path + (h.anchor ?? "")} className="leading-snug">
                <CrossLinkToHub hubPath={h.path} hubAnchor={h.anchor} hubTitle={h.title}>
                  {h.label}
                </CrossLinkToHub>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-card/40 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/50 transition-colors">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-foreground">Связанные уроки</h3>
          </div>
          <ul className="space-y-3 text-sm">
            {LESSONS.map((l) => (
              <li key={l.id} className="leading-snug">
                <CrossLinkToLesson
                  lessonId={l.id}
                  lessonPath={l.path}
                  lessonTitle={l.title}
                  lessonLevel={l.level}
                >
                  <span className="font-semibold">{l.id}</span>
                  <span className="ml-1">— {l.title}</span>
                  {MONETIZATION_ENABLED && (
                    <span
                      className={`ml-2 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                        l.level === 1
                          ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10"
                          : "border-amber-500/40 text-amber-300 bg-amber-500/10"
                      }`}
                    >
                      {l.level === 1 ? "🔓 FREE" : "🔒 PRO"}
                    </span>
                  )}
                </CrossLinkToLesson>
                <div className="text-xs text-muted-foreground mt-0.5 ml-4">{l.note}</div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-card/40 backdrop-blur-sm border-pink-500/20 hover:border-pink-400/50 transition-colors">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-pink-400" />
            <h3 className="font-bold text-foreground">Внешние ресурсы</h3>
          </div>
          <ul className="space-y-2 text-sm">
            {EXTERNAL.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1.5 text-cyan-300 hover:text-cyan-200 hover:underline transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>{r.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>

    <h3 className="mt-10 mb-4 text-xl font-bold text-foreground">
      <span className="inline-flex items-center gap-2">
        <BookMarked className="w-5 h-5 text-cyan-400" /> Источники
      </span>
    </h3>
    <ol className="space-y-3 list-decimal list-inside text-sm text-foreground/85 leading-relaxed">
      {SOURCES.map((s, i) => (
        <li key={i}>{s}</li>
      ))}
    </ol>
  </section>
);

export default RelatedMaterials;
