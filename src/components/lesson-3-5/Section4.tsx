import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Callout, Code } from "./_shared";

const SNIP = `using Unity.MLAgents.Policies;
// modelAsset — ссылка на импортированный .onnx (тип NNModel / ModelAsset
// в зависимости от версии тулкита — смотрите тип поля Model в инспекторе)
behaviorParameters.SetModel("RaceAgent", modelAsset, InferenceDevice.CPU);`;

const Section4 = () => (
  <>
    <h2 id="razdel-4-embedding" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 4. Встраивание: Behavior Parameters → Model → Inference Device
    </h2>

    <ProseP>
      Вот центральный, почти до обидного простой шаг. Чтобы агент в билде думал по обученной
      политике:
    </ProseP>

    <ol className="space-y-3 my-4 list-decimal list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        Перетащите <Code>RaceAgent.onnx</Code> из <Code>results/race_v7/</Code> в папку проекта
        (например <Code>Assets/Models/</Code>). Unity сам импортирует его как ассет модели.
      </li>
      <li>
        Выберите ваш префаб агента → компонент <strong>Behavior Parameters</strong> → поле{" "}
        <strong>Model</strong>. Перетащите туда импортированный ассет.
      </li>
      <li>
        Рядом — выпадающий список <strong>Inference Device</strong>: <strong>CPU</strong> или{" "}
        <strong>GPU</strong>. Выберите устройство (про выбор — Раздел 6).
      </li>
      <li>
        Убедитесь, что <strong>Behavior Name</strong> в Behavior Parameters совпадает с именем, под
        которым обучалась модель (для нас — <Code>RaceAgent</Code>). Имя — часть контракта.
      </li>
    </ol>

    <ProseP>Всё. Запустите сцену без Python — агент поедет по обученной политике.</ProseP>

    <ProseP>
      Для <strong>рантайм-подмены</strong> модели (например, разные уровни сложности ИИ-соперников
      из одного билда) есть программный путь:
    </ProseP>

    <CyberCodeBlock language="csharp" filename="SwapModel.cs">
      {SNIP}
    </CyberCodeBlock>

    <Callout title="🔗 Связь с проектом" color="cyan">
      Поле <strong>Model</strong> — это тот же агент из{" "}
      <CrossLinkToHub hubPath="/courses/project-3" hubTitle="Проект 3 — гоночный агент">
        Проекта 3
      </CrossLinkToHub>
      , которого вы кодили в{" "}
      <CrossLinkToHub
        hubPath="/courses/3-1"
        hubAnchor="раздел-0-от-гоночного-агента-к-sac"
        hubTitle="Урок 3.1 — MDP и агент"
      >
        ↩ Уроке 3.1
      </CrossLinkToHub>
      . Менялась начинка сети; точка её подключения к игре — ровно это поле.
    </Callout>

    <Callout
      title="⚠️ Не задавайте InferenceDevice / Model напрямую «на горячую»"
      color="amber"
    >
      Документация прямо предупреждает: эти свойства не следует менять в рантайме присваиванием —
      используйте <Code>SetModel(...)</Code>, иначе агент может остаться с прежним воркером.
    </Callout>

    <KeyPoints
      items={[
        <>
          Встраивание = перетащить <Code>.onnx</Code> в поле <strong>Model</strong> компонента
          Behavior Parameters.
        </>,
        <>
          <strong>Behavior Name</strong> агента обязан совпадать с именем обученного поведения.
        </>,
        <>
          <strong>Inference Device</strong> (CPU/GPU) выбирается тут же, рядом с полем Model.
        </>,
        <>
          Смена модели в рантайме — только через{" "}
          <Code>SetModel(behaviorName, model, device)</Code>, не прямым присваиванием.
        </>,
      ]}
    />
  </>
);

export default Section4;
