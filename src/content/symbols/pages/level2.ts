import { sym } from "../build";
import type { SymbolEntry } from "../types";

/**
 * Словари символов уроков уровня 2 (Policy Gradient, PPO, непрерывные
 * действия, награды, параллельное обучение). Колонка «В коде» ссылается на
 * имена из листингов самих уроков.
 */

// ── 2.1 REINFORCE ─────────────────────────────────────────────────────────
export const LESSON_2_1_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", {
    inFormula: "Состояние CartPole на шаге $t$; от него зависит вероятность действия $\\enfFun{\\pi}_\\theta(\\enfFun{a}_t \\mid \\enfVar{s}_t)$.",
    code: ["state"],
    codeNote: "`state, _ = env.reset()` и `state, reward, term, trunc, _ = env.step(action)`: вектор из 4 чисел (`obs_dim=4`).",
  }),
  sym("a", "function", {
    inFormula: "Действие, которое политика выбрала на шаге $t$; его логарифм вероятности входит в градиент.",
    code: ["action"],
    codeNote: "`action, log_prob = policy.act(state)` — номер действия (0 или 1) и $\\log \\enfFun{\\pi}_\\theta(\\enfFun{a}_t \\mid \\enfVar{s}_t)$.",
  }),
  sym("\\pi", "function", {
    inFormula: "Политика с весами $\\enfPar{\\theta}$: выдаёт вероятности действий. В формуле градиента стоит её логарифм.",
    code: ["PolicyNetwork", "dist = Categorical(probs)", "dist.log_prob(action)"],
    codeNote: "Сеть заканчивается `Softmax`, поэтому выход — распределение по двум действиям.",
  }),
  sym("\\theta", "parameter", {
    inFormula: "Веса политики: по ним берётся градиент $\\enfOp{\\nabla}_\\theta$.",
    code: ["policy.parameters()"],
    codeNote: "`optim.Adam(policy.parameters(), lr=lr)` обновляет $\\enfPar{\\theta}$ после `loss.backward()`.",
  }),
  sym("\\gamma", "parameter", {
    inFormula: "Дисконт в отдаче $\\enfOp{G}_t$: награда через $k$ шагов умножается на $\\enfPar{\\gamma}^{k}$.",
    code: ["gamma=0.99"],
  }),
  sym("r", "target", {
    inFormula: "Награда за шаг $t$ — слагаемое отдачи и целевой функции.",
    code: ["reward", "rewards"],
    codeNote: "В CartPole $\\enfTgt{r}_t = 1$ за каждый шаг, пока шест не упал.",
  }),
  sym("G", "operator", {
    inFormula: "Отдача с шага $t$: $\\enfOp{G}_t = \\sum_{k=t}^{T} \\enfPar{\\gamma}^{k-t} \\enfTgt{r}_k$. Вес, с которым усиливается логарифм вероятности действия.",
    code: ["G = r + gamma * G", "returns"],
    codeNote: "Считается с конца эпизода за один проход; затем `returns` нормализуются (`(returns - mean) / std`) — это грубая замена baseline.",
  }),
  sym("J", "target", {
    inFormula: "Ожидаемая дисконтированная награда политики — то, что REINFORCE максимизирует.",
    code: ["loss = -sum(lp * G ...)"],
    codeNote: "Оптимизатор минимизирует, поэтому в коде `loss` — это $-\\enfTgt{J}$ с точностью до константы.",
  }),
  sym("\\nabla", "operator", {
    inFormula: "Градиент по весам политики: направление, в котором растёт $\\enfTgt{J}$.",
    code: ["loss.backward()"],
  }),
  sym("b", "operator", {
    inFormula: "Базовая линия $\\enfOp{b}(\\enfVar{s})$: вычитается из $\\enfOp{G}_t$, не меняя ожидания градиента, но уменьшая его разброс. Лучший выбор — $\\enfOp{V}^\\pi(\\enfVar{s})$.",
    code: ["returns - returns.mean()"],
    codeNote: "В листинге отдельной сети-критика нет: нормализация отдач играет роль простейшей постоянной базовой линии.",
  }),
  sym("V", "operator", {
    inFormula: "Ценность состояния при политике $\\enfFun{\\pi}$ — оптимальная базовая линия.",
    code: ["critic(state)"],
    codeNote: "В REINFORCE из урока критика нет; он появится в Actor-Critic (урок 2.3).",
  }),
];

// ── 2.2 PPO ───────────────────────────────────────────────────────────────
export const LESSON_2_2_SYMBOLS: SymbolEntry[] = [
  sym("\\mu", "function", {
    name: "среднее действия (голова актёра)",
    meaning: "Выход сети актёра: центр гауссианы, из которой сэмплируется непрерывное действие 3D Ball.",
    code: ["mu = self.actor(obs)"],
  }),
  sym("\\sigma", "function", {
    name: "разброс действия",
    meaning: "Стандартное отклонение гауссовой политики. Обучается как отдельный параметр $\\log \\enfFun{\\sigma}$, не зависящий от состояния.",
    code: ["self.log_std = nn.Parameter(torch.zeros(act_dim))", "std = self.log_std.exp()"],
    codeNote: "Сеть хранит логарифм: экспонента гарантирует, что $\\enfFun{\\sigma} > 0$.",
  }),
  sym("s", "variable", {
    inFormula: "Наблюдение 3D Ball на шаге $t$: вход и актора, и критика.",
    code: ["obs"],
    codeNote: "В `networks.py` — тензор размера `obs_dim=8`.",
  }),
  sym("a", "function", {
    inFormula: "Действие из буфера; для него сравниваются вероятности старой и новой политики.",
    code: ["actions", "action = dist.sample()"],
  }),
  sym("\\pi", "function", {
    inFormula: "Гауссова политика $\\enfFun{\\pi}_\\theta$. $\\enfFun{\\pi}_{\\theta_{\\text{old}}}$ — её копия на момент сбора данных.",
    code: ["model.get_dist(obs)", "Normal(mu, std)"],
    codeNote: "`log_prob = dist.log_prob(action).sum(-1)` — логарифм вероятности многомерного действия.",
  }),
  sym("\\theta", "parameter", {
    inFormula: "Веса актора, которые PPO обновляет по суррогатной функции.",
    code: ["model.parameters()"],
  }),
  sym("\\theta_{\\text{old}}", "parameter", {
    name: "веса старой политики",
    meaning: "Значение $\\enfPar{\\theta}$ в момент, когда собирался rollout. Во время эпох обновления они не меняются.",
    inFormula: "Знаменатель отношения вероятностей.",
    code: ["old_log_probs"],
    codeNote: "Сами старые веса не хранятся: достаточно логарифмов вероятностей, записанных в буфер при сборе.",
  }),
  sym("r", "variable", {
    inFormula: "$\\enfVar{r}_t(\\enfPar{\\theta}) = \\enfFun{\\pi}_\\theta / \\enfFun{\\pi}_{\\theta_{\\text{old}}}$ — насколько изменилась вероятность действия.",
    code: ["ratio = torch.exp(new_log_probs - old_log_probs)"],
  }),
  sym("\\varepsilon", "parameter", {
    inFormula: "Полуширина коридора $[1-\\enfPar{\\varepsilon}, 1+\\enfPar{\\varepsilon}]$, в котором отношение может давать градиент.",
    code: ["clip_param = 0.2", "clip=0.2"],
    codeNote: "`torch.clamp(ratio, 1 - clip, 1 + clip)` — это $\\operatorname{clip}$ из формулы. В конфиге ML-Agents — `epsilon`.",
  }),
  sym("\\hat{A}", "operator", {
    inFormula: "Оценка преимущества: множитель в суррогатной функции. GAE считает её как взвешенную сумму TD-ошибок.",
    code: ["advantages"],
    codeNote: "`compute_gae` возвращает `advantages` и нормализует их.",
  }),
  sym("\\delta", "variable", {
    inFormula: "TD-ошибка шага $t$ — кирпич GAE.",
    code: ["delta = rewards[t] + gamma * next_v * mask - values[t]"],
    codeNote: "`mask = 1.0 - dones[t]` обнуляет будущее после конца эпизода.",
  }),
  sym("\\gamma", "parameter", { code: ["gamma=0.99"], inFormula: "Дисконт в TD-ошибке и в GAE." }),
  sym("\\lambda", "parameter", {
    inFormula: "Вес GAE: при $\\enfPar{\\lambda} = 0$ — одношаговая TD-ошибка, при $\\enfPar{\\lambda} = 1$ — оценка Монте-Карло.",
    code: ["lam=0.95"],
    codeNote: "`gae = delta + gamma * lam * mask * gae`. В ML-Agents — `lambd`.",
  }),
  sym("V", "operator", {
    inFormula: "Критик $\\enfOp{V}_\\phi(\\enfVar{s})$: базовая линия и источник TD-ошибки.",
    code: ["values", "self.critic(obs)"],
  }),
  sym("\\phi", "parameter", {
    inFormula: "Веса критика; по ним минимизируется $\\enfTgt{L}^{\\text{VF}}$.",
    code: ["model.critic"],
    codeNote: "В листинге актор и критик лежат в одной модели `ActorCritic` и обновляются одним оптимизатором.",
  }),
  sym("\\hat{R}", "target", {
    inFormula: "Цель для критика: $\\enfTgt{\\hat{R}}_t = \\enfOp{\\hat{A}}_t + \\enfOp{V}(\\enfVar{s}_t)$.",
    code: ["returns = advantages + values"],
  }),
  sym("r", "target", { inFormula: "Награда в TD-ошибке.", code: ["rewards[t]"] }),
  sym("L", "target", {
    inFormula: "Функции потерь: $\\enfTgt{L}^{\\text{CLIP}}$ (актор), $\\enfTgt{L}^{\\text{VF}}$ (критик) и полная $\\enfTgt{L}^{\\text{PPO}}$.",
    code: ["actor_loss", "critic_loss", "loss"],
    codeNote: "`loss = actor_loss + c1 * critic_loss - c2 * entropy_bonus`, где `actor_loss = -min(surr1, surr2).mean()` — та же формула со знаком минус.",
  }),
  sym("c", "parameter", {
    inFormula: "$\\enfPar{c}_1$ — вес потерь критика, $\\enfPar{c}_2$ — вес энтропийного бонуса.",
    code: ["c1=0.5", "c2=0.01"],
    codeNote: "В ML-Agents роль $\\enfPar{c}_2$ играет `beta`.",
  }),
  sym("H", "operator", {
    inFormula: "Энтропия политики в состоянии: бонус, удерживающий исследование.",
    code: ["dist.entropy().sum(-1)", "entropy_bonus"],
  }),
];

// ── 2.3 Непрерывные действия и Actor-Critic ───────────────────────────────
export const LESSON_2_3_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", {
    inFormula: "Состояние робота; актор и критик получают одно и то же наблюдение.",
    code: ["state", "sensor.AddObservation(...)"],
    codeNote: "В `RobotAgent.cs` наблюдение — относительная позиция цели и скорость (6 чисел).",
  }),
  sym("a", "function", {
    inFormula: "Непрерывное действие — моменты в суставах, сэмпл из гауссианы политики.",
    code: ["action = dist.sample()", "actionBuffers.ContinuousActions"],
    codeNote: "В Python действие обрезается `action.clamp(-1.0, 1.0)`; в Unity приходит в `[-1, 1]` и масштабируется на `maxTorque`.",
  }),
  sym("a^{*}", "function", {
    name: "лучшее действие",
    meaning: "Действие, на котором $\\enfOp{Q}(\\enfVar{s}, \\cdot)$ максимальна. Для непрерывного $\\mathcal{A}$ его нельзя найти перебором.",
    code: ["q_values.argmax()"],
  }),
  sym("\\pi", "function", {
    inFormula: "Актор $\\enfFun{\\pi}_\\theta(\\enfFun{a} \\mid \\enfVar{s}) = \\mathcal{N}(\\enfFun{\\mu}_\\theta(\\enfVar{s}), \\enfFun{\\sigma}_\\theta(\\enfVar{s})^2)$.",
    code: ["dist = Normal(mean, std)"],
  }),
  sym("\\mu", "function", {
    inFormula: "Центр гауссианы действия — выход головы актора.",
    code: ["mean = self.actor_mean(h)"],
  }),
  sym("\\sigma", "function", {
    name: "разброс действия",
    meaning: "Стандартное отклонение гауссианы политики: насколько сильно агент «шумит» вокруг среднего действия.",
    inFormula: "Определяет уровень исследования в непрерывном пространстве.",
    code: ["std = self.actor_log_std.exp()"],
    codeNote: "Учится логарифм `log_std`: экспонента гарантирует $\\enfFun{\\sigma} > 0$.",
  }),
  sym("\\theta", "parameter", { inFormula: "Веса актора.", code: ["self.backbone", "self.actor_mean"] }),
  sym("\\phi", "parameter", { inFormula: "Веса критика $\\enfOp{V}_\\phi$.", code: ["self.critic"] }),
  sym("\\gamma", "parameter", {
    inFormula: "Дисконт в ценностях и TD-ошибке.",
    code: ["gamma: 0.99"],
    codeNote: "В `robot_config.yaml` — `reward_signals.extrinsic.gamma`.",
  }),
  sym("r", "target", {
    inFormula: "Награда шага: штраф за расстояние и бонус за цель.",
    code: ["AddReward(-distance * 0.001f)", "SetReward(1.0f)"],
  }),
  sym("V", "operator", { inFormula: "Ценность состояния; критик $\\enfOp{V}_\\phi$ — её приближение.", code: ["value = self.critic(h)"] }),
  sym("Q", "operator", { inFormula: "Ценность пары «состояние — действие».", code: ["q_net(state)"] }),
  sym("A", "operator", {
    inFormula: "$\\enfOp{A}^\\pi = \\enfOp{Q}^\\pi - \\enfOp{V}^\\pi$: насколько действие лучше среднего.",
    code: ["advantages"],
  }),
  sym("\\hat{A}", "operator", { inFormula: "Оценка преимущества по TD-ошибке или GAE.", code: ["advantages[t]"] }),
  sym("\\delta", "variable", { inFormula: "TD-ошибка критика.", code: ["td_error"] }),
  sym("G", "operator", { inFormula: "Отдача в REINFORCE, которую Actor-Critic заменяет на $\\enfOp{\\hat{A}}_t$.", code: ["returns"] }),
  sym("\\mathcal{L}", "target", { inFormula: "Потери критика $\\mathbb{E}[\\enfVar{\\delta}_t^2]$.", code: ["critic_loss = td_error.pow(2).mean()"] }),
  sym("J", "target", { inFormula: "Цель актора; в SAC — с энтропийным бонусом." }),
  sym("\\nabla", "operator", { code: ["loss.backward()"] }),
  sym("r", "variable", { inFormula: "Отношение вероятностей в PPO.", code: ["ratio"] }),
  sym("\\varepsilon", "parameter", { inFormula: "Ширина коридора обрезки PPO.", code: ["epsilon: 0.2"] }),
  sym("L", "target", { inFormula: "Суррогатная функция PPO.", code: ["actor_loss"] }),
  sym("\\alpha", "parameter", {
    name: "температура энтропии",
    meaning: "Вес энтропии в цели SAC: чем больше $\\enfPar{\\alpha}$, тем сильнее агент поощряется за случайность поведения.",
    inFormula: "Множитель $\\enfOp{\\mathcal{H}}$ в $\\enfTgt{J}(\\enfFun{\\pi})$.",
    code: ["init_entcoef: 0.5"],
    codeNote: "В ML-Agents задаётся начальное значение, дальше SAC подстраивает его сам.",
  }),
  sym("\\mathcal{H}", "operator", { inFormula: "Энтропия политики в состоянии $\\enfVar{s}$.", code: ["dist.entropy()"] }),
];

// ── 2.4 Награды и формирование наград ─────────────────────────────────────
export const LESSON_2_4_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", {
    inFormula: "Состояние; в примере PBRS — положение агента относительно цели.",
    code: ["transform.localPosition", "agent.position"],
  }),
  sym("s'", "variable", {
    inFormula: "Состояние после шага; потенциал считается и для него.",
    code: ["next_position"],
  }),
  sym("a", "function", { inFormula: "Действие на переходе $(\\enfVar{s}, \\enfFun{a}, \\enfVar{s}')$.", code: ["action = agent.act(state)"] }),
  sym("r", "target", {
    inFormula: "Награда шага: разреженная ($+1$ за успех) или плотная (штраф за расстояние).",
    code: ["AddReward(1.0f)", "AddReward(-dist * 0.001f)"],
  }),
  sym("R", "target", {
    inFormula: "Исходная функция награды $\\enfTgt{R}$ и сформированная $\\enfTgt{R}' = \\enfTgt{R} + \\enfFun{F}$.",
    code: ["original_reward", "shaped_reward"],
  }),
  sym("\\gamma", "parameter", {
    inFormula: "Дисконт: в отдаче и в формуле формирования $\\enfPar{\\gamma}\\enfFun{\\Phi}(\\enfVar{s}') - \\enfFun{\\Phi}(\\enfVar{s})$.",
    code: ["gamma = 0.99", "gamma ** t"],
  }),
  sym("G", "operator", {
    inFormula: "Дисконтированная сумма наград; чем дальше награда, тем меньше её вклад.",
    code: ["total_reward += (gamma ** t) * reward"],
  }),
  sym("\\Phi", "function", {
    inFormula: "Потенциал «хорошести» состояния; в примере — расстояние до цели со знаком минус.",
    code: ["phi_current = -np.linalg.norm(...)", "phi_next"],
  }),
  sym("F", "function", {
    inFormula: "Добавка к награде; сумма добавок по эпизоду сокращается до $\\enfPar{\\gamma}^T\\enfFun{\\Phi}(\\enfVar{s}_T) - \\enfFun{\\Phi}(\\enfVar{s}_0)$.",
    code: ["gamma * phi_next - phi_current", "shapingReward"],
    codeNote: "В `RobotAgent.cs` добавка `previousDistance - currentDistance` — это $\\enfFun{\\Phi}(\\enfVar{s}') - \\enfFun{\\Phi}(\\enfVar{s})$ при $\\enfPar{\\gamma} = 1$.",
  }),
  sym("\\pi", "function", { inFormula: "$\\enfFun{\\pi}^*_{R'} = \\enfFun{\\pi}^*_{R}$: формирование потенциалом не меняет оптимальную политику." }),
  sym("\\theta", "parameter", { inFormula: "Веса политики в формуле градиента." }),
  sym("J", "target", { inFormula: "Цель политики; её градиент затухает как $\\enfPar{\\gamma}^t$ для далёких наград." }),
  sym("\\nabla", "operator"),
];

// ── 2.5 Параллельное обучение ─────────────────────────────────────────────
export const LESSON_2_5_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", { inFormula: "Состояние в одной из параллельных сред.", code: ["obs"] }),
  sym("a", "function", { inFormula: "Действие агента в своей копии среды." }),
  sym("\\theta", "parameter", {
    inFormula: "Общие веса политики: все копии среды собирают опыт для одной сети.",
    code: ['PPO("MlpPolicy", envs)'],
  }),
  sym("\\gamma", "parameter", { inFormula: "Дисконт в цели $\\enfTgt{J}$." }),
  sym("r", "target", { inFormula: "Награда шага в траектории $\\tau$." }),
  sym("J", "target", { inFormula: "Ожидаемая отдача политики." }),
  sym("\\nabla", "operator", {
    inFormula: "Оценка градиента — среднее по $N$ траекториям; параллельные среды увеличивают $N$ и снижают шум.",
    code: ["model.learn(total_timesteps=500_000)"],
  }),
  sym("A", "operator", { inFormula: "Преимущество — вес в оценке градиента." }),
  sym("\\hat{A}", "operator", { inFormula: "Оценка преимущества в суррогатной функции PPO." }),
  sym("r", "variable", { inFormula: "Отношение вероятностей PPO.", code: ["ratio"] }),
  sym("\\varepsilon", "parameter", { inFormula: "Коридор обрезки PPO.", code: ["epsilon: 0.2"] }),
  sym("L", "target", { inFormula: "Суррогатная функция PPO." }),
  sym("N", "neutral", {
    name: "число траекторий или сред",
    meaning: "Сколько траекторий усредняется в оценке градиента; в формулах размера буфера $N_{\\text{envs}}$ — число параллельных копий среды.",
    code: ["num_envs = 8", "--num-envs=8"],
  }),
];
