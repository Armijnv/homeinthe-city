"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import {
  canEditProviderField,
  changedProviderFields,
  disallowedProviderSelfEditFormFields,
  enforceProviderEditableFields,
  providerPatchFromChanges,
  providerSelfEditRevisionStatus,
  type ProviderEditCapability,
  type ProviderFieldChange,
} from "@/app/lib/clerkIdentity";
import { requireProviderSelfEdit } from "@/app/lib/dashboard";
import { providerChangeLogDocument } from "@/app/lib/providerChangeLog";
import { client } from "@/sanity/lib/client";
import { assertSanityWriteToken, writeClient } from "@/sanity/lib/writeClient";

type ProviderRecord = {
  _id: string;
  _rev: string;
  name?: string;
  slug?: {
    current?: string;
  };
  headline_en?: string;
  headline_pt?: string;
  headline_nl?: string;
  intro_en?: string;
  intro_pt?: string;
  intro_nl?: string;
  about_en?: string;
  about_pt?: string;
  about_nl?: string;
  contactOptions?: Record<string, unknown>;
  cities?: Array<{
    _type?: "reference";
    _key?: string;
    _ref?: string;
  }>;
  languages?: Array<Record<string, unknown>>;
  mainPhoto?: {
    _type?: "image";
    alt?: string;
    asset?: {
      _type?: "reference";
      _ref?: string;
    };
  };
  ownership?: {
    contactEmail?: string;
    ownerUserId?: string;
    ownershipStatus?: string;
  };
};

class ProfileWorkflowError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProfileWorkflowError";
  }
}

const providerForSelfEditQuery = `
  *[_type == "provider" && _id == $providerId][0]{
    _id,
    _rev,
    name,
    slug,
    headline_en,
    headline_pt,
    headline_nl,
    intro_en,
    intro_pt,
    intro_nl,
    about_en,
    about_pt,
    about_nl,
    contactOptions,
    cities[]{_type, _key, _ref},
    languages,
    mainPhoto{
      _type,
      alt,
      asset
    },
    ownership{
      contactEmail,
      ownerUserId,
      ownershipStatus
    }
  }
`;

const editableLanguageCodes = ["en", "pt", "nl"] as const;
const editableLanguages = [
  "language-0",
  "language-1",
  "language-2",
  "language-3",
  "language-4",
];
const maxProfilePhotoSize = 10 * 1024 * 1024;

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function optionalValue(formData: FormData, key: string) {
  const nextValue = value(formData, key);
  return nextValue || undefined;
}

function selectedValues(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function keyFromValue(nextValue: string, fallback: string) {
  return nextValue.toLowerCase().replace(/[^a-z0-9_-]+/g, "-") || fallback;
}

function definedOnly(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(definedOnly);

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, definedOnly(entryValue)]),
    );
  }

  return value;
}

async function uploadedProfilePhotoAsset(formData: FormData) {
  const entry = formData.get("profile-photo");

  if (!(entry instanceof File) || entry.size === 0) return null;

  if (!entry.type.startsWith("image/")) {
    throw new ProfileWorkflowError("Profile photo must be an image file.");
  }

  if (entry.size > maxProfilePhotoSize) {
    throw new ProfileWorkflowError("Profile photo must be smaller than 10 MB.");
  }

  const asset = await writeClient.assets.upload("image", entry, {
    contentType: entry.type,
    filename: entry.name,
  });

  return {
    _type: "reference" as const,
    _ref: asset._id,
  };
}

async function imageValue(provider: ProviderRecord, formData: FormData) {
  const uploadedAsset = await uploadedProfilePhotoAsset(formData);
  const asset = uploadedAsset || provider.mainPhoto?.asset;
  const alt = optionalValue(formData, "main-photo-alt") || provider.mainPhoto?.alt;

  if (!asset?._ref && !alt) return undefined;

  return {
    _type: "image" as const,
    ...(asset?._ref
      ? {
          asset: {
            _type: "reference" as const,
            _ref: asset._ref,
          },
        }
      : {}),
    ...(alt ? { alt } : {}),
  };
}

function cityReferences(provider: ProviderRecord, cityIds: string[]) {
  return cityIds.map((cityId) => {
    const existing = provider.cities?.find((city) => city._ref === cityId);

    return (
      existing || {
        _type: "reference" as const,
        _ref: cityId,
        _key: keyFromValue(cityId, "city"),
      }
    );
  });
}

async function profileCandidate(
  provider: ProviderRecord,
  formData: FormData,
  capability: ProviderEditCapability,
) {
  const preferredContact = provider.contactOptions?.preferredContact;
  const mainPhoto = canEditProviderField(capability, "mainPhoto")
    ? await imageValue(provider, formData)
    : undefined;
  const candidate: Record<string, unknown> = {
    name: value(formData, "name"),
    contactOptions: {
      _type: "object",
      email: optionalValue(formData, "contact-email"),
      phone: optionalValue(formData, "contact-phone"),
      whatsapp: optionalValue(formData, "contact-whatsapp"),
      website: optionalValue(formData, "contact-website"),
      ...(typeof preferredContact === "string" ? { preferredContact } : {}),
    },
    cities: cityReferences(provider, selectedValues(formData, "cities")),
    languages: editableLanguages
      .map((rowKey, index) => {
        const language = value(formData, `${rowKey}-code`);
        const level = value(formData, `${rowKey}-level`);
        const services = selectedValues(formData, `${rowKey}-services`);

        if (!language && !level && services.length === 0) return null;

        return {
          _type: "object",
          _key: keyFromValue(language, `language-${index}`),
          language,
          level,
          services,
        };
      })
      .filter(Boolean),
    ...(mainPhoto ? { mainPhoto } : {}),
  };

  editableLanguageCodes.forEach((language) => {
    candidate[`headline_${language}`] = value(formData, `headline_${language}`);
    candidate[`intro_${language}`] = value(formData, `intro_${language}`);
    candidate[`about_${language}`] = value(formData, `about_${language}`);
  });

  return enforceProviderEditableFields(candidate, capability);
}

function isRevisionConflict(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const candidate = error as { message?: string; statusCode?: number };
  return (
    candidate.statusCode === 409 ||
    candidate.message?.toLowerCase().includes("revision") === true
  );
}

function staleEditError() {
  return new ProfileWorkflowError(
    "This profile changed after you opened the editor. Reload the page and review the latest version before publishing again.",
  );
}

function profileErrorRedirect(error: unknown): never {
  const message =
    error instanceof ProfileWorkflowError
      ? error.message
      : "We could not publish your profile changes. Please try again.";

  redirect(`/account/profile/edit?error=${encodeURIComponent(message)}`);
}

function revalidateProviderPublishing(slug?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/account/profile/edit");
  revalidatePath("/dashboard/admin/providers");
  revalidatePath("/dashboard/admin/provider-changes");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/activity");
  revalidatePath("/providers");
  revalidatePath("/pt/profissionais");
  revalidatePath("/nl/professionals");
  revalidatePath("/sitemap.xml");

  if (!slug) return;
  revalidatePath(`/providers/${slug}`);
  revalidatePath(`/pt/profissionais/${slug}`);
  revalidatePath(`/nl/professionals/${slug}`);
}

async function publishProviderProfileForCurrentUser(
  submittedRevision: string,
  formData: FormData,
) {
  const context = await requireProviderSelfEdit("/account/profile/edit");

  if (!context.signedInEmail) {
    throw new ProfileWorkflowError(
      "A verified Clerk email is required to publish Provider changes.",
    );
  }

  const disallowedFields = disallowedProviderSelfEditFormFields(
    Array.from(formData.keys()),
    context.providerEdit,
  );

  if (disallowedFields.length) {
    throw new ProfileWorkflowError(
      `These fields are not allowed for Provider self-editing: ${disallowedFields.join(", ")}.`,
    );
  }

  const provider = await client.fetch<ProviderRecord | null>(
    providerForSelfEditQuery,
    { providerId: context.provider._id },
  );

  if (!provider?._id) {
    throw new ProfileWorkflowError(
      "No provider profile matches your signed-in account.",
    );
  }

  if (
    !submittedRevision ||
    providerSelfEditRevisionStatus(submittedRevision, provider._rev) === "stale"
  ) {
    throw staleEditError();
  }

  const candidate = await profileCandidate(provider, formData, context.providerEdit);
  const profileChanges = changedProviderFields(
    provider as unknown as Record<string, unknown>,
    candidate,
  );
  const ownershipChanges: ProviderFieldChange[] = [];
  const patchValues = definedOnly(
    providerPatchFromChanges(profileChanges),
  ) as Record<string, unknown>;

  if (context.providerEdit.shouldBindOwnerUserId) {
    if (provider.ownership?.ownerUserId !== context.user.id) {
      ownershipChanges.push({
        field: "ownership.ownerUserId",
        beforeValue: provider.ownership?.ownerUserId,
        afterValue: context.user.id,
      });
    }
    if (provider.ownership?.ownershipStatus !== "claimed") {
      ownershipChanges.push({
        field: "ownership.ownershipStatus",
        beforeValue: provider.ownership?.ownershipStatus,
        afterValue: "claimed",
      });
    }
    patchValues["ownership.ownerUserId"] = context.user.id;
    patchValues["ownership.ownershipStatus"] = "claimed";
  }

  const changes = [...profileChanges, ...ownershipChanges];
  if (!changes.length) return { changed: false, slug: provider.slug?.current };

  const changedFieldNames = changes.map((change) => change.field);
  const changeLog = providerChangeLogDocument({
    context,
    providerId: provider._id,
    providerName: provider.name || "Provider",
    providerSlug: provider.slug?.current,
    changeType: "providerSelfPublished",
    description: `Provider published changes to ${changedFieldNames.join(", ")}.`,
    changes,
  });

  try {
    await writeClient
      .transaction()
      .patch(provider._id, (patch) =>
        patch.ifRevisionId(submittedRevision).set(patchValues),
      )
      .create(changeLog)
      .commit();
  } catch (error) {
    if (isRevisionConflict(error)) throw staleEditError();
    throw error;
  }

  revalidateProviderPublishing(provider.slug?.current);
  return { changed: true, slug: provider.slug?.current };
}

export async function publishProviderProfileChanges(
  providerRevision: string,
  formData: FormData,
) {
  try {
    assertSanityWriteToken();
    const result = await publishProviderProfileForCurrentUser(providerRevision, formData);
    redirect(
      result.changed
        ? "/account/profile/edit?published=1"
        : "/account/profile/edit?unchanged=1",
    );
  } catch (error) {
    unstable_rethrow(error);
    profileErrorRedirect(error);
  }
}
