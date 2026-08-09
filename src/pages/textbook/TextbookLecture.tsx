import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Layers } from "lucide-react";

import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import ReturnToLessonChip from "@/components/math-rl/ReturnToLessonChip";
import { Skeleton } from "@/components/ui/skeleton";
import { DIFFICULTY_META, type Difficulty } from "@/content/knowledgeMap";
import { findLecture, PART_INDEX } from "@/content/textbook/index.generated";
import { partBySegment, partRoute, TEXTBOOK_ROOT } from "@/content/textbook/parts";
import { loadMarkdown } from "@/content/textbook/loader";
import MarkdownLecture from "@/components/textbook/MarkdownLecture";
import ColorLegend from "@/components/textbook/ColorLegend";
import LectureCrossLinks from "@/components/textbook/LectureCrossLinks";

/** Якорь может прийти из урока или из mind map — ждём, пока markdown отрисуется. */
const scrollToHashWhenReady = (hash: string, maxWaitMs = 3000) => {
  const id = decodeURIComponent(hash.replace("#", ""));
  if (!id) return;
  const deadline = Date.now() + maxWaitMs;
  const tick = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (Date.now() < deadline) window.requestAnimationFrame(() => window.setTimeout(tick, 80));
  };
  tick();
};

const TextbookLecture = () => {
  const { part: partSegment = "", slug = "" } = useParams();
  const location = useLocation();
  const [source, setSource] = useState<string | null>(null);

  const part = partBySegment(partSegment);
  const lecture = findLecture(partSegment, slug);

  useEffect(() => {
    if (!part || !lecture) return;
    let cancelled = false;
    setSource(null);
    void loadMarkdown(part.dir, lecture.slug).then((text) => {
      if (!cancelled) setSource(text);
    });
    return () => {
      cancelled = true;
    };
  }, [part, lecture]);

  useEffect(() => {
    if (source && location.hash) scrollToHashWhenReady(location.hash);
  }, [source, location.hash]);

  if (!part || !lecture) return <Navigate to={TEXTBOOK_ROOT} replace />;

  const siblings = PART_INDEX[partSegment] ?? [];
  const index = siblings.findIndex((l) => l.slug === lecture.slug);
  const prev = index > 0 ? siblings[index - 1] : null;
  const next = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;
  const difficulty = lecture.difficulty ? DIFFICULTY_META[lecture.difficulty as Difficulty] : null;
  const toc = lecture.headings.filter((h) => h.level === 2);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${lecture.title} — Математика RL`}
        description={lecture.description || `${lecture.title}. Раздел учебного пособия по математике RL.`}
        path={lecture.route}
        type="article"
        keywords={lecture.tags.join(", ")}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "LearningResource",
          name: lecture.title,
          description: lecture.description,
          inLanguage: "ru",
          educationalLevel: lecture.difficulty ?? undefined,
          timeRequired: lecture.duration ? `PT${lecture.duration}M` : undefined,
          isPartOf: { "@type": "Course", name: `Часть ${part.roman}. ${part.title}` },
        }}
      />
      <Navbar />
      <ReturnToLessonChip />
      <ScrollProgressBar />
      <ScrollToTop />

      <main className="container mx-auto max-w-7xl px-4 pb-20 pt-28 md:pt-32">
        <nav aria-label="Хлебные крошки" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li><Link to="/math-rl" className="hover:text-primary">Математика RL</Link></li>
            <li><ArrowRight className="h-3.5 w-3.5" /></li>
            <li><Link to={TEXTBOOK_ROOT} className="hover:text-primary">Учебник</Link></li>
            <li><ArrowRight className="h-3.5 w-3.5" /></li>
            <li>
              <Link to={partRoute(part.segment)} className="hover:text-primary">
                Часть {part.roman}
              </Link>
            </li>
            <li><ArrowRight className="h-3.5 w-3.5" /></li>
            <li className="text-foreground">{lecture.title}</li>
          </ol>
        </nav>

        <div className="flex gap-8">
          {/* Оглавление лекции */}
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <nav className="sticky top-24 space-y-1">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                В этом разделе
              </p>
              {toc.map((h) => (
                <a
                  key={h.slug}
                  href={`#${h.slug}`}
                  className="block rounded px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground"
                >
                  {h.text}
                </a>
              ))}

              <div className="mt-4 border-t border-border/30 pt-4">
                <Link
                  to={`${lecture.hubRoute}#${lecture.hubAnchor}`}
                  className="block rounded px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-primary/5 hover:text-foreground"
                >
                  <span className="mr-1.5 font-bold text-primary">↗</span>
                  Краткая версия в хабе
                </Link>
              </div>
            </nav>
          </aside>

          <article className="min-w-0 flex-1 max-w-4xl">
            <header className="mb-8">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Часть {part.roman} · {part.title}
              </p>
              <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">{lecture.title}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {difficulty && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 px-2.5 py-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${difficulty.dot}`} />
                    {difficulty.label}
                  </span>
                )}
                {lecture.duration && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 px-2.5 py-1">
                    <Clock className="h-3 w-3" /> {lecture.duration} мин
                  </span>
                )}
                {lecture.mindmapNode && (
                  <Link
                    to="/math-rl/mindmap"
                    className="inline-flex items-center gap-1.5 rounded-full border border-secondary/40 px-2.5 py-1 text-secondary transition-colors hover:bg-secondary/10"
                  >
                    <Layers className="h-3 w-3" /> {lecture.mindmapNode}
                  </Link>
                )}
                <Link
                  to={`${lecture.hubRoute}#${lecture.hubAnchor}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 px-2.5 py-1 text-primary transition-colors hover:bg-primary/10"
                >
                  <BookOpen className="h-3 w-3" /> Краткая версия в хабе
                </Link>
              </div>
            </header>

            <ColorLegend />

            {source === null ? (
              <div className="space-y-4 py-8">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <MarkdownLecture source={source} partDir={part.dir} />
            )}

            <LectureCrossLinks route={lecture.route} />

            {/* Предыдущий / следующий раздел */}
            <nav className="mt-12 grid gap-4 border-t border-border/30 pt-8 sm:grid-cols-2">
              {prev ? (
                <Link
                  to={prev.route}
                  className="group rounded-lg border border-border/50 p-4 transition-colors hover:border-primary/50"
                >
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ArrowLeft className="h-3 w-3" /> Предыдущий раздел
                  </span>
                  <span className="mt-1 block text-sm font-medium text-foreground group-hover:text-primary">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  to={next.route}
                  className="group rounded-lg border border-border/50 p-4 text-right transition-colors hover:border-primary/50 sm:col-start-2"
                >
                  <span className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                    Следующий раздел <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="mt-1 block text-sm font-medium text-foreground group-hover:text-primary">
                    {next.title}
                  </span>
                </Link>
              )}
            </nav>
          </article>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default TextbookLecture;
