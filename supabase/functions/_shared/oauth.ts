// Общий OAuth2-флоу для провайдеров без OIDC-discovery (Яндекс, Mail.ru).
// Схема: ?action=start → редирект на authorize-эндпоинт провайдера с подписанным
// state в HttpOnly-cookie → провайдер возвращает на ?action=callback&code&state →
// сверка state → обмен code на access_token (client_secret только здесь, в secrets) →
// userinfo → createUser/generateLink(magiclink) → редирект на {APP_URL}/auth/callback.
import { createClient } from "npm:@supabase/supabase-js@2";

export interface OAuthUserInfo {
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
}

export interface OAuthProviderConfig {
  /** Значение user_metadata.provider у создаваемых пользователей */
  provider: "yandex" | "mailru";
  clientId: string;
  clientSecret: string;
  authorizeUrl: string;
  tokenUrl: string;
  /** Дополнительные query-параметры authorize-эндпоинта (напр. scope) */
  extraAuthorizeParams?: Record<string, string>;
  fetchUserInfo: (accessToken: string) => Promise<OAuthUserInfo>;
}

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required secret: ${name}`);
  return value;
}

async function hmacSign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function readCookie(req: Request, name: string): string | null {
  const header = req.headers.get("cookie") ?? "";
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return null;
}

function redirect(location: string, extraHeaders: Record<string, string> = {}): Response {
  return new Response(null, { status: 302, headers: { Location: location, ...extraHeaders } });
}

function loginError(appUrl: string, code: string, clearCookie?: string): Response {
  const headers: Record<string, string> = {};
  if (clearCookie) headers["Set-Cookie"] = clearCookie;
  return redirect(`${appUrl}/login?error=${encodeURIComponent(code)}`, headers);
}

export async function handleOAuthRequest(req: Request, config: OAuthProviderConfig): Promise<Response> {
  const appUrl = requireEnv("APP_URL").replace(/\/$/, "");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabaseUrl = requireEnv("SUPABASE_URL");

  const url = new URL(req.url);
  const action = url.searchParams.get("action") ?? "";
  // redirect_uri должен байт-в-байт совпадать с зарегистрированным у провайдера
  const redirectUri = `${url.origin}${url.pathname}?action=callback`;
  const cookieName = `oauth_state_${config.provider}`;
  const clearCookie = `${cookieName}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;

  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  if (action === "start") {
    // CSRF-защита: state случайный, подпись HMAC кладём в HttpOnly-cookie
    const state = crypto.randomUUID();
    const sig = await hmacSign(state, serviceRoleKey);
    const authorize = new URL(config.authorizeUrl);
    authorize.searchParams.set("response_type", "code");
    authorize.searchParams.set("client_id", config.clientId);
    authorize.searchParams.set("redirect_uri", redirectUri);
    authorize.searchParams.set("state", state);
    for (const [k, v] of Object.entries(config.extraAuthorizeParams ?? {})) {
      authorize.searchParams.set(k, v);
    }
    return redirect(authorize.toString(), {
      "Set-Cookie": `${cookieName}=${state}.${sig}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`,
    });
  }

  if (action === "callback") {
    const providerError = url.searchParams.get("error");
    if (providerError) return loginError(appUrl, "oauth_denied", clearCookie);

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state") ?? "";
    const cookieValue = readCookie(req, cookieName) ?? "";
    const [cookieState = "", cookieSig = ""] = cookieValue.split(".");
    const expectedSig = await hmacSign(cookieState, serviceRoleKey);

    if (!code || !state || !cookieState || !timingSafeEqual(state, cookieState) || !timingSafeEqual(cookieSig, expectedSig)) {
      return loginError(appUrl, "state_mismatch", clearCookie);
    }

    // Обмен code → access_token (server-side, client_secret не покидает функцию)
    const tokenResp = await fetch(config.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: redirectUri,
      }),
    });
    if (!tokenResp.ok) {
      console.error(`[oauth-${config.provider}] token exchange failed:`, tokenResp.status, await tokenResp.text());
      return loginError(appUrl, "token_exchange_failed", clearCookie);
    }
    const tokenJson = await tokenResp.json();
    const accessToken: string | undefined = tokenJson.access_token;
    if (!accessToken) return loginError(appUrl, "token_exchange_failed", clearCookie);

    let userInfo: OAuthUserInfo;
    try {
      userInfo = await config.fetchUserInfo(accessToken);
    } catch (e) {
      console.error(`[oauth-${config.provider}] userinfo failed:`, e);
      return loginError(appUrl, "userinfo_failed", clearCookie);
    }
    const email = userInfo.email?.trim().toLowerCase();
    if (!email) return loginError(appUrl, "no_email", clearCookie);

    const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

    // Ищем пользователя через generateLink: успех = пользователь существует и в ответе
    // есть его user_metadata; ошибка "not found" = нужно создать. Это надёжнее, чем
    // перебор страниц admin.listUsers без серверного фильтра по email.
    let linkRes = await admin.auth.admin.generateLink({ type: "magiclink", email });

    if (linkRes.error) {
      // Пользователя нет — создаём с подтверждённым email (адрес получен от провайдера)
      const { error: createError } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          provider: config.provider,
          name: userInfo.name ?? undefined,
          avatar_url: userInfo.avatarUrl ?? undefined,
        },
      });
      if (createError) {
        console.error(`[oauth-${config.provider}] createUser failed:`, createError.message);
        return loginError(appUrl, "signup_failed", clearCookie);
      }
      linkRes = await admin.auth.admin.generateLink({ type: "magiclink", email });
      if (linkRes.error) {
        console.error(`[oauth-${config.provider}] generateLink failed:`, linkRes.error.message);
        return loginError(appUrl, "signup_failed", clearCookie);
      }
    } else {
      // Email уже зарегистрирован. Аккаунты НЕ сливаем автоматически: вход разрешён
      // только если аккаунт создан этим же провайдером (user_metadata.provider).
      const existingProvider = linkRes.data.user?.user_metadata?.provider;
      if (existingProvider !== config.provider) {
        return loginError(appUrl, "email_exists", clearCookie);
      }
    }

    const tokenHash = linkRes.data.properties?.hashed_token;
    if (!tokenHash) return loginError(appUrl, "signup_failed", clearCookie);

    // Браузер завершает сессию на клиенте через verifyOtp (см. src/pages/AuthCallback.tsx)
    return redirect(
      `${appUrl}/auth/callback?token_hash=${encodeURIComponent(tokenHash)}&type=magiclink`,
      { "Set-Cookie": clearCookie },
    );
  }

  return new Response("Unknown action. Use ?action=start", { status: 400 });
}
