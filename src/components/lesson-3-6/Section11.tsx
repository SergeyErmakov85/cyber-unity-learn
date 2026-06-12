import Math from "@/components/Math";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Callout, Code } from "./_shared";

type Row = [string, string, string, string];

const HP_ROWS: Row[] = [
  ["learning_rate", "3.0e-4", "log-uniform", String.raw`[10^{-5},\,10^{-3}]`],
  ["beta", "5.0e-3", "log-uniform", String.raw`[10^{-4},\,10^{-2}]`],
  ["epsilon", "0.2", "uniform", "[0.1, 0.3]"],
  ["lambd", "0.95", "uniform", "[0.90, 0.99]"],
  ["num_epoch", "3", "int", "[3, 10]"],
  ["batch_size", "1024", "categorical", "{512, 1024, 2048}"],
  ["buffer_size", "10240", "categorical", "{10240, 20480, 40960}"],
  ["hidden_units", "128", "categorical", "{128, 256, 512}"],
  ["gamma (extrinsic)", "0.99", "uniform", "[0.95, 0.995]"],
  ["gail: strength", "—", "uniform (условно)", "[0.01, 0.5]"],
];

const MAKE_CFG = `import optuna, subprocess, yaml, json
from pathlib import Path

DEFAULT_MAX_STEPS = 300_000        # урезанный бюджет на испытание (для поиска)

def make_config(trial) -> dict:
    bs = trial.suggest_categorical("batch_size", [512, 1024, 2048])
    return {
        "behaviors": {
            "RacingAgent": {
                "trainer_type": "ppo",
                "hyperparameters": {
                    "batch_size": bs,
                    "buffer_size": bs * trial.suggest_categorical("buf_mult", [10, 20, 40]),
                    "learning_rate": trial.suggest_float("learning_rate", 1e-5, 1e-3, log=True),
                    "beta": trial.suggest_float("beta", 1e-4, 1e-2, log=True),
                    "epsilon": trial.suggest_float("epsilon", 0.1, 0.3),
                    "lambd": trial.suggest_float("lambd", 0.90, 0.99),
                    "num_epoch": trial.suggest_int("num_epoch", 3, 10),
                    "learning_rate_schedule": "linear",
                },
                "network_settings": {                 # ML-Agents 4.0.x: размер сети здесь
                    "hidden_units": trial.suggest_categorical("hidden_units", [128, 256, 512]),
                    "num_layers": 2,
                    "normalize": True,
                },
                "reward_signals": {
                    "extrinsic": {
                        "gamma": trial.suggest_float("gamma", 0.95, 0.995),
                        "strength": 1.0,
                    },
                    "gail": {                          # GAIL-разогрев из урока 3.4
                        "strength": trial.suggest_float("gail_strength", 0.01, 0.5),
                        "demo_path": "Demos/expert_racing.demo",
                    },
                },
                "max_steps": DEFAULT_MAX_STEPS,
                "time_horizon": 64,
                "summary_freq": 10_000,
            }
        }
    }

def objective(trial) -> float:
    cfg = make_config(trial)
    run_id = f"racing_trial_{trial.number}"
    cfg_path = Path(f"configs/{run_id}.yaml")
    cfg_path.write_text(yaml.safe_dump(cfg))

    # (б) запускаем обучение подпроцессом
    subprocess.run(
        ["mlagents-learn", str(cfg_path),
         f"--run-id={run_id}", "--env=builds/racing", "--no-graphics", "--force"],
        check=True,
    )

    # (в) читаем итоговую среднюю награду из результатов обучения
    return read_final_reward(f"results/{run_id}")    # парсинг stats → float
`;

const RUN_CODE = `study = optuna.create_study(
    direction="maximize",
    sampler=optuna.samplers.TPESampler(n_startup_trials=10, multivariate=True),
    pruner=optuna.pruners.HyperbandPruner(min_resource=50_000, max_resource=DEFAULT_MAX_STEPS, reduction_factor=3),
    storage="sqlite:///racing.db", study_name="racing", load_if_exists=True,
)
study.optimize(objective, n_trials=80, callbacks=[wandbc])   # wandbc из раздела 9
print("Лучшая конфигурация:", study.best_params)
`;

const Section11 = () => (
  <>
    <h2 id="раздел-11-гоночный-агент" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 11. Сквозной пример: тюнинг гоночного агента
    </h2>

    <ProseP>
      Соберём всё вместе на нашем гоночном агенте из{" "}
      <CrossLinkToLesson lessonId="project-3" lessonPath="/courses/project-3" lessonTitle="Проект 3" lessonLevel={3}>
        Проекта 3
      </CrossLinkToLesson>
      . Он обучается PPO, с GAIL-разогревом из{" "}
      <CrossLinkToLesson lessonId="3.4" lessonPath="/courses/3-4" lessonTitle="Урок 3.4" lessonLevel={3}>
        урока 3.4
      </CrossLinkToLesson>{" "}
      и domain randomization из{" "}
      <CrossLinkToLesson lessonId="3.3" lessonPath="/courses/3-3" lessonTitle="Урок 3.3" lessonLevel={3}>
        урока 3.3
      </CrossLinkToLesson>
      . Задача — автоматически подобрать конфигурацию ML-Agents.
    </ProseP>

    <ProseP>
      <strong>Шаг 1. Метрика (objective).</strong> Что максимизируем? Для гонки — среднюю награду
      за последние эпизоды (она кодирует прогресс по трассе и штрафы за вылеты). Для
      self-play-режимов это была бы ELO из{" "}
      <CrossLinkToLesson lessonId="3.2" lessonPath="/courses/3-2" lessonTitle="Урок 3.2" lessonLevel={3}>
        урока 3.2
      </CrossLinkToLesson>
      . Важно: чтобы метрика была не слишком шумной, усредняйте по нескольким сидам или по «хвосту»
      обучения.
    </ProseP>

    <ProseP>
      <strong>Шаг 2. Пространство поиска.</strong> Берём ключевые гиперпараметры PPO (значения по
      умолчанию из доки ML-Agents — для ориентира):
    </ProseP>

    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border border-cyan-500/20 rounded-lg overflow-hidden">
        <thead className="bg-muted/30">
          <tr>
            {["Гиперпараметр", "Дефолт ML-Agents", "Тип в поиске", "Диапазон"].map((h) => (
              <th key={h} className="text-left p-3 text-foreground font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-cyan-500/10 text-foreground/85">
          {HP_ROWS.map((r) => (
            <tr key={r[0]}>
              <td className="p-3 font-mono text-cyan-300">{r[0]}</td>
              <td className="p-3 font-mono">{r[1]}</td>
              <td className="p-3">{r[2]}</td>
              <td className="p-3">
                <Math display={false}>{r[3]}</Math>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <Callout title="⚠️ Важно" color="amber">
      <Code>buffer_size</Code> должен быть кратен <Code>batch_size</Code> — это ограничение
      задавайте в коде (например,{" "}
      <Code>buffer_size = batch_size * trial.suggest_categorical(&quot;buffer_mult&quot;, [10, 20, 40])</Code>
      ). И помните версионную деталь ML-Agents 4.0.x: поле <Code>encoding_size</Code> удалено —
      размер сети задаётся через <Code>network_settings</Code> (<Code>hidden_units</Code>,{" "}
      <Code>num_layers</Code>).
    </Callout>

    <ProseP>
      <strong>Шаг 3. Интеграция Optuna с ML-Agents.</strong> ML-Agents обучается из командной
      строки утилитой <Code>mlagents-learn</Code>, читая YAML-конфиг. Значит, objective-функция
      должна: (а) собрать YAML из значений, предложенных <Code>trial</Code>; (б) запустить обучение
      подпроцессом; (в) прочитать итоговую награду; (г) вернуть её Optuna.
    </ProseP>

    <CyberCodeBlock language="python" filename="racing_objective.py">
      {MAKE_CFG}
    </CyberCodeBlock>

    <ProseP>
      <strong>Шаг 4. Прунинг по бюджету шагов.</strong> Полный прогон каждого испытания дорог.
      Стратегия: давайте каждому испытанию <strong>урезанный</strong> бюджет (<Code>max_steps</Code>{" "}
      уменьшен), а ASHA-прунер по промежуточной награде на ранних чекпойнтах отсекает явных
      аутсайдеров. Промежуточную награду берут из статистики обучения ML-Agents (например, парсингом
      значений из директории <Code>results/&lt;run_id&gt;</Code>), сообщая её через{" "}
      <Code>trial.report(...)</Code>. После того как ASHA выделит горстку лидеров, дообучите 1–2
      лучшие конфигурации на полном бюджете.
    </ProseP>

    <ProseP>
      <strong>Шаг 5. Запуск и анализ.</strong>
    </ProseP>

    <CyberCodeBlock language="python" filename="run_study.py">
      {RUN_CODE}
    </CyberCodeBlock>

    <ProseP>
      Готово: вы получили воспроизводимую, объективную конфигурацию гоночного агента — без ручного
      «покрутил и посмотрел». Лучшие параметры переносите в боевой YAML и дообучайте на полном{" "}
      <Code>max_steps</Code>.
    </ProseP>

    <KeyPoints
      items={[
        <>
          Objective для ML-Agents: собрать YAML из <Code>trial</Code> → запустить{" "}
          <Code>mlagents-learn</Code> подпроцессом → прочитать итоговую награду → вернуть её.
        </>,
        <>Метрика — средняя награда за хвост обучения (или ELO для self-play); усредняйте по сидам, чтобы снизить шум.</>,
        <>
          <Code>buffer_size</Code> кратен <Code>batch_size</Code>; размер сети — через{" "}
          <Code>network_settings</Code> (ML-Agents 4.0.x, <Code>encoding_size</Code> удалён).
        </>,
        <>Прунинг: урезанный бюджет на испытание + ASHA/Hyperband по промежуточной награде, затем дообучение лидеров на полном бюджете.</>,
      ]}
    />
  </>
);

export default Section11;
