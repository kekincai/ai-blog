import SectionLabel from "./SectionLabel";

/** 列表页 / 关于页的页头：左侧小标签 + 大标题，右侧可选说明 */
export default function PageHead({ label, title, children }: { label: React.ReactNode; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="page-head">
      <div className="wrap">
        <div>
          <SectionLabel>{label}</SectionLabel>
          <h1>{title}</h1>
        </div>
        {children}
      </div>
    </section>
  );
}
