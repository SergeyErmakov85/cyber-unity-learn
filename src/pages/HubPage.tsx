import { useMemo, lazy, Suspense } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SUPPORT_HUBS, type HubId } from "@/content/hubs";
import { LEARNING_MAP, type Stage, type Lesson } from "@/content/learningMap";
import { CROSSLINKS } from "@/config/crosslinks";
import { hubPathToSupportHubId } from "@/lib/hubPathToSupportHubId";
import { Button } from "@/components/ui/button";
import { PageSkeleton } from "@/components/SkeletonCard";
import { ArrowLeft, ArrowRight, BookOpen, SearchX } from "lucide-react";
import Navbar from "@/components/landing/Navbar";

// Lazy-load original page content for each hub
const HUB_CONTENT: Record<HubId, React.LazyExoticComponent<React.ComponentType>> = {
  pytorch: lazy(() => import("@/pages/PyTorchModule")),
  "unity-ml-agents": lazy(() => import("@/pages/UnityMLAgentsModule")),
  "deep-rl": lazy(() => import("@/pages/DeepRLModule")),
  project: lazy(() => import("@/pages/UnityProjectsHub")),
  "math-rl": lazy(() => import("@/pages/MathRL")),
  "fca-rl": lazy(() => import("@/pages/FcaRlModule")),
};

interface BackLink {
  stage: Stage;
  lesson: Lesson;
}

function findLessonsForHub(hubId: HubId): BackLink[] {
  const seen = new Set<string>();
  const results: BackLink[] = [];

  const push = (stage: Stage, lesson: Lesson) => {
    if (seen.has(lesson.id)) return;
    seen.add(lesson.id);
    results.push({ stage, lesson });
  };

  for (const stage of LEARNING_MAP) {
    for (const lesson of stage.lessons) {
      if (lesson.contextLinks.some((cl) => cl.hubId === hubId)) {
        push(stage, lesson);
      }
    }
  }

  for (const link of CROSSLINKS) {
    if (hubPathToSupportHubId(link.hubPath) !== hubId) continue;
    const stage = LEARNING_MAP.find((s) => s.lessons.some((l) => l.path === link.lessonPath));
    const lesson = stage?.lessons.find((l) => l.path === link.lessonPath);
    if (stage && lesson) push(stage, lesson);
  }

  return results;
}

const HubPage = () => {
  const { hubId } = useParams<{ hubId: string }>();
  const navigate = useNavigate();

  const hub = hubId ? SUPPORT_HUBS[hubId as HubId] : undefined;

  const backLinks = useMemo(() => {
    if (!hub) return [];
    return findLessonsForHub(hub.id);
  }, [hub]);

  const groupedByStage = useMemo(() => {
    const map = new Map<string, { stage: Stage; lessons: Lesson[] }>();
    for (const bl of backLinks) {
      if (!map.has(bl.stage.id)) map.set(bl.stage.id, { stage: bl.stage, lessons: [] });
      map.get(bl.stage.id)!.lessons.push(bl.lesson);
    }
    return Array.from(map.values());
  }, [backLinks]);

  if (!hub) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[80vh] pt-20 px-4">
          <div className="text-center space-y-6 max-w-md">
            <SearchX className="w-16 h-16 text-primary mx-auto opacity-60" />
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <p className="text-xl font-semibold text-foreground">Хаб не найден</p>
            <p className="text-muted-foreground">
              Хаб <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-sm">{hubId}</code> не существует.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate("/")} className="bg-gradient-neon">На главную</Button>
              <Button onClick={() => navigate("/courses")} variant="outline">К курсам</Button>
            </div>
            <div className="pt-4 space-y-2">
              <p className="text-sm text-muted-foreground">Доступные хабы:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {(Object.keys(SUPPORT_HUBS) as HubId[]).map((id) => (
                  <button
                    key={id}
                    onClick={() => navigate(`/hub/${id}`)}
                    className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                  >
                    {SUPPORT_HUBS[id].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ContentComponent = HUB_CONTENT[hub.id];

  return (
    <div className="min-h-screen bg-background">
      {/* Embedded original page content */}
      <Suspense fallback={<PageSkeleton />}>
        <ContentComponent />
      </Suspense>

      {/* Back-links section (appended after content) */}
      {groupedByStage.length > 0 && (
        <div className="border-t border-border/50 bg-card/20">
          <div className="container mx-auto px-4 py-12 max-w-3xl space-y-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Где это пригодится в обучении</h2>
            </div>

            {groupedByStage.map(({ stage, lessons }) => (
              <div key={stage.id} className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {stage.title}
                </h3>
                <div className="space-y-1.5">
                  {lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      to={lesson.path}
                      className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/30 px-4 py-3 text-sm text-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors group"
                    >
                      <span className="flex-1">{lesson.title}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HubPage;
