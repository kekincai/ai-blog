export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="label">
      <b>//</b> {children}
    </div>
  );
}
