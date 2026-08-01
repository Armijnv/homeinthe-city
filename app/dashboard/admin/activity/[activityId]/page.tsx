import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DashboardBackLink, DashboardShell } from "@/app/dashboard/dashboard-ui";
import { approveProviderSubmissionAction, rejectProviderSubmissionAction } from "@/app/dashboard/admin/approvals/actions";
import { fetchAdminActivity } from "@/app/lib/adminActivity";
import { requireAdmin } from "@/app/lib/dashboard";
import { providerChangeFieldLabel, providerChangeValue } from "@/app/lib/providerChangePresentation";

type PageProps = { params: Promise<{ activityId: string }>; searchParams: Promise<{ error?: string }> };
export const metadata: Metadata = { title: "Activity detail" };

function fieldLabel(kind: string, field?: string) {
  if (kind === "provider" || kind === "approval") return providerChangeFieldLabel(field);
  const labels: Record<string, string> = { status: "Publication status", linkedRealtor: "Assigned realtor", title_en: "English title", title_pt: "Portuguese title", title_nl: "Dutch title", mainImage: "Main image", gallery: "Gallery", mapCoordinates: "Map coordinates" };
  return labels[field || ""] || providerChangeFieldLabel(field);
}

function displayValue(kind: string, value?: string) {
  return kind === "provider" ? providerChangeValue(value) : value || "Not recorded";
}

export default async function AdminActivityDetailPage({ params, searchParams }: PageProps) {
  const [{ activityId }, { error }] = await Promise.all([params, searchParams]);
  await requireAdmin(`/dashboard/admin/activity/${activityId}`);
  const key = decodeURIComponent(activityId);
  const activity = await fetchAdminActivity(key);
  if (!activity) notFound();
  const returnTo = `/dashboard/admin/activity/${encodeURIComponent(key)}`;

  return <DashboardShell eyebrow="Admin activity" title={`${activity.actor}${activity.actorRole ? ` (${activity.actorRole})` : ""}`} intro={`${activity.action} in ${activity.location}.`}>
    <DashboardBackLink href="/dashboard/admin/activity" label="Activity" />
    {error ? <p className="mb-5 rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100">{error}</p> : null}
    <section className="mb-5 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div><dt className="text-stone-400">Who</dt><dd className="mt-1 text-white">{activity.actor}{activity.actorRole ? ` (${activity.actorRole})` : ""}</dd></div>
        <div><dt className="text-stone-400">Where</dt><dd className="mt-1 text-white">{activity.location}</dd></div>
        <div><dt className="text-stone-400">What</dt><dd className="mt-1 text-white">{activity.action}</dd></div>
        <div><dt className="text-stone-400">When</dt><dd className="mt-1 text-white">{activity.occurredAt ? new Intl.DateTimeFormat("en", { dateStyle: "long", timeStyle: "short" }).format(new Date(activity.occurredAt)) : "Not recorded"}</dd></div>
      </dl>
    </section>
    {activity.kind === "approval" && activity.status === "review" ? <section className="mb-5 flex flex-wrap gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <form action={approveProviderSubmissionAction}><input type="hidden" name="submissionId" value={activity.id}/><input type="hidden" name="returnTo" value={returnTo}/><button className="min-h-11 rounded-lg bg-[#d6a85a] px-4 py-2 text-sm font-semibold text-[#1a1f2e]">Approve</button></form>
      <form action={rejectProviderSubmissionAction} className="flex flex-wrap gap-2"><input type="hidden" name="submissionId" value={activity.id}/><input type="hidden" name="returnTo" value={returnTo}/><input name="reviewNote" placeholder="Optional rejection note" className="min-h-11 rounded-lg border border-white/15 bg-white/10 px-3 text-sm text-white placeholder:text-stone-400"/><button className="min-h-11 rounded-lg border border-white/15 px-4 py-2 text-sm text-white">Reject</button></form>
    </section> : null}
    <section className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <h2 className="text-lg font-medium text-white">Previous and new values</h2>
      {activity.changes.length ? <div className="mt-4 space-y-3">{activity.changes.map((change, index) => <div key={`${change.field}-${index}`} className="rounded-lg bg-black/15 p-3"><p className="font-medium text-white">{fieldLabel(activity.kind, change.field)}</p><div className="mt-2 grid gap-3 text-sm sm:grid-cols-2"><div><p className="text-stone-500">Previous</p><p className="mt-1 whitespace-pre-wrap text-stone-200">{displayValue(activity.kind, change.beforeValue)}</p></div><div><p className="text-stone-500">New</p><p className="mt-1 whitespace-pre-wrap text-stone-200">{displayValue(activity.kind, change.afterValue)}</p></div></div></div>)}</div> : <p className="mt-3 text-sm text-stone-300">Earlier records did not retain field-level previous and new values. The activity description remains available.</p>}
      <details className="mt-4 text-xs text-stone-400"><summary className="min-h-11 cursor-pointer py-3">Technical information</summary><dl className="grid gap-1 rounded-lg bg-black/20 p-3"><div>Record: {activity.id}</div><div>Type: {activity.kind} / {activity.changeType || activity.status || "activity"}</div><div>Actor email: {activity.actorEmail || "Not stored"}</div><div>Actor user: {activity.actorUserId || "Not stored"}</div>{activity.changes.map((change, index) => <div key={index}>Field: {change.field || "Not stored"}</div>)}</dl></details>
    </section>
  </DashboardShell>;
}
