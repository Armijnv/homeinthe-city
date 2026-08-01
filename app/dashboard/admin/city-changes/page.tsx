import type { Metadata } from "next";
import {
  DashboardBackLink,
  DashboardShell,
  DataTable,
  TableLink,
} from "@/app/dashboard/dashboard-ui";
import { requireAdmin } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";

type CityChange = {
  _id: string;
  changedAt?: string;
  cityName?: string;
  citySlug?: string;
  changeType?: string;
  description?: string;
  actorName?: string;
  actorEmail?: string;
};

const recentCityChangesQuery = `
  *[_type == "cityChangeLog"] | order(changedAt desc)[0...100]{
    _id,
    changedAt,
    "cityName": coalesce(cityName, city->name_en, city->name_pt, city->name_nl),
    "citySlug": coalesce(citySlug, city->slug.current),
    changeType,
    description,
    actorName,
    actorEmail
  }
`;

const changeTypeLabels: Record<string, string> = {
  cityContent: "City content",
  recommendations: "Recommendations",
  mapPlaceAdded: "Map place added",
  mapPlaceUpdated: "Map place updated",
  mapPlaceDeleted: "Map place deleted",
};

export const metadata: Metadata = {
  title: "City Changes",
};

export default async function AdminCityChangesPage() {
  await requireAdmin("/dashboard/admin/city-changes");
  const changes = await client.fetch<CityChange[]>(recentCityChangesQuery);

  return (
    <DashboardShell
      eyebrow="Admin"
      title="Recent city changes"
      intro="The latest city content and map edits made by non-admin city hosts. Admin edits are intentionally not logged here."
    >
      <DashboardBackLink href="/dashboard/admin" label="Admin workspace" />
      {changes.length ? (
        <DataTable headers={["When", "City", "Changed by", "Type", "Description"]}>
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
                {change.citySlug ? (
                  <TableLink href={`/dashboard/admin/cities/${change.citySlug}`}>
                    {change.cityName || change.citySlug}
                  </TableLink>
                ) : (
                  change.cityName || "Unknown city"
                )}
              </td>
              <td className="px-5 py-4">
                <div>{change.actorName || "Unknown host"}</div>
                {change.actorEmail ? (
                  <div className="mt-1 text-xs text-stone-400">
                    {change.actorEmail}
                  </div>
                ) : null}
              </td>
              <td className="px-5 py-4">
                {changeTypeLabels[change.changeType || ""] ||
                  change.changeType ||
                  "City change"}
              </td>
              <td className="px-5 py-4">{change.description || "—"}</td>
            </tr>
          ))}
        </DataTable>
      ) : (
        <p className="rounded-2xl border border-white/10 bg-white/10 p-6 text-stone-300">
          No city-host changes have been logged yet.
        </p>
      )}
    </DashboardShell>
  );
}
