import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MONETIZATION_ENABLED } from "@/config/monetization";

const PRESET_AMOUNTS = [200, 500, 1000] as const;

const OpenLearningSection = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(500);
  const [customAmount, setCustomAmount] = useState<string>("");

  const handleSupport = () => {
    const amount =
      selectedAmount === "custom"
        ? Number(customAmount) || 0
        : selectedAmount;
    if (amount <= 0) return;
    window.open(
      `https://pay.cloudtips.ru/p/14429291?amount=${amount}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section
      id="open-learning"
      className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-background via-card/20 to-background"
    >
      {/* Subtle ambient glow — calm, no aggressive accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-3xl relative z-10">
        {/* ── Mission ─────────────────────────────────── */}
        <div className="text-center space-y-6 mb-12">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            <span className="text-foreground">Открытое обучение. </span>
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              Осознанное развитие.
            </span>
          </h2>

          <div className="space-y-4 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            <p>
              CUBER создаётся как открытая образовательная платформа.
            </p>
            {MONETIZATION_ENABLED ? (
              <>
                <p>
                  Ты можешь изучить{" "}
                  <strong className="text-foreground font-medium">основы бесплатно</strong>{" "}
                  — без ограничений и paywall.
                </p>
                <p>
                  Если хотите двигаться дальше — глубже, быстрее и с практикой —
                  доступ к следующим модулям открывается по подписке.
                  Подписка не только помогает вам расти в обучении,
                  но и способствует развитию платформы.
                </p>
              </>
            ) : (
              <>
                <p>
                  Все материалы —{" "}
                  <strong className="text-foreground font-medium">полностью бесплатны и открыты</strong>{" "}
                  для всех: уроки, проекты, учебник по математике и примеры кода.
                  Ни paywall, ни подписок — регистрация нужна только для того,
                  чтобы сохранять прогресс.
                </p>
                <p>
                  Платформа развивается на добровольные пожертвования: если материалы
                  оказались полезны, вы можете поддержать проект — это помогает
                  писать новые разделы и держать всё содержимое открытым.
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── Primary CTA ─────────────────────────────── */}
        <div className="flex flex-col items-center gap-3 mb-16">
          <Button
            size="lg"
            variant="cyber"
            className="text-base px-8 group"
            onClick={() => navigate(MONETIZATION_ENABLED ? "/pricing" : "/courses")}
          >
            <Sparkles className="w-4 h-4 mr-2 group-hover:animate-glow-pulse" />
            Продолжить обучение
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-xs text-muted-foreground/70">
            {MONETIZATION_ENABLED
              ? "Доступ к продвинутым модулям и проектам"
              : "Все разделы и проекты открыты — без регистрации"}
          </p>
        </div>

        {/* ── Soft divider ────────────────────────────── */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/30" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-4 text-xs uppercase tracking-widest text-muted-foreground/60">
              или
            </span>
          </div>
        </div>

        {/* ── Secondary: Support ──────────────────────── */}
        <div className="bg-card/40 backdrop-blur-sm border border-border/40 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <Heart className="w-4 h-4 text-amber-400 fill-amber-400/30" />
              Поддержать проект
            </div>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              {MONETIZATION_ENABLED
                ? "Разовый взнос — помогает развивать открытые материалы и сохранять базовый курс бесплатным"
                : "Добровольный разовый взнос — помогает развивать материалы и сохранять весь курс открытым и бесплатным"}
            </p>
          </div>

          {/* Amount selector */}
          <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
            {PRESET_AMOUNTS.map((amount) => {
              const isActive = selectedAmount === amount;
              return (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount("");
                  }}
                  className={`py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "border-primary/50 bg-primary/10 text-primary shadow-glow-cyan"
                      : "border-border/40 bg-card/60 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {amount} ₽
                </button>
              );
            })}
          </div>

          {/* Custom amount */}
          <div className="max-w-md mx-auto">
            <label className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Своя сумма:
              </span>
              <div className="relative flex-1">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  ₽
                </span>
                <Input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  placeholder="—"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount("custom");
                  }}
                  className="pr-7 bg-background/60 border-border/40 focus-visible:border-primary/50 focus-visible:ring-primary/20"
                />
              </div>
            </label>
          </div>

          {/* Support CTA */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={handleSupport}
              className="border-amber-400/40 text-amber-300 hover:bg-amber-400/10 hover:border-amber-400/60 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] transition-all"
            >
              <Heart className="w-4 h-4 mr-2 fill-amber-400/40" />
              Поддержать CUBER
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default OpenLearningSection;
