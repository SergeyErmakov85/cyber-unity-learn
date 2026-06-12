import { LESSON_CONTEXT_LINKS, type ContextLink } from "./lessonContextLinks";

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  type: "lesson" | "project";
  path: string;
  contextLinks: ContextLink[];
}

export interface Stage {
  id: string;
  slug: string;
  title: string;
  description: string;
  tag: string;
  weeks: number;
  lessons: Lesson[];
}

function linksFor(slug: string): ContextLink[] {
  return LESSON_CONTEXT_LINKS[slug] ?? [];
}

export const LEARNING_MAP: Stage[] = [
  {
    id: "stage-1",
    slug: "stage-1",
    title: "Новичок",
    description: "Фундамент: теория, окружение, первый агент, базовые алгоритмы и стратегии исследования.",
    tag: "FREE",
    weeks: 6,
    lessons: [
      { id: "1-1", slug: "basics-rl", title: "Что такое обучение с подкреплением?", type: "lesson", path: "/courses/1-1", contextLinks: linksFor("basics-rl") },
      { id: "1-2", slug: "setup-pytorch-unity", title: "Установка окружения: PyTorch + Unity ML-Agents", type: "lesson", path: "/courses/1-2", contextLinks: linksFor("setup-pytorch-unity") },
      { id: "1-3", slug: "mdp", title: "Марковские процессы принятия решений (MDP)", type: "lesson", path: "/courses/1-3", contextLinks: linksFor("mdp") },
      { id: "1-4", slug: "q-learning-tabular", title: "Q-Learning: табличный метод", type: "lesson", path: "/courses/1-4", contextLinks: linksFor("q-learning-tabular") },
      { id: "1-5", slug: "cartpole", title: "CartPole — твой первый RL-агент", type: "lesson", path: "/courses/1-5", contextLinks: linksFor("cartpole") },
      { id: "1-6", slug: "basic-dqn", title: "DQN с нуля на PyTorch", type: "lesson", path: "/courses/1-6", contextLinks: linksFor("basic-dqn") },
      { id: "1-7", slug: "exploration-exploitation", title: "Exploration vs Exploitation", type: "lesson", path: "/courses/1-7", contextLinks: linksFor("exploration-exploitation") },
      { id: "p-1", slug: "project-1", title: 'Проект-1: "Баланс в 3D"', type: "project", path: "/courses/project-1", contextLinks: linksFor("project-1") },
    ],
  },
  {
    id: "stage-2",
    slug: "stage-2",
    title: "Средний",
    description: "Policy Gradient, PPO, непрерывные действия, параллельные среды и мониторинг.",
    tag: "PRO",
    weeks: 6,
    lessons: [
      { id: "2-1", slug: "policy-gradient", title: "Policy Gradient и теорема градиента", type: "lesson", path: "/courses/2-1", contextLinks: linksFor("policy-gradient") },
      { id: "2-2", slug: "ppo", title: "PPO — реализация с нуля", type: "lesson", path: "/courses/2-2", contextLinks: linksFor("ppo") },
      { id: "2-3", slug: "continuous-actions", title: "Непрерывные действия и Actor-Critic", type: "lesson", path: "/courses/2-3", contextLinks: linksFor("continuous-actions") },
      { id: "2-4", slug: "reward-shaping", title: "Reward Shaping", type: "lesson", path: "/courses/2-4", contextLinks: linksFor("reward-shaping") },
      { id: "2-5", slug: "parallel-envs", title: "Параллельные среды", type: "lesson", path: "/courses/2-5", contextLinks: linksFor("parallel-envs") },
      { id: "2-6", slug: "tensorboard-wandb", title: "TensorBoard и W&B", type: "lesson", path: "/courses/2-6", contextLinks: linksFor("tensorboard-wandb") },
      { id: "p-2", slug: "project-2", title: "Проект: 3D-охотник", type: "project", path: "/courses/project-2", contextLinks: linksFor("project-2") },
      { id: "p-3", slug: "project-3", title: "Проект: Гоночный агент", type: "project", path: "/courses/project-3", contextLinks: linksFor("project-3") },
    ],
  },
  {
    id: "stage-3",
    slug: "stage-3",
    title: "Продвинутый",
    description: "SAC, мультиагентные системы, curriculum learning, GAIL, деплой и архитектуры.",
    tag: "PRO",
    weeks: 8,
    lessons: [
      { id: "3-1", slug: "sac", title: "SAC — Soft Actor-Critic", type: "lesson", path: "/courses/3-1", contextLinks: linksFor("sac") },
      { id: "3-2", slug: "multi-agent", title: "MA-POCA и Self-Play", type: "lesson", path: "/courses/3-2", contextLinks: linksFor("multi-agent") },
      { id: "3-3", slug: "curriculum-learning", title: "Учебный план и рандомизация среды", type: "lesson", path: "/courses/3-3", contextLinks: linksFor("curriculum-learning") },
      { id: "3-4", slug: "gail", title: "Имитационное обучение (GAIL)", type: "lesson", path: "/courses/3-4", contextLinks: linksFor("gail") },
      { id: "3-5", slug: "onnx-deploy", title: "Деплой модели: ONNX-экспорт и интеграция в Unity-сборку", type: "lesson", path: "/courses/3-5", contextLinks: linksFor("onnx-deploy") },
      { id: "3-6", slug: "hyperopt", title: "Оптимизация гиперпараметров", type: "lesson", path: "/courses/3-6", contextLinks: linksFor("hyperopt") },
      { id: "3-7", slug: "nn-architectures", title: "Архитектуры нейросетей", type: "lesson", path: "/courses/3-7", contextLinks: linksFor("nn-architectures") },
      { id: "3-8", slug: "final-project-game", title: "Финальный проект", type: "lesson", path: "/courses/3-8", contextLinks: linksFor("final-project-game") },
      
    ],
  },
];

/** Total stats for the learning map */
export function getLearningMapStats() {
  const totalLessons = LEARNING_MAP.reduce((sum, s) => sum + s.lessons.filter(l => l.type === "lesson").length, 0);
  const totalProjects = LEARNING_MAP.reduce((sum, s) => sum + s.lessons.filter(l => l.type === "project").length, 0);
  const totalWeeks = LEARNING_MAP.reduce((sum, s) => sum + s.weeks, 0);
  return { stages: LEARNING_MAP.length, totalLessons, totalProjects, totalWeeks };
}
