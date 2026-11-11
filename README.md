# RL Platform — Cyber Unity Code

Образовательная платформа на русском по Reinforcement Learning, PyTorch и Unity ML-Agents.
3 уровня (Новичок / Средний / Продвинутый), 20 уроков, 4 проекта, хабы по математике,
алгоритмам и Deep RL.

Production: <https://rl-cuber-unity-code.com>

Работа дома и с телефона: [настройка Codex Cloud, GitHub и Lovable](docs/CLOUD_WORKFLOW.md).

## Стек

- Vite + React 18 + TypeScript
- Tailwind CSS v3, shadcn/ui
- React Router v6
- Supabase (Auth + Postgres + RLS) через Lovable Cloud
- KaTeX, Recharts, framer-motion
- Публикация: Lovable, синхронизация кода через GitHub

## Источник истины по курсу

Структура курса (этапы → уроки → проекты) живёт в одном месте:

- `src/content/learningMap.ts` — `LEARNING_MAP`, `Lesson`, `Stage`
- `src/content/lessonContextLinks.ts` — ссылки на хабы из уроков
- `src/data/lessons.ts` — meta для отдельных уроков (например, 2.6)

`src/pages/Courses.tsx`, `LessonLayout`, прогресс в `gamification.ts` — всё опирается
на эти данные. Не дублируйте список уроков в других местах.

## Локальная разработка

```bash
npm ci
npm run dev
```

Требуется Node.js 24.x (см. `.nvmrc`). Локальный адрес: <http://localhost:8080>.
Для полной проверки проекта: `npm run check`.

Сборка/линт:

```bash
npm run build
npm run lint
npm run typecheck
npm run audit:links
```

Для проверки якорей, вкладок и скачиваемых файлов в Chromium:

```bash
npx playwright install chromium
npm run audit:browser
```

Команда запускает локальный сайт на порту 8080 с тестовыми настройками.
Список внешних адресов и результаты обхода записываются в `browser-link-audit.json.local`.
Проверки путей к репозиторию сред выполняют `npm run audit:lab` и `npm run textbook:audit`.

## Переменные окружения

Создайте `.env` по образцу `.env.example`:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
```

Для облачной разработки задайте те же переменные в Environment variables среды Codex Cloud.
Для сайта используйте настройки существующего проекта Lovable.
Файл `.env` находится в `.gitignore` и не должен попадать в репозиторий.

### Секреты Edge Functions (OAuth Яндекс / Mail.ru, удаление аккаунта)

Вход через Яндекс и Mail.ru реализован кастомным OAuth2-флоу в Edge Functions
(`supabase/functions/oauth-yandex`, `oauth-mailru`); удаление аккаунта — в
`delete-account`. Секреты задаются только на стороне Supabase (никогда в клиентском
коде):

```bash
supabase secrets set \
  YANDEX_CLIENT_ID=... \
  YANDEX_CLIENT_SECRET=... \
  MAILRU_CLIENT_ID=... \
  MAILRU_CLIENT_SECRET=... \
  APP_URL=https://rl-cuber-unity-code.com
```

- `APP_URL` — origin фронтенда без завершающего `/` (для локальной проверки —
  `http://localhost:8080`).
- Redirect URI в кабинетах провайдеров:
  `{SUPABASE_URL}/functions/v1/oauth-yandex?action=callback` (аналогично для
  `oauth-mailru`).
- `SUPABASE_URL` и `SUPABASE_SERVICE_ROLE_KEY` в функции подставляются платформой
  автоматически.
- Google как провайдер входа отключён намеренно (см. `supabase/config.toml`).

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

Код из активной ветки GitHub синхронизируется в существующий проект Lovable.
Основная ветка — `main`; фактическую активную ветку проверьте в настройках Git проекта Lovable.
Проверьте правки в Preview, затем выполните Publish → Publish changes для обновления публичного сайта.

Перед публикацией можно выполнить `npm run build:deploy`: проверку окружения,
типов, lint, ссылок, формул и сборки. Автоматические проверки GitHub Actions
включают также обход страниц в браузере.
