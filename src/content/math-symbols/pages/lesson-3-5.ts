import type { PageSymbols } from "../types";

const r = String.raw;

/** Символы страницы: от формулы к коду. Черновик — scripts/symbol-table-draft.mjs. */
const table: PageSymbols = {
  id: "lesson-3-5",
  symbols: [
  { // TODO: сверить с кодом
    tex: r`\pi`,
    role: "function",
    name: r`Политика`,
    meaning: r`Стратегия агента: $\enfFun{\pi}(\enfFun{a} \mid \enfVar{s})$ — вероятность выбрать действие $\enfFun{a}$ в состоянии $\enfVar{s}$. $\enfFun{\pi}_\theta$ — политика-нейросеть с весами $\enfPar{\theta}$, $\enfFun{\pi}^*$ — оптимальная.`,
    inFormula: r`Отображение «состояние → распределение действий» (роль «функция»). Её обучаемые веса $\enfPar{\theta}$ окрашены отдельно, как параметры. В индексе ($\mathbb{E}_\pi$, $\enfOp{V}^\pi$) говорит, по какой политике считается среднее.`,
    code: r`policy(obs)`,
    codeType: r`nn.Module → torch.distributions.Distribution`,
    codeNote: r`\`dist = policy(obs)\`; \`action = dist.sample()\`; \`log_prob = dist.log_prob(action)\`.`,
  },
  { // TODO: сверить с кодом
    tex: r`a`,
    role: "function",
    name: r`Действие`,
    meaning: r`Решение агента на шаге: дискретная кнопка или вектор непрерывных команд (руль, газ). По ENF действие — роль «функция»: это то, что агент делает со средой.`,
    inFormula: r`Выход политики и аргумент $\enfOp{Q}(\enfVar{s}, \enfFun{a})$. Под $\max_{a'}$ или $\sum_a$ действие перебирается и остаётся без цвета.`,
    code: r`action`,
    codeType: r`int или np.ndarray (action_dim,)`,
    codeNote: r`Получается из политики: \`action = policy(obs)\` или \`dist.sample()\`; передаётся в \`env.step(action)\`.`,
  },
  { // TODO: сверить с кодом
    tex: r`s`,
    role: "variable",
    name: r`Состояние`,
    meaning: r`Описание ситуации, в которой находится агент: позиция, скорости, показания сенсоров. $\enfVar{s}'$ — следующее состояние, $\enfVar{s}_t$ — состояние на шаге $t$.`,
    inFormula: r`Аргумент почти всех функций RL: политика $\enfFun{\pi}(\enfFun{a} \mid \enfVar{s})$, ценности $\enfOp{V}(\enfVar{s})$ и $\enfOp{Q}(\enfVar{s}, \enfFun{a})$. Формула описывает, что происходит с агентом в этом состоянии.`,
    code: r`state, obs`,
    codeType: r`np.ndarray (obs_dim,) или int`,
    codeNote: r`Приходит из среды: \`obs, info = env.reset()\`, \`obs, reward, terminated, truncated, info = env.step(action)\`. В батче — тензор формы \`(B, obs_dim)\`.`,
  },
  { // TODO: сверить с кодом
    tex: r`f`,
    role: "function",
    name: r`Функция / энкодер / сеть`,
    meaning: r`Общее обозначение преобразования: $\enfFun{f}(\enfVar{x})$ в анализе, энкодер $\enfFun{f}_\phi(\enfVar{o})$ в архитектурах, сеть-аппроксиматор в AIRL.`,
    inFormula: r`Действие над аргументом: принимает вход и возвращает результат.`,
    code: r`f(x) / encoder(obs)`,
    codeType: r`Callable / nn.Module`,
  },
  { // TODO: сверить с кодом
    tex: r`\beta`,
    role: "parameter",
    name: r`Коэффициент β`,
    meaning: r`Вес энтропийного бонуса в ML-Agents PPO (\`beta\`), коэффициенты моментов Adam $\enfPar{\beta}_1, \enfPar{\beta}_2$ или степень коррекции в приоритетном реплее — смысл задаёт формула.`,
    inFormula: r`Настраиваемый коэффициент.`,
    code: r`beta`,
    codeType: r`float`,
    codeNote: r`PPO в ML-Agents: \`hyperparameters.beta\`, обычно \`5e-3\`; Adam: \`betas=(0.9, 0.999)\`.`,
  },
  { // TODO: сверить с кодом
    tex: r`\arg\max`,
    role: "neutral",
    name: r`Аргумент максимума`,
    meaning: r`Не само наибольшее значение, а то, при каком аргументе оно достигается: лучшее действие $\arg\max_a \enfOp{Q}(\enfVar{s}, a)$.`,
    code: r`np.argmax(Q[s])`,
    codeType: r`int`,
    codeNote: r`При равных значениях \`argmax\` берёт первый индекс — жадной политике нужен случайный выбор среди равных.`,
  },
  ],
};

export default table;
