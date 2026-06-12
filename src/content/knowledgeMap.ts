import {
  Sparkles,
  Brain,
  Wrench,
  Rocket,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";

/**
 * Канонический источник данных для страницы «Карта знаний RL для NPC»
 * (/knowledge-map). Иерархия: корень → ветви → листья-уроки.
 *
 * Каждый лист — кликабельный узел с deep-link на реальную страницу сайта
 * и учебными метаданными (сложность, время изучения, пререквизиты).
 * Не дублируй список уроков — структура согласована с LEARNING_MAP.
 */

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface MapNode {
  id: string;
  label: string;
  /** Внутренняя ссылка на страницу или секцию (deep-link) */
  link: string;
  difficulty: Difficulty;
  /** Оценочное время изучения */
  time: string;
  /** Краткое пояснение для тултипа */
  blurb: string;
  /** id уроков-пререквизитов (из этой же карты) */
  prereq?: string[];
  /** id рекомендованных следующих тем */
  next?: string[];
}

export interface MapBranch {
  id: string;
  label: string;
  /** Подпись-направление ветви */
  caption: string;
  icon: LucideIcon;
  /** Ключ цветовой темы ветви */
  color: BranchColor;
  /** Куда ведёт клик по самой ветви (хаб/раздел) */
  link: string;
  nodes: MapNode[];
}

export type BranchColor = "cyan" | "purple" | "blue" | "pink" | "emerald" | "violet" | "amber";

/** HSL-значения для SVG-коннекторов и свечения (виз-слой). */
export const BRANCH_HSL: Record<BranchColor, string> = {
  cyan: "180 100% 50%",
  purple: "280 100% 60%",
  blue: "220 100% 60%",
  pink: "320 100% 60%",
  emerald: "160 84% 50%",
  violet: "265 90% 65%",
  amber: "38 95% 55%",
};

export const DIFFICULTY_META: Record<
  Difficulty,
  { label: string; hsl: string; dot: string }
> = {
  beginner: { label: "Новичок", hsl: "160 84% 50%", dot: "bg-emerald-400" },
  intermediate: { label: "Средний", hsl: "180 100% 50%", dot: "bg-cyan-400" },
  advanced: { label: "Продвинутый", hsl: "320 100% 60%", dot: "bg-pink-400" },
};

export const ROOT = {
  id: "root",
  label: "RL для NPC",
  caption: "Создание интеллектуальных NPC через обучение с подкреплением",
};

export const KNOWLEDGE_MAP: MapBranch[] = [
  {
    id: "fundamentals",
    label: "Основы RL",
    caption: "Фундамент: теория и первые агенты",
    icon: Sparkles,
    color: "cyan",
    link: "/hub/math-rl",
    nodes: [
      {
        id: "what-is-rl",
        label: "Что такое RL",
        link: "/courses/1-1",
        difficulty: "beginner",
        time: "30 мин",
        blurb: "Агент, среда, награда, цикл взаимодействия.",
        next: ["mdp", "q-learning"],
      },
      {
        id: "mdp",
        label: "MDP",
        link: "/courses/1-3",
        difficulty: "beginner",
        time: "45 мин",
        blurb: "Марковские процессы принятия решений, уравнение Беллмана.",
        prereq: ["what-is-rl"],
        next: ["q-learning"],
      },
      {
        id: "q-learning",
        label: "Q-Learning",
        link: "/courses/1-4",
        difficulty: "beginner",
        time: "1 ч",
        blurb: "Табличный off-policy метод и обновление Q-таблицы.",
        prereq: ["mdp"],
        next: ["dqn"],
      },
      {
        id: "explore-exploit",
        label: "Exploration / Exploitation",
        link: "/courses/1-7",
        difficulty: "beginner",
        time: "40 мин",
        blurb: "ε-greedy, дилемма исследования и использования.",
        prereq: ["q-learning"],
      },
      {
        id: "math-rl",
        label: "Математика RL",
        link: "/hub/math-rl",
        difficulty: "intermediate",
        time: "хаб",
        blurb: "Вероятности, MDP, Беллман, градиенты политик.",
        prereq: ["mdp"],
      },
    ],
  },
  {
    id: "deep-rl",
    label: "Глубокое RL",
    caption: "Нейросети и policy-методы",
    icon: Brain,
    color: "purple",
    link: "/hub/deep-rl",
    nodes: [
      {
        id: "dqn",
        label: "DQN",
        link: "/courses/1-6",
        difficulty: "intermediate",
        time: "1.5 ч",
        blurb: "Deep Q-Network: replay buffer и target network.",
        prereq: ["q-learning"],
        next: ["policy-gradient"],
      },
      {
        id: "policy-gradient",
        label: "Policy Gradient",
        link: "/courses/2-1",
        difficulty: "intermediate",
        time: "1.5 ч",
        blurb: "Теорема градиента политики, REINFORCE.",
        prereq: ["dqn"],
        next: ["ppo"],
      },
      {
        id: "ppo",
        label: "PPO",
        link: "/courses/2-2",
        difficulty: "intermediate",
        time: "2 ч",
        blurb: "Clipped objective — стандарт ML-Agents.",
        prereq: ["policy-gradient"],
        next: ["actor-critic", "sac"],
      },
      {
        id: "actor-critic",
        label: "Actor-Critic",
        link: "/courses/2-3",
        difficulty: "intermediate",
        time: "1.5 ч",
        blurb: "Непрерывные действия, advantage-оценка.",
        prereq: ["ppo"],
        next: ["sac"],
      },
      {
        id: "sac",
        label: "SAC",
        link: "/courses/3-1",
        difficulty: "advanced",
        time: "2 ч",
        blurb: "Soft Actor-Critic с максимизацией энтропии.",
        prereq: ["actor-critic"],
      },
    ],
  },
  {
    id: "tools",
    label: "Инструменты и среды",
    caption: "Стек, среды, мониторинг, деплой",
    icon: Wrench,
    color: "blue",
    link: "/hub/unity-ml-agents",
    nodes: [
      {
        id: "pytorch",
        label: "PyTorch",
        link: "/hub/pytorch",
        difficulty: "beginner",
        time: "хаб",
        blurb: "Тензоры, autograd, нейросети, оптимизация.",
      },
      {
        id: "unity-ml-agents",
        label: "Unity ML-Agents",
        link: "/hub/unity-ml-agents",
        difficulty: "beginner",
        time: "хаб",
        blurb: "Среды, сенсоры и тренировка агентов в Unity.",
      },
      {
        id: "setup",
        label: "Установка окружения",
        link: "/courses/1-2",
        difficulty: "beginner",
        time: "45 мин",
        blurb: "PyTorch + Unity ML-Agents с нуля.",
        next: ["unity-ml-agents"],
      },
      {
        id: "parallel-envs",
        label: "Параллельные среды",
        link: "/courses/2-5",
        difficulty: "intermediate",
        time: "1 ч",
        blurb: "Векторизация и ускорение сбора опыта.",
        prereq: ["ppo"],
      },
      {
        id: "monitoring",
        label: "TensorBoard и W&B",
        link: "/courses/2-6",
        difficulty: "intermediate",
        time: "1 ч",
        blurb: "Метрики, графики и диагностика обучения.",
      },
      {
        id: "onnx",
        label: "Деплой: ONNX",
        link: "/courses/3-5",
        difficulty: "advanced",
        time: "1.5 ч",
        blurb: "Экспорт модели и инференс в Unity Sentis.",
        prereq: ["sac"],
      },
    ],
  },
  {
    id: "advanced",
    label: "Продвинутые темы",
    caption: "Reward, мультиагентность, обучение",
    icon: FlaskConical,
    color: "pink",
    link: "/advanced",
    nodes: [
      {
        id: "reward-shaping",
        label: "Reward Shaping",
        link: "/courses/2-4",
        difficulty: "intermediate",
        time: "1 ч",
        blurb: "Дизайн награды — ключ к поведению NPC.",
        prereq: ["ppo"],
      },
      {
        id: "multi-agent",
        label: "Multi-Agent / Self-Play",
        link: "/courses/3-2",
        difficulty: "advanced",
        time: "2 ч",
        blurb: "MA-POCA и self-play для соревнующихся NPC.",
        prereq: ["ppo"],
      },
      {
        id: "curriculum",
        label: "Curriculum Learning",
        link: "/courses/3-3",
        difficulty: "advanced",
        time: "1.5 ч",
        blurb: "Постепенное усложнение задачи для агента.",
        prereq: ["reward-shaping"],
      },
      {
        id: "gail",
        label: "Imitation Learning (GAIL)",
        link: "/courses/3-4",
        difficulty: "advanced",
        time: "2 ч",
        blurb: "Обучение по демонстрациям эксперта.",
        prereq: ["ppo"],
      },
      {
        id: "hyperopt",
        label: "Гиперпараметры",
        link: "/courses/3-6",
        difficulty: "advanced",
        time: "1.5 ч",
        blurb: "Тюнинг и оптимизация гиперпараметров.",
        prereq: ["ppo"],
      },
      {
        id: "nn-arch",
        label: "Архитектуры нейросетей",
        link: "/courses/3-7",
        difficulty: "advanced",
        time: "1.5 ч",
        blurb: "Выбор сети под наблюдения агента.",
        prereq: ["dqn"],
      },
    ],
  },
  {
    id: "projects",
    label: "Практика и проекты",
    caption: "От CartPole до игрового NPC",
    icon: Rocket,
    color: "emerald",
    link: "/unity-projects",
    nodes: [
      {
        id: "cartpole",
        label: "CartPole",
        link: "/courses/1-5",
        difficulty: "beginner",
        time: "1 ч",
        blurb: "Первый RL-агент в Gym.",
        prereq: ["q-learning"],
      },
      {
        id: "project-1",
        label: "Баланс в 3D",
        link: "/courses/project-1",
        difficulty: "beginner",
        time: "проект",
        blurb: "Первый агент в Unity ML-Agents.",
        prereq: ["cartpole", "unity-ml-agents"],
      },
      {
        id: "project-2",
        label: "3D-охотник",
        link: "/courses/project-2",
        difficulty: "intermediate",
        time: "проект",
        blurb: "Навигация и преследование цели.",
        prereq: ["ppo"],
      },
      {
        id: "project-3",
        label: "Гоночный агент",
        link: "/courses/project-3",
        difficulty: "intermediate",
        time: "проект",
        blurb: "Автономное вождение с raycast-сенсорами.",
        prereq: ["actor-critic"],
      },
      {
        id: "final-project",
        label: "Игра с NPC",
        link: "/courses/3-8",
        difficulty: "advanced",
        time: "финал",
        blurb: "Полноценный интеллектуальный NPC в игре.",
        prereq: ["sac", "multi-agent"],
      },
    ],
  },
];

/** Линейная дорожная карта: рекомендованная последовательность изучения. */
export const ROADMAP: { phase: string; color: BranchColor; ids: string[] }[] = [
  { phase: "Фаза 1 · Фундамент", color: "cyan", ids: ["what-is-rl", "setup", "mdp", "q-learning", "explore-exploit", "cartpole"] },
  { phase: "Фаза 2 · Первый агент", color: "emerald", ids: ["pytorch", "unity-ml-agents", "dqn", "project-1"] },
  { phase: "Фаза 3 · Policy-методы", color: "purple", ids: ["policy-gradient", "ppo", "actor-critic", "reward-shaping", "monitoring", "project-2"] },
  { phase: "Фаза 4 · Масштаб и продакшен", color: "blue", ids: ["parallel-envs", "sac", "project-3", "hyperopt", "onnx"] },
  { phase: "Фаза 5 · Экспертные техники", color: "pink", ids: ["multi-agent", "curriculum", "gail", "nn-arch", "final-project"] },
];

/** Анализ пробелов: важные темы, которых пока нет на сайте. */
export const KNOWLEDGE_GAPS: { title: string; items: string[] }[] = [
  {
    title: "RL-концепции",
    items: [
      "Model-based RL (Dreamer, MuZero)",
      "Offline / Batch RL",
      "Distributional RL (C51, QR-DQN)",
    ],
  },
  {
    title: "NPC-специфика",
    items: [
      "GOAP и Behavior Trees как гибрид с RL",
      "Social / Dialogue AI для NPC",
      "Combat AI: тактика и кооперация",
    ],
  },
  {
    title: "Практика и инференс",
    items: [
      "Профилирование и оптимизация инференса на устройстве",
      "A/B-тестирование поведения NPC в проде",
      "Воспроизводимость и фиксация сидов",
    ],
  },
];

export function getCoverageReport() {
  const totalNodes = KNOWLEDGE_MAP.reduce((s, b) => s + b.nodes.length, 0);
  const branches = KNOWLEDGE_MAP.length;
  const gaps = KNOWLEDGE_GAPS.reduce((s, g) => s + g.items.length, 0);
  return { branches, totalNodes, links: totalNodes + branches, gaps };
}

/** Плоский индекс узлов по id (для пререквизитов и поиска). */
export const NODE_INDEX: Record<string, { node: MapNode; branch: MapBranch }> = (() => {
  const idx: Record<string, { node: MapNode; branch: MapBranch }> = {};
  for (const branch of KNOWLEDGE_MAP) {
    for (const node of branch.nodes) idx[node.id] = { node, branch };
  }
  return idx;
})();
