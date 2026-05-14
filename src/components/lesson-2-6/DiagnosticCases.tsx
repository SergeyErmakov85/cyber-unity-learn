import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertOctagon,
  Activity,
  Search,
  Wrench,
  Eye,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

type ChartKind = "entropy" | "ev" | "trainEval" | "kl" | "grad" | "qhist";

type Case = {
  id: string;
  title: string;
  marker: string;
  symptom: string;
  cause: string;
  actions: string;
  chart: ChartKind;
};

const CASES: Case[] = [
  {
    id: "c1",
    title: "Policy Collapse — entropy уходит в 0",
    marker: "entropy резко падает к 0 в первых 10% обучения, награда замирает",
    symptom: "entropy резко падает к 0 в первых 10% обучения, награда замирает.",
    cause:
      "Andy Jones: «If it drops to zero or close to zero, then your agent has 'collapsed' into some — likely myopic — policy, and isn't exploring any more».",
    actions:
      "Увеличить ent_coef (0.0 → 0.01–0.1); уменьшить LR в 3–10×; проверить, что shaping reward не делает один action слишком привлекательным.",
    chart: "entropy",
  },
  {
    id: "c2",
    title: "Critic не учится — explained_variance ≈ 0",
    marker: "explained_variance застрял около нуля или ушёл в минус",
    symptom: "explained_variance застрял около нуля или ушёл в минус.",
    cause:
      "SB3 docs: «ev=0 ⇒ might as well have predicted zero». Критик не выучил value-функцию.",
    actions:
      "Проверить масштаб награды (добавить VecNormalize); правильный γ (для длинных эпизодов 0.99 → 0.999); убедиться, что targets не NaN.",
    chart: "ev",
  },
  {
    id: "c3",
    title: "Переобучение на shaping reward",
    marker: "rollout/ep_rew_mean растёт, но eval/mean_reward падает",
    symptom: "rollout/ep_rew_mean растёт, но eval/mean_reward падает или стоит.",
    cause:
      "Агент эксплуатирует shaping, а не учит реальную задачу. Или переобучение на seed обучающей среды.",
    actions:
      "Уменьшить shaping; тренировать на нескольких сидах среды; увеличить exploration; добавить EvalCallback с детерминированной политикой.",
    chart: "trainEval",
  },
  {
    id: "c4",
    title: "PPO нестабилен — approx_kl ≫ target_kl",
    marker: "approx_kl стабильно > 0.05 (при target 0.01)",
    symptom: "approx_kl стабильно > 0.05 (при target 0.01).",
    cause: "PPO update слишком агрессивен; политика прыгает.",
    actions:
      "Уменьшить learning_rate в 3–10×; поставить target_kl=0.02 (SB3 поддерживает раннее прерывание апдейта); уменьшить n_epochs с 10 до 4.",
    chart: "kl",
  },
  {
    id: "c5",
    title: "Взрыв градиентов",
    marker: "grad_norm > 10, в losses появляются NaN",
    symptom: "grad_norm > 10, в losses появляются NaN.",
    cause: "Gradient clipping выключен или недостаточен.",
    actions:
      "SB3 по умолчанию использует max_grad_norm=0.5 — проверь, что не отключил. Логируй grad_norm через wandb.watch.",
    chart: "grad",
  },
  {
    id: "c6",
    title: "Overestimation в DQN — Q-values растут безгранично",
    marker: "Q-values монотонно растут на гистограмме",
    symptom: "Q-values монотонно растут на гистограмме.",
    cause: "max-operator в Bellman update систематически переоценивает.",
    actions:
      "Double DQN (SB3-Contrib DoubleDQN); Clipped Double Q (SAC, TD3); Dueling DQN; уменьшить learning rate target network.",
    chart: "qhist",
  },
];

// ---- chart datasets ----
const ENTROPY_DATA = Array.from({ length: 30 }, (_, i) => ({
  x: i,
  v: Math.max(0.02, 1.2 * Math.exp(-i / 3) + (i > 8 ? 0 : 0.02 * Math.sin(i))),
}));

const EV_DATA = Array.from({ length: 30 }, (_, i) => ({
  x: i,
  v: 0.02 * Math.sin(i / 2) + (Math.random() - 0.5) * 0.04,
}));

const TRAIN_EVAL_DATA = Array.from({ length: 25 }, (_, i) => ({
  x: i,
  train: 50 + i * 6 + Math.sin(i) * 4,
  eval: 80 - i * 1.4 + Math.cos(i) * 5,
}));

const KL_DATA = Array.from({ length: 30 }, (_, i) => {
  const spike = i % 5 === 0 ? 0.25 + Math.random() * 0.2 : 0;
  return { x: i, v: 0.02 + spike + Math.random() * 0.02 };
});

const GRAD_DATA = Array.from({ length: 30 }, (_, i) => {
  const spike = i % 6 === 0 ? 8 + Math.random() * 6 : 0;
  return { x: i, v: 0.5 + spike + Math.random() * 0.4 };
});

const QHIST_DATA = Array.from({ length: 12 }, (_, i) => ({
  bin: i,
  v: Math.max(0, 30 - Math.abs(i - 8) * 4 + Math.random() * 4),
}));

const CHART_COLORS = {
  red: "hsl(0 85% 65%)",
  cyan: "hsl(190 85% 60%)",
  green: "hsl(150 70% 55%)",
  purple: "hsl(280 80% 65%)",
};

const MiniChart = ({ kind }: { kind: ChartKind }) => {
  const common = {
    margin: { top: 8, right: 8, bottom: 4, left: 4 },
  };
  const axisProps = {
    stroke: "hsl(var(--muted-foreground))",
    fontSize: 10,
    tickLine: false,
    axisLine: false,
  };

  return (
    <div className="w-full h-[160px] rounded-lg border border-cyan-500/20 bg-card/60 p-2">
      <ResponsiveContainer width="100%" height="100%">
        {kind === "entropy" ? (
          <LineChart data={ENTROPY_DATA} {...common}>
            <XAxis dataKey="x" {...axisProps} />
            <YAxis {...axisProps} width={28} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                fontSize: 11,
              }}
            />
            <Line
              type="monotone"
              dataKey="v"
              stroke={CHART_COLORS.red}
              strokeWidth={2}
              dot={false}
              name="entropy"
            />
          </LineChart>
        ) : kind === "ev" ? (
          <LineChart data={EV_DATA} {...common}>
            <XAxis dataKey="x" {...axisProps} />
            <YAxis {...axisProps} domain={[-0.2, 1]} width={28} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                fontSize: 11,
              }}
            />
            <Line
              type="monotone"
              dataKey="v"
              stroke={CHART_COLORS.red}
              strokeWidth={2}
              dot={false}
              name="explained_var"
            />
          </LineChart>
        ) : kind === "trainEval" ? (
          <LineChart data={TRAIN_EVAL_DATA} {...common}>
            <XAxis dataKey="x" {...axisProps} />
            <YAxis {...axisProps} width={28} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                fontSize: 11,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Line
              type="monotone"
              dataKey="train"
              stroke={CHART_COLORS.green}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="eval"
              stroke={CHART_COLORS.red}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        ) : kind === "kl" ? (
          <LineChart data={KL_DATA} {...common}>
            <XAxis dataKey="x" {...axisProps} />
            <YAxis {...axisProps} width={28} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                fontSize: 11,
              }}
            />
            <Line
              type="monotone"
              dataKey="v"
              stroke={CHART_COLORS.purple}
              strokeWidth={2}
              dot={false}
              name="approx_kl"
            />
          </LineChart>
        ) : kind === "grad" ? (
          <LineChart data={GRAD_DATA} {...common}>
            <XAxis dataKey="x" {...axisProps} />
            <YAxis {...axisProps} width={28} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                fontSize: 11,
              }}
            />
            <Line
              type="monotone"
              dataKey="v"
              stroke={CHART_COLORS.red}
              strokeWidth={2}
              dot={false}
              name="grad_norm"
            />
          </LineChart>
        ) : (
          <BarChart data={QHIST_DATA} {...common}>
            <XAxis dataKey="bin" {...axisProps} />
            <YAxis {...axisProps} width={28} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                fontSize: 11,
              }}
            />
            <Bar dataKey="v" fill={CHART_COLORS.purple} name="Q-values" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

const InfoBlock = ({
  icon: Icon,
  label,
  text,
  color,
}: {
  icon: typeof Activity;
  label: string;
  text: string;
  color: string;
}) => (
  <div className="rounded-lg border border-cyan-500/15 bg-card/40 p-3 space-y-1.5">
    <div className={`flex items-center gap-2 text-xs font-semibold ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
    <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
  </div>
);

const DiagnosticCases = () => {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground leading-relaxed">
        Шесть классических паттернов на графиках, которые говорят, что обучение
        пошло не так. Учитесь распознавать их сразу — это экономит часы GPU.
      </p>

      <Accordion type="multiple" className="space-y-3">
        {CASES.map((c) => (
          <AccordionItem
            key={c.id}
            value={c.id}
            className="border border-red-500/20 rounded-xl bg-card/60 backdrop-blur-sm px-4 data-[state=open]:border-red-400/50 data-[state=open]:shadow-[0_0_20px_hsl(0_85%_60%/0.18)] transition-all"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-start gap-3 text-left">
                <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-semibold text-foreground">{c.title}</div>
                  <div className="text-xs text-muted-foreground">{c.marker}</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 pb-2 pt-1">
                <MiniChart kind={c.chart} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <InfoBlock
                    icon={Activity}
                    label="Симптом"
                    text={c.symptom}
                    color="text-red-300"
                  />
                  <InfoBlock
                    icon={Search}
                    label="Причина"
                    text={c.cause}
                    color="text-purple-300"
                  />
                  <InfoBlock
                    icon={Wrench}
                    label="Действия"
                    text={c.actions}
                    color="text-emerald-300"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Card className="border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl border border-cyan-400/40 bg-cyan-500/10 flex items-center justify-center shrink-0 shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
            <Eye className="w-6 h-6 text-cyan-300" />
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            Незаменимый qualitative check, который не дадут никакие scalars:
            всегда смотрите видео политики хотя бы раз в 50k шагов. Reward
            hacking случается чаще, чем кажется.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticCases;
