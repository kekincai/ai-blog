import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";

export default function NotFound() {
  return (
    <section className="page-head">
      <div className="wrap" style={{ minHeight: "50vh" }}>
        <div>
          <SectionLabel>ERR_404 — SIGNAL LOST</SectionLabel>
          <h1><span className="glitch">404</span> 迷失在潜空间</h1>
        </div>
        <Link href="/" className="btn btn-solid">回到首页 <span className="mono">→</span></Link>
      </div>
    </section>
  );
}
