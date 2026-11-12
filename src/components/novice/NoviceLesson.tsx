import { useEffect, useState, type ComponentProps, type ReactNode } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Target } from "lucide-react";
import LessonLayout from "@/components/LessonLayout";
import SectionNav, { type SectionNavItem } from "@/components/SectionNav";
import Quiz from "@/components/Quiz";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LEARNING_MAP } from "@/content/learningMap";
import { isLessonComplete, markLessonComplete } from "@/lib/gamification";

export interface NoviceSection extends SectionNavItem {
  content: ReactNode;
}
export type NoviceQuestions = ComponentProps<typeof Quiz>["questions"];

interface Props {
  lessonId: string;
  duration: string;
  goal: string;
  sections: NoviceSection[];
  questions: NoviceQuestions;
  notebookUrl?: string;
  notebookHint?: string;
}

function CompleteLessonButton({ lessonId }: { lessonId: string }) {
  const [done, setDone] = useState(() => isLessonComplete(lessonId));
  useEffect(() => {
    if (done) return;
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (height > 0 && window.scrollY / height >= 0.9) {
        markLessonComplete(lessonId);
        setDone(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [done, lessonId]);
  return (
    <Button disabled={done} onClick={() => { markLessonComplete(lessonId); setDone(true); }}>
      <CheckCircle2 className="mr-2 h-4 w-4" />
      {done ? "Пройдено" : "Отметить урок как пройденный"}
    </Button>
  );
}

export function LessonCode({ code, filename }: { code: string; filename: string }) {
  return <div>
    <CyberCodeBlock language="python" filename={filename}>{code}</CyberCodeBlock>
    <a className="inline-flex items-center gap-2 text-sm text-primary underline underline-offset-4"
      href={`data:text/x-python;charset=utf-8,${encodeURIComponent(code)}`} download={filename}>
      <Download className="h-4 w-4" /> Скачать {filename}
    </a>
  </div>;
}

export default function NoviceLesson({ lessonId, duration, goal, sections, questions, notebookUrl, notebookHint }: Props) {
  const lessons = LEARNING_MAP.flatMap(stage => stage.lessons);
  const index = lessons.findIndex(lesson => lesson.id === lessonId);
  const lesson = lessons[index];
  const previous = lessons[index - 1];
  const next = lessons[index + 1];
  const number = lesson.type === "project" ? "П1" : lesson.id.replace("-", ".");
  const contextId = lesson.type === "project" ? lesson.slug : lessonId;
  const items = [{ id: "intro", label: "Цель" }, ...sections, { id: "quiz", label: "Квиз" }];
  return (
    <LessonLayout lessonId={contextId} lessonTitle={lesson.title} lessonNumber={number}
      duration={duration} tags={["#практика"]} level={1} compactReferences
      notebookUrl={notebookUrl} notebookHint={notebookHint}
      prevLesson={previous ? { path: previous.path, title: previous.title } : undefined}
      nextLesson={next ? { path: next.path, title: next.title } : undefined}>
      <SectionNav items={items} />
      <Card id="intro" className="scroll-mt-24 border-primary/30 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <CardContent className="p-6 md:p-8">
          <h2 id="intro-title" className="mb-3 flex items-center gap-2 text-xl font-bold text-foreground">
            <Target className="h-5 w-5 text-primary" /> Что сделаем
          </h2>
          <p className="text-muted-foreground leading-relaxed">{goal}</p>
        </CardContent>
      </Card>
      {sections.map((section) => (
        <motion.section key={section.id} id={section.id}
          className="scroll-mt-24 rounded-2xl border border-primary/15 bg-card/60 px-5 py-8 backdrop-blur-sm md:px-8"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.3 }}>
          <h2 id={`${section.id}-title`} className="mb-5 text-2xl font-bold text-foreground">{section.label}</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed [overflow-wrap:anywhere] [&_strong]:text-foreground [&_code]:text-primary [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
            {section.content}
          </div>
        </motion.section>
      ))}
      <section id="quiz" className="scroll-mt-24">
        <h2 id="quiz-title" className="text-2xl font-bold text-foreground">Проверь себя</h2>
        <Quiz title="Короткий квиз по практике" questions={questions} lessonPath={lesson.path} />
      </section>
      <Card className="border-primary/30 bg-card/60">
        <CardContent className="flex flex-col items-start justify-between gap-4 p-5 md:flex-row md:items-center">
          <p className="text-sm text-muted-foreground">Выполнили задание и проверили результат? Сохраните прогресс.</p>
          <CompleteLessonButton lessonId={lesson.path} />
        </CardContent>
      </Card>
    </LessonLayout>
  );
}
