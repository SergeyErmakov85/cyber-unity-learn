import { Target } from "lucide-react";
import Math from "@/components/Math";
import { Section, InfoBox } from "./Section";

const Chapter2 = () => (
  <Section icon={<Target className="w-5 h-5 text-accent" />} title="Глава 2. Многорукие бандиты: Исследование vs Использование" id="глава-2">
    <p>
      Прежде чем переходить к сложным средам, изучим упрощённую, но фундаментальную постановку — <strong className="text-foreground">задачу о многоруком бандите</strong> (Multi-Armed Bandit). Представьте <Math display={false}>{"K"}</Math> игровых автоматов, каждый из которых выдаёт выигрыш согласно неизвестному распределению. Цель — максимизировать суммарный выигрыш за определённое число попыток.
    </p>

    <h3 id="дилемма-exploration-vs-exploitation" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">Дилемма Exploration vs Exploitation</h3>
    <ul className="list-disc list-inside space-y-2">
      <li><strong className="text-foreground">Использование (Exploitation):</strong> выбор действия с наибольшей текущей оценкой — эксплуатация знаний.</li>
      <li><strong className="text-foreground">Исследование (Exploration):</strong> проба мало изученных действий — риск сейчас, но шанс обнаружить лучший вариант.</li>
    </ul>

    <h3 id="ценность-действия-action-value" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">Ценность действия (Action-Value)</h3>
    <p>
      Истинная ценность действия <Math display={false}>{"\\enfFun{a}"}</Math> — это математическое ожидание награды при его выборе:
    </p>
    <Math>{"\\enfOp{q}(\\enfFun{a}) = \\mathbb{E}[\\enfVar{X}_t \\mid \\enfFun{A}_t = \\enfFun{a}]"}</Math>
    <p>
      Поскольку <Math display={false}>{"\\enfOp{q}(\\enfFun{a})"}</Math> скрыто, агент строит эмпирическую оценку <Math display={false}>{"\\enfOp{\\hat{Q}}_t(\\enfFun{a})"}</Math> — среднее арифметическое полученных наград:
    </p>
    <Math>{"\\enfOp{\\hat{Q}}_t(\\enfFun{a}) = \\frac{\\sum_{i=1}^{t-1} \\enfVar{X}_i \\cdot \\mathbb{1}_{A_i=a}}{N_t(\\enfFun{a})}"}</Math>
    <p>
      Здесь <Math display={false}>{"\\mathbb{1}_{A_i=a}"}</Math> — индикаторная функция (равна 1, если на шаге <Math display={false}>{"i"}</Math> выбрано действие <Math display={false}>{"\\enfFun{a}"}</Math>), а <Math display={false}>{"N_t(\\enfFun{a})"}</Math> — количество выборов действия <Math display={false}>{"\\enfFun{a}"}</Math> к моменту <Math display={false}>{"t"}</Math>.
    </p>

    <h3 id="жадная-стратегия" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3"><Math display={false}>{String.raw`\enfPar{\varepsilon}`}</Math>-жадная стратегия</h3>
    <p>
      С вероятностью <Math display={false}>{"1 - \\enfPar{\\epsilon}"}</Math> агент выбирает <Math display={false}>{"\\arg\\max_a \\enfOp{\\hat{Q}}_t(a)"}</Math> (жадно), а с вероятностью <Math display={false}>{"\\enfPar{\\epsilon}"}</Math> — случайное действие. Это гарантирует, что при бесконечном времени каждое действие будет испробовано бесконечно раз.
    </p>

    <h3 id="верхняя-доверительная-граница-ucb" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">Верхняя доверительная граница (UCB)</h3>
    <p>
      Более математически элегантное решение — метод UCB, учитывающий не только оценку, но и <em>неуверенность</em> в ней:
    </p>
    <Math>{"\\enfFun{A}_t = \\arg\\max_a \\left[ \\enfOp{\\hat{Q}}_t(a) + \\enfPar{c} \\sqrt{\\frac{\\ln t}{N_t(a)}} \\right]"}</Math>

    <InfoBox>
      <p className="font-semibold text-foreground mb-2">Разбор формулы UCB</p>
      <ul className="list-disc list-inside space-y-1 text-sm">
        <li><Math display={false}>{"\\enfOp{\\hat{Q}}_t(\\enfFun{a})"}</Math> — <strong className="text-foreground">использование</strong>: предпочтение действиям с высокой оценкой</li>
        <li><Math display={false}>{"N_t(\\enfFun{a})"}</Math> в знаменателе — чем чаще действие выбирается, тем меньше «бонус» исследования</li>
        <li><Math display={false}>{"\\ln t"}</Math> в числителе — если действие долго не выбирается, бонус медленно растёт</li>
        <li><Math display={false}>{"\\enfPar{c}"}</Math> — балансировочный коэффициент «любопытства» агента</li>
      </ul>
    </InfoBox>
  </Section>
);

export default Chapter2;
