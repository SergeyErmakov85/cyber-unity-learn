// ==================== XP & Progress System ====================

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  unlockedAt?: string; // ISO date
}

export interface UserProgress {
  xp: number;
  completedLessons: string[]; // lesson paths
  completedQuizzes: Record<string, number>; // path -> score (0-100)
  completedProjects: string[];
  streak: number;
  lastVisitDate: string; // YYYY-MM-DD
  firstVisitDate: string;
  badges: Badge[];
}

const STORAGE_KEY = "rl_platform_progress";

const defaultProgress: UserProgress = {
  xp: 0,
  completedLessons: [],
  completedQuizzes: {},
  completedProjects: [],
  streak: 0,
  lastVisitDate: "",
  firstVisitDate: "",
  badges: [],
};

export const ALL_BADGES: Badge[] = [
  { id: "first_step", name: "Первый шаг", description: "Завершить Урок 1.1", icon: "👣" },
  { id: "hello_rl", name: "Hello RL", description: "Завершить Уровень 1", icon: "🎓" },
  { id: "ppo_master", name: "PPO Мастер", description: "Завершить Урок 2.2 + quiz на 100%", icon: "🏆" },
  { id: "multi_agent", name: "Multi-Agent Architect", description: "Завершить Урок 3.2", icon: "🧠" },
  { id: "full_stack_rl", name: "Full Stack RL", description: "Завершить все уровни", icon: "⭐" },
  { id: "speedrunner", name: "Speedrunner", description: "Завершить курс за 14 дней", icon: "⚡" },
  { id: "streak_7", name: "Streak-7", description: "7 дней подряд", icon: "🔥" },
];

const level1Paths = ["/courses/1-1", "/courses/1-2", "/courses/1-3", "/courses/1-4", "/courses/1-5", "/courses/1-6", "/courses/1-7"];
const level2Paths = ["/courses/2-1", "/courses/2-2", "/courses/2-3", "/courses/2-4", "/courses/2-5", "/courses/2-6"];
const level3Paths = ["/courses/3-1", "/courses/3-2", "/courses/3-3", "/courses/3-4", "/courses/3-5", "/courses/3-6", "/courses/3-7"];
const allLessonPaths = [...level1Paths, ...level2Paths, ...level3Paths];

export function getProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultProgress, ...JSON.parse(raw) };
  } catch (_e) {
    // localStorage недоступен или данные повреждены — возвращаем дефолт
  }
  return { ...defaultProgress };
}

function save(p: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  window.dispatchEvent(new CustomEvent("progress-updated"));
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  return Math.floor((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

export function checkStreak(): number {
  const p = getProgress();
  const t = today();
  if (p.lastVisitDate === t) return 0; // already counted today

  if (!p.firstVisitDate) p.firstVisitDate = t;

  let xpGained = 0;
  if (p.lastVisitDate && daysBetween(p.lastVisitDate, t) === 1) {
    p.streak += 1;
    xpGained = 20;
    p.xp += 20;
  } else if (p.lastVisitDate !== t) {
    p.streak = 1;
    xpGained = 20;
    p.xp += 20;
  }
  p.lastVisitDate = t;
  const newBadges = checkBadges(p);
  save(p);
  return xpGained;
}

export function completeLesson(path: string): { xp: number; newBadges: Badge[] } {
  const p = getProgress();
  if (p.completedLessons.includes(path)) return { xp: 0, newBadges: [] };
  p.completedLessons.push(path);
  p.xp += 50;
  const newBadges = checkBadges(p);
  save(p);
  // Mirror into slug-based store (useLearningProgress) for sequential unlocking
  syncSlugStoreFromPath(path);
  return { xp: 50, newBadges };
}

export function completeQuiz(lessonPath: string, perfect: boolean): { xp: number; newBadges: Badge[] } {
  const p = getProgress();
  const prevScore = p.completedQuizzes[lessonPath] || 0;
  const score = perfect ? 100 : 50;
  if (prevScore >= score) return { xp: 0, newBadges: [] };

  const xpGain = perfect ? 100 : 30;
  p.completedQuizzes[lessonPath] = score;
  p.xp += xpGain;
  const newBadges = checkBadges(p);
  save(p);
  return { xp: xpGain, newBadges };
}

export function completeProject(path: string): { xp: number; newBadges: Badge[] } {
  const p = getProgress();
  if (p.completedProjects.includes(path)) return { xp: 0, newBadges: [] };
  p.completedProjects.push(path);
  p.xp += 200;
  const newBadges = checkBadges(p);
  save(p);
  return { xp: 200, newBadges };
}

export function getLevel(xp: number): number {
  return Math.floor(xp / 500) + 1;
}

export function getLevelProgress(xp: number): number {
  return (xp % 500) / 500 * 100;
}

export function getLevelCompletionPercent(levelIndex: number): number {
  const p = getProgress();
  const paths = levelIndex === 0 ? level1Paths : levelIndex === 1 ? level2Paths : level3Paths;
  const done = paths.filter((path) => p.completedLessons.includes(path)).length;
  return Math.round((done / paths.length) * 100);
}

function checkBadges(p: UserProgress): Badge[] {
  const newBadges: Badge[] = [];
  const has = (id: string) => p.badges.some((b) => b.id === id);
  const grant = (id: string) => {
    if (has(id)) return;
    const badge = ALL_BADGES.find((b) => b.id === id);
    if (badge) {
      const b = { ...badge, unlockedAt: new Date().toISOString() };
      p.badges.push(b);
      newBadges.push(b);
    }
  };

  if (p.completedLessons.includes("/courses/1-1")) grant("first_step");
  if (level1Paths.every((path) => p.completedLessons.includes(path))) grant("hello_rl");
  if (p.completedLessons.includes("/courses/2-2") && p.completedQuizzes["/courses/2-2"] === 100) grant("ppo_master");
  if (p.completedLessons.includes("/courses/3-2")) grant("multi_agent");
  if (allLessonPaths.every((path) => p.completedLessons.includes(path))) grant("full_stack_rl");
  if (p.streak >= 7) grant("streak_7");

  // Speedrunner: all lessons within 14 days
  if (p.firstVisitDate && allLessonPaths.every((path) => p.completedLessons.includes(path))) {
    if (daysBetween(p.firstVisitDate, today()) <= 14) grant("speedrunner");
  }

  return newBadges;
}

// Leaderboard mock data
export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  badges: number;
  avatar: string;
}

export function getMockLeaderboard(): LeaderboardEntry[] {
  return [
    { rank: 1, name: "Alex_RL", xp: 4200, badges: 6, avatar: "🤖" },
    { rank: 2, name: "NeuralNinja", xp: 3850, badges: 5, avatar: "🧠" },
    { rank: 3, name: "PolicyGrad", xp: 3400, badges: 5, avatar: "🎯" },
    { rank: 4, name: "RewardHacker", xp: 2900, badges: 4, avatar: "⚡" },
    { rank: 5, name: "DeepAgent", xp: 2650, badges: 4, avatar: "🕹️" },
    { rank: 6, name: "RL_Explorer", xp: 2100, badges: 3, avatar: "🔍" },
    { rank: 7, name: "Q_Learner", xp: 1800, badges: 3, avatar: "📊" },
    { rank: 8, name: "GradientDev", xp: 1500, badges: 2, avatar: "💻" },
    { rank: 9, name: "EnvBuilder", xp: 1200, badges: 2, avatar: "🏗️" },
    { rank: 10, name: "CuriousBot", xp: 800, badges: 1, avatar: "🤔" },
  ];
}

// ==================== Lesson Completion Helper ====================
// Accepts either "/courses/2-6" or "2-6" / "2.6" lesson ids and marks lesson complete.
export function markLessonComplete(lessonIdOrPath: string): { xp: number; newBadges: Badge[] } {
  let path = lessonIdOrPath;
  if (!path.startsWith("/courses/")) {
    path = `/courses/${path.replace(".", "-")}`;
  }
  return completeLesson(path);
}

export function isLessonComplete(lessonIdOrPath: string): boolean {
  let path = lessonIdOrPath;
  if (!path.startsWith("/courses/")) {
    path = `/courses/${path.replace(".", "-")}`;
  }
  return getProgress().completedLessons.includes(path);
}
