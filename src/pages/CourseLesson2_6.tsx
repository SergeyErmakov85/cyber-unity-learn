import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  ChevronRight,
  LineChart,
  Link2,
  ListChecks,
  BarChart3,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";
import ProGate from "@/components/ProGate";
import LessonHeader from "@/components/LessonHeader";
import SectionNav, { SectionNavItem } from "@/components/SectionNav";
import LessonSidebarTOC from "@/components/LessonSidebarTOC";
import NextPrevLesson from "@/components/NextPrevLesson";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import SEOHead from "@/components/SEOHead";
import TldrBox from "@/components/ui/TldrBox";
import WhyVisualizeSection from "@/components/lessons/WhyVisualizeSection";
import MetricsTable from "@/components/lesson-2-6/MetricsTable";
import TensorBoardSection from "@/components/lesson-2-6/TensorBoardSection";
import WandbSection from "@/components/lesson-2-6/WandbSection";
import ComparisonTable from "@/components/lesson-2-6/ComparisonTable";
import CodeExamples from "@/components/lesson-2-6/CodeExamples";
import DiagnosticCases from "@/components/lesson-2-6/DiagnosticCases";
import AlternativesSection from "@/components/lesson-2-6/AlternativesSection";
import RecommendationsSection from "@/components/lesson-2-6/RecommendationsSection";
import RelatedMaterials from "@/components/lesson-2-6/RelatedMaterials";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLessonById } from "@/data/lessons";
import { markLessonComplete, isLessonComplete } from "@/lib/gamification";
import LessonTextbookLinks from "@/components/LessonTextbookLinks";
import LabPracticeSection from "@/components/LabPracticeSection";

const KEY_FINDINGS = [
  {
    title: "Не конкуренты — дополняют",
    text:
      "TensorBoard и W&B работают вместе. SB3-интеграция W&B буквально читает TensorBoard event-файлы (sync_tensorboard=True).",
    icon: Link2,
    color: "cyan",
  },
  {
    title: "Минимум 12 метрик PPO",
    text:
      "rollout/ep_rew_mean, train/entropy_loss, train/approx_kl, train/clip_fraction, train/explained_variance, train/policy_gradient_loss, train/value_loss, train/std.",
    icon: ListChecks,
    color: "purple",
  },
  {
    title: "Воспроизводимость = статистика",
    text:
      "Agarwal et al. (2021) показали: точечные оценки по 3–5 сидам систематически вводят в заблуждение. Используйте IQM и stratified bootstrap CI из библиотеки rliable.",
    icon: BarChart3,
    color: "pink",
  },
  {
    title: "Студенческий стек 2026",
    text:
      "PyTorch + Gymnasium + Stable-Baselines3 + TensorBoard локально + Academic W&B-аккаунт (200 GB бесплатно по .edu email).",
    icon: GraduationCap,
    color: "emerald",
  },
] as const;

const COLOR_MAP: Record<string, string> = {
  cyan: "border-cyan-500/30 hover:border-cyan-400/70 hover:shadow-[0_0_24px_hsl(var(--primary)/0.35)] [&_svg]:text-cyan-400",
  purple:
    "border-purple-500/30 hover:border-purple-400/70 hover:shadow-[0_0_24px_hsl(280_85%_65%/0.35)] [&_svg]:text-purple-400",
  pink: "border-pink-500/30 hover:border-pink-400/70 hover:shadow-[0_0_24px_hsl(330_85%_65%/0.35)] [&_svg]:text-pink-400",
  emerald:
    "border-emerald-500/30 hover:border-emerald-400/70 hover:shadow-[0_0_24px_hsl(160_85%_55%/0.35)] [&_svg]:text-emerald-400",
};

const SECTIONS: SectionNavItem[] = [
  { id: "intro", label: "Введение" },
  { id: "why-visualize", label: "Зачем визуализировать" },
  { id: "metrics", label: "Метрики" },
  { id: "tensorboard", label: "TensorBoard" },
  { id: "wandb", label: "Weights & Biases" },
  { id: "compare", label: "Сравнение" },
  { id: "code", label: "Код" },
  { id: "diagnostics", label: "Диагностика" },
  { id: "alternatives", label: "Альтернативы" },
  { id: "recommendations", label: "Рекомендации" },
];

const SECTION_CLASS =
  "scroll-mt-24 py-16 px-6 md:px-10 bg-card/60 backdrop-blur-sm rounded-2xl border border-cyan-500/10";
const SECTION_TITLE_CLASS =
  "text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6";

const Placeholder = ({ n }: { n: number }) => (
  <p className="text-muted-foreground">
    Содержимое секции {n} — будет добавлено в следующем промпте.
  </p>
);

const IntroSection = () => (
  <div className="space-y-8">
    {/* Hero card */}
    <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1 space-y-3">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            RL-обучение — процесс непредсказуемый
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Без мониторинга вы не поймёте, обучается ли агент, застрял ли он, или награды
            растут случайно. TensorBoard и Weights &amp; Biases — два ключевых инструмента
            для отслеживания прогресса.
          </p>
        </div>
        <div className="shrink-0 w-20 h-20 rounded-2xl border border-cyan-400/40 bg-cyan-500/10 flex items-center justify-center shadow-[0_0_32px_hsl(var(--primary)/0.45)]">
          <LineChart className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
        </div>
      </CardContent>
    </Card>

    {/* TL;DR */}
    <TldrBox
      items={[
        <>
          Для одиночных локальных экспериментов и быстрой диагностики —{" "}
          <strong className="text-cyan-300">TensorBoard</strong> (бесплатен, работает
          офлайн, встроен в PyTorch через{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
            torch.utils.tensorboard.SummaryWriter
          </code>{" "}
          и в Stable-Baselines3 через{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
            tensorboard_log=...
          </code>
          ). Для командной работы, sweeps, видео-логирования и публикуемых отчётов —{" "}
          <strong className="text-purple-300">Weights &amp; Biases</strong> (
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
            WandbCallback
          </code>{" "}
          с{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
            sync_tensorboard=True
          </code>
          ); оптимальная конфигурация — использовать оба одновременно.
        </>,
        <>
          В RL «обучается» ≠ «получает высокие награды»: смотрите не только на{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">ep_rew_mean</code>,
          но и на <em>entropy</em>, <em>explained_variance</em>, <em>approx_kl</em>,{" "}
          <em>clip_fraction</em>, gradient norms и доверительные интервалы по ≥5 сидам
          (методология RLiable, Agarwal et al., NeurIPS 2021 Outstanding Paper).
        </>,
        <>
          Антипаттерн №1 студенческих RL-проектов — один сид и только график награды.
          Минимум: <strong>3–5 сидов</strong>, IQM-метрики, ~10–15 ключевых метрик каждые
          1–10k шагов, чекпоинты как W&amp;B Artifacts.
        </>,
      ]}
    />

    {/* Key findings grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {KEY_FINDINGS.map(({ title, text, icon: Icon, color }) => (
        <Card
          key={title}
          className={`group bg-card/60 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${COLOR_MAP[color]}`}
        >
          <CardContent className="p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-bold text-foreground leading-snug">{title}</h4>
              <Icon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-110" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const CompleteButton = () => {
  const [done, setDone] = useState<boolean>(() => isLessonComplete("2.6"));

  useEffect(() => {
    if (done) return;
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - window.innerHeight)) * 100;
      if (pct >= 90) {
        markLessonComplete("2.6");
        setDone(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [done]);

  const handleClick = () => {
    markLessonComplete("2.6");
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

const CourseLesson2_6 = () => {
  const lesson = getLessonById("2.6")!;

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
            <Link to="/courses#level-2" className="hover:text-cyan-400">
              Уровень 2
            </Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
          <li className="text-foreground" aria-current="page">
            Урок 2.6
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
            ) : s.id === "why-visualize" ? (
              <WhyVisualizeSection />
            ) : s.id === "metrics" ? (
              <MetricsTable />
            ) : s.id === "tensorboard" ? (
              <TensorBoardSection />
            ) : s.id === "wandb" ? (
              <WandbSection />
            ) : s.id === "compare" ? (
              <ComparisonTable />
            ) : s.id === "code" ? (
              <CodeExamples />
            ) : s.id === "diagnostics" ? (
              <DiagnosticCases />
            ) : s.id === "alternatives" ? (
              <AlternativesSection />
            ) : s.id === "recommendations" ? (
              <RecommendationsSection />
            ) : (
              <Placeholder n={i + 1} />
            )}
          </motion.section>
        ))}
      </div>

      <LessonTextbookLinks lessonId="2-6" lessonLabel="Урок 2.6. TensorBoard и W&B" />

      {/* Практика: собранная среда лаборатории для этой темы. */}
      <LabPracticeSection contextKey="2-6" />

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
        title="Урок 2.6. Визуализация обучения: TensorBoard и W&B | CyberUnityCode"
        description="Полный гайд по мониторингу RL-обучения: 15 ключевых метрик с интерпретацией, code-примеры PPO + SB3 + TensorBoard + W&B, диагностика 6 типичных проблем обучения. PRO-урок курса CyberUnityCode."
        path="/courses/2-6"
        type="article"
        image="/og/lesson-2-6.png"
        keywords="TensorBoard, Weights and Biases, RL, мониторинг обучения, PPO, Stable-Baselines3, визуализация"
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

export default CourseLesson2_6;
