import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  // Job applications upload a résumé (max 4 MB) through a server action.
  experimental: { serverActions: { bodySizeLimit: "4.5mb" } },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Oct 2026 redesign: old pages folded into the new five-page site.
      { source: "/pioneer", destination: "/#pioneer", permanent: true },
      { source: "/launch-canada", destination: "/#timmins", permanent: true },
      { source: "/about", destination: "/team", permanent: true },
      { source: "/members", destination: "/team", permanent: true },
      { source: "/join", destination: "/jobs", permanent: true },
      { source: "/contact", destination: "/#thanks", permanent: true },
      { source: "/work", destination: "/#pioneer", permanent: true },
      { source: "/projects", destination: "/#pioneer", permanent: true },
      {
        source: "/sponsor",
        destination: "/sponsorship",
        permanent: true,
      },
      {
        source: "/admin/:path*",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
