import type { Metadata } from "next";
import Link from "next/link";
import { BackToDashboard, DataTable, TableLink } from "@/app/dashboard/dashboard-ui";
import { DashboardShell } from "@/app/dashboard/dashboard-ui";
import { requireAdmin } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";

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

type PropertyChange = {
  _id: string;
  changedAt?: string;
  propertyTitle?: string;
  actorName?: string;
  changedFields?: string[];
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

const recentPropertyChangesQuery = `
  *[_type == "propertyChangeLog"]|order(changedAt desc)[0...10]{
    _id,
    changedAt,
    "propertyTitle": coalesce(propertyTitle, property->title_en),
    actorName,
    changedFields
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
    client.fetch<PropertyChange[]>(recentPropertyChangesQuery),
  ]);

  return (
    <DashboardShell
      eyebrow="Admin"
      title="Properties"
      intro="Create and edit every listing, review publication status, and monitor recent real-estate agent changes."
    >
      <BackToDashboard />
      <Link
        href="/dashboard/properties/new"
        className="mb-5 inline-flex min-h-11 items-center rounded-lg bg-[#d6a85a] px-4 py-2.5 text-sm font-semibold text-[#1a1f2e]"
      >
        Add property
      </Link>
      <DataTable
        headers={["Title", "City", "Type", "Status", "Coordinates", "Links"]}
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
              <td className="px-5 py-4">{property.listingType || "Unknown"}</td>
              <td className="px-5 py-4">{property.status || "hidden"}</td>
              <td className="px-5 py-4">
                {hasCoordinates ? "Coordinates set" : "Missing coordinates"}
              </td>
              <td className="px-5 py-4">
                <TableLink href={`/dashboard/properties/${property._id}/edit`}>
                  Edit
                </TableLink>
                {citySlug && listingSlug ? (
                  <span className="ml-3">
                    <TableLink href={`/real-estate/${citySlug}/${listingSlug}`}>
                      Public listing
                    </TableLink>
                  </span>
                ) : null}
              </td>
            </tr>
          );
        })}
      </DataTable>

      <section className="mt-8">
        <h2 className="mb-3 text-xl font-medium text-white">Recent property changes</h2>
        {recentChanges.length ? (
          <div className="space-y-2">
            {recentChanges.map((change) => (
              <article key={change._id} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
                <p className="text-white">
                  {change.actorName || "Administrator"} changed {change.propertyTitle || "a property"}
                </p>
                <p className="mt-1 text-stone-400">
                  {change.changedAt
                    ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(change.changedAt))
                    : "Time unavailable"}
                  {change.changedFields?.length ? ` · ${change.changedFields.join(", ")}` : ""}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-stone-400">
            No dashboard property changes have been logged yet.
          </p>
        )}
      </section>
    </DashboardShell>
  );
}
