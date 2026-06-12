export type ProviderSubmissionPatch = Record<string, unknown>;

export const allowedProfileSnapshotFields = [
  "name",
  "slug",
  "roles",
  "primaryRole",
  "cities",
  "languages",
  "headline_en",
  "headline_pt",
  "headline_nl",
  "intro_en",
  "intro_pt",
  "intro_nl",
  "about_en",
  "about_pt",
  "about_nl",
  "contactOptions",
  "mainPhoto",
] as const;

export function publishedId(id?: string) {
  return id?.replace(/^drafts\./, "");
}

function definedOnly(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(definedOnly);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([entryKey, entryValue]) => [entryKey, definedOnly(entryValue)]),
    );
  }

  return value;
}

export function providerPatchFromSnapshot(
  snapshot?: Record<string, unknown>,
): ProviderSubmissionPatch | null {
  if (!snapshot) return null;

  const providerPatch: ProviderSubmissionPatch = {};

  allowedProfileSnapshotFields.forEach((fieldName) => {
    if (Object.hasOwn(snapshot, fieldName)) {
      providerPatch[fieldName] = definedOnly(snapshot[fieldName]);
    }
  });

  return Object.keys(providerPatch).length ? providerPatch : null;
}

export function changedSnapshotFields(snapshot?: Record<string, unknown>) {
  if (!snapshot) return [];

  return allowedProfileSnapshotFields.filter((fieldName) =>
    Object.hasOwn(snapshot, fieldName),
  );
}
