import type { PageSymbols } from "../types";

const r = String.raw;

/** Символы страницы: от формулы к коду. Черновик — scripts/symbol-table-draft.mjs. */
const table: PageSymbols = {
  id: "textbook-part-1-08",
  symbols: [
  {
    tex: r`\gamma`,
    role: "parameter",
    name: r`Коэффициент дисконтирования`,
    meaning: r`Число $0 \le \enfPar{\gamma} < 1$: во сколько раз награда следующего шага весит меньше текущей. Эффективный горизонт — около $1/(1 - \enfPar{\gamma})$ шагов.`,
    inFormula: r`Настраиваемый множитель перед будущим: $\enfTgt{r} + \enfPar{\gamma}\enfOp{V}(\enfVar{s}')$. Делает бесконечную сумму наград конечной.`,
    code: r`gamma`,
    codeType: r`float, обычно 0.99`,
    codeNote: r`В коде страницы: \`for gamma in GAMMAS:\`.`,
  },
  {
    tex: r`S`,
    role: "operator",
    name: r`Сумма ряда / частичная сумма`,
    meaning: r`$\enfOp{S}_N = \sum_{n=1}^{N} \enfVar{a}_n$ — сумма первых $N$ членов; $\enfOp{S} = \lim \enfOp{S}_N$ — сумма всего ряда. Для геометрического ряда $\enfOp{S} = 1/(1 - \enfPar{r})$.`,
    inFormula: r`Агрегат: сворачивает бесконечно много слагаемых в одно число.`,
    code: r`cumsum`,
    codeType: r`np.ndarray (N,)`,
    codeNote: r`В коде страницы: \`partial = np.cumsum(gamma ** k)      # S_n\`.`,
  },
  { // TODO: сверить с кодом
    tex: r`S`,
    role: "target",
    name: r`Фактический счёт партии`,
    meaning: r`$\enfTgt{S}_A \in \{1; 0{,}5; 0\}$ — победа, ничья или поражение агента $A$.`,
    inFormula: r`Мишень, к которой подтягивается прогноз $\enfOp{E}_A$.`,
    code: r`score`,
    codeType: r`float`,
  },
  {
    tex: r`V`,
    role: "operator",
    name: r`Функция ценности состояния`,
    meaning: r`$\enfOp{V}^\pi(\enfVar{s})$ — средняя отдача, если начать в $\enfVar{s}$ и действовать по $\enfFun{\pi}$. $\enfOp{V}^*$ — ценность при оптимальной политике, $\enfOp{V}_\phi$ — нейросеть-критик.`,
    inFormula: r`Агрегат: усредняет все возможные будущие траектории. В TD-цели $\enfTgt{r} + \enfPar{\gamma}\enfOp{V}(\enfVar{s}')$ подставляет «что будет дальше».`,
    code: r`v`,
    codeType: r`torch.Tensor (B,) или np.ndarray (n_states,)`,
    codeNote: r`В коде страницы: \`v = np.zeros(2)\`.`,
  },
  { // TODO: сверить с кодом
    tex: r`e`,
    role: "variable",
    name: r`Вектор кодовой книги`,
    meaning: r`$\enfVar{e}_i$ — один из $K$ векторов словаря в векторном квантовании: эмбеддинг заменяется ближайшим из них.`,
    code: r`codebook[i]`,
    codeType: r`torch.Tensor (d,)`,
  },
  { // TODO: сверить с кодом
    tex: r`\varepsilon`,
    role: "parameter",
    name: r`Эпсилон`,
    meaning: r`В PPO — ширина коридора клиппинга (обычно $0{,}2$); в ε-жадной стратегии — вероятность случайного действия; в определении предела — допуск.`,
    inFormula: r`Настраиваемая граница: $[1 - \enfPar{\varepsilon}, 1 + \enfPar{\varepsilon}]$ в PPO, «с вероятностью $\enfPar{\varepsilon}$ исследуем».`,
    code: r`epsilon / clip_eps`,
    codeType: r`float`,
    codeNote: r`PPO в ML-Agents: \`hyperparameters.epsilon\`; ε-жадность: \`if rng.random() < epsilon: action = env.action_space.sample()\`.`,
  },
  {
    tex: r`\sum`,
    role: "neutral",
    name: r`Сумма`,
    meaning: r`Сложить все слагаемые для индекса от нижнего предела до верхнего.`,
    code: r`cumsum`,
    codeType: r`—`,
    codeNote: r`В коде страницы: \`partial = np.cumsum(gamma ** k)      # S_n\`.`,
  },
  ],
};

export default table;
