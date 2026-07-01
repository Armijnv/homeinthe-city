import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/dashboard/",
        "/account",
        "/account/",
        "/sign-in",
        "/sign-in/",
        "/sign-up",
        "/sign-up/",
        "/admin-guide",
        "/admin-guide/",
        "/studio",
        "/studio/",
      ],
    },
    sitemap: "https://homeinthe.city/sitemap.xml",
    host: "https://homeinthe.city",
  };
}
