import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Callout, Code } from "./_shared";

const Section3 = () => (
  <>
    <h2 id="razdel-3-inference-engine" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 3. Инференс-движок Unity: кто на самом деле крутит сеть
    </h2>

    <ProseP>
      Когда агент в собранной игре «думает», кто-то должен взять веса из <Code>.onnx</Code>,
      прогнать через них наблюдения и вернуть действия — без Python, прямо в рантайме движка. Этим
      занимается <strong>инференс-движок Unity</strong>.
    </ProseP>

    <ProseP>
      У этого движка богатая история имён, и в гайдах вы встретите все три — важно не запутаться:
    </ProseP>

    <ul className="space-y-3 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>Barracuda</strong> — первое поколение (legacy). Именно его упоминали старые
        туториалы по ML-Agents. Сейчас <strong>снят с поддержки</strong>.
      </li>
      <li>
        <strong>Sentis</strong> — следующее поколение, переписанное на compute-шейдеры; именно его
        ML-Agents 4.0.x использует внутри (версия Sentis <Code>1.2.0-exp.2</Code>).
      </li>
      <li>
        <strong>Unity Inference Engine</strong> (<Code>com.unity.ai.inference</Code>) — текущее
        официальное имя того же движка после ребрендинга Sentis. Документация переехала на страницу{" "}
        <Code>com.unity.ai.inference</Code>.
      </li>
    </ul>

    <ProseP>
      Хорошая новость:{" "}
      <strong>для типового ML-Agents-проекта вам не нужно писать код инференса вообще</strong>.
      ML-Agents уже тащит движок как зависимость и сам грузит вашу <Code>.onnx</Code>, создаёт
      «воркер», прогоняет наблюдения и раздаёт действия. Прямой Sentis-API (
      <Code>ModelLoader.Load</Code>, <Code>new Worker(...)</Code>, <Code>Schedule</Code>,{" "}
      <Code>PeekOutput</Code>) нужен только если вы запускаете <strong>постороннюю</strong> сеть
      (например, YOLO для зрения) <strong>в обход</strong> ML-Agents.
    </ProseP>

    <Callout title="⚠️ Граница ответственности" color="amber">
      ML-Agents грузит <strong>только</strong> модели, обученные его же тренерами: загрузчик ждёт
      строгих соглашений об именах тензоров и константах. Чужую <Code>.onnx</Code> через Behavior
      Parameters скормить не выйдет — для неё нужен прямой Inference Engine. Не пытайтесь
      «подсунуть» произвольную сеть агенту.
    </Callout>

    <KeyPoints
      items={[
        <>Инференс в билде делает встроенный движок Unity, не Python.</>,
        <>
          Линейка имён: <strong>Barracuda</strong> (legacy) → <strong>Sentis</strong> →{" "}
          <strong>Unity Inference Engine</strong> — это эволюция одного движка.
        </>,
        <>
          В обычном ML-Agents-проекте код инференса писать не нужно — движок подключён и работает «из
          коробки».
        </>,
        <>
          Прямой API движка — только для сторонних сетей; ML-Agents грузит лишь модели своих
          тренеров.
        </>,
      ]}
    />
  </>
);

export default Section3;
