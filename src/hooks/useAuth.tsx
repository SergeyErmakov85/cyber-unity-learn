import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type AppRole = "admin" | "moderator" | "user";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  /** true, пока не получены первоначальная сессия и роли */
  loading: boolean;
  roles: AppRole[];
  isAdmin: boolean;
  isPro: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Единый источник auth-состояния приложения.
 * Подписка на supabase.auth живёт только здесь; компоненты читают контекст
 * через useAuth() вместо собственных вызовов getUser()/onAuthStateChange.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchRoles = async (currentUser: User | null) => {
      if (!currentUser) {
        if (!cancelled) setRoles([]);
        return;
      }
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", currentUser.id);
      if (!cancelled) {
        setRoles(!error && data ? data.map((r) => r.role as AppRole) : []);
      }
    };

    const init = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      if (cancelled) return;
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      await fetchRoles(initialSession?.user ?? null);
      if (!cancelled) setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      // fetchRoles делает сетевой запрос — выносим из синхронного колбэка,
      // чтобы не блокировать внутреннюю очередь событий supabase-js.
      setTimeout(() => {
        void fetchRoles(nextSession?.user ?? null);
      }, 0);
    });

    void init();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = roles.includes("admin");
  // PRO-подписка пока не подключена (нет Stripe/Paddle).
  // `isPro` остаётся честным false; админ обходит ProGate через isAdmin.
  const isPro = false;

  return (
    <AuthContext.Provider value={{ user, session, loading, roles, isAdmin, isPro }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth должен использоваться внутри <AuthProvider>");
  }
  return ctx;
}
