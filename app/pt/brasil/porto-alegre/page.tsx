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

const pageUrl = "https://homeinthe.city/pt/brasil/porto-alegre";
const pageDescription =
  "Guia local de Porto Alegre com restaurantes, locais para negócios, espaços culturais, caminhadas, informações práticas, moradia e contatos confiáveis.";

const structuredData = cityGuideJsonLd({
  url: pageUrl,
  name: "Guia Local de Porto Alegre",
  description: pageDescription,
  inLanguage: "pt-BR",
});

/* ======================================================
   PORTO ALEGRE PAGE METADATA / SEO
====================================================== */

export async function generateMetadata(): Promise<Metadata> {
  const { city } = await getCityPageData("porto-alegre");
  if (!city || !cityGuideIsPublic(city) || !cityGuideLanguageEnabled(city, "porto-alegre", "pt")) {
    notFound();
  }
  return cityGuideMetadata({ city, lang: "pt", citySlug: "porto-alegre" });
}

/* ======================================================
   PORTO ALEGRE PAGE
====================================================== */

export default async function Page() {
  const { city, propertyListings, liveInfo } = await getCityPageData("porto-alegre");
  if (!city || !cityGuideIsPublic(city) || !cityGuideLanguageEnabled(city, "porto-alegre", "pt")) {
    notFound();
  }

  return (
    <div className="relative isolate">
      <JsonLdScript data={structuredData} />
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-[url('/porto-alegre-desktop-background.jpg')] bg-cover bg-center md:block" />
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-white/25 md:block" />

      <CityPage
        lang="pt"
        citySlug="porto-alegre"
        initialCity={cityGuideDisplayContent(city, "porto-alegre")}
        initialPropertyListings={propertyListings}
        initialLiveInfo={liveInfo}
      />
    </div>
  );
}
