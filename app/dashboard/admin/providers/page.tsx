import type { Metadata } from "next";
import Link from "next/link";
import { DashboardBackLink, Pill, TableLink } from "@/app/dashboard/dashboard-ui";
import { DashboardShell } from "@/app/dashboard/dashboard-ui";
import { providerProfilePath } from "@/app/lib/cityGuides";
import { cityName, providerRoleLabel, requireAdmin, type DashboardCity } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";
import { assignManagedCityAction, removeManagedCityAction } from "./actions";

type AdminProvider = {
  _id: string;
  name?: string;
  slug?: { current?: string };
  status?: string;
  primaryRole?: string;
  roles?: string[];
  ownership?: { contactEmail?: string };
  cities?: DashboardCity[];
  managedCities?: DashboardCity[];
};

const adminProvidersQuery = `
  *[_type == "provider"]|order(name asc){
    _id, name, slug, status, primaryRole, roles, ownership{contactEmail},
    cities[]->{_id, name_en, name_pt, name_nl, slug},
    managedCities[]->{_id, name_en, name_pt, name_nl, slug}
  }
`;

const adminProviderCityOptionsQuery = `
  *[_type == "city"]|order(name_en asc){_id, name_en, name_pt, name_nl, slug}
`;

export const metadata: Metadata = { title: "Admin Providers" };

type PageProps = { searchParams: Promise<{ attention?: string }> };

export default async function AdminProvidersPage({ searchParams }: PageProps) {
  await requireAdmin("/dashboard/admin/providers");
  const [{ attention }, providers, cities] = await Promise.all([
    searchParams,
    client.fetch<AdminProvider[]>(adminProvidersQuery),
    client.fetch<DashboardCity[]>(adminProviderCityOptionsQuery),
  ]);
  const needsAssignment = (provider: AdminProvider) =>
    provider.status === "published" &&
    (provider.primaryRole === "host" || provider.roles?.includes("host")) &&
    !provider.managedCities?.length;
  const filteredProviders = attention === "unassigned"
    ? providers.filter(needsAssignment)
    : providers;

  return (
    <DashboardShell
      eyebrow="Admin"
      title={attention === "unassigned" ? "Providers needing assignment" : "Providers"}
      intro={attention === "unassigned"
        ? "These published City Hosts do not have a managed city. Assign one directly below."
        : "Create and edit curated provider profiles, publication status, roles, languages, public city coverage, and managed city permissions."}
    >
      <DashboardBackLink href="/dashboard/admin" label="Admin workspace" />
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <TableLink href="/dashboard/admin/providers/new">Create provider</TableLink>
        {attention ? <Link href="/dashboard/admin/providers" className="text-sm text-[#d6a85a]">Show all providers</Link> : null}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {filteredProviders.map((provider) => {
          const slug = provider.slug?.current;
          const managedCityIds = new Set(provider.managedCities?.map((city) => city._id).filter(Boolean));
          const assignableCities = cities.filter((city) => !managedCityIds.has(city._id));

          return (
            <article key={provider._id} className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-medium text-white">{provider.name || "Untitled provider"}</h2>
                  <p className="mt-1 text-sm text-stone-400">{providerRoleLabel(provider.primaryRole)} · {provider.ownership?.contactEmail || "No contact email"}</p>
                </div>
                <Pill>{provider.status || "draft"}</Pill>
              </div>
              {needsAssignment(provider) ? (
                <p className="mt-4 rounded-lg border border-[#d6a85a]/30 bg-[#d6a85a]/10 p-3 text-sm text-[#f0d6a2]">
                  Needs attention: published City Host has no managed city assignment.
                </p>
              ) : null}
              <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                <div><dt className="text-xs uppercase tracking-widest text-stone-500">Cities served</dt><dd className="mt-1 text-stone-200">{provider.cities?.length ? provider.cities.map(cityName).join(", ") : "None"}</dd></div>
                <div><dt className="text-xs uppercase tracking-widest text-stone-500">Managed cities</dt><dd className="mt-1 text-stone-200">{provider.managedCities?.length ? provider.managedCities.map(cityName).join(", ") : "None"}</dd></div>
              </dl>
              {provider.managedCities?.length ? (
                <div className="mt-4 grid gap-2">
                  {provider.managedCities.map((city) => (
                    <form key={city._id || city.slug?.current || cityName(city)} action={removeManagedCityAction} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/10 px-3 py-2">
                      <input type="hidden" name="providerId" value={provider._id} />
                      <input type="hidden" name="cityId" value={city._id || ""} />
                      <span className="text-sm text-stone-200">{cityName(city)}</span>
                      <button type="submit" className="min-h-11 rounded-md border border-white/15 px-3 text-xs text-stone-200 transition hover:border-[#d6a85a] hover:text-[#d6a85a]">Remove</button>
                    </form>
                  ))}
                </div>
              ) : null}
              <form action={assignManagedCityAction} className="mt-4 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                <input type="hidden" name="providerId" value={provider._id} />
                <select name="cityId" className="min-h-11 min-w-0 rounded-lg border border-white/10 bg-[#1a1f2e] px-3 text-sm text-white" defaultValue="" required>
                  <option value="" disabled>Choose managed city</option>
                  {assignableCities.map((city) => <option key={city._id} value={city._id}>{cityName(city)}</option>)}
                </select>
                <button type="submit" disabled={!assignableCities.length} className="min-h-11 rounded-lg border border-white/15 px-4 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a] disabled:cursor-not-allowed disabled:opacity-40">Assign city</button>
              </form>
              <p className="mt-2 text-xs leading-5 text-stone-400">This grants city dashboard access only. It does not change public Cities Served.</p>
              <div className="mt-4 flex flex-wrap gap-3 border-t border-white/10 pt-4">
                <TableLink href={`/dashboard/admin/providers/${provider._id}`}>Edit provider</TableLink>
                {slug && provider.status === "published" ? <TableLink href={providerProfilePath("en", slug)}>Public profile</TableLink> : null}
              </div>
            </article>
          );
        })}
      </div>
      {!filteredProviders.length ? <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-stone-300">No providers currently need this attention.</p> : null}
    </DashboardShell>
  );
}
