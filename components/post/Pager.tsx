import Link from "next/link";
import type { PostMeta } from "@/lib/content/posts";

/** 上一篇 / 下一篇 */
export default function Pager({ older, newer }: { older?: PostMeta; newer?: PostMeta }) {
  return (
    <nav className="wrap" aria-label="上一篇 / 下一篇" style={{ borderTop: "1px solid var(--hair)" }}>
      <div className="pager">
        {older ? (
          <Link href={`/posts/${older.slug}`}>
            <small>← 上一篇 PREV</small>
            <strong>{older.title}</strong>
          </Link>
        ) : <span />}
        {newer ? (
          <Link href={`/posts/${newer.slug}`} className="next">
            <small>下一篇 NEXT →</small>
            <strong>{newer.title}</strong>
          </Link>
        ) : <span />}
      </div>
    </nav>
  );
}
