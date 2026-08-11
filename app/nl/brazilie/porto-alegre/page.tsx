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

const pageUrl = "https://homeinthe.city/nl/brazilie/porto-alegre";
const pageDescription =
  "Een lokale gids voor Porto Alegre met restaurants, zakelijke locaties, culturele plekken, wandelroutes, praktische informatie, verblijf en vertrouwde contacten.";

export const revalidate = 60;

const structuredData = cityGuideJsonLd({
  url: pageUrl,
  name: "Porto Alegre Lokale Gids",
  cityName: "Porto Alegre",
  description: pageDescription,
  inLanguage: "nl-NL",
  administrativeRegion: "Rio Grande do Sul",
  country: "Brazil",
});

/* ======================================================
   PORTO ALEGRE PAGE METADATA / SEO
====================================================== */

export async function generateMetadata(): Promise<Metadata> {
  const { city } = await getCityPageData("porto-alegre");
  if (!city || !cityGuideIsPublic(city) || !cityGuideLanguageEnabled(city, "porto-alegre", "nl")) {
    notFound();
  }
  return cityGuideMetadata({ city, lang: "nl", citySlug: "porto-alegre" });
}

/* ======================================================
   PORTO ALEGRE PAGE
====================================================== */

export default async function Page() {
  const { city, propertyListings, liveInfo } = await getCityPageData("porto-alegre");
  if (!city || !cityGuideIsPublic(city) || !cityGuideLanguageEnabled(city, "porto-alegre", "nl")) {
    notFound();
  }

  return (
    <div className="relative isolate">
      <JsonLdScript data={structuredData} />
      <CityPage
        lang="nl"
        citySlug="porto-alegre"
        initialCity={cityGuideDisplayContent(city, "porto-alegre")}
        initialPropertyListings={propertyListings}
        initialLiveInfo={liveInfo}
      />
    </div>
  );
}
