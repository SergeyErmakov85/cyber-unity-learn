import Math from "@/components/Math";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints } from "./_shared";

const ROWS: Array<{ label: string; bc: string; dagger: string; gail: string; airl: string; ppo: string }> = [
  { label: "Доступ к эксперту во время обучения", bc: "Нет (offline)", dagger: "Да (интерактивно)", gail: "Нет", airl: "Нет", ppo: "—" },
  { label: "Нужна среда (взаимодействие)", bc: "Нет", dagger: "Да", gail: "Да", airl: "Да", ppo: "Да" },
  { label: "Нужна функция награды", bc: "Нет", dagger: "Нет", gail: "Нет", airl: "Нет", ppo: "Да" },
  { label: "Устойчивость к covariate shift", bc: "Низкая O(T²ε)", dagger: "Высокая O(Tε)", gail: "Высокая", airl: "Высокая", ppo: "Н/Д" },
  { label: "Требуемое число демо", bc: "Много", dagger: "Среднее + дозапросы", gail: "Мало", airl: "Мало", ppo: "0" },
  { label: "Шаги среды (стоимость)", bc: "Минимум", dagger: "Средне", gail: "Высоко (млн)", airl: "Высоко", ppo: "Высоко" },
  { label: "Восстанавливает функцию награды", bc: "Нет", dagger: "Нет", gail: "Нет", airl: "Да (disentangled)", ppo: "Н/Д" },
  { label: "Типичная зона применения", bc: "Warmup, много данных", dagger: "Эксперт онлайн", gail: "Мало демо, «стиль»", airl: "Переносимая награда", ppo: "Есть хорошая награда" },
];

const Section5 = () => (
  <>
    <h2 id="razdel-5-sravnenie" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 5. Сравнительная таблица
    </h2>

    <ProseP>
      Один взгляд на пять подходов — где у каждого свой угол атаки. Полезно держать перед глазами,
      когда выбираете рецепт под конкретный проект.
    </ProseP>

    <div className="overflow-x-auto rounded-2xl border border-cyan-500/20 bg-card/60 backdrop-blur-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-foreground/90 border-b border-cyan-500/20">
            <th className="p-3 font-semibold">Критерий</th>
            <th className="p-3 font-semibold text-cyan-300">BC</th>
            <th className="p-3 font-semibold text-purple-300">DAgger</th>
            <th className="p-3 font-semibold text-pink-300">GAIL</th>
            <th className="p-3 font-semibold text-emerald-300">AIRL</th>
            <th className="p-3 font-semibold text-amber-300">PPO</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.label} className="border-t border-cyan-500/10 align-top">
              <td className="p-3 text-foreground/85">{r.label}</td>
              <td className="p-3 text-foreground/80">{r.bc}</td>
              <td className="p-3 text-foreground/80">{r.dagger}</td>
              <td className="p-3 text-foreground/80">{r.gail}</td>
              <td className="p-3 text-foreground/80">{r.airl}</td>
              <td className="p-3 text-foreground/80">{r.ppo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <KeyPoints
      items={[
        <>
          GAIL и AIRL дешевле всех по числу демо, но дороже всех по шагам среды.
        </>,
        <>
          Граница ошибки BC квадратична по горизонту{" "}
          <Math display={false}>T</Math>; DAgger линеаризует её ценой онлайн-эксперта.
        </>,
        <>
          AIRL — единственный из списка, кто возвращает <em>переносимую награду</em>.
        </>,
      ]}
    />
  </>
);

export default Section5;
