import LessonLayout from "@/components/LessonLayout";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import Quiz from "@/components/Quiz";
import SetupChecklist from "@/components/SetupChecklist";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertTriangle,
  CheckCircle2,
  Monitor,
  Cpu,
  Flame,
  Bot,
  Gamepad2,
  ArrowRight,
  HardDrive,
  Lightbulb,
  BookOpen,
  Terminal,
} from "lucide-react";
import CrossLinkToHub from "@/components/CrossLinkToHub";

const CHECKLIST_ITEMS = [
  { id: "python", label: "Python 3.10+ установлен" },
  { id: "venv", label: "Виртуальное окружение создано и активировано" },
  { id: "pip", label: "pip обновлён до последней версии" },
  { id: "pytorch", label: "PyTorch установлен и import torch работает" },
  { id: "mlagents", label: "ML-Agents установлен (mlagents-learn --help)" },
  { id: "gymnasium", label: "Gymnasium установлен (import gymnasium)" },
  { id: "unity", label: "Unity 2022.3 LTS + пакет ML-Agents" },
  { id: "verify", label: "Скрипт проверки выполнен без ошибок" },
];

const STACK_LAYERS = [
  {
    icon: Gamepad2,
    label: "Unity",
    desc: "Игровой движок — создаёт 3D-среду, физику, визуализацию",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
  {
    icon: Bot,
    label: "ML-Agents Plugin",
    desc: "C#-пакет в Unity — связывает агента со средой через сенсоры и действия",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Terminal,
    label: "ML-Agents Python",
    desc: "Python-пакет — управляет тренировкой, собирает данные, запускает алгоритмы",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Flame,
    label: "PyTorch",
    desc: "Фреймворк глубокого обучения — нейросети, тензоры, автоград, оптимизация",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
];

const quizQuestions = [
  {
    question:
      "Какая минимальная версия Python требуется для ML-Agents 1.1.0?",
    options: ["Python 3.8", "Python 3.9", "Python 3.10", "Python 3.12"],
    correctIndex: 2,
    explanation:
      "ML-Agents 1.1.0 официально поддерживает Python 3.10 и 3.11. Более ранние версии не поддерживаются, а Python 3.12+ может вызвать конфликты зависимостей.",
  },
  {
    question:
      "Какой командой можно проверить, что ML-Agents установлен корректно?",
    options: [
      "python -m mlagents",
      "mlagents-learn --help",
      "pip show unity",
      "ml-agents --version",
    ],
    correctIndex: 1,
    explanation:
      "Команда mlagents-learn — основная точка входа для обучения агентов. Флаг --help выводит справку по параметрам. Если она работает — установка корректна.",
  },
  {
    question:
      "Через какой инструмент Unity устанавливается пакет ML-Agents?",
    options: [
      "Asset Store",
      "Unity Hub",
      "Package Manager (Add by name)",
      "NuGet",
    ],
    correctIndex: 2,
    explanation:
      "Пакет com.unity.ml-agents устанавливается через Window → Package Manager → Add package by name. Это не Asset Store ассет, а официальный Unity-пакет.",
  },
];

const CourseLesson1_2 = () => {
  return (
    <LessonLayout
      lessonId="1-2"
      lessonTitle="Установка окружения: PyTorch + Unity ML-Agents"
      lessonNumber="1.2"
      duration="30 мин"
      tags={["#setup", "#pytorch", "#unity", "#mlagents"]}
      prevLesson={{ path: "/courses/1-1", title: "Что такое RL?" }}
      nextLesson={{ path: "/courses/1-3", title: "Марковские процессы принятия решений (MDP)" }}
      keyConcepts={[
        "Как устроен стек: Unity ↔ ML-Agents ↔ PyTorch",
        "Создание изолированного Python-окружения (venv / Conda)",
        "Установка PyTorch (CPU и GPU)",
        "Установка и проверка ML-Agents",
        "Настройка Unity-проекта с пакетом ML-Agents",
      ]}
    >
      {/* ── 1. Введение: зачем нужен каждый инструмент ── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Что мы устанавливаем и зачем?
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Для обучения RL-агентов нам нужен стек из четырёх компонентов. Каждый отвечает
          за свою часть процесса — от симуляции среды до обучения нейросети:
        </p>

        {/* Stack diagram */}
        <div className="space-y-2">
          {STACK_LAYERS.map((layer, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg border flex items-center justify-center flex-shrink-0 ${layer.bg}`}
              >
                <layer.icon className={`w-5 h-5 ${layer.color}`} />
              </div>
              <div className="flex-1 p-3 rounded-lg bg-card/40 border border-border/30">
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm ${layer.color}`}>{layer.label}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{layer.desc}</p>
              </div>
              {i < STACK_LAYERS.length - 1 && (
                <div className="hidden sm:block">
                  <ArrowRight className="w-4 h-4 text-muted-foreground/30 rotate-90 sm:rotate-0" />
                </div>
              )}
            </div>
          ))}
        </div>

        <Card className="bg-card/30 border-primary/20 mt-4">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Как они связаны:</strong> Unity создаёт
              игровую среду → ML-Agents Plugin передаёт наблюдения из среды →
              ML-Agents Python управляет обучением → PyTorch обучает нейросеть агента.
              Результат отправляется обратно в Unity для выполнения действий.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── Disk space warning ── */}
      <section>
        <Card className="bg-yellow-500/5 border-yellow-500/20">
          <CardContent className="p-4 flex gap-3 items-start">
            <HardDrive className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-yellow-400">Дисковое пространство</p>
              <p className="text-xs text-muted-foreground mt-1">
                Полная установка занимает <strong className="text-foreground">5–15 ГБ</strong>:
                Unity (~3–5 ГБ), PyTorch (~2 ГБ, с CUDA ~5 ГБ), ML-Agents (~200 МБ),
                Python + зависимости (~500 МБ). Убедитесь, что на диске достаточно места.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── System requirements ── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Monitor className="w-6 h-6 text-primary" />
          Системные требования
        </h2>
        <Card className="bg-card/50 border-border/40">
          <CardContent className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Python", value: "3.10+", required: true },
                { label: "Unity", value: "2022.3 LTS", required: true },
                { label: "ML-Agents", value: "1.1.0", required: true },
                { label: "PyTorch", value: "2.0+", required: true },
                { label: "ОС", value: "Windows 10 / macOS 12+ / Ubuntu 20.04+", required: true },
                { label: "CUDA (опционально)", value: "11.8+ для GPU-ускорения", required: false },
              ].map((req, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center py-2 px-3 rounded border text-sm ${
                    req.required
                      ? "bg-muted/20 border-border/20"
                      : "bg-muted/10 border-border/10 opacity-70"
                  }`}
                >
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    {req.required ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                    )}
                    {req.label}
                  </span>
                  <span className="font-mono text-primary text-xs">{req.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground/60 mt-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> — обязательно
              <span className="ml-3 w-1.5 h-1.5 rounded-full bg-muted-foreground/30" /> — опционально
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── Step 1: Python environment ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary">1</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Создание Python-окружения</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Изолированное окружение защищает системный Python от конфликтов зависимостей.
          Выберите свою ОС:
        </p>

        <Tabs defaultValue="windows" className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="windows">Windows</TabsTrigger>
            <TabsTrigger value="macos">macOS</TabsTrigger>
            <TabsTrigger value="linux">Linux</TabsTrigger>
          </TabsList>

          <TabsContent value="windows">
            <CyberCodeBlock language="python" filename="PowerShell">
              {`# Создаём виртуальное окружение
python -m venv rl-env

# Активация
rl-env\\Scripts\\activate

# Обновляем pip
python -m pip install --upgrade pip

# Проверяем версию
python --version
# Python 3.10.x или выше`}
            </CyberCodeBlock>
          </TabsContent>

          <TabsContent value="macos">
            <CyberCodeBlock language="python" filename="Terminal (zsh)">
              {`# Создаём виртуальное окружение
python3 -m venv rl-env

# Активация
source rl-env/bin/activate

# Обновляем pip
pip install --upgrade pip

# Проверяем версию
python --version
# Python 3.10.x или выше`}
            </CyberCodeBlock>
          </TabsContent>

          <TabsContent value="linux">
            <CyberCodeBlock language="python" filename="Terminal (bash)">
              {`# Создаём виртуальное окружение
python3 -m venv rl-env

# Активация
source rl-env/bin/activate

# Обновляем pip
pip install --upgrade pip

# Проверяем версию
python --version
# Python 3.10.x или выше`}
            </CyberCodeBlock>
          </TabsContent>
        </Tabs>

        {/* Conda alternative */}
        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem
            value="conda"
            className="border-border/30 rounded-lg overflow-hidden bg-card/20"
          >
            <AccordionTrigger className="px-4 text-sm text-muted-foreground hover:text-foreground hover:no-underline">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Альтернатива: Conda / Miniconda
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Если вы предпочитаете Conda (особенно удобно для управления версиями Python):
              </p>
              <CyberCodeBlock language="python" filename="terminal">
                {`# Создание окружения с нужной версией Python
conda create -n rl-env python=3.10 -y

# Активация
conda activate rl-env

# Обновляем pip внутри conda-окружения
pip install --upgrade pip`}
              </CyberCodeBlock>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* ── Step 2: PyTorch ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary">2</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Установка PyTorch</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-4">
          <CrossLinkToHub
            hubPath="/pytorch/cheatsheet"
            hubAnchor="setup"
            hubTitle="PyTorch — Установка"
          >
            PyTorch
          </CrossLinkToHub>{" "}
          — фреймворк глубокого обучения, где основная структура данных —{" "}
          <CrossLinkToHub
            hubPath="/pytorch/cheatsheet"
            hubAnchor="tensors"
            hubTitle="PyTorch — Тензоры"
          >
            тензоры
          </CrossLinkToHub>
          . ML-Agents использует его «под капотом» для обучения нейросетей.
        </p>

        {/* GPU vs CPU guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <Card className="bg-card/50 border-green-500/20">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-sm text-green-400 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> CPU-версия
              </h3>
              <p className="text-xs text-muted-foreground">
                Подходит для Уровня 1 курса, простых сред (CartPole, GridWorld) и
                начального обучения. Установка проще и легче.
              </p>
              <p className="text-xs text-primary font-medium">Рекомендуем для старта</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-orange-500/20">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-bold text-sm text-orange-400 flex items-center gap-2">
                <Flame className="w-4 h-4" /> GPU-версия (CUDA)
              </h3>
              <p className="text-xs text-muted-foreground">
                Нужна для Уровня 2+ при тяжёлых тренировках (3D-среды, PPO, SAC).
                Ускоряет обучение в 5–50 раз. Требует NVIDIA GPU.
              </p>
              <p className="text-xs text-muted-foreground/70">Можно установить позже</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="cpu" className="w-full">
          <TabsList>
            <TabsTrigger value="cpu">CPU</TabsTrigger>
            <TabsTrigger value="gpu">GPU (CUDA 11.8)</TabsTrigger>
          </TabsList>

          <TabsContent value="cpu">
            <CyberCodeBlock language="python" filename="terminal">
              {`# CPU-версия (подходит для начала)
pip install torch torchvision torchaudio

# Проверка установки
python -c "import torch; print(torch.__version__); print('CUDA:', torch.cuda.is_available())"
# Ожидаемый вывод: 2.x.x, CUDA: False`}
            </CyberCodeBlock>
          </TabsContent>

          <TabsContent value="gpu">
            <CyberCodeBlock language="python" filename="terminal">
              {`# GPU-версия (CUDA 11.8, требует NVIDIA GPU)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# Проверка установки и GPU
python -c "import torch; print(torch.__version__); print('CUDA:', torch.cuda.is_available()); print('GPU:', torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'N/A')"
# Ожидаемый вывод: 2.x.x, CUDA: True, GPU: NVIDIA ...`}
            </CyberCodeBlock>
          </TabsContent>
        </Tabs>
      </section>

      {/* ── Step 3: ML-Agents ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary">3</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Установка{" "}
            <CrossLinkToHub
              hubPath="/unity-ml-agents"
              hubAnchor="installation"
              hubTitle="Unity ML-Agents — Установка"
            >
              ML-Agents
            </CrossLinkToHub>
          </h2>
        </div>

        <CyberCodeBlock language="python" filename="terminal">
          {`# Установка ML-Agents Python-пакета
pip install mlagents==1.1.0

# Проверка установки
mlagents-learn --help

# Вы должны увидеть список параметров:
#   --run-id, --env, --num-envs, и др.`}
        </CyberCodeBlock>

        <Card className="bg-card/30 border-border/30 mt-4">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">requirements.txt</strong> — для удобства
              можно установить все зависимости одной командой. Создайте файл{" "}
              <code className="text-primary text-xs">requirements.txt</code>:
            </p>
          </CardContent>
        </Card>

        <CyberCodeBlock language="python" filename="requirements.txt">
          {`torch>=2.0.0
torchvision
torchaudio
mlagents==1.1.0
protobuf==3.20.3
grpcio==1.48.2
gymnasium>=0.29.0
matplotlib
numpy`}
        </CyberCodeBlock>

        <CyberCodeBlock language="python" filename="terminal">
          {`# Установка всех зависимостей одной командой
pip install -r requirements.txt`}
        </CyberCodeBlock>
      </section>

      {/* ── Step 4: Unity ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary">4</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Настройка Unity-проекта</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Создайте новый 3D-проект в Unity Hub с версией{" "}
          <strong className="text-foreground">2022.3 LTS</strong>, затем добавьте пакет
          ML-Agents:
        </p>

        <div className="space-y-3">
          {[
            {
              step: "Откройте Unity Hub → New Project → 3D (URP) → назовите проект, например «RL-Lab»",
              icon: Gamepad2,
            },
            {
              step: "В Unity: Window → Package Manager → + → Add package by name",
              icon: Monitor,
            },
            {
              step: "Введите: com.unity.ml-agents → Install",
              icon: Bot,
            },
            {
              step: "Дождитесь завершения установки (появится в списке пакетов)",
              icon: CheckCircle2,
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">{i + 1}</span>
              </div>
              <div className="flex items-center gap-2 flex-1 p-3 rounded-lg bg-card/40 border border-border/30">
                <item.icon className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{item.step}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Step 5: Verify ── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary">5</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Полная проверка окружения</h2>
        </div>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Запустите этот скрипт, чтобы убедиться, что все компоненты установлены
          корректно и совместимы:
        </p>

        <CyberCodeBlock language="python" filename="check_env.py">
          {`import sys

print("=" * 50)
print("  Проверка окружения для RL-курса")
print("=" * 50)

# 1. Python
print(f"\\n[1] Python: {sys.version}")
assert sys.version_info >= (3, 10), "Нужен Python 3.10+"
print("    ✅ Версия OK")

# 2. PyTorch
import torch
print(f"\\n[2] PyTorch: {torch.__version__}")
print(f"    CUDA доступна: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"    GPU: {torch.cuda.get_device_name(0)}")
t = torch.tensor([1.0, 2.0, 3.0])
print(f"    Тензор: {t} — ✅ работает")

# 3. ML-Agents
import mlagents
print(f"\\n[3] ML-Agents: {mlagents.__version__}")
print("    ✅ Импорт OK")

# 4. Gymnasium
import gymnasium
print(f"\\n[4] Gymnasium: {gymnasium.__version__}")
env = gymnasium.make("CartPole-v1")
obs, _ = env.reset()
print(f"    CartPole obs: {obs.shape} — ✅ среда работает")
env.close()

# 5. Протестировать основные зависимости
import google.protobuf
import grpc
print(f"\\n[5] protobuf: {google.protobuf.__version__}")
print(f"    grpcio: {grpc.__version__}")
print("    ✅ Зависимости OK")

print("\\n" + "=" * 50)
print("  ✅ Всё готово! Можно приступать к обучению.")
print("=" * 50)`}
        </CyberCodeBlock>

        <CyberCodeBlock language="python" filename="terminal">
          {`# Запуск скрипта проверки
python check_env.py`}
        </CyberCodeBlock>

        <Card className="bg-green-500/5 border-green-500/20 mt-4">
          <CardContent className="p-4 flex gap-3 items-start">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-green-400">Всё готово!</p>
              <p className="text-xs text-muted-foreground mt-1">
                Если скрипт выводит «Всё готово!» без ошибок — окружение настроено корректно.
                Также убедитесь, что в Unity установлен пакет{" "}
                <code className="text-primary">com.unity.ml-agents</code>.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Interactive checklist ── */}
      <section>
        <SetupChecklist items={CHECKLIST_ITEMS} storageKey="lesson-1-2-checklist" />
      </section>

      {/* ── Common errors (Accordion) ── */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-destructive" />
          Типичные ошибки и решения
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Раскройте нужную ошибку, чтобы увидеть решение:
        </p>

        <Accordion type="multiple" className="space-y-2">
          {[
            {
              id: "protobuf",
              error: "protobuf version conflict",
              solution:
                "ML-Agents требует конкретную версию protobuf. Установите совместимую версию:",
              fix: "pip install protobuf==3.20.3",
            },
            {
              id: "grpcio",
              error: "grpcio installation fails",
              solution:
                "На некоторых системах (особенно macOS M1/M2) нужна конкретная версия grpcio:",
              fix: "pip install grpcio==1.48.2",
            },
            {
              id: "python-ver",
              error: "Python version not supported",
              solution:
                "ML-Agents 1.1.0 не поддерживает Python 3.12+. Используйте Python 3.10 или 3.11. Если используете Conda, можно легко создать окружение с нужной версией:",
              fix: "conda create -n rl-env python=3.10 -y",
            },
            {
              id: "module-not-found",
              error: "ModuleNotFoundError: No module named 'mlagents'",
              solution:
                "Скорее всего, виртуальное окружение не активировано. Активируйте его:",
              fix: "source rl-env/bin/activate  # macOS/Linux\nrl-env\\Scripts\\activate     # Windows",
            },
            {
              id: "cuda-mismatch",
              error: "CUDA version mismatch / torch.cuda.is_available() = False",
              solution:
                "Версия CUDA в PyTorch должна совпадать с установленной в системе. Проверьте свою версию и переустановите PyTorch:",
              fix: "nvcc --version  # проверка системной CUDA\npip install torch --index-url https://download.pytorch.org/whl/cu118",
            },
          ].map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="border-destructive/20 rounded-lg overflow-hidden bg-card/30"
            >
              <AccordionTrigger className="px-4 text-sm hover:no-underline">
                <span className="flex items-center gap-2 text-left">
                  <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                  <code className="font-mono text-xs text-destructive">{item.error}</code>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <p className="text-sm text-muted-foreground mb-2">{item.solution}</p>
                <CyberCodeBlock language="python" filename="fix">
                  {item.fix}
                </CyberCodeBlock>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ── Summary ── */}
      <section>
        <Card className="bg-gradient-to-br from-primary/5 via-card/40 to-secondary/5 border-primary/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              Подведём итоги
            </h2>
            <div className="space-y-3">
              {[
                "Стек состоит из 4 уровней: Unity → ML-Agents Plugin → ML-Agents Python → PyTorch",
                "Изолированное окружение (venv / Conda) защищает от конфликтов зависимостей",
                "Для Уровня 1 достаточно CPU-версии PyTorch, GPU понадобится позже",
                "ML-Agents 1.1.0 работает с Python 3.10–3.11 и PyTorch 2.0+",
                "Gymnasium — лёгкая библиотека сред для быстрого освоения алгоритмов RL",
                "Скрипт check_env.py позволяет быстро проверить все компоненты",
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-primary font-bold text-sm mt-0.5">{i + 1}.</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
              <p className="text-sm text-foreground font-medium flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                Что дальше?
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                В следующих уроках мы освоим ключевые RL-алгоритмы (Q-learning, DQN) в
                лёгких средах Gymnasium — CartPole и FrozenLake. Это позволит сфокусироваться
                на алгоритмах без сложностей 3D-движка. Затем, начиная с Уровня 2, мы
                перенесём эти навыки в Unity ML-Agents для обучения агентов в полноценных
                3D-играх.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── Quiz ── */}
      <Quiz
        title="Проверь себя: Установка окружения"
        questions={quizQuestions}
        nextLesson={{ path: "/courses/1-3", title: "Марковские процессы принятия решений (MDP)" }}
      />
    </LessonLayout>
  );
};

export default CourseLesson1_2;
