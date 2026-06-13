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

import IntroSection from "@/components/lesson-3-8/IntroSection";
import Section0 from "@/components/lesson-3-8/Section0";
import Section1 from "@/components/lesson-3-8/Section1";
import Section2 from "@/components/lesson-3-8/Section2";
import Section3 from "@/components/lesson-3-8/Section3";
import Section4 from "@/components/lesson-3-8/Section4";
import Section5 from "@/components/lesson-3-8/Section5";
import Section6 from "@/components/lesson-3-8/Section6";
import Section7 from "@/components/lesson-3-8/Section7";
import Section8 from "@/components/lesson-3-8/Section8";
import Section9 from "@/components/lesson-3-8/Section9";
import Section10 from "@/components/lesson-3-8/Section10";
import Summary from "@/components/lesson-3-8/Summary";
import RelatedMaterials from "@/components/lesson-3-8/RelatedMaterials";

const SECTIONS: SectionNavItem[] = [
  { id: "intro", label: "Введение" },
  { id: "razdel-0", label: "0 · Мост: от алгоритмов к игре" },
  { id: "anatomiya-proekta", label: "1 · Анатомия проекта: 6 этапов" },
  { id: "etap-1-sreda", label: "2 · Этап 1 — Среда" },
  { id: "etap-2-nagrada", label: "3 · Этап 2 — Функция награды" },
  { id: "etap-3-obuchenie", label: "4 · Этап 3 — Обучение" },
  { id: "etap-4-optimizaciya", label: "5 · Этап 4 — Оптимизация" },
  { id: "etap-5-deploy", label: "6 · Этап 5 — Деплой" },
  { id: "etap-6-geympley", label: "7 · Этап 6 — Геймплей" },
  { id: "bonus-tehniki", label: "8 · Бонусные техники" },
  { id: "chetyre-proekta", label: "9 · Четыре эталонных проекта" },
  { id: "kriterii-i-sertifikat", label: "10 · Критерии и сертификат" },
  { id: "itogi", label: "Итоги" },
  { id: "karta-krosslinkov", label: "Карта кросс-ссылок" },
  { id: "istochniki", label: "Источники" },
];

const MAPPED_SECTIONS: Array<{ id: string; Comp: () => JSX.Element }> = [
  { id: "intro", Comp: IntroSection },
  { id: "razdel-0", Comp: Section0 },
  { id: "anatomiya-proekta", Comp: Section1 },
  { id: "etap-1-sreda", Comp: Section2 },
  { id: "etap-2-nagrada", Comp: Section3 },
  { id: "etap-3-obuchenie", Comp: Section4 },
  { id: "etap-4-optimizaciya", Comp: Section5 },
  { id: "etap-5-deploy", Comp: Section6 },
  { id: "etap-6-geympley", Comp: Section7 },
  { id: "bonus-tehniki", Comp: Section8 },
  { id: "chetyre-proekta", Comp: Section9 },
  { id: "kriterii-i-sertifikat", Comp: Section10 },
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
    question: "Сколько этапов в финальном конвейере «от пустой сцены до играбельного билда»?",
    options: ["Три", "Четыре", "Шесть", "Десять"],
    correctIndex: 2,
    explanation: "Среда → награда → обучение → оптимизация → деплой → геймплей. Слабое звено рушит результат.",
  },
  {
    question: "Что чаще всего лечит «reward на плато» в TensorBoard?",
    options: [
      "Поднять learning_rate в 10 раз",
      "Сменить алгоритм на SAC",
      "Вернуться к этапам 1–2: проверить наблюдения и дизайн награды",
      "Увеличить buffer_size до миллиона",
    ],
    correctIndex: 2,
    explanation: "Конвейер циклический: плато на этапе 4 чаще лечится возвратом к этапам 1–2, чем подбором гиперпараметров.",
  },
  {
    question: "Какая форма reward shaping гарантированно не сдвигает оптимум?",
    options: [
      "Произвольный плотный член, пропорциональный близости к цели",
      "Потенциальное шейпинг: r' = r + (γ·Φ(s') − Φ(s))",
      "Любой штраф за шаг",
      "Награда за процесс (накручиваемая)",
    ],
    correctIndex: 1,
    explanation: "Потенциальное шейпинг — единственная безопасная форма: добавка как разность потенциалов не меняет оптимальную политику.",
  },
  {
    question: "Что верно про MA-POCA в YAML-конфиге ML-Agents?",
    options: [
      "Требует отдельной секции poca_settings с уникальными полями",
      "Конфиг полностью совпадает с PPO; меняется только trainer_type: poca",
      "Работает только с дискретными действиями",
      "Заменяет reward_signals на team_reward",
    ],
    correctIndex: 1,
    explanation: "Документация явно говорит: POCA = PPO-конфиг + trainer_type: poca; дополнительных POCA-полей нет.",
  },
  {
    question: "Что нужно для запуска обученной модели в Unity-билде?",
    options: [
      "Запустить mlagents-learn в фоновом процессе",
      "Перетащить .onnx в Behavior Parameters → Model и поставить Behavior Type: Inference Only (рантайм — Unity Sentis)",
      "Сконвертировать модель в TensorFlow.js",
      "Включить Python в зависимости Unity-проекта",
    ],
    correctIndex: 1,
    explanation: "ML-Agents экспортирует ONNX автоматически; Sentis (заменил Barracuda) импортирует его напрямую, а Inference Only отключает ожидание Python-тренера.",
  },
];

const CompleteButton = () => {
  const [done, setDone] = useState<boolean>(() => isLessonComplete("3.8"));

  useEffect(() => {
    if (done) return;
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - window.innerHeight)) * 100;
      if (pct >= 90) {
        markLessonComplete("3.8");
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
        markLessonComplete("3.8");
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

const CourseLesson3_8 = () => {
  const lesson = getLessonById("3.8")!;

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
            <Link to="/courses#stage-3" className="hover:text-cyan-400">
              Уровень 3
            </Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
          <li className="text-foreground" aria-current="page">
            Урок 3.8
          </li>
        </ol>
      </nav>

      <LessonHeader
        title={lesson.title}
        subtitle={lesson.subtitle}
        isPro={lesson.isPro}
        estimatedMinutes={lesson.estimatedMinutes}
      />

      <SectionNav items={SECTIONS} />

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
        title="Проверь себя: финальный проект"
        questions={QUIZ_QUESTIONS}
        lessonPath="/courses/3-8"
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
        title="Урок 3.8. Финальный проект: полноценная игра с обученным NPC | CyberUnityCode"
        description="Сборка всего курса в играбельный билд: шесть этапов (среда → награда → обучение → оптимизация → деплой → геймплей), четыре эталонных проекта (арена-шутер, спорт, гонки, tower defense), бонусные техники Curriculum Learning, Self-Play и GAIL. ONNX-экспорт в Unity Sentis, Optuna + W&B, FCA-анализ. PRO."
        path="/courses/3-8"
        type="article"
        keywords="финальный проект, RL, Unity ML-Agents, NPC, PPO, SAC, MA-POCA, ONNX, Unity Sentis, Curriculum Learning, Self-Play, GAIL, Optuna, W&B, сертификат"
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

export default CourseLesson3_8;
