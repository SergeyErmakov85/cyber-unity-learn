# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm i            # install dependencies
npm run dev      # start dev server (Vite, localhost:5173)
npm run build    # production build
npm run lint     # ESLint
```

No test suite is configured.

---

## Architecture

### Course data — single source of truth

All course structure lives in **`src/content/learningMap.ts`** (`LEARNING_MAP: Stage[]`). This is the canonical list of stages, lessons, and projects. `Courses.tsx`, `LessonLayout`, and `gamification.ts` all derive their data from it. Never duplicate the lesson list elsewhere.

- `src/content/lessonContextLinks.ts` — hub links shown inside lessons  
- `src/config/crosslinks.ts` — bidirectional cross-links between lessons and hubs  
- `src/content/hubs.ts` — support hub metadata (PyTorch, Unity ML-Agents, Math RL, etc.)  
- `src/data/lessons.ts` — additional meta for specific lessons (e.g. 2.6)

### Lesson pages

Each lesson page lives in `src/pages/CourseLesson*.tsx`.  
**Reference implementation: `src/pages/CourseLesson2_6.tsx`** — this is the gold standard for all lesson pages. Every new lesson must replicate its structure exactly.

### Mandatory page scaffold

Every lesson page **must** follow this top-level structure in this order:

```tsx
// 1. SEO
<SEOHead title="..." description="..." path="/courses/X-Y" type="article" />

// 2. Skip-to-content link (accessibility)
<a href="#lesson-content" className="sr-only focus:not-sr-only ...">К содержимому урока</a>

// 3. Scroll progress bar
<ScrollProgressBar color="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

// 4. Main container
<main className="container max-w-5xl mx-auto px-4 py-8">
  <ProGate preview={content}>{content}</ProGate>
</main>
```

Inside `content`:

```tsx
// Breadcrumbs → LessonHeader → SectionNav → sections → RelatedMaterials → CompleteButton card → NextPrevLesson
```

### Breadcrumbs

Always render breadcrumbs as `<nav aria-label="Хлебные крошки">` with `<ol>` + `<ChevronRight>` separators. Path: Главная → Курс → Уровень N → Урок X.Y.

### Section list

Define sections as a `SECTIONS: SectionNavItem[]` constant at module level:

```tsx
const SECTIONS: SectionNavItem[] = [
  { id: "intro",   label: "Введение" },
  { id: "...",     label: "..." },
];
```

Render each section as `<motion.section>` inside a `SECTIONS.map(...)`.

---

## Visual style — mandatory patterns (based on lesson 2.6)

> **These patterns are non-negotiable.** Every lesson page must implement all of them.

### Section wrapper class

```tsx
const SECTION_CLASS =
  "scroll-mt-24 py-16 px-6 md:px-10 bg-card/60 backdrop-blur-sm rounded-2xl border border-cyan-500/10";
```

### Section heading class

```tsx
const SECTION_TITLE_CLASS =
  "text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6";
```

Always use `<h2 className={`${SECTION_TITLE_CLASS} text-2xl md:text-3xl`}>` inside every section.

### Motion animations

Import `motion` from `framer-motion`. Every `<section>` must be a `<motion.section>`:

```tsx
const SECTION_VARIANTS = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// Inside map:
<motion.section
  key={s.id}
  id={s.id}
  className={SECTION_CLASS}
  variants={SECTION_VARIANTS}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, ease: "easeOut", delay: Math.min(i * 0.05, 0.25) }}
>
```

### Intro section structure (mandatory for every lesson)

The `intro` section **must** contain three layers in this order:

**Layer 1 — Hero card:**
```tsx
<Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm overflow-hidden">
  <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
    {/* left: title + description */}
    <div className="flex-1 space-y-3">
      <h3 className="text-2xl md:text-3xl font-bold text-foreground">...</h3>
      <p className="text-muted-foreground leading-relaxed">...</p>
    </div>
    {/* right: icon in glow-box */}
    <div className="shrink-0 w-20 h-20 rounded-2xl border border-cyan-400/40 bg-cyan-500/10
                    flex items-center justify-center
                    shadow-[0_0_32px_hsl(var(--primary)/0.45)]">
      <SomeIcon className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
    </div>
  </CardContent>
</Card>
```

**Layer 2 — TL;DR box:**
```tsx
<TldrBox items={[ <> ... </>, <> ... </> ]} />
```
Must have 2–4 items. Each item should contain inline `<strong>` for key terms and `<code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">` for code snippets.

**Layer 3 — Key findings grid:**
```tsx
const KEY_FINDINGS = [
  { title: "...", text: "...", icon: SomeLucideIcon, color: "cyan"    },
  { title: "...", text: "...", icon: SomeLucideIcon, color: "purple"  },
  { title: "...", text: "...", icon: SomeLucideIcon, color: "pink"    },
  { title: "...", text: "...", icon: SomeLucideIcon, color: "emerald" },
] as const;

const COLOR_MAP: Record<string, string> = {
  cyan:    "border-cyan-500/30 hover:border-cyan-400/70 hover:shadow-[0_0_24px_hsl(var(--primary)/0.35)] [&_svg]:text-cyan-400",
  purple:  "border-purple-500/30 hover:border-purple-400/70 hover:shadow-[0_0_24px_hsl(280_85%_65%/0.35)] [&_svg]:text-purple-400",
  pink:    "border-pink-500/30 hover:border-pink-400/70 hover:shadow-[0_0_24px_hsl(330_85%_65%/0.35)] [&_svg]:text-pink-400",
  emerald: "border-emerald-500/30 hover:border-emerald-400/70 hover:shadow-[0_0_24px_hsl(160_85%_55%/0.35)] [&_svg]:text-emerald-400",
};

// Render:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {KEY_FINDINGS.map(({ title, text, icon: Icon, color }) => (
    <Card key={title}
      className={`group bg-card/60 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${COLOR_MAP[color]}`}>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-bold text-foreground leading-snug">{title}</h4>
          <Icon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-110" />
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
      </CardContent>
    </Card>
  ))}
</div>
```

### CompleteButton (mandatory, every lesson)

Place before `<NextPrevLesson>`. Tracks scroll position (fires at 90%) AND provides manual click:

```tsx
const CompleteButton = () => {
  const [done, setDone] = useState<boolean>(() => isLessonComplete("X.Y"));

  useEffect(() => {
    if (done) return;
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - window.innerHeight)) * 100;
      if (pct >= 90) {
        markLessonComplete("X.Y");
        setDone(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [done]);

  return (
    <Button onClick={() => { markLessonComplete("X.Y"); setDone(true); }}
      disabled={done} size="lg"
      className="w-full md:w-auto bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500
                 text-white font-semibold shadow-[0_0_24px_hsl(var(--primary)/0.45)]
                 hover:shadow-[0_0_32px_hsl(280_85%_65%/0.55)] hover:scale-[1.02]
                 transition-all disabled:opacity-80 disabled:cursor-default">
      {done ? <><CheckCircle2 className="w-5 h-5 mr-2" />Пройдено</> : <>Отметить урок как пройденный ✓</>}
    </Button>
  );
};
```

Wrap it in the completion card:

```tsx
<Card className="mt-8 border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm">
  <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
    <p className="text-sm text-muted-foreground">Дочитали до конца? Зафиксируйте прогресс и получите XP.</p>
    <CompleteButton />
  </CardContent>
</Card>
```

### Card styles (reference)

| Use case | className |
|---|---|
| Hero gradient card | `border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm` |
| Standard content card | `bg-card/60 backdrop-blur-sm border border-cyan-500/10` |
| Completion card | `border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm` |
| Key finding card | `group bg-card/60 backdrop-blur-sm transition-all duration-300 hover:scale-105` + `COLOR_MAP[color]` |

### Section sub-components

Extract each section's content into a dedicated component in `src/components/lesson-X-Y/`:

```
src/components/lesson-2-6/
  MetricsTable.tsx
  TensorBoardSection.tsx
  WandbSection.tsx
  ComparisonTable.tsx
  CodeExamples.tsx
  DiagnosticCases.tsx
  AlternativesSection.tsx
  RecommendationsSection.tsx
  RelatedMaterials.tsx
```

The page file (`CourseLesson*.tsx`) only contains: scaffold, SECTIONS constant, intro layer, and `{s.id === "foo" ? <FooSection /> : ...}` dispatch. No inline content walls.

---

## Content components (mandatory formats)

| Content | Component |
|---|---|
| Code | `<CyberCodeBlock language="python" filename="file.py">{...}</CyberCodeBlock>` |
| Math | `<Math display>{\`\\LaTeX\`}</Math>` (KaTeX only, no markdown math) |
| Quiz | `<Quiz questions={[{ question, options, correctAnswer, explanation }]} />` — at least 1 per lesson |

Lesson content flow: Concept → Intuition → Formula/Core idea → Code example → Key takeaway → Quiz.

---

## Bidirectional cross-links (Wikipedia style)

Cross-links between lessons and hubs are the core navigation principle of this platform.

- **From lessons → hubs:** use `<HubLink hubId="math-rl" sectionId="bellman">текст</HubLink>` — renders as an inline highlighted link; clicking opens the hub at the exact section.
- **From hubs → lessons:** use `<LessonLink lessonId="1-5" anchor="mdp-definition">текст</LessonLink>` — returns the reader to the exact scroll position in the lesson.
- Register every new link pair in **`src/config/crosslinks.ts`**.
- Hub links available inside lessons are declared in **`src/content/lessonContextLinks.ts`**.
- **Rule:** never duplicate content between a lesson and a hub. Lessons are narrative entry points; hubs hold formal definitions and proofs. Cross-links bridge them.

---

## Design system — neon-unity-neural

Only use semantic color tokens. Never use raw hex colors or Tailwind palette utilities (`text-blue-500`, `#fff`, etc.):

- `text-primary` — cyan (main concepts)  
- `text-secondary` — purple (context/explanations)  
- `text-accent` — pink (highlights)  
- Cards: `bg-card/60 backdrop-blur-sm border-primary/30`  
- Hover glow: `hover:shadow-glow-cyan`, `hover:shadow-glow-purple`

Exception: `COLOR_MAP` in lesson pages uses Tailwind color utilities for the four accent variants (cyan/purple/pink/emerald) — this is intentional and matches the lesson 2.6 reference.

---

## Auth & roles

Auth is Supabase (`src/integrations/supabase/client.ts`) + Google OAuth via Lovable Cloud (`src/integrations/lovable/index.ts`).

`useUserRole` (`src/hooks/useUserRole.ts`) queries the `user_roles` Postgres table. `isPro` is hardcoded to `false` — PRO billing is not yet integrated. Admins bypass the PRO gate via `isAdmin`.

PRO paywall: `<ProGate preview={<VisiblePreview />}>full content</ProGate>`.

---

## Progress / gamification

`src/lib/gamification.ts` stores XP, completed lessons, quizzes, streaks, and badges in **localStorage** (key: `rl_platform_progress`). Use `markLessonComplete(id)` and `isLessonComplete(id)` from this module. Do **not** call `completeLesson()` directly from page components — use `CompleteButton` pattern above.

---

## Routing

All pages are lazy-loaded in `src/App.tsx`. Add new routes above the catch-all `path="*"` line.

---

## Deployment

Push to `main` → automatic Vercel deploy. Environment variables required:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
```

DB migrations live in `supabase/migrations/`.
