import type { Metadata } from "next";
import { PostList } from "@/components/PostRow";
import SectionLabel from "@/components/SectionLabel";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = { title: "归档 ARCHIVE" };

export default function ArchivePage() {
  const posts = getAllPosts();
  const years = [...new Set(posts.map((p) => p.date.slice(0, 4)))];
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <div>
            <SectionLabel>ARCHIVE — 全部文章</SectionLabel>
            <h1>归档</h1>
          </div>
          <p className="mono">{posts.length} ENTRIES</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {years.map((y) => (
            <div key={y}>
              <div className="year">{y}</div>
              <PostList posts={posts.filter((p) => p.date.startsWith(y))} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
