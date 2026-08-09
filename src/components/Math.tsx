import { useRef, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { KATEX_OPTIONS } from "@/lib/katex-options";

interface MathProps {
  /** LaTeX string */
  children: string;
  /** Display mode (block) or inline */
  display?: boolean;
  /** Optional extra class */
  className?: string;
}

/**
 * Renders a LaTeX formula using KaTeX.
 * - `display` (default true) renders a centered block formula.
 * - Inline mode renders within text flow.
 */
const Math = ({ children, display = true, className = "" }: MathProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      katex.render(children, ref.current, {
        ...KATEX_OPTIONS,
        displayMode: display,
      });
    }
  }, [children, display]);

  if (display) {
    return (
      <div className={`my-4 p-4 rounded-lg bg-card/80 border border-primary/20 overflow-x-auto ${className}`}>
        <span ref={ref} className="text-foreground" />
      </div>
    );
  }

  return <span ref={ref} className={`text-foreground ${className}`} />;
};

export default Math;
