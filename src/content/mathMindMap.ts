import {
  Infinity as InfinityIcon,
  TrendingUp,
  Grid3x3,
  Dices,
  Target,
  Sigma,
  BrainCircuit,
} from "lucide-react";
import type { MapBranch, MapNode, BranchColor } from "@/content/knowledgeMap";
import { LECTURES } from "@/content/textbook/index.generated";
import { partByHubRoute } from "@/content/textbook/parts";
import { slugify } from "@/lib/slug";

/**
 * Данные для интерактивной mind-map хаба «Математика RL» (/math-rl/mindmap).
 * Семь разделов хаба = семь ветвей.
 *
 * Клик по узлу открывает полную лекцию учебного пособия; прежний deep-link
 * на обзорный раздел хаба остаётся второй ссылкой узла. Маршрут лекции здесь
 * не пишется руками: он ищется по паре «ветвь + подпись узла» в сгенерированном
 * индексе (поле mindmap_node во frontmatter лекции). Опечатка в маршруте на
 * карте — самая незаметная поломка из всех, поэтому руками их не набираем.
 *
 * Источник истины по структуре — массив `parts` и `partSubtopics`
 * в src/pages/MathRL.tsx. Не дублируй полный список подтем — здесь курируем
 * верхнеуровневые разделы.
 */

/** Лекция пособия, соответствующая узлу карты, — по части и подписи узла. */
const textbookFor = (base: string, label: string) => {
  const part = partByHubRoute(base);
  if (!part) return undefined;
  return LECTURES.find((l) => l.partSegment === part.segment && l.mindmapNode === label);
};

interface RawLeaf {
  label: string;
  /** Сырой текст подтемы для якоря (#slug). Если нет — ведёт к началу раздела. */
  anchor?: string;
  difficulty: MapNode["difficulty"];
}

interface RawBranch {
  id: string;
  label: string;
  caption: string;
  icon: MapBranch["icon"];
  color: BranchColor;
  /** Базовый путь модуля (открывает аккордеон нужной части). */
  base: string;
  leaves: RawLeaf[];
}

const RAW: RawBranch[] = [
  {
    id: "part-1",
    label: "I · Пределы и ряды",
    caption: "Сходимость, ряды, дисконтирование",
    icon: InfinityIcon,
    color: "cyan",
    base: "/math-rl/module-1",
    leaves: [
      { label: "Предел последовательности", anchor: "1. Теоретические основы: предел последовательности", difficulty: "beginner" },
      { label: "Бесконечные ряды и сходимость", anchor: "2. Бесконечные ряды и их сходимость", difficulty: "beginner" },
      { label: "Уравнения Беллмана", anchor: "4. Уравнения Беллмана и дисконтирование", difficulty: "intermediate" },
      { label: "Итерация ценности", anchor: "5. Итерация ценности: сходимость на практике", difficulty: "intermediate" },
      { label: "Дисконтирование в RL", anchor: "6. Дисконтирование в RL и его влияние", difficulty: "intermediate" },
      { label: "Визуализации сходимости", anchor: "8. Интерактивные визуализации сходимости", difficulty: "beginner" },
    ],
  },
  {
    id: "part-1b",
    label: "II · Производные и градиент",
    caption: "Дифференцирование и оптимизация",
    icon: TrendingUp,
    color: "emerald",
    base: "/math-rl/calculus",
    leaves: [
      { label: "Производные и дифференцирование", anchor: "§ 1. Производные и дифференцирование", difficulty: "beginner" },
      { label: "Частные производные и градиент", anchor: "§ 2. Частные производные и градиент", difficulty: "intermediate" },
      { label: "Градиентный спуск", anchor: "§ 3. Градиентный спуск и оптимизация", difficulty: "intermediate" },
      { label: "Policy Gradient", anchor: "§ 4. Применение в RL: Policy Gradient", difficulty: "advanced" },
      { label: "Весь раздел в одной картине", anchor: "§ 5. Весь раздел в одной картине", difficulty: "beginner" },
    ],
  },
  {
    id: "part-2",
    label: "III · Линейная алгебра",
    caption: "Векторы, матрицы, SVD",
    icon: Grid3x3,
    color: "blue",
    base: "/math-rl/module-2",
    leaves: [
      { label: "Векторы", anchor: "1. Векторы", difficulty: "beginner" },
      { label: "Матрицы", anchor: "2. Матрицы", difficulty: "beginner" },
      { label: "Скалярное произведение", anchor: "3. Скалярное произведение", difficulty: "beginner" },
      { label: "Собственные значения и векторы", anchor: "4. Собственные значения и собственные векторы", difficulty: "intermediate" },
      { label: "Сингулярное разложение (SVD)", anchor: "5. Сингулярное разложение (SVD)", difficulty: "advanced" },
      { label: "Дополнительные темы", anchor: "6. Дополнительные темы", difficulty: "advanced" },
    ],
  },
  {
    id: "part-3",
    label: "IV · Вероятность",
    caption: "От вероятности к алгоритмам RL",
    icon: Dices,
    color: "violet",
    base: "/math-rl/module-3",
    leaves: [
      { label: "Теория вероятностей", anchor: "1. Теория вероятностей", difficulty: "beginner" },
      { label: "Статистика", anchor: "2. Статистика", difficulty: "beginner" },
      { label: "Марковские процессы", anchor: "3. Марковские процессы", difficulty: "intermediate" },
      { label: "Функции ценности и Беллман", anchor: "4. Функции ценности и уравнения Беллмана", difficulty: "intermediate" },
      { label: "Алгоритмы RL", anchor: "5. Алгоритмы RL", difficulty: "advanced" },
      { label: "Примеры на Python", anchor: "6. Практические примеры (Python)", difficulty: "intermediate" },
    ],
  },
  {
    id: "part-4",
    label: "V · Оптимизация политик",
    caption: "Вывод градиента и PPO",
    icon: Target,
    color: "purple",
    base: "/math-rl/module-4",
    leaves: [
      { label: "Основы оптимизации политики", anchor: "Лекция 1. Основы RL и оптимизация политики", difficulty: "intermediate" },
      { label: "Вывод градиента политики", anchor: "Лекция 2. Вывод градиента политики", difficulty: "advanced" },
      { label: "Варианты градиентного спуска", anchor: "Лекция 3. Градиентный спуск и его варианты", difficulty: "intermediate" },
      { label: "PPO", anchor: "Лекция 4. Proximal Policy Optimization (PPO)", difficulty: "advanced" },
    ],
  },
  {
    id: "part-5",
    label: "VI · Фундаментальная RL",
    caption: "Беллман, TD, Actor-Critic",
    icon: Sigma,
    color: "pink",
    base: "/math-rl/module-5",
    leaves: [
      { label: "Вероятностный фундамент", anchor: "Глава 1. Теоретико-вероятностный фундамент", difficulty: "beginner" },
      { label: "Многорукие бандиты", anchor: "Глава 2. Многорукие бандиты: Исследование vs Использование", difficulty: "intermediate" },
      { label: "MDP", anchor: "Глава 3. Марковские процессы принятия решений (MDP)", difficulty: "intermediate" },
      { label: "Уравнения Беллмана", anchor: "Глава 5. Сердце RL: Уравнения Беллмана", difficulty: "intermediate" },
      { label: "Model-Free RL (TD)", anchor: "Глава 6. От динамического программирования к Model-Free RL", difficulty: "advanced" },
      { label: "Policy Gradients", anchor: "Глава 9. Методы градиента политики (Policy Gradients)", difficulty: "advanced" },
      { label: "Мост к Unity ML-Agents", anchor: "Глава 10. Мост к практике: Unity ML-Agents", difficulty: "advanced" },
    ],
  },
  {
    id: "part-6",
    label: "VII · Глубокое RL",
    caption: "DQN, статистика, дифуры",
    icon: BrainCircuit,
    color: "amber",
    base: "/math-rl/module-6",
    leaves: [
      { label: "Основные понятия Deep RL", anchor: "1.1 Основные понятия", difficulty: "intermediate" },
      { label: "Обзор алгоритмов RL", anchor: "1.2 Обзор алгоритмов RL", difficulty: "intermediate" },
      { label: "Математический анализ", anchor: "2.1 Математический анализ", difficulty: "advanced" },
      { label: "Вероятность и статистика", anchor: "2.2 Теория вероятностей и статистика", difficulty: "advanced" },
      { label: "Дифференциальные уравнения", anchor: "2.3 Дифференциальные уравнения", difficulty: "advanced" },
    ],
  },
];

function leafLink(base: string, anchor?: string): string {
  return anchor ? `${base}#${slugify(anchor)}` : base;
}

export const MATH_ROOT = {
  label: "Математика RL",
  caption: "Семь разделов: от пределов до глубокого RL",
  link: "/math-rl",
};

export const MATH_BRANCHES: MapBranch[] = RAW.map((b) => ({
  id: b.id,
  label: b.label,
  caption: b.caption,
  icon: b.icon,
  color: b.color,
  link: partByHubRoute(b.base) ? `/math-rl/textbook/${partByHubRoute(b.base)!.segment}` : b.base,
  nodes: b.leaves.map<MapNode>((l) => {
    const lecture = textbookFor(b.base, l.label);
    const hubLink = leafLink(b.base, l.anchor);
    return {
      id: `${b.id}-${slugify(l.label)}`,
      label: l.label,
      link: lecture?.route ?? hubLink,
      secondaryLink: lecture ? hubLink : undefined,
      secondaryLabel: lecture ? "краткая версия в хабе" : undefined,
      difficulty: l.difficulty,
      time: lecture?.duration ? `${lecture.duration} мин` : "тема",
      blurb: lecture?.description
        ? lecture.description.slice(0, 160)
        : `${b.label} · ${l.label}`,
    };
  }),
}));

/** Естественный порядок изучения = последовательность семи разделов. */
export const MATH_ORDER = RAW.map((b) => ({ id: b.id, label: b.label, base: b.base, color: b.color as BranchColor }));

export function getMathCoverage() {
  const branches = MATH_BRANCHES.length;
  const totalNodes = MATH_BRANCHES.reduce((s, b) => s + b.nodes.length, 0);
  /** Сколько узлов ведёт в полную лекцию пособия, а не только в обзор хаба. */
  const withTextbook = MATH_BRANCHES.reduce(
    (s, b) => s + b.nodes.filter((n) => n.secondaryLink).length,
    0,
  );
  return { branches, totalNodes, withTextbook, lectures: LECTURES.length, links: totalNodes + branches };
}
