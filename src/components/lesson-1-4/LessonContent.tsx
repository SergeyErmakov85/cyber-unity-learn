import Math from "@/components/Math";
import HubLink from "@/components/math-rl/HubLink";
import { LessonCode, type NoviceSection, type NoviceQuestions } from "@/components/novice/NoviceLesson";
import code from "@/content/novice/code/q_learning_frozen_lake.py?raw";

export const SECTIONS: NoviceSection[] = [
  { id: "q-table", label: "Что хранит Q-таблица", content: <>
    <p>В <strong>FrozenLake 4×4</strong> агент идёт от старта к цели, избегая прорубей. Состояние — номер клетки от 0 до 15, действия — влево (0), вниз (1), вправо (2), вверх (3). Цель даёт +1, остальные переходы 0; цель и прорубь завершают эпизод.</p>
    <p>Строки <strong>Q-таблицы</strong> соответствуют 16 клеткам, столбцы — четырём действиям. Ячейка оценивает будущую награду за выбор действия. В примере <code>is_slippery=False</code>: действие выполняется без скольжения.</p>
    <p><strong>Epsilon-greedy:</strong> с вероятностью <Math display={false}>{String.raw`\enfPar{\varepsilon}`}</Math> выбираем случайное действие, иначе — действие с максимальным Q. В начале исследуем, затем уменьшаем случайность.</p>
  </> },
  { id: "q-update", label: "Одно правило обновления", content: <>
    <Math display>{String.raw`\enfOp{Q}(\enfVar{s},a) \leftarrow \enfOp{Q}(\enfVar{s},a) + \enfPar{\alpha}\bigl[\enfTgt{r} + \enfPar{\gamma}(1-d)\max_{a'}\enfOp{Q}(\enfVar{s}',a') - \enfOp{Q}(\enfVar{s},a)\bigr]`}</Math>
    <p>Обновляем только посещённую пару. <strong>Скорость обучения</strong> <Math display={false}>{String.raw`\enfPar{\alpha}`}</Math> задаёт долю исправления ошибки; <strong>дисконт</strong> <Math display={false}>{String.raw`\enfPar{\gamma}`}</Math> — вклад будущей награды. Флаг <code>d</code> равен 1 при <code>terminated</code>.</p>
    <p>Пример: старая оценка 0, переход в цель даёт +1, скорость обучения 0,8. Новая оценка: 0 + 0,8 × (1 − 0) = <strong>0,8</strong>.</p>
    <p><code>terminated</code> — настоящий конец задачи: будущую ценность обнуляем. <code>truncated</code> — остановка по лимиту шагов: завершаем цикл, сохраняя будущую оценку. <HubLink to="/math-rl/module-5" anchor="глава-5" fromPath="/courses/1-4" fromAnchor="q-update">Подробности уравнения Беллмана</HubLink>.</p>
  </> },
  { id: "code", label: "Обучить и проверить", content: <>
    <LessonCode code={code} filename="q_learning_frozen_lake.py" />
    <p>Запуск: <code>python q_learning_frozen_lake.py</code>. После 2000 обучающих эпизодов код проводит 100 отдельных проверочных попыток, выбирая лучшие действия без обновления таблицы.</p>
  </> },
  { id: "practice", label: "Задание и проверка", content: <>
    <ol><li>Запустите файл, запишите число успехов из 100 и сохраните <code>frozen_lake_q.npy</code>.</li>
      <li>Повторите с <code>EPISODES = 100</code>. Сравните успехи, затем верните 2000.</li>
      <li>По строке стартовой клетки определите действие агента. Объясните, почему Q перед целью становится положительной, хотя большинство шагов дают ноль.</li></ol>
    <p><strong>Готово, если:</strong> на детерминированной карте обученный агент проходит 100 проверочных эпизодов до цели. Если нет, проверьте исследование, терминальную маску и число обучающих эпизодов. Фактическая таблица выводится программой.</p>
  </> },
];
export const QUIZ_QUESTIONS: NoviceQuestions = [
  { question: "Каков размер Q-таблицы для FrozenLake 4×4 с четырьмя действиями?", options: ["16×4", "4×4", "16×16"], correctIndex: 0 },
  { question: "Старая Q=0, награда за вход в цель +1, alpha=0.8. Чему равна новая Q?", options: ["1.8", "0", "0.8"], correctIndex: 2 },
  { question: "Как проверять выученную таблицу?", options: ["Только по числу обучающих эпизодов", "Случайными действиями", "Лучшими действиями без изменения таблицы"], correctIndex: 2 },
];
