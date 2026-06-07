import type { Metadata } from "next";
import {
  RealEstateCityPage,
  realEstateCityConfig,
} from "@/app/components/RealEstatePages";
import type { PropertyListing } from "@/app/components/PropertyListingPage";
import { client } from "@/sanity/lib/client";
import { propertyListingsByCityQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Imóveis em Florianópolis",
  description: "Anúncios de venda e aluguel em Florianópolis pela Home in the City.",
  alternates: {
    canonical: "https://homeinthe.city/pt/imoveis/florianopolis",
    languages: {
      en: "https://homeinthe.city/real-estate/florianopolis",
      pt: "https://homeinthe.city/pt/imoveis/florianopolis",
      nl: "https://homeinthe.city/nl/vastgoed/florianopolis",
    },
  },
};

export default async function Page() {
  const listings = await client.fetch<PropertyListing[]>(propertyListingsByCityQuery, {
    citySlug: "florianopolis",
    cityNames: ["Florianópolis", "Florianopolis", "florianopolis"],
  });

  return (
    <RealEstateCityPage
      lang="pt"
      city={realEstateCityConfig("pt", "florianopolis")}
      listings={listings}
    />
  );
}
