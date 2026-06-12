import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Code } from "./_shared";

const Section8 = () => (
  <>
    <h2 id="razdel-8-pipeline" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 8. Практический пайплайн для гоночного агента
    </h2>

    <ProseP>
      Собираем всё вместе — теория из разделов 1–4 + YAML из 6 + диагностика из 7 — в пять шагов
      сквозного эксперимента.
    </ProseP>

    <ol className="space-y-4 my-4 text-[15px] text-foreground/90 leading-relaxed list-decimal pl-5">
      <li>
        <strong>Запись демо.</strong> Включите <Code>Demonstration Recorder</Code> на агенте,
        проезжайте трассу <strong>в том же режиме управления, что и у агента</strong> (непрерывные
        руль и газ через <Code>Heuristic()</Code>/контроллер, чтобы пространства действий совпадали).
        Снимайте <strong>разнообразные</strong> заезды: разные скорости, линии прохождения,
        восстановления после ошибок (заезд на обочину и возврат) — это частично лечит covariate
        shift. Для GAIL хватает <strong>единиц–десятков заездов</strong> (порядок десятков тысяч
        переходов); для самостоятельного BC нужно <strong>существенно больше</strong>.
      </li>
      <li>
        <strong>BC-warmup.</strong> Включите <Code>behavioral_cloning</Code> со{" "}
        <Code>strength ≈ 0.3–0.5</Code> и <Code>steps ≈ 100k–500k</Code>. Это быстро поднимает
        политику с нуля до разумной езды до того, как extrinsic-награда станет осмысленной. После{" "}
        <Code>steps</Code> BC отключается автоматически.
      </li>
      <li>
        <strong>PPO + GAIL + extrinsic.</strong> Дальше PPO дообучает с{" "}
        <Code>reward_signals: gail</Code> (умеренно-низкий <Code>strength</Code>; при человеческих
        демо — <strong>0.01–0.1</strong>) <strong>плюс</strong> <Code>extrinsic</Code> (чекпойнты/
        финиш + shaping из{" "}
        <CrossLinkToHub hubPath="/courses/project-3" hubTitle="Проект 3 — гоночный агент">
          Проекта 3
        </CrossLinkToHub>
        ). GAIL задаёт «стиль» (плавные траектории, торможение в поворотах), extrinsic — цель.
        Начинайте с <Code>use_actions: false</Code> (state-only — стабильнее), переключайте на{" "}
        <Code>true</Code>, только если нужно копировать именно манеру руления.
      </li>
      <li>
        <strong>Сочетание с domain randomization (
        <CrossLinkToHub hubPath="/courses/3-3" hubTitle="Урок 3.3 — Curriculum & Randomization">
          урок 3.3
        </CrossLinkToHub>
        ).</strong> Демо записаны на <strong>одной</strong> трассе, а обучение идёт на{" "}
        <strong>рандомизированных</strong> (<Code>environment_parameters</Code>: ширина/кривизна,
        трение, число поворотов; ADR/PLR из 3.3). Разделение ролей:{" "}
        <strong>GAIL отвечает за «стиль»</strong> (как ехать), <strong>рандомизация — за
        робастность</strong> (где ехать).
      </li>
      <li>
        <strong>Грабли баланса <Code>strength</Code>.</strong> Слишком <strong>большой</strong>{" "}
        GAIL-<Code>strength</Code> → политика копирует стиль, но <strong>забывает цель</strong> (не
        финиширует, survivor bias усиливается). Слишком <strong>малый</strong> → GAIL не вносит
        ничего, остаётся чистый PPO. Калибруйте по TensorBoard: если{" "}
        <Code>Environment/Cumulative Reward</Code> стагнирует, а <Code>GAIL Reward</Code> высокий —
        снижайте; если агент игнорирует стиль — повышайте.
      </li>
    </ol>

    <KeyPoints
      items={[
        <>
          Канонический порядок: записать демо → BC-warmup (<Code>steps &gt; 0</Code>) → PPO + GAIL +
          extrinsic → наложить рандомизацию из урока 3.3.
        </>,
        <>
          State-only GAIL (<Code>use_actions: false</Code>) — стартовый дефолт; включайте{" "}
          <Code>true</Code> только если нужна именно манера действий.
        </>,
        <>
          Баланс <Code>gail.strength</Code> и <Code>extrinsic.strength</Code> калибруется по
          TensorBoard, а не «на глаз».
        </>,
      ]}
    />
  </>
);

export default Section8;
