import { Card, CardContent } from "@/components/ui/card";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { AlertTriangle, CheckCircle2, ExternalLink, FolderGit2 } from "lucide-react";

const MLAgentsSection = () => (
  <div className="space-y-8">
    <p className="text-muted-foreground leading-relaxed">
      Устанавливаем{" "}
      <CrossLinkToHub
        hubPath="/unity-ml-agents"
        hubAnchor="installation"
        hubTitle="Unity ML-Agents — Установка"
      >
        ML-Agents
      </CrossLinkToHub>{" "}
      «продвинутым» способом — клонированием официального репозитория. Так вы получите не
      только Python-пакеты, но и исходный код тренера, готовые сцены-примеры и конфиги
      обучения.
    </p>

    {/* 5.1 Clone */}
    <div>
      <h3 className="text-lg font-bold text-foreground mb-3">
        Шаг 1. Клонирование репозитория
      </h3>
      <p className="text-sm text-muted-foreground mb-3">
        Клонируем именно релизную ветку{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">release_22</code> — она
        зафиксирована и протестирована, в отличие от{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">develop</code>:
      </p>
      <CyberCodeBlock language="python" filename="terminal (mlagents)">
        {`cd ~/rl-course        # Windows: cd C:\\rl-course
git clone --branch release_22 https://github.com/Unity-Technologies/ml-agents.git`}
      </CyberCodeBlock>

      <Card className="bg-card/30 border-primary/20 mt-4">
        <CardContent className="p-4 flex gap-3 items-start">
          <FolderGit2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Что внутри репозитория:</p>
            <ul className="space-y-1 text-xs">
              <li>
                <code className="text-cyan-300">ml-agents/</code> — исходный код тренера
              </li>
              <li>
                <code className="text-cyan-300">ml-agents-envs/</code> — низкоуровневый API
                среды
              </li>
              <li>
                <code className="text-cyan-300">com.unity.ml-agents/</code> — Unity-пакет
                (C# SDK)
              </li>
              <li>
                <code className="text-cyan-300">Project/Assets/ML-Agents/Examples/</code> —
                сцены-примеры: 3DBall, PushBlock, Crawler и др.
              </li>
              <li>
                <code className="text-cyan-300">config/</code> — готовые YAML-конфиги
                обучения (PPO, SAC, POCA)
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* 5.2 pip install */}
    <div>
      <h3 className="text-lg font-bold text-foreground mb-3">
        Шаг 2. Установка Python-пакетов из репозитория
      </h3>
      <p className="text-sm text-muted-foreground mb-3">
        Внутри активированной среды{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">mlagents</code>{" "}
        устанавливаем оба пакета в editable-режиме (
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">-e</code>) — изменения в
        исходном коде будут подхватываться без переустановки. Порядок важен: сначала{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">ml-agents-envs</code>,
        затем <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">ml-agents</code>:
      </p>
      <CyberCodeBlock language="python" filename="terminal (mlagents)">
        {`cd ml-agents
python -m pip install -e ./ml-agents-envs
python -m pip install -e ./ml-agents`}
      </CyberCodeBlock>

      <Card className="bg-yellow-500/5 border-yellow-500/20 mt-4">
        <CardContent className="p-4 flex gap-3 items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Ожидаемое поведение pip:</strong>{" "}
            установщик может понизить версии{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">numpy</code> (до
            1.23.x) и{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">protobuf</code> (до
            3.20.x) — это штатные ограничения зависимостей ML-Agents, не «ломайте» их
            обратным обновлением. Уже установленный PyTorch с CUDA при этом не затрагивается.
          </p>
        </CardContent>
      </Card>
    </div>

    {/* 5.3 Unity package */}
    <div>
      <h3 className="text-lg font-bold text-foreground mb-3">
        Шаг 3. Подключение Unity-пакета к проекту
      </h3>
      <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground mb-3">
        <li>Откройте тестовый проект в Unity 6.</li>
        <li>
          <em>Window → Package Manager → «+» → Add package from disk…</em>
        </li>
        <li>
          Выберите файл{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
            ml-agents/com.unity.ml-agents/package.json
          </code>{" "}
          из клонированного репозитория.
        </li>
      </ol>
      <p className="text-sm text-muted-foreground">
        Установка «с диска» гарантирует, что версия Unity-пакета точно соответствует версии
        Python-пакетов из той же ветки. Для проверки откройте сцену{" "}
        <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
          Project/Assets/ML-Agents/Examples/3DBall/Scenes/3DBall.unity
        </code>{" "}
        (подпроект <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">Project/</code>{" "}
        можно добавить в Unity Hub через <em>Add project from disk</em>) и нажмите Play —
        агенты начнут балансировать мячи на предобученной модели.
      </p>
    </div>

    {/* 5.4 verify */}
    <div>
      <h3 className="text-lg font-bold text-foreground mb-3">
        Шаг 4. Проверка Python-части
      </h3>
      <CyberCodeBlock language="python" filename="terminal (mlagents)">
        {`mlagents-learn --help`}
      </CyberCodeBlock>
      <Card className="bg-green-500/5 border-green-500/20 mt-4">
        <CardContent className="p-4 flex gap-3 items-start">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Если на экране появилась справка с логотипом ML-Agents и списком опций —
            Python-часть тулкита установлена корректно.
          </p>
        </CardContent>
      </Card>
    </div>

    <a
      href="https://github.com/Unity-Technologies/ml-agents"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-cyan-300 hover:text-cyan-200 hover:underline"
    >
      <ExternalLink className="w-3.5 h-3.5" />
      Репозиторий Unity ML-Agents на GitHub
    </a>
  </div>
);

export default MLAgentsSection;
