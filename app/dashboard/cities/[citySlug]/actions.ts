"use server";

import { revalidatePath } from "next/cache";
import { cityChangeLogDocument } from "@/app/lib/cityChangeLog";
import { requireCityHost } from "@/app/lib/dashboard";
import { recommendationGuideCategories } from "@/app/lib/recommendationGuides";
import { uploadSanityImage } from "@/app/lib/sanityImageUpload";
import { assertSanityWriteToken, writeClient } from "@/sanity/lib/writeClient";
import { client } from "@/sanity/lib/client";
import { activityFieldChanges, keyedArrayActivityChanges } from "@/app/lib/activityChanges";
import {
  cityPageExperienceFieldNames,
  type CityPageExperience,
  type LivingServicePresentation,
} from "@/app/lib/cityPageExperience";

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

type RecommendationGuideInput = {
  _key?: string;
  title_en?: string;
  title_pt?: string;
  title_nl?: string;
  introduction_en?: string;
  introduction_pt?: string;
  introduction_nl?: string;
  content_en?: string;
  content_pt?: string;
  content_nl?: string;
  recommendationType?: string;
  customCategory_en?: string;
  customCategory_pt?: string;
  customCategory_nl?: string;
  relatedMapPlaceKeys?: string[];
  featuredImage?: {
    _type?: string;
    asset?: { _type?: string; _ref?: string };
    alt?: string;
    crop?: { top?: number; bottom?: number; left?: number; right?: number };
    hotspot?: { x?: number; y?: number; height?: number; width?: number };
  };
  relatedProvider?: { _type?: string; _ref?: string };
  relatedCity?: { _type?: string; _ref?: string };
};

type CityContentRecord = Record<string, unknown> & {
  _rev: string;
  heroImage?: {
    _type?: string;
    alt?: string;
    asset?: { _type?: string; _ref?: string };
    crop?: { top?: number; bottom?: number; left?: number; right?: number };
    hotspot?: { x?: number; y?: number; height?: number; width?: number };
  };
  sidebarCards?: SidebarCardInput[];
  recommendationGuides?: RecommendationGuideInput[];
  cityPageExperience?: CityPageExperience;
};

const languages = ["en", "pt", "nl"] as const;
const livingServiceKeys = ["interpreter", "realEstate"] as const;
const livingServiceFields = ["title", "description", "buttonLabel"] as const;
const supportedRecommendationTypes = new Set<string>(
  recommendationGuideCategories.map((category) => category.id),
);

function stringValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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

function introBlocksFromForm(
  formData: FormData,
  lang: string,
  preserveLineBreaks = false,
) {
  return stringValue(formData, `introBlocks_${lang}`)
    .split(preserveLineBreaks ? /\r?\n\s*\r?\n/ : /\n{2,}|\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

async function uploadedLivingServiceImage(
  formData: FormData,
  serviceKey: (typeof livingServiceKeys)[number],
) {
  const entry = formData.get(`livingServiceImage-${serviceKey}`);
  const selected =
    stringValue(formData, `livingServiceImageSelected-${serviceKey}`) === "1";

  if (!(entry instanceof File) || entry.size === 0) {
    if (selected) {
      throw new CityDashboardActionError(
        "The service card image was not received. Please select it again.",
      );
    }
    return undefined;
  }

  const fallbackAlt =
    serviceKey === "interpreter"
      ? "Interpreter services in Porto Alegre"
      : "Real estate in Porto Alegre";

  try {
    return await uploadSanityImage(
      entry,
      stringValue(formData, `livingServiceImageAlt-${serviceKey}`) ||
        fallbackAlt,
    );
  } catch (error) {
    console.error("Living service image upload failed", error);
    throw new CityDashboardActionError(
      error instanceof Error
        ? `The service card image could not be uploaded: ${error.message}`
        : "The service card image could not be uploaded. Please try again.",
    );
  }
}

async function cityPageExperienceFromForm(
  formData: FormData,
  existingExperience?: CityPageExperience,
) {
  const nextExperience: Record<string, unknown> = {
    ...existingExperience,
    _type: "object",
  };

  for (const lang of languages) {
    const existingLocale = {
      ...((existingExperience?.[lang] || {}) as Record<string, unknown>),
    };
    const nextLocale: Record<string, unknown> = {
      _type: "object",
      ...existingLocale,
    };

    for (const field of cityPageExperienceFieldNames) {
      const inputName = `experience_${lang}_${field}`;
      if (!formData.has(inputName)) continue;

      const value = stringValue(formData, inputName);
      if (value) {
        nextLocale[field] = value;
      } else {
        delete nextLocale[field];
      }
    }

    nextExperience[lang] = nextLocale;
  }

  const existingServices = existingExperience?.livingServices || {};
  const nextServices: Record<string, unknown> = {
    _type: "object",
    ...existingServices,
  };

  for (const serviceKey of livingServiceKeys) {
    const existingService = existingServices[serviceKey];
    const nextService: Record<string, unknown> = {
      _type: "object",
      ...existingService,
    };

    for (const lang of languages) {
      const existingLocale = existingService?.[lang] || {};
      const nextLocale: Record<string, unknown> = {
        _type: "object",
        ...existingLocale,
      };

      for (const field of livingServiceFields) {
        const inputName = `livingService_${serviceKey}_${lang}_${field}`;
        if (!formData.has(inputName)) continue;

        const value = stringValue(formData, inputName);
        if (value) nextLocale[field] = value;
        else delete nextLocale[field];
      }

      if (Object.keys(nextLocale).some((key) => key !== "_type")) {
        nextService[lang] = nextLocale;
      } else {
        delete nextService[lang];
      }
    }

    const uploadedImage = await uploadedLivingServiceImage(formData, serviceKey);
    const removeImage =
      stringValue(formData, `removeLivingServiceImage-${serviceKey}`) === "on";
    const existingImage = existingService?.image;

    if (uploadedImage) {
      nextService.image = uploadedImage;
    } else if (removeImage) {
      delete nextService.image;
    } else if (existingImage?.asset?._ref) {
      nextService.image = {
        ...existingImage,
        alt:
          stringValue(formData, `livingServiceImageAlt-${serviceKey}`) ||
          existingImage.alt,
      };
    }

    if (Object.keys(nextService).some((key) => key !== "_type")) {
      nextServices[serviceKey] = nextService as LivingServicePresentation;
    } else {
      delete nextServices[serviceKey];
    }
  }

  if (Object.keys(nextServices).some((key) => key !== "_type")) {
    nextExperience.livingServices = nextServices;
  } else {
    delete nextExperience.livingServices;
  }

  return nextExperience;
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

function cleanReference(value: RecommendationGuideInput["relatedProvider"]) {
  const ref = cleanText(value?._ref);
  return ref ? { _type: "reference", _ref: ref } : undefined;
}

function cleanFeaturedImage(value: RecommendationGuideInput["featuredImage"]) {
  const ref = cleanText(value?.asset?._ref);
  if (!ref) return undefined;

  return {
    _type: "image",
    asset: { _type: "reference", _ref: ref },
    alt: cleanText(value?.alt) || undefined,
    crop: value?.crop,
    hotspot: value?.hotspot,
  };
}

async function uploadedRecommendationImage(
  formData: FormData,
  recommendationKey: string,
  fallbackAlt: string,
) {
  const entry = formData.get(`featuredImage-${recommendationKey}`);
  const selected = stringValue(
    formData,
    `featuredImageSelected-${recommendationKey}`,
  ) === "1";

  if (!(entry instanceof File) || entry.size === 0) {
    if (selected) {
      throw new CityDashboardActionError(
        `The featured image for “${fallbackAlt}” was not received. Please select it again.`,
      );
    }
    return undefined;
  }

  try {
    return await uploadSanityImage(
      entry,
      (
        stringValue(formData, `featuredImageAlt-${recommendationKey}`) ||
        fallbackAlt
      ),
    );
  } catch (error) {
    console.error("Recommendation guide image upload failed", error);
    throw new CityDashboardActionError(
      error instanceof Error
        ? `The featured image for “${fallbackAlt}” could not be uploaded: ${error.message}`
        : `The featured image for “${fallbackAlt}” could not be uploaded. Please try again.`,
    );
  }
}

async function uploadedCityHeroImage(formData: FormData) {
  const entry = formData.get("heroImage");
  const selected = stringValue(formData, "heroImageSelected") === "1";

  if (!(entry instanceof File) || entry.size === 0) {
    if (selected) {
      throw new CityDashboardActionError(
        "The city page background was not received. Please select it again.",
      );
    }
    return undefined;
  }

  try {
    return await uploadSanityImage(
      entry,
      "Porto Alegre city page background",
    );
  } catch (error) {
    console.error("City page background upload failed", error);
    throw new CityDashboardActionError(
      error instanceof Error
        ? `The city page background could not be uploaded: ${error.message}`
        : "The city page background could not be uploaded. Please try again.",
    );
  }
}

function sanitizeRecommendationGuides(rawGuides: RecommendationGuideInput[]) {
  return rawGuides.flatMap((recommendation, index) => {
    const titleEn = cleanText(recommendation.title_en);
    const titlePt = cleanText(recommendation.title_pt);
    const titleNl = cleanText(recommendation.title_nl);
    const introductionEn = cleanText(recommendation.introduction_en);
    const introductionPt = cleanText(recommendation.introduction_pt);
    const introductionNl = cleanText(recommendation.introduction_nl);
    const contentEn = cleanText(recommendation.content_en);
    const contentPt = cleanText(recommendation.content_pt);
    const contentNl = cleanText(recommendation.content_nl);
    const recommendationType = cleanText(recommendation.recommendationType) || "localExperience";
    const customCategoryEn = cleanText(recommendation.customCategory_en);
    const customCategoryPt = cleanText(recommendation.customCategory_pt);
    const customCategoryNl = cleanText(recommendation.customCategory_nl);
    const fallbackTitle = titleEn || titlePt || titleNl;

    if (!fallbackTitle && !introductionEn && !introductionPt && !introductionNl && !contentEn && !contentPt && !contentNl) {
      return [];
    }

    if (!fallbackTitle) {
      throw new CityDashboardActionError(
        "Each recommendation guide needs at least one title.",
      );
    }

    if (
      recommendationType !== "custom" &&
      !supportedRecommendationTypes.has(recommendationType)
    ) {
      throw new CityDashboardActionError(
        `Unsupported recommendation category: ${recommendationType}.`,
      );
    }

    if (recommendationType === "custom" && !customCategoryEn && !customCategoryPt && !customCategoryNl) {
      throw new CityDashboardActionError("Custom recommendation categories need a label.");
    }

    const relatedMapPlaceKeys = Array.from(
      new Set(
        (recommendation.relatedMapPlaceKeys || [])
          .map(cleanText)
          .filter((key) => /^[A-Za-z0-9_-]+$/.test(key)),
      ),
    );

    return [
      {
        _type: "object",
        _key: preserveOrCreateKey(
          recommendation._key,
          "recommendation",
          fallbackTitle,
          index,
        ),
        title_en: titleEn || undefined,
        title_pt: titlePt || undefined,
        title_nl: titleNl || undefined,
        introduction_en: introductionEn || undefined,
        introduction_pt: introductionPt || undefined,
        introduction_nl: introductionNl || undefined,
        content_en: contentEn || undefined,
        content_pt: contentPt || undefined,
        content_nl: contentNl || undefined,
        recommendationType,
        customCategory_en: recommendationType === "custom" ? customCategoryEn || undefined : undefined,
        customCategory_pt: recommendationType === "custom" ? customCategoryPt || undefined : undefined,
        customCategory_nl: recommendationType === "custom" ? customCategoryNl || undefined : undefined,
        relatedMapPlaceKeys: relatedMapPlaceKeys.length ? relatedMapPlaceKeys : undefined,
        featuredImage: cleanFeaturedImage(recommendation.featuredImage),
        relatedProvider: cleanReference(recommendation.relatedProvider),
        relatedCity: cleanReference(recommendation.relatedCity),
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
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/activity");
  revalidatePath(`/dashboard/cities/${citySlug}`);
  revalidatePath(`/dashboard/admin/cities/${citySlug}`);
  revalidatePath(`/brazil/${citySlug}`);
  revalidatePath(`/pt/brasil/${citySlug}`);
  revalidatePath(`/nl/brazilie/${citySlug}`);
}

function recommendationTitle(recommendation?: RecommendationGuideInput) {
  return recommendation?.title_en || recommendation?.title_pt || recommendation?.title_nl || "Untitled recommendation";
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
    const existing = await client.fetch<CityContentRecord | null>(
      `*[_type == "city" && _id == $cityId][0]{
        _rev, name_en, name_pt, name_nl, heroImage,
        headline_en, headline_pt, headline_nl,
        intro_en, intro_pt, intro_nl,
        introBlocks_en, introBlocks_pt, introBlocks_nl,
        cityPageExperience, sidebarCards, enabledLanguages
      }`,
      { cityId: city._id },
    );
    if (!existing) throw new CityDashboardActionError("This city could not be loaded for editing.");

    const sidebarCards = sanitizeSidebarCards(
      safeArrayFromJson<SidebarCardInput>(
        stringValue(formData, "sidebarCardsJson"),
        "Sidebar cards could not be read. Please reload and try again.",
      ),
    );

    const setValues: Record<string, unknown> = {
      sidebarCards,
    };

    if (context.isAdmin) {
      const inheritHostLanguages = stringValue(formData, "inheritHostLanguages") === "on";
      const enabledLanguages = Array.from(
        new Set(
          formData
            .getAll("enabledLanguages")
            .map(String)
            .filter((lang) => languages.includes(lang as (typeof languages)[number])),
        ),
      );

      if (!inheritHostLanguages && !enabledLanguages.length) {
        throw new CityDashboardActionError(
          "Choose at least one language or use the primary host languages.",
        );
      }

      setValues.enabledLanguages = inheritHostLanguages
        ? undefined
        : enabledLanguages;
    }

    for (const lang of languages) {
      if (citySlug === "porto-alegre") {
        setValues[`name_${lang}`] = stringValue(formData, `name_${lang}`) || undefined;
        setValues[`cta_${lang}`] = stringValue(formData, `cta_${lang}`) || undefined;
      }
      setValues[`headline_${lang}`] = stringValue(formData, `headline_${lang}`) || undefined;
      setValues[`intro_${lang}`] = stringValue(formData, `intro_${lang}`) || undefined;
      setValues[`introBlocks_${lang}`] = introBlocksFromForm(
        formData,
        lang,
        citySlug === "porto-alegre",
      );
    }

    if (citySlug === "porto-alegre") {
      setValues.cityPageExperience = await cityPageExperienceFromForm(
        formData,
        existing.cityPageExperience,
      );
      const uploadedHeroImage = await uploadedCityHeroImage(formData);
      if (uploadedHeroImage) {
        setValues.heroImage = uploadedHeroImage;
      } else if (stringValue(formData, "removeHeroImage") === "on") {
        setValues.heroImage = undefined;
      }
    }

    const unsetPaths = Object.entries(setValues)
      .filter(([, value]) => value === undefined)
      .map(([path]) => path);
    const cleanSetValues = Object.fromEntries(
      Object.entries(setValues).filter(([, value]) => value !== undefined),
    );
    const comparableBefore: Record<string, unknown> = {};
    const comparableAfter: Record<string, unknown> = {};
    for (const field of Object.keys(setValues)) {
      comparableBefore[field] = field === "sidebarCards" || field.startsWith("introBlocks_")
        ? existing?.[field] || []
        : existing?.[field];
      comparableAfter[field] = field === "sidebarCards" || field.startsWith("introBlocks_")
        ? setValues[field] || []
        : setValues[field];
    }
    const changes = activityFieldChanges(comparableBefore, comparableAfter);
    if (!changes.length) {
      return { status: "success", message: "No city content changes to save.", submittedAt: Date.now() };
    }
    const transaction = writeClient.transaction().patch(city._id, (patch) => {
      const nextPatch = patch.ifRevisionId(existing._rev).set(cleanSetValues);
      return unsetPaths.length ? nextPatch.unset(unsetPaths) : nextPatch;
    });
    const changeLog = cityChangeLogDocument({
      context,
      city,
      changeType: "cityContent",
      description:
        citySlug === "porto-alegre"
          ? "Updated Porto Alegre page content."
          : "Updated city guide content or sidebar cards.",
      changes,
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
    const existing = await client.fetch<CityContentRecord | null>(
      `*[_type == "city" && _id == $cityId][0]{_rev, recommendationGuides}`,
      { cityId: city._id },
    );
    if (!existing) throw new CityDashboardActionError("This city could not be loaded for editing.");

    const sanitizedGuides = sanitizeRecommendationGuides(
      safeArrayFromJson<RecommendationGuideInput>(
        stringValue(formData, "recommendationGuidesJson"),
        "Recommendations could not be read. Please reload and try again.",
      ),
    );
    const cityName = city.name_en || city.name_pt || city.name_nl || citySlug;
    const recommendationGuides = await Promise.all(
      sanitizedGuides.map(async (recommendation) => {
        const recommendationKey = recommendation._key;
        const title =
          recommendation.title_en ||
          recommendation.title_pt ||
          recommendation.title_nl ||
          "Recommendation guide";
        const fallbackAlt = `${title} in ${cityName}`;
        const uploadedImage = await uploadedRecommendationImage(
          formData,
          recommendationKey,
          fallbackAlt,
        );
        const removeImage =
          stringValue(
            formData,
            `removeFeaturedImage-${recommendationKey}`,
          ) === "on";
        const imageAlt =
          stringValue(
            formData,
            `featuredImageAlt-${recommendationKey}`,
          ) || fallbackAlt;
        const preservedImage = recommendation.featuredImage
          ? { ...recommendation.featuredImage, alt: imageAlt }
          : undefined;
        const featuredImage = uploadedImage || (removeImage ? undefined : preservedImage);
        const guideWithoutImage = { ...recommendation };
        delete guideWithoutImage.featuredImage;

        return featuredImage
          ? { ...guideWithoutImage, featuredImage }
          : guideWithoutImage;
      }),
    );

    const beforeGuides = existing?.recommendationGuides || [];
    const recommendationChanges = keyedArrayActivityChanges(beforeGuides, recommendationGuides);
    const activityLogs = recommendationChanges.map((change) => {
      const recommendation = change.after || change.before;
      const verb = change.type === "added" ? "Added" : change.type === "deleted" ? "Deleted" : "Updated";
      return cityChangeLogDocument({
        context,
        city,
        changeType: change.type === "added" ? "recommendationAdded" : change.type === "deleted" ? "recommendationDeleted" : "recommendationUpdated",
        description: `${verb} recommendation: ${recommendationTitle(recommendation)}.`,
        changes: [{ field: "recommendation", beforeValue: change.before, afterValue: change.after }],
      });
    });
    const logs = activityLogs.filter((log): log is NonNullable<typeof log> => Boolean(log));
    if (!logs.length) {
      return { status: "success", message: "No recommendation changes to save.", submittedAt: Date.now() };
    }
    let transaction = writeClient.transaction().patch(city._id, (patch) => patch.ifRevisionId(existing._rev).set({ recommendationGuides }));
    for (const log of logs) transaction = transaction.create(log);
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
