import { client } from "@/sanity/lib/client";
import { cityQuery } from "@/sanity/lib/queries";
import CityPageClient from "./CityPageClient";

type Lang = "en" | "pt" | "nl";

/* ======================================================
   SERVER-SIDE CITY PAGE DATA
====================================================== */

export default async function CityPage({ lang }: { lang: Lang }) {
  const city = await client.fetch(cityQuery, { slug: "porto-alegre" });

  return <CityPageClient lang={lang} city={city} />;
}