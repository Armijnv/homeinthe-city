type ClerkEmailAddress = {
  emailAddress: string;
  verification?: {
    status?: string | null;
  } | null;
};

type ClerkIdentity = {
  emailAddresses: ClerkEmailAddress[];
  primaryEmailAddress?: ClerkEmailAddress | null;
  publicMetadata?: unknown;
};

type ProviderWithOwnership = {
  ownership?: {
    ownerUserId?: string;
  };
};

export const providerOwnershipMatchFilter = `
  ownership.ownerUserId == $userId ||
  (
    lower(ownership.contactEmail) in $emails &&
    (
      !defined(ownership.ownerUserId) ||
      ownership.ownerUserId == "" ||
      ownership.ownerUserId match "legacy:*"
    )
  )
`;

export function verifiedEmailAddresses(user: ClerkIdentity) {
  return Array.from(
    new Set(
      user.emailAddresses
        .filter((email) => email.verification?.status === "verified")
        .map((email) => email.emailAddress.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

export function verifiedPrimaryEmailAddress(user: ClerkIdentity) {
  const primaryEmail = user.primaryEmailAddress;

  if (primaryEmail?.verification?.status === "verified") {
    return primaryEmail.emailAddress.trim().toLowerCase();
  }

  return verifiedEmailAddresses(user)[0] || "";
}

function metadataValues(publicMetadata: unknown) {
  const data = (publicMetadata || {}) as Record<string, unknown>;
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

export function adminStatusForIdentity(
  user: ClerkIdentity,
  configuredEmails: string[],
) {
  const { role, roles, permissions } = metadataValues(user.publicMetadata);

  if (role === "admin") return { isAdmin: true, reason: "Clerk publicMetadata.role" };
  if (roles.includes("admin")) {
    return { isAdmin: true, reason: "Clerk publicMetadata.roles" };
  }
  if (permissions.includes("admin") || permissions.includes("dashboard:admin")) {
    return { isAdmin: true, reason: "Clerk publicMetadata.permissions" };
  }

  const matchedEmail = verifiedEmailAddresses(user).find((email) =>
    configuredEmails.includes(email),
  );

  if (matchedEmail) {
    return { isAdmin: true, reason: `dashboard admin email: ${matchedEmail}` };
  }

  return { isAdmin: false, reason: "none" };
}

export function reconnectableOwnerUserId(ownerUserId?: string) {
  return !ownerUserId || ownerUserId.startsWith("legacy:");
}

export function selectProviderForUser<T extends ProviderWithOwnership>(
  providers: T[],
  userId: string,
) {
  return (
    providers.find(
      (provider) => provider.ownership?.ownerUserId === userId,
    ) ||
    providers.find((provider) =>
      reconnectableOwnerUserId(provider.ownership?.ownerUserId),
    ) ||
    null
  );
}

export function effectiveOwnerUserId(
  ownerUserId: string | undefined,
  currentUserId: string,
): string {
  if (reconnectableOwnerUserId(ownerUserId)) return currentUserId;
  return ownerUserId || currentUserId;
}
