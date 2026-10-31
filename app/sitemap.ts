import type { MetadataRoute } from "next";

const routes = [
  ["", 1],
  ["/rockets/pioneer", 0.9],
  ["/rockets/2027", 0.6],
  ["/payloads/hivemind", 0.9],
  ["/payloads/picosat", 0.6],
  ["/workshop", 0.8],
  ["/team", 0.6],
  ["/volunteer", 0.8],
  ["/gallery", 0.7],
  ["/sponsorship", 0.8],
  ["/events", 0.5],
  ["/posts", 0.5],
  ["/discord", 0.4],
  ["/privacy", 0.2],
  ["/terms", 0.2],
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
