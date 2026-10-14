import type { Metadata } from "next";
import "./globals.css";
import "./astra.css";
import { SiteShell } from "./site-shell";

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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&display=swap"
        />
      </head>
      <body className="home">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
