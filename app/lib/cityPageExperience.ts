import type { CityGuideLang } from "@/app/lib/cityGuides";

export const cityPageExperienceFieldNames = [
  "aboutTitle",
  "livingTitle",
  "livingIntroduction",
  "livingBody",
  "exploreTitle",
  "exploreIntroduction",
  "favoritesTitle",
  "favoritesIntroduction",
  "fromHostIntroduction",
] as const;

export type CityPageExperienceField =
  (typeof cityPageExperienceFieldNames)[number];

export type CityPageExperienceLocale = Partial<
  Record<CityPageExperienceField, string>
>;

export type LivingServicePresentationLocale = {
  title?: string;
  description?: string;
  buttonLabel?: string;
};

export type CityPageExperienceImage = {
  _type?: string;
  alt?: string;
  asset?: { _type?: string; _ref?: string; url?: string };
  crop?: { top?: number; bottom?: number; left?: number; right?: number };
  hotspot?: { x?: number; y?: number; height?: number; width?: number };
};

export type LivingServicePresentation = Partial<
  Record<CityGuideLang, LivingServicePresentationLocale>
> & {
  image?: CityPageExperienceImage;
};

export type LivingServicePresentations = {
  interpreter?: LivingServicePresentation;
  realEstate?: LivingServicePresentation;
};

export type CityPageExperience = Partial<
  Record<CityGuideLang, CityPageExperienceLocale>
> & {
  livingServices?: LivingServicePresentations;
};

export function cityPageExperienceLocale(
  experience: CityPageExperience | null | undefined,
  lang: CityGuideLang,
) {
  return experience?.[lang] || {};
}
