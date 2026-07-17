import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, X } from "lucide-react";

// Typed shim for the beta supabase.auth.oauth namespace.
type OAuthClient = {
  name?: string | null;
  client_name?: string | null;
  redirect_uris?: string[] | null;
  redirect_uri?: string | null;
};
type AuthorizationDetails = {
  client?: OAuthClient | null;
  scope?: string | null;
  scopes?: string[] | null;
  redirect_url?: string | null;
  redirect_to?: string | null;
};
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: { redirect_url?: string; redirect_to?: string } | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: { redirect_url?: string; redirect_to?: string } | null; error: { message: string } | null }>;
};

const oauthApi = (): OAuthApi => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<AuthorizationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Отсутствует параметр authorization_id");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await oauthApi().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const call = approve ? oauthApi().approveAuthorization : oauthApi().denyAuthorization;
    const { data, error } = await call(authorizationId);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("Сервер авторизации не вернул URL для перенаправления.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? details?.client?.client_name ?? "внешнее приложение";
  const scopes =
    details?.scopes ??
    (details?.scope
      ? details.scope
          .split(" ")
          .map((s) => s.trim())
          .filter(Boolean)
      : []);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md border-destructive/30 bg-card/80 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-destructive">Не удалось загрузить запрос авторизации</CardTitle>
            <CardDescription className="text-muted-foreground">{error}</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  if (!details) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <p className="text-muted-foreground">Загрузка запроса авторизации…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-lg border-primary/30 bg-card/80 backdrop-blur-xl shadow-glow-cyan">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <CardTitle className="text-2xl text-foreground">
            Подключить <span className="text-primary">{clientName}</span> к RL Platform
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {clientName} сможет вызывать инструменты RL Platform от вашего имени, пока вы вошли в аккаунт.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-primary/20 bg-background/40 p-4 space-y-2 text-sm">
            <p className="text-muted-foreground">
              Разрешения, действующие RLS и политики базы данных остаются в силе — MCP-клиент видит только
              те данные, к которым у вас есть доступ.
            </p>
            {scopes.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Запрошенные scope</p>
                <ul className="list-disc list-inside text-foreground/90">
                  {scopes.map((s) => (
                    <li key={s} className="font-mono text-xs">{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-gradient-neon hover:shadow-glow-cyan"
              disabled={busy}
              onClick={() => decide(true)}
            >
              {busy ? "…" : "Разрешить"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-primary/30"
              disabled={busy}
              onClick={() => decide(false)}
            >
              <X className="w-4 h-4 mr-2" /> Отклонить
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
