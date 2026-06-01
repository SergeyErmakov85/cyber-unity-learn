import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import gamepadImg from "@/assets/gamepad-hero.png";
import { Microscope } from "lucide-react";
import NeuralNetworkViz from "./NeuralNetworkViz";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="AI Gaming Environment"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover opacity-30" />

        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(to_right,#00f0ff15_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff15_1px,transparent_1px)] bg-[size:4rem_4rem] my-[36px]" />
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-glow-pulse opacity-60" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-secondary rounded-full animate-glow-pulse animation-delay-300 opacity-50" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-accent rounded-full animate-glow-pulse animation-delay-600 opacity-70" />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-primary rounded-full animate-glow-pulse opacity-40" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 pt-32 pb-20">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-slide-up">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-relaxed">
            <span className="text-foreground">Освойте</span>
            <br />
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              Reinforcement Learning
            </span>
            <br />
            <span className="text-foreground">через тренировку</span>
            <br />
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              игровых агентов <img src={gamepadImg} alt="Gamepad" className="inline-block h-12 md:h-16 lg:h-20 w-auto align-middle -mt-2 drop-shadow-[0_0_15px_hsl(var(--secondary)/0.6)]" />
            </span>
          </h1>


          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Практические проекты на <span className="text-primary font-semibold">PyTorch</span> с интеграцией{" "}
            <span className="text-secondary font-semibold">Unity ML-Agents</span>. Воспроизводимые эксперименты,
            реальные игровые среды и пошаговые руководства от основ до продвинутых техник.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" variant="cyber" className="text-lg px-8 group" onClick={() => {
              const el = document.querySelector('#learning-path');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>
              Карта обучения
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate("/onboarding")}>
              Пройти тест
            </Button>
          </div>

          {/* Neural Network Visualization */}
          <div className="pt-12">
            <NeuralNetworkViz />
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 max-w-3xl mx-auto">
            <div className="space-y-2 p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50">
              <div className="text-2xl md:text-3xl font-bold text-primary">25+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Практических проектов</div>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50">
              <div className="text-2xl md:text-3xl font-bold text-secondary">100%</div>
              <div className="text-xs md:text-sm text-muted-foreground">Воспроизводимый код</div>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50">
              <div className="text-2xl md:text-3xl font-bold text-accent">7+</div>
              <div className="text-xs md:text-sm text-muted-foreground">Игровых сред Unity</div>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50">
              <div className="text-2xl md:text-3xl font-bold text-primary">24/7</div>
              <div className="text-xs md:text-sm text-muted-foreground">Доступ к материалам</div>
            </div>
          </div>

          {/* Tech Pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-6">
            {["PyTorch", "Unity ML-Agents", "ONNX", "Sentis", "Jupyter"].map((tech) => (
              <span
                key={tech}
                className="bg-card/50 border border-primary/20 text-xs px-3 py-1 rounded-full text-muted-foreground"
              >
                {tech}
              </span>
            ))}
            <button
              onClick={() => navigate("/hub/research")}
              className="bg-card/50 border border-yellow-400/40 text-xs px-3 py-1 rounded-full text-yellow-300 hover:text-yellow-200 hover:border-yellow-400/70 hover:shadow-glow-yellow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Microscope className="w-3 h-3" />
              Исследования RL
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0" />
    </section>);

};

export default HeroSection;