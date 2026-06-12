import Math from "@/components/Math";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints } from "./_shared";

const Section0 = () => (
  <>
    <h2 id="razdel-0" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 0. Мост: от отдельных алгоритмов — к законченной игре
    </h2>

    <ProseP>
      Весь курс до этого момента мы изучали алгоритмы <strong>по отдельности</strong> и в стерильных «песочницах». В{" "}
      <CrossLinkToLesson lessonId="3.1" lessonPath="/courses/3-1" lessonTitle="Урок 3.1 — SAC" lessonLevel={3}>уроке 3.1</CrossLinkToLesson>{" "}
      мы разобрали SAC на изолированной среде, в{" "}
      <CrossLinkToLesson lessonId="3.2" lessonPath="/courses/3-2" lessonTitle="Урок 3.2" lessonLevel={3}>уроке 3.2</CrossLinkToLesson>{" "}
      — MA-POCA и Self-Play на учебной арене, в{" "}
      <CrossLinkToLesson lessonId="project-3" lessonPath="/courses/project-3" lessonTitle="Проект 3" lessonLevel={3}>проекте 3</CrossLinkToLesson>{" "}
      обучили гоночного агента на PPO. Каждый раз среда была уже готова, награда — задана, а «игра» вокруг агента отсутствовала.
    </ProseP>

    <ProseP>
      Но <strong>готовая игра</strong> — это не обученная политика сама по себе. Это связный конвейер из шести звеньев, и слабость любого из них рушит результат:
    </ProseP>

    <Math>
      {String.raw`\underbrace{\text{Среда}}_{1} \to \underbrace{\text{Награда}}_{2} \to \underbrace{\text{Обучение}}_{3} \to \underbrace{\text{Оптимизация}}_{4} \to \underbrace{\text{Деплой}}_{5} \to \underbrace{\text{Геймплей}}_{6}`}
    </Math>

    <ProseP>
      Проблема, которую решает этот урок: <strong>отдельно работающий алгоритм ≠ играбельная игра</strong>. Можно идеально знать формулу SAC и при этом получить NPC, который в билде стоит на месте, — потому что среда давала не те наблюдения, награда поощряла не то поведение, а ONNX-модель не подключилась к движку. Финальный проект учит мыслить <strong>системно</strong>: видеть, как этапы влияют друг на друга, и доводить агента до того состояния, когда в него можно играть.
    </ProseP>

    <ProseP>
      Это <strong>кульминация курса</strong>. Успешное завершение подтверждает вашу квалификацию как специалиста по RL в gamedev и открывает доступ к <strong>сертификату об окончании</strong>.
    </ProseP>

    <KeyPoints
      items={[
        <>Алгоритмы вы уже знаете — задача финала собрать из них <strong>работающий конвейер</strong>.</>,
        <>Конвейер состоит из шести этапов; качество результата ограничено <strong>самым слабым</strong> звеном.</>,
        <>Цель — не «обучить политику», а <strong>получить играбельный билд</strong> с NPC, поведением которого управляет RL.</>,
      ]}
    />
  </>
);

export default Section0;
