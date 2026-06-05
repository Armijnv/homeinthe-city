import InterpreterServicePage from "@/app/components/InterpreterServicePage";

import { client } from "@/sanity/lib/client";
import { servicePageQuery } from "@/sanity/lib/queries";

export async function generateMetadata() {
  const page = await client.fetch(servicePageQuery, {
    slug: "interpreter-porto-alegre",
  });

  return {
    title:
      page?.seoTitle_nl ||
      "Nederlandse tolk in Porto Alegre voor zakelijke meetings | Home in the City",

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

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": "https://homeinthe.city/nl/tolk-porto-alegre#service",
        name: "Home in the City tolkdiensten in Porto Alegre",
        description:
          "Zakelijke tolken in Porto Alegre en Rio Grande do Sul voor meetings, fabrieksbezoeken, leveranciersgesprekken, technische uitleg en lokale zakelijke coördinatie.",
        url: "https://homeinthe.city/nl/tolk-porto-alegre",
        areaServed: {
          "@type": "City",
          name: "Porto Alegre",
          addressCountry: "BR",
        },
        serviceType: [
          "Business tolk in Porto Alegre",
          "Engels Portugees tolk",
          "Nederlandse tolk in Brazilië",
          "Tolken bij technische bezoeken",
          "Lokale zakelijke ondersteuning",
          "Tolkhulp bij beurzen en events",
        ],
        availableLanguage: ["nl", "en", "pt-BR"],
        provider: {
          "@id": "https://homeinthe.city/#organization",
        },
      },
      {
        "@type": "Person",
        "@id": "https://homeinthe.city/nl/tolk-porto-alegre#person",
        name: "Armijn van Dijk",
        knowsLanguage: ["Nederlands", "Engels", "Portugees"],
        jobTitle: "Oprichter van Home in the City",
        url: "https://homeinthe.city/nl/hosts/armijn",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <InterpreterServicePage lang="nl" page={page} />
    </>
  );
}
