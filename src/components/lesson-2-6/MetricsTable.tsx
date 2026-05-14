import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type Category =
  | "all"
  | "rollout"
  | "train"
  | "critic"
  | "off-policy"
  | "performance";

interface MetricRow {
  name: string;
  shows: string;
  healthy: string;
  problems: string;
  category: Exclude<Category, "all">;
}

const METRICS: MetricRow[] = [
  {
    category: "rollout",
    name: "rollout/ep_rew_mean",
    shows: "средняя награда по окну stats_window_size (по умолчанию 100)",
    healthy: "плавный рост → плато",
    problems: "плато низкое; падение после роста (catastrophic forgetting)",
  },
  {
    category: "rollout",
    name: "rollout/ep_len_mean",
    shows: "средняя длина эпизода",
    healthy: "растёт в задачах с выживанием, падает в goal-reaching",
    problems: "застыла на min длине → агент сразу «умирает»",
  },
  {
    category: "train",
    name: "train/policy_gradient_loss (actor)",
    shows: "для PPO: −min(ratio·A, clip(ratio)·A)",
    healthy: "колеблется около 0",
    problems: "монотонный рост → KL слишком велик",
  },
  {
    category: "critic",
    name: "train/value_loss (critic)",
    shows: "MSE(V(s), target return)",
    healthy: "падает → стабилизируется",
    problems: "растёт неограниченно → overestimation / неверный γ",
  },
  {
    category: "train",
    name: "train/entropy_loss (≈ −H(π))",
    shows: "негативная энтропия",
    healthy: "плавное снижение к стабильному не-нулю",
    problems: "резкое падение к 0 → policy collapse, не хватает ent_coef",
  },
  {
    category: "train",
    name: "train/approx_kl (PPO)",
    shows: "k3-estimator Schulman: (r−1) − log r",
    healthy: "0.005–0.02",
    problems:
      ">0.05 → нестабильно; уменьшайте learning_rate, ставьте target_kl=0.02",
  },
  {
    category: "train",
    name: "train/clip_fraction (PPO)",
    shows: "доля сэмплов, где сработал clip",
    healthy: "0.1–0.3",
    problems: ">0.5 → слишком большой шаг политики",
  },
  {
    category: "critic",
    name: "train/explained_variance",
    shows: "1 − Var(returns − V)/Var(returns)",
    healthy: "0.8–0.99",
    problems: "≈0 → критик не учится; <0 → катастрофа",
  },
  {
    category: "train",
    name: "train/learning_rate",
    shows: "текущий LR (с учётом schedule)",
    healthy: "соответствует расписанию",
    problems: "NaN в losses → шаг слишком велик",
  },
  {
    category: "train",
    name: "grad_norm (логировать руками)",
    shows: "L2-норма градиентов",
    healthy: "< max_grad_norm (0.5 в SB3)",
    problems: "взрывы → нужен gradient clipping",
  },
  {
    category: "off-policy",
    name: "Q-values histogram (DQN/SAC)",
    shows: "распределение Q(s,a)",
    healthy: "растёт ограниченно",
    problems:
      "unbounded growth → overestimation bias → Double DQN / Clipped Double Q",
  },
  {
    category: "rollout",
    name: "rollout/success_rate (goal-conditioned)",
    shows: "доля успешных эпизодов",
    healthy: "→ 1.0",
    problems: "0 при положительной награде → reward hacking",
  },
  {
    category: "off-policy",
    name: "TD-error distribution",
    shows: "гистограмма |r + γV(s′) − V(s)|",
    healthy: "сжимается со временем",
    problems: "толстый хвост → нестабильная Bellman-регрессия",
  },
  {
    category: "train",
    name: "Action distribution histograms",
    shows: "гистограмма действий за окно",
    healthy: "покрывает action space",
    problems: "пик на одном действии → mode collapse",
  },
  {
    category: "off-policy",
    name: "Replay buffer stats",
    shows: "средняя награда / age",
    healthy: "сбалансирован",
    problems: "средняя награда буфера ≪ текущей → off-policy mismatch",
  },
  {
    category: "performance",
    name: "time/fps",
    shows: "скорость обучения",
    healthy: "стабильна",
    problems: "падение в 10× → проблемы с env/IO",
  },
];

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "rollout", label: "Rollout" },
  { value: "train", label: "Train" },
  { value: "critic", label: "Critic" },
  { value: "off-policy", label: "Off-policy" },
  { value: "performance", label: "Производительность" },
];

const CATEGORY_BADGE: Record<MetricRow["category"], string> = {
  rollout: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  train: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  critic: "bg-pink-500/15 text-pink-300 border-pink-500/30",
  "off-policy": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  performance: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

const MetricsTable = () => {
  const [category, setCategory] = useState<Category>("all");
  const filtered = METRICS.filter(
    (m) => category === "all" || m.category === category
  );

  return (
    <div className="space-y-6">
      <p className="text-foreground/90 leading-relaxed">
        15 ключевых метрик, которые нужно отслеживать в любом RL-эксперименте.
        Имена даны в соглашении{" "}
        <strong className="text-cyan-300">Stable-Baselines3</strong> (CleanRL
        использует префиксы <code className="text-xs">charts/</code> и{" "}
        <code className="text-xs">losses/</code>).
      </p>

      {/* Filters */}
      <ToggleGroup
        type="single"
        value={category}
        onValueChange={(v) => v && setCategory(v as Category)}
        className="flex flex-wrap justify-start gap-2"
      >
        {CATEGORIES.map(({ value, label }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            className={cn(
              "border border-border/60 rounded-full px-3 py-1.5 text-xs",
              "data-[state=on]:bg-cyan-500/20 data-[state=on]:text-cyan-200 data-[state=on]:border-cyan-400/60",
              "data-[state=on]:shadow-[0_0_12px_hsl(var(--primary)/0.3)]"
            )}
          >
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-cyan-500/15 overflow-hidden bg-background/40">
        <Table>
          <TableHeader>
            <TableRow className="bg-card/80 hover:bg-card/80">
              <TableHead className="text-cyan-300 w-[26%]">Метрика</TableHead>
              <TableHead className="text-cyan-300 w-[26%]">
                Что показывает
              </TableHead>
              <TableHead className="text-cyan-300 w-[24%]">
                Здоровое поведение
              </TableHead>
              <TableHead className="text-cyan-300 w-[24%]">
                Признаки проблем
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((m) => (
              <TableRow key={m.name} className="border-border/40 align-top">
                <TableCell className="font-mono text-xs text-foreground space-y-1.5">
                  <div>{m.name}</div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] uppercase tracking-wider",
                      CATEGORY_BADGE[m.category]
                    )}
                  >
                    {m.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {m.shows}
                </TableCell>
                <TableCell className="text-sm">
                  <div className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{m.healthy}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{m.problems}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {filtered.map((m) => (
          <div
            key={m.name}
            className="rounded-xl border border-cyan-500/15 bg-card/60 backdrop-blur-sm p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="font-mono text-xs text-foreground break-all">
                {m.name}
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] uppercase tracking-wider shrink-0",
                  CATEGORY_BADGE[m.category]
                )}
              >
                {m.category}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              <span className="text-foreground/70 font-semibold">
                Показывает:{" "}
              </span>
              {m.shows}
            </div>
            <div className="flex gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-foreground/90">{m.healthy}</span>
            </div>
            <div className="flex gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="text-foreground/90">{m.problems}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground text-sm py-6">
          Нет метрик в этой категории.
        </p>
      )}

      {/* External links */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          variant="outline"
          size="sm"
          asChild
          className="border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10"
        >
          <a
            href="https://stable-baselines3.readthedocs.io/en/master/common/logger.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            Полный список метрик SB3
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="border-purple-500/40 text-purple-300 hover:bg-purple-500/10"
        >
          <a
            href="https://docs.cleanrl.dev/rl-algorithms/ppo/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            CleanRL PPO docs
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default MetricsTable;
