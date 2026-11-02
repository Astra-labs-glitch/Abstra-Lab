import type { NextConfig } from "next";

const securityHeaders = [
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "X-Frame-Options", value: "DENY" },
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=()",
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=63072000; includeSubDomains; preload",
	},
];

const nextConfig: NextConfig = {
	output: "standalone",
	async headers() {
		return [{ source: "/:path*", headers: securityHeaders }];
	},
	async redirects() {
		return [
			{
				source: "/work",
				destination: "/pioneer",
				permanent: true,
			},
			{
				source: "/projects",
				destination: "/pioneer",
				permanent: true,
			},
			{
				source: "/sponsor",
				destination: "/sponsorship",
				permanent: true,
			},
      {
        source: "/discord",
        destination: "/join#discord",
        permanent: false,
      },
      {
        source: "/news",
        destination: "/posts",
        permanent: false,
      },
      {
        source: "/admin/:path*",
        destination: "/",
        permanent: false,
      },
			{
				source: "/dashboard",
				destination: "/",
				permanent: false,
			},
			{
				source: "/dashboard/:path*",
				destination: "/",
				permanent: false,
			},
			{
				source: "/accounts",
				destination: "/",
				permanent: false,
			},
			{
				source: "/accounts/:path*",
				destination: "/",
				permanent: false,
			},
			{
				source: "/login",
				destination: "/",
				permanent: false,
			},
			{
				source: "/signup",
				destination: "/",
				permanent: false,
			},
		];
	},
};

export default nextConfig;
