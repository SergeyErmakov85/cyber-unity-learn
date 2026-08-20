/**
 * Реестр сред лаборатории Unity ML-Agents — практика под теорией курса.
 *
 * Лаборатория (репозиторий `unity-ml-agents-lab`) — третий репозиторий связки:
 * сайт объясняет, пособие доказывает, лаборатория показывает работающий код.
 * Там двенадцать сред `E00`–`E11` в одном Unity-проекте и собственное ядро
 * обучения на PyTorch: алгоритмы написаны своим кодом, а не взяты из
 * библиотеки, поэтому ссылка на файл алгоритма — это ссылка на ту же формулу,
 * что стоит в уроке.
 *
 * Реестр один на весь сайт. Уроки, хабы, страницы проектов и блог берут
 * ссылки отсюда, чтобы вторая, расходящаяся копия путей не появилась —
 * ровно по той же причине, по которой учебник держит свой мост в коде
 * в единственном файле `math-textbook/_meta/unity-bridge.md`.
 */

/**
 * Ref `HEAD`: GitHub сам разрешает его в ветку по умолчанию, поэтому ссылки
 * переживают её переименование.
 */
export const LAB_REPO = "https://github.com/SergeyErmakov85/unity-ml-agents-lab";

/** Путь от корня лаборатории → адрес файла или каталога на GitHub. */
export const labUrl = (path: string): string => {
  const isDirectory = path.endsWith("/");
  const clean = isDirectory ? path.slice(0, -1) : path;
  return `${LAB_REPO}/${isDirectory ? "tree" : "blob"}/HEAD/${clean}`;
};

export type LabEnvId =
  | "E00_Bandit"
  | "E01_GridWorld"
  | "E02_CartPoleUnity"
  | "E03_RollerBall"
  | "E04_BallBalance"
  | "E05_FoodCollector"
  | "E06_Hunter3D"
  | "E07_RacingCar"
  | "E08_SoccerArena"
  | "E09_CurriculumMaze"
  | "E10_Imitation"
  | "E11_Research";

/**
 * `done` — обучено и проверено инференсом ONNX в Unity;
 * `ready` — сцена, сборка, конфиг и ноутбук готовы, обучение запускает читатель.
 */
export type LabEnvStatus = "done" | "ready";

export interface LabEnvLink {
  /** Что это за файл — подпись ссылки. */
  label: string;
  /** Путь от корня репозитория лаборатории. */
  path: string;
}

export interface LabEnv {
  id: LabEnvId;
  /** Человеческое название среды. */
  title: string;
  /** Задача одной строкой. */
  task: string;
  actions: string;
  algos: string[];
  status: LabEnvStatus;
  /** Чем среда подтверждена — измерением, а не обещанием. */
  evidence: string;
  /** Ключевые файлы в порядке чтения: карточка → спецификация → код → конфиг. */
  links: LabEnvLink[];
  /** Команда, которой среда обучается. */
  train: string;
  /** Ноутбук с пояснениями и графиками. */
  notebook: string;
}

const ENVS = "unity/MLAgentsLab/Assets/Envs";

export const LAB_ENVS: Record<LabEnvId, LabEnv> = {
  E00_Bandit: {
    id: "E00_Bandit",
    title: "Многорукий бандит",
    task: "пять рук с разными вероятностями награды",
    actions: "Discrete 1×5",
    algos: ["ε-greedy", "UCB1", "Thompson"],
    status: "done",
    evidence:
      "три стратегии на трёх сидах, IQM 0.7950; сожаление 0.0862 / 0.0074 / 0.0011; инференс в Unity 20 из 20",
    links: [
      { label: "Карточка среды", path: "docs/envs/E00_Bandit.md" },
      { label: "Спецификация", path: `${ENVS}/E00_Bandit/ENV_SPEC.md` },
      { label: "Устройство рук", path: `${ENVS}/E00_Bandit/Scripts/BanditArea.cs` },
      { label: "Три стратегии одним кодом", path: "python/labrl/algos/bandits.py" },
      { label: "Конфиг UCB1", path: "configs/E00_Bandit__ucb.yaml" },
    ],
    train: "python scripts/train.py --config configs/E00_Bandit__ucb.yaml --all-seeds",
    notebook: "notebooks/E00_Bandit__bandits.ipynb",
  },

  E01_GridWorld: {
    id: "E01_GridWorld",
    title: "GridWorld 5×5",
    task: "дойти до цели по сетке, не попав в ловушку",
    actions: "Discrete 1×4",
    algos: ["Value Iteration", "табличный Q-learning"],
    status: "done",
    evidence:
      "три сида дают награду 0.6800 — точный оптимум среды (восемь шагов, 1.0 − 8 · 0.04); инференс в Unity 20 из 20",
    links: [
      { label: "Карточка среды", path: "docs/envs/E01_GridWorld.md" },
      { label: "Спецификация", path: `${ENVS}/E01_GridWorld/ENV_SPEC.md` },
      { label: "MDP: клетки, награды, переходы", path: `${ENVS}/E01_GridWorld/Scripts/GridWorldEnvironment.cs` },
      { label: "Value Iteration", path: "python/labrl/algos/tabular/value_iteration.py" },
      { label: "Табличный Q-learning", path: "python/labrl/algos/tabular/q_learning.py" },
      { label: "Конфиг", path: "configs/E01_GridWorld__qlearning.yaml" },
    ],
    train: "python scripts/train.py --config configs/E01_GridWorld__qlearning.yaml --all-seeds",
    notebook: "notebooks/E01_GridWorld__qlearning.ipynb",
  },

  E02_CartPoleUnity: {
    id: "E02_CartPoleUnity",
    title: "CartPole в Unity",
    task: "удержать шест на тележке",
    actions: "Discrete 1×2",
    algos: ["Q-learning с дискретизацией"],
    status: "done",
    evidence:
      "IQM 199.68 при пороге 195; сетка дискретизации живёт внутри графа ONNX, инференс в Unity 20 из 20 по 200 шагов",
    links: [
      { label: "Карточка среды", path: "docs/envs/E02_CartPoleUnity.md" },
      { label: "Спецификация", path: `${ENVS}/E02_CartPoleUnity/ENV_SPEC.md` },
      { label: "Агент: четыре числа состояния", path: `${ENVS}/E02_CartPoleUnity/Scripts/CartPoleAgent.cs` },
      { label: "Дискретизация под таблицу", path: "python/labrl/nets/discretized.py" },
      { label: "Конфиг", path: "configs/E02_CartPoleUnity__qlearning.yaml" },
    ],
    train: "python scripts/train.py --config configs/E02_CartPoleUnity__qlearning.yaml --all-seeds",
    notebook: "notebooks/E02_CartPoleUnity__qlearning.ipynb",
  },

  E03_RollerBall: {
    id: "E03_RollerBall",
    title: "RollerBall",
    task: "докатиться шаром до цели, не упав с платформы",
    actions: "Discrete 1×4",
    algos: ["Double DQN"],
    status: "done",
    evidence: "успех 100 %; ONNX 13 из 13 проверок; инференс в Unity 20 из 20, отношение к Python-оценке 1.004",
    links: [
      { label: "Карточка среды", path: "docs/envs/E03_RollerBall.md" },
      { label: "Спецификация", path: `${ENVS}/E03_RollerBall/ENV_SPEC.md` },
      { label: "Агент: вектор из восьми чисел", path: `${ENVS}/E03_RollerBall/Scripts/RollerAgent.cs` },
      { label: "DQN: буфер, целевая сеть, Хубер", path: "python/labrl/algos/dqn.py" },
      { label: "Конфиг", path: "configs/E03_RollerBall__dqn.yaml" },
    ],
    train: "python scripts/train.py --config configs/E03_RollerBall__dqn.yaml --all-seeds",
    notebook: "notebooks/E03_RollerBall__dqn.ipynb",
  },

  E04_BallBalance: {
    id: "E04_BallBalance",
    title: "Баланс шара на платформе",
    task: "удержать шар наклонами платформы",
    actions: "Continuous 2",
    algos: ["A2C", "PPO"],
    status: "done",
    evidence:
      "PPO — IQM 100.00, то есть максимум среды; A2C — 97.12; по три сида при пороге 80, инференс в Unity 20 из 20",
    links: [
      { label: "Карточка среды", path: "docs/envs/E04_BallBalance.md" },
      { label: "Спецификация", path: `${ENVS}/E04_BallBalance/ENV_SPEC.md` },
      { label: "Агент: два непрерывных действия", path: `${ENVS}/E04_BallBalance/Scripts/BallBalanceAgent.cs` },
      { label: "PPO", path: "python/labrl/algos/ppo.py" },
      { label: "A2C — тот же actor-critic без клиппинга", path: "python/labrl/algos/a2c.py" },
      { label: "Конфиг PPO", path: "configs/E04_BallBalance__ppo.yaml" },
      { label: "Конфиг A2C", path: "configs/E04_BallBalance__a2c.yaml" },
    ],
    train: "python scripts/train.py --config configs/E04_BallBalance__ppo.yaml --all-seeds",
    notebook: "notebooks/E04_BallBalance__ppo.ipynb",
  },

  E05_FoodCollector: {
    id: "E05_FoodCollector",
    title: "Сборщик еды",
    task: "собрать полезную еду, обходя вредную",
    actions: "гибридные (непрерывные + дискретные)",
    algos: ["REINFORCE с базисом"],
    status: "done",
    evidence: "гибридные действия и GridSensor; ONNX 13 из 13 проверок; инференс в Unity проверен",
    links: [
      { label: "Карточка среды", path: "docs/envs/E05_FoodCollector.md" },
      { label: "Спецификация", path: `${ENVS}/E05_FoodCollector/ENV_SPEC.md` },
      { label: "Агент: GridSensor и гибридные действия", path: `${ENVS}/E05_FoodCollector/Scripts/FoodCollectorAgent.cs` },
      { label: "REINFORCE с базисом", path: "python/labrl/algos/reinforce.py" },
      { label: "Гибридная политика", path: "python/labrl/nets/hybrid_policy.py" },
      { label: "Конфиг", path: "configs/E05_FoodCollector__reinforce.yaml" },
    ],
    train: "python scripts/train.py --config configs/E05_FoodCollector__reinforce.yaml --all-seeds",
    notebook: "notebooks/E05_FoodCollector__reinforce.ipynb",
  },

  E06_Hunter3D: {
    id: "E06_Hunter3D",
    title: "3D-охотник",
    task: "догнать движущуюся цель, обходя препятствия",
    actions: "Continuous 2",
    algos: ["PPO", "GAE", "потенциальное формирование награды"],
    status: "done",
    evidence:
      "PPO + GAE + PBRS, порог 80 % пойманных целей; γ обучения совпадает с shapingGamma агента — иначе теорема Ына не работает",
    links: [
      { label: "Карточка среды", path: "docs/envs/E06_Hunter3D.md" },
      { label: "Спецификация", path: `${ENVS}/E06_Hunter3D/ENV_SPEC.md` },
      { label: "Агент: формирование награды по расстоянию", path: `${ENVS}/E06_Hunter3D/Scripts/HunterAgent.cs` },
      { label: "PPO: клиппинг, GAE, несколько эпох", path: "python/labrl/algos/ppo.py" },
      { label: "Конфиг", path: "configs/E06_Hunter3D__ppo.yaml" },
    ],
    train: "python scripts/train.py --config configs/E06_Hunter3D__ppo.yaml --all-seeds",
    notebook: "notebooks/E06_Hunter3D__ppo.ipynb",
  },

  E07_RacingCar: {
    id: "E07_RacingCar",
    title: "Гоночный агент",
    task: "проехать круг по трассе, не разбившись",
    actions: "Continuous 2",
    algos: ["SAC", "подбор гиперпараметров"],
    status: "done",
    evidence:
      "SAC на непрерывном управлении, порог 80 % замкнутых кругов; ONNX 13 из 13 проверок; инференс в Unity проверен",
    links: [
      { label: "Карточка среды", path: "docs/envs/E07_RacingCar.md" },
      { label: "Спецификация", path: `${ENVS}/E07_RacingCar/ENV_SPEC.md` },
      { label: "Агент: лучи, руль и газ", path: `${ENVS}/E07_RacingCar/Scripts/RacingAgent.cs` },
      { label: "SAC: два критика, автоподстройка α", path: "python/labrl/algos/sac.py" },
      { label: "HPO: случайный поиск и деление пополам", path: "python/labrl/eval/hpo.py" },
      { label: "Конфиг", path: "configs/E07_RacingCar__sac.yaml" },
    ],
    train: "python scripts/train.py --config configs/E07_RacingCar__sac.yaml --all-seeds",
    notebook: "notebooks/E07_RacingCar__sac.ipynb",
  },

  E08_SoccerArena: {
    id: "E08_SoccerArena",
    title: "Футбол 2 × 2",
    task: "две команды по два игрока забивают друг другу",
    actions: "Discrete 3×3×3",
    algos: ["MA-POCA", "Self-Play", "PBRS"],
    status: "ready",
    evidence:
      "Python видит два поведения и четыре группы, obs_dim 64, 178 шагов в секунду; ONNX 15 из 15 проверок. Без формирования награды среда необучаема — измерено: ноль голов за 1400 случайных шагов",
    links: [
      { label: "Карточка среды", path: "docs/envs/E08_SoccerArena.md" },
      { label: "Спецификация", path: `${ENVS}/E08_SoccerArena/ENV_SPEC.md` },
      { label: "Арена: зеркальный порядок тегов у команд", path: `${ENVS}/E08_SoccerArena/Scripts/SoccerArea.cs` },
      { label: "MA-POCA: централизованный критик", path: "python/labrl/algos/mapoca.py" },
      { label: "Self-Play: пул снимков и ELO", path: "python/labrl/train/selfplay.py" },
      { label: "Внимание над группой агентов", path: "python/labrl/nets/attention.py" },
      { label: "Конфиг", path: "configs/E08_SoccerArena__mapoca.yaml" },
    ],
    train: "python scripts/train.py --config configs/E08_SoccerArena__mapoca.yaml --all-seeds",
    notebook: "notebooks/E08_SoccerArena__mapoca.ipynb",
  },

  E09_CurriculumMaze: {
    id: "E09_CurriculumMaze",
    title: "Лабиринт растущей сложности",
    task: "найти выход в лабиринте, который становится больше по мере обучения",
    actions: "Discrete 1×4",
    algos: ["PPO", "Curriculum Learning", "Domain Randomization"],
    status: "ready",
    evidence:
      "difficulty 0 / 0.33 / 0.67 / 1 даёт сетку 5 / 7 / 9 / 11 на живой сборке; базовая линия случайной политики измерена — 70 / 32 / 7 / 5 %",
    links: [
      { label: "Карточка среды", path: "docs/envs/E09_CurriculumMaze.md" },
      { label: "Спецификация", path: `${ENVS}/E09_CurriculumMaze/ENV_SPEC.md` },
      { label: "Арена: генерация и проверка разрешимости", path: `${ENVS}/E09_CurriculumMaze/Scripts/MazeArea.cs` },
      { label: "Расписание сложности и рандомизация", path: "python/labrl/train/curriculum.py" },
      { label: "Конфиг", path: "configs/E09_CurriculumMaze__ppo_curriculum.yaml" },
    ],
    train: "python scripts/train.py --config configs/E09_CurriculumMaze__ppo_curriculum.yaml --all-seeds",
    notebook: "notebooks/E09_CurriculumMaze__ppo_curriculum.ipynb",
  },

  E10_Imitation: {
    id: "E10_Imitation",
    title: "Коридор-змейка",
    task: "пройти длинный извилистый коридор, где награда слишком редкая для чистого RL",
    actions: "Discrete 1×4",
    algos: ["Behavioral Cloning", "GAIL"],
    status: "ready",
    evidence:
      "случайная политика — 0 успехов из 104, эксперт — 104 из 104 ровно за 48 ходов; BC решает задачу за 18 секунд, чистый PPO на бюджете вшестеро большем — нет",
    links: [
      { label: "Карточка среды", path: "docs/envs/E10_Imitation.md" },
      { label: "Спецификация", path: `${ENVS}/E10_Imitation/ENV_SPEC.md` },
      { label: "Коридор: правило раскладки стен", path: `${ENVS}/E10_Imitation/Scripts/CorridorArea.cs` },
      { label: "Behavioral Cloning", path: "python/labrl/algos/bc.py" },
      { label: "GAIL: награда −log(1−D)", path: "python/labrl/algos/gail.py" },
      { label: "Демонстрации эксперта", path: "python/labrl/envs/demos.py" },
      { label: "Конфиг BC", path: "configs/E10_Imitation__bc.yaml" },
      { label: "Конфиг GAIL", path: "configs/E10_Imitation__gail.yaml" },
      { label: "Контрольный PPO — для сравнения", path: "configs/E10_Imitation__ppo_discrete.yaml" },
    ],
    train: "python scripts/train.py --config configs/E10_Imitation__bc.yaml --all-seeds",
    notebook: "notebooks/E10_Imitation__bc_gail.ipynb",
  },

  E11_Research: {
    id: "E11_Research",
    title: "Ключ и дверь",
    task: "взять ключ, открыть дверь, дойти до цели",
    actions: "Discrete 1×4",
    algos: ["PPO", "слой понятий FCA"],
    status: "ready",
    evidence:
      "решётка из 19 понятий; эквивалентность «есть ключ ≡ дверь открыта» метод обнаружил сам; контрольный PPO без слоя понятий идёт рядом — сравнивать надо по числу шагов до порога",
    links: [
      { label: "Карточка среды", path: "docs/envs/E11_Research.md" },
      { label: "Спецификация", path: `${ENVS}/E11_Research/ENV_SPEC.md` },
      { label: "Агент: семь бинарных признаков", path: `${ENVS}/E11_Research/Scripts/KeyDoorAgent.cs` },
      { label: "Формальный анализ понятий: Close-by-One", path: "python/labrl/utils/fca.py" },
      { label: "Слой понятий внутри графа политики", path: "python/labrl/nets/fca.py" },
      { label: "Разбор метода", path: "docs/algos/fca_ppo.md" },
      { label: "Конфиг", path: "configs/E11_Research__fca_ppo.yaml" },
      { label: "Контрольный PPO — для сравнения", path: "configs/E11_Research__ppo_discrete.yaml" },
    ],
    train: "python scripts/train.py --config configs/E11_Research__fca_ppo.yaml --all-seeds",
    notebook: "notebooks/E11_Research__fca_ppo.ipynb",
  },
};

export interface LabPractice {
  envId: LabEnvId;
  /** Почему именно эта среда уместна здесь и сейчас. */
  whyThisNow: string;
  /**
   * Файлы, которые стоит открыть первыми именно из этого места курса.
   * Пусто — показывается полный список среды.
   */
  focus?: string[];
}

/**
 * Где какая среда уместна. Ключ — идентификатор урока (`1-4`, `project-2`),
 * маршрут хаба (`/algorithms/ppo`) или страницы проекта.
 *
 * Соответствие «урок → среда» взято из карты лаборатории
 * `docs/02_LESSON_MAP.md`, а не придумано здесь: карта — источник истины,
 * и она же держит статусы.
 */
export const LAB_PRACTICE: Record<string, LabPractice[]> = {
  // ── Ступень 1 ──
  "1-1": [
    {
      envId: "E01_GridWorld",
      whyThisNow:
        "Самый маленький MDP, какой бывает: 25 состояний, 4 действия, известный заранее оптимум. На нём видно всё, о чём идёт речь во введении.",
      focus: [`${ENVS}/E01_GridWorld/ENV_SPEC.md`, `${ENVS}/E01_GridWorld/Scripts/GridWorldEnvironment.cs`],
    },
  ],
  "1-2": [
    {
      envId: "E01_GridWorld",
      whyThisNow:
        "Проверить установку удобнее всего на самой лёгкой среде: сборка занимает минуту, обучение — полминуты.",
      focus: ["configs/E01_GridWorld__qlearning.yaml"],
    },
  ],
  "1-3": [
    {
      envId: "E01_GridWorld",
      whyThisNow:
        "Value Iteration требует знания модели переходов. В лаборатории эта модель выписана явно на Python и сверяется с живой средой Unity переход за переходом.",
      focus: [
        "python/labrl/algos/tabular/value_iteration.py",
        `${ENVS}/E01_GridWorld/Scripts/GridWorldEnvironment.cs`,
      ],
    },
  ],
  "1-4": [
    {
      envId: "E01_GridWorld",
      whyThisNow:
        "Табличный Q-learning на той же среде, где Value Iteration уже дал точный ответ 0.68. Есть с чем сравнить выученное.",
      focus: ["python/labrl/algos/tabular/q_learning.py", "configs/E01_GridWorld__qlearning.yaml"],
    },
  ],
  "1-5": [
    {
      envId: "E02_CartPoleUnity",
      whyThisNow:
        "Тот же CartPole, но в Unity: непрерывное состояние приходится дискретизировать, и сетка дискретизации уезжает прямо внутрь графа ONNX.",
    },
  ],
  "1-6": [
    {
      envId: "E03_RollerBall",
      whyThisNow:
        "Double DQN написан своим кодом: буфер воспроизведения, целевая сеть, функция Хубера — всё в одном файле, рядом с конфигом, который эти параметры задаёт.",
    },
  ],
  "1-7": [
    {
      envId: "E00_Bandit",
      whyThisNow:
        "Три стратегии разведки на одной задаче и одном бюджете — только так их кривые сравнимы. Сожаление измерено: 0.0862 у ε-greedy против 0.0011 у Thompson.",
    },
  ],
  "project-1": [
    {
      envId: "E04_BallBalance",
      whyThisNow:
        "Полный цикл на непрерывном управлении: сцена → сборка → обучение → ONNX → инференс обратно в Unity. PPO выбирает максимум среды.",
    },
  ],

  // ── Ступень 2 ──
  "2-1": [
    {
      envId: "E05_FoodCollector",
      whyThisNow:
        "REINFORCE с базисом на гибридных действиях: часть действий непрерывная, часть дискретная, наблюдение идёт через GridSensor.",
    },
  ],
  "2-2": [
    {
      envId: "E06_Hunter3D",
      whyThisNow:
        "PPO целиком своим кодом: отношение вероятностей, клиппинг, GAE, несколько эпох по одному набору данных.",
      focus: ["python/labrl/algos/ppo.py", "configs/E06_Hunter3D__ppo.yaml"],
    },
  ],
  "2-3": [
    {
      envId: "E04_BallBalance",
      whyThisNow:
        "A2C и PPO на одной среде и одном пороге: разница между ними видна не на словах, а в цифрах (97.12 против 100.00).",
    },
  ],
  "2-4": [
    {
      envId: "E06_Hunter3D",
      whyThisNow:
        "Потенциальное формирование награды по теореме Ына. Важная деталь: γ обучения обязана совпадать с shapingGamma агента, иначе гарантия неизменности оптимальной политики пропадает.",
      focus: [`${ENVS}/E06_Hunter3D/Scripts/HunterAgent.cs`, "docs/algos/ppo.md"],
    },
    {
      envId: "E08_SoccerArena",
      whyThisNow:
        "Случай, когда формирование награды не украшение, а условие обучаемости: без него за 1400 случайных шагов не забивается ни одного гола.",
      focus: ["docs/envs/E08_SoccerArena.md"],
    },
  ],
  "2-5": [
    {
      envId: "E06_Hunter3D",
      whyThisNow:
        "Векторизация в лаборатории сделана так: N арен в одной сцене Python видит как N параллельных сред. У этой среды их восемь.",
      focus: ["python/labrl/envs/vec_unity_env.py", "configs/E06_Hunter3D__ppo.yaml"],
    },
  ],
  "2-6": [
    {
      envId: "E06_Hunter3D",
      whyThisNow:
        "Схема тегов TensorBoard в лаборатории обязательная и одинаковая для всех восемнадцати конвейеров — иначе прогоны не сравнить.",
      focus: ["docs/05_TENSORBOARD.md", "python/labrl/logging/tb_logger.py"],
    },
  ],
  "project-2": [
    {
      envId: "E06_Hunter3D",
      whyThisNow:
        "Тот же проект целиком: два сенсора (лучи и вектор), PPO с GAE, формирование награды и приёмка по доле пойманных целей, а не по награде.",
    },
  ],
  "project-3": [
    {
      envId: "E07_RacingCar",
      whyThisNow:
        "SAC выбран не по вкусу: заезд длинный, авария обрывает его через десяток шагов, и off-policy метод переиспользует каждый переход многократно.",
    },
  ],

  // ── Ступень 3 ──
  "3-1": [
    {
      envId: "E07_RacingCar",
      whyThisNow:
        "SAC своим кодом: два критика, max-entropy цель, автоподстройка α, мягкое обновление целевых сетей с tau 0.005.",
      focus: ["python/labrl/algos/sac.py", "configs/E07_RacingCar__sac.yaml"],
    },
  ],
  "3-2": [
    {
      envId: "E08_SoccerArena",
      whyThisNow:
        "MA-POCA с централизованным критиком и контрфактным базисом плюс self-play с пулом снимков и ELO. Зеркальный порядок тегов у двух команд — тот трюк, который позволяет обучать обе одной сетью.",
    },
  ],
  "3-3": [
    {
      envId: "E09_CurriculumMaze",
      whyThisNow:
        "Учебный план и рандомизация домена вместе: без рандомизации агент выучивает конкретную планировку, а не умение искать выход. Базовая линия случайной политики измерена по всем четырём уровням.",
    },
  ],
  "3-4": [
    {
      envId: "E10_Imitation",
      whyThisNow:
        "Среда построена ровно ради этого урока: показать поведение здесь дешевле, чем формализовать награду. Измерено — BC решает коридор за 18 секунд, чистый RL на бюджете вшестеро большем не решает вовсе.",
    },
  ],
  "3-5": [
    {
      envId: "E03_RollerBall",
      whyThisNow:
        "Ключевой пример проверки пути ONNX → Unity: контракт экспорта, верификация графа и приёмка по отношению награды в Unity к Python-оценке (получилось 1.004).",
      focus: ["docs/04_ONNX_CONTRACT.md", "python/labrl/export/onnx_export.py"],
    },
  ],
  "3-6": [
    {
      envId: "E07_RacingCar",
      whyThisNow:
        "Подбор гиперпараметров реализован своим кодом — случайный поиск и последовательное деление пополам, без внешних библиотек.",
      focus: ["python/labrl/eval/hpo.py"],
    },
  ],
  "3-7": [
    {
      envId: "E08_SoccerArena",
      whyThisNow:
        "Внимание над переменным числом агентов (RSA): архитектура, которая нужна, когда партнёров может быть разное количество.",
      focus: ["python/labrl/nets/attention.py"],
    },
    {
      envId: "E05_FoodCollector",
      whyThisNow: "Гибридная политика: одна сеть выдаёт и непрерывную, и дискретную часть действия.",
      focus: ["python/labrl/nets/hybrid_policy.py"],
    },
  ],
  "3-8": [
    {
      envId: "E11_Research",
      whyThisNow:
        "Пример собственного исследования, доведённого до конца: авторская архитектура, контрольный метод для сравнения и честный вывод о том, что задачу надо усложнять.",
    },
  ],

  // ── Хабы и модули ──
  "/algorithms/ppo": [
    {
      envId: "E06_Hunter3D",
      whyThisNow: "PPO своим кодом на среде, где он проверен: клиппинг, GAE, линейно затухающий шаг обучения.",
    },
    {
      envId: "E04_BallBalance",
      whyThisNow: "PPO против A2C на одной задаче и одном пороге — разница в цифрах, а не в описании.",
    },
  ],
  "/algorithms/sac": [
    {
      envId: "E07_RacingCar",
      whyThisNow: "SAC на непрерывном управлении: два критика, автоподстройка α, буфер на весь прогон.",
    },
  ],
  "/algorithms/dqn": [
    {
      envId: "E03_RollerBall",
      whyThisNow: "Double DQN на дискретных действиях — и ключевой пример проверки пути ONNX → Unity.",
    },
    {
      envId: "E02_CartPoleUnity",
      whyThisNow:
        "Классический полигон DQN, перенесённый в Unity: непрерывное состояние дискретизируется, и сетка уезжает внутрь графа ONNX.",
    },
    {
      envId: "E01_GridWorld",
      whyThisNow: "Табличный предшественник DQN на среде с точно известным оптимумом.",
    },
  ],
  "/algorithms/a3c": [
    {
      envId: "E04_BallBalance",
      whyThisNow:
        "A2C — синхронный родственник A3C — реализован и проверен здесь; параллелизм в лаборатории сделан аренами в одной сцене, а не отдельными процессами.",
      focus: ["python/labrl/algos/a2c.py", "python/labrl/envs/vec_unity_env.py"],
    },
  ],
  "/algorithms": [
    {
      envId: "E06_Hunter3D",
      whyThisNow:
        "Все тринадцать алгоритмов лаборатории написаны своим кодом и проверены на средах — по карточке на метод.",
      focus: ["docs/algos/", "docs/02_LESSON_MAP.md"],
    },
  ],
  "/deep-rl": [
    {
      envId: "E06_Hunter3D",
      whyThisNow: "Опорный пример глубокого RL: PPO с GAE на непрерывном управлении.",
    },
    {
      envId: "E08_SoccerArena",
      whyThisNow: "Верхняя планка: мультиагентное обучение с централизованным критиком и self-play.",
    },
    {
      envId: "E10_Imitation",
      whyThisNow: "BC и GAIL своим кодом — и среда, на которой видно, зачем они вообще нужны.",
    },
  ],
  "/unity-ml-agents": [
    {
      envId: "E01_GridWorld",
      whyThisNow:
        "Как устроен мост Python ↔ Unity: сцена собирается кодом, N арен видны как N параллельных сред, модель уезжает в Unity через ONNX.",
      focus: [
        "python/labrl/envs/unity_env.py",
        "python/labrl/envs/vec_unity_env.py",
        `${ENVS}/E01_GridWorld/Editor/GridWorldSetup.cs`,
      ],
    },
  ],
  "/pytorch": [
    {
      envId: "E03_RollerBall",
      whyThisNow:
        "Сети лаборатории — обычный PyTorch: полносвязная сеть, категориальная и гауссова политики, обучение на nn.Module без обёрток.",
      focus: ["python/labrl/nets/mlp.py", "python/labrl/algos/dqn.py"],
    },
  ],
  "/fca-rl": [
    {
      envId: "E11_Research",
      whyThisNow:
        "Формальный анализ понятий, доведённый до работающего агента: наблюдение читается как формальный контекст, решётка понятий становится слоем признаков политики.",
    },
  ],
  "/advanced": [
    {
      envId: "E08_SoccerArena",
      whyThisNow: "MA-POCA, self-play и внимание над группой агентов — самое сложное, что есть в лаборатории.",
    },
    {
      envId: "E09_CurriculumMaze",
      whyThisNow:
        "Учебный план и рандомизация домена, доведённые до измеримого результата: сложность растёт от сетки 5×5 до 11×11, базовая линия снята по каждому уровню.",
    },
    {
      envId: "E10_Imitation",
      whyThisNow:
        "Имитационное обучение там, где оно действительно нужно: награда слишком редкая, и BC решает задачу, а чистый RL — нет.",
    },
    {
      envId: "E11_Research",
      whyThisNow: "Авторская архитектура со слоем понятий и контрольным методом для честного сравнения.",
    },
  ],
  "/advanced/onnx-sentis": [
    {
      envId: "E03_RollerBall",
      whyThisNow:
        "Контракт экспорта ONNX выписан и проверен: имена входов и выходов, opset, тип discrete_actions, приёмка по отношению награды в Unity к Python-оценке.",
      focus: ["docs/04_ONNX_CONTRACT.md", "python/labrl/export/onnx_export.py"],
    },
  ],
  "/labs": [
    {
      envId: "E00_Bandit",
      whyThisNow: "Три стратегии разведки на одной задаче — самая быстрая среда лаборатории для экспериментов.",
    },
  ],
  "/hub/research": [
    {
      envId: "E11_Research",
      whyThisNow: "Исследовательская среда лаборатории: слой понятий FCA внутри графа политики.",
    },
  ],

  "/code-examples": [
    {
      envId: "E01_GridWorld",
      whyThisNow:
        "Самый короткий полный пример: MDP на C# в Unity, Value Iteration и табличный Q-learning на Python, экспорт таблицы в ONNX.",
    },
    {
      envId: "E03_RollerBall",
      whyThisNow: "Double DQN целиком в одном файле — вместе с конфигом, который задаёт все его параметры.",
    },
    {
      envId: "E06_Hunter3D",
      whyThisNow: "PPO с GAE и формированием награды: сцена, агент, алгоритм и конфиг рядом друг с другом.",
    },
  ],
  "/courses": [
    {
      envId: "E01_GridWorld",
      whyThisNow:
        "К курсу собрана лаборатория из двенадцати сред: у каждого урока есть среда, конфиг и ноутбук, а карта соответствий ведётся отдельным документом.",
      focus: ["README.md", "docs/02_LESSON_MAP.md", "docs/RESULTS.md"],
    },
  ],
  "/math-rl": [
    {
      envId: "E01_GridWorld",
      whyThisNow:
        "Опорная среда пособия: 25 состояний, четыре действия и точно посчитанный оптимум 0.68 — есть с чем сверять любую формулу.",
      focus: [
        `${ENVS}/E01_GridWorld/ENV_SPEC.md`,
        "python/labrl/envs/gridworld_mdp.py",
        "python/labrl/algos/tabular/value_iteration.py",
      ],
    },
  ],
  "/visualizations": [
    {
      envId: "E06_Hunter3D",
      whyThisNow:
        "Клиппинг PPO и оценка преимущества — не картинка, а код, который обучает работающего агента.",
      focus: ["python/labrl/algos/ppo.py", "configs/E06_Hunter3D__ppo.yaml"],
    },
  ],
  "/visualizations/q-learning": [
    {
      envId: "E01_GridWorld",
      whyThisNow:
        "Та же таблица Q на настоящей среде Unity — и рядом Value Iteration, который даёт точный ответ для сверки.",
      focus: [
        "python/labrl/algos/tabular/q_learning.py",
        "python/labrl/algos/tabular/value_iteration.py",
      ],
    },
  ],
  "/pytorch/cheatsheet": [
    {
      envId: "E03_RollerBall",
      whyThisNow:
        "Как эти приёмы выглядят в рабочем проекте: nn.Module для Q-сети, обучение с функцией Хубера, экспорт state_dict в ONNX.",
      focus: ["python/labrl/nets/mlp.py", "python/labrl/algos/dqn.py", "python/labrl/export/onnx_export.py"],
    },
  ],

  // ── Страницы проектов ──
  "/unity-projects": [
    {
      envId: "E01_GridWorld",
      whyThisNow:
        "Двенадцать собранных сред в одном Unity-проекте: от бандита до мультиагентного футбола, у каждой карточка, конфиг и ноутбук.",
      focus: ["README.md", "docs/02_LESSON_MAP.md", "docs/envs/"],
    },
  ],
  "/unity-projects/gridworld": [
    {
      envId: "E01_GridWorld",
      whyThisNow: "Та же сетка 5×5 в лаборатории: Value Iteration и табличный Q-learning на одной модели MDP.",
    },
  ],
  "/unity-projects/ball-balance": [
    {
      envId: "E04_BallBalance",
      whyThisNow: "Та же задача в лаборатории, обученная дважды — A2C и PPO — с одинаковым порогом приёмки.",
    },
  ],
  "/unity-projects/food-collector": [
    {
      envId: "E05_FoodCollector",
      whyThisNow: "Та же среда в лаборатории: GridSensor, гибридные действия, REINFORCE с базисом.",
    },
  ],
  "/unity-projects/racing": [
    {
      envId: "E07_RacingCar",
      whyThisNow: "Тот же гоночный агент в лаборатории: SAC и подбор гиперпараметров своим кодом.",
    },
  ],
  "/unity-projects/soccer": [
    {
      envId: "E08_SoccerArena",
      whyThisNow: "Тот же футбол 2 × 2 в лаборатории: MA-POCA и self-play, сцена собрана и проверена.",
    },
  ],
  "/unity-projects/taxi-v3": [
    {
      envId: "E01_GridWorld",
      whyThisNow:
        "Ближайший родственник Taxi в лаборатории: дискретный MDP на индексах клеток, где табличный метод сравнивается с точным оптимумом.",
    },
  ],
  "/projects/frozen-lake": [
    {
      envId: "E01_GridWorld",
      whyThisNow:
        "Скольжение FrozenLake в лаборатории реализовано как параметр той же сетки: slipProbability превращает детерминированные переходы в стохастические.",
      focus: [`${ENVS}/E01_GridWorld/Scripts/GridWorldEnvironment.cs`, "python/labrl/envs/gridworld_mdp.py"],
    },
  ],

  // ── Блог ──
  "/blog/mapoca-guide": [
    {
      envId: "E08_SoccerArena",
      whyThisNow: "Рабочая реализация MA-POCA: централизованный критик, контрфактный базис, буфер для групп агентов.",
    },
  ],
  "/blog/ppo-vs-sac": [
    {
      envId: "E06_Hunter3D",
      whyThisNow: "PPO на непрерывном управлении — одна сторона сравнения.",
    },
    {
      envId: "E07_RacingCar",
      whyThisNow: "SAC на непрерывном управлении — вторая сторона, с объяснением, почему здесь выбран именно он.",
    },
  ],
  "/blog/reinforce-vs-ppo": [
    {
      envId: "E05_FoodCollector",
      whyThisNow: "REINFORCE с базисом в рабочем виде.",
      focus: ["python/labrl/algos/reinforce.py"],
    },
    {
      envId: "E06_Hunter3D",
      whyThisNow: "PPO на сопоставимой задаче — есть с чем сравнивать.",
      focus: ["python/labrl/algos/ppo.py"],
    },
  ],
  "/blog/parallel-envs": [
    {
      envId: "E06_Hunter3D",
      whyThisNow:
        "Восемь арен в одной сцене, time_scale 20 (выше физика PhysX ломается) — параллелизм без отдельных процессов.",
      focus: ["python/labrl/envs/vec_unity_env.py", "configs/E06_Hunter3D__ppo.yaml"],
    },
  ],
  "/blog/gridsensor-guide": [
    {
      envId: "E05_FoodCollector",
      whyThisNow: "GridSensor в работающей среде, вместе с гибридными действиями.",
    },
  ],
  "/blog/onnx-sentis-pipeline": [
    {
      envId: "E03_RollerBall",
      whyThisNow: "Полный путь модели: PyTorch → ONNX → Inference Engine в Unity, с верификацией графа на каждом шаге.",
      focus: ["docs/04_ONNX_CONTRACT.md", "python/labrl/export/onnx_export.py"],
    },
  ],
  "/blog/jupyter-to-unity": [
    {
      envId: "E03_RollerBall",
      whyThisNow: "Ноутбук на каждую пару «среда + алгоритм»: обучение, графики, экспорт — и модель в Unity.",
    },
  ],
  "/blog/top-5-mistakes": [
    {
      envId: "E06_Hunter3D",
      whyThisNow:
        "Измеренные грабли лаборатории собраны отдельным документом — с симптомом, причиной и тем, чем чинилось.",
      focus: ["docs/07_TROUBLESHOOTING.md"],
    },
    {
      envId: "E09_CurriculumMaze",
      whyThisNow:
        "Про постепенное усложнение — с числами: та же среда на четырёх уровнях сложности и измеренная базовая линия случайной политики 70 / 32 / 7 / 5 %.",
    },
  ],
};

/** Среды, уместные в этом месте курса. Пусто — блок не показывается. */
export const getLabPractice = (key: string): LabPractice[] => LAB_PRACTICE[key] ?? [];
