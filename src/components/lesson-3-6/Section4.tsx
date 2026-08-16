import Math from "@/components/Math";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, InteractiveStub } from "./_shared";

const Section4 = () => (
  <>
    <h2 id="раздел-4-random-search" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 4. Random search: почему случайность бьёт сетку
    </h2>

    <ProseP>
      Замените сетку на <strong>случайный поиск (random search)</strong>: на каждом испытании
      берите все гиперпараметры из их распределений независимо и случайно. Звучит как шаг назад —
      но Bergstra &amp; Bengio (2012) показали и эмпирически, и теоретически, что random search{" "}
      <strong>эффективнее</strong> сетки при том же бюджете.
    </ProseP>

    <ProseP>
      Причина — <strong>низкая эффективная размерность (low effective dimensionality)</strong>. На
      практике из десятка гиперпараметров на качество сильно влияют лишь немногие, и какие именно
      — заранее неизвестно и меняется от задачи к задаче. Формально: для{" "}
      <Math display={false}>{String.raw`\boldsymbol{\enfPar{\lambda}} = (\enfPar{\lambda}_1, \enfPar{\lambda}_2)`}</Math> часто
      оказывается, что{" "}
      <Math display={false}>{String.raw`\enfFun{f}(\boldsymbol{\enfPar{\lambda}}) \approx \enfFun{g}(\enfPar{\lambda}_1)`}</Math> — то
      есть вторая ось почти не важна.
    </ProseP>

    <ProseP>
      Вот в чём ключевая разница. Сетка <Math display={false}>{String.raw`3\times 3`}</Math> тратит
      9 испытаний, но по <strong>важной</strong> оси проверяет лишь <strong>3</strong> различных
      значения (остальные — её дубликаты при разных значениях неважной оси). Random search на тех
      же 9 испытаниях проверяет <strong>9 различных</strong> значений важной оси — потому что
      неважная ось «бесплатно» меняется вместе с ней. Иными словами, случайный поиск по важной оси
      работает так же эффективно, как если бы вы искали по ней одной, а лишние оси не «съедают»
      бюджет.
    </ProseP>

    <Math>{String.raw`\underbrace{\text{Grid } 3\times 3}_{\text{9 испытаний, 3 значения важной оси}} \quad\text{vs}\quad \underbrace{\text{Random } 9}_{\text{9 испытаний, 9 значений важной оси}}`}</Math>

    <ProseP>
      Поэтому random search — это <strong>базовый эталон (baseline)</strong>, с которым обязан
      сравниваться любой более умный метод. Если ваш «продвинутый» алгоритм не бьёт случайный поиск
      — он не нужен. Но и у random search есть слабость: он <strong>не учится на прошлых
      испытаниях</strong>, тратит точки равномерно, в том числе там, где уже понятно, что
      результаты плохи. Это исправляют адаптивные методы.
    </ProseP>

    <InteractiveStub title="Grid vs Random">
      JSX-визуализация «grid vs random» по мотивам классической картинки Bergstra &amp; Bengio:
      квадрат с проекциями на «важную» (по горизонтали) и «неважную» (по вертикали) оси; тоггл
      grid/random, слайдер числа испытаний. Подсветить, сколько <em>различных</em> значений важной
      оси покрыто.
    </InteractiveStub>

    <KeyPoints
      items={[
        <>Random search: каждое испытание — независимая случайная конфигурация.</>,
        <>
          Он эффективнее grid из-за <strong>низкой эффективной размерности</strong> (важны лишь
          немногие оси).
        </>,
        <>
          На <Math display={false}>{String.raw`N`}</Math> испытаниях random покрывает{" "}
          <Math display={false}>{String.raw`N`}</Math> значений важной оси, grid — лишь{" "}
          <Math display={false}>{String.raw`k`}</Math>.
        </>,
        <>Random search — обязательный baseline; его слабость в том, что он не учится на истории.</>,
      ]}
    />
  </>
);

export default Section4;
