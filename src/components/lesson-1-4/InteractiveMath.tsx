import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import MathRenderer from "@/components/Math";
import { MATH_SYMBOLS, type MathSymbolDetail } from "./symbol-data";
import "./interactive-math.css";

interface InteractiveMathProps {
  children: string;
  display?: boolean;
  className?: string;
}
interface ActiveSymbol {
  detail: MathSymbolDetail;
  x: number;
  y: number;
  below: boolean;
}

const InteractiveMath = ({ children, display = true, className = "" }: InteractiveMathProps) => {
  const blockRootRef = useRef<HTMLDivElement>(null);
  const inlineRootRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ActiveSymbol | null>(null);

  useEffect(() => {
    const root = display ? blockRootRef.current : inlineRootRef.current;
    if (!root) return;
    const describeTriggers = () => {
      root.querySelectorAll<HTMLElement>(".l14-math-symbol-trigger").forEach((trigger) => {
        const symbolClass = [...trigger.classList].find((name) => name.startsWith("l14-symbol--"));
        const id = symbolClass?.slice("l14-symbol--".length);
        const detail = id ? MATH_SYMBOLS[id] : undefined;
        if (!detail) return;
        trigger.tabIndex = 0;
        trigger.setAttribute("role", "button");
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("aria-label", detail.notation + ": " + detail.name + ". Нажмите, чтобы открыть объяснение.");
      });
    };
    const activate = (trigger: HTMLElement) => {
      const symbolClass = [...trigger.classList].find((name) => name.startsWith("l14-symbol--"));
      const id = symbolClass?.slice("l14-symbol--".length);
      const detail = id ? MATH_SYMBOLS[id] : undefined;
      if (!detail) return;
      const rect = trigger.getBoundingClientRect();
      const halfWidth = Math.min(184, window.innerWidth / 2 - 12);
      const x = Math.max(halfWidth + 12, Math.min(rect.left + rect.width / 2, window.innerWidth - halfWidth - 12));
      const below = rect.top < 145;
      setActive({ detail, x, y: below ? rect.bottom + 10 : rect.top - 10, below });
    };
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      const trigger = (event.target as HTMLElement).closest<HTMLElement>(".l14-math-symbol-trigger");
      if (trigger && root.contains(trigger)) activate(trigger);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const trigger = (event.target as HTMLElement).closest<HTMLElement>(".l14-math-symbol-trigger");
      if (trigger && root.contains(trigger)) {
        event.preventDefault();
        activate(trigger);
      }
    };
    const observer = new MutationObserver(describeTriggers);
    observer.observe(root, { childList: true, subtree: true });
    describeTriggers();
    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKeyDown);
    return () => {
      observer.disconnect();
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKeyDown);
    };
  }, [children, display]);

  useEffect(() => {
    if (!active) return;
    const closeOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (blockRootRef.current?.contains(target) || inlineRootRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      setActive(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    const closeOnScroll = () => setActive(null);
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("scroll", closeOnScroll, true);
    window.addEventListener("resize", closeOnScroll);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("scroll", closeOnScroll, true);
      window.removeEventListener("resize", closeOnScroll);
    };
  }, [active]);

  const math = <MathRenderer display={display}>{children}</MathRenderer>;
  const popover = active ? createPortal(
    <div
      ref={popoverRef}
      role="dialog"
      aria-label={"Обозначение " + active.detail.notation}
      className={"l14-symbol-popover" + (active.below ? " l14-symbol-popover--below" : "")}
      style={{ left: active.x, top: active.y }}
    >
      <div className="l14-symbol-popover__top">
        <span className={"l14-symbol-popover__notation enf-" + active.detail.role}>{active.detail.notation}</span>
        <span className={"l14-symbol-popover__role enf-" + active.detail.role}>{active.detail.role}</span>
        <button type="button" className="l14-symbol-popover__close" aria-label="Закрыть объяснение" onClick={() => setActive(null)}>×</button>
      </div>
      <h4>{active.detail.name}</h4>
      <p>{active.detail.explanation}</p>
      <p><strong>Роль в формуле:</strong> {active.detail.formulaRole}</p>
      <p><strong>В Python:</strong> <code>{active.detail.python}</code></p>
    </div>,
    document.body,
  ) : null;

  return display ? (
    <div ref={blockRootRef} className={"l14-interactive-math " + className}>{math}{popover}</div>
  ) : (
    <span ref={inlineRootRef} className={"l14-interactive-math " + className}>{math}{popover}</span>
  );
};

export default InteractiveMath;

