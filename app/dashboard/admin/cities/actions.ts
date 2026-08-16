"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/app/lib/dashboard";
import { client } from "@/sanity/lib/client";
import { assertSanityWriteToken, writeClient } from "@/sanity/lib/writeClient";
import { cityChangeLogDocument } from "@/app/lib/cityChangeLog";

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
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/activity");
  revalidatePath(`/dashboard/cities/${citySlug}`);
  revalidatePath(`/dashboard/admin/cities/${citySlug}`);
}

export async function createCityAction(formData: FormData) {
  const context = await requireAdmin("/dashboard/admin/cities/new");

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

    const cityDocument = {
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
    };
    const changeLog = cityChangeLogDocument({
      context,
      city: cityDocument,
      changeType: "cityCreated",
      description: `Created city workspace: ${nameEn}.`,
      changes: [{ field: "city", beforeValue: undefined, afterValue: cityDocument }],
    });
    let transaction = writeClient.transaction().create(cityDocument);
    if (changeLog) transaction = transaction.create(changeLog);
    await transaction.commit();

    revalidateCityManagement(citySlug);
  } catch (error) {
    redirect(
      `/dashboard/admin/cities/new?error=${encodeURIComponent(cityErrorMessage(error))}`,
    );
  }

  redirect(`/dashboard/cities/${citySlug}`);
}

export async function updateCityStatusAction(formData: FormData) {
  const context = await requireAdmin("/dashboard/admin/cities");

  const cityId = cleanDocumentId(formString(formData, "cityId"));
  const citySlug = cleanSlug(formString(formData, "citySlug"));
  const guideStatus = formString(formData, "guideStatus");

  if (!cityId || !citySlug) redirect("/dashboard/admin/cities");

  try {
    assertSanityWriteToken();

    if (!allowedGuideStatuses.has(guideStatus)) {
      throw new CityAdminError("Choose a valid city visibility status.");
    }

    const existing = await client.fetch<{ _id: string; _rev: string; guideStatus?: string; name_en?: string; name_pt?: string; name_nl?: string; slug?: { current?: string } } | null>(
      `*[
        _type == "city" &&
        _id == $cityId &&
        slug.current == $citySlug
      ][0]{_id, _rev, guideStatus, name_en, name_pt, name_nl, slug}`,
      { cityId, citySlug },
    );
    if (!existing) throw new CityAdminError("City not found.");
    if (existing.guideStatus === guideStatus) {
      revalidateCityManagement(citySlug);
    } else {
      const changeLog = cityChangeLogDocument({
        context,
        city: existing,
        changeType: "cityStatus",
        description: `Changed ${existing.name_en || existing.name_pt || existing.name_nl || citySlug} publication status to ${guideStatus}.`,
        changes: [{ field: "guideStatus", beforeValue: existing.guideStatus, afterValue: guideStatus }],
      });
      let transaction = writeClient.transaction().patch(cityId, (patch) => patch.ifRevisionId(existing._rev).set({ guideStatus }));
      if (changeLog) transaction = transaction.create(changeLog);
      await transaction.commit();
      revalidateCityManagement(citySlug);
    }
  } catch (error) {
    redirect(
      `/dashboard/admin/cities/${citySlug}?error=${encodeURIComponent(cityErrorMessage(error))}`,
    );
  }

  redirect(`/dashboard/admin/cities/${citySlug}?saved=status`);
}

export async function updateCityCoordinatesAction(formData: FormData) {
  const context = await requireAdmin("/dashboard/admin/cities");

  const cityId = cleanDocumentId(formString(formData, "cityId"));
  const citySlug = cleanSlug(formString(formData, "citySlug"));

  if (!cityId || !citySlug) redirect("/dashboard/admin/cities");

  try {
    assertSanityWriteToken();
    const coordinates = cityCoordinates(formData, true);
    if (!coordinates) {
      throw new CityAdminError("Add both latitude and longitude.");
    }

    const existing = await client.fetch<{ _id: string; _rev: string; latitude?: number; longitude?: number; name_en?: string; name_pt?: string; name_nl?: string; slug?: { current?: string } } | null>(
      `*[
        _type == "city" &&
        _id == $cityId &&
        slug.current == $citySlug
      ][0]{_id, _rev, latitude, longitude, name_en, name_pt, name_nl, slug}`,
      { cityId, citySlug },
    );
    if (!existing) throw new CityAdminError("City not found.");
    if (existing.latitude !== coordinates.latitude || existing.longitude !== coordinates.longitude) {
      const changeLog = cityChangeLogDocument({
        context,
        city: existing,
        changeType: "cityCoordinates",
        description: `Updated coordinates for ${existing.name_en || existing.name_pt || existing.name_nl || citySlug}.`,
        changes: [
          { field: "latitude", beforeValue: existing.latitude, afterValue: coordinates.latitude },
          { field: "longitude", beforeValue: existing.longitude, afterValue: coordinates.longitude },
        ],
      });
      let transaction = writeClient.transaction().patch(cityId, (patch) => patch.ifRevisionId(existing._rev).set(coordinates));
      if (changeLog) transaction = transaction.create(changeLog);
      await transaction.commit();
    }
    revalidateCityManagement(citySlug);
  } catch (error) {
    redirect(
      `/dashboard/admin/cities/${citySlug}?error=${encodeURIComponent(cityErrorMessage(error))}`,
    );
  }

  redirect(`/dashboard/admin/cities/${citySlug}?saved=coordinates`);
}

export async function updateCityIdentityAction(formData: FormData) {
  const context = await requireAdmin("/dashboard/admin/cities");
  const cityId = cleanDocumentId(formString(formData, "cityId"));
  const citySlug = cleanSlug(formString(formData, "citySlug"));
  if (!cityId || !citySlug) redirect("/dashboard/admin/cities");
  try {
    assertSanityWriteToken();
    const name_en = formString(formData, "name_en");
    const name_pt = formString(formData, "name_pt");
    const name_nl = formString(formData, "name_nl");
    const country = formString(formData, "country");
    const primaryHostId = cleanDocumentId(formString(formData, "primaryHostId"));
    const enabledLanguages = selectedStrings(formData, "enabledLanguages");
    if (!name_en) throw new CityAdminError("English city name is required.");
    if (enabledLanguages.some((language) => !allowedLanguages.has(language))) throw new CityAdminError("Choose only supported city languages.");
    if (primaryHostId) {
      const host = await client.fetch<string | null>(`*[_type == "provider" && _id == $id && status == "published" && (primaryRole == "host" || "host" in roles)][0]._id`, { id: primaryHostId });
      if (!host) throw new CityAdminError("Choose a published city host.");
    }
    const existing = await client.fetch<{_id:string;_rev:string;name_en?:string;slug?:{current?:string}} | null>(`*[_type == "city" && _id == $id && slug.current == $slug][0]{_id,_rev,name_en,slug}`, {id:cityId,slug:citySlug});
    if (!existing) throw new CityAdminError("City not found.");
    const values = { name_en, ...(name_pt ? {name_pt} : {}), ...(name_nl ? {name_nl} : {}), ...(country ? {country} : {}), ...(enabledLanguages.length ? {enabledLanguages} : {}), ...(primaryHostId ? {primaryHost:{_type:"reference",_ref:primaryHostId}} : {}) };
    const unset = [!name_pt && "name_pt", !name_nl && "name_nl", !country && "country", !enabledLanguages.length && "enabledLanguages", !primaryHostId && "primaryHost"].filter((field): field is string => Boolean(field));
    const log = cityChangeLogDocument({context, city: existing, changeType:"cityIdentity", description:`Updated city identity settings for ${name_en}.`, changes:[]});
    let transaction = writeClient.transaction().patch(cityId, (patch) => patch.ifRevisionId(existing._rev).set(values).unset(unset));
    if (log) transaction = transaction.create(log);
    await transaction.commit();
    revalidateCityManagement(citySlug);
  } catch (error) { redirect(`/dashboard/admin/cities/${citySlug}?error=${encodeURIComponent(cityErrorMessage(error))}`); }
  redirect(`/dashboard/admin/cities/${citySlug}?saved=identity`);
}
