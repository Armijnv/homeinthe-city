import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DashboardBackLink, DashboardShell } from "@/app/dashboard/dashboard-ui";
import { approveProviderSubmissionAction, rejectProviderSubmissionAction } from "@/app/dashboard/admin/approvals/actions";
import { fetchAdminActivity, type AdminActivity } from "@/app/lib/adminActivity";
import { activityFieldLabel, activityValueEqual, humanActivityValue, imageUrls, parseActivityValue, wordDiff } from "@/app/lib/activityPresentation";
import { requireAdmin } from "@/app/lib/dashboard";

type PageProps = { params: Promise<{ activityId: string }>; searchParams: Promise<{ error?: string }> };
export const metadata: Metadata = { title: "Activity detail" };

function ValueBlock({ label, value, activity }: { label: string; value: unknown; activity: AdminActivity }) {
  const images = imageUrls(value, activity.references);
  return <div className="min-w-0"><p className="text-xs uppercase tracking-widest text-stone-500">{label}</p>
    {images.length ? <div className="mt-2 grid grid-cols-2 gap-3">{images.map((url) => <div key={url} className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/20"><Image src={url} alt={`${label} preview`} fill sizes="(max-width: 640px) 45vw, 240px" className="object-cover" /></div>)}</div> : null}
    {!images.length ? <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-stone-200">{humanActivityValue(value, activity.references)}</p> : null}
  </div>;
}

function ChangeCard({ activity, field, beforeValue, afterValue }: { activity: AdminActivity; field?: string; beforeValue?: string; afterValue?: string }) {
  const before = parseActivityValue(beforeValue);
  const after = parseActivityValue(afterValue);
  const beforeText = typeof before === "string" ? before : null;
  const afterText = typeof after === "string" ? after : null;
  const canDiff = beforeText !== null && afterText !== null && beforeText !== afterText && !imageUrls(before, activity.references).length && !imageUrls(after, activity.references).length;
  return <article className="rounded-xl border border-white/10 bg-black/15 p-4">
    <h3 className="font-medium text-white"><span className="mr-2 text-[#d6a85a]" aria-hidden>✓</span>{activityFieldLabel(field, activity.kind)}</h3>
    {canDiff ? <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3"><p className="mb-2 text-xs uppercase tracking-widest text-stone-500">Visual difference</p><p className="whitespace-pre-wrap break-words text-sm leading-7 text-stone-200">{wordDiff(beforeText, afterText).map((part, index) => part.type === "added" ? <mark key={index} className="rounded bg-emerald-400/20 px-0.5 text-emerald-100">{part.value}</mark> : part.type === "removed" ? <del key={index} className="rounded bg-red-400/15 px-0.5 text-red-200">{part.value}</del> : <span key={index}>{part.value}</span>)}</p></div> : null}
    <div className="mt-4 grid gap-5 sm:grid-cols-2"><ValueBlock label="Previous" value={before} activity={activity} /><ValueBlock label="New" value={after} activity={activity} /></div>
  </article>;
}

export default async function AdminActivityDetailPage({ params, searchParams }: PageProps) {
  const [{ activityId }, { error }] = await Promise.all([params, searchParams]);
  await requireAdmin(`/dashboard/admin/activity/${activityId}`);
  const key = decodeURIComponent(activityId);
  const activity = await fetchAdminActivity(key);
  if (!activity) notFound();
  const changes = activity.changes.filter((change) => !activityValueEqual(change.beforeValue, change.afterValue));
  const returnTo = `/dashboard/admin/activity/${encodeURIComponent(key)}`;

  return <DashboardShell eyebrow="Admin activity" title={`${activity.actor}${activity.actorRole ? ` (${activity.actorRole})` : ""}`} intro={`${activity.action} in ${activity.location}.`}>
    <DashboardBackLink href="/dashboard/admin/activity" label="Activity" />
    {activity.kind === "provider" && activity.providerId ? (
      <div className="mb-5 flex flex-wrap gap-3">
        <Link
          href={`/dashboard/admin/providers/${encodeURIComponent(activity.providerId)}`}
          className="inline-flex min-h-11 items-center rounded-lg bg-[#d6a85a] px-4 py-2 text-sm font-semibold text-[#1a1f2e]"
        >
          Edit provider
        </Link>
        {activity.providerSlug ? (
          <Link
            href={`/providers/${encodeURIComponent(activity.providerSlug)}`}
            className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-4 py-2 text-sm text-white"
          >
            View public profile
          </Link>
        ) : null}
      </div>
    ) : null}
    {error ? <p className="mb-5 rounded-xl border border-red-300/40 bg-red-950/30 p-4 text-sm text-red-100">{error}</p> : null}
    <section className="mb-5 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5"><dl className="grid gap-4 text-sm sm:grid-cols-2">
      <div><dt className="text-stone-400">Who</dt><dd className="mt-1 text-white">{activity.actor}{activity.actorRole ? ` (${activity.actorRole})` : ""}</dd></div>
      <div><dt className="text-stone-400">Where</dt><dd className="mt-1 text-white">{activity.location}</dd></div>
      <div><dt className="text-stone-400">What</dt><dd className="mt-1 text-white">{activity.action}</dd></div>
      <div><dt className="text-stone-400">When</dt><dd className="mt-1 text-white">{activity.occurredAt ? new Intl.DateTimeFormat("en", { dateStyle: "long", timeStyle: "short" }).format(new Date(activity.occurredAt)) : "Not recorded"}</dd></div>
    </dl></section>
    {activity.kind === "approval" && activity.status === "review" ? <section className="mb-5 flex flex-wrap gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <form action={approveProviderSubmissionAction}><input type="hidden" name="submissionId" value={activity.id}/><input type="hidden" name="returnTo" value={returnTo}/><button className="min-h-11 rounded-lg bg-[#d6a85a] px-4 py-2 text-sm font-semibold text-[#1a1f2e]">Approve</button></form>
      <form action={rejectProviderSubmissionAction} className="grid w-full gap-2 sm:w-auto sm:grid-cols-[minmax(12rem,1fr)_auto]"><input type="hidden" name="submissionId" value={activity.id}/><input type="hidden" name="returnTo" value={returnTo}/><input name="reviewNote" placeholder="Optional rejection note" className="min-h-11 min-w-0 rounded-lg border border-white/15 bg-white/10 px-3 text-sm text-white placeholder:text-stone-400"/><button className="min-h-11 rounded-lg border border-white/15 px-4 py-2 text-sm text-white">Reject</button></form>
    </section> : null}
    <section className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <h2 className="text-lg font-medium text-white">Changes</h2>
      {changes.length ? <div className="mt-4 grid gap-4">{changes.map((change, index) => <ChangeCard key={`${change.field}-${index}`} activity={activity} {...change} />)}</div> : <p className="mt-3 text-sm text-stone-300">This earlier activity record did not retain field-level previous and new values.</p>}
      <details className="mt-4 text-xs text-stone-400"><summary className="min-h-11 cursor-pointer py-3">Technical details</summary><dl className="grid gap-1 break-all rounded-lg bg-black/20 p-3"><div>Record: {activity.id}</div><div>Type: {activity.kind} / {activity.changeType || activity.status || "activity"}</div><div>Actor email: {activity.actorEmail || "Not stored"}</div><div>Actor user: {activity.actorUserId || "Not stored"}</div>{activity.changes.map((change, index) => <div key={index}>Field: {change.field || "Not stored"}</div>)}</dl></details>
    </section>
  </DashboardShell>;
}
