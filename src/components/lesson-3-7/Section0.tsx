import Math from "@/components/Math";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints } from "./_shared";

const Section0 = () => (
  <>
    <h2 id="razdel-0-most" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 0. От «какому алгоритму учить» к «какую сеть учить»
    </h2>

    <ProseP>
      До сих пор все уроки уровня 3 отвечали на вопрос{" "}
      <strong>«по какому правилу обновлять веса»</strong>: PPO и SAC (
      <CrossLinkToLesson lessonId="3.1" lessonPath="/courses/3-1" lessonTitle="Урок 3.1" lessonLevel={3}>
        урок 3.1
      </CrossLinkToLesson>
      ), MA-POCA и self-play (
      <CrossLinkToLesson lessonId="3.2" lessonPath="/courses/3-2" lessonTitle="Урок 3.2" lessonLevel={3}>
        урок 3.2
      </CrossLinkToLesson>
      ), курс обучения и рандомизация домена (
      <CrossLinkToLesson lessonId="3.3" lessonPath="/courses/3-3" lessonTitle="Урок 3.3" lessonLevel={3}>
        урок 3.3
      </CrossLinkToLesson>
      ), имитация эксперта (
      <CrossLinkToLesson lessonId="3.4" lessonPath="/courses/3-4" lessonTitle="Урок 3.4" lessonLevel={3}>
        урок 3.4
      </CrossLinkToLesson>
      ). Во всех этих уроках <strong>сама нейросеть</strong> была чёрным ящиком: «политика{" "}
      <Math display={false}>{String.raw`\pi_\theta(a\mid s)`}</Math>» — и всё.
    </ProseP>

    <ProseP>
      Но <Math display={false}>{String.raw`\theta`}</Math> — это не абстракция. Это конкретная{" "}
      <strong>архитектура</strong>: сколько слоёв, какой энкодер для картинки, есть ли память о
      прошлом, как обрабатывается переменное число соседних машин на трассе. И вот в чём проблема:{" "}
      <strong>самый лучший алгоритм обучения не спасёт плохо подобранную архитектуру.</strong> Если
      гоночный агент из{" "}
      <CrossLinkToLesson lessonId="project-3" lessonPath="/courses/project-3" lessonTitle="Проект 3" lessonLevel={3}>
        Проекта 3
      </CrossLinkToLesson>{" "}
      видит мир камерой, а вы скармливаете пиксели в обычный MLP — PPO будет честно оптимизировать,
      но агент не научится ехать, потому что у сети нет индуктивного смещения для изображений.
    </ProseP>

    <ProseP>
      Этот урок — про вторую половину уравнения. Мы возьмём наш сквозной пример —{" "}
      <strong>гоночный агент</strong> — и пройдём по типам наблюдений, которые он может получать
      (вектор сенсоров, картинку с камеры, историю, список соседей), и для каждого подберём
      правильный «орган восприятия». В конце соберём всё в один YAML-блок{" "}
      <code>network_settings</code>, который вы уже мельком видели в конфигах предыдущих уроков, но
      ни разу не разбирали по полям.
    </ProseP>

    <KeyPoints
      items={[
        <>
          Алгоритм обучения и архитектура сети — <strong>две независимые оси</strong> проектирования;
          этот урок про вторую.
        </>,
        <>
          Неправильная архитектура не лечится сменой алгоритма: PPO над «слепой» сетью так и останется
          слепым.
        </>,
        <>Сквозной пример урока — гоночный агент из Проекта 3 и его разные модальности наблюдений.</>,
      ]}
    />
  </>
);

export default Section0;
