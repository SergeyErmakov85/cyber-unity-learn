import { defineTool } from "@lovable.dev/mcp-js";
import { SUPPORT_HUBS } from "@/content/hubs";

export default defineTool({
  name: "list_hubs",
  title: "List knowledge hubs",
  description:
    "List all knowledge hubs (PyTorch, Unity ML-Agents, Deep RL, Math RL, Projects, Research) with their descriptions.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const hubs = Object.values(SUPPORT_HUBS).map((h) => ({
      id: h.id,
      label: h.label,
      slug: h.slug,
      description: h.shortDescription,
      path: `/hub/${h.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(hubs, null, 2) }],
      structuredContent: { hubs },
    };
  },
});
