"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { providerChangeLogDocument } from "@/app/lib/providerChangeLog";
import { requireAdmin } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";
import { assertSanityWriteToken, writeClient } from "@/sanity/lib/writeClient";
import { publishedId } from "@/sanity/lib/providerSubmissionApproval";
import { activityFieldChanges } from "@/app/lib/activityChanges";
import { providerSelfEditableFields } from "@/app/lib/clerkIdentityPolicy";
import {
  SanityImageUploadError,
  uploadSanityImage,
} from "@/app/lib/sanityImageUpload";

type ManagedCityReference = {
  _key?: string;
  _ref?: string;
};

type ProviderForAction = {
  _id: string;
  _rev: string;
  name?: string;
  slug?: { current?: string };
  managedCities?: ManagedCityReference[];
  cities?: ManagedCityReference[];
  status?: string;
  verificationStatus?: string;
  roles?: string[];
  primaryRole?: string;
  languages?: Array<Record<string, unknown>>;
  headline_en?: string;
  headline_pt?: string;
  headline_nl?: string;
  intro_en?: string;
  intro_pt?: string;
  intro_nl?: string;
  about_en?: string;
  about_pt?: string;
  about_nl?: string;
  servicesTitle_en?: string;
  servicesTitle_pt?: string;
  servicesTitle_nl?: string;
  services?: Array<Record<string, unknown>>;
  mainPhoto?: {
    _type?: "image";
    alt?: string;
    asset?: { _type?: "reference"; _ref?: string };
    crop?: Record<string, number>;
    hotspot?: Record<string, number>;
  };
  ownership?: {
    contactEmail?: string;
    selfEditEnabled?: boolean;
    selfEditableFields?: string[];
  };
  contactOptions?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    website?: string;
    preferredContact?: string;
  };
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
const allowedVerificationStatuses = new Set([
  "unverified",
  "pending",
  "verified",
  "rejected",
]);
const allowedSelfEditableFields = new Set<string>(providerSelfEditableFields);
const allowedPreferredContacts = new Set(["email", "phone", "whatsapp", "website"]);
const editorialLanguages = ["en", "pt", "nl"] as const;

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

function cleanUrl(value: string, label: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (!new Set(["http:", "https:"]).has(url.protocol)) throw new Error();
    return url.toString();
  } catch {
    throw new ProviderAdminError(`Enter a valid ${label} URL.`);
  }
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

function providerServices(formData: FormData) {
  const source = formString(formData, "servicesJson");
  if (!source) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch {
    throw new ProviderAdminError("Provider service cards could not be read.");
  }
  if (!Array.isArray(parsed) || parsed.length > 20) {
    throw new ProviderAdminError("Provider service cards are invalid.");
  }

  return parsed.flatMap((entry, index) => {
    if (!entry || typeof entry !== "object") return [];
    const raw = entry as Record<string, unknown>;
    const roleValues = Array.isArray(raw.roles)
      ? Array.from(
          new Set(
            raw.roles.filter(
              (role): role is string =>
                typeof role === "string" && allowedRoles.has(role),
            ),
          ),
        )
      : [];
    const localized = Object.fromEntries(
      editorialLanguages.flatMap((language) =>
        (["title", "description"] as const).map((field) => {
          const value = raw[`${field}_${language}`];
          return [
            `${field}_${language}`,
            typeof value === "string" ? value.trim() : "",
          ];
        }),
      ),
    );
    const hasContent = Object.values(localized).some(Boolean);
    if (!hasContent && !roleValues.length) return [];
    if (!roleValues.length) {
      throw new ProviderAdminError(
        `Choose at least one applicable role for service card ${index + 1}.`,
      );
    }
    const requestedKey = typeof raw._key === "string" ? raw._key : "";
    const key =
      requestedKey.replace(/[^A-Za-z0-9_-]+/g, "-") ||
      `service-${Date.now()}-${index}`;

    return [
      {
        _key: key,
        _type: "object",
        roles: roleValues,
        ...localized,
      },
    ];
  });
}

function localizedProviderCopy(formData: FormData) {
  return Object.fromEntries(
    editorialLanguages.flatMap((language) =>
      (["headline", "intro", "about", "servicesTitle"] as const).map(
        (field) => [`${field}_${language}`, formString(formData, `${field}_${language}`)],
      ),
    ),
  );
}

async function adminMainPhoto(
  provider: ProviderForAction | null,
  providerName: string,
  formData: FormData,
) {
  const entry = formData.get("mainPhotoFile");
  const alt = formString(formData, "mainPhotoAlt");
  const remove = formString(formData, "removeMainPhoto") === "true";

  if (entry instanceof File && entry.size > 0) {
    return {
      value: await uploadSanityImage(
        entry,
        alt || `${providerName} profile photo`,
      ),
      remove: false,
    };
  }
  if (remove) return { value: undefined, remove: true };
  if (!provider?.mainPhoto?.asset?._ref) return { value: undefined, remove: false };

  return {
    value: {
      _type: "image" as const,
      ...(alt ? { alt } : {}),
      asset: {
        _type: "reference" as const,
        _ref: provider.mainPhoto.asset._ref,
      },
      ...(provider.mainPhoto.crop ? { crop: provider.mainPhoto.crop } : {}),
      ...(provider.mainPhoto.hotspot ? { hotspot: provider.mainPhoto.hotspot } : {}),
    },
    remove: false,
  };
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
  const verificationStatus = formString(formData, "verificationStatus");
  const primaryRole = formString(formData, "primaryRole");
  const roles = selectedStrings(formData, "roles").filter((role) =>
    allowedRoles.has(role),
  );
  const contactEmail = cleanEmail(formString(formData, "contactEmail"));
  const publicEmail = cleanEmail(formString(formData, "publicEmail"));
  const whatsapp = cleanWhatsApp(formString(formData, "whatsapp"));
  const phone = formString(formData, "phone");
  const website = cleanUrl(formString(formData, "website"), "website");
  const preferredContact = formString(formData, "preferredContact");
  const selfEditEnabled = formString(formData, "selfEditEnabled") === "true";
  const selfEditableFields = selectedStrings(formData, "selfEditableFields");

  if (!name) throw new ProviderAdminError("Provider name is required.");
  if (!slug) throw new ProviderAdminError("Provider slug is required.");
  if (!allowedStatuses.has(status)) {
    throw new ProviderAdminError("Choose a valid provider status.");
  }
  if (!allowedVerificationStatuses.has(verificationStatus)) {
    throw new ProviderAdminError("Choose a valid provider verification status.");
  }
  if (!allowedRoles.has(primaryRole)) {
    throw new ProviderAdminError("Choose a valid primary role.");
  }
  if (!roles.includes(primaryRole)) roles.push(primaryRole);
  if (!roles.length) throw new ProviderAdminError("Choose at least one role.");
  if (selfEditableFields.some((field) => !allowedSelfEditableFields.has(field))) {
    throw new ProviderAdminError("Choose only supported self-editable profile sections.");
  }
  if (preferredContact && !allowedPreferredContacts.has(preferredContact)) {
    throw new ProviderAdminError("Choose a valid preferred contact method.");
  }
  const availableContactValues: Record<string, string> = {
    email: publicEmail,
    phone,
    whatsapp,
    website,
  };
  if (preferredContact && !availableContactValues[preferredContact]) {
    throw new ProviderAdminError(
      "Add the selected preferred contact method before saving.",
    );
  }
  if (providerId && selfEditEnabled && !selfEditableFields.length) {
    throw new ProviderAdminError("Choose at least one self-editable profile section before enabling self-editing.");
  }

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
    verificationStatus,
    primaryRole,
    roles,
    contactEmail,
    publicEmail,
    whatsapp,
    phone,
    website,
    preferredContact,
    selfEditEnabled,
    selfEditableFields,
    languages: providerLanguages(formData),
    cities: references(cityIds.cities, "served"),
    managedCities: references(cityIds.managedCities, "managed"),
    localizedCopy: localizedProviderCopy(formData),
    services: providerServices(formData),
  };
}

async function providerForAction(providerId: string) {
  return client.fetch<ProviderForAction | null>(
    `*[_type == "provider" && _id == $providerId][0]{
      _id,
      _rev,
      name,
      slug,
      status,
      verificationStatus,
      roles,
      primaryRole,
      languages,
      headline_en,
      headline_pt,
      headline_nl,
      intro_en,
      intro_pt,
      intro_nl,
      about_en,
      about_pt,
      about_nl,
      servicesTitle_en,
      servicesTitle_pt,
      servicesTitle_nl,
      services,
      cities[]{_key, _ref},
      managedCities[]{_key, _ref},
      ownership{contactEmail, selfEditEnabled, selfEditableFields},
      contactOptions{email, phone, whatsapp, website, preferredContact},
      mainPhoto{_type, alt, asset, crop, hotspot}
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
  if (error instanceof SanityImageUploadError) return error.message;
  if (error instanceof Error && error.message.includes("SANITY_API_WRITE_TOKEN")) {
    return "Provider saving is not configured. Check the Sanity write token.";
  }
  return "The provider could not be saved. Please review the fields and try again.";
}

function revalidateProviderManagement(...slugs: Array<string | undefined>) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/admin/providers");
  revalidatePath("/dashboard/admin/provider-changes");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/activity");
  revalidatePath("/dashboard/admin/providers/[providerId]", "page");
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
    const mainPhoto = await adminMainPhoto(null, input.name, formData);

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
      ...input.localizedCopy,
      services: input.services,
      ownership: {
        _type: "object",
        ...(input.contactEmail ? { contactEmail: input.contactEmail } : {}),
        ownershipStatus: "unclaimed",
        selfEditEnabled: false,
      },
      contactOptions: {
        _type: "object",
        ...(input.publicEmail ? { email: input.publicEmail } : {}),
        ...(input.phone ? { phone: input.phone } : {}),
        ...(input.whatsapp ? { whatsapp: input.whatsapp } : {}),
        ...(input.website ? { website: input.website } : {}),
        ...(input.preferredContact
          ? { preferredContact: input.preferredContact }
          : {}),
      },
      ...(mainPhoto.value ? { mainPhoto: mainPhoto.value } : {}),
      verificationStatus: input.verificationStatus,
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
  let didChange = false;
  try {
    const existing = await providerForAction(providerId);
    if (!existing) throw new ProviderAdminError("Provider not found.");
    const input = await providerInput(formData, providerId);
    const mainPhoto = await adminMainPhoto(existing, input.name, formData);
    nextSlug = input.slug;
    previousSlug = existing.slug?.current || "";
    const setValues: Record<string, unknown> = {
      name: input.name,
      slug: { _type: "slug", current: input.slug },
      status: input.status,
      verificationStatus: input.verificationStatus,
      roles: input.roles,
      primaryRole: input.primaryRole,
      languages: input.languages,
      cities: input.cities,
      managedCities: input.managedCities,
      ...input.localizedCopy,
      services: input.services,
      ...(input.contactEmail
        ? {
            "ownership.contactEmail": input.contactEmail,
          }
        : {}),
      ...(input.publicEmail ? { "contactOptions.email": input.publicEmail } : {}),
      ...(input.phone ? { "contactOptions.phone": input.phone } : {}),
      "ownership.selfEditEnabled": input.selfEditEnabled,
      "ownership.selfEditableFields": input.selfEditableFields,
      ...(input.whatsapp ? { "contactOptions.whatsapp": input.whatsapp } : {}),
      ...(input.website ? { "contactOptions.website": input.website } : {}),
      ...(input.preferredContact
        ? { "contactOptions.preferredContact": input.preferredContact }
        : {}),
      ...(mainPhoto.value ? { mainPhoto: mainPhoto.value } : {}),
    };
    const unsetPaths = [
      ...(!input.contactEmail ? ["ownership.contactEmail"] : []),
      ...(!input.publicEmail ? ["contactOptions.email"] : []),
      ...(!input.phone ? ["contactOptions.phone"] : []),
      ...(!input.whatsapp ? ["contactOptions.whatsapp"] : []),
      ...(!input.website ? ["contactOptions.website"] : []),
      ...(!input.preferredContact ? ["contactOptions.preferredContact"] : []),
      ...(mainPhoto.remove ? ["mainPhoto"] : []),
    ];
    const afterContactEmail = input.contactEmail || undefined;
    const afterPublicEmail = input.publicEmail || undefined;
    const afterPhone = input.phone || undefined;
    const afterWhatsapp = input.whatsapp || undefined;
    const afterWebsite = input.website || undefined;
    const afterPreferredContact = input.preferredContact || undefined;
    const afterMainPhoto = mainPhoto.remove
      ? undefined
      : mainPhoto.value || existing.mainPhoto;
    const changes = activityFieldChanges(
      {
        name: existing.name,
        slug: existing.slug?.current,
        status: existing.status,
        verificationStatus: existing.verificationStatus,
        roles: existing.roles || [],
        primaryRole: existing.primaryRole,
        languages: existing.languages || [],
        cities: existing.cities || [],
        managedCities: existing.managedCities || [],
        headline_en: existing.headline_en,
        headline_pt: existing.headline_pt,
        headline_nl: existing.headline_nl,
        intro_en: existing.intro_en,
        intro_pt: existing.intro_pt,
        intro_nl: existing.intro_nl,
        about_en: existing.about_en,
        about_pt: existing.about_pt,
        about_nl: existing.about_nl,
        servicesTitle_en: existing.servicesTitle_en,
        servicesTitle_pt: existing.servicesTitle_pt,
        servicesTitle_nl: existing.servicesTitle_nl,
        services: existing.services || [],
        mainPhoto: existing.mainPhoto,
        "ownership.contactEmail": existing.ownership?.contactEmail,
        "ownership.selfEditEnabled": existing.ownership?.selfEditEnabled === true,
        "ownership.selfEditableFields": existing.ownership?.selfEditableFields || [],
        "contactOptions.email": existing.contactOptions?.email,
        "contactOptions.phone": existing.contactOptions?.phone,
        "contactOptions.whatsapp": existing.contactOptions?.whatsapp,
        "contactOptions.website": existing.contactOptions?.website,
        "contactOptions.preferredContact": existing.contactOptions?.preferredContact,
      },
      {
        name: input.name,
        slug: input.slug,
        status: input.status,
        verificationStatus: input.verificationStatus,
        roles: input.roles,
        primaryRole: input.primaryRole,
        languages: input.languages,
        cities: input.cities,
        managedCities: input.managedCities,
        ...input.localizedCopy,
        services: input.services,
        mainPhoto: afterMainPhoto,
        "ownership.contactEmail": afterContactEmail,
        "ownership.selfEditEnabled": input.selfEditEnabled,
        "ownership.selfEditableFields": input.selfEditableFields,
        "contactOptions.email": afterPublicEmail,
        "contactOptions.phone": afterPhone,
        "contactOptions.whatsapp": afterWhatsapp,
        "contactOptions.website": afterWebsite,
        "contactOptions.preferredContact": afterPreferredContact,
      },
      ["_type", "_key"],
    );

    if (!changes.length) {
      nextSlug = existing.slug?.current || input.slug;
    } else {
      didChange = true;

      const transaction = writeClient.transaction().patch(providerId, (patch) => {
        let nextPatch = patch
          .ifRevisionId(existing._rev)
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
          description: `Updated ${input.name}'s provider profile.`,
          changes: changes.map((change) => ({
            field: change.field,
            beforeValue: change.beforeValue,
            afterValue: change.afterValue,
          })),
        }),
      );
      await transaction.commit();
    }
    revalidateProviderManagement(previousSlug, nextSlug);
  } catch (error) {
    redirect(
      `/dashboard/admin/providers/${providerId}?error=${encodeURIComponent(providerErrorMessage(error))}`,
    );
  }
  redirect(`/dashboard/admin/providers/${providerId}?saved=${didChange ? "updated" : "unchanged"}`);
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
      .patch(providerId, (patch) => patch.ifRevisionId(provider._rev).set({ managedCities: nextRefs }))
      .create(
        providerChangeLogDocument({
          context,
          providerId,
          providerName: provider.name || "Untitled provider",
          providerSlug: provider.slug?.current,
          changeType: "managedCityAssigned",
          description: `Assigned ${cityName(city)} as a managed city.`,
          changes: [{ field: "managedCities", beforeValue: existingRefs, afterValue: nextRefs }],
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
    .patch(providerId, (patch) => patch.ifRevisionId(provider._rev).set({ managedCities: nextRefs }))
    .create(
      providerChangeLogDocument({
        context,
        providerId,
        providerName: provider.name || "Untitled provider",
        providerSlug: provider.slug?.current,
        changeType: "managedCityRemoved",
        description: `Removed ${cityName(city)} from managed cities.`,
        changes: [{ field: "managedCities", beforeValue: provider.managedCities || [], afterValue: nextRefs }],
      }),
    )
    .commit();

  revalidateProviderManagement(provider.slug?.current);
  redirect("/dashboard/admin/providers");
}
