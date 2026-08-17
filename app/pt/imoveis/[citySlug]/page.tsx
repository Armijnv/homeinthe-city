import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  listingCitySlug,
  RealEstateCityPage,
  realEstateCityConfigFromListings,
} from "@/app/components/RealEstatePages";
import type { PropertyListing } from "@/app/components/PropertyListingPage";
import { siteUrl } from "@/app/lib/propertyListings";
import { client } from "@/sanity/lib/client";
import { propertyListingListQuery } from "@/sanity/lib/queries";

type PageProps = {
  params: Promise<{ citySlug: string }>;
};

async function getListings(citySlug: string) {
  const listings = await client.fetch<PropertyListing[]>(propertyListingListQuery);

  return listings.filter((listing) => listingCitySlug(listing) === citySlug);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { citySlug } = await params;
  const listings = await getListings(citySlug);
  if (!listings.length) notFound();
  const city = realEstateCityConfigFromListings("pt", citySlug, listings);

  return {
    title: `Imóveis em ${city.title}`,
    description: `Anúncios de venda e aluguel em ${city.title} pela Home in the City.`,
    alternates: {
      canonical: `${siteUrl}/pt/imoveis/${citySlug}`,
      languages: {
        en: `${siteUrl}/real-estate/${citySlug}`,
        pt: `${siteUrl}/pt/imoveis/${citySlug}`,
        nl: `${siteUrl}/nl/vastgoed/${citySlug}`,
      },
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { citySlug } = await params;
  const listings = await getListings(citySlug);

  if (!listings.length) notFound();

  return (
    <RealEstateCityPage
      lang="pt"
      city={realEstateCityConfigFromListings("pt", citySlug, listings)}
      listings={listings}
    />
  );
}
