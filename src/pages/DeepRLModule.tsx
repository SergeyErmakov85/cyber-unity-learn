import { Button } from "@/components/ui/button";
import HubLessonBadges from "@/components/HubLessonBadges";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Brain, Zap, Target, Code2, TrendingUp, Layers, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import LabPracticeSection from "@/components/LabPracticeSection";

const DeepRLModule = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> На главную
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent">
              Deep RL
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              Deep Reinforcement Learning
            </span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Глубокое обучение с подкреплением: от теоретических основ до практической реализации
            алгоритмов, объединяющих нейронные сети и методы RL.
          </p>
        </div>
      </div>

      {/* Content with sticky sidebar */}
      <div className="container mx-auto px-4 py-12 flex gap-8">
        {/* Sticky TOC sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-[260px]">
            <Card className="bg-card/60 backdrop-blur-sm border-accent/20">
              <CardContent className="p-5">
                <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent" />
                  Содержание
                </h2>
                <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
                  <li><a href="#foundations" className="text-accent hover:underline">Основы Deep RL</a></li>
                  <li><a href="#algorithms" className="text-accent hover:underline">Ключевые алгоритмы</a></li>
                  <li><a href="#practice" className="text-accent hover:underline">Практическое применение</a></li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 max-w-4xl space-y-12">

        {/* С чего начать на нашей платформе */}
        <Card className="bg-card/60 backdrop-blur-sm border-accent/20">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">С чего начать на нашей платформе</h3>
            <p className="text-muted-foreground leading-relaxed">
              Платформа предоставляет структурированный путь изучения Deep RL:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
              <li>
                <strong className="text-foreground">Математические основы</strong> — модули 1–5 покрывают
                вероятности, нейронные сети, MDP, оптимизацию и Q-learning.
              </li>
              <li>
                <strong className="text-foreground">PyTorch</strong> — модуль 6 с реализацией DQN для
                среды Taxi-v3. Полный код с пошаговыми комментариями.
              </li>
              <li>
                <strong className="text-foreground">Unity ML-Agents</strong> — модуль 7 с интеграцией
                PyTorch и Unity для обучения агентов в 3D-средах.
              </li>
              <li>
                <strong className="text-foreground">Алгоритмы</strong> — детальный разбор PPO, SAC, DQN
                и A3C с математикой, кодом и квизами.
              </li>
              <li>
                <strong className="text-foreground">Проекты Unity</strong> — практические проекты:
                Ball Balance, GridWorld, Racing Car, Soccer.
              </li>
            </ol>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button
                variant="outline"
                size="sm"
                className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10"
                onClick={() => navigate("/math-rl")}
              >
                Математические основы →
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-primary/50 text-primary hover:bg-primary/10"
                onClick={() => navigate("/pytorch")}
              >
                PyTorch →
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-secondary/50 text-secondary hover:bg-secondary/10"
                onClick={() => navigate("/unity-ml-agents")}
              >
                Unity ML-Agents →
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-accent/50 text-accent hover:bg-accent/10"
                onClick={() => navigate("/algorithms")}
              >
                Алгоритмы →
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                onClick={() => navigate("/unity-projects")}
              >
                Проекты Unity →
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 1. Основы Deep RL */}
        <section id="foundations" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-6 h-6 text-accent" />
            1. Основы Deep Reinforcement Learning
          </h2>
          <HubLessonBadges hubPath="/deep-rl" hubAnchor="foundations" />

          <Card className="bg-card/60 backdrop-blur-sm border-accent/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Что такое Deep RL?</h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Deep Reinforcement Learning (Deep RL)</strong> — это направление
                машинного обучения, объединяющее глубокие нейронные сети (Deep Learning) с методами обучения
                с подкреплением (Reinforcement Learning) (введение — <CrossLinkToLesson lessonId="1-1" lessonPath="/courses/1-1" lessonTitle="Что такое обучение с подкреплением?" lessonLevel={1} />). Вместо ручного проектирования признаков агент
                самостоятельно извлекает полезные представления из «сырых» данных — изображений, звуков
                или сенсорных сигналов.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Классический RL ограничен задачами с небольшим числом состояний, где можно хранить Q-таблицу.
                Deep RL снимает это ограничение, аппроксимируя функции ценности или политику нейронными сетями,
                что позволяет работать с непрерывными и высокоразмерными пространствами состояний.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-accent/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Ключевые концепции</h3>
              <ul className="list-disc list-inside space-y-3 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Аппроксимация функции ценности:</strong> Нейронная сеть
                  заменяет таблицу Q-значений, принимая состояние на вход и выдавая оценки ценности
                  для каждого действия. Это позволяет обобщать знания на похожие, ранее не виденные состояния.
                </li>
                <li>
                  <strong className="text-foreground">Policy Gradient:</strong> Вместо оценки ценности действий
                  нейросеть напрямую параметризует политику — вероятностное распределение над действиями.
                  Градиенты политики позволяют оптимизировать ожидаемую суммарную награду напрямую.
                </li>
                <li>
                  <strong className="text-foreground">Experience Replay:</strong> Буфер опыта хранит переходы
                  (s, a, r, s'), из которых случайно выбираются мини-батчи для обучения. Это разрывает
                  корреляции между последовательными данными и повышает эффективность использования опыта.
                </li>
                <li>
                  <strong className="text-foreground">Target Network:</strong> Вспомогательная сеть с
                  «замороженными» весами, которая используется для вычисления целевых значений. Периодическое
                  обновление целевой сети стабилизирует обучение и предотвращает осцилляции.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Отличия от классического RL</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border border-border/30 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-card/80">
                      <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Аспект</th>
                      <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Классический RL</th>
                      <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Deep RL</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/20">
                      <td className="p-3 font-medium text-foreground">Представление</td>
                      <td className="p-3">Q-таблица</td>
                      <td className="p-3">Нейронная сеть</td>
                    </tr>
                    <tr className="border-b border-border/20">
                      <td className="p-3 font-medium text-foreground">Пространство состояний</td>
                      <td className="p-3">Дискретное, малое</td>
                      <td className="p-3">Непрерывное, высокоразмерное</td>
                    </tr>
                    <tr className="border-b border-border/20">
                      <td className="p-3 font-medium text-foreground">Обобщение</td>
                      <td className="p-3">Отсутствует</td>
                      <td className="p-3">На похожие состояния</td>
                    </tr>
                    <tr className="border-b border-border/20">
                      <td className="p-3 font-medium text-foreground">Входные данные</td>
                      <td className="p-3">Признаки вручную</td>
                      <td className="p-3">Сырые данные (пиксели и др.)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-foreground">Сложность</td>
                      <td className="p-3">Простая реализация</td>
                      <td className="p-3">Требует GPU, большие данные</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 2. Ключевые алгоритмы */}
        <section id="algorithms" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Layers className="w-6 h-6 text-secondary" />
            2. Ключевые алгоритмы Deep RL
          </h2>
          <HubLessonBadges hubPath="/deep-rl" hubAnchor="algorithms" />
          <p className="text-sm text-muted-foreground -mt-2 mb-2">
            В курсе подробнее: мультиагенты —{" "}
            <CrossLinkToLesson lessonId="3-2" lessonPath="/courses/3-2" lessonTitle="MA-POCA и Self-Play" lessonLevel={3} />
            ; имитационное обучение —{" "}
            <CrossLinkToLesson lessonId="3-4" lessonPath="/courses/3-4" lessonTitle="Имитационное обучение (GAIL)" lessonLevel={3} />
            .
          </p>

          <Card className="bg-card/60 backdrop-blur-sm border-secondary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Deep Q-Network (DQN)
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">DQN</strong> — прорывной алгоритм DeepMind (2013), который
                впервые продемонстрировал способность агента играть в игры Atari на уровне человека,
                используя только пиксели экрана как входные данные (реализация — <CrossLinkToLesson lessonId="1-5" lessonPath="/courses/1-5" lessonTitle="DQN с нуля на PyTorch" lessonLevel={1} />).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Основные инновации DQN:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Experience Replay Buffer:</strong> Хранит до 1 млн переходов, из которых
                  случайно выбираются мини-батчи. Это устраняет корреляции между данными и позволяет
                  многократно использовать каждый переход.</li>
                <li><strong className="text-foreground">Target Network:</strong> Отдельная копия Q-сети, обновляемая
                  каждые N шагов. Стабилизирует обучение, устраняя «движущуюся цель» в целевой функции.</li>
                <li><strong className="text-foreground">Свёрточные слои:</strong> CNN автоматически извлекает
                  пространственные признаки из кадров игры (84×84 пикселей в оттенках серого).</li>
              </ul>
              <CyberCodeBlock language="pseudo">{`# Ключевая формула обновления DQN:
# Q(s,a) ← r + γ · max_a' Q_target(s', a')

# Архитектура сети для Atari:
# Conv2d(4, 32, 8, stride=4) → ReLU
# Conv2d(32, 64, 4, stride=2) → ReLU
# Conv2d(64, 64, 3, stride=1) → ReLU
# Linear(3136, 512) → ReLU
# Linear(512, n_actions)`}</CyberCodeBlock>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-secondary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Target className="w-5 h-5 text-secondary" />
                Proximal Policy Optimization (PPO)
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">PPO</strong> — алгоритм от OpenAI (2017), ставший стандартом де-факто
                для обучения с подкреплением (с нуля — <CrossLinkToLesson lessonId="2-2" lessonPath="/courses/2-2" lessonTitle="PPO — Proximal Policy Optimization" lessonLevel={2} />). Используется в Unity ML-Agents как алгоритм по умолчанию,
                а также в обучении ChatGPT через RLHF.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                PPO решает проблему Policy Gradient методов — нестабильность обучения при больших обновлениях
                политики. Он ограничивает размер изменений через «клипирование» суррогатной целевой функции.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Клипированная целевая функция:</strong> Ограничивает
                  отношение новой и старой политик в диапазоне [1−ε, 1+ε], предотвращая
                  катастрофически большие обновления.</li>
                <li><strong className="text-foreground">Advantage Estimation (GAE):</strong> Использует
                  обобщённую оценку преимущества для снижения дисперсии градиентов при сохранении
                  низкого смещения.</li>
                <li><strong className="text-foreground">Actor-Critic архитектура:</strong> Два выхода сети —
                  политика (Actor) и оценка ценности состояния (Critic), обучаемые совместно.</li>
              </ul>
              <CyberCodeBlock language="pseudo">{`# Целевая функция PPO (клипированная):
# L_CLIP = E[min(r_t(θ) · A_t, clip(r_t(θ), 1-ε, 1+ε) · A_t)]
#
# где r_t(θ) = π_θ(a|s) / π_θ_old(a|s)
#     A_t — оценка преимущества (advantage)
#     ε = 0.2 (типичное значение)`}</CyberCodeBlock>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-secondary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Soft Actor-Critic (SAC)
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">SAC</strong> — off-policy алгоритм от UC Berkeley (2018),
                который максимизирует не только суммарную награду, но и энтропию политики (<CrossLinkToLesson lessonId="3-1" lessonPath="/courses/3-1" lessonTitle="SAC — Soft Actor-Critic" lessonLevel={3} />). Это поощряет
                исследование среды и делает обучение более устойчивым.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                SAC особенно эффективен для задач с непрерывным пространством действий — робототехника,
                управление транспортными средствами, симуляция физики.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Максимизация энтропии:</strong> Агент стремится
                  действовать как можно более «случайно», при этом получая максимальную награду.
                  Это предотвращает преждевременную сходимость к субоптимальной политике.</li>
                <li><strong className="text-foreground">Двойные Q-сети:</strong> Две независимые Q-функции
                  для борьбы с переоценкой Q-значений. Используется минимум из двух оценок.</li>
                <li><strong className="text-foreground">Автоматическая настройка температуры:</strong> Коэффициент
                  α (баланс между наградой и энтропией) подбирается автоматически в процессе обучения.</li>
              </ul>
              <CyberCodeBlock language="pseudo">{`# Целевая функция SAC:
# J(π) = E[Σ γ^t (r_t + α · H(π(·|s_t)))]
#
# где H(π) = -E[log π(a|s)] — энтропия политики
#     α — температурный коэффициент
#
# Обновление Q-функции:
# Q(s,a) ← r + γ · (min(Q1, Q2)(s',a') - α · log π(a'|s'))`}</CyberCodeBlock>
            </CardContent>
          </Card>
        </section>

        {/* 3. Практическое применение */}
        <section id="practice" className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Code2 className="w-6 h-6 text-primary" />
            3. Практическое применение
          </h2>
          <HubLessonBadges hubPath="/deep-rl" hubAnchor="practice" />
          <p className="text-sm text-muted-foreground -mt-2 mb-2">
            Curriculum Learning в Unity ML-Agents — урок{" "}
            <CrossLinkToLesson lessonId="3-3" lessonPath="/courses/3-3" lessonTitle="Curriculum Learning" lessonLevel={3} />
            .
          </p>

          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Игровые среды и симуляции</h3>
              <p className="text-muted-foreground leading-relaxed">
                Deep RL активно используется для обучения агентов в игровых средах (reward — <CrossLinkToLesson lessonId="2-4" lessonPath="/courses/2-4" lessonTitle="Reward Shaping и Curriculum" lessonLevel={2} />). Это идеальная площадка
                для экспериментов, поскольку игры предоставляют чёткие правила, измеримые награды и
                контролируемую сложность (деплой — <CrossLinkToLesson lessonId="3-5" lessonPath="/courses/3-5" lessonTitle="ONNX-экспорт и деплой в Unity" lessonLevel={3} />).
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Atari Games:</strong> Классический бенчмарк для DQN —
                  57 игр Atari 2600. Агент обучается играть, получая на вход только пиксели экрана.</li>
                <li><strong className="text-foreground">Unity ML-Agents:</strong> 3D-среды для обучения агентов
                  в физически реалистичных симуляциях — балансировка мяча, гонки, командный футбол.</li>
                <li><strong className="text-foreground">MuJoCo / PyBullet:</strong> Физические симуляторы
                  для задач робототехники — ходьба, манипуляция объектами, управление дронами.</li>
                <li><strong className="text-foreground">StarCraft II, Dota 2:</strong> Сложные стратегические
                  игры, где агенты Deep RL достигли сверхчеловеческого уровня (AlphaStar, OpenAI Five).</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Реальные приложения</h3>
              <p className="text-muted-foreground leading-relaxed">
                Помимо игр, Deep RL находит применение во множестве практических областей:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">Робототехника:</strong> Обучение роботов манипуляции
                  объектами, навигации в незнакомых средах, координированному движению конечностей.
                  Sim-to-Real transfer позволяет обучать в симуляции и переносить на реального робота.</li>
                <li><strong className="text-foreground">Автономное вождение:</strong> Планирование траектории,
                  принятие решений на перекрёстках, адаптивное управление скоростью. Deep RL дополняет
                  классические методы компьютерного зрения.</li>
                <li><strong className="text-foreground">NLP и LLM:</strong> RLHF (Reinforcement Learning from
                  Human Feedback) — ключевая технология для обучения языковых моделей, таких как ChatGPT.
                  PPO используется для выравнивания модели с человеческими предпочтениями.</li>
                <li><strong className="text-foreground">Оптимизация ресурсов:</strong> Управление дата-центрами
                  (DeepMind снизил энергопотребление Google на 40%), оптимизация рекламных ставок,
                  управление портфелем инвестиций.</li>
              </ul>
            </CardContent>
          </Card>

        </section>

        {/* Практика: собранная среда лаборатории для этой темы. */}
        <LabPracticeSection contextKey="/deep-rl" />

        </div>
      </div>
    </div>
  );
};

export default DeepRLModule;
