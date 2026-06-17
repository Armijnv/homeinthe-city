import type { Metadata } from "next";
import {
  BackToDashboard,
  DashboardShell,
  DataTable,
  TableLink,
} from "@/app/dashboard/dashboard-ui";
import { requireAdmin } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";

type ProviderChange = {
  _id: string;
  changedAt?: string;
  providerName?: string;
  providerId?: string;
  changeType?: string;
  description?: string;
  actorName?: string;
  actorEmail?: string;
};

const providerChangesQuery = `
  *[_type == "providerChangeLog"] | order(changedAt desc)[0...100]{
    _id,
    changedAt,
    "providerName": coalesce(providerName, provider->name),
    "providerId": provider._ref,
    changeType,
    description,
    actorName,
    actorEmail
  }
`;

const changeLabels: Record<string, string> = {
  providerCreated: "Created",
  providerEdited: "Edited",
  managedCityAssigned: "City assigned",
  managedCityRemoved: "City removed",
};

export const metadata: Metadata = {
  title: "Provider Changes",
};

export default async function ProviderChangesPage() {
  await requireAdmin("/dashboard/admin/provider-changes");
  const changes = await client.fetch<ProviderChange[]>(providerChangesQuery);

  return (
    <DashboardShell
      eyebrow="Admin"
      title="Provider changes"
      intro="Recent admin provider creation, editing, and managed-city assignment activity."
    >
      <BackToDashboard />
      {changes.length ? (
        <DataTable headers={["When", "Provider", "Changed by", "Type", "Description"]}>
          {changes.map((change) => (
            <tr key={change._id}>
              <td className="whitespace-nowrap px-5 py-4 text-stone-300">
                {change.changedAt
                  ? new Intl.DateTimeFormat("en", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(change.changedAt))
                  : "Unknown"}
              </td>
              <td className="px-5 py-4">
                {change.providerId ? (
                  <TableLink href={`/dashboard/admin/providers/${change.providerId}`}>
                    {change.providerName || "Provider"}
                  </TableLink>
                ) : (
                  change.providerName || "Unknown provider"
                )}
              </td>
              <td className="px-5 py-4">
                <div>{change.actorName || "Unknown admin"}</div>
                {change.actorEmail ? (
                  <div className="mt-1 text-xs text-stone-400">{change.actorEmail}</div>
                ) : null}
              </td>
              <td className="px-5 py-4">
                {changeLabels[change.changeType || ""] || change.changeType || "Change"}
              </td>
              <td className="px-5 py-4">{change.description || "—"}</td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <p className="rounded-2xl border border-white/10 bg-white/10 p-6 text-stone-300">
          No provider changes have been logged yet.
        </p>
      )}
    </DashboardShell>
  );
}
