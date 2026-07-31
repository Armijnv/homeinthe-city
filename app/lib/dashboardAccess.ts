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
  enabledLanguages?: string[];
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
