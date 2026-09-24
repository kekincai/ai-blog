import { getAllPosts, getPost } from "@/lib/content/posts";
import { categories, site } from "@/config/site";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const cdata = (s: string) => `<![CDATA[${s.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
/** 阅读器不在本站打开，站内的相对链接和图片要换成绝对地址 */
const absolutize = (html: string) => html.replace(/(href|src)="\/(?!\/)/g, `$1="${site.url}/`);
const rfc822 = (date: string) => new Date(`${date}T00:00:00+08:00`).toUTCString();

/** RSS 2.0，带全文（content:encoded），阅读器里可以直接读完整篇 */
export async function GET() {
  const posts = getAllPosts();
  const items = await Promise.all(
    posts.map(async (meta) => {
      const post = (await getPost(meta.slug))!;
      const url = `${site.url}/posts/${post.slug}`;
      const cat = categories[post.category];
      return [
        "<item>",
        `<title>${esc(post.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<pubDate>${rfc822(post.date)}</pubDate>`,
        `<dc:creator>${esc(site.author)}</dc:creator>`,
        `<category>${esc(cat.zh)}</category>`,
        ...post.tags.map((t) => `<category>${esc(t)}</category>`),
        `<description>${esc(post.excerpt)}</description>`,
        `<content:encoded>${cdata(absolutize(post.html) + (post.feel ? `<hr /><p><strong>体会</strong>：${esc(post.feel)}</p>` : ""))}</content:encoded>`,
        "</item>",
      ].join("");
    })
  );

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">`,
    "<channel>",
    `<title>${esc(site.name)} — ${esc(site.tagline)}</title>`,
    `<link>${site.url}</link>`,
    `<atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />`,
    `<description>${esc(site.description)}</description>`,
    "<language>zh-CN</language>",
    posts[0] ? `<lastBuildDate>${rfc822(posts[0].date)}</lastBuildDate>` : "",
    `<image><url>${site.url}/apple-icon</url><title>${esc(site.name)}</title><link>${site.url}</link></image>`,
    ...items,
    "</channel>",
    "</rss>",
  ].join("");

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
