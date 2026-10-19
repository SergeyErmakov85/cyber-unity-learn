import type { Element, Root, Text } from "hast";
import { visit, SKIP } from "unist-util-visit";
import { tagEnfSymbols } from "@/lib/enf-symbols";

/**
 * Готовит формулы лекций учебника к карточкам символов — так же, как это
 * делает компонент `Math` для TSX-страниц. Плагин стоит ПЕРЕД rehype-katex:
 *
 *  1. TeX внутри узла формулы размечается `tagEnfSymbols`, чтобы у каждого
 *     ролевого символа в HTML появился ключ `data-enfs`;
 *  2. узел оборачивается в элемент с `data-enf-tex` — исходной формулой,
 *     которую карточка показывает с подсвеченным символом.
 *
 * remark-math выдаёт строчную формулу как `<code class="math-inline">`, а
 * выключную — как `<pre><code class="math-display">`. rehype-katex узнаёт
 * выключную формулу по родителю `pre`, поэтому обёртка ставится снаружи `pre`.
 */
const classesOf = (el: Element): string[] => {
  const cls = el.properties?.className;
  return Array.isArray(cls) ? cls.map(String) : [];
};

const isMathCode = (el: Element) =>
  el.tagName === "code" &&
  classesOf(el).some((c) => c === "math-inline" || c === "math-display" || c === "language-math");

const textOf = (el: Element): string =>
  el.children
    .map((c) => (c.type === "text" ? (c as Text).value : c.type === "element" ? textOf(c) : ""))
    .join("");

/** Размечает TeX в узле и возвращает исходник. */
const retag = (code: Element): string => {
  const tex = textOf(code);
  code.children = [{ type: "text", value: tagEnfSymbols(tex) }];
  return tex;
};

export function rehypeEnfSymbols() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (index === undefined || !parent) return;

      // Выключная формула: <pre><code class="math-display">…</code></pre>.
      if (node.tagName === "pre") {
        const code = node.children.find((c): c is Element => c.type === "element" && isMathCode(c));
        if (!code) return;
        const tex = retag(code);
        parent.children[index] = {
          type: "element",
          tagName: "div",
          properties: { dataEnfTex: tex },
          children: [node],
        };
        return SKIP;
      }

      // Строчная формула: <code class="math-inline">…</code> вне pre.
      if (isMathCode(node)) {
        const tex = retag(node);
        parent.children[index] = {
          type: "element",
          tagName: "span",
          properties: { dataEnfTex: tex },
          children: [node],
        };
        return SKIP;
      }
    });
  };
}
