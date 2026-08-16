import React from "react";
import { BookOpen, Brain, TrendingUp, Settings2 } from "lucide-react";
import Math from "@/components/Math";

const Part4Optimization = () => (
  <>
    {/* Lecture 1 */}
    <Section icon={<BookOpen className="w-5 h-5 text-primary" />} title="Лекция 1. Основы RL и оптимизация политики">
      <p>
        Обучение с подкреплением заключается в том, что <strong className="text-foreground">агент</strong> взаимодействует с <strong className="text-foreground">окружением</strong> в дискретные моменты времени. На каждом шаге агент наблюдает состояние <Math display={false}>{`S_t`}</Math>, выбирает действие <Math display={false}>{`A_t`}</Math> по своей политике и получает вознаграждение <Math display={false}>{`\\enfTgt{R}_{t+1}`}</Math> вместе с новым состоянием <Math display={false}>{`S_{t+1}`}</Math>.
      </p>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="целевая-функция-политики">Целевая функция политики</h3>
      <p>Если политика параметризована вектором <Math display={false}>{`\\enfPar{\\theta}`}</Math>, её полезность определяется как:</p>
      <Math>{`\\enfTgt{J}(\\enfPar{\\theta}) = \\mathbb{E}_{\\pi_\\theta}\\left[\\sum_{t=0}^{T} \\enfPar{\\gamma}^t \\enfTgt{R}_t\\right]`}</Math>
      <p>
        где <Math display={false}>{`0 \\le \\enfPar{\\gamma} < 1`}</Math> — коэффициент дисконтирования будущих вознаграждений. Для нахождения оптимальных параметров выполняется <strong className="text-foreground">градиентный подъём</strong> по <Math display={false}>{`\\enfPar{\\theta}`}</Math>.
      </p>

      <InfoBox color="primary" title="Unity ML-Agents">
        <p className="text-sm">
          В Unity ML-Agents логика агента инкапсулирована в нейросети с параметрами <Math display={false}>{`\\enfPar{\\theta}`}</Math>. Среда Unity передаёт опыты (состояния, действия, вознаграждения) в Python-тренер, где происходит накопление градиентов и обновление параметров.
        </p>
      </InfoBox>
    </Section>

    {/* Lecture 2 */}
    <Section icon={<Brain className="w-5 h-5 text-secondary" />} title="Лекция 2. Вывод градиента политики">
      <p>
        Представим <Math display={false}>{`\\enfTgt{J}(\\enfPar{\\theta})`}</Math> как ожидание по траекториям <Math display={false}>{`\\enfVar{\\tau} = (\\enfVar{s}_0, a_0, \\enfVar{s}_1, a_1, \\dots, \\enfVar{s}_T)`}</Math>:
      </p>
      <Math>{`\\enfTgt{J}(\\enfPar{\\theta}) = \\int P(\\enfVar{\\tau} \\mid \\enfPar{\\theta})\\;\\enfTgt{R}(\\enfVar{\\tau})\\,\\mathrm{d}\\tau`}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="шаг-1-дифференцирование-под-знаком-интеграла">Шаг 1: Дифференцирование под знаком интеграла</h3>
      <Math>{`\\enfOp{\\nabla}_{\\theta} \\enfTgt{J}(\\enfPar{\\theta}) = \\int \\enfOp{\\nabla}_{\\theta} P(\\enfVar{\\tau} \\mid \\enfPar{\\theta})\\;\\enfTgt{R}(\\enfVar{\\tau})\\,\\mathrm{d}\\tau`}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="шаг-2-трюк-с-логарифмом">Шаг 2: Трюк с логарифмом</h3>
      <p>Используем <Math display={false}>{`\\enfOp{\\nabla}_{\\theta}P = P\\,\\enfOp{\\nabla}_{\\theta}\\log P`}</Math>:</p>
      <Math>{`\\enfOp{\\nabla}_{\\theta} \\enfTgt{J}(\\enfPar{\\theta}) = \\mathbb{E}_{\\tau\\sim \\pi_\\theta}\\!\\big[\\enfOp{\\nabla}_{\\theta}\\log P(\\enfVar{\\tau} \\mid \\enfPar{\\theta})\\;\\enfTgt{R}(\\enfVar{\\tau})\\big]`}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="шаг-3-упрощение">Шаг 3: Упрощение</h3>
      <p>Переходы среды не зависят от <Math display={false}>{`\\enfPar{\\theta}`}</Math>:</p>
      <Math>{`\\enfOp{\\nabla}_{\\theta}\\log P(\\enfVar{\\tau} \\mid \\enfPar{\\theta}) = \\sum_{t=0}^T \\enfOp{\\nabla}_{\\theta}\\log \\pi_\\theta(a_t \\mid \\enfVar{s}_t)`}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="шаг-4-формула-reinforce">Шаг 4: Формула REINFORCE</h3>
      <Math>{`\\enfOp{\\nabla}_{\\theta} \\enfTgt{J}(\\enfPar{\\theta}) = \\mathbb{E}_{\\tau\\sim \\pi_\\theta}\\Big[\\sum_{t=0}^T \\enfOp{\\nabla}_{\\theta}\\log \\pi_\\theta(a_t \\mid \\enfVar{s}_t)\\;\\enfTgt{R}(\\enfVar{\\tau})\\Big]`}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="шаг-5-reward-to-go">Шаг 5: Reward-to-go</h3>
      <p>Вместо <Math display={false}>{`\\enfTgt{R}(\\enfVar{\\tau})`}</Math> используем <Math display={false}>{`\\enfOp{G}_t = \\sum_{k=t}^T \\enfPar{\\gamma}^{k-t} \\enfTgt{R}_k`}</Math>:</p>
      <Math>{`\\enfOp{\\nabla}_{\\theta} \\enfTgt{J}(\\enfPar{\\theta}) = \\mathbb{E}_{\\pi_\\theta}\\Big[\\sum_{t=0}^T \\enfOp{\\nabla}_{\\theta}\\log \\pi_\\theta(a_t \\mid \\enfVar{s}_t)\\;\\enfOp{G}_t\\Big]`}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="шаг-6-базис-и-advantage">Шаг 6: Базис и Advantage</h3>
      <p>
        Вычитание функции <Math display={false}>{`b(\\enfVar{s}_t)`}</Math> снижает дисперсию без смещения. Оптимальный базис — оценка <Math display={false}>{`\\enfOp{V}^\\pi(\\enfVar{s})`}</Math>, что даёт <strong className="text-foreground">advantage</strong>:
      </p>
      <Math>{`A(\\enfVar{s}_t, a_t) = \\enfOp{G}_t - \\enfOp{V}^\\pi(\\enfVar{s}_t)`}</Math>
      <p>Итоговая формула градиента:</p>
      <Math>{`\\enfOp{\\nabla}_{\\theta} \\enfTgt{J}(\\enfPar{\\theta}) = \\mathbb{E}\\Big[\\sum_{t} \\enfOp{\\nabla}_{\\theta}\\log \\pi_\\theta(a_t \\mid \\enfVar{s}_t)\\;A(\\enfVar{s}_t, a_t)\\Big]`}</Math>

      <InfoBox color="secondary" title="Практическое значение">
        <p className="text-sm">
          Эта формула позволяет оценивать градиент по сэмплам из среды. В Unity ML-Agents именно на этой основе строится обучение: собираются траектории, вычисляются преимущества, и параметры <Math display={false}>{`\\enfPar{\\theta}`}</Math> обновляются в направлении градиента.
        </p>
      </InfoBox>
    </Section>

    {/* Lecture 3 */}
    <Section icon={<TrendingUp className="w-5 h-5 text-accent" />} title="Лекция 3. Градиентный спуск и его варианты">
      <p>После оценки <Math display={false}>{`\\enfOp{\\nabla}_{\\theta}\\enfTgt{J}(\\enfPar{\\theta})`}</Math> параметры обновляются по правилу:</p>
      <Math>{`\\enfPar{\\theta}_{\\text{new}} = \\enfPar{\\theta}_{\\text{old}} + \\enfPar{\\alpha}\\,\\enfOp{\\nabla}_{\\theta}\\enfTgt{J}(\\enfPar{\\theta}_{\\text{old}})`}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="1-momentum">1. Momentum</h3>
      <Math>{`v_t = \\enfPar{\\beta}_1\\,v_{t-1} + (1-\\enfPar{\\beta}_1)\\,\\enfOp{\\nabla} \\enfTgt{J}(\\enfPar{\\theta}_{t-1}), \\quad \\enfPar{\\theta}_t = \\enfPar{\\theta}_{t-1} + \\enfPar{\\alpha}\\,v_t`}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="2-rmsprop">2. RMSProp</h3>
      <Math>{`\\enfVar{s}_t = \\enfPar{\\beta}_2\\,\\enfVar{s}_{t-1} + (1-\\enfPar{\\beta}_2)\\,(\\enfOp{\\nabla} \\enfTgt{J}(\\enfPar{\\theta}_{t-1}))^2, \\quad \\enfPar{\\theta}_t = \\enfPar{\\theta}_{t-1} + \\enfPar{\\alpha}\\,\\frac{\\enfOp{\\nabla} \\enfTgt{J}(\\enfPar{\\theta}_{t-1})}{\\sqrt{\\enfVar{s}_t} + \\varepsilon}`}</Math>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="3-adam-adaptive-moment-estimation">3. Adam (Adaptive Moment Estimation)</h3>
      <p>
        Комбинирует моменты первого и второго порядка. Параметры по умолчанию: <Math display={false}>{`\\enfPar{\\beta}_1 = 0.9`}</Math>, <Math display={false}>{`\\enfPar{\\beta}_2 = 0.999`}</Math>, <Math display={false}>{`\\varepsilon = 10^{-8}`}</Math>.
      </p>

      <InfoBox color="accent" title="Unity ML-Agents">
        <p className="text-sm">
          По умолчанию используется оптимизатор Adam с настраиваемым <code className="text-foreground">learning_rate</code> (обычно <Math display={false}>{`10^{-4} \\dots 10^{-3}`}</Math>) и опциональным расписанием (linear decay).
        </p>
      </InfoBox>
    </Section>

    {/* Lecture 4 */}
    <Section icon={<Settings2 className="w-5 h-5 text-primary" />} title="Лекция 4. Proximal Policy Optimization (PPO)">
      <p>
        <strong className="text-foreground">PPO</strong> — современный алгоритм оптимизации политик, стандарт в Unity ML-Agents. Он предназначен для того, чтобы <strong className="text-foreground">не допустить слишком больших обновлений политики</strong>.
      </p>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="клиповый-суррогат-объектив">Клиповый суррогат-объектив</h3>
      <p>Определим отношение вероятностей:</p>
      <Math>{`\\enfTgt{r}(\\enfPar{\\theta}) = \\frac{\\pi_{\\theta}(a \\mid \\enfVar{s})}{\\pi_{\\theta_{\\text{old}}}(a|\\enfVar{s})}`}</Math>
      <p>Целевая функция PPO-Clip:</p>
      <Math>{`L(\\enfPar{\\theta}) = \\min\\!\\Big[\\enfTgt{r}(\\enfPar{\\theta})\\,A,\\;\\; \\text{clip}\\big(\\enfTgt{r}(\\enfPar{\\theta}),\\, 1-\\enfPar{\\epsilon},\\, 1+\\enfPar{\\epsilon}\\big)\\,A\\Big]`}</Math>
      <p>
        где <Math display={false}>{`A`}</Math> — Advantage, а <Math display={false}>{`\\enfPar{\\epsilon} \\approx 0.1 \\ldots 0.2`}</Math>.
      </p>

      <h3 className="scroll-mt-28 text-xl font-semibold text-foreground mt-8 mb-3" id="гиперпараметры-ppo">Гиперпараметры PPO</h3>
      <div className="my-4 overflow-x-auto">
        <table className="w-full text-sm border border-border/30 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-card/60">
              <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Параметр</th>
              <th className="text-left p-3 text-foreground font-semibold border-b border-border/30">Значение</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/20">
              <td className="p-3">Дисконт <Math display={false}>{`\\enfPar{\\gamma}`}</Math></td>
              <td className="p-3"><Math display={false}>{`0.99`}</Math></td>
            </tr>
            <tr className="border-b border-border/20">
              <td className="p-3">GAE <Math display={false}>{`\\lambda`}</Math></td>
              <td className="p-3"><Math display={false}>{`0.95 \\ldots 0.99`}</Math></td>
            </tr>
            <tr className="border-b border-border/20">
              <td className="p-3">Клиповый порог <Math display={false}>{`\\enfPar{\\epsilon}`}</Math></td>
              <td className="p-3"><Math display={false}>{`0.1 \\ldots 0.2`}</Math></td>
            </tr>
            <tr className="border-b border-border/20">
              <td className="p-3">Энтропийный коэффициент <Math display={false}>{`\\enfPar{\\beta}`}</Math></td>
              <td className="p-3"><Math display={false}>{`0.0005 \\ldots 0.01`}</Math></td>
            </tr>
            <tr className="border-b border-border/20">
              <td className="p-3">Скорость обучения</td>
              <td className="p-3"><Math display={false}>{`10^{-4} \\ldots 10^{-3}`}</Math></td>
            </tr>
            <tr>
              <td className="p-3">Буфер / батч</td>
              <td className="p-3">тысячи шагов</td>
            </tr>
          </tbody>
        </table>
      </div>

      <InfoBox color="primary" title="Итог">
        <p className="text-sm">
          PPO сочетает в себе <strong className="text-foreground">градиенты политики</strong>, <strong className="text-foreground">адаптивные оптимизаторы</strong> и <strong className="text-foreground">ограничения обновлений</strong>, что обеспечивает надёжность и эффективность обучения.
        </p>
      </InfoBox>
    </Section>
  </>
);

/* ─── Local helpers ─── */

const slugify = (t: string) => t.toLowerCase().replace(/[^\wа-яё]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60);

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <section className="mt-12 first:mt-0 scroll-mt-28" id={slugify(title)}>
    <div className="flex items-center gap-3 mb-6">
      {icon}
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    </div>
    <div className="text-muted-foreground leading-relaxed space-y-3">{children}</div>
  </section>
);

const InfoBox = ({ color, title, children }: { color: "primary" | "secondary" | "accent"; title: string; children: React.ReactNode }) => {
  const borderColor = color === "primary" ? "border-primary/30" : color === "secondary" ? "border-secondary/30" : "border-accent/30";
  const titleColor = color === "primary" ? "text-primary" : color === "secondary" ? "text-secondary" : "text-accent";
  return (
    <div className={`my-4 p-4 rounded-lg bg-card/60 border ${borderColor}`}>
      <p className={`font-semibold ${titleColor} text-sm mb-2`}>{title}</p>
      {children}
    </div>
  );
};

export default Part4Optimization;
