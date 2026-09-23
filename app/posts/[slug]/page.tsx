import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AttentionMatrix from "@/components/AttentionMatrix";
import Toc from "@/components/Toc";
import { formatDate, getAdjacent, getAllPosts, getPost } from "@/lib/posts";
import { categories } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const cat = categories[post.category];
  const { newer, older } = getAdjacent(slug);

  return (
    <article>
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

      <section className="art-band dark scan" aria-hidden="true">
        <div className="wrap">
          <span className="tl">file.{String(post.no).padStart(3, "0")} // {post.slug}</span>
          <div className="eq glitch">{post.title.split(/[：:]/)[0]}</div>
          <AttentionMatrix rows={6} cols={6} spread={1.4} />
        </div>
      </section>

      <div className="art-body">
        <div className="wrap">
          <Toc headings={post.headings} />
          <div className="prose">
            <div className="md" dangerouslySetInnerHTML={{ __html: post.html }} />
            {post.feel && (
              <div className="feel-box">
                <div className="mono"><span><b style={{ color: "var(--accent-ink)", fontWeight: 400 }}>//</b> 体会 FEEL</span><span className="muted">感じたこと</span></div>
                <p>{post.feel}</p>
              </div>
            )}
          </div>
          {post.notes.length > 0 && (
            <aside className="side-notes" aria-label="边注">
              {post.notes.map((n, i) => (
                <div key={i} className="side-note">
                  <b>註 {String(i + 1).padStart(2, "0")}</b>
                  <span>{n}</span>
                </div>
              ))}
            </aside>
          )}
        </div>
      </div>

      <nav className="wrap" aria-label="上一篇 / 下一篇" style={{ borderTop: "1px solid var(--hair)" }}>
        <div className="pager">
          {older ? (
            <Link href={`/posts/${older.slug}`}>
              <small>← 上一篇 PREV</small>
              <strong>{older.title}</strong>
            </Link>
          ) : <span />}
          {newer ? (
            <Link href={`/posts/${newer.slug}`} className="next">
              <small>下一篇 NEXT →</small>
              <strong>{newer.title}</strong>
            </Link>
          ) : <span />}
        </div>
      </nav>
    </article>
  );
}
