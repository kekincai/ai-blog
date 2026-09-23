import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FeelBox from "@/components/post/FeelBox";
import Pager from "@/components/post/Pager";
import PostBand from "@/components/post/PostBand";
import PostHeader from "@/components/post/PostHeader";
import SideNotes from "@/components/post/SideNotes";
import Toc from "@/components/post/Toc";
import { getAdjacent, getAllPosts, getPost } from "@/lib/content/posts";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/posts/${slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date, tags: post.tags },
    robots: post.draft ? { index: false } : undefined,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const { newer, older } = getAdjacent(slug);

  return (
    <article>
      <PostHeader post={post} />
      <PostBand post={post} />

      <div className="art-body">
        <div className="wrap">
          <Toc headings={post.headings} />
          <div className="prose">
            <div className="md" dangerouslySetInnerHTML={{ __html: post.html }} />
            {post.feel && <FeelBox text={post.feel} />}
          </div>
          {post.notes.length > 0 && <SideNotes notes={post.notes} />}
        </div>
      </div>

      <Pager older={older} newer={newer} />
    </article>
  );
}
