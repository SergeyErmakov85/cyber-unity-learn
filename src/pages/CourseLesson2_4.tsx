import LessonLayout from "@/components/LessonLayout";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import ProGate from "@/components/ProGate";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import Quiz from "@/components/Quiz";
import Math from "@/components/Math";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Lightbulb, Target, Brain, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LearningCurvesChart,
  RewardHackingChart,
  StepsProbabilitySlider,
} from "@/components/math-rl/RewardShapingCharts";

const quizQuestions = [
  {
    question: "Какой тип награды с наибольшей вероятностью заставит агента бесконечно кружиться, если за каждый шаг движения он получает небольшую награду?",
    options: [
      "Sparse — агент просто не получит сигнала",
      "Dense (наивный) — классический Reward Hacking",
      "Potential-Based — теорема Ng запрещает это",
      "Любая награда приведёт к одинаковому результату",
    ],
    correctIndex: 1,
    explanation: "Наивная плотная награда без привязки к разности потенциалов часто создаёт локальный оптимум: кружение на месте бесконечно копит +0.1.",
  },
  {
    question: "В чём состоит проблема «отсроченного вознаграждения» (credit assignment)?",
    options: [
      "Агент получает слишком много наград и переобучается",
      "Невозможно понять, какие из тысяч предыдущих действий привели к награде",
      "Награда теряется в памяти Replay Buffer",
      "Дисконтирующий фактор γ всегда равен 1",
    ],
    correctIndex: 1,
    explanation: "Если робот сделал 1000 шагов и в конце получил +1, градиенты обновления политики экспоненциально затухают (γᵗ), и вклад ранних действий почти неотличим от шума.",
  },
  {
    question: "Почему Potential-Based Reward Shaping безопасен?",
    options: [
      "Он всегда увеличивает суммарную награду",
      "По теореме Ng (1999) он гарантированно сохраняет оптимальную политику",
      "Он работает только с алгоритмом DQN",
      "Он отключает дисконтирование",
    ],
    correctIndex: 1,
    explanation: "Сумма F = γΦ(s′) − Φ(s) на любом замкнутом цикле равна нулю — поэтому добавочная награда не меняет аргмакса Q-функции, и оптимальная политика инвариантна.",
  },
  {
    question: "Что произойдёт, если давать агенту +0.1 каждый раз при сокращении расстояния, без разности потенциалов?",
    options: [
      "Агент обучится быстрее и пойдёт прямо к цели",
      "Агент научится шагать вперёд-назад, бесконечно фармя награду",
      "PPO автоматически исправит ошибку через клиппинг",
      "Ничего не изменится по сравнению с potential-based",
    ],
    correctIndex: 1,
    explanation: "Это классический Reward Hacking: отойти назад (без штрафа) и снова подойти (+0.1) выгоднее, чем дойти до цели один раз.",
  },
  {
    question: "Зачем в навигационных задачах используют небольшой штраф за каждый шаг?",
    options: [
      "Чтобы наказать агента за активность",
      "Чтобы мотивировать поиск кратчайшего пути и быстрое завершение эпизода",
      "Чтобы сбалансировать энтропийный бонус SAC",
      "Это требование Unity ML-Agents",
    ],
    correctIndex: 1,
    explanation: "Шаговой штраф −0.001 превращает задачу «дойти» в задачу «дойти быстрее всех»: каждый лишний шаг уменьшает суммарную награду.",
  },
];

const CourseLesson2_4 = () => {
  const preview = (
    <>
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Sparse vs Dense Rewards</h2>
        <p className="text-muted-foreground leading-relaxed">
          Функция награды — единственный канал коммуникации с агентом. <strong className="text-foreground">Sparse reward</strong> (+1 только за достижение цели) кажется
          простым, но агент может часами блуждать вслепую. <strong className="text-foreground">Dense reward</strong>
          даёт обратную связь на каждом шаге, но его легко спроектировать неправильно — и тогда возникает <em>Reward Hacking</em>.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          В этом уроке мы разберём теорию <CrossLinkToHub hubPath="/deep-rl" hubAnchor="practice" hubTitle="Deep RL — Практика">reward shaping</CrossLinkToHub>,
          теорему Эндрю Ына о Policy Invariance и практические приёмы для Unity ML-Agents.
        </p>
      </section>
    </>
  );

  return (
    <LessonLayout
      lessonId="2-4"
      lessonTitle="Reward Shaping: искусство проектирования наград"
      lessonNumber="2.4"
      duration="45 мин"
      tags={["#theory", "#practice", "#reward-design", "#policy-invariance"]}
      level={2}
      prevLesson={{ path: "/courses/2-3", title: "Actor-Critic в Unity" }}
      nextLesson={{ path: "/courses/2-5", title: "Параллельные среды" }}
    >
      <ProGate preview={preview}>
        {preview}

        {/* ───────── 1. Sparse vs Dense ───────── */}
        <section id="mod1" className="scroll-mt-28">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/15 text-primary font-bold border border-primary/30">1</span>
            <h2 className="text-2xl font-bold text-foreground">Типы наград: Sparse vs Dense</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-card/60 backdrop-blur-sm border-destructive/30">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-destructive" /> Sparse Reward
                </h3>
                <p className="text-sm text-muted-foreground">
                  Награда выдаётся редко: <Math display={false}>{`r_t = +1`}</Math> за успех, иначе <Math display={false}>{`0`}</Math>.
                </p>
                <p className="text-xs text-muted-foreground"><strong className="text-foreground">Плюс:</strong> исключает Reward Hacking — цель чётко определена.</p>
                <p className="text-xs text-muted-foreground"><strong className="text-foreground">Минус:</strong> агент может миллионы шагов не получать сигнала.</p>
                <CyberCodeBlock language="csharp" filename="sparse.cs">
{`if (reachedGoal) AddReward(1.0f);
// Агент часами блуждает вслепую`}
                </CyberCodeBlock>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" /> Dense Reward
                </h3>
                <p className="text-sm text-muted-foreground">
                  Сигнал на каждом шаге: штраф за расстояние, бонус за приближение, штраф за время.
                </p>
                <p className="text-xs text-muted-foreground"><strong className="text-foreground">Плюс:</strong> быстрая конвергенция, постоянная обратная связь.</p>
                <p className="text-xs text-muted-foreground"><strong className="text-foreground">Минус:</strong> риск bias и Reward Hacking при наивной формулировке.</p>
                <CyberCodeBlock language="csharp" filename="dense.cs">
{`float dist = Vector3.Distance(pos, goal);
AddReward(-dist * 0.001f);
if (reachedGoal) AddReward(1.0f);`}
                </CyberCodeBlock>
              </CardContent>
            </Card>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Например, Unity GridWorld даёт небольшое отрицательное вознаграждение за каждый шаг и большой бонус
            за достижение цели — это ускоряет поиск кратчайшего пути. Формально цель агента — максимизировать
            ожидаемую дисконтированную сумму:
          </p>
          <Math>{String.raw`G_t = \sum_{k=0}^{\infty} \gamma^{k} \, r_{t+k+1}, \qquad 0 < \gamma < 1`}</Math>

          <div className="mt-6">
            <LearningCurvesChart />
          </div>

          <Card className="bg-card/60 backdrop-blur-sm border-primary/30 mt-6">
            <CardContent className="p-5 space-y-2">
              <h4 className="font-semibold text-foreground">Комбинированный пример: Sparse + Dense</h4>
              <CyberCodeBlock language="csharp" filename="CombinedReward.cs">
{`public override void OnActionReceived(ActionBuffers actionBuffers)
{
    float reward = 0f;

    // Плотная часть: штраф за текущее расстояние до цели
    float distance = Vector3.Distance(transform.position, target.position);
    reward += -0.01f * distance;

    // Разреженная часть: бонус за достижение цели
    if (distance < 1.0f)
    {
        reward += 1.0f;
        EndEpisode();
    }
    SetReward(reward);
}`}
              </CyberCodeBlock>
            </CardContent>
          </Card>
        </section>

        {/* ───────── 2. Credit Assignment & Vanishing Gradient ───────── */}
        <section id="mod2" className="scroll-mt-28 mt-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/15 text-secondary font-bold border border-secondary/30">2</span>
            <h2 className="text-2xl font-bold text-foreground">Credit Assignment & Затухающий градиент</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Если робот сделал <strong className="text-foreground">1000 случайных шагов</strong> и в конце получил <Math display={false}>{`+1`}</Math>,
            нейросеть не понимает, <em>какие именно</em> шаги были полезными. Это и есть <strong className="text-foreground">Credit Assignment Problem</strong>.
          </p>

          <Card className="bg-card/60 backdrop-blur-sm border-secondary/30 mb-6">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground mb-2">Дисконтированная награда для шага <Math display={false}>{`t = 0`}</Math> при горизонте <Math display={false}>{`T = 1000`}</Math>:</p>
              <Math>{String.raw`\nabla_\theta J(\theta) \;\propto\; \mathbb{E}\!\left[ \sum_{t=0}^{T} \gamma^{t}\, r_t \, \nabla_\theta \log \pi_\theta(a_t \mid s_t) \right]`}</Math>
              <p className="text-xs text-muted-foreground mt-3">
                При <Math display={false}>{`\\gamma = 0.99`}</Math> и <Math display={false}>{`t = 1000`}</Math>:{" "}
                <Math display={false}>{`0.99^{1000} \\approx 4.3 \\times 10^{-5}`}</Math> — градиент практически исчезает.
              </p>
            </CardContent>
          </Card>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Псевдокод накопления дисконтированных наград:
          </p>
          <CyberCodeBlock language="python" filename="discounted_return.py">
{`gamma = 0.99
total_reward = 0.0
for t in range(max_steps):
    action = agent.act(state)
    state, reward, done, info = env.step(action)
    total_reward += (gamma ** t) * reward
    if done:
        break`}
          </CyberCodeBlock>

          <div className="mt-6">
            <StepsProbabilitySlider />
          </div>
        </section>

        {/* ───────── 3. Potential-Based Shaping ───────── */}
        <section id="mod3" className="scroll-mt-28 mt-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/15 text-accent font-bold border border-accent/30">3</span>
            <h2 className="text-2xl font-bold text-foreground">Potential-Based Shaping & Policy Invariance</h2>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-4">
            Эндрю Ын в 1999 году доказал теорему: если добавочная награда имеет форму разности потенциалов,
            то <strong className="text-foreground">оптимальная политика не меняется</strong>. Это единственная
            математически безопасная форма reward shaping.
          </p>

          <Card className="bg-card/60 backdrop-blur-sm border-accent/30 mb-6">
            <CardContent className="p-5 space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" /> Теорема Ng (1999)
              </h4>
              <Math>{String.raw`R'(s, a, s') \;=\; R(s, a, s') \;+\; F(s, s'), \qquad F(s, s') = \gamma \, \Phi(s') - \Phi(s)`}</Math>
              <p className="text-sm text-muted-foreground">
                Где <Math display={false}>{`\\Phi : \\mathcal{S} \\to \\mathbb{R}`}</Math> — потенциальная функция (эвристическая
                «хорошесть» состояния). Тогда <Math display={false}>{`\\pi^{*}_{R'} = \\pi^{*}_{R}`}</Math>.
              </p>
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Условие:</strong> <Math display={false}>{`\\Phi(s_{\\text{terminal}}) = 0`}</Math> — иначе
                суммарное дисконтированное вознаграждение эпизода сместится.
              </p>
            </CardContent>
          </Card>

          <p className="text-muted-foreground leading-relaxed mb-4">
            <strong className="text-foreground">Интуиция:</strong> разность потенциалов работает как физическое поле
            (например, гравитация). Шаг вперёд → награда; шаг назад → ровно такой же штраф. Сумма по любому замкнутому
            циклу равна нулю — фарм невозможен.
          </p>

          <Math>{String.raw`\sum_{t=0}^{T-1} \gamma^{t} F(s_t, s_{t+1}) \;=\; \gamma^{T} \Phi(s_T) - \Phi(s_0)`}</Math>

          <div className="mt-6 mb-6">
            <RewardHackingChart />
          </div>

          <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
            <CardContent className="p-5 space-y-3">
              <h4 className="font-semibold text-foreground">Пример: <Math display={false}>{`\\Phi(s) = -\\| s - s_{\\text{goal}} \\|`}</Math></h4>
              <CyberCodeBlock language="python" filename="potential_shaping.py">
{`# Phi(s) = -расстояние до цели
phi_current = -np.linalg.norm(agent.position - target.position)
phi_next    = -np.linalg.norm(next_position  - target.position)

shaped_reward = original_reward + gamma * phi_next - phi_current`}
              </CyberCodeBlock>
            </CardContent>
          </Card>
        </section>

        {/* ───────── 4. Practical techniques ───────── */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Практические приёмы reward shaping</h2>
          <div className="space-y-3">
            {[
              { title: "Distance-based", desc: "Награда обратно пропорциональна расстоянию до цели. Просто и эффективно для навигации.", icon: Target },
              { title: "Curriculum-based", desc: <span>Начинаем с простых задач, постепенно усложняем (<CrossLinkToHub hubPath="/deep-rl" hubAnchor="practice" hubTitle="Deep RL — практика">curriculum learning</CrossLinkToHub>). Агент не теряет мотивацию.</span>, icon: Lightbulb },
              { title: "Curiosity-driven (ICM, RND)", desc: "Внутренняя награда за посещение новых состояний — решает проблему sparse rewards в больших мирах.", icon: Brain },
              { title: "Potential-Based", desc: "Безопасная форма shaping: математически гарантированно сохраняет оптимальную политику.", icon: Shield },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start p-4 rounded-lg bg-card/60 backdrop-blur-sm border border-primary/20">
                <item.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ───────── 5. Reward Hacking traps ───────── */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Типичные ловушки</h2>
          <div className="space-y-3">
            {[
              { trap: "Reward Hacking", example: "Агент, получающий reward за движение вперёд, научился двигаться по кругу — формально «вперёд», но без прогресса." },
              { trap: "Deceptive Alignment", example: "Агент выучил обманывать систему оценки, а не решать реальную задачу." },
              { trap: "Reward Clipping", example: "Обрезка больших наград может убрать важный сигнал. Используйте нормализацию вместо clipping." },
              { trap: "Policy Alteration", example: "Наивный shaping (без разности потенциалов) меняет оптимум исходной задачи." },
            ].map((item, i) => (
              <Card key={i} className="bg-card/60 backdrop-blur-sm border-destructive/30">
                <CardContent className="p-4 flex gap-3 items-start">
                  <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-foreground">{item.trap}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.example}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ───────── 6. Unity Practice ───────── */}
        <section id="mod4" className="scroll-mt-28 mt-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/15 text-primary font-bold border border-primary/30">4</span>
            <h2 className="text-2xl font-bold text-foreground">Практика: <CrossLinkToHub hubPath="/unity-ml-agents" hubAnchor="training" hubTitle="Unity ML-Agents">Реализация в Unity C#</CrossLinkToHub></h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Применяем Potential-Based Shaping для задачи навигации робота. Используем <code className="text-primary">AddReward()</code> для накопления и <code className="text-primary">SetReward()</code> для финального исхода.
          </p>

          <CyberCodeBlock language="csharp" filename="RobotAgent.cs">
{`using Unity.MLAgents;
using Unity.MLAgents.Actuators;
using UnityEngine;

public class RobotAgent : Agent
{
    public Transform target;
    private float previousDistance;

    public override void OnEpisodeBegin()
    {
        // Сброс позиций
        previousDistance = Vector3.Distance(
            transform.localPosition, target.localPosition);
    }

    public override void OnActionReceived(ActionBuffers actions)
    {
        // Логика движения...
        float currentDistance = Vector3.Distance(
            transform.localPosition, target.localPosition);

        // 1. Potential-Based Shaping: F = Phi(s') - Phi(s)
        // Phi(s) = -Distance => (-current) - (-previous) = previous - current
        float shapingReward = previousDistance - currentDistance;
        AddReward(shapingReward);

        previousDistance = currentDistance;

        // 2. Sparse Reward: главная цель
        if (currentDistance < 1.0f)
        {
            SetReward(1.0f);
            EndEpisode();
        }
        else if (transform.localPosition.y < 0)
        {
            // Упал с платформы
            SetReward(-1.0f);
            EndEpisode();
        }
    }
}`}
          </CyberCodeBlock>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <Card className="bg-card/60 backdrop-blur-sm border-secondary/30">
              <CardContent className="p-5 space-y-2">
                <h4 className="font-semibold text-foreground">Манипулятор (захват объекта)</h4>
                <CyberCodeBlock language="csharp" filename="ManipulatorAgent.cs">
{`public override void OnActionReceived(
    ActionBuffers actionBuffers)
{
    float distance = Vector3.Distance(
        manipulator.Gripper.position,
        target.position);

    // Плотная награда: штраф за расстояние
    AddReward(-0.1f * distance);

    // Sparse: бонус за захват
    if (distance < 0.1f)
    {
        AddReward(1.0f);
        EndEpisode();
    }
}`}
                </CyberCodeBlock>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm border-accent/30">
              <CardContent className="p-5 space-y-2">
                <h4 className="font-semibold text-foreground">Навигация (PushBlock-style)</h4>
                <CyberCodeBlock language="csharp" filename="NavigatorAgent.cs">
{`public override void OnActionReceived(
    ActionBuffers actionBuffers)
{
    // Шаговой штраф — мотивация к скорости
    AddReward(-0.001f);

    // Sparse: достижение цели
    if (ReachedGoal())
    {
        AddReward(1.0f);
        EndEpisode();
    }
}`}
                </CyberCodeBlock>
              </CardContent>
            </Card>
          </div>
        </section>

        <Card className="border-accent/30 bg-card/60 backdrop-blur-sm mt-10">
          <CardContent className="p-5 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground mb-1">Практика: FoodCollector с REINFORCE</p>
              <p className="text-sm text-muted-foreground mb-3">
                Полный пайплайн обучения агента: кастомный REINFORCE на PyTorch, GridSensor, ONNX.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/unity-projects/food-collector">Открыть проект →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Quiz title="Проверь себя: Reward Shaping" questions={quizQuestions} lessonPath="/courses/2-4" nextLesson={{ path: "/courses/2-5", title: "Параллельные среды" }} />
      </ProGate>
    </LessonLayout>
  );
};

export default CourseLesson2_4;
