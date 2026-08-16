import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints } from "./_shared";

const Section2 = () => (
  <>
    <h2 id="razdel-2-uchebnyy-plan-formalno" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 2. Учебный план формально: уроки, мера прогресса, порог
    </h2>

    <ProseP>
      Опишем учебный план аккуратно. Пусть среда параметризована <strong>контекстом</strong>{" "}
      <Math display={false}>{String.raw`c`}</Math> (у нас <Math display={false}>{String.raw`c`}</Math> —
      сложность трассы <Math display={false}>{String.raw`\enfPar{\lambda}`}</Math> и всё, что от неё зависит).
      Каждый урок задаёт значение контекста (или распределение значений). Тогда учебный план — это{" "}
      <strong>последовательность распределений задач</strong>
    </ProseP>

    <Math>{String.raw`\mathcal{D}_0,\; \mathcal{D}_1,\; \dots,\; \mathcal{D}_K = \mathcal{D}^{\star},`}</Math>

    <ProseP>
      которая ведёт от лёгкого старта <Math display={false}>{String.raw`\mathcal{D}_0`}</Math> к целевому
      распределению <Math display={false}>{String.raw`\mathcal{D}^\star`}</Math>, на котором мы и хотим
      хорошей политики. Внутри урока <Math display={false}>{String.raw`k`}</Math> агент обучается
      максимизировать ожидаемую отдачу при{" "}
      <Math display={false}>{String.raw`c \sim \mathcal{D}_k`}</Math> (отдачу и дисконт{" "}
      <Math display={false}>{String.raw`\enfPar{\gamma}`}</Math> см. хаб{" "}
      <CrossLinkToHub
        hubPath="/math-rl/module-1"
        hubAnchor="discounting"
        hubTitle="Математика → Дисконтирование"
      >
        Дисконтирование ↗
      </CrossLinkToHub>
      ).
    </ProseP>

    <ProseP>
      <strong>Когда переходить к следующему уроку?</strong> Нужен (1) измеримый сигнал прогресса и (2)
      порог. На практике мера прогресса — это сглаженная средняя награда или <strong>доля выполнения</strong>{" "}
      (progress), а переход происходит, когда сглаженный сигнал держится выше порога{" "}
      <Math display={false}>{String.raw`\tau`}</Math> в течение минимального числа эпизодов:
    </ProseP>

    <Math>{String.raw`\text{если}\quad \overline{m}_k \;\geq\; \tau_k \quad\text{на протяжении}\ \ge \enfTgt{L}_{\min}\ \text{эпизодов} \;\Rightarrow\; \text{перейти к уроку } k{+}1.`}</Math>

    <ProseP>
      Здесь <Math display={false}>{String.raw`\overline{m}_k`}</Math> — сглаженная мера
      (награда/прогресс), <Math display={false}>{String.raw`\tau_k`}</Math> — порог урока,{" "}
      <Math display={false}>{String.raw`\enfTgt{L}_{\min}`}</Math> — минимальная длина урока. Сглаживание нужно,
      чтобы случайный удачный заезд не «протолкнул» агента дальше раньше времени. Это ровно те поля,
      которые мы увидим в YAML ML-Agents (раздел 7): <code className="px-1 rounded bg-muted/50 text-xs font-mono">measure</code>,{" "}
      <code className="px-1 rounded bg-muted/50 text-xs font-mono">threshold</code>,{" "}
      <code className="px-1 rounded bg-muted/50 text-xs font-mono">min_lesson_length</code>,{" "}
      <code className="px-1 rounded bg-muted/50 text-xs font-mono">signal_smoothing</code>.
    </ProseP>

    <ProseP>
      <strong>Две типичные ошибки конструктора плана:</strong>
    </ProseP>
    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Слишком крутой план</strong> (резкий скачок{" "}
          <Math display={false}>{String.raw`\mathcal{D}_k \to \mathcal{D}_{k+1}`}</Math>): агент не
          справляется с новым уроком, награда обваливается, политика деградирует. Симптом — провал
          кривой награды сразу после переключения урока.
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>Слишком пологий план</strong> (избыточно лёгкие уроки): обучение есть, но мы жжём
          вычисления там, где агент уже всё умеет.
        </span>
      </li>
    </ul>

    <ProseP>
      <strong>Третья, более тонкая беда — катастрофическое забывание.</strong> Перейдя на трудные узкие
      трассы (L2–L3), агент может «забыть», как уверенно ехать по простым: распределение данных
      сместилось, и градиенты переписали навыки, которые на новом уроке не подкрепляются. С точки
      зрения агента учебный план — это <strong>нестационарная</strong> задача (распределение задач
      меняется во времени), а с нестационарностью мы уже сталкивались в{" "}
      <CrossLinkToHub
        hubPath="/courses/3-2"
        hubAnchor="nonstationarity"
        hubTitle="Урок 3.2 — нестационарность"
      >
        уроке 3.2
      </CrossLinkToHub>
      , только там её источником был меняющийся соперник. Лекарство от забывания — не выкидывать старые
      уроки полностью, а <strong>подмешивать</strong> их (или оставлять немного случайности на каждом
      уровне). Это естественный мост к рандомизации (раздел 4).
    </ProseP>

    <KeyPoints
      items={[
        <>
          Учебный план — это последовательность распределений задач{" "}
          <Math display={false}>{String.raw`\mathcal{D}_0 \to \dots \to \mathcal{D}^\star`}</Math>.
        </>,
        <>
          Переход управляется <strong>мерой прогресса</strong> (награда/доля выполнения),{" "}
          <strong>порогом</strong> и <strong>минимальной длиной урока</strong>; сглаживание гасит
          случайные выбросы.
        </>,
        <>
          Опасности: слишком крутой план (обвал награды), слишком пологий (трата вычислений),{" "}
          <strong>катастрофическое забывание</strong> простых навыков.
        </>,
        <>
          Учебный план делает задачу <strong>нестационарной</strong> — та же природа, что у меняющегося
          соперника в{" "}
          <CrossLinkToHub
            hubPath="/courses/3-2"
            hubAnchor="nonstationarity"
            hubTitle="Урок 3.2 — нестационарность"
          >
            self-play
          </CrossLinkToHub>
          .
        </>,
      ]}
    />
  </>
);

export default Section2;
