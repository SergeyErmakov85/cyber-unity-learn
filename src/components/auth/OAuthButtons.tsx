import { Button } from "@/components/ui/button";

// Кастомный OAuth2 через Edge Functions (у Supabase нет встроенных провайдеров
// Яндекс/Mail.ru). Кнопка — обычная навигация: функция сама редиректит на
// authorize-эндпоинт провайдера (?action=start).
const FUNCTIONS_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

const PROVIDERS = [
  {
    id: "yandex",
    label: "Войти через Яндекс",
    // Стилизованная монограмма провайдера в токенах дизайн-системы (не брендовая иконка)
    monogram: "Я",
    className: "border-primary/30 hover:bg-primary/10 hover:shadow-glow-cyan",
    monogramClassName: "border-primary/40 bg-primary/10 text-primary",
  },
  {
    id: "mailru",
    label: "Войти через Mail.ru",
    monogram: "@",
    className: "border-secondary/30 hover:bg-secondary/10 hover:shadow-glow-purple",
    monogramClassName: "border-secondary/40 bg-secondary/10 text-secondary",
  },
] as const;

const OAuthButtons = () => (
  <div className="w-full space-y-3">
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-border/60" />
      <span className="text-xs text-muted-foreground">или</span>
      <div className="h-px flex-1 bg-border/60" />
    </div>
    {PROVIDERS.map((p) => (
      <Button
        key={p.id}
        type="button"
        variant="outline"
        className={`w-full transition-all duration-300 ${p.className}`}
        onClick={() => {
          window.location.href = `${FUNCTIONS_BASE}/oauth-${p.id}?action=start`;
        }}
      >
        <span
          className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full border text-[11px] font-bold ${p.monogramClassName}`}
          aria-hidden="true"
        >
          {p.monogram}
        </span>
        {p.label}
      </Button>
    ))}
  </div>
);

export default OAuthButtons;
