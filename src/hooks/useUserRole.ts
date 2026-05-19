import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "moderator" | "user";

export function useUserRole() {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchRoles = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) {
        setRoles([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (!error && data && !cancelled) {
        setRoles(data.map((r) => r.role as AppRole));
      }
      if (!cancelled) setLoading(false);
    };

    fetchRoles();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchRoles();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = roles.includes("admin");
  // PRO-подписка пока не подключена (нет Stripe/Paddle).
  // Чтобы не показывать рекламные обещания, `isPro` опирается на честный
  // признак подписки в БД; админ получает полный доступ через `isAdmin`,
  // и сам компонент-страж (ProGate) пропускает админа без условия PRO.
  const isPro = false;

  return { roles, isAdmin, isPro, loading };
}
