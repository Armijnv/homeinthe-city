import type { Metadata } from "next";
import CityPage from "@/app/components/CityPage";
import {
  cityGuideDisplayContent,
} from "@/app/lib/cityGuides";
import { getCityPageData } from "@/app/lib/cityPageData";
import { cityGuideJsonLd, JsonLdScript } from "@/app/lib/structuredData";

const pageUrl = "https://homeinthe.city/brazil/porto-alegre";
const pageDescription =
  "A hosted Porto Alegre city guide with restaurants, business locations, cultural venues, walks, practical information, housing and trusted local contacts.";

const structuredData = cityGuideJsonLd({
  url: pageUrl,
  name: "Porto Alegre City Guide",
  description: pageDescription,
  inLanguage: "en",
});

/* ======================================================
   PORTO ALEGRE PAGE METADATA / SEO
====================================================== */

export const metadata: Metadata = {
  title: "Porto Alegre City Guide",
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
    title: "Porto Alegre City Guide | Home in the City",
    description:
      "Restaurants, business locations, cultural venues, walks, practical information and trusted local contacts for your stay in Porto Alegre.",
    url: pageUrl,
    siteName: "Home in the City",
    locale: "en_US",
    type: "website",
  },
};

export default async function Page() {
  const { city, propertyListings } = await getCityPageData("porto-alegre");

  return (
    <div className="relative isolate">
      <JsonLdScript data={structuredData} />
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-[url('/porto-alegre-desktop-background.jpg')] bg-cover bg-center md:block" />
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-white/25 md:block" />

      <CityPage
        lang="en"
        citySlug="porto-alegre"
        initialCity={cityGuideDisplayContent(city, "porto-alegre")}
        initialPropertyListings={propertyListings}
      />
    </div>
  );
}
