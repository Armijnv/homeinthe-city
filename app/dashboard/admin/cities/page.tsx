import type { Metadata } from "next";
import Link from "next/link";
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
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <BackToDashboard />
        <Link
          href="/dashboard/admin/cities/new"
          className="mb-8 inline-flex rounded-lg bg-[#d6a85a] px-5 py-3 text-sm font-medium text-[#1a1f2e] transition hover:bg-white"
        >
          Create city
        </Link>
      </div>

      <div className="grid gap-4 md:hidden">
        {cities.map((city) => {
          const slug = city.slug?.current;

          return (
            <article
              key={city._id}
              className="rounded-2xl border border-white/10 bg-white/10 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-medium text-white">{cityName(city)}</h2>
                  <p className="mt-1 text-sm text-stone-400">{slug || "No slug"}</p>
                </div>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-widest text-[#d6a85a]">
                  {city.guideStatus || "live"}
                </span>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-widest text-stone-500">Country</dt>
                  <dd className="mt-1 text-stone-200">{city.country || "Brazil"}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-stone-500">Primary host</dt>
                  <dd className={`mt-1 ${city.primaryHost?.name ? "text-stone-200" : "text-[#d6a85a]"}`}>
                    {city.primaryHost?.name || "Missing"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-stone-500">Map places</dt>
                  <dd className="mt-1 text-stone-200">{city.mapPlaceCount || 0}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-widest text-stone-500">Listings</dt>
                  <dd className="mt-1 text-stone-200">{city.propertyListingCount || 0}</dd>
                </div>
              </dl>
              {slug ? (
                <div className="mt-5 flex flex-wrap gap-4 border-t border-white/10 pt-4">
                  <TableLink href={`/dashboard/admin/cities/${slug}`}>
                    Admin detail
                  </TableLink>
                  <TableLink href={cityGuidePath("en", slug)}>Public</TableLink>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="hidden md:block">
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
      </div>
    </DashboardShell>
  );
}
