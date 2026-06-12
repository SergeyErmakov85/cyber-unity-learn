import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, Callout } from "./_shared";

const CHECKLIST = `# 1. Завершить обучение и получить финальный .onnx
mlagents-learn config/race.yaml --run-id=race_v7
#    ... обучение ... → Ctrl+C (один раз, дождаться записи)
#    Итог: results/race_v7/RaceAgent.onnx

# 2. Импорт в Unity
#    Перетащить RaceAgent.onnx → Assets/Models/

# 3. Привязка к агенту (Behavior Parameters)
#    Model:           RaceAgent (импортированный ассет)
#    Behavior Name:   RaceAgent        (== имя при обучении)
#    Behavior Type:   Inference Only   (продакшн-режим)
#    Inference Device: CPU             (маленькая сеть → CPU быстрее)
#    Deterministic Inference: ✔        (предсказуемые соперники)

# 4. Частота решений (Decision Requester)
#    Decision Period: 5                (== обучению; ~10 решений/с при 50 Гц)
#    Take Actions Between Decisions: ✔

# 5. Сверка контракта (Раздел 8)
#    Space Size, сенсоры, Stacked Vectors, действия — как при обучении

# 6. Build Settings
#    Scripting Backend: IL2CPP
#    Целевая платформа: проверить совместимость Graphics API / compute shaders
#    (Development Build на первой сборке — чтобы видеть логи загрузчика)

# 7. Профилирование на целевом устройстве
#    N агентов × t_inf укладывается в бюджет кадра? Если нет — поднять Decision Period`;

const Section9 = () => (
  <>
    <h2 id="razdel-9-checklist" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 9. Inference-чеклист для гоночного агента (сквозной пример целиком)
    </h2>

    <ProseP>
      Соберём весь путь воедино — от завершённого обучения до агента в собранной игре. Это финальная
      стадия пайплайна Уровня 3: демонстрации → BC-разогрев → PPO + GAIL (
      <CrossLinkToHub
        hubPath="/courses/3-4"
        hubAnchor="razdel-5-pipeline"
        hubTitle="Урок 3.4 — пайплайн"
      >
        ↩ Урок 3.4
      </CrossLinkToHub>
      ) → <strong>деплой</strong>.
    </ProseP>

    <CyberCodeBlock language="pseudo" filename="deploy-checklist.sh">
      {CHECKLIST}
    </CyberCodeBlock>

    <ProseP>
      Полные значения полей YAML, на которых обучался этот агент, и спецификацию{" "}
      <code>network_settings</code> смотрите в хабе:{" "}
      <CrossLinkToHub
        hubPath="/unity-ml-agents"
        hubAnchor="yaml-config"
        hubTitle="Unity ML-Agents — YAML и обучение"
      >
        ↗ Хаб: Unity ML-Agents → YAML и обучение
      </CrossLinkToHub>
      . Формальный разбор того, <em>что</em> за политику мы деплоим (актор PPO, голова стратегии), —{" "}
      <CrossLinkToHub
        hubPath="/algorithms/ppo"
        hubAnchor="policy-network"
        hubTitle="Хаб PPO — политика как сеть"
      >
        ↗ Хаб: PPO
      </CrossLinkToHub>
      .
    </ProseP>

    <Callout title="▶️ Что дальше" color="cyan">
      На этом основной трек обучения гоночного агента завершён: вы умеете обучить политику, сделать
      её устойчивой и <strong>выпустить в билд</strong>. Дальше курс уходит в более тонкие темы —
      оптимизацию инференса под конкретные платформы, ансамбли ботов и онлайн-обновление политик. Но
      фундамент деплоя у вас уже есть.
    </Callout>

    <KeyPoints
      items={[
        <>
          Полный путь: финальный <code>.onnx</code> → импорт → Behavior Parameters (Model +
          Inference Only + device) → Decision Period → сверка контракта → IL2CPP-билд → профиль на
          устройстве.
        </>,
        <>Деплой — финальная стадия пайплайна Уровня 3, надстройка над 3.3 и 3.4.</>,
        <>Значения YAML и формальная начинка политики вынесены в хабы, здесь — только процедура.</>,
      ]}
    />
  </>
);

export default Section9;
