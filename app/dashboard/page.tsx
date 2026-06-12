import { SignOutButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import {
  DashboardCard,
  DashboardShell,
  Pill,
  type DashboardCardProps,
} from "@/app/dashboard/dashboard-ui";
import {
  accessLevel,
  cityName,
  getDashboardContext,
  managedCities,
  providerRoleLabel,
} from "@/app/lib/dashboard";

export const metadata: Metadata = {
  title: "Provider Dashboard",
};

export default async function DashboardPage() {
  const { user, provider, signedInEmail, isAdmin, isCityHost } =
    await getDashboardContext();
  const providerSlug = provider?.slug?.current;
  const managedProviderCities = managedCities(provider);
  const providerCards: DashboardCardProps[] = [
    {
      title: "Provider profile",
      text: provider
        ? "Update your public provider profile through the existing draft-and-review workflow."
        : "No provider profile is connected to this signed-in email yet. An admin can connect your account from the provider document.",
      href: provider ? "/account/profile/edit" : undefined,
      action: provider ? "Edit profile draft" : undefined,
      status: provider ? "Available now" : "Needs admin setup",
    },
    {
      title: "Public profile",
      text: providerSlug
        ? "Open the current public version of your provider profile."
        : "A public profile link appears here after your account is matched to a provider document.",
      href: providerSlug ? `/providers/${providerSlug}` : undefined,
      action: providerSlug ? "View public profile" : undefined,
      status: providerSlug ? "Published view" : "Pending",
    },
  ];
  const cityHostCards: DashboardCardProps[] = isCityHost
    ? [
        {
          title: "Managed cities",
          text: `Open city-host tools for ${managedProviderCities.map(cityName).join(", ")}.`,
          href: "/dashboard/cities",
          action: "Manage city tools",
          status: "City host",
        },
        ...managedProviderCities.map((city) => ({
          title: cityName(city),
          text: "Prepare city content, recommendations, map places, and coordinate tools for this city.",
          href: `/dashboard/cities/${city.slug?.current}`,
          action: "Open city dashboard",
          status: "Assigned city",
        })),
      ]
    : [];
  const adminCards: DashboardCardProps[] = isAdmin
    ? [
        {
          title: "Admin Dashboard",
          text: "Global management entry point for cities, providers, properties, and map health.",
          href: "/dashboard/admin",
          action: "Open admin",
          status: "Admin",
        },
        {
          title: "City Management",
          text: "Review city documents, publication status, and future city dashboard links.",
          href: "/dashboard/admin/cities",
          action: "Manage cities",
          status: "Admin",
        },
        {
          title: "Provider Management",
          text: "Review provider ownership, roles, status, and public profile links.",
          href: "/dashboard/admin/providers",
          action: "Manage providers",
          status: "Admin",
        },
        {
          title: "Property Management",
          text: "Review property listing status, city assignment, and coordinate readiness.",
          href: "/dashboard/admin/properties",
          action: "Manage properties",
          status: "Admin",
        },
        {
          title: "Approval Center",
          text: "Review pending provider profile changes and approve or reject them without opening Studio.",
          href: "/dashboard/admin/approvals",
          action: "Open approvals",
          status: "Admin",
        },
        {
          title: "Map health",
          text: "Find cities with missing coordinates and map data that needs attention.",
          href: "/dashboard/admin/map",
          action: "Check map health",
          status: "Admin",
        },
        {
          title: "Sanity Studio",
          text: "Open the underlying content studio while dashboard editing tools are still being built.",
          href: "/studio",
          action: "Open Studio",
          status: "Admin",
        },
      ]
    : [];

  return (
    <DashboardShell
      eyebrow="Provider dashboard"
      title="Private workspace"
      intro="A single entry point for providers, city hosts, and admins. The cards below are generated from the signed-in account and its connected Sanity provider profile."
      side={
        <section className="rounded-2xl border border-white/10 bg-white/10 p-5">
          <p className="text-xs uppercase tracking-widest text-stone-400">
            Signed in
          </p>
          <p className="mt-2 text-lg text-white">{signedInEmail || user.id}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {isAdmin ? (
              <span className="rounded-full border border-[#d6a85a] bg-[#d6a85a] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#1a1f2e]">
                ADMIN
              </span>
            ) : null}
            <Pill>{accessLevel(provider, isAdmin)}</Pill>
            {provider?.status ? <Pill>{provider.status}</Pill> : null}
            {provider?.primaryRole ? (
              <Pill>{providerRoleLabel(provider.primaryRole)}</Pill>
            ) : null}
          </div>

          <SignOutButton redirectUrl="/sign-in">
            <button
              type="button"
              className="mt-5 inline-flex rounded-lg border border-white/15 px-4 py-3 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
            >
              Sign out
            </button>
          </SignOutButton>
        </section>
      }
    >
      {provider?.name ? (
        <section className="mb-8 rounded-2xl border border-white/10 bg-white/10 p-6">
          <p className="text-xs uppercase tracking-widest text-stone-400">
            Matched provider
          </p>
          <h2 className="mt-3 text-2xl font-light text-white">{provider.name}</h2>
          <p className="mt-3 leading-relaxed text-stone-300">
            This match uses the provider document ownership fields: owner user id
            first, then contact email.
          </p>
        </section>
      ) : null}

      <section className="mb-10">
        <h2 className="mb-5 text-2xl font-light text-white">Provider tools</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {providerCards.map((card) => (
            <DashboardCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      {cityHostCards.length > 0 ? (
        <section className="mb-10">
          <h2 className="mb-5 text-2xl font-light text-white">Managed city tools</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {cityHostCards.map((card) => (
              <DashboardCard key={card.title} {...card} />
            ))}
          </div>
        </section>
      ) : null}

      {adminCards.length > 0 ? (
        <section>
          <h2 className="mb-5 text-2xl font-light text-white">Admin tools</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {adminCards.map((card) => (
              <DashboardCard key={card.title} {...card} />
            ))}
          </div>
        </section>
      ) : null}

      {!provider && !isAdmin ? (
        <section className="mt-10 rounded-2xl border border-white/10 bg-white/10 p-6">
          <h2 className="text-xl font-medium text-white">Need access?</h2>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            Ask an admin to connect this Clerk account to a Sanity provider using
            the owner user id or contact email fields.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg border border-white/15 px-4 py-3 text-sm text-white transition hover:border-[#d6a85a] hover:text-[#d6a85a]"
          >
            Return home
          </Link>
        </section>
      ) : null}
    </DashboardShell>
  );
}
