import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer,
} from "recharts";
import { Slider } from "@/components/ui/slider";
import Math from "@/components/Math";

/* ─── 1. Geometric Series Convergence ─── */

export const GeometricSeriesChart = () => {
  const [gammas, setGammas] = useState([0.5, 0.9]);
  const N = 30;

  const data = useMemo(() => {
    return Array.from({ length: N + 1 }, (_, n) => {
      const point: Record<string, number> = { n };
      gammas.forEach((g) => {
        let sum = 0;
        for (let t = 0; t <= n; t++) sum += g ** t;
        point[`γ=${g}`] = parseFloat(sum.toFixed(4));
      });
      return point;
    });
  }, [gammas]);

  const limits = gammas.map((g) => ({
    gamma: g,
    limit: parseFloat((1 / (1 - g)).toFixed(2)),
  }));

  const colors = ["hsl(var(--primary))", "hsl(var(--accent))"];

  return (
    <div className="my-6 p-4 rounded-lg bg-card/60 border border-border/30 space-y-4">
      <h4 className="text-sm font-semibold text-foreground">
        Сходимость геометрического ряда{" "}
        <span className="font-mono text-primary">
          S_<Math display={false}>{String.raw`N = \sum \enfPar{\gamma}^{t}`}</Math>
        </span>
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {gammas.map((g, i) => (
          <div key={i} className="space-y-1">
            <label className="text-xs text-muted-foreground">
              <Math display={false}>{String.raw`\enfPar{\gamma}`}</Math>{i + 1} = <span className="font-mono text-foreground">{g.toFixed(2)}</span>
              <span className="ml-2 text-xs opacity-60">
                (<Math display={false}>{String.raw`\enfOp{S}_{\infty} =`}</Math> {(1 / (1 - g)).toFixed(1)})
              </span>
            </label>
            <Slider
              min={10}
              max={99}
              step={1}
              value={[g * 100]}
              onValueChange={([v]) => {
                const next = [...gammas];
                next[i] = v / 100;
                setGammas(next);
              }}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="n"
            label={{ value: "Число слагаемых N", position: "insideBottomRight", offset: -5, style: { fill: "hsl(var(--muted-foreground))", fontSize: 11 } }}
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 10 }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {gammas.map((g, i) => (
            <Line
              key={g}
              type="monotone"
              dataKey={`γ=${g}`}
              stroke={colors[i]}
              strokeWidth={2}
              dot={false}
              animationDuration={400}
            />
          ))}
          {limits.map((l, i) => (
            <ReferenceLine
              key={`lim-${l.gamma}`}
              y={l.limit}
              stroke={colors[i]}
              strokeDasharray="6 3"
              opacity={0.5}
              label={{
                value: `S∞=${l.limit}`,
                position: "right",
                style: { fill: colors[i], fontSize: 10 },
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <p className="text-xs text-muted-foreground">
        Перемещайте слайдеры, чтобы наблюдать, как скорость сходимости зависит от <Math display={false}>{String.raw`\enfPar{\gamma}`}</Math>. Пунктирные линии — теоретические пределы <Math display={false}>{String.raw`\enfOp{S}_{\infty} = 1/(1-\enfPar{\gamma})`}</Math>.
      </p>
    </div>
  );
};

/* ─── 2. Value Iteration Convergence ─── */

export const ValueIterationChart = () => {
  const [gamma, setGamma] = useState(0.9);
  const iterations = 30;

  const data = useMemo(() => {
    const points: { k: number; V1: number; V2: number }[] = [];
    let v1 = 0, v2 = 0;
    points.push({ k: 0, V1: 0, V2: 0 });

    for (let i = 1; i <= iterations; i++) {
      const v1New = 2 + gamma * v2;
      const v2New = 0 + gamma * v1;
      v1 = v1New;
      v2 = v2New;
      points.push({
        k: i,
        V1: parseFloat(v1.toFixed(3)),
        V2: parseFloat(v2.toFixed(3)),
      });
    }
    return points;
  }, [gamma]);

  // Analytical solution
  const v1Star = parseFloat((2 / (1 - gamma * gamma)).toFixed(3));
  const v2Star = parseFloat((2 * gamma / (1 - gamma * gamma)).toFixed(3));

  return (
    <div className="my-6 p-4 rounded-lg bg-card/60 border border-border/30 space-y-4">
      <h4 className="text-sm font-semibold text-foreground">
        Сходимость итерации ценности (MDP: 2 состояния)
      </h4>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">
          <Math display={false}>{String.raw`\enfPar{\gamma} =`}</Math> <span className="font-mono text-foreground">{gamma.toFixed(2)}</span>
          <span className="ml-2 text-xs opacity-60">
            <Math display={false}>{String.raw`\enfOp{V}^{*}(\enfVar{S}_{1}) \approx`}</Math> {v1Star}, <Math display={false}>{String.raw`\enfOp{V}^{*}(\enfVar{S}_{2}) \approx`}</Math> {v2Star}
          </span>
        </label>
        <Slider
          min={10}
          max={99}
          step={1}
          value={[gamma * 100]}
          onValueChange={([v]) => setGamma(v / 100)}
          className="w-full max-w-sm"
        />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="k"
            label={{ value: "Итерация k", position: "insideBottomRight", offset: -5, style: { fill: "hsl(var(--muted-foreground))", fontSize: 11 } }}
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 10 }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="stepAfter" dataKey="V1" name="V(S₁)" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} animationDuration={400} />
          <Line type="stepAfter" dataKey="V2" name="V(S₂)" stroke="hsl(var(--secondary))" strokeWidth={2} dot={false} animationDuration={400} />
          <ReferenceLine y={v1Star} stroke="hsl(var(--primary))" strokeDasharray="6 3" opacity={0.5} label={{ value: `V*₁=${v1Star}`, position: "right", style: { fill: "hsl(var(--primary))", fontSize: 10 } }} />
          <ReferenceLine y={v2Star} stroke="hsl(var(--secondary))" strokeDasharray="6 3" opacity={0.5} label={{ value: `V*₂=${v2Star}`, position: "right", style: { fill: "hsl(var(--secondary))", fontSize: 10 } }} />
        </LineChart>
      </ResponsiveContainer>

      <p className="text-xs text-muted-foreground">
        Перемещайте слайдер <Math display={false}>{String.raw`\enfPar{\gamma}`}</Math> и наблюдайте за скоростью сходимости. При <Math display={false}>{String.raw`\enfPar{\gamma}`}</Math> ближе к 1 — больше осцилляций и медленнее сходимость. Пунктирные линии — аналитическое решение.
      </p>
    </div>
  );
};

/* ─── 3. Discount Factor Impact ─── */

export const DiscountImpactChart = () => {
  const data = useMemo(() => {
    const gammas = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 0.99];
    return gammas.map((g) => ({
      gamma: g.toString(),
      horizon: g < 1 ? parseFloat((1 / (1 - g)).toFixed(1)) : Infinity,
      sum: g < 1 ? parseFloat((1 / (1 - g)).toFixed(1)) : NaN,
    }));
  }, []);

  return (
    <div className="my-6 p-4 rounded-lg bg-card/60 border border-border/30 space-y-4">
      <h4 className="text-sm font-semibold text-foreground">
        Влияние <Math display={false}>{String.raw`\enfPar{\gamma}`}</Math> на эффективный горизонт <Math display={false}>{String.raw`(1/(1-\enfPar{\gamma}))`}</Math>
      </h4>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="gamma"
            label={{ value: "γ", position: "insideBottomRight", offset: -5, style: { fill: "hsl(var(--muted-foreground))", fontSize: 11 } }}
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 10 }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 10 }}
            domain={[0, 110]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value: number) => [`${value} шагов`, "Горизонт"]}
          />
          <Line type="monotone" dataKey="horizon" name="Эффективный горизонт" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(var(--accent))" }} />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-muted-foreground">
        При <Math display={false}>{String.raw`\enfPar{\gamma} \to 1`}</Math> горизонт планирования растёт экспоненциально. На практике <Math display={false}>{String.raw`\enfPar{\gamma} = 0{,}99`}</Math> даёт агенту «память» на ~100 шагов.
      </p>
    </div>
  );
};