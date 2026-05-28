import { Card } from "@/components/ui/card";
import CyberCodeBlock from "@/components/CyberCodeBlock";

const Section7TensorBoard = () => (
  <div className="space-y-8">
    <p className="text-muted-foreground leading-relaxed">
      Интегрированный пакет логирования ML-Agents экспортирует детальную телеметрию обучения в формате
      бинарных логов событий, которые интерпретируются веб-интерфейсом{" "}
      <strong className="text-foreground">TensorBoard</strong>.
    </p>

    {/* 7.1 Запуск */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">7.1. Запуск</h3>
      <CyberCodeBlock language="pseudo" filename="terminal">
{`tensorboard --logdir=results --port=6006
# Откройте в браузере http://localhost:6006`}
      </CyberCodeBlock>
    </div>

    {/* 7.2 Ключевые метрики */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">7.2. Ключевые метрики</h3>
      <p className="text-sm text-muted-foreground">
        Из официальной документации <code className="bg-muted/50 px-1 text-xs">Using-Tensorboard.md</code>:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-cyan-500/20">
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Метрика</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Что означает</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Здоровое поведение</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground text-xs">
            {[
              ["Environment/Cumulative Reward", "Средняя суммарная награда за эпизод",           "«Should increase during a successful training session»"],
              ["Environment/Episode Length",    "Средняя длина эпизода",                         "Растёт по мере того как агент перестаёт врезаться"],
              ["Policy/Entropy (PPO/SAC)",       "Случайность политики",                          "«Should slowly decrease during a successful training process»"],
              ["Policy/Learning Rate",           "Текущий learning rate",                         "Падает (если linear schedule)"],
              ["Policy/Extrinsic Reward",        "Награда от среды",                              "Растёт (то же, что Cumulative)"],
              ["Policy/Value Estimate",          "Средняя V(s)",                                  "«Should increase during a successful training session»"],
              ["Policy/Entropy Coefficient",     "α — текущая температура (SAC)",                 "Адаптируется автоматически"],
              ["Losses/Policy Loss",             "Магнитуда policy loss",                          "«Magnitude should decrease during a successful training session»"],
              ["Losses/Value Loss",              "MSE предсказания V",                            "«Should increase while learning, then decrease once reward stabilizes»"],
            ].map(([metric, what, behavior]) => (
              <tr key={metric} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="py-2 px-3 font-mono text-purple-300 text-xs font-medium whitespace-nowrap">{metric}</td>
                <td className="py-2 px-3">{what}</td>
                <td className="py-2 px-3 text-muted-foreground/70 italic">{behavior}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* 7.3 Интерпретация графиков */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">7.3. Интерпретация графиков</h3>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-card/40 border border-cyan-500/20 space-y-2">
          <p className="text-sm font-semibold text-cyan-300">Cumulative Reward</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            График должен демонстрировать <strong className="text-foreground">строго монотонный
            логарифмический рост с постепенным выходом на плато</strong>. Если кривая совершает резкие
            скачкообразные падения — агент нашёл новую опасную траекторию или застрял у стены.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card/40 border border-purple-500/20 space-y-2">
          <p className="text-sm font-semibold text-purple-300">Policy/Entropy</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            На начальной фазе обучения (<strong className="text-foreground">до 500k шагов</strong>) должна
            удерживаться на высоких значениях, подтверждая активное исследование. По мере накопления опыта —
            плавно и непрерывно снижаться.{" "}
            <strong className="text-foreground">Внезапное обрушение энтропии к нулю на ранних шагах указывает
            на коллапс политики</strong>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card/40 border border-pink-500/20 space-y-2">
          <p className="text-sm font-semibold text-pink-300">Losses/Value Loss</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            В здоровом процессе — сначала <strong className="text-foreground">резкий подъём</strong>,
            отражающий высокую неопределённость при столкновении с новыми состояниями, затем{" "}
            <strong className="text-foreground">плавное снижение до значений менее 0.01</strong>. Если
            выброс или долгосрочный рост — некорректная структура наград или высокая дисперсия оценок.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card/40 border border-emerald-500/20 space-y-2">
          <p className="text-sm font-semibold text-emerald-300">Policy/Learning Rate</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Для PPO — <strong className="text-foreground">линейно затухает до нуля</strong> к концу сессии.
            Для SAC — остаётся стабильной константой, гарантируя непрерывную адаптацию к буферу опыта.
          </p>
        </div>
      </div>
    </div>

    {/* Диагностические паттерны */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">Диагностические паттерны</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
          <p className="text-sm font-semibold text-emerald-300">✓ Здоровое обучение</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>Cumulative Reward растёт монотонно</li>
            <li>Entropy плавно падает ~3.0 → ~1.0</li>
            <li>Policy Loss сначала растёт, потом затухает</li>
            <li>Value Loss стабилизируется в пределах &lt;0.01</li>
          </ul>
        </Card>

        <Card className="border-red-500/20 bg-red-500/5 p-4 space-y-2">
          <p className="text-sm font-semibold text-red-300">✗ Признаки нестабильности</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>Резкое падение reward → уменьши learning_rate или epsilon</li>
            <li>Entropy ≈ 0 на ранней стадии → увеличь beta / init_entcoef</li>
            <li>Reward «прилип» к −1.0 → слишком большой time penalty</li>
            <li>Episode Length не растёт → добавь dot-product ориентации</li>
          </ul>
        </Card>

        <Card className="border-orange-500/20 bg-orange-500/5 p-4 space-y-2">
          <p className="text-sm font-semibold text-orange-300">⚠ Признаки переобучения</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>На тренировочной трассе reward высокий…</li>
            <li>…но на тестовой (зеркальной) обнуляется</li>
            <li>Решение: рандомизация стартов, ↑ beta, обучение на нескольких трассах</li>
          </ul>
        </Card>
      </div>
    </div>

    {/* 7.4 Сравнение нескольких запусков */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">7.4. Сравнение нескольких запусков</h3>
      <CyberCodeBlock language="pseudo" filename="terminal">
{`mlagents-learn config/ppo_oval.yaml --run-id=oval_ppo_lr3e4
mlagents-learn config/ppo_oval.yaml --run-id=oval_ppo_lr1e4
# В TensorBoard оба run-id видны одновременно; можно отключать чекбоксами слева.`}
      </CyberCodeBlock>
    </div>

    <Card className="border-cyan-500/20 bg-cyan-500/5 p-4">
      <p className="text-sm text-cyan-200 font-medium">
        Ключевые моменты раздела 7: главные графики для ежедневного контроля —{" "}
        <code className="bg-muted/50 px-1 text-xs">Cumulative Reward</code>,{" "}
        <code className="bg-muted/50 px-1 text-xs">Episode Length</code>,{" "}
        <code className="bg-muted/50 px-1 text-xs">Policy/Entropy</code>,{" "}
        <code className="bg-muted/50 px-1 text-xs">Losses/Value Loss</code>.
        Здоровый Value Loss держится в пределах &lt;0.01 после стабилизации.
      </p>
    </Card>
  </div>
);

export default Section7TensorBoard;
