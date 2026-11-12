"""Урок 1.3: одна модель RoomBot и Value Iteration, без нейросети."""
import numpy as np
import matplotlib.pyplot as plt

GRID = 3
BATTERY = (GRID - 1, GRID - 1)
PUDDLES = {(1, 1)}
SLIP, STEP_REWARD, GAMMA = 0.1, -0.02, 0.95
MOVES = [(-1, 0), (1, 0), (0, -1), (0, 1)]
NAMES = ["↑", "↓", "←", "→"]


def states():
    return [(r, c) for r in range(GRID) for c in range(GRID)]


def terminal(s):
    return s == BATTERY or s in PUDDLES


def reward(s):
    return 1.0 if s == BATTERY else -1.0 if s in PUDDLES else STEP_REWARD


def next_states(s, action):
    result = []
    for b, (dr, dc) in enumerate(MOVES):
        s2 = (min(max(s[0] + dr, 0), GRID - 1), min(max(s[1] + dc, 0), GRID - 1))
        result.append((1 - SLIP if b == action else SLIP / 3, s2))
    return result


def lookahead(V, s, action, gamma):
    return sum(p * (reward(s2) + gamma * V[s2]) for p, s2 in next_states(s, action))


def greedy_policy(V, gamma=GAMMA):
    return {s: max(range(4), key=lambda a: lookahead(V, s, a, gamma))
            for s in states() if not terminal(s)}


def value_iteration(gamma=GAMMA, tol=1e-9, max_iter=10000):
    V = dict.fromkeys(states(), 0.0)
    for iteration in range(1, max_iter + 1):
        new = {s: 0.0 if terminal(s) else max(lookahead(V, s, a, gamma) for a in range(4))
               for s in states()}
        delta = max(abs(new[s] - V[s]) for s in states())
        V = new
        if delta < tol:
            return V, greedy_policy(V, gamma), iteration
    raise RuntimeError("Лимит итераций: проверьте награды, gamma и достижимость терминалов")


def evaluate_policy(policy, gamma=GAMMA, tol=1e-9, max_iter=10000):
    """Политика задаётся вероятностями четырёх действий для каждой клетки."""
    V = dict.fromkeys(states(), 0.0)
    for _ in range(max_iter):
        new = {s: 0.0 if terminal(s) else sum(policy[s][a] * lookahead(V, s, a, gamma)
                                             for a in range(4)) for s in states()}
        if max(abs(new[s] - V[s]) for s in states()) < tol:
            return new
        V = new
    raise RuntimeError("Оценка политики не сошлась за max_iter")


def plot_values(V, policy, title):
    grid = np.array([[V[(r, c)] for c in range(GRID)] for r in range(GRID)])
    fig, ax = plt.subplots()
    image = ax.imshow(grid, cmap="viridis")
    for s in states():
        mark = "B" if s == BATTERY else "X" if s in PUDDLES else NAMES[policy[s]]
        ax.text(s[1], s[0], f"{V[s]:.2f}\n{mark}", ha="center", va="center", color="white")
    ax.set(title=title, xticks=range(GRID), yticks=range(GRID))
    fig.colorbar(image, ax=ax)
    fig.tight_layout()
    plt.show()


if __name__ == "__main__":
    V, policy, iterations = value_iteration()
    random_policy = {s: [0.25] * 4 for s in states() if not terminal(s)}
    random_V = evaluate_policy(random_policy)
    print(f"Итераций: {iterations}; V*(0,0)={V[(0,0)]:.3f}")
    print(f"Случайная политика: V(0,0)={random_V[(0,0)]:.3f}")
    plot_values(V, policy, "RoomBot: ценность и выбранное действие")
