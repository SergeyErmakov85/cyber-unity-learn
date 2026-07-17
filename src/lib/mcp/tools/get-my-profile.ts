import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "./_supabase";

export default defineTool({
  name: "get_my_profile",
  title: "Get my profile",
  description: "Return the signed-in user's profile (id, name, avatar) from the RL Platform.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const userId = ctx.getUserId();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, avatar_url, created_at")
      .eq("id", userId!)
      .maybeSingle();

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    const profile = data ?? { id: userId, name: null, avatar_url: null, created_at: null };
    return {
      content: [{ type: "text", text: JSON.stringify({ ...profile, email: ctx.getUserEmail() }, null, 2) }],
      structuredContent: { profile: { ...profile, email: ctx.getUserEmail() } },
    };
  },
});
