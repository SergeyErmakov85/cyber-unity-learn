import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  Network,
  Route as RouteIcon,
  AlertTriangle,
  BarChart3,
  Map as MapIcon,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import MindMapCanvas, { Search, X } from "@/components/knowledge-map/MindMapCanvas";
import {
  KNOWLEDGE_MAP,
  ROADMAP,
  KNOWLEDGE_GAPS,
  NODE_INDEX,
  BRANCH_HSL,
  DIFFICULTY_META,
  getCoverageReport,
  type Difficulty,
} from "@/content/knowledgeMap";

const SECTION_TITLE_CLASS =
  "text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6";

const DIFFS: (Difficulty | "all")[] = ["all", "beginner", "intermediate", "advanced"];
const DIFF_LABEL: Record<Difficulty | "all", string> = {
  all: "Все уровни",
  beginner: "Новичок",
  intermediate: "Средний",
  advanced: "Продвинутый",
};

const KnowledgeMap = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [diff, setDiff] = useState<Difficulty | "all">("all");
  const report = getCoverageReport();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Карта знаний RL для NPC — интерактивный навигатор"
        description="Интерактивная карта знаний по Reinforcement Learning для разработки интеллектуальных NPC: от основ до деплоя. Уроки, проекты, инструменты и дорожная карта обучения в одном узле."
        path="/knowledge-map"
        type="article"
        keywords="карта знаний, reinforcement learning, RL, NPC, Unity ML-Agents, дорожная карта, mind map"
      />
      <Navbar />
      <ScrollToTop />

      <main className="container mx-auto max-w-6xl px-4 pb-20 pt-28 md:pt-32">
        {/* breadcrumbs */}
        <nav aria-label="Хлебные крошки" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <button onClick={() => navigate("/")} className="hover:text-primary">Главная</button>
            </li>
            <li><ArrowRight className="h-3.5 w-3.5" /></li>
            <li className="text-foreground">Карта знаний</li>
          </ol>
        </nav>

        {/* hero */}
        <Card className="mb-8 overflow-hidden border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm">
          <CardContent className="flex flex-col items-start gap-6 p-8 md:flex-row md:items-center">
            <div className="flex-1 space-y-3">
              <h1 className="text-3xl font-bold md:text-4xl">
                <span className="bg-gradient-neon bg-clip-text text-transparent">Карта знаний RL для NPC</span>
              </h1>
              <p className="max-w-2xl leading-relaxed text-muted-foreground">
                Центральный навигатор платформы: вся теория, инструменты и проекты по обучению с подкреплением,
                выстроенные в оптимальную последовательность для одной цели — спроектировать, обучить, оценить
                и развернуть интеллектуального NPC. Каждый узел кликабелен и ведёт к уроку.
              </p>
            </div>
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_32px_hsl(var(--primary)/0.45)]">
              <Network className="h-12 w-12 text-cyan-400 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
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
              <button
                onClick={() => setQuery("")}
                aria-label="Очистить"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
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
        <MindMapCanvas
          branches={KNOWLEDGE_MAP}
          root={{ label: "RL для NPC", caption: "Создание интеллектуальных NPC через обучение с подкреплением", link: "/courses" }}
          difficultyFilter={diff}
          query={query}
        />

        {/* дорожная карта */}
        <section className="mt-16">
          <div className="mb-2 flex items-center gap-3">
            <RouteIcon className="h-6 w-6 text-primary" />
            <h2 className={`${SECTION_TITLE_CLASS} mb-0 text-2xl md:text-3xl`}>Дорожная карта: от новичка к эксперту</h2>
          </div>
          <p className="mb-6 text-muted-foreground">Рекомендованная последовательность прохождения — пять фаз обучения.</p>

          <div className="space-y-4">
            {ROADMAP.map((phase, idx) => {
              const hsl = BRANCH_HSL[phase.color];
              return (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.2) }}
                  className="rounded-2xl border bg-card/60 p-5 backdrop-blur-sm"
                  style={{ borderColor: `hsl(${hsl} / 0.3)` }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold"
                      style={{ background: `hsl(${hsl} / 0.18)`, color: `hsl(${hsl})` }}
                    >
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-foreground">{phase.phase}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {phase.ids.map((id) => {
                      const entry = NODE_INDEX[id];
                      if (!entry) return null;
                      return (
                        <button
                          key={id}
                          onClick={() => navigate(entry.node.link)}
                          className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/40 px-2.5 py-1.5 text-xs text-foreground transition-all hover:scale-105"
                          style={{ borderColor: `hsl(${hsl} / 0.25)` }}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${DIFFICULTY_META[entry.node.difficulty].dot}`} />
                          {entry.node.label}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* анализ пробелов */}
        <section className="mt-16">
          <div className="mb-2 flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-pink-400" />
            <h2 className={`${SECTION_TITLE_CLASS} mb-0 text-2xl md:text-3xl`}>Пробелы: чего пока нет на платформе</h2>
          </div>
          <p className="mb-6 text-muted-foreground">Темы, которые стоит добавить для полного покрытия пути RL-разработчика NPC.</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {KNOWLEDGE_GAPS.map((g) => (
              <Card key={g.title} className="border-pink-500/20 bg-card/60 backdrop-blur-sm">
                <CardContent className="space-y-3 p-5">
                  <h3 className="font-bold text-foreground">{g.title}</h3>
                  <ul className="space-y-2">
                    {g.items.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-400" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* отчёт о покрытии */}
        <section className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className={`${SECTION_TITLE_CLASS} mb-0 text-2xl md:text-3xl`}>Отчёт о покрытии</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Ветвей знаний", value: report.branches },
              { label: "Тем и уроков", value: report.totalNodes },
              { label: "Связей-ссылок", value: report.links },
              { label: "Найдено пробелов", value: report.gaps },
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

        {/* ветви списком (доступность + быстрый доступ) */}
        <section className="mt-16">
          <div className="mb-6 flex items-center gap-3">
            <MapIcon className="h-6 w-6 text-secondary" />
            <h2 className={`${SECTION_TITLE_CLASS} mb-0 text-2xl md:text-3xl`}>Все разделы карты</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {KNOWLEDGE_MAP.map((b) => {
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
                          className="rounded-lg border border-border/50 bg-background/40 px-2.5 py-1 text-xs text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                        >
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

        <div className="mt-12 flex justify-center">
          <Button variant="outline" onClick={() => navigate("/")} className="border-primary/50 text-primary hover:bg-primary/10">
            <ArrowLeft className="mr-2 h-4 w-4" /> На главную
          </Button>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default KnowledgeMap;
