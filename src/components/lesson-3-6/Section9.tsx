import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Callout, Code } from "./_shared";

const SWEEP_YAML = `# sweep.yaml — конфигурация W&B Sweep
method: bayes            # grid | random | bayes
metric:
  name: eval/mean_reward
  goal: maximize
parameters:
  learning_rate:
    distribution: log_uniform_values
    min: 1.0e-5
    max: 1.0e-3
  beta:
    distribution: log_uniform_values
    min: 1.0e-4
    max: 1.0e-2
  batch_size:
    values: [512, 1024, 2048]
early_terminate:           # ранняя остановка (аналог прунинга)
  type: hyperband
  min_iter: 3
`;

const SWEEP_PY = `import wandb

sweep_id = wandb.sweep(sweep_config, project="racing-hpo")

def train():
    wandb.init()                       # config заполняет агент sweep'а
    cfg = wandb.config
    model = train_agent(cfg.learning_rate, cfg.beta, cfg.batch_size)
    wandb.log({"eval/mean_reward": evaluate(model)})

wandb.agent(sweep_id, function=train, count=50)
`;

const INTEG_PY = `import optuna
from optuna_integration.wandb import WeightsAndBiasesCallback

wandbc = WeightsAndBiasesCallback(
    metric_name="eval/mean_reward",
    wandb_kwargs={"project": "racing-hpo"},
    as_multirun=True,                 # каждый trial — отдельный run в W&B
)

@wandbc.track_in_wandb()
def objective(trial):
    lr = trial.suggest_float("learning_rate", 1e-5, 1e-3, log=True)
    return train_and_eval(lr)

study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=100, callbacks=[wandbc])  # n_jobs=1 для корректного порядка
`;

const Section9 = () => (
  <>
    <h2 id="раздел-9-wandb-sweeps" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 9. W&amp;B Sweeps и связка Optuna ↔ W&amp;B
    </h2>

    <ProseP>
      С Weights &amp; Biases вы уже знакомы по{" "}
      <CrossLinkToLesson lessonId="2.6" lessonPath="/courses/2-6" lessonTitle="Урок 2.6" lessonLevel={2}>
        уроку 2.6
      </CrossLinkToLesson>
      : runs, логирование метрик, дашборды. У W&amp;B есть и собственный механизм HPO —{" "}
      <strong>Sweeps</strong>. Конфиг задаётся декларативно (словарь или YAML):
    </ProseP>

    <CyberCodeBlock language="pseudo" filename="sweep.yaml">
      {SWEEP_YAML}
    </CyberCodeBlock>

    <CyberCodeBlock language="python" filename="run_sweep.py">
      {SWEEP_PY}
    </CyberCodeBlock>

    <ProseP>
      W&amp;B Sweeps поддерживает три стратегии: <Code>grid</Code>, <Code>random</Code> и{" "}
      <Code>bayes</Code> (байесовский поиск на гауссовом процессе), плюс{" "}
      <Code>early_terminate</Code> типа <Code>hyperband</Code>. Сильная сторона —{" "}
      <strong>бесшовная визуализация</strong>: parallel-coordinates, importance-графики и таблицы
      прямо в веб-интерфейсе, без отдельной настройки.
    </ProseP>

    <ProseP>
      <strong>Как выбрать.</strong> Грубое правило:
    </ProseP>

    <ul className="space-y-2 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        Нужны <strong>условные/древовидные пространства</strong>, кастомные прунеры,
        распределённый поиск через общую БД, TPE/CMA-ES — берите <strong>Optuna</strong>.
      </li>
      <li>
        Хотите всё «из коробки» в одном веб-интерфейсе, командную видимость прогона, минимум кода —
        берите <strong>W&amp;B Sweeps</strong>.
      </li>
    </ul>

    <ProseP>
      И главное — это <strong>не взаимоисключающий выбор</strong>. Лучший практический сетап:{" "}
      <strong>поиск ведёт Optuna, а логирование и визуализацию берёт на себя W&amp;B</strong>. Для
      этого есть готовый колбэк <Code>WeightsAndBiasesCallback</Code> (теперь он живёт в отдельном
      пакете <Code>optuna-integration</Code>, модуль <Code>optuna_integration.wandb</Code>):
    </ProseP>

    <CyberCodeBlock language="python" filename="optuna_wandb.py">
      {INTEG_PY}
    </CyberCodeBlock>

    <ProseP>
      Так каждое испытание Optuna становится run&apos;ом в W&amp;B со всеми его параметрами и
      метриками — вы получаете умный поиск Optuna и богатые дашборды W&amp;B одновременно.
    </ProseP>

    <Callout title="Замечание" color="cyan">
      Колбэк переехал из <Code>optuna.integration</Code> в отдельный пакет{" "}
      <Code>optuna-integration</Code> — ставьте <Code>pip install optuna-integration wandb</Code> и
      импортируйте из <Code>optuna_integration.wandb</Code>. Старый путь{" "}
      <Code>optuna.integration.WeightsAndBiasesCallback</Code> устарел.
    </Callout>

    <KeyPoints
      items={[
        <>
          W&amp;B Sweeps: декларативный конфиг (<Code>method</Code>: grid/random/bayes),{" "}
          <Code>metric</Code>, <Code>parameters</Code>, <Code>early_terminate: hyperband</Code>.
        </>,
        <>W&amp;B bayes использует гауссов процесс; сила W&amp;B — визуализация и командная видимость из коробки.</>,
        <>Optuna выигрывает на условных пространствах, кастомных прунерах и распределёнке.</>,
        <>
          Лучшее из двух миров: поиск — Optuna, логирование — W&amp;B через{" "}
          <Code>WeightsAndBiasesCallback</Code> (пакет <Code>optuna-integration</Code>).
        </>,
      ]}
    />
  </>
);

export default Section9;
