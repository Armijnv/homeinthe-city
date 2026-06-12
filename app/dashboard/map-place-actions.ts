"use server";

import { revalidatePath } from "next/cache";
import { requireCityHost } from "@/app/lib/dashboard";
import { assertSanityWriteToken, writeClient } from "@/sanity/lib/writeClient";

const maxMapPlaceImageSize = 10 * 1024 * 1024;

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

async function uploadedMapPlaceImage(formData: FormData, fallbackAlt: string) {
  const entry = formData.get("image");

  if (!(entry instanceof File) || entry.size === 0) return null;

  if (!entry.type.startsWith("image/")) {
    throw new Error("Map place photo must be an image file.");
  }

  if (entry.size > maxMapPlaceImageSize) {
    throw new Error("Map place photo must be smaller than 10 MB.");
  }

  const asset = await writeClient.assets.upload("image", entry, {
    contentType: entry.type,
    filename: entry.name,
  });

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
  const { city } = await requireCityHost(citySlug);
  assertSanityWriteToken();

  const text = localizedPlaceText(formData);
  const neighborhood = stringValue(formData, "neighborhood");
  const latitude = numberValue(formData, "latitude");
  const longitude = numberValue(formData, "longitude");
  const website = cleanUrl(stringValue(formData, "website"));

  if (!city._id || !text.name || latitude === null || longitude === null) {
    return;
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

  await writeClient.patch(city._id).setIfMissing({ mapPlaces: [] }).append("mapPlaces", [
    mapPlace,
  ]).commit();

  revalidateCityMapPaths(citySlug);
}

export async function updateMapPlaceAction(citySlug: string, formData: FormData) {
  const { city } = await requireCityHost(citySlug);
  assertSanityWriteToken();

  const placeKey = placeKeyFromForm(formData);
  const text = localizedPlaceText(formData);
  const neighborhood = stringValue(formData, "neighborhood");
  const latitude = numberValue(formData, "latitude");
  const longitude = numberValue(formData, "longitude");
  const website = cleanUrl(stringValue(formData, "website"));

  if (!city._id || !placeKey || !text.name || latitude === null || longitude === null) {
    return;
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
}

export async function deleteMapPlaceAction(citySlug: string, formData: FormData) {
  const { city } = await requireCityHost(citySlug);
  assertSanityWriteToken();

  const placeKey = placeKeyFromForm(formData);
  if (!city._id || !placeKey) return;

  await writeClient.patch(city._id).unset([`mapPlaces[_key=="${placeKey}"]`]).commit();
  revalidateCityMapPaths(citySlug);
}
