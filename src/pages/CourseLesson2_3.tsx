import LessonLayout from "@/components/LessonLayout";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import ProGate from "@/components/ProGate";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import Quiz from "@/components/Quiz";
import Math from "@/components/Math";
import PpoVsSacChart from "@/components/math-rl/PpoVsSacChart";
import { Card, CardContent } from "@/components/ui/card";
import {
  Lightbulb,
  Gamepad2,
  Settings,
  AlertTriangle,
  Brain,
  Scale,
  Activity,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

const quizQuestions = [
  {
    question: "Чем отличаются дискретные действия от непрерывных?",
    options: [
      "Дискретные используют GPU, непрерывные — CPU",
      "Дискретные — конечное множество (0,1,2), непрерывные — вещественные числа из диапазона",
      "Никакой разницы — это одно и то же",
      "Непрерывные работают только в Unity",
    ],
    correctIndex: 1,
  },
  {
    question: "Почему DQN плохо подходит для непрерывных действий?",
    options: [
      "DQN работает только в дискретных играх Atari",
      "argmax по бесконечному множеству действий вычислительно неприемлем в реальном времени",
      "DQN не использует нейросети",
      "Q-функция несовместима с физикой",
    ],
    correctIndex: 1,
  },
  {
    question: "Зачем в Actor-Critic вычитают V(s) из Q(s,a) для получения преимущества A(s,a)?",
    options: [
      "Чтобы ускорить вычисление градиента в 2 раза",
      "Чтобы убрать «общий уровень» состояния и резко снизить дисперсию градиента политики",
      "Это требование PyTorch",
      "Чтобы сделать награду положительной",
    ],
    correctIndex: 1,
  },
  {
    question: "Что делает clipped surrogate objective в PPO?",
    options: [
      "Обрезает награду в диапазоне [-1, 1]",
      "Ограничивает отношение π_θ/π_old в коридоре [1−ε, 1+ε], не позволяя политике резко меняться за один шаг",
      "Удаляет шум из наблюдений",
      "Заменяет MSE на L1-loss",
    ],
    correctIndex: 1,
  },
  {
    question: "Почему SAC называют «soft»?",
    options: [
      "Использует менее агрессивный оптимизатор",
      "Целевая функция включает энтропийный бонус α·H(π), который поощряет разнообразные, а не только лучшие действия",
      "Работает только с мягкими телами в физике",
      "Использует float16 вместо float32",
    ],
    correctIndex: 1,
  },
  {
    question: "Какой компонент Unity отвечает за частоту принятия решений агентом?",
    options: ["BehaviorParameters", "DecisionRequester", "Agent.OnActionReceived", "RigidBody"],
    correctIndex: 1,
  },
];

const CourseLesson2_3 = () => {
  const preview = (
    <>
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Зачем нужен Actor-Critic?
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          До сих пор мы работали с <strong className="text-foreground">дискретными действиями</strong>:
          агент выбирал из конечного набора (влево/вправо в CartPole). Но в реальных задачах —
          управление роботом, автопилот, физические симуляции — действия{" "}
          <strong className="text-primary">
            <CrossLinkToHub
              hubPath="/unity-ml-agents"
              hubAnchor="neural-networks"
              hubTitle="Unity ML-Agents — Нейросети"
            >
              непрерывные
            </CrossLinkToHub>
          </strong>
          : угол поворота, сила нажатия, скорость.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          В этом уроке мы пройдём путь: <em>зачем</em> нужен Actor-Critic → <em>как</em> устроены
          формулы → <em>чем</em> различаются PPO и SAC → <em>как</em> это выглядит на кривых обучения
          → <em>как</em> написать рабочий C#-агент в Unity.
        </p>
      </section>
    </>
  );

  return (
    <LessonLayout
      lessonId="2-3"
      lessonTitle="Непрерывные действия и Actor-Critic в Unity"
      lessonNumber="2.3"
      duration="55 мин"
      tags={["#code", "#unity", "#mlagents", "#actor-critic", "#ppo", "#sac"]}
      level={2}
      prevLesson={{ path: "/courses/2-2", title: "PPO с нуля" }}
      nextLesson={{ path: "/courses/2-4", title: "Unity ML-Agents" }}
    >
      <ProGate preview={preview}>
        {preview}

        {/* ===================== СЕКЦИЯ 1: ПОСТАНОВКА ЗАДАЧИ ===================== */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            1. Постановка задачи: два типа пространств действий
          </h2>
          <p className="text-muted-foreground mb-4">
            В обучении с подкреплением агент в каждый момент выбирает действие <em>a</em> из пространства{" "}
            <Math display={false}>{`\\mathcal{A}`}</Math>. Оно бывает двух принципиально разных типов.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-primary" />
                  Дискретное пространство
                </h3>
                <Math>{`\\mathcal{A} = \\{a_1, a_2, \\ldots, a_n\\}`}</Math>
                <p className="text-xs text-muted-foreground">
                  «идти влево», «прыгнуть», «выстрелить». Подходит для пошаговых игр и простых NPC.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm border-secondary/30">
              <CardContent className="p-5 space-y-2">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Settings className="w-4 h-4 text-secondary" />
                  Непрерывное пространство
                </h3>
                <Math>{`\\mathcal{A} \\subseteq \\mathbb{R}^d`}</Math>
                <p className="text-xs text-muted-foreground">
                  «повернуть руль на 15.3°», «приложить момент 4.7 Н·м». Нужно для физических моделей.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card/60 backdrop-blur-sm border-accent/30 mb-6">
            <CardContent className="p-4 flex gap-3 items-start">
              <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Ключевая идея:</strong> при{" "}
                <Math display={false}>{`d`}</Math> суставах робота и условном «разрешении» 100 значений
                на каждый сустав, дискретизация даёт{" "}
                <Math display={false}>{`100^d`}</Math> вариантов. Для 4 суставов это уже{" "}
                <Math display={false}>{`10^8`}</Math> комбинаций — обучить прямым перебором невозможно.
              </p>
            </CardContent>
          </Card>

          <h3 className="text-xl font-bold text-foreground mb-2">
            Почему value-based методы (DQN) пасуют
          </h3>
          <p className="text-muted-foreground mb-3">
            Q-learning и его глубокий вариант{" "}
            <CrossLinkToHub hubPath="/algorithms/dqn" hubAnchor="overview" hubTitle="DQN">
              DQN
            </CrossLinkToHub>{" "}
            учат функцию ценности <Math display={false}>{`Q(s, a)`}</Math> и выбирают действие так:
          </p>
          <Math>{`a^{*} = \\arg\\max_{a \\in \\mathcal{A}} Q(s, a)`}</Math>
          <p className="text-muted-foreground mb-4">
            В дискретном случае это просто <code className="px-1 rounded bg-muted text-xs">argmax</code>{" "}
            по конечному набору. Если же <Math display={false}>{`\\mathcal{A}`}</Math> непрерывно — взять
            максимум по бесконечному множеству для каждого кадра физики вычислительно неприемлемо.
          </p>

          <h3 className="text-xl font-bold text-foreground mb-2">
            Почему чистый policy gradient нестабилен
          </h3>
          <p className="text-muted-foreground mb-3">
            Альтернатива — учить политику <Math display={false}>{`\\pi_{\\theta}(a \\mid s)`}</Math>{" "}
            напрямую. Классический REINFORCE использует:
          </p>
          <Math>{`\\nabla_{\\theta} J(\\theta) = \\mathbb{E}_{\\tau \\sim \\pi_{\\theta}}\\!\\left[\\sum_{t=0}^{T} \\nabla_{\\theta} \\log \\pi_{\\theta}(a_t \\mid s_t) \\cdot G_t \\right]`}</Math>
          <p className="text-muted-foreground mb-3">
            Здесь{" "}
            <Math display={false}>{`G_t = \\sum_{k=t}^{T} \\gamma^{k-t} r_k`}</Math> — суммарная будущая
            награда. Проблема: <strong className="text-foreground">огромная дисперсия</strong>. Одна
            неудачная сессия с большим штрафом ломает обучение, потому что сигнал «было плохо»
            применяется ко всем действиям эпизода без разбора.
          </p>

          <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
            <CardContent className="p-4 flex gap-3 items-start">
              <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Нужен механизм, который скажет не «весь эпизод был хорош», а «<em>именно это действие</em>{" "}
                в <em>именно этом состоянии</em> оказалось лучше среднего». Именно это и делает{" "}
                <strong className="text-foreground">Critic</strong>.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ===================== СЕКЦИЯ 2: АРХИТЕКТУРА ===================== */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            2. Архитектура{" "}
            <CrossLinkToHub
              hubPath="/algorithms/ppo"
              hubAnchor="architecture"
              hubTitle="PPO — Архитектура Actor-Critic"
            >
              Actor-Critic
            </CrossLinkToHub>
          </h2>
          <p className="text-muted-foreground mb-4">
            Две нейронные сети с раздельными ролями: Actor предлагает действия (как в policy gradient),
            Critic оценивает их качество (как в value-based), стабилизируя обучение.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-card/60 backdrop-blur-sm border-primary/30 hover:shadow-glow-cyan transition-shadow">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Среда (Unity)</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Поставляет состояния <Math display={false}>{`s_t`}</Math> и награду{" "}
                  <Math display={false}>{`r_t`}</Math> через физический движок и твой код в{" "}
                  <code className="px-1 rounded bg-muted">CollectObservations</code>.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm border-secondary/30 hover:shadow-glow-purple transition-shadow">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-secondary" />
                  <h3 className="font-bold text-foreground">
                    Actor: <Math display={false}>{`\\pi_{\\theta}(a \\mid s)`}</Math>
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Выдаёт параметры распределения <Math display={false}>{`\\mu_{\\theta}(s)`}</Math> и{" "}
                  <Math display={false}>{`\\sigma_{\\theta}(s)`}</Math>. Из него сэмплируется действие.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/60 backdrop-blur-sm border-accent/30 hover:shadow-glow-pink transition-shadow">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-accent" />
                  <h3 className="font-bold text-foreground">
                    Critic: <Math display={false}>{`V_{\\phi}(s)`}</Math>
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Оценивает ожидаемую будущую награду. Даёт оценку преимущества{" "}
                  <Math display={false}>{`\\hat{A}_t`}</Math>, которая направляет обучение Actor.
                </p>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">Три ключевые функции ценности</h3>

          <p className="text-sm text-foreground font-semibold mt-4 mb-1">
            Функция ценности состояния <Math display={false}>{`V^{\\pi}(s)`}</Math>:
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            Ожидаемая суммарная награда, если стартовать из <Math display={false}>{`s`}</Math> и далее
            действовать по политике <Math display={false}>{`\\pi`}</Math>.
          </p>
          <Math>{`V^{\\pi}(s) = \\mathbb{E}_{\\pi}\\!\\left[\\sum_{k=0}^{\\infty} \\gamma^k r_{t+k} \\,\\middle|\\, s_t = s \\right]`}</Math>

          <p className="text-sm text-foreground font-semibold mt-4 mb-1">
            Функция «состояние-действие» <Math display={false}>{`Q^{\\pi}(s, a)`}</Math>:
          </p>
          <p className="text-sm text-muted-foreground mb-2">
            То же, но при условии, что <em>первое</em> действие — это{" "}
            <Math display={false}>{`a`}</Math>.
          </p>
          <Math>{`Q^{\\pi}(s, a) = \\mathbb{E}_{\\pi}\\!\\left[\\sum_{k=0}^{\\infty} \\gamma^k r_{t+k} \\,\\middle|\\, s_t = s, a_t = a \\right]`}</Math>

          <p className="text-sm text-foreground font-semibold mt-4 mb-1">
            Функция преимущества <Math display={false}>{`A^{\\pi}(s, a)`}</Math>:
          </p>
          <Math>{`A^{\\pi}(s, a) = Q^{\\pi}(s, a) - V^{\\pi}(s)`}</Math>

          <Card className="bg-card/60 backdrop-blur-sm border-secondary/30 mt-4 mb-6">
            <CardContent className="p-4 flex gap-3 items-start">
              <Lightbulb className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Зачем нужна A?</strong> Это сигнал, которого не
                хватало REINFORCE. Если <Math display={false}>{`A^{\\pi}(s,a) > 0`}</Math> — действие
                лучше среднего, увеличиваем его вероятность. Если &lt; 0 — уменьшаем. Вычитание{" "}
                <Math display={false}>{`V^{\\pi}(s)`}</Math> убирает «общий уровень» состояния и резко
                снижает дисперсию градиента.
              </p>
            </CardContent>
          </Card>

          <h3 className="text-xl font-bold text-foreground mb-2">
            Как Critic учится: уравнение Беллмана
          </h3>
          <Math>{`V^{\\pi}(s_t) = \\mathbb{E}_{\\pi}\\bigl[r_t + \\gamma \\, V^{\\pi}(s_{t+1})\\bigr]`}</Math>
          <p className="text-muted-foreground mb-3">
            Цель обучения Critic — минимизировать <strong className="text-foreground">TD-ошибку</strong>:
          </p>
          <Math>{`\\delta_t = r_t + \\gamma \\, V_{\\phi}(s_{t+1}) - V_{\\phi}(s_t)`}</Math>
          <Math>{`\\mathcal{L}_{\\text{Critic}}(\\phi) = \\mathbb{E}\\bigl[\\delta_t^{2}\\bigr]`}</Math>

          <h3 className="text-xl font-bold text-foreground mt-6 mb-2">
            Как Actor учится: градиент политики с преимуществом
          </h3>
          <Math>{`\\nabla_{\\theta} J(\\theta) = \\mathbb{E}_t\\!\\bigl[\\nabla_{\\theta} \\log \\pi_{\\theta}(a_t \\mid s_t) \\cdot \\hat{A}_t \\bigr]`}</Math>
          <p className="text-muted-foreground mb-3">
            Внешне почти как REINFORCE, но вместо «сырой»{" "}
            <Math display={false}>{`G_t`}</Math> стоит «очищенная» оценка{" "}
            <Math display={false}>{`\\hat{A}_t`}</Math>.
          </p>

          <p className="text-sm text-foreground font-semibold mt-4 mb-1">
            Параметризация Actor для непрерывных действий:
          </p>
          <Math>{`\\pi_{\\theta}(a \\mid s) = \\mathcal{N}\\!\\bigl(a \\,;\\, \\mu_{\\theta}(s),\\, \\sigma_{\\theta}(s)^{2} \\bigr)`}</Math>
          <p className="text-sm text-muted-foreground italic">
            Действие сэмплируется из распределения. <Math display={false}>{`\\sigma`}</Math>{" "}
            контролирует исследование: большое — пробует разное, маленькое — действует уверенно.
          </p>
        </section>

        {/* ===================== СЕКЦИЯ 2.5: PyTorch Actor-Critic ===================== */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Actor-Critic для непрерывных действий — код
          </h2>
          <CyberCodeBlock language="python" filename="actor_critic_continuous.py">
{`import torch
import torch.nn as nn
from torch.distributions import Normal

class ContinuousActorCritic(nn.Module):
    def __init__(self, obs_dim, action_dim, hidden=256):
        super().__init__()
        # Shared backbone
        self.backbone = nn.Sequential(
            nn.Linear(obs_dim, hidden), nn.Tanh(),
            nn.Linear(hidden, hidden), nn.Tanh(),
        )
        # Actor head: mean for each action dimension
        self.actor_mean = nn.Linear(hidden, action_dim)
        self.actor_log_std = nn.Parameter(torch.zeros(action_dim))

        # Critic head: state value V(s)
        self.critic = nn.Linear(hidden, 1)

    def forward(self, state):
        h = self.backbone(state)
        mean = self.actor_mean(h)
        std = self.actor_log_std.exp()
        value = self.critic(h)
        return mean, std, value

    def act(self, state):
        mean, std, value = self.forward(torch.FloatTensor(state))
        dist = Normal(mean, std)
        action = dist.sample()
        action_clamped = action.clamp(-1.0, 1.0)
        log_prob = dist.log_prob(action).sum(-1)
        return action_clamped.numpy(), log_prob, value.squeeze()`}
          </CyberCodeBlock>
        </section>

        {/* ===================== СЕКЦИЯ 3: PPO vs SAC ===================== */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">3. PPO против SAC</h2>

          {/* PPO */}
          <Card className="bg-card/60 backdrop-blur-sm border-primary/30 mb-4 hover:shadow-glow-cyan transition-shadow">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary">
                  PPO — Proximal Policy Optimization
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-mono text-primary">
                  on-policy
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                PPO исходит из идеи: <em>политика не должна меняться слишком резко за один шаг</em>.
                Вводится отношение вероятностей новой и старой политик:
              </p>
              <Math>{`r_t(\\theta) = \\frac{\\pi_{\\theta}(a_t \\mid s_t)}{\\pi_{\\theta_{\\text{old}}}(a_t \\mid s_t)}`}</Math>
              <p className="text-sm text-muted-foreground">
                Целевая функция — <strong className="text-foreground">clipped surrogate objective</strong>:
              </p>
              <Math>{`L^{\\text{CLIP}}(\\theta) = \\mathbb{E}_t\\!\\left[\\min\\!\\bigl(r_t(\\theta)\\, \\hat{A}_t,\\;\\; \\text{clip}(r_t(\\theta),\\, 1-\\varepsilon,\\, 1+\\varepsilon)\\,\\hat{A}_t \\bigr)\\right]`}</Math>
              <p className="text-sm text-muted-foreground">
                Операция <code className="px-1 rounded bg-muted">clip</code> обрезает{" "}
                <Math display={false}>{`r_t(\\theta)`}</Math> в коридоре{" "}
                <Math display={false}>{`[1-\\varepsilon, 1+\\varepsilon]`}</Math> (обычно{" "}
                <Math display={false}>{`\\varepsilon = 0.2`}</Math>).
              </p>
              <ul className="text-sm space-y-1.5 mt-3">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Стабильность:</strong> клиппинг гарантирует
                    постепенные обновления.
                  </span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Простота:</strong> мало гиперпараметров,
                    разумные дефолты.
                  </span>
                </li>
                <li className="flex gap-2">
                  <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Sample efficiency:</strong> опыт используется
                    один раз и выбрасывается.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* SAC */}
          <Card className="bg-card/60 backdrop-blur-sm border-secondary/30 mb-4 hover:shadow-glow-purple transition-shadow">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-secondary">SAC — Soft Actor-Critic</h3>
                <span className="px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/30 text-xs font-mono text-secondary">
                  off-policy
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Вместо ограничения <em>величины</em> шага SAC добавляет в целевую функцию слагаемое{" "}
                <strong className="text-foreground">энтропии</strong> политики:
              </p>
              <Math>{`J(\\pi) = \\sum_t \\mathbb{E}_{(s_t, a_t) \\sim \\pi}\\!\\left[r(s_t, a_t) + \\alpha \\cdot \\mathcal{H}\\bigl(\\pi(\\cdot \\mid s_t)\\bigr) \\right]`}</Math>
              <p className="text-sm text-muted-foreground">где энтропия:</p>
              <Math>{`\\mathcal{H}\\bigl(\\pi(\\cdot \\mid s)\\bigr) = -\\mathbb{E}_{a \\sim \\pi}\\bigl[\\log \\pi(a \\mid s)\\bigr]`}</Math>
              <p className="text-sm text-muted-foreground">
                Коэффициент <Math display={false}>{`\\alpha`}</Math> (в Unity это{" "}
                <code className="px-1 rounded bg-muted">init_entcoef</code>) задаёт компромисс
                «эксплуатация ↔ исследование». При большом{" "}
                <Math display={false}>{`\\alpha`}</Math> агент получает бонус за{" "}
                <em>непредсказуемость</em> своих действий.
              </p>
              <ul className="text-sm space-y-1.5 mt-3">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Sample efficiency:</strong> off-policy с буфером
                    воспроизведения — опыт переиспользуется многократно.
                  </span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Глубокое исследование:</strong> энтропийный
                    бонус не даёт политике рано «застыть».
                  </span>
                </li>
                <li className="flex gap-2">
                  <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Сложность:</strong> двойной Q, целевые сети,
                    больше гиперпараметров.
                  </span>
                </li>
                <li className="flex gap-2">
                  <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Память:</strong> Replay Buffer на десятки тысяч
                    переходов в RAM.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Сравнительная таблица */}
          <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-foreground mb-3">Сравнительная таблица</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-primary/20">
                      <th className="px-3 py-2 text-left font-semibold text-foreground">Критерий</th>
                      <th className="px-3 py-2 text-left font-semibold text-primary">PPO</th>
                      <th className="px-3 py-2 text-left font-semibold text-secondary">SAC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 text-muted-foreground">
                    <tr><td className="px-3 py-2 font-medium text-foreground">Тип</td><td className="px-3 py-2">on-policy</td><td className="px-3 py-2">off-policy</td></tr>
                    <tr><td className="px-3 py-2 font-medium text-foreground">Стабилизация</td><td className="px-3 py-2">клиппинг отношения</td><td className="px-3 py-2">регуляризация энтропией</td></tr>
                    <tr><td className="px-3 py-2 font-medium text-foreground">Буфер опыта</td><td className="px-3 py-2">нет (rollout)</td><td className="px-3 py-2">да (Replay Buffer)</td></tr>
                    <tr><td className="px-3 py-2 font-medium text-foreground">Sample efficiency</td><td className="px-3 py-2">низкая</td><td className="px-3 py-2">высокая</td></tr>
                    <tr><td className="px-3 py-2 font-medium text-foreground">Время на шаг</td><td className="px-3 py-2">меньше</td><td className="px-3 py-2">больше</td></tr>
                    <tr><td className="px-3 py-2 font-medium text-foreground">Лучше для</td><td className="px-3 py-2">быстрая итерация, простые задачи</td><td className="px-3 py-2">сложные многомерные задачи</td></tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ===================== СЕКЦИЯ 4: КРИВЫЕ ОБУЧЕНИЯ ===================== */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            4. Эмпирическое сравнение: кривые обучения
          </h2>
          <p className="text-muted-foreground mb-4">
            Симуляция 3D-робота с 4-мерным вектором непрерывных действий. Ось X — шаги взаимодействия со
            средой, ось Y — средняя совокупная награда за эпизод.
          </p>

          <Card className="bg-card/60 backdrop-blur-sm border-primary/30 mb-4">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-foreground">Интерактивный график</h3>
              </div>
              <PpoVsSacChart />
            </CardContent>
          </Card>

          <h3 className="text-xl font-bold text-foreground mb-2">
            Как формулы объясняют форму кривых
          </h3>

          <Card className="bg-card/60 backdrop-blur-sm border-primary/30 mb-3">
            <CardContent className="p-5 space-y-2">
              <p className="font-semibold text-primary text-sm">
                Почему PPO быстро стартует и затем выходит на плато?
              </p>
              <p className="text-sm text-muted-foreground">
                Клиппинг <Math display={false}>{`\\text{clip}(r_t(\\theta), 1-\\varepsilon, 1+\\varepsilon)`}</Math>{" "}
                работает в обе стороны: защищает от катастрофических обновлений и{" "}
                <em>ограничивает</em> скорость роста. Когда политика уже неплоха, дальнейший прогресс
                требует более «смелых» шагов, чем коридор{" "}
                <Math display={false}>{`[0.8, 1.2]`}</Math> позволяет.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-secondary/30 mb-3">
            <CardContent className="p-5 space-y-2">
              <p className="font-semibold text-secondary text-sm">
                Почему SAC медленно стартует и потом превосходит PPO?
              </p>
              <p className="text-sm text-muted-foreground">
                Слагаемое <Math display={false}>{`\\alpha \\cdot \\mathcal{H}(\\pi(\\cdot \\mid s))`}</Math>{" "}
                намеренно <em>штрафует</em> уверенные действия в начале. Награда от среды ещё низкая,
                энтропийный бонус большой — агент почти случайно блуждает, накапливая разнообразный опыт
                в Replay Buffer. Затем сеть использует широкий накопленный опыт и превосходит жадную
                стратегию PPO.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-accent/30">
            <CardContent className="p-4 flex gap-3 items-start">
              <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Практический вывод для Unity:</strong> короткий
                бюджет шагов (несколько сотен тысяч) или простая структура наград — бери PPO. Если
                можешь позволить миллион+ шагов и задача имеет тонкие локальные оптимумы (точная
                манипуляция, ходьба) — SAC оправдает дополнительные затраты памяти.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ===================== СЕКЦИЯ 5: РЕАЛИЗАЦИЯ В UNITY ===================== */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            5. Практика: код агента и конфигурации
          </h2>
          <p className="text-muted-foreground mb-4">
            C#-скрипт отвечает за то, что агент <em>делает</em> в сцене. YAML — за то, как он{" "}
            <em>учится</em>.
          </p>

          <h3 className="text-xl font-bold text-foreground mb-2">Настройка Unity-сцены</h3>
          <div className="space-y-3 mb-6">
            {[
              {
                step: "Agent",
                desc: "Пустой GameObject + компонент Agent (наследник от Unity.MLAgents.Agent).",
              },
              {
                step: "BehaviorParameters",
                desc: "Continuous Actions = количество степеней свободы (например, 2: steering, throttle).",
              },
              {
                step: "DecisionRequester",
                desc: "Автоматически запрашивает решения. Decision Period = 5 (каждые 5 FixedUpdate).",
              },
              {
                step: "Observations",
                desc: "Vector Observation Size совпадает с числом значений в CollectObservations.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-3 items-start p-3 rounded-lg bg-card/40 border border-border/30"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-mono font-bold text-secondary text-xs">{i + 1}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{item.step}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">C#-агент: минимальный пример</h3>
          <CyberCodeBlock language="csharp" filename="RobotAgent.cs">
{`using Unity.MLAgents;
using Unity.MLAgents.Actuators;
using UnityEngine;

// Наследуемся от Agent — базового класса ML-Agents Toolkit.
// Он автоматически связывает скрипт с обученной нейросетью через Behavior Parameters.
public class RobotAgent : Agent
{
    public Transform target;
    public float maxTorque = 100f;

    // === 1. Сбор наблюдений: вектор состояния s_t для Actor ===
    public override void CollectObservations(VectorSensor sensor)
    {
        // Относительная позиция цели (3 числа). Critic использует те же наблюдения для V(s).
        sensor.AddObservation(target.localPosition - transform.localPosition);

        // Скорость самого агента (3 числа) — без неё политика не сможет планировать.
        sensor.AddObservation(GetComponent<Rigidbody>().linearVelocity);
    }

    // === 2. Применение действий: то, что выдаёт Actor π_θ(a|s) ===
    public override void OnActionReceived(ActionBuffers actionBuffers)
    {
        // Непрерывные действия — float'ы в диапазоне [-1, 1].
        // Это сэмплы из нормального распределения π_θ(a|s) = N(μ(s), σ(s)²).
        var continuousActions = actionBuffers.ContinuousActions;

        float joint1Rotation = continuousActions[0];
        float joint2Rotation = continuousActions[1];

        // ВАЖНО: масштабируем [-1, 1] в физически осмысленный момент.
        // Сеть оперирует нормализованными значениями — это требование ML-Agents.
        ApplyTorque(joint1Rotation * maxTorque, joint2Rotation * maxTorque);

        // === 3. Награда r_t — сигнал для Critic и формулы преимущества A(s,a) ===
        float distance = Vector3.Distance(transform.localPosition, target.localPosition);
        AddReward(-distance * 0.001f);  // штраф за расстояние

        if (IsTargetReached())
        {
            SetReward(1.0f);
            EndEpisode();  // сброс среды → новый эпизод обучения
        }
    }

    // === 4. Ручное управление для отладки (Heuristic mode) ===
    public override void Heuristic(in ActionBuffers actionsOut)
    {
        var ca = actionsOut.ContinuousActions;
        ca[0] = Input.GetAxis("Horizontal");
        ca[1] = Input.GetAxis("Vertical");
    }
}`}
          </CyberCodeBlock>

          <h3 className="text-xl font-bold text-foreground mt-6 mb-2">
            <CrossLinkToHub
              hubPath="/unity-ml-agents"
              hubAnchor="training"
              hubTitle="Unity ML-Agents — Обучение"
            >
              YAML-конфигурация
            </CrossLinkToHub>{" "}
            тренера (SAC)
          </h3>
          <CyberCodeBlock language="python" filename="robot_config.yaml">
{`behaviors:
  RobotBehavior:
    # Выбор алгоритма. Альтернатива: ppo. См. раздел 3 для сравнения.
    trainer_type: sac

    hyperparameters:
      # Шаг градиентного спуска Adam. Малый — для стабильности.
      learning_rate: 0.0003
      learning_rate_schedule: constant   # не уменьшать LR со временем

      # Размер мини-батча для одного шага градиента.
      batch_size: 128

      # Replay Buffer — сколько переходов (s,a,r,s') хранится в памяти.
      # Только для off-policy (SAC). Большой буфер = богаче выборка.
      buffer_size: 50000
      buffer_init_steps: 0

      # Мягкое обновление target-сети Critic:
      # φ_target ← τ·φ + (1-τ)·φ_target. Малое τ = плавное обновление.
      tau: 0.005

      # Шагов среды на один шаг градиента.
      steps_per_update: 10.0
      save_replay_buffer: false

      # Начальный коэффициент α в J(π) = E[r + α·H(π)] (см. SAC).
      # Большое значение = сильное исследование на старте.
      init_entcoef: 0.5
      reward_signal_steps_per_update: 10.0

    network_settings:
      # Стандартизация наблюдений. Критично для физических задач.
      normalize: true
      hidden_units: 256
      num_layers: 3

    reward_signals:
      extrinsic:
        # Дисконт γ из V^π(s) = E[Σ γ^k · r_{t+k}].
        # 0.99 = агент смотрит ~100 шагов вперёд.
        gamma: 0.99
        strength: 1.0

    # Полный бюджет шагов взаимодействия со средой.
    max_steps: 1000000`}
          </CyberCodeBlock>

          <Card className="bg-card/60 backdrop-blur-sm border-accent/30 mt-4">
            <CardContent className="p-4 flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Важно:</strong> при использовании{" "}
                <code className="px-1 rounded bg-muted">continuousActions</code> значения
                нормализуются ML-Agents в диапазон <Math display={false}>{`[-1, 1]`}</Math>. Actor
                выдаёт сэмпл из <Math display={false}>{`\\mathcal{N}(\\mu, \\sigma^{2})`}</Math>, затем
                применяется <Math display={false}>{`\\tanh`}</Math>. Поэтому{" "}
                <em>обязательно</em> масштабируй значения в C# под физику (умножение на{" "}
                <code className="px-1 rounded bg-muted">maxTorque</code>), иначе агент не сможет
                приложить нужное усилие.
              </p>
            </CardContent>
          </Card>

          <h3 className="text-xl font-bold text-foreground mt-6 mb-2">
            Чек-лист запуска тренировки
          </h3>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/30">
            <CardContent className="p-5">
              <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                <li>
                  В <strong className="text-foreground">Behavior Parameters</strong> на агенте выставить{" "}
                  <code className="px-1 rounded bg-muted">Continuous Actions</code> = количество
                  степеней свободы.
                </li>
                <li>
                  Vector Observation Space Size должен совпадать с числом значений в{" "}
                  <code className="px-1 rounded bg-muted">CollectObservations</code>.
                </li>
                <li>
                  Сохранить YAML в{" "}
                  <code className="px-1 rounded bg-muted">config/robot_config.yaml</code>.
                </li>
                <li>
                  Запустить:{" "}
                  <code className="px-1 rounded bg-muted">
                    mlagents-learn config/robot_config.yaml --run-id=robot_v1
                  </code>
                  .
                </li>
                <li>
                  В Unity нажать Play. Следить за наградой:{" "}
                  <code className="px-1 rounded bg-muted">tensorboard --logdir results</code>.
                </li>
                <li>
                  После сходимости подключить полученный{" "}
                  <code className="px-1 rounded bg-muted">.onnx</code> к Behavior Parameters для
                  inference.
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm border-secondary/30 mt-6">
            <CardContent className="p-5 flex gap-3 items-start">
              <ArrowRight className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Что мы прошли:</strong> постановка задачи
                непрерывных действий → математическая основа Actor-Critic с{" "}
                <Math display={false}>{`V`}</Math>, <Math display={false}>{`Q`}</Math>,{" "}
                <Math display={false}>{`A`}</Math> и уравнением Беллмана → формулы PPO и SAC →
                эмпирическое подтверждение через кривые обучения → рабочий код Unity.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* ===================== QUIZ ===================== */}
        <Quiz title="Проверь себя: Actor-Critic, PPO, SAC и Unity" questions={quizQuestions} />
      </ProGate>
    </LessonLayout>
  );
};

export default CourseLesson2_3;
