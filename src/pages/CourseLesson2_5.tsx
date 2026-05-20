import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle, Cpu, Layers, Lightbulb, Network, Shuffle, Zap,
  CheckCircle2, Gauge, Boxes, Workflow,
} from "lucide-react";
import LessonLayout from "@/components/LessonLayout";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import ProGate from "@/components/ProGate";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import Quiz from "@/components/Quiz";
import MathFormula from "@/components/Math";
import SectionNav, { SectionNavItem } from "@/components/SectionNav";
import TldrBox from "@/components/ui/TldrBox";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { markLessonComplete, isLessonComplete } from "@/lib/gamification";

const SECTION_CLASS =
  "scroll-mt-24 py-12 px-6 md:px-10 bg-card/60 backdrop-blur-sm rounded-2xl border border-cyan-500/10";
const SECTION_TITLE_CLASS =
  "text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6";
const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const SECTIONS: SectionNavItem[] = [
  { id: "intro", label: "Введение" },
  { id: "math", label: "Математика" },
  { id: "levels", label: "Два уровня" },
  { id: "compare", label: "Сравнение" },
  { id: "config", label: "ML-Agents" },
  { id: "grpc", label: "gRPC" },
  { id: "hyperparams", label: "Гиперпараметры" },
  { id: "threaded", label: "threaded" },
  { id: "cpu-gpu", label: "CPU/GPU" },
  { id: "ports", label: "Конфликты" },
  { id: "benchmark", label: "Бенчмарк" },
  { id: "domain", label: "Randomization" },
  { id: "multiagent", label: "Multi-agent" },
  { id: "subproc", label: "SubprocVecEnv" },
  { id: "quiz", label: "Квиз" },
];

const KEY_FINDINGS = [
  {
    title: "Линейное ускорение",
    text: "N независимых сред → N× больше данных, кратное снижение wall-clock без потерь reward.",
    icon: Zap,
    color: "cyan",
  },
  {
    title: "Стабильный градиент",
    text: "Параллельные траектории разрушают временную автокорреляцию — PPO/GAE сходится устойчивее.",
    icon: Gauge,
    color: "purple",
  },
  {
    title: "Два разных уровня",
    text: "Training Areas (внутри сцены) и --num-envs (процессы). Профи комбинируют оба.",
    icon: Layers,
    color: "pink",
  },
  {
    title: "Гиперпараметры под N",
    text: "buffer_size × N, batch_size ≤ buffer/10, max_steps ×N×agents, threaded — только для off-policy.",
    icon: Workflow,
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

const quizQuestions = [
  { question: "Зачем нужна параллелизация сред при обучении RL-агента?", options: ["Чтобы агент мог играть в несколько игр одновременно", "Для сбора большего батча данных — стабилизирует градиент и ускоряет обучение", "Параллелизация не используется в RL", "Чтобы увеличить размер нейронной сети"], correctIndex: 1 },
  { question: "Какой параметр в YAML-конфигурации ML-Agents отвечает за ускорение симуляции?", options: ["num_envs", "time_scale", "batch_size", "max_steps"], correctIndex: 1 },
  { question: "Как запустить 8 параллельных сред в ML-Agents из командной строки?", options: ["mlagents-learn --parallel=8", "mlagents-learn --num-envs=8", "mlagents-learn config.yaml --num-envs=8 --env=Build.exe", "Невозможно — нужен отдельный скрипт"], correctIndex: 2 },
  { question: "Чем фундаментально ограничено внутрисценовое распараллеливание (Training Areas)?", options: ["Объёмом видеопамяти GPU", "Производительностью одного потока CPU (Main Thread Unity)", "Скоростью сетевого канала gRPC", "Размером Replay Buffer"], correctIndex: 1 },
  { question: "Какой протокол используется для коммуникации между Unity (C#) и Python (PyTorch) в ML-Agents?", options: ["Shared Memory + системные сообщения", "REST API поверх HTTP", "gRPC поверх TCP/IP-сокетов с сериализацией Protocol Buffers", "WebSocket поверх UDP"], correctIndex: 2 },
  { question: "Как нужно масштабировать buffer_size при увеличении --num-envs?", options: ["Оставить без изменений — алгоритм PPO сам адаптируется", "Уменьшить пропорционально, чтобы быстрее обновлять политику", "Умножить на num_envs, чтобы избежать высокой автокорреляции данных", "Установить равным batch_size"], correctIndex: 2 },
  { question: "Почему threaded: true опасно использовать с PPO и Self-Play?", options: ["PPO — On-Policy: асинхронное обновление весов нарушает гарантии Trust Region", "Это вызывает утечки CUDA-памяти всегда", "PyTorch не поддерживает многопоточность вообще", "Это ломает gRPC-соединение"], correctIndex: 0 },
  { question: "Почему загрузка CPU не превышает ~30% даже при --num-envs=24?", options: ["ОС искусственно ограничивает Python одним ядром", "PyTorch жёстко ограничивает свои операции max(min(num_cpus // 2, 4), 1) потоками", "gRPC не способен принять больше 4 соединений", "Unity отключает лишние процессы автоматически"], correctIndex: 1 },
  { question: "Для чего применяется Environment Parameter Randomization в параллельных средах?", options: ["Для случайного выбора алгоритма (PPO или SAC) на лету", "Чтобы каждый worker видел свой набор физических констант — обобщение и Sim2Real", "Чтобы менять hidden_units нейронной сети между эпохами", "Для ротации портов gRPC"], correctIndex: 1 },
];

const CompleteButton = () => {
  const [done, setDone] = useState<boolean>(() => isLessonComplete("2.5"));

  useEffect(() => {
    if (done) return;
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - window.innerHeight)) * 100;
      if (pct >= 90) {
        markLessonComplete("2.5");
        setDone(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [done]);

  return (
    <Button
      onClick={() => { markLessonComplete("2.5"); setDone(true); }}
      disabled={done}
      size="lg"
      className="w-full md:w-auto bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold shadow-[0_0_24px_hsl(var(--primary)/0.45)] hover:shadow-[0_0_32px_hsl(280_85%_65%/0.55)] hover:scale-[1.02] transition-all disabled:opacity-80 disabled:cursor-default focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={done ? "Урок пройден" : "Отметить урок как пройденный"}
    >
      {done ? (<><CheckCircle2 className="w-5 h-5 mr-2" />Пройдено</>) : <>Отметить урок как пройденный ✓</>}
    </Button>
  );
};

const Section = ({ id, index, title, children }: { id: string; index: number; title: string; children: React.ReactNode }) => (
  <motion.section
    id={id}
    className={SECTION_CLASS}
    variants={SECTION_VARIANTS}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut", delay: Math.min(index * 0.04, 0.2) }}
  >
    <h2 className={SECTION_TITLE_CLASS}>{title}</h2>
    {children}
  </motion.section>
);

const IntroSection = () => (
  <div className="space-y-8">
    <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1 space-y-3">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            Один агент учится медленно. Двадцать — синхронно и стабильно.
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Deep RL пожирает миллионы шагов. Параллельные среды режут wall-clock в разы и
            одновременно стабилизируют градиент за счёт декорреляции траекторий. В этом
            уроке — оба уровня распараллеливания в Unity ML-Agents и точные правила,
            как пересчитать гиперпараметры под <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">--num-envs</code>.
          </p>
        </div>
        <div className="shrink-0 w-20 h-20 rounded-2xl border border-cyan-400/40 bg-cyan-500/10 flex items-center justify-center shadow-[0_0_32px_hsl(var(--primary)/0.45)]">
          <Boxes className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
        </div>
      </CardContent>
    </Card>

    <TldrBox
      items={[
        <>Параллельные среды дают <strong className="text-cyan-300">N независимых</strong> траекторий за тик — закон больших чисел приближает оценку градиента к истинной, обучение стабильнее и быстрее.</>,
        <>Два уровня: <strong className="text-purple-300">Training Areas</strong> (префабы в одной сцене, один gRPC-канал) и <strong className="text-pink-300">--num-envs</strong> (multiprocessing на стороне Python). Профи комбинируют их.</>,
        <>Антипаттерн: поднять <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">--num-envs</code> и оставить <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">buffer_size</code> прежним. Декорреляция аннулируется, PPO деградирует.</>,
      ]}
    />

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {KEY_FINDINGS.map(({ title, text, icon: Icon, color }) => (
        <Card key={title} className={`group bg-card/60 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${COLOR_MAP[color]}`}>
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

const CourseLesson2_5 = () => {
  const preview = (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">Зачем нужна параллелизация</h2>
      <p className="text-muted-foreground leading-relaxed">
        Глубокое RL страдает от низкой <strong className="text-primary">sample efficiency</strong>: алгоритмам нужны
        миллионы шагов. Один агент собирает данные медленно и сильно автокоррелированно.
        Параллельные среды разрушают временную корреляцию и кратно ускоряют обучение.
      </p>
    </div>
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
        <SectionNav items={SECTIONS} />

        <div id="lesson-content" className="space-y-8 mt-8">
          <Section id="intro" index={0} title="Введение">
            <IntroSection />
          </Section>

          <Section id="math" index={1} title="Математическое обоснование">
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
          </Section>

          <Section id="levels" index={2} title="Два уровня распараллеливания">
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
          </Section>

          <Section id="compare" index={3} title="Сравнительная характеристика">
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
          </Section>

          <Section id="config" index={4} title="Настройка параллельных сред в Unity ML-Agents">
            <p className="text-muted-foreground leading-relaxed mb-4">
              Базовая команда запуска и YAML-конфиг тренера. Подробнее — в хабе{" "}
              <CrossLinkToHub hubPath="/unity-ml-agents" hubAnchor="training" hubTitle="Unity ML-Agents — Обучение">
                Unity ML-Agents
              </CrossLinkToHub>.
            </p>

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
          </Section>

          <Section id="grpc" index={5} title="Коммуникационный стек: gRPC + Protocol Buffers">
            <p className="text-muted-foreground leading-relaxed">
              Частое заблуждение: ML-Agents использует Shared Memory. На самом деле — исключительно{" "}
              <strong className="text-primary">gRPC поверх TCP/IP-сокетов</strong> с сериализацией Protobuf. Это
              архитектурно нужно для распределённого обучения: тяжёлая 3D-среда крутится на Windows-сервере с RTX, а
              тренер — в Linux-контейнере на TPU.
            </p>

            <Card className="bg-card/60 backdrop-blur-sm border-primary/30 mt-4">
              <CardContent className="p-6 space-y-3">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Network className="w-5 h-5 text-primary" />
                  Жизненный цикл шага env.step()
                </h4>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal pl-5">
                  <li>Python отправляет gRPC-запрос на квантованный шаг физики.</li>
                  <li>Unity рассчитывает физику и формирует <code className="text-accent">DecisionSteps</code> и <code className="text-accent">TerminalSteps</code>.</li>
                  <li>Python десериализует ответ; <code className="text-accent">agent_id</code> отслеживает непрерывные траектории.</li>
                  <li>PyTorch предсказывает действия → <code className="text-accent">ActionTuple</code> → <code className="text-accent">env.set_actions()</code> → исполнение в Unity.</li>
                </ol>
              </CardContent>
            </Card>

            <h3 className="text-lg font-bold text-foreground mt-6 mb-3">Side Channels — побочные каналы</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card className="bg-card/60 backdrop-blur-sm border-secondary/30">
                <CardContent className="p-4 space-y-2">
                  <h4 className="font-bold text-secondary text-sm">EngineConfigurationChannel</h4>
                  <p className="text-xs text-muted-foreground">
                    Управление движком: <code className="text-accent">time_scale</code>, <code className="text-accent">target_frame_rate</code>, <code className="text-accent">quality_level</code>. <code className="text-accent">time_scale: 20.0</code> → сотни часов симуляции за минуты.
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
          </Section>

          <Section id="hyperparams" index={6} title="Масштабирование гиперпараметров">
            <h3 className="text-lg font-bold text-foreground mb-2">Правило buffer_size</h3>
            <Math display>{String.raw`\text{buffer\_size}_{new} = \text{buffer\_size}_{base} \times \text{num\_envs}`}</Math>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Если базовый буфер для 1 среды = 10240, то для <code className="text-primary">--num-envs=4</code> →
              минимум 40960. Иначе буфер заполняется коррелированным куском данных, и преимущество декорреляции аннулируется.
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
                  сцене × 5 процессов = +50 за каждый реальный шаг. <code className="text-accent">max_steps</code>{" "}
                  достигается в 50× быстрее по wall-clock — поднимайте до <code className="text-primary">5e6 — 1e7</code>.
                </p>
              </CardContent>
            </Card>

            <h3 className="text-lg font-bold text-foreground mt-6 mb-2">Компромисс time_horizon</h3>
            <Math display>{String.raw`\text{time\_horizon} \times N_{agents} \times N_{envs} \le \text{buffer\_size}`}</Math>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Диапазон 32–2048. Иначе буфер переполнится до завершения локальных горизонтов — расчёт GAE сломается.
            </p>
          </Section>

          <Section id="threaded" index={7} title="Параметр threaded — асинхронность и её ловушки">
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
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/60 backdrop-blur-sm border-destructive/30">
                <CardContent className="p-6 space-y-2">
                  <h4 className="font-bold text-destructive">PPO / Self-Play / MA-POCA → ❌ threaded: false</h4>
                  <p className="text-sm text-muted-foreground">
                    On-Policy: данные должны быть от текущей политики. Асинхронность нарушает Trust Region и ломает ELO.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/60 backdrop-blur-sm border-accent/30 mt-4">
              <CardContent className="p-6">
                <p className="text-sm text-foreground flex gap-2">
                  <AlertTriangle className="w-5 h-5 text-accent shrink-0" />
                  <span>
                    <strong className="text-accent">Технический риск CUDA:</strong> биндинги PyTorch жёстко связывают CUDA
                    context с потоком ОС. Аллокация тензоров из main thread после старта Trainer Thread → Segmentation Fault, NaN, деление на ноль в оптимизаторе.
                  </span>
                </p>
              </CardContent>
            </Card>
          </Section>

          <Section id="cpu-gpu" index={8} title="Аппаратные узкие места: CPU vs GPU">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
                <CardContent className="p-6 space-y-2">
                  <h4 className="font-bold text-primary">Vector Observations → CPU</h4>
                  <p className="text-sm text-muted-foreground">
                    Малые MLP. Перенос мелких тензоров через PCI-Express дороже самих вычислений. Принудительно:{" "}
                    <code className="text-accent">device: cpu</code> в torch_settings.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/60 backdrop-blur-sm border-secondary/30">
                <CardContent className="p-6 space-y-2">
                  <h4 className="font-bold text-secondary">Visual Observations → GPU</h4>
                  <p className="text-sm text-muted-foreground">
                    CNN (Nature CNN, ResNet) на тензорных ядрах обязательны. Но --num-envs=32 упрётся в рендеринг → headless-сервер.
                  </p>
                </CardContent>
              </Card>
            </div>

            <h3 className="text-lg font-bold text-foreground mt-6 mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-accent" /> Проблема «30% утилизации CPU»
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              AMD Ryzen 12 ядер, <code className="text-accent">--num-envs=24</code>, загрузка CPU потолок 30%.
              Причина — внутренний лимит PyTorch:
            </p>
            <CyberCodeBlock language="python" filename="mlagents/torch_utils/cpu_utils.py">
{`def get_num_threads_to_use():
    # PyTorch искусственно ограничивает CPU-потоки
    num_cpus = os.cpu_count()
    return max(min(num_cpus // 2, 4), 1)  # ≤ 4 потоков всегда`}
            </CyberCodeBlock>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Десятки процессов Unity конкурируют за такты, а PyTorch backprop остаётся без ресурсов → асимптота
              на <code className="text-accent">Time Elapsed</code>.
            </p>
          </Section>

          <Section id="ports" index={9} title="Типичные конфликты при многопроцессорном запуске">
            <div className="space-y-3">
              <Card className="bg-card/60 backdrop-blur-sm border-destructive/30">
                <CardContent className="p-4">
                  <h4 className="font-bold text-destructive text-sm mb-1">«Force Single Instance» lock</h4>
                  <p className="text-xs text-muted-foreground">
                    Player Settings → Resolution and Presentation → снять <code className="text-accent">Force Single Instance</code>, включить <code className="text-accent">Run In Background</code>.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/60 backdrop-blur-sm border-destructive/30">
                <CardContent className="p-4">
                  <h4 className="font-bold text-destructive text-sm mb-1">«Address already in use» (worker_id 0)</h4>
                  <p className="text-xs text-muted-foreground">
                    Зомби-процесс держит порт 5004/5005. Решение: <code className="text-accent">--base-port=6000</code>.
                    Для параллельных тренировок развести пулы.
                  </p>
                </CardContent>
              </Card>
            </div>
          </Section>

          <Section id="benchmark" index={10} title="Бенчмарк: время обучения">
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
          </Section>

          <Section id="domain" index={11} title="Domain Randomization и Curriculum Learning">
            <p className="text-muted-foreground leading-relaxed flex gap-2">
              <Shuffle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <span>
                Параллельные среды решают проблему <strong className="text-accent">overfitting</strong>: алгоритм склонен
                запоминать конкретные пиксели/гравитацию. Через <code className="text-accent">EnvironmentParametersChannel</code> каждый worker получает уникальные физические константы.
              </span>
            </p>

            <CyberCodeBlock language="csharp" filename="HunterAgent.cs">
{`public override void OnEpisodeBegin()
{
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

  # Curriculum Learning
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
              Результат: каждый worker видит свой набор условий. Агрегированный батч даёт{" "}
              <strong className="text-primary">robust политику</strong> — фундамент{" "}
              <strong className="text-accent">Sim2Real transfer</strong>.
            </p>
          </Section>

          <Section id="multiagent" index={12} title="Многоагентные сценарии: MA-POCA и Self-Play">
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-primary">MA-POCA</strong> использует централизованного критика на этапе обучения и
              децентрализованных акторов на инференсе. Параллельные среды генерируют опыт от сотен групп одновременно.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              <strong className="text-secondary">Self-Play:</strong> агент играет против исторических чекпоинтов себя.
              <strong className="text-destructive"> Строгий запрет</strong>{" "}
              <code className="text-accent">threaded: true</code> — асинхронное обновление рассинхронизирует политики и сломает ELO.
            </p>
          </Section>

          <Section id="subproc" index={13} title="Альтернатива: Python SubprocVecEnv (Gym)">
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

num_envs = 8
envs = SubprocVecEnv([make_env("CartPole-v1", i) for i in range(num_envs)])

model = PPO("MlpPolicy", envs, verbose=1,
            n_steps=128, batch_size=256, n_epochs=4, device="cpu")

model.learn(total_timesteps=500_000)
# Эффективные шаги на среду: 500k / 8 ≈ 62.5k`}
            </CyberCodeBlock>
          </Section>

          <Section id="quiz" index={14} title="Проверь себя">
            <Quiz title="Параллельные среды" questions={quizQuestions} />
          </Section>
        </div>

        <Card className="mt-8 border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm">
          <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Дочитали до конца? Зафиксируйте прогресс и получите XP.
            </p>
            <CompleteButton />
          </CardContent>
        </Card>
      </ProGate>
    </LessonLayout>
  );
};

export default CourseLesson2_5;
