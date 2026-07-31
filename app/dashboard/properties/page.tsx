import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackToDashboard, DashboardShell, Pill } from "@/app/dashboard/dashboard-ui";
import { getDashboardContext } from "@/app/lib/dashboard";
import { canCreatePropertyListing } from "@/app/lib/propertyListingPolicy";
import { client } from "@/sanity/lib/client";

type ListingRow = {
  _id: string;
  title?: string;
  slug?: string;
  status?: string;
  cityName?: string;
  citySlug?: string;
  realtorName?: string;
};

const listingsQuery = `
  *[
    _type == "propertyListing" &&
    ($isAdmin || linkedRealtor._ref == $providerId)
  ] | order(_updatedAt desc){
    _id,
    "title": coalesce(title_en, title_pt, title_nl, "Untitled property"),
    "slug": slug.current,
    status,
    "cityName": coalesce(city->name_en, city->name_pt, city->name_nl),
    "citySlug": city->slug.current,
    "realtorName": linkedRealtor->name
  }
`;

export const metadata: Metadata = { title: "Property workspace" };

export default async function PropertyWorkspacePage() {
  const context = await getDashboardContext("/dashboard/properties");
  if (!canCreatePropertyListing(context.provider, context.isAdmin)) notFound();
  const listings = await client.fetch<ListingRow[]>(listingsQuery, {
    isAdmin: context.isAdmin,
    providerId: context.provider?._id || "",
  });
  const published = listings.filter((listing) =>
    ["available", "reserved", "sold", "rented"].includes(listing.status || ""),
  ).length;
  const unavailable = listings.length - published;

  return (
    <DashboardShell
      eyebrow={context.isAdmin ? "Admin property workspace" : "Real-estate workspace"}
      title={context.isAdmin ? "All listings" : "My listings"}
      intro="Create and maintain property content. Ownership and edit permissions are checked again on every page load and save."
    >
      <BackToDashboard />
      <div className="mb-5 grid grid-cols-2 gap-3 sm:max-w-md">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-2xl font-light text-white">{published}</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-stone-400">Public</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-2xl font-light text-white">{unavailable}</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-stone-400">Unavailable</p>
        </div>
      </div>
      <Link
        href="/dashboard/properties/new"
        className="mb-5 inline-flex min-h-11 items-center rounded-lg bg-[#d6a85a] px-4 py-2.5 text-sm font-semibold text-[#1a1f2e]"
      >
        Add property
      </Link>

      {listings.length ? (
        <div className="space-y-3">
          {listings.map((listing) => (
            <article key={listing._id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium text-white">{listing.title}</h2>
                    <Pill>{listing.status || "hidden"}</Pill>
                  </div>
                  <p className="mt-1 text-sm text-stone-400">
                    {listing.cityName || "No city"}
                    {context.isAdmin && listing.realtorName ? ` · ${listing.realtorName}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-3 py-2 text-sm text-white" href={`/dashboard/properties/${listing._id}/edit`}>
                    Edit
                  </Link>
                  {listing.citySlug && listing.slug && listing.status !== "hidden" ? (
                    <Link className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-3 py-2 text-sm text-[#d6a85a]" href={`/real-estate/${listing.citySlug}/${listing.slug}`}>
                      View public listing
                    </Link>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-stone-300">
          No listings yet. Use Add property to prepare the first one.
        </p>
      )}
    </DashboardShell>
  );
}

