import InteractiveMath from "./InteractiveMath";
import { MATH_SYMBOLS, symbolTex, type EnfMacro } from "./symbol-data";

const roleLabels: Record<string, string> = {
  variable: "переменная",
  function: "функция",
  parameter: "параметр",
  operator: "оператор",
  target: "цель / награда",
  neutral: "служебное",
};

const entries: { id: string; role: EnfMacro; latex: string }[] = [
  { id: "setS", role: "Neu", latex: "\\mathcal{S}" },
  { id: "setA", role: "Neu", latex: "\\mathcal{A}" },
  { id: "state", role: "Var", latex: "s_t" },
  { id: "stateGeneric", role: "Var", latex: "s" },
  { id: "nextState", role: "Var", latex: "s_{t+1}" },
  { id: "action", role: "Var", latex: "a_t" },
  { id: "actionGeneric", role: "Var", latex: "a" },
  { id: "nextAction", role: "Neu", latex: "a'" },
  { id: "reward", role: "Tgt", latex: "r_{t+1}" },
  { id: "rewardGeneric", role: "Tgt", latex: "r" },
  { id: "rewardFunction", role: "Fun", latex: "\\mathcal{R}" },
  { id: "policy", role: "Fun", latex: "\\pi" },
  { id: "q", role: "Op", latex: "Q" },
  { id: "target", role: "Tgt", latex: "y_t" },
  { id: "tdError", role: "Var", latex: "\\delta_t" },
  { id: "alpha", role: "Par", latex: "\\alpha" },
  { id: "gamma", role: "Par", latex: "\\gamma" },
  { id: "terminal", role: "Neu", latex: "d_t" },
  { id: "epsilon", role: "Par", latex: "\\varepsilon_k" },
  { id: "epsilonMax", role: "Par", latex: "\\varepsilon_{\\max}" },
  { id: "epsilonMin", role: "Par", latex: "\\varepsilon_{\\min}" },
  { id: "decay", role: "Par", latex: "\\lambda" },
  { id: "episode", role: "Var", latex: "k" },
  { id: "exp", role: "Fun", latex: "\\exp" },
  { id: "max", role: "Neu", latex: "\\max" },
  { id: "zero", role: "Neu", latex: "0" },
  { id: "one", role: "Neu", latex: "1" },
  { id: "plus", role: "Neu", latex: "+" },
  { id: "minus", role: "Neu", latex: "-" },
  { id: "times", role: "Neu", latex: "\\times" },
  { id: "arrow", role: "Neu", latex: "\\leftarrow" },
  { id: "equals", role: "Neu", latex: "=" },
  { id: "delimiters", role: "Neu", latex: "( )" },
  { id: "comma", role: "Neu", latex: "," },
  { id: "colon", role: "Neu", latex: ":" },
  { id: "product", role: "Neu", latex: "\\times" },
  { id: "maps", role: "Neu", latex: "\\to" },
  { id: "real", role: "Neu", latex: "\\mathbb{R}" },
];

const S = (id: string, role: EnfMacro, latex: string) => symbolTex(id, role, latex);
const qValue = S("q", "Op", "Q") + S("delimiters", "Neu", "(") +
  S("state", "Var", "s_t") + S("comma", "Neu", ", ") +
  S("action", "Var", "a_t") + S("delimiters", "Neu", ")");
const nextQ = S("q", "Op", "Q") + S("delimiters", "Neu", "(") +
  S("nextState", "Var", "s_{t+1}") + S("comma", "Neu", ", ") +
  S("nextAction", "Neu", "a'") + S("delimiters", "Neu", ")");
const targetFormula =
  S("target", "Tgt", "y_t") + " " + S("equals", "Neu", "=") + " " +
  S("reward", "Tgt", "r_{t+1}") + " " + S("plus", "Neu", "+") + " " +
  S("gamma", "Par", "\\gamma") + " " + S("times", "Neu", "\\times") + " " +
  S("delimiters", "Neu", "(") + S("one", "Neu", "1") + " " +
  S("minus", "Neu", "-") + " " + S("terminal", "Neu", "d_t") +
  S("delimiters", "Neu", ")") + " " + S("times", "Neu", "\\times") + " " +
  S("max", "Neu", "\\max") + "_{" + S("nextAction", "Neu", "a'") + "} " + nextQ;
const errorFormula =
  S("tdError", "Var", "\\delta_t") + " " + S("equals", "Neu", "=") + " " +
  S("target", "Tgt", "y_t") + " " + S("minus", "Neu", "-") + " " + qValue;
const updateFormula =
  qValue + " " + S("arrow", "Neu", "\\leftarrow") + " " + qValue + " " +
  S("plus", "Neu", "+") + " " + S("alpha", "Par", "\\alpha") + " " +
  S("times", "Neu", "\\times") + " " + S("tdError", "Var", "\\delta_t");
const epsilonFormula =
  S("epsilon", "Par", "\\varepsilon_k") + " " + S("equals", "Neu", "=") + " " +
  S("epsilonMin", "Par", "\\varepsilon_{\\min}") + " " + S("plus", "Neu", "+") + " " +
  S("delimiters", "Neu", "(") + S("epsilonMax", "Par", "\\varepsilon_{\\max}") + " " +
  S("minus", "Neu", "-") + " " + S("epsilonMin", "Par", "\\varepsilon_{\\min}") +
  S("delimiters", "Neu", ")") + " " + S("times", "Neu", "\\times") + " " +
  S("exp", "Fun", "\\exp") + S("delimiters", "Neu", "(") + S("minus", "Neu", "-") +
  S("decay", "Par", "\\lambda") + " " + S("times", "Neu", "\\times") +
  S("episode", "Var", "k") + S("delimiters", "Neu", ")");
 const MathSymbolsReference = () => (
  <section className="space-y-4">
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Символы и их роль в коде</h2>
      <p className="text-sm text-muted-foreground">
        Наведите указатель и нажмите на цветной символ, чтобы открыть его пояснение.
        Каждая запись связывает математическое обозначение с конкретной переменной Python.
      </p>
    </div>
    <div className="overflow-x-auto rounded-lg border border-border/30 bg-card/30">
      <table className="w-full text-sm">
        <thead className="bg-primary/10">
          <tr className="text-left">
            <th className="p-3 font-semibold text-foreground">Символ</th>
            <th className="p-3 font-semibold text-foreground">Объяснение и роль в формуле</th>
            <th className="p-3 font-semibold text-foreground">Роль ENF</th>
            <th className="p-3 font-semibold text-foreground">Представление в Python</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30 text-muted-foreground">
          {entries.map((entry) => {
            const detail = MATH_SYMBOLS[entry.id];
            return (
              <tr key={entry.id}>
                <td className="p-3 whitespace-nowrap">
                  <InteractiveMath display={false}>{symbolTex(entry.id, entry.role, entry.latex)}</InteractiveMath>
                </td>
                <td className="p-3">
                  <strong className="text-foreground">{detail.name}.</strong> {detail.explanation}
                  <span className="block mt-1 text-xs">В формуле: {detail.formulaRole}</span>
                </td>
                <td className="p-3">
                  <span className={"enf-" + detail.role}>{roleLabels[detail.role]}</span>
                </td>
                <td className="p-3"><code className="text-primary text-xs">{detail.python}</code></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    <div>
      <h3 className="text-xl font-semibold text-foreground mb-2">Формула → Python</h3>
      <div className="overflow-x-auto rounded-lg border border-border/30 bg-card/30">
        <table className="w-full text-sm">
          <thead className="bg-primary/10">
            <tr className="text-left">
              <th className="p-3 font-semibold text-foreground">Математика</th>
              <th className="p-3 font-semibold text-foreground">Эквивалент в Python</th>
              <th className="p-3 font-semibold text-foreground">Смысл</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 text-muted-foreground">
            <tr>
              <td className="p-3"><InteractiveMath>{targetFormula}</InteractiveMath></td>
              <td className="p-3"><code className="text-primary text-xs">bootstrap_value = 0.0 if terminated else np.max(Q_table[new_state, :])<br />td_target = reward + gamma * bootstrap_value</code></td>
              <td className="p-3">Терминальный флаг обнуляет будущую оценку; временное прерывание допускает bootstrap.</td>
            </tr>
            <tr>
              <td className="p-3"><InteractiveMath>{errorFormula}</InteractiveMath></td>
              <td className="p-3"><code className="text-primary text-xs">td_error = td_target - Q_table[state, action]</code></td>
              <td className="p-3">Разница между целью и текущей оценкой.</td>
            </tr>
            <tr>
              <td className="p-3"><InteractiveMath>{updateFormula}</InteractiveMath></td>
              <td className="p-3"><code className="text-primary text-xs">Q_table[state, action] += learning_rate * td_error</code></td>
              <td className="p-3">Сдвигает оценку в сторону TD-цели на долю, заданную скоростью обучения.</td>
            </tr>
            <tr>
              <td className="p-3"><InteractiveMath>{epsilonFormula}</InteractiveMath></td>
              <td className="p-3"><code className="text-primary text-xs">epsilon = min_epsilon + (max_epsilon - min_epsilon) * np.exp(-decay_rate * episode)</code></td>
              <td className="p-3">Плавно уменьшает исследование от верхнего уровня к нижнему.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default MathSymbolsReference;



