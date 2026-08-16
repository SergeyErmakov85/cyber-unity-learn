import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Math from "@/components/Math";

const RAW_LOGITS = [2.0, 1.0, 0.5, 0.3];
const ACTIONS = ["Вверх", "Вниз", "Влево", "Вправо"];

const PolicyGradientViz = () => {
  const [temperature, setTemperature] = useState(1.0);

  const probs = useMemo(() => {
    const exps = RAW_LOGITS.map(l => window.Math.exp(l / temperature));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sum);
  }, [temperature]);

  const maxProb = window.Math.max(...probs);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Policy Gradient: Распределение действий</h2>
      <p className="text-muted-foreground text-sm">
        Визуализация softmax-распределения вероятностей действий. Температура контролирует «уверенность» политики.
      </p>

      <Math>{"\\pi(a \\mid \\enfVar{s}) = \\frac{e^{Q(s,a) / \\tau}}{\\sum_{a'} e^{Q(s,a') / \\tau}}"}</Math>

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>τ (температура)</span>
          <span className="text-primary font-mono">{temperature.toFixed(2)}</span>
        </div>
        <Slider value={[temperature]} onValueChange={([v]) => setTemperature(v)} min={0.1} max={5} step={0.05} />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Детерминированная</span>
          <span>Случайная</span>
        </div>
      </div>

      <div className="space-y-3">
        {ACTIONS.map((action, i) => (
          <div key={action} className="flex items-center gap-3">
            <span className="w-16 text-sm text-muted-foreground">{action}</span>
            <div className="flex-1 h-8 bg-muted/30 rounded-md overflow-hidden relative">
              <div
                className="h-full rounded-md transition-all duration-300"
                style={{
                  width: `${(probs[i] / maxProb) * 100}%`,
                  backgroundColor: `hsl(${180 + i * 40} 80% 50%)`,
                }}
              />
            </div>
            <span className="w-16 text-right text-sm font-mono">{(probs[i] * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PPOClippingViz = () => {
  const [epsilon, setEpsilon] = useState(0.2);
  const [advantage, setAdvantage] = useState(1.0);

  const ratioRange = useMemo(() => {
    const points: { ratio: number; clipped: number; unclipped: number; final: number }[] = [];
    for (let r = 0; r <= 3; r += 0.05) {
      const unclipped = r * advantage;
      const clippedR = window.Math.max(1 - epsilon, window.Math.min(1 + epsilon, r));
      const clipped = clippedR * advantage;
      const final_ = advantage >= 0
        ? window.Math.min(unclipped, clipped)
        : window.Math.max(unclipped, clipped);
      points.push({ ratio: r, unclipped, clipped, final: final_ });
    }
    return points;
  }, [epsilon, advantage]);

  const maxVal = window.Math.max(...ratioRange.map(p => window.Math.max(window.Math.abs(p.unclipped), window.Math.abs(p.clipped))));
  const chartH = 200;
  const chartW = 100; // percentage

  const toY = (val: number) => {
    const normalized = val / (maxVal || 1);
    return chartH / 2 - normalized * (chartH / 2 - 10);
  };
  const toX = (ratio: number) => (ratio / 3) * 100;

  const pathFromPoints = (key: "unclipped" | "final") =>
    ratioRange.map((p, i) => `${i === 0 ? "M" : "L"} ${toX(p.ratio)} ${toY(p[key])}`).join(" ");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-accent">PPO Clipping Objective</h2>
      <p className="text-muted-foreground text-sm">
        Визуализация функции потерь PPO: clip ограничивает размер обновления политики.
      </p>

      <Math>{"L^{CLIP}(\\enfPar{\\theta}) = \\mathbb{E}\\left[\\min\\left(\\enfTgt{r}_t(\\enfPar{\\theta})\\hat{A}_t,\\; \\text{clip}(\\enfTgt{r}_t(\\enfPar{\\theta}), 1-\\enfPar{\\varepsilon}, 1+\\enfPar{\\varepsilon})\\hat{A}_t\\right)\\right]"}</Math>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>ε (clip range)</span>
            <span className="text-primary font-mono">{epsilon.toFixed(2)}</span>
          </div>
          <Slider value={[epsilon]} onValueChange={([v]) => setEpsilon(v)} min={0.05} max={0.5} step={0.01} />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Â (advantage)</span>
            <span className="text-primary font-mono">{advantage.toFixed(1)}</span>
          </div>
          <Slider value={[advantage]} onValueChange={([v]) => setAdvantage(v)} min={-2} max={2} step={0.1} />
        </div>
      </div>

      {/* Simple chart */}
      <Card className="border-primary/30">
        <CardContent className="p-4">
          <svg viewBox={`0 0 100 ${chartH}`} className="w-full" preserveAspectRatio="none" style={{ height: 200 }}>
            {/* Zero line */}
            <line x1="0" y1={toY(0)} x2="100%" y2={toY(0)} stroke="hsl(230 15% 30%)" strokeWidth="0.3" />
            {/* Clip bounds */}
            <line x1={`${toX(1 - epsilon)}%`} y1="0" x2={`${toX(1 - epsilon)}%`} y2={chartH} stroke="hsl(320 100% 60%)" strokeWidth="0.3" strokeDasharray="2" />
            <line x1={`${toX(1 + epsilon)}%`} y1="0" x2={`${toX(1 + epsilon)}%`} y2={chartH} stroke="hsl(320 100% 60%)" strokeWidth="0.3" strokeDasharray="2" />
            {/* r=1 line */}
            <line x1={`${toX(1)}%`} y1="0" x2={`${toX(1)}%`} y2={chartH} stroke="hsl(230 15% 40%)" strokeWidth="0.2" strokeDasharray="1" />
            {/* Unclipped */}
            <path d={pathFromPoints("unclipped")} fill="none" stroke="hsl(180 100% 50%)" strokeWidth="0.5" opacity={0.4} />
            {/* Clipped (final) */}
            <path d={pathFromPoints("final")} fill="none" stroke="hsl(180 100% 50%)" strokeWidth="1" />
          </svg>
          <div className="flex items-center justify-center gap-6 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-primary/40 inline-block" /> r·Â (без clip)</span>
            <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-primary inline-block" /> L^CLIP (итог)</span>
            <span className="flex items-center gap-1"><span className="w-4 h-px border-t border-dashed border-accent inline-block" /> 1±ε</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Visualizations = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> На главную
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-neon bg-clip-text text-transparent">
          Визуализации RL
        </h1>
        <p className="text-muted-foreground mb-8">
          Интерактивные визуализации для понимания ключевых концепций Reinforcement Learning.
        </p>

        <Tabs defaultValue="policy" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="policy">Policy Gradient</TabsTrigger>
            <TabsTrigger value="ppo">PPO Clipping</TabsTrigger>
            <TabsTrigger value="qlearning" onClick={() => navigate("/visualizations/q-learning")}>Q-Learning</TabsTrigger>
          </TabsList>

          <TabsContent value="policy"><PolicyGradientViz /></TabsContent>
          <TabsContent value="ppo"><PPOClippingViz /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Visualizations;
