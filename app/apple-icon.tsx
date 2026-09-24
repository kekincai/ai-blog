import { ImageResponse } from "next/og";
import { HERON_ICON } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS 主屏图标：苍鹭骑车（与 app/icon.svg 同一张图） */
export default function AppleIcon() {
  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element
    <img src={HERON_ICON} width={180} height={180} alt="" />,
    size
  );
}
