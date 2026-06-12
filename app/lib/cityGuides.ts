import type { Metadata } from "next";

export type CityGuideLang = "en" | "pt" | "nl";
export type CityGuideStatus = "live" | "comingSoon" | "hidden";

export type CityGuideImage = {
  alt?: string;
  asset?: {
    url?: string;
  };
};

export type CityGuideMapPlace = {
  name: string;
  name_en?: string;
  name_pt?: string;
  name_nl?: string;
  categoryPreset?: string;
  category?: string;
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
  name_en?: string;
  name_pt?: string;
  name_nl?: string;
  slug?: {
    current?: string;
  };
  guideStatus?: CityGuideStatus;
  latitude?: number;
  longitude?: number;
  primaryHost?: CityGuideProvider | null;
  headline_en?: string;
  headline_pt?: string;
  headline_nl?: string;
  intro_en?: string;
  intro_pt?: string;
  intro_nl?: string;
  introBlocks_en?: string[];
  introBlocks_pt?: string[];
  introBlocks_nl?: string[];
  mapPlaces?: CityGuideMapPlace[];
  sidebarCards?: CityGuideSidebarCard[];
  cta_en?: string;
  cta_pt?: string;
  cta_nl?: string;
};

export type CityGuideGlobeCity = {
  lat: number;
  lng: number;
  name: string;
  status: "live" | "comingSoon";
  href: string;
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

export function cityGuideAlternates(citySlug: string) {
  return {
    en: `${cityGuideSiteUrl}${cityGuidePath("en", citySlug)}`,
    pt: `${cityGuideSiteUrl}${cityGuidePath("pt", citySlug)}`,
    nl: `${cityGuideSiteUrl}${cityGuidePath("nl", citySlug)}`,
  };
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

export function isPortoAlegreGuide(citySlug: string) {
  return citySlug === "porto-alegre";
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
    (city) => Boolean(city.slug?.current) && cityGuideStatus(city) !== "hidden",
  );
}

export function cityGuideGlobeCities(
  cities: CityGuideContent[],
  lang: CityGuideLang,
): CityGuideGlobeCity[] {
  return publishedCityGuides(cities).flatMap((city) => {
    const citySlug = city.slug?.current;
    const lat = city.latitude;
    const lng = city.longitude;

    if (!citySlug || typeof lat !== "number" || typeof lng !== "number") {
      return [];
    }

    const name = cityGuideName(city, lang, citySlug);
    const status = cityGuideStatus(city);
    const pinStatus: CityGuideGlobeCity["status"] =
      status === "comingSoon" ? "comingSoon" : "live";

    return [
      {
        lat,
        lng,
        name,
        status: pinStatus,
        href: cityGuidePath(lang, citySlug),
        ariaLabel:
          status === "comingSoon"
            ? `${name} city guide coming soon`
            : `Open ${name} city guide`,
      },
    ];
  });
}

export function cityGuideDisplayContent(
  city: CityGuideContent | null,
  citySlug: string,
) {
  if (!city || !isPortoAlegreGuide(citySlug)) return city;

  return {
    ...city,
    headline_en: undefined,
    headline_pt: undefined,
    headline_nl: undefined,
    intro_en: undefined,
    intro_pt: undefined,
    intro_nl: undefined,
  };
}

const fallbackDescriptions: Record<CityGuideLang, (cityName: string) => string> = {
  en: (cityName) =>
    `A Home in the City guide for ${cityName}, with local context, practical support and curated places as they are added.`,
  pt: (cityName) =>
    `Um guia da Home in the City para ${cityName}, com contexto local, apoio prático e lugares selecionados conforme forem adicionados.`,
  nl: (cityName) =>
    `Een Home in the City-gids voor ${cityName}, met lokale context, praktische hulp en geselecteerde plekken zodra ze worden toegevoegd.`,
};

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

  if (isPortoAlegreGuide(citySlug)) {
    if (lang === "pt") return "Guia Local de Porto Alegre";
    if (lang === "nl") return "Porto Alegre Lokale Gids";
    return "Porto Alegre City Guide";
  }

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
  const cityName = cityGuideName(city, lang, citySlug);
  const intro = localizedCityGuideText(city, "intro", lang);

  if (intro) return intro;
  if (isPortoAlegreGuide(citySlug)) {
    if (lang === "pt") {
      return "Guia local de Porto Alegre com restaurantes, locais para negócios, espaços culturais, caminhadas, informações práticas, moradia e contatos confiáveis.";
    }
    if (lang === "nl") {
      return "Een lokale gids voor Porto Alegre met restaurants, zakelijke locaties, culturele plekken, wandelroutes, praktische informatie, verblijf en vertrouwde contacten.";
    }
    return "A hosted Porto Alegre city guide with restaurants, business locations, cultural venues, walks, practical information, housing and trusted local contacts.";
  }

  return fallbackDescriptions[lang](cityName);
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
    description,
    alternates: {
      canonical: url,
      languages: cityGuideAlternates(citySlug),
    },
    openGraph: {
      title: `${title} | Home in the City`,
      description,
      url,
      siteName: "Home in the City",
      locale: cityGuideLocale[lang],
      type: "website",
    },
  };
}
