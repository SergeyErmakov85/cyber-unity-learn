import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import heroBg from "@/assets/hero-bg.jpg";
import gamepadImg from "@/assets/gamepad-hero.png";
import { BookOpen, HelpCircle, Map, Microscope, Network, Newspaper, UserCircle2, type LucideIcon } from "lucide-react";
import NeuralNetworkViz from "./NeuralNetworkViz";

type HeroCta = {
  label: string;
  icon: LucideIcon;
  /** Куда вести. Не задаётся для кнопок, которые скроллят по якорю. */
  to?: string;
  /** Плавный скролл к секции с этим id вместо навигации. */
  scrollTo?: string;
  /** Требует авторизации: гостя уводим на /login?next=... */
  authGate?: boolean;
  /** Пульсирующая точка «новое» в правом верхнем углу. */
  badge?: boolean;
  iconClass: string;
  className: string;
};

/**
 * Одинаковая ширина у всех кнопок + justify-center у контейнера дают
 * симметричную сетку: 3 + 2 по центру на десктопе, 2 + 2 + 1 на планшете.
 * Толщина рамки и насыщенность шрифта задаются в className каждой кнопки,
 * чтобы акцентный «Блог» мог их переопределить.
 */
const CTA_BASE_CLASS =
  "w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] relative flex items-center justify-center gap-2 " +
  "h-12 px-4 rounded-full bg-card/60 backdrop-blur-sm text-foreground whitespace-nowrap text-sm md:text-base " +
  "transition-all duration-300 cursor-pointer hover:scale-105 group";

const HERO_CTAS: HeroCta[] = [
  {
    label: "Карта обучения",
    icon: Map,
    scrollTo: "learning-path",
    iconClass: "text-green-400",
    className:
      "border border-green-400/30 font-medium hover:bg-green-400/10 " +
      "shadow-[0_0_20px_hsl(142_90%_55%_/_0.35),0_0_40px_hsl(142_90%_55%_/_0.2)]",
  },
  {
    label: "Карта знаний",
    icon: Network,
    to: "/knowledge-map",
    iconClass: "text-yellow-400",
    className:
      "border border-yellow-400/30 font-medium hover:bg-yellow-400/10 " +
      "shadow-[0_0_20px_hsl(45_100%_50%_/_0.35),0_0_40px_hsl(45_100%_50%_/_0.2)]",
  },
  {
    label: "Пройти тест",
    icon: HelpCircle,
    to: "/onboarding",
    iconClass: "text-blue-400",
    className:
      "border border-blue-500/30 font-medium hover:bg-blue-500/10 " +
      "shadow-[0_0_20px_hsl(220_100%_55%_/_0.35),0_0_40px_hsl(220_100%_55%_/_0.2)]",
  },
  {
    label: "Войти в личный кабинет",
    icon: UserCircle2,
    to: "/dashboard",
    authGate: true,
    iconClass: "text-secondary",
    className: "border border-secondary/30 font-medium hover:bg-secondary/10 shadow-glow-purple",
  },
  {
    label: "Блог",
    icon: Newspaper,
    to: "/blog",
    badge: true,
    iconClass: "text-accent",
    className:
      "border-2 border-accent/40 font-semibold hover:bg-accent/15 " +
      "shadow-[0_0_20px_hsl(var(--accent)/0.35),0_0_40px_hsl(var(--accent)/0.2)]",
  },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCta = (cta: HeroCta) => {
    if (cta.scrollTo) {
      document.querySelector(`#${cta.scrollTo}`)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (!cta.to) return;
    navigate(cta.authGate && !user ? `/login?next=${cta.to}` : cta.to);
  };

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
              игровых агентов <img src={gamepadImg} alt="" aria-hidden="true" className="inline-block h-12 md:h-16 lg:h-20 w-auto align-middle -mt-2 drop-shadow-[0_0_15px_hsl(var(--secondary)/0.6)]" /><span className="sr-only">игровой контроллер</span>
            </span>
          </h1>


          {/* Subheading */}
          <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto leading-relaxed font-heading tracking-wide drop-shadow-[0_0_12px_hsl(var(--foreground)/0.35)]">
            Практические проекты на <span className="text-primary font-semibold">PyTorch</span> с интеграцией{" "}
            <span className="text-secondary font-semibold">Unity ML-Agents</span>. Воспроизводимые эксперименты,
            реальные игровые среды и пошаговые руководства от основ до продвинутых техник.
          </p>

          {/* CTA Buttons — hub style, симметричная сетка */}
          <div className="flex flex-wrap justify-center gap-4 pt-8 max-w-4xl mx-auto">
            {HERO_CTAS.map((cta) => {
              const Icon = cta.icon;
              return (
                <button
                  key={cta.label}
                  onClick={() => handleCta(cta)}
                  className={`${CTA_BASE_CLASS} ${cta.className}`}
                >
                  {cta.badge && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
                    </span>
                  )}
                  <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${cta.iconClass}`} />
                  {cta.label}
                </button>
              );
            })}
          </div>

          {/* Neural Network Visualization */}
          <div className="pt-12">
            <NeuralNetworkViz />
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 max-w-3xl mx-auto">
            <div className="space-y-2 p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50">
              <div className="text-2xl md:text-3xl font-bold text-secondary">12</div>
              <div className="text-xs md:text-sm text-muted-foreground">Практических проектов в игровых средах Unity</div>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50">
              <div className="text-2xl md:text-3xl font-bold text-green-400">100%</div>
              <div className="text-xs md:text-sm text-muted-foreground">Воспроизводимый код</div>
            </div>
            <div className="space-y-2 p-4 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50">
              <div className="text-2xl md:text-3xl font-bold text-blue-400">24/7</div>
              <div className="text-xs md:text-sm text-muted-foreground">Доступ к материалам</div>
            </div>
          </div>

          {/* Tech Pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-6">
            {[
              { label: "PyTorch", path: "/hub/pytorch", cls: "border-primary/40 text-primary hover:text-primary hover:border-primary/70 hover:shadow-glow-cyan" },
              { label: "Unity ML-Agents", path: "/hub/unity-ml-agents", cls: "border-secondary/40 text-secondary hover:text-secondary hover:border-secondary/70 hover:shadow-glow-purple" },
              { label: "ONNX", path: "/advanced/onnx-sentis", cls: "border-accent/40 text-accent hover:text-accent hover:border-accent/70 hover:shadow-glow-pink" },
              { label: "Sentis", path: "/advanced/onnx-sentis", cls: "border-accent/40 text-accent hover:text-accent hover:border-accent/70 hover:shadow-glow-pink" },
              { label: "Jupyter", path: "/code-examples", cls: "border-green-400/40 text-green-300 hover:text-green-200 hover:border-green-400/70 hover:shadow-[0_0_16px_hsl(142_71%_45%/0.5)]" },
            ].map(({ label, path, cls }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`bg-card/50 border text-xs px-3 py-1 rounded-full transition-all cursor-pointer ${cls}`}
              >
                {label}
              </button>
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