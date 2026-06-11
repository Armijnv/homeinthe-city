import type { Metadata } from "next";
import {
  BackToDashboard,
  DashboardCard,
  DashboardShell,
  type DashboardCardProps,
} from "@/app/dashboard/dashboard-ui";
import { requireAdmin } from "@/app/lib/dashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  await requireAdmin("/dashboard/admin");

  const cards: DashboardCardProps[] = [
    {
      title: "Cities",
      text: "Review city status, slugs, public links, and future city dashboard entry points.",
      href: "/dashboard/admin/cities",
      action: "Open cities",
      status: "Admin",
    },
    {
      title: "Providers",
      text: "Review provider roles, publication status, ownership email, and public profile links.",
      href: "/dashboard/admin/providers",
      action: "Open providers",
      status: "Admin",
    },
    {
      title: "Properties",
      text: "Review listings, listing type, status, city assignment, and coordinate readiness.",
      href: "/dashboard/admin/properties",
      action: "Open properties",
      status: "Admin",
    },
    {
      title: "Map health",
      text: "Find cities with map places, property coordinates, and listings that need coordinate cleanup.",
      href: "/dashboard/admin/map",
      action: "Open map health",
      status: "Admin",
    },
    {
      title: "Sanity Studio",
      text: "Use Studio for full editing while the dashboard grows its own focused management tools.",
      href: "/studio",
      action: "Open Studio",
      status: "Content tools",
    },
  ];

  return (
    <DashboardShell
      eyebrow="Admin"
      title="Control center"
      intro="Global management entry points for the operational parts of Home in the City. These pages are read-only foundations for future editing tools."
    >
      <BackToDashboard />
      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </div>
    </DashboardShell>
  );
}
