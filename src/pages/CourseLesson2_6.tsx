import { Link } from "react-router-dom";
import {
  Home,
  ChevronRight,
  LineChart,
  Link2,
  ListChecks,
  BarChart3,
  GraduationCap,
} from "lucide-react";
import ProGate from "@/components/ProGate";
import LessonHeader from "@/components/LessonHeader";
import SectionNav, { SectionNavItem } from "@/components/SectionNav";
import NextPrevLesson from "@/components/NextPrevLesson";
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
import { Card, CardContent } from "@/components/ui/card";
import { getLessonById } from "@/data/lessons";

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

const CourseLesson2_6 = () => {
  const lesson = getLessonById("2.6")!;

  const content = (
    <>
      {/* Breadcrumbs */}
      <nav aria-label="Хлебные крошки" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-cyan-400 inline-flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Главная
            </Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <li>
            <Link to="/courses" className="hover:text-cyan-400">
              Курс
            </Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <li>
            <Link to="/courses#level-2" className="hover:text-cyan-400">
              Уровень 2
            </Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
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

      <SectionNav items={SECTIONS} />

      <div className="space-y-8 mt-8">
        {SECTIONS.map((s, i) => (
          <section key={s.id} id={s.id} className={SECTION_CLASS}>
            <h2 className={SECTION_TITLE_CLASS}>{s.label}</h2>
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
          </section>
        ))}
      </div>

      <NextPrevLesson prev={lesson.prev} next={lesson.next} />
    </>
  );

  // isPro={false} в промпте: контент доступен всем, но обёртка ProGate сохранена
  // как структурный компонент. Передаём content и в preview, и в children.
  return (
    <main className="container max-w-5xl mx-auto px-4 py-8">
      <ProGate preview={content}>{content}</ProGate>
    </main>
  );
};

export default CourseLesson2_6;
