import Math from "@/components/Math";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints, Callout } from "./_shared";

const chip = "px-1 rounded bg-muted/50 text-xs font-mono";

const CSHARP = `// Значение по умолчанию (0.0f) используется, если параметр не задан в YAML
float friction = Academy.Instance.EnvironmentParameters
                        .GetWithDefault("surface_friction", 1.0f);`;

const YAML_RANDOMIZE = `behaviors:
  Racer:
    trainer_type: ppo
    # ... гиперпараметры PPO как в Проекте 3 — здесь не повторяем (см. урок 3.1) ...

# Отдельная секция — НЕ внутри behaviors
environment_parameters:
  # Сцепление шин с покрытием: норма вокруг сухого асфальта
  surface_friction:
    sampler_type: gaussian
    sampler_parameters:
      mean: 1.0
      st_dev: 0.15

  # Шум лучевых датчиков (ray sensors): равномерно
  sensor_noise:
    sampler_type: uniform
    sampler_parameters:
      min_value: 0.0
      max_value: 0.08

  # Освещённость: два режима — «сумерки» и «день» — через мультидиапазон
  ambient_light:
    sampler_type: multirangeuniform
    sampler_parameters:
      intervals: [[0.2, 0.4], [0.8, 1.0]]`;

const YAML_CURRICULUM = `environment_parameters:
  track_difficulty:
    curriculum:
      - name: L0_ШирокаяПрямая
        completion_criteria:
          measure: reward
          behavior: Racer
          signal_smoothing: true
          min_lesson_length: 100
          threshold: 0.7
        value: 0.0

      - name: L1_ПлавныеПовороты
        completion_criteria:
          measure: reward
          behavior: Racer
          signal_smoothing: true
          min_lesson_length: 100
          threshold: 0.7
        value: 1.0

      - name: L2_УзкаяТрасса
        completion_criteria:
          measure: progress
          behavior: Racer
          signal_smoothing: true
          min_lesson_length: 150
          threshold: 0.5
          require_reset: true     # меняем раскладку трассы → нужен сброс
        value:
          sampler_type: uniform   # value-как-сэмплер: диапазон сложностей
          sampler_parameters:
            min_value: 2.0
            max_value: 3.0

      - name: L3_ПрепятствияИСоперники   # последний урок — без completion_criteria
        value: 4.0`;

const YAML_ELO = `environment_parameters:
  opponent_strength:
    curriculum:
      - name: Разминка
        completion_criteria:
          measure: Elo            # доступно только в режиме self-play
          behavior: Racer
          signal_smoothing: true
          min_lesson_length: 200
          threshold: 1200
        value: 0.0
      - name: Бой
        value: 1.0`;

const Section7 = () => (
  <>
    <h2 id="razdel-7-unity-ml-agents" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 7. Реализация в Unity ML-Agents: полный YAML
    </h2>

    <ProseP>
      Теперь — как всё это включается в Unity. И рандомизация, и учебный план в ML-Agents живут{" "}
      <strong>не</strong> в секции <code className={chip}>behaviors</code> (где гиперпараметры PPO/SAC
      из уроков 3.1), а в отдельной секции <strong><code className={chip}>environment_parameters</code></strong>.
      Сама привязка параметров к сцене и YAML — в хабе{" "}
      <CrossLinkToHub
        hubPath="/unity-ml-agents"
        hubTitle="Unity ML-Agents → environment_parameters"
      >
        Unity ML-Agents ↗
      </CrossLinkToHub>
      . Внутри сцены к параметру обращаются так:
    </ProseP>

    <CyberCodeBlock language="csharp" filename="RacerEnvironment.cs">
      {CSHARP}
    </CyberCodeBlock>

    <h3 className={H3_CLASS}>7.1. Рандомизация: сэмплеры</h3>
    <ProseP>
      Вместо одного числа параметру задают <strong>сэмплер</strong>. Поддерживаются три типа:
    </ProseP>

    <div className="my-6 overflow-x-auto rounded-xl border border-cyan-500/15 bg-card/40 backdrop-blur-sm">
      <table className="w-full min-w-[640px] text-[14px] text-foreground/90">
        <thead>
          <tr className="border-b border-cyan-500/20 bg-cyan-500/5">
            <th className="text-left py-3 px-4 font-semibold text-cyan-400">
              <code className={chip}>sampler_type</code>
            </th>
            <th className="text-left py-3 px-4 font-semibold text-cyan-400">Что делает</th>
            <th className="text-left py-3 px-4 font-semibold text-cyan-400">
              Параметры (<code className={chip}>sampler_parameters</code>)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">
              <code className={chip}>uniform</code>
            </td>
            <td className="py-3 px-4">
              Равномерно из <Math display={false}>{String.raw`[\min, \max]`}</Math> (включительно)
            </td>
            <td className="py-3 px-4">
              <code className={chip}>min_value</code>, <code className={chip}>max_value</code>
            </td>
          </tr>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">
              <code className={chip}>gaussian</code>
            </td>
            <td className="py-3 px-4">Из нормального распределения</td>
            <td className="py-3 px-4">
              <code className={chip}>mean</code>, <code className={chip}>st_dev</code>
            </td>
          </tr>
          <tr className="align-top">
            <td className="py-3 px-4">
              <code className={chip}>multirangeuniform</code>
            </td>
            <td className="py-3 px-4">
              Сначала выбирает интервал (пропорционально его длине), потом равномерно внутри него
            </td>
            <td className="py-3 px-4">
              <code className={chip}>{`intervals: [[a₁,b₁],[a₂,b₂],…]`}</code>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Callout title="⚠️ Грабли именования" color="amber">
      <p>
        В документации Unity тип мультидиапазона в <strong>прозе</strong> иногда пишут как{" "}
        <code className={chip}>multirange_uniform</code> (с подчёркиванием), но во <strong>всех</strong>{" "}
        поставляемых примерах конфигов и в рабочем парсере он называется{" "}
        <strong><code className={chip}>multirangeuniform</code></strong> (без подчёркивания).
        Используйте <code className={chip}>multirangeuniform</code> и при сомнении сверьтесь с{" "}
        <code className={chip}>Sampler.cs</code> и примерами <code className={chip}>config/</code> вашей
        версии ML-Agents.
      </p>
    </Callout>

    <ProseP>Полный фрагмент рандомизации для гонщика:</ProseP>
    <CyberCodeBlock language="pseudo" filename="racer_randomize.yaml">
      {YAML_RANDOMIZE}
    </CyberCodeBlock>

    <ProseP>
      Запуск — как обычно (
      <code className={chip}>mlagents-learn config/racer_randomize.yaml --run-id=racer-rnd</code>);
      параметр, которого нет в сцене, просто игнорируется.
    </ProseP>

    <h3 className={H3_CLASS}>7.2. Учебный план: уроки</h3>
    <ProseP>
      Учебный план — это подсекция <code className={chip}>curriculum</code> у параметра: список{" "}
      <strong>уроков</strong>, у каждого есть <code className={chip}>name</code>,{" "}
      <code className={chip}>completion_criteria</code> и <code className={chip}>value</code> (число{" "}
      <strong>или</strong> сэмплер). У последнего урока <code className={chip}>completion_criteria</code>{" "}
      не нужен.
    </ProseP>

    <ProseP>
      Поля <code className={chip}>completion_criteria</code>:
    </ProseP>

    <div className="my-6 overflow-x-auto rounded-xl border border-purple-500/15 bg-card/40 backdrop-blur-sm">
      <table className="w-full min-w-[640px] text-[14px] text-foreground/90">
        <thead>
          <tr className="border-b border-purple-500/20 bg-purple-500/5">
            <th className="text-left py-3 px-4 font-semibold text-purple-400 w-1/4">Поле</th>
            <th className="text-left py-3 px-4 font-semibold text-purple-400">Назначение</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">
              <code className={chip}>measure</code>
            </td>
            <td className="py-3 px-4 leading-relaxed">
              По чему мерить прогресс: <code className={chip}>reward</code> (награда),{" "}
              <code className={chip}>progress</code> (доля <code className={chip}>steps/max_steps</code>
              ), <code className={chip}>Elo</code> (<strong>только</strong> для self-play — см.{" "}
              <CrossLinkToHub hubPath="/courses/3-2" hubAnchor="раздел-7-система-рейтинга-elo" hubTitle="Урок 3.2 — ELO">
                урок 3.2
              </CrossLinkToHub>
              )
            </td>
          </tr>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">
              <code className={chip}>behavior</code>
            </td>
            <td className="py-3 px-4 leading-relaxed">
              Какое поведение отслеживать (если их несколько)
            </td>
          </tr>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">
              <code className={chip}>threshold</code>
            </td>
            <td className="py-3 px-4 leading-relaxed">
              Значение <code className={chip}>measure</code>, при котором урок переключается
            </td>
          </tr>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">
              <code className={chip}>min_lesson_length</code>
            </td>
            <td className="py-3 px-4 leading-relaxed">
              Мин. число эпизодов до возможной смены урока; для <code className={chip}>reward</code>{" "}
              сравнивается <strong>средняя</strong> награда последних{" "}
              <code className={chip}>min_lesson_length</code> эпизодов (а не та, что в консоли)
            </td>
          </tr>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">
              <code className={chip}>signal_smoothing</code>
            </td>
            <td className="py-3 px-4 leading-relaxed">
              Сглаживать ли текущую меру предыдущими значениями
            </td>
          </tr>
          <tr className="align-top">
            <td className="py-3 px-4">
              <code className={chip}>require_reset</code>
            </td>
            <td className="py-3 px-4 leading-relaxed">
              Требуется ли сброс среды при смене урока (по умолчанию <code className={chip}>false</code>)
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ProseP>
      Полный учебный план для гонщика (обратите внимание: на L2 <code className={chip}>value</code> —
      это уже <strong>сэмплер</strong>, то есть урок задаёт не одно значение, а целый диапазон —
      мини-ADR прямо в ML-Agents):
    </ProseP>
    <CyberCodeBlock language="pseudo" filename="racer_curriculum.yaml">
      {YAML_CURRICULUM}
    </CyberCodeBlock>

    <ProseP>
      А если трасса тренируется через <strong>self-play</strong> (как в Проекте 3 с соперниками), мерой
      прогресса можно взять <strong>ELO</strong> — то самое, что мы считали в{" "}
      <CrossLinkToHub hubPath="/courses/3-2" hubAnchor="раздел-7-система-рейтинга-elo" hubTitle="Урок 3.2 — ELO">
        уроке 3.2
      </CrossLinkToHub>
      :
    </ProseP>
    <CyberCodeBlock language="pseudo" filename="racer_selfplay_curriculum.yaml">
      {YAML_ELO}
    </CyberCodeBlock>

    <h3 className={H3_CLASS}>7.3. Что смотреть в TensorBoard</h3>
    <ProseP>
      ML-Agents логирует <strong>номер текущего урока</strong> и прогресс по нему — именно так вы
      проверяете, что план реально переключается, а не застрял. Сопоставляйте кривую номера урока с
      кривой награды: здоровый план — это «ступеньки» награды, синхронные со сменой уроков. Подробно про
      метрики и инструменты —{" "}
      <CrossLinkToHub hubPath="/courses/2-6" hubTitle="Урок 2.6 — TensorBoard и W&B">
        урок 2.6 (TensorBoard и W&B)
      </CrossLinkToHub>
      .
    </ProseP>

    <KeyPoints
      items={[
        <>
          Рандомизация и учебный план задаются в отдельной секции{" "}
          <strong><code className={chip}>environment_parameters</code></strong>, не внутри{" "}
          <code className={chip}>behaviors</code>.
        </>,
        <>
          Три сэмплера: <code className={chip}>uniform</code> (
          <code className={chip}>min_value</code>/<code className={chip}>max_value</code>),{" "}
          <code className={chip}>gaussian</code> (<code className={chip}>mean</code>/
          <code className={chip}>st_dev</code>), <code className={chip}>multirangeuniform</code> (
          <code className={chip}>intervals</code>). Осторожно с именем{" "}
          <code className={chip}>multirangeuniform</code>.
        </>,
        <>
          Урок = <code className={chip}>name</code> + <code className={chip}>completion_criteria</code>{" "}
          (<code className={chip}>measure</code>/<code className={chip}>behavior</code>/
          <code className={chip}>threshold</code>/<code className={chip}>min_lesson_length</code>/
          <code className={chip}>signal_smoothing</code>/<code className={chip}>require_reset</code>) +{" "}
          <code className={chip}>value</code> (число <strong>или</strong> сэмплер).
        </>,
        <>
          <code className={chip}>measure: Elo</code> доступна <strong>только</strong> в self-play (см.{" "}
          <CrossLinkToHub hubPath="/courses/3-2" hubAnchor="раздел-7-система-рейтинга-elo" hubTitle="Урок 3.2 — ELO">
            урок 3.2
          </CrossLinkToHub>
          ); <code className={chip}>value</code>-как-сэмплер = учебный план над рандомизацией прямо в
          ML-Agents.
        </>,
      ]}
    />
  </>
);

export default Section7;
