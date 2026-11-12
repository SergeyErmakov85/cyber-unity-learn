import CyberCodeBlock from "@/components/CyberCodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { NoviceSection, NoviceQuestions } from "@/components/novice/NoviceLesson";

export const SECTIONS: NoviceSection[] = [
  { id: "requirements", label: "Что устанавливаем", content: <>
    <p>Для Python-заданий нужны conda, Python 3.10.12, PyTorch 2.2.1, NumPy, Gymnasium и Matplotlib. Для итогового проекта — Unity и библиотека ML-Agents. <strong>GPU для начальных заданий не требуется.</strong></p>
    <p>Python-примеры можно выполнять в Windows, macOS или Linux. Готовые скрипты сборки и проверки проекта E04 рассчитаны на <strong>Windows x64</strong>; для него используем эту платформу. Потребуются Git, около 15 ГБ свободного места и не менее 8 ГБ оперативной памяти.</p>
    <p>Зафиксированная связка проекта: Python <strong>3.10.12</strong>, PyTorch <strong>2.2.1</strong>, Python-пакеты ML-Agents из <strong>release_23_tag</strong>, NumPy <strong>1.23.5</strong>. Unity берём версии <strong>6000.5.4f1</strong> из файла версии лаборатории; её пакеты уже записаны в проекте.</p>
  </> },
  { id: "conda-env", label: "1. Создать среду", content: <>
    <p>Установите <a href="https://www.anaconda.com/download" target="_blank" rel="noopener noreferrer" className="text-primary underline">Anaconda</a> для своей ОС. В Windows откройте <strong>Anaconda Prompt</strong>, в macOS/Linux — терминал с доступной командой <code>conda</code>. Установите Git с <a href="https://git-scm.com/downloads" target="_blank" rel="noopener noreferrer" className="text-primary underline">официальной страницы</a>.</p>
    <CyberCodeBlock language="pseudo" filename="Терминал">{`conda create -n mlagents python=3.10.12 -y
conda activate mlagents
python --version
git --version
python -m pip install --upgrade pip
mkdir rl-course
cd rl-course`}</CyberCodeBlock>
    <p>Ожидается <code>Python 3.10.12</code>. Все следующие команды выполняйте в этой среде. В новом терминале снова вводите <code>conda activate mlagents</code>.</p>
  </> },
  { id: "pytorch", label: "2. Установить Python-пакеты", content: <>
    <p>Сначала установите PyTorch для своей платформы:</p>
    <Tabs defaultValue="cpu">
      <TabsList className="h-auto flex-wrap"><TabsTrigger value="cpu">Windows / Linux: CPU</TabsTrigger><TabsTrigger value="mac">macOS</TabsTrigger><TabsTrigger value="cuda">NVIDIA — по желанию</TabsTrigger></TabsList>
      <TabsContent value="cpu"><CyberCodeBlock language="pseudo" filename="Терминал">{`python -m pip install torch==2.2.1 --index-url https://download.pytorch.org/whl/cpu`}</CyberCodeBlock></TabsContent>
      <TabsContent value="mac"><CyberCodeBlock language="pseudo" filename="Терминал">{`python -m pip install torch==2.2.1`}</CyberCodeBlock></TabsContent>
      <TabsContent value="cuda"><p>Для NVIDIA с совместимым драйвером можно использовать CUDA-сборку. Остальные уроки работают и на CPU.</p><CyberCodeBlock language="pseudo" filename="Терминал">{`python -m pip install torch==2.2.1 --index-url https://download.pytorch.org/whl/cu121`}</CyberCodeBlock></TabsContent>
    </Tabs>
    <p>Скачайте <a href="/novice-requirements.txt" download className="text-primary underline">novice-requirements.txt</a> в рабочую папку <code>rl-course</code> и установите остальные пакеты:</p>
    <CyberCodeBlock language="pseudo" filename="Терминал">{`python -m pip install -r novice-requirements.txt
python -m pip install "git+https://github.com/Unity-Technologies/ml-agents.git@release_23_tag#subdirectory=ml-agents-envs" "git+https://github.com/Unity-Technologies/ml-agents.git@release_23_tag#subdirectory=ml-agents" "protobuf==3.20.3" "tensorboard==2.20.0"
python -m pip check`}</CyberCodeBlock>
    <p>Последняя команда должна вывести <code>No broken requirements found</code>. Python и NumPy не обновляйте отдельно: их версии согласованы с ML-Agents.</p>
  </> },
  { id: "unity", label: "3. Подготовить Unity для проекта", content: <>
    <p>На Windows установите <a href="https://unity.com/download" target="_blank" rel="noopener noreferrer" className="text-primary underline">Unity Hub</a> и редактор <strong>6000.5.4f1</strong> с поддержкой сборки Windows. Затем из рабочей папки скачайте лабораторию в зафиксированной версии:</p>
    <CyberCodeBlock language="pseudo" filename="Anaconda Prompt">{`git clone https://github.com/SergeyErmakov85/unity-ml-agents-lab.git
cd unity-ml-agents-lab
git checkout 6e11c9944c2602f4083632f51eb5b160c0566364
python -m pip install -e python
python -m pip check`}</CyberCodeBlock>
    <p>В Unity Hub выберите <strong>Add project from disk</strong> и откройте <code>unity-ml-agents-lab/unity/MLAgentsLab</code>. Дождитесь импорта, выполните <strong>Tools → RL → Configure Project</strong>. ML-Agents уже подключён в проекте, вручную добавлять второй пакет не нужно.</p>
    <p>Редактор должен открыться без ошибок компиляции. До итогового проекта оставьте сцены и конфиги лаборатории в исходном виде.</p>
  </> },
  { id: "vscode", label: "4. Выбрать интерпретатор", content: <>
    <p>В VS Code установите расширения <strong>Python</strong> и <strong>Jupyter</strong>. Откройте рабочую папку; через <strong>Python: Select Interpreter</strong> выберите среду <code>mlagents</code>. В ноутбуке выберите ту же среду через <strong>Select Kernel</strong>.</p>
    <p>Если среда не появляется в списке ядер:</p>
    <CyberCodeBlock language="pseudo" filename="Терминал">{`python -m ipykernel install --user --name mlagents --display-name "Python (mlagents)"`}</CyberCodeBlock>
  </> },
  { id: "verify", label: "Задание: проверить установку", content: <>
    <p>Сохраните следующий код как <code>check_setup.py</code> и выполните <code>python check_setup.py</code>, либо запустите его ячейкой ноутбука:</p>
    <CyberCodeBlock language="python" filename="check_setup.py">{`import sys
import torch
import numpy as np
import matplotlib
import gymnasium as gym
import mlagents_envs
print(sys.version)
print("torch:", torch.__version__, "numpy:", np.__version__)
print("CUDA:", torch.cuda.is_available())
env = gym.make("CartPole-v1")
obs, _ = env.reset(seed=42)
print("Наблюдение:", obs.shape, "Действий:", env.action_space.n)
env.close()`}</CyberCodeBlock>
    <p>Ожидаются форма <code>(4,)</code> и два действия. <code>CUDA: False</code> для CPU и Mac — нормальный результат. Дополнительно выполните <code>mlagents-learn --help</code>: должна появиться справка без исключения.</p>
    <p><strong>Готово, если:</strong> импорты работают в выбранном интерпретаторе, CartPole запускается, <code>pip check</code> не находит конфликтов, а для проекта Windows открывает лабораторию в Unity.</p>
    <details><summary className="cursor-pointer text-foreground">Если проверка не прошла</summary><ul className="mt-3">
      <li><code>ModuleNotFoundError</code>: проверьте <code>conda activate mlagents</code> и выбранный интерпретатор.</li>
      <li>Неверный Python: пересоздайте среду с 3.10.12.</li>
      <li>Ошибка компиляции Unity: проверьте версию редактора и дождитесь импорта пакетов исходного проекта.</li>
    </ul></details>
    <p className="text-sm">Источники версий: <a className="text-primary underline" href="https://github.com/Unity-Technologies/ml-agents/blob/release_23_tag/ml-agents/setup.py" target="_blank" rel="noopener noreferrer">ML-Agents Release 23</a> и <a className="text-primary underline" href="https://github.com/SergeyErmakov85/unity-ml-agents-lab/tree/6e11c9944c2602f4083632f51eb5b160c0566364" target="_blank" rel="noopener noreferrer">зафиксированная лаборатория</a>.</p>
  </> },
];
export const QUIZ_QUESTIONS: NoviceQuestions = [
  { question: "Какую версию Python используем в среде курса?", options: ["3.10.12", "Любую последнюю", "Только 3.12"], correctIndex: 0 },
  { question: "Является ли CUDA: False ошибкой на CPU?", options: ["Да, нужна видеокарта", "Это означает, что Gymnasium не установлен", "Нет"], correctIndex: 2 },
  { question: "Что проверяет python -m pip check?", options: ["Физику Unity", "Совместимость установленных зависимостей", "Результат обучения"], correctIndex: 1 },
];
