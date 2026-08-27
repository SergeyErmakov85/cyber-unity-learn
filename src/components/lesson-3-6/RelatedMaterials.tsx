import { type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link2, GraduationCap, Wrench, ExternalLink, BookMarked } from "lucide-react";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { MONETIZATION_ENABLED } from "@/config/monetization";

const HUBS: Array<{ path: string; anchor?: string; title: string; label: string }> = [
  {
    path: "/algorithms/ppo",
    title: "Алгоритмы → PPO",
    label: "PPO — формальный разбор алгоритма и его гиперпараметров",
  },
  {
    path: "/unity-ml-agents",
    anchor: "yaml-config",
    title: "Unity ML-Agents — YAML-конфиг",
    label: "Unity ML-Agents → YAML-конфигурация (полная схема полей и дефолтов)",
  },
  {
    path: "/math-rl/module-3",
    anchor: "байесовская-оптимизация",
    title: "Теорвер и информация — байесовская оптимизация",
    label: "Math RL → теорвер и информация (Байес, KDE, EI, TPE)",
  },
  {
    path: "/deep-rl",
    anchor: "бандиты-и-прунинг",
    title: "Deep RL — бандиты и прунинг",
    label: "Deep RL → бандитская теория и прунинг (SHA/ASHA/Hyperband)",
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
    id: "3.1",
    path: "/courses/3-1",
    title: "SAC / PPO",
    level: 3,
    note: "переиспользуются гиперпараметры PPO",
  },
  {
    id: "2.6",
    path: "/courses/2-6",
    title: "TensorBoard и W&B",
    level: 2,
    note: "переиспользуется W&B-логирование",
  },
  {
    id: "3.2",
    path: "/courses/3-2",
    title: "MA-POCA и Self-Play",
    level: 3,
    note: "переиспользуется ELO как метрика",
  },
  {
    id: "3.3",
    path: "/courses/3-3",
    title: "Curriculum & Domain Randomization",
    level: 3,
    note: "переиспользуются диапазоны DR",
  },
  {
    id: "3.4",
    path: "/courses/3-4",
    title: "Imitation Learning: BC + GAIL",
    level: 3,
    note: "переиспользуется gail: strength",
  },
  {
    id: "project-3",
    path: "/courses/project-3",
    title: "Гоночный агент на PPO",
    level: 3,
    note: "сквозной пример; вход для финальной сборки",
  },
];

const EXTERNAL: Array<{ label: string; url: string }> = [
  { label: "Akiba et al. (2019). Optuna: A Next-generation Hyperparameter Optimization Framework. arXiv:1907.10902", url: "https://arxiv.org/abs/1907.10902" },
  { label: "Bergstra et al. (2011). Algorithms for Hyper-Parameter Optimization (TPE). NeurIPS 2011", url: "https://papers.nips.cc/paper/4443-algorithms-for-hyper-parameter-optimization" },
  { label: "Bergstra & Bengio (2012). Random Search for Hyper-Parameter Optimization. JMLR 13", url: "https://www.jmlr.org/papers/v13/bergstra12a.html" },
  { label: "Optuna Documentation", url: "https://optuna.readthedocs.io/" },
  { label: "Weights & Biases — Sweeps Documentation", url: "https://docs.wandb.ai/guides/sweeps/" },
  { label: "Unity ML-Agents — Training Configuration File", url: "https://github.com/Unity-Technologies/ml-agents/blob/main/docs/Training-Configuration-File.md" },
];

const SOURCES: ReactNode[] = [
  <><strong>Akiba, Sano, Yanase, Ohta, Koyama (2019).</strong> <em>Optuna: A Next-generation Hyperparameter Optimization Framework.</em> KDD 2019. arXiv:1907.10902. — Взято: define-by-run API, архитектура study/trial, Algorithm 1 (прунинг на основе Successive Halving / ASHA), результаты по прунингу.</>,
  <><strong>Bergstra, Bardenet, Bengio, Kégl (2011).</strong> <em>Algorithms for Hyper-Parameter Optimization.</em> NeurIPS 2011. — Взято: вывод TPE, плотности ℓ(λ)/g(λ), формула EI ∝ (γ + g/ℓ(1−γ))⁻¹, дефолт γ.</>,
  <><strong>Bergstra, Bengio (2012).</strong> <em>Random Search for Hyper-Parameter Optimization.</em> JMLR 13. — Взято: низкая эффективная размерность, превосходство random над grid, тезис о baseline.</>,
  <><strong>Li, Jamieson, DeSalvo, Rostamizadeh, Talwalkar (2018).</strong> <em>Hyperband: A Novel Bandit-Based Approach to Hyperparameter Optimization.</em> JMLR 18(185). — Взято: брекеты SHA, компромисс n vs B/n, формула числа брекетов.</>,
  <><strong>Li et al. (2018/2020).</strong> <em>A System for Massively Parallel Hyperparameter Tuning (ASHA).</em> arXiv:1810.05934. — Взято: асинхронный SHA, линейное масштабирование по воркерам.</>,
  <><strong>Optuna Docs (4.x).</strong> TPESampler, MedianPruner, SuccessiveHalvingPruner, HyperbandPruner, Trial.report / should_prune. — Взято: имена и дефолты параметров (n_startup_trials=10 у TPE и т.д.).</>,
  <><strong>Optuna-Integration Docs.</strong> optuna_integration.wandb.WeightsAndBiasesCallback. — Взято: связка Optuna ↔ W&B, актуальный путь импорта (пакет optuna-integration).</>,
  <><strong>Weights &amp; Biases Docs — Sweeps.</strong> Sweep configuration keys: method (grid/random/bayes), metric, parameters, early_terminate: hyperband. — Взято: декларативный конфиг W&B Sweeps.</>,
  <><strong>Unity ML-Agents Toolkit Docs (Release 22 / com.unity.ml-agents 4.0.x).</strong> Training-Configuration-File, Training-ML-Agents. — Взято: дефолты PPO (batch_size=1024, buffer_size=10240, learning_rate=3.0e-4, beta=5.0e-3, epsilon=0.2, lambd=0.95, num_epoch=3, network_settings), удаление encoding_size.</>,
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
