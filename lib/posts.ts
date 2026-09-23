import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";
import type { Root } from "hast";
import { categories, type CategoryKey } from "./site";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: CategoryKey;
  excerpt: string;
  tags: string[];
  featured: boolean;
  minutes: number;
  no: number; // 按时间顺序的编号
  notes: string[]; // 文章右侧的边注
  feel: string; // 文末「体会」框
};

export type Heading = { id: string; text: string };

export type Post = PostMeta & { html: string; headings: Heading[] };

function readingMinutes(src: string) {
  const cjk = (src.match(/[぀-ヿ㐀-鿿]/g) ?? []).length;
  const words = src.replace(/[぀-ヿ㐀-鿿]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(cjk / 400 + words / 220));
}

function readRaw() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? "");
      const category = data.category ?? "learn";
      if (!Object.hasOwn(categories, category)) {
        throw new Error(`content/posts/${file}: category "${category}" 无效，只能是 ${Object.keys(categories).join(" / ")}`);
      }
      return {
        slug,
        content,
        meta: {
          slug,
          title: String(data.title ?? slug),
          date,
          category: category as CategoryKey,
          excerpt: String(data.excerpt ?? ""),
          tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
          featured: Boolean(data.featured),
          minutes: readingMinutes(content),
          no: 0,
          notes: Array.isArray(data.notes) ? data.notes.map(String) : [],
          feel: String(data.feel ?? ""),
        } satisfies PostMeta,
      };
    });
}

/** 所有文章，按日期倒序 */
export function getAllPosts(): PostMeta[] {
  const list = readRaw().map((r) => r.meta);
  const asc = [...list].sort((a, b) => a.date.localeCompare(b.date));
  asc.forEach((p, i) => (p.no = i + 1));
  return asc.reverse();
}

export function getPostsByCategory(cat: CategoryKey) {
  return getAllPosts().filter((p) => p.category === cat);
}

export function getFeaturedPost() {
  const all = getAllPosts();
  return all.find((p) => p.featured) ?? all[0];
}

export async function getPost(slug: string): Promise<Post | null> {
  const raw = readRaw().find((r) => r.slug === slug);
  if (!raw) return null;
  const meta = getAllPosts().find((p) => p.slug === slug)!;

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
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(collectHeadings)
    .use(rehypePrettyCode, { theme: "vitesse-black", keepBackground: false })
    .use(rehypeStringify)
    .process(raw.content);

  return { ...meta, html: String(file), headings };
}

export function getAdjacent(slug: string) {
  const all = getAllPosts(); // 新 → 旧
  const i = all.findIndex((p) => p.slug === slug);
  return { newer: i > 0 ? all[i - 1] : undefined, older: i >= 0 ? all[i + 1] : undefined };
}

export function formatDate(d: string) {
  return d.replaceAll("-", ".");
}
