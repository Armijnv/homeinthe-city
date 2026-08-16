import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardBackLink, DashboardShell, TableLink } from "@/app/dashboard/dashboard-ui";
import ProviderAdminForm, {
  type ProviderAdminCityOption,
  type ProviderAdminFormData,
} from "@/app/dashboard/admin/providers/ProviderAdminForm";
import { updateProviderAction } from "@/app/dashboard/admin/providers/actions";
import { providerProfilePath } from "@/app/lib/cityGuides";
import { requireAdmin } from "@/app/lib/dashboard";
import { providerChangeFieldLabel } from "@/app/lib/providerChangePresentation";
import { client } from "@/sanity/lib/client";
import StudioDraftNotice from "@/app/dashboard/StudioDraftNotice";

type PageProps = {
  params: Promise<{ providerId: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
};

const providerForAdminQuery = `
  *[_type == "provider" && _id == $providerId][0]{
    _id,
    name,
    slug,
    status,
    verificationStatus,
    roles,
    primaryRole,
    languages[]{language, level, services},
    headline_en,
    headline_pt,
    headline_nl,
    intro_en,
    intro_pt,
    intro_nl,
    about_en,
    about_pt,
    about_nl,
    servicesTitle_en,
    servicesTitle_pt,
    servicesTitle_nl,
    services[]{
      _key,
      roles,
      title_en,
      title_pt,
      title_nl,
      description_en,
      description_pt,
      description_nl
    },
    mainPhoto{
      alt,
      "asset": asset->{"_ref": _id, url}
    },
    cities[]->{_id},
    managedCities[]->{_id},
    ownership{contactEmail, ownerUserId, ownershipStatus, selfEditEnabled, selfEditableFields},
    contactOptions{email, phone, whatsapp, website, preferredContact}
  }
`;

type RecentProviderChange = {
  _id: string;
  changedAt?: string;
  actorName?: string;
  changeType?: string;
  changedFields?: string[];
};

const recentProviderChangesQuery = `
  *[_type == "providerChangeLog" && provider._ref == $providerId]
    | order(changedAt desc)[0...5]{
      _id,
      changedAt,
      actorName,
      changeType,
      changedFields
    }
`;

const cityOptionsQuery = `
  *[_type == "city"] | order(name_en asc){_id, name_en, name_pt, name_nl}
`;

export const metadata: Metadata = {
  title: "Edit Provider",
};

export default async function EditProviderPage({ params, searchParams }: PageProps) {
  const { providerId } = await params;
  await requireAdmin(`/dashboard/admin/providers/${providerId}`);
  const [{ error, saved }, provider, cities, recentChanges] = await Promise.all([
    searchParams,
    client.fetch<ProviderAdminFormData | null>(providerForAdminQuery, {
      providerId,
    }),
    client.fetch<ProviderAdminCityOption[]>(cityOptionsQuery),
    client.fetch<RecentProviderChange[]>(recentProviderChangesQuery, {
      providerId,
    }),
  ]);

  if (!provider) notFound();

  const slug = provider.slug?.current;

  return (
    <DashboardShell
      eyebrow="Admin provider"
      title={provider.name || "Edit provider"}
      intro="Edit provider identity, contact details, roles, language coverage, city visibility, and city-host permissions."
      side={
        slug ? (
          <TableLink href={providerProfilePath("en", slug)}>Public profile</TableLink>
        ) : null
      }
    >
      <DashboardBackLink href="/dashboard/admin/providers" label="Providers" />
      <StudioDraftNotice documentId={provider._id} />
      {error ? (
        <p className="mb-6 rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="mb-6 rounded-xl border border-emerald-300/40 bg-emerald-950/30 p-4 text-sm text-emerald-100">
          Provider saved successfully.
        </p>
      ) : null}
      <section className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium text-white">Recent provider activity</h2>
            <p className="mt-1 text-sm text-stone-400">
              Direct provider publishes and administrator edits remain visible here; approval is not required.
            </p>
          </div>
          <Link href="/dashboard/admin/provider-changes" className="text-sm text-[#d6a85a]">
            View all provider activity
          </Link>
        </div>
        {recentChanges.length ? (
          <div className="mt-4 divide-y divide-white/10">
            {recentChanges.map((change) => (
              <Link
                key={change._id}
                href={`/dashboard/admin/activity/${encodeURIComponent(`provider:${change._id}`)}`}
                className="flex min-h-11 flex-col justify-center gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-stone-200">
                  {change.actorName || "Administrator"} changed {change.changedFields?.length
                    ? change.changedFields.map(providerChangeFieldLabel).join(", ")
                    : "the provider profile"}
                </span>
                <span className="shrink-0 text-xs text-stone-500">
                  {change.changedAt
                    ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(change.changedAt))
                    : "Time not recorded"}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-stone-400">No provider activity has been recorded yet.</p>
        )}
      </section>
      <ProviderAdminForm
        provider={provider}
        cities={cities}
        action={updateProviderAction}
        submitLabel="Save provider"
      />
    </DashboardShell>
  );
}
