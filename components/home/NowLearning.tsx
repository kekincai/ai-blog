import SectionLabel from "@/components/ui/SectionLabel";
import { nowLearning } from "@/config/site";

const statusLabel = { doing: "[进行中]", done: "[已完成]", plan: "[计划中]" } as const;

/** 学习日志终端（内容在 config/site.ts → nowLearning） */
export default function NowLearning() {
  return (
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
  );
}
