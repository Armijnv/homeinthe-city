import InterpreterServicePage from "@/app/components/InterpreterServicePage";

import { client } from "@/sanity/lib/client";
import { servicePageQuery } from "@/sanity/lib/queries";

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

  return <InterpreterServicePage lang="en" page={page} />;
}
