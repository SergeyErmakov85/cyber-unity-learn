/**
 * Ленивая загрузка тела лекции.
 *
 * Метаданные приходят из index.generated.ts (посчитаны при сборке), здесь —
 * только markdown. Каждый файл становится отдельным чанком: страница лекции
 * тянет свой текст и ничего сверх него.
 */
const files = import.meta.glob("/src/content/math-textbook/**/*.md", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

/** Frontmatter уже разобран генератором — из тела его убираем. */
const stripFrontmatter = (source: string): string =>
  source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");

export async function loadMarkdown(partDir: string, slug: string): Promise<string> {
  const key = `/src/content/math-textbook/${partDir}/${slug}.md`;
  const load = files[key];
  if (!load) throw new Error(`Файл пособия не найден: ${key}`);
  return stripFrontmatter(await load());
}

/** README.md пособия — текст страницы-оглавления. */
export async function loadTextbookReadme(): Promise<string> {
  const load = files["/src/content/math-textbook/README.md"];
  if (!load) throw new Error("README пособия не найден");
  return stripFrontmatter(await load());
}
