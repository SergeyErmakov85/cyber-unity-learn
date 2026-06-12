import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Callout } from "./_shared";

const YAML_CONFIG = `behaviors:
  RacingAgent:
    trainer_type: ppo
    hyperparameters:
      batch_size: 2048
      buffer_size: 20480
      learning_rate: 3.0e-4
      learning_rate_schedule: linear
      beta: 5.0e-3
      epsilon: 0.2
      lambd: 0.95
      num_epoch: 3
      shared_critic: false        # true, если перешли на наблюдение с камеры
    network_settings:
      normalize: true             # непрерывное управление — нормализуем входы
      hidden_units: 256           # дефолт 128; шире под сложную динамику трассы
      num_layers: 2               # дефолт 2; диапазон 1–3
      vis_encode_type: simple     # актуально только при визуальных наблюдениях
      # memory:                   # раскомментировать ТОЛЬКО при POMDP
      #   sequence_length: 64
      #   memory_size: 256        # кратно 2
    reward_signals:
      extrinsic:
        strength: 1.0
        gamma: 0.99
    max_steps: 1.0e7
    time_horizon: 1000
    summary_freq: 20000
`;

const Section8 = () => (
  <>
    <h2 id="razdel-8-unity-yaml" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 8. Применение в Unity ML-Agents: блок <code>network_settings</code>
    </h2>

    <ProseP>
      Соберём всё в один конфиг для гоночного агента из{" "}
      <CrossLinkToLesson lessonId="project-3" lessonPath="/courses/project-3" lessonTitle="Проект 3" lessonLevel={3}>
        Проекта 3
      </CrossLinkToLesson>
      . Это та самая секция, что молча присутствовала в конфигах уроков 3.1–3.4, — теперь вы
      понимаете каждое поле.
    </ProseP>

    <CyberCodeBlock language="yaml" filename="racing_agent.yaml">
      {YAML_CONFIG}
    </CyberCodeBlock>

    <ProseP>
      <strong>Разбор полей <code>network_settings</code></strong> (дефолты и диапазоны — из
      официальной документации ML-Agents 4.0.x):
    </ProseP>

    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border border-cyan-500/20 rounded-lg overflow-hidden">
        <thead className="bg-cyan-500/10">
          <tr className="text-left text-cyan-200">
            <th className="p-3">Поле</th>
            <th className="p-3">Дефолт</th>
            <th className="p-3">Диапазон</th>
            <th className="p-3">Смысл</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cyan-500/10 text-foreground/85">
          <tr><td className="p-3"><code>hidden_units</code></td><td className="p-3">128</td><td className="p-3">32–512</td><td className="p-3">Ширина MLP/головы (ёмкость)</td></tr>
          <tr><td className="p-3"><code>num_layers</code></td><td className="p-3">2</td><td className="p-3">1–3</td><td className="p-3">Глубина сети после энкодера</td></tr>
          <tr><td className="p-3"><code>normalize</code></td><td className="p-3">false</td><td className="p-3">—</td><td className="p-3">Нормализация векторных входов</td></tr>
          <tr><td className="p-3"><code>vis_encode_type</code></td><td className="p-3"><code>simple</code></td><td className="p-3"><code>simple</code>/<code>nature_cnn</code>/<code>resnet</code>/<code>match3</code>/<code>fully_connected</code></td><td className="p-3">Энкодер для пикселей</td></tr>
          <tr><td className="p-3"><code>goal_conditioning_type</code></td><td className="p-3"><code>hyper</code></td><td className="p-3"><code>none</code>/<code>hyper</code></td><td className="p-3">Как примешивать цель: <code>hyper</code> = HyperNetwork генерирует часть весов</td></tr>
          <tr><td className="p-3"><code>memory.memory_size</code></td><td className="p-3">128</td><td className="p-3">32–256 (кратно 2)</td><td className="p-3">Размер скрытого состояния LSTM</td></tr>
          <tr><td className="p-3"><code>memory.sequence_length</code></td><td className="p-3">64</td><td className="p-3">—</td><td className="p-3">Длина обучающих последовательностей</td></tr>
        </tbody>
      </table>
    </div>

    <Callout title="Замечание о версии (ML-Agents 4.0.x)" color="amber">
      В пакете <code>com.unity.ml-agents</code> 4.0.x поле <code>encoding_size</code> удалено —
      размер представления задаётся через <code>network_settings</code> (<code>hidden_units</code>),
      а не отдельным полем внутри <code>memory</code>. Старые конфиги с <code>encoding_size</code>{" "}
      не загрузятся; используйте структуру выше.
    </Callout>

    <Callout title="Про goal_conditioning_type" color="purple">
      Если агент получает <strong>цель</strong> как отдельное наблюдение (целевой чекпоинт), режим{" "}
      <code>hyper</code> (дефолт) пускает её через HyperNetwork, генерирующий часть весов политики.
      Это резко увеличивает число параметров — при <code>hyper</code> рекомендуется{" "}
      <strong>уменьшать <code>hidden_units</code></strong>.
    </Callout>

    <KeyPoints
      items={[
        <>
          Весь выбор архитектуры выражается в блоке <code>network_settings</code> (+ опциональный{" "}
          <code>memory</code>).
        </>,
        <>
          Запоминаемые дефолты: <code>hidden_units=128</code>, <code>num_layers=2</code>,{" "}
          <code>normalize=false</code>, <code>vis_encode_type=simple</code>,{" "}
          <code>memory_size=128</code>.
        </>,
        <>В 4.0.x <strong>нет <code>encoding_size</code></strong> — размерность задаётся через <code>network_settings</code>.</>,
        <>
          <code>goal_conditioning_type: hyper</code> (дефолт) — HyperNetwork под цель, требует
          урезать <code>hidden_units</code>.
        </>,
      ]}
    />
  </>
);

export default Section8;
