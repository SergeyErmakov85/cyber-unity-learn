import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Button } from "@/components/ui/button";

const CLIP_EPS = 0.2;

const buildData = (advantage: number) => {
  const data: { r: number; surr1: number; clipped: number; lclip: number }[] = [];
  for (let r = 0; r <= 2.001; r += 0.02) {
    const surr1 = r * advantage;
    const clipped = Math.min(Math.max(r, 1 - CLIP_EPS), 1 + CLIP_EPS) * advantage;
    const lclip = Math.min(surr1, clipped);
    data.push({
      r: Math.round(r * 100) / 100,
      surr1: Math.round(surr1 * 1000) / 1000,
      clipped: Math.round(clipped * 1000) / 1000,
      lclip: Math.round(lclip * 1000) / 1000,
    });
  }
  return data;
};

const PPOClipChart = () => {
  const [adv, setAdv] = useState(1);
  const data = useMemo(() => buildData(adv), [adv]);

  return (
    <div className="my-6 p-4 md:p-6 rounded-xl border border-primary/30 bg-card/60 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h4 className="font-bold text-foreground">Визуализация PPO Clipping</h4>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={adv > 0 ? "default" : "outline"}
            onClick={() => setAdv(1)}
          >
            A &gt; 0
          </Button>
          <Button
            size="sm"
            variant={adv < 0 ? "default" : "outline"}
            onClick={() => setAdv(-1)}
          >
            A &lt; 0
          </Button>
        </div>
      </div>

      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="r"
              type="number"
              domain={[0, 2]}
              ticks={[0, 0.5, 0.8, 1, 1.2, 1.5, 2]}
              stroke="hsl(var(--muted-foreground))"
              label={{ value: "r_t(θ)", position: "insideBottom", offset: -8, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              domain={[-2.2, 2.2]}
              stroke="hsl(var(--muted-foreground))"
              label={{ value: "Surrogate", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--primary) / 0.4)",
                borderRadius: 8,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="surr1" name="r·A" stroke="hsl(var(--muted-foreground))" strokeDasharray="6 4" dot={false} />
            <Line type="monotone" dataKey="clipped" name="clip(r)·A" stroke="hsl(var(--secondary))" dot={false} />
            <Line type="monotone" dataKey="lclip" name="L^CLIP = min(...)" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm mt-4 text-muted-foreground text-center">
        {adv > 0 ? (
          <>
            Когда <strong className="text-foreground">A &gt; 0</strong>, рост вероятности обрезается на уровне <strong className="text-primary">1+ε = 1.2</strong>. Сеть больше не получает стимула «жадничать».
          </>
        ) : (
          <>
            Когда <strong className="text-foreground">A &lt; 0</strong>, падение вероятности обрезается на уровне <strong className="text-primary">1−ε = 0.8</strong> — нет смысла «добивать» уже непопулярное действие.
          </>
        )}
      </p>
    </div>
  );
};

export default PPOClipChart;
