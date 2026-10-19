import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints } from "./_shared";

const Section3 = () => (
  <>
    <h2 className={SECTION_TITLE_CLASS}>
      Раздел 3. Soft Q-функция, soft value function и soft-уравнение Беллмана
    </h2>

    <ProseP>
      Когда мы поменяли цель, поменялись и определения ценности. Они становятся{" "}
      <strong>«мягкими» (soft)</strong> — отсюда название Soft Actor-Critic.
    </ProseP>

    <h3 className={H3_CLASS}>Soft value function</h3>

    <ProseP>
      Обычная <Math display={false}>{String.raw`\enfOp{V}(\enfVar{s})`}</Math> — это ожидаемая отдача из состояния{" "}
      <Math display={false}>{String.raw`\enfVar{s}`}</Math>. В максэнтропийном мире к отдаче добавляется
      будущая энтропия. Soft value определяется так (уравнение (3)):
    </ProseP>

    <Math>{String.raw`\boxed{\;
\enfOp{V}(\enfVar{s}_t) = \mathbb{E}_{a_t\sim\pi}\big[\, \enfOp{Q}(\enfVar{s}_t,\enfFun{a}_t) - \enfPar{\alpha}\log\enfFun{\pi}(\enfFun{a}_t\mid \enfVar{s}_t)\,\big]
\;}`}</Math>

    <ProseP>
      Заметьте: <Math display={false}>{String.raw`-\enfPar{\alpha}\log\enfFun{\pi}(\enfFun{a}_t\mid \enfVar{s}_t)`}</Math> — это в
      точности вклад энтропии (вспомните{" "}
      <Math display={false}>{String.raw`\enfOp{\mathcal{H}}=\mathbb{E}[-\log\enfFun{\pi}]`}</Math>). То есть{" "}
      <strong>soft value = ожидаемое Q плюс бонус за случайность</strong>.
    </ProseP>

    <h3 className={H3_CLASS}>Soft Q-функция и soft-уравнение Беллмана</h3>

    <ProseP>
      Soft Q-функция <Math display={false}>{String.raw`\enfOp{Q}(\enfVar{s}_t,\enfFun{a}_t)`}</Math> оценивает: «взять действие{" "}
      <Math display={false}>{String.raw`\enfFun{a}_t`}</Math> в <Math display={false}>{String.raw`\enfVar{s}_t`}</Math>,
      а <em>дальше</em> следовать политике <Math display={false}>{String.raw`\enfFun{\pi}`}</Math>, получая и
      награды, и энтропийные бонусы». Её определяет{" "}
      <strong>модифицированный (soft) оператор Беллмана</strong> (уравнение (2)):
    </ProseP>

    <Math>{String.raw`\enfOp{\mathcal{T}}^\pi \enfOp{Q}(\enfVar{s}_t,a_t) \;\triangleq\; \enfTgt{r}(\enfVar{s}_t,a_t) + \enfPar{\gamma}\,\mathbb{E}_{s_{t+1}\sim p}\big[\, \enfOp{V}(\enfVar{s}_{t+1})\,\big].`}</Math>

    <ProseP>
      Подставляя сюда определение soft value, получаем{" "}
      <strong>полное soft-уравнение Беллмана</strong>:
    </ProseP>

    <Math>{String.raw`\boxed{\;
\enfOp{Q}(\enfVar{s}_t,a_t) = \enfTgt{r}(\enfVar{s}_t,a_t) + \enfPar{\gamma}\,\mathbb{E}_{s_{t+1}\sim p}\Big[\,\mathbb{E}_{a_{t+1}\sim\pi}\big[\, \enfOp{Q}(\enfVar{s}_{t+1},a_{t+1}) - \enfPar{\alpha}\log\pi(a_{t+1}\mid \enfVar{s}_{t+1})\,\big]\Big]
\;}`}</Math>

    <ProseP>
      Сравните с <strong>обычным</strong> уравнением Беллмана{" "}
      <Math display={false}>{String.raw`\enfOp{Q}(\enfVar{s},a)=\enfTgt{r}+\enfPar{\gamma}\,\mathbb{E}[\max_{a'} \enfOp{Q}(\enfVar{s}',a')]`}</Math> из{" "}
      <CrossLinkToHub
        hubPath="/math-rl/module-5"
        hubAnchor="глава-5"
        hubTitle="Математика → Глава 5. Уравнения Беллмана"
      >
        хаба по уравнениям Беллмана
      </CrossLinkToHub>
      . Различие в двух местах:
    </ProseP>

    <ol className="space-y-2 my-4 list-decimal list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        вместо жёсткого <Math display={false}>{String.raw`\max_{a'}`}</Math> — усреднение по политике{" "}
        <Math display={false}>{String.raw`\mathbb{E}_{a'\sim\pi}`}</Math>;
      </li>
      <li>
        добавлен энтропийный член{" "}
        <Math display={false}>{String.raw`-\enfPar{\alpha}\log\enfFun{\pi}(\enfFun{a}'\mid \enfVar{s}')`}</Math>.
      </li>
    </ol>

    <h3 className={H3_CLASS}>Почему именно «soft»: жёсткий max превращается в softmax</h3>

    <ProseP>
      Можно показать (Haarnoja et al. 2017, <em>Soft Q-Learning</em>), что{" "}
      <strong>оптимальная</strong> максэнтропийная политика — это распределение Больцмана по
      Q-значениям:
    </ProseP>

    <Math>{String.raw`\enfFun{\pi}^*(\enfFun{a}\mid \enfVar{s}) \;\propto\; \exp\!\Big(\tfrac{1}{\enfPar{\alpha}}\,\enfOp{Q}^*(\enfVar{s},\enfFun{a})\Big),`}</Math>

    <ProseP>
      а оптимальная soft value записывается через <strong>log-sum-exp</strong> — гладкий («мягкий»)
      аналог максимума:
    </ProseP>

    <Math>{String.raw`\enfOp{V}^*(\enfVar{s}) = \enfPar{\alpha} \log \int_{\mathcal{A}} \exp\!\Big(\tfrac{1}{\enfPar{\alpha}}\,\enfOp{Q}^*(\enfVar{s},\enfFun{a})\Big)\,\mathrm{d}a .`}</Math>

    <ProseP>
      Вот в чём смысл слова <em>soft</em>: жёсткий оператор{" "}
      <Math display={false}>{String.raw`\max_a`}</Math> заменяется на{" "}
      <strong>soft maximum</strong> (log-sum-exp). При{" "}
      <Math display={false}>{String.raw`\enfPar{\alpha}\to 0`}</Math> log-sum-exp снова стягивается к обычному{" "}
      <Math display={false}>{String.raw`\max`}</Math>, а политика Больцмана — к жадной. Подробный
      вывод политики Больцмана и связь с soft Q-learning — в{" "}
      <CrossLinkToHub
        hubPath="/algorithms/sac"
        hubAnchor="entropy"
        hubTitle="SAC → Максимальная энтропия и политика Больцмана"
      >
        хабе по максэнтропийному RL
      </CrossLinkToHub>
      .
    </ProseP>

    <KeyPoints
      items={[
        <>
          Soft value:{" "}
          <Math display={false}>
            {String.raw`\enfOp{V}(\enfVar{s})=\mathbb{E}_{a\sim\pi}[\enfOp{Q}(\enfVar{s},\enfFun{a})-\enfPar{\alpha}\log\enfFun{\pi}(\enfFun{a}\mid \enfVar{s})]`}
          </Math>{" "}
          — ценность плюс бонус за энтропию.
        </>,
        <>
          Soft-оператор Беллмана:{" "}
          <Math display={false}>{String.raw`\enfOp{\mathcal{T}}^\pi \enfOp{Q} = \enfTgt{r} + \enfPar{\gamma}\,\mathbb{E}[\enfOp{V}(\enfVar{s}')]`}</Math>
          .
        </>,
        <>
          В soft-Беллмане <Math display={false}>{String.raw`\max_{a'}`}</Math> заменён на{" "}
          <Math display={false}>{String.raw`\mathbb{E}_{a'\sim\pi}`}</Math> + энтропийный член.
        </>,
        <>
          Оптимальная политика — больцмановская{" "}
          <Math display={false}>{String.raw`\enfFun{\pi}^*\propto\exp(\enfOp{Q}^*/\enfPar{\alpha})`}</Math>; «soft» =
          log-sum-exp вместо max.
        </>,
      ]}
    />
  </>
);

export default Section3;
