import Math from "@/components/Math";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints, Callout } from "./_shared";

const Section2 = () => (
  <>
    <h2 id="razdel-2-irl" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 2. Inverse Reinforcement Learning — фундамент для GAIL
    </h2>

    <ProseP>
      <strong>Постановка.</strong> Вместо прямого копирования действий IRL{" "}
      <strong>восстанавливает функцию награды</strong>{" "}
      <Math display={false}>{String.raw`r(s,a)`}</Math> (или стоимости{" "}
      <Math display={false}>{String.raw`c(s,a)`}</Math>), под которой эксперт выглядит оптимальным, а
      затем извлекает политику обычным RL. Преимущество: награда «оценивает» целые траектории, поэтому
      compounding error одношаговых решений не возникает.
    </ProseP>

    <h3 className={H3_CLASS}>Краткая история</h3>
    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Ng &amp; Russell (2000)</strong> — постановка IRL и проблема{" "}
          <em>неоднозначности</em>: множество наград объясняют одно поведение.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Abbeel &amp; Ng (2004)</strong> — apprenticeship learning через{" "}
          <em>feature expectation matching</em>.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Ziebart, Maas, Bagnell, Dey (AAAI 2008) — Maximum Entropy IRL</strong> разрешает
          неоднозначность принципом максимальной энтропии. Распределение по траекториям:
          <Math display>
            {String.raw`p(\tau)\ =\ \frac{1}{Z}\exp(R_\theta(\tau)),\qquad R_\theta(\tau)=\sum_t R_\theta(s_t,a_t),\qquad Z=\sum_\tau \exp(R_\theta(\tau)).`}
          </Math>
          Параметры <Math display={false}>{String.raw`\theta`}</Math> находят максимизацией
          log-likelihood демонстраций (эквивалентно минимизации KL до max-entropy распределения).
        </span>
      </li>
    </ul>

    <Callout title="Почему IRL дорог" color="amber">
      Главная вычислительная боль — <strong>partition function</strong>{" "}
      <Math display={false}>Z</Math> и то, что для <strong>каждой</strong> кандидатной функции награды
      нужно решать <strong>полную внутреннюю RL-задачу</strong> до сходимости. Именно это GAIL и
      обходит, чередуя один шаг дискриминатора и один шаг политики.
    </Callout>

    <KeyPoints
      items={[
        <>
          IRL: восстановить награду эксперта и потом запустить под ней обычный RL.
        </>,
        <>
          Max-entropy IRL (Ziebart, 2008) — мост от классического IRL к GAIL: вероятность траектории{" "}
          <Math display={false}>{String.raw`\propto \exp(R(\tau))`}</Math>.
        </>,
        <>
          Узкое место — partition function и вложенный RL-цикл; ровно его GAIL заменяет GAN-чередованием.
        </>,
      ]}
    />
  </>
);

export default Section2;
