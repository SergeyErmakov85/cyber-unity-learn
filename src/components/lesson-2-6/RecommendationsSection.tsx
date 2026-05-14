import { Card, CardContent } from "@/components/ui/card";
import {
  Rocket,
  Cloud,
  CheckCircle2,
  XCircle,
  ExternalLink,
  OctagonAlert,
} from "lucide-react";
import CyberCodeBlock from "@/components/CyberCodeBlock";

const START_STEPS = [
  <>
    Установите зависимости:
    <CyberCodeBlock language="pseudo" filename="install.sh">
      pip install stable-baselines3[extra] tensorboard wandb gymnasium
    </CyberCodeBlock>
  </>,
  <>
    Первые 1–3 эксперимента — только TensorBoard (
    <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
      tensorboard_log="./tb/"
    </code>{" "}
    в SB3). Поймёте базовый набор метрик.
  </>,
  <>
    Откройте{" "}
    <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
      tensorboard --logdir ./tb/
    </code>{" "}
    и научитесь читать{" "}
    <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
      train/approx_kl
    </code>
    ,{" "}
    <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
      train/explained_variance
    </code>
    ,{" "}
    <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
      rollout/ep_rew_mean
    </code>
    .
  </>,
];

const SWITCH_TRIGGERS = [
  "Как только появится >5 экспериментов",
  "Если работаете в команде",
  "Если результаты идут в диплом / публикацию",
  "Если запускаете на удалённом сервере и хотите смотреть с телефона",
];

const DOS = [
  {
    h: "Что логировать",
    t: "ep_rew_mean (mean/std/min/max), все train/* из SB3, gradient norms через wandb.watch, минимум одно eval-видео в 20–50k шагов, чекпоинт каждые 100k как Artifact.",
  },
  {
    h: "Как часто",
    t: "scalars — каждый rollout (n_steps), гистограммы — раз в 1000 шагов, видео — раз в 20–50k шагов.",
  },
  {
    h: "Naming",
    t: "category/metric_name (rollout/ep_rew_mean, train/approx_kl) — совместимо с SB3 и CleanRL.",
  },
  {
    h: "Конфиг",
    t: "всё в wandb.config или в YAML под Git; обязательно сохраняйте seed.",
  },
  {
    h: "Группировка",
    t: 'wandb.init(group="ppo_lunarlander", name=f"seed{SEED}").',
  },
];

const DONTS = [
  "Логировать каждый шаг (раздувает event files в 10×, тормозит UI).",
  "Не сохранять seed (нельзя воспроизвести).",
  "Запускать один сид и делать выводы.",
  "Сравнивать алгоритмы по одной метрике («PPO лучше A2C, ep_rew_mean выше на 5%» — обычно шум, нужен IQM по 5+ сидам).",
  "Логировать только mean reward, игнорируя entropy/KL/explained_variance.",
  "Не логировать гиперпараметры в wandb.config / add_hparams.",
];

const RecommendationsSection = () => (
  <div className="space-y-8">
    {/* Start */}
    <Card className="bg-card/60 backdrop-blur-sm border-cyan-500/20 border-l-4 border-l-cyan-500">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-foreground">С чего начать</h3>
        </div>
        <ol className="space-y-3 list-decimal list-inside text-sm text-muted-foreground leading-relaxed marker:text-cyan-400 marker:font-bold">
          {START_STEPS.map((s, i) => (
            <li key={i} className="pl-1">
              <span className="text-foreground/90">{s}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>

    {/* Switch to W&B */}
    <Card className="bg-card/60 backdrop-blur-sm border-purple-500/20 border-l-4 border-l-purple-500">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Cloud className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-bold text-foreground">
            Когда переходить на W&amp;B
          </h3>
        </div>
        <ul className="space-y-2 text-sm">
          {SWITCH_TRIGGERS.map((t) => (
            <li key={t} className="flex items-start gap-2 text-muted-foreground">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <a
          href="https://wandb.ai/site/research"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/40 text-purple-200 font-semibold text-sm transition-all hover:scale-[1.02] hover:border-purple-300/70 hover:shadow-[0_0_24px_hsl(280_85%_65%/0.4)]"
        >
          Зарегистрировать Academic-аккаунт W&amp;B
          <ExternalLink className="w-4 h-4" />
        </a>
      </CardContent>
    </Card>

    {/* Best practices */}
    <div>
      <h3 className="text-lg font-bold text-foreground mb-3">
        Best practices логирования
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-emerald-500/5 border-emerald-500/30 border-l-4 border-l-emerald-500">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-emerald-300">Делай так</h4>
            </div>
            <ul className="space-y-3 text-sm">
              {DOS.map((d) => (
                <li key={d.h} className="text-muted-foreground">
                  <span className="font-semibold text-foreground/90">
                    {d.h}:
                  </span>{" "}
                  {d.t}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-red-500/5 border-red-500/30 border-l-4 border-l-red-500">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <h4 className="font-bold text-red-300">Антипаттерны</h4>
            </div>
            <ul className="space-y-2 text-sm">
              {DONTS.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2 text-muted-foreground"
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Stop trigger */}
    <Card className="bg-red-500/10 border-red-500/30 backdrop-blur-sm shadow-[0_0_28px_hsl(0_85%_60%/0.18)]">
      <CardContent className="p-6 flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl border border-red-400/50 bg-red-500/20 flex items-center justify-center shrink-0 shadow-[0_0_24px_hsl(0_85%_60%/0.45)]">
          <OctagonAlert className="w-7 h-7 text-red-300" />
        </div>
        <div className="space-y-1.5">
          <h4 className="font-bold text-red-300">
            Триггер для немедленной остановки обучения
          </h4>
          <p className="text-sm text-foreground/90 leading-relaxed">
            entropy → 0 в первой трети обучения, или approx_kl &gt; 0.05
            устойчиво, или explained_variance ≈ 0 дольше 100k шагов — остановите
            и идите дебажить, не ждите чуда. Это экономит часы GPU.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default RecommendationsSection;
