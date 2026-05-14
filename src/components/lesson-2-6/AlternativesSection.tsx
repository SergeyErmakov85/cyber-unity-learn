import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Boxes,
  Orbit,
  Workflow,
  Crosshair,
  ScrollText,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type Tone = "emerald" | "red" | "purple" | "cyan" | "gray";

type Tool = {
  name: string;
  icon: LucideIcon;
  type: string;
  desc: string;
  badge: string;
  tone: Tone;
};

const TOOLS: Tool[] = [
  {
    name: "MLflow",
    icon: Boxes,
    type: "Open-source",
    desc: "4 модуля (Tracking, Projects, Models, Registry). Хорош для production-pipelines, слабее в визуализации, self-hostable. SB3 имеет пример MLflowOutputFormat в документации.",
    badge: "Production-friendly",
    tone: "emerald",
  },
  {
    name: "Neptune.ai",
    icon: Orbit,
    type: "Был SaaS, теперь open-source",
    desc: "Strong query language, хороший UI. OpenAI приобрела Neptune.ai 3 декабря 2025; хостинговый SaaS закрыт 5 марта 2026. Для новых проектов уже не подходит — только open-source клиент.",
    badge: "SaaS закрыт",
    tone: "red",
  },
  {
    name: "ClearML",
    icon: Workflow,
    type: "End-to-end MLOps",
    desc: "Tracking + orchestration + data management. Auto-logging для TensorBoard и Matplotlib. Сложнее в setup, чем MLflow.",
    badge: "Enterprise",
    tone: "purple",
  },
  {
    name: "Aim",
    icon: Crosshair,
    type: "Open-source",
    desc: "Высокопроизводительный UI для тысяч experiments, читает MLflow runs. Молодое сообщество, активная разработка.",
    badge: "Lightweight",
    tone: "cyan",
  },
  {
    name: "Sacred + Omniboard",
    icon: ScrollText,
    type: "Academic classic",
    desc: "От IDSIA. Конфиги через декораторы, Mongo-backend. В 2026 встречается реже, но всё ещё в части research-репозиториев.",
    badge: "Research legacy",
    tone: "gray",
  },
];

const TONE_CARD: Record<Tone, string> = {
  emerald:
    "border-emerald-500/30 hover:border-emerald-400/70 hover:shadow-[0_0_24px_hsl(160_85%_55%/0.35)] [&_.tool-icon]:text-emerald-400",
  red: "border-red-500/30 hover:border-red-400/70 hover:shadow-[0_0_24px_hsl(0_85%_60%/0.35)] [&_.tool-icon]:text-red-400",
  purple:
    "border-purple-500/30 hover:border-purple-400/70 hover:shadow-[0_0_24px_hsl(280_85%_65%/0.35)] [&_.tool-icon]:text-purple-400",
  cyan: "border-cyan-500/30 hover:border-cyan-400/70 hover:shadow-[0_0_24px_hsl(var(--primary)/0.35)] [&_.tool-icon]:text-cyan-400",
  gray: "border-muted-foreground/30 hover:border-muted-foreground/60 hover:shadow-[0_0_24px_hsl(var(--muted-foreground)/0.25)] [&_.tool-icon]:text-muted-foreground",
};

const TONE_BADGE: Record<Tone, string> = {
  emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  red: "bg-red-500/15 text-red-300 border-red-500/30",
  purple: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  gray: "bg-muted/40 text-muted-foreground border-muted-foreground/30",
};

const AlternativesSection = () => (
  <div className="space-y-6">
    <p className="text-muted-foreground leading-relaxed">
      Кроме TensorBoard и W&amp;B существуют другие experiment tracking-системы.
      Краткий обзор с актуальным статусом на 2026 год.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {TOOLS.map(({ name, icon: Icon, type, desc, badge, tone }) => (
        <Card
          key={name}
          className={`group bg-card/60 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${TONE_CARD[tone]}`}
        >
          <CardContent className="p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-foreground">{name}</h4>
                <div className="text-xs text-muted-foreground mt-0.5">{type}</div>
              </div>
              <Icon className="tool-icon w-7 h-7 shrink-0 transition-transform group-hover:scale-110" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            <Badge variant="outline" className={`${TONE_BADGE[tone]} text-[11px]`}>
              {badge}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card className="border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm">
      <CardContent className="p-5 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/90 leading-relaxed">
          <span className="font-semibold text-cyan-300">TL;DR.</span> Для
          студенческого RL-проекта в 2026 году рациональный выбор —{" "}
          <strong>TensorBoard + W&amp;B</strong>. Остальное либо избыточно
          (ClearML), либо устарело (Sacred), либо в переходном состоянии
          (Neptune).
        </p>
      </CardContent>
    </Card>
  </div>
);

export default AlternativesSection;
