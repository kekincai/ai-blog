import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "@/components/ui/PageHead";
import { getAllTags, tagHref } from "@/lib/content/posts";

export const metadata: Metadata = { title: "标签 TAGS", alternates: { canonical: "/tags" } };

export default function TagsPage() {
  const tags = getAllTags();
  return (
    <>
      <PageHead label="TAGS — 全部标签" title="标签">
        <p className="mono">{tags.length} TAGS</p>
      </PageHead>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {tags.length === 0 ? (
            <p className="empty">$ ls → 还没有标签。</p>
          ) : (
            <div className="tag-cloud">
              {tags.map(({ tag, count }) => (
                <Link key={tag} href={tagHref(tag)}>
                  #{tag} <span>{count}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
