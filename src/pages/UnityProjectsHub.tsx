import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Gamepad2, CircleDot, Grid3X3, Car, Users, Apple, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HubLessonBadges from "@/components/HubLessonBadges";
import LabPracticeSection from "@/components/LabPracticeSection";

interface Project {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  actions: string;
  algorithm: string;
  observations: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
  ready: boolean;
  flagship?: boolean;
}

const projects: Project[] = [
  {
    id: "taxi-v3",
    name: "Taxi-v3: Q-Learning",
    description: "Классическая среда Gymnasium: табличный Q-Learning, epsilon-greedy и REINFORCE на одном примере.",
    difficulty: "Начальный",
    actions: "Дискретные",
    algorithm: "Q-Learning / REINFORCE",
    observations: "500 дискретных состояний",
    link: "/unity-projects/taxi-v3",
    icon: MapPin,
    ready: true,
  },
  {
    id: "food-collector",
    name: "FoodCollector: REINFORCE",
    description: "Полный пайплайн: кастомный REINFORCE на PyTorch, гибридные действия, GridSensor, экспорт ONNX для Sentis.",
    difficulty: "Продвинутый",
    actions: "Гибридные",
    algorithm: "REINFORCE",
    observations: "GridSensor 4D (CNN)",
    link: "/unity-projects/food-collector",
    icon: Apple,
    ready: true,
    flagship: true,
  },
  {
    id: "ball-balance",
    name: "3D Ball Balance",
    description: "Агент управляет платформой для балансировки шара. Непрерывные действия, PPO алгоритм.",
    difficulty: "Начальный",
    actions: "Непрерывные",
    algorithm: "PPO",
    observations: "Позиция, скорость шара, угол платформы",
    link: "/unity-projects/ball-balance",
    icon: CircleDot,
    ready: true,
  },
  {
    id: "gridworld",
    name: "GridWorld",
    description: "Агент перемещается по сетке, собирает бонусы и избегает ловушек. Дискретные действия.",
    difficulty: "Начальный",
    actions: "Дискретные",
    algorithm: "PPO",
    observations: "Карта 5×5 вокруг агента",
    link: "/unity-projects/gridworld",
    icon: Grid3X3,
    ready: true,
  },
  {
    id: "soccer",
    name: "Soccer (Multi-Agent)",
    description: "Команды агентов играют в футбол. MAPOCA + Self-Play для мультиагентного обучения.",
    difficulty: "Продвинутый",
    actions: "Смешанные",
    algorithm: "MAPOCA",
    observations: "Позиции игроков, мяча, ворот",
    link: "/unity-projects/soccer",
    icon: Users,
    ready: true,
  },
  {
    id: "racing",
    name: "Racing Car",
    description: "Агент управляет автомобилем на треке. Raycast сенсоры для обнаружения стен.",
    difficulty: "Средний",
    actions: "Непрерывные",
    algorithm: "SAC",
    observations: "Raycast сенсоры, скорость",
    link: "/unity-projects/racing",
    icon: Car,
    ready: true,
  },
];

const UnityProjectsHub = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> На главную
          </Button>
          <h1 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">Unity Проекты</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Пошаговые руководства по созданию 3D проектов с интеллектуальными агентами в Unity ML-Agents.
          </p>
          <HubLessonBadges hubPath="/unity-projects" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => {
            const Icon = project.icon;
            return (
              <Card key={project.id} className={`bg-card/60 backdrop-blur-sm border-border/50 transition-all duration-300 ${project.ready ? "hover:border-primary/50 group" : "opacity-60"}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                    <div>
                        <h3 className="text-xl font-bold text-foreground">{project.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          {project.flagship && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">★ Флагманский проект</span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            project.difficulty === "Начальный" ? "bg-green-500/10 text-green-400" :
                            project.difficulty === "Средний" ? "bg-yellow-500/10 text-yellow-400" :
                            "bg-red-500/10 text-red-400"
                          }`}>
                            {project.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{project.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div><span className="text-foreground font-medium">Действия:</span> {project.actions}</div>
                    <div><span className="text-foreground font-medium">Алгоритм:</span> {project.algorithm}</div>
                  </div>

                  <HubLessonBadges hubPath={project.link} />

                  <Button
                    variant="outline"
                    className="w-full border-primary/50 text-primary hover:bg-primary/10"
                    onClick={() => navigate(project.link)}
                    disabled={!project.ready}
                  >
                    {project.ready ? "Открыть проект" : "Скоро"} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Практика: собранная среда лаборатории для этой темы. */}
        <LabPracticeSection contextKey="/unity-projects" />

        <div className="flex justify-center mt-12">
          <Button onClick={() => navigate("/")} variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
            <ArrowLeft className="w-4 h-4 mr-2" /> На главную
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnityProjectsHub;
