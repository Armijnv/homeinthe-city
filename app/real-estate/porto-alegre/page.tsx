import type { Metadata } from "next";
import {
  RealEstateCityPage,
  realEstateCityConfig,
} from "@/app/components/RealEstatePages";
import type { PropertyListing } from "@/app/components/PropertyListingPage";
import { client } from "@/sanity/lib/client";
import { propertyListingsByCityQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Porto Alegre Real Estate",
  description: "Rental and sale listings in Porto Alegre from Home in the City.",
  alternates: {
    canonical: "https://homeinthe.city/real-estate/porto-alegre",
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
      lang="en"
      city={realEstateCityConfig("en", "porto-alegre")}
      listings={listings}
    />
  );
}
