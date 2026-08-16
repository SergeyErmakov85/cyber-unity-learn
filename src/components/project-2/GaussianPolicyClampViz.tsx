/**
 * GaussianPolicyClampViz — почему в ML-Agents PPO обязателен Mathf.Clamp.
 *
 * Используется в src/pages/CourseProject2.tsx, секция #continuous-control,
 * внутри карточки «Гауссова политика и зачем нужен Mathf.Clamp», сразу после
 * моноширинного блока с кодом clamp.
 *
 * Показывает плотность N(μ, σ²): область [-1,+1] — CYAN, хвосты — MAGENTA.
 * Тоггл «Mathf.Clamp» переключает анимацию сэмплов и форму кривой энтропии.
 */

import { useEffect, useRef, useState } from "react";
import MathTex from "@/components/Math";

const TEXT = "#F4F7FC";
const DIM = "#B0B8CE";
const MUTED = "#6B7490";
const CYAN = "#00FFD6";
const MAGENTA = "#D946EF";
const BORDER = "rgba(255,255,255,0.05)";
const SURFACE = "rgba(255,255,255,0.02)";
const ORBITRON = "'Orbitron', ui-sans-serif, system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

// ── PDF / CDF normal ────────────────────────────────────────────────────
const SQRT_2 = Math.sqrt(2);
const SQRT_2PI = Math.sqrt(2 * Math.PI);

// Abramowitz & Stegun 7.1.26 (max error 1.5e-7)
function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y =
    1 -
    (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
}

const pdf = (x: number, mu: number, sigma: number) =>
  Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma)) / (sigma * SQRT_2PI);

// P(|a| > 1) для N(μ, σ²)
function tailMass(mu: number, sigma: number): number {
  const cdf = (z: number) => 0.5 * (1 + erf(z / SQRT_2));
  const inside = cdf((1 - mu) / sigma) - cdf((-1 - mu) / sigma);
  return Math.max(0, Math.min(1, 1 - inside));
}

// ── SVG-геометрия графика плотности ─────────────────────────────────────
const VB_W = 560;
const VB_H = 230;
const PAD_L = 36;
const PAD_R = 16;
const PAD_T = 18;
const PAD_B = 30;
const PLOT_W = VB_W - PAD_L - PAD_R;
const PLOT_H = VB_H - PAD_T - PAD_B;
const X_MIN = -3;
const X_MAX = 3;
const Y_MAX = 2.2; // верхняя граница плотности (σ_min=0.2 даёт ~2.0)
const SAMPLES_X = 240;

const xToPx = (x: number) =>
  PAD_L + ((x - X_MIN) / (X_MAX - X_MIN)) * PLOT_W;
const yToPx = (y: number) => PAD_T + PLOT_H - (y / Y_MAX) * PLOT_H;

// ── Мини-график энтропии ────────────────────────────────────────────────
const ENT_W = 200;
const ENT_H = 80;
const ENT_MAX_POINTS = 100;

const GaussianPolicyClampViz = () => {
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(0.6);
  const [clamp, setClamp] = useState(false);
  const clampRef = useRef(false);
  useEffect(() => {
    clampRef.current = clamp;
  }, [clamp]);

  // Сэмпл-точка и плашка «реактивный буст»
  const sampleRef = useRef<{ a: number; alpha: number; tail: boolean }>({
    a: 0,
    alpha: 0,
    tail: false,
  });
  const frameCntRef = useRef(0);
  const entropyRef = useRef<number[]>([]);
  const [, setTick] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const loop = () => {
      frameCntRef.current += 1;
      // новый «сэмпл из политики» раз в ~10 кадров для CYAN-точки
      if (frameCntRef.current % 10 === 0) {
        const u1 = Math.random() || 1e-6;
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        let a = mu + sigma * z;
        const tail = Math.abs(a) > 1;
        if (clampRef.current) a = Math.max(-1, Math.min(1, a));
        sampleRef.current = { a, alpha: 1, tail: tail && !clampRef.current };
      }
      // «реактивный буст»: раз в ~50 кадров без clamp принудительно показываем хвостовой
      if (!clampRef.current && frameCntRef.current % 50 === 0) {
        const sign = Math.random() < 0.5 ? -1 : 1;
        sampleRef.current = {
          a: sign * (2.5 + Math.random() * 0.8),
          alpha: 1,
          tail: true,
        };
      }
      // fade плашки
      sampleRef.current.alpha = Math.max(0, sampleRef.current.alpha - 0.02);

      // обновление кривой энтропии раз в 6 кадров
      if (frameCntRef.current % 6 === 0) {
        const arr = entropyRef.current;
        const last = arr.length ? arr[arr.length - 1] : 0.8;
        const target = clampRef.current ? 0.15 : 1.15;
        const next = last + (target - last) * 0.04 + (Math.random() - 0.5) * 0.01;
        arr.push(Math.max(0, Math.min(1.4, next)));
        if (arr.length > ENT_MAX_POINTS) arr.shift();
      }

      setTick((k) => (k + 1) % 1_000_000);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [mu, sigma]);

  // ── Построение path плотности ─────────────────────────────────────────
  const points: { x: number; y: number; px: number; py: number }[] = [];
  for (let i = 0; i <= SAMPLES_X; i++) {
    const x = X_MIN + (i / SAMPLES_X) * (X_MAX - X_MIN);
    const y = pdf(x, mu, sigma);
    points.push({ x, y, px: xToPx(x), py: yToPx(y) });
  }
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.px.toFixed(1)} ${p.py.toFixed(1)}`)
    .join(" ");

  const baseY = yToPx(0);
  const buildArea = (xLo: number, xHi: number) => {
    const seg = points.filter((p) => p.x >= xLo - 1e-9 && p.x <= xHi + 1e-9);
    if (seg.length < 2) return "";
    const head = `M ${xToPx(xLo).toFixed(1)} ${baseY.toFixed(1)}`;
    const mid = seg
      .map((p) => `L ${p.px.toFixed(1)} ${p.py.toFixed(1)}`)
      .join(" ");
    const tail = ` L ${xToPx(xHi).toFixed(1)} ${baseY.toFixed(1)} Z`;
    return head + " " + mid + tail;
  };

  const safeArea = buildArea(-1, 1);
  const leftTail = buildArea(X_MIN, -1);
  const rightTail = buildArea(1, X_MAX);
  const tailPct = (tailMass(mu, sigma) * 100).toFixed(1);

  const s = sampleRef.current;
  const sampleVisibleX = Math.max(X_MIN, Math.min(X_MAX, s.a));
  const sampleY = pdf(sampleVisibleX, mu, sigma);

  // Entropy mini-chart
  const ent = entropyRef.current;
  const entPath = ent
    .map((v, i) => {
      const px = (i / (ENT_MAX_POINTS - 1)) * ENT_W;
      const py = ENT_H - (v / 1.4) * ENT_H;
      return `${i === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div
      className="rounded-xl"
      style={{
        border: `1px solid ${BORDER}`,
        background: "rgba(0,0,0,0.25)",
        padding: 16,
        marginTop: 12,
      }}
    >
      <h3
        style={{
          fontFamily: ORBITRON,
          color: TEXT,
          fontSize: 16,
          letterSpacing: "0.04em",
          marginBottom: 12,
        }}
      >
        Гауссова политика без squashing → ручной clamp обязателен
      </h3>

      {/* Контролы */}
      <div className="flex flex-wrap items-center gap-4 mb-3">
        <label className="flex items-center gap-2" style={{ minWidth: 200 }}>
          <span style={{ fontFamily: MONO, fontSize: 12, color: DIM }}>
            μ
          </span>
          <input
            type="range"
            min={-1}
            max={1}
            step={0.05}
            value={mu}
            onChange={(e) => setMu(Number(e.target.value))}
            style={{ accentColor: CYAN, flex: 1, maxWidth: 150 }}
            aria-label="Среднее политики mu"
          />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: TEXT,
              minWidth: 44,
            }}
          >
            {mu.toFixed(2)}
          </span>
        </label>

        <label className="flex items-center gap-2" style={{ minWidth: 200 }}>
          <span style={{ fontFamily: MONO, fontSize: 12, color: DIM }}>
            σ
          </span>
          <input
            type="range"
            min={0.2}
            max={1.5}
            step={0.05}
            value={sigma}
            onChange={(e) => setSigma(Number(e.target.value))}
            style={{ accentColor: MAGENTA, flex: 1, maxWidth: 150 }}
            aria-label="Разброс политики sigma"
          />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: TEXT,
              minWidth: 44,
            }}
          >
            {sigma.toFixed(2)}
          </span>
        </label>

        <button
          type="button"
          onClick={() => setClamp((v) => !v)}
          style={{
            fontFamily: MONO,
            fontSize: 12,
            padding: "6px 12px",
            borderRadius: 6,
            border: `1px solid ${clamp ? CYAN : MAGENTA}66`,
            background: clamp ? "rgba(0,255,214,0.10)" : "rgba(217,70,239,0.10)",
            color: clamp ? CYAN : MAGENTA,
            cursor: "pointer",
          }}
          aria-pressed={clamp}
        >
          Mathf.Clamp: {clamp ? "ON" : "OFF"}
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_220px] gap-4 items-start">
        {/* Основной график плотности */}
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            width="100%"
            style={{ display: "block", minWidth: 480, maxWidth: 720 }}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Плотность нормального распределения политики с подсветкой хвостов за пределами минус один плюс один"
          >
            {/* Базовая ось X */}
            <line
              x1={PAD_L}
              y1={baseY}
              x2={PAD_L + PLOT_W}
              y2={baseY}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
            {/* Тики и подписи */}
            {[-3, -2, -1, 0, 1, 2, 3].map((tx) => (
              <g key={tx}>
                <line
                  x1={xToPx(tx)}
                  y1={baseY}
                  x2={xToPx(tx)}
                  y2={baseY + 4}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                />
                <text
                  x={xToPx(tx)}
                  y={baseY + 16}
                  textAnchor="middle"
                  fontFamily={MONO}
                  fontSize="10"
                  fill={MUTED}
                >
                  {tx}
                </text>
              </g>
            ))}

            {/* Границы action-space ±1 */}
            {[-1, 1].map((b) => (
              <line
                key={b}
                x1={xToPx(b)}
                y1={PAD_T}
                x2={xToPx(b)}
                y2={baseY}
                stroke={MUTED}
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            ))}
            <text
              x={xToPx(-1)}
              y={PAD_T - 4}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize="10"
              fill={MUTED}
            >
              −1
            </text>
            <text
              x={xToPx(1)}
              y={PAD_T - 4}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize="10"
              fill={MUTED}
            >
              +1
            </text>

            {/* Хвосты MAGENTA */}
            {leftTail && (
              <path d={leftTail} fill={MAGENTA} fillOpacity="0.28" />
            )}
            {rightTail && (
              <path d={rightTail} fill={MAGENTA} fillOpacity="0.28" />
            )}
            {/* Безопасная зона CYAN */}
            {safeArea && (
              <path d={safeArea} fill={CYAN} fillOpacity="0.22" />
            )}

            {/* Кривая плотности */}
            <path
              d={linePath}
              fill="none"
              stroke={TEXT}
              strokeWidth="1.5"
              opacity="0.9"
            />

            {/* Подпись доли хвостовой массы */}
            <text
              x={PAD_L + PLOT_W - 6}
              y={PAD_T + 14}
              textAnchor="end"
              fontFamily={MONO}
              fontSize="12"
              fill={MAGENTA}
            >
              P(|a| &gt; 1) ≈ {tailPct}%
            </text>

            {/* Сэмпл-точка */}
            <circle
              cx={xToPx(sampleVisibleX)}
              cy={yToPx(sampleY)}
              r={5}
              fill={s.tail ? MAGENTA : CYAN}
              opacity={s.alpha * 0.95}
            />
            <line
              x1={xToPx(sampleVisibleX)}
              y1={yToPx(sampleY)}
              x2={xToPx(sampleVisibleX)}
              y2={baseY}
              stroke={s.tail ? MAGENTA : CYAN}
              strokeWidth="1"
              opacity={s.alpha * 0.6}
            />

            {/* «реактивный буст» плашка */}
            {s.tail && s.alpha > 0.4 && (
              <g opacity={s.alpha}>
                <rect
                  x={xToPx(sampleVisibleX) + 10}
                  y={yToPx(sampleY) - 28}
                  width="118"
                  height="22"
                  rx="4"
                  fill="rgba(217,70,239,0.18)"
                  stroke={MAGENTA}
                  strokeWidth="1"
                />
                <text
                  x={xToPx(sampleVisibleX) + 18}
                  y={yToPx(sampleY) - 13}
                  fontFamily={MONO}
                  fontSize="11"
                  fill={MAGENTA}
                >
                  реактивный буст: a={s.a.toFixed(2)}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Мини-график Policy/Entropy */}
        <div
          className="rounded-md p-3"
          style={{ border: `1px solid ${BORDER}`, background: SURFACE }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              color: DIM,
              marginBottom: 6,
            }}
          >
            Policy / Entropy
          </div>
          <svg
            viewBox={`0 0 ${ENT_W} ${ENT_H}`}
            width="100%"
            style={{ display: "block" }}
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Симуляция кривой Policy slash Entropy в TensorBoard"
          >
            <line
              x1={0}
              y1={ENT_H - 1}
              x2={ENT_W}
              y2={ENT_H - 1}
              stroke="rgba(255,255,255,0.15)"
            />
            {entPath && (
              <path
                d={entPath}
                fill="none"
                stroke={clamp ? CYAN : MAGENTA}
                strokeWidth="1.5"
              />
            )}
          </svg>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: MUTED,
              marginTop: 6,
              lineHeight: 1.4,
            }}
          >
            {clamp
              ? "clamp ON → энтропия плавно ↓ (политика заостряется)"
              : "clamp OFF → энтропия ↑ из-за «бустов»"}
          </div>
        </div>
      </div>

      {/* Формулы */}
      <div
        className="mt-4 px-3 py-2 rounded-md space-y-1"
        style={{
          border: `1px solid ${BORDER}`,
          background: SURFACE,
          color: TEXT,
          overflowX: "auto",
        }}
      >
        <MathTex>
          {"\\pi_{\\theta}(a \\mid \\enfVar{s}) = \\mathcal{N}\\!\\big(\\mu_{\\theta}(\\enfVar{s}),\\ \\operatorname{diag}\\sigma_{\\theta}^{2}(\\enfVar{s})\\big)"}
        </MathTex>
        <MathTex display={false}>
          {"a_{\\text{env}} = \\operatorname{clip}(a,\\, -1,\\, +1)"}
        </MathTex>
      </div>

      <p
        style={{
          color: DIM,
          fontSize: 13,
          lineHeight: 1.6,
          marginTop: 10,
        }}
      >
        В ML-Agents (в отличие от SB3/SAC) tanh-squashing выключен — без{" "}
        <span style={{ fontFamily: MONO, color: TEXT }}>Mathf.Clamp</span>{" "}
        Охотник раз в ~50 шагов получает буст из хвоста, и PPO долго не
        сходится.
      </p>
    </div>
  );
};

export default GaussianPolicyClampViz;
