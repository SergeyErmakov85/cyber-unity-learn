import { sym } from "../build";
import type { SymbolEntry } from "../types";

/**
 * Словари символов уроков уровня 3. Код этих уроков — конфиги ML-Agents,
 * псевдокод алгоритмов из статей и сниппеты C#/Python, поэтому колонка
 * «В коде» называет ключи YAML и имена из псевдокода самой страницы.
 */

// ── 3.1 SAC ───────────────────────────────────────────────────────────────
export const LESSON_3_1_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", {
    inFormula: "Состояние гонщика в момент $t$: от него зависят и политика, и оба критика.",
    code: ["sₜ"],
    codeNote: "В Algorithm 1 — `sₜ` в кортеже перехода `(sₜ, aₜ, r(sₜ,aₜ), sₜ₊₁)`, который кладётся в буфер `D`.",
  }),
  sym("u", "variable", {
    name: "действие до сжатия",
    meaning:
      "Гауссов сэмпл $\\enfVar{u} \\sim \\mathcal{N}(\\enfFun{\\mu}_\\phi(\\enfVar{s}), \\enfFun{\\sigma}_\\phi(\\enfVar{s}))$ до функции $\\tanh$. Действие получается сжатием $\\enfFun{a} = \\tanh(\\enfVar{u})$, и в логарифм вероятности входит поправка на эту замену переменной.",
    inFormula: "Через $\\enfVar{u}$ считают $\\log \\enfFun{\\pi}(\\enfFun{a} \\mid \\enfVar{s})$: плотность $\\enfVar{u}$ минус $\\sum_i \\log(1 - \\tanh^2 \\enfVar{u}_i)$.",
    codeNote: "В YAML не настраивается: сжатие $\\tanh$ встроено в SAC-тренер ML-Agents для непрерывных действий.",
  }),
  sym("\\varepsilon", "variable", {
    inFormula: "Шум трюка репараметризации: $\\enfFun{a} = \\enfFun{f}_\\phi(\\enfVar{\\varepsilon}; \\enfVar{s})$, $\\enfVar{\\varepsilon} \\sim \\mathcal{N}(0, I)$. Случайность вынесена из сети, и градиент проходит в $\\enfPar{\\phi}$.",
  }),
  sym("a", "function", {
    inFormula: "Непрерывное действие (руль, газ), выданное политикой; в формулах SAC — аргумент $\\enfOp{Q}$ и $\\log \\enfFun{\\pi}$.",
    code: ["aₜ ~ π_φ(·|sₜ)"],
  }),
  sym("\\pi", "function", {
    inFormula: "Стохастическая политика $\\enfFun{\\pi}_\\phi(\\enfFun{a} \\mid \\enfVar{s})$ — гауссиана, сжатая $\\tanh$. Её энтропию SAC максимизирует вместе с наградой.",
    code: ["π_φ(·|sₜ)", "trainer_type: sac"],
  }),
  sym("\\mu", "function", {
    name: "среднее действия и плотность до сжатия",
    meaning:
      "$\\enfFun{\\mu}_\\phi(\\enfVar{s})$ — голова сети политики, центр гауссианы. В приложении о $\\tanh$ та же буква обозначает плотность $\\enfFun{\\mu}(\\enfVar{u} \\mid \\enfVar{s})$ несжатого действия.",
    inFormula: "Вместе с $\\enfFun{\\sigma}_\\phi(\\enfVar{s})$ задаёт гауссиану, из которой берётся $\\enfVar{u}$.",
  }),
  sym("\\sigma", "function", {
    name: "голова разброса политики",
    meaning: "$\\enfFun{\\sigma}_\\phi(\\enfVar{s})$ — стандартное отклонение гауссовой политики, выход второй головы сети. Его величина и задаёт энтропию: шире гауссиана — больше исследования.",
    inFormula: "Масштабирует шум: $\\enfVar{u} = \\enfFun{\\mu}_\\phi(\\enfVar{s}) + \\enfFun{\\sigma}_\\phi(\\enfVar{s}) \\odot \\enfVar{\\varepsilon}$.",
  }),
  sym("f", "function", {
    name: "репараметризованное действие",
    meaning: "$\\enfFun{f}_\\phi(\\enfVar{\\varepsilon}; \\enfVar{s}) = \\tanh\\big(\\enfFun{\\mu}_\\phi(\\enfVar{s}) + \\enfFun{\\sigma}_\\phi(\\enfVar{s}) \\odot \\enfVar{\\varepsilon}\\big)$ — детерминированная функция от шума и состояния.",
    inFormula: "Подставляется в $\\enfTgt{J}_\\pi$ вместо сэмпла: так градиент по $\\enfPar{\\phi}$ берётся напрямую через $\\enfOp{Q}$.",
  }),
  sym("\\rho", "function", {
    inFormula: "$\\enfFun{\\rho}_\\pi$ — распределение пар «состояние — действие», которые посещает политика; по нему берётся ожидание в цели.",
  }),
  sym("Q", "operator", {
    name: "мягкая функция ценности действия",
    meaning: "$\\enfOp{Q}_\\theta(\\enfVar{s}, \\enfFun{a})$ — ожидаемая отдача с энтропийным бонусом после действия $\\enfFun{a}$ в $\\enfVar{s}$. SAC держит два критика, $\\enfOp{Q}_{\\theta_1}$ и $\\enfOp{Q}_{\\theta_2}$, и берёт минимум, чтобы не переоценивать.",
    inFormula: "Оценивает действие для политики и даёт цель $\\enfTgt{y}$ через $\\min_i \\enfOp{Q}_{\\bar\\theta_i}$.",
    code: ["θ₁, θ₂ (два критика)"],
  }),
  sym("V", "operator", {
    inFormula: "Мягкая ценность состояния: $\\enfOp{V}(\\enfVar{s}) = \\mathbb{E}_{a}[\\enfOp{Q}(\\enfVar{s}, \\enfFun{a}) - \\enfPar{\\alpha} \\log \\enfFun{\\pi}(\\enfFun{a} \\mid \\enfVar{s})]$.",
  }),
  sym("\\mathcal{H}", "operator", {
    inFormula: "Энтропия политики в состоянии: бонус $\\enfPar{\\alpha}\\,\\enfOp{\\mathcal{H}}$ добавляется к награде каждого шага.",
  }),
  sym("\\bar{\\mathcal{H}}", "operator", {
    inFormula: "Целевая энтропия: температура $\\enfPar{\\alpha}$ подстраивается так, чтобы средняя энтропия держалась около $\\enfOp{\\bar{\\mathcal{H}}}$.",
    codeNote: "В YAML не задаётся: для непрерывных действий ML-Agents берёт эвристику статьи $-\\dim \\mathcal{A}$.",
  }),
  sym("\\mathcal{T}", "operator", {
    inFormula: "Мягкий оператор Беллмана: $\\enfOp{\\mathcal{T}}^\\pi \\enfOp{Q} = \\enfTgt{r} + \\enfPar{\\gamma}\\,\\mathbb{E}[\\enfOp{V}(\\enfVar{s}')]$. Его неподвижная точка — $\\enfOp{Q}^\\pi$.",
  }),
  sym("Z", "operator", {
    inFormula: "Нормировка в шаге улучшения политики: делает $\\exp(\\enfOp{Q}/\\enfPar{\\alpha})/\\enfOp{Z}$ распределением; на градиент не влияет.",
  }),
  sym("D", "operator", {
    inFormula: "$\\enfOp{D}_{\\mathrm{KL}}$ — расхождение Кульбака — Лейблера: новая политика ищется как ближайшая к $\\exp(\\enfOp{Q}/\\enfPar{\\alpha})$.",
  }),
  sym("\\alpha", "parameter", {
    name: "температура (энтропийный коэффициент)",
    meaning: "Вес энтропии в цели SAC. Большое $\\enfPar{\\alpha}$ — больше случайности и исследования, малое — ближе к жадной политике. В SAC v2 она обучаемая: подстраивается под целевую энтропию.",
    inFormula: "Масштабирует бонус $\\enfOp{\\mathcal{H}}$ и член $-\\enfPar{\\alpha} \\log \\enfFun{\\pi}$ в целях критика и политики.",
    code: ["init_entcoef: 1.0", "α ← α − λ ∇̂_α J(α)"],
    codeNote: "`init_entcoef` — стартовое $\\enfPar{\\alpha}_0$; дальше тренер сам минимизирует $\\enfTgt{J}(\\enfPar{\\alpha})$. Не путать с `learning_rate`: в этом уроке $\\enfPar{\\alpha}$ — не скорость обучения.",
  }),
  sym("\\theta", "parameter", {
    name: "веса критиков",
    meaning: "В обозначениях статьи SAC $\\enfPar{\\theta}_1, \\enfPar{\\theta}_2$ — веса двух Q-сетей, а веса политики — $\\enfPar{\\phi}$. В уровне 2 было наоборот ($\\enfPar{\\theta}$ — политика), поэтому сверяйтесь с подписью.",
    inFormula: "По ним минимизируется $\\enfTgt{J}_Q$ — остаток мягкого уравнения Беллмана.",
    code: ["θ₁, θ₂", "θᵢ ← θᵢ − λ_Q ∇̂_θᵢ J_Q(θᵢ)"],
  }),
  sym("\\bar{\\theta}", "parameter", {
    inFormula: "Веса target-критиков: плавно догоняют $\\enfPar{\\theta}$ и дают устойчивую цель $\\enfTgt{y}$.",
    code: ["θ̄ᵢ ← τ θᵢ + (1−τ) θ̄ᵢ"],
  }),
  sym("\\phi", "parameter", {
    name: "веса политики",
    meaning: "Параметры сети политики $\\enfFun{\\pi}_\\phi$ (головы $\\enfFun{\\mu}_\\phi$ и $\\enfFun{\\sigma}_\\phi$) в обозначениях статьи SAC.",
    inFormula: "По ним минимизируется $\\enfTgt{J}_\\pi$ через репараметризацию $\\enfFun{f}_\\phi$.",
    code: ["φ ← φ − λ_π ∇̂_φ J_π(φ)"],
  }),
  sym("\\gamma", "parameter", {
    inFormula: "Дисконт будущей мягкой ценности в цели $\\enfTgt{y}$.",
    code: ["gamma: 0.99"],
    codeNote: "Ключ `reward_signals.extrinsic.gamma`; строго меньше 1.",
  }),
  sym("\\tau", "parameter", {
    inFormula: "Шаг мягкого обновления: $\\enfPar{\\bar{\\theta}} \\leftarrow \\enfPar{\\tau}\\enfPar{\\theta} + (1-\\enfPar{\\tau})\\enfPar{\\bar{\\theta}}$.",
    code: ["tau: 0.005"],
  }),
  sym("J", "target", {
    inFormula: "Три цели SAC, которые минимизируются совместно: $\\enfTgt{J}_Q$ (критики), $\\enfTgt{J}_\\pi$ (политика), $\\enfTgt{J}(\\enfPar{\\alpha})$ (температура).",
    code: ["J_Q(θᵢ)", "J_π(φ)", "J(α)"],
  }),
  sym("r", "target", {
    inFormula: "Награда шага; к ней добавляется энтропийный бонус.",
    code: ["r(sₜ,aₜ)", "strength: 1.0"],
    codeNote: "`strength` масштабирует внешнюю награду `extrinsic`.",
  }),
  sym("y", "target", {
    inFormula: "TD-цель критика: $\\enfTgt{y} = \\enfTgt{r} + \\enfPar{\\gamma}\\big(\\min_i \\enfOp{Q}_{\\bar\\theta_i}(\\enfVar{s}', a') - \\enfPar{\\alpha} \\log \\pi_\\phi(a' \\mid \\enfVar{s}')\\big)$.",
  }),
];

// ── 3.2 MA-POCA и self-play ──────────────────────────────────────────────
export const LESSON_3_2_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", {
    inFormula: "Глобальное состояние сцены. Его видит централизованный критик при обучении, но не политики агентов.",
  }),
  sym("o", "variable", {
    name: "локальное наблюдение агента",
    meaning: "$\\enfVar{o}^i$ — то, что видит агент $i$: его лучи, скорость, мяч в поле зрения. Каждая политика действует только по своему наблюдению.",
    inFormula: "Вход политики $\\enfFun{\\pi}_i(\\enfFun{a}^i \\mid \\enfVar{o}^i)$ и энкодеров $\\enfFun{g}_i$, $\\enfFun{f}_i$.",
    codeNote: "Собирается в `CollectObservations` каждого агента команды.",
  }),
  sym("\\mathbf{o}", "variable", {
    name: "совместное наблюдение",
    meaning: "Набор локальных наблюдений всех агентов: $\\enfVar{\\mathbf{o}}_t = (\\enfVar{o}^1_t, \\dots, \\enfVar{o}^N_t)$.",
  }),
  sym("a", "function", {
    inFormula: "$\\enfFun{a}^i$ — действие агента $i$; $\\enfFun{a}'$ — альтернативное действие в контрфактическом базисе.",
  }),
  sym("\\mathbf{a}", "function", {
    inFormula: "Совместное действие команды; $\\enfFun{\\mathbf{a}}^{-i}$ — действия всех, кроме агента $i$.",
  }),
  sym("\\pi", "function", {
    inFormula: "Децентрализованные политики: совместная политика — произведение $\\prod_i \\enfFun{\\pi}_i$.",
    code: ["trainer_type: poca"],
  }),
  sym("P", "function", {
    inFormula: "Функция переходов многоагентной среды: следующее состояние зависит от действий всех агентов.",
  }),
  sym("g", "function", {
    name: "энкодер наблюдения",
    meaning: "$\\enfFun{g}_i(\\enfVar{o}^i)$ — сеть, превращающая наблюдение агента в эмбеддинг для общего блока внимания RSA.",
    inFormula: "Эмбеддинги активных агентов идут в $\\text{RSA}$, затем в критик $\\enfOp{V}_\\phi$; поэтому критик работает при любом числе агентов.",
  }),
  sym("f", "function", {
    name: "энкодер пары «наблюдение — действие»",
    meaning: "$\\enfFun{f}_i(\\enfVar{o}^i, \\enfFun{a}^i)$ — эмбеддинг агента вместе с его действием для контрфактического базиса.",
    inFormula: "В базисе агента $j$ его собственное действие убрано: для него берётся $\\enfFun{g}_j(\\enfVar{o}^j)$, для остальных — $\\enfFun{f}_i$.",
  }),
  sym("Q", "operator", {
    inFormula: "$\\enfOp{Q}^\\pi$ — ценность совместного действия; $\\enfOp{Q}_\\psi$ — сеть контрфактического базиса MA-POCA.",
  }),
  sym("V", "operator", {
    inFormula: "Централизованный критик $\\enfOp{V}_\\phi$ над эмбеддингами всех активных агентов.",
  }),
  sym("\\hat{A}", "operator", {
    inFormula: "Преимущество агента $i$: ценность совместного действия минус его контрфактический базис $\\enfOp{b}_i$.",
  }),
  sym("b", "operator", {
    name: "контрфактический базис агента",
    meaning: "$\\enfOp{b}_i$ — ожидаемая ценность, если агент $i$ заменит своё действие сэмплом из своей политики, а остальные останутся при своих. Отвечает на вопрос «каков мой личный вклад?».",
    inFormula: "Вычитается из $\\enfOp{Q}^\\pi$; так награда команды делится между агентами (credit assignment).",
  }),
  sym("G", "operator", {
    inFormula: "$\\enfOp{G}^{(n)}_t$ — $n$-шаговая отдача с хвостом из централизованного критика.",
  }),
  sym("\\nabla", "operator", {
    inFormula: "Градиент цели агента $i$ по его весам $\\enfPar{\\theta}_i$.",
  }),
  sym("E", "operator", {
    name: "ожидаемый результат по Эло",
    meaning: "$\\enfOp{E}_A = 1/(1 + 10^{(\\enfTgt{R}_B - \\enfTgt{R}_A)/400})$ — вероятность победы $A$ над $B$ по разнице рейтингов. При равных рейтингах $\\enfOp{E}_A = 0{,}5$.",
    inFormula: "Сравнивается с фактическим $\\enfTgt{S}_A$: рейтинг растёт, если сыграли лучше ожидания.",
  }),
  sym("K", "parameter", {
    name: "K-фактор Эло",
    meaning: "Максимальное изменение рейтинга за одну игру. В уроке $\\enfPar{K} = 16$.",
    inFormula: "Множитель поправки $\\enfPar{K}(\\enfTgt{S}_A - \\enfOp{E}_A)$.",
  }),
  sym("x", "parameter", {
    name: "число смен соперника",
    meaning: "Сколько раз за период `team_change` агент должен сменить снимок соперника из пула.",
    inFormula: "Определяет `swap_steps` при равных командах.",
    code: ["swap_steps = team_change / x"],
  }),
  sym("\\gamma", "parameter", {
    inFormula: "Дисконт в $n$-шаговой отдаче.",
    code: ["gamma: 0.99"],
  }),
  sym("\\lambda", "parameter", {
    inFormula: "Вес смешивания $n$-шаговых отдач в $\\lambda$-отдаче: $(1-\\enfPar{\\lambda})\\enfPar{\\lambda}^{n-1}$.",
    code: ["lambd: 0.95"],
    codeNote: "В YAML ML-Agents ключ пишется `lambd` — без последней буквы, потому что `lambda` занято в Python.",
  }),
  sym("\\theta", "parameter", {
    inFormula: "$\\enfPar{\\theta}_i$ — веса политики агента $i$.",
  }),
  sym("J", "target", { inFormula: "Ожидаемая отдача команды, которую максимизирует каждый агент." }),
  sym("R", "target", {
    name: "рейтинг Эло",
    meaning: "Числовая сила снимка политики в self-play. После игры $\\enfTgt{R}'_A = \\enfTgt{R}_A + \\enfPar{K}(\\enfTgt{S}_A - \\enfOp{E}_A)$.",
    inFormula: "Растущий рейтинг в TensorBoard — главный признак того, что self-play учится.",
    code: ["initial_elo: 1200.0"],
  }),
  sym("S", "target", {
    name: "фактический результат игры",
    meaning: "$\\enfTgt{S}_A \\in \\{1;\\ 0{,}5;\\ 0\\}$ — победа, ничья или поражение $A$.",
  }),
  sym("r", "target", {
    inFormula: "Награда группы за шаг; в $\\lambda$-отдаче — $\\enfTgt{r}_{t+l}$.",
    code: ["m_AgentGroup.AddGroupReward(rewardForGoal)"],
    codeNote: "Групповая награда делится на всю команду; разбирается, чей вклад, уже базисом $\\enfOp{b}_i$.",
  }),
  sym("y", "target", {
    inFormula: "$\\enfTgt{y}^{(\\lambda)}$ — $\\lambda$-отдача, цель для централизованного критика.",
  }),
];

// ── 3.3 Curriculum и рандомизация ─────────────────────────────────────────
export const LESSON_3_3_SYMBOLS: SymbolEntry[] = [
  sym("\\overline{m}", "variable", {
    name: "сглаженная метрика урока",
    meaning: "$\\enfVar{\\overline{m}}_k$ — скользящее среднее показателя (обычно награды) на уроке $k$.",
    inFormula: "Сравнивается с порогом $\\enfPar{\\tau}_k$: превысил его достаточно долго — переход к следующему уроку.",
    code: ["measure: reward", "signal_smoothing: true"],
  }),
  sym("D", "variable", {
    name: "буфер успешности границы",
    meaning: "$\\enfVar{D}_i^b$ — накопленные результаты эпизодов, в которых параметр $i$ стоял ровно на границе $\\enfPar{b}$.",
    inFormula: "Когда буфер наполнится, его среднее сравнивают с порогами $\\enfPar{t}_H$ и $\\enfPar{t}_L$.",
    code: ["D[i][b]"],
  }),
  sym("P", "function", {
    name: "распределение уровней или сред",
    meaning: "В ADR $\\enfFun{P}_\\phi(\\enfPar{\\lambda})$ — распределение параметров среды с границами $\\enfPar{\\phi}$. В PLR $\\enfFun{P}_{\\text{replay}}$ — вероятность переиграть уровень, смесь $\\enfFun{P}_S$ (по баллу) и $\\enfFun{P}_C$ (по свежести). $\\enfFun{P}_c$ — переходы среды в контексте $\\enfPar{c}$.",
    code: ["P_φ", "P_replay(l)"],
  }),
  sym("p", "function", {
    inFormula: "$\\enfFun{p}(\\enfPar{c})$ — распределение контекстов (физики, трасс), из которого берутся среды.",
    code: ["sampler_type: gaussian", "sampler_type: uniform", "sampler_type: multirangeuniform"],
    codeNote: "Секция `environment_parameters` задаёт $\\enfFun{p}(\\enfPar{c})$ по каждому параметру среды.",
  }),
  sym("\\pi", "function", { inFormula: "Политика, обобщающая на все контексты из $\\enfFun{p}(\\enfPar{c})$." }),
  sym("H", "operator", {
    name: "ADR-энтропия",
    meaning: "Энтропия распределения параметров среды, нормированная на число параметров $d$: чем шире диапазоны, тем она выше.",
    inFormula: "Растёт при расширении границ — «номер урока» для рандомизации.",
  }),
  sym("S", "operator", {
    name: "учебный потенциал уровня",
    meaning: "$\\enfOp{S}_l = \\frac{1}{T}\\sum_t |\\enfOp{\\hat{A}}_t|$ — средняя величина GAE на уровне $l$: насколько критик там ошибается.",
    code: ["S_l ← (1/T) · Σ_t |Â_t|"],
  }),
  sym("U", "operator", {
    inFormula: "Отдача агента на уровне с параметрами $\\enfPar{\\theta}$; разность отдач антагониста и протагониста — regret в PAIRED.",
  }),
  sym("\\hat{A}", "operator", {
    inFormula: "Оценка преимущества GAE; её модуль измеряет «сюрприз» критика.",
    code: ["Â_t"],
  }),
  sym("c", "parameter", {
    name: "контекст среды",
    meaning: "Набор параметров, задающий конкретную среду контекстного MDP: сцепление, ширина трассы, освещение. Каждый контекст — свой MDP $\\mathcal{M}_c$.",
    inFormula: "Сэмплируется $\\enfPar{c} \\sim \\enfFun{p}(\\enfPar{c})$; цель — высокая $\\enfTgt{J}_c$ в среднем по контекстам.",
    code: ["environment_parameters"],
  }),
  sym("\\lambda", "parameter", {
    name: "параметр среды или интерполяции",
    meaning: "В ADR $\\enfPar{\\lambda}$ — вектор параметров среды, сэмплируемый из $\\enfFun{P}_\\phi$. В разделе об учебном плане как продолжении $\\enfPar{\\lambda} \\in [0, 1]$ плавно переводит простую задачу $\\enfTgt{\\mathcal{L}}_0$ в целевую $\\enfTgt{\\mathcal{L}}^\\star$.",
    code: ["λ ← сэмпл из P_φ"],
  }),
  sym("\\phi", "parameter", {
    name: "границы диапазонов ADR",
    meaning: "$\\enfPar{\\phi}_i^L$ и $\\enfPar{\\phi}_i^H$ — нижняя и верхняя граница $i$-го параметра среды; всего $2d$ чисел.",
    inFormula: "Двигаются наружу при успехе на границе и внутрь при провале.",
    code: ["φ_i^L", "φ_i^H"],
  }),
  sym("b", "parameter", {
    name: "выбранная граница",
    meaning: "Граница $\\enfPar{\\phi}_i^L$ или $\\enfPar{\\phi}_i^H$, на которой фиксируется параметр при boundary sampling.",
    code: ["b"],
  }),
  sym("t", "parameter", {
    name: "пороги ADR",
    meaning: "$\\enfPar{t}_H$ — высокий порог успешности (расширить границу), $\\enfPar{t}_L$ — низкий (сжать). Единственное, что человек настраивает в ADR.",
    code: ["t_H", "t_L"],
  }),
  sym("\\tau", "parameter", {
    name: "порог урока",
    meaning: "$\\enfPar{\\tau}_k$ — значение метрики, которое нужно превысить для перехода с урока $k$.",
    code: ["threshold: 0.7"],
  }),
  sym("L", "parameter", {
    name: "минимальная длина урока",
    meaning: "$\\enfPar{L}_{\\min}$ — сколько эпизодов агент обязан провести на уроке, прежде чем порог начнёт проверяться.",
    code: ["min_lesson_length: 100"],
  }),
  sym("\\rho", "parameter", {
    name: "коэффициент свежести PLR",
    meaning: "Доля распределения по свежести в смеси $\\enfFun{P}_{\\text{replay}}$; канонически $\\enfPar{\\rho} = 0{,}1$.",
    code: ["staleness_coef"],
  }),
  sym("\\mu", "parameter", {
    name: "сцепление шин",
    meaning: "Коэффициент сцепления с покрытием: $\\enfPar{\\mu} = 1{,}0$ — сухой асфальт.",
    code: ["surface_friction", "mean: 1.0"],
  }),
  sym("\\sigma", "parameter", {
    inFormula: "Разброс гауссова сэмплера параметра среды.",
    code: ["st_dev: 0.15"],
  }),
  sym("\\theta", "parameter", {
    name: "параметры уровня (PAIRED)",
    meaning: "Параметры среды, которые порождает учитель-генератор в PAIRED. Здесь это не веса сети.",
  }),
  sym("\\gamma", "parameter", { inFormula: "Дисконт в отдаче $\\enfTgt{J}_c$." }),
  sym("J", "target", {
    inFormula: "$\\enfTgt{J}_c(\\enfFun{\\pi})$ — ожидаемая отдача политики в контексте $\\enfPar{c}$; цель — её среднее по $\\enfFun{p}(\\enfPar{c})$.",
  }),
  sym("R", "target", { inFormula: "$\\enfTgt{R}_c$ — функция награды контекста $\\enfPar{c}$." }),
  sym("r", "target", { inFormula: "Награда шага в отдаче $\\enfTgt{J}_c$." }),
  sym("\\mathcal{L}", "target", {
    name: "последовательность задач",
    meaning: "$\\enfTgt{\\mathcal{L}}_0$ — простая задача, $\\enfTgt{\\mathcal{L}}^\\star$ — целевая; учебный план как метод продолжения ведёт от одной к другой через $\\enfTgt{\\mathcal{L}}_\\lambda$.",
  }),
];

// ── 3.4 Имитационное обучение: BC и GAIL ─────────────────────────────────
export const LESSON_3_4_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", {
    inFormula: "Состояние из демонстрации эксперта или из роллаута агента; дискриминатор сравнивает именно их распределения.",
    code: ["demo_path: Assets/Demonstrations/RacerExpert.demo"],
    codeNote: "При `use_actions: false` GAIL смотрит только на состояния — так стабильнее с шумными человеческими демо.",
  }),
  sym("\\tau", "variable", { inFormula: "Траектория — в MaxEnt IRL её вероятность пропорциональна $\\exp(\\enfTgt{R}(\\enfVar{\\tau}))$." }),
  sym("x", "variable", { inFormula: "Аргумент вспомогательной функции $\\enfFun{g}$ в регуляризаторе GAIL." }),
  sym("a", "function", {
    inFormula: "Действие: в BC — метка эксперта $\\enfFun{a}_i$, которую политика учится воспроизводить.",
    code: ["use_actions: false"],
    codeNote: "Флаг решает, видит ли дискриминатор GAIL действия или только состояния.",
  }),
  sym("\\pi", "function", {
    inFormula: "Политика агента; $\\enfFun{\\pi}_E$ — эксперт, $\\enfFun{\\pi}^*$ — оптимальная политика в анализе ошибки BC.",
  }),
  sym("\\hat{\\pi}", "function", {
    name: "политика, выученная с учителем",
    meaning: "$\\enfFun{\\hat{\\pi}}_{\\text{sup}}$ — минимизатор ошибки на состояниях эксперта. Ошибка на чужих состояниях копится, отсюда оценка $T^2 \\enfPar{\\varepsilon}$.",
  }),
  sym("\\mu", "function", {
    inFormula: "Голова среднего гауссовой политики $\\enfFun{\\mu}_\\theta(\\enfVar{s})$; при фиксированной дисперсии BC сводится к MSE между $\\enfFun{\\mu}_\\theta$ и $\\enfFun{a}_i$.",
  }),
  sym("\\Sigma", "function", {
    inFormula: "$\\enfFun{\\Sigma}_\\theta(\\enfVar{s})$ — ковариация гауссовой политики; при обучаемой $\\enfFun{\\Sigma}$ BC-лосс получает член $\\tfrac12 \\log\\det \\enfFun{\\Sigma}$.",
  }),
  sym("D", "function", {
    name: "дискриминатор GAIL",
    meaning: "$\\enfFun{D}(\\enfVar{s}, \\enfFun{a}) \\in (0, 1)$ — классификатор, отличающий пары политики от пар эксперта. Награда агента строится из его выхода.",
    inFormula: "Ведёт минимакс-игру с политикой; в AIRL имеет специальную форму через $\\enfFun{f}_\\theta$.",
    code: ["gail:", "strength: 0.1", "hidden_units: 128"],
    codeNote: "Секция `reward_signals.gail`; `network_settings` внутри неё — размер сети дискриминатора.",
  }),
  sym("f", "function", {
    inFormula: "AIRL: $\\enfFun{f}_\\theta = \\enfFun{g}_\\theta + \\enfPar{\\gamma}\\enfFun{h}_\\phi(\\enfVar{s}') - \\enfFun{h}_\\phi(\\enfVar{s})$ — логит дискриминатора с разделённой наградой.",
  }),
  sym("g", "function", {
    name: "аппроксиматор награды; вспомогательная функция",
    meaning: "В AIRL $\\enfFun{g}_\\theta(\\enfVar{s}, \\enfFun{a})$ — восстанавливаемая награда. В регуляризаторе GAIL $\\enfFun{g}(\\enfVar{x}) = -\\enfVar{x} - \\log(1 - e^{x})$ при $\\enfVar{x} < 0$.",
  }),
  sym("h", "function", {
    name: "член формирования (shaping) в AIRL",
    meaning: "$\\enfFun{h}_\\phi(\\enfVar{s})$ — потенциал: разность $\\enfPar{\\gamma}\\enfFun{h}_\\phi(\\enfVar{s}') - \\enfFun{h}_\\phi(\\enfVar{s})$ не меняет оптимальную политику.",
  }),
  sym("\\ell", "function", { inFormula: "Потеря имитации на одном состоянии: насколько действие политики расходится с экспертным." }),
  sym("\\rho", "function", {
    name: "мера посещаемости (occupancy measure)",
    meaning: "$\\enfFun{\\rho}_\\pi(\\enfVar{s}, \\enfFun{a}) = \\enfFun{\\pi}(\\enfFun{a} \\mid \\enfVar{s})\\sum_t \\enfPar{\\gamma}^t \\enfFun{P}(\\enfVar{s}_t = \\enfVar{s} \\mid \\enfFun{\\pi})$ — дисконтированная частота пары. GAIL сближает $\\enfFun{\\rho}_\\pi$ и $\\enfFun{\\rho}_{\\pi_E}$.",
  }),
  sym("\\bar{\\rho}", "function", {
    name: "нормированная мера посещаемости",
    meaning: "$\\enfFun{\\bar\\rho}_\\pi$ — $\\enfFun{\\rho}_\\pi$, делённая на сумму, то есть распределение вероятностей. Между такими распределениями GAIL минимизирует дивергенцию Йенсена — Шеннона.",
  }),
  sym("\\psi", "function", {
    name: "регуляризатор стоимости",
    meaning: "Выпуклая функция $\\enfFun{\\psi}$ от функции стоимости $\\enfTgt{c}$ в обратном RL. Выбор $\\enfFun{\\psi}_{\\text{GA}}$ превращает $\\enfFun{\\psi}^*(\\enfFun{\\rho}_\\pi - \\enfFun{\\rho}_{\\pi_E})$ в дивергенцию Йенсена — Шеннона, то есть в GAN-подобную задачу.",
  }),
  sym("p", "function", { inFormula: "$\\enfFun{p}(\\enfVar{\\tau})$ — распределение траекторий в модели максимальной энтропии." }),
  sym("P", "function", { inFormula: "Вероятность оказаться в состоянии $\\enfVar{s}$ на шаге $t$ под политикой $\\enfFun{\\pi}$." }),
  sym("H", "operator", {
    inFormula: "Каузальная энтропия политики; член $-\\enfPar{\\lambda}\\enfOp{H}(\\enfFun{\\pi})$ не даёт политике схлопнуться.",
  }),
  sym("Z", "operator", { inFormula: "Статсумма — сумма $\\exp(\\enfTgt{R}_\\theta)$ по всем траекториям." }),
  sym("D", "operator", { inFormula: "$\\enfOp{D}_{\\text{JS}}$ — дивергенция Йенсена — Шеннона между нормированными мерами посещаемости." }),
  sym("\\theta", "parameter", { inFormula: "Веса политики (в BC) или дискриминатора и награды (в AIRL)." }),
  sym("\\gamma", "parameter", {
    inFormula: "Дисконт в мере посещаемости и в AIRL-шейпинге.",
    code: ["gamma: 0.99"],
    codeNote: "Свой `gamma` есть и у `extrinsic`, и у `gail`.",
  }),
  sym("\\lambda", "parameter", {
    name: "вес энтропии в GAIL",
    meaning: "Коэффициент при $\\enfOp{H}(\\enfFun{\\pi})$ в минимакс-цели GAIL.",
  }),
  sym("\\varepsilon", "parameter", {
    name: "ошибка имитации на шаге",
    meaning: "Ожидаемая потеря клонированной политики на состояниях эксперта. Из-за накопления ошибок итоговая стоимость BC растёт как $T^2 \\enfPar{\\varepsilon}$.",
  }),
  sym("J", "target", { inFormula: "Ожидаемая стоимость политики за горизонт $T$ — в оценке накопления ошибки BC." }),
  sym("R", "target", { inFormula: "$\\enfTgt{R}_\\theta$ — награда, восстанавливаемая в MaxEnt IRL." }),
  sym("\\mathcal{L}", "target", {
    inFormula: "$\\enfTgt{\\mathcal{L}}_{\\text{BC}}(\\enfPar{\\theta})$ — лосс клонирования поведения: отрицательное лог-правдоподобие действий эксперта.",
    code: ["behavioral_cloning:", "strength: 0.5", "steps: 300000"],
    codeNote: "BC в ML-Agents — вспомогательный лосс к PPO; `steps` — сколько шагов он действует перед затуханием.",
  }),
  sym("c", "target", {
    name: "функция стоимости",
    meaning: "$\\enfTgt{c}(\\enfVar{s}, \\enfFun{a})$ — стоимость (минус награда), которую восстанавливает обратный RL. В GAIL $\\enfTgt{c} = \\log \\enfFun{D}$.",
  }),
  sym("r", "target", {
    inFormula: "Награда GAIL, которую получает агент: $\\enfTgt{r} = -\\log(1 - \\enfFun{D}(\\enfVar{s}, \\enfFun{a}))$.",
    code: ["gail.strength: 0.1", "extrinsic.strength: 1.0"],
    codeNote: "Итоговая награда — взвешенная сумма сигналов `extrinsic` и `gail`.",
  }),
];

// ── 3.5 Деплой ONNX ──────────────────────────────────────────────────────
export const LESSON_3_5_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", { inFormula: "Наблюдение агента в собранной игре — вход ONNX-модели." }),
  sym("t", "variable", {
    name: "время инференса",
    meaning: "$\\enfVar{t}_{\\text{inf}}$ — время одного прямого прохода сети на целевом устройстве.",
    inFormula: "Вместе с числом агентов $N$ должно уложиться в долю $\\enfPar{\\beta}$ кадра.",
  }),
  sym("a", "function", {
    inFormula: "В деплое — $\\arg\\max$ политики (детерминированно), при обучении — сэмпл.",
    code: ["deterministic: true", "--deterministic"],
  }),
  sym("\\pi", "function", {
    inFormula: "Обученная политика, экспортированная в ONNX.",
    code: ["RaceAgent.onnx", "behaviorParameters.SetModel(\"RaceAgent\", modelAsset, InferenceDevice.CPU)"],
  }),
  sym("f", "parameter", {
    name: "частота",
    meaning: "$\\enfPar{f}_{\\text{env}}$ — частота шагов физики, $\\enfPar{f}_{\\text{decision}}$ — частота решений агента, $\\enfPar{f}_{\\text{target}}$ — целевой FPS игры.",
    inFormula: "$\\enfPar{f}_{\\text{decision}} = \\enfPar{f}_{\\text{env}}/\\enfPar{d}$: при 50 Гц физики и $\\enfPar{d} = 5$ агент решает 10 раз в секунду.",
  }),
  sym("d", "parameter", {
    name: "период решений",
    meaning: "Через сколько шагов физики агент запрашивает новое решение. При обучении и в деплое должен совпадать.",
    code: ["Decision Period"],
    codeNote: "Поле компонента Decision Requester.",
  }),
  sym("\\beta", "parameter", {
    name: "доля кадра под ИИ",
    meaning: "Какую часть времени кадра можно отдать инференсу всех агентов, например $\\enfPar{\\beta} = 0{,}2$.",
  }),
];

// ── 3.6 Оптимизация гиперпараметров ──────────────────────────────────────
export const LESSON_3_6_SYMBOLS: SymbolEntry[] = [
  sym("\\boldsymbol{\\lambda}", "parameter", {
    name: "конфигурация гиперпараметров",
    meaning: "Вектор гиперпараметров одного испытания: скорость обучения, $\\enfPar{\\beta}$, `lambd`, размер батча… Пространство поиска — $\\Lambda$.",
    inFormula: "Аргумент чёрного ящика $\\enfFun{f}$; HPO ищет $\\enfPar{\\boldsymbol{\\lambda}}^\\star = \\arg\\max \\enfFun{f}(\\enfPar{\\boldsymbol{\\lambda}})$.",
    code: ["trial.suggest_float(...)", "trial.suggest_int(...)", "trial.suggest_categorical(...)"],
    codeNote: "В Optuna пространство строится «на лету» вызовами `suggest_*` внутри `objective(trial)`.",
  }),
  sym("\\lambda", "parameter", {
    name: "отдельный гиперпараметр",
    meaning: "Одна координата $\\enfPar{\\boldsymbol{\\lambda}}$. Лог-масштаб $\\log_{10}\\enfPar{\\lambda} \\sim \\mathcal{U}$ нужен для величин, меняющихся на порядки.",
    code: ['trial.suggest_float("learning_rate", 1e-5, 1e-3, log=True)'],
  }),
  sym("a", "parameter", { name: "нижняя граница диапазона", meaning: "Левый конец диапазона поиска гиперпараметра.", code: ["1e-5"] }),
  sym("b", "parameter", { name: "верхняя граница диапазона", meaning: "Правый конец диапазона поиска гиперпараметра.", code: ["1e-3"] }),
  sym("f", "function", {
    name: "целевая функция HPO",
    meaning: "$\\enfFun{f}(\\enfPar{\\boldsymbol{\\lambda}})$ — итоговое качество обучения с конфигурацией $\\enfPar{\\boldsymbol{\\lambda}}$ (например, финальная награда). Дорогой зашумлённый чёрный ящик без градиента. $\\enfFun{f}^\\star$ — лучшее значение, найденное к этому моменту.",
    code: ["def objective(trial) -> float", "read_final_reward(...)"],
  }),
  sym("\\ell", "function", {
    name: "плотность «хороших» конфигураций",
    meaning: "В TPE — оценка плотности по испытаниям из лучшей доли $\\enfPar{\\gamma}$.",
    inFormula: "Чем больше $\\enfFun{\\ell}/\\enfFun{g}$, тем выше ожидаемое улучшение $\\mathrm{EI}$.",
    code: ["TPESampler"],
  }),
  sym("g", "function", {
    name: "плотность «плохих» конфигураций",
    meaning: "В TPE — оценка плотности по остальным испытаниям. В разделе о random search та же буква обозначает функцию одной важной координаты: $\\enfFun{f}(\\enfPar{\\boldsymbol{\\lambda}}) \\approx \\enfFun{g}(\\enfPar{\\lambda}_1)$.",
  }),
  sym("p", "function", {
    inFormula: "TPE моделирует $\\enfFun{p}(\\enfPar{\\boldsymbol{\\lambda}} \\mid \\enfTgt{y})$ вместо $\\enfFun{p}(\\enfTgt{y} \\mid \\enfPar{\\boldsymbol{\\lambda}})$ — две плотности $\\enfFun{\\ell}$ и $\\enfFun{g}$.",
  }),
  sym("\\gamma", "parameter", {
    name: "квантиль TPE",
    meaning: "Доля испытаний, считающихся «хорошими»: $\\enfPar{\\gamma} = \\enfFun{p}(\\enfTgt{y} < \\enfTgt{y}^\\star)$. Здесь это не дисконт.",
    code: ["TPESampler(gamma=...)"],
    codeNote: "В Optuna `gamma` — функция от числа испытаний $n$, возвращающая размер «хорошей» группы (по умолчанию $\\min(\\lceil 0{,}1 n \\rceil, 25)$), то есть $\\enfPar{\\gamma} n$.",
  }),
  sym("\\eta", "parameter", {
    name: "фактор сокращения",
    meaning: "Во сколько раз Successive Halving и Hyperband урезают число испытаний на каждой ступени; выживает лучшая $1/\\enfPar{\\eta}$.",
    code: ["reduction_factor=3"],
  }),
  sym("R", "parameter", {
    name: "границы ресурса",
    meaning: "$\\enfPar{R}_{\\min}$ и $\\enfPar{R}_{\\max}$ — минимальный и максимальный бюджет шагов одного испытания в Hyperband.",
    code: ["min_resource=50_000", "max_resource=DEFAULT_MAX_STEPS"],
  }),
  sym("y", "target", {
    name: "наблюдённое качество",
    meaning: "$\\enfTgt{y} = \\enfFun{f}(\\enfPar{\\boldsymbol{\\lambda}})$ — результат испытания; $\\enfTgt{y}^\\star$ — порог, делящий испытания на «хорошие» и «плохие».",
    code: ["return read_final_reward(...)"],
  }),
];

// ── 3.7 Архитектуры нейросетей ───────────────────────────────────────────
export const LESSON_3_7_SYMBOLS: SymbolEntry[] = [
  sym("o", "variable", {
    inFormula: "Наблюдение (лучи, скорость, кадр камеры) — вход энкодера $\\enfFun{f}_\\phi$. В POMDP $\\enfVar{o}_t \\ne \\enfVar{s}_t$.",
  }),
  sym("\\tilde{o}", "variable", {
    name: "стек кадров",
    meaning: "$\\enfVar{\\tilde{o}}_t = (\\enfVar{o}_{t-n+1}, \\dots, \\enfVar{o}_t)$ — последние $n$ наблюдений вместе: дешёвая замена памяти.",
  }),
  sym("s", "variable", { inFormula: "Полное состояние среды, которое агенту может быть не видно." }),
  sym("z", "variable", {
    name: "эмбеддинг наблюдения",
    meaning: "$\\enfVar{z} = \\enfFun{f}_\\phi(\\enfVar{o}) \\in \\mathbb{R}^d$ — выход энкодера, общий вход для головы политики и критика.",
    code: ["hidden_units: 256", "num_layers: 2"],
    codeNote: "Размерность $d$ — это `hidden_units`, глубина MLP-энкодера — `num_layers`.",
  }),
  sym("m", "variable", {
    name: "память LSTM",
    meaning: "$\\enfVar{m}_t$ — скрытое состояние рекуррентного слоя: сводка всей истории наблюдений.",
    code: ["memory_size: 256", "sequence_length: 64"],
    codeNote: "`memory_size` должно быть чётным; блок `memory` включают только в POMDP.",
  }),
  sym("e", "variable", {
    name: "эмбеддинг сущности",
    meaning: "$\\enfVar{e}_i$ — вектор одной видимой машины-соперника; множество таких векторов сжимает слой внимания.",
  }),
  sym("Q", "variable", { name: "матрица запросов", meaning: "Запросы (queries) в слое внимания — линейная проекция эмбеддингов. Не путать с функцией ценности $\\enfOp{Q}$." }),
  sym("K", "variable", { name: "матрица ключей", meaning: "Ключи (keys) в слое внимания; $d_k$ — их размерность." }),
  sym("V", "variable", { name: "матрица значений", meaning: "Значения (values) в слое внимания: усредняются с весами $\\mathrm{softmax}$. Не путать с функцией ценности $\\enfOp{V}$." }),
  sym("\\tau", "variable", {
    inFormula: "В Decision Transformer траектория — последовательность троек $(\\enfTgt{\\hat{R}}_t, \\enfVar{s}_t, \\enfFun{a}_t)$.",
  }),
  sym("a", "function", { inFormula: "Действие на выходе головы $\\enfFun{h}_\\psi$." }),
  sym("\\pi", "function", { inFormula: "Политика: голова поверх эмбеддинга, $\\enfFun{\\pi}(\\enfFun{a} \\mid \\enfVar{z})$." }),
  sym("f", "function", {
    name: "энкодер",
    meaning: "$\\enfFun{f}_\\phi$ — часть сети, превращающая сырое наблюдение в эмбеддинг: MLP, CNN, LSTM или внимание.",
    code: ["vis_encode_type: simple"],
    codeNote: "Для визуальных входов: `simple`, `nature_cnn`, `resnet`, `match3`, `fully_connected`.",
  }),
  sym("h", "function", {
    name: "голова",
    meaning: "$\\enfFun{h}_\\psi$ — небольшая сеть поверх эмбеддинга: выдаёт параметры распределения действий или ценность.",
  }),
  sym("\\sigma", "function", { inFormula: "Нелинейная функция активации между слоями энкодера." }),
  sym("\\mathcal{F}", "function", {
    name: "остаточный блок",
    meaning: "$\\enfFun{\\mathcal{F}}$ — преобразование внутри residual-блока: выход $\\enfVar{z}^{(l)} + \\enfFun{\\mathcal{F}}(\\enfVar{z}^{(l)})$.",
    code: ["vis_encode_type: resnet"],
  }),
  sym("Q", "operator", { inFormula: "Функция ценности действия у критика (в SAC)." }),
  sym("V", "operator", {
    inFormula: "Критик $\\enfOp{V}(\\enfVar{z})$ над тем же эмбеддингом или над своим энкодером.",
    code: ["shared_critic: false"],
  }),
  sym("W", "parameter", { inFormula: "Веса слоя $l$ энкодера; в свёртке — ядро $\\enfPar{W}^{(l)}$." }),
  sym("b", "parameter", { inFormula: "Смещение слоя энкодера." }),
  sym("\\theta", "parameter", { inFormula: "Все веса политики вместе." }),
  sym("R", "target", {
    name: "целевая отдача",
    meaning: "$\\enfTgt{R}^{\\text{target}}$ — отдача, которую мы «заказываем» у Decision Transformer при запуске.",
  }),
  sym("\\hat{R}", "target", {
    name: "отдача-до-конца (return-to-go)",
    meaning: "$\\enfTgt{\\hat{R}}_t$ — сколько награды ещё нужно набрать: заказанная отдача минус уже полученные награды.",
  }),
  sym("r", "target", { inFormula: "Награда шага; вычитается из отдачи-до-конца." }),
];

// ── 3.8 Финальный проект ─────────────────────────────────────────────────
export const LESSON_3_8_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", { inFormula: "Состояние игровой среды проекта." }),
  sym("a", "function", { inFormula: "Действие агента." }),
  sym("\\pi", "function", { inFormula: "Политика агента; цель — максимизировать $\\enfTgt{J}(\\enfFun{\\pi})$.", code: ["trainer_type: ppo"] }),
  sym("\\Phi", "function", {
    inFormula: "Потенциал состояния: добавка $\\enfPar{\\gamma}\\enfFun{\\Phi}(\\enfVar{s}_{t+1}) - \\enfFun{\\Phi}(\\enfVar{s}_t)$ подсказывает направление и не меняет оптимальную политику.",
  }),
  sym("V", "operator", { inFormula: "Функция ценности критика." }),
  sym("Q", "operator", { inFormula: "Функция ценности действия." }),
  sym("\\gamma", "parameter", {
    inFormula: "Дисконт в отдаче и в потенциальном шейпинге — обязательно один и тот же.",
    code: ["gamma: 0.99"],
  }),
  sym("J", "target", { inFormula: "Ожидаемая дисконтированная отдача." }),
  sym("r", "target", {
    inFormula: "Награда шага; $\\enfTgt{r}'_t$ — награда после потенциального шейпинга.",
    code: ["strength: 1.0"],
  }),
];
