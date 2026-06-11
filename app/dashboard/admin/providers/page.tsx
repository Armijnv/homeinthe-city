import type { Metadata } from "next";
import { BackToDashboard, DataTable, TableLink } from "@/app/dashboard/dashboard-ui";
import { DashboardShell } from "@/app/dashboard/dashboard-ui";
import { providerProfilePath } from "@/app/lib/cityGuides";
import { providerRoleLabel, requireAdmin } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";

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
};

const adminProvidersQuery = `
  *[_type == "provider"]|order(name asc){
    _id,
    name,
    slug,
    status,
    primaryRole,
    roles,
    ownership{contactEmail}
  }
`;

export const metadata: Metadata = {
  title: "Admin Providers",
};

export default async function AdminProvidersPage() {
  await requireAdmin("/dashboard/admin/providers");
  const providers = await client.fetch<AdminProvider[]>(adminProvidersQuery);

  return (
    <DashboardShell
      eyebrow="Admin"
      title="Providers"
      intro="A read-only provider index for profile status, roles, ownership email, and public profile links."
    >
      <BackToDashboard />
      <DataTable
        headers={["Name", "Slug", "Primary role", "Status", "Contact email", "Links"]}
      >
        {providers.map((provider) => {
          const slug = provider.slug?.current;

          return (
            <tr key={provider._id}>
              <td className="px-5 py-4 font-medium text-white">
                {provider.name || "Untitled provider"}
              </td>
              <td className="px-5 py-4">{slug || "No slug"}</td>
              <td className="px-5 py-4">{providerRoleLabel(provider.primaryRole)}</td>
              <td className="px-5 py-4">{provider.status || "draft"}</td>
              <td className="px-5 py-4">
                {provider.ownership?.contactEmail || "No contact email"}
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
