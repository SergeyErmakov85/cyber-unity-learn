import { isValidElement, type ReactElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import { KATEX_OPTIONS } from "@/lib/katex-options";
import { remarkEnfCallouts } from "@/lib/remark-enf-callouts";
import { slugify } from "@/lib/slug";
import { unityLabUrl } from "@/lib/textbook-links";
import { UNITY_BRIDGE } from "@/content/textbook/index.generated";
import CyberCodeBlock from "@/components/CyberCodeBlock";
import LectureLink from "./LectureLink";
import MermaidDiagram from "./MermaidDiagram";
import { TextbookContext } from "./TextbookContext";

/** Текст заголовка для якоря: markdown внутри уже разобран в узлы. */
const textOf = (node: ReactNode): string => {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) return textOf((node.props as { children?: ReactNode }).children);
  return "";
};

/**
 * Якоря считаются той же slugify, что и на остальном сайте, — иначе ссылки
 * вида `05-bellman-equations.md#уравнение-ожиданий-беллмана` не найдут цель.
 */
const heading = (Tag: "h2" | "h3" | "h4") => {
  const Heading = ({ children }: { children?: ReactNode }) => (
    <Tag id={slugify(textOf(children))}>{children}</Tag>
  );
  return Heading;
};

/**
 * Пути к коду сред. По соглашению ENF в тексте они набраны обратными кавычками
 * без ссылки — так материал остаётся верным вне сайта. На сайте же путь стоит
 * сделать кликабельным: репозиторий лаборатории публичный, и переход туда —
 * ровно то, ради чего путь и указан. Ссылку получают только пути из реестра
 * _meta/unity-bridge.md, поэтому обычный `код` в тексте не превращается в ссылку.
 */
const UNITY_PATHS = new Set(UNITY_BRIDGE.map((row) => row.path));

const components: Components = {
  h2: heading("h2"),
  h3: heading("h3"),
  h4: heading("h4"),
  a: LectureLink,

  code: ({ className, children }) => {
    const text = textOf(children);
    if (!className && UNITY_PATHS.has(text)) {
      return (
        <a
          href={unityLabUrl(text)}
          target="_blank"
          rel="noopener noreferrer"
          title="Открыть в репозитории сред Unity ML-Agents"
        >
          <code>{text}</code>
        </a>
      );
    }
    return <code className={className}>{children}</code>;
  },

  // Блочный код: react-markdown 9 не различает inline/block на уровне `code`,
  // поэтому разбираем `pre` и достаём язык из вложенного `code`.
  pre: ({ children }) => {
    const child = (Array.isArray(children) ? children[0] : children) as ReactElement<{
      className?: string;
      children?: ReactNode;
    }>;
    const className = isValidElement(child) ? (child.props.className ?? "") : "";
    const language = /language-([\w-]+)/.exec(className)?.[1];
    const code = textOf(isValidElement(child) ? child.props.children : children).replace(/\n$/, "");

    if (language === "mermaid") return <MermaidDiagram chart={code} />;
    if (language === "python" || language === "csharp") {
      return <CyberCodeBlock language={language}>{code}</CyberCodeBlock>;
    }
    return (
      <pre className="my-4 overflow-x-auto rounded-lg border border-primary/20 bg-[hsl(var(--cyber-darker))] p-4">
        <code className="font-mono text-sm text-muted-foreground">{code}</code>
      </pre>
    );
  },
};

interface MarkdownLectureProps {
  source: string;
  /** Каталог части — база для относительных ссылок внутри пособия. */
  partDir: string;
  /** Убрать H1: заголовок страницы рисует сама страница. */
  stripTitle?: boolean;
}

const MarkdownLecture = ({ source, partDir, stripTitle = true }: MarkdownLectureProps) => {
  const body = stripTitle ? source.replace(/^\s*#\s+.+\r?\n/, "") : source;

  return (
    <TextbookContext.Provider value={{ partDir }}>
      <div className="prose prose-invert textbook-prose max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath, remarkEnfCallouts]}
          rehypePlugins={[[rehypeKatex, KATEX_OPTIONS]]}
          components={components}
        >
          {body}
        </ReactMarkdown>
      </div>
    </TextbookContext.Provider>
  );
};

export default MarkdownLecture;
