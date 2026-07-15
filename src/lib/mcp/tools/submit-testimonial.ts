import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "./_supabase";

export default defineTool({
  name: "submit_testimonial",
  title: "Submit a testimonial",
  description:
    "Create a testimonial for the RL Platform as the signed-in user (10-1000 chars, rating 1-5).",
  inputSchema: {
    content: z.string().min(10).max(1000).describe("Testimonial text (10-1000 chars)."),
    rating: z.number().int().min(1).max(5).describe("Rating from 1 to 5."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ content, rating }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("testimonials")
      .insert({ user_id: ctx.getUserId()!, content, rating })
      .select()
      .maybeSingle();

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: `Testimonial saved (id=${data?.id}).` }],
      structuredContent: { testimonial: data },
    };
  },
});
