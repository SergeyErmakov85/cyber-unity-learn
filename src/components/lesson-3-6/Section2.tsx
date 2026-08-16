import Math from "@/components/Math";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { Anchor, SECTION_TITLE_CLASS, ProseP, KeyPoints, InteractiveStub, Code } from "./_shared";

const Section2 = () => (
  <>
    <h2 id="раздел-2-пространство-поиска" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 2. Пространство поиска: как описать <Math display={false}>{String.raw`\Lambda`}</Math>
    </h2>

    <ProseP>
      Прежде чем искать, нужно описать, <em>где</em> искать. Для каждого гиперпараметра задают тип и
      диапазон. Это и есть пространство поиска{" "}
      <Math display={false}>{String.raw`\Lambda`}</Math>.
    </ProseP>

    <ProseP>
      <strong>Непрерывный (uniform).</strong> Параметр берётся из отрезка равномерно. Подходит для
      величин, изменяющихся в «линейном» масштабе: например,{" "}
      <Code>lambd</Code> <Math display={false}>{String.raw`\in [0.9, 0.99]`}</Math> или{" "}
      <Code>epsilon</Code> <Math display={false}>{String.raw`\in [0.1, 0.3]`}</Math>.
    </ProseP>

    <ProseP>
      <strong>Логарифмический (log-uniform).</strong> Параметр берётся равномерно <em>в
      логарифмическом масштабе</em>. Это критично для величин, охватывающих несколько порядков, —
      прежде всего для <Code>learning_rate</Code>. Если искать{" "}
      <Code>learning_rate</Code>{" "}
      <Math display={false}>{String.raw`\in [10^{-5}, 10^{-3}]`}</Math> равномерно, то 90% точек
      попадут в диапазон <Math display={false}>{String.raw`[10^{-4}, 10^{-3}]`}</Math>, и мелкие
      скорости почти не будут проверены. В лог-масштабе вероятность распределяется поровну между
      «<Math display={false}>{String.raw`10^{-5}\!-\!10^{-4}`}</Math>» и «
      <Math display={false}>{String.raw`10^{-4}\!-\!10^{-3}`}</Math>»:
    </ProseP>

    <Math>{String.raw`\log_{10}\enfPar{\lambda} \sim \mathcal{U}(\log_{10} a,\; \log_{10} b).`}</Math>

    <ProseP>
      <strong>Целочисленный (int).</strong> Дискретный счётчик:{" "}
      <Code>num_epoch</Code> <Math display={false}>{String.raw`\in [3, 10]`}</Math>,{" "}
      <Code>num_layers</Code> <Math display={false}>{String.raw`\in [2, 3]`}</Math>.
    </ProseP>

    <ProseP>
      <strong>Категориальный (categorical).</strong> Конечный список без отношения порядка:{" "}
      <Code>batch_size</Code>{" "}
      <Math display={false}>{String.raw`\in \{512, 1024, 2048\}`}</Math>, тип энкодера, schedule (
      <Code>linear</Code>/<Code>constant</Code>). Алгоритм не предполагает, что соседние значения
      «похожи».
    </ProseP>

    <ProseP>
      <strong>Условный (conditional).</strong> Некоторые параметры имеют смысл только при
      определённых значениях других. Например, параметры памяти (<Code>memory_size</Code>) нужны
      только если включена рекуррентность; <Code>gail: strength</Code> — только если в{" "}
      <Code>reward_signals</Code> добавлен GAIL (
      <CrossLinkToLesson lessonId="3.4" lessonPath="/courses/3-4" lessonTitle="Урок 3.4" lessonLevel={3}>
        урок 3.4
      </CrossLinkToLesson>
      ). Условные пространства — то место, где Optuna особенно сильна (см.{" "}
      <Anchor to="раздел-8-optuna-практика">раздел 8</Anchor>).
    </ProseP>

    <InteractiveStub title="Uniform vs log-uniform">
      JSX-визуализация «uniform vs log-uniform»: слайдеры <Code>a</Code>, <Code>b</Code>, тогглы
      масштаба; точки сэмплируются в реальном времени и раскладываются по числовой оси — видно, как
      при log-uniform точки равномерно покрывают порядки величины, а при uniform жмутся к правому
      краю. Текст подписей — светлый (повышенная контрастность на тёмном фоне).
    </InteractiveStub>

    <KeyPoints
      items={[
        <>
          Пространство поиска <Math display={false}>{String.raw`\Lambda`}</Math> описывается
          потипно: uniform, log-uniform, int, categorical, conditional.
        </>,
        <>
          <Code>learning_rate</Code> и другие «многопорядковые» величины ищут в{" "}
          <strong>лог-масштабе</strong>, иначе мелкие значения не покрываются.
        </>,
        <>Категориальные значения не имеют порядка; целочисленные — имеют.</>,
        <>Условные параметры (память, GAIL) включаются в пространство только при нужных значениях других.</>,
      ]}
    />
  </>
);

export default Section2;
