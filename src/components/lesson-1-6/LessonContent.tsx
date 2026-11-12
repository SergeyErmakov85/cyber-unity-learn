import CyberCodeBlock from "@/components/CyberCodeBlock";
import Math from "@/components/Math";
import HubLink from "@/components/math-rl/HubLink";
import { LessonCode, type NoviceSection, type NoviceQuestions } from "@/components/novice/NoviceLesson";
import code from "@/content/novice/code/dqn_cartpole.py?raw";

export const SECTIONS: NoviceSection[] = [
  { id: "dqn", label: "От таблицы к нейросети", content: <>
    <p>У CartPole непрерывные наблюдения: отдельных строк для всех возможных состояний не перечислить. <strong>DQN</strong> заменяет Q-таблицу сетью: четыре числа на входе, две оценки действий на выходе. Лучшее действие — индекс большей оценки.</p>
    <ul><li><strong>Replay Buffer</strong> хранит переходы. Случайная выборка из буфера позволяет учиться не только на соседних шагах.</li>
      <li><strong>Целевая сеть</strong> — копия обучаемой сети. В нашем примере её веса обновляются каждые <strong>250 шагов среды</strong>.</li>
      <li><strong>Epsilon-greedy</strong> выбирает случайное действие с некоторой вероятностью; она уменьшается по эпизодам до 0,05.</li></ul>
    <p><HubLink to="/pytorch/cheatsheet" anchor="nn" fromPath="/courses/1-6" fromAnchor="dqn">Устройство nn.Module</HubLink> и <HubLink to="/algorithms/dqn" fromPath="/courses/1-6" fromAnchor="dqn">расширенный разбор DQN</HubLink> — справка по желанию.</p>
  </> },
  { id: "target", label: "Что именно обучается", content: <>
    <Math display>{String.raw`\enfTgt{y} = \enfTgt{r} + \enfPar{\gamma}(1-d)\max_{a'}\enfOp{Q}_{\mathrm{target}}(\enfVar{s}',a')`}</Math>
    <p>Сеть приближает Q выбранного действия к этой цели. <code>d</code> означает <code>terminated</code>; при остановке по лимиту <code>truncated</code> будущую оценку сохраняем. Дисконт в коде 0,99.</p>
    <p><code>policy(states)</code> возвращает оценки двух действий для каждого элемента выборки. <code>gather(1, actions)</code> берёт оценку только выполненного действия. Цель вычисляется через <code>target_net</code> внутри <code>torch.no_grad()</code>.</p>
    <p><strong>Huber Loss</strong> (<code>smooth_l1_loss</code>) измеряет ошибку с меньшим влиянием больших отклонений. <code>clip_grad_norm_</code> ограничивает норму градиента значением 1. Затем <code>optimizer.step()</code> действительно меняет веса.</p>
  </> },
  { id: "code", label: "Один полный DQN", content: <>
    <LessonCode code={code} filename="dqn_cartpole.py" />
    <p>Запуск: <code>python dqn_cartpole.py --episodes 600 --seed 42</code>. Этот небольшой агент работает на CPU. Каждые 50 эпизодов код проверяет политику без случайных действий и сохраняет лучшие веса; итоговый тест использует другие стартовые состояния.</p>
    <p>После обучения программа сохраняет <code>cartpole_dqn.pt</code>, заново загружает веса и проверяет их в 100 эпизодах. Отдельно сохраняются тестовые награды <code>cartpole_dqn_returns.npy</code> и история обучения <code>cartpole_train_returns.npy</code>.</p>
  </> },
  { id: "practice", label: "Задание и проверка", content: <>
    <ol><li>Положите результат случайного агента из 1.5 рядом с файлом DQN и запустите обучение.</li>
      <li>Сравните средние награды двух агентов в 100 тестовых эпизодах. Во время итогового теста случайные действия отключены и веса не меняются.</li>
      <li>Постройте сравнение по сохранённым данным:</li></ol>
    <CyberCodeBlock language="python" filename="compare_cartpole.py">{`import numpy as np
import matplotlib.pyplot as plt
random_returns = np.load("cartpole_random_returns.npy")
dqn_returns = np.load("cartpole_dqn_returns.npy")
plt.bar(["Random", "DQN"], [random_returns.mean(), dqn_returns.mean()])
plt.ylabel("Средняя награда за 100 эпизодов")
plt.show()`}</CyberCodeBlock>
    <p><strong>Готово, если:</strong> загруженная модель даёт результат существенно выше случайного агента. Ориентир решения CartPole-v1 — средняя награда 475 и выше. Если цель не достигнута, сохраните фактический результат и проверьте терминальную маску, обновление целевой сети и бюджет обучения; отдельный запуск не гарантирует заданный результат.</p>
  </> },
];
export const QUIZ_QUESTIONS: NoviceQuestions = [
  { question: "Что выдаёт Q-сеть в этом примере?", options: ["Две оценки действий по четырём наблюдениям", "Только награду за последний шаг", "Два непрерывных угла поворота"], correctIndex: 0 },
  { question: "Как часто обновляется целевая сеть в коде урока?", options: ["Каждый эпизод", "Никогда", "Каждые 250 шагов среды"], correctIndex: 2 },
  { question: "Какой флаг обнуляет будущую ценность в TD-цели?", options: ["Наличие награды +1", "Только terminated", "Любой конец, включая truncated"], correctIndex: 1 },
];
