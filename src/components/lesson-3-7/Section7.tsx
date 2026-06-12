import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints } from "./_shared";

const Section7 = () => (
  <>
    <h2 id="razdel-7-tuning" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 7. Настройка архитектуры: что и в каком порядке крутить
    </h2>

    <ProseP>Архитектуру подбирают <strong>снизу вверх</strong>, от типа наблюдения к ёмкости:</ProseP>

    <ol className="space-y-2 my-4 list-decimal list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>Сначала энкодер под модальность</strong> (это решение №1, всё остальное вторично):
        вектор → MLP; пиксели → выбрать <code>vis_encode_type</code>; история нужна → стек кадров или{" "}
        <code>memory</code>; множество сущностей → внимание.
      </li>
      <li>
        <strong>Потом ёмкость головы/MLP:</strong> начните с дефолтов <code>hidden_units = 128</code>,{" "}
        <code>num_layers = 2</code>. Растёт ли награда и выходит ли на плато? Если плато низкое и
        задача сложная — увеличивайте <code>hidden_units</code> (256→512). Если обучение нестабильно
        или медленное — не спешите углубляться.
      </li>
      <li>
        <strong>Нормализация:</strong> для непрерывного управления <code>normalize: true</code> почти
        всегда помогает.
      </li>
      <li>
        <strong>Память — в последнюю очередь</strong> и только при доказанной частичной
        наблюдаемости; одновременно уменьшайте <code>num_layers</code>.
      </li>
    </ol>

    <ProseP>
      <strong>Диагностика по TensorBoard</strong> (метрики мы вводили в{" "}
      <CrossLinkToLesson lessonId="2.6" lessonPath="/courses/2-6" lessonTitle="Урок 2.6" lessonLevel={2}>
        уроке 2.6
      </CrossLinkToLesson>
      ): если <code>Policy/Entropy</code> падает слишком быстро, а награда стоит — сеть, возможно,
      переразмерена и переобучается под ранние эпизоды; если награда вообще не растёт при дешёвом
      энкодере — энкодер не «видит» нужного (неправильная модальность). Главное правило тюнинга:{" "}
      <strong>меняйте одну ось за раз</strong> (ширина / глубина / память), иначе не поймёте, что
      сработало.
    </ProseP>

    <KeyPoints
      items={[
        <>
          Порядок проектирования:{" "}
          <strong>энкодер под модальность → ёмкость → нормализация → (опционально) память</strong>.
        </>,
        <>
          Стартуйте с дефолтов 128/2; расширяйтесь, только если упёрлись в низкое плато на сложной
          задаче.
        </>,
        <>
          Диагностика — по <code>Policy/Entropy</code> и кривой награды в TensorBoard (
          <CrossLinkToLesson lessonId="2.6" lessonPath="/courses/2-6" lessonTitle="Урок 2.6" lessonLevel={2}>
            урок 2.6
          </CrossLinkToLesson>
          ).
        </>,
        <>Меняйте <strong>одну ось за раз</strong> — иначе тюнинг превращается в гадание.</>,
      ]}
    />
  </>
);

export default Section7;
