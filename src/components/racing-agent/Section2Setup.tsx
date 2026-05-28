import { Card } from "@/components/ui/card";
import CyberCodeBlock from "@/components/CyberCodeBlock";

const Section2Setup = () => (
  <div className="space-y-8">
    {/* 2.1 Совместимость версий */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">2.1. Совместимость версий</h3>
      <p className="text-muted-foreground leading-relaxed">
        Взаимодействие между физическим симулятором Unity и вычислительным бэкендом PyTorch
        осуществляется через проприетарные сокетные каналы gRPC, чувствительные к версиям библиотек
        сериализации.{" "}
        <strong className="text-foreground">Нарушение совместимости в цепочке зависимостей компилятора
        ONNX или интерпретатора Python — наиболее частая причина аварийного завершения сессий обучения.</strong>
      </p>

      <p className="text-sm font-semibold text-cyan-300 mb-2">
        Базовая спецификация (рекомендуется для МГППУ):
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-cyan-500/20">
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Компонент</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Версия</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Источник / Назначение</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["Unity Editor",        "2023.2+ (для release_22); 2022.3 LTS (для release_21)",    "CHANGELOG.md: «The minimum supported Unity version was updated to 2023.2»"],
              ["com.unity.ml-agents", "3.0.0",                                                    "release_22 GitHub tag"],
              ["Python",              "3.10.12 (диапазон ≥3.10.1, ≤3.10.12)",                    "mlagents 1.1.0 PyPI metadata"],
              ["mlagents (Python)",   "1.1.0 (Oct 5, 2024)",                                     "PyPI"],
              ["PyTorch",             "2.2.1",                                                    "docs ML-Agents Installation"],
            ].map(([comp, ver, note]) => (
              <tr key={comp} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="py-2 px-3 font-medium text-foreground/80">{comp}</td>
                <td className="py-2 px-3 font-mono text-xs text-purple-300">{ver}</td>
                <td className="py-2 px-3">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm font-semibold text-purple-300 mb-2 mt-6">
        Расширенная спецификация (production-grade, для современных GPU Nvidia RTX 40/50):
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-cyan-500/20">
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Компонент</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Версия</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Назначение в архитектуре</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              ["Python",              "3.10.12",                              "Базовая среда исполнения скриптов обучения"],
              ["Unity Editor",        "6000.0 или новее",                    "Высокоточная симуляция физики и рендеринг"],
              ["com.unity.ml-agents", "4.0.0 (ветка release_23)",           "C# SDK для интеграции агентов в сцену"],
              ["mlagents (Python)",   "1.1.0 / 1.2.0",                      "Пакет алгоритмов глубокого обучения"],
              ["PyTorch",             "2.2.1+cu121 (или 2.9.1+cu130 RTX 50)","Тензорный бэкенд вычислений"],
              ["Protobuf",            "3.20.3",                              "Низкоуровневая сериализация gRPC-сообщений"],
              ["NumPy",               "1.23.5",                              "Быстрые векторные операции"],
              ["ONNX",                "1.20.1",                              "Экспорт весов обученной сети в Unity"],
              ["ONNXScript",          "0.6.2",                               "Интерфейс генерации графов PyTorch"],
              ["Setuptools",          "65.5.0",                              "Предотвращение ошибок разбора версий"],
            ].map(([comp, ver, note]) => (
              <tr key={comp} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="py-2 px-3 font-medium text-foreground/80">{comp}</td>
                <td className="py-2 px-3 font-mono text-xs text-purple-300">{ver}</td>
                <td className="py-2 px-3">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card className="border-yellow-400/30 bg-yellow-500/5 p-4 space-y-2">
        <p className="text-sm text-yellow-200">
          <strong>Внимание для МГППУ:</strong> если в учебном классе установлен Unity 2022.3 LTS и его
          обновление невозможно, используйте <strong>release_21</strong> с пакетом{" "}
          <code className="px-1 py-0.5 rounded bg-muted/50 text-xs">com.unity.ml-agents@3.0.0-exp.1</code> —
          он функционально близок и работает с теми же YAML-конфигами.
        </p>
        <p className="text-sm text-yellow-200">
          <strong>Критически важно про Python 3.10.12.</strong> Более поздние версии (3.11, 3.12){" "}
          <strong>ломают дерево сборки</strong> устаревших библиотек C++. Используйте conda/Miniconda
          с явной фиксацией версии — обязательно.
        </p>
      </Card>
    </div>

    {/* 2.2 Установка Unity */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">2.2. Установка Unity</h3>
      <ol className="list-decimal list-inside space-y-2 text-muted-foreground leading-relaxed">
        <li>Скачайте <strong className="text-foreground">Unity Hub</strong> с сайта unity.com/download.</li>
        <li>В Hub установите редактор Unity 2023.2 (или 2022.3 LTS — см. примечание выше).</li>
        <li>Создайте новый проект шаблона <strong className="text-foreground">3D (URP)</strong> или <strong className="text-foreground">3D Built-in</strong>.</li>
      </ol>
    </div>

    {/* 2.3 Установка com.unity.ml-agents */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">2.3. Установка пакета com.unity.ml-agents</h3>
      <p className="text-muted-foreground leading-relaxed">В Unity Editor:</p>
      <ol className="list-decimal list-inside space-y-2 text-muted-foreground leading-relaxed">
        <li><strong className="text-foreground">Window → Package Manager → + → Add package by name</strong>.</li>
        <li>Имя пакета: <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">com.unity.ml-agents</code>, версия <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">3.0.0</code>.</li>
      </ol>
    </div>

    {/* 2.4 Python-окружение */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">2.4. Установка Python-окружения</h3>
      <p className="text-muted-foreground leading-relaxed">Рекомендуемая схема через conda:</p>
      <CyberCodeBlock language="pseudo" filename="terminal">
{`# 1. Создаём изолированное окружение Python 3.10.12
conda create -n mlagents python=3.10.12
conda activate mlagents

# 2. Ставим PyTorch 2.2.1 (CUDA 12.1 для GPU)
pip3 install torch~=2.2.1 --index-url https://download.pytorch.org/whl/cu121
# CPU-only вариант:  pip3 install torch~=2.2.1

# 3. Клонируем репозиторий release_22 (для исходников и примеров)
git clone --branch release_22 https://github.com/Unity-Technologies/ml-agents.git
cd ml-agents

# 4. Устанавливаем mlagents-envs и mlagents
python -m pip install ./ml-agents-envs
python -m pip install ./ml-agents

# Альтернатива через PyPi (без локальной копии примеров):
# pip install mlagents==1.1.0`}
      </CyberCodeBlock>
    </div>

    {/* 2.5 Проверка */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">2.5. Проверка установки</h3>
      <CyberCodeBlock language="pseudo" filename="terminal">
{`mlagents-learn --help`}
      </CyberCodeBlock>
      <p className="text-muted-foreground leading-relaxed">
        Если в консоли выводится список параметров CLI — установка прошла успешно.
      </p>
    </div>

    {/* 2.6 Структура проекта */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">2.6. Структура проекта Unity</h3>
      <CyberCodeBlock language="pseudo" filename="RacingAgentProject/">
{`RacingAgentProject/
├── Assets/
│   ├── Scripts/
│   │   ├── Agent/CarAgent.cs
│   │   ├── Car/CarController.cs
│   │   ├── Car/ICarController.cs
│   │   ├── Track/CheckpointManager.cs
│   │   ├── Track/Checkpoint.cs
│   │   └── Track/ICheckpointManager.cs
│   ├── Prefabs/Car.prefab
│   ├── Scenes/OvalTrack.unity
│   └── ML-Models/                    (.onnx файлы после обучения)
├── config/
│   ├── ppo_oval.yaml
│   └── sac_oval.yaml
└── results/                          (создаётся mlagents-learn автоматически)`}
      </CyberCodeBlock>
    </div>

    {/* 2.7 Типичные барьеры компиляции */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">2.7. Типичные барьеры компиляции и их обход</h3>

      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-red-400">
            Аномалия 1: сбой импорта с сообщением об отсутствии дескриптора <code className="bg-muted/50 px-1">opset23</code> в ONNX-трансляторе
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Причина:</strong> новые сборки PyTorch по умолчанию вызывают
            современный динамический экспортер, не поддерживаемый внутренним парсером Unity.<br />
            <strong className="text-foreground">Решение:</strong> принудительно перевести компилятор в классический
            режим экспорта, добавив аргумент{" "}
            <code className="bg-muted/50 px-1 text-xs">dynamo=False</code> в вызов{" "}
            <code className="bg-muted/50 px-1 text-xs">torch.onnx.export</code> внутри исходного файла:
          </p>
          <CyberCodeBlock language="pseudo" filename="path_to_miniconda\envs\mlagents\lib\site-packages\mlagents\trainers\torch_entities\model_serialization.py">
{`# Найдите вызов torch.onnx.export(...) и добавьте аргумент:
# dynamo=False`}
          </CyberCodeBlock>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-red-400">
            Аномалия 2: ошибки десериализации Protobuf
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Решение:</strong> установить фиксированную версию{" "}
            <code className="bg-muted/50 px-1 text-xs">protobuf==3.20.3</code>.
            Появляющиеся предупреждения о конфликтах зависимостей можно безопасно игнорировать.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-red-400">
            Аномалия 3: критические сбои API сравнения версий <code className="bg-muted/50 px-1">StrictVersion</code>
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Решение:</strong> установить{" "}
            <code className="bg-muted/50 px-1 text-xs">setuptools==65.5.0</code>.
          </p>
        </div>

        <p className="text-sm font-semibold text-foreground">Сводный «спасательный набор» при сбоях:</p>
        <CyberCodeBlock language="pseudo" filename="terminal (rescue)">
{`pip install protobuf==3.20.3
pip install setuptools==65.5.0
# + руками отредактировать model_serialization.py: добавить dynamo=False`}
        </CyberCodeBlock>
      </div>
    </div>

    <Card className="border-cyan-500/20 bg-cyan-500/5 p-4">
      <p className="text-sm text-cyan-200 font-medium">
        Ключевые моменты раздела 2: стек Unity 2023.2+, Python 3.10.12, PyTorch 2.2.1.
        Проверка: <code className="bg-muted/50 px-1 text-xs">mlagents-learn --help</code>.
        При сбоях ONNX-экспорта — <code className="bg-muted/50 px-1 text-xs">dynamo=False</code>;
        при ошибках сериализации —{" "}
        <code className="bg-muted/50 px-1 text-xs">protobuf==3.20.3</code>,{" "}
        <code className="bg-muted/50 px-1 text-xs">setuptools==65.5.0</code>.
      </p>
    </Card>
  </div>
);

export default Section2Setup;
