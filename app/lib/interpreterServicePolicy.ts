export type InterpreterServiceProvider = {
  roles?: string[];
  primaryRole?: string;
  cities?: Array<{ slug?: { current?: string } }>;
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
}: {
  provider: InterpreterServiceProvider | null | undefined;
  isAdmin: boolean;
  citySlug?: string;
}) {
  if (isAdmin) return true;
  if (!citySlug || !hasInterpreterRole(provider)) return false;

  return Boolean(
    provider?.cities?.some((city) => city.slug?.current === citySlug),
  );
}
