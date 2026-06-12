import { SECTION_TITLE_CLASS, ProseP, KeyPoints, InteractiveStub, Code } from "./_shared";

const Section12 = () => (
  <>
    <h2 id="раздел-12-диагностика" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 12. Гиперпараметры самого HPO и диагностика
    </h2>

    <ProseP>
      Парадокс: у оптимизатора гиперпараметров есть собственные гиперпараметры. На что смотреть:
    </ProseP>

    <ul className="space-y-2 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <Code>n_trials</Code> / бюджет. Сколько испытаний вы можете себе позволить. С прунингом
        эффективный охват кратно выше.
      </li>
      <li>
        <Code>n_startup_trials</Code> (TPE). Первые случайные испытания, засевающие{" "}
        <Code>ℓ</Code> и <Code>g</Code>. Слишком мало — TPE рано «зациклится» на скудной выборке.
      </li>
      <li>
        <Code>gamma</Code> (TPE). Доля «хороших». Меньше <Code>γ</Code> — агрессивнее эксплуатация,
        но рискуете по немногим примерам построить плохую <Code>ℓ</Code>.
      </li>
      <li>
        <Code>n_warmup_steps</Code> (прунер). Сколько шагов не трогать испытание. В RL ставьте с
        запасом — ранняя награда обманчива.
      </li>
    </ul>

    <ProseP>
      <strong>Диагностика результатов</strong> — три графика, которые Optuna и W&amp;B строят из
      коробки:
    </ProseP>

    <ol className="space-y-2 my-4 list-decimal list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>Importance / важность параметров</strong> (в Optuna — на основе fANOVA). Показывает,
        какие оси реально двигают метрику. Часто подтверждает тезис из раздела 4: важны лишь 2–3 из
        десяти. После этого можно зафиксировать неважные оси и сузить поиск.
      </li>
      <li>
        <strong>Parallel coordinates</strong> — каждая линия — испытание, проходящее через
        значения всех осей; цвет — метрика. Видно, в какие диапазоны «стягиваются» хорошие
        испытания.
      </li>
      <li>
        <strong>Slice plot</strong> — зависимость метрики от одной оси при прочих варьируемых.
        Помогает заметить, что, скажем, <Code>learning_rate &gt; 5e-4</Code> стабильно проваливается.
      </li>
    </ol>

    <InteractiveStub title="Parallel coordinates по trial-ам">
      JSX parallel-coordinates по таблице испытаний: оси — гиперпараметры, линии — trials, цвет —
      награда; слайдер-фильтр «показать только топ-N%». При наведении — конфигурация испытания.
      Текст подписей светлый, оси — на тёмном фоне.
    </InteractiveStub>

    <KeyPoints
      items={[
        <>
          У самого HPO есть настройки: <Code>n_trials</Code>, <Code>n_startup_trials</Code>,{" "}
          <Code>gamma</Code>, <Code>n_warmup_steps</Code>.
        </>,
        <>Importance-график (fANOVA) выявляет реально важные оси — обычно их 2–3.</>,
        <>Parallel-coordinates и slice plot показывают, в какие диапазоны стягиваются хорошие конфигурации.</>,
        <>Цикл: грубый широкий поиск → анализ важности → сужение пространства → точный поиск.</>,
      ]}
    />
  </>
);

export default Section12;
