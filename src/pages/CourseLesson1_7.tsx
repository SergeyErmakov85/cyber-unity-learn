import NoviceLesson from "@/components/novice/NoviceLesson";
import { SECTIONS, QUIZ_QUESTIONS } from "@/components/lesson-1-7/LessonContent";

export default function CourseLesson1_7() {
  return <NoviceLesson lessonId="1-7" duration="25 мин"
    goal="Сравним три стратегии исследования на одной задаче и одном бюджете, затем проверим крайние значения epsilon."
    sections={SECTIONS} questions={QUIZ_QUESTIONS} />;
}
