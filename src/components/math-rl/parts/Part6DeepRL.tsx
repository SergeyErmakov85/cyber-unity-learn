import React from "react";
import { BookOpen, Brain, Lightbulb, TrendingUp, Layers, BarChart3, GitBranch } from "lucide-react";
import Math from "@/components/Math";

const Part6DeepRL = () => (
  <>
    {/* Chapter 1: Introduction to Deep RL */}
    <div className="mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 pb-3 border-b border-primary/30">
        Глава 1. Введение в глубокое обучение с подкреплением
      </h2>

      <Section icon={<BookOpen className="w-5 h-5 text-primary" />} title="1.1 Основные понятия">
        <p>
          <strong className="text-foreground">Глубокое обучение с подкреплением (Deep RL)</strong> объединяет методы обучения с подкреплением с возможностями глубоких нейронных сетей.
        </p>

        <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="ключевые-компоненты">Ключевые компоненты</h3>
        <ul className="list-disc list-inside space-y-3">
          <li><strong className="text-foreground">Агент (Agent)</strong> — сущность, которая принимает решения и выполняет действия.</li>
          <li><strong className="text-foreground">Среда (Environment)</strong> — внешний мир, с которым взаимодействует агент.</li>
          <li><strong className="text-foreground">Состояние (State)</strong> — представление текущей ситуации в среде.</li>
          <li><strong className="text-foreground">Действие (Action)</strong> — операция агента. Дискретное или непрерывное пространство.</li>
          <li><strong className="text-foreground">Награда (Reward)</strong> — числовой сигнал обратной связи.</li>
          <li><strong className="text-foreground">Политика (Policy)</strong> — стратегия выбора действий.</li>
        </ul>

        <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="особенности-deep-rl">Особенности Deep RL</h3>
        <p>Глубокие нейронные сети используются для аппроксимации:</p>
        <ol className="list-decimal list-inside space-y-2 mt-3">
          <li><strong className="text-foreground">Функции ценности</strong> — оценка ожидаемой будущей награды</li>
          <li><strong className="text-foreground">Политики</strong> — прямая параметризация выбора действий</li>
          <li><strong className="text-foreground">Модели среды</strong> — предсказание следующего состояния и награды</li>
        </ol>
      </Section>

      <Section icon={<Lightbulb className="w-5 h-5 text-accent" />} title="1.2 Обзор алгоритмов RL">
        <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-6 mb-3" id="deep-q-network-dqn">Deep Q-Network (DQN)</h3>
        <p>DQN (DeepMind, 2013–2015) заменяет Q-таблицу глубокой нейронной сетью <Math display={false}>{`\\enfOp{Q}(\\enfVar{s},a;\\enfPar{\\theta})`}</Math>.</p>
        <ol className="list-decimal list-inside space-y-2 mt-3">
          <li><strong className="text-foreground">Аппроксимация нейронной сетью:</strong> <Math display={false}>{`\\enfOp{Q}(\\enfVar{s},a;\\enfPar{\\theta})`}</Math></li>
          <li><strong className="text-foreground">Experience Replay:</strong> буфер переходов <Math display={false}>{`(s,a,r,s')`}</Math></li>
          <li><strong className="text-foreground">Target Network:</strong> отдельная сеть <Math display={false}>{`\\enfOp{Q}(\\enfVar{s},a;\\enfPar{\\theta}^-)`}</Math></li>
        </ol>
        <p className="mt-4">Функция потерь DQN:</p>
        <Math>{`L(\\enfPar{\\theta}) = \\frac{1}{N} \\sum_j \\bigl(\\enfTgt{y}_j - \\enfOp{Q}(\\enfVar{s}_j, a_j; \\enfPar{\\theta})\\bigr)^2`}</Math>
        <p>где целевое значение:</p>
        <Math>{`\\enfTgt{y}_j = r_j + \\gamma \\max_{a'} \\enfOp{Q}(\\enfVar{s}'_j, a'; \\enfPar{\\theta}^-)`}</Math>

        <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="улучшения-dqn">Улучшения DQN</h3>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-foreground">Double DQN</strong> — разделяет выбор и оценку действия</li>
          <li><strong className="text-foreground">Dueling DQN</strong> — разделяет <Math display={false}>{`Q = V(s) + A(s,a)`}</Math></li>
          <li><strong className="text-foreground">Prioritized Experience Replay</strong> — выборка пропорционально TD-ошибке</li>
          <li><strong className="text-foreground">Rainbow</strong> — объединение всех улучшений</li>
        </ul>

        <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="современные-алгоритмы">Современные алгоритмы</h3>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-foreground">SAC (Soft Actor-Critic)</strong> — энтропийная регуляризация</li>
          <li><strong className="text-foreground">TD3</strong> — двойные Q-сети, задержка обновления политики</li>
          <li><strong className="text-foreground">D4PG</strong> — распределённое обучение</li>
        </ul>

        <InfoBox color="accent" title="Выбор алгоритма">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong className="text-foreground">Дискретные действия</strong> → Q-learning, DQN</li>
            <li><strong className="text-foreground">Непрерывные действия</strong> → DDPG, TD3, SAC</li>
            <li><strong className="text-foreground">Стохастическая среда</strong> → Policy Gradient методы</li>
            <li><strong className="text-foreground">Большое пространство состояний</strong> → Deep RL</li>
          </ul>
        </InfoBox>
      </Section>
    </div>

    {/* Chapter 2: Mathematical Foundations */}
    <div className="mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 pb-3 border-b border-secondary/30">
        Глава 2. Математические основы глубокого обучения с подкреплением
      </h2>

      <Section icon={<TrendingUp className="w-5 h-5 text-primary" />} title="2.1 Математический анализ">
        <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-6 mb-3" id="производные-и-правила-дифференцирования">Производные и правила дифференцирования</h3>
        <p>Производная функции <Math display={false}>{`f(x)`}</Math>:</p>
        <Math>{`\\enfFun{f}'(\\enfVar{x}) = \\lim_{h \\to 0} \\frac{\\enfFun{f}(\\enfVar{x}+h) - \\enfFun{f}(\\enfVar{x})}{h}`}</Math>

        <h4 className="text-lg font-semibold text-foreground mt-6 mb-2">Основные правила</h4>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-foreground">Степенная:</strong> <Math display={false}>{`(\\enfVar{x}^n)' = nx^{n-1}`}</Math></li>
          <li><strong className="text-foreground">Произведение:</strong> <Math display={false}>{`(fg)' = f'g + fg'`}</Math></li>
          <li><strong className="text-foreground">Цепное правило:</strong> <Math display={false}>{`(\\enfFun{f} \\circ \\enfFun{g})'(\\enfVar{x}) = \\enfFun{f}'(\\enfFun{g}(\\enfVar{x})) \\cdot \\enfFun{g}'(\\enfVar{x})`}</Math></li>
          <li><strong className="text-foreground">Экспонента:</strong> <Math display={false}>{`(e^x)' = e^x`}</Math></li>
          <li><strong className="text-foreground">Логарифм:</strong> <Math display={false}>{`(\\ln \\enfVar{x})' = \\frac{1}{\\enfVar{x}}`}</Math></li>
        </ul>

        <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="частные-производные-и-градиент">Частные производные и градиент</h3>
        <Math>{`\\nabla \\enfFun{f} = \\left(\\frac{\\partial \\enfFun{f}}{\\partial \\enfVar{x}_1},\\; \\frac{\\partial \\enfFun{f}}{\\partial \\enfVar{x}_2},\\; \\ldots,\\; \\frac{\\partial \\enfFun{f}}{\\partial \\enfVar{x}_n}\\right)`}</Math>

        <InfoBox color="primary" title="Применение в RL">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong className="text-foreground">Градиентный спуск:</strong> <Math display={false}>{`\\enfPar{\\theta}_{\\text{new}} = \\enfPar{\\theta}_{\\text{old}} - \\alpha \\nabla L(\\enfPar{\\theta})`}</Math></li>
            <li><strong className="text-foreground">Обратное распространение</strong> — цепное правило для вычисления градиентов</li>
            <li><strong className="text-foreground">Градиент политики:</strong> <Math display={false}>{`\\nabla_\\theta J(\\enfPar{\\theta}) = \\mathbb{E}_\\pi[\\nabla_\\theta \\log \\pi \\cdot \\enfOp{Q}^\\pi]`}</Math></li>
          </ul>
        </InfoBox>

        <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="экстремумы-функций">Экстремумы функций</h3>
        <ul className="list-disc list-inside space-y-2">
          <li><Math display={false}>{`f''(a) > 0`}</Math> → локальный минимум</li>
          <li><Math display={false}>{`f''(a) < 0`}</Math> → локальный максимум</li>
        </ul>

        <h4 className="text-lg font-semibold text-foreground mt-6 mb-2">Несколько переменных</h4>
        <Math>{`D = \\frac{\\partial^2 \\enfFun{f}}{\\partial \\enfVar{x}^2} \\cdot \\frac{\\partial^2 \\enfFun{f}}{\\partial \\enfTgt{y}^2} - \\left(\\frac{\\partial^2 \\enfFun{f}}{\\partial \\enfVar{x} \\partial \\enfTgt{y}}\\right)^2`}</Math>
        <ul className="list-disc list-inside space-y-1 mt-3">
          <li><Math display={false}>{`D > 0`}</Math> и <Math display={false}>{`\\enfFun{f}_{xx} > 0`}</Math> → минимум</li>
          <li><Math display={false}>{`D > 0`}</Math> и <Math display={false}>{`\\enfFun{f}_{xx} < 0`}</Math> → максимум</li>
          <li><Math display={false}>{`D < 0`}</Math> → седловая точка</li>
        </ul>
      </Section>

      <Section icon={<BarChart3 className="w-5 h-5 text-accent" />} title="2.2 Теория вероятностей и статистика">
        <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-6 mb-3" id="нормальное-распределение">Нормальное распределение</h3>
        <Math>{`\\enfFun{f}(\\enfVar{x}) = \\frac{1}{\\sigma\\sqrt{2\\pi}} \\exp\\left(-\\frac{(\\enfVar{x} - \\mu)^2}{2\\sigma^2}\\right)`}</Math>

        <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="оценка-максимального-правдоподобия-mle">Оценка максимального правдоподобия (MLE)</h3>
        <Math>{`\\hat{\\enfPar{\\theta}}_{\\text{MLE}} = \\arg\\max_\\theta \\sum_{i=1}^n \\log \\enfFun{f}(X_i|\\enfPar{\\theta})`}</Math>

        <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="оценка-map">Оценка MAP</h3>
        <Math>{`\\hat{\\enfPar{\\theta}}_{\\text{MAP}} = \\arg\\max_\\theta \\bigl[\\log P(X \\mid \\enfPar{\\theta}) + \\log P(\\enfPar{\\theta})\\bigr]`}</Math>
      </Section>

      <Section icon={<GitBranch className="w-5 h-5 text-primary" />} title="2.3 Дифференциальные уравнения">
        <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-6 mb-3" id="оду-с-разделяющимися-переменными">ОДУ с разделяющимися переменными</h3>
        <p>Уравнение <Math display={false}>{`y' = ky`}</Math>:</p>
        <Math>{`\\frac{\\mathrm{d}y}{\\enfTgt{y}} = k\\,\\mathrm{d}x \\quad \\Rightarrow \\quad \\enfTgt{y} = C_1 e^{kx}`}</Math>

        <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="оду-второго-порядка">ОДУ второго порядка</h3>
        <p>Характеристическое уравнение <Math display={false}>{`ar^2 + br + c = 0`}</Math>:</p>
        <ul className="list-disc list-inside space-y-2 mt-3">
          <li>Различные действительные корни: <Math display={false}>{`\\enfTgt{y} = C_1 e^{r_1 x} + C_2 e^{r_2 x}`}</Math></li>
          <li>Кратный корень: <Math display={false}>{`\\enfTgt{y} = (C_1 + C_2 \\enfVar{x})e^{rx}`}</Math></li>
          <li>Комплексные корни: <Math display={false}>{`\\enfTgt{y} = e^{\\alpha x}(C_1 \\cos\\beta \\enfVar{x} + C_2 \\sin\\beta \\enfVar{x})`}</Math></li>
        </ul>
      </Section>
    </div>
  </>
);

/* ─── Local helpers ─── */

const slugify = (t: string) => t.toLowerCase().replace(/[^\wа-яё]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60);

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <section className="mt-12 first:mt-0 scroll-mt-28" id={slugify(title)}>
    <div className="flex items-center gap-3 mb-6">
      {icon}
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    </div>
    <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </section>
);

const InfoBox = ({ color, title, children }: { color: "primary" | "secondary" | "accent"; title: string; children: React.ReactNode }) => {
  const borderColor = color === "primary" ? "border-primary/30" : color === "secondary" ? "border-secondary/30" : "border-accent/30";
  const titleColor = color === "primary" ? "text-primary" : color === "secondary" ? "text-secondary" : "text-accent";
  return (
    <div className={`my-4 p-4 rounded-lg bg-card/60 border ${borderColor}`}>
      <p className={`font-semibold ${titleColor} text-sm mb-2`}>{title}</p>
      {children}
    </div>
  );
};

export default Part6DeepRL;
