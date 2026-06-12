import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Sigma, Route as RouteIcon, BarChart3, Map as MapIcon } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import MindMapCanvas, { Search, X } from "@/components/knowledge-map/MindMapCanvas";
import { BRANCH_HSL, DIFFICULTY_META, type Difficulty } from "@/content/knowledgeMap";
import { MATH_BRANCHES, MATH_ROOT, MATH_ORDER, getMathCoverage } from "@/content/mathMindMap";

const SECTION_TITLE_CLASS =
  "text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6";

const DIFFS: (Difficulty | "all")[] = ["all", "beginner", "intermediate", "advanced"];
const DIFF_LABEL: Record<Difficulty | "all", string> = {
  all: "Все уровни",
  beginner: "Новичок",
  intermediate: "Средний",
  advanced: "Продвинутый",
};

const MathMindMap = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [diff, setDiff] = useState<Difficulty | "all">("all");
  const report = getMathCoverage();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Карта математики RL — интерактивный навигатор хаба «Математика»"
        description="Интерактивная mind map хаба «Математика RL»: семь разделов от пределов и производных до уравнений Беллмана, PPO и глубокого RL. Каждый узел ведёт к нужной теме."
        path="/math-rl/mindmap"
        type="article"
        keywords="математика RL, mind map, пределы, градиент, линейная алгебра, вероятность, Беллман, PPO, deep RL"
      />
      <Navbar />
      <ScrollToTop />

      <main className="container mx-auto max-w-6xl px-4 pb-20 pt-28 md:pt-32">
        {/* breadcrumbs */}
        <nav aria-label="Хлебные крошки" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li><button onClick={() => navigate("/")} className="hover:text-primary">Главная</button></li>
            <li><ArrowRight className="h-3.5 w-3.5" /></li>
            <li><button onClick={() => navigate("/math-rl")} className="hover:text-primary">Математика RL</button></li>
            <li><ArrowRight className="h-3.5 w-3.5" /></li>
            <li className="text-foreground">Карта</li>
          </ol>
        </nav>

        {/* hero */}
        <Card className="mb-8 overflow-hidden border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm">
          <CardContent className="flex flex-col items-start gap-6 p-8 md:flex-row md:items-center">
            <div className="flex-1 space-y-3">
              <h1 className="text-3xl font-bold md:text-4xl">
                <span className="bg-gradient-neon bg-clip-text text-transparent">Карта математики RL</span>
              </h1>
              <p className="max-w-2xl leading-relaxed text-muted-foreground">
                Интерактивный навигатор по семи разделам хаба «Математика»: от пределов, производных и линейной
                алгебры — через вероятность и оптимизацию политик — к уравнениям Беллмана, PPO и глубокому RL.
                Каждый узел ведёт к нужной теме внутри учебного модуля.
              </p>
            </div>
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_32px_hsl(var(--primary)/0.45)]">
              <Sigma className="h-12 w-12 text-cyan-400 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
            </div>
          </CardContent>
        </Card>

        {/* controls */}
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по карте…"
              className="w-full rounded-full border border-border/50 bg-card/60 py-2 pl-9 pr-9 text-sm text-foreground outline-none backdrop-blur-sm transition-colors focus:border-primary/60"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Очистить" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DIFFS.map((d) => (
              <button
                key={d}
                onClick={() => setDiff(d)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  diff === d
                    ? "border-primary/70 bg-primary/15 text-primary shadow-glow-cyan"
                    : "border-border/50 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {DIFF_LABEL[d]}
              </button>
            ))}
          </div>
        </div>

        {/* интерактивная карта */}
        <MindMapCanvas branches={MATH_BRANCHES} root={MATH_ROOT} difficultyFilter={diff} query={query} />

        {/* порядок изучения */}
        <section className="mt-16">
          <div className="mb-2 flex items-center gap-3">
            <RouteIcon className="h-6 w-6 text-primary" />
            <h2 className={`${SECTION_TITLE_CLASS} mb-0 text-2xl md:text-3xl`}>Порядок изучения</h2>
          </div>
          <p className="mb-6 text-muted-foreground">Семь разделов выстроены в естественную математическую прогрессию.</p>
          <div className="flex flex-wrap items-center gap-2">
            {MATH_ORDER.map((p, i) => {
              const hsl = BRANCH_HSL[p.color];
              return (
                <div key={p.id} className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(p.base)}
                    className="flex items-center gap-2 rounded-xl border bg-card/60 px-3 py-2 text-sm text-foreground backdrop-blur-sm transition-all hover:scale-105"
                    style={{ borderColor: `hsl(${hsl} / 0.35)`, boxShadow: `0 0 14px hsl(${hsl} / 0.2)` }}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold" style={{ background: `hsl(${hsl} / 0.18)`, color: `hsl(${hsl})` }}>
                      {i + 1}
                    </span>
                    {p.label}
                  </button>
                  {i < MATH_ORDER.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                </div>
              );
            })}
          </div>
        </section>

        {/* отчёт о покрытии */}
        <section className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className={`${SECTION_TITLE_CLASS} mb-0 text-2xl md:text-3xl`}>Отчёт о покрытии</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Разделов хаба", value: report.branches },
              { label: "Тем на карте", value: report.totalNodes },
              { label: "Связей-ссылок", value: report.links },
            ].map((s) => (
              <Card key={s.label} className="border-cyan-500/20 bg-card/60 text-center backdrop-blur-sm">
                <CardContent className="p-5">
                  <div className="bg-gradient-neon bg-clip-text text-4xl font-bold text-transparent">{s.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* все разделы списком */}
        <section className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <MapIcon className="h-6 w-6 text-secondary" />
            <h2 className={`${SECTION_TITLE_CLASS} mb-0 text-2xl md:text-3xl`}>Все разделы карты</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {MATH_BRANCHES.map((b) => {
              const hsl = BRANCH_HSL[b.color];
              const Icon = b.icon;
              return (
                <Card key={b.id} className="bg-card/60 backdrop-blur-sm" style={{ borderColor: `hsl(${hsl} / 0.3)` }}>
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `hsl(${hsl} / 0.15)` }}>
                        <Icon className="h-5 w-5" style={{ color: `hsl(${hsl})` }} />
                      </span>
                      <div>
                        <h3 className="font-bold text-foreground">{b.label}</h3>
                        <p className="text-xs text-muted-foreground">{b.caption}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {b.nodes.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => navigate(n.link)}
                          className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/40 px-2.5 py-1 text-xs text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${DIFFICULTY_META[n.difficulty].dot}`} />
                          {n.label}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Button variant="outline" onClick={() => navigate("/math-rl")} className="border-primary/50 text-primary hover:bg-primary/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> К хабу «Математика»
          </Button>
          <Button variant="outline" onClick={() => navigate("/knowledge-map")} className="border-secondary/50 text-secondary hover:bg-secondary/10">
            Общая карта знаний <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default MathMindMap;
