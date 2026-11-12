import NoviceLesson from "@/components/novice/NoviceLesson";
import { SECTIONS, QUIZ_QUESTIONS } from "@/components/lesson-1-5/LessonContent";

export default function CourseLesson1_5() {
  return <NoviceLesson lessonId="1-5" duration="20 мин"
    goal="Запустим CartPole, изучим наблюдения и получим результат случайного агента для сравнения с DQN."
    sections={SECTIONS} questions={QUIZ_QUESTIONS} />;
}
