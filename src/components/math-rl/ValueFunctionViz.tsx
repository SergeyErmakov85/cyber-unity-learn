import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { KATEX_OPTIONS } from "@/lib/katex-options";

/* ═══════════════════════════════════════════════════
   NEON UNITY NEURAL — Функция ценности V(s)
   Все формулы в LaTeX (KaTeX)
   ═══════════════════════════════════════════════════ */

const C = {
  cyan:"#00FFD6", cyanDim:"rgba(0,255,214,0.35)", magenta:"#D946EF",
  amber:"#FBBF24", amberDim:"rgba(251,191,36,0.35)", red:"#F87171",
  green:"#34D399", blue:"#60A5FA", txt:"#F4F7FC", txtDim:"#B0B8CE", txtMuted:"#6B7490",
  mono:"'JetBrains Mono','Fira Code',monospace",
  display:"'Orbitron','Audiowide',sans-serif",
  sans:"'IBM Plex Sans','Segoe UI',sans-serif",
  border:"rgba(255,255,255,0.05)",
  card:"rgba(12,16,28,0.70)",
  radius:"14px", radiusSm:"8px",
  trans:"all 0.3s cubic-bezier(0.22,1,0.36,1)",
};

/* ─── KaTeX loader + Tex component ─── */
interface KatexLib {
  renderToString: (tex: string, opts: { displayMode: boolean; throwOnError: boolean }) => string;
}
const getWindowKatex = () => (window as unknown as { katex?: KatexLib }).katex ?? null;

let katexPromise: Promise<KatexLib | null> | null = null;
function loadKatex() {
  if (katexPromise) return katexPromise;
  katexPromise = new Promise((resolve) => {
    if (getWindowKatex()) { resolve(getWindowKatex()); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js";
    script.onload = () => resolve(getWindowKatex());
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
  return katexPromise;
}

function Tex({ children, display = false, size = 1.15, color }: {
  children: string; display?: boolean; size?: number; color?: string;
}) {
  const [html, setHtml] = useState("");
  useEffect(() => {
    loadKatex().then((katex) => {
      if (!katex) { setHtml(""); return; }
      try {
        // KATEX_OPTIONS несёт макросы ролей ENF (\enfVar и др.). Без них
        // раскраска молча не сработает — формула останется одноцветной.
        setHtml(
          katex.renderToString(children, { ...KATEX_OPTIONS, displayMode: display })
        );
      } catch { setHtml(""); }
    });
  }, [children, display]);

  const style: React.CSSProperties = {
    fontSize: `${size}em`,
    display: display ? "block" : "inline",
    textAlign: display ? "center" : undefined,
  };
  if (color) style.color = color;

  if (!html) return <span style={{ fontFamily: C.mono, ...style }}>{children}</span>;
  return <span style={style} dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ─── MDP data ─── */
const STATES = [
  { name: "S_0", tex: "S_0", label: "Старт", color: C.cyan },
  { name: "S_1", tex: "S_1", label: "Разведка", color: C.blue },
  { name: "S_2", tex: "S_2", label: "Опасность", color: C.amber },
  { name: "S_3", tex: "S_3", label: "Подъём", color: C.magenta },
  { name: "S_4", tex: "S_4", label: "Цель", color: C.green },
];
const REWARDS = [1, 3, -2, 10];

interface Step {
  k: number; fi: number; ti: number; reward: number;
  disc: number; contrib: number; cumSum: number;
}

function computeReturn(startIdx: number, gamma: number) {
  const steps: Step[] = [];
  let G = 0;
  for (let k = 0; k + startIdx < REWARDS.length; k++) {
    const r = REWARDS[k + startIdx];
    const disc = Math.pow(gamma, k);
    const contrib = disc * r;
    G += contrib;
    steps.push({ k, fi: k + startIdx, ti: k + startIdx + 1, reward: r, disc, contrib, cumSum: G });
  }
  return { steps, G };
}

/* ─── MDP Diagram (HTML/SVG) ─── */
function MDPDiagram({ startState, steps, highlightStep, onSelect, gamma }: {
  startState: number; steps: Step[]; highlightStep: number | null;
  onSelect: (i: number) => void; gamma: number;
}) {
  const af = startState, at = startState + steps.length;
  return (
    <div style={{ position: "relative", padding: "32px 20px 52px", overflow: "hidden" }}>
      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        viewBox="0 0 1000 200" preserveAspectRatio="none">
        {REWARDS.map((_, i) => {
          const x1 = 100 + i * 200 + 45, x2 = 100 + (i + 1) * 200 - 45, y = 90;
          const isAct = i >= af && i < at, isHL = highlightStep !== null && i === af + highlightStep;
          const col = isHL ? C.cyan : (isAct ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.06)");
          return (
            <g key={i}>
              {isHL && <line x1={x1} y1={y} x2={x2} y2={y} stroke={C.cyan} strokeWidth={8} opacity={0.15} />}
              <line x1={x1} y1={y} x2={x2} y2={y} stroke={col} strokeWidth={isHL ? 3 : (isAct ? 2 : 1)} />
              <polygon points={`${x2},${y} ${x2 - 12},${y - 6} ${x2 - 12},${y + 6}`} fill={col} />
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
        {STATES.map((s, i) => {
          const isAct = i >= af && i <= at, isSt = i === startState;
          return (
            <div key={i} onClick={() => i < REWARDS.length && onSelect(i)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                opacity: isAct ? 1 : 0.3, transition: C.trans, cursor: i < REWARDS.length ? "pointer" : "default"
              }}>
              <div style={{
                width: 54, height: 54, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isAct ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.01)",
                border: `2px solid ${isAct ? s.color : "rgba(255,255,255,0.08)"}`,
                boxShadow: isSt ? `0 0 20px ${s.color}40, 0 0 40px ${s.color}15` : (isAct ? `0 0 12px ${s.color}15` : "none"),
                transition: C.trans, position: "relative",
              }}>
                {isSt && <div style={{
                  position: "absolute", inset: -7, borderRadius: "50%",
                  border: `2px dashed ${s.color}50`, animation: "vfvSpin 8s linear infinite"
                }} />}
                <Tex size={1.1} color={isAct ? C.txt : C.txtMuted}>{s.tex}</Tex>
              </div>
              <span style={{ fontFamily: C.sans, fontSize: 12, color: isAct ? C.txtDim : C.txtMuted }}>{s.label}</span>
            </div>
          );
        })}
      </div>
      {/* Reward labels */}
      <div style={{ display: "flex", position: "absolute", top: 10, left: 0, right: 0, zIndex: 3, padding: "0 20px" }}>
        {REWARDS.map((r, i) => {
          const isAct = i >= af && i < at, isHL = highlightStep !== null && i === af + highlightStep;
          const rc = r >= 0 ? C.green : C.red;
          const left = `${((i + 0.5) / (STATES.length - 1)) * 100}%`;
          return (
            <div key={i} style={{
              position: "absolute", left, transform: "translateX(-50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2, transition: C.trans
            }}>
              <span style={{
                fontFamily: C.mono, fontSize: isHL ? 20 : 15, fontWeight: 700,
                color: isHL ? rc : (isAct ? `${rc}B0` : C.txtMuted),
                padding: isHL ? "3px 12px" : "0", borderRadius: 6,
                background: isHL ? `${rc}15` : "transparent", transition: C.trans,
              }}>{r >= 0 ? "+" : ""}{r}</span>
              {isHL && <Tex size={0.95} color={C.amber}>{`\\gamma^{${i - af}} = ${Math.pow(gamma, i - af).toFixed(3)}`}</Tex>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step card ─── */
function StepCard({ step, isHL, onEnter, onLeave }: {
  step: Step; isHL: boolean; onEnter: () => void; onLeave: () => void;
}) {
  const rc = step.reward >= 0 ? C.green : C.red;
  const from = STATES[step.fi], to = STATES[step.ti];
  return (
    <div onMouseEnter={onEnter} onMouseLeave={onLeave}
      style={{
        flex: "1 1 140px", minWidth: 140, padding: "16px 14px", borderRadius: C.radiusSm,
        background: isHL ? "rgba(0,255,214,0.06)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isHL ? C.cyan + "40" : C.border}`,
        cursor: "pointer", transition: C.trans,
        boxShadow: isHL ? `0 0 16px ${C.cyan}15` : "none",
      }}>
      <div style={{ fontFamily: C.display, fontSize: 10, color: C.txtMuted, letterSpacing: "0.12em", marginBottom: 10 }}>
        ШАГ {step.k}
      </div>
      <div style={{ marginBottom: 10 }}>
        <Tex size={1.2}>{`${from.tex} \\to ${to.tex}`}</Tex>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontFamily: C.sans, fontSize: 13, color: C.txtDim }}>Награда</span>
        <Tex size={1.15} color={rc}>{`R = ${step.reward >= 0 ? "+" : ""}${step.reward}`}</Tex>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontFamily: C.sans, fontSize: 13, color: C.txtDim }}>Дисконт</span>
        <Tex size={1.15} color={C.amber}>{`\\gamma^{${step.k}} = ${step.disc.toFixed(4)}`}</Tex>
      </div>
      <div style={{
        marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <span style={{ fontFamily: C.sans, fontSize: 13, color: C.txtDim }}>Вклад</span>
        <Tex size={1.3} color={step.contrib >= 0 ? C.green : C.red}>
          {`${step.contrib >= 0 ? "+" : ""}${step.contrib.toFixed(3)}`}
        </Tex>
      </div>
    </div>
  );
}

/* ─── Custom Slider ─── */
function GammaSliderCustom({ value, min, max, step, onChange, color = C.cyan, texLabel }: {
  value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; color?: string; texLabel?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        {texLabel
          ? <Tex size={1.1} color={C.txtDim}>{texLabel}</Tex>
          : null}
        <Tex size={1.3} color={color}>{value.toFixed(2)}</Tex>
      </div>
      <div style={{ position: "relative", height: 6, borderRadius: 3, background: "rgba(255,255,255,0.04)" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%", width: pct + "%", borderRadius: 3,
          background: `linear-gradient(90deg,${color}40,${color})`, boxShadow: `0 0 10px ${color}30`, transition: "width 0.1s ease"
        }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{
            position: "absolute", top: -10, left: 0, width: "100%", height: 28,
            appearance: "none", WebkitAppearance: "none", background: "transparent", cursor: "pointer", outline: "none"
          }} />
      </div>
    </div>
  );
}

/* ─── Pill ─── */
function Pill({ texLabel, value, color = C.cyan }: { texLabel: string; value: string; color?: string }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 22,
      background: `${color}08`, border: `1px solid ${color}25`
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />
      <Tex size={0.95} color={C.txtDim}>{texLabel}</Tex>
      <span style={{ fontFamily: C.mono, fontSize: 15, color, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

/* ═══ MAIN ═══ */
const ValueFunctionViz = () => {
  const [startState, setStartState] = useState(0);
  const [gamma, setGamma] = useState(0.90);
  const [hlStep, setHlStep] = useState<number | null>(null);

  const { steps, G } = useMemo(() => computeReturn(startState, gamma), [startState, gamma]);
  const allValues = useMemo(() => STATES.map((_, i) => i < REWARDS.length ? computeReturn(i, gamma).G : 0), [gamma]);
  const horizon = gamma < 1 ? (1 / (1 - gamma)).toFixed(1) : "\\infty";

  let gammaHint = "";
  if (gamma < 0.3) gammaHint = "Агент «близорук»: ценит только ближайшую награду, остальные обнулены.";
  else if (gamma < 0.7) gammaHint = "Умеренный дисконт: агент видит на 2–3 шага вперёд.";
  else if (gamma < 0.95) gammaHint = "Дальновидный агент: учитывает награды на много шагов. Типичное значение в RL.";
  else gammaHint = "Почти без дисконта: все награды одинаково ценны. Длинный горизонт.";

  const formulaParts = steps.map((s, i) =>
    `${i > 0 ? " + " : ""}\\gamma^{${s.k}} \\cdot (${s.reward >= 0 ? "+" : ""}${s.reward})`
  ).join("");
  const numericParts = steps.map((s, i) =>
    `${i > 0 ? " + " : ""}${s.disc.toFixed(3)} \\cdot (${s.reward >= 0 ? "+" : ""}${s.reward})`
  ).join("");
  // Вклады — это награды, то есть роль target (ENF-COLOR-010). Знак «+»/«−»
  // печатается явно и служит вторым признаком, поэтому пара «зелёное/красное»
  // как единственное отличие не нужна и запрещена (ENF-COLOR-041).
  const contribParts = steps.map((s, i) =>
    `${i > 0 ? " + " : ""}\\enfTgt{${s.contrib >= 0 ? "+" : ""}${s.contrib.toFixed(3)}}`
  ).join("");

  return (
    <Card className="my-6 border-primary/20 bg-card/60 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div style={{
          padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${C.border}`, flexWrap: "wrap", gap: 12
        }}>
          <div style={{ fontFamily: C.display, fontSize: 15, fontWeight: 700, letterSpacing: "0.15em",
            background: `linear-gradient(90deg,${C.cyan},${C.magenta})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Функция ценности V(s)
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <Pill texLabel={`V(${STATES[startState].tex})`} value={G.toFixed(3)} color={C.cyan} />
            <Pill texLabel="\\gamma" value={gamma.toFixed(2)} color={C.amber} />
            <Pill texLabel="\\text{Горизонт}" value={horizon} color={C.green} />
          </div>
        </div>

        {/* Body */}
        <div style={{ display: "flex", minHeight: 500 }} className="flex-col lg:flex-row">
          {/* Sidebar */}
          <aside style={{
            flexShrink: 0, padding: "22px 20px", borderRight: `1px solid ${C.border}`,
            display: "flex", flexDirection: "column", gap: 16, overflowY: "auto"
          }} className="w-full lg:w-[310px] lg:border-r border-b lg:border-b-0">

            <div>
              <div style={{ fontFamily: C.display, fontSize: 12, letterSpacing: "0.18em", color: C.txtMuted, textTransform: "uppercase", marginBottom: 12 }}>
                Начальное состояние
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {STATES.slice(0, REWARDS.length).map((s, i) => (
                  <button key={i} onClick={() => setStartState(i)} style={{
                    fontFamily: C.mono, fontSize: 14, fontWeight: startState === i ? 700 : 400,
                    color: startState === i ? s.color : C.txtDim,
                    background: startState === i ? `${s.color}12` : "rgba(255,255,255,0.02)",
                    border: `1px solid ${startState === i ? s.color + "40" : C.border}`,
                    borderRadius: 22, padding: "8px 16px", cursor: "pointer", transition: C.trans,
                  }}><Tex size={1.05} color={startState === i ? s.color : C.txtDim}>{s.tex}</Tex></button>
                ))}
              </div>
              <p style={{ fontFamily: C.sans, fontSize: 13, color: C.txtDim, marginTop: 10, lineHeight: 1.6 }}>
                Выберите, из какого состояния агент начинает путь к цели.
              </p>
            </div>

            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
              <div style={{ fontFamily: C.display, fontSize: 12, letterSpacing: "0.18em", color: C.txtMuted, textTransform: "uppercase", marginBottom: 14 }}>
                Дисконт-фактор
              </div>
              <GammaSliderCustom texLabel="\\gamma \\text{ (gamma)}" value={gamma} min={0.0} max={0.99} step={0.01} onChange={setGamma} color={C.amber} />
              <div style={{
                fontFamily: C.sans, fontSize: 13, color: C.txtDim, lineHeight: 1.6,
                padding: "10px 12px", borderRadius: C.radiusSm, background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`
              }}>
                {gammaHint}
              </div>
            </div>

            {/* All V(s) */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
              <div style={{ fontFamily: C.display, fontSize: 12, letterSpacing: "0.18em", color: C.txtMuted, textTransform: "uppercase", marginBottom: 10 }}>
                <Tex size={0.9} color={C.txtMuted}>{"V(s)"}</Tex> всех состояний
              </div>
              {STATES.map((s, i) => {
                const val = allValues[i], maxV = Math.max(...allValues.map(Math.abs), 0.1);
                const pct = Math.max(1, Math.abs(val) / maxV * 100);
                return (
                  <div key={i} style={{ marginBottom: 8, cursor: i < REWARDS.length ? "pointer" : "default", opacity: i < REWARDS.length ? 1 : 0.4 }}
                    onClick={() => i < REWARDS.length && setStartState(i)}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Tex size={1.0} color={i === startState ? s.color : C.txtDim}>{`V(${s.tex})`}</Tex>
                        <span style={{ fontFamily: C.sans, fontSize: 11, color: C.txtMuted }}>{s.label}</span>
                      </span>
                      <span style={{ fontFamily: C.mono, fontSize: 14, color: s.color, fontWeight: 600 }}>{val.toFixed(2)}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.04)" }}>
                      <div style={{
                        height: "100%", borderRadius: 2, width: `${pct}%`,
                        background: `linear-gradient(90deg,${s.color}50,${s.color})`, transition: "width 0.3s ease"
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main formula */}
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
              <div style={{ fontFamily: C.display, fontSize: 12, letterSpacing: "0.18em", color: C.txtMuted, textTransform: "uppercase", marginBottom: 10 }}>
                Функция ценности состояния
              </div>
              <div style={{ fontFamily: C.sans, fontSize: 13, color: C.txtDim, lineHeight: 1.6, marginBottom: 10 }}>
                {"При заданной политике "}
                <Tex size={1.05} color={C.txt}>{"\\pi"}</Tex>
                {" определим функцию ценности как математическое ожидание дисконтированного возврата:"}
              </div>
              <div style={{
                padding: "16px 10px", borderRadius: C.radiusSm,
                background: "rgba(0,255,214,0.04)", border: "1px solid rgba(0,255,214,0.1)",
                textAlign: "center", overflowX: "auto"
              }}>
                <Tex display size={1.2} color={C.cyan}>
                  {"V^{\\pi}(s) = \\mathbb{E}_{\\pi}\\!\\left[\\sum_{t=0}^{\\infty} \\gamma^{\\,t}\\, R_{t+1} \\;\\middle|\\; S_0 = s\\right]"}
                </Tex>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main style={{ flex: 1, display: "flex", flexDirection: "column", padding: 20, gap: 14, overflowY: "auto" }}>
            {/* MDP */}
            <div style={{
              borderRadius: C.radius, background: C.card, border: `1px solid ${C.cyan}15`,
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)"
            }}>
              <div style={{ padding: "10px 16px 0", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: C.mono, fontSize: 13, color: C.txtDim }}>MDP: цепочка состояний с наградами</span>
                <span style={{ fontFamily: C.sans, fontSize: 12, color: C.txtMuted }}>Наведите на карточку шага</span>
              </div>
              <MDPDiagram startState={startState} steps={steps} highlightStep={hlStep} onSelect={setStartState} gamma={gamma} />
            </div>

            {/* Explanation */}
            <div style={{
              padding: "16px 20px", borderRadius: C.radiusSm,
              background: "rgba(0,255,214,0.03)", border: `1px solid ${C.cyan}15`
            }}>
              <div style={{ fontFamily: C.display, fontSize: 12, letterSpacing: "0.18em", color: C.cyan, textTransform: "uppercase", marginBottom: 10 }}>
                Как вычисляется <Tex size={1.0} color={C.cyan}>{`V(${STATES[startState].tex})`}</Tex> ?
              </div>
              <p style={{ fontFamily: C.sans, fontSize: 15, color: C.txt, lineHeight: 1.9, marginBottom: 8 }}>
                Агент в <span style={{ color: STATES[startState].color, fontWeight: 600 }}>{STATES[startState].label}</span>.
                Впереди <span style={{ fontWeight: 600 }}>{steps.length}</span> шагов до цели.
                Каждая будущая награда <Tex size={1.0} color={C.green}>R_k</Tex> умножается на <Tex size={1.1} color={C.amber}>{`\\gamma^k`}</Tex> — чем дальше награда, тем меньше её вклад.
              </p>
              {/* Live formula decomposition */}
              <div style={{
                padding: "14px 16px", borderRadius: C.radiusSm, background: "rgba(0,0,0,0.2)",
                border: `1px solid ${C.border}`, marginTop: 8, overflowX: "auto"
              }}>
                <div style={{ marginBottom: 8 }}>
                  <Tex display size={1.15} color={C.txt}>{`V(${STATES[startState].tex}) = ${formulaParts}`}</Tex>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Tex display size={1.1} color={C.txtDim}>{`= ${numericParts}`}</Tex>
                </div>
                <div>
                  <Tex display size={1.2}>{`= ${contribParts} = \\enfOp{\\mathbf{${G.toFixed(3)}}}`}</Tex>
                </div>
              </div>
            </div>

            {/* Step cards */}
            <div>
              <div style={{ fontFamily: C.display, fontSize: 12, letterSpacing: "0.18em", color: C.txtMuted, textTransform: "uppercase", marginBottom: 10 }}>
                Пошаговый расчёт
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {steps.map((s, i) => (
                  <StepCard key={i} step={s} isHL={hlStep === i}
                    onEnter={() => setHlStep(i)} onLeave={() => setHlStep(null)} />
                ))}
                <div style={{
                  flex: "1 1 140px", minWidth: 140, padding: "16px 14px", borderRadius: C.radiusSm,
                  background: "rgba(0,255,214,0.06)", border: `1px solid ${C.cyan}30`
                }}>
                  <div style={{ fontFamily: C.display, fontSize: 10, color: C.cyan, letterSpacing: "0.12em", marginBottom: 10 }}>
                    ИТОГО
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <Tex display size={1.4} color={C.cyan}>{`V(${STATES[startState].tex}) = ${G.toFixed(3)}`}</Tex>
                  </div>
                  <div style={{ fontFamily: C.mono, fontSize: 12, color: C.txtDim, lineHeight: 1.8 }}>
                    {steps.map((s, i) => (
                      <span key={i}>
                        {i > 0 && " + "}
                        <span style={{ color: s.contrib >= 0 ? C.green : C.red }}>
                          {s.contrib >= 0 ? "+" : ""}{s.contrib.toFixed(2)}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div style={{ display: "flex", gap: 14 }} className="flex-col md:flex-row">
              <div style={{ flex: 1, padding: "16px 20px", borderRadius: C.radiusSm, background: C.card, border: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: C.display, fontSize: 12, letterSpacing: "0.18em", color: C.txtMuted, textTransform: "uppercase", marginBottom: 10 }}>
                  Зачем нужна <Tex size={0.9} color={C.txtMuted}>V(s)</Tex> ?
                </div>
                <p style={{ fontFamily: C.sans, fontSize: 14, color: C.txtDim, lineHeight: 1.8 }}>
                  <Tex size={1.0} color={C.txt}>V(s)</Tex> — это <span style={{ color: C.txt }}>«перспективность»</span> состояния.
                  Если <Tex size={1.0} color={STATES[0].color}>{`V(S_0) = ${allValues[0].toFixed(1)}`}</Tex>, а{" "}
                  <Tex size={1.0} color={STATES[2].color}>{`V(S_2) = ${allValues[2].toFixed(1)}`}</Tex> — агент знает,
                  что <Tex size={1.0} color={STATES[0].color}>S_0</Tex> выгоднее, и стремится туда.
                </p>
              </div>
              <div style={{ flex: 1, padding: "16px 20px", borderRadius: C.radiusSm, background: C.card, border: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: C.display, fontSize: 12, letterSpacing: "0.18em", color: C.txtMuted, textTransform: "uppercase", marginBottom: 10 }}>
                  Почему <Tex size={0.9} color={C.txtMuted}>{"\\gamma < 1"}</Tex> ?
                </div>
                <p style={{ fontFamily: C.sans, fontSize: 14, color: C.txtDim, lineHeight: 1.8 }}>
                  Без дисконтирования (<Tex size={0.95}>{"\\gamma = 1"}</Tex>) бесконечная сумма расходится.{" "}
                  <Tex size={0.95}>{"\\gamma < 1"}</Tex> гарантирует <span style={{ color: C.cyan }}>сходимость</span> ряда.
                  Эффективный горизонт: <Tex size={1.05} color={C.amber}>{`\\frac{1}{1-\\gamma} = ${horizon}`}</Tex> шагов.
                </p>
              </div>
            </div>
          </main>
        </div>

        <style>{`
          .katex { font-size:inherit !important; }
          .katex .mathnormal, .katex .mathit { color:inherit; }
          @keyframes vfvSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          .vfv-slider input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance:none; width:16px; height:16px; border-radius:50%;
            background:${C.amber}; box-shadow:0 0 8px ${C.amberDim}; cursor:pointer; border:2px solid #06080D;
          }
          .vfv-slider input[type="range"]::-moz-range-thumb {
            width:16px; height:16px; border-radius:50%;
            background:${C.amber}; box-shadow:0 0 8px ${C.amberDim}; cursor:pointer; border:2px solid #06080D;
          }
        `}</style>
      </CardContent>
    </Card>
  );
};

export default ValueFunctionViz;
