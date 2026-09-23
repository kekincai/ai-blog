import Link from "next/link";
import { formatDate, type PostMeta } from "@/lib/content/posts";
import { categories } from "@/config/site";

/** 文章头：面包屑、分类、标题、摘要、日期与标签 */
export default function PostHeader({ post }: { post: PostMeta }) {
  const cat = categories[post.category];
  return (
    <header className="art-head">
      <div className="wrap">
        <div className="art-head-main">
          <nav className="crumbs" aria-label="面包屑">
            <Link href="/">首页</Link><span>/</span>
            <Link href={`/category/${cat.key}`}>{cat.zh}</Link><span>/</span>
            <span>{post.title.split(/[：:]/)[0]}</span>
          </nav>
          <div className="meta-row">
            <span className="chip">{cat.zh} · {cat.en}</span>
            <span>No.{String(post.no).padStart(3, "0")}</span>
            {post.draft && <span className="draft-chip">DRAFT 草稿</span>}
          </div>
          <h1>{post.title}</h1>
          {post.excerpt && <p className="lede">{post.excerpt}</p>}
          <div className="art-meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>{post.minutes} MIN READ</span>
            <span>{post.tags.map((t) => `#${t}`).join(" ")}</span>
          </div>
        </div>
        <div className="vert" aria-hidden="true">{cat.ja} ─ {cat.zh}</div>
      </div>
    </header>
  );
}
