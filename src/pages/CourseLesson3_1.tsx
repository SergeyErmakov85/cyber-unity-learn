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

import IntroSection from "@/components/lesson-3-1/IntroSection";
import Section0 from "@/components/lesson-3-1/Section0";
import Section1 from "@/components/lesson-3-1/Section1";
import Section2 from "@/components/lesson-3-1/Section2";
import Section3 from "@/components/lesson-3-1/Section3";
import Section4 from "@/components/lesson-3-1/Section4";
import Section5 from "@/components/lesson-3-1/Section5";
import Section6 from "@/components/lesson-3-1/Section6";
import Section7 from "@/components/lesson-3-1/Section7";
import Section8 from "@/components/lesson-3-1/Section8";
import Section9 from "@/components/lesson-3-1/Section9";
import Section10 from "@/components/lesson-3-1/Section10";
import Section11 from "@/components/lesson-3-1/Section11";
import Section12 from "@/components/lesson-3-1/Section12";
import Section13 from "@/components/lesson-3-1/Section13";
import Summary from "@/components/lesson-3-1/Summary";
import RelatedMaterials from "@/components/lesson-3-1/RelatedMaterials";
import LessonTextbookLinks from "@/components/LessonTextbookLinks";

const SECTIONS: SectionNavItem[] = [
  { id: "intro", label: "Введение" },
  { id: "раздел-0-от-гоночного-агента-к-sac", label: "0 · Зачем SAC" },
  { id: "раздел-1-принцип-максимальной-энтропии-зачем-агенту-быть-случайным", label: "1 · Макс. энтропия" },
  { id: "раздел-2-maximum-entropy-rl-objective", label: "2 · Max-Ent цель" },
  { id: "раздел-3-soft-q-функция-soft-value-function-и-soft-уравнение-беллмана", label: "3 · Soft Bellman" },
  { id: "раздел-4-soft-policy-iteration", label: "4 · Soft Policy Iter." },
  { id: "раздел-5-два-q-критика-clipped-double-q-и-target-сети", label: "5 · Два Q-критика" },
  { id: "раздел-6-reparameterization-trick-для-стохастической-политики", label: "6 · Reparam-trick" },
  { id: "раздел-7-автоматическая-подстройка-температуры-alpha", label: "7 · Автоподстройка α" },
  { id: "раздел-8-replay-buffer-и-off-policy", label: "8 · Replay Buffer" },
  { id: "раздел-9-полный-алгоритм-sac", label: "9 · Алгоритм SAC" },
  { id: "раздел-10-сравнение-sac-vs-ppo", label: "10 · SAC vs PPO" },
  { id: "раздел-11-гиперпараметры-sac", label: "11 · Гиперпараметры" },
  { id: "раздел-12-sac-в-unity-ml-agents", label: "12 · Unity ML-Agents" },
  { id: "раздел-13-связь-с-гоночным-агентом", label: "13 · От PPO к SAC" },
  { id: "итоги", label: "Итоги" },
];

const SECTION_COMPONENTS: Record<string, () => JSX.Element> = {
  intro: IntroSection,
  "раздел-0-от-гоночного-агента-к-sac": Section0,
  "раздел-1-принцип-максимальной-энтропии-зачем-агенту-быть-случайным": Section1,
  "раздел-2-maximum-entropy-rl-objective": Section2,
  "раздел-3-soft-q-функция-soft-value-function-и-soft-уравнение-беллмана": Section3,
  "раздел-4-soft-policy-iteration": Section4,
  "раздел-5-два-q-критика-clipped-double-q-и-target-сети": Section5,
  "раздел-6-reparameterization-trick-для-стохастической-политики": Section6,
  "раздел-7-автоматическая-подстройка-температуры-alpha": Section7,
  "раздел-8-replay-buffer-и-off-policy": Section8,
  "раздел-9-полный-алгоритм-sac": Section9,
  "раздел-10-сравнение-sac-vs-ppo": Section10,
  "раздел-11-гиперпараметры-sac": Section11,
  "раздел-12-sac-в-unity-ml-agents": Section12,
  "раздел-13-связь-с-гоночным-агентом": Section13,
  итоги: Summary,
};

const SECTION_CLASS =
  "scroll-mt-24 py-12 md:py-16 px-5 md:px-10 bg-card/60 backdrop-blur-sm rounded-2xl border border-cyan-500/10";

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const QUIZ_QUESTIONS = [
  {
    question: "Какой принцип лежит в основе SAC?",
    options: [
      "Минимизация энтропии политики",
      "Максимизация суммы награды и энтропии политики",
      "Максимизация только Q-значений",
      "Минимизация KL-дивергенции между последовательными политиками",
    ],
    correctIndex: 1,
    explanation:
      "SAC оптимизирует maximum-entropy objective: J(π)=Σ E[r + α·H(π)]. Агент стремится быть максимально случайным при высокой награде.",
  },
  {
    question: "Зачем в SAC используются два Q-критика (clipped double-Q)?",
    options: [
      "Для ускорения обучения ровно в 2 раза",
      "Чтобы гасить переоценку: в цели берётся min(Q₁, Q₂)",
      "Один для обучения, другой для инференса",
      "Два критика в SAC не используются",
    ],
    correctIndex: 1,
    explanation:
      "Бутстрэп-обучение Q систематически завышает ценность. Минимум из двух независимых сетей — намеренно пессимистичная оценка, которая гасит overestimation bias (трюк из TD3).",
  },
  {
    question: "Что делает температура α в SAC?",
    options: [
      "Задаёт learning rate",
      "Контролирует баланс между наградой и энтропией (стохастичностью)",
      "Управляет размером replay buffer",
      "Фиксирует ε для ε-greedy exploration",
    ],
    correctIndex: 1,
    explanation:
      "α — «ручка» компромисса эксплуатация/исследование. При α→0 восстанавливается обычный RL; в современном SAC α подстраивается автоматически к целевой энтропии −dim(A).",
  },
  {
    question: "Зачем нужен reparameterization trick?",
    options: [
      "Чтобы ускорить инференс политики",
      "Чтобы градиент протекал через случайную выборку: a = tanh(μ + σ·ε), ε ~ N(0,I)",
      "Чтобы заменить replay buffer",
      "Чтобы сделать политику детерминированной",
    ],
    correctIndex: 1,
    explanation:
      "Шум ε выносится наружу как независимая переменная, действие становится гладкой функцией параметров, и градиент Q по действию течёт обратно в веса политики (меньшая дисперсия, чем у REINFORCE).",
  },
  {
    question: "Когда SAC предпочтительнее PPO?",
    options: [
      "Всегда — SAC лучше во всём",
      "Когда шаги среды дороги и действия непрерывные (важна sample efficiency)",
      "Только в чисто дискретных задачах",
      "Когда используется LSTM с непрерывными действиями",
    ],
    correctIndex: 1,
    explanation:
      "SAC off-policy и крайне экономен по данным — выгоден при дорогих шагах симуляции и непрерывном управлении. Для дискретных действий, дешёвых шагов или LSTM обычно проще PPO.",
  },
];

const CompleteButton = () => {
  const [done, setDone] = useState<boolean>(() => isLessonComplete("3.1"));

  useEffect(() => {
    if (done) return;
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - window.innerHeight)) * 100;
      if (pct >= 90) {
        markLessonComplete("3.1");
        setDone(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [done]);

  const handleClick = () => {
    markLessonComplete("3.1");
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

const CourseLesson3_1 = () => {
  const lesson = getLessonById("3.1")!;

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
            <Link to="/courses#level-3" className="hover:text-cyan-400">
              Уровень 3
            </Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
          <li className="text-foreground" aria-current="page">
            Урок 3.1
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
      <LessonSidebarTOC items={SECTIONS} color="cyan" />

      <div id="lesson-content" className="space-y-8 mt-8">
        {SECTIONS.map((s, i) => {
          const SectionComp = SECTION_COMPONENTS[s.id];
          return (
            <motion.section
              key={s.id}
              id={s.id}
              className={SECTION_CLASS}
              variants={SECTION_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: Math.min(i * 0.05, 0.25) }}
            >
              <SectionComp />
            </motion.section>
          );
        })}
      </div>

      <Quiz
        title="Проверь себя: SAC"
        questions={QUIZ_QUESTIONS}
        lessonPath="/courses/3-1"
        nextLesson={{ path: "/courses/3-2", title: "MA-POCA и Self-Play" }}
      />

      <LessonTextbookLinks lessonId="3-1" lessonLabel="Урок 3.1. SAC — Soft Actor-Critic" />

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
        title="Урок 3.1. SAC — Soft Actor-Critic | CyberUnityCode"
        description="Полный разбор Soft Actor-Critic: принцип максимальной энтропии, soft-уравнение Беллмана, два Q-критика, reparameterization trick, автоподстройка температуры α, replay buffer и YAML-конфиг SAC в Unity ML-Agents. PRO-урок продвинутого уровня."
        path="/courses/3-1"
        type="article"
        keywords="SAC, Soft Actor-Critic, maximum entropy RL, off-policy, reparameterization trick, replay buffer, Unity ML-Agents, непрерывное управление, PPO vs SAC"
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

export default CourseLesson3_1;
