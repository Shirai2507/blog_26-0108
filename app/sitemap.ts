import type { MetadataRoute } from "next";
import { getAllPosts } from "../lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const posts = getAllPosts();

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/admin`,
      lastModified: new Date(),
    },
  ];

  for (const post of posts) {
    routes.push({
      url: `${siteUrl}/posts/${post.slug}`,
      lastModified: new Date(post.date),
    });
  }

  return routes;
}
