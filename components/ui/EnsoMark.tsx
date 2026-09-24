/**
 * 圆相标志：墨色缺口圆 + 霓虹虚线环 + 中心点。
 * 与 app/icon.svg、首页大圆相同一套比例（缺口约 47°，起点旋转 -70°）。
 * 只用写死的颜色值，因为分享卡片的渲染器（satori）不支持 CSS 变量。
 *
 * variant="bold"：线条加粗，用于 64px 以下的小尺寸（页头、favicon）
 * variant="fine"：细线条，用于大尺寸（分享卡片）
 */
const INK = "#141417";
const ACCENT = "#ff2e63";
const HAIR = "#cfc9bc";

const STYLES = {
  bold: { hair: 1, ring: 2, ringDash: "2.2 3.3", arc: 5, dot: 4.5, cross: "M32 6v52M6 32h52" },
  fine: { hair: 0.4, ring: 0.8, ringDash: "1.2 2.2", arc: 2.4, dot: 2.6, cross: "M32 2v60M2 32h60" },
};

export default function EnsoMark({ size, variant = "bold", className }: { size: number; variant?: keyof typeof STYLES; className?: string }) {
  const s = STYLES[variant];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d={s.cross} stroke={HAIR} strokeWidth={s.hair} />
      <circle className="enso-mark-ring" cx="32" cy="32" r="17.5" fill="none" stroke={ACCENT} strokeWidth={s.ring} strokeDasharray={s.ringDash} />
      <circle
        cx="32" cy="32" r="22" fill="none" stroke={INK} strokeWidth={s.arc} strokeLinecap="round"
        strokeDasharray="120.4 17.8" transform="rotate(-70 32 32)"
      />
      <circle cx="32" cy="32" r={s.dot} fill={ACCENT} />
    </svg>
  );
}
