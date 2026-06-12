import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { cityGuidePath } from "@/app/lib/cityGuides";
import { cityName, requireAdmin, type DashboardCity } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";

type PageProps = {
  params: Promise<{
    citySlug: string;
  }>;
};

type AdminCityMap = DashboardCity & {
  mapPlaces?: EditableMapPlace[];
  propertyListings?: MapPlaceProperty[];
};

const publicListingStatuses = ["available", "reserved", "sold", "rented"];

const adminCityMapQuery = `
  *[_type == "city" && slug.current == $citySlug][0]{
    _id,
    name_en,
    name_pt,
    name_nl,
    slug,
    guideStatus,
    mapPlaces[]{
      _key,
      name,
      categoryPreset,
      category,
      categoryLabel_en,
      categoryLabel_pt,
      categoryLabel_nl,
      neighborhood,
      latitude,
      longitude,
      detail_en,
      description_en,
      website
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
  title: "Admin City Map",
};

export default async function AdminCityMapPage({ params }: PageProps) {
  const { citySlug } = await params;
  await requireAdmin(`/dashboard/admin/cities/${citySlug}/map`);
  const city = await client.fetch<AdminCityMap | null>(adminCityMapQuery, {
    citySlug,
    publicStatuses: publicListingStatuses,
  });

  if (!city) {
    notFound();
  }

  return (
    <DashboardShell
      eyebrow="Admin city map"
      title={`${cityName(city)} map`}
      intro="Manage city map places directly from the dashboard and review property listing coordinate status."
    >
      <div className="mb-8 flex flex-wrap gap-3">
        <BackToDashboard />
        <TableLink href={`/dashboard/admin/cities/${citySlug}`}>
          Back to city detail
        </TableLink>
        <TableLink href={cityGuidePath("en", citySlug)}>Public city page</TableLink>
        <TableLink href="/studio/structure/city">Studio fallback</TableLink>
      </div>

      <MapPlaceManagement
        places={city.mapPlaces || []}
        properties={city.propertyListings || []}
        addAction={addMapPlaceAction.bind(null, citySlug)}
        updateAction={updateMapPlaceAction.bind(null, citySlug)}
        deleteAction={deleteMapPlaceAction.bind(null, citySlug)}
      />
    </DashboardShell>
  );
}
