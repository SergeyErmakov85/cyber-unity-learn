import { Card, CardContent } from "@/components/ui/card";
import TldrBox from "@/components/ui/TldrBox";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { GraduationCap, TrendingUp, Shuffle, Sliders, Swords } from "lucide-react";

const KEY_FINDINGS = [
  {
    title: "Учебный план",
    text:
      "Управляем порядком трудности: от простого к сложному. Формально — метод продолжения, который ведёт оптимизатор по «хребту» хороших решений.",
    icon: TrendingUp,
    color: "cyan",
  },
  {
    title: "Рандомизация среды",
    text:
      "Управляем разнообразием: обучаем на распределении контекстов, а не на одной точке. Лечит переобучение и разрыв реальности (sim-to-real).",
    icon: Shuffle,
    color: "purple",
  },
  {
    title: "ADR и PLR",
    text:
      "ADR расширяет диапазоны случайности автоматически по порогам; PLR строит неявный план, переигрывая уровни с высоким |Â_t| без контроля над генератором.",
    icon: Sliders,
    color: "pink",
  },
  {
    title: "UED — self-play над средами",
    text:
      "Учитель-генератор сам производит решаемые миры на границе компетентности ученика. Прямое продолжение автокурриккулума из урока 3.2.",
    icon: Swords,
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
            Как научить агента трудному и не дать ему переобучиться
          </h3>
          <p className="text-foreground/80 leading-relaxed">
            Фиксированная среда порождает две зеркальные беды:{" "}
            <strong className="text-cyan-300">необучаемость трудной задачи «в лоб»</strong> и{" "}
            <strong className="text-cyan-300">переобучение</strong> под одну конфигурацию. Их лечат
            два дополняющих инструмента — <strong className="text-foreground">учебный план</strong>{" "}
            (порядок трудности) и <strong className="text-foreground">рандомизация среды</strong>{" "}
            (разнообразие), — а их слияние (ADR, PLR, UED) даёт автоматический учебный план над
            рандомизированной средой.
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Уровень:</strong> 3 (продвинутый) · <strong>Раздел курса:</strong> продвинутый
            уровень · <strong>Тип:</strong> урок-нарратив (точка входа), формальная глубина — в хабах
            по ссылкам.
          </p>
        </div>
        <div className="shrink-0 w-20 h-20 rounded-2xl border border-cyan-400/40 bg-cyan-500/10 flex items-center justify-center shadow-[0_0_32px_hsl(var(--primary)/0.45)]">
          <GraduationCap className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
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
            <strong>PPO</strong> и его обрезанный суррогатный лосс, преимущество и <strong>GAE</strong>{" "}
            —{" "}
            <CrossLinkToHub hubPath="/courses/3-1" hubAnchor="ppo" hubTitle="Урок 3.1 — PPO">
              урок 3.1, раздел про PPO
            </CrossLinkToHub>{" "}
            и хаб{" "}
            <CrossLinkToHub hubPath="/algorithms/ppo" hubTitle="Алгоритмы → PPO">
              PPO ↗
            </CrossLinkToHub>
            ; основу градиента политики — хаб{" "}
            <CrossLinkToHub hubPath="/math-rl/module-4" hubTitle="Математика → Градиент политики">
              Градиент политики ↗
            </CrossLinkToHub>
            .
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            <strong>Actor-critic</strong>, функции ценности <em>V/Q</em>, уравнение Беллмана —{" "}
            <CrossLinkToHub hubPath="/courses/3-1" hubTitle="Урок 3.1">
              урок 3.1
            </CrossLinkToHub>{" "}
            и хаб{" "}
            <CrossLinkToHub hubPath="/math-rl/module-5" hubTitle="Математика → Уравнения Беллмана">
              Уравнения Беллмана ↗
            </CrossLinkToHub>
            .
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            <strong>Self-play</strong>, рейтинг <strong>ELO</strong>, <strong>нестационарность</strong>{" "}
            и <strong>CTDE</strong> —{" "}
            <CrossLinkToHub hubPath="/courses/3-2" hubAnchor="раздел-6-self-play" hubTitle="Урок 3.2 — Self-Play">
              урок 3.2
            </CrossLinkToHub>{" "}
            и хаб{" "}
            <CrossLinkToHub hubPath="/deep-rl" hubTitle="Deep RL → MARL/CTDE">
              Глубокий RL: MARL/CTDE ↗
            </CrossLinkToHub>
            .
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            <strong>Дисконтирование</strong> <code className={chip}>γ</code> — хаб{" "}
            <CrossLinkToHub hubPath="/math-rl/module-1" hubTitle="Математика → Дисконтирование">
              Дисконтирование ↗
            </CrossLinkToHub>
            .
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            <strong>Гоночного агента на PPO</strong> из{" "}
            <CrossLinkToHub hubPath="/courses/project-3" hubTitle="Проект 3 — гоночный агент">
              Проекта 3
            </CrossLinkToHub>{" "}
            — он будет нашим сквозным примером.
          </span>
        </li>
      </ul>
    </div>

    {/* TL;DR — «🎯 Что вы поймёте к концу урока» */}
    <TldrBox
      title="🎯 Что вы поймёте к концу урока"
      items={[
        <>
          Почему агент, идеально освоивший одну трассу, разбивается на новой — и почему «трудную трассу
          с нуля» он не осиливает вовсе.
        </>,
        <>
          Что такое <strong>учебный план</strong> (curriculum): порядок задач от простого к сложному, и
          почему это частный случай <em>метода продолжения</em> (continuation method).
        </>,
        <>
          Чем <strong>рандомизация среды</strong> лечит сразу две болезни — <em>переобучение</em>{" "}
          (разрыв обобщения) и <em>разрыв реальности</em> (sim-to-real).
        </>,
        <>
          Как <strong>ADR</strong> превращает рандомизацию в автоматический учебный план, а{" "}
          <strong>PLR</strong> строит план без контроля над генератором уровней.
        </>,
        <>
          Как всё это включается в <strong>Unity ML-Agents</strong> через секцию{" "}
          <code className={chip}>environment_parameters</code> (полный YAML, сэмплеры, критерии
          завершения уроков).
        </>,
        <>
          Где проходит рубеж — <strong>Unsupervised Environment Design</strong> как «self-play над
          средами», прямое продолжение идеи из урока 3.2.
        </>,
      ]}
    />

    {/* «🔗 Как читать кросс-ссылки» note */}
    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm p-5 text-sm text-foreground/80 leading-relaxed">
      <strong className="text-cyan-300">🔗 Как читать кросс-ссылки.</strong> Значок{" "}
      <span className="text-cyan-300">↗</span> ведёт в <strong>хаб</strong> — туда вынесена формальная
      глубина (строгие определения, выводы, доказательства), чтобы не раздувать урок. Обычные ссылки
      ведут в <strong>другие уроки</strong> — на конкретный раздел, где понятие уже разбиралось: мы не
      объясняем его заново, а опираемся на него. Ссылки вида <em>(см. навигацию выше)</em> — это{" "}
      <strong>оглавление разделов</strong> в шапке урока: по нему можно прыгать между разделами, а хабы
      умеют возвращать вас ровно в тот раздел, из которого вы ушли.
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
