import { BookOpen, TrendingUp, Layers, BarChart3, Code2, GraduationCap, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Math from "@/components/Math";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { GeometricSeriesChart, ValueIterationChart, DiscountImpactChart } from "@/components/math-rl/module1/InteractiveCharts";
import LimitOfSequenceViz from "@/components/math-rl/LimitOfSequenceViz";
import InfiniteSeriesViz from "@/components/math-rl/InfiniteSeriesViz";
import ValueFunctionViz from "@/components/math-rl/ValueFunctionViz";
import mdpTwoStatesImg from "@/assets/mdp-two-states.png";

/**
 * Тонкая капсула «назад в урок 1.5» — зеркало pill-варианта HubLink.
 * Показывается справа от заголовка § 4, помогает читателям, пришедшим
 * по глубокой ссылке из курса, вернуться к месту остановки.
 */
const BackToLessonPill = () => (
  <Link
    to="/courses/1-6#пример-вывода-уравнения-оптимальности"
    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-200 no-underline"
    style={{
      borderColor: "rgba(0,255,214,0.25)",
      backgroundColor: "rgba(0,255,214,0.06)",
      color: "#00FFD6",
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      fontSize: "11px",
      lineHeight: 1.2,
      whiteSpace: "nowrap",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = "0 0 8px rgba(0,255,214,0.35)";
      e.currentTarget.style.borderColor = "rgba(0,255,214,0.5)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = "rgba(0,255,214,0.25)";
    }}
    title="Вернуться в урок 1.5 к месту, где мы остановились"
  >
    <ArrowLeft aria-hidden style={{ width: 12, height: 12 }} />
    <span>из урока 1.5 — вернуться</span>
  </Link>
);

const Part1Limits = () => (
  <>
    {/* ── Введение ── */}
    <Section icon={<BookOpen className="w-5 h-5 text-primary" />} title="Введение">
      <p>
        В этом разделе рассматриваются фундаментальные математические понятия <strong className="text-foreground">предела</strong>, <strong className="text-foreground">последовательности</strong> и <strong className="text-foreground">ряда</strong> и их связь с алгоритмами обучения с подкреплением (Reinforcement Learning, RL). Несмотря на абстрактность, эти понятия играют ключевую роль в понимании сходимости алгоритмов RL и расчёте бесконечных сумм вознаграждений.
      </p>
      <p>
        Мы обсудим интуитивную и формальную сущность предела последовательности и сходимости бесконечного ряда, а затем покажем, как эти идеи проявляются в уравнениях Беллмана, итерации ценности и дисконтировании наград.
      </p>
    </Section>

    {/* ── 1. Предел последовательности ── */}
    <Section icon={<TrendingUp className="w-5 h-5 text-primary" />} title="1. Теоретические основы: предел последовательности">
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-4 mb-3" id="1-1-предел-последовательности">1.1 Предел последовательности</h3>
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

      <LimitOfSequenceViz />
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

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="геометрический-ряд">Геометрический ряд</h3>
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

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="необходимое-условие-сходимости">Необходимое условие сходимости</h3>
      <p>
        Для сходимости ряда <em>необходимо</em> (но не достаточно), чтобы <Math display={false}>{`a_n \\to 0`}</Math>. Например, <strong className="text-foreground">гармонический ряд</strong> <Math display={false}>{`\\sum \\frac{1}{n}`}</Math> расходится, хотя <Math display={false}>{`\\frac{1}{n} \\to 0`}</Math>.
      </p>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="абсолютная-сходимость">Абсолютная сходимость</h3>
      <p>
      Ряд <Math display={false}>{`\\sum a_n`}</Math> сходится <em>абсолютно</em>, если сходится ряд модулей <Math display={false}>{`\\sum |a_n|`}</Math>. В RL ряды вознаграждений обычно сходятся абсолютно благодаря дисконтированию.
      </p>

      <InfiniteSeriesViz />
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

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="функция-ценности-состояния">Функция ценности состояния</h3>
      <p>
        При заданной политике <Math display={false}>{`\\pi`}</Math> определим функцию ценности как математическое ожидание дисконтированного возврата:
      </p>
      <Math>{`V^\\pi(s) = \\mathbb{E}_\\pi\\!\\left[\\sum_{t=0}^{\\infty} \\gamma^t R_{t+1} \\;\\middle|\\; S_0 = s\\right]`}</Math>

      <ValueFunctionViz />
    </Section>

    {/* ── 4. Уравнения Беллмана ── */}
    <Section
      icon={<TrendingUp className="w-5 h-5 text-primary" />}
      title="4. Уравнения Беллмана и дисконтирование"
      rightSlot={<BackToLessonPill />}
    >
      <p>
        Уравнение Беллмана выражает ценность состояния через ценности последующих состояний — это рекуррентное соотношение:
      </p>
      <Math>{`V^\\pi(s) = \\sum_a \\pi(a|s) \\sum_{s'} P(s'|s,a)\\bigl[R(s,a,s') + \\gamma\\, V^\\pi(s')\\bigr]`}</Math>
      <p>
        Без <Math display={false}>{`\\gamma < 1`}</Math> бесконечная сумма в определении <Math display={false}>{`V^\\pi`}</Math> часто расходится. Именно поэтому дисконтирование — <em>неотъемлемая часть</em> формулировки бесконечного горизонта RL.
      </p>

      {/* 4.1 — Идея простыми словами */}
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="идея-простыми-словами">4.1 Идея простыми словами</h3>
      <p>
        Уравнение Беллмана говорит, что <strong className="text-foreground">лучшая ценность (выгода) состояния сейчас</strong> равна <strong className="text-foreground">лучшему немедленному результату плюс лучшая ценность дальнейших состояний</strong>. Агент совершает действие, попадает в новое состояние, получает награду — и продолжает думать о будущем.
      </p>
      <InfoBox variant="primary">
        <p className="text-sm">
          Это основа <strong className="text-foreground">динамического программирования</strong> и многих алгоритмов принятия решений (включая обучение с подкреплением). Сложная задача «как действовать оптимально на длинном горизонте» разбивается на простые шаги: <em>сначала считаем ценности всех следующих состояний, потом используем их для текущего</em>.
        </p>
      </InfoBox>

      {/* 4.2 — Уравнение оптимальности (общая формула) */}
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="уравнение-оптимальности-беллмана">4.2 Уравнение оптимальности Беллмана (дискретный случай)</h3>
      <p>
        Для оптимальной политики <Math display={false}>{`\\pi^*`}</Math> и любого состояния <Math display={false}>{`s`}</Math>:
      </p>
      <Math>{`V^*(s) = \\max_{a \\in A(s)} \\sum_{s'} P(s'|s,a)\\bigl[R(s,a,s') + \\gamma\\, V^*(s')\\bigr]`}</Math>

      <div className="my-6 overflow-x-auto rounded-xl border border-primary/30 bg-card/60 backdrop-blur-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/30">
              <th className="text-left py-2 px-3 text-primary font-semibold">Обозначение</th>
              <th className="text-left py-2 px-3 text-foreground font-semibold">Смысл</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/30">
              <td className="py-2 px-3"><Math display={false}>{`V^*(s)`}</Math></td>
              <td className="py-2 px-3">максимальная ожидаемая суммарная награда, начиная из состояния <Math display={false}>{`s`}</Math> и действуя оптимально</td>
            </tr>
            <tr className="border-b border-border/30">
              <td className="py-2 px-3"><Math display={false}>{`A(s)`}</Math></td>
              <td className="py-2 px-3">множество допустимых действий в состоянии <Math display={false}>{`s`}</Math></td>
            </tr>
            <tr className="border-b border-border/30">
              <td className="py-2 px-3"><Math display={false}>{`P(s'|s,a)`}</Math></td>
              <td className="py-2 px-3">вероятность перейти в состояние <Math display={false}>{`s'`}</Math> из <Math display={false}>{`s`}</Math>, если выполнить действие <Math display={false}>{`a`}</Math></td>
            </tr>
            <tr className="border-b border-border/30">
              <td className="py-2 px-3"><Math display={false}>{`R(s,a,s')`}</Math></td>
              <td className="py-2 px-3">немедленная награда за переход <Math display={false}>{`s \\to s'`}</Math> по действию <Math display={false}>{`a`}</Math></td>
            </tr>
            <tr className="border-b border-border/30">
              <td className="py-2 px-3"><Math display={false}>{`\\gamma \\in [0,1)`}</Math></td>
              <td className="py-2 px-3">коэффициент дисконтирования будущего: чем ближе к 1, тем важнее далёкое будущее</td>
            </tr>
            <tr>
              <td className="py-2 px-3"><Math display={false}>{`s'`}</Math></td>
              <td className="py-2 px-3">возможные следующие состояния</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 4.3 — Что означает формула */}
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="что-означает-формула">4.3 Что означает формула — по частям</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
          <Math display={false}>{`V^*(s)`}</Math>
          <p className="text-xs text-muted-foreground mt-2">лучшая ценность состояния <Math display={false}>{`s`}</Math></p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30">
          <Math display={false}>{`\\max_{a \\in A(s)}`}</Math>
          <p className="text-xs text-muted-foreground mt-2">выбираем действие <Math display={false}>{`a`}</Math>, которое даёт наибольшую ценность</p>
        </div>
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
          <Math display={false}>{`\\sum_{s'} P(s'|s,a)`}</Math>
          <p className="text-xs text-muted-foreground mt-2">учитываем все возможные следующие состояния и их вероятности</p>
        </div>
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
          <Math display={false}>{`R(s,a,s')`}</Math>
          <p className="text-xs text-muted-foreground mt-2">немедленная награда (польза прямо сейчас)</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/30">
          <Math display={false}>{`\\gamma\\, V^*(s')`}</Math>
          <p className="text-xs text-muted-foreground mt-2">будущая ценность из <Math display={false}>{`s'`}</Math>, но <em>дисконтированная</em></p>
        </div>
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
          <Math display={false}>{`[\\,R + \\gamma V^*\\,]`}</Math>
          <p className="text-xs text-muted-foreground mt-2">польза одного перехода = сейчас + будущее</p>
        </div>
      </div>
      <InfoBox variant="secondary">
        <p className="text-sm">
          Иначе говоря: для каждого действия считаем ожидаемую (с учётом вероятностей) сумму из <strong className="text-foreground">немедленной награды</strong> и <strong className="text-foreground">дисконтированной будущей ценности</strong>, и берём <strong className="text-foreground">максимум</strong>.
        </p>
      </InfoBox>

      {/* 4.4 — Пример на пальцах */}
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="пример-на-пальцах">4.4 Пример «на пальцах»</h3>
      <p>
        Вы в городе. Нужно добраться до цели и получить максимальную награду. Из состояния <Math display={false}>{`s`}</Math> доступно 2 действия:
      </p>
      <div className="grid md:grid-cols-2 gap-4 my-4">
        <div className="p-4 rounded-lg bg-card/60 border border-primary/30">
          <p className="text-sm font-semibold text-primary mb-2">Действие <Math display={false}>{`a_1`}</Math> (вправо)</p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>с вероятностью 0.8 → клетка <Math display={false}>{`+5`}</Math></li>
            <li>с вероятностью 0.2 → в стену (значение 0)</li>
            <li>награда за шаг: <Math display={false}>{`-1`}</Math></li>
          </ul>
        </div>
        <div className="p-4 rounded-lg bg-card/60 border border-secondary/30">
          <p className="text-sm font-semibold text-secondary mb-2">Действие <Math display={false}>{`a_2`}</Math> (вниз)</p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>с вероятностью 1.0 → к цели <Math display={false}>{`+10`}</Math></li>
            <li>награда за шаг: <Math display={false}>{`-1`}</Math></li>
          </ul>
        </div>
      </div>
      <p>
        Пусть ценность клетки <Math display={false}>{`+5`}</Math> равна <Math display={false}>{`5`}</Math>, ценность цели <Math display={false}>{`+10`}</Math> равна <Math display={false}>{`10`}</Math>, дисконт <Math display={false}>{`\\gamma = 0.9`}</Math>.
      </p>

      <div className="grid md:grid-cols-2 gap-4 my-4">
        <div className="p-4 rounded-lg bg-card/80 border border-primary/30">
          <p className="text-sm font-semibold text-primary mb-2">Считаем для <Math display={false}>{`a_1`}</Math> (вправо):</p>
          <Math>{`0.8\\cdot[-1 + 0.9\\cdot 5] + 0.2\\cdot[-1 + 0.9\\cdot 0]`}</Math>
          <Math>{`= 0.8\\cdot 3.5 + 0.2\\cdot(-1) = 2.8 - 0.2 = 2.6`}</Math>
        </div>
        <div className="p-4 rounded-lg bg-card/80 border border-secondary/30">
          <p className="text-sm font-semibold text-secondary mb-2">Считаем для <Math display={false}>{`a_2`}</Math> (вниз):</p>
          <Math>{`1.0\\cdot[-1 + 0.9\\cdot 10] = -1 + 9 = 8`}</Math>
        </div>
      </div>
      <InfoBox variant="accent">
        <p className="text-sm">
          ⭐ Берём максимум: <Math display={false}>{`V^*(s) = \\max(2.6,\\,8) = 8`}</Math> → <strong className="text-foreground">лучше идти вниз</strong> (действие <Math display={false}>{`a_2`}</Math>).
        </p>
      </InfoBox>

      {/* 4.5 — Интуиция γ */}
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="интуиция-gamma">4.5 Интуиция: роль <Math display={false}>{`\\gamma`}</Math></h3>
      <ul className="list-disc list-inside space-y-2 text-sm">
        <li>
          🧭 <strong className="text-foreground">Сейчас выбираем действие</strong>, которое кажется лучшим не только сейчас, но и с учётом того, что будет дальше.
        </li>
        <li>
          ⏱️ Если <Math display={false}>{`\\gamma`}</Math> <strong className="text-foreground">маленький</strong> (например 0.1) — важно только ближайшее будущее.
        </li>
        <li>
          🔭 Если <Math display={false}>{`\\gamma`}</Math> <strong className="text-foreground">близок к 1</strong> (например 0.99) — важно и далёкое будущее.
        </li>
        <li>
          ⚖️ Уравнение Беллмана «разбивает» сложную задачу на простые шаги: сначала считаем ценности всех следующих состояний, потом используем их для текущего.
        </li>
      </ul>

      {/* 4.6 — Как используется */}
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="как-используется">4.6 Как используется уравнение Беллмана</h3>
      <div className="grid md:grid-cols-3 gap-3 my-4">
        <div className="p-4 rounded-lg bg-card/60 border border-primary/30 hover:shadow-glow-cyan transition-shadow">
          <p className="text-sm font-semibold text-primary mb-2">📊 Оценка политики</p>
          <p className="text-xs text-muted-foreground">
            <em>policy evaluation:</em> вычисляем <Math display={false}>{`V^\\pi(s)`}</Math> для фиксированной стратегии <Math display={false}>{`\\pi`}</Math> (без <Math display={false}>{`\\max`}</Math>).
          </p>
        </div>
        <div className="p-4 rounded-lg bg-card/60 border border-secondary/30 hover:shadow-glow-purple transition-shadow">
          <p className="text-sm font-semibold text-secondary mb-2">🔄 Итерация ценности</p>
          <p className="text-xs text-muted-foreground">
            <em>value iteration:</em> многократно применяем уравнение, пока значения не перестанут меняться → получаем <Math display={false}>{`V^*(s)`}</Math>.
          </p>
        </div>
        <div className="p-4 rounded-lg bg-card/60 border border-accent/30">
          <p className="text-sm font-semibold text-accent mb-2">🎯 Извлечение стратегии</p>
          <p className="text-xs text-muted-foreground">
            <em>policy extraction:</em> выбираем действие, которое давало максимум: <Math display={false}>{`\\pi^*(s) = \\arg\\max_a [\\,\\cdots]`}</Math>.
          </p>
        </div>
      </div>

      {/* 4.7 — Непрерывный случай */}
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="непрерывный-случай">4.7 Непрерывный случай</h3>
      <p>
        Если состояния и действия непрерывны, суммы заменяются на интегралы:
      </p>
      <Math>{`V^*(s) = \\max_{a \\in A(s)} \\int \\bigl[\\,R(s,a,s') + \\gamma\\, V^*(s')\\,\\bigr]\\, p(s'|s,a)\\, ds'`}</Math>
      <p>
        Здесь <Math display={false}>{`p(s'|s,a)`}</Math> — плотность вероятности перейти в <Math display={false}>{`s'`}</Math>. Идея та же самая.
      </p>

      {/* 4.8 — Существование и единственность */}
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="сходимость-беллмана">4.8 Почему решение существует</h3>
      <p>
        Существование и единственность <Math display={false}>{`V^*`}</Math> гарантируются тем, что оператор Беллмана является <strong className="text-foreground">сжимающим отображением</strong> с коэффициентом <Math display={false}>{`\\gamma`}</Math>. По теореме Банаха о неподвижной точке, итеративное применение оператора сходится к единственному <Math display={false}>{`V^*`}</Math>.
      </p>

      {/* 4.9 — Главное в одной строке */}
      <InfoBox variant="accent">
        <p className="text-sm font-semibold text-foreground mb-2">🎯 Главное в одной строке</p>
        <p className="text-sm">
          Лучшая ценность состояния = лучшая ожидаемая награда сейчас + важность лучшего будущего.
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
          <span className="px-2 py-1 rounded bg-primary/15 border border-primary/30 text-primary">состояние <Math display={false}>{`s`}</Math></span>
          <span className="text-muted-foreground">→</span>
          <span className="px-2 py-1 rounded bg-secondary/15 border border-secondary/30 text-secondary">выбор действия <Math display={false}>{`a`}</Math></span>
          <span className="text-muted-foreground">→</span>
          <span className="px-2 py-1 rounded bg-accent/15 border border-accent/30 text-accent">переход в <Math display={false}>{`s'`}</Math> (вероятности)</span>
          <span className="text-muted-foreground">→</span>
          <span className="px-2 py-1 rounded bg-primary/15 border border-primary/30 text-primary">награда <Math display={false}>{`R(s,a,s')`}</Math></span>
          <span className="text-muted-foreground">+</span>
          <span className="px-2 py-1 rounded bg-secondary/15 border border-secondary/30 text-secondary">будущее <Math display={false}>{`\\gamma V^*(s')`}</Math></span>
          <span className="text-muted-foreground">→</span>
          <span className="px-2 py-1 rounded bg-accent/15 border border-accent/30 text-accent">берём максимум по действиям</span>
        </div>
      </InfoBox>
    </Section>

    {/* ── 5. Итерация ценности ── */}
    <Section icon={<Layers className="w-5 h-5 text-secondary" />} title="5. Итерация ценности: сходимость на практике">
      <p>
        Алгоритм <strong className="text-foreground">итерации ценности (Value Iteration)</strong> — это многократное применение оператора Беллмана:
      </p>
      <Math>{`V_{k+1}(s) = \\max_a \\sum_{s'} P(s'|s,a)\\bigl[R(s,a,s') + \\gamma\\, V_k(s')\\bigr]`}</Math>

      <div className="relative group/mdp">
        <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3 cursor-pointer inline-block drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] hover:drop-shadow-[0_0_14px_rgba(255,255,255,0.8)] transition-all duration-300" id="пример-mdp-с-двумя-состояниями">Пример: MDP с двумя состояниями</h3>
        <div className="invisible opacity-0 group-hover/mdp:visible group-hover/mdp:opacity-100 transition-all duration-300 ease-out absolute left-[-420px] top-0 z-50 pointer-events-none">
          <img
            src={mdpTwoStatesImg}
            alt="MDP с двумя состояниями — инфографика"
            className="w-[400px] rounded-xl border border-primary/30 shadow-lg opacity-80"
          />
        </div>
      </div>
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
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-4 mb-3" id="7-1-предел-последовательности-рекурсия">7.1 Предел последовательности: рекурсия</h3>
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

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="7-2-сумма-геометрического-ряда">7.2 Сумма геометрического ряда</h3>
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

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="7-3-дисконтированные-награды-в-rl">7.3 Дисконтированные награды в RL</h3>
      <p>
        <strong className="text-foreground">Задача:</strong> Агент получает <Math display={false}>{`R = 1`}</Math> на каждом шаге бесконечного эпизода. Как зависит <Math display={false}>{`G_0`}</Math> от <Math display={false}>{`\\gamma`}</Math>?
      </p>
      <Math>{`G_0 = \\sum_{k=0}^{\\infty} \\gamma^k = \\frac{1}{1 - \\gamma}`}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="7-4-конвергенция-q-обучения">7.4 Конвергенция Q-обучения</h3>
      <p>
        Обновление Q-learning <Math display={false}>{`Q_{k+1}(s,a) = (1-\\alpha)Q_k(s,a) + \\alpha[R + \\gamma \\max_{a'} Q_k(s',a')]`}</Math> — стохастический аппроксимационный процесс, сходящийся к <Math display={false}>{`Q^*(s,a)`}</Math> при убывающем <Math display={false}>{`\\alpha`}</Math>. В основе — тот же контракционный оператор.
      </p>
    </Section>

    {/* ── 8. Jupyter-демонстрации ── */}
    <Section icon={<Code2 className="w-5 h-5 text-secondary" />} title="8. Интерактивные визуализации сходимости">
      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-4 mb-3" id="8-1-сходимость-геометрического-ряда">8.1 Сходимость геометрического ряда</h3>
      <p>
        Частичная сумма <Math display={false}>{`S_N = \\sum_{t=0}^{N} \\gamma^t`}</Math> для разных <Math display={false}>{`\\gamma`}</Math>. Перемещайте слайдеры, чтобы наблюдать зависимость скорости сходимости от <Math display={false}>{`\\gamma`}</Math>:
      </p>

      <GeometricSeriesChart />

      <p>
        При <Math display={false}>{`\\gamma = 0.5`}</Math> ряд сходится за ~6 членов. При <Math display={false}>{`\\gamma = 0.9`}</Math> — значительно медленнее, к N=30 приближаясь к ~9.58 (предел 10). Это аналог «длинного хвоста» учёта будущего в RL.
      </p>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="8-2-визуализация-итерации-ценности">8.2 Визуализация итерации ценности</h3>
      <p>
        Наблюдайте, как значения <Math display={false}>{`V(S_1)`}</Math> и <Math display={false}>{`V(S_2)`}</Math> сходятся к оптимуму в MDP с двумя состояниями. Измените <Math display={false}>{`\\gamma`}</Math>, чтобы увидеть влияние на скорость и характер сходимости:
      </p>

      <ValueIterationChart />

      <p>
        Значения осциллируют, но расстояние до предела убывает ~в <Math display={false}>{`\\gamma`}</Math> раза каждую итерацию — визуальное подтверждение <strong className="text-foreground">контрактности оператора Беллмана</strong>.
      </p>
    </Section>

    {/* ── 8b. Практические задачи по пределам ── */}
    <Section icon={<GraduationCap className="w-5 h-5 text-accent" />} title="8b. Практические задачи: пределы и сходимость">
      <p>Проверьте своё понимание пределов на задачах с нарастающей сложностью. Задачи со значком 🤖 напрямую связаны с RL.</p>

      <div className="my-6 p-5 rounded-lg bg-card/60 border border-primary/20 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-primary px-2 py-0.5 rounded bg-primary/10">⭐ Задача 1.1</span>
          <span className="text-xs text-muted-foreground">Базовая</span>
        </div>
        <p><strong className="text-foreground">Найти:</strong> <Math display={false}>{`\\lim_{n \\to \\infty} \\dfrac{3n^2 + 5n}{n^2 - 1}`}</Math></p>
        <details className="text-sm">
          <summary className="text-primary cursor-pointer hover:text-primary/80">💡 Подсказка</summary>
          <p className="mt-2 text-muted-foreground">Разделите числитель и знаменатель на <Math display={false}>{`n^2`}</Math> (наибольшую степень в знаменателе).</p>
        </details>
        <details className="text-sm">
          <summary className="text-primary cursor-pointer hover:text-primary/80">📝 Решение</summary>
          <div className="mt-2 space-y-2">
            <p className="text-muted-foreground">Делим на <Math display={false}>{`n^2`}</Math>:</p>
            <Math>{`\\lim_{n \\to \\infty} \\frac{3 + \\frac{5}{n}}{1 - \\frac{1}{n^2}}`}</Math>
            <p className="text-muted-foreground">При <Math display={false}>{`n \\to \\infty`}</Math>: <Math display={false}>{`5/n \\to 0`}</Math>, <Math display={false}>{`1/n^2 \\to 0`}</Math>.</p>
            <p><span className="inline-block px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-sm font-bold">Ответ: 3</span></p>
          </div>
        </details>
      </div>

      <div className="my-6 p-5 rounded-lg bg-card/60 border border-secondary/20 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-secondary px-2 py-0.5 rounded bg-secondary/10">⭐⭐ Задача 1.2</span>
          <span className="text-xs text-muted-foreground">Средняя</span>
        </div>
        <p><strong className="text-foreground">Найти:</strong> <Math display={false}>{`\\lim_{n \\to \\infty} \\dfrac{2^n + 3^n}{3^n}`}</Math></p>
        <details className="text-sm">
          <summary className="text-secondary cursor-pointer hover:text-secondary/80">💡 Подсказка</summary>
          <p className="mt-2 text-muted-foreground">Разделите на <Math display={false}>{`3^n`}</Math>. Вспомните: если <Math display={false}>{`|q| < 1`}</Math>, то <Math display={false}>{`q^n \\to 0`}</Math>.</p>
        </details>
        <details className="text-sm">
          <summary className="text-secondary cursor-pointer hover:text-secondary/80">📝 Решение</summary>
          <div className="mt-2 space-y-2">
            <Math>{`\\lim_{n \\to \\infty} \\left(\\frac{2}{3}\\right)^n + 1`}</Math>
            <p className="text-muted-foreground">Поскольку <Math display={false}>{`|2/3| < 1`}</Math>, имеем <Math display={false}>{`(2/3)^n \\to 0`}</Math>.</p>
            <p><span className="inline-block px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-sm font-bold">Ответ: 1</span></p>
          </div>
        </details>
      </div>

      <div className="my-6 p-5 rounded-lg bg-card/60 border border-accent/20 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-accent px-2 py-0.5 rounded bg-accent/10">🤖 Задача 1.3</span>
          <span className="text-xs text-muted-foreground">Применение в RL</span>
        </div>
        <p><strong className="text-foreground">Условие.</strong> В процессе Q-learning ошибка агента на <Math display={false}>{`n`}</Math>-м шаге:</p>
        <Math>{`\\varepsilon_n = 0{,}5^n + \\frac{1}{n+1}`}</Math>
        <p>К какому значению стремится ошибка при <Math display={false}>{`n \\to \\infty`}</Math>?</p>
        <details className="text-sm">
          <summary className="text-accent cursor-pointer hover:text-accent/80">💡 Подсказка</summary>
          <p className="mt-2 text-muted-foreground">Используйте: если <Math display={false}>{`|q| < 1`}</Math>, то <Math display={false}>{`q^n \\to 0`}</Math>; и <Math display={false}>{`1/n \\to 0`}</Math>.</p>
        </details>
        <details className="text-sm">
          <summary className="text-accent cursor-pointer hover:text-accent/80">📝 Решение</summary>
          <div className="mt-2 space-y-2">
            <Math>{`\\lim_{n \\to \\infty} \\varepsilon_n = \\lim_{n \\to \\infty} 0{,}5^n + \\lim_{n \\to \\infty} \\frac{1}{n+1} = 0 + 0 = 0`}</Math>
            <p><span className="inline-block px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-sm font-bold">Ответ: 0</span></p>
            <p className="text-muted-foreground">Ошибка агента стремится к нулю — это математическое основание <strong className="text-foreground">сходимости Q-learning</strong>.</p>
          </div>
        </details>
      </div>

      <InfoBox variant="accent">
        <p className="text-sm font-semibold text-accent mb-2">Теорема о сэндвиче (Squeeze Theorem)</p>
        <p className="text-sm">Если <Math display={false}>{`a_n \\le b_n \\le c_n`}</Math> и <Math display={false}>{`\\lim a_n = \\lim c_n = L`}</Math>, то <Math display={false}>{`\\lim b_n = L`}</Math>. Используется в доказательстве сходимости TD-методов.</p>
      </InfoBox>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="связь-с-rl-условия-роббинса-монро">🔗 Связь с RL: условия Роббинса-Монро</h3>
      <p>
        Сходимость последовательностей — фундамент теорем о сходимости RL. При выполнении условий <strong className="text-foreground">Роббинса-Монро</strong> (<Math display={false}>{`\\sum \\alpha_t = \\infty`}</Math>, <Math display={false}>{`\\sum \\alpha_t^2 < \\infty`}</Math>) TD-ошибка <Math display={false}>{`\\delta_t`}</Math> образует <strong className="text-primary">сходящуюся последовательность</strong>: <Math display={false}>{`\\delta_t \\to 0`}</Math>.
      </p>
      <p>Это математическое доказательство того, что Q-learning находит оптимум.</p>

      <CyberCodeBlock language="python" filename="sequences_convergence.py">
{`import numpy as np

# ── Численная проверка пределов ──
def numeric_limit(name, f, n_max=100_000):
    vals = [f(n) for n in [100, 1000, 10000, n_max]]
    print(f'\\n{name}')
    for n, v in zip([100, 1000, 10000, n_max], vals):
        print(f'  n={n:>7}: {v:.8f}')
    print(f'  Оценка предела ≈ {vals[-1]:.6f}')

numeric_limit('Задача 1.1', lambda n: (3*n**2 + 5*n) / (n**2 - 1))
numeric_limit('Задача 1.2', lambda n: (2**n + 3**n) / 3**n)
numeric_limit('Задача 1.3 (RL)', lambda n: 0.5**n + 1/(n+1))

# ── TD-ошибка как сходящаяся последовательность ──
def simulate_q_convergence(n_steps=300, alpha=0.1):
    q_true, q_est, td_errors = 10.0, 0.0, []
    for _ in range(n_steps):
        td_error = q_true - q_est
        q_est += alpha * td_error
        td_errors.append(abs(td_error))
    return td_errors

td_err = simulate_q_convergence()
print(f"\\nTD-ошибка через 300 шагов: {td_err[-1]:.8f} → 0")`}
      </CyberCodeBlock>
    </Section>

    {/* ── 9. Источники ── */}
    <Section icon={<BookOpen className="w-5 h-5 text-accent" />} title="9. Источники">
      <ul className="list-disc list-inside space-y-3 text-sm">
        <li><strong className="text-foreground">Саттон Р., Барто Э.</strong> «Обучение с подкреплением: Введение», 2-е изд. — Глава 3: MDP, дисконтирование, уравнения Беллмана. Глава 4: алгоритмы DP.</li>
        <li><strong className="text-foreground">Silver D.</strong> «Reinforcement Learning course» (UCL, 2015) — видеолекции от создателя AlphaGo.</li>
        <li><strong className="text-foreground">Khan Academy</strong> — раздел «Пределы и ряды» (курс по математическому анализу).</li>
        <li><strong className="text-foreground">Bertsekas D.</strong> «Dynamic Programming and Optimal Control» — сжимающие отображения и доказательства сходимости.</li>
      </ul>
    </Section>

    {/* ── Глоссарий ── */}
    <Section icon={<GraduationCap className="w-5 h-5 text-primary" />} title="Мини-глоссарий">
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
          definition="Наличие конечного предела частичных сумм."
        />
        <GlossaryItem
          term="Дисконтирование"
          formula={`G_t = \\sum_{k=0}^{\\infty} \\gamma^k R_{t+k+1}, \\quad \\gamma \\in [0, 1)`}
          definition="Умножение вознаграждения на γᵗ за задержку на t шагов."
        />
        <GlossaryItem
          term="Контрактное отображение"
          formula={`d(F(x), F(y)) \\leq \\kappa\\, d(x, y), \\quad \\kappa < 1`}
          definition="Отображение с единственной неподвижной точкой. Оператор Беллмана — γ-сжатие в max-норме."
        />
      </div>
    </Section>
  </>
);

/* ─── Local helpers ─── */

const slugify = (t: string) => t.toLowerCase().replace(/[^\wа-яё]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60);

const Section = ({
  icon,
  title,
  children,
  rightSlot,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
}) => (
  <section className="mt-12 first:mt-0 scroll-mt-28" id={slugify(title)}>
    <div className="flex items-center flex-wrap gap-3 mb-6">
      {icon}
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      {rightSlot && <div className="ml-auto">{rightSlot}</div>}
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

import React from "react";

export default Part1Limits;
