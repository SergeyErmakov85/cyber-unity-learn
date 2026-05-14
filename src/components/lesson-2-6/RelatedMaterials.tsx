import { Card, CardContent } from "@/components/ui/card";
import { Link2, GraduationCap, Wrench, ExternalLink } from "lucide-react";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";

const HUBS: Array<{
  path: string;
  anchor?: string;
  title: string;
  label: string;
}> = [
  {
    path: "/pytorch/cheatsheet",
    anchor: "training",
    title: "PyTorch — шпаргалка",
    label: "PyTorch → Шпаргалка: training loop, логирование",
  },
  {
    path: "/unity-ml-agents",
    anchor: "training",
    title: "Unity ML-Agents — Обучение",
    label: "Unity ML-Agents → TensorBoard для tracking в ML-Agents",
  },
  {
    path: "/deep-rl",
    anchor: "practice",
    title: "Deep RL — Практика",
    label: "Deep RL → Практика: воспроизводимость, RLiable",
  },
  {
    path: "/algorithms/ppo",
    title: "PPO",
    label: "Алгоритмы → PPO: интерпретация approx_kl, clip_fraction, entropy",
  },
  {
    path: "/algorithms/sac",
    title: "SAC",
    label: "Алгоритмы → SAC: интерпретация Q-values и temperature",
  },
  {
    path: "/algorithms/dqn",
    title: "DQN",
    label: "Алгоритмы → DQN: overestimation bias и Double DQN",
  },
  {
    path: "/math-rl/module-4",
    title: "Математика — Модуль 4",
    label: "Математика → Модуль 4: статистика, доверительные интервалы, IQM",
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
    id: "1.4",
    path: "/courses/lesson-1-4",
    title: "DQN с нуля",
    level: 1,
    note: "Где Q-values впервые встречаются",
  },
  {
    id: "2.2",
    path: "/courses/lesson-2-2",
    title: "PPO с нуля",
    level: 2,
    note: "Где впервые встречаются approx_kl и clip_fraction",
  },
  {
    id: "2.3",
    path: "/courses/lesson-2-3",
    title: "Actor-Critic",
    level: 2,
    note: "Где впервые встречается explained_variance",
  },
  {
    id: "2.4",
    path: "/courses/lesson-2-4",
    title: "Reward Shaping",
    level: 2,
    note: "Про reward hacking из секции диагностики",
  },
  {
    id: "2.5",
    path: "/courses/lesson-2-5",
    title: "Параллельные среды",
    level: 2,
    note: "Про FPS и масштабирование",
  },
  {
    id: "3.5",
    path: "/courses/lesson-3-5",
    title: "Деплой: ONNX",
    level: 3,
    note: "Финальная стадия после успешного обучения",
  },
];

const EXTERNAL: Array<{ label: string; url: string }> = [
  {
    label: "TensorBoard PyTorch docs",
    url: "https://docs.pytorch.org/docs/stable/tensorboard.html",
  },
  { label: "Weights & Biases docs", url: "https://docs.wandb.ai" },
  {
    label: "SB3 TensorBoard guide",
    url: "https://stable-baselines3.readthedocs.io/en/master/guide/tensorboard.html",
  },
  {
    label: "W&B + SB3 integration",
    url: "https://docs.wandb.ai/models/integrations/stable-baselines-3",
  },
  {
    label: "RLiable (Agarwal et al., 2021)",
    url: "https://arxiv.org/abs/2108.13264",
  },
  {
    label: "Andy Jones, «Debugging RL»",
    url: "https://andyljones.com/posts/rl-debugging.html",
  },
  {
    label: "CleanRL PPO docs",
    url: "https://docs.cleanrl.dev/rl-algorithms/ppo/",
  },
];

const RelatedMaterials = () => (
  <section
    aria-label="Связанные материалы"
    className="mt-12 scroll-mt-24 py-10 px-6 md:px-8 bg-card/60 backdrop-blur-sm rounded-2xl border border-cyan-500/10"
  >
    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
      Связанные материалы
    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Hubs */}
      <Card className="bg-card/40 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-400/50 transition-colors">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-foreground">Хабы по теме</h3>
          </div>
          <ul className="space-y-2.5 text-sm">
            {HUBS.map((h) => (
              <li key={h.path + (h.anchor ?? "")} className="leading-snug">
                <CrossLinkToHub
                  hubPath={h.path}
                  hubAnchor={h.anchor}
                  hubTitle={h.title}
                >
                  {h.label}
                </CrossLinkToHub>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Lessons */}
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
                  <span
                    className={`ml-2 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                      l.level === 1
                        ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10"
                        : "border-amber-500/40 text-amber-300 bg-amber-500/10"
                    }`}
                  >
                    {l.level === 1 ? "🔓 FREE" : "🔒 PRO"}
                  </span>
                </CrossLinkToLesson>
                <div className="text-xs text-muted-foreground mt-0.5 ml-4">
                  {l.note}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* External */}
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
  </section>
);

export default RelatedMaterials;
