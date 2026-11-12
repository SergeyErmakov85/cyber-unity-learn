import NoviceLesson from "@/components/novice/NoviceLesson";
import { SECTIONS, QUIZ_QUESTIONS } from "@/components/lesson-1-4/LessonContent";

export default function CourseLesson1_4() {
  return <NoviceLesson lessonId="1-4" duration="30 мин"
    goal="Обучим Q-таблицу на FrozenLake и проверим её в 100 отдельных эпизодах."
    sections={SECTIONS} questions={QUIZ_QUESTIONS} />;
}
