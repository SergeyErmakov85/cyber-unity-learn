import { useState, useEffect, useRef } from "react";
import LessonLayout from "@/components/LessonLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import {
  Box,
  Eye,
  Gamepad2,
  Lightbulb,
  Zap,
  Brain,
  Plug,
  TrendingUp,
  Trophy,
  Play,
  Rocket,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// ----- RL training curve simulation -----
const TOTAL_POINTS = 100;

const generateRLData = (): number[] => {
  const data: number[] = [];
  for (let i = 0; i < TOTAL_POINTS; i++) {
    const normalizedX = (i - TOTAL_POINTS / 2) / (TOTAL_POINTS / 10);
    const sigmoid = 1 / (1 + Math.exp(-normalizedX));
    const baseReward = -1 + sigmoid * 6;
    const noiseAmplitude = 0.5 + (1 - Math.abs(sigmoid - 0.5) * 2) * 1.5;
    const noise = (Math.random() - 0.5) * noiseAmplitude;
    let val = baseReward + noise;
    val = Math.max(-1.5, Math.min(val, 5.5));
    data.push(Number(val.toFixed(2)));
  }
  return data;
};

// ----- Code blocks -----
const CSHARP_CODE = `using UnityEngine;
using Unity.MLAgents;
using Unity.MLAgents.Sensors;
using Unity.MLAgents.Actuators;

public class Ball3DAgent : Agent
{
    public Transform ball;
    Rigidbody ballRb;

    public override void Initialize()
    {
        ballRb = ball.GetComponent<Rigidbody>();
    }

    // Вызывается при старте обучения и при падении шара
    public override void OnEpisodeBegin()
    {
        this.transform.rotation = new Quaternion(0f, 0f, 0f, 0f);
        ball.localPosition = new Vector3(0, 1.5f, 0);
        ballRb.velocity = Vector3.zero;
    }

    // Собираем данные для нейросети (Inputs)
    public override void CollectObservations(VectorSensor sensor)
    {
        sensor.AddObservation(this.transform.rotation.z);
        sensor.AddObservation(this.transform.rotation.x);
        sensor.AddObservation(ball.localPosition);     // 3 значения
        sensor.AddObservation(ballRb.velocity);        // 3 значения
        // Итого: 8 чисел
    }

    // Принимаем решения от нейросети и выдаём награды
    public override void OnActionReceived(ActionBuffers actionBuffers)
    {
        var actionZ = 2f * Mathf.Clamp(actionBuffers.ContinuousActions[0], -1f, 1f);
        var actionX = 2f * Mathf.Clamp(actionBuffers.ContinuousActions[1], -1f, 1f);

        this.transform.Rotate(new Vector3(1, 0, 0), actionX);
        this.transform.Rotate(new Vector3(0, 0, 1), actionZ);

        if (ball.localPosition.y < -2f)
        {
            SetReward(-1.0f);
            EndEpisode();
        }
        else
        {
            SetReward(0.1f);
        }
    }
}`;

const PYTORCH_CODE = `import torch
import torch.nn as nn
import torch.nn.functional as F

class BallBalanceNet(nn.Module):
    def __init__(self, input_size=8, output_size=2):
        super(BallBalanceNet, self).__init__()
        # Полносвязные слои
        self.fc1 = nn.Linear(input_size, 64)
        self.fc2 = nn.Linear(64, 64)
        # Выходной слой для действий
        self.fc3 = nn.Linear(64, output_size)

    def forward(self, state):
        x = F.relu(self.fc1(state))
        x = F.relu(self.fc2(x))
        # Tanh ограничивает действия диапазоном [-1, 1]
        action = torch.tanh(self.fc3(x))
        return action`;

const TRAIN_CODE = `from mlagents_envs.environment import UnityEnvironment
from mlagents_envs.base_env import ActionTuple
import numpy as np
import torch

# 1. Подключаемся к Unity
env = UnityEnvironment(file_name=None)  # Работает в редакторе Unity
env.reset()
behavior_name = list(env.behavior_specs)[0]

model = BallBalanceNet()

for episode in range(100):
    env.reset()
    decision_steps, terminal_steps = env.get_steps(behavior_name)
    tracked_return = 0
    done = False

    while not done:
        # === STATE: получаем состояние из Unity ===
        state = decision_steps.obs[0]              # numpy [1, 8]
        tensor_state = torch.FloatTensor(state)

        # Нейросеть принимает решение
        action = model(tensor_state).detach().numpy()

        # === ACTION: отправляем действие в Unity ===
        action_tuple = ActionTuple(continuous=action)
        env.set_actions(behavior_name, action_tuple)
        env.step()

        # === REWARD: получаем награду и новое состояние ===
        decision_steps, terminal_steps = env.get_steps(behavior_name)
        if len(terminal_steps) > 0:
            reward = terminal_steps.reward[0]
            done = True
        else:
            reward = decision_steps.reward[0]
        tracked_return += reward

    print(f"Эпизод: {episode}, Кумулятивная награда: {tracked_return}")`;

type FlowKey = "state" | "action" | "reward";

const FLOW_LABEL: Record<FlowKey, { title: string; sub: string; color: string }> = {
  state: {
    title: "Состояние (State) →",
    sub: "decision_steps.obs[0]",
    color: "accent",
  },
  action: {
    title: "← Действие (Action)",
    sub: "env.set_actions(behavior, actions)",
    color: "primary",
  },
  reward: {
    title: "Награда (Reward) →",
    sub: "decision_steps.reward[0]",
    color: "secondary",
  },
};

const CourseProject1 = () => {
  const [unityTab, setUnityTab] = useState<"csharp" | "setup">("csharp");
  const [chartData, setChartData] = useState<{ episode: number; reward: number }[]>([]);
  const [activeFlow, setActiveFlow] = useState<FlowKey | null>(null);
  const intervalRef = useRef<number | null>(null);

  const runSimulation = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    const fullData = generateRLData();
    setChartData([]);
    let step = 0;
    intervalRef.current = window.setInterval(() => {
      step++;
      if (step >= fullData.length) {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        return;
      }
      setChartData(fullData.slice(0, step).map((r, i) => ({ episode: i + 1, reward: r })));
    }, 30);
  };

  useEffect(() => {
    const t = window.setTimeout(runSimulation, 400);
    return () => {
      window.clearTimeout(t);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const handleFlowClick = (key: FlowKey) => {
    setActiveFlow(key);
    window.setTimeout(() => setActiveFlow(null), 1500);
  };

  return (
    <LessonLayout
      lessonId="project-1"
      lessonTitle='Проект-1: "Баланс в 3D"'
      lessonNumber="П1"
      duration="60–90 мин"
      tags={["#project", "#unity", "#3d", "#pytorch", "#ppo"]}
      prevLesson={{ path: "/courses/1-7", title: "Exploration vs Exploitation" }}
      nextLesson={{ path: "/courses/2-1", title: "Введение в Уровень 2" }}
    >
      {/* === Intro === */}
      <section>
        <Card className="bg-gradient-to-br from-primary/10 via-card/40 to-accent/10 border-primary/30">
          <CardContent className="p-6 space-y-4">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/30">
              ПРОЕКТ: 3D BALL BALANCE
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              Создай свой первый{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                искусственный интеллект
              </span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Погружаемся в Reinforcement Learning. Цель — научить платформу балансировать
              шариком в Unity, не используя готовый <code className="text-primary">mlagents-learn</code>,
              а написав собственный «мозг» на PyTorch. Ты поймёшь, как магия работает под капотом.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
          {[
            {
              icon: Box,
              title: "Задача",
              desc: "Удержать падающий шар, изменяя угол наклона платформы по осям X и Z.",
              color: "text-primary",
              border: "border-primary/30",
            },
            {
              icon: Eye,
              title: "Наблюдения (Inputs)",
              desc: "Координаты шара, его скорость, текущий наклон платформы — всего 8 чисел.",
              color: "text-secondary",
              border: "border-secondary/30",
            },
            {
              icon: Gamepad2,
              title: "Действия (Outputs)",
              desc: "Непрерывные значения от −1 до 1 для вращения по двум осям (2 числа).",
              color: "text-accent",
              border: "border-accent/30",
            },
          ].map((item) => (
            <Card key={item.title} className={`bg-card/60 backdrop-blur-sm ${item.border}`}>
              <CardContent className="p-5 space-y-2">
                <item.icon className={`w-7 h-7 ${item.color}`} />
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* === Step 1: Unity === */}
      <section id="unity" style={{ scrollMarginTop: 80 }}>
        <div className="flex items-center gap-3 mb-4">
          <Gamepad2 className="w-7 h-7 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Шаг 1: Физическая среда в Unity
          </h2>
        </div>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Unity выступает симулятором реальности. Нейросеть-агент ничего не знает о мире —
          она видит только цифры. Наша задача в C#: собрать наблюдения, отправить их сети,
          получить действие, применить его к платформе и выдать награду.
        </p>

        {/* Mentor note */}
        <Card className="bg-secondary/5 border-l-4 border-secondary mb-6">
          <CardContent className="p-5 flex gap-4 items-start">
            <Lightbulb className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-secondary mb-1">Заметка ментора: анатомия RL</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Представь, что учишь собаку трюкам. Среда — парк, собака — агент.
                Когда шар держится на платформе — даём «лакомство» (+0.1). Если падает — ругаем (−1.0).
                Агент стремится максимизировать кумулятивную награду за эпизод.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card className="bg-card/60 backdrop-blur-sm border-primary/30 overflow-hidden">
          <div className="flex border-b border-border/50 bg-muted/20 p-2 gap-2">
            <button
              onClick={() => setUnityTab("csharp")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                unityTab === "csharp"
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              Ball3DAgent.cs
            </button>
            <button
              onClick={() => setUnityTab("setup")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                unityTab === "setup"
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              Настройка компонентов
            </button>
          </div>
          <CardContent className="p-0">
            {unityTab === "csharp" ? (
              <div className="p-4">
                <CyberCodeBlock language="csharp" filename="Ball3DAgent.cs">
                  {CSHARP_CODE}
                </CyberCodeBlock>
              </div>
            ) : (
              <div className="p-6 text-sm text-muted-foreground leading-relaxed space-y-3">
                <h4 className="font-bold text-lg text-foreground">Сборка сцены</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Создайте куб <code className="text-primary">Platform</code> (Scale: 5, 0.5, 5).
                  </li>
                  <li>
                    Создайте сферу <code className="text-primary">Ball</code> и добавьте компонент{" "}
                    <strong className="text-foreground">Rigidbody</strong>.
                  </li>
                  <li>
                    Прикрепите <code className="text-primary">Ball3DAgent.cs</code> к Platform.
                  </li>
                  <li>
                    Добавьте к платформе компонент{" "}
                    <strong className="text-foreground">Behavior Parameters</strong>:
                    <ul className="list-disc pl-5 mt-1">
                      <li>
                        Space Size (наблюдения): <strong className="text-primary">8</strong>
                      </li>
                      <li>
                        Continuous Actions (действия): <strong className="text-primary">2</strong>
                      </li>
                    </ul>
                  </li>
                </ol>
                <div className="mt-4 p-3 bg-accent/5 border border-accent/30 rounded-lg text-foreground">
                  <strong className="text-accent">Важно:</strong> не добавляем{" "}
                  <code>Decision Requester</code> — внешний цикл запросов мы напишем на Python.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* === Step 2: PyTorch === */}
      <section id="pytorch" style={{ scrollMarginTop: 80 }}>
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-7 h-7 text-accent" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Шаг 2: Мозг на PyTorch
          </h2>
        </div>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Почему пишем кастомную сеть, а не используем готовое решение? Чтобы перестать быть
          «потребителями чёрных ящиков». Спроектируем архитектуру, которая преобразует 8 чисел
          состояния в 2 идеальных угла наклона.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Architecture viz */}
          <Card className="bg-card/60 backdrop-blur-sm border-secondary/30">
            <CardContent className="p-6">
              <h3 className="text-center font-bold text-foreground mb-6">
                Архитектура сети (MLP)
              </h3>
              <div className="flex justify-between items-stretch h-64 gap-3">
                {/* Input */}
                <div className="flex flex-col justify-center gap-2 w-1/4 group">
                  <div className="text-center text-xs font-bold text-primary mb-1">
                    Input Layer
                    <br />
                    (State: 8)
                  </div>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="bg-primary/10 border-2 border-primary/40 rounded-full h-3 w-full group-hover:bg-primary/30 group-hover:shadow-[0_0_10px_hsl(var(--primary)/0.5)] transition-all"
                    />
                  ))}
                </div>

                <div className="flex items-center text-muted-foreground text-2xl">→</div>

                {/* Hidden */}
                <div className="flex flex-col justify-center gap-1 w-1/3 group">
                  <div className="text-center text-xs font-bold text-secondary mb-1">
                    Hidden Layers
                    <br />
                    (64 + ReLU)
                  </div>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="bg-secondary/10 border-2 border-secondary/40 rounded-full h-2.5 w-full group-hover:bg-secondary/30 group-hover:shadow-[0_0_10px_hsl(var(--secondary)/0.5)] transition-all"
                    />
                  ))}
                </div>

                <div className="flex items-center text-muted-foreground text-2xl">→</div>

                {/* Output */}
                <div className="flex flex-col justify-center gap-3 w-1/4 group">
                  <div className="text-center text-xs font-bold text-accent mb-1">
                    Output Layer
                    <br />
                    (Action: 2 + Tanh)
                  </div>
                  {["Tilt X", "Tilt Z"].map((label) => (
                    <div
                      key={label}
                      className="bg-accent/10 border-2 border-accent/40 rounded-full h-7 w-full flex items-center justify-center text-[10px] font-bold text-accent group-hover:bg-accent/30 group-hover:shadow-[0_0_12px_hsl(var(--accent)/0.5)] transition-all"
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 text-sm text-muted-foreground bg-muted/20 p-4 rounded-lg border border-border/40">
                <strong className="text-foreground">Активации:</strong>{" "}
                <code className="text-secondary">ReLU</code> в скрытых слоях (учим сложные
                зависимости). На выходе — <code className="text-accent">Tanh</code>, чтобы
                получить значения в диапазоне [−1; 1].
              </div>
            </CardContent>
          </Card>

          {/* Code */}
          <CyberCodeBlock language="python" filename="network.py">
            {PYTORCH_CODE}
          </CyberCodeBlock>
        </div>
      </section>

      {/* === Step 3: Integration === */}
      <section id="integration" style={{ scrollMarginTop: 80 }}>
        <div className="flex items-center gap-3 mb-4">
          <Plug className="w-7 h-7 text-secondary" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Шаг 3: Связь Unity и Python (цикл RL)
          </h2>
        </div>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Ядро проекта. Используем библиотеку <code className="text-primary">mlagents_envs</code>:
          она открывает порт и обменивается данными с Unity на каждом кадре.
        </p>

        {/* Interactive flow */}
        <Card className="bg-card/60 backdrop-blur-sm border-primary/30 mb-6">
          <CardContent className="p-6">
            <h3 className="text-center font-bold text-foreground mb-2">
              Интерактивный цикл обучения
            </h3>
            <p className="text-xs text-center text-muted-foreground mb-6">
              Кликни по элементам, чтобы подсветить связанный код ниже
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-3xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-primary/10 border-2 border-primary/50 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_20px_hsl(var(--primary)/0.3)]">
                  🎮
                </div>
                <span className="font-bold mt-2 text-primary text-sm">Unity</span>
              </div>

              <div className="flex flex-col gap-2 flex-1 w-full">
                {(["action", "reward", "state"] as FlowKey[]).map((key) => {
                  const meta = FLOW_LABEL[key];
                  const isActive = activeFlow === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleFlowClick(key)}
                      className={`w-full p-3 rounded-xl text-center transition-all border-2 ${
                        isActive
                          ? `border-${meta.color} bg-${meta.color}/15 shadow-[0_0_15px_hsl(var(--${meta.color})/0.4)]`
                          : "border-border/40 bg-muted/10 hover:border-border"
                      }`}
                    >
                      <span className={`text-xs font-bold uppercase block text-${meta.color}`}>
                        {meta.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {meta.sub}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-accent/10 border-2 border-accent/50 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_20px_hsl(var(--accent)/0.3)]">
                  🧠
                </div>
                <span className="font-bold mt-2 text-accent text-sm">PyTorch</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <CyberCodeBlock language="python" filename="train.py">
          {TRAIN_CODE}
        </CyberCodeBlock>
      </section>

      {/* === Step 4: Metrics === */}
      <section id="metrics" style={{ scrollMarginTop: 80 }}>
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-7 h-7 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Шаг 4: Анализ и метрики обучения
          </h2>
        </div>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Главная метрика — <strong className="text-foreground">Cumulative Reward</strong>:
          сумма всех наград за один эпизод до падения шара. В реальных проектах данные логируются
          в TensorBoard.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chart */}
          <Card className="lg:col-span-2 bg-card/60 backdrop-blur-sm border-primary/30">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-foreground text-sm md:text-base">
                  Симуляция: Environment / Cumulative Reward
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={runSimulation}
                  className="border-primary/50 text-primary hover:bg-primary/10"
                >
                  <Play className="w-3 h-3 mr-1" /> Запустить
                </Button>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                    <XAxis
                      dataKey="episode"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 11 }}
                      label={{
                        value: "Episode",
                        position: "insideBottom",
                        offset: -2,
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 11,
                      }}
                    />
                    <YAxis
                      domain={[-2, 6]}
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 11 }}
                      label={{
                        value: "Reward",
                        angle: -90,
                        position: "insideLeft",
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 11,
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--primary) / 0.3)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="reward"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <div className="flex flex-col gap-4">
            <Card className="bg-card/60 backdrop-blur-sm border-secondary/30 flex-1">
              <CardContent className="p-5">
                <h4 className="font-bold text-secondary mb-3 text-sm">Как читать график?</h4>
                <ul className="text-sm text-muted-foreground space-y-3">
                  <li className="flex gap-2 items-start">
                    <span className="text-destructive flex-shrink-0">📉 Старт:</span>
                    <span>сеть выдаёт случайные числа, шар падает моментально (≈ −1.0).</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-secondary flex-shrink-0">🔄 Озарение:</span>
                    <span>алгоритм нащупывает зависимость, график резко ползёт вверх.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-primary flex-shrink-0">✨ Плато:</span>
                    <span>агент держит шар почти бесконечно, награда стабилизируется.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="bg-muted/20 border border-primary/20 text-muted-foreground p-4 rounded-xl text-xs font-mono">
              <div>$ tensorboard --logdir runs</div>
              <div>Serving TensorBoard on localhost:6006</div>
              <div className="text-primary mt-1">Status: Model converged successfully.</div>
            </div>
          </div>
        </div>

        {/* Final */}
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/30">
          <CardContent className="p-6 flex flex-col md:flex-row gap-5 items-center">
            <Trophy className="w-14 h-14 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-accent" /> Итог проекта
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ты настроил физику в Unity, определил систему поощрений, собрал нейросеть
                с нуля на PyTorch и связал их воедино. Это база, на которой строятся беспилотные
                автомобили, игровые ИИ-боты и робототехника. Добро пожаловать в мир Reinforcement Learning!
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </LessonLayout>
  );
};

export default CourseProject1;
