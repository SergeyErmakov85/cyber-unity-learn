import { type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link2, GraduationCap, Wrench, ExternalLink, BookMarked } from "lucide-react";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";

const HUBS: Array<{ path: string; anchor?: string; title: string; label: string }> = [
  { path: "/deep-rl", title: "Deep RL", label: "Deep RL — LSTM, внимание, MARL/CTDE (формальный разбор)" },
  { path: "/unity-ml-agents", anchor: "yaml-config", title: "Unity ML-Agents — YAML", label: "Unity ML-Agents → network_settings и YAML-конфиг" },
  { path: "/algorithms/ppo", title: "Алгоритмы → PPO", label: "PPO — алгоритм и связь с архитектурой (shared_critic)" },
  { path: "/math-rl/module-5", title: "Math RL — Фундамент RL", label: "Math RL → Беллман и марковость (нарушается в POMDP)" },
];

const LESSONS: Array<{ id: string; path: string; title: string; level: 1 | 2 | 3; note: string }> = [
  { id: "3.2", path: "/courses/3-2", title: "MA-POCA и Self-Play", level: 3, note: "self-attention переиспользуется как энкодер" },
  { id: "3.1", path: "/courses/3-1", title: "SAC / PPO", level: 3, note: "actor–critic, π/V" },
  { id: "3.4", path: "/courses/3-4", title: "Imitation Learning: BC + GAIL", level: 3, note: "кодирование демонстраций" },
  { id: "project-3", path: "/courses/project-3", title: "Гоночный агент на PPO", level: 3, note: "сквозной пример — все решения этого урока" },
];

const EXTERNAL: Array<{ label: string; url: string }> = [
  { label: "Chen et al. (2021). Decision Transformer: Reinforcement Learning via Sequence Modeling. arXiv:2106.01345", url: "https://arxiv.org/abs/2106.01345" },
  { label: "Espeholt et al. (2018). IMPALA: Scalable Distributed Deep-RL. arXiv:1802.01561", url: "https://arxiv.org/abs/1802.01561" },
  { label: "Mnih et al. (2015). Human-level control through deep reinforcement learning. Nature 518", url: "https://www.nature.com/articles/nature14236" },
  { label: "Vaswani et al. (2017). Attention Is All You Need. arXiv:1706.03762", url: "https://arxiv.org/abs/1706.03762" },
  { label: "Unity ML-Agents — Training Configuration File", url: "https://github.com/Unity-Technologies/ml-agents/blob/main/docs/Training-Configuration-File.md" },
];

const SOURCES: ReactNode[] = [
  <><strong>Mnih V. и др.</strong> «Human-level control through deep reinforcement learning», <em>Nature</em> 518 (2015) — взято: архитектура <code>nature_cnn</code> (Conv 32×8×8/s4 → 64×4×4/s2 → 64×3×3/s1 → FC 512), кадровый стек 84×84×4.</>,
  <><strong>Espeholt L. и др.</strong> «IMPALA: Scalable Distributed Deep-RL…», arXiv:1802.01561 (2018) — взято: ResNet-энкодер (<code>resnet</code> в ML-Agents), остаточные блоки.</>,
  <><strong>Chen L. и др.</strong> «Decision Transformer: Reinforcement Learning via Sequence Modeling», arXiv:2106.01345, NeurIPS 2021 — взято: представление траектории, return-to-go, causal-трансформер.</>,
  <><strong>Hochreiter S., Schmidhuber J.</strong> «Long Short-Term Memory» (1997) — взято: рекуррентная память, скрытое состояние.</>,
  <><strong>Vaswani A. и др.</strong> «Attention Is All You Need», arXiv:1706.03762 (2017) — взято: формула scaled dot-product attention (механика — в уроке 3.2 / хабе).</>,
  <><strong>Unity ML-Agents Toolkit</strong>, документация Training Configuration File, <code>com.unity.ml-agents</code> 4.0.x — взято: поля <code>network_settings</code>, <code>memory</code>, <code>vis_encode_type</code>, <code>shared_critic</code>, <code>goal_conditioning_type</code> с дефолтами и диапазонами.</>,
];

const RelatedMaterials = () => (
  <section
    id="источники"
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
