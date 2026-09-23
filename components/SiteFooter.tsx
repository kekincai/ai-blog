import Link from "next/link";
import { site } from "@/lib/site";
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
          <Subscribe />
          <nav className="foot-links" aria-label="页脚链接">
            <Link href="/feed.xml">RSS</Link>
            <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
            <Link href="/archive">归档</Link>
            <Link href="/about">关于我</Link>
          </nav>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} {site.name} — 以余白与霓虹构建</span>
          <span>EOF_</span>
        </div>
      </div>
    </footer>
  );
}
