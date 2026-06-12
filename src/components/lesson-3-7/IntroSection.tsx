import { Card, CardContent } from "@/components/ui/card";
import TldrBox from "@/components/ui/TldrBox";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import Math from "@/components/Math";
import { Network, Layers, Eye, Brain, Sparkles } from "lucide-react";

const chip = "px-1.5 py-0.5 rounded bg-muted/50 text-xs font-mono";

const KEY_FINDINGS = [
  {
    title: "Энкодер + голова",
    text: "Любая сеть RL-агента = энкодер f_φ (наблюдение → эмбеддинг z) + голова h_ψ (z → действие/оценка). Алгоритм работает над z.",
    icon: Layers,
    color: "cyan",
  },
  {
    title: "Энкодер ⇄ модальность",
    text: "Вектор → MLP, пиксели → CNN, история (POMDP) → LSTM или стек кадров, множества сущностей → внимание.",
    icon: Eye,
    color: "purple",
  },
  {
    title: "POMDP лечится двояко",
    text: "Кадровый стек — фиксированное окно памяти; LSTM — обучаемое сжатие всей истории. Память включают в последнюю очередь.",
    icon: Brain,
    color: "pink",
  },
  {
    title: "Один YAML на всё",
    text: "Все архитектурные решения выражены в network_settings: hidden_units, num_layers, vis_encode_type, memory, shared_critic.",
    icon: Network,
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
            Архитектуры нейросетей для RL-агентов
          </h3>
          <p className="text-foreground/80 leading-relaxed">
            Лучший алгоритм обучения не спасёт плохо подобранную архитектуру. Этот урок разбирает
            сеть агента как <strong className="text-cyan-300">энкодер + голову</strong>:
            <Math display={false}>{String.raw`\;a = h_\psi\big(f_\phi(o)\big)`}</Math>{" "}
            и показывает, как выбирать энкодер под тип наблюдения (вектор, пиксели, история,
            множество сущностей), а потом собирает всё в один блок{" "}
            <code className={chip}>network_settings</code> Unity ML-Agents 4.0.x на примере
            гоночного агента.
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Уровень:</strong> 3 (продвинутый) · <strong>Раздел программы:</strong> 3.7 ·{" "}
            <strong>Доступ:</strong> PRO
          </p>
        </div>
        <div className="shrink-0 w-20 h-20 rounded-2xl border border-cyan-400/40 bg-cyan-500/10 flex items-center justify-center shadow-[0_0_32px_hsl(var(--primary)/0.45)]">
          <Network className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
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
            политику <Math display={false}>{String.raw`\pi_\theta`}</Math>, функции{" "}
            <Math display={false}>{String.raw`V/Q`}</Math> и схему actor–critic —{" "}
            <CrossLinkToLesson
              lessonId="3.1"
              lessonPath="/courses/3-1"
              lessonTitle="Урок 3.1 — SAC/PPO"
              lessonLevel={3}
            >
              урок 3.1
            </CrossLinkToLesson>
            ;
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            self-attention и почему он обрабатывает наблюдения переменной длины —{" "}
            <CrossLinkToLesson
              lessonId="3.2"
              lessonPath="/courses/3-2"
              lessonTitle="Урок 3.2 — MA-POCA / Self-Play"
              lessonLevel={3}
            >
              урок 3.2
            </CrossLinkToLesson>
            ;
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            идею domain randomization —{" "}
            <CrossLinkToLesson
              lessonId="3.3"
              lessonPath="/courses/3-3"
              lessonTitle="Урок 3.3 — Curriculum / DR"
              lessonLevel={3}
            >
              урок 3.3
            </CrossLinkToLesson>
            ; как из демонстраций эксперта кодируется состояние в BC/GAIL —{" "}
            <CrossLinkToLesson
              lessonId="3.4"
              lessonPath="/courses/3-4"
              lessonTitle="Урок 3.4 — Imitation Learning (BC + GAIL)"
              lessonLevel={3}
            >
              урок 3.4
            </CrossLinkToLesson>
            .
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            Базовую теорию градиента политики смотрите в хабе{" "}
            <CrossLinkToHub hubPath="/math-rl/module-4" hubTitle="Math RL — Оптимизация">
              /math-rl/module-4
            </CrossLinkToHub>
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
          Почему любая сеть RL-агента раскладывается на <strong>энкодер</strong> (превращает
          наблюдение в вектор-эмбеддинг) и <strong>голову</strong> (превращает эмбеддинг в
          действие/оценку), и почему это разделение — главный инструмент проектирования.
        </>,
        <>
          Как выбрать энкодер под <strong>тип наблюдения</strong>: MLP для векторов, CNN для
          пикселей, рекуррентность для частичной наблюдаемости, внимание для множеств сущностей.
        </>,
        <>
          Что такое <strong>POMDP</strong> и почему кадровый стек и LSTM — два разных лекарства от
          одной болезни (агент не видит всего состояния). Когда actor и critic должны{" "}
          <strong>делить backbone</strong>, а когда — нет.
        </>,
        <>
          Как все эти решения выражаются в одном блоке{" "}
          <code className={chip}>network_settings</code> конфига Unity ML-Agents, и куда движется
          область — <strong>Decision Transformer</strong> как радикально иной взгляд на
          «сеть-политику».
        </>,
      ]}
    />

    {/* как читать кросс-ссылки */}
    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm p-5 text-sm text-foreground/80 leading-relaxed">
      <strong className="text-cyan-300">🧭 Как читать кросс-ссылки.</strong> Ссылки со стрелкой ↗
      ведут в <strong>хабы</strong> — туда вынесена формальная глубина (полные выводы,
      доказательства). Ссылки на <strong>уроки</strong> ведут к конкретному разделу-якорю, с
      которого вы сможете вернуться сюда по «хлебной» обратной ссылке. Если понятие уже разбиралось
      в предыдущем уроке — мы не повторяем его, а даём ссылку на точное место.
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

    {/* Sparkles flair to match design language */}
    <div className="flex items-center justify-center gap-2 text-cyan-400/60 text-xs">
      <Sparkles className="w-3 h-3" />
      <span>Урок 3.7 — финальная архитектурная сборка перед финальным проектом</span>
      <Sparkles className="w-3 h-3" />
    </div>
  </div>
);

export default IntroSection;
