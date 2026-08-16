import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints, Callout, Code } from "./_shared";

const Section5 = () => (
  <>
    <h2 id="razdel-5-behavior-decisions" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 5. Режимы поведения и принятие решений
    </h2>

    <ProseP>
      Модель встроена — но как именно агент решает, <strong>когда</strong> думать и{" "}
      <strong>что делать</strong> с результатом? Три рычага.
    </ProseP>

    <h3 className={H3_CLASS}>Behavior Type — кто принимает решение</h3>

    <ProseP>
      В Behavior Parameters есть <strong>Behavior Type</strong> с тремя значениями:
    </ProseP>

    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border border-cyan-500/20 rounded-lg overflow-hidden">
        <thead className="bg-muted/30">
          <tr>
            <th className="text-left p-3 text-foreground font-semibold">Режим</th>
            <th className="text-left p-3 text-foreground font-semibold">Когда что используется</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cyan-500/10 text-foreground/85">
          <tr>
            <td className="p-3 font-semibold text-cyan-300">Default</td>
            <td className="p-3">
              Если подключён Python-тренер — решает он (обучение). Если нет — работает{" "}
              <strong>инференс</strong> по модели. Если и модели нет — вызывается{" "}
              <strong>эвристика</strong>.
            </td>
          </tr>
          <tr>
            <td className="p-3 font-semibold text-cyan-300">Inference Only</td>
            <td className="p-3">
              Решения <strong>всегда</strong> по встроенной <Code>.onnx</Code>-модели, даже если
              Python подключён. Это «продакшн-режим».
            </td>
          </tr>
          <tr>
            <td className="p-3 font-semibold text-cyan-300">Heuristic Only</td>
            <td className="p-3">
              Решения всегда из вашей функции <Code>Heuristic(...)</Code> (ручное управление с
              клавиатуры/геймпада). Для отладки и записи демонстраций.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ProseP>
      Для билда, который уедет к игроку, надёжнее всего <strong>Inference Only</strong> — так вы
      гарантируете, что агент думает по модели и никакие случайные подключения процесса не собьют
      его в режим обучения.
    </ProseP>

    <h3 className={H3_CLASS}>Decision Requester — как часто думать</h3>

    <ProseP>
      Агент не обязан звать нейросеть каждый кадр физики — это дорого и часто бессмысленно.
      Компонент <strong>Decision Requester</strong> задаёт <strong>Decision Period</strong>{" "}
      <Math display={false}>{String.raw`d`}</Math> — раз в сколько шагов Академии запрашивается
      новое решение. Между решениями (если включено{" "}
      <strong>Take Actions Between Decisions</strong>) повторяется последнее действие.
    </ProseP>

    <ProseP>Эффективная частота решений связана с частотой среды просто:</ProseP>
    <Math display>{String.raw`\boxed{\,\enfFun{f}_{\text{decision}} = \dfrac{\enfFun{f}_{\text{env}}}{d}\,}`}</Math>

    <ProseP>
      Гоночному агенту, как правило, не нужно перекладывать руль 50 раз в секунду:{" "}
      <Math display={false}>{String.raw`d = 5`}</Math> при 50 Гц физики даёт 10 решений в секунду —
      плавно и в разы дешевле по инференсу. Но осторожно: слишком большой{" "}
      <Math display={false}>{String.raw`d`}</Math> — и агент «проспит» поворот. Важно:{" "}
      <Math display={false}>{String.raw`d`}</Math> при <strong>обучении</strong> и при{" "}
      <strong>деплое</strong> должен совпадать, иначе политика работает в непривычном для себя
      темпе.
    </ProseP>

    <h3 className={H3_CLASS}>Детерминизм — убрать случайность в проде</h3>

    <ProseP>
      Во время обучения политика <strong>стохастична</strong>: действие сэмплируется из распределения{" "}
      <Math display={false}>{String.raw`a \sim \pi_\theta(\cdot\mid \enfVar{s})`}</Math> — это и есть
      исследование (
      <CrossLinkToHub
        hubPath="/algorithms/ppo"
        hubAnchor="stochastic-policy"
        hubTitle="Хаб PPO — стохастическая политика"
      >
        ↗ Хаб: PPO → стохастическая политика
      </CrossLinkToHub>
      ). В готовой игре исследование не нужно, а воспроизводимость — нужна. В Behavior Parameters
      есть флаг <strong>детерминированного инференса</strong>: вместо сэмплирования берётся{" "}
      <strong>самое вероятное</strong> действие (argmax для дискретных, среднее для непрерывных).
    </ProseP>

    <Math display>{String.raw`a_{\text{deploy}} = \arg\max_{a} \pi_\theta(a \mid \enfVar{s}) \quad\text{(детерминированно)} \qquad\text{vs}\qquad a_{\text{train}} \sim \pi_\theta(\cdot \mid \enfVar{s})\ \text{(стохастично)}`}</Math>

    <Callout title="💡 Когда что" color="purple">
      Соперникам в гонке детерминизм даёт предсказуемую, «вылизанную» траекторию. Но если все боты
      одинаковы и детерминированы — они поедут <strong>идентично</strong>, и гонка станет скучной.
      Тогда либо оставьте лёгкую стохастичность, либо разнообразьте ботов разными
      моделями/стартовыми условиями.
    </Callout>

    <KeyPoints
      items={[
        <>
          <strong>Behavior Type</strong>: Default (тренер→инференс→эвристика), Inference Only (всегда
          модель), Heuristic Only (ручное).
        </>,
        <>
          Для билда к игроку выбирайте <strong>Inference Only</strong>.
        </>,
        <>
          <strong>Decision Period</strong>{" "}
          <Math display={false}>{String.raw`d`}</Math> задаёт частоту решений{" "}
          <Math display={false}>{String.raw`\enfFun{f}_{\text{decision}} = \enfFun{f}_{\text{env}}/d`}</Math>; он
          должен совпадать с обучением.
        </>,
        <>
          <strong>Детерминированный инференс</strong> заменяет сэмплирование на argmax —
          воспроизводимо, но одинаковые боты едут одинаково.
        </>,
      ]}
    />
  </>
);

export default Section5;
