import type { Metadata } from "next";
import type { CityPageExperience } from "@/app/lib/cityPageExperience";
import type { CityInformationCard } from "@/app/lib/cityInformationCards";

export type CityGuideLang = "en" | "pt" | "nl";
export type CityGuideStatus = "live" | "comingSoon" | "hidden";
export type CityPageBackgroundMode = "default" | "custom" | "none";

export type CityGuideImage = {
  alt?: string;
  asset?: {
    url?: string;
  };
};

export type CityGuideMapPlace = {
  _key?: string;
  name_en?: string;
  name_pt?: string;
  name_nl?: string;
  categoryPreset?: string;
  categoryLabel_en?: string;
  categoryLabel_pt?: string;
  categoryLabel_nl?: string;
  neighborhood?: string;
  description_en?: string;
  description_pt?: string;
  description_nl?: string;
  detail_en?: string;
  detail_pt?: string;
  detail_nl?: string;
  latitude?: number;
  longitude?: number;
  googleMaps?: string;
  website?: string;
  favorite?: boolean;
  image?: CityGuideImage;
  video?: CityGuideImage;
};

export type CityGuideRecommendationGuide = {
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
  featuredImage?: CityGuideImage;
  relatedMapPlaceKeys?: string[];
  relatedProvider?: CityGuideProvider | null;
  relatedCity?: {
    name_en?: string;
    name_pt?: string;
    name_nl?: string;
    slug?: { current?: string };
  } | null;
};

export type CityGuideSidebarCard = {
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

export type CityGuideProvider = {
  name?: string;
  slug?: {
    current?: string;
  };
  status?: string;
  roles?: string[];
  primaryRole?: string;
  languages?: Array<{
    language?: string;
  }>;
  contactOptions?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    website?: string;
    preferredContact?: string;
  };
  mainPhoto?: CityGuideImage & {
    alt?: string;
  };
};

export type CityGuideContent = {
  _updatedAt?: string;
  name_en?: string;
  name_pt?: string;
  name_nl?: string;
  slug?: {
    current?: string;
  };
  guideStatus?: CityGuideStatus;
  enabledLanguages?: CityGuideLang[];
  latitude?: number;
  longitude?: number;
  country?: string | null;
  hasInterpreterCoverage?: boolean;
  primaryHost?: CityGuideProvider | null;
  heroImage?: CityGuideImage & { alt?: string };
  cityPageBackgroundMode?: CityPageBackgroundMode;
  headline_en?: string;
  headline_pt?: string;
  headline_nl?: string;
  intro_en?: string;
  intro_pt?: string;
  intro_nl?: string;
  introBlocks_en?: string[];
  introBlocks_pt?: string[];
  introBlocks_nl?: string[];
  cityPageExperience?: CityPageExperience;
  mapPlaces?: CityGuideMapPlace[];
  recommendationGuides?: CityGuideRecommendationGuide[];
  sidebarCards?: CityGuideSidebarCard[];
  informationCards?: CityInformationCard[];
  cta_en?: string;
  cta_pt?: string;
  cta_nl?: string;
};

export type CityGuideGlobeCity = {
  lat: number;
  lng: number;
  name: string;
  status: "live" | "comingSoon";
  href?: string;
  ariaLabel: string;
};

export const cityGuideSiteUrl = "https://homeinthe.city";

export const cityGuideLocale: Record<CityGuideLang, string> = {
  en: "en_US",
  pt: "pt_BR",
  nl: "nl_NL",
};

export const cityGuideInLanguage: Record<CityGuideLang, string> = {
  en: "en",
  pt: "pt-BR",
  nl: "nl-NL",
};

export function cityGuidePath(lang: CityGuideLang, citySlug: string) {
  if (lang === "pt") return `/pt/brasil/${citySlug}`;
  if (lang === "nl") return `/nl/brazilie/${citySlug}`;
  return `/brazil/${citySlug}`;
}

export function cityGuideEnabledLanguages(
  city: CityGuideContent | null | undefined,
) {
  if (Array.isArray(city?.enabledLanguages)) {
    return Array.from(
      new Set(
        city.enabledLanguages.filter(
          (lang): lang is CityGuideLang => ["en", "pt", "nl"].includes(lang),
        ),
      ),
    );
  }

  return Array.from(
    new Set(
      (city?.primaryHost?.languages || [])
        .map((entry) => entry.language)
        .filter(
          (lang): lang is CityGuideLang =>
            typeof lang === "string" && ["en", "pt", "nl"].includes(lang),
        ),
    ),
  );
}

export function cityGuideIsPublic(city: CityGuideContent | null | undefined) {
  if (!city || cityGuideStatus(city) !== "live") return false;
  if (!city.primaryHost || city.primaryHost.status !== "published") return false;

  const values = city as Record<string, unknown>;
  const localizedContent = (["en", "pt", "nl"] as const).some(
    (lang) =>
      (typeof values[`headline_${lang}`] === "string" &&
        Boolean((values[`headline_${lang}`] as string).trim())) ||
      (typeof values[`intro_${lang}`] === "string" &&
        Boolean((values[`intro_${lang}`] as string).trim())) ||
      (Array.isArray(values[`introBlocks_${lang}`]) &&
        (values[`introBlocks_${lang}`] as unknown[]).length > 0),
  );

  return Boolean(
    localizedContent ||
      city.mapPlaces?.length ||
      city.recommendationGuides?.length ||
      city.sidebarCards?.length,
  );
}

export function cityGuideLanguageEnabled(
  city: CityGuideContent | null | undefined,
  citySlug: string,
  lang: CityGuideLang,
) {
  return cityGuideEnabledLanguages(city).includes(lang);
}

export function cityGuideAlternates(
  citySlug: string,
  city?: CityGuideContent | null,
) {
  return Object.fromEntries(
    cityGuideEnabledLanguages(city).map((lang) => [
      lang,
      `${cityGuideSiteUrl}${cityGuidePath(lang, citySlug)}`,
    ]),
  );
}

export function localizedCityGuideText(
  city: CityGuideContent | null | undefined,
  field: "name" | "headline" | "intro" | "cta",
  lang: CityGuideLang,
) {
  if (!city) return "";

  const values = city as Record<string, unknown>;
  const localized = values[`${field}_${lang}`];
  const english = values[`${field}_en`];

  if (typeof localized === "string" && localized.trim()) return localized;
  if (typeof english === "string" && english.trim()) return english;

  return "";
}

export function localizedCityGuideList(
  city: CityGuideContent | null | undefined,
  field: "introBlocks",
  lang: CityGuideLang,
) {
  if (!city) return [];

  const values = city as Record<string, unknown>;
  const localized = values[`${field}_${lang}`];
  const english = values[`${field}_en`];

  if (Array.isArray(localized) && localized.length) {
    return localized.filter((item): item is string => typeof item === "string");
  }

  if (Array.isArray(english)) {
    return english.filter((item): item is string => typeof item === "string");
  }

  return [];
}

export function cityGuideName(
  city: CityGuideContent | null | undefined,
  lang: CityGuideLang,
  citySlug: string,
) {
  return (
    localizedCityGuideText(city, "name", lang) ||
    citySlug
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

export function cityGuideStatus(city: CityGuideContent | null | undefined) {
  return city?.guideStatus || "live";
}

export function providerProfilePath(lang: CityGuideLang, providerSlug: string) {
  if (lang === "pt") return `/pt/profissionais/${providerSlug}`;
  if (lang === "nl") return `/nl/professionals/${providerSlug}`;
  return `/providers/${providerSlug}`;
}

export function publishedCityGuides(cities: CityGuideContent[]) {
  return cities.filter(
    (city) => Boolean(city.slug?.current) && cityGuideIsPublic(city),
  );
}

export function discoverableCityGuides(cities: CityGuideContent[]) {
  return cities.filter(
    (city) =>
      Boolean(city.slug?.current) && cityGuideStatus(city) !== "hidden",
  );
}

export function cityGuideGlobeCities(
  cities: CityGuideContent[],
  lang: CityGuideLang,
): CityGuideGlobeCity[] {
  return discoverableCityGuides(cities).flatMap((city) => {
    const citySlug = city.slug?.current;
    const lat = city.latitude;
    const lng = city.longitude;

    if (!citySlug || typeof lat !== "number" || typeof lng !== "number") {
      return [];
    }

    const name = cityGuideName(city, lang, citySlug);
    const pinStatus: CityGuideGlobeCity["status"] =
      cityGuideIsPublic(city) ? "live" : "comingSoon";

    return [
      {
        lat,
        lng,
        name,
        status: pinStatus,
        href: pinStatus === "live" ? cityGuidePath(lang, citySlug) : undefined,
        ariaLabel:
          pinStatus === "comingSoon"
            ? `${name} city guide coming soon`
            : `Open ${name} city guide`,
      },
    ];
  });
}

export function cityGuideDisplayContent(
  city: CityGuideContent | null,
  _citySlug: string,
) {
  void _citySlug;
  return city;
}

export function cityGuideTitle({
  city,
  lang,
  citySlug,
}: {
  city: CityGuideContent | null | undefined;
  lang: CityGuideLang;
  citySlug: string;
}) {
  const cityName = cityGuideName(city, lang, citySlug);

  if (lang === "pt") return `Guia local de ${cityName}`;
  if (lang === "nl") return `${cityName} lokale gids`;
  return `${cityName} City Guide`;
}

export function cityGuideDescription({
  city,
  lang,
  citySlug,
}: {
  city: CityGuideContent | null | undefined;
  lang: CityGuideLang;
  citySlug: string;
}) {
  const intro = localizedCityGuideText(city, "intro", lang);

  return intro || undefined;
}

export function cityGuideMetadata({
  city,
  lang,
  citySlug,
}: {
  city: CityGuideContent | null;
  lang: CityGuideLang;
  citySlug: string;
}): Metadata {
  const title = cityGuideTitle({ city, lang, citySlug });
  const description = cityGuideDescription({ city, lang, citySlug });
  const url = `${cityGuideSiteUrl}${cityGuidePath(lang, citySlug)}`;

  return {
    title,
    ...(description ? { description } : {}),
    alternates: {
      canonical: url,
      languages: {
        ...cityGuideAlternates(citySlug, city),
        "x-default": `${cityGuideSiteUrl}${cityGuidePath("en", citySlug)}`,
      },
    },
    openGraph: {
      title: `${title} | Home in the City`,
      ...(description ? { description } : {}),
      url,
      siteName: "Home in the City",
      locale: cityGuideLocale[lang],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Home in the City`,
      ...(description ? { description } : {}),
    },
  };
}
