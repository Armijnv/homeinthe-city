import type { Metadata } from "next";
import {
  RealEstateCityPage,
  realEstateCityConfig,
} from "@/app/components/RealEstatePages";
import type { PropertyListing } from "@/app/components/PropertyListingPage";
import { client } from "@/sanity/lib/client";
import { propertyListingsByCityQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Vastgoed in Porto Alegre",
  description: "Huur- en koopaanbod in Porto Alegre van Home in the City.",
  alternates: {
    canonical: "https://homeinthe.city/nl/vastgoed/porto-alegre",
    languages: {
      en: "https://homeinthe.city/real-estate/porto-alegre",
      pt: "https://homeinthe.city/pt/imoveis/porto-alegre",
      nl: "https://homeinthe.city/nl/vastgoed/porto-alegre",
    },
  },
};

export default async function Page() {
  const listings = await client.fetch<PropertyListing[]>(propertyListingsByCityQuery, {
    citySlug: "porto-alegre",
    cityNames: ["Porto Alegre", "porto-alegre"],
  });

  return (
    <RealEstateCityPage
      lang="nl"
      city={realEstateCityConfig("nl", "porto-alegre")}
      listings={listings}
    />
  );
}
