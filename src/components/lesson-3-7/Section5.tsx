import Math from "@/components/Math";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, InteractiveStub } from "./_shared";

const Section5 = () => (
  <>
    <h2 id="razdel-5-attention" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 5. Внимание: наблюдения переменной длины
    </h2>

    <ProseP>
      Сколько машин-соперников видит наш агент? На старте — десять, в конце круга — одну. Число
      сущностей <strong>меняется</strong>, а MLP требует входа фиксированной длины. Костыли (паддинг
      до максимума, усреднение) либо теряют информацию, либо тратят её впустую. Правильный
      инструмент — <strong>внимание (attention)</strong>.
    </ProseP>

    <ProseP>
      Хорошая новость: его механику вы уже разбирали. В MA-POCA self-attention использовался, чтобы
      агрегировать переменное число товарищей по команде (
      <CrossLinkToLesson
        lessonId="3.2"
        lessonPath="/courses/3-2"
        lessonTitle="Урок 3.2 — MA-POCA"
        lessonLevel={3}
      >
        урок 3.2, раздел про self-attention
      </CrossLinkToLesson>
      ). Здесь — ровно тот же механизм, но в роли <strong>энкодера наблюдений</strong> одного
      агента: каждая видимая машина кодируется в «сущность»-эмбеддинг{" "}
      <Math display={false}>{String.raw`e_i`}</Math>, а слой внимания сжимает их множество{" "}
      <Math display={false}>{String.raw`\{e_1,\dots,e_K\}`}</Math> в один вектор{" "}
      <Math display={false}>{String.raw`z`}</Math> независимо от{" "}
      <Math display={false}>{String.raw`K`}</Math>:
    </ProseP>

    <Math>
      {String.raw`\enfVar{z} = \mathrm{Attention}(\enfOp{Q}, K, \enfOp{V}) = \mathrm{softmax}\!\Big(\frac{QK^\top}{\sqrt{d_k}}\Big)\enfOp{V} .`}
    </Math>

    <ProseP>
      Ключевое свойство, которое нам и нужно: результат <strong>инвариантен к числу и порядку</strong>{" "}
      входных сущностей. Агент сам учится «смотреть» на ближайшего соперника впереди и игнорировать
      отставших. Полный вывод scaled dot-product attention и его сложности — в хабе ↗{" "}
      <CrossLinkToHub hubPath="/deep-rl" hubTitle="Deep RL">
        /deep-rl
      </CrossLinkToHub>
      ; мы здесь его <strong>не повторяем</strong> (см. урок 3.2).
    </ProseP>

    <InteractiveStub title="Интерактив: внимание над множеством сущностей">
      Сцена сверху: агент и переменное число машин-сущностей (слайдер{" "}
      <Math display={false}>{String.raw`K`}</Math> от 1 до 10). При наведении на агента — подсветка
      весов внимания на каждую машину (толщина/яркость линии). Демонстрирует инвариантность к{" "}
      <Math display={false}>{String.raw`K`}</Math> и к перестановке. JSX/React, статичные элементы —
      inline SVG, флаги анимации — в <code>useRef</code>.
    </InteractiveStub>

    <KeyPoints
      items={[
        <>Переменное число сущностей (соперники, препятствия) ломает MLP → нужен <strong>энкодер на внимании</strong>.</>,
        <>
          Это <strong>тот же</strong> self-attention, что в MA-POCA (
          <CrossLinkToLesson
            lessonId="3.2"
            lessonPath="/courses/3-2"
            lessonTitle="Урок 3.2"
            lessonLevel={3}
          >
            урок 3.2
          </CrossLinkToLesson>
          ), но как энкодер наблюдений одного агента.
        </>,
        <>Внимание <strong>инвариантно к числу и порядку</strong> сущностей — то, чего не умеет MLP.</>,
        <>Формальный вывод вынесен в хаб; в уроке — только применение.</>,
      ]}
    />
  </>
);

export default Section5;
