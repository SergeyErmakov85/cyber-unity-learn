import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Download, Brain, Code, BarChart3, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import SEOHead from "@/components/SEOHead";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useMemo } from "react";
import LabPracticeSection from "@/components/LabPracticeSection";

const TaxiProject = () => {
  const navigate = useNavigate();

  const learningData = useMemo(() => {
    const data = [];
    for (let i = 0; i <= 50; i++) {
      const ep = i * 100;
      const reward = -200 + 210 * (1 - Math.exp(-ep / 1500));
      data.push({ episode: ep, reward: Math.round(reward * 10) / 10 });
    }
    return data;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Taxi-v3: Q-Learning и REINFORCE | Gymnasium Tutorial"
        description="Q-Learning агент для среды Taxi-v3: пошаговая реализация, визуализация Q-таблицы, кривая обучения."
        path="/unity-projects/taxi-v3"
      />
      {/* 1. Шапка */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/unity-projects")} className="text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Unity Проекты
          </Button>
          <h1 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">Taxi-v3: от Q-Learning до Policy Gradient</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Классическая среда Gymnasium для освоения табличного и нейросетевого RL. Пошаговый разбор Q-таблицы, epsilon-greedy стратегии и REINFORCE на одном примере.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-12">
        {/* 2. Бейджи стека */}
        <div className="flex flex-wrap gap-2">
          {["Python", "Gymnasium", "Q-Learning", "REINFORCE", "Jupyter"].map((tech) => (
            <span key={tech} className="text-xs px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary font-medium">
              {tech}
            </span>
          ))}
        </div>

        {/* 3. Среда Taxi-v3 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Map className="w-6 h-6 text-primary" /> Среда Taxi-v3
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Сетка 5×5 с 500 дискретными состояниями и 6 действиями. Такси должно подобрать пассажира и доставить к месту назначения.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-background/60 rounded-lg p-4 border border-border/50">
                  <h4 className="font-semibold text-foreground mb-1">Состояния</h4>
                  <p className="text-muted-foreground">500 дискретных (позиция × пассажир × цель)</p>
                </div>
                <div className="bg-background/60 rounded-lg p-4 border border-border/50">
                  <h4 className="font-semibold text-foreground mb-1">Действия</h4>
                  <p className="text-muted-foreground">6: ↑↓←→ + pickup + dropoff</p>
                </div>
                <div className="bg-background/60 rounded-lg p-4 border border-border/50">
                  <h4 className="font-semibold text-foreground mb-1">Награды</h4>
                  <p className="text-muted-foreground">+20 доставка, −10 ошибка, −1 шаг</p>
                </div>
              </div>
              <CyberCodeBlock language="python" filename="taxi_env_init.py">
{`import gymnasium as gym

env = gym.make("Taxi-v3", render_mode="ansi")
state, info = env.reset()

print(f"Пространство состояний: {env.observation_space.n}")  # 500
print(f"Пространство действий: {env.action_space.n}")        # 6`}
              </CyberCodeBlock>
            </CardContent>
          </Card>
        </section>

        {/* 4. Q-Table алгоритм */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" /> Q-Table алгоритм
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Табличный Q-Learning с ε-greedy exploration. Таблица 500×6 обновляется по формуле Беллмана.
              </p>
              <CyberCodeBlock language="python" filename="q_learning_taxi.py">
{`import numpy as np

Q = np.zeros([500, 6])
alpha, gamma, epsilon = 0.1, 0.99, 1.0

for episode in range(10000):
    state, _ = env.reset()
    done = False

    while not done:
        if np.random.random() < epsilon:
            action = env.action_space.sample()
        else:
            action = np.argmax(Q[state])

        next_state, reward, terminated, truncated, _ = env.step(action)
        done = terminated or truncated

        # Q-update
        Q[state, action] += alpha * (
            reward + gamma * np.max(Q[next_state]) - Q[state, action]
        )
        state = next_state

    epsilon = max(0.01, epsilon * 0.995)`}
              </CyberCodeBlock>
            </CardContent>
          </Card>
        </section>

        {/* 5. Кривая обучения */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" /> Кривая обучения
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4">Средняя награда за эпизод (скользящее среднее)</p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={learningData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="episode"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    label={{ value: "Эпизод", position: "insideBottom", offset: -5, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    label={{ value: "Reward", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Line type="monotone" dataKey="reward" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* 6. Ссылка на ноутбук */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Code className="w-6 h-6 text-primary" /> Jupyter-ноутбук
          </h2>
          <Card className="bg-card/60 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-foreground font-medium">Полный ноутбук: Taxi-v3.ipynb</p>
                <p className="text-sm text-muted-foreground mt-1">Q-Learning + REINFORCE — всё в одном файле. Скачай и запусти.</p>
              </div>
              <a href="/Taxi-v3.ipynb" download>
                <Button variant="cyber">
                  <Download className="w-4 h-4 mr-2" /> Скачать .ipynb
                </Button>
              </a>
            </CardContent>
          </Card>
        </section>

        {/* Практика: собранная среда лаборатории для этой темы. */}
        <LabPracticeSection contextKey="/unity-projects/taxi-v3" />

        {/* 7. Навигация */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10" onClick={() => navigate("/unity-projects")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Unity Projects
          </Button>
          <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10" onClick={() => navigate("/unity-projects/food-collector")}>
            Следующий: FoodCollector <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaxiProject;
