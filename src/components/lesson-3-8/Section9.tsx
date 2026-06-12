import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints, Callout } from "./_shared";

const Section9 = () => (
  <>
    <h2 id="chetyre-proekta" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 9. Четыре эталонных проекта
    </h2>

    <ProseP>
      Ниже — четыре проекта, каждый проходит <strong>все шесть этапов</strong> и закрывает <strong>обязательные + бонусные</strong> требования. «Как» для каждого этапа берите из разделов 2–8 (ссылки в скобках); здесь — <strong>проектные решения, специфичные именно для этой игры</strong>.
    </ProseP>

    <Callout title="Допущение по объёму" color="cyan">
      Полная самостоятельная реализация всех четырёх проектов с нуля — это объём <strong>четырёх отдельных уроков</strong>. Поэтому ниже каждый проект дан как <strong>завершённый бриф «замысел → реализация»</strong> со ссылками на общую методологию (разделы 2–8), а не как четырёхкратное повторение всего конвейера. Если вы захотите развернуть каждый проект в самостоятельный полноразмерный урок, структура к этому готова: проекты можно вынести в подуроки <strong>3.8.1–3.8.4</strong> (по одному на проект) — каждый раздел 9.x уже самодостаточен.
    </Callout>

    <h3 id="proekt-arena" className={`${H3_CLASS} scroll-mt-24`}>9.1 🎯 Арена-шутер — сквозной пример (PPO)</h3>
    <ProseP>NPC-противник на арене учится уклоняться и стрелять; игрок управляет персонажем вручную.</ProseP>
    <ul className="space-y-2 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li><strong>Этап 1 — Среда.</strong> Круглая арена с укрытиями. Наблюдения: Ray Perception (видимость игрока и укрытий) + вектор (своё здоровье, перезарядка). Действия — смешанные: непрерывные (движение, поворот) + дискретное (выстрел). Дублируем арену ×16 (раздел 2).</li>
      <li><strong>Этап 2 — Награда.</strong> <code>+1</code> за попадание, <code>+5</code> за победу, <code>-0.5</code> за полученный урон, мелкий dense за сокращение дистанции, <code>-0.0005</code>/шаг. Защита от reward hacking — крупный терминальный бонус (раздел 3).</li>
      <li><strong>Этап 3 — Обучение.</strong> <code>trainer_type: ppo</code>, конфиг из раздела 4, <code>--num-envs=8</code>.</li>
      <li><strong>Этап 4 — Оптимизация.</strong> Optuna-свип по <code>learning_rate</code>, <code>beta</code>, <code>epsilon</code>; W&B-логи; FCA-анализ устойчивых конфигов (раздел 5).</li>
      <li><strong>Этап 5 — Деплой.</strong> ONNX → <code>Inference Only</code> в Sentis (раздел 6).</li>
      <li><strong>Этап 6 — Геймплей.</strong> WASD + мышь для игрока, follow-камера, HUD здоровья/счёта, билд под PC.</li>
      <li><strong>Бонус.</strong> <strong>Curriculum Learning</strong> по точности/скорости врага: сначала медленный и неточный NPC, затем — смертоносный (раздел 8).</li>
    </ul>

    <h3 id="proekt-sport" className={`${H3_CLASS} scroll-mt-24`}>9.2 ⚽ Спортивная игра 2v2 (Self-Play + MA-POCA)</h3>
    <ProseP>Футбол/хоккей 2 на 2: NPC-напарник помогает, NPC-противники обучены через Self-Play.</ProseP>
    <ul className="space-y-2 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li><strong>Этап 1 — Среда.</strong> Поле, мяч с физикой, ворота. Наблюдения: позиции/скорости мяча, союзника, соперников (агент-центрично). Непрерывные действия (движение + удар).</li>
      <li><strong>Этап 2 — Награда.</strong> Командная: <code>+1</code> за гол, <code>-1</code> за пропуск, мелкий dense за продвижение мяча к воротам соперника. Распределение командной награды между агентами — задача MA-POCA (<CrossLinkToLesson lessonId="3.2" lessonPath="/courses/3-2" lessonTitle="Урок 3.2" lessonLevel={3}>урок 3.2</CrossLinkToLesson>).</li>
      <li><strong>Этап 3 — Обучение.</strong> <code>trainer_type: poca</code> (конфиг = PPO) + секция <code>self_play</code> для соперников.</li>
      <li><strong>Этап 4 — Оптимизация.</strong> Контроль кривой <strong>ELO</strong> (<CrossLinkToLesson lessonId="3.2" lessonPath="/courses/3-2" lessonTitle="Урок 3.2" lessonLevel={3}>урок 3.2</CrossLinkToLesson>); Optuna по награде и параметрам self-play.</li>
      <li><strong>Этап 5 — Деплой.</strong> Две ONNX-модели (напарник / соперник) → разные <code>BehaviorParameters</code>.</li>
      <li><strong>Этап 6 — Геймплей.</strong> Игрок — один из четырёх игроков, спортивный HUD, счёт, таймер.</li>
      <li><strong>Бонус.</strong> <strong>GAIL</strong> из записей реальных матчей-демонстраций для более «человечного» стиля паса (раздел 8); <strong>Self-Play</strong> — основная механика соперников.</li>
    </ul>

    <h3 id="proekt-gonki" className={`${H3_CLASS} scroll-mt-24`}>9.3 🏎️ Гоночная игра (PPO + checkpoint-награды)</h3>
    <ProseP>
      NPC-соперники проходят трассу; развитие{" "}
      <CrossLinkToLesson lessonId="project-3" lessonPath="/courses/project-3" lessonTitle="Проект 3" lessonLevel={3}>проекта 3</CrossLinkToLesson>{" "}до полноценной игры.
    </ProseP>
    <ul className="space-y-2 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li><strong>Этап 1 — Среда.</strong> Трасса с <strong>checkpoint</strong>-триггерами. Наблюдения: лучи на стены/соперников + вектор скорости и направления на следующий чекпойнт. Непрерывные действия (руль, газ, тормоз).</li>
      <li><strong>Этап 2 — Награда.</strong> <code>+1</code> за каждый пройденный чекпойнт по порядку, dense за скорость вдоль трассы, штраф за столкновение/разворот, бонус за круг.</li>
      <li><strong>Этап 3 — Обучение.</strong> <code>trainer_type: ppo</code>; базовый PPO-агент уже знаком по{" "}
        <CrossLinkToLesson lessonId="project-3" lessonPath="/courses/project-3" lessonTitle="Проект 3" lessonLevel={3}>проекту 3</CrossLinkToLesson> — переиспользуем подход, не выводим заново.</li>
      <li><strong>Этап 4 — Оптимизация.</strong> Optuna по <code>hidden_units</code>/<code>learning_rate</code>; W&B-сравнение времён круга.</li>
      <li><strong>Этап 5 — Деплой + бонус-квантизация.</strong> ONNX → Sentis; <strong>квантизация Uint8</strong> для мобильной сборки (раздел 6).</li>
      <li><strong>Этап 6 — Геймплей.</strong> Игрок за рулём, спидометр, позиция в гонке, круги; билд под мобайл/WebGL.</li>
      <li><strong>Бонус.</strong> <strong>Curriculum Learning</strong> по сложности трассы (от прямой к серпантину).</li>
    </ul>

    <h3 id="proekt-td" className={`${H3_CLASS} scroll-mt-24`}>9.4 🗡️ Tower Defense (адаптивные атакующие)</h3>
    <ProseP>NPC-атакующие учатся находить оптимальный путь и адаптироваться к расстановке башен.</ProseP>
    <ul className="space-y-2 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li><strong>Этап 1 — Среда.</strong> Сетка с башнями и базой. Наблюдения: локальная карта угроз (лучи/grid-сенсор), своё здоровье, расстояние до базы. Действия — дискретные (направление движения).</li>
      <li><strong>Этап 2 — Награда.</strong> <code>+5</code> за достижение базы, dense за сокращение пути, штраф за урон от башен, <code>-</code>/шаг. Цель — обойти, а не «протаранить» оборону.</li>
      <li><strong>Этап 3 — Обучение.</strong> <code>trainer_type: ppo</code>; среда меняется (игрок переставляет башни) — обучаем робастности доменной рандомизацией.</li>
      <li><strong>Этап 4 — Оптимизация.</strong> Optuna по параметрам сети/награды; FCA-анализ: какие конфиги дают агентов, <strong>устойчивых к новым расстановкам</strong> (раздел 5).</li>
      <li><strong>Этап 5 — Деплой.</strong> ONNX → Sentis, одна модель на всех атакующих.</li>
      <li><strong>Этап 6 — Геймплей.</strong> Игрок строит и улучшает башни, волны врагов, HUD ресурсов/здоровья базы.</li>
      <li><strong>Бонус.</strong> <strong>Curriculum Learning</strong> по плотности башен: от пустой карты к насыщенной обороне.</li>
    </ul>

    <KeyPoints
      items={[
        <>Все четыре проекта используют <strong>один и тот же шестиэтапный каркас</strong> (разделы 2–8) — меняются только проектные решения.</>,
        <>Жанр диктует наблюдения, действия и структуру награды; алгоритм (PPO/SAC/POCA) — следствие этих решений.</>,
        <>Каждый раздел 9.x <strong>самодостаточен</strong> и при желании разворачивается в отдельный подурок 3.8.1–3.8.4.</>,
      ]}
    />
  </>
);

export default Section9;
