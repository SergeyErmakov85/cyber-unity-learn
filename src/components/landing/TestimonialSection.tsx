import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Star, Loader2, Trash2, LogIn } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

const MAX_LENGTH = 1000;
const MIN_LENGTH = 10;

const testimonialSchema = z.object({
  content: z
    .string()
    .trim()
    .min(MIN_LENGTH, { message: `Минимум ${MIN_LENGTH} символов` })
    .max(MAX_LENGTH, { message: `Максимум ${MAX_LENGTH} символов` }),
  rating: z.number().int().min(1).max(5),
});

type Profile = { name: string | null; avatar_url: string | null };

type TestimonialRow = {
  id: string;
  user_id: string;
  content: string;
  rating: number;
  created_at: string;
};

type TestimonialWithProfile = TestimonialRow & { profile: Profile | null };

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const StarRating = ({
  value,
  onChange,
  readOnly = false,
  size = 18,
}: {
  value: number;
  onChange?: (n: number) => void;
  readOnly?: boolean;
  size?: number;
}) => {
  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        const Comp = readOnly ? "span" : "button";
        return (
          <Comp
            key={n}
            type={readOnly ? undefined : "button"}
            onClick={readOnly ? undefined : () => onChange?.(n)}
            className={
              readOnly
                ? "inline-flex"
                : "inline-flex transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/40 rounded"
            }
            aria-label={readOnly ? `${value} из 5` : `Оценка ${n}`}
          >
            <Star
              size={size}
              className={
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/40"
              }
            />
          </Comp>
        );
      })}
    </div>
  );
};

const TestimonialSection = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<TestimonialWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  // Auth state
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, user_id, content, rating, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      toast({
        title: "Не удалось загрузить отзывы",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const rows = (data ?? []) as TestimonialRow[];
    const userIds = Array.from(new Set(rows.map((r) => r.user_id)));

    let profilesMap = new Map<string, Profile>();
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", userIds);
      profilesMap = new Map(
        (profiles ?? []).map((p) => [
          p.id as string,
          { name: p.name, avatar_url: p.avatar_url } as Profile,
        ]),
      );
    }

    setItems(
      rows.map((r) => ({ ...r, profile: profilesMap.get(r.user_id) ?? null })),
    );
    setLoading(false);
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const parsed = testimonialSchema.safeParse({ content, rating });
    if (!parsed.success) {
      toast({
        title: "Проверьте отзыв",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("testimonials").insert({
      user_id: user.id,
      content: parsed.data.content,
      rating: parsed.data.rating,
    });
    setSubmitting(false);

    if (error) {
      toast({
        title: "Не удалось отправить отзыв",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Спасибо за отзыв!" });
    setContent("");
    setRating(5);
    loadTestimonials();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      toast({
        title: "Не удалось удалить",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const initials = (name: string | null | undefined) =>
    (name ?? "?")
      .split(" ")
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <section className="py-20 px-4 relative bg-cyber-darker/50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 mb-4">
            <MessageSquare className="w-4 h-4 text-secondary" />
            <span className="text-sm text-secondary font-medium">Отзывы</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold">
            <span className="text-foreground">Что говорят </span>
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              наши ученики
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Отзывы тех, кто уже прошёл обучение
          </p>
        </div>

        {/* ── Submit form ───────────────────────────── */}
        <Card className="bg-card/60 backdrop-blur-sm border-secondary/30 mb-10">
          <CardContent className="p-6">
            {user ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <span className="text-sm font-medium text-foreground">
                    Ваша оценка
                  </span>
                  <StarRating value={rating} onChange={setRating} />
                </div>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value.slice(0, MAX_LENGTH))}
                  placeholder="Поделитесь впечатлениями от обучения…"
                  rows={4}
                  className="bg-background/60 border-border/40 focus-visible:border-primary/50 focus-visible:ring-primary/20 resize-none"
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">
                    {content.length} / {MAX_LENGTH}
                  </span>
                  <Button
                    type="submit"
                    variant="cyber"
                    disabled={submitting || content.trim().length < MIN_LENGTH}
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <MessageSquare className="w-4 h-4 mr-2" />
                    )}
                    Опубликовать отзыв
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                  Чтобы оставить отзыв, войдите в аккаунт.
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Войти
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── List ──────────────────────────────────── */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            Пока нет отзывов. Будьте первым!
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((t) => {
              const isOwn = user?.id === t.user_id;
              return (
                <Card
                  key={t.id}
                  className="bg-card/60 backdrop-blur-sm border-border/40 hover:border-primary/30 hover:shadow-glow-cyan transition-all"
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="w-10 h-10 border border-border/40">
                          {t.profile?.avatar_url && (
                            <AvatarImage src={t.profile.avatar_url} alt="" />
                          )}
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {initials(t.profile?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {t.profile?.name ?? "Аноним"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(t.created_at)}
                          </p>
                        </div>
                      </div>
                      <StarRating value={t.rating} readOnly size={14} />
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                      {t.content}
                    </p>
                    {isOwn && (
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(t.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Удалить
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialSection;
