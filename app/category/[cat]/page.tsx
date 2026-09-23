import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostList } from "@/components/PostRow";
import SectionLabel from "@/components/SectionLabel";
import { getPostsByCategory } from "@/lib/posts";
import { categories, categoryList, type CategoryKey } from "@/lib/site";

type Props = { params: Promise<{ cat: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categoryList.map((c) => ({ cat: c.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cat } = await params;
  const c = categories[cat as CategoryKey];
  return c ? { title: `${c.zh} ${c.en}`, description: c.desc } : {};
}

export default async function CategoryPage({ params }: Props) {
  const { cat } = await params;
  const c = categories[cat as CategoryKey];
  if (!c) notFound();
  const posts = getPostsByCategory(c.key);
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <div>
            <SectionLabel>{c.index} — {c.en} / {c.ja}</SectionLabel>
            <h1>{c.zh}</h1>
          </div>
          <p>{c.desc}</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  );
}
