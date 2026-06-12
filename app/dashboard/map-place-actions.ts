"use server";

import { revalidatePath } from "next/cache";
import { requireCityHost } from "@/app/lib/dashboard";
import { assertSanityWriteToken, writeClient } from "@/sanity/lib/writeClient";

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

export async function addMapPlaceAction(citySlug: string, formData: FormData) {
  const { city } = await requireCityHost(citySlug);
  assertSanityWriteToken();

  const name = stringValue(formData, "name");
  const neighborhood = stringValue(formData, "neighborhood");
  const latitude = numberValue(formData, "latitude");
  const longitude = numberValue(formData, "longitude");
  const detail = stringValue(formData, "detail");
  const website = cleanUrl(stringValue(formData, "website"));

  if (!city._id || !name || latitude === null || longitude === null) {
    return;
  }

  const mapPlace = withoutUndefined({
    _type: "object",
    _key: `place-${Date.now()}`,
    name,
    ...categoryFields(formData),
    neighborhood: neighborhood || undefined,
    latitude,
    longitude,
    detail_en: detail || undefined,
    description_en: detail || undefined,
    website: website || undefined,
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
  const name = stringValue(formData, "name");
  const neighborhood = stringValue(formData, "neighborhood");
  const latitude = numberValue(formData, "latitude");
  const longitude = numberValue(formData, "longitude");
  const detail = stringValue(formData, "detail");
  const website = cleanUrl(stringValue(formData, "website"));

  if (!city._id || !placeKey || !name || latitude === null || longitude === null) {
    return;
  }

  const selector = `mapPlaces[_key=="${placeKey}"]`;
  const category = categoryFields(formData);
  const setValues: Record<string, unknown> = {
    [`${selector}.name`]: name,
    [`${selector}.neighborhood`]: neighborhood || undefined,
    [`${selector}.latitude`]: latitude,
    [`${selector}.longitude`]: longitude,
    [`${selector}.detail_en`]: detail || undefined,
    [`${selector}.description_en`]: detail || undefined,
    [`${selector}.website`]: website || undefined,
    [`${selector}.categoryPreset`]: category.categoryPreset,
    [`${selector}.category`]: category.category,
    [`${selector}.categoryLabel_en`]: category.categoryLabel_en,
    [`${selector}.categoryLabel_pt`]: category.categoryLabel_pt,
    [`${selector}.categoryLabel_nl`]: category.categoryLabel_nl,
  };
  const unsetPaths = Object.entries(setValues)
    .filter(([, value]) => value === undefined)
    .map(([path]) => path);
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
