"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { assertSanityWriteToken, writeClient } from "@/sanity/lib/writeClient";

type ProviderMatch = {
  _id: string;
  ownership?: {
    contactEmail?: string;
    ownerUserId?: string;
  };
};

type ExistingSubmission = {
  _id: string;
  ownerUserId?: string;
};

const matchedProviderForAccountQuery = `
  *[
    _type == "provider" &&
    (
      ownership.ownerUserId == $userId ||
      lower(ownership.contactEmail) in $emails
    )
  ][0]{
    _id,
    ownership{
      contactEmail,
      ownerUserId
    }
  }
`;

const editableLanguageCodes = ["en", "pt", "nl"] as const;
const editableLanguages = ["language-0", "language-1", "language-2", "language-3", "language-4"];

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function optionalUrl(formData: FormData, key: string) {
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

function buildProfileSnapshot(formData: FormData) {
  const snapshot: Record<string, unknown> = {
    name: value(formData, "name"),
    contactOptions: {
      _type: "object",
      email: value(formData, "contact-email"),
      phone: value(formData, "contact-phone"),
      whatsapp: optionalUrl(formData, "contact-whatsapp"),
      website: optionalUrl(formData, "contact-website"),
      preferredContact: value(formData, "preferred-contact") || undefined,
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
  };

  editableLanguageCodes.forEach((language) => {
    snapshot[`headline_${language}`] = value(formData, `headline_${language}`);
    snapshot[`intro_${language}`] = value(formData, `intro_${language}`);
    snapshot[`about_${language}`] = value(formData, `about_${language}`);
  });

  const photoAlt = value(formData, "main-photo-alt");
  if (photoAlt) {
    snapshot.mainPhoto = {
      _type: "image",
      alt: photoAlt,
    };
  }

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
    throw new Error("Your signed-in account does not have an email address.");
  }

  const provider = await client.fetch<ProviderMatch | null>(
    matchedProviderForAccountQuery,
    {
      userId: user.id,
      emails,
    },
  );

  if (!provider?._id) {
    throw new Error("No provider profile matches your signed-in account.");
  }

  const ownerEmail = provider.ownership?.contactEmail || emails[0];
  const ownerUserId = provider.ownership?.ownerUserId || user.id;

  return {
    provider,
    ownerEmail,
    ownerUserId,
  };
}

export async function saveProviderProfileDraft(formData: FormData) {
  assertSanityWriteToken();

  const { provider, ownerEmail, ownerUserId } = await getSignedInProvider();
  const profileSnapshot = buildProfileSnapshot(formData);
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
      ownerUserId
    }`,
    {
      providerId: provider._id,
      ownerEmail: ownerEmail.toLowerCase(),
      ownerUserId,
    },
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

  redirect("/account/profile/edit?saved=1");
}
