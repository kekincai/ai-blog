import SectionLabel from "@/components/ui/SectionLabel";

/** 页尾引语 */
export default function Quote() {
  return (
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
  );
}
