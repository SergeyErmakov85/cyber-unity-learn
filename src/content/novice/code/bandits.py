"""Урок 1.7: три стратегии, общий бюджет и одинаковые случайные награды."""
import numpy as np
import matplotlib.pyplot as plt

PROBABILITIES = np.array([0.1, 0.5, 0.8, 0.2, 0.4])
STEPS = 2000
SEEDS = [0, 1, 2]
STRATEGIES = ["epsilon-greedy", "UCB1", "Thompson"]


def run(strategy, outcomes, seed):
    rng = np.random.default_rng(seed)
    k = outcomes.shape[1]
    counts, values, successes = np.zeros(k), np.zeros(k), np.zeros(k)
    rewards, optimal = [], []
    for t in range(len(outcomes)):
        if strategy == "epsilon-greedy":
            scores = values
            if rng.random() < 0.1:
                action = int(rng.integers(k))
            else:
                action = int(rng.choice(np.flatnonzero(scores == scores.max())))
        elif strategy == "UCB1":
            unseen = np.flatnonzero(counts == 0)
            if len(unseen):
                action = int(unseen[0])  # Сначала пробуем все действия: деления на ноль нет.
            else:
                scores = values + np.sqrt(2 * np.log(t + 1) / counts)
                action = int(scores.argmax())
        elif strategy == "Thompson":
            samples = rng.beta(1 + successes, 1 + counts - successes)
            action = int(samples.argmax())
        else:
            raise ValueError(strategy)
        reward = int(outcomes[t, action])
        counts[action] += 1
        values[action] += (reward - values[action]) / counts[action]
        successes[action] += reward
        rewards.append(reward)
        optimal.append(action == int(PROBABILITIES.argmax()))
    return np.asarray(rewards), np.asarray(optimal)


if __name__ == "__main__":
    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    for strategy in STRATEGIES:
        results = []
        for seed in SEEDS:
            # У каждого метода на данном сиде одна и та же таблица потенциальных наград.
            rng = np.random.default_rng(seed)
            outcomes = rng.random((STEPS, len(PROBABILITIES))) < PROBABILITIES
            results.append(run(strategy, outcomes, seed + 100))
        rewards = np.asarray([r for r, _ in results])
        optimal = np.asarray([o for _, o in results])
        print(f"{strategy}: награда {rewards.sum(axis=1).mean():.1f}, "
              f"лучшее действие {optimal.mean():.1%}")
        axes[0].plot(rewards.cumsum(axis=1).mean(axis=0), label=strategy)
        axes[1].plot(optimal.cumsum(axis=1).mean(axis=0) / np.arange(1, STEPS + 1), label=strategy)
    axes[0].set(title="Накопленная награда", xlabel="Шаг")
    axes[1].set(title="Доля лучшего действия", xlabel="Шаг")
    for ax in axes:
        ax.legend()
    fig.tight_layout()
    fig.savefig("bandits.png")
    plt.show()
