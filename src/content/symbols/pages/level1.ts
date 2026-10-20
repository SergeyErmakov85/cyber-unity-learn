import { sym } from "../build";
import type { SymbolEntry } from "../types";

/**
 * Словари символов уроков уровня 1. Колонка «В коде» — имена из листингов
 * самих уроков: RoomBot (1.3), FrozenLake (1.4), многорукий бандит (1.7).
 */

// ── 1.3 MDP и уравнение Беллмана (RoomBot) ───────────────────────────────
export const LESSON_1_3_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", {
    inFormula: "Клетка, в которой стоит RoomBot; $\\enfVar{s}'$ — клетка, куда он попал после шага.",
    code: ["s", "s2", "s_next"],
    codeNote: "Состояние — кортеж `(row, col)`; список всех клеток — `STATES`.",
  }),
  sym("S", "variable", {
    inFormula: "$\\enfVar{S}_t$ — состояние на шаге $t$ как случайная величина: заранее неизвестно, куда занесёт проскальзывание.",
    code: ["s = s_next"],
    codeNote: "В `rollout` переменная `s` проходит значения $\\enfVar{S}_0, \\enfVar{S}_1, \\dots$ одного эпизода.",
  }),
  sym("\\mathcal{S}", "variable", {
    name: "пространство состояний",
    meaning: "Множество всех состояний MDP — первая компонента пятёрки $(\\enfVar{\\mathcal{S}}, \\enfFun{\\mathcal{A}}, \\enfFun{\\mathcal{P}}, \\enfTgt{\\mathcal{R}}, \\enfPar{\\gamma})$.",
    code: ["STATES"],
  }),
  sym("a", "function", {
    inFormula: "Действие RoomBot: шаг вверх, вниз, влево или вправо.",
    code: ["a", "UP", "RIGHT"],
    codeNote: "Номер действия; смещение клетки — `MOVES[a]`.",
  }),
  sym("A", "function", {
    inFormula: "$\\enfFun{A}_t$ — действие на шаге $t$ как случайная величина: его выбирает стохастическая политика.",
    code: ["a = policy(s, rng)"],
  }),
  sym("\\mathcal{A}", "function", {
    name: "пространство действий",
    meaning: "Множество всех действий агента: в RoomBot их четыре.",
    code: ["ACTIONS"],
  }),
  sym("\\pi", "function", {
    inFormula: "Политика $\\enfFun{\\pi}(\\enfFun{a} \\mid \\enfVar{s})$ — вероятность выбрать $\\enfFun{a}$ в клетке $\\enfVar{s}$.",
    code: ["policy_random(s, rng)", "greedy_policy(V)", "softmax(q, tau)"],
    codeNote: "Три версии политики: равномерная, фиксированная и softmax по $\\enfOp{Q}$ с температурой `tau`.",
  }),
  sym("\\mathcal{P}", "function", {
    inFormula: "Функция переходов $\\enfFun{\\mathcal{P}}(\\enfVar{s}' \\mid \\enfVar{s}, \\enfFun{a})$: с вероятностью $0{,}9$ бот идёт куда задумал, остальные $0{,}1$ поровну делятся между тремя другими направлениями.",
    code: ["next_states(s, a)", "SLIP = 0.1"],
    codeNote: "`next_states` возвращает список пар `(p, s2)` — это и есть строка $\\enfFun{\\mathcal{P}}(\\cdot \\mid \\enfVar{s}, \\enfFun{a})$.",
  }),
  sym("P", "function", {
    inFormula: "Вероятность события в напоминании о теории вероятностей: $\\enfFun{P}(\\enfVar{X} = \\enfVar{x})$.",
  }),
  sym("X", "variable", {
    name: "случайная величина",
    meaning: "Величина, значение которой определяется случаем; её среднее — $\\mathbb{E}[\\enfVar{X}]$. В уроке — пример перед определением ценности.",
  }),
  sym("x", "variable", {
    inFormula: "Значение случайной величины $\\enfVar{X}$ или аргумент функции $\\enfFun{f}$ в примере про $\\max$ и $\\arg\\max$.",
  }),
  sym("f", "function", {
    name: "пример функции",
    meaning: "$\\enfFun{f}(\\enfVar{x}) = -\\enfVar{x}^2 + 4\\enfVar{x}$ — парабола, на которой видна разница: $\\max$ — наибольшее значение (4), $\\arg\\max$ — где оно достигается (2).",
    code: ["max(Q[(s, a)] for a in ACTIONS)", "max(ACTIONS, key=lambda a: Q[(s, a)])"],
    codeNote: "В Value Iteration первое выражение — это $\\max$, второе — $\\arg\\max$.",
  }),
  sym("G", "operator", {
    inFormula: "Отдача $\\enfOp{G}_t = \\enfTgt{R}_{t+1} + \\enfPar{\\gamma}\\enfOp{G}_{t+1}$ — дисконтированная сумма наград до конца эпизода.",
    code: ["G = r + gamma * G"],
    codeNote: "Траектория проходится с конца: один проход даёт $\\enfOp{G}_t$ для всех шагов.",
  }),
  sym("V", "operator", {
    inFormula: "$\\enfOp{V}^\\pi(\\enfVar{s})$ — средняя отдача из клетки при политике $\\enfFun{\\pi}$; $\\enfOp{V}^*$ — при оптимальной.",
    code: ["V", "estimate_V(policy)", "evaluate_policy()", "V_star"],
    codeNote: "`V` — словарь `{s: float}`; `estimate_V` — оценка Монте-Карло, `evaluate_policy` — итерации уравнения Беллмана.",
  }),
  sym("Q", "operator", {
    inFormula: "$\\enfOp{Q}^\\pi(\\enfVar{s}, \\enfFun{a})$ — средняя отдача, если сначала сделать $\\enfFun{a}$, а потом следовать $\\enfFun{\\pi}$.",
    code: ["Q_from_V(V, gamma)", "Q[(s, a)]"],
  }),
  sym("S", "operator", {
    name: "сумма геометрического ряда",
    meaning: "$\\enfOp{S} = 1 + \\enfPar{\\gamma} + \\enfPar{\\gamma}^2 + \\dots = \\frac{1}{1 - \\enfPar{\\gamma}}$ при $\\enfPar{\\gamma} < 1$. Поэтому дисконтированная отдача конечна.",
  }),
  sym("\\tau", "parameter", {
    name: "температура softmax",
    meaning: "Чем меньше $\\enfPar{\\tau}$, тем ближе softmax-политика к жадному выбору; чем больше — тем ближе к равномерному.",
    code: ["softmax(q, tau=1.0)"],
  }),
  sym("\\varepsilon", "parameter", {
    name: "вероятность исследования",
    meaning: "В ε-жадной политике — доля случайных действий.",
  }),
  sym("\\gamma", "parameter", {
    inFormula: "Дисконт: награда через $k$ шагов весит $\\enfPar{\\gamma}^k$. Благодаря $\\enfPar{\\gamma} < 1$ сумма наград ограничена $\\enfTgt{R}_{\\max}/(1 - \\enfPar{\\gamma})$.",
    code: ["gamma=0.95"],
  }),
  sym("R", "target", {
    inFormula: "$\\enfTgt{R}_{t+1}$ — награда за переход на шаге $t$; $\\enfTgt{R}_{\\max}$ — её наибольшее возможное значение.",
    code: ["r", "reward(s_next)"],
  }),
  sym("\\theta", "parameter", {
    inFormula: "Веса нейросети $\\enfOp{V}_\\theta(\\enfVar{s})$, которая в больших задачах заменяет таблицу ценностей.",
  }),
  sym("L", "target", {
    inFormula: "Функция потерь нейросетевой оценки ценности; её градиент $\\partial \\enfTgt{L} / \\partial \\enfPar{\\theta}$ считает autograd.",
  }),
  sym("\\mathcal{R}", "target", {
    inFormula: "Функция награды $\\enfTgt{\\mathcal{R}}(\\enfVar{s}, \\enfFun{a}, \\enfVar{s}')$: в RoomBot зависит только от клетки, куда пришёл бот.",
    code: ["reward(s2)"],
  }),
];

// ── 1.4 Табличный Q-learning (FrozenLake) ────────────────────────────────
export const LESSON_1_4_SYMBOLS: SymbolEntry[] = [
  sym("\\mathcal{S}", "neutral", {
    name: "пространство состояний",
    meaning: "Множество всех клеток FrozenLake (16 для карты 4×4). Задаёт число строк Q-таблицы.",
    code: ["env.observation_space.n", "state_size"],
  }),
  sym("\\mathcal{A}", "neutral", {
    name: "пространство действий",
    meaning: "Множество доступных действий: влево, вниз, вправо, вверх. Задаёт число столбцов Q-таблицы.",
    code: ["env.action_space.n", "action_size"],
  }),
  sym("s", "variable", {
    inFormula: "$\\enfVar{s}_t$ — текущая клетка: выбирает строку Q-таблицы; $\\enfVar{s}_{t+1}$ — клетка после шага, по ней считается будущая ценность.",
    code: ["state", "new_state"],
    codeNote: "Целое число — номер клетки: `state, info = env.reset()`.",
  }),
  sym("a", "function", {
    inFormula: "$\\enfFun{a}_t$ — выбранное действие; обновляется именно ячейка $(\\enfVar{s}_t, \\enfFun{a}_t)$. Под $\\max$ буква $a'$ перебирает все действия и остаётся без цвета.",
    code: ["action", "np.argmax(Q_table[state, :])", "env.action_space.sample()"],
  }),
  sym("\\pi", "function", {
    inFormula: "Политика агента; в Q-learning это ε-жадный выбор по Q-таблице.",
    code: ["if exp_tradeoff < epsilon: ... else: ..."],
  }),
  sym("Q", "operator", {
    inFormula: "Оценка ценности пары «состояние — действие»; вся таблица $\\enfOp{Q} \\in \\mathbb{R}^{|\\mathcal{S}| \\times |\\mathcal{A}|}$ начинается с нулей.",
    code: ["Q_table[state, action]", "Q_table = np.zeros((state_size, action_size))"],
  }),
  sym("r", "target", {
    inFormula: "$\\enfTgt{r}_{t+1}$ — награда за последний переход: 1 за цель, 0 за остальные шаги.",
    code: ["reward"],
  }),
  sym("\\mathcal{R}", "target", {
    inFormula: "Функция награды сопоставляет паре «состояние — действие» число.",
    code: ["env.step(action)"],
    codeNote: "Награду возвращает среда: `new_state, reward, terminated, truncated, info = env.step(action)`.",
  }),
  sym("y", "target", {
    inFormula: "TD-цель: награда плюс дисконтированная лучшая оценка следующего состояния; при терминальном исходе — только награда.",
    code: ["td_target"],
  }),
  sym("d", "variable", {
    inFormula: "Флаг настоящего конца эпизода: при $\\enfVar{d}_t = 1$ маска $(1 - \\enfVar{d}_t)$ убирает будущую ценность.",
    code: ["terminated", "0.0 if terminated else ..."],
    codeNote: "Обрыв по времени (`truncated`) не обнуляет будущую ценность — это не конец задачи.",
  }),
  sym("\\delta", "variable", {
    inFormula: "Ошибка временного различия: насколько цель отличается от прежней оценки. Знак — направление поправки, модуль — её размер.",
    code: ["td_error"],
  }),
  sym("\\alpha", "parameter", {
    inFormula: "Скорость обучения: какую долю TD-ошибки прибавить к старой оценке.",
    code: ["learning_rate = 0.8"],
  }),
  sym("\\gamma", "parameter", {
    inFormula: "Дисконт будущей ценности в TD-цели.",
    code: ["gamma = 0.95"],
  }),
  sym("\\varepsilon", "parameter", {
    name: "вероятность исследования",
    meaning: "С вероятностью $\\enfPar{\\varepsilon}$ агент выбирает случайное действие, иначе — лучшее по таблице. $\\enfPar{\\varepsilon}_{\\max}$ и $\\enfPar{\\varepsilon}_{\\min}$ — начало и предел расписания.",
    inFormula: "$\\enfPar{\\varepsilon}_k$ затухает экспоненциально с номером эпизода $k$.",
    code: ["epsilon", "max_epsilon = 1.0", "min_epsilon = 0.01"],
  }),
  sym("\\lambda", "parameter", {
    name: "скорость затухания исследования",
    meaning: "Показатель экспоненты в расписании $\\enfPar{\\varepsilon}_k$: чем больше, тем быстрее агент перестаёт исследовать.",
    code: ["decay_rate = 0.005"],
  }),
  sym("k", "neutral", {
    name: "номер эпизода",
    meaning: "Счётчик эпизодов обучения; по правилам ENF счётчики не окрашиваются.",
    code: ["episode"],
  }),
];

// ── 1.7 Многорукий бандит ────────────────────────────────────────────────
export const LESSON_1_7_SYMBOLS: SymbolEntry[] = [
  sym("a", "function", {
    inFormula: "Рычаг бандита — действие агента. Под $\\operatorname{argmax}$ буква перебирает все рычаги и остаётся без цвета.",
    code: ["action", "a"],
  }),
  sym("A", "function", {
    inFormula: "$\\enfFun{A}_t$ — рычаг, выбранный на шаге $t$ выбранной стратегией.",
    code: ["agent.select_action()"],
  }),
  sym("q", "operator", {
    name: "истинная ценность рычага",
    meaning: "$\\enfOp{q}(\\enfFun{a}) = \\mathbb{E}[\\enfTgt{R}_t \\mid \\enfFun{A}_t = \\enfFun{a}]$ — средняя награда рычага, скрытая от агента. $\\enfOp{q}^*$ — ценность лучшего рычага.",
    code: ["env.probabilities[action]", "np.argmax(env.probabilities)"],
    codeNote: "В бернуллиевском бандите $\\enfOp{q}(\\enfFun{a})$ — вероятность успеха рычага.",
  }),
  sym("Q", "operator", {
    inFormula: "$\\enfOp{Q}_t(\\enfFun{a})$ — оценка $\\enfOp{q}(\\enfFun{a})$ по наградам, собранным к шагу $t$; бегущее среднее.",
    code: ["self.values[a]"],
    codeNote: "Обновление `value + (1.0 / n) * (reward - value)` — та же формула $\\enfOp{Q}_n = \\enfOp{Q}_{n-1} + \\frac{1}{n}(\\enfTgt{R}_n - \\enfOp{Q}_{n-1})$.",
  }),
  sym("R", "target", {
    inFormula: "Награда шага: 1 (клик) или 0.",
    code: ["reward = env.pull_arm(action)"],
  }),
  sym("\\Delta", "target", {
    name: "сожаление шага (regret)",
    meaning: "$\\enfTgt{\\Delta}_t = \\enfOp{q}^* - \\enfOp{q}(\\enfFun{A}_t)$ — сколько недополучено из-за неоптимального выбора. Сумма по шагам — суммарное сожаление.",
    code: ["optimal_action_flags"],
    codeNote: "Код считает долю оптимальных выборов — шаги, где $\\enfTgt{\\Delta}_t = 0$.",
  }),
  sym("\\varepsilon", "parameter", {
    inFormula: "Вероятность случайного рычага в ε-жадной стратегии; может затухать: $\\enfPar{\\varepsilon}_t = \\enfPar{\\varepsilon}_0 \\enfPar{\\alpha}^t$ или $1/t$.",
    code: ["epsilon=0.1"],
  }),
  sym("\\alpha", "parameter", {
    name: "коэффициент затухания; параметр Beta",
    meaning: "В расписании ε: множитель $\\enfPar{\\alpha} < 1$, на который ε умножается каждый шаг. В Thompson Sampling: $\\enfPar{\\alpha}_a$ — число успехов рычага плюс 1 в распределении $\\operatorname{Beta}(\\enfPar{\\alpha}_a, \\enfPar{\\beta}_a)$.",
    code: ["self.alpha[a]"],
    codeNote: "`self.alpha` растёт на 1 после каждой награды 1.",
  }),
  sym("\\beta", "parameter", {
    name: "параметр Beta (неудачи)",
    meaning: "$\\enfPar{\\beta}_a$ — число неудач рычага плюс 1 в распределении $\\operatorname{Beta}(\\enfPar{\\alpha}_a, \\enfPar{\\beta}_a)$.",
    code: ["self.beta[a]"],
  }),
  sym("\\theta", "parameter", {
    name: "сэмпл вероятности успеха",
    meaning: "$\\enfPar{\\theta}_a \\sim \\operatorname{Beta}(\\enfPar{\\alpha}_a, \\enfPar{\\beta}_a)$ — правдоподобная гипотеза о вероятности успеха рычага. Thompson Sampling выбирает рычаг с наибольшим сэмплом.",
    code: ["np.random.beta(self.alpha[a], self.beta[a])", "samples"],
  }),
  sym("c", "parameter", {
    name: "коэффициент исследования UCB",
    meaning: "Вес бонуса неопределённости $\\sqrt{\\ln t / N_t(\\enfFun{a})}$ в UCB1: чем больше, тем охотнее агент пробует редко выбранные рычаги.",
    code: ["c=np.sqrt(2)", "self.c"],
  }),
  sym("N", "neutral", {
    name: "счётчик выборов рычага",
    meaning: "$N_t(a)$ — сколько раз рычаг выбран к шагу $t$; счётчик, поэтому без цвета.",
    code: ["self.counts[a]"],
  }),
];

// ── 1.1 Введение в RL ────────────────────────────────────────────────────
export const LESSON_1_1_SYMBOLS: SymbolEntry[] = [
  sym("\\mathcal{S}", "neutral", {
    name: "пространство состояний",
    meaning: "Множество всех состояний среды. У CartPole состояние — 4 числа: положение и скорость тележки, угол и угловая скорость шеста.",
    code: ["env.observation_space"],
  }),
  sym("\\mathcal{A}", "neutral", {
    name: "пространство действий",
    meaning: "Множество доступных действий. У CartPole их два: толкнуть тележку влево или вправо.",
    code: ["env.action_space"],
  }),
  sym("s", "variable", { inFormula: "Состояние, которое агент получает от среды.", code: ["obs"], codeNote: "`obs, _ = env.reset(seed=42)` — начальное наблюдение." }),
  sym("a", "function", { inFormula: "Действие агента.", code: ["action = env.action_space.sample()"], codeNote: "В примере политика случайная: действие сэмплируется из пространства действий." }),
  sym("\\pi", "function", { inFormula: "Стратегия агента: распределение действий в каждом состоянии.", code: ["env.action_space.sample()"] }),
  sym("V", "operator", { inFormula: "Ожидаемая суммарная награда из состояния при следовании политике." }),
  sym("\\gamma", "parameter", { inFormula: "Дисконт: на слайдере видно, как он уменьшает вес далёких наград." }),
  sym("G", "operator", { inFormula: "Суммарная дисконтированная награда с шага $t$; агент максимизирует её среднее $\\mathbb{E}[\\enfOp{G}_t]$.", code: ["reward"], codeNote: "`env.step` возвращает награду одного шага; $\\enfOp{G}_t$ — их дисконтированная сумма." }),
];

// ── 1.5 CartPole: первый агент ───────────────────────────────────────────
export const LESSON_1_5_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", { inFormula: "Наблюдение CartPole — вход Q-сети.", code: ["obs", "torch.FloatTensor(obs)"] }),
  sym("a", "function", { inFormula: "Действие: случайное с вероятностью $\\enfPar{\\varepsilon}$, иначе $\\arg\\max$ по Q-значениям.", code: ["action = env.action_space.sample()", "action = q_vals.argmax().item()"] }),
  sym("Q", "operator", { inFormula: "Q-значения, которые выдаёт сеть для каждого действия.", code: ["q_vals = q_net(torch.FloatTensor(obs))"] }),
  sym("\\varepsilon", "parameter", {
    name: "вероятность исследования",
    meaning: "Доля случайных действий. Начинается с 1,0 и после каждого эпизода умножается на коэффициент затухания, но не опускается ниже $\\enfPar{\\varepsilon}_{\\min}$.",
    code: ["epsilon = EPSILON_START", "EPSILON_END = 0.01", "EPSILON_DECAY = 0.995", "epsilon = max(EPSILON_END, epsilon * EPSILON_DECAY)"],
  }),
];

// ── 1.6 DQN ──────────────────────────────────────────────────────────────
export const LESSON_1_6_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", { inFormula: "Состояние; $\\enfVar{s}'$ — следующее.", code: ["state", "next_state", "states", "next_states"] }),
  sym("a", "function", { inFormula: "Выбранное действие; под $\\max_{a'}$ буква перебирает все действия.", code: ["action", "actions"] }),
  sym("Q", "operator", {
    inFormula: "$\\enfOp{Q}_\\theta$ — policy-сеть, $\\enfOp{Q}_{\\theta^-}$ — замороженная target-сеть; $\\enfOp{Q}_0, \\enfOp{Q}_1$ — ценности двух действий CartPole.",
    code: ["q_values = policy_net(states).gather(1, actions)", "next_q = target_net(next_states).max(1)[0]"],
  }),
  sym("\\theta", "parameter", { inFormula: "Веса policy-сети; $\\enfPar{\\theta}^-$ — их периодически обновляемая копия в target-сети.", code: ["policy_net.parameters()", "target_net.load_state_dict(policy_net.state_dict())"] }),
  sym("\\gamma", "parameter", { inFormula: "Дисконт в TD-цели.", code: ["GAMMA = 0.99"] }),
  sym("\\varepsilon", "parameter", { inFormula: "Вероятность случайного действия; затухает от 1,0 до 0,01.", code: ["EPS_START = 1.0", "EPS_END = 0.01", "EPS_DECAY = 0.995"] }),
  sym("r", "target", { inFormula: "Награда шага.", code: ["reward", "rewards"] }),
  sym("y", "target", {
    inFormula: "TD-цель: $\\enfTgt{r} + \\enfPar{\\gamma}\\max_{a'}\\enfOp{Q}_{\\theta^-}(\\enfVar{s}', a')$; в конце эпизода будущая часть обнуляется.",
    code: ["target = rewards + GAMMA * next_q * (1 - dones)"],
  }),
];
