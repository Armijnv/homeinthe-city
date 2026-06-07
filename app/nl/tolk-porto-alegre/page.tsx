import InterpreterServicePage from "@/app/components/InterpreterServicePage";
import { cleanMetadataTitle } from "@/app/lib/metadataTitle";
import { JsonLdScript, serviceJsonLd } from "@/app/lib/structuredData";

import { client } from "@/sanity/lib/client";
import { servicePageQuery } from "@/sanity/lib/queries";

export async function generateMetadata() {
  const page = await client.fetch(servicePageQuery, {
    slug: "interpreter-porto-alegre",
  });

  return {
    title:
      cleanMetadataTitle(page?.seoTitle_nl) ||
      "Nederlandse tolk in Porto Alegre voor zakelijke meetings",

    description:
      page?.seoDescription_nl ||
      "Nederlandse tolk in Porto Alegre voor zakelijke meetings, fabrieksbezoeken en begeleiding tijdens zakenreizen in Brazilië. Engels · Portugees · Nederlands.",

    keywords: [
      "Nederlandse tolk Porto Alegre",
      "tolk Portugees Nederlands Brazilië",
      "zakelijke tolk Porto Alegre",
      "interpreter Brazilië",
      "Portugees Nederlands tolk",
      "fabrieksbezoek Brazilië",
      "zakenreis Porto Alegre",
    ],

    alternates: {
      canonical: "https://homeinthe.city/nl/tolk-porto-alegre",
    },
  };
}

export default async function Page() {
  const page = await client.fetch(servicePageQuery, {
    slug: "interpreter-porto-alegre",
  });

  const structuredData = serviceJsonLd({
    url: "https://homeinthe.city/nl/tolk-porto-alegre",
    name: "Home in the City tolkdiensten in Porto Alegre",
    description:
      "Zakelijke tolken in Porto Alegre en Rio Grande do Sul voor meetings, fabrieksbezoeken, leveranciersgesprekken, technische uitleg en lokale zakelijke coördinatie.",
    serviceType: [
      "Business tolk in Porto Alegre",
      "Engels Portugees tolk",
      "Nederlandse tolk in Brazilië",
      "Tolken bij technische bezoeken",
      "Lokale zakelijke ondersteuning",
      "Tolkhulp bij beurzen en events",
    ],
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Porto Alegre en Rio Grande do Sul",
      addressCountry: "BR",
    },
    availableLanguage: ["nl", "en", "pt-BR"],
    inLanguage: "nl-NL",
  });

  return (
    <>
      <JsonLdScript data={structuredData} />

      <InterpreterServicePage lang="nl" page={page} />
    </>
  );
}
