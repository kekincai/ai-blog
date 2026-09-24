import Link from "next/link";
import { site } from "@/config/site";
import Subscribe from "./Subscribe";

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="subscribe">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <strong>{site.name}</strong>
            <p>{site.bio}</p>
          </div>
          <Subscribe buttondown={site.buttondown} />
          <nav className="foot-links" aria-label="页脚链接">
            <Link href="/feed.xml">RSS</Link>
            <a href={site.github} target="_blank" rel="noreferrer">GitHub</a>
            <Link href="/archive">归档</Link>
            <Link href="/tags">标签</Link>
            <Link href="/search">搜索</Link>
            <Link href="/about">关于我</Link>
          </nav>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} {site.name} — 以余白与霓虹构建 · <a href={site.repo} target="_blank" rel="noreferrer">源码</a></span>
          <span>EOF_</span>
        </div>
      </div>
    </footer>
  );
}
