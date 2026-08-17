import type { InterpreterLanguage } from "@/app/lib/interpreterTypes";

export type CityInterpreterProvider = {
  _id: string;
  name?: string;
  slug?: { current?: string };
  roles?: string[];
  primaryRole?: string;
  verificationStatus?: string;
  languages?: Array<{ language?: string; services?: string[] }>;
  mainPhoto?: { alt?: string; asset?: { url?: string } };
};

export type CityInterpreterCoverage = {
  _id: string;
  _updatedAt?: string;
  name_en?: string;
  name_pt?: string;
  name_nl?: string;
  slug?: { current?: string };
  country?: string;
  primaryHost?: { _id?: string; name?: string; slug?: { current?: string }; status?: string; roles?: string[]; primaryRole?: string };
  interpreters?: CityInterpreterProvider[];
  servicePage?: { _id?: string; _rev?: string; _updatedAt?: string; slug?: { current?: string } };
};

export function cityInterpreterName(city: CityInterpreterCoverage, lang: InterpreterLanguage) {
  return city[`name_${lang}`] || city.name_en || city.name_pt || city.name_nl || "Untitled city";
}

export function interpreterLanguages(provider: CityInterpreterProvider) {
  return Array.from(
    new Set(
      (provider.languages || [])
        .map((entry) => entry.language)
        .filter((language): language is string => Boolean(language)),
    ),
  );
}

export function isPrimaryInterpreter(
  city: CityInterpreterCoverage,
  provider: CityInterpreterProvider,
) {
  return city.primaryHost?._id === provider._id;
}

export function cityInterpreterPath(citySlug: string, lang: InterpreterLanguage) {
  if (lang === "pt") return `/pt/interprete/${citySlug}`;
  if (lang === "nl") return `/nl/tolk/${citySlug}`;
  return `/interpreter/${citySlug}`;
}

const interpreterCopy = {
  en: {
    title: (city: string) => `Interpreter services in ${city}`,
    description: (city: string, languages: string) =>
      languages
        ? `Interpreter services in ${city}, with support in ${languages}.`
        : `Interpreter services in ${city}.`,
  },
  pt: {
    title: (city: string) => `Serviços de interpretação em ${city}`,
    description: (city: string, languages: string) =>
      languages
        ? `Serviços de interpretação em ${city}, com atendimento em ${languages}.`
        : `Serviços de interpretação em ${city}.`,
  },
  nl: {
    title: (city: string) => `Tolkdiensten in ${city}`,
    description: (city: string, languages: string) =>
      languages
        ? `Tolkdiensten in ${city}, met ondersteuning in ${languages}.`
        : `Tolkdiensten in ${city}.`,
  },
} as const;

export function automaticCityInterpreterTitle(
  city: CityInterpreterCoverage,
  lang: InterpreterLanguage,
) {
  return interpreterCopy[lang].title(cityInterpreterName(city, lang));
}

export function automaticCityInterpreterDescription(
  city: CityInterpreterCoverage,
  lang: InterpreterLanguage,
) {
  const languages = Array.from(
    new Set((city.interpreters || []).flatMap(interpreterLanguages)),
  ).join(", ");
  return interpreterCopy[lang].description(cityInterpreterName(city, lang), languages);
}

export function hasInterpreterRole(provider: {
  roles?: string[];
  primaryRole?: string;
} | null | undefined) {
  return Boolean(
    provider &&
      (provider.primaryRole === "interpreter" || provider.roles?.includes("interpreter")),
  );
}
