import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints } from "./_shared";

const Section0 = () => (
  <>
    <h2 className={SECTION_TITLE_CLASS}>
      Раздел 0. От гоночного агента к SAC: зачем нужен ещё один алгоритм
    </h2>

    <ProseP>
      В{" "}
      <CrossLinkToHub
        hubPath="/courses/project-3"
        hubTitle="Проект 3 — Гоночный агент (PPO)"
      >
        уроке про гоночного агента
      </CrossLinkToHub>{" "}
      мы обучали политику алгоритмом <strong>PPO</strong>. PPO надёжен, прост в настройке и прощает
      ошибки — поэтому он стоит по умолчанию в Unity ML-Agents. Но у него есть фундаментальная цена:
      PPO <strong className="text-secondary">on-policy</strong>. Это значит, что каждый батч опыта
      собирается <em>текущей</em> политикой, используется для одного-двух шагов градиента и{" "}
      <strong>выбрасывается</strong>. Чтобы обучить сложного агента, приходится прогонять миллионы
      шагов симуляции.
    </ProseP>

    <ProseP>
      Представьте, что ваш гоночный агент за час симуляции проехал 10 000 кругов. PPO посмотрит на
      каждый круг буквально несколько раз и забудет его навсегда. Это расточительно — особенно если
      шаг симуляции дорогой (сложная физика, рендеринг, реальный робот).
    </ProseP>

    <ProseP>
      <strong className="text-primary">SAC (Soft Actor-Critic)</strong> решает обе главные боли deep
      RL сразу:
    </ProseP>

    <ol className="space-y-3 my-4 list-decimal list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>Экономия данных (sample efficiency).</strong> SAC{" "}
        <strong className="text-primary">off-policy</strong>: весь прошлый опыт складывается в{" "}
        <em>replay buffer</em> и переиспользуется много раз. Тот же агент учится за заметно меньшее
        число шагов среды.
      </li>
      <li>
        <strong>Стабильность и устойчивость к гиперпараметрам.</strong> SAC максимизирует не только
        награду, но и <strong className="text-primary">энтропию</strong> политики. Агент стремится
        быть <em>максимально случайным при сохранении высокой награды</em>. Это даёт богатое
        исследование, устойчивость к ошибкам модели и гораздо более воспроизводимое обучение между
        запусками.
      </li>
    </ol>

    <ProseP>
      SAC — это <strong>state-of-the-art off-policy алгоритм для непрерывных действий</strong>{" "}
      (рулёжка, газ, тормоз, моменты в суставах). Он был предложен Haarnoja и соавторами в 2018 году
      в двух статьях: основной (arXiv:1801.01290) и расширенной (arXiv:1812.05905), где добавлена
      автоподстройка температуры.
    </ProseP>

    <KeyPoints
      items={[
        <>
          PPO <em>on-policy</em> → данные одноразовые → дорого по шагам среды.
        </>,
        <>
          SAC <em>off-policy</em> → replay buffer → переиспользование опыта → экономия данных.
        </>,
        <>
          SAC оптимизирует <strong>награду + энтропию</strong> → лучше исследует, стабильнее
          обучается.
        </>,
        <>
          Ниша SAC — <strong>непрерывное управление</strong>.
        </>,
      ]}
    />
  </>
);

export default Section0;
