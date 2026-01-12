import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import rehypeShiki from "@shikijs/rehype";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import type { Code, Heading, Root as MdastRoot } from "mdast";
import type { Element, Root as HastRoot } from "hast";

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function parseFilename(meta?: string | null): string | null {
  if (!meta) {
    return null;
  }
  const match = meta.match(/filename="([^"]+)"/);
  if (match) {
    return match[1];
  }
  const fallback = meta.match(/filename=([^\s]+)/);
  return fallback ? fallback[1] : null;
}

function remarkHeadingIds() {
  return (tree: MdastRoot) => {
    const slugger = new GithubSlugger();
    visit(tree, "heading", (node: Heading) => {
      if (node.depth !== 2 && node.depth !== 3) {
        return;
      }
      const text = toString(node);
      const id = slugger.slug(text);
      node.data = node.data ?? {};
      node.data.hProperties = {
        ...(node.data.hProperties ?? {}),
        id,
      };
    });
  };
}

function remarkCodeMeta() {
  return (tree: MdastRoot) => {
    visit(tree, "code", (node: Code) => {
      const filename = parseFilename(node.meta);
      if (!filename) {
        return;
      }
      node.data = node.data ?? {};
      node.data.hProperties = {
        ...(node.data.hProperties ?? {}),
        "data-filename": filename,
      };
    });
  };
}

function rehypeCodeBlocks() {
  return (tree: HastRoot) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (!parent || typeof index !== "number") {
        return;
      }
      if (node.tagName !== "pre") {
        return;
      }

      const filename =
        typeof node.properties?.["data-filename"] === "string"
          ? (node.properties?.["data-filename"] as string)
          : null;

      const headerChildren: Element[] = [
        {
          type: "element",
          tagName: "span",
          properties: { className: ["code-block__filename"] },
          children: [{ type: "text", value: filename ?? "Code" }],
        },
        {
          type: "element",
          tagName: "button",
          properties: {
            type: "button",
            className: ["code-block__copy"],
            "data-code-copy": "true",
          },
          children: [{ type: "text", value: "Copy" }],
        },
      ];

      const wrapper: Element = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["code-block"],
          "data-code-block": "true",
        },
        children: [
          {
            type: "element",
            tagName: "div",
            properties: { className: ["code-block__header"] },
            children: headerChildren,
          },
          {
            type: "element",
            tagName: "div",
            properties: { className: ["code-block__content"] },
            children: [node],
          },
        ],
      };

      parent.children[index] = wrapper;
    });
  };
}

export function extractToc(markdown: string): TocItem[] {
  const tree = unified().use(remarkParse).parse(markdown) as MdastRoot;
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];

  visit(tree, "heading", (node: Heading) => {
    if (node.depth !== 2 && node.depth !== 3) {
      return;
    }
    const text = toString(node);
    items.push({
      id: slugger.slug(text),
      text,
      level: node.depth,
    });
  });

  return items;
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkHeadingIds)
    .use(remarkCodeMeta)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeShiki, {
      theme: "github-dark",
      defaultLanguage: "text",
    })
    .use(rehypeCodeBlocks)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}
