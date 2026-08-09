import Math from "@/components/Math";

/**
 * Легенда ролевой раскраски. Без неё цвет в формулах читается как украшение;
 * с ней — как часть нотации: тон закреплён за ролью сущности, а не за символом.
 */
const ROLES = [
  { cls: "enf-variable", macro: "\\enfVar{x}", name: "переменная", hint: "объект, над которым действуем" },
  { cls: "enf-function", macro: "\\enfFun{f}", name: "функция", hint: "действие, преобразование" },
  { cls: "enf-parameter", macro: "\\enfPar{\\gamma}", name: "параметр", hint: "то, что настраивается и обучается" },
  { cls: "enf-operator", macro: "\\enfOp{\\mathbb{E}}", name: "оператор", hint: "агрегат, свёртка, ожидание" },
  { cls: "enf-target", macro: "\\enfTgt{r}", name: "цель", hint: "награда, потери — то, что оптимизируем" },
];

const ColorLegend = () => (
  <details className="group my-6 rounded-lg border border-border/50 bg-card/40 px-4 py-3">
    <summary className="cursor-pointer list-none text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
      <span className="mr-2 inline-block transition-transform group-open:rotate-90">▸</span>
      Что означают цвета в формулах
    </summary>

    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {ROLES.map((role) => (
        <div key={role.cls} className="flex items-baseline gap-2 text-sm">
          <span className="flex-none">
            <Math display={false}>{role.macro}</Math>
          </span>
          <span>
            <span className={`font-medium ${role.cls}`}>{role.name}</span>
            <span className="text-muted-foreground"> — {role.hint}</span>
          </span>
        </div>
      ))}
    </div>

    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
      Тон закреплён за ролью, а не за конкретным символом: если <Math display={false}>{"\\theta"}</Math> введена
      как параметр, она остаётся параметром до конца лекции. Роль продублирована начертанием
      (<Math display={false}>{"\\mathbf{x}"}</Math> — вектор, <Math display={false}>{"\\mathcal{S}"}</Math> — множество),
      поэтому текст читается однозначно и без цвета.
    </p>
  </details>
);

export default ColorLegend;
