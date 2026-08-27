import CrossLinkToHub from "@/components/CrossLinkToHub";
import {
  SECTION_TITLE_CLASS,
  ProseP,
  KeyPoints,
  InteractiveStub,
  Code,
} from "./_shared";

const Section8 = () => (
  <>
    <h2 id="razdel-8-diagnostics" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 8. Диагностика деплоя: самый частый класс ошибок
    </h2>

    <ProseP>
      Если агент в билде «тупит», крутится на месте или едет в стену, причина почти никогда не в
      самой сети. Почти всегда это <strong>рассинхрон контракта</strong> между агентом, для которого
      модель обучалась, и агентом в сцене деплоя.
    </ProseP>

    <ProseP>
      <strong>Проверочный список (в порядке частоты):</strong>
    </ProseP>

    <ol className="space-y-3 my-4 list-decimal list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>Рассинхрон пространства наблюдений.</strong> Сеть обучалась на векторе наблюдений
        длины <em>n</em>, а агент в сцене собирает <em>n′ ≠ n</em> (добавили/убрали сенсор, поменяли
        число лучей у RayPerceptionSensor, изменили Stacked Vectors). Загрузчик сверяет размерности;
        при несовпадении модель либо не примет, либо «поедет» по мусору.{" "}
        <strong>Space Size и набор сенсоров в деплое обязаны совпадать с обучением.</strong>
      </li>
      <li>
        <strong>Рассинхрон пространства действий.</strong> Число непрерывных действий и ветви
        дискретных (Branches) должны быть теми же, что при обучении.
      </li>
      <li>
        <strong>Несовпадение Behavior Name.</strong> Имя в Behavior Parameters не совпадает с именем
        обученного поведения → модель не привяжется.
      </li>
      <li>
        <strong>Другой Decision Period.</strong> Политику обучали при <em>d=5</em>, а в деплое
        поставили <em>d=1</em> → агент дёргается; при <em>d=20</em> → «спит». Темп решений должен
        совпасть.
      </li>
      <li>
        <strong>Забыли Inference Only / нет модели.</strong> В режиме Default без модели агент молча
        падает в эвристику — и едет «как в ручном», то есть никак.
      </li>
      <li>
        <strong>Перепутанные оси/нормализация наблюдений.</strong> Если при обучении была
        нормализация (<Code>normalize: true</Code>), движок применит её по сохранённым статистикам —
        но только если наблюдения собираются тем же кодом. Меняли <Code>CollectObservations</Code>{" "}
        после обучения — переобучайте.
      </li>
    </ol>

    <ProseP>
      <strong>Как ловить.</strong> Включите в билде логи (или Development Build), смотрите на
      предупреждения загрузчика модели при старте сцены — несовпадение размерностей почти всегда
      печатается явно. Кривые из обучения и «здравость» поведения сверяйте по тем же метрикам, что вы
      смотрели в TensorBoard (
      <CrossLinkToHub
        hubPath="/courses/2-6"
        hubAnchor="tensorboard"
        hubTitle="Урок 2.6 — TensorBoard"
      >
        ↩ Урок 2.6
      </CrossLinkToHub>
      ).
    </ProseP>

    <InteractiveStub title="«Контракт модели»">
      Две колонки — <em>Обучение</em> и <em>Деплой</em> — с полями Space Size, Stacked Vectors,
      число лучей сенсора, непрерывные/дискретные действия, Behavior Name, Decision Period.
      Несовпадающие строки подсвечиваются красным с подсказкой-фиксом.
    </InteractiveStub>

    <KeyPoints
      items={[
        <>
          95% проблем деплоя — <strong>рассинхрон контракта</strong> наблюдений/действий, а не
          «плохая сеть».
        </>,
        <>
          Space Size, набор сенсоров, Stacked Vectors, ветви действий, Behavior Name, Decision
          Period в деплое = как при обучении.
        </>,
        <>
          Меняли <Code>CollectObservations</Code> или нормализацию после обучения — модель надо
          переобучить.
        </>,
        <>
          Development Build + логи загрузчика при старте сцены ловят несовпадение размерностей явно.
        </>,
      ]}
    />
  </>
);

export default Section8;
