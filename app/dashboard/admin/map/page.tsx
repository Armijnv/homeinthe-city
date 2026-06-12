import type { Metadata } from "next";
import { BackToDashboard, DataTable, TableLink } from "@/app/dashboard/dashboard-ui";
import { DashboardShell } from "@/app/dashboard/dashboard-ui";
import { cityName, requireAdmin, type DashboardCity } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";

type MapHealthCity = DashboardCity & {
  mapPlaceCount?: number;
  propertyWithCoordinates?: number;
  propertyMissingCoordinates?: number;
};

const publicListingStatuses = ["available", "reserved"];

const adminMapHealthQuery = `
  *[_type == "city"]|order(name_en asc){
    _id,
    name_en,
    name_pt,
    name_nl,
    slug,
    guideStatus,
    "mapPlaceCount": count(mapPlaces[defined(latitude) && defined(longitude)]),
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
  title: "Admin Map Health",
};

export default async function AdminMapHealthPage() {
  await requireAdmin("/dashboard/admin/map");
  const cities = await client.fetch<MapHealthCity[]>(adminMapHealthQuery, {
    publicStatuses: publicListingStatuses,
  });

  return (
    <DashboardShell
      eyebrow="Admin"
      title="Map health"
      intro="A first read-only view into city map readiness, property coordinates, and obvious places where listing data needs cleanup."
    >
      <BackToDashboard />
      <DataTable
        headers={[
          "City",
          "Map places",
          "Listings with coordinates",
          "Listings missing coordinates",
          "Warning",
          "Links",
        ]}
      >
        {cities.map((city) => {
          const slug = city.slug?.current;
          const withCoordinates = city.propertyWithCoordinates || 0;
          const missingCoordinates = city.propertyMissingCoordinates || 0;
          const hasListings = withCoordinates + missingCoordinates > 0;
          const warning =
            hasListings && withCoordinates === 0
              ? "Listings exist, no usable coordinates"
              : missingCoordinates > 0
                ? "Some listings need coordinates"
                : "";

          return (
            <tr key={city._id}>
              <td className="px-5 py-4 font-medium text-white">{cityName(city)}</td>
              <td className="px-5 py-4">{city.mapPlaceCount || 0}</td>
              <td className="px-5 py-4">{withCoordinates}</td>
              <td className="px-5 py-4">{missingCoordinates}</td>
              <td className="px-5 py-4">
                {warning ? (
                  <span className="text-[#d6a85a]">{warning}</span>
                ) : (
                  "No obvious issue"
                )}
              </td>
              <td className="px-5 py-4">
                {slug ? (
                  <TableLink href={`/dashboard/admin/cities/${slug}/map`}>
                    City map tools
                  </TableLink>
                ) : null}
              </td>
            </tr>
          );
        })}
      </DataTable>
    </DashboardShell>
  );
}
