import { lazy, Suspense, useState, useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";
import SEOHead from "@/components/SEOHead";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { ArrowLeft, Download, Snowflake, BookOpen, Brain, Calculator, Settings, Dumbbell, BarChart3, Gamepad2, FlaskConical, FileText } from "lucide-react";

const TOC_ITEMS = [
  { id: "rl-basics", label: "Что такое RL?", emoji: "🌍", Icon: BookOpen },
  { id: "frozen-lake-env", label: "Среда Frozen Lake", emoji: "🧊", Icon: Snowflake },
  { id: "q-math", label: "Математика Q-Learning", emoji: "📐", Icon: Calculator },
  { id: "setup", label: "Настройка окружения", emoji: "⚙️", Icon: Settings },
  { id: "init", label: "Инициализация", emoji: "🏗️", Icon: Brain },
  { id: "training", label: "Обучение агента", emoji: "🏋️", Icon: Dumbbell },
  { id: "analysis", label: "Анализ результатов", emoji: "📊", Icon: BarChart3 },
  { id: "testing", label: "Тестирование агента", emoji: "🎮", Icon: Gamepad2 },
  { id: "experiments", label: "Эксперименты", emoji: "🧪", Icon: FlaskConical },
];

const Math = lazy(() => import("@/components/Math"));

const MathBlock = ({ children }: { children: string }) => (
  <Suspense fallback={null}>
    <Math display>{children}</Math>
  </Suspense>
);

const InlineMath = ({ children }: { children: string }) => (
  <Suspense fallback={null}>
    <Math>{children}</Math>
  </Suspense>
);

const SectionHeader = ({ icon, title, id }: { icon: React.ReactNode; title: string; id: string }) => (
  <div className="flex items-center gap-3 mb-6 scroll-mt-28" id={id}>
    {icon}
    <h2 className="text-2xl font-bold text-foreground">{title}</h2>
  </div>
);

const FrozenLakeProject = () => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    TOC_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Frozen Lake × Q-Learning | Neon Unity Neural"
        description="Интерактивный учебный модуль по Q-Learning на примере задачи Frozen Lake. Уравнение Беллмана, ε-greedy, тепловые карты Q-таблицы."
      />
      <Navbar />
      <ScrollProgressBar />

      {/* Hero */}
      <div className="pt-20 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/unity-projects")}
            className="text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> К проектам
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Snowflake className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold">
                <span className="bg-gradient-neon bg-clip-text text-transparent">
                  🧊 Frozen Lake × Q-Learning
                </span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Интерактивный учебный модуль по обучению с подкреплением
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <span>📐 Уравнение Беллмана</span>
            <span>🧠 Алгоритм Q-Learning</span>
            <span>🎮 Живая визуализация</span>
            <span>📊 Тепловые карты</span>
          </div>

          <Button variant="outline" size="sm" asChild className="border-primary/50 text-primary hover:bg-primary/10">
            <a href="/FrozenLake_QLearning_Module.ipynb" download className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Скачать IPYNB Frozen Lake
            </a>
          </Button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="container mx-auto px-4 py-8 flex gap-8">
        {/* Sticky sidebar TOC */}
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="sticky top-24 space-y-1">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Содержание
            </h2>
            {TOC_ITEMS.map(({ id, label, Icon }, i) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`flex items-center gap-2 w-full text-left text-sm px-3 py-2 rounded-md transition-colors cursor-pointer border-l-2 ${
                  activeId === id
                    ? "border-primary text-primary bg-primary/10 font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {i + 1}. {label}
              </button>
            ))}

            <div className="mt-6 pt-4 border-t border-border/30">
              <Button variant="outline" size="sm" asChild className="w-full border-primary/50 text-primary hover:bg-primary/10">
                <a href="/FrozenLake_QLearning_Module.ipynb" download className="flex items-center gap-2 justify-center">
                  <Download className="w-4 h-4" />
                  Скачать IPYNB
                </a>
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">

        {/* Inline TOC */}
        <Card className="mb-10 bg-card/60 border-border/30 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Содержание модуля
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TOC_ITEMS.map(({ id, label, emoji, Icon }, i) => {
                const neonColors = [
                  { border: "border-cyan-500/40", shadow: "shadow-[0_0_15px_rgba(0,212,255,0.15)]", hoverShadow: "hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]", text: "text-cyan-400", bg: "hover:bg-cyan-500/10" },
                  { border: "border-purple-500/40", shadow: "shadow-[0_0_15px_rgba(168,85,247,0.15)]", hoverShadow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]", text: "text-purple-400", bg: "hover:bg-purple-500/10" },
                  { border: "border-pink-500/40", shadow: "shadow-[0_0_15px_rgba(236,72,153,0.15)]", hoverShadow: "hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]", text: "text-pink-400", bg: "hover:bg-pink-500/10" },
                  { border: "border-green-500/40", shadow: "shadow-[0_0_15px_rgba(34,197,94,0.15)]", hoverShadow: "hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]", text: "text-green-400", bg: "hover:bg-green-500/10" },
                  { border: "border-amber-500/40", shadow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]", hoverShadow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]", text: "text-amber-400", bg: "hover:bg-amber-500/10" },
                  { border: "border-blue-500/40", shadow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]", hoverShadow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]", text: "text-blue-400", bg: "hover:bg-blue-500/10" },
                  { border: "border-rose-500/40", shadow: "shadow-[0_0_15px_rgba(244,63,94,0.15)]", hoverShadow: "hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]", text: "text-rose-400", bg: "hover:bg-rose-500/10" },
                  { border: "border-teal-500/40", shadow: "shadow-[0_0_15px_rgba(20,184,166,0.15)]", hoverShadow: "hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]", text: "text-teal-400", bg: "hover:bg-teal-500/10" },
                  { border: "border-orange-500/40", shadow: "shadow-[0_0_15px_rgba(249,115,22,0.15)]", hoverShadow: "hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]", text: "text-orange-400", bg: "hover:bg-orange-500/10" },
                ];
                const c = neonColors[i % neonColors.length];
                return (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className={`flex flex-col items-center gap-2 px-4 py-5 rounded-xl border ${c.border} ${c.shadow} ${c.hoverShadow} ${c.bg} bg-background/60 backdrop-blur-sm transition-all duration-300 cursor-pointer group text-center hover:scale-[1.03] hover:-translate-y-0.5`}
                  >
                    <Icon className={`w-6 h-6 ${c.text} shrink-0 drop-shadow-sm`} />
                    <span className={`text-sm font-medium text-foreground group-hover:${c.text} transition-colors`}>
                      {i + 1}. {emoji} {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <section className="mb-12 scroll-mt-28" id="rl-basics">
          <SectionHeader icon={<BookOpen className="w-6 h-6 text-primary" />} title="1. 🌍 Что такое обучение с подкреплением?" id="rl-basics-header" />

          <div className="text-muted-foreground leading-relaxed space-y-4">
            <p>
              Представьте, что вы учите собаку новому трюку. Вы не можете объяснить собаке словами, что нужно делать. Вместо этого:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Собака <strong className="text-foreground">пробует</strong> разные действия (садится, ложится, даёт лапу...)</li>
              <li>Если действие <strong className="text-foreground">правильное</strong> — вы даёте <strong className="text-foreground">лакомство</strong> (награда! 🦴)</li>
              <li>Если действие <strong className="text-foreground">неправильное</strong> — лакомства нет (нулевая награда)</li>
              <li>Через много попыток собака <strong className="text-foreground">запоминает</strong>, какие действия приводят к награде</li>
            </ul>
            <p>
              Именно так работает <strong className="text-foreground">обучение с подкреплением</strong> (Reinforcement Learning, RL):
            </p>

            <Card className="bg-card/40 border-primary/20">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">🔑 Четыре ключевых понятия</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-3 text-primary">Понятие</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">Что это</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">Пример (Frozen Lake)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { concept: "Агент (Agent)", what: "Тот, кто учится", example: "Наш персонаж на льду" },
                        { concept: "Среда (Environment)", what: "Мир, в котором агент действует", example: "Замёрзшее озеро 4×4" },
                        { concept: "Действие (Action)", what: "Что агент может сделать", example: "Пойти влево / вправо / вверх / вниз" },
                        { concept: "Награда (Reward)", what: "Обратная связь от среды", example: "+1 за достижение цели, 0 иначе" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-border/20">
                          <td className="py-2 px-3 text-foreground font-semibold">{row.concept}</td>
                          <td className="py-2 px-3 text-muted-foreground">{row.what}</td>
                          <td className="py-2 px-3 text-muted-foreground">{row.example}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-primary/20">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">🔄 Цикл обучения</h3>
                <CyberCodeBlock language="pseudo">
{`       ┌─────────────────────────────────┐
       │                                 │
       ▼                                 │
   ┌────────┐   действие    ┌────────┐   │
   │ АГЕНТ  │ ────────────► │ СРЕДА  │   │
   │        │               │        │   │
   │  «Что  │ ◄──────────── │ «Вот   │   │
   │  мне   │  новое        │  что   │   │
   │делать?»│  состояние    │  вышло»│   │
   │        │  + награда    │        │   │
   └────────┘               └────────┘   │
       │                                 │
       └─────────────────────────────────┘`}
                </CyberCodeBlock>
                <p className="text-muted-foreground mt-2">
                  <strong className="text-foreground">Цель агента</strong> — научиться выбирать такие действия, которые приносят <strong className="text-foreground">максимальную суммарную награду</strong> за всю игру.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 2: Frozen Lake Environment */}
        <section className="mb-12 scroll-mt-28" id="frozen-lake-env">
          <SectionHeader icon={<Snowflake className="w-6 h-6 text-primary" />} title="2. 🧊 Среда Frozen Lake" id="frozen-lake-env-header" />

          <div className="text-muted-foreground leading-relaxed space-y-4">
            <p>
              <strong className="text-foreground">Frozen Lake</strong> — это классическая задача из библиотеки Gymnasium (OpenAI Gym).
              Представьте замёрзшее озеро размером 4×4 клетки:
            </p>

            <Card className="bg-card/40 border-primary/20">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">🗺️ Карта озера</h3>
                <CyberCodeBlock language="pseudo">
{`  ┌─────┬─────┬─────┬─────┐
  │  S  │  F  │  F  │  F  │   S = Start    (Старт — начальная позиция)
  ├─────┼─────┼─────┼─────┤   F = Frozen   (Лёд — безопасная клетка)
  │  F  │  H  │  F  │  H  │   H = Hole     (Прорубь — провал! Конец игры)
  ├─────┼─────┼─────┼─────┤   G = Goal     (Цель — подарок! Награда +1)
  │  F  │  F  │  F  │  H  │
  ├─────┼─────┼─────┼─────┤
  │  H  │  F  │  F  │  G  │
  └─────┴─────┴─────┴─────┘`}
                </CyberCodeBlock>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-primary/20">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">📏 Числа в среде</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-3 text-primary">Параметр</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">Значение</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">Пояснение</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { p: "Количество состояний", v: "16", d: "Клетки с номерами 0..15 (4×4 сетка)" },
                        { p: "Количество действий", v: "4", d: "← Влево (0), ↓ Вниз (1), → Вправо (2), ↑ Вверх (3)" },
                        { p: "Награда за цель", v: "+1.0", d: "Агент дошёл до клетки G" },
                        { p: "Награда за прорубь", v: "0.0", d: "Агент упал — эпизод окончен" },
                        { p: "Награда за шаг", v: "0.0", d: "Простое перемещение ничего не даёт" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-border/20">
                          <td className="py-2 px-3 text-foreground font-semibold">{row.p}</td>
                          <td className="py-2 px-3 font-mono text-primary">{row.v}</td>
                          <td className="py-2 px-3 text-muted-foreground">{row.d}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-secondary/20">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">❄️ Скользкий лёд (is_slippery)</h3>
                <p className="text-muted-foreground">
                  В стандартной версии Frozen Lake лёд <strong className="text-foreground">скользкий</strong>: когда агент выбирает направление,
                  он с вероятностью <strong className="text-foreground">1/3</strong> двигается туда, куда хотел, и с вероятностью <strong className="text-foreground">1/3</strong> — в каждую из двух перпендикулярных сторон.
                </p>
                <p className="text-primary mt-3 text-sm border-l-2 border-primary/50 pl-3">
                  <strong>В нашем проекте</strong> мы начнём с <code className="bg-primary/10 px-1 rounded">is_slippery=False</code> (лёд не скользит),
                  чтобы результат обучения был наглядным. Потом вы сможете включить скольжение и увидеть разницу!
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 3: Math */}
        <section className="mb-12 scroll-mt-28" id="q-math">
          <SectionHeader icon={<Calculator className="w-6 h-6 text-primary" />} title="3. 📐 Математика Q-Learning" id="q-math-header" />

          <div className="text-muted-foreground leading-relaxed space-y-4">
            <p>Не пугайтесь формул! Мы разберём каждый символ.</p>

            <Card className="bg-card/40 border-primary/20">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">🧠 Что такое Q-таблица?</h3>
                <p className="text-muted-foreground mb-3">
                  <strong className="text-foreground">Q-таблица</strong> — это обычная таблица (как в Excel), где:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li><strong className="text-foreground">Строки</strong> = состояния (клетки озера: 0, 1, 2, ..., 15)</li>
                  <li><strong className="text-foreground">Столбцы</strong> = действия (←, ↓, →, ↑)</li>
                  <li><strong className="text-foreground">Значение в ячейке</strong> = насколько «выгодно» выполнить это действие в этом состоянии</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  <strong className="text-foreground">Задача обучения</strong> — заполнить эту таблицу правильными числами, чтобы агент всегда знал, какое действие лучше.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-accent/20">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">📝 Уравнение Беллмана</h3>
                <p className="text-muted-foreground mb-4">Формула обновления Q-значений:</p>
                <div className="overflow-x-auto py-2">
                  <MathBlock>{`\\enfOp{Q}(\\enfVar{s}, a) \\leftarrow \\enfOp{Q}(\\enfVar{s}, a) + \\enfPar{\\alpha} \\cdot \\Big[ \\enfTgt{r} + \\enfPar{\\gamma} \\cdot \\max_{a'} \\enfOp{Q}(\\enfVar{s}', a') - \\enfOp{Q}(\\enfVar{s}, a) \\Big]`}</MathBlock>
                </div>

                <p className="text-muted-foreground mt-4 mb-3"><strong className="text-foreground">Разберём каждый символ:</strong></p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-3 text-primary">Символ</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">Название</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">Что означает</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">Аналогия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { s: "Q(s, a)", n: "Q-значение", m: "Текущая оценка «выгодности» действия a в состоянии s", a: "Ваша текущая оценка ресторана" },
                        { s: "α", n: "Скорость обучения", m: "Насколько сильно мы доверяем новой информации (0..1)", a: "Как быстро меняете мнение" },
                        { s: "r", n: "Награда (reward)", m: "Что мы получили прямо сейчас", a: "Чаевые за хорошее обслуживание" },
                        { s: "γ", n: "Дисконтирование", m: "Насколько важны будущие награды (0..1)", a: "Терпение: ждать ли большую награду?" },
                        { s: "s'", n: "Новое состояние", m: "Куда мы попали после действия", a: "Следующая остановка" },
                        { s: "max Q(s',a')", n: "Лучшее будущее Q", m: "Максимальная оценка в новом состоянии", a: "Лучшее, что можно сделать дальше" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-border/20">
                          <td className="py-2 px-3 font-mono text-primary">{row.s}</td>
                          <td className="py-2 px-3 text-foreground font-semibold">{row.n}</td>
                          <td className="py-2 px-3 text-muted-foreground">{row.m}</td>
                          <td className="py-2 px-3 text-muted-foreground italic">{row.a}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-primary/20">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">🔍 Разбор формулы по шагам</h3>
                <p className="text-muted-foreground mb-3">Перепишем формулу простым языком:</p>
                <div className="overflow-x-auto py-2">
                  <MathBlock>{`\\underbrace{\\enfOp{Q}_{\\text{новое}}}_{\\text{обновлённая оценка}} = \\underbrace{\\enfOp{Q}_{\\text{старое}}}_{\\text{что было}} + \\underbrace{\\enfPar{\\alpha}}_{\\text{скорость}} \\cdot \\underbrace{\\Big[ \\overbrace{\\enfTgt{r}}^{\\text{награда сейчас}} + \\overbrace{\\enfPar{\\gamma} \\cdot \\max \\enfOp{Q}_{\\text{будущее}}}^{\\text{лучшее впереди}} - \\overbrace{\\enfOp{Q}_{\\text{старое}}}^{\\text{что думали}} \\Big]}_{\\text{ошибка предсказания (TD-ошибка)}}`}</MathBlock>
                </div>
                <p className="text-muted-foreground mt-4">
                  <strong className="text-foreground">Словами:</strong>
                </p>
                <blockquote className="border-l-2 border-primary/50 pl-4 my-3 text-foreground">
                  <strong>Новая оценка</strong> = <strong>Старая оценка</strong> + <strong>Скорость обучения</strong> × <strong>Ошибка предсказания</strong>
                </blockquote>
                <p className="text-muted-foreground">
                  А <strong className="text-foreground">ошибка предсказания</strong> — это разница между тем, <strong className="text-foreground">что оказалось на самом деле</strong> (награда + лучшее будущее),
                  и тем, <strong className="text-foreground">что мы думали раньше</strong> (старая оценка).
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-secondary/20">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">🎯 Числовой пример</h3>
                <p className="text-muted-foreground mb-3">Допустим:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
                  <li>Агент в клетке <strong className="text-foreground">6</strong>, идёт <strong className="text-foreground">вправо</strong> и попадает в клетку <strong className="text-foreground">7</strong></li>
                  <li><InlineMath>{"\\enfOp{Q}(6, \\text{вправо}) = 0.3"}</InlineMath> (старая оценка)</li>
                  <li>Награда <InlineMath>{"r = 0"}</InlineMath> (просто перешёл на лёд)</li>
                  <li><InlineMath>{"\\max \\enfOp{Q}(7, \\cdot) = 0.8"}</InlineMath> (лучшая оценка в клетке 7)</li>
                  <li><InlineMath>{"\\enfPar{\\alpha} = 0.1, \\enfPar{\\gamma} = 0.99"}</InlineMath></li>
                </ul>
                <p className="text-muted-foreground mt-3">Считаем:</p>
                <div className="overflow-x-auto py-2 space-y-1">
                  <MathBlock>{`\\enfOp{Q}(6, \\text{вправо}) \\leftarrow 0.3 + 0.1 \\cdot [0 + 0.99 \\cdot 0.8 - 0.3]`}</MathBlock>
                  <MathBlock>{`= 0.3 + 0.1 \\cdot [0 + 0.792 - 0.3] = 0.3 + 0.1 \\cdot 0.492 = \\mathbf{0.3492}`}</MathBlock>
                </div>
                <p className="text-muted-foreground mt-3">
                  Оценка <strong className="text-foreground">немного выросла</strong>, потому что из клетки 7 есть хорошие перспективы!
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-primary/20">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">🎲 Стратегия ε-greedy (эпсилон-жадная)</h3>
                <p className="text-muted-foreground mb-3">Как агент выбирает действия во время обучения?</p>
                <div className="overflow-x-auto py-2">
                  <MathBlock>{`\\text{Действие} = \\begin{cases} \\text{случайное действие} & \\text{с вероятностью } \\enfPar{\\varepsilon} \\\\ \\arg\\max_a \\enfOp{Q}(\\enfVar{s}, a) & \\text{с вероятностью } 1 - \\enfPar{\\varepsilon} \\end{cases}`}</MathBlock>
                </div>
                <p className="text-muted-foreground mt-3">Простыми словами:</p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li>С вероятностью <InlineMath>{"\\enfPar{\\varepsilon}"}</InlineMath> — <strong className="text-foreground">исследуем</strong> (пробуем случайное действие)</li>
                  <li>С вероятностью <InlineMath>{"1 - \\enfPar{\\varepsilon}"}</InlineMath> — <strong className="text-foreground">используем</strong> (выбираем лучшее известное действие)</li>
                </ul>
                <p className="text-muted-foreground mt-3">
                  В начале обучения <InlineMath>{"\\enfPar{\\varepsilon}"}</InlineMath> большой (много исследуем), потом <strong className="text-foreground">постепенно уменьшается</strong> (всё больше доверяем таблице).
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 4: Setup */}
        <section className="mb-12 scroll-mt-28" id="setup">
          <SectionHeader icon={<Settings className="w-6 h-6 text-primary" />} title="4. ⚙️ Настройка окружения" id="setup-header" />

          <div className="text-muted-foreground leading-relaxed space-y-4">
            <p>Установим и импортируем всё необходимое:</p>

            <CyberCodeBlock language="python" filename="setup.py">
{`# 📦 УСТАНОВКА БИБЛИОТЕК
# Если библиотеки не установлены — раскомментируйте строку ниже:
# !pip install gymnasium numpy matplotlib

import gymnasium as gym     # Среда Frozen Lake
import numpy as np          # Работа с массивами и числами
import matplotlib.pyplot as plt          # Графики
import matplotlib.colors as mcolors      # Цветовые карты
from matplotlib.patches import FancyBboxPatch, Circle
from matplotlib import animation
from IPython.display import display, HTML, clear_output
import time
import warnings
import LabPracticeSection from "@/components/LabPracticeSection";
warnings.filterwarnings('ignore')

# ── Определения для отображения действий ──
# ← Влево (0), ↓ Вниз (1), → Вправо (2), ↑ Вверх (3)
ACTION_ARROWS = ['←', '↓', '→', '↑']
ACTION_NAMES = ['Влево', 'Вниз', 'Вправо', 'Вверх']`}
            </CyberCodeBlock>
          </div>
        </section>

        {/* Section 5: Init */}
        <section className="mb-12 scroll-mt-28" id="init">
          <SectionHeader icon={<Brain className="w-6 h-6 text-primary" />} title="5. 🏗️ Инициализация среды и Q-таблицы" id="init-header" />

          <div className="text-muted-foreground leading-relaxed space-y-4">
            <p>Создадим среду и пустую Q-таблицу, которую агент будет заполнять в процессе обучения.</p>

            <Card className="bg-card/40 border-primary/20">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">📋 Гиперпараметры</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-3 text-primary">Параметр</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">Обозначение</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">Значение</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">Зачем</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { p: "Кол-во эпизодов", d: "n_episodes", v: "2000", w: "Сколько раз агент пройдёт игру от начала до конца" },
                        { p: "Макс. шагов", d: "max_steps", v: "100", w: "Максимум шагов в одном эпизоде" },
                        { p: "Скорость обучения", d: "α", v: "0.8", w: "Как быстро обновлять Q-значения" },
                        { p: "Дисконтирование", d: "γ", v: "0.95", w: "Важность будущих наград" },
                        { p: "Начальный ε", d: "ε_max", v: "1.0", w: "Старт: 100% случайных действий" },
                        { p: "Финальный ε", d: "ε_min", v: "0.01", w: "Финиш: почти всегда лучшее действие" },
                        { p: "Скорость затухания ε", d: "decay_rate", v: "0.001", w: "Как быстро снижается ε" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-border/20">
                          <td className="py-2 px-3 text-foreground">{row.p}</td>
                          <td className="py-2 px-3 font-mono text-primary text-xs">{row.d}</td>
                          <td className="py-2 px-3 font-mono text-secondary">{row.v}</td>
                          <td className="py-2 px-3 text-muted-foreground">{row.w}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <CyberCodeBlock language="python" filename="init.py">
{`# 🏗️ ИНИЦИАЛИЗАЦИЯ СРЕДЫ И ПАРАМЕТРОВ

# ── 1. Создаём среду ──
env = gym.make(
    'FrozenLake-v1',     # Название среды
    map_name='4x4',       # Карта 4×4
    is_slippery=False,    # Лёд НЕ скользкий (для наглядности)
)

# ── 2. Размеры пространств ──
n_states  = env.observation_space.n   # 16 состояний (клеток)
n_actions = env.action_space.n        # 4 действия (←↓→↑)

# ── 3. Гиперпараметры Q-Learning ──
n_episodes  = 2000     # Количество эпизодов обучения
max_steps   = 100      # Максимум шагов в эпизоде

alpha       = 0.8      # Скорость обучения (learning rate)
gamma       = 0.95     # Коэффициент дисконтирования (discount factor)

epsilon_max   = 1.0    # Начальное значение ε
epsilon_min   = 0.01   # Минимальное значение ε
decay_rate    = 0.001  # Скорость затухания ε

# ── 4. Создаём Q-таблицу (все нули) ──
q_table = np.zeros((n_states, n_actions))

print(f"📋 Q-таблица создана: {q_table.shape[0]} строк × {q_table.shape[1]} столбцов")
print(f"   Все значения = 0.00 (агент ещё ничего не знает)")`}
            </CyberCodeBlock>
          </div>
        </section>

        {/* Section 6: Training */}
        <section className="mb-12 scroll-mt-28" id="training">
          <SectionHeader icon={<Dumbbell className="w-6 h-6 text-primary" />} title="6. 🏋️ Обучение агента (Q-Learning)" id="training-header" />

          <div className="text-muted-foreground leading-relaxed space-y-4">
            <p>Теперь запустим обучение! Ниже реализован полный алгоритм Q-Learning.</p>

            <Card className="bg-card/40 border-primary/20">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">🔄 Что происходит на каждом эпизоде:</h3>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Агент стартует в клетке <strong className="text-foreground">S</strong> (позиция 0)</li>
                  <li>Выбирает действие по стратегии <strong className="text-foreground">ε-greedy</strong></li>
                  <li>Выполняет действие → получает <strong className="text-foreground">новое состояние</strong> и <strong className="text-foreground">награду</strong></li>
                  <li><strong className="text-foreground">Обновляет Q-таблицу</strong> по уравнению Беллмана</li>
                  <li>Повторяет, пока не дойдёт до цели (G) или не провалится (H)</li>
                </ol>
              </CardContent>
            </Card>

            <CyberCodeBlock language="python" filename="train.py">
{`# 🏋️ ЦИКЛ ОБУЧЕНИЯ Q-LEARNING

rewards_per_episode = []      # Награда за каждый эпизод (0 или 1)
steps_per_episode = []        # Количество шагов в каждом эпизоде
epsilon_history = []          # История значений ε

for episode in range(n_episodes):
    # ── Сброс среды ──
    state, info = env.reset()
    total_reward = 0
    done = False
    truncated = False
    path = [state]
    
    # ── Вычисляем текущий ε ──
    # Формула: ε = ε_min + (ε_max - ε_min) × exp(-decay_rate × episode)
    epsilon = epsilon_min + (epsilon_max - epsilon_min) * np.exp(-decay_rate * episode)
    epsilon_history.append(epsilon)
    
    for step in range(max_steps):
        # ── 1. Выбор действия (ε-greedy) ──
        if np.random.random() < epsilon:
            # ИССЛЕДОВАНИЕ: случайное действие
            action = env.action_space.sample()
        else:
            # ИСПОЛЬЗОВАНИЕ: лучшее действие по Q-таблице
            action = np.argmax(q_table[state])
        
        # ── 2. Выполняем действие ──
        new_state, reward, done, truncated, info = env.step(action)
        path.append(new_state)
        
        # ── 3. Обновляем Q-таблицу (уравнение Беллмана!) ──
        # Q(s,a) ← Q(s,a) + α × [ r + γ × max Q(s',a') - Q(s,a) ]
        td_target = reward + gamma * np.max(q_table[new_state]) * (1 - done)
        td_error  = td_target - q_table[state, action]
        q_table[state, action] += alpha * td_error
        
        # ── 4. Переходим в новое состояние ──
        total_reward += reward
        state = new_state
        
        if done or truncated:
            break
    
    rewards_per_episode.append(total_reward)
    steps_per_episode.append(step + 1)`}
            </CyberCodeBlock>
          </div>
        </section>

        {/* Section 7: Analysis */}
        <section className="mb-12 scroll-mt-28" id="analysis">
          <SectionHeader icon={<BarChart3 className="w-6 h-6 text-primary" />} title="7. 📊 Анализ результатов обучения" id="analysis-header" />

          <div className="text-muted-foreground leading-relaxed space-y-4">
            <p>
              Теперь посмотрим, чему научился наш агент. Построим графики метрик и <strong className="text-foreground">тепловую карту Q-таблицы</strong>.
            </p>

            <Card className="bg-card/40 border-primary/20">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">🔥 Тепловая карта Q-таблицы</h3>
                <p className="text-muted-foreground">
                  Тепловая карта показывает <strong className="text-foreground">лучшее Q-значение</strong> в каждой клетке
                  (т.е. <InlineMath>{"\\max_a \\enfOp{Q}(\\enfVar{s},a)"}</InlineMath>). Чем ярче клетка — тем ближе она к цели по мнению агента.
                </p>
              </CardContent>
            </Card>

            <CyberCodeBlock language="python" filename="analysis.py">
{`# 📊 ВИЗУАЛИЗАЦИЯ РЕЗУЛЬТАТОВ
desc = env.unwrapped.desc
nrow, ncol = desc.shape

fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# ── Левая часть: тепловая карта max Q ──
max_q = np.max(q_table, axis=1).reshape(nrow, ncol)
ax1 = axes[0]
im = ax1.imshow(max_q, cmap='YlOrRd', interpolation='nearest')
for r in range(nrow):
    for c in range(ncol):
        s = r * ncol + c
        cell_type = desc[r][c]
        if cell_type == b'H':
            ax1.text(c, r, '🕳️', ha='center', va='center', fontsize=16)
        elif cell_type == b'G':
            ax1.text(c, r, '🎁', ha='center', va='center', fontsize=16)
        else:
            best_a = np.argmax(q_table[s])
            ax1.text(c, r, f'{max_q[r,c]:.2f}\\n{ACTION_ARROWS[best_a]}',
                    ha='center', va='center', fontsize=9, fontweight='bold')

ax1.set_title('🔥 Тепловая карта max Q(s,a)', fontsize=13, fontweight='bold')
plt.colorbar(im, ax=ax1, shrink=0.8)

# ── Вывод обученной Q-таблицы ──
print("📋 Обученная Q-таблица:")
for s in range(n_states):
    vals = [f"{q_table[s,a]:>9.4f}" for a in range(n_actions)]
    best = ACTION_NAMES[np.argmax(q_table[s])] if np.max(q_table[s]) > 0 else "—"
    print(f"  {s:>5d} │ {'  │  '.join(vals)} │ {best}")`}
            </CyberCodeBlock>
          </div>
        </section>

        {/* Section 8: Testing */}
        <section className="mb-12 scroll-mt-28" id="testing">
          <SectionHeader icon={<Gamepad2 className="w-6 h-6 text-primary" />} title="8. 🎮 Тестирование обученного агента" id="testing-header" />

          <div className="text-muted-foreground leading-relaxed space-y-4">
            <p>
              Теперь самое интересное — <strong className="text-foreground">смотрим, как агент проходит озеро!</strong>
            </p>
            <p>
              Агент будет использовать обученную Q-таблицу (всегда выбирать лучшее действие, без случайных ходов).
            </p>

            <CyberCodeBlock language="python" filename="test_agent.py">
{`# 🎮 ТЕСТИРОВАНИЕ ОБУЧЕННОГО АГЕНТА

def run_agent_animated(env, q_table, delay=0.6, run_label="Тест"):
    state, info = env.reset()
    done = False
    truncated = False
    path = [state]
    actions_taken = []
    total_reward = 0
    step_count = 0
    
    while not done and not truncated and step_count < max_steps:
        # Выбираем лучшее действие из Q-таблицы (жадная стратегия)
        action = np.argmax(q_table[state])
        actions_taken.append(action)
        
        # Выполняем действие
        new_state, reward, done, truncated, info = env.step(action)
        total_reward += reward
        step_count += 1
        path.append(new_state)
        state = new_state
    
    return total_reward, path

# ── Запускаем 3 тестовых прохода ──
results = []
for run in range(3):
    reward, path = run_agent_animated(env, q_table, delay=0.5,
                                       run_label=f"Проход {run+1}/3")
    results.append(reward)

print(f"🏁 Итого: {sum(results):.0f}/3 побед ({sum(results)/3*100:.0f}%)")`}
            </CyberCodeBlock>

            <Card className="bg-card/40 border-primary/20">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">📊 Массовое тестирование</h3>
                <p className="text-muted-foreground mb-3">
                  Запустим агента <strong className="text-foreground">1000 раз</strong> (без визуализации), чтобы точно измерить процент побед.
                </p>
              </CardContent>
            </Card>

            <CyberCodeBlock language="python" filename="mass_test.py">
{`# 📊 МАССОВОЕ ТЕСТИРОВАНИЕ (1000 ЭПИЗОДОВ)

n_test = 1000
test_wins = 0
test_steps_list = []

for _ in range(n_test):
    state, _ = env.reset()
    done = False
    truncated = False
    steps = 0
    
    while not done and not truncated and steps < max_steps:
        action = np.argmax(q_table[state])
        state, reward, done, truncated, _ = env.step(action)
        steps += 1
        if reward > 0:
            test_wins += 1
    
    test_steps_list.append(steps)

win_pct = test_wins / n_test * 100
avg_steps = np.mean(test_steps_list)

print(f"Тестовых эпизодов : {n_test}")
print(f"Побед             : {test_wins}")
print(f"Процент побед     : {win_pct:.1f}%")
print(f"Средн. шагов      : {avg_steps:.1f}")`}
            </CyberCodeBlock>
          </div>
        </section>

        {/* Section 9: Experiments */}
        <section className="mb-12 scroll-mt-28" id="experiments">
          <SectionHeader icon={<FlaskConical className="w-6 h-6 text-primary" />} title="9. 🧪 Эксперименты: попробуйте сами!" id="experiments-header" />

          <div className="text-muted-foreground leading-relaxed space-y-4">
            <p>
              Обучение с подкреплением — это экспериментальная наука. Попробуйте изменить параметры и посмотрите, что произойдёт!
            </p>

            <Card className="bg-card/40 border-primary/20">
              <CardContent className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-3">🔧 Что можно менять:</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-3 text-primary">Что изменить</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">Где в коде</th>
                        <th className="text-left py-2 px-3 text-muted-foreground">Ожидаемый эффект</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { w: "Включить скольжение", c: "is_slippery=True", e: "Задача станет намного сложнее! Понадобится больше эпизодов" },
                        { w: "Увеличить обучение", c: "n_episodes = 10000", e: "Агент будет учиться дольше, но точнее" },
                        { w: "Уменьшить α", c: "alpha = 0.1", e: "Более плавное, но медленное обучение" },
                        { w: "Уменьшить γ", c: "gamma = 0.5", e: "Агент будет «близорук» — не думает о будущем" },
                        { w: "Быстрое затухание ε", c: "decay_rate = 0.01", e: "Быстрый переход от исследования к использованию" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-border/20">
                          <td className="py-2 px-3 text-foreground">{row.w}</td>
                          <td className="py-2 px-3 font-mono text-xs text-primary">{row.c}</td>
                          <td className="py-2 px-3 text-muted-foreground">{row.e}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <CyberCodeBlock language="python" filename="experiment_slippery.py">
{`# 🧪 ЭКСПЕРИМЕНТ: СКОЛЬЗКИЙ ЛЁД

# Создаём скользкую среду
env_slippery = gym.make('FrozenLake-v1', map_name='4x4', is_slippery=True)

# Новые параметры (нужно больше обучения!)
q_table_slip = np.zeros((16, 4))
n_ep_slip = 20000     # Гораздо больше эпизодов!
alpha_slip = 0.1      # Меньше скорость обучения
gamma_slip = 0.99     # Больше «терпения»

rewards_slip = []

for ep in range(n_ep_slip):
    state, _ = env_slippery.reset()
    eps = max(0.01, 1.0 * np.exp(-0.0005 * ep))
    done = False
    
    for _ in range(200):
        if np.random.random() < eps:
            action = env_slippery.action_space.sample()
        else:
            action = np.argmax(q_table_slip[state])
        
        ns, r, done, trunc, _ = env_slippery.step(action)
        q_table_slip[state, action] += alpha_slip * (
            r + gamma_slip * np.max(q_table_slip[ns]) * (1 - done)
            - q_table_slip[state, action]
        )
        state = ns
        if done or trunc:
            break
    
    rewards_slip.append(r)

# Результат
win_rate = sum(rewards_slip[-1000:]) / 1000 * 100
print(f"🧊 Скользкий лёд: {win_rate:.1f}% побед (последние 1000 эпизодов)")
print("   (типичный результат: 70-80% — отлично для скользкого льда!)")

env_slippery.close()`}
            </CyberCodeBlock>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-12">
          <Card className="bg-card/60 border-primary/30">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">📝 Итоги модуля</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2 px-3 text-primary">Тема</th>
                      <th className="text-left py-2 px-3 text-muted-foreground">Ключевые идеи</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { t: "Обучение с подкреплением", k: "Агент учится через взаимодействие со средой, получая награды" },
                      { t: "Q-таблица", k: "Таблица «выгодности» каждого действия в каждом состоянии" },
                      { t: "Уравнение Беллмана", k: "Q(s,a) ← Q(s,a) + α[r + γ max Q(s',a') − Q(s,a)]" },
                      { t: "ε-greedy стратегия", k: "Баланс между исследованием и использованием" },
                      { t: "Frozen Lake", k: "Классическая тестовая среда для алгоритмов RL" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-border/20">
                        <td className="py-2 px-3 text-foreground font-semibold">{row.t}</td>
                        <td className="py-2 px-3 text-muted-foreground">{row.k}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-bold text-foreground mb-3">🚀 Что дальше?</h3>
                <ol className="list-decimal pl-6 space-y-1 text-muted-foreground">
                  <li><strong className="text-foreground">Deep Q-Network (DQN)</strong> — когда состояний слишком много для таблицы, используют нейросеть</li>
                  <li><strong className="text-foreground">Policy Gradient (REINFORCE)</strong> — агент напрямую учит стратегию, а не Q-значения</li>
                  <li><strong className="text-foreground">PPO</strong> — современный алгоритм, используемый в Unity ML-Agents</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Download button at bottom too */}
        <div className="flex justify-center mb-12">
          <Button size="lg" asChild className="bg-gradient-neon text-background hover:opacity-90">
            <a href="/FrozenLake_QLearning_Module.ipynb" download className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Скачать IPYNB Frozen Lake
            </a>
          </Button>
        </div>
        </main>
      </div>

      {/* Практика: собранная среда лаборатории для этой темы. */}
      <LabPracticeSection contextKey="/projects/frozen-lake" />

      <FooterSection />
    </div>
  );
};

export default FrozenLakeProject;
