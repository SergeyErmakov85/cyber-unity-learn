import { Card, CardContent } from "@/components/ui/card";
import TldrBox from "@/components/ui/TldrBox";
import Math from "@/components/Math";
import { Flame, Database, Dices, Gauge } from "lucide-react";

const KEY_FINDINGS = [
  {
    title: "Off-policy → экономия данных",
    text:
      "Весь прошлый опыт хранится в replay buffer и переиспользуется много раз. Тот же агент учится за заметно меньшее число шагов среды, чем on-policy PPO.",
    icon: Database,
    color: "cyan",
  },
  {
    title: "Награда + энтропия",
    text:
      "SAC максимизирует не только награду, но и энтропию политики. Агент стремится быть максимально случайным при высокой награде — отсюда богатое исследование и устойчивость.",
    icon: Flame,
    color: "purple",
  },
  {
    title: "Стохастичность как стратегия",
    text:
      "Squashed-Gaussian-политика + reparameterization trick дают дифференцируемый стохастический actor, а два Q-критика гасят переоценку ценности.",
    icon: Dices,
    color: "pink",
  },
  {
    title: "Температура α — сама",
    text:
      "Энтропийный коэффициент α автоподстраивается через двойственную задачу с целевой энтропией −dim(A). Меньше ручного тюнинга, чем у любого предыдущего метода.",
    icon: Gauge,
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

const chip = "px-1.5 py-0.5 rounded bg-muted/50 text-xs font-mono";

const IntroSection = () => (
  <div className="space-y-8">
    {/* Hero card */}
    <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1 space-y-3">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            «Максимально случайный, но успешный» агент
          </h3>
          <p className="text-foreground/80 leading-relaxed">
            <strong className="text-foreground">Soft Actor-Critic (SAC)</strong> —
            state-of-the-art <strong className="text-cyan-300">off-policy</strong> алгоритм для
            непрерывного управления (рулёжка, газ, тормоз, моменты в суставах). Он решает обе главные
            боли deep RL сразу: экономит дорогие шаги симуляции через replay buffer и максимизирует
            награду <em>вместе</em> с энтропией политики — за счёт чего исследует богаче и обучается
            стабильнее. Предложен Haarnoja и соавторами в 2018 году.
          </p>
        </div>
        <div className="shrink-0 w-20 h-20 rounded-2xl border border-cyan-400/40 bg-cyan-500/10 flex items-center justify-center shadow-[0_0_32px_hsl(var(--primary)/0.45)]">
          <Flame className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
        </div>
      </CardContent>
    </Card>

    {/* TL;DR — «Что вы поймёте к концу урока» */}
    <TldrBox
      title="Что вы поймёте к концу урока"
      items={[
        <>
          Почему «максимально случайный, но успешный» агент учится лучше, чем
          жадно-детерминированный — <strong>принцип максимальной энтропии</strong>.
        </>,
        <>
          Как энтропия встраивается прямо в цель обучения (<em>maximum-entropy RL objective</em>) и
          порождает <em>soft</em> версии <Math display={false}>{String.raw`Q`}</Math>,{" "}
          <Math display={false}>{String.raw`V`}</Math> и уравнения Беллмана.
        </>,
        <>
          Почему SAC использует <strong>два</strong> Q-критика, target-сети и медленное обновление{" "}
          <Math display={false}>{String.raw`\tau`}</Math>.
        </>,
        <>
          Что такое <em>reparameterization trick</em> и зачем он для стохастической политики.
        </>,
        <>
          Как температура <Math display={false}>{String.raw`\alpha`}</Math> подстраивается{" "}
          <strong>автоматически</strong>.
        </>,
        <>
          Почему SAC <em>off-policy</em> и крайне экономен по данным — и чем он отличается от PPO.
        </>,
        <>
          Как запустить SAC в Unity ML-Agents: разбор YAML-конфига поле за полем (
          <code className={chip}>trainer_type: sac</code>).
        </>,
      ]}
    />

    {/* «Как читать кросс-ссылки» note */}
    <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm p-5 text-sm text-foreground/80 leading-relaxed">
      <strong className="text-purple-300">Как читать кросс-ссылки в этом уроке.</strong> Урок — точка
      входа. Из него ведут ссылки в хабы для глубокого разбора, как в Википедии. Места, где нужно
      перейти в хаб, помечены значком{" "}
      <span className="text-cyan-300">↗</span>. Места, <em>куда</em> хабы должны возвращать читателя,
      — это разделы с устойчивыми <code className={chip}>id</code>-якорями (см. навигацию выше).
    </div>

    {/* Key findings grid */}
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
