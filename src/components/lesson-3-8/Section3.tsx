import Math from "@/components/Math";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints, Callout } from "./_shared";

const CODE = `# Псевдокод функции награды для арена-шутера
shaped   = +0.001 * (prevDist - curDist)   // приблизился к врагу (мелкий dense-член)
hit      = +1.0   if попал по врагу
win      = +5.0   if враг повержен          // крупный терминальный бонус
penalty  = -0.5   if получил урон
timestep = -0.0005                          // штраф за каждый шаг (стимул заканчивать быстрее)
reward   = shaped + hit + win + penalty + timestep`;

const Section3 = () => (
  <>
    <h2 id="etap-2-nagrada" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 3. Этап 2 — Функция награды
    </h2>

    <ProseP>
      Награда — <strong>самый недооценённый и самый опасный</strong> этап. Агент оптимизирует ровно то, что вы написали, а не то, что вы имели в виду. Формально он максимизирует ожидаемую дисконтированную сумму (дисконтирование ↗{" "}
      <CrossLinkToHub hubPath="/math-rl/module-1" hubTitle="Math RL — Модуль 1">хаб math-rl, модуль 1</CrossLinkToHub>):
    </ProseP>

    <Math>{String.raw`J(\pi) = \mathbb{E}_{\pi}\!\left[\sum_{t=0}^{\infty} \gamma^t\, r_t\right].`}</Math>

    <h3 className={H3_CLASS}>Dense vs sparse</h3>
    <ul className="space-y-2 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li><strong>Sparse reward</strong> (награда только за финальную победу) честна, но обучается мучительно долго: сигнал слишком редкий.</li>
      <li><strong>Dense reward</strong> (маленькое поощрение за каждый шаг к цели) обучается быстро, но рискует породить нежелательное поведение.</li>
    </ul>
    <ProseP>
      Компромисс — <strong>reward shaping</strong>: добавляем плотный направляющий член, не меняющий оптимальную политику. Безопасная форма — <strong>потенциальное шейпинг</strong> (potential-based), где добавка строится из разности потенциалов состояний:
    </ProseP>

    <Math>{String.raw`r'_t = r_t + \big(\gamma\,\Phi(s_{t+1}) - \Phi(s_t)\big).`}</Math>

    <ProseP>
      Здесь <Math display={false}>{String.raw`\Phi(s)`}</Math> — например, «близость к цели». Такой член гарантированно <strong>не сдвигает</strong> оптимум, в отличие от произвольной добавки.
    </ProseP>

    <h3 className={H3_CLASS}>Анти-паттерн: reward hacking</h3>
    <ProseP>
      Классическая ловушка — наградить за «дистанцию к цели» так, что агент находит способ накручивать показатель, не выполняя задачу (бесконечно крутится у цели, не касаясь её). Правило: <strong>награждайте за достигнутые состояния, а не за процесс</strong>, а dense-член держите малым относительно терминального бонуса.
    </ProseP>

    <CyberCodeBlock language="text" filename="reward_pseudo.txt">{CODE}</CyberCodeBlock>

    <ProseP>
      Все интенсивные сигналы (любопытство, имитация) в ML-Agents задаются через секцию <code>reward_signals</code> (см. этап 3). Базовый — <code>extrinsic</code> (награда из среды) с параметрами <code>strength</code> и <code>gamma</code>.
    </ProseP>

    <Callout title="Связь" color="purple">
      Контрфактический бейзлайн MA-POCA (
      <CrossLinkToLesson lessonId="3.2" lessonPath="/courses/3-2" lessonTitle="Урок 3.2" lessonLevel={3}>урок 3.2</CrossLinkToLesson>) — это про <strong>распределение</strong> командной награды между агентами, а не про её дизайн; здесь мы проектируем сам сигнал.
    </Callout>

    <KeyPoints
      items={[
        <>Агент максимизирует <strong>написанную</strong> награду — формулируйте её как ваше истинное намерение.</>,
        <><strong>Sparse</strong> честна, но медленна; <strong>dense</strong> быстра, но опасна; компромисс — <strong>потенциальное шейпинг</strong>, не меняющее оптимум.</>,
        <>Защищайтесь от <strong>reward hacking</strong>: крупный терминальный бонус + маленький dense-член + штраф за время.</>,
        <>Интенсивные сигналы подключаются через <code>reward_signals</code>; базовый — <code>extrinsic</code>.</>,
      ]}
    />
  </>
);

export default Section3;
