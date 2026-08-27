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

import IntroSection from "@/components/lesson-3-6/IntroSection";
import Section0 from "@/components/lesson-3-6/Section0";
import Section1 from "@/components/lesson-3-6/Section1";
import Section2 from "@/components/lesson-3-6/Section2";
import Section3 from "@/components/lesson-3-6/Section3";
import Section4 from "@/components/lesson-3-6/Section4";
import Section5 from "@/components/lesson-3-6/Section5";
import Section6 from "@/components/lesson-3-6/Section6";
import Section7 from "@/components/lesson-3-6/Section7";
import Section8 from "@/components/lesson-3-6/Section8";
import Section9 from "@/components/lesson-3-6/Section9";
import Section10 from "@/components/lesson-3-6/Section10";
import Section11 from "@/components/lesson-3-6/Section11";
import Section12 from "@/components/lesson-3-6/Section12";
import Section13 from "@/components/lesson-3-6/Section13";
import Summary from "@/components/lesson-3-6/Summary";
import RelatedMaterials from "@/components/lesson-3-6/RelatedMaterials";
import LessonTextbookLinks from "@/components/LessonTextbookLinks";

const SECTIONS: SectionNavItem[] = [
  { id: "intro", label: "Введение" },
  { id: "раздел-0-мост", label: "0 · Мост" },
  { id: "раздел-1-задача-hpo", label: "1 · Задача HPO" },
  { id: "раздел-2-пространство-поиска", label: "2 · Пространство поиска" },
  { id: "раздел-3-grid-search", label: "3 · Grid search" },
  { id: "раздел-4-random-search", label: "4 · Random search" },
  { id: "раздел-5-байесовская-оптимизация", label: "5 · Байесовская оптимизация" },
  { id: "раздел-6-tpe", label: "6 · TPE" },
  { id: "раздел-7-прунинг", label: "7 · Прунинг" },
  { id: "раздел-8-optuna-практика", label: "8 · Optuna" },
  { id: "раздел-9-wandb-sweeps", label: "9 · W&B Sweeps" },
  { id: "раздел-10-сравнение", label: "10 · Сравнение" },
  { id: "раздел-11-гоночный-агент", label: "11 · Гоночный агент" },
  { id: "раздел-12-диагностика", label: "12 · Диагностика" },
  { id: "раздел-13-связи", label: "13 · Связи" },
  { id: "итоги", label: "Итоги" },
  { id: "источники", label: "Источники" },
];

const MAPPED_SECTIONS: Array<{ id: string; Comp: () => JSX.Element }> = [
  { id: "intro", Comp: IntroSection },
  { id: "раздел-0-мост", Comp: Section0 },
  { id: "раздел-1-задача-hpo", Comp: Section1 },
  { id: "раздел-2-пространство-поиска", Comp: Section2 },
  { id: "раздел-3-grid-search", Comp: Section3 },
  { id: "раздел-4-random-search", Comp: Section4 },
  { id: "раздел-5-байесовская-оптимизация", Comp: Section5 },
  { id: "раздел-6-tpe", Comp: Section6 },
  { id: "раздел-7-прунинг", Comp: Section7 },
  { id: "раздел-8-optuna-практика", Comp: Section8 },
  { id: "раздел-9-wandb-sweeps", Comp: Section9 },
  { id: "раздел-10-сравнение", Comp: Section10 },
  { id: "раздел-11-гоночный-агент", Comp: Section11 },
  { id: "раздел-12-диагностика", Comp: Section12 },
  { id: "раздел-13-связи", Comp: Section13 },
  { id: "итоги", Comp: Summary },
];

const SECTION_CLASS =
  "scroll-mt-24 py-12 md:py-16 px-5 md:px-10 bg-card/60 backdrop-blur-sm rounded-2xl border border-cyan-500/10";

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const QUIZ_QUESTIONS = [
  {
    question: "Почему random search обычно эффективнее grid search при одинаковом бюджете?",
    options: [
      "Он быстрее физически выполняется",
      "Из-за низкой эффективной размерности: на N испытаниях он покрывает N значений важной оси, а grid — лишь k",
      "Он умнее grid и учится на истории",
      "Он использует гауссов процесс",
    ],
    correctIndex: 1,
    explanation:
      "Bergstra & Bengio (2012): из десятка гиперпараметров реально важны 2–3, и неважные оси «бесплатно» меняются вместе с важной — поэтому random покрывает важную ось N значениями.",
  },
  {
    question: "Какой ключевой факт лежит в основе TPE-сэмплера Optuna?",
    options: [
      "EI задаётся гауссовым процессом",
      "EI ∝ (γ + g/ℓ · (1−γ))⁻¹ — максимизировать EI = максимизировать ℓ/g",
      "TPE моделирует p(y | λ) напрямую",
      "TPE работает только на категориальных осях",
    ],
    correctIndex: 1,
    explanation:
      "TPE строит две плотности по подвыборке «хороших» и «плохих» испытаний и предлагает кандидата с максимальным отношением ℓ/g — это и есть максимизация EI.",
  },
  {
    question: "Что делает ASHA по сравнению с обычным Successive Halving?",
    options: [
      "Использует гауссов процесс",
      "Асинхронно продвигает испытания между rung'ами — линейно масштабируется по числу воркеров",
      "Ничего не меняет, просто другое название",
      "Включает только Median pruner",
    ],
    correctIndex: 1,
    explanation:
      "ASHA = Asynchronous Successive Halving: воркер не ждёт остальных, решая продвинуть ли trial, поэтому она линейно масштабируется и идёт по умолчанию в Optuna.",
  },
  {
    question: "Что обязан делать objective в Optuna, чтобы заработал прунер?",
    options: [
      "Возвращать список значений",
      "Вызывать trial.report(value, step) и проверять trial.should_prune() → raise TrialPruned()",
      "Использовать только suggest_categorical",
      "Сохранять модель на каждом шаге",
    ],
    correctIndex: 1,
    explanation:
      "Прунер действует только если objective периодически отчитывается о промежуточном значении и сам поднимает TrialPruned, когда should_prune() вернул True.",
  },
  {
    question: "Зачем использовать связку Optuna + W&B через WeightsAndBiasesCallback?",
    options: [
      "Чтобы заменить Optuna на W&B Sweeps",
      "Чтобы получить умный поиск Optuna и одновременно дашборды/parallel-coordinates от W&B без отдельного кода",
      "Это требование ML-Agents",
      "Чтобы ускорить обучение PPO",
    ],
    correctIndex: 1,
    explanation:
      "Колбэк (из пакета optuna-integration) превращает каждый trial Optuna в отдельный run W&B — поиск остаётся за TPE/ASHA, а визуализацию и importance-графики берёт на себя W&B.",
  },
];

const CompleteButton = () => {
  const [done, setDone] = useState<boolean>(() => isLessonComplete("3.6"));

  useEffect(() => {
    if (done) return;
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - window.innerHeight)) * 100;
      if (pct >= 90) {
        markLessonComplete("3.6");
        setDone(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [done]);

  return (
    <Button
      onClick={() => {
        markLessonComplete("3.6");
        setDone(true);
      }}
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

const CourseLesson3_6 = () => {
  const lesson = getLessonById("3.6")!;

  const content = (
    <>
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
            <Link to="/courses#level-3" className="hover:text-cyan-400">
              Уровень 3
            </Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
          <li className="text-foreground" aria-current="page">
            Урок 3.6
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
      <LessonSidebarTOC items={SECTIONS} color="purple" />

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
        title="Проверь себя: оптимизация гиперпараметров"
        questions={QUIZ_QUESTIONS}
        lessonPath="/courses/3-6"
        nextLesson={{ path: "/courses/3-7", title: "Архитектуры нейросетей" }}
      />

      <LessonTextbookLinks lessonId="3-6" lessonLabel="Урок 3.6. Оптимизация гиперпараметров" />

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
        title="Урок 3.6. Оптимизация гиперпараметров: Optuna + W&B | CyberUnityCode"
        description="HPO для RL: формализация задачи (λ* = argmax f(λ)), grid vs random, байесовская оптимизация и TPE (EI ∝ (γ + g/ℓ(1−γ))⁻¹), прунинг (Median, SHA/ASHA, Hyperband), Optuna (study/trial/objective, define-by-run, распределёнка), W&B Sweeps и связка Optuna ↔ W&B через WeightsAndBiasesCallback. Сквозной пример — гоночный агент в Unity ML-Agents 4.0.x. Урок."
        path="/courses/3-6"
        type="article"
        keywords="HPO, гиперпараметры, Optuna, W&B Sweeps, TPE, ASHA, Hyperband, Successive Halving, байесовская оптимизация, Expected Improvement, ML-Agents, гоночный агент, PPO"
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

export default CourseLesson3_6;
