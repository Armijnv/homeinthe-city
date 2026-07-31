"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import {
  requirePropertyCreator,
  requirePropertyEditor,
  type DashboardPropertyListing,
} from "@/app/lib/propertyDashboard";
import {
  agentEditablePropertyFields,
  propertyOwnerForCreate,
  propertyStatusForCreate,
  propertyAdministratorOnlyFields,
} from "@/app/lib/propertyListingPolicy";
import {
  propertyChangeLogDocument,
  type PropertyFieldChange,
} from "@/app/lib/propertyChangeLog";
import { uploadSanityImage } from "@/app/lib/sanityImageUpload";
import { client } from "@/sanity/lib/client";
import { assertSanityWriteToken, writeClient } from "@/sanity/lib/writeClient";

class PropertyWorkflowError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PropertyWorkflowError";
  }
}

const formFieldToPropertyField: Record<string, string> = {
  "title-en": "title_en",
  "title-pt": "title_pt",
  "title-nl": "title_nl",
  "listing-type": "listingType",
  city: "city",
  neighborhood: "neighborhood",
  "address-visibility": "addressVisibility",
  address: "address",
  price: "price",
  currency: "currency",
  "monthly-condo-fee": "monthlyCondoFee",
  "property-tax": "propertyTax",
  bedrooms: "bedrooms",
  bathrooms: "bathrooms",
  "parking-spaces": "parkingSpaces",
  "area-m2": "areaM2",
  floor: "floor",
  furnished: "furnished",
  "minimum-stay": "minimumStay",
  "maximum-guests": "maximumGuests",
  "utilities-included": "utilitiesIncluded",
  "internet-included": "internetIncluded",
  "cleaning-included": "cleaningIncluded",
  "available-from": "availableFrom",
  "pets-allowed": "petsAllowed",
  "financing-possible": "financingPossible",
  "occupancy-status": "occupancyStatus",
  "year-built": "yearBuilt",
  "short-description-en": "shortDescription_en",
  "short-description-pt": "shortDescription_pt",
  "short-description-nl": "shortDescription_nl",
  "long-description-en": "longDescription_en",
  "long-description-pt": "longDescription_pt",
  "long-description-nl": "longDescription_nl",
  "features-en": "features_en",
  "features-pt": "features_pt",
  "features-nl": "features_nl",
  "building-amenities": "buildingAmenities",
  "apartment-amenities": "apartmentAmenities",
  "parking-amenities": "parkingAmenities",
  "lifestyle-amenities": "lifestyleAmenities",
  "neighborhood-description-en": "neighborhoodDescription_en",
  "neighborhood-description-pt": "neighborhoodDescription_pt",
  "neighborhood-description-nl": "neighborhoodDescription_nl",
  "nearby-highlights-en": "nearbyHighlights_en",
  "nearby-highlights-pt": "nearbyHighlights_pt",
  "nearby-highlights-nl": "nearbyHighlights_nl",
  "main-image": "mainImage",
  "main-image-alt": "mainImage",
  "gallery-images": "gallery",
  "gallery-alt": "gallery",
  "keep-gallery": "gallery",
  latitude: "mapCoordinates",
  longitude: "mapCoordinates",
  "video-url": "videoUrl",
  "contact-whatsapp": "contact",
  "contact-email": "contact",
  "seo-title-en": "seoTitle_en",
  "seo-title-pt": "seoTitle_pt",
  "seo-title-nl": "seoTitle_nl",
  "seo-description-en": "seoDescription_en",
  "seo-description-pt": "seoDescription_pt",
  "seo-description-nl": "seoDescription_nl",
  status: "status",
  "linked-realtor": "linkedRealtor",
};

const agentFields = new Set<string>(agentEditablePropertyFields);
const adminFields = new Set<string>([
  ...agentEditablePropertyFields,
  ...propertyAdministratorOnlyFields,
]);
const amenityValues: Record<string, Set<string>> = {
  "building-amenities": new Set([
    "elevator",
    "security24h",
    "concierge",
    "gym",
    "pool",
    "partyRoom",
    "coworkingSpace",
  ]),
  "apartment-amenities": new Set([
    "airConditioning",
    "highSpeedInternet",
    "balcony",
    "bbq",
    "washer",
    "dryer",
    "dishwasher",
    "homeOffice",
    "smartTv",
    "fullyEquippedKitchen",
  ]),
  "parking-amenities": new Set([
    "parkingSpace",
    "coveredParking",
    "visitorParking",
  ]),
  "lifestyle-amenities": new Set([
    "parkView",
    "cityView",
    "petFriendly",
    "familyFriendly",
    "quietStreet",
    "walkableNeighborhood",
  ]),
};

function stringValue(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function optionalString(formData: FormData, key: string) {
  return stringValue(formData, key) || undefined;
}

function numberValue(formData: FormData, key: string) {
  const entry = stringValue(formData, key);
  if (!entry) return undefined;
  const parsed = Number(entry);
  if (!Number.isFinite(parsed)) throw new PropertyWorkflowError(`${key} must be a number.`);
  return parsed;
}

function booleanValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function listValue(formData: FormData, key: string) {
  const repeated = formData
    .getAll(key)
    .filter((entry): entry is string => typeof entry === "string")
    .flatMap((entry) => entry.split(/[\n,]/))
    .map((entry) => entry.trim())
    .filter(Boolean);
  return Array.from(new Set(repeated));
}

function selectedAmenityValues(formData: FormData, key: string) {
  const allowed = amenityValues[key];
  const values = formData
    .getAll(key)
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const disallowed = values.filter((entry) => !allowed.has(entry));
  if (disallowed.length) {
    throw new PropertyWorkflowError(`Invalid ${key.replaceAll("-", " ")} selection.`);
  }
  return Array.from(new Set(values));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function compactObject(value: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (entry === undefined) return false;
      if (entry && typeof entry === "object") return Object.keys(entry).length > 0;
      return true;
    }),
  );
}

function assertAllowedFormFields(formData: FormData, isAdmin: boolean) {
  const permitted = isAdmin ? adminFields : agentFields;
  const disallowed = Array.from(
    new Set(
      Array.from(formData.keys())
        .filter((field) => !field.startsWith("$ACTION_"))
        .filter((field) => {
          const propertyField = formFieldToPropertyField[field];
          return !propertyField || !permitted.has(propertyField);
        }),
    ),
  );

  if (disallowed.length) {
    throw new PropertyWorkflowError(
      `These property fields are not allowed: ${disallowed.join(", ")}.`,
    );
  }
}

async function validCityReference(cityId: string) {
  if (!cityId) throw new PropertyWorkflowError("Choose a city.");
  const city = await client.fetch<{ _id: string; slug?: { current?: string } } | null>(
    `*[_type == "city" && _id == $cityId][0]{_id, slug}`,
    { cityId },
  );
  if (!city) throw new PropertyWorkflowError("The selected city is not available.");
  return city;
}

async function validRealtorReference(providerId: string) {
  if (!providerId) return null;
  return client.fetch<{ _id: string } | null>(
    `*[_type == "provider" && _id == $providerId && (primaryRole == "realtor" || "realtor" in roles)][0]{_id}`,
    { providerId },
  );
}

async function uploadedImage(formData: FormData, field: string, altField: string) {
  const entry = formData.get(field);
  if (!(entry instanceof File) || entry.size === 0) return undefined;
  return uploadSanityImage(entry, stringValue(formData, altField));
}

async function uploadedGallery(formData: FormData) {
  const alt = stringValue(formData, "gallery-alt");
  const files = formData
    .getAll("gallery-images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  if (files.length > 12) {
    throw new PropertyWorkflowError("Upload no more than 12 gallery images at a time.");
  }
  return Promise.all(
    files.map(async (file, index) => ({
      ...(await uploadSanityImage(file, alt)),
      _key: `gallery-${Date.now()}-${index}`,
    })),
  );
}

async function propertyValues(
  formData: FormData,
  existing?: DashboardPropertyListing,
) {
  const cityId = stringValue(formData, "city");
  const city = await validCityReference(cityId);
  const newMainImage = await uploadedImage(formData, "main-image", "main-image-alt");
  const newGallery = await uploadedGallery(formData);
  const keptGalleryKeys = new Set(
    formData
      .getAll("keep-gallery")
      .filter((entry): entry is string => typeof entry === "string"),
  );
  const keptGallery = (existing?.gallery || []).filter(
    (image) => !image._key || keptGalleryKeys.has(image._key),
  );
  const latitude = numberValue(formData, "latitude");
  const longitude = numberValue(formData, "longitude");

  if ((latitude === undefined) !== (longitude === undefined)) {
    throw new PropertyWorkflowError("Enter both latitude and longitude, or leave both blank.");
  }

  const title = stringValue(formData, "title-en");
  if (!title) throw new PropertyWorkflowError("English title is required.");
  const listingType = stringValue(formData, "listing-type");
  if (!new Set(["rent", "sale"]).has(listingType)) {
    throw new PropertyWorkflowError("Choose rent or sale.");
  }
  const addressVisibility = stringValue(formData, "address-visibility") || "neighborhood";
  if (!["hidden", "neighborhood", "full"].includes(addressVisibility)) {
    throw new PropertyWorkflowError("Choose a valid address visibility.");
  }
  const currency = stringValue(formData, "currency") || "BRL";
  if (!["BRL", "EUR", "USD"].includes(currency)) {
    throw new PropertyWorkflowError("Choose a valid currency.");
  }
  const occupancyStatus = optionalString(formData, "occupancy-status");
  if (occupancyStatus && !["vacant", "occupied"].includes(occupancyStatus)) {
    throw new PropertyWorkflowError("Choose a valid occupancy status.");
  }
  if (
    latitude !== undefined &&
    (latitude < -90 || latitude > 90 || longitude === undefined || longitude < -180 || longitude > 180)
  ) {
    throw new PropertyWorkflowError("Enter valid latitude and longitude coordinates.");
  }

  const existingMainImage = existing?.mainImage?.asset?._ref
    ? {
        ...existing.mainImage,
        _type: "image",
        asset: { _type: "reference", _ref: existing.mainImage.asset._ref },
        alt: stringValue(formData, "main-image-alt"),
      }
    : undefined;
  const values = compactObject({
    title_en: title,
    title_pt: optionalString(formData, "title-pt"),
    title_nl: optionalString(formData, "title-nl"),
    listingType,
    city: { _type: "reference", _ref: city._id },
    neighborhood: optionalString(formData, "neighborhood"),
    addressVisibility,
    address: optionalString(formData, "address"),
    price: numberValue(formData, "price"),
    currency,
    monthlyCondoFee: numberValue(formData, "monthly-condo-fee"),
    propertyTax: numberValue(formData, "property-tax"),
    bedrooms: numberValue(formData, "bedrooms"),
    bathrooms: numberValue(formData, "bathrooms"),
    parkingSpaces: numberValue(formData, "parking-spaces"),
    areaM2: numberValue(formData, "area-m2"),
    floor: numberValue(formData, "floor"),
    furnished: booleanValue(formData, "furnished"),
    minimumStay: optionalString(formData, "minimum-stay"),
    maximumGuests: numberValue(formData, "maximum-guests"),
    utilitiesIncluded: booleanValue(formData, "utilities-included"),
    internetIncluded: booleanValue(formData, "internet-included"),
    cleaningIncluded: booleanValue(formData, "cleaning-included"),
    availableFrom: optionalString(formData, "available-from"),
    petsAllowed: booleanValue(formData, "pets-allowed"),
    financingPossible: booleanValue(formData, "financing-possible"),
    occupancyStatus,
    yearBuilt: numberValue(formData, "year-built"),
    shortDescription_en: optionalString(formData, "short-description-en"),
    shortDescription_pt: optionalString(formData, "short-description-pt"),
    shortDescription_nl: optionalString(formData, "short-description-nl"),
    longDescription_en: optionalString(formData, "long-description-en"),
    longDescription_pt: optionalString(formData, "long-description-pt"),
    longDescription_nl: optionalString(formData, "long-description-nl"),
    features_en: listValue(formData, "features-en"),
    features_pt: listValue(formData, "features-pt"),
    features_nl: listValue(formData, "features-nl"),
    buildingAmenities: selectedAmenityValues(formData, "building-amenities"),
    apartmentAmenities: selectedAmenityValues(formData, "apartment-amenities"),
    parkingAmenities: selectedAmenityValues(formData, "parking-amenities"),
    lifestyleAmenities: selectedAmenityValues(formData, "lifestyle-amenities"),
    neighborhoodDescription_en: optionalString(formData, "neighborhood-description-en"),
    neighborhoodDescription_pt: optionalString(formData, "neighborhood-description-pt"),
    neighborhoodDescription_nl: optionalString(formData, "neighborhood-description-nl"),
    nearbyHighlights_en: listValue(formData, "nearby-highlights-en"),
    nearbyHighlights_pt: listValue(formData, "nearby-highlights-pt"),
    nearbyHighlights_nl: listValue(formData, "nearby-highlights-nl"),
    mainImage: newMainImage || existingMainImage,
    gallery: [...keptGallery, ...newGallery],
    mapCoordinates:
      latitude !== undefined && longitude !== undefined
        ? { _type: "geopoint", lat: latitude, lng: longitude }
        : undefined,
    videoUrl: optionalString(formData, "video-url"),
    contact: compactObject({
      _type: "object",
      whatsapp: optionalString(formData, "contact-whatsapp"),
      email: optionalString(formData, "contact-email"),
    }),
    seoTitle_en: optionalString(formData, "seo-title-en"),
    seoTitle_pt: optionalString(formData, "seo-title-pt"),
    seoTitle_nl: optionalString(formData, "seo-title-nl"),
    seoDescription_en: optionalString(formData, "seo-description-en"),
    seoDescription_pt: optionalString(formData, "seo-description-pt"),
    seoDescription_nl: optionalString(formData, "seo-description-nl"),
  });

  return { values, citySlug: city.slug?.current, title };
}

function changedFields(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
): PropertyFieldChange[] {
  return Object.entries(after)
    .filter(([field, value]) => {
      const beforeValue = before[field];
      if (field === "city" && beforeValue && typeof beforeValue === "object") {
        const cityRef = (beforeValue as { _ref?: string })._ref;
        return JSON.stringify({ _type: "reference", _ref: cityRef }) !== JSON.stringify(value);
      }
      if (field === "linkedRealtor" && beforeValue && typeof beforeValue === "object") {
        const realtorRef = (beforeValue as { _ref?: string })._ref;
        return JSON.stringify({ _type: "reference", _ref: realtorRef }) !== JSON.stringify(value);
      }
      return JSON.stringify(beforeValue) !== JSON.stringify(value);
    })
    .map(([field, afterValue]) => ({ field, beforeValue: before[field], afterValue }));
}

function revalidateProperty(citySlug?: string, listingSlug?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/properties");
  revalidatePath("/dashboard/admin/properties");
  revalidatePath("/real-estate");
  revalidatePath("/pt/imoveis");
  revalidatePath("/nl/vastgoed");
  revalidatePath("/sitemap.xml");
  if (!citySlug || !listingSlug) return;
  revalidatePath(`/real-estate/${citySlug}/${listingSlug}`);
  revalidatePath(`/pt/imoveis/${citySlug}/${listingSlug}`);
  revalidatePath(`/nl/vastgoed/${citySlug}/${listingSlug}`);
}

function workflowRedirect(path: string, error: unknown): never {
  const message =
    error instanceof PropertyWorkflowError
      ? error.message
      : "We could not save this property. Please try again.";
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function createPropertyListing(formData: FormData) {
  const path = "/dashboard/properties/new";
  try {
    assertSanityWriteToken();
    const context = await requirePropertyCreator(path);
    assertAllowedFormFields(formData, context.isAdmin);
    const { values, citySlug, title } = await propertyValues(formData);
    const slug = slugify(title);
    if (!slug) throw new PropertyWorkflowError("Enter a title that can be used as a URL.");
    const duplicate = await client.fetch<string | null>(
      `*[_type == "propertyListing" && slug.current == $slug][0]._id`,
      { slug },
    );
    if (duplicate) throw new PropertyWorkflowError("A property already uses this title URL.");

    let linkedRealtorId = propertyOwnerForCreate(context.provider, context.isAdmin);
    if (context.isAdmin) {
      linkedRealtorId = propertyOwnerForCreate(
        context.provider,
        true,
        stringValue(formData, "linked-realtor"),
      );
      if (linkedRealtorId && !(await validRealtorReference(linkedRealtorId))) {
        throw new PropertyWorkflowError("Choose a valid real-estate Provider.");
      }
    }
    if (!context.isAdmin && !linkedRealtorId) {
      throw new PropertyWorkflowError("A real-estate Provider account is required.");
    }

    const status = propertyStatusForCreate(
      context.isAdmin,
      stringValue(formData, "status"),
    );
    if (!["hidden", "available", "reserved", "sold", "rented"].includes(status)) {
      throw new PropertyWorkflowError("Choose a valid publication status.");
    }
    const propertyId = `property-${randomUUID()}`;
    const propertyDocument = {
      _id: propertyId,
      _type: "propertyListing",
      ...values,
      slug: { _type: "slug", current: slug },
      status,
      ...(linkedRealtorId
        ? { linkedRealtor: { _type: "reference", _ref: linkedRealtorId } }
        : {}),
    };
    const changes = changedFields({}, propertyDocument);
    const log = propertyChangeLogDocument({
      context,
      propertyId,
      propertyTitle: title,
      propertySlug: slug,
      changeType: "propertyCreated",
      changes,
    });

    await writeClient.transaction().create(propertyDocument).create(log).commit();
    revalidateProperty(citySlug, slug);
    redirect(`/dashboard/properties/${propertyId}/edit?created=1`);
  } catch (error) {
    unstable_rethrow(error);
    workflowRedirect(path, error);
  }
}

export async function updatePropertyListing(
  propertyId: string,
  submittedRevision: string,
  formData: FormData,
) {
  const path = `/dashboard/properties/${encodeURIComponent(propertyId)}/edit`;
  try {
    assertSanityWriteToken();
    const { context, property } = await requirePropertyEditor(propertyId);
    assertAllowedFormFields(formData, context.isAdmin);
    if (property._rev !== submittedRevision) {
      throw new PropertyWorkflowError(
        "This property changed after you opened it. Reload before saving again.",
      );
    }

    const { values, citySlug, title } = await propertyValues(formData, property);
    const patchValues: Record<string, unknown> = { ...values };
    let unsetLinkedRealtor = false;
    if (context.isAdmin) {
      const requestedRealtor = stringValue(formData, "linked-realtor");
      if (requestedRealtor && !(await validRealtorReference(requestedRealtor))) {
        throw new PropertyWorkflowError("Choose a valid real-estate Provider.");
      }
      const status = stringValue(formData, "status") || property.status || "hidden";
      if (!["hidden", "available", "reserved", "sold", "rented"].includes(status)) {
        throw new PropertyWorkflowError("Choose a valid publication status.");
      }
      patchValues.status = status;
      if (requestedRealtor) {
        patchValues.linkedRealtor = { _type: "reference", _ref: requestedRealtor };
      } else if (property.linkedRealtor?._ref) {
        unsetLinkedRealtor = true;
      }
    }

    const changes = changedFields(property as unknown as Record<string, unknown>, patchValues);
    if (unsetLinkedRealtor) {
      changes.push({
        field: "linkedRealtor",
        beforeValue: property.linkedRealtor,
        afterValue: undefined,
      });
    }
    if (!changes.length) redirect(`${path}?unchanged=1`);
    const log = propertyChangeLogDocument({
      context,
      propertyId,
      propertyTitle: title,
      propertySlug: property.slug?.current,
      changeType: "propertyEdited",
      changes,
    });

    let transaction = writeClient
      .transaction()
      .patch(propertyId, (patch) => patch.ifRevisionId(submittedRevision).set(patchValues));
    if (unsetLinkedRealtor) {
      transaction = transaction.patch(propertyId, (patch) => patch.unset(["linkedRealtor"]));
    }
    await transaction.create(log).commit();
    revalidateProperty(citySlug, property.slug?.current);
    if (property.city?.slug?.current !== citySlug) {
      revalidateProperty(property.city?.slug?.current, property.slug?.current);
    }
    redirect(`${path}?saved=1`);
  } catch (error) {
    unstable_rethrow(error);
    workflowRedirect(path, error);
  }
}
