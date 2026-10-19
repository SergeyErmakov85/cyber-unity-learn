import type { PageSymbols } from "../types";

const r = String.raw;

/** Символы страницы: от формулы к коду. Черновик — scripts/symbol-table-draft.mjs. */
const table: PageSymbols = {
  id: "fca-rl",
  symbols: [
  {
    tex: r`m`,
    role: "variable",
    name: r`Память рекуррентной сети`,
    meaning: r`$\enfVar{m}_t$ — скрытое состояние LSTM/GRU: сжатая история наблюдений до шага $t$.`,
    inFormula: r`Объект, который сеть передаёт сама себе: $\enfVar{m}_t = \operatorname{LSTM}_\phi(\enfVar{o}_t, \enfVar{m}_{t-1})$.`,
    code: r`c`,
    codeType: r`torch.Tensor (B, memory_size)`,
    codeNote: r`В коде страницы: \`for c in lattice:\`.`,
  },
  { // TODO: сверить с кодом
    tex: r`g`,
    role: "variable",
    name: r`Объект формального контекста`,
    meaning: r`Элемент множества объектов $G$ в анализе формальных понятий (FCA).`,
    code: r`obj`,
    codeType: r`str`,
  },
  ],
};

export default table;
