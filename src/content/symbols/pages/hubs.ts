import { sym } from "../build";
import type { SymbolEntry } from "../types";

/**
 * Словари символов хабов. У хабов с кодом (PPO, PyTorch, FCA) — таблица
 * «формула ↔ код»; у хабов без листингов (SAC, DQN, A3C, визуализации) —
 * только словарь для всплывающих пояснений.
 */

// ── Хаб PPO ──────────────────────────────────────────────────────────────
export const PPO_HUB_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", { inFormula: "Состояние в шаге траектории.", code: ["obs"] }),
  sym("r", "variable", {
    inFormula: "$\\enfVar{r}_t(\\enfPar{\\theta})$ — во сколько раз новая политика вероятнее старой выбирает то же действие.",
    code: ["ratio = torch.exp(new_log_probs - old_log_probs)"],
  }),
  sym("\\delta", "variable", {
    inFormula: "TD-ошибка шага — слагаемое GAE.",
    code: ["delta = rewards[t] + gamma * next_value * (1 - dones[t]) - values[t]"],
  }),
  sym("a", "function", { inFormula: "Действие, выбранное политикой.", code: ["actions"] }),
  sym("\\pi", "function", {
    inFormula: "Политика $\\enfFun{\\pi}_\\theta$; в коде хранится логарифм вероятности действия.",
    code: ["new_log_probs", "old_log_probs"],
  }),
  sym("\\hat{A}", "operator", {
    inFormula: "Оценка преимущества GAE — вес в суррогатной функции.",
    code: ["advantages", "compute_gae(rewards, values, dones)"],
  }),
  sym("A", "operator", { inFormula: "Преимущество в градиенте политики.", code: ["advantages"] }),
  sym("V", "operator", { inFormula: "Ценность состояния — выход критика.", code: ["values", "next_value"] }),
  sym("\\nabla", "operator", { inFormula: "Градиент цели по весам политики.", code: ["loss.backward()"] }),
  sym("\\theta", "parameter", { inFormula: "Веса политики.", code: ["model.parameters()"] }),
  sym("\\varepsilon", "parameter", {
    inFormula: "Радиус обрезки: отношение $\\enfVar{r}_t$ держится в $[1 - \\enfPar{\\varepsilon}, 1 + \\enfPar{\\varepsilon}]$.",
    code: ["clip_eps=0.2", "epsilon=0.2", "torch.clamp(ratio, 1 - epsilon, 1 + epsilon)"],
  }),
  sym("\\gamma", "parameter", { inFormula: "Дисконт в TD-ошибке и GAE.", code: ["gamma=0.99"] }),
  sym("\\lambda", "parameter", {
    inFormula: "Параметр GAE: $\\enfPar{\\lambda} = 0$ — одношаговая оценка, $\\enfPar{\\lambda} = 1$ — Монте-Карло.",
    code: ["lam=0.95"],
  }),
  sym("J", "target", { inFormula: "Ожидаемая отдача политики." }),
  sym("L", "target", {
    inFormula: "Суррогатная функция PPO; в коде её минимизируют со знаком минус.",
    code: ["actor_loss = -torch.min(surr1, surr2).mean()", "loss = actor_loss + 0.5 * critic_loss - 0.01 * entropy"],
  }),
  sym("r", "target", { inFormula: "Награда шага в TD-ошибке.", code: ["rewards[t]"] }),
];

// ── Хаб PyTorch: Q-learning и DQN на Taxi ────────────────────────────────
export const PYTORCH_HUB_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", { inFormula: "Состояние Taxi; $\\enfVar{s}'$ — следующее.", code: ["state", "next_state"] }),
  sym("a", "function", { inFormula: "Выбранное действие; под $\\max_{a'}$ буква перебирает все действия.", code: ["action", "choose_action(state, epsilon)"] }),
  sym("Q", "operator", {
    inFormula: "Ценность действия: в табличном методе — ячейка таблицы, в DQN — выход сети.",
    code: ["q_table[state, action]", "q_values = policy_net(s).gather(1, a.unsqueeze(1))", "target_net(ns).max(dim=1)[0]"],
    codeNote: "$\\enfOp{Q}_{\\text{target}}$ — отдельная target-сеть, копия весов раз в `TARGET_UPDATE` эпизодов.",
  }),
  sym("\\alpha", "parameter", { inFormula: "Скорость обучения табличного Q-learning.", code: ["alpha = 0.1"] }),
  sym("\\gamma", "parameter", { inFormula: "Дисконт.", code: ["gamma = 0.99", "GAMMA = 0.99"] }),
  sym("\\varepsilon", "parameter", {
    inFormula: "Вероятность случайного действия; после эпизода умножается на $\\enfPar{\\varepsilon}_{\\text{decay}}$, но не падает ниже $\\enfPar{\\varepsilon}_{\\min}$.",
    code: ["epsilon = 1.0", "epsilon_min = 0.01", "epsilon_decay = 0.999"],
  }),
  sym("\\theta", "parameter", { inFormula: "Веса Q-сети.", code: ["policy_net.parameters()"] }),
  sym("y", "target", {
    inFormula: "TD-цель DQN; множитель $(1 - \\text{done})$ обнуляет будущее в конце эпизода.",
    code: ["target = r + GAMMA * next_q * (1 - d)"],
  }),
  sym("L", "target", { inFormula: "Среднеквадратичная ошибка между $\\enfOp{Q}_\\theta$ и целью $\\enfTgt{y}$.", code: ["loss = loss_fn(q_values, target)", "nn.MSELoss()"] }),
  sym("r", "target", { inFormula: "Награда шага.", code: ["reward", "r"] }),
];

// ── Хаб FCA ──────────────────────────────────────────────────────────────
export const FCA_HUB_SYMBOLS: SymbolEntry[] = [
  sym("\\mathbb{K}", "neutral", {
    name: "формальный контекст",
    meaning: "Тройка $\\mathbb{K} = (G, M, \\enfFun{I})$: объекты, признаки и отношение «объект обладает признаком».",
    code: ["ctx = Context(objects, attributes, table)"],
  }),
  sym("G", "neutral", { name: "множество объектов", meaning: "Объекты контекста — в примере конфигурации гиперпараметров.", code: ["objects"] }),
  sym("M", "neutral", { name: "множество признаков", meaning: "Признаки объектов — в примере свойства запуска: быстрая сходимость, высокая награда…", code: ["attributes"] }),
  sym("I", "function", {
    name: "отношение инцидентности",
    meaning: "$(g, m) \\in \\enfFun{I}$ — объект $g$ обладает признаком $m$. Бинарная таблица «объекты × признаки».",
    code: ["table"],
  }),
  sym("A", "variable", {
    name: "набор объектов",
    meaning: "$\\enfVar{A} \\subseteq G$; $\\enfVar{A}'$ — все признаки, общие для всех объектов из $\\enfVar{A}$. Для понятия $(\\enfVar{A}, \\enfVar{B})$ это объём.",
    code: ["concept.extent"],
  }),
  sym("B", "variable", {
    name: "набор признаков",
    meaning: "$\\enfVar{B} \\subseteq M$; $\\enfVar{B}'$ — все объекты, обладающие всеми признаками из $\\enfVar{B}$. Для понятия $(\\enfVar{A}, \\enfVar{B})$ это содержание.",
    code: ["concept.intent"],
  }),
];

// ── Хабы без листингов: только словари для пояснений ─────────────────────
export const SAC_HUB_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", { inFormula: "Состояние среды." }),
  sym("a", "function", { inFormula: "Непрерывное действие из стохастической политики." }),
  sym("\\pi", "function", { inFormula: "Стохастическая политика; SAC максимизирует её энтропию вместе с наградой." }),
  sym("Q", "operator", { inFormula: "Мягкая ценность действия; два критика $\\enfOp{Q}_{\\phi_1}, \\enfOp{Q}_{\\phi_2}$ и их target-копии." }),
  sym("V", "operator", { inFormula: "Мягкая ценность состояния: $\\mathbb{E}[\\enfOp{Q} - \\enfPar{\\alpha} \\log \\enfFun{\\pi}]$." }),
  sym("\\mathcal{H}", "operator", { inFormula: "Энтропия политики." }),
  sym("Z", "operator", { inFormula: "Нормировка распределения $\\exp(\\enfOp{Q})$." }),
  sym("D", "operator", { inFormula: "Расхождение Кульбака — Лейблера." }),
  sym("\\alpha", "parameter", { name: "температура", meaning: "Вес энтропии в цели SAC: больше — больше исследования.", code: ["init_entcoef"], codeNote: "В ML-Agents задаётся стартовое значение; дальше $\\enfPar{\\alpha}$ подстраивается." }),
  sym("\\phi", "parameter", { name: "веса критиков", meaning: "Параметры Q-сетей $\\enfOp{Q}_{\\phi_1}, \\enfOp{Q}_{\\phi_2}$." }),
  sym("\\bar{\\phi}", "parameter", { inFormula: "Веса target-критиков." }),
  sym("\\tau", "parameter", { inFormula: "Шаг мягкого обновления target-сетей.", code: ["tau: 0.005"] }),
  sym("\\gamma", "parameter", { inFormula: "Дисконт." }),
  sym("J", "target", { inFormula: "Цель SAC: награда плюс энтропийный бонус." }),
  sym("r", "target", { inFormula: "Награда шага." }),
];

export const DQN_HUB_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", { inFormula: "Состояние среды." }),
  sym("p", "variable", { name: "приоритет перехода", meaning: "$\\enfVar{p}_i = |\\enfVar{\\delta}_i| + \\enfPar{\\varepsilon}$: чем больше ошибка, тем чаще переход берётся из буфера." }),
  sym("w", "variable", { name: "вес важности", meaning: "$\\enfVar{w}_i$ исправляет смещение от неравномерной выборки в приоритетном буфере." }),
  sym("\\delta", "variable", { inFormula: "TD-ошибка перехода." }),
  sym("a", "function", { inFormula: "Действие; под $\\max$ и $\\arg\\max$ буква перебирает все действия." }),
  sym("P", "function", { name: "вероятность выбора перехода", meaning: "$\\enfFun{P}(i) = \\enfVar{p}_i^\\alpha / \\sum_k \\enfVar{p}_k^\\alpha$ — вероятность взять переход $i$ из приоритетного буфера." }),
  sym("Q", "operator", { inFormula: "Ценность действия — выход Q-сети." }),
  sym("V", "operator", { inFormula: "Ценность состояния в Dueling DQN." }),
  sym("A", "operator", { inFormula: "Преимущество в Dueling DQN." }),
  sym("\\theta", "parameter", { inFormula: "Веса онлайн-сети; $\\enfPar{\\theta}^-$ — веса target-сети." }),
  sym("\\alpha", "parameter", { name: "скорость обучения; степень приоритизации", meaning: "В Q-обновлении — скорость обучения. В приоритетном буфере — показатель степени: $\\enfPar{\\alpha} = 0$ даёт равномерную выборку. В Dueling DQN — веса головы преимущества." }),
  sym("\\beta", "parameter", { name: "поправка важности; веса головы ценности", meaning: "В приоритетном буфере — степень коррекции весов важности. В Dueling DQN — веса головы $\\enfOp{V}$." }),
  sym("\\gamma", "parameter", { inFormula: "Дисконт." }),
  sym("\\varepsilon", "parameter", { inFormula: "Малая добавка к приоритету, чтобы переход с нулевой ошибкой не пропал из выборки." }),
  sym("L", "target", { inFormula: "Функция потерь DQN — квадрат TD-ошибки." }),
  sym("Y", "target", { name: "цель Double DQN", meaning: "Действие выбирает онлайн-сеть, а оценивает target-сеть — так снижается переоценка." }),
  sym("r", "target", { inFormula: "Награда шага." }),
];

export const A3C_HUB_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", { inFormula: "Состояние среды у отдельного воркера." }),
  sym("a", "function", { inFormula: "Действие, выбранное политикой." }),
  sym("\\pi", "function", { inFormula: "Политика (актёр)." }),
  sym("A", "operator", { inFormula: "Преимущество: одношаговая оценка через TD-ошибку." }),
  sym("V", "operator", { inFormula: "Ценность состояния (критик)." }),
  sym("H", "operator", { inFormula: "Энтропия политики — бонус за исследование." }),
  sym("\\nabla", "operator", { inFormula: "Градиент цели по весам." }),
  sym("\\theta", "parameter", { inFormula: "Общие веса глобальной сети." }),
  sym("\\gamma", "parameter", { inFormula: "Дисконт." }),
  sym("c", "parameter", { inFormula: "$\\enfPar{c}_1$ — вес ошибки критика, $\\enfPar{c}_2$ — вес энтропии." }),
  sym("J", "target", { inFormula: "Ожидаемая отдача." }),
  sym("L", "target", { inFormula: "Функции потерь актёра, критика и общая." }),
  sym("r", "target", { inFormula: "Награда шага." }),
];

export const VISUALIZATIONS_SYMBOLS: SymbolEntry[] = [
  sym("s", "variable", { inFormula: "Состояние." }),
  sym("r", "variable", { inFormula: "Отношение вероятностей PPO: за пределами $[1 - \\enfPar{\\varepsilon}, 1 + \\enfPar{\\varepsilon}]$ градиент обрезается." }),
  sym("a", "function", { inFormula: "Действие." }),
  sym("\\pi", "function", { inFormula: "Softmax-политика с температурой $\\enfPar{\\tau}$." }),
  sym("Q", "operator", { inFormula: "Ценность действия — логит softmax-политики." }),
  sym("\\hat{A}", "operator", { inFormula: "Оценка преимущества." }),
  sym("\\theta", "parameter", { inFormula: "Веса политики." }),
  sym("\\varepsilon", "parameter", { inFormula: "Радиус обрезки PPO." }),
  sym("\\tau", "parameter", { name: "температура softmax", meaning: "Малое $\\enfPar{\\tau}$ — почти жадный выбор, большое — почти равномерный." }),
  sym("L", "target", { inFormula: "Суррогатная функция PPO." }),
];

export const DEEP_RL_HUB_SYMBOLS: SymbolEntry[] = [
  sym("\\varepsilon", "parameter", {
    name: "радиус обрезки PPO",
    meaning: "Отношение вероятностей новой и старой политики держится в $[1 - \\enfPar{\\varepsilon}, 1 + \\enfPar{\\varepsilon}]$; обычно $\\enfPar{\\varepsilon} = 0{,}2$.",
    code: ["epsilon: 0.2"],
  }),
  sym("\\alpha", "parameter", {
    name: "температура SAC",
    meaning: "Вес энтропии в цели SAC: баланс между наградой и случайностью действий; подбирается автоматически.",
    code: ["init_entcoef"],
  }),
];
