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
    contactEmail?: string;
    ownerUserId?: string;
    ownershipStatus?: string;
    selfEditEnabled?: boolean;
    selfEditableFields?: string[];
  };
};

export const providerSelfEditableFields = [
  "name",
  "cities",
  "languages",
  "headlines",
  "intro",
  "about",
  "contactOptions",
  "mainPhoto",
] as const;

export const providerAdministratorOnlyFields = [
  "roles",
  "primaryRole",
  "verificationStatus",
  "managedCities",
  "ownership",
  "ownership.contactEmail",
  "status",
  "selfEditEnabled",
  "selfEditableFields",
] as const;

export type ProviderSelfEditableField = (typeof providerSelfEditableFields)[number];

export type ProviderEditCapability = {
  canEdit: boolean;
  identityMatch: "admin" | "ownerUserId" | "verifiedEmail" | "none";
  reason:
    | "admin"
    | "owner-user-id"
    | "verified-email-reconnection"
    | "no-provider"
    | "unrelated-user"
    | "self-edit-disabled"
    | "no-editable-fields";
  editableFields: ProviderSelfEditableField[];
  shouldBindOwnerUserId: boolean;
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

export function adminStatusForIdentity(user: ClerkIdentity, configuredEmails: string[]) {
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
    providers.find((provider) => provider.ownership?.ownerUserId === userId) ||
    providers.find((provider) => reconnectableOwnerUserId(provider.ownership?.ownerUserId)) ||
    null
  );
}

function normalizedProviderEditableFields(fields?: string[]) {
  const configured = new Set(fields || []);
  return providerSelfEditableFields.filter((field) => configured.has(field));
}

function verifiedEmailMatchesProvider(provider: ProviderWithOwnership, verifiedEmails: string[]) {
  const contactEmail = provider.ownership?.contactEmail?.trim().toLowerCase();
  return Boolean(contactEmail && verifiedEmails.includes(contactEmail));
}

export function providerEditCapability({
  provider,
  userId,
  verifiedEmails,
  isAdmin,
}: {
  provider: ProviderWithOwnership | null;
  userId: string;
  verifiedEmails: string[];
  isAdmin: boolean;
}): ProviderEditCapability {
  if (!provider) {
    return {
      canEdit: false,
      identityMatch: "none",
      reason: "no-provider",
      editableFields: [],
      shouldBindOwnerUserId: false,
    };
  }

  if (isAdmin) {
    const shouldBindOwnerUserId =
      reconnectableOwnerUserId(provider.ownership?.ownerUserId) &&
      verifiedEmailMatchesProvider(provider, verifiedEmails);

    return {
      canEdit: true,
      identityMatch: "admin",
      reason: "admin",
      editableFields: [...providerSelfEditableFields],
      shouldBindOwnerUserId,
    };
  }

  const ownerUserId = provider.ownership?.ownerUserId;
  const ownerMatches = ownerUserId === userId;
  const emailReconnects =
    reconnectableOwnerUserId(ownerUserId) && verifiedEmailMatchesProvider(provider, verifiedEmails);

  if (!ownerMatches && !emailReconnects) {
    return {
      canEdit: false,
      identityMatch: "none",
      reason: "unrelated-user",
      editableFields: [],
      shouldBindOwnerUserId: false,
    };
  }

  const identityMatch = ownerMatches ? "ownerUserId" : "verifiedEmail";
  const shouldBindOwnerUserId = identityMatch === "verifiedEmail";

  if (provider.ownership?.selfEditEnabled !== true) {
    return {
      canEdit: false,
      identityMatch,
      reason: "self-edit-disabled",
      editableFields: [],
      shouldBindOwnerUserId,
    };
  }

  const editableFields = normalizedProviderEditableFields(provider.ownership?.selfEditableFields);

  if (!editableFields.length) {
    return {
      canEdit: false,
      identityMatch,
      reason: "no-editable-fields",
      editableFields: [],
      shouldBindOwnerUserId,
    };
  }

  return {
    canEdit: true,
    identityMatch,
    reason: ownerMatches ? "owner-user-id" : "verified-email-reconnection",
    editableFields,
    shouldBindOwnerUserId,
  };
}

export function canEditProviderField(
  capability: ProviderEditCapability,
  field: ProviderSelfEditableField,
) {
  return capability.canEdit && capability.editableFields.includes(field);
}

const snapshotFieldGroups: Record<string, ProviderSelfEditableField> = {
  name: "name",
  cities: "cities",
  languages: "languages",
  headline_en: "headlines",
  headline_pt: "headlines",
  headline_nl: "headlines",
  intro_en: "intro",
  intro_pt: "intro",
  intro_nl: "intro",
  about_en: "about",
  about_pt: "about",
  about_nl: "about",
  contactOptions: "contactOptions",
  mainPhoto: "mainPhoto",
};

export function enforceProviderEditableFields(
  snapshot: Record<string, unknown>,
  capability: ProviderEditCapability,
) {
  return Object.fromEntries(
    Object.entries(snapshot).filter(([field]) => {
      const group = snapshotFieldGroups[field];
      return group ? canEditProviderField(capability, group) : false;
    }),
  );
}

function formFieldGroup(field: string): ProviderSelfEditableField | null {
  if (field === "name") return "name";
  if (field === "cities") return "cities";
  if (field.startsWith("language-")) return "languages";
  if (field.startsWith("headline_")) return "headlines";
  if (field.startsWith("intro_")) return "intro";
  if (field.startsWith("about_")) return "about";
  if (field.startsWith("contact-")) return "contactOptions";
  if (field === "profile-photo" || field === "main-photo-alt") {
    return "mainPhoto";
  }
  return null;
}

export function disallowedProviderSelfEditFormFields(
  formFields: string[],
  capability: ProviderEditCapability,
) {
  return Array.from(
    new Set(
      formFields.filter((field) => {
        const group = formFieldGroup(field);
        return !group || !canEditProviderField(capability, group);
      }),
    ),
  );
}

function comparableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(comparableValue);

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key, entry]) =>
          key !== "_key" && key !== "_type" && entry !== undefined,
        )
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, comparableValue(entry)]),
    );
  }

  return value;
}

export type ProviderFieldChange = {
  field: string;
  beforeValue: unknown;
  afterValue: unknown;
};

export function changedProviderFields(
  provider: Record<string, unknown>,
  candidate: Record<string, unknown>,
): ProviderFieldChange[] {
  return Object.entries(candidate).flatMap(([field, afterValue]) => {
    const beforeValue = provider[field];
    const beforeComparable = JSON.stringify(comparableValue(beforeValue));
    const afterComparable = JSON.stringify(comparableValue(afterValue));

    return beforeComparable === afterComparable
      ? []
      : [{ field, beforeValue, afterValue }];
  });
}

export function providerPatchFromChanges(changes: ProviderFieldChange[]) {
  return Object.fromEntries(
    changes.map(({ field, afterValue }) => [field, afterValue]),
  );
}

export function providerSelfEditRevisionStatus(
  submittedRevision: string,
  currentRevision: string,
) {
  return submittedRevision === currentRevision ? "current" : "stale";
}
