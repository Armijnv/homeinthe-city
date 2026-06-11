import type { Metadata } from "next";
import { BackToDashboard, DataTable, TableLink } from "@/app/dashboard/dashboard-ui";
import { DashboardShell } from "@/app/dashboard/dashboard-ui";
import { cityName, requireCityHost } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";

type PageProps = {
  params: Promise<{
    citySlug: string;
  }>;
};

type CityMapHealth = {
  mapPlaceTotal?: number;
  mapPlaceWithCoordinates?: number;
  propertyWithCoordinates?: number;
  propertyMissingCoordinates?: number;
};

const publicListingStatuses = ["available", "reserved"];

const cityMapHealthQuery = `
  *[_type == "city" && slug.current == $citySlug][0]{
    "mapPlaceTotal": count(mapPlaces),
    "mapPlaceWithCoordinates": count(mapPlaces[defined(latitude) && defined(longitude)]),
    "propertyWithCoordinates": count(*[
      _type == "propertyListing" &&
      status in $publicStatuses &&
      (
        city._ref == ^._id ||
        cityName in [^.name_en, ^.name_pt, ^.name_nl, ^.slug.current]
      ) &&
      defined(mapCoordinates.lat) &&
      defined(mapCoordinates.lng)
    ]),
    "propertyMissingCoordinates": count(*[
      _type == "propertyListing" &&
      status in $publicStatuses &&
      (
        city._ref == ^._id ||
        cityName in [^.name_en, ^.name_pt, ^.name_nl, ^.slug.current]
      ) &&
      (!defined(mapCoordinates.lat) || !defined(mapCoordinates.lng))
    ])
  }
`;

export const metadata: Metadata = {
  title: "City Map Dashboard",
};

export default async function CityMapDashboardPage({ params }: PageProps) {
  const { citySlug } = await params;
  const { city } = await requireCityHost(citySlug);
  const health = await client.fetch<CityMapHealth | null>(cityMapHealthQuery, {
    citySlug,
    publicStatuses: publicListingStatuses,
  });
  const totalListings =
    (health?.propertyWithCoordinates || 0) +
    (health?.propertyMissingCoordinates || 0);

  return (
    <DashboardShell
      eyebrow="City host"
      title={`${cityName(city)} map`}
      intro="A read-only foundation for future map place management, property coordinate cleanup, and city map quality checks."
    >
      <BackToDashboard />
      <DataTable headers={["Area", "Current state", "Future tool"]}>
        <tr>
          <td className="px-5 py-4 font-medium text-white">Map places</td>
          <td className="px-5 py-4">
            {health?.mapPlaceWithCoordinates || 0} of {health?.mapPlaceTotal || 0}{" "}
            have coordinates.
          </td>
          <td className="px-5 py-4">Add, edit, categorize, and geocode places.</td>
        </tr>
        <tr>
          <td className="px-5 py-4 font-medium text-white">Property listings</td>
          <td className="px-5 py-4">
            {health?.propertyWithCoordinates || 0} with coordinates,{" "}
            {health?.propertyMissingCoordinates || 0} missing coordinates.
          </td>
          <td className="px-5 py-4">Fix coordinates and listing city assignment.</td>
        </tr>
        <tr>
          <td className="px-5 py-4 font-medium text-white">Warnings</td>
          <td className="px-5 py-4">
            {totalListings > 0 && (health?.propertyWithCoordinates || 0) === 0
              ? "Listings exist, but none have usable coordinates."
              : "No obvious coordinate warning."}
          </td>
          <td className="px-5 py-4">
            <TableLink href={`/dashboard/cities/${citySlug}`}>
              Back to city tools
            </TableLink>
          </td>
        </tr>
      </DataTable>
    </DashboardShell>
  );
}
