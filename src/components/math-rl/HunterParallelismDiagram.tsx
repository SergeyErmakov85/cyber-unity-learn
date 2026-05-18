/**
 * HunterParallelismDiagram — SVG-схема параллелизма обучения Охотника
 * (раздел C.3 research-артефакта).
 *
 * Поток:
 *   TrainingArea#1..N (в одной Unity-сцене)
 *        └──► общий Behavior "Hunter" + общий буфер опыта
 *                  └──► mlagents-learn (PPO update)
 *                            └──► (опц.) ─num-envs=K  (K параллельных процессов Unity)
 *
 * Чисто SVG, без Canvas. Дизайн-токены C: фон #06080D, неон #00FFD6 / #D946EF,
 * текст #F4F7FC / #B0B8CE, бордеры rgba(255,255,255,0.05).
 */

const CYAN = "#00FFD6";
const MAGENTA = "#D946EF";
const TEXT = "#F4F7FC";
const DIM = "#B0B8CE";
const MUTED = "#6B7490";
const BORDER = "rgba(255,255,255,0.08)";
const SURFACE = "rgba(255,255,255,0.03)";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const HunterParallelismDiagram = () => (
  <div
    className="w-full overflow-x-auto"
    role="img"
    aria-label="Схема параллелизма обучения Охотника: множество TrainingArea внутри одной Unity-сцены через общий Behavior и буфер ведут в mlagents-learn; опционально подключается несколько процессов через --num-envs"
  >
    <svg
      viewBox="0 0 880 420"
      width="100%"
      style={{ maxWidth: 880, minWidth: 560, display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id="arrowCyan"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={CYAN} />
        </marker>
        <marker
          id="arrowMagenta"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={MAGENTA} />
        </marker>
      </defs>

      {/* ── Большая рамка: Unity scene (process #1) ─────────────────────── */}
      <rect
        x="20"
        y="20"
        width="540"
        height="280"
        rx="14"
        fill={SURFACE}
        stroke={BORDER}
        strokeWidth="1"
      />
      <text
        x="36"
        y="46"
        fill={DIM}
        fontFamily={MONO}
        fontSize="12"
        letterSpacing="0.04em"
      >
        Unity scene · process #1
      </text>

      {/* 4 TrainingArea boxes (3×3 — рисуем 4 как иллюстрацию N) */}
      {[
        { x: 44, y: 70, label: "TrainingArea #1" },
        { x: 204, y: 70, label: "TrainingArea #2" },
        { x: 44, y: 156, label: "TrainingArea #3" },
        { x: 204, y: 156, label: "TrainingArea #N" },
      ].map((b) => (
        <g key={b.label}>
          <rect
            x={b.x}
            y={b.y}
            width="140"
            height="64"
            rx="8"
            fill="rgba(0,255,214,0.05)"
            stroke={`${CYAN}55`}
            strokeWidth="1"
          />
          <text
            x={b.x + 12}
            y={b.y + 24}
            fill={TEXT}
            fontFamily={MONO}
            fontSize="12"
          >
            {b.label}
          </text>
          <text
            x={b.x + 12}
            y={b.y + 44}
            fill={MUTED}
            fontFamily={MONO}
            fontSize="11"
          >
            Hunter + Target
          </text>
        </g>
      ))}

      {/* ── Общий Behavior / Buffer (правая колонка в этой же сцене) ────── */}
      <rect
        x="380"
        y="80"
        width="160"
        height="200"
        rx="10"
        fill="rgba(217,70,239,0.06)"
        stroke={`${MAGENTA}66`}
        strokeWidth="1"
      />
      <text
        x="396"
        y="108"
        fill={MAGENTA}
        fontFamily={MONO}
        fontSize="12"
        letterSpacing="0.04em"
      >
        Behavior: Hunter
      </text>
      <text
        x="396"
        y="148"
        fill={TEXT}
        fontFamily={MONO}
        fontSize="12"
      >
        Shared buffer
      </text>
      <text x="396" y="166" fill={DIM} fontFamily={MONO} fontSize="11">
        buffer_size = 20480
      </text>
      <text x="396" y="184" fill={DIM} fontFamily={MONO} fontSize="11">
        batch_size = 2048
      </text>
      <text x="396" y="216" fill={MUTED} fontFamily={MONO} fontSize="11">
        on-policy rollout
      </text>
      <text x="396" y="234" fill={MUTED} fontFamily={MONO} fontSize="11">
        агрегация ↑ от всех арен
      </text>

      {/* Стрелки от арен к общему буферу */}
      {[
        { x1: 184, y1: 102, x2: 380, y2: 130 },
        { x1: 344, y1: 102, x2: 380, y2: 150 },
        { x1: 184, y1: 188, x2: 380, y2: 180 },
        { x1: 344, y1: 188, x2: 380, y2: 200 },
      ].map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke={CYAN}
          strokeWidth="1.2"
          markerEnd="url(#arrowCyan)"
          opacity="0.85"
        />
      ))}

      {/* ── mlagents-learn (PPO update) ─────────────────────────────────── */}
      <rect
        x="610"
        y="120"
        width="240"
        height="120"
        rx="12"
        fill="rgba(0,255,214,0.04)"
        stroke={`${CYAN}99`}
        strokeWidth="1.2"
      />
      <text
        x="626"
        y="148"
        fill={CYAN}
        fontFamily={MONO}
        fontSize="13"
        letterSpacing="0.04em"
      >
        mlagents-learn
      </text>
      <text x="626" y="172" fill={TEXT} fontFamily={MONO} fontSize="12">
        PPO update
      </text>
      <text x="626" y="190" fill={DIM} fontFamily={MONO} fontSize="11">
        clipped surrogate L^CLIP
      </text>
      <text x="626" y="208" fill={DIM} fontFamily={MONO} fontSize="11">
        Adam · lr = 3e-4
      </text>
      <text x="626" y="226" fill={MUTED} fontFamily={MONO} fontSize="11">
        TensorBoard logs ↗
      </text>

      {/* Buffer → trainer */}
      <line
        x1="540"
        y1="180"
        x2="610"
        y2="180"
        stroke={MAGENTA}
        strokeWidth="1.5"
        markerEnd="url(#arrowMagenta)"
      />

      {/* Trainer → policy update (обратная стрелка к Behavior) */}
      <path
        d="M 700,120 C 700,80 540,60 460,80"
        fill="none"
        stroke={CYAN}
        strokeWidth="1.2"
        strokeDasharray="4 4"
        markerEnd="url(#arrowCyan)"
        opacity="0.7"
      />
      <text x="540" y="72" fill={DIM} fontFamily={MONO} fontSize="11">
        π update
      </text>

      {/* ── Опциональный --num-envs (доп. процессы Unity) ──────────────── */}
      <rect
        x="20"
        y="320"
        width="540"
        height="80"
        rx="12"
        fill={SURFACE}
        stroke={`${MAGENTA}44`}
        strokeDasharray="5 4"
        strokeWidth="1"
      />
      <text
        x="36"
        y="346"
        fill={MAGENTA}
        fontFamily={MONO}
        fontSize="12"
        letterSpacing="0.04em"
      >
        (опц.) --num-envs = K
      </text>
      <text x="36" y="370" fill={DIM} fontFamily={MONO} fontSize="11">
        Unity scene · process #2 … #K
      </text>
      <text x="36" y="388" fill={MUTED} fontFamily={MONO} fontSize="11">
        каждый — отдельный билд, тот же Behavior «Hunter»
      </text>

      {/* доп. процессы тоже идут в trainer */}
      <path
        d="M 560,360 C 660,360 700,300 720,240"
        fill="none"
        stroke={MAGENTA}
        strokeWidth="1.2"
        strokeDasharray="4 4"
        markerEnd="url(#arrowMagenta)"
        opacity="0.7"
      />
    </svg>
  </div>
);

export default HunterParallelismDiagram;
