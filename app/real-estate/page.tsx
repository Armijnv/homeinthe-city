import type { Metadata } from "next";
import {
  RealEstateOverviewPage,
} from "@/app/components/RealEstatePages";
import { client } from "@/sanity/lib/client";
import {
  propertyListingListQuery,
  realtorProviderQuery,
} from "@/sanity/lib/queries";
import type { PropertyListing } from "@/app/components/PropertyListingPage";

export const metadata: Metadata = {
  title: "Real Estate",
  description:
    "Buying, selling and renting support in Brazil with Home in the City real estate listings.",
  alternates: {
    canonical: "https://homeinthe.city/real-estate",
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

  return <RealEstateOverviewPage lang="en" listings={listings} realtor={realtor} />;
}
