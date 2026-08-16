import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints } from "./_shared";

const Section6 = () => (
  <>
    <h2 className={SECTION_TITLE_CLASS}>
      Раздел 6. Reparameterization trick для стохастической политики
    </h2>

    <h3 className={H3_CLASS}>Проблема: как взять градиент через случайную выборку?</h3>

    <ProseP>
      Политику нужно улучшать так, чтобы она выбирала действия с высокой soft Q. Цель политики
      (уравнение (7)) — минимизировать KL, что сводится к:
    </ProseP>

    <Math>{String.raw`\enfTgt{J}_\pi(\enfPar{\phi}) = \mathbb{E}_{s_t\sim\mathcal{D}}\Big[\,\mathbb{E}_{a_t\sim\pi_\phi}\big[\,\enfPar{\alpha}\log\pi_\phi(a_t\mid \enfVar{s}_t) - \enfOp{Q}_\theta(\enfVar{s}_t,a_t)\,\big]\Big].`}</Math>

    <ProseP>
      Загвоздка: действие <Math display={false}>{String.raw`a_t`}</Math>{" "}
      <strong>сэмплируется</strong> из <Math display={false}>{String.raw`\pi_\phi`}</Math>, а
      параметры <Math display={false}>{String.raw`\enfPar{\phi}`}</Math> сидят внутри распределения, из
      которого мы сэмплируем. Прямо продифференцировать{" "}
      <Math display={false}>{String.raw`\mathbb{E}_{a\sim\pi_\phi}[\dots]`}</Math> по{" "}
      <Math display={false}>{String.raw`\enfPar{\phi}`}</Math> нельзя — выборка не дифференцируема.
    </ProseP>

    <h3 className={H3_CLASS}>Решение: вынести случайность наружу</h3>

    <ProseP>
      <strong>Reparameterization trick</strong> переписывает случайное действие как{" "}
      <strong>детерминированную функцию параметров и независимого шума</strong> (уравнение (8)):
    </ProseP>

    <Math>{String.raw`a_t = f_\phi(\enfPar{\epsilon}_t; \enfVar{s}_t), \qquad \enfPar{\epsilon}_t \sim \mathcal{N}(0, I).`}</Math>

    <ProseP>
      Конкретно SAC использует <strong>squashed Gaussian</strong> — гауссиану, «сплющенную» через{" "}
      <Math display={false}>{String.raw`\tanh`}</Math>, чтобы действия лежали в{" "}
      <Math display={false}>{String.raw`[-1,1]`}</Math> (как требует непрерывное управление):
    </ProseP>

    <Math>{String.raw`\boxed{\;
a = \tanh\!\big(\,\underbrace{\mu_\phi(\enfVar{s})}_{\text{среднее}} + \underbrace{\sigma_\phi(\enfVar{s})}_{\text{разброс}}\odot\,\enfPar{\epsilon}\,\big),
\qquad \enfPar{\epsilon}\sim\mathcal{N}(0,I)
\;}`}</Math>

    <ProseP>
      Теперь шум <Math display={false}>{String.raw`\enfPar{\epsilon}`}</Math> <strong>не зависит</strong> от{" "}
      <Math display={false}>{String.raw`\enfPar{\phi}`}</Math>, а <Math display={false}>{String.raw`f_\phi`}</Math>{" "}
      — гладкая. Градиент спокойно протекает от{" "}
      <Math display={false}>{String.raw`\enfOp{Q}_\theta`}</Math> через действие{" "}
      <Math display={false}>{String.raw`a_t`}</Math> обратно в веса политики. Переписанная цель
      (уравнение (9), уже с двумя критиками):
    </ProseP>

    <Math>{String.raw`\boxed{\;
\enfTgt{J}_\pi(\enfPar{\phi}) = \mathbb{E}_{s_t\sim\mathcal{D},\,\epsilon_t\sim\mathcal{N}}\big[\,\enfPar{\alpha}\log\pi_\phi\big(f_\phi(\enfPar{\epsilon}_t;\enfVar{s}_t)\mid \enfVar{s}_t\big) - \min_{i=1,2} \enfOp{Q}_{\theta_i}\big(\enfVar{s}_t, f_\phi(\enfPar{\epsilon}_t;\enfVar{s}_t)\big)\,\big]
\;}`}</Math>

    <ProseP>
      Такой (pathwise) градиент имеет <strong>меньшую дисперсию</strong>, чем likelihood-ratio оценка
      (REINFORCE), потому что использует производную самой{" "}
      <Math display={false}>{String.raw`Q`}</Math> по действию, а не только лог-вероятность. Подробное
      сравнение reparameterization vs likelihood-ratio — в{" "}
      <CrossLinkToHub
        hubPath="/math-rl/module-4"
        hubAnchor="лекция-2-вывод-градиента-политики"
        hubTitle="Математика → Вывод градиента политики"
      >
        хабе по policy gradient
      </CrossLinkToHub>
      .
    </ProseP>

    <h3 className={H3_CLASS}>
      Поправка на <Math display={false}>{String.raw`\tanh`}</Math> в логарифме плотности
    </h3>

    <ProseP>
      Сплющивание через <Math display={false}>{String.raw`\tanh`}</Math> меняет плотность
      распределения, и это нужно учесть. Если{" "}
      <Math display={false}>{String.raw`u \sim \mathcal{N}(\mu,\sigma)`}</Math> — «досплющенное»
      действие, а <Math display={false}>{String.raw`a=\tanh(u)`}</Math>, то (Приложение C статьи
      1801.01290):
    </ProseP>

    <Math>{String.raw`\log\pi(a\mid \enfVar{s}) = \log\mu(u\mid \enfVar{s}) - \sum_{i=1}^{D}\log\!\big(1 - \tanh^2(u_i)\big),`}</Math>

    <ProseP>
      где <Math display={false}>{String.raw`D`}</Math> — размерность пространства действий. Второй
      член — поправка от якобиана преобразования{" "}
      <Math display={false}>{String.raw`\tanh`}</Math>. На практике для численной устойчивости
      вычисляют <Math display={false}>{String.raw`\log(1-\tanh^2 u)`}</Math> через стабильную форму.
      Эту деталь реализует за вас и Unity ML-Agents, и любая зрелая библиотека.
    </ProseP>

    <KeyPoints
      items={[
        <>Нельзя дифференцировать «через сэмпл» — параметры внутри распределения.</>,
        <>
          Reparameterization:{" "}
          <Math display={false}>{String.raw`a=f_\phi(\enfPar{\epsilon};\enfVar{s})`}</Math>, шум{" "}
          <Math display={false}>{String.raw`\enfPar{\epsilon}`}</Math> вынесен наружу → градиент течёт.
        </>,
        <>
          SAC использует squashed Gaussian:{" "}
          <Math display={false}>{String.raw`a=\tanh(\mu_\phi(\enfVar{s})+\sigma_\phi(\enfVar{s})\odot\enfPar{\epsilon})`}</Math>
          .
        </>,
        <>
          Нужна поправка на <Math display={false}>{String.raw`\tanh`}</Math> в{" "}
          <Math display={false}>{String.raw`\log\pi`}</Math> (член с якобианом).
        </>,
        <>Pathwise-градиент имеет меньшую дисперсию, чем REINFORCE.</>,
      ]}
    />
  </>
);

export default Section6;
