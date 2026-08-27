import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import FooterSection from "@/components/landing/FooterSection";
import SEOHead from "@/components/SEOHead";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Download, Brain, Zap, Shield, Target, Layers,
  GitBranch, CheckCircle2, XCircle, ChevronRight, Sparkles,
  Play, Database, RefreshCw, Save, FileCode, Box, BookOpen, Network
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Math from "@/components/Math";

/* ───────── Section Navigation ───────── */
const sections = [
  { id: "intro", label: "Введение", icon: Brain },
  { id: "architecture", label: "Архитектура", icon: Layers },
  { id: "training", label: "Обучение", icon: Zap },
  { id: "export", label: "Экспорт", icon: Box },
  { id: "test", label: "Тест", icon: CheckCircle2 },
  { id: "full-code", label: "Полный код", icon: FileCode },
  { id: "trained-model", label: "Нейросеть", icon: Network },
  { id: "audit", label: "Аудит", icon: BookOpen },
];

/* ───────── Optimizations Data ───────── */
const optimizations = [
  {
    id: 1, title: "Длина эпизода (MAX_STEPS)", icon: Target,
    what: "Константа, ограничивающая максимальное число шагов агента в одном эпизоде.",
    problem: "Слишком короткий эпизод — агент не успевает выполнить задачу и получает нулевой reward. Слишком длинный — rollout-буфер раздувается, обновление политики запаздывает.",
    code: "MAX_STEPS = 1000 — эпизод принудительно завершается через done-флаг, если шаги превышены.",
    effect: "Агент стабильно завершает манёвры; размер батча предсказуем, обучение не зависает на бесконечных эпизодах."
  },
  {
    id: 2, title: "Нормализация advantage", icon: Zap,
    what: "Приведение значений advantage (насколько действие лучше среднего) к нулевому среднему и единичной дисперсии перед обновлением весов.",
    problem: "Без нормализации масштаб градиентов «плавает» от батча к батчу — learning rate то слишком велик, то мал, обучение нестабильно.",
    code: "adv = (adv - adv.mean()) / (adv.std() + 1e-8) — применяется к вектору advantage перед loss.",
    effect: "Градиенты остаются в предсказуемом диапазоне; reward-кривая сглаживается, сходимость ускоряется на 20-30%."
  },
  {
    id: 3, title: "Value targets", icon: Shield,
    what: "Целевые значения для обучения critic-головы (функции ценности). Здесь используются bootstrapped targets с detach, а не чистый Monte Carlo.",
    problem: "Без detach() градиенты из critic утекают в policy-голову через общий backbone — веса коллапсируют, награда падает к нулю.",
    code: "target = reward + gamma * V_next.detach() — detach() отрезает граф вычислений, изолируя critic-loss.",
    effect: "Policy и value обучаются независимо; устраняется «gradient leakage», средний reward растёт монотонно."
  },
  {
    id: 4, title: "Хранение sample", icon: Database,
    what: "Буфер переходов хранит «сырое» действие из распределения (до clamp), а не обрезанное значение, отправленное в среду.",
    problem: "Если хранить clamped action, log_prob считается для другой точки распределения — градиент policy искажён, агент учит неверную стратегию.",
    code: "raw_action = dist.sample(); env_action = raw_action.clamp(-1, 1) — в буфер идёт raw_action.",
    effect: "log_prob(raw_action) математически корректен; policy gradient не смещён, дисперсия оценки снижается."
  },
  {
    id: 5, title: "ENTROPY_COEFF", icon: Sparkles,
    what: "Коэффициент энтропийного бонуса — добавка к loss, которая поощряет разнообразие действий агента.",
    problem: "При коэффициенте ≈ 0 политика быстро «схлопывается» в одно действие (entropy collapse), особенно для дискретной головы — агент перестаёт исследовать.",
    code: "loss = policy_loss - ENTROPY_COEFF * entropy — значение 0.02 балансирует эксплуатацию и разведку.",
    effect: "Дискретные решения (напр. «бежать/прыгать») сохраняют вариативность; агент находит стратегии, недоступные при жадном поведении."
  },
  {
    id: 6, title: "Checkpoint guard", icon: Save,
    what: "Условие, при котором модель сохраняется на диск: только если текущий средний reward выше предыдущего лучшего.",
    problem: "Без guard'а каждый чекпоинт перезаписывает предыдущий — случайный провал в одном эпизоде уничтожает лучшую модель.",
    code: "if ep >= 20 and mean_reward > best_reward: save(model) — порог ep≥20 пропускает «шумные» ранние эпизоды.",
    effect: "На диске всегда лежит лучшая версия модели; при экспорте в ONNX гарантированно берётся оптимальный checkpoint."
  },
  {
    id: 7, title: "Двойной clamp", icon: Layers,
    what: "В PPO «зажимается» отношение вероятностей (ratio) нового и старого действия; здесь также clamp'ится выход непрерывной головы в [-1, 1].",
    problem: "Два разных диапазона clamp ([-3,3] для sample и [-1,1] для env) создавали «мёртвую зону», где градиент обнулялся — агент застревал.",
    code: "ratio = torch.clamp(ratio, 1-eps, 1+eps); action = raw.clamp(-1, 1) — единый диапазон [-1,1].",
    effect: "Устранено рассогласование между пространством действий и clamp-границами; агент плавно управляет рулём без рывков."
  },
  {
    id: 8, title: "Форма ONNX", icon: Box,
    what: "Форма (shape) входного тензора при экспорте модели в формат ONNX для инференса в Unity (Sentis / Barracuda).",
    problem: "Плоский вектор [1, N] не совпадает с ожидаемым форматом Unity-сенсоров [1, C, H, W] — при загрузке модель выдаёт ошибку shape mismatch.",
    code: "dummy = torch.zeros(1, C, H, W); torch.onnx.export(model, dummy, 'model.onnx') — dummy задаёт форму.",
    effect: "ONNX-модель загружается в Unity без ошибок; сенсорные данные маппятся 1:1, инференс работает в реальном времени."
  },
];

/* ───────── Timeline Data ───────── */
const timelineSteps = [
  {
    step: 1,
    title: "Сбор данных (Rollout)",
    icon: Play,
    description: "1000 шагов взаимодействия со средой БЕЗ построения графа. Сбор obs, cont_raw, disc_acts.",
    color: "primary" as const,
  },
  {
    step: 2,
    title: "Discounted Returns & Advantage",
    icon: RefreshCw,
    description: "Вычисление дисконтированной награды и Advantage.",
    highlight: "Нормализация: (adv − mean) / std",
    color: "secondary" as const,
  },
  {
    step: 3,
    title: "Обновление (Update)",
    icon: Zap,
    description: "Один батчевый forward С градиентом.",
    highlight: "Loss = Policy Loss + 0.5 × Value Loss − 0.02 × Entropy",
    color: "accent" as const,
  },
  {
    step: 4,
    title: "Сохранение чекпоинта",
    icon: Save,
    description: "Если средняя награда за 100 эпизодов выросла и прошло более 20 эпизодов.",
    color: "primary" as const,
  },
];

/* ───────── Checklist Data ───────── */
const checklistItems = [
  "Обернуть модель в UnityONNXWrapper (добавляет фиктивные тензоры version_number и memory_size)",
  "Экспортировать граф с помощью torch.onnx.export (opset_version=15)",
  "Добавить metadata_props в ONNX файл (размеры сенсоров и действий)",
  "Проверить форму входов (должна быть grid [1, C, H, W], а не flat)",
  "Скопировать .onnx файл в папку Assets/ML-Agents/ в Unity",
  "В Inspector агента выбрать Behavior Type = Inference Only",
];

/* ───────── Quiz Data ───────── */
const quizQuestions = [
  {
    question: "Почему мы должны хранить raw sample (pre-clamp), а не обрезанное значение для функции log_prob?",
    options: [
      "Это экономит память",
      "Распределение Normal не знает об обрезке, и расчет вероятности исказится",
      "Unity требует сырые данные",
    ],
    correct: 1,
    explanation: "Normal distribution не учитывает clamp — log_prob вычисляется для значения, которое не совпадает с реально отправленным в среду, что искажает policy gradient.",
  },
  {
    question: "Для чего нужен ret_t.detach() при подсчете Value Loss?",
    options: [
      "Чтобы Value Network подгонялась под фиксированные таргеты, не ломая граф",
      "Чтобы ускорить обучение в 2 раза",
      "Для экспорта в ONNX",
    ],
    correct: 0,
    explanation: "Без .detach() backward pass мог бы двигать и предсказание, и таргет одновременно, что приводит к коллапсу обучения.",
  },
  {
    question: "Зачем была увеличена длина эпизода (MAX_STEPS) со 100 до 1000?",
    options: [
      "Из-за бага в PyTorch",
      "FoodCollector имеет разреженный сигнал награды, за 100 шагов агент не успевает ничего сделать",
      "Чтобы увеличить размер батча",
    ],
    correct: 1,
    explanation: "FoodCollector рассчитан на эпизоды 1000–5000 шагов. За 100 шагов агент совершает ~3-4 манёвра и почти не сталкивается с едой.",
  },
];

/* ───────── Code Snippets ───────── */
const codeAct = `@torch.no_grad()
def act(self, obs):
    c_mean, c_std, d_logits, val = self.forward(obs)
    
    c_dist = Normal(c_mean, c_std)
    c_raw  = c_dist.sample()          # pre-clamp: для log_prob
    c_act  = c_raw.clamp(-1.0, 1.0)   # clamped: для Unity
    
    d_acts = [Categorical(logits=l).sample() 
              for l in d_logits]
    
    return c_raw, c_act, d_acts, val`;

const codeEval = `def evaluate_actions(self, obs, c_act_stored, d_acts_stored):
    c_mean, c_std, d_logits, val = self.forward(obs)
    
    lp  = torch.zeros(obs.shape[0], device=obs.device)
    ent = torch.zeros_like(lp)
    
    # Непрерывные: log_prob от raw-действий
    dist_c = Normal(c_mean, c_std)
    lp  += dist_c.log_prob(c_act_stored).sum(-1)
    ent += dist_c.entropy().sum(-1)
    
    # Дискретные
    for i, logits in enumerate(d_logits):
        dist_d = Categorical(logits=logits)
        lp  += dist_d.log_prob(d_acts_stored[i])
        ent += dist_d.entropy()
    
    return lp, ent, val`;

/* ───────── Animated Section Wrapper ───────── */
const AnimatedSection = ({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </section>
  );
};

/* ═══════════════════════════════════════ */
/*              MAIN COMPONENT            */
/* ═══════════════════════════════════════ */
const DemoProject = () => {
  const [activeSection, setActiveSection] = useState("intro");
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(checklistItems.length).fill(false));
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>(new Array(quizQuestions.length).fill(null));
  const [quizRevealed, setQuizRevealed] = useState<boolean[]>(new Array(quizQuestions.length).fill(false));

  const allChecked = checkedItems.every(Boolean);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const toggleCheck = (i: number) => {
    setCheckedItems((prev) => { const n = [...prev]; n[i] = !n[i]; return n; });
  };

  const selectAnswer = (qIdx: number, aIdx: number) => {
    if (quizRevealed[qIdx]) return;
    setQuizAnswers((prev) => { const n = [...prev]; n[qIdx] = aIdx; return n; });
    setQuizRevealed((prev) => { const n = [...prev]; n[qIdx] = true; return n; });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="FoodCollector REINFORCE Training Pipeline | RL Platform"
        description="Интерактивный модуль: обучение агента в Unity ML-Agents с алгоритмом REINFORCE. Архитектура, тренировка, экспорт ONNX."
        path="/demo-project"
      />
      <Navbar />

      {/* Layout: sidebar + content */}
      <div className="container mx-auto px-4 pt-8 pb-20 flex gap-8">
        {/* Left sidebar TOC — hidden on mobile */}
        <aside className="hidden lg:block w-56 shrink-0">
          <nav className="sticky top-24 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">Содержание</p>
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-left ${
                    activeSection === s.id
                      ? "bg-primary/15 text-primary shadow-[0_0_12px_hsl(var(--primary)/0.2)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {s.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-16">

          {/* Download */}
          <div className="flex justify-end">
            <a href="/FoodCollector_REINFORCE_v3.ipynb" download>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Скачать .ipynb
              </Button>
            </a>
          </div>

          {/* ════════ SECTION 1: INTRO ════════ */}
          <AnimatedSection id="intro">
            <div className="text-center space-y-6 mb-16">
              <Badge variant="outline" className="border-primary/50 text-primary px-4 py-1">
                Unity ML-Agents · Policy Gradient · ONNX
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  FoodCollector
                </span>
                <br />
                <span className="text-foreground text-3xl sm:text-4xl">REINFORCE Training Pipeline v3</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Единый оптимизированный пайплайн: <span className="text-primary font-semibold">подключение</span> →{" "}
                <span className="text-secondary font-semibold">обучение</span> →{" "}
                <span className="text-accent font-semibold">экспорт ONNX</span> для Unity ML-Agents.
                Среда: FoodCollector (Release 22). Алгоритм: REINFORCE + Baseline.
              </p>
            </div>

            {/* Optimization Cards — hover to reveal */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Ключевые оптимизации v3
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {optimizations.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <HoverCard key={opt.id} openDelay={100} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <button className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] transition-all duration-300 text-left w-full group">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-foreground leading-tight">{opt.title}</span>
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 border-primary/20 shadow-xl z-[100]" style={{ backgroundColor: 'hsl(230, 20%, 10%)' }}>
                        <div className="space-y-2.5">
                          <p className="text-sm font-semibold text-foreground">{opt.title}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{opt.what}</p>
                          <div className="space-y-1.5">
                            <p className="text-xs text-destructive/90 leading-relaxed">
                              <span className="font-semibold text-destructive">Проблема: </span>{opt.problem}
                            </p>
                            <p className="text-xs leading-relaxed">
                              <span className="font-semibold text-primary">Код: </span>
                              <code className="text-[11px] font-mono text-primary/80 bg-primary/5 px-1 py-0.5 rounded">{opt.code}</code>
                            </p>
                            <p className="text-xs leading-relaxed">
                              <span className="font-semibold text-accent-foreground">Эффект: </span>
                              <span className="text-muted-foreground">{opt.effect}</span>
                            </p>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>

          {/* ════════ SECTION 2: ARCHITECTURE ════════ */}
          <AnimatedSection id="architecture">
            <h2 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Архитектура HybridPolicyNetwork
              </span>
            </h2>
            <p className="text-muted-foreground mb-8">Два режима работы одной сети</p>

            {/* Architecture Diagram */}
            <Card className="bg-card/40 border-border/50 mb-8 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
                  <div className="px-6 py-4 rounded-xl bg-muted/50 border border-border text-center">
                    <div className="text-muted-foreground text-xs mb-1">Input</div>
                    <div className="font-mono font-semibold text-foreground">obs [N, 8000]</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-primary rotate-90 md:rotate-0" />
                  <div className="px-6 py-4 rounded-xl bg-primary/10 border border-primary/30 text-center">
                    <div className="text-primary text-xs mb-1">Shared</div>
                    <div className="font-mono font-semibold text-foreground">Encoder (256→256)</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-primary rotate-90 md:rotate-0" />
                  <div className="flex flex-col gap-2">
                    <div className="px-4 py-2 rounded-lg bg-secondary/10 border border-secondary/30 text-center">
                      <span className="font-mono text-xs text-secondary">Continuous Head</span>
                      <span className="text-xs text-muted-foreground block">Normal(μ, σ)</span>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-center">
                      <span className="font-mono text-xs text-accent">Discrete Heads</span>
                      <span className="text-xs text-muted-foreground block">Categorical</span>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-center">
                      <span className="font-mono text-xs text-primary">Value Head</span>
                      <span className="text-xs text-muted-foreground block">Baseline V(s)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs: Rollout vs Update */}
            <Tabs defaultValue="rollout" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/30">
                <TabsTrigger value="rollout" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  Rollout (act)
                </TabsTrigger>
                <TabsTrigger value="update" className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary">
                  Update (evaluate_actions)
                </TabsTrigger>
              </TabsList>
              <TabsContent value="rollout" className="mt-4">
                <Card className="bg-card/40 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary flex items-center gap-2">
                      <Play className="w-5 h-5" /> Rollout — torch.no_grad()
                    </CardTitle>
                    <CardDescription>
                      Быстрый сэмплинг действий без построения вычислительного графа.
                      Возвращает c_raw (pre-clamp для log_prob), c_act (clamped [-1,1] для Unity),
                      дискретные действия и baseline value.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CyberCodeBlock language="python" filename="act.py">{codeAct}</CyberCodeBlock>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="update" className="mt-4">
                <Card className="bg-card/40 border-secondary/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-secondary flex items-center gap-2">
                      <GitBranch className="w-5 h-5" /> Update — с градиентом
                    </CardTitle>
                    <CardDescription>
                      Пересчитывает log_prob и энтропию по ранее сэмплированным действиям.
                      Выполняет один backward pass.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CyberCodeBlock language="python" filename="evaluate_actions.py">{codeEval}</CyberCodeBlock>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </AnimatedSection>

          {/* ════════ SECTION 3: TRAINING ════════ */}
          <AnimatedSection id="training">
            <h2 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Тренировочный цикл
              </span>
            </h2>
            <p className="text-muted-foreground mb-10">Схема «Batched Replay»</p>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-accent" />

              <div className="space-y-8">
                {timelineSteps.map((ts) => {
                  const Icon = ts.icon;
                  const colorClasses = {
                    primary: { border: "border-primary", bg: "bg-primary/10", text: "text-primary" },
                    secondary: { border: "border-secondary", bg: "bg-secondary/10", text: "text-secondary" },
                    accent: { border: "border-accent", bg: "bg-accent/10", text: "text-accent" },
                  }[ts.color];

                  return (
                    <div key={ts.step} className="relative pl-16">
                      <div className={`absolute left-3 top-5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 ${colorClasses.border} ${colorClasses.bg} ${colorClasses.text}`}>
                        {ts.step}
                      </div>
                      <Card className={`bg-card/40 backdrop-blur-sm ${colorClasses.border}/30 hover:${colorClasses.border}/60 transition-all duration-300`}>
                        <CardHeader className="pb-2">
                          <CardTitle className={`text-lg flex items-center gap-2 ${colorClasses.text}`}>
                            <Icon className="w-5 h-5" />
                            Шаг {ts.step}: {ts.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm text-muted-foreground">{ts.description}</p>
                          {ts.highlight && (
                            <div className="inline-block px-3 py-1.5 rounded-md bg-background/80 border border-border/50">
                              <code className={`text-xs font-mono ${colorClasses.text}`}>{ts.highlight}</code>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>

          {/* ════════ SECTION 4: EXPORT ════════ */}
          <AnimatedSection id="export">
            <h2 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Экспорт ONNX и интеграция в Unity
              </span>
            </h2>
            <p className="text-muted-foreground mb-10">Отметьте все шаги, чтобы завершить пайплайн</p>

            <Card className="bg-card/40 border-border/50">
              <CardContent className="p-6 space-y-4">
                {checklistItems.map((item, i) => (
                  <label
                    key={i}
                    className={`flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      checkedItems[i]
                        ? "bg-primary/5 border border-primary/20"
                        : "bg-muted/20 border border-transparent hover:bg-muted/30"
                    }`}
                  >
                    <Checkbox
                      checked={checkedItems[i]}
                      onCheckedChange={() => toggleCheck(i)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <span className={`text-sm transition-colors ${checkedItems[i] ? "text-primary" : "text-foreground"}`}>
                        {i + 1}. {item}
                      </span>
                    </div>
                    {checkedItems[i] && <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />}
                  </label>
                ))}

                {/* Success Animation */}
                <div
                  className={`mt-6 p-6 rounded-xl text-center transition-all duration-500 ${
                    allChecked
                      ? "opacity-100 translate-y-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/30"
                      : "opacity-0 translate-y-4 pointer-events-none h-0 p-0 m-0 overflow-hidden"
                  }`}
                >
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                    Успех! Пайплайн завершен
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Все шаги выполнены — ваша модель готова к инференсу в Unity.
                  </p>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* ════════ SECTION 5: QUIZ ════════ */}
          <AnimatedSection id="test">
            <h2 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Knowledge Check
              </span>
            </h2>
            <p className="text-muted-foreground mb-10">Проверьте своё понимание ключевых концепций</p>

            <div className="space-y-8">
              {quizQuestions.map((q, qIdx) => (
                <Card key={qIdx} className="bg-card/40 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      <span className="text-primary mr-2">#{qIdx + 1}</span>
                      {q.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {q.options.map((opt, aIdx) => {
                      const isSelected = quizAnswers[qIdx] === aIdx;
                      const isRevealed = quizRevealed[qIdx];
                      const isCorrect = aIdx === q.correct;

                      let optionStyle = "bg-muted/20 border-transparent hover:bg-muted/40 cursor-pointer";
                      if (isRevealed) {
                        if (isCorrect) {
                          optionStyle = "bg-primary/10 border-primary/30";
                        } else if (isSelected && !isCorrect) {
                          optionStyle = "bg-destructive/10 border-destructive/30";
                        } else {
                          optionStyle = "bg-muted/10 border-transparent opacity-50";
                        }
                      }

                      return (
                        <button
                          key={aIdx}
                          onClick={() => selectAnswer(qIdx, aIdx)}
                          disabled={isRevealed}
                          className={`w-full flex items-center gap-3 p-4 rounded-lg border text-left transition-all duration-300 ${optionStyle}`}
                        >
                          <span className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                            {String.fromCharCode(65 + aIdx)}
                          </span>
                          <span className="text-sm text-foreground flex-1">{opt}</span>
                          {isRevealed && isCorrect && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                          {isRevealed && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive shrink-0" />}
                        </button>
                      );
                    })}

                    {/* Explanation */}
                    {quizRevealed[qIdx] && (
                      <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20 animate-fade-in">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold text-primary">Пояснение: </span>
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </AnimatedSection>

          {/* ════════ FULL CODE ════════ */}
          <AnimatedSection id="full-code" className="pt-8">
            <Card className="bg-card/40 border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-foreground flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-primary" />
                      Полный код ноутбука
                    </CardTitle>
                    <CardDescription className="mt-1">FoodCollector_REINFORCE_v3.ipynb</CardDescription>
                  </div>
                  <a href="/FoodCollector_REINFORCE_v3.ipynb" download>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Скачать
                    </Button>
                  </a>
                </div>
              </CardHeader>
              <CardContent>
                <FullCodeDisplay />
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* ════════ TRAINED MODEL ════════ */}
          <AnimatedSection id="trained-model" className="pt-8">
            <Card className="bg-card/40 border-secondary/20 overflow-hidden">
              <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 shrink-0 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center shadow-[0_0_20px_hsl(var(--secondary)/0.2)]">
                    <Network className="w-8 h-8 text-secondary" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-secondary animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Brain className="w-5 h-5 text-secondary" /> Обученная нейронная сеть
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">FoodCollector_REINFORCE_3.0.onnx — готовая модель, загрузи в Unity Sentis и запусти агента.</p>
                  </div>
                </div>
                <a href="/FoodCollector_REINFORCE_3.0.onnx" download>
                  <Button variant="secondary" className="shrink-0 gap-2">
                    <Download className="w-4 h-4" /> Скачать .onnx
                  </Button>
                </a>
              </CardContent>
            </Card>
          </AnimatedSection>

          {/* ════════ SECTION 6: TECHNICAL AUDIT ════════ */}
          <AnimatedSection id="audit" className="pt-8">
            <div className="space-y-6">
              <div className="text-center space-y-4 mb-12">
                <Badge variant="outline" className="border-secondary/50 text-secondary px-4 py-1">
                  Deep Research · Gemini Pro
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold">
                  <span className="bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
                    Технический аудит REINFORCE + Baseline
                  </span>
                </h2>
                <p className="text-muted-foreground max-w-3xl mx-auto">
                  Комплексный технический аудит и теоретическое обоснование реализации алгоритма глубокого обучения
                  с подкреплением на базе PyTorch: Архитектура Actor-Critic Lite в гибридных пространствах действий.
                </p>
              </div>

              <Accordion type="multiple" className="space-y-4">

                {/* ─── Аннотация ─── */}
                <AccordionItem value="abstract" className="border border-border/50 rounded-xl overflow-hidden bg-card/40">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-secondary" />
                      </div>
                      <span className="text-lg font-semibold text-foreground">Аннотация</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="prose-cyber space-y-4 text-sm text-muted-foreground leading-relaxed">
                      <p>
                        В настоящей исследовательской статье представлен исчерпывающий технический аудит и глубокий теоретический разбор
                        программной реализации алгоритма глубокого обучения с подкреплением (Deep Reinforcement Learning, DRL) с использованием
                        фреймворка PyTorch. Объектом исследования выступает кодовая база <span className="text-primary font-mono text-xs">«FoodCollector · REINFORCE Training · v3 (Fixed)»</span>,
                        предназначенная для обучения агентов в симуляционной среде Unity ML-Agents.
                      </p>
                      <p>
                        Ключевой особенностью анализируемой системы является её работа с <strong className="text-foreground">гибридным пространством действий</strong>,
                        которое требует одновременной генерации как непрерывных, так и дискретных управляющих сигналов. Отчет включает детальное
                        теоретическое обоснование методов градиента политики, сопоставление их с фундаментальными работами в области DRL
                        (DQN, PPO), а также построчный анализ критических сегментов кода.
                      </p>
                      <p>
                        В рамках аудита v3 подробно разбираются: правильная обработка «сырых» сэмплов (raw samples) для устранения смещения
                        градиентов, методы нормализации преимуществ, механизмы регуляризации энтропии для баланса exploration/exploitation,
                        а также изоляция вычислительных графов для предотвращения некорректного обратного распространения ошибки.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* ─── Введение ─── */}
                <AccordionItem value="introduction" className="border border-border/50 rounded-xl overflow-hidden bg-card/40">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-lg font-semibold text-foreground">Введение: от DQN к гибридным пространствам</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="prose-cyber space-y-4 text-sm text-muted-foreground leading-relaxed">
                      <p>
                        Исторический прорыв в DRL был ознаменован публикацией работы Mnih et al. (2015), в которой алгоритм <strong className="text-foreground">Deep Q-Network (DQN)</strong> продемонстрировал способность обучаться игре в видеоигры Atari на уровне человека. Однако DQN изначально проектировался для сред с дискретным пространством действий.
                      </p>
                      <p>
                        С переходом к управлению робототехническими системами и навигации в 3D-пространстве, дискретизация непрерывных действий стала приводить к <strong className="text-foreground">«проклятию размерности»</strong>. Для преодоления этого ограничения исследователи обратились к методам <strong className="text-foreground">градиента политики</strong> (Policy Gradient) — алгоритмы REINFORCE и PPO (Schulman et al., 2017).
                      </p>
                      <p>
                        Многие реальные задачи требуют одновременного контроля как дискретных механизмов (включение двигателей, стрельба), так и непрерывных параметров движения (угол поворота, ускорение). Инструментарий <strong className="text-foreground">Unity ML-Agents</strong> стал стандартом де-факто для создания таких комплексных симуляций.
                      </p>
                      <p>
                        Для студентов DRL понимание разрыва между математическими уравнениями и их программной реализацией на PyTorch критически важно. Механизмы стохастического сэмплирования, clipping, управления тензорами и построения вычислительных графов часто становятся источниками <em>скрытых ошибок</em>, которые не вызывают явных сбоев, но фатально нарушают математическую логику обучения.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* ─── Теоретическое обоснование ─── */}
                <AccordionItem value="theory" className="border border-border/50 rounded-xl overflow-hidden bg-card/40">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-lg font-semibold text-foreground">Теоретическое обоснование</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="prose-cyber space-y-6 text-sm text-muted-foreground leading-relaxed">

                      <div>
                        <h4 className="text-foreground font-semibold mb-2">Марковские процессы принятия решений (MDP)</h4>
                        <p>Обучение с подкреплением формализуется через MDP, определяемый кортежем <code className="text-primary text-xs">(S, A, P, R, γ)</code>, где S — множество состояний, A — пространство действий, P — динамика переходных вероятностей среды, R — функция награды, а γ — фактор дисконтирования.</p>
                      </div>

                      <div>
                        <h4 className="text-foreground font-semibold mb-2">Теорема о градиенте политики и REINFORCE</h4>
                        <p>Целевая функция: <Math display={false}>{"\\enfTgt{J}(\\pi_\\theta) = \\mathbb{E}_{\\tau \\sim \\pi_\\theta}[\\enfTgt{R}(\\tau)]"}</Math>. Градиент:</p>
                        <Math>{"\\enfOp{\\nabla}_\\theta \\enfTgt{J}(\\pi_\\theta) = \\mathbb{E}_{\\tau \\sim \\pi_\\theta} \\left[ \\sum_{t=0}^{T} \\enfOp{\\nabla}_\\theta \\log \\pi_\\theta(a_t \\mid \\enfVar{s}_t) \\cdot \\enfOp{G}_t \\right]"}</Math>
                        <p>где <Math display={false}>{"\\enfOp{G}_t = \\sum_{k=t}^{T} \\enfPar{\\gamma}^{k-t} \\enfTgt{r}_k"}</Math> — кумулятивная дисконтированная награда (reward-to-go).</p>
                        <p className="mt-2">В PyTorch максимизация J(π) заменяется минимизацией policy loss:</p>
                        <Math>{"L_{policy} = -\\frac{1}{N} \\sum \\log \\pi_\\theta(a_t \\mid \\enfVar{s}_t) \\cdot \\enfOp{G}_t"}</Math>
                      </div>

                      <div>
                        <h4 className="text-foreground font-semibold mb-2">Actor-Critic Lite и Advantage</h4>
                        <p>Классический REINFORCE страдает от колоссальной дисперсии оценок градиента. Решение — <strong className="text-foreground">базовая линия (baseline)</strong> V_w(s):</p>
                        <Math>{"A(\\enfVar{s}_t, a_t) = \\enfOp{G}_t - \\enfOp{V}_w(\\enfVar{s}_t)"}</Math>
                        <p>Если A &gt; 0 — действие лучше среднего, вероятность увеличивается. Если A &lt; 0 — уменьшается.</p>
                      </div>

                      <div>
                        <h4 className="text-foreground font-semibold mb-2">Регуляризация энтропии</h4>
                        <Math>{"L_{total} = L_{policy} + \\enfPar{\\alpha} L_{value} - \\beta H(\\pi)"}</Math>
                        <p>где β = <code className="text-primary text-xs">ENTROPY_COEFF = 0.02</code>. Вычитание энтропии из loss эквивалентно её максимизации — предотвращает преждевременную сходимость.</p>
                      </div>

                      <div>
                        <h4 className="text-foreground font-semibold mb-2">Гибридное пространство действий</h4>
                        <Math>{"\\pi_\\theta(a \\mid \\enfVar{s}) = \\pi_{cont}(a_{cont} \\mid \\enfVar{s}) \\cdot \\pi_{disc}(a_{disc} \\mid \\enfVar{s})"}</Math>
                        <p>Логарифм произведения = сумма логарифмов:</p>
                        <Math>{"\\log \\pi_\\theta(a \\mid \\enfVar{s}) = \\sum_{i=1}^{3} \\log \\mathcal{N}(a_{cont,i}|\\mu_i, \\sigma_i) + \\log \\text{Cat}(a_{disc}|p)"}</Math>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* ─── Описание архитектуры ─── */}
                <AccordionItem value="arch-detail" className="border border-border/50 rounded-xl overflow-hidden bg-card/40">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Layers className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-lg font-semibold text-foreground">Архитектура нейронной сети и среды</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="prose-cyber space-y-6 text-sm text-muted-foreground leading-relaxed">

                      <div>
                        <h4 className="text-foreground font-semibold mb-2">Среда FoodCollector и GridSensor</h4>
                        <p>В среде FoodCollector (Release 22) агенты соревнуются за сбор ресурсов в 3D-пространстве: <span className="text-primary">зелёные объекты</span> — положительная награда, <span className="text-destructive">красные</span> — отрицательная. Ключевой сенсор — <strong className="text-foreground">GridSensor</strong>, проецирующий локальное 3D-окружение на 2D-ортографическую сетку.</p>
                        <p className="mt-2">Важно: Unity использует формат <code className="text-primary text-xs">HWC</code>, а PyTorch (<code className="text-primary text-xs">nn.Conv2d</code>) требует <code className="text-primary text-xs">CHW</code>. Код ожидает вход <code className="text-primary text-xs">[1, C, H, W]</code>.</p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-border/50">
                              <th className="text-left py-2 px-3 text-foreground font-semibold">Компонент</th>
                              <th className="text-left py-2 px-3 text-foreground font-semibold">PyTorch реализация</th>
                              <th className="text-left py-2 px-3 text-foreground font-semibold">Назначение</th>
                            </tr>
                          </thead>
                          <tbody className="text-muted-foreground">
                            <tr className="border-b border-border/30">
                              <td className="py-2 px-3"><strong className="text-primary">Энкодер</strong></td>
                              <td className="py-2 px-3 font-mono">Conv2d → ReLU → Flatten()</td>
                              <td className="py-2 px-3">Извлечение пространственных признаков → латентный вектор h_t</td>
                            </tr>
                            <tr className="border-b border-border/30">
                              <td className="py-2 px-3"><strong className="text-secondary">Critic Head</strong></td>
                              <td className="py-2 px-3 font-mono">Linear → ReLU → Linear(1)</td>
                              <td className="py-2 px-3">Аппроксимация V_w(s) — скалярная оценка ценности</td>
                            </tr>
                            <tr className="border-b border-border/30">
                              <td className="py-2 px-3"><strong className="text-accent">Discrete Actor</strong></td>
                              <td className="py-2 px-3 font-mono">Linear(K) → Categorical(logits)</td>
                              <td className="py-2 px-3">Логиты для K дискретных действий</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-3"><strong className="text-primary">Continuous Actor</strong></td>
                              <td className="py-2 px-3 font-mono">Linear(3) → Normal(μ, σ)</td>
                              <td className="py-2 px-3">Вектор μ (ускорение, поворот), σ — nn.Parameter</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* ─── Разбор реализации ─── */}
                <AccordionItem value="impl-audit" className="border border-border/50 rounded-xl overflow-hidden bg-card/40">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-destructive" />
                      </div>
                      <span className="text-lg font-semibold text-foreground">Разбор реализации: аудит критических секций v3</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="prose-cyber space-y-8 text-sm text-muted-foreground leading-relaxed">

                      {/* 4.1 GridSensor Patch */}
                      <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                        <h4 className="text-foreground font-semibold mb-3 flex items-center gap-2">
                          <span className="text-primary">§4.1</span> Патч GridSensor — обработка пространственных наблюдений
                        </h4>
                        <p className="mb-3">Специальный патч для корректной распаковки данных GridSensor из Unity и их приведения к формату CHW для PyTorch:</p>
                        <CyberCodeBlock language="python" filename="gridsensor_patch.py">{`_orig_obs_fn = getattr(_rpc, '_observation_to_np_array', None)

def _patched_obs_to_np(obs, expected_shape):
    """Обёртка: пробует оригинал, при ошибке — ручная декомпрессия."""
    try:
        return _orig_obs_fn(obs, expected_shape)
    except UnityObservationException:
        pass

    if obs.compression_type == COMPRESSION_TYPE_NONE:
        img = np.array(obs.float_data.data, dtype=np.float32).reshape(obs.shape)
    else:
        ch = obs.shape if len(obs.shape) >= 3 else None
        img = process_pixels(obs.compressed_data, ch, list(obs.compressed_channel_mapping))

    # Брутфорс-поиск правильной перестановки осей
    if len(expected_shape) == 3 and img.shape != tuple(expected_shape):
        for perm in [(0,1,2),(0,2,1),(1,0,2),(1,2,0),(2,0,1),(2,1,0)]:
            if np.transpose(img, perm).shape == tuple(expected_shape):
                img = np.transpose(img, perm)
                break
    return img`}</CyberCodeBlock>
                        <p className="mt-3">Критический участок — цикл поиска перестановки размерностей. Если форма массива не совпадает с <code className="text-primary text-xs">expected_shape</code> (CHW), алгоритм перебирает все 6 пермутаций осей через <code className="text-primary text-xs">np.transpose</code>.</p>
                      </div>

                      {/* 4.2 StatsSideChannel */}
                      <div className="p-4 rounded-lg border border-border/50 bg-background/50">
                        <h4 className="text-foreground font-semibold mb-3 flex items-center gap-2">
                          <span className="text-primary">§4.2</span> Интеграция StatsSideChannel
                        </h4>
                        <CyberCodeBlock language="python" filename="stats_channel.py">{`class StatsSideChannel(SideChannel):
    """Минимальная заглушка StatsSideChannel."""
    def __init__(self):
        super().__init__(
            _uuid.UUID("a1d8f7b7-cec8-50f9-b78b-d3e165a78520")
        )
        self.stats = {}

    def on_message_received(self, msg: IncomingMessage) -> None:
        key = msg.read_string()
        val = msg.read_float32()
        _   = msg.read_int32()  # aggregation type
        self.stats.setdefault(key, []).append(val)

    def get_and_reset_stats(self):
        s = self.stats
        self.stats = {}
        return s`}</CyberCodeBlock>
                        <p className="mt-3">UUID <code className="text-primary text-xs">"a1d8f7b7-..."</code> жёстко зарезервирован в ML-Agents для передачи метрик среды. Без этого класса внутренние награды Unity недоступны для аналитики в TensorBoard.</p>
                      </div>

                      {/* 4.3 Advantage Normalization */}
                      <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                        <h4 className="text-foreground font-semibold mb-3 flex items-center gap-2">
                          <span className="text-primary">§4.3</span> Нормализация преимуществ (Fix 2)
                        </h4>
                        <CyberCodeBlock language="python" filename="advantage_norm.py">{`adv = returns - values.detach()
adv = (adv - adv.mean()) / (adv.std() + 1e-8)`}</CyberCodeBlock>
                        <div className="mt-3 space-y-2">
                          <p><strong className="text-foreground">Зачем:</strong> Без нормализации масштаб градиентов «плавает» от батча к батчу. Аномально высокие adv → Gradient Explosion.</p>
                          <p><strong className="text-foreground">Эффект 1:</strong> Стабилизация градиентов — можно использовать более высокий learning rate без расходимости.</p>
                          <p><strong className="text-foreground">Эффект 2:</strong> Ровно половина действий получает положительный adv (↑ вероятность), половина — отрицательный (↓). Обучение инвариантно к сдвигу награды.</p>
                          <p><code className="text-primary text-xs">1e-8</code> предотвращает деление на ноль (NaN) при нулевой дисперсии.</p>
                        </div>
                      </div>

                      {/* 4.4 Value Target Detachment */}
                      <div className="p-4 rounded-lg border border-secondary/20 bg-secondary/5">
                        <h4 className="text-foreground font-semibold mb-3 flex items-center gap-2">
                          <span className="text-secondary">§4.4</span> Изоляция графов вычислений — .detach() (Fix 3)
                        </h4>
                        <p className="mb-3">В Actor-Critic полная функция потерь:</p>
                        <Math>{"L_{total} = L_{policy} + c_1 L_{value} - c_2 L_{entropy}"}</Math>
                        <p className="mt-3">
                          <strong className="text-foreground">Проблема autograd:</strong> Без <code className="text-primary text-xs">.detach()</code> на G_t механизм autograd пропустит градиенты сквозь целевое значение обратно в сеть. Результат: <code className="text-destructive text-xs">RuntimeError: Trying to backward through the graph a second time</code> или некорректные градиенты, уничтожающие critic.
                        </p>
                        <p className="mt-2"><code className="text-primary text-xs">.detach()</code> отсекает тензор от графа вычислений, превращая его в константу для текущего шага оптимизации.</p>
                      </div>

                      {/* 4.5 Raw Samples */}
                      <div className="p-4 rounded-lg border border-accent/20 bg-accent/5">
                        <h4 className="text-foreground font-semibold mb-3 flex items-center gap-2">
                          <span className="text-accent">§4.5</span> Критическая проблема «сырых сэмплов» (Fix 4)
                        </h4>
                        <p className="mb-3">Самое неочевидное, но фундаментально важное исправление v3.</p>
                        <p><strong className="text-foreground">Ошибка до v3:</strong></p>
                        <ol className="list-decimal list-inside space-y-1 ml-2 my-2">
                          <li>Агент сэмплирует: <Math display={false}>{"\\tilde{a} \\sim \\mathcal{N}(\\mu, \\sigma^2)"}</Math></li>
                          <li>Усечение: <Math display={false}>{"a = \\text{clamp}(\\tilde{a}, -1, 1)"}</Math></li>
                          <li>В буфер сохранялось <em>усечённое</em> a</li>
                          <li>На этапе оптимизации: <Math display={false}>{"\\log \\pi_\\theta(a \\mid \\enfVar{s})"}</Math> — <span className="text-destructive font-semibold">некорректно!</span></li>
                        </ol>
                        <p className="mt-3"><strong className="text-foreground">Пример:</strong> μ=2.0, σ=1.0, сэмплирован ã=2.5, clamped a=1.0. Градиент от <code className="text-primary text-xs">log_prob(1.0)</code> при μ=2.0 укажет оптимизатору сдвинуть μ к 1.0 вместо 2.5. Возникает <strong className="text-destructive">Gradient Bias</strong>.</p>
                        <CyberCodeBlock language="python" filename="fix4_raw_samples.py">{`# Правильно: сохраняем raw_action
dist_cont = Normal(mu, sigma)
raw_action = dist_cont.sample()       # Сырой сэмпл (напр. 2.5)
clamped_action = raw_action.clamp(-1, 1)  # Для среды (1.0)
# В буфер → raw_action

# При update: log_prob строго по СЫРОМУ сэмплу
dist_cont = Normal(new_mu, new_sigma)
log_prob_cont = dist_cont.log_prob(raw_action)  # ✓ Корректно`}</CyberCodeBlock>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* ─── Таблица гиперпараметров ─── */}
                <AccordionItem value="hyperparams" className="border border-border/50 rounded-xl overflow-hidden bg-card/40">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Target className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-lg font-semibold text-foreground">Ключевые гиперпараметры v3</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border/50">
                            <th className="text-left py-3 px-3 text-foreground font-semibold">Параметр</th>
                            <th className="text-left py-3 px-3 text-foreground font-semibold">Значение</th>
                            <th className="text-left py-3 px-3 text-foreground font-semibold">Обоснование</th>
                            <th className="text-left py-3 px-3 text-foreground font-semibold">PyTorch API</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr className="border-b border-border/30">
                            <td className="py-2 px-3 font-semibold text-foreground">Алгоритм</td>
                            <td className="py-2 px-3 font-mono text-primary">REINFORCE w/ Baseline</td>
                            <td className="py-2 px-3">Снижение дисперсии MC</td>
                            <td className="py-2 px-3 font-mono">Actor-Critic Lite</td>
                          </tr>
                          <tr className="border-b border-border/30">
                            <td className="py-2 px-3 font-semibold text-foreground">MAX_STEPS</td>
                            <td className="py-2 px-3 font-mono text-primary">1000</td>
                            <td className="py-2 px-3">Увеличен со 100</td>
                            <td className="py-2 px-3 font-mono">Размер тензоров → loss.backward()</td>
                          </tr>
                          <tr className="border-b border-border/30">
                            <td className="py-2 px-3 font-semibold text-foreground">Action Space</td>
                            <td className="py-2 px-3 font-mono text-primary">3 Cont + 1 Disc</td>
                            <td className="py-2 px-3">Гибридное управление</td>
                            <td className="py-2 px-3 font-mono">Normal() + Categorical()</td>
                          </tr>
                          <tr className="border-b border-border/30">
                            <td className="py-2 px-3 font-semibold text-foreground">Action Clamp</td>
                            <td className="py-2 px-3 font-mono text-primary">[-1, 1]</td>
                            <td className="py-2 px-3">Требования Unity</td>
                            <td className="py-2 px-3 font-mono">torch.clamp()</td>
                          </tr>
                          <tr className="border-b border-border/30">
                            <td className="py-2 px-3 font-semibold text-foreground">Adv. Norm.</td>
                            <td className="py-2 px-3 font-mono text-primary">Включено</td>
                            <td className="py-2 px-3">Стабилизация градиентов</td>
                            <td className="py-2 px-3 font-mono">(adv - mean) / (std + 1e-8)</td>
                          </tr>
                          <tr className="border-b border-border/30">
                            <td className="py-2 px-3 font-semibold text-foreground">ENTROPY_COEFF</td>
                            <td className="py-2 px-3 font-mono text-primary">0.02</td>
                            <td className="py-2 px-3">Увеличен с 0.01</td>
                            <td className="py-2 px-3 font-mono">Штраф в L_total</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-semibold text-foreground">Raw Samples</td>
                            <td className="py-2 px-3 font-mono text-primary">Да (pre-clamp)</td>
                            <td className="py-2 px-3">Корректность ∇log π</td>
                            <td className="py-2 px-3 font-mono">До torch.clamp()</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* ─── Ожидаемые кривые обучения ─── */}
                <AccordionItem value="training-curves" className="border border-border/50 rounded-xl overflow-hidden bg-card/40">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <RefreshCw className="w-4 h-4 text-secondary" />
                      </div>
                      <span className="text-lg font-semibold text-foreground">Ожидаемые кривые обучения (TensorBoard)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Card className="bg-background/50 border-border/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-primary">📈 Cumulative Reward</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">
                          Плавный асимптотический рост от околонулевых значений до стабильного плато по мере наработки сотен тысяч эпизодов.
                        </CardContent>
                      </Card>
                      <Card className="bg-background/50 border-border/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-secondary">📊 Policy Loss</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">
                          <strong className="text-foreground">Не стремится к нулю!</strong> Колеблется вокруг нуля (среднее adv = 0), постепенно снижая амплитуду осцилляций.
                        </CardContent>
                      </Card>
                      <Card className="bg-background/50 border-border/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-accent">📉 Value Loss</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">
                          Высокий пик на первых итерациях (V(s) случайная), затем экспоненциальное падение — критик научился предсказывать G_t.
                        </CardContent>
                      </Card>
                      <Card className="bg-background/50 border-border/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-primary">🔀 Entropy</CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">
                          Плавное снижение от максимума. <span className="text-destructive">⚠️ Резкое падение до нуля</span> = policy collapse!
                        </CardContent>
                      </Card>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* ─── Заключение ─── */}
                <AccordionItem value="conclusion" className="border border-border/50 rounded-xl overflow-hidden bg-card/40">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-lg font-semibold text-foreground">Заключение</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="prose-cyber space-y-4 text-sm text-muted-foreground leading-relaxed">
                      <p>
                        Проведённый аудит REINFORCE (Actor-Critic Lite) v3 для среды FoodCollector демонстрирует высокую инженерную и математическую зрелость подхода. Интеграция DRL со сложными физическими движками требует <strong className="text-foreground">глубокого понимания</strong> вычислительной математики тензорных графов и теории вероятностей.
                      </p>
                      <p>Критические точки отказа — не синтаксические ошибки, а <strong className="text-destructive">скрытые семантические нарушения</strong>:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>Неправильный порядок осей [C, H, W] при обработке данных GridSensor</li>
                        <li>Некорректное вычисление градиентов из-за clamp до расчёта log_prob</li>
                        <li>Нестабильность из-за ненормализованных преимуществ</li>
                        <li>Отсутствие изоляции графов через .detach()</li>
                      </ul>
                      <p>
                        Реализация v3 элегантно нивелирует эти ловушки. Гибридное пространство действий в рамках единой многоголовой архитектуры делает модель применимой от автономной робототехники до навигации NPC в видеоиграх.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </div>
          </AnimatedSection>
        </main>
      </div>

      <FooterSection />
    </div>
  );
};

/* ───────── Full Code Display Component ───────── */
const fullNotebookCode = `# ▓▓▓ FoodCollector · REINFORCE Training · v3 (Fixed) ▓▓▓
# Unity ML-Agents · Policy Gradient · ONNX Export Pipeline
# Среда: FoodCollector (Release 22)
# Алгоритм: REINFORCE + Baseline (Actor-Critic Lite)
# Действия: Hybrid (3 continuous + 1 discrete branch)

# ═══════════════════════════════════════════════════════
# §1 · Зависимости
# ═══════════════════════════════════════════════════════
import os, time
import numpy as np
from collections import deque

import torch
import torch.nn as nn
import torch.optim as optim
from torch.distributions import Categorical, Normal
from torch.utils.tensorboard import SummaryWriter

from mlagents_envs.environment import UnityEnvironment
from mlagents_envs.side_channel.engine_configuration_channel import (
    EngineConfigurationChannel,
)
from mlagents_envs.base_env import ActionTuple

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# ═══════════════════════════════════════════════════════
# §2 · Подключение к Unity
# ═══════════════════════════════════════════════════════
engine_channel = EngineConfigurationChannel()
env = UnityEnvironment(file_name=None, seed=42,
    side_channels=[engine_channel], worker_id=0)

engine_channel.set_configuration_parameters(
    time_scale=20.0, target_frame_rate=-1, quality_level=0)

env.reset()
behavior_name = list(env.behavior_specs.keys())[0]
spec = env.behavior_specs[behavior_name]

obs_shapes = [o.shape for o in spec.observation_specs]
total_obs_size = sum(int(np.prod(s)) for s in obs_shapes)
continuous_size = spec.action_spec.continuous_size
discrete_branches = spec.action_spec.discrete_branches

# ═══════════════════════════════════════════════════════
# §3 · HybridPolicyNetwork
# ═══════════════════════════════════════════════════════
class HybridPolicyNetwork(nn.Module):
    """
    Policy network для гибридных действий FoodCollector.
    obs → encoder → {continuous_head, discrete_heads, value_head}
    """
    def __init__(self, obs_size, cont_size, disc_branches, hidden=256):
        super().__init__()
        self.obs_size = obs_size
        self.continuous_size = cont_size
        self.discrete_branches = disc_branches

        self.encoder = nn.Sequential(
            nn.Linear(obs_size, hidden), nn.ReLU(),
            nn.Linear(hidden, hidden), nn.ReLU(),
        )
        self.cont_mean = nn.Linear(hidden, cont_size)
        self.cont_logstd = nn.Parameter(torch.zeros(cont_size))
        self.disc_heads = nn.ModuleList(
            [nn.Linear(hidden, b) for b in disc_branches]
        )
        self.value_head = nn.Linear(hidden, 1)

    def forward(self, obs):
        """Общий forward: возвращает (c_mean, c_std, d_logits, val)."""
        h = self.encoder(obs)
        c_mean = self.cont_mean(h)
        c_std = torch.clamp(self.cont_logstd, -5.0, 2.0).exp().expand_as(c_mean)
        d_logits = [head(h) for head in self.disc_heads]
        val = self.value_head(h).squeeze(-1)
        return c_mean, c_std, d_logits, val

    @torch.no_grad()
    def act(self, obs):
        """
        Rollout-фаза: сэмплирует действия без построения графа.
        Возвращает:
            c_raw  : [n_agents, cont_size]  — raw sample, для log_prob
            c_act  : [n_agents, cont_size]  — clamped [-1,1], для Unity
            d_acts : list of [n_agents]     — дискретные действия
            val    : [n_agents]             — baseline value (detached)
        """
        c_mean, c_std, d_logits, val = self.forward(obs)

        # [FIX 4] Сохраняем RAW sample (до clamp) для корректного log_prob
        # [FIX 9] Единый clamp [-1, 1]
        c_dist = Normal(c_mean, c_std)
        c_raw = c_dist.sample()            # pre-clamp: для evaluate_actions
        c_act = c_raw.clamp(-1.0, 1.0)     # post-clamp: для Unity

        d_acts = [Categorical(logits=l).sample() for l in d_logits]
        return c_raw, c_act, d_acts, val

    def evaluate_actions(self, obs, c_act_stored, d_acts_stored):
        """
        Update-фаза: один батчевый forward С градиентом.
        Пересчитывает log_prob и entropy по РАНЕЕ сэмплированным действиям.
        """
        c_mean, c_std, d_logits, val = self.forward(obs)
        lp = torch.zeros(obs.shape[0], device=obs.device)
        ent = torch.zeros_like(lp)

        # Непрерывные: log_prob от сохранённых raw-действий
        if self.continuous_size > 0:
            dist_c = Normal(c_mean, c_std)
            lp += dist_c.log_prob(c_act_stored).sum(-1)
            ent += dist_c.entropy().sum(-1)

        # Дискретные: log_prob от сохранённых действий
        for i, logits in enumerate(d_logits):
            dist_d = Categorical(logits=logits)
            lp += dist_d.log_prob(d_acts_stored[i])
            ent += dist_d.entropy()

        return lp, ent, val

# ═══════════════════════════════════════════════════════
# §4 · Утилиты
# ═══════════════════════════════════════════════════════
def obs_to_tensor(decision_steps):
    """DecisionSteps → flat tensor [n_agents, total_obs_size]."""
    parts = [o.reshape(o.shape[0], -1) for o in decision_steps.obs]
    return torch.from_numpy(np.concatenate(parts, 1)).float().to(device)

def make_action_tuple(cont, disc, n):
    """PyTorch tensors → ActionTuple для env.set_actions()."""
    c = np.clip(cont.cpu().numpy(), -1, 1).astype(np.float32)
    d = np.stack([a.cpu().numpy() for a in disc], 1).astype(np.int32)
    return ActionTuple(continuous=c, discrete=d)

def discounted_returns(rewards, gamma=0.99):
    """Список наград → нормализованные дисконтированные возвраты."""
    G, out = 0.0, []
    for r in reversed(rewards):
        G = r + gamma * G
        out.append(G)
    out.reverse()
    ret = np.array(out, np.float32)
    return (ret - ret.mean()) / (ret.std() + 1e-8) if len(ret) > 1 else ret

# ═══════════════════════════════════════════════════════
# §5 · Тренировочный цикл · REINFORCE + Baseline
# ═══════════════════════════════════════════════════════
NUM_EPISODES = 300
MAX_STEPS = 1000         # [FIX 1] было 100
GAMMA = 0.99
ENTROPY_COEFF = 0.02     # [FIX 5] было 0.01
VALUE_COEFF = 0.5
CLIP_GRAD = 1.0

policy = HybridPolicyNetwork(
    total_obs_size, continuous_size, discrete_branches).to(device)
optimizer = optim.Adam(policy.parameters(), lr=3e-4)

reward_buf = deque(maxlen=100)
best_avg = -float('inf')

for ep in range(1, NUM_EPISODES + 1):
    env.reset()
    stored_obs, stored_cont, stored_disc = [], [], []
    stored_n, buf_val, buf_rew = [], [], []
    ep_reward, ep_steps = 0.0, 0

    # ═══════ ROLLOUT — torch.no_grad() внутри act() ═══════
    for _ in range(MAX_STEPS):
        dec, term = env.get_steps(behavior_name)
        if len(dec) == 0:
            if len(term) > 0: break
            env.step(); continue

        obs_t = obs_to_tensor(dec)
        c_raw, c_act, d_acts, val = policy.act(obs_t)
        env.set_actions(behavior_name,
            make_action_tuple(c_act, d_acts, len(dec)))
        env.step()

        r = float(np.mean(dec.reward))
        stored_obs.append(obs_t)
        stored_cont.append(c_raw)     # [FIX 4] raw pre-clamp
        stored_disc.append(d_acts)
        stored_n.append(len(dec))
        buf_val.append(val.mean().item())
        buf_rew.append(r)
        ep_reward += r
        ep_steps += 1
        if len(term) > 0: break

    if not buf_rew: continue

    # ═══════ UPDATE — один батчевый forward С градиентом ═══════
    T = len(buf_rew)
    all_obs = torch.cat(stored_obs, 0)
    all_cont = torch.cat(stored_cont, 0)
    all_disc = [
        torch.cat([stored_disc[t][b] for t in range(T)], 0)
        for b in range(len(discrete_branches))
    ]

    lp_flat, ent_flat, val_flat = policy.evaluate_actions(
        all_obs, all_cont, all_disc)

    lp_t = torch.stack([c.mean() for c in torch.split(lp_flat, stored_n)])
    ent_t = torch.stack([c.mean() for c in torch.split(ent_flat, stored_n)])
    val_t = torch.stack([c.mean() for c in torch.split(val_flat, stored_n)])

    ret_t = torch.from_numpy(
        discounted_returns(buf_rew, GAMMA)).to(device)
    adv = ret_t - val_t.detach()

    # [FIX 2] Нормализация advantage
    if adv.shape[0] > 1:
        adv = (adv - adv.mean()) / (adv.std() + 1e-8)

    p_loss = -(lp_t * adv).mean()
    v_loss = nn.functional.mse_loss(val_t, ret_t.detach())  # [FIX 3]
    e_bon = ent_t.mean()
    loss = p_loss + VALUE_COEFF * v_loss - ENTROPY_COEFF * e_bon

    optimizer.zero_grad()
    loss.backward()
    nn.utils.clip_grad_norm_(policy.parameters(), CLIP_GRAD)
    optimizer.step()

    reward_buf.append(ep_reward)
    avg100 = float(np.mean(reward_buf))

    # [FIX 6] Checkpoint guard ep>=20
    if avg100 > best_avg and ep >= 20:
        best_avg = avg100
        torch.save({
            'episode': ep,
            'model_state_dict': policy.state_dict(),
            'optimizer_state_dict': optimizer.state_dict(),
            'avg_reward': avg100,
        }, 'best_model_checkpoint.pth')

# ═══════════════════════════════════════════════════════
# §6 · Экспорт ONNX для Unity
# ═══════════════════════════════════════════════════════
class UnityONNXWrapper(nn.Module):
    """Обёртка: добавляет version_number и memory_size для Unity."""
    def __init__(self, net, grid_c=None, grid_h=None, grid_w=None):
        super().__init__()
        self.net = net
        self.grid_c = grid_c
        self.grid_h = grid_h
        self.grid_w = grid_w
        self.register_buffer('version_number', torch.tensor([3.0]))
        self.register_buffer('memory_size', torch.tensor([0.0]))

    def forward(self, obs_0, action_masks=None):
        if obs_0.dim() == 4:
            obs_flat = obs_0.reshape(obs_0.shape[0], -1)
        else:
            obs_flat = obs_0.reshape(obs_0.shape[0], -1)

        c_mean, _, d_logits, _ = self.net(obs_flat)
        cont_out = torch.tanh(c_mean)
        disc_parts = [
            logits.argmax(-1, keepdim=True) for logits in d_logits
        ]
        disc_out = torch.cat(disc_parts, -1).long()
        return (cont_out, disc_out,
                self.version_number, self.memory_size)

# Экспорт
policy.eval()
GRID_H, GRID_W, GRID_C = 40, 40, 5
wrapper = UnityONNXWrapper(
    policy, grid_c=GRID_C, grid_h=GRID_H, grid_w=GRID_W
).to(device).eval()

onnx_path = 'FoodCollector_REINFORCE.onnx'
dummy_obs = torch.randn(1, GRID_C, GRID_H, GRID_W, device=device)
dummy_mask = torch.ones(1, sum(discrete_branches), device=device)

with torch.no_grad():
    torch.onnx.export(
        wrapper, (dummy_obs, dummy_mask), onnx_path,
        export_params=True,
        opset_version=15,
        input_names=['obs_0', 'action_masks'],
        output_names=[
            'continuous_actions', 'discrete_actions',
            'continuous_action_output_shape',
            'discrete_action_output_shape',
            'version_number', 'memory_size',
        ],
        dynamic_axes={
            'obs_0': {0: 'batch'},
            'action_masks': {0: 'batch'},
            'continuous_actions': {0: 'batch'},
            'discrete_actions': {0: 'batch'},
        },
    )

# Добавление metadata_props
import onnx, json
model_onnx = onnx.load(onnx_path)
metadata = {
    'version_number': '0.3.0',
    'memory_size': '0',
    'is_continuous_control': '1',
    'action_output_shape': str(policy.continuous_size),
}
for key, value in metadata.items():
    model_onnx.metadata_props.append(
        onnx.StringStringEntryProto(key=key, value=value))
onnx.save(model_onnx, onnx_path)

# Валидация
import onnxruntime as ort
onnx.checker.check_model(model_onnx)
session = ort.InferenceSession(onnx_path)
# [FIX 8] Форма входа: grid [1, C, H, W], не flat
test_obs = np.random.randn(1, GRID_C, GRID_H, GRID_W).astype(np.float32)
test_mask = np.ones((1, sum(discrete_branches)), dtype=np.float32)
ort_outputs = session.run(None, {
    'obs_0': test_obs, 'action_masks': test_mask
})

# ═══════════════════════════════════════════════════════
# §7 · Cleanup
# ═══════════════════════════════════════════════════════
writer.close()
env.close()
# Готово! Скопируйте .onnx в Assets/ML-Agents/ Unity-проекта`;

const FullCodeDisplay = () => {
  return <CyberCodeBlock language="python" filename="FoodCollector_REINFORCE_v3.py">{fullNotebookCode}</CyberCodeBlock>;
};

export default DemoProject;
