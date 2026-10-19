export interface MathSymbolDetail {
  notation: string;
  name: string;
  role: "variable" | "function" | "parameter" | "operator" | "target" | "neutral";
  explanation: string;
  formulaRole: string;
  python: string;
}

export const MATH_SYMBOLS: Record<string, MathSymbolDetail> = {
  state: { notation: "s_t", name: "Текущее состояние", role: "variable", explanation: "Положение агента в момент t; определяет строку Q-таблицы, которую нужно прочитать или обновить.", formulaRole: "Аргумент функции ценности Q.", python: "state" },
  action: { notation: "a_t", name: "Выбранное действие", role: "variable", explanation: "Действие агента в состоянии s_t. Алгоритм обновляет именно эту пару состояние–действие.", formulaRole: "Второй аргумент Q.", python: "action" },
  nextState: { notation: "s_{t+1}", name: "Следующее состояние", role: "variable", explanation: "Состояние, которое вернула среда после действия. По нему вычисляется наилучшая будущая ценность.", formulaRole: "Состояние для bootstrap-оценки.", python: "new_state" },
  nextAction: { notation: "a′", name: "Кандидатное следующее действие", role: "neutral", explanation: "Переменная перебора внутри максимума: сравниваются все действия, доступные из следующего состояния.", formulaRole: "Связанная переменная под max.", python: "Каждое действие в Q_table[new_state, :]"},
  q: { notation: "Q", name: "Функция ценности действия", role: "operator", explanation: "Оценка ожидаемой суммы будущих наград при выборе действия в состоянии и последующем следовании лучшей стратегии.", formulaRole: "Хранит выученную ценность пары состояние–действие.", python: "Q_table[state, action]" },
  reward: { notation: "r_{t+1}", name: "Немедленная награда", role: "target", explanation: "Сигнал среды за последний переход. В FrozenLake награда за цель равна 1, за обычный переход — 0.", formulaRole: "Наблюдаемая часть целевой оценки.", python: "reward" },
  alpha: { notation: "α", name: "Скорость обучения", role: "parameter", explanation: "Доля TD-ошибки, которую алгоритм добавляет к старой оценке. При 0,8 обновление быстрее, но может быть шумнее.", formulaRole: "Масштабирует величину обновления.", python: "learning_rate = 0.8" },
  gamma: { notation: "γ", name: "Коэффициент дисконтирования", role: "parameter", explanation: "Вес будущей ценности относительно немедленной награды. Значение 0,95 сохраняет большую часть будущего сигнала.", formulaRole: "Уменьшает вклад будущих наград.", python: "gamma = 0.95" },
  terminal: { notation: "d_t", name: "Индикатор терминального состояния", role: "neutral", explanation: "Равен 1, если переход закончился настоящим терминальным исходом (terminated), иначе 0. Маска отключает bootstrap после конца задачи.", formulaRole: "Отключает будущую ценность только для terminal-состояний.", python: "float(terminated)" },
  target: { notation: "y_t", name: "TD-цель", role: "target", explanation: "Награда плюс дисконтированная лучшая оценка следующего состояния; при терминальном исходе будущая часть равна нулю.", formulaRole: "Целевое значение для текущего обновления.", python: "td_target" },
  tdError: { notation: "δ_t", name: "Ошибка временного различия", role: "variable", explanation: "Разница между TD-целью и прежней оценкой Q. Знак показывает направление, модуль — размер корректировки.", formulaRole: "Сигнал ошибки для обновления Q.", python: "td_error" },
  max: { notation: "max", name: "Максимум по действиям", role: "neutral", explanation: "Выбирает наибольшую оценку Q среди всех действий в следующем состоянии.", formulaRole: "Greedy bootstrap-оценка.", python: "np.max(Q_table[new_state, :])" },
  zero: { notation: "0", name: "Ноль", role: "neutral", explanation: "В начальной таблице оценки равны нулю; в маске ноль обнуляет будущую часть при терминальном переходе.", formulaRole: "Начальная оценка или множитель маски.", python: "0.0" },
  one: { notation: "1", name: "Единица", role: "neutral", explanation: "Единичная награда за достижение цели и единичное значение terminal-индикатора.", formulaRole: "Награда цели или значение бинарного индикатора.", python: "reward = 1.0; float(terminated) = 1.0" },
  epsilon: { notation: "ε_k", name: "Вероятность исследования", role: "parameter", explanation: "С вероятностью ε агент выбирает случайное действие; иначе берёт действие с лучшей оценкой.", formulaRole: "Баланс исследования и использования знаний.", python: "epsilon" },
  epsilonMax: { notation: "ε_max", name: "Начальное исследование", role: "parameter", explanation: "Верхний предел ε; в примере обучение начинается со случайного выбора.", formulaRole: "Начальное значение расписания ε.", python: "max_epsilon = 1.0" },
  epsilonMin: { notation: "ε_min", name: "Минимальное исследование", role: "parameter", explanation: "Нижний предел ε; сохраняет небольшую вероятность исследования в конце обучения.", formulaRole: "Нижний предел расписания.", python: "min_epsilon = 0.01" },
  decay: { notation: "λ", name: "Скорость затухания", role: "parameter", explanation: "Определяет скорость экспоненциального уменьшения вероятности исследования.", formulaRole: "Темп спада в экспоненте.", python: "decay_rate = 0.005" },
  episode: { notation: "k", name: "Номер эпизода", role: "variable", explanation: "Индекс эпизода обучения; с его ростом вероятность случайного действия убывает.", formulaRole: "Независимая переменная расписания ε.", python: "episode" },
  exp: { notation: "exp", name: "Экспонента", role: "function", explanation: "Экспоненциальная функция, задающая плавное затухание исследования.", formulaRole: "Преобразует темп и номер эпизода в коэффициент затухания.", python: "np.exp(...)" },
  plus: { notation: "+", name: "Сложение", role: "neutral", explanation: "Складывает награду и будущую ценность либо прибавляет поправку к старой оценке.", formulaRole: "Сумма частей цели или обновления.", python: "+" },
  minus: { notation: "−", name: "Вычитание", role: "neutral", explanation: "Вычитает старую оценку из целевой; в маске задаёт дополнение terminal-индикатора.", formulaRole: "Разность оценок или маска 1−d_t.", python: "-" },
  times: { notation: "×", name: "Умножение", role: "neutral", explanation: "Масштабирует будущую ценность коэффициентом дисконтирования или поправку скоростью обучения.", formulaRole: "Масштабирование слагаемого.", python: "*" },
  arrow: { notation: "←", name: "Обновление значения", role: "neutral", explanation: "Обозначает присваивание новой оценки после вычисления поправки.", formulaRole: "Операция обновления Q.", python: "Q_table[state, action] += ..." },
  equals: { notation: "=", name: "Равенство", role: "neutral", explanation: "Связывает две записи одного и того же значения.", formulaRole: "Определение или результат вычисления.", python: "=" },
  maps: { notation: "→", name: "Отображение", role: "neutral", explanation: "Показывает, что функция награды принимает пару состояние–действие и возвращает число.", formulaRole: "Тип сигнатуры функции.", python: "Функция возвращает reward" },
  product: { notation: "×", name: "Декартово произведение", role: "neutral", explanation: "Множество всех пар, образованных одним состоянием и одним действием.", formulaRole: "Область определения функции награды.", python: "state/action индексы Q_table" },
  setS: { notation: "𝒮", name: "Пространство состояний", role: "neutral", explanation: "Множество всех состояний, в которых может оказаться агент.", formulaRole: "Первое множество в пространстве пар.", python: "env.observation_space" },
  setA: { notation: "𝒜", name: "Пространство действий", role: "neutral", explanation: "Множество всех доступных агенту действий.", formulaRole: "Второе множество в пространстве пар.", python: "env.action_space" },
  policy: { notation: "π", name: "Политика", role: "function", explanation: "Правило выбора действия по текущему состоянию.", formulaRole: "Стратегия поведения агента.", python: "epsilon-greedy блок if/else" },
  real: { notation: "ℝ", name: "Вещественные числа", role: "neutral", explanation: "Множество числовых значений, куда отображается функция награды.", formulaRole: "Множество возможных значений награды.", python: "float" },
  stateGeneric: { notation: "s", name: "Состояние", role: "variable", explanation: "Общее обозначение состояния среды; индекс t уточняет момент времени.", formulaRole: "Аргумент Q и элемент множества состояний.", python: "state" },
  actionGeneric: { notation: "a", name: "Действие", role: "variable", explanation: "Общее обозначение доступного агенту действия.", formulaRole: "Аргумент Q и элемент множества действий.", python: "action" },
  rewardGeneric: { notation: "r", name: "Награда", role: "target", explanation: "Общее обозначение награды после действия.", formulaRole: "Сигнал, который входит в TD-цель.", python: "reward" },
  rewardFunction: { notation: "ℛ", name: "Функция награды", role: "function", explanation: "Сопоставляет паре состояние–действие числовую награду.", formulaRole: "Отображение из пространства состояний и действий в вещественные числа.", python: "reward из env.step(action)" },
  delimiters: { notation: "( )", name: "Скобки группировки", role: "neutral", explanation: "Объединяют аргументы функции или задают порядок вычислений.", formulaRole: "Границы аргументов Q и выражения маски.", python: "Скобки в выражении Python" },
  colon: { notation: ":", name: "Двоеточие типа функции", role: "neutral", explanation: "Отделяет левую часть сигнатуры функции от описания её области определения и значений.", formulaRole: "Разделитель в записи типа функции награды.", python: "Тип функции env.step" },
  comma: { notation: ",", name: "Разделитель аргументов", role: "neutral", explanation: "Отделяет состояние от действия в паре аргументов Q.", formulaRole: "Разделяет аргументы функции.", python: "Запятая в Q_table[state, action]" },
};

export const SYMBOL_IDS = Object.keys(MATH_SYMBOLS);
export type EnfMacro = "Var" | "Fun" | "Par" | "Op" | "Tgt" | "Neu";

export const symbolTex = (id: string, role: EnfMacro, latex: string) =>
  "\\htmlClass{l14-math-symbol-trigger l14-symbol--" + id + "}{\\enf" + role + "{" + latex + "}}";





