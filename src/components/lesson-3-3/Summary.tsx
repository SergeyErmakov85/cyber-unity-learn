import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS } from "./_shared";

const chip = "px-1 rounded bg-muted/50 text-xs font-mono";

const Summary = () => (
  <>
    <h2 id="itogi" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Итоги урока
    </h2>

    <ul className="space-y-3 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        Фиксированная среда порождает две зеркальные беды:{" "}
        <strong className="text-primary">необучаемость трудной задачи в лоб</strong> и{" "}
        <strong className="text-primary">переобучение</strong> под одну конфигурацию.
      </li>
      <li>
        <strong className="text-primary">Учебный план</strong> управляет <em>порядком</em> трудности;
        формально это <strong>метод продолжения</strong>{" "}
        <Math display={false}>{String.raw`\mathcal{L}_0 \to \mathcal{L}^\star`}</Math>. Переход между
        уроками — по <strong>сглаженной мере</strong> прогресса и <strong>порогу</strong>, не короче{" "}
        <code className={chip}>min_lesson_length</code>.
      </li>
      <li>
        <strong className="text-primary">Рандомизация среды</strong> управляет <em>разнообразием</em>;
        цель — максимум отдачи по распределению контекстов{" "}
        <Math display={false}>{String.raw`\max_\pi \mathbb{E}_{c\sim p(c)}[J_c(\pi)]`}</Math>. Две
        мотивации: <strong>обобщение</strong> (Cobbe и др.) и <strong>sim-to-real</strong> (Tobin и
        др.). Цена — риск <strong>чрезмерно осторожной</strong> политики.
      </li>
      <li>
        <strong className="text-primary">ADR</strong> = учебный план над рандомизацией: факторизованное{" "}
        <Math display={false}>{String.raw`P_\phi`}</Math>, <strong>boundary sampling</strong>, пороги{" "}
        <Math display={false}>{String.raw`t_L/t_H`}</Math>, <strong>ADR-энтропия</strong> как «номер
        урока».
      </li>
      <li>
        <strong className="text-primary">PLR</strong> строит неявный план без контроля над генератором:
        переигрывать уровни с высоким <Math display={false}>{String.raw`|\hat A_t|`}</Math>{" "}
        (<strong>L1 value loss</strong> ≈ |GAE|), со <strong>staleness-коррекцией</strong>{" "}
        <Math display={false}>{String.raw`P_{\text{replay}} = (1-\rho)P_S + \rho P_C`}</Math>;{" "}
        <Math display={false}>{String.raw`\text{PLR}^{\perp}`}</Math> → минимакс-regret.
      </li>
      <li>
        В <strong className="text-primary">Unity ML-Agents</strong> всё это — секция{" "}
        <code className={chip}>environment_parameters</code>: сэмплеры (<code className={chip}>uniform</code>/
        <code className={chip}>gaussian</code>/<code className={chip}>multirangeuniform</code>) и{" "}
        <code className={chip}>curriculum</code> с <code className={chip}>completion_criteria</code> (
        <code className={chip}>measure</code>/<code className={chip}>threshold</code>/
        <code className={chip}>min_lesson_length</code>/…); <code className={chip}>measure: Elo</code> —
        только в self-play.
      </li>
      <li>
        Рубеж — <strong className="text-primary">UED</strong> (PAIRED, POET, ACCEL): «<strong>self-play
        над средами</strong>», прямое продолжение автокурриккулума из{" "}
        <CrossLinkToHub hubPath="/courses/3-2" hubAnchor="self-play" hubTitle="Урок 3.2 — Self-Play">
          урока 3.2
        </CrossLinkToHub>
        .
      </li>
    </ul>
  </>
);

export default Summary;
