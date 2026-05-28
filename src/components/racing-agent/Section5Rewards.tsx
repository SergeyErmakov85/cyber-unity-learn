import { Card } from "@/components/ui/card";
import Math from "@/components/Math";
import CyberCodeBlock from "@/components/CyberCodeBlock";

const Section5Rewards = () => (
  <div className="space-y-8">
    {/* 5.1 Проблема разрывных функций */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">5.1. Проблема разрывных функций награды</h3>
      <p className="text-muted-foreground leading-relaxed">
        Одной из центральных проблем при проектировании DRL-агентов в непрерывных пространствах действий
        является <strong className="text-foreground">предотвращение субклинического застревания в локальных
        оптимумах политики</strong>. Использование дискретных, бинарных или пороговых наград создаёт{" "}
        <strong className="text-foreground">разрывные целевые функции первого рода</strong>.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        В таком ландшафте градиент лосс-функции становится нулевым почти во всём пространстве состояний,
        за исключением узких границ переходов. В результате агент не получает информации о том, насколько
        его плавное руление улучшает траекторию движения, что часто приводит к выбору тривиальной стратегии{" "}
        <strong className="text-foreground">полной остановки</strong> для ухода от штрафов за аварии.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        Для обеспечения плавной сходимости разработана <strong className="text-foreground">потенциальная
        функция вознаграждения</strong>: суммарная мгновенная награда{" "}
        <Math display={false}>{String.raw`r_t`}</Math> формируется как суперпозиция нескольких непрерывных
        физических полей.
      </p>
    </div>

    {/* 5.2 Общая формула */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">5.2. Общая формула награды</h3>
      <p className="text-muted-foreground leading-relaxed">
        На каждом шаге <Math display={false}>{String.raw`t`}</Math> агент получает:
      </p>
      <Math>{String.raw`r_t \;=\; \underbrace{R_{\text{cp}}\cdot \mathbb{1}[\text{cp}_t]}_{\text{чекпоинт}} \;+\; \underbrace{R_{\text{coll}}\cdot \mathbb{1}[\text{wall}_t]}_{\text{стена}} \;+\; \underbrace{\alpha \frac{v_t}{v_{\max}}}_{\text{скорость}} \;+\; \underbrace{\beta\, \langle \mathbf{f}_t, \mathbf{d}_t \rangle}_{\text{ориентация}} \;-\; \underbrace{\eta}_{\text{время}} \;-\; \underbrace{\rho\,(|\Delta s_t| + |\Delta a_t|)}_{\text{плавность}},`}</Math>
      <p className="text-sm text-muted-foreground">
        где <Math display={false}>{String.raw`\mathbf{f}_t`}</Math> — forward автомобиля,{" "}
        <Math display={false}>{String.raw`\mathbf{d}_t`}</Math> — направление на следующий чекпоинт,{" "}
        <Math display={false}>{String.raw`\Delta s_t, \Delta a_t`}</Math> — приращения руля и газа.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Компонент сонаправленности и скорости</strong>{" "}
        <Math display={false}>{String.raw`r_{\text{align}}`}</Math> поощряет движение болида в направлении
        следующего чекпоинта, масштабированное по текущей скорости:
      </p>
      <Math>{String.raw`r_{\text{align}}(t) \;=\; \begin{cases} +\,k_+\, \langle \mathbf{f}_t, \mathbf{d}_t \rangle \cdot \dfrac{v_t}{v_{\max}}, & \text{если } \langle \mathbf{f}_t, \mathbf{d}_t \rangle > 0,\\[1.4ex] -\,k_-\, \big|\langle \mathbf{f}_t, \mathbf{d}_t \rangle\big|, & \text{иначе.} \end{cases}`}</Math>
      <p className="text-sm text-muted-foreground">
        где <Math display={false}>{String.raw`k_+ \approx 0.04`}</Math> — масштабирующий коэффициент
        пошаговой награды за скорость,{" "}
        <Math display={false}>{String.raw`k_- \approx 0.02`}</Math> — коэффициент штрафа за разворот.
        Данный дизайн гарантирует, что <strong className="text-foreground">любое микроперемещение рулевого
        колеса, смещающее вектор движения ближе к апексу виража, генерирует положительную разность
        потенциалов награды</strong>.
      </p>
    </div>

    {/* 5.3 Рекомендуемые значения */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">5.3. Рекомендуемые значения коэффициентов</h3>
      <p className="text-sm text-muted-foreground">
        Опираемся на эмпирические данные сообщества и публикацию Savid et al. (MDPI Information, 2023, 14(5), 290):
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-cyan-500/20">
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Коэффициент</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Значение</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Источник / Обоснование</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[
              [String.raw`R_{\text{cp}}`,   "+1.0",       "Karting Mod: «If AI success reaching checkpoint will be given reward +1»"],
              [String.raw`R_{\text{final}}`,"+0.5",       "Savid et al. 2023: «the agent reaches the final checkpoint, a reward of 0.5 is given»"],
              [String.raw`R_{\text{coll}}`, "−1.0 + EndEpisode", "Karting Mod: «If AI hit obstacle/track AI position will be reset to the starting point and will be given penalty -1»"],
              [String.raw`\eta\text{ (time)}`, "0.0005…0.001", "Savid et al. 2023: «To incentivize speed, agents are given a small −0.001 reward (punishment)»"],
              [String.raw`\alpha\text{ (speed)}`, "0.001", "Эмпирически, сообщество ML-Agents"],
              [String.raw`\beta\text{ (orient)}`, "0.0005","Эмпирически"],
              [String.raw`\rho\text{ (smoothness)}`,"0.0002","Низкое значение — иначе агент не исследует"],
            ].map(([coeff, val, note]) => (
              <tr key={coeff} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="py-2 px-3 font-mono text-xs text-purple-300">
                  <Math display={false}>{coeff}</Math>
                </td>
                <td className="py-2 px-3 font-bold text-cyan-300 whitespace-nowrap">{val}</td>
                <td className="py-2 px-3 text-xs">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Card className="border-yellow-400/30 bg-yellow-500/5 p-4">
        <p className="text-sm text-yellow-200">
          <strong>Правило из официальной документации ML-Agents:</strong>{" "}
          «The reward assigned between each decision should be in the range [−1, 1]. Values outside this range
          can lead to unstable training.» Мгновенная награда никогда не должна превышать единицу по модулю.
        </p>
      </Card>
    </div>

    {/* 5.4 Расширенный код reward shaping */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">5.4. Полный фрагмент кода reward shaping</h3>
      <p className="text-sm text-muted-foreground">
        Реализация уже встроена в{" "}
        <code className="bg-muted/50 px-1 text-xs">CarAgent.cs</code> (метод{" "}
        <code className="bg-muted/50 px-1 text-xs">ApplyShapedReward</code>, раздел 4.8). Ниже —
        расширенный комментированный вариант:
      </p>
      <CyberCodeBlock language="csharp" filename="ApplyShapedReward (диагностическая версия)">
{`// Расширенная диагностическая версия метода
private void ApplyShapedReward(float steering, float acceleration)
{
    // 1) Постоянный штраф за каждый шаг (стимул торопиться).
    //    Эмпирически 5e-4 ... 1e-3; больше — риск, что reward «прилипнет» к -1.
    AddReward(-0.0005f);

    // 2) Премия за скорость: r_speed = α * v_long / v_max.
    //    v_long — продольная компонента; убираем поощрение за движение боком.
    float speedNorm = Mathf.Clamp01(_car.LocalVelocity.z / _car.MaxSpeed);
    AddReward(0.001f * speedNorm);

    // 3) Премия за ориентацию: r_orient = β * dot(forward, dir_to_cp).
    //    Когда машина смотрит точно на следующий чекпоинт — dot = +1.
    //    Когда движется в обратном направлении — dot = -1 (получает штраф).
    Vector3 dirToCp = (_checkpoints.GetNextCheckpointPosition() - transform.position).normalized;
    float dot = Vector3.Dot(transform.forward, dirToCp);
    AddReward(0.0005f * dot);

    // 4) Штраф за рывки управления (smoothness penalty).
    //    НЕ переусердствовать: при ρ > 0.001 агент перестаёт исследовать.
    float steerJerk = Mathf.Abs(steering - _previousSteering);
    float accelJerk = Mathf.Abs(acceleration - _previousAcceleration);
    AddReward(-0.0002f * (steerJerk + accelJerk));
}`}
      </CyberCodeBlock>
    </div>

    {/* 5.5 Reward hacking */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">5.5. Проблема reward hacking и как её избежать</h3>
      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Reward hacking</strong> — ситуация, когда агент находит
        непредвиденный способ максимизировать формальную награду, не выполняя задачу.
        Типичные случаи в гоночной симуляции:
      </p>
      <div className="space-y-4">
        {[
          {
            n: "1",
            title: "Кружение возле чекпоинта",
            solution: "Триггер срабатывает только при правильном Index; повторное пересечение того же чекпоинта не даёт награды (реализовано в RegisterCheckpoint).",
          },
          {
            n: "2",
            title: "Движение задним ходом по кругу",
            solution: "Dot-product-наблюдение + штраф −0.1 за «не тот» чекпоинт. Симптом из Unity Discussions: «8 агентов едут вправо, 2 разворачиваются и едут против потока».",
          },
          {
            n: "3",
            title: "Намеренное столкновение для рестарта",
            solution: `R_coll = −1.0, что перекрывает любую промежуточную выгоду.`,
          },
          {
            n: "4",
            title: "Подавление исследования из-за smoothness penalty",
            solution: "ρ ≤ 0.0005; на ранней стадии обучения отключайте этот компонент полностью. «In a different setup where the agent did not receive penalties for steering and reversing, the results were improved».",
          },
          {
            n: "5",
            title: "«Прилипание» к −1.0",
            solution: "Если Mean Reward стабильно равен −1.000, time penalty доминирует (1000 шагов × −0.001 = −1.000). Уменьшайте η до −0.0001.",
          },
        ].map(({ n, title, solution }) => (
          <div key={n} className="flex gap-4 p-4 rounded-xl bg-card/40 border border-white/5">
            <div className="shrink-0 w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-xs font-bold">
              {n}
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-sm text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{solution}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <Card className="border-cyan-500/20 bg-cyan-500/5 p-4">
      <p className="text-sm text-cyan-200 font-medium">
        Ключевые моменты раздела 5: награда — линейная комбинация ≤ 1 по модулю; чекпоинт +1, столкновение
        −1 + EndEpisode, остальное — малые сигналы. Reward hacking — самый частый источник «странного»
        поведения. Использование непрерывной потенциальной функции вместо порогов — необходимое условие
        сходимости.
      </p>
    </Card>
  </div>
);

export default Section5Rewards;
