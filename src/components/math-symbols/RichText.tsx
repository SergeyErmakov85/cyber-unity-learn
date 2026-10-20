import { Fragment } from "react";
import Math from "@/components/Math";

/**
 * Текст словаря символов: `$...$` — формула KaTeX (с макросами ролей),
 * обратные кавычки — код. Больше никакой разметки — пояснения короткие.
 */
const TOKEN = /(\$[^$]+\$|`[^`]+`)/g;

const RichText = ({ text, codeClassName = "" }: { text: string; codeClassName?: string }) => (
  <>
    {text.split(TOKEN).map((part, i) => {
      if (!part) return null;
      if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
        return <Math key={i} display={false}>{part.slice(1, -1)}</Math>;
      }
      if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
        return (
          <code
            key={i}
            className={`rounded bg-muted/50 px-1 py-0.5 font-mono text-[0.85em] text-primary ${codeClassName}`}
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return <Fragment key={i}>{part}</Fragment>;
    })}
  </>
);

export default RichText;
