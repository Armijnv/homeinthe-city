import type { Metadata } from "next";
import { BackToDashboard, DashboardShell } from "@/app/dashboard/dashboard-ui";
import ProviderAdminForm, {
  type ProviderAdminCityOption,
} from "@/app/dashboard/admin/providers/ProviderAdminForm";
import { createProviderAction } from "@/app/dashboard/admin/providers/actions";
import { requireAdmin } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

const cityOptionsQuery = `
  *[_type == "city"] | order(name_en asc){_id, name_en, name_pt, name_nl}
`;

export const metadata: Metadata = {
  title: "Create Provider",
};

export default async function NewProviderPage({ searchParams }: PageProps) {
  await requireAdmin("/dashboard/admin/providers/new");
  const [{ error }, cities] = await Promise.all([
    searchParams,
    client.fetch<ProviderAdminCityOption[]>(cityOptionsQuery),
  ]);

  return (
    <DashboardShell
      eyebrow="Admin provider"
      title="Create provider"
      intro="Create a curated provider profile, optionally assign city access, and keep it hidden until it is ready to publish."
    >
      <BackToDashboard />
      {error ? (
        <p className="mb-6 rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100">
          {error}
        </p>
      ) : null}
      <ProviderAdminForm
        cities={cities}
        action={createProviderAction}
        submitLabel="Create provider"
      />
    </DashboardShell>
  );
}
