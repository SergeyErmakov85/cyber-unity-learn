import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, InteractiveStub } from "./_shared";

const Section1 = () => (
  <>
    <h2 id="razdel-1-trudnaya-zadacha" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 1. Почему «в лоб» не учится: проблема трудной задачи
    </h2>

    <ProseP>
      Вернёмся к провалу №2. Гонщик на трудной трассе почти никогда не финиширует, поэтому почти
      никогда не видит положительной награды. С точки зрения градиента политики (
      <CrossLinkToHub hubPath="/courses/3-1" hubAnchor="ppo" hubTitle="Урок 3.1 — PPO">
        урок 3.1
      </CrossLinkToHub>
      , хаб{" "}
      <CrossLinkToHub
        hubPath="/math-rl/module-4"
        hubAnchor="policy-gradient"
        hubTitle="Математика → Градиент политики"
      >
        Градиент политики ↗
      </CrossLinkToHub>
      ) это означает: оценка градиента почти всегда нулевая или чисто шумовая. Учиться не на чем.
    </ProseP>

    <ProseP>
      Интуиция, как это чинить, древнее самого RL. Людей и животных не учат сразу сложному: сначала
      простые примеры, потом всё более сложные. В дрессировке это называют <strong>shaping</strong>{" "}
      (Скиннер, 1958), в когнитивистике — принципом «<strong>start small</strong>» (Элман, 1993). В
      машинное обучение это перенесли <strong>Bengio и др. (2009)</strong> под названием{" "}
      <strong>curriculum learning</strong>: примеры подаются не случайно, а в осмысленном порядке,
      раскрывающем «постепенно больше понятий и всё более сложные».
    </ProseP>

    <ProseP>
      Ключевая формализация Bengio: учебный план — это частный случай <strong>метода продолжения</strong>{" "}
      (continuation method) из невыпуклой оптимизации. Идея метода продолжения: начать с{" "}
      <strong>сглаженной</strong>, легко оптимизируемой версии целевой функции и постепенно деформировать
      её в исходную — трудную, невыпуклую. Введём параметр-«ручку»{" "}
      <Math display={false}>{String.raw`\enfPar{\lambda} \in [0,1]`}</Math> и семейство целей{" "}
      <Math display={false}>{String.raw`\mathcal{\enfTgt{L}}_\lambda`}</Math>:
    </ProseP>

    <Math>{String.raw`\mathcal{\enfTgt{L}}_0 \;\xrightarrow[\text{постепенно}]{\;\enfPar{\lambda}:\,0\to 1\;}\; \mathcal{\enfTgt{L}}_1 = \mathcal{\enfTgt{L}}^{\star},`}</Math>

    <ProseP>
      где <Math display={false}>{String.raw`\mathcal{\enfTgt{L}}_0`}</Math> — гладкая и простая (наша широкая
      прямая трасса), а <Math display={false}>{String.raw`\mathcal{\enfTgt{L}}_1=\mathcal{\enfTgt{L}}^\star`}</Math> —
      настоящая трудная задача (узкая трасса с соперниками). Двигаясь по{" "}
      <Math display={false}>{String.raw`\enfPar{\lambda}`}</Math> от 0 к 1, мы ведём оптимизатор по «хребту»
      хороших решений, не давая ему застрять в плохом локальном минимуме на старте.
    </ProseP>

    <ProseP>Bengio формулирует два эффекта учебного плана:</ProseP>
    <ul className="space-y-2 my-4 text-[15px] text-foreground/90 leading-relaxed">
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>на скорость сходимости</strong> — даже для выпуклых задач удачный порядок ускоряет
          обучение;
        </span>
      </li>
      <li className="flex gap-2.5">
        <span className="text-cyan-400 mt-0.5 shrink-0">▸</span>
        <span>
          <strong>на качество локального минимума</strong> — для невыпуклых задач (а нейросеть-политика
          — именно такая) порядок и отбор примеров влияют не только на скорость, но и на то,{" "}
          <em>куда</em> мы в итоге придём.
        </span>
      </li>
    </ul>

    <ProseP>
      Для нашего гонщика «ручка» <Math display={false}>{String.raw`\enfPar{\lambda}`}</Math> — это сложность
      трассы. Разобьём её на дискретные <strong>уроки</strong> (lessons):
    </ProseP>

    <div className="my-6 overflow-x-auto rounded-xl border border-cyan-500/15 bg-card/40 backdrop-blur-sm">
      <table className="w-full min-w-[640px] text-[14px] text-foreground/90">
        <thead>
          <tr className="border-b border-cyan-500/20 bg-cyan-500/5">
            <th className="text-left py-3 px-4 font-semibold text-cyan-400">Урок</th>
            <th className="text-left py-3 px-4 font-semibold text-cyan-400">
              <Math display={false}>{String.raw`\enfPar{\lambda}`}</Math>
            </th>
            <th className="text-left py-3 px-4 font-semibold text-cyan-400">Что меняется</th>
            <th className="text-left py-3 px-4 font-semibold text-cyan-400">Что осваивает агент</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">L0</td>
            <td className="py-3 px-4">0.0</td>
            <td className="py-3 px-4">Широкая прямая трасса, нет соперников</td>
            <td className="py-3 px-4">Газ/тормоз, удержание на полотне</td>
          </tr>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">L1</td>
            <td className="py-3 px-4">1.0</td>
            <td className="py-3 px-4">Плавные повороты</td>
            <td className="py-3 px-4">Поворот руля, торможение перед дугой</td>
          </tr>
          <tr className="border-b border-border/20 align-top">
            <td className="py-3 px-4">L2</td>
            <td className="py-3 px-4">2.0–3.0</td>
            <td className="py-3 px-4">Узкая трасса, резкие повороты</td>
            <td className="py-3 px-4">Точные траектории, апексы</td>
          </tr>
          <tr className="align-top">
            <td className="py-3 px-4">L3</td>
            <td className="py-3 px-4">4.0</td>
            <td className="py-3 px-4">Препятствия + соперники + мокрый асфальт</td>
            <td className="py-3 px-4">Объезд, обгон, контроль сноса</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ProseP>
      На L0 агент финиширует уже через минуты — и сразу получает плотный сигнал. К моменту L3 он
      подходит не «с нуля», а уже умея ехать: трудная задача перестаёт быть нерешаемой.
    </ProseP>

    <InteractiveStub title="Интерактив (рекомендация): «Лестница сложности»">
      Вертикальная шкала навыка агента и шкала порога; слайдер «текущий навык» и слайдер «порог
      перехода» (threshold). Когда сглаженный навык превышает порог — урок переключается (L0→L1→…), и
      видно, как слишком высокий порог «застревает», а слишком низкий перебрасывает на трудный урок
      раньше времени. Реализация — интерактивный JSX-компонент (слайдеры + анимация переключения
      уроков).
    </InteractiveStub>

    <KeyPoints
      items={[
        <>
          Трудная задача «в лоб» не учится, потому что награда <strong>разрежена</strong> → градиент
          политики почти всегда нулевой/шумовой.
        </>,
        <>
          <strong>Curriculum learning</strong> (Bengio и др., 2009): подавать задачи в порядке от
          простого к сложному; корни — в <em>shaping</em> и принципе <em>start small</em>.
        </>,
        <>
          Формально учебный план — это <strong>метод продолжения</strong>: гладкую цель{" "}
          <Math display={false}>{String.raw`\mathcal{\enfTgt{L}}_0`}</Math> постепенно деформируем в трудную{" "}
          <Math display={false}>{String.raw`\mathcal{\enfTgt{L}}^\star`}</Math> по «ручке»{" "}
          <Math display={false}>{String.raw`\enfPar{\lambda}:0\to 1`}</Math>.
        </>,
        <>
          Эффект двойной: ускоряет сходимость <strong>и</strong> улучшает качество локального минимума
          у невыпуклых целей.
        </>,
      ]}
    />
  </>
);

export default Section1;
