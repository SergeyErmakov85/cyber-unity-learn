import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, LinkIcon, DollarSign, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const AffiliateSection = () => {
  // Реферальная программа ещё не подключена к биллингу, поэтому ссылку выдать
  // нечем. Сообщаем об этом честно, а не имитируем успешное копирование.
  const handleGetLink = () => {
    toast("Реферальная программа скоро запустится", {
      description: "Мы пришлём вашу персональную ссылку на почту, как только она заработает.",
    });
  };

  return (
    <div className="mt-16 p-8 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-secondary/5 relative overflow-hidden">
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Приведи друга — получи 30%</h3>
            <p className="text-sm text-muted-foreground">от его подписки за каждый месяц</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: LinkIcon, title: "Получите ссылку", desc: "Уникальная реферальная ссылка для отслеживания" },
            { icon: BarChart3, title: "Делитесь", desc: "Отправьте друзьям, коллегам, в соцсети" },
            { icon: DollarSign, title: "Получайте 30%", desc: "Ежемесячные выплаты на карту или счёт" },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="p-4 rounded-lg bg-card/50 border border-border/50 space-y-2">
                <Icon className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-sm text-foreground">{step.title}</h4>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            );
          })}
        </div>

        <Button onClick={handleGetLink} className="bg-gradient-neon gap-2">
          <LinkIcon className="w-4 h-4" />
          Узнать о запуске программы
        </Button>
      </div>
    </div>
  );
};

export default AffiliateSection;
