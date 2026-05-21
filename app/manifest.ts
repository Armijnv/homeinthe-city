import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Home in the City",
    short_name: "Home in the City",
    description:
      "On-site business interpretation and local support in Porto Alegre.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#1a1f2e",
    theme_color: "#1a1f2e",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
