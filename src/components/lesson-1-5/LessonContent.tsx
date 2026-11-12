import CyberCodeBlock from "@/components/CyberCodeBlock";
import { LessonCode, type NoviceSection, type NoviceQuestions } from "@/components/novice/NoviceLesson";
import code from "@/content/novice/code/cartpole_random.py?raw";

export const SECTIONS: NoviceSection[] = [
  { id: "cartpole", label: "Что нужно знать о CartPole", content: <>
    <p>На тележке стоит шест. Агент толкает тележку влево или вправо, чтобы шест оставался вертикальным.</p>
    <ul><li><strong>Наблюдение:</strong> четыре числа — позиция и скорость тележки, угол и угловая скорость шеста.</li>
      <li><strong>Действия:</strong> 0 — влево, 1 — вправо.</li>
      <li><strong>Награда:</strong> +1 за каждый шаг. В <code>CartPole-v1</code> максимум 500 за эпизод.</li>
      <li><strong>Конец:</strong> шест отклонился больше примерно 12° или тележка ушла дальше 2,4 от центра; отдельный лимит — 500 шагов.</li></ul>
    <p>Здесь запускаем <strong>случайного агента</strong>: он не обучается. Его средняя награда будет исходной точкой сравнения для DQN в уроке 1.6.</p>
  </> },
  { id: "gymnasium", label: "Две команды Gymnasium", content: <>
    <CyberCodeBlock language="python" filename="gymnasium_api.py">{`observation, info = env.reset(seed=42)
observation, reward, terminated, truncated, info = env.step(action)
# Новый эпизод нужен, если terminated or truncated.`}</CyberCodeBlock>
    <p><code>reset</code> начинает эпизод, <code>step</code> выполняет действие. <code>terminated</code> означает конец по правилам задачи, <code>truncated</code> — остановку по ограничению времени. Новое наблюдение содержит четыре числа.</p>
    <p>Если библиотека ещё не установлена, выполните в среде курса <code>python -m pip install "gymnasium[classic-control]==0.29.1"</code>.</p>
  </> },
  { id: "baseline", label: "Случайный агент за 100 эпизодов", content: <>
    <LessonCode code={code} filename="cartpole_random.py" />
    <p>Запуск: <code>python cartpole_random.py</code>. Результат — средняя награда и её разброс, а также файл <code>cartpole_random_returns.npy</code>. Типичный средний результат — около 20–25; точное число зависит от случайности и версии среды.</p>
  </> },
  { id: "practice", label: "Задание и проверка", content: <>
    <ol><li>Запустите 100 эпизодов. Запишите среднюю награду и сохраните файл результатов.</li>
      <li>В начале первого эпизода выведите <code>observation</code>. Найдите четыре описанных числа.</li>
      <li>Для просмотра одной попытки замените создание среды на <code>gym.make("CartPole-v1", render_mode="human")</code>, а число эпизодов на 1. После просмотра верните обычный режим.</li></ol>
    <p><strong>Готово, если:</strong> все 100 попыток завершаются, результат сохранён, а вы можете объяснить, какие данные получает агент и почему случайные действия не удерживают шест надолго. Нейросеть и обучение добавим в следующем уроке.</p>
  </> },
];
export const QUIZ_QUESTIONS: NoviceQuestions = [
  { question: "Каковы размеры наблюдения и набора действий CartPole-v1?", options: ["4 числа и 2 действия", "2 числа и 4 действия", "8 чисел и 2 непрерывных действия"], correctIndex: 0 },
  { question: "Когда нужно закончить текущий эпизод в Gymnasium?", options: ["При terminated или truncated", "Только при нулевой награде", "Только при terminated"], correctIndex: 0 },
  { question: "Зачем запускать случайного агента?", options: ["Чтобы добиться 500 очков", "Чтобы обучить нейросеть", "Чтобы получить исходный результат для сравнения"], correctIndex: 2 },
];
