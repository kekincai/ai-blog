"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/posts";

export default function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-120px 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
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
