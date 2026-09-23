/** 正文右侧的边注（frontmatter 里的 notes，宽屏才显示） */
export default function SideNotes({ notes }: { notes: string[] }) {
  return (
    <aside className="side-notes" aria-label="边注">
      {notes.map((n, i) => (
        <div key={i} className="side-note">
          <b>註 {String(i + 1).padStart(2, "0")}</b>
          <span>{n}</span>
        </div>
      ))}
    </aside>
  );
}
