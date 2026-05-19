export type CrossLink = {
  lessonId: string;
  lessonPath: string;
  lessonTitle: string;
  lessonLevel: 1 | 2 | 3;
  hubPath: string;
  hubAnchor?: string;
  hubLabel: string;
  contextInLesson: string;
  contextInHub: string;
};

export const CROSSLINKS: CrossLink[] = [
  // ── Урок 1.1: Что такое RL? ──
  { lessonId: "1-1", lessonPath: "/courses/1-1", lessonTitle: "Что такое RL?", lessonLevel: 1, hubPath: "/deep-rl", hubAnchor: "foundations", hubLabel: "Deep RL → Основы", contextInLesson: "MDP, награды, нейросети — расширение введения", contextInHub: "Введение в Уроке 1.1" },
  { lessonId: "1-1", lessonPath: "/courses/1-1", lessonTitle: "Что такое RL?", lessonLevel: 1, hubPath: "/math-rl/module-5", hubAnchor: "глава-3", hubLabel: "Математика → Глава 3. MDP", contextInLesson: "Формальное определение MDP, V/Q функции", contextInHub: "Введение в Уроке 1.1" },
  { lessonId: "1-1", lessonPath: "/courses/1-1", lessonTitle: "Что такое RL?", lessonLevel: 1, hubPath: "/math-rl/module-1", hubAnchor: "4-уравнения-беллмана-и-дисконтирование", hubLabel: "Математика → Ряды и дисконтирование", contextInLesson: "Математика за γ и бесконечными суммами наград", contextInHub: "Введение в Уроке 1.1" },
  { lessonId: "1-1", lessonPath: "/courses/1-1", lessonTitle: "Что такое RL?", lessonLevel: 1, hubPath: "/algorithms/dqn", hubLabel: "Алгоритмы → DQN", contextInLesson: "Пример value-based метода", contextInHub: "Введение в Уроке 1.1" },

  // ── Урок 1.2: Установка окружения ──
  { lessonId: "1-2", lessonPath: "/courses/1-2", lessonTitle: "Установка окружения", lessonLevel: 1, hubPath: "/pytorch/cheatsheet", hubAnchor: "setup", hubLabel: "PyTorch → Установка", contextInLesson: "Установка PyTorch и проверка GPU", contextInHub: "Справка по установке (Урок 1.2)" },
  { lessonId: "1-2", lessonPath: "/courses/1-2", lessonTitle: "Установка окружения", lessonLevel: 1, hubPath: "/pytorch/cheatsheet", hubAnchor: "tensors", hubLabel: "PyTorch → Тензоры", contextInLesson: "Основы работы с тензорами", contextInHub: "Тензоры на практике (Урок 1.2)" },
  { lessonId: "1-2", lessonPath: "/courses/1-2", lessonTitle: "Установка окружения", lessonLevel: 1, hubPath: "/unity-ml-agents", hubAnchor: "installation", hubLabel: "Unity ML-Agents → Установка", contextInLesson: "Параллельная настройка Unity ML-Agents", contextInHub: "Подробности установки (Урок 1.2)" },

  // ── Урок 1.3: MDP и уравнения Беллмана ──
  { lessonId: "1-3", lessonPath: "/courses/1-3", lessonTitle: "MDP и уравнения Беллмана", lessonLevel: 1, hubPath: "/math-rl/module-5", hubAnchor: "глава-5", hubLabel: "Математика → Глава 5. Уравнения Беллмана", contextInLesson: "Рекурсивная структура функции ценности", contextInHub: "Интуитивный разбор Беллмана (Урок 1.3)" },
  { lessonId: "1-3", lessonPath: "/courses/1-3", lessonTitle: "MDP и уравнения Беллмана", lessonLevel: 1, hubPath: "/math-rl/module-5", hubAnchor: "глава-3", hubLabel: "Математика → Глава 3. MDP", contextInLesson: "Формальное описание MDP-среды", contextInHub: "MDP на практике (Урок 1.3)" },
  { lessonId: "1-3", lessonPath: "/courses/1-3", lessonTitle: "MDP и уравнения Беллмана", lessonLevel: 1, hubPath: "/math-rl/module-5", hubAnchor: "глава-6", hubLabel: "Математика → Глава 6. Model-Free RL", contextInLesson: "Переход от DP к Model-Free методам", contextInHub: "Связка с Model-Free (Урок 1.3)" },

  // ── Урок 1.4: Q-Learning табличный ──
  { lessonId: "1-4", lessonPath: "/courses/1-4", lessonTitle: "Q-Learning: табличный метод", lessonLevel: 1, hubPath: "/algorithms/dqn", hubLabel: "Алгоритмы → DQN", contextInLesson: "Q-Learning как табличный предшественник DQN", contextInHub: "Табличный Q-Learning (Урок 1.4)" },

  // ── Урок 1.5: CartPole ──
  { lessonId: "1-5", lessonPath: "/courses/1-5", lessonTitle: "CartPole — твой первый RL-агент", lessonLevel: 1, hubPath: "/pytorch/cheatsheet", hubAnchor: "nn", hubLabel: "PyTorch → nn.Module", contextInLesson: "Построение простой нейросети для CartPole", contextInHub: "nn.Module в действии (Урок 1.5)" },
  { lessonId: "1-5", lessonPath: "/courses/1-5", lessonTitle: "CartPole — твой первый RL-агент", lessonLevel: 1, hubPath: "/pytorch/cheatsheet", hubAnchor: "training", hubLabel: "PyTorch → Цикл обучения", contextInLesson: "Цикл обучения: forward → loss → backward → step", contextInHub: "Практический цикл обучения (Урок 1.5)" },
  { lessonId: "1-5", lessonPath: "/courses/1-5", lessonTitle: "CartPole — твой первый RL-агент", lessonLevel: 1, hubPath: "/algorithms/dqn", hubLabel: "Алгоритмы → DQN", contextInLesson: "CartPole как базовая среда для проверки DQN", contextInHub: "Среда CartPole (Урок 1.5)" },
  { lessonId: "1-5", lessonPath: "/courses/1-5", lessonTitle: "CartPole — твой первый RL-агент", lessonLevel: 1, hubPath: "/pytorch", hubLabel: "PyTorch Шпаргалка", contextInLesson: "Полный справочник PyTorch для RL-задач", contextInHub: "Основы PyTorch (Урок 1.5)" },

  // ── Урок 1.6: DQN с нуля ──
  { lessonId: "1-6", lessonPath: "/courses/1-6", lessonTitle: "DQN с нуля на PyTorch", lessonLevel: 1, hubPath: "/algorithms/dqn", hubLabel: "Алгоритмы → DQN", contextInLesson: "Полная реализация DQN: replay buffer, target network", contextInHub: "Детальная реализация DQN (Урок 1.6)" },
  { lessonId: "1-6", lessonPath: "/courses/1-6", lessonTitle: "DQN с нуля на PyTorch", lessonLevel: 1, hubPath: "/pytorch/cheatsheet", hubAnchor: "nn", hubLabel: "PyTorch → nn.Module", contextInLesson: "Архитектура Q-сети на nn.Module", contextInHub: "Пример Q-сети (Урок 1.6)" },
  { lessonId: "1-6", lessonPath: "/courses/1-6", lessonTitle: "DQN с нуля на PyTorch", lessonLevel: 1, hubPath: "/math-rl/module-5", hubAnchor: "глава-5", hubLabel: "Математика → Глава 5. Уравнения Беллмана", contextInLesson: "Математическая основа DQN — уравнение Беллмана", contextInHub: "Формула Беллмана в коде DQN (Урок 1.6)" },
  { lessonId: "1-6", lessonPath: "/courses/1-6", lessonTitle: "DQN с нуля на PyTorch", lessonLevel: 1, hubPath: "/math-rl/module-4", hubAnchor: "лекция-3-градиентный-спуск-и-его-варианты", hubLabel: "Математика → Оптимизация", contextInLesson: "Оптимизация Q-сети через SGD / Adam", contextInHub: "Оптимизация в контексте DQN (Урок 1.6)" },
  { lessonId: "1-6", lessonPath: "/courses/1-6", lessonTitle: "DQN с нуля на PyTorch", lessonLevel: 1, hubPath: "/deep-rl", hubAnchor: "algorithms", hubLabel: "Deep RL → Алгоритмы", contextInLesson: "DQN в контексте других Deep RL алгоритмов", contextInHub: "DQN — первый deep-метод (Урок 1.6)" },

  // ── Проект-1: "Баланс в 3D" ──
  { lessonId: "project-1", lessonPath: "/courses/project-1", lessonTitle: 'Проект-1: "Баланс в 3D"', lessonLevel: 1, hubPath: "/unity-projects/ball-balance", hubLabel: "Unity → Ball Balance", contextInLesson: "Полная реализация проекта в 3D Unity-среде", contextInHub: 'Родственный проект (Проект-1: "Баланс в 3D")' },
  { lessonId: "project-1", lessonPath: "/courses/project-1", lessonTitle: 'Проект-1: "Баланс в 3D"', lessonLevel: 1, hubPath: "/algorithms/dqn", hubLabel: "Алгоритмы → DQN", contextInLesson: "Применение DQN для задачи балансировки", contextInHub: 'Практическое применение DQN (Проект-1: "Баланс в 3D")' },
  { lessonId: "project-1", lessonPath: "/courses/project-1", lessonTitle: 'Проект-1: "Баланс в 3D"', lessonLevel: 1, hubPath: "/pytorch/cheatsheet", hubAnchor: "saving", hubLabel: "PyTorch → Сохранение", contextInLesson: "Сохранение обученной модели (state_dict)", contextInHub: 'Сохранение модели (Проект-1: "Баланс в 3D")' },

  // ── Урок 2.1: Policy Gradient ──
  { lessonId: "2-1", lessonPath: "/courses/2-1", lessonTitle: "Policy Gradient и REINFORCE", lessonLevel: 2, hubPath: "/deep-rl", hubAnchor: "algorithms", hubLabel: "Deep RL → Алгоритмы", contextInLesson: "Policy Gradient как альтернатива value-based методам", contextInHub: "Теорема градиента политики (Урок 2.1)" },
  { lessonId: "2-1", lessonPath: "/courses/2-1", lessonTitle: "Policy Gradient и REINFORCE", lessonLevel: 2, hubPath: "/math-rl/module-4", hubAnchor: "лекция-2-вывод-градиента-политики", hubLabel: "Математика → Вывод градиента политики", contextInLesson: "Стохастический градиентный подъём для политики", contextInHub: "Оптимизация политики (Урок 2.1)" },
  { lessonId: "2-1", lessonPath: "/courses/2-1", lessonTitle: "Policy Gradient и REINFORCE", lessonLevel: 2, hubPath: "/pytorch/cheatsheet", hubAnchor: "autograd", hubLabel: "PyTorch → Autograd", contextInLesson: "Autograd для вычисления градиента политики", contextInHub: "Autograd в контексте REINFORCE (Урок 2.1)" },
  { lessonId: "2-1", lessonPath: "/courses/2-1", lessonTitle: "Policy Gradient и REINFORCE", lessonLevel: 2, hubPath: "/math-rl/module-3", hubAnchor: "1-теория-вероятностей", hubLabel: "Математика → Вероятности", contextInLesson: "Логарифмические производные и REINFORCE", contextInHub: "Вероятностные основы градиента политики (Урок 2.1)" },

  // ── Урок 2.2: PPO ──
  { lessonId: "2-2", lessonPath: "/courses/2-2", lessonTitle: "PPO — реализация с нуля", lessonLevel: 2, hubPath: "/algorithms/ppo", hubAnchor: "clipped", hubLabel: "PPO → Clipped Objective", contextInLesson: "Детальный разбор формулы клиппинга", contextInHub: "Реализация clipped loss (Урок 2.2)" },
  { lessonId: "2-2", lessonPath: "/courses/2-2", lessonTitle: "PPO — реализация с нуля", lessonLevel: 2, hubPath: "/algorithms/ppo", hubAnchor: "gae", hubLabel: "PPO → GAE", contextInLesson: "Generalized Advantage Estimation в PPO", contextInHub: "GAE на практике (Урок 2.2)" },
  { lessonId: "2-2", lessonPath: "/courses/2-2", lessonTitle: "PPO — реализация с нуля", lessonLevel: 2, hubPath: "/algorithms/ppo", hubAnchor: "architecture", hubLabel: "PPO → Архитектура", contextInLesson: "Архитектура Actor-Critic сетей для PPO", contextInHub: "Actor-Critic архитектура (Урок 2.2)" },
  { lessonId: "2-2", lessonPath: "/courses/2-2", lessonTitle: "PPO — реализация с нуля", lessonLevel: 2, hubPath: "/algorithms/ppo", hubAnchor: "implementation", hubLabel: "PPO → Реализация", contextInLesson: "Полная реализация PPO на PyTorch", contextInHub: "Код PPO из Урока 2.2" },
  { lessonId: "2-2", lessonPath: "/courses/2-2", lessonTitle: "PPO — реализация с нуля", lessonLevel: 2, hubPath: "/algorithms/ppo", hubAnchor: "unity", hubLabel: "PPO → Unity", contextInLesson: "Запуск PPO-обучения в Unity ML-Agents", contextInHub: "PPO в Unity (Урок 2.2)" },
  { lessonId: "2-2", lessonPath: "/courses/2-2", lessonTitle: "PPO — реализация с нуля", lessonLevel: 2, hubPath: "/math-rl/module-5", hubAnchor: "глава-9", hubLabel: "Математика → Глава 9. Policy Gradients и Advantage", contextInLesson: "Математика GAE и advantage estimation", contextInHub: "Формула GAE (Урок 2.2)" },

  // ── Урок 2.3: Непрерывные действия ──
  { lessonId: "2-3", lessonPath: "/courses/2-3", lessonTitle: "Непрерывные действия и Actor-Critic", lessonLevel: 2, hubPath: "/algorithms/ppo", hubAnchor: "architecture", hubLabel: "PPO → Архитектура", contextInLesson: "Адаптация PPO для continuous action space", contextInHub: "Continuous PPO (Урок 2.3)" },
  { lessonId: "2-3", lessonPath: "/courses/2-3", lessonTitle: "Непрерывные действия и Actor-Critic", lessonLevel: 2, hubPath: "/unity-ml-agents", hubAnchor: "neural-networks", hubLabel: "ML-Agents → Нейросети", contextInLesson: "Настройка continuous actions в ML-Agents", contextInHub: "Непрерывные действия (Урок 2.3)" },
  { lessonId: "2-3", lessonPath: "/courses/2-3", lessonTitle: "Непрерывные действия и Actor-Critic", lessonLevel: 2, hubPath: "/unity-ml-agents", hubAnchor: "training", hubLabel: "ML-Agents → Обучение", contextInLesson: "Тренировка с continuous actions в Unity", contextInHub: "Тренировка Actor-Critic (Урок 2.3)" },
  { lessonId: "2-3", lessonPath: "/courses/2-3", lessonTitle: "Непрерывные действия и Actor-Critic", lessonLevel: 2, hubPath: "/pytorch/cheatsheet", hubAnchor: "nn", hubLabel: "PyTorch → nn.Module", contextInLesson: "Gaussian Policy через nn.Module", contextInHub: "Gaussian Policy (Урок 2.3)" },

  // ── Урок 2.4: Reward Shaping ──
  { lessonId: "2-4", lessonPath: "/courses/2-4", lessonTitle: "Reward Shaping", lessonLevel: 2, hubPath: "/deep-rl", hubAnchor: "practice", hubLabel: "Deep RL → Практика", contextInLesson: "Проектирование функции вознаграждения", contextInHub: "Reward shaping (Урок 2.4)" },
  { lessonId: "2-4", lessonPath: "/courses/2-4", lessonTitle: "Reward Shaping", lessonLevel: 2, hubPath: "/unity-ml-agents", hubAnchor: "training", hubLabel: "ML-Agents → Обучение", contextInLesson: "Настройка наград в Unity-средах", contextInHub: "Настройка reward в ML-Agents (Урок 2.4)" },
  { lessonId: "2-4", lessonPath: "/courses/2-4", lessonTitle: "Reward Shaping", lessonLevel: 2, hubPath: "/math-rl/module-1", hubAnchor: "6-дисконтирование-в-rl-и-его-влияние", hubLabel: "Математика → Дисконтирование в RL", contextInLesson: "Математическое обоснование reward shaping", contextInHub: "Ряды и дисконтирование (Урок 2.4)" },

  // ── Урок 2.5: Параллельные среды ──
  { lessonId: "2-5", lessonPath: "/courses/2-5", lessonTitle: "Параллельные среды", lessonLevel: 2, hubPath: "/unity-ml-agents", hubAnchor: "training", hubLabel: "ML-Agents → Обучение", contextInLesson: "Запуск множества экземпляров среды в ML-Agents", contextInHub: "Параллелизм для ускорения обучения (Урок 2.5)" },

  // ── Урок 2.6: TensorBoard и W&B ──
  { lessonId: "2-6", lessonPath: "/courses/2-6", lessonTitle: "TensorBoard и W&B", lessonLevel: 2, hubPath: "/unity-ml-agents", hubAnchor: "training", hubLabel: "ML-Agents → Обучение", contextInLesson: "Мониторинг обучения ML-Agents через TensorBoard", contextInHub: "TensorBoard + ML-Agents (Урок 2.6)" },
  { lessonId: "2-6", lessonPath: "/courses/2-6", lessonTitle: "TensorBoard и W&B", lessonLevel: 2, hubPath: "/pytorch/cheatsheet", hubAnchor: "saving", hubLabel: "PyTorch → Сохранение", contextInLesson: "Логирование чекпоинтов и метрик", contextInHub: "Сохранение + логирование (Урок 2.6)" },

  // ── Проект 2: 3D-охотник ──
  { lessonId: "project-2", lessonPath: "/courses/project-2", lessonTitle: "Проект: 3D-охотник", lessonLevel: 2, hubPath: "/unity-ml-agents", hubAnchor: "neural-networks", hubLabel: "ML-Agents → Нейросети", contextInLesson: "Настройка нейросети для FoodCollector", contextInHub: "Конфигурация сети (Проект 2)" },
  { lessonId: "project-2", lessonPath: "/courses/project-2", lessonTitle: "Проект: 3D-охотник", lessonLevel: 2, hubPath: "/algorithms/ppo", hubLabel: "Алгоритмы → PPO", contextInLesson: "Применение PPO в проекте FoodCollector", contextInHub: "PPO на практике (Проект 2)" },
  { lessonId: "project-2", lessonPath: "/courses/project-2", lessonTitle: "Проект: 3D-охотник", lessonLevel: 2, hubPath: "/unity-projects/gridworld", hubLabel: "Unity → GridWorld", contextInLesson: "GridWorld как упрощённая аналогия FoodCollector", contextInHub: "Связь с FoodCollector (Проект 2)" },

  // ── Проект 3: Гоночный агент ──
  { lessonId: "project-3", lessonPath: "/courses/project-3", lessonTitle: "Проект: Гоночный агент", lessonLevel: 2, hubPath: "/unity-projects/racing", hubLabel: "Unity → Racing Car", contextInLesson: "Обучение агента управлению гоночным автомобилем", contextInHub: "Полный проект гоночного агента (Проект 3)" },
  { lessonId: "project-3", lessonPath: "/courses/project-3", lessonTitle: "Проект: Гоночный агент", lessonLevel: 2, hubPath: "/algorithms/ppo", hubAnchor: "unity", hubLabel: "PPO → Unity", contextInLesson: "PPO с continuous actions для гонок", contextInHub: "PPO в задаче вождения (Проект 3)" },

  // ── Урок 3.1: SAC ──
  { lessonId: "3-1", lessonPath: "/courses/3-1", lessonTitle: "SAC — Soft Actor-Critic", lessonLevel: 3, hubPath: "/algorithms/sac", hubAnchor: "entropy", hubLabel: "SAC → Энтропия", contextInLesson: "Энтропийная регуляризация в SAC", contextInHub: "Теория энтропии (Урок 3.1)" },
  { lessonId: "3-1", lessonPath: "/courses/3-1", lessonTitle: "SAC — Soft Actor-Critic", lessonLevel: 3, hubPath: "/algorithms/sac", hubAnchor: "architecture", hubLabel: "SAC → Архитектура", contextInLesson: "Twin Q-networks и reparameterization trick", contextInHub: "Архитектура SAC (Урок 3.1)" },
  { lessonId: "3-1", lessonPath: "/courses/3-1", lessonTitle: "SAC — Soft Actor-Critic", lessonLevel: 3, hubPath: "/algorithms/sac", hubAnchor: "implementation", hubLabel: "SAC → Реализация", contextInLesson: "Полная реализация SAC на PyTorch", contextInHub: "Код SAC (Урок 3.1)" },
  { lessonId: "3-1", lessonPath: "/courses/3-1", lessonTitle: "SAC — Soft Actor-Critic", lessonLevel: 3, hubPath: "/algorithms/sac", hubAnchor: "unity", hubLabel: "SAC → Unity", contextInLesson: "SAC-обучение в Unity ML-Agents", contextInHub: "SAC в Unity (Урок 3.1)" },
  { lessonId: "3-1", lessonPath: "/courses/3-1", lessonTitle: "SAC — Soft Actor-Critic", lessonLevel: 3, hubPath: "/math-rl/module-5", hubAnchor: "глава-9", hubLabel: "Математика → Глава 9. Policy Gradients и энтропия", contextInLesson: "Математика soft value функций", contextInHub: "Энтропийная формула (Урок 3.1)" },

  // ── Урок 3.2: MA-POCA и Self-Play ──
  { lessonId: "3-2", lessonPath: "/courses/3-2", lessonTitle: "MA-POCA и Self-Play", lessonLevel: 3, hubPath: "/unity-projects/soccer", hubLabel: "Unity → Soccer", contextInLesson: "Soccer как среда для multi-agent обучения", contextInHub: "Мультиагентная среда Soccer (Урок 3.2)" },
  { lessonId: "3-2", lessonPath: "/courses/3-2", lessonTitle: "MA-POCA и Self-Play", lessonLevel: 3, hubPath: "/deep-rl", hubAnchor: "algorithms", hubLabel: "Deep RL → Алгоритмы", contextInLesson: "Multi-Agent RL в семействе Deep RL", contextInHub: "Мультиагентные алгоритмы (Урок 3.2)" },
  { lessonId: "3-2", lessonPath: "/courses/3-2", lessonTitle: "MA-POCA и Self-Play", lessonLevel: 3, hubPath: "/unity-ml-agents", hubAnchor: "training", hubLabel: "ML-Agents → Обучение", contextInLesson: "Настройка self-play в ML-Agents", contextInHub: "Self-play тренировка (Урок 3.2)" },

  // ── Урок 3.3: Curriculum Learning ──
  { lessonId: "3-3", lessonPath: "/courses/3-3", lessonTitle: "Curriculum Learning", lessonLevel: 3, hubPath: "/unity-ml-agents", hubAnchor: "training", hubLabel: "ML-Agents → Обучение", contextInLesson: "Curriculum в YAML-конфигурации ML-Agents", contextInHub: "Настройка curriculum (Урок 3.3)" },
  { lessonId: "3-3", lessonPath: "/courses/3-3", lessonTitle: "Curriculum Learning", lessonLevel: 3, hubPath: "/deep-rl", hubAnchor: "practice", hubLabel: "Deep RL → Практика", contextInLesson: "Curriculum как инструмент стабильного обучения", contextInHub: "Curriculum learning (Урок 3.3)" },

  // ── Урок 3.4: GAIL ──
  { lessonId: "3-4", lessonPath: "/courses/3-4", lessonTitle: "Имитационное обучение (GAIL)", lessonLevel: 3, hubPath: "/deep-rl", hubAnchor: "algorithms", hubLabel: "Deep RL → Алгоритмы", contextInLesson: "GAIL в семействе Deep RL методов", contextInHub: "Imitation Learning (Урок 3.4)" },
  { lessonId: "3-4", lessonPath: "/courses/3-4", lessonTitle: "Имитационное обучение (GAIL)", lessonLevel: 3, hubPath: "/unity-ml-agents", hubAnchor: "training", hubLabel: "ML-Agents → Обучение", contextInLesson: "Запись и использование демонстраций в ML-Agents", contextInHub: "Демонстрации для GAIL (Урок 3.4)" },
  { lessonId: "3-4", lessonPath: "/courses/3-4", lessonTitle: "Имитационное обучение (GAIL)", lessonLevel: 3, hubPath: "/math-rl/module-4", hubAnchor: "лекция-2-вывод-градиента-политики", hubLabel: "Математика → Градиент политики", contextInLesson: "GAN-подобная оптимизация в GAIL", contextInHub: "Adversarial training (Урок 3.4)" },

  // ── Урок 3.5: Деплой ONNX ──
  { lessonId: "3-5", lessonPath: "/courses/3-5", lessonTitle: "Деплой модели: ONNX", lessonLevel: 3, hubPath: "/pytorch/cheatsheet", hubAnchor: "onnx-export", hubLabel: "PyTorch → ONNX-экспорт", contextInLesson: "Экспорт PyTorch → ONNX формат", contextInHub: "ONNX-экспорт (Урок 3.5)" },
  { lessonId: "3-5", lessonPath: "/courses/3-5", lessonTitle: "Деплой модели: ONNX", lessonLevel: 3, hubPath: "/unity-ml-agents", hubAnchor: "installation", hubLabel: "ML-Agents → Установка", contextInLesson: "Интеграция ONNX-модели в Unity через Sentis", contextInHub: "ONNX → Sentis (Урок 3.5)" },

  // ── Урок 3.6: Оптимизация гиперпараметров ──
  { lessonId: "3-6", lessonPath: "/courses/3-6", lessonTitle: "Оптимизация гиперпараметров", lessonLevel: 3, hubPath: "/math-rl/module-4", hubAnchor: "лекция-3-градиентный-спуск-и-его-варианты", hubLabel: "Математика → Оптимизация", contextInLesson: "Математика поиска гиперпараметров", contextInHub: "Оптимизация гиперпараметров (Урок 3.6)" },
  { lessonId: "3-6", lessonPath: "/courses/3-6", lessonTitle: "Оптимизация гиперпараметров", lessonLevel: 3, hubPath: "/algorithms/ppo", hubAnchor: "implementation", hubLabel: "PPO → Реализация", contextInLesson: "lr, clip_range, n_epochs — настройка PPO", contextInHub: "Тюнинг PPO гиперпараметров (Урок 3.6)" },
  { lessonId: "3-6", lessonPath: "/courses/3-6", lessonTitle: "Оптимизация гиперпараметров", lessonLevel: 3, hubPath: "/fca-rl", hubAnchor: "fca-hyperparams", hubLabel: "FCA → Гиперпараметры", contextInLesson: "Анализ экспериментов через формальные понятия", contextInHub: "FCA-анализ гиперпараметров (Урок 3.6)" },

  // ── Урок 3.7: Архитектуры нейросетей ──
  { lessonId: "3-7", lessonPath: "/courses/3-7", lessonTitle: "Архитектуры нейросетей", lessonLevel: 3, hubPath: "/pytorch/cheatsheet", hubAnchor: "nn", hubLabel: "PyTorch → nn.Module", contextInLesson: "CNN, LSTM, Attention — реализация в PyTorch", contextInHub: "Архитектуры нейросетей (Урок 3.7)" },
  { lessonId: "3-7", lessonPath: "/courses/3-7", lessonTitle: "Архитектуры нейросетей", lessonLevel: 3, hubPath: "/math-rl/module-2", hubLabel: "Математика → Линейная алгебра", contextInLesson: "Матричные операции в свёрточных и рекуррентных сетях", contextInHub: "Линейная алгебра за архитектурами (Урок 3.7)" },
  { lessonId: "3-7", lessonPath: "/courses/3-7", lessonTitle: "Архитектуры нейросетей", lessonLevel: 3, hubPath: "/deep-rl", hubAnchor: "foundations", hubLabel: "Deep RL → Основы", contextInLesson: "Выбор архитектуры под тип наблюдений", contextInHub: "Архитектурные решения (Урок 3.7)" },
  { lessonId: "3-7", lessonPath: "/courses/3-7", lessonTitle: "Архитектуры нейросетей", lessonLevel: 3, hubPath: "/fca-rl", hubAnchor: "fca-architecture", hubLabel: "FCA → Архитектура", contextInLesson: "FCA для выбора архитектуры по свойствам задачи", contextInHub: "FCA-анализ архитектур (Урок 3.7)" },
  { lessonId: "3-7", lessonPath: "/courses/3-7", lessonTitle: "Архитектуры нейросетей", lessonLevel: 3, hubPath: "/fca-rl", hubAnchor: "fca-basics", hubLabel: "FCA → Основы", contextInLesson: "Формальные понятия для классификации архитектур", contextInHub: "Основы FCA (Урок 3.7)" },

  // ── Финальный проект ──
  { lessonId: "final-project", lessonPath: "/courses/final-project", lessonTitle: "Финальный проект", lessonLevel: 3, hubPath: "/unity-projects", hubLabel: "Unity → Проекты", contextInLesson: "Финальный проект — объединение всех навыков", contextInHub: "Итоговый проект курса" },
  { lessonId: "final-project", lessonPath: "/courses/final-project", lessonTitle: "Финальный проект", lessonLevel: 3, hubPath: "/algorithms/ppo", hubLabel: "Алгоритмы → PPO", contextInLesson: "PPO как основной алгоритм для игрового NPC", contextInHub: "PPO в финальном проекте" },
  { lessonId: "final-project", lessonPath: "/courses/final-project", lessonTitle: "Финальный проект", lessonLevel: 3, hubPath: "/algorithms/sac", hubLabel: "Алгоритмы → SAC", contextInLesson: "SAC как альтернатива для continuous control", contextInHub: "SAC в финальном проекте" },
  { lessonId: "final-project", lessonPath: "/courses/final-project", lessonTitle: "Финальный проект", lessonLevel: 3, hubPath: "/pytorch/cheatsheet", hubAnchor: "saving", hubLabel: "PyTorch → Сохранение", contextInLesson: "Экспорт финальной модели для деплоя", contextInHub: "Сохранение и деплой (Финальный проект)" },
  { lessonId: "final-project", lessonPath: "/courses/final-project", lessonTitle: "Финальный проект", lessonLevel: 3, hubPath: "/deep-rl", hubAnchor: "practice", hubLabel: "Deep RL → Практика", contextInLesson: "Применение Deep RL в реальной игре", contextInHub: "Итоговое применение Deep RL" },
  { lessonId: "final-project", lessonPath: "/courses/final-project", lessonTitle: "Финальный проект", lessonLevel: 3, hubPath: "/fca-rl", hubAnchor: "fca-practice", hubLabel: "FCA → Практика", contextInLesson: "FCA-анализ обученного NPC-агента", contextInHub: "FCA-анализ в Финальном проекте" },
];

/** Get all crosslinks for a specific lesson */
export function getLinksForLesson(lessonId: string): CrossLink[] {
  return CROSSLINKS.filter((link) => link.lessonId === lessonId);
}

/** Get all crosslinks pointing to a specific hub (optionally filtered by anchor) */
export function getLinksForHub(hubPath: string, anchor?: string): CrossLink[] {
  return CROSSLINKS.filter((link) => {
    if (link.hubPath !== hubPath) return false;
    if (anchor !== undefined && link.hubAnchor !== anchor) return false;
    return true;
  });
}

/** Check if a lesson level is free (level 1) */
export function isLessonFree(lessonLevel: number): boolean {
  return lessonLevel === 1;
}
