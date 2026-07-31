import "server-only";

import type { User } from "@clerk/nextjs/server";

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

export function verifiedEmailAddresses(user: Pick<User, "emailAddresses">) {
  return Array.from(
    new Set(
      user.emailAddresses
        .filter((email) => email.verification?.status === "verified")
        .map((email) => email.emailAddress.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

export function verifiedPrimaryEmailAddress(
  user: Pick<User, "emailAddresses" | "primaryEmailAddress">,
) {
  const primaryEmail = user.primaryEmailAddress;

  if (primaryEmail?.verification?.status === "verified") {
    return primaryEmail.emailAddress.trim().toLowerCase();
  }

  return verifiedEmailAddresses(user)[0] || "";
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
