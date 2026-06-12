import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints } from "./_shared";

const Section0 = () => (
  <>
    <h2 id="раздел-0-мост" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 0. Мост от предыдущих уроков: усталость от ручной настройки
    </h2>

    <ProseP>
      В предыдущих уроках вы не раз крутили гиперпараметры руками. В{" "}
      <CrossLinkToLesson lessonId="3.1" lessonPath="/courses/3-1" lessonTitle="Урок 3.1 — SAC/PPO" lessonLevel={3}>
        уроке 3.1
      </CrossLinkToLesson>{" "}
      вы подбирали <code>learning_rate</code> и <code>beta</code> для PPO, ориентируясь на кривую
      энтропии в TensorBoard. В{" "}
      <CrossLinkToLesson lessonId="3.3" lessonPath="/courses/3-3" lessonTitle="Урок 3.3 — Curriculum / DR" lessonLevel={3}>
        уроке 3.3
      </CrossLinkToLesson>{" "}
      добавили диапазоны domain randomization, в{" "}
      <CrossLinkToLesson lessonId="3.4" lessonPath="/courses/3-4" lessonTitle="Урок 3.4 — Imitation Learning" lessonLevel={3}>
        уроке 3.4
      </CrossLinkToLesson>{" "}
      — силу сигнала GAIL. Каждый раз это был один и тот же цикл: «изменил число → запустил
      обучение на полчаса-час → посмотрел на график → изменил снова».
    </ProseP>

    <ProseP>
      Проблема в том, что этот цикл плохо масштабируется. У PPO в ML-Agents легко набирается
      десяток взаимозависимых гиперпараметров. Перебрать их в голове невозможно: человек удерживает
      2–3 оси, а остальное настраивает «на ощупь» и часто застревает в локально приличной, но
      далёкой от лучшей конфигурации. Хуже того, такой подбор <strong>необъективен</strong>{" "}
      (зависит от того, что вы попробовали первым) и <strong>невоспроизводим</strong> (через месяц
      вы не вспомните, почему <code>beta = 0.003</code>, а не <code>0.005</code>).
    </ProseP>

    <ProseP>
      Этот урок решает ровно эту проблему: мы <strong>автоматизируем</strong> поиск гиперпараметров.
      Сначала разберём, как вообще формализуется задача и какие бывают стратегии поиска — от
      наивной сетки до байесовской оптимизации. Затем перейдём к инструментам:{" "}
      <strong>Optuna</strong> (движок поиска) и <strong>Weights &amp; Biases</strong> (логирование,
      визуализация, а при желании — собственный механизм sweep&apos;ов). И в конце применим всё это
      к нашему сквозному примеру — <strong>гоночному агенту</strong> из{" "}
      <CrossLinkToLesson
        lessonId="project-3"
        lessonPath="/courses/project-3"
        lessonTitle="Проект 3 — гоночный агент"
        lessonLevel={3}
      >
        Проекта 3
      </CrossLinkToLesson>
      .
    </ProseP>

    <KeyPoints
      items={[
        <>Ручная настройка гиперпараметров не масштабируется на 5+ осей, необъективна и невоспроизводима.</>,
        <>HPO автоматизирует подбор: вы задаёте пространство поиска и метрику, алгоритм ищет за вас.</>,
        <>Сквозной пример урока — тюнинг гоночного агента (PPO + GAIL + domain randomization).</>,
      ]}
    />
  </>
);

export default Section0;
