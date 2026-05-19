import LessonLayout from "@/components/LessonLayout";
import Section_Intro from "@/components/math-rl/lesson1_5/Section_Intro";
import Section_WorldAndState from "@/components/math-rl/lesson1_5/Section_WorldAndState";
import Section_MarkovProperty from "@/components/math-rl/lesson1_5/Section_MarkovProperty";
import Section_PolicyAndTrace from "@/components/math-rl/lesson1_5/Section_PolicyAndTrace";
import Section_ValueV from "@/components/math-rl/lesson1_5/Section_ValueV";
import Section_ValueQ from "@/components/math-rl/lesson1_5/Section_ValueQ";
import Section_ValueIteration from "@/components/math-rl/lesson1_5/Section_ValueIteration";
import Section_BellmanBridge from "@/components/math-rl/lesson1_5/Section_BellmanBridge";

/**
 * Урок 1.6 — «Марковские процессы принятия решений (MDP)».
 * Маршрут: /courses/1-6
 * Секции — в src/components/math-rl/lesson1_5/*.
 */
const CourseLesson1_6 = () => {
  return (
    <LessonLayout
      lessonId="1-6"
      lessonNumber="1.6"
      lessonTitle="Марковские процессы принятия решений"
      duration="35 мин"
      tags={["#theory", "#math", "#bellman"]}
      level={1}
      prevLesson={{ path: "/courses/1-5", title: "DQN с нуля на PyTorch" }}
      nextLesson={{ path: "/courses/1-7", title: "Exploration vs Exploitation" }}
    >
      <Section_Intro />
      {/* промпт 3 — Intro */}
      <Section_WorldAndState />
      {/* промпт 4 — World & State (S, A, T, R, γ) */}
      <Section_MarkovProperty />
      {/* промпт 5 — Markov Property */}
      <Section_PolicyAndTrace />
      {/* промпт 6 — Policy π, траектория, возврат G_t */}
      <Section_ValueV />
      {/* промпт 7 — V^π(s) */}
      <Section_ValueQ />
      {/* промпт 8 — Q^π(s, a) */}
      <Section_ValueIteration />
      {/* промпт 9 — Value Iteration на gridworld */}
      <Section_BellmanBridge />
      {/* промпт 10 — мост к Bellman Optimality / Q-Learning */}
    </LessonLayout>
  );
};

export default CourseLesson1_6;
