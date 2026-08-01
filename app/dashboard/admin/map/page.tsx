import type { Metadata } from "next";
import { DashboardBackLink, TableLink } from "@/app/dashboard/dashboard-ui";
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
      <DashboardBackLink href="/dashboard/admin" label="Admin workspace" />
      <div className="grid gap-4 lg:grid-cols-2">
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
            <article key={city._id} className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <h2 className="font-medium text-white">{cityName(city)}</h2>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div><dt className="text-xs uppercase tracking-widest text-stone-500">Map places</dt><dd className="mt-1 text-stone-200">{city.mapPlaceCount || 0}</dd></div>
                <div><dt className="text-xs uppercase tracking-widest text-stone-500">With coordinates</dt><dd className="mt-1 text-stone-200">{withCoordinates}</dd></div>
                <div><dt className="text-xs uppercase tracking-widest text-stone-500">Missing coordinates</dt><dd className="mt-1 text-stone-200">{missingCoordinates}</dd></div>
              </dl>
              <p className={`mt-4 text-sm ${warning ? "text-[#d6a85a]" : "text-stone-300"}`}>{warning || "No obvious issue"}</p>
              {slug ? <div className="mt-4 border-t border-white/10 pt-4"><TableLink href={`/dashboard/admin/cities/${slug}/map`}>City map tools</TableLink></div> : null}
            </article>
          );
        })}
      </div>
    </DashboardShell>
  );
}
