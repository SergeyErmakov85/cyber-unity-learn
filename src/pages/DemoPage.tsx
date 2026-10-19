import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Play, Pause, RotateCcw, Rocket, HelpCircle, GraduationCap } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import SEOHead from "@/components/SEOHead";
import MathTex from "@/components/Math";

// --- Simulation types ---
interface Vec { x: number; y: number }
interface Obstacle { x: number; y: number; w: number; h: number }
interface EpisodeData { episode: number; reward: number }

const CANVAS_W = 600;
const CANVAS_H = 400;
const AGENT_R = 10;
const GOAL_R = 12;
const OBSTACLES: Obstacle[] = [
  { x: 180, y: 100, w: 40, h: 120 },
  { x: 320, y: 200, w: 50, h: 100 },
  { x: 440, y: 60, w: 40, h: 140 },
];
const GOAL: Vec = { x: 540, y: 60 };
const START: Vec = { x: 50, y: 340 };
const MAX_STEPS = 300;

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }

function collides(pos: Vec, obs: Obstacle[]) {
  return obs.some(o =>
    pos.x + AGENT_R > o.x && pos.x - AGENT_R < o.x + o.w &&
    pos.y + AGENT_R > o.y && pos.y - AGENT_R < o.y + o.h
  );
}

function dist(a: Vec, b: Vec) { return Math.hypot(a.x - b.x, a.y - b.y); }

// --- Demo Page ---
const DemoPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(false);
  const [episode, setEpisode] = useState(0);
  const [currentReward, setCurrentReward] = useState(0);
  const [history, setHistory] = useState<EpisodeData[]>([]);
  const [lr, setLr] = useState(0.01);
  const [epsilon, setEpsilon] = useState(1.0);
  const [gamma, setGamma] = useState(0.99);

  // Simulation refs
  const agentRef = useRef<Vec>({ ...START });
  const stepRef = useRef(0);
  const rewardRef = useRef(0);
  const episodeRef = useRef(0);
  const runningRef = useRef(false);
  const epsilonRef = useRef(1.0);
  const lrRef = useRef(0.01);
  const rafRef = useRef<number>(0);

  useEffect(() => { runningRef.current = running; }, [running]);
  useEffect(() => { lrRef.current = lr; }, [lr]);

  const drawFrame = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const w = CANVAS_W, h = CANVAS_H;
    ctx.clearRect(0, 0, w, h);

    // BG grid
    ctx.strokeStyle = "hsla(180,100%,50%,0.05)";
    for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    // Obstacles
    OBSTACLES.forEach(o => {
      ctx.fillStyle = "hsla(0,0%,100%,0.08)";
      ctx.strokeStyle = "hsla(0,84%,60%,0.5)";
      ctx.lineWidth = 1.5;
      ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.strokeRect(o.x, o.y, o.w, o.h);
    });

    // Goal
    ctx.save();
    ctx.translate(GOAL.x, GOAL.y);
    ctx.fillStyle = "hsla(50,100%,60%,0.9)";
    ctx.shadowColor = "hsla(50,100%,60%,0.6)";
    ctx.shadowBlur = 15;
    // Star shape
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const r = i === 0 ? GOAL_R : GOAL_R;
      ctx[i === 0 ? "moveTo" : "lineTo"](Math.cos(angle) * r, Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Agent
    const a = agentRef.current;
    ctx.beginPath();
    ctx.arc(a.x, a.y, AGENT_R, 0, Math.PI * 2);
    ctx.fillStyle = "hsla(180,100%,50%,0.9)";
    ctx.shadowColor = "hsla(180,100%,50%,0.7)";
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "hsla(180,100%,70%,0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, []);

  const resetEpisode = useCallback(() => {
    agentRef.current = { ...START };
    stepRef.current = 0;
    rewardRef.current = 0;
    setCurrentReward(0);
  }, []);

  const simulationStep = useCallback(() => {
    if (!runningRef.current) return;

    const ep = episodeRef.current;
    // Decay epsilon over episodes — faster with higher LR
    const currentEps = Math.max(0.05, 1.0 - ep * lrRef.current * 5);
    epsilonRef.current = currentEps;

    const a = agentRef.current;
    const speed = 4;

    // Direction towards goal with noise based on epsilon
    const dx = GOAL.x - a.x;
    const dy = GOAL.y - a.y;
    const d = Math.hypot(dx, dy) || 1;

    let moveX: number, moveY: number;
    if (Math.random() < currentEps) {
      // Random exploration
      const angle = Math.random() * Math.PI * 2;
      moveX = Math.cos(angle) * speed;
      moveY = Math.sin(angle) * speed;
    } else {
      // Exploit: move towards goal with slight noise
      const noise = (Math.random() - 0.5) * currentEps * 2;
      moveX = (dx / d) * speed + noise;
      moveY = (dy / d) * speed + noise;
    }

    const newPos = {
      x: clamp(a.x + moveX, AGENT_R, CANVAS_W - AGENT_R),
      y: clamp(a.y + moveY, AGENT_R, CANVAS_H - AGENT_R),
    };

    // Collision check
    if (collides(newPos, OBSTACLES)) {
      rewardRef.current -= 5;
    } else {
      agentRef.current = newPos;
    }

    // Step reward
    rewardRef.current -= 0.1;
    stepRef.current++;

    // Check goal
    const goalDist = dist(agentRef.current, GOAL);
    const reachedGoal = goalDist < AGENT_R + GOAL_R;
    if (reachedGoal) rewardRef.current += 100;

    setCurrentReward(Math.round(rewardRef.current));
    drawFrame();

    // Episode end
    if (reachedGoal || stepRef.current >= MAX_STEPS) {
      const finalReward = Math.round(rewardRef.current);
      episodeRef.current++;
      setEpisode(episodeRef.current);
      setHistory(prev => [...prev, { episode: episodeRef.current, reward: finalReward }]);
      resetEpisode();
    }

    rafRef.current = requestAnimationFrame(simulationStep);
  }, [drawFrame, resetEpisode]);

  const handleStart = () => {
    setRunning(true);
    rafRef.current = requestAnimationFrame(simulationStep);
  };

  const handlePause = () => {
    setRunning(false);
    cancelAnimationFrame(rafRef.current);
  };

  const handleReset = () => {
    handlePause();
    episodeRef.current = 0;
    setEpisode(0);
    setHistory([]);
    resetEpisode();
    drawFrame();
  };

  // Initial draw
  useEffect(() => {
    drawFrame();
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawFrame]);

  // Reset on param change
  useEffect(() => {
    handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lr, gamma]);

  const params = [
    {
      label: "Learning Rate",
      value: lr,
      min: 0.001,
      max: 0.05,
      step: 0.001,
      set: setLr,
      tip: "Скорость обучения. Высокий LR — быстрое обучение, но нестабильное. Низкий — медленное, но точное.",
    },
    {
      label: "Epsilon (exploration)",
      value: epsilon,
      min: 0.05,
      max: 1.0,
      step: 0.05,
      set: setEpsilon,
      tip: "Вероятность случайного действия. Начинается с 1.0 (полная случайность) и убывает по мере обучения.",
    },
    {
      label: "Gamma (discount)",
      value: gamma,
      min: 0.8,
      max: 0.999,
      step: 0.001,
      set: setGamma,
      tip: "Дисконт-фактор. Определяет, насколько агент ценит будущие награды относительно текущих.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Демо | Интерактивная симуляция обучения агента — RL Platform"
        description="Попробуйте обучение с подкреплением в реальном времени: 2D-симуляция агента, график reward и настройка параметров."
        path="/demo"
      />
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16 space-y-16">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Живая симуляция обучения
          </h1>
          <p className="text-muted-foreground">
            Наблюдайте, как агент учится достигать цели, избегая препятствий. Настройте параметры и увидьте результат.
          </p>
        </div>

        {/* Section 1 + 3: Canvas + Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Canvas */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-primary/20 overflow-hidden bg-[hsl(230,30%,5%)] p-1">
              <canvas
                ref={canvasRef}
                width={CANVAS_W}
                height={CANVAS_H}
                className="w-full rounded-lg"
                style={{ imageRendering: "auto" }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {!running ? (
                <Button onClick={handleStart} className="bg-gradient-neon gap-2">
                  <Play className="w-4 h-4" /> Старт обучения
                </Button>
              ) : (
                <Button onClick={handlePause} variant="outline" className="gap-2">
                  <Pause className="w-4 h-4" /> Пауза
                </Button>
              )}
              <Button onClick={handleReset} variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" /> Сброс
              </Button>
              <div className="flex gap-4 ml-auto text-sm">
                <span className="text-muted-foreground">Эпизод: <span className="text-foreground font-semibold">{episode}</span></span>
                <span className="text-muted-foreground">Reward: <span className={`font-semibold ${currentReward >= 0 ? "text-green-400" : "text-destructive"}`}>{currentReward}</span></span>
                <span className="text-muted-foreground"><MathTex display={false}>{String.raw`\enfPar{\varepsilon}`}</MathTex>: <span className="text-primary font-mono">{epsilonRef.current.toFixed(2)}</span></span>
              </div>
            </div>
          </div>

          {/* Params panel */}
          <div className="space-y-6 p-6 rounded-xl border border-border/50 bg-card/50">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              Настройки эксперимента
            </h3>
            {params.map((p) => (
              <div key={p.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-muted-foreground">{p.label}</span>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-[200px] text-xs">
                        {p.tip}
                      </TooltipContent>
                    </UITooltip>
                  </div>
                  <span className="text-sm font-mono text-primary">{p.value.toFixed(3)}</span>
                </div>
                <Slider
                  min={p.min}
                  max={p.max}
                  step={p.step}
                  value={[p.value]}
                  onValueChange={([v]) => p.set(v)}
                  className="w-full"
                />
              </div>
            ))}
            <div className="pt-2 text-xs text-muted-foreground">
              Изменение LR или Gamma сбрасывает симуляцию.
            </div>
          </div>
        </div>

        {/* Section 2: Chart */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">График обучения</h2>
          <div className="rounded-xl border border-border/50 bg-card/30 p-4 md:p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={history}>
                <CartesianGrid stroke="hsla(230,20%,25%,0.5)" strokeDasharray="3 3" />
                <XAxis
                  dataKey="episode"
                  stroke="hsla(210,15%,55%,1)"
                  tick={{ fontSize: 12, fill: "hsla(210,15%,72%,1)" }}
                  label={{ value: "Эпизод", position: "insideBottom", offset: -5, fill: "hsla(210,15%,72%,1)", fontSize: 12 }}
                />
                <YAxis
                  stroke="hsla(210,15%,55%,1)"
                  tick={{ fontSize: 12, fill: "hsla(210,15%,72%,1)" }}
                  label={{ value: "Reward", angle: -90, position: "insideLeft", fill: "hsla(210,15%,72%,1)", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(230,20%,12%)", border: "1px solid hsla(180,100%,50%,0.3)", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "hsla(210,15%,72%,1)" }}
                  itemStyle={{ color: "hsl(180,100%,50%)" }}
                />
                <Line
                  type="monotone"
                  dataKey="reward"
                  stroke="hsl(180,100%,50%)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                {history.length > 5 && (
                  <ReferenceLine
                    x={Math.min(5, history.length)}
                    stroke="hsla(280,100%,60%,0.5)"
                    strokeDasharray="4 4"
                    label={{ value: "Фаза исследования", fill: "hsla(280,100%,70%,1)", fontSize: 10, position: "insideTopRight" }}
                  />
                )}
                {history.length > 20 && (
                  <ReferenceLine
                    x={20}
                    stroke="hsla(50,100%,60%,0.5)"
                    strokeDasharray="4 4"
                    label={{ value: "Начало обучения", fill: "hsla(50,100%,70%,1)", fontSize: 10, position: "insideTopRight" }}
                  />
                )}
                {history.length > 50 && (
                  <ReferenceLine
                    x={50}
                    stroke="hsla(120,70%,50%,0.5)"
                    strokeDasharray="4 4"
                    label={{ value: "Сходимость", fill: "hsla(120,70%,60%,1)", fontSize: 10, position: "insideTopRight" }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
            {history.length === 0 && (
              <p className="text-center text-sm text-muted-foreground mt-2">Запустите симуляцию, чтобы увидеть график</p>
            )}
          </div>
        </div>

        {/* Section 4: CTA */}
        <div className="text-center space-y-6 py-12 px-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-secondary/5">
          <Rocket className="w-12 h-12 text-primary mx-auto" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Хотите обучить агента в 3D?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Это была упрощённая 2D-демонстрация. В курсе вы создадите полноценных агентов в Unity — от погони до футбола.
          </p>
          <Button asChild size="lg" className="bg-gradient-neon gap-2 text-lg">
            <Link to="/courses">
              <GraduationCap className="w-5 h-5" />
              Начать бесплатный курс
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default DemoPage;
