import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Callout, Anchor } from "./_shared";

const Section4 = () => (
  <>
    <h2 className={SECTION_TITLE_CLASS}>Раздел 4. Soft policy iteration → практический SAC</h2>

    <ProseP>
      Теория даёт <strong>soft policy iteration</strong> — чередование двух шагов, которое доказуемо
      сходится к оптимальной максэнтропийной политике (в табличном случае, Теорема 1 в статье):
    </ProseP>

    <ol className="space-y-3 my-4 list-decimal list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>Soft policy evaluation.</strong> Многократно применяем{" "}
        <Math display={false}>{String.raw`\mathcal{T}^\pi`}</Math> — оценка{" "}
        <Math display={false}>{String.raw`Q`}</Math> сходится к soft Q-функции текущей политики
        (Лемма 1).
      </li>
      <li>
        <strong>Soft policy improvement.</strong> Обновляем политику в сторону экспоненты от новой{" "}
        <Math display={false}>{String.raw`Q`}</Math>, проецируя её на класс допустимых политик{" "}
        <Math display={false}>{String.raw`\Pi`}</Math> через KL-дивергенцию (уравнение (4)):
      </li>
    </ol>

    <Math>{String.raw`\pi_{\text{new}} = \arg\min_{\pi'\in\Pi}\; D_{\mathrm{KL}}\!\left(\, \pi'(\cdot\mid \enfVar{s}_t)\;\bigg\|\; \frac{\exp\!\big(\tfrac{1}{\enfPar{\alpha}}\enfOp{Q}^{\pi_{\text{old}}}(\enfVar{s}_t,\cdot)\big)}{Z^{\pi_{\text{old}}}(\enfVar{s}_t)}\right).`}</Math>

    <ProseP>
      Здесь <Math display={false}>{String.raw`Z^{\pi_{\text{old}}}(\enfVar{s}_t)`}</Math> — нормировочная
      константа (partition function); она неберущаяся в общем случае, но{" "}
      <strong>не зависит от параметров политики</strong> и потому не влияет на градиент — её можно
      игнорировать. Полное доказательство сходимости (Леммы 1–2, Теорема 1) вынесено в{" "}
      <CrossLinkToHub
        hubPath="/algorithms/sac"
        hubAnchor="architecture"
        hubTitle="SAC → Сходимость soft policy iteration"
      >
        хаб по сходимости soft policy iteration
      </CrossLinkToHub>
      .
    </ProseP>

    <ProseP>
      В непрерывных пространствах табличный алгоритм неприменим:{" "}
      <Math display={false}>{String.raw`Q`}</Math> и <Math display={false}>{String.raw`\pi`}</Math>{" "}
      заменяются нейросетями, а два шага не доводятся до сходимости, а чередуются по одному
      градиентному шагу. Так теория превращается в <strong>практический SAC</strong> — три обучаемые
      сети:
    </ProseP>

    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        soft Q-функция (critic) <Math display={false}>{String.raw`\enfOp{Q}_\theta(\enfVar{s},a)`}</Math> — на самом
        деле их <strong>две</strong>, см.{" "}
        <Anchor to="раздел-5-два-q-критика-clipped-double-q-и-target-сети">Раздел 5</Anchor>;
      </li>
      <li>
        политика (actor) <Math display={false}>{String.raw`\pi_\phi(a\mid \enfVar{s})`}</Math>.
      </li>
    </ul>

    <Callout title="Замечание об архитектуре" color="cyan">
      <p>
        В первой статье (1801.01290) была <em>отдельная</em> сеть для{" "}
        <Math display={false}>{String.raw`V`}</Math>. Во второй статье (1812.05905) авторы показали,
        что <strong>отдельная V-сеть не нужна</strong> — soft value выражается через{" "}
        <Math display={false}>{String.raw`Q`}</Math> и <Math display={false}>{String.raw`\pi`}</Math>{" "}
        по формуле (3). Современный SAC (и реализация в Unity ML-Agents) обходится{" "}
        <strong>двумя Q-сетями + политикой</strong>, без отдельного критика ценности.
      </p>
    </Callout>

    <KeyPoints
      items={[
        <>
          Soft policy iteration = soft evaluation + soft improvement, доказуемо сходится (таблично).
        </>,
        <>
          Improvement — это KL-проекция на{" "}
          <Math display={false}>{String.raw`\exp(\enfOp{Q}/\enfPar{\alpha})/Z`}</Math>; нормировка{" "}
          <Math display={false}>{String.raw`Z`}</Math> не влияет на градиент.
        </>,
        <>Практический SAC: нейросети + по одному градиентному шагу вместо сходимости.</>,
        <>Современный SAC = 2 Q-сети + политика (отдельная V-сеть не нужна).</>,
      ]}
    />
  </>
);

export default Section4;
