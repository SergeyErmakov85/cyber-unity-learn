"""Урок 1.4: обучение и отдельная проверка Q-таблицы."""
import random
import gymnasium as gym
import numpy as np

SEED = 42
EPISODES = 2000
ALPHA, GAMMA = 0.8, 0.95
rng = np.random.default_rng(SEED)
random.seed(SEED)
env = gym.make("FrozenLake-v1", is_slippery=False)
env.action_space.seed(SEED)
Q = np.zeros((env.observation_space.n, env.action_space.n))

for episode in range(EPISODES):
    state, _ = env.reset(seed=SEED if episode == 0 else None)
    epsilon = max(0.01, 1.0 * 0.995 ** episode)
    while True:
        if rng.random() < epsilon:
            action = env.action_space.sample()
        else:
            action = int(Q[state].argmax())
        next_state, reward, terminated, truncated, _ = env.step(action)
        # Лимит времени прерывает цикл, но не обнуляет будущую ценность.
        future = 0.0 if terminated else Q[next_state].max()
        target = reward + GAMMA * future
        Q[state, action] += ALPHA * (target - Q[state, action])
        state = next_state
        if terminated or truncated:
            break
env.close()

# Проверка: отдельные эпизоды, без обучения и исследования.
test_env = gym.make("FrozenLake-v1", is_slippery=False)
successes = 0
for episode in range(100):
    state, _ = test_env.reset(seed=1000 + episode)
    while True:
        state, reward, terminated, truncated, _ = test_env.step(int(Q[state].argmax()))
        if terminated or truncated:
            successes += int(reward == 1)
            break
test_env.close()
print("Q-таблица:\n", Q.round(3))
print(f"Успехов: {successes}/100")
np.save("frozen_lake_q.npy", Q)
