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

  return <InterpreterServicePage lang="nl" page={page} />;
}
