import { Bot, Star, TriangleAlert } from "lucide-react";
import Math from "@/components/Math";

// The same 5 × 5 layout and rewards as MiniGridWorld; both routes avoid the trap.
const WALLS = new Set(["1,1", "1,2", "3,3"]);
const ROUTES = [
  {
    id: "short-route", title: "Короткий путь", color: "text-primary", dashed: false,
    cells: [[4, 0], [3, 0], [2, 0], [1, 0], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  },
  {
    id: "long-route", title: "Путь с обходом", color: "text-secondary", dashed: true,
    cells: [[4, 0], [4, 1], [3, 1], [2, 1], [2, 0], [1, 0], [0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  },
];

export default function RouteRewardsIllustration() {
  return (
    <figure aria-labelledby="route-rewards-title"
      className="overflow-hidden rounded-2xl border border-secondary/30 bg-card/60">
      <div className="border-b border-secondary/10 bg-gradient-to-r from-primary/10 to-secondary/10 px-5 py-4 sm:px-6">
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-secondary">Сравните маршруты</p>
        <h3 id="route-rewards-title" className="text-lg font-bold text-foreground">Одна цель — разная суммарная награда</h3>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
        {ROUTES.map(route => {
          const steps = route.cells.length - 1;
          const ordinarySteps = steps - 1;
          const reward = 10 - ordinarySteps;
          return (
            <div key={route.id} className="min-w-0 rounded-xl border border-border/50 bg-background/50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className={`text-sm font-semibold ${route.color}`}>{route.title}</p>
                <span className="rounded-full border border-border/50 px-2 py-0.5 font-mono text-xs text-foreground">{steps} шагов</span>
              </div>
              <svg viewBox="0 0 250 250" role="img" aria-labelledby={`${route.id}-title ${route.id}-desc`}
                className={`mx-auto my-4 block w-full max-w-64 ${route.color}`}>
                <title id={`${route.id}-title`}>{route.title}: {steps} шагов, суммарная награда {reward}</title>
                <desc id={`${route.id}-desc`}>Сетка как в упражнении: робот стартует снизу слева, звезда-цель находится сверху справа. Маршрут обходит стены и центральную ловушку.</desc>
                <defs>
                  <marker id={`${route.id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                  </marker>
                </defs>
                {Array.from({ length: 25 }, (_, index) => {
                  const r = globalThis.Math.floor(index / 5);
                  const c = index % 5;
                  return <rect key={index} x={c * 50 + 3} y={r * 50 + 3} width="44" height="44" rx="7"
                    fill={WALLS.has(`${r},${c}`) ? "hsl(var(--muted))" : "hsl(var(--card))"}
                    stroke="hsl(var(--border))" />;
                })}
                <polyline points={route.cells.map(([r, c]) => `${c * 50 + 25},${r * 50 + 25}`).join(" ")}
                  fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray={route.dashed ? "7 6" : undefined} markerEnd={`url(#${route.id}-arrow)`} />
                <circle cx="25" cy="225" r="17" fill="hsl(var(--background))" />
                <Bot x="13" y="213" width="24" height="24" className="text-primary" aria-hidden="true" />
                <circle cx="225" cy="25" r="16" fill="hsl(var(--background))" />
                <Star x="214" y="14" width="22" height="22" className="fill-accent/20 text-accent" aria-hidden="true" />
                <TriangleAlert x="114" y="114" width="22" height="22" className="text-destructive" aria-hidden="true" />
              </svg>
              <p className="text-center text-xs text-muted-foreground">Награда за цель минус штрафы за обычные шаги</p>
              <div className="mt-2 text-center text-foreground">
                <Math display={false} className="text-lg">{`10 - ${ordinarySteps} \\cdot 1 = ${reward}`}</Math>
              </div>
            </div>
          );
        })}
      </div>
      <figcaption className="border-t border-border/50 px-5 py-4 text-sm leading-relaxed text-muted-foreground sm:px-6">
        Оба пути обходят ловушку. Последний шаг даёт <Math display={false}>{"+10"}</Math> за цель вместо штрафа.
        Два лишних обычных шага по <Math display={false}>{"-1"}</Math> уменьшают итог с <Math display={false}>{"3"}</Math> до <Math display={false}>{"1"}</Math>.
      </figcaption>
    </figure>
  );
}
