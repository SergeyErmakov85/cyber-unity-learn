// Вход через Яндекс (OAuth2 без OIDC-discovery — ручной флоу, см. _shared/oauth.ts).
// Секреты: YANDEX_CLIENT_ID, YANDEX_CLIENT_SECRET, APP_URL (supabase secrets set).
// redirect_uri в приложении Яндекса: {SUPABASE_URL}/functions/v1/oauth-yandex?action=callback
import { handleOAuthRequest, type OAuthUserInfo } from "../_shared/oauth.ts";

async function fetchYandexUserInfo(accessToken: string): Promise<OAuthUserInfo> {
  const resp = await fetch("https://login.yandex.ru/info?format=json", {
    headers: { Authorization: `OAuth ${accessToken}` },
  });
  if (!resp.ok) throw new Error(`Yandex userinfo HTTP ${resp.status}`);
  const info = await resp.json();
  return {
    email: info.default_email ?? null,
    name: info.display_name || info.real_name || info.login || null,
    avatarUrl:
      info.default_avatar_id && !info.is_avatar_empty
        ? `https://avatars.yandex.net/get-yapic/${info.default_avatar_id}/islands-200`
        : null,
  };
}

Deno.serve((req) =>
  handleOAuthRequest(req, {
    provider: "yandex",
    clientId: Deno.env.get("YANDEX_CLIENT_ID") ?? "",
    clientSecret: Deno.env.get("YANDEX_CLIENT_SECRET") ?? "",
    authorizeUrl: "https://oauth.yandex.ru/authorize",
    tokenUrl: "https://oauth.yandex.ru/token",
    fetchUserInfo: fetchYandexUserInfo,
  }),
);
