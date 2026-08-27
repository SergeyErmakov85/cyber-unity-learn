import Math from "@/components/Math";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, InteractiveStub } from "./_shared";

const Section2 = () => (
  <>
    <h2 id="razdel-2-mlp" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 2. MLP: рабочая лошадка для векторных наблюдений
    </h2>

    <ProseP>
      Если наблюдение — это <strong>вектор фиксированной длины</strong> (скорость, расстояния до
      стен по лучам, угол к следующему чекпоинту), правильный энкодер — обычный{" "}
      <strong>многослойный перцептрон (MLP)</strong>. Это стек полносвязных слоёв с нелинейностью:
    </ProseP>

    <Math>
      {String.raw`\enfVar{z} = \enfFun{f}_\phi(\enfVar{o}) = \enfFun{\sigma}\big(\enfPar{W}_L\,\enfFun{\sigma}(\cdots \enfFun{\sigma}(\enfPar{W}_1 \enfVar{o} + \enfPar{b}_1)\cdots) + \enfPar{b}_L\big),`}
    </Math>

    <ProseP>
      где <Math display={false}>{String.raw`\enfFun{\sigma}`}</Math> — функция активации (в ML-Agents —
      Swish/ReLU-семейство), <Math display={false}>{String.raw`L =`}</Math>{" "}
      <code>num_layers</code>, ширина каждого слоя = <code>hidden_units</code>.
    </ProseP>

    <ProseP>
      <strong>Две ручки, два смысла.</strong> Ширина (<code>hidden_units</code>) — это «сколько
      разных признаков сеть может выделить на каждом уровне»; глубина (<code>num_layers</code>) —
      «насколько сложные комбинации признаков она может строить». Официальные дефолты ML-Agents:{" "}
      <code>hidden_units = 128</code> (типичный диапазон 32–512), <code>num_layers = 2</code>{" "}
      (типичный диапазон 1–3). Для простых задач, где действие — почти линейная функция входов,
      хватает узкой мелкой сети; для сложного взаимодействия переменных нужно шире и глубже.
    </ProseP>

    <ProseP>
      <strong>Нормализация входов.</strong> Векторные наблюдения часто разномасштабны: скорость в
      м/с (десятки), угол в радианах (единицы), расстояние (сотни). Флаг <code>normalize: true</code>{" "}
      включает нормализацию по бегущему среднему и дисперсии каждого входа — это стабилизирует
      обучение в задачах непрерывного управления (наш гоночный случай) и{" "}
      <strong>рекомендуется для них</strong>, хотя в простых дискретных задачах может, наоборот,
      мешать.
    </ProseP>

    <InteractiveStub title="Интерактив: MLP-конструктор">
      Слайдеры <code>hidden_units</code> (32→512) и <code>num_layers</code> (1→3) над схемой MLP:
      при увеличении число параметров растёт квадратично по ширине и линейно по глубине — показывать
      счётчик параметров и условную «ёмкость». Тоггл <code>normalize</code> демонстрирует, как
      разномасштабные входы «сжимаются» к нулевому среднему. Реализация — JSX/React с состоянием в{" "}
      <code>useRef</code>.
    </InteractiveStub>

    <KeyPoints
      items={[
        <>
          Векторное наблюдение фиксированной длины → энкодер <strong>MLP</strong>.
        </>,
        <>
          <code>hidden_units</code> (дефолт 128, диапазон 32–512) — ширина/ёмкость;{" "}
          <code>num_layers</code> (дефолт 2, диапазон 1–3) — глубина/сложность комбинаций.
        </>,
        <>
          <code>normalize: true</code> выравнивает разномасштабные входы; рекомендуется для
          непрерывного управления.
        </>,
        <>Глубже и шире — не всегда лучше: лишняя ёмкость замедляет обучение и переобучается.</>,
      ]}
    />
  </>
);

export default Section2;
