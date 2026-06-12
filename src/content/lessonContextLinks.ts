import type { HubId } from "./hubs";

export type LinkPlacement =
  | "after-intro"
  | "after-core-explanation"
  | "after-code"
  | "lesson-end";

export interface ContextLink {
  hubId: HubId;
  placement: LinkPlacement;
  title: string;
  whyThisNow: string;
  ctaLabel: string;
  isPrimary: boolean;
}

/**
 * Maps lessonSlug → array of contextual hub links shown inside lesson pages.
 */
export const LESSON_CONTEXT_LINKS: Record<string, ContextLink[]> = {
  /* ── Stage 1 ── */
  "basics-rl": [
    {
      hubId: "math-rl",
      placement: "after-intro",
      title: "Математика за MDP",
      whyThisNow: "Чтобы понять награды и переходы, полезно знать основы вероятностей.",
      ctaLabel: "Открыть математику",
      isPrimary: false,
    },
    {
      hubId: "deep-rl",
      placement: "after-core-explanation",
      title: "Введение в Deep RL",
      whyThisNow: "Базовые концепции RL — фундамент для всех последующих алгоритмов.",
      ctaLabel: "Deep RL хаб",
      isPrimary: true,
    },
  ],
  "setup-pytorch-unity": [
    {
      hubId: "pytorch",
      placement: "after-core-explanation",
      title: "Шпаргалка PyTorch",
      whyThisNow: "Здесь мы устанавливаем PyTorch — загляните в хаб за справкой по тензорам.",
      ctaLabel: "PyTorch хаб",
      isPrimary: true,
    },
    {
      hubId: "unity-ml-agents",
      placement: "after-code",
      title: "Настройка Unity ML-Agents",
      whyThisNow: "Параллельно настраиваем Unity — подробности в хабе.",
      ctaLabel: "Unity хаб",
      isPrimary: true,
    },
  ],
  "cartpole": [
    {
      hubId: "pytorch",
      placement: "after-code",
      title: "Нейросеть в PyTorch",
      whyThisNow: "CartPole использует простую нейросеть — повторите основы nn.Module.",
      ctaLabel: "Повторить PyTorch",
      isPrimary: false,
    },
    {
      hubId: "project",
      placement: "lesson-end",
      title: "Проект: CartPole",
      whyThisNow: "Закрепите знания в самостоятельном проекте.",
      ctaLabel: "К проекту",
      isPrimary: true,
    },
  ],
  "basic-dqn": [
    {
      hubId: "deep-rl",
      placement: "after-core-explanation",
      title: "Теория DQN",
      whyThisNow: "Глубже разберём experience replay и target network.",
      ctaLabel: "Deep RL хаб",
      isPrimary: true,
    },
    {
      hubId: "math-rl",
      placement: "after-intro",
      title: "Уравнение Беллмана",
      whyThisNow: "DQN опирается на уравнение Беллмана — освежите формулу.",
      ctaLabel: "К математике",
      isPrimary: false,
    },
    {
      hubId: "pytorch",
      placement: "after-code",
      title: "nn.Module и оптимизатор",
      whyThisNow: "DQN строится на nn.Module — повторите архитектуру сети.",
      ctaLabel: "PyTorch хаб",
      isPrimary: false,
    },
  ],
  "mdp": [
    {
      hubId: "math-rl",
      placement: "after-core-explanation",
      title: "Формализация MDP",
      whyThisNow: "Марковское свойство, переходы, дисконтирование — вся математика здесь.",
      ctaLabel: "Математика RL",
      isPrimary: true,
    },
    {
      hubId: "deep-rl",
      placement: "after-intro",
      title: "MDP в контексте RL",
      whyThisNow: "MDP — основа всех алгоритмов обучения с подкреплением.",
      ctaLabel: "Deep RL хаб",
      isPrimary: true,
    },
  ],
  "q-learning-tabular": [
    {
      hubId: "deep-rl",
      placement: "after-core-explanation",
      title: "От таблицы к нейросети",
      whyThisNow: "Табличный Q-Learning — предшественник DQN и всех value-based методов.",
      ctaLabel: "Deep RL хаб",
      isPrimary: true,
    },
    {
      hubId: "math-rl",
      placement: "after-intro",
      title: "Q-функция и сходимость",
      whyThisNow: "Математические гарантии сходимости Q-Learning.",
      ctaLabel: "Математика",
      isPrimary: false,
    },
  ],
  "exploration-exploitation": [
    {
      hubId: "deep-rl",
      placement: "after-core-explanation",
      title: "Стратегии исследования",
      whyThisNow: "ε-greedy, UCB, Boltzmann — сравнение подходов.",
      ctaLabel: "Deep RL хаб",
      isPrimary: true,
    },
    {
      hubId: "math-rl",
      placement: "after-intro",
      title: "Математика exploration",
      whyThisNow: "Вероятностные основы стратегий исследования.",
      ctaLabel: "Математика",
      isPrimary: false,
    },
  ],
  "project-1": [
    {
      hubId: "project",
      placement: "after-intro",
      title: "Проект: Балансировка",
      whyThisNow: "Первый самостоятельный проект — закрепляем основы.",
      ctaLabel: "Проекты",
      isPrimary: true,
    },
    {
      hubId: "pytorch",
      placement: "after-code",
      title: "PyTorch в проекте",
      whyThisNow: "Применяем PyTorch для обучения первого агента.",
      ctaLabel: "PyTorch хаб",
      isPrimary: false,
    },
    {
      hubId: "unity-ml-agents",
      placement: "lesson-end",
      title: "Unity среда",
      whyThisNow: "Настройка среды CartPole в Unity ML-Agents.",
      ctaLabel: "Unity хаб",
      isPrimary: false,
    },
  ],

  /* ── Stage 2 ── */
  "policy-gradient": [
    {
      hubId: "math-rl",
      placement: "after-core-explanation",
      title: "Градиент политики",
      whyThisNow: "Вывод REINFORCE требует знания логарифмических производных.",
      ctaLabel: "Математика",
      isPrimary: true,
    },
    {
      hubId: "deep-rl",
      placement: "after-intro",
      title: "Policy-based методы",
      whyThisNow: "Policy Gradient — альтернатива value-based подходам.",
      ctaLabel: "Deep RL хаб",
      isPrimary: true,
    },
    {
      hubId: "pytorch",
      placement: "after-code",
      title: "Реализация REINFORCE",
      whyThisNow: "Построение графа вычислений для градиента политики.",
      ctaLabel: "PyTorch хаб",
      isPrimary: false,
    },
  ],
  "ppo": [
    {
      hubId: "deep-rl",
      placement: "after-core-explanation",
      title: "PPO в деталях",
      whyThisNow: "Clipping, GAE и другие нюансы PPO подробно в хабе.",
      ctaLabel: "Deep RL хаб",
      isPrimary: true,
    },
    {
      hubId: "pytorch",
      placement: "after-code",
      title: "PPO на PyTorch",
      whyThisNow: "Реализация clipped objective и GAE в PyTorch.",
      ctaLabel: "PyTorch хаб",
      isPrimary: false,
    },
  ],
  "continuous-actions": [
    {
      hubId: "unity-ml-agents",
      placement: "after-code",
      title: "Continuous в Unity",
      whyThisNow: "Настройка непрерывных действий в ML-Agents отличается от дискретных.",
      ctaLabel: "Unity хаб",
      isPrimary: true,
    },
    {
      hubId: "deep-rl",
      placement: "after-core-explanation",
      title: "Actor-Critic архитектура",
      whyThisNow: "Непрерывные действия требуют Actor-Critic подхода.",
      ctaLabel: "Deep RL хаб",
      isPrimary: true,
    },
    {
      hubId: "pytorch",
      placement: "after-code",
      title: "Gaussian Policy",
      whyThisNow: "Реализация нормального распределения для действий.",
      ctaLabel: "PyTorch хаб",
      isPrimary: false,
    },
  ],
  "reward-shaping": [
    {
      hubId: "unity-ml-agents",
      placement: "after-core-explanation",
      title: "Награды в Unity",
      whyThisNow: "Настройка функции вознаграждения в Unity-средах.",
      ctaLabel: "Unity хаб",
      isPrimary: true,
    },
    {
      hubId: "deep-rl",
      placement: "after-intro",
      title: "Reward Design",
      whyThisNow: "Проектирование наград — ключ к успешному обучению.",
      ctaLabel: "Deep RL хаб",
      isPrimary: true,
    },
  ],
  "parallel-envs": [
    {
      hubId: "unity-ml-agents",
      placement: "after-core-explanation",
      title: "Параллелизм в Unity",
      whyThisNow: "Запуск нескольких экземпляров среды в ML-Agents.",
      ctaLabel: "Unity хаб",
      isPrimary: true,
    },
    {
      hubId: "pytorch",
      placement: "after-code",
      title: "Батчевое обучение",
      whyThisNow: "Эффективная обработка данных из параллельных сред.",
      ctaLabel: "PyTorch хаб",
      isPrimary: false,
    },
  ],
  "tensorboard-wandb": [
    {
      hubId: "pytorch",
      placement: "after-core-explanation",
      title: "Логирование в PyTorch",
      whyThisNow: "Интеграция TensorBoard и W&B с PyTorch-пайплайном.",
      ctaLabel: "PyTorch хаб",
      isPrimary: true,
    },
    {
      hubId: "unity-ml-agents",
      placement: "after-code",
      title: "Мониторинг ML-Agents",
      whyThisNow: "Встроенная поддержка TensorBoard в Unity ML-Agents.",
      ctaLabel: "Unity хаб",
      isPrimary: false,
    },
  ],
  "unity-ml-agents-intro": [
    {
      hubId: "unity-ml-agents",
      placement: "after-intro",
      title: "Полный гайд ML-Agents",
      whyThisNow: "Подробная документация по всем компонентам фреймворка.",
      ctaLabel: "Unity хаб",
      isPrimary: true,
    },
    {
      hubId: "project",
      placement: "lesson-end",
      title: "Проект: 3D Ball",
      whyThisNow: "Попробуйте обучить агента в реальной 3D-среде.",
      ctaLabel: "К проекту",
      isPrimary: true,
    },
  ],
  "project-2": [
    {
      hubId: "project",
      placement: "after-intro",
      title: "Проект: 3D-охотник",
      whyThisNow: "Флагманский проект — FoodCollector с REINFORCE.",
      ctaLabel: "Проекты",
      isPrimary: true,
    },
    {
      hubId: "unity-ml-agents",
      placement: "after-code",
      title: "Среда FoodCollector",
      whyThisNow: "Настройка 3D-среды сбора еды в Unity.",
      ctaLabel: "Unity хаб",
      isPrimary: true,
    },
    {
      hubId: "deep-rl",
      placement: "lesson-end",
      title: "REINFORCE на практике",
      whyThisNow: "Применение Policy Gradient в реальном проекте.",
      ctaLabel: "Deep RL хаб",
      isPrimary: false,
    },
  ],
  "project-3": [
    {
      hubId: "project",
      placement: "after-intro",
      title: "Проект: Гоночный агент",
      whyThisNow: "Обучение агента гоночному вождению через SAC.",
      ctaLabel: "Проекты",
      isPrimary: true,
    },
    {
      hubId: "unity-ml-agents",
      placement: "after-code",
      title: "Ray Perception Sensors",
      whyThisNow: "Использование лучевых сенсоров для восприятия трассы.",
      ctaLabel: "Unity хаб",
      isPrimary: true,
    },
  ],

  /* ── Stage 3 ── */
  "sac": [
    {
      hubId: "deep-rl",
      placement: "after-core-explanation",
      title: "SAC: теория",
      whyThisNow: "Энтропийная регуляризация и двойной Q — детали в хабе.",
      ctaLabel: "Deep RL хаб",
      isPrimary: true,
    },
    {
      hubId: "pytorch",
      placement: "after-code",
      title: "SAC на PyTorch",
      whyThisNow: "Реализация двойного Q-критика и soft policy.",
      ctaLabel: "PyTorch хаб",
      isPrimary: false,
    },
    {
      hubId: "math-rl",
      placement: "after-intro",
      title: "Энтропийный бонус",
      whyThisNow: "Математика энтропийной регуляризации в SAC.",
      ctaLabel: "Математика",
      isPrimary: false,
    },
  ],
  "multi-agent": [
    {
      hubId: "unity-ml-agents",
      placement: "after-code",
      title: "MAPOCA в Unity",
      whyThisNow: "Мультиагентное обучение через self-play в ML-Agents.",
      ctaLabel: "Unity хаб",
      isPrimary: true,
    },
    {
      hubId: "project",
      placement: "lesson-end",
      title: "Проект: Soccer",
      whyThisNow: "Командный футбол — лучший способ закрепить мультиагентные навыки.",
      ctaLabel: "К проекту",
      isPrimary: false,
    },
    {
      hubId: "deep-rl",
      placement: "after-core-explanation",
      title: "Multi-Agent RL",
      whyThisNow: "Теория мультиагентного обучения и self-play.",
      ctaLabel: "Deep RL хаб",
      isPrimary: true,
    },
  ],
  "curriculum-learning": [
    {
      hubId: "unity-ml-agents",
      placement: "after-core-explanation",
      title: "Curriculum в Unity",
      whyThisNow: "Настройка curriculum learning в yaml-конфиге ML-Agents.",
      ctaLabel: "Unity хаб",
      isPrimary: true,
    },
    {
      hubId: "deep-rl",
      placement: "after-intro",
      title: "Curriculum подход",
      whyThisNow: "Постепенное усложнение задач для стабильного обучения.",
      ctaLabel: "Deep RL хаб",
      isPrimary: false,
    },
  ],
  "gail": [
    {
      hubId: "deep-rl",
      placement: "after-core-explanation",
      title: "GAIL и BC",
      whyThisNow: "Теория имитационного обучения: Behavioral Cloning и GAIL.",
      ctaLabel: "Deep RL хаб",
      isPrimary: true,
    },
    {
      hubId: "unity-ml-agents",
      placement: "after-code",
      title: "Демонстрации в Unity",
      whyThisNow: "Запись и использование демонстраций в ML-Agents.",
      ctaLabel: "Unity хаб",
      isPrimary: true,
    },
  ],
  "onnx-deploy": [
    {
      hubId: "unity-ml-agents",
      placement: "after-core-explanation",
      title: "ONNX в Unity",
      whyThisNow: "Экспорт и запуск моделей через ONNX → Unity Sentis.",
      ctaLabel: "Unity хаб",
      isPrimary: true,
    },
    {
      hubId: "pytorch",
      placement: "after-code",
      title: "PyTorch → ONNX",
      whyThisNow: "Конвертация PyTorch-модели в формат ONNX.",
      ctaLabel: "PyTorch хаб",
      isPrimary: true,
    },
  ],
  "hyperopt": [
    {
      hubId: "pytorch",
      placement: "after-core-explanation",
      title: "Гиперпараметры PyTorch",
      whyThisNow: "Learning rate, batch size, архитектура — настройка в PyTorch.",
      ctaLabel: "PyTorch хаб",
      isPrimary: true,
    },
    {
      hubId: "deep-rl",
      placement: "after-intro",
      title: "Гиперпараметры RL",
      whyThisNow: "Специфика подбора гиперпараметров в RL vs supervised learning.",
      ctaLabel: "Deep RL хаб",
      isPrimary: true,
    },
    {
      hubId: "fca-rl",
      placement: "after-code",
      title: "FCA для гиперпараметров",
      whyThisNow: "Структурирование результатов sweep и выбор зон для следующих экспериментов.",
      ctaLabel: "FCA хаб",
      isPrimary: false,
    },
  ],
  "nn-architectures": [
    {
      hubId: "pytorch",
      placement: "after-core-explanation",
      title: "Архитектуры в PyTorch",
      whyThisNow: "CNN, LSTM, Attention — реализация в PyTorch для RL.",
      ctaLabel: "PyTorch хаб",
      isPrimary: true,
    },
    {
      hubId: "deep-rl",
      placement: "after-intro",
      title: "Выбор архитектуры",
      whyThisNow: "Какая архитектура подходит для разных типов наблюдений.",
      ctaLabel: "Deep RL хаб",
      isPrimary: true,
    },
    {
      hubId: "math-rl",
      placement: "after-code",
      title: "Математика нейросетей",
      whyThisNow: "Обратное распространение и градиентный поток.",
      ctaLabel: "Математика",
      isPrimary: false,
    },
    {
      hubId: "fca-rl",
      placement: "lesson-end",
      title: "FCA для архитектур",
      whyThisNow: "Формальный контекст для сравнения и выбора архитектуры под задачу.",
      ctaLabel: "FCA хаб",
      isPrimary: false,
    },
  ],
  "deployment": [
    {
      hubId: "project",
      placement: "lesson-end",
      title: "Финальный проект",
      whyThisNow: "Объедините все знания в итоговом проекте с деплоем.",
      ctaLabel: "К проекту",
      isPrimary: true,
    },
  ],
};
