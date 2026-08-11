import { SignOutButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import {
  DashboardPanel,
  DashboardShell,
  Pill,
  WorkspaceLink,
} from "@/app/dashboard/dashboard-ui";
import { dashboardWorkspaceVisibility } from "@/app/lib/dashboardWorkspace";
import {
  cityName,
  getDashboardContext,
  managedCities,
  providerRoleLabel,
} from "@/app/lib/dashboard";

export const metadata: Metadata = { title: "Provider Dashboard" };

function publicProfilePath(slug?: string) {
  return slug ? `/providers/${slug}` : undefined;
}

export default async function DashboardPage() {
  const context = await getDashboardContext();
  const { user, provider, signedInEmail, isAdmin } = context;
  const workspace = dashboardWorkspaceVisibility(provider, isAdmin);
  const cities = managedCities(provider);
  const providerSlug = provider?.slug?.current;
  const roles = Array.from(
    new Set([provider?.primaryRole, ...(provider?.roles || [])].filter(Boolean)),
  ) as string[];
  const workspaceRoles = new Set<string>();

  if (workspace.interpreter) workspaceRoles.add("interpreter");
  if (workspace.cityHost) workspaceRoles.add("host");
  if (workspace.realEstate && roles.includes("realtor")) {
    workspaceRoles.add("realtor");
  }

  const statusRoles = roles.filter((role) => !workspaceRoles.has(role));
  const hasStatusBadges = Boolean(
    provider?.status ||
      provider?.ownership?.ownershipStatus ||
      statusRoles.length ||
      cities.length,
  );

  return (
    <DashboardShell
      eyebrow="Provider dashboard"
      title={`Welcome${user.firstName ? `, ${user.firstName}` : ""}`}
      intro="Choose a workspace to open the tools available to this account."
      side={
        <section className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-white">
                {provider?.name || user.fullName || "Signed-in account"}
              </p>
              <p className="mt-1 text-sm text-stone-400">
                {signedInEmail || user.id}
              </p>
            </div>
            {providerSlug ? (
              <Link
                href={publicProfilePath(providerSlug) || "#"}
                className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-3 py-2 text-sm text-[#d6a85a]"
              >
                Public profile
              </Link>
            ) : null}
          </div>
        </section>
      }
    >
      <section className="mb-5">
        <h2 className="mb-4 text-xl font-light text-white">
          Choose your workspace
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {workspace.admin ? (
            <WorkspaceLink
              icon="🏛"
              title="Administrator"
              text="Providers, cities, properties, approvals, changes, and Studio."
              href="/dashboard/admin"
            />
          ) : null}
          {workspace.provider ? (
            <WorkspaceLink
              icon="🌍"
              title={workspace.interpreter ? "Interpreter" : "Provider profile"}
              text={workspace.interpreter
                ? "Edit your profile and assigned city interpreter service pages."
                : "Edit your profile and review its public languages and city coverage."}
              href="/dashboard/provider"
            />
          ) : null}
          {workspace.cityHost ? (
            <WorkspaceLink
              icon="🏙"
              title="City Host"
              text="Assigned cities, public guides, recommendations, maps, and coordinates."
              href="/dashboard/cities"
            />
          ) : null}
          {workspace.realEstate ? (
            <WorkspaceLink
              icon="🏠"
              title="Real Estate"
              text="Property listings, new properties, and realtor profile tools."
              href="/dashboard/properties"
            />
          ) : null}
        </div>
      </section>

      <DashboardPanel title="Profile and status" eyebrow="Account">
        <div className="py-3 first:pt-0 last:pb-0">
          {hasStatusBadges ? (
            <div className="flex flex-wrap gap-2">
              {provider?.status ? <Pill>{provider.status}</Pill> : null}
              {provider?.ownership?.ownershipStatus ? (
                <Pill>{provider.ownership.ownershipStatus}</Pill>
              ) : null}
              {statusRoles.map((role) => (
                <Pill key={role}>{providerRoleLabel(role)}</Pill>
              ))}
              {cities.map((city) => (
                <Pill key={city._id || city.slug?.current}>{cityName(city)}</Pill>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-stone-400">
                No provider profile is connected. Ask an administrator to connect
                this account if you need workspace access.
              </p>
              <Link href="/" className="text-sm text-[#d6a85a] hover:text-white">
                Return to the website
              </Link>
            </div>
          )}
        </div>
      </DashboardPanel>

      <section
        data-dashboard-secondary-account-actions
        className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4"
      >
        <Link
          href="/dashboard/account/security"
          className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-3 py-2 text-sm text-stone-300 hover:text-white"
        >
          Account settings
        </Link>
        <SignOutButton redirectUrl="/sign-in">
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-lg border border-white/15 px-3 py-2 text-sm text-stone-300 hover:text-white"
          >
            Sign out
          </button>
        </SignOutButton>
      </section>
    </DashboardShell>
  );
}
