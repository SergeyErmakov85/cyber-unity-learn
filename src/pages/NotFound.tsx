import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { Home, SearchX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <SEOHead
        title="Страница не найдена — 404"
        description="Запрошенная страница не существует или была перемещена."
        noindex
      />
      <div className="text-center space-y-6 max-w-md">
        <SearchX className="w-16 h-16 text-primary mx-auto opacity-60" />
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-xl text-foreground font-semibold">Страница не найдена</p>
        <p className="text-muted-foreground">
          Страница <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-sm">{location.pathname}</code> не существует или была перемещена.
        </p>
        <Button asChild className="bg-gradient-neon">
          <Link to="/" className="gap-2">
            <Home className="w-4 h-4" />
            На главную
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
