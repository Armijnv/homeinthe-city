import "server-only";

import { notFound } from "next/navigation";
import { getDashboardContext } from "@/app/lib/dashboard";
import {
  canCreatePropertyListing,
  canEditPropertyListing,
} from "@/app/lib/propertyListingPolicy";
import { client } from "@/sanity/lib/client";

export type DashboardPropertyListing = {
  _id: string;
  _rev: string;
  _createdAt?: string;
  _updatedAt?: string;
  title_en?: string;
  title_pt?: string;
  title_nl?: string;
  slug?: { current?: string };
  listingType?: string;
  status?: string;
  city?: {
    _ref?: string;
    _id?: string;
    name_en?: string;
    name_pt?: string;
    name_nl?: string;
    slug?: { current?: string };
  };
  neighborhood?: string;
  addressVisibility?: string;
  address?: string;
  price?: number;
  currency?: string;
  monthlyCondoFee?: number;
  propertyTax?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  areaM2?: number;
  floor?: number;
  furnished?: boolean;
  minimumStay?: string;
  maximumGuests?: number;
  utilitiesIncluded?: boolean;
  internetIncluded?: boolean;
  cleaningIncluded?: boolean;
  availableFrom?: string;
  petsAllowed?: boolean;
  financingPossible?: boolean;
  occupancyStatus?: string;
  yearBuilt?: number;
  shortDescription_en?: string;
  shortDescription_pt?: string;
  shortDescription_nl?: string;
  longDescription_en?: string;
  longDescription_pt?: string;
  longDescription_nl?: string;
  features_en?: string[];
  features_pt?: string[];
  features_nl?: string[];
  buildingAmenities?: string[];
  apartmentAmenities?: string[];
  parkingAmenities?: string[];
  lifestyleAmenities?: string[];
  neighborhoodDescription_en?: string;
  neighborhoodDescription_pt?: string;
  neighborhoodDescription_nl?: string;
  nearbyHighlights_en?: string[];
  nearbyHighlights_pt?: string[];
  nearbyHighlights_nl?: string[];
  mainImage?: {
    _type?: "image";
    alt?: string;
    asset?: { _type?: "reference"; _ref?: string; url?: string };
    crop?: Record<string, number>;
    hotspot?: Record<string, number>;
  };
  gallery?: Array<{
    _type?: "image";
    _key?: string;
    alt?: string;
    asset?: { _type?: "reference"; _ref?: string; url?: string };
    crop?: Record<string, number>;
    hotspot?: Record<string, number>;
  }>;
  mapCoordinates?: { _type?: "geopoint"; lat?: number; lng?: number };
  videoUrl?: string;
  linkedRealtor?: {
    _ref?: string;
    _id?: string;
    name?: string;
  };
  contact?: { _type?: "object"; whatsapp?: string; email?: string };
  seoTitle_en?: string;
  seoTitle_pt?: string;
  seoTitle_nl?: string;
  seoDescription_en?: string;
  seoDescription_pt?: string;
  seoDescription_nl?: string;
};

export const propertyForDashboardQuery = `
  *[_type == "propertyListing" && _id == $propertyId][0]{
    ...,
    "city": city->{_id, name_en, name_pt, name_nl, slug},
    "cityRef": city._ref,
    "linkedRealtor": linkedRealtor->{_id, name},
    "linkedRealtorRef": linkedRealtor._ref,
    mainImage{_type, alt, asset, crop, hotspot},
    gallery[]{_type, _key, alt, asset, crop, hotspot}
  }
`;

type PropertyQueryResult = Omit<DashboardPropertyListing, "city" | "linkedRealtor"> & {
  city?: DashboardPropertyListing["city"];
  cityRef?: string;
  linkedRealtor?: DashboardPropertyListing["linkedRealtor"];
  linkedRealtorRef?: string;
};

export async function requirePropertyCreator(returnTo = "/dashboard/properties/new") {
  const context = await getDashboardContext(returnTo);
  if (!canCreatePropertyListing(context.provider, context.isAdmin)) notFound();
  return context;
}

export async function requirePropertyEditor(propertyId: string) {
  const context = await getDashboardContext(
    `/dashboard/properties/${encodeURIComponent(propertyId)}/edit`,
  );
  const result = await client.fetch<PropertyQueryResult | null>(propertyForDashboardQuery, {
    propertyId,
  });
  if (!result) notFound();

  const property: DashboardPropertyListing = {
    ...result,
    city: result.city
      ? { ...result.city, _ref: result.cityRef }
      : result.cityRef
        ? { _ref: result.cityRef }
        : undefined,
    linkedRealtor: result.linkedRealtor
      ? { ...result.linkedRealtor, _ref: result.linkedRealtorRef }
      : result.linkedRealtorRef
        ? { _ref: result.linkedRealtorRef }
        : undefined,
  };

  if (
    !canEditPropertyListing({
      provider: context.provider,
      isAdmin: context.isAdmin,
      listing: property,
    })
  ) {
    notFound();
  }

  return { context, property };
}
