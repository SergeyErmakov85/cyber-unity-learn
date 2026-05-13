import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Slider } from "@/components/ui/slider";

// ── Learning Curves: Sparse vs Dense vs Shaped ─────────────────
const EPISODES = Array.from({ length: 100 }, (_, i) => i * 10);
const LEARNING_DATA = EPISODES.map((x) => ({
  episode: x,
  sparse: x < 600 ? 0 : (1 / (1 + Math.exp(-(x - 650) / 20))) * 100,
  dense: (1 - Math.exp(-x / 200)) * 60,
  shaped: (1 - Math.exp(-x / 150)) * 95,
}));

export const LearningCurvesChart = () => (
  <div className="rounded-xl border border-primary/20 bg-card/60 backdrop-blur-sm p-4">
    <h4 className="text-sm font-semibold text-foreground mb-1">Кривые обучения: Sparse vs Dense vs Potential-Based</h4>
    <p className="text-xs text-muted-foreground mb-3">
      Sparse долго лежит на нуле — пока агент случайно не наткнётся на цель. Dense учится быстро, но застревает в субоптимуме. Potential-Based — лучший из миров.
    </p>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={LEARNING_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
          <XAxis dataKey="episode" stroke="hsl(var(--muted-foreground))" fontSize={11} label={{ value: "Эпизоды", position: "insideBottom", offset: -5, fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} label={{ value: "Накопленная награда", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="sparse" name="Sparse" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="dense" name="Dense (наивный)" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="shaped" name="Potential-Based" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// ── Reward Hacking: Bar chart ──────────────────────────────────
const STEPS = Array.from({ length: 20 }, (_, i) => i + 1);
let valHack = 0;
let valPot = 0;
const HACKING_DATA = STEPS.map((s, i) => {
  if (i % 2 === 0) valHack += 0.1;
  if (i % 2 === 0) valPot += 0.1; else valPot -= 0.1;
  return { step: `${s}`, hacking: +valHack.toFixed(2), potential: +valPot.toFixed(2) };
});

export const RewardHackingChart = () => (
  <div className="rounded-xl border border-secondary/20 bg-card/60 backdrop-blur-sm p-4">
    <h4 className="text-sm font-semibold text-foreground mb-1">Замкнутый цикл: «вперёд–назад–вперёд…»</h4>
    <p className="text-xs text-muted-foreground mb-3">
      Наивный shaping позволяет агенту бесконечно фармить награду, ходя туда-сюда. Potential-Based по теореме Ng даёт сумму 0 на любом замкнутом цикле.
    </p>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={HACKING_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
          <XAxis dataKey="step" stroke="hsl(var(--muted-foreground))" fontSize={10} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="hacking" name="Naive Dense (фарм)" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="potential" name="Potential-Based (защита)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// ── Steps probability slider ───────────────────────────────────
export const StepsProbabilitySlider = () => {
  const [steps, setSteps] = useState<number>(50);
  const baseProb = 0.5;
  const probRaw = Math.pow(baseProb, steps / 10) * 100;
  const display = probRaw < 0.0001 ? "< 0.0001" : probRaw.toFixed(4);
  const colorClass = steps < 50 ? "text-primary" : steps < 200 ? "text-accent" : "text-destructive";

  return (
    <div className="rounded-xl border border-accent/30 bg-card/80 backdrop-blur-sm p-6">
      <h4 className="text-sm font-semibold text-foreground mb-1">Влияние длины эпизода на вероятность случайного успеха</h4>
      <p className="text-xs text-muted-foreground mb-5">
        Чем длиннее путь до награды — тем экспоненциально меньше шанс случайно её найти. Это и есть проблема credit assignment в чистом виде.
      </p>
      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono mb-3">
        <span>10 шагов</span>
        <span className="text-foreground">{steps} шагов</span>
        <span>1000 шагов</span>
      </div>
      <Slider value={[steps]} onValueChange={(v) => setSteps(v[0])} min={10} max={1000} step={10} className="mb-5" />
      <div className="text-center">
        <div className="text-xs text-muted-foreground mb-1">Вероятность успеха случайного агента</div>
        <div className={`text-4xl font-black ${colorClass}`}>{display}%</div>
      </div>
    </div>
  );
};
