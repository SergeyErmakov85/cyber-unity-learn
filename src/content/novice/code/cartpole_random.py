"""Урок 1.5: случайный агент — исходная точка для сравнения с DQN."""
import gymnasium as gym
import numpy as np

SEED = 42
EPISODES = 100
env = gym.make("CartPole-v1")
env.action_space.seed(SEED)
returns = []
for episode in range(EPISODES):
    observation, _ = env.reset(seed=SEED + episode)
    total = 0.0
    while True:
        action = env.action_space.sample()
        observation, reward, terminated, truncated, info = env.step(action)
        total += reward
        if terminated or truncated:
            break
    returns.append(total)
env.close()
print(f"Случайный агент: {np.mean(returns):.1f} ± {np.std(returns):.1f}")
print(f"Эпизодов: {len(returns)}, минимум: {min(returns)}, максимум: {max(returns)}")
np.save("cartpole_random_returns.npy", returns)
