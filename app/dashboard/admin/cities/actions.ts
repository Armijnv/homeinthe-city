"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";
import { assertSanityWriteToken, writeClient } from "@/sanity/lib/writeClient";

class CityAdminError extends Error {}

const allowedGuideStatuses = new Set(["hidden", "comingSoon", "live"]);
const allowedLanguages = new Set(["en", "pt", "nl"]);

function formString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function cityCoordinates(formData: FormData, required = false) {
  const latitudeValue = formString(formData, "latitude");
  const longitudeValue = formString(formData, "longitude");

  if (!latitudeValue && !longitudeValue && !required) return null;
  if (!latitudeValue || !longitudeValue) {
    throw new CityAdminError("Add both latitude and longitude.");
  }

  const latitude = Number(latitudeValue);
  const longitude = Number(longitudeValue);

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new CityAdminError("Latitude must be a number between -90 and 90.");
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new CityAdminError("Longitude must be a number between -180 and 180.");
  }

  return { latitude, longitude };
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

function cleanSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanDocumentId(value: string) {
  return /^[A-Za-z0-9_.-]+$/.test(value) ? value : "";
}

function optionalFields(values: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => Boolean(value)),
  );
}

function cityErrorMessage(error: unknown) {
  if (error instanceof CityAdminError) return error.message;
  if (error instanceof Error && error.message.includes("SANITY_API_WRITE_TOKEN")) {
    return "City saving is not configured. Check the Sanity write token.";
  }
  return "The city could not be saved. Please review the fields and try again.";
}

function revalidateCityManagement(citySlug: string) {
  revalidatePath("/", "layout");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/cities");
  revalidatePath("/dashboard/admin/cities");
  revalidatePath(`/dashboard/cities/${citySlug}`);
  revalidatePath(`/dashboard/admin/cities/${citySlug}`);
}

export async function createCityAction(formData: FormData) {
  await requireAdmin("/dashboard/admin/cities/new");

  let citySlug = "";

  try {
    assertSanityWriteToken();

    const nameEn = formString(formData, "name_en");
    const namePt = formString(formData, "name_pt");
    const nameNl = formString(formData, "name_nl");
    citySlug = cleanSlug(formString(formData, "slug"));
    const country = formString(formData, "country");
    const guideStatus = formString(formData, "guideStatus") || "hidden";
    const primaryHostId = cleanDocumentId(formString(formData, "primaryHostId"));
    const enabledLanguages = selectedStrings(formData, "enabledLanguages");
    const coordinates = cityCoordinates(formData);

    if (!nameEn) throw new CityAdminError("City name is required.");
    if (!citySlug) throw new CityAdminError("City slug is required.");
    if (!allowedGuideStatuses.has(guideStatus)) {
      throw new CityAdminError("Choose a valid city visibility status.");
    }
    if (enabledLanguages.some((language) => !allowedLanguages.has(language))) {
      throw new CityAdminError("Choose only supported city languages.");
    }

    const duplicateId = await client.fetch<string | null>(
      `*[_type == "city" && slug.current == $citySlug][0]._id`,
      { citySlug },
    );
    if (duplicateId) throw new CityAdminError("That city slug is already in use.");

    if (primaryHostId) {
      const validHostId = await client.fetch<string | null>(
        `*[
          _type == "provider" &&
          _id == $primaryHostId &&
          status == "published" &&
          (primaryRole == "host" || "host" in roles)
        ][0]._id`,
        { primaryHostId },
      );
      if (!validHostId) {
        throw new CityAdminError("Choose a published city host.");
      }
    }

    const cityId = `city-${citySlug}`;
    const existingId = await client.fetch<string | null>(
      `*[_type == "city" && _id == $cityId][0]._id`,
      { cityId },
    );
    if (existingId) throw new CityAdminError("That city already exists.");

    await writeClient.create({
      _id: cityId,
      _type: "city",
      name_en: nameEn,
      ...optionalFields({
        name_pt: namePt,
        name_nl: nameNl,
        country,
        headline_en: formString(formData, "headline_en"),
        headline_pt: formString(formData, "headline_pt"),
        headline_nl: formString(formData, "headline_nl"),
        intro_en: formString(formData, "intro_en"),
        intro_pt: formString(formData, "intro_pt"),
        intro_nl: formString(formData, "intro_nl"),
      }),
      slug: { _type: "slug", current: citySlug },
      guideStatus,
      ...(coordinates || {}),
      ...(primaryHostId
        ? {
            primaryHost: {
              _type: "reference",
              _ref: primaryHostId,
            },
          }
        : {}),
      ...(enabledLanguages.length ? { enabledLanguages } : {}),
    });

    revalidateCityManagement(citySlug);
  } catch (error) {
    redirect(
      `/dashboard/admin/cities/new?error=${encodeURIComponent(cityErrorMessage(error))}`,
    );
  }

  redirect(`/dashboard/cities/${citySlug}`);
}

export async function updateCityStatusAction(formData: FormData) {
  await requireAdmin("/dashboard/admin/cities");

  const cityId = cleanDocumentId(formString(formData, "cityId"));
  const citySlug = cleanSlug(formString(formData, "citySlug"));
  const guideStatus = formString(formData, "guideStatus");

  if (!cityId || !citySlug) redirect("/dashboard/admin/cities");

  try {
    assertSanityWriteToken();

    if (!allowedGuideStatuses.has(guideStatus)) {
      throw new CityAdminError("Choose a valid city visibility status.");
    }

    const existingId = await client.fetch<string | null>(
      `*[
        _type == "city" &&
        _id == $cityId &&
        slug.current == $citySlug
      ][0]._id`,
      { cityId, citySlug },
    );
    if (!existingId) throw new CityAdminError("City not found.");

    await writeClient.patch(cityId).set({ guideStatus }).commit();
    revalidateCityManagement(citySlug);
  } catch (error) {
    redirect(
      `/dashboard/admin/cities/${citySlug}?error=${encodeURIComponent(cityErrorMessage(error))}`,
    );
  }

  redirect(`/dashboard/admin/cities/${citySlug}?saved=status`);
}

export async function updateCityCoordinatesAction(formData: FormData) {
  await requireAdmin("/dashboard/admin/cities");

  const cityId = cleanDocumentId(formString(formData, "cityId"));
  const citySlug = cleanSlug(formString(formData, "citySlug"));

  if (!cityId || !citySlug) redirect("/dashboard/admin/cities");

  try {
    assertSanityWriteToken();
    const coordinates = cityCoordinates(formData, true);
    if (!coordinates) {
      throw new CityAdminError("Add both latitude and longitude.");
    }

    const existingId = await client.fetch<string | null>(
      `*[
        _type == "city" &&
        _id == $cityId &&
        slug.current == $citySlug
      ][0]._id`,
      { cityId, citySlug },
    );
    if (!existingId) throw new CityAdminError("City not found.");

    await writeClient.patch(cityId).set(coordinates).commit();
    revalidateCityManagement(citySlug);
  } catch (error) {
    redirect(
      `/dashboard/admin/cities/${citySlug}?error=${encodeURIComponent(cityErrorMessage(error))}`,
    );
  }

  redirect(`/dashboard/admin/cities/${citySlug}?saved=coordinates`);
}
