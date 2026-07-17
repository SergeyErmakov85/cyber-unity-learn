# Задача: Личный кабинет + регистрация через email/Яндекс/Mail.ru (без Google)

Проект: cyber-unity-learn (Vite + React + TS + Tailwind + shadcn/ui + Supabase).
Следуй правилам из CLAUDE.md в корне репозитория — они обязательны (дизайн-токены,
термин «раздел», запрет дублирования учебного плана вне learningMap.ts и т.д.).

## Цель 1 — Личный кабинет

Не создавай страницу с нуля: `src/pages/Profile.tsx` уже реализует значительную
часть личного кабинета (аватар, XP/уровень, бейджи, прогресс по модулям, смена
пароля, Jupyter-материалы). Дорабатывай и переноси её, а не дублируй.

1. **Маршрут.** Сделай `/dashboard` каноническим маршрутом личного кабинета.
   `/profile` оставь как редирект на `/dashboard` (обратная совместимость).
   Обнови все внутренние ссылки на `/profile` (Navbar.tsx, UserProfilePopover.tsx,
   любые другие) на `/dashboard`. Новый Route добавляй строго выше catch-all
   `path="*"` в src/App.tsx.

2. **Личный кабинет НЕ страница урока.** Не применяй к нему lesson-скаффолд
   (ProGate, SectionNav, CompleteButton, Quiz) — это паттерны для CourseLesson*.
   Используй только базовые токены дизайн-системы: bg-card/60 backdrop-blur-sm
   border-primary/30, hover:shadow-glow-cyan/purple, Orbitron для заголовков,
   семантические цветовые токены (никаких raw-hex/Tailwind palette utilities).

3. **Секции кабинета** (на основе текущей Profile.tsx + доработки):
   - Личные данные: аватар (upload в Storage bucket avatars — уже есть), имя,
     email, дата регистрации, и НОВОЕ: бейдж способа входа
     (Email / Яндекс / Mail.ru), взятый из user_metadata.provider.
   - Прогресс обучения: XP, уровень, % прохождения, CTA «продолжить курс».
   - Достижения: грид бейджей из ALL_BADGES (src/lib/gamification.ts).
   - Прогресс по разделам курса: перепиши текущий hardcoded allLessonPaths —
     список уроков должен браться из LEARNING_MAP (src/content/learningMap.ts),
     это прямое нарушение CLAUDE.md сейчас («никогда не дублируй список уроков»).
   - Настройки аккаунта: смена пароля — только если у пользователя есть
     email-провайдер (проверяй identities/provider); для пользователей,
     пришедших через Яндекс/Mail.ru без пароля, этот блок скрой или задизейбль
     с пояснением. Удаление аккаунта — замени текущую заглушку (только signOut)
     на реальное удаление через новую Edge Function с service_role
     (supabase.auth.admin.deleteUser), с подтверждающим диалогом.
   - Материалы (Jupyter notebooks) — оставь как есть.

4. **Единый источник auth-состояния.** Сейчас useUserRole.ts и Navbar.tsx
   независимо друг от друга дергают supabase.auth.getUser()/onAuthStateChange.
   Вынеси это в src/hooks/useAuth.ts + React-контекст (провайдер в App.tsx),
   отдающий { user, session, loading, roles, isAdmin, isPro }. Перепиши
   useUserRole, Navbar.tsx и новый Dashboard на использование этого контекста
   вместо дублирования логики.

## Цель 2 — Регистрация: email / Яндекс / Mail.ru, БЕЗ Google

Email/password уже полностью работает (Login.tsx, Register.tsx через
supabase.auth.signUp/signInWithPassword) — не переписывай эту логику, только
встраивай новые кнопки рядом.

### Google — закрепить запрет
- supabase/config.toml уже содержит `[auth.external.google] enabled = false` —
  не трогай, но добавь явный комментарий, почему (сейчас есть частичный).
- Прогрепай src/pages и src/components на "google"/"Google" — кнопок или
  вызовов OAuth с этим провайдером быть не должно нигде в UI.
- src/integrations/lovable/index.ts и зависимость @lovable.dev/cloud-auth-js
  сгенерированы Lovable-тулингом и сейчас нигде не используются в приложении.
  Не расширяй этот файл под Яндекс/Mail.ru — он не подходит (Supabase Auth API,
  не кастомный OAuth2). Если после аудита выяснится, что он полностью мёртвый
  код — вынеси решение об удалении в отдельный шаг с явным подтверждением
  пользователя, не удаляй молча.

### Яндекс и Mail.ru — кастомный OAuth2 через Supabase Edge Functions

У Supabase нет встроенных провайдеров "yandex"/"mailru" (оба сервиса дают
только OAuth2 без OIDC-discovery), поэтому реализуй ручной флоу:

1. Создай supabase/functions/oauth-yandex/index.ts и
   supabase/functions/oauth-mailru/index.ts (Deno Edge Functions).
   Каждая обрабатывает:
   - GET ?action=start — редиректит на authorize-эндпоинт провайдера
     (https://oauth.yandex.ru/authorize для Яндекс,
     https://o2.mail.ru/login для Mail.ru) с client_id, redirect_uri
     (= URL этой же функции с ?action=callback), response_type=code,
     сгенерированным state (CSRF-токен, положи в подписанный cookie
     или верни клиенту для сверки).
   - GET ?action=callback&code=...&state=... — сверяет state, обменивает
     code на access_token на token-эндпоинте провайдера (server-side,
     client_secret только в Supabase secrets, никогда не в клиентском коде),
     запрашивает userinfo (https://login.yandex.ru/info для Яндекс,
     https://o2.mail.ru/userinfo для Mail.ru) — email, имя, avatar.
   - Через supabase.auth.admin.listUsers({ email }) проверяет, существует
     ли пользователь. Если нет — admin.createUser({ email, email_confirm: true,
     user_metadata: { provider: 'yandex'|'mailru', name, avatar_url } }).
     Если email уже существует и создан другим способом — НЕ сливай аккаунты
     автоматически (это отдельная, более рискованная задача, out of scope);
     верни редирект на /login с ошибкой «этот email уже зарегистрирован,
     войдите по паролю».
   - Через admin.generateLink({ type: 'magiclink', email }) получи
     token_hash и редиректни браузер на
     {APP_URL}/auth/callback?token_hash=...&type=magiclink.

2. Добавь src/pages/AuthCallback.tsx на маршруте /auth/callback: читает
   token_hash/type из query, вызывает supabase.auth.verifyOtp({ token_hash,
   type }), при успехе редиректит на /dashboard, при ошибке — на /login
   с сообщением.

3. На Login.tsx и Register.tsx добавь кнопки «Войти через Яндекс» /
   «Войти через Mail.ru», которые делают window.location.href на
   {EDGE_FUNCTION_URL}?action=start. Кнопки — в стиле дизайн-системы
   (не дефолтные OAuth-иконки провайдеров без адаптации под тёмную тему).

4. Секреты (YANDEX_CLIENT_ID/SECRET, MAILRU_CLIENT_ID/SECRET, APP_URL) —
   через supabase secrets set, не хардкодь. Задокументируй в README/CLAUDE.md,
   какие переменные нужны.

5. Обнови раздел «Аутентификация и роли» в CLAUDE.md — он сейчас устарел
   (описывает Google OAuth через Lovable Cloud). Новое описание: email/password
   + кастомный OAuth2 (Яндекс, Mail.ru) через Edge Functions, Google отключён
   намеренно; упомяни useAuth(), user_roles, has_role().

## Явно вне рамок задачи (не делать)
- Слияние аккаунтов при совпадении email у разных провайдеров.
- Миграция прогресса (XP/бейджи, сейчас в localStorage) в Supabase-таблицу —
  только оставь TODO-комментарий, это отдельная большая задача.
- Реализация PRO-биллинга (isPro остаётся false).

## Критерии приёмки
- [ ] /dashboard рендерит все секции на реальных Supabase-данных; /profile
      редиректит на /dashboard.
- [ ] Список уроков в кабинете берётся из LEARNING_MAP, не дублируется.
- [ ] Кнопки «Войти через Яндекс» / «Войти через Mail.ru» на /login и /register
      реально создают/логинят пользователя (проверить локально с dev
      client_id/secret, если они предоставлены пользователем заранее).
- [ ] Ни в UI, ни в config.toml нет доступного пути входа через Google.
- [ ] npm run lint и npm run build проходят без ошибок.
- [ ] Ручная проверка в браузере: email-регистрация, email-логин,
      /dashboard со всеми секциями, редирект /profile → /dashboard.
