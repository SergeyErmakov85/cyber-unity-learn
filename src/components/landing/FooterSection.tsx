import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

const footerLinks = {
  platform: {
    title: "Платформа",
    links: [
      { label: "Курсы", href: "/courses" },
      { label: "Примеры кода", href: "/code-examples" },
      { label: "Исследования RL", href: "/hub/research" },
      { label: "Проекты", href: "/unity-projects" },
    ],
  },
  algorithms: {
    title: "Алгоритмы",
    links: [
      { label: "DQN", href: "/algorithms/dqn" },
      { label: "PPO", href: "/algorithms/ppo" },
      { label: "SAC", href: "/algorithms/sac" },
      { label: "A3C", href: "/algorithms/a3c" },
    ],
  },
  resources: {
    title: "Ресурсы",
    links: [
      { label: "Блог", href: "/blog" },
      { label: "Математика RL", href: "/math-rl" },
      { label: "FAQ", href: "/faq" },
      { label: "PyTorch", href: "/hub/pytorch" },
    ],
  },
  account: {
    title: "Аккаунт",
    links: [
      { label: "Тарифы", href: "/pricing" },
      { label: "Сообщество", href: "/community" },
      { label: "Войти", href: "/login" },
      { label: "Регистрация", href: "/register" },
    ],
  },
};

// Соцсети появятся здесь, когда будут заведены реальные аккаунты. Ссылки на
// голые домены (github.com, twitter.com) выглядят рабочими, но никуда не ведут,
// поэтому в проде их не показываем.
const socialLinks = [
  { icon: Mail, href: "mailto:support@rlplatform.ru", label: "Email" },
];

const FooterSection = () => {
  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
              <span className="text-lg font-bold bg-gradient-neon bg-clip-text text-transparent">
                RL Platform
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Практическая платформа для изучения Reinforcement Learning. 
              PyTorch + Unity ML-Agents.
            </p>
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:shadow-glow-cyan transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {Object.values(footerLinks).map((group) => (
            <div key={group.title} className="space-y-4">
              <h4 className="font-semibold text-foreground text-sm">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div className="py-6 border-t border-border/50 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-muted-foreground">
          <span>📧 Поддержка:</span>
          <a href="mailto:support@rlplatform.ru" className="hover:text-primary transition-colors duration-200">
            support@rlplatform.ru
          </a>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-muted-foreground">
              © 2026 RL Platform. Все материалы на русском языке.
            </div>
            <span className="text-xs px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-muted-foreground">
              Unity ML-Agents + PyTorch + Deep RL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
