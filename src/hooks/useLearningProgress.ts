import { useCallback, useSyncExternalStore } from "react";
import { LEARNING_MAP } from "@/content/learningMap";
import { markLessonComplete } from "@/lib/gamification";

const STORAGE_KEY = "rl-platform-completed-lessons";

// All lesson slugs in sequential order (lessons only — projects aren't sequentially gated)
const ALL_SLUGS = LEARNING_MAP.flatMap((s) =>
  s.lessons.filter((l) => l.type === "lesson").map((l) => l.slug),
);

// slug -> /courses/<id> for cross-syncing with gamification store
const SLUG_TO_PATH: Record<string, string> = Object.fromEntries(
  LEARNING_MAP.flatMap((s) => s.lessons.map((l) => [l.slug, l.path] as const)),
);

function getSnapshot(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

// Simple pub/sub so multiple components stay in sync
let listeners: Array<() => void> = [];
function subscribe(cb: () => void) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}
function emit() {
  listeners.forEach((l) => l());
}

function save(slugs: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  emit();
}

// Stable snapshot reference (react requires referential equality between renders if unchanged)
let cached: string[] = [];
function stableSnapshot(): string[] {
  const next = getSnapshot();
  if (
    next.length === cached.length &&
    next.every((s, i) => s === cached[i])
  ) {
    return cached;
  }
  cached = next;
  return cached;
}

export type LessonStatus = "completed" | "current" | "locked";

export function useLearningProgress(isAdmin = false) {
  const completed = useSyncExternalStore(subscribe, stableSnapshot, () => []);

  const completeLesson = useCallback((slug: string) => {
    const current = getSnapshot();
    if (!current.includes(slug)) {
      save([...current, slug]);
    }
  }, []);

  const resetProgress = useCallback(() => {
    save([]);
  }, []);

  /** Determine status of any lesson slug */
  const getStatus = useCallback(
    (slug: string): LessonStatus => {
      if (isAdmin) return completed.includes(slug) ? "completed" : "current";
      if (completed.includes(slug)) return "completed";
      const idx = ALL_SLUGS.indexOf(slug);
      if (idx === 0) return "current";
      const prev = ALL_SLUGS[idx - 1];
      if (prev && completed.includes(prev)) return "current";
      return "locked";
    },
    [completed, isAdmin],
  );

  /** Get next lesson slug after completing `slug`, or null if last */
  const getNextSlug = useCallback((slug: string): string | null => {
    const idx = ALL_SLUGS.indexOf(slug);
    return idx >= 0 && idx < ALL_SLUGS.length - 1 ? ALL_SLUGS[idx + 1] : null;
  }, []);

  return { completed, completeLesson, resetProgress, getStatus, getNextSlug };
}
