import Link from "next/link";
import { categories } from "@/config/site";
import { formatDate } from "@/lib/format";
import type { PostMeta } from "@/lib/content/posts";

export default function PostRow({ post }: { post: PostMeta }) {
  const cat = categories[post.category];
  return (
    <Link href={`/posts/${post.slug}`} className="post-row">
      <span className="date">{formatDate(post.date)}</span>
      <span className="cat">
        <i style={{ background: cat.color }} />
        {cat.zh}
      </span>
      <span className="title">
        {post.title} {post.draft && <span className="draft-chip">DRAFT</span>}
      </span>
      <span className="time">{post.minutes} MIN</span>
      <span className="arrow" aria-hidden="true">→</span>
    </Link>
  );
}

export function PostList({ posts, empty = "$ ls → 这里还没有文章。" }: { posts: PostMeta[]; empty?: string }) {
  if (posts.length === 0) return <div className="post-list"><p className="empty">{empty}</p></div>;
  return (
    <div className="post-list">
      {posts.map((p) => (
        <PostRow key={p.slug} post={p} />
      ))}
    </div>
  );
}
