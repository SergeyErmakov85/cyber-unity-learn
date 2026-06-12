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
  {
    id: "3.2",
    title: "Многоагентное обучение: MA-POCA и Self-Play",
    subtitle:
      "Нестационарность, CTDE, counterfactual baseline, posthumous credit assignment и Self-Play с рейтингом ELO",
    slug: "marl-mapoca-selfplay",
    level: 3,
    isPro: true,
    estimatedMinutes: 50,
    tags: ["MA-POCA", "Self-Play", "MARL", "CTDE", "Unity ML-Agents"],
    path: "/courses/3-2",
    prev: { title: "Урок 3.1: SAC", path: "/courses/3-1" },
    next: { title: "Урок 3.3: Curriculum Learning", path: "/courses/3-3" },
  },
  {
    id: "3.3",
    title: "Учебный план и рандомизация среды",
    subtitle:
      "Curriculum learning, рандомизация среды, ADR, PLR и UED: как учить агента трудному и обобщать на новые миры",
    slug: "curriculum-randomization",
    level: 3,
    isPro: true,
    estimatedMinutes: 45,
    tags: ["Curriculum Learning", "Domain Randomization", "ADR", "PLR", "UED", "Unity ML-Agents"],
    path: "/courses/3-3",
    prev: { title: "Урок 3.2: MA-POCA и Self-Play", path: "/courses/3-2" },
    next: { title: "Урок 3.4: Имитационное обучение (GAIL)", path: "/courses/3-4" },
  },
  {
    id: "3.4",
    title: "Imitation Learning: Behavioral Cloning и GAIL",
    subtitle:
      "Поведенческое клонирование, IRL и GAIL: от теоремы Ross & Bagnell до полного YAML-конфига ML-Agents 4.0",
    slug: "imitation-learning-gail",
    level: 3,
    isPro: true,
    estimatedMinutes: 50,
    tags: ["Imitation Learning", "GAIL", "Behavioral Cloning", "AIRL", "Unity ML-Agents"],
    path: "/courses/3-4",
    prev: { title: "Урок 3.3: Учебный план и рандомизация", path: "/courses/3-3" },
    next: { title: "Урок 3.5: Деплой модели", path: "/courses/3-5" },
  },
  {
    id: "3.5",
    title: "Деплой модели: ONNX-экспорт и интеграция в Unity-сборку",
    subtitle:
      "ONNX, Unity Inference Engine, Behavior Parameters, DecisionRequester, IL2CPP-билд и диагностика рассинхрона наблюдений на гоночном агенте",
    slug: "onnx-deploy",
    level: 3,
    isPro: true,
    estimatedMinutes: 40,
    tags: ["ONNX", "Unity Sentis", "Inference Engine", "Деплой", "Unity ML-Agents"],
    path: "/courses/3-5",
    prev: { title: "Урок 3.4: Imitation Learning (BC и GAIL)", path: "/courses/3-4" },
    next: { title: "Урок 3.6: Оптимизация гиперпараметров", path: "/courses/3-6" },
  },
  {
    id: "3.6",
    title: "Урок 3.6. Оптимизация гиперпараметров: Optuna + W&B",
    subtitle:
      "Формализация HPO, grid/random, байесовская оптимизация и TPE, прунинг (SHA/ASHA/Hyperband); Optuna и W&B Sweeps на сквозном примере гоночного агента",
    slug: "hyperopt-optuna-wandb",
    level: 3,
    isPro: true,
    estimatedMinutes: 55,
    tags: ["HPO", "Optuna", "Weights & Biases", "TPE", "Hyperband", "Unity ML-Agents"],
    path: "/courses/3-6",
    prev: { title: "Урок 3.5: Деплой модели", path: "/courses/3-5" },
    next: { title: "Урок 3.7: Архитектуры нейросетей", path: "/courses/3-7" },
  },
];

export const getLessonById = (id: string) =>
  LESSONS.find((l) => l.id === id);
