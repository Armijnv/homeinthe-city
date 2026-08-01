import type { Metadata } from "next";
import Link from "next/link";
import { DashboardBackLink, Pill, TableLink } from "@/app/dashboard/dashboard-ui";
import { DashboardShell } from "@/app/dashboard/dashboard-ui";
import { requireAdmin } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";
import { ActivityFeed } from "@/app/dashboard/admin/activity/ActivityFeed";
import { fetchAdminActivities } from "@/app/lib/adminActivity";
import { deleteAdminPropertyAction, setAdminPropertyStatusAction } from "@/app/dashboard/properties/actions";

type AdminProperty = {
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
    name_en?: string;
    name_pt?: string;
    name_nl?: string;
    slug?: {
      current?: string;
    };
  } | null;
  mapCoordinates?: {
    lat?: number;
    lng?: number;
  };
};

const adminPropertiesQuery = `
  *[_type == "propertyListing"]|order(_createdAt desc){
    _id,
    title_en,
    title_pt,
    title_nl,
    slug,
    listingType,
    status,
    cityName,
    city->{
      name_en,
      name_pt,
      name_nl,
      slug
    },
    mapCoordinates
  }
`;

function propertyTitle(property: AdminProperty) {
  return property.title_en || property.title_pt || property.title_nl || "Untitled listing";
}

function propertyCityName(property: AdminProperty) {
  return (
    property.city?.name_en ||
    property.city?.name_pt ||
    property.city?.name_nl ||
    property.cityName ||
    "No city"
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const metadata: Metadata = {
  title: "Admin Properties",
};

type PageProps = { searchParams: Promise<{ attention?: string; status?: string }> };

export default async function AdminPropertiesPage({ searchParams }: PageProps) {
  await requireAdmin("/dashboard/admin/properties");
  const [{ attention, status }, properties, recentChanges] = await Promise.all([
    searchParams,
    client.fetch<AdminProperty[]>(adminPropertiesQuery),
    fetchAdminActivities({ kinds: ["property"], limit: 10 }),
  ]);
  const statistics = [
    ["Public", properties.filter((property) => property.status === "available").length],
    ["Rented / Unavailable", properties.filter((property) => ["reserved", "sold", "rented"].includes(property.status || "")).length],
    ["Draft / Hidden", properties.filter((property) => ["hidden", "archived"].includes(property.status || "")).length],
  ] as const;
  const filteredProperties = attention === "drafts"
    ? properties.filter((property) => property.status === "hidden")
    : status === "public"
      ? properties.filter((property) => property.status === "available")
      : status === "unavailable"
        ? properties.filter((property) => ["reserved", "sold", "rented"].includes(property.status || ""))
        : status === "hidden"
          ? properties.filter((property) => ["hidden", "archived"].includes(property.status || ""))
        : properties;
  const filterTitle = attention === "drafts" ? "Draft properties requiring review" : status === "public" ? "Public properties" : status === "unavailable" ? "Rented or unavailable properties" : status === "hidden" ? "Draft or hidden properties" : null;

  return (
    <DashboardShell
      eyebrow="Admin"
      title="Properties"
      intro="Create and edit every listing, review publication status, and monitor recent real-estate agent changes."
    >
      <DashboardBackLink href="/dashboard/admin" label="Admin workspace" />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {statistics.map(([label, value]) => <Link key={label} href={label === "Public" ? "/dashboard/admin/properties?status=public" : label === "Rented / Unavailable" ? "/dashboard/admin/properties?status=unavailable" : "/dashboard/admin/properties?status=hidden"} className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-[#d6a85a]/60"><p className="text-2xl font-light text-white">{value}</p><p className="mt-1 text-xs uppercase tracking-widest text-stone-400">{label}</p></Link>)}
      </div>
      <Link
        href="/dashboard/properties/new"
        className="mb-5 inline-flex min-h-11 items-center rounded-lg bg-[#d6a85a] px-4 py-2.5 text-sm font-semibold text-[#1a1f2e]"
      >
        Add property
      </Link>
      {filterTitle ? <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-medium text-white">{filterTitle}</h2><Link href="/dashboard/admin/properties" className="text-sm text-[#d6a85a]">Show all properties</Link></div> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredProperties.map((property) => {
          const listingSlug = property.slug?.current;
          const citySlug =
            property.city?.slug?.current ||
            (property.cityName ? slugify(property.cityName) : "");
          const hasCoordinates =
            typeof property.mapCoordinates?.lat === "number" &&
            typeof property.mapCoordinates?.lng === "number";

          return (
            <article key={property._id} className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3"><div><h2 className="font-medium text-white">{propertyTitle(property)}</h2><p className="mt-1 text-sm text-stone-400">{propertyCityName(property)} · {property.listingType || "Property"}</p></div><Pill>{property.status || "hidden"}</Pill></div>
              <p className="mt-3 text-sm text-stone-400">{hasCoordinates ? "Coordinates set" : "Coordinates missing"}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
                  <TableLink href={`/dashboard/properties/${property._id}/edit`}>Edit / transfer</TableLink>
                  {citySlug && listingSlug && !["hidden", "archived"].includes(property.status || "") ? (
                    <TableLink href={`/real-estate/${citySlug}/${listingSlug}`}>
                      View public
                    </TableLink>
                  ) : null}
                  {property.status !== "available" ? <form action={setAdminPropertyStatusAction}><input type="hidden" name="propertyId" value={property._id}/><input type="hidden" name="status" value="available"/><button className="min-h-11 rounded-lg border border-white/15 px-3 text-sm text-[#d6a85a]">Publish</button></form> : <form action={setAdminPropertyStatusAction}><input type="hidden" name="propertyId" value={property._id}/><input type="hidden" name="status" value="hidden"/><button className="min-h-11 rounded-lg border border-white/15 px-3 text-sm text-white">Unpublish</button></form>}
                  {property.status !== "archived" ? <form action={setAdminPropertyStatusAction}><input type="hidden" name="propertyId" value={property._id}/><input type="hidden" name="status" value="archived"/><button className="min-h-11 rounded-lg border border-white/15 px-3 text-sm text-white">Archive</button></form> : null}
                  <details className="w-full text-sm text-stone-400"><summary className="min-h-11 cursor-pointer py-3">Delete permanently</summary><form action={deleteAdminPropertyAction} className="grid gap-2 rounded-lg bg-black/20 p-3 sm:grid-cols-[1fr_auto]"><input type="hidden" name="propertyId" value={property._id}/><input name="confirmation" required pattern="DELETE" placeholder="Type DELETE" className="min-h-11 min-w-0 rounded-lg border border-white/15 bg-white/10 px-3 text-white placeholder:text-stone-400"/><button className="min-h-11 rounded-lg border border-red-300/30 px-3 text-red-200">Delete</button></form></details>
                </div>
            </article>
          );
        })}
      </div>
      {!filteredProperties.length ? <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-stone-300">No properties match this filter.</p> : null}

      <section className="mt-8">
        <h2 className="mb-3 text-xl font-medium text-white">Recent property changes</h2>
        <ActivityFeed activities={recentChanges} empty="No property activity has been recorded yet." />
      </section>
    </DashboardShell>
  );
}
