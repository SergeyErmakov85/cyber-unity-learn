import { SECTION_TITLE_CLASS, ProseP, KeyPoints } from "./_shared";

type Row = [string, string, string, string, string, string];

const ROWS: Row[] = [
  ["Grid search", "Нет", "Нет", "Только дискретные", "Тривиальный", "Очень мало осей (1–2), нужна полнота перебора"],
  ["Random search", "Нет", "Опционально", "Да", "Тривиальный", "Baseline; первая разведка пространства"],
  ["TPE (Optuna дефолт)", "Да", "Да (ASHA/Median)", "Да, естественно", "Хороший", "Дефолт для большинства RL-задач"],
  ["GP-BO / W&B bayes", "Да", "Опц. (hyperband)", "Слабо", "Плохой (последовательный)", "Мало непрерывных осей, дорогие испытания"],
  ["CMA-ES", "Да", "Да", "Только непрерывные", "Хороший", "Много коррелированных непрерывных осей"],
];

const Section10 = () => (
  <>
    <h2 id="раздел-10-сравнение" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 10. Сравнение стратегий
    </h2>

    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border border-cyan-500/20 rounded-lg overflow-hidden">
        <thead className="bg-muted/30">
          <tr>
            {["Стратегия", "Учится на истории", "Прунинг", "Условные/категор. оси", "Параллелизм", "Когда брать"].map((h) => (
              <th key={h} className="text-left p-3 text-foreground font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-cyan-500/10 text-foreground/85">
          {ROWS.map((r) => (
            <tr key={r[0]}>
              <td className="p-3 font-semibold text-cyan-300">{r[0]}</td>
              {r.slice(1).map((c, i) => (
                <td key={i} className="p-3">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <ProseP>
      Практический рецепт для RL: начните с <strong>random search</strong> для грубой разведки,
      затем переключитесь на <strong>TPE + ASHA-прунинг</strong> для тонкой настройки. GP-BO
      приберегите для случаев, когда осей мало, а каждое испытание невыносимо дорогое.
    </ProseP>

    <KeyPoints
      items={[
        <>Grid — только для 1–2 осей; random — обязательный baseline и разведка.</>,
        <>TPE + ASHA — разумный дефолт для RL: учится, прунит, тянет условные оси, параллелится.</>,
        <>GP-BO — для немногих непрерывных осей; CMA-ES — для многих коррелированных непрерывных.</>,
      ]}
    />
  </>
);

export default Section10;
