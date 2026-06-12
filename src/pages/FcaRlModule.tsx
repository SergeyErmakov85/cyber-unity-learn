import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Shapes, Grid3X3, GitBranch, Brain, Wrench, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import HubLessonBadges from "@/components/HubLessonBadges";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import Math from "@/components/Math";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/landing/Navbar";
import ScrollProgressBar from "@/components/ScrollProgressBar";

const FcaRlModule = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <ScrollProgressBar />
      <div className="min-h-screen bg-background">
        <SEOHead
          title="FCA + RL — Формальный анализ концептов | Neon Unity Neural"
          description="Формальный Анализ Понятий (FCA) для анализа гиперпараметров, архитектур и пространства состояний RL-агентов."
        />

        {/* Header */}
        <div className="border-b border-border/50 bg-card/80 backdrop-blur-md pt-20">
          <div className="container mx-auto px-4 py-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground mb-3 -ml-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> На главную
            </Button>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400">
                FCA + RL
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold">
              <span className="bg-gradient-neon bg-clip-text text-transparent">
                Formal Concept Analysis + RL
              </span>
            </h1>
            <p className="text-muted-foreground mt-2 max-w-3xl">
              Формальный анализ понятий — математический аппарат для структурирования знаний
              об экспериментах, архитектурах и поведении RL-агентов.
            </p>
          </div>
        </div>

        {/* Content with sticky sidebar */}
        <div className="container mx-auto px-4 py-12 flex gap-8">
          {/* Sticky TOC sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-[260px]">
              <Card className="bg-card/60 backdrop-blur-sm border-yellow-500/20">
                <CardContent className="p-5">
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-yellow-400" />
                    Содержание
                  </h2>
                  <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
                    <li><a href="#fca-basics" className="text-yellow-400 hover:underline">Основы FCA</a></li>
                    <li><a href="#lattices" className="text-yellow-400 hover:underline">Решётки понятий</a></li>
                    <li><a href="#fca-hyperparams" className="text-yellow-400 hover:underline">FCA для гиперпараметров</a></li>
                    <li><a href="#fca-architecture" className="text-yellow-400 hover:underline">FCA для архитектуры</a></li>
                    <li><a href="#fca-practice" className="text-yellow-400 hover:underline">Практика: FCA + PPO</a></li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 max-w-4xl space-y-16">

            {/* Section 1: Основы FCA */}
            <section id="fca-basics" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <Grid3X3 className="h-7 w-7 text-yellow-400" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">1. Основы FCA</h2>
              </div>
              <HubLessonBadges hubPath="/fca-rl" hubAnchor="fca-basics" />
              <Card className="border-yellow-500/20 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    <strong className="text-foreground">Формальный Анализ Понятий (Formal Concept Analysis)</strong> —
                    математический метод для извлечения иерархической структуры из табличных данных.
                    Он позволяет найти группы объектов, разделяющих общие признаки, и выстроить эти группы
                    в иерархию от общего к частному.
                  </p>

                  <p>
                    Центральная конструкция — <strong className="text-foreground">формальный контекст</strong>,
                    задаваемый тройкой:
                  </p>

                  <Math>{`\\mathbb{K} = (G,\\, M,\\, I)`}</Math>

                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong className="text-foreground">G</strong> — множество объектов (эксперименты, конфигурации, состояния)</li>
                    <li><strong className="text-foreground">M</strong> — множество признаков (свойства, атрибуты)</li>
                    <li><strong className="text-foreground">I ⊆ G × M</strong> — отношение инциденции: «объект g обладает признаком m»</li>
                  </ul>

                  <p>
                    <strong className="text-foreground">Замыкание Галуа</strong> определяет пару операторов:
                  </p>

                  <Math>{`A' = \\{m \\in M \\mid \\forall g \\in A:\\, (g, m) \\in I\\}`}</Math>
                  <Math>{`B' = \\{g \\in G \\mid \\forall m \\in B:\\, (g, m) \\in I\\}`}</Math>

                  <p>
                    <strong className="text-foreground">Формальное понятие</strong> — пара (A, B), где A' = B и B' = A.
                    Множество A называется <em>объёмом</em>, B — <em>содержанием</em> понятия (<CrossLinkToLesson lessonId="3-7" lessonPath="/courses/3-7" lessonTitle="Архитектуры нейросетей через FCA" lessonLevel={3} />).
                    Если объект не подтверждает правило, он является <strong className="text-foreground">контрпримером</strong>.
                  </p>

                  <p className="text-sm text-muted-foreground/80 italic">
                    Пример формального контекста: строки — конфигурации обучения, столбцы — наблюдаемые свойства.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-border/50">
                      <thead>
                        <tr className="bg-card/80">
                          <th className="border border-border/50 px-3 py-2 text-foreground text-left">Конфигурация</th>
                          <th className="border border-border/50 px-3 py-2 text-foreground text-center">Быстрая сх.</th>
                          <th className="border border-border/50 px-3 py-2 text-foreground text-center">Стабильно</th>
                          <th className="border border-border/50 px-3 py-2 text-foreground text-center">Высокий R</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td className="border border-border/50 px-3 py-2">cfg_1</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">✕</td></tr>
                        <tr><td className="border border-border/50 px-3 py-2">cfg_2</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">·</td><td className="border border-border/50 px-3 py-2 text-center">✕</td></tr>
                        <tr><td className="border border-border/50 px-3 py-2">cfg_3</td><td className="border border-border/50 px-3 py-2 text-center">·</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">·</td></tr>
                        <tr><td className="border border-border/50 px-3 py-2">cfg_4</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">·</td></tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 2: Решётки понятий */}
            <section id="lattices" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <GitBranch className="h-7 w-7 text-yellow-400" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">2. Решётки понятий</h2>
              </div>
              <HubLessonBadges hubPath="/fca-rl" hubAnchor="lattices" />
              <Card className="border-yellow-500/20 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Все формальные понятия, упорядоченные по включению объёмов, образуют
                    <strong className="text-foreground"> решётку понятий (concept lattice)</strong>.
                    Это полная решётка, в которой для любых двух понятий существует
                    супремум (наименьшее общее) и инфимум (наибольшее общее).
                  </p>

                  <p>
                    Визуализируется решётка в виде <strong className="text-foreground">диаграммы Хассе</strong> —
                    графа, где узлы — понятия, а рёбра — отношение «обобщение → специализация».
                    Верхний узел содержит все объекты и пустое содержание. Нижний — пустой объём и все признаки.
                  </p>

                  <div className="bg-background/50 border border-border/30 rounded-lg p-6 text-center font-mono text-sm">
                    <pre className="inline-block text-left text-muted-foreground">
{`           (⊤)
          /    \\
    {быстрая}  {стабильно}
       |    \\   /    |
  {б,выс.R}  {б,ст}  {ст,выс.R}
        \\     |     /
         {б,ст,выс.R}
              |
            (⊥)`}
                    </pre>
                  </div>

                  <p>
                    Каждый узел решётки представляет уникальную комбинацию свойств, разделяемую
                    подмножеством конфигураций. Это позволяет находить «сладкие пятна» —
                    конфигурации, сочетающие желаемые свойства.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Section 3: FCA для анализа гиперпараметров */}
            <section id="fca-hyperparams" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <Shapes className="h-7 w-7 text-yellow-400" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">3. FCA для анализа гиперпараметров RL</h2>
              </div>
              <HubLessonBadges hubPath="/fca-rl" hubAnchor="fca-hyperparams" />

              <Card className="border-yellow-500/20 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    При подборе гиперпараметров PPO мы проводим множество экспериментов.
                    FCA позволяет извлечь структуру из таблицы результатов, не прибегая к ручному анализу.
                  </p>

                  <p>
                    <strong className="text-foreground">Формальный контекст</strong> строится так:
                    строки — конфигурации (lr, batch_size, clip_range), столбцы — бинаризованные свойства
                    результатов: «сходится за {'<'} 500k шагов», «reward {'>'} 20», «policy loss {'<'} 0.01» и т.д.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-border/50">
                      <thead>
                        <tr className="bg-card/80">
                          <th className="border border-border/50 px-3 py-2 text-foreground text-left">PPO Config</th>
                          <th className="border border-border/50 px-3 py-2 text-foreground text-center">Сход. {'<'}500k</th>
                          <th className="border border-border/50 px-3 py-2 text-foreground text-center">R{'>'}20</th>
                          <th className="border border-border/50 px-3 py-2 text-foreground text-center">PL{'<'}0.01</th>
                          <th className="border border-border/50 px-3 py-2 text-foreground text-center">Стабильно</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td className="border border-border/50 px-3 py-2">lr=3e-4, bs=64</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">·</td><td className="border border-border/50 px-3 py-2 text-center">✕</td></tr>
                        <tr><td className="border border-border/50 px-3 py-2">lr=1e-3, bs=128</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">·</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">·</td></tr>
                        <tr><td className="border border-border/50 px-3 py-2">lr=3e-4, bs=256</td><td className="border border-border/50 px-3 py-2 text-center">·</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">✕</td></tr>
                        <tr><td className="border border-border/50 px-3 py-2">lr=5e-4, bs=64</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">·</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <CyberCodeBlock language="python" filename="fca_hyperparams.py">
{`from concepts import Context

objects = ['lr=3e-4_bs=64', 'lr=1e-3_bs=128', 'lr=3e-4_bs=256', 'lr=5e-4_bs=64']
attributes = ['fast_convergence', 'high_reward', 'low_policy_loss', 'stable']

table = [
    (1, 1, 0, 1),  # lr=3e-4, bs=64
    (1, 0, 1, 0),  # lr=1e-3, bs=128
    (0, 1, 1, 1),  # lr=3e-4, bs=256
    (1, 1, 1, 0),  # lr=5e-4, bs=64
]

ctx = Context(objects, attributes, table)
lattice = ctx.lattice

print(f"Всего понятий: {len(lattice)}")
for concept in lattice:
    print(f"  Объём: {concept.extent}")
    print(f"  Содержание: {concept.intent}")
    print()`}
                  </CyberCodeBlock>

                  <p>
                    Решётка покажет, какие конфигурации разделяют свойства «быстрая сходимость + стабильность»,
                    а какие — «высокий reward, но нестабильно» (<CrossLinkToLesson lessonId="3-6" lessonPath="/courses/3-6" lessonTitle="Оптимизация гиперпараметров" lessonLevel={3} />). Это позволяет принимать
                    обоснованные решения при выборе финальных гиперпараметров.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Section 4: FCA для проектирования архитектуры */}
            <section id="fca-architecture" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <Brain className="h-7 w-7 text-yellow-400" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">4. FCA для проектирования архитектуры</h2>
              </div>
              <HubLessonBadges hubPath="/fca-rl" hubAnchor="fca-architecture" />

              <Card className="border-yellow-500/20 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    При выборе архитектуры нейросети для RL-задачи (<CrossLinkToLesson lessonId="3-7" lessonPath="/courses/3-7" lessonTitle="Архитектуры нейросетей через FCA" lessonLevel={3} />) мы можем построить формальный контекст,
                    где объекты — архитектуры (MLP, CNN, LSTM, Transformer), а признаки — свойства задач,
                    в которых эта архитектура показала лучшие результаты.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-border/50">
                      <thead>
                        <tr className="bg-card/80">
                          <th className="border border-border/50 px-3 py-2 text-foreground text-left">Архитектура</th>
                          <th className="border border-border/50 px-3 py-2 text-foreground text-center">Визуальный вход</th>
                          <th className="border border-border/50 px-3 py-2 text-foreground text-center">Последоват.</th>
                          <th className="border border-border/50 px-3 py-2 text-foreground text-center">Малое прост.</th>
                          <th className="border border-border/50 px-3 py-2 text-foreground text-center">Multi-agent</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td className="border border-border/50 px-3 py-2 font-medium text-foreground">MLP</td><td className="border border-border/50 px-3 py-2 text-center">·</td><td className="border border-border/50 px-3 py-2 text-center">·</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">✕</td></tr>
                        <tr><td className="border border-border/50 px-3 py-2 font-medium text-foreground">CNN</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">·</td><td className="border border-border/50 px-3 py-2 text-center">·</td><td className="border border-border/50 px-3 py-2 text-center">·</td></tr>
                        <tr><td className="border border-border/50 px-3 py-2 font-medium text-foreground">LSTM</td><td className="border border-border/50 px-3 py-2 text-center">·</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">·</td><td className="border border-border/50 px-3 py-2 text-center">✕</td></tr>
                        <tr><td className="border border-border/50 px-3 py-2 font-medium text-foreground">Transformer</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">✕</td><td className="border border-border/50 px-3 py-2 text-center">·</td><td className="border border-border/50 px-3 py-2 text-center">✕</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <p>
                    Решётка покажет: CNN и Transformer объединяются по признаку «визуальный вход»,
                    LSTM и Transformer — по «последовательные данные». MLP остаётся в кластере
                    «малое пространство + простота», что подтверждает его роль как baseline-архитектуры.
                  </p>

                  <div className="bg-background/50 border border-border/30 rounded-lg p-6 text-center font-mono text-sm">
                    <pre className="inline-block text-left text-muted-foreground">
{`              (⊤) все архитектуры
             /    \\
      {визуал.}    {последов.}
       /    \\        /    \\
    CNN  Transf.  LSTM  Transf.
       \\    |      |    /
        {визуал. + последов.}
              = Transformer
              |
        {малое прост.}
           = MLP
              |
            (⊥)`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 5: Практика FCA + PPO */}
            <section id="fca-practice" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3">
                <Wrench className="h-7 w-7 text-yellow-400" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">5. Практика: FCA + PPO</h2>
              </div>
              <HubLessonBadges hubPath="/fca-rl" hubAnchor="fca-practice" />

              <Card className="border-yellow-500/20 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Разберём пошагово, как применить FCA для анализа обученного PPO-агента
                    в среде FoodCollector.
                  </p>

                  <h3 className="text-lg font-semibold text-foreground">Шаг 1. Сбор данных экспериментов</h3>
                  <p>
                    Проводим N запусков с различными гиперпараметрами. Для каждого запуска
                    фиксируем метрики и бинаризуем их по пороговым значениям.
                  </p>

                  <CyberCodeBlock language="python" filename="step1_collect.py">
{`import pandas as pd

# Результаты экспериментов
runs = pd.DataFrame({
    'run':    ['run_1', 'run_2', 'run_3', 'run_4', 'run_5'],
    'lr':     [3e-4,    1e-3,    3e-4,    5e-4,    1e-4],
    'bs':     [64,      128,     256,     64,      512],
    'reward': [22.1,    18.3,    25.7,    21.0,    15.2],
    'steps':  [450000,  600000,  380000,  520000,  800000],
    'std':    [1.2,     3.5,     0.8,     2.1,     4.2],
})

# Бинаризация по порогам
runs['fast']   = (runs['steps'] < 500000).astype(int)
runs['high_r'] = (runs['reward'] > 20).astype(int)
runs['stable'] = (runs['std'] < 2.0).astype(int)

print(runs[['run', 'fast', 'high_r', 'stable']])`}
                  </CyberCodeBlock>

                  <h3 className="text-lg font-semibold text-foreground">Шаг 2. Построение контекста и решётки</h3>

                  <CyberCodeBlock language="python" filename="step2_lattice.py">
{`from concepts import Context

objects = runs['run'].tolist()
attributes = ['fast', 'high_r', 'stable']
table = runs[attributes].values.tolist()

ctx = Context(objects, attributes, table)
lattice = ctx.lattice

print(f"Решётка содержит {len(lattice)} понятий\\n")
for c in lattice:
    print(f"Объём:      {c.extent}")
    print(f"Содержание: {c.intent}")
    print()`}
                  </CyberCodeBlock>

                  <h3 className="text-lg font-semibold text-foreground">Шаг 3. Интерпретация</h3>
                  <ul className="list-disc list-inside space-y-2 ml-2">
                    <li>
                      Понятие с содержанием <code className="text-yellow-400">{'{'}'fast', 'high_r', 'stable'{'}'}</code> — 
                      идеальная конфигурация. Её объём покажет конкретные запуски.
                    </li>
                    <li>
                      Понятие <code className="text-yellow-400">{'{'}'fast', 'high_r'{'}'}</code> без 'stable' — 
                      конфигурации с хорошим результатом, но нестабильные. Нужна регуляризация.
                    </li>
                    <li>
                      Если объём идеального понятия пуст — ни одна конфигурация не достигла
                      всех трёх целей. Нужно расширить пространство поиска.
                    </li>
                  </ul>

                  <CyberCodeBlock language="python" filename="step3_interpret.py">
{`# Найти конфигурации с максимальным содержанием
best = [c for c in lattice if len(c.intent) == len(attributes)]
if best:
    print("Идеальные конфигурации:", best[0].extent)
else:
    # Найти ближайшие к идеалу
    by_intent = sorted(lattice, key=lambda c: len(c.intent), reverse=True)
    print("Лучшее приближение:")
    print(f"  Свойства: {by_intent[0].intent}")
    print(f"  Запуски:  {by_intent[0].extent}")`}
                  </CyberCodeBlock>
                </CardContent>
              </Card>
            </section>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button variant="outline" onClick={() => navigate("/hub/math-rl")}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Математика RL
              </Button>
              <Button onClick={() => navigate("/courses")}>
                Перейти к курсам
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FcaRlModule;
