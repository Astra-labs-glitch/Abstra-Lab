import type { MetadataRoute } from "next";

// Lets phones "Add to Home Screen" with the red rocket icon and a full-screen, app-like window.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Astra Labs",
    short_name: "Astra Labs",
    description: "Seneca Polytechnic's student rocketry team.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
