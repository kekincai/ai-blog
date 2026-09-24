"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import HeronRide from "@/components/sakura/HeronRide";
import { categoryList, site } from "@/config/site";

const nav = [
  ...categoryList.map((c) => ({ href: `/category/${c.key}`, index: c.index, label: c.zh, key: c.key })),
  { href: "/about", index: "04", label: "关于", key: "about" },
];

/** postCategories：文章 slug → 分类，用于在文章页高亮所属分类 */
export default function SiteHeader({ postCategories }: { postCategories: Record<string, string> }) {
  const pathname = usePathname();
  const isPost = pathname?.startsWith("/posts/");
  const activeCategory = isPost ? postCategories[decodeURIComponent(pathname.slice("/posts/".length))] : undefined;
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!isPost) return;
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? Math.min(100, Math.round((h.scrollTop / max) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isPost]);

  const isHome = pathname === "/";

  return (
    <header className={isHome ? "site-header is-home" : "site-header"}>
      {/* 只有首页页头有「樱花树下苍鹭骑车」的动画，铺满整个页头 */}
      {isHome && <HeronRide className="home-scene" />}
      <div className="wrap">
        <Link href="/" className="brand" aria-label={`${site.name} 首页`}>
          <span className="brand-name">
            <strong>{site.name}</strong>
            <small>{site.tagline}</small>
          </span>
        </Link>
        <nav className="nav" aria-label="主导航">
          {nav.map((n) => {
            const current = pathname === n.href || activeCategory === n.key;
            return (
              <Link key={n.href} href={n.href} aria-current={current ? "page" : undefined}>
                <span>{n.index}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        {isPost ? (
          <div className="progress" aria-hidden="true">
            <span>READING</span>
            <span className="bar"><span style={{ width: `${pct}%` }} /></span>
            <span>{String(pct).padStart(2, "0")}%</span>
          </div>
        ) : (
          <div className="status" aria-hidden="true">
            <i className="blink" />
            <span>ONLINE · TYO · {new Date().getFullYear()}</span>
          </div>
        )}
      </div>
    </header>
  );
}
