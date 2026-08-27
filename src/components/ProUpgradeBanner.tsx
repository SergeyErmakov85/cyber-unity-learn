import { Link } from "react-router-dom";
import { Crown, Zap, BookOpen, Code2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MONETIZATION_ENABLED } from "@/config/monetization";

const ProUpgradeBanner = () =>
  !MONETIZATION_ENABLED ? null : (
  <div className="mt-10 p-6 md:p-8 rounded-xl border border-secondary/30 bg-gradient-to-br from-secondary/10 via-card to-primary/5 relative overflow-hidden">
    {/* Glow */}
    <div className="absolute -top-20 -right-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />

    <div className="relative z-10 space-y-4">
      <div className="flex items-center gap-2">
        <Crown className="w-6 h-6 text-secondary" />
        <h3 className="text-xl font-bold text-foreground">Вам понравились основы?</h3>
      </div>

      <p className="text-muted-foreground">
        Уровень 2 ждёт вас! Перейдите на PRO и получите доступ ко всему контенту.
      </p>

      <ul className="space-y-2">
        {[
          { icon: BookOpen, text: "13 продвинутых уроков по Deep RL и Multi-Agent" },
          { icon: Code2, text: "Полная библиотека примеров кода с комментариями" },
          { icon: Zap, text: "Реальные проекты: 3D-охотник, гоночный агент, футбол" },
          { icon: Trophy, text: "Сертификат о прохождении курса" },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className="w-4 h-4 text-secondary shrink-0" />
              {item.text}
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button asChild className="bg-gradient-neon gap-2">
          <Link to="/pricing">
            <Crown className="w-4 h-4" />
            Перейти на PRO
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/courses">Посмотреть программу</Link>
        </Button>
      </div>
      </div>
    </div>
  );

export default ProUpgradeBanner;
