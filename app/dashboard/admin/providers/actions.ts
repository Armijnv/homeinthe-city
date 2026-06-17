"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { providerChangeLogDocument } from "@/app/lib/providerChangeLog";
import { requireAdmin } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";
import { assertSanityWriteToken, writeClient } from "@/sanity/lib/writeClient";
import { publishedId } from "@/sanity/lib/providerSubmissionApproval";

type ManagedCityReference = {
  _key?: string;
  _ref?: string;
};

type ProviderForAction = {
  _id: string;
  name?: string;
  slug?: { current?: string };
  managedCities?: ManagedCityReference[];
};

type CityForAction = {
  _id: string;
  name_en?: string;
  name_pt?: string;
  name_nl?: string;
};

class ProviderAdminError extends Error {}

const allowedRoles = new Set([
  "host",
  "interpreter",
  "translator",
  "guide",
  "specialist",
  "realtor",
]);
const allowedLanguages = new Set(["en", "pt", "nl", "es", "de", "fr", "other"]);
const allowedLanguageLevels = new Set([
  "native",
  "fluent",
  "professional",
  "conversational",
]);
const allowedLanguageServices = new Set([
  "speaks",
  "interpretsFrom",
  "interpretsTo",
  "translatesFrom",
  "translatesTo",
]);
const allowedStatuses = new Set(["draft", "review", "published", "disabled"]);

function formString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function selectedStrings(formData: FormData, key: string) {
  return Array.from(
    new Set(
      formData
        .getAll(key)
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

function cleanDocumentId(value: string) {
  const id = publishedId(value);
  return id && /^[A-Za-z0-9_.-]+$/.test(id) ? id : "";
}

function cleanSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanEmail(value: string) {
  const email = value.trim().toLowerCase();
  if (!email) return "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ProviderAdminError("Enter a valid contact email.");
  }
  return email;
}

function cleanWhatsApp(value: string) {
  if (!value) return "";

  if (value.startsWith("http://") || value.startsWith("https://")) {
    try {
      return new URL(value).toString();
    } catch {
      throw new ProviderAdminError("Enter a valid WhatsApp URL or phone number.");
    }
  }

  const digits = value.replace(/\D/g, "");
  if (digits.length < 8) {
    throw new ProviderAdminError("Enter a valid WhatsApp URL or phone number.");
  }
  return `https://wa.me/${digits}`;
}

function referenceKey(prefix: string, documentId: string, index: number) {
  const key = documentId.replace(/[^A-Za-z0-9_-]+/g, "-");
  return `${prefix}-${key || index}`;
}

function references(ids: string[], prefix: string) {
  return ids.map((id, index) => ({
    _key: referenceKey(prefix, id, index),
    _type: "reference",
    _ref: id,
  }));
}

function normalizedReference(ref: ManagedCityReference, index: number) {
  if (!ref._ref) return null;

  return {
    _key: ref._key || referenceKey("managed", ref._ref, index),
    _type: "reference",
    _ref: ref._ref,
  };
}

function cityName(city: CityForAction) {
  return city.name_en || city.name_pt || city.name_nl || "Untitled city";
}

function providerLanguages(formData: FormData) {
  return selectedStrings(formData, "languages").map((language, index) => {
    if (!allowedLanguages.has(language)) {
      throw new ProviderAdminError(`Unsupported language: ${language}.`);
    }

    const level = formString(formData, `language-${language}-level`);
    if (level && !allowedLanguageLevels.has(level)) {
      throw new ProviderAdminError(`Unsupported language level: ${level}.`);
    }

    const services = selectedStrings(
      formData,
      `language-${language}-services`,
    ).filter((service) => allowedLanguageServices.has(service));

    return {
      _key: `language-${language}-${index}`,
      _type: "object",
      language,
      ...(level ? { level } : {}),
      ...(services.length ? { services } : {}),
    };
  });
}

async function validatedCityIds(formData: FormData) {
  const cities = selectedStrings(formData, "cities").map(cleanDocumentId).filter(Boolean);
  const managedCities = selectedStrings(formData, "managedCities")
    .map(cleanDocumentId)
    .filter(Boolean);
  const requestedIds = Array.from(new Set([...cities, ...managedCities]));

  if (!requestedIds.length) return { cities, managedCities };

  const existingIds = await client.fetch<string[]>(
    `*[_type == "city" && _id in $cityIds]._id`,
    { cityIds: requestedIds },
  );

  if (existingIds.length !== requestedIds.length) {
    throw new ProviderAdminError("One or more selected cities no longer exist.");
  }

  return { cities, managedCities };
}

async function providerInput(formData: FormData, providerId?: string) {
  const name = formString(formData, "name");
  const slug = cleanSlug(formString(formData, "slug"));
  const status = formString(formData, "status");
  const primaryRole = formString(formData, "primaryRole");
  const roles = selectedStrings(formData, "roles").filter((role) =>
    allowedRoles.has(role),
  );
  const contactEmail = cleanEmail(formString(formData, "contactEmail"));
  const whatsapp = cleanWhatsApp(formString(formData, "whatsapp"));

  if (!name) throw new ProviderAdminError("Provider name is required.");
  if (!slug) throw new ProviderAdminError("Provider slug is required.");
  if (!allowedStatuses.has(status)) {
    throw new ProviderAdminError("Choose a valid provider status.");
  }
  if (!allowedRoles.has(primaryRole)) {
    throw new ProviderAdminError("Choose a valid primary role.");
  }
  if (!roles.includes(primaryRole)) roles.push(primaryRole);
  if (!roles.length) throw new ProviderAdminError("Choose at least one role.");

  const duplicateId = await client.fetch<string | null>(
    `*[_type == "provider" && slug.current == $slug && _id != $providerId][0]._id`,
    { slug, providerId: providerId || "" },
  );
  if (duplicateId) throw new ProviderAdminError("That provider slug is already in use.");

  if (contactEmail) {
    const duplicateEmailId = await client.fetch<string | null>(
      `*[
        _type == "provider" &&
        lower(ownership.contactEmail) == $contactEmail &&
        _id != $providerId
      ][0]._id`,
      { contactEmail, providerId: providerId || "" },
    );
    if (duplicateEmailId) {
      throw new ProviderAdminError(
        "That contact email is already connected to another provider.",
      );
    }
  }

  const cityIds = await validatedCityIds(formData);

  return {
    name,
    slug,
    status,
    primaryRole,
    roles,
    contactEmail,
    whatsapp,
    languages: providerLanguages(formData),
    cities: references(cityIds.cities, "served"),
    managedCities: references(cityIds.managedCities, "managed"),
  };
}

async function providerForAction(providerId: string) {
  return client.fetch<ProviderForAction | null>(
    `*[_type == "provider" && _id == $providerId][0]{
      _id,
      name,
      slug,
      managedCities[]{_key, _ref}
    }`,
    { providerId },
  );
}

async function cityForAction(cityId: string) {
  return client.fetch<CityForAction | null>(
    `*[_type == "city" && _id == $cityId][0]{_id, name_en, name_pt, name_nl}`,
    { cityId },
  );
}

function providerErrorMessage(error: unknown) {
  if (error instanceof ProviderAdminError) return error.message;
  if (error instanceof Error && error.message.includes("SANITY_API_WRITE_TOKEN")) {
    return "Provider saving is not configured. Check the Sanity write token.";
  }
  return "The provider could not be saved. Please review the fields and try again.";
}

function revalidateProviderManagement(...slugs: Array<string | undefined>) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/admin/providers");
  revalidatePath("/dashboard/admin/provider-changes");
  revalidatePath("/providers");
  revalidatePath("/pt/profissionais");
  revalidatePath("/nl/professionals");

  slugs.filter(Boolean).forEach((slug) => {
    revalidatePath(`/providers/${slug}`);
    revalidatePath(`/pt/profissionais/${slug}`);
    revalidatePath(`/nl/professionals/${slug}`);
  });
}

export async function createProviderAction(formData: FormData) {
  const context = await requireAdmin("/dashboard/admin/providers/new");
  assertSanityWriteToken();

  let input: Awaited<ReturnType<typeof providerInput>>;
  let providerId = "";
  try {
    input = await providerInput(formData);
    providerId = `provider-${input.slug}`;
    const existingId = await client.fetch<string | null>(
      `*[_type == "provider" && _id == $providerId][0]._id`,
      { providerId },
    );
    if (existingId) throw new ProviderAdminError("That provider already exists.");

    const providerDocument = {
      _id: providerId,
      _type: "provider",
      name: input.name,
      slug: { _type: "slug", current: input.slug },
      status: input.status,
      roles: input.roles,
      primaryRole: input.primaryRole,
      languages: input.languages,
      cities: input.cities,
      managedCities: input.managedCities,
      ownership: {
        _type: "object",
        ...(input.contactEmail ? { contactEmail: input.contactEmail } : {}),
        ownershipStatus: "unclaimed",
        selfEditEnabled: false,
      },
      contactOptions: {
        _type: "object",
        ...(input.contactEmail ? { email: input.contactEmail } : {}),
        ...(input.whatsapp ? { whatsapp: input.whatsapp } : {}),
        ...(input.whatsapp
          ? { preferredContact: "whatsapp" }
          : input.contactEmail
            ? { preferredContact: "email" }
            : {}),
      },
      verificationStatus: "unverified",
    };
    const changeLog = providerChangeLogDocument({
      context,
      providerId,
      providerName: input.name,
      providerSlug: input.slug,
      changeType: "providerCreated",
      description: `Created provider ${input.name} with ${input.status} status.`,
    });

    await writeClient.transaction().create(providerDocument).create(changeLog).commit();
    revalidateProviderManagement(input.slug);
  } catch (error) {
    redirect(
      `/dashboard/admin/providers/new?error=${encodeURIComponent(providerErrorMessage(error))}`,
    );
  }
  redirect(`/dashboard/admin/providers/${providerId}?saved=created`);
}

export async function updateProviderAction(formData: FormData) {
  const context = await requireAdmin("/dashboard/admin/providers");
  assertSanityWriteToken();

  const providerId = cleanDocumentId(formString(formData, "providerId"));
  if (!providerId) redirect("/dashboard/admin/providers");

  let nextSlug = "";
  let previousSlug = "";
  try {
    const existing = await providerForAction(providerId);
    if (!existing) throw new ProviderAdminError("Provider not found.");
    const input = await providerInput(formData, providerId);
    nextSlug = input.slug;
    previousSlug = existing.slug?.current || "";
    const setValues: Record<string, unknown> = {
      name: input.name,
      slug: { _type: "slug", current: input.slug },
      status: input.status,
      roles: input.roles,
      primaryRole: input.primaryRole,
      languages: input.languages,
      cities: input.cities,
      managedCities: input.managedCities,
      ...(input.contactEmail
        ? {
            "ownership.contactEmail": input.contactEmail,
            "contactOptions.email": input.contactEmail,
          }
        : {}),
      ...(input.whatsapp ? { "contactOptions.whatsapp": input.whatsapp } : {}),
      ...(input.whatsapp
        ? { "contactOptions.preferredContact": "whatsapp" }
        : input.contactEmail
          ? { "contactOptions.preferredContact": "email" }
          : {}),
    };
    const unsetPaths = [
      ...(!input.contactEmail
        ? ["ownership.contactEmail", "contactOptions.email"]
        : []),
      ...(!input.whatsapp ? ["contactOptions.whatsapp"] : []),
      ...(!input.contactEmail && !input.whatsapp
        ? ["contactOptions.preferredContact"]
        : []),
    ];

    const transaction = writeClient.transaction().patch(providerId, (patch) => {
      let nextPatch = patch
        .setIfMissing({
          ownership: {
            _type: "object",
            ownershipStatus: "unclaimed",
            selfEditEnabled: false,
          },
          contactOptions: { _type: "object" },
        })
        .set(setValues);
      if (unsetPaths.length) nextPatch = nextPatch.unset(unsetPaths);
      return nextPatch;
    });
    transaction.create(
      providerChangeLogDocument({
        context,
        providerId,
        providerName: input.name,
        providerSlug: input.slug,
        changeType: "providerEdited",
        description: `Updated provider ${input.name} with ${input.status} status.`,
      }),
    );
    await transaction.commit();
    revalidateProviderManagement(previousSlug, nextSlug);
  } catch (error) {
    redirect(
      `/dashboard/admin/providers/${providerId}?error=${encodeURIComponent(providerErrorMessage(error))}`,
    );
  }
  redirect(`/dashboard/admin/providers/${providerId}?saved=updated`);
}

export async function assignManagedCityAction(formData: FormData) {
  const context = await requireAdmin("/dashboard/admin/providers");
  assertSanityWriteToken();

  const providerId = cleanDocumentId(formString(formData, "providerId"));
  const cityId = cleanDocumentId(formString(formData, "cityId"));
  if (!providerId || !cityId) redirect("/dashboard/admin/providers");

  const [provider, city] = await Promise.all([
    providerForAction(providerId),
    cityForAction(cityId),
  ]);
  if (!provider || !city) redirect("/dashboard/admin/providers");

  const existingRefs = (provider.managedCities || [])
    .map(normalizedReference)
    .filter((ref): ref is NonNullable<typeof ref> => Boolean(ref));

  if (!existingRefs.some((ref) => ref._ref === cityId)) {
    const nextRefs = [
      ...existingRefs,
      {
        _key: referenceKey("managed", cityId, existingRefs.length),
        _type: "reference",
        _ref: cityId,
      },
    ];
    await writeClient
      .transaction()
      .patch(providerId, { set: { managedCities: nextRefs } })
      .create(
        providerChangeLogDocument({
          context,
          providerId,
          providerName: provider.name || "Untitled provider",
          providerSlug: provider.slug?.current,
          changeType: "managedCityAssigned",
          description: `Assigned ${cityName(city)} as a managed city.`,
        }),
      )
      .commit();
  }

  revalidateProviderManagement(provider.slug?.current);
  redirect("/dashboard/admin/providers");
}

export async function removeManagedCityAction(formData: FormData) {
  const context = await requireAdmin("/dashboard/admin/providers");
  assertSanityWriteToken();

  const providerId = cleanDocumentId(formString(formData, "providerId"));
  const cityId = cleanDocumentId(formString(formData, "cityId"));
  if (!providerId || !cityId) redirect("/dashboard/admin/providers");

  const [provider, city] = await Promise.all([
    providerForAction(providerId),
    cityForAction(cityId),
  ]);
  if (!provider || !city) redirect("/dashboard/admin/providers");

  if (!(provider.managedCities || []).some((ref) => ref._ref === cityId)) {
    redirect("/dashboard/admin/providers");
  }

  const nextRefs = (provider.managedCities || [])
    .filter((ref) => ref._ref && ref._ref !== cityId)
    .map(normalizedReference)
    .filter((ref): ref is NonNullable<typeof ref> => Boolean(ref));

  await writeClient
    .transaction()
    .patch(providerId, { set: { managedCities: nextRefs } })
    .create(
      providerChangeLogDocument({
        context,
        providerId,
        providerName: provider.name || "Untitled provider",
        providerSlug: provider.slug?.current,
        changeType: "managedCityRemoved",
        description: `Removed ${cityName(city)} from managed cities.`,
      }),
    )
    .commit();

  revalidateProviderManagement(provider.slug?.current);
  redirect("/dashboard/admin/providers");
}
