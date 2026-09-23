import AttentionMatrix from "@/components/ui/AttentionMatrix";
import type { PostMeta } from "@/lib/content/posts";

/** 标题下方的深色横幅（纯装饰） */
export default function PostBand({ post }: { post: PostMeta }) {
  return (
    <section className="art-band dark scan" aria-hidden="true">
      <div className="wrap">
        <span className="tl">file.{String(post.no).padStart(3, "0")} // {post.slug}</span>
        <div className="eq glitch">{post.title.split(/[：:]/)[0]}</div>
        <AttentionMatrix rows={6} cols={6} spread={1.4} />
      </div>
    </section>
  );
}
