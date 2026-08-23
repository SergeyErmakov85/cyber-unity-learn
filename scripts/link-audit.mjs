// One-off internal link/anchor auditor. Run: node scripts/link-audit.mjs
import { readFileSync } from "node:fs";
import { globSync } from "node:fs";
import { execSync } from "node:child_process";

const files = execSync('git ls-files "src/**/*.tsx" "src/**/*.ts"', { encoding: "utf8" })
  .split("\n").filter(Boolean);

// Known SPA routes from App.tsx
const appSrc = readFileSync("src/App.tsx", "utf8");
const routes = new Set(
  [...appSrc.matchAll(/path="([^"]+)"/g)].map((m) => m[1]).filter((p) => p !== "*")
);

const idRe = /\bid=\{?["'`]([^"'`]+)["'`]/g;
const inPageHrefRe = /href=\{?[`"']#([^"'`{]+)["'`]/g;
const crossLinkRe = /(?:to|href)=\{?["'`](\/[^"'`{#]*)#([^"'`]+)["'`]/g;

const perFileIds = new Map();
const inPageAnchors = [];
const allIssues = [];
let totalIds = 0, totalInPage = 0, totalCross = 0;

for (const f of files) {
  if (f.includes("/ui/")) continue;
  const src = readFileSync(f, "utf8");
  const ids = [...src.matchAll(idRe)].map((m) => m[1]);
  perFileIds.set(f, ids);
  totalIds += ids.length;

  // duplicate ids in same file
  const seen = new Map();
  for (const id of ids) seen.set(id, (seen.get(id) || 0) + 1);
  for (const [id, n] of seen) if (n > 1) allIssues.push(`[DUP-ID] ${f}: id="${id}" defined ${n}x`);

  // in-page anchors collected; validated against the global id set afterwards
  // (a single rendered page composes many component files).
  for (const m of src.matchAll(inPageHrefRe)) {
    totalInPage++;
    const a = m[1];
    if (a.includes("${")) continue; // templated, skip
    inPageAnchors.push({ f, a });
  }
}

// ---- Global cross-page anchor validation ----
// Cross-page scroll resolves targets by document.getElementById on the
// destination page, so an anchor must exist as an id *somewhere* in src.
const slugify = (t) =>
  t.toLowerCase().replace(/[^\wа-яё]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60);

const globalIds = new Set();
for (const ids of perFileIds.values()) for (const id of ids) globalIds.add(id);

// Many section ids are generated at runtime from heading text via slugify(title)
// (math-rl modules) — add those so the static scan matches runtime reality.
for (const f of files) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(/title="([^"]+)"/g)) globalIds.add(slugify(m[1]));
}
// Секции многих уроков рендерятся как <motion.section id={s.id}> из константы
// SECTIONS — в разметке id виден только как объектный литерал { id: "..." }.
for (const f of files) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(/\bid:\s*["'`]([\wЀ-ӿ-]+)["'`]/g)) globalIds.add(m[1]);
}

// Лекции учебника приходят из .md: их якоря — slugify() от заголовков.
const mdFiles = execSync('git ls-files "src/content/**/*.md"', { encoding: "utf8" })
  .split("\n").filter(Boolean);
for (const f of mdFiles) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(/^#{1,6}\s+(.+?)\s*$/gm)) globalIds.add(slugify(m[1]));
}

// Known templated ids (e.g. Courses.tsx: id={`level-${index+1}`}).
["level-1", "level-2", "level-3"].forEach((id) => globalIds.add(id));

// in-page anchors: target id must exist on the rendered page (global set)
for (const { f, a } of inPageAnchors) {
  if (!globalIds.has(a)) allIssues.push(`[NO-TARGET] ${f}: href="#${a}" -> no id "${a}" in src`);
}

const decode = (s) => { try { return decodeURIComponent(s); } catch { return s; } };

// (a) cross links written inline as to=/href="/path#anchor"
for (const f of files) {
  if (f.includes("/ui/")) continue;
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(crossLinkRe)) {
    totalCross++;
    const [, path, anchorRaw] = m;
    const anchor = decode(anchorRaw);
    if (anchor.includes("${")) continue;
    if (!globalIds.has(anchor))
      allIssues.push(`[CROSS-NO-TARGET] ${f}: "${path}#${anchorRaw}" -> no id "${anchor}" anywhere in src`);
  }
}

// (a2) JSX-пропсы <CrossLinkToHub hubPath=".." hubAnchor=".."> и
// <CrossLinkToLesson ... anchor="..">. Форма записи не href="/path#anchor",
// поэтому crossLinkRe их не ловит — проверяем отдельно.
const jsxLinkRe = /<CrossLinkTo(?:Hub|Lesson)\b([^>]*?)\/?>/g;
for (const f of files) {
  if (f.includes("/ui/")) continue;
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(jsxLinkRe)) {
    const attrs = m[1];
    const pathM = attrs.match(/(?:hubPath|lessonPath)="([^"]+)"/);
    const anchorM = attrs.match(/(?:hubAnchor|anchor)="([^"]+)"/);
    const titleM = attrs.match(/hubTitle="([^"]+)"/);

    // Путь может нести якорь прямо в себе: hubPath="/courses/3-1#итоги"
    if (pathM) {
      const [p, inlineAnchor] = pathM[1].split("#");
      if (p && !p.startsWith("http") && !routes.has(p))
        allIssues.push(`[JSX-NO-ROUTE] ${f}: hubPath="${pathM[1]}" -> нет маршрута "${p}" в App.tsx`);
      if (inlineAnchor) {
        totalCross++;
        const a = decode(inlineAnchor);
        if (!a.includes("${") && !globalIds.has(a))
          allIssues.push(`[JSX-NO-TARGET] ${f}: "${pathM[1]}" -> нет id "${a}" в src`);
      }
    }
    if (anchorM) {
      totalCross++;
      const a = decode(anchorM[1]);
      if (!a.includes("${") && !globalIds.has(a))
        allIssues.push(
          `[JSX-NO-TARGET] ${f}: hubAnchor="${anchorM[1]}" -> нет id "${a}" в src` +
            (pathM ? ` (цель ${pathM[1]})` : "")
        );
    }
    // hubTitle виден пользователю в тултипе — заглушки туда попадать не должны.
    if (titleM && /TODO|FIXME|XXX|заглушк/i.test(titleM[1]))
      allIssues.push(`[JSX-PLACEHOLDER] ${f}: hubTitle="${titleM[1]}" — текст-заглушка виден в тултипе`);
  }
}

// (b) crosslinks.ts data table hub anchors
const cl = readFileSync("src/config/crosslinks.ts", "utf8");
for (const m of cl.matchAll(/hubAnchor:\s*["'`]([^"'`]+)["'`]/g)) {
  totalCross++;
  const anchor = decode(m[1]);
  if (!globalIds.has(anchor))
    allIssues.push(`[CROSSLINKS-NO-TARGET] crosslinks.ts: hubAnchor "${m[1]}" -> no matching id in src`);
}

console.log(`Files scanned: ${files.length}`);
console.log(`Total ids: ${totalIds}`);
console.log(`Total in-page anchors: ${totalInPage}`);
console.log(`Total cross-page anchors checked: ${totalCross}`);
console.log(`Routes in App.tsx: ${routes.size}`);
console.log(`\n=== ISSUES (${allIssues.length}) ===`);
for (const i of allIssues.sort()) console.log(i);
