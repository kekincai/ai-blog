import type { Metadata } from "next";
import SectionLabel from "@/components/SectionLabel";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "关于 ABOUT" };

export default function AboutPage() {
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <div>
            <SectionLabel>04 — ABOUT / 自己紹介</SectionLabel>
            <h1>关于</h1>
          </div>
        </div>
      </section>
      <section className="art-body">
        <div className="wrap">
          <div />
          <div className="prose">
            <div className="md">
              <p>{site.bio}</p>
              <h2 id="why">为什么写这个博客</h2>
              <p>[写下开始这个博客的原因。]</p>
              <h2 id="contact">联系我</h2>
              <p>[邮箱 / GitHub / 其他社交账号]</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
