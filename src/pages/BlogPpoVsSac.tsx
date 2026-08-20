import BlogLayout from "@/components/BlogLayout";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { blogPosts } from "@/pages/Blog";
import LabPracticeSection from "@/components/LabPracticeSection";

const post = blogPosts.find((p) => p.slug === "ppo-vs-sac")!;

const toc = [
  { id: "intro", title: "Введение" },
  { id: "stability", title: "Стабильность обучения" },
  { id: "speed", title: "Скорость обучения" },
  { id: "actions", title: "Дискретные vs непрерывные действия" },
  { id: "complexity", title: "Сложность реализации" },
  { id: "table", title: "Таблица сравнения" },
  { id: "recommendations", title: "Рекомендации по сценариям" },
  { id: "conclusion", title: "Заключение" },
];

const BlogPpoVsSac = () => (
  <BlogLayout post={post} toc={toc}>
    <section id="intro">
      <h2 className="text-2xl font-bold text-foreground mb-3">Введение</h2>
      <p className="text-muted-foreground leading-relaxed">
        Выбор алгоритма обучения с подкреплением — одно из самых важных решений при разработке RL-агента для игры.
        Два алгоритма доминируют в индустрии: <strong className="text-primary">PPO</strong> (Proximal Policy Optimization)
        и <strong className="text-secondary">SAC</strong> (Soft Actor-Critic). Оба доказали свою эффективность в
        реальных проектах, но работают на принципиально разных принципах. PPO — on-policy алгоритм, который
        обновляет политику небольшими шагами, используя clipped surrogate objective для стабильности.
        SAC — off-policy алгоритм, основанный на принципе максимальной энтропии, что делает агента более
        исследовательным и робастным. В этой статье мы детально сравним оба подхода и поможем вам сделать
        осознанный выбор для вашего проекта.
      </p>
    </section>

    <section id="stability">
      <h2 className="text-2xl font-bold text-foreground mb-3">Стабильность обучения</h2>
      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-primary">PPO</strong> славится своей стабильностью. Механизм clipping ограничивает
        изменения политики на каждом шаге, что предотвращает катастрофическое ухудшение производительности.
        Это делает PPO «рабочей лошадкой» — алгоритмом, который редко ломается полностью. OpenAI выбрал PPO
        как стандарт для многих своих проектов именно за эту надёжность. Unity ML-Agents также использует PPO
        как алгоритм по умолчанию.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        <strong className="text-secondary">SAC</strong> менее стабилен «из коробки», но при правильной настройке
        может достигать лучших результатов. Автоматическая настройка температуры α помогает балансировать
        между исследованием и эксплуатацией, но twin Q-networks и reparameterization trick добавляют
        дополнительные точки отказа. Если обучение SAC идёт хорошо — результаты часто превосходят PPO,
        но если что-то пошло не так, диагностика сложнее.
      </p>
    </section>

    <section id="speed">
      <h2 className="text-2xl font-bold text-foreground mb-3">Скорость обучения</h2>
      <p className="text-muted-foreground leading-relaxed">
        Ключевое преимущество SAC — <strong className="text-foreground">sample efficiency</strong>.
        Как off-policy алгоритм, SAC использует replay buffer и может переиспользовать старый опыт.
        Это означает, что для достижения одного и того же уровня производительности SAC обычно
        требует в 3-10 раз меньше взаимодействий со средой.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        PPO, будучи on-policy алгоритмом, использует каждый батч данных только несколько раз (num_epoch)
        и затем отбрасывает их. Это «расточительно» в плане данных, но компенсируется простотой
        параллелизации: запустите 16 параллельных сред, и PPO будет получать данные в 16 раз быстрее.
        В Unity ML-Agents это делается одной строкой в YAML-конфиге.
      </p>
      <CyberCodeBlock language="python" filename="parallel_comparison.yaml">
{`# PPO: компенсирует sample inefficiency параллелизацией
# Запуск с 16 параллельными средами:
mlagents-learn config.yaml --run-id=ppo_16env --num-envs=16

# SAC: меньше сред, но эффективнее использует данные
mlagents-learn config.yaml --run-id=sac_4env --num-envs=4`}
      </CyberCodeBlock>
    </section>

    <section id="actions">
      <h2 className="text-2xl font-bold text-foreground mb-3">Дискретные vs непрерывные действия</h2>
      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-primary">PPO</strong> одинаково хорошо работает с обоими типами действий.
        Для дискретных действий он использует Categorical distribution, для непрерывных — Gaussian.
        Это делает PPO универсальным выбором для любого типа игры: от пошаговых стратегий (дискретные)
        до симуляторов вождения (непрерывные).
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        <strong className="text-secondary">SAC</strong> изначально разработан для <strong className="text-foreground">непрерывных</strong> пространств
        действий. Reparameterization trick, который лежит в основе SAC, работает с Gaussian policy.
        Хотя существуют адаптации SAC для дискретных действий (SAC-Discrete), они менее распространены
        и хуже поддерживаются в ML-Agents. Если ваш агент управляет рулём и газом —  SAC отличный выбор.
        Если агент выбирает из 4 направлений движения — лучше PPO.
      </p>
    </section>

    <section id="complexity">
      <h2 className="text-2xl font-bold text-foreground mb-3">Сложность реализации</h2>
      <p className="text-muted-foreground leading-relaxed">
        PPO значительно проще в реализации. Ядро алгоритма — это clipped surrogate loss,
        GAE для advantage estimation и простой цикл обучения. Полная реализация занимает
        ~150 строк PyTorch-кода. Гиперпараметры PPO относительно интуитивны: learning rate,
        clip epsilon, число эпох.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        SAC требует больше компонентов: actor network, twin Q-networks, target networks,
        replay buffer, автонастройка температуры α. Полная реализация — ~250-300 строк.
        Гиперпараметры SAC менее интуитивны, и ошибки в настройке чаще приводят к полному
        провалу обучения. Однако при правильной настройке SAC может быть более «set-and-forget»
        благодаря автонастройке ключевых параметров.
      </p>
    </section>

    <section id="table">
      <h2 className="text-2xl font-bold text-foreground mb-3">Таблица сравнения</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-border/50 rounded-lg overflow-hidden">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-3 text-foreground font-semibold">Критерий</th>
              <th className="text-left p-3 text-primary font-semibold">PPO</th>
              <th className="text-left p-3 text-secondary font-semibold">SAC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            <tr><td className="p-3 text-muted-foreground">Тип</td><td className="p-3 text-muted-foreground">On-policy</td><td className="p-3 text-muted-foreground">Off-policy</td></tr>
            <tr><td className="p-3 text-muted-foreground">Стабильность</td><td className="p-3 text-green-400">★★★★★</td><td className="p-3 text-muted-foreground">★★★☆☆</td></tr>
            <tr><td className="p-3 text-muted-foreground">Sample Efficiency</td><td className="p-3 text-muted-foreground">★★☆☆☆</td><td className="p-3 text-green-400">★★★★★</td></tr>
            <tr><td className="p-3 text-muted-foreground">Дискретные действия</td><td className="p-3 text-green-400">Отлично</td><td className="p-3 text-muted-foreground">Ограниченно</td></tr>
            <tr><td className="p-3 text-muted-foreground">Непрерывные действия</td><td className="p-3 text-muted-foreground">Хорошо</td><td className="p-3 text-green-400">Отлично</td></tr>
            <tr><td className="p-3 text-muted-foreground">Параллелизация</td><td className="p-3 text-green-400">Отлично</td><td className="p-3 text-muted-foreground">Средне</td></tr>
            <tr><td className="p-3 text-muted-foreground">Простота настройки</td><td className="p-3 text-green-400">Высокая</td><td className="p-3 text-muted-foreground">Средняя</td></tr>
            <tr><td className="p-3 text-muted-foreground">Финальный результат</td><td className="p-3 text-muted-foreground">Хороший</td><td className="p-3 text-green-400">Часто лучше</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="recommendations">
      <h2 className="text-2xl font-bold text-foreground mb-3">Рекомендации по сценариям</h2>
      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-primary">Выбирайте PPO</strong>, если: это ваш первый RL-проект; задача имеет дискретные
        действия; вы хотите быстро получить baseline; нужна стабильность и предсказуемость;
        у вас есть доступ к параллельным средам.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        <strong className="text-secondary">Выбирайте SAC</strong>, если: задача с непрерывными действиями (вождение,
        робототехника); среда дорогая в вычислении (каждое взаимодействие ценно); вы готовы
        потратить время на настройку; хотите максимального качества агента.
      </p>
      <p className="text-muted-foreground leading-relaxed mt-3">
        <strong className="text-foreground">Совет</strong>: начните с PPO как baseline. Если результат
        неудовлетворительный для непрерывных действий — попробуйте SAC. Многие опытные
        исследователи тренируют обоими алгоритмами параллельно и выбирают лучший результат.
      </p>
    </section>

    <section id="conclusion">
      <h2 className="text-2xl font-bold text-foreground mb-3">Заключение</h2>
      <p className="text-muted-foreground leading-relaxed">
        Нет «лучшего» алгоритма — есть подходящий для конкретной задачи. PPO — надёжный
        универсал, SAC — специалист по непрерывным действиям. Понимание сильных и слабых
        сторон каждого алгоритма позволит вам быстрее достигать результата. В нашем курсе
        мы реализуем оба алгоритма с нуля, чтобы вы не просто знали теорию, но и понимали
        каждую строку кода.
      </p>
    </section>
  {/* Практика: собранная среда лаборатории для этой темы. */}
  <LabPracticeSection contextKey="/blog/ppo-vs-sac" />

  </BlogLayout>
);

export default BlogPpoVsSac;
