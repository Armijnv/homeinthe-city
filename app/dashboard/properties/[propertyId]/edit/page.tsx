import type { Metadata } from "next";
import { BackToDashboard, DashboardShell } from "@/app/dashboard/dashboard-ui";
import { requirePropertyEditor } from "@/app/lib/propertyDashboard";
import { client } from "@/sanity/lib/client";
import { updatePropertyListing } from "../../actions";
import { PropertyListingForm } from "../../PropertyListingForm";

type PageProps = {
  params: Promise<{ propertyId: string }>;
  searchParams: Promise<{ error?: string; saved?: string; created?: string; unchanged?: string }>;
};
type Option = { _id: string; name: string };

const citiesQuery = `*[_type == "city"]|order(name_en asc){_id,"name":coalesce(name_en,name_pt,name_nl)}`;
const realtorsQuery = `*[_type == "provider" && (primaryRole == "realtor" || "realtor" in roles)]|order(name asc){_id,"name":name}`;

export const metadata: Metadata = { title: "Edit property" };

export default async function EditPropertyPage({ params, searchParams }: PageProps) {
  const [{ propertyId }, query] = await Promise.all([params, searchParams]);
  const { context, property } = await requirePropertyEditor(propertyId);
  const [cities, realtors] = await Promise.all([
    client.fetch<Option[]>(citiesQuery),
    context.isAdmin ? client.fetch<Option[]>(realtorsQuery) : Promise.resolve([]),
  ]);
  const action = updatePropertyListing.bind(null, property._id, property._rev);

  return (
    <DashboardShell
      eyebrow="Property workspace"
      title={property.title_en || property.title_pt || property.title_nl || "Edit property"}
      intro={context.isAdmin ? "Administrator editing includes publication and ownership controls." : "Edit your linked listing. Ownership, publication status, and Provider identity remain administrator-only."}
    >
      <BackToDashboard />
      {query.error ? <p className="mb-4 rounded-lg border border-red-300/40 bg-red-500/10 p-4 text-sm text-red-100">{query.error}</p> : null}
      {query.saved || query.created ? <p className="mb-4 rounded-lg border border-[#d6a85a]/40 bg-[#d6a85a]/10 p-4 text-sm text-[#f0d9aa]">{query.created ? "Property created and sent for administrator oversight." : "Property saved and the administrator change log was updated."}</p> : null}
      {query.unchanged ? <p className="mb-4 rounded-lg border border-white/15 bg-white/5 p-4 text-sm text-stone-300">No changes were detected.</p> : null}
      <PropertyListingForm action={action} property={property} cities={cities} realtors={realtors} isAdmin={context.isAdmin} />
    </DashboardShell>
  );
}

