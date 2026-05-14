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
    next: { title: "Урок 2.7", path: "/courses/2-7" },
  },
];

export const getLessonById = (id: string) =>
  LESSONS.find((l) => l.id === id);
