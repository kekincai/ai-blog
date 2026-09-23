import { ImageResponse } from "next/og";
import { loadFont, OG_SIZE, OgCard } from "@/lib/og";
import { formatDate, getAllPosts } from "@/lib/content/posts";
import { categories, site } from "@/config/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getAllPosts().find((p) => p.slug === slug)!;
  const cat = categories[post.category];
  const font = await loadFont("Noto Serif SC", 900, post.title);
  return new ImageResponse(
    <OgCard
      kicker={`${site.name} / ${cat.en} / No.${String(post.no).padStart(3, "0")}`}
      title={post.title}
      sub={`${formatDate(post.date)} · ${post.minutes} MIN READ`}
      hasFont={!!font}
    />,
    { ...size, fonts: font ? [{ name: "serif", data: font, weight: 900 }] : undefined }
  );
}
