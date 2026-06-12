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

export async function addMapPlaceAction(citySlug: string, formData: FormData) {
  const { city } = await requireCityHost(citySlug);
  assertSanityWriteToken();

  const name = stringValue(formData, "name");
  const categoryPreset = stringValue(formData, "categoryPreset");
  const customCategory = stringValue(formData, "customCategory");
  const categoryLabelEn = stringValue(formData, "categoryLabel_en");
  const categoryLabelPt = stringValue(formData, "categoryLabel_pt");
  const categoryLabelNl = stringValue(formData, "categoryLabel_nl");
  const neighborhood = stringValue(formData, "neighborhood");
  const latitude = numberValue(formData, "latitude");
  const longitude = numberValue(formData, "longitude");
  const detail = stringValue(formData, "detail");
  const website = cleanUrl(stringValue(formData, "website"));

  if (!city._id || !name || latitude === null || longitude === null) {
    return;
  }

  const isCustom = categoryPreset === "custom";
  const mapPlace = {
    _type: "object",
    _key: `place-${Date.now()}`,
    name,
    categoryPreset: isCustom ? "custom" : categoryPreset || undefined,
    category: isCustom
      ? customCategory || slugish(categoryLabelEn || name)
      : undefined,
    categoryLabel_en: isCustom ? categoryLabelEn || customCategory : undefined,
    categoryLabel_pt: isCustom ? categoryLabelPt : undefined,
    categoryLabel_nl: isCustom ? categoryLabelNl : undefined,
    neighborhood: neighborhood || undefined,
    latitude,
    longitude,
    detail_en: detail || undefined,
    description_en: detail || undefined,
    website: website || undefined,
  };

  await writeClient.patch(city._id).setIfMissing({ mapPlaces: [] }).append("mapPlaces", [
    mapPlace,
  ]).commit();

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/cities");
  revalidatePath(`/dashboard/cities/${citySlug}`);
  revalidatePath(`/dashboard/cities/${citySlug}/map`);
  revalidatePath(`/dashboard/admin/cities/${citySlug}/map`);
  revalidatePath(`/brazil/${citySlug}`);
  revalidatePath(`/pt/brasil/${citySlug}`);
  revalidatePath(`/nl/brazilie/${citySlug}`);
}
