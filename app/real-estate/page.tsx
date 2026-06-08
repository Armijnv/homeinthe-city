import type { Metadata } from "next";
import {
  RealEstateOverviewPage,
} from "@/app/components/RealEstatePages";
import { compactJsonLd, JsonLdScript } from "@/app/lib/structuredData";
import { client } from "@/sanity/lib/client";
import {
  propertyListingListQuery,
  realtorProviderQuery,
} from "@/sanity/lib/queries";
import type { PropertyListing } from "@/app/components/PropertyListingPage";

export const metadata: Metadata = {
  title: "Real Estate Brazil | Monthly Rentals, Homes for Sale and Local Support",
  description:
    "Curated real estate in Brazil for foreigners, digital nomads, expats, international buyers and property owners. Monthly rentals, homes for sale, relocation and interpreter support.",
  keywords: [
    "real estate Brazil",
    "property for sale in Brazil",
    "monthly rentals Brazil",
    "digital nomad rentals Brazil",
    "furnished apartments Brazil",
    "homes for sale in Brazil",
    "buy property in Brazil",
    "beach houses Brazil",
    "expat housing Brazil",
    "relocation Brazil",
    "international property Brazil",
    "Brazil property investment",
  ],
  alternates: {
    canonical: "https://homeinthe.city/real-estate",
    languages: {
      en: "https://homeinthe.city/real-estate",
      pt: "https://homeinthe.city/pt/imoveis",
      nl: "https://homeinthe.city/nl/vastgoed",
    },
  },
  openGraph: {
    title: "Find Your Place in Brazil | Home in the City",
    description:
      "Monthly stays, unique homes and trusted local support for international visitors, digital nomads, expats and property buyers.",
    url: "https://homeinthe.city/real-estate",
    siteName: "Home in the City",
    images: [
      {
        url: "https://homeinthe.city/porto-alegre-river.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

type RealtorProfile = Parameters<typeof RealEstateOverviewPage>[0]["realtor"];

const structuredData = compactJsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://homeinthe.city/real-estate#service",
      name: "Home in the City Real Estate Brazil",
      serviceType: [
        "Monthly rentals Brazil",
        "Property sales Brazil",
        "Relocation services Brazil",
        "Interpreter services for property visits",
        "International property support Brazil",
      ],
      description:
        "Curated monthly stays, homes for sale and local support in Brazil for international visitors, digital nomads, remote workers, expats, foreign buyers and property owners.",
      provider: {
        "@type": "Organization",
        "@id": "https://homeinthe.city/#organization",
        name: "Home in the City",
        url: "https://homeinthe.city",
      },
      areaServed: {
        "@type": "Country",
        name: "Brazil",
      },
      availableLanguage: ["English", "Portuguese", "Dutch"],
      audience: [
        {
          "@type": "Audience",
          audienceType: "Digital nomads and remote workers",
        },
        {
          "@type": "Audience",
          audienceType: "Foreign buyers and expats",
        },
        {
          "@type": "Audience",
          audienceType: "Foreign property owners in Brazil",
        },
      ],
    },
    {
      "@type": "WebPage",
      "@id": "https://homeinthe.city/real-estate#webpage",
      name: "Find Your Place in Brazil",
      url: "https://homeinthe.city/real-estate",
      description:
        "A premium Home in the City property portal for monthly rentals, unique homes, property sales, relocation assistance and interpreter support in Brazil.",
      inLanguage: "en",
      isPartOf: {
        "@id": "https://homeinthe.city/#website",
      },
      about: {
        "@id": "https://homeinthe.city/real-estate#service",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://homeinthe.city/real-estate#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Can foreigners buy property in Brazil?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Foreigners can generally buy urban property in Brazil without being residents, although documents, tax registration and local legal checks are important.",
          },
        },
        {
          "@type": "Question",
          name: "What are the best places in Brazil for digital nomads?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Digital nomads often look at Porto Alegre, Florianópolis, Garopaba, São Paulo and Rio de Janeiro depending on their needs for internet, lifestyle, beach access, business travel and local support.",
          },
        },
        {
          "@type": "Question",
          name: "Can I rent a furnished apartment in Brazil for several months?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Home in the City focuses on curated monthly rentals and furnished apartments in Brazil for remote workers, executives, researchers and long-stay international visitors.",
          },
        },
        {
          "@type": "Question",
          name: "How do international buyers view properties in Brazil?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "International buyers can arrange guided property visits with local context, neighborhood orientation and language support before making an offer.",
          },
        },
        {
          "@type": "Question",
          name: "Can Home in the City help during property visits and negotiations?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Home in the City can assist during property visits, local coordination, practical questions and communication with sellers, agents or owners.",
          },
        },
        {
          "@type": "Question",
          name: "Can Home in the City provide interpreter support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Interpreter support is available in English, Portuguese and Dutch for property visits, meetings, relocation appointments and negotiations in Brazil.",
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
      <RealEstateOverviewPage lang="en" listings={listings} realtor={realtor} />
    </>
  );
}
