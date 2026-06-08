import type { Metadata } from "next";
import { RealEstateOverviewPage } from "@/app/components/RealEstatePages";
import { compactJsonLd, JsonLdScript } from "@/app/lib/structuredData";
import type { PropertyListing } from "@/app/components/PropertyListingPage";
import { client } from "@/sanity/lib/client";
import {
  propertyListingListQuery,
  realtorProviderQuery,
} from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Vastgoed Brazilië | Maandhuur, Woningen te Koop en Lokale Hulp",
  description:
    "Geselecteerd vastgoed in Brazilië voor buitenlanders, digital nomads, expats, internationale kopers en eigenaren. Maandhuur, woningen te koop, verhuishulp en tolkhulp.",
  keywords: [
    "vastgoed Brazilië",
    "vastgoed te koop in Brazilië",
    "maandhuur Brazilië",
    "digital nomad huur Brazilië",
    "gemeubileerde appartementen Brazilië",
    "woningen te koop Brazilië",
    "vastgoed kopen in Brazilië",
    "strandhuizen Brazilië",
    "expat huisvesting Brazilië",
    "verhuizen naar Brazilië",
    "internationaal vastgoed Brazilië",
    "vastgoedinvestering Brazilië",
  ],
  alternates: {
    canonical: "https://homeinthe.city/nl/vastgoed",
    languages: {
      en: "https://homeinthe.city/real-estate",
      pt: "https://homeinthe.city/pt/imoveis",
      nl: "https://homeinthe.city/nl/vastgoed",
    },
  },
  openGraph: {
    title: "Vind Uw Plek in Brazilië | Home in the City",
    description:
      "Maandelijkse verblijven, geselecteerde woningen en betrouwbare lokale ondersteuning voor digital nomads, buitenlandse kopers, expats en vastgoedeigenaren in Brazilië.",
    url: "https://homeinthe.city/nl/vastgoed",
    siteName: "Home in the City",
    images: [
      {
        url: "https://homeinthe.city/porto-alegre-river.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
};

type RealtorProfile = Parameters<typeof RealEstateOverviewPage>[0]["realtor"];

const structuredData = compactJsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://homeinthe.city/nl/vastgoed#service",
      name: "Home in the City Vastgoed Brazilië",
      serviceType: [
        "Maandhuur Brazilië",
        "Vastgoedverkoop Brazilië",
        "Verhuisbegeleiding Brazilië",
        "Tolkdiensten voor vastgoedbezoeken",
        "Internationale vastgoedondersteuning Brazilië",
      ],
      description:
        "Geselecteerde maandverblijven, woningen te koop en lokale ondersteuning in Brazilië voor internationale bezoekers, digital nomads, remote workers, expats, buitenlandse kopers en eigenaren.",
      provider: {
        "@type": "Organization",
        "@id": "https://homeinthe.city/#organization",
        name: "Home in the City",
        url: "https://homeinthe.city",
      },
      areaServed: {
        "@type": "Country",
        name: "Brazilië",
      },
      availableLanguage: ["Nederlands", "Engels", "Portugees"],
      audience: [
        {
          "@type": "Audience",
          audienceType: "Digital nomads en remote workers",
        },
        {
          "@type": "Audience",
          audienceType: "Buitenlandse kopers en expats",
        },
        {
          "@type": "Audience",
          audienceType: "Buitenlandse vastgoedeigenaren in Brazilië",
        },
      ],
    },
    {
      "@type": "WebPage",
      "@id": "https://homeinthe.city/nl/vastgoed#webpage",
      name: "Vind Uw Plek in Brazilië",
      url: "https://homeinthe.city/nl/vastgoed",
      description:
        "Een premium vastgoedpagina van Home in the City voor maandhuur, unieke woningen, vastgoedverkoop, verhuisbegeleiding en tolkhulp in Brazilië.",
      inLanguage: "nl-NL",
      isPartOf: {
        "@id": "https://homeinthe.city/#website",
      },
      about: {
        "@id": "https://homeinthe.city/nl/vastgoed#service",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://homeinthe.city/nl/vastgoed#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Kunnen buitenlanders vastgoed kopen in Brazilië?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ja. Buitenlanders kunnen meestal stedelijk vastgoed in Brazilië kopen zonder resident te zijn, hoewel documenten, belastingregistratie en lokale juridische controles belangrijk zijn.",
          },
        },
        {
          "@type": "Question",
          name: "Wat zijn de beste plekken in Brazilië voor digital nomads?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Digital nomads kijken vaak naar Porto Alegre, Florianópolis, Garopaba, São Paulo en Rio de Janeiro afhankelijk van internet, levensstijl, strand, zakenreizen en lokale ondersteuning.",
          },
        },
        {
          "@type": "Question",
          name: "Kan ik een gemeubileerd appartement in Brazilië voor meerdere maanden huren?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ja. Home in the City richt zich op geselecteerde maandhuur en gemeubileerde appartementen in Brazilië voor remote workers, executives, onderzoekers en internationale long-stay bezoekers.",
          },
        },
        {
          "@type": "Question",
          name: "Hoe bekijken internationale kopers vastgoed in Brazilië?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Internationale kopers kunnen begeleide bezichtigingen regelen met lokale context, buurtoriëntatie en taalondersteuning voordat ze een bod doen.",
          },
        },
        {
          "@type": "Question",
          name: "Kan Home in the City helpen bij bezichtigingen en onderhandelingen?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ja. Home in the City kan helpen bij bezichtigingen, lokale coördinatie, praktische vragen en communicatie met verkopers, makelaars of eigenaren.",
          },
        },
        {
          "@type": "Question",
          name: "Kan Home in the City tolkhulp bieden?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ja. Tolkhulp is beschikbaar in Engels, Portugees en Nederlands voor vastgoedbezoeken, vergaderingen, verhuisafspraken en onderhandelingen in Brazilië.",
          },
        },
      ],
    },
  ],
});

export default async function Page() {
  const [listings, realtor] = await Promise.all([
    client.fetch<PropertyListing[]>(propertyListingListQuery),
    client.fetch<RealtorProfile>(realtorProviderQuery),
  ]);

  return (
    <>
      <JsonLdScript data={structuredData} />
      <RealEstateOverviewPage lang="nl" listings={listings} realtor={realtor} />
    </>
  );
}
