# AGENTS.md — Neon Unity Neural

Стек: Vite + React + TypeScript + Tailwind + shadcn/ui + Supabase + react-router-dom.  
Математика: KaTeX через CDN, рендер только через существующий компонент `Math`.

---

## Команды

```bash
npm i            # установить зависимости
npm run dev      # dev-сервер (Vite, localhost:5173)
npm run build    # production-сборка
npm run lint     # ESLint
```

Тест-сьют не настроен.

---

## Дизайн-система

- Фон: `#06080D`. Акценты: неон cyan `#00FFD6`, magenta `#D946EF`.
- Заголовки: **Orbitron**. Код/формулы: **JetBrains Mono**.
- Стиль: Kinetic Minimalism + футуристичный UI, glassmorphism-карточки.
- Текст в визуализациях — светлый/яркий белый для максимального контраста на тёмном фоне.

Используй только семантические цветовые токены. Никаких raw-hex и Tailwind palette utilities (`text-blue-500`, `#fff` и т. д.):

- `text-primary` — cyan (основные концепции)
- `text-secondary` — purple (контекст/пояснения)
- `text-accent` — pink (акценты)
- Карточки: `bg-card/60 backdrop-blur-sm border-primary/30`
- Hover-свечение: `hover:shadow-glow-cyan`, `hover:shadow-glow-purple`

**Исключение:** `COLOR_MAP` в страницах уроков использует Tailwind color utilities для четырёх акцентных вариантов (cyan / purple / pink / emerald) — это намеренно и соответствует эталону урока 2.6.

---

## Терминология и правила

- В UI-метках всегда **«раздел»**, НИКОГДА «модуль».
- Все формулы — KaTeX/LaTeX через `Math`. Никаких сырых Unicode-символов математики.
- Кросс-линки между уроками и хабами — через компонент `HubLink` (двунаправленные, как в Википедии).
- PRO-контент гейтится компонентом `ProGate`.
- Интерактив (слайдеры, тогглы, hover) — React/JSX; статичный SVG только для неинтерактивных схем.

---

## Подводные камни

- `ctx.roundRect()` падает в canvas — использовать `fillRect`.
- Для тогглов внутри animation loop использовать `useRef`, а не `useState`.

---

## Архитектура

### Единый источник данных о курсах

Вся структура курса живёт в **`src/content/learningMap.ts`** (`LEARNING_MAP: Stage[]`). Это канонический список стейджей, уроков и проектов. `Courses.tsx`, `LessonLayout` и `gamification.ts` берут данные отсюда. Никогда не дублируй список уроков в других местах.

- `src/content/lessonContextLinks.ts` — ссылки на хабы внутри уроков
- `src/config/crosslinks.ts` — двунаправленные кросс-линки между уроками и хабами
- `src/content/hubs.ts` — метаданные хабов поддержки (PyTorch, Unity ML-Agents, Math RL и др.)
- `src/data/lessons.ts` — дополнительные мета-данные для конкретных уроков (напр. 2.6)

### Страницы уроков

Каждая страница урока — `src/pages/CourseLesson*.tsx`.  
**Эталонная реализация: `src/pages/CourseLesson2_6.tsx`** — золотой стандарт для всех страниц уроков. Каждый новый урок должен точно повторять его структуру.

### Обязательный скаффолд страницы

Каждая страница урока **должна** иметь следующую структуру верхнего уровня в этом порядке:

```tsx
// 1. SEO
<SEOHead title="..." description="..." path="/courses/X-Y" type="article" />

// 2. Ссылка «перейти к содержимому» (accessibility)
<a href="#lesson-content" className="sr-only focus:not-sr-only ...">К содержимому урока</a>

// 3. Полоса прогресса прокрутки
<ScrollProgressBar color="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

// 4. Основной контейнер
<main className="container max-w-5xl mx-auto px-4 py-8">
  <ProGate preview={content}>{content}</ProGate>
</main>
```

Внутри `content`:

```tsx
// Breadcrumbs → LessonHeader → SectionNav → sections → RelatedMaterials → CompleteButton card → NextPrevLesson
```

### Хлебные крошки

Всегда рендери крошки как `<nav aria-label="Хлебные крошки">` с `<ol>` и разделителями `<ChevronRight>`. Путь: Главная → Курс → Уровень N → Урок X.Y.

### Список секций

Определяй секции как константу `SECTIONS: SectionNavItem[]` на уровне модуля:

```tsx
const SECTIONS: SectionNavItem[] = [
  { id: "intro",   label: "Введение" },
  { id: "...",     label: "..." },
];
```

Рендери каждую секцию как `<motion.section>` внутри `SECTIONS.map(...)`.

---

## Визуальный стиль — обязательные паттерны (на основе урока 2.6)

> **Эти паттерны обязательны.** Каждая страница урока должна реализовывать их все.

### Класс-обёртка секции

```tsx
const SECTION_CLASS =
  "scroll-mt-24 py-16 px-6 md:px-10 bg-card/60 backdrop-blur-sm rounded-2xl border border-cyan-500/10";
```

### Класс заголовка секции

```tsx
const SECTION_TITLE_CLASS =
  "text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6";
```

Всегда используй `<h2 className={`${SECTION_TITLE_CLASS} text-2xl md:text-3xl`}>` внутри каждой секции.

### Motion-анимации

Импортируй `motion` из `framer-motion`. Каждый `<section>` должен быть `<motion.section>`:

```tsx
const SECTION_VARIANTS = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// Внутри map:
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

### Структура секции intro (обязательна для каждого урока)

Секция `intro` **должна** содержать три слоя в этом порядке:

**Слой 1 — Hero-карточка:**
```tsx
<Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm overflow-hidden">
  <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
    {/* слева: заголовок + описание */}
    <div className="flex-1 space-y-3">
      <h3 className="text-2xl md:text-3xl font-bold text-foreground">...</h3>
      <p className="text-muted-foreground leading-relaxed">...</p>
    </div>
    {/* справа: иконка в glow-боксе */}
    <div className="shrink-0 w-20 h-20 rounded-2xl border border-cyan-400/40 bg-cyan-500/10
                    flex items-center justify-center
                    shadow-[0_0_32px_hsl(var(--primary)/0.45)]">
      <SomeIcon className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
    </div>
  </CardContent>
</Card>
```

**Слой 2 — TL;DR-блок:**
```tsx
<TldrBox items={[ <> ... </>, <> ... </> ]} />
```
Должен содержать 2–4 пункта. Каждый пункт — с `<strong>` для ключевых терминов и `<code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">` для сниппетов кода.

**Слой 3 — Сетка ключевых выводов:**
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

// Рендер:
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

### CompleteButton (обязателен, каждый урок)

Размещай перед `<NextPrevLesson>`. Отслеживает позицию прокрутки (срабатывает на 90%) и поддерживает ручное нажатие:

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

Оборачивай в карточку завершения:

```tsx
<Card className="mt-8 border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm">
  <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
    <p className="text-sm text-muted-foreground">Дочитали до конца? Зафиксируйте прогресс и получите XP.</p>
    <CompleteButton />
  </CardContent>
</Card>
```

### Справочник стилей карточек

| Назначение | className |
|---|---|
| Hero gradient card | `border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm` |
| Standard content card | `bg-card/60 backdrop-blur-sm border border-cyan-500/10` |
| Completion card | `border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm` |
| Key finding card | `group bg-card/60 backdrop-blur-sm transition-all duration-300 hover:scale-105` + `COLOR_MAP[color]` |

### Подкомпоненты секций

Выноси содержимое каждой секции в отдельный компонент в `src/components/lesson-X-Y/`:

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

Файл страницы (`CourseLesson*.tsx`) содержит только: скаффолд, константу `SECTIONS`, слой intro и диспетч `{s.id === "foo" ? <FooSection /> : ...}`. Никаких инлайн-стен контента.

---

## Компоненты контента (обязательные форматы)

| Контент | Компонент |
|---|---|
| Код | `<CyberCodeBlock language="python" filename="file.py">{...}</CyberCodeBlock>` |
| Математика | `<Math display>{\`\\LaTeX\`}</Math>` (только KaTeX, без markdown math) |
| Квиз | `<Quiz questions={[{ question, options, correctAnswer, explanation }]} />` — минимум 1 на урок |

Поток содержимого урока: Концепция → Интуиция → Формула/Ключевая идея → Пример кода → Ключевой вывод → Квиз.

---

## Двунаправленные кросс-линки (стиль Википедии)

Кросс-линки между уроками и хабами — основной принцип навигации платформы.

- **Из уроков → хабы:** `<HubLink hubId="math-rl" sectionId="bellman">текст</HubLink>` — рендерится как инлайн-ссылка с подсветкой; клик открывает хаб точно в нужной секции.
- **Из хабов → уроки:** `<LessonLink lessonId="1-5" anchor="mdp-definition">текст</LessonLink>` — возвращает читателя точно к нужной позиции прокрутки в уроке.
- Регистрируй каждую новую пару ссылок в **`src/config/crosslinks.ts`**.
- Ссылки на хабы внутри уроков объявляются в **`src/content/lessonContextLinks.ts`**.
- **Правило:** никогда не дублируй контент между уроком и хабом. Уроки — нарративные точки входа; хабы содержат формальные определения и доказательства. Кросс-линки их связывают.

---

## Аутентификация и роли

Auth — Supabase (`src/integrations/supabase/client.ts`) + Google OAuth через Lovable Cloud (`src/integrations/lovable/index.ts`).

`useUserRole` (`src/hooks/useUserRole.ts`) запрашивает таблицу `user_roles` в Postgres. `isPro` захардкожен в `false` — биллинг PRO ещё не интегрирован. Администраторы обходят PRO-гейт через `isAdmin`.

PRO-пейволл: `<ProGate preview={<VisiblePreview />}>full content</ProGate>`.

---

## Прогресс и геймификация

`src/lib/gamification.ts` хранит XP, пройденные уроки, квизы, стрики и бейджи в **localStorage** (ключ: `rl_platform_progress`). Используй `markLessonComplete(id)` и `isLessonComplete(id)` из этого модуля. Не вызывай `completeLesson()` напрямую из компонентов страниц — используй паттерн `CompleteButton`.

---

## Маршрутизация

Все страницы загружаются лениво в `src/App.tsx`. Добавляй новые маршруты выше catch-all строки `path="*"`.

---

## Деплой

Push в `main` → автоматический деплой на Vercel. Необходимые переменные окружения:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
```

DB-миграции — в `supabase/migrations/`.

## Imported Claude Cowork project instructions

На главной странице проекта есть хабы — это кнопки, по которым можно перейти и, как в интерактивном учебнике получить информацию отдельно по темам, необходимым для понимания обучения с подкреплением.

Также отдельно есть карта обучения, представляющая собой три уровня: начальный, средний и продвинутый. В каждом уровне — множество уроков.

Так вот, основная идея заключается в том, что из каждого урока должны вести множество интерактивных ссылок на соответствующие места в тексте хабов (для подробного разбора определенных понятий или тем урока), а из хабов — обратно на соответствующие места в уроках (Там, где остановился ученик, нажав на ссылку).

Принцип — ссылки как в Википедии.

Purpose & context

Sergey is building Neon Unity Neural (also called CyberUnityCode) — an interactive reinforcement learning education platform hosted at data-mind-guide.lovable.app / neon-unity-neural.lovable.app, deployed via Vercel. The platform targets technical students learning RL concepts and practical Unity ML-Agents implementation across three levels (20 lessons, 4 projects, PRO-gated content).

Core architecture principle: LESSONS are narrative entry points built around running examples; HUBS are formal mathematical/algorithmic reference pages (proofs, derivations, general theory). The two are connected via Wikipedia-style bidirectional cross-links — from lesson to a specific hub section, and from hub back to the exact lesson location. Content duplication between lesson and hub is strictly prohibited.

Tech stack: Vite + React + TypeScript + Tailwind + shadcn/ui + Supabase + react-router-dom + KaTeX (via <Math> component). Primary build environment: Lovable. Secondary tools: Cursor, Claude Code CLI.

Design system — Kinetic Minimalism + Futuristic UI:

Background 
#06080D, neon cyan 
#00FFD6, magenta 
#D946EF
Fonts: Orbitron (headings), JetBrains Mono (code/formulas), IBM Plex Sans (body)
Glassmorphism cards, cyan/purple/pink palette
Visualizations built in JSX/React (not SVG), required for real-time interactivity
Text must use lighter/brighter white for legibility against dark backgrounds

Sergey also teaches at МГППУ and the platform content is in Russian throughout.

Current state

Sergey has an established lesson production pipeline for Level 3 advanced content:

Fill out a lesson template (v3: 1_3__ШАБЛОН-урок-для-claude-code.md) with parameters
Claude conducts primary-source research to verify all technical claims before writing
Claude produces two deliverable files: a complete Russian-language lesson content .md and a Claude Code build prompt .md
Claude Code executes the build prompt against the actual codebase

Recently completed lessons: 3.3 (Curriculum Learning), 3.4 (Imitation Learning: BC + GAIL), 3.5 (ONNX Deployment), 3.6 (Hyperparameter Optimization: Optuna + W&B), 3.7 (Neural Network Architectures for RL Agents).

Running example throughout Level 3: the PPO racing agent from Project 3.

On the horizon

Continued Level 3 lesson production using the established two-file workflow
Potential regeneration of Lesson 3.3 build prompt under v3 template (Pattern B, monolithic) — not yet confirmed

Key learnings & principles

Architecture detection rule (critical): Claude Code build prompts must NOT assume file structure from template descriptions. They must instruct Claude Code to inspect the actual previous lesson file (e.g., CourseLesson3_6.tsx with fallbacks) and determine the pattern in use:

Pattern A: folder per lesson (lesson-3-x/) with component files + wrapper page (exemplified by Lesson 3.1)
Pattern B: monolithic single file with inline helpers (exemplified by Lesson 3.2)
Rule: "Follow the code, not the description." Replicate the detected pattern exactly.

Lesson structure requirements:

Mandatory clickable table of contents at the top for section navigation
KeyPoints blocks per section, Callout components, CyberCodeBlock, CrossLinkToHub, CrossLinkToLesson
Math via <Math> KaTeX component only (never markdown math syntax)
Bidirectional cross-links verified against actual anchor IDs in prior lessons before linking

ML-Agents versioning (4.0.x) — critical facts to preserve:

encoding_size field is removed in 4.0.x — must never appear in configs
memory_size must be divisible by 2
Unity Inference Engine package: com.unity.ai.inference (evolution: Barracuda → Sentis → Unity Inference Engine)
multirangeuniform spelled without underscore in all shipped configs
WeightsAndBiasesCallback migrated to separate optuna-integration package in Optuna 4.x

Content architecture:

Lessons explain "why and how on an example"; hubs explain "why it is true"
Anti-duplication: cross-link to prior lessons rather than re-explaining covered concepts
Every lesson includes a cross-reference map with section id anchors

Approach & patterns

Workflow for each lesson:

Template submission (Part A must be filled before research begins)
Multi-phase primary-source research (fetch official docs, verify API details, cite original papers)
Produce lesson-X-Y-content.md (full Russian content) + claude-code-prompt-lesson-X-Y.md (build instructions)
Claude Code executes build prompt independently

Lovable workflow (for earlier-stage content): Sequential, self-contained numbered prompts pasted one at a time; checkpoint verification every 2–3 prompts; corrective prompts scoped narrowly.

Research standards: Always verify from primary sources (arXiv papers, official Unity/Optuna/W&B documentation) before writing technical content. Document assumptions when template fields are empty.

Section terminology: Always use "раздел" (not "модуль").

Tools & resources

Lovable — primary build environment for lesson pages
Cursor — secondary, targeted file-level corrections
Claude Code CLI — preferred for verbatim content fidelity (formulas, code blocks)
Notion MCP — used for workspace content retrieval (two-step pattern: search → fetch by ID)
Component library: Math, CyberCodeBlock, KeyPoints, Callout, CrossLinkToHub, CrossLinkToLesson, HubLink, ProGate
