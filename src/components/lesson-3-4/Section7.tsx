import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints, Code } from "./_shared";

const Section7 = () => (
  <>
    <h2 id="razdel-7-tensorboard" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 7. Диагностика в TensorBoard для GAIL
    </h2>

    <ProseP>
      Актуальные метрики (<em>Using-Tensorboard</em>, ML-Agents 4.0):
    </ProseP>
    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <Code>Policy/GAIL Reward</Code> — средняя суммарная награда от дискриминатора за эпизод.
          Должна расти.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <Code>Policy/GAIL Value Estimate</Code> — оценка ценности агента для GAIL-награды.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <Code>Policy/GAIL Policy Estimate</Code> — оценка дискриминатора для пар,{" "}
          <strong>сгенерированных политикой</strong>.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <Code>Policy/GAIL Expert Estimate</Code> — оценка дискриминатора для пар{" "}
          <strong>из экспертных демо</strong>.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <Code>Losses/GAIL Loss</Code> — средняя величина лосса дискриминатора GAIL.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          BC отображается как <Code>Losses/Pretraining Loss</Code>.
        </span>
      </li>
    </ul>

    <h3 className={H3_CLASS}>Как читать</h3>
    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li className="flex gap-2.5">
        <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
        <span>
          <strong>Здоровая динамика:</strong> <Code>Expert Estimate</Code> и{" "}
          <Code>Policy Estimate</Code> постепенно <strong>сближаются</strong> (дискриминатор всё хуже
          различает) → политика реально приближается к стилю эксперта;{" "}
          <Code>GAIL Reward</Code> растёт, <Code>Environment/Cumulative Reward</Code> тоже растёт.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-amber-400 mt-0.5 shrink-0">!</span>
        <span>
          <strong>Дискриминатор «слишком хорош»</strong> (<Code>Expert</Code> → ~1,{" "}
          <Code>Policy</Code> → ~0, большой разрыв): сигнал почти нулевой/насыщенный. Лечить:
          понизить <Code>learning_rate</Code> дискриминатора, включить{" "}
          <Code>use_vail: true</Code>, уменьшить <Code>hidden_units</Code>, иногда поднять{" "}
          <Code>strength</Code>.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-amber-400 mt-0.5 shrink-0">!</span>
        <span>
          <strong>Дискриминатор слишком слаб</strong> (оценки ~0.5, <Code>GAIL Loss</Code> не падает):
          поднять <Code>learning_rate</Code>/<Code>hidden_units</Code>, поднять{" "}
          <Code>strength</Code> GAIL.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-amber-400 mt-0.5 shrink-0">!</span>
        <span>
          <strong>Нестабильный <Code>GAIL Loss</Code></strong> (пилит): понизить{" "}
          <Code>learning_rate</Code> дискриминатора, включить <Code>use_vail</Code>.
        </span>
      </li>
    </ul>

    <KeyPoints
      items={[
        <>
          Главный диагноз GAIL — <em>сближение</em> Policy/Expert Estimate; пока они расходятся,
          политика не учится «стилю».
        </>,
        <>
          Перетренированный дискриминатор лечится понижением LR, <Code>use_vail</Code> и уменьшением
          сети.
        </>,
        <>
          BC-варпап виден в <Code>Losses/Pretraining Loss</Code>: он должен сходить на плато до того,
          как GAIL берёт верх.
        </>,
      ]}
    />
  </>
);

export default Section7;
