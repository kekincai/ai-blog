import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";
import { categoryList } from "@/config/site";

/** 三个维度：学习 · 认识 · 体会（文字在 config/site.ts → categories） */
export default function Pillars() {
  return (
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
  );
}
