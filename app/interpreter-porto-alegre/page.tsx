import InterpreterServicePage from "@/app/components/InterpreterServicePage";
import { cleanMetadataTitle } from "@/app/lib/metadataTitle";
import { JsonLdScript, serviceJsonLd } from "@/app/lib/structuredData";

import { client } from "@/sanity/lib/client";
import { servicePageQuery } from "@/sanity/lib/queries";

const pageUrl = "https://homeinthe.city/interpreter-porto-alegre";
const structuredData = serviceJsonLd({
  url: pageUrl,
  name: "Home in the City Interpreter Services in Porto Alegre",
  description:
    "Business interpreter services in Porto Alegre and Rio Grande do Sul for meetings, factory visits, supplier conversations, technical explanations and local business coordination.",
  image: "https://homeinthe.city/og-armijn2.jpg",
  serviceType: [
    "Business interpreter in Porto Alegre",
    "English Portuguese interpreter",
    "English interpreter in Porto Alegre",
    "Factory visit interpretation",
    "Technical visit interpretation",
    "Local business support",
    "Trade show interpreter support",
  ],
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Porto Alegre and Rio Grande do Sul",
    addressCountry: "BR",
  },
  availableLanguage: ["en", "pt-BR", "nl"],
  inLanguage: "en",
});

export async function generateMetadata() {
  const page = await client.fetch(servicePageQuery, {
    slug: "interpreter-porto-alegre",
  });

  return {
    title:
      cleanMetadataTitle(page?.seoTitle_en) ||
      "Business Interpreter in Porto Alegre",

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
      <JsonLdScript data={structuredData} />
      <InterpreterServicePage lang="en" page={page} />
    </>
  );
}
