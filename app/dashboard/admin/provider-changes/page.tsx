import type { Metadata } from "next";
import { ActivityFeed } from "@/app/dashboard/admin/activity/ActivityFeed";
import { DashboardBackLink, DashboardShell } from "@/app/dashboard/dashboard-ui";
import { fetchAdminActivities } from "@/app/lib/adminActivity";
import { requireAdmin } from "@/app/lib/dashboard";

export const metadata: Metadata = { title: "Provider Activity" };
export default async function ProviderChangesPage() {
  await requireAdmin("/dashboard/admin/provider-changes");
  const activities = await fetchAdminActivities({ kinds: ["provider", "approval"] });
  return <DashboardShell eyebrow="Admin" title="Provider activity" intro="A readable history of provider edits, publishing, account connections, and approvals.">
    <DashboardBackLink href="/dashboard/admin" label="Admin workspace" />
    <ActivityFeed activities={activities} empty="No provider activity has been recorded yet." />
  </DashboardShell>;
}
