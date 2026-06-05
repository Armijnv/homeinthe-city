import InterpreterServicePage from "@/app/components/InterpreterServicePage";

import { client } from "@/sanity/lib/client";
import { servicePageQuery } from "@/sanity/lib/queries";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://homeinthe.city/interpreter-porto-alegre#service",
      name: "Home in the City Interpreter Services in Porto Alegre",
      description:
        "Business interpreter services in Porto Alegre and Rio Grande do Sul for meetings, factory visits, supplier conversations, technical explanations and local business coordination.",
      url: "https://homeinthe.city/interpreter-porto-alegre",
      image: "https://homeinthe.city/og-armijn2.jpg",
      areaServed: {
        "@type": "City",
        name: "Porto Alegre",
        addressCountry: "BR",
      },
      serviceType: [
        "Business interpreter in Porto Alegre",
        "English Portuguese interpreter",
        "English interpreter in Porto Alegre",
        "Factory visit interpretation",
        "Technical visit interpretation",
        "Local business support",
        "Trade show interpreter support",
      ],
      availableLanguage: ["en", "pt-BR", "nl"],
      provider: {
        "@id": "https://homeinthe.city/#organization",
      },
    },
    {
      "@type": "Person",
      "@id": "https://homeinthe.city/interpreter-porto-alegre#person",
      name: "Armijn van Dijk",
      jobTitle: "Founder of Home in the City",
      url: "https://homeinthe.city/hosts/armijn",
      knowsLanguage: ["English", "Portuguese", "Dutch"],
      worksFor: {
        "@type": "Organization",
        name: "Home in the City",
        url: "https://homeinthe.city",
      },
    },
  ],
};

export async function generateMetadata() {
  const page = await client.fetch(servicePageQuery, {
    slug: "interpreter-porto-alegre",
  });

  return {
    title:
      page?.seoTitle_en ||
      "Interpreter in Porto Alegre for Business Meetings | Home in the City",

    description:
      page?.seoDescription_en ||
      "Interpreter in Porto Alegre for business meetings, factory visits and local support during business trips in Brazil. English · Portuguese · Dutch.",

    keywords: [
      "interpreter Porto Alegre",
      "business interpreter Brazil",
      "English Portuguese interpreter",
      "Dutch interpreter Brazil",
      "factory visits Porto Alegre",
      "business support Porto Alegre",
      "translator Porto Alegre",
    ],

    alternates: {
      canonical: "https://homeinthe.city/interpreter-porto-alegre",
      languages: {
        en: "https://homeinthe.city/interpreter-porto-alegre",
        pt: "https://homeinthe.city/pt/interprete-porto-alegre",
        nl: "https://homeinthe.city/nl/tolk-porto-alegre",
      },
    },
  };
}

export default async function Page() {
  const page = await client.fetch(servicePageQuery, {
    slug: "interpreter-porto-alegre",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <InterpreterServicePage lang="en" page={page} />
    </>
  );
}
