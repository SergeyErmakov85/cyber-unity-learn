import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Callout, Code } from "./_shared";

const Section7 = () => (
  <>
    <h2 id="razdel-7-build" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 7. Сборка билда и платформенные тонкости
    </h2>

    <ProseP>
      <Code>.onnx</Code> встроен в агента как ассет, поэтому при <strong>Build</strong> он
      автоматически попадает в плеер — никаких отдельных «положить модель рядом с exe» не требуется
      (в отличие от старого Barracuda, где модель таскали как <Code>.bytes</Code> в
      StreamingAssets). Что держать в голове:
    </ProseP>

    <ul className="space-y-3 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>Compute-шейдеры.</strong> Движок крутит сеть на compute-шейдерах. Если целевая
        графическая подсистема платформы их не поддерживает, на этапе сборки возможны{" "}
        <strong>некритичные</strong> ошибки/предупреждения — проверяйте, что выбранный Graphics API
        совместим.
      </li>
      <li>
        <strong>WebGL.</strong> Самый капризный таргет: GPU-бэкенд там ограничен, инференс часто
        уходит на CPU (а в вебе он медленнее). Закладывайте больший Decision Period и тестируйте FPS
        прямо в браузере.
      </li>
      <li>
        <strong>Мобайл (Android/iOS).</strong> Бюджет ещё жёстче, чем на десктопе; начинайте с CPU +
        большого <em>d</em>, профилируйте на <strong>реальном устройстве</strong>, а не на
        эмуляторе.
      </li>
      <li>
        <strong>Детерминизм между платформами.</strong> Не ждите бит-в-бит одинаковых действий на
        разных GPU/драйверах — порядок операций с плавающей точкой может слегка отличаться. Если
        нужна строгая воспроизводимость — детерминированный CPU-инференс надёжнее.
      </li>
    </ul>

    <Callout title="🔗 Связь с уроком 3.3" color="cyan">
      Вот где окупается доменная рандомизация (
      <CrossLinkToHub
        hubPath="/courses/3-3"
        hubAnchor="razdel-1-domain-randomization"
        hubTitle="Урок 3.3 — Domain Randomization"
      >
        ↩ Урок 3.3
      </CrossLinkToHub>
      ): агент, обученный на разбросе физики и текстур, спокойнее переживает то, что в билде тайминги
      и рендер чуть другие, чем в тренировочной сцене. Без неё «sim-to-deploy gap» бьёт больнее.
    </Callout>

    <KeyPoints
      items={[
        <>
          <Code>.onnx</Code> встроен как ассет и едет в билд автоматически — отдельный файл рядом с
          плеером не нужен.
        </>,
        <>
          Движок использует compute-шейдеры; следите за совместимостью Graphics API целевой
          платформы.
        </>,
        <>
          WebGL и мобайл — самые ограниченные по бюджету; больше Decision Period, профиль на
          реальном устройстве.
        </>,
        <>
          Бит-в-бит детерминизма между платформами нет; строгая воспроизводимость —
          детерминированный CPU-инференс.
        </>,
      ]}
    />
  </>
);

export default Section7;
