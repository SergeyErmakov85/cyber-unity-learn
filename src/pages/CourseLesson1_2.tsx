import NoviceLesson from "@/components/novice/NoviceLesson";
import { SECTIONS, QUIZ_QUESTIONS } from "@/components/lesson-1-2/LessonContent";

export default function CourseLesson1_2() {
  return <NoviceLesson lessonId="1-2" duration="40–60 мин"
    goal="Подготовим одну среду Python для начальных уроков и Unity-проект для итоговой балансировки шара."
    sections={SECTIONS} questions={QUIZ_QUESTIONS} />;
}
