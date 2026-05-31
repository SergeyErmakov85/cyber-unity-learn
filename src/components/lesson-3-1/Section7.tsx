import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints, Callout, Anchor } from "./_shared";

const Section7 = () => (
  <>
    <h2 className={SECTION_TITLE_CLASS}>
      Раздел 7. Автоматическая подстройка температуры <Math display={false}>{String.raw`\alpha`}</Math>
    </h2>

    <h3 className={H3_CLASS}>
      Почему фиксированный <Math display={false}>{String.raw`\alpha`}</Math> — это боль
    </h3>

    <ProseP>
      Как мы видели в{" "}
      <Anchor to="раздел-2-maximum-entropy-rl-objective">Разделе 2</Anchor>, оптимальный{" "}
      <Math display={false}>{String.raw`\alpha`}</Math> зависит от масштаба награды. Хуже того:
      «правильная» энтропия меняется <strong>по ходу обучения</strong>. В начале агент ничего не
      умеет — пусть исследует широко. Ближе к концу он уже знает хорошие действия — пусть будет почти
      детерминированным. Один фиксированный <Math display={false}>{String.raw`\alpha`}</Math> не может
      обслужить обе фазы, да ещё и разный для каждой задачи. Это была главная слабость первой версии
      SAC.
    </ProseP>

    <h3 className={H3_CLASS}>
      Идея: сделать энтропию ограничением, а{" "}
      <Math display={false}>{String.raw`\alpha`}</Math> — множителем Лагранжа
    </h3>

    <ProseP>
      Вторая статья (1812.05905) переформулирует задачу:{" "}
      <strong>
        максимизируй награду при условии, что средняя энтропия политики не ниже порога
      </strong>{" "}
      <Math display={false}>{String.raw`\bar{\mathcal{H}}`}</Math> (уравнение (11)):
    </ProseP>

    <Math>{String.raw`\max_{\pi_{0:T}}\; \mathbb{E}_{\rho_\pi}\!\left[\sum_{t=0}^{T} r(s_t,a_t)\right]
\quad\text{при условии}\quad
\mathbb{E}_{(s_t,a_t)\sim\rho_\pi}\big[-\log\pi_t(a_t\mid s_t)\big] \;\geq\; \bar{\mathcal{H}}\quad \forall t .`}</Math>

    <ProseP>
      Через двойственность (dual problem) и динамическое программирование по времени это даёт обычные
      обновления SAC <strong>плюс</strong> дополнительное обновление для двойственной переменной —
      которая и оказывается температурой <Math display={false}>{String.raw`\alpha`}</Math>.
      Температура обучается минимизацией (уравнение (18)):
    </ProseP>

    <Math>{String.raw`\boxed{\;
J(\alpha) = \mathbb{E}_{a_t\sim\pi_t}\big[\,-\alpha\log\pi_t(a_t\mid s_t) - \alpha\,\bar{\mathcal{H}}\,\big]
\;}`}</Math>

    <ProseP>Интуиция простая и красивая:</ProseP>

    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li>
        Если <strong>текущая энтропия ниже целевой</strong>{" "}
        <Math display={false}>{String.raw`\bar{\mathcal{H}}`}</Math> → градиент{" "}
        <strong>увеличивает</strong> <Math display={false}>{String.raw`\alpha`}</Math> → бонус за
        энтропию весомее → агент исследует больше.
      </li>
      <li>
        Если <strong>энтропия выше целевой</strong> → градиент{" "}
        <strong>уменьшает</strong> <Math display={false}>{String.raw`\alpha`}</Math> → агент позволяет
        себе быть детерминированнее.
      </li>
    </ul>

    <ProseP>
      Так <Math display={false}>{String.raw`\alpha`}</Math> автоматически «дышит» по ходу обучения и
      подстраивается под каждую задачу. Полный вывод двойственной задачи (уравнения (11)–(18)) — в{" "}
      <CrossLinkToHub
        hubPath="/algorithms/sac"
        hubAnchor="entropy"
        hubTitle="SAC → Двойственная задача и температура"
      >
        хабе по максэнтропийному RL
      </CrossLinkToHub>
      .
    </ProseP>

    <h3 className={H3_CLASS}>
      Целевая энтропия <Math display={false}>{String.raw`\bar{\mathcal{H}}`}</Math>: эвристика
    </h3>

    <ProseP>
      Остаётся задать порог <Math display={false}>{String.raw`\bar{\mathcal{H}}`}</Math>. Стандартная
      эвристика из статьи — взять его равным{" "}
      <strong>минус размерности пространства действий</strong>:
    </ProseP>

    <Math>{String.raw`\bar{\mathcal{H}} = -\dim(\mathcal{A}).`}</Math>

    <ProseP>
      Для гоночного агента с двумя непрерывными действиями (руль, газ) это{" "}
      <Math display={false}>{String.raw`\bar{\mathcal{H}}=-2`}</Math>. Эвристика грубая, но работает
      на удивление широко и почти полностью снимает ручную настройку температуры.
    </ProseP>

    <Callout title="Связь с Unity ML-Agents" color="cyan">
      <p>
        В ML-Agents автоподстройка <Math display={false}>{String.raw`\alpha`}</Math> включена по
        умолчанию (это и есть «энтропийный коэффициент»). Поле{" "}
        <code className="px-1 rounded bg-muted/50 text-xs font-mono">init_entcoef</code> задаёт лишь{" "}
        <strong>стартовое</strong> значение этого коэффициента; дальше он автоматически тянется к
        целевой энтропии. Подробнее — в{" "}
        <Anchor to="раздел-12-sac-в-unity-ml-agents">Разделе 12</Anchor>.
      </p>
    </Callout>

    <KeyPoints
      items={[
        <>
          Фиксированный <Math display={false}>{String.raw`\alpha`}</Math> хрупок: зависит от масштаба
          награды и фазы обучения.
        </>,
        <>
          Переформулируем как «макс. награда при ограничении на энтропию{" "}
          <Math display={false}>{String.raw`\geq\bar{\mathcal{H}}`}</Math>».
        </>,
        <>
          <Math display={false}>{String.raw`\alpha`}</Math> = двойственная переменная, обучается по{" "}
          <Math display={false}>
            {String.raw`J(\alpha)=\mathbb{E}[-\alpha\log\pi-\alpha\bar{\mathcal{H}}]`}
          </Math>
          .
        </>,
        <>
          Эвристика порога:{" "}
          <Math display={false}>{String.raw`\bar{\mathcal{H}}=-\dim(\mathcal{A})`}</Math>.
        </>,
        <>
          Низкая энтропия → <Math display={false}>{String.raw`\alpha`}</Math> растёт; высокая →{" "}
          <Math display={false}>{String.raw`\alpha`}</Math> падает.
        </>,
      ]}
    />
  </>
);

export default Section7;
