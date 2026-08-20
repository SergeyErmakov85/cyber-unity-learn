import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Play, Pause, RotateCcw, Zap } from "lucide-react";
import LabPracticeSection from "@/components/LabPracticeSection";

const GRID_SIZE = 5;
const ACTIONS = ["up", "down", "left", "right"] as const;
type Action = typeof ACTIONS[number];

const GOAL = { x: 4, y: 4 };
const TRAPS = [{ x: 1, y: 2 }, { x: 3, y: 1 }, { x: 2, y: 3 }];
const BONUSES = [{ x: 2, y: 0 }, { x: 0, y: 4 }];

type QTable = Record<string, Record<Action, number>>;

const stateKey = (x: number, y: number) => `${x},${y}`;

const initQTable = (): QTable => {
  const q: QTable = {};
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      q[stateKey(x, y)] = { up: 0, down: 0, left: 0, right: 0 };
    }
  }
  return q;
};

const getNextPos = (x: number, y: number, action: Action) => {
  switch (action) {
    case "up": return { x, y: Math.max(0, y - 1) };
    case "down": return { x, y: Math.min(GRID_SIZE - 1, y + 1) };
    case "left": return { x: Math.max(0, x - 1), y };
    case "right": return { x: Math.min(GRID_SIZE - 1, x + 1), y };
  }
};

const getReward = (x: number, y: number) => {
  if (x === GOAL.x && y === GOAL.y) return 10;
  if (TRAPS.some(t => t.x === x && t.y === y)) return -10;
  if (BONUSES.some(b => b.x === x && b.y === y)) return 5;
  return -1;
};

const maxQ = (q: QTable, x: number, y: number) => {
  const vals = Object.values(q[stateKey(x, y)]);
  return Math.max(...vals);
};

const argmaxAction = (q: QTable, x: number, y: number): Action => {
  const entry = q[stateKey(x, y)];
  let best: Action = "up";
  let bestVal = -Infinity;
  for (const a of ACTIONS) {
    if (entry[a] > bestVal) { bestVal = entry[a]; best = a; }
  }
  return best;
};

const QLearningViz = () => {
  const navigate = useNavigate();
  const [alpha, setAlpha] = useState(0.1);
  const [epsilon, setEpsilon] = useState(0.3);
  const [gamma, setGamma] = useState(0.95);
  const [qTable, setQTable] = useState<QTable>(initQTable);
  const [agentPos, setAgentPos] = useState({ x: 0, y: 0 });
  const [episode, setEpisode] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const [totalReward, setTotalReward] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(200);
  const intervalRef = useRef<number | null>(null);

  const step = useCallback(() => {
    setQTable(prev => {
      const q = JSON.parse(JSON.stringify(prev)) as QTable;
      setAgentPos(pos => {
        const action = Math.random() < epsilon
          ? ACTIONS[Math.floor(Math.random() * 4)]
          : argmaxAction(q, pos.x, pos.y);

        const next = getNextPos(pos.x, pos.y, action);
        const reward = getReward(next.x, next.y);
        const oldQ = q[stateKey(pos.x, pos.y)][action];
        q[stateKey(pos.x, pos.y)][action] = oldQ + alpha * (reward + gamma * maxQ(q, next.x, next.y) - oldQ);

        setTotalReward(r => r + reward);
        setStepCount(s => s + 1);

        if ((next.x === GOAL.x && next.y === GOAL.y) || TRAPS.some(t => t.x === next.x && t.y === next.y)) {
          setEpisode(e => e + 1);
          return { x: 0, y: 0 };
        }
        return next;
      });
      return q;
    });
  }, [alpha, epsilon, gamma]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(step, speed);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, step, speed]);

  const reset = () => {
    setIsRunning(false);
    setQTable(initQTable());
    setAgentPos({ x: 0, y: 0 });
    setEpisode(0);
    setStepCount(0);
    setTotalReward(0);
  };

  const getHeatColor = (x: number, y: number) => {
    const val = maxQ(qTable, x, y);
    if (val === 0) return "bg-muted/50";
    if (val > 0) {
      const intensity = Math.min(val / 10, 1);
      return `bg-primary/${Math.round(10 + intensity * 50)}`;
    }
    const intensity = Math.min(Math.abs(val) / 10, 1);
    return `bg-destructive/${Math.round(10 + intensity * 50)}`;
  };

  const getCellStyle = (x: number, y: number): React.CSSProperties => {
    const val = maxQ(qTable, x, y);
    if (val === 0) return {};
    if (val > 0) {
      const intensity = Math.min(val / 10, 1);
      return { backgroundColor: `hsl(180 100% 50% / ${0.1 + intensity * 0.5})` };
    }
    const intensity = Math.min(Math.abs(val) / 10, 1);
    return { backgroundColor: `hsl(0 84% 60% / ${0.1 + intensity * 0.5})` };
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> На главную
        </Button>

        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-neon bg-clip-text text-transparent">
          Интерактивная визуализация Q-Learning
        </h1>
        <p className="text-muted-foreground mb-8">
          Наблюдайте, как агент обучается находить путь к цели, избегая ловушек. Настраивайте гиперпараметры в реальном времени.
        </p>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Grid */}
          <div className="lg:col-span-2">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" /> Среда GridWorld
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-1 mx-auto" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, maxWidth: 400 }}>
                  {Array.from({ length: GRID_SIZE }).map((_, y) =>
                    Array.from({ length: GRID_SIZE }).map((_, x) => {
                      const isAgent = agentPos.x === x && agentPos.y === y;
                      const isGoal = x === GOAL.x && y === GOAL.y;
                      const isTrap = TRAPS.some(t => t.x === x && t.y === y);
                      const isBonus = BONUSES.some(b => b.x === x && b.y === y);

                      return (
                        <div
                          key={`${x}-${y}`}
                          className={`aspect-square rounded-md border border-border/50 flex items-center justify-center text-lg font-bold relative transition-all duration-200 ${
                            isAgent ? "ring-2 ring-primary shadow-glow-cyan" : ""
                          }`}
                          style={getCellStyle(x, y)}
                        >
                          {isAgent && "🤖"}
                          {isGoal && !isAgent && "⭐"}
                          {isTrap && !isAgent && "💀"}
                          {isBonus && !isAgent && "💎"}
                          <span className="absolute bottom-0.5 right-1 text-[9px] text-muted-foreground">
                            {maxQ(qTable, x, y).toFixed(1)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
                  <span>🤖 Агент</span>
                  <span>⭐ Цель (+10)</span>
                  <span>💀 Ловушка (-10)</span>
                  <span>💎 Бонус (+5)</span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3 mt-6">
                  <Button onClick={() => setIsRunning(!isRunning)} variant={isRunning ? "destructive" : "default"}>
                    {isRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                    {isRunning ? "Пауза" : "Старт"}
                  </Button>
                  <Button onClick={step} variant="outline" disabled={isRunning}>Шаг</Button>
                  <Button onClick={reset} variant="outline"><RotateCcw className="w-4 h-4 mr-1" /> Сброс</Button>
                </div>

                <div className="flex items-center justify-center gap-3 mt-3">
                  <span className="text-xs text-muted-foreground">Скорость:</span>
                  {[500, 200, 50].map(s => (
                    <Button key={s} size="sm" variant={speed === s ? "default" : "outline"} onClick={() => setSpeed(s)}>
                      {s === 500 ? "×1" : s === 200 ? "×3" : "×10"}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Controls Panel */}
          <div className="space-y-4">
            <Card className="border-primary/30">
              <CardHeader><CardTitle className="text-sm">Гиперпараметры</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>α (learning rate)</span><span className="text-primary font-mono">{alpha.toFixed(2)}</span>
                  </div>
                  <Slider value={[alpha]} onValueChange={([v]) => setAlpha(v)} min={0.01} max={1} step={0.01} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>ε (exploration)</span><span className="text-primary font-mono">{epsilon.toFixed(2)}</span>
                  </div>
                  <Slider value={[epsilon]} onValueChange={([v]) => setEpsilon(v)} min={0} max={1} step={0.01} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>γ (discount)</span><span className="text-primary font-mono">{gamma.toFixed(2)}</span>
                  </div>
                  <Slider value={[gamma]} onValueChange={([v]) => setGamma(v)} min={0} max={1} step={0.01} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/30">
              <CardHeader><CardTitle className="text-sm">Статистика</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Эпизод</span><span className="font-mono text-primary">{episode}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Шагов</span><span className="font-mono">{stepCount}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Суммарная награда</span><span className="font-mono">{totalReward.toFixed(1)}</span></div>
              </CardContent>
            </Card>

            <Card className="border-primary/30">
              <CardHeader><CardTitle className="text-sm">Q-Learning формула</CardTitle></CardHeader>
              <CardContent>
                <div className="p-3 bg-card/80 rounded-lg border border-primary/20 text-xs font-mono leading-relaxed">
                  Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') - Q(s,a)]
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Тепловая карта показывает максимальное Q-значение для каждой клетки. Синий = высокое, красный = низкое.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Практика: собранная среда лаборатории для этой темы. */}
        <LabPracticeSection contextKey="/visualizations/q-learning" />
      </div>
    </div>
  );
};

export default QLearningViz;
