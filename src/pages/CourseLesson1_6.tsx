import NoviceLesson from "@/components/novice/NoviceLesson";
import { SECTIONS, QUIZ_QUESTIONS } from "@/components/lesson-1-6/LessonContent";

export default function CourseLesson1_6() {
  return <NoviceLesson lessonId="1-6" duration="40–60 мин"
    goal="Обучим DQN на знакомом CartPole, сохраним веса и сравним загруженную модель со случайным агентом."
    sections={SECTIONS} questions={QUIZ_QUESTIONS} />;
}
