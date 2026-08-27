import { Gauge, Activity, Layers, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TldrBox from "@/components/ui/TldrBox";
import Math from "@/components/Math";
import HubLink from "@/components/math-rl/HubLink";

const KEY_FINDINGS = [
  {
    title: "PPO + непрерывные действия",
    text: "Для овальной трассы — PPO с тремя каналами (руль, газ, тормоз). Raycast-сенсоры, система чекпоинтов, компактная функция награды.",
    icon: Gauge,
    color: "cyan",
  },
  {
    title: "Ray Perception Sensors",
    text: "RayPerceptionSensorComponent3D: 7 лучей × 90°, длина 20 м, тэги Wall и Checkpoint. Виртуальный LIDAR гоночного агента.",
    icon: Activity,
    color: "purple",
  },
  {
    title: "SOLID-архитектура",
    text: "CarAgent, CarController, CheckpointManager — три изолированных класса. Интерфейсы ICarController и ICheckpointManager разрывают зависимости.",
    icon: Layers,
    color: "pink",
  },
  {
    title: "Reward Shaping",
    text: "+1 за чекпоинт, −1 за стену + EndEpisode, малые сигналы скорости/ориентации/плавности. Мгновенная награда строго в [−1, +1].",
    icon: Trophy,
    color: "emerald",
  },
] as const;

const COLOR_MAP: Record<string, string> = {
  cyan:    "border-cyan-500/30 hover:border-cyan-400/70 hover:shadow-[0_0_24px_hsl(var(--primary)/0.35)] [&_svg]:text-cyan-400",
  purple:  "border-purple-500/30 hover:border-purple-400/70 hover:shadow-[0_0_24px_hsl(280_85%_65%/0.35)] [&_svg]:text-purple-400",
  pink:    "border-pink-500/30 hover:border-pink-400/70 hover:shadow-[0_0_24px_hsl(330_85%_65%/0.35)] [&_svg]:text-pink-400",
  emerald: "border-emerald-500/30 hover:border-emerald-400/70 hover:shadow-[0_0_24px_hsl(160_85%_55%/0.35)] [&_svg]:text-emerald-400",
};

const IntroSection = () => (
  <div className="space-y-8">
    {/* Hero card */}
    <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1 space-y-3">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            Автономный гоночный агент
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Курс «Информационные технологии в психологии», МГППУ.
            Обучение с подкреплением на базе Unity ML-Agents release 22 / com.unity.ml-agents 3.0.0
            с PyTorch. Агент учится проезжать полный круг по овальной трассе с чекпоинтами,
            не врезаясь в стены.
          </p>
        </div>
        <div className="shrink-0 w-20 h-20 rounded-2xl border border-cyan-400/40 bg-cyan-500/10
                        flex items-center justify-center
                        shadow-[0_0_32px_hsl(var(--primary)/0.45)]">
          <Gauge className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
        </div>
      </CardContent>
    </Card>

    {/* TL;DR */}
    <TldrBox
      items={[
        <>
          Для овальной трассы рекомендуется{" "}
          <strong className="text-cyan-300">PPO с непрерывными действиями</strong> (3 канала: руль, газ, тормоз),
          raycast-сенсоры (7 лучей × 90°), система триггеров-чекпоинтов и компактная функция награды:
          +1 за чекпоинт, −1 за столкновение со стеной с завершением эпизода,
          малая премия за скорость и микропенальти за шаг.
        </>,
        <>
          Целевой стек:{" "}
          <strong className="text-purple-300">Unity 2023.2+</strong> (для com.unity.ml-agents 3.0.0 final = release 22;
          для Unity 2022.3 LTS — release_21),{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">Python 3.10.12</code>,{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">mlagents 1.1.0</code>,{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">PyTorch 2.2.1</code>.
        </>,
        <>
          Архитектура агента строится по принципам{" "}
          <strong className="text-pink-300">SOLID</strong>: отдельные классы{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">CarAgent</code>,{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">CarController</code> (через интерфейс{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">ICarController</code>),{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">CheckpointManager</code>,{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">Checkpoint</code> — это позволяет менять
          физику автомобиля без переписывания обучающей логики.
        </>,
      ]}
    />

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

    {/* 1.1 Что такое RL */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">1.1. Что такое Reinforcement Learning</h3>
      <p className="text-muted-foreground leading-relaxed">
        Обучение с подкреплением (Reinforcement Learning, RL) — парадигма машинного обучения, в которой{" "}
        <strong className="text-foreground">агент</strong> учится принимать последовательность решений,
        взаимодействуя со <strong className="text-foreground">средой</strong> и получая скалярный сигнал{" "}
        <strong className="text-foreground">награды</strong>. В отличие от обучения с учителем, агенту не
        предъявляют правильные ответы — он сам «открывает» поведение, максимизирующее ожидаемую суммарную
        награду.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-cyan-500/20">
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Понятие (RU)</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Term (EN)</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Описание</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["Агент",           "Agent",                     "Принимающий решения объект (наш автомобиль)"],
              ["Среда",           "Environment",               "Внешний мир (трасса, физика, чекпоинты)"],
              ["Состояние",       "State, sₜ",                 "Полное описание ситуации в момент t"],
              ["Наблюдение",      "Observation, oₜ",           "То, что фактически «видит» агент (часть состояния)"],
              ["Действие",        "Action, aₜ",                "Решение агента (поворот руля, газ, тормоз)"],
              ["Награда",         "Reward, rₜ",                "Скалярный сигнал качества действия"],
              ["Политика",        "Policy, π(a|s)",            "Функция/распределение действий по состояниям"],
              ["Функция ценности","Value function, Vᵠ(s)",     "Ожидаемая будущая суммарная награда из s"],
              ["Функция Q",       "Action-value, Qᵠ(s,a)",    "Ожидаемая награда после действия a в s"],
              ["Эпизод",          "Episode",                   "Последовательность шагов до терминального состояния"],
            ].map(([ru, en, desc]) => (
              <tr key={ru} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="py-2 px-3 font-medium text-foreground/80">{ru}</td>
                <td className="py-2 px-3 font-mono text-xs text-purple-300">{en}</td>
                <td className="py-2 px-3">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* 1.2 MDP */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">
        1.2. Марковский процесс принятия решений (MDP)
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        Формально среда задаётся как{" "}
        <HubLink to="/hub/math-rl" anchor="марковское-свойство">Марковский процесс принятия решений</HubLink>:
      </p>
      <Math>{String.raw`\mathcal{M} = \langle \mathcal{S}, \mathcal{A}, P, \enfTgt{R}, \enfPar{\gamma} \rangle,`}</Math>
      <p className="text-muted-foreground leading-relaxed">
        где <Math display={false}>{String.raw`\mathcal{S}`}</Math> — множество состояний,{" "}
        <Math display={false}>{String.raw`\mathcal{A}`}</Math> — множество действий,{" "}
        <Math display={false}>{String.raw`P(\enfVar{s}'\mid \enfVar{s},a)`}</Math> — вероятность перехода,{" "}
        <Math display={false}>{String.raw`R(s,a)`}</Math> — функция награды,{" "}
        <Math display={false}>{String.raw`\enfPar{\gamma} \in [0,1)`}</Math> — коэффициент дисконтирования.
        Марковское свойство означает, что распределение следующего состояния зависит только от
        текущего состояния и действия, а не от истории.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Цель агента</strong> — найти политику{" "}
        <Math display={false}>{String.raw`\pi^*`}</Math>, максимизирующую ожидаемую дисконтированную
        сумму наград:
      </p>
      <Math>{String.raw`\enfTgt{J}(\pi) = \mathbb{E}_{\tau \sim \pi}\!\left[\sum_{t=0}^{\infty} \enfPar{\gamma}^t \enfTgt{r}_t\right].`}</Math>
      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Функция ценности состояния</strong> определяется рекурсивно через{" "}
        <HubLink to="/hub/math-rl" anchor="уравнение-ожиданий-беллмана">уравнение Беллмана</HubLink>:
      </p>
      <Math>{String.raw`\enfOp{V}^\pi(\enfVar{s}) = \mathbb{E}_{a \sim \pi,\, s'\sim P}\!\left[\enfTgt{R}(\enfVar{s},a) + \enfPar{\gamma} \enfOp{V}^\pi(\enfVar{s}')\right].`}</Math>
      <p className="text-muted-foreground leading-relaxed">
        Для оптимальной политики справедливо{" "}
        <HubLink to="/hub/math-rl" anchor="уравнение-оптимальности-беллмана">уравнение оптимальности Беллмана</HubLink>:
      </p>
      <Math>{String.raw`\enfOp{V}^*(\enfVar{s}) = \max_{a \in \mathcal{A}} \mathbb{E}_{s'}\!\left[\enfTgt{R}(\enfVar{s},a) + \enfPar{\gamma} \enfOp{V}^*(\enfVar{s}')\right], \qquad \enfOp{Q}^*(\enfVar{s},a) = \mathbb{E}_{s'}\!\left[\enfTgt{R}(\enfVar{s},a) + \enfPar{\gamma} \max_{a'} \enfOp{Q}^*(\enfVar{s}',a')\right].`}</Math>
      <p className="text-muted-foreground leading-relaxed text-sm">
        Уравнение Беллмана — основа всех современных RL-алгоритмов: глубокие нейросети учатся аппроксимировать
        либо <Math display={false}>{String.raw`\enfOp{V}^*/\enfOp{Q}^*`}</Math>, либо политику{" "}
        <Math display={false}>{String.raw`\pi^*`}</Math>, минимизируя отклонение от этих рекурсивных тождеств.
      </p>
    </div>

    {/* 1.3 Дискретное и непрерывное */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">
        1.3. Дискретное и непрерывное пространство действий
      </h3>
      <ul className="space-y-3 text-muted-foreground leading-relaxed">
        <li>
          <strong className="text-foreground">Дискретное пространство</strong>{" "}
          (<Math display={false}>{String.raw`\mathcal{A} = \{0,1,\ldots,K-1\}`}</Math>): агент выбирает одно
          из конечного числа действий. Политика — категориальное распределение{" "}
          <Math display={false}>{String.raw`\pi(a\mid \enfVar{s}) = \operatorname{softmax}(\phi_\theta(\enfVar{s}))`}</Math>.
        </li>
        <li>
          <strong className="text-foreground">Непрерывное пространство</strong>{" "}
          (<Math display={false}>{String.raw`\mathcal{A} \subseteq \mathbb{\enfTgt{R}}^d`}</Math>): действие — вектор
          вещественных чисел. В ML-Agents политика для непрерывных действий — мультивариативное Гауссово
          распределение{" "}
          <Math display={false}>{String.raw`\pi_\theta(a\mid \enfVar{s}) = \mathcal{N}(\mu_\theta(\enfVar{s}), \sigma_\theta(\enfVar{s}))`}</Math>.
        </li>
      </ul>
    </div>

    {/* 1.4 Почему непрерывные действия */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">
        1.4. Почему непрерывные действия для управления автомобилем
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        Управление транспортным средством физически требует <strong className="text-foreground">плавных,
        мелкоразрешённых сигналов</strong>: угол поворота руля{" "}
        <Math display={false}>{String.raw`\delta \in [-\delta_{\max}, +\delta_{\max}]`}</Math>,
        нормированная сила тяги{" "}
        <Math display={false}>{String.raw`u_{\text{accel}} \in [0,1]`}</Math>,
        сила торможения{" "}
        <Math display={false}>{String.raw`u_{\text{brake}} \in [0,1]`}</Math>.
        Дискретизация (например, «руль = {"{"}−1, 0, +1{"}"}) приводит к рывкам, потере
        устойчивости и неоптимальным траекториям на поворотах. Непрерывное управление позволяет
        агенту изучать тонкие манёвры — «лёгкое подруливание» и «постепенное оттормаживание
        перед поворотом».
      </p>
      <p className="text-muted-foreground leading-relaxed text-sm">
        В ML-Agents непрерывные действия по умолчанию клиппируются в диапазон{" "}
        <Math display={false}>{String.raw`[-1, 1]`}</Math> на выходе политики PPO. Согласно
        официальной документации Unity:{" "}
        <em>«By default the output from our provided PPO algorithm pre-clamps the values of{" "}
        ActionBuffers.ContinuousActions into the [−1, 1] range. It is a best practice to
        manually clip these as well».</em>
      </p>
      <Card className="border-cyan-500/20 bg-cyan-500/5 p-4">
        <p className="text-sm text-cyan-200 font-medium">
          Ключевые моменты раздела 1: RL формализует задачу как MDP; уравнение Беллмана связывает
          ценности соседних состояний; для гоночного управления нужны непрерывные действия,
          реализующиеся через массив{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">ActionBuffers.ContinuousActions</code>.
        </p>
      </Card>
    </div>
  </div>
);

export default IntroSection;
