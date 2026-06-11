import type { Metadata } from "next";
import { BackToDashboard, DataTable, TableLink } from "@/app/dashboard/dashboard-ui";
import { DashboardShell } from "@/app/dashboard/dashboard-ui";
import { cityGuidePath } from "@/app/lib/cityGuides";
import { cityName, requireAdmin, type DashboardCity } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";

type AdminCity = DashboardCity & {
  mapPlaceCount?: number;
  primaryHost?: {
    name?: string;
  } | null;
};

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
    primaryHost->{name}
  }
`;

export const metadata: Metadata = {
  title: "Admin Cities",
};

export default async function AdminCitiesPage() {
  await requireAdmin("/dashboard/admin/cities");
  const cities = await client.fetch<AdminCity[]>(adminCitiesQuery);

  return (
    <DashboardShell
      eyebrow="Admin"
      title="Cities"
      intro="A read-only city index for publication status, slugs, public links, and future city management pages."
    >
      <BackToDashboard />
      <DataTable
        headers={[
          "City",
          "Slug",
          "Country",
          "Status",
          "Map places",
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
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-3">
                  {slug ? (
                    <>
                      <TableLink href={`/dashboard/cities/${slug}`}>
                        City dashboard
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
