export interface LessonMeta {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  level: number;
  isPro: boolean;
  estimatedMinutes: number;
  tags: string[];
  path: string;
  prev?: { title: string; path: string };
  next?: { title: string; path: string };
}

export const LESSONS: LessonMeta[] = [
  {
    id: "2.6",
    title: "Урок 2.6. Визуализация обучения: TensorBoard и W&B",
    subtitle: "Зачем визуализировать обучение и как читать графики RL",
    slug: "tensorboard-wandb",
    level: 2,
    isPro: true,
    estimatedMinutes: 45,
    tags: ["TensorBoard", "Weights & Biases", "Мониторинг", "RL"],
    path: "/courses/2-6",
    prev: { title: "Урок 2.5", path: "/courses/2-5" },
    next: { title: "Проект 2: 3D-охотник", path: "/courses/project-2" },
  },
  {
    id: "3.1",
    title: "SAC — Soft Actor-Critic",
    subtitle: "Максимальная энтропия, off-policy и непрерывное управление",
    slug: "sac",
    level: 3,
    isPro: true,
    estimatedMinutes: 55,
    tags: ["SAC", "Off-policy", "Max-Entropy RL", "Unity ML-Agents"],
    path: "/courses/3-1",
    prev: { title: "Проект 3: Гоночный агент", path: "/courses/project-3" },
    next: { title: "Урок 3.2: MA-POCA и Self-Play", path: "/courses/3-2" },
  },
];

export const getLessonById = (id: string) =>
  LESSONS.find((l) => l.id === id);
