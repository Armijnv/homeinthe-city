import type { Metadata } from "next";
import CityPage from "@/app/components/CityPage";

/* ======================================================
   PORTO ALEGRE PAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Porto Alegre Lokale Gids | Home in the City",
  description:
    "Een lokale gids voor Porto Alegre met restaurants, zakelijke locaties, culturele plekken, wandelroutes, praktische informatie, verblijf en vertrouwde contacten.",

  alternates: {
    canonical: "https://homeinthe.city/nl/brazilie/porto-alegre",
    languages: {
      en: "https://homeinthe.city/brazil/porto-alegre",
      pt: "https://homeinthe.city/pt/brasil/porto-alegre",
      nl: "https://homeinthe.city/nl/brazilie/porto-alegre",
    },
  },

  openGraph: {
    title: "Porto Alegre Lokale Gids | Home in the City",
    description:
      "Restaurants, zakelijke locaties, culturele plekken, wandelroutes, praktische informatie en betrouwbare lokale contacten in Porto Alegre.",
    url: "https://homeinthe.city/nl/brazilie/porto-alegre",
    siteName: "Home in the City",
    locale: "nl_NL",
    type: "website",
  },
};

/* ======================================================
   PORTO ALEGRE PAGE
====================================================== */

export default function Page() {
  return (
    <div className="relative isolate">
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-[url('/porto-alegre-desktop-background.jpg')] bg-cover bg-center md:block" />
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-white/25 md:block" />

      <CityPage lang="nl" />
    </div>
  );
}
