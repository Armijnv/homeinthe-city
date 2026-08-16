export type InterpreterServiceProvider = {
  _id?: string;
  roles?: string[];
  primaryRole?: string;
  cities?: Array<{ slug?: { current?: string } }>;
  managedCities?: Array<{ slug?: { current?: string } }>;
};

export function hasInterpreterRole(
  provider: InterpreterServiceProvider | null | undefined,
) {
  return Boolean(
    provider &&
      (provider.primaryRole === "interpreter" ||
        provider.roles?.includes("interpreter")),
  );
}

export function canEditInterpreterServicePage({
  provider,
  isAdmin,
  citySlug,
  primaryHostId,
}: {
  provider: InterpreterServiceProvider | null | undefined;
  isAdmin: boolean;
  citySlug?: string;
  primaryHostId?: string;
}) {
  if (isAdmin) return true;
  if (!citySlug || !hasInterpreterRole(provider)) return false;

  return Boolean(
    provider?.managedCities?.some((city) => city.slug?.current === citySlug) ||
      (primaryHostId && provider?._id === primaryHostId),
  );
}
