/** 分享卡片（Open Graph 图）与 Apple 图标的共用部分，构建时生成静态图片 */
import { heronSceneSVG } from "@/lib/heron/scene";

/** 苍鹭骑车图标（与 app/icon.svg 同一张图），以 data URI 形式给 satori 渲染 */
export const HERON_ICON = `data:image/svg+xml;base64,${Buffer.from(heronSceneSVG({ id: "og", detail: "icon" })).toString("base64")}`;

export const OG_SIZE = { width: 1200, height: 630 };

const C = { washi: "#f2efe8", ink: "#141417", muted: "#5a5750", hair: "#cfc9bc", accent: "#ff2e63", accentInk: "#c8134a" };

/**
 * 从 Google Fonts 取只包含指定文字的字体子集（satori 需要 ttf/otf，不支持 woff2）。
 * 构建环境取不到时返回 null，调用方退回纯英文版式，不让构建失败。
 */
export async function loadFont(family: string, weight: number, text: string) {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family.replaceAll(" ", "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = /src: url\((.+?)\) format\('(opentype|truetype)'\)/.exec(css)?.[1];
    if (!src) return null;
    const res = await fetch(src);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** 分享卡片：左侧苍鹭骑车，右侧站名 + 标题 */
export function OgCard({ kicker, title, sub, hasFont }: { kicker: string; title: string; sub: string; hasFont: boolean }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", background: C.washi, color: C.ink, padding: 72, gap: 64, alignItems: "center" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={HERON_ICON} width={420} height={420} alt="" style={{ borderRadius: 48 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28, height: "100%", justifyContent: "center" }}>
        <div style={{ display: "flex", fontSize: 24, color: C.accentInk, letterSpacing: 4 }}>{"// " + kicker}</div>
        {hasFont && (
          <div style={{ display: "flex", fontFamily: "serif", fontWeight: 900, fontSize: title.length > 22 ? 48 : 60, lineHeight: 1.35, whiteSpace: "pre-wrap" }}>{title}</div>
        )}
        <div style={{ display: "flex", fontSize: 22, color: C.muted, letterSpacing: 6, borderTop: `2px solid ${C.ink}`, paddingTop: 24 }}>{sub}</div>
      </div>
    </div>
  );
}
