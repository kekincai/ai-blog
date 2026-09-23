import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { renderMarkdown, type Heading } from "./markdown";
import { categories, type CategoryKey } from "@/config/site";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/** 草稿（draft: true）只在本地开发和 Vercel 预览部署里显示，正式站点不显示 */
const SHOW_DRAFTS = process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview";

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
  draft: boolean;
};

export type Post = PostMeta & { html: string; headings: Heading[] };

function readingMinutes(src: string) {
  const cjk = (src.match(/[぀-ヿ㐀-鿿]/g) ?? []).length;
  const words = src.replace(/[぀-ヿ㐀-鿿]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(cjk / 400 + words / 220));
}

/** 文章是 content/posts/<slug>.md，文件名就是网址。以 _ 开头的文件（如 _template.md）会被忽略 */
function readRaw() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const bad = (file: string, msg: string) => new Error(`content/posts/${file}: ${msg}`);

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? "");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw bad(file, `date 要写成 YYYY-MM-DD，现在是 "${date}"`);
      if (!data.title) throw bad(file, "缺少 title");
      const category = data.category ?? "learn";
      if (!Object.hasOwn(categories, category)) {
        throw bad(file, `category "${category}" 无效，只能是 ${Object.keys(categories).join(" / ")}`);
      }

      return {
        slug,
        content,
        meta: {
          slug,
          title: String(data.title),
          date,
          category: category as CategoryKey,
          excerpt: String(data.excerpt ?? ""),
          tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
          featured: Boolean(data.featured),
          minutes: readingMinutes(content),
          no: 0,
          notes: Array.isArray(data.notes) ? data.notes.map(String) : [],
          feel: String(data.feel ?? ""),
          draft: Boolean(data.draft),
        } satisfies PostMeta,
      };
    })
    .filter((r) => SHOW_DRAFTS || !r.meta.draft);
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

  return { ...meta, ...(await renderMarkdown(raw.content)) };
}

export function getAdjacent(slug: string) {
  const all = getAllPosts(); // 新 → 旧
  const i = all.findIndex((p) => p.slug === slug);
  return { newer: i > 0 ? all[i - 1] : undefined, older: i >= 0 ? all[i + 1] : undefined };
}

export function formatDate(d: string) {
  return d.replaceAll("-", ".");
}
