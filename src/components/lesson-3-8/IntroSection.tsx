import { Card, CardContent } from "@/components/ui/card";
import TldrBox from "@/components/ui/TldrBox";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import Math from "@/components/Math";
import { Trophy, Gamepad2, Cpu, Rocket, Sparkles, Layers } from "lucide-react";

const chip = "px-1.5 py-0.5 rounded bg-muted/50 text-xs font-mono";

const KEY_FINDINGS = [
  {
    title: "Системная сборка",
    text: "Финальный проект — это конвейер из шести этапов: среда → награда → обучение → оптимизация → деплой → геймплей. Слабое звено рушит результат.",
    icon: Layers,
    color: "cyan",
  },
  {
    title: "Награда решает",
    text: "Агент оптимизирует написанное, а не задуманное. Дизайн награды (потенциальное шейпинг, защита от reward hacking) важнее гиперпараметров.",
    icon: Trophy,
    color: "purple",
  },
  {
    title: "ONNX → Sentis",
    text: "Деплой = ONNX из ML-Agents → Behavior Type: Inference Only → Unity Sentis (заменил Barracuda). При необходимости — квантизация под мобайл.",
    icon: Cpu,
    color: "pink",
  },
  {
    title: "Сертификат",
    text: "Обязательный конвейер + минимум два бонуса (Curriculum, Self-Play, GAIL, Optuna, квантизация, W&B) открывают сертификат об окончании курса.",
    icon: Rocket,
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
    <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1 space-y-3">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            Финальный проект: полноценная игра с обученным NPC
          </h3>
          <p className="text-foreground/80 leading-relaxed">
            Кульминация курса. Вы собираете <strong className="text-cyan-300">весь конвейер RL-в-gamedev</strong> в одно целое:
            от пустой Unity-сцены до играбельного билда, где поведением NPC управляет ваша обученная политика
            <Math display={false}>{String.raw`\;\pi_\theta(a\mid \enfVar{s})`}</Math>. Шесть этапов, четыре эталонных проекта, три бонусные техники.
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Уровень:</strong> 3 (продвинутый) · <strong>Раздел программы:</strong> 3.8 · <strong>Доступ:</strong> PRO
          </p>
        </div>
        <div className="shrink-0 w-20 h-20 rounded-2xl border border-cyan-400/40 bg-cyan-500/10 flex items-center justify-center shadow-[0_0_32px_hsl(var(--primary)/0.45)]">
          <Gamepad2 className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
        </div>
      </CardContent>
    </Card>

    <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm p-5 text-sm text-foreground/85 leading-relaxed">
      <strong className="text-purple-300">Предполагается, что вы знаете:</strong>
      <ul className="space-y-2 mt-3">
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            SAC и весь язык RL — MDP, политика, <Math display={false}>{String.raw`V/Q`}</Math>, actor-critic, replay buffer, энтропия, target-сети, два критика —{" "}
            <CrossLinkToLesson lessonId="3.1" lessonPath="/courses/3-1" lessonTitle="Урок 3.1 — SAC" lessonLevel={3}>урок 3.1</CrossLinkToLesson>;
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            MARL, нестационарность, CTDE, контрфактический бейзлайн, Self-Play, ELO —{" "}
            <CrossLinkToLesson lessonId="3.2" lessonPath="/courses/3-2" lessonTitle="Урок 3.2 — MA-POCA/Self-Play" lessonLevel={3}>урок 3.2</CrossLinkToLesson>;
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            непрерывные действия и Actor-Critic —{" "}
            <CrossLinkToLesson lessonId="2.3" lessonPath="/courses/2-3" lessonTitle="Урок 2.3 — Непрерывные действия" lessonLevel={2}>урок 2.3</CrossLinkToLesson>; диагностику обучения по TensorBoard и логирование в W&B —{" "}
            <CrossLinkToLesson lessonId="2.6" lessonPath="/courses/2-6" lessonTitle="Урок 2.6 — TensorBoard и W&B" lessonLevel={2}>урок 2.6</CrossLinkToLesson>;
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            сборку PPO-агента на практике —{" "}
            <CrossLinkToLesson lessonId="project-3" lessonPath="/courses/project-3" lessonTitle="Проект 3 — Гоночный агент" lessonLevel={3}>проект 3</CrossLinkToLesson>.
          </span>
        </li>
      </ul>
    </div>

    <TldrBox
      title="🎓 Что вы поймёте к концу урока"
      items={[
        <>Как собрать <strong>весь конвейер</strong> RL-в-gamedev в одно целое: от пустой Unity-сцены до играбельного билда с обученным NPC.</>,
        <>Шесть этапов финального проекта и сколько времени закладывать на каждый.</>,
        <>Как проектировать <strong>функцию награды</strong>, которая обучает то, что вы задумали, а не то, что проще «взломать».</>,
        <>Как написать рабочий <strong>YAML-конфиг</strong> под PPO/SAC/MA-POCA и запустить обучение с параллельными средами.</>,
        <>Как <strong>оптимизировать</strong> гиперпараметры через Optuna + W&B и структурировать результаты через FCA-анализ.</>,
        <>Как <strong>экспортировать ONNX</strong>, подключить модель к <code className={chip}>BehaviorParameters</code> и запустить инференс в Unity Sentis, в том числе с квантизацией под мобильные.</>,
        <>Как добавить три бонусные техники: <strong>Curriculum Learning</strong>, <strong>Self-Play</strong> и <strong>GAIL/имитационное обучение</strong>.</>,
        <>Четыре эталонных проекта (арена-шутер, спорт, гонки, tower defense), каждый — от замысла до реализации.</>,
      ]}
    />

    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm p-5 text-sm text-foreground/80 leading-relaxed">
      <strong className="text-cyan-300">🧭 Как читать кросс-ссылки.</strong> Стрелка ↗ ведёт в <strong>хаб</strong> — туда вынесена строгая математика и доказательства. Ссылки вида «урок X.Y» ведут к конкретному разделу пройденного урока: если понятие уже объяснялось, мы его <strong>не повторяем</strong>, а ставим ссылку. Внутри этого урока переходы между разделами — по оглавлению-навигации вверху страницы.
    </div>

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

    <div className="flex items-center justify-center gap-2 text-cyan-400/60 text-xs">
      <Sparkles className="w-3 h-3" />
      <span>Урок 3.8 — финальный проект курса: сборка играбельного билда с обученным NPC</span>
      <Sparkles className="w-3 h-3" />
    </div>
  </div>
);

export default IntroSection;
