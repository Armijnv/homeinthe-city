import type { Metadata } from "next";
import Link from "next/link";
import { DashboardBackLink, DataTable, TableLink } from "@/app/dashboard/dashboard-ui";
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

export default async function AdminPropertiesPage() {
  await requireAdmin("/dashboard/admin/properties");
  const [properties, recentChanges] = await Promise.all([
    client.fetch<AdminProperty[]>(adminPropertiesQuery),
    fetchAdminActivities({ kinds: ["property"], limit: 10 }),
  ]);
  const statistics = [
    ["Public", properties.filter((property) => property.status === "available").length],
    ["Rented / Unavailable", properties.filter((property) => ["reserved", "sold", "rented"].includes(property.status || "")).length],
    ["Draft / Hidden", properties.filter((property) => ["hidden", "archived"].includes(property.status || "")).length],
  ] as const;

  return (
    <DashboardShell
      eyebrow="Admin"
      title="Properties"
      intro="Create and edit every listing, review publication status, and monitor recent real-estate agent changes."
    >
      <DashboardBackLink href="/dashboard/admin" label="Admin workspace" />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {statistics.map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-light text-white">{value}</p><p className="mt-1 text-xs uppercase tracking-widest text-stone-400">{label}</p></div>)}
      </div>
      <Link
        href="/dashboard/properties/new"
        className="mb-5 inline-flex min-h-11 items-center rounded-lg bg-[#d6a85a] px-4 py-2.5 text-sm font-semibold text-[#1a1f2e]"
      >
        Add property
      </Link>
      <DataTable
        headers={["Title", "City", "Status", "Management"]}
      >
        {properties.map((property) => {
          const listingSlug = property.slug?.current;
          const citySlug =
            property.city?.slug?.current ||
            (property.cityName ? slugify(property.cityName) : "");
          const hasCoordinates =
            typeof property.mapCoordinates?.lat === "number" &&
            typeof property.mapCoordinates?.lng === "number";

          return (
            <tr key={property._id}>
              <td className="px-5 py-4 font-medium text-white">
                {propertyTitle(property)}
              </td>
              <td className="px-5 py-4">{propertyCityName(property)}</td>
              <td className="px-5 py-4">{property.status || "hidden"}</td>
              <td className="px-5 py-4">
                <div className="flex min-w-64 flex-wrap items-center gap-2">
                  <TableLink href={`/dashboard/properties/${property._id}/edit`}>Edit / transfer</TableLink>
                  {citySlug && listingSlug && !["hidden", "archived"].includes(property.status || "") ? (
                    <TableLink href={`/real-estate/${citySlug}/${listingSlug}`}>
                      View public
                    </TableLink>
                  ) : null}
                  {property.status !== "available" ? <form action={setAdminPropertyStatusAction}><input type="hidden" name="propertyId" value={property._id}/><input type="hidden" name="status" value="available"/><button className="min-h-11 rounded-lg border border-white/15 px-3 text-sm text-[#d6a85a]">Publish</button></form> : <form action={setAdminPropertyStatusAction}><input type="hidden" name="propertyId" value={property._id}/><input type="hidden" name="status" value="hidden"/><button className="min-h-11 rounded-lg border border-white/15 px-3 text-sm text-white">Unpublish</button></form>}
                  {property.status !== "archived" ? <form action={setAdminPropertyStatusAction}><input type="hidden" name="propertyId" value={property._id}/><input type="hidden" name="status" value="archived"/><button className="min-h-11 rounded-lg border border-white/15 px-3 text-sm text-white">Archive</button></form> : null}
                  <details className="w-full text-sm text-stone-400"><summary className="min-h-11 cursor-pointer py-3">Delete permanently</summary><form action={deleteAdminPropertyAction} className="flex flex-wrap gap-2 rounded-lg bg-black/20 p-3"><input type="hidden" name="propertyId" value={property._id}/><input name="confirmation" required pattern="DELETE" placeholder="Type DELETE" className="min-h-11 rounded-lg border border-white/15 bg-white/10 px-3 text-white placeholder:text-stone-400"/><button className="min-h-11 rounded-lg border border-red-300/30 px-3 text-red-200">Delete</button></form></details>
                  <span className="sr-only">{hasCoordinates ? "Coordinates set" : "Missing coordinates"}</span>
                </div>
              </td>
            </tr>
          );
        })}
      </DataTable>

      <section className="mt-8">
        <h2 className="mb-3 text-xl font-medium text-white">Recent property changes</h2>
        <ActivityFeed activities={recentChanges} empty="No property activity has been recorded yet." />
      </section>
    </DashboardShell>
  );
}
