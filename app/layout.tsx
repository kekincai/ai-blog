import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { JetBrains_Mono, Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { getAllPosts } from "@/lib/content/posts";
import { site } from "@/config/site";
import "katex/dist/katex.min.css";
import "@/styles/index.css";

// 构建时下载并自托管字体，访问时不再请求 Google（大陆也能正常加载）
// CJK 字体按 unicode-range 切片，浏览器只下载用到的字；不预加载以免首屏拉取过多
const serif = Noto_Serif_SC({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-serif" });
const sans = Noto_Sans_SC({ subsets: ["latin"], display: "swap", preload: false, variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], display: "swap", variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s — ${site.name}` },
  description: site.description,
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
  openGraph: { siteName: site.name, locale: "zh_CN", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const postCategories = Object.fromEntries(getAllPosts().map((p) => [p.slug, p.category]));
  return (
    <html lang="zh-CN" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="sr-only">跳到正文</a>
        <SiteHeader postCategories={postCategories} />
        <main id="main">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
