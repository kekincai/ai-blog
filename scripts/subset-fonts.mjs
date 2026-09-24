/**
 * 中文字体子集化：收集站点里实际用到的字，从 Google Fonts 下载只包含这些字的字体，
 * 放到 styles/fonts/，由 app/layout.tsx 通过 next/font/local 自托管。
 *
 * 完整的中文字体有几 MB，按需切片也要下载约 2MB；子集化后两套字体合计几百 KB。
 * 字形与 Google Fonts 上的可变字重版本完全相同，只是去掉了没用到的字。
 *
 * 在 npm run dev / npm run build 之前自动运行（package.json 的 predev / prebuild）。
 * 用到的字没有变化时直接跳过；网络不通但已有字体文件时保留旧文件，不让构建失败。
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const OUT = join(ROOT, "styles", "fonts");
const MANIFEST = join(OUT, "manifest.json");
const SOURCES = ["content", "components", "app", "config", "lib"];
const FONTS = [
  { file: "noto-serif-sc.woff2", family: "Noto Serif SC", axis: "wght@200..900" },
  { file: "noto-sans-sc.woff2", family: "Noto Sans SC", axis: "wght@100..900" },
];
// 现代浏览器 UA，Google 才会返回 woff2
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (/\.(md|mdx|tsx?|json)$/.test(entry.name)) yield p;
  }
}

function collectChars() {
  const set = new Set();
  // 基本拉丁字符 + 常用中文标点，保证手写的新内容里这些符号总能显示
  for (let i = 0x20; i < 0x7f; i++) set.add(String.fromCharCode(i));
  for (const c of "，。、；：？！「」『』（）《》〈〉【】—…·～“”‘’　") set.add(c);
  for (const dir of SOURCES) {
    for (const file of walk(join(ROOT, dir))) {
      for (const c of readFileSync(file, "utf8")) if (c.codePointAt(0) >= 0x20) set.add(c);
    }
  }
  return [...set].sort().join("");
}

async function download({ family, axis }, text) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replaceAll(" ", "+")}:${axis}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url, { headers: { "User-Agent": UA } })).text();
  const src = /src: url\((.+?)\) format\('woff2'\)/.exec(css)?.[1];
  if (!src) throw new Error(`Google Fonts 没有返回 ${family} 的 woff2：${css.slice(0, 200)}`);
  const res = await fetch(src, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`下载 ${family} 失败：HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

const text = collectChars();
const hash = createHash("sha1").update(text).digest("hex").slice(0, 12);
const haveAll = FONTS.every((f) => existsSync(join(OUT, f.file)));
const old = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : null;

if (haveAll && old?.hash === hash) {
  console.log(`[fonts] 用到的字没有变化（${text.length} 个），跳过`);
} else {
  try {
    mkdirSync(OUT, { recursive: true }); // styles/fonts/ 不进 git，新克隆的仓库里没有这个目录
    for (const font of FONTS) {
      const data = await download(font, text);
      writeFileSync(join(OUT, font.file), data);
      console.log(`[fonts] ${font.family}: ${text.length} 个字 → ${relative(ROOT, join(OUT, font.file))}（${Math.round(data.length / 1024)} KB）`);
    }
    writeFileSync(MANIFEST, JSON.stringify({ hash, chars: text.length }, null, 2) + "\n");
  } catch (err) {
    if (!haveAll) throw err;
    console.warn(`[fonts] 下载失败，继续使用已有的字体文件（新增的字会用系统字体显示）：${err.message}`);
  }
}
