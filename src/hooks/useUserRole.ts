import { useAuth, type AppRole } from "@/hooks/useAuth";

export type { AppRole };

/**
 * Тонкая обёртка над useAuth() для обратной совместимости.
 * Auth-состояние и роли живут в едином AuthProvider (src/hooks/useAuth.tsx);
 * новый код должен использовать useAuth() напрямую.
 */
export function useUserRole() {
  const { roles, isAdmin, isPro, loading } = useAuth();
  return { roles, isAdmin, isPro, loading };
}
