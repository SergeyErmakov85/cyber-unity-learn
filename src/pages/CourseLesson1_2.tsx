import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  ChevronRight,
  Rocket,
  Layers,
  Flame,
  GitBranch,
  NotebookPen,
  CheckCircle2,
} from "lucide-react";
import LessonHeader from "@/components/LessonHeader";
import SectionNav, { SectionNavItem } from "@/components/SectionNav";
import LessonSidebarTOC from "@/components/LessonSidebarTOC";
import NextPrevLesson from "@/components/NextPrevLesson";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import SEOHead from "@/components/SEOHead";
import TldrBox from "@/components/ui/TldrBox";
import Quiz from "@/components/Quiz";
import RequirementsSection from "@/components/lesson-1-2/RequirementsSection";
import AnacondaSection from "@/components/lesson-1-2/AnacondaSection";
import CondaEnvSection from "@/components/lesson-1-2/CondaEnvSection";
import PyTorchSection from "@/components/lesson-1-2/PyTorchSection";
import UnitySection from "@/components/lesson-1-2/UnitySection";
import MLAgentsSection from "@/components/lesson-1-2/MLAgentsSection";
import VSCodeSection from "@/components/lesson-1-2/VSCodeSection";
import VerifySection from "@/components/lesson-1-2/VerifySection";
import RelatedMaterials from "@/components/lesson-1-2/RelatedMaterials";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLessonById } from "@/data/lessons";
import { markLessonComplete, isLessonComplete } from "@/lib/gamification";
import LessonTextbookLinks from "@/components/LessonTextbookLinks";
import LabPracticeSection from "@/components/LabPracticeSection";

const KEY_FINDINGS = [
  {
    title: "Python строго 3.10.x",
    text:
      "ML-Agents Release 22 требует Python 3.10.1–3.10.12. Conda решает это одной командой: conda create -n mlagents python=3.10.12 — независимо от системного Python.",
    icon: Layers,
    color: "cyan",
  },
  {
    title: "PyTorch — до ML-Agents",
    text:
      "Сначала последняя стабильная CUDA-сборка (cu128), потом mlagents — иначе pip на Windows подтянет CPU-версию, и GPU останется без работы.",
    icon: Flame,
    color: "purple",
  },
  {
    title: "ML-Agents из git",
    text:
      "git clone --branch release_22 даёт исходный код тренера, сцены-примеры (3DBall, Crawler) и YAML-конфиги обучения — не только Python-пакеты.",
    icon: GitBranch,
    color: "pink",
  },
  {
    title: "VS Code + Jupyter",
    text:
      "Весь курс работаем в VS Code с ноутбуками: расширения Python + Jupyter, интерпретатор из conda-среды mlagents, ipykernel.",
    icon: NotebookPen,
    color: "emerald",
  },
] as const;

const COLOR_MAP: Record<string, string> = {
  cyan: "border-cyan-500/30 hover:border-cyan-400/70 hover:shadow-[0_0_24px_hsl(var(--primary)/0.35)] [&_svg]:text-cyan-400",
  purple:
    "border-purple-500/30 hover:border-purple-400/70 hover:shadow-[0_0_24px_hsl(280_85%_65%/0.35)] [&_svg]:text-purple-400",
  pink: "border-pink-500/30 hover:border-pink-400/70 hover:shadow-[0_0_24px_hsl(330_85%_65%/0.35)] [&_svg]:text-pink-400",
  emerald:
    "border-emerald-500/30 hover:border-emerald-400/70 hover:shadow-[0_0_24px_hsl(160_85%_55%/0.35)] [&_svg]:text-emerald-400",
};

const SECTIONS: SectionNavItem[] = [
  { id: "intro", label: "Введение" },
  { id: "requirements", label: "Системные требования" },
  { id: "anaconda", label: "Установка Anaconda" },
  { id: "conda-env", label: "Среда conda" },
  { id: "pytorch", label: "PyTorch + CUDA" },
  { id: "unity", label: "Unity 6" },
  { id: "mlagents", label: "ML-Agents через git" },
  { id: "vscode", label: "VS Code + Jupyter" },
  { id: "verify", label: "Финальная проверка" },
  { id: "quiz", label: "Квиз" },
];

const SECTION_CLASS =
  "scroll-mt-24 py-16 px-6 md:px-10 bg-card/60 backdrop-blur-sm rounded-2xl border border-cyan-500/10";
const SECTION_TITLE_CLASS =
  "text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6";

const SECTION_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const QUIZ_QUESTIONS = [
  {
    question: "Какая версия Python нужна для ML-Agents Release 22?",
    options: ["Любая 3.8+", "Строго 3.10.1–3.10.12", "3.11 или новее", "Только 3.12"],
    correctIndex: 1,
    explanation:
      "ML-Agents Release 22 жёстко ограничивает Python диапазоном 3.10.1–3.10.12 (python_requires в setup.py). Поэтому среду создаём командой conda create -n mlagents python=3.10.12.",
  },
  {
    question: "Почему PyTorch устанавливается ДО пакетов ML-Agents?",
    options: [
      "Так быстрее скачивается",
      "Иначе pip на Windows поставит CPU-версию без CUDA",
      "ML-Agents не работает без torchvision",
      "Порядок не важен",
    ],
    correctIndex: 1,
    explanation:
      "Если позволить pip самому разрешить зависимость torch при установке mlagents, на Windows он возьмёт CPU-колесо по умолчанию. Ставя заранее сборку из индекса cu128, мы гарантируем поддержку GPU.",
  },
  {
    question: "Какой командой клонируется правильная версия репозитория ML-Agents?",
    options: [
      "git clone https://github.com/Unity-Technologies/ml-agents.git (ветка по умолчанию)",
      "git clone --branch develop …",
      "git clone --branch release_22 https://github.com/Unity-Technologies/ml-agents.git",
      "pip download mlagents",
    ],
    correctIndex: 2,
    explanation:
      "Релизная ветка release_22 зафиксирована и протестирована. Ветка develop — нестабильная разработка, а установка через pip не даёт исходников, примеров и конфигов.",
  },
  {
    question: "Как проверить, что Python-часть ML-Agents установлена корректно?",
    options: [
      "python -m mlagents",
      "mlagents-learn --help",
      "conda verify mlagents",
      "pip show unity",
    ],
    correctIndex: 1,
    explanation:
      "mlagents-learn — основная точка входа для обучения агентов. Если команда выводит справку с логотипом ML-Agents — установка прошла успешно.",
  },
];

const IntroSection = () => (
  <div className="space-y-8">
    {/* Hero card */}
    <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex-1 space-y-3">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground">
            От чистой системы — до mlagents-learn --help
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            В этом уроке мы развернём полное окружение для Deep Reinforcement Learning:
            Anaconda с Python 3.10, изолированную conda-среду, PyTorch с поддержкой CUDA,
            Unity 6 с пакетом ML-Agents и VS Code с Jupyter-ноутбуками. Все шаги образуют
            единую цепочку для Windows 10/11, macOS (M1/M2/M3) и Linux (Ubuntu).
          </p>
        </div>
        <div className="shrink-0 w-20 h-20 rounded-2xl border border-cyan-400/40 bg-cyan-500/10 flex items-center justify-center shadow-[0_0_32px_hsl(var(--primary)/0.45)]">
          <Rocket className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_10px_hsl(var(--primary)/0.7)]" />
        </div>
      </CardContent>
    </Card>

    {/* TL;DR */}
    <TldrBox
      items={[
        <>
          Окружение строится через <strong className="text-cyan-300">Anaconda</strong>:
          conda-среда{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">mlagents</code> с
          Python <strong>3.10.12</strong> — жёсткое требование ML-Agents Release 22
          (поддерживается только 3.10.1–3.10.12).
        </>,
        <>
          Порядок установки важен: Anaconda → conda-среда →{" "}
          <strong className="text-purple-300">PyTorch с CUDA</strong> (
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
            --index-url …/whl/cu128
          </code>
          ) → Unity 6 →{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
            git clone --branch release_22
          </code>{" "}
          → <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">pip install -e</code>{" "}
          → VS Code + Jupyter.
        </>,
        <>
          Финальный критерий готовности —{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">
            mlagents-learn --help
          </code>{" "}
          выводит справку без ошибок; ноутбук в VS Code импортирует{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">torch</code> и{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted/50 text-xs">mlagents_envs</code>.
        </>,
      ]}
    />

    {/* Key findings grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {KEY_FINDINGS.map(({ title, text, icon: Icon, color }) => (
        <Card
          key={title}
          className={`group bg-card/60 backdrop-blur-sm transition-all duration-300 hover:scale-105 ${COLOR_MAP[color]}`}
        >
          <CardContent className="p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-bold text-foreground leading-snug">{title}</h4>
              <Icon className="w-6 h-6 shrink-0 transition-transform group-hover:scale-110" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const CompleteButton = () => {
  const [done, setDone] = useState<boolean>(() => isLessonComplete("1.2"));

  useEffect(() => {
    if (done) return;
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - window.innerHeight)) * 100;
      if (pct >= 90) {
        markLessonComplete("1.2");
        setDone(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [done]);

  const handleClick = () => {
    markLessonComplete("1.2");
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

const CourseLesson1_2 = () => {
  const lesson = getLessonById("1.2")!;

  return (
    <>
      <SEOHead
        title="Урок 1.2. Установка окружения: PyTorch + Unity ML-Agents | CyberUnityCode"
        description="Пошаговая установка окружения для Deep RL: Anaconda и conda-среда с Python 3.10.12, PyTorch с CUDA 12.8, Unity 6, ML-Agents Release 22 через git clone, VS Code + Jupyter. Windows, macOS (Apple Silicon), Linux."
        path="/courses/1-2"
        type="article"
        keywords="Anaconda, conda, PyTorch, CUDA, Unity ML-Agents, release_22, VS Code, Jupyter, установка окружения"
      />
      <a
        href="#lesson-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:rounded-md focus:bg-card focus:text-cyan-300 focus:border focus:border-cyan-400 focus:shadow-[0_0_16px_hsl(var(--primary)/0.6)]"
      >
        К содержимому урока
      </a>
      <ScrollProgressBar color="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
      <main className="container max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
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
              <Link to="/courses#level-1" className="hover:text-cyan-400">
                Уровень 1
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" aria-hidden="true" />
            <li className="text-foreground" aria-current="page">
              Урок 1.2
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
        <LessonSidebarTOC items={SECTIONS} color="cyan" />

        <div id="lesson-content" className="space-y-8 mt-8">
          {SECTIONS.map((s, i) => (
            <motion.section
              key={s.id}
              id={s.id}
              className={SECTION_CLASS}
              variants={SECTION_VARIANTS}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: Math.min(i * 0.05, 0.25) }}
            >
              <h2 className={`${SECTION_TITLE_CLASS} text-2xl md:text-3xl`}>{s.label}</h2>
              {s.id === "intro" ? (
                <IntroSection />
              ) : s.id === "requirements" ? (
                <RequirementsSection />
              ) : s.id === "anaconda" ? (
                <AnacondaSection />
              ) : s.id === "conda-env" ? (
                <CondaEnvSection />
              ) : s.id === "pytorch" ? (
                <PyTorchSection />
              ) : s.id === "unity" ? (
                <UnitySection />
              ) : s.id === "mlagents" ? (
                <MLAgentsSection />
              ) : s.id === "vscode" ? (
                <VSCodeSection />
              ) : s.id === "verify" ? (
                <VerifySection />
              ) : (
                <Quiz
                  title="Проверь себя: установка окружения"
                  questions={QUIZ_QUESTIONS}
                  nextLesson={lesson.next ? { path: lesson.next.path, title: lesson.next.title } : undefined}
                />
              )}
            </motion.section>
          ))}
        </div>

        <LessonTextbookLinks lessonId="1-2" lessonLabel="Урок 1.2. Установка окружения" />

        {/* Практика: собранная среда лаборатории для этой темы. */}
        <LabPracticeSection contextKey="1-2" />

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
      </main>
    </>
  );
};

export default CourseLesson1_2;
