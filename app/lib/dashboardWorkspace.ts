type WorkspaceProvider = {
  roles?: string[];
  primaryRole?: string;
  managedCities?: unknown[];
};

export function dashboardWorkspaceVisibility(
  provider: WorkspaceProvider | null | undefined,
  isAdmin: boolean,
) {
  const roles = new Set(provider?.roles || []);
  if (provider?.primaryRole) roles.add(provider.primaryRole);

  return {
    admin: isAdmin,
    provider: Boolean(provider),
    interpreter: Boolean(provider) && roles.has("interpreter"),
    cityHost: Boolean(provider?.managedCities?.length),
    realEstate: isAdmin || roles.has("realtor"),
  };
}
