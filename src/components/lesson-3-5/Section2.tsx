import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Callout, Code } from "./_shared";

const TREE = `results/
  race_v7/
    RaceAgent.onnx              ← ФИНАЛЬНАЯ модель (последний чекпойнт)
    RaceAgent/                  ← папка поведения
      RaceAgent-499998.onnx     ← промежуточные чекпойнты (.onnx)
      RaceAgent-499998.pt       ← чекпойнт PyTorch (для --resume / дообучения)
      checkpoint.pt
      ...
    run_logs/                   ← тайминги, метрики
    configuration.yaml          ← полный конфиг прогона
    events.out.tfevents...      ← данные для TensorBoard`;

const Section2 = () => (
  <>
    <h2 id="razdel-2-checkpoints" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 2. Где живёт модель: чекпойнты, <code>results/</code> и финальный <code>.onnx</code>
    </h2>

    <ProseP>
      Запуская обучение, вы указали <Code>--run-id</Code>, например <Code>race_v7</Code>. Всё, что
      тренер произвёл, лежит под:
    </ProseP>

    <CyberCodeBlock language="text" filename="results/ — структура">
      {TREE}
    </CyberCodeBlock>

    <ProseP>Что здесь важно для деплоя:</ProseP>

    <ul className="space-y-3 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>Финальный файл</strong> — <Code>results/&lt;run-id&gt;/&lt;behavior_name&gt;.onnx</Code>.
        Имя <Code>&lt;behavior_name&gt;</Code> — это <strong>Behavior Name</strong>, который вы
        задали в Behavior Parameters агента (для нас — <Code>RaceAgent</Code>). Этот файл
        соответствует <strong>последнему чекпойнту</strong> обучения.
      </li>
      <li>
        Финальный <Code>.onnx</Code> генерируется <strong>один раз</strong> — когда обучение
        завершилось штатно <strong>или</strong> когда вы прервали его через <strong>Ctrl+C</strong>{" "}
        (один раз, и подождите, пока модель допишется на диск).
      </li>
      <li>
        Промежуточные чекпойнты пишутся каждые <Code>checkpoint_interval</Code> шагов опыта (по
        умолчанию <strong>500&nbsp;000</strong>), и одновременно с <Code>.pt</Code> тренер кладёт{" "}
        <Code>.onnx</Code>-снимок. Хранится максимум <Code>keep_checkpoints</Code> штук (по умолчанию{" "}
        <strong>5</strong>), старые удаляются.
      </li>
      <li>
        Возобновить прогон — флаг <Code>--resume</Code> с тем же <Code>run-id</Code>; перезатереть
        существующий прогон — <Code>--force</Code>; стартовать с весов другого прогона —{" "}
        <Code>initialize_from</Code> в секции <Code>checkpoint_settings</Code>.
      </li>
    </ul>

    <ProseP>
      Полная таблица полей <Code>checkpoint_settings</Code> и <Code>network_settings</Code> — в
      хабе:{" "}
      <CrossLinkToHub
        hubPath="/unity-ml-agents"
        hubAnchor="yaml-config"
        hubTitle="Unity ML-Agents — YAML-конфигурация"
      >
        ↗ Хаб: Unity ML-Agents → YAML-конфигурация
      </CrossLinkToHub>
      . Здесь нам нужен только сам факт: финальный артефакт деплоя — это{" "}
      <strong>один конкретный <Code>.onnx</Code></strong>, и его адрес предсказуем.
    </ProseP>

    <Callout title="💡 Практика" color="purple">
      Промежуточные чекпойнты — не балласт. Иногда модель на 80% обучения едет аккуратнее, чем
      «дожатая» финальная (переобучение под рандомизацию, деградация под GAIL). Перед деплоем не грех
      взять 2–3 поздних чекпойнта и сравнить их в билде глазами.
    </Callout>

    <KeyPoints
      items={[
        <>
          Финал — всегда <Code>results/&lt;run-id&gt;/&lt;behavior_name&gt;.onnx</Code>; имя берётся
          из <strong>Behavior Name</strong> агента.
        </>,
        <>
          Финальный <Code>.onnx</Code> пишется при завершении или одном Ctrl+C; дождитесь записи на
          диск.
        </>,
        <>
          Чекпойнты: каждые <Code>checkpoint_interval</Code> (деф. 500000) шагов, хранится{" "}
          <Code>keep_checkpoints</Code> (деф. 5).
        </>,
        <>
          <Code>.pt</Code> нужен для <Code>--resume</Code>/дообучения; <Code>.onnx</Code> — для
          деплоя. Это разные файлы с разной судьбой.
        </>,
      ]}
    />
  </>
);

export default Section2;
