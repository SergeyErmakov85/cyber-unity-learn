import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const EmailCapture = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Введите корректный email");
      return;
    }
    setLoading(true);
    const { error: dbError } = await supabase
      .from("email_subscriptions")
      .insert({ email: trimmed, source: "landing" });
    setLoading(false);
    if (dbError && dbError.code !== "23505") {
      setError("Не удалось подписаться. Попробуйте позже.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <section className="py-20 px-4 border-t border-border/50">
      <div className="container mx-auto max-w-xl text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
          <Mail className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Получай бесплатные уроки и новости
        </h2>
        <p className="text-muted-foreground text-sm">
          Без спама. Только полезные материалы по RL и Unity ML-Agents.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-card border-border/50 focus:border-primary"
              maxLength={255}
              aria-label="Email для подписки"
            />
            <Button type="submit" disabled={loading} className="bg-gradient-neon shrink-0 gap-2">
              <Mail className="w-4 h-4" />
              {loading ? "Отправка…" : "Подписаться"}
            </Button>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Спасибо! Проверьте почту.</span>
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </section>
  );
};

export default EmailCapture;
