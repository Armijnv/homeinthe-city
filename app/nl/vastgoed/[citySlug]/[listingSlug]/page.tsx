import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PropertyListingPage, {
  type PropertyListing,
} from "@/app/components/PropertyListingPage";
import {
  PropertyListingJsonLd,
  propertyListingMetadata,
} from "@/app/lib/propertyListings";
import { client } from "@/sanity/lib/client";
import { propertyListingQuery } from "@/sanity/lib/queries";

type PageProps = {
  params: Promise<{ citySlug: string; listingSlug: string }>;
};

async function getListing(citySlug: string, listingSlug: string) {
  return client.fetch<PropertyListing | null>(propertyListingQuery, {
    citySlug,
    listingSlug,
  });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { citySlug, listingSlug } = await params;
  const listing = await getListing(citySlug, listingSlug);

  return propertyListingMetadata({
    listing,
    lang: "nl",
    citySlug,
    listingSlug,
  });
}

export default async function Page({ params }: PageProps) {
  const { citySlug, listingSlug } = await params;
  const listing = await getListing(citySlug, listingSlug);

  if (!listing) notFound();

  return (
    <>
      <PropertyListingJsonLd
        listing={listing}
        lang="nl"
        citySlug={citySlug}
        listingSlug={listingSlug}
      />
      <PropertyListingPage
        lang="nl"
        listing={listing}
      />
    </>
  );
}
