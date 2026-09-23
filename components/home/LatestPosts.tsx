import Link from "next/link";
import { PostList } from "@/components/posts/PostList";
import SectionLabel from "@/components/ui/SectionLabel";
import type { PostMeta } from "@/lib/content/posts";

/** 最近更新 */
export default function LatestPosts({ posts: latest }: { posts: PostMeta[] }) {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <div>
            <SectionLabel>04 — 最近更新 LATEST</SectionLabel>
            <h2 className="serif">最近写下的东西</h2>
          </div>
          <Link href="/archive" className="link-line">全部文章 · 归档 <span className="mono">→</span></Link>
        </div>
        <PostList posts={latest} />
      </div>
    </section>
  );
}
