/**
 * Каноническое соответствие частей пособия и структуры сайта.
 * Единственный источник истины: и генератор индекса (scripts/build-textbook-index.mjs),
 * и страницы, и mind map берут значения отсюда.
 *
 * Осторожно с двумя нумерациями. Каталог пособия и `part_id` во frontmatter
 * НЕ совпадают: `part_id` — это id части НА САЙТЕ (parts[] в src/pages/MathRL.tsx),
 * а каталог пронумерован по порядку чтения. Часть VI лежит в part-6-fundamental-rl,
 * а её `part_id` — "part-5", потому что в хабе она пятая по счёту сверху.
 * Генератор падает, если эти два значения разошлись.
 */

export interface TextbookPart {
  /** Сегмент URL: /math-rl/textbook/<segment> */
  segment: string;
  /** Каталог с .md внутри src/content/math-textbook */
  dir: string;
  /** id части на сайте — совпадает с part_id во frontmatter */
  sitePartId: string;
  /** Обзорный (краткий) вариант части в хабе */
  hubRoute: string;
  roman: string;
  title: string;
  /** Короткая подпись — та же, что у ветви mind map */
  caption: string;
  /** Число разделов по index.md части */
  sections: number;
}

export const TEXTBOOK_ROOT = "/math-rl/textbook";

export const TEXTBOOK_PARTS: TextbookPart[] = [
  {
    segment: "part-1",
    dir: "part-1-limits-series",
    sitePartId: "part-1",
    hubRoute: "/math-rl/module-1",
    roman: "I",
    title: "Пределы, последовательности и ряды",
    caption: "Сходимость, ряды, дисконтирование",
    sections: 12,
  },
  {
    segment: "part-2",
    dir: "part-2-derivatives-gradient",
    sitePartId: "part-1b",
    hubRoute: "/math-rl/calculus",
    roman: "II",
    title: "Производные, градиент и оптимизация",
    caption: "Дифференцирование и оптимизация",
    sections: 5,
  },
  {
    segment: "part-3",
    dir: "part-3-linear-algebra",
    sitePartId: "part-2",
    hubRoute: "/math-rl/module-2",
    roman: "III",
    title: "Линейная алгебра для RL",
    caption: "Векторы, матрицы, SVD",
    sections: 6,
  },
  {
    segment: "part-4",
    dir: "part-4-probability",
    sitePartId: "part-3",
    hubRoute: "/math-rl/module-3",
    roman: "IV",
    title: "От вероятности к алгоритмам RL",
    caption: "Ожидание, дисперсия, марковские процессы",
    sections: 6,
  },
  {
    segment: "part-5",
    dir: "part-5-policy-optimization",
    sitePartId: "part-4",
    hubRoute: "/math-rl/module-4",
    roman: "V",
    title: "Методы оптимизации политик",
    caption: "Вывод градиента и PPO",
    sections: 4,
  },
  {
    segment: "part-6",
    dir: "part-6-fundamental-rl",
    sitePartId: "part-5",
    hubRoute: "/math-rl/module-5",
    roman: "VI",
    title: "Фундаментальная математика RL",
    caption: "Беллман, TD, Actor-Critic",
    sections: 13,
  },
  {
    segment: "part-7",
    dir: "part-7-deep-rl",
    sitePartId: "part-6",
    hubRoute: "/math-rl/module-6",
    roman: "VII",
    title: "Глубокое обучение с подкреплением",
    caption: "DQN, статистика, дифуры",
    sections: 5,
  },
];

export const partBySegment = (segment: string): TextbookPart | undefined =>
  TEXTBOOK_PARTS.find((p) => p.segment === segment);

export const partByDir = (dir: string): TextbookPart | undefined =>
  TEXTBOOK_PARTS.find((p) => p.dir === dir);

/** Обратное направление: из части хаба — в часть пособия. */
export const partByHubRoute = (hubRoute: string): TextbookPart | undefined =>
  TEXTBOOK_PARTS.find((p) => p.hubRoute === hubRoute);

export const lectureRoute = (segment: string, slug: string): string =>
  `${TEXTBOOK_ROOT}/${segment}/${slug}`;

export const partRoute = (segment: string): string => `${TEXTBOOK_ROOT}/${segment}`;
