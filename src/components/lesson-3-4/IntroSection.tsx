import { Card, CardContent } from "@/components/ui/card";
import TldrBox from "@/components/ui/TldrBox";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import Math from "@/components/Math";
import { Users, Copy, Swords, ShieldCheck, GitBranch } from "lucide-react";

const KEY_FINDINGS = [
  {
    title: "BC = MLE над (s, a)",
    text:
      "Дискретные действия — кросс-энтропия, непрерывные — MSE или NLL гауссовой политики. Прямое supervised-обучение на парах эксперта.",
    icon: Copy,
    color: "cyan",
  },
  {
    title: "Квадратичный дефект BC",
    text:
      "Теорема Ross & Bagnell (2010): J(π) ≤ J(π*) + T²·ε. Граница тугая. DAgger даёт линейную O(T·ε) ценой онлайн-дозапросов эксперта.",
    icon: Swords,
    color: "purple",
  },
  {
    title: "GAIL = RL ∘ IRL в одном минимаксе",
    text:
      "Регуляризатор ψGA из Ho & Ermon (2016) превращает occupancy matching в GAN: дискриминатор vs политика, эквивалентно JS-дивергенции.",
    icon: GitBranch,
    color: "pink",
  },
  {
    title: "AIRL — disentangled reward",
    text:
      "Если нужна переносимость в среды с другой динамикой — берите AIRL: восстанавливает истинную награду, инвариантную к dynamics shift.",
    icon: ShieldCheck,
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
            Imitation Learning: учим агента у эксперта
          </h3>
          <p className="text-foreground/80 leading-relaxed">
            Когда награду тяжело спроектировать, а демонстраций эксперта получить просто, дешевле
            показать поведение, чем кодировать его в reward-функцию. Урок строит мост от{" "}
            <strong className="text-cyan-300">Behavioral Cloning</strong> через{" "}
            <strong className="text-cyan-300">IRL</strong> к{" "}
            <strong className="text-cyan-300">GAIL</strong> и его варианту{" "}
            <strong className="text-foreground">AIRL</strong>, а затем переводит всё это в живой
            YAML-конфиг <code className={chip}>com.unity.ml-agents@4.0</code> для гоночного агента из{" "}
            <CrossLinkToHub hubPath="/courses/project-3" hubTitle="Проект 3 — гоночный агент">
              Проекта 3
            </CrossLinkToHub>
            .
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Уровень:</strong> 3 (продвинутый) ·{" "}
            <strong>Сквозной пример:</strong> гоночный PPO-агент + человеческие демо-заезды ·{" "}
            <strong>Тип:</strong> урок-нарратив с формальными выкладками.
          </p>
        </div>
        <div className="shrink-0 w-20 h-20 rounded-2xl border border-cyan-400/40 bg-cyan-500/10 flex items-center justify-center shadow-[0_0_32px_hsl(var(--primary)/0.45)]">
          <Users className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
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
            <strong>PPO</strong> и GAE —{" "}
            <CrossLinkToHub hubPath="/courses/3-1" hubAnchor="ppo" hubTitle="Урок 3.1 — PPO">
              урок 3.1
            </CrossLinkToHub>{" "}
            и хаб{" "}
            <CrossLinkToHub hubPath="/algorithms/ppo" hubTitle="Алгоритмы → PPO">
              PPO ↗
            </CrossLinkToHub>
            .
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            <strong>Curriculum &amp; Domain Randomization</strong> —{" "}
            <CrossLinkToHub hubPath="/courses/3-3" hubTitle="Урок 3.3">
              урок 3.3
            </CrossLinkToHub>
            ; рандомизация трасс ляжет поверх GAIL.
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            <strong>MLE, кросс-энтропия, KL/JS-дивергенция</strong> — хаб{" "}
            <CrossLinkToHub hubPath="/math-rl/module-3" hubTitle="Математика → Вероятность и информация">
              Вероятность и информация ↗
            </CrossLinkToHub>
            .
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            <strong>GAN-минимакс</strong> (Goodfellow и др., 2014) — пригодится для понимания
            дискриминатор/генератор-чередования в GAIL.
          </span>
        </li>
        <li className="flex gap-2.5">
          <span className="text-purple-400 mt-0.5 shrink-0">▸</span>
          <span>
            <strong>Гоночный агент на PPO</strong> из{" "}
            <CrossLinkToHub hubPath="/courses/project-3" hubTitle="Проект 3">
              Проекта 3
            </CrossLinkToHub>{" "}
            — сквозной пример урока (демо-заезды → BC-warmup → GAIL).
          </span>
        </li>
      </ul>
    </div>

    {/* TL;DR */}
    <TldrBox
      title="🎯 TL;DR — что вы поймёте к концу урока"
      items={[
        <>
          <strong>Behavioral Cloning</strong> — обычное supervised-обучение на парах{" "}
          <Math display={false}>{String.raw`(s,a)`}</Math> эксперта; страдает от{" "}
          <strong>covariate shift</strong>: по теореме 2.1 Ross &amp; Bagnell (2010) ошибка растёт как{" "}
          <Math display={false}>{String.raw`O(T^2\epsilon)`}</Math> против{" "}
          <Math display={false}>{String.raw`O(T\epsilon)`}</Math> у методов со средой. Поэтому BC в
          ML-Agents — это <strong>warmup</strong>, а не самостоятельный метод.
        </>,
        <>
          <strong>GAIL</strong> (Ho &amp; Ermon, 2016) выводится из max-entropy IRL через{" "}
          <em>occupancy measure</em> и сводит имитацию к GAN-минимаксу{" "}
          <Math display={false}>
            {String.raw`\min_\pi\max_D \mathbb{E}_\pi[\log D]+\mathbb{E}_{\pi_E}[\log(1-D)]-\lambda H(\pi)`}
          </Math>
          {" "}с наградой{" "}
          <Math display={false}>{String.raw`r(s,a)=-\log(1-D(s,a))`}</Math>; на порядок экономнее по
          числу демо, чем классический IRL.
        </>,
        <>
          <strong>Рецепт для гоночного агента в ML-Agents</strong>{" "}
          (<code className={chip}>com.unity.ml-agents@4.0</code>): записать демо через{" "}
          <code className={chip}>Demonstration Recorder</code> → включить{" "}
          <code className={chip}>behavioral_cloning</code> (
          <code className={chip}>strength ≈ 0.3–0.5</code>,{" "}
          <code className={chip}>steps ≈ 100k–500k</code>) для разгона → продолжить{" "}
          <code className={chip}>ppo</code> с{" "}
          <code className={chip}>reward_signals: gail</code> (
          <code className={chip}>strength 0.01–0.1</code> при человеческих демо) +{" "}
          <code className={chip}>extrinsic</code> shaping; рандомизацию из урока 3.3 наложить сверху.
        </>,
      ]}
    />

    {/* 🔗 кросс-ссылки note */}
    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm p-5 text-sm text-foreground/80 leading-relaxed">
      <strong className="text-cyan-300">🔗 Как читать кросс-ссылки.</strong> Значок{" "}
      <span className="text-cyan-300">↗</span> ведёт в <strong>хаб</strong> с формальной глубиной
      (определения, доказательства). Обычные ссылки — в другие <strong>уроки</strong>, к разделу, где
      понятие уже разбиралось. По оглавлению в шапке можно прыгать между разделами; хабы возвращают
      вас в тот же раздел, из которого вы ушли.
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
