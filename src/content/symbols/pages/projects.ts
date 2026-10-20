import { sym } from "../build";
import type { SymbolEntry } from "../types";

/** Словари символов проектов: колонка «В коде» — имена из их листингов. */

// ── Проект: Frozen Lake (Q-learning) ─────────────────────────────────────
export const FROZEN_LAKE_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", {
    inFormula: "Номер клетки озера (0–15); $\\enfVar{s}'$ — клетка после шага.",
    code: ["state", "new_state"],
  }),
  sym("a", "function", {
    inFormula: "Действие: влево, вниз, вправо или вверх. Под $\\max_{a'}$ и $\\arg\\max_a$ буква перебирает все действия и остаётся без цвета.",
    code: ["action", "np.argmax(q_table[state])"],
  }),
  sym("Q", "operator", {
    inFormula: "Q-таблица 16×4: ожидаемая будущая награда за действие в клетке.",
    code: ["q_table[state, action]", "q_table = np.zeros((n_states, n_actions))"],
  }),
  sym("r", "target", {
    inFormula: "Награда шага: 1 за подарок, 0 за всё остальное.",
    code: ["reward"],
  }),
  sym("\\alpha", "parameter", {
    inFormula: "Скорость обучения — доля TD-ошибки, прибавляемая к старой оценке.",
    code: ["alpha = 0.8", "q_table[state, action] += alpha * td_error"],
  }),
  sym("\\gamma", "parameter", {
    inFormula: "Дисконт будущей ценности в TD-цели.",
    code: ["gamma = 0.95", "td_target = reward + gamma * np.max(q_table[new_state]) * (1 - done)"],
    codeNote: "Множитель `(1 - done)` обнуляет будущее, если эпизод закончился в проруби или у подарка.",
  }),
  sym("\\varepsilon", "parameter", {
    inFormula: "Вероятность случайного действия в ε-жадной политике; затухает от `epsilon_max` к `epsilon_min`.",
    code: ["epsilon", "epsilon_max = 1.0", "epsilon_min = 0.01", "decay_rate = 0.001"],
  }),
];

// ── Проект 2: Охотник (PPO, непрерывное управление) ──────────────────────
export const PROJECT_2_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", {
    inFormula: "Вектор наблюдений охотника: позиция цели, скорость, лучи.",
    code: ["sensor.AddObservation(...)"],
  }),
  sym("x", "variable", {
    inFormula: "Сырой признак наблюдения (расстояние, скорость) до нормировки; $\\enfVar{x}_{\\max}$ — его масштаб.",
  }),
  sym("\\hat{x}", "variable", {
    name: "нормированный признак",
    meaning: "$\\enfVar{\\hat{x}} = \\operatorname{clip}(\\enfVar{x}/\\enfVar{x}_{\\max}, -1, 1)$ — признак в диапазоне $[-1, 1]$, удобном для сети.",
    code: ["NormalizedDeltaToTarget()", "NormalizedVelocity()", "NormalizedYaw()"],
    codeNote: "Каждая функция возвращает уже нормированный признак; `normalize: true` в YAML дополнительно приводит входы к нулевому среднему и единичной дисперсии.",
  }),
  sym("\\delta", "variable", {
    inFormula: "TD-ошибка критика — кирпичик оценки преимущества GAE.",
  }),
  sym("r", "variable", {
    inFormula: "Отношение вероятностей новой и старой политики в PPO.",
  }),
  sym("a", "function", {
    inFormula: "Непрерывное действие (тяга, поворот); перед отправкой в физику обрезается до $[-1, 1]$.",
    code: ["actions.ContinuousActions[0]", "Mathf.Clamp(..., -1f, 1f)"],
  }),
  sym("\\pi", "function", {
    inFormula: "Гауссова политика: среднее $\\enfFun{\\mu}_\\theta(\\enfVar{s})$ и разброс $\\enfFun{\\sigma}_\\theta(\\enfVar{s})$.",
    code: ["trainer_type: ppo"],
  }),
  sym("\\mu", "function", { inFormula: "Среднее действие — выход головы политики." }),
  sym("\\sigma", "function", { inFormula: "Разброс действий — вторая голова политики." }),
  sym("\\Phi", "function", {
    name: "потенциал состояния",
    meaning: "$\\enfFun{\\Phi}(\\enfVar{s}) = -\\enfFun{d}(\\enfVar{s})/\\enfPar{d}_{\\max}$ — минус нормированное расстояние до цели: чем ближе, тем выше.",
    code: ["phi = -Distance() / maxDist", "prevPotential"],
  }),
  sym("F", "function", {
    name: "добавка потенциального шейпинга",
    meaning: "$\\enfFun{F}(\\enfVar{s}, \\enfVar{s}') = \\enfPar{\\gamma}\\enfFun{\\Phi}(\\enfVar{s}') - \\enfFun{\\Phi}(\\enfVar{s})$. Сумма таких добавок телескопируется, поэтому оптимальная политика не меняется.",
    code: ["shaping = 0.99f * phi - prevPotential", "AddReward(shaping)"],
  }),
  sym("d", "function", {
    name: "расстояние до цели",
    meaning: "$\\enfFun{d}(\\enfVar{s})$ — расстояние от охотника до жертвы в состоянии $\\enfVar{s}$.",
    code: ["Distance()"],
  }),
  sym("d", "parameter", {
    name: "масштаб расстояния",
    meaning: "$\\enfPar{d}_{\\max}$ — наибольшее расстояние на арене; делит $\\enfFun{d}(\\enfVar{s})$, чтобы потенциал лежал в $[-1, 0]$.",
    code: ["maxDist"],
  }),
  sym("A", "operator", { inFormula: "Преимущество действия: насколько оно лучше среднего в этом состоянии." }),
  sym("\\hat{A}", "operator", { inFormula: "Оценка преимущества GAE — вес в суррогатной функции PPO." }),
  sym("V", "operator", { inFormula: "Ценность состояния — выход критика." }),
  sym("Q", "operator", { inFormula: "Ценность действия в определении преимущества." }),
  sym("G", "operator", { inFormula: "Дисконтированная отдача." }),
  sym("\\gamma", "parameter", {
    inFormula: "Дисконт в отдаче, GAE и потенциальном шейпинге — везде одно и то же значение.",
    code: ["gamma: 0.99", "0.99f * phi"],
  }),
  sym("\\lambda", "parameter", { inFormula: "Параметр GAE: баланс смещения и дисперсии.", code: ["lambd: 0.95"] }),
  sym("\\varepsilon", "parameter", { inFormula: "Радиус обрезки отношения вероятностей в $\\enfTgt{L}^{\\mathrm{CLIP}}$.", code: ["epsilon: 0.2"] }),
  sym("\\theta", "parameter", { inFormula: "Веса политики." }),
  sym("c", "parameter", { inFormula: "Вес слагаемого в общей функции потерь PPO." }),
  sym("L", "target", { inFormula: "Суррогатная функция PPO с обрезкой.", code: ["beta: 5.0e-3"], codeNote: "`beta` — вес энтропийного бонуса, добавляемого к $\\enfTgt{L}^{\\mathrm{CLIP}}$." }),
  sym("r", "target", {
    inFormula: "Награда шага: шейпинг + штраф за время + бонус за поимку.",
    code: ["AddReward(-1f / MaxStep)", "AddReward(+1.0f)"],
  }),
  sym("R", "target", { inFormula: "Награда в определении отдачи." }),
];

// ── Проект 3: Гоночный агент ─────────────────────────────────────────────
export const PROJECT_3_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", {
    inFormula: "Вектор наблюдений болида: скорость, угловая скорость, направление на чекпоинт, лучи.",
    code: ["CollectObservations(VectorSensor sensor)"],
  }),
  sym("v", "variable", {
    name: "скорость болида",
    meaning: "$\\enfVar{v}_t$ — продольная скорость; $\\enfVar{v}_{\\max}$ — ограничение скорости, на которое она нормируется.",
    code: ["LocalVelocity.z", "_maxSpeed = 25f", "speedRatio"],
  }),
  sym("\\tilde{v}", "variable", { name: "нормированная скорость", meaning: "$\\enfVar{v}/\\enfVar{v}_{\\max}$ — скорость в долях максимума.", code: ["speedNorm"] }),
  sym("\\omega", "variable", { name: "угловая скорость", meaning: "Скорость поворота болида вокруг вертикальной оси.", code: ["_car.AngularVelocity.y"] }),
  sym("\\tilde{\\omega}", "variable", { name: "нормированная угловая скорость", meaning: "$\\enfVar{\\omega}/\\enfVar{\\omega}_{\\max}$.", code: ["Mathf.Clamp(_car.AngularVelocity.y / 5f, -1f, 1f)"] }),
  sym("d", "variable", { name: "расстояние до чекпоинта", meaning: "$\\enfVar{d}_{\\text{cp}}$ — расстояние до следующего чекпоинта, нормированное и обрезанное до 1.", code: ["Mathf.Clamp01(dist / 50f)"] }),
  sym("\\mathbf{f}", "variable", { name: "вектор «вперёд» болида", meaning: "Единичный вектор направления корпуса.", code: ["transform.forward"] }),
  sym("\\mathbf{d}", "variable", { name: "направление на чекпоинт", meaning: "Единичный вектор от болида к следующему чекпоинту.", code: ["directionToTarget", "toCp"] }),
  sym("\\delta", "variable", { inFormula: "TD-ошибка критика в GAE." }),
  sym("r", "variable", { inFormula: "Отношение вероятностей PPO." }),
  sym("x", "variable", { inFormula: "Вход $\\tanh$: при $|\\enfVar{x}| \\gtrsim 3$ функция насыщается и градиент почти пропадает." }),
  sym("a", "function", {
    inFormula: "Действие: руль, газ, тормоз. $\\Delta \\enfFun{a}^{\\text{steer}}_t$, $\\Delta \\enfFun{a}^{\\text{gas}}_t$ — изменения руля и газа за шаг.",
    code: ["actions.ContinuousActions[0]", "actions.ContinuousActions[1]", "steerJerk", "accelJerk"],
  }),
  sym("\\delta", "function", {
    name: "угол поворота руля",
    meaning: "Управляющее действие $\\enfFun{\\delta} \\in [-\\enfPar{\\delta}_{\\max}, \\enfPar{\\delta}_{\\max}]$; не путать с TD-ошибкой $\\enfVar{\\delta}_t$.",
    code: ["steering = Mathf.Clamp(actions.ContinuousActions[0], -1f, 1f)"],
  }),
  sym("\\delta", "parameter", { name: "предельный угол руля", meaning: "$\\enfPar{\\delta}_{\\max}$ — физическое ограничение поворота колёс." }),
  sym("u", "function", {
    name: "газ и тормоз",
    meaning: "$\\enfFun{u}_{\\text{accel}}, \\enfFun{u}_{\\text{brake}} \\in [0, 1]$ — нормированные силы тяги и торможения.",
    code: ["acceleration", "braking"],
  }),
  sym("\\pi", "function", { inFormula: "Политика: гауссова для руля и газа, softmax — для дискретного варианта." }),
  sym("\\mu", "function", { inFormula: "Среднее гауссовой политики." }),
  sym("\\sigma", "function", { inFormula: "Разброс гауссовой политики." }),
  sym("\\phi", "function", { name: "логиты политики", meaning: "$\\enfFun{\\phi}_\\theta(\\enfVar{s})$ — выход сети до softmax в дискретном варианте." }),
  sym("P", "function", { inFormula: "Функция переходов MDP гонки — физика Unity." }),
  sym("V", "operator", { inFormula: "Ценность состояния; $\\enfOp{V}_{\\text{soft}}$ — с энтропийным бонусом (SAC)." }),
  sym("Q", "operator", { inFormula: "Ценность действия; в SAC — два критика $\\enfOp{Q}_{\\phi_1}, \\enfOp{Q}_{\\phi_2}$." }),
  sym("\\hat{A}", "operator", { inFormula: "Оценка преимущества GAE." }),
  sym("H", "operator", { inFormula: "Энтропия политики в функции потерь PPO.", code: ["beta: 5.0e-3"] }),
  sym("\\mathcal{H}", "operator", { inFormula: "Энтропия политики в цели SAC." }),
  sym("\\nabla", "operator", { inFormula: "Градиент цели политики SAC по $\\enfPar{\\theta}$." }),
  sym("\\gamma", "parameter", { inFormula: "Дисконт.", code: ["gamma: 0.99"] }),
  sym("\\lambda", "parameter", { inFormula: "Параметр GAE.", code: ["lambd: 0.95"] }),
  sym("\\varepsilon", "parameter", { inFormula: "Радиус обрезки PPO.", code: ["epsilon: 0.2"] }),
  sym("\\theta", "parameter", { inFormula: "Веса политики." }),
  sym("\\phi", "parameter", { name: "веса критиков SAC", meaning: "Параметры Q-сетей $\\enfOp{Q}_{\\phi_1}, \\enfOp{Q}_{\\phi_2}$." }),
  sym("\\bar{\\phi}", "parameter", { inFormula: "Веса target-критиков SAC.", code: ["tau: 0.005"] }),
  sym("\\alpha", "parameter", { name: "температура SAC", meaning: "Вес энтропии в цели SAC; подстраивается автоматически.", code: ["init_entcoef: 0.5"] }),
  sym("\\tau", "parameter", { inFormula: "Шаг мягкого обновления target-критиков.", code: ["tau: 0.005"] }),
  sym("c", "parameter", { inFormula: "$\\enfPar{c}_1, \\enfPar{c}_2$ — веса ошибки критика и энтропии в функции потерь PPO." }),
  sym("w", "parameter", {
    name: "веса слагаемых награды",
    meaning: "$\\enfPar{w}_{\\text{speed}}$, $\\enfPar{w}_{\\text{orient}}$, $\\enfPar{w}_{\\text{time}}$, $\\enfPar{w}_{\\text{smooth}}$ — вклад скорости, ориентации, штрафа за время и штрафа за рывки.",
    code: ["_speedRewardCoeff = 0.001f", "_orientationCoeff = 0.0005f", "_timePenalty = -0.0005f", "_smoothnessCoeff = 0.0002f"],
  }),
  sym("k", "parameter", {
    name: "коэффициенты сонаправленности",
    meaning: "$\\enfPar{k}_+$ — масштаб награды за движение к чекпоинту, $\\enfPar{k}_-$ — штрафа за движение от него.",
    code: ["alignment * speedRatio * 0.04f", "alignment * 0.02f"],
  }),
  sym("J", "target", { inFormula: "Ожидаемая дисконтированная отдача (в SAC — с энтропией)." }),
  sym("L", "target", { inFormula: "Функция потерь PPO: $\\enfTgt{L}^{\\text{CLIP}}$ и полная $\\enfTgt{L}^{\\text{PPO}}$." }),
  sym("R", "target", {
    inFormula: "Компоненты награды: $\\enfTgt{R}_{\\text{cp}}$ за чекпоинт, $\\enfTgt{R}_{\\text{coll}}$ за стену, $\\enfTgt{R}_{\\text{final}}$ за финиш.",
    code: ["_checkpointReward = 1.0f", "_collisionPenalty = -1.0f"],
  }),
  sym("r", "target", { inFormula: "Награда шага — сумма всех компонент.", code: ["AddReward(...)"] }),
  sym("y", "target", { inFormula: "TD-цель критиков SAC." }),
];

// ── Демо: FoodCollector, REINFORCE + baseline ────────────────────────────
export const DEMO_PROJECT_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", { inFormula: "Наблюдение агента FoodCollector.", code: ["obs"] }),
  sym("\\tau", "variable", { inFormula: "Траектория эпизода; цель — средняя отдача по траекториям." }),
  sym("a", "function", {
    inFormula: "Действие: три непрерывные компоненты и одна дискретная.",
    code: ["c_act", "d_acts"],
  }),
  sym("\\tilde{a}", "function", {
    name: "сырой сэмпл до обрезки",
    meaning: "$\\enfFun{\\tilde{a}} \\sim \\mathcal{N}(\\enfPar{\\mu}, \\enfPar{\\sigma}^2)$ — действие до `clamp`. Логарифм вероятности надо считать именно по нему.",
    code: ["c_raw = c_dist.sample()", "raw_action"],
  }),
  sym("\\pi", "function", {
    inFormula: "Политика: произведение гауссовой части (непрерывные действия) и категориальной (дискретные).",
    code: ["Normal(c_mean, c_std)", "Categorical(logits=l)"],
  }),
  sym("p", "function", { inFormula: "Вероятность или плотность в выкладках." }),
  sym("\\mu", "parameter", { inFormula: "Среднее гауссовой части политики.", code: ["c_mean"] }),
  sym("\\sigma", "parameter", { inFormula: "Стандартное отклонение гауссовой части.", code: ["c_std"] }),
  sym("G", "operator", {
    inFormula: "Отдача до конца эпизода (reward-to-go).",
    code: ["discounted_returns(rewards, gamma)", "G = r + gamma * G"],
  }),
  sym("A", "operator", { inFormula: "Преимущество: отдача минус базовая линия критика.", code: ["adv = ret_t - val_t.detach()"] }),
  sym("V", "operator", { inFormula: "Базовая линия — ценность состояния от критика.", code: ["val"] }),
  sym("H", "operator", { inFormula: "Энтропия политики: её вычитание из потерь поощряет исследование.", code: ["ent", "e_bon = ent_t.mean()"] }),
  sym("\\nabla", "operator", { inFormula: "Градиент цели по весам политики.", code: ["loss.backward()"] }),
  sym("\\gamma", "parameter", { inFormula: "Дисконт в отдаче.", code: ["GAMMA = 0.99"] }),
  sym("\\alpha", "parameter", { inFormula: "Вес ошибки критика в общей функции потерь.", code: ["VALUE_COEFF = 0.5"] }),
  sym("\\beta", "parameter", { inFormula: "Вес энтропийного бонуса.", code: ["ENTROPY_COEFF = 0.02"] }),
  sym("c", "parameter", { inFormula: "$\\enfPar{c}_1, \\enfPar{c}_2$ — те же веса в обозначениях PPO.", code: ["VALUE_COEFF", "ENTROPY_COEFF"] }),
  sym("J", "target", { inFormula: "Средняя отдача политики — что максимизирует REINFORCE." }),
  sym("L", "target", {
    inFormula: "Функции потерь: политики, критика и общая.",
    code: ["p_loss = -(lp_t * adv).mean()", "v_loss = mse_loss(val_t, ret_t.detach())", "loss = p_loss + VALUE_COEFF * v_loss - ENTROPY_COEFF * e_bon"],
  }),
  sym("R", "target", { inFormula: "Суммарная награда траектории." }),
  sym("r", "target", { inFormula: "Награда шага.", code: ["buf_rew"] }),
];
