import { GitBranch } from "lucide-react";
import Math from "@/components/Math";
import { Section, InfoBox } from "./Section";
import { TDErrorViz, SarsaVsQLearningViz } from "./Module5Charts";

const Chapter6 = () => (
  <Section icon={<GitBranch className="w-5 h-5 text-accent" />} title="Глава 6. От динамического программирования к Model-Free RL" id="глава-6">
    <p>
      Если модель среды известна (матрицы <Math display={false}>{"P"}</Math> и <Math display={false}>{"R"}</Math>), можно использовать классическое <strong className="text-foreground">Динамическое Программирование</strong> (Policy Iteration, Value Iteration). Но в реальности мы почти никогда не знаем динамику среды. Программист, настраивающий агента в Unity, не знает аналитической формулы вероятности отскока физического объекта сложной формы.
    </p>
    <p>
      Тогда на сцену выходят <strong className="text-primary">методы обучения без модели</strong> (Model-Free RL) — агент познаёт мир через метод проб и ошибок.
    </p>

    <h3 id="монте-карло-vs-temporal-difference" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">Монте-Карло vs Temporal Difference</h3>
    <div className="my-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50">
            <th className="text-left py-2 px-3 text-muted-foreground">Характеристика</th>
            <th className="text-left py-2 px-3 text-primary">Монте-Карло (MC)</th>
            <th className="text-left py-2 px-3 text-secondary">Temporal Difference (TD)</th>
          </tr>
        </thead>
        <tbody>
          {[
            { c: "Принцип", mc: "Полный фактический возврат G_t в конце эпизода", td: "Обновление на основе текущей оценки (бутстраппинг)" },
            { c: "Эпизоды", mc: "Обязательно конечные", td: "Может обучаться в непрерывных задачах" },
            { c: "Дисперсия", mc: "Высокая — траектории сильно различаются", td: "Низкая — только один случайный шаг" },
            { c: "Смещение", mc: "Нулевое — реальный опыт", td: "Присутствует на начальных этапах" },
          ].map((row, i) => (
            <tr key={i} className="border-b border-border/20">
              <td className="py-2 px-3 text-foreground">{row.c}</td>
              <td className="py-2 px-3 text-muted-foreground">{row.mc}</td>
              <td className="py-2 px-3 text-muted-foreground">{row.td}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <h3 id="td-обучение-величайший-прорыв" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">TD-обучение: величайший прорыв</h3>
    <p>
      Мы делаем один шаг, получаем <Math display={false}>{"\\enfTgt{R}_{t+1}"}</Math>, смотрим на оценку нового состояния <Math display={false}>{"\\enfOp{V}(S_{t+1})"}</Math> и используем сумму как «цель» (Target):
    </p>
    <Math>{"\\enfOp{V}(S_t) \\leftarrow \\enfOp{V}(S_t) + \\enfPar{\\alpha} \\left[ \\underbrace{\\enfTgt{R}_{t+1} + \\enfPar{\\gamma} \\enfOp{V}(S_{t+1})}_{\\text{TD Target}} - \\enfOp{V}(S_t) \\right]"}</Math>
    <p>
      Разница между целью и текущей оценкой — <strong className="text-primary">ошибка TD</strong>:
    </p>
    <Math>{"\\delta_t = \\enfTgt{R}_{t+1} + \\enfPar{\\gamma} \\enfOp{V}(S_{t+1}) - \\enfOp{V}(S_t)"}</Math>
    <p>
      Коэффициент <Math display={false}>{"\\enfPar{\\alpha}"}</Math> (Learning Rate) определяет, насколько сильно мы готовы изменить старую оценку. Обновление оценок на основе других оценок называется <strong className="text-foreground">бутстраппингом</strong>.
    </p>

    <h3 id="sarsa-vs-q-learning" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">SARSA vs Q-learning</h3>

    <InfoBox>
      <p className="font-semibold text-foreground mb-2">SARSA (On-policy)</p>
      <p className="text-sm mb-2">Обновляет Q-значение, предполагая, что агент продолжит следовать текущей (исследующей) политике:</p>
      <Math>{"\\enfOp{Q}(S_t, A_t) \\leftarrow \\enfOp{Q}(S_t, A_t) + \\enfPar{\\alpha}\\left[ \\enfTgt{R}_{t+1} + \\enfPar{\\gamma}\\, \\enfOp{Q}(S_{t+1}, A_{t+1}) - \\enfOp{Q}(S_t, A_t) \\right]"}</Math>
    </InfoBox>

    <InfoBox variant="secondary">
      <p className="font-semibold text-foreground mb-2">Q-learning (Off-policy)</p>
      <p className="text-sm mb-2">Обновляет Q-значение так, как будто на следующем шаге агент гарантированно выберет лучшее действие — прямо зашит оператор <Math display={false}>{"\\max"}</Math> из уравнения оптимальности Беллмана:</p>
      <Math>{"\\enfOp{Q}(S_t, A_t) \\leftarrow \\enfOp{Q}(S_t, A_t) + \\enfPar{\\alpha}\\left[ \\enfTgt{R}_{t+1} + \\enfPar{\\gamma} \\max_{a'} \\enfOp{Q}(S_{t+1}, a') - \\enfOp{Q}(S_t, A_t) \\right]"}</Math>
    </InfoBox>

    <TDErrorViz />
    <SarsaVsQLearningViz />
  </Section>
);

export default Chapter6;
