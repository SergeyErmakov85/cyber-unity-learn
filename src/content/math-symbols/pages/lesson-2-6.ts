import type { PageSymbols } from "../types";

const r = String.raw;

/**
 * Урок 2.6 «TensorBoard и W&B» — символы метрик обучения и их имена в Stable-Baselines3, TensorBoard и W&B.
 * Строки сверены с кодом страницы; полноту проверяет npm run math:audit.
 */
const table: PageSymbols = {
  id: "lesson-2-6",
  caption: r`Символы из формул метрик и то, под какими именами они появляются в коде Stable-Baselines3 и в графиках TensorBoard / W&B.`,
  symbols: [
    {
      tex: r`s`,
      role: "variable",
      name: r`Состояние`,
      meaning: r`Описание ситуации, в которой находится агент: позиция, скорости, показания сенсоров. $\enfVar{s}'$ — следующее состояние, $\enfVar{s}_t$ — состояние на шаге $t$.`,
      inFormula: r`Аргумент почти всех функций RL: политика $\enfFun{\pi}(\enfFun{a} \mid \enfVar{s})$, ценности $\enfOp{V}(\enfVar{s})$ и $\enfOp{Q}(\enfVar{s}, \enfFun{a})$. Формула описывает, что происходит с агентом в этом состоянии.`,
      code: r`obs`,
      codeType: r`np.ndarray`,
      codeNote: r`\`frames, obs = [], eval_env.reset()\` — наблюдение для записи видео эпизода.`,
    },
    {
      tex: r`a`,
      role: "function",
      name: r`Действие`,
      meaning: r`Решение агента на шаге: дискретная кнопка или вектор непрерывных команд (руль, газ). По ENF действие — роль «функция»: это то, что агент делает со средой.`,
      inFormula: r`Выход политики и аргумент $\enfOp{Q}(\enfVar{s}, \enfFun{a})$. Под $\max_{a'}$ или $\sum_a$ действие перебирается и остаётся без цвета.`,
      code: r`action`,
      codeType: r`np.ndarray`,
      codeNote: r`\`action, _ = model.predict(obs, deterministic=True)\`.`,
    },
    {
      tex: r`\pi`,
      role: "function",
      name: r`Политика`,
      meaning: r`Стратегия агента: $\enfFun{\pi}(\enfFun{a} \mid \enfVar{s})$ — вероятность выбрать действие $\enfFun{a}$ в состоянии $\enfVar{s}$. $\enfFun{\pi}_\theta$ — политика-нейросеть с весами $\enfPar{\theta}$, $\enfFun{\pi}^*$ — оптимальная.`,
      inFormula: r`Отображение «состояние → распределение действий» (роль «функция»). Её обучаемые веса $\enfPar{\theta}$ окрашены отдельно, как параметры. В индексе ($\mathbb{E}_\pi$, $\enfOp{V}^\pi$) говорит, по какой политике считается среднее.`,
      code: r`model.predict(obs)`,
      codeType: r`MlpPolicy (SB3)`,
      codeNote: r`Политика спрятана в \`model.policy\`; \`deterministic=True\` берёт самое вероятное действие.`,
    },
    {
      tex: r`r`,
      role: "target",
      name: r`Награда`,
      meaning: r`Число, которое среда выдаёт после шага: $\enfTgt{r}_t$ или $\enfTgt{r}(\enfVar{s}, \enfFun{a})$. Именно её агент стремится накопить.`,
      inFormula: r`Цель обучения: стоит в отдаче $\enfOp{G}_t$, в TD-цели $\enfTgt{r} + \enfPar{\gamma}\enfOp{V}(\enfVar{s}')$ и в целевой функции $\enfTgt{J}$.`,
      code: r`ep_rew_mean`,
      codeType: r`float (метрика)`,
      codeNote: r`Средняя награда эпизода — главный график: \`writer.add_scalar("rollout/ep_rew_mean", reward, step)\`.`,
    },
    {
      tex: r`\gamma`,
      role: "parameter",
      name: r`Коэффициент дисконтирования`,
      meaning: r`Число $0 \le \enfPar{\gamma} < 1$: во сколько раз награда следующего шага весит меньше текущей. Эффективный горизонт — около $1/(1 - \enfPar{\gamma})$ шагов.`,
      inFormula: r`Настраиваемый множитель перед будущим: $\enfTgt{r} + \enfPar{\gamma}\enfOp{V}(\enfVar{s}')$. Делает бесконечную сумму наград конечной.`,
      code: r`gamma`,
      codeType: r`float`,
      codeNote: r`\`PPO(..., gamma=0.999, gae_lambda=0.98, ...)\`; в свипе W&B — \`gamma: { values: [0.95, 0.99, 0.995] }\`.`,
    },
    {
      tex: r`V`,
      role: "operator",
      name: r`Функция ценности состояния`,
      meaning: r`$\enfOp{V}^\pi(\enfVar{s})$ — средняя отдача, если начать в $\enfVar{s}$ и действовать по $\enfFun{\pi}$. $\enfOp{V}^*$ — ценность при оптимальной политике, $\enfOp{V}_\phi$ — нейросеть-критик.`,
      inFormula: r`Агрегат: усредняет все возможные будущие траектории. В TD-цели $\enfTgt{r} + \enfPar{\gamma}\enfOp{V}(\enfVar{s}')$ подставляет «что будет дальше».`,
      code: r`train/value_loss`,
      codeType: r`метрика`,
      codeNote: r`Критик учится предсказывать отдачу; качество видно по \`train/value_loss\` и \`train/explained_variance\`.`,
    },
    {
      tex: r`Q`,
      role: "operator",
      name: r`Функция ценности действия`,
      meaning: r`$\enfOp{Q}^\pi(\enfVar{s}, \enfFun{a})$ — средняя отдача, если в $\enfVar{s}$ сделать $\enfFun{a}$, а дальше следовать $\enfFun{\pi}$. $\enfOp{Q}^*$ — оптимальная, $\enfOp{Q}_\theta$ — нейросеть.`,
      inFormula: r`Агрегат будущих наград для пары «состояние—действие». Жадная политика выбирает $\arg\max_a \enfOp{Q}(\enfVar{s}, a)$.`,
      code: r`q_values`,
      codeType: r`метрика DQN`,
      codeNote: r`Для DQN имеет смысл логировать распределение $\enfOp{Q}(\enfVar{s}, \enfFun{a})$: рост без предела — признак переоценки.`,
    },
    {
      tex: r`\mathcal{H}`,
      role: "operator",
      name: r`Энтропия политики`,
      meaning: r`$\enfOp{\mathcal{H}}(\enfFun{\pi}(\cdot \mid \enfVar{s})) = \mathbb{E}_{a \sim \pi}[-\log \enfFun{\pi}(a \mid \enfVar{s})]$ — мера случайности политики: высокая — агент исследует, низкая — почти детерминирован.`,
      inFormula: r`Агрегат (ожидание) по действиям. В SAC и PPO входит в цель как бонус с весом $\enfPar{\alpha}$ или $\enfPar{c}_2$.`,
      code: r`train/entropy_loss`,
      codeType: r`метрика`,
      codeNote: r`Своя метрика в коде урока — \`self.logger.record("policy/action_entropy", ...)\`; в ML-Agents — \`Policy/Entropy\`.`,
    },
  ],
};

export default table;
