import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import {
  Building2,
  Cloud,
  FlaskConical,
  Search,
  Database,
  FileText,
  Table as TableIcon,
  Lightbulb,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const TIERS = [
  {
    name: "Personal",
    price: "Free",
    border: "border-cyan-500/30",
    title: "text-cyan-300",
    badge: null as string | null,
    items: [
      "Unlimited tracking hours",
      "100 GB cloud storage",
      "Только личные проекты",
    ],
  },
  {
    name: "Academic",
    price: "Free Pro",
    border: "border-purple-500/30",
    title: "text-purple-300",
    badge: "Рекомендуем студентам",
    items: [
      "Все Pro-фичи",
      "200 GB cloud storage",
      "До 100 seats",
      "Для .edu email",
    ],
  },
  {
    name: "Teams",
    price: "$50/user/mo",
    border: "border-pink-500/30",
    title: "text-pink-300",
    badge: null,
    items: [
      "Для команд от 2 человек",
      "SSO, advanced permissions",
      "Enterprise — custom",
    ],
  },
];

const COMPONENTS = [
  {
    icon: FlaskConical,
    title: "Experiments",
    desc: "wandb.init(), wandb.log({...}), wandb.config; scalars, histograms, images, audio, video, 3D-meshes, HTML, Plotly, tables.",
  },
  {
    icon: Search,
    title: "Sweeps",
    desc: "Гиперпараметрическая оптимизация (grid, random, bayes, Hyperband).",
  },
  {
    icon: Database,
    title: "Artifacts",
    desc: "Версионирование датасетов / моделей / чекпоинтов с дедупликацией по хешам и lineage.",
  },
  {
    icon: FileText,
    title: "Reports",
    desc: "Интерактивные документы с встроенными живыми графиками.",
  },
  {
    icon: TableIcon,
    title: "Tables",
    desc: "Interactive dataframes для (state_image, action, predicted_q, reward).",
  },
];

const PROS = [
  "Collaboration: Reports, общие dashboards",
  "Bayesian sweeps + Hyperband",
  "Artifacts с дедупликацией и lineage",
  "Нативный video logging из gym",
  "Persistent cloud storage",
  "Хороший mobile UI",
];

const CONS = [
  "Облачный (для приватных данных — W&B Server / on-prem)",
  "Платный для команд",
  "Требует интернет (есть offline mode + wandb sync)",
];

const SB3_WANDB = `import gymnasium as gym, wandb
from wandb.integration.sb3 import WandbCallback
from stable_baselines3 import PPO
from stable_baselines3.common.monitor import Monitor
from stable_baselines3.common.vec_env import DummyVecEnv, VecVideoRecorder

config = {"policy_type": "MlpPolicy", "total_timesteps": 100_000,
          "env_name": "LunarLander-v2", "seed": 1}

run = wandb.init(project="rl-course", config=config,
                 sync_tensorboard=True,    # читает SB3 event-файлы
                 monitor_gym=True,          # авто-загрузка видео
                 save_code=True)

def make_env():
    return Monitor(gym.make(config["env_name"], render_mode="rgb_array"))

env = DummyVecEnv([make_env])
env = VecVideoRecorder(env, f"videos/{run.id}",
                       record_video_trigger=lambda x: x % 20_000 == 0,
                       video_length=500)

model = PPO(config["policy_type"], env, verbose=1, seed=config["seed"],
            tensorboard_log=f"runs/{run.id}")
model.learn(total_timesteps=config["total_timesteps"],
            callback=WandbCallback(gradient_save_freq=1000,
                                   model_save_path=f"models/{run.id}",
                                   model_save_freq=10_000, verbose=2))
run.finish()
`;

const SWEEP_YAML = `program: train_ppo.py
method: bayes
metric:
  name: rollout/ep_rew_mean
  goal: maximize
parameters:
  learning_rate:
    distribution: log_uniform_values
    min: 1e-5
    max: 1e-3
  gamma:        { values: [0.95, 0.99, 0.995] }
  n_steps:      { values: [1024, 2048, 4096] }
  ent_coef:
    distribution: log_uniform_values
    min: 1e-4
    max: 1e-1
early_terminate:
  type: hyperband
  min_iter: 50_000
`;

const WandbSection = () => {
  return (
    <div className="space-y-8">
      {/* History + Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card/60 border-purple-500/20 backdrop-blur-sm">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-400" />
              <h4 className="text-lg font-bold text-purple-300">
                История и компания
              </h4>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              W&amp;B основана в <strong>2017 году</strong> Lukas Biewald, Chris
              Van Pelt и Shawn Lewis (штаб-квартира в Сан-Франциско). CoreWeave
              объявила о приобретении W&amp;B 4 марта 2025 года, сделка закрыта{" "}
              <strong>5 мая 2025</strong> (The Information сообщил сумму ≈$1.7
              млрд). Продукт продолжает работать в обычном режиме.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-pink-500/20 backdrop-blur-sm">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-pink-400" />
              <h4 className="text-lg font-bold text-pink-300">Архитектура</h4>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              Cloud-based SaaS (есть on-prem W&amp;B Server). Иерархия:{" "}
              <strong>Entity → Project → Run</strong>. Каждый Run —
              иммутабельный объект с метриками, конфигом, кодом, артефактами и
              системными статами.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tiers */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground">Тарифы 2026</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIERS.map((t) => (
            <Card
              key={t.name}
              className={`relative bg-card/60 backdrop-blur-sm transition-all hover:scale-[1.02] ${t.border}`}
            >
              {t.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-[0_0_14px_hsl(280_85%_65%/0.5)]">
                  {t.badge}
                </Badge>
              )}
              <CardContent className="p-6 space-y-3 pt-7">
                <div className="space-y-1">
                  <h4 className={`text-lg font-bold ${t.title}`}>{t.name}</h4>
                  <div className="text-2xl font-bold text-foreground">
                    {t.price}
                  </div>
                </div>
                <ul className="space-y-2 pt-2 border-t border-border/40">
                  {t.items.map((it) => (
                    <li
                      key={it}
                      className="flex gap-2 text-sm text-foreground/90"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 5 components */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground">
          Пять ключевых компонентов
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {COMPONENTS.map(({ icon: Icon, title, desc }) => (
            <Card
              key={title}
              className="bg-card/60 border-purple-500/15 backdrop-blur-sm hover:border-purple-400/50 hover:shadow-[0_0_18px_hsl(280_85%_65%/0.25)] transition-all"
            >
              <CardContent className="p-4 space-y-2">
                <Icon className="w-6 h-6 text-purple-400" />
                <h4 className="font-bold text-sm text-foreground leading-tight">
                  {title}
                </h4>
                <p className="text-xs text-muted-foreground leading-snug">
                  {desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* SB3 + W&B example */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-foreground">
          Базовый пример SB3 + W&amp;B
        </h3>
        <CyberCodeBlock language="python" filename="train_ppo_wandb.py">
          {SB3_WANDB}
        </CyberCodeBlock>
        <div className="rounded-r-2xl border-l-4 border-yellow-500 bg-yellow-500/5 p-4 flex gap-3">
          <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90 leading-relaxed">
            <code className="text-xs">
              wandb.watch(model, log="all", log_freq=500)
            </code>{" "}
            добавляет хуки в PyTorch autograd и логирует гистограммы весов и
            градиентов — отличный способ ловить vanishing/exploding gradients
            без дополнительного кода.
          </p>
        </div>
      </div>

      {/* Sweep YAML */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-foreground">
          Пример W&amp;B Sweep для RL
        </h3>
        <CyberCodeBlock language="yaml" filename="sweep.yaml">
          {SWEEP_YAML}
        </CyberCodeBlock>
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Запуск:</strong>{" "}
          <code className="text-xs">wandb sweep sweep.yaml</code> →{" "}
          <code className="text-xs">wandb agent &lt;ID&gt;</code>.
        </p>
      </div>

      {/* Pros / Cons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-emerald-500/5 border-emerald-500/30 backdrop-blur-sm">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-lg font-bold text-emerald-300">Плюсы</h4>
            </div>
            <ul className="space-y-2">
              {PROS.map((p) => (
                <li key={p} className="flex gap-2 text-sm text-foreground/90">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-red-500/5 border-red-500/30 backdrop-blur-sm">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <h4 className="text-lg font-bold text-red-300">Минусы</h4>
            </div>
            <ul className="space-y-2">
              {CONS.map((c) => (
                <li key={c} className="flex gap-2 text-sm text-foreground/90">
                  <span className="text-red-400 mt-0.5">✗</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WandbSection;
