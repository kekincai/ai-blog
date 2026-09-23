/** 文末「体会」框（frontmatter 里的 feel） */
export default function FeelBox({ text }: { text: string }) {
  return (
    <div className="feel-box">
      <div className="mono"><span><b style={{ color: "var(--accent-ink)", fontWeight: 400 }}>//</b> 体会 FEEL</span><span className="muted">感じたこと</span></div>
      <p>{text}</p>
    </div>
  );
}
