import Math from "@/components/Math";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints, Callout, InteractiveStub } from "./_shared";

const CODE_OBS = `public override void CollectObservations(VectorSensor sensor)
{
    // Локальные координаты и скорость агента
    sensor.AddObservation(transform.localPosition);          // 3 числа
    sensor.AddObservation(rb.velocity);                      // 3 числа
    // Вектор на цель в локальной системе агента (инвариантность к повороту)
    Vector3 toTarget = transform.InverseTransformPoint(target.position);
    sensor.AddObservation(toTarget.normalized);              // 3 числа
    sensor.AddObservation(toTarget.magnitude / arenaRadius); // 1 число, нормировано
}`;

const CODE_ACT = `public override void OnActionReceived(ActionBuffers actions)
{
    // Непрерывная ветка: газ и поворот
    float thrust = Mathf.Clamp(actions.ContinuousActions[0], -1f, 1f);
    float turn   = Mathf.Clamp(actions.ContinuousActions[1], -1f, 1f);
    // Дискретная ветка: 0 — не стрелять, 1 — стрелять
    bool fire = actions.DiscreteActions[0] == 1;

    rb.AddForce(transform.forward * thrust * moveSpeed);
    transform.Rotate(Vector3.up, turn * turnSpeed * Time.fixedDeltaTime);
    if (fire) Shoot();
}`;

const Section2 = () => (
  <>
    <h2 id="etap-1-sreda" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 2. Этап 1 — Среда
    </h2>

    <ProseP>
      Среда — это <strong>MDP</strong>, в котором живёт агент (определение MDP —{" "}
      <CrossLinkToLesson lessonId="3.1" lessonPath="/courses/3-1" lessonTitle="Урок 3.1" lessonLevel={3}>урок 3.1</CrossLinkToLesson>). На этом этапе вы переводите игровую идею в три технических решения: <strong>наблюдения</strong>, <strong>действия</strong>, <strong>структура эпизода</strong>.
    </ProseP>

    <h3 className={H3_CLASS}>Наблюдения (observations)</h3>
    <ProseP>
      Агенту нужно «видеть» ровно то, что необходимо для решения задачи, — не меньше и не больше. В ML-Agents наблюдения собираются тремя способами:
    </ProseP>
    <ul className="space-y-2 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li><strong>Вектор-наблюдения</strong> — числа, которые вы добавляете вручную в <code>CollectObservations(VectorSensor sensor)</code>: позиции, скорости, углы, расстояния до цели.</li>
      <li><strong>Ray Perception Sensor</strong> — «лучевое зрение»: набор лучей, возвращающих, какой тег объекта они задели и на каком расстоянии. Идеален для восприятия препятствий и врагов без камеры.</li>
      <li><strong>Camera/RenderTexture Sensor</strong> — пиксельные наблюдения через CNN-энкодер (<code>vis_encode_type</code>). Дороже по вычислениям; берите только если задачу нельзя решить вектором/лучами.</li>
    </ul>

    <CyberCodeBlock language="csharp" filename="AgentObservations.cs">{CODE_OBS}</CyberCodeBlock>

    <Callout title="Важно: нормировка наблюдений" color="amber">
      Передавайте величины примерно в диапазоне <Math display={false}>{String.raw`[-1, 1]`}</Math> или включайте <code>normalize: true</code> в <code>network_settings</code>. Сырые координаты в сотнях метров «забивают» градиент и замедляют обучение.
    </Callout>

    <h3 className={H3_CLASS}>Действия (actions)</h3>
    <ProseP>
      Пространство действий — либо <strong>дискретное</strong> (ветки: «влево/стоять/вправо»), либо <strong>непрерывное</strong> (вещественные значения руля/газа), либо смешанное. Непрерывные действия и почему для них нужен Actor-Critic —{" "}
      <CrossLinkToLesson lessonId="2.3" lessonPath="/courses/2-3" lessonTitle="Урок 2.3" lessonLevel={2}>урок 2.3</CrossLinkToLesson>; как SAC параметризует непрерывную политику —{" "}
      <CrossLinkToLesson lessonId="3.1" lessonPath="/courses/3-1" lessonTitle="Урок 3.1" lessonLevel={3}>урок 3.1</CrossLinkToLesson>.
    </ProseP>

    <CyberCodeBlock language="csharp" filename="AgentActions.cs">{CODE_ACT}</CyberCodeBlock>

    <h3 className={H3_CLASS}>Структура эпизода и параллелизм</h3>
    <ProseP>
      В <code>OnEpisodeBegin()</code> среда сбрасывается в случайное стартовое состояние (доменная рандомизация повышает робастность). <code>EndEpisode()</code> вызывается при победе, проигрыше или таймауте (<code>MaxStep</code> на агенте). Чтобы обучение шло быстрее, <strong>сцену-арену дублируют десятки раз</strong> (Training Area Replicator) — все копии шлют опыт в один буфер.
    </ProseP>

    <InteractiveStub title="Интерактив (рекомендация)">
      Песочница «дизайн наблюдений»: тогглы включают вектор/лучи/камеру, слайдер числа лучей; рядом — оценка размерности входа и «стоимости» сети. Значения слайдеров держать в <code>useRef</code> (анимационный цикл canvas не читает React-state напрямую); при сбоях canvas — перестроить на SVG.
    </InteractiveStub>

    <KeyPoints
      items={[
        <>Среда = MDP: вы проектируете <strong>наблюдения, действия и эпизод</strong>.</>,
        <>Наблюдения <strong>нормируйте</strong>; используйте локальные (агент-центричные) координаты для инвариантности к повороту.</>,
        <>Тип действий (дискретные/непрерывные/смешанные) задаёт выбор алгоритма и формы политики.</>,
        <><strong>Дублируйте арену</strong> на много копий — это главный бесплатный ускоритель обучения.</>,
      ]}
    />
  </>
);

export default Section2;
