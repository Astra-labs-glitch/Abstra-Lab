import type { NextConfig } from "next";

// Content Security Policy: the browser only loads scripts, styles, fonts and images
// from this site. Next.js needs inline scripts/styles. Preview deploys also allow
// Vercel's comment toolbar (vercel.live); production doesn't.
const preview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production";
const vercelLive = preview ? " https://vercel.live https://*.pusher.com wss://*.pusher.com" : "";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${preview ? " https://vercel.live" : ""}`,
  `style-src 'self' 'unsafe-inline'${preview ? " https://vercel.live" : ""}`,
  `img-src 'self' data: blob:${preview ? " https://vercel.live https://vercel.com" : ""}`,
  `font-src 'self'${preview ? " https://vercel.live https://assets.vercel.com" : ""}`,
  `connect-src 'self'${vercelLive}`,
  `frame-src 'self'${preview ? " https://vercel.live" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
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
