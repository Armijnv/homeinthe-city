import InterpreterServicePage from "@/app/components/InterpreterServicePage";
import { cleanMetadataTitle } from "@/app/lib/metadataTitle";
import { JsonLdScript, serviceJsonLd } from "@/app/lib/structuredData";

import { client } from "@/sanity/lib/client";
import { servicePageQuery } from "@/sanity/lib/queries";

const structuredData = serviceJsonLd({
  url: "https://homeinthe.city/pt/interprete-porto-alegre",
  name: "Serviços de intérprete da Home in the City em Porto Alegre",
  description:
    "Serviços de intérprete de negócios em Porto Alegre e no Rio Grande do Sul para reuniões, visitas a fábricas, conversas com fornecedores, explicações técnicas e coordenação empresarial local.",
  image: "https://homeinthe.city/og-armijn2.jpg",
  serviceType: [
    "Intérprete de negócios em Porto Alegre",
    "Intérprete inglês-português",
    "Acompanhamento empresarial",
    "Interpretação em visitas técnicas",
    "Apoio em visitas técnicas e fábricas",
    "Apoio em feiras e eventos de negócios",
  ],
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Porto Alegre e Rio Grande do Sul",
    addressCountry: "BR",
  },
  availableLanguage: ["pt-BR", "en", "nl"],
  inLanguage: "pt-BR",
});

export async function generateMetadata() {
  const page = await client.fetch(servicePageQuery, {
    slug: "interpreter-porto-alegre",
  });

  return {
    title:
      cleanMetadataTitle(page?.seoTitle_pt) ||
      "Intérprete em Porto Alegre para Reuniões de Negócios",

    description:
      page?.seoDescription_pt ||
      "Intérprete em Porto Alegre para reuniões de negócios, visitas industriais e apoio local durante viagens corporativas no Brasil. Português · Inglês · Holandês.",

    keywords: [
      "intérprete Porto Alegre",
      "tradutor Porto Alegre",
      "apoio empresarial Porto Alegre",
      "intérprete inglês português",
      "intérprete holandês Brasil",
      "visitas industriais Porto Alegre",
      "viagem de negócios Brasil",
    ],

    alternates: {
      canonical: "https://homeinthe.city/pt/interprete-porto-alegre",
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
      <InterpreterServicePage lang="pt" page={page} />
    </>
  );
}
