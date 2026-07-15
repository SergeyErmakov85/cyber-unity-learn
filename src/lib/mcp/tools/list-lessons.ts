import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { LEARNING_MAP } from "../../../content/learningMap";

export default defineTool({
  name: "list_lessons",
  title: "List course lessons",
  description:
    "List all stages, lessons and projects of the RL Platform course (Beginner / Intermediate / Advanced).",
  inputSchema: {
    stage: z
      .enum(["stage-1", "stage-2", "stage-3"])
      .optional()
      .describe("Optional stage id to filter (stage-1 = Beginner, stage-2 = Intermediate, stage-3 = Advanced)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ stage }) => {
    const stages = stage ? LEARNING_MAP.filter((s) => s.id === stage) : LEARNING_MAP;
    const summary = stages.map((s) => ({
      id: s.id,
      title: s.title,
      tag: s.tag,
      weeks: s.weeks,
      description: s.description,
      lessons: s.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        type: l.type,
        path: l.path,
      })),
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: { stages: summary },
    };
  },
});
