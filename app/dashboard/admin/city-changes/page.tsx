import type { Metadata } from "next";
import { ActivityFeed } from "@/app/dashboard/admin/activity/ActivityFeed";
import { DashboardBackLink, DashboardShell } from "@/app/dashboard/dashboard-ui";
import { fetchAdminActivities } from "@/app/lib/adminActivity";
import { requireAdmin } from "@/app/lib/dashboard";

export const metadata: Metadata = { title: "City Activity" };
export default async function AdminCityChangesPage() {
  await requireAdmin("/dashboard/admin/city-changes");
  const activities = await fetchAdminActivities({ kinds: ["city"] });
  return <DashboardShell eyebrow="Admin" title="Recent city activity" intro="A readable history of city content, recommendation, and map work by city hosts.">
    <DashboardBackLink href="/dashboard/admin" label="Admin workspace" />
    <ActivityFeed activities={activities} empty="No city-host activity has been recorded yet." />
  </DashboardShell>;
}
