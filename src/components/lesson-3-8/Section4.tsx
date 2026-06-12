import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints, Callout } from "./_shared";

const CMD = `# Запуск с параллельными средами и несколькими ареналами в одной сцене
mlagents-learn config/arena_ppo.yaml --run-id=arena_v1 --num-envs=8 --num-areas=16
# Возобновление прерванного прогона:
mlagents-learn config/arena_ppo.yaml --run-id=arena_v1 --resume`;

const PPO = `behaviors:
  ArenaAgent:
    trainer_type: ppo
    max_steps: 5000000          # типично 5e5 – 1e7
    time_horizon: 64            # диапазон 32 – 2048
    summary_freq: 50000
    keep_checkpoints: 5
    checkpoint_interval: 500000

    hyperparameters:
      learning_rate: 3.0e-4     # 1e-5 – 1e-3
      learning_rate_schedule: linear   # для PPO рекомендуется linear
      batch_size: 1024          # непрерывные ~512–5120; дискретные 32–512
      buffer_size: 10240        # PPO: 2048 – 409600; кратно больше batch_size
      beta: 5.0e-3              # сила энтропийной регуляризации, 1e-4 – 1e-2
      epsilon: 0.2              # клиппинг PPO, 0.1 – 0.3
      lambd: 0.95               # GAE-lambda, 0.9 – 0.95
      num_epoch: 3              # проходов по буферу

    network_settings:
      hidden_units: 256         # 32 – 512
      num_layers: 2             # 1 – 3
      normalize: true           # нормировка вектор-наблюдений
      vis_encode_type: simple   # для пиксельных входов

    reward_signals:
      extrinsic:
        strength: 1.0
        gamma: 0.99             # дисконт-фактор`;

const SAC = `    trainer_type: sac
    hyperparameters:
      learning_rate: 3.0e-4
      learning_rate_schedule: constant   # для SAC рекомендуется constant
      batch_size: 256                    # непрерывные SAC: 128 – 1024
      buffer_size: 500000                # SAC: 50000 – 1000000
      buffer_init_steps: 0
      tau: 0.005                         # мягкое обновление target-сетей
      steps_per_update: 10.0
      init_entcoef: 0.5                  # стартовая температура энтропии
      save_replay_buffer: false
      reward_signal_steps_per_update: 10.0`;

const Section4 = () => (
  <>
    <h2 id="etap-3-obuchenie" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 4. Этап 3 — Обучение
    </h2>

    <ProseP>
      Обучение запускается одной командой; всё поведение задаётся <strong>YAML-конфигом</strong>. Сами алгоритмы вы уже знаете: вывод SAC —{" "}
      <CrossLinkToLesson lessonId="3.1" lessonPath="/courses/3-1" lessonTitle="Урок 3.1" lessonLevel={3}>урок 3.1</CrossLinkToLesson>, PPO применяли в{" "}
      <CrossLinkToLesson lessonId="project-3" lessonPath="/courses/project-3" lessonTitle="Проект 3" lessonLevel={3}>проекте 3</CrossLinkToLesson>, MARL/MA-POCA —{" "}
      <CrossLinkToLesson lessonId="3.2" lessonPath="/courses/3-2" lessonTitle="Урок 3.2" lessonLevel={3}>урок 3.2</CrossLinkToLesson>. Здесь — <strong>как</strong> это конфигурируется и запускается (актуально для ML-Agents Release 23, пакет <code>com.unity.ml-agents</code> 4.0.x, Unity 2022.3+).
    </ProseP>

    <CyberCodeBlock language="pseudo" filename="run.sh">{CMD}</CyberCodeBlock>

    <h3 className={H3_CLASS}>Полный конфиг PPO (с дефолтами и диапазонами)</h3>
    <CyberCodeBlock language="pseudo" filename="arena_ppo.yaml">{PPO}</CyberCodeBlock>

    <h3 className={H3_CLASS}>Вариант SAC (off-policy, сэмпл-эффективнее)</h3>
    <ProseP>
      SAC заменяет PPO-секцию <code>hyperparameters</code> своими полями (replay buffer, мягкое обновление target-сетей через <code>tau</code>, авто-температура энтропии — всё это вы выводили в{" "}
      <CrossLinkToLesson lessonId="3.1" lessonPath="/courses/3-1" lessonTitle="Урок 3.1" lessonLevel={3}>уроке 3.1</CrossLinkToLesson>):
    </ProseP>
    <CyberCodeBlock language="pseudo" filename="arena_sac.yaml">{SAC}</CyberCodeBlock>

    <Callout title="MA-POCA" color="cyan">
      Для командных игр (этап-пример «спорт») используйте <code>trainer_type: poca</code> — конфиг <strong>полностью совпадает с PPO</strong>, дополнительных POCA-полей нет. Почему именно POCA для команд —{" "}
      <CrossLinkToLesson lessonId="3.2" lessonPath="/courses/3-2" lessonTitle="Урок 3.2" lessonLevel={3}>урок 3.2</CrossLinkToLesson>.
    </Callout>

    <h3 className={H3_CLASS}>Что смотреть на TensorBoard</h3>
    <ProseP>
      <code>Environment/Cumulative Reward</code> должен расти; <code>Policy/Entropy</code> — медленно убывать (резкое падение → увеличьте <code>beta</code>); <code>Losses/Value Loss</code> — стабилизироваться. Полная диагностика и связка с W&B разобраны в{" "}
      <CrossLinkToLesson lessonId="2.6" lessonPath="/courses/2-6" lessonTitle="Урок 2.6" lessonLevel={2}>уроке 2.6</CrossLinkToLesson> — не повторяем.
    </ProseP>

    <KeyPoints
      items={[
        <>Обучение запускается <code>mlagents-learn</code>; <strong>поведение целиком в YAML</strong>.</>,
        <><code>--num-envs</code> и <code>--num-areas</code> — главные ускорители: параллельные среды и копии арены.</>,
        <>PPO: <code>linear</code>-schedule, <code>epsilon</code> 0.2, <code>beta</code> 5e-3, <code>lambd</code> 0.95. SAC: <code>constant</code>-schedule, большой <code>buffer_size</code>, <code>tau</code> 0.005.</>,
        <><strong>MA-POCA = конфиг PPO</strong> с <code>trainer_type: poca</code>.</>,
      ]}
    />
  </>
);

export default Section4;
