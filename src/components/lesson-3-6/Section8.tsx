import CyberCodeBlock from "@/components/CyberCodeBlock";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Code } from "./_shared";

const OBJECTIVE_CODE = `import optuna

def objective(trial: optuna.Trial) -> float:
    # Пространство поиска строится "на лету" вызовами suggest_*
    lr   = trial.suggest_float("learning_rate", 1e-5, 1e-3, log=True)  # лог-масштаб
    beta = trial.suggest_float("beta", 1e-4, 1e-2, log=True)
    lambd = trial.suggest_float("lambd", 0.90, 0.99)
    num_epoch = trial.suggest_int("num_epoch", 3, 10)
    batch_size = trial.suggest_categorical("batch_size", [512, 1024, 2048])

    # Условная ось: GAIL включаем не всегда
    use_gail = trial.suggest_categorical("use_gail", [True, False])
    if use_gail:
        gail_strength = trial.suggest_float("gail_strength", 0.01, 0.5)

    model = train_agent(lr, beta, lambd, num_epoch, batch_size)  # дорогой вызов
    return evaluate(model)            # метрика, которую максимизируем

study = optuna.create_study(
    direction="maximize",
    sampler=optuna.samplers.TPESampler(n_startup_trials=10, multivariate=True),
    pruner=optuna.pruners.MedianPruner(n_startup_trials=5, n_warmup_steps=10),
)
study.optimize(objective, n_trials=100)

print(study.best_params)   # лучшая найденная конфигурация
print(study.best_value)    # её метрика
`;

const PRUNE_CODE = `def objective(trial):
    lr = trial.suggest_float("learning_rate", 1e-5, 1e-3, log=True)
    model = build_agent(lr)
    for step in range(total_steps):
        train_one_chunk(model)
        intermediate = evaluate(model)
        trial.report(intermediate, step)     # сообщаем промежуточный результат
        if trial.should_prune():             # прунер решает, рубить ли
            raise optuna.TrialPruned()
    return evaluate(model)
`;

const DIST_CODE = `# создаём study один раз
optuna create-study --study-name racing --storage sqlite:///racing.db --direction maximize
# запускаем несколько воркеров (асинхронно, на разных машинах/GPU)
python run_trial.py racing sqlite:///racing.db &
python run_trial.py racing sqlite:///racing.db &
python run_trial.py racing sqlite:///racing.db &
`;

const Section8 = () => (
  <>
    <h2 id="раздел-8-optuna-практика" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 8. Optuna на практике: study, trial, objective
    </h2>

    <ProseP>Теперь от теории к коду. Optuna устроена вокруг трёх понятий:</ProseP>

    <ul className="space-y-2 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>study</strong> — весь процесс оптимизации (направление: максимизация/минимизация,
        сэмплер, прунер, хранилище).
      </li>
      <li>
        <strong>trial</strong> — одно испытание (одна конфигурация{" "}
        <Code>λ</Code>).
      </li>
      <li>
        <strong>objective</strong> — ваша функция, которая по <Code>trial</Code> строит
        конфигурацию, обучает модель и возвращает метрику.
      </li>
    </ul>

    <ProseP>
      Главная фишка Optuna — <strong>define-by-run</strong>: пространство поиска не описывается
      заранее статической схемой, а <strong>строится прямо в коде</strong>{" "}
      <Code>objective</Code> вызовами <Code>trial.suggest_*</Code>. Это даёт обычные питоновские{" "}
      <Code>if</Code> и циклы — и поэтому условные пространства пишутся тривиально.
    </ProseP>

    <CyberCodeBlock language="python" filename="optuna_objective.py">
      {OBJECTIVE_CODE}
    </CyberCodeBlock>

    <ProseP>Несколько практических замечаний:</ProseP>

    <ul className="space-y-2 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <Code>suggest_float(..., log=True)</Code> — современная замена устаревшего{" "}
        <Code>suggest_loguniform</Code>. Старые методы <Code>suggest_loguniform</Code> /{" "}
        <Code>suggest_uniform</Code> ещё работают, но помечены deprecated — используйте{" "}
        <Code>suggest_float</Code>/<Code>suggest_int</Code>.
      </li>
      <li>
        <Code>TPESampler(multivariate=True)</Code> моделирует зависимости между осями (а не каждую
        независимо) — обычно полезно.
      </li>
      <li>
        <Code>n_startup_trials</Code> у TPE — сколько первых испытаний берутся случайно, чтобы
        засеять плотности <Code>ℓ</Code> и <Code>g</Code> (по умолчанию <Code>10</Code>).
      </li>
    </ul>

    <ProseP>
      <strong>Прунинг внутри objective.</strong> Чтобы прунер заработал, объективная функция должна{" "}
      <em>отчитываться</em> о промежуточном качестве через <Code>trial.report(...)</Code> и
      проверять <Code>trial.should_prune()</Code>:
    </ProseP>

    <CyberCodeBlock language="python" filename="optuna_pruning.py">
      {PRUNE_CODE}
    </CyberCodeBlock>

    <ProseP>
      <strong>Распределённый поиск.</strong> Чтобы запустить десятки воркеров параллельно,
      достаточно общего хранилища (SQLite или полноценная СУБД) и одного <Code>study_name</Code>.
      Каждый процесс берёт следующее испытание из общей истории — никакой ручной синхронизации:
    </ProseP>

    <CyberCodeBlock language="pseudo" filename="distributed.sh">
      {DIST_CODE}
    </CyberCodeBlock>

    <KeyPoints
      items={[
        <>
          Три понятия Optuna: <strong>study</strong> (процесс), <strong>trial</strong> (одна
          конфигурация), <strong>objective</strong> (ваша функция → метрика).
        </>,
        <>
          <strong>Define-by-run</strong>: пространство строится в коде через{" "}
          <Code>trial.suggest_*</Code>; условные оси — обычными <Code>if</Code>.
        </>,
        <>
          <Code>suggest_float(..., log=True)</Code> вместо устаревшего{" "}
          <Code>suggest_loguniform</Code>.
        </>,
        <>
          Прунинг = <Code>trial.report(value, step)</Code> +{" "}
          <Code>if trial.should_prune(): raise TrialPruned()</Code>.
        </>,
        <>
          Распределёнка: общее хранилище (SQLite/СУБД) + один <Code>study_name</Code>, воркеры
          запускаются независимо.
        </>,
      ]}
    />
  </>
);

export default Section8;
