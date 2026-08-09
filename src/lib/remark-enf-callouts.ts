import { visit } from "unist-util-visit";
import type { Root, Blockquote, Paragraph, PhrasingContent, RootContent } from "mdast";

/**
 * Коллауты Obsidian → размеченный div.
 *
 *   > [!theorem] Теорема 2. Единственность предела
 *   > Последовательность имеет не более одного предела.
 *
 * превращается в
 *
 *   <div class="enf-callout" data-callout="theorem">
 *     <div class="enf-callout-title">Теорема 2. Единственность предела</div>
 *     <p>Последовательность имеет не более одного предела.</p>
 *   </div>
 *
 * Заголовок остаётся деревом inline-узлов, а не строкой: в нём встречается
 * математика («Почему $\gamma < 1$ появляется так часто»), и remark-math
 * должен её увидеть. Оформление — CSS по data-callout, см. styles/textbook.css.
 */

export const CALLOUT_TYPES = [
  "definition",
  "theorem",
  "lemma",
  "corollary",
  "proof",
  "example",
  "remark",
  "warning",
  "intuition",
  "note",
  "important",
  "tip",
] as const;

export type CalloutType = (typeof CALLOUT_TYPES)[number];

const KNOWN = new Set<string>(CALLOUT_TYPES);

/** Делит inline-узлы первого абзаца по первому переводу строки. */
const splitFirstLine = (children: PhrasingContent[]) => {
  const title: PhrasingContent[] = [];
  const rest: PhrasingContent[] = [];
  let done = false;

  for (const child of children) {
    if (!done && child.type === "text" && child.value.includes("\n")) {
      const i = child.value.indexOf("\n");
      const head = child.value.slice(0, i);
      const tail = child.value.slice(i + 1);
      if (head) title.push({ ...child, value: head });
      if (tail) rest.push({ ...child, value: tail });
      done = true;
      continue;
    }
    (done ? rest : title).push(child);
  }

  return { title, rest };
};

export function remarkEnfCallouts() {
  return (tree: Root) => {
    visit(tree, "blockquote", (node: Blockquote) => {
      const first = node.children[0];
      if (!first || first.type !== "paragraph") return;

      const lead = first.children[0];
      if (!lead || lead.type !== "text") return;

      const match = /^\[!([A-Za-z]+)\]\s*/.exec(lead.value);
      if (!match) return;

      const type = match[1].toLowerCase();
      if (!KNOWN.has(type)) return;

      const head: Paragraph = {
        ...first,
        children: [{ ...lead, value: lead.value.slice(match[0].length) }, ...first.children.slice(1)],
      };
      const { title, rest } = splitFirstLine(head.children);

      const titleNode: Paragraph = {
        type: "paragraph",
        children: title,
        data: { hName: "div", hProperties: { className: ["enf-callout-title"] } },
      };

      const body: RootContent[] = [];
      if (rest.length > 0) body.push({ type: "paragraph", children: rest });
      body.push(...node.children.slice(1));

      node.children = [titleNode, ...body] as Blockquote["children"];
      node.data = {
        ...node.data,
        hName: "div",
        hProperties: { className: ["enf-callout"], "data-callout": type },
      };
    });
  };
}
