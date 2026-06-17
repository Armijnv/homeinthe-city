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

  const dashboardCards: DashboardCardProps[] = [
    {
      title: "City changes",
      text: "Review recent city content and map changes made by non-admin city hosts.",
      href: "/dashboard/admin/city-changes",
      action: "Review city changes",
      status: "Audit log",
    },
    {
      title: "Cities",
      text: "Review city status, slugs, public links, and future city dashboard entry points.",
      href: "/dashboard/admin/cities",
      action: "Open cities",
      status: "Admin",
    },
    {
      title: "Providers",
      text: "Create and edit providers, roles, languages, visibility, account email, and city assignments.",
      href: "/dashboard/admin/providers",
      action: "Open providers",
      status: "Admin",
    },
    {
      title: "Provider changes",
      text: "Review provider creation, editing, and managed-city assignment history.",
      href: "/dashboard/admin/provider-changes",
      action: "Review provider changes",
      status: "Audit log",
    },
    {
      title: "Properties",
      text: "Review listings, listing type, status, city assignment, and coordinate readiness.",
      href: "/dashboard/admin/properties",
      action: "Open properties",
      status: "Admin",
    },
    {
      title: "Approval Center",
      text: "Review provider profile edits, inspect draft snapshots, and approve or reject submissions.",
      href: "/dashboard/admin/approvals",
      action: "Open approvals",
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
      title: "Studio shortcuts",
      text: "Jump straight into the main Sanity Studio sections for full content editing.",
      href: "/studio",
      action: "Open Full Studio",
      status: "Content tools",
    },
  ];
  const studioCards: DashboardCardProps[] = [
    {
      title: "Cities",
      text: "Open the city documents in Sanity Studio for full city content, sidebar cards, and map places.",
      href: "/studio/structure/city",
      action: "Open Studio cities",
      status: "Studio",
    },
    {
      title: "Property Listings",
      text: "Open property listings in Sanity Studio for full listing content, status, media, and coordinates.",
      href: "/studio/structure/propertyListings;propertyListing",
      action: "Open Studio properties",
      status: "Studio",
    },
    {
      title: "Providers",
      text: "Open provider profiles in Sanity Studio for roles, ownership, public profile content, and city assignment.",
      href: "/studio/structure/providerProfiles;provider",
      action: "Open Studio providers",
      status: "Studio",
    },
    {
      title: "Service Pages",
      text: "Open service pages in Sanity Studio for translation, interpreter, and other service landing pages.",
      href: "/studio/structure/servicePage",
      action: "Open Studio services",
      status: "Studio",
    },
    {
      title: "Legacy Hosts",
      text: "Open legacy host documents while older host routes still need to remain compatible.",
      href: "/studio/structure/host",
      action: "Open Studio hosts",
      status: "Legacy",
    },
    {
      title: "Full Studio",
      text: "Open the Studio root if a direct section link ever needs to be reselected manually.",
      href: "/studio",
      action: "Open Full Studio",
      status: "Studio",
    },
  ];

  return (
    <DashboardShell
      eyebrow="Admin"
      title="Control center"
      intro="Global management entry points for the operational parts of Home in the City. These pages are read-only foundations for future editing tools."
    >
      <BackToDashboard />
      <section className="mb-10">
        <h2 className="mb-5 text-2xl font-light text-white">
          Dashboard foundations
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {dashboardCards.map((card) => (
            <DashboardCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-light text-white">
          Sanity Studio sections
        </h2>
        <p className="mb-5 max-w-3xl text-sm leading-6 text-stone-300">
          These links target stable Studio structure ids. If Sanity changes its
          pane URL format later, the Full Studio link remains the reliable
          fallback.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          {studioCards.map((card) => (
            <DashboardCard key={card.title} {...card} />
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
