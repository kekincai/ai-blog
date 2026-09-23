"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/content/markdown";

export default function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState(headings[0]?.id);

  // 高亮「最后一个已经滚过顶部的标题」：直接跳转、刷新到页面中间时也准确
  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const onScroll = () => {
      const passed = els.filter((el) => el.getBoundingClientRect().top < 140);
      setActive((passed.at(-1) ?? els[0]).id);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  if (!headings.length) return <div />;
  return (
    <nav className="toc" aria-label="目次">
      <div className="toc-title">目次 / INDEX</div>
      {headings.map((h, i) => (
        <a key={h.id} href={`#${h.id}`} className={active === h.id ? "active" : undefined}>
          <span>{String(i + 1).padStart(2, "0")}</span>
          {h.text}
        </a>
      ))}
    </nav>
  );
}
