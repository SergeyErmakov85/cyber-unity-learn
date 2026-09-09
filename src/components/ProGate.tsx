import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, Unlock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { isOpenAccessActive, openAccessHoursLeft } from "@/config/openAccess";
import { MONETIZATION_ENABLED } from "@/config/monetization";

interface ProGateProps {
  /** Content visible to everyone (preview) */
  preview: ReactNode;
  /** Full content visible only to PRO users */
  children: ReactNode;
}

/**
 * PRO paywall gate. Shows full content for admin/pro users,
 * preview + CTA for everyone else.
 */
const ProGate = ({ preview, children }: ProGateProps) => {
  const { isPro, isAdmin, loading } = useUserRole();

  // Монетизация выключена: контент открыт всем, гейт полностью прозрачен.
  if (!MONETIZATION_ENABLED) {
    return <>{children}</>;
  }

  // Временное окно свободного доступа: весь контент открыт всем без регистрации.
  if (isOpenAccessActive()) {
    return (
      <>
        <Card className="mb-6 border-primary/30 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <Unlock className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm text-muted-foreground">
              <span className="text-primary font-semibold">Открытый доступ.</span>{" "}
              Весь контент, включая PRO-уроки, свободен ещё{" "}
              <span className="text-accent font-semibold">{openAccessHoursLeft()} ч</span> — регистрация не требуется.
            </p>
          </CardContent>
        </Card>
        {children}
      </>
    );
  }

  if (loading) {
    return <>{preview}</>;
  }

  if (isPro || isAdmin) {
    return <>{children}</>;
  }


  return (
    <>
      {preview}

      {/* Fade overlay + CTA */}
      <div className="relative mt-6">
        <div className="absolute -top-24 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
        <Card className="relative z-20 border-secondary/40 bg-gradient-to-br from-secondary/5 via-card/80 to-primary/5">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">PRO-контент</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Этот урок доступен подписчикам PRO. Получите доступ ко всем уровням обучения,
              полной библиотеке кода, проектам и сертификату.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button variant="cyber" size="lg" asChild>
                <Link to="/pricing" className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Получить PRO-доступ
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/courses">Вернуться к курсам</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProGate;
