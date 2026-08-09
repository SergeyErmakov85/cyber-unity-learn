import { useEffect, useId, useRef, useState } from "react";

/**
 * Диаграмма mermaid из блока ```mermaid.
 *
 * Библиотека грузится динамически и только на страницах, где диаграмма
 * действительно есть (в пособии таких девять) — в основной бандл она не входит.
 * Тема собирается из токенов сайта, чтобы диаграмма не выглядела вставкой
 * из другого документа.
 */
const MermaidDiagram = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      try {
        // Ширину узлов mermaid считает по метрикам шрифта. Если рендерить до
        // того, как загрузится Inter, ширина берётся по запасному шрифту,
        // и подписи обрезаются.
        await document.fonts?.ready;

        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "strict",
          fontFamily: "Inter, system-ui, sans-serif",
          flowchart: { useMaxWidth: true, htmlLabels: true, padding: 12 },
          themeVariables: {
            background: "transparent",
            primaryColor: "#171a24",
            primaryTextColor: "#e6eaef",
            primaryBorderColor: "#00ffd6",
            lineColor: "#7c8595",
            secondaryColor: "#231e3d",
            tertiaryColor: "#2a1c2e",
          },
        });
        const id = `mermaid-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    };

    void render();
    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  if (error) {
    return (
      <pre className="my-4 overflow-x-auto rounded-lg border border-destructive/40 bg-card/60 p-4 text-xs text-muted-foreground">
        {chart}
      </pre>
    );
  }

  return (
    <div
      ref={ref}
      className="my-6 overflow-x-auto rounded-lg border border-border/40 bg-card/40 p-4 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
    />
  );
};

export default MermaidDiagram;
