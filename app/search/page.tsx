import type { Metadata } from "next";
import Search from "@/components/search/Search";
import PageHead from "@/components/ui/PageHead";

export const metadata: Metadata = { title: "搜索 SEARCH", alternates: { canonical: "/search" }, robots: { index: false } };

export default function SearchPage() {
  return (
    <>
      <PageHead label="SEARCH — 站内搜索" title="搜索" />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Search />
        </div>
      </section>
    </>
  );
}
