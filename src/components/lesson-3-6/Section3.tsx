import Math from "@/components/Math";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints } from "./_shared";

const Section3 = () => (
  <>
    <h2 id="раздел-3-grid-search" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 3. Grid search и проклятие размерности
    </h2>

    <ProseP>
      Самая прямолинейная стратегия — <strong>сетка (grid search)</strong>: дискретизируем каждую
      ось на несколько значений и перебираем все комбинации.
    </ProseP>

    <ProseP>
      Пусть у нас <Math display={false}>{String.raw`d`}</Math> гиперпараметров и по{" "}
      <Math display={false}>{String.raw`k`}</Math> значений на каждый. Тогда число испытаний равно
    </ProseP>

    <Math>{String.raw`N_{\text{grid}} = k^{\,d}.`}</Math>

    <ProseP>
      Это и есть <strong>проклятие размерности</strong>: число прогонов растёт{" "}
      <em>экспоненциально</em> по числу осей. Для{" "}
      <Math display={false}>{String.raw`k=5`}</Math> и{" "}
      <Math display={false}>{String.raw`d=6`}</Math> это уже{" "}
      <Math display={false}>{String.raw`5^6 = 15\,625`}</Math> полных обучений — недостижимо, когда
      одно обучение длится час.
    </ProseP>

    <ProseP>
      Перевернём формулу: при фиксированном бюджете{" "}
      <Math display={false}>{String.raw`B`}</Math> испытаний на каждую ось приходится лишь{" "}
      <Math display={false}>{String.raw`k = B^{1/d}`}</Math> значений. Чем больше осей, тем грубее
      сетка по каждой из них. Шесть гиперпараметров при бюджете{" "}
      <Math display={false}>{String.raw`B=64`}</Math> дают всего{" "}
      <Math display={false}>{String.raw`k=2`}</Math> значения на ось — смешное разрешение.
    </ProseP>

    <ProseP>
      У сетки есть и более тонкий изъян, который вскрывает следующий раздел: она{" "}
      <strong>тратит испытания на неважные оси</strong>. Если параметр почти не влияет на качество,
      сетка всё равно честно перебирает все его <Math display={false}>{String.raw`k`}</Math>{" "}
      значений в комбинации с остальными — и каждый «важный» параметр оказывается покрыт лишь{" "}
      <Math display={false}>{String.raw`k`}</Math> различными значениями, сколько бы испытаний вы
      ни потратили.
    </ProseP>

    <KeyPoints
      items={[
        <>
          Grid search перебирает все комбинации:{" "}
          <Math display={false}>{String.raw`N_{\text{grid}} = k^{d}`}</Math> — экспоненциальный рост.
        </>,
        <>
          При фиксированном бюджете разрешение по оси{" "}
          <Math display={false}>{String.raw`k = B^{1/d}`}</Math> падает с ростом числа осей.
        </>,
        <>Сетка непригодна для непрерывных пространств (бесконечно много значений) и расточительна на неважных осях.</>,
      ]}
    />
  </>
);

export default Section3;
