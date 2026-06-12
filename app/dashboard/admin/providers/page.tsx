import type { Metadata } from "next";
import { BackToDashboard, DataTable, TableLink } from "@/app/dashboard/dashboard-ui";
import { DashboardShell } from "@/app/dashboard/dashboard-ui";
import { providerProfilePath } from "@/app/lib/cityGuides";
import { cityName, providerRoleLabel, requireAdmin, type DashboardCity } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";
import {
  assignManagedCityAction,
  removeManagedCityAction,
} from "./actions";

type AdminProvider = {
  _id: string;
  name?: string;
  slug?: {
    current?: string;
  };
  status?: string;
  primaryRole?: string;
  roles?: string[];
  ownership?: {
    contactEmail?: string;
  };
  cities?: DashboardCity[];
  managedCities?: DashboardCity[];
};

const adminProvidersQuery = `
  *[_type == "provider"]|order(name asc){
    _id,
    name,
    slug,
    status,
    primaryRole,
    roles,
    ownership{contactEmail},
    cities[]->{_id, name_en, name_pt, name_nl, slug},
    managedCities[]->{_id, name_en, name_pt, name_nl, slug}
  }
`;

const adminProviderCityOptionsQuery = `
  *[_type == "city"]|order(name_en asc){
    _id,
    name_en,
    name_pt,
    name_nl,
    slug
  }
`;

export const metadata: Metadata = {
  title: "Admin Providers",
};

export default async function AdminProvidersPage() {
  await requireAdmin("/dashboard/admin/providers");
  const [providers, cities] = await Promise.all([
    client.fetch<AdminProvider[]>(adminProvidersQuery),
    client.fetch<DashboardCity[]>(adminProviderCityOptionsQuery),
  ]);

  return (
    <DashboardShell
      eyebrow="Admin"
      title="Providers"
      intro="A read-only provider index for profile status, roles, ownership email, public city coverage, and managed city permissions."
    >
      <BackToDashboard />
      <DataTable
        headers={[
          "Name",
          "Primary role",
          "Status",
          "Contact email",
          "Cities served",
          "Managed cities",
          "Assign managed city",
          "Links",
        ]}
      >
        {providers.map((provider) => {
          const slug = provider.slug?.current;
          const managedCityIds = new Set(
            provider.managedCities?.map((city) => city._id).filter(Boolean),
          );
          const assignableCities = cities.filter((city) => !managedCityIds.has(city._id));

          return (
            <tr key={provider._id}>
              <td className="px-5 py-4 font-medium text-white">
                {provider.name || "Untitled provider"}
                <div className="mt-1 text-xs text-stone-400">{slug || "No slug"}</div>
              </td>
              <td className="px-5 py-4">{providerRoleLabel(provider.primaryRole)}</td>
              <td className="px-5 py-4">{provider.status || "draft"}</td>
              <td className="px-5 py-4">
                {provider.ownership?.contactEmail || "No contact email"}
              </td>
              <td className="px-5 py-4">
                {provider.cities?.length
                  ? provider.cities.map((city) => cityName(city)).join(", ")
                  : "None"}
              </td>
              <td className="px-5 py-4">
                {provider.managedCities?.length ? (
                  <div className="flex flex-col gap-2">
                    {provider.managedCities.map((city) => (
                      <form
                        key={city._id || city.slug?.current || cityName(city)}
                        action={removeManagedCityAction}
                        className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/10 px-3 py-2"
                      >
                        <input type="hidden" name="providerId" value={provider._id} />
                        <input type="hidden" name="cityId" value={city._id || ""} />
                        <span>{cityName(city)}</span>
                        <button
                          type="submit"
                          className="rounded-md border border-white/15 px-2 py-1 text-xs text-stone-200 transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
                        >
                          Remove
                        </button>
                      </form>
                    ))}
                  </div>
                ) : (
                  <span className="text-stone-400">None</span>
                )}
              </td>
              <td className="px-5 py-4">
                <form action={assignManagedCityAction} className="flex min-w-56 gap-2">
                  <input type="hidden" name="providerId" value={provider._id} />
                  <select
                    name="cityId"
                    className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#1a1f2e] px-3 py-2 text-sm text-white"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Choose city
                    </option>
                    {assignableCities.map((city) => (
                      <option key={city._id} value={city._id}>
                        {cityName(city)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={!assignableCities.length}
                    className="rounded-lg border border-white/15 px-3 py-2 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Assign
                  </button>
                </form>
                <p className="mt-2 text-xs leading-5 text-stone-400">
                  This grants city dashboard access only. It does not change public
                  Cities Served.
                </p>
              </td>
              <td className="px-5 py-4">
                {slug ? (
                  <TableLink href={providerProfilePath("en", slug)}>
                    Public profile
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
