import { Sparkles } from "lucide-react";
import Math from "@/components/Math";
import { Section, InfoBox } from "./Section";

const Chapter9 = () => (
  <Section icon={<Sparkles className="w-5 h-5 text-accent" />} title="Глава 9. Методы градиента политики (Policy Gradients)" id="глава-9">
    <p>
      Value-based методы (DQN) не работают с <strong className="text-foreground">непрерывным пространством действий</strong> (нельзя вычислить <Math display={false}>{"\\max_a"}</Math> для бесконечного числа вариантов) и не могут выучить истинно стохастические политики (в «Камень-ножницы-бумага» оптимальная стратегия — играть случайно).
    </p>

    <h3 id="параметризация-политики" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">Параметризация политики</h3>
    <p>
      Политика напрямую параметризуется нейронной сетью с весами <Math display={false}>{"\\enfPar{\\theta}"}</Math>: <Math display={false}>{"\\enfFun{\\pi}_\\theta(\\enfFun{a} \\mid \\enfVar{s})"}</Math>. Целевая функция — ожидаемый суммарный возврат:
    </p>
    <Math>{"\\enfTgt{J}(\\enfPar{\\theta}) = \\mathbb{E}_{\\pi_\\theta}[\\enfOp{G}_t]"}</Math>
    <p>Обновление весов методом градиентного подъёма:</p>
    <Math>{"\\enfPar{\\theta}_{t+1} = \\enfPar{\\theta}_t + \\enfPar{\\alpha}\\, \\enfOp{\\nabla}_\\theta \\enfTgt{J}(\\enfPar{\\theta}_t)"}</Math>

    <h3 id="теорема-о-градиенте-политики" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">Теорема о градиенте политики</h3>
    <Math>{"\\enfOp{\\nabla}_\\theta \\enfTgt{J}(\\enfPar{\\theta}) \\propto \\sum_{s} d^{\\pi}(\\enfVar{s}) \\sum_{a} \\enfOp{Q}^\\pi(\\enfVar{s},a)\\, \\enfOp{\\nabla}_\\theta \\pi_\\theta(a \\mid \\enfVar{s})"}</Math>
    <p>
      Здесь <Math display={false}>{"\\enfFun{d}^\\pi(\\enfVar{s})"}</Math> — стационарное распределение состояний.
    </p>

    <h3 id="логарифмический-трюк-log-derivative-trick" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">Логарифмический трюк (Log-derivative trick)</h3>
    <p>
      Из матанализа: <Math display={false}>{"\\enfOp{\\nabla} \\enfFun{f}(\\enfVar{x}) = \\enfFun{f}(\\enfVar{x})\\, \\enfOp{\\nabla} \\ln \\enfFun{f}(\\enfVar{x})"}</Math>. Применяя к <Math display={false}>{"\\enfFun{\\pi}_\\theta"}</Math>, преобразуем градиент в форму математического ожидания:
    </p>
    <Math>{"\\enfOp{\\nabla}_\\theta \\enfTgt{J}(\\enfPar{\\theta}) = \\mathbb{E}_{\\pi_\\theta}\\!\\left[ \\enfOp{G}_t\\, \\enfOp{\\nabla}_\\theta \\ln \\pi_\\theta(A_t \\mid \\enfVar{S}_t) \\right]"}</Math>

    <h3 id="алгоритм-reinforce" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">Алгоритм REINFORCE</h3>
    <Math>{"\\enfPar{\\theta}_{t+1} = \\enfPar{\\theta}_t + \\enfPar{\\alpha}\\, \\enfOp{G}_t\\, \\enfOp{\\nabla}_\\theta \\ln \\enfFun{\\pi}_\\theta(\\enfFun{A}_t \\mid \\enfVar{S}_t)"}</Math>

    <InfoBox variant="secondary">
      <p className="font-semibold text-foreground mb-2">Интуиция REINFORCE</p>
      <ul className="list-disc list-inside space-y-1 text-sm">
        <li>Вектор <Math display={false}>{"\\enfOp{\\nabla}_\\theta \\ln \\enfFun{\\pi}_\\theta(\\enfFun{A}_t \\mid \\enfVar{S}_t)"}</Math> указывает направление, увеличивающее вероятность действия <Math display={false}>{"\\enfFun{A}_t"}</Math></li>
        <li><Math display={false}>{"\\enfOp{G}_t > 0"}</Math> — действие было хорошим → веса сдвигаются <em>в направлении</em> градиента (вероятность ↑)</li>
        <li><Math display={false}>{"\\enfOp{G}_t < 0"}</Math> — действие было плохим → веса сдвигаются <em>против</em> градиента (вероятность ↓)</li>
      </ul>
    </InfoBox>

    <h3 id="архитектура-актор-критик-actor-critic" className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3">Архитектура Актор-Критик (Actor-Critic)</h3>
    <p>
      REINFORCE имеет колоссальную <strong className="text-foreground">дисперсию</strong>. Гибридная архитектура решает эту проблему, объединяя две сети:
    </p>
    <ul className="list-disc list-inside space-y-1">
      <li><strong className="text-primary">Актор</strong> — сеть политики <Math display={false}>{"\\enfFun{\\pi}_\\theta(\\enfFun{a} \\mid \\enfVar{s})"}</Math>, принимающая решения</li>
      <li><strong className="text-secondary">Критик</strong> — сеть функции ценности <Math display={false}>{"\\enfOp{V}_w(\\enfVar{s})"}</Math>, оценивающая Актора</li>
    </ul>
    <p className="mt-3">
      Вместо зашумлённого <Math display={false}>{"\\enfOp{G}_t"}</Math> Критик на каждом шаге вычисляет TD-ошибку — «насколько реальность превзошла ожидания»:
    </p>
    <Math>{"\\enfPar{\\theta}_{t+1} = \\enfPar{\\theta}_t + \\enfPar{\\alpha}\\, \\enfVar{\\delta}_t\\, \\enfOp{\\nabla}_\\theta \\ln \\enfFun{\\pi}_\\theta(\\enfFun{A}_t \\mid \\enfVar{S}_t)"}</Math>
    <Math>{"\\enfVar{\\delta}_t = \\enfTgt{R}_{t+1} + \\enfPar{\\gamma} \\enfOp{V}_w(\\enfVar{S}_{t+1}) - \\enfOp{V}_w(\\enfVar{S}_t)"}</Math>
    <p>
      Архитектуры Actor-Critic лежат в основе передовых алгоритмов: <strong className="text-primary">PPO</strong> (Proximal Policy Optimization) и <strong className="text-primary">SAC</strong> (Soft Actor-Critic).
    </p>
  </Section>
);

export default Chapter9;
