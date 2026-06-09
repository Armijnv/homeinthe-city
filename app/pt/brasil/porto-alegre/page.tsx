import type { Metadata } from "next";
import CityPage from "@/app/components/CityPage";
import {
  cityGuideDisplayContent,
  type CityGuideContent,
} from "@/app/lib/cityGuides";
import { cityGuideJsonLd, JsonLdScript } from "@/app/lib/structuredData";
import { client } from "@/sanity/lib/client";
import { cityQuery } from "@/sanity/lib/queries";

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

export const metadata: Metadata = {
  title: "Guia Local de Porto Alegre",
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
    title: "Guia Local de Porto Alegre | Home in the City",
    description:
      "Restaurantes, locais para negócios, espaços culturais, caminhadas, informações práticas e contatos locais confiáveis em Porto Alegre.",
    url: pageUrl,
    siteName: "Home in the City",
    locale: "pt_BR",
    type: "website",
  },
};

/* ======================================================
   PORTO ALEGRE PAGE
====================================================== */

export default async function Page() {
  const city = await client.fetch<CityGuideContent | null>(cityQuery, {
    slug: "porto-alegre",
  });

  return (
    <div className="relative isolate">
      <JsonLdScript data={structuredData} />
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-[url('/porto-alegre-desktop-background.jpg')] bg-cover bg-center md:block" />
      <div className="pointer-events-none fixed inset-0 z-0 hidden bg-white/25 md:block" />

      <CityPage
        lang="pt"
        citySlug="porto-alegre"
        initialCity={cityGuideDisplayContent(city, "porto-alegre")}
      />
    </div>
  );
}
