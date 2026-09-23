/** 用确定性伪随机生成的「注意力矩阵」装饰图 */
export default function AttentionMatrix({ rows = 10, cols = 16, spread = 2.2 }: { rows?: number; cols?: number; spread?: number }) {
  const cells: number[] = [];
  const slope = cols / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const d = Math.abs(r * slope - c);
      const n = Math.abs((Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1);
      const o = Math.exp(-d / spread) * 0.9 + n * 0.22;
      cells.push(Math.max(0.06, Math.min(1, o)));
    }
  }
  return (
    <div className="matrix" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} aria-hidden="true">
      {cells.map((o, i) => (
        <i key={i} style={{ opacity: o.toFixed(2) }} />
      ))}
    </div>
  );
}
