import InterpreterServicePage from "@/app/components/InterpreterServicePage";

import { client } from "@/sanity/lib/client";
import { servicePageQuery } from "@/sanity/lib/queries";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://homeinthe.city/pt/interprete-porto-alegre#service",
      name: "Intérprete em Porto Alegre para reuniões de negócios",
      description:
        "Serviço de interpretação inglês-português, acompanhamento empresarial e apoio local para visitantes estrangeiros em Porto Alegre.",
      url: "https://homeinthe.city/pt/interprete-porto-alegre",
      image: "https://homeinthe.city/og-armijn2.jpg",
      areaServed: {
        "@type": "City",
        name: "Porto Alegre",
        addressCountry: "BR",
      },
      serviceType: [
        "Intérprete inglês-português",
        "Acompanhamento empresarial",
        "Apoio local para visitantes estrangeiros",
        "Interpretação em reuniões de negócios",
        "Apoio em visitas técnicas e fábricas",
      ],
      availableLanguage: ["pt-BR", "en", "nl"],
      provider: {
        "@id": "https://homeinthe.city/pt/interprete-porto-alegre#person",
      },
    },
    {
      "@type": "Person",
      "@id": "https://homeinthe.city/pt/interprete-porto-alegre#person",
      name: "Armijn van Dijk",
      jobTitle: "Intérprete e apoio local de negócios em Porto Alegre",
      url: "https://homeinthe.city/pt/hosts/armijn",
      knowsLanguage: ["Português", "Inglês", "Holandês"],
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
      page?.seoTitle_pt ||
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <InterpreterServicePage lang="pt" page={page} />
    </>
  );
}
