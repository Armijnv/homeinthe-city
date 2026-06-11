import type { Metadata } from "next";
import CityPage from "@/app/components/CityPage";
import {
  cityGuideDisplayContent,
} from "@/app/lib/cityGuides";
import { getCityPageData } from "@/app/lib/cityPageData";
import { cityGuideJsonLd, JsonLdScript } from "@/app/lib/structuredData";

const pageUrl = "https://homeinthe.city/nl/brazilie/porto-alegre";
const pageDescription =
  "Een lokale gids voor Porto Alegre met restaurants, zakelijke locaties, culturele plekken, wandelroutes, praktische informatie, verblijf en vertrouwde contacten.";

const structuredData = cityGuideJsonLd({
  url: pageUrl,
  name: "Porto Alegre Lokale Gids",
  description: pageDescription,
  inLanguage: "nl-NL",
});

/* ======================================================
   PORTO ALEGRE PAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Porto Alegre Lokale Gids",
  description: pageDescription,

  alternates: {
    canonical: pageUrl,
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
    url: pageUrl,
    siteName: "Home in the City",
    locale: "nl_NL",
    type: "website",
  },
};

/* ======================================================
   PORTO ALEGRE PAGE
====================================================== */

export default async function Page() {
  const { city, propertyListings } = await getCityPageData("porto-alegre");

  return (
    <div className="relative isolate">
      <JsonLdScript data={structuredData} />
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-[url('/porto-alegre-desktop-background.jpg')] bg-cover bg-center md:block" />
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-white/25 md:block" />

      <CityPage
        lang="nl"
        citySlug="porto-alegre"
        initialCity={cityGuideDisplayContent(city, "porto-alegre")}
        initialPropertyListings={propertyListings}
      />
    </div>
  );
}
