import { useState, useCallback } from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import MathTex from "@/components/Math";

const f = (x: number) => x * x - 4 * x + 5;
const grad = (x: number) => 2 * x - 4;
const X_OPT = 2.0;

const CHART_W = 400;
const CHART_H = 260;
const X_MIN = -1;
const X_MAX = 5;
const Y_MIN = 0;
const Y_MAX = 12;

const toSvgX = (x: number) => ((x - X_MIN) / (X_MAX - X_MIN)) * CHART_W;
const toSvgY = (y: number) => CHART_H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * CHART_H;

const CURVE_PATH = (() => {
  const pts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = X_MIN + (i / 200) * (X_MAX - X_MIN);
    const y = f(x);
    const clampedY = Math.max(Y_MIN, Math.min(Y_MAX, y));
    pts.push(`${toSvgX(x).toFixed(1)},${toSvgY(clampedY).toFixed(1)}`);
  }
  return pts.join(" ");
})();

interface Step {
  x: number;
  fx: number;
  g: number;
}

const GradientDescentPlayground = () => {
  const [alpha, setAlpha] = useState(0.1);
  const [x0, setX0] = useState(0.0);
  const [currentX, setCurrentX] = useState(0.0);
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState<Step[]>([{ x: 0, fx: f(0), g: grad(0) }]);

  const doStep = useCallback(() => {
    setCurrentX((prev) => {
      const g = grad(prev);
      const next = prev - alpha * g;
      setStep((s) => s + 1);
      setHistory((h) => [...h, { x: next, fx: f(next), g: grad(next) }]);
      return next;
    });
  }, [alpha]);

  const doMultiStep = useCallback(() => {
    let x = currentX;
    const newSteps: Step[] = [];
    for (let i = 0; i < 10; i++) {
      const g = grad(x);
      x = x - alpha * g;
      newSteps.push({ x, fx: f(x), g: grad(x) });
    }
    setCurrentX(x);
    setStep((s) => s + 10);
    setHistory((h) => [...h, ...newSteps]);
  }, [alpha, currentX]);

  const reset = useCallback(() => {
    setCurrentX(x0);
    setStep(0);
    setHistory([{ x: x0, fx: f(x0), g: grad(x0) }]);
  }, [x0]);

  const error = Math.abs(currentX - X_OPT);
  const diverged = Math.abs(currentX) > 8;
  const converged = error < 0.01;

  return (
    <div className="my-10 rounded-xl border border-primary/30 bg-card/40 overflow-hidden">
      <div className="flex items-center gap-2 p-4 border-b border-border/30 bg-primary/5">
        <Zap className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Градиентный спуск — живая демонстрация</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        {/* SVG Chart */}
        <div className="bg-background/50 rounded-lg p-3">
          <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="w-full h-auto">
            {/* Grid */}
            {[0, 2, 4, 6, 8, 10, 12].map((y) => (
              <line key={`gy${y}`} x1={0} y1={toSvgY(y)} x2={CHART_W} y2={toSvgY(y)} stroke="hsl(var(--border))" strokeWidth={0.5} opacity={0.3} />
            ))}
            {[-1, 0, 1, 2, 3, 4, 5].map((x) => (
              <line key={`gx${x}`} x1={toSvgX(x)} y1={0} x2={toSvgX(x)} y2={CHART_H} stroke="hsl(var(--border))" strokeWidth={0.5} opacity={0.3} />
            ))}

            {/* x* = 2 vertical */}
            <line x1={toSvgX(2)} y1={0} x2={toSvgX(2)} y2={CHART_H} stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />
            <text x={toSvgX(2) + 4} y={14} fill="hsl(var(--muted-foreground))" fontSize={10}>x*=2</text>

            {/* Curve */}
            <polyline points={CURVE_PATH} fill="none" stroke="hsl(var(--primary))" strokeWidth={2} />

            {/* Tangent line */}
            {!diverged && (() => {
              const g = grad(currentX);
              const cx = currentX;
              const cy = f(cx);
              const dx = 0.8;
              const x1t = cx - dx;
              const x2t = cx + dx;
              const y1t = cy - g * dx;
              const y2t = cy + g * dx;
              return (
                <line
                  x1={toSvgX(x1t)} y1={toSvgY(Math.max(Y_MIN, Math.min(Y_MAX, y1t)))}
                  x2={toSvgX(x2t)} y2={toSvgY(Math.max(Y_MIN, Math.min(Y_MAX, y2t)))}
                  stroke="hsl(var(--secondary))" strokeWidth={1.5} opacity={0.7}
                />
              );
            })()}

            {/* Current point */}
            {!diverged && (
              <circle
                cx={toSvgX(currentX)}
                cy={toSvgY(Math.max(Y_MIN, Math.min(Y_MAX, f(currentX))))}
                r={6}
                fill="hsl(var(--destructive, 0 84% 60%))"
                stroke="white"
                strokeWidth={1.5}
                style={{ transition: "cx 0.3s, cy 0.3s" }}
              />
            )}

            {/* Axis labels */}
            <text x={CHART_W / 2} y={CHART_H - 2} fill="hsl(var(--muted-foreground))" fontSize={10} textAnchor="middle">x</text>
            <text x={4} y={12} fill="hsl(var(--muted-foreground))" fontSize={10}>f(x)</text>
          </svg>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Learning Rate <MathTex display={false}>{String.raw`\enfPar{\alpha}`}</MathTex>: {alpha.toFixed(2)}</label>
            <Slider min={1} max={150} step={1} value={[alpha * 100]} onValueChange={([v]) => setAlpha(v / 100)} className="mt-1" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase">Нач. точка <MathTex display={false}>{String.raw`\enfVar{x}_{0}`}</MathTex>: {x0.toFixed(1)}</label>
            <Slider min={-20} max={60} step={1} value={[x0 * 10]} onValueChange={([v]) => { setX0(v / 10); }} className="mt-1" />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button size="sm" onClick={doStep} disabled={diverged}>▶ Шаг</Button>
            <Button size="sm" variant="outline" onClick={doMultiStep} disabled={diverged}>⏩ 10 шагов</Button>
            <Button size="sm" variant="ghost" onClick={reset}>🔄 Сброс</Button>
          </div>

          <div className="text-sm space-y-1 font-mono bg-background/50 rounded p-3">
            <p className="text-muted-foreground">Шаг t: <span className="text-foreground">{step}</span></p>
            <p className="text-muted-foreground">x = <span className="text-foreground">{currentX.toFixed(4)}</span></p>
            <p className="text-muted-foreground">f(x) = <span className="text-foreground">{f(currentX).toFixed(4)}</span></p>
            <p className="text-muted-foreground">f'(x) = <span className="text-foreground">{grad(currentX).toFixed(4)}</span></p>
            <p className="text-muted-foreground">|x − x*| = <span className="text-foreground">{error.toFixed(4)}</span></p>
          </div>

          {/* Warnings */}
          {alpha > 1.0 && (
            <p className="text-sm text-destructive">⚠️ Слишком большой learning rate — возможна расходимость!</p>
          )}
          {diverged && (
            <p className="text-sm text-destructive">❌ Расходимость! Уменьши <MathTex display={false}>{String.raw`\enfPar{\alpha}`}</MathTex> и нажми Сброс.</p>
          )}
          {converged && !diverged && (
            <p className="text-sm text-primary">✅ Сошёлся к минимуму x* = 2! 🎉</p>
          )}

          {/* Last 5 steps */}
          {history.length > 1 && (
            <div className="overflow-x-auto">
              <table className="text-xs w-full border border-border/30 rounded">
                <thead>
                  <tr className="bg-card/60">
                    <th className="p-1.5 text-foreground">t</th>
                    <th className="p-1.5 text-foreground">x</th>
                    <th className="p-1.5 text-foreground">f(x)</th>
                    <th className="p-1.5 text-foreground">f'(x)</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground font-mono">
                  {history.slice(-5).map((s, i) => (
                    <tr key={i} className="border-t border-border/20">
                      <td className="p-1.5">{history.length - 5 + i < 0 ? 0 : history.length - 5 + i}</td>
                      <td className="p-1.5">{s.x.toFixed(3)}</td>
                      <td className="p-1.5">{s.fx.toFixed(3)}</td>
                      <td className="p-1.5">{s.g.toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradientDescentPlayground;
