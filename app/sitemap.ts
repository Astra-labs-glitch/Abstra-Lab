import type { MetadataRoute } from "next";

const routes = [
  ["", 1],
  ["/team", 0.6],
  ["/jobs", 0.8],
  ["/gallery", 0.7],
  ["/sponsorship", 0.8],
  ["/events", 0.5],
  ["/posts", 0.5],
  ["/discord", 0.4],
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";
  const lastModified = new Date();

  return routes.map(([path, priority]) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    priority,
  }));
}
