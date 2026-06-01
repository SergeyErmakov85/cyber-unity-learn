import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints, InteractiveStub } from "./_shared";

const Section8 = () => (
  <>
    <h2 className={SECTION_TITLE_CLASS}>Раздел 8. Replay buffer и off-policy-природа</h2>

    <h3 className={H3_CLASS}>On-policy против off-policy</h3>

    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>On-policy (PPO):</strong> учиться можно только на данных, собранных{" "}
        <em>текущей</em> политикой. Обновил политику — старые данные стали невалидны, выбрасываем.
      </li>
      <li>
        <strong>Off-policy (SAC):</strong> учиться можно на данных, собранных <em>любой</em> прошлой
        версией политики. Значит, опыт можно копить и переиспользовать.
      </li>
    </ul>

    <ProseP>
      SAC — off-policy, потому что и критики, и политика обучаются на <strong>переходах</strong>{" "}
      <Math display={false}>{String.raw`(s_t, a_t, r_t, s_{t+1})`}</Math>, а не на целых траекториях,
      привязанных к конкретной политике. Цель для{" "}
      <Math display={false}>{String.raw`Q`}</Math> строится из перехода и текущей политики — старость
      данных не мешает. Более общий разбор on/off-policy — в{" "}
      <CrossLinkToHub
        hubPath="/deep-rl"
        hubAnchor="algorithms"
        hubTitle="Deep RL → On-policy vs Off-policy"
      >
        хабе по основам RL
      </CrossLinkToHub>
      .
    </ProseP>

    <h3 className={H3_CLASS}>Replay buffer</h3>

    <ProseP>
      Каждый прожитый переход складывается в большой кольцевой буфер{" "}
      <Math display={false}>{String.raw`\mathcal{D}`}</Math>:
    </ProseP>

    <Math>{String.raw`\mathcal{D} \leftarrow \mathcal{D} \cup \{(s_t, a_t, r_t, s_{t+1})\}.`}</Math>

    <ProseP>
      На каждом шаге обучения из <Math display={false}>{String.raw`\mathcal{D}`}</Math> берётся{" "}
      <strong>случайный мини-батч</strong> прошлых переходов, и по нему считаются градиенты{" "}
      <Math display={false}>{String.raw`J_Q`}</Math>, <Math display={false}>{String.raw`J_\pi`}</Math>
      , <Math display={false}>{String.raw`J(\alpha)`}</Math>. Зачем это нужно:
    </ProseP>

    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong className="text-primary">Экономия данных.</strong> Один переход участвует в
        обновлениях много раз — отсюда высокая sample efficiency.
      </li>
      <li>
        <strong className="text-primary">Декорреляция.</strong> Случайная выборка разрывает временную
        корреляцию подряд идущих кадров, что стабилизирует обучение нейросети.
      </li>
    </ul>

    <h3 className={H3_CLASS}>Прогрев буфера и соотношение «шаги/обновления»</h3>

    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>Прогрев (<code className="px-1 rounded bg-muted/50 text-xs font-mono">buffer_init_steps</code>).</strong>{" "}
        В начале политика случайна и бесполезна. Полезно сперва набрать в буфер несколько эпизодов{" "}
        <strong>случайными действиями</strong>, прежде чем начинать обучение — это улучшает раннее
        исследование.
      </li>
      <li>
        <strong>Update-to-data ratio (<code className="px-1 rounded bg-muted/50 text-xs font-mono">steps_per_update</code>).</strong>{" "}
        Сколько шагов среды приходится на одно обновление сетей. Меньше шагов на обновление → выше
        sample efficiency (учимся чаще), но дороже по CPU. Больше → дешевле считать, но нужно больше
        шагов среды.
      </li>
    </ul>

    <InteractiveStub title="Интерактив: жизнь перехода в буфере">
      Анимация буфера: ползут новые переходы справа, из буфера случайно «вспыхивают» сэмплы в
      мини-батч. Рядом счётчик: «переход переиспользован{" "}
      <Math display={false}>{String.raw`k`}</Math> раз». Сравнение с PPO, где каждый переход гаснет
      после одного использования — наглядно показывает экономию.
    </InteractiveStub>

    <KeyPoints
      items={[
        <>SAC off-policy: учится на переходах от любой прошлой политики.</>,
        <>
          Replay buffer <Math display={false}>{String.raw`\mathcal{D}`}</Math> копит переходы;
          обучение — на случайных мини-батчах.
        </>,
        <>Переиспользование опыта → экономия данных; случайная выборка → декорреляция.</>,
        <>Прогрев буфера случайными действиями помогает раннему исследованию.</>,
      ]}
    />
  </>
);

export default Section8;
