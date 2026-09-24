import FeaturedPost from "@/components/home/FeaturedPost";
import Hero from "@/components/home/Hero";
import LatestPosts from "@/components/home/LatestPosts";
import NowLearning from "@/components/home/NowLearning";
import Pillars from "@/components/home/Pillars";
import Quote from "@/components/home/Quote";
import JsonLd from "@/components/ui/JsonLd";
import { getAllPosts, getFeaturedPost } from "@/lib/content/posts";
import { site } from "@/config/site";

export default function Home() {
  const featured = getFeaturedPost();
  const latest = getAllPosts().filter((p) => p.slug !== featured?.slug).slice(0, 5);

  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: site.name, description: site.description, url: site.url, inLanguage: "zh-CN" }} />
      <Hero startHref={featured ? `/posts/${featured.slug}` : "/archive"} />
      <Pillars />
      {featured && <FeaturedPost post={featured} />}
      <LatestPosts posts={latest} />
      <NowLearning />
      <Quote />
    </>
  );
}
