import Math from "@/components/Math";
import { SECTION_TITLE_CLASS, H3_CLASS, ProseP, KeyPoints, Callout } from "./_shared";

const Section3 = () => (
  <>
    <h2 id="razdel-3-gail" className={`${SECTION_TITLE_CLASS} scroll-mt-24`}>
      Раздел 3. GAIL — ядро урока
    </h2>

    <ProseP>
      <strong>Источник:</strong> Jonathan Ho &amp; Stefano Ermon,{" "}
      <em>Generative Adversarial Imitation Learning</em>, NeurIPS 2016, arXiv:1606.03476.
    </ProseP>

    <h3 className={H3_CLASS}>Max-entropy IRL как примитив</h3>
    <ProseP>
      Ho &amp; Ermon работают с max-causal-entropy IRL, регуляризованным выпуклым{" "}
      <Math display={false}>{String.raw`\enfPar{\psi}`}</Math>:
    </ProseP>
    <Math display>
      {String.raw`\operatorname{IRL}_\psi(\pi_E)=\arg\max_{c\in\mathbb{R}^{\mathcal{S}\times\mathcal{A}}}\ -\enfPar{\psi}(\enfTgt{c})+\Big(\min_{\pi\in\Pi}-\enfOp{H}(\pi)+\mathbb{E}_\pi[\enfTgt{c}(\enfVar{s},a)]\Big)-\mathbb{E}_{\pi_E}[\enfTgt{c}(\enfVar{s},a)],`}
    </Math>
    <ProseP>
      где <Math display={false}>{String.raw`\enfOp{H}(\enfFun{\pi})=\mathbb{E}_\pi[-\log\enfFun{\pi}(\enfFun{a}\mid \enfVar{s})]`}</Math> —{" "}
      <Math display={false}>{String.raw`\enfPar{\gamma}`}</Math>-дисконтированная causal entropy, а{" "}
      <Math display={false}>{String.raw`\operatorname{RL}(\enfTgt{c})=\arg\min_\pi -\enfOp{H}(\pi)+\mathbb{E}_\pi[\enfTgt{c}(\enfVar{s},\enfFun{a})]`}</Math>
      .
    </ProseP>

    <h3 className={H3_CLASS}>Occupancy measure — мост к биекции</h3>
    <Math display>
      {String.raw`\enfFun{\rho}_\pi(\enfVar{s},\enfFun{a})=\enfFun{\pi}(\enfFun{a}\mid \enfVar{s})\sum_{t=0}^{\infty}\enfPar{\gamma}^t \enfFun{P}(\enfVar{s}_t=\enfVar{s}\mid\enfFun{\pi}),`}
    </Math>
    <ProseP>
      что позволяет писать{" "}
      <Math display={false}>{String.raw`\mathbb{E}_\pi[\enfTgt{c}(\enfVar{s},a)]=\sum_{s,a}\enfFun{\rho}_\pi(\enfVar{s},a)\,\enfTgt{c}(\enfVar{s},a)`}</Math>
      .
    </ProseP>

    <Callout title="Лемма 3.1 (биекция Π ↔ D)" color="purple">
      Если <Math display={false}>{String.raw`\enfFun{\rho}\in\mathcal{D}`}</Math> (множество допустимых
      occupancy measures), то <Math display={false}>{String.raw`\enfFun{\rho}`}</Math> — occupancy measure{" "}
      <strong>единственной</strong> политики{" "}
      <Math display={false}>{String.raw`\enfFun{\pi}_\rho(\enfFun{a}\mid \enfVar{s})=\enfFun{\rho}(\enfVar{s},\enfFun{a})/\sum_{a'}\enfFun{\rho}(\enfVar{s},a')`}</Math>. Между{" "}
      <Math display={false}>{String.raw`\Pi`}</Math> и{" "}
      <Math display={false}>{String.raw`\mathcal{D}`}</Math> существует биекция — поэтому работать с
      occupancy так же законно, как с политикой.
    </Callout>

    <Callout title="Proposition 3.1 (Ho & Ermon, Eq. 4)" color="purple">
      <Math display>
        {String.raw`\operatorname{RL}\circ\operatorname{IRL}_\psi(\pi_E)=\arg\min_{\pi\in\Pi}\ -\enfOp{H}(\pi)+\enfPar{\psi}^*\big(\enfFun{\rho}_\pi-\enfFun{\rho}_{\pi_E}\big),`}
      </Math>
      где <Math display={false}>{String.raw`\enfPar{\psi}^*`}</Math> — convex conjugate к{" "}
      <Math display={false}>{String.raw`\enfPar{\psi}`}</Math>. Смысл: RL после IRL{" "}
      <strong>неявно ищет политику, чья occupancy measure близка к экспертной</strong>; мерой близости
      служит <Math display={false}>{String.raw`\enfPar{\psi}^*`}</Math>.
    </Callout>

    <h3 className={H3_CLASS}>Выбор ψGA и связь с GAN</h3>
    <ProseP>
      Ho &amp; Ermon вводят регуляризатор (Eq. 13):
    </ProseP>
    <Math display>
      {String.raw`\enfPar{\psi}_{\text{GA}}(\enfTgt{c})=\begin{cases}\mathbb{E}_{\pi_E}[\enfFun{g}(\enfTgt{c}(\enfVar{s},\enfFun{a}))] & \enfTgt{c}<0\\+\infty & \text{иначе}\end{cases},\qquad \enfFun{g}(\enfVar{x})=\begin{cases}-\enfVar{x}-\log(1-e^{x}) & \enfVar{x}<0\\+\infty & \text{иначе.}\end{cases}`}
    </Math>
    <ProseP>Его сопряжённая (Eq. 14) есть в точности задача бинарной классификации:</ProseP>
    <Math display>
      {String.raw`\enfPar{\psi}_{\text{GA}}^*(\enfFun{\rho}_\pi-\enfFun{\rho}_{\pi_E})=\sup_{D\in(0,1)^{\mathcal{S}\times\mathcal{A}}}\ \mathbb{E}_\pi[\log \enfFun{D}(\enfVar{s},\enfFun{a})]+\mathbb{E}_{\pi_E}[\log(1-\enfFun{D}(\enfVar{s},\enfFun{a}))].`}
    </Math>
    <ProseP>Подставляя в Proposition 3.1, получаем минимакс GAIL:</ProseP>
    <Math display>
      {String.raw`\boxed{\ \min_{\pi}\ \max_{D\in(0,1)^{\mathcal{S}\times\mathcal{A}}}\ \mathbb{E}_\pi[\log \enfFun{D}(\enfVar{s},\enfFun{a})]+\mathbb{E}_{\pi_E}[\log(1-\enfFun{D}(\enfVar{s},\enfFun{a}))]-\enfPar{\lambda} \enfOp{H}(\pi)\ }`}
    </Math>
    <ProseP>
      Здесь <Math display={false}>D</Math> — <strong>дискриминатор</strong> (классификатор: пара от
      политики vs пара от эксперта), <Math display={false}>{String.raw`\enfFun{\pi}`}</Math> —{" "}
      <strong>генератор</strong> (как в GAN). При оптимальном{" "}
      <Math display={false}>{String.raw`\enfFun{D}^*(\enfVar{s},\enfFun{a})=\enfFun{\rho}_{\pi_E}/(\enfFun{\rho}_{\pi_E}+\enfFun{\rho}_\pi)`}</Math> потеря с
      точностью до константы и масштаба равна{" "}
      <strong>JS-дивергенции</strong>{" "}
      <Math display={false}>{String.raw`\enfFun{D}_{\text{JS}}(\enfFun{\bar\rho}_\pi,\enfFun{\bar\rho}_{\pi_E})`}</Math> между
      нормированными occupancy measures — ровно как в стандартном GAN.
    </ProseP>

    <h3 className={H3_CLASS}>Награда для политики</h3>
    <ProseP>
      Из <Math display={false}>{String.raw`\enfPar{\psi}_{\text{GA}}`}</Math> следует, что шаг RL минимизирует
      стоимость <Math display={false}>{String.raw`\enfTgt{c}(\enfVar{s},\enfFun{a})=\log \enfFun{D}(\enfVar{s},\enfFun{a})`}</Math>; эквивалентно политику
      обучают <strong>максимизировать</strong>
    </ProseP>
    <Math display>{String.raw`\enfTgt{r}(\enfVar{s},\enfFun{a})=-\log\big(1-\enfFun{D}(\enfVar{s},\enfFun{a})\big),`}</Math>
    <ProseP>
      т.е. чем больше дискриминатор «верит», что пара экспертная, тем выше награда. (Возможны
      варианты <Math display={false}>{String.raw`\enfTgt{r}=\log \enfFun{D} - \log(1-\enfFun{D})`}</Math>; в ML-Agents реализован
      собственный вариант этого сигнала.)
    </ProseP>

    <h3 className={H3_CLASS}>Алгоритм 1 (псевдокод GAIL)</h3>
    <pre className="my-4 overflow-x-auto rounded-lg border border-cyan-500/20 bg-card/60 backdrop-blur-sm p-4 text-xs leading-relaxed text-foreground/90">
{`Вход: экспертные траектории tau_E ~ pi_E;
      начальные параметры theta_0 (политика), w_0 (дискриминатор)
for i = 0, 1, 2, ... do
    Сэмплировать траектории tau_i ~ pi_{theta_i}
    # (1) шаг дискриминатора: Adam-подъём по
    w_{i+1} <- w_i + ascent с градиентом
          E_{tau_i}[ grad_w log( D_w(s,a) ) ]
        + E_{tau_E}[ grad_w log( 1 - D_w(s,a) ) ]
    # (2) шаг политики: TRPO/PPO с наградой r = -log(1 - D_{w_{i+1}})
    theta_{i+1} <- TRPO-шаг по
          E_{tau_i}[ grad_theta log pi_theta(a|s) Q(s,a) ]
        - lambda * grad_theta H(pi_theta)
        где Q(s_, a_) = E_{tau_i}[ log D_{w_{i+1}}(s,a) | s_0=s_, a_0=a_ ]
end for`}
    </pre>
    <ProseP>
      Архитектура в оригинале: <Math display={false}>{String.raw`\enfFun{\pi}_\theta`}</Math> и{" "}
      <Math display={false}>{String.raw`\enfFun{D}_w`}</Math> — по 2 скрытых слоя (
      <Math display={false}>{String.raw`\tanh`}</Math>); для снижения дисперсии — value-сеть и GAE (
      <Math display={false}>{String.raw`\enfPar{\gamma}=0{,}995`}</Math>,{" "}
      <Math display={false}>{String.raw`\enfPar{\lambda}=0{,}97`}</Math>). TRPO-шаг нужен, чтобы политика не
      «улетала» из-за шума градиента.
    </ProseP>

    <Callout title="Почему GAIL эффективнее IRL" color="cyan">
      Классический IRL = dual ascent, где внутренний примал — это <strong>полная RL-задача</strong>.
      GAIL же чередует <strong>по одному шагу</strong> дискриминатора и политики (как обучают GAN),
      не доводя RL до сходимости на каждой итерации.
    </Callout>

    <Callout title="Эмпирика (Ho & Ermon, 2016)" color="cyan">
      Тестовые среды: Cartpole, Acrobot, Mountain Car и MuJoCo HalfCheetah, Hopper, Walker, Ant,
      Humanoid, Reacher. Эксперт — TRPO-политика; датасеты крошечные (Hopper/Walker — наборы по{" "}
      <Math display={false}>{String.raw`\{4,11,18,25\}`}</Math> траекторий длиной 1000). GAIL почти
      всегда достигал ≥70% экспертной производительности при всех размерах датасета; на Humanoid —{" "}
      <strong>точный экспертный уровень при всех размерах</strong>, тогда как BC не превышал ~60%. По
      Kostrikov и др. (ICLR 2019) GAIL обучается «всего из ~200 переходов (4 экспертных траектории)»,
      но требует <strong>до ~25 млн</strong> шагов взаимодействия со средой. Ключевой вывод: GAIL{" "}
      <em>дёшев по демонстрациям, но дорог по шагам среды</em> — поэтому его комбинируют с BC-warmup
      и extrinsic-наградой.
    </Callout>

    <KeyPoints
      items={[
        <>
          GAIL = занимаются «соревнованием» дискриминатор и политика; оптимальная потеря —
          JS-дивергенция между occupancy measures.
        </>,
        <>
          Награда политике:{" "}
          <Math display={false}>{String.raw`\enfTgt{r}=-\log(1-\enfFun{D}(\enfVar{s},\enfFun{a}))`}</Math> — чем больше{" "}
          <Math display={false}>D</Math> верит в экспертность, тем выше сигнал.
        </>,
        <>
          GAIL экономен по демо, но прожорлив по шагам среды — отсюда практика BC-warmup +
          extrinsic-shaping.
        </>,
      ]}
    />
  </>
);

export default Section3;
