import type { Metadata } from "next";
import { BackToDashboard, DataTable, TableLink } from "@/app/dashboard/dashboard-ui";
import { DashboardShell } from "@/app/dashboard/dashboard-ui";
import { cityGuidePath } from "@/app/lib/cityGuides";
import { cityName, requireAdmin, type DashboardCity } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";

type AdminCity = DashboardCity & {
  mapPlaceCount?: number;
  propertyListingCount?: number;
  primaryHost?: {
    name?: string;
    slug?: {
      current?: string;
    };
  } | null;
};

const publicListingStatuses = ["available", "reserved", "sold", "rented"];

const adminCitiesQuery = `
  *[_type == "city"]|order(name_en asc){
    _id,
    name_en,
    name_pt,
    name_nl,
    slug,
    guideStatus,
    country,
    "mapPlaceCount": count(mapPlaces),
    "propertyListingCount": count(*[
      _type == "propertyListing" &&
      status in $publicStatuses &&
      (
        city._ref == ^._id ||
        cityName in [^.name_en, ^.name_pt, ^.name_nl, ^.slug.current]
      )
    ]),
    primaryHost->{
      name,
      slug
    }
  }
`;

export const metadata: Metadata = {
  title: "Admin Cities",
};

export default async function AdminCitiesPage() {
  await requireAdmin("/dashboard/admin/cities");
  const cities = await client.fetch<AdminCity[]>(adminCitiesQuery, {
    publicStatuses: publicListingStatuses,
  });

  return (
    <DashboardShell
      eyebrow="Admin"
      title="Cities"
      intro="A city management overview for publication status, primary host assignment, map places, property listings, and city workspace links."
    >
      <BackToDashboard />
      <DataTable
        headers={[
          "City",
          "Slug",
          "Country",
          "Status",
          "Map places",
          "Listings",
          "Primary host",
          "Links",
        ]}
      >
        {cities.map((city) => {
          const slug = city.slug?.current;

          return (
            <tr key={city._id}>
              <td className="px-5 py-4">
                <div className="font-medium text-white">{cityName(city)}</div>
                {city.primaryHost?.name ? (
                  <div className="mt-1 text-xs text-stone-400">
                    Host: {city.primaryHost.name}
                  </div>
                ) : null}
              </td>
              <td className="px-5 py-4">{slug || "No slug"}</td>
              <td className="px-5 py-4">{city.country || "Brazil"}</td>
              <td className="px-5 py-4">{city.guideStatus || "live"}</td>
              <td className="px-5 py-4">{city.mapPlaceCount || 0}</td>
              <td className="px-5 py-4">{city.propertyListingCount || 0}</td>
              <td className="px-5 py-4">
                {city.primaryHost?.name ? (
                  <span className="text-stone-200">{city.primaryHost.name}</span>
                ) : (
                  <span className="text-[#d6a85a]">Missing</span>
                )}
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-3">
                  {slug ? (
                    <>
                      <TableLink href={`/dashboard/admin/cities/${slug}`}>
                        Admin detail
                      </TableLink>
                      <TableLink href={cityGuidePath("en", slug)}>Public</TableLink>
                    </>
                  ) : null}
                </div>
              </td>
            </tr>
          );
        })}
      </DataTable>
    </DashboardShell>
  );
}
