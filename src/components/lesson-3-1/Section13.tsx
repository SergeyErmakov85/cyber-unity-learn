import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Anchor } from "./_shared";

const Section13 = () => (
  <>
    <h2 className={SECTION_TITLE_CLASS}>Раздел 13. Связь с гоночным агентом: от PPO к SAC</h2>

    <ProseP>
      В{" "}
      <CrossLinkToHub hubPath="/courses/project-3" hubTitle="Проект 3 — Гоночный агент">
        предыдущем уроке
      </CrossLinkToHub>{" "}
      мы обучили гоночного агента на <strong>PPO</strong>. Что меняется, если переписать ту же задачу
      под SAC?
    </ProseP>

    <ul className="space-y-3 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>Наблюдения и действия — те же.</strong> Лучи-сенсоры, скорость, относительное
        положение трассы на входе; непрерывные руль и газ на выходе. SAC спокойно принимает тот же{" "}
        <code className="px-1 rounded bg-muted/50 text-xs font-mono">Behavior</code>.
      </li>
      <li>
        <strong>Reward shaping — тот же.</strong> PBRS-награды, штрафы за съезд, бонус за прогресс по
        трассе (см. разбор формирования наград в уроке про гоночного агента). SAC использует их через{" "}
        <code className="px-1 rounded bg-muted/50 text-xs font-mono">reward_signals → extrinsic</code>
        . Помните лишь, что SAC чувствителен к <strong>масштабу</strong> награды (см.{" "}
        <Anchor to="раздел-2-maximum-entropy-rl-objective">Раздел 2</Anchor>) — крупные награды
        масштабируйте <code className="px-1 rounded bg-muted/50 text-xs font-mono">strength</code>.
      </li>
      <li>
        <strong>Что нового приносит SAC:</strong> replay buffer (экономия дорогих кругов симуляции) и
        встроенное энтропийное исследование вместо ручной подстройки шума. Если PPO-агент «застревал»
        на одной линии прохождения поворота, SAC с большей вероятностью найдёт и удержит несколько
        хороших траекторий (многомодальность).
      </li>
      <li>
        <strong>Практический рецепт перехода:</strong> возьмите PPO-конфиг гоночного агента, замените
        блок <code className="px-1 rounded bg-muted/50 text-xs font-mono">hyperparameters</code> на
        SAC-вариант из{" "}
        <Anchor to="раздел-12-sac-в-unity-ml-agents">Раздела 12</Anchor>, включите{" "}
        <code className="px-1 rounded bg-muted/50 text-xs font-mono">normalize: true</code> и{" "}
        <code className="px-1 rounded bg-muted/50 text-xs font-mono">threaded: true</code>, поставьте{" "}
        <code className="px-1 rounded bg-muted/50 text-xs font-mono">learning_rate_schedule: constant</code>
        . Сравните кривые обучения в TensorBoard: ожидайте, что SAC выйдет на то же качество за{" "}
        <strong>меньшее</strong> число шагов среды.
      </li>
    </ul>

    <ProseP>
      В следующих уроках раздела мы свяжем SAC с soft Q-learning, разберём дискретный вариант SAC и
      обсудим, когда стоит брать TD3 вместо SAC.
    </ProseP>

    <KeyPoints
      items={[
        <>
          Та же постановка (наблюдения/действия/награды), что у PPO-агента, — SAC «вставляется» вместо
          PPO.
        </>,
        <>Главная выгода: экономия дорогих шагов симуляции + многомодальное исследование траекторий.</>,
        <>
          Следите за масштабом награды; включите нормализацию и{" "}
          <code className="px-1 rounded bg-muted/50 text-xs font-mono">threaded</code>.
        </>,
      ]}
    />
  </>
);

export default Section13;
