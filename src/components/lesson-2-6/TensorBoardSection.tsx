import { Card, CardContent } from "@/components/ui/card";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import {
  Calendar,
  Cpu,
  TrendingUp,
  BarChart3,
  Image as ImageIcon,
  GitGraph,
  ScatterChart,
  Sliders,
  Activity,
  Gauge,
  CheckCircle2,
  XCircle,
  Terminal,
} from "lucide-react";

const VIZ_TYPES = [
  {
    icon: TrendingUp,
    title: "Scalars",
    desc: "Скалярные метрики во времени",
    api: "add_scalar(tag, value, step) · add_scalars",
  },
  {
    icon: BarChart3,
    title: "Histograms / Distributions",
    desc: "Веса, активации, действия",
    api: "add_histogram(tag, tensor, step)",
  },
  {
    icon: ImageIcon,
    title: "Images / Audio / Video",
    desc: "Медиа-логирование",
    api: "add_image · add_audio · add_video",
  },
  {
    icon: GitGraph,
    title: "Graphs",
    desc: "Граф вычислений модели",
    api: "add_graph(model, input)",
  },
  {
    icon: ScatterChart,
    title: "Projector / Embeddings",
    desc: "PCA / t-SNE / UMAP",
    api: "add_embedding(mat, metadata, label_img)",
  },
  {
    icon: Sliders,
    title: "HParams",
    desc: "Сравнение гиперпараметров",
    api: "add_hparams(hparams_dict, metric_dict)",
  },
  {
    icon: Activity,
    title: "PR curves",
    desc: "Precision–Recall кривые",
    api: "add_pr_curve(tag, labels, predictions)",
  },
  {
    icon: Gauge,
    title: "Profiler",
    desc: "torch.profiler + плагин",
    api: "tensorboard-plugin-profile",
  },
];

const PROS = [
  "Бесплатно, локально, мгновенно",
  "Открытый формат event-файлов",
  "Встроенная поддержка в PyTorch и SB3",
  "Работает офлайн",
];

const CONS = [
  "Нет collaboration (TensorBoard.dev закрыт в 2024)",
  "HParams plugin поддерживает только grid analysis",
  "Нет artifact tracking",
  "Нет persistent cloud storage",
];

const PYTORCH_CODE = `from torch.utils.tensorboard import SummaryWriter

writer = SummaryWriter("runs/ppo_cartpole_seed1")
for step in range(N):
    writer.add_scalar("rollout/ep_rew_mean", reward, step)
    writer.add_histogram("policy/actions", actions, step)
writer.close()
`;

const SB3_CODE = `from stable_baselines3 import PPO

model = PPO("MlpPolicy", "CartPole-v1",
            tensorboard_log="./tb/", verbose=1)
model.learn(total_timesteps=100_000, tb_log_name="ppo_seed1")
# Запуск: tensorboard --logdir ./tb/
`;

const TensorBoardSection = () => {
  return (
    <div className="space-y-8">
      {/* History + Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card/60 border-cyan-500/20 backdrop-blur-sm">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <h4 className="text-lg font-bold text-cyan-300">История</h4>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              TensorBoard был выпущен Google вместе с TensorFlow{" "}
              <strong>9 ноября 2015 года</strong>. С 2019 года официально
              поддерживается в PyTorch через{" "}
              <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
                torch.utils.tensorboard.SummaryWriter
              </code>{" "}
              (нужен только пакет <code className="text-xs">tensorboard</code>,
              TensorFlow не обязателен).
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/60 border-purple-500/20 backdrop-blur-sm">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              <h4 className="text-lg font-bold text-purple-300">Архитектура</h4>
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed">
              <code className="text-xs">SummaryWriter</code> пишет protobuf-события
              в event files в{" "}
              <code className="text-xs">log_dir</code> (по умолчанию{" "}
              <code className="text-xs">runs/&lt;timestamp&gt;_&lt;host&gt;</code>
              ). Команда{" "}
              <code className="text-xs">tensorboard --logdir runs/</code>{" "}
              запускает локальный веб-сервер (обычно{" "}
              <code className="text-xs">localhost:6006</code>), который
              рекурсивно сканирует папку и группирует подпапки как отдельные runs.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Viz types */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground">Виды визуализаций</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {VIZ_TYPES.map(({ icon: Icon, title, desc, api }) => (
            <Card
              key={title}
              className="bg-card/60 border-cyan-500/15 backdrop-blur-sm hover:border-cyan-400/50 hover:shadow-[0_0_18px_hsl(var(--primary)/0.25)] transition-all"
            >
              <CardContent className="p-4 space-y-2">
                <Icon className="w-6 h-6 text-cyan-400" />
                <h4 className="font-bold text-sm text-foreground leading-tight">
                  {title}
                </h4>
                <p className="text-xs text-muted-foreground leading-snug">
                  {desc}
                </p>
                <code className="block text-[10px] font-mono text-cyan-200/80 break-all bg-background/40 rounded px-2 py-1.5 mt-2">
                  {api}
                </code>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* PyTorch example */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-foreground">
          Минимальный PyTorch-пример
        </h3>
        <CyberCodeBlock language="python" filename="train.py">
          {PYTORCH_CODE}
        </CyberCodeBlock>
      </div>

      {/* SB3 example */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-foreground">
          Интеграция со Stable-Baselines3
        </h3>
        <CyberCodeBlock language="python" filename="ppo_sb3.py">
          {SB3_CODE}
        </CyberCodeBlock>
        <p className="text-sm text-muted-foreground">
          SB3 автоматически логирует все ключевые PPO-метрики (
          <code className="text-xs">train/approx_kl</code>,{" "}
          <code className="text-xs">train/explained_variance</code>,{" "}
          <code className="text-xs">rollout/ep_rew_mean</code>, и т.д.).
        </p>
      </div>

      {/* Colab callout */}
      <div className="rounded-r-2xl border-l-4 border-cyan-500 bg-cyan-500/5 p-6 space-y-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <h4 className="font-bold text-cyan-300">Запуск в Google Colab</h4>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed">
          <code className="text-xs">%load_ext tensorboard</code> +{" "}
          <code className="text-xs">%tensorboard --logdir runs/</code> —
          встроенная поддержка с TensorBoard 2.0. Для удалённого VPS: SSH-туннель{" "}
          <code className="text-xs">ssh -L 6006:localhost:6006 user@server</code>{" "}
          или <code className="text-xs">ngrok</code> (
          <code className="text-xs">ngrok http 6006</code>).
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

export default TensorBoardSection;
