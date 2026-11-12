import NoviceLesson from "@/components/novice/NoviceLesson";
import { SECTIONS, QUIZ_QUESTIONS } from "@/components/lesson-1-3/LessonContent";

export default function CourseLesson1_3() {
  return <NoviceLesson lessonId="1-3" duration="30–40 мин"
    goal="Опишем RoomBot как MDP, найдём политику в Python и проверим, как на неё влияют награды и скольжение."
    sections={SECTIONS} questions={QUIZ_QUESTIONS}
    notebookUrl="/RoomBot_MDP_Lesson_1.3.ipynb" notebookHint="RoomBot: одна реализация, график и задания" />;
}
