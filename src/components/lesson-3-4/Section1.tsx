import Math from "@/components/Math";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints, Callout, Code } from "./_shared";

const Section1 = () => (
  <>
    <h2 id="razdel-1-bc-teoriya" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 1. Behavioral Cloning — теоретическая база
    </h2>

    <ProseP>
      <strong>Формальная постановка.</strong> Дан набор экспертных демонстраций
    </ProseP>
    <Math display>{String.raw`D_E = \{(s_i, a_i)\}_{i=1}^{N}, \qquad (s_i,a_i)\ \text{из траекторий}\ \pi_E.`}</Math>
    <ProseP>
      BC ищет параметрическую политику <Math display={false}>{String.raw`\pi_\theta`}</Math>, которая
      воспроизводит отображение «состояние → действие», игнорируя то, что в развёртывании политика сама
      меняет распределение состояний. Это стандартная задача обучения с учителем:
    </ProseP>
    <Math display>{String.raw`\hat{\pi}_{\text{sup}} = \arg\min_{\pi\in\Pi}\ \mathbb{E}_{s\sim d_{\pi^*}}\big[\ell(s,\pi)\big].`}</Math>

    <h3 className={H3_CLASS}>Целевые функции</h3>
    <ProseP>
      <strong>Дискретные действия</strong> — negative log-likelihood / кросс-энтропия:
    </ProseP>
    <Math display>{String.raw`\mathcal{L}_{BC}(\theta) = -\sum_{i=1}^{N}\log \pi_\theta(a_i\mid s_i).`}</Math>
    <ProseP>
      <strong>Непрерывные действия</strong> (как руль/газ гоночного агента) — либо MSE для
      детерминированной головы,
    </ProseP>
    <Math display>{String.raw`\mathcal{L}_{BC}(\theta) = \sum_{i=1}^{N}\big\lVert \mu_\theta(s_i)-a_i\big\rVert_2^2,`}</Math>
    <ProseP>
      либо NLL гауссовой политики{" "}
      <Math display={false}>{String.raw`\pi_\theta(a\mid s)=\mathcal{N}(a;\mu_\theta(s),\Sigma_\theta(s))`}</Math>
      :
    </ProseP>
    <Math display>{String.raw`\mathcal{L}_{BC}(\theta) = \sum_{i=1}^{N}\Big[\tfrac{1}{2}(a_i-\mu_\theta(s_i))^\top\Sigma_\theta^{-1}(s_i)(a_i-\mu_\theta(s_i)) + \tfrac{1}{2}\log\det\Sigma_\theta(s_i)\Big].`}</Math>

    <Callout title="Связь с MLE" color="cyan">
      Обе формы — это максимизация{" "}
      <Math display={false}>{String.raw`\sum_i \log\pi_\theta(a_i\mid s_i)`}</Math>: минимизация
      кросс-энтропии = MLE для категориального распределения; минимизация MSE = MLE для гауссианы с
      фиксированной диагональной ковариацией.
    </Callout>

    <h3 className={H3_CLASS}>Главная проблема — covariate shift</h3>
    <ProseP>
      Обучающие и тестовые состояния <strong>не i.i.d.</strong> (политика влияет на будущие входы), и
      малые ошибки уводят агента в области, не покрытые демонстрациями, где он ошибается ещё сильнее.
      Это и есть <strong>compounding errors</strong>.
    </ProseP>

    <Callout title="Теорема 2.1 (Ross & Bagnell, AISTATS 2010)" color="amber">
      Пусть{" "}
      <Math display={false}>{String.raw`\mathbb{E}_{s\sim d_{\pi^*}}[\ell(s,\pi)]=\epsilon`}</Math>, а
      стоимость <Math display={false}>C</Math> ограничена в <Math display={false}>[0,1]</Math>. Тогда
      <Math display>{String.raw`J(\pi)\ \le\ J(\pi^*) + T^2\epsilon.`}</Math>
      Граница <strong>тугая</strong>: существуют MDP, где она достигается. Практический смысл для
      гоночного агента: чистый BC на демо с одной трассы накапливает ошибку на длинных кругах и
      срывается с трассы в незнакомых поворотах.
    </Callout>

    <h3 className={H3_CLASS}>DAgger — линейная граница вместо квадратичной</h3>
    <ProseP>
      Ross, Gordon, Bagnell (AISTATS 2011, arXiv:1011.0686). Идея — <strong>dataset aggregation</strong>:
    </ProseP>
    <pre className="my-4 overflow-x-auto rounded-lg border border-cyan-500/20 bg-card/60 backdrop-blur-sm p-4 text-xs leading-relaxed text-foreground/90">
{`D <- D_E                       # начальный датасет экспертных пар
for i = 1..N:
    pi_i    <- обучить на D                       (supervised)
    beta_i  <- расписание смешивания (beta_1 = 1)
    pi_mix  =  beta_i * pi_E + (1 - beta_i) * pi_i
    развернуть pi_mix в среде, собрать ПОСЕЩЁННЫЕ s
    запросить у эксперта a* = pi_E(s) на этих s
    D <- D U {(s, a*)}                            # агрегация
вернуть лучшую pi_i на валидации`}
    </pre>
    <ProseP>
      Каждая <Math display={false}>{String.raw`\pi_t`}</Math> обучается на{" "}
      <strong>реальном</strong> распределении состояний, которое она встретит при исполнении. Задача
      сводится к no-regret online learning и даёт границу ошибки, <strong>линейную</strong> по{" "}
      <Math display={false}>T</Math>. Цена — интерактивный дозапрос эксперта во время обучения.
    </ProseP>

    <h3 className={H3_CLASS}>Когда BC работает, а когда — нет</h3>
    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li className="flex gap-2.5">
        <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
        <span>
          <strong>Хорошо:</strong> много демонстраций, широкое покрытие, короткий горизонт,
          квазистатичные задачи.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-red-400 mt-0.5 shrink-0">✗</span>
        <span>
          <strong>Плохо:</strong> мало демо, длинный горизонт, узкое покрытие (одна трасса), высокая
          чувствительность к отклонениям.
        </span>
      </li>
    </ul>
    <ProseP>
      Рецепты смягчения: <strong>ансамблирование</strong> политик (DRIL использует разногласие как
      сигнал неуверенности), регуляризация (<Code>dropout</Code>, weight decay), аугментация
      наблюдений и добавление «корректирующих» демо из восстановления после ошибок.
    </ProseP>

    <KeyPoints
      items={[
        <>
          BC — это MLE над парами эксперта; для непрерывного управления — MSE или NLL гауссианы.
        </>,
        <>
          Теорема Ross &amp; Bagnell даёт <Math display={false}>{String.raw`O(T^2\epsilon)`}</Math>{" "}
          границу — единственный честный диагноз «почему BC ломается на длинных эпизодах».
        </>,
        <>
          DAgger чинит квадратичность ценой онлайн-эксперта; в ML-Agents «из коробки» его нет — это
          теоретический ориентир.
        </>,
      ]}
    />
  </>
);

export default Section1;
