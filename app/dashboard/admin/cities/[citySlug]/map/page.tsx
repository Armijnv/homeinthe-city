import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MapPlaceForm from "@/app/dashboard/MapPlaceForm";
import { BackToDashboard, DataTable, TableLink } from "@/app/dashboard/dashboard-ui";
import { addMapPlaceAction } from "@/app/dashboard/map-place-actions";
import { DashboardShell } from "@/app/dashboard/dashboard-ui";
import { cityGuidePath } from "@/app/lib/cityGuides";
import { cityName, requireAdmin, type DashboardCity } from "@/app/lib/dashboard";
import { mapCategoryForPlace, type MapCategoryPlace } from "@/app/lib/mapCategories";
import { client } from "@/sanity/lib/client";

type PageProps = {
  params: Promise<{
    citySlug: string;
  }>;
};

type AdminMapPlace = MapCategoryPlace & {
  _key?: string;
  name?: string;
  neighborhood?: string;
  latitude?: number | null;
  longitude?: number | null;
};

type AdminMapProperty = {
  _id: string;
  title_en?: string;
  title_pt?: string;
  title_nl?: string;
  slug?: {
    current?: string;
  };
  listingType?: string;
  status?: string;
  cityName?: string;
  city?: {
    slug?: {
      current?: string;
    };
  } | null;
  mapCoordinates?: {
    lat?: number | null;
    lng?: number | null;
  };
};

type AdminCityMap = DashboardCity & {
  mapPlaces?: AdminMapPlace[];
  propertyListings?: AdminMapProperty[];
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
      longitude
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
      slug,
      listingType,
      status,
      cityName,
      city->{slug},
      mapCoordinates
    }
  }
`;

export const metadata: Metadata = {
  title: "Admin City Map",
};

function hasCoordinatePair(latitude?: number | null, longitude?: number | null) {
  return (
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude)
  );
}

function coordinateWarning(latitude?: number | null, longitude?: number | null) {
  if (!hasCoordinatePair(latitude, longitude)) return "Missing coordinates";
  if (latitude === 0 && longitude === 0) return "Suspicious 0,0 coordinates";
  return "";
}

function propertyTitle(property: AdminMapProperty) {
  return property.title_en || property.title_pt || property.title_nl || "Untitled listing";
}

function listingHref(property: AdminMapProperty, fallbackCitySlug: string) {
  const listingSlug = property.slug?.current;
  const citySlug = property.city?.slug?.current || fallbackCitySlug;

  return listingSlug ? `/real-estate/${citySlug}/${listingSlug}` : "";
}

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

  const places = city.mapPlaces || [];
  const properties = city.propertyListings || [];

  return (
    <DashboardShell
      eyebrow="Admin city map"
      title={`${cityName(city)} map`}
      intro="A read-only map management foundation for city places, categories, property listing coordinates, and obvious coordinate cleanup work."
    >
      <div className="mb-8 flex flex-wrap gap-3">
        <BackToDashboard />
        <TableLink href={`/dashboard/admin/cities/${citySlug}`}>
          Back to city detail
        </TableLink>
        <TableLink href={cityGuidePath("en", citySlug)}>Public city page</TableLink>
        <TableLink href="/studio/structure/city">Studio fallback</TableLink>
      </div>

      <section className="mb-10">
        <h2 className="mb-5 text-2xl font-light text-white">Quick Add Map Place</h2>
        <MapPlaceForm action={addMapPlaceAction.bind(null, citySlug)} />
      </section>

      <section className="mb-10">
        <h2 className="mb-5 text-2xl font-light text-white">Map places</h2>
        <DataTable
          headers={[
            "Name",
            "Category",
            "Neighborhood",
            "Latitude",
            "Longitude",
            "Status",
          ]}
        >
          {places.map((place, index) => {
            const category = mapCategoryForPlace(place, "en");
            const warning = coordinateWarning(place.latitude, place.longitude);

            return (
              <tr key={place._key || `${place.name}-${index}`}>
                <td className="px-5 py-4 font-medium text-white">
                  {place.name || "Untitled place"}
                </td>
                <td className="px-5 py-4">
                  <div>{category.label}</div>
                  <div className="mt-1 text-xs text-stone-400">
                    {place.categoryPreset && place.categoryPreset !== "custom"
                      ? `Preset: ${place.categoryPreset}`
                      : `Key: ${place.category || "No key"}`}
                  </div>
                </td>
                <td className="px-5 py-4">{place.neighborhood || "No area"}</td>
                <td className="px-5 py-4">
                  {typeof place.latitude === "number" ? place.latitude : "Blank"}
                </td>
                <td className="px-5 py-4">
                  {typeof place.longitude === "number" ? place.longitude : "Blank"}
                </td>
                <td className="px-5 py-4">
                  {warning ? (
                    <span className="text-[#d6a85a]">{warning}</span>
                  ) : (
                    "Ready"
                  )}
                </td>
              </tr>
            );
          })}
        </DataTable>
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-light text-white">Property listings</h2>
        <DataTable
          headers={["Title", "Type", "Status", "Coordinates", "Warning", "Links"]}
        >
          {properties.map((property) => {
            const href = listingHref(property, citySlug);
            const warning = coordinateWarning(
              property.mapCoordinates?.lat,
              property.mapCoordinates?.lng,
            );

            return (
              <tr key={property._id}>
                <td className="px-5 py-4 font-medium text-white">
                  {propertyTitle(property)}
                </td>
                <td className="px-5 py-4">{property.listingType || "Unknown"}</td>
                <td className="px-5 py-4">{property.status || "hidden"}</td>
                <td className="px-5 py-4">
                  {hasCoordinatePair(
                    property.mapCoordinates?.lat,
                    property.mapCoordinates?.lng,
                  )
                    ? `${property.mapCoordinates?.lat}, ${property.mapCoordinates?.lng}`
                    : "Missing"}
                </td>
                <td className="px-5 py-4">
                  {warning ? (
                    <span className="text-[#d6a85a]">{warning}</span>
                  ) : (
                    "Ready"
                  )}
                </td>
                <td className="px-5 py-4">
                  {href ? <TableLink href={href}>Public listing</TableLink> : null}
                </td>
              </tr>
            );
          })}
        </DataTable>
      </section>
    </DashboardShell>
  );
}
