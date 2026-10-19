/**
 * Черновик таблицы «Символы страницы: от формулы к коду» (ENF, модуль «Код»).
 *
 *   node scripts/symbol-table-draft.mjs <id> <файл страницы | лекция .md> [--force]
 *
 * Собирает все символы формул страницы (вместе с компонентами, которые она
 * подключает) в порядке первого появления, берёт описание из глобального
 * словаря и ищет, как символ называется в коде этой же страницы: `gamma`,
 * `td_target`, `self.q_net`. Найденная строка кода попадает в «Замечание».
 *
 * Результат — src/content/math-symbols/pages/<id>.ts. Это ЧЕРНОВИК: строки,
 * для которых имя в коде не найдено, помечены `// TODO: сверить с кодом`.
 * После генерации таблицу вычитывают глазами и подключают на страницу
 * компонентом <SymbolTable {...table} />; полноту проверяет npm run math:audit.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import ts from "typescript";
import { formulasOf, coloredAtoms, neutralAtoms, normalizeAtom, codeBlocksOf, mdFormulasOf } from "./lib/enf-formulas.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");
const [id, entry] = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const FORCE = process.argv.includes("--force");
if (!id || !entry) {
  console.error("usage: node scripts/symbol-table-draft.mjs <id> <page.tsx | lecture.md> [--force]");
  process.exit(2);
}
const OUT = join(SRC, "content/math-symbols/pages", `${id}.ts`);
if (existsSync(OUT) && !FORCE) {
  console.error(`${relative(ROOT, OUT)} уже есть; --force перезапишет`);
  process.exit(1);
}

/* ───────────── словарь ───────────── */

async function loadGlossary() {
  const tmp = join(tmpdir(), "enf-table-draft");
  mkdirSync(tmp, { recursive: true });
  const files = ["glossary/rl", "glossary/math", "glossary/neutral"];
  const all = [];
  for (const f of files) {
    const src = readFileSync(join(SRC, "content/math-symbols", f + ".ts"), "utf8").replace(/^import type .*$/m, "");
    const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
    const out = join(tmp, f.replace("/", "__") + ".mjs");
    writeFileSync(out, js);
    const mod = await import(pathToFileURL(out).href + `?t=${Date.now()}`);
    all.push(...Object.values(mod).flat());
  }
  return all;
}

/* ───────────── страница: файлы, формулы, код ───────────── */

function closure(file) {
  const seen = new Set([file]);
  const stack = [file];
  const resolveImport = (from, spec) => {
    let base;
    if (spec.startsWith("@/")) base = join(SRC, spec.slice(2));
    else if (spec.startsWith(".")) base = resolve(dirname(from), spec);
    else return null;
    for (const ext of ["", ".tsx", ".ts", "/index.tsx"]) if (existsSync(base + ext) && (base + ext).endsWith(".tsx")) return base + ext;
    return null;
  };
  while (stack.length) {
    const f = stack.pop();
    const text = readFileSync(f, "utf8");
    for (const m of text.matchAll(/import\s+[^;]*?from\s+["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g)) {
      const p = resolveImport(f, m[1] ?? m[2]);
      if (!p || seen.has(p) || /\/components\/(ui|math-symbols)\//.test(p) || (p.includes("/pages/") && p !== file)) continue;
      // Общие компоненты сайта (Navbar, Footer, LessonLayout…) формул страницы не несут.
      if (/\/components\/[A-Z][^/]*\.tsx$/.test(p) && !/Viz|Chart|Playground|Slider|Simulator/.test(p)) continue;
      seen.add(p);
      stack.push(p);
    }
  }
  return [...seen];
}

const isMd = entry.endsWith(".md");
let formulas = [];
let code = "";
if (isMd) {
  const r = mdFormulasOf(readFileSync(resolve(ROOT, entry), "utf8"));
  formulas = r.formulas;
  code = r.code.map((b) => b.code).join("\n");
} else {
  for (const f of closure(resolve(ROOT, entry))) {
    const src = readFileSync(f, "utf8");
    formulas.push(...formulasOf(src));
    code += codeBlocksOf(src).map((b) => b.code).join("\n") + "\n";
  }
}

/* ───────────── символы в порядке первого появления ───────────── */

const NEUTRAL_KEEP = /^\\(mathbb\{[EP]\}|sum|prod|max|min|arg\\max|arg\\min|log|exp|tanh|lim|int|nabla|partial|operatorname\{[^}]+\}|mathcal\{[A-Z]\})$/;
const order = [];
const seenKey = new Set();
for (const f of formulas) {
  if (f.dynamic) continue;
  for (const { role, atom } of coloredAtoms(f.tex)) {
    const k = `${role} ${atom}`;
    if (!seenKey.has(k)) seenKey.add(k), order.push({ role, atom });
  }
}
for (const f of formulas) {
  if (f.dynamic) continue;
  for (const atom of neutralAtoms(f.tex)) {
    const a = normalizeAtom(atom);
    if (!NEUTRAL_KEEP.test(a) || [...seenKey].some((k) => k.endsWith(" " + a))) continue;
    const k = `neutral ${a}`;
    if (!seenKey.has(k)) seenKey.add(k), order.push({ role: "neutral", atom: a });
  }
}

/* ───────────── имя в коде ───────────── */

const SYN = {
  "variable s": ["state", "obs", "observation", "states", "s"],
  "variable s'": ["next_state", "next_obs", "s_next", "next_states"],
  "function a": ["action", "actions", "act", "a"],
  "function \\pi": ["policy", "actor", "policy_net", "pi", "select_action", "get_action"],
  "parameter \\gamma": ["gamma", "GAMMA", "discount", "discount_factor"],
  "parameter \\alpha": ["alpha", "lr", "learning_rate", "ALPHA", "LR", "log_alpha"],
  "parameter \\varepsilon": ["epsilon", "eps", "clip_eps", "clip_epsilon", "clip_range", "EPSILON"],
  "parameter \\epsilon": ["epsilon", "eps", "clip_eps", "clip_epsilon", "clip_range", "EPSILON"],
  "parameter \\lambda": ["lambd", "lam", "gae_lambda", "lmbda", "lambda_"],
  "parameter \\theta": ["theta", "parameters", "params", "weights", "weight"],
  "parameter \\bar{\\theta}": ["target_net", "target", "theta_target", "target_params"],
  "parameter \\phi": ["phi", "critic", "value_net", "encoder"],
  "parameter \\tau": ["tau", "TAU", "polyak"],
  "parameter \\beta": ["beta", "BETA", "kl_coef", "ent_coef", "strength"],
  "parameter \\eta": ["eta", "lr", "learning_rate"],
  "target r": ["reward", "rewards", "r", "rew"],
  "target R": ["reward", "rewards", "R", "ret"],
  "operator G": ["G", "returns", "ret", "discounted_return", "G_t"],
  "operator V": ["V", "value", "values", "value_net", "critic", "v"],
  "operator Q": ["Q_table", "q_table", "Q", "q_values", "q_net", "qnet", "q1", "critic", "q"],
  "operator A": ["advantages", "advantage", "adv", "A"],
  "operator \\hat{A}": ["advantages", "advantage", "adv", "gae"],
  "variable \\delta": ["delta", "td_error", "deltas", "td"],
  "target \\delta": ["delta", "td_error", "deltas"],
  "target y": ["td_target", "target", "targets", "y", "q_target"],
  "target L": ["loss", "policy_loss", "value_loss", "critic_loss", "actor_loss", "L"],
  "target \\mathcal{L}": ["loss", "policy_loss", "value_loss", "critic_loss", "actor_loss"],
  "target J": ["objective", "J", "policy_loss", "loss"],
  "function r": ["ratio", "ratios", "r_t"],
  "operator \\mathcal{H}": ["entropy", "ent"],
  "operator H": ["entropy", "ent"],
  "target \\bar{\\mathcal{H}}": ["target_entropy"],
  "function \\mu": ["mu", "mean", "mean_layer"],
  "function \\sigma": ["std", "sigma", "log_std", "sigmoid"],
  "neutral \\mathbb{E}": ["mean"],
  "neutral \\sum": ["sum", "cumsum"],
  "neutral \\max": ["max", "argmax"],
  "neutral \\min": ["min", "minimum"],
  "neutral \\arg\\max": ["argmax"],
  "neutral \\log": ["log_prob", "log_probs", "log"],
  "neutral \\exp": ["exp"],
  "neutral \\tanh": ["tanh"],
  "neutral \\nabla": ["backward", "grad"],
  "operator \\nabla": ["backward", "grad", "gradient"],
  "neutral \\operatorname{clip}": ["clamp", "clip"],
  "neutral \\mathcal{D}": ["replay_buffer", "buffer", "memory", "dataset"],
  "neutral \\mathcal{N}": ["Normal", "normal"],
};

// Имя ищем только в самом коде: строки и комментарии вычищаются, иначе
// «Q» найдётся в print("Q-таблица") вместо настоящего Q_table.
const stripLine = (l) =>
  l
    .replace(/(["'])(?:\\.|(?!\1).)*\1/g, '""')
    .replace(/\s(#|\/\/).*$/, "")
    .replace(/^\s*(#|\/\/).*$/, "");
const codeLines = code
  .split("\n")
  .map((l) => ({ raw: l.trim(), bare: stripLine(l) }))
  .filter((l) => l.raw);
const identRe = (ident) => new RegExp(`(?<![A-Za-z0-9_])${ident.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-z0-9_])`);
const has = (ident) => codeLines.some((l) => identRe(ident).test(l.bare));

function codeLine(ident) {
  const re = identRe(ident);
  const hits = codeLines.filter((l) => re.test(l.bare) && l.raw.length <= 90 && !/[`$\\]/.test(l.raw)).map((l) => l.raw);
  return hits.find((l) => new RegExp(`^(self\\.)?${ident}\\s*[:=]`).test(l)) ?? hits.find((l) => /[=:]/.test(l)) ?? hits[0];
}

const glossary = await loadGlossary();
const findEntry = (role, atom) =>
  glossary.find((e) => e.role === role && normalizeAtom(e.tex) === atom) ?? glossary.find((e) => normalizeAtom(e.tex) === atom);

const identsOf = (s) =>
  [...String(s ?? "").matchAll(/[A-Za-z_][A-Za-z0-9_]*/g)]
    .map((m) => m[0])
    .filter((w) => !/^(np|torch|nn|F|self|import|from|for|in|or|or|и|или|float|int|len|range|env|dist|x|i)$/.test(w));

// Значения уже «сырые» (String.raw): слеши оставляем как есть, а обратную
// кавычку экранируем ровно одним слешем — RichText снимет его при выводе.
const esc = (s) => String(s).replace(/\\`/g, "`").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
const rows = [];
let todo = 0;
for (const { role, atom } of order) {
  const e = findEntry(role, atom);
  const k = `${role} ${atom}`;
  const candidates = [...(SYN[k] ?? []), ...identsOf(e?.code)];
  const ident = code ? candidates.find(has) : undefined;
  const line = ident ? codeLine(ident) : undefined;
  const fields = [
    `tex: r\`${esc(atom)}\``,
    `role: "${role}"`,
    `name: r\`${esc(e?.name ?? "TODO")}\``,
    `meaning: r\`${esc(e?.meaning ?? "TODO")}\``,
  ];
  if (e?.inFormula) fields.push(`inFormula: r\`${esc(e.inFormula)}\``);
  fields.push(`code: r\`${esc(ident ?? e?.code ?? "—")}\``);
  if (e?.codeType) fields.push(`codeType: r\`${esc(e.codeType)}\``);
  const note = line ? `В коде страницы: \`${line}\`.` : e?.codeNote;
  if (note) fields.push(`codeNote: r\`${esc(note)}\``);
  const mark = ident ? "" : ((todo++), " // TODO: сверить с кодом");
  rows.push(`  {${mark}\n    ${fields.join(",\n    ")},\n  },`);
}

const out = `import type { PageSymbols } from "../types";

const r = String.raw;

/** Символы страницы: от формулы к коду. Черновик — scripts/symbol-table-draft.mjs. */
const table: PageSymbols = {
  id: "${id}",
  symbols: [
${rows.join("\n")}
  ],
};

export default table;
`;
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, out);
console.log(`${relative(ROOT, OUT)}: ${rows.length} символов, без имени в коде: ${todo}`);
