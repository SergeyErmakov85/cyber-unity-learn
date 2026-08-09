import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ChevronRight, CheckCircle2 } from "lucide-react";
import ProGate from "@/components/ProGate";
import LessonHeader from "@/components/LessonHeader";
import SectionNav, { SectionNavItem } from "@/components/SectionNav";
import LessonSidebarTOC from "@/components/LessonSidebarTOC";
import NextPrevLesson from "@/components/NextPrevLesson";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import SEOHead from "@/components/SEOHead";
import Quiz from "@/components/Quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLessonById } from "@/data/lessons";
import { markLessonComplete, isLessonComplete } from "@/lib/gamification";

import IntroSection from "@/components/lesson-3-7/IntroSection";
import Section0 from "@/components/lesson-3-7/Section0";
import Section1 from "@/components/lesson-3-7/Section1";
import Section2 from "@/components/lesson-3-7/Section2";
import Section3 from "@/components/lesson-3-7/Section3";
import Section4 from "@/components/lesson-3-7/Section4";
import Section5 from "@/components/lesson-3-7/Section5";
import Section6 from "@/components/lesson-3-7/Section6";
import Section7 from "@/components/lesson-3-7/Section7";
import Section8 from "@/components/lesson-3-7/Section8";
import Section9 from "@/components/lesson-3-7/Section9";
import Section10 from "@/components/lesson-3-7/Section10";
import Summary from "@/components/lesson-3-7/Summary";
import RelatedMaterials from "@/components/lesson-3-7/RelatedMaterials";
import LessonTextbookLinks from "@/components/LessonTextbookLinks";

const SECTIONS: SectionNavItem[] = [
  { id: "intro", label: "Введение" },
  { id: "razdel-0-most", label: "0 · От алгоритма к архитектуре" },
  { id: "razdel-1-encoder-head", label: "1 · Энкодер и голова" },
  { id: "razdel-2-mlp", label: "2 · MLP для векторов" },
  { id: "razdel-3-cnn", label: "3 · CNN для пикселей" },
  { id: "razdel-4-memory", label: "4 · Память: POMDP и LSTM" },
  { id: "razdel-5-attention", label: "5 · Внимание (переменная длина)" },
  { id: "razdel-6-shared-vs-separate", label: "6 · Общий или раздельный backbone" },
  { id: "razdel-7-tuning", label: "7 · Настройка архитектуры" },
  { id: "razdel-8-unity-yaml", label: "8 · Unity: network_settings" },
  { id: "razdel-9-decision-transformer", label: "9 · Decision Transformer" },
  { id: "razdel-10-svyaz", label: "10 · Связь с уроками и проектом" },
  { id: "itogi", label: "Итоги" },
  { id: "источники", label: "Источники" },
];

const MAPPED_SECTIONS: Array<{ id: string; Comp: () => JSX.Element }> = [
  { id: "intro", Comp: IntroSection },
  { id: "razdel-0-most", Comp: Section0 },
  { id: "razdel-1-encoder-head", Comp: Section1 },
  { id: "razdel-2-mlp", Comp: Section2 },
  { id: "razdel-3-cnn", Comp: Section3 },
  { id: "razdel-4-memory", Comp: Section4 },
  { id: "razdel-5-attention", Comp: Section5 },
  { id: "razdel-6-shared-vs-separate", Comp: Section6 },
  { id: "razdel-7-tuning", Comp: Section7 },
  { id: "razdel-8-unity-yaml", Comp: Section8 },
  { id: "razdel-9-decision-transformer", Comp: Section9 },
  { id: "razdel-10-svyaz", Comp: Section10 },
  { id: "itogi", Comp: Summary },
];

const SECTION_CLASS =
  "scroll-mt-24 py-12 md:py-16 px-5 md:px-10 bg-card/60 backdrop-blur-sm rounded-2xl border border-cyan-500/10";

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const QUIZ_QUESTIONS = [
  {
    question: "На что в первую очередь раскладывается любая сеть RL-агента?",
    options: [
      "Actor и critic",
      "Энкодер f_φ (наблюдение → эмбеддинг z) и голова h_ψ (z → действие/оценка)",
      "Свёртки и LSTM",
      "Replay buffer и policy",
    ],
    correctIndex: 1,
    explanation:
      "Энкодер несёт всю специфику модальности наблюдения, голова и алгоритм обучения универсальны над z.",
  },
  {
    question: "Какой энкодер выбрать для агента, который видит переменное число соперников?",
    options: [
      "MLP с паддингом до максимума",
      "CNN — она же работает с любыми входами",
      "Энкодер на self-attention — инвариантен к числу и порядку сущностей",
      "LSTM с большим memory_size",
    ],
    correctIndex: 2,
    explanation:
      "Внимание сжимает множество эмбеддингов сущностей в один вектор z независимо от K и порядка — это тот же механизм, что в MA-POCA.",
  },
  {
    question: "Что верно про блок memory в ML-Agents 4.0.x?",
    options: [
      "memory_size может быть любым целым",
      "memory_size должно делиться на 2; LSTM плохо работает с непрерывными действиями — при включении уменьшайте num_layers",
      "memory заменяет network_settings.hidden_units",
      "memory автоматически отключает normalize",
    ],
    correctIndex: 1,
    explanation:
      "Документация требует кратность 2 для memory_size и предупреждает о конфликте LSTM с непрерывным управлением.",
  },
  {
    question: "Когда стоит включить shared_critic: true?",
    options: [
      "Всегда — экономит параметры",
      "Для дешёвых векторных энкодеров",
      "При обучении с изображений (CNN-энкодер дорогой), чтобы один backbone кодировал o → z для актора и критика",
      "Только в SAC, не в PPO",
    ],
    correctIndex: 2,
    explanation:
      "Документация ML-Agents прямо советует включать shared_critic при пиксельных наблюдениях — два независимых CNN были бы вдвое дороже.",
  },
  {
    question: "В чём ключевая идея Decision Transformer?",
    options: [
      "Заменить PPO более быстрым TPU-friendly алгоритмом",
      "Подавать траекторию как последовательность токенов (R̂_t, s_t, a_t) и предсказывать действия авторегрессионно по causal-attention; политика задаётся целевым возвратом R^target",
      "Обучать энкодер contrastive-лоссом",
      "Использовать LSTM вместо attention",
    ],
    correctIndex: 1,
    explanation:
      "DT превращает RL в supervised sequence modeling: задаёте желаемый возврат — модель генерирует ведущие к нему действия. Силён в offline RL.",
  },
];

const CompleteButton = () => {
  const [done, setDone] = useState<boolean>(() => isLessonComplete("3.7"));

  useEffect(() => {
    if (done) return;
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - window.innerHeight)) * 100;
      if (pct >= 90) {
        markLessonComplete("3.7");
        setDone(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [done]);

  return (
    <Button
      onClick={() => {
        markLessonComplete("3.7");
        setDone(true);
      }}
      disabled={done}
      size="lg"
      className="w-full md:w-auto bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-semibold shadow-[0_0_24px_hsl(var(--primary)/0.45)] hover:shadow-[0_0_32px_hsl(280_85%_65%/0.55)] hover:scale-[1.02] transition-all disabled:opacity-80 disabled:cursor-default focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      aria-label={done ? "Урок пройден" : "Отметить урок как пройденный"}
    >
      {done ? (
        <>
          <CheckCircle2 className="w-5 h-5 mr-2" aria-hidden="true" />
          Пройдено
        </>
      ) : (
        <>Отметить урок как пройденный ✓</>
      )}
    </Button>
  );
};

const CourseLesson3_7 = () => {
  const lesson = getLessonById("3.7")!;

  const content = (
    <>
      <nav aria-label="Хлебные крошки" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-cyan-400 inline-flex items-center gap-1">
              <Home className="w-3.5 h-3.5" aria-hidden="true" /> Главная
            </Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
          <li>
            <Link to="/courses" className="hover:text-cyan-400">
              Курс
            </Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
          <li>
            <Link to="/courses#level-3" className="hover:text-cyan-400">
              Уровень 3
            </Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
          <li className="text-foreground" aria-current="page">
            Урок 3.7
          </li>
        </ol>
      </nav>

      <LessonHeader
        title={lesson.title}
        subtitle={lesson.subtitle}
        isPro={lesson.isPro}
        estimatedMinutes={lesson.estimatedMinutes}
      />

      <div className="xl:hidden">
        <SectionNav items={SECTIONS} />
      </div>
      <LessonSidebarTOC items={SECTIONS} color="pink" />

      <div id="lesson-content" className="space-y-8 mt-8">
        {MAPPED_SECTIONS.map(({ id, Comp }, i) => (
          <motion.section
            key={id}
            id={id === "intro" ? "intro" : undefined}
            className={SECTION_CLASS}
            variants={SECTION_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: Math.min(i * 0.05, 0.25) }}
          >
            <Comp />
          </motion.section>
        ))}
      </div>

      <Quiz
        title="Проверь себя: архитектуры нейросетей для RL"
        questions={QUIZ_QUESTIONS}
        lessonPath="/courses/3-7"
      />

      <LessonTextbookLinks lessonId="3-7" lessonLabel="Урок 3.7. Архитектуры нейросетей" />

      <RelatedMaterials />

      <Card className="mt-8 border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 backdrop-blur-sm">
        <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Дочитали до конца? Зафиксируйте прогресс и получите XP.
          </p>
          <CompleteButton />
        </CardContent>
      </Card>

      <NextPrevLesson prev={lesson.prev} next={lesson.next} />
    </>
  );

  return (
    <>
      <SEOHead
        title="Урок 3.7. Архитектуры нейросетей для RL-агентов | CyberUnityCode"
        description="Разбор архитектуры RL-агента как энкодер + голова: MLP для векторов, CNN (simple/nature_cnn/resnet) для пикселей, LSTM и кадровый стек для POMDP, self-attention для множеств сущностей. Shared vs separate backbone, полный network_settings ML-Agents 4.0.x, Decision Transformer. PRO-урок."
        path="/courses/3-7"
        type="article"
        keywords="архитектура RL, энкодер, голова, MLP, CNN, nature_cnn, IMPALA ResNet, LSTM, POMDP, self-attention, shared_critic, network_settings, ML-Agents, Decision Transformer"
      />
      <a
        href="#lesson-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-md focus:bg-card focus:text-cyan-300 focus:border focus:border-cyan-400 focus:shadow-[0_0_16px_hsl(var(--primary)/0.6)]"
      >
        К содержимому урока
      </a>
      <ScrollProgressBar color="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <ProGate preview={content}>{content}</ProGate>
      </main>
    </>
  );
};

export default CourseLesson3_7;
