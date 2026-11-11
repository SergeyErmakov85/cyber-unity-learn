/** Проверка параметров Vite без вывода ключей и обращения к базе данных. */
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const args = process.argv.slice(2);
if (args.length && (args.length !== 2 || args[0] !== "--mode" || !["development", "production"].includes(args[1]))) {
  console.error("Использование: npm run env:check -- --mode development|production");
  process.exit(1);
}
const mode = args[1] || "production";
// Тот же приоритет .env / .env.local / .env.<mode> / process.env, что у Vite.
const env = loadEnv(mode, root, "VITE_");
const required = ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY", "VITE_SUPABASE_PROJECT_ID"];
const errors = required.filter((name) => !env[name]?.trim()).map((name) => "Не задана " + name);

if (env.VITE_SUPABASE_URL?.trim()) {
  try {
    const url = new URL(env.VITE_SUPABASE_URL);
    const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    if (url.protocol !== "https:" && !(mode === "development" && loopback && url.protocol === "http:")) {
      errors.push("VITE_SUPABASE_URL должна использовать HTTPS (локальный HTTP допустим в development)");
    }
    if (url.username || url.password || url.search || url.hash || url.pathname !== "/") {
      errors.push("VITE_SUPABASE_URL должна содержать только адрес проекта, без пути, пароля и параметров");
    }
  } catch {
    errors.push("VITE_SUPABASE_URL содержит некорректный URL");
  }
}

const key = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
if (key) {
  let isPublicKey = key.startsWith("sb_publishable_") && key.length > "sb_publishable_".length;
  if (!isPublicKey) {
    try {
      const parts = key.split(".");
      const payload = JSON.parse(Buffer.from(parts[1] || "", "base64url").toString("utf8"));
      // Это проверка типа ключа, а не криптографическая проверка подписи JWT.
      isPublicKey = parts.length === 3 && parts.every(Boolean) && payload.role === "anon";
    } catch {
      // Не выводим исходный ключ или текст исключения в журнал.
    }
  }
  if (!isPublicKey) errors.push("VITE_SUPABASE_PUBLISHABLE_KEY должна быть publishable или legacy anon key");
}

if (errors.length) {
  console.error("Параметры окружения (" + mode + ") требуют настройки:\n" + errors.map((error) => "- " + error).join("\n"));
  console.error("См. .env.example и docs/CLOUD_WORKFLOW.md. Значения ключей в журнал не выводятся.");
  process.exit(1);
}
console.log("Параметры окружения (" + mode + "): все " + required.length + " заданы, формат корректен. Доступ к Supabase отдельно не проверялся.");
