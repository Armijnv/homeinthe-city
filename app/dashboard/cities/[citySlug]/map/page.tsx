import type { Metadata } from "next";
import MapPlaceManagement, {
  type MapPlaceProperty,
} from "@/app/dashboard/MapPlaceManagement";
import type { EditableMapPlace } from "@/app/dashboard/MapPlaceForm";
import { DashboardBackLink } from "@/app/dashboard/dashboard-ui";
import {
  addMapPlaceWithState,
  deleteMapPlaceAction,
  updateMapPlaceWithState,
} from "@/app/dashboard/map-place-actions";
import { DashboardShell } from "@/app/dashboard/dashboard-ui";
import { cityName, requireCityHost } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";

type PageProps = {
  params: Promise<{
    citySlug: string;
  }>;
  searchParams?: Promise<{
    mapPlaceSaved?: string;
    mapPlaceImage?: string;
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

function savedMessage(status?: string) {
  if (status === "added") return "Map place saved. It now appears in the dashboard and public city map.";
  if (status === "updated") return "Map place updated.";
  if (status === "deleted") return "Map place deleted.";
  return "";
}

function imageWarningMessage(status?: string) {
  if (status === "skipped") {
    return "The place was saved, but the photo could not be uploaded. Please edit the place and try the photo again.";
  }

  return "";
}

export default async function CityMapDashboardPage({ params, searchParams }: PageProps) {
  const { citySlug } = await params;
  const resolvedSearchParams = await searchParams;
  const savedStatus = resolvedSearchParams?.mapPlaceSaved;
  const imageStatus = resolvedSearchParams?.mapPlaceImage;
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
        <DashboardBackLink
          href={`/dashboard/cities/${citySlug}`}
          label="City workspace"
        />
      </div>

      <MapPlaceManagement
        places={mapData?.mapPlaces || []}
        properties={mapData?.propertyListings || []}
        addAction={addMapPlaceWithState.bind(null, citySlug)}
        updateAction={updateMapPlaceWithState.bind(null, citySlug)}
        deleteAction={deleteMapPlaceAction.bind(null, citySlug)}
        returnPath={`/dashboard/cities/${citySlug}/map`}
        successMessage={savedMessage(savedStatus)}
        warningMessage={imageWarningMessage(imageStatus)}
      />
    </DashboardShell>
  );
}
