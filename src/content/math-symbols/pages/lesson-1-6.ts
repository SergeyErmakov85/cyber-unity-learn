import type { PageSymbols } from "../types";

const r = String.raw;

/**
 * Урок 1.6 «DQN с нуля» — символы TD-цели и их имена в коде DQN на PyTorch.
 * Строки сверены с кодом страницы; полноту проверяет npm run math:audit.
 */
const table: PageSymbols = {
  id: "lesson-1-6",
  caption: r`Символы формул DQN и то, как они называются в коде на PyTorch на этой странице.`,
  symbols: [
    {
      tex: r`s`,
      role: "variable",
      name: r`Состояние`,
      meaning: r`Наблюдение CartPole: четыре числа — положение и скорость тележки, угол и угловая скорость шеста.`,
      inFormula: r`Аргумент почти всех функций RL: политика $\enfFun{\pi}(\enfFun{a} \mid \enfVar{s})$, ценности $\enfOp{V}(\enfVar{s})$ и $\enfOp{Q}(\enfVar{s}, \enfFun{a})$. Формула описывает, что происходит с агентом в этом состоянии.`,
      code: r`state`,
      codeType: r`np.ndarray (4,); в батче — torch.Tensor (B, 4)`,
      codeNote: r`В батче из буфера — \`states\` и \`next_states\`.`,
    },
    {
      tex: r`a`,
      role: "function",
      name: r`Действие`,
      meaning: r`Толчок тележки влево (0) или вправо (1).`,
      inFormula: r`Выход политики и аргумент $\enfOp{Q}(\enfVar{s}, \enfFun{a})$. Под $\max_{a'}$ или $\sum_a$ действие перебирается и остаётся без цвета.`,
      code: r`action`,
      codeType: r`int; в батче — torch.Tensor (B, 1)`,
      codeNote: r`Жадное действие — \`policy_net(torch.FloatTensor(state)).argmax().item()\`.`,
    },
    {
      tex: r`r`,
      role: "target",
      name: r`Награда`,
      meaning: r`Число, которое среда выдаёт после шага: $\enfTgt{r}_t$ или $\enfTgt{r}(\enfVar{s}, \enfFun{a})$. Именно её агент стремится накопить.`,
      inFormula: r`Цель обучения: стоит в отдаче $\enfOp{G}_t$, в TD-цели $\enfTgt{r} + \enfPar{\gamma}\enfOp{V}(\enfVar{s}')$ и в целевой функции $\enfTgt{J}$.`,
      code: r`reward`,
      codeType: r`float; в батче — torch.Tensor (B,)`,
      codeNote: r`Хранится в буфере: \`push(self, state, action, reward, next_state, done)\`.`,
    },
    {
      tex: r`Q`,
      role: "operator",
      name: r`Функция ценности действия`,
      meaning: r`$\enfOp{Q}(\enfVar{s}, \enfFun{a})$ — оценка отдачи для пары «состояние—действие». В DQN её выдаёт сеть \`policy_net\`: по состоянию — по одному числу на каждое действие.`,
      inFormula: r`Агрегат будущих наград для пары «состояние—действие». Жадная политика выбирает $\arg\max_a \enfOp{Q}(\enfVar{s}, a)$.`,
      code: r`q_values`,
      codeType: r`torch.Tensor (B,)`,
      codeNote: r`\`q_values = policy_net(states).gather(1, actions).squeeze()\` — значение для сделанного действия.`,
    },
    {
      tex: r`\gamma`,
      role: "parameter",
      name: r`Коэффициент дисконтирования`,
      meaning: r`Число $0 \le \enfPar{\gamma} < 1$: во сколько раз награда следующего шага весит меньше текущей. Эффективный горизонт — около $1/(1 - \enfPar{\gamma})$ шагов.`,
      inFormula: r`Настраиваемый множитель перед будущим: $\enfTgt{r} + \enfPar{\gamma}\enfOp{V}(\enfVar{s}')$. Делает бесконечную сумму наград конечной.`,
      code: r`GAMMA`,
      codeType: r`float = 0.99`,
      codeNote: r`\`target = rewards + GAMMA * next_q * (1 - dones)\`.`,
    },
    {
      tex: r`\max`,
      role: "neutral",
      name: r`Максимум`,
      meaning: r`Наибольшее значение выражения; $\max_{a'}$ — по всем действиям $a'$ (связанная переменная не окрашивается).`,
      code: r`target_net(next_states).max(1)[0]`,
      codeType: r`torch.Tensor (B,)`,
      codeNote: r`Максимум по действиям считает целевая сеть \`target_net\` без градиента (\`torch.no_grad()\`).`,
    },
    {
      tex: r`\varepsilon`,
      role: "parameter",
      name: r`Доля случайных действий`,
      meaning: r`С вероятностью $\enfPar{\varepsilon}$ агент действует случайно, иначе — по $\arg\max_a \enfOp{Q}(\enfVar{s}, a)$. Убывает от 1,0 до 0,01.`,
      code: r`epsilon`,
      codeType: r`float, 1.0 → 0.01`,
      codeNote: r`\`epsilon = max(EPS_END, epsilon * EPS_DECAY)\` после каждого эпизода.`,
    },
  ],
};

export default table;
