import NoviceLesson from "@/components/novice/NoviceLesson";
import { SECTIONS, QUIZ_QUESTIONS } from "@/components/project-1/LessonContent";

export default function CourseProject1() {
  return <NoviceLesson lessonId="p-1" duration="60–90 мин"
    goal="Соберём готовую среду E04, обучим балансировку шара готовым PPO и проверим сохранённую модель в Unity."
    sections={SECTIONS} questions={QUIZ_QUESTIONS} />;
}
