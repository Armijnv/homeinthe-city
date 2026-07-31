import { SignOutButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import { DashboardShell, Pill } from "@/app/dashboard/dashboard-ui";
import { dashboardWorkspaceVisibility } from "@/app/lib/dashboardWorkspace";
import {
  cityName,
  getDashboardContext,
  managedCities,
  providerRoleLabel,
} from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";

type DashboardCounts = {
  providerChanges?: number;
  listings?: number;
  publicListings?: number;
};

const dashboardCountsQuery = `{
  "providerChanges": count(*[_type == "providerChangeLog" && changedAt > dateTime(now()) - 60*60*24*7]),
  "listings": count(*[_type == "propertyListing" && ($isAdmin || linkedRealtor._ref == $providerId)]),
  "publicListings": count(*[_type == "propertyListing" && ($isAdmin || linkedRealtor._ref == $providerId) && status in ["available","reserved","sold","rented"]])
}`;

export const metadata: Metadata = { title: "Provider Dashboard" };

function Panel({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5">
      {eyebrow ? <p className="text-xs uppercase tracking-widest text-[#d6a85a]">{eyebrow}</p> : null}
      <h2 className={eyebrow ? "mt-1 text-lg font-medium text-white" : "text-lg font-medium text-white"}>{title}</h2>
      <div className="mt-3 divide-y divide-white/10">{children}</div>
    </section>
  );
}
function ActionRow({
  title,
  detail,
  href,
  count,
}: {
  title: string;
  detail?: string;
  href?: string;
  count?: number | string;
}) {
  const content = (
    <>
      <div className="min-w-0">
        <p className="font-medium text-white">{title}</p>
        {detail ? <p className="mt-0.5 text-sm text-stone-400">{detail}</p> : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {count !== undefined ? <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-stone-200">{count}</span> : null}
        {href ? <span aria-hidden className="text-[#d6a85a]">→</span> : null}
      </div>
    </>
  );

  return href ? (
    <Link href={href} className="flex min-h-11 items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">{content}</Link>
  ) : (
    <div className="flex min-h-11 items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">{content}</div>
  );
}

function publicProfilePath(slug?: string) {
  return slug ? `/providers/${slug}` : undefined;
}

export default async function DashboardPage() {
  const context = await getDashboardContext();
  const { user, provider, signedInEmail, isAdmin, providerEdit } = context;
  const workspace = dashboardWorkspaceVisibility(provider, isAdmin);
  const cities = managedCities(provider);
  const providerSlug = provider?.slug?.current;
  const counts = await client.fetch<DashboardCounts>(dashboardCountsQuery, {
    isAdmin,
    providerId: provider?._id || "",
  });
  const roles = Array.from(
    new Set([provider?.primaryRole, ...(provider?.roles || [])].filter(Boolean)),
  ) as string[];
  const publicListings = counts.publicListings || 0;
  const unavailableListings = Math.max(0, (counts.listings || 0) - publicListings);

  return (
    <DashboardShell
      eyebrow="Provider dashboard"
      title={`Welcome${user.firstName ? `, ${user.firstName}` : ""}`}
      intro="Your workspaces and actions are based on the roles and permissions connected to this account."
      side={
        <section className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-white">{provider?.name || user.fullName || "Signed-in account"}</p>
              <p className="mt-1 text-sm text-stone-400">{signedInEmail || user.id}</p>
            </div>
            {providerSlug ? (
              <Link href={publicProfilePath(providerSlug) || "#"} className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-3 py-2 text-sm text-[#d6a85a]">
                Public profile
              </Link>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {isAdmin ? <Pill>Administrator</Pill> : null}
            {roles.map((role) => <Pill key={role}>{providerRoleLabel(role)}</Pill>)}
            {provider?.status ? <Pill>{provider.status}</Pill> : null}
            {cities.map((city) => <Pill key={city._id || city.slug?.current}>{cityName(city)}</Pill>)}
          </div>
        </section>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {workspace.provider ? (
          <Panel title="My Provider profile" eyebrow="Profile">
            <ActionRow
              title="Edit my profile"
              detail={providerEdit.canEdit ? "Publish allowed profile fields" : "Self-editing is not enabled"}
              href={providerEdit.canEdit ? "/account/profile/edit" : undefined}
            />
            <ActionRow title="View public profile" detail={provider?.status || "Not published"} href={publicProfilePath(providerSlug)} />
            <ActionRow title="Languages" detail={`${provider?.ownership?.selfEditableFields?.includes("languages") ? "Editable" : "Shown on your public profile"}`} />
            <ActionRow title="Cities served" detail={provider?.cities?.length ? provider.cities.map(cityName).join(", ") : "No cities listed"} />
            <ActionRow title="Publication status" detail={provider?.status || "Not set"} />
          </Panel>
        ) : null}

        {workspace.cityHost ? (
          <Panel title="City host workspace" eyebrow="Assigned cities">
            {cities.map((city) => {
              const slug = city.slug?.current;
              return (
                <ActionRow
                  key={city._id || slug}
                  title={cityName(city)}
                  detail="Content, places, map tools and recent changes"
                  href={slug ? `/dashboard/cities/${slug}` : undefined}
                />
              );
            })}
            <ActionRow title="Recent city changes" detail="Review your recent city updates" href="/dashboard/cities" />
          </Panel>
        ) : null}

        {workspace.realEstate ? (
          <Panel title="Real-estate workspace" eyebrow="Property listings">
            <ActionRow title="Add property" detail="Create a listing linked to your Provider account" href="/dashboard/properties/new" />
            <ActionRow title="My listings" detail={`${publicListings} public · ${unavailableListings} unavailable`} href="/dashboard/properties" count={counts.listings || 0} />
            {workspace.provider ? <ActionRow title="Edit Provider profile" href={providerEdit.canEdit ? "/account/profile/edit" : undefined} detail={providerEdit.canEdit ? "Update your realtor profile" : "Self-editing is not enabled"} /> : null}
          </Panel>
        ) : null}

        {workspace.admin ? (
          <Panel title="Admin workspace" eyebrow="Administration">
            <ActionRow title="Providers" href="/dashboard/admin/providers" />
            <ActionRow title="Cities" href="/dashboard/admin/cities" />
            <ActionRow title="Properties" href="/dashboard/admin/properties" count={counts.listings || 0} />
            <ActionRow title="Provider changes" detail="Changes in the last 7 days" href="/dashboard/admin/provider-changes" count={counts.providerChanges || 0} />
            <ActionRow title="City change log" href="/dashboard/admin/city-changes" />
            <ActionRow title="Provider approvals" detail="Historical approval records" href="/dashboard/admin/approvals" />
            <ActionRow title="Admin guide" href="/admin-guide" />
            <ActionRow title="Sanity Studio" href="/studio" />
          </Panel>
        ) : null}

        {!provider && !isAdmin ? (
          <Panel title="Account not connected" eyebrow="Setup needed">
            <ActionRow title="Ask an administrator for access" detail="Your signed-in account is not connected to a Provider profile yet." />
            <ActionRow title="Return to the website" href="/" />
          </Panel>
        ) : null}
      </div>

      <section data-dashboard-secondary-account-actions className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
        <Link href="/dashboard/account/security" className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-3 py-2 text-sm text-stone-300 hover:text-white">
          Account settings
        </Link>
        <SignOutButton redirectUrl="/sign-in">
          <button type="button" className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-3 py-2 text-sm text-stone-300 hover:text-white">
            Sign out
          </button>
        </SignOutButton>
      </section>
    </DashboardShell>
  );
}
