import { Linkedin, GraduationCap, Brain, Database, Code2 } from "lucide-react";
import sergeyAvatar from "@/assets/sergey-ermakov.jpg";

const AboutMeSection = () => {
  return (
    <section id="about" className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-80 h-80 bg-secondary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-primary/8 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-[84rem] relative z-10">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              Об авторе
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Кто стоит за этой платформой
          </p>
        </div>

        <div className="bg-card/60 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 md:p-10 space-y-8 hover:border-primary/40 hover:shadow-glow-cyan transition-all duration-500">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 border-2 border-primary/40 flex items-center justify-center shrink-0">
              <span className="text-3xl font-bold bg-gradient-neon bg-clip-text text-transparent">SE</span>
            </div>
            <div className="text-center sm:text-left space-y-2">
              <h3 className="text-2xl font-bold text-foreground">Сергей Ермаков</h3>
              <p className="text-primary font-medium">
                Associate Professor · M.Sc. Computer Science · Data Scientist
              </p>
            </div>
          </div>

          {/* Bio */}
          <p className="text-muted-foreground leading-relaxed">
            Веду практические занятия по анализу данных, машинному обучению и обучению с подкреплением. 
            Создал эту платформу, чтобы сделать Reinforcement Learning доступным для русскоязычного сообщества — 
            с интерактивными визуализациями, пошаговыми проектами и понятными объяснениями математики.
          </p>

          {/* Expertise cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Brain, label: "Reinforcement Learning", color: "text-primary border-primary/30" },
              { icon: Database, label: "Data Science", color: "text-secondary border-secondary/30" },
              { icon: Code2, label: "PyTorch / Unity", color: "text-accent border-accent/30" },
              { icon: GraduationCap, label: "Преподавание", color: "text-amber-400 border-amber-400/30" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-card/80 border ${item.color} text-center`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs font-medium text-foreground/80">{item.label}</span>
                </div>
              );
            })}
          </div>

          {/* LinkedIn CTA */}
          <div className="flex justify-center">
            <a
              href="https://www.linkedin.com/in/sergey-ermakov-7a146999/?originalSubdomain=ru"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-[#0A66C2] hover:bg-[#0A66C2]/20 hover:border-[#0A66C2]/50 hover:shadow-[0_0_20px_rgba(10,102,194,0.15)] transition-all duration-300 font-medium"
            >
              <Linkedin className="w-5 h-5" />
              Посмотреть профиль в LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;
