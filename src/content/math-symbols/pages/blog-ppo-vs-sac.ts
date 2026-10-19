import type { PageSymbols } from "../types";

const r = String.raw;

/** Символы страницы: от формулы к коду. Черновик — scripts/symbol-table-draft.mjs. */
const table: PageSymbols = {
  id: "blog-ppo-vs-sac",
  symbols: [
  { // TODO: сверить с кодом
    tex: r`\alpha`,
    role: "parameter",
    name: r`Скорость обучения / температура`,
    meaning: r`В правилах обновления — размер шага ($\enfPar{\alpha} \approx 10^{-4} \ldots 10^{-3}$ для сетей, $0{,}1$ для таблиц). В SAC — температура: вес энтропийного бонуса.`,
    inFormula: r`Настраиваемый множитель: насколько далеко шагать в сторону ошибки или насколько ценить случайность.`,
    code: r`lr / alpha`,
    codeType: r`float`,
    codeNote: r`В YAML ML-Agents — \`hyperparameters.learning_rate\`; в SAC — \`init_entcoef\` (начальная температура).`,
  },
  ],
};

export default table;
