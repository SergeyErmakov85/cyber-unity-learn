import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Circle, Lock, Info } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { LEARNING_MAP } from "@/content/learningMap";
import { SUPPORT_HUBS, type HubId } from "@/content/hubs";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { useUserRole } from "@/hooks/useUserRole";


const stageColors = [
  {
    border: "border-primary/30 hover:border-primary/60",
    shadow: "hover:shadow-glow-cyan",
    text: "text-primary",
    bg: "bg-primary",
    bgLight: "bg-primary/10",
  },
  {
    border: "border-secondary/30 hover:border-secondary/60",
    shadow: "hover:shadow-glow-purple",
    text: "text-secondary",
    bg: "bg-secondary",
    bgLight: "bg-secondary/10",
  },
  {
    border: "border-accent/30 hover:border-accent/60",
    shadow: "hover:shadow-glow-pink",
    text: "text-accent",
    bg: "bg-accent",
    bgLight: "bg-accent/10",
  },
];

const LearningPathSection = () => {
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();
  const { getStatus } = useLearningProgress(isAdmin);

  return (
    <section id="learning-path" className="py-20 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">
            <Link to="/courses" className="bg-gradient-neon bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              Карта обучения
            </Link>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Структурированный путь от новичка до эксперта в RL
          </p>
        </div>

        {/* Learning Path Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Connection Line - Desktop */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {LEARNING_MAP.map((stage, index) => {
                const colors = stageColors[index] ?? stageColors[0];

                return (
                  <div key={stage.id} className="relative">
                    {/* Timeline Node - Desktop */}
                    <div className="hidden lg:flex justify-center mb-8">
                      <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center z-10 relative`}>
                        <span className="text-lg font-bold text-background">{index + 1}</span>
                      </div>
                    </div>

                    {/* Mobile Step Indicator */}
                    <div className="lg:hidden flex items-center gap-4 mb-4">
                      <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center`}>
                        <span className="text-sm font-bold text-background">{index + 1}</span>
                      </div>
                      {index < LEARNING_MAP.length - 1 && (
                        <ArrowRight className={`w-5 h-5 ${colors.text}`} />
                      )}
                    </div>

                    <Card
                      className={`bg-card/60 backdrop-blur-sm ${colors.border} ${colors.shadow} transition-all duration-300 h-full flex flex-col cursor-pointer`}
                      onClick={() => navigate("/courses")}
                    >
                      <CardContent className="p-6 space-y-4 flex flex-col flex-1 min-h-0">
                        <div>
                          <div className={`text-sm ${colors.text} font-medium mb-1`}>
                            Этап {index + 1}
                          </div>
                          <h3 className="text-xl font-bold text-foreground">{stage.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{stage.description}</p>
                        </div>

                        <div className="space-y-1 pt-2 flex-1 min-h-0 overflow-y-auto">
                          {stage.lessons.map((lesson) => {
                            const status = getStatus(lesson.slug);
                            const hubIds = [...new Set(lesson.contextLinks.map((cl) => cl.hubId))];
                            const isLocked = status === "locked";
                            const isCompleted = status === "completed";
                            const isCurrent = status === "current";

                            return (
                              <button
                                key={lesson.id}
                                onClick={(e) => { e.stopPropagation(); if (!isLocked) navigate(lesson.path); }}
                                disabled={isLocked}
                                className={`w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors group ${
                                  isCompleted
                                    ? "text-foreground/80"
                                    : isCurrent
                                      ? "text-foreground bg-primary/5 border border-primary/30"
                                      : "text-foreground/70"
                                } ${!isLocked ? "hover:bg-primary/5 cursor-pointer" : "cursor-default"}`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                  ) : isCurrent ? (
                                    <Circle className={`w-4 h-4 ${colors.text} shrink-0`} />
                                  ) : (
                                    <Lock className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                                  )}
                                  <span className="truncate">{lesson.title}</span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {hubIds.slice(0, 3).map((hId) => {
                                    const hub = SUPPORT_HUBS[hId];
                                    const colorMap: Record<string, string> = {
                                      "text-primary": "hsl(var(--primary))",
                                      "text-secondary": "hsl(var(--secondary))",
                                      "text-accent": "hsl(var(--accent))",
                                      "text-yellow-400": "hsl(48, 96%, 53%)",
                                      "text-green-400": "hsl(142, 71%, 45%)",
                                    };
                                    return (
                                      <span
                                        key={hId}
                                         className="inline-block w-4 h-4 rounded-full"
                                        style={{ backgroundColor: colorMap[hub.colorAccent] ?? "hsl(var(--primary))" }}
                                        title={hub.label}
                                      />
                                    );
                                  })}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-28 flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground relative z-20">
            <span className="flex items-center gap-1.5"><Info className="w-4 h-4" /> Цветные точки — хабы поддержки:</span>
            {(Object.keys(SUPPORT_HUBS) as HubId[]).map((hId) => {
              const hub = SUPPORT_HUBS[hId];
              const colorMap: Record<string, string> = {
                "text-primary": "hsl(var(--primary))",
                "text-secondary": "hsl(var(--secondary))",
                "text-accent": "hsl(var(--accent))",
                "text-yellow-400": "hsl(48, 96%, 53%)",
                                      "text-green-400": "hsl(142, 71%, 45%)",
              };
              return (
                <span key={hId} className="flex items-center gap-1.5">
                  <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: colorMap[hub.colorAccent] ?? "hsl(var(--primary))" }} />
                  {hub.label}
                </span>
              );
            })}
          </div>
        </div>


      </div>
    </section>
  );
};

export default LearningPathSection;
