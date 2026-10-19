import { GraduationCap } from "lucide-react";
import Math from "@/components/Math";
import { Section, GlossaryItem } from "./Section";

const Conclusion = () => (
  <>
    <Section icon={<GraduationCap className="w-5 h-5 text-secondary" />} title="Заключение">
      <p>
        Мы выстроили логическую цепь от простейшей теории вероятностей до сложных нейросетевых архитектур. Дилемма исследования и использования формализуется через оценку уверенности (UCB). Взаимодействие агента с миром укладывается в рамки MDP, где каждое состояние должно инкапсулировать всю необходимую историю.
      </p>
      <p>
        Желание максимизировать дисконтированный возврат приводит к рекурсивным уравнениям Беллмана — алгебраическому сердцу дисциплины. Невозможность аналитического решения в условиях неопределённости породила TD-learning с бутстраппингом, а следы пригодности продемонстрировали изящный способ решения проблемы распределения кредита. Проклятие размерности привело к интеграции нейросетей, открыв путь к DQN и Policy Gradient методам.
      </p>
      <p>
        Системное владение математическим аппаратом превращает инженера из «оператора чёрного ящика» в архитектора интеллектуальных систем, способного осознанно формировать векторы состояний, проектировать функции наград и настраивать параметры сходимости.
      </p>
    </Section>

    <Section icon={<GraduationCap className="w-5 h-5 text-primary" />} title="Мини-глоссарий">
      <div className="space-y-4">
        <GlossaryItem term="Математическое ожидание" formula={"\\mathbb{E}[\\enfVar{X}] = \\sum_x x \\cdot \\enfFun{P}(\\enfVar{X}=x)"} definition="Среднее взвешенное всех возможных значений случайной величины. Центральное понятие оптимизации в RL." />
        <GlossaryItem term="Марковское свойство" formula={"\\enfFun{P}(\\enfVar{S}_{t+1}\\mid \\enfVar{S}_0,...,\\enfVar{S}_t,\\enfFun{A}_t) = \\enfFun{P}(\\enfVar{S}_{t+1}\\mid \\enfVar{S}_t,\\enfFun{A}_t)"} definition="Будущее зависит только от текущего состояния и действия, а не от истории." />
        <GlossaryItem term="Дисконтирование" formula={"\\enfPar{\\gamma}^t,\\; 0 \\leq \\enfPar{\\gamma} < 1"} definition="Будущие награды обесцениваются экспоненциально. Гарантирует конечность бесконечных сумм." />
        <GlossaryItem term="Функция ценности" formula={"\\enfOp{V}_\\pi(\\enfVar{s}) = \\mathbb{E}_\\pi\\!\\left[\\sum_{t=0}^{\\infty} \\enfPar{\\gamma}^t \\enfTgt{R}_{t+1} \\mid \\enfVar{S}_0 = \\enfVar{s}\\right]"} definition="Ожидаемый суммарный дисконтированный возврат из состояния s при политике π." />
        <GlossaryItem term="Уравнение Беллмана" formula={"\\enfOp{V}_\\pi(\\enfVar{s}) = \\sum_a \\pi(a\\mid \\enfVar{s})\\sum_{s'}P(s'\\mid \\enfVar{s},a)[\\enfTgt{R} + \\enfPar{\\gamma} \\enfOp{V}_\\pi(s')]"} definition="Рекуррентное соотношение, связывающее ценности текущего и будущих состояний." />
        <GlossaryItem term="TD-ошибка" formula={"\\enfVar{\\delta}_t = \\enfTgt{R}_{t+1} + \\enfPar{\\gamma} \\enfOp{V}(\\enfVar{S}_{t+1}) - \\enfOp{V}(\\enfVar{S}_t)"} definition="Разница между целью (Target) и текущей оценкой. Основа TD-обучения." />
        <GlossaryItem term="Q-обучение" formula={"\\enfOp{Q}(\\enfVar{s},a) \\leftarrow \\enfOp{Q}(\\enfVar{s},a) + \\enfPar{\\alpha}\\big[\\enfTgt{R} + \\enfPar{\\gamma} \\max_{a'} \\enfOp{Q}(\\enfVar{s}',a') - \\enfOp{Q}(\\enfVar{s},a)\\big]"} definition="Off-policy алгоритм, сходящийся к Q* при посещении всех пар (s,a)." />
        <GlossaryItem term="Контрактное отображение" formula={"\\enfFun{d}(\\enfFun{F}(\\enfVar{x}), \\enfFun{F}(\\enfVar{y})) \\leq \\enfPar{\\kappa}\\, \\enfFun{d}(\\enfVar{x}, \\enfVar{y}),\\; \\enfPar{\\kappa} < 1"} definition="Имеет единственную неподвижную точку. Оператор Беллмана — γ-сжатие." />
        <GlossaryItem term="Policy Gradient" formula={"\\enfOp{\\nabla}_\\theta \\enfTgt{J} = \\mathbb{E}[\\enfOp{G}_t \\enfOp{\\nabla}_\\theta \\ln \\enfFun{\\pi}_\\theta(\\enfFun{A}_t\\mid \\enfVar{S}_t)]"} definition="Прямая оптимизация параметров политики через градиентный подъём." />
        <GlossaryItem term="Actor-Critic" formula={"\\enfPar{\\theta} \\leftarrow \\enfPar{\\theta} + \\enfPar{\\alpha} \\enfVar{\\delta}_t \\enfOp{\\nabla}_\\theta \\ln \\enfFun{\\pi}_\\theta(\\enfFun{A}_t\\mid \\enfVar{S}_t)"} definition="Гибрид: Актор (политика) + Критик (оценка ценности). Основа PPO и SAC." />
      </div>
    </Section>
  </>
);

export default Conclusion;
