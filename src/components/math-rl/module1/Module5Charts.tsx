import React, { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar, Cell,
  ReferenceLine,
} from "recharts";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MathTex from "@/components/Math";

/* ─── 1. MDP Tree Visualization ─── */
export const MDPTreeViz = () => {
  const [gamma, setGamma] = useState(0.9);

  const nodes = useMemo(() => {
    // Simple 2-state MDP: S1 → S2 (r=+2), S2 → S1 (r=0)
    const iterations = 8;
    const data: { step: number; V1: number; V2: number }[] = [];
    let v1 = 0, v2 = 0;
    data.push({ step: 0, V1: 0, V2: 0 });
    for (let i = 1; i <= iterations; i++) {
      const nv1 = 2 + gamma * v2;
      const nv2 = 0 + gamma * v1;
      v1 = nv1; v2 = nv2;
      data.push({ step: i, V1: parseFloat(v1.toFixed(3)), V2: parseFloat(v2.toFixed(3)) });
    }
    return data;
  }, [gamma]);

  const trueV1 = parseFloat((2 / (1 - gamma * gamma)).toFixed(2));
  const trueV2 = parseFloat((2 * gamma / (1 - gamma * gamma)).toFixed(2));

  return (
    <div className="my-8 p-5 rounded-xl border border-border/50 bg-card/30">
      <h4 className="text-lg font-semibold text-foreground mb-1">🌳 Визуализация MDP: сходимость Value Iteration</h4>
      <p className="text-sm text-muted-foreground mb-4">
        Два состояния: <MathTex display={false}>{String.raw`\enfVar{S}_{1}\to \enfVar{S}_{2}`}</MathTex> (награда +2), <MathTex display={false}>{String.raw`\enfVar{S}_{2}\to \enfVar{S}_{1}`}</MathTex> (награда 0). Наблюдайте, как значения сходятся к аналитическому решению.
      </p>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm text-muted-foreground whitespace-nowrap"><MathTex display={false}>{String.raw`\enfPar{\gamma} =`}</MathTex> {gamma.toFixed(2)}</span>
        <Slider
          min={0} max={99} step={1}
          value={[gamma * 100]}
          onValueChange={([v]) => setGamma(v / 100)}
          className="max-w-xs"
        />
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={nodes} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="step" label={{ value: "Итерация", position: "insideBottom", offset: -2, style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 } }} stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            <Legend />
            <ReferenceLine y={trueV1} stroke="hsl(var(--primary))" strokeDasharray="5 5" label={{ value: `V₁*=${trueV1}`, fill: "hsl(var(--primary))", fontSize: 11 }} />
            <ReferenceLine y={trueV2} stroke="hsl(var(--secondary))" strokeDasharray="5 5" label={{ value: `V₂*=${trueV2}`, fill: "hsl(var(--secondary))", fontSize: 11 }} />
            <Line type="monotone" dataKey="V1" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} name="V(S₁)" />
            <Line type="monotone" dataKey="V2" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 3 }} name="V(S₂)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ─── 2. TD Error Visualization ─── */
export const TDErrorViz = () => {
  const [alpha, setAlpha] = useState(0.1);
  const [gamma, setGamma] = useState(0.9);

  const data = useMemo(() => {
    // Simulated episode: agent walks through 5 states with known true values
    const trueV = [0, 4, 3, 2, 1, 0]; // terminal=0
    const rewards = [0, 0, 0, 0, 1]; // reward only at last step
    const steps = 30;
    const estimates = Array(6).fill(0);
    const result: { step: number; tdError: number; V2: number; V3: number }[] = [];

    for (let ep = 0; ep < steps; ep++) {
      // Walk: 0→1→2→3→4→5(terminal)
      for (let s = 0; s < 5; s++) {
        const r = rewards[s];
        const target = r + gamma * estimates[s + 1];
        const delta = target - estimates[s];
        estimates[s] += alpha * delta;
        if (s === 2) {
          result.push({
            step: ep,
            tdError: parseFloat(delta.toFixed(4)),
            V2: parseFloat(estimates[1].toFixed(4)),
            V3: parseFloat(estimates[2].toFixed(4)),
          });
        }
      }
    }
    return result;
  }, [alpha, gamma]);

  return (
    <div className="my-8 p-5 rounded-xl border border-border/50 bg-card/30">
      <h4 className="text-lg font-semibold text-foreground mb-1">⚡ Визуализация TD-ошибки</h4>
      <p className="text-sm text-muted-foreground mb-4">
        Агент проходит через 5 состояний. <MathTex display={false}>{String.raw`\enfVar{\delta} = \enfTgt{R} + \enfPar{\gamma} \enfOp{V}(\enfVar{S}') - \enfOp{V}(\enfVar{S})`}</MathTex> уменьшается по мере обучения.
      </p>
      <div className="flex flex-wrap gap-6 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground whitespace-nowrap"><MathTex display={false}>{String.raw`\enfPar{\alpha} =`}</MathTex> {alpha.toFixed(2)}</span>
          <Slider min={1} max={50} step={1} value={[alpha * 100]} onValueChange={([v]) => setAlpha(v / 100)} className="w-36" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground whitespace-nowrap"><MathTex display={false}>{String.raw`\enfPar{\gamma} =`}</MathTex> {gamma.toFixed(2)}</span>
          <Slider min={0} max={99} step={1} value={[gamma * 100]} onValueChange={([v]) => setGamma(v / 100)} className="w-36" />
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="step" label={{ value: "Эпизод", position: "insideBottom", offset: -2, style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 } }} stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            <Legend />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
            <Line type="monotone" dataKey="tdError" stroke="hsl(var(--destructive, 0 84% 60%))" strokeWidth={2} dot={false} name="TD-ошибка δ" />
            <Line type="monotone" dataKey="V2" stroke="hsl(var(--primary))" strokeWidth={1.5} dot={false} name="V(S₂)" />
            <Line type="monotone" dataKey="V3" stroke="hsl(var(--secondary))" strokeWidth={1.5} dot={false} name="V(S₃)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ─── 3. SARSA vs Q-learning Comparison ─── */
export const SarsaVsQLearningViz = () => {
  const [epsilon, setEpsilon] = useState(0.1);
  const [alpha] = useState(0.1);
  const [gamma] = useState(0.9);

  const data = useMemo(() => {
    // Cliff-walking inspired: 1D grid with cliff
    // States: 0(start) 1 2 3(cliff,-100) 4(goal,+10)
    const nStates = 5;
    const nActions = 2; // 0=stay/left, 1=right
    const episodes = 60;

    const initQ = () => {
      const q: number[][] = [];
      for (let s = 0; s < nStates; s++) q.push([0, 0]);
      return q;
    };

    const step = (s: number, a: number) => {
      if (a === 1) {
        const ns = Math.min(s + 1, nStates - 1);
        if (ns === 3) return { ns: 0, r: -100 }; // cliff
        if (ns === 4) return { ns: 4, r: 10 }; // goal
        return { ns, r: -1 };
      }
      return { ns: Math.max(s - 1, 0), r: -1 };
    };

    const epsGreedy = (q: number[], eps: number) =>
      Math.random() < eps ? Math.floor(Math.random() * nActions) : (q[0] >= q[1] ? 0 : 1);

    const qSarsa = initQ();
    const qQL = initQ();
    const result: { episode: number; sarsa: number; qlearning: number }[] = [];

    for (let ep = 0; ep < episodes; ep++) {
      let sS = 0, sQ = 0;
      let aS = epsGreedy(qSarsa[sS], epsilon);
      let totalS = 0, totalQ = 0;

      for (let t = 0; t < 50; t++) {
        // SARSA
        if (sS !== 4) {
          const { ns: nsS, r: rS } = step(sS, aS);
          const naS = epsGreedy(qSarsa[nsS], epsilon);
          qSarsa[sS][aS] += alpha * (rS + gamma * qSarsa[nsS][naS] - qSarsa[sS][aS]);
          totalS += rS;
          sS = nsS; aS = naS;
        }
        // Q-learning
        if (sQ !== 4) {
          const aQ = epsGreedy(qQL[sQ], epsilon);
          const { ns: nsQ, r: rQ } = step(sQ, aQ);
          qQL[sQ][aQ] += alpha * (rQ + gamma * Math.max(...qQL[nsQ]) - qQL[sQ][aQ]);
          totalQ += rQ;
          sQ = nsQ;
        }
      }
      result.push({ episode: ep + 1, sarsa: totalS, qlearning: totalQ });
    }
    return result;
  }, [epsilon, alpha, gamma]);

  return (
    <div className="my-8 p-5 rounded-xl border border-border/50 bg-card/30">
      <h4 className="text-lg font-semibold text-foreground mb-1">🏁 SARSA vs Q-learning: Cliff Walking</h4>
      <p className="text-sm text-muted-foreground mb-4">
        Стохастический мини-мир с «обрывом». SARSA (on-policy) учится безопасному пути, Q-learning (off-policy) — оптимальному, но рискованному.
      </p>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm text-muted-foreground whitespace-nowrap"><MathTex display={false}>{String.raw`\enfPar{\varepsilon} =`}</MathTex> {epsilon.toFixed(2)}</span>
        <Slider min={0} max={50} step={1} value={[epsilon * 100]} onValueChange={([v]) => setEpsilon(v / 100)} className="max-w-xs" />
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="episode" label={{ value: "Эпизод", position: "insideBottom", offset: -2, style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 } }} stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: "Награда", angle: -90, position: "insideLeft", style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 } }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
            <Legend />
            <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
            <Line type="monotone" dataKey="sarsa" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="SARSA (on-policy)" />
            <Line type="monotone" dataKey="qlearning" stroke="hsl(var(--secondary))" strokeWidth={2} dot={false} name="Q-learning (off-policy)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
