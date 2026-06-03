"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect, unstable_rethrow } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { assertSanityWriteToken, writeClient } from "@/sanity/lib/writeClient";

type ProviderMatch = {
  _id: string;
  slug?: {
    _type?: "slug";
    current?: string;
  };
  roles?: string[];
  primaryRole?: string;
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
  };
};

type ExistingSubmission = {
  _id: string;
  ownerUserId?: string;
  profileSnapshot?: {
    mainPhoto?: ProviderMatch["mainPhoto"];
  };
};

class ProfileWorkflowError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProfileWorkflowError";
  }
}

const matchedProviderForAccountQuery = `
  *[
    _type == "provider" &&
    (
      ownership.ownerUserId == $userId ||
      lower(ownership.contactEmail) in $emails
    )
  ][0]{
    _id,
    slug,
    roles,
    primaryRole,
    mainPhoto{
      _type,
      alt,
      asset
    },
    ownership{
      contactEmail,
      ownerUserId
    }
  }
`;

const editableLanguageCodes = ["en", "pt", "nl"] as const;
const editableLanguages = ["language-0", "language-1", "language-2", "language-3", "language-4"];
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
    _type: "reference",
    _ref: asset._id,
  };
}

async function imageSnapshot(
  provider: ProviderMatch,
  existingSubmission: ExistingSubmission | null,
  formData: FormData,
) {
  const uploadedAsset = await uploadedProfilePhotoAsset(formData);
  const existingImage =
    existingSubmission?.profileSnapshot?.mainPhoto || provider.mainPhoto;
  const asset = uploadedAsset || existingImage?.asset;
  const alt = optionalValue(formData, "main-photo-alt") || existingImage?.alt;

  if (!asset?._ref && !alt) return undefined;

  return {
    _type: "image",
    ...(asset?._ref
      ? {
          asset: {
            _type: "reference",
            _ref: asset._ref,
          },
        }
      : {}),
    ...(alt ? { alt } : {}),
  };
}

async function buildProfileSnapshot(
  provider: ProviderMatch,
  existingSubmission: ExistingSubmission | null,
  formData: FormData,
) {
  const mainPhoto = await imageSnapshot(provider, existingSubmission, formData);
  const snapshot: Record<string, unknown> = {
    name: value(formData, "name"),
    ...(provider.slug?.current
      ? {
          slug: {
            _type: "slug",
            current: provider.slug.current,
          },
        }
      : {}),
    roles: provider.roles || [],
    primaryRole: provider.primaryRole,
    contactOptions: {
      _type: "object",
      email: optionalValue(formData, "contact-email"),
      phone: optionalValue(formData, "contact-phone"),
      whatsapp: optionalValue(formData, "contact-whatsapp"),
      website: optionalValue(formData, "contact-website"),
      preferredContact: optionalValue(formData, "preferred-contact"),
    },
    cities: selectedValues(formData, "cities").map((cityId) => ({
      _type: "reference",
      _ref: cityId,
      _key: keyFromValue(cityId, "city"),
    })),
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
    snapshot[`headline_${language}`] = value(formData, `headline_${language}`);
    snapshot[`intro_${language}`] = value(formData, `intro_${language}`);
    snapshot[`about_${language}`] = value(formData, `about_${language}`);
  });

  return snapshot;
}

async function getSignedInProvider() {
  const user = await currentUser();

  if (!user?.id) {
    redirect("/sign-in");
  }

  const emails = user.emailAddresses
    .map((email) => email.emailAddress.toLowerCase())
    .filter(Boolean);

  if (emails.length === 0) {
    throw new ProfileWorkflowError(
      "Your signed-in account does not have an email address.",
    );
  }

  const provider = await client.fetch<ProviderMatch | null>(
    matchedProviderForAccountQuery,
    {
      userId: user.id,
      emails,
    },
  );

  if (!provider?._id) {
    throw new ProfileWorkflowError(
      "No provider profile matches your signed-in account.",
    );
  }

  const ownerEmail = provider.ownership?.contactEmail || emails[0];
  const ownerUserId = provider.ownership?.ownerUserId || user.id;

  return {
    provider,
    ownerEmail,
    ownerUserId,
  };
}

function profileErrorRedirect(error: unknown): never {
  const message =
    error instanceof ProfileWorkflowError
      ? error.message
      : "We could not save your profile changes. Please try again.";

  redirect(`/account/profile/edit?error=${encodeURIComponent(message)}`);
}

async function saveProviderProfileDraftForCurrentUser(formData: FormData) {
  const { provider, ownerEmail, ownerUserId } = await getSignedInProvider();
  const existingSubmission = await client.fetch<ExistingSubmission | null>(
    `*[
      _type == "providerSubmission" &&
      provider._ref == $providerId &&
      status == "draft" &&
      (
        lower(ownerEmail) == $ownerEmail ||
        ownerUserId == $ownerUserId
      )
    ] | order(_updatedAt desc)[0]{
      _id,
      ownerUserId,
      profileSnapshot{
        mainPhoto{
          _type,
          alt,
          asset
        }
      }
    }`,
    {
      providerId: provider._id,
      ownerEmail: ownerEmail.toLowerCase(),
      ownerUserId,
    },
  );
  const profileSnapshot = await buildProfileSnapshot(
    provider,
    existingSubmission,
    formData,
  );

  const submissionId =
    existingSubmission?._id || `providerSubmission.${crypto.randomUUID()}`;

  await writeClient
    .transaction()
    .createIfNotExists({
      _id: submissionId,
      _type: "providerSubmission",
      provider: {
        _type: "reference",
        _ref: provider._id,
      },
      ownerUserId,
      ownerEmail,
      status: "draft",
    })
    .patch(submissionId, {
      set: {
        provider: {
          _type: "reference",
          _ref: provider._id,
        },
        ownerUserId: existingSubmission?.ownerUserId || ownerUserId,
        ownerEmail,
        status: "draft",
        profileSnapshot,
      },
    })
    .commit();

  return submissionId;
}

export async function saveProviderProfileDraft(formData: FormData) {
  try {
    assertSanityWriteToken();
    await saveProviderProfileDraftForCurrentUser(formData);
  } catch (error) {
    unstable_rethrow(error);
    profileErrorRedirect(error);
  }

  redirect("/account/profile/edit?saved=1");
}

export async function submitProviderProfileForReview(formData: FormData) {
  try {
    assertSanityWriteToken();
    const submissionId = await saveProviderProfileDraftForCurrentUser(formData);

    await writeClient
      .patch(submissionId)
      .set({
        status: "review",
        submittedAt: new Date().toISOString(),
      })
      .commit();
  } catch (error) {
    unstable_rethrow(error);
    profileErrorRedirect(error);
  }

  redirect("/account/profile/edit?submitted=1");
}
