/** 给搜索引擎的结构化数据（schema.org） */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  // 转义 <，防止内容里出现 </script> 提前结束标签
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
