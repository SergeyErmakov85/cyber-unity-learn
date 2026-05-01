import { Button } from "@/components/ui/button";
import { Rocket, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FinalCTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 via-secondary/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Animated Grid */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,#00f0ff10_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff10_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-gradient-cyber border border-primary/30 shadow-glow-cyan animate-glow-pulse">
              <Rocket className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            <span className="text-foreground">Начните своё путешествие </span>
            <br />
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              в мир RL сегодня
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Присоединяйтесь к сообществу разработчиков, которые создают умных игровых агентов 
            с помощью PyTorch и Unity ML-Agents
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" variant="cyber" className="text-lg px-10 group" onClick={() => navigate("/beginner-course")}>
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-glow-pulse" />
              Начать первый урок
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Узнать больше
            </Button>
          </div>

          {/* Trust note */}
          <p className="text-sm text-muted-foreground/60 pt-4">
            ✓ Мгновенный доступ · ✓ Обновления навсегда · ✓ Поддержка сообщества
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
