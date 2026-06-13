"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  initialMapPlaceActionState,
  type MapPlaceActionState,
} from "@/app/dashboard/map-place-action-state";
import { requireCityHost } from "@/app/lib/dashboard";
import { assertSanityWriteToken, writeClient } from "@/sanity/lib/writeClient";

const maxMapPlaceImageSize = 10 * 1024 * 1024;
const supportedMapPlaceImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const supportedMapPlaceImageExtensions = new Map([
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["png", "image/png"],
  ["webp", "image/webp"],
  ["gif", "image/gif"],
]);
const unsupportedMapPlaceImageTypes = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);
const mapPlaceFormFields = [
  "name_en",
  "name_pt",
  "name_nl",
  "categoryPreset",
  "customCategory",
  "categoryLabel_en",
  "categoryLabel_pt",
  "categoryLabel_nl",
  "neighborhood",
  "website",
  "latitude",
  "longitude",
  "detail_en",
  "detail_pt",
  "detail_nl",
  "description_en",
  "description_pt",
  "description_nl",
  "imageAlt",
  "removeImage",
  "placeKey",
] as const;

class MapPlaceActionError extends Error {}

function stringValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function numberValue(formData: FormData, key: string) {
  const value = Number(stringValue(formData, key));
  return Number.isFinite(value) ? value : null;
}

function slugish(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "custom"
  );
}

function cleanUrl(value: string) {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

function withoutUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => entryValue !== undefined),
  );
}

function categoryFields(formData: FormData) {
  const categoryPreset = stringValue(formData, "categoryPreset");
  const customCategory = stringValue(formData, "customCategory");
  const categoryLabelEn = stringValue(formData, "categoryLabel_en");
  const categoryLabelPt = stringValue(formData, "categoryLabel_pt");
  const categoryLabelNl = stringValue(formData, "categoryLabel_nl");
  const isCustom = categoryPreset === "custom";

  return {
    isCustom,
    categoryPreset: isCustom ? "custom" : categoryPreset || undefined,
    category: isCustom
      ? customCategory || slugish(categoryLabelEn || "custom")
      : undefined,
    categoryLabel_en: isCustom ? categoryLabelEn || customCategory : undefined,
    categoryLabel_pt: isCustom ? categoryLabelPt || undefined : undefined,
    categoryLabel_nl: isCustom ? categoryLabelNl || undefined : undefined,
  };
}

function revalidateCityMapPaths(citySlug: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/cities");
  revalidatePath(`/dashboard/cities/${citySlug}`);
  revalidatePath(`/dashboard/cities/${citySlug}/map`);
  revalidatePath(`/dashboard/admin/cities/${citySlug}/map`);
  revalidatePath(`/brazil/${citySlug}`);
  revalidatePath(`/pt/brasil/${citySlug}`);
  revalidatePath(`/nl/brazilie/${citySlug}`);
}

function placeKeyFromForm(formData: FormData) {
  const placeKey = stringValue(formData, "placeKey");
  return /^[A-Za-z0-9_-]+$/.test(placeKey) ? placeKey : "";
}

function fileExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() || "";
}

function imageWasSelected(formData: FormData) {
  return stringValue(formData, "imageSelected") === "1";
}

function unsupportedImageFormatMessage(filename?: string) {
  const suffix = filename ? ` (${filename})` : "";
  return `Please upload a JPG, PNG, WebP or GIF image${suffix}. iPhone HEIC/HEIF photos need to be converted before uploading.`;
}

function supportedImageContentType(file: File) {
  const browserType = file.type.toLowerCase();
  if (supportedMapPlaceImageTypes.has(browserType)) return browserType;

  const extensionType = supportedMapPlaceImageExtensions.get(fileExtension(file.name));
  if (extensionType && (!browserType || browserType === "application/octet-stream")) {
    return extensionType;
  }

  return null;
}

function isUnsupportedIphonePhoto(file: File) {
  const browserType = file.type.toLowerCase();
  const extension = fileExtension(file.name);

  return (
    unsupportedMapPlaceImageTypes.has(browserType) ||
    extension === "heic" ||
    extension === "heif"
  );
}

function valuesFromForm(formData: FormData) {
  return Object.fromEntries(
    mapPlaceFormFields.map((field) => [field, stringValue(formData, field)]),
  );
}

function actionErrorState(error: unknown, formData: FormData): MapPlaceActionState {
  const fallback =
    "The place could not be saved. Please check the fields and try again.";
  const message =
    error instanceof MapPlaceActionError
      ? error.message
      : error instanceof Error && error.message.includes("SANITY_API_WRITE_TOKEN")
        ? "Dashboard saving is not configured. Please ask an admin to check the Sanity write token."
        : fallback;

  return {
    status: "error",
    message,
    values: valuesFromForm(formData),
    submittedAt: Date.now(),
  };
}

function successRedirectPath(
  citySlug: string,
  formData: FormData,
  status: "added" | "updated" | "deleted",
) {
  const returnPath = stringValue(formData, "returnPath");
  const cityPath = `/dashboard/cities/${citySlug}/map`;
  const adminPath = `/dashboard/admin/cities/${citySlug}/map`;
  const safePath = returnPath === adminPath || returnPath === cityPath ? returnPath : cityPath;

  return `${safePath}?mapPlaceSaved=${status}`;
}

async function uploadedMapPlaceImage(formData: FormData, fallbackAlt: string) {
  const entry = formData.get("image");

  if (!(entry instanceof File)) {
    if (imageWasSelected(formData)) {
      throw new MapPlaceActionError(
        "Your browser did not send the selected photo. Please choose the image again and retry.",
      );
    }

    return null;
  }

  if (entry.size === 0) {
    if (imageWasSelected(formData)) {
      throw new MapPlaceActionError(
        "Your browser sent an empty photo file. Please choose the image again and retry.",
      );
    }

    return null;
  }

  if (isUnsupportedIphonePhoto(entry)) {
    throw new MapPlaceActionError(unsupportedImageFormatMessage(entry.name));
  }

  const contentType = supportedImageContentType(entry);
  if (!contentType) {
    throw new MapPlaceActionError(unsupportedImageFormatMessage(entry.name));
  }

  if (entry.size > maxMapPlaceImageSize) {
    throw new MapPlaceActionError("Map place photo must be smaller than 10 MB.");
  }

  let asset;
  try {
    asset = await writeClient.assets.upload("image", entry, {
      contentType,
      filename: entry.name,
    });
  } catch (error) {
    console.error("Map place image upload failed", error);
    throw new MapPlaceActionError(
      "The place details are valid, but the photo upload failed. Please retry with a JPG, PNG, WebP or GIF image under 10 MB.",
    );
  }

  return {
    _type: "image",
    alt: stringValue(formData, "imageAlt") || fallbackAlt,
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
  };
}

function localizedPlaceText(formData: FormData) {
  const legacyName = stringValue(formData, "name");
  const nameEn = stringValue(formData, "name_en") || legacyName;
  const namePt = stringValue(formData, "name_pt");
  const nameNl = stringValue(formData, "name_nl");
  const name = nameEn || namePt || nameNl;
  const detailEn = stringValue(formData, "detail_en") || stringValue(formData, "detail");
  const detailPt = stringValue(formData, "detail_pt");
  const detailNl = stringValue(formData, "detail_nl");
  const descriptionEn = stringValue(formData, "description_en");
  const descriptionPt = stringValue(formData, "description_pt");
  const descriptionNl = stringValue(formData, "description_nl");

  return {
    name,
    name_en: nameEn || undefined,
    name_pt: namePt || undefined,
    name_nl: nameNl || undefined,
    detail_en: detailEn || undefined,
    detail_pt: detailPt || undefined,
    detail_nl: detailNl || undefined,
    description_en: descriptionEn || detailEn || undefined,
    description_pt: descriptionPt || undefined,
    description_nl: descriptionNl || undefined,
  };
}

export async function addMapPlaceAction(citySlug: string, formData: FormData) {
  return addMapPlaceWithState(citySlug, initialMapPlaceActionState, formData);
}

export async function addMapPlaceWithState(
  citySlug: string,
  _previousState: MapPlaceActionState,
  formData: FormData,
): Promise<MapPlaceActionState> {
  try {
    const { city } = await requireCityHost(citySlug);
    assertSanityWriteToken();

    const text = localizedPlaceText(formData);
    const neighborhood = stringValue(formData, "neighborhood");
    const latitude = numberValue(formData, "latitude");
    const longitude = numberValue(formData, "longitude");
    const website = cleanUrl(stringValue(formData, "website"));

    if (!city._id) {
      throw new MapPlaceActionError("This city could not be found.");
    }

    if (!text.name) {
      throw new MapPlaceActionError("Add at least the English/default place name.");
    }

    if (latitude === null || longitude === null) {
      throw new MapPlaceActionError("Add valid latitude and longitude before saving.");
    }

    const image = await uploadedMapPlaceImage(formData, text.name);
    const mapPlace = withoutUndefined({
      _type: "object",
      _key: `place-${Date.now()}`,
      ...text,
      ...categoryFields(formData),
      neighborhood: neighborhood || undefined,
      latitude,
      longitude,
      website: website || undefined,
      image: image || undefined,
    });

    await writeClient
      .patch(city._id)
      .setIfMissing({ mapPlaces: [] })
      .append("mapPlaces", [mapPlace])
      .commit();

    revalidateCityMapPaths(citySlug);
  } catch (error) {
    return actionErrorState(error, formData);
  }

  redirect(successRedirectPath(citySlug, formData, "added"));
}

export async function updateMapPlaceAction(citySlug: string, formData: FormData) {
  return updateMapPlaceWithState(citySlug, initialMapPlaceActionState, formData);
}

export async function updateMapPlaceWithState(
  citySlug: string,
  _previousState: MapPlaceActionState,
  formData: FormData,
): Promise<MapPlaceActionState> {
  try {
    const { city } = await requireCityHost(citySlug);
    assertSanityWriteToken();

    const placeKey = placeKeyFromForm(formData);
    const text = localizedPlaceText(formData);
    const neighborhood = stringValue(formData, "neighborhood");
    const latitude = numberValue(formData, "latitude");
    const longitude = numberValue(formData, "longitude");
    const website = cleanUrl(stringValue(formData, "website"));

    if (!city._id) {
      throw new MapPlaceActionError("This city could not be found.");
    }

    if (!placeKey) {
      throw new MapPlaceActionError("This map place is missing its saved key.");
    }

    if (!text.name) {
      throw new MapPlaceActionError("Add at least the English/default place name.");
    }

    if (latitude === null || longitude === null) {
      throw new MapPlaceActionError("Add valid latitude and longitude before saving.");
    }

    const selector = `mapPlaces[_key=="${placeKey}"]`;
    const category = categoryFields(formData);
    const image = await uploadedMapPlaceImage(formData, text.name);
    const removeImage = stringValue(formData, "removeImage") === "on";
    const setValues: Record<string, unknown> = {
      [`${selector}.name`]: text.name,
      [`${selector}.name_en`]: text.name_en,
      [`${selector}.name_pt`]: text.name_pt,
      [`${selector}.name_nl`]: text.name_nl,
      [`${selector}.neighborhood`]: neighborhood || undefined,
      [`${selector}.latitude`]: latitude,
      [`${selector}.longitude`]: longitude,
      [`${selector}.detail_en`]: text.detail_en,
      [`${selector}.detail_pt`]: text.detail_pt,
      [`${selector}.detail_nl`]: text.detail_nl,
      [`${selector}.description_en`]: text.description_en,
      [`${selector}.description_pt`]: text.description_pt,
      [`${selector}.description_nl`]: text.description_nl,
      [`${selector}.website`]: website || undefined,
      [`${selector}.categoryPreset`]: category.categoryPreset,
      [`${selector}.category`]: category.category,
      [`${selector}.categoryLabel_en`]: category.categoryLabel_en,
      [`${selector}.categoryLabel_pt`]: category.categoryLabel_pt,
      [`${selector}.categoryLabel_nl`]: category.categoryLabel_nl,
      ...(image ? { [`${selector}.image`]: image } : {}),
    };
    const unsetPaths = Object.entries(setValues)
      .filter(([, value]) => value === undefined)
      .map(([path]) => path);
    if (removeImage && !image) {
      unsetPaths.push(`${selector}.image`);
    }
    const cleanSetValues = Object.fromEntries(
      Object.entries(setValues).filter(([, value]) => value !== undefined),
    );
    let patch = writeClient.patch(city._id).set(cleanSetValues);

    if (unsetPaths.length) {
      patch = patch.unset(unsetPaths);
    }

    await patch.commit();
    revalidateCityMapPaths(citySlug);
  } catch (error) {
    return actionErrorState(error, formData);
  }

  redirect(successRedirectPath(citySlug, formData, "updated"));
}

export async function deleteMapPlaceAction(citySlug: string, formData: FormData) {
  try {
    const { city } = await requireCityHost(citySlug);
    assertSanityWriteToken();

    const placeKey = placeKeyFromForm(formData);
    if (!city._id || !placeKey) return;

    await writeClient.patch(city._id).unset([`mapPlaces[_key=="${placeKey}"]`]).commit();
    revalidateCityMapPaths(citySlug);
  } catch {
    return;
  }

  redirect(successRedirectPath(citySlug, formData, "deleted"));
}
