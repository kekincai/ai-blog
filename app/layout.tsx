import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { getAllPosts } from "@/lib/content/posts";
import { site } from "@/config/site";
import "@/styles/index.css";

// 中文字体：只包含站点用到的字的子集，由 scripts/subset-fonts.mjs 在 dev / build 前生成（几百 KB，原来约 2MB）
const notoSerifSC = localFont({ src: "../styles/fonts/noto-serif-sc.woff2", weight: "200 900", display: "swap", variable: "--font-serif", adjustFontFallback: "Times New Roman" });
const notoSansSC = localFont({ src: "../styles/fonts/noto-sans-sc.woff2", weight: "100 900", display: "swap", variable: "--font-sans" });
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
    <html lang="zh-CN" className={`${notoSerifSC.variable} ${notoSansSC.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="sr-only skip-link">跳到正文</a>
        <SiteHeader postCategories={postCategories} />
        <main id="main">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
