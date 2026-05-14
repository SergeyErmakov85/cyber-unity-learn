import LessonLayout from "@/components/LessonLayout";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import ProGate from "@/components/ProGate";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import Quiz from "@/components/Quiz";
import Math from "@/components/Math";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Cpu, Layers, Lightbulb, Network, Shuffle, Zap } from "lucide-react";

const quizQuestions = [
  {
    question: "Зачем нужна параллелизация сред при обучении RL-агента?",
    options: [
      "Чтобы агент мог играть в несколько игр одновременно",
      "Для сбора большего батча данных — стабилизирует градиент и ускоряет обучение",
      "Параллелизация не используется в RL",
      "Чтобы увеличить размер нейронной сети",
    ],
    correctIndex: 1,
  },
  {
    question: "Какой параметр в YAML-конфигурации ML-Agents отвечает за ускорение симуляции?",
    options: ["num_envs", "time_scale", "batch_size", "max_steps"],
    correctIndex: 1,
  },
  {
    question: "Как запустить 8 параллельных сред в ML-Agents из командной строки?",
    options: [
      "mlagents-learn --parallel=8",
      "mlagents-learn --num-envs=8",
      "mlagents-learn config.yaml --num-envs=8 --env=Build.exe",
      "Невозможно — нужен отдельный скрипт",
    ],
    correctIndex: 2,
  },
  {
    question: "Чем фундаментально ограничено внутрисценовое распараллеливание (Training Areas)?",
    options: [
      "Объёмом видеопамяти GPU",
      "Производительностью одного потока CPU (Main Thread Unity)",
      "Скоростью сетевого канала gRPC",
      "Размером Replay Buffer",
    ],
    correctIndex: 1,
  },
  {
    question: "Какой протокол используется для коммуникации между Unity (C#) и Python (PyTorch) в ML-Agents?",
    options: [
      "Shared Memory + системные сообщения",
      "REST API поверх HTTP",
      "gRPC поверх TCP/IP-сокетов с сериализацией Protocol Buffers",
      "WebSocket поверх UDP",
    ],
    correctIndex: 2,
  },
  {
    question: "Как нужно масштабировать buffer_size при увеличении --num-envs?",
    options: [
      "Оставить без изменений — алгоритм PPO сам адаптируется",
      "Уменьшить пропорционально, чтобы быстрее обновлять политику",
      "Умножить на num_envs, чтобы избежать высокой автокорреляции данных",
      "Установить равным batch_size",
    ],
    correctIndex: 2,
  },
  {
    question: "Почему threaded: true опасно использовать с PPO и Self-Play?",
    options: [
      "PPO — On-Policy: асинхронное обновление весов нарушает гарантии Trust Region",
      "Это вызывает утечки CUDA-памяти всегда",
      "PyTorch не поддерживает многопоточность вообще",
      "Это ломает gRPC-соединение",
    ],
    correctIndex: 0,
  },
  {
    question: "Почему загрузка CPU не превышает ~30% даже при --num-envs=24?",
    options: [
      "ОС искусственно ограничивает Python одним ядром",
      "PyTorch жёстко ограничивает свои операции max(min(num_cpus // 2, 4), 1) потоками",
      "gRPC не способен принять больше 4 соединений",
      "Unity отключает лишние процессы автоматически",
    ],
    correctIndex: 1,
  },
  {
    question: "Для чего применяется Environment Parameter Randomization в параллельных средах?",
    options: [
      "Для случайного выбора алгоритма (PPO или SAC) на лету",
      "Чтобы каждый worker видел свой набор физических констант — обобщение и Sim2Real",
      "Чтобы менять hidden_units нейронной сети между эпохами",
      "Для ротации портов gRPC",
    ],
    correctIndex: 1,
  },
];

const CourseLesson2_5 = () => {
  const preview = (
    <>
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Зачем нужна параллелизация</h2>
        <p className="text-muted-foreground leading-relaxed">
          Глубокое RL страдает от низкой <strong className="text-primary">sample efficiency</strong>: алгоритмам нужны
          миллионы шагов взаимодействия. Один агент собирает данные медленно, а собранные траектории
          сильно автокоррелированы во времени — состояние <em>s<sub>t+1</sub></em> каузально вытекает из{" "}
          <em>s<sub>t</sub></em>, что раздувает дисперсию оценки градиента.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          <strong className="text-foreground">Параллельные среды</strong> разрушают временную корреляцию: N независимых
          траекторий собираются одновременно из разных участков пространства состояний. Закон больших чисел приближает
          стохастическую оценку к истинному градиенту, обучение становится в N раз быстрее и кратно стабильнее.
        </p>
      </section>
    </>
  );

  return (
    <LessonLayout
      lessonId="2-5"
      lessonTitle="Параллельные среды для ускорения обучения"
      lessonNumber="2.5"
      duration="60 мин"
      tags={["#practice", "#mlagents", "#performance", "#architecture"]}
      level={2}
      prevLesson={{ path: "/courses/2-4", title: "Reward Shaping" }}
      nextLesson={{ path: "/courses/2-6", title: "TensorBoard и W&B" }}
    >
      <ProGate preview={preview}>
        {preview}

        {/* Benefits */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: Zap, title: "Скорость", desc: "N сред → N× больше данных за единицу времени" },
              { icon: Lightbulb, title: "Стабильность", desc: "Большой батч → меньше дисперсия градиента" },
              { icon: Shuffle, title: "Разнообразие", desc: "Разные среды → агент видит больше ситуаций" },
            ].map((item, i) => (
              <Card key={i} className="bg-card/50 border-border/40">
                <CardContent className="p-4 space-y-2">
                  <item.icon className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Math foundations */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Математическое обоснование</h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Цель алгоритмов на базе градиента политики — максимизация ожидания дисконтированной награды:
          </p>
          <Math display>{String.raw`J(\theta) = \mathbb{E}_{\tau \sim \pi_\theta} \left[ \sum_{t=0}^{T} \gamma^t \, r(s_t, a_t) \right]`}</Math>

          <p className="text-muted-foreground leading-relaxed mt-3">
            Эмпирический градиент по N траекториям с функцией преимущества <em>A(s,a)</em>:
          </p>
          <Math display>{String.raw`\nabla_\theta J(\theta) \approx \frac{1}{N} \sum_{i=1}^{N} \sum_{t=0}^{T} \nabla_\theta \log \pi_\theta(a_t^i \mid s_t^i) \, A(s_t^i, a_t^i)`}</Math>

          <Card className="bg-card/60 backdrop-blur-sm border-secondary/30 mt-4">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                При <strong className="text-secondary">N = 1</strong> траектории сильно автокоррелированы → высокая
                дисперсия → осцилляции и сходимость в локальные минимумы. Параллельные среды дают{" "}
                <strong className="text-primary">N независимых</strong> траекторий → закон больших чисел работает
                эффективнее, оценка градиента приближается к истинной.
              </p>
            </CardContent>
          </Card>

          <p className="text-muted-foreground leading-relaxed mt-4">
            Усечённая (clipped) функция потерь PPO, особо чувствительная к качеству батча:
          </p>
          <Math display>{String.raw`L^{CLIP}(\theta) = \mathbb{E}_t \left[ \min\left( r_t(\theta) \, \hat{A}_t, \; \text{clip}(r_t(\theta), 1-\epsilon, 1+\epsilon) \, \hat{A}_t \right) \right]`}</Math>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Параметр <code className="text-accent">ε = 0.2</code> ограничивает размер шага. Параллельные среды дают
            устойчивую оценку GAE из разнообразных начальных состояний.
          </p>
        </section>

        {/* Two levels of parallelism */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Два уровня распараллеливания</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Внутрисценовое (Training Areas)</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Десятки префабов одной арены на одной сцене Unity. Все агенты с одинаковым{" "}
                  <code className="text-accent">Behavior Name</code> агрегируются в один батч и идут через{" "}
                  <strong className="text-primary">один gRPC-канал</strong>.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                  <li>+ Околонулевой IPC overhead</li>
                  <li>+ Работает прямо в Editor (Play mode)</li>
                  <li>− Жёсткий потолок: 1 поток Main Thread Unity</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-sm border-secondary/30">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-secondary" />
                  <h3 className="font-bold text-foreground">Многопроцессорное (--num-envs)</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Python запускает N независимых процессов скомпилированного билда через{" "}
                  <code className="text-accent">multiprocessing</code>. Каждый процесс — свой порт{" "}
                  <code className="text-accent">5005, 5006, ...</code>.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                  <li>+ Линейно утилизирует все ядра CPU (обходит GIL)</li>
                  <li>+ Кросс-устройственное обучение (сервер ↔ контейнер)</li>
                  <li>− Каждый процесс жрёт RAM/VRAM полностью</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Comparison table */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Сравнительная характеристика</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3 text-muted-foreground">Характеристика</th>
                  <th className="text-left py-2 px-3 text-primary">Training Areas</th>
                  <th className="text-left py-2 px-3 text-secondary">--num-envs</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Механизм", "Префабы на сцене (C#)", "multiprocessing (Python)"],
                  ["CPU scaling", "1 поток (Main Thread)", "Все ядра ОС"],
                  ["RAM / VRAM", "Минимальный (одна загрузка)", "Экстремально высокий"],
                  ["gRPC запросы", "1 агрегированный на N агентов", "N независимых каналов"],
                  ["Сложность", "Скрипт TrainingAreaReplicator", "Build + CLI флаги"],
                  ["Запуск", "Editor (Play) + Build", "Только Standalone Build"],
                ].map(([k, a, b], i) => (
                  <tr key={i} className="border-b border-border/20">
                    <td className="py-2 px-3 text-foreground font-medium">{k}</td>
                    <td className="py-2 px-3 text-muted-foreground">{a}</td>
                    <td className="py-2 px-3 text-muted-foreground">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Card className="bg-card/60 backdrop-blur-sm border-accent/30 mt-4">
            <CardContent className="p-6">
              <p className="text-sm text-foreground">
                <strong className="text-accent">Профессиональный симбиоз:</strong> на 12-ядерной станции — собрать билд,
                запустить с <code className="text-primary">--num-envs=10</code> (2 ядра оставить ОС и Python-тренеру) и
                внутри каждого экземпляра разместить десятки <code className="text-primary">TrainingAreaReplicator</code>.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Unity ML-Agents config */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Настройка{" "}
            <CrossLinkToHub hubPath="/unity-ml-agents" hubAnchor="training" hubTitle="Unity ML-Agents — Обучение">
              параллельных сред
            </CrossLinkToHub>{" "}
            в Unity ML-Agents
          </h2>

          <CyberCodeBlock language="python" filename="terminal">
{`# Запуск с 8 параллельными средами
mlagents-learn config/trainer.yaml \\
    --env=Build/MyEnv \\
    --run-id=parallel_test \\
    --num-envs=8 \\
    --base-port=6000 \\
    --no-graphics

# Ключевые параметры:
# --num-envs=N     — количество параллельных копий среды
# --no-graphics    — без рендеринга (ускоряет в ~3x)
# --base-port=P    — стартовый TCP-порт для gRPC (если 5005 занят)
# --time-scale=20  — ускорение внутриигрового времени`}
          </CyberCodeBlock>

          <CyberCodeBlock language="python" filename="trainer_config.yaml">
{`behaviors:
  HunterAgent:
    trainer_type: ppo
    hyperparameters:
      batch_size: 2048        # Больше батч для параллельных сред
      buffer_size: 20480      # buffer_size = batch_size * 10
      learning_rate: 3.0e-4
      learning_rate_schedule: linear
      beta: 5.0e-3            # Регуляризация энтропии
      epsilon: 0.2            # PPO clip
      num_epoch: 3
    network_settings:
      hidden_units: 256
      num_layers: 2
      vis_encode_type: nature_cnn
    max_steps: 10000000       # Считается по ВСЕМ агентам всех сред
    time_horizon: 128
    summary_freq: 10000
    threaded: false           # PPO On-Policy → строго false
    torch_settings:
      device: cpu             # MLP-сети быстрее на CPU чем на GPU`}
          </CyberCodeBlock>
        </section>

        {/* gRPC architecture */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            <Network className="inline w-6 h-6 text-primary mr-2" />
            Коммуникационный стек: gRPC + Protocol Buffers
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Частое заблуждение: ML-Agents использует Shared Memory. На самом деле — исключительно{" "}
            <strong className="text-primary">gRPC поверх TCP/IP-сокетов</strong> с сериализацией Protobuf. Это
            архитектурно нужно для распределённого обучения: тяжёлая 3D-среда крутится на Windows-сервере с RTX, а
            тренер — в Linux-контейнере на TPU.
          </p>

          <Card className="bg-card/60 backdrop-blur-sm border-primary/30 mt-4">
            <CardContent className="p-6 space-y-3">
              <h4 className="font-bold text-foreground">Жизненный цикл шага env.step()</h4>
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal pl-5">
                <li>Python отправляет gRPC-запрос на квантованный шаг физики.</li>
                <li>
                  Unity рассчитывает физику и формирует <code className="text-accent">DecisionSteps</code> (obs, reward,
                  agent_id) и <code className="text-accent">TerminalSteps</code> для завершившихся эпизодов.
                </li>
                <li>
                  Python десериализует ответ. <code className="text-accent">agent_id</code> отслеживает непрерывные
                  траектории конкретных агентов в мульти-агентных сценариях.
                </li>
                <li>
                  PyTorch предсказывает действия → упаковка в <code className="text-accent">ActionTuple</code> (np.float32
                  или np.int32) → <code className="text-accent">env.set_actions()</code> → исполнение в Unity.
                </li>
              </ol>
            </CardContent>
          </Card>

          <h3 className="text-lg font-bold text-foreground mt-6 mb-3">Side Channels — побочные каналы</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className="bg-card/60 backdrop-blur-sm border-secondary/30">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-bold text-secondary text-sm">EngineConfigurationChannel</h4>
                <p className="text-xs text-muted-foreground">
                  Управление движком: <code className="text-accent">time_scale</code>,{" "}
                  <code className="text-accent">target_frame_rate</code>,{" "}
                  <code className="text-accent">quality_level</code>. <code className="text-accent">time_scale: 20.0</code>{" "}
                  → сотни часов симуляции за минуты.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm border-accent/30">
              <CardContent className="p-4 space-y-2">
                <h4 className="font-bold text-accent text-sm">EnvironmentParametersChannel</h4>
                <p className="text-xs text-muted-foreground">
                  Динамическая модификация: рандомизация физики, Curriculum Learning. На стороне C#:{" "}
                  <code className="text-accent">Academy.Instance.EnvironmentParameters.GetWithDefault(...)</code>.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Hyperparameter scaling */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Масштабирование гиперпараметров</h2>

          <h3 className="text-lg font-bold text-foreground mb-2">Правило buffer_size</h3>
          <Math display>{String.raw`\text{buffer\_size}_{new} = \text{buffer\_size}_{base} \times \text{num\_envs}`}</Math>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Если базовый буфер для 1 среды = 10240, то для <code className="text-primary">--num-envs=4</code> →
            минимум 40960. Иначе буфер заполняется коротким коррелированным куском данных от 1–2 агентов, и теоретическое
            преимущество декорреляции аннулируется.
          </p>

          <h3 className="text-lg font-bold text-foreground mt-6 mb-2">Правило batch_size</h3>
          <Math display>{String.raw`\text{batch\_size} \le \frac{\text{buffer\_size}}{10}`}</Math>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Continuous PPO: 512–5120. Discrete PPO: 32–512. Батч должен быть как минимум в 10× меньше буфера для
            достаточного стохастического разнообразия мини-батчей внутри <code className="text-accent">num_epoch</code>.
          </p>

          <h3 className="text-lg font-bold text-foreground mt-6 mb-2">Ловушка max_steps</h3>
          <Card className="bg-card/60 backdrop-blur-sm border-destructive/30">
            <CardContent className="p-6">
              <p className="text-sm text-foreground">
                Счётчик суммирует шаги <strong className="text-destructive">всех агентов всех сред</strong>. 10 агентов на
                сцене × 5 процессов = +50 за каждый реальный физический шаг. <code className="text-accent">max_steps</code>{" "}
                достигается в 50× быстрее по wall-clock — поднимайте до{" "}
                <code className="text-primary">5e6 — 1e7</code> и выше.
              </p>
            </CardContent>
          </Card>

          <h3 className="text-lg font-bold text-foreground mt-6 mb-2">Компромисс time_horizon</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Диапазон 32–2048. Балансирует bias / variance оценки дисконтированного возврата. Критическое ограничение для
            мульти-сред:
          </p>
          <Math display>{String.raw`\text{time\_horizon} \times N_{agents} \times N_{envs} \le \text{buffer\_size}`}</Math>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Иначе буфер переполнится до завершения локальных горизонтов — расчёт GAE сломается.
          </p>
        </section>

        {/* Threaded */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            <AlertTriangle className="inline w-6 h-6 text-accent mr-2" />
            Параметр <code className="text-accent">threaded</code> — асинхронность и её ловушки
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            По умолчанию <code className="text-accent">threaded: false</code> — синхронный цикл: Python ждёт gRPC, потом
            останавливает симуляцию для backprop. При <code className="text-accent">threaded: true</code> backward
            делегируется отдельному OS-потоку → среды не простаивают.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
              <CardContent className="p-6 space-y-2">
                <h4 className="font-bold text-primary">SAC (Off-Policy) → ✅ threaded: true</h4>
                <p className="text-sm text-muted-foreground">
                  Обучение на исторических данных из Replay Buffer. Старые версии политики не нарушают теорию.
                  Многократный прирост скорости.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm border-destructive/30">
              <CardContent className="p-6 space-y-2">
                <h4 className="font-bold text-destructive">PPO / Self-Play / MA-POCA → ❌ threaded: false</h4>
                <p className="text-sm text-muted-foreground">
                  On-Policy: данные должны быть от текущей политики. Асинхронность нарушает гарантии Trust Region и
                  ломает ELO в Self-Play.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/60 backdrop-blur-sm border-accent/30 mt-4">
            <CardContent className="p-6">
              <p className="text-sm text-foreground">
                <strong className="text-accent">Технический риск CUDA:</strong> биндинги PyTorch жёстко связывают CUDA
                context с потоком ОС. Если модифицировать{" "}
                <code className="text-accent">get_action_and_stats()</code> и аллоцировать новые тензоры из main thread
                после старта Trainer Thread — Segmentation Fault, NaN в весах, деление на ноль в оптимизаторе.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* CPU vs GPU */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Аппаратные узкие места: CPU vs GPU</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
              <CardContent className="p-6 space-y-2">
                <h4 className="font-bold text-primary">Vector Observations → CPU</h4>
                <p className="text-sm text-muted-foreground">
                  Малые MLP. Перенос мелких тензоров через PCI-Express дороже самих вычислений. Загрузка GPU 10–15%.
                  Принудительно: <code className="text-accent">device: cpu</code> в torch_settings (использует AVX).
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm border-secondary/30">
              <CardContent className="p-6 space-y-2">
                <h4 className="font-bold text-secondary">Visual Observations → GPU</h4>
                <p className="text-sm text-muted-foreground">
                  CNN (Nature CNN, ResNet) на тензорных ядрах обязательны. Но --num-envs=32 упрётся в рендеринг 32 сцен
                  одновременно → headless-сервер.
                </p>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-lg font-bold text-foreground mt-6 mb-2">Проблема "30% утилизации CPU"</h3>
          <p className="text-muted-foreground leading-relaxed">
            Жалоба: AMD Ryzen 12 ядер, <code className="text-accent">--num-envs=24</code>, загрузка CPU потолок 30%.
            Причина — внутренний лимит PyTorch:
          </p>
          <CyberCodeBlock language="python" filename="mlagents/torch_utils/cpu_utils.py">
{`def get_num_threads_to_use():
    # PyTorch искусственно ограничивает CPU-потоки
    # Для малых сетей лишние потоки дают больше overhead, чем пользы
    num_cpus = os.cpu_count()
    return max(min(num_cpus // 2, 4), 1)  # ≤ 4 потоков всегда`}
          </CyberCodeBlock>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Десятки процессов Unity конкурируют за такты, а PyTorch backprop остаётся без ресурсов → асимптота на
            графике <code className="text-accent">Time Elapsed</code>.
          </p>
        </section>

        {/* Port conflicts */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Типичные конфликты при многопроцессорном запуске</h2>
          <div className="space-y-3">
            <Card className="bg-card/60 backdrop-blur-sm border-destructive/30">
              <CardContent className="p-4">
                <h4 className="font-bold text-destructive text-sm mb-1">"Force Single Instance" lock</h4>
                <p className="text-xs text-muted-foreground">
                  Player Settings → Resolution and Presentation → снять{" "}
                  <code className="text-accent">Force Single Instance</code>, включить{" "}
                  <code className="text-accent">Run In Background</code>.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm border-destructive/30">
              <CardContent className="p-4">
                <h4 className="font-bold text-destructive text-sm mb-1">"Address already in use" (worker_id 0)</h4>
                <p className="text-xs text-muted-foreground">
                  Зомби-процесс держит порт 5004/5005. Решение:{" "}
                  <code className="text-accent">--base-port=6000</code>. При параллельных тренировках развести пулы:
                  тренировка А (--num-envs=4 --base-port=5000) → А занимает 5000–5003, тренировка Б → минимум{" "}
                  <code className="text-accent">--base-port=5005</code>.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benchmark */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Бенчмарк: время обучения</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3 text-muted-foreground">Параллельных сред</th>
                  <th className="text-left py-2 px-3 text-muted-foreground">Время (500k шагов)</th>
                  <th className="text-left py-2 px-3 text-muted-foreground">Ускорение</th>
                  <th className="text-left py-2 px-3 text-muted-foreground">Финальный reward</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { envs: "1", time: "~45 мин", speed: "1×", reward: "~450" },
                  { envs: "4", time: "~14 мин", speed: "~3.2×", reward: "~480" },
                  { envs: "8", time: "~8 мин", speed: "~5.6×", reward: "~490" },
                  { envs: "16", time: "~5 мин", speed: "~9×", reward: "~495" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border/20">
                    <td className="py-2 px-3 text-primary font-mono">{row.envs}</td>
                    <td className="py-2 px-3 text-foreground">{row.time}</td>
                    <td className="py-2 px-3 text-secondary">{row.speed}</td>
                    <td className="py-2 px-3 text-muted-foreground">{row.reward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Domain Randomization & Curriculum */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            <Shuffle className="inline w-6 h-6 text-accent mr-2" />
            Domain Randomization и Curriculum Learning
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Параллельные среды решают проблему <strong className="text-accent">overfitting</strong>: алгоритм склонен
            запоминать конкретные пиксели/гравитацию вместо универсальных концепций. Через{" "}
            <code className="text-accent">EnvironmentParametersChannel</code> каждый worker получает уникальные физические
            константы.
          </p>

          <CyberCodeBlock language="csharp" filename="HunterAgent.cs">
{`public override void OnEpisodeBegin()
{
    // Каждый worker получит своё значение из YAML
    float mass = Academy.Instance.EnvironmentParameters
        .GetWithDefault("agent_mass", 1.0f);
    float gravity = Academy.Instance.EnvironmentParameters
        .GetWithDefault("gravity", -9.81f);

    GetComponent<Rigidbody>().mass = mass;
    Physics.gravity = new Vector3(0, gravity, 0);
}`}
          </CyberCodeBlock>

          <CyberCodeBlock language="python" filename="trainer_config.yaml">
{`environment_parameters:
  agent_mass:
    sampler_type: uniform
    sampler_parameters:
      min_value: 0.5
      max_value: 15.0
  gravity:
    sampler_type: gaussian
    sampler_parameters:
      mean: -9.81
      st_dev: 2.0

  # Curriculum Learning: усложнение по достижении порога reward
  difficulty:
    curriculum:
      - name: easy
        completion_criteria:
          measure: reward
          behavior: HunterAgent
          signal_smoothing: true
          min_lesson_length: 100
          threshold: 0.7
        value: 1.0
      - name: hard
        value: 5.0`}
          </CyberCodeBlock>

          <p className="text-muted-foreground text-sm leading-relaxed">
            Результат: worker 0 учит тяжёлого агента на льду, worker 1 — лёгкого в высокой гравитации, worker 2 —
            альтернативное освещение для CNN. Агрегированный батч даёт <strong className="text-primary">robust
            политику</strong> — фундамент <strong className="text-accent">Sim2Real transfer</strong>.
          </p>
        </section>

        {/* Multi-agent */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Многоагентные сценарии: MA-POCA и Self-Play</h2>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-primary">MA-POCA</strong> (Multi-Agent Posthumous Credit Assignment) использует
            централизованного критика на этапе обучения и децентрализованных акторов на инференсе. Параллельные
            среды генерируют опыт от сотен групп одновременно — ключ к качественной оценке value function группы.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            <strong className="text-secondary">Self-Play:</strong> агент играет против исторических чекпоинтов себя.
            Тысячи матчей в минуту через Training Areas. <strong className="text-destructive">Строгий запрет</strong>{" "}
            <code className="text-accent">threaded: true</code> — асинхронное обновление рассинхронизирует политики
            противников и сломает ELO.
          </p>
        </section>

        {/* Python SubprocVecEnv */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Альтернатива: Python SubprocVecEnv (Gym)</h2>
          <CyberCodeBlock language="python" filename="parallel_envs.py">
{`from stable_baselines3.common.vec_env import SubprocVecEnv
from stable_baselines3 import PPO
import gymnasium as gym

def make_env(env_id, seed):
    def _init():
        env = gym.make(env_id)
        env.reset(seed=seed)
        return env
    return _init

# 8 параллельных сред — multiprocessing обходит GIL
num_envs = 8
envs = SubprocVecEnv([make_env("CartPole-v1", i) for i in range(num_envs)])

model = PPO("MlpPolicy", envs, verbose=1,
            n_steps=128,           # Шаги на среду до обновления
            batch_size=256,        # Мини-батч SGD
            n_epochs=4,
            device="cpu")          # MLP → CPU быстрее GPU

model.learn(total_timesteps=500_000)
# Эффективные шаги на среду: 500k / 8 ≈ 62.5k`}
          </CyberCodeBlock>
        </section>

        {/* Conclusion */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Итог</h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
            <CardContent className="p-6 space-y-3">
              <p className="text-sm text-foreground leading-relaxed">
                Грамотный гибрид <strong className="text-primary">TrainingAreaReplicator</strong> +{" "}
                <strong className="text-secondary">--num-envs</strong> максимизирует throughput без bottleneck'ов.
                Любое масштабирование <strong className="text-accent">обязано</strong> сопровождаться пересмотром{" "}
                <code className="text-accent">buffer_size</code>, <code className="text-accent">batch_size</code>,{" "}
                <code className="text-accent">time_horizon</code>, <code className="text-accent">max_steps</code>.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Иначе ускоренная генерация траекторий приведёт лишь к фатальной нестабильности градиентов и деградации
                сходимости. TensorBoard, аппаратное профилирование и грамотное распределение CPU/GPU — базис компетенций
                специалиста.
              </p>
            </CardContent>
          </Card>
        </section>

        <Quiz title="Проверь себя: Параллельные среды" questions={quizQuestions} />
      </ProGate>
    </LessonLayout>
  );
};

export default CourseLesson2_5;
