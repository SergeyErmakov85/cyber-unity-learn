import { useNavigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, FlaskConical, LineChart, Microscope } from "lucide-react";
import LabPracticeSection from "@/components/LabPracticeSection";

interface ResearchEntry {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  ready: boolean;
}

const researchItems: ResearchEntry[] = [
  {
    id: "labs",
    title: "Лаборатории",
    description:
      "Интерактивные лабораторные работы: дисконтирование, exploration vs exploitation, replay buffer, epsilon-greedy и другие ключевые механики RL.",
    icon: FlaskConical,
    link: "/labs",
    ready: true,
  },
  {
    id: "visualizations",
    title: "Визуализации",
    description:
      "Наглядные интерактивные визуализации алгоритмов RL: Q-Learning, политики, функции ценности, траектории агентов.",
    icon: LineChart,
    link: "/visualizations",
    ready: true,
  },
];

const ResearchIndex = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Исследования RL | Neon Unity Neural"
        description="Лаборатории и визуализации для изучения обучения с подкреплением: интерактивные эксперименты и наглядные представления алгоритмов."
      />
      <Navbar />

      <div className="pt-20 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> На главную
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center border border-yellow-400/30 shadow-glow-yellow">
              <Microscope className="w-6 h-6 text-yellow-400" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">
                Исследования RL
              </span>
            </h1>
          </div>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Интерактивные инструменты для глубокого исследования механик
            обучения с подкреплением — экспериментируйте, наблюдайте, понимайте.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {researchItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.id}
                className={`bg-card/60 backdrop-blur-sm border-yellow-400/30 transition-all duration-300 ${
                  item.ready
                    ? "hover:border-yellow-400/60 hover:shadow-glow-yellow group"
                    : "opacity-60"
                }`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center group-hover:bg-yellow-400/20 transition-colors">
                      <Icon className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>

                  <Button
                    variant="outline"
                    className="w-full border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300"
                    onClick={() => navigate(item.link)}
                    disabled={!item.ready}
                  >
                    {item.ready ? "Открыть" : "Скоро"}{" "}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Практика: собранная среда лаборатории для этой темы. */}
      <LabPracticeSection contextKey="/hub/research" />

      <FooterSection />
    </div>
  );
};

export default ResearchIndex;
