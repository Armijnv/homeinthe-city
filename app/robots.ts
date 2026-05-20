import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://homeinthe.city/sitemap.xml",
    host: "https://homeinthe.city",
  };
}
