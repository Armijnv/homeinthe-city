"use server";

import { revalidatePath } from "next/cache";
import { mapCategoryPresets } from "@/app/lib/mapCategories";
import { cityChangeLogDocument } from "@/app/lib/cityChangeLog";
import { requireCityHost } from "@/app/lib/dashboard";
import { assertSanityWriteToken, writeClient } from "@/sanity/lib/writeClient";

export type CityDashboardActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  submittedAt?: number;
};

class CityDashboardActionError extends Error {}

type SidebarCardInput = {
  _key?: string;
  title_en?: string;
  title_pt?: string;
  title_nl?: string;
  text_en?: string;
  text_pt?: string;
  text_nl?: string;
  button_en?: string;
  button_pt?: string;
  button_nl?: string;
  href_en?: string;
  href_pt?: string;
  href_nl?: string;
};

type RecommendationInput = {
  _key?: string;
  name_en?: string;
  name_pt?: string;
  name_nl?: string;
  categoryPreset?: string;
  category?: string;
  categoryLabel_en?: string;
  categoryLabel_pt?: string;
  categoryLabel_nl?: string;
  neighborhood?: string;
  detail_en?: string;
  detail_pt?: string;
  detail_nl?: string;
  description_en?: string;
  description_pt?: string;
  description_nl?: string;
  website?: string;
  favorite?: boolean;
};

const languages = ["en", "pt", "nl"] as const;
const supportedCategoryPresetIds = new Set<string>(
  mapCategoryPresets.map((category) => category.id),
);

function stringValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanBoolean(value: unknown) {
  return value === true || value === "true" || value === "on";
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
  if (
    value.startsWith("/") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  return `https://${value}`;
}

function safeArrayFromJson<T>(value: string, fallbackMessage: string): T[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed as T[];
  } catch {
    throw new CityDashboardActionError(fallbackMessage);
  }

  throw new CityDashboardActionError(fallbackMessage);
}

function keyFromValue(prefix: string, fallback: string, index: number) {
  const base = slugish(fallback || `${prefix}-${index + 1}`);
  return `${prefix}-${base}-${index + 1}`;
}

function preserveOrCreateKey(value: unknown, prefix: string, fallback: string, index: number) {
  const key = cleanText(value);
  return /^[A-Za-z0-9_-]+$/.test(key)
    ? key
    : keyFromValue(prefix, fallback, index);
}

function introBlocksFromForm(formData: FormData, lang: string) {
  return stringValue(formData, `introBlocks_${lang}`)
    .split(/\n{2,}|\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function sanitizeSidebarCards(rawCards: SidebarCardInput[]) {
  return rawCards.flatMap((card, index) => {
    const titleEn = cleanText(card.title_en);
    const titlePt = cleanText(card.title_pt);
    const titleNl = cleanText(card.title_nl);
    const textEn = cleanText(card.text_en);
    const textPt = cleanText(card.text_pt);
    const textNl = cleanText(card.text_nl);
    const buttonEn = cleanText(card.button_en);
    const buttonPt = cleanText(card.button_pt);
    const buttonNl = cleanText(card.button_nl);
    const hrefEn = cleanUrl(cleanText(card.href_en));
    const hrefPt = cleanUrl(cleanText(card.href_pt));
    const hrefNl = cleanUrl(cleanText(card.href_nl));

    if (
      !titleEn &&
      !titlePt &&
      !titleNl &&
      !textEn &&
      !textPt &&
      !textNl &&
      !buttonEn &&
      !buttonPt &&
      !buttonNl &&
      !hrefEn &&
      !hrefPt &&
      !hrefNl
    ) {
      return [];
    }

    return [
      {
        _type: "object",
        _key: preserveOrCreateKey(card._key, "sidebar", titleEn || titlePt || titleNl, index),
        title_en: titleEn || undefined,
        title_pt: titlePt || undefined,
        title_nl: titleNl || undefined,
        text_en: textEn || undefined,
        text_pt: textPt || undefined,
        text_nl: textNl || undefined,
        button_en: buttonEn || undefined,
        button_pt: buttonPt || undefined,
        button_nl: buttonNl || undefined,
        href_en: hrefEn || undefined,
        href_pt: hrefPt || undefined,
        href_nl: hrefNl || undefined,
      },
    ];
  });
}

function sanitizeRecommendations(rawRecommendations: RecommendationInput[]) {
  return rawRecommendations.flatMap((recommendation, index) => {
    const nameEn = cleanText(recommendation.name_en);
    const namePt = cleanText(recommendation.name_pt);
    const nameNl = cleanText(recommendation.name_nl);
    const categoryPreset = cleanText(recommendation.categoryPreset);
    const isCustom = categoryPreset === "custom";
    const customCategory = cleanText(recommendation.category);
    const categoryLabelEn = cleanText(recommendation.categoryLabel_en);
    const categoryLabelPt = cleanText(recommendation.categoryLabel_pt);
    const categoryLabelNl = cleanText(recommendation.categoryLabel_nl);
    const neighborhood = cleanText(recommendation.neighborhood);
    const detailEn = cleanText(recommendation.detail_en);
    const detailPt = cleanText(recommendation.detail_pt);
    const detailNl = cleanText(recommendation.detail_nl);
    const descriptionEn = cleanText(recommendation.description_en);
    const descriptionPt = cleanText(recommendation.description_pt);
    const descriptionNl = cleanText(recommendation.description_nl);
    const website = cleanUrl(cleanText(recommendation.website));
    const fallbackName = nameEn || namePt || nameNl;

    if (
      !fallbackName &&
      !neighborhood &&
      !detailEn &&
      !detailPt &&
      !detailNl &&
      !descriptionEn &&
      !descriptionPt &&
      !descriptionNl &&
      !website
    ) {
      return [];
    }

    if (!fallbackName) {
      throw new CityDashboardActionError(
        "Each recommendation needs at least one name.",
      );
    }

    if (
      categoryPreset &&
      categoryPreset !== "custom" &&
      !supportedCategoryPresetIds.has(categoryPreset)
    ) {
      throw new CityDashboardActionError(
        `Unsupported recommendation category: ${categoryPreset}.`,
      );
    }

    return [
      {
        _type: "object",
        _key: preserveOrCreateKey(
          recommendation._key,
          "recommendation",
          fallbackName,
          index,
        ),
        name: nameEn || fallbackName,
        name_en: nameEn || undefined,
        name_pt: namePt || undefined,
        name_nl: nameNl || undefined,
        categoryPreset: isCustom ? "custom" : categoryPreset || "restaurant",
        category: isCustom
          ? customCategory || slugish(categoryLabelEn || fallbackName)
          : undefined,
        categoryLabel_en: isCustom
          ? categoryLabelEn || customCategory || undefined
          : undefined,
        categoryLabel_pt: isCustom ? categoryLabelPt || undefined : undefined,
        categoryLabel_nl: isCustom ? categoryLabelNl || undefined : undefined,
        neighborhood: neighborhood || undefined,
        detail_en: detailEn || undefined,
        detail_pt: detailPt || undefined,
        detail_nl: detailNl || undefined,
        description_en: descriptionEn || undefined,
        description_pt: descriptionPt || undefined,
        description_nl: descriptionNl || undefined,
        website: website || undefined,
        favorite: cleanBoolean(recommendation.favorite) || undefined,
      },
    ];
  });
}

function actionErrorState(error: unknown): CityDashboardActionState {
  const fallback = "The city could not be saved. Please check the fields and try again.";
  const message =
    error instanceof CityDashboardActionError
      ? error.message
      : error instanceof Error && error.message.includes("SANITY_API_WRITE_TOKEN")
        ? "Dashboard saving is not configured. Please ask an admin to check the Sanity write token."
        : fallback;

  return {
    status: "error",
    message,
    submittedAt: Date.now(),
  };
}

function revalidateCityPaths(citySlug: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/cities");
  revalidatePath("/dashboard/admin/city-changes");
  revalidatePath(`/dashboard/cities/${citySlug}`);
  revalidatePath(`/dashboard/admin/cities/${citySlug}`);
  revalidatePath(`/brazil/${citySlug}`);
  revalidatePath(`/pt/brasil/${citySlug}`);
  revalidatePath(`/nl/brazilie/${citySlug}`);
}

export async function saveCityContentAction(
  citySlug: string,
  _previousState: CityDashboardActionState,
  formData: FormData,
): Promise<CityDashboardActionState> {
  try {
    const context = await requireCityHost(citySlug);
    const { city } = context;
    assertSanityWriteToken();

    if (!city._id) {
      throw new CityDashboardActionError("This city could not be found.");
    }

    const sidebarCards = sanitizeSidebarCards(
      safeArrayFromJson<SidebarCardInput>(
        stringValue(formData, "sidebarCardsJson"),
        "Sidebar cards could not be read. Please reload and try again.",
      ),
    );

    const setValues: Record<string, unknown> = {
      sidebarCards,
      enabledLanguages: Array.from(
        new Set(
          formData
            .getAll("enabledLanguages")
            .map(String)
            .filter((lang) => languages.includes(lang as (typeof languages)[number])),
        ),
      ),
    };

    if (!(setValues.enabledLanguages as string[]).includes("en")) {
      throw new CityDashboardActionError("English must remain enabled.");
    }

    for (const lang of languages) {
      setValues[`headline_${lang}`] = stringValue(formData, `headline_${lang}`) || undefined;
      setValues[`intro_${lang}`] = stringValue(formData, `intro_${lang}`) || undefined;
      setValues[`introBlocks_${lang}`] = introBlocksFromForm(formData, lang);
    }

    const unsetPaths = Object.entries(setValues)
      .filter(([, value]) => value === undefined)
      .map(([path]) => path);
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
      changeType: "cityContent",
      description: "Updated city guide content, sidebar cards, or languages.",
    });
    if (changeLog) transaction.create(changeLog);
    await transaction.commit();
    revalidateCityPaths(citySlug);

    return {
      status: "success",
      message: "City content saved.",
      submittedAt: Date.now(),
    };
  } catch (error) {
    return actionErrorState(error);
  }
}

export async function saveCityRecommendationsAction(
  citySlug: string,
  _previousState: CityDashboardActionState,
  formData: FormData,
): Promise<CityDashboardActionState> {
  try {
    const context = await requireCityHost(citySlug);
    const { city } = context;
    assertSanityWriteToken();

    if (!city._id) {
      throw new CityDashboardActionError("This city could not be found.");
    }

    const recommendations = sanitizeRecommendations(
      safeArrayFromJson<RecommendationInput>(
        stringValue(formData, "recommendationsJson"),
        "Recommendations could not be read. Please reload and try again.",
      ),
    );

    const transaction = writeClient
      .transaction()
      .patch(city._id, { set: { recommendations } });
    const changeLog = cityChangeLogDocument({
      context,
      city,
      changeType: "recommendations",
      description: `Updated ${recommendations.length} city recommendation${recommendations.length === 1 ? "" : "s"}.`,
    });
    if (changeLog) transaction.create(changeLog);
    await transaction.commit();
    revalidateCityPaths(citySlug);

    return {
      status: "success",
      message: "Recommendations saved.",
      submittedAt: Date.now(),
    };
  } catch (error) {
    return actionErrorState(error);
  }
}
