import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Package } from "lucide-react";
import CyberCodeBlock from "@/components/CyberCodeBlock";

const FULL_PPO = `import gymnasium as gym, wandb
from stable_baselines3 import PPO
from stable_baselines3.common.callbacks import EvalCallback, CallbackList
from stable_baselines3.common.monitor import Monitor
from stable_baselines3.common.vec_env import DummyVecEnv
from wandb.integration.sb3 import WandbCallback

SEED = 1
config = dict(env_id="LunarLander-v2", total_timesteps=500_000,
              lr=3e-4, n_steps=1024, gamma=0.999, gae_lambda=0.98,
              ent_coef=0.01, batch_size=64, seed=SEED)

run = wandb.init(project="rl-course", config=config,
                 sync_tensorboard=True, save_code=True,
                 group=f"ppo_{config['env_id']}", name=f"seed{SEED}")

env = DummyVecEnv([lambda: Monitor(gym.make(config["env_id"]))])
eval_env = DummyVecEnv([lambda: Monitor(gym.make(config["env_id"]))])

model = PPO("MlpPolicy", env, verbose=1, seed=SEED,
            learning_rate=config["lr"], n_steps=config["n_steps"],
            gamma=config["gamma"], gae_lambda=config["gae_lambda"],
            ent_coef=config["ent_coef"], batch_size=config["batch_size"],
            tensorboard_log=f"runs/{run.id}")

callbacks = CallbackList([
    EvalCallback(eval_env, eval_freq=10_000, n_eval_episodes=10,
                 deterministic=True, best_model_save_path=f"best/{run.id}"),
    WandbCallback(gradient_save_freq=1000,
                  model_save_path=f"models/{run.id}", verbose=2),
])
model.learn(total_timesteps=config["total_timesteps"], callback=callbacks)
run.finish()`;

const CUSTOM_CB = `import numpy as np
from stable_baselines3.common.callbacks import BaseCallback

class RLDiagnosticsCallback(BaseCallback):
    def _on_step(self) -> bool:
        if len(self.model.ep_info_buffer) > 0:
            rewards = [ep["r"] for ep in self.model.ep_info_buffer]
            self.logger.record("rollout/ep_rew_std", float(np.std(rewards)))
            self.logger.record("rollout/ep_rew_min", float(np.min(rewards)))
            self.logger.record("rollout/ep_rew_max", float(np.max(rewards)))
        if hasattr(self, "_actions_buf") and len(self._actions_buf) > 0:
            hist, _ = np.histogram(self._actions_buf, bins=20, density=True)
            hist = hist + 1e-9
            self.logger.record("policy/action_entropy",
                               float(-np.sum(hist * np.log(hist))))
        return True`;

const VIDEO_LOG = `import numpy as np, wandb
frames, obs = [], eval_env.reset()
for _ in range(500):
    action, _ = model.predict(obs, deterministic=True)
    obs, _, terminated, truncated, _ = eval_env.step(action)
    frames.append(eval_env.render())          # H, W, 3
    if terminated or truncated: break
video = np.stack(frames).transpose(0, 3, 1, 2)  # T, C, H, W
wandb.log({"eval/video": wandb.Video(video, fps=30, format="mp4")})`;

const INSTALL = `pip install stable-baselines3[extra] tensorboard wandb gymnasium`;

const TABS = [
  {
    value: "ppo",
    label: "Полный PPO + TB + W&B",
    desc: "Production-ready training loop с одновременным логированием в TensorBoard и Weights & Biases, EvalCallback для valid-метрик, и автоматическим сохранением лучшей модели.",
    code: FULL_PPO,
    filename: "train_ppo.py",
  },
  {
    value: "callback",
    label: "Кастомный RL-callback",
    desc: "Логирует std/min/max эпизодической награды и entropy распределения действий — то, чего SB3 не даёт из коробки. Полезно для диагностики mode collapse.",
    code: CUSTOM_CB,
    filename: "diagnostics_callback.py",
  },
  {
    value: "video",
    label: "Логирование видео в W&B",
    desc: "Записывает траекторию агента и отправляет в W&B как воспроизводимое видео. Незаменимо для проверки reward hacking — всегда смотрите видео политики хотя бы раз в 50k шагов.",
    code: VIDEO_LOG,
    filename: "log_video.py",
  },
] as const;

const CodeExamples = () => {
  const [tab, setTab] = useState<string>("ppo");

  return (
    <div className="space-y-8">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto bg-card/40 border border-cyan-500/20">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="text-xs md:text-sm py-2.5 data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-300"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((t) => (
          <TabsContent key={t.value} value={t.value} className="mt-6 space-y-4">
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              {t.desc}
            </p>
            <CyberCodeBlock language="python" filename={t.filename}>
              {t.code}
            </CyberCodeBlock>
          </TabsContent>
        ))}
      </Tabs>

      <a
        href="https://github.com/SergeyErmakov85"
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <Card className="border-purple-500/30 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:border-purple-400/70 hover:shadow-[0_0_28px_hsl(280_85%_65%/0.35)]">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl border border-purple-400/40 bg-purple-500/10 flex items-center justify-center">
                <Github className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <div className="font-bold text-foreground">
                  Все примеры на GitHub →
                </div>
                <div className="text-xs text-muted-foreground">
                  github.com/SergeyErmakov85
                </div>
              </div>
            </div>
            <span className="text-purple-300 text-sm group-hover:translate-x-1 transition-transform">
              Открыть
            </span>
          </CardContent>
        </Card>
      </a>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-semibold text-foreground">
            Установка зависимостей
          </h3>
        </div>
        <CyberCodeBlock language="pseudo" filename="install.sh">
          {INSTALL}
        </CyberCodeBlock>
      </div>
    </div>
  );
};

export default CodeExamples;
