import type { PageSymbols } from "../types";

const r = String.raw;

/**
 * Урок 1.5 «CartPole» — ε-жадная стратегия в коде DQN-агента.
 * Строки сверены с кодом страницы; полноту проверяет npm run math:audit.
 */
const table: PageSymbols = {
  id: "lesson-1-5",
  caption: r`Единственный параметр формул урока и его имя в коде агента для CartPole.`,
  symbols: [
    {
      tex: r`\varepsilon`,
      role: "parameter",
      name: r`Доля случайных действий`,
      meaning: r`С вероятностью $\enfPar{\varepsilon}$ агент делает случайное действие (исследует), с вероятностью $1 - \enfPar{\varepsilon}$ — действие с наибольшим $Q$. Начинает с 1,0 и уменьшается до 0,01.`,
      inFormula: r`Настраиваемая граница между исследованием и использованием: $\enfPar{\varepsilon} \to$ случайно, $(1 - \enfPar{\varepsilon}) \to$ жадно.`,
      code: r`epsilon`,
      codeType: r`float, 1.0 → 0.01`,
      codeNote: r`\`if random.random() < epsilon:\` — случайное действие; после эпизода \`epsilon = max(EPSILON_END, epsilon * EPSILON_DECAY)\`.`,
    },
  ],
};

export default table;
