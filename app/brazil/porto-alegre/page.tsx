import type { Metadata } from "next";
import CityPage from "@/app/components/CityPage";

/* ======================================================
   PORTO ALEGRE PAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Porto Alegre City Guide | Home in the City",
  description:
    "A hosted Porto Alegre city guide with restaurants, business locations, cultural venues, walks, practical information, housing and trusted local contacts.",

  alternates: {
    canonical: "https://homeinthe.city/brazil/porto-alegre",
    languages: {
      en: "https://homeinthe.city/brazil/porto-alegre",
      pt: "https://homeinthe.city/pt/brasil/porto-alegre",
      nl: "https://homeinthe.city/nl/brazilie/porto-alegre",
    },
  },

  openGraph: {
    title: "Porto Alegre City Guide | Home in the City",
    description:
      "Restaurants, business locations, cultural venues, walks, practical information and trusted local contacts for your stay in Porto Alegre.",
    url: "https://homeinthe.city/brazil/porto-alegre",
    siteName: "Home in the City",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return (
    <div className="relative isolate">
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-[url('/porto-alegre-desktop-background.jpg')] bg-cover bg-center md:block" />
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-white/25 md:block" />

      <CityPage lang="en" />
    </div>
  );
}
