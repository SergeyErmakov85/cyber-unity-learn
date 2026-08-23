import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Callout } from "./_shared";

const Section0 = () => (
  <>
    <h2 id="razdel-0-most" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 0. Мост: у нас есть обученный мозг — теперь его надо «вживить» в игру
    </h2>

    <ProseP>
      В прошлый раз (
      <CrossLinkToHub
        hubPath="/courses/3-4"
        hubAnchor="razdel-8-pipeline"
        hubTitle="Урок 3.4 — пайплайн BC + GAIL"
      >
        ↩ Урок 3.4
      </CrossLinkToHub>
      ) мы довели гоночного агента до ума: записали экспертные демонстрации, прогрели политику через
      behavioral cloning, а затем дообучили её связкой PPO + GAIL поверх рандомизированных трасс из{" "}
      <CrossLinkToHub
        hubPath="/courses/3-3"
        hubAnchor="razdel-4-randomizatsiya"
        hubTitle="Урок 3.3 — Domain Randomization"
      >
        ↩ Урока 3.3
      </CrossLinkToHub>
      . В TensorBoard кривая награды вышла на плато, агент уверенно проходит круг. Казалось бы, всё.
    </ProseP>

    <ProseP>
      Но вся эта работа жила в <strong>Python-процессе</strong>: <code>mlagents-learn</code> держал
      нейросеть в памяти PyTorch и общался с Unity через сокет. Игрок, который скачает вашу сборку,
      никакого Python не запустит. Значит, обученную политику нужно{" "}
      <strong>вынуть из тренировочного контура и зашить прямо в Unity-билд</strong>, чтобы агент
      думал локально, на устройстве игрока, без единой строчки серверного кода.
    </ProseP>

    <ProseP>
      Это и есть <strong>деплой</strong>. Тема урока — как именно политика-функция{" "}
      <Math display={false}>{String.raw`\pi_\theta(a\mid \enfVar{s})`}</Math> превращается из тензоров
      PyTorch в файл, который Unity умеет исполнять в реальном времени внутри готовой игры. Звучит
      как рутина, но именно здесь ломается больше всего проектов: модель «не та», устройство выбрано
      неудачно, пространства наблюдений разъехались — и идеально обученный агент в билде ведёт себя
      как пьяный.
    </ProseP>

    <Callout title="Сквозной пример урока" color="cyan">
      Тот же гоночный агент из{" "}
      <CrossLinkToHub hubPath="/courses/project-3" hubTitle="Проект 3 — гоночный агент">
        Проекта 3
      </CrossLinkToHub>
      . Мы пройдём путь от файла <code>results/race_v7/RaceAgent.onnx</code> до агента, который
      крутит руль в собранном <code>.exe</code> (или на Android/WebGL), и разберём, что может пойти
      не так на каждом шаге.
    </Callout>

    <KeyPoints
      items={[
        <>Обучение жило в Python; готовая игра никакого Python запускать не будет.</>,
        <>
          Деплой = вынуть обученную политику и зашить её в Unity-билд для локального инференса.
        </>,
        <>
          Большинство проблем деплоя — не про обучение, а про правильную «стыковку» модели с агентом
          и устройством.
        </>,
      ]}
    />
  </>
);

export default Section0;
