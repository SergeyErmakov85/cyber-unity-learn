import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import ReturnToLessonChip from "@/components/math-rl/ReturnToLessonChip";
import { Skeleton } from "@/components/ui/skeleton";
import { DIFFICULTY_META, type Difficulty } from "@/content/knowledgeMap";
import { PART_INDEX, PARTS_META } from "@/content/textbook/index.generated";
import { partBySegment, TEXTBOOK_PARTS, TEXTBOOK_ROOT } from "@/content/textbook/parts";
import { loadMarkdown } from "@/content/textbook/loader";
import { sections } from "@/lib/plural";
import MarkdownLecture from "@/components/textbook/MarkdownLecture";

const TextbookPart = () => {
  const { part: segment = "" } = useParams();
  const part = partBySegment(segment);
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    if (!part) return;
    let cancelled = false;
    setSource(null);
    void loadMarkdown(part.dir, "index").then((text) => {
      if (!cancelled) setSource(text);
    });
    return () => {
      cancelled = true;
    };
  }, [part]);

  if (!part) return <Navigate to={TEXTBOOK_ROOT} replace />;

  const meta = PARTS_META.find((p) => p.segment === segment);
  const lectures = PART_INDEX[segment] ?? [];
  const minutes = lectures.reduce((sum, l) => sum + (l.duration ?? 0), 0);
  const order = TEXTBOOK_PARTS.findIndex((p) => p.segment === segment);
  const prevPart = order > 0 ? TEXTBOOK_PARTS[order - 1] : null;
  const nextPart = order < TEXTBOOK_PARTS.length - 1 ? TEXTBOOK_PARTS[order + 1] : null;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Часть ${part.roman}. ${part.title} — Математика RL`}
        description={meta?.description || part.caption}
        path={`${TEXTBOOK_ROOT}/${part.segment}`}
        type="article"
      />
      <Navbar />
      <ReturnToLessonChip />
      <ScrollToTop />

      <main className="container mx-auto max-w-4xl px-4 pb-20 pt-28 md:pt-32">
        <nav aria-label="Хлебные крошки" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li><Link to="/math-rl" className="hover:text-primary">Математика RL</Link></li>
            <li><ArrowRight className="h-3.5 w-3.5" /></li>
            <li><Link to={TEXTBOOK_ROOT} className="hover:text-primary">Учебник</Link></li>
            <li><ArrowRight className="h-3.5 w-3.5" /></li>
            <li className="text-foreground">Часть {part.roman}</li>
          </ol>
        </nav>

        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Часть {part.roman}</p>
          <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">{part.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 px-2.5 py-1">
              <BookOpen className="h-3 w-3" /> {sections(lectures.length)}
            </span>
            {minutes > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 px-2.5 py-1">
                <Clock className="h-3 w-3" /> ≈ {Math.round(minutes / 60)} ч
              </span>
            )}
            <Link
              to={part.hubRoute}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 px-2.5 py-1 text-primary transition-colors hover:bg-primary/10"
            >
              Обзорная версия в хабе →
            </Link>
          </div>
        </header>

        {source === null ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <MarkdownLecture source={source} partDir={part.dir} />
        )}

        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Разделы части</h2>
          <ol className="space-y-2">
            {lectures.map((lecture, i) => {
              const difficulty = lecture.difficulty
                ? DIFFICULTY_META[lecture.difficulty as Difficulty]
                : null;
              return (
                <li key={lecture.id}>
                  <Link
                    to={lecture.route}
                    className="group flex items-baseline gap-3 rounded-lg border border-border/40 px-4 py-3 transition-colors hover:border-primary/50 hover:bg-primary/5"
                  >
                    <span className="w-6 flex-none text-xs text-muted-foreground">{i + 1}.</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground group-hover:text-primary">
                        {lecture.title}
                      </span>
                      {lecture.mindmapNode && (
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          mind map: {lecture.mindmapNode}
                        </span>
                      )}
                    </span>
                    {difficulty && (
                      <span className="flex flex-none items-center gap-1.5 text-xs text-muted-foreground">
                        <span className={`h-1.5 w-1.5 rounded-full ${difficulty.dot}`} />
                        {difficulty.label}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        <nav className="mt-12 grid gap-4 border-t border-border/30 pt-8 sm:grid-cols-2">
          {prevPart ? (
            <Link
              to={`${TEXTBOOK_ROOT}/${prevPart.segment}`}
              className="rounded-lg border border-border/50 p-4 text-sm transition-colors hover:border-primary/50"
            >
              <span className="block text-xs text-muted-foreground">Предыдущая часть</span>
              <span className="mt-1 block font-medium text-foreground">
                {prevPart.roman}. {prevPart.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {nextPart && (
            <Link
              to={`${TEXTBOOK_ROOT}/${nextPart.segment}`}
              className="rounded-lg border border-border/50 p-4 text-right text-sm transition-colors hover:border-primary/50 sm:col-start-2"
            >
              <span className="block text-xs text-muted-foreground">Следующая часть</span>
              <span className="mt-1 block font-medium text-foreground">
                {nextPart.roman}. {nextPart.title}
              </span>
            </Link>
          )}
        </nav>
      </main>

      <FooterSection />
    </div>
  );
};

export default TextbookPart;
