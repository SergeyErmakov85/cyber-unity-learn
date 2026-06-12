import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints } from "./_shared";

const CURRICULUM = `environment_parameters:
  enemy_speed:
    curriculum:
      - name: Lesson0_Slow
        completion_criteria:
          measure: reward        # или progress
          behavior: ArenaAgent
          signal_smoothing: true
          min_lesson_length: 100
          threshold: 0.5
        value: 2.0
      - name: Lesson1_Medium
        completion_criteria:
          measure: reward
          behavior: ArenaAgent
          threshold: 0.7
          min_lesson_length: 100
          require_reset: true
        value: 4.0
      - name: Lesson2_Fast    # последнему уроку completion_criteria не нужен
        value: 8.0`;

const GAIL = `    behavioral_cloning:
      demo_path: ./demos/ExpertArena.demo
      strength: 0.5
      steps: 10000
    reward_signals:
      extrinsic:
        strength: 1.0
        gamma: 0.99
      gail:
        strength: 0.1
        gamma: 0.99
        demo_path: ./demos/ExpertArena.demo`;

const Section8 = () => (
  <>
    <h2 id="bonus-tehniki" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 8. Бонусные техники
    </h2>

    <ProseP>
      Обязательная часть проекта даёт работающего NPC. Бонусы поднимают его до «production-уровня».
    </ProseP>

    <h3 className={H3_CLASS}>Curriculum Learning (новое)</h3>
    <ProseP>
      Если задача слишком трудна «с нуля», обучайте <strong>от простого к сложному</strong>, постепенно меняя параметр среды (например, размер арены или скорость врага). В ML-Agents это секция <code>environment_parameters → curriculum</code>: список уроков с критерием перехода <code>completion_criteria</code>.
    </ProseP>

    <CyberCodeBlock language="yaml" filename="curriculum.yaml">{CURRICULUM}</CyberCodeBlock>

    <ProseP>
      Из C# текущее значение читается через <code>Academy.Instance.EnvironmentParameters.GetWithDefault("enemy_speed", 8.0f)</code> — при инференсе вернётся дефолт. Прогресс по урокам виден в TensorBoard.
    </ProseP>

    <h3 className={H3_CLASS}>Self-Play (повтор из 3.2)</h3>
    <ProseP>
      Для <strong>конкурентного</strong> NPC обучайте агента против всё более сильных копий себя — механику Self-Play, нестационарность и рейтинг <strong>ELO</strong> мы подробно разобрали в{" "}
      <CrossLinkToLesson lessonId="3.2" lessonPath="/courses/3-2" lessonTitle="Урок 3.2" lessonLevel={3}>уроке 3.2</CrossLinkToLesson>. Здесь достаточно добавить секцию <code>self_play</code> в конфиг; новых понятий нет.
    </ProseP>

    <h3 className={H3_CLASS}>GAIL и имитационное обучение (новое)</h3>
    <ProseP>
      Если у вас есть <strong>демонстрации эксперта</strong> (записи геймплея человека через Demonstration Recorder → <code>.demo</code>), ускорьте обучение, заставив агента имитировать их. Два механизма:
    </ProseP>

    <ul className="space-y-2 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li><strong>Behavioral Cloning (BC)</strong> — supervised-имитация: секция <code>behavioral_cloning</code> (поля <code>demo_path</code>, <code>strength</code>, <code>steps</code>).</li>
      <li><strong>GAIL</strong> (Generative Adversarial Imitation Learning, Ho &amp; Ermon, 2016) — интенсивная награда <code>gail</code>, где дискриминатор учится отличать поведение агента от эксперта, а агент — его обманывать; это даёт обобщение лучше «слепого» копирования.</li>
    </ul>

    <CyberCodeBlock language="yaml" filename="bc_gail.yaml">{GAIL}</CyberCodeBlock>

    <KeyPoints
      items={[
        <><strong>Curriculum Learning</strong> (<code>environment_parameters → curriculum</code>) обучает от простого к сложному через <code>completion_criteria</code>.</>,
        <><strong>Self-Play</strong> — техника из{" "}
          <CrossLinkToLesson lessonId="3.2" lessonPath="/courses/3-2" lessonTitle="Урок 3.2" lessonLevel={3}>урока 3.2</CrossLinkToLesson>; добавьте секцию <code>self_play</code>, новых понятий нет.</>,
        <><strong>GAIL/BC</strong> учат из демонстраций эксперта: BC копирует, GAIL обобщает через дискриминатор.</>,
      ]}
    />
  </>
);

export default Section8;
