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

        {/* ── Секция 2: TensorBoard для PyTorch ── */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            TensorBoard для PyTorch
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            PyTorch имеет встроенную интеграцию через{" "}
            <code className="text-primary font-mono text-sm">torch.utils.tensorboard</code>.
            Достаточно создать <code className="text-primary font-mono text-sm">SummaryWriter</code> и
            логировать скаляры, гистограммы и графы.
          </p>

          <CyberCodeBlock language="python" filename="train_with_tensorboard.py">
{`from torch.utils.tensorboard import SummaryWriter

writer = SummaryWriter("runs/food_collector_reinforce_v3")

for episode in range(num_episodes):
    total_reward, loss = run_episode(env, policy, optimizer)

    writer.add_scalar("Train/EpisodeReward", total_reward, episode)
    writer.add_scalar("Train/PolicyLoss", loss, episode)
    writer.add_scalar("Train/Entropy", entropy, episode)

    if episode % 100 == 0:
        for name, param in policy.named_parameters():
            writer.add_histogram(f"Weights/{name}", param, episode)

writer.close()

# Запуск: tensorboard --logdir=runs`}
          </CyberCodeBlock>

          <Card className="bg-card/60 backdrop-blur-sm border-primary/20 mt-4">
            <CardContent className="p-4 flex gap-3 items-start">
              <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Совет:</strong> используйте{" "}
                <code className="text-primary font-mono">add_histogram</code> каждые 100 эпизодов,
                чтобы отслеживать распределение весов — это помогает выявить vanishing/exploding gradients.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ── Секция 3: TensorBoard в Unity ML-Agents ── */}
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
