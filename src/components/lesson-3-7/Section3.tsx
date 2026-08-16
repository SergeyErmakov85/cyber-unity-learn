import Math from "@/components/Math";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Callout, Anchor } from "./_shared";

const Section3 = () => (
  <>
    <h2 id="razdel-3-cnn" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 3. CNN: когда агент видит пиксели
    </h2>

    <ProseP>
      Если гоночный агент получает наблюдение <strong>с камеры</strong> (картинка{" "}
      <Math display={false}>{String.raw`H\times \enfPar{W}\times C`}</Math>), MLP бесполезен: он не знает,
      что соседние пиксели связаны, и не переиспользует один и тот же детектор «края дороги» по
      всему кадру. Нужен <strong>свёрточный энкодер (CNN)</strong> с двумя индуктивными смещениями:{" "}
      <strong>локальность</strong> (фильтр смотрит на маленькое окно) и{" "}
      <strong>трансляционная инвариантность</strong> (один фильтр скользит по всему изображению,
      разделяя веса).
    </ProseP>

    <ProseP>Свёрточный слой превращает карту признаков в новую по правилу:</ProseP>

    <Math>
      {String.raw`\enfVar{z}^{(l+1)}_{i,j,k} \;=\; \enfFun{\sigma}\!\Big(\sum_{u,v,c} \enfPar{W}^{(l)}_{u,v,c,k}\, \enfVar{z}^{(l)}_{i\cdot s+u,\; j\cdot s+v,\; c} \;+\; \enfPar{b}_k\Big),`}
    </Math>

    <ProseP>
      где <Math display={false}>{String.raw`s`}</Math> — шаг (stride),{" "}
      <Math display={false}>{String.raw`k`}</Math> — индекс фильтра. После нескольких таких слоёв
      пространственная карта «сплющивается» в вектор и идёт в MLP-голову.
    </ProseP>

    <ProseP>
      <strong>Три канонических энкодера в ML-Agents</strong> (поле <code>vis_encode_type</code>):
    </ProseP>

    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border border-cyan-500/20 rounded-lg overflow-hidden">
        <thead className="bg-cyan-500/10">
          <tr className="text-left text-cyan-200">
            <th className="p-3"><code>vis_encode_type</code></th>
            <th className="p-3">Что это</th>
            <th className="p-3">Слои</th>
            <th className="p-3">Мин. размер</th>
            <th className="p-3">Когда брать</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cyan-500/10 text-foreground/85">
          <tr>
            <td className="p-3"><code>simple</code> (дефолт)</td>
            <td className="p-3">Лёгкий энкодер</td>
            <td className="p-3">2 свёрточных</td>
            <td className="p-3">20×20</td>
            <td className="p-3">Простые сцены, быстрый прототип</td>
          </tr>
          <tr>
            <td className="p-3"><code>nature_cnn</code></td>
            <td className="p-3">Сеть из Nature-DQN (Mnih и др., 2015)</td>
            <td className="p-3">3 свёрточных</td>
            <td className="p-3">36×36</td>
            <td className="p-3">Стандарт для пиксельного RL</td>
          </tr>
          <tr>
            <td className="p-3"><code>resnet</code></td>
            <td className="p-3">IMPALA-ResNet (Espeholt и др., 2018)</td>
            <td className="p-3">3 блока ×2 residual</td>
            <td className="p-3">15×15</td>
            <td className="p-3">Сложная визуальная сцена, есть бюджет</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ProseP>
      Классическая <strong>Nature-DQN-архитектура</strong> (то, что прячется за{" "}
      <code>nature_cnn</code>) для входа{" "}
      <Math display={false}>{String.raw`84\times84\times4`}</Math> выглядит так: Conv(32 фильтра,
      8×8, шаг 4) → Conv(64, 4×4, шаг 2) → Conv(64, 3×3, шаг 1) → FC(512). Это де-факто эталон, с
      которого начинают почти все пиксельные RL-агенты.
    </ProseP>

    <ProseP>
      <code>resnet</code> добавляет <strong>остаточные связи</strong>{" "}
      <Math display={false}>{String.raw`\enfVar{z}^{(l+1)} = \enfVar{z}^{(l)} + \mathcal{F}(\enfVar{z}^{(l)})`}</Math>,
      которые позволяют обучать гораздо более глубокие сети без затухания градиента — но это
      заметно дороже по вычислениям, поэтому берут его только когда <code>simple</code>/
      <code>nature_cnn</code> явно не вытягивают сложность сцены.
    </ProseP>

    <Callout title="Связь с предыдущим" color="cyan">
      Заметьте: 4-й канал входа DQN — это <strong>стек из 4 последних кадров</strong>. Это не часть
      CNN, а способ дать сети «чувство движения». Почему именно стек и какая у него альтернатива —
      в <Anchor to="razdel-4-memory">разделе 4</Anchor>.
    </Callout>

    <KeyPoints
      items={[
        <>Пиксельное наблюдение → <strong>CNN</strong>-энкодер; ключевые смещения — локальность и разделение весов.</>,
        <>
          В ML-Agents три готовых энкодера: <code>simple</code> (2 слоя), <code>nature_cnn</code>{" "}
          (3 слоя, эталон), <code>resnet</code> (IMPALA, остаточные блоки).
        </>,
        <>
          У каждого энкодера есть <strong>минимальный размер входа</strong> (20×20 / 36×36 / 15×15)
          из-за размеров ядер свёртки.
        </>,
        <>
          <code>resnet</code> мощнее за счёт остаточных связей, но дороже; берут под сложную сцену.
        </>,
      ]}
    />
  </>
);

export default Section3;
