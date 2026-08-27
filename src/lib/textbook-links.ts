import { partByDir, partRoute, lectureRoute, TEXTBOOK_ROOT } from "@/content/textbook/parts";

const SITE = "https://rl-cuber-unity-code.com";

/** Пособие живёт в отдельном репозитории; ссылки за его пределы ведут туда. */
export const SOURCE_REPO = "https://github.com/SergeyErmakov85/Math_for_DS_-_RL/blob/main";

/**
 * Лаборатория сред Unity ML-Agents — третий репозиторий связки. Адрес и правило
 * построения ссылок живут в реестре сред: он один на весь сайт, и второй копии
 * этих правил быть не должно.
 */
export { labUrl as unityLabUrl } from "@/content/labEnvironments";

const CONTENT_ROOT = "math-textbook";

/** Нормализует относительный путь так же, как это делает файловая система. */
const resolvePath = (baseDirs: string[], href: string): string[] => {
  const out = [...baseDirs];
  for (const segment of href.split("/")) {
    if (segment === "" || segment === ".") continue;
    if (segment === "..") out.pop();
    else out.push(segment);
  }
  return out;
};

/**
 * Внутренние ссылки пособия — относительные пути к .md. На сайте они должны
 * стать SPA-навигацией, а не перезагрузкой страницы и не 404.
 *
 *   ../part-1-limits-series/05-value-iteration.md#теорема-2
 *     → /math-rl/textbook/part-1/05-value-iteration#теорема-2
 *
 * Ссылки, уходящие выше каталога пособия (examples/, docs/ исходного
 * репозитория), и всё, что не markdown, ведут на GitHub: этих файлов
 * на сайте нет и не будет.
 */
export const resolveTextbookHref = (
  href: string,
  currentPartDir: string,
): { to: string; external: boolean } => {
  if (href.startsWith("#")) return { to: href, external: false };

  if (href.startsWith(SITE)) return { to: href.slice(SITE.length) || "/", external: false };

  if (/^(https?:|mailto:|tel:)/.test(href)) return { to: href, external: true };

  if (href.startsWith("/")) return { to: href, external: false };

  const [target, anchor] = href.split("#");
  const hash = anchor ? `#${anchor}` : "";

  const parts = resolvePath([CONTENT_ROOT, currentPartDir].filter(Boolean), target);

  if (!target.endsWith(".md")) {
    return { to: `${SOURCE_REPO}/${parts.join("/")}`, external: true };
  }

  if (parts[0] !== CONTENT_ROOT) {
    return { to: `${SOURCE_REPO}/${parts.join("/")}`, external: true };
  }

  const [, dir, file] = parts;

  // README.md / SUMMARY.md пособия — страница-оглавление на сайте.
  if (!file && (dir === "README.md" || dir === "SUMMARY.md")) {
    return { to: TEXTBOOK_ROOT + hash, external: false };
  }

  const part = partByDir(dir);
  if (!part || !file) {
    // _meta и прочее служебное — страниц на сайте нет, ведём в исходник.
    return { to: `${SOURCE_REPO}/${parts.join("/")}`, external: true };
  }

  const slug = file.replace(/\.md$/, "");
  const to = slug === "index" ? partRoute(part.segment) : lectureRoute(part.segment, slug);
  return { to: to + hash, external: false };
};
