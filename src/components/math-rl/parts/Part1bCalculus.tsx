import React from "react";
import { BookOpen, TrendingUp, Layers, BarChart3, Code2, Lightbulb, Zap } from "lucide-react";
import Math from "@/components/Math";
import CyberCodeBlock from "@/components/CyberCodeBlock";

const Part1bCalculus = () => (
  <>
    {/* ═══ СЕКЦИЯ 1: Производные ═══ */}
    <Section icon={<BookOpen className="w-5 h-5 text-primary" />} title="§ 1. Производные и дифференцирование">
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-4 mb-3" id="определение-производной">Определение производной</h3>
      <DefinitionBox>
        <p><strong className="text-foreground">Производная</strong> <Math display={false}>{`f'(x)`}</Math> — это предел отношения приращения функции к приращению аргумента:</p>
        <Math>{`\\enfFun{f}'(\\enfVar{x}) = \\lim_{h \\to 0} \\frac{\\enfFun{f}(\\enfVar{x}+h) - \\enfFun{f}(\\enfVar{x})}{h}`}</Math>
      </DefinitionBox>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="три-интуиции">Три интуиции</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        <MiniCard icon="📐" title="Геометрически" text="Угловой коэффициент касательной к графику" />
        <MiniCard icon="🚗" title="Физически" text="Скорость (если f(t) — положение, то f'(t) — скорость)" />
        <MiniCard icon="🏔️" title="Оптимизация" text="В точке минимума или максимума f'(x) = 0" />
      </div>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="таблица-основных-производных">Таблица основных производных</h3>
      <div className="my-4 overflow-x-auto">
        <table className="w-full text-sm border border-border/30 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-card/60">
              <th className="text-left p-3 text-foreground font-semibold border-b border-border/30"><Math display={false}>{`f(x)`}</Math></th>
              <th className="text-left p-3 text-foreground font-semibold border-b border-border/30"><Math display={false}>{`f'(x)`}</Math></th>
              <th className="text-left p-3 text-muted-foreground font-semibold border-b border-border/30">Комментарий</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/20"><td className="p-3"><Math display={false}>{`c`}</Math></td><td className="p-3"><Math display={false}>{`0`}</Math></td><td className="p-3">Константа не изменяется</td></tr>
            <tr className="border-b border-border/20"><td className="p-3"><Math display={false}>{`\\enfVar{x}^n`}</Math></td><td className="p-3"><Math display={false}>{`n \\cdot \\enfVar{x}^{n-1}`}</Math></td><td className="p-3">Степенная функция</td></tr>
            <tr className="border-b border-border/20"><td className="p-3"><Math display={false}>{`e^x`}</Math></td><td className="p-3"><Math display={false}>{`e^x`}</Math></td><td className="p-3">Уникальное свойство числа e</td></tr>
            <tr className="border-b border-border/20"><td className="p-3"><Math display={false}>{`\\ln(\\enfVar{x})`}</Math></td><td className="p-3"><Math display={false}>{`1/x`}</Math></td><td className="p-3"><Math display={false}>{`x > 0`}</Math></td></tr>
            <tr className="border-b border-border/20"><td className="p-3"><Math display={false}>{`\\sin(\\enfVar{x})`}</Math></td><td className="p-3"><Math display={false}>{`\\cos(\\enfVar{x})`}</Math></td><td className="p-3"></td></tr>
            <tr className="border-b border-border/20"><td className="p-3"><Math display={false}>{`\\cos(\\enfVar{x})`}</Math></td><td className="p-3"><Math display={false}>{`-\\sin(\\enfVar{x})`}</Math></td><td className="p-3"></td></tr>
            <tr><td className="p-3"><Math display={false}>{`\\enfFun{\\sigma}(\\enfVar{x}) = \\frac{1}{1+e^{-x}}`}</Math></td><td className="p-3 text-primary font-bold"><Math display={false}>{`\\enfFun{\\sigma}(\\enfVar{x})(1-\\enfFun{\\sigma}(\\enfVar{x}))`}</Math></td><td className="p-3 text-primary">Сигмоида в нейросетях RL</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="правила-дифференцирования">Правила дифференцирования</h3>
      <ul className="list-disc list-inside space-y-2">
        <li><strong className="text-foreground">Линейность:</strong> <Math display={false}>{`(f + g)' = f' + g'`}</Math>, <Math display={false}>{`(c \\cdot \\enfFun{f})' = c \\cdot \\enfFun{f}'`}</Math></li>
        <li><strong className="text-foreground">Произведение:</strong> <Math display={false}>{`(\\enfFun{f} \\cdot \\enfFun{g})' = \\enfFun{f}'\\enfFun{g} + fg'`}</Math></li>
        <li><strong className="text-foreground">Частное:</strong> <Math display={false}>{`(\\enfFun{f}/\\enfFun{g})' = (\\enfFun{f}'\\enfFun{g} - fg') / \\enfFun{g}^2`}</Math></li>
      </ul>

      <div className="my-6 p-5 rounded-lg border-2 border-primary/40 bg-primary/5">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-primary" />
          <h4 className="text-lg font-bold text-foreground">Правило цепочки (Chain Rule) — основа backpropagation</h4>
        </div>
        <Math>{`(\\enfFun{f}(\\enfFun{g}(\\enfVar{x})))' = \\enfFun{f}'(\\enfFun{g}(\\enfVar{x})) \\cdot \\enfFun{g}'(\\enfVar{x})`}</Math>
        <p className="text-sm text-primary mt-2">Именно это правило позволяет обновлять веса нейросетей в DQN, PPO, SAC — через все слои «цепочкой».</p>
      </div>

      {/* ── Задачи по производным ── */}
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-10 mb-3" id="практические-задачи">✏️ Практические задачи</h3>

      <PracticeTask level="⭐" num="2.1" label="Базовая" color="primary">
        <p><strong className="text-foreground">Найти</strong> <Math display={false}>{`f'(x)`}</Math> для <Math display={false}>{`\\enfFun{f}(\\enfVar{x}) = 3\\enfVar{x}^4 - 5\\enfVar{x}^2 + 2\\enfVar{x} - 7`}</Math></p>
        <details className="text-sm mt-3">
          <summary className="text-primary cursor-pointer">💡 Подсказка</summary>
          <p className="mt-2 text-muted-foreground">Применяй <Math display={false}>{`(\\enfVar{x}^n)' = n \\cdot \\enfVar{x}^{n-1}`}</Math> к каждому слагаемому.</p>
        </details>
        <details className="text-sm mt-2">
          <summary className="text-primary cursor-pointer">📝 Решение</summary>
          <div className="mt-2 space-y-2">
            <p className="text-muted-foreground"><Math display={false}>{`\\enfFun{f}'(\\enfVar{x}) = 3 \\cdot 4\\enfVar{x}^3 - 5 \\cdot 2\\enfVar{x} + 2 \\cdot 1 - 0`}</Math></p>
            <p><span className="inline-block px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-sm font-bold">Ответ: <Math display={false}>{`\\enfFun{f}'(\\enfVar{x}) = 12\\enfVar{x}^3 - 10\\enfVar{x} + 2`}</Math></span></p>
          </div>
        </details>
      </PracticeTask>

      <PracticeTask level="⭐⭐" num="2.2" label="Chain Rule" color="secondary">
        <p><strong className="text-foreground">Найти</strong> <Math display={false}>{`f'(x)`}</Math> для <Math display={false}>{`\\enfFun{f}(\\enfVar{x}) = e^{-x^2}`}</Math></p>
        <details className="text-sm mt-3">
          <summary className="text-secondary cursor-pointer">💡 Подсказка</summary>
          <p className="mt-2 text-muted-foreground">Внешняя функция <Math display={false}>{`e^u`}</Math>, внутренняя <Math display={false}>{`u = -\\enfVar{x}^2`}</Math>. Применяй Chain Rule.</p>
        </details>
        <details className="text-sm mt-2">
          <summary className="text-secondary cursor-pointer">📝 Решение</summary>
          <div className="mt-2 space-y-2">
            <p className="text-muted-foreground"><Math display={false}>{`(e^u)' = e^u`}</Math>, <Math display={false}>{`u' = (-\\enfVar{x}^2)' = -2\\enfVar{x}`}</Math></p>
            <p><span className="inline-block px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-sm font-bold">Ответ: <Math display={false}>{`\\enfFun{f}'(\\enfVar{x}) = -2\\enfVar{x} \\cdot e^{-x^2}`}</Math></span></p>
          </div>
        </details>
      </PracticeTask>

      <PracticeTask level="⭐⭐ 🤖" num="2.3" label="Производная сигмоиды" color="accent">
        <p><strong className="text-foreground">Вывести формулу</strong> <Math display={false}>{`\\enfFun{\\sigma}'(\\enfVar{x})`}</Math> для <Math display={false}>{`\\enfFun{\\sigma}(\\enfVar{x}) = \\frac{1}{1 + e^{-x}}`}</Math></p>
        <details className="text-sm mt-3">
          <summary className="text-accent cursor-pointer">💡 Подсказка</summary>
          <p className="mt-2 text-muted-foreground">Представь <Math display={false}>{`\\enfFun{\\sigma}(\\enfVar{x}) = (1 + e^{-x})^{-1}`}</Math> и применяй Chain Rule.</p>
        </details>
        <details className="text-sm mt-2">
          <summary className="text-accent cursor-pointer">📝 Решение</summary>
          <div className="mt-2 space-y-2">
            <Math>{`\\enfFun{\\sigma}'(\\enfVar{x}) = -(1+e^{-x})^{-2} \\cdot (-e^{-x}) = \\frac{e^{-x}}{(1+e^{-x})^2}`}</Math>
            <p className="text-muted-foreground">Умножим числитель и знаменатель на <Math display={false}>{`\\frac{1}{1+e^{-x}}`}</Math>:</p>
            <Math>{`\\enfFun{\\sigma}'(\\enfVar{x}) = \\frac{1}{1+e^{-x}} \\cdot \\frac{e^{-x}}{1+e^{-x}} = \\enfFun{\\sigma}(\\enfVar{x}) \\cdot (1 - \\enfFun{\\sigma}(\\enfVar{x}))`}</Math>
            <p><span className="inline-block px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-sm font-bold">Ответ: <Math display={false}>{`\\enfFun{\\sigma}'(\\enfVar{x}) = \\enfFun{\\sigma}(\\enfVar{x})(1 - \\enfFun{\\sigma}(\\enfVar{x}))`}</Math></span></p>
            <p className="text-muted-foreground text-xs mt-1">Эта формула — один из «кирпичей» обратного распространения ошибки в policy networks.</p>
          </div>
        </details>
      </PracticeTask>

      <PracticeTask level="⭐⭐⭐ 🤖" num="2.4" label="Huber Loss в DQN" color="accent">
        <p><strong className="text-foreground">Условие.</strong> DQN использует функцию потерь Хаббера вместо MSE:</p>
        <Math>{`\\enfTgt{L}(\\enfPar{\\delta}) = \\begin{cases} \\tfrac{1}{2}\\enfPar{\\delta}^2, & |\\enfPar{\\delta}| \\le 1 \\\\ |\\enfPar{\\delta}| - 0{,}5, & |\\enfPar{\\delta}| > 1 \\end{cases}`}</Math>
        <p>Найти <Math display={false}>{`\\enfTgt{L}'(\\enfPar{\\delta})`}</Math> при <Math display={false}>{`\\enfPar{\\delta} = 0{,}5`}</Math> и при <Math display={false}>{`\\enfPar{\\delta} = 2`}</Math>.</p>
        <details className="text-sm mt-3">
          <summary className="text-accent cursor-pointer">💡 Подсказка</summary>
          <p className="mt-2 text-muted-foreground">Определи, в какой части кусочной функции находится δ, затем дифференцируй.</p>
        </details>
        <details className="text-sm mt-2">
          <summary className="text-accent cursor-pointer">📝 Решение</summary>
          <div className="mt-2 space-y-2">
            <p className="text-muted-foreground"><Math display={false}>{`\\enfPar{\\delta} = 0{,}5`}</Math>: <Math display={false}>{`|0{,}5| \\le 1`}</Math>, значит <Math display={false}>{`\\enfTgt{L}'(0{,}5) = \\enfPar{\\delta} = 0{,}5`}</Math></p>
            <p className="text-muted-foreground"><Math display={false}>{`\\enfPar{\\delta} = 2`}</Math>: <Math display={false}>{`|2| > 1`}</Math>, значит <Math display={false}>{`\\enfTgt{L}'(2) = \\operatorname{sign}(2) = 1`}</Math></p>
            <p><span className="inline-block px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-sm font-bold">Ответ: L'(0,5) = 0,5 ; L'(2) = 1</span></p>
            <p className="text-muted-foreground text-xs mt-1">MSE даёт градиент δ = 2, Хаббер — только 1. Ограниченный градиент = стабильное обучение DQN.</p>
          </div>
        </details>
      </PracticeTask>

      <RLBox title="🔗 Chain Rule = Backpropagation">
        <p>При обучении нейросети политики <Math display={false}>{`\\pi_\\theta(a \\mid \\enfVar{s})`}</Math> обновляем каждый вес через цепочку:</p>
        <Math>{`\\frac{\\partial \\enfTgt{L}}{\\partial \\enfPar{w}_1} = \\frac{\\partial \\enfTgt{L}}{\\partial \\enfVar{y}_n} \\cdot \\frac{\\partial \\enfVar{y}_n}{\\partial \\enfVar{y}_{n-1}} \\cdot \\ldots \\cdot \\frac{\\partial \\enfVar{y}_1}{\\partial \\enfPar{w}_1}`}</Math>
        <p className="text-sm">Huber Loss вместо MSE ограничивает градиенты при больших TD-ошибках — это и есть gradient clipping «по-умному».</p>
      </RLBox>

      <CyberCodeBlock language="python" filename="derivatives_chain_rule.py">
{`import numpy as np

# ── Численное дифференцирование (центральная разность) ──
def derivative(f, x, h=1e-7):
    return (f(x + h) - f(x - h)) / (2 * h)

# Проверка задач
tests = [
    ('2.1: 3x⁴-5x²+2x-7',
     lambda x: 3*x**4 - 5*x**2 + 2*x - 7,
     lambda x: 12*x**3 - 10*x + 2, 2.0),
    ('2.2: e^(-x²)',
     lambda x: np.exp(-x**2),
     lambda x: -2*x*np.exp(-x**2), 1.0),
    ('2.3: σ(x)',
     lambda x: 1/(1 + np.exp(-x)),
     lambda x: (1/(1+np.exp(-x))) * (1 - 1/(1+np.exp(-x))), 0.0),
]

for name, f, f_anal, x0 in tests:
    anal = f_anal(x0)
    num  = derivative(f, x0)
    ok   = "✓" if abs(anal - num) < 1e-5 else "✗"
    print(f'{name}: аналит.={anal:.6f}, числен.={num:.6f} {ok}')

# ── Chain Rule в backpropagation политики ──
s, w, b = 0.5, 1.2, -0.3
sigma = lambda z: 1/(1 + np.exp(-z))
z  = w * s + b
pi = sigma(z)
dL_dw_analytic = -(1 - pi) * s
dL_dw_numeric  = derivative(lambda w_: -np.log(sigma(w_*s + b)), w)
print(f'\\ndL/dw (аналит.) = {dL_dw_analytic:.6f}')
print(f'dL/dw (числен.) = {dL_dw_numeric:.6f}')`}
      </CyberCodeBlock>
    </Section>

    {/* ═══ СЕКЦИЯ 2: Частные производные и градиент ═══ */}
    <Section icon={<TrendingUp className="w-5 h-5 text-secondary" />} title="§ 2. Частные производные и градиент">
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-4 mb-3" id="функции-многих-переменных">Функции многих переменных</h3>
      <p>В RL функции почти всегда зависят от многих переменных:</p>
      <ul className="list-disc list-inside space-y-1">
        <li><Math display={false}>{`Q(s, a)`}</Math> — от состояния и действия</li>
        <li><Math display={false}>{`\\enfOp{Q}_\\theta(\\enfVar{s}, a)`}</Math> — от тысяч весов <Math display={false}>{`\\enfPar{\\theta} = (\\enfPar{\\theta}_1, \\enfPar{\\theta}_2, \\ldots, \\enfPar{\\theta}_n)`}</Math> нейросети</li>
      </ul>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="частная-производная">Частная производная</h3>
      <DefinitionBox>
        <p><strong className="text-foreground">Частная производная</strong> <Math display={false}>{`\\partial \\enfFun{f} / \\partial \\enfVar{x}_i`}</Math> — скорость изменения <Math display={false}>{`f`}</Math> по переменной <Math display={false}>{`\\enfVar{x}_i`}</Math> при фиксированных остальных.</p>
        <p className="text-sm mt-2"><strong className="text-primary">Правило:</strong> Фиксируй все переменные кроме <Math display={false}>{`\\enfVar{x}_i`}</Math> и дифференцируй как обычно.</p>
      </DefinitionBox>

      <div className="my-6 p-4 rounded-lg bg-card/60 border border-primary/20">
        <p className="font-semibold text-foreground mb-2">Пример:</p>
        <p><Math display={false}>{`\\enfFun{f}(\\enfVar{x}, \\enfVar{y}) = \\enfVar{x}^2\\enfVar{y} + 3xy^2`}</Math></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li><Math display={false}>{`\\partial \\enfFun{f} / \\partial \\enfVar{x} = 2xy + 3\\enfVar{y}^2`}</Math> <span className="text-primary text-sm">(y фиксировано)</span></li>
          <li><Math display={false}>{`\\partial \\enfFun{f} / \\partial \\enfVar{y} = \\enfVar{x}^2 + 6xy`}</Math> <span className="text-secondary text-sm">(x фиксировано)</span></li>
        </ul>
      </div>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="градиент">Градиент</h3>
      <DefinitionBox>
        <p><strong className="text-foreground">Градиент</strong> <Math display={false}>{`\\nabla \\enfFun{f}(\\enfVar{x})`}</Math> — вектор всех частных производных:</p>
        <Math>{`\\nabla \\enfFun{f} = \\left(\\frac{\\partial \\enfFun{f}}{\\partial \\enfVar{x}_1},\\ \\frac{\\partial \\enfFun{f}}{\\partial \\enfVar{x}_2},\\ \\ldots,\\ \\frac{\\partial \\enfFun{f}}{\\partial \\enfVar{x}_n}\\right)`}</Math>
      </DefinitionBox>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
        <MiniCard icon="📈" title="Направление роста" text="∇f указывает в направление наибольшего роста f" />
        <MiniCard icon="📉" title="Антиградиент" text="−∇f — направление наибольшего убывания" />
        <MiniCard icon="📏" title="Модуль" text="|∇f| — скорость изменения в этом направлении" />
        <MiniCard icon="🎯" title="Экстремум" text="В точке минимума/максимума: ∇f = 0" />
      </div>

      <PracticeTask level="⭐⭐" num="3.1" label="Критические точки" color="primary">
        <p><strong className="text-foreground">Для</strong> <Math display={false}>{`\\enfFun{f}(\\enfVar{x}, \\enfVar{y}) = \\enfVar{x}^3 - 3xy + \\enfVar{y}^3`}</Math> <strong className="text-foreground">найти</strong> <Math display={false}>{`\\nabla \\enfFun{f}`}</Math> и критические точки.</p>
        <details className="text-sm mt-3">
          <summary className="text-primary cursor-pointer">💡 Подсказка</summary>
          <p className="mt-2 text-muted-foreground">Приравняй обе частные производные к 0 и реши систему.</p>
        </details>
        <details className="text-sm mt-2">
          <summary className="text-primary cursor-pointer">📝 Решение</summary>
          <div className="mt-2 space-y-2">
            <p className="text-muted-foreground"><Math display={false}>{`\\partial \\enfFun{f}/\\partial \\enfVar{x} = 3\\enfVar{x}^2 - 3\\enfVar{y} = 0 \\Rightarrow \\enfVar{y} = \\enfVar{x}^2`}</Math></p>
            <p className="text-muted-foreground"><Math display={false}>{`\\partial \\enfFun{f}/\\partial \\enfVar{y} = -3\\enfVar{x} + 3\\enfVar{y}^2 = 0 \\Rightarrow \\enfVar{x} = \\enfVar{y}^2`}</Math></p>
            <p className="text-muted-foreground">Подставляем: <Math display={false}>{`\\enfVar{x} = (\\enfVar{x}^2)^2 = \\enfVar{x}^4 \\Rightarrow \\enfVar{x}(\\enfVar{x}^3 - 1) = 0`}</Math></p>
            <p><span className="inline-block px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-sm font-bold">Ответ: (0,0) — седловая точка; (1,1) — локальный минимум</span></p>
          </div>
        </details>
      </PracticeTask>

      <PracticeTask level="⭐⭐ 🤖" num="3.2" label="Градиент потерь Q-сети" color="accent">
        <p><strong className="text-foreground">Условие.</strong> Линейная аппроксимация Q-функции: <Math display={false}>{`\\enfOp{Q}(\\enfVar{s},a) = \\enfPar{w}_1 \\enfFun{\\varphi}_1 + \\enfPar{w}_2 \\enfFun{\\varphi}_2`}</Math></p>
        <p>MSE-потеря: <Math display={false}>{`\\enfTgt{L}(\\enfPar{w}_1, \\enfPar{w}_2) = (\\enfVar{y} - \\enfPar{w}_1 \\enfVar{x}_1 - \\enfPar{w}_2 \\enfVar{x}_2)^2`}</Math></p>
        <p>При <Math display={false}>{`\\enfVar{x}_1=2, \\enfVar{x}_2=3, \\enfVar{y}=10, \\enfPar{w}_1=1, \\enfPar{w}_2=2`}</Math>. Найти <Math display={false}>{`\\nabla \\enfTgt{L}`}</Math> и шаг обновления (<Math display={false}>{`\\enfPar{\\alpha} = 0.01`}</Math>).</p>
        <details className="text-sm mt-3">
          <summary className="text-accent cursor-pointer">📝 Решение</summary>
          <div className="mt-2 space-y-2">
            <p className="text-muted-foreground">Невязка: <Math display={false}>{`\\enfTgt{r} = 10 - 1 \\cdot 2 - 2 \\cdot 3 = 2`}</Math></p>
            <p className="text-muted-foreground"><Math display={false}>{`\\partial \\enfTgt{L} / \\partial \\enfPar{w}_1 = -2 \\cdot 2 \\cdot 2 = -8`}</Math></p>
            <p className="text-muted-foreground"><Math display={false}>{`\\partial \\enfTgt{L} / \\partial \\enfPar{w}_2 = -2 \\cdot 2 \\cdot 3 = -12`}</Math></p>
            <p className="text-muted-foreground"><Math display={false}>{`\\nabla \\enfTgt{L} = (-8, -12)`}</Math></p>
            <p><span className="inline-block px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-sm font-bold">Ответ: <Math display={false}>{`\\enfPar{w}_{\\text{new}} = [1.08,\\; 2.12]`}</Math></span></p>
            <p className="text-muted-foreground text-xs">Этот градиент используется при каждом TD-обновлении в линейном RL!</p>
          </div>
        </details>
      </PracticeTask>

      <RLBox title="🔗 Градиент в Deep RL">
        <p>В DQN с нейросетью параметров <Math display={false}>{`\\enfPar{\\theta} = (\\enfPar{\\theta}_1, \\ldots, \\enfPar{\\theta}_n)`}</Math>:</p>
        <Math>{`\\nabla_\\theta \\enfTgt{L} = \\left(\\frac{\\partial \\enfTgt{L}}{\\partial \\enfPar{\\theta}_1}, \\ldots, \\frac{\\partial \\enfTgt{L}}{\\partial \\enfPar{\\theta}_n}\\right)`}</Math>
        <p className="text-sm">PyTorch считает его автоматически через autograd, но математически — это те же самые частные производные.</p>
      </RLBox>

      <CyberCodeBlock language="python" filename="gradient_mse_loss.py">
{`import numpy as np

# ── Задача 3.2: градиент MSE-потери ──
w1, w2 = 1.0, 2.0
x1, x2, y = 2.0, 3.0, 10.0

residual = y - w1*x1 - w2*x2
loss     = residual**2
gw1      = -2 * x1 * residual
gw2      = -2 * x2 * residual

print(f'Веса:     w = [{w1}, {w2}]')
print(f'Невязка:  r = {residual:.2f}')
print(f'MSE:      L = {loss:.4f}')
print(f'∇L = [{gw1:.4f}, {gw2:.4f}]')
print(f'w_new (α=0.01) = [{w1-0.01*gw1:.4f}, {w2-0.01*gw2:.4f}]')

# ── PyTorch autograd ──
try:
    import torch
    w = torch.tensor([w1, w2], requires_grad=True)
    x = torch.tensor([x1, x2])
    loss_t = (torch.tensor(y) - torch.dot(w, x))**2
    loss_t.backward()
    print(f'\\nPyTorch autograd: ∇L = {w.grad.numpy()}')
except ImportError:
    print('\\n[pip install torch для запуска]')`}
      </CyberCodeBlock>
    </Section>

    {/* ═══ СЕКЦИЯ 3: Градиентный спуск ═══ */}
    <Section icon={<Layers className="w-5 h-5 text-accent" />} title="§ 3. Градиентный спуск и оптимизация">
      <div className="my-4 p-4 rounded-lg bg-card/60 border border-accent/20">
        <p className="text-lg italic text-foreground">🏔️ Вы стоите на горном склоне в тумане. Хотите добраться до долины (минимум), не видя всего рельефа. Нащупываете уклон под ногами (градиент) и делаете шаг в самую крутую сторону вниз (антиградиент), размером α.</p>
      </div>

      <DefinitionBox>
        <Math>{`\\enfPar{\\theta}_{t+1} = \\enfPar{\\theta}_t - \\enfPar{\\alpha} \\cdot \\nabla \\enfTgt{L}(\\enfPar{\\theta}_t)`}</Math>
        <div className="flex flex-wrap gap-4 text-sm mt-3">
          <span><Math display={false}>{`\\enfPar{\\theta}`}</Math> — параметры (веса)</span>
          <span><Math display={false}>{`\\enfPar{\\alpha}`}</Math> — learning rate</span>
          <span><Math display={false}>{`-\\nabla \\enfTgt{L}`}</Math> — антиградиент</span>
        </div>
      </DefinitionBox>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="варианты-градиентного-спуска">Варианты градиентного спуска</h3>
      <div className="my-4 overflow-x-auto">
        <table className="w-full text-sm border border-border/30 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-card/60">
              <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Метод</th>
              <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Данные/шаг</th>
              <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">В RL</th>
              <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Плюс</th>
              <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Минус</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/20"><td className="p-3 font-semibold text-foreground">Batch GD</td><td className="p-3">Весь датасет</td><td className="p-3">Редко</td><td className="p-3">Точный градиент</td><td className="p-3">Медленно</td></tr>
            <tr className="border-b border-border/20"><td className="p-3 font-semibold text-foreground">SGD</td><td className="p-3">1 пример</td><td className="p-3">Онлайн-RL</td><td className="p-3">Быстро</td><td className="p-3">Шумный</td></tr>
            <tr className="border-b border-border/20"><td className="p-3 font-semibold text-foreground">Mini-batch SGD</td><td className="p-3">N примеров</td><td className="p-3">DQN, PPO</td><td className="p-3">Баланс</td><td className="p-3">—</td></tr>
            <tr><td className="p-3 font-semibold text-foreground">Adam</td><td className="p-3">N + моменты</td><td className="p-3">Стандарт RL</td><td className="p-3">Адаптивный шаг</td><td className="p-3">Больше памяти</td></tr>
          </tbody>
        </table>
      </div>

      <details className="my-6 rounded-lg border border-primary/20 bg-card/40">
        <summary className="p-4 font-semibold text-foreground cursor-pointer hover:text-primary">📖 Подробнее про Adam (Adaptive Moment Estimation)</summary>
        <div className="p-4 pt-0 space-y-3">
          <p>Adam хранит два «момента» градиента:</p>
          <Math>{`m_t = \\enfPar{\\beta}_1 m_{t-1} + (1-\\enfPar{\\beta}_1)\\nabla \\enfTgt{L} \\qquad \\text{(скользящее среднее)}`}</Math>
          <Math>{`v_t = \\enfPar{\\beta}_2 v_{t-1} + (1-\\enfPar{\\beta}_2)(\\nabla \\enfTgt{L})^2 \\qquad \\text{(скользящая дисперсия)}`}</Math>
          <p>С коррекцией смещения и обновлением:</p>
          <Math>{`\\enfPar{\\theta}_{t+1} = \\enfPar{\\theta}_t - \\enfPar{\\alpha} \\cdot \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\varepsilon}`}</Math>
          <p className="text-sm"><strong className="text-primary">Типичные значения:</strong> <Math display={false}>{`\\enfPar{\\beta}_1 = 0.9`}</Math>, <Math display={false}>{`\\enfPar{\\beta}_2 = 0.999`}</Math>, <Math display={false}>{`\\varepsilon = 10^{-8}`}</Math></p>
        </div>
      </details>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="проблемы-и-решения">Проблемы и решения</h3>
      <div className="my-4 overflow-x-auto">
        <table className="w-full text-sm border border-border/30 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-card/60">
              <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Проблема</th>
              <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Симптом</th>
              <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Решение</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/20"><td className="p-3">Слишком большой α</td><td className="p-3">Потеря растёт / расходимость</td><td className="p-3">Уменьшить α</td></tr>
            <tr className="border-b border-border/20"><td className="p-3">Слишком малый α</td><td className="p-3">Обучение не сходится</td><td className="p-3">Увеличить α</td></tr>
            <tr className="border-b border-border/20"><td className="p-3">Локальный минимум</td><td className="p-3">Застрял на плохом решении</td><td className="p-3">SGD + шум, рестарт</td></tr>
            <tr className="border-b border-border/20"><td className="p-3">Взрывной градиент</td><td className="p-3">NaN в весах</td><td className="p-3">Gradient clipping</td></tr>
            <tr><td className="p-3">Затухающий градиент</td><td className="p-3">Нет обучения в глубоких сетях</td><td className="p-3">Residual connections, нормировка</td></tr>
          </tbody>
        </table>
      </div>

      <PracticeTask level="⭐" num="4.1" label="Ручной градиентный спуск" color="primary">
        <p><strong className="text-foreground">Выполнить 3 шага GD</strong> (<Math display={false}>{`\\enfPar{\\alpha} = 0.1`}</Math>) для <Math display={false}>{`\\enfFun{f}(\\enfVar{x}) = \\enfVar{x}^2 - 4\\enfVar{x} + 5`}</Math>, начиная с <Math display={false}>{`\\enfVar{x}_0 = 0`}</Math>.</p>
        <p className="text-sm text-muted-foreground"><Math display={false}>{`f'(x) = 2x - 4`}</Math></p>
        <details className="text-sm mt-3">
          <summary className="text-primary cursor-pointer">📝 Решение</summary>
          <div className="mt-2 overflow-x-auto">
            <table className="text-sm border border-border/30 rounded overflow-hidden">
              <thead><tr className="bg-card/60">
                <th className="p-2 text-foreground">Шаг</th><th className="p-2 text-foreground"><Math display={false}>{`\\enfVar{x}_t`}</Math></th><th className="p-2 text-foreground"><Math display={false}>{`\\enfFun{f}'(\\enfVar{x}_t)`}</Math></th><th className="p-2 text-foreground"><Math display={false}>{`\\enfVar{x}_{t+1}`}</Math></th>
              </tr></thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/20"><td className="p-2">0</td><td className="p-2">0.000</td><td className="p-2">−4.000</td><td className="p-2">0.400</td></tr>
                <tr className="border-b border-border/20"><td className="p-2">1</td><td className="p-2">0.400</td><td className="p-2">−3.200</td><td className="p-2">0.720</td></tr>
                <tr><td className="p-2">2</td><td className="p-2">0.720</td><td className="p-2">−2.560</td><td className="p-2">0.976</td></tr>
              </tbody>
            </table>
            <p className="mt-2">Минимум <Math display={false}>{`f'(x)=0`}</Math> → <Math display={false}>{`\\enfVar{x}^* = 2.0`}</Math>. Мы движемся верно!</p>
          </div>
        </details>
      </PracticeTask>

      <PracticeTask level="⭐⭐ 🤖" num="4.2" label="Обновление весов Q-сети" color="accent">
        <p><strong className="text-foreground">Условие.</strong> Линейная Q-сеть: <Math display={false}>{`\\enfOp{Q}_\\theta(\\enfVar{s},a) = \\enfPar{\\theta}^\\top \\enfFun{\\varphi}`}</Math></p>
        <p><Math display={false}>{`\\enfFun{\\varphi} = [1, 0.5]`}</Math>, <Math display={false}>{`\\enfPar{\\theta} = [2, 3]`}</Math>, TD-цель = 5, <Math display={false}>{`\\enfPar{\\alpha} = 0.01`}</Math></p>
        <details className="text-sm mt-3">
          <summary className="text-accent cursor-pointer">📝 Решение</summary>
          <div className="mt-2 space-y-2">
            <p className="text-muted-foreground"><Math display={false}>{`\\enfOp{Q} = \\enfPar{\\theta}^\\top \\enfFun{\\varphi} = 2 \\cdot 1 + 3 \\cdot 0.5 = 3.5`}</Math></p>
            <p className="text-muted-foreground"><Math display={false}>{`\\enfPar{\\delta} = 5 - 3.5 = 1.5`}</Math> (TD-ошибка)</p>
            <p className="text-muted-foreground"><Math display={false}>{`\\partial \\enfTgt{L} / \\partial \\enfPar{\\theta} = -2\\enfPar{\\delta} \\cdot \\enfFun{\\varphi} = [-3, -1.5]`}</Math></p>
            <p><span className="inline-block px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-sm font-bold">Ответ: <Math display={false}>{`\\enfPar{\\theta}_{\\text{new}} = [2.03,\\; 3.015]`}</Math></span></p>
            <p className="text-muted-foreground text-xs"><Math display={false}>{`\\enfOp{Q}_{\\text{new}} = 2.03 + 3.015 \\cdot 0.5 = 3.54 > 3.5`}</Math> ✓ — Q приблизилось к цели!</p>
          </div>
        </details>
      </PracticeTask>

      <CyberCodeBlock language="python" filename="gradient_descent_comparison.py">
{`import numpy as np

# ── Три оптимизатора для f(x) = x² − 4x + 5, минимум x* = 2 ──
f      = lambda x: x**2 - 4*x + 5
f_grad = lambda x: 2*x - 4

def run_gd(x0, alpha, n=40):
    x, hist = x0, [x0]
    for _ in range(n):
        x -= alpha * f_grad(x)
        hist.append(x)
    return hist

def run_adam(x0, alpha=0.3, b1=0.9, b2=0.999, eps=1e-8, n=40):
    x, m, v, hist = x0, 0.0, 0.0, [x0]
    for t in range(1, n+1):
        g = f_grad(x)
        m = b1*m + (1-b1)*g
        v = b2*v + (1-b2)*g**2
        mh = m / (1 - b1**t)
        vh = v / (1 - b2**t)
        x -= alpha * mh / (np.sqrt(vh) + eps)
        hist.append(x)
    return hist

hist_gd   = run_gd(0.0, alpha=0.1)
hist_adam  = run_adam(0.0, alpha=0.3)

print('GD  (40 шагов):', f'x={hist_gd[-1]:.6f},  |err|={abs(hist_gd[-1]-2):.2e}')
print('Adam(40 шагов):', f'x={hist_adam[-1]:.6f}, |err|={abs(hist_adam[-1]-2):.2e}')

# ── Влияние learning rate ──
for alpha in [0.01, 0.1, 0.5, 1.05]:
    h = run_gd(0.0, alpha=alpha, n=25)
    warn = ' ⚠ РАСХОДИТСЯ!' if abs(h[-1] - 2) > 10 else ''
    print(f'α={alpha}: x_25={h[-1]:.4f}{warn}')`}
      </CyberCodeBlock>
    </Section>

    {/* ═══ СЕКЦИЯ 4: Policy Gradient ═══ */}
    <Section icon={<BarChart3 className="w-5 h-5 text-primary" />} title="§ 4. Применение в RL: Policy Gradient">
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-4 mb-3" id="задача-оптимизации-политики">Задача оптимизации политики</h3>
      <p>В RL цель — максимизировать суммарное вознаграждение:</p>
      <Math>{`\\enfTgt{J}(\\enfPar{\\theta}) = \\mathbb{E}_{\\pi_\\theta}\\!\\left[\\sum_{t=0}^{\\infty} \\gamma^t \\enfTgt{r}_t\\right]`}</Math>
      <p>Мы применяем <strong className="text-primary">градиентный подъём</strong> (знак «+», а не «−»!):</p>
      <Math>{`\\enfPar{\\theta} \\leftarrow \\enfPar{\\theta} + \\enfPar{\\alpha} \\cdot \\nabla \\enfTgt{J}(\\enfPar{\\theta})`}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="теорема-о-градиенте-политики">Теорема о градиенте политики</h3>
      <div className="my-4 p-5 rounded-lg border-2 border-secondary/40 bg-secondary/5">
        <Math>{`\\nabla \\enfTgt{J}(\\enfPar{\\theta}) = \\mathbb{E}_{\\pi_\\theta}\\!\\left[\\nabla \\log \\pi_\\theta(a \\mid \\enfVar{s}) \\cdot \\enfOp{Q}^{\\pi}(\\enfVar{s},a)\\right]`}</Math>
        <ul className="list-disc list-inside mt-4 space-y-1 text-sm">
          <li><Math display={false}>{`\\pi_\\theta(a \\mid \\enfVar{s})`}</Math> — вероятность выбрать действие <Math display={false}>{`a`}</Math> в состоянии <Math display={false}>{`s`}</Math></li>
          <li><Math display={false}>{`\\nabla \\log \\pi_\\theta(a \\mid \\enfVar{s})`}</Math> — «насколько θ влияет на вероятность этого действия»</li>
          <li><Math display={false}>{`\\enfOp{Q}^\\pi(\\enfVar{s},a)`}</Math> — насколько хорошим оказалось действие <Math display={false}>{`a`}</Math></li>
        </ul>
      </div>

      <div className="my-4 p-4 rounded-lg bg-card/60 border border-primary/20">
        <p className="text-lg italic text-foreground">📖 <strong>Смысл:</strong> Увеличиваем вероятность хороших действий, уменьшаем — плохих.</p>
      </div>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="td-ошибка-как-стохастический-градиент">TD-ошибка как стохастический градиент</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="p-4 rounded-lg bg-card/60 border border-primary/20">
          <p className="text-sm font-semibold text-primary mb-1">TD-обновление:</p>
          <Math>{`\\enfOp{V}(\\enfVar{s}) \\leftarrow \\enfOp{V}(\\enfVar{s}) + \\enfPar{\\alpha} \\underbrace{[\\enfTgt{r} + \\gamma \\enfOp{V}(\\enfVar{s}') - \\enfOp{V}(\\enfVar{s})]}_{\\delta\\ =\\ \\text{TD-ошибка}}`}</Math>
        </div>
        <div className="p-4 rounded-lg bg-card/60 border border-secondary/20">
          <p className="text-sm font-semibold text-secondary mb-1">SGD-обновление:</p>
          <Math>{`\\enfPar{\\theta} \\leftarrow \\enfPar{\\theta} - \\enfPar{\\alpha} \\cdot \\frac{\\partial \\enfTgt{L}}{\\partial \\enfPar{\\theta}}`}</Math>
        </div>
      </div>
      <p><strong className="text-foreground">TD-обновление ≡ шаг SGD по потере Беллмана.</strong> Математически — одно и то же!</p>

      <PracticeTask level="⭐⭐⭐ 🤖" num="5.1" label="Шаг REINFORCE" color="accent">
        <p><strong className="text-foreground">Условие.</strong> Политика: <Math display={false}>{`\\pi_\\theta(a=1 \\mid \\enfVar{s}) = \\enfFun{\\sigma}(\\enfPar{\\theta} \\enfVar{s})`}</Math>. <Math display={false}>{`\\enfPar{\\theta} = 0.5`}</Math>, <Math display={false}>{`s = 1`}</Math>. Агент выбрал <Math display={false}>{`a=1`}</Math>, получил <Math display={false}>{`r = 2`}</Math>. Выполнить один шаг REINFORCE (<Math display={false}>{`\\enfPar{\\alpha} = 0.1`}</Math>).</p>
        <details className="text-sm mt-3">
          <summary className="text-accent cursor-pointer">📝 Пошаговое решение</summary>
          <div className="mt-2 space-y-3">
            <p className="text-muted-foreground"><strong className="text-foreground">1.</strong> Вычислить π: <Math display={false}>{`\\enfFun{\\sigma}(0.5 \\cdot 1) = \\enfFun{\\sigma}(0.5) \\approx 0.6225`}</Math></p>
            <p className="text-muted-foreground"><strong className="text-foreground">2.</strong> Вычислить <Math display={false}>{`\\nabla \\log \\pi`}</Math>: <Math display={false}>{`(1 - \\pi) \\cdot \\enfVar{s} = (1 - 0.6225) \\cdot 1 = 0.3775`}</Math></p>
            <p className="text-muted-foreground"><strong className="text-foreground">3.</strong> Градиент: <Math display={false}>{`\\nabla \\enfTgt{J}(\\enfPar{\\theta}) = \\enfTgt{r} \\cdot \\nabla \\log \\pi = 2 \\cdot 0.3775 = 0.755`}</Math></p>
            <p className="text-muted-foreground"><strong className="text-foreground">4.</strong> Обновление: <Math display={false}>{`\\enfPar{\\theta}_{\\text{new}} = 0.5 + 0.1 \\cdot 0.755 = 0.5755`}</Math></p>
            <p><span className="inline-block px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-sm font-bold">Проверка: <Math display={false}>{`\\pi_{\\text{new}} = \\enfFun{\\sigma}(0.5755) \\approx 0.640 > 0.622`}</Math> ✓</span></p>
            <p className="text-muted-foreground text-xs">Вероятность хорошего действия выросла — агент учится!</p>
          </div>
        </details>
      </PracticeTask>

      <CyberCodeBlock language="python" filename="reinforce_bandit.py">
{`import numpy as np

# ── REINFORCE: однослойная политика на bandit-задаче ──
class REINFORCEBandit:
    def __init__(self, theta=0.0, alpha=0.05):
        self.theta, self.alpha = theta, alpha
    
    def sigmoid(self, x):
        return 1.0 / (1.0 + np.exp(-np.clip(x, -15, 15)))
    
    def pi(self, s=1.0):
        return self.sigmoid(self.theta * s)
    
    def act(self, s=1.0):
        return 1 if np.random.rand() < self.pi(s) else 0
    
    def update(self, s, a, reward):
        pi = self.pi(s)
        grad_log_pi = s*(1-pi) if a == 1 else -s*pi
        self.theta += self.alpha * reward * grad_log_pi

np.random.seed(7)
agent = REINFORCEBandit(theta=0.0, alpha=0.05)
REWARDS = {0: -1.0, 1: 2.0}

for ep in range(300):
    a = agent.act(1.0)
    r = REWARDS[a] + 0.5 * np.random.randn()
    agent.update(1.0, a, r)

print(f'После 300 эпизодов:')
print(f'  θ = {agent.theta:.4f}')
print(f'  π(a=1|s=1) = {agent.pi(1.0):.4f}  (→ 1.0)')

# ── TD(0) как SGD по потере Беллмана ──
V = np.zeros(5)
alpha, gamma = 0.05, 0.95
for _ in range(1000):
    s = 0
    while s < 4:
        s_next = s + 1
        r = 1.0 if s_next == 4 else 0.0
        V[s] += alpha * (r + gamma * V[s_next] - V[s])
        s = s_next

V_true = np.array([0.95**4, 0.95**3, 0.95**2, 0.95, 1.0])
print(f'\\nV оценённое: {np.round(V, 4)}')
print(f'V истинное:  {np.round(V_true, 4)}')`}
      </CyberCodeBlock>
    </Section>

    {/* ═══ СЕКЦИЯ 5: Итоги ═══ */}
    <Section icon={<Lightbulb className="w-5 h-5 text-primary" />} title="§ 5. Весь раздел в одной картине">
      <RLBox title="🎯 Как всё связано">
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-lg">⏩</span>
            <p><strong className="text-foreground">Пределы</strong> → сходимость алгоритмов (Q-learning сходится при <Math display={false}>{`\\sum \\enfPar{\\alpha}_t = \\infty`}</Math>, <Math display={false}>{`\\sum \\enfPar{\\alpha}_t^2 < \\infty`}</Math>)</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">∂</span>
            <p><strong className="text-foreground">Производные</strong> → backpropagation через нейросети политики и ценности</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">∇</span>
            <p><strong className="text-foreground">Градиент</strong> → направление улучшения весов θ в пространстве параметров</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">⬇</span>
            <p><strong className="text-foreground">Градиентный спуск</strong> → обновление θ в DQN, PPO, SAC, TD3 на каждом батче</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">π</span>
            <p><strong className="text-foreground">Policy Gradient</strong> → REINFORCE, A2C, PPO, SAC — все современные алгоритмы</p>
          </div>
        </div>
      </RLBox>

      <div className="my-8 p-6 rounded-xl border-2 border-green-500/30 bg-green-500/5">
        <h3 className="scroll-mt-28 text-lg font-bold text-foreground mb-4" id="что-вы-изучили-в-этом-разделе">✅ Что вы изучили в этом разделе</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Вычислять пределы последовательностей и понимать их связь со сходимостью RL</li>
          <li>Находить производные функций и применять правило цепочки (Chain Rule)</li>
          <li>Вычислять градиент функции многих переменных</li>
          <li>Применять градиентный спуск (GD, SGD, Adam) для минимизации функций потерь</li>
          <li>Понимать теорему о градиенте политики и алгоритм REINFORCE</li>
        </ul>
      </div>
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

const DefinitionBox = ({ children }: { children: React.ReactNode }) => (
  <div className="my-4 p-4 rounded-lg border-l-4 border-primary bg-card/80">
    {children}
  </div>
);

const MiniCard = ({ icon, title, text }: { icon: string; title: string; text: string }) => (
  <div className="p-4 rounded-lg bg-card/60 border border-border/30 text-center">
    <span className="text-2xl">{icon}</span>
    <h4 className="text-sm font-semibold text-foreground mt-2">{title}</h4>
    <p className="text-xs text-muted-foreground mt-1">{text}</p>
  </div>
);

const PracticeTask = ({ level, num, label, color, children }: {
  level: string; num: string; label: string; color: "primary" | "secondary" | "accent"; children: React.ReactNode;
}) => {
  const borderColor = color === "primary" ? "border-primary/20" : color === "secondary" ? "border-secondary/20" : "border-accent/20";
  const textColor = color === "primary" ? "text-primary" : color === "secondary" ? "text-secondary" : "text-accent";
  const bgColor = color === "primary" ? "bg-primary/10" : color === "secondary" ? "bg-secondary/10" : "bg-accent/10";
  return (
    <div className={`my-6 p-5 rounded-lg bg-card/60 border ${borderColor} space-y-3`}>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold ${textColor} px-2 py-0.5 rounded ${bgColor}`}>{level} Задача {num}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      {children}
    </div>
  );
};

const RLBox = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="my-6 p-5 rounded-lg bg-gradient-to-r from-secondary/5 to-primary/5 border border-secondary/20">
    <h4 className="font-bold text-foreground mb-3">{title}</h4>
    <div className="text-muted-foreground space-y-2">{children}</div>
  </div>
);

export default Part1bCalculus;
