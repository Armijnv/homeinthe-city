import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityPage from "@/app/components/CityPage";
import {
  cityGuideDisplayContent,
  cityGuideIsPublic,
  cityGuideLanguageEnabled,
  cityGuideMetadata,
} from "@/app/lib/cityGuides";
import { getCityPageData } from "@/app/lib/cityPageData";
import { cityGuideJsonLd, JsonLdScript } from "@/app/lib/structuredData";

const pageUrl = "https://homeinthe.city/brazil/porto-alegre";
const pageDescription =
  "A hosted Porto Alegre city guide with restaurants, business locations, cultural venues, walks, practical information, housing and trusted local contacts.";

export const revalidate = 60;

const structuredData = cityGuideJsonLd({
  url: pageUrl,
  name: "Porto Alegre City Guide",
  cityName: "Porto Alegre",
  description: pageDescription,
  inLanguage: "en",
  administrativeRegion: "Rio Grande do Sul",
  country: "Brazil",
});

/* ======================================================
   PORTO ALEGRE PAGE METADATA / SEO
====================================================== */

export async function generateMetadata(): Promise<Metadata> {
  const { city } = await getCityPageData("porto-alegre");
  if (!city || !cityGuideIsPublic(city) || !cityGuideLanguageEnabled(city, "porto-alegre", "en")) {
    notFound();
  }
  return cityGuideMetadata({ city, lang: "en", citySlug: "porto-alegre" });
}

export default async function Page() {
  const { city, propertyListings, liveInfo } = await getCityPageData("porto-alegre");
  if (!city || !cityGuideIsPublic(city) || !cityGuideLanguageEnabled(city, "porto-alegre", "en")) {
    notFound();
  }

  return (
    <div className="relative isolate">
      <JsonLdScript data={structuredData} />
      <CityPage
        lang="en"
        citySlug="porto-alegre"
        initialCity={cityGuideDisplayContent(city, "porto-alegre")}
        initialPropertyListings={propertyListings}
        initialLiveInfo={liveInfo}
      />
    </div>
  );
}
