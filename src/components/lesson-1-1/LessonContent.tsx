import MiniGridWorld from "@/components/MiniGridWorld";
import RLCycleIllustration from "@/components/lesson-1-1/RLCycleIllustration";
import RouteRewardsIllustration from "@/components/lesson-1-1/RouteRewardsIllustration";
import HubLink from "@/components/math-rl/HubLink";
import type { NoviceSection, NoviceQuestions } from "@/components/novice/NoviceLesson";

export const SECTIONS: NoviceSection[] = [
  { id: "rl-cycle", label: "Как работает RL", content: <>
    <p><strong>Обучение с подкреплением (RL)</strong> — обучение выбору действий по наградам, полученным при взаимодействии со средой. Цель — увеличить суммарную награду за попытку.</p>
    <ul>
      <li><strong>Агент</strong> выбирает действие. В примере это робот на сетке.</li>
      <li><strong>Среда</strong> задаёт правила: куда можно шагнуть, где ловушка и цель.</li>
      <li><strong>Наблюдение</strong> сообщает агенту о текущей ситуации, <strong>действие</strong> меняет её, <strong>награда</strong> оценивает результат шага.</li>
      <li><strong>Политика</strong> — правило выбора действий. <strong>Эпизод</strong> — одна попытка от старта до завершения.</li>
    </ul>
    <p className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-foreground">Наблюдать → выбрать действие → получить новое наблюдение и награду → повторить.</p>
    <RLCycleIllustration />
    <p>Случайные действия сами по себе не обучают агента: алгоритм должен использовать полученный опыт для изменения политики. Подробнее — <HubLink to="/deep-rl" anchor="foundations" fromPath="/courses/1-1" fromAnchor="rl-cycle">основы RL в хабе</HubLink>.</p>
  </> },
  { id: "gridworld", label: "Попробуйте на сетке", content: <>
    <p>Управляйте роботом стрелками. Обычный шаг даёт −1, ловушка −5, цель +10. Цель завершает эпизод; после ловушки движение продолжается. Смотрите на счёт и пробуйте разные пути. Автоигра показывает случайные действия без обучения модели.</p>
    <MiniGridWorld />
  </> },
  { id: "practice", label: "Задание и проверка", content: <>
    <RouteRewardsIllustration />
    <ol><li>Дойдите до цели вручную и запишите число шагов и суммарную награду.</li>
      <li>Начните заново и попробуйте путь короче. Сравните награды.</li>
      <li>Назовите агента, среду, наблюдение, действия и условие конца эпизода в этом примере.</li></ol>
    <p><strong>Готово, если:</strong> вы можете объяснить, почему лишние шаги уменьшают суммарную награду, и различаете движение агента и его обучение.</p>
  </> },
];

export const QUIZ_QUESTIONS: NoviceQuestions = [
  { question: "Что выбирает агент в цикле RL?", options: ["Действие", "Правила среды", "Правильную награду за свой шаг"], correctIndex: 0, explanation: "Агент выбирает действие, среда возвращает наблюдение и награду." },
  { question: "Два пути достигают цели, но второй содержит больше обычных шагов со штрафом −1. У какого награда выше?", options: ["У более длинного", "Всегда одинаковая", "У более короткого"], correctIndex: 2, explanation: "При одинаковом результате каждый лишний шаг добавляет штраф." },
  { question: "Достаточно ли запустить случайного агента, чтобы он начал обучаться?", options: ["Да, если показать анимацию", "Да, время само улучшает стратегию", "Нет, нужен алгоритм, меняющий стратегию по опыту"], correctIndex: 2 },
];
