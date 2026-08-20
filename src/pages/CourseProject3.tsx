import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ChevronRight, CheckCircle2 } from "lucide-react";
import ProGate from "@/components/ProGate";
import LessonHeader from "@/components/LessonHeader";
import SectionNav, { SectionNavItem } from "@/components/SectionNav";
import NextPrevLesson from "@/components/NextPrevLesson";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { markLessonComplete, isLessonComplete } from "@/lib/gamification";
import IntroSection from "@/components/racing-agent/IntroSection";
import Section2Setup from "@/components/racing-agent/Section2Setup";
import Section3Sensors from "@/components/racing-agent/Section3Sensors";
import Section4Agent from "@/components/racing-agent/Section4Agent";
import Section5Rewards from "@/components/racing-agent/Section5Rewards";
import Section6Algorithms from "@/components/racing-agent/Section6Algorithms";
import Section7TensorBoard from "@/components/racing-agent/Section7TensorBoard";
import Section8BestPractices from "@/components/racing-agent/Section8BestPractices";
import Section9FAQ from "@/components/racing-agent/Section9FAQ";
import Section10Conclusion from "@/components/racing-agent/Section10Conclusion";
import LessonTextbookLinks from "@/components/LessonTextbookLinks";
import LabPracticeSection from "@/components/LabPracticeSection";

const SECTIONS: SectionNavItem[] = [
  { id: "intro",           label: "Введение и теория" },
  { id: "setup",           label: "Настройка окружения" },
  { id: "sensors",         label: "Сенсоры" },
  { id: "agent",           label: "Логика агента (C#)" },
  { id: "rewards",         label: "Система наград" },
  { id: "algorithms",      label: "Алгоритмы" },
  { id: "tensorboard",     label: "TensorBoard" },
  { id: "best-practices",  label: "Best Practices" },
  { id: "faq",             label: "FAQ" },
  { id: "conclusion",      label: "Заключение" },
];

const SECTION_CLASS =
  "scroll-mt-24 py-16 px-6 md:px-10 bg-card/60 backdrop-blur-sm rounded-2xl border border-cyan-500/10";
const SECTION_TITLE_CLASS =
  "text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6";

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const CompleteButton = () => {
  const [done, setDone] = useState<boolean>(() => isLessonComplete("project-3"));

  useEffect(() => {
    if (done) return;
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - window.innerHeight)) * 100;
      if (pct >= 90) {
        markLessonComplete("project-3");
        setDone(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [done]);

  return (
    <Button
      onClick={() => { markLessonComplete("project-3"); setDone(true); }}
      disabled={done}
      size="lg"
      className="w-full md:w-auto bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold shadow-[0_0_24px_hsl(var(--primary)/0.45)] hover:shadow-[0_0_32px_hsl(280_85%_65%/0.55)] hover:scale-[1.02] transition-all disabled:opacity-80 disabled:cursor-default"
    >
      {done ? (
        <><CheckCircle2 className="w-5 h-5 mr-2" />Пройдено</>
      ) : (
        <>Отметить как пройденный ✓</>
      )}
    </Button>
  );
};

const Section6Preview = () => (
  <div className="space-y-4">
    <p className="text-muted-foreground leading-relaxed">
      Полный математический разбор PPO (clipped surrogate objective, GAE) и SAC (soft Bellman equation, максимизация
      энтропии), сравнительная таблица алгоритмов, эмпирически оптимизированные YAML-конфиги и исследование
      гиперпараметров (Savid et al. 2023).
    </p>
    <div className="text-sm text-muted-foreground space-y-1 opacity-40 blur-[3px] select-none pointer-events-none" aria-hidden>
      <p>L^CLIP(θ) = E[min(r_t(θ)A_t, clip(r_t(θ), 1−ε, 1+ε)A_t)]</p>
      <p>batch_size: 128 | learning_rate: 3e-4 | gamma: 0.99 | beta: 0.01</p>
      <p>SAC: J(π) = E[r + α·H(π)] | replay buffer 200 000 | tau: 0.005</p>
    </div>
  </div>
);

const Section8Preview = () => (
  <div className="space-y-4">
    <p className="text-muted-foreground leading-relaxed">
      Советы по параллельным тренировочным аренам (8–16 копий), настройке time scale, curriculum learning,
      imitation learning для холодного старта, расположению чекпоинтов и Decision Period.
    </p>
    <div className="text-sm text-muted-foreground space-y-1 opacity-40 blur-[3px] select-none pointer-events-none" aria-hidden>
      <p>TrainingAreaReplicator: ~2× ускорение при 8 параллельных аренах</p>
      <p>time_scale: 20 (обучение) → 1 (инференс); fixedDeltaTime = 0.02</p>
      <p>Curriculum: короткая подтрасса → полный круг | Demo Recorder → BC</p>
    </div>
  </div>
);

const CourseProject3 = () => {
  const content = (
    <>
      {/* Breadcrumbs */}
      <nav aria-label="Хлебные крошки" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-cyan-400 inline-flex items-center gap-1">
              <Home className="w-3.5 h-3.5" aria-hidden="true" />
              Главная
            </Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
          <li>
            <Link to="/courses" className="hover:text-cyan-400">Курс</Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
          <li>
            <Link to="/courses#level-2" className="hover:text-cyan-400">Уровень 2</Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
          <li className="text-foreground" aria-current="page">Проект 3</li>
        </ol>
      </nav>

      <LessonHeader
        title="Автономный гоночный агент на Unity ML-Agents"
        subtitle="MDP → SOLID C# архитектура → Ray Sensors → Reward Shaping → PPO/SAC. Учебное руководство МГППУ."
        estimatedMinutes={180}
      />

      <SectionNav items={SECTIONS} />

      <div id="lesson-content" className="space-y-8 mt-8">
        {SECTIONS.map((s, i) => (
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
            <h2 className={`${SECTION_TITLE_CLASS} text-2xl md:text-3xl`}>{s.label}</h2>
            {s.id === "intro" ? (
              <IntroSection />
            ) : s.id === "setup" ? (
              <Section2Setup />
            ) : s.id === "sensors" ? (
              <Section3Sensors />
            ) : s.id === "agent" ? (
              <Section4Agent />
            ) : s.id === "rewards" ? (
              <Section5Rewards />
            ) : s.id === "algorithms" ? (
              <ProGate preview={<Section6Preview />}>
                <Section6Algorithms />
              </ProGate>
            ) : s.id === "tensorboard" ? (
              <Section7TensorBoard />
            ) : s.id === "best-practices" ? (
              <ProGate preview={<Section8Preview />}>
                <Section8BestPractices />
              </ProGate>
            ) : s.id === "faq" ? (
              <Section9FAQ />
            ) : s.id === "conclusion" ? (
              <Section10Conclusion />
            ) : null}
          </motion.section>
        ))}
      </div>

      <Card className="mt-8 border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm">
        <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Дочитали до конца? Зафиксируйте прогресс и получите XP.</p>
          <CompleteButton />
        </CardContent>
      </Card>

      <LessonTextbookLinks lessonId="project-3" lessonLabel="Проект 3: Гоночный агент" />

      {/* Практика: собранная среда лаборатории для этой темы. */}
      <LabPracticeSection contextKey="project-3" />

      <NextPrevLesson
        prev={{ title: "Проект 2: 3D-охотник", path: "/courses/project-2" }}
        next={{ title: "Урок 3.1: SAC", path: "/courses/3-1" }}
      />
    </>
  );

  return (
    <>
      <SEOHead
        title="Проект 3: Автономный гоночный агент на Unity ML-Agents | CyberUnityCode"
        description="Полное учебное руководство: MDP, SOLID C# архитектура, Ray Perception Sensors, reward shaping, PPO vs SAC, TensorBoard. Unity 2023.2+, Python 3.10.12, ML-Agents release 22."
        path="/courses/project-3"
        type="article"
      />
      <a
        href="#lesson-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-md focus:bg-card focus:text-cyan-300 focus:border focus:border-cyan-400 focus:shadow-[0_0_16px_hsl(var(--primary)/0.6)]"
      >
        К содержимому урока
      </a>
      <ScrollProgressBar color="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
      <main className="container max-w-5xl mx-auto px-4 py-8">
        {content}
      </main>
    </>
  );
};

export default CourseProject3;
