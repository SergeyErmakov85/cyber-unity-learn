import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints } from "./_shared";

const Section13 = () => (
  <>
    <h2 id="раздел-13-связи" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 13. Связь с другими уроками и проектом
    </h2>

    <ProseP>
      <strong>Назад.</strong> Этот урок — надстройка над всем, что вы настраивали руками:
      гиперпараметрами PPO из{" "}
      <CrossLinkToLesson lessonId="3.1" lessonPath="/courses/3-1" lessonTitle="Урок 3.1" lessonLevel={3}>
        урока 3.1
      </CrossLinkToLesson>
      , W&amp;B-логированием из{" "}
      <CrossLinkToLesson lessonId="2.6" lessonPath="/courses/2-6" lessonTitle="Урок 2.6" lessonLevel={2}>
        урока 2.6
      </CrossLinkToLesson>
      , силой GAIL из{" "}
      <CrossLinkToLesson lessonId="3.4" lessonPath="/courses/3-4" lessonTitle="Урок 3.4" lessonLevel={3}>
        урока 3.4
      </CrossLinkToLesson>
      , диапазонами domain randomization из{" "}
      <CrossLinkToLesson lessonId="3.3" lessonPath="/courses/3-3" lessonTitle="Урок 3.3" lessonLevel={3}>
        урока 3.3
      </CrossLinkToLesson>{" "}
      и метрикой ELO из{" "}
      <CrossLinkToLesson lessonId="3.2" lessonPath="/courses/3-2" lessonTitle="Урок 3.2" lessonLevel={3}>
        урока 3.2
      </CrossLinkToLesson>
      . Раньше вы крутили эти ручки вручную — теперь поиск ведёт алгоритм.
    </ProseP>

    <ProseP>
      <strong>Вперёд.</strong> Подобранная здесь конфигурация — вход для финальной сборки гоночного
      агента в{" "}
      <CrossLinkToLesson
        lessonId="project-3"
        lessonPath="/courses/project-3"
        lessonTitle="Проект 3 — гоночный агент"
        lessonLevel={3}
      >
        Проекте 3
      </CrossLinkToLesson>
      : лучшие параметры из study переносятся в боевой YAML и дообучаются на полном бюджете. Навык
      HPO переносится и на любые будущие алгоритмы курса — везде, где есть «ручки до обучения».
    </ProseP>

    <KeyPoints
      items={[
        <>Урок опирается на 3.1 (PPO-гиперпараметры), 2.6 (W&amp;B), 3.2 (ELO), 3.3 (DR), 3.4 (GAIL) — но автоматизирует их подбор.</>,
        <>Результат HPO — конфигурация для финальной сборки агента в Проекте 3.</>,
        <>HPO — универсальный навык: применим к любому алгоритму с гиперпараметрами.</>,
      ]}
    />
  </>
);

export default Section13;
