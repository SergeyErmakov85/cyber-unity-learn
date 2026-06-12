import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Anchor } from "./_shared";

const Section10 = () => (
  <>
    <h2 id="razdel-10-svyaz" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 10. Связь с другими уроками и проектом
    </h2>

    <ul className="space-y-3 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>Назад.</strong> Actor–critic и схема <em>π/V</em> —{" "}
        <CrossLinkToLesson lessonId="3.1" lessonPath="/courses/3-1" lessonTitle="Урок 3.1" lessonLevel={3}>
          урок 3.1
        </CrossLinkToLesson>
        . Self-attention как механизм —{" "}
        <CrossLinkToLesson lessonId="3.2" lessonPath="/courses/3-2" lessonTitle="Урок 3.2" lessonLevel={3}>
          урок 3.2
        </CrossLinkToLesson>
        ; этот урок <strong>переиспользует</strong> его и не выводит заново. Domain randomization (
        <CrossLinkToLesson lessonId="3.3" lessonPath="/courses/3-3" lessonTitle="Урок 3.3" lessonLevel={3}>
          урок 3.3
        </CrossLinkToLesson>
        ) объясняет, почему энкодеру нужна устойчивость к вариациям. Кодирование демонстраций в
        BC/GAIL (
        <CrossLinkToLesson lessonId="3.4" lessonPath="/courses/3-4" lessonTitle="Урок 3.4" lessonLevel={3}>
          урок 3.4
        </CrossLinkToLesson>
        ) — это тоже выбор энкодера, просто для другого источника данных.
      </li>
      <li>
        <strong>Проект.</strong> Все решения этого урока напрямую конфигурируют{" "}
        <CrossLinkToLesson lessonId="project-3" lessonPath="/courses/project-3" lessonTitle="Проект 3" lessonLevel={3}>
          гоночный агент Проекта 3
        </CrossLinkToLesson>
        : какой <code>vis_encode_type</code>, нужна ли <code>memory</code>,{" "}
        <code>shared_critic</code> или нет.
      </li>
      <li>
        <strong>Вперёд.</strong> Decision Transformer (
        <Anchor to="razdel-9-decision-transformer">раздел 9</Anchor>) — мостик к offline- и
        sequence-RL, которые выходят за рамки уровня 3.
      </li>
    </ul>


    <KeyPoints
      items={[
        <>Урок собирает воедино архитектурные кусочки, которые молча присутствовали в 3.1–3.4.</>,
        <>
          Самое важное переиспользование —{" "}
          <strong>self-attention из 3.2</strong> (механизм не дублируется, даётся ссылкой).
        </>,
        <>Практический выход — конфиг гоночного агента Проекта 3.</>,
      ]}
    />
  </>
);

export default Section10;
