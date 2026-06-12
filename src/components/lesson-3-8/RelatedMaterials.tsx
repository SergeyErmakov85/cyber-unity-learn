import { type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link2, GraduationCap, Wrench, ExternalLink, BookMarked, Map } from "lucide-react";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";

const HUBS: Array<{ path: string; anchor?: string; title: string; label: string }> = [
  { path: "/algorithms/ppo", title: "Алгоритмы → PPO", label: "PPO — клиппинг, GAE" },
  { path: "/algorithms/sac", title: "Алгоритмы → SAC", label: "SAC — мягкий actor-critic" },
  { path: "/algorithms", title: "Алгоритмы → POCA", label: "POCA — командное обучение (в хабе алгоритмов)" },
  { path: "/unity-ml-agents", title: "Unity ML-Agents", label: "Unity ML-Agents — обучение, YAML-поля" },
  { path: "/math-rl/module-1", title: "Math RL — Модуль 1", label: "Math RL → дисконтирование" },
  { path: "/fca-rl", title: "FCA для RL", label: "FCA — формальный анализ понятий" },
];

const LESSONS: Array<{ id: string; path: string; title: string; level: 1 | 2 | 3; note: string }> = [
  { id: "3.1", path: "/courses/3-1", title: "SAC — Soft Actor-Critic", level: 3, note: "MDP, actor-critic, replay buffer, tau, два критика" },
  { id: "3.2", path: "/courses/3-2", title: "MA-POCA и Self-Play", level: 3, note: "MARL, CTDE, Self-Play, ELO" },
  { id: "2.6", path: "/courses/2-6", title: "TensorBoard и W&B", level: 2, note: "диагностика обучения, логирование" },
  { id: "project-3", path: "/courses/project-3", title: "Проект 3: Гоночный агент (PPO)", level: 3, note: "практика PPO-агента" },
];

const EXTERNAL: Array<{ label: string; url: string }> = [
  { label: "Unity ML-Agents docs (com.unity.ml-agents@4.0)", url: "https://docs.unity3d.com/Packages/com.unity.ml-agents@4.0/" },
  { label: "Unity Sentis docs (com.unity.ai.inference)", url: "https://docs.unity3d.com/Packages/com.unity.ai.inference@latest/" },
  { label: "Schulman et al. (2017). PPO. arXiv:1707.06347", url: "https://arxiv.org/abs/1707.06347" },
  { label: "Haarnoja et al. (2018). SAC. arXiv:1801.01290", url: "https://arxiv.org/abs/1801.01290" },
  { label: "Cohen et al. (2022). MA-POCA. arXiv:2111.05992", url: "https://arxiv.org/abs/2111.05992" },
  { label: "Ho & Ermon (2016). GAIL. arXiv:1606.03476", url: "https://arxiv.org/abs/1606.03476" },
  { label: "Schulman et al. (2015). GAE. arXiv:1506.02438", url: "https://arxiv.org/abs/1506.02438" },
  { label: "Optuna — байесовская оптимизация (TPE)", url: "https://optuna.org/" },
];

const SOURCES: ReactNode[] = [
  <><strong>Unity ML-Agents Toolkit</strong> — официальная документация, актуальная версия (пакет <code>com.unity.ml-agents</code> 4.0.x, Release 23; Unity 2022.3+). Конфигурация обучения, поля и дефолты YAML, Curriculum Learning, reward signals.</>,
  <><strong>Unity Sentis</strong> (<code>com.unity.ai.inference</code>) — нейросетевой инференс-рантайм Unity (заменил Barracuda): импорт ONNX, бэкенды CPU/GPU, квантизация весов.</>,
  <><strong>PPO</strong> — Schulman et al., «Proximal Policy Optimization Algorithms», arXiv:1707.06347 (2017). Клиппинг, <code>epsilon</code>.</>,
  <><strong>GAE</strong> — Schulman et al., «High-Dimensional Continuous Control Using Generalized Advantage Estimation», arXiv:1506.02438 (2015). Параметр <code>lambd</code>.</>,
  <><strong>SAC</strong> — Haarnoja et al., «Soft Actor-Critic», arXiv:1801.01290 (2018). Подробный разбор — <CrossLinkToLesson lessonId="3.1" lessonPath="/courses/3-1" lessonTitle="Урок 3.1" lessonLevel={3}>урок 3.1</CrossLinkToLesson>.</>,
  <><strong>MA-POCA</strong> — Cohen et al., arXiv:2111.05992 (2022). Подробный разбор — <CrossLinkToLesson lessonId="3.2" lessonPath="/courses/3-2" lessonTitle="Урок 3.2" lessonLevel={3}>урок 3.2</CrossLinkToLesson>.</>,
  <><strong>GAIL</strong> — Ho &amp; Ermon, «Generative Adversarial Imitation Learning», arXiv:1606.03476 (NeurIPS 2016). Имитационное обучение через дискриминатор.</>,
  <><strong>Optuna</strong> — байесовская оптимизация гиперпараметров (TPE-сэмплер) + интеграция с W&B (<code>WeightsAndBiasesCallback</code>). <code>optuna.org</code>.</>,
  <><strong>Weights &amp; Biases</strong> — трекинг экспериментов и свипов. Базовые приёмы — <CrossLinkToLesson lessonId="2.6" lessonPath="/courses/2-6" lessonTitle="Урок 2.6" lessonLevel={2}>урок 2.6</CrossLinkToLesson>.</>,
  <>Каноническая нотация RL — Sutton &amp; Barto, «Reinforcement Learning: An Introduction», 2-е изд.</>,
];

const RelatedMaterials = () => (
  <>
    <section
      id="karta-krosslinkov"
      aria-label="Карта кросс-ссылок"
      className="mt-12 scroll-mt-24 py-10 px-6 md:px-8 bg-card/60 backdrop-blur-sm rounded-2xl border border-cyan-500/10"
    >
      <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 inline-flex items-center gap-2">
        <Map className="w-6 h-6 text-cyan-400" /> Карта кросс-ссылок
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-cyan-500/20 rounded-lg overflow-hidden">
          <thead className="bg-cyan-500/10">
            <tr className="text-left text-cyan-200">
              <th className="p-3">Цель</th>
              <th className="p-3">Тип</th>
              <th className="p-3">Путь / якорь</th>
              <th className="p-3">Что оттуда берём</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/10 text-foreground/85">
            <tr><td className="p-3">Урок 3.1 (SAC)</td><td className="p-3"><code>CrossLinkToLesson</code></td><td className="p-3"><code>/courses/3-1#itogi</code>, <code>#razdel-0</code></td><td className="p-3">MDP, actor-critic, replay buffer, <code>tau</code>, два критика, энтропия</td></tr>
            <tr><td className="p-3">Урок 3.2 (MA-POCA/Self-Play)</td><td className="p-3"><code>CrossLinkToLesson</code></td><td className="p-3"><code>/courses/3-2#itogi</code>, <code>#razdel-0</code></td><td className="p-3">MARL, CTDE, контрфактический бейзлайн, Self-Play, ELO</td></tr>
            <tr><td className="p-3">Урок 2.3 (Непрерывные действия)</td><td className="p-3"><code>CrossLinkToLesson</code></td><td className="p-3"><code>/courses/2-3</code></td><td className="p-3">непрерывная политика, Actor-Critic</td></tr>
            <tr><td className="p-3">Урок 2.6 (TensorBoard и W&B)</td><td className="p-3"><code>CrossLinkToLesson</code></td><td className="p-3"><code>/courses/2-6</code></td><td className="p-3">диагностика обучения, логирование</td></tr>
            <tr><td className="p-3">Проект 3 (Гоночный агент, PPO)</td><td className="p-3"><code>CrossLinkToLesson</code></td><td className="p-3"><code>/courses/project-3</code></td><td className="p-3">практика PPO-агента</td></tr>
            <tr><td className="p-3">Хаб PPO</td><td className="p-3"><code>CrossLinkToHub</code></td><td className="p-3"><code>/algorithms/ppo</code></td><td className="p-3">клиппинг, GAE</td></tr>
            <tr><td className="p-3">Хаб SAC</td><td className="p-3"><code>CrossLinkToHub</code></td><td className="p-3"><code>/algorithms/sac</code></td><td className="p-3">мягкий actor-critic</td></tr>
            <tr><td className="p-3">Хаб POCA</td><td className="p-3"><code>CrossLinkToHub</code></td><td className="p-3"><code>/algorithms</code> (POCA-секция)</td><td className="p-3">командное обучение</td></tr>
            <tr><td className="p-3">Хаб math-rl, модуль 1</td><td className="p-3"><code>CrossLinkToHub</code></td><td className="p-3"><code>/math-rl/module-1</code></td><td className="p-3">дисконтирование</td></tr>
            <tr><td className="p-3">Хаб Unity ML-Agents</td><td className="p-3"><code>CrossLinkToHub</code></td><td className="p-3"><code>/unity-ml-agents</code></td><td className="p-3">обучение, YAML-поля</td></tr>
            <tr><td className="p-3">Хаб FCA</td><td className="p-3"><code>CrossLinkToHub</code></td><td className="p-3"><code>/fca-rl</code></td><td className="p-3">формальный анализ понятий</td></tr>
          </tbody>
        </table>
      </div>
    </section>

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
  </>
);

export default RelatedMaterials;
