import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Sparkles, Crown, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import AffiliateSection from "@/components/AffiliateSection";

const plans = [
  {
    name: "FREE",
    icon: Zap,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Идеально для знакомства с платформой",
    features: [
      "Доступ к Уровню 1 «Новичок» (7 уроков + 1 проект)",
      "2 примера кода из библиотеки",
      "Доступ к FAQ и блогу",
    ],
    cta: "Начать бесплатно",
    ctaVariant: "outline" as const,
    popular: false,
    accent: "primary",
  },
  {
    name: "PRO",
    icon: Crown,
    monthlyPrice: 890,
    yearlyPrice: 712,
    description: "Полный доступ для серьёзного обучения",
    features: [
      "Все уровни обучения (20 уроков + 4 проекта)",
      "Полная библиотека кода с Colab-ссылками",
      "Доступ к Discord-сообществу",
      "Сертификат об окончании",
      "Ежемесячные обновления контента",
    ],
    cta: "Оформить PRO",
    ctaVariant: "cyber" as const,
    popular: true,
    accent: "secondary",
  },
  {
    name: "TEAM",
    icon: Users,
    monthlyPrice: 2290,
    yearlyPrice: 1832,
    description: "Для команд и корпоративного обучения",
    features: [
      "Всё из PRO",
      "Корпоративная лицензия до 20 человек",
      "Приоритетная поддержка",
      "Командные проекты и дашборд прогресса",
    ],
    cta: "Связаться с нами",
    ctaVariant: "outline" as const,
    popular: false,
    accent: "accent",
  },
];

const faqItems = [
  {
    q: "Какие способы оплаты вы принимаете?",
    a: "Мы принимаем банковские карты (Visa, Mastercard, МИР), а также оплату через СБП и электронные кошельки.",
  },
  {
    q: "Могу ли я отменить подписку в любое время?",
    a: "Да, вы можете отменить подписку в любой момент. Доступ сохранится до конца оплаченного периода.",
  },
  {
    q: "Как работает командная лицензия TEAM?",
    a: "После оформления TEAM вы получаете панель администратора, где можете добавлять участников (до 20 человек) и отслеживать их прогресс.",
  },
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Тарифы | RL Platform — курсы по обучению с подкреплением"
        description="Выберите подходящий тариф: бесплатный доступ к основам, PRO для полного курса или Team для команд."
        path="/pricing"
      />
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 md:py-24">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-neon bg-clip-text text-transparent">Тарифы</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Выберите план, который подходит именно вам
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <span className={`text-sm font-medium transition-colors ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
            Месяц
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isYearly ? "bg-primary shadow-glow-cyan" : "bg-muted"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-foreground transition-transform duration-300 ${isYearly ? "translate-x-7" : "translate-x-0"}`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
            Год
          </span>
          {isYearly && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 shadow-glow-cyan">
              −20%
            </span>
          )}
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-24">
          {plans.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-6 md:p-8 transition-all duration-300 ${
                  plan.popular
                    ? "border-secondary shadow-[0_0_30px_-5px_hsl(var(--secondary)/0.35)] scale-[1.03] bg-card/80"
                    : "border-border/50 bg-card/40 hover:border-primary/40 hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.2)]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground shadow-glow-purple">
                      <Sparkles className="w-3 h-3" />
                      Самый популярный
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4 ${
                    plan.popular ? "bg-secondary/15 text-secondary" : "bg-primary/10 text-primary"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                </div>

                <div className="mb-6">
                  {price === 0 ? (
                    <div className="text-4xl font-extrabold text-foreground">Бесплатно</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-foreground">{price.toLocaleString("ru-RU")}</span>
                      <span className="text-sm text-muted-foreground">
                        руб/{isYearly ? "мес (при оплате за год)" : "мес"}
                      </span>
                    </div>
                  )}
                  {plan.name === "TEAM" && (
                    <p className="text-xs text-muted-foreground mt-1">за участника</p>
                  )}
                </div>

                <ul className="flex-1 space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.popular ? "text-secondary" : "text-primary"}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.ctaVariant}
                  className={`w-full ${plan.popular ? "shadow-glow-purple" : ""}`}
                >
                  {plan.cta}
                </Button>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            <span className="bg-gradient-neon bg-clip-text text-transparent">Вопросы по оплате</span>
          </h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-border/50 bg-card/40 overflow-hidden transition-colors hover:border-primary/30"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-foreground"
                >
                  {item.q}
                  <span className={`ml-2 text-primary transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-5 pb-4 text-sm text-muted-foreground">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Affiliate Section */}
        <AffiliateSection />
      </main>
    </div>
  );
};

export default Pricing;
