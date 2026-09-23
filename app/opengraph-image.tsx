import { ImageResponse } from "next/og";
import { loadFont, OG_SIZE, OgCard } from "@/lib/og";
import { site } from "@/config/site";

export const alt = `${site.name} — ${site.description}`;
export const size = OG_SIZE;
export const contentType = "image/png";

const TITLE = "在余白中，\n与机器一起思考。";

export default async function Image() {
  const font = await loadFont("Noto Serif SC", 900, TITLE);
  return new ImageResponse(
    <OgCard kicker={site.name} title={TITLE} sub="AI LEARNING LOG" hasFont={!!font} />,
    { ...size, fonts: font ? [{ name: "serif", data: font, weight: 900 }] : undefined }
  );
}
