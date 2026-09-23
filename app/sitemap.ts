import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { categoryList, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const pages = ["", "/archive", "/about", ...categoryList.map((c) => `/category/${c.key}`)];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, lastModified: posts[0]?.date })),
    ...posts.map((p) => ({ url: `${site.url}/posts/${p.slug}`, lastModified: p.date })),
  ];
}
