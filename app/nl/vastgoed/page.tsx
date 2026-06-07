import type { Metadata } from "next";
import { RealEstateOverviewPage } from "@/app/components/RealEstatePages";
import type { PropertyListing } from "@/app/components/PropertyListingPage";
import { client } from "@/sanity/lib/client";
import {
  propertyListingListQuery,
  realtorProviderQuery,
} from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Vastgoed",
  description:
    "Ondersteuning bij kopen, verkopen en huren in Brazilië met vastgoedaanbod van Home in the City.",
  alternates: {
    canonical: "https://homeinthe.city/nl/vastgoed",
    languages: {
      en: "https://homeinthe.city/real-estate",
      pt: "https://homeinthe.city/pt/imoveis",
      nl: "https://homeinthe.city/nl/vastgoed",
    },
  },
};

type RealtorProfile = Parameters<typeof RealEstateOverviewPage>[0]["realtor"];

export default async function Page() {
  const [listings, realtor] = await Promise.all([
    client.fetch<PropertyListing[]>(propertyListingListQuery),
    client.fetch<RealtorProfile>(realtorProviderQuery),
  ]);

  return <RealEstateOverviewPage lang="nl" listings={listings} realtor={realtor} />;
}
