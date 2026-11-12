"""Урок 1.6: DQN на CPU; python dqn_cartpole.py --episodes 600."""
import argparse
import random
from collections import deque
import gymnasium as gym
import numpy as np
import torch
from torch import nn


class DQN(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(nn.Linear(4, 64), nn.ReLU(),
                                 nn.Linear(64, 64), nn.ReLU(), nn.Linear(64, 2))

    def forward(self, states):
        return self.net(states)


def evaluate(model, episodes=100, seed=42):
    env = gym.make("CartPole-v1")
    returns = []
    model.eval()
    for episode in range(episodes):
        state, _ = env.reset(seed=seed + episode)
        total = 0.0
        while True:
            with torch.no_grad():
                action = model(torch.as_tensor(state, dtype=torch.float32)).argmax().item()
            state, reward, terminated, truncated, _ = env.step(action)
            total += reward
            if terminated or truncated:
                break
        returns.append(total)
    env.close()
    return np.asarray(returns)


def train(episodes, seed):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.set_num_threads(1)
    env = gym.make("CartPole-v1")
    env.action_space.seed(seed)
    policy, target_net = DQN(), DQN()
    target_net.load_state_dict(policy.state_dict())
    target_net.eval()
    optimizer = torch.optim.Adam(policy.parameters(), lr=1e-3)
    memory = deque(maxlen=50000)
    history, steps = [], 0
    best_score, best_weights = -1.0, None

    for episode in range(episodes):
        state, _ = env.reset(seed=seed + episode)
        epsilon = max(0.05, 0.99 ** episode)
        total = 0.0
        while True:
            steps += 1
            if random.random() < epsilon:
                action = env.action_space.sample()
            else:
                with torch.no_grad():
                    action = policy(torch.as_tensor(state, dtype=torch.float32)).argmax().item()
            next_state, reward, terminated, truncated, _ = env.step(action)
            # Храним terminated: truncation завершает эпизод, но сохраняет bootstrap.
            memory.append((state, action, reward, next_state, terminated))
            state = next_state
            total += reward

            if len(memory) >= 1000:
                s, a, r, ns, terminal = zip(*random.sample(memory, 64))
                states = torch.as_tensor(np.asarray(s), dtype=torch.float32)
                actions = torch.as_tensor(a, dtype=torch.int64).unsqueeze(1)
                rewards = torch.as_tensor(r, dtype=torch.float32)
                next_states = torch.as_tensor(np.asarray(ns), dtype=torch.float32)
                terminals = torch.as_tensor(terminal, dtype=torch.float32)
                q = policy(states).gather(1, actions).squeeze(1)
                with torch.no_grad():
                    future = target_net(next_states).max(dim=1).values
                    td_target = rewards + 0.99 * (1 - terminals) * future
                loss = nn.functional.smooth_l1_loss(q, td_target)
                optimizer.zero_grad()
                loss.backward()
                nn.utils.clip_grad_norm_(policy.parameters(), 1.0)
                optimizer.step()

            # Полная копия весов каждые 250 шагов среды.
            if steps % 250 == 0:
                target_net.load_state_dict(policy.state_dict())
            if terminated or truncated:
                break
        history.append(total)
        if (episode + 1) % 50 == 0:
            # Выбираем модель на проверочных эпизодах, итоговый тест — отдельно.
            score = evaluate(policy, episodes=50, seed=10000).mean()
            if score > best_score:
                best_score = score
                best_weights = {k: v.detach().clone() for k, v in policy.state_dict().items()}
            print(f"Эпизод {episode + 1}: train={np.mean(history[-50:]):.1f}, eval={score:.1f}")
            if score >= 490:
                break
    env.close()
    if best_weights is not None:
        policy.load_state_dict(best_weights)
    return policy, history


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--episodes", type=int, default=600)
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()
    model, train_returns = train(args.episodes, args.seed)
    torch.save(model.state_dict(), "cartpole_dqn.pt")
    loaded = DQN()
    loaded.load_state_dict(torch.load("cartpole_dqn.pt", map_location="cpu", weights_only=True))
    test_returns = evaluate(loaded, episodes=100, seed=42)
    np.save("cartpole_dqn_returns.npy", test_returns)
    np.save("cartpole_train_returns.npy", train_returns)
    print(f"DQN, 100 тестовых эпизодов: {test_returns.mean():.1f} ± {test_returns.std():.1f}")
