import Math from "@/components/Math";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints, Anchor } from "./_shared";

const chip = "px-1 rounded bg-muted/50 text-xs font-mono";

const YAML = `behaviors:
  RacerSAC:
    trainer_type: sac

    hyperparameters:
      # --- общие для PPO и SAC ---
      learning_rate: 0.0003
      learning_rate_schedule: constant   # для SAC рекомендуют constant
      batch_size: 256                    # непрерывные действия → крупный батч (128–1024)
      buffer_size: 500000                # большой replay buffer (5e4–1e6)

      # --- специфичные для SAC ---
      buffer_init_steps: 5000            # прогрев буфера случайными действиями
      tau: 0.005                         # сглаживание target-сетей
      steps_per_update: 10.0             # шагов среды на одно обновление сетей
      save_replay_buffer: false          # сохранять ли буфер между запусками
      init_entcoef: 1.0                  # стартовый энтропийный коэффициент (α₀)
      reward_signal_steps_per_update: 10.0

    network_settings:
      normalize: true                    # нормализация наблюдений (полезно для непрерывного управления)
      hidden_units: 256
      num_layers: 2
      vis_encode_type: simple            # если есть визуальные наблюдения

    reward_signals:
      extrinsic:
        gamma: 0.99                       # дисконт
        strength: 1.0

    max_steps: 5000000
    time_horizon: 64
    summary_freq: 10000
    keep_checkpoints: 5
    checkpoint_interval: 500000
    threaded: true                        # ускоряет SAC: среда шагает во время обновления`;

const Section12 = () => (
  <>
    <h2 className={SECTION_TITLE_CLASS}>Раздел 12. SAC в Unity ML-Agents</h2>

    <ProseP>
      Unity ML-Agents «из коробки» поддерживает SAC: достаточно в YAML-конфиге указать{" "}
      <code className={chip}>trainer_type: sac</code>. Ниже — полный рабочий конфиг для{" "}
      <strong>непрерывного управления</strong> (например, наш гоночный/охотничий агент с непрерывными
      действиями), а затем разбор полей.
    </ProseP>

    <CyberCodeBlock language="pseudo" filename="racer_sac.yaml">
      {YAML}
    </CyberCodeBlock>

    <h3 className={H3_CLASS}>Разбор полей</h3>

    <ProseP>
      <code className={chip}>trainer_type: sac</code> — выбирает алгоритм SAC (альтернативы:{" "}
      <code className={chip}>ppo</code>, <code className={chip}>poca</code>).
    </ProseP>

    <h3 className={H3_CLASS}>Гиперпараметры, общие для PPO/SAC:</h3>
    <div className="my-4 overflow-x-auto rounded-xl border border-cyan-500/15 bg-card/40 backdrop-blur-sm">
      <table className="w-full text-[14px] text-foreground/90">
        <thead>
          <tr className="border-b border-cyan-500/20 bg-cyan-500/5">
            <th className="text-left py-3 px-4 font-semibold text-cyan-400 w-1/3">Гиперпараметр</th>
            <th className="text-left py-3 px-4 font-semibold text-cyan-400">Описание</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">
              <code className={chip}>learning_rate</code>
              <div className="text-xs text-muted-foreground mt-1">дефолт <code className={chip}>3e-4</code></div>
            </td>
            <td className="py-3 px-4 leading-relaxed">
              Скорость градиентного шага. Уменьшайте, если обучение нестабильно. Типичный диапазон{" "}
              <Math display={false}>{String.raw`10^{-5}`}</Math>–<Math display={false}>{String.raw`10^{-3}`}</Math>.
            </td>
          </tr>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">
              <code className={chip}>learning_rate_schedule</code>
              <div className="text-xs text-muted-foreground mt-1">для SAC — <code className={chip}>constant</code></div>
            </td>
            <td className="py-3 px-4 leading-relaxed">
              Как меняется lr со временем. Для SAC рекомендуется <strong><code className={chip}>constant</code></strong>,
              чтобы Q-функция доучилась до естественной сходимости (в отличие от PPO, где обычно{" "}
              <code className={chip}>linear</code>).
            </td>
          </tr>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">
              <code className={chip}>batch_size</code>
            </td>
            <td className="py-3 px-4 leading-relaxed">
              Размер мини-батча из буфера на одно обновление. Должен быть <strong>во много раз меньше</strong>{" "}
              <code className={chip}>buffer_size</code>. Для непрерывных действий —{" "}
              <Math display={false}>{String.raw`128`}</Math>–<Math display={false}>{String.raw`1024`}</Math>{" "}
              (SAC); для дискретных — <Math display={false}>{String.raw`32`}</Math>–
              <Math display={false}>{String.raw`512`}</Math>.
            </td>
          </tr>
          <tr className="align-top">
            <td className="py-3 px-4">
              <code className={chip}>buffer_size</code>
              <div className="text-xs text-muted-foreground mt-1">дефолт <code className={chip}>50000</code> (SAC)</div>
            </td>
            <td className="py-3 px-4 leading-relaxed">
              Максимальный размер replay buffer. Для SAC — «на тысячи эпизодов вперёд», чтобы учиться и на
              старом, и на новом опыте. Диапазон <Math display={false}>{String.raw`5\times10^4`}</Math>–
              <Math display={false}>{String.raw`10^6`}</Math>.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 className={H3_CLASS}>Гиперпараметры, специфичные для SAC:</h3>
    <div className="my-4 overflow-x-auto rounded-xl border border-purple-500/15 bg-card/40 backdrop-blur-sm">
      <table className="w-full text-[14px] text-foreground/90">
        <thead>
          <tr className="border-b border-purple-500/20 bg-purple-500/5">
            <th className="text-left py-3 px-4 font-semibold text-purple-400 w-1/3">Гиперпараметр</th>
            <th className="text-left py-3 px-4 font-semibold text-purple-400">Описание</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">
              <code className={chip}>buffer_init_steps</code>
              <div className="text-xs text-muted-foreground mt-1">дефолт <code className={chip}>0</code></div>
            </td>
            <td className="py-3 px-4 leading-relaxed">
              Сколько переходов набрать случайными действиями <strong>до</strong> начала обучения. Раз политика
              поначалу случайна, прогрев буфера улучшает раннее исследование. Диапазон{" "}
              <Math display={false}>{String.raw`1000`}</Math>–<Math display={false}>{String.raw`10000`}</Math>.
            </td>
          </tr>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">
              <code className={chip}>tau</code>
              <div className="text-xs text-muted-foreground mt-1">дефолт <code className={chip}>0.005</code></div>
            </td>
            <td className="py-3 px-4 leading-relaxed">
              Коэффициент soft-update target-сетей:{" "}
              <Math display={false}>{String.raw`\enfPar{\bar{\theta}}\leftarrow\enfPar{\tau}\enfPar{\theta}+(1-\enfPar{\tau})\enfPar{\bar{\theta}}`}</Math>{" "}
              (см. <Anchor to="раздел-5-два-q-критика-clipped-double-q-и-target-сети">Раздел 5</Anchor>).
              Обычно оставляют <Math display={false}>{String.raw`0.005`}</Math>; до{" "}
              <Math display={false}>{String.raw`0.01`}</Math> ускоряет простые задачи ценой стабильности.
            </td>
          </tr>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">
              <code className={chip}>steps_per_update</code>
              <div className="text-xs text-muted-foreground mt-1">дефолт <code className={chip}>1</code></div>
            </td>
            <td className="py-3 px-4 leading-relaxed">
              Среднее число шагов агента на одно обновление сетей. Одно «обновление» = взять батч из буфера
              и сделать по нему градиентный шаг. Меньше → выше sample efficiency, дороже по CPU. Хороший
              баланс — равно числу агентов в сцене. Диапазон{" "}
              <Math display={false}>{String.raw`1`}</Math>–<Math display={false}>{String.raw`20`}</Math>.
            </td>
          </tr>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">
              <code className={chip}>save_replay_buffer</code>
              <div className="text-xs text-muted-foreground mt-1">дефолт <code className={chip}>false</code></div>
            </td>
            <td className="py-3 px-4 leading-relaxed">
              Сохранять ли буфер (а не только модель) при остановке/возобновлении. Облегчает дообучение, но
              буфер занимает много места на диске.
            </td>
          </tr>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">
              <code className={chip}>init_entcoef</code>
              <div className="text-xs text-muted-foreground mt-1">дефолт <code className={chip}>1.0</code></div>
            </td>
            <td className="py-3 px-4 leading-relaxed">
              <strong>Стартовое</strong> значение энтропийного коэффициента (
              <Math display={false}>{String.raw`\enfPar{\alpha}_0`}</Math>). Это и есть наша температура{" "}
              <Math display={false}>{String.raw`\enfPar{\alpha}`}</Math> из{" "}
              <Anchor to="раздел-7-автоматическая-подстройка-температуры-alpha">Раздела 7</Anchor>: дальше
              ML-Agents <strong>автоматически</strong> тянет её к целевой энтропии (по схеме из 1812.05905).
              Больше → больше исследования в начале; меньше → быстрее сходимость. Диапазон для непрерывных{" "}
              <Math display={false}>{String.raw`0.5`}</Math>–<Math display={false}>{String.raw`1.0`}</Math>,
              для дискретных <Math display={false}>{String.raw`0.05`}</Math>–
              <Math display={false}>{String.raw`0.5`}</Math>.
            </td>
          </tr>
          <tr className="align-top">
            <td className="py-3 px-4">
              <code className={chip}>reward_signal_steps_per_update</code>
              <div className="text-xs text-muted-foreground mt-1">дефолт = <code className={chip}>steps_per_update</code></div>
            </td>
            <td className="py-3 px-4 leading-relaxed">
              Как часто обновлять модели сигналов награды (актуально в основном для GAIL/имитационного обучения).
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 className={H3_CLASS}><code className={chip}>network_settings</code>:</h3>
    <ul className="space-y-3 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong><code className={chip}>normalize</code></strong>{" "}
        <em>(дефолт <code className={chip}>false</code>)</em> — нормализация векторных наблюдений по
        бегущему среднему и дисперсии. Для сложного непрерывного управления <strong>часто полезна</strong>{" "}
        (рекомендую <code className={chip}>true</code> для гоночного агента).
      </li>
      <li>
        <strong><code className={chip}>hidden_units</code></strong>{" "}
        <em>(дефолт <code className={chip}>128</code>)</em> — нейронов в скрытом слое. Для
        SAC-управления типично <Math display={false}>{String.raw`256`}</Math>. Диапазон{" "}
        <Math display={false}>{String.raw`32`}</Math>–<Math display={false}>{String.raw`512`}</Math>.
      </li>
      <li>
        <strong><code className={chip}>num_layers</code></strong>{" "}
        <em>(дефолт <code className={chip}>2</code>)</em> — число скрытых слоёв. Диапазон{" "}
        <Math display={false}>{String.raw`1`}</Math>–<Math display={false}>{String.raw`3`}</Math>.
      </li>
      <li>
        <strong><code className={chip}>vis_encode_type</code></strong>{" "}
        <em>(дефолт <code className={chip}>simple</code>)</em> — энкодер визуальных наблюдений (если
        агент «видит» камеру): <code className={chip}>simple</code>,{" "}
        <code className={chip}>nature_cnn</code>, <code className={chip}>resnet</code>, и т.д.
      </li>
    </ul>

    <h3 className={H3_CLASS}><code className={chip}>reward_signals → extrinsic</code>:</h3>
    <ul className="space-y-3 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong><code className={chip}>gamma</code></strong>{" "}
        <em>(дефолт <code className={chip}>0.99</code>)</em> — дисконт будущих наград, строго{" "}
        <Math display={false}>{String.raw`<1`}</Math>. Вспомните{" "}
        <CrossLinkToHub
          hubPath="/math-rl/module-1"
          hubAnchor="6-дисконтирование-в-rl-и-его-влияние"
          hubTitle="Математика → Дисконтирование и геометрический ряд"
        >
          связь дисконтированной суммы наград с геометрическим рядом
        </CrossLinkToHub>{" "}
        — именно <Math display={false}>{String.raw`\enfPar{\gamma}<1`}</Math> гарантирует конечность суммы.
        Диапазон <Math display={false}>{String.raw`0.8`}</Math>–<Math display={false}>{String.raw`0.995`}</Math>.
      </li>
      <li>
        <strong><code className={chip}>strength</code></strong>{" "}
        <em>(дефолт <code className={chip}>1.0</code>)</em> — множитель внешней награды.
      </li>
    </ul>

    <h3 className={H3_CLASS}>Общие для всех тренеров:</h3>
    <ul className="space-y-3 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong><code className={chip}>max_steps</code></strong> — всего шагов среды до конца обучения
        (<Math display={false}>{String.raw`5\times10^5`}</Math>–<Math display={false}>{String.raw`10^7`}</Math>).
      </li>
      <li>
        <strong><code className={chip}>time_horizon</code></strong> — сколько шагов копить на агента
        до отправки в буфер; компромисс смещение/дисперсия оценки ценности.
      </li>
      <li>
        <strong><code className={chip}>summary_freq</code></strong> — как часто писать статистику в
        TensorBoard.
      </li>
      <li>
        <strong><code className={chip}>threaded</code></strong>{" "}
        <em>(дефолт <code className={chip}>false</code>)</em> — позволять среде шагать во время
        обновления модели. <strong>Для SAC часто даёт ускорение</strong> — стоит включить (но не при
        self-play).
      </li>
    </ul>

    <h3 className={H3_CLASS}>Когда в ML-Agents выбирать SAC, а не PPO</h3>
    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        Шаг симуляции <strong>дорогой</strong> (тяжёлая физика, рендеринг, реальный робот) → SAC
        экономит шаги.
      </li>
      <li>
        Действия <strong>непрерывные</strong> (рулёжка, газ, моменты) → родная ниша SAC.
      </li>
      <li>Нужно богатое исследование / задача с обманчивыми локальными оптимумами.</li>
    </ul>

    <ProseP>
      Если же действия дискретные, шаги дёшевы, или вы используете LSTM/память — PPO обычно проще и
      надёжнее (по доку ML-Agents, SAC хуже сочетается с непрерывными действиями + LSTM).
    </ProseP>

    <KeyPoints
      items={[
        <>
          <code className={chip}>trainer_type: sac</code> + блок SAC-гиперпараметров = готовый SAC в
          ML-Agents.
        </>,
        <>
          <code className={chip}>init_entcoef</code> — это стартовая температура{" "}
          <Math display={false}>{String.raw`\enfPar{\alpha}`}</Math>; дальше она автоподстраивается.
        </>,
        <>
          Для непрерывного управления: <code className={chip}>normalize: true</code>,{" "}
          <code className={chip}>hidden_units: 256</code>,{" "}
          <code className={chip}>learning_rate_schedule: constant</code>, крупный{" "}
          <code className={chip}>buffer_size</code>, <code className={chip}>threaded: true</code>.
        </>,
        <>Выбор SAC оправдан при дорогих шагах среды и непрерывных действиях.</>,
      ]}
    />
  </>
);

export default Section12;
