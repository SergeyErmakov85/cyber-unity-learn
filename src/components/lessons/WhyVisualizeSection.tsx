import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dices,
  Compass,
  Repeat,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  ComposedChart,
  CartesianGrid,
  Legend,
} from "recharts";

const SOURCES = [
  {
    title: "Стохастичность среды",
    text:
      "Atari sticky actions, MuJoCo randomness: даже фиксированный сид даёт разные траектории.",
    icon: Dices,
    color: "cyan",
  },
  {
    title: "Exploration → нестационарное распределение данных",
    text:
      'Распределение данных меняется по мере обучения. Andrej Karpathy в «A Recipe for Training Neural Networks» подчёркивает, что в RL "the signal-to-noise ratio is far worse than in supervised learning".',
    icon: Compass,
    color: "purple",
  },
  {
    title: "Bootstrapping критика",
    text:
      "Value-функция учится на собственных оценках, ошибки самораспространяются. Andy Jones (Anthropic): «Because information in an RL system flows in a loop — actor to learner and then back to actor — a numerical error in one spot gets smeared throughout the system in seconds, poisoning everything».",
    icon: Repeat,
    color: "pink",
  },
] as const;

const SOURCE_COLORS: Record<string, string> = {
  cyan: "border-cyan-500/30 [&_svg]:text-cyan-400 hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]",
  purple:
    "border-purple-500/30 [&_svg]:text-purple-400 hover:shadow-[0_0_20px_hsl(280_85%_65%/0.3)]",
  pink: "border-pink-500/30 [&_svg]:text-pink-400 hover:shadow-[0_0_20px_hsl(330_85%_65%/0.3)]",
};

const HIDDEN_ISSUES = [
  {
    label: "vanishing/exploding gradients",
    text: "только в гистограммах grad_norm",
  },
  {
    label: "policy/entropy collapse",
    text: "политика становится почти детерминированной слишком рано",
  },
  {
    label: "value function divergence",
    text: "Q-значения уходят в +∞ (overestimation в DQN)",
  },
  { label: "reward hacking", text: "агент находит лазейку в shaping reward" },
  { label: "KL blow-up в PPO", text: "approx_kl ≫ target_kl" },
];

// Synthetic data: one seed looks great
const SINGLE_SEED = Array.from({ length: 21 }, (_, i) => {
  const x = i * 5; // 0..100k
  const y = 200 / (1 + Math.exp(-(x - 50) / 12));
  return { step: x, reward: Math.round(y) };
});

// 5 seeds: 2 stay near 0, 3 climb to 100-200
const SEEDS = [
  (x: number) => 200 / (1 + Math.exp(-(x - 45) / 10)),
  (x: number) => 150 / (1 + Math.exp(-(x - 55) / 12)),
  (x: number) => 110 / (1 + Math.exp(-(x - 65) / 14)),
  (_x: number) => 5 + Math.sin(_x / 8) * 3,
  (_x: number) => 8 + Math.cos(_x / 6) * 4,
];

const MULTI_SEED = Array.from({ length: 21 }, (_, i) => {
  const x = i * 5;
  const ys = SEEDS.map((f) => f(x));
  const sorted = [...ys].sort((a, b) => a - b);
  const median = sorted[2];
  const q1 = (sorted[0] + sorted[1]) / 2;
  const q3 = (sorted[3] + sorted[4]) / 2;
  return {
    step: x,
    median: Math.round(median),
    range: [Math.round(q1), Math.round(q3)] as [number, number],
    s1: Math.round(ys[0]),
    s2: Math.round(ys[1]),
    s3: Math.round(ys[2]),
    s4: Math.round(ys[3]),
    s5: Math.round(ys[4]),
  };
});

const TOOLTIP_STYLE = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
};

const WhyVisualizeSection = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-lg text-foreground/90 leading-relaxed">
          RL отличается от supervised learning тремя источниками нестабильности.
        </p>
      </div>

      {/* 3 instability sources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SOURCES.map(({ title, text, icon: Icon, color }) => (
          <Card
            key={title}
            className={`bg-card/60 backdrop-blur-sm transition-all duration-300 ${SOURCE_COLORS[color]}`}
          >
            <CardContent className="p-5 space-y-3">
              <div className="w-10 h-10 rounded-lg border border-current/30 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-foreground leading-snug">{title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hidden issues */}
      <Card className="bg-card/60 border-amber-500/30 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h4 className="text-lg font-bold text-amber-300">
              Что нельзя увидеть без визуализации
            </h4>
          </div>
          <ul className="space-y-2">
            {HIDDEN_ISSUES.map(({ label, text }) => (
              <li key={label} className="flex gap-3 text-sm">
                <span className="text-amber-400 mt-1 shrink-0">●</span>
                <span className="text-foreground/90">
                  <strong className="text-amber-200">{label}</strong>
                  <span className="text-muted-foreground"> — {text};</span>
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Interactive compare */}
      <Card className="bg-card/60 border-cyan-500/20 backdrop-blur-sm">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-foreground">
              Обучается vs случайно повезло
            </h4>
            <p className="text-sm text-muted-foreground">
              Один и тот же эксперимент — две разные истории.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Single seed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-cyan-300">
                  Один сид
                </span>
                <span className="text-xs text-muted-foreground">
                  100 000 шагов
                </span>
              </div>
              <div className="h-56 rounded-lg border border-cyan-500/20 bg-background/40 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SINGLE_SEED}>
                    <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.3} />
                    <XAxis
                      dataKey="step"
                      tickFormatter={(v) => `${v}k`}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      domain={[0, 220]}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Line
                      type="monotone"
                      dataKey="reward"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      dot={false}
                      name="reward"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs italic text-cyan-300/80">
                Кажется, агент гениально обучился!
              </p>
            </div>

            {/* Multi seed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-pink-300">
                  5 сидов с CI
                </span>
                <span className="text-xs text-muted-foreground">медиана + IQR</span>
              </div>
              <div className="h-56 rounded-lg border border-pink-500/20 bg-background/40 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={MULTI_SEED}>
                    <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.3} />
                    <XAxis
                      dataKey="step"
                      tickFormatter={(v) => `${v}k`}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      domain={[0, 220]}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                    <Area
                      type="monotone"
                      dataKey="range"
                      stroke="none"
                      fill="hsl(330 85% 65%)"
                      fillOpacity={0.18}
                      name="IQR"
                    />
                    {(["s1", "s2", "s3", "s4", "s5"] as const).map((k, i) => (
                      <Line
                        key={k}
                        type="monotone"
                        dataKey={k}
                        stroke={`hsl(${280 + i * 15} 70% 60%)`}
                        strokeOpacity={0.45}
                        strokeWidth={1}
                        dot={false}
                        name={`seed ${i + 1}`}
                      />
                    ))}
                    <Line
                      type="monotone"
                      dataKey="median"
                      stroke="hsl(330 95% 70%)"
                      strokeWidth={2.5}
                      dot={false}
                      name="median"
                    />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs italic text-pink-300/80">
                Реальная картина: 2 из 5 сидов вообще не обучились.
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
            <strong className="text-foreground">
              Henderson et al. (AAAI 2018, «Deep Reinforcement Learning That Matters»)
            </strong>
            : «группа из 5 сидов может статистически достоверно "победить" другую группу
            из 5 сидов, даже если оба алгоритма идентичны».
          </p>
        </CardContent>
      </Card>

      {/* RLiable callout */}
      <div className="rounded-r-2xl border-l-4 border-cyan-500 bg-cyan-500/5 p-6 space-y-3">
        <h4 className="text-lg font-bold text-cyan-300">
          RLiable (Agarwal et al., NeurIPS 2021, Outstanding Paper)
        </h4>
        <p className="text-sm text-foreground/90 leading-relaxed">
          Современный стандарт оценки. Репортите interval estimates через стратифицированный
          bootstrap. Используйте <strong>IQM</strong> (interquartile mean) вместо mean
          (устойчив к выбросам) и median (статистически неэффективен). Стройте performance
          profiles. Сообщайте optimality gap и average probability of improvement.
        </p>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200"
        >
          <a
            href="https://arxiv.org/abs/2108.13264"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            arxiv.org/abs/2108.13264
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default WhyVisualizeSection;
