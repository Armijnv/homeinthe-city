import type { Metadata } from "next";
import Link from "next/link";
import { BackToDashboard, DashboardShell, Pill } from "@/app/dashboard/dashboard-ui";
import { requireAdmin } from "@/app/lib/dashboard";
import {
  providerChangeFieldLabel,
  providerChangeValue,
} from "@/app/lib/providerChangePresentation";
import { client } from "@/sanity/lib/client";

type ProviderChange = {
  _id: string;
  changedAt?: string;
  providerName?: string;
  providerId?: string;
  changeType?: string;
  actorName?: string;
  actorEmail?: string;
  actorUserId?: string;
  changedFields?: string[];
  changes?: Array<{ field?: string; beforeValue?: string; afterValue?: string }>;
};

const providerChangesQuery = `
  *[_type == "providerChangeLog"] | order(changedAt desc)[0...100]{
    _id, changedAt, "providerName": coalesce(providerName, provider->name),
    "providerId": provider._ref, changeType, actorName, actorEmail, actorUserId,
    changedFields, changes
  }
`;
const cityNamesQuery = `*[_type == "city"]{_id,"name":coalesce(name_en,name_pt,name_nl)}`;

const changeLabels: Record<string, string> = {
  providerCreated: "Provider created",
  providerEdited: "Provider edited",
  providerSelfPublished: "Provider published changes",
  managedCityAssigned: "City assigned",
  managedCityRemoved: "City removed",
};

export const metadata: Metadata = { title: "Provider Changes" };

export default async function ProviderChangesPage() {
  await requireAdmin("/dashboard/admin/provider-changes");
  const [changes, cities] = await Promise.all([
    client.fetch<ProviderChange[]>(providerChangesQuery),
    client.fetch<Array<{ _id: string; name: string }>>(cityNamesQuery),
  ]);
  const cityNames = Object.fromEntries(cities.map((city) => [city._id, city.name]));

  return (
    <DashboardShell
      eyebrow="Admin"
      title="Provider changes"
      intro="A readable oversight log of Provider publishing, administrator edits, and account connections. Complete technical audit data remains stored in Sanity."
    >
      <BackToDashboard />
      {changes.length ? (
        <div className="space-y-3">
          {changes.map((change) => {
            const accountConnected = change.changes?.some(
              (field) => field.field === "ownership.ownerUserId",
            );
            const fields = change.changes?.length
              ? change.changes.map((field) => field.field).filter(Boolean)
              : change.changedFields || [];

            return (
              <article key={change._id} className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-medium text-white">
                        {change.actorName || change.actorEmail || "Administrator"} changed{" "}
                        {change.providerId ? (
                          <Link className="text-[#d6a85a]" href={`/dashboard/admin/providers/${change.providerId}`}>
                            {change.providerName || "a Provider"}
                          </Link>
                        ) : (
                          change.providerName || "a Provider"
                        )}
                      </h2>
                      {accountConnected ? <Pill>Account connected</Pill> : null}
                    </div>
                    <p className="mt-1 text-sm text-stone-400">
                      {change.changedAt
                        ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(change.changedAt))
                        : "Time unavailable"}
                      {change.changeType ? ` · ${changeLabels[change.changeType] || change.changeType}` : ""}
                    </p>
                  </div>
                </div>

                {fields.length ? (
                  <p className="mt-3 text-sm text-stone-300">
                    {fields.map((field) => providerChangeFieldLabel(field)).join(" · ")}
                  </p>
                ) : null}

                {change.changes?.length ? (
                  <div className="mt-3 space-y-2">
                    {change.changes.map((fieldChange, index) => (
                      <div key={`${fieldChange.field}-${index}`} className="rounded-lg bg-black/10 p-3 text-sm">
                        <p className="font-medium text-white">{providerChangeFieldLabel(fieldChange.field)}</p>
                        <div className="mt-1 grid gap-1 text-stone-400 sm:grid-cols-2 sm:gap-4">
                          <p><span className="text-stone-500">Before:</span> {providerChangeValue(fieldChange.beforeValue, cityNames)}</p>
                          <p><span className="text-stone-500">After:</span> {providerChangeValue(fieldChange.afterValue, cityNames)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                <details className="mt-3 text-xs text-stone-400">
                  <summary className="min-h-11 cursor-pointer py-3">Technical details</summary>
                  <dl className="grid gap-1 rounded-lg bg-black/15 p-3">
                    <div>Log ID: {change._id}</div>
                    <div>Provider ID: {change.providerId || "Not stored"}</div>
                    <div>Clerk user ID: {change.actorUserId || "Not stored"}</div>
                    <div>Actor email: {change.actorEmail || "Not stored"}</div>
                  </dl>
                </details>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-stone-300">No Provider changes have been logged yet.</p>
      )}
    </DashboardShell>
  );
}
