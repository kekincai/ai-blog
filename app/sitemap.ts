import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags, tagHref } from "@/lib/content/posts";
import { categoryList, site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const pages = ["", "/archive", "/about", "/tags", ...categoryList.map((c) => `/category/${c.key}`), ...getAllTags().map(({ tag }) => tagHref(tag))];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, lastModified: posts[0]?.date })),
    ...posts.map((p) => ({ url: `${site.url}/posts/${p.slug}`, lastModified: p.date })),
  ];
}
