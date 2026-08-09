/**
 * Генератор индекса учебного пособия.
 *
 * Читает src/content/math-textbook/**\/*.md, достаёт frontmatter и заголовки,
 * проверяет целостность и пишет src/content/textbook/index.generated.ts.
 *
 * Метаданные считаются здесь, а не в браузере: YAML в бандл тащить незачем,
 * а ошибки в структуре должны валить сборку, а не тихо показывать пустую страницу.
 *
 *   node scripts/build-textbook-index.mjs
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "src", "content", "math-textbook");
const OUT = join(ROOT, "src", "content", "textbook", "index.generated.ts");
const SITE = "https://rl-cuber-unity-code.com";
const TEXTBOOK_ROOT = "/math-rl/textbook";

/** Копия src/lib/slug.ts — менять только вместе с ней. */
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^\wа-яё]+/gi, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

/** Копия таблицы из src/content/textbook/parts.ts — сверяется тестом ниже. */
const PARTS = [
  { segment: "part-1", dir: "part-1-limits-series", sitePartId: "part-1", hubRoute: "/math-rl/module-1" },
  { segment: "part-2", dir: "part-2-derivatives-gradient", sitePartId: "part-1b", hubRoute: "/math-rl/calculus" },
  { segment: "part-3", dir: "part-3-linear-algebra", sitePartId: "part-2", hubRoute: "/math-rl/module-2" },
  { segment: "part-4", dir: "part-4-probability", sitePartId: "part-3", hubRoute: "/math-rl/module-3" },
  { segment: "part-5", dir: "part-5-policy-optimization", sitePartId: "part-4", hubRoute: "/math-rl/module-4" },
  { segment: "part-6", dir: "part-6-fundamental-rl", sitePartId: "part-5", hubRoute: "/math-rl/module-5" },
  { segment: "part-7", dir: "part-7-deep-rl", sitePartId: "part-6", hubRoute: "/math-rl/module-6" },
];

const errors = [];
const warnings = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

/** Убирает блоки кода — чтобы `#` и ссылки внутри них не считались разметкой. */
const stripFences = (body) => body.replace(/^```[\s\S]*?^```/gm, "");

const collectHeadings = (body) => {
  const headings = [];
  for (const m of stripFences(body).matchAll(/^(#{2,4})\s+(.+?)\s*$/gm)) {
    const text = m[2].replace(/\s*\{#[^}]+\}\s*$/, "").trim();
    headings.push({ level: m[1].length, text, slug: slugify(text) });
  }
  return headings;
};

/** Первый содержательный абзац после H1 — описание для SEO и карточек. */
const firstParagraph = (body) => {
  const afterH1 = body.replace(/^#\s+.+$/m, "");
  for (const block of stripFences(afterH1).split(/\n\s*\n/)) {
    const t = block.trim();
    if (!t || t.startsWith("#") || t.startsWith(">") || t.startsWith("|") || t.startsWith("-")) continue;
    return t
      .replace(/\$\$[\s\S]*?\$\$/g, "")
      .replace(/\$([^$]*)\$/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 300);
  }
  return "";
};

const linksOf = (body) => [...stripFences(body).matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)].map((m) => m[1]);

// ---------------------------------------------------------------- чтение
const lectures = [];
const partMeta = [];
const headingsByFile = new Map();

for (const part of PARTS) {
  const dir = join(CONTENT, part.dir);
  if (!existsSync(dir)) {
    fail(part.dir, "каталог части не найден");
    continue;
  }
  const files = readdirSync(dir).filter((f) => f.endsWith(".md")).sort();

  for (const file of files) {
    const rel = `${part.dir}/${file}`;
    const { data: fm, content: body } = matter(readFileSync(join(dir, file), "utf8"));
    const headings = collectHeadings(body);
    headingsByFile.set(rel, new Set(headings.map((h) => h.slug)));

    if (!fm.title) fail(rel, "нет title во frontmatter");
    if (fm.part_id && fm.part_id !== part.sitePartId)
      fail(rel, `part_id="${fm.part_id}" не совпадает с sitePartId="${part.sitePartId}" каталога`);
    if (!fm.status || fm.status === "empty") fail(rel, `status="${fm.status ?? "—"}"`);
    else if (fm.status !== "ready") warn(rel, `status="${fm.status}" — раздел не закончен`);

    if (file === "index.md") {
      partMeta.push({
        ...part,
        title: fm.title,
        description: firstParagraph(body),
        sections: fm.sections ?? files.length - 1,
        mindmapNodes: fm.mindmap_nodes ?? 0,
        headings,
      });
      continue;
    }

    const slug = file.replace(/\.md$/, "");
    lectures.push({
      id: fm.id ?? `${part.sitePartId}-${slug}`,
      partSegment: part.segment,
      partDir: part.dir,
      slug,
      route: `${TEXTBOOK_ROOT}/${part.segment}/${slug}`,
      title: fm.title,
      description: firstParagraph(body),
      order: typeof fm.order === "number" ? fm.order : Number.parseInt(slug, 10) || 0,
      difficulty: fm.difficulty ?? null,
      duration: fm.duration ?? null,
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      mindmapNode: fm.mindmap_node ?? null,
      hubRoute: part.hubRoute,
      hubAnchor: fm.hub_anchor_canonical ?? slugify(fm.title ?? ""),
      status: fm.status,
      headings,
    });
  }
}

// ---------------------------------------------------------------- проверки
const seen = new Map();
for (const l of lectures) {
  if (seen.has(l.id)) fail(`${l.partDir}/${l.slug}.md`, `дубль id "${l.id}" (уже в ${seen.get(l.id)})`);
  else seen.set(l.id, `${l.partDir}/${l.slug}.md`);
}

for (const part of PARTS) {
  const meta = partMeta.find((p) => p.segment === part.segment);
  if (!meta) fail(part.dir, "нет index.md части");
  const actual = lectures.filter((l) => l.partSegment === part.segment).length;
  if (meta && meta.sections !== actual)
    warn(part.dir, `index.md обещает ${meta.sections} разделов, в каталоге ${actual}`);
}

// Ссылки: относительные .md обязаны резолвиться, якорь — существовать.
for (const part of PARTS) {
  const dir = join(CONTENT, part.dir);
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const rel = `${part.dir}/${file}`;
    const body = matter(readFileSync(join(dir, file), "utf8")).content;
    for (const raw of linksOf(body)) {
      const href = decodeURIComponent(raw);
      if (/^(https?:|mailto:)/.test(href)) {
        if (href.startsWith(SITE)) {
          const path = href.slice(SITE.length).split("#")[0];
          if (!path.startsWith("/")) fail(rel, `странная ссылка на сайт: ${href}`);
        }
        continue;
      }
      if (href.startsWith("#")) {
        const anchor = href.slice(1);
        if (!headingsByFile.get(rel)?.has(anchor)) fail(rel, `якорь "#${anchor}" не найден в самом файле`);
        continue;
      }
      const [target, anchor] = href.split("#");
      if (!target.endsWith(".md")) continue; // путь к коду — по соглашению не ссылка
      const abs = resolve(join(CONTENT, part.dir), target);
      const targetRel = relative(CONTENT, abs).replace(/\\/g, "/");
      if (targetRel.startsWith("..")) {
        // Ссылка за пределы пособия — в исходный репозиторий (examples/, docs/).
        // На сайте такие ведут на GitHub, см. SOURCE_REPO в LectureLink.tsx.
        continue;
      }
      if (!existsSync(abs)) {
        fail(rel, `битая ссылка: ${href}`);
        continue;
      }
      if (anchor && headingsByFile.has(targetRel) && !headingsByFile.get(targetRel).has(anchor))
        fail(rel, `якорь "#${anchor}" не найден в ${targetRel}`);
    }
  }
}

// Запрещённые конструкции раскраски (ENF-COLOR-001, ENF-MATH-001).
for (const [rel] of headingsByFile) {
  const src = readFileSync(join(CONTENT, rel), "utf8");
  for (const bad of ["\\class{", "\\textcolor{", "\\color{"]) {
    if (src.includes(bad)) fail(rel, `запрещённая команда раскраски ${bad} — цвет задаётся макросами ролей`);
  }
}

// ---------------------------------------------------------------- мост в код
// _meta/unity-bridge.md связывает темы пособия с файлами репозитория сред.
// Таблица разбирается здесь, чтобы на страницах лекций не появилось второй,
// расходящейся копии этих путей.
const bridge = [];
const bridgeFile = join(CONTENT, "_meta", "unity-bridge.md");
if (existsSync(bridgeFile)) {
  const md = readFileSync(bridgeFile, "utf8");
  for (const line of md.split(/\r?\n/)) {
    const m = /^\|\s*`([a-z0-9-]+)`\s*\|\s*(.+?)\s*\|\s*`(.+?)`\s*\|\s*$/.exec(line);
    if (m) bridge.push({ tag: m[1], what: m[2], path: m[3] });
  }
  if (bridge.length === 0) fail("_meta/unity-bridge.md", "таблица тем не разобралась");
} else {
  warn("_meta/unity-bridge.md", "файл не найден — блок «Где это в коде» будет пустым");
}

// ---------------------------------------------------------------- вывод
lectures.sort((a, b) =>
  a.partSegment === b.partSegment ? a.order - b.order : a.partSegment.localeCompare(b.partSegment),
);

if (errors.length) {
  console.error(`\nОшибок: ${errors.length}`);
  for (const e of errors) console.error("  · " + e);
  process.exit(1);
}
if (warnings.length) {
  console.warn(`Предупреждений: ${warnings.length}`);
  for (const w of warnings) console.warn("  · " + w);
}

const banner = `// СГЕНЕРИРОВАНО scripts/build-textbook-index.mjs — не редактировать руками.
// Источник: src/content/math-textbook/**/*.md
// Пересобрать: npm run textbook:index
`;

const body = `${banner}
export interface LectureHeading {
  level: number;
  text: string;
  slug: string;
}

export interface LectureMeta {
  id: string;
  partSegment: string;
  partDir: string;
  slug: string;
  route: string;
  title: string;
  description: string;
  order: number;
  difficulty: "beginner" | "intermediate" | "advanced" | null;
  duration: number | null;
  tags: string[];
  mindmapNode: string | null;
  /** Краткая версия того же материала в хабе */
  hubRoute: string;
  hubAnchor: string;
  status: string;
  headings: LectureHeading[];
}

export interface PartMeta {
  segment: string;
  dir: string;
  sitePartId: string;
  hubRoute: string;
  title: string;
  description: string;
  sections: number;
  mindmapNodes: number;
}

export const LECTURES: LectureMeta[] = ${JSON.stringify(lectures, null, 2)};

export const PARTS_META: PartMeta[] = ${JSON.stringify(
  partMeta.map(({ headings, ...rest }) => rest),
  null,
  2,
)};

/** Разделы части в порядке чтения. */
export const PART_INDEX: Record<string, LectureMeta[]> = LECTURES.reduce(
  (acc, l) => {
    (acc[l.partSegment] ??= []).push(l);
    return acc;
  },
  {} as Record<string, LectureMeta[]>,
);

export const LECTURE_BY_ROUTE: Record<string, LectureMeta> = Object.fromEntries(
  LECTURES.map((l) => [l.route, l]),
);

export const findLecture = (partSegment: string, slug: string): LectureMeta | undefined =>
  LECTURES.find((l) => l.partSegment === partSegment && l.slug === slug);

export interface UnityBridgeRow {
  /** Тег лекции, к которой относится строка */
  tag: string;
  /** Что смотреть в этом файле */
  what: string;
  /** Путь от корня репозитория unity-ml-agents-lab */
  path: string;
}

/** Мост «математика → код сред». Источник: math-textbook/_meta/unity-bridge.md */
export const UNITY_BRIDGE: UnityBridgeRow[] = ${JSON.stringify(bridge, null, 2)};

export const TOTAL_LECTURES = ${lectures.length};
export const TOTAL_MINUTES = ${lectures.reduce((s, l) => s + (l.duration ?? 0), 0)};
`;

writeFileSync(OUT, body, "utf8");
console.log(`Индекс собран: ${lectures.length} лекций, ${partMeta.length} частей → ${relative(ROOT, OUT)}`);

// ---------------------------------------------------------------- sitemap
// Раздел учебника в public/sitemap.xml держим сгенерированным: список из
// 59 адресов руками не поддерживается, а забытая страница в поиск не попадёт.
// Остальная часть файла ведётся вручную и не трогается — правим только блок
// между маркерами.
const SITEMAP = join(ROOT, "public", "sitemap.xml");
const SITE_URL = "https://rl-cuber-unity-code.com";
const START = "  <!-- textbook:start -->";
const END = "  <!-- textbook:end -->";

const url = (path, priority) =>
  `  <url><loc>${SITE_URL}${path}</loc><priority>${priority}</priority><changefreq>monthly</changefreq></url>`;

const block = [
  START,
  url(TEXTBOOK_ROOT, "0.8"),
  ...PARTS.map((p) => url(`${TEXTBOOK_ROOT}/${p.segment}`, "0.7")),
  ...lectures.map((l) => url(l.route, "0.6")),
  END,
].join("\n");

let sitemap = readFileSync(SITEMAP, "utf8");
const from = sitemap.indexOf(START);
const to = sitemap.indexOf(END);

if (from >= 0 && to > from) {
  sitemap = sitemap.slice(0, from) + block + sitemap.slice(to + END.length);
} else {
  sitemap = sitemap.replace("</urlset>", `${block}\n</urlset>`);
}

writeFileSync(SITEMAP, sitemap, "utf8");
console.log(`sitemap.xml обновлён: ${lectures.length + PARTS.length + 1} адресов учебника`);
