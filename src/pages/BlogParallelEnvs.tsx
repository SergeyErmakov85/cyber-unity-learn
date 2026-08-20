import BlogLayout from "@/components/BlogLayout";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { blogPosts } from "@/pages/Blog";
import LabPracticeSection from "@/components/LabPracticeSection";

const post = blogPosts.find((p) => p.slug === "parallel-envs")!;

const toc = [
  { id: "intro", title: "Введение" },
  { id: "why", title: "Зачем нужна параллелизация" },
  { id: "unity", title: "Параллелизация в Unity ML-Agents" },
  { id: "python", title: "Python-стороне: SubprocVecEnv" },
  { id: "hardware", title: "GPU vs CPU для RL" },
  { id: "benchmark", title: "Бенчмарки" },
  { id: "conclusion", title: "Заключение" },
];

const BlogParallelEnvs = () => (
  <BlogLayout post={post} toc={toc}>
    <section id="intro">
      <h2 className="text-2xl font-bold text-foreground mb-3">Введение</h2>
      <p className="text-muted-foreground leading-relaxed">
        Обучение RL-агента — это процесс, который может занимать часы и даже дни. Однако большую часть
        этого времени агент просто ждёт: ждёт, пока среда обработает его действие, ждёт, пока физический
        движок рассчитает следующий кадр. Параллелизация сред — самый эффективный способ ускорить обучение,
        иногда в 10-20 раз. В этой статье мы покажем, как настроить параллельные среды в Unity ML-Agents
        и Python, выбрать правильное железо и оптимизировать пайплайн обучения.
      </p>
    </section>

    <section id="why">
      <h2 className="text-2xl font-bold text-foreground mb-3">Зачем нужна параллелизация</h2>
      <p className="text-muted-foreground leading-relaxed">
        On-policy алгоритмы (PPO) требуют огромного количества данных. Каждый batch используется
        только несколько раз, после чего выбрасывается. Чтобы собрать batch из 2048 переходов с
        одной средой при 20 FPS, нужно ~100 секунд. С 16 параллельными средами — всего 6 секунд.
        При миллионе шагов обучения разница составляет часы.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        Кроме скорости, параллелизация улучшает <strong className="text-foreground">качество градиентов</strong>.
        Данные из разных сред декоррелированы — агент видит разнообразный опыт одновременно, что
        снижает дисперсию градиента и ускоряет сходимость. Это особенно важно для PPO, где
        on-policy данные имеют тенденцию быть коррелированными.
      </p>
    </section>

    <section id="unity">
      <h2 className="text-2xl font-bold text-foreground mb-3">Параллелизация в Unity ML-Agents</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        ML-Agents поддерживает два типа параллелизации. Первый — <strong className="text-primary">внутри одной сцены</strong>:
        разместите несколько копий агента + среды на сцене. Все агенты обучаются одновременно,
        используя общий физический движок. Это самый простой и эффективный способ.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Второй — <strong className="text-primary">множество инстансов Unity</strong> через параметр
        <code className="text-primary"> --num-envs</code>. ML-Agents запускает N копий Unity-приложения
        как отдельные процессы. Каждый инстанс работает независимо, что позволяет использовать
        все ядра процессора. Оптимально: столько инстансов, сколько физических ядер CPU.
      </p>
      <CyberCodeBlock language="python" filename="parallel_training.sh">
{`# Вариант 1: увеличьте time_scale (быстрее физика)
# В YAML-конфиге:
# time_scale: 20  (по умолчанию 20, макс ~100)

# Вариант 2: множество инстансов Unity
mlagents-learn config.yaml --run-id=fast_train \\
  --num-envs=8 \\
  --no-graphics

# Вариант 3: комбинация (8 инстансов × 4 агента = 32 параллельных агента)
# Разместите 4 копии среды в Unity-сцене + запустите 8 инстансов`}
      </CyberCodeBlock>
      <CyberCodeBlock language="python" filename="optimized_config.yaml">
{`behaviors:
  FastAgent:
    trainer_type: ppo
    max_steps: 1000000
    time_horizon: 128

    hyperparameters:
      batch_size: 512      # увеличьте с параллельными средами
      buffer_size: 4096    # больше данных за итерацию
      learning_rate: 3.0e-4
      num_epoch: 4

    network_settings:
      hidden_units: 256
      num_layers: 2
      normalize: true`}
      </CyberCodeBlock>
    </section>

    <section id="python">
      <h2 className="text-2xl font-bold text-foreground mb-3">Python-стороне: SubprocVecEnv</h2>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Если вы работаете с Gym-средами (CartPole, MuJoCo), используйте векторизованные среды
        из Stable Baselines3. SubprocVecEnv запускает каждую среду в отдельном процессе,
        DummyVecEnv — в одном потоке (быстрее для лёгких сред).
      </p>
      <CyberCodeBlock language="python" filename="vecenv_example.py">
{`from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import SubprocVecEnv, DummyVecEnv
from stable_baselines3.common.env_util import make_vec_env
import gym

# Простой способ: make_vec_env
env = make_vec_env("CartPole-v1", n_envs=8, vec_env_cls=SubprocVecEnv)

# Обучение PPO с параллельными средами
model = PPO("MlpPolicy", env, verbose=1,
            batch_size=256,
            n_steps=128)  # steps per env per update
model.learn(total_timesteps=500_000)

# Эффективный batch: 8 envs × 128 steps = 1024 transitions/update`}
      </CyberCodeBlock>
    </section>

    <section id="hardware">
      <h2 className="text-2xl font-bold text-foreground mb-3">GPU vs CPU для RL</h2>
      <p className="text-muted-foreground leading-relaxed">
        Контринтуитивный факт: в RL <strong className="text-foreground">GPU не всегда быстрее</strong>.
        Нейросети для RL обычно маленькие (2-3 слоя по 256 нейронов), и накладные расходы на
        передачу данных CPU↔GPU могут превышать выигрыш от параллельных вычислений. GPU выгоден
        при больших batch_size (&gt;1024) и больших сетях (CNN для визуальных наблюдений).
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        Для большинства задач с векторными наблюдениями CPU-обучение быстрее. Инвестируйте
        в многоядерный процессор для параллелизации сред, а не в дорогую GPU. Исключение —
        визуальные наблюдения (камера), где CNN на GPU даёт значительный выигрыш.
      </p>
    </section>

    <section id="benchmark">
      <h2 className="text-2xl font-bold text-foreground mb-3">Бенчмарки</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-border/50 rounded-lg overflow-hidden">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-3 text-foreground font-semibold">Конфигурация</th>
              <th className="text-left p-3 text-foreground font-semibold">Время (1M шагов)</th>
              <th className="text-left p-3 text-foreground font-semibold">Ускорение</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            <tr><td className="p-3 text-muted-foreground">1 среда, time_scale=1</td><td className="p-3 text-muted-foreground">~14 часов</td><td className="p-3 text-muted-foreground">1×</td></tr>
            <tr><td className="p-3 text-muted-foreground">1 среда, time_scale=20</td><td className="p-3 text-muted-foreground">~45 мин</td><td className="p-3 text-primary">~18×</td></tr>
            <tr><td className="p-3 text-muted-foreground">4 среды, time_scale=20</td><td className="p-3 text-muted-foreground">~15 мин</td><td className="p-3 text-primary">~56×</td></tr>
            <tr><td className="p-3 text-muted-foreground">8 сред, time_scale=20</td><td className="p-3 text-muted-foreground">~9 мин</td><td className="p-3 text-green-400">~93×</td></tr>
            <tr><td className="p-3 text-muted-foreground">16 сред, time_scale=20</td><td className="p-3 text-muted-foreground">~6 мин</td><td className="p-3 text-green-400">~140×</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground mt-2 italic">* Тест на CartPole-подобной среде, 8-ядерный CPU. Результаты зависят от сложности среды.</p>
    </section>

    <section id="conclusion">
      <h2 className="text-2xl font-bold text-foreground mb-3">Заключение</h2>
      <p className="text-muted-foreground leading-relaxed">
        Параллелизация — это не просто ускорение, это необходимость для серьёзных RL-проектов.
        Начните с time_scale=20, добавьте несколько копий среды на сцену, и используйте --num-envs
        для масштабирования. С правильной настройкой вы можете обучать агента за минуты, а не часы.
        Помните: каждый час обучения — это итерация дизайна. Быстрее обучение = больше экспериментов = лучший агент.
      </p>
    </section>
  {/* Практика: собранная среда лаборатории для этой темы. */}
  <LabPracticeSection contextKey="/blog/parallel-envs" />

  </BlogLayout>
);

export default BlogParallelEnvs;
