import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
// TODO: прогресс (XP/бейджи/уроки) сейчас живёт в localStorage (rl_platform_progress).
// Миграция в Supabase-таблицу — отдельная большая задача (синхронизация между устройствами).
import { getProgress, ALL_BADGES, getLevel, getLevelProgress, getLevelCompletionPercent } from "@/lib/gamification";
import { LEARNING_MAP } from "@/content/learningMap";
import { User, Camera, BookOpen, Trophy, Settings, Lock, Trash2, Save, ArrowRight, Download, KeyRound } from "lucide-react";
import Navbar from "@/components/landing/Navbar";

const ORBITRON = "'Orbitron', ui-sans-serif, system-ui, sans-serif";

// Способ входа хранится в user_metadata.provider (проставляется Edge Functions
// oauth-yandex / oauth-mailru); отсутствие значения = обычная email-регистрация.
type SignInProvider = "email" | "yandex" | "mailru";

const PROVIDER_LABELS: Record<SignInProvider, string> = {
  email: "Email",
  yandex: "Яндекс",
  mailru: "Mail.ru",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState("");

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const userId = user?.id ?? null;
  const email = user?.email ?? "";
  const metadataProvider = user?.user_metadata?.provider;
  const signInProvider: SignInProvider =
    metadataProvider === "yandex" || metadataProvider === "mailru" ? metadataProvider : "email";
  // Пользователи Яндекс/Mail.ru созданы без пароля (вход через OAuth) —
  // смена пароля им недоступна, чтобы не создавать «полу-парольные» аккаунты.
  const canChangePassword = signInProvider === "email";

  // Уроки берутся из канонического LEARNING_MAP (проекты в прогресс уроков не входят)
  const allLessonPaths = useMemo(
    () => LEARNING_MAP.flatMap((s) => s.lessons.filter((l) => l.type === "lesson").map((l) => l.path)),
    [],
  );

  // Gamification (localStorage)
  const progress = getProgress();
  const totalLessons = allLessonPaths.length;
  const completedLessons = progress.completedLessons.filter((p) => allLessonPaths.includes(p)).length;
  const overallPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const level = getLevel(progress.xp);
  const levelProgress = getLevelProgress(progress.xp);

  const stageNameForPath = (path: string) => {
    const idx = LEARNING_MAP.findIndex((s) => s.lessons.some((l) => l.path === path));
    return idx >= 0 ? `Уровень ${idx + 1}: ${LEARNING_MAP[idx].title}` : "Курс RL";
  };

  const getCurrentCourse = () => {
    const firstUncompleted = allLessonPaths.find((p) => !progress.completedLessons.includes(p));
    if (!firstUncompleted) return { name: "Все курсы пройдены! 🎉", path: "/courses" };
    return { name: stageNameForPath(firstUncompleted), path: firstUncompleted };
  };
  const currentCourse = getCurrentCourse();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    const loadProfile = async () => {
      const { data } = await supabase.from("profiles").select("name, avatar_url, created_at").eq("id", user.id).maybeSingle();
      if (data) {
        setName(data.name || "");
        setAvatarUrl(data.avatar_url);
        setCreatedAt(data.created_at ? new Date(data.created_at).toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" }) : "Дата не указана");
      }
      setProfileLoading(false);
    };
    void loadProfile();
  }, [authLoading, user, navigate]);

  const handleSaveProfile = async () => {
    if (!userId) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ name }).eq("id", userId);
    setSaving(false);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Сохранено!", description: "Профиль обновлён" });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });
    if (uploadError) {
      toast({ title: "Ошибка загрузки", description: uploadError.message, variant: "destructive" });
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const url = `${publicUrl}?t=${Date.now()}`;
    await supabase.from("profiles").update({ avatar_url: url }).eq("id", userId);
    setAvatarUrl(url);
    toast({ title: "Аватар обновлён!" });
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: "Ошибка", description: "Пароль минимум 6 символов", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({ title: "Ошибка", description: "Пароли не совпадают", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPassword(false);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Пароль изменён!" });
      setNewPassword("");
      setConfirmNewPassword("");
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    const { error } = await supabase.functions.invoke("delete-account", { method: "POST" });
    setDeleting(false);
    if (error) {
      toast({ title: "Ошибка удаления", description: error.message, variant: "destructive" });
      return;
    }
    await supabase.auth.signOut();
    toast({ title: "Аккаунт удалён", description: "Все ваши данные удалены. Будем рады увидеть вас снова!" });
    navigate("/");
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary text-lg">Загрузка кабинета...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-8" style={{ fontFamily: ORBITRON }}>
          Личный кабинет
        </h1>

        <div className="grid gap-6">
          {/* Block 1 — Personal Info */}
          <Card className="border-primary/30 bg-card/60 backdrop-blur-sm transition-shadow hover:shadow-glow-cyan">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <User className="w-5 h-5 text-primary" /> Личные данные
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Avatar className="w-24 h-24 border-2 border-primary/30">
                      <AvatarImage src={avatarUrl || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                        {name ? name[0].toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 rounded-full bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => fileInputRef.current?.click()}>
                    Загрузить фото
                  </Button>
                </div>

                {/* Fields */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label>Имя</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="border-primary/20 bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={email} disabled className="border-primary/20 bg-background/30 text-muted-foreground" />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span>Дата регистрации: {createdAt}</span>
                    <span className="flex items-center gap-2">
                      Способ входа:
                      <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
                        {PROVIDER_LABELS[signInProvider]}
                      </Badge>
                    </span>
                  </div>
                  <Button onClick={handleSaveProfile} disabled={saving} className="bg-gradient-neon hover:shadow-glow-cyan">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Сохранение..." : "Сохранить изменения"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Block 2 — Learning Progress */}
          <Card className="border-primary/30 bg-card/60 backdrop-blur-sm transition-shadow hover:shadow-glow-cyan">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BookOpen className="w-5 h-5 text-primary" /> Прогресс обучения
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Общий прогресс</span>
                  <span className="text-primary font-semibold">{overallPercent}%</span>
                </div>
                <Progress value={overallPercent} className="h-3" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-2xl font-bold text-primary">{completedLessons}</div>
                  <div className="text-xs text-muted-foreground">Уроков пройдено</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-2xl font-bold text-primary">{totalLessons}</div>
                  <div className="text-xs text-muted-foreground">Всего уроков</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-2xl font-bold text-primary">{progress.xp}</div>
                  <div className="text-xs text-muted-foreground">XP</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-2xl font-bold text-primary">Ур. {level}</div>
                  <div className="text-xs text-muted-foreground">{Math.round(levelProgress)}% до след.</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div>
                  <div className="text-sm text-muted-foreground">Текущий курс</div>
                  <div className="font-semibold text-foreground">{currentCourse.name}</div>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate(currentCourse.path)}>
                  Продолжить <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Block 3 — Achievements */}
          <Card className="border-primary/30 bg-card/60 backdrop-blur-sm transition-shadow hover:shadow-glow-purple">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Trophy className="w-5 h-5 text-primary" /> Достижения
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ALL_BADGES.map((badge) => {
                  const unlocked = progress.badges.some((b) => b.id === badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-lg border text-center transition-all duration-300 ${
                        unlocked
                          ? "border-primary/30 bg-primary/5 shadow-glow-cyan"
                          : "border-muted/20 bg-muted/5 opacity-50 grayscale"
                      }`}
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <div className={`text-sm font-semibold ${unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                        {badge.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{badge.description}</div>
                      {!unlocked && <Lock className="w-4 h-4 text-muted-foreground mx-auto mt-2" />}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Block 4 — Progress by course stages */}
          <Card className="border-primary/30 bg-card/60 backdrop-blur-sm transition-shadow hover:shadow-glow-cyan">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BookOpen className="w-5 h-5 text-primary" /> Прогресс по разделам курса
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {LEARNING_MAP.map((stage, index) => {
                const percent = getLevelCompletionPercent(index);
                const color = index === 0 ? "text-primary" : index === 1 ? "text-secondary" : "text-accent";
                return (
                  <div key={stage.id}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className={`font-medium ${color}`}>{`Уровень ${index + 1} — ${stage.title}`}</span>
                      <span className="text-muted-foreground">{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-2.5" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Block 4b — Jupyter Notebooks */}
          <Card className="border-primary/30 bg-card/60 backdrop-blur-sm transition-shadow hover:shadow-glow-purple">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BookOpen className="w-5 h-5 text-primary" />
                Jupyter-ноутбуки
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Рабочие ноутбуки из курса — скачай и запусти в Google Colab или локально.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    name: "FoodCollector_REINFORCE_v3.ipynb",
                    desc: "REINFORCE + GridSensor + ONNX",
                    href: "/FoodCollector_REINFORCE_v3.ipynb",
                    color: "border-primary/30 hover:border-primary/60",
                  },
                  {
                    name: "Taxi-v3.ipynb",
                    desc: "Q-Learning + epsilon-greedy",
                    href: "/Taxi-v3.ipynb",
                    color: "border-secondary/30 hover:border-secondary/60",
                  },
                ].map((nb) => (
                  <a
                    key={nb.name}
                    href={nb.href}
                    download
                    className={`flex items-start gap-3 p-4 rounded-lg border bg-card/60 transition-colors ${nb.color}`}
                  >
                    <Download className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{nb.name}</p>
                      <p className="text-xs text-muted-foreground">{nb.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Block 5 — Account Settings */}
          <Card className="border-primary/30 bg-card/60 backdrop-blur-sm transition-shadow hover:shadow-glow-cyan">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Settings className="w-5 h-5 text-primary" /> Настройки аккаунта
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Change Password */}
              {canChangePassword ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Смена пароля</h3>
                  <div className="grid gap-3 max-w-md">
                    <div className="space-y-2">
                      <Label>Новый пароль</Label>
                      <Input type="password" placeholder="Минимум 6 символов" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="border-primary/20 bg-background/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Подтверждение нового пароля</Label>
                      <Input type="password" placeholder="Повторите пароль" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="border-primary/20 bg-background/50" />
                    </div>
                    <Button variant="outline" onClick={handleChangePassword} disabled={changingPassword} className="w-fit">
                      {changingPassword ? "Сохранение..." : "Сменить пароль"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <KeyRound className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Вы входите через {PROVIDER_LABELS[signInProvider]} — пароль на платформе не задан,
                    поэтому смена пароля недоступна. Управляйте доступом в настройках вашего аккаунта {PROVIDER_LABELS[signInProvider]}.
                  </p>
                </div>
              )}

              {/* Delete Account */}
              <div className="border-t border-destructive/20 pt-6">
                <h3 className="text-sm font-semibold text-destructive mb-2">Опасная зона</h3>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" /> Удалить аккаунт
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-destructive/30">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Удалить аккаунт?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Это действие необратимо: аккаунт и профиль будут удалены навсегда.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} disabled={deleting} className="bg-destructive hover:bg-destructive/90">
                        {deleting ? "Удаление..." : "Удалить"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
