import { Card, CardContent } from "@/components/ui/card";
import TldrBox from "@/components/ui/TldrBox";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import Math from "@/components/Math";
import { Rocket, FileBox, Cpu, Settings, Gauge } from "lucide-react";

const KEY_FINDINGS = [
  {
    title: "ONNX — слепок политики",
    text:
      "Открытый кроссплатформенный граф для инференса: веса + структура, без состояния оптимизатора. Совместимость задаётся opset и именами входов obs_…",
    icon: FileBox,
    color: "cyan",
  },
  {
    title: "Инференс делает Unity",
    text:
      "Barracuda → Sentis → Unity Inference Engine — это эволюция одного движка. ML-Agents подключает его сам; код инференса писать не нужно.",
    icon: Cpu,
    color: "purple",
  },
  {
    title: "Точка стыковки — Behavior Parameters",
    text:
      "Перетащил .onnx в поле Model, выбрал Inference Device, поставил Inference Only — агент думает локально, без Python.",
    icon: Settings,
    color: "pink",
  },
  {
    title: "CPU обычно быстрее GPU",
    text:
      "Маленькие ML-Agents-сети выигрывают на CPU. GPU оправдан только под ResNet-зрение или массу визуальных агентов. Бюджет кадра держится Decision Period.",
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
            Деплой модели: ONNX-экспорт и интеграция в Unity-сборку
          </h3>
          <p className="text-foreground/80 leading-relaxed">
            Обучение жило в Python-процессе и говорило с Unity через сокет. Игрок никакого Python не
            запустит — обученную политику{" "}
            <Math display={false}>{String.raw`\pi_\theta(a\mid \enfVar{s})`}</Math> нужно{" "}
            <strong className="text-cyan-300">вынуть из тренировочного контура</strong> и зашить
            прямо в Unity-билд через формат <code className={chip}>.onnx</code>. Урок проводит весь
            путь от файла <code className={chip}>results/race_v7/RaceAgent.onnx</code> до агента,
            который крутит руль в собранном <code className={chip}>.exe</code> (или на Android/WebGL),
            и разбирает, что может пойти не так на каждом шаге — на сквозном примере гоночного агента
            из{" "}
            <CrossLinkToHub hubPath="/courses/project-3" hubTitle="Проект 3 — гоночный агент">
              Проекта 3
            </CrossLinkToHub>
            .
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Уровень:</strong> 3 (продвинутый) · <strong>Раздел курса:</strong> 3.5 ·{" "}
            <strong>Сквозной пример:</strong> гоночный агент Уровня 3.
          </p>
        </div>
        <div className="shrink-0 w-20 h-20 rounded-2xl border border-cyan-400/40 bg-cyan-500/10 flex items-center justify-center shadow-[0_0_32px_hsl(var(--primary)/0.45)]">
          <Rocket className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
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
            что такое политика <Math display={false}>{String.raw`\pi_\theta(a\mid \enfVar{s})`}</Math> и как
            её обучает PPO/SAC —{" "}
            <CrossLinkToHub
              hubPath="/courses/3-1"
              hubAnchor="раздел-2-maximum-entropy-rl-objective"
              hubTitle="Урок 3.1 — SAC/PPO"
            >
              урок 3.1
            </CrossLinkToHub>
            ;
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            как мы дообучили гоночного агента через BC-разогрев и GAIL —{" "}
            <CrossLinkToHub
              hubPath="/courses/3-4"
              hubAnchor="razdel-8-pipeline"
              hubTitle="Урок 3.4 — Imitation Learning"
            >
              урок 3.4
            </CrossLinkToHub>
            ;
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            зачем нужна доменная рандомизация для устойчивости —{" "}
            <CrossLinkToHub
              hubPath="/courses/3-3"
              hubAnchor="razdel-4-randomizatsiya"
              hubTitle="Урок 3.3 — Curriculum & Randomization"
            >
              урок 3.3
            </CrossLinkToHub>
            ;
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            как читать кривые в TensorBoard —{" "}
            <CrossLinkToHub
              hubPath="/courses/2-6"
              hubAnchor="tensorboard"
              hubTitle="Урок 2.6 — TensorBoard и W&B"
            >
              урок 2.6
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
          Почему обученная политика выезжает из Python в Unity именно в формате <strong>ONNX</strong>,
          а не как <code className={chip}>.pt</code>-чекпойнт, и где физически лежит финальная модель
          после <code className={chip}>mlagents-learn</code>.
        </>,
        <>
          Что такое <strong>инференс-движок Unity</strong> (Barracuda → Sentis → Inference Engine) и
          почему для типового ML-Agents-проекта код инференса писать почти никогда не приходится.
        </>,
        <>
          Как встроить <code className={chip}>.onnx</code> в агента через{" "}
          <strong>Behavior Parameters</strong>, выбрать <strong>Inference Device</strong> (CPU/GPU),
          настроить <strong>Behavior Type</strong> и частоту решений{" "}
          <strong>DecisionRequester</strong>.
        </>,
        <>
          Как собрать билд под PC/Mobile/WebGL и продиагностировать самый частый класс ошибок деплоя
          — <strong>рассинхрон пространств наблюдений и действий</strong> между обучением и сценой.
        </>,
      ]}
    />

    {/* 🔗 кросс-ссылки note */}
    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm p-5 text-sm text-foreground/80 leading-relaxed">
      <strong className="text-cyan-300">🧭 Как читать кросс-ссылки.</strong> Значок{" "}
      <span className="text-cyan-300">↗</span> ведёт в <strong>хаб</strong> — туда, где понятие
      разбирается формально и подробно (математика, спецификации, таблицы полей). Значок{" "}
      <span className="text-cyan-300">↩</span> ведёт в <strong>предыдущий урок</strong> — на
      конкретный раздел, который мы здесь не переобъясняем, а только напоминаем одной фразой. Внутри
      урока переходы между разделами — по якорям оглавления вверху страницы.
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
