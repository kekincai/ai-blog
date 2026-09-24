import { getAllPosts, readPostSource } from "@/lib/content/posts";

export const dynamic = "force-static";

/** 站内搜索的索引：构建时生成，浏览器端搜索 */
export function GET() {
  const index = getAllPosts().map((meta) => ({ ...meta, text: toPlainText(readPostSource(meta.slug)) }));
  return Response.json(index);
}

/** 去掉 Markdown 标记，只留文字，用于全文匹配 */
function toPlainText(md: string) {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|[\]-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
