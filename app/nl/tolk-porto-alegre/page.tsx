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
    "@type": "ProfessionalService",
    name: "Home in the City - Nederlandse tolk in Porto Alegre",
    description:
      "Nederlandse tolk in Porto Alegre voor zakelijke meetings, fabrieksbezoeken en lokale begeleiding tijdens zakenreizen in Brazilië.",
    url: "https://homeinthe.city/nl/tolk-porto-alegre",
    areaServed: {
      "@type": "City",
      name: "Porto Alegre",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Porto Alegre",
        addressRegion: "RS",
        addressCountry: "BR",
      },
    },
    serviceType: [
      "Nederlandse tolk",
      "Zakelijke tolk",
      "Portugees Nederlands tolk",
      "Begeleiding bij fabrieksbezoeken",
      "Lokale ondersteuning tijdens zakenreizen",
    ],
    availableLanguage: ["Nederlands", "Engels", "Portugees"],
    provider: {
      "@type": "Person",
      name: "Armijn van Dijk",
      knowsLanguage: ["Nederlands", "Engels", "Portugees"],
      jobTitle: "Interpreter and local business host in Porto Alegre",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+55 51 99778-3369",
      availableLanguage: ["Nederlands", "Engels", "Portugees"],
    },
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
