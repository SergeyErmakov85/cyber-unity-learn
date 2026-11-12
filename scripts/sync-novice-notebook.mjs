/** RoomBot в ноутбуке и на странице берёт код из одного Python-файла. */
import { readFileSync, writeFileSync } from "node:fs";

const source = new URL("../src/content/novice/code/room_bot.py", import.meta.url);
const target = new URL("../public/RoomBot_MDP_Lesson_1.3.ipynb", import.meta.url);
const notebook = JSON.parse(readFileSync(target, "utf8"));
const [functions, main] = readFileSync(source, "utf8").split('if __name__ == "__main__":\n');
if (!main) throw new Error("Не найден блок запуска RoomBot");
const updates = {
  "roombot-03": functions,
  "roombot-05": main.replace(/^ {4}/gm, ""),
};
let changed = false;
for (const [id, code] of Object.entries(updates)) {
  const cell = notebook.cells.find(item => item.id === id);
  if (!cell) throw new Error(`Не найдена ячейка ${id}`);
  const lines = code.match(/[^\n]*\n|[^\n]+$/g) ?? [];
  if (JSON.stringify(cell.source) !== JSON.stringify(lines)) changed = true;
  cell.source = lines;
}
if (process.argv.includes("--check")) {
  if (changed) throw new Error("Код RoomBot отличается от ноутбука: node scripts/sync-novice-notebook.mjs");
  console.log("RoomBot: код страницы и ноутбука совпадает");
} else {
  writeFileSync(target, JSON.stringify(notebook, null, 1) + "\n");
  console.log("Ноутбук RoomBot синхронизирован");
}
