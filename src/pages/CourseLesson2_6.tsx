import LessonLayout from "@/components/LessonLayout";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import ProGate from "@/components/ProGate";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import Quiz from "@/components/Quiz";
import { Card, CardContent } from "@/components/ui/card";
import {
  Lightbulb,
  BarChart3,
  AlertTriangle,
  Activity,
  Eye,
  Calendar,
  Cpu,
  TrendingUp,
  Image as ImageIcon,
  GitGraph,
  ScatterChart,
  Sliders,
  Gauge,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const quizQuestions = [
  {
    question: "Какой метрикой лучше всего отслеживать исследование среды агентом?",
    options: [
      "episode_reward_mean",
      "policy_loss",
      "policy_entropy",
      "value_loss",
    ],
    correctIndex: 2,
    explanation:
      "policy_entropy показывает, насколько случайна политика. Высокая энтропия → агент активно исследует; падение к нулю → политика стала детерминированной.",
  },
  {
    question: "Что означает резкий спад policy_entropy в самом начале обучения?",
    options: [
      "Агент нашёл оптимальную стратегию",
      "Политика преждевременно схлопывается — агент перестал исследовать",
      "Это нормальное поведение для REINFORCE",
      "Нужно увеличить learning rate",
    ],
    correctIndex: 1,
    explanation:
      "Раннее схлопывание энтропии — признак того, что агент зафиксировался на субоптимальном поведении. Решение: увеличить entropy_coeff (beta).",
  },
  {
    question:
      "Какой инструмент лучше всего подходит для сравнения нескольких запусков с разными гиперпараметрами?",
    options: [
      "TensorBoard",
      "Weights & Biases (W&B)",
      "print() в консоль",
      "Matplotlib",
    ],
    correctIndex: 1,
    explanation:
      "W&B хранит данные в облаке, автоматически логирует гиперпараметры и позволяет сравнивать запуски в интерактивных таблицах и графиках.",
  },
];

const CourseLesson2_6 = () => {
  const preview = (
    <section>
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Зачем визуализировать обучение
      </h2>
      <p className="text-muted-foreground leading-relaxed">
        RL-обучение — процесс непредсказуемый. Без мониторинга вы не поймёте,
        обучается ли агент, застрял ли он, или награды растут случайно.{" "}
        <strong className="text-foreground"><CrossLinkToHub hubPath="/unity-ml-agents" hubAnchor="training" hubTitle="Unity ML-Agents — Обучение">TensorBoard</CrossLinkToHub></strong> и{" "}
        <strong className="text-foreground">Weights &amp; Biases</strong> — два
        ключевых инструмента для отслеживания прогресса.
      </p>
    </section>
  );

  return (
    <LessonLayout
      lessonId="2-6"
      lessonTitle="Визуализация обучения: TensorBoard и W&B"
      lessonNumber="2.6"
      duration="25 мин"
      tags={["#tools", "#visualization", "#monitoring"]}
      level={2}
      prevLesson={{ path: "/courses/2-5", title: "Параллельные среды" }}
      nextLesson={{ path: "/courses/project-2", title: "Проект 2" }}
    >
      <ProGate preview={preview}>
        {preview}

        {/* ── Секция 1: Зачем нужен мониторинг ── */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Зачем нужен мониторинг
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Без мониторинга обучение RL-агента — <strong className="text-foreground">чёрный ящик</strong>.
            Вы запускаете тренировку на часы или дни и не знаете, движется ли агент к цели
            или уже давно застрял на плато. Мониторинг превращает обучение в управляемый процесс.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: BarChart3,
                title: "episode_reward_mean",
                desc: "Главная метрика — средняя награда за эпизод. Должна расти.",
                color: "text-primary",
              },
              {
                icon: Activity,
                title: "policy_loss / value_loss",
                desc: "Ошибки обновления политики и critic'а. Показывают стабильность обучения.",
                color: "text-secondary",
              },
              {
                icon: Eye,
                title: "policy_entropy",
                desc: "Мера случайности политики. Контролирует баланс исследования и эксплуатации.",
                color: "text-accent",
              },
              {
                icon: AlertTriangle,
                title: "gradient_norm",
                desc: "Норма градиентов. Слишком большая → взрыв, слишком маленькая → обучение застыло.",
                color: "text-primary",
              },
            ].map((item, i) => (
              <Card key={i} className="bg-card/60 backdrop-blur-sm border-border/30">
                <CardContent className="p-4 flex gap-3 items-start">
                  <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className="font-semibold text-sm text-foreground font-mono">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Секция: TensorBoard — практика ── */}
        <section id="tensorboard" className="scroll-mt-20 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">TensorBoard — практика</h2>

          {/* История + Архитектура */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">История</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  TensorBoard был выпущен Google вместе с TensorFlow{" "}
                  <strong className="text-foreground">9 ноября 2015 года</strong>. С 2019 года официально поддерживается
                  в PyTorch через <code className="text-accent font-mono">torch.utils.tensorboard.SummaryWriter</code>{" "}
                  (нужен только пакет <code className="text-accent font-mono">tensorboard</code>, TensorFlow не
                  обязателен).
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-sm border-secondary/30">
              <CardContent className="p-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-secondary" />
                  <h3 className="font-bold text-foreground">Архитектура</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <code className="text-accent font-mono">SummaryWriter</code> пишет protobuf-события в event files в{" "}
                  <code className="text-accent font-mono">log_dir</code> (по умолчанию{" "}
                  <code className="text-accent font-mono">runs/&lt;timestamp&gt;_&lt;host&gt;</code>). Команда{" "}
                  <code className="text-accent font-mono">tensorboard --logdir runs/</code> запускает локальный
                  веб-сервер (обычно <code className="text-accent font-mono">localhost:6006</code>), который рекурсивно
                  сканирует папку и группирует подпапки как отдельные runs.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Виды визуализаций */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-4">Виды визуализаций</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  icon: TrendingUp,
                  title: "Scalars",
                  desc: "Скалярные метрики во времени; multi-line через add_scalars",
                  api: "add_scalar(tag, value, step)",
                  color: "text-primary",
                },
                {
                  icon: BarChart3,
                  title: "Histograms",
                  desc: "Распределения весов, активаций, действий",
                  api: "add_histogram(tag, tensor, step)",
                  color: "text-secondary",
                },
                {
                  icon: ImageIcon,
                  title: "Images / Audio / Video",
                  desc: "Тензорные медиа — кадры среды, спектрограммы, ролики",
                  api: "add_image / add_audio / add_video",
                  color: "text-accent",
                },
                {
                  icon: GitGraph,
                  title: "Graphs",
                  desc: "Визуализация графа вычислений модели",
                  api: "add_graph(model, input)",
                  color: "text-primary",
                },
                {
                  icon: ScatterChart,
                  title: "Projector / Embeddings",
                  desc: "Проекции эмбеддингов: PCA, t-SNE, UMAP",
                  api: "add_embedding(mat, metadata, label_img)",
                  color: "text-secondary",
                },
                {
                  icon: Sliders,
                  title: "HParams",
                  desc: "Сравнение запусков по гиперпараметрам и метрикам",
                  api: "add_hparams(hparams, metrics)",
                  color: "text-accent",
                },
                {
                  icon: Activity,
                  title: "PR curves",
                  desc: "Precision-Recall кривые для классификации",
                  api: "add_pr_curve(tag, labels, preds)",
                  color: "text-primary",
                },
                {
                  icon: Gauge,
                  title: "Profiler",
                  desc: "torch.profiler + плагин tensorboard-plugin-profile",
                  api: "torch.profiler.profile(...)",
                  color: "text-secondary",
                },
              ].map((item, i) => (
                <Card key={i} className="bg-card/60 backdrop-blur-sm border-border/30">
                  <CardContent className="p-4 space-y-2">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-snug">{item.desc}</p>
                    <code className="block text-[10px] text-accent font-mono break-all bg-background/40 p-1.5 rounded">
                      {item.api}
                    </code>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Минимальный PyTorch-пример */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-3">Минимальный PyTorch-пример</h3>
            <CyberCodeBlock language="python" filename="train_minimal.py">
{`from torch.utils.tensorboard import SummaryWriter
writer = SummaryWriter("runs/ppo_cartpole_seed1")
for step in range(N):
    writer.add_scalar("rollout/ep_rew_mean", reward, step)
    writer.add_histogram("policy/actions", actions, step)
writer.close()`}
            </CyberCodeBlock>
          </div>

          {/* Интеграция со Stable-Baselines3 */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-3">Интеграция со Stable-Baselines3</h3>
            <CyberCodeBlock language="python" filename="train_sb3.py">
{`from stable_baselines3 import PPO
model = PPO("MlpPolicy", "CartPole-v1",
            tensorboard_log="./tb/", verbose=1)
model.learn(total_timesteps=100_000, tb_log_name="ppo_seed1")
# Запуск: tensorboard --logdir ./tb/`}
            </CyberCodeBlock>
            <p className="text-sm text-muted-foreground mt-2">
              SB3 автоматически логирует все ключевые PPO-метрики (
              <code className="text-accent font-mono">train/approx_kl</code>,{" "}
              <code className="text-accent font-mono">train/explained_variance</code>,{" "}
              <code className="text-accent font-mono">rollout/ep_rew_mean</code>, и т.д.).
            </p>
          </div>

          {/* Запуск в Google Colab */}
          <Card className="bg-card/60 backdrop-blur-sm border-l-4 border-l-primary border-y-primary/20 border-r-primary/20">
            <CardContent className="p-6 space-y-2">
              <h4 className="font-bold text-primary">Запуск в Google Colab</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <code className="text-accent font-mono">%load_ext tensorboard</code> +{" "}
                <code className="text-accent font-mono">%tensorboard --logdir runs/</code> — встроенная поддержка с
                TensorBoard 2.0. Для удалённого VPS: SSH-туннель{" "}
                <code className="text-accent font-mono">ssh -L 6006:localhost:6006 user@server</code> или ngrok (
                <code className="text-accent font-mono">ngrok http 6006</code>).
              </p>
            </CardContent>
          </Card>

          {/* Плюсы / Минусы */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-primary/5 backdrop-blur-sm border-primary/40">
              <CardContent className="p-5 space-y-2">
                <h4 className="font-bold text-primary flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Плюсы
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                  <li>Бесплатно, локально, мгновенно</li>
                  <li>Открытый формат event-файлов</li>
                  <li>Встроенная поддержка в PyTorch и SB3</li>
                  <li>Работает офлайн</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-destructive/5 backdrop-blur-sm border-destructive/40">
              <CardContent className="p-5 space-y-2">
                <h4 className="font-bold text-destructive flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Минусы
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                  <li>Нет collaboration (TensorBoard.dev закрыт в 2024)</li>
                  <li>HParams plugin поддерживает только grid analysis</li>
                  <li>Нет artifact tracking</li>
                  <li>Нет persistent cloud storage</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── TensorBoard в Unity ML-Agents ── */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            TensorBoard в Unity ML-Agents
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            ML-Agents автоматически пишет логи TensorBoard в папку{" "}
            <code className="text-primary font-mono text-sm">results/</code>. Вам нужно лишь
            указать <code className="text-primary font-mono text-sm">run-id</code> при запуске —
            и все метрики (reward, loss, entropy) появятся в TensorBoard.
          </p>

          <CyberCodeBlock language="python" filename="config/trainer.yaml">
{`behaviors:
  FoodCollector:
    trainer_type: ppo
    hyperparameters:
      batch_size: 1024
      buffer_size: 10240
      learning_rate: 3.0e-4
      beta: 0.01          # entropy regularization
      epsilon: 0.2        # PPO clip range
      num_epoch: 3
    network_settings:
      normalize: true
      hidden_units: 256
      num_layers: 2
    reward_signals:
      extrinsic:
        gamma: 0.99
        strength: 1.0
    max_steps: 500000
    summary_freq: 5000    # Частота записи в TensorBoard

# Запуск обучения:
# mlagents-learn config/trainer.yaml --run-id=fc_ppo_v1
#
# Просмотр логов:
# tensorboard --logdir results --port 6006`}
          </CyberCodeBlock>
        </section>

        {/* ── Секция 4: Weights & Biases ── */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Weights &amp; Biases (W&amp;B)
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            W&amp;B — облачная платформа для эксперимент-трекинга. В отличие от TensorBoard,
            данные хранятся в облаке, а гиперпараметры и <CrossLinkToHub hubPath="/pytorch/cheatsheet" hubAnchor="saving" hubTitle="PyTorch — Сохранение">чекпоинты</CrossLinkToHub> логируются автоматически — идеально
            для сравнения десятков запусков.
          </p>

          <CyberCodeBlock language="python" filename="train_with_wandb.py">
{`import wandb

wandb.init(
    project="food-collector-rl",
    name="reinforce-v3-baseline",
    config={
        "algorithm": "REINFORCE",
        "learning_rate": 3e-4,
        "gamma": 0.99,
        "entropy_coeff": 0.01,
    }
)

for episode in range(num_episodes):
    total_reward, loss = run_episode(env, policy, optimizer)

    wandb.log({
        "episode": episode,
        "reward": total_reward,
        "loss": loss,
        "epsilon": epsilon,
    })

wandb.finish()`}
          </CyberCodeBlock>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="bg-card/60 backdrop-blur-sm border-green-500/30">
              <CardContent className="p-4 space-y-2">
                <h3 className="font-bold text-sm text-green-400">✅ Плюсы W&amp;B</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Облачное хранение — доступ из любого места</li>
                  <li>• Автоматическое логирование гиперпараметров</li>
                  <li>• Таблицы сравнения экспериментов</li>
                  <li>• Командная работа и sharing</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm border-secondary/30">
              <CardContent className="p-4 space-y-2">
                <h3 className="font-bold text-sm text-secondary">📊 TensorBoard</h3>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Локальный — не нужен аккаунт</li>
                  <li>• Встроен в PyTorch и ML-Agents</li>
                  <li>• Гистограммы весов и графы</li>
                  <li>• Быстрый старт без настройки</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── Quiz ── */}
        <Quiz
          title="Проверь себя: Мониторинг обучения"
          questions={quizQuestions}
          lessonPath="/courses/2-6"
          nextLesson={{ path: "/courses/project-2", title: "Проект 2" }}
        />
      </ProGate>
    </LessonLayout>
  );
};

export default CourseLesson2_6;
