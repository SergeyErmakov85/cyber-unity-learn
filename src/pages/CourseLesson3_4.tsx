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

import IntroSection from "@/components/lesson-3-4/IntroSection";
import Section1 from "@/components/lesson-3-4/Section1";
import Section2 from "@/components/lesson-3-4/Section2";
import Section3 from "@/components/lesson-3-4/Section3";
import Section4 from "@/components/lesson-3-4/Section4";
import Section5 from "@/components/lesson-3-4/Section5";
import Section6 from "@/components/lesson-3-4/Section6";
import Section7 from "@/components/lesson-3-4/Section7";
import Section8 from "@/components/lesson-3-4/Section8";
import Summary from "@/components/lesson-3-4/Summary";
import RelatedMaterials from "@/components/lesson-3-4/RelatedMaterials";

const SECTIONS: SectionNavItem[] = [
  { id: "intro", label: "Введение" },
  { id: "razdel-1-bc-teoriya", label: "1 · BC — теория" },
  { id: "razdel-2-irl", label: "2 · IRL" },
  { id: "razdel-3-gail", label: "3 · GAIL" },
  { id: "razdel-4-airl-varianty", label: "4 · AIRL и варианты" },
  { id: "razdel-5-sravnenie", label: "5 · Сравнение" },
  { id: "razdel-6-unity-mlagents", label: "6 · Unity ML-Agents" },
  { id: "razdel-7-tensorboard", label: "7 · TensorBoard" },
  { id: "razdel-8-pipeline", label: "8 · Пайплайн" },
  { id: "itogi", label: "Итоги" },
  { id: "istochniki", label: "Источники" },
];

const MAPPED_SECTIONS: Array<{ id: string; Comp: () => JSX.Element }> = [
  { id: "intro", Comp: IntroSection },
  { id: "razdel-1-bc-teoriya", Comp: Section1 },
  { id: "razdel-2-irl", Comp: Section2 },
  { id: "razdel-3-gail", Comp: Section3 },
  { id: "razdel-4-airl-varianty", Comp: Section4 },
  { id: "razdel-5-sravnenie", Comp: Section5 },
  { id: "razdel-6-unity-mlagents", Comp: Section6 },
  { id: "razdel-7-tensorboard", Comp: Section7 },
  { id: "razdel-8-pipeline", Comp: Section8 },
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
    question: "В чём ключевое отличие GAIL от Behavioral Cloning?",
    options: [
      "GAIL быстрее обучается на тех же демо",
      "GAIL использует дискриминатор и матчит occupancy measure, а BC просто копирует действия supervised-методом",
      "BC работает только с дискретными действиями",
      "Отличий нет — это одно и то же",
    ],
    correctIndex: 1,
    explanation:
      "GAIL сводит имитацию к GAN-минимаксу: дискриминатор отличает (s,a) политики от эксперта, а политика максимизирует r=-log(1-D). BC — обычный supervised на парах (s,a), страдает от covariate shift с границей O(T²ε).",
  },
  {
    question: "Что говорит теорема 2.1 Ross & Bagnell (2010) про чистый BC?",
    options: [
      "BC всегда сходится к оптимальной политике",
      "При ошибке ε на состояниях эксперта суммарная стоимость растёт как O(T²·ε) — квадратично по горизонту",
      "BC требует онлайн-доступа к эксперту",
      "BC даёт линейную O(T·ε) границу",
    ],
    correctIndex: 1,
    explanation:
      "Theorem 2.1: J(π) ≤ J(π*) + T²ε; граница тугая. Линейную O(Tε) даёт DAgger ценой интерактивного дозапроса эксперта.",
  },
  {
    question: "Какая формула GAIL-награды политике каноническая?",
    options: [
      "r = D(s,a)",
      "r = -log(1 - D(s,a))",
      "r = log D(s,a) + log(1 - D(s,a))",
      "r = ||μ(s) - a||²",
    ],
    correctIndex: 1,
    explanation:
      "Из ψ_GA-регуляризатора Ho & Ermon: политика максимизирует r(s,a) = -log(1 - D(s,a)). Чем больше дискриминатор «верит» в экспертность пары, тем выше награда.",
  },
  {
    question: "Какое поле в YAML ML-Agents 4.0 устарело и сломает конфиг?",
    options: [
      "network_settings внутри gail",
      "encoding_size внутри gail",
      "demo_path",
      "use_vail",
    ],
    correctIndex: 1,
    explanation:
      "В release 22 / com.unity.ml-agents@4.0.x поле encoding_size удалено — параметры сети дискриминатора задаются через вложенный network_settings (hidden_units, num_layers).",
  },
  {
    question: "Почему при человеческих демо в гоночном агенте gail.strength держат низким (0.01–0.1)?",
    options: [
      "Чтобы ускорить компиляцию",
      "Из-за survivor bias GAIL: высокий strength + неоптимальные демо заставляют политику «жить дольше» и забывать цель гонки",
      "Это ограничение TensorBoard",
      "Так требует Unity Sentis",
    ],
    correctIndex: 1,
    explanation:
      "GAIL вознаграждает похожесть на эксперта и стимулирует оставаться живым дольше. С человеческими (неоптимальными) демо и extrinsic-целью держат низкий strength, чтобы extrinsic-сигнал доминировал у финиша.",
  },
];

const CompleteButton = () => {
  const [done, setDone] = useState<boolean>(() => isLessonComplete("3.4"));

  useEffect(() => {
    if (done) return;
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - window.innerHeight)) * 100;
      if (pct >= 90) {
        markLessonComplete("3.4");
        setDone(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [done]);

  const handleClick = () => {
    markLessonComplete("3.4");
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

const CourseLesson3_4 = () => {
  const lesson = getLessonById("3.4")!;

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
            Урок 3.4
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
      <LessonSidebarTOC items={SECTIONS} color="emerald" />

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
        title="Проверь себя: Imitation Learning, BC и GAIL"
        questions={QUIZ_QUESTIONS}
        lessonPath="/courses/3-4"
        nextLesson={{ path: "/courses/3-5", title: "Деплой модели" }}
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
        title="Урок 3.4. Imitation Learning: BC и GAIL | CyberUnityCode"
        description="Behavioral Cloning, IRL и GAIL: квадратичный covariate shift (Ross & Bagnell), occupancy matching и GAN-минимакс Ho & Ermon, AIRL и disentangled reward, полный YAML для com.unity.ml-agents@4.0 — BC-warmup + GAIL + PPO для гоночного агента. PRO-урок."
        path="/courses/3-4"
        type="article"
        keywords="imitation learning, behavioral cloning, GAIL, AIRL, DAgger, Ho Ermon, Ross Bagnell, occupancy measure, Unity ML-Agents, demonstration recorder, gail strength, use_vail"
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

export default CourseLesson3_4;
