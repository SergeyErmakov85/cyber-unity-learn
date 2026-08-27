import { Card, CardContent } from "@/components/ui/card";
import HubLessonBadges from "@/components/HubLessonBadges";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { BookOpen, Cpu, Layers, Settings, Code, Wrench, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LabPracticeSection from "@/components/LabPracticeSection";

const TOC_ITEMS = [
  { id: "installation", label: "1. Установка и настройка" },
  { id: "pytorch-basics", label: "2. Основы PyTorch для ML-Agents" },
  { id: "neural-networks", label: "3. Создание нейронных сетей" },
  { id: "training", label: "4. Особенности PyTorch в ML-Agents" },
];

const UnityMLAgentsModule = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    TOC_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
              Модуль 7
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              PyTorch с Unity ML-Agents
            </span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Руководство по интеграции PyTorch с Unity ML-Agents: от установки до создания
            и обучения интеллектуальных агентов.
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="container mx-auto px-4 py-12 flex gap-8">
        {/* Sticky sidebar TOC */}
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="sticky top-24 space-y-1">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Содержание
            </h2>
            {TOC_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`block w-full text-left text-sm px-3 py-2 rounded-md transition-colors cursor-pointer border-l-2 ${
                  activeId === id
                    ? "border-primary text-primary bg-primary/10 font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 max-w-4xl space-y-12">

        {/* Введение */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Введение</h2>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Unity ML-Agents</strong> (Machine Learning Agents) — это инструментарий 
            с открытым исходным кодом, который позволяет разработчикам игр и исследователям обучать интеллектуальных агентов 
            с использованием методов машинного обучения, в частности, обучения с подкреплением (Reinforcement Learning). 
            ML-Agents предоставляет среду для обучения агентов в Unity и интегрируется с популярными библиотеками машинного 
            обучения, такими как PyTorch.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">PyTorch</strong> — это библиотека машинного обучения с открытым исходным кодом, 
            разработанная Facebook (Meta), которая предоставляет гибкий и эффективный фреймворк для создания и обучения 
            нейронных сетей. PyTorch используется в ML-Agents как основной бэкенд для алгоритмов обучения.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Это руководство поможет вам понять, как интегрировать PyTorch с Unity ML-Agents для создания и обучения 
            интеллектуальных агентов в ваших проектах.
          </p>
        </section>

        {/* 1. Установка и настройка */}
        <section id="installation" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            1. Установка и настройка
          </h2>
          <HubLessonBadges hubPath="/unity-ml-agents" hubAnchor="installation" />
          <p className="text-sm text-muted-foreground">(подробнее — <CrossLinkToLesson lessonId="1-2" lessonPath="/courses/1-2" lessonTitle="Установка окружения: PyTorch + Unity ML-Agents" lessonLevel={1} />) (Sentis — <CrossLinkToLesson lessonId="3-5" lessonPath="/courses/3-5" lessonTitle="ONNX-экспорт и деплой в Unity" lessonLevel={3} />)</p>


          <Card className="bg-card/60 backdrop-blur-sm border-accent/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Требования к системе</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong className="text-foreground">ОС:</strong> Windows 10/11, macOS 10.15+, или Linux (Ubuntu 18.04+)</li>
                <li><strong className="text-foreground">Unity:</strong> Unity 2023.2 или новее</li>
                <li><strong className="text-foreground">Python:</strong> Python 3.10.1 — 3.10.12 (рекомендуется 3.10.12)</li>
                <li><strong className="text-foreground">GPU:</strong> NVIDIA GPU с поддержкой CUDA (рекомендуется для ускорения)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Установка Anaconda Navigator</h3>
              <p className="text-muted-foreground">
                Anaconda — менеджер пакетов и виртуальных сред, который упрощает управление зависимостями Python для ML-проектов.
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Перейдите на официальный сайт: <a href="https://www.anaconda.com/download" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">anaconda.com/download</a></li>
                <li>Скачайте установщик для вашей ОС (Windows / macOS / Linux)</li>
                <li>Запустите установщик и следуйте инструкциям (рекомендуется установка «Just Me»)</li>
                <li>После установки откройте терминал (или Anaconda Prompt на Windows) и проверьте:</li>
              </ol>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`# Проверяем, что conda установлена
conda --version
# conda 24.x.x

# Обновляем conda до последней версии
conda update conda -y`}
              </pre>
              <p className="text-muted-foreground text-sm">
                💡 <strong className="text-foreground">Совет:</strong> На Windows используйте «Anaconda Prompt» вместо стандартной командной строки — в ней conda доступна сразу после установки.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Установка Unity</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Скачайте и установите Unity Hub с официального сайта Unity</li>
                <li>Через Unity Hub установите Unity 2023.2 или новее</li>
                <li>При установке выберите модуль «Linux Build Support» или «Windows Build Support»</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Создание виртуальной среды и установка PyTorch</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
                <li>Создайте виртуальную среду с Python 3.10 через conda:</li>
              </ol>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`# Создаём виртуальную среду с именем "mlagents-env" и Python 3.10.12
conda create -n mlagents-env python=3.10.12 -y

# Активируем среду
conda activate mlagents-env

# Проверяем версию Python
python --version
# Python 3.10.x`}
              </pre>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4" start={2}>
                <li>Установите PyTorch внутри активированной среды:</li>
              </ol>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`# Для CUDA версии (если у вас есть NVIDIA GPU)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# Для CPU версии
pip install torch torchvision torchaudio`}
              </pre>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Установка ML-Agents</h3>
              <p className="text-muted-foreground">ML-Agents состоит из нескольких компонентов:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Unity пакет (C# SDK)</li>
                <li>Python пакеты для обучения агентов</li>
              </ul>

              <h4 className="text-md font-semibold text-foreground mt-4">Unity пакет ML-Agents</h4>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Откройте ваш Unity проект</li>
                <li>Откройте Window → Package Manager</li>
                <li>Нажмите «+» в верхнем левом углу</li>
                <li>Выберите «Add package from git URL...»</li>
                <li>Введите <code className="bg-background/80 px-2 py-0.5 rounded text-primary text-xs">com.unity.ml-agents</code> и нажмите «Add»</li>
              </ol>

              <h4 className="text-md font-semibold text-foreground mt-4">Python пакеты ML-Agents</h4>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`git clone --branch develop https://github.com/Unity-Technologies/ml-agents.git
cd ml-agents

# Установка основного пакета ML-Agents
# Из корневой директории репозитория выполните:

pip3 install torch -f https://download.pytorch.org/whl/torch_stable.html
pip install -e ./ml-agents-envs
pip install -e ./ml-agents`}
              </pre>
            </CardContent>
          </Card>

          {/* Advanced Installation */}
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                🔧 Advanced Installation — Продвинутая установка
              </h3>
              <p className="text-muted-foreground">
                Для полного контроля над версиями и возможности модификации исходного кода ML-Agents
                рекомендуется установка напрямую из GitHub-репозитория.
              </p>

              <h4 className="text-md font-semibold text-foreground mt-2">1. Клонируем репозиторий ML-Agents</h4>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`# Убедитесь, что виртуальная среда активирована
conda activate mlagents-env

# Клонируем репозиторий с конкретным релизом (Release 23)
git clone --branch release_23 https://github.com/Unity-Technologies/ml-agents.git
cd ml-agents`}
              </pre>

              <h4 className="text-md font-semibold text-foreground mt-2">2. Устанавливаем Python-пакеты из локального репозитория</h4>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`# Из корневой директории репозитория выполните:
pip3 install torch -f https://download.pytorch.org/whl/torch_stable.html

# Установка среды взаимодействия с Unity
pip install -e ./ml-agents-envs

# Установка основного пакета обучения
pip install -e ./ml-agents

# (Опционально) Установка расширений
pip install -e ./ml-agents-extensions`}
              </pre>
              <p className="text-xs text-muted-foreground">
                Флаг <code className="bg-background/80 px-1.5 py-0.5 rounded text-primary">-e</code> (editable mode)
                позволяет вносить изменения в исходный код пакетов без переустановки.
              </p>

              <h4 className="text-md font-semibold text-foreground mt-2">3. Подключаем локальный Unity-пакет</h4>
              <p className="text-muted-foreground">
                Вместо установки через Package Manager по имени, можно подключить пакет из склонированного репозитория:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Откройте Unity → Window → Package Manager</li>
                <li>Нажмите «+» → «Add package from disk...»</li>
                <li>Укажите путь <code className="bg-background/80 px-1.5 py-0.5 rounded text-primary text-xs">ml-agents/com.unity.ml-agents/package.json</code></li>
                <li>Повторите для <code className="bg-background/80 px-1.5 py-0.5 rounded text-primary text-xs">ml-agents/com.unity.ml-agents.extensions/package.json</code></li>
              </ol>

              <h4 className="text-md font-semibold text-foreground mt-2">4. Проверка</h4>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`# Проверяем версию mlagents
mlagents-learn --help

# Запускаем один из примеров для теста
mlagents-learn config/ppo/3DBall.yaml --run-id=test_run`}
              </pre>
              <p className="text-xs text-muted-foreground mt-2">
                ⚠️ Убедитесь, что версия Unity-пакета и Python-пакетов совпадают (например, Release 23).
                Несовпадение версий — частая причина ошибок при подключении.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-secondary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Проверка установки</h3>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`import torch
print(f"PyTorch version: {torch.__version__}")
print(f"CUDA available:  {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"CUDA version:    {torch.version.cuda}")

# Проверка ML-Agents (в терминале)
mlagents-learn --help`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* 2. Основы PyTorch для ML-Agents */}
        <section id="pytorch-basics" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Cpu className="w-6 h-6 text-secondary" />
            2. Основы PyTorch для ML-Agents
          </h2>

          <Card className="bg-card/60 backdrop-blur-sm border-secondary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Архитектура ML-Agents и PyTorch</h3>
              <p className="text-muted-foreground">ML-Agents использует PyTorch как основной бэкенд для алгоритмов обучения с подкреплением. Взаимодействие происходит так:</p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Unity (C#):</strong> Среда симуляции, где агенты взаимодействуют и собирают опыт</li>
                <li><strong className="text-foreground">Python API:</strong> Связующее звено между Unity и алгоритмами обучения</li>
                <li><strong className="text-foreground">PyTorch (Python):</strong> Фреймворк для создания и обучения нейронных сетей</li>
              </ol>

              <h4 className="text-md font-semibold text-foreground mt-4">Процесс обучения</h4>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Агенты в Unity собирают опыт (наблюдения, действия, награды)</li>
                <li>Опыт передается в Python через API</li>
                <li>PyTorch использует этот опыт для обучения нейронных сетей</li>
                <li>Обученные модели сохраняются в формате ONNX</li>
                <li>Unity загружает обученные модели для управления агентами</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-secondary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Тензоры (Tensors)</h3>
              <p className="text-muted-foreground">
                Тензоры — многомерные массивы, основной тип данных в PyTorch. В ML-Agents тензоры представляют:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Наблюдения агентов</li>
                <li>Действия агентов</li>
                <li>Параметры нейронных сетей</li>
                <li>Градиенты при обучении</li>
              </ul>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`import torch

# Создание тензора из списка
observation_tensor = torch.tensor([0.1, 0.2, 0.3, 0.4])

# Создание тензора случайных значений
random_tensor = torch.rand(4, 3)  # Тензор размера 4x3`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* 3. Нейронные сети */}
        <section id="neural-networks" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Layers className="w-6 h-6 text-accent" />
            3. Создание нейронных сетей для ML-Agents
          </h2>
          <HubLessonBadges hubPath="/unity-ml-agents" hubAnchor="neural-networks" />
          <p className="text-sm text-muted-foreground">(Actor-Critic — <CrossLinkToLesson lessonId="2-3" lessonPath="/courses/2-3" lessonTitle="Actor-Critic и непрерывные действия" lessonLevel={2} />) (сенсоры — <CrossLinkToLesson lessonId="project-2" lessonPath="/courses/project-2" lessonTitle="3D-агент-охотник в Unity" lessonLevel={2} />)</p>

          <Card className="bg-card/60 backdrop-blur-sm border-accent/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Модули нейронных сетей (nn.Module)</h3>
              <p className="text-muted-foreground">ML-Agents использует следующие модули PyTorch:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><code className="text-primary text-xs">nn.Linear</code> — Полносвязные слои</li>
                <li><code className="text-primary text-xs">nn.Conv2d</code> — Сверточные слои для обработки изображений</li>
                <li><code className="text-primary text-xs">nn.LSTM</code> — Рекуррентные слои для обработки последовательностей</li>
                <li><code className="text-primary text-xs">nn.ReLU</code>, <code className="text-primary text-xs">nn.Tanh</code> — Функции активации</li>
              </ul>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`import torch.nn as nn

class SimpleNetwork(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(SimpleNetwork, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return x`}
              </pre>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-accent/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Оптимизаторы (Optimizers)</h3>
              <p className="text-muted-foreground">Оптимизаторы обновляют параметры нейронных сетей на основе градиентов:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><code className="text-primary text-xs">torch.optim.Adam</code> — Адаптивный оптимизатор с моментом</li>
                <li><code className="text-primary text-xs">torch.optim.SGD</code> — Стохастический градиентный спуск</li>
              </ul>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`import torch.optim as optim

# Создание нейронной сети
network = SimpleNetwork(input_size=10, hidden_size=64, output_size=2)

# Создание оптимизатора
optimizer = optim.Adam(network.parameters(), lr=0.001)

# Обновление параметров
optimizer.zero_grad()  # Очистка градиентов
loss = compute_loss()  # Вычисление функции потерь
loss.backward()        # Вычисление градиентов
optimizer.step()       # Обновление параметров`}
              </pre>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-accent/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Функции потерь (Loss Functions)</h3>
              <p className="text-muted-foreground">Функции потерь оценивают качество предсказаний модели:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><code className="text-primary text-xs">nn.MSELoss</code> — Среднеквадратичная ошибка для непрерывных действий</li>
                <li><code className="text-primary text-xs">nn.CrossEntropyLoss</code> — Перекрестная энтропия для дискретных действий</li>
                <li>Пользовательские функции потерь для алгоритмов RL (PPO, SAC)</li>
              </ul>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`import torch.nn.functional as F

# Предсказания модели
predictions = network(observations)

# Целевые значения
targets = compute_targets()

# Вычисление функции потерь
loss = F.mse_loss(predictions, targets)`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* 4. Процесс обучения */}
        <section id="training" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Rocket className="w-6 h-6 text-primary" />
            4. Особенности PyTorch в ML-Agents
          </h2>
          <HubLessonBadges hubPath="/unity-ml-agents" hubAnchor="training" />
          <p className="text-sm text-muted-foreground">
            (PPO — <CrossLinkToLesson lessonId="2-2" lessonPath="/courses/2-2" lessonTitle="PPO — Proximal Policy Optimization" lessonLevel={2} />)
            (параллелизация — <CrossLinkToLesson lessonId="2-5" lessonPath="/courses/2-5" lessonTitle="Параллельные среды и масштабирование" lessonLevel={2} />)
            (curriculum — <CrossLinkToLesson lessonId="3-3" lessonPath="/courses/3-3" lessonTitle="Curriculum Learning" lessonLevel={3} />)
            (self-play — <CrossLinkToLesson lessonId="3-2" lessonPath="/courses/3-2" lessonTitle="MA-POCA и Self-Play" lessonLevel={3} />)
          </p>

          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Ключевые особенности</h3>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Динамические вычислительные графы:</strong> PyTorch создает 
                  вычислительные графы «на лету», что упрощает отладку и экспериментирование.
                </li>
                <li>
                  <strong className="text-foreground">Автоматическое дифференцирование:</strong> PyTorch автоматически 
                  вычисляет градиенты для обновления параметров нейронных сетей.
                </li>
                <li>
                  <strong className="text-foreground">Поддержка GPU:</strong> PyTorch может выполнять вычисления на GPU, 
                  что значительно ускоряет обучение.
                </li>
                <li>
                  <strong className="text-foreground">Экспорт моделей в ONNX:</strong> PyTorch позволяет экспортировать 
                  обученные модели в формат ONNX, который может быть загружен в Unity.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Использование GPU</h3>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`# Проверка доступности GPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Перемещение модели на GPU
network = network.to(device)

# Перемещение данных на GPU
observations = observations.to(device)`}
              </pre>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Экспорт модели в ONNX</h3>
              <pre className="bg-background/80 border border-border/50 rounded-lg p-4 overflow-x-auto text-sm text-foreground">
{`import torch.onnx

# Экспорт модели в ONNX
dummy_input = torch.randn(1, input_size)
torch.onnx.export(network, dummy_input, "model.onnx")`}
              </pre>
            </CardContent>
          </Card>
        </section>

        {/* Практика: собранная среда лаборатории для этой темы. */}
        <LabPracticeSection contextKey="/unity-ml-agents" />

        </div>{/* end flex-1 main content */}
      </div>{/* end flex container */}
    </div>
  );
};

export default UnityMLAgentsModule;
