import { currentUser, type User } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";

export type DashboardCity = {
  _id?: string;
  name_en?: string;
  name_pt?: string;
  name_nl?: string;
  slug?: {
    current?: string;
  };
  guideStatus?: string;
  country?: string;
};

export type DashboardProvider = {
  _id: string;
  name?: string;
  slug?: {
    current?: string;
  };
  status?: string;
  roles?: string[];
  primaryRole?: string;
  cities?: DashboardCity[];
  managedCities?: DashboardCity[];
  ownership?: {
    contactEmail?: string;
    ownerUserId?: string;
    ownershipStatus?: string;
    selfEditEnabled?: boolean;
  };
};

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
      ownership.ownerUserId == $userId ||
      lower(ownership.contactEmail) in $emails
    )
  ][0]{
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
      country
    },
    managedCities[]->{
      _id,
      name_en,
      name_pt,
      name_nl,
      slug,
      guideStatus,
      country
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
    country
  }
`;

function metadataValues(metadata: User["publicMetadata"]) {
  const data = metadata as Record<string, unknown>;
  const roles = Array.isArray(data.roles) ? data.roles : [];
  const permissions = Array.isArray(data.permissions) ? data.permissions : [];

  return {
    role: typeof data.role === "string" ? data.role : "",
    roles: roles.filter((role): role is string => typeof role === "string"),
    permissions: permissions.filter(
      (permission): permission is string => typeof permission === "string",
    ),
  };
}

const bootstrapAdminEmails = ["armijn@homeinthe.city"];

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

export function recognizedAdminEmails() {
  return Array.from(
    new Set([...bootstrapAdminEmails, ...configuredAdminEmails()]),
  );
}

export function adminStatusForUser(user: User, emails: string[]) {
  const { role, roles, permissions } = metadataValues(user.publicMetadata);

  if (role === "admin") return { isAdmin: true, reason: "Clerk publicMetadata.role" };
  if (roles.includes("admin")) {
    return { isAdmin: true, reason: "Clerk publicMetadata.roles" };
  }
  if (permissions.includes("admin") || permissions.includes("dashboard:admin")) {
    return { isAdmin: true, reason: "Clerk publicMetadata.permissions" };
  }

  const matchedEmail = emails.find((email) =>
    recognizedAdminEmails().includes(email.toLowerCase()),
  );

  if (matchedEmail) {
    return { isAdmin: true, reason: `dashboard admin email: ${matchedEmail}` };
  }

  return { isAdmin: false, reason: "none" };
}

export function isAdminUser(user: User, emails: string[] = []) {
  return adminStatusForUser(user, emails).isAdmin;
}

export function cityName(city: DashboardCity | null | undefined) {
  return city?.name_en || city?.name_pt || city?.name_nl || "Untitled city";
}

export function providerRoleLabel(role?: string) {
  const labels: Record<string, string> = {
    host: "City host",
    interpreter: "Interpreter",
    translator: "Translator",
    guide: "Guide",
    specialist: "Specialist",
    realtor: "Real estate agent",
  };

  return role ? labels[role] || role : "Provider";
}

export function hasHostRole(provider: DashboardProvider | null | undefined) {
  return provider?.roles?.includes("host") || provider?.primaryRole === "host";
}

export function managedCities(provider: DashboardProvider | null | undefined) {
  return provider?.managedCities?.filter((city) => city.slug?.current) || [];
}

export function isManagedCity(
  provider: DashboardProvider | null | undefined,
  citySlug: string,
) {
  return Boolean(
    managedCities(provider).some((city) => city.slug?.current === citySlug),
  );
}

export function accessLevel(provider: DashboardProvider | null, isAdmin: boolean) {
  if (isAdmin) return "Admin";
  if (managedCities(provider).length) return "City host";
  if (provider) return "Provider";
  return "Unmatched account";
}

export async function getDashboardContext(returnTo = "/dashboard") {
  const user = await currentUser({ treatPendingAsSignedOut: false });

  if (!user?.id) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent(returnTo)}`);
  }

  const emails = user.emailAddresses
    .map((email) => email.emailAddress.toLowerCase())
    .filter(Boolean);
  const signedInEmail = user.primaryEmailAddress?.emailAddress || emails[0] || "";
  const provider = await client.fetch<DashboardProvider | null>(
    matchedProviderForDashboardQuery,
    {
      userId: user.id,
      emails,
    },
  );
  const adminStatus = adminStatusForUser(user, emails);

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
