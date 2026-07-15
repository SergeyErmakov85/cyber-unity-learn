import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listLessonsTool from "./tools/list-lessons";
import listHubsTool from "./tools/list-hubs";
import getMyProfileTool from "./tools/get-my-profile";
import listTestimonialsTool from "./tools/list-testimonials";
import submitTestimonialTool from "./tools/submit-testimonial";

// The OAuth issuer must be the direct Supabase host, constructed from the project
// ref (VITE_SUPABASE_PROJECT_ID is inlined at build time and stays import-safe).
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "rl-platform-mcp",
  title: "RL Platform (Cyber Unity Code)",
  version: "0.1.0",
  instructions:
    "Tools for the RL Platform — an educational site about Reinforcement Learning, PyTorch and Unity ML-Agents. " +
    "Use `list_lessons` to browse the 3-stage course, `list_hubs` for the knowledge hubs, " +
    "`get_my_profile` to see the signed-in user, and `list_testimonials` / `submit_testimonial` for user feedback.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listLessonsTool, listHubsTool, getMyProfileTool, listTestimonialsTool, submitTestimonialTool],
});
