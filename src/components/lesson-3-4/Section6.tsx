import CyberCodeBlock from "@/components/CyberCodeBlock";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints, Callout, WarnNote, Code } from "./_shared";

const Section6 = () => (
  <>
    <h2 id="razdel-6-unity-mlagents" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 6. Unity ML-Agents — практическая реализация
    </h2>

    <ProseP>
      <strong>Версия.</strong> Актуальный стабильный релиз — <strong>Release 22</strong>; пакет{" "}
      <Code>com.unity.ml-agents 4.0.x</Code> («ML-Agents 4.0.0 is here … support for the powerful
      Inference Engine»). Минимальная версия Unity — 2022.3 LTS; инференс перешёл с Barracuda на{" "}
      <strong>Unity Sentis</strong> (Barracuda deprecated). Python ≥ 3.10.12, PyTorch ≥ 2.1.1.
      Установка: <Code>git clone --branch release_22 …</Code>.
    </ProseP>

    <h3 className={H3_CLASS}>Demonstration Recorder</h3>
    <ProseP>
      Чтобы записать демо, добавьте компонент <Code>Demonstration Recorder</Code> на GameObject с{" "}
      <Code>Agent</Code>. Поля:
    </ProseP>
    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <Code>Record</Code> — включает запись;
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <Code>Num Steps To Record</Code> — сколько шагов записать;{" "}
          <strong>0 = пока вручную не остановите play-сессию</strong>;
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <Code>Demonstration Name</Code> — базовое имя файла;
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <Code>Demonstration Directory</Code> — папка (по умолчанию{" "}
          <Code>Assets/Demonstrations/</Code>).
        </span>
      </li>
    </ul>
    <ProseP>
      При запуске сцены создаётся файл <Code>.demo</Code>, хранящий наблюдения, действия и награды.
      Клик по файлу показывает метаданные в Inspector. Для разреженных задач (напр., Pyramids)
      документация Unity отмечает: «всего 6 эпизодов демо сокращают число шагов обучения более чем в
      4 раза».
    </ProseP>

    <h3 className={H3_CLASS}>Behavioral Cloning — секция YAML</h3>
    <div className="overflow-x-auto rounded-2xl border border-cyan-500/20 bg-card/60 backdrop-blur-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-foreground/90 border-b border-cyan-500/20">
            <th className="p-3 font-semibold">Поле</th>
            <th className="p-3 font-semibold">Дефолт</th>
            <th className="p-3 font-semibold">Назначение / диапазон</th>
          </tr>
        </thead>
        <tbody className="align-top">
          <tr className="border-t border-cyan-500/10">
            <td className="p-3"><Code>demo_path</Code></td>
            <td className="p-3 text-amber-300">обязательно</td>
            <td className="p-3 text-foreground/85">Путь к <Code>.demo</Code> файлу или папке.</td>
          </tr>
          <tr className="border-t border-cyan-500/10">
            <td className="p-3"><Code>strength</Code></td>
            <td className="p-3"><Code>1.0</Code></td>
            <td className="p-3 text-foreground/85">LR имитации относительно PPO. Типичный диапазон <Code>0.1–0.5</Code>.</td>
          </tr>
          <tr className="border-t border-cyan-500/10">
            <td className="p-3"><Code>steps</Code></td>
            <td className="p-3"><Code>0</Code></td>
            <td className="p-3 text-foreground/85">Шагов, на которых BC активен. <strong>0 = всю тренировку.</strong> Положительное значение — это и есть BC-warmup.</td>
          </tr>
          <tr className="border-t border-cyan-500/10">
            <td className="p-3"><Code>batch_size</Code></td>
            <td className="p-3">тренера</td>
            <td className="p-3 text-foreground/85">Continuous: <Code>512–5120</Code>; Discrete: <Code>32–512</Code>.</td>
          </tr>
          <tr className="border-t border-cyan-500/10">
            <td className="p-3"><Code>num_epoch</Code></td>
            <td className="p-3">тренера</td>
            <td className="p-3 text-foreground/85">Проходов по буферу. Диапазон <Code>3–10</Code>.</td>
          </tr>
          <tr className="border-t border-cyan-500/10">
            <td className="p-3"><Code>samples_per_update</Code></td>
            <td className="p-3"><Code>0</Code></td>
            <td className="p-3 text-foreground/85">Макс. сэмплов на обновление; <Code>0</Code> = по всем демо.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 className={H3_CLASS}>GAIL как reward signal — секция YAML</h3>
    <ProseP>
      <strong>Важно:</strong> в 4.0.x используется вложенный <Code>network_settings</Code>, а{" "}
      <strong>не</strong> устаревший <Code>encoding_size</Code>.
    </ProseP>
    <div className="overflow-x-auto rounded-2xl border border-cyan-500/20 bg-card/60 backdrop-blur-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-foreground/90 border-b border-cyan-500/20">
            <th className="p-3 font-semibold">Поле</th>
            <th className="p-3 font-semibold">Дефолт</th>
            <th className="p-3 font-semibold">Назначение / диапазон</th>
          </tr>
        </thead>
        <tbody className="align-top">
          <tr className="border-t border-cyan-500/10">
            <td className="p-3"><Code>strength</Code></td>
            <td className="p-3"><Code>1.0</Code></td>
            <td className="p-3 text-foreground/85">Множитель сырой GAIL-награды. <strong>При человеческих демо + extrinsic — ниже ~0.1.</strong> Диапазон <Code>0.01–1.0</Code>.</td>
          </tr>
          <tr className="border-t border-cyan-500/10">
            <td className="p-3"><Code>gamma</Code></td>
            <td className="p-3"><Code>0.99</Code></td>
            <td className="p-3 text-foreground/85">Дисконт. Диапазон <Code>0.8–0.9</Code>.</td>
          </tr>
          <tr className="border-t border-cyan-500/10">
            <td className="p-3"><Code>demo_path</Code></td>
            <td className="p-3 text-amber-300">обязательно</td>
            <td className="p-3 text-foreground/85">Путь к <Code>.demo</Code> файлу/папке.</td>
          </tr>
          <tr className="border-t border-cyan-500/10">
            <td className="p-3"><Code>network_settings</Code></td>
            <td className="p-3">общий блок</td>
            <td className="p-3 text-foreground/85">Сеть дискриминатора (<Code>hidden_units</Code>/<Code>num_layers</Code>). <Code>hidden_units</Code>: <Code>64–256</Code>.</td>
          </tr>
          <tr className="border-t border-cyan-500/10">
            <td className="p-3"><Code>learning_rate</Code></td>
            <td className="p-3"><Code>3e-4</Code></td>
            <td className="p-3 text-foreground/85">LR дискриминатора. Понижайте при нестабильности. <Code>1e-5–1e-3</Code>.</td>
          </tr>
          <tr className="border-t border-cyan-500/10">
            <td className="p-3"><Code>use_actions</Code></td>
            <td className="p-3"><Code>false</Code></td>
            <td className="p-3 text-foreground/85">Дискриминирует по <Code>(s,a)</Code> (<Code>true</Code>) или только по <Code>s</Code> (<Code>false</Code>). State-only стабильнее при шумных демо.</td>
          </tr>
          <tr className="border-t border-cyan-500/10">
            <td className="p-3"><Code>use_vail</Code></td>
            <td className="p-3"><Code>false</Code></td>
            <td className="p-3 text-foreground/85">Вариационное «бутылочное горло» (VAIL): стабилизирует обучение ценой времени. Включайте при нестабильной имитации.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <WarnNote>
      <strong>Грабли версий.</strong> Старые туториалы и YAML (release ≤ ~13) показывают{" "}
      <Code>gail: … encoding_size: 128</Code>. В release 22 / 4.0.x этого поля <strong>нет</strong>{" "}
      — используйте <Code>network_settings: {"{ hidden_units, num_layers }"}</Code>, иначе конфиг не
      пройдёт валидацию. Также <Code>online_bc</Code>, <Code>brain_to_imitate</Code> и Broadcast Hub —
      давно удалённый API.
    </WarnNote>

    <Callout title="⚠️ Survivor bias GAIL" color="amber">
      Документация ML-Agents прямо предупреждает: GAIL вознаграждает «похожесть на эксперта», поэтому{" "}
      <strong>стимулирует агента оставаться живым как можно дольше</strong>. В задачах, где эпизод
      должен завершаться быстро (доехать до финиша), это конфликтует с целью. Рецепт Unity:{" "}
      <strong>низкий <Code>strength</Code> GAIL + разреженный extrinsic</strong> при достижении цели —
      тогда GAIL ведёт агента, пока он не нашёл extrinsic-сигнал, и не перебивает его.
    </Callout>

    <h3 className={H3_CLASS}>Полный рабочий YAML (BC-warmup + GAIL + PPO + extrinsic)</h3>
    <CyberCodeBlock language="python" filename="racer_gail_bc.yaml">
{`behaviors:
  RacerAgent:
    trainer_type: ppo

    hyperparameters:
      batch_size: 2048            # непрерывные действия (руль, газ) -> большой batch
      buffer_size: 20480          # кратно больше batch_size
      learning_rate: 3.0e-4
      learning_rate_schedule: linear
      beta: 5.0e-3
      beta_schedule: constant
      epsilon: 0.2
      epsilon_schedule: linear
      lambd: 0.95
      num_epoch: 3
      shared_critic: false

    network_settings:
      normalize: true             # полезно для непрерывного контроля
      hidden_units: 256
      num_layers: 2
      vis_encode_type: simple

    max_steps: 1.0e7
    time_horizon: 1000            # длинные круги -> длинный горизонт
    summary_freq: 20000
    keep_checkpoints: 5
    checkpoint_interval: 500000
    threaded: false

    # --- BC-warmup: сильный разгон в начале, затем выключается ---
    behavioral_cloning:
      demo_path: Assets/Demonstrations/RacerExpert.demo
      strength: 0.5
      steps: 300000              # BC активен ~первые 300k шагов, потом 0
      batch_size: 2048
      num_epoch: 3
      samples_per_update: 0

    reward_signals:
      # extrinsic: цель гонки (чекпойнты/финиш) + shaping из Проекта 3
      extrinsic:
        strength: 1.0
        gamma: 0.99

      # GAIL: задаёт "стиль" вождения, низкий strength из-за человеческих демо
      gail:
        strength: 0.1            # держим низким (неоптимальные демо + extrinsic)
        gamma: 0.99
        demo_path: Assets/Demonstrations/RacerExpert.demo
        learning_rate: 3.0e-4
        use_actions: false       # state-only: стабильнее с шумными демо
        use_vail: false          # включить, если GAIL-лосс нестабилен
        network_settings:
          hidden_units: 128      # дискриминатор: 64-256
          num_layers: 2`}
    </CyberCodeBlock>

    <KeyPoints
      items={[
        <>
          В ML-Agents 4.0.x — только <Code>network_settings</Code> в блоке <Code>gail:</Code>;{" "}
          <Code>encoding_size</Code> удалён.
        </>,
        <>
          BC ставится как <strong>warmup</strong> (<Code>steps</Code> &gt; 0), GAIL — как
          дополнительный <Code>reward_signal</Code> к <Code>extrinsic</Code>.
        </>,
        <>
          Survivor bias GAIL ⇒ держите низкий <Code>strength</Code> и обязательно extrinsic-цель.
        </>,
      ]}
    />
  </>
);

export default Section6;
