import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const LABELS = ["0", "100k", "200k", "300k", "400k", "500k", "600k", "700k", "800k", "900k", "1M"];
const PPO = [-2.0, 1.5, 4.0, 5.5, 6.2, 6.8, 7.0, 7.1, 7.1, 7.2, 7.2];
const SAC = [-2.0, -1.0, 1.0, 3.5, 5.8, 7.5, 8.8, 9.5, 9.8, 10.0, 10.0];

const DATA = LABELS.map((step, i) => ({ step, PPO: PPO[i], SAC: SAC[i] }));

type View = "ppo" | "sac" | "both";

const insights: Record<View, string> = {
  ppo:
    "PPO: быстрый старт за счёт клиппинга r_t(θ) ∈ [1−ε, 1+ε] — обновления безопасные, политика быстро уходит от случайных действий. Тот же клиппинг ограничивает рост: после ~500k шагов алгоритм выходит на плато.",
  sac:
    "SAC: медленное начало — энтропийный бонус α·H(π) намеренно держит политику стохастичной. Зато к ~700k шагов накопленный в Replay Buffer разнообразный опыт даёт более высокий потолок награды.",
  both:
    "Сравнение: для многомерных непрерывных действий (4+ суставов) SAC превосходит PPO на длинной дистанции. На короткой (до ~300k) PPO стабильнее и быстрее достигает приемлемой награды.",
};

const PpoVsSacChart = () => {
  const [view, setView] = useState<View>("both");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          size="sm"
          variant={view === "ppo" ? "default" : "outline"}
          onClick={() => setView("ppo")}
          className={view === "ppo" ? "bg-primary text-primary-foreground" : "border-primary/30"}
        >
          Только PPO
        </Button>
        <Button
          size="sm"
          variant={view === "sac" ? "default" : "outline"}
          onClick={() => setView("sac")}
          className={view === "sac" ? "bg-secondary text-secondary-foreground" : "border-secondary/30"}
        >
          Только SAC
        </Button>
        <Button
          size="sm"
          variant={view === "both" ? "default" : "outline"}
          onClick={() => setView("both")}
          className={view === "both" ? "bg-accent text-accent-foreground" : "border-accent/30"}
        >
          Сравнить оба
        </Button>
      </div>

      <div className="w-full h-[360px] rounded-lg bg-card/60 border border-primary/20 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={DATA} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="step" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[-3, 12]} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--primary) / 0.3)",
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {(view === "ppo" || view === "both") && (
              <Line
                type="monotone"
                dataKey="PPO"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ r: 4, fill: "hsl(var(--primary))" }}
              />
            )}
            {(view === "sac" || view === "both") && (
              <Line
                type="monotone"
                dataKey="SAC"
                stroke="hsl(var(--secondary))"
                strokeWidth={3}
                dot={{ r: 4, fill: "hsl(var(--secondary))" }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-muted-foreground italic text-center max-w-2xl mx-auto">
        {insights[view]}
      </p>
    </div>
  );
};

export default PpoVsSacChart;
