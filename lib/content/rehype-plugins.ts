/**
 * 博客专用的 Markdown 效果（rehype 插件）。语法说明见 docs/WRITING.md。
 */
import fs from "node:fs";
import path from "node:path";
import type { Element, ElementContent, Root } from "hast";
import { imageSize } from "image-size";
import { visit } from "unist-util-visit";

const CALLOUTS: Record<string, string> = {
  note: "注 · NOTE",
  tip: "技巧 · TIP",
  important: "重要 · IMPORTANT",
  warning: "注意 · WARNING",
  caution: "警告 · CAUTION",
  feel: "体会 · FEEL",
};

const isBlank = (n: ElementContent) => n.type === "text" && !n.value.trim();

/** > [!TIP] 可选标题 —— 把引用块变成提示框 */
export function rehypeCallouts() {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "blockquote") return;
      const first = node.children.find((c): c is Element => c.type === "element");
      if (first?.tagName !== "p" || first.children[0]?.type !== "text") return;
      const text = first.children[0];
      const m = /^\[!(\w+)\][ \t]*([^\n]*)\n?/.exec(text.value);
      const type = m?.[1].toLowerCase();
      if (!m || !type || !Object.hasOwn(CALLOUTS, type)) return;

      text.value = text.value.slice(m[0].length);
      if (first.children.every(isBlank)) node.children.splice(node.children.indexOf(first), 1);

      node.tagName = "aside";
      node.properties = { className: ["callout", `callout-${type}`] };
      node.children.unshift({
        type: "element",
        tagName: "div",
        properties: { className: ["callout-title"] },
        children: [{ type: "text", value: m[2] || CALLOUTS[type] }],
      });
    });
  };
}

/** 本站图片（public/ 下）补上宽高，加载时页面不会跳动 */
function setImageSize(img: Element) {
  const src = String(img.properties.src ?? "");
  if (!src.startsWith("/") || img.properties.width) return;
  const file = path.join(process.cwd(), "public", decodeURI(src.split(/[?#]/)[0]));
  try {
    const { width, height } = imageSize(fs.readFileSync(file));
    if (width && height) Object.assign(img.properties, { width, height });
  } catch {
    // 图片不存在或格式不认识时保持原样
  }
}

/** 单独成段、带标题的图片 ![说明](图片 "图注") → <figure> + 图注；所有图片懒加载并补上宽高 */
export function rehypeFigures() {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName === "img") {
        node.properties.loading = "lazy";
        node.properties.decoding = "async";
        setImageSize(node);
      }
      if (node.tagName !== "p" || !parent || index === undefined) return;
      const kids = node.children.filter((c) => !isBlank(c));
      const img = kids[0];
      if (kids.length !== 1 || img.type !== "element" || img.tagName !== "img" || !img.properties.title) return;
      const caption = String(img.properties.title);
      delete img.properties.title;
      parent.children[index] = {
        type: "element",
        tagName: "figure",
        properties: {},
        children: [img, { type: "element", tagName: "figcaption", properties: {}, children: [{ type: "text", value: caption }] }],
      };
    });
  };
}

/** 站外链接在新标签页打开 */
export function rehypeExternalLinks() {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "a" && /^https?:\/\//.test(String(node.properties.href ?? ""))) {
        node.properties.target = "_blank";
        node.properties.rel = ["noopener", "noreferrer"];
      }
    });
  };
}
