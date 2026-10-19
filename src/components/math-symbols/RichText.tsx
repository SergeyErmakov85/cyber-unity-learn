import { Fragment, type ReactNode } from "react";
import Math from "@/components/Math";

/**
 * Текст словаря символов: строчная математика в `$...$`, код в `` `...` ``.
 * Формулы рендерит тот же `Math`, поэтому и они окрашены ролями и кликабельны.
 */
const TOKEN = /(\$[^$\n]+\$|`[^`\n]+`)/g;

const RichText = ({ text, className }: { text: ReactNode; className?: string }) => {
  // Не строка (готовый JSX, число) — рендерим как есть: так RichText можно
  // ставить вместо `{item.text}` и там, где в данных встречается разметка.
  if (typeof text !== "string") return <span className={className}>{text}</span>;
  // В String.raw`…` обратную кавычку приходится экранировать, и `\`` доходит
  // сюда вместе с обратной косой чертой: снимаем её до разбора.
  const parts = text.replace(/\\`/g, "`").split(TOKEN);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
          return <Math key={i} display={false}>{part.slice(1, -1)}</Math>;
        }
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return (
            <code key={i} className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </span>
  );
};

export default RichText;
