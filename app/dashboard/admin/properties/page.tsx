import type { Metadata } from "next";
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
  const properties = await client.fetch<AdminProperty[]>(adminPropertiesQuery);

  return (
    <DashboardShell
      eyebrow="Admin"
      title="Properties"
      intro="A read-only listing index for status, city assignment, listing type, coordinates, and public listing links."
    >
      <BackToDashboard />
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
                {citySlug && listingSlug ? (
                  <TableLink href={`/real-estate/${citySlug}/${listingSlug}`}>
                    Public listing
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
