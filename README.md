# RL Platform — Cyber Unity Code

Образовательная платформа на русском по Reinforcement Learning, PyTorch и Unity ML-Agents.
3 уровня (Новичок / Средний / Продвинутый), 20 уроков, 4 проекта, хабы по математике,
алгоритмам и Deep RL.

Production: <https://rl-cuber-unity-code.com>

## Стек

- Vite + React 18 + TypeScript
- Tailwind CSS v3, shadcn/ui
- React Router v6
- Supabase (Auth + Postgres + RLS) через Lovable Cloud
- KaTeX, Recharts, framer-motion
- Деплой: Vercel

## Источник истины по курсу

Структура курса (этапы → уроки → проекты) живёт в одном месте:

- `src/content/learningMap.ts` — `LEARNING_MAP`, `Lesson`, `Stage`
- `src/content/lessonContextLinks.ts` — ссылки на хабы из уроков
- `src/data/lessons.ts` — meta для отдельных уроков (например, 2.6)

`src/pages/Courses.tsx`, `LessonLayout`, прогресс в `gamification.ts` — всё опирается
на эти данные. Не дублируйте список уроков в других местах.

## Локальная разработка

```bash
npm i
npm run dev
```

Сборка/линт:

```bash
npm run build
npm run lint
```

## Переменные окружения

Создайте `.env` по образцу `.env.example`:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
```

В Lovable / Vercel задайте те же переменные через Settings → Environment Variables.
Файл `.env` находится в `.gitignore` и не должен попадать в репозиторий.

## Структура

- `src/pages/` — страницы (уроки `CourseLesson*`, проекты `CourseProject*`, хабы)
- `src/components/` — общие компоненты (LessonLayout, CyberCodeBlock, Math, Quiz…)
- `src/components/lesson-2-6/`, `src/components/project-2/` — секции конкретных уроков
- `src/content/` — данные курса
- `src/lib/gamification.ts` — XP, бейджи, прогресс (localStorage)
- `src/integrations/supabase/` — авто-сгенерированные клиент и типы (не редактировать)
- `supabase/migrations/` — миграции БД

## Дизайн-система

Тёмная киберпанк-эстетика, неоновые акценты. Используйте только семантические токены
из `index.css` / `tailwind.config.ts`:

- `text-primary` (cyan), `text-secondary` (purple), `text-accent` (pink)
- `bg-card/60 backdrop-blur-sm`, `border-primary/30`
- `hover:shadow-glow-cyan`, `hover:shadow-glow-purple`

Никаких `#hex` или `text-blue-500` в компонентах.

## Контентные компоненты

- Код — `<CyberCodeBlock language="..." filename="...">`
- Формулы — `<Math display>{"\\KaTeX"}</Math>`
- Квизы — `<Quiz questions={[...]} />`
- Урок — `<LessonLayout lessonId lessonNumber lessonTitle prevLesson nextLesson level={1|2|3}>`

Уровень 2 автоматически получает оформление урока 2.6 (градиентный заголовок,
карточный wrapper, неоновый ScrollProgressBar).

## Деплой

Push в `main` → автоматический деплой через Vercel.
Lovable Preview — для итераций без публикации.
