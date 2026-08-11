import type { CityGuideLang } from "@/app/lib/cityGuides";

export const cityInformationCardSections = [
  "about",
  "explore",
  "fromHost",
] as const;

export type CityInformationCardSection =
  (typeof cityInformationCardSections)[number];

export type CityInformationCard = {
  _key?: string;
  section?: CityInformationCardSection;
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
  image?: {
    _type?: string;
    alt?: string;
    asset?: { _type?: string; _ref?: string; url?: string };
    crop?: { top?: number; bottom?: number; left?: number; right?: number };
    hotspot?: { x?: number; y?: number; height?: number; width?: number };
  };
};

export function localizedInformationCardField(
  card: CityInformationCard,
  field: "title" | "text" | "button" | "href",
  lang: CityGuideLang,
) {
  const values = card as Record<string, unknown>;
  const localized = values[`${field}_${lang}`];
  const english = values[`${field}_en`];

  if (typeof localized === "string" && localized.trim()) return localized.trim();
  if (typeof english === "string" && english.trim()) return english.trim();
  return "";
}
