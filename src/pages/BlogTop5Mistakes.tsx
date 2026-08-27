import BlogLayout from "@/components/BlogLayout";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { blogPosts } from "@/pages/Blog";
import LabPracticeSection from "@/components/LabPracticeSection";

const post = blogPosts.find((p) => p.slug === "top-5-mistakes")!;

const toc = [
  { id: "intro", title: "Введение" },
  { id: "mistake-1", title: "1. Неправильный reward" },
  { id: "mistake-2", title: "2. Слишком сложная среда сразу" },
  { id: "mistake-3", title: "3. Игнорирование нормализации" },
  { id: "mistake-4", title: "4. Неподходящие гиперпараметры" },
  { id: "mistake-5", title: "5. Отсутствие baseline" },
  { id: "conclusion", title: "Заключение" },
];

const BlogTop5Mistakes = () => (
  <BlogLayout post={post} toc={toc}>
    <section id="intro">
      <h2 className="text-2xl font-bold text-foreground mb-3">Введение</h2>
      <p className="text-muted-foreground leading-relaxed">
        Unity ML-Agents — мощный инструмент для создания интеллектуальных NPC, но путь к обученному
        агенту полон подводных камней. За годы работы с платформой мы выявили пять ошибок, которые
        совершают практически все новички. Каждая из них может стоить часов (а иногда дней) безрезультатного
        обучения. В этой статье мы разберём каждую ошибку, объясним почему она возникает и покажем,
        как её избежать. Если вы только начинаете работу с ML-Agents — сохраните эту статью, она сэкономит
        вам массу времени.
      </p>
    </section>

    <section id="mistake-1">
      <h2 className="text-2xl font-bold text-foreground mb-3">1. Неправильный Reward — самая критичная ошибка</h2>
      <p className="text-muted-foreground leading-relaxed">
        Функция награды — это «язык», на котором вы общаетесь с агентом. Если reward спроектирован
        неправильно, агент найдёт способ «хакнуть» систему вместо решения задачи. Классический пример:
        агент должен добраться до цели, но получает награду +0.01 за каждый шаг приближения.
        Что делает умный агент? Танцует рядом с целью, никогда не достигая её, потому что «вечное
        приближение» приносит больше суммарной награды, чем однократное достижение.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        <strong className="text-foreground">Решение:</strong> комбинируйте sparse и dense rewards. Большая
        награда за достижение цели (+1.0), небольшой штраф за время (-0.001 за шаг), и опциональные
        промежуточные награды за прогресс. Обязательно тестируйте: может ли агент получить высокую
        награду, не решая задачу? Если да — reward нужно переделывать.
      </p>
      <CyberCodeBlock language="csharp" filename="CorrectReward.cs">
{`// ❌ Плохо: reward hacking возможен
AddReward(0.01f * (1f / distToTarget));

// ✅ Хорошо: сбалансированный reward
AddReward(-0.001f);  // штраф за время
if (distToTarget < 1.5f) {
    SetReward(1.0f);  // большой бонус за цель
    EndEpisode();
}`}
      </CyberCodeBlock>
    </section>

    <section id="mistake-2">
      <h2 className="text-2xl font-bold text-foreground mb-3">2. Слишком сложная среда с самого начала</h2>
      <p className="text-muted-foreground leading-relaxed">
        Новички часто пытаются сразу создать сложную среду: лабиринт с препятствиями, врагами и
        множеством целей. Агент не может найти первую положительную награду случайным поиском,
        и обучение «зависает» на нулевой награде навсегда. Это как учить ребёнка алгебре,
        не объяснив арифметику.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        <strong className="text-foreground">Решение:</strong> начинайте с простейшей версии задачи.
        Агент должен случайно находить награду в первые минуты обучения. Постепенно усложняйте
        через Curriculum Learning: сначала пустая арена → потом одно препятствие → потом лабиринт.
        ML-Agents поддерживает curriculum из коробки через YAML-конфигурацию.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        Правило большого пальца: если агент не получает первую положительную награду за 100 тысяч
        шагов — среда слишком сложна для начального обучения. Упростите её или добавьте
        промежуточные награды.
      </p>
    </section>

    <section id="mistake-3">
      <h2 className="text-2xl font-bold text-foreground mb-3">3. Игнорирование нормализации наблюдений</h2>
      <p className="text-muted-foreground leading-relaxed">
        Наблюдения агента часто имеют разные масштабы: позиция может быть в диапазоне [-50, 50],
        скорость в [-5, 5], а флаг состояния — 0 или 1. Нейросеть обрабатывает все входы одинаково,
        и большие значения «затопляют» маленькие. Результат: агент игнорирует важные, но
        маломасштабные наблюдения.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        <strong className="text-foreground">Решение:</strong> включите нормализацию в YAML-конфиге
        ML-Agents. Это встроенный running mean/variance нормализатор, который автоматически приводит
        все наблюдения к примерно одинаковому масштабу. Дополнительно нормализуйте вручную то, что
        знаете заранее: позиции делите на размер арены, углы на π.
      </p>
      <CyberCodeBlock language="python" filename="normalize_config.yaml">
{`behaviors:
  MyAgent:
    network_settings:
      normalize: true  # ← Включите это ВСЕГДА!
      hidden_units: 256
      num_layers: 2`}
      </CyberCodeBlock>
    </section>

    <section id="mistake-4">
      <h2 className="text-2xl font-bold text-foreground mb-3">4. Неподходящие гиперпараметры</h2>
      <p className="text-muted-foreground leading-relaxed">
        Многие берут гиперпараметры из примеров ML-Agents и надеются, что они подойдут.
        Но оптимальные параметры сильно зависят от задачи. Слишком высокий learning rate
        приводит к нестабильности, слишком низкий — к застою. Маленький batch_size даёт
        шумные градиенты, большой — замедляет обучение.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        <strong className="text-foreground">Решение:</strong> начните со стандартных значений
        из документации ML-Agents, но будьте готовы экспериментировать. Следите за графиками
        в TensorBoard: если reward растёт стабильно — параметры хорошие. Если прыгает или
        падает — уменьшите learning rate. Если не растёт совсем — проверьте reward и среду.
        Для серьёзных проектов используйте Optuna для автоматического подбора.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        Ключевые параметры для настройки в первую очередь: learning_rate (начните с 3e-4),
        batch_size (128–512), buffer_size (2048–10240), num_epoch (3–10 для PPO).
      </p>
    </section>

    <section id="mistake-5">
      <h2 className="text-2xl font-bold text-foreground mb-3">5. Отсутствие baseline и метрик</h2>
      <p className="text-muted-foreground leading-relaxed">
        Без baseline вы не знаете, хорошо ли работает ваш агент. «Reward = 15» — это хорошо или
        плохо? Без сравнения — невозможно сказать. Многие новички не записывают метрики,
        не используют TensorBoard и не сохраняют промежуточные модели. Когда через 3 часа
        обучения результат ухудшается — нет возможности откатиться.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        <strong className="text-foreground">Решение:</strong> всегда создавайте baseline. Самый простой —
        Heuristic-агент (ручное управление). Запишите свой средний reward при ручной игре — это
        «потолок», к которому должен стремиться агент. Используйте TensorBoard (он интегрирован
        в ML-Agents по умолчанию) для отслеживания всех метрик. Сохраняйте чекпоинты модели
        каждые 100-200k шагов.
      </p>
      <CyberCodeBlock language="python" filename="tensorboard_usage.sh">
{`# TensorBoard уже интегрирован в ML-Agents!
# После обучения просто запустите:
tensorboard --logdir results

# Ключевые метрики для отслеживания:
# - Environment/Cumulative Reward (главная метрика)
# - Losses/Policy Loss (должен уменьшаться)
# - Losses/Value Loss (должен уменьшаться)
# - Policy/Entropy (должна плавно уменьшаться)`}
      </CyberCodeBlock>
    </section>

    <section id="conclusion">
      <h2 className="text-2xl font-bold text-foreground mb-3">Заключение</h2>
      <p className="text-muted-foreground leading-relaxed">
        Все пять ошибок объединяет одно: они незаметны для новичка и очевидны для опытного практика.
        Правильный reward, постепенное усложнение, нормализация, разумные гиперпараметры и baseline —
        это не «продвинутые техники», а базовая гигиена RL-разработки. Включите эти пять проверок
        в чеклист каждого нового проекта, и вы сэкономите десятки часов на отладке.
      </p>
    </section>
  {/* Практика: собранная среда лаборатории для этой темы. */}
  <LabPracticeSection contextKey="/blog/top-5-mistakes" />

  </BlogLayout>
);

export default BlogTop5Mistakes;
