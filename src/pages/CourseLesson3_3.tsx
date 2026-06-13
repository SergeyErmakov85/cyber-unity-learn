import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ChevronRight, CheckCircle2 } from "lucide-react";
import ProGate from "@/components/ProGate";
import LessonHeader from "@/components/LessonHeader";
import SectionNav, { SectionNavItem } from "@/components/SectionNav";
import LessonSidebarTOC from "@/components/LessonSidebarTOC";
import NextPrevLesson from "@/components/NextPrevLesson";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import SEOHead from "@/components/SEOHead";
import Quiz from "@/components/Quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLessonById } from "@/data/lessons";
import { markLessonComplete, isLessonComplete } from "@/lib/gamification";

import IntroSection from "@/components/lesson-3-3/IntroSection";
import Section0 from "@/components/lesson-3-3/Section0";
import Section1 from "@/components/lesson-3-3/Section1";
import Section2 from "@/components/lesson-3-3/Section2";
import Section3 from "@/components/lesson-3-3/Section3";
import Section4 from "@/components/lesson-3-3/Section4";
import Section5 from "@/components/lesson-3-3/Section5";
import Section6 from "@/components/lesson-3-3/Section6";
import Section7 from "@/components/lesson-3-3/Section7";
import Section8 from "@/components/lesson-3-3/Section8";
import Section9 from "@/components/lesson-3-3/Section9";
import Summary from "@/components/lesson-3-3/Summary";
import RelatedMaterials from "@/components/lesson-3-3/RelatedMaterials";

/** Полный список пунктов оглавления (для SectionNav). */
const SECTIONS: SectionNavItem[] = [
  { id: "intro", label: "Введение" },
  { id: "razdel-0-ot-samoigry-k-srede", label: "0 · От самоигры к среде" },
  { id: "razdel-1-trudnaya-zadacha", label: "1 · Трудная задача" },
  { id: "razdel-2-uchebnyy-plan-formalno", label: "2 · План формально" },
  { id: "razdel-3-kto-vedet-za-ruku", label: "3 · Кто ведёт за руку" },
  { id: "razdel-4-randomizatsiya", label: "4 · Рандомизация" },
  { id: "razdel-5-adr", label: "5 · ADR" },
  { id: "razdel-6-plr", label: "6 · PLR" },
  { id: "razdel-7-unity-ml-agents", label: "7 · Unity ML-Agents" },
  { id: "razdel-8-tyuning-grabli", label: "8 · Тюнинг и грабли" },
  { id: "razdel-9-ued", label: "9 · UED" },
  { id: "itogi", label: "Итоги" },
  { id: "istochniki", label: "Источники" },
];

/** Секции, рендерящиеся через map (intro → разделы → итоги). «istochniki» — отдельно (RelatedMaterials). */
const MAPPED_SECTIONS: Array<{ id: string; Comp: () => JSX.Element }> = [
  { id: "intro", Comp: IntroSection },
  { id: "razdel-0-ot-samoigry-k-srede", Comp: Section0 },
  { id: "razdel-1-trudnaya-zadacha", Comp: Section1 },
  { id: "razdel-2-uchebnyy-plan-formalno", Comp: Section2 },
  { id: "razdel-3-kto-vedet-za-ruku", Comp: Section3 },
  { id: "razdel-4-randomizatsiya", Comp: Section4 },
  { id: "razdel-5-adr", Comp: Section5 },
  { id: "razdel-6-plr", Comp: Section6 },
  { id: "razdel-7-unity-ml-agents", Comp: Section7 },
  { id: "razdel-8-tyuning-grabli", Comp: Section8 },
  { id: "razdel-9-ued", Comp: Section9 },
  { id: "itogi", Comp: Summary },
];

const SECTION_CLASS =
  "scroll-mt-24 py-12 md:py-16 px-5 md:px-10 bg-card/60 backdrop-blur-sm rounded-2xl border border-cyan-500/10";

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const QUIZ_QUESTIONS = [
  {
    question: "Почему трудную трассу почти невозможно выучить «в лоб», с нуля?",
    options: [
      "Не хватает памяти GPU для трудных уровней",
      "Награда разрежена → агент почти не финиширует, и оценка градиента политики почти всегда нулевая или шумовая",
      "PPO в принципе не работает на трудных средах",
      "Трудные среды нарушают марковское предположение",
    ],
    correctIndex: 1,
    explanation:
      "На трудной трассе агент почти никогда не доезжает до финальной награды. Сигнал слишком разрежен, поэтому оценка градиента политики почти всегда нулевая или чисто шумовая — учиться не на чем.",
  },
  {
    question: "Чем формально является учебный план (curriculum), по Bengio и др. (2009)?",
    options: [
      "Частным случаем метода продолжения: гладкую цель L₀ постепенно деформируют в трудную L⋆",
      "Разновидностью replay buffer",
      "Способом уменьшить число параметров сети",
      "Алгоритмом отбора признаков",
    ],
    correctIndex: 0,
    explanation:
      "Учебный план — частный случай метода продолжения (continuation method): начинаем со сглаженной, простой цели L₀ и по «ручке» λ:0→1 деформируем её в исходную трудную L⋆.",
  },
  {
    question: "Какую болезнь лечит рандомизация среды и почему она в RL особенно коварна?",
    options: [
      "Замедление инференса; рандомизация ускоряет сеть",
      "Переобучение (разрыв обобщения): по умолчанию обучение и тест идут на одной среде, и переобучение незаметно",
      "Нестационарность соперника в self-play",
      "Переоценку Q-функции",
    ],
    correctIndex: 1,
    explanation:
      "В RL по умолчанию агента обучают и тестируют на одной среде, поэтому переобучение скрыто. Раздельные train/test-уровни (Cobbe и др.) вскрывают разрыв обобщения; рандомизация заставляет учить инварианты.",
  },
  {
    question: "Что делает ADR (Automatic Domain Randomization)?",
    options: [
      "Фиксирует распределение среды на всё обучение",
      "Стартует с нерандомизированной среды и автоматически расширяет диапазоны случайности при достижении порога качества",
      "Курирует, какие уже виденные уровни переигрывать чаще",
      "Генерирует уровни через обучаемого учителя, максимизируя regret",
    ],
    correctIndex: 1,
    explanation:
      "ADR = учебный план над рандомизацией: начинаем без случайности и расширяем границы факторизованного распределения P_φ через boundary sampling, когда успешность на границе превышает порог t_H.",
  },
  {
    question: "Чем PLR принципиально отличается от ADR?",
    options: [
      "PLR требует полного контроля над генератором уровней",
      "PLR не управляет генератором (он — чёрный ящик), а лишь курирует, какие уровни переигрывать — по высокому |Â_t|",
      "PLR работает только в self-play",
      "PLR не использует преимущество (advantage)",
    ],
    correctIndex: 1,
    explanation:
      "PLR применяется, когда генератор уровней — чёрный ящик (только сиды). Менять распределение нельзя; PLR ведёт распределение над виденными уровнями и переигрывает те, у которых высок учебный потенциал ≈ средний |Â_t| (L1 value loss), со staleness-коррекцией.",
  },
];

const CompleteButton = () => {
  const [done, setDone] = useState<boolean>(() => isLessonComplete("3.3"));

  useEffect(() => {
    if (done) return;
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - window.innerHeight)) * 100;
      if (pct >= 90) {
        markLessonComplete("3.3");
        setDone(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [done]);

  const handleClick = () => {
    markLessonComplete("3.3");
    setDone(true);
  };

  return (
    <Button
      onClick={handleClick}
      disabled={done}
      size="lg"
      className="w-full md:w-auto bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold shadow-[0_0_24px_hsl(var(--primary)/0.45)] hover:shadow-[0_0_32px_hsl(280_85%_65%/0.55)] hover:scale-[1.02] transition-all disabled:opacity-80 disabled:cursor-default focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={done ? "Урок пройден" : "Отметить урок как пройденный"}
    >
      {done ? (
        <>
          <CheckCircle2 className="w-5 h-5 mr-2" aria-hidden="true" />
          Пройдено
        </>
      ) : (
        <>Отметить урок как пройденный ✓</>
      )}
    </Button>
  );
};

const CourseLesson3_3 = () => {
  const lesson = getLessonById("3.3")!;

  const content = (
    <>
      {/* Breadcrumbs */}
      <nav aria-label="Хлебные крошки" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-cyan-400 inline-flex items-center gap-1">
              <Home className="w-3.5 h-3.5" aria-hidden="true" /> Главная
            </Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
          <li>
            <Link to="/courses" className="hover:text-cyan-400">
              Курс
            </Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
          <li>
            <Link to="/courses#stage-3" className="hover:text-cyan-400">
              Уровень 3
            </Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
          <li className="text-foreground" aria-current="page">
            Урок 3.3
          </li>
        </ol>
      </nav>

      <LessonHeader
        title={lesson.title}
        subtitle={lesson.subtitle}
        isPro={lesson.isPro}
        estimatedMinutes={lesson.estimatedMinutes}
      />

      <div className="xl:hidden">
        <SectionNav items={SECTIONS} />
      </div>
      <LessonSidebarTOC items={SECTIONS} color="pink" />

      <div id="lesson-content" className="space-y-8 mt-8">
        {MAPPED_SECTIONS.map(({ id, Comp }, i) => (
          <motion.section
            key={id}
            id={id === "intro" ? "intro" : undefined}
            className={SECTION_CLASS}
            variants={SECTION_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: Math.min(i * 0.05, 0.25) }}
          >
            <Comp />
          </motion.section>
        ))}
      </div>

      <Quiz
        title="Проверь себя: учебный план и рандомизация"
        questions={QUIZ_QUESTIONS}
        lessonPath="/courses/3-3"
        nextLesson={{ path: "/courses/3-4", title: "Имитационное обучение (GAIL)" }}
      />

      <RelatedMaterials />

      <Card className="mt-8 border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm">
        <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Дочитали до конца? Зафиксируйте прогресс и получите XP.
          </p>
          <CompleteButton />
        </CardContent>
      </Card>

      <NextPrevLesson prev={lesson.prev} next={lesson.next} />
    </>
  );

  return (
    <>
      <SEOHead
        title="Урок 3.3. Учебный план и рандомизация среды | CyberUnityCode"
        description="Curriculum learning как метод продолжения, рандомизация среды (контекстный MDP, sim-to-real), ADR, Prioritized Level Replay и Unsupervised Environment Design. Полные YAML-конфиги Unity ML-Agents: сэмплеры и curriculum. PRO-урок продвинутого уровня."
        path="/courses/3-3"
        type="article"
        keywords="curriculum learning, environment randomization, domain randomization, ADR, PLR, UED, PAIRED, контекстный MDP, sim-to-real, Unity ML-Agents, environment_parameters"
      />
      <a
        href="#lesson-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-md focus:bg-card focus:text-cyan-300 focus:border focus:border-cyan-400 focus:shadow-[0_0_16px_hsl(var(--primary)/0.6)]"
      >
        К содержимому урока
      </a>
      <ScrollProgressBar color="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <ProGate preview={content}>{content}</ProGate>
      </main>
    </>
  );
};

export default CourseLesson3_3;
