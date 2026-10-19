import { Fragment } from "react";
import Math from "@/components/Math";

/**
 * Текст словаря символов: строчная математика в `$...$`, код в `` `...` ``.
 * Формулы рендерит тот же `Math`, поэтому и они окрашены ролями и кликабельны.
 */
const TOKEN = /(\$[^$\n]+\$|`[^`\n]+`)/g;

const RichText = ({ text, className }: { text: string; className?: string }) => {
  const parts = text.split(TOKEN);
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
