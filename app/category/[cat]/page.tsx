import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostList } from "@/components/posts/PostList";
import PageHead from "@/components/ui/PageHead";
import { getPostsByCategory } from "@/lib/content/posts";
import { categories, categoryList, type CategoryKey } from "@/config/site";

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
      <PageHead label={<>{c.index} — {c.en} / {c.ja}</>} title={c.zh}>
        <p>{c.desc}</p>
      </PageHead>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  );
}
