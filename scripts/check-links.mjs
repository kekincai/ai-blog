/**
 * 死链检查：在 npm run build 之后运行，扫描生成的所有页面，
 * 确认站内链接（href / src）指向的页面、文件和页内锚点（#xxx）都存在。
 * 比如删了一篇文章，其他文章里指向它的链接就会在这里报出来。
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const APP = join(ROOT, ".next", "server", "app");
const PUBLIC = join(ROOT, "public");

if (!existsSync(APP)) {
  console.error("[links] 没有找到构建产物，请先运行 npm run build");
  process.exit(1);
}

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (entry.name.endsWith(".html")) yield p;
  }
}

/** 页面文件 → 网址路径 */
const toRoute = (file) => "/" + relative(APP, file).replace(/\.html$/, "").replace(/(^|\/)index$/, "");
const pages = new Map();
for (const file of walk(APP)) {
  if (/\/_/.test("/" + relative(APP, file))) continue; // _not-found、_global-error 等内部页面
  pages.set(toRoute(file).replace(/\/$/, "") || "/", readFileSync(file, "utf8"));
}

const ids = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

function exists(path) {
  if (path === "" || path === "/") return pages.has("/");
  if (pages.has(path)) return true;
  // 路由处理器生成的文件（feed.xml、sitemap.xml、图片等）和 public/ 下的静态文件
  return existsSync(join(APP, path + ".body")) || existsSync(join(PUBLIC, path));
}

const problems = [];
for (const [route, html] of pages) {
  const pageIds = ids(html);
  for (const [, attr, raw] of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
    const url = raw.replaceAll("&amp;", "&");
    if (/^(https?:|mailto:|data:|\/\/)/.test(url) || url.startsWith("/_next/") || url.startsWith("/_vercel/")) continue;
    const [pathAndQuery, hash] = url.split("#");
    const path = decodeURIComponent(pathAndQuery.split("?")[0]).replace(/\/$/, "");

    if (path === "" && hash !== undefined) {
      if (hash && !pageIds.has(decodeURIComponent(hash))) problems.push(`${route}: 页内锚点 #${hash} 不存在`);
      continue;
    }
    if (!path.startsWith("/")) continue; // 相对路径在本站不使用
    if (!exists(path)) {
      problems.push(`${route}: ${attr}="${url}" 指向的页面或文件不存在`);
      continue;
    }
    if (hash && pages.has(path || "/") && !ids(pages.get(path || "/")).has(decodeURIComponent(hash))) {
      problems.push(`${route}: ${url} 里的锚点 #${hash} 不存在`);
    }
  }
}

if (problems.length) {
  console.error(`[links] 发现 ${problems.length} 个死链：\n` + [...new Set(problems)].map((p) => "  - " + p).join("\n"));
  process.exit(1);
}
console.log(`[links] 检查了 ${pages.size} 个页面，没有死链`);
