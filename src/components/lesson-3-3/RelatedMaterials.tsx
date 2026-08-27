import { type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link2, GraduationCap, Wrench, ExternalLink, BookMarked } from "lucide-react";
import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { MONETIZATION_ENABLED } from "@/config/monetization";

const HUBS: Array<{ path: string; anchor?: string; title: string; label: string }> = [
  { path: "/algorithms/ppo", title: "PPO", label: "Алгоритмы → PPO: преимущество/GAE — база для |Â_t|" },
  {
    path: "/math-rl/module-4",
    anchor: "policy-gradient",
    title: "Математика — Градиент политики",
    label: "Математика → Градиент политики: почему нулевой при разрежённой награде",
  },
  {
    path: "/math-rl/module-1",
    anchor: "discounting",
    title: "Математика — Дисконтирование",
    label: "Математика → Дисконтирование: отдача и дисконт γ",
  },
  {
    path: "/math-rl/module-3",
    anchor: "entropy",
    title: "Математика — Теория вероятностей и информации",
    label: "Математика → Энтропия и распределения (ADR-энтропия)",
  },
  {
    path: "/math-rl/module-5",
    title: "Математика — Уравнения Беллмана",
    label: "Математика → Уравнения Беллмана: функции ценности V/Q",
  },
  {
    path: "/deep-rl",
    anchor: "generalization",
    title: "Deep RL — Обобщение / MARL-CTDE",
    label: "Deep RL → Обобщение, контекстный MDP, MARL/CTDE",
  },
  {
    path: "/unity-ml-agents",
    anchor: "environment-parameters",
    title: "Unity ML-Agents — environment_parameters",
    label: "Unity ML-Agents → environment_parameters, сэмплеры и curriculum",
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
    id: "3.2",
    path: "/courses/3-2",
    title: "Self-Play / MA-POCA",
    level: 3,
    note: "self-play как автокурриккулум, нестационарность, ELO",
  },
  {
    id: "3.1",
    path: "/courses/3-1",
    title: "SAC",
    level: 3,
    note: "PPO, преимущество/GAE (|Â_t|)",
  },
  {
    id: "2.6",
    path: "/courses/2-6",
    title: "TensorBoard и W&B",
    level: 2,
    note: "диагностика train/test",
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
  {
    label: "Bengio и др. (2009) — Curriculum Learning, ICML'09",
    url: "https://dl.acm.org/doi/10.1145/1553374.1553380",
  },
  { label: "Tobin и др. (2017) — Domain Randomization, arXiv:1703.06907", url: "https://arxiv.org/abs/1703.06907" },
  { label: "OpenAI и др. (2019) — Solving Rubik's Cube (ADR), arXiv:1910.07113", url: "https://arxiv.org/abs/1910.07113" },
  { label: "Jiang и др. (2021) — Prioritized Level Replay, arXiv:2010.03934", url: "https://arxiv.org/abs/2010.03934" },
  { label: "Cobbe и др. (2019) — Quantifying Generalization, arXiv:1812.02341", url: "https://arxiv.org/abs/1812.02341" },
  { label: "Dennis и др. (2020) — PAIRED / UED, arXiv:2012.02096", url: "https://arxiv.org/abs/2012.02096" },
  {
    label: "Unity ML-Agents — Training ML-Agents (environment_parameters)",
    url: "https://unity-technologies.github.io/ml-agents/Training-ML-Agents/",
  },
];

const SOURCES: ReactNode[] = [
  <>
    <strong className="text-foreground/90">Bengio, Louradour, Collobert, Weston (2009).</strong>{" "}
    <em>Curriculum Learning.</em> ICML 2009. — Определение curriculum learning; трактовка как метода
    продолжения (continuation method); эффект на скорость сходимости и качество локального минимума.
    (Корни идеи: <em>shaping</em>, Skinner 1958; <em>start small</em>, Elman 1993.)
  </>,
  <>
    <strong className="text-foreground/90">
      Tobin, Fong, Ray, Schneider, Zaremba, Abbeel (2017).
    </strong>{" "}
    <em>
      Domain Randomization for Transferring Deep Neural Networks from Simulation to the Real World.
    </em>{" "}
    arXiv:1703.06907 (IROS 2017). — Domain randomization; реальность как «ещё одна вариация»; первый
    sim-only→real перенос нейросети.
  </>,
  <>
    <strong className="text-foreground/90">
      OpenAI и др. (Akkaya, Andrychowicz, …) (2019).
    </strong>{" "}
    <em>Solving Rubik's Cube with a Robot Hand.</em> arXiv:1910.07113. — <strong>ADR</strong>:
    факторизованное распределение, boundary sampling, пороги{" "}
    <Math display={false}>{String.raw`t_L/t_H`}</Math>, ADR-энтропия; эмерджентное мета-обучение у
    моделей с памятью.
  </>,
  <>
    <strong className="text-foreground/90">Jiang, Grefenstette, Rocktäschel (2021).</strong>{" "}
    <em>Prioritized Level Replay.</em> ICML 2021 (arXiv:2010.03934). — <strong>PLR</strong>: учебный
    потенциал как средний <Math display={false}>{String.raw`|\enfOp{\hat{A}}_t|`}</Math> / L1 value loss;
    staleness-коррекция{" "}
    <Math display={false}>{String.raw`P_{\text{replay}}=(1-\rho)P_S+\rho P_C`}</Math>; неявный
    курриккулум на MiniGrid. Связанная работа:{" "}
    <strong className="text-foreground/90">Jiang и др. (2021),</strong>{" "}
    <em>Replay-Guided Adversarial Environment Design</em> —{" "}
    <Math display={false}>{String.raw`\text{PLR}^{\perp}`}</Math> и минимакс-regret.
  </>,
  <>
    <strong className="text-foreground/90">
      Cobbe, Klimov, Hesse, Kim, Schulman (2019).
    </strong>{" "}
    <em>Quantifying Generalization in Reinforcement Learning</em> (CoinRun). ICML 2019
    (arXiv:1812.02341). И <strong className="text-foreground/90">Cobbe, Hesse, Hilton, Schulman
    (2020),</strong> <em>Leveraging Procedural Generation to Benchmark RL</em> (Procgen). —
    Переобучение в RL; раздельные train/test-уровни; разрыв обобщения; нужны ~
    <Math display={false}>{String.raw`10^4`}</Math> уровней.
  </>,
  <>
    <strong className="text-foreground/90">
      Dennis, Jaques, Vinitsky, Bayen, Russell, Critch, Levine (2020).
    </strong>{" "}
    <em>Emergent Complexity and Zero-shot Transfer via Unsupervised Environment Design</em> (
    <strong>PAIRED</strong>). NeurIPS 2020 (arXiv:2012.02096). — UED и минимакс-regret; ограничения DR
    и чистого минимакса.
  </>,
  <>
    <strong className="text-foreground/90">
      Вспомогательно (триангуляция, не единственный источник):
    </strong>{" "}
    Portelas и др. (2020), <em>Automatic Curriculum Learning for Deep RL: A Short Survey</em>{" "}
    (таксономия ACL); Matiisen и др. (2019), <em>Teacher-Student Curriculum Learning</em>; Wang и др.
    (2019), <em>POET</em>; Parker-Holder и др. (2022),{" "}
    <em>Evolving Curricula with Regret-Based Environment Design</em> (<strong>ACCEL</strong>); Leibo и
    др. (2019), <em>Autocurricula …</em> (манифест).
  </>,
  <>
    <strong className="text-foreground/90">Документация:</strong>{" "}
    <em>Unity ML-Agents Toolkit — Training ML-Agents</em> (актуальная версия 4.0.x): секция{" "}
    <code className="px-1 rounded bg-muted/50 text-xs font-mono">environment_parameters</code>, типы
    сэмплеров (<code className="px-1 rounded bg-muted/50 text-xs font-mono">uniform</code>/
    <code className="px-1 rounded bg-muted/50 text-xs font-mono">gaussian</code>/
    <code className="px-1 rounded bg-muted/50 text-xs font-mono">multirangeuniform</code>),{" "}
    <code className="px-1 rounded bg-muted/50 text-xs font-mono">curriculum</code> и поля{" "}
    <code className="px-1 rounded bg-muted/50 text-xs font-mono">completion_criteria</code>. Имя{" "}
    <code className="px-1 rounded bg-muted/50 text-xs font-mono">multirangeuniform</code> — по
    поставляемым примерам конфигов и парсеру (
    <code className="px-1 rounded bg-muted/50 text-xs font-mono">Sampler.cs</code>).
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

    {/* Полная библиография (раздел «Источники» урока) */}
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
