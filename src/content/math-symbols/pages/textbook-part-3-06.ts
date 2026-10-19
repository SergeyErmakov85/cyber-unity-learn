import type { PageSymbols } from "../types";

const r = String.raw;

/** Символы страницы: от формулы к коду. Черновик — scripts/symbol-table-draft.mjs. */
const table: PageSymbols = {
  id: "textbook-part-3-06",
  symbols: [
  {
    tex: r`n`,
    role: "variable",
    name: r`Номер члена последовательности`,
    meaning: r`$\enfVar{x}_n$ — член с номером $\enfVar{n}$. В определении предела $\enfVar{n}$ пробегает все номера после порога $\enfVar{N}$.`,
    code: r`n`,
    codeType: r`int`,
    codeNote: r`В коде страницы: \`n = rewards.size\`.`,
  },
  {
    tex: r`p`,
    role: "parameter",
    name: r`Вероятность успеха (Бернулли)`,
    meaning: r`Параметр схемы Бернулли: вероятность успеха в одном испытании. Правдоподобие $L(\enfPar{p}) = \enfPar{p}^k(1-\enfPar{p})^{n-k}$, оценка максимального правдоподобия — доля успехов $k/n$.`,
    code: r`n`,
    codeType: r`float`,
    codeNote: r`В коде страницы: \`n = rewards.size\`.`,
  },
  {
    tex: r`\gamma`,
    role: "parameter",
    name: r`Коэффициент дисконтирования`,
    meaning: r`Число $0 \le \enfPar{\gamma} < 1$: во сколько раз награда следующего шага весит меньше текущей. Эффективный горизонт — около $1/(1 - \enfPar{\gamma})$ шагов.`,
    inFormula: r`Настраиваемый множитель перед будущим: $\enfTgt{r} + \enfPar{\gamma}\enfOp{V}(\enfVar{s}')$. Делает бесконечную сумму наград конечной.`,
    code: r`gamma`,
    codeType: r`float, обычно 0.99`,
    codeNote: r`В коде страницы: \`def exact_values(p_matrix, rewards, gamma=GAMMA):\`.`,
  },
  {
    tex: r`\bar{x}`,
    role: "operator",
    name: r`Выборочное среднее`,
    meaning: r`$\enfOp{\bar{x}} = \frac{1}{n}\sum \enfVar{x}_i$ — свёртка выборки в одно число, оценка математического ожидания.`,
    code: r`mean`,
    codeType: r`float`,
    codeNote: r`В коде страницы: \`mean = rewards.mean()\`.`,
  },
  {
    tex: r`V`,
    role: "operator",
    name: r`Функция ценности состояния`,
    meaning: r`$\enfOp{V}^\pi(\enfVar{s})$ — средняя отдача, если начать в $\enfVar{s}$ и действовать по $\enfFun{\pi}$. $\enfOp{V}^*$ — ценность при оптимальной политике, $\enfOp{V}_\phi$ — нейросеть-критик.`,
    inFormula: r`Агрегат: усредняет все возможные будущие траектории. В TD-цели $\enfTgt{r} + \enfPar{\gamma}\enfOp{V}(\enfVar{s}')$ подставляет «что будет дальше».`,
    code: r`v`,
    codeType: r`torch.Tensor (B,) или np.ndarray (n_states,)`,
    codeNote: r`В коде страницы: \`v = np.zeros_like(rewards)\`.`,
  },
  {
    tex: r`r`,
    role: "target",
    name: r`Награда`,
    meaning: r`Число, которое среда выдаёт после шага: $\enfTgt{r}_t$ или $\enfTgt{r}(\enfVar{s}, \enfFun{a})$. Именно её агент стремится накопить.`,
    inFormula: r`Цель обучения: стоит в отдаче $\enfOp{G}_t$, в TD-цели $\enfTgt{r} + \enfPar{\gamma}\enfOp{V}(\enfVar{s}')$ и в целевой функции $\enfTgt{J}$.`,
    code: r`rewards`,
    codeType: r`float; в батче — torch.Tensor (B,)`,
    codeNote: r`В коде страницы: \`rewards = np.asarray(rewards, dtype=float)\`.`,
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
  ],
};

export default table;
