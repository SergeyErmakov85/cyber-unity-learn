import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import ProGate from "@/components/ProGate";
import LessonHeader from "@/components/LessonHeader";
import SectionNav, { SectionNavItem } from "@/components/SectionNav";
import NextPrevLesson from "@/components/NextPrevLesson";
import { getLessonById } from "@/data/lessons";

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
            <Placeholder n={i + 1} />
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
