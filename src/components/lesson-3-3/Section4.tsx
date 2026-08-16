import Math from "@/components/Math";
import CrossLinkToHub from "@/components/CrossLinkToHub";
import { SECTION_TITLE_CLASS, ProseP, KeyPoints, InteractiveStub } from "./_shared";

const Section4 = () => (
  <>
    <h2 id="razdel-4-randomizatsiya" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 4. Рандомизация среды: лекарство от переобучения и от разрыва реальности
    </h2>

    <ProseP>
      Теперь — провал №1. Почему агент, освоивший одну трассу, не едет по новой? Потому что в RL{" "}
      <strong>переобучение</strong> особенно опасно: по умолчанию мы и обучаем, и тестируем агента на
      одной и той же среде, и потому даже не замечаем, что он выучил частности, а не суть.
    </ProseP>

    <ProseP>
      Это эмпирически показали <strong>Cobbe и др. (2019)</strong> на среде <strong>CoinRun</strong>, а
      затем на бенчмарке <strong>Procgen</strong> (Cobbe и др., 2020): если строить{" "}
      <strong>отдельные</strong> наборы уровней для обучения и для теста (процедурная генерация это
      позволяет), оказывается, что агенты сильно переобучаются под обучающие уровни. Чтобы закрыть{" "}
      <strong>разрыв обобщения</strong> (generalization gap) на Procgen, агенту нужны тысячи уровней
      (порядка <Math display={false}>{String.raw`10^4`}</Math>); лучше всего агент обобщает, когда{" "}
      <strong>каждый эпизод — новый уровень</strong>.
    </ProseP>

    <ProseP>
      Формализуем через <strong>контекстный MDP</strong> (contextual MDP). Обычный MDP фиксирован;
      контекстный — это семейство
    </ProseP>

    <Math>{String.raw`\mathcal{M}_c = (\mathcal{S}, \mathcal{A}, P_c, \enfTgt{R}_c, \enfPar{\gamma}), \qquad c \sim p(c),`}</Math>

    <ProseP>
      где контекст <Math display={false}>{String.raw`c`}</Math> задаёт конкретную реализацию мира
      (геометрию трассы, сцепление, освещение). Ошибка — оптимизировать политику под один контекст{" "}
      <Math display={false}>{String.raw`c_0`}</Math>:
    </ProseP>

    <Math>{String.raw`\max_{\pi}\; \enfTgt{J}_{c_0}(\pi).`}</Math>

    <ProseP>
      Правильная цель — ожидаемая отдача <strong>по распределению контекстов</strong>:
    </ProseP>

    <Math>{String.raw`\boxed{\;\max_{\pi}\; \mathbb{E}_{c \sim p(c)}\big[\, \enfTgt{J}_c(\pi) \,\big],\qquad \enfTgt{J}_c(\pi)=\mathbb{E}_{\pi}\!\Big[\textstyle\sum_{t\ge 0}\enfPar{\gamma}^t \enfTgt{r}_t \,\big|\, c\Big].\;}`}</Math>

    <ProseP>
      А разрыв обобщения — это разница между качеством на «виденных» и «отложенных» контекстах:
    </ProseP>

    <Math>{String.raw`\mathrm{Gap}(\pi) \;=\; \underbrace{\mathbb{E}_{c\sim p_{\text{train}}}[\enfTgt{J}_c(\pi)]}_{\text{обучение}} \;-\; \underbrace{\mathbb{E}_{c\sim p_{\text{test}}}[\enfTgt{J}_c(\pi)]}_{\text{отложенные контексты}}.`}</Math>

    <ProseP>
      <strong>Рандомизация среды</strong> = обучать на распределении{" "}
      <Math display={false}>{String.raw`p(c)`}</Math>, а не на одной точке. Для гонщика рандомизируем:
      коэффициент сцепления покрытия, уровень освещённости/время суток, стиль соперников, шум датчиков,
      массу и мощность машины, раскладку трассы. Тогда агент вынужден выучить инварианты («перед
      поворотом тормозить»), а не подгонку под одну дорожку. Базу для{" "}
      <Math display={false}>{String.raw`|\hat A_t|`}</Math> и преимущества см. в хабе{" "}
      <CrossLinkToHub hubPath="/algorithms/ppo" hubTitle="Алгоритмы → PPO">
        PPO ↗
      </CrossLinkToHub>{" "}
      и в{" "}
      <CrossLinkToHub hubPath="/courses/3-1" hubAnchor="ppo" hubTitle="Урок 3.1 — PPO">
        уроке 3.1
      </CrossLinkToHub>
      ; формальную глубину про обобщение/контекстный MDP — в хабе{" "}
      <CrossLinkToHub
        hubPath="/deep-rl"
        hubAnchor="generalization"
        hubTitle="Deep RL → Обобщение (TODO-якорь)"
      >
        Глубокий RL ↗
      </CrossLinkToHub>
      .
    </ProseP>

    <ProseP>У рандомизации две <strong>разные</strong> мотивации — важно их не путать:</ProseP>
    <ol className="space-y-3 my-4 text-[15px] text-foreground/90 leading-relaxed list-decimal pl-5">
      <li>
        <strong>Обобщение / борьба с переобучением</strong> (Cobbe и др.) — чтобы политика работала на
        новых конфигурациях <em>того же</em> типа.
      </li>
      <li>
        <strong>Разрыв реальности / sim-to-real</strong> (Tobin и др., 2017,{" "}
        <strong>domain randomization</strong>) — чтобы политика, обученная только в симуляторе,
        заработала на реальном железе. Идея Tobin'а почти дерзкая: рандомизировать рендеринг (текстуры,
        освещение, положение камеры, шум) в <strong>нереалистичных</strong> масштабах, чтобы реальный
        мир стал для модели «просто ещё одной вариацией». Так был получен первый успешный перенос
        нейросети, обученной <strong>только</strong> на синтетических RGB-картинках, на реальный
        робот-манипулятор.
      </li>
    </ol>

    <ProseP>
      Если бы мы захотели поставить нашу политику на физический радиоуправляемый автомобиль, помогла бы
      именно вторая мотивация: рандомизация трения, задержек привода и шума датчиков делает реальную
      машину неотличимой от «ещё одной случайной симуляции».
    </ProseP>

    <ProseP>
      <strong>Но есть цена.</strong> Чем шире рандомизация, тем сильнее она <em>регуляризует</em>{" "}
      поведение — и тем выше риск получить <strong>чрезмерно осторожную</strong> политику: если мир
      слишком разнообразен и непредсказуем, оптимально становится ехать медленно и перестраховываться
      везде. Слишком узкая рандомизация → переобучение; слишком широкая → вялая, консервативная езда.
      Нужен баланс — а лучше <strong>расписание</strong>, которое расширяет рандомизацию по мере роста
      агента. Это и есть ADR (раздел 5).
    </ProseP>

    <InteractiveStub title="Интерактив (рекомендация): «Контекстный MDP и разрыв обобщения»">
      Слайдер «ширина рандомизации» <Math display={false}>{String.raw`\enfPar{\sigma}`}</Math>; слева — облако из
      нескольких трасс, сэмплированных из <Math display={false}>{String.raw`p(c)`}</Math> (чем больше{" "}
      <Math display={false}>{String.raw`\enfPar{\sigma}`}</Math>, тем разнообразнее); справа — две полоски{" "}
      <code className="px-1 rounded bg-muted/50 text-xs font-mono">train reward</code> и{" "}
      <code className="px-1 rounded bg-muted/50 text-xs font-mono">test reward</code> и их разрыв.
      Видно, как с ростом <Math display={false}>{String.raw`\enfPar{\sigma}`}</Math> разрыв сокращается, но при
      чрезмерном <Math display={false}>{String.raw`\enfPar{\sigma}`}</Math> обе полоски проседают (консервативная
      политика). JSX со слайдером и живыми барами.
    </InteractiveStub>

    <KeyPoints
      items={[
        <>
          В RL переобучение скрыто: обучение и тест по умолчанию на <strong>одной</strong> среде.
          Раздельные train/test-уровни (Cobbe и др., 2019/2020) вскрывают{" "}
          <strong>разрыв обобщения</strong>.
        </>,
        <>
          Правильная цель — максимум отдачи <strong>по распределению контекстов</strong>{" "}
          <Math display={false}>{String.raw`p(c)`}</Math>, а не для одного контекста{" "}
          <Math display={false}>{String.raw`c_0`}</Math>.
        </>,
        <>
          Рандомизация преследует <strong>две разные</strong> цели: обобщение (новые конфигурации) и{" "}
          <strong>sim-to-real</strong> (Tobin и др., 2017: реальность как «ещё одна вариация»).
        </>,
        <>
          Трейд-офф: узкая рандомизация → переобучение; слишком широкая →{" "}
          <strong>чрезмерно осторожная</strong> политика.
        </>,
      ]}
    />
  </>
);

export default Section4;
