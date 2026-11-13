import { useState } from "react";
import MathFormula from "@/components/Math";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import HubLink from "@/components/math-rl/HubLink";
import { Button } from "@/components/ui/button";

const ACTIONS = ["вверх", "вниз", "влево", "вправо"];
const Q_VALUES = [0.2, 0.6, 0.1, -0.8];
const PROBABILITIES = [0.1, 0.7, 0.15, 0.05];
const GREEDY_ACTION = Q_VALUES.indexOf(Math.max(...Q_VALUES));

function ActionChoiceDemo() {
  const [mode, setMode] = useState<"value" | "policy">("value");
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const [lastAction, setLastAction] = useState<number | null>(null);
  const total = counts.reduce((sum, count) => sum + count, 0);

  const reset = () => {
    setCounts([0, 0, 0, 0]);
    setLastAction(null);
  };

  const chooseAction = () => {
    let action = GREEDY_ACTION;
    if (mode === "policy") {
      const draw = Math.random();
      let cumulative = 0;
      action = PROBABILITIES.length - 1;
      for (let index = 0; index < PROBABILITIES.length; index++) {
        cumulative += PROBABILITIES[index];
        if (draw < cumulative) {
          action = index;
          break;
        }
      }
    }
    setLastAction(action);
    setCounts(previous => previous.map((count, index) => count + (index === action ? 1 : 0)));
  };

  return (
    <div className="space-y-4 rounded-xl border border-primary/30 bg-card/60 p-4 sm:p-6"
      aria-labelledby="action-choice-title">
      <h3 id="action-choice-title" className="text-lg font-bold text-foreground">Одна клетка RoomBot, два способа выбрать действие</h3>
      <p>Бот стоит в клетке (1,0), справа — лужа. Переключите способ выбора и нажмите кнопку несколько раз. Числа заданы для иллюстрации; это не результат расчёта RoomBot и не процесс обучения.</p>
      <div role="group" aria-label="Способ выбора действия" className="flex flex-wrap gap-2">
        {(["value", "policy"] as const).map(option => (
          <Button key={option} variant={mode === option ? "default" : "outline"}
            className="h-auto min-h-10 whitespace-normal"
            aria-pressed={mode === option}
            onClick={() => { setMode(option); reset(); }}>
            {option === "value" ? "Value-based: максимум Q" : "Policy-based: выбор по вероятностям"}
          </Button>
        ))}
      </div>
      <p className="text-sm text-foreground">
        {mode === "value"
          ? "Показан жадный выбор без исследования: каждый раз берём наибольшую Q-оценку."
          : "Показана стохастическая политика: выбираем действие случайно с указанными вероятностями."}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ACTIONS.map((action, index) => (
          <div key={action} className={`rounded-lg border p-3 ${lastAction === index
            ? "border-primary bg-primary/10" : "border-border bg-background/40"}`}>
            <p className="font-semibold text-foreground">{action}</p>
            <p className="mt-2 font-mono text-lg text-primary">
              {mode === "value" ? `Q: ${Q_VALUES[index].toLocaleString("ru-RU")}` : `${PROBABILITIES[index] * 100}%`}
            </p>
            {mode === "policy" && <div className="mt-2 h-2 overflow-hidden rounded bg-muted" aria-hidden="true">
              <div className="h-full bg-primary" style={{ width: `${PROBABILITIES[index] * 100}%` }} />
            </div>}
            <p className="mt-2 text-xs text-foreground">Выбрано раз: {counts[index]}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={chooseAction}>Выбрать действие</Button>
        <Button variant="outline" onClick={reset} disabled={total === 0}>Сбросить счётчик</Button>
      </div>
      <p role="status" aria-live="polite" className="text-sm text-foreground">
        {lastAction === null ? "Выборов пока нет." : `Выбор №${total}: ${ACTIONS[lastAction]}.`}
      </p>
      <p className="text-sm">В первом режиме бот всегда выбирает «вниз». Во втором «вниз» выпадает чаще, но возможны и другие действия. В небольшой серии доли могут отличаться от заданных вероятностей. Оценки и вероятности при нажатиях не меняются.</p>
    </div>
  );
}

export default function ValuePolicySection() {
  return <>
    <p>У RoomBot уже есть состояния, действия и награды. Теперь спросим: <strong>что именно менять по опыту, чтобы бот выбирал действия лучше?</strong> Цель обоих подходов — увеличить ожидаемый возврат.</p>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-5">
        <h3 className="text-lg font-bold text-primary">Value-based: учим оценки</h3>
        <p>Бот учится оценивать будущую награду. В Q-Learning он хранит оценку для каждой пары «клетка, действие» и исправляет её по полученным переходам. Политику получаем из оценок: при жадном выборе берём действие с наибольшей Q.</p>
        <MathFormula display>{String.raw`\enfVar{a}_{\mathrm{greedy}} = \arg\max_a \enfFun{Q}(\enfVar{s},a)`}</MathFormula>
        <p>Здесь <MathFormula display={false}>{String.raw`\arg\max`}</MathFormula> возвращает <strong>действие</strong> с лучшей оценкой. Сама Q — ожидаемый возврат, поэтому может быть отрицательной и не обязана лежать между 0 и 1.</p>
        <p>В курсе: <CrossLinkToLesson lessonId="1-4" lessonPath="/courses/1-4#q-table" lessonTitle="Q-Learning: табличный метод" lessonLevel={1}>Q-Learning в уроке 1.4</CrossLinkToLesson> хранит таблицу, а <CrossLinkToLesson lessonId="1-6" lessonPath="/courses/1-6#dqn" lessonTitle="DQN с нуля на PyTorch" lessonLevel={1}>DQN в уроке 1.6</CrossLinkToLesson> приближает Q нейросетью.</p>
      </div>
      <div className="space-y-3 rounded-xl border border-secondary/30 bg-secondary/5 p-5">
        <h3 className="text-lg font-bold text-secondary">Policy-based: учим политику</h3>
        <p>Бот явно хранит политику и меняет её параметры, чтобы увеличить ожидаемый возврат. В стохастическом варианте она выдаёт вероятности действий для текущей клетки; действие выбираем по этому распределению.</p>
        <MathFormula display>{String.raw`\enfVar{a} \sim \enfFun{\pi}_{\enfPar{\theta}}(\cdot\mid\enfVar{s})`}</MathFormula>
        <p><MathFormula display={false}>{String.raw`\enfPar{\theta}`}</MathFormula> — настраиваемые параметры политики. В Policy Gradient опыт используется для изменения вероятностей: действия с лучшим относительно выбранного ориентира возвратом получают больший вес. Одна удачная попытка ещё не доказывает, что действие лучше.</p>
        <p>Пример — REINFORCE. Подробный разбор: <CrossLinkToLesson lessonId="2-1" lessonPath="/courses/2-1" lessonTitle="Policy Gradient и теорема градиента" lessonLevel={2}>Policy Gradient в уроке 2.1</CrossLinkToLesson>. Бывают и детерминированные политики, сразу выдающие действие.</p>
      </div>
    </div>

    <ActionChoiceDemo />

    <h3 className="text-lg font-bold text-foreground">Тот же выбор в Python</h3>
    <p>Сохраните как <code>choose_room_bot_action.py</code> и запустите командой <code>python choose_room_bot_action.py</code>. Достаточно стандартной библиотеки Python.</p>
    <CyberCodeBlock language="python" filename="choose_room_bot_action.py">{`import random

actions = ["вверх", "вниз", "влево", "вправо"]
q_values = [0.2, 0.6, 0.1, -0.8]
probabilities = [0.1, 0.7, 0.15, 0.05]

# Value-based: получаем жадную политику из оценок Q.
best = max(range(len(actions)), key=lambda i: q_values[i])
print("По Q:", actions[best])

# Policy-based: выбираем по явно заданной политике.
rng = random.Random(42)
print("По политике:", rng.choices(actions, weights=probabilities, k=20))`}</CyberCodeBlock>
    <p><strong>Это только выбор действия:</strong> код не обновляет Q или параметры политики. Чтобы получить обучающегося агента, нужно добавить сбор опыта и правило обновления. Вероятности здесь заданы отдельно, а не вычислены из Q.</p>

    <h3 className="text-lg font-bold text-foreground">Actor-critic: политика и оценка вместе</h3>
    <p><strong>Actor</strong> выбирает действия и обучает явную политику. <strong>Critic</strong> оценивает ожидаемый возврат и помогает актору понять, насколько удачным было действие. Поэтому наличие V или Q в алгоритме ещё не делает его чисто value-based. PPO обычно обучают с критиком; SAC также сочетает политику и Q-функции. К этому вернёмся в <CrossLinkToLesson lessonId="2-3" lessonPath="/courses/2-3" lessonTitle="Непрерывные действия и Actor-Critic" lessonLevel={2}>уроке 2.3 об Actor-Critic</CrossLinkToLesson>.</p>

    <h3 className="text-lg font-bold text-foreground">Как различать подходы</h3>
    <ul>
      <li><strong>Политика есть у любого агента.</strong> Различие — учим ли мы её параметры явно или получаем правило выбора из оценок ценности.</li>
      <li><strong>Случайность — не критерий.</strong> Value-based агент тоже может исследовать среду через epsilon-greedy. Выбор по softmax от Q сам по себе ещё не является обучением методом Policy Gradient.</li>
      <li><strong>Смотрите на действия, а не только на наблюдения.</strong> DQN работает с непрерывными наблюдениями CartPole, но выбирает из конечного набора действий. Для непрерывных действий обычный перебор максимума Q неудобен; явная политика может сразу выдавать действие или параметры его распределения. Policy Gradient применим и к дискретным действиям.</li>
      <li><strong>Policy Iteration — не Policy Gradient.</strong> Ниже мы используем известную модель RoomBot для расчёта ценностей и улучшения политики. Это планирование; название не означает прямое обучение параметров политики по градиенту. Разделение model-based/model-free отвечает на другой вопрос: используется ли модель переходов и наград.</li>
    </ul>

    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-foreground">
      <strong>Ключевой вывод:</strong> value-based — сначала оцениваем действия, затем выбираем по оценкам; policy-based — явно оптимизируем политику; actor-critic — обучаем политику с помощью оценщика.
    </div>
    <p><strong>Мини-задание:</strong> в Python-примере сделайте Q для «вверх» наибольшей, оставив вероятности прежними. Предскажите, какой из двух способов выбора изменится, и проверьте запуском. Затем измените вероятности так, чтобы их сумма осталась равна 1.</p>
    <p>Для углубления: <HubLink to="/deep-rl" anchor="algorithms" fromPath="/courses/1-3" fromAnchor="value-vs-policy" fromLabel="Урок 1.3: value-based и policy-based">алгоритмы в хабе Deep RL</HubLink>. Для продолжения урока достаточно ключевого вывода выше.</p>
    <details className="rounded-lg border border-border p-4 text-sm">
      <summary className="cursor-pointer font-semibold text-foreground">Первоисточники и дополнительное чтение</summary>
      <ul className="mt-3">
        <li><a className="text-primary underline" href="https://spinningup.openai.com/en/latest/spinningup/rl_intro2.html" target="_blank" rel="noopener noreferrer">OpenAI Spinning Up: Kinds of RL Algorithms</a> — Q-Learning, оптимизация политики и их сочетания.</li>
        <li><a className="text-primary underline" href="https://spinningup.openai.com/en/latest/spinningup/rl_intro.html" target="_blank" rel="noopener noreferrer">OpenAI Spinning Up: Key Concepts in RL</a> — политики, действия и функции ценности.</li>
        <li><a className="text-primary underline" href="https://spinningup.openai.com/en/latest/algorithms/vpg.html" target="_blank" rel="noopener noreferrer">OpenAI Spinning Up: Vanilla Policy Gradient</a> — обновление политики и роль оценок возврата.</li>
        <li><a className="text-primary underline" href="https://arxiv.org/abs/1707.06347" target="_blank" rel="noopener noreferrer">Schulman и соавторы: Proximal Policy Optimization Algorithms</a> — исходная статья PPO.</li>
      </ul>
    </details>
  </>;
}
