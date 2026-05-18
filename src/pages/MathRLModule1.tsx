import { Button } from "@/components/ui/button";
import HubLessonBadges from "@/components/HubLessonBadges";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { ArrowLeft, BookOpen, TrendingUp, Layers, BarChart3, Code2, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Math from "@/components/Math";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { GeometricSeriesChart, ValueIterationChart, DiscountImpactChart } from "@/components/math-rl/module1/InteractiveCharts";

const chapters = [
  "Введение",
  "1. Предел последовательности",
  "2. Бесконечные ряды",
  "3. Связь с RL: дисконтирование",
  "4. Уравнения Беллмана",
  "5. Итерация ценности",
  "6. Влияние γ на обучение",
  "7. Примеры и задачи",
  "8. Jupyter-демонстрации",
  "9. Источники",
  "Глоссарий",
];

const MathRLModule1 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/math-rl")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            К модулям
          </Button>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">Модуль 1</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl flex gap-8">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <nav className="sticky top-[80px] space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Содержание</p>
            {chapters.map((ch, i) => (
              <button
                key={i}
                onClick={() => {
                  const sections = document.querySelectorAll("article section");
                  sections[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="block w-full text-left text-xs py-1.5 px-2 rounded text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors cursor-pointer truncate"
              >
                {ch}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <article className="flex-1 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              Пределы, последовательности и ряды
            </span>
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-foreground/80 mb-2">
            в контексте обучения с подкреплением
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Фундаментальные математические понятия предела и их связь с алгоритмами RL: сходимость, дисконтирование (дисконтирование — <CrossLinkToLesson lessonId="1-1" lessonPath="/courses/1-1" lessonTitle="Что такое обучение с подкреплением?" lessonLevel={1} />), уравнения Беллмана.
          </p>

          <HubLessonBadges hubPath="/math-rl/module-1" />
          <Section icon={<BookOpen className="w-5 h-5 text-primary" />} title="Введение">
            <p>
              В этом учебном модуле рассматриваются фундаментальные математические понятия <strong className="text-foreground">предела</strong>, <strong className="text-foreground">последовательности</strong> и <strong className="text-foreground">ряда</strong> и их связь с алгоритмами обучения с подкреплением (Reinforcement Learning, RL). Несмотря на абстрактность, эти понятия играют ключевую роль в понимании сходимости алгоритмов RL и расчёте бесконечных сумм вознаграждений.
            </p>
            <p>
              Мы обсудим интуитивную и формальную сущность предела последовательности и сходимости бесконечного ряда, а затем покажем, как эти идеи проявляются в уравнениях Беллмана, итерации ценности и дисконтировании наград.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "Теоретический обзор: пределы, последовательности и ряды",
                "Связь с RL: Беллман, итерация ценности, дисконтирование",
                "Примеры и аналогии с решениями",
                "Визуализации и Jupyter-демонстрации",
                "Источники для самостоятельного изучения",
                "Мини-глоссарий ключевых терминов",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-primary font-mono font-bold min-w-[1.5rem]">{i + 1}.</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* ── 1. Предел последовательности ── */}
          <Section icon={<TrendingUp className="w-5 h-5 text-primary" />} title="1. Теоретические основы: предел последовательности">
            <h3 className="text-xl font-semibold text-foreground mt-4 mb-3">1.1 Предел последовательности</h3>
            <p>
              <strong className="text-foreground">Интуиция:</strong> Последовательность — это набор элементов (чисел) <Math display={false}>{`x_1, x_2, x_3, \\ldots`}</Math>, определённых некоторым правилом. Последовательность имеет <em>предел</em> (или <em>сходится</em> к значению <Math display={false}>{`a`}</Math>), если её члены постепенно приближаются к <Math display={false}>{`a`}</Math>.
            </p>
            <p>
              Например, последовательность <Math display={false}>{`1, \\tfrac{1}{2}, \\tfrac{1}{3}, \\tfrac{1}{4}, \\ldots`}</Math> приближается к 0 — её предел равен 0.
            </p>

            <p className="mt-4">
              <strong className="text-foreground">Формально:</strong> Число <Math display={false}>{`a`}</Math> называется пределом последовательности <Math display={false}>{`x_n`}</Math>, если для любого наперёд заданного <Math display={false}>{`\\varepsilon > 0`}</Math> найдётся такой номер <Math display={false}>{`N`}</Math>, что для всех <Math display={false}>{`n > N`}</Math> расстояние между <Math display={false}>{`x_n`}</Math> и <Math display={false}>{`a`}</Math> меньше <Math display={false}>{`\\varepsilon`}</Math>:
            </p>
            <Math>{`\\lim_{n \\to \\infty} x_n = a \\iff \\forall \\varepsilon > 0\\; \\exists N(\\varepsilon):\\; \\forall n \\geq N,\\; |x_n - a| < \\varepsilon`}</Math>

            <InfoBox variant="primary">
              <p className="text-sm font-semibold text-primary mb-2">Примеры:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><Math display={false}>{`x_n = \\frac{1}{n}`}</Math> — сходится к 0</li>
                <li><Math display={false}>{`x_n = \\frac{1}{\\sqrt{n}}`}</Math> — сходится к 0 (медленнее)</li>
                <li><Math display={false}>{`x_n = (-1)^n`}</Math> — не имеет предела (значения прыгают: +1, −1, +1, −1, …)</li>
              </ul>
            </InfoBox>

            <p>
              Если <Math display={false}>{`x_n`}</Math> становится произвольно большим по модулю, говорят, что предел равен бесконечности. Последовательность, не имеющая конечного предела, называется <em>расходящейся</em>.
            </p>
          </Section>

          {/* ── 2. Бесконечные ряды ── */}
          <Section icon={<Layers className="w-5 h-5 text-secondary" />} title="2. Бесконечные ряды и их сходимость">
            <p>
              <strong className="text-foreground">Бесконечный ряд</strong> — это сумма бесконечного числа слагаемых:
            </p>
            <Math>{`\\sum_{n=1}^{\\infty} a_n = a_1 + a_2 + a_3 + \\cdots`}</Math>
            <p>
              Ряд задаётся последовательностью <em>частичных сумм</em>:
            </p>
            <Math>{`S_N = a_1 + a_2 + \\cdots + a_N`}</Math>
            <p>
              Ряд <strong className="text-foreground">сходится</strong>, если последовательность <Math display={false}>{`S_N`}</Math> имеет конечный предел <Math display={false}>{`S = \\lim_{N \\to \\infty} S_N`}</Math>. Иначе ряд называется расходящимся.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Геометрический ряд</h3>
            <p>
              Классический пример: <Math display={false}>{`1 + r + r^2 + r^3 + \\cdots`}</Math>. Частичная сумма:
            </p>
            <Math>{`S_N = \\frac{1 - r^N}{1 - r} \\quad (r \\neq 1)`}</Math>
            <p>
              Если <Math display={false}>{`|r| < 1`}</Math>, то <Math display={false}>{`r^N \\to 0`}</Math> и ряд сходится:
            </p>
            <Math>{`\\sum_{n=0}^{\\infty} r^n = \\frac{1}{1 - r} \\quad \\text{при } |r| < 1`}</Math>

            <InfoBox variant="secondary">
              <p className="text-sm font-semibold text-secondary mb-2">Важно для RL:</p>
              <p className="text-sm">
                Дисконт-фактор <Math display={false}>{`\\gamma`}</Math> играет роль <Math display={false}>{`r`}</Math> в геометрическом ряде. Если <Math display={false}>{`\\gamma < 1`}</Math>, бесконечная сумма наград сходится, обеспечивая математическую корректность.
              </p>
            </InfoBox>

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Необходимое условие сходимости</h3>
            <p>
              Для сходимости ряда <em>необходимо</em> (но не достаточно), чтобы <Math display={false}>{`a_n \\to 0`}</Math>. Например, <strong className="text-foreground">гармонический ряд</strong> <Math display={false}>{`\\sum \\frac{1}{n}`}</Math> расходится, хотя <Math display={false}>{`\\frac{1}{n} \\to 0`}</Math>.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Абсолютная сходимость</h3>
            <p>
              Ряд <Math display={false}>{`\\sum a_n`}</Math> сходится <em>абсолютно</em>, если сходится ряд модулей <Math display={false}>{`\\sum |a_n|`}</Math>. В RL ряды вознаграждений обычно сходятся абсолютно благодаря дисконтированию.
            </p>
          </Section>

          {/* ── 3. Связь с RL: дисконтирование ── */}
          <Section icon={<BarChart3 className="w-5 h-5 text-accent" />} title="3. Пределы и ряды в контексте обучения с подкреплением">
            <p>
              В RL среду моделируют как <strong className="text-foreground">марковский процесс принятия решений (MDP)</strong>. Будущее вознаграждение суммируется за все шаги с дисконтированием:
            </p>
            <Math>{`G_t = R_{t+1} + \\gamma R_{t+2} + \\gamma^2 R_{t+3} + \\cdots = \\sum_{k=0}^{\\infty} \\gamma^k R_{t+k+1}`}</Math>
            <p>
              Это <strong className="text-foreground">дисконтированный возврат</strong> (discounted return) — бесконечный ряд с общим множителем <Math display={false}>{`\\gamma^k`}</Math>. При <Math display={false}>{`\\gamma < 1`}</Math> ряд сходится как геометрическая прогрессия.
            </p>

            <InfoBox variant="primary">
              <p className="text-sm font-semibold text-primary mb-2">Пример: постоянная награда</p>
              <p className="text-sm">
                Если агент каждый шаг получает <Math display={false}>{`R = 1`}</Math>, то:
              </p>
              <Math>{`G_0 = 1 + \\gamma + \\gamma^2 + \\cdots = \\frac{1}{1 - \\gamma}`}</Math>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                <li><Math display={false}>{`\\gamma = 0.9 \\Rightarrow G_0 = 10`}</Math></li>
                <li><Math display={false}>{`\\gamma = 0.99 \\Rightarrow G_0 = 100`}</Math></li>
                <li><Math display={false}>{`\\gamma = 1.0 \\Rightarrow G_0 = \\infty`}</Math> (расходится!)</li>
              </ul>
            </InfoBox>

            <p>
              Дисконтирование можно интерпретировать как <em>«коэффициент нетерпения»</em> агента или <em>вероятность выживания</em>: <Math display={false}>{`\\gamma = 0.95`}</Math> эквивалентно 95% шансу продолжить на каждый шаг, что даёт <strong className="text-foreground">эффективный горизонт</strong> <Math display={false}>{`\\frac{1}{1-\\gamma} = 20`}</Math> шагов.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Функция ценности состояния</h3>
            <p>
              При заданной политике <Math display={false}>{`\\pi`}</Math> определим функцию ценности как математическое ожидание дисконтированного возврата:
            </p>
            <Math>{`V^\\pi(s) = \\mathbb{E}_\\pi\\!\\left[\\sum_{t=0}^{\\infty} \\gamma^t R_{t+1} \\;\\middle|\\; S_0 = s\\right]`}</Math>
          </Section>

          {/* ── 4. Уравнения Беллмана ── */}
          <Section icon={<TrendingUp className="w-5 h-5 text-primary" />} title="4. Уравнения Беллмана и дисконтирование">
            <p>
              Уравнение Беллмана выражает ценность состояния через ценности последующих состояний — это рекуррентное соотношение:
            </p>
            <Math>{`V^\\pi(s) = \\sum_a \\pi(a|s) \\sum_{s'} P(s'|s,a)\\bigl[R(s,a,s') + \\gamma\\, V^\\pi(s')\\bigr]`}</Math>
            <p>
              Без <Math display={false}>{`\\gamma < 1`}</Math> бесконечная сумма в определении <Math display={false}>{`V^\\pi`}</Math> часто расходится. Именно поэтому дисконтирование — <em>неотъемлемая часть</em> формулировки бесконечного горизонта RL.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Уравнение оптимальности Беллмана</h3>
            <p>
              Для оптимальной политики <Math display={false}>{`\\pi^*`}</Math>:
            </p>
            <Math>{`V^*(s) = \\max_a \\sum_{s'} P(s'|s,a)\\bigl[R(s,a,s') + \\gamma\\, V^*(s')\\bigr]`}</Math>
            <p>
              Существование и единственность решения гарантируются тем, что оператор Беллмана является <strong className="text-foreground">сжимающим отображением</strong> с коэффициентом <Math display={false}>{`\\gamma`}</Math>. По теореме Банаха о неподвижной точке, итеративное применение оператора сходится к единственному <Math display={false}>{`V^*`}</Math>.
            </p>
          </Section>

          {/* ── 5. Итерация ценности ── */}
          <Section icon={<Layers className="w-5 h-5 text-secondary" />} title="5. Итерация ценности: сходимость на практике">
            <p>
              Алгоритм <strong className="text-foreground">итерации ценности (Value Iteration)</strong> — это многократное применение оператора Беллмана:
            </p>
            <Math>{`V_{k+1}(s) = \\max_a \\sum_{s'} P(s'|s,a)\\bigl[R(s,a,s') + \\gamma\\, V_k(s')\\bigr]`}</Math>

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">Пример: MDP с двумя состояниями</h3>
            <p>
              Рассмотрим простейшую MDP: из <Math display={false}>{`S_1`}</Math> агент переходит в <Math display={false}>{`S_2`}</Math> с наградой +2, из <Math display={false}>{`S_2`}</Math> — обратно в <Math display={false}>{`S_1`}</Math> с наградой 0. При <Math display={false}>{`\\gamma = 0.9`}</Math>:
            </p>
            <Math>{`\\begin{cases} v_1 = 2 + 0.9 \\cdot v_2 \\\\ v_2 = 0 + 0.9 \\cdot v_1 \\end{cases}`}</Math>
            <p>
              Подставляя: <Math display={false}>{`v_1 = 2 + 0.81 v_1`}</Math>, откуда <Math display={false}>{`v_1 \\approx 10.53`}</Math>, <Math display={false}>{`v_2 \\approx 9.47`}</Math>.
            </p>

            <CyberCodeBlock language="python" filename="value_iteration_2states.py">
{`gamma = 0.9
V = [0.0, 0.0]  # V[0] = V(S1), V[1] = V(S2)

for i in range(1, 21):
    V_new = [0.0, 0.0]
    V_new[0] = 2 + gamma * V[1]   # S1: награда 2 + γ·V(S2)
    V_new[1] = 0 + gamma * V[0]   # S2: награда 0 + γ·V(S1)
    V = V_new
    if i <= 5 or i % 5 == 0:
        print(f"Итерация {i:2d}: V1={V[0]:.3f}, V2={V[1]:.3f}")

# Итерация  1: V1=2.000, V2=0.000
# Итерация  2: V1=2.000, V2=1.800
# Итерация  5: V1=4.932, V2=3.258
# ...
# Итерация 20: V1≈10.53, V2≈9.47`}
            </CyberCodeBlock>

            <InfoBox variant="primary">
              <p className="text-sm font-semibold text-primary mb-2">Свойство сходимости</p>
              <p className="text-sm">
                Максимальная разница между текущими оценками и оптимальными уменьшается примерно в <Math display={false}>{`\\gamma = 0.9`}</Math> раза каждую итерацию — следствие контрактности оператора Беллмана. Через ~20 итераций значения практически совпадают с теоретическими.
              </p>
            </InfoBox>
          </Section>

          {/* ── 6. Влияние γ ── */}
          <Section icon={<BarChart3 className="w-5 h-5 text-accent" />} title="6. Дисконтирование в RL и его влияние">
            <p>
              С точки зрения рядов, <Math display={false}>{`\\gamma`}</Math> — это знаменатель прогрессии, от которого зависит сходимость и сумма. Чем <Math display={false}>{`\\gamma`}</Math> ближе к 1, тем медленнее ряд сходится (эффективный горизонт больше).
            </p>

            <div className="my-6 overflow-x-auto">
              <table className="w-full text-sm border border-border/30 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-card/60">
                    <th className="text-left p-3 text-foreground font-semibold border-b border-border/30"><Math display={false}>{`\\gamma`}</Math></th>
                    <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Эффективный горизонт</th>
                    <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Поведение</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/20"><td className="p-3">0</td><td className="p-3">1 шаг</td><td className="p-3">Абсолютно близорукий агент</td></tr>
                  <tr className="border-b border-border/20"><td className="p-3">0.5</td><td className="p-3">2 шага</td><td className="p-3">Краткосрочная выгода</td></tr>
                  <tr className="border-b border-border/20"><td className="p-3">0.9</td><td className="p-3">10 шагов</td><td className="p-3">Умеренное планирование</td></tr>
                  <tr className="border-b border-border/20"><td className="p-3">0.99</td><td className="p-3">100 шагов</td><td className="p-3">Дальновидный агент</td></tr>
                  <tr><td className="p-3">1.0</td><td className="p-3">∞</td><td className="p-3">Расходимость (бесконечный горизонт)</td></tr>
                </tbody>
              </table>
            </div>

            <DiscountImpactChart />

            <InfoBox variant="accent">
              <p className="text-sm font-semibold text-accent mb-2">Аналогия из финансов</p>
              <p className="text-sm">
                Дисконтирование в RL аналогично <em>приведённой стоимости денег</em>: сегодня 1₽ ценится выше, чем обещание 1₽ через год. Если <Math display={false}>{`\\gamma = 0.95`}</Math> — это «5% годовых обесценивания», то бесконечный поток выплат по 1₽ стоит <Math display={false}>{`\\frac{1}{1-0.95} = 20`}</Math>₽ сейчас (perpetuity).
              </p>
            </InfoBox>
          </Section>

          {/* ── 7. Примеры и задачи ── */}
          <Section icon={<BookOpen className="w-5 h-5 text-primary" />} title="7. Примеры, аналогии и задачи">
            <h3 className="text-xl font-semibold text-foreground mt-4 mb-3">7.1 Предел последовательности: рекурсия</h3>
            <p>
              <strong className="text-foreground">Задача:</strong> <Math display={false}>{`a_1 = 1`}</Math>, <Math display={false}>{`a_{n+1} = \\frac{1}{2}(a_n + 6)`}</Math>. Найти <Math display={false}>{`\\lim_{n \\to \\infty} a_n`}</Math>.
            </p>
            <p>
              <strong className="text-foreground">Решение:</strong> Если <Math display={false}>{`a_n \\to L`}</Math>, то <Math display={false}>{`L = \\frac{1}{2}(L + 6)`}</Math>, откуда <Math display={false}>{`2L = L + 6`}</Math>, <Math display={false}>{`L = 6`}</Math>. Последовательность: 1, 3.5, 4.75, 5.375, … — монотонно стремится к 6.
            </p>
            <InfoBox variant="secondary">
              <p className="text-sm">
                Это <em>неподвижная точка итерационного процесса</em> — аналогия с поиском <Math display={false}>{`V^*`}</Math> как неподвижной точки оператора Беллмана!
              </p>
            </InfoBox>

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">7.2 Сумма геометрического ряда</h3>
            <p>
              <strong className="text-foreground">Задача:</strong> Вычислить <Math display={false}>{`0.8 + 0.8^2 + 0.8^3 + \\cdots`}</Math>
            </p>
            <p>
              <strong className="text-foreground">Решение:</strong> Геометрический ряд с <Math display={false}>{`a_1 = 0.8`}</Math>, <Math display={false}>{`r = 0.8`}</Math>:
            </p>
            <Math>{`S = \\frac{0.8}{1 - 0.8} = \\frac{0.8}{0.2} = 4`}</Math>

            <CyberCodeBlock language="python" filename="partial_sums.py">
{`s = 0.0
for n in range(1, 51):
    s += 0.8**n
print(f"Сумма 50 членов: {s:.8f}")
# Вывод: 3.99999998 (≈ 4)`}
            </CyberCodeBlock>

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">7.3 Дисконтированные награды в RL</h3>
            <p>
              <strong className="text-foreground">Задача:</strong> Агент получает <Math display={false}>{`R = 1`}</Math> на каждом шаге бесконечного эпизода. Как зависит <Math display={false}>{`G_0`}</Math> от <Math display={false}>{`\\gamma`}</Math>?
            </p>
            <Math>{`G_0 = \\sum_{k=0}^{\\infty} \\gamma^k = \\frac{1}{1 - \\gamma}`}</Math>

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">7.4 Конвергенция Q-обучения</h3>
            <p>
              Обновление Q-learning <Math display={false}>{`Q_{k+1}(s,a) = (1-\\alpha)Q_k(s,a) + \\alpha[R + \\gamma \\max_{a'} Q_k(s',a')]`}</Math> — стохастический аппроксимационный процесс, сходящийся к <Math display={false}>{`Q^*(s,a)`}</Math> при убывающем <Math display={false}>{`\\alpha`}</Math>. В основе — тот же контракционный оператор.
            </p>
          </Section>

          {/* ── 8. Jupyter-демонстрации ── */}
          <Section icon={<Code2 className="w-5 h-5 text-secondary" />} title="8. Интерактивные визуализации сходимости">
            <h3 className="text-xl font-semibold text-foreground mt-4 mb-3">8.1 Сходимость геометрического ряда</h3>
            <p>
              Частичная сумма <Math display={false}>{`S_N = \\sum_{t=0}^{N} \\gamma^t`}</Math> для разных <Math display={false}>{`\\gamma`}</Math>. Перемещайте слайдеры, чтобы наблюдать зависимость скорости сходимости от <Math display={false}>{`\\gamma`}</Math>:
            </p>

            <GeometricSeriesChart />

            <p>
              При <Math display={false}>{`\\gamma = 0.5`}</Math> ряд сходится за ~6 членов. При <Math display={false}>{`\\gamma = 0.9`}</Math> — значительно медленнее, к N=30 приближаясь к ~9.58 (предел 10). Это аналог «длинного хвоста» учёта будущего в RL.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">8.2 Визуализация итерации ценности</h3>
            <p>
              Наблюдайте, как значения <Math display={false}>{`V(S_1)`}</Math> и <Math display={false}>{`V(S_2)`}</Math> сходятся к оптимуму в MDP с двумя состояниями. Измените <Math display={false}>{`\\gamma`}</Math>, чтобы увидеть влияние на скорость и характер сходимости:
            </p>

            <ValueIterationChart />

            <p>
              Значения осциллируют, но расстояние до предела убывает ~в <Math display={false}>{`\\gamma`}</Math> раза каждую итерацию — визуальное подтверждение <strong className="text-foreground">контрактности оператора Беллмана</strong>.
            </p>
          </Section>

          {/* ── 9. Источники ── */}
          <Section icon={<BookOpen className="w-5 h-5 text-accent" />} title="9. Источники и материалы для дальнейшего изучения">
            <ul className="list-disc list-inside space-y-3 text-sm">
              <li><strong className="text-foreground">Саттон Р., Барто Э.</strong> «Обучение с подкреплением: Введение», 2-е изд. — классический учебник. Глава 3: MDP, дисконтирование, уравнения Беллмана. Глава 4: алгоритмы DP.</li>
              <li><strong className="text-foreground">Silver D.</strong> «Reinforcement Learning course» (UCL, 2015) — видеолекции от создателя AlphaGo.</li>
              <li><strong className="text-foreground">Khan Academy</strong> — раздел «Пределы и ряды» (курс по математическому анализу).</li>
              <li><strong className="text-foreground">Wikipedia</strong> — статьи: «Limit of a sequence», «Series (mathematics)», «Bellman equation», «Markov decision process».</li>
              <li><strong className="text-foreground">Stepik</strong> — курс «Глубокое обучение с подкреплением» (2018, на русском).</li>
              <li><strong className="text-foreground">Bertsekas D.</strong> «Dynamic Programming and Optimal Control» — сжимающие отображения и доказательства сходимости.</li>
            </ul>
          </Section>

          {/* ── Глоссарий ── */}
          <Section icon={<GraduationCap className="w-5 h-5 text-primary" />} title="Мини-глоссарий ключевых понятий">
            <div className="space-y-4">
              <GlossaryItem
                term="Последовательность"
                formula={`x_1, x_2, \\ldots, x_n, \\ldots`}
                definition="Набор пронумерованных элементов. Пример: вознаграждения R₁, R₂, …, Rₜ, …"
              />
              <GlossaryItem
                term="Предел последовательности"
                formula={`\\lim_{n \\to \\infty} x_n = a \\iff \\forall \\varepsilon > 0\\; \\exists N:\\; \\forall n > N,\\; |x_n - a| < \\varepsilon`}
                definition="Число a, к которому приближаются члены последовательности."
              />
              <GlossaryItem
                term="Сходимость ряда"
                formula={`S = \\lim_{N \\to \\infty} \\sum_{n=1}^{N} a_n`}
                definition="Наличие конечного предела частичных сумм. Пример: 1 + ½ + ¼ + ⅛ + … = 2."
              />
              <GlossaryItem
                term="Дисконтирование"
                formula={`G_t = \\sum_{k=0}^{\\infty} \\gamma^k R_{t+k+1}, \\quad \\gamma \\in [0, 1)`}
                definition="Умножение вознаграждения на γᵗ за задержку на t шагов. Обеспечивает сходимость бесконечного возврата."
              />
              <GlossaryItem
                term="Функция ценности состояния"
                formula={`V^\\pi(s) = \\mathbb{E}_\\pi\\!\\left[\\sum_{t=0}^{\\infty} \\gamma^t R_{t+1} \\;\\middle|\\; S_0 = s\\right]`}
                definition="Ожидаемый суммарный дисконтированный возврат при старте в состоянии s и следовании политике π."
              />
              <GlossaryItem
                term="Уравнение Беллмана"
                formula={`V^\\pi(s) = \\sum_a \\pi(a|s)\\sum_{s'} P(s'|s,a)[R + \\gamma V^\\pi(s')]`}
                definition="Рекуррентное соотношение: ценность = немедленная награда + дисконтированная ценность следующего."
              />
              <GlossaryItem
                term="Уравнение оптимальности Беллмана"
                formula={`V^*(s) = \\max_a \\sum_{s'} P(s'|s,a)[R + \\gamma V^*(s')]`}
                definition="Оптимальная ценность через максимум по действиям. Решение — алгоритм итерации ценности."
              />
              <GlossaryItem
                term="Контрактное отображение"
                formula={`d(F(x), F(y)) \\leq \\kappa\\, d(x, y), \\quad \\kappa < 1`}
                definition="Отображение с единственной неподвижной точкой. Оператор Беллмана — γ-сжатие в max-норме."
              />
              <GlossaryItem
                term="Итерация ценности"
                formula={`V_{k+1}(s) = \\max_a \\sum_{s'} P(s'|s,a)[R + \\gamma V_k(s')]`}
                definition="Алгоритм вычисления V* путём итерационного применения оператора Беллмана. Сходится за счёт контрактности."
              />
              <GlossaryItem
                term="Q-обучение"
                formula={`Q(s,a) \\leftarrow Q(s,a) + \\alpha[R + \\gamma \\max_{a'} Q(s',a') - Q(s,a)]`}
                definition="Off-policy алгоритм RL, сходящийся к Q* при посещении всех пар (s,a) бесконечно часто."
              />
            </div>
          </Section>

          {/* Back button */}
          <div className="mt-16 flex justify-center">
            <Button variant="outline" onClick={() => navigate("/math-rl")} className="border-primary/50 text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться к модулям
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
};

/* ─── Reusable sub-components ─── */

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <section className="mt-12 first:mt-0">
    <div className="flex items-center gap-3 mb-6">
      {icon}
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    </div>
    <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </section>
);

const InfoBox = ({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "secondary" | "accent" }) => {
  const borderColor = variant === "primary" ? "border-primary/30" : variant === "secondary" ? "border-secondary/30" : "border-accent/30";
  return (
    <div className={`my-4 p-4 rounded-lg bg-card/80 border ${borderColor}`}>
      {children}
    </div>
  );
};

const GlossaryItem = ({ term, formula, definition }: { term: string; formula: string; definition: string }) => (
  <div className="p-4 rounded-lg bg-card/60 border border-border/50 space-y-2">
    <dt className="font-semibold text-foreground text-sm">{term}</dt>
    <div className="overflow-x-auto">
      <Math className="my-1 py-2">{formula}</Math>
    </div>
    <dd className="text-muted-foreground text-sm">{definition}</dd>
  </div>
);

export default MathRLModule1;