import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import "./astra.css";
import { SiteShell } from "./site-shell";

// Self-hosted at build time, so visitors' browsers never contact Google Fonts.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], display: "swap", variable: "--font-archivo" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"),
  title: {
    default: "Astra Labs — Student Rocketry at Seneca Polytechnic",
    template: "%s · Astra Labs",
  },
  description:
    "Student rocketry at Seneca Polytechnic. Pioneer went to Launch Canada 2026; now we're refitting it and building our 2027 rocket.",
  openGraph: {
    type: "website",
    title: "Astra Labs — Student Rocketry at Seneca Polytechnic",
    description:
      "Student rocketry at Seneca Polytechnic. Pioneer went to Launch Canada 2026; now we're refitting it and building our 2027 rocket.",
    siteName: "Astra Labs",
    images: ["/images/astra/hero-pioneer-range.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Astra Labs — Student Rocketry at Seneca Polytechnic",
    description:
      "Student rocketry at Seneca Polytechnic. Pioneer went to Launch Canada 2026; now we're refitting it and building our 2027 rocket.",
    images: ["/images/astra/hero-pioneer-range.jpg"],
  },
  appleWebApp: { capable: true, title: "Astra Labs", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className="home">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
