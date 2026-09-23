import type { Metadata } from "next";
import Link from "next/link";
import PageHead from "@/components/ui/PageHead";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "关于 ABOUT" };

export default function AboutPage() {
  return (
    <>
      <PageHead label="04 — ABOUT / 自己紹介" title="关于" />
      <section className="art-body">
        <div className="wrap">
          <div />
          <div className="prose">
            <div className="md">
              <p>{site.bio}</p>
              {/* TODO: 下面的文字是默认内容，换成你自己的话 */}
              <h2 id="why">为什么写这个博客</h2>
              <p>
                学 AI 最容易陷入「看过就等于会了」。把学到的东西写下来，是检验自己是否真的懂了的最好办法。
                这里按三个阶段整理：<Link href="/category/learn">学习</Link>是输入，
                <Link href="/category/insight">认识</Link>是沉淀下来的判断，<Link href="/category/feel">体会</Link>是与 AI 共事的真实感受。
              </p>
              <h2 id="site">关于这个站点</h2>
              <p>
                用 Next.js 和 Markdown 搭建，部署在 Vercel，源码公开在{" "}
                <a href={site.repo} target="_blank" rel="noreferrer">GitHub</a>。也可以通过 <Link href="/feed.xml">RSS</Link> 订阅更新。
              </p>
              <h2 id="contact">联系我</h2>
              <p>
                欢迎在 <a href={site.github} target="_blank" rel="noreferrer">GitHub</a> 上找到我，
                或者在 <a href={`${site.repo}/issues`} target="_blank" rel="noreferrer">Issues</a> 里留言交流。
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
