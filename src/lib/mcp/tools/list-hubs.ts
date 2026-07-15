import { defineTool } from "@lovable.dev/mcp-js";

const HUBS = [
  { id: "pytorch", label: "PyTorch", slug: "pytorch", description: "Основы тензоров, autograd, нейросетей и оптимизации в PyTorch." },
  { id: "unity-ml-agents", label: "Unity ML-Agents", slug: "unity-ml-agents", description: "Установка, настройка среды, сенсоры и тренировка агентов в Unity." },
  { id: "deep-rl", label: "Deep RL", slug: "deep-rl", description: "Глубокое обучение с подкреплением: DQN, Policy Gradient, Actor-Critic." },
  { id: "project", label: "Проекты", slug: "project", description: "Практические проекты: от CartPole до мультиагентного футбола." },
  { id: "math-rl", label: "Математика RL", slug: "math-rl", description: "Вероятности, MDP, уравнения Беллмана, градиенты политик." },
  { id: "fca-rl", label: "Исследования RL", slug: "fca-rl", description: "FCA для структурирования состояний, лаборатории и визуализации." },
] as const;

export default defineTool({
  name: "list_hubs",
  title: "List knowledge hubs",
  description:
    "List all knowledge hubs (PyTorch, Unity ML-Agents, Deep RL, Math RL, Projects, Research) with their descriptions.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const hubs = HUBS.map((h) => ({ ...h, path: `/hub/${h.slug}` }));
    return {
      content: [{ type: "text", text: JSON.stringify(hubs, null, 2) }],
      structuredContent: { hubs },
    };
  },
});
