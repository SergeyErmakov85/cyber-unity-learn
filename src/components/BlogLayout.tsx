import { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, User, ChevronRight } from "lucide-react";
import { blogPosts, BlogPost } from "@/pages/Blog";
import SEOHead from "@/components/SEOHead";

interface BlogLayoutProps {
  post: BlogPost;
  toc: { id: string; title: string }[];
  children: ReactNode;
}

const BlogLayout = ({ post, toc, children }: BlogLayoutProps) => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title={`${post.title} | RL Blog`}
      description={post.description}
      path={`/blog/${post.slug}`}
      type="article"
      keywords={post.tags.join(", ")}
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        author: { "@type": "Person", name: post.author },
        publisher: { "@type": "Organization", name: "CyberUnityCode" },
        inLanguage: "ru",
        keywords: post.tags.join(", "),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://rl-cuber-unity-code.com/blog/${post.slug}`,
        },
      }}
    />

    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex items-center gap-2 text-sm">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          Главная
        </Link>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
        <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
          Блог
        </Link>
        <ChevronRight className="w-3 h-3 text-muted-foreground" />
        <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
      </div>
    </header>

    <main className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Meta */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{t}</span>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{post.author}</span>
          <span>{new Date(post.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
        </div>
      </div>

      {/* TOC */}
      <nav className="mb-10 p-4 rounded-lg border border-border/30 bg-card/40">
        <h3 className="text-sm font-semibold text-foreground mb-2">Содержание</h3>
        <ul className="space-y-1.5">
          {toc.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                <ChevronRight className="w-3 h-3" />{item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content */}
      <article className="prose-cyber space-y-6">{children}</article>

      {/* Links section */}
      <div className="mt-12 p-5 rounded-lg border border-primary/20 bg-card/40 space-y-3">
        <h3 className="font-semibold text-foreground">Полезные ссылки</h3>
        <ul className="space-y-1.5 text-sm">
          <li><Link to="/courses" className="text-primary hover:underline">Курс по RL: от новичка до эксперта →</Link></li>
          <li><Link to="/code-examples" className="text-primary hover:underline">Библиотека готового кода →</Link></li>
          <li><Link to="/algorithms" className="text-primary hover:underline">Алгоритмы RL: PPO, SAC, DQN →</Link></li>
        </ul>
      </div>

      {/* Nav */}
      <div className="mt-8 text-center">
        <Link to="/blog" className="text-sm text-primary hover:underline">← Все статьи</Link>
      </div>
    </main>
  </div>
);

export default BlogLayout;
