import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import {
  SECTION_TITLE_CLASS,
  H3_CLASS,
  ProseP,
  KeyPoints,
  Callout,
  Anchor,
} from "./_shared";

const Section2 = () => (
  <>
    <h2 className={SECTION_TITLE_CLASS}>Раздел 2. Maximum-entropy RL objective</h2>

    <h3 className={H3_CLASS}>Стандартная цель против максэнтропийной</h3>

    <ProseP>Обычный RL ищет политику, максимизирующую ожидаемую сумму наград:</ProseP>

    <Math>{String.raw`J_{\text{std}}(\pi) = \sum_{t} \mathbb{E}_{(s_t,a_t)\sim\rho_\pi}\big[r(s_t,a_t)\big],`}</Math>

    <ProseP>
      где <Math display={false}>{String.raw`\rho_\pi`}</Math> — распределение состояний-действий,
      порождённое политикой <Math display={false}>{String.raw`\pi`}</Math>.
    </ProseP>

    <ProseP>
      SAC обобщает эту цель, <strong>добавляя в каждый момент времени бонус за энтропию</strong>:
    </ProseP>

    <Math>{String.raw`\boxed{\;
J(\pi) = \sum_{t=0}^{T} \mathbb{E}_{(s_t,a_t)\sim\rho_\pi}\Big[\, r(s_t,a_t) + \alpha\,\mathcal{H}\big(\pi(\cdot\mid s_t)\big)\,\Big]
\;}`}</Math>

    <ProseP>
      Это и есть <strong>maximum-entropy RL objective</strong> (уравнение (1) в обеих статьях
      Haarnoja). Разберём по частям:
    </ProseP>

    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <Math display={false}>{String.raw`r(s_t,a_t)`}</Math> — обычная награда среды.
      </li>
      <li>
        <Math display={false}>{String.raw`\alpha\,\mathcal{H}(\pi(\cdot\mid s_t))`}</Math> —{" "}
        <strong>бонус за энтропию</strong> на каждом шаге.
      </li>
      <li>
        <Math display={false}>{String.raw`\alpha`}</Math> — <strong>температура</strong>{" "}
        (temperature). Она задаёт, насколько важна случайность относительно награды.
      </li>
    </ul>

    <h3 className={H3_CLASS}>
      Роль температуры <Math display={false}>{String.raw`\alpha`}</Math>
    </h3>

    <ProseP>
      Температура — это «ручка» компромисса между эксплуатацией и исследованием:
    </ProseP>

    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <Math display={false}>{String.raw`\alpha \to 0`}</Math>: бонус за энтропию исчезает, и мы{" "}
        <strong>восстанавливаем обычный RL</strong>. Политика становится жадной/детерминированной.
      </li>
      <li>
        большие <Math display={false}>{String.raw`\alpha`}</Math>: энтропия доминирует, политика
        стремится к равномерной (исследует «вслепую»).
      </li>
      <li>
        умеренные <Math display={false}>{String.raw`\alpha`}</Math>: золотая середина — высокая
        награда при здоровой стохастичности.
      </li>
    </ul>

    <Callout title="Важная тонкость" color="amber">
      <p>
        В отличие от обычного RL, где оптимальная политика <strong>не зависит</strong> от масштаба
        награды, в максэнтропийном RL масштаб награды напрямую конкурирует с фиксированным{" "}
        <Math display={false}>{String.raw`\alpha`}</Math>. Умножьте все награды на 100 — и тот же{" "}
        <Math display={false}>{String.raw`\alpha`}</Math> станет «слишком слабым», политика почти
        детерминируется. Поэтому масштаб награды и{" "}
        <Math display={false}>{String.raw`\alpha`}</Math> нужно согласовывать. Эту проблему мы
        радикально решим в{" "}
        <Anchor to="раздел-7-автоматическая-подстройка-температуры-alpha">Разделе 7</Anchor>{" "}
        автоподстройкой <Math display={false}>{String.raw`\alpha`}</Math>.
      </p>
    </Callout>

    <Callout title="Энтропия — не регуляризатор, а часть цели" color="purple">
      <p>
        В PPO энтропия добавляется как небольшой <em>регуляризационный</em> штраф (коэффициент{" "}
        <code className="px-1 rounded bg-muted/50 text-xs font-mono">beta</code>), чтобы политика не
        схлопывалась слишком рано. В SAC энтропия встроена в саму <strong>определяющую цель</strong>{" "}
        на каждом шаге и протекает через функции ценности. Это разные вещи: PPO «слегка подмешивает»
        случайность, SAC «строит весь мир» вокруг неё. Разбор PPO-регуляризации — в{" "}
        <CrossLinkToHub
          hubPath="/algorithms/ppo"
          hubTitle="PPO → Энтропийная регуляризация"
        >
          хабе по PPO
        </CrossLinkToHub>
        .
      </p>
    </Callout>

    <KeyPoints
      items={[
        <>
          Цель SAC:{" "}
          <Math display={false}>
            {String.raw`J(\pi)=\sum_t \mathbb{E}[\,r + \alpha\mathcal{H}(\pi)\,]`}
          </Math>
          .
        </>,
        <>
          <Math display={false}>{String.raw`\alpha\to 0`}</Math> возвращает обычный RL.
        </>,
        <>
          Масштаб награды и <Math display={false}>{String.raw`\alpha`}</Math> связаны — это решит
          автоподстройка.
        </>,
        <>Энтропия здесь — часть цели, а не побочный регуляризатор как в PPO.</>,
      ]}
    />
  </>
);

export default Section2;
