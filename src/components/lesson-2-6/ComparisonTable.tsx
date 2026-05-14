import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { Check, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Cell =
  | { kind: "yes"; text?: string }
  | { kind: "no"; text?: string }
  | { kind: "text"; text: string };

interface CompareRow {
  criterion: string;
  tb: Cell;
  wandb: Cell;
}

const ROWS: CompareRow[] = [
  {
    criterion: "Стоимость",
    tb: { kind: "text", text: "Полностью бесплатен" },
    wandb: {
      kind: "text",
      text: "Personal/Academic — бесплатно; Teams ≈ $50/user/mo",
    },
  },
  {
    criterion: "Локально / облако",
    tb: { kind: "text", text: "Локально (TensorBoard.dev закрыт)" },
    wandb: { kind: "text", text: "Облако + on-prem (W&B Server)" },
  },
  {
    criterion: "Collaboration",
    tb: { kind: "no" },
    wandb: { kind: "yes", text: "Reports, общие dashboards, комментарии" },
  },
  {
    criterion: "Video logging",
    tb: { kind: "text", text: "Через Video()-логгер SB3" },
    wandb: {
      kind: "yes",
      text: "Нативно wandb.Video; авто из gym monitor_gym=True",
    },
  },
  {
    criterion: "3D / mesh",
    tb: { kind: "text", text: "add_mesh" },
    wandb: { kind: "text", text: "wandb.Object3D" },
  },
  {
    criterion: "Hyperparameter sweeps",
    tb: { kind: "text", text: "HParams plugin (только grid + ручной анализ)" },
    wandb: {
      kind: "yes",
      text: "Sweeps: grid, random, Bayesian, Hyperband",
    },
  },
  {
    criterion: "Experiment versioning",
    tb: { kind: "text", text: "Только папки runs/" },
    wandb: { kind: "text", text: "Run ID + Git SHA + code snapshot" },
  },
  {
    criterion: "Artifact tracking",
    tb: { kind: "no" },
    wandb: {
      kind: "yes",
      text: "Artifacts с дедупликацией, lineage, aliases",
    },
  },
  {
    criterion: "Gradient histograms",
    tb: { kind: "text", text: "add_histogram руками" },
    wandb: {
      kind: "yes",
      text: 'wandb.watch(model, log="all") авто',
    },
  },
  {
    criterion: "Parallel coordinates",
    tb: { kind: "no" },
    wandb: { kind: "yes", text: "Для sweep-анализа" },
  },
  {
    criterion: "Mobile UI",
    tb: { kind: "text", text: "Плохо" },
    wandb: { kind: "text", text: "Хорошо" },
  },
  {
    criterion: "Performance при 100+ runs",
    tb: { kind: "text", text: "Деградирует" },
    wandb: { kind: "text", text: "Масштабируется" },
  },
  {
    criterion: "Offline mode",
    tb: { kind: "yes", text: "Нативно" },
    wandb: { kind: "yes", text: "wandb offline + wandb sync" },
  },
  {
    criterion: "Privacy",
    tb: { kind: "yes", text: "100% локально" },
    wandb: { kind: "text", text: "Cloud (или on-prem)" },
  },
];

const CHOOSE_TB = [
  "Одиночное обучение, прототипирование, отладка одного агента",
  "Работа в закрытом контуре без интернета",
  "Интеграция в существующий ML-pipeline (Kubeflow, TFX)",
  "Нужен максимально быстрый старт без регистраций",
];

const CHOOSE_WB = [
  "Групповые проекты, курсовые / дипломные",
  "Нужна гиперпараметрическая оптимизация",
  "Эксперименты на удалённом GPU-кластере (хочется смотреть с телефона)",
  "Статья / публикация — нужны воспроизводимые отчёты",
  "Много моделей / датасетов, нужно версионирование",
];

const BOTH_CODE = `wandb.init(project="rl-course", sync_tensorboard=True)
model = PPO("MlpPolicy", env, tensorboard_log=f"runs/{wandb.run.id}")
model.learn(total_timesteps=100_000, callback=WandbCallback())
`;

const renderCell = (c: Cell) => {
  if (c.kind === "yes") {
    return (
      <div className="flex items-start gap-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1.5">
        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span className="text-xs text-foreground/90">{c.text ?? "Да"}</span>
      </div>
    );
  }
  if (c.kind === "no") {
    return (
      <div className="flex items-start gap-2 rounded-md bg-red-500/10 border border-red-500/30 px-2.5 py-1.5">
        <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
        <span className="text-xs text-foreground/90">{c.text ?? "Нет"}</span>
      </div>
    );
  }
  return <span className="text-xs text-foreground/90">{c.text}</span>;
};

const ComparisonTable = () => {
  return (
    <Tabs defaultValue="grid" className="space-y-6">
      <TabsList className="grid grid-cols-1 sm:grid-cols-3 h-auto bg-card/60 border border-cyan-500/20">
        <TabsTrigger value="grid" className="text-xs sm:text-sm py-2.5">
          Сравнение по 13 критериям
        </TabsTrigger>
        <TabsTrigger value="choose" className="text-xs sm:text-sm py-2.5">
          Когда что выбирать
        </TabsTrigger>
        <TabsTrigger value="both" className="text-xs sm:text-sm py-2.5">
          Когда использовать оба
        </TabsTrigger>
      </TabsList>

      {/* Tab 1: grid */}
      <TabsContent value="grid">
        <div className="rounded-xl border border-cyan-500/20 bg-background/40 overflow-hidden">
          <div className="overflow-x-auto max-h-[640px] overflow-y-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="sticky top-0 bg-card/95 backdrop-blur z-10">
                <tr className="border-b border-cyan-500/30">
                  <th className="text-left px-4 py-3 text-cyan-300 font-bold w-[24%]">
                    Критерий
                  </th>
                  <th className="text-left px-4 py-3 text-cyan-300 font-bold w-[38%]">
                    TensorBoard
                  </th>
                  <th className="text-left px-4 py-3 text-purple-300 font-bold w-[38%]">
                    Weights &amp; Biases
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => (
                  <tr
                    key={r.criterion}
                    className={cn(
                      "border-b border-border/30 align-top",
                      i % 2 === 0 ? "bg-background/0" : "bg-card/30"
                    )}
                  >
                    <td className="px-4 py-3 font-semibold text-foreground/90">
                      {r.criterion}
                    </td>
                    <td className="px-4 py-3">{renderCell(r.tb)}</td>
                    <td className="px-4 py-3">{renderCell(r.wandb)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>

      {/* Tab 2: choose */}
      <TabsContent value="choose">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-card/60 border-cyan-500/30 backdrop-blur-sm hover:shadow-[0_0_24px_hsl(var(--primary)/0.25)] transition-all">
            <CardContent className="p-6 space-y-3">
              <h4 className="text-lg font-bold text-cyan-300">
                Выбирай TensorBoard, если:
              </h4>
              <ul className="space-y-2">
                {CHOOSE_TB.map((it) => (
                  <li key={it} className="flex gap-2 text-sm text-foreground/90">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card/60 border-purple-500/30 backdrop-blur-sm hover:shadow-[0_0_24px_hsl(280_85%_65%/0.25)] transition-all">
            <CardContent className="p-6 space-y-3">
              <h4 className="text-lg font-bold text-purple-300">
                Выбирай W&amp;B, если:
              </h4>
              <ul className="space-y-2">
                {CHOOSE_WB.map((it) => (
                  <li key={it} className="flex gap-2 text-sm text-foreground/90">
                    <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Tab 3: both */}
      <TabsContent value="both" className="space-y-6">
        <Card className="bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-cyan-500/30 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <h4 className="text-xl font-bold text-foreground">
              Default-конфигурация для SB3-проектов
            </h4>
            <p className="text-sm text-foreground/90 leading-relaxed">
              <code className="text-xs">sync_tensorboard=True</code> в{" "}
              <code className="text-xs">wandb.init()</code> — TensorBoard
              event-файлы пишутся локально (
              <code className="text-xs">tensorboard --logdir runs/</code>{" "}
              работает сразу), а W&amp;B параллельно тянет их в облако.
              Идеальный hedge: даже если интернет отвалится, локальная история
              сохранится.
            </p>

            {/* Flow diagram (SVG-like with cards) */}
            <div className="rounded-xl border border-border/40 bg-background/40 p-5 space-y-3">
              <div className="flex flex-col md:flex-row items-stretch gap-3">
                <FlowNode
                  title="SB3 model.learn()"
                  color="cyan"
                  className="md:w-1/3"
                />
                <FlowArrow />
                <FlowNode
                  title="TensorBoard event files"
                  subtitle="runs/<run_id>"
                  color="purple"
                  className="md:w-1/3"
                />
              </div>
              <div className="flex justify-center md:justify-start md:pl-[calc(33.33%+1.5rem)]">
                <FlowArrow direction="down" />
              </div>
              <div className="flex flex-col md:flex-row items-stretch gap-3">
                <div className="hidden md:block md:w-[calc(33.33%+1.5rem)]" />
                <FlowNode
                  title="Local tensorboard --logdir runs/"
                  color="emerald"
                  className="md:w-1/3"
                />
                <FlowArrow />
                <FlowNode
                  title="W&B Cloud"
                  subtitle="sync_tensorboard=True"
                  color="pink"
                  className="md:w-1/3"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <CyberCodeBlock language="python" filename="train_both.py">
          {BOTH_CODE}
        </CyberCodeBlock>
      </TabsContent>
    </Tabs>
  );
};

const FLOW_COLORS: Record<string, string> = {
  cyan: "border-cyan-500/40 bg-cyan-500/10 text-cyan-200",
  purple: "border-purple-500/40 bg-purple-500/10 text-purple-200",
  pink: "border-pink-500/40 bg-pink-500/10 text-pink-200",
  emerald: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
};

const FlowNode = ({
  title,
  subtitle,
  color,
  className,
}: {
  title: string;
  subtitle?: string;
  color: string;
  className?: string;
}) => (
  <div
    className={cn(
      "flex-1 rounded-lg border px-3 py-2.5 text-center",
      FLOW_COLORS[color],
      className
    )}
  >
    <div className="text-sm font-semibold">{title}</div>
    {subtitle && (
      <div className="text-[10px] font-mono opacity-70 mt-0.5">{subtitle}</div>
    )}
  </div>
);

const FlowArrow = ({ direction = "right" }: { direction?: "right" | "down" }) => (
  <div className="flex items-center justify-center">
    <ArrowRight
      className={cn(
        "w-5 h-5 text-cyan-400 drop-shadow-[0_0_6px_hsl(var(--primary)/0.6)]",
        direction === "down" && "rotate-90"
      )}
    />
  </div>
);

export default ComparisonTable;
