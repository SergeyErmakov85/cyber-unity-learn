# Аудит пересечений: урок 1.5 ↔ хаб «Математика RL»

## Маршрутизация хаба

- Все маршруты `/math-rl/module-N` отрендерены одним компонентом `src/pages/MathRL.tsx`, который лениво монтирует соответствующий `Part`. Маппинг (`src/pages/MathRL.tsx:419-424`):
  - `/math-rl/module-1` → `Part1Limits` (`src/components/math-rl/parts/Part1Limits.tsx`)
  - `/math-rl/module-5` → `Part5FundamentalRL` (`src/components/math-rl/parts/Part5FundamentalRL.tsx`)
- `Part5FundamentalRL.tsx` напрямую рендерит `<Introduction />`, `<Chapter1 />` … `<Chapter10 />`, `<Conclusion />` из `src/components/math-rl/module1/`. То есть все `Chapter*` анкеры доступны по `/math-rl/module-5#…`.
- Файл `src/pages/MathRLModule5.tsx` существует, но **не подключён к роутеру** (`src/App.tsx` напрямую использует только `MathRL`). Это дубликат — все `Chapter*`-якоря достижимы через `Part5FundamentalRL` на `/math-rl/module-5`.

## Таблица: Концепция урока 1.5 → соответствие в хабе

| # | Концепция в уроке 1.5 (CourseLesson1_5.tsx) | Уже покрыто в хабе? | Файл хаба | Anchor ID | URL anchor |
|---|---|---|---|---|---|
| 1 | Кортеж MDP `(S, A, P, R, γ)` и таблица компонентов | ✓ Да | `src/components/math-rl/module1/Chapter3.tsx` | `глава-3` (Section id) | `/math-rl/module-5#глава-3` |
| 2 | Свойство Маркова (полная формула + интуиция) | ✓ Да | `src/components/math-rl/module1/Chapter3.tsx:42` | `марковское-свойство` | `/math-rl/module-5#марковское-свойство` |
| 3 | Возврат `G_t = Σ γᵏ r` (эпизодический / continuing) | ✓ Да | `src/components/math-rl/module1/Chapter4.tsx:7` | `возврат-return` | `/math-rl/module-5#возврат-return` |
| 4 | Политика π (детерминированная / стохастическая) | ✓ Да | `src/components/math-rl/module1/Chapter4.tsx:28` | `политика-policy` | `/math-rl/module-5#политика-policy` |
| 5 | Функции ценности `V^π(s)`, `Q^π(s, a)`, связь V↔Q | ✓ Да (сильное пересечение) | `src/components/math-rl/module1/Chapter4.tsx:33` | `функции-ценности-value-functions` | `/math-rl/module-5#функции-ценности-value-functions` |
| 5a | Функция ценности состояния — интуитивное изложение | ✓ Да (дубль) | `src/components/math-rl/parts/Part1Limits.tsx:123` | `функция-ценности-состояния` | `/math-rl/module-1#функция-ценности-состояния` |
| 6 | Уравнение Беллмана (expectation) для `V^π`, `Q^π` | ✓ Да (сильное пересечение) | `src/components/math-rl/module1/Chapter5.tsx:14` | `уравнение-ожиданий-беллмана` | `/math-rl/module-5#уравнение-ожиданий-беллмана` |
| 6a | Рекурсивное разложение возврата `G_t = r + γ G_{t+1}` | ✓ Да | `src/components/math-rl/module1/Chapter5.tsx:11` | `рекурсивное-разложение-возврата` | `/math-rl/module-5#рекурсивное-разложение-возврата` |
| 7 | Уравнение Беллмана оптимальности для `V*`, `Q*` | ✓ Да (дублируется в двух местах) | `src/components/math-rl/module1/Chapter5.tsx:36` / `src/components/math-rl/parts/Part1Limits.tsx:154` | `уравнение-оптимальности-беллмана` | `/math-rl/module-5#уравнение-оптимальности-беллмана` **или** `/math-rl/module-1#уравнение-оптимальности-беллмана` |
| 8 | `π*(s) = argmax_a Q*(s, a)` и связь с model-free | ⚠ Частично | `src/components/math-rl/module1/Chapter5.tsx` (без отдельного h3 id) и `Chapter6.tsx:55` `sarsa-vs-q-learning` | `sarsa-vs-q-learning` | `/math-rl/module-5#sarsa-vs-q-learning` |
| 9 | Обзор методов: Value Iteration / Policy Iteration | ⚠ Частично (в Part1Limits есть VIZ-график, отдельный h3 — только для визуализации) | `src/components/math-rl/parts/Part1Limits.tsx:496` | `8-2-визуализация-итерации-ценности` | `/math-rl/module-1#8-2-визуализация-итерации-ценности` |
| 10 | Model-Free vs Model-Based / TD-learning | ✓ Да | `src/components/math-rl/module1/Chapter6.tsx:15`, `Chapter6.tsx:42` | `монте-карло-vs-temporal-difference`, `td-обучение-величайший-прорыв` | `/math-rl/module-5#монте-карло-vs-temporal-difference`, `/math-rl/module-5#td-обучение-величайший-прорыв` |
| 11 | Интуиция роли γ и эффективный горизонт `1/(1-γ)` | ✓ Да | `src/components/math-rl/parts/Part1Limits.tsx:275` | `интуиция-gamma` | `/math-rl/module-1#интуиция-gamma` |
| 12 | Сходимость геометрического ряда | ✓ Да (с визуализацией) | `src/components/math-rl/parts/Part1Limits.tsx:66`, `485` | `геометрический-ряд`, `8-1-сходимость-геометрического-ряда` | `/math-rl/module-1#геометрический-ряд` |
| 13 | Пример MDP «на пальцах» с двумя состояниями | ✓ Да (с PNG-диаграммой) | `src/components/math-rl/parts/Part1Limits.tsx:360` | `пример-mdp-с-двумя-состояниями` | `/math-rl/module-1#пример-mdp-с-двумя-состояниями` |
| 14 | DQN как нейро-аппроксимация Q | ✓ Да | `src/components/math-rl/module1/Chapter8.tsx:19` | `dqn-deep-q-network` | `/math-rl/module-5#dqn-deep-q-network` |

## Легенда

- **✓ Да** — тема полностью раскрыта в хабе, есть стабильный `id` для глубокой ссылки.
- **⚠ Частично** — связанный материал есть, но без точного анкера на ту же подтему.

---

## Список anchor'ов для кросс-ссылок из нового урока 1.5

Проверка выполнена поиском атрибута `id=` в JSX исходников Part1Limits.tsx, Chapter3.tsx, Chapter4.tsx, Chapter5.tsx. Для каждого запрошенного anchor ниже указано:

- **Файл** и **строка**, где задан `id=`.
- **URL**, по которому anchor реально доступен в роутере.
- **Статус**: ✓ найден / ⚠ найден под другим id / ✗ не существует.

### 1. `#предел-последовательности-random-variable` (Part1Limits)

- **Статус:** ✗ НЕ СУЩЕСТВУЕТ. Ни в одном файле хаба нет id `предел-последовательности-random-variable`.
- **Ближайшие актуальные id (разведены по двум файлам):**
  - `id="1-1-предел-последовательности"` — `src/components/math-rl/parts/Part1Limits.tsx:24` → `/math-rl/module-1#1-1-предел-последовательности`
  - `id="случайная-величина-random-variable"` — `src/components/math-rl/module1/Chapter1.tsx:11` → `/math-rl/module-5#случайная-величина-random-variable`
- **Рекомендация:** если цель — сослаться на раздел про предел последовательности, использовать `/math-rl/module-1#1-1-предел-последовательности`. Если цель — случайная величина, использовать `/math-rl/module-5#случайная-величина-random-variable`. Скорее всего имелся в виду первый.

### 2. `#геометрический-ряд` (Part1Limits § 2)

- **Статус:** ✓ СУЩЕСТВУЕТ.
- **Источник:** `src/components/math-rl/parts/Part1Limits.tsx:66` — `id="геометрический-ряд"`.
- **URL:** `/math-rl/module-1#геометрический-ряд`.

### 3. `#функция-ценности-состояния` (Part1Limits § 3)

- **Статус:** ✓ СУЩЕСТВУЕТ.
- **Источник:** `src/components/math-rl/parts/Part1Limits.tsx:123` — `id="функция-ценности-состояния"`.
- **URL:** `/math-rl/module-1#функция-ценности-состояния`.

### 4. `#уравнение-оптимальности-беллмана` (Part1Limits § 4)

- **Статус:** ✓ СУЩЕСТВУЕТ (с дублированием id в двух разных файлах).
- **Источники:**
  - `src/components/math-rl/parts/Part1Limits.tsx:154` — `id="уравнение-оптимальности-беллмана"` → `/math-rl/module-1#уравнение-оптимальности-беллмана`.
  - `src/components/math-rl/module1/Chapter5.tsx:36` — `id="уравнение-оптимальности-беллмана"` → `/math-rl/module-5#уравнение-оптимальности-беллмана`.
- **Предупреждение:** оба id идентичны, поэтому нужно явно выбирать `hubPath` (`/math-rl/module-1` или `/math-rl/module-5`). На одной странице два элемента с одинаковым `id` не отрендерятся, т.к. Part1 и Part5 загружаются на разных маршрутах — коллизии нет.
- **Рекомендация:** из урока 1.5 логичнее ссылаться на «сердце RL» — Chapter5 (`/math-rl/module-5#уравнение-оптимальности-беллмана`), а `Part1Limits § 4` использовать для более «мягкой» математической интуиции.

### 5. `#пример-mdp-с-двумя-состояниями` (Part1Limits § 5)

- **Статус:** ✓ СУЩЕСТВУЕТ.
- **Источник:** `src/components/math-rl/parts/Part1Limits.tsx:360` — `id="пример-mdp-с-двумя-состояниями"`.
- **URL:** `/math-rl/module-1#пример-mdp-с-двумя-состояниями`.

### 6. `#марковское-свойство` (Chapter3)

- **Статус:** ✓ СУЩЕСТВУЕТ.
- **Источник:** `src/components/math-rl/module1/Chapter3.tsx:42` — `id="марковское-свойство"`.
- **URL:** `/math-rl/module-5#марковское-свойство`.

### 7. `#функции-ценности-value-functions` (Chapter4)

- **Статус:** ✓ СУЩЕСТВУЕТ.
- **Источник:** `src/components/math-rl/module1/Chapter4.tsx:33` — `id="функции-ценности-value-functions"`.
- **URL:** `/math-rl/module-5#функции-ценности-value-functions`.

### 8. `#уравнение-ожиданий-беллмана` (Chapter5)

- **Статус:** ✓ СУЩЕСТВУЕТ.
- **Источник:** `src/components/math-rl/module1/Chapter5.tsx:14` — `id="уравнение-ожиданий-беллмана"`.
- **URL:** `/math-rl/module-5#уравнение-ожиданий-беллмана`.

---

## Итоговая сводка по запрошенному списку

| Запрошенный anchor | Статус | Актуальный anchor (URL) |
|---|---|---|
| `#предел-последовательности-random-variable` | ✗ не существует | `/math-rl/module-1#1-1-предел-последовательности` (предел) или `/math-rl/module-5#случайная-величина-random-variable` (RV) |
| `#геометрический-ряд` | ✓ ok | `/math-rl/module-1#геометрический-ряд` |
| `#функция-ценности-состояния` | ✓ ok | `/math-rl/module-1#функция-ценности-состояния` |
| `#уравнение-оптимальности-беллмана` | ✓ ok (есть в двух модулях) | `/math-rl/module-5#уравнение-оптимальности-беллмана` (рекомендовано) и/или `/math-rl/module-1#уравнение-оптимальности-беллмана` |
| `#пример-mdp-с-двумя-состояниями` | ✓ ok | `/math-rl/module-1#пример-mdp-с-двумя-состояниями` |
| `#марковское-свойство` | ✓ ok | `/math-rl/module-5#марковское-свойство` |
| `#функции-ценности-value-functions` | ✓ ok | `/math-rl/module-5#функции-ценности-value-functions` |
| `#уравнение-ожиданий-беллмана` | ✓ ok | `/math-rl/module-5#уравнение-ожиданий-беллмана` |

## Прочие замечания по аудиту (ничего не меняется)

1. **Текущий урок 1.5** уже использует один cross-link на хаб: `hubPath="/math-rl/module-5" hubAnchor="глава-5"` (строка 603–609 в `CourseLesson1_5.tsx`) и общий cross-link на `/math-rl/module-5` без anchor (строки 961–965). Глубоких якорных ссылок из уроков 1.5 на конкретные темы хаба пока нет — потенциал для enrichment'а большой.
2. **`src/config/crosslinks.ts`** объявляет cross-links для lesson 1-5 на anchor'ы `глава-3`, `глава-5`, `глава-6`. Все три существуют (Chapter3/Chapter5/Chapter6) как Section id, но в виде коротких anchor'ов — они ведут к началу главы, а не к конкретной подтеме.
3. **Дубликат id `уравнение-оптимальности-беллмана`** присутствует в двух компонентах (`Part1Limits` и `Chapter5`), но на разных маршрутах — `/math-rl/module-1` и `/math-rl/module-5` соответственно. Кросс-ссылка должна явно задавать `hubPath`, чтобы попасть в нужный.
4. **`MathRLModule5.tsx`** не используется роутером — дублирует функциональность `Part5FundamentalRL`. Не трогаем по заданию, но отмечаем.
