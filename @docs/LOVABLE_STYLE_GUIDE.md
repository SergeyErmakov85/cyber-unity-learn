# Lovable — Style & Structure Guide for Lesson Pages

> Use this prompt snippet when asking Lovable to create or edit a lesson page.
> Paste it at the top of your Lovable prompt before describing the lesson content.

---

## Platform context

This is **Neon Unity Neural** — an interactive RL education platform built with Vite + React + TypeScript + Tailwind CSS + shadcn/ui. All lesson pages must match the visual standard of `CourseLesson2_6.tsx`.

---

## Required page structure (copy this order exactly)

```
SEOHead
Skip-to-content <a> (accessibility)
ScrollProgressBar  ← color="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
<main className="container max-w-5xl mx-auto px-4 py-8">
  <ProGate preview={content}>
    Breadcrumbs (nav aria-label="Хлебные крошки")
    LessonHeader
    SectionNav
    <div id="lesson-content" className="space-y-8 mt-8">
      {SECTIONS.map → motion.section}
    </div>
    RelatedMaterials
    Completion Card + CompleteButton
    NextPrevLesson
  </ProGate>
</main>
```

---

## Section wrapper — always use these exact classes

```tsx
const SECTION_CLASS =
  "scroll-mt-24 py-16 px-6 md:px-10 bg-card/60 backdrop-blur-sm rounded-2xl border border-cyan-500/10";

const SECTION_TITLE_CLASS =
  "text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6";
```

---

## Animation — every section must use this

```tsx
import { motion } from "framer-motion";

const SECTION_VARIANTS = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

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
  <h2 className={`${SECTION_TITLE_CLASS} text-2xl md:text-3xl`}>{s.label}</h2>
  {/* section content component */}
</motion.section>
```

---

## Intro section — three mandatory layers

### Layer 1: Hero card

```tsx
<Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm overflow-hidden">
  <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
    <div className="flex-1 space-y-3">
      <h3 className="text-2xl md:text-3xl font-bold text-foreground">[lesson hook — 1 sentence]</h3>
      <p className="text-muted-foreground leading-relaxed">[2–3 sentences context]</p>
    </div>
    <div className="shrink-0 w-20 h-20 rounded-2xl border border-cyan-400/40 bg-cyan-500/10
                    flex items-center justify-center shadow-[0_0_32px_hsl(var(--primary)/0.45)]">
      <RelevantIcon className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
    </div>
  </CardContent>
</Card>
```

### Layer 2: TldrBox

```tsx
<TldrBox items={[
  <>[Key takeaway 1 with <strong className="text-cyan-300">bold terms</strong>
     and <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">code snippets</code>]</>,
  <>[Key takeaway 2]</>,
  <>[Key takeaway 3 — anti-pattern or warning]</>,
]} />
```

### Layer 3: Key findings grid (4 cards, 4 accent colors)

```tsx
const KEY_FINDINGS = [
  { title: "...", text: "...", icon: Icon1, color: "cyan"    },
  { title: "...", text: "...", icon: Icon2, color: "purple"  },
  { title: "...", text: "...", icon: Icon3, color: "pink"    },
  { title: "...", text: "...", icon: Icon4, color: "emerald" },
] as const;

const COLOR_MAP: Record<string, string> = {
  cyan:    "border-cyan-500/30 hover:border-cyan-400/70 hover:shadow-[0_0_24px_hsl(var(--primary)/0.35)] [&_svg]:text-cyan-400",
  purple:  "border-purple-500/30 hover:border-purple-400/70 hover:shadow-[0_0_24px_hsl(280_85%_65%/0.35)] [&_svg]:text-purple-400",
  pink:    "border-pink-500/30 hover:border-pink-400/70 hover:shadow-[0_0_24px_hsl(330_85%_65%/0.35)] [&_svg]:text-pink-400",
  emerald: "border-emerald-500/30 hover:border-emerald-400/70 hover:shadow-[0_0_24px_hsl(160_85%_55%/0.35)] [&_svg]:text-emerald-400",
};

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {KEY_FINDINGS.map(({ title, text, icon: Icon, color }) => (
    <Card key={title} className={`group bg-card/60 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${COLOR_MAP[color]}`}>
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

---

## CompleteButton — paste as-is, change only the lesson ID

```tsx
const CompleteButton = () => {
  const [done, setDone] = useState<boolean>(() => isLessonComplete("X.Y"));

  useEffect(() => {
    if (done) return;
    const onScroll = () => {
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (pct >= 90) { markLessonComplete("X.Y"); setDone(true); window.removeEventListener("scroll", onScroll); }
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

Wrap in completion card:

```tsx
<Card className="mt-8 border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm">
  <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
    <p className="text-sm text-muted-foreground">Дочитали до конца? Зафиксируйте прогресс и получите XP.</p>
    <CompleteButton />
  </CardContent>
</Card>
```

---

## Content components

| Content type | Component |
|---|---|
| Code block | `<CyberCodeBlock language="python" filename="file.py">...</CyberCodeBlock>` |
| Math formula | `<Math display>{\`\\LaTeX\`}</Math>` — KaTeX only, never markdown |
| Quiz | `<Quiz questions={[{ question, options, correctAnswer, explanation }]} />` — min 1 per lesson |

---

## File organisation

- Page: `src/pages/CourseLessonX_Y.tsx` — scaffold only, no inline content walls
- Sub-components: `src/components/lesson-X-Y/SectionName.tsx` — one file per section
- Register route in `src/App.tsx` above the `path="*"` catch-all

---

## Cross-links (Wikipedia principle)

- Lesson → Hub: `<HubLink hubId="math-rl" sectionId="bellman">текст</HubLink>`
- Hub → Lesson: `<LessonLink lessonId="1-5" anchor="mdp-definition">текст</LessonLink>`
- Register every pair in `src/config/crosslinks.ts`
- **Never duplicate content.** Lessons narrate; hubs define. Links connect them.

---

## What NOT to do

- ❌ Raw hex colors or `text-blue-500` / `bg-gray-900` etc. — use semantic tokens
- ❌ Plain `<section>` — always `<motion.section>` with `SECTION_VARIANTS`
- ❌ Inline content walls in the page file — extract to sub-components
- ❌ Skipping any of the three intro layers (hero card / TldrBox / key findings grid)
- ❌ Missing `CompleteButton` or completion card
- ❌ `completeLesson()` called directly — always via `markLessonComplete()` in `CompleteButton`
- ❌ `canvas ctx.roundRect()` in any visualization — use SVG shapes instead
- ❌ Toggle/checkbox state inside canvas animation loops as `useState` — use `useRef`
