import Link from "next/link";
import AttentionMatrix from "@/components/AttentionMatrix";
import Enso from "@/components/Enso";
import { PostList } from "@/components/PostRow";
import SectionLabel from "@/components/SectionLabel";
import { formatDate, getAllPosts, getFeaturedPost } from "@/lib/posts";
import { categories, categoryList, nowLearning } from "@/lib/site";

const statusLabel = { doing: "[进行中]", done: "[已完成]", plan: "[计划中]" } as const;

export default function Home() {
  const featured = getFeaturedPost();
  const latest = getAllPosts().filter((p) => p.slug !== featured?.slug).slice(0, 5);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <div className="hero-main">
            <SectionLabel>INDEX_00 — 一个人的 AI 学习现场</SectionLabel>
            <h1>
              在余白中，
              <br />
              与<span className="glitch">机器</span>一起思考。
            </h1>
            <p>这里记录我学习人工智能的过程：读过的论文、写过的代码、踩过的坑，以及那些在深夜忽然想通的瞬间。</p>
            <div className="btns">
              <Link href={featured ? `/posts/${featured.slug}` : "/archive"} className="btn btn-solid">
                开始阅读 <span className="mono">→</span>
              </Link>
              <a href="#subscribe" className="btn">订阅更新</a>
            </div>
            <div className="hero-tags">
              <span>[ LEARN ] 学ぶ</span>
              <span>[ INSIGHT ] 識る</span>
              <span>[ FEEL ] 感じる</span>
            </div>
          </div>
          <Enso />
        </div>
      </section>

      {/* 三个维度 */}
      <section className="section">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <SectionLabel>02 — 三个维度</SectionLabel>
              <h2 className="serif">学习 · 认识 · 体会</h2>
            </div>
            <p>知识从输入开始，经过理解沉淀为判断，最后变成身体里的感受。这个博客按这三个阶段来整理。</p>
          </div>
          <div className="pillars">
            {categoryList.map((c) => (
              <div key={c.key} className="pillar">
                <div className="pillar-top">
                  <b style={{ color: c.color }}>{c.index}</b>
                  <span>{c.en} / {c.ja}</span>
                </div>
                <h3>{c.zh}</h3>
                <p>{c.desc}</p>
                <div className="topics">{c.topics}</div>
                <Link href={`/category/${c.key}`} className="link-line">
                  查看全部 <span className="mono">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 精选 */}
      {featured && (
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
      )}

      {/* 最近 */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <SectionLabel>04 — 最近更新 LATEST</SectionLabel>
              <h2 className="serif">最近写下的东西</h2>
            </div>
            <Link href="/archive" className="link-line">全部文章 · 归档 <span className="mono">→</span></Link>
          </div>
          <PostList posts={latest} />
        </div>
      </section>

      {/* 学习日志 */}
      <section className="now dark scan">
        <div className="wrap">
          <div className="now-intro">
            <SectionLabel>05 — 学习日志 NOW LEARNING</SectionLabel>
            <h2>
              此刻，
              <br />
              正在<span className="glitch">学</span>的事。
            </h2>
            <p>像终端一样记录进度。不追求快，只求每天都往前挪一点。</p>
            <div className="kana" aria-hidden="true">ガクシュウ</div>
          </div>
          <div className="term">
            <div className="term-bar">
              <span>paul@latent:~/log</span>
              <span className="rec">● REC</span>
            </div>
            <div className="term-body">
              <div className="cmd">$ now --learning --verbose</div>
              {nowLearning.map((l) => (
                <div key={l.text} className={`term-line ${l.status}`}>
                  <b>{statusLabel[l.status]}</b>
                  <span>{l.text}</span>
                </div>
              ))}
              <div className="cmd">$ <span className="cursor blink" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* 引语 */}
      <section className="quote">
        <div className="wrap">
          <div className="side"><SectionLabel>06 — 体会</SectionLabel></div>
          <blockquote>
            <p className="serif">「每一次与模型的对话，<br />都是一期一会。」</p>
            <cite>— 写于某个凌晨两点的笔记</cite>
          </blockquote>
          <div className="side"><div className="hanko">一期一会</div></div>
        </div>
      </section>
    </>
  );
}
