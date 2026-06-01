import { SECTION_TITLE_CLASS, ProseP, KeyPoints } from "./_shared";

const ROWS: Array<{ c: string; ppo: string; sac: string }> = [
  {
    c: "Переиспользование данных",
    ppo: "Нет: батч используется 1–несколько раз и выбрасывается",
    sac: "Да: replay buffer, каждый переход живёт долго",
  },
  {
    c: "Экономия данных (sample efficiency)",
    ppo: "Низкая — нужны миллионы шагов среды",
    sac: "Высокая — учится за меньшее число шагов",
  },
  {
    c: "Стоимость одного шага среды",
    ppo: "Терпимо, если шаг дёшев",
    sac: "Критично выгоден, если шаг дорог (сложная физика, реальный робот)",
  },
  {
    c: "Цель",
    ppo: "Награда + энтропия как регуляризатор (beta)",
    sac: "Награда + энтропия как часть цели (max-ent)",
  },
  {
    c: "Исследование",
    ppo: "Через стохастичность политики + энтропийный штраф",
    sac: "Богатое, встроенное в цель; автоподстройка α",
  },
  {
    c: "Стабильность между запусками",
    ppo: "Хорошая, предсказуемая",
    sac: "Очень хорошая (энтропия стабилизирует)",
  },
  {
    c: "Чувствительность к гиперпараметрам",
    ppo: "Низкая — «прощающий» алгоритм",
    sac: "Средняя; чувствителен к масштабу награды (решается автоподстройкой α)",
  },
  {
    c: "Пространства действий",
    ppo: "Непрерывные и дискретные",
    sac: "Заточен под непрерывные (для дискретных нужны адаптации)",
  },
  {
    c: "Память (CPU/RAM)",
    ppo: "Скромная",
    sac: "Выше: хранит большой буфер + 2 критика + target-сети",
  },
  {
    c: "Вычисления на шаг среды",
    ppo: "Меньше градиентных операций",
    sac: "Больше (несколько обновлений сетей на шаг)",
  },
  {
    c: "Поддержка LSTM/памяти в ML-Agents",
    ppo: "Хорошая",
    sac: "Хуже работает с непрерывными + LSTM (см. доку)",
  },
  {
    c: "Когда выбирать",
    ppo: "Шаги среды дёшевы; нужна простота и надёжность; есть дискретные действия",
    sac: "Шаги среды дороги; нужна максимальная экономия данных; непрерывное управление",
  },
];

const Section10 = () => (
  <>
    <h2 className={SECTION_TITLE_CLASS}>Раздел 10. Сравнение SAC vs PPO</h2>

    <div className="rounded-xl border border-cyan-500/20 bg-background/40 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-card/95 backdrop-blur">
            <tr className="border-b border-cyan-500/30">
              <th className="text-left px-4 py-3 text-muted-foreground font-bold w-[24%]">
                Критерий
              </th>
              <th className="text-left px-4 py-3 text-purple-300 font-bold w-[38%]">
                PPO (on-policy)
              </th>
              <th className="text-left px-4 py-3 text-cyan-300 font-bold w-[38%]">
                SAC (off-policy)
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr
                key={r.c}
                className={`border-b border-border/30 align-top ${
                  i % 2 === 0 ? "bg-background/0" : "bg-card/30"
                }`}
              >
                <td className="px-4 py-3 font-semibold text-foreground/90">{r.c}</td>
                <td className="px-4 py-3 text-foreground/80">{r.ppo}</td>
                <td className="px-4 py-3 text-foreground/80">{r.sac}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="mt-6">
      <ProseP>
        <strong>Резюме.</strong> PPO — «рабочая лошадка»: прост, надёжен, универсален. SAC —
        «спортивный болид»: выжимает максимум обучения из каждого шага среды и отлично исследует, но
        требует больше памяти/вычислений на шаг и аккуратности с масштабом награды. В экспериментах
        Haarnoja SAC обгонял и PPO, и DDPG, и TD3 по скорости обучения и финальному качеству на
        сложных непрерывных задачах (Humanoid, Ant, Walker2d), особенно на самых трудных.
      </ProseP>
    </div>

    <KeyPoints
      items={[
        <>
          PPO: проще, надёжнее, универсальнее (включая дискретные действия), но прожорлив по данным.
        </>,
        <>
          SAC: экономнее по данным, лучше исследует, стабильнее — ценой памяти/вычислений на шаг.
        </>,
        <>Выбор = «насколько дорог шаг среды» × «непрерывны ли действия».</>,
      ]}
    />
  </>
);

export default Section10;
