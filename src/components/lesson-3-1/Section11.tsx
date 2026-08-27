import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints, Anchor } from "./_shared";

const chip = "px-1 rounded bg-muted/50 text-xs font-mono";

const Section11 = () => (
  <>
    <h2 className={SECTION_TITLE_CLASS}>Раздел 11. Гиперпараметры SAC и их тюнинг</h2>

    <ProseP>
      Ниже — ключевые «ручки» SAC и как их крутить. (Имена даны в нотации Unity ML-Agents; см.{" "}
      <Anchor to="раздел-12-sac-в-unity-ml-agents">Раздел 12</Anchor>.)
    </ProseP>

    <h3 className={H3_CLASS}>Самые влиятельные:</h3>

    <ul className="space-y-3 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>Масштаб награды / целевая энтропия.</strong> Исторически <em>главный</em>{" "}
        гиперпараметр SAC. С автоподстройкой <Math display={false}>{String.raw`\enfPar{\alpha}`}</Math> его
        роль берёт на себя целевая энтропия{" "}
        <Math display={false}>{String.raw`\bar{\mathcal{\enfOp{H}}}=-\dim(\mathcal{A})`}</Math>. Если агент
        схлопывается в детерминизм слишком рано — поднимите стартовый энтропийный коэффициент (
        <code className={chip}>init_entcoef</code>); если бесцельно «дёргается» и не эксплуатирует
        награду — снизьте.
      </li>
      <li>
        <strong>
          <Math display={false}>{String.raw`\enfPar{\tau}`}</Math> (<code className={chip}>tau</code>),
          сглаживание target.
        </strong>{" "}
        Дефолт <Math display={false}>{String.raw`0.005`}</Math>. Большое{" "}
        <Math display={false}>{String.raw`\enfPar{\tau}`}</Math> (
        <Math display={false}>{String.raw`\to 0.01`}</Math>) ускоряет на простых задачах, но рискует
        нестабильностью; меньшее — стабильнее, но медленнее.
      </li>
      <li>
        <strong>Размер буфера (<code className={chip}>buffer_size</code>).</strong> Для непрерывного
        управления — порядка <Math display={false}>{String.raw`10^5`}</Math>–
        <Math display={false}>{String.raw`10^6`}</Math>. Слишком маленький → SAC «забывает» старый
        полезный опыт; слишком большой → редко видит свежие данные, обучение замедляется.
      </li>
      <li>
        <strong>Соотношение шаги/обновления (<code className={chip}>steps_per_update</code>).</strong>{" "}
        Меньше → выше sample efficiency, дороже по времени. Хороший баланс — равно числу агентов в
        сцене.
      </li>
    </ul>

    <h3 className={H3_CLASS}>Важные, но обычно стабильные:</h3>

    <ul className="space-y-3 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>Learning rate (<code className={chip}>learning_rate</code>).</strong> Около{" "}
        <Math display={false}>{String.raw`3\times10^{-4}`}</Math>. Для SAC держат{" "}
        <strong>постоянным</strong> (<code className={chip}>constant</code>), чтобы{" "}
        <Math display={false}>{String.raw`Q`}</Math> доучилась до естественной сходимости.
      </li>
      <li>
        <strong>Batch size (<code className={chip}>batch_size</code>).</strong> Для непрерывных
        действий крупный: <Math display={false}>{String.raw`128`}</Math>–
        <Math display={false}>{String.raw`1024`}</Math>.
      </li>
      <li>
        <strong>Прогрев (<code className={chip}>buffer_init_steps</code>).</strong>{" "}
        <Math display={false}>{String.raw`1000`}</Math>–<Math display={false}>{String.raw`10000`}</Math>{" "}
        случайных шагов перед обучением.
      </li>
      <li>
        <strong>Размер сети (<code className={chip}>hidden_units</code>,{" "}
          <code className={chip}>num_layers</code>).</strong> Стандарт SAC — 2 скрытых слоя по 256
        нейронов; для простых задач меньше.
      </li>
      <li>
        <strong>
          Дисконт <Math display={false}>{String.raw`\enfPar{\gamma}`}</Math> (<code className={chip}>gamma</code>).
        </strong>{" "}
        <Math display={false}>{String.raw`0.99`}</Math> по умолчанию; чем дальновиднее задача, тем
        ближе к 1 (строго <Math display={false}>{String.raw`<1`}</Math>).
      </li>
    </ul>

    <h3 className={H3_CLASS}>Диагностика по TensorBoard:</h3>

    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        Энтропия политики <strong>резко падает в ноль</strong> на ранней стадии → исследования мало →
        поднимите <code className={chip}>init_entcoef</code> (или проверьте масштаб награды).
      </li>
      <li>
        Энтропия <strong>не падает вовсе</strong>, награда не растёт → слишком много случайности →
        снизьте <code className={chip}>init_entcoef</code>.
      </li>
      <li>
        Кривая награды <strong>дёргается/расходится</strong> → возможно, слишком большой{" "}
        <Math display={false}>{String.raw`\enfPar{\tau}`}</Math> или слишком частые обновления; уменьшите.
      </li>
      <li>
        Кривая ползёт <strong>слишком медленно</strong> → увеличьте update-to-data (уменьшите{" "}
        <code className={chip}>steps_per_update</code>) или слегка поднимите{" "}
        <Math display={false}>{String.raw`\enfPar{\tau}`}</Math>.
      </li>
    </ul>

    <ProseP>
      Чтение графиков обучения (reward, entropy, loss) подробно разобрано в{" "}
      <CrossLinkToHub
        hubPath="/courses/2-6"
        hubAnchor="diagnostics"
        hubTitle="Урок 2.6 → Диагностика обучения (TensorBoard и W&B)"
      >
        уроке про TensorBoard и W&B
      </CrossLinkToHub>
      .
    </ProseP>

    <KeyPoints
      items={[
        <>
          Главное — энтропийный баланс (целевая энтропия /{" "}
          <code className={chip}>init_entcoef</code>) и согласование с масштабом награды.
        </>,
        <>
          <Math display={false}>{String.raw`\enfPar{\tau}=0.005`}</Math>, lr{" "}
          <Math display={false}>{String.raw`\approx 3\times10^{-4}`}</Math> (constant), буфер{" "}
          <Math display={false}>{String.raw`10^5`}</Math>–<Math display={false}>{String.raw`10^6`}</Math>
          , батч <Math display={false}>{String.raw`128`}</Math>–<Math display={false}>{String.raw`1024`}</Math>{" "}
          — надёжные дефолты.
        </>,
        <>Диагностируйте по энтропии и кривой награды в TensorBoard.</>,
      ]}
    />
  </>
);

export default Section11;
