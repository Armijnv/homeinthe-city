import type { Metadata } from "next";
import Link from "next/link";
import { BackToDashboard, DashboardShell } from "@/app/dashboard/dashboard-ui";
import { requireAdmin } from "@/app/lib/dashboard";

export const metadata: Metadata = { title: "Admin Dashboard" };

const adminLinks = [
  ["Provider changes", "Recent Provider publishing and account connections", "/dashboard/admin/provider-changes"],
  ["Providers", "Profiles, roles, ownership and city assignments", "/dashboard/admin/providers"],
  ["Cities", "Publication, city content and host assignments", "/dashboard/admin/cities"],
  ["Properties", "Listings, owners, status and recent changes", "/dashboard/admin/properties"],
  ["City change log", "Recent content and map changes by city hosts", "/dashboard/admin/city-changes"],
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

  return (
    <DashboardShell
      eyebrow="Admin"
      title="Control center"
      intro="Compact entry points for operational management and audit logs."
    >
      <BackToDashboard />
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
