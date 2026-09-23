import type { Metadata } from "next";
import { PostList } from "@/components/posts/PostList";
import PageHead from "@/components/ui/PageHead";
import { getAllPosts } from "@/lib/content/posts";

export const metadata: Metadata = { title: "归档 ARCHIVE" };

export default function ArchivePage() {
  const posts = getAllPosts();
  const years = [...new Set(posts.map((p) => p.date.slice(0, 4)))];
  return (
    <>
      <PageHead label="ARCHIVE — 全部文章" title="归档">
        <p className="mono">{posts.length} ENTRIES</p>
      </PageHead>
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
