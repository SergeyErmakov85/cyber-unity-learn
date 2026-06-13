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

import IntroSection from "@/components/lesson-3-5/IntroSection";
import Section0 from "@/components/lesson-3-5/Section0";
import Section1 from "@/components/lesson-3-5/Section1";
import Section2 from "@/components/lesson-3-5/Section2";
import Section3 from "@/components/lesson-3-5/Section3";
import Section4 from "@/components/lesson-3-5/Section4";
import Section5 from "@/components/lesson-3-5/Section5";
import Section6 from "@/components/lesson-3-5/Section6";
import Section7 from "@/components/lesson-3-5/Section7";
import Section8 from "@/components/lesson-3-5/Section8";
import Section9 from "@/components/lesson-3-5/Section9";
import Summary from "@/components/lesson-3-5/Summary";
import RelatedMaterials from "@/components/lesson-3-5/RelatedMaterials";

const SECTIONS: SectionNavItem[] = [
  { id: "intro", label: "Введение" },
  { id: "razdel-0-most", label: "0 · Мост и мотивация" },
  { id: "razdel-1-onnx", label: "1 · ONNX" },
  { id: "razdel-2-checkpoints", label: "2 · Чекпойнты" },
  { id: "razdel-3-inference-engine", label: "3 · Инференс-движок" },
  { id: "razdel-4-embedding", label: "4 · Встраивание" },
  { id: "razdel-5-behavior-decisions", label: "5 · Режимы и решения" },
  { id: "razdel-6-performance", label: "6 · Производительность" },
  { id: "razdel-7-build", label: "7 · Сборка билда" },
  { id: "razdel-8-diagnostics", label: "8 · Диагностика" },
  { id: "razdel-9-checklist", label: "9 · Чеклист" },
  { id: "itogi", label: "Итоги" },
  { id: "istochniki", label: "Источники" },
];

const MAPPED_SECTIONS: Array<{ id: string; Comp: () => JSX.Element }> = [
  { id: "intro", Comp: IntroSection },
  { id: "razdel-0-most", Comp: Section0 },
  { id: "razdel-1-onnx", Comp: Section1 },
  { id: "razdel-2-checkpoints", Comp: Section2 },
  { id: "razdel-3-inference-engine", Comp: Section3 },
  { id: "razdel-4-embedding", Comp: Section4 },
  { id: "razdel-5-behavior-decisions", Comp: Section5 },
  { id: "razdel-6-performance", Comp: Section6 },
  { id: "razdel-7-build", Comp: Section7 },
  { id: "razdel-8-diagnostics", Comp: Section8 },
  { id: "razdel-9-checklist", Comp: Section9 },
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
    question: "В каком формате обученная политика ML-Agents едет из Python в Unity-сборку?",
    options: [
      ".pt — PyTorch-чекпойнт",
      ".onnx — открытый граф для инференса",
      ".h5 — Keras",
      ".pb — TensorFlow SavedModel",
    ],
    correctIndex: 1,
    explanation:
      "ONNX — нейтральный кроссплатформенный формат: веса + структура для прямого прохода, без состояния оптимизатора. .pt остаётся в Python и нужен только для --resume / дообучения.",
  },
  {
    question: "Где лежит финальная модель после успешного mlagents-learn --run-id=race_v7?",
    options: [
      "results/race_v7/RaceAgent.onnx",
      "Assets/Models/RaceAgent.pt",
      "checkpoints/last.onnx",
      "Unity её собирает на лету",
    ],
    correctIndex: 0,
    explanation:
      "Финал — results/<run-id>/<behavior_name>.onnx; имя берётся из Behavior Name агента. Пишется при штатном завершении или одном Ctrl+C — дождитесь записи на диск.",
  },
  {
    question: "Какой Behavior Type выбирать для билда, который уедет к игроку?",
    options: [
      "Default — пусть Unity сам решает",
      "Heuristic Only — на всякий случай",
      "Inference Only — решения всегда по модели",
      "Любой, без разницы",
    ],
    correctIndex: 2,
    explanation:
      "Inference Only гарантирует, что агент думает по встроенной .onnx-модели, даже если что-то случайно подключится по сокету. Default может молча провалиться в эвристику без модели.",
  },
  {
    question: "Почему для типовой ML-Agents-сети CPU обычно быстрее GPU?",
    options: [
      "GPU не поддерживает ONNX",
      "Сети маленькие; накладные расходы на передачу данных на GPU больше самого вычисления",
      "Unity не умеет считать на GPU",
      "GPU всегда медленнее CPU",
    ],
    correctIndex: 1,
    explanation:
      "Политики ML-Agents — пара Dense-слоёв на сотню входов. Прогнать их на CPU — микросекунды; копирование на GPU и синхронизация на такой нагрузке доминируют. GPU выигрывает только под ResNet-зрение или массу визуальных агентов.",
  },
  {
    question: "Агент в билде «тупит» и едет в стену. Что проверять в первую очередь?",
    options: [
      "Переучить сеть ещё на 10 млн шагов",
      "Совпадение Space Size / сенсоров / действий / Behavior Name / Decision Period с обучением",
      "Версию Windows у игрока",
      "Цвет фона трассы",
    ],
    correctIndex: 1,
    explanation:
      "95% сбоев деплоя — рассинхрон контракта между обучением и сценой. Загрузчик модели печатает несовпадение размерностей при старте сцены — включите Development Build и читайте логи.",
  },
];

const CompleteButton = () => {
  const [done, setDone] = useState<boolean>(() => isLessonComplete("3.5"));

  useEffect(() => {
    if (done) return;
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - window.innerHeight)) * 100;
      if (pct >= 90) {
        markLessonComplete("3.5");
        setDone(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [done]);

  const handleClick = () => {
    markLessonComplete("3.5");
    setDone(true);
  };

  return (
    <Button
      onClick={handleClick}
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

const CourseLesson3_5 = () => {
  const lesson = getLessonById("3.5")!;

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
            <Link to="/courses#stage-3" className="hover:text-cyan-400">
              Уровень 3
            </Link>
          </li>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
          <li className="text-foreground" aria-current="page">
            Урок 3.5
          </li>
        </ol>
      </nav>

      <LessonHeader
        title={lesson.title}
        subtitle={lesson.subtitle}
        isPro={lesson.isPro}
        estimatedMinutes={lesson.estimatedMinutes}
      />

      <SectionNav items={SECTIONS} />

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
        title="Проверь себя: деплой модели в Unity"
        questions={QUIZ_QUESTIONS}
        lessonPath="/courses/3-5"
        nextLesson={{ path: "/courses/3-6", title: "Оптимизация гиперпараметров" }}
      />

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
        title="Урок 3.5. Деплой модели: ONNX и Unity-сборка | CyberUnityCode"
        description="ONNX-экспорт обученной политики, Unity Inference Engine (Sentis), Behavior Parameters, Inference Device, DecisionRequester, детерминизм, IL2CPP-билд, WebGL/Mobile и диагностика рассинхрона наблюдений и действий на примере гоночного агента. PRO-урок."
        path="/courses/3-5"
        type="article"
        keywords="ONNX, Unity Sentis, Inference Engine, Barracuda, ML-Agents deploy, Behavior Parameters, Inference Device, DecisionRequester, IL2CPP, WebGL, Unity build, гоночный агент"
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

export default CourseLesson3_5;
