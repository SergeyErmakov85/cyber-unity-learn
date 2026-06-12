import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints } from "./_shared";

const Section5 = () => (
  <>
    <h2 id="раздел-5-байесовская-оптимизация" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 5. Байесовская оптимизация: учимся на прошлых испытаниях
    </h2>

    <ProseP>
      Адаптивные методы строят <strong>суррогатную модель (surrogate)</strong> — дешёвое
      приближение дорогой функции <Math display={false}>{String.raw`f`}</Math> — и используют её,
      чтобы выбрать следующую точку умнее, чем наугад. Этот цикл называют <strong>SMBO</strong>{" "}
      (Sequential Model-Based Optimization):
    </ProseP>

    <ol className="space-y-2 my-4 list-decimal list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        Обучи суррогат на уже наблюдённых парах{" "}
        <Math display={false}>{String.raw`(\boldsymbol{\lambda}_i, f(\boldsymbol{\lambda}_i))`}</Math>
        .
      </li>
      <li>
        С помощью <strong>функции выгоды (acquisition function)</strong> выбери следующий{" "}
        <Math display={false}>{String.raw`\boldsymbol{\lambda}`}</Math>.
      </li>
      <li>
        Вычисли настоящее (дорогое){" "}
        <Math display={false}>{String.raw`f(\boldsymbol{\lambda})`}</Math>, добавь в историю.
      </li>
      <li>Повтори.</li>
    </ol>

    <ProseP>
      Самая популярная функция выгоды — <strong>ожидаемое улучшение (Expected Improvement, EI)</strong>
      . Пусть <Math display={false}>{String.raw`f^{\star}`}</Math> — лучшее значение, достигнутое к
      данному моменту. EI оценивает, насколько кандидат{" "}
      <Math display={false}>{String.raw`\boldsymbol{\lambda}`}</Math> в среднем улучшит результат:
    </ProseP>

    <Math>{String.raw`\mathrm{EI}(\boldsymbol{\lambda}) = \mathbb{E}\!\left[\max\big(f(\boldsymbol{\lambda}) - f^{\star},\, 0\big)\right].`}</Math>

    <ProseP>
      EI элегантно балансирует <strong>эксплуатацию</strong> (точки рядом с уже найденным хорошим) и{" "}
      <strong>исследование</strong> (точки в неизведанных областях с высокой неопределённостью): и
      там, и там ожидаемое улучшение велико. Классический способ построить суррогат —{" "}
      <strong>гауссов процесс (GP)</strong>: он даёт и среднее, и неопределённость в каждой точке.
      Но у GP есть практическая беда — его стоимость растёт <strong>кубически</strong> по числу
      наблюдений <Math display={false}>{String.raw`O(n^3)`}</Math>, и он плохо дружит с
      категориальными и условными осями.
    </ProseP>

    <ProseP>
      Полный вывод EI для гауссова процесса и разбор ядерных функций — в хабе по теории
      вероятностей:{" "}
      <CrossLinkToHub
        hubPath="/math-rl/module-3"
        hubAnchor="байесовская-оптимизация"
        hubTitle="Хаб: теорвер и информация — байесовская оптимизация"
      >
        ↗ теорвер и информация
      </CrossLinkToHub>
      . Здесь нам важна идея «суррогат + выгода», а не вывод формулы.
    </ProseP>

    <KeyPoints
      items={[
        <>
          SMBO: суррогат приближает <Math display={false}>{String.raw`f`}</Math>, функция выгоды
          выбирает следующую точку, история пополняется.
        </>,
        <>
          <strong>EI</strong> — ожидаемое улучшение над лучшим текущим результатом{" "}
          <Math display={false}>{String.raw`f^{\star}`}</Math>; балансирует эксплуатацию и
          исследование.
        </>,
        <>
          Гауссов процесс — точный, но дорогой (<Math display={false}>{String.raw`O(n^3)`}</Math>)
          и слабый на категориальных/условных осях.
        </>,
        <>Это мотивирует более дешёвый суррогат — TPE (следующий раздел).</>,
      ]}
    />
  </>
);

export default Section5;
