import Math from "@/components/Math";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Callout } from "./_shared";

const PRUNE_PSEUDO = `# Прунинг на основе Successive Halving (Optuna, Algorithm 1)
# Вход: испытание trial, текущий шаг step,
#       минимальный ресурс r, фактор сокращения eta,
#       минимальный rate ранней остановки s.
# Выход: true — отсечь испытание, false — продолжить.

rung = max(0, floor(log_eta(step / r)) - s)
if step != r * eta^(s + rung):
    return false                      # ещё не контрольная точка этого rung'а
value      = промежуточное_значение(trial, step)
all_values = промежуточные_значения_всех(step)
top_k      = лучшие(all_values, floor(|all_values| / eta))
if top_k пусто:
    top_k = лучшие(all_values, 1)
return value не входит в top_k         # хуже топ-1/eta → отсечь
`;

const Section7 = () => (
  <>
    <h2 id="раздел-7-прунинг" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 7. Прунинг: ранняя остановка бесперспективных испытаний
    </h2>

    <ProseP>
      Умный выбор <em>какую конфигурацию пробовать</em> — это половина дела. Вторая половина —{" "}
      <strong>не доводить до конца заведомо плохие испытания</strong>. Если через 20% бюджета шагов
      агент учится явно хуже остальных, незачем дообучать его до конца. Это и есть{" "}
      <strong>прунинг (pruning)</strong> — он же автоматическая ранняя остановка (не путать с early
      stopping против переобучения).
    </ProseP>

    <ProseP>
      Прунинг работает в два такта: (1) периодически смотрим на промежуточное качество испытания,
      (2) убиваем те, что не дотягивают до условия.
    </ProseP>

    <ProseP>
      <strong>Median pruner</strong> — самый простой: на каждом контрольном шаге отсеки испытание,
      если его промежуточный результат хуже медианы по всем испытаниям на этом же шаге.
    </ProseP>

    <ProseP>
      <strong>Successive Halving (SHA)</strong> — мощнее. Раздай всем кандидатам маленький бюджет;
      оставь лучшую долю <Math display={false}>{String.raw`1/\eta`}</Math>; удвой (умножь на{" "}
      <Math display={false}>{String.raw`\eta`}</Math>) бюджет выжившим; повтори. «Раунды» называют
      <strong> rung&apos;ами</strong>, <Math display={false}>{String.raw`\eta`}</Math> — фактор
      сокращения (обычно <Math display={false}>{String.raw`\eta = 3`}</Math>). Так почти весь
      бюджет уходит на немногих перспективных. Вот как это устроено в Optuna (упрощённо, по статье
      Akiba et al. 2019):
    </ProseP>

    <CyberCodeBlock language="python" filename="successive_halving.pseudo">
      {PRUNE_PSEUDO}
    </CyberCodeBlock>

    <ProseP>
      <strong>ASHA (Asynchronous SHA)</strong> — это SHA для распределёнки: каждый воркер
      асинхронно решает, продвигать ли испытание, не дожидаясь остальных. Поэтому ASHA{" "}
      <strong>линейно масштабируется</strong> по числу воркеров — это и есть прунер по умолчанию в
      Optuna.
    </ProseP>

    <ProseP>
      <strong>Hyperband</strong> надстраивается над SHA. У SHA есть дилемма: при бюджете{" "}
      <Math display={false}>{String.raw`B`}</Math> и <Math display={false}>{String.raw`n`}</Math>{" "}
      кандидатах каждый получает в среднем <Math display={false}>{String.raw`B/n`}</Math> — много
      кандидатов с маленьким бюджетом (рискуем зарубить «медленный старт») против немногих с
      большим. Hyperband запускает несколько «брекетов» SHA с разными{" "}
      <Math display={false}>{String.raw`n`}</Math>, перебирая этот компромисс. Число брекетов
      определяется так:
    </ProseP>

    <Math>{String.raw`\text{число брекетов} = \left\lfloor \log_{\eta}\!\frac{R_{\max}}{R_{\min}} \right\rfloor + 1,`}</Math>

    <ProseP>
      где <Math display={false}>{String.raw`R_{\min}, R_{\max}`}</Math> — минимальный и
      максимальный ресурс на испытание.
    </ProseP>

    <ProseP>
      Эффект прунинга огромен. В оригинальной статье Optuna прунинг позволил за то же время
      вычислительного бюджета прогнать на порядки больше испытаний: например, в одном эксперименте
      TPE без прунинга успевал ~36 испытаний, а TPE с прунингом — больше тысячи (подавляющее
      большинство — отсечённые на ранних шагах).
    </ProseP>

    <Callout title="⚠️ Важно" color="amber">
      Прунинг по промежуточному результату корректен, только если «промежуток» предсказывает
      «итог». В RL награда шумна и немонотонна, поэтому ставьте <code>n_warmup_steps</code> — не
      отсекайте, пока агент не прошёл стадию разогрева. Слишком агрессивный прунинг зарубит
      конфигурации с медленным, но в итоге лучшим стартом.
    </Callout>

    <KeyPoints
      items={[
        <>Прунинг убивает бесперспективные испытания по промежуточному качеству — экономит огромную долю бюджета.</>,
        <>Median pruner отсекает то, что хуже медианы на текущем шаге.</>,
        <>
          SHA/ASHA: оставляй лучшую долю <Math display={false}>{String.raw`1/\eta`}</Math>,
          наращивай бюджет выжившим; ASHA масштабируется линейно по воркерам (дефолт Optuna).
        </>,
        <>Hyperband перебирает компромисс «много кандидатов × мало бюджета» через брекеты SHA.</>,
        <>
          В RL добавляйте <code>n_warmup_steps</code>: ранняя награда шумна и может обмануть прунер.
        </>,
      ]}
    />
  </>
);

export default Section7;
