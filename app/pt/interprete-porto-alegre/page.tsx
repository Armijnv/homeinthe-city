import InterpreterServicePage from "@/app/components/InterpreterServicePage";

import { client } from "@/sanity/lib/client";
import { servicePageQuery } from "@/sanity/lib/queries";

export async function generateMetadata() {
  const page = await client.fetch(servicePageQuery, {
    slug: "interpreter-porto-alegre",
  });

  return {
    title:
      page?.seoTitle_pt ||
      "Intérprete em Porto Alegre para Reuniões de Negócios | Home in the City",

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

  return <InterpreterServicePage lang="pt" page={page} />;
}
