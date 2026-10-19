import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MathTex from "@/components/Math";

/* ═══════════════════════════════════════════════════
   Предел последовательности — ε-N визуализация
   Встраиваемый компонент для Part1Limits
   ═══════════════════════════════════════════════════ */

interface Sequence {
  id: string;
  label: string;
  latex: string;
  fn: (n: number) => number;
  limit: number | null;
  limitLabel: string;
  converges: boolean;
  desc: string;
  hue: string; // tailwind color class prefix
  canvasColor: string; // hex for canvas
}

const SEQUENCES: Sequence[] = [
  {
    id: "1/n", label: "1 / n", latex: "xₙ = 1/n",
    fn: (n) => 1 / n, limit: 0, limitLabel: "0", converges: true,
    desc: "Классическая — убывает к нулю как гипербола",
    hue: "primary", canvasColor: "#00FFD6",
  },
  {
    id: "1/sqrt(n)", label: "1 / √n", latex: "xₙ = 1/√n",
    fn: (n) => 1 / Math.sqrt(n), limit: 0, limitLabel: "0", converges: true,
    desc: "Медленная сходимость — корневое затухание",
    hue: "secondary", canvasColor: "#D946EF",
  },
  {
    id: "(-1)^n", label: "(-1)ⁿ", latex: "xₙ = (-1)ⁿ",
    fn: (n) => Math.pow(-1, n), limit: null, limitLabel: "∄", converges: false,
    desc: "Расходится — осциллирует между +1 и −1",
    hue: "accent", canvasColor: "#FBBF24",
  },
  {
    id: "(n+1)/n", label: "(n+1) / n", latex: "xₙ = (n+1)/n",
    fn: (n) => (n + 1) / n, limit: 1, limitLabel: "1", converges: true,
    desc: "Сходится к единице сверху",
    hue: "primary", canvasColor: "#34D399",
  },
];

function findNEpsilon(seq: Sequence, eps: number): number | null {
  if (!seq.converges || seq.limit === null) return null;
  for (let n = 1; n <= 500; n++) {
    if (Math.abs(seq.fn(n) - seq.limit) < eps) return n;
  }
  return 500;
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`;
}

/* ─── Canvas ─── */
function SequenceCanvas({ seq, epsilon, nTerms, highlightN }: {
  seq: Sequence; epsilon: number; nTerms: number; highlightN: number | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const pulseRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }
    const W = rect.width;
    const H = rect.height;

    pulseRef.current += 0.025;
    const pulse = Math.sin(pulseRef.current) * 0.5 + 0.5;

    // Use CSS variable colors through computed style
    const styles = getComputedStyle(document.documentElement);
    const bgColor = styles.getPropertyValue("--background").trim();
    ctx.fillStyle = `hsl(${bgColor})`;
    ctx.fillRect(0, 0, W, H);

    const pad = { l: 66, r: 36, t: 32, b: 48 };
    const gW = W - pad.l - pad.r;
    const gH = H - pad.t - pad.b;

    let yMin: number, yMax: number;
    if (!seq.converges) {
      yMin = -1.5; yMax = 1.5;
    } else {
      const vals: number[] = [];
      for (let n = 1; n <= nTerms; n++) vals.push(seq.fn(n));
      const dataMin = Math.min(...vals, seq.limit! - epsilon);
      const dataMax = Math.max(...vals, seq.limit! + epsilon);
      const range = dataMax - dataMin || 1;
      yMin = dataMin - range * 0.15;
      yMax = dataMax + range * 0.15;
    }

    const xToCanvas = (n: number) => pad.l + ((n - 1) / (nTerms - 1)) * gW;
    const yToCanvas = (v: number) => pad.t + (1 - (v - yMin) / (yMax - yMin)) * gH;

    const color = seq.canvasColor;
    const rgb = hexToRgb(color);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const yy = pad.t + (i / ySteps) * gH;
      ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(W - pad.r, yy); ctx.stroke();
    }

    // ε-band
    if (seq.converges && seq.limit !== null) {
      const bandTop = yToCanvas(seq.limit + epsilon);
      const bandBot = yToCanvas(seq.limit - epsilon);
      const bandAlpha = 0.06 + pulse * 0.03;
      ctx.fillStyle = `rgba(${rgb},${bandAlpha})`;
      ctx.fillRect(pad.l, bandTop, gW, bandBot - bandTop);

      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = `rgba(${rgb},${0.25 + pulse * 0.15})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(pad.l, bandTop); ctx.lineTo(W - pad.r, bandTop); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad.l, bandBot); ctx.lineTo(W - pad.r, bandBot); ctx.stroke();
      ctx.setLineDash([]);

      // ε labels
      ctx.fillStyle = color;
      ctx.font = "bold 12px 'JetBrains Mono', monospace";
      ctx.textAlign = "right";
      ctx.fillText(`a+ε`, pad.l - 6, bandTop + 4);
      ctx.fillText(`a−ε`, pad.l - 6, bandBot + 4);

      // Limit line
      const lY = yToCanvas(seq.limit);
      ctx.strokeStyle = `rgba(${rgb},0.5)`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.moveTo(pad.l, lY); ctx.lineTo(W - pad.r, lY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = color;
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText(`a = ${seq.limitLabel}`, W - pad.r + 6, lY + 4);

      // N(ε) vertical
      if (highlightN && highlightN <= nTerms) {
        const nX = xToCanvas(highlightN);
        ctx.strokeStyle = `rgba(251,191,36,${0.3 + pulse * 0.2})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(nX, pad.t); ctx.lineTo(nX, pad.t + gH); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#FBBF24";
        ctx.font = "bold 12px 'JetBrains Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(`N(ε)=${highlightN}`, nX, pad.t + gH + 32);
      }
    }

    // Points
    for (let n = 1; n <= nTerms; n++) {
      const val = seq.fn(n);
      const px = xToCanvas(n);
      const py = yToCanvas(val);
      const insideBand = seq.converges && seq.limit !== null && Math.abs(val - seq.limit) < epsilon;
      const isAfterN = highlightN ? n >= highlightN : false;
      const pointColor = !seq.converges ? color : (insideBand && isAfterN) ? color : `rgba(${rgb},0.3)`;

      if (insideBand && isAfterN && seq.converges) {
        const g = ctx.createRadialGradient(px, py, 0, px, py, 10);
        g.addColorStop(0, `rgba(${rgb},0.25)`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); ctx.fill();
      }

      const r = n <= 3 ? 4.5 : (nTerms > 60 ? 2.5 : 3.5);
      ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = pointColor; ctx.fill();
    }

    // Connecting line
    ctx.beginPath();
    for (let n = 1; n <= nTerms; n++) {
      const px = xToCanvas(n);
      const py = yToCanvas(seq.fn(n));
      if (n === 1) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = `rgba(${rgb},0.15)`;
    ctx.lineWidth = 1; ctx.stroke();

    // Axes
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + gH); ctx.lineTo(W - pad.r, pad.t + gH);
    ctx.stroke();

    // Y-axis labels
    const mutedColor = getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim();
    ctx.fillStyle = `hsl(${mutedColor})`;
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    for (let i = 0; i <= ySteps; i++) {
      const v = yMax - (i / ySteps) * (yMax - yMin);
      const yy = pad.t + (i / ySteps) * gH;
      ctx.fillText(v.toFixed(2), pad.l - 8, yy + 4);
    }

    // n labels
    for (let n = 1; n <= nTerms; n += Math.max(1, Math.floor(nTerms / 8))) {
      const xx = xToCanvas(n);
      ctx.fillStyle = `hsl(${mutedColor})`;
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText(`${n}`, xx, pad.t + gH + 14);
    }

    // Formula label
    ctx.fillStyle = `rgba(${rgb},0.7)`;
    ctx.font = "13px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    ctx.fillText(seq.latex, W - pad.r, pad.t - 10);

    animRef.current = requestAnimationFrame(draw);
  }, [seq, epsilon, nTerms, highlightN]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-lg"
      style={{ height: 300, display: "block" }}
    />
  );
}

/* ─── Convergence Status ─── */
function ConvergenceStatus({ seq, n }: { seq: Sequence; n: number }) {
  if (!seq.converges) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/20">
        <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
        <span className="text-xs font-mono font-semibold text-destructive">РАСХОДИТСЯ</span>
        <span className="text-xs text-muted-foreground ml-1">— предел не существует</span>
      </div>
    );
  }
  const err = Math.abs(seq.fn(n) - seq.limit!);
  const barW = Math.max(0, Math.min(100, (1 - Math.min(err * 5, 1)) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-mono">
        <span className="text-muted-foreground">|x<sub>{n}</sub> − a|</span>
        <span className="text-primary">{err.toFixed(6)}</span>
      </div>
      <div className="h-1 rounded-full bg-muted/30 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${barW}%` }}
        />
      </div>
    </div>
  );
}

/* ─── Formal definition block ─── */
function FormalDefinition({ seq, epsilon, nEps }: { seq: Sequence; epsilon: number; nEps: number | null }) {
  if (!seq.converges) {
    return (
      <p className="text-sm font-mono text-muted-foreground">
        <span className="text-accent">∄ </span>lim x<sub>n</sub> — определение предела{" "}
        <span className="text-destructive">не выполняется</span>: члены осциллируют.
      </p>
    );
  }
  return (
    <div className="text-sm font-mono text-muted-foreground leading-loose">
      <div>
        <MathTex display={false}>{String.raw`\forall`}</MathTex> <span className="text-primary font-bold"><MathTex display={false}>{String.raw`\enfPar{\varepsilon} =`}</MathTex> {epsilon.toFixed(3)}</span>{" > 0  "}
        {" "}<MathTex display={false}>{String.raw`\exists`}</MathTex> <span className="text-accent font-bold"><MathTex display={false}>{String.raw`N(\enfPar{\varepsilon}) =`}</MathTex> {nEps}</span> :
      </div>
      <div className="pl-4">
        <MathTex display={false}>{String.raw`\forall n \ge`}</MathTex> <span className="text-accent">{nEps}</span>,{" "}
        |x<sub>n</sub> − {seq.limitLabel}| {"<"} <span className="text-primary">{epsilon.toFixed(3)}</span>
      </div>
    </div>
  );
}

/* ─── Values Table (compact) ─── */
function ValuesTable({ seq, rows = 6 }: { seq: Sequence; rows?: number }) {
  const data = Array.from({ length: rows }, (_, i) => {
    const n = i + 1;
    const val = seq.fn(n);
    const diff = seq.converges && seq.limit !== null ? Math.abs(val - seq.limit) : null;
    return { n, val, diff };
  });
  return (
    <table className="w-full text-xs font-mono border-collapse">
      <thead>
        <tr className="border-b border-border/30">
          <th className="text-left py-1 text-muted-foreground">n</th>
          <th className="text-right py-1 text-muted-foreground">x<sub>n</sub></th>
          {seq.converges && <th className="text-right py-1 text-muted-foreground">|x<sub>n</sub>−a|</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((r) => (
          <tr key={r.n} className="border-b border-border/10">
            <td className="py-1 text-muted-foreground">{r.n}</td>
            <td className="py-1 text-right text-primary">{r.val.toFixed(6)}</td>
            {seq.converges && (
              <td className={`py-1 text-right ${r.diff! < 0.1 ? "text-green-400" : "text-muted-foreground"}`}>
                {r.diff!.toFixed(6)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
const LimitOfSequenceViz = () => {
  const [seqIdx, setSeqIdx] = useState(0);
  const [epsilon, setEpsilon] = useState(0.2);
  const [nTerms, setNTerms] = useState(40);

  const seq = SEQUENCES[seqIdx];
  const nEps = useMemo(() => findNEpsilon(seq, epsilon), [seq, epsilon]);

  return (
    <Card className="my-6 border-primary/20 bg-card/60 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-4 md:p-6 space-y-5">
        {/* Header: title + status pills */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-foreground tracking-wide uppercase">
            Визуализация <MathTex display={false}>{String.raw`\enfPar{\varepsilon}`}</MathTex>–<MathTex display={false}>{String.raw`N`}</MathTex> определения
          </h4>
          <div className="flex gap-2">
            {seq.converges && (
              <Badge variant="outline" className="border-primary/30 text-primary font-mono text-xs">
                a = {seq.limitLabel}
              </Badge>
            )}
            {seq.converges && nEps !== null && (
              <Badge variant="outline" className="border-accent/30 text-accent font-mono text-xs">
                <MathTex display={false}>{String.raw`N(\enfPar{\varepsilon}) =`}</MathTex> {nEps}
              </Badge>
            )}
            {!seq.converges && (
              <Badge variant="outline" className="border-destructive/30 text-destructive font-mono text-xs">
                расходится
              </Badge>
            )}
          </div>
        </div>

        {/* Sequence selector chips */}
        <div className="flex flex-wrap gap-2">
          {SEQUENCES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSeqIdx(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                i === seqIdx
                  ? "border-primary/40 bg-primary/10 text-primary font-bold shadow-[0_0_12px_hsl(var(--primary)/0.15)]"
                  : "border-border/50 bg-card/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">{seq.desc}</p>

        {/* Canvas */}
        <div className="rounded-lg border border-border/30 overflow-hidden bg-background">
          <SequenceCanvas seq={seq} epsilon={epsilon} nTerms={nTerms} highlightN={nEps} />
        </div>

        {/* Controls row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground font-mono"><MathTex display={false}>{String.raw`\enfPar{\varepsilon}`}</MathTex> (эпсилон)</span>
              <span className="text-primary font-mono font-bold">{epsilon.toFixed(3)}</span>
            </div>
            <Slider
              value={[epsilon]}
              onValueChange={([v]) => setEpsilon(v)}
              min={0.005} max={1.0} step={0.005}
            />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground font-mono">Кол-во членов (n)</span>
              <span className="text-secondary font-mono font-bold">{nTerms}</span>
            </div>
            <Slider
              value={[nTerms]}
              onValueChange={([v]) => setNTerms(v)}
              min={10} max={100} step={1}
            />
          </div>
        </div>

        {/* Bottom row: convergence + definition + table */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <ConvergenceStatus seq={seq} n={nTerms} />
            <ValuesTable seq={seq} rows={5} />
          </div>
          <div className="md:col-span-2 p-3 rounded-lg bg-card/40 border border-border/30">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
              Формальное определение
            </p>
            <FormalDefinition seq={seq} epsilon={epsilon} nEps={nEps} />
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              {seq.converges
                ? <>Сходимость — фундамент RL. Оператор Беллмана порождает <MathTex display={false}>{String.raw`\enfOp{V}_{0}, \enfOp{V}_{1}, \enfOp{V}_{2}, \ldots \to \enfOp{V}^{*}`}</MathTex>, аналогично {seq.latex} → {seq.limitLabel}.</>
                : <>При <MathTex display={false}>{String.raw`\enfPar{\gamma} = 1`}</MathTex> сумма наград расходится — функция ценности не определена.</>
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LimitOfSequenceViz;
