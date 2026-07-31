import { currentUser, type User } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import {
  adminStatusForIdentity,
  providerOwnershipMatchFilter,
  selectProviderForUser,
  verifiedEmailAddresses,
  verifiedPrimaryEmailAddress,
} from "@/app/lib/clerkIdentity";
import {
  isManagedCity,
  managedCities,
  type DashboardCity,
  type DashboardProvider,
} from "@/app/lib/dashboardAccess";
import { client } from "@/sanity/lib/client";

export {
  accessLevel,
  cityName,
  hasHostRole,
  isManagedCity,
  managedCities,
  providerRoleLabel,
  type DashboardCity,
  type DashboardProvider,
} from "@/app/lib/dashboardAccess";

export type DashboardContext = {
  user: User;
  provider: DashboardProvider | null;
  emails: string[];
  signedInEmail: string;
  isAdmin: boolean;
  adminReason: string;
  isCityHost: boolean;
};

export const matchedProviderForDashboardQuery = `
  *[
    _type == "provider" &&
    (
      ${providerOwnershipMatchFilter}
    )
  ]{
    _id,
    name,
    slug,
    status,
    roles,
    primaryRole,
    cities[]->{
      _id,
      name_en,
      name_pt,
      name_nl,
      slug,
      guideStatus,
      country,
      enabledLanguages
    },
    managedCities[]->{
      _id,
      name_en,
      name_pt,
      name_nl,
      slug,
      guideStatus,
      country,
      enabledLanguages
    },
    ownership{
      contactEmail,
      ownerUserId,
      ownershipStatus,
      selfEditEnabled
    }
  }
`;

export const cityForDashboardQuery = `
  *[_type == "city" && slug.current == $citySlug][0]{
    _id,
    name_en,
    name_pt,
    name_nl,
    slug,
    guideStatus,
    country,
    enabledLanguages
  }
`;

export function configuredAdminEmails() {
  const raw = [
    process.env.DASHBOARD_ADMIN_EMAILS,
    process.env.ADMIN_EMAILS,
  ]
    .filter(Boolean)
    .join(",");

  return Array.from(
    new Set(
      raw
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

export function adminStatusForUser(user: User) {
  return adminStatusForIdentity(user, configuredAdminEmails());
}

export function isAdminUser(user: User) {
  return adminStatusForUser(user).isAdmin;
}

export async function getDashboardContext(returnTo = "/dashboard") {
  const user = await currentUser();

  if (!user?.id) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`);
  }

  const emails = verifiedEmailAddresses(user);
  const signedInEmail = verifiedPrimaryEmailAddress(user);
  const providerMatches = await client.fetch<DashboardProvider[]>(
    matchedProviderForDashboardQuery,
    {
      userId: user.id,
      emails,
    },
  );
  const provider = selectProviderForUser(providerMatches, user.id);
  const adminStatus = adminStatusForUser(user);

  return {
    user,
    provider,
    emails,
    signedInEmail,
    isAdmin: adminStatus.isAdmin,
    adminReason: adminStatus.reason,
    isCityHost: managedCities(provider).length > 0,
  } satisfies DashboardContext;
}

export async function requireAdmin(returnTo = "/dashboard/admin") {
  const context = await getDashboardContext(returnTo);

  if (!context.isAdmin) {
    notFound();
  }

  return context;
}

export async function requireCityHost(citySlug: string) {
  const context = await getDashboardContext(`/dashboard/cities/${citySlug}`);
  const city = await client.fetch<DashboardCity | null>(cityForDashboardQuery, {
    citySlug,
  });

  if (!city) {
    notFound();
  }

  if (
    !context.isAdmin &&
    (!context.isCityHost || !isManagedCity(context.provider, citySlug))
  ) {
    notFound();
  }

  return { ...context, city };
}
