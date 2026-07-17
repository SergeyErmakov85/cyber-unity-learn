import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { EmailOtpType } from "@supabase/supabase-js";

/**
 * Завершение OAuth-входа (Яндекс / Mail.ru): Edge Function редиректит сюда
 * с token_hash от generateLink(magiclink); verifyOtp создаёт сессию в браузере.
 */
const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // verifyOtp — одноразовый; страхуемся от двойного вызова эффекта (StrictMode)
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const tokenHash = searchParams.get("token_hash");
    const type = (searchParams.get("type") ?? "magiclink") as EmailOtpType;

    if (!tokenHash) {
      navigate("/login?error=confirm_failed", { replace: true });
      return;
    }

    supabase.auth
      .verifyOtp({ token_hash: tokenHash, type })
      .then(({ error }) => {
        if (error) {
          navigate("/login?error=confirm_failed", { replace: true });
        } else {
          navigate("/dashboard", { replace: true });
        }
      });
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-primary text-lg">Завершаем вход...</div>
    </div>
  );
};

export default AuthCallback;
