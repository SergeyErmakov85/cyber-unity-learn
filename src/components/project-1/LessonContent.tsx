import CyberCodeBlock from "@/components/CyberCodeBlock";
import HubLink from "@/components/math-rl/HubLink";
import type { NoviceSection, NoviceQuestions } from "@/components/novice/NoviceLesson";

export const SECTIONS: NoviceSection[] = [
  { id: "task", label: "Что делает агент", content: <>
    <p>В готовой среде <strong>E04_BallBalance</strong> агент наклоняет платформу, удерживая шар. Используем готовый <strong>PPO</strong> из лаборатории: он обучает политику непрерывного управления. Самостоятельная реализация алгоритма разбирается в среднем разделе.</p>
    <ul><li><strong>Наблюдение — 8 чисел:</strong> две компоненты наклона платформы, три координаты шара относительно неё, три компоненты скорости.</li>
      <li><strong>Действие — 2 числа:</strong> поворот вокруг осей Z и X; на входе Unity значения ограничены диапазоном от −1 до 1.</li>
      <li><strong>Награда:</strong> +0,1 за шаг, −1 за падение. Падение завершает эпизод; лимит 1000 шагов даёт максимум около 100 награды.</li></ul>
    <p><HubLink to="/algorithms/ppo" fromPath="/courses/project-1" fromAnchor="task">Как устроен PPO</HubLink> — дополнительный материал. Для задания достаточно понимать наблюдения, действия и критерий успеха.</p>
  </> },
  { id: "unity", label: "1. Открыть и собрать сцену", content: <>
    <p>Продолжайте на <strong>Windows x64</strong> в среде <code>mlagents</code> и лаборатории из урока 1.2. Откройте проект <code>unity/MLAgentsLab</code> редактором <strong>6000.5.4f1</strong>, затем сцену <code>Assets/Envs/E04_BallBalance/Scenes/E04_BallBalance.unity</code>.</p>
    <p>Осмотрите <strong>Behavior Parameters</strong>: восемь наблюдений, два непрерывных действия. Сохраните штатный компонент запроса решений: агент должен получать решения на каждом шаге. Готовые C#-скрипты и сцену переписывать не требуется.</p>
    <p>Закройте редактор перед сборкой. Все команды ниже выполняются из корня <code>unity-ml-agents-lab</code>, не из папки <code>unity/MLAgentsLab</code>:</p>
    <CyberCodeBlock language="pseudo" filename="Anaconda Prompt">{`conda activate mlagents
python -m pip install -e python
python -m pip check
python scripts/build_env.py E04_BallBalance`}</CyberCodeBlock>
    <p>Должен появиться <code>builds/E04_BallBalance/E04_BallBalance.exe</code>. Если сборка завершилась с ошибкой, сначала исправьте её по <code>build.log</code>.</p>
  </> },
  { id: "training", label: "2. Запустить готовый PPO", content: <>
    <p>Конфиг <code>configs/E04_BallBalance__ppo.yaml</code> уже задаёт среду, сеть и обучение. Вначале проверим связь, затем запустим полноценное обучение одного сида:</p>
    <CyberCodeBlock language="pseudo" filename="Anaconda Prompt">{`python scripts/train.py --config configs/E04_BallBalance__ppo.yaml --seed 0 --quick
python scripts/train.py --config configs/E04_BallBalance__ppo.yaml --seed 0`}</CyberCodeBlock>
    <p><code>--quick</code> проверяет конвейер на сокращённом бюджете и не подтверждает качество агента. Полный запуск использует 100 000 шагов сбора на восьми аренах; его критерий — <strong>Eval/Mean Reward не ниже 80</strong>.</p>
    <p>Смотрите реальные значения <code>Eval/Mean Reward</code> в консоли. Для графика откройте второй терминал, активируйте ту же среду, перейдите в корень лаборатории и запустите:</p>
    <CyberCodeBlock language="pseudo" filename="Второй терминал">{`tensorboard --logdir results/E04_BallBalance/ppo`}</CyberCodeBlock>
    <p>Откройте <a href="http://localhost:6006" target="_blank" rel="noopener noreferrer" className="text-primary underline">TensorBoard</a>. Сохраните итоговую оценку из полного прогона; рост награды оцениваем по данным этого запуска.</p>
  </> },
  { id: "model", label: "3. Проверить сохранённую модель", content: <>
    <p>Полный запуск сохраняет веса <code>ckpt/final.pt</code>, логи и ONNX внутри своего каталога <code>results/E04_BallBalance/ppo/…</code>. После проверки экспорта он автоматически копирует модель в <code>unity/MLAgentsLab/Assets/Envs/E04_BallBalance/Models/E04_BallBalance_ppo.onnx</code>. Быстрый прогон эту модель не заменяет.</p>
    <p>Вернитесь в Unity, дождитесь импорта ONNX. В <strong>Behavior Parameters</strong> назначьте модель <code>E04_BallBalance_ppo.onnx</code>, выберите <strong>Inference Only</strong> и нажмите Play. Python-тренер для этого запуска не нужен.</p>
    <p>Для автоматической проверки закройте редактор. В PowerShell из корня лаборатории введите итоговую среднюю награду Python из полного прогона:</p>
    <CyberCodeBlock language="pseudo" filename="PowerShell (mlagents)">{`$pythonReward = [double](Read-Host "Итоговая Eval/Mean Reward из полного прогона")
python scripts/check_inference.py --config configs/E04_BallBalance__ppo.yaml --python-reward $pythonReward --episodes 20`}</CyberCodeBlock>
    <p>Скрипт соберёт отдельный вариант сцены с моделью и проверит 20 эпизодов. Результат запишется в <code>results/E04_BallBalance/inference_check.json</code>. Сравнивайте его с фактической Python-оценкой, а не с наградой из чужого отчёта.</p>
  </> },
  { id: "practice", label: "Что сдать", content: <>
    <ol><li>Снимок сцены с назначенной моделью и типом поведения <strong>Inference Only</strong>.</li>
      <li>Итоговую Python-оценку не ниже 80 и график <code>Eval/Mean Reward</code> из собственного полного прогона.</li>
      <li>Файл ONNX и результат проверки 20 эпизодов в Unity.</li>
      <li>Короткое объяснение: какие восемь чисел видит агент, чем он управляет и за что получает награду.</li></ol>
    <p><strong>Готово, если:</strong> средняя награда в Unity также не ниже 80, а автоматическая проверка показывает <strong>ПРОЙДЕНО</strong> — качество в Unity составляет не меньше 80% от вашей Python-оценки. Истечение 1000 шагов здесь означает успех: шар удерживался весь эпизод.</p>
    <p className="text-sm">Команды и критерии сверены с <a className="text-primary underline" href="https://github.com/SergeyErmakov85/unity-ml-agents-lab/blob/6e11c9944c2602f4083632f51eb5b160c0566364/docs/envs/E04_BallBalance.md" target="_blank" rel="noopener noreferrer">карточкой E04</a> и скриптами зафиксированной лаборатории. Если шар падает при инференсе, проверьте назначенную модель, порядок наблюдений и компоненты исходной сцены.</p>
  </> },
];
export const QUIZ_QUESTIONS: NoviceQuestions = [
  { question: "Что подтверждает успешный запуск с --quick?", options: ["Работу конвейера на малом бюджете", "Решение задачи балансировки", "Проверку 20 эпизодов в Unity"], correctIndex: 0 },
  { question: "Какие действия получает сцена E04?", options: ["Четыре направления по сетке", "Две оценки Q", "Два непрерывных значения"], correctIndex: 2 },
  { question: "Как запускать сохранённую модель без Python-тренера?", options: ["Убрать запрос решений", "Назначить ONNX и выбрать Inference Only", "Только снова запустить обучение"], correctIndex: 1 },
];
