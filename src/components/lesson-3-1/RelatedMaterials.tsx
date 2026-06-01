import { Card, CardContent } from "@/components/ui/card";
import { Link2, GraduationCap, Wrench, ExternalLink } from "lucide-react";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";

const HUBS: Array<{ path: string; anchor?: string; title: string; label: string }> = [
  {
    path: "/algorithms/sac",
    anchor: "entropy",
    title: "SAC — Максимальная энтропия",
    label: "Алгоритмы → SAC: энтропия, политика Больцмана, температура α",
  },
  {
    path: "/algorithms/ppo",
    title: "PPO",
    label: "Алгоритмы → PPO: энтропийная регуляризация (beta) и сравнение",
  },
  {
    path: "/math-rl/module-5",
    anchor: "глава-5",
    title: "Математика — Уравнения Беллмана",
    label: "Математика → Глава 5: обычное и soft уравнение Беллмана",
  },
  {
    path: "/math-rl/module-4",
    anchor: "лекция-2-вывод-градиента-политики",
    title: "Математика — Градиент политики",
    label: "Математика → Вывод градиента: reparameterization vs likelihood-ratio",
  },
  {
    path: "/deep-rl",
    anchor: "algorithms",
    title: "Deep RL — Алгоритмы",
    label: "Deep RL → On-policy vs Off-policy, семейство actor-critic",
  },
  {
    path: "/unity-ml-agents",
    anchor: "training",
    title: "Unity ML-Agents — Обучение",
    label: "Unity ML-Agents → YAML-конфиг SAC и запуск обучения",
  },
];

const LESSONS: Array<{ id: string; path: string; title: string; level: 1 | 2 | 3; note: string }> = [
  {
    id: "2.6",
    path: "/courses/2-6",
    title: "TensorBoard и W&B",
    level: 2,
    note: "Диагностика обучения: энтропия, reward, loss",
  },
  {
    id: "2.3",
    path: "/courses/2-3",
    title: "Непрерывные действия и Actor-Critic",
    level: 2,
    note: "Gaussian-политика — основа squashed Gaussian SAC",
  },
  {
    id: "project-3",
    path: "/courses/project-3",
    title: "Проект: Гоночный агент",
    level: 2,
    note: "Та же задача на PPO — отправная точка для SAC",
  },
  {
    id: "3.2",
    path: "/courses/3-2",
    title: "MA-POCA и Self-Play",
    level: 3,
    note: "Следующий урок продвинутого раздела",
  },
];

const EXTERNAL: Array<{ label: string; url: string }> = [
  { label: "SAC (Haarnoja et al., 2018) — arXiv:1801.01290", url: "https://arxiv.org/abs/1801.01290" },
  {
    label: "SAC Algorithms and Applications — arXiv:1812.05905",
    url: "https://arxiv.org/abs/1812.05905",
  },
  { label: "Soft Q-Learning — arXiv:1702.08165", url: "https://arxiv.org/abs/1702.08165" },
  { label: "TD3 (Fujimoto et al., 2018) — arXiv:1802.09477", url: "https://arxiv.org/abs/1802.09477" },
  {
    label: "Unity ML-Agents — Training Configuration",
    url: "https://unity-technologies.github.io/ml-agents/Training-Configuration-File/",
  },
  { label: "Spinning Up — SAC", url: "https://spinningup.openai.com/en/latest/algorithms/sac.html" },
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
  </section>
);

export default RelatedMaterials;
