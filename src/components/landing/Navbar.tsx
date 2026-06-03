import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, GraduationCap, Code2, FileText, CreditCard, HelpCircle, Users, Search, LogOut, Brain, Gamepad2, Sparkles, Rocket, Network, User as UserIcon, Cpu, Microscope } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import logoImage from "@/assets/logo-rl-platform.png";
import GlobalSearch from "@/components/GlobalSearch";
import UserProfilePopover from "@/components/UserProfilePopover";
import XpNotification from "@/components/XpNotification";
import { checkStreak } from "@/lib/gamification";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/courses", label: "Курсы", icon: GraduationCap },
  { href: "/code-examples", label: "Примеры кода", icon: Code2 },
  { href: "/blog", label: "Блог", icon: FileText },
  { href: "/pricing", label: "Тарифы", icon: CreditCard },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/community", label: "Сообщество", icon: Users },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const loadUserDisplayName = useCallback(async (user: User) => {
    const metadataName = typeof user.user_metadata?.name === "string" ? user.user_metadata.name : null;
    const fallbackName = metadataName || user.email || "User";

    const { data } = await supabase
      .from("profiles")
      .select("name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (data?.name?.trim()) setUserName(data.name.trim());
    else setUserName(fallbackName);
    if (data?.avatar_url) setAvatarUrl(data.avatar_url);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    checkStreak();
  }, []);

  useEffect(() => {
    let mounted = true;

    const syncAuthState = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!mounted) return;

      if (!user) {
        setAuthUser(null);
        setAvatarUrl(null);
        setUserName(null);
        setAuthLoading(false);
        return;
      }

      setAuthUser(user);
      await loadUserDisplayName(user);
      if (mounted) setAuthLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setAuthUser(nextUser);

      if (!nextUser) {
        setUserName(null);
        setAvatarUrl(null);
        setAuthLoading(false);
        return;
      }

      void loadUserDisplayName(nextUser);
    });

    void syncAuthState();
    window.addEventListener("focus", syncAuthState);

    return () => {
      mounted = false;
      window.removeEventListener("focus", syncAuthState);
      subscription.unsubscribe();
    };
  }, [loadUserDisplayName]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setUserName(null);
    navigate("/");
  };

  const isActive = (href: string) => location.pathname === href;
  const displayName = userName || authUser?.email || "Профиль";

  return (
    <>
    <GlobalSearch />
    <XpNotification />
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-xl" : "bg-background"}`}>
      <div className="container px-4 mx-auto">
        <div className={`relative flex items-center justify-center transition-all duration-300 ${isScrolled ? "h-14" : "h-16 md:h-20"}`}>
          {/* Logo - positioned left */}
          <a
            href="/"
            className="absolute -left-20 md:-left-28 lg:-left-36 top-full -translate-y-1/2 flex items-center group"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <picture>
              <source srcSet={logoImage} type="image/png" />
              <img
                src={logoImage}
                alt="RL Platform"
                className={`w-auto transition-all duration-300 group-hover:drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)] ${isScrolled ? "h-[88px]" : "h-[104px] md:h-[120px] lg:h-[136px]"}`}
                loading="eager"
                decoding="async"
                width="200"
                height="64"
              />
            </picture>
          </a>

          {/* Desktop Navigation - Tech Stack Badges */}
          <div className="hidden lg:flex items-center gap-2 ml-44">
            <button onClick={() => navigate("/hub/pytorch")} className={`flex items-center justify-center gap-2 w-[148px] h-10 rounded-full bg-card/60 backdrop-blur-sm border transition-all duration-300 cursor-pointer hover:scale-105 ${location.pathname === "/hub/pytorch" ? "border-primary/70 bg-primary/15 shadow-glow-cyan" : "border-primary/30 shadow-glow-cyan hover:bg-primary/10"}`}>
              <Brain className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-medium text-foreground whitespace-nowrap">PyTorch</span>
            </button>
            <button onClick={() => navigate("/hub/unity-ml-agents")} className={`flex items-center justify-center gap-2 w-[148px] h-10 rounded-full bg-card/60 backdrop-blur-sm border transition-all duration-300 cursor-pointer hover:scale-105 ${location.pathname === "/hub/unity-ml-agents" ? "border-secondary/70 bg-secondary/15 shadow-glow-purple" : "border-secondary/30 shadow-glow-purple hover:bg-secondary/10"}`}>
              <Gamepad2 className="w-4 h-4 text-secondary shrink-0" />
              <span className="text-sm font-medium text-foreground whitespace-nowrap">Unity ML-Agents</span>
            </button>
            <button onClick={() => navigate("/hub/deep-rl")} className={`flex items-center justify-center gap-2 w-[148px] h-10 rounded-full bg-card/60 backdrop-blur-sm border transition-all duration-300 cursor-pointer hover:scale-105 ${location.pathname === "/hub/deep-rl" ? "border-accent/70 bg-accent/15 shadow-glow-pink" : "border-accent/30 shadow-glow-pink hover:bg-accent/10"}`}>
              <Code2 className="w-4 h-4 text-accent shrink-0" />
              <span className="text-sm font-medium text-foreground whitespace-nowrap">Deep RL</span>
            </button>
            <button onClick={() => navigate("/hub/math-rl")} className={`flex items-center justify-center gap-2 w-[148px] h-10 rounded-full bg-card/60 backdrop-blur-sm border transition-all duration-300 cursor-pointer hover:scale-105 ${location.pathname === "/hub/math-rl" ? "border-green-400/70 bg-green-400/15 shadow-glow-green" : "border-green-400/30 shadow-glow-green hover:bg-green-400/10"}`}>
              <Sparkles className="w-4 h-4 text-green-400 shrink-0" />
              <span className="text-sm font-medium text-foreground whitespace-nowrap">Математика RL</span>
            </button>
            <button onClick={() => navigate("/algorithms")} className={`flex items-center justify-center gap-2 w-[148px] h-10 rounded-full bg-card/60 backdrop-blur-sm border transition-all duration-300 cursor-pointer hover:scale-105 ${location.pathname.startsWith("/algorithms") ? "border-blue-500/70 bg-blue-500/15 shadow-glow-darkblue" : "border-blue-500/30 shadow-glow-darkblue hover:bg-blue-500/10"}`}>
              <Cpu className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-sm font-medium text-foreground whitespace-nowrap">Алгоритмы RL</span>
            </button>
            <button onClick={() => navigate("/unity-projects")} className={`flex items-center justify-center gap-2 w-[148px] h-10 rounded-full bg-card/60 backdrop-blur-sm border transition-all duration-300 cursor-pointer hover:scale-105 ${location.pathname === "/unity-projects" ? "border-secondary/70 bg-secondary/15 shadow-glow-purple" : "border-secondary/30 shadow-glow-purple hover:bg-secondary/10"}`}>
              <Rocket className="w-4 h-4 text-secondary shrink-0" />
              <span className="text-sm font-medium text-foreground whitespace-nowrap">Проекты</span>
            </button>
            <button onClick={() => navigate("/hub/research")} className={`flex items-center justify-center gap-2 w-[148px] h-10 rounded-full bg-card/60 backdrop-blur-sm border transition-all duration-300 cursor-pointer hover:scale-105 ${location.pathname === "/hub/research" ? "border-yellow-400/70 bg-yellow-400/15 shadow-glow-yellow" : "border-yellow-400/30 shadow-glow-yellow hover:bg-yellow-400/10"}`}>
              <Microscope className="w-4 h-4 text-yellow-400 shrink-0" />
              <span className="text-sm font-medium text-foreground whitespace-nowrap">Исследования RL</span>
            </button>
            {/* Utility items */}
            <div className="flex items-center gap-3 ml-3 pl-3 border-l border-border/30">
              <button
                onClick={() => navigate("/pricing")}
                className={`text-sm transition-all duration-300 ${location.pathname === "/pricing" ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                Тарифы
              </button>
              {!authLoading && authUser ? (
                <button
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-card/60 backdrop-blur-sm hover:bg-primary/10 transition-all duration-300 cursor-pointer"
                >
                  <Avatar className="w-8 h-8 border border-primary/30">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {userName ? userName[0].toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                    {displayName}
                  </span>
                </button>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <Button
                    size="sm"
                    className="bg-gradient-neon hover:shadow-glow-cyan text-sm px-4"
                    onClick={() => navigate("/courses")}
                  >
                    Начать бесплатно
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-sm px-4 border-primary/40 text-primary hover:bg-primary/10 hover:shadow-glow-cyan"
                    onClick={() => navigate("/register")}
                  >
                    Регистрация
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Hamburger menu - inline after badges */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2 text-primary hover:text-primary hover:bg-primary/10 hover:shadow-glow-cyan transition-all duration-300">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-xl border-l border-primary/30">
              <div className="flex flex-col h-full pt-8">
                {/* Mobile Logo */}
                <div className="flex items-center gap-2 mb-8 px-2">
                  <picture>
                    <source srcSet={logoImage} type="image/png" />
                    <img src={logoImage} alt="RL Platform" className="h-10 w-auto" loading="eager" decoding="async" width="200" height="64" />
                  </picture>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);
                    return (
                      <button
                        key={link.href}
                        onClick={() => {
                          setIsOpen(false);
                          navigate(link.href);
                        }}
                        className={`flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 group ${
                          active
                            ? "text-primary bg-primary/10 shadow-glow-cyan"
                            : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                        }`}
                      >
                        <Icon className={`w-4 h-4 mr-3 transition-all duration-300 ${active ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} />
                        {link.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tech Stack Badges */}
                <div className="flex flex-col gap-1 mt-4 pt-4 border-t border-border/30">
                  <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Быстрый доступ</p>
                  {[
                    { href: "/hub/pytorch", label: "PyTorch", Icon: Brain, color: "text-primary" },
                    { href: "/hub/unity-ml-agents", label: "Unity ML-Agents", Icon: Gamepad2, color: "text-secondary" },
                    { href: "/hub/deep-rl", label: "Deep RL", Icon: Code2, color: "text-accent" },
                    { href: "/unity-projects", label: "Проекты", Icon: Rocket, color: "text-secondary" },
                    { href: "/hub/math-rl", label: "Математика RL", Icon: Sparkles, color: "text-accent" },
                    { href: "/algorithms", label: "Алгоритмы RL", Icon: Cpu, color: "text-blue-400" },
                    { href: "/hub/research", label: "Исследования RL", Icon: Microscope, color: "text-yellow-400" },
                    
                  ].map((item) => (
                    <button
                      key={item.href + item.label}
                      onClick={() => { setIsOpen(false); navigate(item.href); }}
                      className={`flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 group ${
                        isActive(item.href)
                          ? `${item.color} bg-primary/10`
                          : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                      }`}
                    >
                      <item.Icon className={`w-4 h-4 mr-3 transition-all duration-300 ${isActive(item.href) ? item.color : "text-muted-foreground group-hover:" + item.color}`} />
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Utility links */}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/30 px-2">
                  <button
                    onClick={() => { setIsOpen(false); navigate("/pricing"); }}
                    className={`flex items-center px-4 py-3 text-left rounded-lg transition-all duration-300 ${
                      isActive("/pricing") ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mr-3" />
                    Тарифы
                  </button>
                  {!authUser && (
                    <>
                      <Button
                        className="w-full bg-gradient-neon hover:shadow-glow-cyan"
                        onClick={() => { setIsOpen(false); navigate("/courses"); }}
                      >
                        Начать бесплатно
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-primary/40 text-primary hover:bg-primary/10 hover:shadow-glow-cyan"
                        onClick={() => { setIsOpen(false); navigate("/register"); }}
                      >
                        Регистрация
                      </Button>
                    </>
                  )}
                </div>

                {/* Mobile CTA */}
                <div className="mt-auto flex flex-col gap-3 px-2 pb-8">
                  {authLoading ? (
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-10 w-full rounded-md" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  ) : authUser ? (
                    <div className="animate-fade-in flex flex-col gap-3">
                      <Button variant="ghost" className="w-full justify-start" onClick={() => { setIsOpen(false); navigate("/profile"); }}>
                        {displayName}
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => { setIsOpen(false); handleLogout(); }}>
                        <LogOut className="w-4 h-4 mr-2" /> Выйти
                      </Button>
                    </div>
                  ) : (
                    <div className="animate-fade-in flex flex-col gap-3">
                      <Button className="w-full bg-gradient-neon hover:shadow-glow-cyan" onClick={() => { setIsOpen(false); navigate("/register"); }}>Регистрация</Button>
                      <Button variant="outline" className="w-full" onClick={() => { setIsOpen(false); navigate("/login"); }}>Войти</Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

    </nav>
    </>
  );
};

export default Navbar;
