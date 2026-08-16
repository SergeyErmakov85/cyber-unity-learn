import { Card } from "@/components/ui/card";
import Math from "@/components/Math";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import HubLink from "@/components/math-rl/HubLink";

const Section6Algorithms = () => (
  <div className="space-y-8">
    {/* 6.1 PPO */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">6.1. Proximal Policy Optimization (PPO)</h3>
      <p className="text-sm text-muted-foreground">
        {/* TODO(HubLink): target -> hub "algorithms" или "/algorithms/ppo", anchor "clipped-surrogate" */}
        PPO (Schulman et al., <em>Proximal Policy Optimization Algorithms</em>, arXiv:1707.06347, 2017) —
        основной on-policy алгоритм ML-Agents.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Идея:</strong> обновлять политику{" "}
        <Math display={false}>{String.raw`\pi_\theta`}</Math> ограниченными шагами, чтобы новая политика не
        сильно отклонялась от старой{" "}
        <Math display={false}>{String.raw`\pi_{\theta_{\text{old}}}`}</Math>. Это достигается через{" "}
        <strong className="text-foreground">clipped surrogate objective</strong>:
      </p>
      <Math>{String.raw`L^{\text{CLIP}}(\enfPar{\theta}) \;=\; \hat{\mathbb{E}}_t \!\left[\min\!\big(\enfTgt{r}_t(\enfPar{\theta})\hat A_t,\; \mathrm{clip}(\enfTgt{r}_t(\enfPar{\theta}), 1-\enfPar{\epsilon}, 1+\enfPar{\epsilon})\,\hat A_t\big)\right],`}</Math>
      <p className="text-sm text-muted-foreground">
        где{" "}
        <Math display={false}>{String.raw`\enfTgt{r}_t(\enfPar{\theta}) = \dfrac{\pi_\theta(a_t\mid \enfVar{s}_t)}{\pi_{\theta_{\text{old}}}(a_t\mid \enfVar{s}_t)}`}</Math>,{" "}
        <Math display={false}>{String.raw`\enfPar{\epsilon} \approx 0.2`}</Math>.
        Минимум выбирается между «нормальным» и «клиппированным» термами — PPO обновляется только при
        «безопасном» увеличении вероятности действия.
      </p>

      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Generalized Advantage Estimation (GAE)</strong> — оценка
        преимущества <Math display={false}>{String.raw`\hat A_t`}</Math>. Сначала вычисляется одношаговая
        TD-ошибка:
      </p>
      <Math>{String.raw`\delta_t = \enfTgt{r}_t + \enfPar{\gamma} \enfOp{V}(\enfVar{s}_{t+1}) - \enfOp{V}(\enfVar{s}_t).`}</Math>
      <p className="text-muted-foreground leading-relaxed">GAE-оценка:</p>
      <Math>{String.raw`\hat A_t^{\text{GAE}(\gamma,\lambda)} \;=\; \sum_{l=0}^{\infty} (\enfPar{\gamma}\enfPar{\lambda})^l \, \delta_{t+l}.`}</Math>
      <p className="text-sm text-muted-foreground">
        При <Math display={false}>{String.raw`\enfPar{\lambda}=0`}</Math> получаем TD(0) (низкая дисперсия, высокое
        смещение); при <Math display={false}>{String.raw`\enfPar{\lambda}=1`}</Math> — Monte-Carlo (несмещённая,
        но шумная). Типичное значение{" "}
        <Math display={false}>{String.raw`\enfPar{\lambda} = 0.95`}</Math> балансирует bias–variance.
      </p>

      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Совокупная функция потерь актёра-критика PPO:</strong>
      </p>
      <Math>{String.raw`L^{\text{PPO}}(\enfPar{\theta}) \;=\; \hat{\mathbb{E}}_t\!\left[L^{\text{CLIP}}(\enfPar{\theta}) - c_1 \big(\enfOp{V}_\theta(\enfVar{s}_t) - \enfOp{V}^{\text{targ}}_t\big)^2 + c_2 H[\pi_\theta(\cdot\mid \enfVar{s}_t)]\right],`}</Math>
      <p className="text-sm text-muted-foreground">
        где <Math display={false}>{String.raw`H`}</Math> — энтропия (в ML-Agents — параметр{" "}
        <code className="bg-muted/50 px-1 text-xs">beta</code>),{" "}
        <Math display={false}>{String.raw`c_1`}</Math> — вес value-loss.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-cyan-500/20 bg-cyan-500/5 p-4">
          <p className="text-sm font-semibold text-cyan-300 mb-2">Плюсы PPO для непрерывного управления</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>✓ Простота настройки, стабильность</li>
            <li>✓ Отличный параллелизм (16–32 копии трассы)</li>
            <li>✓ Хорошо работает с raycast-наблюдениями</li>
          </ul>
        </Card>
        <Card className="border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm font-semibold text-red-300 mb-2">Минусы PPO</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>✗ On-policy → требует много опыта</li>
            <li>✗ Чувствителен к настройке epsilon, beta, learning_rate</li>
          </ul>
        </Card>
      </div>
    </div>

    {/* 6.2 SAC */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">6.2. Soft Actor-Critic (SAC)</h3>
      <p className="text-sm text-muted-foreground">
        {/* TODO(HubLink): target -> hub "algorithms" или "/algorithms/sac", anchor "entropy-maximization" */}
        SAC (Haarnoja et al., arXiv:1801.01290; уточнённая версия — arXiv:1812.05905, 2018) — off-policy
        алгоритм с максимизацией энтропии.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Цель:</strong>
      </p>
      <Math>{String.raw`\enfTgt{J}(\pi) \;=\; \sum_{t=0}^{\infty} \mathbb{E}_{(s_t,a_t)\sim\rho_\pi}\!\left[\enfTgt{r}(\enfVar{s}_t,a_t) + \enfPar{\alpha}\, \mathcal{H}\big(\pi(\cdot\mid \enfVar{s}_t)\big)\right],`}</Math>
      <p className="text-sm text-muted-foreground">
        где{" "}
        <Math display={false}>{String.raw`\mathcal{H}(\pi(\cdot\mid \enfVar{s})) = -\mathbb{E}_{a\sim\pi}[\log\pi(a\mid \enfVar{s})]`}</Math>{" "}
        — энтропия политики, <Math display={false}>{String.raw`\enfPar{\alpha}`}</Math> — температурный коэффициент
        (в ML-Agents автоматически подстраивается; стартовое значение задаётся параметром{" "}
        <code className="bg-muted/50 px-1 text-xs">init_entcoef</code>).
      </p>
      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Soft Q-функция</strong> удовлетворяет soft уравнению Беллмана:
      </p>
      <Math>{String.raw`\enfOp{Q}_{\text{soft}}(\enfVar{s}_t,a_t) = \enfTgt{r}_t + \enfPar{\gamma}\, \mathbb{E}_{s_{t+1}}\!\left[\enfOp{V}_{\text{soft}}(\enfVar{s}_{t+1})\right],`}</Math>
      <Math>{String.raw`\enfOp{V}_{\text{soft}}(\enfVar{s}) = \mathbb{E}_{a\sim\pi}\!\left[\enfOp{Q}_{\text{soft}}(\enfVar{s},a) - \enfPar{\alpha} \log\pi(a\mid \enfVar{s})\right].`}</Math>
      <p className="text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Правила обновления:</strong>
      </p>
      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground leading-relaxed">
        <li>
          Два Q-критика <Math display={false}>{String.raw`\enfOp{Q}_{\phi_1}, \enfOp{Q}_{\phi_2}`}</Math> минимизируют MSE
          к soft target{" "}
          <Math display={false}>{String.raw`y = \enfTgt{r} + \enfPar{\gamma} \big(\min_{i=1,2} \enfOp{Q}_{\bar\phi_i}(\enfVar{s}', a') - \enfPar{\alpha}\log\pi(a'\mid \enfVar{s}')\big)`}</Math>
        </li>
        <li>
          Актёр <Math display={false}>{String.raw`\pi_\theta`}</Math> минимизирует KL-расхождение с «softmax от Q»:
          {" "}<Math display={false}>{String.raw`\enfOp{\nabla}_\theta \enfTgt{J}_\pi \propto \enfOp{\nabla}_\theta\big(\enfPar{\alpha} \log\pi_\theta(a\mid \enfVar{s}) - \enfOp{Q}_\phi(\enfVar{s},a)\big)`}</Math>
        </li>
        <li>
          Целевые сети — soft-update:{" "}
          <Math display={false}>{String.raw`\bar\phi \leftarrow \tau\phi + (1-\tau)\bar\phi`}</Math>,{" "}
          <Math display={false}>{String.raw`\tau \approx 0.005`}</Math>
        </li>
      </ul>
      <p className="text-sm text-muted-foreground">
        Согласно официальной документации ML-Agents: «This makes SAC significantly more sample-efficient,
        often requiring <strong className="text-foreground">5–10 times less samples</strong> to learn the same
        task as PPO. However, SAC tends to require more model updates.»
      </p>
    </div>

    {/* 6.3 Сравнение PPO vs SAC */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">6.3. Сравнительная таблица PPO vs SAC</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-cyan-500/20">
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Параметр</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">PPO</th>
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">SAC</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground text-xs">
            {[
              ["Тип",                          "On-policy",                                    "Off-policy"],
              ["Sample efficiency",            "Низкая (нужно 5–20 M шагов)",                 "Высокая (5–10× меньше шагов)"],
              ["Стабильность",                 "Очень высокая (clipped objective)",            "Высокая, но чувствительна к масштабу наград"],
              ["Скорость одного обновления",   "Быстрая (стохастические апдейты весов)",       "Медленнее (постоянные обновления Q-функций)"],
              ["Сложность тюнинга",            "Средняя",                                      "Высокая"],
              ["Память (replay buffer)",       "Не требуется",                                 "Требуется (50k–500k опытов)"],
              ["Параллелизм агентов",          "Отлично",                                      "Хуже масштабируется"],
              ["Механизм исследования",        "Вспомогательная регуляризация энтропии",       "Максимизация энтропии встроена в целевую функцию"],
              ["Время круга (Savid et al.)",   "12.5948 с / 1 вылет",                         "13.1336 с / 0 вылетов"],
              ["Рекомендация для овала",       "✅ Базовый выбор",                             "Для быстрого результата при малом числе агентов"],
            ].map(([param, ppo, sac]) => (
              <tr key={param} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="py-2 px-3 font-medium text-foreground/80">{param}</td>
                <td className="py-2 px-3">{ppo}</td>
                <td className="py-2 px-3">{sac}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Эмпирический вывод:</strong> при качественной настройке PPO
        демонстрирует более высокую абсолютную скорость круга, тогда как SAC обеспечивает непревзойдённую
        траекторную стабильность — полностью исключает опасные заносы.
      </p>
    </div>

    {/* 6.4 PPO YAML */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">6.4. PPO YAML для овальной трассы (учебный профиль)</h3>
      <CyberCodeBlock language="pseudo" filename="config/ppo_oval.yaml">
{`# config/ppo_oval.yaml
# Конфигурация PPO для овальной гоночной трассы
# Совместим с release_22 (com.unity.ml-agents 3.0.0)

behaviors:
  RacingCar:                          # имя ДОЛЖНО совпадать с Behavior Name агента
    trainer_type: ppo

    hyperparameters:
      # --- Общие для PPO и SAC ---
      batch_size: 2048                # Размер мини-батча для одного шага SGD.
                                      # Для непрерывных действий: 512-5120 (рекомендация Unity).
      buffer_size: 20480              # Объём собираемого опыта перед обновлением.
      learning_rate: 3.0e-4           # Шаг градиентного спуска. Эмпирически 1e-5..1e-3.
      learning_rate_schedule: linear  # Линейное затухание до 0 к концу обучения.

      # --- PPO-специфика ---
      beta: 5.0e-3                    # Коэффициент энтропии H (стимул исследовать).
                                      # Если энтропия падает слишком быстро — увеличить.
      beta_schedule: linear
      epsilon: 0.2                    # Параметр клиппирования ε из L^CLIP.
                                      # 0.1..0.3; меньше — более консервативные апдейты.
      epsilon_schedule: linear
      lambd: 0.95                     # GAE λ — балансирует bias/variance оценки advantage.
      num_epoch: 3                    # Эпох SGD на один buffer. Для PPO: 3-10.

    network_settings:
      normalize: true                 # Внутренняя нормализация наблюдений (running mean/std).
      hidden_units: 256               # Скрытый слой MLP.
      num_layers: 2
      vis_encode_type: simple         # Без визуальных наблюдений.

    reward_signals:
      extrinsic:
        gamma: 0.99                   # Дисконт-фактор. Для эпизодов >50 шагов — 0.99.
        strength: 1.0

    # --- Тренировочный цикл ---
    max_steps: 3000000                # ~3 M шагов достаточно для овала.
    time_horizon: 64                  # Шагов траектории перед value bootstrap.
    summary_freq: 10000               # Частота записи в TensorBoard.
    keep_checkpoints: 5
    checkpoint_interval: 200000
    threaded: true`}
      </CyberCodeBlock>
    </div>

    {/* 6.5 SAC YAML */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">6.5. SAC YAML для овальной трассы (учебный профиль)</h3>
      <CyberCodeBlock language="pseudo" filename="config/sac_oval.yaml">
{`# config/sac_oval.yaml
# Конфигурация SAC для овальной трассы

behaviors:
  RacingCar:
    trainer_type: sac

    hyperparameters:
      # --- Общие ---
      batch_size: 256                 # Для непрерывных действий SAC: 128-1024.
      buffer_size: 200000             # Replay buffer ~ 50k-500k.
      learning_rate: 3.0e-4
      learning_rate_schedule: constant

      # --- SAC-специфика ---
      buffer_init_steps: 5000         # Прогрев буфера случайной политикой.
      tau: 0.005                      # Soft-update коэффициент target-сетей.
      steps_per_update: 10.0          # Шагов среды на одно обновление модели.
      save_replay_buffer: false
      init_entcoef: 0.5               # Стартовый α энтропии. Увеличить, если агент застрял.
      reward_signal_steps_per_update: 10.0

    network_settings:
      normalize: true
      hidden_units: 256
      num_layers: 2
      vis_encode_type: simple

    reward_signals:
      extrinsic:
        gamma: 0.99
        strength: 1.0

    max_steps: 1000000                # SAC обычно сходится быстрее по шагам.
    time_horizon: 64
    summary_freq: 10000
    keep_checkpoints: 5
    checkpoint_interval: 100000`}
      </CyberCodeBlock>
    </div>

    {/* 6.6 Компактные конфиги */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">6.6. Компактные конфиги (быстрая сходимость)</h3>
      <p className="text-sm text-muted-foreground">
        Альтернативные YAML-конфиги, оптимизированные под овал малой сложности с компактной сетью
        (<code className="bg-muted/50 px-1 text-xs">hidden_units: 128</code>):
      </p>
      <CyberCodeBlock language="pseudo" filename="config/car_racer_ppo.yaml">
{`behaviors:
  RacingCarBehavior:
    trainer_type: ppo
    hyperparameters:
      batch_size: 128                  # Оптимальный размер пакета для непрерывного контроля
      buffer_size: 2048                # Объём выборки перед градиентным шагом
      learning_rate: 3.0e-4            # Базовая скорость сходимости без риска разрушения весов
      learning_rate_schedule: linear   # Линейный спад шага к концу сессии для стабилизации
      beta: 1.0e-2                     # Вес энтропии, предотвращающий застревание
      epsilon: 0.2                     # Граница усечения обновлений политики (clipping)
      lambd: 0.95                      # Параметр дисконтирования временных разностей GAE
      num_epoch: 3                     # Число итераций оптимизации на один батч данных
    network_settings:
      normalize: true                  # Автоматическая нормализация входящего вектора сенсоров
      hidden_units: 128                # Оптимальная ёмкость сети для простых геометрий
      num_layers: 2                    # Предотвращает переобучение на ограниченной выборке
    reward_signals:
      extrinsic:
        gamma: 0.99                    # Глубокий временной горизонт планирования траекторий
        strength: 1.0                  # Коэффициент масштаба внешних наград
    max_steps: 3000000                 # Лимит шагов симуляции для полной сходимости
    time_horizon: 64                   # Шаги сбора данных агентом перед расчётом оценок
    summary_freq: 50000                # Частота выгрузки данных для графиков
    keep_checkpoints: 5                # Количество сохраняемых резервных моделей ONNX
    checkpoint_interval: 200000        # Шаг сохранения промежуточных контрольных точек`}
      </CyberCodeBlock>
      <CyberCodeBlock language="pseudo" filename="config/car_racer_sac.yaml">
{`behaviors:
  RacingCarBehavior:
    trainer_type: sac
    hyperparameters:
      batch_size: 128                  # Размер выборки из буфера воспроизведения опыта
      buffer_size: 100000              # Максимальный размер буфера повторения опыта
      learning_rate: 3.0e-4            # Фиксированная скорость обучения для плавной сходимости
      learning_rate_schedule: constant # Для SAC рекомендуется поддерживать постоянный LR
      init_entcoef: 0.5                # Начальный вес энтропии для стимуляции исследования
      tau: 0.005                       # Коэффициент мягкого обновления целевых сетей Q-функции
      steps_per_update: 1              # Выполнение оптимизационного шага на каждый такт среды
      save_replay_buffer: false
    network_settings:
      normalize: true                  # Нормализация входа
      hidden_units: 128
      num_layers: 2
    reward_signals:
      extrinsic:
        gamma: 0.99
        strength: 1.0
    max_steps: 2000000                 # Требует меньше шагов симуляции по сравнению с PPO
    time_horizon: 64
    summary_freq: 50000
    keep_checkpoints: 5
    checkpoint_interval: 200000`}
      </CyberCodeBlock>
    </div>

    {/* 6.7 Эмпирическое исследование */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">6.7. Эмпирическое исследование гиперпараметров</h3>
      <p className="text-sm text-muted-foreground">
        Систематическое исследование (Savid et al. 2023, MDPI Information) выявило критическую важность
        настройки размера батча и шага обучения:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-cyan-500/20">
              <th className="text-left py-2 px-3 text-cyan-300 font-semibold">Гиперпараметр</th>
              <th className="text-left py-2 px-3 text-red-400 font-semibold">Слишком мало</th>
              <th className="text-left py-2 px-3 text-emerald-400 font-semibold">Оптимум</th>
              <th className="text-left py-2 px-3 text-orange-400 font-semibold">Слишком много</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground text-xs">
            {[
              ["batch_size",          "64 → 25.653 с / 6.6 вылетов",    "128",             "512 → 17.457 с / 3.6 вылетов"],
              ["learning_rate",       "—",                               "3.0e-4",          "1.0e-3 → разрушение весов"],
              ["gamma",               "0.85 → 2.6 аварий/сессия",       "0.99",            "—"],
              ["beta (PPO)",          "0.005 → монотонная политика",     "0.01",            "0.02 → «волны» траектории"],
            ].map(([param, low, opt, high]) => (
              <tr key={param} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="py-2 px-3 font-mono text-foreground/80 font-medium">{param}</td>
                <td className="py-2 px-3 text-red-300">{low}</td>
                <td className="py-2 px-3 text-emerald-300 font-bold">{opt}</td>
                <td className="py-2 px-3 text-orange-300">{high}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* 6.8 Запуск обучения */}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground">6.8. Запуск обучения</h3>
      <CyberCodeBlock language="pseudo" filename="terminal">
{`# Из корня проекта (где лежит папка config/)
mlagents-learn config/ppo_oval.yaml --run-id=oval_ppo_001

# После выполнения команды нажмите Play в Unity Editor — обучение начнётся.

# Headless обучение через билд (быстрее, без рендеринга):
mlagents-learn config/ppo_oval.yaml --run-id=oval_ppo_001 \
  --env=Builds/OvalRace.exe --num-envs=4

# Возобновление обучения:
mlagents-learn config/ppo_oval.yaml --run-id=oval_ppo_001 --resume

# Принудительная перезапись (если хотите начать заново):
mlagents-learn config/ppo_oval.yaml --run-id=oval_ppo_001 --force`}
      </CyberCodeBlock>
    </div>

    <Card className="border-cyan-500/20 bg-cyan-500/5 p-4">
      <p className="text-sm text-cyan-200 font-medium">
        Ключевые моменты раздела 6: PPO — стартовый выбор для овальной трассы; SAC — если ресурсов мало
        или нужна максимальная sample efficiency. Эмпирически проверенные оптимумы:{" "}
        <code className="bg-muted/50 px-1 text-xs">batch_size: 128</code>,{" "}
        <code className="bg-muted/50 px-1 text-xs">learning_rate: 3e-4</code>,{" "}
        <code className="bg-muted/50 px-1 text-xs">gamma: 0.99</code>,{" "}
        <code className="bg-muted/50 px-1 text-xs">beta: 0.01</code>.
      </p>
    </Card>
  </div>
);

export default Section6Algorithms;
