import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import MathTex from "@/components/Math";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const BASE_REWARD = 10;
const STEPS = 10;

const GammaSlider = () => {
  const [gamma, setGamma] = useState(0.9);

  const data = useMemo(
    () =>
      Array.from({ length: STEPS }, (_, i) => ({
        step: `t+${i + 1}`,
        reward: BASE_REWARD * Math.pow(gamma, i),
      })),
    [gamma],
  );

  const totalReturn = useMemo(
    () => data.reduce((sum, d) => sum + d.reward, 0),
    [data],
  );

  return (
    <div className="bg-card/40 rounded-xl border border-border/50 p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h4 className="font-semibold text-foreground text-sm">
            Визуализация дисконтирования
          </h4>
          <p className="text-xs text-muted-foreground">
            Перемещайте слайдер, чтобы увидеть, как <MathTex display={false}>{String.raw`\enfPar{\gamma}`}</MathTex> влияет на ценность будущих
            наград
          </p>
        </div>
        <div className="text-right">
          <span className="font-mono text-2xl font-bold text-primary">
            <MathTex display={false}>{String.raw`\enfPar{\gamma} =`}</MathTex> {gamma.toFixed(2)}
          </span>
          <p className="text-xs text-muted-foreground">
            G = {totalReturn.toFixed(1)}
          </p>
        </div>
      </div>

      <Slider
        value={[gamma * 100]}
        onValueChange={([v]) => setGamma(v / 100)}
        max={99}
        min={0}
        step={1}
        className="py-2"
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span><MathTex display={false}>{String.raw`\enfPar{\gamma} = 0`}</MathTex> (только текущая)</span>
        <span><MathTex display={false}>{String.raw`\enfPar{\gamma} = 0.99`}</MathTex> (дальновидный)</span>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.3}
            />
            <XAxis
              dataKey="step"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              domain={[0, BASE_REWARD]}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [
                value.toFixed(2),
                "Дисконтированная награда",
              ]}
            />
            <Bar dataKey="reward" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={`hsl(180, 100%, ${Math.max(25, 50 - i * 3)}%)`}
                  opacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="p-2 rounded-lg bg-muted/20 border border-border/30">
          <p className="text-muted-foreground"><MathTex display={false}>{String.raw`\enfPar{\gamma} = 0`}</MathTex></p>
          <p className="font-mono text-foreground font-medium">
            Жадный агент
          </p>
        </div>
        <div className="p-2 rounded-lg bg-muted/20 border border-border/30">
          <p className="text-muted-foreground"><MathTex display={false}>{String.raw`\enfPar{\gamma} \approx 0.5`}</MathTex></p>
          <p className="font-mono text-foreground font-medium">Баланс</p>
        </div>
        <div className="p-2 rounded-lg bg-muted/20 border border-border/30">
          <p className="text-muted-foreground"><MathTex display={false}>{String.raw`\enfPar{\gamma} \to 1`}</MathTex></p>
          <p className="font-mono text-foreground font-medium">
            Дальновидный
          </p>
        </div>
      </div>
    </div>
  );
};

export default GammaSlider;
