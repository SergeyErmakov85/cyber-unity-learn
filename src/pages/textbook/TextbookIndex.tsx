import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clock, Network, Sigma } from "lucide-react";

import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PART_INDEX, TOTAL_LECTURES, TOTAL_MINUTES } from "@/content/textbook/index.generated";
import { TEXTBOOK_PARTS, TEXTBOOK_ROOT } from "@/content/textbook/parts";
import { loadTextbookReadme } from "@/content/textbook/loader";
import { sections } from "@/lib/plural";
import MarkdownLecture from "@/components/textbook/MarkdownLecture";

const TextbookIndex = () => {
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void loadTextbookReadme().then((text) => {
      if (!cancelled) setSource(text);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Учебник по математике RL — 51 раздел от предела до PPO"
        description="Полный курс математики для обучения с подкреплением: пределы и ряды, производные и градиент, линейная алгебра, вероятность, оптимизация политик, уравнения Беллмана и глубокое RL."
        path={TEXTBOOK_ROOT}
        type="article"
        keywords="математика RL, пределы, градиент, линейная алгебра, вероятность, уравнения Беллмана, PPO, deep RL"
      />
      <Navbar />
      <ScrollToTop />

      <main className="container mx-auto max-w-5xl px-4 pb-20 pt-28 md:pt-32">
        <nav aria-label="Хлебные крошки" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li><Link to="/math-rl" className="hover:text-primary">Математика RL</Link></li>
            <li><ArrowRight className="h-3.5 w-3.5" /></li>
            <li className="text-foreground">Учебник</li>
          </ol>
        </nav>

        <Card className="mb-10 overflow-hidden border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm">
          <CardContent className="flex flex-col items-start gap-6 p-8 md:flex-row md:items-center">
            <div className="flex-1 space-y-3">
              <h1 className="text-3xl font-bold md:text-4xl">
                <span className="bg-gradient-neon bg-clip-text text-transparent">
                  Учебник по математике RL
                </span>
              </h1>
              <p className="max-w-2xl leading-relaxed text-muted-foreground">
                Полный курс математики, необходимой для обучения с подкреплением: от предела
                последовательности до формул PPO и конфигурации Unity ML-Agents. Каждый раздел —
                самостоятельная лекция с выводами, примерами на числах, кодом и задачами.
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 px-2.5 py-1">
                  <BookOpen className="h-3 w-3" /> {sections(TOTAL_LECTURES)} в 7 частях
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 px-2.5 py-1">
                  <Clock className="h-3 w-3" /> ≈ {Math.round(TOTAL_MINUTES / 60)} ч чтения
                </span>
                <Link
                  to="/math-rl/mindmap"
                  className="inline-flex items-center gap-1.5 rounded-full border border-secondary/40 px-2.5 py-1 text-secondary transition-colors hover:bg-secondary/10"
                >
                  <Network className="h-3 w-3" /> Карта математики
                </Link>
              </div>
            </div>
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_32px_hsl(var(--primary)/0.45)]">
              <Sigma className="h-12 w-12 text-cyan-400 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
            </div>
          </CardContent>
        </Card>

        <section className="mb-12 grid gap-4 md:grid-cols-2">
          {TEXTBOOK_PARTS.map((part) => {
            const lectures = PART_INDEX[part.segment] ?? [];
            return (
              <Link
                key={part.segment}
                to={`${TEXTBOOK_ROOT}/${part.segment}`}
                className="group rounded-xl border border-border/50 bg-card/40 p-5 transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Часть {part.roman}
                </span>
                <h2 className="mt-1 text-lg font-semibold text-foreground group-hover:text-primary">
                  {part.title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{part.caption}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {sections(lectures.length)} · <span className="text-primary/80">есть краткая версия в хабе</span>
                </p>
              </Link>
            );
          })}
        </section>

        {source === null ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <MarkdownLecture source={source} partDir="" />
        )}
      </main>

      <FooterSection />
    </div>
  );
};

export default TextbookIndex;
