import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostList } from "@/components/posts/PostList";
import PageHead from "@/components/ui/PageHead";
import { getAllTags, getPostsByTag, tagHref } from "@/lib/content/posts";

type Props = { params: Promise<{ tag: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

const decode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = decode((await params).tag);
  return { title: `#${tag}`, description: `标签「${tag}」下的文章`, alternates: { canonical: tagHref(tag) } };
}

export default async function TagPage({ params }: Props) {
  const tag = decode((await params).tag);
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();
  return (
    <>
      <PageHead label={<>TAG — <Link href="/tags">全部标签</Link></>} title={`#${tag}`}>
        <p className="mono">{posts.length} ENTRIES</p>
      </PageHead>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  );
}
