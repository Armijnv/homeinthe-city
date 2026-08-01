import type { Metadata } from "next";
import { ActivityFeed } from "./ActivityFeed";
import { DashboardBackLink, DashboardShell } from "@/app/dashboard/dashboard-ui";
import { fetchAdminActivities } from "@/app/lib/adminActivity";
import { requireAdmin } from "@/app/lib/dashboard";

export const metadata: Metadata = { title: "Administrator Activity" };

export default async function AdminActivityPage() {
  await requireAdmin("/dashboard/admin/activity");
  const activities = await fetchAdminActivities();
  return <DashboardShell eyebrow="Admin" title="Activity" intro="A human-readable history of provider, city, property, and approval work across the platform.">
    <DashboardBackLink href="/dashboard/admin" label="Admin workspace" />
    <ActivityFeed activities={activities} />
  </DashboardShell>;
}
