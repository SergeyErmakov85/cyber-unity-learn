import { lazy, Suspense, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { Skeleton } from "@/components/ui/skeleton";
import ReturnToLessonChip from "@/components/math-rl/ReturnToLessonChip";

const Part1 = lazy(() => import("@/components/math-rl/parts/Part1Limits"));
const Part1b = lazy(() => import("@/components/math-rl/parts/Part1bCalculus"));
const Part2 = lazy(() => import("@/components/math-rl/parts/Part2LinearAlgebra"));
const Part3 = lazy(() => import("@/components/math-rl/parts/Part3Probability"));
const Part4 = lazy(() => import("@/components/math-rl/parts/Part4Optimization"));
const Part5 = lazy(() => import("@/components/math-rl/parts/Part5FundamentalRL"));
const Part6 = lazy(() => import("@/components/math-rl/parts/Part6DeepRL"));
const GDPlayground = lazy(() => import("@/components/math-rl/GradientDescentPlayground"));

const parts = [
  { id: "part-1", num: "I", title: "Пределы, последовательности и ряды", color: "primary" as const },
  { id: "part-1b", num: "II", title: "Производные, градиент и оптимизация", color: "secondary" as const },
  { id: "part-2", num: "III", title: "Линейная алгебра для RL", color: "accent" as const },
  { id: "part-3", num: "IV", title: "От вероятности к алгоритмам RL", color: "primary" as const },
  { id: "part-4", num: "V", title: "Методы оптимизации политик", color: "secondary" as const },
  { id: "part-5", num: "VI", title: "Фундаментальная математика RL", color: "accent" as const },
  { id: "part-6", num: "VII", title: "Глубокое обучение с подкреплением", color: "primary" as const },
];

const partSubtopics: Record<string, string[]> = {
  "part-1": [
    "Введение",
    "1. Теоретические основы: предел последовательности",
    "  1.1 Предел последовательности",
    "2. Бесконечные ряды и их сходимость",
    "  Геометрический ряд",
    "  Необходимое условие сходимости",
    "  Абсолютная сходимость",
    "3. Пределы и ряды в контексте обучения с подкреплением",
    "4. Уравнения Беллмана и дисконтирование",
    "  Функция ценности состояния",
    "  Уравнение оптимальности Беллмана",
    "  Пример: MDP с двумя состояниями",
    "5. Итерация ценности: сходимость на практике",
    "6. Дисконтирование в RL и его влияние",
    "7. Примеры, аналогии и задачи",
    "  7.1 Предел последовательности: рекурсия",
    "  7.2 Сумма геометрического ряда",
    "  7.3 Дисконтированные награды в RL",
    "  7.4 Конвергенция Q-обучения",
    "8. Интерактивные визуализации сходимости",
    "  8.1 Сходимость геометрического ряда",
    "  8.2 Визуализация итерации ценности",
    "8b. Практические задачи: пределы и сходимость",
    "9. Источники",
    "Мини-глоссарий",
  ],
  "part-1b": [
    "§ 1. Производные и дифференцирование",
    "  Определение производной",
    "  Три интуиции",
    "  Таблица основных производных",
    "  Правила дифференцирования",
    "§ 2. Частные производные и градиент",
    "  Функции многих переменных",
    "  Частная производная",
    "  Градиент",
    "§ 3. Градиентный спуск и оптимизация",
    "  Варианты градиентного спуска",
    "  Проблемы и решения",
    "§ 4. Применение в RL: Policy Gradient",
    "  Задача оптимизации политики",
    "  Теорема о градиенте политики",
    "  TD-ошибка как стохастический градиент",
    "§ 5. Весь раздел в одной картине",
  ],
  "part-2": [
    "1. Векторы",
    "  1.4. Линейная комбинация векторов",
    "  1.5. Линейная зависимость и независимость",
    "  1.6. Базис и размерность",
    "2. Матрицы",
    "  2.1. Определение и типы матриц",
    "  2.2. Операции над матрицами",
    "  2.3. Определитель матрицы",
    "  2.4. Ранг матрицы",
    "  2.5. Обратная матрица",
    "3. Скалярное произведение",
    "4. Собственные значения и собственные векторы",
    "  Спектральное разложение",
    "  Связь с собственными значениями",
    "5. Сингулярное разложение (SVD)",
    "  Теорема Эккарта-Янга",
    "6. Дополнительные темы",
    "  6.1. Квадратичные формы",
    "  6.2. Ортогональная проекция",
    "  6.3. Изменение базиса",
    "  6.4. Разложения LU и QR",
  ],
  "part-3": [
    "1. Теория вероятностей",
    "  Основные понятия",
    "  Случайные величины и распределения",
    "  Ожидаемое значение и дисперсия",
    "  Условная вероятность и правило Байеса",
    "2. Статистика",
    "  Описательная статистика",
    "  Оценка параметров",
    "  Проверка гипотез",
    "3. Марковские процессы",
    "  Цепи Маркова",
    "  MDP — Марковский процесс принятия решений",
    "4. Функции ценности и уравнения Беллмана",
    "  Функция ценности состояния",
    "  Функция ценности действия",
    "  Уравнения Беллмана",
    "  Уравнения оптимальности Беллмана",
    "5. Алгоритмы RL",
    "  Методы, основанные на ценности",
    "  Методы, основанные на политике",
    "  Методы, основанные на модели",
    "6. Практические примеры (Python)",
    "  Пример 1: Симуляция бросков монеты",
    "  Пример 2: Анализ вознаграждений",
    "  Пример 3: Оценка политики в MDP",
    "  Упражнения для самопроверки",
  ],
  "part-4": [
    "Лекция 1. Основы RL и оптимизация политики",
    "  Целевая функция политики",
    "Лекция 2. Вывод градиента политики",
    "  Шаг 1: Дифференцирование под знаком интеграла",
    "  Шаг 2: Трюк с логарифмом",
    "  Шаг 3: Упрощение",
    "  Шаг 4: Формула REINFORCE",
    "  Шаг 5: Reward-to-go",
    "  Шаг 6: Базис и Advantage",
    "Лекция 3. Градиентный спуск и его варианты",
    "  1. Momentum",
    "  2. RMSProp",
    "  3. Adam (Adaptive Moment Estimation)",
    "Лекция 4. Proximal Policy Optimization (PPO)",
    "  Клиповый суррогат-объектив",
    "  Гиперпараметры PPO",
  ],
  "part-5": [
    "Введение: От интуитивного кодирования к математическому осознанию",
    "Глава 1. Теоретико-вероятностный фундамент",
    "  Случайная величина (Random Variable)",
    "  Математическое ожидание (Expected Value)",
    "Глава 2. Многорукие бандиты: Исследование vs Использование",
    "  Дилемма Exploration vs Exploitation",
    "  Ценность действия (Action-Value)",
    "  ε-жадная стратегия",
    "  Верхняя доверительная граница (UCB)",
    "Глава 3. Марковские процессы принятия решений (MDP)",
    "  Марковское свойство",
    "Глава 4. Возврат, политики и функции ценности",
    "  Возврат (Return)",
    "  Политика (Policy)",
    "  Функции ценности (Value Functions)",
    "Глава 5. Сердце RL: Уравнения Беллмана",
    "  Рекурсивное разложение возврата",
    "  Уравнение ожиданий Беллмана",
    "  Уравнение оптимальности Беллмана",
    "Глава 6. От динамического программирования к Model-Free RL",
    "  Монте-Карло vs Temporal Difference",
    "  TD-обучение: величайший прорыв",
    "  SARSA vs Q-learning",
    "Глава 7. Следы пригодности (Eligibility Traces)",
    "  Механизм кратковременной памяти",
    "  Backward View: мгновенное распространение",
    "Глава 8. Аппроксимация функций и Deep RL",
    "  Нейросети как аппроксиматоры",
    "  DQN: Deep Q-Network",
    "Глава 9. Методы градиента политики (Policy Gradients)",
    "  Параметризация политики",
    "  Теорема о градиенте политики",
    "  Логарифмический трюк (Log-derivative trick)",
    "  Алгоритм REINFORCE",
    "  Архитектура Актор-Критик (Actor-Critic)",
    "Глава 10. Мост к практике: Unity ML-Agents",
    "  Связь MDP → Unity Event-функции",
    "  Гиперпараметры .yaml и их математический смысл",
    "Заключение",
    "Мини-глоссарий",
  ],
  "part-6": [
    "1.1 Основные понятия",
    "  Ключевые компоненты",
    "  Особенности Deep RL",
    "1.2 Обзор алгоритмов RL",
    "  Deep Q-Network (DQN)",
    "  Улучшения DQN",
    "  Современные алгоритмы",
    "2.1 Математический анализ",
    "  Производные и правила дифференцирования",
    "  Частные производные и градиент",
    "  Экстремумы функций",
    "2.2 Теория вероятностей и статистика",
    "  Нормальное распределение",
    "  Оценка максимального правдоподобия (MLE)",
    "  Оценка MAP",
    "2.3 Дифференциальные уравнения",
    "  ОДУ с разделяющимися переменными",
    "  ОДУ второго порядка",
  ],
};

const colorClasses = {
  primary: { border: "border-primary/40", text: "text-primary", bg: "bg-primary/5" },
  secondary: { border: "border-secondary/40", text: "text-secondary", bg: "bg-secondary/5" },
  accent: { border: "border-accent/40", text: "text-accent", bg: "bg-accent/5" },
};

const PartSkeleton = () => (
  <div className="space-y-4 py-8">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-32 w-full" />
  </div>
);
export const slugify = (text: string) =>
  text.toLowerCase().replace(/[^\wа-яё]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60);

const PartComponents = [Part1, Part1b, Part2, Part3, Part4, Part5, Part6];

const CollapsibleParts = ({ openParts, toggle }: { openParts: Set<string>; toggle: (id: string) => void }) => (
  <>
    {parts.map((part, i) => {
      const c = colorClasses[part.color];
      const isOpen = openParts.has(part.id);
      const PartComponent = PartComponents[i];
      return (
        <div key={part.id} id={part.id} className="scroll-mt-24">
          <button
            onClick={() => toggle(part.id)}
            className={`w-full text-left ${i === 0 ? "mt-0" : "mt-6"} p-6 rounded-xl border ${c.border} ${c.bg} transition-all duration-200 hover:brightness-110 cursor-pointer group`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-xs font-bold ${c.text} uppercase tracking-wider`}>Часть {part.num}</span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-1">{part.title}</h2>
              </div>
              <ChevronDown className={`w-6 h-6 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </div>
          </button>

          {isOpen && (
            <div className="mt-8 mb-4">
              <Suspense fallback={<PartSkeleton />}>
                <PartComponent />
              </Suspense>
              {part.id === "part-1b" && (
                <Suspense fallback={<PartSkeleton />}>
                  <GDPlayground />
                </Suspense>
              )}
            </div>
          )}
        </div>
      );
    })}
  </>
);
const SidebarTOC = ({ openParts, ensureOpen }: { openParts: Set<string>; ensureOpen: (partId: string) => void }) => {
  const [expandedPart, setExpandedPart] = useState<string | null>(null);
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  const toggle = (id: string) => {
    setExpandedPart((prev) => (prev === id ? null : id));
    setExpandedChapter(null);
  };

  const toggleChapter = (label: string) => {
    setExpandedChapter((prev) => (prev === label ? null : label));
  };

  const scrollToSubtopic = (partId: string, topicLabel: string) => {
    ensureOpen(partId);
    const targetId = slugify(topicLabel);
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const groupSubtopics = (subtopics: string[]) => {
    const groups: { label: string; children: string[] }[] = [];
    for (const topic of subtopics) {
      if (topic.startsWith("  ")) {
        if (groups.length > 0) {
          groups[groups.length - 1].children.push(topic.trim());
        }
      } else {
        groups.push({ label: topic, children: [] });
      }
    }
    return groups;
  };

  return (
    <>
      {parts.map((part) => {
        const c = colorClasses[part.color];
        const subtopics = partSubtopics[part.id] || [];
        const isExpanded = expandedPart === part.id;
        const isPart5 = part.id === "part-5";
        return (
          <div key={part.id}>
            <button
              onClick={() => toggle(part.id)}
              className={`flex items-center justify-between w-full text-left text-xs py-2 px-3 rounded text-muted-foreground hover:text-foreground hover:${c.bg} transition-colors`}
            >
              <span>
                <span className={`font-bold ${c.text} mr-1.5`}>{part.num}.</span>
                {part.title}
              </span>
              <ChevronDown className={`w-3 h-3 flex-shrink-0 opacity-50 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
            </button>

            {isExpanded && (
              <div className="animate-fade-in ml-1 my-1 rounded-lg border border-primary/20 bg-[hsl(var(--cyber-darker))] overflow-hidden">
                <div className={`h-[2px] w-full bg-gradient-to-r ${
                  part.color === "primary" ? "from-primary/80 via-primary/40 to-transparent"
                    : part.color === "secondary" ? "from-secondary/80 via-secondary/40 to-transparent"
                    : "from-accent/80 via-accent/40 to-transparent"
                }`} />

                <div className="p-2.5 space-y-0.5">
                  <button
                    onClick={() => { ensureOpen(part.id); document.getElementById(part.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                    className={`w-full text-left text-[11px] font-semibold ${c.text} hover:underline px-2 py-1 mb-1`}
                  >
                    ▸ Перейти к части {part.num}
                  </button>

                  {isPart5 ? (
                    groupSubtopics(subtopics).map((group) => (
                      <div key={group.label}>
                        <button
                          onClick={() => {
                            if (group.children.length > 0) {
                              toggleChapter(group.label);
                            } else {
                              scrollToSubtopic(part.id, group.label);
                            }
                          }}
                          className="flex items-center justify-between w-full text-left text-[11px] py-1 px-2 rounded font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                          <span>
                            <span className={`${c.text} mr-1 opacity-60`}>›</span>
                            {group.label}
                          </span>
                          {group.children.length > 0 && (
                            <ChevronDown className={`w-2.5 h-2.5 opacity-40 transition-transform duration-200 ${expandedChapter === group.label ? "rotate-180" : ""}`} />
                          )}
                        </button>

                        {expandedChapter === group.label && group.children.length > 0 && (
                          <div className="animate-fade-in ml-3 my-0.5 pl-2 border-l border-accent/20 space-y-0.5">
                            <button
                              onClick={() => scrollToSubtopic(part.id, group.label)}
                              className={`block w-full text-left text-[10px] py-0.5 px-2 rounded ${c.text} opacity-70 hover:opacity-100 hover:bg-primary/10 transition-colors cursor-pointer`}
                            >
                              ▸ К началу главы
                            </button>
                            {group.children.map((child, ci) => (
                              <button
                                key={ci}
                                onClick={() => scrollToSubtopic(part.id, child)}
                                className="block w-full text-left text-[10px] py-0.5 px-2 rounded text-muted-foreground/70 hover:text-foreground hover:bg-primary/10 transition-colors cursor-pointer"
                              >
                                {child}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    subtopics.map((topic, i) => {
                      const isIndented = topic.startsWith("  ");
                      const label = topic.trim();
                      return (
                        <button
                          key={i}
                          onClick={() => scrollToSubtopic(part.id, label)}
                          className={`block w-full text-left text-[11px] py-0.5 px-2 rounded transition-colors cursor-pointer hover:bg-primary/10 ${
                            isIndented
                              ? "pl-5 text-muted-foreground/70 border-l border-primary/10 ml-2"
                              : "font-medium text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {!isIndented && <span className={`${c.text} mr-1 opacity-60`}>›</span>}
                          {label}
                        </button>
                      );
                    })
                  )}
                </div>

                <div className={`h-[1px] w-full bg-gradient-to-r ${
                  part.color === "primary" ? "from-transparent via-primary/30 to-transparent"
                    : part.color === "secondary" ? "from-transparent via-secondary/30 to-transparent"
                    : "from-transparent via-accent/30 to-transparent"
                }`} />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

const moduleToPartMap: Record<string, string> = {
  "/math-rl/module-1": "part-1",
  "/math-rl/module-2": "part-2",
  "/math-rl/module-3": "part-3",
  "/math-rl/module-4": "part-4",
  "/math-rl/module-5": "part-5",
  "/math-rl/module-6": "part-6",
};

const MathRL = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openParts, setOpenParts] = useState<Set<string>>(new Set());

  // Auto-open the correct accordion part based on URL and scroll to hash anchor.
  // Uses polling (requestAnimationFrame) so lazy-loaded Part chunks and
  // async-rendered Chapter components scroll correctly once mounted.
  useEffect(() => {
    const partId = moduleToPartMap[location.pathname];
    if (!partId) return;

    setOpenParts((prev) => {
      if (prev.has(partId)) return prev;
      const next = new Set(prev);
      next.add(partId);
      return next;
    });

    const hash = location.hash.replace("#", "");
    const targetId = hash || partId;

    const deadline = Date.now() + 3000;
    let cancelled = false;
    const tryScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.classList.add("highlight-flash");
        setTimeout(() => el.classList.remove("highlight-flash"), 1500);
        return;
      }
      if (Date.now() < deadline) {
        window.requestAnimationFrame(() => setTimeout(tryScroll, 80));
      }
    };
    tryScroll();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.hash]);

  const togglePart = (id: string) => {
    setOpenParts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const ensureOpen = (id: string) => {
    setOpenParts((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollProgressBar />

      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground mb-4 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" /> На главную
          </Button>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-neon bg-clip-text text-transparent">
              Математика и глубокого обучения с подкреплением
            </span>
          </h1>
          <p className="text-muted-foreground max-w-3xl text-lg">
            Единый учебный модуль: от пределов и производных до PPO и глубокого обучения с подкреплением. Семь частей с задачами, Python-кодом и интерактивными демо.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl flex gap-8">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <nav className="sticky top-24 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Содержание</p>
            <SidebarTOC openParts={openParts} ensureOpen={ensureOpen} />

            <div className="border-t border-border/30 mt-4 pt-4">
              <button
                onClick={() => navigate("/hub/fca-rl")}
                className="block w-full text-left text-xs py-2 px-3 rounded text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors"
              >
                <span className="font-bold text-primary mr-1.5">+</span>
                FCA + RL для NPC
              </button>
            </div>
          </nav>
        </aside>

        {/* Content */}
        <article className="flex-1 max-w-4xl">
          <CollapsibleParts openParts={openParts} toggle={togglePart} />

          {/* Literature */}
          <section className="mt-20 p-6 rounded-lg bg-card/40 border border-border/30">
            <h3 className="text-lg font-semibold text-foreground mb-3">📚 Литература</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Sutton, R. S., & Barto, A. G. (2018). <em>Reinforcement Learning: An Introduction.</em> MIT Press.</li>
              <li>Mnih, V., et al. (2015). Human-level control through deep RL. <em>Nature</em>, 518, 529–533.</li>
              <li>Schulman, J., et al. (2017). Proximal Policy Optimization Algorithms. <em>arXiv:1707.06347</em>.</li>
              <li>Goodfellow, I., et al. (2016). <em>Deep Learning.</em> MIT Press.</li>
              <li>Bertsekas, D. P. (2017). <em>Dynamic Programming and Optimal Control.</em> Athena Scientific.</li>
            </ol>
          </section>

          {/* Footer Navigation */}
          <div className="mt-16 flex flex-wrap justify-center gap-4">
            <Button variant="outline" onClick={() => navigate("/")} className="border-primary/50 text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" /> На главную
            </Button>
            <Button variant="outline" onClick={() => navigate("/courses")} className="border-secondary/50 text-secondary">
              Перейти к курсам
            </Button>
            <Button variant="outline" onClick={() => navigate("/hub/fca-rl")} className="border-accent/50 text-accent">
              FCA + RL для NPC →
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
};

export default MathRL;
