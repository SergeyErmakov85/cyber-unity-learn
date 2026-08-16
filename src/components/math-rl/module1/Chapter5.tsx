import { Zap } from "lucide-react";
import Math from "@/components/Math";
import { Section, InfoBox, CodeBlock } from "./Section";

const Chapter5 = () => (
  <Section icon={<Zap className="w-5 h-5 text-primary" />} title="Глава 5. Сердце RL: Уравнения Беллмана" id="глава-5">
    <p>
      Весь математический аппарат RL опирается на принцип <strong className="text-foreground">динамического программирования</strong>, заложенный Ричардом Беллманом в 1950-х. Гениальность подхода — обнаружение рекурсивной структуры: возврат <Math display={false}>{"\\enfOp{G}_t"}</Math> раскладывается на немедленную награду и дисконтированный возврат следующего шага.
    </p>

    <h3 id="рекурсивное-разложение-возврата" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">Рекурсивное разложение возврата</h3>
    <Math>{"\\enfOp{G}_t = \\enfTgt{R}_{t+1} + \\enfPar{\\gamma}\\big(\\enfTgt{R}_{t+2} + \\enfPar{\\gamma} \\enfTgt{R}_{t+3} + \\dots\\big) = \\enfTgt{R}_{t+1} + \\enfPar{\\gamma}\\, \\enfOp{G}_{t+1}"}</Math>

    <h3 id="уравнение-ожиданий-беллмана" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">Уравнение ожиданий Беллмана</h3>
    <p>Подставив рекурсию в определение <Math display={false}>{"\\enfOp{V}_\\pi(\\enfVar{s})"}</Math>, получаем:</p>
    <Math>{"\\enfOp{V}_\\pi(\\enfVar{s}) = \\sum_{a} \\pi(a \\mid \\enfVar{s}) \\sum_{s', r} p(\\enfVar{s}', \\enfTgt{r} \\mid \\enfVar{s}, a) \\left[ \\enfTgt{r} + \\enfPar{\\gamma}\\, \\enfOp{V}_\\pi(\\enfVar{s}') \\right]"}</Math>

    <InfoBox variant="secondary">
      <p className="font-semibold text-foreground mb-2">Чтение формулы «справа налево»</p>
      <ul className="list-disc list-inside space-y-2 text-sm">
        <li>
          <Math display={false}>{"[\\enfTgt{r} + \\enfPar{\\gamma} \\enfOp{V}_\\pi(\\enfVar{s}')]"}</Math> — польза одного перехода: немедленная награда + дисконтированная ценность нового состояния
        </li>
        <li>
          Внутренняя сумма <Math display={false}>{"\\sum_{s',r}"}</Math> — усредняем по всем возможным переходам среды (динамика <Math display={false}>{"p(s',r|s,a)"}</Math>)
        </li>
        <li>
          Внешняя сумма <Math display={false}>{"\\sum_a"}</Math> — усредняем по всем действиям, взвешенным вероятностью политики <Math display={false}>{"\\pi(a \\mid \\enfVar{s})"}</Math>
        </li>
      </ul>
      <p className="text-sm mt-2">
        Ценность текущего состояния зависит от ценностей соседних — информация передаётся между состояниями, подобно тому как тепло распространяется по металлической пластине.
      </p>
    </InfoBox>

    <h3 id="уравнение-оптимальности-беллмана" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">Уравнение оптимальности Беллмана</h3>
    <p>
      Оптимальная политика <Math display={false}>{"\\pi^*"}</Math> порождает <Math display={false}>{"\\enfOp{V}^*(\\enfVar{s}) = \\max_\\pi \\enfOp{V}_\\pi(\\enfVar{s})"}</Math>. В оптимальном поведении усреднение по действиям заменяется оператором <Math display={false}>{"\\max"}</Math>:
    </p>
    <Math>{"\\enfOp{V}^*(\\enfVar{s}) = \\max_a \\sum_{s', r} p(\\enfVar{s}', \\enfTgt{r} \\mid \\enfVar{s}, a)\\left[ \\enfTgt{r} + \\enfPar{\\gamma}\\, \\enfOp{V}^*(\\enfVar{s}') \\right]"}</Math>
    <p className="mt-4">Аналогично для Q-функции:</p>
    <Math>{"\\enfOp{Q}^*(\\enfVar{s}, a) = \\sum_{s', r} p(\\enfVar{s}', \\enfTgt{r} \\mid \\enfVar{s}, a)\\left[ \\enfTgt{r} + \\enfPar{\\gamma} \\max_{a'} \\enfOp{Q}^*(\\enfVar{s}', a') \\right]"}</Math>

    <InfoBox variant="accent">
      <p className="font-semibold text-foreground mb-2">Почему Q* так важно?</p>
      <p className="text-sm">
        Если агент знает точные <Math display={false}>{"\\enfOp{Q}^*(\\enfVar{s},a)"}</Math> для каждой пары (состояние, действие), ему <strong className="text-foreground">не нужна отдельная политика</strong>. Оптимальное поведение сводится к банальному поиску максимума: находясь в <Math display={false}>{"s"}</Math>, просто выбери <Math display={false}>{"a"}</Math> с наибольшим <Math display={false}>{"\\enfOp{Q}^*"}</Math>. Это краеугольный камень алгоритма <strong className="text-primary">Q-learning</strong>.
      </p>
    </InfoBox>

    <h4 className="text-lg font-semibold text-foreground mt-6 mb-2">Пример: MDP с двумя состояниями</h4>
    <p>
      <Math display={false}>{"S_1 \\to S_2"}</Math> (награда +2), <Math display={false}>{"S_2 \\to S_1"}</Math> (награда 0), <Math display={false}>{"\\enfPar{\\gamma} = 0.9"}</Math>:
    </p>
    <Math>{"\\begin{cases} v_1 = 2 + 0.9\\,v_2 \\\\ v_2 = 0.9\\,v_1 \\end{cases} \\;\\Rightarrow\\; v_1 \\approx 10.53,\\quad v_2 \\approx 9.47"}</Math>
    <CodeBlock>{`gamma = 0.9
V = [0.0, 0.0]
for i in range(1, 6):
    V_new = [0.0, 0.0]
    V_new[0] = 2 + gamma * V[1]   # S1: награда 2 + γ·V(S2)
    V_new[1] = 0 + gamma * V[0]   # S2: награда 0 + γ·V(S1)
    V = V_new
    print(f"Итерация {i}: V1={V[0]:.3f}, V2={V[1]:.3f}")`}</CodeBlock>
  </Section>
);

export default Chapter5;
