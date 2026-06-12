import Math from "@/components/Math";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Anchor } from "./_shared";

const Section1 = () => (
  <>
    <h2 id="razdel-1-encoder-head" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 1. Анатомия сети агента: энкодер и голова
    </h2>

    <ProseP>
      Любая сеть RL-агента, какой бы сложной ни была, раскладывается на две части:
    </ProseP>

    <Math>
      {String.raw`a \;=\; \underbrace{h_\psi}_{\text{голова}}\Big(\underbrace{f_\phi(o)}_{\text{энкодер}}\Big),\qquad z = f_\phi(o)\in\mathbb{R}^d .`}
    </Math>

    <ProseP>
      <strong>Энкодер</strong> <Math display={false}>{String.raw`f_\phi`}</Math> берёт сырое
      наблюдение <Math display={false}>{String.raw`o`}</Math> (вектор чисел, картинку, набор
      сущностей) и сжимает его в плотный <strong>эмбеддинг</strong>{" "}
      <Math display={false}>{String.raw`z`}</Math> фиксированной размерности{" "}
      <Math display={false}>{String.raw`d`}</Math>. <strong>Голова</strong>{" "}
      <Math display={false}>{String.raw`h_\psi`}</Math> — обычно один-два полносвязных слоя —
      превращает <Math display={false}>{String.raw`z`}</Math> в то, что нужно алгоритму:
      распределение действий <Math display={false}>{String.raw`\pi(a\mid z)`}</Math> для актора
      или скаляр <Math display={false}>{String.raw`V(z)`}</Math> для критика.
    </ProseP>

    <ProseP>
      Почему это разделение настолько важно? Потому что{" "}
      <strong>энкодер несёт всю специфику задачи, а голова почти всегда одинакова.</strong> Меняется
      модальность наблюдения — меняется только энкодер; правило обучения (PPO/SAC) работает поверх{" "}
      <Math display={false}>{String.raw`z`}</Math> и не знает, пришёл ли{" "}
      <Math display={false}>{String.raw`z`}</Math> из пикселей или из вектора. Именно поэтому Unity
      ML-Agents отдаёт вам ровно две ручки: <code>vis_encode_type</code> (какой энкодер для
      картинок) и <code>hidden_units</code>/<code>num_layers</code> (насколько мощная голова и
      MLP-часть) — об этом в <Anchor to="razdel-8-unity-yaml">разделе 8</Anchor>.
    </ProseP>

    <ProseP>
      В гоночном агенте это выглядит так: лучи дальномера (raycast) → MLP-энкодер; кадр с камеры →
      CNN-энкодер; оба эмбеддинга <strong>конкатенируются</strong> в один{" "}
      <Math display={false}>{String.raw`z`}</Math>, и уже над ним стоит общая голова актора.
      ML-Agents делает эту конкатенацию автоматически, когда у агента несколько сенсоров.
    </ProseP>

    <KeyPoints
      items={[
        <>
          Сеть агента = <strong>энкодер</strong>{" "}
          <Math display={false}>{String.raw`f_\phi`}</Math> (наблюдение → эмбеддинг{" "}
          <Math display={false}>{String.raw`z`}</Math>) + <strong>голова</strong>{" "}
          <Math display={false}>{String.raw`h_\psi`}</Math> (
          <Math display={false}>{String.raw`z`}</Math> → действие/оценка).
        </>,
        <>
          Специфика задачи живёт в энкодере; голова и алгоритм обучения универсальны над{" "}
          <Math display={false}>{String.raw`z`}</Math>.
        </>,
        <>
          Несколько сенсоров → несколько энкодеров, их эмбеддинги конкатенируются в общий{" "}
          <Math display={false}>{String.raw`z`}</Math>.
        </>,
        <>Выбор архитектуры = в первую очередь <strong>выбор энкодера под тип наблюдения</strong>.</>,
      ]}
    />
  </>
);

export default Section1;
