import { Card, CardContent } from "@/components/ui/card";
import TldrBox from "@/components/ui/TldrBox";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import Math from "@/components/Math";
import { Settings, Dices, Brain, Scissors, Gauge } from "lucide-react";

const chip = "px-1.5 py-0.5 rounded bg-muted/50 text-xs font-mono";

const KEY_FINDINGS = [
  {
    title: "HPO как чёрный ящик",
    text:
      "f(λ) — итоговое качество агента: дорогая, шумная функция без градиента. Бюджет считаем не в секундах, а в числе trial-ов.",
    icon: Settings,
    color: "cyan",
  },
  {
    title: "Random бьёт grid",
    text:
      "Низкая эффективная размерность: при N испытаниях random покрывает N значений важной оси, grid — лишь k. Random — обязательный baseline.",
    icon: Dices,
    color: "purple",
  },
  {
    title: "TPE = дефолт Optuna",
    text:
      "Две плотности ℓ/g и правило «бери конфигурацию, вероятную среди хороших и редкую среди плохих». Линеен по числу наблюдений и параллелится.",
    icon: Brain,
    color: "pink",
  },
  {
    title: "Прунинг экономит бюджет",
    text:
      "ASHA/Hyperband отсекают аутсайдеров на ранних шагах. С прунингом за то же время прогоняется на порядки больше испытаний.",
    icon: Scissors,
    color: "emerald",
  },
] as const;

const COLOR_MAP: Record<string, string> = {
  cyan: "border-cyan-500/30 hover:border-cyan-400/70 hover:shadow-[0_0_24px_hsl(var(--primary)/0.35)] [&_svg]:text-cyan-400",
  purple:
    "border-purple-500/30 hover:border-purple-400/70 hover:shadow-[0_0_24px_hsl(280_85%_65%/0.35)] [&_svg]:text-purple-400",
  pink: "border-pink-500/30 hover:border-pink-400/70 hover:shadow-[0_0_24px_hsl(330_85%_65%/0.35)] [&_svg]:text-pink-400",
  emerald:
    "border-emerald-500/30 hover:border-emerald-400/70 hover:shadow-[0_0_24px_hsl(160_85%_55%/0.35)] [&_svg]:text-emerald-400",
};

const IntroSection = () => (
  <div className="space-y-8">
    {/* Hero card */}
    <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1 space-y-3">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            Оптимизация гиперпараметров: Optuna + W&amp;B
          </h3>
          <p className="text-foreground/80 leading-relaxed">
            Ручной подбор гиперпараметров — это дорого, необъективно и плохо воспроизводимо. Этот
            урок формализует задачу <strong className="text-cyan-300">HPO</strong>{" "}
            <Math display={false}>{String.raw`\boldsymbol{\enfPar{\lambda}}^{\star} = \arg\max_{\boldsymbol{\lambda}\in\Lambda}\,\enfFun{f}(\boldsymbol{\enfPar{\lambda}})`}</Math>
            , разбирает стратегии поиска (grid → random → байесовская оптимизация → TPE) и
            прунинг (Median, SHA/ASHA, Hyperband), а затем применяет всё это к{" "}
            <strong>гоночному агенту</strong> на стеке{" "}
            <code className={chip}>Optuna</code> + <code className={chip}>W&amp;B</code> в связке с
            <code className={chip}> mlagents-learn</code>.
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Уровень:</strong> 3 (продвинутый) · <strong>Раздел программы:</strong> 3.6 ·{" "}
            <strong>Доступ:</strong> PRO
          </p>
        </div>
        <div className="shrink-0 w-20 h-20 rounded-2xl border border-cyan-400/40 bg-cyan-500/10 flex items-center justify-center shadow-[0_0_32px_hsl(var(--primary)/0.45)]">
          <Gauge className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
        </div>
      </CardContent>
    </Card>

    {/* Предполагается, что вы знаете */}
    <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm p-5 text-sm text-foreground/85 leading-relaxed">
      <strong className="text-purple-300">Предполагается, что вы знаете:</strong>
      <ul className="space-y-2 mt-3">
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            Гиперпараметры PPO (<code className={chip}>learning_rate</code>,{" "}
            <code className={chip}>beta</code>, <code className={chip}>epsilon</code>,{" "}
            <code className={chip}>lambd</code>, <code className={chip}>num_epoch</code>,{" "}
            <code className={chip}>batch_size</code>, <code className={chip}>buffer_size</code>) и
            их смысл —{" "}
            <CrossLinkToLesson
              lessonId="3.1"
              lessonPath="/courses/3-1"
              lessonTitle="Урок 3.1 — SAC/PPO"
              lessonLevel={3}
            >
              урок 3.1
            </CrossLinkToLesson>
            .
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            Как логировать обучение в W&amp;B и читать TensorBoard —{" "}
            <CrossLinkToLesson
              lessonId="2.6"
              lessonPath="/courses/2-6"
              lessonTitle="Урок 2.6 — TensorBoard и W&B"
              lessonLevel={2}
            >
              урок 2.6
            </CrossLinkToLesson>
            .
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            ELO как метрику в self-play —{" "}
            <CrossLinkToLesson
              lessonId="3.2"
              lessonPath="/courses/3-2"
              lessonTitle="Урок 3.2 — MA-POCA / Self-Play"
              lessonLevel={3}
            >
              урок 3.2
            </CrossLinkToLesson>
            .
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            Domain randomization и curriculum —{" "}
            <CrossLinkToLesson
              lessonId="3.3"
              lessonPath="/courses/3-3"
              lessonTitle="Урок 3.3 — Curriculum / DR"
              lessonLevel={3}
            >
              урок 3.3
            </CrossLinkToLesson>
            ; силу сигнала GAIL (<code className={chip}>gail: strength</code>) —{" "}
            <CrossLinkToLesson
              lessonId="3.4"
              lessonPath="/courses/3-4"
              lessonTitle="Урок 3.4 — Imitation Learning (BC + GAIL)"
              lessonLevel={3}
            >
              урок 3.4
            </CrossLinkToLesson>
            ; гоночного агента —{" "}
            <CrossLinkToLesson
              lessonId="project-3"
              lessonPath="/courses/project-3"
              lessonTitle="Проект 3 — гоночный агент"
              lessonLevel={3}
            >
              Проект 3
            </CrossLinkToLesson>
            .
          </span>
        </li>
      </ul>
    </div>

    {/* TL;DR */}
    <TldrBox
      title="🎯 Что вы поймёте к концу урока"
      items={[
        <>
          Почему ручной подбор гиперпараметров дорог, необъективен и невоспроизводим, и как
          формализовать задачу <strong>HPO</strong>.
        </>,
        <>
          Чем <strong>random search</strong> систематически бьёт <strong>grid search</strong>, и
          почему проклятие размерности убивает сетку.
        </>,
        <>
          Как работает <strong>байесовская оптимизация</strong> (суррогат + функция выгоды) и её
          практичный вариант <strong>TPE</strong> — сэмплер Optuna по умолчанию.
        </>,
        <>
          Что такое <strong>прунинг</strong> и как <strong>Successive Halving / ASHA / Hyperband</strong>{" "}
          экономят вычисления; как написать <code className={chip}>objective</code> в{" "}
          <strong>Optuna</strong>, связать её с <strong>W&amp;B</strong> и подобрать параметры
          гоночного агента в Unity ML-Agents.
        </>,
      ]}
    />

    {/* как читать кросс-ссылки */}
    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm p-5 text-sm text-foreground/80 leading-relaxed">
      <strong className="text-cyan-300">🧭 Как читать кросс-ссылки.</strong> Значок{" "}
      <span className="text-cyan-300">↗</span> ведёт в <strong>хаб</strong> — туда вынесена строгая
      математика (полные выводы, доказательства). Ссылки вида «урок X.Y» ведут на конкретный раздел
      другого урока. Внутри этого урока переходы между разделами работают по якорям из оглавления
      вверху страницы.
    </div>

    {/* Key findings */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {KEY_FINDINGS.map(({ title, text, icon: Icon, color }) => (
        <Card
          key={title}
          className={`group bg-card/60 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${COLOR_MAP[color]}`}
        >
          <CardContent className="p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-bold text-foreground leading-snug">{title}</h4>
              <Icon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-110" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default IntroSection;
