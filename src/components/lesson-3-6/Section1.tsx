import Math from "@/components/Math";
import CrossLinkToLesson from "@/components/CrossLinkToLesson";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints } from "./_shared";

const Section1 = () => (
  <>
    <h2 id="раздел-1-задача-hpo" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 1. Задача оптимизации гиперпараметров
    </h2>

    <ProseP>
      <strong>Гиперпараметр</strong> — это параметр, который вы задаёте <em>до</em> обучения и который
      не обновляется градиентом (в отличие от весов сети). Для нашего PPO это{" "}
      <code>learning_rate</code>, <code>beta</code>, <code>lambd</code> и так далее.
    </ProseP>

    <ProseP>
      Формально HPO — это задача поиска такого вектора гиперпараметров{" "}
      <Math display={false}>{String.raw`\boldsymbol{\enfPar{\lambda}}`}</Math> из пространства поиска{" "}
      <Math display={false}>{String.raw`\Lambda`}</Math>, который максимизирует целевую метрику
      качества:
    </ProseP>

    <Math>{String.raw`\boldsymbol{\enfPar{\lambda}}^{\star} = \arg\max_{\boldsymbol{\lambda} \in \Lambda} \; \enfFun{f}(\boldsymbol{\enfPar{\lambda}}),`}</Math>

    <ProseP>
      где <Math display={false}>{String.raw`\enfFun{f}(\boldsymbol{\enfPar{\lambda}})`}</Math> — итоговое качество
      агента, обученного с конфигурацией <Math display={false}>{String.raw`\boldsymbol{\enfPar{\lambda}}`}</Math>{" "}
      (например, средняя награда за последние эпизоды или ELO из{" "}
      <CrossLinkToLesson lessonId="3.2" lessonPath="/courses/3-2" lessonTitle="Урок 3.2" lessonLevel={3}>
        урока 3.2
      </CrossLinkToLesson>
      ).
    </ProseP>

    <ProseP>
      У этой функции <Math display={false}>{String.raw`f`}</Math> три неприятных свойства, которые и
      определяют выбор алгоритмов:
    </ProseP>

    <ol className="space-y-3 my-4 list-decimal list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>Чёрный ящик (black-box).</strong> У нас нет формулы{" "}
        <Math display={false}>{String.raw`f`}</Math> и нет её градиента по{" "}
        <Math display={false}>{String.raw`\boldsymbol{\enfPar{\lambda}}`}</Math>. Мы умеем только подставить
        конкретный <Math display={false}>{String.raw`\boldsymbol{\enfPar{\lambda}}`}</Math> и получить число
        — обучив агента целиком.
      </li>
      <li>
        <strong>Дорогая.</strong> Одно вычисление{" "}
        <Math display={false}>{String.raw`\enfFun{f}(\boldsymbol{\enfPar{\lambda}})`}</Math> — это полный (или почти
        полный) прогон обучения: минуты, часы, иногда дни. Бюджет измеряется не в секундах, а в
        числе <strong>испытаний</strong> (trials).
      </li>
      <li>
        <strong>Шумная (noisy).</strong> Из-за случайности (инициализация сети, сэмплирование
        действий, domain randomization из{" "}
        <CrossLinkToLesson lessonId="3.3" lessonPath="/courses/3-3" lessonTitle="Урок 3.3" lessonLevel={3}>
          урока 3.3
        </CrossLinkToLesson>
        ) повторный запуск с тем же{" "}
        <Math display={false}>{String.raw`\boldsymbol{\enfPar{\lambda}}`}</Math> даёт чуть разное{" "}
        <Math display={false}>{String.raw`f`}</Math>. Алгоритм поиска должен быть устойчив к этому
        шуму.
      </li>
    </ol>

    <ProseP>
      Именно потому что <Math display={false}>{String.raw`f`}</Math> — дорогой чёрный ящик, нам
      нужны <strong>выборочно-эффективные</strong> методы: те, что находят хорошую конфигурацию за
      минимальное число испытаний. На этом и строятся все стратегии ниже.
    </ProseP>

    <KeyPoints
      items={[
        <>
          HPO: <Math display={false}>{String.raw`\boldsymbol{\enfPar{\lambda}}^{\star} = \arg\max_{\boldsymbol{\lambda}} \enfFun{f}(\boldsymbol{\enfPar{\lambda}})`}</Math>
          , где <Math display={false}>{String.raw`f`}</Math> — качество обученного агента.
        </>,
        <>
          <Math display={false}>{String.raw`f`}</Math> — чёрный ящик: нет градиента, только
          «подставь и измерь».
        </>,
        <>
          <Math display={false}>{String.raw`f`}</Math> дорогая и шумная → бюджет считаем в числе
          испытаний, а не в секундах.
        </>,
        <>Цель — найти хорошую конфигурацию за как можно меньшее число trial-ов.</>,
      ]}
    />
  </>
);

export default Section1;
