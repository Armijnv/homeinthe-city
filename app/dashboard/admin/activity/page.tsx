import type { Metadata } from "next";
import Link from "next/link";
import { ActivityFeed } from "./ActivityFeed";
import { DashboardBackLink, DashboardShell } from "@/app/dashboard/dashboard-ui";
import { fetchAdminActivities } from "@/app/lib/adminActivity";
import { requireAdmin } from "@/app/lib/dashboard";
import { adminActivitySummaryKey, type AdminActivitySummaryKey } from "@/app/lib/adminActivitySummary";

export const metadata: Metadata = { title: "Administrator Activity" };

type PageProps = { searchParams: Promise<{ category?: string }> };
const categoryLabels: Record<AdminActivitySummaryKey, string> = { profilePhotos: "Profile photos", profileUpdates: "Profile updates", cityUpdates: "City updates", mapPlaces: "Map places", recommendations: "Recommendations", properties: "Properties", servicePages: "Interpreter pages" };

export default async function AdminActivityPage({ searchParams }: PageProps) {
  await requireAdmin("/dashboard/admin/activity");
  const { category } = await searchParams;
  const selectedCategory = category && category in categoryLabels ? category as AdminActivitySummaryKey : null;
  const allActivities = await fetchAdminActivities();
  const activities = selectedCategory ? allActivities.filter((activity) => adminActivitySummaryKey(activity) === selectedCategory) : allActivities;
  return <DashboardShell eyebrow="Admin" title={selectedCategory ? categoryLabels[selectedCategory] : "Activity"} intro={selectedCategory ? `Showing only ${categoryLabels[selectedCategory].toLowerCase()} activity.` : "A human-readable history of provider, city, interpreter-page, property, and approval work across the platform."}>
    <DashboardBackLink href="/dashboard/admin" label="Admin workspace" />
    {selectedCategory ? <Link href="/dashboard/admin/activity" className="mb-5 inline-flex min-h-11 items-center text-sm text-[#d6a85a]">Clear filter</Link> : null}
    <ActivityFeed activities={activities} />
  </DashboardShell>;
}
