import type { Metadata } from "next";
import { DashboardBackLink, DashboardShell } from "@/app/dashboard/dashboard-ui";
import { requirePropertyCreator } from "@/app/lib/propertyDashboard";
import { client } from "@/sanity/lib/client";
import { createPropertyListing } from "../actions";
import { PropertyListingForm } from "../PropertyListingForm";

type PageProps = { searchParams: Promise<{ error?: string }> };
type Option = { _id: string; name: string };

const citiesQuery = `*[_type == "city"]|order(name_en asc){_id,"name":coalesce(name_en,name_pt,name_nl)}`;
const realtorsQuery = `*[_type == "provider" && (primaryRole == "realtor" || "realtor" in roles)]|order(name asc){_id,"name":name}`;

export const metadata: Metadata = { title: "Add property" };

export default async function NewPropertyPage({ searchParams }: PageProps) {
  const context = await requirePropertyCreator();
  const [cities, realtors, params] = await Promise.all([
    client.fetch<Option[]>(citiesQuery),
    context.isAdmin ? client.fetch<Option[]>(realtorsQuery) : Promise.resolve([]),
    searchParams,
  ]);

  return (
    <DashboardShell
      eyebrow="Property workspace"
      title="Add property"
      intro={context.isAdmin ? "Create a listing and choose its publication status and linked Provider." : "Create a listing linked automatically to your Provider account. It starts unavailable until administrator review."}
    >
      <DashboardBackLink
        href="/dashboard/properties"
        label="Real estate workspace"
      />
      {params.error ? <p className="mb-4 rounded-lg border border-red-300/40 bg-red-500/10 p-4 text-sm text-red-100">{params.error}</p> : null}
      <PropertyListingForm action={createPropertyListing} cities={cities} realtors={realtors} isAdmin={context.isAdmin} />
    </DashboardShell>
  );
}
