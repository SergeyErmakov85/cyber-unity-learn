import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BookOpen, FolderKanban, Circle, CheckCircle2,
  Lock, Crown, Menu, ExternalLink, Lightbulb, BarChart3, Share2, Check
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { getLinksForLesson, type CrossLink } from "@/config/crosslinks";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ScrollToTop from "@/components/ScrollToTop";
import LessonBreadcrumbs from "@/components/LessonBreadcrumbs";
import SEOHead from "@/components/SEOHead";
import ProUpgradeBanner from "@/components/ProUpgradeBanner";
import { completeLesson, getProgress } from "@/lib/gamification";

interface LessonMeta {
  id: string;
  path: string;
  title: string;
  type: "lesson" | "project";
}

interface LessonLayoutProps {
  children: ReactNode;
  lessonTitle: string;
  lessonNumber: string;
  duration: string;
  tags: string[];
  level?: number;
  difficulty?: "easy" | "medium" | "hard";
  colabUrl?: string;
  keyConcepts?: string[];
  prevLesson?: { path: string; title: string };
  nextLesson?: { path: string; title: string };
  lessonId?: string;
}

const level1Lessons: LessonMeta[] = [
  { id: "1-1", path: "/courses/1-1", title: "Что такое обучение с подкреплением?", type: "lesson" },
  { id: "1-2", path: "/courses/1-2", title: "Установка окружения: PyTorch + Unity ML-Agents", type: "lesson" },
  { id: "1-3", path: "/courses/1-3", title: "Q-Learning: табличный метод", type: "lesson" },
  { id: "1-4", path: "/courses/1-4", title: "CartPole — твой первый RL-агент", type: "lesson" },
  { id: "1-5", path: "/courses/1-5", title: "DQN с нуля на PyTorch", type: "lesson" },
  { id: "1-6", path: "/courses/1-6", title: "Марковские процессы принятия решений (MDP)", type: "lesson" },
  { id: "1-7", path: "/courses/1-7", title: "Exploration vs Exploitation", type: "lesson" },
  { id: "1-p", path: "/courses/project-1", title: 'Проект-1: "Баланс в 3D"', type: "project" },
];

const level2Lessons: LessonMeta[] = [
  { id: "2-1", path: "/courses/2-1", title: "Policy Gradient и теорема градиента", type: "lesson" },
  { id: "2-2", path: "/courses/2-2", title: "PPO — реализация с нуля", type: "lesson" },
  { id: "2-3", path: "/courses/2-3", title: "Непрерывные действия и Actor-Critic", type: "lesson" },
  { id: "2-4", path: "/courses/2-4", title: "Reward Shaping", type: "lesson" },
  { id: "2-5", path: "/courses/2-5", title: "Параллельные среды", type: "lesson" },
  { id: "2-6", path: "/courses/2-6", title: "TensorBoard и W&B", type: "lesson" },
  { id: "2-p1", path: "/courses/project-2", title: "Проект: 3D-охотник", type: "project" },
  { id: "2-p2", path: "/courses/project-3", title: "Проект: Racing Car", type: "project" },
];

const level3Lessons: LessonMeta[] = [
  { id: "3-1", path: "/courses/3-1", title: "SAC — Soft Actor-Critic", type: "lesson" },
  { id: "3-2", path: "/courses/3-2", title: "MA-POCA и Self-Play", type: "lesson" },
  { id: "3-3", path: "/courses/3-3", title: "Curriculum Learning", type: "lesson" },
  { id: "3-4", path: "/courses/3-4", title: "Имитационное обучение (GAIL)", type: "lesson" },
  { id: "3-5", path: "/courses/3-5", title: "Деплой модели: ONNX", type: "lesson" },
  { id: "3-6", path: "/courses/3-6", title: "Оптимизация гиперпараметров", type: "lesson" },
  { id: "3-7", path: "/courses/3-7", title: "Архитектуры нейросетей", type: "lesson" },
  { id: "3-fp", path: "/courses/final-project", title: "Финальный проект", type: "project" },
];

const levelConfigs = [
  { label: "Уровень 1 — Новичок", lessons: level1Lessons, tag: "FREE", tagClass: "text-green-400" },
  { label: "Уровень 2 — Средний", lessons: level2Lessons, tag: "PRO", tagClass: "text-secondary" },
  { label: "Уровень 3 — Продвинутый", lessons: level3Lessons, tag: "PRO", tagClass: "text-orange-400" },
];

const difficultyConfig = {
  easy: { label: "Легко", color: "text-green-400 bg-green-500/10 border-green-500/30" },
  medium: { label: "Средне", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30" },
  hard: { label: "Сложно", color: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
};

const SidebarContent = ({ currentPath }: { currentPath: string }) => {
  const progress = getProgress();

  return (
    <div className="space-y-4">
      {levelConfigs.map((cfg, li) => (
        <div key={li}>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3 flex items-center gap-2">
            {cfg.label}
            {cfg.tag === "PRO" && <Crown className="w-3 h-3 text-secondary" />}
          </h3>
          <div className="space-y-0.5">
            {cfg.lessons.map((l) => {
              const active = currentPath === l.path;
              const completed = progress.completedLessons.includes(l.path);
              return (
                <Link
                  key={l.id}
                  to={l.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors",
                    active
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  {l.type === "project" ? (
                    <FolderKanban className="w-3 h-3 flex-shrink-0" />
                  ) : completed ? (
                    <CheckCircle2 className="w-3 h-3 flex-shrink-0 text-green-400" />
                  ) : active ? (
                    <BarChart3 className="w-3 h-3 flex-shrink-0" />
                  ) : cfg.tag === "PRO" ? (
                    <Lock className="w-3 h-3 flex-shrink-0" />
                  ) : (
                    <Circle className="w-3 h-3 flex-shrink-0" />
                  )}
                  <span className="truncate">{l.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const LessonLayout = ({
  children,
  lessonTitle,
  lessonNumber,
  duration,
  tags,
  level = 1,
  difficulty = "medium",
  colabUrl,
  keyConcepts,
  prevLesson,
  nextLesson,
  lessonId,
}: LessonLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isPro = level >= 2;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const crossLinkGroups = useMemo(() => {
    if (!lessonId) return [];
    const links = getLinksForLesson(lessonId);
    const grouped = new Map<string, CrossLink[]>();
    for (const link of links) {
      const key = link.hubLabel.split(" → ")[0] || link.hubLabel;
      const arr = grouped.get(key) ?? [];
      arr.push(link);
      grouped.set(key, arr);
    }
    return Array.from(grouped.entries()).map(([hubTitle, links]) => ({ hubTitle, links }));
  }, [lessonId]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: lessonTitle, url });
        return;
      }
    } catch {
      // user cancelled or permission denied — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  const isLevel2 = level === 2;
  const progressColor = isLevel2
    ? "bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
    : level === 1
      ? "bg-green-500"
      : "bg-orange-500";
  const diff = difficultyConfig[difficulty];

  const levelLabel = level === 1 ? "Уровень 1" : level === 2 ? "Уровень 2" : "Уровень 3";
  const breadcrumbItems = [
    { label: "Курсы", href: "/courses" },
    { label: levelLabel, href: "/courses" },
    { label: `Урок ${lessonNumber}` },
  ];

  // Track scroll to bottom for lesson completion
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !lessonCompleted) {
          setLessonCompleted(true);
          completeLesson(location.pathname);
        }
      },
      { threshold: 0.5 }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [location.pathname, lessonCompleted]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Урок ${lessonNumber}: ${lessonTitle} | RL Platform`}
        description={`${lessonTitle}. Практический урок по Reinforcement Learning с примерами кода на PyTorch.`}
        path={location.pathname}
      />
      <ScrollProgressBar color={progressColor} />
      <ScrollToTop />

      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          {/* Mobile sidebar trigger */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-background/95 backdrop-blur-xl border-r border-primary/30 p-4 pt-8">
              <h2 className="text-sm font-semibold text-foreground mb-4 px-3">Содержание курса</h2>
              <SidebarContent currentPath={location.pathname} />
            </SheetContent>
          </Sheet>

          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Курсы</span>
          </Link>
          <span className="text-border">|</span>
          <span className="text-sm text-muted-foreground truncate">Урок {lessonNumber}</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
            <SidebarContent currentPath={location.pathname} />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-3xl">
          <LessonBreadcrumbs items={breadcrumbItems} />

          {/* Lesson header */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded-full border",
                isPro
                  ? "bg-secondary/20 text-secondary border-secondary/30"
                  : "bg-green-500/20 text-green-400 border-green-500/30"
              )}>
                {isPro ? "PRO" : "FREE"}
              </span>
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full border", diff.color)}>
                {diff.label}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> {duration}
              </span>
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="ml-auto text-muted-foreground hover:text-primary"
              >
                {copied ? (
                  <><Check className="w-4 h-4 mr-1 text-green-400" /> Скопировано</>
                ) : (
                  <><Share2 className="w-4 h-4 mr-1" /> Поделиться</>
                )}
              </Button>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              <span className="text-muted-foreground font-normal text-2xl md:text-3xl">
                {lessonNumber}.{" "}
              </span>
              {isLevel2 ? (
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {lessonTitle}
                </span>
              ) : (
                lessonTitle
              )}
            </h1>
          </div>

          {/* Key Concepts */}
          {keyConcepts && keyConcepts.length > 0 && (
            <div className="mb-8 p-5 rounded-lg border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Ключевые концепции</h3>
              </div>
              <ul className="space-y-2">
                {keyConcepts.map((concept, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">▸</span>
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Colab button */}
          {colabUrl && (
            <a
              href={colabUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mb-8 px-4 py-2.5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20 transition-colors text-sm font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.941 4.976a7.033 7.033 0 0 0-4.93 2.064 7.033 7.033 0 0 0-.124 9.807l2.395-2.395a3.646 3.646 0 0 1 5.15-5.148l2.397-2.399a7.033 7.033 0 0 0-4.888-1.93z"/>
                <path d="M7.074 4.976a7.033 7.033 0 0 0-4.888 1.93l2.397 2.398a3.646 3.646 0 0 1 5.15 5.149l2.395 2.395a7.033 7.033 0 0 0-.124-9.808 7.033 7.033 0 0 0-4.93-2.064z"/>
                <path d="M7.074 19.024a7.033 7.033 0 0 0 4.93-2.064l-2.395-2.395a3.646 3.646 0 0 1-5.15-5.149L2.063 7.019A7.033 7.033 0 0 0 7.074 19.024z"/>
              </svg>
              Открыть в Google Colab
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Lesson body */}
          <article className="prose-cyber space-y-6">{children}</article>

          {/* Crosslinks section */}
          {crossLinkGroups.length > 0 && (
            <section className="mt-12 pt-8 border-t border-border/30">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                🔗 Углубись в тему
              </h2>
              <div className="grid gap-3">
                {crossLinkGroups.map((group) => (
                  <Card key={group.hubTitle} className="bg-card/40 border-border/20">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-semibold text-foreground mb-2">{group.hubTitle}</h3>
                      {group.links.map((link, i) => (
                        <div key={i} className="flex items-start gap-2 py-1">
                          <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <div>
                            <CrossLinkToHub hubPath={link.hubPath} hubAnchor={link.hubAnchor} hubTitle={link.hubLabel}>
                              {link.hubLabel}
                            </CrossLinkToHub>
                            <p className="text-xs text-muted-foreground">{link.contextInLesson}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Pro upgrade banner for free lessons */}
          {level === 1 && <ProUpgradeBanner />}

          {/* Scroll completion marker */}
          <div ref={bottomRef} className="h-1" />

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-border/50">
            {prevLesson ? (
              <Button variant="outline" asChild>
                <Link to={prevLesson.path} className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{prevLesson.title}</span>
                  <span className="sm:hidden">Назад</span>
                </Link>
              </Button>
            ) : (
              <div />
            )}
            {nextLesson ? (
              <Button variant="default" asChild>
                <Link to={nextLesson.path} className="flex items-center gap-2">
                  <span className="hidden sm:inline">{nextLesson.title}</span>
                  <span className="sm:hidden">Далее</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            ) : (
              <div />
            )}
          </div>
        </main>
      </div>

      {/* Mobile floating nav */}
      {(prevLesson || nextLesson) && (
        <div className="fixed bottom-4 right-4 z-40 flex gap-2 md:hidden">
          {prevLesson && (
            <Button
              size="sm"
              variant="outline"
              className="bg-card/90 backdrop-blur-sm border-border/50 shadow-lg"
              onClick={() => navigate(prevLesson.path)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          {nextLesson && (
            <Button
              size="sm"
              className="bg-gradient-neon shadow-lg"
              onClick={() => navigate(nextLesson.path)}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonLayout;
