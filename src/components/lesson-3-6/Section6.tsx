import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, InteractiveStub } from "./_shared";

const Section6 = () => (
  <>
    <h2 id="раздел-6-tpe" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 6. TPE — сэмплер Optuna по умолчанию
    </h2>

    <ProseP>
      <strong>Tree-structured Parzen Estimator (TPE)</strong> — байесовский метод, который обходит
      дороговизну GP хитрым трюком. Вместо того чтобы моделировать{" "}
      <Math display={false}>{String.raw`p(\enfTgt{y} \mid \boldsymbol{\enfPar{\lambda}})`}</Math> (качество по
      конфигурации), TPE моделирует <strong>обратное</strong> —{" "}
      <Math display={false}>{String.raw`p(\boldsymbol{\enfPar{\lambda}} \mid \enfTgt{y})`}</Math> — двумя плотностями.
    </ProseP>

    <ProseP>
      Сначала выбираем порог <Math display={false}>{String.raw`\enfTgt{y}^{\star}`}</Math> — квантиль уже
      наблюдённых результатов: доля <Math display={false}>{String.raw`\enfPar{\gamma}`}</Math> лучших
      испытаний идёт в «хорошие», остальные — в «плохие» (в Optuna{" "}
      <Math display={false}>{String.raw`\enfPar{\gamma}`}</Math> невелика — порядка{" "}
      <Math display={false}>{String.raw`0.1`}</Math>). Затем по двум подвыборкам строим две
      плотности методом ядерного сглаживания (Parzen / KDE):
    </ProseP>

    <Math>{String.raw`p(\boldsymbol{\enfPar{\lambda}} \mid \enfTgt{y}) =
\begin{cases}
\enfFun{\ell}(\boldsymbol{\enfPar{\lambda}}), & \enfTgt{y} < \enfTgt{y}^{\star} \quad (\text{«хорошие» конфигурации}),\\[4pt]
\enfFun{g}(\boldsymbol{\enfPar{\lambda}}), & \enfTgt{y} \geq \enfTgt{y}^{\star} \quad (\text{«плохие» конфигурации}),
\end{cases}
\qquad \enfPar{\gamma} = p(\enfTgt{y} < \enfTgt{y}^{\star}).`}</Math>

    <ProseP>
      Здесь <Math display={false}>{String.raw`\enfFun{\ell}(\boldsymbol{\enfPar{\lambda}})`}</Math> — «где живут
      хорошие конфигурации», <Math display={false}>{String.raw`\enfFun{g}(\boldsymbol{\enfPar{\lambda}})`}</Math> —
      «где живут плохие». Bergstra et al. (2011) доказали ключевой факт: ожидаемое улучшение для
      такой модели <strong>монотонно</strong> связано с отношением плотностей. А именно:
    </ProseP>

    <Math>{String.raw`\boxed{\;\mathrm{EI}(\boldsymbol{\enfPar{\lambda}}) \;\propto\; \left(\enfPar{\gamma} + \frac{\enfFun{g}(\boldsymbol{\enfPar{\lambda}})}{\enfFun{\ell}(\boldsymbol{\enfPar{\lambda}})}\,(1-\enfPar{\gamma})\right)^{-1}\;}`}</Math>

    <ProseP>
      Максимизировать EI — то же самое, что максимизировать отношение{" "}
      <Math display={false}>{String.raw`\enfFun{\ell}(\boldsymbol{\enfPar{\lambda}})/\enfFun{g}(\boldsymbol{\enfPar{\lambda}})`}</Math>.
      Интуиция кристально проста:{" "}
      <strong>ищи конфигурации, которые вероятны среди хороших и маловероятны среди плохих.</strong>{" "}
      На каждом шаге TPE сэмплирует пачку кандидатов из{" "}
      <Math display={false}>{String.raw`\enfFun{\ell}`}</Math> и берёт того, у кого отношение{" "}
      <Math display={false}>{String.raw`\enfFun{\ell}/\enfFun{g}`}</Math> максимально.
    </ProseP>

    <ProseP>Почему TPE — выбор по умолчанию в Optuna:</ProseP>

    <ul className="space-y-2 my-4 list-disc list-inside text-[15px] text-foreground/90 leading-relaxed">
      <li>
        <strong>Дёшево.</strong> Сложность <strong>линейна</strong> по числу наблюдений, а не
        кубична, как у GP.
      </li>
      <li>
        <strong>Условные и категориальные оси</strong> обрабатываются естественно (отсюда
        «tree-structured»).
      </li>
      <li>
        <strong>Параллелится</strong> без боли, в отличие от строго последовательного GP-BO.
      </li>
    </ul>

    <ProseP>
      Строгий вывод связи EI и <Math display={false}>{String.raw`\enfFun{\ell}/\enfFun{g}`}</Math> (через теорему
      Байеса) вынесен в хаб:{" "}
      <CrossLinkToHub
        hubPath="/math-rl/module-3"
        hubAnchor="tpe-вывод-ei"
        hubTitle="Хаб: теорвер и информация — TPE"
      >
        ↗ теорвер и информация
      </CrossLinkToHub>
      . В уроке нам достаточно итоговой формулы и её смысла.
    </ProseP>

    <InteractiveStub title="TPE на 1D-задаче">
      JSX-демо TPE на 1D-задаче: пользователь слайдером добавляет «наблюдения», на лету
      перестраиваются плотности <Math display={false}>{String.raw`\enfFun{\ell}`}</Math> и{" "}
      <Math display={false}>{String.raw`g`}</Math> и кривая{" "}
      <Math display={false}>{String.raw`\enfFun{\ell}/\enfFun{g}`}</Math>; следующая предложенная точка — максимум
      отношения. Слайдер <Math display={false}>{String.raw`\enfPar{\gamma}`}</Math> показывает, как меняется
      порог «хороших». Анимация — через <code>useRef</code> для значений в кадре, без{" "}
      <code>ctx.roundRect</code>.
    </InteractiveStub>

    <KeyPoints
      items={[
        <>
          TPE моделирует <Math display={false}>{String.raw`p(\boldsymbol{\enfPar{\lambda}}\mid \enfTgt{y})`}</Math>{" "}
          двумя плотностями: <Math display={false}>{String.raw`\enfFun{\ell}`}</Math> («хорошие») и{" "}
          <Math display={false}>{String.raw`g`}</Math> («плохие»), порог —{" "}
          <Math display={false}>{String.raw`\enfPar{\gamma}`}</Math>-квантиль.
        </>,
        <>
          <Math display={false}>{String.raw`\mathrm{EI}(\boldsymbol{\enfPar{\lambda}}) \propto \big(\enfPar{\gamma} + \tfrac{\enfFun{g}}{\enfFun{\ell}}(1-\enfPar{\gamma})\big)^{-1}`}</Math>
          {" "}→ максимизация EI = максимизация{" "}
          <Math display={false}>{String.raw`\enfFun{\ell}/\enfFun{g}`}</Math>.
        </>,
        <>Правило: бери конфигурацию, вероятную среди хороших и редкую среди плохих.</>,
        <>TPE линеен по числу наблюдений, дружит с категориальными/условными осями, легко параллелится — отсюда дефолт в Optuna.</>,
      ]}
    />
  </>
);

export default Section6;
