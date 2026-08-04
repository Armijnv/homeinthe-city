import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardBackLink, DashboardShell, TableLink } from "@/app/dashboard/dashboard-ui";
import ProviderAdminForm, {
  type ProviderAdminCityOption,
  type ProviderAdminFormData,
} from "@/app/dashboard/admin/providers/ProviderAdminForm";
import { updateProviderAction } from "@/app/dashboard/admin/providers/actions";
import { providerProfilePath } from "@/app/lib/cityGuides";
import { requireAdmin } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";

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
    cities[]->{_id},
    managedCities[]->{_id},
    ownership{contactEmail, ownerUserId, ownershipStatus, selfEditEnabled, selfEditableFields},
    contactOptions{email, whatsapp}
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
  const [{ error, saved }, provider, cities] = await Promise.all([
    searchParams,
    client.fetch<ProviderAdminFormData | null>(providerForAdminQuery, {
      providerId,
    }),
    client.fetch<ProviderAdminCityOption[]>(cityOptionsQuery),
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
      <ProviderAdminForm
        provider={provider}
        cities={cities}
        action={updateProviderAction}
        submitLabel="Save provider"
      />
    </DashboardShell>
  );
}
