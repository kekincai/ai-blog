import Link from "next/link";
import AttentionMatrix from "@/components/ui/AttentionMatrix";
import SectionLabel from "@/components/ui/SectionLabel";
import { formatDate, type PostMeta } from "@/lib/content/posts";
import { categories } from "@/config/site";

/** 精选文章（frontmatter 里 featured: true，没有则取最新一篇） */
export default function FeaturedPost({ post: featured }: { post: PostMeta }) {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div style={{ marginBottom: 32 }}>
          <SectionLabel>03 — 精选文章 FEATURED</SectionLabel>
        </div>
        <Link href={`/posts/${featured.slug}`} className="featured">
          <div className="screen scan">
            <AttentionMatrix />
            <span className="tl">attn.head[03] // layer_12</span>
            <span className="br">softmax(QKᵀ / √dₖ)</span>
          </div>
          <div className="featured-body">
            <div className="meta-row">
              <span className="chip">{categories[featured.category].zh} · {categories[featured.category].en}</span>
              <span>{formatDate(featured.date)} · {featured.minutes} MIN</span>
            </div>
            <h3>{featured.title}</h3>
            <p>{featured.excerpt}</p>
            <div className="tags">{featured.tags.map((t) => <span key={t}>#{t}</span>)}</div>
            <span className="link-line link-accent">阅读全文 <span className="mono">→</span></span>
          </div>
        </Link>
      </div>
    </section>
  );
}
