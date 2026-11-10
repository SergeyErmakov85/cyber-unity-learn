import { execFileSync } from "node:child_process";

/** Проверяем дерево Git один раз, не загружая blobs в partial clone.
 * Ошибка доступа/отсутствующая ветка — ошибка проверки, а не сотня «404».
 */
export function repositoryTree(directory) {
  const git = (args) =>
    execFileSync("git", ["-C", directory, ...args], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 16 * 1024 * 1024,
    });
  let ref = "origin/main";
  try {
    ref = git(["symbolic-ref", "refs/remotes/origin/HEAD"]).trim();
  } catch {
    /* Репозиторий может не иметь origin/HEAD. */
  }
  try {
    const paths = new Set(
      git(["ls-tree", "-r", "-t", "--name-only", "-z", ref])
        .split("\0")
        .filter(Boolean),
    );
    return { ref, paths };
  } catch (error) {
    throw new Error(
      `Не удалось прочитать дерево ${ref} в ${directory}: ${String(error.stderr || error.message).trim()}`,
    );
  }
}
