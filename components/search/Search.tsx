"use client";

import { useEffect, useMemo, useState } from "react";
import { PostList } from "@/components/posts/PostList";
import type { PostMeta } from "@/lib/content/posts";

type Entry = PostMeta & { text: string };

/** 站内搜索：读取构建时生成的 /search.json，在浏览器里匹配。空格分隔多个词时需要全部命中 */
export default function Search() {
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [q, setQ] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setQ(new URLSearchParams(location.search).get("q") ?? "");
    setReady(true);
    fetch("/search.json").then((r) => r.json()).then(setIndex).catch(() => setIndex([]));
  }, []);

  // 把关键词同步到网址，方便分享搜索结果（读完网址里的 q 之后才开始同步）
  useEffect(() => {
    if (!ready) return;
    history.replaceState(null, "", q ? `?q=${encodeURIComponent(q)}` : location.pathname);
  }, [q, ready]);

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!index || terms.length === 0) return [];
    return index
      .map((p) => {
        const title = p.title.toLowerCase();
        const meta = `${p.excerpt} ${p.tags.join(" ")}`.toLowerCase();
        const body = p.text.toLowerCase();
        if (!terms.every((t) => title.includes(t) || meta.includes(t) || body.includes(t))) return null;
        const score = terms.reduce((s, t) => s + (title.includes(t) ? 10 : 0) + (meta.includes(t) ? 3 : 0) + (body.includes(t) ? 1 : 0), 0);
        return { p, score };
      })
      .filter((r) => r !== null)
      .sort((a, b) => b.score - a.score || b.p.date.localeCompare(a.p.date))
      .map((r) => r.p);
  }, [index, q]);

  return (
    <>
      <div className="search-box">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索标题、标签、正文…"
          aria-label="搜索文章"
          autoFocus
        />
        <span className="mono">{index === null ? "LOADING…" : q ? `${results.length} RESULTS` : `${index.length} ENTRIES`}</span>
      </div>
      {q && index && <PostList posts={results} empty="$ grep → 没有找到匹配的文章。" />}
    </>
  );
}
