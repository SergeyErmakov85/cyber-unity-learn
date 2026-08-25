import { useMemo, useRef, useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search, X, BookOpen, FileText, Rocket, Tag } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  KIND_LABELS,
  SEARCH_TOPICS,
  searchEntries,
  type SearchEntry,
  type SearchKind,
} from "@/content/searchIndex";

const KIND_ICONS: Record<SearchKind, typeof BookOpen> = {
  lesson: BookOpen,
  project: Rocket,
  blog: FileText,
};

const KIND_STYLES: Record<SearchKind, string> = {
  lesson: "border-primary/40 text-primary",
  project: "border-accent/40 text-accent",
  blog: "border-secondary/40 text-secondary",
};

const KINDS: SearchKind[] = ["lesson", "project", "blog"];

const SearchPage = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [topics, setTopics] = useState<string[]>(
    params.get("topics")?.split(",").filter(Boolean) ?? []
  );
  const [kinds, setKinds] = useState<SearchKind[]>([]);
  const [openSuggest, setOpenSuggest] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    if (topics.length) next.set("topics", topics.join(","));
    setParams(next, { replace: true });
  }, [query, topics, setParams]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpenSuggest(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = useMemo(() => searchEntries(query, topics, kinds), [query, topics, kinds]);
  const suggestions = useMemo<SearchEntry[]>(
    () => (query.trim().length >= 2 ? searchEntries(query, [], []).slice(0, 6) : []),
    [query]
  );

  const toggleTopic = (topic: string) =>
    setTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]));

  const toggleKind = (kind: SearchKind) =>
    setKinds((prev) => (prev.includes(kind) ? prev.filter((k) => k !== kind) : [...prev, kind]));

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!openSuggest || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      navigate(suggestions[highlight].path);
    } else if (e.key === "Escape") {
      setOpenSuggest(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Поиск по урокам и блогу — RL Platform"
        description="Быстрый поиск по урокам курса Reinforcement Learning, практическим проектам и статьям блога с автодополнением и фильтрами по темам."
        path="/search"
      />

      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="text-center mb-8 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">Поиск</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Уроки, проекты и статьи блога — с автодополнением и фильтрами по темам
          </p>
        </div>

        {/* Поле поиска с автодополнением */}
        <div ref={boxRef} className="relative mb-6 max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            autoFocus
            role="combobox"
            aria-expanded={openSuggest && suggestions.length > 0}
            aria-label="Поиск по урокам и блогу"
            placeholder="Например: PPO, ONNX, reward shaping…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpenSuggest(true);
              setHighlight(0);
            }}
            onFocus={() => setOpenSuggest(true)}
            onKeyDown={onKeyDown}
            className="pl-10 pr-10 bg-card/60 border-primary/30 backdrop-blur-sm"
          />
          {query && (
            <button
              aria-label="Очистить поиск"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {openSuggest && suggestions.length > 0 && (
            <ul className="absolute z-40 mt-2 w-full rounded-xl border border-primary/30 bg-card/95 backdrop-blur-sm overflow-hidden shadow-[0_0_25px_hsl(var(--primary)/0.15)]">
              {suggestions.map((s, i) => {
                const Icon = KIND_ICONS[s.kind];
                return (
                  <li key={s.id}>
                    <button
                      onMouseEnter={() => setHighlight(i)}
                      onClick={() => navigate(s.path)}
                      className={cn(
                        "w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors",
                        i === highlight ? "bg-primary/10" : "hover:bg-muted/40"
                      )}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-primary" />
                      <span className="text-sm text-foreground truncate">{s.title}</span>
                      <span className="ml-auto text-[10px] text-muted-foreground shrink-0">
                        {KIND_LABELS[s.kind]}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Фильтр по типу */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {KINDS.map((kind) => (
            <button
              key={kind}
              onClick={() => toggleKind(kind)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full border transition-all",
                kinds.includes(kind)
                  ? KIND_STYLES[kind] + " bg-primary/10"
                  : "border-border/40 text-muted-foreground hover:border-border"
              )}
            >
              {KIND_LABELS[kind]}
            </button>
          ))}
        </div>

        {/* Фильтр по темам */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => setTopics([])}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full border transition-all",
              topics.length === 0
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border/40 text-muted-foreground hover:border-border"
            )}
          >
            Все темы
          </button>
          {SEARCH_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full border transition-all",
                topics.includes(topic)
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border/40 text-muted-foreground hover:border-border"
              )}
            >
              {topic}
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mb-6">
          Найдено: {results.length}
        </p>

        <div className="grid gap-4">
          {results.map((item) => {
            const Icon = KIND_ICONS[item.kind];
            return (
              <Link key={item.id} to={item.path} className="group">
                <Card className="bg-card/60 backdrop-blur-sm border-primary/20 transition-all duration-300 hover:border-primary/50 hover:shadow-glow-cyan">
                  <CardContent className="p-5 space-y-2">
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", KIND_STYLES[item.kind])}>
                            {KIND_LABELS[item.kind]}
                          </span>
                          <span className="text-[11px] text-muted-foreground">{item.meta}</span>
                        </div>
                        <h2 className="font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                          {item.title}
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.topics.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground border border-border/30"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {results.length === 0 && (
          <div className="text-center py-20">
            <Tag className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">Ничего не найдено — попробуйте другой запрос или снимите фильтры</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
