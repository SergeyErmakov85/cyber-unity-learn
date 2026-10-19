import type { PageSymbols } from "../types";

const r = String.raw;

/** Символы страницы: от формулы к коду. Черновик — scripts/symbol-table-draft.mjs. */
const table: PageSymbols = {
  id: "taxi",
  symbols: [
  {
    tex: r`\varepsilon`,
    role: "parameter",
    name: r`Эпсилон`,
    meaning: r`В PPO — ширина коридора клиппинга (обычно $0{,}2$); в ε-жадной стратегии — вероятность случайного действия; в определении предела — допуск.`,
    inFormula: r`Настраиваемая граница: $[1 - \enfPar{\varepsilon}, 1 + \enfPar{\varepsilon}]$ в PPO, «с вероятностью $\enfPar{\varepsilon}$ исследуем».`,
    code: r`epsilon`,
    codeType: r`float`,
    codeNote: r`В коде страницы: \`epsilon = max(0.01, epsilon * 0.995)\`.`,
  },
  ],
};

export default table;
