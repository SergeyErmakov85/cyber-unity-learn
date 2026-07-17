// Вход через Mail.ru (OAuth2 без OIDC-discovery — ручной флоу, см. _shared/oauth.ts).
// Секреты: MAILRU_CLIENT_ID, MAILRU_CLIENT_SECRET, APP_URL (supabase secrets set).
// redirect_uri в приложении Mail.ru: {SUPABASE_URL}/functions/v1/oauth-mailru?action=callback
import { handleOAuthRequest, type OAuthUserInfo } from "../_shared/oauth.ts";

async function fetchMailruUserInfo(accessToken: string): Promise<OAuthUserInfo> {
  const resp = await fetch(`https://o2.mail.ru/userinfo?access_token=${encodeURIComponent(accessToken)}`);
  if (!resp.ok) throw new Error(`Mail.ru userinfo HTTP ${resp.status}`);
  const info = await resp.json();
  const fullName = [info.first_name, info.last_name].filter(Boolean).join(" ");
  return {
    email: info.email ?? null,
    name: info.nickname || fullName || null,
    avatarUrl: info.image ?? null,
  };
}

Deno.serve((req) =>
  handleOAuthRequest(req, {
    provider: "mailru",
    clientId: Deno.env.get("MAILRU_CLIENT_ID") ?? "",
    clientSecret: Deno.env.get("MAILRU_CLIENT_SECRET") ?? "",
    authorizeUrl: "https://o2.mail.ru/login",
    tokenUrl: "https://o2.mail.ru/token",
    // Mail.ru требует явный scope для email/профиля
    extraAuthorizeParams: { scope: "userinfo" },
    fetchUserInfo: fetchMailruUserInfo,
  }),
);
