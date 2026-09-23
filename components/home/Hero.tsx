import Link from "next/link";
import Enso from "./Enso";
import SectionLabel from "@/components/ui/SectionLabel";

/** 首屏；startHref 是「开始阅读」按钮的目标 */
export default function Hero({ startHref }: { startHref: string }) {
  return (
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
            <Link href={startHref} className="btn btn-solid">
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
  );
}
