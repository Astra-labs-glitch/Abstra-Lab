import type { Metadata } from "next";
import { Barlow } from "next/font/google";

import "./globals.css";
import { SiteShell } from "./site-shell";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"),
  title: {
    default: "Astra Labs — Student Rocketry at Seneca Polytechnic",
    template: "%s · Astra Labs",
  },
  description:
    "Student rocketry at Seneca Polytechnic. Building Pioneer for Launch Canada 2026.",
  openGraph: {
    type: "website",
    title: "Astra Labs — Student Rocketry at Seneca Polytechnic",
    description:
      "Student rocketry at Seneca Polytechnic. Building Pioneer for Launch Canada 2026.",
    siteName: "Astra Labs",
    images: ["/images/pick/lc-team-portrait.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Astra Labs — Student Rocketry at Seneca Polytechnic",
    description:
      "Student rocketry at Seneca Polytechnic. Building Pioneer for Launch Canada 2026.",
    images: ["/images/pick/lc-team-portrait.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={barlow.variable}>
      <body className={`home ${barlow.className}`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
