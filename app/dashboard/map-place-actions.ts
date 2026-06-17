"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  initialMapPlaceActionState,
  type MapPlaceActionState,
} from "@/app/dashboard/map-place-action-state";
import { cityChangeLogDocument } from "@/app/lib/cityChangeLog";
import { requireCityHost } from "@/app/lib/dashboard";
import { assertSanityWriteToken, writeClient } from "@/sanity/lib/writeClient";

const maxMapPlaceImageSize = 10 * 1024 * 1024;
const supportedMapPlaceImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const heicMapPlaceImageTypes = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);
const supportedMapPlaceImageExtensions = new Map([
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["png", "image/png"],
  ["webp", "image/webp"],
  ["gif", "image/gif"],
  ["heic", "image/heic"],
  ["heif", "image/heif"],
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

type MapPlaceImageValue = {
  _type: "image";
  alt: string;
  asset: {
    _type: "reference";
    _ref: string;
  };
};

type UploadedMapPlaceImage = {
  image: MapPlaceImageValue | null;
  warning: boolean;
};

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
  revalidatePath("/dashboard/admin/city-changes");
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

function supportedImageContentType(file: File) {
  const browserType = file.type.toLowerCase();
  if (supportedMapPlaceImageTypes.has(browserType)) return browserType;
  if (heicMapPlaceImageTypes.has(browserType)) return browserType;

  const extensionType = supportedMapPlaceImageExtensions.get(fileExtension(file.name));
  if (extensionType && (!browserType || browserType === "application/octet-stream")) {
    return extensionType;
  }

  return null;
}

function isHeicImage(file: File, contentType: string | null) {
  const browserType = file.type.toLowerCase();
  const extension = fileExtension(file.name);

  return (
    heicMapPlaceImageTypes.has(browserType) ||
    (contentType ? heicMapPlaceImageTypes.has(contentType) : false) ||
    extension === "heic" ||
    extension === "heif"
  );
}

function jpegFilenameFromHeic(filename: string) {
  const base = filename.replace(/\.[^.]+$/, "");
  return `${base || "map-place-photo"}.jpg`;
}

async function uploadableImageBody(
  file: File,
  contentType: string,
): Promise<{ body: Buffer; contentType: string; filename: string }> {
  const body = Buffer.from(await file.arrayBuffer());

  if (!isHeicImage(file, contentType)) {
    return {
      body,
      contentType,
      filename: file.name,
    };
  }

  const { default: sharp } = await import("sharp");
  const jpeg = await sharp(body, { limitInputPixels: 64_000_000 })
    .rotate()
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();

  return {
    body: jpeg,
    contentType: "image/jpeg",
    filename: jpegFilenameFromHeic(file.name),
  };
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
  options?: { imageWarning?: boolean },
) {
  const returnPath = stringValue(formData, "returnPath");
  const cityPath = `/dashboard/cities/${citySlug}/map`;
  const adminPath = `/dashboard/admin/cities/${citySlug}/map`;
  const safePath = returnPath === adminPath || returnPath === cityPath ? returnPath : cityPath;
  const query = new URLSearchParams({ mapPlaceSaved: status });

  if (options?.imageWarning) {
    query.set("mapPlaceImage", "skipped");
  }

  return `${safePath}?${query}`;
}

async function uploadedMapPlaceImage(
  formData: FormData,
  fallbackAlt: string,
): Promise<UploadedMapPlaceImage> {
  const entry = formData.get("image");

  if (!(entry instanceof File)) {
    if (imageWasSelected(formData)) {
      console.error("Map place image was selected but no file was received");
      return { image: null, warning: true };
    }

    return { image: null, warning: false };
  }

  if (entry.size === 0) {
    if (imageWasSelected(formData)) {
      console.error("Map place image upload skipped because the received file was empty");
      return { image: null, warning: true };
    }

    return { image: null, warning: false };
  }

  const contentType = supportedImageContentType(entry);
  if (!contentType) {
    console.error("Map place image upload skipped because the file type is unsupported", {
      name: entry.name,
      type: entry.type,
    });
    return { image: null, warning: true };
  }

  if (entry.size > maxMapPlaceImageSize) {
    console.error("Map place image upload skipped because the file is too large", {
      name: entry.name,
      size: entry.size,
    });
    return { image: null, warning: true };
  }

  let asset;
  try {
    const upload = await uploadableImageBody(entry, contentType);
    asset = await writeClient.assets.upload("image", upload.body, {
      contentType: upload.contentType,
      filename: upload.filename,
    });
  } catch (error) {
    console.error("Map place image upload failed", error);
    return { image: null, warning: true };
  }

  return {
    image: {
      _type: "image",
      alt: stringValue(formData, "imageAlt") || fallbackAlt,
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    },
    warning: false,
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
  let imageWarning = false;

  try {
    const context = await requireCityHost(citySlug);
    const { city } = context;
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

    const uploadedImage = await uploadedMapPlaceImage(formData, text.name);
    imageWarning = uploadedImage.warning;
    const mapPlace = withoutUndefined({
      _type: "object",
      _key: `place-${Date.now()}`,
      ...text,
      ...categoryFields(formData),
      neighborhood: neighborhood || undefined,
      latitude,
      longitude,
      website: website || undefined,
      image: uploadedImage.image || undefined,
    });

    const transaction = writeClient.transaction().patch(city._id, (patch) =>
      patch.setIfMissing({ mapPlaces: [] }).append("mapPlaces", [mapPlace]),
    );
    const changeLog = cityChangeLogDocument({
      context,
      city,
      changeType: "mapPlaceAdded",
      description: `Added map place: ${text.name}.`,
    });
    if (changeLog) transaction.create(changeLog);
    await transaction.commit();

    revalidateCityMapPaths(citySlug);
  } catch (error) {
    console.error("Map place add failed", error);
    return actionErrorState(error, formData);
  }

  redirect(successRedirectPath(citySlug, formData, "added", { imageWarning }));
}

export async function updateMapPlaceAction(citySlug: string, formData: FormData) {
  return updateMapPlaceWithState(citySlug, initialMapPlaceActionState, formData);
}

export async function updateMapPlaceWithState(
  citySlug: string,
  _previousState: MapPlaceActionState,
  formData: FormData,
): Promise<MapPlaceActionState> {
  let imageWarning = false;

  try {
    const context = await requireCityHost(citySlug);
    const { city } = context;
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
    const uploadedImage = await uploadedMapPlaceImage(formData, text.name);
    imageWarning = uploadedImage.warning;
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
      ...(uploadedImage.image ? { [`${selector}.image`]: uploadedImage.image } : {}),
    };
    const unsetPaths = Object.entries(setValues)
      .filter(([, value]) => value === undefined)
      .map(([path]) => path);
    if (removeImage && !uploadedImage.image) {
      unsetPaths.push(`${selector}.image`);
    }
    const cleanSetValues = Object.fromEntries(
      Object.entries(setValues).filter(([, value]) => value !== undefined),
    );
    const transaction = writeClient.transaction().patch(city._id, (patch) => {
      const nextPatch = patch.set(cleanSetValues);
      return unsetPaths.length ? nextPatch.unset(unsetPaths) : nextPatch;
    });
    const changeLog = cityChangeLogDocument({
      context,
      city,
      changeType: "mapPlaceUpdated",
      description: `Updated map place: ${text.name}.`,
    });
    if (changeLog) transaction.create(changeLog);
    await transaction.commit();
    revalidateCityMapPaths(citySlug);
  } catch (error) {
    console.error("Map place update failed", error);
    return actionErrorState(error, formData);
  }

  redirect(successRedirectPath(citySlug, formData, "updated", { imageWarning }));
}

export async function deleteMapPlaceAction(citySlug: string, formData: FormData) {
  try {
    const context = await requireCityHost(citySlug);
    const { city } = context;
    assertSanityWriteToken();

    const placeKey = placeKeyFromForm(formData);
    if (!city._id || !placeKey) return;

    const transaction = writeClient
      .transaction()
      .patch(city._id, (patch) =>
        patch.unset([`mapPlaces[_key=="${placeKey}"]`]),
      );
    const changeLog = cityChangeLogDocument({
      context,
      city,
      changeType: "mapPlaceDeleted",
      description: `Deleted map place (${placeKey}).`,
    });
    if (changeLog) transaction.create(changeLog);
    await transaction.commit();
    revalidateCityMapPaths(citySlug);
  } catch (error) {
    console.error("Map place delete failed", error);
    return;
  }

  redirect(successRedirectPath(citySlug, formData, "deleted"));
}
