import { useState, useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  ArrowLeft,
  Lock,
  ChevronDown,
  BookOpen,
  FolderKanban,
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getLevelCompletionPercent, getProgress } from "@/lib/gamification";

const levels = [
  {
    title: "Новичок",
    tag: "FREE",
    tagColor: "bg-green-500/20 text-green-400 border-green-500/30",
    accentColor: "green",
    weeks: 6,
    lessonsCount: 7,
    projectsCount: 1,
    status: "in_progress" as const,
    locked: false,
    lessons: [
      { title: "Что такое обучение с подкреплением?", type: "lesson", path: "/courses/1-1" },
      { title: "Установка окружения: PyTorch + Unity ML-Agents", type: "lesson", path: "/courses/1-2" },
      { title: "Q-Learning: табличный метод", type: "lesson", path: "/courses/1-3" },
      { title: "CartPole — твой первый RL-агент", type: "lesson", path: "/courses/1-4" },
      { title: "DQN с нуля на PyTorch", type: "lesson", path: "/courses/1-5" },
      { title: "Марковские процессы принятия решений (MDP)", type: "lesson", path: "/courses/1-6" },
      { title: "Exploration vs Exploitation", type: "lesson", path: "/courses/1-7" },
      { title: 'Проект-1: "Баланс в 3D"', type: "project", path: "/courses/project-1" },
    ],
  },
  {
    title: "Средний",
    tag: "PRO",
    tagColor: "bg-secondary/20 text-secondary border-secondary/30",
    accentColor: "purple",
    weeks: 6,
    lessonsCount: 6,
    projectsCount: 2,
    status: "locked" as const,
    locked: true,
    lessons: [
      { title: "Policy Gradient и теорема градиента", type: "lesson", path: "/courses/2-1" },
      { title: "PPO — реализация с нуля", type: "lesson", path: "/courses/2-2" },
      { title: "Непрерывные действия и Actor-Critic", type: "lesson", path: "/courses/2-3" },
      { title: "Reward Shaping", type: "lesson", path: "/courses/2-4" },
      { title: "Параллельные среды", type: "lesson", path: "/courses/2-5" },
      { title: "TensorBoard и W&B", type: "lesson", path: "/courses/2-6" },
      { title: "Проект: 3D-охотник", type: "project", path: "/courses/project-2" },
      { title: "Проект: Гоночный агент", type: "project", path: "/courses/project-3" },
    ],
  },
  {
    title: "Продвинутый",
    tag: "PRO",
    tagColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    accentColor: "orange",
    weeks: 8,
    lessonsCount: 7,
    projectsCount: 1,
    status: "locked" as const,
    locked: true,
    lessons: [
      { title: "SAC — Soft Actor-Critic", type: "lesson", path: "/courses/3-1" },
      { title: "MA-POCA и Self-Play", type: "lesson", path: "/courses/3-2" },
      { title: "Curriculum Learning", type: "lesson", path: "/courses/3-3" },
      { title: "Имитационное обучение (GAIL)", type: "lesson", path: "/courses/3-4" },
      { title: "Деплой модели: ONNX", type: "lesson", path: "/courses/3-5" },
      { title: "Оптимизация гиперпараметров", type: "lesson", path: "/courses/3-6" },
      { title: "Архитектуры нейросетей", type: "lesson", path: "/courses/3-7" },
      { title: "Финальный проект: Игра с NPC", type: "project", path: "/courses/final-project" },
    ],
  },
];

const accentStyles: Record<string, { border: string; glow: string; line: string; dot: string; icon: string }> = {
  green: {
    border: "border-green-500/40 hover:border-green-500/70",
    glow: "hover:shadow-[0_0_25px_hsl(140_70%_45%/0.3)]",
    line: "bg-green-500",
    dot: "bg-green-500",
    icon: "text-green-400",
  },
  purple: {
    border: "border-secondary/40 hover:border-secondary/70",
    glow: "hover:shadow-glow-purple",
    line: "bg-secondary",
    dot: "bg-secondary",
    icon: "text-secondary",
  },
  orange: {
    border: "border-orange-500/40 hover:border-orange-500/70",
    glow: "hover:shadow-[0_0_25px_hsl(25_90%_50%/0.3)]",
    line: "bg-orange-500",
    dot: "bg-orange-500",
    icon: "text-orange-400",
  },
};

const statusLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  locked: { label: "Заблокирован", icon: <Lock className="w-4 h-4" /> },
  in_progress: { label: "В процессе", icon: <PlayCircle className="w-4 h-4" /> },
  completed: { label: "Завершён", icon: <CheckCircle2 className="w-4 h-4" /> },
};

const Courses = () => {
  const { isAdmin } = useUserRole();
  const [openLevel, setOpenLevel] = useState<number | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("progress-updated", handler);
    return () => window.removeEventListener("progress-updated", handler);
  }, []);

  const userProgress = getProgress();
  const totalItems = 20 + 4; // 20 уроков + 4 проекта
  const completedTotal =
    userProgress.completedLessons.length + userProgress.completedProjects.length;
  const progress = Math.min(100, Math.round((completedTotal / totalItems) * 100));

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Курсы по RL: от новичка до продвинутого | Unity ML-Agents"
        description="Структурированные курсы по Reinforcement Learning: 3 уровня, 18+ уроков, практические проекты на PyTorch и Unity ML-Agents."
        path="/courses"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "Reinforcement Learning: полный курс",
          "description": "От основ до мультиагентных систем в Unity ML-Agents",
          "provider": { "@type": "Organization", "name": "RL Platform" },
          "hasCourseInstance": { "@type": "CourseInstance", "courseMode": "online" }
        }}
      />
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              На главную
            </Link>
            <Link
              to="/algorithms"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Карта алгоритмов
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Title */}
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">Карта обучения</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            3 уровня · 20 уроков · 4 проекта · ~20 недель
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Общий прогресс</span>
            <span className="text-primary font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-muted" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-8">
            {levels.map((level, index) => {
              const isLocked = isAdmin ? false : level.locked;
              const styles = accentStyles[level.accentColor];
              const status = isAdmin && level.locked ? statusLabels["in_progress"] : statusLabels[level.status];
              const isOpen = openLevel === index;

              return (
                <div key={index} className="relative pl-16">
                  {/* Timeline dot */}
                  <div
                    className={`absolute left-4 top-6 w-5 h-5 rounded-full border-2 border-background ${styles.dot} z-10`}
                  />

                  {/* Connector to next */}
                  {index < levels.length - 1 && (
                    <div
                      className={`absolute left-[1.45rem] top-10 w-0.5 h-[calc(100%+2rem)] ${
                        (level.status as string) === "completed" ? styles.line : "bg-border"
                      }`}
                    />
                  )}

                  <Collapsible open={isOpen} onOpenChange={() => setOpenLevel(isOpen ? null : index)}>
                    <CollapsibleTrigger asChild>
                      <Card
                        className={`bg-card/60 backdrop-blur-sm ${styles.border} ${styles.glow} transition-all duration-300 cursor-pointer`}
                      >
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xl font-bold text-foreground">
                                  Уровень {index + 1} — {level.title}
                                </h3>
                                <span
                                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${level.tagColor}`}
                                >
                                  {level.tag}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-1">
                                  <BookOpen className="w-3.5 h-3.5" />
                                  {level.lessonsCount} уроков
                                </span>
                                <span className="flex items-center gap-1">
                                  <FolderKanban className="w-3.5 h-3.5" />
                                  {level.projectsCount} проект{level.projectsCount > 1 ? "а" : ""}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />~{level.weeks} недель
                                </span>
                              </div>

                              {/* Level progress bar */}
                              <div className="space-y-1">
                                <Progress value={getLevelCompletionPercent(index)} className="h-1.5 bg-muted" />
                                <p className="text-xs text-muted-foreground">{getLevelCompletionPercent(index)}% завершено</p>
                              </div>

                              <div className={`flex items-center gap-1.5 text-xs font-medium ${styles.icon}`}>
                                {status.icon}
                                {status.label}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              {isLocked && <Lock className="w-5 h-5 text-muted-foreground/50" />}
                              <ChevronDown
                                className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="mt-2 ml-2 border-l-2 border-border pl-4 space-y-1.5 py-2">
                        {level.lessons.map((lesson, li) => {
                          const hasLink = !isLocked && lesson.path;
                          const inner = (
                            <div
                              className={`flex items-center gap-3 py-1.5 px-3 rounded-md text-sm transition-colors ${
                                isLocked
                                  ? "text-muted-foreground/50"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30 cursor-pointer"
                              }`}
                            >
                              {isLocked ? (
                                <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                              ) : (
                                <Circle className="w-3.5 h-3.5 flex-shrink-0" />
                              )}
                              <span>{lesson.title}</span>
                              {lesson.type === "project" && (
                                <span className={`text-xs px-1.5 py-0.5 rounded border ${level.tagColor} ml-auto`}>
                                  Проект
                                </span>
                              )}
                            </div>
                          );
                          return hasLink ? (
                            <Link key={li} to={lesson.path!}>{inner}</Link>
                          ) : (
                            <div key={li}>{inner}</div>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button variant="cyber" size="lg" asChild>
            <Link to="/courses/1-1">Начать обучение</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Courses;
