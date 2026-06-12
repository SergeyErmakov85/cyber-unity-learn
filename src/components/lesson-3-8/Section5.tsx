import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints } from "./_shared";

const CODE = `import optuna
from optuna.integration.wandb import WeightsAndBiasesCallback

wandbc = WeightsAndBiasesCallback(metric_name="final_reward",
                                  wandb_kwargs={"project": "arena-rl"})

@wandbc.track_in_wandb()
def objective(trial):
    lr   = trial.suggest_float("learning_rate", 1e-5, 1e-3, log=True)
    beta = trial.suggest_float("beta", 1e-4, 1e-2, log=True)
    eps  = trial.suggest_float("epsilon", 0.1, 0.3)
    # ... сгенерировать YAML с этими значениями, запустить mlagents-learn,
    #     распарсить итоговый Environment/Cumulative Reward из результатов
    return run_training(lr=lr, beta=beta, epsilon=eps)

study = optuna.create_study(direction="maximize",
                            sampler=optuna.samplers.TPESampler())
study.optimize(objective, n_trials=40, callbacks=[wandbc])
print(study.best_params)`;

const Section5 = () => (
  <>
    <h2 id="etap-4-optimizaciya" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 5. Этап 4 — Оптимизация
    </h2>

    <ProseP>
      Дефолтный конфиг даёт «рабочего» агента; оптимизация превращает его в <strong>сильного</strong>. Три инструмента, по возрастанию автоматизации.
    </ProseP>

    <h3 className={H3_CLASS}>1. Ручная диагностика по TensorBoard</h3>
    <ProseP>
      Сначала — глазами. Reward на плато → проверьте награду/наблюдения (вернитесь к этапам 1–2). Энтропия упала слишком рано → агент «схлопнулся» в одну стратегию, поднимите <code>beta</code>. Value Loss скачет → уменьшите <code>learning_rate</code>.
    </ProseP>

    <h3 className={H3_CLASS}>2. Автоматический свип через Optuna</h3>
    <ProseP>
      Optuna (актуален, активно поддерживается) перебирает гиперпараметры байесовским методом (<strong>TPE</strong>, Tree-structured Parzen Estimator), который на порядок эффективнее grid search. Идея: задаём <code>objective</code>, возвращающий итоговый reward прогона, Optuna сама предлагает следующую конфигурацию.
    </ProseP>

    <CyberCodeBlock language="python" filename="sweep_optuna.py">{CODE}</CyberCodeBlock>

    <h3 className={H3_CLASS}>3. Логирование и сравнение в W&B</h3>
    <ProseP>
      Связка Optuna + Weights & Biases (callback <code>WeightsAndBiasesCallback</code>) сохраняет каждый trial в облако: графики важности параметров, parallel-coordinates, сравнение прогонов. Базовые приёмы W&B —{" "}
      <CrossLinkToLesson lessonId="2.6" lessonPath="/courses/2-6" lessonTitle="Урок 2.6" lessonLevel={2}>урок 2.6</CrossLinkToLesson>.
    </ProseP>

    <h3 className={H3_CLASS}>4. FCA-анализ результатов свипа ↗</h3>
    <ProseP>
      Когда у вас десятки trial'ов, удобно структурировать их через <strong>формальный анализ понятий</strong>: объекты — прогоны, признаки — «high reward», «low entropy collapse», «lr&lt;1e-4» и т.п. Решётка понятий показывает, <strong>какие сочетания гиперпараметров устойчиво ведут к успеху</strong>, — это фирменная методология платформы (теория ↗{" "}
      <CrossLinkToHub hubPath="/fca-rl" hubTitle="FCA для RL">хаб FCA</CrossLinkToHub>).
    </ProseP>

    <KeyPoints
      items={[
        <>Сначала <strong>диагностируйте глазами</strong> (TensorBoard), потом автоматизируйте.</>,
        <>Optuna с <strong>TPE</strong> ищет гиперпараметры на порядок эффективнее перебора.</>,
        <><strong>W&B</strong> хранит и сравнивает trial'ы; интеграция с Optuna — один callback.</>,
        <><strong>FCA-анализ</strong> превращает облако прогонов в решётку «какие сочетания параметров → успех».</>,
      ]}
    />
  </>
);

export default Section5;
