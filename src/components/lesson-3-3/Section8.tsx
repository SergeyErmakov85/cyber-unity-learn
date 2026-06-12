import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints } from "./_shared";

const chip = "px-1 rounded bg-muted/50 text-xs font-mono";

const Section8 = () => (
  <>
    <h2 id="razdel-8-tyuning-grabli" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 8. Тюнинг, грабли и диагностика
    </h2>

    <ProseP>Соберём практические правила — что крутить и как читать симптомы.</ProseP>

    <h3 className={H3_CLASS}>Учебный план:</h3>
    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Порог слишком высок</strong> → урок никогда не переключается (агент «застрял» на L0).
          Симптом: номер урока не растёт месяцами. Снижайте <code className={chip}>threshold</code> или
          проверьте, достижима ли награда на этом уроке вообще.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Порог слишком низок / <code className={chip}>min_lesson_length</code> мал</strong> →
          переход до настоящего освоения, на следующем уроке награда обваливается. Симптом: «зубец» вниз
          сразу после смены урока. Поднимите порог и/или <code className={chip}>min_lesson_length</code>.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Резкая смена раскладки</strong> (геометрия трассы) → ставьте{" "}
          <code className={chip}>require_reset: true</code>, иначе агент доигрывает эпизод в
          «полусломанной» сцене.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Катастрофическое забывание</strong> (раздел 2) → не выкидывайте простые уроки целиком:
          оставляйте на каждом уровне немного рандомизации или подмешивайте лёгкие конфигурации.
        </span>
      </li>
    </ul>

    <h3 className={H3_CLASS}>Рандомизация:</h3>
    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Слишком широкая и сразу</strong> → флэт награды и <strong>чрезмерно осторожная</strong>{" "}
          политика (медленная езда). Лечится <strong>расписанием</strong> (ADR): расширяйте диапазоны
          постепенно, а не открывайте всё сразу.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Слишком узкая</strong> → отличная награда на обучении, провал на новых трассах: вы
          переобучились. Расширяйте <Math display={false}>{String.raw`p(c)`}</Math> или добавьте больше
          сидов.
        </span>
      </li>
    </ul>

    <ProseP>
      <strong>Диагностика обобщения (главное):</strong> ведите <strong>две</strong> кривые — награду на
      обучающих контекстах и на <strong>отложенном</strong> наборе трасс, которые агент в обучении не
      видел. Их расхождение и есть разрыв обобщения из раздела 4. Удобно держать отдельный eval-прогон и
      сравнивать в W&B — см.{" "}
      <CrossLinkToHub hubPath="/courses/2-6" hubTitle="Урок 2.6 — TensorBoard и W&B">
        урок 2.6
      </CrossLinkToHub>
      . Без отдельного теста вы <strong>не увидите</strong> переобучения: на обучающих трассах всё будет
      прекрасно ровно до того дня, когда агент выедет на новую.
    </ProseP>

    <KeyPoints
      items={[
        <>
          Порог высок → не переключается; низок → обвал после смены урока; меняете раскладку →{" "}
          <code className={chip}>require_reset: true</code>.
        </>,
        <>
          Рандомизация слишком широкая → осторожная политика (чините расписанием ADR); слишком узкая →
          переобучение.
        </>,
        <>
          <strong>Всегда</strong> держите отдельный <strong>отложенный тест-набор</strong> трасс: разрыв
          train/test — единственный честный детектор переобучения (
          <CrossLinkToHub hubPath="/courses/2-6" hubTitle="Урок 2.6 — TensorBoard и W&B">
            урок 2.6
          </CrossLinkToHub>
          ).
        </>,
      ]}
    />
  </>
);

export default Section8;
