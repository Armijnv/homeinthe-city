import type { Metadata } from "next";
import Link from "next/link";
import { BackToDashboard, DashboardShell } from "@/app/dashboard/dashboard-ui";
import { requireAdmin } from "@/app/lib/dashboard";
import { ActivityFeed } from "./activity/ActivityFeed";
import { fetchAdminActivities } from "@/app/lib/adminActivity";
import { adminActivitySummaryKey } from "@/app/lib/adminActivitySummary";
import { client } from "@/sanity/lib/client";

export const metadata: Metadata = { title: "Admin Dashboard" };

const adminLinks = [
  ["Activity", "Provider, city, property and approval activity", "/dashboard/admin/activity"],
  ["Providers", "Profiles, roles, ownership and city assignments", "/dashboard/admin/providers"],
  ["Cities", "Publication, city content and host assignments", "/dashboard/admin/cities"],
  ["Properties", "Listings, owners, status and recent changes", "/dashboard/admin/properties"],
  ["Provider approvals", "Historical Provider submissions", "/dashboard/admin/approvals"],
  ["Map health", "Missing coordinates and map readiness", "/dashboard/admin/map"],
  ["Admin guide", "Internal operating guide", "/admin-guide"],
] as const;

const studioLinks = [
  ["Cities", "/studio/structure/city"],
  ["Property listings", "/studio/structure/propertyListings;propertyListing"],
  ["Providers", "/studio/structure/providerProfiles;provider"],
  ["Service pages", "/studio/structure/servicePage"],
  ["Legacy hosts", "/studio/structure/host"],
  ["Full Studio", "/studio"],
] as const;

function CompactLink({ title, detail, href }: { title: string; detail?: string; href: string }) {
  return (
    <Link href={href} className="flex min-h-11 items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <div>
        <p className="font-medium text-white">{title}</p>
        {detail ? <p className="mt-0.5 text-sm text-stone-400">{detail}</p> : null}
      </div>
      <span className="text-[#d6a85a]" aria-hidden>→</span>
    </Link>
  );
}
export default async function AdminDashboardPage() {
  await requireAdmin("/dashboard/admin");
  const serverNow = await client.fetch<string>(`now()`);
  const sinceYesterday = new Date(new Date(serverNow).getTime() - 24 * 60 * 60 * 1000).toISOString();
  const [summary, recentActivities] = await Promise.all([
    client.fetch<{
      pendingApprovals: number;
      propertyDrafts: number;
      providersNeedingAssignment: number;
      citiesWithoutHost: number;
    }>(`{
      "pendingApprovals": count(*[_type == "providerSubmission" && status == "review"]),
      "propertyDrafts": count(*[_type == "propertyListing" && status == "hidden"]),
      "providersNeedingAssignment": count(*[_type == "provider" && status == "published" && (primaryRole == "host" || "host" in roles) && count(managedCities) == 0]),
      "citiesWithoutHost": count(*[_type == "city" && !defined(primaryHost._ref)])
    }`),
    fetchAdminActivities({ since: sinceYesterday, limit: 10_000 }),
  ]);
  const statusCards = [
    ["Pending approvals", `${summary.pendingApprovals} provider ${summary.pendingApprovals === 1 ? "edit" : "edits"}`, "/dashboard/admin/approvals"],
    ["Property drafts", `${summary.propertyDrafts} unpublished`, "/dashboard/admin/properties?attention=drafts"],
    ["Providers needing assignment", String(summary.providersNeedingAssignment), "/dashboard/admin/providers?attention=unassigned"],
    ["Cities without host", String(summary.citiesWithoutHost), "/dashboard/admin/cities?attention=without-host"],
  ] as const;
  const activitySummary = [
    ["Profile photos", "profilePhotos"],
    ["Profile updates", "profileUpdates"],
    ["City updates", "cityUpdates"],
    ["Map places", "mapPlaces"],
    ["Recommendations", "recommendations"],
    ["Properties", "properties"],
  ] as const;
  const activityCounts = Object.fromEntries(
    activitySummary.map(([, key]) => [key, recentActivities.filter((activity) => adminActivitySummaryKey(activity) === key).length]),
  );
  const recentActivity = recentActivities.slice(0, 12);

  return (
    <DashboardShell
      eyebrow="Admin"
      title="Control center"
      intro="Immediate operational awareness and management across the platform."
    >
      <BackToDashboard />
      <section className="mb-6">
        <h2 className="mb-3 text-lg font-medium text-white">Operational status</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statusCards.map(([title, value, href]) => <Link key={title} href={href} className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-[#d6a85a]/60"><p className="text-sm text-stone-300">{title}</p><p className="mt-2 text-xl font-light text-white">{value}</p></Link>)}
        </div>
      </section>
      <section className="mb-6">
        <h2 className="mb-3 text-lg font-medium text-white">Activity since yesterday</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {activitySummary.map(([label, key]) => <Link key={key} href={`/dashboard/admin/activity?category=${key}`} className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-[#d6a85a]/60"><p className="text-2xl font-light text-white">{activityCounts[key] || 0}</p><p className="mt-1 text-xs uppercase tracking-widest text-stone-400">{label}</p></Link>)}
        </div>
      </section>
      <section className="mb-6">
        <div className="mb-3 flex items-end justify-between gap-3"><div><h2 className="text-lg font-medium text-white">What changed since yesterday?</h2><p className="mt-1 text-sm text-stone-400">The latest work across every managed area.</p></div><Link href="/dashboard/admin/activity" className="text-sm text-[#d6a85a]">View all</Link></div>
        <ActivityFeed activities={recentActivity} empty="No activity has been recorded in the last 24 hours." />
      </section>
      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <h2 className="text-lg font-medium text-white">Management</h2>
          <div className="mt-3 divide-y divide-white/10">
            {adminLinks.map(([title, detail, href]) => (
              <CompactLink key={href} title={title} detail={detail} href={href} />
            ))}
          </div>
        </section>
        <section className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <h2 className="text-lg font-medium text-white">Sanity Studio</h2>
          <p className="mt-1 text-sm text-stone-400">Full editorial tools and underlying content.</p>
          <div className="mt-3 divide-y divide-white/10">
            {studioLinks.map(([title, href]) => (
              <CompactLink key={href} title={title} href={href} />
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
