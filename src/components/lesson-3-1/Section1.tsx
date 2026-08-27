import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints, InteractiveStub } from "./_shared";

const Section1 = () => (
  <>
    <h2 className={SECTION_TITLE_CLASS}>
      Раздел 1. Принцип максимальной энтропии: зачем агенту быть случайным
    </h2>

    <h3 className={H3_CLASS}>Интуиция: две одинаково хорошие политики — какую выбрать?</h3>

    <ProseP>
      Пусть на нашей гоночной трассе есть два почти равноценных маршрута через поворот: чуть внутри и
      чуть снаружи. Обычный RL-агент, найдя один из них, «схлопнется» в детерминированную политику:
      всегда руль на <Math display={false}>{String.raw`+0.3`}</Math>. Это и есть жадность — агент
      эксплуатирует первое найденное хорошее решение и перестаёт исследовать.
    </ProseP>

    <ProseP>
      Теперь добавим к цели <strong>требование быть случайным</strong>. Тогда агент, видя, что оба
      маршрута дают почти одинаковую награду, распределит вероятность между ними. Получаем три выгоды:
    </ProseP>

    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong className="text-primary">Исследование.</strong> Пока агент не уверен, какое действие
        лучше, он пробует разные. Он не застревает в первом локальном оптимуме.
      </li>
      <li>
        <strong className="text-primary">Устойчивость (robustness).</strong> Если динамика среды
        слегка изменится (другое сцепление, ветер, шум сенсоров), у «широкой» политики уже есть
        запасные варианты. Детерминированная политика рассыпается.
      </li>
      <li>
        <strong className="text-primary">Многомодальность.</strong> Политика может удерживать сразу
        несколько хороших стратегий, а не одну.
      </li>
    </ul>

    <ProseP>
      Принцип максимальной энтропии формализует эту идею:{" "}
      <strong>
        среди всех политик, набирающих высокую награду, предпочитай наиболее случайную (наиболее
        энтропийную).
      </strong>
    </ProseP>

    <InteractiveStub title="Интерактив: карта действий и температура α">
      Двумерная карта действий <Math display={false}>{String.raw`a\in[-1,1]^2`}</Math>. Слайдер
      температуры <Math display={false}>{String.raw`\enfPar{\alpha}`}</Math>: при{" "}
      <Math display={false}>{String.raw`\enfPar{\alpha}\to 0`}</Math> распределение политики стягивается в одну
      точку (жадность), при росте <Math display={false}>{String.raw`\enfPar{\alpha}`}</Math> — расплывается к
      равномерному. Поверх — цветом «истинная»{" "}
      <Math display={false}>{String.raw`Q(s,a)`}</Math> с двумя пиками; видно, как при умеренном{" "}
      <Math display={false}>{String.raw`\enfPar{\alpha}`}</Math> политика покрывает оба пика (многомодальность).
    </InteractiveStub>

    <h3 className={H3_CLASS}>Что такое энтропия политики</h3>

    <ProseP>
      Энтропия распределения измеряет его «случайность»/неопределённость. Для политики{" "}
      <Math display={false}>{String.raw`\pi(\cdot \mid \enfVar{s})`}</Math> в состоянии{" "}
      <Math display={false}>{String.raw`s`}</Math>:
    </ProseP>

    <Math>{String.raw`\mathcal{\enfOp{H}}\big(\pi(\cdot \mid \enfVar{s})\big)
= \mathbb{E}_{a \sim \pi(\cdot\mid s)}\big[-\log \pi(a \mid \enfVar{s})\big]
= -\int_{\mathcal{A}} \pi(a\mid \enfVar{s})\,\log \pi(a\mid \enfVar{s})\,da .`}</Math>

    <ProseP>
      Чем «острее» распределение (вся масса в одной точке) — тем энтропия ниже (в пределе{" "}
      <Math display={false}>{String.raw`-\infty`}</Math> для непрерывного дельта-пика). Чем более
      распределение размазано — тем энтропия выше. Подробный разбор энтропии, её свойств и связи с
      информацией — в{" "}
      <CrossLinkToHub
        hubPath="/math-rl/module-3"
        hubAnchor="1-теория-вероятностей"
        hubTitle="Математика → Теория вероятностей и информации"
      >
        хабе по теории информации
      </CrossLinkToHub>
      .
    </ProseP>

    <KeyPoints
      items={[
        <>Жадный агент схлопывается в детерминизм и застревает.</>,
        <>Максимизация энтропии → исследование + устойчивость + многомодальность.</>,
        <>
          <Math display={false}>
            {String.raw`\mathcal{\enfOp{H}}(\pi(\cdot\mid \enfVar{s})) = \mathbb{E}_{a\sim\pi}[-\log\pi(a\mid \enfVar{s})]`}
          </Math>{" "}
          — «случайность» политики.
        </>,
      ]}
    />
  </>
);

export default Section1;
