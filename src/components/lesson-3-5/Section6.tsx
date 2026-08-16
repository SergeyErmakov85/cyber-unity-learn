import Math from "@/components/Math";
import {
  SECTION_TITLE_CLASS,
  ProseP,
  KeyPoints,
  Callout,
  InteractiveStub,
  Code,
} from "./_shared";

const Section6 = () => (
  <>
    <h2 id="razdel-6-performance" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 6. Производительность инференса: CPU, GPU и сотня агентов
    </h2>

    <ProseP>Главный контринтуитивный факт деплоя ML-Agents:</ProseP>

    <Callout title="Тезис" color="cyan">
      <strong>Для большинства моделей ML-Agents CPU быстрее GPU.</strong> GPU оправдан только если
      вы используете <strong>ResNet</strong>-энкодер для зрения или у вас <strong>много агентов с
      визуальными наблюдениями</strong>.
    </Callout>

    <ProseP>
      Почему так? Политики ML-Agents обычно крошечные (несколько полносвязных слоёв на сотню-другую
      входов). Прогнать такую сеть на CPU — микросекунды. А вот закинуть данные на GPU, дождаться
      синхронизации и забрать обратно — это накладные расходы, которые на маленькой сети{" "}
      <strong>больше самого вычисления</strong>. GPU выигрывает там, где есть тяжёлый параллелизм
      (свёртки по картинке), а не на трёх Dense-слоях.
    </ProseP>

    <ProseP>
      Прикинем бюджет кадра. Если инференс синхронный и{" "}
      <Math display={false}>{String.raw`N`}</Math> агентов думают в одном кадре, суммарное время не
      должно съедать кадровый бюджет:
    </ProseP>

    <Math display>{String.raw`N \cdot t_{\text{inf}} \;\lesssim\; \frac{1}{\enfFun{f}_{\text{target}}} \cdot \enfPar{\beta}`}</Math>

    <ProseP>
      где <Math display={false}>{String.raw`t_{\text{inf}}`}</Math> — время одного прямого прохода,{" "}
      <Math display={false}>{String.raw`\enfFun{f}_{\text{target}}`}</Math> — целевой FPS,{" "}
      <Math display={false}>{String.raw`\enfPar{\beta}`}</Math> — доля кадра, которую вы готовы отдать под ИИ
      (скажем, <Math display={false}>{String.raw`\enfPar{\beta} = 0.2`}</Math>). При 60 FPS весь кадр —{" "}
      <Math display={false}>{String.raw`\approx 16.7`}</Math> мс; если{" "}
      <Math display={false}>{String.raw`\enfPar{\beta}=0.2`}</Math>, на весь ИИ есть{" "}
      <Math display={false}>{String.raw`\approx 3.3`}</Math> мс. Отсюда два рычага снижения нагрузки:
    </ProseP>

    <ol className="space-y-2 my-4 list-decimal list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>Увеличить Decision Period</strong>{" "}
        <Math display={false}>{String.raw`d`}</Math> (Раздел 5) — реже думать. Самый дешёвый
        выигрыш.
      </li>
      <li>
        <strong>Разнести решения агентов по кадрам</strong> — не дёргать всех в один кадр (разные
        фазы Decision Requester).
      </li>
    </ol>

    <ProseP>И ещё про сам билд:</ProseP>

    <ul className="space-y-2 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>Scripting Backend: IL2CPP</strong> обычно даёт более быстрый инференс, чем{" "}
        <strong>Mono</strong>, в standalone-сборках. Для релиза выбирайте IL2CPP.
      </li>
      <li>
        В <strong>редакторе</strong> инференс на <strong>GPU невозможен</strong>, если Editor
        Graphics Emulation выставлен в OpenGL(ES) 3.0/2.0 — тестируйте устройство в реальном билде,
        а не только в Play Mode.
      </li>
    </ul>

    <InteractiveStub title="Виджет «бюджет инференса»">
      Слайдеры <Math display={false}>{String.raw`N`}</Math> (число агентов),{" "}
      <Math display={false}>{String.raw`\enfFun{f}_{\text{target}}`}</Math>,{" "}
      <Math display={false}>{String.raw`d`}</Math> (Decision Period), переключатель CPU/GPU с
      разными <Math display={false}>{String.raw`t_{\text{inf}}`}</Math>. Вывод — закрашенная полоса
      «занятая доля кадра» (зелёная/жёлтая/красная).
    </InteractiveStub>

    <KeyPoints
      items={[
        <>
          Для типовых ML-Agents-сетей <strong>CPU быстрее GPU</strong>; GPU — только под
          ResNet-зрение / много визуальных агентов.
        </>,
        <>
          Бюджет кадра: <Math display={false}>{String.raw`N \cdot t_{\text{inf}}`}</Math> должно
          умещаться в отведённую долю кадра.
        </>,
        <>Снижают нагрузку: больший Decision Period и разнесение решений по кадрам.</>,
        <>
          Для релиза — <Code>IL2CPP</Code>; в редакторе GPU-инференс ломается на OpenGL
          ES-эмуляции.
        </>,
      ]}
    />
  </>
);

export default Section6;
