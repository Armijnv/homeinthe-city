import type { Metadata } from "next";
import MapPlaceManagement, {
  type MapPlaceProperty,
} from "@/app/dashboard/MapPlaceManagement";
import type { EditableMapPlace } from "@/app/dashboard/MapPlaceForm";
import { BackToDashboard, TableLink } from "@/app/dashboard/dashboard-ui";
import {
  addMapPlaceAction,
  deleteMapPlaceAction,
  updateMapPlaceAction,
} from "@/app/dashboard/map-place-actions";
import { DashboardShell } from "@/app/dashboard/dashboard-ui";
import { cityName, requireCityHost } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";

type PageProps = {
  params: Promise<{
    citySlug: string;
  }>;
};

type CityMapManagementData = {
  mapPlaces?: EditableMapPlace[];
  propertyListings?: MapPlaceProperty[];
};

const publicListingStatuses = ["available", "reserved", "sold", "rented"];

const cityMapManagementQuery = `
  *[_type == "city" && slug.current == $citySlug][0]{
    mapPlaces[]{
      _key,
      name,
      name_en,
      name_pt,
      name_nl,
      categoryPreset,
      category,
      categoryLabel_en,
      categoryLabel_pt,
      categoryLabel_nl,
      neighborhood,
      latitude,
      longitude,
      detail_en,
      detail_pt,
      detail_nl,
      description_en,
      description_pt,
      description_nl,
      website,
      image{
        alt,
        asset->{url}
      }
    },
    "propertyListings": *[
      _type == "propertyListing" &&
      status in $publicStatuses &&
      (
        city._ref == ^._id ||
        cityName in [^.name_en, ^.name_pt, ^.name_nl, ^.slug.current]
      )
    ] | order(_createdAt desc){
      _id,
      title_en,
      title_pt,
      title_nl,
      listingType,
      status,
      mapCoordinates
    }
  }
`;

export const metadata: Metadata = {
  title: "City Map Dashboard",
};

export default async function CityMapDashboardPage({ params }: PageProps) {
  const { citySlug } = await params;
  const { city } = await requireCityHost(citySlug);
  const mapData = await client.fetch<CityMapManagementData | null>(cityMapManagementQuery, {
    citySlug,
    publicStatuses: publicListingStatuses,
  });

  return (
    <DashboardShell
      eyebrow="City host"
      title={`${cityName(city)} map`}
      intro="Manage map places for this city without opening Sanity Studio."
    >
      <div className="mb-8 flex flex-wrap gap-3">
        <BackToDashboard />
        <TableLink href={`/dashboard/cities/${citySlug}`}>Back to city tools</TableLink>
      </div>

      <MapPlaceManagement
        places={mapData?.mapPlaces || []}
        properties={mapData?.propertyListings || []}
        addAction={addMapPlaceAction.bind(null, citySlug)}
        updateAction={updateMapPlaceAction.bind(null, citySlug)}
        deleteAction={deleteMapPlaceAction.bind(null, citySlug)}
      />
    </DashboardShell>
  );
}
