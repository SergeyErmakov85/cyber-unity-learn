import { useState, useMemo } from "react";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, User, Search, X, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  gradient: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "unity-ml-agents-tutorial",
    title: "Unity ML-Agents с нуля: от установки до обученного агента",
    description: "Пошаговый туториал: установка PyTorch и mlagents, сборка сцены в Unity, скрипт агента на C#, reward shaping, конфиг PPO, запуск обучения, чтение метрик в TensorBoard и инференс ONNX-модели в билде. С разбором типичных ошибок.",
    author: "RL Platform",
    date: "2026-08-23",
    readTime: "9 мин",
    tags: ["ML-Agents", "Туториал", "PPO"],
    gradient: "from-accent/40 via-primary/20 to-accent/10",
  },
  {
    slug: "ppo-vs-sac",
    title: "PPO vs SAC: что выбрать для вашего игрового RL-проекта?",
    description: "Подробное сравнение двух самых популярных алгоритмов RL по стабильности, скорости обучения, типу действий и сложности реализации. Таблица и рекомендации по сценариям.",
    author: "RL Platform",
    date: "2026-03-01",
    readTime: "8 мин",
    tags: ["PPO", "SAC", "Сравнение"],
    gradient: "from-primary/40 via-secondary/20 to-primary/10",
  },
  {
    slug: "top-5-mistakes",
    title: "Топ-5 ошибок при обучении агентов в Unity ML-Agents",
    description: "Разбираем самые частые ошибки новичков: неправильный reward, слишком сложная среда, игнорирование нормализации и другие подводные камни.",
    author: "RL Platform",
    date: "2026-02-20",
    readTime: "7 мин",
    tags: ["ML-Agents", "Ошибки", "Практика"],
    gradient: "from-accent/40 via-secondary/20 to-accent/10",
  },
  {
    slug: "parallel-envs",
    title: "Ускорение обучения в 10 раз: параллельные среды и оптимизация",
    description: "Практический гайд по настройке параллельных сред: num_envs, time_scale, выбор GPU vs CPU, оптимизация batch_size для максимальной скорости.",
    author: "RL Platform",
    date: "2026-02-10",
    readTime: "6 мин",
    tags: ["Оптимизация", "ML-Agents", "Performance"],
    gradient: "from-green-500/30 via-primary/20 to-green-500/10",
  },
  {
    slug: "mapoca-guide",
    title: "MA-POCA: кооперативные мультиагентные игры с нуля",
    description: "Введение в Multi-Agent POsthumous Credit Assignment: как настроить команды, групповые награды и Self-Play для кооперативных и конкурентных игр.",
    author: "RL Platform",
    date: "2026-01-28",
    readTime: "9 мин",
    tags: ["MA-POCA", "Multi-Agent", "Unity"],
    gradient: "from-secondary/40 via-accent/20 to-secondary/10",
  },
  {
    slug: "jupyter-to-unity",
    title: "Из Jupyter в Unity: деплой ML-модели за 30 минут",
    description: "Пошаговый гайд: обучение в PyTorch → экспорт ONNX → интеграция Unity Sentis → сборка проекта. Полный цикл за полчаса.",
    author: "RL Platform",
    date: "2026-01-15",
    readTime: "6 мин",
    tags: ["Деплой", "ONNX", "Unity", "PyTorch"],
    gradient: "from-primary/30 via-green-500/20 to-primary/10",
  },
  {
    slug: "gridsensor-guide",
    title: "GridSensor в Unity ML-Agents: полный разбор",
    description: "Как работает GridSensor: каналы, порядок данных, типичная ошибка с 4D тензором (B,C,H,W) и патч для PyTorch. Практический гайд с кодом.",
    author: "RL Platform",
    date: "2026-03-10",
    readTime: "7 мин",
    tags: ["GridSensor", "Unity", "ML-Agents", "PyTorch"],
    gradient: "from-emerald-500/30 via-primary/20 to-emerald-500/10",
  },
  {
    slug: "reinforce-vs-ppo",
    title: "REINFORCE vs PPO: когда достаточно простого алгоритма?",
    description: "Детальное сравнение REINFORCE и PPO по sample efficiency, стабильности и простоте реализации. Когда PPO избыточен и REINFORCE справляется лучше.",
    author: "RL Platform",
    date: "2026-03-15",
    readTime: "9 мин",
    tags: ["REINFORCE", "PPO", "Сравнение", "Policy Gradient"],
    gradient: "from-secondary/40 via-primary/20 to-secondary/10",
  },
  {
    slug: "onnx-sentis-pipeline",
    title: "PyTorch → ONNX → Unity Sentis: пайплайн за 30 минут",
    description: "Пошаговый гайд по экспорту обученной модели из PyTorch в ONNX с UnityONNXWrapper, импорту через Unity Sentis и инференсу в C#. Решение типичных ошибок opset.",
    author: "RL Platform",
    date: "2026-03-20",
    readTime: "8 мин",
    tags: ["ONNX", "Sentis", "Деплой", "PyTorch", "C#"],
    gradient: "from-primary/40 via-accent/20 to-primary/10",
  },
];

const ALL_TAGS = [...new Set(blogPosts.flatMap((p) => p.tags))];
const FEATURED_SLUGS = ["jupyter-to-unity", "onnx-sentis-pipeline", "gridsensor-guide"];

const Blog = () => {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...blogPosts];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (selectedTag) {
      list = list.filter((p) => p.tags.includes(selectedTag));
    }
    return list;
  }, [query, selectedTag]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Блог о Reinforcement Learning и Unity ML-Agents"
        description="Статьи, руководства и сравнения алгоритмов RL: PPO vs SAC, параллельные среды, MA-POCA и многое другое."
        path="/blog"
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
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">Блог</span>
          </h1>
          <p className="text-muted-foreground text-lg">Статьи о Reinforcement Learning, Unity ML-Agents и лучших практиках</p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-lg mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск статей…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-card/60 border-border/50"
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <button
            onClick={() => setSelectedTag(null)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-full border transition-all",
              !selectedTag ? "border-primary/50 bg-primary/10 text-primary" : "border-border/40 text-muted-foreground hover:border-border"
            )}
          >
            Все
          </button>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full border transition-all",
                selectedTag === tag ? "border-primary/50 bg-primary/10 text-primary" : "border-border/40 text-muted-foreground hover:border-border"
              )}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid gap-6">
          {filtered.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group">
              <article className="rounded-xl border border-border/30 bg-card/50 overflow-hidden hover:border-primary/30 hover:shadow-[0_0_25px_hsl(var(--primary)/0.1)] transition-all duration-300">
                <div className={cn("h-32 bg-gradient-to-br", post.gradient, "flex items-end p-5")}>
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-background/60 backdrop-blur-sm text-foreground/80 border border-border/30">
                        {tag}
                      </span>
                    ))}
                    {FEATURED_SLUGS.includes(post.slug) && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                        ★ Рекомендуем
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{post.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>
                    <span>{new Date(post.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Tag className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">Статей не найдено</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Blog;
