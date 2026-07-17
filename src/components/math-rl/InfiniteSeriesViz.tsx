import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ═══════════════════════════════════════════════════
   Бесконечные ряды и сходимость — встраиваемый компонент
   ═══════════════════════════════════════════════════ */

interface SeriesInfo {
  term: (n: number) => number;
  limit: number | null;
  limitLabel: string;
  converges: boolean;
  formula: string;
  desc: string;
  canvasColor: string;
  criteria: { test: string; pass: boolean; note: string }[];
}

type SeriesId = "geometric" | "harmonic" | "p-series" | "alternating";

const SERIES_IDS: SeriesId[] = ["geometric", "harmonic", "p-series", "alternating"];
const CANVAS_COLORS: Record<SeriesId, string> = {
  geometric: "#00FFD6",
  harmonic: "#FBBF24",
  "p-series": "#D946EF",
  alternating: "#60A5FA",
};

function chipLabel(id: SeriesId, r: number, p: number): string {
  if (id === "geometric") return `rⁿ (r=${r.toFixed(2)})`;
  if (id === "harmonic") return "1/n";
  if (id === "p-series") return `1/nᵖ (p=${p.toFixed(1)})`;
  return "(-1)ⁿ/n";
}

function getSeriesInfo(id: SeriesId, r: number, p: number): SeriesInfo {
  const color = CANVAS_COLORS[id];
  switch (id) {
    case "geometric":
      return {
        term: (n) => Math.pow(r, n),
        limit: Math.abs(r) < 1 ? 1 / (1 - r) : null,
        limitLabel: Math.abs(r) < 1 ? (1 / (1 - r)).toFixed(4) : "∞",
        converges: Math.abs(r) < 1,
        formula: `Σ rⁿ,  r = ${r.toFixed(2)}`,
        desc: Math.abs(r) < 1
          ? `Геометрический ряд сходится при |r|<1. Сумма = 1/(1−r) = ${(1 / (1 - r)).toFixed(4)}`
          : "Геометрический ряд расходится при |r|≥1 — частичные суммы растут без ограничений",
        canvasColor: color,
        criteria: [
          { test: "aₙ → 0 ?", pass: Math.abs(r) < 1, note: Math.abs(r) < 1 ? "Да" : "Нет" },
          { test: "|r| < 1 ?", pass: Math.abs(r) < 1, note: Math.abs(r) < 1 ? "Сходится" : "Расходится" },
        ],
      };
    case "harmonic":
      return {
        term: (n) => 1 / (n + 1),
        limit: null, limitLabel: "∞", converges: false,
        formula: "Σ 1/n  (гармонический)",
        desc: "Гармонический ряд расходится, хотя aₙ→0. Классический контрпример.",
        canvasColor: color,
        criteria: [
          { test: "aₙ → 0 ?", pass: true, note: "Да, но этого мало!" },
          { test: "Сходится?", pass: false, note: "Нет — растёт как ln n" },
        ],
      };
    case "p-series":
      return {
        term: (n) => 1 / Math.pow(n + 1, p),
        limit: null, limitLabel: p > 1 ? "конечная" : "∞", converges: p > 1,
        formula: `Σ 1/nᵖ,  p = ${p.toFixed(1)}`,
        desc: p > 1
          ? `p-ряд сходится при p>1. При p=${p.toFixed(1)} убывание достаточно быстрое.`
          : `p-ряд расходится при p≤1. При p=${p.toFixed(1)} убывание слишком медленное.`,
        canvasColor: color,
        criteria: [
          { test: "aₙ → 0 ?", pass: true, note: "Да" },
          { test: "p > 1 ?", pass: p > 1, note: p > 1 ? "Сходится" : "Расходится" },
        ],
      };
    case "alternating":
      return {
        term: (n) => Math.pow(-1, n) / (n + 1),
        limit: Math.log(2), limitLabel: "ln 2 ≈ 0.6931", converges: true,
        formula: "Σ (-1)ⁿ/(n+1)  (Лейбниц)",
        desc: "Знакочередующийся ряд Лейбница — сходится условно к ln 2.",
        canvasColor: color,
        criteria: [
          { test: "aₙ → 0 ?", pass: true, note: "Да" },
          { test: "Лейбниц?", pass: true, note: "|aₙ| убывает ✓" },
        ],
      };
  }
}

function partialSums(termFn: (n: number) => number, count: number) {
  const terms: number[] = [];
  const sums: number[] = [];
  let s = 0;
  for (let i = 0; i < count; i++) {
    const t = termFn(i);
    terms.push(t);
    s += t;
    sums.push(s);
  }
  return { terms, sums };
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`;
}

/* ─── Canvas ─── */
function SeriesCanvas({ info, nTerms, showTerms, showLimit }: {
  info: SeriesInfo; nTerms: number; showTerms: boolean; showLimit: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const pulseRef = useRef(0);
  const showTermsRef = useRef(showTerms);
  const showLimitRef = useRef(showLimit);
  useEffect(() => { showTermsRef.current = showTerms; }, [showTerms]);
  useEffect(() => { showLimitRef.current = showLimit; }, [showLimit]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const W = rect.width;
    const H = rect.height;

    pulseRef.current += 0.02;
    const pulse = (Math.sin(pulseRef.current) + 1) * 0.5;

    const styles = getComputedStyle(document.documentElement);
    const bgColor = styles.getPropertyValue("--background").trim();
    ctx.fillStyle = `hsl(${bgColor})`;
    ctx.fillRect(0, 0, W, H);

    const curShowTerms = showTermsRef.current;
    const curShowLimit = showLimitRef.current;

    const data = partialSums(info.term, nTerms);
    if (!data.sums.length) { animRef.current = requestAnimationFrame(draw); return; }

    const pad = { l: 70, r: 40, t: 34, b: 24 };
    const gW = W - pad.l - pad.r;
    const sumAreaH = curShowTerms ? (H - pad.t - pad.b) * 0.56 : (H - pad.t - pad.b);
    const termAreaTop = pad.t + sumAreaH + 28;
    const termAreaH = H - termAreaTop - pad.b;

    let sMin = Math.min(...data.sums, 0);
    let sMax = Math.max(...data.sums, 0.1);
    if (info.converges && info.limit != null) {
      sMin = Math.min(sMin, info.limit * 0.9);
      sMax = Math.max(sMax, info.limit * 1.1);
    }
    const sSpan = (sMax - sMin) || 1;
    sMin -= sSpan * 0.06;
    sMax += sSpan * 0.06;

    const xOf = (i: number) => pad.l + (i / Math.max(nTerms - 1, 1)) * gW;
    const yOf = (v: number) => pad.t + (1 - (v - sMin) / (sMax - sMin)) * sumAreaH;

    const color = info.canvasColor;
    const rgb = hexToRgb(color);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.025)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const yy = pad.t + (i / 4) * sumAreaH;
      ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(W - pad.r, yy); ctx.stroke();
    }

    // Limit line & band
    if (curShowLimit && info.converges && info.limit != null) {
      const ly = yOf(info.limit);
      const bandPx = 14;
      ctx.fillStyle = `rgba(${rgb},${0.08 + pulse * 0.04})`;
      ctx.fillRect(pad.l, ly - bandPx, gW, bandPx * 2);

      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = `rgba(${rgb},0.2)`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.l, ly - bandPx); ctx.lineTo(W - pad.r, ly - bandPx); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad.l, ly + bandPx); ctx.lineTo(W - pad.r, ly + bandPx); ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = `rgba(${rgb},${0.5 + pulse * 0.3})`;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(pad.l, ly); ctx.lineTo(W - pad.r, ly); ctx.stroke();
      ctx.setLineDash([]);

      const labelText = `S = ${info.limitLabel}`;
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      const tw = ctx.measureText(labelText).width;
      ctx.fillStyle = `hsl(${bgColor})`;
      ctx.fillRect(W - pad.r + 4, ly - 10, tw + 12, 22);
      ctx.fillStyle = color;
      ctx.textAlign = "left";
      ctx.fillText(labelText, W - pad.r + 10, ly + 5);
    }

    // Sum curve + fill
    ctx.beginPath();
    data.sums.forEach((s, i) => {
      const px = xOf(i), py = yOf(s);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.strokeStyle = `rgba(${rgb},0.25)`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    const last = data.sums.length - 1;
    ctx.lineTo(xOf(last), yOf(sMin));
    ctx.lineTo(xOf(0), yOf(sMin));
    ctx.closePath();
    ctx.fillStyle = `rgba(${rgb},0.03)`;
    ctx.fill();

    // Points
    data.sums.forEach((s, i) => {
      const px = xOf(i), py = yOf(s);
      const grd = ctx.createRadialGradient(px, py, 0, px, py, 9);
      grd.addColorStop(0, `rgba(${rgb},0.25)`);
      grd.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(px, py, 9, 0, Math.PI * 2); ctx.fill();
      const rr = nTerms > 50 ? 2.5 : 3.5;
      ctx.beginPath(); ctx.arc(px, py, rr, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
    });

    // Divergence marker
    if (!info.converges && data.sums.length > 3) {
      const lastS = data.sums[data.sums.length - 1];
      ctx.fillStyle = "#F87171";
      ctx.font = "bold 14px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("→ ∞", xOf(data.sums.length - 1) + 22, yOf(lastS) - 10);
    }

    // Y labels
    const mutedColor = styles.getPropertyValue("--muted-foreground").trim();
    ctx.fillStyle = `hsl(${mutedColor})`;
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const v = sMax - (i / 4) * (sMax - sMin);
      ctx.fillText(v.toFixed(2), pad.l - 8, pad.t + (i / 4) * sumAreaH + 4);
    }

    // Axes
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + sumAreaH); ctx.lineTo(W - pad.r, pad.t + sumAreaH);
    ctx.stroke();

    // Labels
    ctx.fillStyle = `hsl(${mutedColor})`;
    ctx.font = "13px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText("Sₙ — частичные суммы", pad.l, pad.t - 10);
    ctx.fillStyle = `rgba(${rgb},0.7)`;
    ctx.textAlign = "right";
    ctx.fillText(info.formula, W - pad.r, pad.t - 10);

    // Term bars
    if (curShowTerms && termAreaH > 30) {
      ctx.fillStyle = `hsl(${mutedColor})`;
      ctx.font = "13px 'JetBrains Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText("aₙ — члены ряда", pad.l, termAreaTop - 8);

      const absMax = Math.max(...data.terms.map(Math.abs), 0.001) * 1.12;
      const tMid = termAreaTop + termAreaH * 0.5;
      const halfH = termAreaH * 0.42;
      const bw = Math.max(2, Math.min(12, gW / nTerms - 2));

      data.terms.forEach((t, i) => {
        const px = xOf(i);
        const h = (Math.abs(t) / absMax) * halfH;
        const top = t >= 0 ? tMid - h : tMid;
        const alpha = 0.4 + (1 - i / nTerms) * 0.5;
        ctx.fillStyle = t >= 0
          ? `rgba(${rgb},${alpha})`
          : `rgba(${hexToRgb("#D946EF")},${alpha})`;
        ctx.fillRect(px - bw / 2, top, bw, h);
      });

      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.l, tMid); ctx.lineTo(W - pad.r, tMid); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pad.l, termAreaTop); ctx.lineTo(pad.l, termAreaTop + termAreaH); ctx.stroke();
    }

    // X labels
    ctx.fillStyle = `hsl(${mutedColor})`;
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    const xStep = Math.max(1, Math.floor(nTerms / 8));
    for (let i = 0; i < nTerms; i += xStep) ctx.fillText(String(i + 1), xOf(i), H - 4);

    animRef.current = requestAnimationFrame(draw);
  }, [info, nTerms]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-lg"
      style={{ height: 360, display: "block" }}
    />
  );
}

/* ─── Criteria list ─── */
function CriteriaList({ criteria }: { criteria: SeriesInfo["criteria"] }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
        Признаки сходимости
      </p>
      {criteria.map((c, i) => (
        <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-mono ${
          c.pass ? "bg-green-500/5 border border-green-500/20" : "bg-destructive/5 border border-destructive/20"
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
            c.pass ? "bg-green-500/20 text-green-400" : "bg-destructive/20 text-destructive"
          }`}>
            {c.pass ? "✓" : "✗"}
          </span>
          <span className="text-foreground">{c.test}</span>
          <span className="text-muted-foreground ml-auto">{c.note}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Sum Table ─── */
function SumTable({ info, count }: { info: SeriesInfo; count: number }) {
  const show = Math.min(count, 8);
  const data = partialSums(info.term, show);
  return (
    <table className="w-full text-xs font-mono border-collapse">
      <thead>
        <tr className="border-b border-border/30">
          <th className="text-left py-1 text-muted-foreground">n</th>
          <th className="text-right py-1 text-muted-foreground">aₙ</th>
          <th className="text-right py-1 text-muted-foreground">Sₙ</th>
        </tr>
      </thead>
      <tbody>
        {data.sums.map((s, i) => (
          <tr key={i} className="border-b border-border/10">
            <td className="py-1 text-muted-foreground">{i + 1}</td>
            <td className={`py-1 text-right ${data.terms[i] >= 0 ? "text-primary" : "text-secondary"}`}>
              {data.terms[i].toFixed(6)}
            </td>
            <td className="py-1 text-right text-foreground font-medium">{s.toFixed(6)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
const InfiniteSeriesViz = () => {
  const [idx, setIdx] = useState(0);
  const [nTerms, setNTerms] = useState(30);
  const [r, setR] = useState(0.70);
  const [p, setP] = useState(2.0);
  const [showTerms, setShowTerms] = useState(true);
  const [showLimit, setShowLimit] = useState(true);

  const seriesId = SERIES_IDS[idx];
  const info = useMemo(() => getSeriesInfo(seriesId, r, p), [seriesId, r, p]);
  const data = useMemo(() => partialSums(info.term, nTerms), [info, nTerms]);
  const lastSum = data.sums.length > 0 ? data.sums[data.sums.length - 1] : 0;

  return (
    <Card className="my-6 border-secondary/20 bg-card/60 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-4 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-foreground tracking-wide uppercase">
            Визуализация бесконечных рядов
          </h4>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="border-secondary/30 text-secondary font-mono text-xs">
              Sₙ = {lastSum.toFixed(4)}
            </Badge>
            <Badge variant="outline" className={`font-mono text-xs ${
              info.converges
                ? "border-green-500/30 text-green-400"
                : "border-destructive/30 text-destructive"
            }`}>
              {info.converges ? `S = ${info.limitLabel}` : "расходится"}
            </Badge>
          </div>
        </div>

        {/* Series selector chips */}
        <div className="flex flex-wrap gap-2">
          {SERIES_IDS.map((id, i) => (
            <button
              key={id}
              onClick={() => setIdx(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                i === idx
                  ? "border-secondary/40 bg-secondary/10 text-secondary font-bold shadow-[0_0_12px_hsl(var(--secondary)/0.15)]"
                  : "border-border/50 bg-card/30 text-muted-foreground hover:border-secondary/30 hover:text-foreground"
              }`}
            >
              {chipLabel(id, r, p)}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">{info.desc}</p>

        {/* Canvas */}
        <div className="rounded-lg border border-border/30 overflow-hidden bg-background">
          <SeriesCanvas info={info} nTerms={nTerms} showTerms={showTerms} showLimit={showLimit} />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground font-mono">Число членов</span>
              <span className="text-primary font-mono font-bold">{nTerms}</span>
            </div>
            <Slider value={[nTerms]} onValueChange={([v]) => setNTerms(v)} min={5} max={80} step={1} />
          </div>
          {seriesId === "geometric" && (
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground font-mono">r (знаменатель)</span>
                <span className="text-secondary font-mono font-bold">{r.toFixed(2)}</span>
              </div>
              <Slider value={[r]} onValueChange={([v]) => setR(v)} min={-0.99} max={1.2} step={0.01} />
            </div>
          )}
          {seriesId === "p-series" && (
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground font-mono">p (показатель)</span>
                <span className="text-secondary font-mono font-bold">{p.toFixed(1)}</span>
              </div>
              <Slider value={[p]} onValueChange={([v]) => setP(v)} min={0.3} max={4.0} step={0.1} />
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch checked={showTerms} onCheckedChange={setShowTerms} />
            <span className="text-xs font-mono text-muted-foreground uppercase">Члены ряда aₙ</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch checked={showLimit} onCheckedChange={setShowLimit} />
            <span className="text-xs font-mono text-muted-foreground uppercase">Предел суммы</span>
          </label>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <CriteriaList criteria={info.criteria} />
          </div>
          <div className="md:col-span-2 space-y-3">
            <SumTable info={info} count={nTerms} />
            <div className="p-3 rounded-lg bg-card/40 border border-border/30">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                Связь с RL
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Дисконтированная сумма наград — геометрический ряд: G₀ = Σ γᵏ · rₖ.
                Дисконт-фактор γ играет роль знаменателя r. При γ = 1 сумма расходится,
                поэтому γ {"<"} 1 — обязательное условие в MDP.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfiniteSeriesViz;
