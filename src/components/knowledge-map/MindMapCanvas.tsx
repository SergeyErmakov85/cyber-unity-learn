import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  X,
  ChevronRight,
} from "lucide-react";
import {
  KNOWLEDGE_MAP,
  ROOT,
  BRANCH_HSL,
  DIFFICULTY_META,
  type Difficulty,
  type MapBranch,
  type MapNode,
} from "@/content/knowledgeMap";

/* ------------------------------------------------------------------ *
 *  Виртуальный холст и геометрия радиальной mind-map                  *
 * ------------------------------------------------------------------ */
const VW = 1700;
const VH = 1140;
const CX = VW / 2;
const CY = VH / 2;
const BRANCH_R = 250;
const LEAF_BASE = 450;
const LEAF_STAGGER = 120;

type Pt = { x: number; y: number };

interface LeafLayout {
  node: MapNode;
  pos: Pt;
  branch: MapBranch;
}
interface BranchLayout {
  branch: MapBranch;
  pos: Pt;
  leaves: LeafLayout[];
}

function polar(cx: number, cy: number, r: number, deg: number): Pt {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** Плавная кубическая кривая с лёгким изгибом между двумя точками. */
function curve(p: Pt, c: Pt): string {
  const dx = c.x - p.x;
  const dy = c.y - p.y;
  const dist = Math.hypot(dx, dy) || 1;
  // перпендикуляр для лёгкого «лука»
  const px = -dy / dist;
  const py = dx / dist;
  const bow = dist * 0.1;
  const c1 = { x: p.x + dx * 0.35 + px * bow, y: p.y + dy * 0.35 + py * bow };
  const c2 = { x: p.x + dx * 0.65 + px * bow, y: p.y + dy * 0.65 + py * bow };
  return `M ${p.x} ${p.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${c.x} ${c.y}`;
}

function buildLayout(): BranchLayout[] {
  const n = KNOWLEDGE_MAP.length;
  return KNOWLEDGE_MAP.map((branch, i) => {
    const base = -90 + (360 / n) * i; // старт сверху, по часовой
    const pos = polar(CX, CY, BRANCH_R, base);
    const k = branch.nodes.length;
    const spread = Math.min(k * 13, 66); // угловой размах веера листьев
    const step = k > 1 ? spread / (k - 1) : 0;
    const start = base - spread / 2;
    const leaves: LeafLayout[] = branch.nodes.map((node, j) => {
      const ang = start + step * j;
      const r = LEAF_BASE + (j % 2 === 0 ? 0 : LEAF_STAGGER);
      return { node, pos: polar(CX, CY, r, ang), branch };
    });
    return { branch, pos, leaves };
  });
}

/* ------------------------------------------------------------------ */

interface Props {
  difficultyFilter: Difficulty | "all";
  query: string;
}

const MindMapCanvas = ({ difficultyFilter, query }: Props) => {
  const navigate = useNavigate();
  const layout = useMemo(buildLayout, []);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, scale: 0.62 });
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [hover, setHover] = useState<string | null>(null);

  const q = query.trim().toLowerCase();

  const matches = useCallback(
    (node: MapNode) => {
      const byDiff = difficultyFilter === "all" || node.difficulty === difficultyFilter;
      const byQuery = !q || node.label.toLowerCase().includes(q) || node.blurb.toLowerCase().includes(q);
      return byDiff && byQuery;
    },
    [difficultyFilter, q],
  );

  const filtering = difficultyFilter !== "all" || q.length > 0;

  /* fit-to-view при монтировании и ресайзе */
  const fit = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const { clientWidth: w, clientHeight: h } = el;
    const scale = Math.min(w / VW, h / VH) * 0.96;
    setView({ x: (w - VW * scale) / 2, y: (h - VH * scale) / 2, scale });
  }, []);

  useEffect(() => {
    fit();
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fit]);

  /* zoom колесом */
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setView((v) => {
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      const scale = Math.min(2.2, Math.max(0.25, v.scale * factor));
      const k = scale / v.scale;
      return { scale, x: mx - (mx - v.x) * k, y: my - (my - v.y) * k };
    });
  }, []);

  /* pan перетаскиванием фона */
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    drag.current = { sx: e.clientX, sy: e.clientY, ox: view.x, oy: view.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    setView((v) => ({ ...v, x: d.ox + dx, y: d.oy + dy }));
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  const zoomBtn = (dir: 1 | -1) =>
    setView((v) => {
      const scale = Math.min(2.2, Math.max(0.25, v.scale * (dir > 0 ? 1.2 : 1 / 1.2)));
      const k = scale / v.scale;
      const cx = (wrapRef.current?.clientWidth ?? VW) / 2;
      const cy = (wrapRef.current?.clientHeight ?? VH) / 2;
      return { scale, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k };
    });

  const toggle = (id: string) => setCollapsed((c) => ({ ...c, [id]: !c[id] }));

  /* подсветка: активная ветвь по ховеру или все при фильтре */
  const isLeafActive = (l: LeafLayout) => {
    if (filtering) return matches(l.node);
    if (!hover) return true;
    return hover === l.branch.id || hover === l.node.id;
  };
  const isBranchActive = (b: MapBranch) => {
    if (filtering) return b.nodes.some(matches);
    if (!hover) return true;
    return hover === b.id || b.nodes.some((nn) => nn.id === hover);
  };

  return (
    <div className="relative">
      {/* холст */}
      <div
        ref={wrapRef}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="relative h-[68vh] min-h-[460px] w-full cursor-grab touch-none overflow-hidden rounded-2xl border border-cyan-500/20 bg-[radial-gradient(circle_at_50%_45%,hsl(230_25%_12%),hsl(230_25%_8%))] active:cursor-grabbing"
        style={{
          backgroundImage:
            "linear-gradient(to right,hsl(180 100% 50% / 0.04) 1px,transparent 1px),linear-gradient(to bottom,hsl(180 100% 50% / 0.04) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: VW, height: VH, transform: `translate(${view.x}px,${view.y}px) scale(${view.scale})` }}
        >
          {/* коннекторы */}
          <svg width={VW} height={VH} className="absolute inset-0 overflow-visible" style={{ pointerEvents: "none" }}>
            <defs>
              {(Object.keys(BRANCH_HSL) as (keyof typeof BRANCH_HSL)[]).map((c) => (
                <filter key={c} id={`glow-${c}`} x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
            </defs>

            {layout.map((bl) => {
              const hsl = BRANCH_HSL[bl.branch.color];
              const active = isBranchActive(bl.branch);
              return (
                <g key={bl.branch.id}>
                  {/* root → branch */}
                  <path
                    d={curve({ x: CX, y: CY }, bl.pos)}
                    fill="none"
                    stroke={`hsl(${hsl})`}
                    strokeWidth={3.5}
                    strokeLinecap="round"
                    opacity={active ? 0.85 : 0.12}
                    filter={`url(#glow-${bl.branch.color})`}
                    style={{ transition: "opacity .25s" }}
                  />
                  {/* branch → leaves */}
                  {!collapsed[bl.branch.id] &&
                    bl.leaves.map((l) => (
                      <path
                        key={l.node.id}
                        d={curve(bl.pos, l.pos)}
                        fill="none"
                        stroke={`hsl(${hsl})`}
                        strokeWidth={2}
                        strokeLinecap="round"
                        opacity={isLeafActive(l) ? 0.6 : 0.08}
                        style={{ transition: "opacity .25s" }}
                      />
                    ))}
                </g>
              );
            })}
          </svg>

          {/* корневой узел */}
          <NodePill x={CX} y={CY} className="z-20">
            <button
              onClick={() => navigate("/courses")}
              className="group flex max-w-[240px] flex-col items-center gap-1 rounded-2xl border border-cyan-400/50 bg-gradient-to-br from-cyan-500/25 via-purple-500/20 to-pink-500/25 px-6 py-4 text-center shadow-[0_0_40px_hsl(280_100%_60%/0.45)] backdrop-blur-md transition-transform hover:scale-[1.04]"
            >
              <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-lg font-bold leading-tight text-transparent">
                {ROOT.label}
              </span>
              <span className="text-[11px] leading-tight text-muted-foreground">{ROOT.caption}</span>
            </button>
          </NodePill>

          {/* ветви */}
          {layout.map((bl) => {
            const hsl = BRANCH_HSL[bl.branch.color];
            const Icon = bl.branch.icon;
            const active = isBranchActive(bl.branch);
            const isCollapsed = collapsed[bl.branch.id];
            return (
              <div key={bl.branch.id}>
                <NodePill x={bl.pos.x} y={bl.pos.y} className="z-10">
                  <div
                    onMouseEnter={() => setHover(bl.branch.id)}
                    onMouseLeave={() => setHover(null)}
                    className="flex items-center gap-2 rounded-full border bg-card/70 px-3.5 py-2 backdrop-blur-md transition-all"
                    style={{
                      borderColor: `hsl(${hsl} / ${active ? 0.7 : 0.25})`,
                      boxShadow: active ? `0 0 22px hsl(${hsl} / 0.4)` : "none",
                      opacity: active ? 1 : 0.4,
                    }}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{ background: `hsl(${hsl} / 0.15)` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: `hsl(${hsl})` }} />
                    </span>
                    <button
                      onClick={() => navigate(bl.branch.link)}
                      className="text-sm font-bold text-foreground hover:underline"
                    >
                      {bl.branch.label}
                    </button>
                    <button
                      onClick={() => toggle(bl.branch.id)}
                      aria-label={isCollapsed ? "Развернуть" : "Свернуть"}
                      className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full hover:bg-foreground/10"
                    >
                      <ChevronRight
                        className="h-3.5 w-3.5 text-muted-foreground transition-transform"
                        style={{ transform: isCollapsed ? "none" : "rotate(90deg)" }}
                      />
                    </button>
                  </div>
                </NodePill>

                {/* листья */}
                {!isCollapsed &&
                  bl.leaves.map((l) => {
                    const la = isLeafActive(l);
                    const diff = DIFFICULTY_META[l.node.difficulty];
                    return (
                      <NodePill key={l.node.id} x={l.pos.x} y={l.pos.y}>
                        <button
                          onClick={() => navigate(l.node.link)}
                          onMouseEnter={() => setHover(l.node.id)}
                          onMouseLeave={() => setHover(null)}
                          title={`${l.node.blurb} · ${diff.label} · ${l.node.time}`}
                          className="group flex max-w-[190px] items-center gap-2 rounded-xl border bg-card/70 px-3 py-1.5 backdrop-blur-md transition-all hover:scale-[1.05]"
                          style={{
                            borderColor: `hsl(${hsl} / ${la ? 0.55 : 0.15})`,
                            boxShadow: la ? `0 0 16px hsl(${hsl} / 0.28)` : "none",
                            opacity: la ? 1 : 0.3,
                          }}
                        >
                          <span className={`h-2 w-2 shrink-0 rounded-full ${diff.dot}`} title={diff.label} />
                          <span className="text-left text-xs font-medium leading-tight text-foreground">
                            {l.node.label}
                          </span>
                          <span className="ml-auto whitespace-nowrap text-[10px] text-muted-foreground">{l.node.time}</span>
                        </button>
                      </NodePill>
                    );
                  })}
              </div>
            );
          })}
        </div>

        {/* контролы зума */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1.5">
          <CtrlBtn onClick={() => zoomBtn(1)} label="Приблизить">
            <ZoomIn className="h-4 w-4" />
          </CtrlBtn>
          <CtrlBtn onClick={() => zoomBtn(-1)} label="Отдалить">
            <ZoomOut className="h-4 w-4" />
          </CtrlBtn>
          <CtrlBtn onClick={fit} label="По размеру">
            <Maximize2 className="h-4 w-4" />
          </CtrlBtn>
        </div>

        {/* легенда сложности */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1 rounded-xl border border-border/40 bg-background/70 px-3 py-2 backdrop-blur-md">
          {(Object.keys(DIFFICULTY_META) as Difficulty[]).map((d) => (
            <span key={d} className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${DIFFICULTY_META[d].dot}`} />
              {DIFFICULTY_META[d].label}
            </span>
          ))}
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-muted-foreground">
        Перетаскивайте фон для перемещения · колесо мыши — зум · клик по узлу открывает урок · стрелка — свернуть ветвь
      </p>
    </div>
  );
};

/* центрированный по координате узел */
const NodePill = ({ x, y, className = "", children }: { x: number; y: number; className?: string; children: React.ReactNode }) => (
  <div className={`absolute -translate-x-1/2 -translate-y-1/2 ${className}`} style={{ left: x, top: y }}>
    {children}
  </div>
);

const CtrlBtn = ({ onClick, label, children }: { onClick: () => void; label: string; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-background/80 text-primary backdrop-blur-md transition-all hover:border-primary/60 hover:shadow-glow-cyan"
  >
    {children}
  </button>
);

export default MindMapCanvas;

/* экспортируем иконки контролов поиска для страницы */
export { Search, X };
