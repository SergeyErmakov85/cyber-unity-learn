import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import { SkeletonCard } from "@/components/SkeletonCard";
import {
  ArrowLeft,
  Search,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  Filter,
  Download,
  SlidersHorizontal,
  Code2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

/* ─── Data ─── */

type Difficulty = "beginner" | "intermediate" | "advanced";
type Lang = "python" | "csharp";

interface Snippet {
  id: string;
  title: string;
  description: string;
  categories: string[];
  language: Lang;
  difficulty: Difficulty;
  popularity: number;
  date: string;
  colabUrl?: string;
  code: string;
}

const CATEGORIES = ["DQN", "PPO", "SAC", "REINFORCE", "MA-POCA", "Environments", "Utils", "Visualization"];
const LANGUAGES: { value: Lang; label: string }[] = [
  { value: "python", label: "Python" },
  { value: "csharp", label: "C# (Unity)" },
];

const DIFFICULTY_META: Record<Difficulty, { label: string; cls: string }> = {
  beginner: { label: "Beginner", cls: "bg-green-500/15 text-green-400 border-green-500/30" },
  intermediate: { label: "Intermediate", cls: "bg-secondary/15 text-secondary border-secondary/30" },
  advanced: { label: "Advanced", cls: "bg-accent/15 text-accent border-accent/30" },
};

const snippets: Snippet[] = [
  {
    id: "replay-buffer",
    title: "ReplayBuffer",
    description: "Кольцевой буфер для experience replay — фундамент off-policy алгоритмов.",
    categories: ["DQN"],
    language: "python",
    difficulty: "beginner",
    popularity: 95,
    date: "2025-12-01",
    colabUrl: "/Taxi-v3.ipynb",
    code: `import random
from collections import deque
import torch

class ReplayBuffer:
    """Circular buffer for experience replay."""
    def __init__(self, capacity: int = 100_000):
        self.buffer = deque(maxlen=capacity)

    def push(self, state, action, reward, next_state, done):
        self.buffer.append((state, action, reward, next_state, done))

    def sample(self, batch_size: int = 64):
        batch = random.sample(self.buffer, batch_size)
        states, actions, rewards, next_states, dones = zip(*batch)
        return (
            torch.FloatTensor(states),
            torch.LongTensor(actions),
            torch.FloatTensor(rewards),
            torch.FloatTensor(next_states),
            torch.FloatTensor(dones),
        )

    def __len__(self):
        return len(self.buffer)`,
  },
  {
    id: "ppo-agent",
    title: "PPOAgent class",
    description: "Полная реализация PPO с clipped surrogate loss и GAE.",
    categories: ["PPO"],
    language: "python",
    difficulty: "intermediate",
    popularity: 98,
    date: "2026-01-15",
    colabUrl: "https://colab.research.google.com/",
    code: `import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np

class PPOAgent:
    def __init__(self, obs_dim, act_dim, lr=3e-4, gamma=0.99,
                 clip_eps=0.2, epochs=4, batch_size=64):
        self.gamma = gamma
        self.clip_eps = clip_eps
        self.epochs = epochs
        self.batch_size = batch_size

        self.actor = nn.Sequential(
            nn.Linear(obs_dim, 256), nn.ReLU(),
            nn.Linear(256, 256), nn.ReLU(),
            nn.Linear(256, act_dim), nn.Softmax(dim=-1),
        )
        self.critic = nn.Sequential(
            nn.Linear(obs_dim, 256), nn.ReLU(),
            nn.Linear(256, 256), nn.ReLU(),
            nn.Linear(256, 1),
        )
        self.optimizer = optim.Adam(
            list(self.actor.parameters()) +
            list(self.critic.parameters()), lr=lr
        )

    def get_action(self, state):
        probs = self.actor(torch.FloatTensor(state))
        dist = torch.distributions.Categorical(probs)
        action = dist.sample()
        return action.item(), dist.log_prob(action), self.critic(
            torch.FloatTensor(state)
        )

    def update(self, trajectories):
        # Compute GAE advantages
        # Clipped surrogate loss
        # Value loss + entropy bonus
        pass  # See full implementation in course 2.2`,
  },
  {
    id: "dqn-loop",
    title: "DQN Training Loop",
    description: "Полный цикл обучения DQN с target network и ε-greedy.",
    categories: ["DQN"],
    language: "python",
    difficulty: "beginner",
    popularity: 90,
    date: "2025-11-20",
    colabUrl: "https://colab.research.google.com/",
    code: `import torch
import torch.nn as nn
import torch.optim as optim
import gym

# Hyperparams
EPISODES = 1000
GAMMA = 0.99
EPS_START = 1.0
EPS_END = 0.01
EPS_DECAY = 0.995
TARGET_UPDATE = 10
BATCH_SIZE = 64

env = gym.make("CartPole-v1")
obs_dim = env.observation_space.shape[0]
act_dim = env.action_space.n

q_net = QNetwork(obs_dim, act_dim)
target_net = QNetwork(obs_dim, act_dim)
target_net.load_state_dict(q_net.state_dict())
optimizer = optim.Adam(q_net.parameters(), lr=1e-3)
buffer = ReplayBuffer(50_000)
eps = EPS_START

for ep in range(EPISODES):
    state, _ = env.reset()
    total_reward = 0
    done = False
    while not done:
        # ε-greedy action selection
        if random.random() < eps:
            action = env.action_space.sample()
        else:
            with torch.no_grad():
                action = q_net(torch.FloatTensor(state)).argmax().item()
        next_state, reward, done, _, _ = env.step(action)
        buffer.push(state, action, reward, next_state, done)
        state = next_state
        total_reward += reward

        if len(buffer) >= BATCH_SIZE:
            # Sample & compute TD loss
            loss = compute_td_loss(q_net, target_net, buffer, BATCH_SIZE, GAMMA)
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

    eps = max(EPS_END, eps * EPS_DECAY)
    if ep % TARGET_UPDATE == 0:
        target_net.load_state_dict(q_net.state_dict())
    print(f"Episode {ep}: reward={total_reward:.0f}, eps={eps:.3f}")`,
  },
  {
    id: "unity-wrapper",
    title: "Unity Environment Wrapper",
    description: "Gym-совместимая обёртка для UnityEnvironment из ML-Agents.",
    categories: ["Environments"],
    language: "python",
    difficulty: "intermediate",
    popularity: 75,
    date: "2026-01-10",
    code: `from mlagents_envs.environment import UnityEnvironment
from mlagents_envs.envs.unity_gym_env import UnityToGymWrapper
import numpy as np

class UnityEnvWrapper:
    """Gym-compatible wrapper for Unity ML-Agents."""
    def __init__(self, file_name=None, worker_id=0, no_graphics=True):
        self.unity_env = UnityEnvironment(
            file_name=file_name,
            worker_id=worker_id,
            no_graphics=no_graphics,
        )
        self.env = UnityToGymWrapper(
            self.unity_env,
            allow_multiple_obs=False,
        )
        self.observation_space = self.env.observation_space
        self.action_space = self.env.action_space

    def reset(self):
        return self.env.reset()

    def step(self, action):
        return self.env.step(action)

    def close(self):
        self.env.close()
        self.unity_env.close()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()`,
  },
  {
    id: "tb-logger",
    title: "TensorBoard Logger",
    description: "Callback для логирования наград, loss и метрик в TensorBoard.",
    categories: ["Utils"],
    language: "python",
    difficulty: "beginner",
    popularity: 80,
    date: "2025-12-15",
    code: `from torch.utils.tensorboard import SummaryWriter
from datetime import datetime

class RLLogger:
    """TensorBoard logger for RL training metrics."""
    def __init__(self, log_dir="runs", experiment_name=None):
        name = experiment_name or datetime.now().strftime("%Y%m%d_%H%M%S")
        self.writer = SummaryWriter(f"{log_dir}/{name}")
        self.episode = 0

    def log_episode(self, reward, length, epsilon=None, loss=None):
        self.writer.add_scalar("reward/episode", reward, self.episode)
        self.writer.add_scalar("episode_length", length, self.episode)
        if epsilon is not None:
            self.writer.add_scalar("epsilon", epsilon, self.episode)
        if loss is not None:
            self.writer.add_scalar("loss/td", loss, self.episode)
        self.episode += 1

    def log_training(self, step, policy_loss, value_loss, entropy):
        self.writer.add_scalar("loss/policy", policy_loss, step)
        self.writer.add_scalar("loss/value", value_loss, step)
        self.writer.add_scalar("entropy", entropy, step)

    def close(self):
        self.writer.close()`,
  },
  {
    id: "onnx-export",
    title: "ONNX Export",
    description: "Экспорт обученной PyTorch-модели в формат ONNX для Unity Sentis.",
    categories: ["Utils"],
    language: "python",
    difficulty: "beginner",
    popularity: 85,
    date: "2026-02-01",
    code: `import torch
import torch.onnx

def export_to_onnx(model, obs_size, output_path="model.onnx",
                   output_names=None):
    """Export a PyTorch RL model to ONNX format."""
    model.eval()
    dummy = torch.randn(1, obs_size)
    out_names = output_names or ["continuous_actions"]

    torch.onnx.export(
        model,
        dummy,
        output_path,
        input_names=["obs_0"],
        output_names=out_names,
        opset_version=15,
        dynamic_axes={
            "obs_0": {0: "batch"},
            out_names[0]: {0: "batch"},
        },
    )
    print(f"✅ Exported to {output_path}")

    # Verify
    import onnxruntime as ort
    sess = ort.InferenceSession(output_path)
    result = sess.run(None, {"obs_0": dummy.numpy()})
    print(f"   Output shape: {result[0].shape}")

# Usage:
# export_to_onnx(my_policy, obs_size=8)`,
  },
  {
    id: "reward-plotter",
    title: "Reward Plotter",
    description: "Matplotlib-график обучения с moving average и аннотациями.",
    categories: ["Visualization"],
    language: "python",
    difficulty: "beginner",
    popularity: 70,
    date: "2025-12-20",
    code: `import matplotlib.pyplot as plt
import numpy as np

def plot_rewards(rewards, window=50, title="Training Progress",
                 save_path=None):
    """Plot episode rewards with moving average."""
    fig, ax = plt.subplots(figsize=(12, 5))

    ax.plot(rewards, alpha=0.3, color="#00ffff", label="Episode reward")

    if len(rewards) >= window:
        ma = np.convolve(rewards, np.ones(window)/window, mode="valid")
        ax.plot(range(window-1, len(rewards)), ma,
                color="#ff00ff", linewidth=2, label=f"MA({window})")

    best = max(rewards)
    best_ep = rewards.index(best)
    ax.annotate(f"Best: {best:.1f}", xy=(best_ep, best),
                fontsize=9, color="white",
                arrowprops=dict(arrowstyle="->", color="#00ffff"))

    ax.set_xlabel("Episode")
    ax.set_ylabel("Reward")
    ax.set_title(title)
    ax.legend()
    ax.set_facecolor("#1a1a2e")
    fig.patch.set_facecolor("#0f0f1a")
    ax.tick_params(colors="white")
    ax.xaxis.label.set_color("white")
    ax.yaxis.label.set_color("white")
    ax.title.set_color("#00ffff")

    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches="tight")
    plt.show()`,
  },
  {
    id: "unity-agent",
    title: "Unity Agent Template",
    description: "Базовый шаблон Agent-скрипта для Unity ML-Agents с наблюдениями и действиями.",
    categories: ["Environments"],
    language: "csharp",
    difficulty: "beginner",
    popularity: 92,
    date: "2026-01-05",
    code: `using Unity.MLAgents;
using Unity.MLAgents.Actuators;
using Unity.MLAgents.Sensors;
using UnityEngine;

public class BasicAgent : Agent
{
    [Header("Settings")]
    public float moveSpeed = 5f;
    public Transform target;

    private Rigidbody rb;

    public override void Initialize()
    {
        rb = GetComponent<Rigidbody>();
    }

    public override void OnEpisodeBegin()
    {
        // Reset agent position
        transform.localPosition = new Vector3(
            Random.Range(-4f, 4f), 0.5f, Random.Range(-4f, 4f)
        );
        rb.velocity = Vector3.zero;

        // Randomize target
        target.localPosition = new Vector3(
            Random.Range(-4f, 4f), 0.5f, Random.Range(-4f, 4f)
        );
    }

    public override void CollectObservations(VectorSensor sensor)
    {
        sensor.AddObservation(transform.localPosition);       // 3
        sensor.AddObservation(rb.velocity);                    // 3
        sensor.AddObservation(target.localPosition);           // 3
    }

    public override void OnActionReceived(ActionBuffers actions)
    {
        float moveX = actions.ContinuousActions[0];
        float moveZ = actions.ContinuousActions[1];
        rb.AddForce(new Vector3(moveX, 0, moveZ) * moveSpeed);

        // Reward
        float dist = Vector3.Distance(transform.localPosition,
                                       target.localPosition);
        if (dist < 1.5f)
        {
            SetReward(1.0f);
            EndEpisode();
        }
        AddReward(-0.001f); // time penalty
    }

    public override void Heuristic(in ActionBuffers actionsOut)
    {
        var ca = actionsOut.ContinuousActions;
        ca[0] = Input.GetAxis("Horizontal");
        ca[1] = Input.GetAxis("Vertical");
    }
}`,
  },
  {
    id: "sac-alpha",
    title: "SAC с автоподстройкой α",
    description: "Soft Actor-Critic с автоматической настройкой температурного параметра.",
    categories: ["SAC"],
    language: "python",
    difficulty: "advanced",
    popularity: 88,
    date: "2026-02-10",
    colabUrl: "https://colab.research.google.com/",
    code: `import torch
import torch.nn as nn
import torch.optim as optim
import LabPracticeSection from "@/components/LabPracticeSection";

class SACAlpha:
    """SAC with automatic temperature (alpha) tuning."""
    def __init__(self, obs_dim, act_dim, lr=3e-4, gamma=0.99, tau=0.005):
        self.gamma = gamma
        self.tau = tau

        # Twin Q-networks
        self.q1 = QNetwork(obs_dim, act_dim)
        self.q2 = QNetwork(obs_dim, act_dim)
        self.q1_target = QNetwork(obs_dim, act_dim)
        self.q2_target = QNetwork(obs_dim, act_dim)
        self.q1_target.load_state_dict(self.q1.state_dict())
        self.q2_target.load_state_dict(self.q2.state_dict())

        # Policy (Gaussian)
        self.actor = GaussianPolicy(obs_dim, act_dim)

        # Auto-tuned temperature
        self.target_entropy = -act_dim  # heuristic: -dim(A)
        self.log_alpha = torch.zeros(1, requires_grad=True)
        self.alpha_optimizer = optim.Adam([self.log_alpha], lr=lr)

    @property
    def alpha(self):
        return self.log_alpha.exp()

    def update_alpha(self, log_probs):
        alpha_loss = -(self.log_alpha * (
            log_probs + self.target_entropy
        ).detach()).mean()
        self.alpha_optimizer.zero_grad()
        alpha_loss.backward()
        self.alpha_optimizer.step()
        return alpha_loss.item()

    def soft_update(self):
        for tp, p in zip(self.q1_target.parameters(),
                         self.q1.parameters()):
            tp.data.copy_(self.tau * p.data + (1-self.tau) * tp.data)
        for tp, p in zip(self.q2_target.parameters(),
                         self.q2.parameters()):
            tp.data.copy_(self.tau * p.data + (1-self.tau) * tp.data)`,
  },
  {
    id: "multi-agent",
    title: "Multi-Agent Setup",
    description: "Настройка команд и групповых наград для MA-POCA в Unity.",
    categories: ["MA-POCA"],
    language: "csharp",
    difficulty: "advanced",
    popularity: 78,
    date: "2026-02-20",
    code: `using Unity.MLAgents;
using Unity.MLAgents.Actuators;
using Unity.MLAgents.Sensors;
using UnityEngine;

public class TeamAgent : Agent
{
    [Header("Team")]
    public int teamId = 0;

    private SimpleMultiAgentGroup agentGroup;
    private Rigidbody rb;

    public override void Initialize()
    {
        rb = GetComponent<Rigidbody>();
    }

    public void RegisterGroup(SimpleMultiAgentGroup group)
    {
        agentGroup = group;
        agentGroup.RegisterAgent(this);
    }

    public override void CollectObservations(VectorSensor sensor)
    {
        sensor.AddObservation(transform.localPosition);
        sensor.AddObservation(rb.velocity);
        sensor.AddObservation(teamId);

        // Relative positions of teammates
        var teammates = FindObjectsOfType<TeamAgent>();
        foreach (var t in teammates)
        {
            if (t != this && t.teamId == teamId)
            {
                Vector3 rel = t.transform.localPosition
                              - transform.localPosition;
                sensor.AddObservation(rel);
            }
        }
    }

    public override void OnActionReceived(ActionBuffers actions)
    {
        float moveX = actions.ContinuousActions[0];
        float moveZ = actions.ContinuousActions[1];
        rb.AddForce(new Vector3(moveX, 0, moveZ) * 5f);
    }

    public void OnTeamScored(int scoringTeam)
    {
        if (scoringTeam == teamId)
            agentGroup.AddGroupReward(1.0f);
        else
            agentGroup.AddGroupReward(-1.0f);
        agentGroup.EndGroupEpisode();
    }

    public override void Heuristic(in ActionBuffers actionsOut)
    {
        var ca = actionsOut.ContinuousActions;
        ca[0] = Input.GetAxis("Horizontal");
        ca[1] = Input.GetAxis("Vertical");
    }
}`,
  },
  {
    id: "gridsensor-patch",
    title: "GridSensor Channel Patch",
    description: "Патч для исправления порядка каналов 4D тензора GridSensor в PyTorch.",
    categories: ["Environments", "Utils"],
    language: "python" as Lang,
    difficulty: "intermediate" as Difficulty,
    popularity: 88,
    date: "2026-03-01",
    code: `def patch_gridsensor_obs(obs: torch.Tensor) -> torch.Tensor:
    """
    Unity ML-Agents GridSensor возвращает (B, H, W, C).
    PyTorch Conv2d ожидает (B, C, H, W).
    """
    if obs.dim() == 4:
        # (B, H, W, C) -> (B, C, H, W)
        return obs.permute(0, 3, 1, 2).contiguous()
    elif obs.dim() == 3:
        # (H, W, C) -> (C, H, W)
        return obs.permute(2, 0, 1).contiguous()
    return obs`,
  },
  {
    id: "unity-onnx-wrapper",
    title: "UnityONNXWrapper",
    description: "Обёртка для экспорта PyTorch модели в ONNX с метаданными Unity ML-Agents.",
    categories: ["Utils"],
    language: "python" as Lang,
    difficulty: "advanced" as Difficulty,
    popularity: 92,
    date: "2026-03-05",
    code: `class UnityONNXWrapper(nn.Module):
    VERSION_NUMBER = torch.Tensor([3.0])
    MEMORY_SIZE    = torch.Tensor([0])
    IS_CONTINUOUS  = torch.Tensor([1])

    def __init__(self, policy: nn.Module):
        super().__init__()
        self.policy = policy

    def forward(self, obs: torch.Tensor):
        action = self.policy(obs)
        return (action, self.VERSION_NUMBER,
                self.MEMORY_SIZE, self.IS_CONTINUOUS)

# Экспорт
wrapper = UnityONNXWrapper(trained_model)
torch.onnx.export(wrapper, dummy_input, "policy.onnx",
                  opset_version=9,
                  input_names=["obs_0"],
                  output_names=["continuous_actions",
                                "version_number",
                                "memory_size",
                                "is_continuous_control"])`,
  },
  {
    id: "reinforce-with-baseline",
    title: "REINFORCE с baseline",
    description: "Реализация REINFORCE с value baseline для снижения дисперсии gradient estimator.",
    categories: ["REINFORCE", "Utils"],
    language: "python" as Lang,
    difficulty: "intermediate" as Difficulty,
    popularity: 90,
    date: "2026-03-10",
    colabUrl: "/FoodCollector_REINFORCE_v3.ipynb",
    code: `def reinforce_update(policy, value_net, optimizer_p, optimizer_v,
                     states, actions, rewards, gamma=0.99):
    # Дисконтированные возвраты
    G, returns = 0, []
    for r in reversed(rewards):
        G = r + gamma * G
        returns.insert(0, G)
    returns = torch.tensor(returns, dtype=torch.float32)
    returns = (returns - returns.mean()) / (returns.std() + 1e-8)

    states_t  = torch.FloatTensor(states)
    actions_t = torch.LongTensor(actions)

    # Baseline: V(s)
    values  = value_net(states_t).squeeze()
    advantages = returns - values.detach()

    # Policy loss (REINFORCE)
    logits    = policy(states_t)
    log_probs = F.log_softmax(logits, dim=-1)
    log_probs_a = log_probs.gather(1, actions_t.unsqueeze(1)).squeeze()
    policy_loss = -(log_probs_a * advantages).mean()

    # Value loss (MSE)
    value_loss = F.mse_loss(values, returns)

    optimizer_p.zero_grad(); policy_loss.backward(); optimizer_p.step()
    optimizer_v.zero_grad(); value_loss.backward();  optimizer_v.step()

    return policy_loss.item(), value_loss.item()`,
  },
];

/* ─── Sort options ─── */
type SortKey = "popularity" | "date" | "difficulty";
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "popularity", label: "По популярности" },
  { value: "date", label: "По дате" },
  { value: "difficulty", label: "По сложности" },
];
const diffOrder: Record<Difficulty, number> = { beginner: 0, intermediate: 1, advanced: 2 };

/* ─── Component ─── */

const CodeExamples = () => {
  const [query, setQuery] = useState("");
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedLangs, setSelectedLangs] = useState<Lang[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>("popularity");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(t);
  }, []);

  const toggleCat = (c: string) =>
    setSelectedCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  const toggleLang = (l: Lang) =>
    setSelectedLangs((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));

  const filtered = useMemo(() => {
    let list = [...snippets];

    // Search (fuzzy-ish)
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.categories.some((c) => c.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCats.length > 0) {
      list = list.filter((s) => s.categories.some((c) => selectedCats.includes(c)));
    }

    // Language filter
    if (selectedLangs.length > 0) {
      list = list.filter((s) => selectedLangs.includes(s.language));
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === "popularity") return b.popularity - a.popularity;
      if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
      return diffOrder[a.difficulty] - diffOrder[b.difficulty];
    });

    return list;
  }, [query, selectedCats, selectedLangs, sortBy]);

  const copyCode = (snippet: Snippet) => {
    navigator.clipboard.writeText(snippet.code);
    setCopiedId(snippet.id);
    toast.success("Код скопирован!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeFilterCount = selectedCats.length + selectedLangs.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Link>
          <span className="text-sm text-muted-foreground">{filtered.length} сниппетов</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-5xl">
        {/* Title */}
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-neon bg-clip-text text-transparent">Библиотека кода</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Готовые сниппеты для DQN, PPO, SAC, Unity ML-Agents — копируй и используй.
          </p>
        </div>

        {/* Search + sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию, описанию, тегу…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 bg-card/60 border-border/50 focus:border-primary/50"
            />
            {query && (
              <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {/* Filter toggle (mobile-friendly) */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={cn("gap-1.5", activeFilterCount > 0 && "border-primary/50 text-primary")}
            >
              <Filter className="w-4 h-4" />
              Фильтры
              {activeFilterCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="appearance-none bg-card/60 border border-border/50 rounded-md px-3 pr-8 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <SlidersHorizontal className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filters panel */}
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleContent>
            <Card className="mb-6 border-border/30 bg-card/40">
              <CardContent className="p-4 space-y-4">
                {/* Categories */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Категория
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <label
                        key={c}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border cursor-pointer transition-all",
                          selectedCats.includes(c)
                            ? "border-primary/50 bg-primary/10 text-primary"
                            : "border-border/40 text-muted-foreground hover:border-border"
                        )}
                      >
                        <Checkbox
                          checked={selectedCats.includes(c)}
                          onCheckedChange={() => toggleCat(c)}
                          className="w-3.5 h-3.5"
                        />
                        {c}
                      </label>
                    ))}
                  </div>
                </div>
                {/* Languages */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Язык
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((l) => (
                      <label
                        key={l.value}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border cursor-pointer transition-all",
                          selectedLangs.includes(l.value)
                            ? "border-secondary/50 bg-secondary/10 text-secondary"
                            : "border-border/40 text-muted-foreground hover:border-border"
                        )}
                      >
                        <Checkbox
                          checked={selectedLangs.includes(l.value)}
                          onCheckedChange={() => toggleLang(l.value)}
                          className="w-3.5 h-3.5"
                        />
                        {l.label}
                      </label>
                    ))}
                  </div>
                </div>
                {/* Clear */}
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCats([]);
                      setSelectedLangs([]);
                    }}
                    className="text-muted-foreground"
                  >
                    Сбросить фильтры
                  </Button>
                )}
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Snippets grid */}
        {!mounted ? (
          <div className="grid gap-5">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Code2 className="w-12 h-12 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground">Ничего не найдено. Попробуйте изменить фильтры.</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filtered.map((snippet) => {
              const isExpanded = expanded === snippet.id;
              const diff = DIFFICULTY_META[snippet.difficulty];
              const previewLines = snippet.code.split("\n").slice(0, 10).join("\n");

              return (
                <Card
                  key={snippet.id}
                  className="border-border/30 bg-card/50 backdrop-blur-sm hover:border-primary/30 hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)] transition-all duration-300"
                >
                  <CardContent className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-foreground text-lg">{snippet.title}</h3>
                          <span className={cn("text-xs px-2 py-0.5 rounded-full border", diff.cls)}>
                            {diff.label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{snippet.description}</p>
                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          {snippet.categories.map((c) => (
                            <span
                              key={c}
                              className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                            >
                              {c}
                            </span>
                          ))}
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {snippet.language === "python" ? "Python" : "C#"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Code preview */}
                    <div className="relative">
                      <CyberCodeBlock language={snippet.language === "csharp" ? "csharp" : "python"}>
                        {isExpanded ? snippet.code : previewLines}
                      </CyberCodeBlock>
                      {!isExpanded && snippet.code.split("\n").length > 10 && (
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent pointer-events-none rounded-b-lg" />
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyCode(snippet)}
                        className="gap-1.5"
                      >
                        {copiedId === snippet.id ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        {copiedId === snippet.id ? "Скопировано" : "Копировать"}
                      </Button>
                      {snippet.code.split("\n").length > 10 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setExpanded(isExpanded ? null : snippet.id)}
                          className="gap-1.5"
                        >
                          <ChevronDown
                            className={cn("w-3.5 h-3.5 transition-transform", isExpanded && "rotate-180")}
                          />
                          {isExpanded ? "Свернуть" : "Открыть полностью"}
                        </Button>
                      )}
                      {snippet.colabUrl && (() => {
                        const isLocal = snippet.colabUrl.startsWith("/");
                        const isSoon = snippet.colabUrl === "https://colab.research.google.com/";
                        return isLocal ? (
                          <Button variant="outline" size="sm" asChild className="gap-1.5 border-green-500/40 text-green-400 hover:bg-green-500/10 hover:border-green-500/60">
                            <a href={snippet.colabUrl} download>
                              <Download className="w-3.5 h-3.5" />
                              Скачать .ipynb
                            </a>
                          </Button>
                        ) : isSoon ? (
                          <Button variant="outline" size="sm" disabled className="gap-1.5 opacity-50">
                            <ExternalLink className="w-3.5 h-3.5" />
                            Colab (soon)
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" asChild className="gap-1.5 border-orange-500/40 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/60">
                            <a href={snippet.colabUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3.5 h-3.5" />
                              Открыть в Colab
                            </a>
                          </Button>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* GitHub CTA */}
        <div className="text-center mt-16 p-8 rounded-xl bg-card/50 border border-primary/20">
          <h3 className="text-xl font-bold text-foreground mb-2">Больше примеров на GitHub</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Полные проекты с инструкциями, датасетами и конфигурациями.
          </p>
          <Button variant="cyber" asChild>
            <a
              href="https://github.com/SergeyErmakov85/My_First_NPC"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Открыть на GitHub
            </a>
          </Button>
        </div>
      {/* Практика: собранная среда лаборатории для этой темы. */}
      <LabPracticeSection contextKey="/code-examples" />

      </main>
    </div>
  );
};

export default CodeExamples;
