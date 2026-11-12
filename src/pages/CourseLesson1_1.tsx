import NoviceLesson from "@/components/novice/NoviceLesson";
import { SECTIONS, QUIZ_QUESTIONS } from "@/components/lesson-1-1/LessonContent";

export default function CourseLesson1_1() {
  return <NoviceLesson lessonId="1-1" duration="15 мин"
    goal="На примере сетки разберём цикл RL, пройдём до цели и сравним награды двух путей."
    sections={SECTIONS} questions={QUIZ_QUESTIONS} />;
}
