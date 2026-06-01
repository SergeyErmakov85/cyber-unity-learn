import Math from "@/components/Math";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints, InteractiveStub } from "./_shared";

const Section5 = () => (
  <>
    <h2 className={SECTION_TITLE_CLASS}>
      Раздел 5. Два Q-критика (clipped double-Q) и target-сети
    </h2>

    <h3 className={H3_CLASS}>Проблема: Q-обучение переоценивает ценность</h3>

    <ProseP>
      Любой метод, обучающий <Math display={false}>{String.raw`Q`}</Math> через бутстрэп (цель
      содержит саму оценку <Math display={false}>{String.raw`Q`}</Math>), страдает{" "}
      <strong>смещением переоценки (overestimation bias)</strong>. Берём шумную оценку, прогоняем
      через операцию максимума/минимума — и систематически завышаем значения. Завышенные{" "}
      <Math display={false}>{String.raw`Q`}</Math> толкают политику к ложно-привлекательным
      действиям, обучение разваливается. Это известная болезнь DDPG.
    </ProseP>

    <h3 className={H3_CLASS}>Решение: clipped double-Q</h3>

    <ProseP>
      SAC заводит <strong>две независимые Q-сети</strong>{" "}
      <Math display={false}>{String.raw`Q_{\theta_1}, Q_{\theta_2}`}</Math> с разной инициализацией.
      При формировании цели берётся <strong>минимум</strong> из двух (трюк из TD3, Fujimoto et al.
      2018):
    </ProseP>

    <Math>{String.raw`\boxed{\;
y = r(s_t,a_t) + \gamma\Big(\, \min_{i=1,2} Q_{\bar\theta_i}(s_{t+1}, a_{t+1}) \;-\; \alpha\log\pi_\phi(a_{t+1}\mid s_{t+1})\,\Big),
\qquad a_{t+1}\sim\pi_\phi(\cdot\mid s_{t+1})
\;}`}</Math>

    <ProseP>
      Минимум из двух оценок — намеренно пессимистичен: он гасит переоценку. Обе сети обучаются
      независимо на <strong>soft Bellman residual</strong> (уравнение (5)):
    </ProseP>

    <Math>{String.raw`J_Q(\theta_i) = \mathbb{E}_{(s_t,a_t)\sim\mathcal{D}}\left[\tfrac{1}{2}\Big( Q_{\theta_i}(s_t,a_t) - y \Big)^2\right],
\qquad i\in\{1,2\}.`}</Math>

    <ProseP>
      Авторы отмечают: один критик тоже работает (даже на 21-мерном Humanoid), но{" "}
      <strong>два критика заметно ускоряют обучение</strong> на сложных задачах.
    </ProseP>

    <h3 className={H3_CLASS}>
      Target-сети и медленное обновление <Math display={false}>{String.raw`\tau`}</Math> (soft update)
    </h3>

    <ProseP>
      Если цель <Math display={false}>{String.raw`y`}</Math> считать теми же сетями, что и обучаем,
      она «убегает» вместе с ними — обучение нестабильно (собака гонится за собственным хвостом).
      Поэтому в цели <Math display={false}>{String.raw`y`}</Math> используются{" "}
      <strong>target-сети</strong> <Math display={false}>{String.raw`Q_{\bar\theta_i}`}</Math> —
      медленно отстающие копии. После каждого шага их веса подтягиваются к основным экспоненциальным
      скользящим средним (Polyak averaging):
    </ProseP>

    <Math>{String.raw`\boxed{\;
\bar\theta_i \leftarrow \tau\,\theta_i + (1-\tau)\,\bar\theta_i
\;}`}</Math>

    <ProseP>
      Параметр <Math display={false}>{String.raw`\tau`}</Math> —{" "}
      <strong>коэффициент сглаживания target</strong> (target smoothing coefficient):
    </ProseP>

    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <Math display={false}>{String.raw`\tau = 1`}</Math> — жёсткое копирование (target = основная
        сеть на каждом шаге) → нестабильно.
      </li>
      <li>
        <Math display={false}>{String.raw`\tau`}</Math> маленькое (например{" "}
        <Math display={false}>{String.raw`0.005`}</Math>) — цель движется очень медленно → стабильно,
        но медленнее.
      </li>
      <li>
        <Math display={false}>{String.raw`\tau = 0`}</Math> — target вообще не обновляется.
      </li>
    </ul>

    <ProseP>
      В экспериментах Haarnoja <Math display={false}>{String.raw`\tau = 0.005`}</Math> работает
      практически на всех задачах; диапазон подходящих значений широкий. В Unity ML-Agents это поле
      так и называется — <code className="px-1 rounded bg-muted/50 text-xs font-mono">tau</code> — с
      дефолтом <code className="px-1 rounded bg-muted/50 text-xs font-mono">0.005</code>.
    </ProseP>

    <InteractiveStub title="Интерактив: влияние τ на стабильность">
      График обучения с тремя кривыми для{" "}
      <Math display={false}>{String.raw`\tau\in\{0.0001, 0.005, 0.05\}`}</Math>: при большом{" "}
      <Math display={false}>{String.raw`\tau`}</Math> кривая дёргается/расходится (нестабильность),
      при крошечном — ползёт медленно, при{" "}
      <Math display={false}>{String.raw`0.005`}</Math> — гладко и быстро. (Воспроизводит рис. 3c из
      статьи.)
    </InteractiveStub>

    <KeyPoints
      items={[
        <>
          Бутстрэп-обучение <Math display={false}>{String.raw`Q`}</Math> переоценивает ценность →
          нестабильность.
        </>,
        <>
          Clipped double-Q: две сети, в цели берём{" "}
          <Math display={false}>{String.raw`\min`}</Math> → пессимизм гасит переоценку.
        </>,
        <>
          Target-сети не дают цели «убегать»; обновляются медленно:{" "}
          <Math display={false}>{String.raw`\bar\theta\leftarrow\tau\theta+(1-\tau)\bar\theta`}</Math>
          .
        </>,
        <>
          <Math display={false}>{String.raw`\tau=0.005`}</Math> — надёжный дефолт.
        </>,
      ]}
    />
  </>
);

export default Section5;
