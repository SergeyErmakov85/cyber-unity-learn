import { LEARNING_MAP } from "./learningMap";
import { blogPosts } from "@/pages/Blog";

export type SearchKind = "lesson" | "project" | "blog";

export interface SearchEntry {
  id: string;
  kind: SearchKind;
  title: string;
  description: string;
  path: string;
  topics: string[];
  /** Уровень для уроков / дата для постов */
  meta: string;
}

/** Темы выводятся из заголовка урока — ключ ищется без учёта регистра. */
const TOPIC_KEYWORDS: Record<string, string[]> = {
  "PPO": ["ppo"],
  "SAC": ["sac", "soft actor"],
  "DQN": ["dqn"],
  "Q-Learning": ["q-learning"],
  "MDP": ["mdp", "марков"],
  "Policy Gradient": ["policy gradient", "actor-critic", "непрерывные действия"],
  "Unity": ["unity", "ml-agents", "3d", "гоночный", "охотник"],
  "PyTorch": ["pytorch"],
  "Multi-Agent": ["ma-poca", "self-play", "мультиагент"],
  "Деплой": ["onnx", "деплой"],
  "Практика": ["проект"],
  "Reward": ["reward"],
  "Оптимизация": ["гиперпараметр", "параллельные", "curriculum", "рандомизация", "учебный план"],
  "Нейросети": ["архитектур", "нейросет", "gail", "имитацион"],
  "Мониторинг": ["tensorboard", "w&b"],
  "Основы": ["что такое", "установка", "exploration"],
};

function topicsFromTitle(title: string): string[] {
  const t = title.toLowerCase();
  const found = Object.entries(TOPIC_KEYWORDS)
    .filter(([, keys]) => keys.some((k) => t.includes(k)))
    .map(([topic]) => topic);
  return found.length ? found : ["Основы"];
}

const LESSON_ENTRIES: SearchEntry[] = LEARNING_MAP.flatMap((stage) =>
  stage.lessons.map((lesson) => ({
    id: `${lesson.type}-${lesson.id}`,
    kind: lesson.type === "project" ? ("project" as const) : ("lesson" as const),
    title: lesson.title,
    description: stage.description,
    path: lesson.path,
    topics: topicsFromTitle(lesson.title),
    meta: `Уровень: ${stage.title}`,
  }))
);

const BLOG_ENTRIES: SearchEntry[] = blogPosts.map((post) => ({
  id: `blog-${post.slug}`,
  kind: "blog" as const,
  title: post.title,
  description: post.description,
  path: `/blog/${post.slug}`,
  topics: post.tags,
  meta: new Date(post.date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
}));

export const SEARCH_ENTRIES: SearchEntry[] = [...LESSON_ENTRIES, ...BLOG_ENTRIES];

export const SEARCH_TOPICS: string[] = [
  ...new Set(SEARCH_ENTRIES.flatMap((e) => e.topics)),
].sort((a, b) => a.localeCompare(b, "ru"));

export const KIND_LABELS: Record<SearchKind, string> = {
  lesson: "Урок",
  project: "Проект",
  blog: "Блог",
};

/** Простой скоринг: совпадение в заголовке важнее, чем в описании или теме. */
export function scoreEntry(entry: SearchEntry, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const title = entry.title.toLowerCase();
  let score = 0;
  if (title.startsWith(q)) score += 100;
  if (title.includes(q)) score += 50;
  if (entry.topics.some((t) => t.toLowerCase().includes(q))) score += 25;
  if (entry.description.toLowerCase().includes(q)) score += 10;
  return score;
}

export function searchEntries(query: string, topics: string[], kinds: SearchKind[]): SearchEntry[] {
  const q = query.trim();
  return SEARCH_ENTRIES.filter((e) => {
    if (kinds.length && !kinds.includes(e.kind)) return false;
    if (topics.length && !topics.some((t) => e.topics.includes(t))) return false;
    if (q && scoreEntry(e, q) === 0) return false;
    return true;
  }).sort((a, b) => (q ? scoreEntry(b, q) - scoreEntry(a, q) : a.title.localeCompare(b.title, "ru")));
}
