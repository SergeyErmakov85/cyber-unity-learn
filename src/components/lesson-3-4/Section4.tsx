import Math from "@/components/Math";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints } from "./_shared";

const Section4 = () => (
  <>
    <h2 id="razdel-4-airl-varianty" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 4. AIRL и варианты (триангуляция)
    </h2>

    <ProseP>
      <strong>AIRL</strong> — Fu, Luo, Levine,{" "}
      <em>Learning Robust Rewards with Adversarial Inverse Reinforcement Learning</em>, ICLR 2018
      (arXiv:1710.11248). GAIL восстанавливает не настоящую награду, а сигнал, спутанный с динамикой
      среды (entangled). AIRL ограничивает форму дискриминатора:
    </ProseP>
    <Math display>
      {String.raw`D_{\theta}(s,a,s')=\frac{\exp\{f_\theta(s,a,s')\}}{\exp\{f_\theta(s,a,s')\}+\pi(a\mid s)},\qquad f_\theta(s,a,s')=g_\theta(s,a)+\gamma h_\phi(s')-h_\phi(s),`}
    </Math>
    <ProseP>
      что позволяет извлечь <strong>disentangled reward</strong>{" "}
      <Math display={false}>{String.raw`g_\theta`}</Math>, инвариантный к смене динамики. При
      state-only форме <Math display={false}>{String.raw`g_\theta(s)`}</Math> AIRL восстанавливает
      истинную награду и переносит политику в среды с изменённой динамикой, где GAIL-награда уже
      неоптимальна.
    </ProseP>

    <h3 className={H3_CLASS}>Соседи по семейству</h3>
    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>f-GAIL</strong> (Zhang и др., 2020) — автоматически подбирает{" "}
          <Math display={false}>f</Math>-дивергенцию вместо фиксированной JS.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>VAIL</strong> (Peng и др., 2019) — добавляет вариационное информационное «бутылочное
          горло» в дискриминатор; этот же механизм в ML-Agents выставляется флагом{" "}
          <code className="px-1 rounded bg-muted/50 text-xs font-mono">use_vail</code>.
        </span>
      </li>
    </ul>

    <h3 className={H3_CLASS}>Когда что выбирать</h3>
    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>BC</strong> — когда демо много и нужен быстрый старт/warmup.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>DAgger</strong> — когда эксперт доступен онлайн (можно дозапрашивать).
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>GAIL</strong> — когда демо мало, среда доступна, награда не нужна, переносимость не
          критична.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>AIRL</strong> — когда нужно восстановить переносимую награду и/или ожидается смена
          динамики среды.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Чистый PPO</strong> — когда есть хорошая ручная reward-функция и демо отсутствуют.
        </span>
      </li>
    </ul>

    <KeyPoints
      items={[
        <>
          AIRL чинит главный дефект GAIL: вместо «сигнала, путанного с динамикой» возвращает
          переносимую <Math display={false}>{String.raw`r(s)`}</Math>.
        </>,
        <>
          VAIL (= <code className="px-1 rounded bg-muted/50 text-xs font-mono">use_vail: true</code> в
          ML-Agents) стабилизирует дискриминатор через инфо-bottleneck.
        </>,
        <>
          Выбор семейства = функция от наличия эксперта онлайн, награды, демо и того, нужна ли
          переносимость.
        </>,
      ]}
    />
  </>
);

export default Section4;
