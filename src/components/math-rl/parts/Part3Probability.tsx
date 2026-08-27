import React from "react";
import { BookOpen, BarChart3, GitBranch, Brain, Lightbulb, Code2 } from "lucide-react";
import Math from "@/components/Math";

const Part3Probability = () => (
  <>
    {/* Section 1: Probability Theory */}
    <Section icon={<BookOpen className="w-5 h-5 text-primary" />} title="1. Теория вероятностей">
      <p>
        Теория вероятности — краеугольный камень для понимания неопределённости в задачах RL. Агент взаимодействует со стохастической средой, и вероятность предоставляет аппарат для моделирования такой неопределённости.
      </p>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="основные-понятия">Основные понятия</h3>
      <ul className="list-disc list-inside space-y-2">
        <li><strong className="text-foreground">Пространство элементарных исходов</strong> <Math display={false}>{`\\Omega`}</Math> — множество всех возможных результатов эксперимента</li>
        <li><strong className="text-foreground">Событие</strong> <Math display={false}>{`A \\subseteq \\Omega`}</Math> — подмножество пространства исходов</li>
        <li><strong className="text-foreground">Вероятность</strong> <Math display={false}>{`P(A) \\in [0, 1]`}</Math>, <Math display={false}>{`\\sum P(\\omega_i) = 1`}</Math></li>
      </ul>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="случайные-величины-и-распределения">Случайные величины и распределения</h3>
      <p>
        <strong className="text-foreground">Случайная величина</strong> <Math display={false}>{`\\enfVar{X}: \\Omega \\to \\mathbb{\\enfTgt{R}}`}</Math> — функция, сопоставляющая каждому исходу числовое значение.
      </p>
      <ul className="list-disc list-inside mt-3 space-y-2">
        <li><strong className="text-foreground">PMF</strong> (дискретная): <Math display={false}>{`P(X = x)`}</Math></li>
        <li><strong className="text-foreground">PDF</strong> (непрерывная): <Math display={false}>{`f(x)`}</Math>, где <Math display={false}>{`\\int_{-\\infty}^{\\infty} \\enfFun{f}(\\enfVar{x})\\,\\mathrm{d}x = 1`}</Math></li>
        <li><strong className="text-foreground">CDF:</strong> <Math display={false}>{`F(\\enfVar{x}) = P(\\enfVar{X} \\leq \\enfVar{x})`}</Math></li>
      </ul>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="ожидаемое-значение-и-дисперсия">Ожидаемое значение и дисперсия</h3>
      <p>Дискретная случайная величина:</p>
      <Math>{`\\mathbb{E}[\\enfVar{X}] = \\sum_x \\enfVar{x} \\cdot P(\\enfVar{X} = \\enfVar{x})`}</Math>
      <p>Непрерывная случайная величина:</p>
      <Math>{`\\mathbb{E}[\\enfVar{X}] = \\int_{-\\infty}^{\\infty} \\enfVar{x} \\cdot \\enfFun{f}(\\enfVar{x})\\,\\mathrm{d}x`}</Math>
      <p>Дисперсия:</p>
      <Math>{`\\operatorname{Var}(\\enfVar{X}) = \\mathbb{E}\\bigl[(\\enfVar{X} - \\mathbb{E}[\\enfVar{X}])^2\\bigr] = \\mathbb{E}[\\enfVar{X}^2] - (\\mathbb{E}[\\enfVar{X}])^2`}</Math>

      <InfoBox color="primary" title="В RL">
        <p className="text-sm">Ожидаемое значение вознаграждения — ключевое понятие для оценки политик. Цель агента — максимизировать <Math display={false}>{`\\mathbb{E}\\left[\\sum_{t=0}^{\\infty} \\enfPar{\\gamma}^t \\enfTgt{R}_t\\right]`}</Math>.</p>
      </InfoBox>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="условная-вероятность-и-правило-байеса">Условная вероятность и правило Байеса</h3>
      <Math>{`P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}, \\quad P(B) > 0`}</Math>
      <p className="mt-3"><strong className="text-foreground">Независимость:</strong> <Math display={false}>{`P(A \\cap B) = P(A) \\cdot P(B)`}</Math></p>
      <p className="mt-3"><strong className="text-foreground">Правило Байеса:</strong></p>
      <Math>{`P(H \\mid E) = \\frac{P(E \\mid H) \\cdot P(H)}{P(E)}`}</Math>

      <InfoBox color="primary" title="Применение в RL">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Переходы: <Math display={false}>{`P(s'|s, a)`}</Math> — стохастическая модель среды</li>
          <li>Оценка политик через ожидаемое суммарное вознаграждение</li>
          <li>ε-жадная стратегия для баланса исследования и эксплуатации</li>
          <li>POMDP: байесовский вывод для неполностью наблюдаемых состояний</li>
        </ul>
      </InfoBox>
    </Section>

    {/* Section 2: Statistics */}
    <Section icon={<BarChart3 className="w-5 h-5 text-secondary" />} title="2. Статистика">
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-6 mb-3" id="описательная-статистика">Описательная статистика</h3>
      <ul className="list-disc list-inside space-y-2">
        <li><strong className="text-foreground">Среднее:</strong> <Math display={false}>{`\\bar{\\enfVar{x}} = \\frac{1}{n}\\sum_{i=1}^{n} \\enfVar{x}_i`}</Math></li>
        <li><strong className="text-foreground">Дисперсия:</strong> <Math display={false}>{`\\operatorname{Var}(\\enfVar{X}) = \\mathbb{E}[(\\enfVar{X} - \\mathbb{E}[\\enfVar{X}])^2]`}</Math></li>
        <li><strong className="text-foreground">Стандартное отклонение:</strong> <Math display={false}>{`\\enfPar{\\sigma} = \\sqrt{\\operatorname{Var}(\\enfVar{X})}`}</Math></li>
        <li><strong className="text-foreground">Медиана, мода, квартили, IQR</strong></li>
      </ul>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="оценка-параметров">Оценка параметров</h3>
      <ul className="list-disc list-inside space-y-2">
        <li><strong className="text-foreground">Точечная оценка</strong> — например, выборочное среднее <Math display={false}>{`\\hat{\\enfPar{\\mu}} = \\bar{\\enfVar{x}}`}</Math></li>
        <li><strong className="text-foreground">Доверительные интервалы</strong> — диапазон, в котором с заданной вероятностью находится параметр</li>
      </ul>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="проверка-гипотез">Проверка гипотез</h3>
      <ul className="list-disc list-inside space-y-2">
        <li><Math display={false}>{`H_0`}</Math> — нулевая гипотеза (нет различия)</li>
        <li><Math display={false}>{`H_1`}</Math> — альтернативная гипотеза</li>
        <li><strong className="text-foreground">p-значение</strong> <Math display={false}>{`< 0.05`}</Math> → отклоняем <Math display={false}>{`H_0`}</Math></li>
      </ul>

      <InfoBox color="secondary" title="Применение в RL">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>t-тесты для сравнения производительности алгоритмов</li>
          <li>Бутстрэп для оценки неопределённости</li>
          <li>Байесовский RL: количественная оценка неопределённости</li>
          <li>Регрессия для аппроксимации функций ценности</li>
        </ul>
      </InfoBox>
    </Section>

    {/* Section 3: Markov Processes */}
    <Section icon={<GitBranch className="w-5 h-5 text-accent" />} title="3. Марковские процессы">
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-6 mb-3" id="цепи-маркова">Цепи Маркова</h3>
      <p><strong className="text-foreground">Свойство Маркова</strong> — будущее зависит только от текущего состояния:</p>
      <Math>{`P(S_{t+1} = \\enfVar{s}' \\mid S_t = \\enfVar{s}_t, S_{t-1} = \\enfVar{s}_{t-1}, \\ldots, S_0 = \\enfVar{s}_0) = P(S_{t+1} = \\enfVar{s}' \\mid S_t = \\enfVar{s}_t)`}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="mdp-марковский-процесс-принятия-решений">MDP — Марковский процесс принятия решений</h3>
      <p>MDP определяется кортежем:</p>
      <Math>{`(\\mathcal{S},\\; \\mathcal{A},\\; P,\\; \\enfTgt{R},\\; \\enfPar{\\gamma})`}</Math>
      <ul className="list-disc list-inside mt-3 space-y-2">
        <li><Math display={false}>{`\\mathcal{S}`}</Math> — множество состояний</li>
        <li><Math display={false}>{`\\mathcal{A}`}</Math> — множество действий</li>
        <li><Math display={false}>{`P(s'|s, a)`}</Math> — переходные вероятности</li>
        <li><Math display={false}>{`R(s, a, s')`}</Math> — функция вознаграждения</li>
        <li><Math display={false}>{`\\enfPar{\\gamma} \\in [0, 1]`}</Math> — коэффициент дисконтирования</li>
      </ul>

      <InfoBox color="accent" title="Дисконтирование γ">
        <p className="text-sm">
          <Math display={false}>{`\\enfPar{\\gamma} = 0`}</Math> — агент заботится только о немедленном вознаграждении.{" "}
          <Math display={false}>{`\\enfPar{\\gamma} \\to 1`}</Math> — одинаково ценит все будущие вознаграждения (возможны проблемы сходимости).
        </p>
      </InfoBox>
    </Section>

    {/* Section 4: Value Functions & Bellman */}
    <Section icon={<Brain className="w-5 h-5 text-primary" />} title="4. Функции ценности и уравнения Беллмана">
      <p>
        <strong className="text-foreground">Политика</strong> <Math display={false}>{`\\pi(a \\mid \\enfVar{s})`}</Math> — распределение вероятностей над действиями для состояния <Math display={false}>{`s`}</Math>.
      </p>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="функция-ценности-состояния">Функция ценности состояния</h3>
      <Math>{`\\enfOp{V}^\\pi(\\enfVar{s}) = \\mathbb{E}_\\pi\\left[\\sum_{t=0}^{\\infty} \\enfPar{\\gamma}^t \\enfTgt{R}_t \\;\\middle|\\; S_0 = \\enfVar{s}\\right]`}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="функция-ценности-действия">Функция ценности действия</h3>
      <Math>{`\\enfOp{Q}^\\pi(\\enfVar{s}, a) = \\mathbb{E}_\\pi\\left[\\sum_{t=0}^{\\infty} \\enfPar{\\gamma}^t \\enfTgt{R}_t \\;\\middle|\\; S_0 = \\enfVar{s}, A_0 = a\\right]`}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="уравнения-беллмана">Уравнения Беллмана</h3>
      <Math>{`\\enfOp{V}^\\pi(\\enfVar{s}) = \\sum_a \\pi(a \\mid \\enfVar{s}) \\sum_{s'} P(\\enfVar{s}' \\mid \\enfVar{s}, a) \\bigl[\\enfTgt{R}(\\enfVar{s}, a, \\enfVar{s}') + \\enfPar{\\gamma}\\, \\enfOp{V}^\\pi(\\enfVar{s}')\\bigr]`}</Math>
      <Math>{`\\enfOp{Q}^\\pi(\\enfVar{s}, a) = \\sum_{s'} P(\\enfVar{s}' \\mid \\enfVar{s}, a) \\left[\\enfTgt{R}(\\enfVar{s}, a, \\enfVar{s}') + \\enfPar{\\gamma} \\sum_{a'} \\pi(a' \\mid \\enfVar{s}')\\, \\enfOp{Q}^\\pi(\\enfVar{s}', a')\\right]`}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="уравнения-оптимальности-беллмана">Уравнения оптимальности Беллмана</h3>
      <Math>{`\\enfOp{V}^*(\\enfVar{s}) = \\max_a \\sum_{s'} P(\\enfVar{s}' \\mid \\enfVar{s}, a) \\bigl[\\enfTgt{R}(\\enfVar{s}, a, \\enfVar{s}') + \\enfPar{\\gamma}\\, \\enfOp{V}^*(\\enfVar{s}')\\bigr]`}</Math>
      <Math>{`\\enfOp{Q}^*(\\enfVar{s}, a) = \\sum_{s'} P(\\enfVar{s}' \\mid \\enfVar{s}, a) \\left[\\enfTgt{R}(\\enfVar{s}, a, \\enfVar{s}') + \\enfPar{\\gamma} \\max_{a'} \\enfOp{Q}^*(\\enfVar{s}', a')\\right]`}</Math>

      <InfoBox color="primary" title="Оптимальная политика">
        <p className="text-sm">
          Оптимальная политика <Math display={false}>{`\\pi^*`}</Math> достигает <Math display={false}>{`\\enfOp{V}^*(\\enfVar{s}) = \\max_\\pi \\enfOp{V}^\\pi(\\enfVar{s})`}</Math> для всех <Math display={false}>{`\\enfVar{s} \\in \\mathcal{S}`}</Math>.
        </p>
      </InfoBox>
    </Section>

    {/* Section 5: RL Algorithms */}
    <Section icon={<Lightbulb className="w-5 h-5 text-secondary" />} title="5. Алгоритмы RL">
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-6 mb-3" id="методы-основанные-на-ценности">Методы, основанные на ценности</h3>
      <p><strong className="text-foreground">Q-learning</strong> (off-policy):</p>
      <Math>{`\\enfOp{Q}(\\enfVar{s}, a) \\leftarrow \\enfOp{Q}(\\enfVar{s}, a) + \\enfPar{\\alpha} \\bigl[\\enfTgt{R} + \\enfPar{\\gamma} \\max_{a'} \\enfOp{Q}(\\enfVar{s}', a') - \\enfOp{Q}(\\enfVar{s}, a)\\bigr]`}</Math>
      <p className="mt-3"><strong className="text-foreground">SARSA</strong> (on-policy):</p>
      <Math>{`\\enfOp{Q}(\\enfVar{s}, a) \\leftarrow \\enfOp{Q}(\\enfVar{s}, a) + \\enfPar{\\alpha} \\bigl[\\enfTgt{R} + \\enfPar{\\gamma}\\, \\enfOp{Q}(\\enfVar{s}', a') - \\enfOp{Q}(\\enfVar{s}, a)\\bigr]`}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="методы-основанные-на-политике">Методы, основанные на политике</h3>
      <p><strong className="text-foreground">REINFORCE</strong> — метод Монте-Карло для оценки градиента:</p>
      <Math>{`\\enfOp{\\nabla}_\\theta \\enfTgt{J}(\\enfPar{\\theta}) = \\mathbb{E}_\\pi\\left[\\sum_{t=0}^{T} \\enfOp{\\nabla}_\\theta \\log \\pi_\\theta(a_t \\mid \\enfVar{s}_t) \\cdot \\enfOp{G}_t\\right]`}</Math>
      <p className="mt-3"><strong className="text-foreground">Actor-Critic:</strong> критик оценивает <Math display={false}>{`V(s)`}</Math>, актёр обновляет <Math display={false}>{`\\pi_\\theta`}</Math> на основе оценки критика.</p>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="методы-основанные-на-модели">Методы, основанные на модели</h3>
      <p>
        Сначала изучается модель среды (<Math display={false}>{`\\hat{P}`}</Math> и <Math display={false}>{`\\hat{\\enfTgt{R}}`}</Math>), затем используется для планирования или генерации синтетического опыта.
      </p>

      <InfoBox color="secondary" title="Связь с теорией">
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Q-learning / SARSA: используют ожидаемое значение и свойство Маркова</li>
          <li>REINFORCE: метод Монте-Карло + градиент по параметрам политики</li>
          <li>Model-based: статистическая оценка <Math display={false}>{`P`}</Math> и <Math display={false}>{`R`}</Math></li>
        </ul>
      </InfoBox>
    </Section>

    {/* Section 6: Python Examples */}
    <Section icon={<Code2 className="w-5 h-5 text-accent" />} title="6. Практические примеры (Python)">
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-6 mb-3" id="пример-1-симуляция-бросков-монеты">Пример 1: Симуляция бросков монеты</h3>
      <CodeBlock>{`import numpy as np
import matplotlib.pyplot as plt

num_flips = 1000
results = np.random.randint(0, 2, num_flips)  # 0=орёл, 1=решка

heads = np.sum(results == 0)
tails = np.sum(results == 1)
print(f"Доля орлов: {heads/num_flips:.2f}")
print(f"Доля решек: {tails/num_flips:.2f}")`}</CodeBlock>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="пример-2-анализ-вознаграждений">Пример 2: Анализ вознаграждений</h3>
      <CodeBlock>{`np.random.seed(42)
rewards = np.random.normal(loc=10, scale=3, size=100)

mean_reward = np.mean(rewards)
std_reward  = np.std(rewards)
print(f"Среднее: {mean_reward:.2f}, σ: {std_reward:.2f}")

plt.hist(rewards, bins=10, edgecolor='black', alpha=0.7)
plt.title('Распределение вознаграждений агента RL')
plt.show()`}</CodeBlock>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="пример-3-оценка-политики-в-mdp">Пример 3: Оценка политики в MDP</h3>
      <p className="text-sm mb-3">
        Среда: 2 состояния (S0, S1), 2 действия (A0, A1), <Math display={false}>{`\\enfPar{\\gamma} = 0.9`}</Math>.
      </p>
      <CodeBlock>{`import numpy as np

P = np.zeros((2, 2, 2))
P[0,0,0]=0.8; P[0,0,1]=0.2
P[0,1,0]=0.3; P[0,1,1]=0.7
P[1,0,0]=0.1; P[1,0,1]=0.9
P[1,1,0]=0.6; P[1,1,1]=0.4

R = np.zeros((2, 2, 2))
R[0,0,0]=5;  R[0,0,1]=1
R[0,1,0]=0;  R[0,1,1]=2
R[1,0,0]=1;  R[1,0,1]=10
R[1,1,0]=3;  R[1,1,1]=4

gamma = 0.9
policy = {0: 0, 1: 1}
V = np.zeros(2)

for _ in range(100):
    new_V = np.zeros(2)
    for s in range(2):
        a = policy[s]
        for s_p in range(2):
            new_V[s] += P[s,a,s_p] * (R[s,a,s_p] + gamma*V[s_p])
    V = new_V

print(f"V(S0) = {V[0]:.2f}, V(S1) = {V[1]:.2f}")`}</CodeBlock>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="упражнения-для-самопроверки">Упражнения для самопроверки</h3>
      <ol className="list-decimal list-inside space-y-2 text-sm">
        <li>Измените Пример 1 для двух игральных костей — постройте гистограмму сумм.</li>
        <li>В Примере 2 добавьте медиану и IQR. Сравните со средним и σ.</li>
        <li>В Примере 3 смените политику (S0→A1, S1→A0) и пересчитайте V.</li>
      </ol>
    </Section>
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

const CodeBlock = ({ children }: { children: string }) => (
  <pre className="my-4 p-4 rounded-lg bg-card/80 border border-primary/20 overflow-x-auto text-sm font-mono text-foreground">
    <code>{children}</code>
  </pre>
);

export default Part3Probability;
