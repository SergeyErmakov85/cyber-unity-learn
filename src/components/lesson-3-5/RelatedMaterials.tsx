import { type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link2, GraduationCap, Wrench, ExternalLink, BookMarked } from "lucide-react";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";

const HUBS: Array<{ path: string; anchor?: string; title: string; label: string }> = [
  {
    path: "/unity-ml-agents",
    anchor: "yaml-config",
    title: "Unity ML-Agents — YAML и обучение",
    label: "Unity ML-Agents → YAML-конфигурация: checkpoint_settings, network_settings",
  },
  {
    path: "/unity-ml-agents",
    anchor: "inference",
    title: "Unity ML-Agents — Inference Engine",
    label: "Unity ML-Agents → инференс-движок (Sentis / Inference Engine)",
  },
  {
    path: "/algorithms/ppo",
    anchor: "policy-network",
    title: "PPO — политика как сеть",
    label: "Алгоритмы → PPO: политика как сеть, стохастичность актора",
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
    id: "3.4",
    path: "/courses/3-4",
    title: "Imitation Learning: BC + GAIL",
    level: 3,
    note: "пайплайн обучения гоночного агента, который мы здесь деплоим",
  },
  {
    id: "3.3",
    path: "/courses/3-3",
    title: "Curriculum & Domain Randomization",
    level: 3,
    note: "устойчивость к sim-to-deploy gap",
  },
  {
    id: "3.1",
    path: "/courses/3-1",
    title: "SAC / PPO",
    level: 3,
    note: "политика π_θ, MDP, агент Проекта 3",
  },
  {
    id: "2.6",
    path: "/courses/2-6",
    title: "TensorBoard и W&B",
    level: 2,
    note: "диагностика метрик и кривых",
  },
  {
    id: "project-3",
    path: "/courses/project-3",
    title: "Гоночный агент на PPO",
    level: 3,
    note: "сквозной проект уровня",
  },
];

const EXTERNAL: Array<{ label: string; url: string }> = [
  {
    label: "Unity ML-Agents — Unity Inference Engine (docs/Unity-Inference-Engine.md)",
    url: "https://github.com/Unity-Technologies/ml-agents/blob/main/docs/Unity-Inference-Engine.md",
  },
  {
    label: "Unity ML-Agents — Training ML-Agents (docs/Training-ML-Agents.md)",
    url: "https://github.com/Unity-Technologies/ml-agents/blob/main/docs/Training-ML-Agents.md",
  },
  {
    label: "Unity ML-Agents — Training Configuration File",
    url: "https://github.com/Unity-Technologies/ml-agents/blob/main/docs/Training-Configuration-File.md",
  },
  {
    label: "Unity Inference Engine (com.unity.ai.inference)",
    url: "https://docs.unity3d.com/Packages/com.unity.ai.inference@2.6/manual/index.html",
  },
  {
    label: "ML-Agents CHANGELOG (com.unity.ml-agents@4.0)",
    url: "https://github.com/Unity-Technologies/ml-agents/blob/main/com.unity.ml-agents/CHANGELOG.md",
  },
];

const SOURCES: ReactNode[] = [
  <>
    <strong className="text-foreground/90">Unity ML-Agents Toolkit — Unity Inference Engine</strong>{" "}
    (<code className="px-1 rounded bg-muted/50 text-xs font-mono">docs/Unity-Inference-Engine.md</code>,
    main): движок = Unity Inference Engine (Sentis), compute-шейдеры; перетаскивание{" "}
    <code className="px-1 rounded bg-muted/50 text-xs font-mono">.onnx</code> в поле Model; выбор
    Inference Device; «CPU обычно быстрее GPU»; IL2CPP &gt; Mono; ограничения GPU в редакторе при
    OpenGL ES-эмуляции; неподдержка сторонних моделей.
  </>,
  <>
    <strong className="text-foreground/90">Unity ML-Agents Toolkit — Training ML-Agents</strong> (
    <code className="px-1 rounded bg-muted/50 text-xs font-mono">docs/Training-ML-Agents.md</code>,
    4.0.3): финальный <code className="px-1 rounded bg-muted/50 text-xs font-mono">.onnx</code>{" "}
    генерируется при завершении/прерывании; <code>--resume</code>, <code>--force</code>; структура
    артефактов <code>results/</code>.
  </>,
  <>
    <strong className="text-foreground/90">
      Unity ML-Agents Toolkit — Using an Environment Executable / Getting Started
    </strong>{" "}
    (4.0.3): путь{" "}
    <code className="px-1 rounded bg-muted/50 text-xs font-mono">
      results/&lt;run-id&gt;/&lt;behavior_name&gt;.onnx
    </code>
    ; Ctrl+C; встраивание модели в агента.
  </>,
  <>
    <strong className="text-foreground/90">
      Unity ML-Agents Toolkit — Training Configuration File
    </strong>{" "}
    (<code className="px-1 rounded bg-muted/50 text-xs font-mono">docs/Training-Configuration-File.md</code>):{" "}
    <code>checkpoint_interval</code> (деф. 500000), <code>keep_checkpoints</code> (деф. 5),{" "}
    <code>even_checkpoints</code>, <code>initialize_from</code>.
  </>,
  <>
    <strong className="text-foreground/90">ML-Agents CHANGELOG</strong> (
    <code className="px-1 rounded bg-muted/50 text-xs font-mono">com.unity.ml-agents@4.0</code>):
    обновление на Sentis <code>1.2.0-exp.2</code>; входы <code>.onnx</code> с префиксом{" "}
    <code>obs_</code>; детерминированный выбор действий (<code>--deterministic</code> /{" "}
    <code>deterministic: true</code>) и сериализация доп. тензоров.
  </>,
  <>
    <strong className="text-foreground/90">
      Unity API — <code>BehaviorParameters</code> / <code>BehaviorType</code>
    </strong>
    : значения Default / InferenceOnly / HeuristicOnly; флаг детерминированного инференса;{" "}
    <code>SetModel(string, NNModel, InferenceDevice)</code>; <code>InferenceDevice</code>.
  </>,
  <>
    <strong className="text-foreground/90">Unity Inference Engine / Sentis overview</strong> (
    <code className="px-1 rounded bg-muted/50 text-xs font-mono">com.unity.ai.inference@2.6</code>,{" "}
    <code className="px-1 rounded bg-muted/50 text-xs font-mono">@2.4</code>): ребрендинг Sentis →
    Inference Engine; поддержка ONNX opset (≈7–25); воркер как движок инференса (
    <code>ModelLoader.Load</code>, <code>new Worker(...)</code>, <code>Schedule</code>,{" "}
    <code>PeekOutput</code>).
  </>,
  <>
    <strong className="text-foreground/90">Unity Barracuda — Introduction</strong> (
    <code className="px-1 rounded bg-muted/50 text-xs font-mono">com.unity.barracuda@3.0</code>):
    статус legacy, заменён Sentis.
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
