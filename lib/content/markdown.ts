/** Markdown → HTML 渲染管线。支持的语法与效果见 docs/WRITING.md */
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";
import type { Root } from "hast";
import { rehypeCallouts, rehypeExternalLinks, rehypeFigures } from "./rehype-plugins";

export type Heading = { id: string; text: string };

export async function renderMarkdown(src: string) {
  // 在 rehype-slug 之后从 HTML 树里收集 h2，id 与正文锚点保证一致，也不会误读代码块
  const headings: Heading[] = [];
  const collectHeadings = () => (tree: Root) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "h2" && typeof node.properties.id === "string") {
        headings.push({ id: node.properties.id, text: toString(node) });
      }
    });
  };

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    // allowDangerousHtml + 下面的 rehypeRaw：允许在 Markdown 里直接写 HTML（视频、折叠块等）。文章只有站长自己写，所以不做过滤
    .use(remarkRehype, {
      allowDangerousHtml: true,
      footnoteLabel: "注释",
      footnoteLabelTagName: "h3",
      footnoteLabelProperties: { className: ["footnote-label"] },
      footnoteBackLabel: "回到正文",
    })
    .use(rehypeSlug)
    .use(collectHeadings)
    .use(rehypeCallouts)
    .use(rehypeFigures)
    .use(rehypeExternalLinks)
    .use(rehypeKatex)
    .use(rehypePrettyCode, { theme: "vitesse-black", keepBackground: false })
    // 必须放在代码高亮之后：rehype-raw 会重建语法树，丢掉代码块上的 title / showLineNumbers 等信息
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(src);

  return { html: String(file), headings };
}
